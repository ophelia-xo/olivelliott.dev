---
phase: 06-seo,-og,-a11y-&-performance-audit
plan: 00
subsystem: testing
tags: [vitest-axe, lighthouse-ci, a11y, seo, infrastructure, wave-0, placeholders]

# Dependency graph
requires:
  - phase: 05-about-+-resume-+-contact
    provides: "Wave-0 placeholder convention (describe + it.skip) — extended verbatim from Plan 05-00."
provides:
  - "vitest-axe@1.0.0-pre.5 installed (locked prerelease line — NOT stale 0.1.0); matcher extension wired in vitest.setup.ts via 'vitest-axe/extend-expect'; TypeScript module augmentation at tests/types/vitest-axe.d.ts."
  - "lighthouserc.json at repo root — 4 category assertions at minScore 0.9 (perf / a11y / best-practices / seo), 'lighthouse:no-pwa' preset, desktop config, --headless=new, startServerReadyPattern 'Ready in' (Pitfall 8), 30s timeout."
  - "pnpm lhci script in package.json — invokes @lhci/cli@0.15.1 via pnpm dlx (no devDep install)."
  - ".gitignore extended with /lighthouse-reports (LHCI output directory)."
  - "lighthouse-report.md template at .planning/phases/06-…/ — empty score tables for / and /projects/myco plus manual keyboard / reduced-motion / 19-item anti-features checklists. Plan 06-04 fills in actual scores."
  - "12 skipped placeholder test files (6 a11y .tsx + 5 seo .ts + 1 launch-gate .ts) — owned plan encoded in skip message for traceability; vitest collects 12 skipped tests as visible execution gate."
affects: [06-01, 06-02, 06-03, 06-04, 06-05]

# Tech tracking
tech-stack:
  added:
    - "vitest-axe@1.0.0-pre.5 (devDep) — actively-maintained prerelease line with matcher-import-path split + Vitest 3 types"
    - "axe-core@^4.4.2 (transitive via vitest-axe — NOT installed separately)"
  patterns:
    - "Wave-0 placeholder convention (1 describe + 1 it.skip per file) — plan number encoded in skip message"
    - "Module augmentation .d.ts for third-party matchers (vitest-axe/matchers → vitest's Assertion interface)"
    - "@lhci/cli invoked via pnpm dlx instead of devDep install — keeps node_modules lean for a one-shot Phase 6 deliverable"
    - "lhci 'Ready in' startServerReadyPattern (Pitfall 8) — Next 16's actual ready string"

key-files:
  created:
    - "tests/types/vitest-axe.d.ts"
    - "lighthouserc.json"
    - ".planning/phases/06-seo,-og,-a11y-&-performance-audit/lighthouse-report.md"
    - "tests/a11y/home.test.tsx"
    - "tests/a11y/projects-index.test.tsx"
    - "tests/a11y/myco-detail.test.tsx"
    - "tests/a11y/about.test.tsx"
    - "tests/a11y/resume.test.tsx"
    - "tests/a11y/keyboard.test.tsx"
    - "tests/seo/favicon.test.ts"
    - "tests/seo/metadata.test.ts"
    - "tests/seo/sitemap.test.ts"
    - "tests/seo/robots.test.ts"
    - "tests/seo/og-image.test.ts"
    - "tests/launch-gate/anti-features.test.ts"
  modified:
    - "package.json (devDep + lhci script)"
    - "pnpm-lock.yaml"
    - "vitest.setup.ts"
    - ".gitignore"

key-decisions:
  - "vitest-axe@1.0.0-pre.5 (NOT 0.1.0): pre.5 is the actively-maintained prerelease line with the matcher-import-path split and Vitest 3 types. 0.1.0 is the stale 2022 line. RESEARCH § Standard Stack."
  - "@lhci/cli@0.15.1 via pnpm dlx (NOT a devDep install): keeps node_modules lean — lhci is a one-shot Phase 6 deliverable run a handful of times locally, not in CI. pnpm-dlx caches the binary."
  - "lighthouserc.json uses startServerReadyPattern 'Ready in' (Pitfall 8): Next 16's actual stdout when the dev/start server boots. Wrong pattern → lhci hangs at 30s timeout."
  - "Module augmentation lives at tests/types/vitest-axe.d.ts (NOT a hand-written .d.ts inside source/): tests/ is the natural home for test-only types; tsconfig.json excludes tests/ from tsc --noEmit, but Vitest's own type-check uses this file at test-load time. Adopts the pattern used by Plan 05-00 + Plan 02-00 for test-only type assets."
  - "Wave-0 placeholder convention extends Plan 05-00 verbatim: one describe + one it.skip per file, plan number encoded in skip message. Downstream plans extend each file in place (no delete + recreate)."

