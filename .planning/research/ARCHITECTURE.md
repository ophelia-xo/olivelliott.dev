# Architecture Research

**Domain:** Next.js 15 App Router portfolio site (static-first, dark-theme, MDX-driven case studies, tagged projects, resume HTML + PDF)
**Researched:** 2026-04-18
**Confidence:** HIGH

---

## Executive Summary

This is a **content site with a small amount of interactive polish**, not a web app. The architecture should be optimized for:

1. **Static-first rendering** — every route prerenders at build time. No server data, no DB, no auth. The entire site is files in a repo.
2. **Type-safe content** — projects are authored as MDX with a typed frontmatter schema validated at build time. No CMS, no runtime content fetching.
3. **Single source of truth per artifact** — one resume data file feeds both `/resume` HTML and the downloadable PDF. One project record feeds card, detail page, tag index, and related-project rails.
4. **Client islands for motion, server default everywhere else** — RSC for all content; `'use client'` only where an interaction or animation requires it.
5. **Tokens as CSS variables (Tailwind v4 `@theme`)** — the design system lives in CSS, not JS config. Tailwind utilities compile from those variables, so tokens are reachable from MDX, inline styles, and motion values equally.

**Load-bearing decisions:**
- Content pipeline: **Content Collections** (drop-in Contentlayer successor, RSC-safe, Zod-typed) over plain `@next/mdx`
- Resume source of truth: **TypeScript object → shared RSC view → `react-to-print` / print-CSS for PDF** (primary), with Puppeteer route handler as the escape hatch
- Motion: **single `MotionProvider` client boundary** high in the tree wrapping `LazyMotion` + `MotionConfig reducedMotion="user"` so every downstream motion component inherits reduced-motion gating for free
- Tags: **derived index**, not a separate store — tags are a field on each project; `lib/projects.ts` exposes `getAllTags()`, `getProjectsByTag(tag)`, `getRelatedProjects(slug)` as pure functions over the collection

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Build Time (Vercel)                      │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────────┐     │
│  │ content/     │──▶│ Content      │──▶│ .content-         │     │
│  │ projects/    │   │ Collections  │   │ collections/      │     │
│  │ *.mdx        │   │ (Zod schema) │   │ generated/       │     │
│  └──────────────┘   └──────────────┘   └────────┬─────────┘     │
│  ┌──────────────┐                               │               │
│  │ content/     │──▶ resume.ts (TS object) ─────┤               │
│  │ resume.ts    │                               ▼               │
│  └──────────────┘                    ┌──────────────────┐       │
│                                      │ generateStatic   │       │
│                                      │ Params / prerender│       │
│                                      └────────┬─────────┘       │
├───────────────────────────────────────────────┼─────────────────┤
│                        Static HTML + RSC Payload                │
├───────────────────────────────────────────────┼─────────────────┤
│  app/                                          ▼                │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────────┐ ┌─────────┐ │
│  │ (site)/  │ │ (site)/  │ │ (site)/projects/     │ │ resume/ │ │
│  │ page     │ │ about    │ │ [slug]/page.tsx      │ │ page    │ │
│  │ .tsx     │ │ /page    │ │  (RSC + MDX)         │ │ .tsx    │ │
│  └──────────┘ └──────────┘ └──────────────────────┘ └────┬────┘ │
│                                                          │      │
│                                                          ▼      │
│                                          ┌─────────────────────┐│
│                                          │ app/resume/pdf/     ││
│                                          │ route.ts (Puppeteer)││
│                                          │ — optional escape   ││
│                                          └─────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│                    Client Islands (use client)                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  <MotionProvider> (LazyMotion + MotionConfig reducedMotion) │
│  │   ├─ <TagFilter>           (URL-synced search params)    │   │
│  │   ├─ <ProjectCard>         (hover/tap motion)            │   │
│  │   ├─ <HeroMarquee>         (scroll-driven)               │   │
│  │   └─ <ThemeEasterEggs>     (keyboard/konami, optional)   │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Implementation |
|-----------|----------------|----------------|
| `content/projects/*.mdx` | Authoritative source for every project (hero + secondary) | MDX with typed frontmatter |
| `content/resume.ts` | Authoritative source for resume (jobs, education, skills, links) | Plain TS object, Zod-validated |
| `lib/content.ts` | Thin facade over Content Collections output — public query API | Pure functions, no side effects |
| `lib/projects.ts` | Project-specific queries (byTag, related, heroes, bySlug) | Pure functions over collection |
| `app/(site)/` route group | Public marketing surface with shared layout (nav, footer, motion provider) | RSC by default |
| `app/(site)/projects/[slug]/page.tsx` | Renders an MDX case study with typed frontmatter | RSC + static params |
| `app/resume/page.tsx` | Renders HTML resume from `content/resume.ts` | RSC |
| `app/resume/pdf/route.ts` | Optional — Puppeteer-based PDF endpoint as escape hatch if print-CSS insufficient | Route handler |
| `components/ui/*` | Design-system primitives (Button, Link, Tag, Card shell) | Dumb RSC when possible, `'use client'` when stateful |
| `components/motion/*` | Client-only motion wrappers (FadeIn, ScrollReveal, MagneticHover) | `'use client'`, consume `MotionProvider` |
| `components/site/*` | Site-specific composites (ProjectCard, Hero, TagFilter, ResumeSection) | Mix of RSC + client islands |
| `styles/tokens.css` | Design tokens via `@theme` | CSS custom properties |

