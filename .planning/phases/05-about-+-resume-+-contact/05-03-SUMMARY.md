---
phase: 05-about-+-resume-+-contact
plan: 03
subsystem: about-surface
tags: [about, rsc, bio, project-pill-row, contact-stack, values-list, abt-01, abt-02, abt-03, ctc-03, banned-words, pitfall-3, pitfall-5]

requires:
  - phase: 05-about-+-resume-+-contact
    plan: 00
    provides: 5 Wave-0 test placeholders in tests/about/ (about-page, about-bio, project-pill-row, contact-stack, values-list)
  - phase: 02-content-pipeline
    provides: getHeroProjects() helper feeding ProjectPillRow live data
  - phase: 01-foundation
    provides: (site)/ route group with Nav + Footer + MotionProvider + SkipLink chrome
  - phase: 04-home-+-projects-index
    provides: per-route metadata + openGraph.images pattern (root layout omits images so every route declares its own)
provides:
  - /about route at app/(site)/about/page.tsx, RSC, inheriting (site)/ chrome
  - 4 RSC about components (about-bio, project-pill-row, contact-stack, values-list)
  - Locked /about microcopy verbatim from UI-SPEC § Copywriting Contract
  - Second CTC-03 contact surface (footer is the first; Plan 05-04 audits footer)
  - 47 implemented tests across 5 test files (replaces 5 Wave-0 skips)
affects:
  - 05-04-PLAN.md (Footer audit can compare ContactStack's canonical olivelliott handle against footer's ophelia-x to decide whether to standardize)
  - 05-05-PLAN.md (banned-words scanner in tests/home/anti-patterns can extend PHASE_SOURCES to cover the 4 new /about source files)
  - Phase 7 (LinkedIn handle PLACEHOLDER still pending Olive confirmation; ProjectPillRow auto-grows as hero MDX lands)

tech-stack:
  added: []
  patterns:
    - "Pitfall 3-style separation enforced via source-grep regression test: ProjectPillRow hand-mirrors the Phase 3 chip class string but does NOT import TagChipRow. Test asserts no `TagChipRow` or `tag-chip-row` substring in the source. Comment phrasing avoided the literal token to keep the assertion clean (initial commit tripped on the comment until rephrased)."
    - "Locked microcopy hard-coded inline in v1 components; future Phase 7 refactor to content/about.ts is additive (component contract is no-props)."
    - "Definition list (<dl>) for values: <div class='contents'> wrappers group each <dt>/<dd> pair so the dl's flex-col layout reads the children flat — same pattern as Phase 3 resume-skills dl."
    - "Mailto subject %20-encoded per RFC 6068 (Pitfall 5): href tested via getAttribute walk, NOT querySelector('a[href=\"mailto:...%20...\"]') — CSS attribute selectors don't reliably escape `%` in jsdom."
    - "Per-route metadata.openGraph.images MUST be declared per Phase 4 STATE.md note (root layout omits OG images for the homepage; every other route is responsible for its own). /about declares /og-default.png, mirroring /projects."

key-files:
  created:
    - components/about/about-bio.tsx
    - components/about/values-list.tsx
    - components/about/project-pill-row.tsx
    - components/about/contact-stack.tsx
    - app/(site)/about/page.tsx
  modified:
    - tests/about/about-bio.test.tsx
    - tests/about/values-list.test.tsx
    - tests/about/project-pill-row.test.tsx
    - tests/about/contact-stack.test.tsx
    - tests/about/about-page.test.tsx

