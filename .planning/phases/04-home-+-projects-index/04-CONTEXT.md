# Phase 4: Home + Projects Index - Context

**Gathered:** 2026-05-16
**Status:** Ready for planning
**Mode:** Smart discuss (autonomous)

<domain>
## Phase Boundary

Two new routes plus a shared `<ProjectCard>` component family. `/` (home) renders the thesis hero, hero-tier project cards, and secondary-tier project cards — all driven by the Phase 2 query API (`getHeroProjects`, `getAll`). `/projects` (index) renders all non-archived projects grouped by tier with a server-rendered URL-synced tag filter row. Both pages reuse Phase 3's design system and component primitives where applicable (TagChipRow, ProjectMeta). Not in scope: project detail template (already shipped Phase 3), about / resume / contact (Phase 5), sitemap / robots / OG audit (Phase 6), authoring MDX for non-Myco projects (Phase 7).

</domain>

<decisions>
## Implementation Decisions

### Home Hero & Thesis (HOM-01, HOM-04, HOM-05)
- **Composition:** Single-column, left-aligned. Hero stack: large display wordmark `olive elliott` (replaces the Phase 1 placeholder "olivelliott.dev"), one-line role frame, 2–3 line thesis paragraph. Generous breathing room above the project grid.
- **Thesis voice:** Plain-spoken and specific — names projects in-sentence ("I work on Myco, Fathom, Agenda Keeper, and Aktiga…"). No buzzwords (passionate, innovative, transformative). Honest content; placeholders are explicitly placeholders if final copy isn't ready.
- **One earned motion moment (HOM-05):** Type-set entrance on the thesis paragraph — fades in word-by-word over ~600ms using `--motion-ease-standard` and the existing `--motion-duration-slow` token (reserved in Phase 1 for "Phase 4 hero moment only"). Reduced-motion → instant render. No scroll-tied motion, no cursor-reactive effects. This is the only motion on the home page beyond Phase 1's FadeIn.
- **Hero → cards transition:** Single hairline divider (`--color-hairline`) between hero block and project grid section. Section heading `selected work` rendered in `GeistMono` lowercase at label size (14px). No display-heading.

### ProjectCard Component & Tier Differentiation (HOM-02, HOM-03, PIX-04)
- **Hero-tier card:** Wide horizontal card. Single-column on mobile; 1-up at lg+ (each hero card spans the full content width). Structure: title (H2 size, 24/28px), tagline (body), inline TagChipRow, 2–3 single-line outcome bullets, hero image right-aligned if `!isPlaceholderHero(hero.src)` else text-only with the title carrying the weight. Whole card is `<a href="/projects/${slug}">`. (Reuses Phase 3 `isPlaceholderHero`.)
- **Secondary-tier card:** Compact horizontal layout. 1-up on mobile, 2-up on md+, 3-up on lg+. Structure: title (H3 size, 20px), tagline (body), inline TagChipRow. No outcomes bullets, no hero image. Tighter padding. Same `<a>` wrapper.
- **Private indicator on card:** Static `code private` label rendered in `--color-text-tertiary`, placed in the meta row next to/below tag chips. Cards do NOT show a `repo ↗` link directly (that lives only on detail pages); the privacy contract here is purely the visible `code private` label.
- **Hero-tier mono-prefix label (on /projects index only):** `hero` rendered in `GeistMono` `--color-text-tertiary` at label size above the card title, marking position on the index page. NOT shown on the home page where card size already conveys tier.
- **Hover / focus:** Hairline border (`--color-hairline`) lifts to `--color-text-tertiary` on hover/focus; title underline appears in `--color-accent`. No scale, no shadow, no glow. CSS transitions on color/border only. Reduced-motion gating not required for color transitions per Phase 1's UI-SPEC anti-patterns clause.