---

## Recommended Project Structure

```
portfolio/
├── app/
│   ├── layout.tsx                 # Root: <html>, font, MotionProvider, metadata base
│   ├── globals.css                # Tailwind v4 @import + @theme tokens
│   ├── not-found.tsx              # 404 (shared)
│   ├── robots.ts                  # Generated robots.txt
│   ├── sitemap.ts                 # Generated sitemap (projects + static pages)
│   ├── (site)/                    # Route group — shared marketing layout
│   │   ├── layout.tsx             # Nav + Footer + container
│   │   ├── page.tsx               # / — home (hero + hero-tier grid + tag surface)
│   │   ├── about/
│   │   │   └── page.tsx           # /about
│   │   ├── projects/
│   │   │   ├── page.tsx           # /projects — full grid with TagFilter
│   │   │   └── [slug]/
│   │   │       ├── page.tsx       # /projects/[slug] — MDX case study
│   │   │       └── opengraph-image.tsx  # Dynamic OG per project
│   │   └── contact/
│   │       └── page.tsx           # /contact (links to github/email/linkedin)
│   ├── resume/
│   │   ├── layout.tsx             # Minimal layout (no nav) — print-friendly
│   │   ├── page.tsx               # /resume HTML render
│   │   └── pdf/
│   │       └── route.ts           # Optional: GET /resume/pdf via Puppeteer
│   └── api/                       # (empty in v1 — no dynamic APIs needed)
│
├── content/
│   ├── projects/                  # One MDX file per project
│   │   ├── myco.mdx               # Hero tier
│   │   ├── fathom.mdx             # Hero tier
│   │   ├── agenda-keeper.mdx      # Hero tier (private)
│   │   ├── trade-bot.mdx          # Secondary (private)
│   │   ├── stemz.mdx              # Secondary
│   │   └── aktiga.mdx             # Secondary (private)
│   └── resume.ts                  # Typed resume data (single source of truth)
│
├── components/
│   ├── ui/                        # Design-system primitives (framework-agnostic)
│   │   ├── button.tsx
│   │   ├── link.tsx               # Wraps next/link, handles external
│   │   ├── tag.tsx                # Single tag pill
│   │   └── prose.tsx              # Typography wrapper for MDX body
│   ├── motion/                    # Motion wrappers (all 'use client')
│   │   ├── motion-provider.tsx    # LazyMotion + MotionConfig
│   │   ├── fade-in.tsx
│   │   ├── scroll-reveal.tsx
│   │   └── magnetic-hover.tsx
│   ├── mdx/                       # MDX component overrides
│   │   ├── mdx-components.tsx     # useMDXComponents() export
│   │   ├── callout.tsx
│   │   ├── figure.tsx             # <Figure> with caption + alt
│   │   └── gallery.tsx            # <Gallery> for screenshots
│   └── site/                      # Composite site components
│       ├── nav.tsx
│       ├── footer.tsx
│       ├── project-card.tsx
│       ├── project-grid.tsx
│       ├── tag-filter.tsx         # URL-synced search param filter
│       ├── hero.tsx
│       ├── thesis.tsx             # Thesis/positioning block (home)
│       └── resume/
│           ├── resume-layout.tsx  # Shared by /resume and PDF
│           ├── resume-section.tsx
│           └── print-styles.tsx   # Injects print CSS
│
├── lib/
│   ├── content.ts                 # Re-exports typed collection + helpers
│   ├── projects.ts                # getProject, getHeroProjects, getProjectsByTag, getRelatedProjects
│   ├── tags.ts                    # Tag metadata (label, description, slug mapping)
│   ├── resume.ts                  # Resume loader + Zod schema
│   ├── seo.ts                     # Shared metadata helpers (Metadata objects)
│   ├── utils.ts                   # cn(), formatDate, slugify
│   └── schemas.ts                 # Shared Zod schemas (Project, Resume, Tag)
│
├── hooks/                         # Custom React hooks (all 'use client')
│   ├── use-reduced-motion.ts      # Read-only echo of prefers-reduced-motion
│   ├── use-mounted.ts
│   └── use-tag-filter.ts          # URL search param ↔ local state
│
├── styles/
│   ├── tokens.css                 # @theme { --color-*, --font-*, --space-*, --motion-* }
│   ├── typography.css             # Prose defaults for MDX
│   └── print.css                  # Resume print styles (@media print)
│
├── public/
│   ├── fonts/                     # Self-hosted variable fonts
│   ├── images/
│   │   └── projects/              # Per-project screenshots (slug-based folders)
│   └── og/                        # Static OG fallbacks
│
├── content-collections.config.ts  # Content Collections schema + transforms
├── next.config.ts
├── tsconfig.json
├── .planning/                     # GSD planning (not deployed)
└── package.json
```

### Structure Rationale