patterns-established:
  - "Test-only TypeScript types belong in tests/types/*.d.ts — co-located with the tests that need them, outside the production tsc include but visible to Vitest's loader."
  - "Wave-0 placeholder gap pattern (carried from Plan 05-00): N visible skipped tests = N pending implementing plans. Skipped count is the dashboard."

requirements-completed: []

# Metrics
duration: 3 min
completed: 2026-05-17
---

# Phase 06 Plan 00: SEO/OG/A11y/Perf Wave 0 Infrastructure Summary

**vitest-axe@1.0.0-pre.5 wired into vitest.setup.ts with TS module augmentation, lighthouserc.json + pnpm lhci script + lighthouse-report.md template authored, and 12 skipped placeholder test files (6 a11y + 5 seo + 1 launch-gate) created — Phase 6 implementation plans unblocked.**

## Performance

- **Duration:** 3 min
- **Started:** 2026-05-17T16:51:24Z
- **Completed:** 2026-05-17T16:54:49Z
- **Tasks:** 3
- **Files modified:** 19 (4 modified, 15 created)

## Accomplishments

- vitest-axe@1.0.0-pre.5 installed at the locked prerelease line; axe-core@^4.4.2 pulled in transitively. Matcher extension imported in `vitest.setup.ts`; module augmentation at `tests/types/vitest-axe.d.ts` makes `expect(...).toHaveNoViolations()` typecheck.
- lighthouserc.json authored at repo root with 4 category assertions at `minScore: 0.9`, `lighthouse:no-pwa` preset, desktop config, headless flags, and the Pitfall-8-locked `startServerReadyPattern: "Ready in"`.
- `pnpm lhci` script added to `package.json` invoking `@lhci/cli@0.15.1` via `pnpm dlx` — no devDep install, keeps node_modules lean.
- `.gitignore` extended with `/lighthouse-reports` so LHCI output never pollutes git.
- `.planning/phases/06-…/lighthouse-report.md` template authored with empty score tables for `/` and `/projects/myco` plus manual keyboard / reduced-motion / 19-item anti-features checklists. Plan 06-04 fills in the actual scores.
- 12 skipped placeholder test files created across 3 new directories (`tests/a11y/`, `tests/seo/`, `tests/launch-gate/`). Each contains one describe + one `it.skip` with the implementing plan number encoded in the skip message. Vitest reports `12 skipped` as a visible execution gate.

## Task Commits

Each task was committed atomically:

1. **Task 1: vitest-axe + vitest.setup.ts + .gitignore** — `e189846` (chore)
2. **Task 2: lighthouserc.json + pnpm lhci script + lighthouse-report.md template** — `1ddfd7a` (chore)
3. **Task 3: 12 skipped placeholder test files** — `a312c33` (test)

**Plan metadata commit:** pending (will include SUMMARY.md, STATE.md, ROADMAP.md, REQUIREMENTS.md)

## Files Created/Modified

### Created
- `tests/types/vitest-axe.d.ts` — module augmentation so toHaveNoViolations typechecks
- `lighthouserc.json` — Lighthouse CI config with 4 category assertions ≥ 0.9
- `.planning/phases/06-seo,-og,-a11y-&-performance-audit/lighthouse-report.md` — score-table template + manual checklists; Plan 06-04 fills in
- `tests/a11y/home.test.tsx` — Plan 06-03 placeholder (`/` route)
- `tests/a11y/projects-index.test.tsx` — Plan 06-03 placeholder (`/projects` route)
- `tests/a11y/myco-detail.test.tsx` — Plan 06-03 placeholder (`/projects/myco` route)
- `tests/a11y/about.test.tsx` — Plan 06-03 placeholder (`/about` route)
- `tests/a11y/resume.test.tsx` — Plan 06-03 placeholder (`/resume` route)
- `tests/a11y/keyboard.test.tsx` — Plan 06-03 placeholder (QAL-03 keyboard nav)
- `tests/seo/favicon.test.ts` — Plan 06-01 placeholder (MTA-04)
- `tests/seo/metadata.test.ts` — Plan 06-02 placeholder (MTA-01)
- `tests/seo/sitemap.test.ts` — Plan 06-02 placeholder (MTA-03)
- `tests/seo/robots.test.ts` — Plan 06-02 placeholder (MTA-03)
- `tests/seo/og-image.test.ts` — Plan 06-02 placeholder (MTA-02)
- `tests/launch-gate/anti-features.test.ts` — Plan 06-04 placeholder (QAL-05, 19-item gate)

### Modified
- `package.json` — added `vitest-axe@1.0.0-pre.5` devDep + `lhci` script
- `pnpm-lock.yaml` — lockfile update
- `vitest.setup.ts` — appended `import 'vitest-axe/extend-expect'` (preserved jest-dom import)
- `.gitignore` — added `/lighthouse-reports` section after typescript section

## Placeholder Ownership Map

