# Phase 2: Content Pipeline - Context

**Gathered:** 2026-04-21
**Status:** Ready for planning

<domain>
## Phase Boundary

A typed content system where project case studies are MDX files under `content/projects/`, with a Zod-validated frontmatter schema, auto-enforced privacy rules at the schema layer, a derived tag index, and query helpers consumable by downstream RSC pages. One real hero-project MDX (Myco, drafted from the existing README) lands in this phase as the canonical fixture proving the pipeline. Not in scope: the project detail page template, routing, rendering, or authoring MDX for non-Myco projects.

</domain>

<decisions>
## Implementation Decisions

### Content Pipeline Tooling
- **Package choice:** Roll-your-own MDX pipeline using `@next/mdx` (already installed in Phase 1), `gray-matter` for YAML frontmatter parsing, and `zod` (already installed) for schema validation. **Do not** install Content Collections — the extra dependency is unnecessary at portfolio scale and the Phase 1 lockfile already standardised on `@next/mdx`.
- **Content location:** `content/projects/*.mdx` at repo root — matches `.planning/research/ARCHITECTURE.md`; keeps content decoupled from App Router.
- **Frontmatter format:** YAML frontmatter parsed with `gray-matter`.
- **Collection loading:** Synchronous load in `lib/content.ts` at import time (reads and parses at module init); exposed as a typed `allProjects` const. No pre-build script, no generated manifest file — RSC build inlines the collection.

### Project Frontmatter Schema
- **Tag field:** Strict Zod enum sourced from a single `TAGS` const in `lib/tags.ts`. Typos fail the Zod parse, which fails the build.
- **Tier field:** `tier: 'hero' | 'secondary'` enum — more explicit than a boolean and extensible.
- **Visibility field:** `visibility: 'public' | 'private'` enum.
- **Outcomes field:** `z.array(z.string()).max(5)` — single-line bullets surfaced on project cards. Structured `{metric, context}` objects are out of scope until v2.
- **Complete field set** (for reference, details settled during plan-phase): `slug`, `title`, `tagline`, `year`, `tier`, `order`, `status`, `visibility`, `tags`, `stack`, `links` (repo/live/docs/npm, optional), `hero` ({src, alt}), `gallery` (optional), `outcomes`, `description` (SEO), `ogImage` (optional).

### Privacy Enforcement
- **Repo-link stripping:** Schema `transform` silently strips `links.repo` for `visibility: 'private'`. In `process.env.NODE_ENV === 'development'`, emit a `console.warn` so the author notices the intent mismatch. No Zod refinement hard-fail — private projects with a repo link should still ship safely.
- **`code-private` tag:** Auto-added by the schema transform when `visibility === 'private'`. Author does not add it in frontmatter. If the author does add it redundantly, the transform deduplicates.
- **Redaction review (CNT-06):** Two-pronged approach:
  1. A checklist document at `.planning/phases/02-content-pipeline/02-REDACTION-REVIEW.md` with banned-term list (`aktiga`, `voya`, `spectra`, internal client names discovered during audit), privacy-sensitive-topic list, and a sign-off template.
  2. A unit test (`tests/content/redaction.test.ts`) that walks every `visibility: 'private'` MDX body and fails if any banned term appears (case-insensitive, whole-word match).
- **Private project set in v1 Phase 2:** Only Myco is scaffolded in this phase (Myco is public, so the redaction test exercises the private-project fixture below). Other private projects (Trade Bot, Agenda Keeper, Aktiga) land in Phase 7's content pass.

### Myco MDX Authoring Scope
- **Depth:** Full draft from the existing Myco README, ~800–1200 words. Content honesty required — no fabricated outcomes, metrics, or claims.
- **Narrative structure:** Problem → Approach → Outcome with explicit H2 headings, matching the PRJ-03 shape so Phase 3's template can render it unmodified.
- **Tags:** `local-first`, `autonomous`, `open-source`, `ai`, `agents`, `typescript` — reflects Myco's thesis alignment.
- **Outcomes bullets:** Honest descriptive bullets only (e.g. "Apache 2.0 public release", "SQLite + Ollama local stack", "Knowledge graph with approval-gated writes"). No invented numbers or metrics.
- **Frontmatter values for Myco:** `tier: 'hero'`, `visibility: 'public'`, `status: 'active'`, `year: 2025`, `order: 10`, tagline from README, `links.repo` populated, `links.docs` if a docs site exists.