- **`app/(site)/` route group:** The marketing surface (home, about, projects, contact) shares a nav/footer/motion shell. `/resume` is deliberately outside the group so it can have a stripped layout ideal for print. The parentheses mean the group does not appear in the URL.
- **`content/` at the root, not under `app/` or `src/`:** Content is data, not routes. Keeping it at the root lets the same MDX files be consumed by Content Collections without any App Router coupling, and makes "where do I edit a project?" obvious.
- **`components/` split by role, not by feature:** `ui/` (primitive, reusable), `motion/` (client-only animated), `mdx/` (only valid inside MDX), `site/` (portfolio-specific composites). This beats feature-folders at this scale — there are only ~6 projects and a handful of pages.
- **`lib/` is pure functions only:** No React, no server actions in v1. This lets `lib/projects.ts` be called from RSC, route handlers, and build scripts (e.g., sitemap generation) identically.
- **`hooks/` separate from `lib/`:** Enforces the rule that anything in `hooks/` is `'use client'` and anything in `lib/` is isomorphic.
- **`styles/tokens.css` separate from `globals.css`:** Tokens are the design-system contract; globals are the boring plumbing (resets, base typography). Keeping them separate means a designer can open one file to tune the system.
- **No `src/` directory:** Next.js supports both with and without. Skipping `src/` keeps import paths shorter (`@/components/...` vs `@/src/components/...`) and matches the Vercel portfolio starter convention. `src/` pays off at scale the portfolio won't hit.

---

## Content Model

### Project (per MDX file)

```typescript
// content-collections.config.ts (excerpt)
import { defineCollection, defineConfig } from '@content-collections/core'
import { compileMDX } from '@content-collections/mdx'
import { z } from 'zod'

const TAGS = [
  'local-first',
  'autonomous',
  'open-source',
  'ai',
  'agents',
  'distributed',
  'typescript',
  'python',
  'saas',
  'cli',
  'code-private',
] as const

const projects = defineCollection({
  name: 'projects',
  directory: 'content/projects',
  include: '*.mdx',
  schema: (z) => ({
    // Identity
    slug: z.string(),                    // URL slug — matches filename
    title: z.string(),
    tagline: z.string().max(140),        // One-line pitch for cards
    year: z.number(),                    // Or z.string() for "2024–present"

    // Surface/sorting
    heroTier: z.boolean().default(false), // Myco, Fathom, Agenda Keeper = true
    order: z.number().default(100),       // Hero grid order (lower = earlier)
    status: z.enum(['active', 'archived', 'paused']).default('active'),
    visibility: z.enum(['public', 'private']),  // Drives "code private" tag + hides repo link

    // Classification
    tags: z.array(z.enum(TAGS)),
    stack: z.array(z.string()),          // ["TypeScript", "SQLite", "Ollama"]

    // Links (all optional — filtered by visibility)
    links: z.object({
      repo: z.string().url().optional(),
      live: z.string().url().optional(),
      docs: z.string().url().optional(),
      npm: z.string().url().optional(),
    }).default({}),

    // Media
    hero: z.object({
      src: z.string(),                   // /images/projects/{slug}/hero.png
      alt: z.string(),
    }),
    gallery: z.array(z.object({
      src: z.string(),
      alt: z.string(),
      caption: z.string().optional(),
    })).default([]),

    // Case-study outcomes (authored in frontmatter for card surfacing;
    //  body of MDX holds the long-form narrative)
    outcomes: z.array(z.string()).max(5).default([]),

    // SEO
    description: z.string().max(160),
    ogImage: z.string().optional(),      // Overrides opengraph-image.tsx
  }),
  transform: async (doc, ctx) => {
    const body = await compileMDX(ctx, doc)
    return {
      ...doc,
      body,
      // Derived: private projects auto-get the "code-private" tag
      tags: doc.visibility === 'private'
        ? Array.from(new Set([...doc.tags, 'code-private']))
        : doc.tags,
    }
  },
})

export default defineConfig({ collections: [projects] })
```

### Resume (single source of truth)

```typescript
// content/resume.ts
import { z } from 'zod'

export const ResumeSchema = z.object({
  header: z.object({
    name: z.string(),
    role: z.string(),
    location: z.string(),
    email: z.string().email(),
    links: z.array(z.object({ label: z.string(), href: z.string().url() })),
  }),
  summary: z.string(),
  experience: z.array(z.object({
    company: z.string(),
    role: z.string(),
    period: z.string(),           // "2024 — present"
    location: z.string().optional(),
    bullets: z.array(z.string()),
    stack: z.array(z.string()).optional(),
  })),
  selectedWork: z.array(z.object({
    projectSlug: z.string(),      // References content/projects — lets resume link to case studies
    context: z.string(),
  })).optional(),
  skills: z.object({
    languages: z.array(z.string()),
    systems: z.array(z.string()),
    tools: z.array(z.string()),
  }),
  education: z.array(z.object({
    school: z.string(),
    degree: z.string(),
    period: z.string(),
  })),
})

export type Resume = z.infer<typeof ResumeSchema>

export const resume: Resume = {
  header: { /* ... */ },
  summary: '...',
  experience: [ /* ... */ ],
  // ...
}
```

**Why TS, not YAML or JSON:** TypeScript gives autocomplete, refactor safety, and lets the resume reference other data (e.g., `selectedWork[].projectSlug` can be narrowed to valid slugs). Zod validates at import so a typo fails the build. YAML/JSON adds a parser step with no upside at this scale.