| File | Owning Plan | Requirement |
|------|-------------|-------------|
| `tests/a11y/home.test.tsx` | 06-03 | QAL-02 |
| `tests/a11y/projects-index.test.tsx` | 06-03 | QAL-02 |
| `tests/a11y/myco-detail.test.tsx` | 06-03 | QAL-02 |
| `tests/a11y/about.test.tsx` | 06-03 | QAL-02 |
| `tests/a11y/resume.test.tsx` | 06-03 | QAL-02 |
| `tests/a11y/keyboard.test.tsx` | 06-03 | QAL-03 |
| `tests/seo/favicon.test.ts` | 06-01 | MTA-04 |
| `tests/seo/metadata.test.ts` | 06-02 | MTA-01 |
| `tests/seo/sitemap.test.ts` | 06-02 | MTA-03 |
| `tests/seo/robots.test.ts` | 06-02 | MTA-03 |
| `tests/seo/og-image.test.ts` | 06-02 | MTA-02 |
| `tests/launch-gate/anti-features.test.ts` | 06-04 | QAL-05 |

## Decisions Made

1. **vitest-axe@1.0.0-pre.5 (NOT 0.1.0)** — the prerelease line is the actively-maintained branch (matcher-import-path split + Vitest 3 types); 0.1.0 is the 2022 dead line. Locked in RESEARCH § Standard Stack and re-asserted in PLAN.md critical constraints.
2. **`@lhci/cli@0.15.1` via `pnpm dlx`, not devDep** — `pnpm lhci` script invokes via dlx. Lhci is run a handful of times locally for the launch gate, not in CI, so paying the devDep tax for a one-shot tool is wasteful. dlx caches the binary after first invocation.
3. **`startServerReadyPattern: "Ready in"` (Pitfall 8)** — Next 16's actual stdout signal when `pnpm start` finishes booting. The default lhci pattern targets older Next versions and would hang at the 30s timeout.
4. **Module augmentation lives at `tests/types/vitest-axe.d.ts`** — `tests/` is the natural home for test-only types; co-locates the augmentation with the suites that consume it. tsconfig's `exclude: ["tests"]` keeps it outside `tsc --noEmit`, but Vitest's loader picks it up at test-load time so `expect(...).toHaveNoViolations()` typechecks inside test files.
5. **Wave-0 placeholder convention extends Plan 05-00 verbatim** — one describe + one `it.skip` per file, plan number encoded in skip message, downstream plans extend in place (no delete + recreate). The skipped count is the implementation dashboard.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## Verification Evidence

| Check | Result |
|-------|--------|
| `pnpm ls vitest-axe --depth 0` reports `vitest-axe 1.0.0-pre.5` | PASS |
| `pnpm vitest run` baseline pre-plan: 54 files, 457 passed + 4 skipped (461) | recorded |
| `pnpm vitest run` post-plan: 66 files, 457 passed + 16 skipped (473) — +12 new skipped, zero regressions | PASS |
| `pnpm vitest run tests/a11y/ tests/seo/ tests/launch-gate/` collects exactly `12 skipped` tests | PASS |
| `pnpm typecheck` exits 0 (module augmentation does not break tsc) | PASS |
| `node -e "require('./lighthouserc.json')"` returns no error (valid JSON) | PASS |
| `lighthouserc.json` `categories:performance` `minScore` === 0.9 | PASS |
| `lighthouserc.json` `startServerReadyPattern` === `"Ready in"` | PASS |
| `package.json` has `"lhci":` script referencing `@lhci/cli@0.15.1` | PASS |
| `.gitignore` contains `/lighthouse-reports` | PASS |
| `lighthouse-report.md` template exists with `"Phase 6 — Lighthouse Report"` header | PASS |

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Plan 06-00 unblocks all downstream Phase 6 work:

- **Plan 06-01 (Wave 1, favicons)** — edits `tests/seo/favicon.test.ts` in place.
- **Plan 06-02 (Wave 2, OG/sitemap/robots/metadata)** — edits 4 of the `tests/seo/*.test.ts` placeholders in place.
- **Plan 06-03 (Wave 2, a11y)** — edits all 6 `tests/a11y/*.test.tsx` placeholders in place AND uses the vitest-axe matcher wired in Task 1.
- **Plan 06-04 (Wave 3, launch gate + lighthouse)** — edits `tests/launch-gate/anti-features.test.ts` in place AND runs `pnpm lhci` against the config from Task 2, filling in `lighthouse-report.md`.

The visible execution gate (`pnpm vitest run` shows N+12 tests with 12 skipped) drops in lockstep with each completed plan.

**Ready for Plan 06-01.**

## Self-Check: PASSED

All 16 key files exist on disk and all 3 task commits exist in git history.

---
*Phase: 06-seo,-og,-a11y-&-performance-audit*
*Completed: 2026-05-17*