key-decisions:
  - "ProjectPillRow is its own component, NOT a refactor of TagChipRow (Pitfall 3-style separation). Both use the same Phase 3 chip class string verbatim, but TagChipRow renders tag URL state (/projects?tag=X) and ProjectPillRow renders project navigation (/projects/{slug}). Source-grep regression test in tests/about/project-pill-row.test.tsx locks this separation."
  - "Mailto subject is the locked literal hi%20from%20olivelliott.dev (Pitfall 5 — %20 NOT +). Tested both in components/about/contact-stack.tsx and in the integration test at tests/about/about-page.test.tsx (test 8)."
  - "GitHub URL uses canonical olivelliott handle (NOT ophelia-x). Test 2 in contact-stack.test.tsx locks this. The footer at components/site/footer.tsx still uses ophelia-x from Phase 1 — Plan 05-04 should apply the same correction. Documented as a verification task for Plan 05-04."
  - "LinkedIn handle is a PLACEHOLDER: https://linkedin.com/in/olive-elliott. Marked in the component source with an explicit // PLACEHOLDER comment. Phase 7 / Olive sign-off required to confirm the canonical handle."
  - "/about lives INSIDE the (site)/ route group at app/(site)/about/page.tsx — inherits Nav, Footer, MotionProvider, SkipLink chrome. This is the deliberate opposite of /resume (Plan 05-02) which lives OUTSIDE the group at app/resume/ to opt out of chrome for clean print/PDF output."
  - "Exactly one <h1> on /about (the literal 'about'). Three <h2>s in locked order. The 'who I am' section uses a <p> eyebrow, NOT an h2 — keeps the bio block as the page's first read without competing weight under the H1."

requirements-completed: [ABT-01, ABT-02, ABT-03, CTC-03]

duration: 5min
completed: 2026-05-17
---

# Phase 05 Plan 03: /about Surface Summary

**RSC /about route at `app/(site)/about/page.tsx` with 4 hand-authored components (AboutBio, ProjectPillRow, ContactStack, ValuesList) — locked microcopy verbatim from UI-SPEC § Copywriting Contract; Pitfall 3-style separation between ProjectPillRow and Phase 3 TagChipRow enforced via source-grep regression; mailto %20-encoded per RFC 6068; 47/47 tests green across 5 implemented test files; ABT-01..03 + CTC-03 (second surface) closed.**

## Performance

- **Duration:** 5 min
- **Started:** 2026-05-17T14:47:39Z
- **Completed:** 2026-05-17T14:52:49Z
- **Tasks:** 3
- **Files created:** 5 (4 components + 1 route)
- **Files modified:** 5 (5 test placeholders → 47 implemented tests)

## Accomplishments

