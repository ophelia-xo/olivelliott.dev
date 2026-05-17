---
phase: 06-seo,-og,-a11y-&-performance-audit
plan: 04
subsystem: testing
tags: [vitest, launch-gate, anti-patterns, lighthouse, ci-deferral]

# Dependency graph
requires:
  - phase: 06-seo,-og,-a11y-&-performance-audit
    provides: "Plan 06-00 (Wave-0 placeholder + lighthouserc.json + lighthouse-report.md template), Plan 06-02 (MTA-01..03 OG + sitemap + robots), Plan 06-03 (QAL-02..04 axe + keyboard + reduced-motion)"
provides:
  - "tests/launch-gate/anti-features.test.ts — 19 it() blocks (QAL-05) codifying the FEATURES.md anti-feature list with verbatim Pattern 11 grep mappings"
  - "lighthouse-report.md — formal deferral notice for QAL-01 with rationale, owner, acceptance criteria, and Phase 7 handoff"
  - "Deferred-but-tracked workflow pattern: requirement marked incomplete in REQUIREMENTS.md, surfaced as human-verification item in Phase 6 VERIFICATION.md, with explicit Phase 7 owner"
affects: ["07-content-pass-and-launch", "any future phase that adds files under app/ or components/"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "19-row launch-gate test pattern: walk app/ + components/ → strip block + line comments → per-item regex OR fs.existsSync. ~50 files, <100ms total. Future contributors trip a named test if they drift toward any AI-template anti-feature."
    - "Comment-strip-before-grep pattern (re-used from tests/home/anti-patterns.test.ts + tests/projects/anti-patterns.test.ts): RSC files document anti-patterns in JSDoc as contracts; naive grep would false-positive. Strip /* */ first, then //."
    - "Deferred-requirement workflow: when a check requires unique local resources (real Chrome, port 3000 server) that Claude can't reliably drive, mark with ⚠️ DEFERRED status + owner + acceptance criteria in the report doc, leave REQUIREMENTS.md unchecked, document handoff in next phase's VERIFICATION.md."

key-files:
  created:
    - ".planning/phases/06-seo,-og,-a11y-&-performance-audit/06-04-SUMMARY.md"
  modified:
    - "tests/launch-gate/anti-features.test.ts (Wave 0 placeholder → 19 it() blocks, +269 lines)"
    - ".planning/phases/06-seo,-og,-a11y-&-performance-audit/lighthouse-report.md (Status: ⬜ not yet run → ⚠️ DEFERRED, +deferral note section)"

key-decisions:
  - "QAL-05 codified as 19 named it() blocks (one per FEATURES.md row) rather than a single parametrized test — failure messages name the FEATURES.md anti-feature directly, giving future contributors a one-step pointer to the rule they violated."
  - "QAL-01 (Lighthouse ≥ 90) deferred to Phase 7 launch-week by user decision — pnpm lhci needs a real Chrome instance + spawned production server, more reliable to run interactively on Olive's local machine pre-deploy than to drive via Claude. Infrastructure is fully ready; only the empirical measurement is pending."
  - "Plan 06-04 marked COMPLETE despite Task 2 deferral — the deferral IS the resolution. The work is documented in lighthouse-report.md as a Phase 7 follow-up with owner + acceptance criteria, and Phase 6 VERIFICATION.md will surface QAL-01 as a human-verification item before launch."

patterns-established:
  - "Launch-gate codification: research/FEATURES.md § Anti-Features → tests/launch-gate/anti-features.test.ts with 1:1 numbered it() blocks. The test file IS the launch gate; the doc is the rationale."
  - "Test #13 (light/dark toggle ban) reads app/providers.tsx and asserts a positive-and-negative pair: defaultTheme='dark' MUST be present AND enableSystem={true} MUST NOT be — locks both halves of the FEATURES.md #13 contract."

requirements-completed: [QAL-05]

# Metrics
duration: 5 min
completed: 2026-05-17
---

# Phase 6 Plan 4: Launch-Gate Codification + Lighthouse Deferral Summary

**19-item anti-features launch gate codified as `tests/launch-gate/anti-features.test.ts` (all green); Lighthouse audit (QAL-01) formally deferred to Phase 7 launch-week per user decision.**

## Performance

- **Duration:** 5 min (resume-from-checkpoint session)
- **Started:** 2026-05-17T22:39:13Z (continuation agent)
- **Completed:** 2026-05-17T22:42:00Z
- **Tasks:** 2 (1 executed + committed in prior session; 1 resolved via user-directed deferral)
- **Files modified:** 2 (tests/launch-gate/anti-features.test.ts, lighthouse-report.md)

## Accomplishments

- **QAL-05 complete:** 19 anti-feature locks shipped as named it() blocks. Any future contributor that drifts toward `<progress aria-valuenow>`, `tsparticles`, `bg-gradient-to-br from-violet`, a `/services` route, a "coming soon" tagline, `enableSystem` on next-themes, a bento-grid home composer, `hover:scale-` on cards, an Intercom widget, or a `<marquee>` tag trips a single test with a clear message naming the FEATURES.md row they violated.
- **lighthouse-report.md upgraded** from blank template to a formal ⚠️ DEFERRED document with owner (Olive), acceptance criteria (8 cells ≥ 0.90), expected gap-closure surfaces (hero image priority/sizes, font-display, motion island bundle size), and a Phase 7 handoff trail.
- **Deferred-but-tracked pattern established:** REQUIREMENTS.md leaves QAL-01 unchecked (defer marker, NOT complete); Phase 6 VERIFICATION.md will surface it as a human-verification item; Phase 7 launch-week checklist owns the actual run.

## Task Commits

1. **Task 1: tests/launch-gate/anti-features.test.ts — 19 anti-feature locks (QAL-05)** — `eacf09b` (test)
   - Replaced Wave 0 placeholder with 19 named it() blocks
   - Grep mappings verbatim from RESEARCH § Pattern 11
   - Walks app/ + components/ recursively; strips block + line comments
   - Routes-absence checks (#10, #11, #18) via fs.existsSync
   - Test #13 reads app/providers.tsx for next-themes contract
   - All 19 tests pass in ~50ms; full suite stays green (513 passed + 4 skipped = 517 total)

2. **Task 2: Lighthouse audit (QAL-01) — DEFERRED to Phase 7 launch-week** — `a63fc64` (docs)
   - lighthouse-report.md Status: ⬜ not yet run → ⚠️ DEFERRED — to be run pre-launch (Phase 7)
   - Added Deferral Note section: rationale, owner, acceptance criteria, likely gap-closure surfaces, explanation of REQUIREMENTS/VERIFICATION asymmetry
   - Score tables left empty intentionally — Olive fills them on the manual run

**Plan metadata commit:** (this commit) — `docs(06-04): complete launch-gate + lighthouse-deferral plan`

## Files Created/Modified

- **`tests/launch-gate/anti-features.test.ts`** (modified, +269 lines)
  - Wave 0 placeholder body replaced with 19 named `it()` blocks
  - Shared helpers: `walk(dir)`, `stripComments(src)`, `eachFile(predicate)` — reused across all per-item assertions
  - Each it() block follows the FEATURES.md numbering verbatim for direct traceability
- **`.planning/phases/06-seo,-og,-a11y-&-performance-audit/lighthouse-report.md`** (modified)
  - Status line: `⬜ not yet run` → `⚠️ DEFERRED — to be run pre-launch (Phase 7)`
  - Inserted "Deferral Note (2026-05-17)" section
  - Score tables, walkthrough checklists, and notes section left intact for Phase 7 fill-in
- **`.planning/phases/06-seo,-og,-a11y-&-performance-audit/06-04-SUMMARY.md`** (created — this file)

## Decisions Made

- **QAL-01 deferred to Phase 7 launch-week** (user decision during checkpoint). `pnpm lhci` requires a real Chrome instance + a spawned `pnpm start` server on port 3000 — both local-machine resources that Claude can't reliably drive. Deferring to a single interactive run pre-deploy is cheaper than fighting Puppeteer + port management in CI. Infrastructure is fully ready (lighthouserc.json wired, pnpm lhci script present, Puppeteer Chromium installed). Locked in lighthouse-report.md with explicit owner + acceptance criteria.
- **Plan 06-04 marked COMPLETE despite deferred Task 2** — the deferral *is* the resolution at this layer. The work is documented as a Phase 7 follow-up; nothing further to do inside Phase 6 for this plan.
- **QAL-01 stays unchecked in REQUIREMENTS.md** (NOT marked complete) — Phase 6 VERIFICATION.md will surface it as a human-verification item before phase-gate sign-off. Honest requirement tracking: the box checks when the audit runs and passes, not when the audit is *planned*.
- **QAL-05 marked complete** — the 19-item test is shipped, all green, and locked in CI. The codified gate IS the requirement.

## Deviations from Plan

### Resolved by User Decision

**1. [Rule 3 - Blocking] Lighthouse CLI requires a real Chrome instance Claude can't reliably drive**
- **Found during:** Task 2 (Run `pnpm lhci` and capture scores into lighthouse-report.md)
- **Issue:** `pnpm lhci` wraps `pnpm build && pnpm dlx @lhci/cli@0.15.1 autorun --config=./lighthouserc.json`, which spawns `pnpm start` on port 3000 and drives Chrome (via Puppeteer or system binary) to audit 2 URLs. Claude does not have a stable interactive terminal that can host a long-running production server while another process drives Chrome against it — the run hangs or produces unreliable scores.
- **Fix:** User directed: defer the audit to Phase 7's launch-week checklist (single interactive run pre-deploy on Olive's local machine). Updated `lighthouse-report.md` Status to `⚠️ DEFERRED — to be run pre-launch (Phase 7)` with full rationale, owner, and acceptance criteria. REQUIREMENTS.md leaves QAL-01 unchecked so the audit surfaces as a human-verification item in Phase 6 VERIFICATION.md.
- **Files modified:** `.planning/phases/06-seo,-og,-a11y-&-performance-audit/lighthouse-report.md`
- **Verification:** `grep "Status:.*DEFERRED" lighthouse-report.md` returns the new status line. QAL-01 stays unchecked in REQUIREMENTS.md.
- **Committed in:** `a63fc64` (Task 2 deferral commit)

---

**Total deviations:** 1 resolved-by-user (1 blocking, no auto-fixes)
**Impact on plan:** Plan completed at full scope — QAL-05 shipped exactly as specified; QAL-01 deferred to a future-owned checklist with no scope drop. The deferral pattern is a workflow win: launch-week audit consolidates Lighthouse + browser smoke + Vercel deploy verification into one interactive session rather than three brittle CI proxies.

## Issues Encountered

None — Task 1 ran clean (19 tests green on first run after authoring); Task 2's blocker was a known pre-checkpoint expectation (the plan flagged it as `checkpoint:human-action` with `gate="blocking"`) and the user-directed deferral is the documented resolution path.

## User Setup Required

None - no external service configuration required. The Lighthouse audit (deferred to Phase 7) requires Olive to run `pnpm lhci` interactively pre-deploy — that's a launch-week task, not an infrastructure setup task.

## Authentication Gates

None.

## Next Phase Readiness

- **Phase 6 status:** 4/6 plans complete (06-00, 06-01, 06-02, 06-03, 06-04). Plan 06-05 (Wave 4 cleanup + phase-gate sign-off) is next and is the last plan in the phase.
- **Plan 06-05 readiness:** All Phase 6 source files exist; Plan 06-05 extends `PHASE_SOURCES` manifest (+8 entries), deletes orphaned `public/{file,globe,next,vercel,window}.svg`, runs `pnpm build` smoke, and flips 06-VALIDATION.md to phase-gate sign-off. QAL-01 will be marked as "deferred to Phase 7 launch-week" in the phase-gate doc.
- **Phase 7 inheritance:** Phase 7 launch-week checklist owns: (1) `pnpm lhci` run → fill 8 score cells in lighthouse-report.md, (2) check 3 supplementary walkthroughs (keyboard, reduced-motion, anti-features visual), (3) tick QAL-01 in REQUIREMENTS.md after all 8 cells ≥ 0.90. If any axis fails, a Phase 7 gap-closure micro-plan addresses it before deploy.

## Self-Check

Verified after writing this summary:

- **Files exist:**
  - `tests/launch-gate/anti-features.test.ts` — FOUND (Task 1 modified)
  - `.planning/phases/06-seo,-og,-a11y-&-performance-audit/lighthouse-report.md` — FOUND (Task 2 modified)
  - `.planning/phases/06-seo,-og,-a11y-&-performance-audit/06-04-SUMMARY.md` — FOUND (this file)
- **Commits exist:** `eacf09b` (Task 1) and `a63fc64` (Task 2 deferral) both verified in `git log --oneline`
- **Tests pass:** `pnpm vitest run tests/launch-gate/anti-features.test.ts` → 19 passed, 0 failed, 0 skipped
- **Requirements alignment:** QAL-05 → marked complete (test shipped, green); QAL-01 → stays unchecked (deferred to Phase 7, not completed)

## Self-Check: PASSED

---
*Phase: 06-seo,-og,-a11y-&-performance-audit*
*Completed: 2026-05-17*
