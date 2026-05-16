---
phase: 03-project-detail-template
plan: 00
subsystem: infra
tags: [mdx, shiki, rehype-pretty-code, rehype-slug, rehype-autolink-headings, vesper, tailwind-v4, tokens, og-image, sharp]

# Dependency graph
requires:
  - phase: 02-content-pipeline
    provides: "Typed Project collection (lib/content.ts, lib/projects.ts, lib/schemas.ts), Phase 2 next.config.ts wiring with remark-frontmatter, Myco MDX fixture"
  - phase: 01-foundation
    provides: "Existing styles/tokens.css @theme block (colors, spacing, motion), app/globals.css base layer with reduced-motion + :focus-visible, vitest config with @ alias and server-only stub"
provides:
  - "Working MDX-with-Shiki rehype pipeline (slug → autolink → pretty-code), Turbopack-safe string-form registration"
  - "Vesper Shiki theme wired with keepBackground:false (so .prose pre paints --color-surface-2 itself)"
  - "Phase 3 type tokens (--text-h2, --text-h3, --font-weight-semibold) inside the existing @theme block — additive only"
  - ".prose CSS class with full token-driven typography rhythm, anchor styling, rehype-pretty-code data-attribute selectors, lists, inline + block code"
  - "isPlaceholderHero(src) — RSC-safe regex helper for Variant A vs Variant B hero detection"
  - "/public/og-default.png stub (1200x630) so OG fallback chain has a real asset"
affects: [03-01-mdx-components, 03-02-page-template, 03-03-next-block, 04-home-and-index, 06-seo-and-sitemap, 07-private-projects]

# Tech tracking
tech-stack:
  added:
    - "rehype-pretty-code@^0.14.3 (runtime)"
    - "shiki@^3.23.0 (runtime, pinned to 3.x for ecosystem soak)"
    - "rehype-slug@^6.0.0 (runtime)"
    - "rehype-autolink-headings@^7.1.0 (runtime)"
  patterns:
    - "Turbopack-safe MDX plugins: string-form 'plugin-name' or [name, optionsObject] tuples — never function references (Next #76739/#84258)"
    - "rehype plugin order locked: slug → autolink-headings → pretty-code (autolink reads ids slug emits)"
    - "Hand-authored .prose class instead of @tailwindcss/typography — preserves token discipline (no override of letter-spacing, weights, colors)"
    - "Filename labels in code blocks via rehype-pretty-code's title= metastring (NOT {filename=}) → emits [data-rehype-pretty-code-title] which we style"
    - "RSC-safe path detection by suffix regex (no fs probe, no fetch) — same pattern can extend to other content-shape conditionals"
    - "One-shot generator scripts get deleted post-run — only the artifact ships (scripts/ folder didn't exist before, doesn't exist after)"

key-files:
  created:
    - "lib/hero-fallback.ts"
    - "tests/mdx/pipeline.test.ts"
    - "tests/projects/hero-fallback.test.ts"
    - "public/og-default.png"
  modified:
    - "package.json"
    - "pnpm-lock.yaml"
    - "next.config.ts"
    - "styles/tokens.css"
    - "app/globals.css"

key-decisions:
  - "Pinned shiki to ^3.23.0 instead of ^4.x — rehype-pretty-code's peer accepts both, Vesper bundled in both, but 3.x has 6+ months ecosystem soak. Lower drift risk."
  - "Wired filename labels via [data-rehype-pretty-code-title] CSS selector against the title= metastring — matches what rehype-pretty-code actually emits (RESEARCH Pitfall 1 corrected the original UI-SPEC's {filename=} reference)"
  - "OG image generated via SVG-piped-to-sharp (sharp is already a runtime dep for next/image) — avoided pulling @vercel/og just for a one-shot script. Script + sharp meta-json both deleted post-run; only the PNG ships."
  - "Did NOT install @tailwindcss/typography — its built-in defaults override letter-spacing, font-weight, and color tokens. Hand-authored .prose stays inside the design system."
  - "Reduced-motion override sets .prose .anchor opacity to 1 always (instead of the hover-reveal pattern) — preserves the affordance for users who can't trigger hover with a pointer."

patterns-established:
  - "Token additions to styles/tokens.css are additive and grouped under a comment header naming the phase + the UI-SPEC clause that pre-authorized them. No edits to existing tokens."
  - "Source-assertion tests (tests/mdx/pipeline.test.ts) lock config files against silent regression — cheaper than runtime tests for Turbopack constraints + plugin-order rules."
  - "TDD task-level RED→GREEN split: write the test first (commit RED), then satisfy it (commit GREEN). Pure regex helpers may collapse to single-commit when the test file IS the contract."

