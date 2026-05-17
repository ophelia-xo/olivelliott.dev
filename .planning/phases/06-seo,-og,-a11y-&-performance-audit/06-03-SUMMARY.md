---
phase: 06-seo,-og,-a11y-&-performance-audit
plan: 03
subsystem: testing
tags: [vitest-axe, a11y, accessibility, axe-core, qal-02, qal-03, qal-04, reduced-motion, keyboard-nav, source-grep]

# Dependency graph
requires:
  - phase: 06-seo,-og,-a11y-&-performance-audit
    provides: "Plan 06-00 wired vitest-axe@1.0.0-pre.5 matcher extension into vitest.setup.ts + TS module augmentation at tests/types/vitest-axe.d.ts + created the 6 Wave-0 placeholder files this plan replaces."
  - phase: 04-home-+-projects-index
    provides: "tests/home/anti-patterns.test.ts (10 invariants) + PHASE_SOURCES manifest extended in Phase 5; Test 11 (QAL-04) appended in this plan."
  - phase: 04-home-+-projects-index
    provides: "Motion/react Proxy mock pattern (tests/home/page.test.tsx + tests/projects/index-page.test.tsx) — reused verbatim across 5 a11y route tests."
provides:
  - "5 vitest-axe route-level a11y tests covering /, /projects, /projects/myco, /about, /resume — each asserts expect(await axe(container)).toHaveNoViolations() with the appropriate render strategy (sync vs async RSC, SiteLayout-wrapped vs chromeless)."
  - "Keyboard nav test (tests/a11y/keyboard.test.tsx) with 4 invariants: source-grep no-tabIndex={-1} carve-out (empty), DOM-grep ≥1 focusable on /, source-grep :focus-visible in globals.css, source-grep <SkipLink/> wired in (site)/layout.tsx."
  - "Test 11 in tests/home/anti-patterns.test.ts (QAL-04 reduced-motion lock) — every PHASE_SOURCES file importing motion/react MUST also call useReducedMotion(); STATIC_ONLY_IMPORTERS carve-out documented + empty."
  - "Three production-code a11y fixes (gap closures triggered by axe on first run): aria-pressed removed from TagFilterRow chips; CardMeta + ProjectMeta wrappers converted from <div role='list'> to <ul role='list'> with <li role='listitem'> children; TierSeparator label promoted from <p> to <h2>."
affects: [06-04, 06-05, 07-launch]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "vitest-axe per-route assertion: await axe(container) inside expect(...).toHaveNoViolations() — async-aware matcher requires await BEFORE expect, not inside the matcher arg."
    - "Async RSC render in vitest-axe: const ui = await Page({ params/searchParams: Promise.resolve(...) }); render(<SiteLayout>{ui}</SiteLayout>) — Phase 4 Pitfall 5 pattern carries cleanly into a11y tests."
    - "SiteLayout-wrap pattern for chromed-route a11y: wraps in MotionProvider (motion/react stub required) + Nav (next/navigation usePathname stub required) so axe inspects the full landmark surface."
    - "Chromeless-route /resume tests render the page directly (no SiteLayout wrap) — app/resume/layout.tsx is a fragment passthrough; SiteLayout wrap would inject the (site) chrome the route deliberately excludes."
    - "Gap-closure-inline workflow: when axe surfaces a real production a11y violation on first run, fix the underlying production code + update related Plan-03/04 tests as Rule 2 deviations (correctness/a11y critical functionality), don't silence the rule."
    - "Source-grep paired-token check: a file matching pattern A (imports motion/react) MUST also match pattern B (calls useReducedMotion) — Test 11 in anti-patterns.test.ts is the template."

