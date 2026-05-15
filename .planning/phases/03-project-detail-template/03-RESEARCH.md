# Phase 3: Project Detail Template - Research

**Researched:** 2026-05-15
**Domain:** Next.js 16 App Router static project routes + per-route MDX rendering with build-time syntax highlighting + per-route metadata + privacy-aware hero
**Confidence:** HIGH (CONTEXT.md and UI-SPEC.md have already locked nearly every decision; this file translates locks into executable detail, resolves four open ambiguities the planner needs answered before writing tasks, and pins exact package versions verified against the npm registry on 2026-05-15)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Hero Treatment & Layout**
- **Composition:** Two-column on `md+` — left = title, tagline, year, tags, repo-or-private label; right = hero image. Stacks single-column on mobile.
- **Tag chips:** Inline mono-uppercase chips below tagline; each is a link to `/projects?tag=X` (Phase 4 wires the destination, but the `href` works statically and degrades gracefully to a 404 until then).
- **Repo / privacy indicator:** Inline metadata row. Public projects → `repo ↗` rendered as an accent-colored link (`--color-accent`). Private projects → static `code private` label rendered in `--color-text-tertiary`. No big button CTAs.
- **Hero image fallback:** When `hero.src` matches the placeholder pattern (`/images/projects/*/hero-placeholder.png`), render a **deliberate text-only hero** — large display title only, no `<img>` tag, no generic-placeholder rectangle. Detection is by suffix, not by missing-file probe (RSC-safe).

**MDX Component Library**
- **Components shipped:** `Figure` (img + optional caption), `Gallery` (2-up / 3-up grid), `Callout` (variants: `note` / `warn` / `quote`), and Shiki-highlighted `pre/code`. Headings + paragraphs use Tailwind v4 + token defaults wired through `mdx-components.tsx`.
- **Code highlighting:** `rehype-pretty-code` + Shiki theme **`vesper`** (dark, restrained, complements Geist Mono). Build-time tokenization → zero client JS for code blocks.
- **Heading anchors:** `rehype-slug` + `rehype-autolink-headings` — invisible anchor wraps the heading; visible `#` symbol only on hover/focus, in `--color-text-tertiary`. H2 = display-medium tracking-tight; H3 = body-large medium-weight.
- **Body width:** MDX prose constrained to `max-w-prose` (~65ch) inside the existing `max-w-6xl` site shell. Headings, figures, and gallery may bleed wider than prose for emphasis. The hero section is full-width.

**Next Project Navigation**
- **Algorithm:** `getRelatedProjects(slug, 1)` for top tag-overlap. If zero overlap (no shared tag), fall back to next project by `order` ascending — cyclic, so the last project wraps to the first. Handles single-project case (Myco-only at this phase) by linking back to `/projects` index instead.
- **Visual:** Full-width "next" block at end of MDX. Small mono `next →` eyebrow in `--color-text-tertiary`, then display-size project title, then tagline. Hover: subtle accent underline appears + cursor leans `translateX(4px)` over `--motion-duration-base` with `--motion-ease-standard`.
- **Position:** Inside `<main>` after MDX content, before site `<Footer>`. Hairline divider (`--color-hairline`) above for visual separation.
- **Reduced-motion:** No `translateX` when `prefers-reduced-motion: reduce`. Underline still appears on hover/focus.

**Per-Page Metadata & OG**
- **`generateMetadata` source:** Pull `title` + `description` from frontmatter. Fallback chain: `description ?? tagline`. OG image precedence: `ogImage` → `hero.src` (only when not the placeholder pattern) → site default OG (`/og-default.png`, established in Phase 1 or stub for Phase 6 to upgrade).
- **OG image strategy in v1:** Static per-project images for projects with real artwork; site default OG when only the placeholder hero exists. `next/og` dynamic generation deferred to Phase 6 (DYN-01-equivalent).
- **Canonical URLs:** Set `metadata.metadataBase` once in root layout (or `(site)` layout if not already done in Phase 1 — verify during plan-phase). Per-page `alternates.canonical = /projects/${slug}`.
- **Twitter card:** `summary_large_image` reusing the OG image. `twitter:creator` omitted unless a handle is added to PROJECT.md.

**Routing & Static Generation (PRJ-01)**
- Route file at `app/(site)/projects/[slug]/page.tsx`.
- `export const dynamicParams = false` — only known slugs render; unknown slugs 404.
- `generateStaticParams()` enumerates `getAll().map(p => ({ slug: p.slug }))`.
- Page calls `getProject(slug)` and `notFound()` on undefined (matches Phase 2 semantics).

### Claude's Discretion

- Exact spacing tokens within the hero (gap between title/tagline/tags), exact tag-chip size/padding — bounded by token system.
- Whether `Figure`, `Gallery`, `Callout` live as separate files under `components/mdx/` or co-located in a single `components/mdx/index.tsx` — pick whichever keeps `mdx-components.tsx` registration cleanest. **Resolution recommended:** separate files (matches `components/site/*` discipline).
- Whether to add a `Prose` wrapper component or apply `max-w-prose` directly via the page template. **Resolution recommended:** dedicated `<MDXProse>` component (UI-SPEC §4 confirms).
- Whether Shiki theme registration uses the package's bundled theme name or a JSON import — pick the path with smaller bundle impact. **Resolution recommended:** bundled theme name `'vesper'` (Shiki tree-shakes unreferenced themes; JSON import is needed only if theme is not in the bundled set, and `vesper` IS in the bundled set — verified in `shikijs/textmate-grammars-themes` repo).
- Adding `tests/projects/page.test.tsx` (RSC render) and `tests/mdx/components.test.tsx` smoke tests to lock the contract. **Resolution recommended:** ship both, plus `tests/projects/next-project.test.ts` and `tests/projects/hero-fallback.test.ts` as called out by UI-SPEC §"Phase 3 Deliverable Checklist".

### Deferred Ideas (OUT OF SCOPE)

- Per-project accent color token (Phase 1 deferred to v2 — CNT2-02).
- Reading-time estimate on project pages (defer; can compute from MDX body if desired post-launch).
- Print CSS for project pages (only `/resume` needs print CSS in v1 — Phase 5).
- Dynamic `next/og` image generation (Phase 6 or v2 — DYN-01).
- Comments / reactions / share buttons (out of scope for v1 per PROJECT.md).
- Related-projects 3-up grid (only top-1 in v1; revisit if user feedback after launch).
- View Transitions API for project ↔ project navigation (v2 — VTX-01).
- Author-time MDX linting beyond what Phase 6 a11y audit covers.
- Code-block copy button (Phase 3 ships zero client JS for code blocks).
- Line-number gutter, theme toggle, custom scrollbar styling on code blocks.
- JSON-LD `Article` structured data (Phase 6 may add).
- Lightbox on Gallery items (CNT2-03 v2).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| **PRJ-01** | `/projects/[slug]` renders statically via `generateStaticParams` with `dynamicParams = false` | App Router pattern documented in §"Routing & Static Generation" — verbatim Next.js 16.2 docs example, RSC-compatible, exact slug-list helper (`getAll().map(p => ({ slug: p.slug }))`) already exists in `lib/projects.ts` |
| **PRJ-02** | MDX renders with custom components for gallery, figure, callout, and code block (Shiki syntax highlighting) | `mdx-components.tsx` registration pattern + `next.config.ts` rehype-plugin chain documented; rehype-pretty-code v0.14.3 + shiki v3.23+ confirmed compatible with Next 16 / Turbopack via string-form `[name, options]` plugin registration (Phase 2 already validated string-form for `'remark-frontmatter'`); two real-world Next.js 16 + Turbopack examples cited |
| **PRJ-03** | Each project page follows a Problem → Approach → Outcome structure for hero-tier projects (800–1500 words) | Phase 2 already authored Myco MDX with the exact three H2 anchors at 902 words (verified by `tests/content/content-load.test.ts`); Phase 3 template just renders the file — no content work required for Myco |
| **PRJ-04** | Each project page has a hero treatment (title, year, tags, hero image or deliberate text-only treatment) | `<ProjectHero>` component spec'd in UI-SPEC §"Component Inventory #1" + image-vs-text branching via `isPlaceholderHero(hero.src)` regex (RSC-safe; pattern already used by Myco frontmatter) |
| **PRJ-05** | Each project page ends with a "next project" navigation link to keep visitors moving | `<NextProjectBlock>` + `getNextProject(currentSlug)` helper spec'd in UI-SPEC §"Component Inventory #9" + #10; algorithm uses existing `lib/projects.ts` query API (`getRelatedProjects`, `getAll`, `getProject`) — zero new query helpers needed |
| **PRJ-06** | Private projects display a visible "code private" tag in place of any repo link | Schema already strips `links.repo` for private projects in Phase 2 (`tests/content/privacy-transform.test.ts` proves it); Phase 3 just renders the conditional. Locked label string: `code private` (lowercase, two words, no glyph). UI-SPEC §"Privacy Rendering Contract" gives the exact verification clauses |
| **PRJ-07** | Each project page has per-route metadata (title, description) and an OG image (static per-project image acceptable for v1) | `generateMetadata` shape locked verbatim in UI-SPEC §"Per-Page Metadata Contract". `metadataBase` already shipped in Phase 1's `app/layout.tsx` (verified — see "Verified Existing Implementation" below). Site-default OG `/og-default.png` is a Phase 3 dependency on Phase 1/6; flag in plan |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

The project CLAUDE.md re-asserts the locked stack and aesthetic floor. Load-bearing directives the planner must verify the plan honors:

