# Phase 3: Project Detail Template - Context

**Gathered:** 2026-05-15
**Status:** Ready for planning
**Mode:** Smart discuss (autonomous)

<domain>
## Phase Boundary

A statically-rendered `/projects/[slug]` route group that turns the typed `Project` collection from Phase 2 into a real, end-to-end case study page — anchored by Myco. Includes hero treatment, MDX content rendering with custom components (Figure / Gallery / Callout) and Shiki-highlighted code blocks, a "next project" navigation block, and per-route metadata + OG image. Private-project handling renders a visible `code private` label in place of any repo link. Not in scope: home page (Phase 4), `/projects` index + filterable tag chips (Phase 4), about / resume / contact (Phase 5), sitemap / robots / global SEO audit (Phase 6), authoring MDX for non-Myco projects (Phase 7).

</domain>

<decisions>
## Implementation Decisions

### Hero Treatment & Layout
- **Composition:** Two-column on `md+` — left = title, tagline, year, tags, repo-or-private label; right = hero image. Stacks single-column on mobile.
- **Tag chips:** Inline mono-uppercase chips below tagline; each is a link to `/projects?tag=X` (Phase 4 wires the destination, but the `href` works statically and degrades gracefully to a 404 until then).
- **Repo / privacy indicator:** Inline metadata row. Public projects → `repo ↗` rendered as an accent-colored link (`--color-accent`). Private projects → static `code private` label rendered in `--color-text-tertiary`. No big button CTAs.
- **Hero image fallback:** When `hero.src` matches the placeholder pattern (`/images/projects/*/hero-placeholder.png`), render a **deliberate text-only hero** — large display title only, no `<img>` tag, no generic-placeholder rectangle. Detection is by suffix, not by missing-file probe (RSC-safe).

### MDX Component Library
- **Components shipped:** `Figure` (img + optional caption), `Gallery` (2-up / 3-up grid), `Callout` (variants: `note` / `warn` / `quote`), and Shiki-highlighted `pre/code`. Headings + paragraphs use Tailwind v4 + token defaults wired through `mdx-components.tsx`.
- **Code highlighting:** `rehype-pretty-code` + Shiki theme **`vesper`** (dark, restrained, complements Geist Mono). Build-time tokenization → zero client JS for code blocks.
- **Heading anchors:** `rehype-slug` + `rehype-autolink-headings` — invisible anchor wraps the heading; visible `#` symbol only on hover/focus, in `--color-text-tertiary`. H2 = display-medium tracking-tight; H3 = body-large medium-weight.
- **Body width:** MDX prose constrained to `max-w-prose` (~65ch) inside the existing `max-w-6xl` site shell. Headings, figures, and gallery may bleed wider than prose for emphasis. The hero section is full-width.

### Next Project Navigation
- **Algorithm:** `getRelatedProjects(slug, 1)` for top tag-overlap. If zero overlap (no shared tag), fall back to next project by `order` ascending — cyclic, so the last project wraps to the first. Handles single-project case (Myco-only at this phase) by linking back to `/projects` index instead.
- **Visual:** Full-width "next" block at end of MDX. Small mono `next →` eyebrow in `--color-text-tertiary`, then display-size project title, then tagline. Hover: subtle accent underline appears + cursor leans `translateX(4px)` over `--motion-duration-base` with `--motion-ease-standard`.
- **Position:** Inside `<main>` after MDX content, before site `<Footer>`. Hairline divider (`--color-hairline`) above for visual separation.
- **Reduced-motion:** No `translateX` when `prefers-reduced-motion: reduce`. Underline still appears on hover/focus.

### Per-Page Metadata & OG
- **`generateMetadata` source:** Pull `title` + `description` from frontmatter. Fallback chain: `description ?? tagline`. OG image precedence: `ogImage` → `hero.src` (only when not the placeholder pattern) → site default OG (`/og-default.png`, established in Phase 1 or stub for Phase 6 to upgrade).
- **OG image strategy in v1:** Static per-project images for projects with real artwork; site default OG when only the placeholder hero exists. `next/og` dynamic generation deferred to Phase 6 (DYN-01-equivalent).
- **Canonical URLs:** Set `metadata.metadataBase` once in root layout (or `(site)` layout if not already done in Phase 1 — verify during plan-phase). Per-page `alternates.canonical = /projects/${slug}`.
- **Twitter card:** `summary_large_image` reusing the OG image. `twitter:creator` omitted unless a handle is added to PROJECT.md.

### Routing & Static Generation (PRJ-01)
- Route file at `app/(site)/projects/[slug]/page.tsx`.
- `export const dynamicParams = false` — only known slugs render; unknown slugs 404.
- `generateStaticParams()` enumerates `getAll().map(p => ({ slug: p.slug }))`.
- Page calls `getProject(slug)` and `notFound()` on undefined (matches Phase 2 semantics).