### /projects Index Layout (PIX-01)
- **Page composition:** Top: page heading `all projects` in `GeistMono` lowercase, label size. Below: filter row (tag chips + active-filter indicator + clear). Below: hero-tier cards first (in `order` ascending), then a hairline divider with `secondary` mono lowercase label, then secondary-tier cards.
- **Card variant on /projects:** Use the **secondary-tier card shape** for all projects on this page — even hero-tier ones. The home page handles "weight" via large cards; the index trades weight for scanability. Hero distinction on the index comes from position + the `hero` mono prefix label (per ProjectCard decision above).
- **Empty filter result:** Inline message in `--color-text-secondary`: `no projects tagged "${tag}" — view all projects →` with the link clearing the filter (`href="/projects"`). No illustration, no empty-state cliché.
- **Tier separator:** Hairline divider + `secondary` mono lowercase label on its own line. Hidden when the active filter results in zero secondary-tier matches.

### Tag Chip Filter — URL-synced (PIX-01, PIX-02, PIX-03)
- **Selection model:** Single tag at a time. Click a chip → `?tag=local-first`. Click the active chip again → URL cleared. Click a different chip → URL replaced. Matches the PIX-02 success criterion exactly.
- **Implementation:** Server component reads `searchParams.tag`; calls `getProjectsByTag(tag)` if present else `getAll()`. Chips are `<a>` elements with proper `href` values (the active chip's href points to `/projects` to clear). No `useSearchParams`, no `'use client'`, no client-side state. Back button + reload restore the exact filter state natively.
- **Active filter affordance:** Active chip uses `--color-accent` background with `--color-text-on-accent` foreground. An inline `× clear filter` link appears next to the chip row when a tag is active. Inactive chips use `--color-surface-2` background with `--color-text-primary` foreground.
- **Keyboard navigation (PIX-03):** Native `<a>` elements — Tab through chips in DOM order, Enter/Space activates the link (browser default). Visible `:focus-visible` ring inherits from Phase 1 (2px accent outline + 2px offset). No custom keyboard handlers needed.
- **Chip order:** Use Phase 2's `getAllTags()` which returns chips sorted by `count desc`, then `tag` alphabetically asc. Most-used tags surface first.

### Routing
- `app/(site)/page.tsx` — replaces the Phase 1 placeholder home page.
- `app/(site)/projects/page.tsx` — new file. Index of all projects.
- Both pages are RSC; the only `'use client'` directive is the existing motion island for the type-set thesis entrance (one small client component).
- `app/(site)/projects/[slug]/page.tsx` (Phase 3) is untouched.

### Claude's Discretion
- Exact spacing values between hero block and cards row (within token scale).
- Exact word-fade-in timing per word (within `--motion-duration-slow` budget).
- Whether the type-set motion uses `Motion`'s stagger primitives or a hand-rolled `useEffect` — pick whichever is cleaner; reduced-motion gating must work.
- Component file layout under `components/projects/`: `project-card.tsx` (shared shell), `project-card-hero.tsx` (hero variant), `project-card-secondary.tsx` (secondary variant) — OR a single `project-card.tsx` with a `tier` prop. Pick whichever reads cleaner; tests assert the rendered DOM, not the file structure.
- Whether `getProjectsByTag('hero-tier')` (i.e., filtering by tier as a tag) needs special handling — likely not, since `tier` is a separate field, but verify against the schema.
- Exact thesis paragraph copy — draft a placeholder Olive will revise in Phase 7's content pass.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `lib/projects.ts`: `getAll()`, `getHeroProjects()`, `getAllTags()`, `getProjectsByTag(tag)` — already typed and tested in Phase 2. Phase 4 consumes them; no new query functions needed.
- `lib/schemas.ts`: `Project` type with `tier: 'hero' | 'secondary'`, `tags`, `outcomes`, `tier`, `visibility` — all fields the card needs.
- `lib/hero-fallback.ts`: `isPlaceholderHero(src)` — shipped Phase 3 Wave 0; the hero-tier card uses it to decide between image / text-only treatment.
- `components/projects/tag-chip-row.tsx` — Phase 3 component, already renders mono lowercase chips linking to `/projects?tag=X`. Phase 4 reuses it on cards AND it's the visual sibling of the filter row chips on `/projects` (a slightly different component for the filter row since it needs active-state styling).
- `components/projects/project-meta.tsx` — Phase 3 component for detail page. Phase 4's secondary card may borrow its private-label rendering; hero card likely uses a leaner inline approach.
- `mdx-components.tsx` — already registers Figure/Gallery/Callout from Phase 3. Home and index are NOT MDX-rendered, so this is unaffected.
- `app/(site)/layout.tsx` — provides Nav + main + Footer + MotionProvider. Phase 4 pages plug in; nothing to replace.
- `styles/tokens.css` — `--motion-duration-slow` (420ms) is the reserved budget for the home hero moment. `--color-surface-2`, `--color-hairline`, `--color-accent`, `--color-text-on-accent` are all available.
- `app/globals.css` — `.prose` class is for MDX bodies only; cards use plain Tailwind utilities.
- Phase 3 `components/motion/fade-in.tsx` + `motion-provider.tsx` — wrappers for the home hero motion island.

### Established Patterns
- RSC-first; `'use client'` only for motion components and the new home-hero motion island.
- Strict TypeScript; Zod-narrowed types from `lib/schemas.ts` are the authoritative shape.
- Design tokens drive everything via Tailwind v4 `@theme`. No raw colors or arbitrary durations.
- Vitest tests live next to source under `tests/`. Phase 4 follows the same pattern.
- Motion components import from `motion/react` and use `m.*` (NOT `motion.*`) per Phase 1's LazyMotion strict mode.
- URL searchParams are read on the server via the `searchParams` prop on RSC pages. Type narrowing on string|string[] is required.

### Integration Points
- **Consumed by Phase 6:** `app/sitemap.ts` enumerates all routes; `/` and `/projects` join `/projects/${slug}` as the discoverable URL set. OG metadata audit will hit both pages.
- **Consumed by Phase 7:** Real content for Fathom, Agenda Keeper, Trade Bot, Stemz, Aktiga MDX lands in Phase 7 — those new MDX files automatically populate the home + index pages via the query API. No template work needed at that point.

</code_context>

<specifics>
## Specific Ideas

- Reference aesthetic: [wallofportfolios.in](https://www.wallofportfolios.in/?company=All) — dark, minimalist, typographic rhythm.
- Anti-features re-asserted: no bento grid (HOM-04), no stagger-on-scroll (HOM-04), no glassmorphism, no gradient blobs, no Lottie, no R3F, no skill bars.
- The home page hero is the ONE place v1 spends a motion budget beyond CSS transitions. Everything else stays editorial.
- Tag filter URL state matters because the success criterion explicitly tests reload + back button — single-tag-at-a-time keeps the state machine simple and the URL clean.
- Phase 1's TODO list flagged "Display typeface: Geist default vs custom type-foundry face" — defer this decision. Stay on Geist for v1.

</specifics>

<deferred>
## Deferred Ideas

- Multi-tag selection (AND/OR semantics, URL like `?tag=local-first,autonomous`) — defer post-launch; revisit if filter usage warrants it.
- Per-project accent color (Phase 1 deferred to v2 — CNT2-02).
- Cursor-reactive logo / hero detail (defer; one earned motion moment is the type-set thesis).
- Pagination / virtualization on `/projects` (defer; 6–20 projects fit comfortably without pagination).
- Sort UI (by year, by tag count, alphabetical) — defer; default `order` ascending is sufficient.
- Image-grid view on `/projects` — defer; secondary card variant is the v1 affordance.
- Project search (full-text via Pagefind / FlexSearch) — deferred beyond v1.
- "Featured" or "latest" carousel above the hero — explicitly out per HOM-04 anti-bento clause.
- Tier separator with custom illustration / chrome (defer; hairline + mono label is the v1 affordance).

</deferred>