key-files:
  created: []
  modified:
    - "tests/a11y/home.test.tsx (Wave 0 placeholder → real test)"
    - "tests/a11y/projects-index.test.tsx (Wave 0 placeholder → real test)"
    - "tests/a11y/myco-detail.test.tsx (Wave 0 placeholder → real test)"
    - "tests/a11y/about.test.tsx (Wave 0 placeholder → real test)"
    - "tests/a11y/resume.test.tsx (Wave 0 placeholder → real test)"
    - "tests/a11y/keyboard.test.tsx (Wave 0 placeholder → 4 real invariants)"
    - "tests/home/anti-patterns.test.ts (Test 11 appended; describe title updated 'Phase 4+5' → 'Phase 4+5+6')"
    - "components/projects/card-meta.tsx (Rule 2 fix: <div role='list'> → <ul role='list'> + <li role='listitem'> children)"
    - "components/projects/project-meta.tsx (Rule 2 fix: same shape as CardMeta)"
    - "components/projects/tag-chip-row.tsx (Rule 2 fix: wraps each <a> chip in <li role='listitem'>)"
    - "components/projects/tag-filter-row.tsx (Rule 2 fix: removed aria-pressed from <a> chips — kept aria-current='true')"
    - "components/projects/tier-separator.tsx (Rule 2 fix: <p> → <h2> for heading order)"
    - "tests/projects/card-meta.test.tsx (test contract update: assert ul/li shape)"
    - "tests/projects/project-meta.test.tsx (test contract update: assert ul/li shape)"
    - "tests/projects/tag-chip-row.test.tsx (test contract update: assert <li> wraps each <a>)"
    - "tests/projects/tag-filter-row.test.tsx (test contract update: aria-current replaces aria-pressed)"
    - "tests/projects/tier-separator.test.tsx (test contract update: <h2> replaces <p>)"
    - "tests/projects/index-page.test.tsx (test contract update: aria-current replaces aria-pressed in 4 queries)"
    - "tests/projects/project-card-hero.test.tsx (test contract update: scope outcome <li> queries to ul:not([role='list']))"
    - "tests/projects/project-card-secondary.test.tsx (test contract update: scope <ul> queries to ul:not([role='list']))"

key-decisions:
  - "vitest-axe gap-closure: fix underlying production a11y violations inline (Rule 2) rather than silence with axe(container, { rules: {...} }) — plan explicitly forbids rule silencing. Three real fixes triggered on first run."
  - "aria-pressed removal from TagFilterRow chips: aria-pressed is a button-only WAI-ARIA 1.2 attribute, forbidden on <a>. aria-current='true' already conveyed 'currently selected within a set', so dropping aria-pressed is semantics-neutral."
  - "CardMeta/ProjectMeta wrapper element <div role='list'> → <ul role='list'>: axe's aria-required-children rule requires role='list' to contain role='listitem' descendants. <ul>+<li> is the semantically-correct fix that ALSO preserves the [role='list'][aria-label='Project metadata'] querySelector contracts in existing tests."
  - "TierSeparator <p> → <h2>: on /projects the heading order was h1 (page title) → h3 (card title), skipping h2. The tier eyebrow IS the heading of the section (it's the aria-labelledby target), so <h2> is correct semantically AND fixes axe's heading-order rule."
  - "Mocking next/navigation in all 4 chromed-route a11y tests: Nav's NavLink calls usePathname() — without the stub it returns null in jsdom and trips a TypeError on pathname.startsWith. Each test stubs usePathname to its own route's pathname."
  - "Per-test motion/react mock (Pattern 7 + Pitfall 6): even routes that ship zero motion (/about, /projects) need the stub because SiteLayout wraps MotionProvider, which loads motion/react eagerly."
  - "Keyboard test scope: source-grep + DOM-grep is the jsdom-feasible layer; the interactive Tab walkthrough is deferred to Plan 06-04 lighthouse-report.md as manual verification (RESEARCH § Pattern 8 — jsdom user-event Tab simulation is unreliable)."
  - "Test 11 STATIC_ONLY_IMPORTERS carve-out documented with example comment but kept empty: MotionProvider lives in Phase 1 PHASE_SOURCES (not Phase 4+5+6 manifest), so the test scope is bounded. Phase 7 contributors can extend the carve-out with inline reasoning."

patterns-established:
  - "Mock-chain order for vitest-axe of SiteLayout-wrapped routes: vi.mock('next/navigation') + vi.mock('motion/react') + vi.mock('@/lib/projects') — all hoisted at module top so dynamic await import('@/app/(site)/...') sees the mocks."
  - "Wave-0 placeholder evolution: existing skipped describe block is REPLACED in place (file path preserved) — vitest reports the skipped count dropping in lockstep with implementing plans."
  - "vitest-axe failures = gap-closure triggers: a violation surfaced on first run means production code has the a11y bug, not the test."

requirements-completed: [QAL-02, QAL-03, QAL-04]

# Metrics
duration: 11 min
completed: 2026-05-17
---

# Phase 06 Plan 03: A11y Verification Surface Summary

**5 vitest-axe route tests + 1 keyboard test + 1 reduced-motion source-grep, plus 3 production-code a11y fixes (aria-pressed removal, role=list→ul/li, h2 promotion) — entire public surface is now axe-clean and locked against regression.**

## Performance

