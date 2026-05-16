---
phase: 03-project-detail-template
plan: 02
subsystem: ui
tags: [rsc, project-hero, project-meta, tag-chip-row, privacy, prj-04, prj-06, hero-variants, tailwind-v4, tokens]

# Dependency graph
requires:
  - phase: 03-project-detail-template
    provides: "Wave 0 — isPlaceholderHero(src) RSC-safe regex helper, design tokens (--color-accent, --color-accent-hover, --color-surface-2, --color-text-primary/secondary/tertiary, --text-display, --text-body, --text-label, --radius-sm), .prose CSS scope with global focus-visible coverage"
  - phase: 02-content-pipeline
    provides: "Project type from lib/schemas.ts via lib/projects.ts (visibility field + post-transform tag list with code-private auto-add), Tag union type from lib/tags.ts"
  - phase: 01-foundation
    provides: "Vitest @jsdom + @testing-library/react setup, @ alias, lib/utils.ts cn() helper"
provides:
  - "<TagChipRow> RSC — mono lowercase chips linking to /projects?tag={tag}, returns React fragment so meta-row flex layout treats chips as direct children"
  - "<ProjectMeta> RSC — year (<time>) + TagChipRow + repo-or-private label, single accessible row with role=list aria-label='Project metadata'; privacy gating on visibility (PRJ-06 contract)"
  - "<ProjectHero> RSC — Variant A (image-present, md:grid md:grid-cols-12) vs Variant B (text-only, no <img>) branching via isPlaceholderHero(hero.src); composes ProjectMeta inside text col"
  - "Three RTL test suites locking the visible behavior: 6 + 7 + 8 = 21 cases"
  - "Zero new dependencies, zero 'use client' directives, zero client JS contributed from any of the three components"
affects: [03-03-page-template-and-next-block, 04-home-and-index, 07-private-projects]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "RSC-only project components under components/projects/ — separate file per component with named exports, mirroring components/mdx/ + components/site/ conventions"
    - "Tailwind v4 arbitrary-class form for tokens (e.g. bg-[color:var(--color-surface-2)], text-[var(--text-display)]) — same pattern Wave 1 locked, preserves token discipline + grep-ability"
    - "Visibility-gated privacy branch (NOT repoUrl-presence-gated) — defends against stale repoUrl props that bypass the schema's strip transform; intent is explicit, not inferred"
    - "TagChipRow returns React fragment (not wrapping div) so the parent meta row's flex layout treats chips as direct children, keeping gap-3 rhythm consistent across all metadata-row elements"
    - "TDD RED→GREEN split as 2 commits per task — failing test commits first, implementation commits second; both visible in git log for any future reader"

key-files:
  created:
    - "components/projects/tag-chip-row.tsx"
    - "components/projects/project-meta.tsx"
    - "components/projects/project-hero.tsx"
    - "tests/projects/tag-chip-row.test.tsx"
    - "tests/projects/project-meta.test.tsx"
    - "tests/projects/project-hero.test.tsx"
  modified: []

key-decisions:
  - "Privacy gate on visibility === 'private', NOT on repoUrl === undefined — schema strips the repo before consumers see it, but a stale repoUrl prop could still sneak through; visibility is the authoritative intent field. Test 6 in project-meta.test.tsx is the regression lock for this."
  - "ProjectMeta nested-ternary structure (isPrivate ? span : repoUrl ? a : null) keeps the privacy short-circuit visible and unambiguous — the public branch is gated behind a repoUrl truthy check so a public project with no repo (rare but allowed by schema) renders nothing rather than a broken anchor."
  - "Tag chip text uses the Tag value verbatim (lowercase, no remap), NOT TAG_LABELS — UI-SPEC § Component Inventory #3 explicitly says chips render the Tag value, while TAG_LABELS is reserved for Phase 4 filter chips that need human-facing capitalization."
  - "ProjectHero text-only branch (Variant B) renders the SAME className stack as the image branch's text column — no upsizing, no special treatment per UI-SPEC § Hero Variants Variant B rationale. Hero title rendered at the same display scale regardless."
  - "WIDE_BLEED-style mx-[calc(...)] not used in any of these three components — none escape the page container; ProjectHero uses the full page-shell width via grid only at md+. Bleed is reserved for MDX figures/galleries/callouts (Wave 1)."