### Claude's Discretion
- Exact spacing tokens within the hero (gap between title/tagline/tags), exact tag-chip size/padding — bounded by token system.
- Whether `Figure`, `Gallery`, `Callout` live as separate files under `components/mdx/` or co-located in a single `components/mdx/index.tsx` — pick whichever keeps `mdx-components.tsx` registration cleanest.
- Whether to add a `Prose` wrapper component or apply `max-w-prose` directly via the page template.
- Whether Shiki theme registration uses the package's bundled theme name or a JSON import — pick the path with smaller bundle impact.
- Adding `tests/projects/page.test.tsx` (RSC render) and `tests/mdx/components.test.tsx` smoke tests to lock the contract.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `lib/projects.ts`: `getAll()`, `getProject(slug)`, `getRelatedProjects(slug, limit)` — already typed and tested in Phase 2. Phase 3 consumes them directly; no new query functions needed.
- `lib/content.ts`: `allProjects` synchronous loader; types flow from `lib/schemas.ts`.
- `lib/schemas.ts`: `ProjectFrontmatterSchema` already enforces privacy at parse time (private → strips `links.repo`, adds `code-private` tag). Page template can trust the parsed object without re-checking.
- `mdx-components.tsx` exists at repo root from Phase 1; needs to be extended (not replaced) with the v1 component set.
- `components/motion/fade-in.tsx` + `motion-provider.tsx` — usable for subtle entrance motion if appropriate; reduced-motion already gated.
- `app/(site)/layout.tsx` — provides Nav + main + Footer + MotionProvider. Phase 3 pages plug into this group; nothing to replace.
- `styles/tokens.css` — all required tokens (`--color-bg`, `--color-surface-2`, `--color-hairline`, `--color-text-primary/secondary/tertiary`, `--color-accent`, `--motion-duration-base`, `--motion-ease-standard`) are already defined and Phase-1-locked.
- `lib/utils.ts` exports `cn()` helper.
- `next.config.ts` already wires `createMDX` with rehype/remark plugin slots — Phase 3 adds `rehype-pretty-code`, `rehype-slug`, `rehype-autolink-headings` to that chain.

### Established Patterns
- RSC-first; `'use client'` only in `components/motion/*` and `app/(site)/providers.tsx`.
- Strict TypeScript with `noUncheckedIndexedAccess` — every Zod-narrowed field is safe to access without optional chaining unless declared optional.
- Design tokens drive styling via Tailwind v4 `@theme`; raw colors and arbitrary durations are forbidden.
- Vitest tests live next to source (e.g., `tests/content/`, `tests/lib/`); Phase 3 follows the same pattern under `tests/projects/` and `tests/mdx/`.
- Content honesty: never fabricate metrics. The placeholder-hero text-only fallback is the visual instance of this principle.

### Integration Points
- **Consumed by Phase 4:** `/projects/[slug]` link targets from home hero grid + projects index.
- **Consumed by Phase 6:** `app/sitemap.ts` will enumerate `/projects/${slug}` URLs via `getAll()`.
- **Consumed by Phase 7:** New private-project MDX files (Trade Bot, Agenda Keeper, Aktiga) ride this exact template — the placeholder-hero fallback + private-tag rendering must already work.

</code_context>

<specifics>
## Specific Ideas

- Reference aesthetic remains [wallofportfolios.in](https://www.wallofportfolios.in/?company=All) — typographic rhythm over decorative layout. Project pages should feel like a magazine spread, not a SaaS landing page.
- Anti-features (per `.planning/research/FEATURES.md`): no skill bars, no gradient-on-gradient, no glassmorphism cards, no stagger-on-scroll, no Lottie, no R3F.
- Myco MDX (`content/projects/myco.mdx`) is the canonical fixture — 902 words, Problem → Approach → Outcome H2 anchors. Phase 3's template renders it without modification; if the template needs the MDX changed, the template is wrong.
- The `code private` label is more than a tag — it's the visible promise that the schema's privacy enforcement is shipping.

</specifics>

<deferred>
## Deferred Ideas

- Per-project accent color token (Phase 1 deferred to v2 — CNT2-02).
- Reading-time estimate on project pages (defer; can compute from MDX body if desired post-launch).
- Print CSS for project pages (only `/resume` needs print CSS in v1 — Phase 5).
- Dynamic `next/og` image generation (Phase 6 or v2 — DYN-01).
- Comments / reactions / share buttons (out of scope for v1 per PROJECT.md).
- Related-projects 3-up grid (only top-1 in v1; revisit if user feedback after launch).
- View Transitions API for project ↔ project navigation (v2 — VTX-01).
- Author-time MDX linting beyond what Phase 6 a11y audit covers.

</deferred>