- **Duration:** 11 min
- **Started:** 2026-05-17T17:15:04Z
- **Completed:** 2026-05-17T17:26:32Z
- **Tasks:** 3
- **Files modified:** 19 (7 test placeholders implemented, 5 production-code fixes, 7 existing tests updated for the new shapes)

## Accomplishments

- All 5 public routes (`/`, `/projects`, `/projects/myco`, `/about`, `/resume`) have zero axe violations under WCAG 2.1 AA — the default vitest-axe ruleset, no silenced rules.
- Keyboard nav test passes 4/4 invariants: zero `tabIndex={-1}` in app/+components/, ≥1 tab-reachable element on `/`, `:focus-visible` declared in `app/globals.css`, and `<SkipLink />` wired into `app/(site)/layout.tsx`.
- Test 11 added to `tests/home/anti-patterns.test.ts` — every `motion/react` importer in PHASE_SOURCES is now source-locked to also call `useReducedMotion()`. Phase 7 contributors who add a motion island without the gate trip the test with an explicit QAL-04 violation message.
- Three real production a11y bugs fixed inline as gap-closure: `aria-pressed` on `<a>` (axe `aria-allowed-attr`), `role="list"` div without `listitem` children (axe `aria-required-children`), and h1→h3 heading skip on `/projects` (axe `heading-order`). All triggered by Task 1's first run.
- Full suite: 494 passed / 5 skipped / 0 failed; +5 new a11y tests + Test 11 went from skipped/missing to green; previously-skipped counts dropped from 10 → 5.

## Task Commits

Each task was committed atomically:

1. **Task 1: 5 vitest-axe route a11y tests + 3 gap-closure fixes** — `c5f0b70` (test)
2. **Task 2: keyboard nav test (QAL-03)** — `01cefd5` (test)
3. **Task 3: Test 11 reduced-motion lock (QAL-04)** — `b985822` (test)

**Plan metadata commit:** pending (will include SUMMARY.md, STATE.md, ROADMAP.md, REQUIREMENTS.md)

## Files Created/Modified

### Modified — test surface (real tests replacing placeholders + extension)
- `tests/a11y/home.test.tsx` — `/` route axe(container) inside SiteLayout (motion/react + next/navigation + @/lib/projects mocks; verbatim Phase 4 Proxy motion mock).
- `tests/a11y/projects-index.test.tsx` — `/projects` async-RSC await-then-render inside SiteLayout.
- `tests/a11y/myco-detail.test.tsx` — `/projects/myco` async-RSC; reuses the real `getProject('myco')` fixture path; vitest mdxShimPlugin returns no-op MDX body.
- `tests/a11y/about.test.tsx` — `/about` sync RSC inside SiteLayout.
- `tests/a11y/resume.test.tsx` — `/resume` rendered WITHOUT SiteLayout (chromeless contract; ResumeLayout is fragment passthrough).
- `tests/a11y/keyboard.test.tsx` — 4 invariants: source-grep tabIndex={-1}, DOM-grep focusable count on /, source-grep :focus-visible in globals.css, source-grep <SkipLink/> in (site)/layout.tsx.
- `tests/home/anti-patterns.test.ts` — Test 11 (QAL-04) appended; describe title updated.

### Modified — production code (Rule 2 a11y gap closures)
- `components/projects/card-meta.tsx` — `<div role="list">` → `<ul role="list">` with `<li role="listitem">` children.
- `components/projects/project-meta.tsx` — same shape change.
- `components/projects/tag-chip-row.tsx` — each chip `<a>` now wrapped in `<li role="listitem">` so the parent `<ul role="list">` (ProjectMeta) has the required listitem descendants.
- `components/projects/tag-filter-row.tsx` — removed `aria-pressed={isActive}` from chips; `aria-current="true"` is now the sole selection-state attribute. Updated comment header.
- `components/projects/tier-separator.tsx` — `<p id={id}>` → `<h2 id={id}>`. Visual styling preserved; only element name changed.

### Modified — Plan 03+04 tests updated to track the new shapes
- `tests/projects/card-meta.test.tsx` — asserts ul/li wrapper shape with listitem roles.
- `tests/projects/project-meta.test.tsx` — same.
- `tests/projects/tag-chip-row.test.tsx` — asserts first child is `<li>` (was `<a>`); `<a>` still exists as child of `<li>`.
- `tests/projects/tag-filter-row.test.tsx` — `aria-current="true"` replaces `aria-pressed="true"` in queries; one combined test replaces the prior aria-pressed-truth + aria-pressed-falsity pair.
- `tests/projects/tier-separator.test.tsx` — `<h2>` element queries replace `<p>` queries; className treatment preserved.
- `tests/projects/index-page.test.tsx` — `a[aria-current="true"]` replaces `a[aria-pressed="true"]` (4 occurrences); inactive-chip queries reworded.
- `tests/projects/project-card-hero.test.tsx` — outcome <li> queries scoped to `ul:not([role="list"])` so CardMeta's `<li>` items aren't double-counted.
- `tests/projects/project-card-secondary.test.tsx` — same scoping for the "NO ul" assertion.

