# Phase 4: Home + Projects Index — Research

**Researched:** 2026-05-16
**Domain:** Next.js 16 RSC (App Router) + `motion/react` (Motion v12) + URL-synced server filtering
**Confidence:** HIGH (every load-bearing decision is verified against current official docs or live source in the repo)

## Summary

Phase 4 is an integration phase. Every primitive needed already exists in the codebase: the query API (`getAll` / `getHeroProjects` / `getAllTags` / `getProjectsByTag`), the strict Zod-narrowed `Project` type, the design-token system, the `(site)` shell, the MotionProvider (`LazyMotion strict` + `MotionConfig reducedMotion="user"`), and a Vitest harness already configured to render RSC pages with `motion/react` proxy mocks. Nothing new needs to be installed.

The two routes (`/` home + `/projects` index) are RSC pages composing existing components and adding 8 new ones. The **only** client island Phase 4 introduces is `<ThesisParagraph>`. The filter on `/projects` is entirely server-rendered via the Next 16 `Promise<searchParams>` API — no `useSearchParams`, no client state, no router calls. Chips inside cards are `<span>` (presentational), filter chips are `<a>` (interactive) — this split avoids the nested-anchor invalidity that would otherwise short-circuit card hit areas.

**Primary recommendation:** Build the components in the order the UI-SPEC enumerates them (Components 1–11), splitting the work across roughly four waves: Wave 0 (TagFilterRow + EmptyFilterState + TierSeparator + CardMeta — leaf RSCs with no motion), Wave 1 (ProjectCardHero + ProjectCardSecondary — composing CardMeta), Wave 2 (HomeHero + HomeProjectGrid + `<ThesisParagraph>` client island), Wave 3 (the two page routes + per-route metadata + integration tests). The single load-bearing landmine is the **`useReducedMotion()` opacity gate** inside `<ThesisParagraph>` — see Pitfall 4. The UI-SPEC's assertion that `MotionConfig reducedMotion="user"` automatically collapses opacity fades is incorrect per the live Motion docs; opacity animations PERSIST when reduced-motion is on unless explicitly gated.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Home Hero & Thesis (HOM-01, HOM-04, HOM-05)**
- Composition: Single-column, left-aligned. Hero stack: large display wordmark `olive elliott` (replaces the Phase 1 placeholder "olivelliott.dev"), one-line role frame, 2–3 line thesis paragraph. Generous breathing room above the project grid.
- Thesis voice: Plain-spoken and specific — names projects in-sentence ("I work on Myco, Fathom, Agenda Keeper, and Aktiga…"). No buzzwords (passionate, innovative, transformative). Honest content; placeholders are explicitly placeholders if final copy isn't ready.
- One earned motion moment (HOM-05): Type-set entrance on the thesis paragraph — fades in word-by-word over ~600ms using `--motion-ease-standard` and the existing `--motion-duration-slow` token (reserved in Phase 1 for "Phase 4 hero moment only"). Reduced-motion → instant render. No scroll-tied motion, no cursor-reactive effects. This is the only motion on the home page beyond Phase 1's FadeIn.
- Hero → cards transition: Single hairline divider (`--color-hairline`) between hero block and project grid section. Section heading `selected work` rendered in `GeistMono` lowercase at label size (14px). No display-heading.

**ProjectCard Component & Tier Differentiation (HOM-02, HOM-03, PIX-04)**
- Hero-tier card: Wide horizontal card. Single-column on mobile; 1-up at lg+ (each hero card spans the full content width). Structure: title (H2 size, 24/28px), tagline (body), inline TagChipRow, 2–3 single-line outcome bullets, hero image right-aligned if `!isPlaceholderHero(hero.src)` else text-only with the title carrying the weight. Whole card is `<a href="/projects/${slug}">`. Reuses Phase 3 `isPlaceholderHero`.
- Secondary-tier card: Compact horizontal layout. 1-up on mobile, 2-up on md+, 3-up on lg+. Structure: title (H3 size, 20px), tagline (body), inline TagChipRow. No outcomes bullets, no hero image. Tighter padding. Same `<a>` wrapper.
- Private indicator on card: Static `code private` label rendered in `--color-text-tertiary`, placed in the meta row next to/below tag chips. Cards do NOT show a `repo ↗` link directly (that lives only on detail pages); the privacy contract here is purely the visible `code private` label.
- Hero-tier mono-prefix label (on /projects index only): `hero` rendered in `GeistMono` `--color-text-tertiary` at label size above the card title, marking position on the index page. NOT shown on the home page where card size already conveys tier.
- Hover / focus: Hairline border (`--color-hairline`) lifts to `--color-text-tertiary` on hover/focus; title underline appears in `--color-accent`. No scale, no shadow, no glow. CSS transitions on color/border only. Reduced-motion gating not required for color transitions per Phase 1's UI-SPEC anti-patterns clause.

**/projects Index Layout (PIX-01)**
- Top: page heading `all projects` in `GeistMono` lowercase, label size. Below: filter row (tag chips + active-filter indicator + clear). Below: hero-tier cards first (in `order` ascending), then a hairline divider with `secondary` mono lowercase label, then secondary-tier cards.
- Card variant on /projects: Use the **secondary-tier card shape** for all projects on this page — even hero-tier ones. The home page handles "weight" via large cards; the index trades weight for scanability. Hero distinction on the index comes from position + the `hero` mono prefix label.
- Empty filter result: Inline message in `--color-text-secondary`: `no projects tagged "${tag}" — view all projects →` with the link clearing the filter (`href="/projects"`).
- Tier separator: Hairline divider + `secondary` mono lowercase label on its own line. Hidden when the active filter results in zero secondary-tier matches.