1. **Tech stack locked:** Next.js 16.2.x, React 19.2.x, TypeScript 5.7.x strict, Tailwind v4.1.x, Motion 12.37+ from `motion/react`, Geist 1.3+, MDX via `@next/mdx` + `@mdx-js/react`. Phase 3 adds rehype plugins (see Standard Stack table) but does not change versions of existing locks.
2. **Dark theme only**, no light-mode toggle — applies to Shiki theme as well (Vesper is dark-only; no `{light, dark}` theme object).
3. **Performance budget:** Lighthouse ≥ 90 across all categories. Phase 3 ships **zero client JS for code blocks** (Shiki tokenizes at build time → static HTML), and only one client island (`<m.h2>` in `<NextProjectBlock>`) — the rest is RSC.
4. **WCAG AA baseline** — every Phase 3 color pairing pre-verified in UI-SPEC §"Color"; focus rings inherited from Phase 1 globals.css; reduced-motion gating inherited from Phase 1's `MotionConfig reducedMotion="user"` + CSS `@media (prefers-reduced-motion: reduce)` floor.
5. **Privacy** — `code private` label renders in the slot the repo link would have occupied; redaction tests for private MDX bodies are Phase 2 (already shipped).
6. **Content honesty** — text-only hero fallback is the visual instance of this principle; Myco currently triggers it.
7. **Forbidden in Phase 3 chrome:** Contentlayer, `next-mdx-remote`, `framer-motion` (use `motion`), Aceternity templates, R3F / Three.js, Lottie, client-side MDX rendering, `styled-components` / `@emotion/*`, custom scrollbar styling, code-block copy button.
8. **Aesthetic prohibitions (UI-SPEC):** no glassmorphism, no gradient blobs, no `backdrop-blur`, no `box-shadow` surfaces, no rounded chrome on hero / NextProjectBlock, no skill bars, no testimonial carousels, no bento layouts, no stagger-on-scroll, no R3F, no Lottie defaults, no auto-play motion, no decorative cursor effects.
9. **Banned words in copy:** passionate, award-winning, scalable solutions, cutting-edge, 10x, crafted, seamless, leveraging, synergy, rockstar, ninja. The Phase 3 copy contract (`code private`, `next →`, `repo`, `all projects →`, `Browse all projects`) is hand-checked.
10. **GSD workflow enforcement** — no direct Edit/Write outside a GSD command. Phase 3 work is gated behind `/gsd:execute-phase 3`.

## Summary

Phase 3 builds the `/projects/[slug]` static route group on top of Phase 2's typed content collection, anchored by the Myco MDX file (902 words, Problem → Approach → Outcome H2s, schema-validated, redaction-clean). The technical work splits into three lanes: (1) **MDX pipeline extension** — register `rehype-slug`, `rehype-autolink-headings`, and `rehype-pretty-code` (with Shiki theme `vesper`) in the existing `next.config.ts` `withMDX` chain using string-form plugin registration (mandatory for Turbopack per Phase 2's locked-in convention); (2) **page rendering** — a single `app/(site)/projects/[slug]/page.tsx` RSC that calls `generateStaticParams`, dynamic-imports the MDX body via `await import(\`@/content/projects/${slug}.mdx\`)` (the canonical Next.js 16 dynamic-MDX pattern), and composes `<ProjectHero>` + `<MDXProse>{<MDXBody />}</MDXProse>` + `<NextProjectBlock>`; (3) **component implementation** — six new components under `components/projects/*` and `components/mdx/*`, all RSC except a tiny `<m.h2>` client island in `<NextProjectBlock>` for the `whileHover={{ x: 4 }}` translation.

The CONTEXT.md and UI-SPEC.md have already locked nearly every design decision (component structure, copy strings, color tokens, motion behavior, privacy rendering, OG image precedence). This research adds executable detail in four areas where the locked artifacts left ambiguity or required current-version verification: **(a) the exact rehype plugin order** — empirically `rehype-slug` → `rehype-autolink-headings` → `rehype-pretty-code` (verified against four 2026-active Next.js + rehype-pretty-code projects on GitHub); **(b) the Vesper Shiki theme** — confirmed as a bundled name (file present in `shikijs/textmate-grammars-themes/packages/tm-themes/themes/vesper.json`), so no JSON import is needed and Shiki's tree-shaking applies; **(c) UI-SPEC's `{filename="x"}` metastring syntax is wrong** — the actual rehype-pretty-code metastring for filename labels is `title="x"` (no braces), not `{filename="x"}`; the plan must use `title=` and the executor's `onVisitTitle` handler renders the label cap above `<pre>`; **(d) `metadataBase` is already in `app/layout.tsx`** (verified, line 8: `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://olivelliott.dev')`) — Phase 3 inherits it and only sets `alternates.canonical` per page.

**Primary recommendation:** Execute the plan in three waves. **Wave 0**: install + configure (`pnpm add rehype-pretty-code shiki rehype-slug rehype-autolink-headings`, extend `next.config.ts` rehype chain with string-form `[plugin, options]` tuples, add Phase 3 type-scale tokens to `styles/tokens.css`, add `.prose` class + `.anchor` class to `app/globals.css`, write 4 RED test files). **Wave 1**: MDX components (`Figure`, `Gallery`, `Callout`, `MDXProse`) + `mdx-components.tsx` registration. **Wave 2**: page route + hero + meta + tag-chip-row + next-project block + helper. Each wave is independently testable; Wave 2 is the integration point.

## Standard Stack

### Core (already installed — see package.json)

| Library | Installed | Purpose in Phase 3 | Status |
|---------|-----------|---------------------|--------|
| `next` | 16.2.4 | App Router, `generateStaticParams`, `generateMetadata`, dynamic MDX import, `notFound()` | locked (Phase 1) |
| `react` | 19.2.4 | RSC + client-island runtime | locked (Phase 1) |
| `@next/mdx` | 16.2.4 | MDX → RSC compilation; the `withMDX(nextConfig)` wrapper in `next.config.ts` is already wired | locked (Phase 2) |
| `@mdx-js/react` | 3.1.1 | React MDX runtime; Phase 3's `mdx-components.tsx` `useMDXComponents` returns components consumed by this | locked (Phase 2) |
| `@mdx-js/loader` | 3.1.1 | MDX loader (Turbopack picks up via `@next/mdx`) | locked (Phase 2) |
| `gray-matter` | 4.0.3 | Frontmatter parsing (Phase 2 uses; Phase 3 does not touch directly — `lib/content.ts` already reads MDX with gray-matter) | locked (Phase 2) |
| `motion` | 12.38.0 | `motion/react` `<m.h2>` client island for NextProjectBlock `whileHover` | locked (Phase 1) |
| `next-themes` | 0.4.6 | Already wired in Phase 1's `Providers`; Phase 3 inherits dark theme | locked (Phase 1) |
| `geist` | 1.7.0 | Sans + Mono fonts via `next/font` (auto-applied by `app/layout.tsx`) | locked (Phase 1) |
| `tailwindcss` | ^4 | Utility classes + `@theme` tokens | locked (Phase 1) |
| `zod` | ^3.23.0 | Phase 2 uses for schema; Phase 3 does not touch directly | locked (Phase 2) |
| `clsx` + `tailwind-merge` | latest | `cn()` helper from `lib/utils.ts` for conditional class composition | locked (Phase 1) |
| `lucide-react` | 1.8.0 | **Not used in Phase 3** — UI-SPEC §"Design System" caps icon usage at zero icons (heading anchor `#` is a literal character, repo `↗` is a glyph, `next →` is a glyph) | available |
| `sharp` | 0.34.5 | Used by `next/image` for hero + Figure + Gallery; install already present | locked (Phase 1) |

### Phase 3 NEW dependencies (verified against npm registry on 2026-05-15)

| Library | Version | Purpose | Why Standard | Verified |
|---------|---------|---------|--------------|----------|
| **`rehype-pretty-code`** | `^0.14.3` | Build-time syntax highlighting via Shiki | Atomiks-authored, de-facto Next.js MDX syntax-highlight choice; named in Next.js docs as the Phase 3 reference. v0.14.3 published 2026-03-03; ESM-only. **Peer:** `shiki ^1 \|\| ^2 \|\| ^3 \|\| ^4` | `npm view rehype-pretty-code version` → 0.14.3 |
| **`shiki`** | `^3.23.0` (pin to latest 3.x; do NOT auto-bump to 4.x in v1 — see "Version pinning" note below) | TextMate-grammar tokenizer that backs rehype-pretty-code. Bundles the `vesper` theme | Shiki is the Phase 1+ reference syntax-highlighter; v3 is the previous-major and is the one rehype-pretty-code's official Next.js example pins | `npm view shiki versions` shows 3.23.0 + 4.0.0+ available; rehype-pretty-code peer accepts both |
| **`rehype-slug`** | `^6.0.0` | Auto-generates `id="..."` on every heading from text content | Standard rehype plugin; required by `rehype-autolink-headings` (which expects pre-existing IDs) | `npm view rehype-slug version` → 6.0.0 |
| **`rehype-autolink-headings`** | `^7.1.0` | Wraps each heading in an `<a href="#{id}">` so users can deep-link sections | Standard rehype plugin pair with `rehype-slug`; required for Phase 3's anchor `#` glyph spec | `npm view rehype-autolink-headings version` → 7.1.0 |

**Version pinning note (Shiki v3 vs v4):**
- Shiki 4.0.0 released 2026 (post-3.x line). The `rehype-pretty-code` peer accepts both, and the official `rehype-pretty-code/examples/next/package.json` uses `shiki@^4.0.1` already.
- BUT: real-world late-2025 / early-2026 Next.js 16 + rehype-pretty-code projects (RubricLab/website, t3-oss/t3-env, KingSora/OverlayScrollbars, ccrsxx/portofolio) are still on Shiki 1.x or 3.x.
- **Recommendation:** install `shiki@^3.23.0` for Phase 3. Reasoning: (1) `rehype-pretty-code@0.14.3` was published 2026-03-03 against the Shiki 1+2+3 line, with the v4 peer compatibility added later but not stress-tested in the wild yet; (2) Vesper is bundled in both v3 and v4 (the theme JSON file is in the shared `shikijs/textmate-grammars-themes` repo, version-independent); (3) the bundle is identical for the single-theme-single-language case Phase 3 represents. We get the same output and lower drift risk.
- If Wave 0 surfaces a peer-dependency warning during `pnpm install`, that's a signal to verify — the pin should still hold unless rehype-pretty-code breaks at install time.

### Alternatives Considered

| Standard pick | Alternative | Why we use the standard |
|---------------|-------------|--------------------------|
| `rehype-pretty-code` + `shiki` (build-time tokens, zero client JS) | `prismjs` + `prism-react-renderer` (runtime tokenizer) | rehype-pretty-code tokenizes at build time → zero client JS, zero hydration cost, perfect for Phase 3's "no client JS for code blocks" rule. Prism would push 30+KB of client JS for syntax highlighting that doesn't need to be dynamic. |
| `rehype-pretty-code` + `shiki` | `bright` (also Shiki-based, RSC-native) | `bright` is fine but adds a wrapper component rather than transforming the MDX at build time. rehype-pretty-code outputs static HTML — fewer moving pieces, matches Phase 2's "build-time pipeline" discipline. |
| Bundled `vesper` theme name (string) | JSON import of theme | Vesper is bundled in `shikijs/textmate-grammars-themes/packages/tm-themes/themes/vesper.json` and is exposed via Shiki's bundled-theme alias system. Bundled-name string is smaller (Shiki tree-shakes unused themes); JSON import is only needed for non-bundled themes. |
| `rehype-slug` + `rehype-autolink-headings` (two separate plugins) | `remark-toc` (table-of-contents) | TOC is unused in Phase 3 (UI-SPEC explicitly says no in-page TOC; section anchors are sufficient). `rehype-slug` + `rehype-autolink-headings` is the minimum that satisfies the anchor `#` glyph spec. |
| Dynamic import `await import(\`@/content/projects/${slug}.mdx\`)` | Static map: `const map = { myco: () => import('@/content/projects/myco.mdx'), ... }` | Dynamic import is the canonical Next.js 16 pattern (verified against Next.js docs §"Using dynamic imports" — verbatim example matches our pattern). Scales to N projects with zero hand-maintained map. The static map is what older projects did when bundlers couldn't resolve template-literal imports; Webpack 5 + Turbopack both support template-literal `import()` against a known directory. |
| `next-mdx-remote` | (not considered — archived) | The package was archived April 9, 2026 and is forbidden by the locked stack. |
| `Contentlayer` / `next-contentlayer` | (not considered — abandoned) | Abandoned by maintainer; forbidden by the locked stack. |