## Decisions Made

1. **Gap-closure inline (not deferred):** Plan-prescribed workflow was ambiguous between "document and surface, defer fix" and "fix the underlying a11y issue." Chose to fix inline because (a) Success Criteria require zero violations, (b) plan explicitly says "fix the underlying issue", and (c) all three issues had surgically-scoped fixes that preserved the existing test querySelector contracts.

2. **`aria-pressed` removal over `<button>` conversion:** TagFilterRow chips are `<a>` to keep the URL-as-state contract (Phase 4 Pattern 2). Converting to `<button>` would have broken native browser back-button/reload semantics. Dropping `aria-pressed` and keeping `aria-current="true"` is the minimal correct fix.

3. **`<ul>+<li>` over `role="list"` removal:** Removing `role="list"` + `aria-label` from CardMeta/ProjectMeta would have broken the `[role="list"][aria-label="Project metadata"]` querySelector in 3+ existing tests. Converting to semantically-correct `<ul>` with explicit `role="list"` preserves the attribute selector AND fixes the axe rule.

4. **`<h2>` for TierSeparator over hidden h2 injection:** The tier eyebrow IS the heading of the section (it's the `aria-labelledby` target). Making it `<h2>` is semantically correct and gets axe clean in one change. Visual styling (`font-mono lowercase text-tertiary`) is unchanged.

5. **Mock next/navigation in every chromed-route a11y test:** Nav's NavLink calls `usePathname()`. Without the stub, jsdom returns null and the page rendering throws before axe ever runs. Stubbing per-test (with the route's own pathname) is the simplest fix.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 — A11y Critical Functionality] Removed aria-pressed from TagFilterRow chips**
- **Found during:** Task 1 (first run of a11y/projects-index.test.tsx)
- **Issue:** Axe rule `aria-allowed-attr` fired because `<a>` elements do not support `aria-pressed` (button-only, WAI-ARIA 1.2). The Plan-04 component had both `aria-pressed={isActive}` AND `aria-current="true"`, so the selection state was already conveyed correctly elsewhere.
- **Fix:** Removed `aria-pressed={isActive}` from the chip `<a>`. Kept `aria-current="true"` (already present). Updated component comment header explaining the change.
- **Files modified:** components/projects/tag-filter-row.tsx
- **Related test updates:** tests/projects/tag-filter-row.test.tsx (combined aria-pressed-truth + aria-pressed-falsity tests into one aria-current test), tests/projects/index-page.test.tsx (4 querySelector swaps).
- **Verification:** all related tests + a11y/projects-index pass; axe `aria-allowed-attr` no longer fires.
- **Committed in:** c5f0b70 (Task 1 commit)

**2. [Rule 2 — A11y Critical Functionality] Converted CardMeta + ProjectMeta wrappers from div role=list to ul role=list with li children**
- **Found during:** Task 1 (first run of a11y/home, a11y/projects-index, a11y/myco-detail tests)
- **Issue:** Axe rule `aria-required-children` fired because `role="list"` on a `<div>` requires `role="listitem"` descendants — the Plan-04/03 components put `<time>`, `<span>`, `<a>` as direct children with no listitem wrapping.
- **Fix:** Converted wrapper elements from `<div role="list" aria-label="Project metadata">` to `<ul role="list" aria-label="Project metadata" class="list-none p-0 m-0">` and wrapped each direct child in `<li role="listitem">`. TagChipRow updated so each chip `<a>` lives inside its own `<li>`.
- **Files modified:** components/projects/card-meta.tsx, components/projects/project-meta.tsx, components/projects/tag-chip-row.tsx
- **Related test updates:** tests/projects/card-meta.test.tsx (assert ul/li shape), tests/projects/project-meta.test.tsx (same), tests/projects/tag-chip-row.test.tsx (assert <li> wrapper), tests/projects/project-card-hero.test.tsx + project-card-secondary.test.tsx (scope outcome <li> queries to `ul:not([role="list"])` to avoid double-counting metadata <li>).
- **Verification:** axe `aria-required-children` no longer fires; the `[role="list"][aria-label="Project metadata"]` querySelector still resolves (now matches the `<ul>` with the explicit attribute).
- **Committed in:** c5f0b70 (Task 1 commit)