---

## Architectural Patterns

### Pattern 1: RSC-First with Client Islands

**What:** Every page and layout is a React Server Component by default. `'use client'` only appears on leaves that need browser APIs — motion wrappers, the tag filter (URL state), theme toggles, forms.

**When to use:** Always, in App Router. Content sites benefit the most because 95% of the tree is pure output.

**Trade-offs:**
- Upside: smaller JS bundle, faster TTFB, simpler data flow (content fetched in RSC, no `useEffect`).
- Cost: must be explicit about the client boundary. Passing non-serializable props (functions, class instances) across the boundary errors.

**Example:**
```tsx
// app/(site)/projects/[slug]/page.tsx — RSC, no 'use client'
import { getProject, getRelatedProjects } from '@/lib/projects'
import { notFound } from 'next/navigation'
import { ProjectHeader } from '@/components/site/project-header'
import { RelatedRail } from '@/components/site/related-rail'
import { FadeIn } from '@/components/motion/fade-in' // client island

export async function generateStaticParams() {
  const { projects } = await import('@/lib/projects')
  return projects.getAll().map((p) => ({ slug: p.slug }))
}

export default async function ProjectPage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()

  const related = getRelatedProjects(slug, 3)
  const MDXContent = project.body

  return (
    <article>
      <ProjectHeader project={project} />
      <FadeIn>
        <MDXContent components={{ /* see Pattern 3 */ }} />
      </FadeIn>
      <RelatedRail projects={related} />
    </article>
  )
}
```

### Pattern 2: Single Motion Provider at the Route-Group Layout

**What:** One `'use client'` wrapper high in the tree combines `LazyMotion` (tree-shakes Framer Motion to ~5kb) and `MotionConfig reducedMotion="user"` (auto-respects OS preference). Every motion component downstream inherits both — no prop-drilling, no per-component reduced-motion checks.

**When to use:** Any site with motion. This is the standard Framer Motion / Motion pattern for Next.js App Router.

**Trade-offs:**
- Upside: reduced-motion is handled globally; bundle stays small; individual motion components stay dumb.
- Cost: the motion provider is a client component, so everything under it that imports motion is also client. Mitigate by keeping the provider at the route-group layout, not the root layout — letting pages like `/resume` opt out entirely.

**Example:**
```tsx
// components/motion/motion-provider.tsx
'use client'
import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  )
}

// app/(site)/layout.tsx — RSC that renders a client provider
import { MotionProvider } from '@/components/motion/motion-provider'
import { Nav } from '@/components/site/nav'
import { Footer } from '@/components/site/footer'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <MotionProvider>
      <Nav />
      <main>{children}</main>
      <Footer />
    </MotionProvider>
  )
}
```

Individual motion components become trivial:
```tsx
// components/motion/fade-in.tsx
'use client'
import { m } from 'motion/react' // note: `m`, not `motion` — LazyMotion requires it

export function FadeIn({ children }: { children: React.ReactNode }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.2, 0.65, 0.3, 0.9] }}
    >
      {children}
    </m.div>
  )
}
```

When a user has `prefers-reduced-motion: reduce`, the `y: 12 → 0` transform is suppressed automatically; opacity still fades.

### Pattern 3: Tokens-as-CSS-Variables via Tailwind v4 `@theme`

**What:** Define every design token in `styles/tokens.css` inside `@theme { ... }`. Tailwind v4 generates utility classes (`bg-accent`, `text-muted`, `space-lg`) from those variables AND exposes them as raw CSS custom properties for inline use.

**When to use:** Every Tailwind v4 project. This is the v4 way.

**Trade-offs:**
- Upside: tokens are the source of truth for utilities, arbitrary values, inline styles, and motion (e.g., `transition: all var(--motion-base)`). No `tailwind.config.ts` to duplicate values. Runtime theme-switching is a class swap, no rebuild.
- Cost: requires Tailwind v4 (stable since 2025). v3 shops can't adopt directly.

**Example:**
```css
/* app/globals.css */
@import "tailwindcss";
@import "../styles/tokens.css";
@import "../styles/typography.css";

/* styles/tokens.css */
@theme {
  /* Color — dark-only, semantic layer */
  --color-bg:           oklch(14% 0.01 260);   /* near-black with a sliver of cool */
  --color-surface:      oklch(18% 0.012 260);
  --color-surface-2:    oklch(22% 0.015 260);
  --color-text:         oklch(96% 0.005 260);
  --color-text-muted:   oklch(68% 0.012 260);
  --color-border:       oklch(28% 0.015 260);
  --color-accent:       oklch(82% 0.15 145);   /* mycelial green */
  --color-accent-ink:   oklch(12% 0.02 260);

  /* Type scale — modular */
  --font-sans:   "Inter Variable", ui-sans-serif, system-ui;
  --font-mono:   "JetBrains Mono Variable", ui-monospace;
  --font-serif:  "Fraunces Variable", ui-serif;

  --text-xs:   0.75rem;
  --text-sm:   0.875rem;
  --text-base: 1rem;
  --text-lg:   1.125rem;
  --text-xl:   1.375rem;
  --text-2xl:  1.75rem;
  --text-3xl:  2.25rem;
  --text-4xl:  3rem;
  --text-5xl:  4rem;
  --text-hero: clamp(3rem, 8vw, 6rem);

  /* Spacing (4pt base) */
  --spacing: 0.25rem;

  /* Motion */
  --motion-fast: 150ms;
  --motion-base: 280ms;
  --motion-slow: 600ms;
  --ease-standard: cubic-bezier(0.2, 0.65, 0.3, 0.9);
  --ease-emphasized: cubic-bezier(0.12, 0.78, 0.08, 1.0);

  /* Radii */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-2xl: 28px;
}

/* Print resets — resume PDF uses light theme for paper */
@media print {
  :root {
    --color-bg: #fff;
    --color-text: #111;
    --color-text-muted: #444;
    --color-border: #ccc;
    --color-accent: #0a5;
  }
}
```