**Tag Chip Filter — URL-synced (PIX-01, PIX-02, PIX-03)**
- Selection model: Single tag at a time. Click a chip → `?tag=local-first`. Click the active chip again → URL cleared. Click a different chip → URL replaced.
- Implementation: Server component reads `searchParams.tag`; calls `getProjectsByTag(tag)` if present else `getAll()`. Chips are `<a>` elements with proper `href` values (the active chip's href points to `/projects` to clear). No `useSearchParams`, no `'use client'`, no client-side state. Back button + reload restore the exact filter state natively.
- Active filter affordance: Active chip uses `--color-accent` background with `--color-text-on-accent` foreground. An inline `× clear filter` link appears next to the chip row when a tag is active. Inactive chips use `--color-surface-2` background with `--color-text-primary` foreground.
- Keyboard navigation (PIX-03): Native `<a>` elements — Tab through chips in DOM order, Enter/Space activates the link. Visible `:focus-visible` ring inherits from Phase 1 (2px accent outline + 2px offset). No custom keyboard handlers needed.
- Chip order: Use Phase 2's `getAllTags()` which returns chips sorted by `count desc`, then `tag` alphabetically asc.

**Routing**
- `app/(site)/page.tsx` — replaces the Phase 1 placeholder home page.
- `app/(site)/projects/page.tsx` — new file. Index of all projects.
- Both pages are RSC; the only `'use client'` directive is the existing motion island for the type-set thesis entrance (one small client component).
- `app/(site)/projects/[slug]/page.tsx` (Phase 3) is untouched.

### Claude's Discretion

- Exact spacing values between hero block and cards row (within token scale).
- Exact word-fade-in timing per word (within `--motion-duration-slow` budget).
- Whether the type-set motion uses `Motion`'s stagger primitives or a hand-rolled `useEffect` — pick whichever is cleaner; **reduced-motion gating must work explicitly** (see Pitfall 4).
- Component file layout under `components/projects/`: `project-card-hero.tsx` + `project-card-secondary.tsx` as separate files OR a single `project-card.tsx` with a `tier` prop. Pick whichever reads cleaner; tests assert the rendered DOM, not the file structure. **Recommendation:** separate files (see § "Component split — recommendation").
- Whether `getProjectsByTag('hero-tier')` needs special handling — likely not, since `tier` is a separate field; verify against the schema. **Verified — not a tag.** `TAGS` in `lib/tags.ts` does not include `hero` or `hero-tier`; `tier` is a top-level Project field (`'hero' | 'secondary'`), enforced by Zod `z.enum`. No edge case.
- Exact thesis paragraph copy — draft a placeholder Olive will revise in Phase 7's content pass. Mark explicitly with `{/* PLACEHOLDER: Phase 7 content pass */}`.

### Deferred Ideas (OUT OF SCOPE)

- Multi-tag selection (AND/OR semantics, URL like `?tag=local-first,autonomous`) — defer post-launch.
- Per-project accent color (Phase 1 deferred to v2 — CNT2-02).
- Cursor-reactive logo / hero detail.
- Pagination / virtualization on `/projects`.
- Sort UI (by year, by tag count, alphabetical).
- Image-grid view on `/projects`.
- Project search (full-text via Pagefind / FlexSearch).
- "Featured" or "latest" carousel above the hero.
- Tier separator with custom illustration / chrome.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| HOM-01 | Home page has a hero section with a one-sentence thesis | `<HomeHero>` + `<ThesisParagraph>` components; thesis copy locked as Phase 7-placeholder string in `app/(site)/page.tsx` |
| HOM-02 | Home page features the hero-tier projects with larger cards | `<ProjectCardHero>` + `getHeroProjects()` (already shipped Phase 2); composition pattern below |
| HOM-03 | Home page shows secondary-tier projects as smaller cards below the hero tier | `<ProjectCardSecondary>` + `getAll().filter(p => p.tier === 'secondary')`; section omitted entirely if zero (no "coming soon" placeholder) |
| HOM-04 | Home page layout is deliberately not a bento grid and does not use stagger-on-scroll | Vertical-stack composition; cards are static in viewport; no `whileInView`; UI-SPEC § Anti-Patterns list re-enforced |
| HOM-05 | Home page hero has an earned, restrained motion moment that respects reduced-motion | `<ThesisParagraph>` opacity-only per-word fade with `useReducedMotion()` gate (manual; `MotionConfig` does NOT cover opacity — Pitfall 4) |
| PIX-01 | `/projects` page lists all projects with a filterable tag chip row | `app/(site)/projects/page.tsx` + `<TagFilterRow>` + `getAllTags()`; RSC reads `searchParams.tag` |
| PIX-02 | Tag filter state is URL-synced so filters are shareable and back-button works | Native `<a>` navigation; no JS state; `searchParams` is a `Promise<{...}>` in Next 16 — must be `await`ed (Pitfall 1) |
| PIX-03 | Tag chips are fully keyboard-navigable with visible focus styles | Native `<a>` elements; Phase 1 global `:focus-visible` outline already applies; `aria-pressed` for SR distinction |
| PIX-04 | Project cards visually indicate hero vs secondary tier and public vs private | Tier: card size on home, `hero` mono prefix label on index. Privacy: literal `code private` label in meta row (already shipped pattern from Phase 3 `<ProjectMeta>`) |
</phase_requirements>

---

## Project Constraints (from CLAUDE.md)

These directives are extracted from `./CLAUDE.md` and carry the same authority as locked CONTEXT.md decisions. The plan must not contradict them.

- **GSD Workflow Enforcement:** All Phase 4 file edits land via `/gsd:execute-phase`. No direct Edit/Write outside the workflow.
- **Tech stack lock:** Next.js App Router (16.2.x), React 19.2, TypeScript strict. No CMS, no auth, no global state library.
- **Hosting:** Vercel; deploy on every `main` push (already wired in Phase 1).
- **Content delivery:** Project content in-repo (MDX). Phase 4 does not touch `content/projects/` — it consumes the existing pipeline.
- **Aesthetic:** Dark theme, minimalist, high-touch. Reference: wallofportfolios.in. No generic AI-template tells (gradient blobs, glassmorphism, scale-hover, bento grid).
- **Performance budget:** Lighthouse ≥ 90 on landing + hero pages. Phase 4 motion (one opacity fade) must not cause CLS. No transforms on the thesis paragraph.
- **Accessibility:** WCAG AA. Reduced-motion respected. Keyboard nav for all interactions. Single `<h1>` per route.
- **Privacy:** No internal Aktiga details. Card-level privacy contract is the `code private` label only — no repo links on cards. The card never competes with the detail page for the privacy signal.
- **Content honesty:** Placeholders are explicitly placeholders. Thesis paragraph in Phase 4 is marked with a comment for the Phase 7 reviewer.
- **MCP / Myco:** No direct relevance to Phase 4 implementation.
- **Banned words (chrome):** `passionate, scalable solutions, cutting-edge, 10x, crafted, seamless, leveraging, synergy, rockstar, ninja, innovative, transformative, ecosystem, paradigm, next-generation`.
- **No emoji in chrome:** Eyebrows, labels, headings, chips, empty-state copy carry zero emoji. The `×`, `→`, `·` characters are typographic glyphs, allowed.

---

## Standard Stack

### Core (already installed — versions verified against `package.json` 2026-05-16)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `next` | `16.2.4` | App Router, RSC, `Promise<searchParams>` props, file-system routing | Locked Phase 1; Next 16 makes both `params` and `searchParams` async — see § "Next 16 searchParams API" |
| `react` | `19.2.4` | UI runtime | Locked Phase 1 |
| `react-dom` | `19.2.4` | DOM renderer | Locked Phase 1 |
| `typescript` | `5.7.3` (strict) | Type safety | `tsc --noEmit` is the type gate; strict mode catches `searchParams` Promise mis-handling at compile time |
| `tailwindcss` | `^4` (4.1.x) | Styling via `@theme` tokens in `styles/tokens.css` | Locked Phase 1; v4 CSS-first; no `tailwind.config.ts` |
| `motion` | `^12.38.0` | The single `<ThesisParagraph>` client island (`m.span` per word) | Locked Phase 1 — `LazyMotion strict` already mounted in `<MotionProvider>` (`components/motion/motion-provider.tsx`) |
| `geist` | `^1.7.0` | `GeistSans` + `GeistMono` via `next/font/local` | Locked Phase 1; wordmark uses `GeistSans` display, eyebrows use `GeistMono` |
| `zod` | `^3.23.0` | Schema-narrowed `Project` type consumed by all cards | Locked Phase 2; cards take `project: Project` with the post-transform shape (e.g., `code-private` auto-tag for private) |

### Supporting (already installed — no new installs needed for Phase 4)

| Library | Version | Phase 4 use |
|---------|---------|-------------|
| `next/image` | bundled with `next@16.2.4` | `<ProjectCardHero>` image-present branch. `sizes="(min-width: 768px) 41vw, 100vw"` per UI-SPEC; the card image is 5/12 cols at `md+` so 41vw is the correct sizes hint. **No `priority` on cards** (priority is reserved for the detail-page hero only — adding it to cards would race the LCP). |
| `next/link` | bundled | Phase 4 uses plain `<a>` instead of `<Link>` for cards and filter chips. Why: every filter chip and every card link causes a full server navigation (we WANT the URL to be the state, see PIX-02). `<Link>` would prefetch on hover for 11 chip × N variant combinations; that's 22+ prefetch requests on `/projects` hover, with no benefit since the destination is the same RSC page re-rendered. Plain `<a>` is the documented Next 16 escape hatch for "I want a real navigation, not a soft route." Phase 1 + Phase 3 chrome already follows this convention (`<TagChipRow>` uses `<a>`, `<NextProjectBlock>` uses `<a>`). |
| `lucide-react` | `^1.8.0` | **Zero icons in Phase 4.** The `×`, `→`, `·` are literal characters. |
| `clsx` + `tailwind-merge` (via `lib/utils.ts` `cn`) | `^2.1.1` / `^3.5.0` | Available if any card variant needs conditional class composition (e.g., `hero` prefix). Most Phase 4 components have static class strings; use `cn` only when conditional. |

### Dev tooling (unchanged from Phase 3)

| Tool | Version | Phase 4 use |
|------|---------|-------------|
| `vitest` | `^3` | All Phase 4 tests; the `motion/react` Proxy mock pattern (tests/projects/page.test.tsx lines 12–37) is reused for `<ThesisParagraph>` tests |
| `@testing-library/react` | `^16` | All component tests |
| `jsdom` | `^25` | Test environment |
| `@biomejs/biome` | `^2.4.12` | Lint + format gate before commit |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Plain `<a>` for filter chips | `<Link>` with `prefetch={false}` | Works, but adds the Link import on a page that doesn't otherwise need it. Prefetch-false is essentially a plain `<a>` with extra ceremony. Plain `<a>` is the documented Next 16 way to request a hard navigation. |
| `useReducedMotion()` hook + conditional animation in `<ThesisParagraph>` | CSS `@media (prefers-reduced-motion: reduce)` keyframes | Possible (Phase 1's `app/globals.css` floor already does this for CSS transitions globally). But the per-word fade is a JS-driven sequence, not a single CSS transition — the hook is the cleaner gate. |
| `next/dynamic({ ssr: false })` for `<ThesisParagraph>` | Plain `'use client'` with SSR fallback inside | UI-SPEC explicitly rejects `ssr: false` (re-asserted in § Motion anti-patterns). SSR must render the paragraph visible so no-JS + reduced-motion + pre-hydration all see the text. |

**Installation:** No `pnpm add` commands required. All Phase 4 dependencies are already in `package.json`.

**Version verification:** Confirmed against the on-disk `package.json` 2026-05-16. Next 16.2.4 is the current minor (16.2.6 is documented as the latest patch on nextjs.org/docs/app/api-reference/file-conventions/page; bump optional; out of scope for Phase 4 — version locking is a Phase 6 concern).

---

## Architecture Patterns

### Recommended File Layout

```
app/(site)/
├── page.tsx                          # REPLACES Phase 1 placeholder home page
└── projects/
    ├── page.tsx                      # NEW — /projects index
    └── [slug]/page.tsx               # UNTOUCHED (Phase 3)

components/
├── home/                             # NEW directory
│   ├── home-hero.tsx                 # RSC — wordmark + role frame + thesis slot
│   ├── home-project-grid.tsx         # RSC — composes hero stack + (conditional) secondary grid
│   └── thesis-paragraph.tsx          # 'use client' — the ONLY new client island
└── projects/                         # EXISTING dir (Phase 3) — extended
    ├── card-meta.tsx                 # NEW — presentational meta row (year + chips + private label)
    ├── empty-filter-state.tsx        # NEW — inline empty message
    ├── project-card-hero.tsx         # NEW — large card for home / hero-tier
    ├── project-card-secondary.tsx    # NEW — compact card for home secondary + ALL /projects cards
    ├── tag-filter-row.tsx            # NEW — URL-synced filter, RSC, no client state
    ├── tier-separator.tsx            # NEW — hairline + mono lowercase label
    ├── (UNTOUCHED Phase 3 files:)
    ├── next-project-block.tsx
    ├── next-project-title.tsx
    ├── project-hero.tsx
    ├── project-meta.tsx
    └── tag-chip-row.tsx

tests/
├── home/                             # NEW dir mirroring components/home/
│   ├── home-hero.test.tsx
│   ├── home-project-grid.test.tsx
│   └── thesis-paragraph.test.tsx
└── projects/                         # EXISTING — extended
    ├── card-meta.test.tsx            # NEW
    ├── empty-filter-state.test.tsx   # NEW
    ├── project-card-hero.test.tsx    # NEW
    ├── project-card-secondary.test.tsx  # NEW
    ├── tag-filter-row.test.tsx       # NEW
    ├── tier-separator.test.tsx       # NEW
    └── page.test.tsx                 # NEW — /projects RSC integration; same name as existing /projects/[slug]/page.test.tsx? NO — that one lives in tests/projects/page.test.tsx already. RENAME: the new one is tests/projects/index-page.test.tsx
```

**Naming collision watch:** `tests/projects/page.test.tsx` already exists (Phase 3 — covers the detail route `[slug]/page.tsx`). For the new `/projects` index page tests, **use a distinct filename** — `tests/projects/index-page.test.tsx` (or `tests/projects/projects-page.test.tsx`). Do not overwrite or merge. The planner should pick one and lock it in the plan.

### Pattern 1: Next 16 `searchParams` is a Promise

**Source:** https://nextjs.org/docs/app/api-reference/file-conventions/page (verified 2026-05-16)

In Next 14 and earlier, `searchParams` was a synchronous prop. **In Next 15+ (and the project's Next 16.2.4), it is a `Promise<{...}>`**. The page must be `async` and must `await` the prop:

```tsx
// Source: official Next.js 16 docs (verbatim shape)
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { page = '1', sort = 'asc', query = '' } = await searchParams
  // ... render with destructured values
}
```

Notes from the official docs:
- `searchParams` is a plain JavaScript object (not a `URLSearchParams` instance).
- `searchParams` is a **Request-time API** — using it opts the page into **dynamic rendering** at request time.
- For repeated values (`?tag=a&tag=b`), the value is a `string[]`; for a single value, it's a `string`; for absent params, it's `undefined`.

**Phase 4 application:**

```tsx
// app/(site)/projects/page.tsx (sketch — finalize during planning)
import { getAll, getAllTags, getProjectsByTag } from '@/lib/projects'
import { TAGS, type Tag } from '@/lib/tags'

interface PageProps {
  searchParams: Promise<{ tag?: string | string[] }>
}

export default async function ProjectsIndexPage({ searchParams }: PageProps) {
  const sp = await searchParams
  const rawTag = Array.isArray(sp.tag) ? sp.tag[0] : sp.tag
  // Narrow against the TAGS const so unknown values degrade to "no filter"
  const activeTag: Tag | undefined =
    rawTag && (TAGS as readonly string[]).includes(rawTag)
      ? (rawTag as Tag)
      : undefined
  const projects = activeTag ? getProjectsByTag(activeTag) : getAll()
  // ...
}
```

**Type narrowing pattern (load-bearing):**
- `sp.tag` is `string | string[] | undefined`.
- Always normalize to `string | undefined` via `Array.isArray(sp.tag) ? sp.tag[0] : sp.tag`.
- Always narrow to the `Tag` literal type via membership check (`(TAGS as readonly string[]).includes(rawTag)`) before passing to `getProjectsByTag(tag: Tag)`. The cast `as readonly string[]` is necessary because `TAGS` is `as const` (readonly tuple of literals), and `.includes` on that tuple requires the argument to already be one of the literals — defeating the narrowing.
- Invalid / unknown tag values **degrade silently to no filter** (per UI-SPEC § filter resolution edge cases). Do NOT `notFound()` or redirect on a bad tag; the page renders the full list. Rationale: filter URLs are shareable; broken URLs degrade gracefully rather than 404.

### Pattern 2: Server-side filtering with zero client JS

The entire filter mechanic is RSC:

```tsx
// Inside ProjectsIndexPage (RSC)
const allTags = getAllTags()                          // count desc, alpha asc
const projects = activeTag ? getProjectsByTag(activeTag) : getAll()
const heroProjects = projects.filter(p => p.tier === 'hero')
const secondaryProjects = projects.filter(p => p.tier === 'secondary')

return (
  <>
    <header><h1 className="display-mono-classes">all projects</h1></header>
    <TagFilterRow tags={allTags} activeTag={activeTag} />
    {/* branch: empty / both tiers / one tier */}
  </>
)
```

`<TagFilterRow>` is itself RSC. Each chip is `<a href={isActive ? '/projects' : `/projects?tag=${tag}`}>`. Clicking a chip causes a full server navigation; the URL is the state; back-button + reload restore the exact filter natively. **Zero client JS for the filter.**

Verification: `grep -r "use client" components/projects/ components/home/` after Phase 4 ships should return **only** `components/motion/*` (Phase 1), `components/site/nav-link.tsx` (Phase 1), `components/projects/next-project-title.tsx` (Phase 3), and `components/home/thesis-paragraph.tsx` (new in Phase 4). No filter row, no card, no page route should carry `'use client'`.

### Pattern 3: Active-chip `href` construction

```tsx
// Inside <TagFilterRow> (RSC)
{tags.map(({ tag, count }) => {
  const isActive = tag === activeTag
  const href = isActive ? '/projects' : `/projects?tag=${tag}`
  return (
    <li key={tag}>
      <a
        href={href}
        aria-pressed={isActive}
        aria-current={isActive ? 'true' : undefined}
        className={isActive ? CHIP_ACTIVE_CLASSES : CHIP_INACTIVE_CLASSES}
      >
        {TAG_LABELS[tag]}
        <span className="ml-2" aria-hidden="true">{count}</span>
      </a>
    </li>
  )
})}
```

**ARIA decision:** Use **both** `aria-pressed` (UI-SPEC) AND `aria-current="true"` (suggested by Focus Area #3). Rationale:
- `aria-pressed` is the toggle-button semantic — accurate for "this filter is currently applied (active=on, inactive=off)". UI-SPEC § TagFilterRow specifies it.
- `aria-current="true"` is the navigation-landmark semantic — useful because filter chips are inside `<nav aria-label="Filter projects by tag">`. The W3C ARIA Authoring Practices guidance for "current item in a set of links" is `aria-current`.
- Both attributes co-exist without conflict. Screen readers will read the most semantic one for their announce mode.

**Alternative considered:** `aria-current` alone. Rejected because the chip's accessible role is "link" (`<a>`); `aria-pressed` adds the toggle semantic that matches the visual treatment (chip looks pressed when active).

### Pattern 4: `<ThesisParagraph>` motion island

**The critical implementation gate** — see Pitfall 4 first. `MotionConfig reducedMotion="user"` does NOT collapse opacity animations. Manual gating is required.

```tsx
// components/home/thesis-paragraph.tsx
'use client'

import { m, useReducedMotion } from 'motion/react'

interface ThesisParagraphProps {
  text: string
  className?: string
}

export function ThesisParagraph({ text, className }: ThesisParagraphProps) {
  const shouldReduce = useReducedMotion() // null until hydration, then boolean
  // Split on whitespace, preserving the whitespace segments so layout matches SSR exactly.
  const segments = text.split(/(\s+)/) // ['I', ' ', 'work', ' ', 'on', ...]

  return (
    <p className={className}>
      {segments.map((seg, i) => {
        // Whitespace segments render immediately, no fade
        if (/^\s+$/.test(seg)) {
          return <span key={i} aria-hidden="true">{seg}</span>
        }
        // Word index for stagger (whitespace doesn't count)
        const wordIndex = segments.slice(0, i).filter(s => !/^\s+$/.test(s)).length
        const delay = shouldReduce ? 0 : wordIndex * 0.03 // 30ms inter-word
        const duration = shouldReduce ? 0 : 0.18           // 180ms per word
        return (
          <m.span
            key={i}
            initial={{ opacity: shouldReduce ? 1 : 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
          >
            {seg}
          </m.span>
        )
      })}
    </p>
  )
}
```

**Why this shape:**

- **SSR fallback:** The component returns `<p>` containing `<span>` segments at all times. There is no separate "SSR shell vs hydrated" rendering — the JSX is the SSR output. Without JS, the spans render at their default opacity (which is 1 via `initial={{ opacity: shouldReduce ? 1 : 0 }}` because `useReducedMotion()` returns `null` on first server render, and `null` is falsy → `shouldReduce ? 1 : 0` resolves to `0`).
- **WAIT.** That's wrong. On the server, `useReducedMotion()` returns `null` (no `matchMedia` exists in the server runtime). `null` is falsy in JS, so `shouldReduce ? 1 : 0 = 0`. The SSR HTML would render every word at opacity 0 — **flash-of-invisible-text bug**.

**Corrected SSR-safe shape:**

```tsx
'use client'

import { m, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'

export function ThesisParagraph({ text, className }: ThesisParagraphProps) {
  const [mounted, setMounted] = useState(false)
  const prefersReduced = useReducedMotion() // boolean | null
  useEffect(() => { setMounted(true) }, [])

  // SSR + pre-hydration + reduced-motion = render plain paragraph at full opacity
  if (!mounted || prefersReduced) {
    return <p className={className}>{text}</p>
  }

  // Post-hydration with motion permitted: per-word fade
  const segments = text.split(/(\s+)/)
  return (
    <p className={className}>
      {segments.map((seg, i) => {
        if (/^\s+$/.test(seg)) {
          return <span key={i} aria-hidden="true">{seg}</span>
        }
        const wordIndex = segments.slice(0, i).filter(s => !/^\s+$/.test(s)).length
        return (
          <m.span
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.18, delay: wordIndex * 0.03, ease: [0.22, 1, 0.36, 1] }}
          >
            {seg}
          </m.span>
        )
      })}
    </p>
  )
}
```

**This shape satisfies the contract:**
- SSR HTML contains the full text as a single `<p>` — visible to bots, no-JS users, screen readers immediately.
- Pre-hydration (motion permitted): same plain `<p>` — paragraph is visible from the first paint.
- Post-hydration (motion permitted, `mounted === true && prefersReduced === false`): switches to segmented `<m.span>` per word; React re-mounts the children, each segment starts at opacity 0 and animates to 1 with the sequenced delay.
- Reduced-motion ON: stays at plain `<p>` forever; no flicker; no per-word DOM.
- Hydration mismatch warning suppressed naturally because the first React render on the client matches the SSR render (`mounted === false` → plain `<p>` on both).

**CLS guard:** the segmented form and the plain-text form occupy the same layout box because the `<m.span>` segments contain the same text content (including the whitespace `<span>`s), with no padding, no margin, no transforms. The transition is opacity-only on inline elements. There is no measurable layout shift.

**Alternative considered:** Motion's `variants` + `staggerChildren` (see § Pattern 2 in [motion.dev/docs/react-transitions](https://motion.dev/docs/react-transitions)). Rejected for this use case because:
1. `staggerChildren` requires a parent `<m.*>` element, which would push us toward `<m.p>` as the wrapper — fine, but then the parent's `initial/animate` becomes its own animation that needs the same `useReducedMotion()` gate.
2. The hand-rolled `delay = wordIndex * 0.03` is more transparent in tests (assertion: "the 5th word's transition.delay = 0.12s") than variants nesting.
3. Per Phase 3's `<NextProjectTitle>` precedent, the hand-rolled approach with explicit `transition` props plays well with the Vitest `motion/react` Proxy mock (which strips `transition` and forwards children).

### Pattern 5: Per-route metadata as `const`

Use the static `metadata` const export (not `generateMetadata`) for both `/` and `/projects` — neither route depends on dynamic data for its title/description. The static form is cheaper at build time and clearer at read time. Source: https://nextjs.org/docs/app/api-reference/functions/generate-metadata "If metadata doesn't depend on request information, it should be defined using the static `metadata` object rather than `generateMetadata`."

```tsx
// app/(site)/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  // title omitted intentionally — root layout's title.default ('olivelliott.dev')
  // resolves the home page title without applying the titleTemplate.
  description:
    'Olive Elliott — engineer building tools for autonomy, local-first systems, and open-source communities.',
}
```

```tsx
// app/(site)/projects/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'all projects',
  // title.template in app/layout.tsx resolves this to 'all projects · olivelliott.dev'
  description:
    "A filterable index of Olive Elliott's work — hero-tier case studies and secondary projects across local-first, autonomous, and open-source contributions.",
  alternates: { canonical: '/projects' },
  openGraph: {
    title: 'all projects',
    description:
      "A filterable index of Olive Elliott's work across local-first, autonomous, and open-source contributions.",
    url: '/projects',
    type: 'website',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'olivelliott.dev — engineer, autonomy, local-first' }],
  },
  twitter: { card: 'summary_large_image', images: ['/og-default.png'] },
}
```

**Home `metadata` deliberately omits `title`.** Reason: root layout (`app/layout.tsx` lines 9–12) declares `title: { default: 'olivelliott.dev', template: '%s · olivelliott.dev' }`. The `title.default` is the page title used when a page does not declare its own. If the home page declares `title: 'olivelliott.dev'`, the titleTemplate kicks in and resolves to `'olivelliott.dev · olivelliott.dev'` — duplicated. The cleanest pattern is to omit `title` on the home page so the layout's `default` resolves directly. (See [Next.js docs § title.default + title.template](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#default).)

**`/projects` `metadata` uses `title: 'all projects'`.** The titleTemplate resolves this to `'all projects · olivelliott.dev'` — the desired output.

**OG image strategy:** Both pages use `/og-default.png` (shipped Phase 3 Wave 0). Per-route dynamic OG is out of scope (Phase 6 — DYN-01 v2). For the home page, the root layout's `metadata` does NOT declare `openGraph.images`, so the home page must declare its own — otherwise no OG image is emitted. The above sketch is the minimum to ensure both routes have a usable OG card.

**Static `metadata` vs `generateMetadata` for `/projects?tag=local-first`:** Per UI-SPEC § Per-Route Metadata Contract, filtered states do NOT get their own title/description (canonical stays `/projects`). Static `metadata` is correct — `generateMetadata` would unnecessarily defer to request time and forfeit the prerender of the head.

### Pattern 6: Tier separator visibility logic

```tsx
// Inside ProjectsIndexPage RSC body
{activeTag && projects.length === 0 ? (
  <EmptyFilterState tag={activeTag} />
) : (
  <>
    {heroProjects.length > 0 && (
      <section aria-labelledby="hero-tier-eyebrow">
        <TierSeparator label="hero" id="hero-tier-eyebrow" />
        <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {heroProjects.map(p => <ProjectCardSecondary key={p.slug} project={p} hero />)}
        </div>
      </section>
    )}
    {secondaryProjects.length > 0 && (
      <section aria-labelledby="secondary-tier-eyebrow">
        <TierSeparator label="secondary" id="secondary-tier-eyebrow" />
        <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {secondaryProjects.map(p => <ProjectCardSecondary key={p.slug} project={p} />)}
        </div>
      </section>
    )}
  </>
)}
```

- Tier section + its `<TierSeparator>` are rendered as a single conditional block — separator never appears orphaned.
- `id` on the separator's `<p>` is used by the `<section>`'s `aria-labelledby`. The `<TierSeparator>` component must accept and pass through the `id` prop (UI-SPEC's current props sketch shows `label` only — add `id`).

### Anti-Patterns to Avoid (Phase 4 specific)

- **`useSearchParams()` on `/projects`.** The page is RSC; reading the URL via the `searchParams` prop is the only pattern. `useSearchParams` would force `'use client'`.
- **`window.history.replaceState` for filter toggles.** Use plain `<a>` navigation. The whole point of URL-as-state is that the browser handles persistence + back/forward.
- **Wrapping `<ProjectCardHero>` in `<Link>` then nesting `<TagChipRow>` (with `<a>` chips) inside.** Nested `<a>` is invalid HTML and creates competing focus targets. The card uses `<a href>`, chips inside cards are `<span>` (via `<CardMeta>`). Phase 3's interactive `<TagChipRow>` is for the detail-page meta row, NOT cards.
- **`whileHover` / `whileInView` / `whileFocus` on cards.** Cards are CSS-only (`hover:`, `focus-visible:`). Adding Motion `while*` props would mount a `<m.*>` element per card and overshoot the v1 motion budget.
- **`dynamic(() => import('./thesis-paragraph'), { ssr: false })`.** Re-asserted by UI-SPEC. The component MUST SSR (visible text pre-hydration).
- **Multiple `<h1>` on a route.** Home: the wordmark is the only H1. `/projects`: `all projects` heading is the only H1. Cards on the index use H3 (per UI-SPEC § Accessibility Contract); cards on the home page use H2 (hero) / H3 (secondary).

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| URL filter state persistence | A custom hook with `window.history.pushState` + a context provider | RSC `searchParams` + plain `<a href>` chips | Free back-button, free reload, free share, zero JS. Building this manually is a classic React-from-2018 anti-pattern that bypasses everything App Router gives you. |
| Reduced-motion detection | `window.matchMedia('(prefers-reduced-motion: reduce)')` + custom hook | `useReducedMotion()` from `motion/react` | Already in the bundle (`motion@12.38.0` is installed). The hook handles SSR-safe `null`-then-boolean transitions correctly. |
| Type narrowing on `searchParams.tag` | A custom Zod schema for searchParams | Hand-narrowed against `TAGS` const | Two lines. A schema for one optional string is overkill. |
| Per-word text splitting | A library like `react-split-text` | `text.split(/(\s+)/)` | One line. The split-on-whitespace pattern preserves the whitespace tokens as their own segments so SSR + hydrated layouts align exactly. |
| Tag chip count display | Computing counts in the component | `getAllTags()` already returns `{ tag, count }[]` sorted | Phase 2 already shipped this. Use the existing API. |
| `cn()` for conditional card classes | Custom string concat | `cn` from `lib/utils.ts` | Already exists; handles `clsx` + `tailwind-merge` dedup. |
| Empty-state illustration | Custom SVG or icon | One sentence with a link | UI-SPEC explicitly forbids empty-state clichés (illustrations, icons). The link IS the call to action. |
| Tier-based card variant resolution | A factory function `getCardFor(project)` | Caller passes the right component | Two component types, two call sites. A factory is a code smell for two options. |

**Key insight:** Phase 4 is a composition exercise over existing primitives. The temptation to introduce abstractions (a `<Card>` factory, a `useFilter` hook, a `<MotionParagraph>` generic) is the wrong move at this scale. The components are leaf RSCs that compose the existing query API. Every new abstraction is one more thing to test.

---

## Component Split — Recommendation

**Recommendation:** Two separate files (`project-card-hero.tsx` + `project-card-secondary.tsx`). Do **not** consolidate into `project-card.tsx` with a `tier` prop.

**Rationale:**

1. **Different prop shapes.** `<ProjectCardSecondary>` has a `hero?: boolean` prop (for the `/projects` index "hero" prefix label). `<ProjectCardHero>` does not have or need that prop. A unified component would have to either declare `hero?: boolean` on both (lying about the home-hero variant) or use a discriminated union (`{ tier: 'hero' } | { tier: 'secondary', hero?: boolean }`) which is more annotation than the savings warrant.
2. **Different DOM shapes.** Hero card has a 2-column grid with image, outcomes bullet list, H2 title. Secondary card is a single column with H3 title, no outcomes, no image. Branching on `tier` inside one file produces a long-conditional component — harder to read than two separate ~50-line files.
3. **Different heading levels.** Hero card uses `<h2>`, secondary uses `<h3>`. The home page uses both; the index uses only secondary (every card is H3). Branching heading level on a prop is an a11y smell — easier to verify by reading two separate files that each pick one heading level.
4. **Test clarity.** Phase 4 has 10 test files. Two of those (`project-card-hero.test.tsx` + `project-card-secondary.test.tsx`) are clearer one-to-one than a single `project-card.test.tsx` that has to assert "if tier=hero then H2, if tier=secondary then H3."
5. **Future divergence.** The two card variants are likely to evolve differently. Hero may gain an interactive demo slot (per CONTEXT § Stack Patterns by Variant). Secondary may gain a year-grouped layout in v2. Pre-emptively unifying creates a refactor when they diverge.

**The shared concern (year + chips + private label) is already extracted into `<CardMeta>`.** That's the right boundary — share the leaf, not the composite.

**If the planner picks the unified-file path anyway,** tests must still assert the rendered DOM shape per variant (H2 vs H3, image col present vs absent, outcomes list present vs absent). Both choices pass the UI-SPEC contract; this recommendation is about ergonomics and future-friendliness, not correctness.

---

## Replacing `app/(site)/page.tsx` — Cleanup Checklist

The current `app/(site)/page.tsx` (Phase 1 placeholder, 27 lines) is being fully replaced. Items to clean up:

1. **Remove the `FadeIn` import** from the placeholder. Phase 4's home page does NOT use `<FadeIn>` (per CONTEXT § "type-set thesis entrance ... This is the only motion on the home page beyond Phase 1's FadeIn" — re-reading the UI-SPEC line 1177 makes clear: "Any motion beyond the one `<ThesisParagraph>` type-set entrance and Phase 1's `<FadeIn>` (which is NOT used on Phase 4 pages)"). The component `components/motion/fade-in.tsx` STAYS (it's a reusable primitive — Phase 5's resume / about may consume it). Only the import from the home page goes away.
2. **No test file for the placeholder home exists** — `grep` confirms no `tests/home-page.test.tsx` or similar in the current tree. Nothing to delete.
3. **Locked copy strings change.** Phase 1's UI-SPEC Copywriting Contract locked `olivelliott.dev` (display) and `under construction. real projects arrive in phase 4.` (tagline). Phase 4 replaces both. The Phase 1 contract is superseded by the Phase 4 contract for the home page; no UI-SPEC revision needed (Phase 4's UI-SPEC explicitly replaces the placeholder).
4. **No route conflict.** Phase 1 deleted the scaffold `app/page.tsx` in favor of `app/(site)/page.tsx` (per `01-05-SUMMARY.md`). The `(site)` route group remains the canonical home location.
5. **No need to touch `app/layout.tsx`.** The root layout's `metadata` (title.default, template, metadataBase, description) is correct for Phase 4. The home page only needs to override `description` if a different one is wanted (recommendation: keep the root description for the home page — they describe the same thing). Actually — the root layout already declares the description identically to what we'd want on the home page. The home page can omit `metadata` entirely and let the root layout's description flow through. Lean toward declaring `metadata` on the home page anyway for explicitness and to declare `openGraph.images` (which the root layout does not).
6. **No need to touch `app/(site)/layout.tsx`.** Provides MotionProvider + SkipLink + Nav + main + Footer. Phase 4 just slots two new pages under `main`.
7. **No need to touch `mdx-components.tsx`.** Home + index are not MDX-rendered.
8. **No need to touch `next.config.ts`.** Rehype chain is for MDX bodies; Phase 4 pages don't render MDX. The `pageExtensions: ['ts', 'tsx', 'md', 'mdx']` line is fine.
9. **No need to touch `vitest.config.ts`.** The `mdxShimPlugin` and the `@` alias and the `server-only` stub remain correct. Phase 4 tests do NOT need a new shim (no `.mdx` imports outside the existing detail page route).
10. **Phase 1 `app/not-found.tsx` stays.** Untouched.

**Quick smoke command after replacing `app/(site)/page.tsx`:**

```bash
pnpm dev &
sleep 3
curl -s http://localhost:3000/ | grep -E "olive elliott|engineer|local-first" && echo OK
curl -s http://localhost:3000/projects | grep -E "all projects|local-first" && echo OK
curl -s "http://localhost:3000/projects?tag=local-first" | grep -E "Myco|hero" && echo OK
```

---

## `hero` Mono Prefix Label on `/projects` — Placement

**Where to render it:** Above the title, as the first child of the card. Per UI-SPEC § Component Inventory #5:

```tsx
<a href={`/projects/${project.slug}`} className="group block ... p-6 flex flex-col gap-4">
  {hero && (
    <p className="font-mono text-[var(--text-label)] font-medium tracking-[0.02em] lowercase text-[color:var(--color-text-tertiary)]">
      hero
    </p>
  )}
  <h3>{project.title}</h3>
  <p>{project.tagline}</p>
  <CardMeta ... />
</a>
```

**Integration with the secondary card shape:** Adds one `<p>` element above the H3 title. The `flex flex-col gap-4` container ensures the prefix sits at consistent rhythm from the title (16px gap). When `hero={false}` (the default — used on the home page secondary section AND on the secondary tier section of `/projects`), the prefix is omitted entirely (no empty `<p>`, no gap).

**Why a `<p>` and not a `<span>`:** The label semantically marks the role of the card (hero-tier project, indexed). A `<p>` with mono lowercase styling matches the eyebrow pattern already established by `selected work` / `more work` on the home page and `all projects` on the index. Consistent reading order: eyebrow-style labels are always `<p>`.

**ARIA:** No special `aria-label` needed. The text "hero" reads naturally with the title that follows. Optional refinement: add `aria-label="${project.title} (hero project)"` to the `<a>` to give screen readers a richer accessible name. Treat as a tasteful enhancement, not a contract requirement.

---

## Empty-Filter State — Rendering Details

```tsx
// components/projects/empty-filter-state.tsx
import type { Tag } from '@/lib/tags'

interface EmptyFilterStateProps {
  tag: Tag
}

export function EmptyFilterState({ tag }: EmptyFilterStateProps) {
  return (
    <div className="py-12 max-w-[55ch] mx-auto">
      <p className="text-[var(--text-body)] leading-[1.6] text-[color:var(--color-text-secondary)]">
        no projects tagged{' '}
        <span className="font-mono lowercase">"{tag}"</span>
        {' — '}
        <a
          href="/projects"
          className="text-[color:var(--color-accent)] hover:text-[color:var(--color-accent-hover)] underline underline-offset-2 decoration-1"
        >
          view all projects →
        </a>
      </p>
    </div>
  )
}
```

**Same column as cards:** the component sits directly where the tier sections would otherwise be — no separate layout wrapper, no centered-illustration treatment. The `max-w-[55ch] mx-auto` keeps the message readable while preserving the page's vertical flow.

**Locked copy:** `no projects tagged "{tag}" — view all projects →` (UI-SPEC § Copywriting Contract). Em-dash is U+2014. Arrow is U+2192. The arrow is part of the link's accessible text (`aria-hidden="false"` implicit).

**Link is a real `<a>`, not a JS handler:** clicking causes a full server navigation back to `/projects` (no filter). Back-button restores the filtered URL. Reload re-renders the empty state. The same RSC mechanic as the chip clicks.

**Tier separator hidden:** when the empty state renders, both tier sections are conditionally absent (the `else` branch above renders neither `<TierSeparator label="hero">` nor `<TierSeparator label="secondary">`). No orphan separator.

---

## Testing Strategy

### Test File Inventory (Phase 4)

| File | Type | Coverage | Notes |
|------|------|----------|-------|
| `tests/home/home-hero.test.tsx` | Component (RTL) | HOM-01 — single H1, wordmark text, role frame composition, thesis slot present | RSC; no motion mock needed |
| `tests/home/thesis-paragraph.test.tsx` | Component (RTL) | HOM-05 — SSR-fallback contract, reduced-motion bypass, no-CLS (height before/after equality), banned-words check on placeholder copy | Mock `motion/react` via Proxy (existing pattern); mock `useReducedMotion` returning `true` for one case, `false` for the other |
| `tests/home/home-project-grid.test.tsx` | Component (RTL) | HOM-02, HOM-03 — hero stack renders one card per hero project; secondary section absent when `secondaryProjects.length === 0`; secondary grid present when 1+ | RSC; pass fixtures as props |
| `tests/projects/project-card-hero.test.tsx` | Component (RTL) | HOM-02, PIX-04 — image-present vs text-only branch (uses `isPlaceholderHero`); outcomes capped at 3; H2 title; presentational chips are `<span>` not `<a>`; `code private` label when private; no `repo` link rendered ever; wrapper is single `<a>` | Verify no nested anchors via `querySelectorAll('a a').length === 0` |
| `tests/projects/project-card-secondary.test.tsx` | Component (RTL) | HOM-03, PIX-04 — H3 title, no outcomes, no image, no `repo` link; `hero` prefix when `hero={true}`, absent otherwise; private label | Same nested-anchor assertion |
| `tests/projects/card-meta.test.tsx` | Component (RTL) | PIX-04 — year as `<time dateTime>`, tag chips as `<span>` (not `<a>`), `code private` only when private, no repo link ever | Locks the contract that `<CardMeta>` is presentational and the privacy signal is the literal label |
| `tests/projects/tag-filter-row.test.tsx` | Component (RTL) | PIX-01, PIX-02, PIX-03 — active chip href = `/projects` (clears); inactive chip href = `/projects?tag=X`; clear-filter link renders only when `activeTag` is set; `aria-pressed` + `aria-current` on active; count badge is `aria-hidden`; chips render in `getAllTags()` order; label text = `TAG_LABELS[tag]` (not raw tag value) | Pure RSC; pass fixtures |
| `tests/projects/empty-filter-state.test.tsx` | Component (RTL) | PIX-02 — exact copy match (`no projects tagged "{tag}" — view all projects →`); em-dash and arrow glyphs; link href = `/projects`; tag rendered in mono inside quotes | One snapshot-ish test for the copy contract |
| `tests/projects/tier-separator.test.tsx` | Component (RTL) | PIX-01 — label rendering, hairline class, id pass-through for `aria-labelledby` | Trivial |
| `tests/projects/index-page.test.tsx` | RSC integration | PIX-01, PIX-02, PIX-04 — server filter resolution: (a) no tag param → full list, no active chip, no clear; (b) valid tag → filtered list, active chip, clear link; (c) invalid tag → full list (degrades silently); (d) array form `?tag=a&tag=b` → first only; (e) zero-result valid tag → EmptyFilterState, no tier sections; (f) when filter results in zero secondary-tier matches → secondary tier section + separator both absent | Test pattern: `await Page({ searchParams: Promise.resolve({ tag: '...' }) })`; mock `@/lib/projects` to return fixture projects |

### RSC Page Test Pattern (existing, reusable)

The Phase 3 detail-page test (`tests/projects/page.test.tsx` lines 78–148) is the proven pattern. Adapt for `/projects`:

```tsx
// tests/projects/index-page.test.tsx (sketch)
import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

const fixtures = [
  { slug: 'myco', tier: 'hero' as const, tags: ['local-first', 'autonomous'] as const, /* ... */ },
  { slug: 'fathom', tier: 'hero' as const, tags: ['cli', 'autonomous'] as const, /* ... */ },
  { slug: 'trade-bot', tier: 'secondary' as const, tags: ['local-first', 'python'] as const, /* ... */ },
]

async function loadPage() {
  vi.resetModules()
  vi.doMock('@/lib/projects', () => ({
    getAll: () => fixtures,
    getAllTags: () => [
      { tag: 'autonomous', count: 2 },
      { tag: 'local-first', count: 2 },
      { tag: 'cli', count: 1 },
      { tag: 'python', count: 1 },
    ],
    getProjectsByTag: (tag: string) => fixtures.filter(p => p.tags.includes(tag)),
  }))
  const mod = await import('@/app/(site)/projects/page')
  return mod.default
}

describe('/projects index page', () => {
  it('renders all projects in tiered sections when no filter is applied', async () => {
    const Page = await loadPage()
    const ui = await Page({ searchParams: Promise.resolve({}) })
    const { container } = render(ui)
    // hero tier section
    expect(container.querySelector('section[aria-labelledby="hero-tier-eyebrow"]')).not.toBeNull()
    // secondary tier section
    expect(container.querySelector('section[aria-labelledby="secondary-tier-eyebrow"]')).not.toBeNull()
    // chip with href="/projects?tag=local-first" exists
    const chips = Array.from(container.querySelectorAll('a[href^="/projects"]'))
    expect(chips.some(a => a.getAttribute('href') === '/projects?tag=local-first')).toBe(true)
  })

  it('PIX-02: ?tag=local-first filters projects and marks the chip active', async () => {
    const Page = await loadPage()
    const ui = await Page({ searchParams: Promise.resolve({ tag: 'local-first' }) })
    const { container } = render(ui)
    // active chip href = /projects (clears)
    const localFirstChip = container.querySelector('a[aria-pressed="true"]')
    expect(localFirstChip?.getAttribute('href')).toBe('/projects')
    // clear-filter link present
    expect(container.querySelector('a[href="/projects"]')?.textContent).toMatch(/clear filter/i)
    // myco + trade-bot present (both tagged local-first); fathom absent (not tagged local-first)
    expect(container.textContent).toContain('myco')
    expect(container.textContent).toContain('trade-bot')
    expect(container.textContent).not.toContain('fathom')
  })

  it('degrades silently on invalid tag', async () => {
    const Page = await loadPage()
    const ui = await Page({ searchParams: Promise.resolve({ tag: 'does-not-exist' }) })
    const { container } = render(ui)
    // No chip is active
    expect(container.querySelector('a[aria-pressed="true"]')).toBeNull()
    // No clear-filter link
    expect(Array.from(container.querySelectorAll('a')).find(a => a.textContent?.includes('clear filter'))).toBeUndefined()
    // Full list renders
    expect(container.textContent).toContain('myco')
  })

  it('handles ?tag=a&tag=b array form by taking the first', async () => {
    const Page = await loadPage()
    const ui = await Page({ searchParams: Promise.resolve({ tag: ['local-first', 'python'] }) })
    const { container } = render(ui)
    const active = container.querySelector('a[aria-pressed="true"]')
    expect(active?.textContent).toMatch(/local-first/i)
  })

  it('renders <EmptyFilterState> when a valid tag yields zero results', async () => {
    // Mock getProjectsByTag to return [] for a valid tag
    vi.resetModules()
    vi.doMock('@/lib/projects', () => ({
      getAll: () => fixtures,
      getAllTags: () => [{ tag: 'saas', count: 0 }],
      getProjectsByTag: () => [],
    }))
    const mod = await import('@/app/(site)/projects/page')
    const ui = await mod.default({ searchParams: Promise.resolve({ tag: 'saas' }) })
    const { container } = render(ui)
    expect(container.textContent).toMatch(/no projects tagged/i)
    // tier sections absent
    expect(container.querySelector('section[aria-labelledby^="hero-tier"]')).toBeNull()
  })
})
```

### `<ThesisParagraph>` Test Pattern

```tsx
// tests/home/thesis-paragraph.test.tsx (sketch)
import { render, act } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import React from 'react'

// Proxy mock for motion/react (same as tests/projects/next-project-block.test.tsx)
vi.mock('motion/react', async () => {
  const actual = await vi.importActual<typeof import('motion/react')>('motion/react')
  const proxy = new Proxy({}, {
    get: (_t, tag: string) => {
      const Comp = ({ children, initial: _i, animate: _a, transition: _t, ...rest }: any) =>
        React.createElement(tag, rest, children)
      Comp.displayName = `m.${tag}`
      return Comp
    },
  })
  return {
    ...actual,
    m: proxy,
    // useReducedMotion is mocked per-test below
  }
})

describe('<ThesisParagraph>', () => {
  it('SSR fallback: renders the full text as a single <p> on first server pass (mounted=false)', async () => {
    // No mock for useReducedMotion — default returns null on first render
    const { ThesisParagraph } = await import('@/components/home/thesis-paragraph')
    const { container } = render(<ThesisParagraph text="I work on Myco." className="x" />)
    // Before useEffect runs, expect plain <p> with full text and no segmented spans
    const p = container.querySelector('p.x')
    expect(p).not.toBeNull()
    expect(p?.textContent).toBe('I work on Myco.')
    // No segmented spans yet (no <m.span> per word)
    // After hydration, useEffect fires, mounted=true, paragraph re-renders with segments
    // Verify via act()
  })

  it('reduced-motion: stays as plain <p> after hydration', async () => {
    vi.doMock('motion/react', () => ({
      m: new Proxy({}, { get: (_t, tag: string) => ({ children }: any) => React.createElement(tag as string, {}, children) }),
      useReducedMotion: () => true,
    }))
    const { ThesisParagraph } = await import('@/components/home/thesis-paragraph')
    const { container } = render(<ThesisParagraph text="I work on Myco." className="x" />)
    await act(async () => {}) // flush effects
    const p = container.querySelector('p.x')
    expect(p?.textContent).toBe('I work on Myco.')
    // No segmented m.span (children should be direct text node, not <span> per word)
    expect(p?.querySelectorAll('span').length).toBe(0)
  })

  it('motion-permitted: post-hydration splits into per-word <span> segments', async () => {
    vi.doMock('motion/react', () => ({
      m: new Proxy({}, { get: (_t, tag: string) => ({ children, ...rest }: any) => React.createElement(tag as string, rest, children) }),
      useReducedMotion: () => false,
    }))
    const { ThesisParagraph } = await import('@/components/home/thesis-paragraph')
    const { container } = render(<ThesisParagraph text="I work on Myco." className="x" />)
    await act(async () => {})
    const p = container.querySelector('p.x')
    // Three words + two whitespace separators = 5 spans
    // (Actual: "I", " ", "work", " ", "on", " ", "Myco.") = 7 spans
    expect(p?.querySelectorAll('span').length).toBeGreaterThan(3)
    // All text still present
    expect(p?.textContent).toBe('I work on Myco.')
  })

  it('CLS guard: pre- and post-hydration paragraph occupies the same layout box', async () => {
    // Test asserts that the rendered text content + element type match across states.
    // Pixel-equal layout is verified visually in Phase 6 (Lighthouse CLS).
  })
})
```

**Mock pattern note:** `useReducedMotion` must be mocked alongside `m`. The two cannot be mixed (calling the actual `useReducedMotion` in jsdom requires `window.matchMedia` to be polyfilled; mocking is cleaner).

### Single-H1 + Semantic Landmarks Test

Worth adding to both `tests/home/home-hero.test.tsx` and `tests/projects/index-page.test.tsx`:

```tsx
it('renders exactly one <h1>', () => {
  // ... render
  expect(container.querySelectorAll('h1').length).toBe(1)
})

it('has a <nav aria-label="Filter projects by tag"> landmark', () => {
  // /projects index only
  expect(container.querySelector('nav[aria-label="Filter projects by tag"]')).not.toBeNull()
})
```

---

## Runtime State Inventory

> Phase 4 is greenfield rendering work — no rename, refactor, or migration. Section omitted intentionally.

---

## Environment Availability

> Phase 4 is code/config only; no external services, no new CLI tools, no new runtimes. All dependencies (Next 16.2.4, React 19.2.4, Motion 12.38.0, TypeScript 5.7.3, Vitest 3.x, pnpm 9.15.9) are already installed and verified.
>
> **Step 2.6: SKIPPED (no external dependencies identified).**

---

## Common Pitfalls

### Pitfall 1: `searchParams` is a Promise in Next 16 (not a plain object)

**What goes wrong:** Code written for Next 14 reads `searchParams.tag` directly as a synchronous property. In Next 15+, this returns the literal `Promise` object's `.tag` property (undefined), not the resolved value. The page renders as if no filter were applied — silently.

**Why it happens:** TypeScript with `strict: true` catches this if you type the prop as `Promise<...>`, but if you type it as `{ tag?: string }` the compiler is happy and the bug is invisible until runtime.

**How to avoid:** Always type the prop as `Promise<{...}>` and always destructure via `const sp = await searchParams`. Reference: [Next.js docs § searchParams](https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional) verbatim — "Since the searchParams prop is a promise. You must use async/await or React's `use` function to access the values."

**Warning signs:** The filter "doesn't work" but throws no error. `console.log(searchParams)` shows a `Promise` not an object.

### Pitfall 2: `URLSearchParams` is NOT what `searchParams` gives you

**What goes wrong:** Code does `new URLSearchParams(await searchParams)` expecting helper methods like `.get()` / `.has()`. The constructor takes a string or an iterable of `[key, value]` pairs; passing a plain object with array values (`{ tag: ['a', 'b'] }`) silently coerces to garbage.

**Why it happens:** Muscle memory from working with `useSearchParams()` (which DOES return URLSearchParams).

**How to avoid:** Treat `searchParams` as a plain object. Read keys via property access (`sp.tag`). Per Next docs: "`searchParams` is a plain JavaScript object, not a `URLSearchParams` instance."

### Pitfall 3: Nested `<a>` inside `<a>` (cards wrap chips)

**What goes wrong:** Wrapping the whole card in `<a href="/projects/{slug}">` and then rendering Phase 3's `<TagChipRow>` (chips are `<a href="/projects?tag=X">`) inside the card produces invalid HTML. Browsers handle this by closing the outer `<a>` at the inner `<a>`, splitting the card into two link elements. Clicks on the chip jump to the filter; clicks on the card title or tagline jump to the detail page; clicks on the whitespace between chips do… something weird.

**Why it happens:** Phase 3's `<TagChipRow>` is interactive (chips link to filter). Reusing it on cards looks attractive ("DRY!") but breaks the card's hit-area contract.

**How to avoid:** Build `<CardMeta>` as a sibling component that renders chips as `<span>` (presentational only). Never import `<TagChipRow>` into a card component. Test assertion: `container.querySelectorAll('a a').length === 0` on every card render.

**Warning signs:** Clicking a chip on a card navigates to the wrong page; clicking near the chip doesn't navigate at all; HTML validator complains about nested `<a>`.

### Pitfall 4: `MotionConfig reducedMotion="user"` does NOT collapse opacity animations ⚠️ LOAD-BEARING

**What goes wrong:** UI-SPEC § Motion line 200–204 states: "MotionConfig reducedMotion='user' from Phase 1's provider suppresses `animate` automatically when the OS gate is on." This is **incorrect for opacity animations**. Per the official Motion docs at https://motion.dev/docs/react-motion-config and https://motion.dev/docs/react-accessibility (verified 2026-05-16):

> "When reduced motion is on, transform and layout animations will be disabled. Other animations, like opacity and backgroundColor, will persist."

Without an explicit gate, a reduced-motion user gets the full per-word fade sequence anyway.

**Why it happens:** Motion's `reducedMotion` is targeted at "motion sickness triggers" (transforms, parallax, layout shifts), not all animation. Opacity is intentionally exempt because opacity transitions are considered accessibility-helpful (they preserve context as elements appear/disappear). For a per-word sequenced fade, this default is wrong — a sequenced 600ms reveal is still distracting for users with vestibular disorders.

**How to avoid:** In `<ThesisParagraph>`, manually gate via `useReducedMotion()`:

```tsx
const prefersReduced = useReducedMotion()
if (prefersReduced) return <p className={className}>{text}</p>
// else: per-word segmented render
```

Reference: [Motion docs § useReducedMotion](https://motion.dev/docs/react-use-reduced-motion) — "Detects if a device has Reduced Motion enabled."

**Warning signs:** Reduced-motion user reports "the words appear one at a time" — exactly the experience the UI-SPEC promised to avoid. Caught early by writing the reduced-motion test FIRST (TDD).

### Pitfall 5: Hydration mismatch on `<ThesisParagraph>`

**What goes wrong:** `useReducedMotion()` returns `null` on the server (no `matchMedia`), and `boolean` on the client. If the component's JSX branches on the return value, the server HTML differs from the first client render — React logs a hydration warning and may discard the SSR HTML.

**Why it happens:** SSR runs in Node where `window` doesn't exist; client runs in the browser where `window.matchMedia` resolves to a value. Motion's `useReducedMotion` returns `null` until it can read the media query.

**How to avoid:** Use the two-stage pattern (`mounted: false` state, flip in `useEffect`). On both SSR and the first client render, `mounted=false`, so the JSX is identical (plain `<p>`). After hydration, the effect fires, `mounted=true`, and React re-renders with the segmented form (a fully-client-side transition, no hydration involved).

```tsx
const [mounted, setMounted] = useState(false)
const prefersReduced = useReducedMotion()
useEffect(() => { setMounted(true) }, [])
if (!mounted || prefersReduced) return <p className={className}>{text}</p>
// else: segmented
```

**Warning signs:** "Warning: Text content did not match" in the browser console; "Hydration failed because the initial UI does not match" in the React DevTools.

### Pitfall 6: Forgetting `aria-labelledby` ↔ `id` linkage on the tier separator

**What goes wrong:** UI-SPEC § Page Composition shows `<section aria-labelledby="hero-eyebrow-index">` paired with `<p id="hero-eyebrow-index">hero</p>` rendered inside `<TierSeparator>`. If `<TierSeparator>` does not accept and pass through an `id` prop, the linkage is broken: the section has an `aria-labelledby` pointing at no element, and the accessible name resolves to empty.

**Why it happens:** The current UI-SPEC's `<TierSeparator>` props sketch shows only `{ label }`. The planner needs to add `id` to the props.

**How to avoid:** Define `<TierSeparator>` as `{ label: 'hero' | 'secondary', id?: string }` and apply `id` to the `<p>`. Have the page route pass `id={\`${tierName}-tier-eyebrow\`}` and match the `<section>`'s `aria-labelledby`. Test: assert `getByRole('region')` finds the section by name.

### Pitfall 7: Filter chip count badge inheriting wrong color on active chip

**What goes wrong:** The inactive chip uses `text-[color:var(--color-text-secondary)]` and the count badge has `text-[color:var(--color-text-secondary)]`. When the chip becomes active, the parent text shifts to `--color-text-on-accent`, but the badge's explicit color override stays at `--color-text-secondary` — invisible on the amber background.

**Why it happens:** Tailwind utility specificity. The count's explicit color class wins over inheritance.

**How to avoid:** Drop the explicit color on the count badge and let it inherit from the chip parent. Or set the count to `text-current` to explicitly inherit. The chip's text-color rule then drives the badge color automatically across states.

```tsx
<span className="ml-2 text-current" aria-hidden="true">{count}</span>
```

### Pitfall 8: Mocking `useReducedMotion` AND `m` in the same Vitest mock

**What goes wrong:** Existing tests mock `motion/react` via `vi.mock('motion/react', () => ({ m: new Proxy(...) }))`. This replaces the entire module — including `useReducedMotion`. Calling `useReducedMotion()` in a component under test throws "useReducedMotion is not a function."

**Why it happens:** `vi.mock` replaces the entire module export object. Re-exporting via `vi.importActual` is the standard escape.

**How to avoid:** Use `vi.importActual` to spread the real module and override only `m`, OR explicitly mock `useReducedMotion` per-test:

```tsx
vi.mock('motion/react', () => ({
  m: new Proxy({}, { /* ... */ }),
  useReducedMotion: () => false, // or true per test
}))
```

Document this in `tests/home/thesis-paragraph.test.tsx` so the next contributor doesn't re-introduce the partial mock.

### Pitfall 9: `<a href="/projects">` inside the filter row triggers the wrong route on the active chip

**What goes wrong:** Both the active chip's clear-action href (`/projects`) and a literal "view all projects" footer link would resolve to the same URL. If the page has a "back to top" anchor at `#top`, ensure the clear-filter href is `/projects` (no fragment) so reload-restoration works correctly.

**Why it happens:** The router normalizes `/projects` ≡ `/projects?tag=` ≡ `/projects/` in some configurations. As long as the canonical URL is `/projects` (no trailing slash, no query), back-button restoration works. UI-SPEC § Per-Route Metadata Contract explicitly locks `canonical: /projects` — match that exactly.

**How to avoid:** Hard-code `href="/projects"` (no trailing slash, no fragment) on the clear-filter link AND on the active chip's href. Test:

```tsx
expect(container.querySelector('a[aria-pressed="true"]')?.getAttribute('href')).toBe('/projects')
```

### Pitfall 10: `<TierSeparator label="hero" />` rendered on first tier section creates a stray hairline above it

**What goes wrong:** On `/projects` with no filter, the markup is `TagFilterRow → <section><TierSeparator label="hero">cards…</section> → <section><TierSeparator label="secondary">cards…</section>`. The `<TierSeparator>` style is `border-t … pt-…`, so the first separator paints a hairline above the hero section — which sits directly below the filter row, creating a "filter row | hairline | hero label" visual that may look like the filter row is part of a tier.

**Why it happens:** UI-SPEC § Page Composition Case A explicitly accepts this: "The hairline above the first separator on this page is acceptable visually (it sits below the filter row, providing closure to the filter section)." But this contradicts § Vertical rhythm row "Filter row → first tier section: mt-8" — if the separator paints its own `mt-12 md:mt-16 + pt-6 md:pt-8`, the total spacing is larger than `mt-8`.

**How to avoid:** Two options:
- **Accept the larger spacing** (separator's intrinsic mt + pt) and document the UI-SPEC discrepancy in a deferred item.
- **Pass a `first?: boolean` prop** to `<TierSeparator>` that omits the `border-t` on the first occurrence. Use `first` on the hero separator when it's the page-top tier section.

Recommendation: **accept the larger spacing**. The hairline below the filter row is a deliberate closure cue per UI-SPEC. The cumulative spacing reads as intentional rhythm, not a bug.

### Pitfall 11: Empty array `getProjectsByTag('hero-tier')` because `'hero'` isn't a tag

**What goes wrong:** Someone reads the chip labels (`hero`, `secondary`) on the index page and assumes they're filterable tags. Clicking would produce `/projects?tag=hero` → `getProjectsByTag('hero')` → empty array (no project has `'hero'` in its `tags` array) → EmptyFilterState.

**Why it happens:** The eyebrow label `hero` is purely positional, not a tag. `tier` is a separate Project field.

**How to avoid:** Document this in code comments. The `<TierSeparator>` label is NOT a link. The chip labels in `<TagFilterRow>` come from `TAG_LABELS[tag]` which never includes `'hero'` because `TAGS` doesn't contain it. The two label systems are disjoint by design. Tests verify: `<TagFilterRow>` chip labels do not include the string "hero".

### Pitfall 12: Accidentally importing `<TagChipRow>` inside `<CardMeta>`

**What goes wrong:** Auto-import suggests `TagChipRow` when typing `<Tag` in `card-meta.tsx`. The component would compile but break the nested-anchor contract.

**Why it happens:** IDE auto-import scans the project; `<TagChipRow>` is in the same `components/projects/` directory.

**How to avoid:** Lint rule (Biome doesn't have this built-in; manual code-review gate) + a test on `<CardMeta>` that asserts zero `<a>` elements:

```tsx
it('CardMeta renders ZERO anchor elements (chips are presentational)', () => {
  const { container } = render(<CardMeta year={2025} tags={['local-first']} visibility="public" />)
  expect(container.querySelectorAll('a').length).toBe(0)
})
```

---

## Code Examples

Verified patterns from official sources + this repo's existing convention.

### Example 1: Next 16 RSC page with searchParams Promise

```tsx
// app/(site)/projects/page.tsx
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional
import type { Metadata } from 'next'
import { getAll, getAllTags, getProjectsByTag } from '@/lib/projects'
import { TAGS, type Tag } from '@/lib/tags'
import { EmptyFilterState } from '@/components/projects/empty-filter-state'
import { ProjectCardSecondary } from '@/components/projects/project-card-secondary'
import { TagFilterRow } from '@/components/projects/tag-filter-row'
import { TierSeparator } from '@/components/projects/tier-separator'

export const metadata: Metadata = {
  title: 'all projects',
  description:
    "A filterable index of Olive Elliott's work — hero-tier case studies and secondary projects across local-first, autonomous, and open-source contributions.",
  alternates: { canonical: '/projects' },
  openGraph: {
    title: 'all projects',
    description:
      "A filterable index of Olive Elliott's work across local-first, autonomous, and open-source contributions.",
    url: '/projects',
    type: 'website',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'olivelliott.dev' }],
  },
  twitter: { card: 'summary_large_image', images: ['/og-default.png'] },
}

interface PageProps {
  searchParams: Promise<{ tag?: string | string[] }>
}

export default async function ProjectsIndexPage({ searchParams }: PageProps) {
  const sp = await searchParams
  const rawTag = Array.isArray(sp.tag) ? sp.tag[0] : sp.tag
  const activeTag: Tag | undefined =
    rawTag && (TAGS as readonly string[]).includes(rawTag)
      ? (rawTag as Tag)
      : undefined

  const allTags = getAllTags()
  const projects = activeTag ? getProjectsByTag(activeTag) : getAll()
  const heroProjects = projects.filter((p) => p.tier === 'hero')
  const secondaryProjects = projects.filter((p) => p.tier === 'secondary')

  return (
    <>
      <header>
        <h1 className="font-mono text-[var(--text-display)] leading-[1.15] tracking-[0.02em] font-medium lowercase text-[color:var(--color-text-primary)]">
          all projects
        </h1>
      </header>
      <TagFilterRow tags={allTags} activeTag={activeTag} />
      {activeTag && projects.length === 0 ? (
        <EmptyFilterState tag={activeTag} />
      ) : (
        <>
          {heroProjects.length > 0 && (
            <section aria-labelledby="hero-tier-eyebrow">
              <TierSeparator label="hero" id="hero-tier-eyebrow" />
              <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {heroProjects.map((p) => (
                  <ProjectCardSecondary key={p.slug} project={p} hero />
                ))}
              </div>
            </section>
          )}
          {secondaryProjects.length > 0 && (
            <section aria-labelledby="secondary-tier-eyebrow">
              <TierSeparator label="secondary" id="secondary-tier-eyebrow" />
              <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {secondaryProjects.map((p) => (
                  <ProjectCardSecondary key={p.slug} project={p} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </>
  )
}
```

### Example 2: `<TagFilterRow>` — RSC with active/inactive chip

```tsx
// components/projects/tag-filter-row.tsx
// RSC. No client state. Each chip is a plain <a>.
import { TAG_LABELS, type Tag } from '@/lib/tags'

interface TagFilterRowProps {
  tags: ReadonlyArray<{ tag: Tag; count: number }>
  activeTag?: Tag
}

const CHIP_BASE =
  'inline-flex items-center px-3 py-2 rounded-sm font-mono text-[var(--text-label)] font-medium tracking-[0.02em] lowercase transition-colors duration-[120ms] ease-linear'

const CHIP_INACTIVE = `${CHIP_BASE} bg-[color:var(--color-surface-2)] text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]`

const CHIP_ACTIVE = `${CHIP_BASE} bg-[color:var(--color-accent)] text-[color:var(--color-text-on-accent)] hover:bg-[color:var(--color-accent-hover)]`

export function TagFilterRow({ tags, activeTag }: TagFilterRowProps) {
  return (
    <nav aria-label="Filter projects by tag" className="mt-16 md:mt-24">
      <ul role="list" className="flex flex-wrap gap-3 items-center">
        {tags.map(({ tag, count }) => {
          const isActive = tag === activeTag
          const href = isActive ? '/projects' : `/projects?tag=${tag}`
          return (
            <li key={tag}>
              <a
                href={href}
                aria-pressed={isActive}
                aria-current={isActive ? 'true' : undefined}
                className={isActive ? CHIP_ACTIVE : CHIP_INACTIVE}
              >
                {TAG_LABELS[tag]}
                <span className="ml-2 text-current" aria-hidden="true">
                  {count}
                </span>
              </a>
            </li>
          )
        })}
        {activeTag && (
          <li>
            <a
              href="/projects"
              className="
                ml-3 px-3 py-2 -my-2
                font-mono text-[var(--text-label)] font-medium tracking-[0.02em] lowercase
                text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]
                no-underline hover:underline hover:underline-offset-4 hover:decoration-1
                transition-colors duration-[120ms] ease-linear
              "
            >
              × clear filter
            </a>
          </li>
        )}
      </ul>
    </nav>
  )
}
```

### Example 3: `<ThesisParagraph>` — SSR-safe motion island

(See Pattern 4 above for the full source. Repeating the key shape here.)

```tsx
// components/home/thesis-paragraph.tsx
'use client'

import { m, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'

interface ThesisParagraphProps {
  text: string
  className?: string
}

export function ThesisParagraph({ text, className }: ThesisParagraphProps) {
  const [mounted, setMounted] = useState(false)
  const prefersReduced = useReducedMotion()
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || prefersReduced) {
    return <p className={className}>{text}</p>
  }

  const segments = text.split(/(\s+)/)
  let wordIndex = 0
  return (
    <p className={className}>
      {segments.map((seg, i) => {
        if (/^\s+$/.test(seg)) {
          return (
            <span key={i} aria-hidden="true">
              {seg}
            </span>
          )
        }
        const delay = wordIndex * 0.03
        wordIndex++
        return (
          <m.span
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.18,
              delay,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {seg}
          </m.span>
        )
      })}
    </p>
  )
}
```

### Example 4: `<CardMeta>` — presentational meta row

```tsx
// components/projects/card-meta.tsx
// RSC. Presentational sibling of <ProjectMeta> for use inside card surfaces
// where chips and labels must not introduce nested anchors. Renders year + tag
// chips as <span> + (when private) "code private" label. NO repo link, ever.
import type { Tag } from '@/lib/tags'

interface CardMetaProps {
  year: number
  tags: readonly Tag[]
  visibility: 'public' | 'private'
}

export function CardMeta({ year, tags, visibility }: CardMetaProps) {
  return (
    <div
      role="list"
      aria-label="Project metadata"
      className="flex flex-wrap items-center gap-3"
    >
      <time
        dateTime={String(year)}
        className="font-mono text-[var(--text-label)] font-medium tracking-[0.02em] text-[color:var(--color-text-secondary)]"
      >
        {year}
      </time>
      {tags.map((tag) => (
        <span
          key={tag}
          className="
            inline-flex items-center px-3 py-2
            bg-[color:var(--color-surface-2)] rounded-sm
            font-mono text-[var(--text-label)] font-medium tracking-[0.02em] lowercase
            text-[color:var(--color-text-secondary)]
          "
        >
          {tag}
        </span>
      ))}
      {visibility === 'private' && (
        <span className="font-mono text-[var(--text-label)] font-medium tracking-[0.02em] lowercase text-[color:var(--color-text-tertiary)]">
          code private
        </span>
      )}
    </div>
  )
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `searchParams` as `{ [k: string]: string \| string[] }` synchronously | `searchParams: Promise<{ ... }>` — async/await required | Next 15.0.0-RC (Sep 2024); enforced in Next 16 | Phase 4 pages MUST be `async function`; reading sync is a bug |
| `params` as synchronous prop | `params: Promise<{ slug: string }>` | Next 15.0.0-RC | Phase 3's `[slug]/page.tsx` already uses the Promise form |
| `useSearchParams()` for filter UI | RSC `searchParams` prop on RSC pages | Next 13 (RSC GA) | Filter chips are `<a>`, page reads URL on the server; zero client JS |
| `framer-motion` package | `motion` package, import from `motion/react` | Motion 12 launch (2024); `framer-motion` is legacy | Project locked to `motion@12.38.0` Phase 1 |
| `<motion.*>` components | `<m.*>` components under `LazyMotion strict` | Phase 1 decision | Reduces bundle ~15KB; `<motion.*>` throws at runtime |
| `MotionConfig reducedMotion="user"` handles all animation gating | Manual `useReducedMotion()` gate for opacity (transform/layout auto-disabled, opacity persists) | Always been this way; common misunderstanding | The `<ThesisParagraph>` MUST manually gate opacity — see Pitfall 4 |
| `generateMetadata` for static title/description | Static `metadata` const export | Best practice per Next docs | Cheaper at build; clearer at read |

**Deprecated / outdated:**

- `next-mdx-remote` — archived April 2026 (per `research/SUMMARY.md`). Not relevant to Phase 4 (no MDX rendering on home or index) but worth re-asserting: the project uses `@next/mdx` exclusively.
- `framer-motion` package name — use `motion`. (Project already correct.)
- `next/dynamic({ ssr: false })` for SSR-safe rendering — modern pattern is `<Suspense>` boundaries + server components. Not relevant to Phase 4; the thesis paragraph uses the two-stage `mounted` pattern, not dynamic-import.

---

## Open Questions

1. **Should the thesis paragraph copy be locked in Phase 4 or genuinely placeholder?**
   - What we know: CONTEXT.md says "draft a placeholder Olive will revise in Phase 7's content pass."
   - What's unclear: Whether the placeholder should be the UI-SPEC's draft string (`I work on Myco, Fathom, Agenda Keeper, and contributions to Aktiga — building local-first systems and autonomous workflows so people have time and attention for everything else that matters. Open-source where I can; honest about the trade-offs where I can't.`) verbatim or a shorter placeholder.
   - Recommendation: Use the UI-SPEC draft string verbatim. Mark with `{/* PLACEHOLDER: Phase 7 content pass */}` immediately above the string literal. Phase 7's content pass can update in-place.

2. **Should `<ThesisParagraph>` accept the className prop and merge with default classes, or own its own className?**
   - What we know: UI-SPEC props sketch says `{ text: string; className?: string }`.
   - What's unclear: Whether `<HomeHero>` passes typography classes via `className` or whether `<ThesisParagraph>` owns them internally.
   - Recommendation: Pass typography classes from `<HomeHero>` via `className` (the body / Geist Sans / 400 / leading-1.6 / `text-secondary` / `max-w-[55ch]` stack matches the role frame and lives at the parent layout level). `<ThesisParagraph>` owns only the segmentation logic, not the typography.

3. **Should `<ProjectCardHero>` use `priority` on the hero image?**
   - What we know: The home page renders 3 hero cards above the fold (assuming v1 launch corpus: Myco, Fathom, Agenda Keeper); Myco is currently text-only (placeholder hero); Fathom and Agenda Keeper will have real images in Phase 7.
   - What's unclear: Whether `priority` on the first hero image only is appropriate, or whether the LCP candidate is actually the wordmark or the thesis paragraph.
   - Recommendation: **Do NOT set `priority` on any card image in Phase 4.** Phase 6 will tune LCP with `next/image` sizes + priority + Lighthouse measurements. Defaulting to no-priority lets the framework decide. (The detail-page `<ProjectHero>` already uses `priority`; that's correct there because the hero IS the LCP candidate on that route.)

4. **Should the filter row include a "see all" / "no filter" pseudo-chip alongside the active-tag clear?**
   - What we know: UI-SPEC § Component Inventory #8 has the chip row + a separate `× clear filter` link only when active.
   - What's unclear: Whether an explicit "all" pseudo-chip would be a clearer mental model than the implicit "click the active chip to clear OR click clear filter."
   - Recommendation: Follow the UI-SPEC. The two-affordance pattern (active-chip-toggles + dedicated clear) is well-established in faceted-search UIs. Adding a third "all" chip dilutes the active-tag visual.

5. **Should `aria-current` on the active filter chip be `"page"` or `"true"`?**
   - What we know: WAI-ARIA spec defines `aria-current` values: `page`, `step`, `location`, `date`, `time`, `true`, `false`.
   - What's unclear: Whether `"page"` (meaning "this link is the current page") or `"true"` (generic "this item is current") is more accurate.
   - Recommendation: Use `"true"`. The active chip is not "the current page" (the current page is `/projects?tag=X`, and the chip links to `/projects` — the OPPOSITE direction). `"true"` is the generic semantic for "active in a set."

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 3.x + @testing-library/react 16 + jsdom 25 |
| Config file | `vitest.config.ts` (existing — `mdxShimPlugin` + `@` alias + `server-only` stub) |
| Quick run command | `pnpm vitest run tests/projects/<file>.test.tsx tests/home/<file>.test.tsx` |
| Full suite command | `pnpm test:ci` (runs `vitest run`) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| HOM-01 | Home hero renders single H1 + thesis paragraph slot | unit (RSC RTL) | `pnpm vitest run tests/home/home-hero.test.tsx` | ❌ Wave 0 |
| HOM-01 | Thesis copy honest, no banned words (`passionate`, `scalable`, etc.) | unit (string scan) | `pnpm vitest run tests/home/thesis-paragraph.test.tsx` | ❌ Wave 0 |
| HOM-02 | Hero-tier projects render via `<ProjectCardHero>` with H2 + tagline + outcomes | unit (RTL) | `pnpm vitest run tests/projects/project-card-hero.test.tsx` | ❌ Wave 0 |
| HOM-02 | `<HomeProjectGrid>` composes hero cards in order | unit (RTL) | `pnpm vitest run tests/home/home-project-grid.test.tsx` | ❌ Wave 0 |
| HOM-03 | Secondary-tier projects render via `<ProjectCardSecondary>` (no outcomes, no image, H3 title) | unit (RTL) | `pnpm vitest run tests/projects/project-card-secondary.test.tsx` | ❌ Wave 0 |
| HOM-03 | Secondary section omitted when zero secondary projects exist | unit (RTL) | `pnpm vitest run tests/home/home-project-grid.test.tsx` | ❌ Wave 0 |
| HOM-04 | No `whileInView` / IntersectionObserver / scroll listeners on cards or sections | source-grep | `! grep -rE "whileInView\|IntersectionObserver\|onscroll" components/projects/ components/home/` | ❌ Add to a Wave-3 invariants test |
| HOM-04 | No bento-grid utilities (`grid-rows-` asymmetric, `col-span-2` patterns inside hero stack) | source-grep | n/a (visual; tested via Phase 6 anti-features sweep) | n/a |
| HOM-05 | `<ThesisParagraph>` SSR fallback renders full text in plain `<p>` | unit (RTL) | `pnpm vitest run tests/home/thesis-paragraph.test.tsx` | ❌ Wave 0 |
| HOM-05 | `<ThesisParagraph>` collapses to plain `<p>` when `useReducedMotion() === true` | unit (RTL, mock useReducedMotion) | same file | ❌ Wave 0 |
| HOM-05 | `<ThesisParagraph>` renders per-word `<m.span>` when motion permitted | unit (RTL) | same file | ❌ Wave 0 |
| PIX-01 | `/projects` RSC reads `searchParams.tag`, branches `getProjectsByTag` vs `getAll` | integration (RSC test) | `pnpm vitest run tests/projects/index-page.test.tsx` | ❌ Wave 0 |
| PIX-01 | Tier sections + separators render only when populated | integration | same file | ❌ Wave 0 |
| PIX-02 | Active chip href = `/projects` (clears), inactive chip href = `/projects?tag={tag}` | unit (RTL) | `pnpm vitest run tests/projects/tag-filter-row.test.tsx` | ❌ Wave 0 |
| PIX-02 | Server-side narrowing: unknown tag → no chip active, full list renders | integration | `pnpm vitest run tests/projects/index-page.test.tsx` | ❌ Wave 0 |
| PIX-02 | Array form `?tag=a&tag=b` → first only | integration | same file | ❌ Wave 0 |
| PIX-02 | Reload + back-button behavior | manual (HUMAN-UAT — browser only) | n/a | n/a — browser test |
| PIX-03 | All filter chips are `<a>` with `href` (keyboard activatable via Enter) | unit (RTL) | `pnpm vitest run tests/projects/tag-filter-row.test.tsx` | ❌ Wave 0 |
| PIX-03 | `:focus-visible` ring visible on chips | manual (HUMAN-UAT — browser visual) | n/a | n/a — browser test |
| PIX-04 | Hero cards have H2 + image (or text-only branch), secondary cards have H3 + no image | unit (RTL) | `pnpm vitest run tests/projects/project-card-hero.test.tsx tests/projects/project-card-secondary.test.tsx` | ❌ Wave 0 |
| PIX-04 | Private cards render literal `code private` label, zero `<a>` with repo href | unit (RTL) | `pnpm vitest run tests/projects/card-meta.test.tsx tests/projects/project-card-secondary.test.tsx` | ❌ Wave 0 |
| (cross-cutting) | Card surfaces never nest `<a>` inside `<a>` | unit (RTL `querySelectorAll('a a').length === 0`) | both card test files | ❌ Wave 0 |
| (cross-cutting) | Both pages render exactly one `<h1>` | unit (RTL) | both page-level tests | ❌ Wave 0 |
| (cross-cutting) | `tests/home/` + new `tests/projects/` files all green | suite | `pnpm test:ci` | partial — existing tests pass |
| (cross-cutting) | `pnpm typecheck` clean | static | `pnpm typecheck` | ✅ existing — Phase 4 adds files that must pass |
| (cross-cutting) | `pnpm build` exits 0; both routes statically prerendered | build smoke | `pnpm build` | ✅ existing build infra |
| (cross-cutting) | Banned-word scan on locked microcopy | unit | reuse `tests/fixtures/banned-terms.ts` against home/index source files | ❌ Wave 0 (add a test that greps the home page source for banned words) |

### Sampling Rate

- **Per task commit:** `pnpm vitest run <touched-files-glob>` (≤ 30 seconds for any single Phase 4 file)
- **Per wave merge:** `pnpm test:ci && pnpm typecheck` (~ 5 seconds vitest + ~ 3 seconds typecheck on this codebase)
- **Phase gate:** Full `pnpm test:ci && pnpm typecheck && pnpm build` green before `/gsd:verify-work`. Plus a manual `curl localhost:3000/ | grep "olive elliott"` smoke and `curl "localhost:3000/projects?tag=local-first" | grep myco` smoke.

### Manual-only Verification (acceptable for v1; Phase 6 will automate via Lighthouse + axe + Playwright)

These behaviors cannot be reasonably automated in Vitest/jsdom:

1. **Motion behavior** — the per-word fade actually appearing sequentially in a real browser, with the timing matching the spec. Verify via `pnpm dev` + visit `/` + observe.
2. **Reduced-motion bypass** — macOS System Preferences → Accessibility → Display → Reduce motion ON → `/` shows the thesis as a plain block instantly. (The unit test mocks the hook; only a real OS toggle verifies the integration.)
3. **Keyboard tab order** — Tab from skip link → wordmark → nav → cards (home) or chips → clear → cards (index). Verify in browser.
4. **`:focus-visible` ring visibility** — 2px amber outline on every focused interactive element. Visual check.
5. **CLS during type-set fade** — Lighthouse on the deployed home page must show CLS < 0.1 (Phase 6 gate).
6. **Lighthouse ≥ 90** — Phase 6.

### Wave 0 Gaps

- [ ] `tests/home/home-hero.test.tsx` — covers HOM-01
- [ ] `tests/home/thesis-paragraph.test.tsx` — covers HOM-05 (SSR fallback, reduced-motion bypass, motion-permitted render)
- [ ] `tests/home/home-project-grid.test.tsx` — covers HOM-02 + HOM-03 (composition + conditional secondary section)
- [ ] `tests/projects/project-card-hero.test.tsx` — covers HOM-02 + PIX-04 (image branch, outcomes cap, presentational chips, no nested anchors)
- [ ] `tests/projects/project-card-secondary.test.tsx` — covers HOM-03 + PIX-04 (hero prefix variant, no outcomes/image, no nested anchors)
- [ ] `tests/projects/card-meta.test.tsx` — covers PIX-04 (privacy label, zero anchors)
- [ ] `tests/projects/tag-filter-row.test.tsx` — covers PIX-01 + PIX-02 + PIX-03 (chip hrefs, aria states, clear link, count badge)
- [ ] `tests/projects/empty-filter-state.test.tsx` — covers PIX-02 edge (zero results)
- [ ] `tests/projects/tier-separator.test.tsx` — covers PIX-01 (label + aria-labelledby id pass-through)
- [ ] `tests/projects/index-page.test.tsx` — covers PIX-01 + PIX-02 (RSC integration: no filter / valid tag / invalid tag / array form / zero results / one-tier-only)
- [ ] (Optional) `tests/home/banned-words.test.ts` — string scan of home page source for banned words

No framework install needed; `vitest@3` and `@testing-library/react@16` already present.

---

## Sources

### Primary (HIGH confidence)

- [Next.js 16 `page.js` API reference](https://nextjs.org/docs/app/api-reference/file-conventions/page) — verified 2026-05-16. Confirms `searchParams: Promise<{...}>`, plain JavaScript object (not URLSearchParams), Request-time API.
- [Next.js `generateMetadata` reference](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) — verified 2026-05-16. Confirms static `metadata` const vs `generateMetadata` function, `title.default` + `title.template` semantics, `metadataBase` URL composition rules.
- [Motion docs — MotionConfig](https://motion.dev/docs/react-motion-config) — verified 2026-05-16. Confirms reducedMotion behavior: "transform and layout animations will be disabled. Other animations, like opacity and backgroundColor, will persist."
- [Motion docs — Accessibility / useReducedMotion](https://motion.dev/docs/react-use-reduced-motion) — verified 2026-05-16. Confirms `useReducedMotion()` returns `null` then `boolean`, suitable for SSR + manual gating.
- This repo's existing source:
  - `app/(site)/projects/[slug]/page.tsx` — Next 16 Promise<params> pattern in production use
  - `tests/projects/page.test.tsx` lines 12–37 — `motion/react` Proxy mock pattern (reusable)
  - `lib/projects.ts` — query API consumed by all Phase 4 cards
  - `styles/tokens.css` — every color/spacing/motion token Phase 4 uses
  - `components/motion/motion-provider.tsx` — `LazyMotion strict` + `MotionConfig reducedMotion="user"`

### Secondary (MEDIUM confidence — cross-verified)

- [Motion docs — transitions / stagger](https://motion.dev/docs/react-transitions) — verified 2026-05-16; describes `stagger()` + `delayChildren` variants pattern (alternative to hand-rolled, see Pattern 4 Alternatives Considered).
- [WAI-ARIA Authoring Practices — `aria-current`](https://www.w3.org/TR/wai-aria-1.2/#aria-current) — generic vs page-specific values discussed in Open Question #5.

### Tertiary (LOW confidence — single source or training data)

- Tailwind v4 utility behavior on `text-current` inheriting parent color — verified empirically; this is standard CSS `currentColor` behavior surfaced via Tailwind v4 utility.

---

## Metadata

**Confidence breakdown:**

- Next 16 `searchParams` API: HIGH — verified verbatim against official 16.2.6 docs (project on 16.2.4 — same Promise contract)
- Motion reduced-motion gating: HIGH — explicit docs quote contradicting the UI-SPEC; load-bearing finding (Pitfall 4)
- Static metadata vs `generateMetadata` choice: HIGH — official docs recommendation
- Card / chip / filter component patterns: HIGH — derived from Phase 3 existing precedent (`<TagChipRow>` + `<ProjectMeta>` in this repo)
- ARIA `aria-current` vs `aria-pressed`: MEDIUM — both attributes valid; the dual usage is a pragmatic choice, not a single-source mandate
- Component split recommendation (separate vs unified): MEDIUM — design judgment based on prop-shape divergence; either is correct
- Test mock patterns: HIGH — proven in Phase 3 production code (`tests/projects/page.test.tsx`, `tests/projects/next-project-block.test.tsx`)

**Research date:** 2026-05-16
**Valid until:** 2026-06-15 (30 days — Next.js 16.2 and Motion 12.x are stable; no breaking changes expected in this window)

---

*Research complete. Planner can now create PLAN.md files for Phase 4.*