- Created `components/about/about-bio.tsx` — 3-paragraph RSC bio with the locked UI-SPEC copy. Paragraph 1 anchors the autonomous-workflows / local-first thesis; paragraph 2 names Aktiga as current role (ABT-02); paragraph 3 grounds the polymath thesis via the Appalachian State cultural anthropology background.
- Created `components/about/values-list.tsx` — `<dl>` RSC with 3 `<dt>`/`<dd>` pairs in locked order (polymath → autonomous workflows → open-source communities) with descriptors verbatim from UI-SPEC. Each pair wrapped in `<div className="contents">` so flex-col flattens the layout (same pattern as Phase 3 resume-skills dl).
- Created `components/about/project-pill-row.tsx` — RSC calling `getHeroProjects()` at render time; renders each hero project as a pill linking to `/projects/{slug}`. Mirrors Phase 3 TagChipRow visual treatment WITHOUT importing it (Pitfall 3-style separation, verified by source-grep test). The row auto-grows as Phase 7 lands more hero MDX.
- Created `components/about/contact-stack.tsx` — `<ul role="list">` with 3 mono links: github (canonical olivelliott handle), mailto with `?subject=hi%20from%20olivelliott.dev` (Pitfall 5 — %20 not +), and a PLACEHOLDER LinkedIn URL. External links use `target="_blank"` + `rel="noopener noreferrer"`; mailto omits both (internal protocol).
- Created `app/(site)/about/page.tsx` — RSC route composing all 4 components inside `<article class="about flex flex-col gap-12">`. Single H1 'about' + three H2s in locked order ('what I'm working on', 'how to reach me', 'values'); 'who I am' is a `<p>` eyebrow (not h2) to keep the bio as the page's first read. Four `<section>` elements with `aria-labelledby` pointing at the eyebrow/h2 ids. Per-route metadata declares title 'about', description naming Aktiga + thesis, openGraph.images for `/og-default.png`.
- Implemented 47 tests across 5 test files (replaces 5 Wave-0 skips from Plan 05-00). Broken down:
  - `tests/about/about-bio.test.tsx`: 8 tests (3-paragraph count, Aktiga substring, thesis anchor, prose + max-w-prose, banned-words negative, RSC source-grep, no motion/lucide imports)
  - `tests/about/values-list.test.tsx`: 6 tests (dl + 3 dt/dd pair count, locked dt order, exact dd descriptors, font-medium + primary color on dt, banned-words, RSC source-grep)
  - `tests/about/project-pill-row.test.tsx`: 8 tests (nav landmark, li count matches real `getHeroProjects().length`, href + textContent integration per project, chip class subset, no TagChipRow import, RSC + no motion/lucide source-grep)
  - `tests/about/contact-stack.test.tsx`: 10 tests (3-li structure, github canonical handle assertion, EXACT mailto href with %20 subject, link rel attributes by index, py-3 hit target, RSC + no-lucide source-grep)
  - `tests/about/about-page.test.tsx`: 15 integration tests (renders, single H1, 3 H2s in order, eyebrow is p not h2, 4 sections with correct aria-labelledby, all 4 child components render, framing paragraph verbatim, metadata.title/description/openGraph.images shape, RSC source-grep)

## Task Commits

Each task was committed atomically:

1. **Task 05-03-01: AboutBio + ValuesList components + 14 tests** — `529cc40` (feat)
2. **Task 05-03-02: ProjectPillRow + ContactStack components + 18 tests** — `6b162f0` (feat)
3. **Task 05-03-03: /about route + integration tests** — `3e60490` (feat)

**Plan metadata:** TBD (final docs commit follows SUMMARY.md write)

## Files Created/Modified

### Created (5)

- `components/about/about-bio.tsx` — RSC, 3-paragraph bio block; copy verbatim from UI-SPEC § Copywriting Contract.
- `components/about/values-list.tsx` — RSC, `<dl>` with 3 dt/dd pairs; descriptors verbatim from UI-SPEC.
- `components/about/project-pill-row.tsx` — RSC, calls `getHeroProjects()`; mirrors Phase 3 chip class WITHOUT importing TagChipRow.
- `components/about/contact-stack.tsx` — RSC, 3 mono contact links; mailto with locked %20-encoded subject.
- `app/(site)/about/page.tsx` — RSC route inside (site)/ group; composes all 4 components + per-route metadata.

### Modified (5 — Wave 0 placeholders implemented)

- `tests/about/about-bio.test.tsx` — 8 tests (was 1 it.skip).
- `tests/about/values-list.test.tsx` — 6 tests (was 1 it.skip).
- `tests/about/project-pill-row.test.tsx` — 8 tests (was 1 it.skip).
- `tests/about/contact-stack.test.tsx` — 10 tests (was 1 it.skip).
- `tests/about/about-page.test.tsx` — 15 tests (was 1 it.skip).

## Decisions Made

1. **Pitfall 3-style separation between ProjectPillRow and TagChipRow.** Both use the same Phase 3 chip class string verbatim, but they're semantically distinct: TagChipRow encodes tag URL state on `/projects`; ProjectPillRow encodes project navigation on `/about`. Hand-authoring the class mirror keeps the two free to evolve independently; a `<ChipRow variant="...">` unifier would be a CardMeta-vs-ProjectMeta repeat from Phase 4 (rejected). Locked via source-grep regression test: any future drift that imports `TagChipRow` into ProjectPillRow fails the test loudly.
2. **Mailto subject is the locked literal `hi%20from%20olivelliott.dev` (Pitfall 5 — %20 NOT +).** Per RFC 6068. Tested both in the ContactStack unit tests (exact href string match) and in the AboutPage integration test (Test 8 walks the anchor list with `getAttribute` rather than `querySelector('a[href="mailto:...%20..."]')` because CSS attribute selectors don't reliably escape `%` in jsdom). The integration test's first revision used a bracket selector and failed for that exact reason; the fix is documented in the test's inline comment.
3. **GitHub URL uses canonical `olivelliott` handle (NOT `ophelia-x`).** Per STATE.md decision (the Myco repo lives at github.com/olivelliott/myco). The Phase 1 footer still uses `ophelia-x` from a pre-canonicalization commit — this plan does NOT touch the footer (out of scope), but **Plan 05-04 (footer audit) should apply the same correction**. Flagged for the next plan in the requires/affects graph above.
4. **LinkedIn URL is a PLACEHOLDER** — currently `https://linkedin.com/in/olive-elliott`. Marked in the component source with an explicit `// PLACEHOLDER` comment. Phase 7 / Olive sign-off required to confirm the canonical handle. Test 6 in `contact-stack.test.tsx` only asserts the URL prefix (`https://linkedin.com/in/`) so the test passes with any handle while still locking the protocol + path shape.
5. **`/about` lives INSIDE the `(site)/` group; `/resume` lives OUTSIDE.** Deliberate opposite intent: `/about` gets the Nav + Footer + MotionProvider + SkipLink chrome by default; `/resume` opts out so the print stylesheet + PDF render stay chrome-free. Locked by file path: `app/(site)/about/page.tsx` vs `app/resume/page.tsx`. Test 1 in about-page.test.tsx asserts the page renders without throwing (a regression that accidentally moves the file outside the group would still render but would lose the chrome inheritance — caught at /about pageload in dev, not at unit-test time).
6. **Single `<h1>` 'about' + three `<h2>`s in locked order.** Heading hierarchy locked by test 2 + test 3. The 'who I am' eyebrow is a `<p>`, not an `<h2>` — this is the only intentional "missing" h2; the bio block carries the section's voice and a heavyweight h2 above it would compete with the page H1. Test 4 locks the eyebrow as `<p id="who-i-am-eyebrow">`.

## Deviations from Plan

**1. [Rule 1 - Bug] Comment-only edit on `components/about/project-pill-row.tsx`**

- **Found during:** Task 2 (initial test run for ProjectPillRow)
- **Issue:** First commit of `components/about/project-pill-row.tsx` had a header comment that included the literal substring `TagChipRow` (in the prose explaining the Pitfall 3-style separation). This tripped the source-grep regression test in `tests/about/project-pill-row.test.tsx` Test 6, which asserts the source contains no `TagChipRow` or `tag-chip-row` substring.
- **Fix:** Rephrased the header comment to describe the separation without using the literal token. Functional code unchanged; comment alone was edited.
- **Why this is Rule 1:** the test as written is correct — it locks the source-grep guarantee against future drift. The component comment was the bug because it gave a false positive on the regression. Rephrasing the comment to use "the Phase 3 tag-chip component" instead of the literal class name preserves the intent while passing the lock.
- **Files modified:** `components/about/project-pill-row.tsx` (comment only).
- **Resolved in commit:** `6b162f0` (Task 2 commit; the comment fix and tests landed atomically).

**2. [Rule 1 - Bug] Test assertion fix: jsdom CSS attribute selectors don't escape `%`**

- **Found during:** Task 3 (initial test run for /about route)
- **Issue:** Test 8 in `tests/about/about-page.test.tsx` initially used `container.querySelector('a[href="mailto:olivelliott48@gmail.com?subject=hi%20from%20olivelliott.dev"]')` to assert ContactStack rendered inside the page. The selector returned `null` in jsdom even though the actual rendered href was correct (verified via a temporary debug test that logged `a.getAttribute('href')`).
- **Fix:** Replaced the bracket selector with a `getAttribute` walk: query all `a[href^="mailto:"]` and find the one whose `getAttribute('href')` strictly equals the locked URL. The assertion semantics are identical — only the lookup mechanism changed.
- **Why this is Rule 1:** the test was wrong (the assertion never could have passed), but the production code was correct (verified independently). Fixing the test, not the code, is the right move.
- **Files modified:** `tests/about/about-page.test.tsx` (Test 8 body + inline comment explaining the jsdom escape behavior).
- **Resolved in commit:** `3e60490` (Task 3 commit).

No other deviations.

## Issues Encountered

- None blocking. The two issues above were caught and resolved during their respective task's TDD GREEN phase.
- The unused `Olive_Elliott_Resume.docx` file at the repo root is untracked but is the source data for Plan 05-01's `content/resume.ts` (already shipped per the Phase 5 STATE.md timeline). Plan 05-03 did NOT touch it.

## User Setup Required

None blocking for this plan. **Two follow-ups for Olive:**

1. **Confirm canonical LinkedIn handle.** Current placeholder: `https://linkedin.com/in/olive-elliott`. Will need updating in:
   - `components/about/contact-stack.tsx` (3rd link) — both the URL constant AND the rendered label (which derives the visible text from the URL by stripping the protocol).
   - `components/site/footer.tsx` (Phase 1) — confirm the footer LinkedIn URL matches.
   - Phase 7 content pass is the natural moment to lock both.
2. **GitHub handle canonicalization.** /about uses `github.com/olivelliott` (canonical). Phase 1 footer uses `github.com/ophelia-x`. **Plan 05-04 (footer audit) should standardize the footer on `olivelliott`** to match. Both surfaces should converge before Phase 6 (SEO/a11y audit) runs sitemap + canonical-URL checks.

## Verification Results

```
=== Source-grep guards ===
test -f 'app/(site)/about/page.tsx' → OK
test ! -f 'app/about/page.tsx' → OK (no stray flat route)
grep -l 'use client' components/about/ app/(site)/about/page.tsx → 0 hits (correct)
grep -E "from ['\"]motion/react['\"]|from ['\"]lucide-react['\"]" components/about/ app/(site)/about/page.tsx → 0 hits (correct)
grep -iE "\b(passionate|crafted|seamless|leveraging|synergy|results-driven|self-starter|team player|cutting-edge|10x|rockstar|ninja)\b" components/about/ app/(site)/about/page.tsx → 0 hits (correct)

=== Vitest ===
About tests:   tests/about/ → 47 passed (47)
Full suite:    Test Files  51 passed | 3 skipped (54)
               Tests       425 passed | 3 skipped (428)
   (down from 16 skipped before this plan — Plan 05-03 implemented 5; Plan 05-02 lane A
    parallel implemented the other 8 in commits e9d5a9a..7e27b90)

=== Typecheck ===
pnpm typecheck → exit 0
```

## Next Phase Readiness

- **Plan 05-04 (footer audit + DownloadPdfLink) is unblocked.** It can compare ContactStack's canonical `olivelliott` handle against the footer's `ophelia-x` to decide whether to standardize the footer (recommend yes). The mailto subject `hi%20from%20olivelliott.dev` is now locked across two surfaces (/about + planned footer); Plan 05-04 should assert the footer mailto matches.
- **Plan 05-05 (Puppeteer pipeline + banned-words sweep) is unblocked for the /about side.** The 4 new about source files should be added to `tests/home/anti-patterns.test.ts`'s PHASE_SOURCES manifest (or forked to `tests/about/anti-patterns.test.ts` if the manifest grows unwieldy) so the banned-words net runs against them on every commit.
- **Phase 7 (content pass) inherits:**
  - LinkedIn handle PLACEHOLDER to resolve.
  - ProjectPillRow auto-grows as more hero-tier MDX lands — no /about code change required.
  - If Olive wants the bio sourced from a typed config (`content/about.ts`), the refactor is additive — `AboutBio` props stay no-args today; switching to `<AboutBio bio={getAbout()} />` is a one-line page-route change.

## Self-Check: PASSED

All 5 created files verified present on disk:
- components/about/about-bio.tsx
- components/about/values-list.tsx
- components/about/project-pill-row.tsx
- components/about/contact-stack.tsx
- app/(site)/about/page.tsx

All 3 task commits verified in git log: 529cc40, 6b162f0, 3e60490.

47/47 about tests green; full vitest suite 425 passed + 3 skipped; pnpm typecheck exit 0.

No stubs introduced. ProjectPillRow uses real `getHeroProjects()` data; the LinkedIn URL is documented as a PLACEHOLDER in source (with explicit `// PLACEHOLDER` comment) and surfaced in both Decisions Made and User Setup Required sections of this SUMMARY for downstream resolution.

---
*Phase: 05-about-+-resume-+-contact*
*Plan: 03*
*Completed: 2026-05-17*