**3. [Rule 2 — A11y Critical Functionality] Promoted TierSeparator label from p to h2**
- **Found during:** Task 1 (first run of a11y/projects-index test)
- **Issue:** Axe rule `heading-order` fired on `/projects` because the route rendered `<h1>all projects</h1>` then ProjectCardSecondary's `<h3>{project.title}</h3>` with no `<h2>` in between. TierSeparator's tier label was a `<p>`, which doesn't satisfy the heading hierarchy.
- **Fix:** Changed TierSeparator's label element from `<p>` to `<h2>`. Visual styling (`font-mono text-[var(--text-label)] tracking-[0.02em] lowercase text-[color:var(--color-text-tertiary)]`) is preserved verbatim — only the element name changed. The `id` prop continues to land on the heading element so the parent `<section aria-labelledby="...">` linkage stays intact.
- **Files modified:** components/projects/tier-separator.tsx
- **Related test updates:** tests/projects/tier-separator.test.tsx (all 4 tests now query `<h2>` instead of `<p>`).
- **Verification:** axe `heading-order` no longer fires; `/projects` heading order is now h1 → h2 (tier) → h3 (card).
- **Committed in:** c5f0b70 (Task 1 commit)

**4. [Rule 3 — Blocking Issue] Mocked next/navigation in 4 a11y tests**
- **Found during:** Task 1 (first run of all SiteLayout-wrapped a11y tests)
- **Issue:** Nav composes NavLink which calls `usePathname()` from `next/navigation`. In jsdom (without a Next.js runtime), `usePathname()` returns null and the component throws `Cannot read properties of null (reading 'startsWith')` before axe gets a chance to run.
- **Fix:** Added `vi.mock('next/navigation', () => ({ usePathname: () => '<route>' }))` to home/projects-index/myco-detail/about a11y tests (each stubbing its own pathname). /resume test does not need it (renders without SiteLayout).
- **Files modified:** tests/a11y/home.test.tsx, tests/a11y/projects-index.test.tsx, tests/a11y/myco-detail.test.tsx, tests/a11y/about.test.tsx
- **Verification:** all 5 a11y tests render successfully and reach the axe assertion.
- **Committed in:** c5f0b70 (Task 1 commit)

---

**Total deviations:** 4 auto-fixed (3 Rule 2 a11y critical functionality, 1 Rule 3 test-infrastructure blocking)
**Impact on plan:** The 3 Rule 2 deviations are real production-code a11y fixes that any axe-aware launch gate would catch — fixing them was load-bearing for the QAL-02 success criterion. The Rule 3 deviation is test-infrastructure-only (mocking) and adds no production-code surface. No scope creep; all changes are surgically scoped and well-justified by WAI-ARIA spec.

## Issues Encountered

None - the gap-closure deviations above are the only friction; each was anticipated by the plan's "Gap-closure-if-failures" guidance. No external blockers, no library bugs, no infra issues.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Plan 06-03 unblocks downstream Phase 6 work:

- **Plan 06-04 (Wave 3, launch gate + lighthouse)** — the a11y surface is now axe-clean across all 5 routes, so the lighthouse `categories:accessibility` ≥ 0.9 assertion (Plan 06-00's lighthouserc.json) should pass on first run. The manual interactive walkthrough sections of `lighthouse-report.md` (Tab through filter chips, Enter to activate, resume PDF download) remain as the documented manual verification step.
- **Plan 06-05 (Wave 3, validation)** — Test 11 in anti-patterns.test.ts gives the validation gate an automatic guard against Phase 7 motion regressions.
- **Phase 7 (launch)** — three production-code a11y bugs that would have shipped to production are now caught. The QAL-04 source-grep extension means future motion contributors cannot accidentally regress.

**Ready for Plan 06-04.**

## Self-Check: PASSED

All 7 key files exist on disk and all 3 task commits exist in git history:
- tests/a11y/home.test.tsx, projects-index.test.tsx, myco-detail.test.tsx, about.test.tsx, resume.test.tsx, keyboard.test.tsx: FOUND
- tests/home/anti-patterns.test.ts: FOUND
- Commits c5f0b70, 01cefd5, b985822: FOUND in git log

---
*Phase: 06-seo,-og,-a11y-&-performance-audit*
*Completed: 2026-05-17*