patterns-established:
  - "Privacy rendering contract has two independent visible signals when private: (1) the literal 'code private' label in the meta row (in --color-text-tertiary, non-interactive), and (2) the 'code-private' tag chip rendered identically to other chips in TagChipRow. Both must be present; one is the canonical label, the other is the auto-tag flowing through the standard chip pipeline."
  - "Hero variant detection lives entirely client-of-helper-side (in ProjectHero) — isPlaceholderHero is a pure regex function; the component imports it and branches at render time. No fs probe, no fetch, no missing-file network round-trip. RSC-safe by construction."
  - "Test 6 (defensive privacy assertion) pattern: render with both visibility='private' AND a stale repoUrl prop, assert no anchor with that URL appears anywhere. This locks the contract against future refactors that might 'optimize' the visibility check away."

requirements-completed: [PRJ-04, PRJ-06]

# Metrics
duration: 4 min
completed: 2026-05-15
---

# Phase 3 Plan 02: ProjectHero + ProjectMeta + TagChipRow Summary

**Three RSC components shipped under components/projects/; privacy rendering contract (PRJ-06) enforced via visibility-gated branch in ProjectMeta with defensive coverage against stale repoUrl props; hero variant branching (PRJ-04) operational on Myco's actual placeholder path AND speculative real-artwork path.**

## Performance

- **Duration:** ~4 min
- **Started:** 2026-05-16T00:39:14Z
- **Completed:** 2026-05-16T00:43:08Z
- **Tasks:** 3
- **Files created:** 6
- **Files modified:** 0

## Accomplishments

- Three RSC components (`TagChipRow`, `ProjectMeta`, `ProjectHero`) shipped under `components/projects/` — zero `'use client'` directives, zero client JS contributed
- Three RTL test suites lock the visible behavior: 6 (TagChipRow) + 7 (ProjectMeta) + 8 (ProjectHero) = **21 new cases green**
- **PRJ-04 satisfied at component level:** hero variant branching works on Myco's actual placeholder path (text-only Variant B) AND on the speculative real-artwork path (image-present Variant A with `next/image` + `sizes="(min-width: 768px) 50vw, 100vw"` + `priority`)
- **PRJ-06 satisfied at component level:** privacy rendering contract enforced via `visibility === 'private'` gate in ProjectMeta; defensive against stale `repoUrl` props (Test 6 in project-meta.test.tsx is the regression lock)
- All 28 tests in `tests/projects/` green (7 hero-fallback + 21 new), all 183 tests across 21 files remain green (no regression in Phase 1, Phase 2, or earlier Phase 3 waves)
- `pnpm typecheck` clean
- `pnpm build` succeeds end-to-end

## Task Commits

Each task was committed atomically with a TDD RED → GREEN split:

1. **Task 03-02-01 RED: failing TagChipRow RTL suite** — `790d5dc` (test)
2. **Task 03-02-01 GREEN: implement TagChipRow RSC** — `eb285b6` (feat)
3. **Task 03-02-02 RED: failing ProjectMeta privacy-rendering RTL suite** — `bcdcb2e` (test)
4. **Task 03-02-02 GREEN: implement ProjectMeta RSC with privacy gating** — `7cc229e` (feat)
5. **Task 03-02-03 RED: failing ProjectHero variant-branching RTL suite** — `8fc5e06` (test)
6. **Task 03-02-03 GREEN: implement ProjectHero with image-vs-text variant branching** — `f194751` (feat)

**Plan metadata:** _pending — committed in final docs commit_

## Files Created/Modified