Now `bg-bg`, `text-muted`, `font-serif`, `duration-[var(--motion-base)]` all work, AND you can write `style={{ transitionDuration: 'var(--motion-base)' }}` in a motion component with zero drift.

### Pattern 4: Derived Tag Index (No Separate Store)

**What:** Tags are a field on each project. The "tag index" is a pure function over the collection, recomputed at build time and cached per-request in the RSC boundary.

**When to use:** Anywhere the content set is small (≤ a few hundred items). At portfolio scale, a hash-map lookup over 6–20 projects is free.

**Trade-offs:**
- Upside: no redundant data; adding a project automatically updates every tag page; no hand-maintained tag lists.
- Cost: if tags grew into the hundreds and each had rich metadata (description, color, parent tag), you'd want a separate `content/tags.ts`. Build that when needed, not before.

**Example:**
```typescript
// lib/projects.ts
import { allProjects } from 'content-collections'

export function getAll() {
  return allProjects
    .filter((p) => p.status !== 'archived')
    .sort((a, b) => a.order - b.order)
}

export function getHeroProjects() {
  return getAll().filter((p) => p.heroTier)
}

export function getProject(slug: string) {
  return allProjects.find((p) => p.slug === slug)
}

export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const p of getAll()) {
    for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1)
  }
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
}

export function getProjectsByTag(tag: string) {
  return getAll().filter((p) => p.tags.includes(tag as never))
}

export function getRelatedProjects(slug: string, limit = 3) {
  const target = getProject(slug)
  if (!target) return []
  return getAll()
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      project: p,
      score: p.tags.filter((t) => target.tags.includes(t)).length,
    }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.project)
}
```

The client `TagFilter` component reads `?tag=foo` from the URL via `useSearchParams` and filters a pre-rendered list — no client-side fetch.

### Pattern 5: Resume HTML + PDF From One RSC View (Print-CSS Primary, Puppeteer Escape Hatch)

**What:** `app/resume/page.tsx` renders the resume as an RSC using `<ResumeLayout />`. A well-authored `@media print` stylesheet lets the same page print to PDF via the browser (or a headless Chrome in CI) with paper-appropriate typography. A dedicated "Download PDF" button triggers print via `window.print()` or links to a generated artifact.

**Primary recommendation: print-CSS + client-side `window.print()`**, with a build-time Puppeteer generator producing `/public/resume.pdf` on CI as a deterministic fallback. This is the simplest single-source-of-truth setup: **one React tree renders both the screen view and the PDF**; `@media print` handles the paper-specific shifts (color inversion, hide nav, page-break rules).

**When to use:** Always, unless the PDF needs layout the browser can't render (complex columns, ligature-heavy print typography). Even then, print-CSS gets you 95% of the way.

**Trade-offs:**

| Approach | Pro | Con | Verdict |
|----------|-----|-----|---------|
| **Print-CSS + `window.print()`** | True single source — literally the same React tree. Zero extra deps. Tokens flip via `@media print`. | User sees a browser print dialog. Cross-browser PDF output varies slightly. | **Primary** — simplest, most honest SSoT |
| **Puppeteer route handler / build step** | Deterministic output; no user dialog; generates a real `.pdf` file for direct download. | Puppeteer adds ~170MB on Vercel (use `@sparticuz/chromium` on serverless). Slower cold-start. | **Secondary** — use for a `/resume.pdf` download link. Generate at build to avoid runtime cost. |
| **`@react-pdf/renderer`** | Programmatic PDF primitives; precise layout control. | **Separate component tree** from the HTML resume — SSoT is the `resume.ts` data, not the view. Duplicated layout code. Custom font loading pain. | **Reject** — defeats the "one view" goal |

**Recommended implementation:**

```tsx
// components/site/resume/resume-layout.tsx — RSC, rendered by both paths
import type { Resume } from '@/content/resume'

export function ResumeLayout({ data }: { data: Resume }) {
  return (
    <article className="resume mx-auto max-w-[8.5in] px-8 py-12 print:px-0 print:py-0">
      <ResumeHeader header={data.header} />
      <ResumeSummary summary={data.summary} />
      <ResumeExperience items={data.experience} />
      <ResumeSkills skills={data.skills} />
      <ResumeEducation items={data.education} />
    </article>
  )
}

// app/resume/page.tsx
import { resume } from '@/content/resume'
import { ResumeLayout } from '@/components/site/resume/resume-layout'
import { DownloadPdfButton } from '@/components/site/resume/download-pdf-button'

export const metadata = { title: 'Resume — Olive Elliott' }

export default function ResumePage() {
  return (
    <>
      <div className="print:hidden">
        <DownloadPdfButton />
      </div>
      <ResumeLayout data={resume} />
    </>
  )
}
```