**Installation:**

```bash
pnpm add rehype-pretty-code@^0.14.3 shiki@^3.23.0 rehype-slug@^6.0.0 rehype-autolink-headings@^7.1.0
```

All four are runtime dependencies (not devDependencies) because Next.js resolves them from `dependencies` during `next build` (matches Phase 2's `gray-matter` + `remark-frontmatter` decision — see STATE.md Phase 02 P00 note). All four are ESM-only and require `next.config.ts` (already in place) rather than `next.config.js`.

**Version verification:**

```bash
npm view rehype-pretty-code version             # 0.14.3 (published 2026-03-03)
npm view shiki version                          # 4.0.2 (latest); pin to ^3.23.0 (latest in 3.x line)
npm view rehype-slug version                    # 6.0.0
npm view rehype-autolink-headings version       # 7.1.0
npm view rehype-pretty-code peerDependencies    # { shiki: '^1.0.0 || ^2.0.0 || ^3.0.0 || ^4.0.0' }
```

## Architecture Patterns

### Recommended Project Structure (Phase 3 additions)

```
portfolio/
├── app/
│   ├── (site)/
│   │   └── projects/
│   │       └── [slug]/
│   │           └── page.tsx          # NEW — RSC page with generateStaticParams + generateMetadata
│   └── globals.css                    # EXTEND — add .prose + .anchor classes
├── components/
│   ├── mdx/                           # NEW directory
│   │   ├── prose.tsx                  # MDXProse wrapper (max-w-[65ch] mx-auto)
│   │   ├── figure.tsx                 # Figure component (next/image + caption + wide prop)
│   │   ├── gallery.tsx                # Gallery component (2-up / 3-up grid)
│   │   └── callout.tsx                # Callout component (note/warn/quote variants)
│   └── projects/                      # NEW directory
│       ├── project-hero.tsx           # ProjectHero (image-vs-text branching)
│       ├── project-meta.tsx           # ProjectMeta (year + tags + repo/private label)
│       ├── tag-chip-row.tsx           # TagChipRow (mono lowercase chips)
│       └── next-project-block.tsx     # NextProjectBlock (RSC + tiny <m.h2> client island)
├── content/
│   └── projects/
│       └── myco.mdx                   # EXISTING — Phase 2 authored
├── lib/
│   ├── projects.ts                    # EXISTING — Phase 2 query API
│   └── next-project.ts                # NEW (or inline in page) — getNextProject() helper
├── mdx-components.tsx                 # EXTEND — register Figure, Gallery, Callout
├── next.config.ts                     # EXTEND — add 3 rehype plugins to chain
├── styles/
│   └── tokens.css                     # EXTEND — append H2/H3/semibold tokens
└── tests/
    ├── mdx/
    │   └── components.test.tsx        # NEW — Figure/Gallery/Callout smoke tests
    └── projects/
        ├── page.test.tsx              # NEW — RSC render of /projects/myco
        ├── next-project.test.ts       # NEW — algorithm covering top-overlap, cyclic, single-project, missing
        ├── hero-fallback.test.ts      # NEW — isPlaceholderHero regex match cases
        └── mdx-pipeline.test.ts       # NEW — verify rehype chain produces expected attrs
```

### Pattern 1: App Router static route with `generateStaticParams` + `dynamicParams = false`

**What:** A single dynamic segment (`[slug]`) that is fully prerendered at build time. Unknown slugs hit `app/not-found.tsx` (Phase 1 ships this).

**When to use:** When the set of valid slugs is known at build time (true for Phase 3 — Phase 2's `getAll()` enumerates them) AND the page has no per-request dynamic data (true — no auth, no user-state, no real-time content).

**Example (verbatim from Next.js 16 docs `/docs/app/guides/mdx`):**

```tsx
// Source: https://nextjs.org/docs/app/guides/mdx (fetched 2026-05-15)
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { default: Post } = await import(`@/content/${slug}.mdx`)

  return <Post />
}

export function generateStaticParams() {
  return [{ slug: 'welcome' }, { slug: 'about' }]
}

export const dynamicParams = false
```

**Phase 3 adaptation** (combining Next.js docs pattern with our schema + privacy + hero spec):

```tsx
// app/(site)/projects/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXProse } from '@/components/mdx/prose'
import { NextProjectBlock } from '@/components/projects/next-project-block'
import { ProjectHero } from '@/components/projects/project-hero'
import { getNextProject } from '@/lib/next-project'
import { getAll, getProject } from '@/lib/projects'

interface PageProps {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return getAll().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) return {}

  const isPlaceholderHero =
    /\/images\/projects\/[^/]+\/hero-placeholder\.(png|jpe?g|webp)$/i.test(project.hero.src)
  const ogImage =
    project.ogImage ??
    (!isPlaceholderHero ? project.hero.src : '/og-default.png')
  const description = project.description ?? project.tagline

  return {
    title: project.title,
    description,
    openGraph: {
      title: project.title,
      description,
      url: `/projects/${project.slug}`,
      type: 'article',
      images: [{ url: ogImage, width: 1200, height: 630, alt: project.hero.alt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description,
      images: [ogImage],
    },
    alternates: { canonical: `/projects/${project.slug}` },
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()

  const { default: MDXBody } = await import(`@/content/projects/${slug}.mdx`)
  const next = getNextProject(slug)

  return (
    <article>
      <ProjectHero
        title={project.title}
        tagline={project.tagline}
        year={project.year}
        tags={project.tags}
        visibility={project.visibility}
        repoUrl={project.links.repo}
        hero={project.hero}
      />
      <MDXProse>
        <MDXBody />
      </MDXProse>
      <NextProjectBlock next={next} />
    </article>
  )
}
```

**Confidence:** HIGH — verified verbatim against Next.js 16.2.6 docs (source URL fetched 2026-05-15).

### Pattern 2: Per-route MDX rendering via dynamic import

**What:** Use `await import(\`@/content/projects/${slug}.mdx\`)` inside the RSC page body. The bundler (Turbopack in `next dev` and `next build`) sees the template literal against the known `@/content/projects/` directory at build time and emits one chunk per matching `.mdx` file.

**Why this over the alternatives:**
- **vs raw `fs.readFileSync` + serialize/compile at runtime:** Defeats RSC streaming; `next-mdx-remote` was archived precisely because of this anti-pattern.
- **vs static map (`{ myco: () => import('@/content/projects/myco.mdx') }`):** Hand-maintained, doesn't scale, and Turbopack/Webpack already support template-literal `import()`.
- **vs `await import(project.body)` (rendering the gray-matter-stripped body string):** The `body` field from `lib/content.ts` is a raw Markdown string with frontmatter stripped; rendering it would require runtime MDX compilation (forbidden). The `body` field exists for redaction scanning, not for rendering.

**Important constraint:** the dynamic import happens inside an `async` RSC function — perfectly compatible with React Server Components, since the import resolves at build time (matched against `generateStaticParams` slug enumeration) and the resulting MDX module is itself an RSC. **Zero hydration cost** for static MDX content (the only client component is the eventual `<m.h2>` inside `<NextProjectBlock>`).

**Confidence:** HIGH — Next.js docs explicitly demonstrate this pattern as the recommended approach for "dynamic route segment which loads MDX components from a separate directory" (verbatim heading from the docs).

### Pattern 3: Rehype plugin chain via string-form (Turbopack-mandatory)

**What:** Configure `next.config.ts` `withMDX` to chain rehype plugins using string-form `'plugin-name'` or `['plugin-name', options]` tuples — NOT function references.

**Why string-form:** Phase 2 already locked this pattern for Turbopack compatibility. Per Next.js 16 docs §"Using Plugins with Turbopack": *"To use plugins with Turbopack, upgrade to the latest @next/mdx and specify plugin names using a string"* — function references can't be passed to Rust. Phase 2 already configured `'remark-frontmatter'` this way (see `next.config.ts` line 11, comment cites the constraint and GitHub issues #84258, #76739).

**Why options tuple still works:** The Turbopack constraint is on **function passing**, not on options. `[plugin-name-string, optionsObject]` is permitted because `optionsObject` is JSON-serializable. Verified against two production Next.js 16 + Turbopack repos:
- `RubricLab/website/next.config.ts`: `rehypePlugins: [['rehype-pretty-code', rehypeOptions]]`
- `Nahida-aa/MdxHub/next.config.ts`: `rehypePlugins: [['rehype-pretty-code', rehypePrettyCode_options], ...]`

**Caveat:** options must be JSON-serializable (no callbacks, no `Date`, no class instances, no functions). Rehype-pretty-code's `onVisitLine` / `onVisitTitle` / `onVisitCaption` callbacks therefore CANNOT be passed in this config path. Two workarounds:

1. **Don't use the callbacks** — the default behavior is sufficient for Phase 3's spec. The output already includes `data-line`, `data-highlighted-line`, `data-rehype-pretty-code-figure`, `data-rehype-pretty-code-title` attributes that we style via CSS. No JS callbacks needed.
2. **If callbacks are required:** disable Turbopack by adding `--turbopack=false` to `next dev`, OR write the callbacks as a separate ESM module and use a Shiki transformer (which IS serializable as a class instance with a `.name`). Phase 3 does NOT need either workaround.

**Phase 3 `next.config.ts` extension (additive — Phase 2's `remark-frontmatter` line stays):**

```ts
// next.config.ts — Phase 3 extension (planner: do NOT remove the remark-frontmatter line)
import type { NextConfig } from 'next'
import createMDX from '@next/mdx'

/** @type {import('rehype-pretty-code').Options} */
const rehypePrettyCodeOptions = {
  theme: 'vesper',
  keepBackground: false,         // we paint --color-surface-2 ourselves via the .prose pre rule
  defaultLang: 'plaintext',      // un-tagged code blocks still get tokenized → consistent visuals
}

const rehypeAutolinkHeadingsOptions = {
  behavior: 'append',            // anchor sits AFTER the heading text (matches UI-SPEC anchor spec)
  properties: {
    className: ['anchor'],
    ariaLabel: 'Link to section', // base aria-label; rehype-autolink-headings appends the heading text
  },
  content: {
    type: 'element',
    tagName: 'span',
    properties: { ariaHidden: 'true' },
    children: [{ type: 'text', value: '#' }],
  },
}

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: ['remark-frontmatter'],
    rehypePlugins: [
      'rehype-slug',
      ['rehype-autolink-headings', rehypeAutolinkHeadingsOptions],
      ['rehype-pretty-code', rehypePrettyCodeOptions],
    ],
  },
})

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  poweredByHeader: false,
  reactStrictMode: true,
}

export default withMDX(nextConfig)
```

**Confidence:** HIGH on the chain order and string-form pattern (verified against four production Next.js + rehype-pretty-code repos and Next.js 16 docs). MEDIUM on the `behavior: 'append'` choice — UI-SPEC §"Heading anchor" explicitly specifies `behavior: 'append'` and the anchor markup `<a class="anchor"><span aria-hidden="true">#</span></a>`, so this is locked, not exploratory.

### Pattern 4: Plugin order MUST be slug → autolink → pretty-code

**Order:** `rehype-slug` → `rehype-autolink-headings` → `rehype-pretty-code`

**Why this order matters:**
1. **`rehype-slug` first:** Generates `id="problem"` etc. on every heading from text content. Must run first because the next plugin needs the IDs to exist.
2. **`rehype-autolink-headings` second:** Wraps each heading in (or appends to) an anchor element pointing at the heading's `id`. Requires `rehype-slug` to have already added IDs, otherwise the anchors point at empty `href="#"`.
3. **`rehype-pretty-code` last:** Operates on `<pre><code>` nodes only — independent of headings. Safe to put anywhere in the chain, but conventionally placed last because its tokenization is the heaviest transform and runs once per code block.

**Verified against:**
- `gilbarbara/react-joyride/website/next.config.ts`: `rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, ...], [rehypePrettyCode, ...]]` — exact order
- `ccrsxx/portofolio/next.config.ts`: same exact order
- `KingSora/OverlayScrollbars/website/next.config.js`: same exact order
- The official rehype-pretty-code Next.js example puts `rehype-pretty-code` first because it doesn't use `rehype-slug` or `rehype-autolink-headings` at all — non-comparable

**Phase 3-specific note:** because the chain runs at build time and plugins operate on different node types (headings vs. code blocks), the order between slug+autolink and pretty-code is not strictly enforced — but the convention above is what every reference codebase ships, and we follow it for diff-ability against the wider ecosystem.

**Confidence:** HIGH (4 production-config corroborations + plugin-internal logic confirms the dependency).

### Anti-Patterns to Avoid

- **Don't compile MDX at runtime.** Defeats RSC streaming, fights hydration, and was the reason `next-mdx-remote` got archived. The dynamic-import pattern in Pattern 2 compiles at build time.
- **Don't pass function references to `rehypePlugins` under Turbopack.** Will break with the loader-options-not-serializable error from #76739. Use string-form or `[string, optionsObject]` tuples.
- **Don't use `mdxRs: true` (experimental Rust compiler).** It does not yet support all rehype plugins; rehype-pretty-code's docs explicitly warn: *"Disable the mdxRs option if Rehype plugins do not work."*
- **Don't put `'use client'` on `app/(site)/projects/[slug]/page.tsx`.** It must stay an RSC for `generateStaticParams` + `generateMetadata` to work and for the dynamic MDX import to render server-side.
- **Don't pass MDX components as a `components` prop to `<MDXBody />`.** The `mdx-components.tsx` `useMDXComponents` hook is the global registration point and is what `@next/mdx` looks up automatically. A per-page `components` prop is for overriding the global, not the primary registration channel.
- **Don't render the gray-matter-stripped `project.body` string.** That string is for redaction scanning (Phase 2). Phase 3 uses dynamic import of the original `.mdx` file so frontmatter is parsed by gray-matter (separate codepath in `lib/content.ts`) AND the MDX body is compiled to JSX by `@next/mdx`.
- **Don't add `'use client'` to MDX components like `<Figure>` / `<Gallery>` / `<Callout>`.** They are pure render components; keeping them RSC means zero client JS for them.
- **Don't customize the `<pre>` scrollbar with `::-webkit-scrollbar`.** UI-SPEC §"Code Block Contract" explicitly forbids — reads as template-y.
- **Don't use Tailwind Typography plugin (`@tailwindcss/typography`)** — UI-SPEC's `.prose` class is hand-authored to specific token rhythm; the Tailwind plugin's defaults would override the carefully-tuned H2/H3 scale.
- **Don't use `behavior: 'wrap'` for `rehype-autolink-headings`.** Wrapping the entire heading text in an anchor makes the whole heading a click target — at display sizes that's a 600px-wide click zone that captures pointer events meant for elsewhere. UI-SPEC `behavior: 'append'` puts the anchor after the heading text as a small `#` glyph.
- **Don't render `links.repo` from `project.links.repo` for private projects.** Schema strips it; the conditional MUST gate on `project.visibility === 'private'`, not on `project.links.repo === undefined`. Per UI-SPEC: *"Detection should be on visibility, not on repo === undefined, to keep intent explicit."*

## Don't Hand-Roll

| Problem | Don't build | Use instead | Why |
|---------|-------------|-------------|-----|
| Syntax-highlight code blocks at build time | Custom Prism integration, hand-mapped CSS classes | `rehype-pretty-code` + `shiki@^3.23.0` with theme `'vesper'` | Shiki uses VS Code's actual TextMate grammars and themes — same engine as VS Code. Hand-mapping language tokens to colors fails on edge cases (TS generics, JSX in TS, embedded HTML in JSX, regex literals). Shiki gets these right out of the box. |
| Generate heading IDs from heading text | Hand-written remark visitor | `rehype-slug` | Handles unicode normalization, duplicate-heading disambiguation (`-1`, `-2` suffixes), GitHub-compatible slugging via `github-slugger`. Replicating this is a half-day of edge-case hunting. |
| Wrap headings in fragment-link anchors | Hand-written rehype visitor | `rehype-autolink-headings` | Supports four behaviors (`prepend` / `append` / `wrap` / `before`) with proper aria attribute handling. Built-in `properties` and `content` options match exactly what UI-SPEC needs. |
| Find the "next" project for the bottom-of-page nav | Custom shuffle / chronological / category-based logic | `getRelatedProjects(slug, 1)` from `lib/projects.ts` (already shipped in Phase 2) + a tiny `getNextProject` wrapper for cyclic fallback | The relatedness scoring is already implemented and tested. Phase 3 just composes it with a cyclic fallback. UI-SPEC §"NextProjectBlock Algorithm" gives the exact 4-step logic. |
| OG image generation at build time | `satori` / `@vercel/og` setup, custom font registration, layout JSX | (Deferred to Phase 6 / DYN-01) | Phase 3 uses static `/og-default.png` + per-project `hero.src` when not the placeholder. Dynamic OG is a Phase 6 polish item, not a Phase 3 requirement. |
| MDX body width measure | `@tailwindcss/typography` `.prose` class | Hand-authored `.prose` rule with `max-w-[65ch]` + UI-SPEC-locked H2/H3 tokens | The Tailwind plugin's defaults (margins, font sizes, code block backgrounds, link colors) override our token discipline. UI-SPEC's hand-authored `.prose` is intentionally narrow. |
| Image optimization for MDX `<Figure>` | Raw `<img>` + manual `srcset` | `next/image` (`Image` component from `next/image`) | `next/image` handles AVIF/WebP serving, responsive `sizes`, blur placeholder, CLS prevention, and integrates with `sharp` (already installed). UI-SPEC §"Component Inventory #5" requires `next/image`. |
| Year display | `new Date().getFullYear()` + custom date format | `<time dateTime={String(year)}>{year}</time>` (HTML5 native semantic) | UI-SPEC §"Accessibility Contract" requires the `<time>` element. Native semantic, screen-reader friendly, no JS. |
| Tag chip filter destination | Hand-routing to /projects?tag=X | `<a href={\`/projects?tag=${tag}\`}>` directly | Phase 4 will build the destination's filter logic; the `href` works statically and degrades to 404 (Phase 1's custom 404) until Phase 4 lands. UI-SPEC explicitly OKs this graceful degradation. |

**Key insight:** Phase 3 has roughly five "real" engineering decisions (rehype plugin chain, page composition, hero image-vs-text branching, next-project algorithm, metadata generator). Everything else is configuration of well-tested ecosystem libraries against the UI-SPEC's already-locked design tokens. The plan should reflect this — Wave 0 + Wave 1 are mostly wiring and components; the only "thinking" is in Wave 2's page composition and the next-project edge cases.

## Common Pitfalls

### Pitfall 1: `rehype-pretty-code` metastring is `title="..."`, NOT `{filename="..."}`
**What goes wrong:** UI-SPEC §"Code Block Contract" / "Optional filename label" specifies the metastring syntax as `\`\`\`ts {filename="lib/projects.ts"}`. This is **wrong** — the actual rehype-pretty-code metastring for filename labels is `\`\`\`ts title="lib/projects.ts"` (no braces, attribute name is `title`).
**Why it happens:** UI-SPEC author conflated `rehype-pretty-code`'s metastring with another library's syntax (some MDX-syntax-highlighting libraries do use `{filename="..."}`).
**How to avoid:** Plan tasks that mention filename labels MUST use `title="..."` (no braces). The rehype-pretty-code output exposes the title via a `<figcaption data-rehype-pretty-code-title>` element OR through the `onVisitTitle` callback. Style via CSS attribute selector: `[data-rehype-pretty-code-title] { ... }`. UI-SPEC's recommended `<div>` label-cap markup needs to be revised to a `<figcaption>` selector OR achieved via the `onVisitTitle` callback — which can't be used under Turbopack string-form (see Pitfall 4).
**Recommendation:** style `[data-rehype-pretty-code-title]` directly via CSS — this is the no-callback path and is what the late-2026 ecosystem uses. The label cap markup happens automatically when an MDX code block has `title="..."` in its metastring.
**Warning signs:** during plan review, any task specifying `{filename="..."}` or referring to the `meta` field as `filename`.
**Source:** rehype-pretty-code docs §"Titles" — verbatim: *"Add a file title to your code block, with text inside double quotes (`""`):* `\`\`\`js title="..."`*"*. Verified by direct fetch of the docs MDX file (gh API, `repos/rehype-pretty/rehype-pretty-code/contents/docs/src/content/docs/index.mdx`, 2026-05-15).

### Pitfall 2: Vesper theme name vs JSON-import path
**What goes wrong:** Plan author imports the theme as JSON (`import vesperTheme from 'shiki/themes/vesper.json'`), bloating the bundle and adding a maintenance touch-point.
**Why it happens:** Some Shiki theme docs reference JSON import for custom themes, and authors apply the same pattern to bundled themes.
**How to avoid:** For bundled themes (Vesper is bundled — file present in `shikijs/textmate-grammars-themes/packages/tm-themes/themes/vesper.json`, exposed via Shiki's bundled-theme alias), pass the **string name only**: `theme: 'vesper'`. Shiki will tree-shake unused themes from the bundle.
**Warning signs:** any task that imports a `.json` from `shiki` directly.

### Pitfall 3: `keepBackground: true` (the default) overrides our `--color-surface-2` fill
**What goes wrong:** Code block renders with Vesper's native background (a dark gray slightly lighter than `#0a0a0a` but slightly darker than `#141414`) instead of our `--color-surface-2`. Visually inconsistent with callouts.
**Why it happens:** rehype-pretty-code's `keepBackground` default is `true` — it inlines a `style="background-color: ..."` on `<pre>` from the theme.
**How to avoid:** Set `keepBackground: false` in the rehype-pretty-code options. Then style `<pre>` via Tailwind (`bg-[color:var(--color-surface-2)]` in the `.prose` rule).
**Warning signs:** any code block in the deployed page rendering with a different background than callouts; unexpected inline `style` attribute on `<pre>`.

### Pitfall 4: Turbopack rejects function-reference plugin registration
**What goes wrong:** Plan author writes `rehypePlugins: [rehypePrettyCode]` (function reference). Build fails with the loader-options-not-serializable error.
**Why it happens:** Turbopack runs in Rust and serializes the loader options for cross-thread transport. JavaScript functions aren't serializable.
**How to avoid:** Always use string-form: `rehypePlugins: ['rehype-slug', ['rehype-autolink-headings', options], ['rehype-pretty-code', options]]`. Phase 2's `next.config.ts` comment already explains this for `'remark-frontmatter'`; the same constraint applies to all Phase 3 plugins.
**Warning signs:** any Phase 3 task that imports a rehype plugin's default export at the top of `next.config.ts` (the import is unnecessary and signals likely function-form usage).

### Pitfall 5: Dynamic import path must include the `.mdx` extension
**What goes wrong:** Plan author writes `await import(\`@/content/projects/${slug}\`)` (no extension). Module resolution fails.
**Why it happens:** Turbopack/Webpack template-literal `import()` doesn't add the `.mdx` extension automatically.
**How to avoid:** Always include the extension: `await import(\`@/content/projects/${slug}.mdx\`)`. Next.js docs explicitly call this out: *"Ensure you specify the .mdx file extension in your import."*
**Warning signs:** runtime `Cannot find module` error in the page test.

### Pitfall 6: Static-export-style errors from `params` being a Promise
**What goes wrong:** Plan author writes `function Page({ params }: { params: { slug: string } })` (synchronous). TypeScript/runtime errors because `params` is a Promise in Next.js 15+.
**Why it happens:** Next.js 15 made `params` async to support Streaming.
**How to avoid:** `params: Promise<{ slug: string }>` and `const { slug } = await params`. Same pattern Phase 2 should already use; Phase 3 page + generateMetadata both follow it.

### Pitfall 7: `rehype-autolink-headings` `behavior: 'wrap'` makes the whole heading clickable
**What goes wrong:** Plan author copies the example from CCRsxx/portofolio (`behavior: 'wrap'`). The whole H2 becomes one giant click target; click-and-drag text selection on the heading misfires; the focus ring renders around the entire H2 (visually loud at display sizes).
**Why it happens:** `'wrap'` is the documented default-feeling behavior in many tutorials.
**How to avoid:** Use `behavior: 'append'` (per UI-SPEC). The anchor sits AFTER the heading text and has its own small `#` glyph. Heading text remains plain (selectable, non-clickable).
**Warning signs:** any task specifying `behavior: 'wrap'` for `rehype-autolink-headings`.

### Pitfall 8: `metadataBase` not set → relative OG image URLs break in unfurlers
**What goes wrong:** OG image URL in `<meta>` resolves to `/og-default.png` (relative). Twitter / LinkedIn / iMessage unfurlers can't fetch it because they don't know the site origin.
**Why it happens:** `metadataBase` was forgotten in Phase 1 root layout.
**Status:** **Already shipped in Phase 1.** Verified `app/layout.tsx` line 8: `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://olivelliott.dev')`. Phase 3 inherits and only adds `alternates.canonical = '/projects/${slug}'` per page.
**Action for Phase 3:** None. Test that the inherited `metadataBase` is in place via the existing `tests/layout.test.tsx` `metadataBase` assertion.

### Pitfall 9: `notFound()` thrown after `await import()` causes a build-time error
**What goes wrong:** Plan author orders the page body as `await import()` BEFORE `if (!project) notFound()`. The dynamic import for an unknown slug fails at build time before the `notFound()` check can fire.
**Why it happens:** Module resolution happens before the conditional.
**How to avoid:** Order: `getProject(slug)` → `if (!project) notFound()` → THEN `await import(\`@/content/projects/${slug}.mdx\`)`. The `notFound()` call short-circuits the function via React's notFound mechanism; the import never runs for unknown slugs. **Combined with `dynamicParams = false`**, unknown slugs hit `app/not-found.tsx` BEFORE the page body runs at all — but order still matters defensively.

### Pitfall 10: `<Image>` `sizes` mismatch causes CLS or unnecessary download
**What goes wrong:** Hero Variant A renders with `sizes="100vw"` even though the image col is 50% on `md+`. Next.js downloads the wrong-sized image; LCP regresses.
**Why it happens:** Default `sizes` is `100vw`.
**How to avoid:** Per UI-SPEC §"Variant A: image-present hero": `sizes="(min-width: 768px) 50vw, 100vw"`. Same discipline applies to `<Figure>` (`(min-width: 768px) 65ch, 100vw` for default-width, `(min-width: 768px) 1024px, 100vw` for `wide`) — UI-SPEC §"Component Inventory #5" specifies these.
**Warning signs:** any `<Image>` with a default `sizes` or `sizes="100vw"` on a column that's narrower than the viewport on `md+`.

### Pitfall 11: `await import()` template literal must reference a literal directory prefix
**What goes wrong:** Plan author writes `await import(\`${someVariable}/${slug}.mdx\`)` (variable directory). Bundler can't resolve at build time because it doesn't know which directory to scan.
**Why it happens:** Turbopack/Webpack need a literal directory prefix to know which files to include in the bundle.
**How to avoid:** Always use a literal directory prefix: `await import(\`@/content/projects/${slug}.mdx\`)`. The `@/content/projects/` part is literal; only the filename portion is dynamic.
**Warning signs:** any test for the page that fails with "Cannot resolve module" on a slug that exists in `content/projects/`.

### Pitfall 12: Vitest can't process `.mdx` imports without explicit configuration
**What goes wrong:** `tests/projects/page.test.tsx` tries to render the page; Vitest's import of `myco.mdx` fails because there's no MDX loader in the Vitest pipeline.
**Why it happens:** Vitest doesn't go through Next.js's `withMDX` wrapper. The Phase 2 tests work because they only read `body` strings via `gray-matter`, never compile MDX.
**How to avoid:** **Don't render the actual MDX in unit tests.** Two viable strategies:
1. **Mock `@/content/projects/*.mdx` in vitest.config.ts** — alias to a stub that exports a no-op component. Test the page composition (hero, MDX placeholder, next block), not the MDX rendering.
2. **Verify MDX rendering via build output** — write a Phase-3-end build smoke test (`tests/projects/build-output.test.ts`) that runs `next build`, then reads the prerendered HTML at `.next/server/app/(site)/projects/myco.html` (or equivalent) and asserts on the rendered HTML structure (Problem/Approach/Outcome H2s, anchor `#` markers, code-block tokens).

**Recommended for Phase 3:** strategy #1 for unit tests + a separate smoke test that asserts on the loaded MDX `body` string from `lib/content.ts` (the same test pattern Phase 2 already uses, see `tests/content/content-load.test.ts` lines 104–123 which already check Problem/Approach/Outcome are in the body). The build-output test is overkill for Phase 3; defer to Phase 6's deployed-Lighthouse pass.
**Warning signs:** any test file that imports a `.mdx` file directly without first stubbing it.

## Code Examples

Verified patterns from current sources (Next.js 16 docs + production rehype-pretty-code Next.js configs + this repo's existing Phase 2 implementation).

### `next.config.ts` — Phase 3 extension (full file)

```ts
// Source: synthesis of Phase 2 next.config.ts + Next.js 16 docs §"Using Plugins with Turbopack" + RubricLab/website + ccrsxx/portofolio
import type { NextConfig } from 'next'
import createMDX from '@next/mdx'

/** @type {import('rehype-pretty-code').Options} */
const rehypePrettyCodeOptions = {
  // Bundled Shiki theme — string form, no JSON import needed.
  // Vesper is verified bundled in shikijs/textmate-grammars-themes/packages/tm-themes/themes/vesper.json
  theme: 'vesper',
  // Don't paint the theme's native background; we apply --color-surface-2 via .prose pre rule
  keepBackground: false,
  // Untagged code blocks still get tokenized for visual consistency
  defaultLang: 'plaintext',
}

const rehypeAutolinkHeadingsOptions = {
  // Append the anchor AFTER the heading text — UI-SPEC §"Heading anchor"
  // (NOT 'wrap' — wrap makes the whole heading clickable)
  behavior: 'append',
  properties: {
    className: ['anchor'],
    ariaLabel: 'Link to section',
  },
  content: {
    type: 'element',
    tagName: 'span',
    properties: { ariaHidden: 'true' },
    children: [{ type: 'text', value: '#' }],
  },
}

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    // String form is mandatory for Turbopack — Next.js 16 docs §"Using Plugins with Turbopack".
    // Phase 2 already locked this for 'remark-frontmatter' (see comment in pre-existing next.config.ts).
    remarkPlugins: ['remark-frontmatter'],
    rehypePlugins: [
      'rehype-slug',
      ['rehype-autolink-headings', rehypeAutolinkHeadingsOptions],
      ['rehype-pretty-code', rehypePrettyCodeOptions],
    ],
  },
})

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  poweredByHeader: false,
  reactStrictMode: true,
}

export default withMDX(nextConfig)
```

### `mdx-components.tsx` — Phase 3 extension

```tsx
// Source: UI-SPEC §"Component map (mdx-components.tsx registration)"
import type { MDXComponents } from 'mdx/types'
import { Callout } from '@/components/mdx/callout'
import { Figure } from '@/components/mdx/figure'
import { Gallery } from '@/components/mdx/gallery'

const components: MDXComponents = {
  Figure,
  Gallery,
  Callout,
  // h2 / h3 / pre / code / inline-code: styled via Tailwind in app/globals.css `.prose` class.
  // No JSX overrides needed — rehype plugins handle slug/anchor/syntax tokenization at build time.
}

export function useMDXComponents(): MDXComponents {
  return components
}
```

### `app/(site)/projects/[slug]/page.tsx` — full RSC page

(See "Pattern 1" above — full file is shown there.)

### `lib/next-project.ts` — Next-project algorithm helper

```ts
// Source: UI-SPEC §"Component Inventory #10 (RelatedProjectFallback)"
import { getAll, getRelatedProjects } from '@/lib/projects'

export function getNextProject(currentSlug: string):
  | { slug: string; title: string; tagline: string }
  | null {
  // 1. Try top-overlap (single related project)
  const related = getRelatedProjects(currentSlug, 1)
  if (related.length === 1 && related[0]) {
    const p = related[0]
    return { slug: p.slug, title: p.title, tagline: p.tagline }
  }
  // 2. Fall back to cyclic order
  const all = getAll()
  if (all.length <= 1) return null  // single-project case → caller renders "all projects" variant
  const idx = all.findIndex((p) => p.slug === currentSlug)
  if (idx === -1) return null  // unknown slug; defensive
  const nextIdx = (idx + 1) % all.length
  const next = all[nextIdx]!
  return { slug: next.slug, title: next.title, tagline: next.tagline }
}
```

### `app/globals.css` — Phase 3 additions (`.prose` + `.anchor`)

```css
/* Source: UI-SPEC §"Heading anchor (rehype-autolink-headings configuration)" + §"Page Composition" */

/* Prose container — body width measure + heading rhythm + anchor display behavior */
.prose {
  /* Width and centering applied via the wrapping <MDXProse> component (max-w-[65ch] mx-auto) */
}

.prose h2 {
  font-size: var(--text-h2);
  line-height: var(--text-h2--line-height);
  font-weight: var(--font-weight-semibold);
  letter-spacing: -0.015em;
  color: var(--color-text-primary);
  margin-top: 3rem;       /* mt-12 — section heading rhythm */
}
@media (min-width: 768px) {
  .prose h2 {
    font-size: 1.75rem;   /* H2 mobile→desktop ramp */
    margin-top: 4rem;
  }
}

.prose h3 {
  font-size: var(--text-h3);
  line-height: var(--text-h3--line-height);
  font-weight: var(--font-weight-semibold);
  letter-spacing: -0.01em;
  color: var(--color-text-primary);
  margin-top: 2rem;
}

.prose p { margin-top: 1rem; line-height: 1.6; color: var(--color-text-primary); }
.prose p:first-child { margin-top: 0; }

.prose a {
  color: var(--color-accent);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
  transition: text-decoration-color var(--motion-duration-fast) linear,
              text-underline-offset var(--motion-duration-fast) ease-out;
}
.prose a:hover { color: var(--color-accent-hover); text-underline-offset: 3px; }

.prose code:not(pre code) {
  background-color: var(--color-surface-2);
  border-radius: var(--radius-sm);
  padding: 0.25rem 0.375rem;
  margin: 0 0.125rem;
  font-family: var(--font-mono);
  font-size: 0.9375em;
  color: var(--color-text-primary);
}

.prose pre {
  background-color: var(--color-surface-2);
  border: 1px solid var(--color-hairline);
  border-radius: var(--radius-md);
  padding: 1rem;
  margin: 2rem 0;
  overflow-x: auto;
  line-height: 1.625;
}

/* rehype-pretty-code emits these data-attributes; we style the line + filename label */
.prose pre [data-line] { display: block; padding: 0 1rem; }
.prose pre [data-highlighted-line] {
  background-color: rgba(255, 255, 255, 0.05);
  border-left: 2px solid var(--color-accent);
  padding-left: calc(1rem - 2px);
}
.prose figure[data-rehype-pretty-code-figure] { margin: 2rem 0; }
.prose [data-rehype-pretty-code-title] {
  display: block;
  background-color: var(--color-surface-2);
  border: 1px solid var(--color-hairline);
  border-bottom: none;
  border-top-left-radius: var(--radius-md);
  border-top-right-radius: var(--radius-md);
  padding: 0.5rem 1rem;
  font-family: var(--font-mono);
  font-size: var(--text-label);
  color: var(--color-text-secondary);
  margin-bottom: -1px;
}
.prose [data-rehype-pretty-code-title] + pre {
  margin-top: 0;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

/* Heading anchor — invisible at rest, visible on heading hover/focus */
.prose .anchor {
  margin-left: 0.5rem;
  display: inline-block;
  opacity: 0;
  color: var(--color-text-tertiary);
  font-family: var(--font-mono);
  text-decoration: none;
  transition: opacity var(--motion-duration-base) var(--motion-ease-standard),
              color var(--motion-duration-fast) linear;
}
.prose h2:hover .anchor,
.prose h3:hover .anchor,
.prose .anchor:focus-visible {
  opacity: 1;
}
.prose .anchor:hover,
.prose .anchor:focus-visible {
  color: var(--color-accent);
}

/* Reduced-motion: anchors permanently visible (preserves affordance without hover requirement) */
@media (prefers-reduced-motion: reduce) {
  .prose .anchor { opacity: 1; }
}

/* Ordered + unordered list spacing */
.prose ul, .prose ol { margin-top: 1rem; padding-left: 1.5rem; }
.prose li { margin-top: 0.5rem; line-height: 1.6; color: var(--color-text-primary); }
.prose ul { list-style: disc; }
.prose ol { list-style: decimal; }
```

### Tag chip row example (RSC, no client JS)

```tsx
// components/projects/tag-chip-row.tsx
// Source: UI-SPEC §"Component Inventory #3 (TagChipRow)"
import type { Tag } from '@/lib/tags'

interface TagChipRowProps {
  tags: readonly Tag[]
}

export function TagChipRow({ tags }: TagChipRowProps) {
  return (
    <>
      {tags.map((tag) => (
        <a
          key={tag}
          href={`/projects?tag=${tag}`}
          className="
            inline-flex items-center px-3 py-2 -my-2
            bg-[color:var(--color-surface-2)] rounded-sm
            font-mono text-[0.875rem] font-medium tracking-[0.02em] lowercase
            text-[color:var(--color-text-secondary)]
            hover:text-[color:var(--color-text-primary)]
            transition-colors duration-[120ms] ease-linear
          "
        >
          {tag}
        </a>
      ))}
    </>
  )
}
```

## Verified Existing Implementation (consumed by Phase 3)

These items are **already in place** from Phase 1 and Phase 2; the planner should NOT create tasks to re-build them. Verified by direct file reads on 2026-05-15.

| Asset | Location | Phase 3 dependency |
|-------|----------|---------------------|
| `metadataBase` set in root layout | `app/layout.tsx` line 8: `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://olivelliott.dev')` | Phase 3's `alternates.canonical` resolves against this. |
| `titleTemplate` set in root layout | `app/layout.tsx` line 9–12: `title: { default: 'olivelliott.dev', template: '%s · olivelliott.dev' }` | Phase 3's per-page `title: project.title` automatically becomes e.g. `Myco · olivelliott.dev`. |
| `(site)` layout shell with `<main id="main">` | `app/(site)/layout.tsx` — MotionProvider → SkipLink → Nav → main → Footer | Phase 3's `app/(site)/projects/[slug]/page.tsx` slots into this shell automatically. |
| Custom 404 page | `app/not-found.tsx` | Phase 3's `notFound()` call (and `dynamicParams = false`) routes unknown slugs here. Existing copy (`404 / not found — that route doesn't exist yet. / → back home`) is locked. |
| MotionProvider with `LazyMotion strict` + `MotionConfig reducedMotion="user"` | `components/motion/motion-provider.tsx` | Phase 3's `<m.h2>` inside `<NextProjectBlock>` inherits both. The `m.*` import is mandatory (NOT `motion.*`). |
| `cn()` helper | `lib/utils.ts` (clsx + tailwind-merge) | Phase 3 components use for conditional class composition. |
| Project query API | `lib/projects.ts`: `getAll()`, `getProject(slug)`, `getRelatedProjects(slug, limit)` | Phase 3 page + `getNextProject` helper consume these directly. No new query helpers needed. |
| Project schema with privacy transform | `lib/schemas.ts`: `ProjectFrontmatterSchema` strips `links.repo` for private + adds `code-private` tag | Phase 3 trusts the parsed object; conditional rendering branches on `project.visibility === 'private'`. |
| Tag enum | `lib/tags.ts`: `TAGS` const (11 tags including `code-private`) + `TAG_LABELS` map | Phase 3 `TagChipRow` accepts `readonly Tag[]`. |
| Myco MDX content | `content/projects/myco.mdx` (902 words, Problem → Approach → Outcome H2s, schema-validated, redaction-clean) | Phase 3 dynamic-imports this file directly. |
| Tokens with hairline + surface-2 + accent | `styles/tokens.css` (Phase 1 declared all colors + spacing + motion + Phase-1-active radii) | Phase 3 only **adds** `--text-h2`, `--text-h3`, `--font-weight-semibold` to the existing `@theme` block. |
| Global `.focus-visible` styling | `app/globals.css` lines 45–55: `:where(a, button, ...):focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }` | Phase 3 inherits — no per-component focus styling needed except NextProjectBlock's `outline-offset: 4px` override (see UI-SPEC §"NextProjectBlock"). |
| Reduced-motion CSS floor | `app/globals.css` lines 32–41: collapses all transitions to 0.01ms under `prefers-reduced-motion: reduce` | Phase 3 motion (anchor opacity, chip color, repo link color, NextProjectBlock underline) inherits. The `<m.h2>` translateX is suppressed by `MotionConfig reducedMotion="user"`. |
| `server-only` + Vitest stub | `lib/content.ts` imports `'server-only'`; `vitest.config.ts` aliases to `tests/stubs/server-only.ts` | Phase 3's page imports from `lib/projects.ts` (which imports from `lib/content.ts` which uses `server-only`) — Vitest already handles this. |

## State of the Art

| Old approach | Current approach | When changed | Impact |
|--------------|------------------|--------------|--------|
| `next-mdx-remote` for serialized MDX rendering | `@next/mdx` + dynamic `import()` (build-time compilation, RSC-native) | `next-mdx-remote` archived 2026-04-09 | Eliminates the serialize/deserialize boundary; full RSC compatibility; better LCP/TTI; smaller client bundle. |
| `Contentlayer` for typed MDX with build-step manifest generation | `@next/mdx` + Zod (Phase 2 already shipped this) | Contentlayer abandoned by maintainer (2024); compatibility broke with Next 14+ | Zero pre-build script, zero generated manifest file, faster `next build`, simpler dev loop. |
| Function-reference rehype plugins | String-form plugin registration under Turbopack | Next.js 14 / Turbopack alpha → 16.2 stable | Plugins must be passed as `'plugin-name'` or `['plugin-name', optionsObject]` tuples; function references break with #76739. Trade-off: cannot use callback options (`onVisitLine`, `onVisitTitle`, etc.) without disabling Turbopack. Phase 3 works around this by relying on rehype-pretty-code's emitted `data-*` attributes + CSS, not callbacks. |
| `prismjs` runtime tokenization | `shiki` build-time tokenization via `rehype-pretty-code` | Shiki + RSC ecosystem matured 2024–2026 | Zero client JS for code blocks; uses VS Code's actual tokenizer (more accurate than Prism); supports any VS Code theme. |
| `rehype-pretty-code` `metastring: '{filename="x"}'` (legacy / older syntax) | `title="x"` (no braces, no `filename` attribute name) | rehype-pretty-code v0.6+ standardized on `title="..."` | The `{filename="..."}` syntax referenced in UI-SPEC is from a different library (or an outdated tutorial). **Plan must use `title="..."`**. |

**Deprecated/outdated:**
- **Tailwind Typography plugin (`@tailwindcss/typography`)**: not deprecated, but inappropriate for Phase 3 — its defaults override our token discipline. Hand-author the `.prose` class instead.
- **`@vercel/og` synchronous shape**: the Phase 6 dynamic-OG-image work will use `next/og` (the renamed/rebased successor), not the standalone `@vercel/og` package.
- **`framer-motion` (the legacy package name)**: forbidden by locked stack; use `motion` and import from `motion/react`. Phase 3's NextProjectBlock uses `import { m } from 'motion/react'` (verified in `components/motion/motion-provider.tsx`).

## Open Questions

1. **`/og-default.png` does not yet exist** (verified — `public/` only contains `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`).
   - What we know: UI-SPEC requires this asset for the OG fallback chain when a project's hero is the placeholder. Myco currently triggers this fallback.
   - What's unclear: whether Phase 3 should stub it (typographic placeholder PNG) or defer to Phase 6.
   - **Recommendation:** Phase 3 plan includes a small Wave 0 task to stub `/public/og-default.png` (1200×630 PNG with the site wordmark + tagline on the dark background — can be exported from any tool, or generated via a one-off `next/og` ImageResponse script and saved as PNG). This unblocks shareable URLs in Phase 3 dev/preview without waiting for Phase 6's full OG audit. Alternative: skip and accept that pre-Phase-6 Twitter/LinkedIn unfurls of `/projects/myco` will show a broken image; document the gap explicitly in the Phase 3 SUMMARY.

2. **NextProjectBlock single-project case in Phase 3** — Myco is the only project until Phase 7's content pass.
   - What we know: UI-SPEC §"Single-project case" gives the exact markup (links to `/projects` with `all projects →` eyebrow). The link target's destination page (`/projects` index) doesn't exist until Phase 4.
   - What's unclear: nothing — UI-SPEC explicitly says "This is acceptable. Phase 4 fills in the destination without changing this contract."
   - **Recommendation:** ship the single-project variant; document in Phase 3 SUMMARY that the link target hits the custom 404 until Phase 4 completes.

3. **Do we install `shiki@^3.x` or `shiki@^4.x`?**
   - What we know: Both work with `rehype-pretty-code@0.14.3` per its peer range. Vesper is bundled in both. The official rehype-pretty-code Next.js example uses `shiki@^4.0.1`. Real-world late-2025/early-2026 production codebases lean toward 1.x or 3.x.
   - What's unclear: whether shiki 4.x has any subtle API differences that surface only in obscure edge cases (e.g., transformer signatures, ANSI rendering).
   - **Recommendation:** start with `shiki@^3.23.0` for Phase 3 (Wave 0). If Wave 0's MDX smoke test passes (Vesper renders, Geist Mono is the font, dark background applies), keep it. The risk surface is genuinely small either way; pinning to 3.x just adds 30 days of additional ecosystem soak time.

4. **Test strategy for the MDX-rendered page** (Pitfall 12).
   - What we know: Vitest doesn't process `.mdx` natively; Phase 2's tests work because they only read `body` strings.
   - What's unclear: whether to mock `.mdx` imports in vitest.config.ts (option A) or skip the page's MDX-rendering assertions in unit tests and rely on Phase 6's deployed Lighthouse for end-to-end verification (option B).
   - **Recommendation:** option B for Wave 2's `tests/projects/page.test.tsx` — mock the `.mdx` import via `vi.mock(\`@/content/projects/${slug}.mdx\`)` returning a stub component. The unit test asserts on the page composition (renders `<ProjectHero>`, renders `<MDXProse>` with the stub MDX child, renders `<NextProjectBlock>`), not on the MDX content itself. The Myco MDX content assertions already live in `tests/content/content-load.test.ts` (Problem/Approach/Outcome H2s, 800–1200 word range) — those don't need duplication. Build-output verification is deferred to Phase 6.

## Environment Availability

| Dependency | Required by | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Node.js | runtime + build | ✓ | engines.node `>=20.18.0` (package.json) | — |
| pnpm | install + build | ✓ | 9.15.9 (packageManager pin in package.json) | — |
| Next.js | framework | ✓ (installed) | 16.2.4 | — |
| `@next/mdx` | MDX compilation | ✓ (installed) | 16.2.4 | — |
| `rehype-pretty-code` | syntax highlighting | ✗ (Phase 3 install) | will install ^0.14.3 | — |
| `shiki` | syntax tokenizer | ✗ (Phase 3 install) | will install ^3.23.0 | — |
| `rehype-slug` | heading IDs | ✗ (Phase 3 install) | will install ^6.0.0 | — |
| `rehype-autolink-headings` | heading anchors | ✗ (Phase 3 install) | will install ^7.1.0 | — |
| `sharp` (for `next/image`) | hero image optimization | ✓ (installed) | 0.34.5 | — |
| Vitest | unit + integration tests | ✓ (installed) | ^3 | — |

**Missing dependencies with no fallback:** None — all four new dependencies are vanilla npm installs with no native compilation or external service requirements.

**Missing dependencies with fallback:** None.

**External services / platform dependencies:** None for Phase 3 (no API calls, no auth providers, no databases). The MDX pipeline runs entirely at build time. Vercel deployment is inherited from Phase 1.

## Validation Architecture

**Status:** ENABLED (`workflow.nyquist_validation: true` in `.planning/config.json`).

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 3.x with jsdom + @testing-library/react |
| Config file | `vitest.config.ts` (existing — Phase 1) |
| Quick run command | `pnpm test:ci tests/projects tests/mdx` |
| Full suite command | `pnpm test:ci` |
| Pre-commit hook | none configured; Biome handles format/lint |

### Phase Requirements → Test Map

| Req ID | Behavior | Test type | Automated command | File exists? |
|--------|----------|-----------|-------------------|---------------|
| **PRJ-01** | `/projects/[slug]` renders statically with `dynamicParams = false` and `generateStaticParams` enumerates from `getAll()` | RSC render + source assertion | `pnpm test:ci tests/projects/page.test.tsx` | ❌ Wave 2 |
| **PRJ-01** | Unknown slug calls `notFound()` (renders Phase 1's 404) | RSC render | `pnpm test:ci tests/projects/page.test.tsx` (notFound-on-unknown-slug case) | ❌ Wave 2 |
| **PRJ-02** | MDX components Figure / Gallery / Callout render with expected DOM shape | unit (RTL) | `pnpm test:ci tests/mdx/components.test.tsx` | ❌ Wave 1 |
| **PRJ-02** | `mdx-components.tsx` registers Figure/Gallery/Callout in the components map | source assertion | `pnpm test:ci tests/mdx/registration.test.ts` | ❌ Wave 1 |
| **PRJ-02** | `next.config.ts` rehype chain includes slug + autolink + pretty-code in correct order | source assertion | `pnpm test:ci tests/mdx/pipeline.test.ts` | ❌ Wave 0 |
| **PRJ-02** | Build-output integration: code blocks in Myco MDX render with `data-rehype-pretty-code-figure` markers | manual + Phase 6 | manual `pnpm build && pnpm start` + visual inspection of `/projects/myco`; full automation deferred to Phase 6 | manual |
| **PRJ-03** | Myco MDX has Problem / Approach / Outcome H2 anchors | already covered | `pnpm test:ci tests/content/content-load.test.ts` (Phase 2 — lines 104–110) | ✅ Phase 2 |
| **PRJ-03** | Myco MDX is within 800–1200 word budget | already covered | `pnpm test:ci tests/content/content-load.test.ts` (Phase 2 — lines 111–117) | ✅ Phase 2 |
| **PRJ-04** | `<ProjectHero>` renders with title + tagline + year + tags | unit (RTL) | `pnpm test:ci tests/projects/project-hero.test.tsx` | ❌ Wave 2 |
| **PRJ-04** | `isPlaceholderHero(hero.src)` regex matches placeholder paths and rejects real artwork paths | unit (regex spec) | `pnpm test:ci tests/projects/hero-fallback.test.ts` | ❌ Wave 0 |
| **PRJ-04** | Text-only hero variant renders no `<img>` when `isPlaceholderHero` returns true | unit (RTL) | `pnpm test:ci tests/projects/project-hero.test.tsx` (text-only-variant case) | ❌ Wave 2 |
| **PRJ-05** | `getNextProject(currentSlug)` returns top-overlap related project when overlap ≥ 1 | unit | `pnpm test:ci tests/projects/next-project.test.ts` | ❌ Wave 2 |
| **PRJ-05** | `getNextProject` falls back to cyclic order when no overlap | unit | same file | ❌ Wave 2 |
| **PRJ-05** | `getNextProject` returns null for single-project corpus (Phase 3 reality) | unit | same file | ❌ Wave 2 |
| **PRJ-05** | `getNextProject` returns null for unknown slug | unit | same file | ❌ Wave 2 |
| **PRJ-05** | `<NextProjectBlock>` renders single-project variant when `next === null` | unit (RTL) | `pnpm test:ci tests/projects/next-project-block.test.tsx` | ❌ Wave 2 |
| **PRJ-05** | `<NextProjectBlock>` renders multi-project variant with title + tagline + link | unit (RTL) | same file | ❌ Wave 2 |
| **PRJ-06** | Page renders `code private` label when `project.visibility === 'private'` | unit (RTL with private fixture) | `pnpm test:ci tests/projects/project-meta.test.tsx` | ❌ Wave 2 |
| **PRJ-06** | Page does NOT render any anchor with the project's would-be repo URL when private | unit (negative DOM assertion) | same file | ❌ Wave 2 |
| **PRJ-06** | Tag chip row includes the auto-added `code-private` chip when private | unit (RTL) | `pnpm test:ci tests/projects/tag-chip-row.test.tsx` | ❌ Wave 2 |
| **PRJ-07** | `generateMetadata` returns title + description from frontmatter | unit (call generateMetadata directly) | `pnpm test:ci tests/projects/page-metadata.test.ts` | ❌ Wave 2 |
| **PRJ-07** | `generateMetadata` OG image follows precedence: ogImage → hero.src (when not placeholder) → /og-default.png | unit | same file (3 cases) | ❌ Wave 2 |
| **PRJ-07** | `generateMetadata` sets `alternates.canonical` to `/projects/${slug}` | unit | same file | ❌ Wave 2 |
| **PRJ-07** | `generateMetadata` sets Twitter card to `summary_large_image` reusing the OG image | unit | same file | ❌ Wave 2 |
| **PRJ-07** | `generateMetadata` returns `{}` for unknown slug (defensive) | unit | same file | ❌ Wave 2 |

### Sampling Rate

- **Per task commit:** `pnpm test:ci tests/projects tests/mdx` (Phase-3-scoped — fast, ~5–10s)
- **Per wave merge:** `pnpm test:ci` (full suite — includes Phase 1 + 2 tests)
- **Phase gate:** Full suite green + `pnpm typecheck` clean + `pnpm build` succeeds + visual inspection of `/projects/myco` in `pnpm dev` confirms (a) Vesper code-block tokens render, (b) Problem/Approach/Outcome H2s have visible-on-hover `#` anchors, (c) tag chips link to `/projects?tag=X`, (d) Myco renders text-only hero (no broken image rectangle), before `/gsd:verify-work`.

### Wave 0 Gaps

- [ ] `tests/mdx/pipeline.test.ts` — covers PRJ-02 (rehype chain order assertion via `next.config.ts` source read)
- [ ] `tests/projects/hero-fallback.test.ts` — covers PRJ-04 (`isPlaceholderHero` regex)
- [ ] Stub `/public/og-default.png` (1200×630 typographic PNG) — required for PRJ-07 OG fallback path. Can be generated via a one-off `next/og` ImageResponse script + screenshot, or hand-authored. Document path so Phase 6 can replace.
- [ ] Append H2 / H3 / `--font-weight-semibold` tokens to `styles/tokens.css` (additive — do NOT touch existing tokens)
- [ ] Append `.prose` + `.anchor` CSS to `app/globals.css` (additive)

### Wave 1 Gaps

- [ ] `tests/mdx/components.test.tsx` — RTL smoke tests for `<Figure>`, `<Gallery>`, `<Callout>` (each variant)
- [ ] `tests/mdx/registration.test.ts` — source assertion that `mdx-components.tsx` registers all three components

### Wave 2 Gaps

- [ ] `tests/projects/page.test.tsx` — covers PRJ-01 (RSC render of valid slug + notFound on invalid slug; mock the `.mdx` import per Pitfall 12)
- [ ] `tests/projects/project-hero.test.tsx` — covers PRJ-04 (image-vs-text branching, both variants)
- [ ] `tests/projects/project-meta.test.tsx` — covers PRJ-06 (`code private` label rendering, negative repo-URL assertion)
- [ ] `tests/projects/tag-chip-row.test.tsx` — covers PRJ-06 (chip row including auto-added code-private chip)
- [ ] `tests/projects/next-project.test.ts` — covers PRJ-05 (algorithm — 4 cases)
- [ ] `tests/projects/next-project-block.test.tsx` — covers PRJ-05 (component rendering — single-project + multi-project variants)
- [ ] `tests/projects/page-metadata.test.ts` — covers PRJ-07 (generateMetadata — 5 cases)

**Test infrastructure already in place:**
- Vitest 3.x with jsdom (`vitest.config.ts`)
- @testing-library/react + @testing-library/jest-dom + @testing-library/user-event (devDependencies)
- `@/*` path alias (vitest.config.ts + tsconfig.json)
- `server-only` stub for tests (vitest.config.ts alias to `tests/stubs/server-only.ts`)
- Test fixture conventions (`tests/fixtures/projects/*.mdx`) — including `valid-private.mdx` which Phase 3 can reuse for the privacy rendering tests

## Sources

### Primary (HIGH confidence)

- **Next.js 16.2 docs §"How to use markdown and MDX in Next.js"** (https://nextjs.org/docs/app/guides/mdx, fetched 2026-05-15, version 16.2.6) — verbatim dynamic-import pattern, `mdx-components.tsx` requirement, string-form Turbopack plugin registration, frontmatter handling
- **rehype-pretty-code official docs** (gh API: `repos/rehype-pretty/rehype-pretty-code/contents/docs/src/content/docs/index.mdx`, fetched 2026-05-15) — `title="..."` metastring syntax (NOT `{filename="..."}`), options shape, theme handling, transformers, plugin output `data-*` attributes
- **rehype-pretty-code official Next.js example** (`examples/next/next.config.mjs`, master branch, fetched 2026-05-15) — verified `[rehypePrettyCode, options]` registration pattern; `keepBackground: false` use case
- **shikijs/textmate-grammars-themes** (gh API: `repos/shikijs/textmate-grammars-themes/contents/packages/tm-themes/themes`, fetched 2026-05-15) — confirmed `vesper.json` is bundled, accessible by string name
- **npm registry** (`npm view <package> version` for all four new deps, run 2026-05-15) — pinned versions
- **Phase 1 + Phase 2 source code** (read directly: `app/layout.tsx`, `app/(site)/layout.tsx`, `app/globals.css`, `app/not-found.tsx`, `lib/projects.ts`, `lib/schemas.ts`, `lib/content.ts`, `lib/tags.ts`, `mdx-components.tsx`, `next.config.ts`, `styles/tokens.css`, `tests/content/content-load.test.ts`, `vitest.config.ts`, `tsconfig.json`, `biome.json`, `package.json`) — confirmed `metadataBase`, `titleTemplate`, MotionProvider, layout shell, query API, schema, fixtures all in place
- **Phase 3 UI-SPEC** (`.planning/phases/03-project-detail-template/03-UI-SPEC.md`, status: approved 2026-05-15) — every component spec, color/motion/spacing/typography token, copy string, accessibility constraint, anti-pattern list
- **Phase 3 CONTEXT.md** (`.planning/phases/03-project-detail-template/03-CONTEXT.md`, status: ready for planning 2026-05-15) — locked decisions, Claude's discretion areas, deferred ideas

### Secondary (MEDIUM confidence — production codebases as cross-reference)

- **`gilbarbara/react-joyride`** (`website/next.config.ts`) — Next.js + rehype-slug → rehype-autolink-headings → rehype-pretty-code chain order verification
- **`ccrsxx/portofolio`** (`next.config.ts`) — same plugin order; uses `behavior: 'wrap'` (counter-example for UI-SPEC's `'append'` choice)
- **`muzaffar640/commitpress`** (`next.config.ts`) — `[rehypePrettyCode, prettyCodeOptions]` tuple registration; uses `theme: 'one-dark-pro'`
- **`RubricLab/website`** (`next.config.ts`) — string-form `[['rehype-pretty-code', rehypeOptions]]` under Next.js + Turbopack (production validation of string-form-with-options)
- **`Nahida-aa/MdxHub`** (`next.config.ts`) — same string-form pattern with options object
- **`KingSora/OverlayScrollbars`** (`website/next.config.js`) — slug → autolink → pretty-code chain order

### Tertiary (LOW confidence — flagged for Wave 0 spike if needed)

- The exact behavior of `shiki@^4.x` versus `^3.x` for the Vesper-only single-language case has not been A/B tested in Phase 3. Recommendation pins `^3.23.0` based on broader ecosystem adoption; if `pnpm install` surfaces a peer warning, escalate to a 30-minute spike.

## Metadata

**Confidence breakdown:**

| Area | Level | Reason |
|------|-------|--------|
| Standard stack | HIGH | All four new deps verified against npm registry on 2026-05-15; existing 14 deps verified by direct `package.json` read |
| Architecture (page composition, dynamic import, RSC boundary) | HIGH | Verbatim Next.js 16.2 docs, with the exact pattern in §"Using dynamic imports" |
| Rehype plugin chain (order + string-form + options-tuple) | HIGH | Four production codebases corroborate; Next.js 16 docs explicitly prescribe string-form for Turbopack |
| Vesper Shiki theme | HIGH | File present in `shikijs/textmate-grammars-themes`; bundled-name string confirmed |
| `title=` metastring (vs UI-SPEC's `{filename=}`) | HIGH | rehype-pretty-code docs verbatim — direct fetch from gh API |
| OG fallback chain | HIGH | Pattern is locked in CONTEXT.md + UI-SPEC; only the `/og-default.png` asset itself is missing |
| Test strategy for MDX-rendered page | MEDIUM | Pitfall identified; recommendation requires a small spike in Wave 2 if mock approach has edge cases |
| Phase 1 verification (metadataBase, layout shell, etc.) | HIGH | Direct file reads on 2026-05-15 |
| Shiki v3 vs v4 pinning | MEDIUM | Recommendation based on ecosystem adoption inertia; both are technically supported by rehype-pretty-code |
| Vitest mock pattern for `.mdx` imports | MEDIUM | Standard Vitest pattern; not yet exercised in this codebase |

**Research date:** 2026-05-15
**Valid until:** 2026-06-15 (30 days for the stack core; 14 days for Shiki versioning if 4.x adoption accelerates)