| Path | Status | What it does |
|------|--------|--------------|
| `components/projects/tag-chip-row.tsx` | created | `TagChipRow` RSC. Returns `<>{tags.map(tag => <a>...</a>)}</>` — fragment so meta-row flex layout treats chips as direct children. Each chip: `inline-flex px-3 py-2 -my-2 bg-[color:var(--color-surface-2)] rounded-sm font-mono lowercase text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]`. Hit-area math: `py-2` (8px) visual + `-my-2` margin collapse keeps the 36px visual chip inside a 44px hit box. `code-private` chip is byte-identical to other chips. |
| `components/projects/project-meta.tsx` | created | `ProjectMeta` RSC. `<div role="list" aria-label="Project metadata" className="flex flex-wrap items-center gap-3">`. Composition order: `<time dateTime={String(year)}>` → `<TagChipRow>` → `(isPrivate ? <span>code private</span> : repoUrl ? <a>repo ↗</a> : null)`. Privacy gate is on `visibility === 'private'`, not on `repoUrl === undefined`. Public repo link uses `--color-accent`, hovers to `--color-accent-hover`, opens `target="_blank" rel="noopener noreferrer"`. The `↗` glyph is `aria-hidden="true"`. Private label uses `--color-text-tertiary`, no glyph. |
| `components/projects/project-hero.tsx` | created | `ProjectHero` RSC. Branches on `isPlaceholderHero(hero.src)` from Wave 0. Variant B (text-only): single column, no `<img>`, just title + tagline + ProjectMeta. Variant A (image-present): `<header md:grid md:grid-cols-12 md:gap-8>`, text col `md:col-span-7`, image col `md:col-span-5` with `<Image>` from `next/image` (width 1200, height 900, `sizes="(min-width: 768px) 50vw, 100vw"`, `priority`, `rounded-none`). Both branches share the same `<h1>` display class stack. |
| `tests/projects/tag-chip-row.test.tsx` | created | 6 RTL cases: one `<a>` per tag, href verbatim, locked className stack, `code-private` chip parity, empty defensive (no anchors), fragment return (no wrapping div). |
| `tests/projects/project-meta.test.tsx` | created | 7 RTL cases (PRJ-06 load-bearing): public renders `repo ↗` link with `aria-hidden` glyph + correct rel + `target="_blank"`, private renders literal `code private` non-interactive `<span>`, private label class includes `--color-text-tertiary`, year inside `<time dateTime>`, wrapper has `role="list" aria-label="Project metadata"` + flex layout, **defensive: stale `repoUrl` + `visibility="private"` still suppresses anchor**, composition order (time → chips → repo/private label). |
| `tests/projects/project-hero.test.tsx` | created | 8 RTL cases: Variant A `<img>` with locked `sizes` attribute, Variant A `md:grid md:grid-cols-12`, Variant B (placeholder) renders zero `<img>`, Variant B `<h1>` at display ramp, Variant B tagline `<p>` with text-secondary class, hero composes ProjectMeta (role=list query), exactly one `<h1>` per page, hero root is semantic `<header>`. |

## Decisions Made

1. **Privacy gate on `visibility`, not on `repoUrl` absence.** The schema strips `links.repo` for private projects, so for any value flowing from `lib/projects.ts` the two conditions are equivalent. But `ProjectMeta` is a leaf component that may eventually receive props from non-schema sources (mocks, Storybook, Phase 4 search-result rendering, etc.). Gating on `visibility` makes the intent explicit, defends against stale `repoUrl` props, and keeps the test contract independent of upstream schema invariants. Test 6 in `project-meta.test.tsx` is the regression lock — it intentionally passes both `visibility="private"` AND a stale `repoUrl` and asserts no anchor with that URL renders.

2. **Tag chip text uses `Tag` value verbatim (lowercase), NOT `TAG_LABELS`.** UI-SPEC § Component Inventory #3 explicitly specifies `{tag}` as the chip text — lowercase, no remap. `TAG_LABELS` (the human-facing capitalization map) is reserved for Phase 4 filter chips that need different visual register. Locking this in tests prevents a future "let's use the labels" patch from drifting the hero meta row away from the editorial mono lowercase aesthetic.

3. **ProjectMeta uses a nested-ternary structure (`isPrivate ? span : repoUrl ? a : null`).** Reads top-down: privacy first (the load-bearing branch), then public-with-repo, then null. The `null` fallback covers "public project with no repo URL" — schema-allowed, rare in practice. Avoids an `else` branch that would render an empty interactive shell.

4. **Hero text col width `md:col-span-7` + image col `md:col-span-5`.** Lifted directly from UI-SPEC § Page Composition → Width discipline ("text gets slightly more weight than image at lg+, magazine convention"). Variant B (text-only) uses no grid at all — single column, no image col placeholder. The page does NOT compensate for the missing image with bigger type or extra spacing.

5. **TagChipRow returns React fragment, not a wrapping `<div>`.** This makes the chips direct children of `ProjectMeta`'s flex container, so `gap-3` applies between year ↔ chip-1 ↔ chip-2 ↔ ... ↔ repo-link uniformly. A wrapping div would have created a nested flex item that disrupts the row rhythm. Test 6 in `tag-chip-row.test.tsx` is the regression lock for this.

## Deviations from Plan

None — plan executed exactly as written.