```tsx
// components/site/resume/download-pdf-button.tsx
'use client'
export function DownloadPdfButton() {
  return (
    <a href="/resume.pdf" download className="btn">Download PDF</a>
    // Or: <button onClick={() => window.print()}>Print / Save PDF</button>
  )
}
```

```ts
// scripts/generate-resume-pdf.ts — runs in `postbuild`
import puppeteer from 'puppeteer'
import { writeFileSync } from 'node:fs'

async function run() {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('http://localhost:3000/resume?print=1', { waitUntil: 'networkidle0' })
  await page.emulateMediaType('print')
  const pdf = await page.pdf({ format: 'letter', printBackground: true, margin: { top: '0.5in', bottom: '0.5in', left: '0.5in', right: '0.5in' } })
  writeFileSync('./public/resume.pdf', pdf)
  await browser.close()
}
run()
```

This gives us: one data file (`content/resume.ts`), one view component (`ResumeLayout`), one print stylesheet, and a deterministic `/resume.pdf` produced at build time. Editing `resume.ts` updates the HTML, the print view, and the downloadable PDF in one commit.

---

## Data Flow

### Build-Time Content Flow

```
content/projects/myco.mdx        content/resume.ts
        │                                │
        ▼                                ▼
┌───────────────────┐          ┌──────────────────┐
│ Content           │          │ Zod parse        │
│ Collections       │          │ (lib/resume.ts)  │
│ (Zod validate +   │          └────────┬─────────┘
│  compile MDX)     │                   │
└────────┬──────────┘                   │
         │                              │
         ▼                              ▼
┌───────────────────┐          ┌──────────────────┐
│ allProjects: []   │          │ resume: Resume   │
│ (typed, indexed)  │          │ (typed object)   │
└────────┬──────────┘          └────────┬─────────┘
         │                              │
         ▼                              ▼
┌───────────────────────────────────────────────┐
│           lib/projects.ts / lib/resume.ts     │
│    (pure query API — getAll, byTag, etc.)     │
└────────┬──────────────────────────────────────┘
         │
         ▼
┌───────────────────────────────────────────────┐
│   RSC pages consume queries directly          │
│   generateStaticParams() prerenders all slugs │
└───────────────────────────────────────────────┘
```

### Tag Filter Flow (Runtime, Client Island)

```
User clicks tag                Static HTML with all cards
      │                        (already rendered server-side)
      ▼                                   │
router.push(?tag=ai)                      │
      │                                   │
      ▼                                   ▼
useSearchParams()  ─────────▶  TagFilter client component
      │                        filters pre-rendered array
      ▼                                   │
URL updated,                              ▼
shareable, back-button works       Cards with non-matching
                                   tags hidden (CSS / JSX)
```

No network round-trip. The full project list is already in the RSC payload; filtering is a DOM operation.

### Resume Render Flow

```
        content/resume.ts
               │
               ▼
       lib/resume.ts (Zod validate at import)
               │
               ▼
        <ResumeLayout data={resume} />
               │
        ┌──────┴──────┐
        ▼             ▼
  /resume HTML   /resume.pdf
  (RSC render)   (postbuild: Puppeteer → /public)
        │             │
        ▼             ▼
    Browser       Direct download
```

### Request Flow (Project Detail)

```
GET /projects/myco
   │
   ▼
Next.js static route (prerendered at build)
   │
   ├─ HTML + CSS (instant)
   ├─ RSC payload (MDX compiled to RSC)
   └─ Client JS (only motion islands + TagFilter if present)
   │
   ▼
React hydrates islands, MotionProvider boots
   │
   ▼
User scrolls → ScrollReveal triggers → respects reduced-motion
```

---

## Layout Nesting

```
app/layout.tsx (Root)
├── <html lang="en" className={fonts}>
├── <body>
├──   metadata base, favicon, font preload
│
└── app/(site)/layout.tsx
    ├── <MotionProvider>
    ├──   <Nav />
    ├──   {children}
    ├──   <Footer />
    │
    ├── app/(site)/page.tsx                     (/ home)
    ├── app/(site)/about/page.tsx               (/about)
    ├── app/(site)/contact/page.tsx             (/contact)
    ├── app/(site)/projects/page.tsx            (/projects)
    └── app/(site)/projects/[slug]/page.tsx     (/projects/:slug)

app/resume/layout.tsx                           (sibling to (site))
├── Minimal layout — no nav, print-friendly container
└── app/resume/page.tsx                         (/resume)
```

**Why two layouts:** `/resume` intentionally escapes the site chrome. Nav and footer would print awkwardly; the motion provider is useless on a document. Putting `/resume` outside the `(site)` group is the cleanest way to opt out.

---

## Rendering Strategy per Route