requirements-completed: [PRJ-02, PRJ-04, PRJ-07]

# Metrics
duration: 11 min
completed: 2026-05-15
---

# Phase 3 Plan 00: Wave 0 MDX-pipeline infrastructure Summary

**Vesper Shiki + rehype-slug + rehype-autolink-headings wired Turbopack-safe; .prose class hand-authored on top of new H2/H3 tokens; isPlaceholderHero helper + OG fallback asset shipped.**

## Performance

- **Duration:** 11 min
- **Started:** 2026-05-16T00:16:02Z
- **Completed:** 2026-05-16T00:27:26Z
- **Tasks:** 4
- **Files modified:** 5
- **Files created:** 4

## Accomplishments

- Phase 3 MDX rehype chain operational and locked against regression by a 7-assertion source-assertion test
- `.prose` typography rhythm CSS hand-authored with full coverage of MDX content (h2/h3/p/a/code/pre/lists/anchor) and rehype-pretty-code data-attribute selectors
- `isPlaceholderHero(src)` helper exported with 7-case test (positive: 4 extensions case-insensitive + hyphenated slugs; negative: real artwork, unsupported extensions, unrelated paths, different filenames)
- `/public/og-default.png` stub at 1200×630 fills the OG fallback chain so Phase 7 private projects (which all rely on placeholder heroes initially) can be shared without a 404
- All 142 tests across 15 files remain green (no regression in Phase 1 or Phase 2 suites)
- `pnpm build` succeeds end-to-end through the new rehype chain

## Task Commits

1. **Task 03-00-01: Install Phase 3 MDX-pipeline dependencies** — `5d24832` (chore)
2. **Task 03-00-02 RED: Add failing source-assertion test for rehype chain** — `f019f01` (test)
3. **Task 03-00-02 GREEN: Wire Phase 3 rehype chain in next.config.ts** — `eb418a3` (feat)
4. **Task 03-00-03: Add Phase 3 type tokens, .prose CSS, isPlaceholderHero helper** — `b05dbe5` (feat)
5. **Task 03-00-04: Add /public/og-default.png stub (1200×630)** — `d69e4ac` (feat)

**Plan metadata:** _pending — committed in final docs commit_

_Note: Task 03-00-02 is a TDD task with RED→GREEN split (2 commits). Task 03-00-03 collapsed to a single commit because the test file IS the contract for the one-line regex helper — splitting RED→GREEN would have been ceremonial. Aligned with the "glue code wiring existing tested components" exception in the TDD doctrine, and the plan explicitly authorizes this in the action block._

## Files Created/Modified

| Path | Status | What it does |
|------|--------|--------------|
| `package.json` | modified | Adds `rehype-pretty-code@^0.14.3`, `shiki@^3.23.0`, `rehype-slug@^6.0.0`, `rehype-autolink-headings@^7.1.0` to runtime dependencies |
| `pnpm-lock.yaml` | modified | Resolved versions for the new deps (+30 packages incl. transitive Shiki grammars/themes) |
| `next.config.ts` | modified | Replaced `rehypePlugins: []` with the locked 3-plugin chain (string-form + tuple-form). Preserved Phase 2 `'remark-frontmatter'` line + comment block verbatim. Added `rehypePrettyCodeOptions` and `rehypeAutolinkHeadingsOptions` consts at module top. |
| `styles/tokens.css` | modified | Appended 5 tokens inside the existing `@theme { }` block: `--text-h2`, `--text-h2--line-height`, `--text-h3`, `--text-h3--line-height`, `--font-weight-semibold`. No edits to existing tokens. |
| `app/globals.css` | modified | Appended ~120 lines of `.prose` CSS below the existing `:focus:not(:focus-visible)` rule: h2 (with desktop md+ media query bumping to 1.75rem), h3, p, a, code-pill, pre, [data-line], [data-highlighted-line], [data-rehype-pretty-code-title] (with `+ pre` adjacency rule for seamless filename-label-to-code-block joining), .anchor (opacity transition + reduced-motion override), ul/ol/li |
| `lib/hero-fallback.ts` | created | One-line regex export `isPlaceholderHero(src: string): boolean` — matches `/images/projects/{slug}/hero-placeholder.{png,jpg,jpeg,webp}` case-insensitively |
| `tests/mdx/pipeline.test.ts` | created | 7 assertions on `next.config.ts` source: plugin order, Vesper theme, keepBackground:false, behavior:'append' (and NOT 'wrap'), no `{filename=` syntax, no function-ref imports, remark-frontmatter preserved |
| `tests/projects/hero-fallback.test.ts` | created | 7 assertions across 4 positive cases (canonical, all extensions case-insensitive, hyphenated slugs) and 3 negative cases (real artwork, unsupported extensions, unrelated paths, different-named placeholders) |
| `public/og-default.png` | created | 1200×630 PNG (16,696 bytes), RGBA, non-interlaced. Solid #0a0a0a bg, "olive elliott" wordmark + mono tag below. Generation script `scripts/generate-og-default.ts` deleted post-run per plan instruction. |