The plan was fully specified: every test source was verbatim, every component source was verbatim, every acceptance criterion mapped to a test assertion. No deviation rules triggered. No CLAUDE.md adjustments needed (the plan's directives + UI-SPEC + token system were already CLAUDE.md-aligned).

The `key_links` frontmatter listed three connection paths (hero → hero-fallback, meta → tag-chip-row, meta → project.visibility); all three are present in the shipped code with the exact pattern strings specified.

## Issues Encountered

None.

The TDD RED step for each task confirmed the failing path was a missing-file import error (vite resolution failure) before each component existed. The GREEN step then resolved the import and exercised the actual assertions. No assertion needed reconciliation against a Tailwind v4 arbitrary-class emission quirk — the className strings emit verbatim from the source.

## Privacy Rendering Contract — Verification Clauses Auto-Asserted

Per the plan output spec, all three UI-SPEC § Privacy Rendering Contract verification clauses are auto-asserted by the project-meta test suite:

1. **No anchor element with the project's repo URL anywhere on the page when private** — `project-meta.test.tsx` Test 2 (private project) AND Test 6 (defensive: even with stale repoUrl prop) both assert this via `Array.from(container.querySelectorAll('a')).find(...)` checks.
2. **The literal string `code private` appears exactly once in the hero metadata row** — `project-meta.test.tsx` Test 2 asserts `labels.length === 1` for spans containing `'code private'`.
3. **The `code-private` chip in the tag chip row also renders as a chip** — `tag-chip-row.test.tsx` Test 4 asserts the `code-private` chip's className is byte-identical to other chips (i.e., it renders normally), and Test 2 asserts the href is `/projects?tag=code-private`.

The two visible privacy signals are independent: the canonical `code private` label (in --color-text-tertiary, non-interactive) AND the `code-private` chip flowing through the standard `TagChipRow` pipeline. Both are present when `visibility === 'private'`.

## User Setup Required

None — no external service configuration required for Wave 2 lane A.

## Next Phase Readiness

Wave 2 lane B (Plan 03-03: page route at `app/(site)/projects/[slug]/page.tsx` + `<NextProjectBlock>` + `generateMetadata`) is unblocked:

- `<ProjectHero>` ready to import from `@/components/projects/project-hero` and pass `project.title` / `project.tagline` / `project.year` / `project.tags` / `project.visibility` / `project.links.repo` / `project.hero` directly — no further glue, no per-page conditional logic for variant detection (the component handles it).
- `<MDXProse>` (Wave 1) wraps the dynamically-imported MDX body for the prose scope.
- `useMDXComponents` (Wave 1) registers Figure/Gallery/Callout for `@next/mdx` — DO NOT pass a `components` prop to the MDX body.
- `isPlaceholderHero` (Wave 0) feeds the OG image precedence chain in `generateMetadata` (skip `hero.src` if it's a placeholder; fall back to `/og-default.png`).

Wave 2 lane B is fully independent on disk from this plan (different files, both depend only on Waves 0 + 1 + Phase 2 query helpers). Both lanes could have run in parallel; this plan ran first and clears the import path for the page composition.

`pnpm build` succeeds, `pnpm typecheck` clean, 183/183 tests green. No blockers for Plan 03-03.

## Self-Check: PASSED

Verified after writing this summary:

- [x] `components/projects/tag-chip-row.tsx` exists
- [x] `components/projects/project-meta.tsx` exists
- [x] `components/projects/project-hero.tsx` exists
- [x] `tests/projects/tag-chip-row.test.tsx` exists
- [x] `tests/projects/project-meta.test.tsx` exists
- [x] `tests/projects/project-hero.test.tsx` exists
- [x] Commit `790d5dc` present in `git log` (Task 03-02-01 RED)
- [x] Commit `eb285b6` present in `git log` (Task 03-02-01 GREEN)
- [x] Commit `bcdcb2e` present in `git log` (Task 03-02-02 RED)
- [x] Commit `7cc229e` present in `git log` (Task 03-02-02 GREEN)
- [x] Commit `8fc5e06` present in `git log` (Task 03-02-03 RED)
- [x] Commit `f194751` present in `git log` (Task 03-02-03 GREEN)
- [x] `pnpm vitest run tests/projects --reporter=dot` → 28/28 green (21 new + 7 pre-existing hero-fallback)
- [x] `pnpm vitest run` → 183/183 green (no regression in any prior suite)
- [x] `pnpm typecheck` → exit 0
- [x] `pnpm build` → exit 0

---
*Phase: 03-project-detail-template*
*Completed: 2026-05-15*