| Route | Strategy | Why |
|-------|----------|-----|
| `/` | Static (SSG) | Home content is the hero + hero-project cards — all build-time data |
| `/about` | Static | Pure content |
| `/projects` | Static | Full project list known at build |
| `/projects/[slug]` | Static via `generateStaticParams` + `dynamicParams = false` | All slugs known at build; 404 for anything else |
| `/contact` | Static | Contact info is config, not user-specific |
| `/resume` | Static | Resume data is a TS file |
| `/resume/pdf` (optional) | Build-time artifact in `/public/resume.pdf` | No runtime Puppeteer needed |
| `sitemap.xml` | Static (generated from collection) | Known at build |
| `robots.txt` | Static | Constant |
| `opengraph-image.tsx` per project | Build-time, cached indefinitely | Title/tagline are static per project |

**No ISR, no SSR, no route handlers needed for v1.** If Olive later adds interactive demos or contact form handling, those become isolated islands or route handlers — the static foundation stays.

---

## Integration Points

### External Services

| Service | Integration | Notes |
|---------|-------------|-------|
| Vercel | Deploy target | Push to `main` auto-deploys. Use `output: 'standalone'` not needed — App Router handles it. |
| GitHub | Repo links in project frontmatter | Simple href, no API calls in v1 |
| Self-hosted fonts | `next/font/local` | Avoid runtime font requests; preload variable fonts |
| Plausible / Umami (optional, deferred) | Script tag in root layout | Privacy-respecting; skip in v1 per out-of-scope |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| RSC ↔ Client component | Serializable props only | Motion primitives accept JSON-safe props; never pass functions as children |
| Content Collections ↔ `lib/projects.ts` | Import generated constants | The `content-collections` package generates typed modules at build |
| `lib/` ↔ `app/` | Named imports | Pure functions, no shared state |
| `styles/tokens.css` ↔ everything | CSS custom properties | Reachable from utilities, inline styles, motion values |

---

## Scaling Considerations