### Tag Index & Query API (`lib/projects.ts`)
- Pure functions, RSC-safe: `getAll()`, `getHeroProjects()`, `getProject(slug)`, `getAllTags()`, `getProjectsByTag(tag)`, `getRelatedProjects(slug, limit)`.
- `getAll()` filters out `status: 'archived'`, sorts by `order` ascending.
- `getRelatedProjects` scores by overlapping-tag count.

### Claude's Discretion
- Exact Zod schema file location (`lib/schemas.ts` vs inline in `lib/content.ts`) — follow architecture research unless a smaller single-file footprint is clearly cleaner.
- Exact `TAGS` const contents (start with `local-first`, `autonomous`, `open-source`, `ai`, `agents`, `distributed`, `typescript`, `python`, `saas`, `cli`, `code-private`; extend only if Myco's authored tags or roadmap references a missing tag).
- MDX compilation entry point — use `@next/mdx` per-page consumption rather than a custom compiler unless the RSC boundary requires a separate compile step.
- Test harness for redaction — vitest file pattern consistent with existing `tests/` layout.
- Hero image behavior for Myco when no real hero image exists yet — acceptable to reference a placeholder path that Phase 3 or 7 replaces; do not fabricate a screenshot.
- Whether to add a private-project test fixture MDX under `tests/fixtures/` to exercise `code-private` auto-tagging and repo-link stripping without polluting `content/projects/`.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `@next/mdx` 16.2, `@mdx-js/react` 3, `zod` 3.23 already installed (package.json verified).
- `lib/utils.ts` exports `cn()` (twMerge + clsx).
- `app/(site)/layout.tsx` is the RSC shell that Phase 3 pages will plug into.
- `next.config.ts` already wires `createMDX` with `pageExtensions` including `.mdx` (per Phase 1 verification).

### Established Patterns
- RSC-first with client islands (only `components/motion/*` and `providers.tsx` are `'use client'`).
- Strict TypeScript with `noUncheckedIndexedAccess` — Zod schemas must produce narrow types.
- Design tokens live in `styles/tokens.css` via Tailwind v4 `@theme`. Schema/content code does not touch styling.
- Vitest test harness with `jsdom`, `@/*` path alias.

### Integration Points
- **Consumed by Phase 3:** `lib/projects.ts` query API will be imported by `app/(site)/projects/[slug]/page.tsx` for `generateStaticParams` and per-project data.
- **Consumed by Phase 4:** `getHeroProjects()`, `getAllTags()`, `getProjectsByTag()` drive the home grid and projects index.
- **Consumed by Phase 6:** `getAll()` powers `app/sitemap.ts` URL generation.

</code_context>

<specifics>
## Specific Ideas

- Schema transform is the enforcement point for privacy — "impossible to ship a private-project repo link" is the bar (per ARCHITECTURE.md anti-pattern 7).
- Tag enum is the typo-gate (anti-pattern 5); maintained in one place.
- Myco README is the canonical starting content; draft should preserve the README's voice but shape it into Problem/Approach/Outcome for Phase 3's template.
- Per PROJECT.md: "placeholders are explicitly placeholders — never fabricate outcomes, metrics, or claims." Apply to Myco outcomes and to any hero-image placeholder.

</specifics>

<deferred>
## Deferred Ideas

- Per-project accent color token (v2 — CNT2-02).
- Structured outcomes (`{metric, context}`) for richer card surfacing (v2).
- Custom illustrations per hero project (v2 — CNT2-01).
- Other project MDX files (Fathom, Agenda Keeper, Trade Bot, Stemz, Aktiga) — Phase 7 content pass.
- `content/resume.ts` — Phase 5 scope, not Phase 2.
- Pagefind / FlexSearch full-text search — deferred beyond v1.
- Dynamic OG image generation (`next/og`) — Phase 6 or v2 (DYN-01).
- A content-lint script (MDX linting, missing-alt checks) — fold into Phase 6 a11y audit if needed.

</deferred>