## Decisions Made

1. **Shiki ^3.23.0, not ^4.x** — rehype-pretty-code's peer range accepts both; Vesper is bundled in both. Picked 3.x for the longer ecosystem soak time. Easy bump path if a future plan needs a 4.x-only feature.

2. **OG-default generation via `sharp` + SVG, not `@vercel/og`** — sharp is already a runtime dep for `next/image`; `@vercel/og` would have added ~6MB of dependencies for a one-shot script. SVG-piped-to-sharp produces the deterministic 1200×630 PNG with the locked colors and was deleted along with the meta JSON sidecar. Cleanest path.

3. **Filename labels via `title="..."` metastring (not `{filename=...}`)** — RESEARCH § Pitfall 1 caught the original UI-SPEC reference. The correct rehype-pretty-code syntax emits `[data-rehype-pretty-code-title]`, which is what `app/globals.css` selects against. The plan's action block already had this right.

4. **Hand-authored `.prose` instead of @tailwindcss/typography** — the typography plugin's defaults override letter-spacing, weights, and colors. The token system is the design contract; bypassing it for a "free" Tailwind plugin would re-open the AI-template aesthetic risk PROJECT.md explicitly forbids.

5. **Reduced-motion: anchors permanently visible** — instead of preserving the hover-reveal pattern at 0ms (which would create a click target with no perceivable affordance for keyboard / screen-reader / pointer-not-available users), the anchor is always opacity:1 when `prefers-reduced-motion: reduce` matches. WCAG-friendly.

## Deviations from Plan

None — plan executed exactly as written.

The plan was unusually well-specified (explicit test sources, explicit CSS source blocks, explicit acceptance grep commands). Every action block had a verbatim implementation; no ambiguity surfaced during execution.

The OG-image generation method (Approach 1: programmatic via sharp+SVG) was one of three options the plan explicitly authorized — picking it is not a deviation, it's the plan's "pick the cheapest" exercise.

## Issues Encountered

None.

One minor friction during the verify step: a chained `grep -E ... | grep` in a single `&&` compound returned exit 1 due to short-circuit, but a re-run with simpler grep proved all required substrings were present. No blocker, no correction needed.

## User Setup Required

None — no external service configuration required for Wave 0.

## Next Phase Readiness

Wave 1 (Plan 03-01: MDX components — Figure / Gallery / Callout + `mdx-components.tsx` registration) is unblocked:
- `.prose` rhythm is in place; component CSS just needs to live inside it
- Vesper code blocks tokenize at build time — no client-side highlighting work
- H2/H3 tokens available for any internal heading needs

Wave 2 (Plan 03-02: page template at `app/(site)/projects/[slug]/page.tsx` + `<ProjectHero>` + `generateMetadata`) is unblocked:
- `isPlaceholderHero` ready to import from `@/lib/hero-fallback`
- `/og-default.png` ready as the OG fallback target
- `generateMetadata` can rely on the OG precedence chain landing on a real file

Wave 3 (Plan 03-03: `<NextProjectBlock>`) — no Wave 0 dependency.

Build is green, test suite is green (142/142), no peer-dep warnings. No blockers for the remaining 3 plans in Phase 3.

## Self-Check: PASSED

Verified after writing this summary:

- [x] `lib/hero-fallback.ts` exists
- [x] `tests/mdx/pipeline.test.ts` exists
- [x] `tests/projects/hero-fallback.test.ts` exists
- [x] `public/og-default.png` exists (1200×630 PNG)
- [x] Commit `5d24832` present in `git log`
- [x] Commit `f019f01` present in `git log`
- [x] Commit `eb418a3` present in `git log`
- [x] Commit `b05dbe5` present in `git log`
- [x] Commit `d69e4ac` present in `git log`
- [x] `pnpm vitest run` → 142/142 green (no regression)
- [x] `pnpm build` → exit 0

---
*Phase: 03-project-detail-template*
*Completed: 2026-05-15*