| Scale | Adjustments |
|-------|-------------|
| **6–20 projects (v1)** | Current architecture is perfectly sized. All static, no caching needed. |
| **50+ projects** | Add search (build-time index with [pagefind](https://pagefind.app) or [FlexSearch](https://github.com/nextapps-de/flexsearch)). Add tag pages (`/tags/[tag]/page.tsx` with `generateStaticParams`). |
| **Blog / writing section added** | New collection in Content Collections (`content/posts/`). RSS feed via `app/feed.xml/route.ts`. |
| **Interactive demos** | Isolated client components or route handlers. Keep data model unchanged. |
| **Custom CMS** | Abstract `lib/projects.ts` as the interface; swap file-backed for CMS-backed without touching pages. |

### Scaling Priorities

1. **First bottleneck (theoretical):** Large MDX with unoptimized images. Fix: `next/image` with `sizes`, AVIF output, `priority` only on the hero.
2. **Second bottleneck:** Framer Motion bundle if `motion` (not `m`) is imported. Fix: enforce with a lint rule — `LazyMotion strict` throws at runtime if `motion` is used.

---

## Anti-Patterns

### Anti-Pattern 1: Putting content inside `app/`

**What people do:** Author MDX inside `app/projects/myco/page.mdx`, relying on App Router's MDX support.
**Why it's wrong:** Content and routing get tangled. Listing projects (for the home grid, tag filter, related rail) becomes filesystem walking inside `app/`, which fights the framework. Frontmatter typing is weaker. Re-ordering or renaming a project means moving route folders.
**Do instead:** Keep content at `content/projects/*.mdx`, route at `app/(site)/projects/[slug]/page.tsx`. Routing consumes content, content doesn't define routing.

### Anti-Pattern 2: `'use client'` at the route layout

**What people do:** Add `'use client'` to `app/(site)/layout.tsx` so Framer Motion works everywhere.
**Why it's wrong:** Everything under a client layout is client too. You lose RSC benefits across the whole site.
**Do instead:** Keep the layout RSC; render a client `<MotionProvider>` from inside. RSC can render client components; the boundary moves inward, not outward.

### Anti-Pattern 3: Duplicated resume rendering for PDF

**What people do:** Build an `<HtmlResume />` for the page and a separate `<PdfResume />` with `@react-pdf/renderer` primitives.
**Why it's wrong:** Two layouts drift. A tweak to spacing on the HTML resume silently diverges from the PDF. The point of "single source of truth" evaporates.
**Do instead:** One React tree with `@media print` handling the paper-specific transforms. If Puppeteer is in the mix, point it at the same URL.

### Anti-Pattern 4: Per-component `prefers-reduced-motion` checks

**What people do:** Every motion component calls `useReducedMotion()` and branches.
**Why it's wrong:** Boilerplate, easy to forget, inconsistent behavior.
**Do instead:** `<MotionConfig reducedMotion="user">` once at the top. Components stay dumb. Use the hook only when you need bespoke behavior (e.g., swap a horizontal scroll for a vertical stack).

### Anti-Pattern 5: Tag enums scattered across files

**What people do:** Hardcode tag strings in project frontmatter, filter components, and tag chips independently.
**Why it's wrong:** Typos. A project tagged `"opensource"` won't match a filter checking `"open-source"`. The build won't catch it.
**Do instead:** A single `TAGS` const exported from `content-collections.config.ts` (or `lib/tags.ts`), used as the Zod enum for project frontmatter AND the source for tag UIs. Typos fail the build.

### Anti-Pattern 6: `next/dynamic` with `ssr: false` for every animated component

**What people do:** Wrap every motion wrapper in `dynamic(..., { ssr: false })` to "avoid hydration mismatches."
**Why it's wrong:** Kills streaming, adds layout shift, and is rarely necessary when `MotionConfig` + `LazyMotion` are set up correctly.
**Do instead:** Trust the client boundary. Use `dynamic(ssr: false)` only for components that touch `window` during render (canvas, WebGL).

### Anti-Pattern 7: Linking to private repos

**What people do:** Leave the `links.repo` field populated for private projects because "it'll just 404."
**Why it's wrong:** It's a dead link AND it contradicts the "code private" tag's implicit promise.
**Do instead:** Let the Zod schema enforce: if `visibility === 'private'`, strip `links.repo` in the transform. Make it impossible to ship.

---

## Build Order (Dependency-Sorted)

1. **Design tokens** (`styles/tokens.css`) — everything else consumes these. Define color, type scale, spacing, motion, radii. No components yet.
2. **Root layout + font loading** (`app/layout.tsx`, `next/font/local`) — establishes the page shell, metadata base, CSS pipeline.
3. **UI primitives** (`components/ui/*`) — Button, Link, Tag, Prose. No motion yet. Lets the next steps have buttons that match the system.
4. **Motion provider + primitives** (`components/motion/*`) — `MotionProvider`, `FadeIn`, `ScrollReveal`. Single client boundary strategy proven.
5. **Site layout** (`app/(site)/layout.tsx` + `Nav` + `Footer`) — renders motion provider, nav, footer. Now every page under `(site)` inherits chrome.
6. **Content Collections config + schema** (`content-collections.config.ts`, `lib/schemas.ts`, `lib/projects.ts`) — defines the project model. First MDX file (`myco.mdx`) authored as the canonical test fixture.
7. **Project detail template** (`app/(site)/projects/[slug]/page.tsx` + `ProjectHeader`, MDX components, `RelatedRail`) — gets one real project page end-to-end. This is the hardest page; validating it here de-risks the rest.
8. **Projects index** (`app/(site)/projects/page.tsx` + `ProjectGrid`, `ProjectCard`, `TagFilter`) — depends on project template styling decisions.
9. **Home page** (`app/(site)/page.tsx` + `Hero`, `Thesis`, hero-project grid) — reuses `ProjectCard` and motion primitives. Last because it's the most creative surface and needs everything else to be finished.
10. **About page** (`app/(site)/about/page.tsx`) — short, content-driven; uses prose/typography system.
11. **Resume data + layout** (`content/resume.ts`, `lib/resume.ts`, `components/site/resume/*`, `app/resume/page.tsx`) — HTML version first.
12. **Resume print CSS + PDF generator** (`styles/print.css`, `scripts/generate-resume-pdf.ts`, `/resume.pdf` link) — close the single-source loop.
13. **Contact page** (`app/(site)/contact/page.tsx`) — trivial; list of links. Only here because it's tiny and doesn't block anything.
14. **SEO plumbing** (`app/sitemap.ts`, `app/robots.ts`, per-project `opengraph-image.tsx`, `lib/seo.ts`) — needs all routes to exist.
15. **Polish pass** — 404 page, easter eggs, perf audit (Lighthouse ≥ 90), reduced-motion QA, keyboard nav audit, responsive review across mobile/tablet/desktop.

**Parallelizable branches once step 6 lands:** design tokens/type polish can run in parallel with content authoring. Content authoring (writing MDX) can run in parallel with any component work after step 7.

---

## Sources

- [Next.js — Getting Started: Project Structure](https://nextjs.org/docs/app/getting-started/project-structure) — HIGH
- [Next.js — generateStaticParams reference](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) — HIGH
- [Next.js — MDX guide](https://nextjs.org/docs/app/building-your-application/configuring/mdx) — HIGH
- [Tailwind CSS v4.0 release post](https://tailwindcss.com/blog/tailwindcss-v4) — HIGH
- [Tailwind CSS — Theme variables](https://tailwindcss.com/docs/theme) — HIGH
- [Motion — Reduce bundle size (LazyMotion)](https://motion.dev/docs/react-reduce-bundle-size) — HIGH
- [Motion — MotionConfig](https://www.framer.com/motion/motion-config/) — HIGH
- [Content Collections — migration from Contentlayer (Dub case study)](https://dub.co/blog/content-collections) — MEDIUM
- [Creating a Résumé Website and PDF Generator With Next.js (Colin Hemphill)](https://www.colinhemphill.com/blog/creating-a-resume-website-and-pdf-generator-with-nextjs) — MEDIUM
- [Harrison Pim — Creating a downloadable PDF copy of a page using Next.js and Puppeteer](https://harrisonpim.com/blog/creating-a-downloadable-pdf-copy-of-a-page-using-next-js-and-puppeteer) — MEDIUM
- [ContentLayer abandoned — alternatives (Wisp CMS)](https://www.wisp.blog/blog/contentlayer-has-been-abandoned-what-are-the-alternatives) — MEDIUM

---
*Architecture research for: Next.js 15 App Router portfolio (olivelliott.dev)*
*Researched: 2026-04-18*
