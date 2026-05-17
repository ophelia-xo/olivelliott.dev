---
phase: 05-about-+-resume-+-contact
plan: 05
subsystem: infra
tags: [puppeteer, wait-on, pdf, postbuild, vitest, source-grep, regression-test, phase-gate]

# Dependency graph
requires:
  - phase: 05-about-+-resume-+-contact
    provides: "/resume route (Plan 05-02) — Puppeteer navigates to http://127.0.0.1:3057/resume; /about + footer (Plans 05-03, 05-04) — added to PHASE_SOURCES manifest; Wave 0 dependencies (Plan 05-00) — puppeteer@^25, wait-on@^9, scripts/build-resume-pdf.ts shell, public/resume.pdf stub, // postbuild placeholder, 16 test placeholders"
  - phase: 04-home-+-projects-index
    provides: "tests/home/anti-patterns.test.ts — the PHASE_SOURCES manifest pattern that Phase 5 extends; 8 source-grep invariants (Tests 1–8) reused across 24 files"
provides:
  - Cross-phase anti-pattern regression net (Phase 4 + 5 combined; 24 files × 10 invariants in tests/home/anti-patterns.test.ts)
  - Active pnpm postbuild hook that auto-generates /public/resume.pdf on every build (fail-fast)
  - scripts/build-resume-pdf.ts — full Puppeteer pipeline with USER OVERRIDE regression locks (no puppeteer-core / no @sparticuz/chromium)
  - tests/resume/pdf-build.test.ts — 13 structural source-grep tests that lock the decision lineage
  - tests/resume/pdf-artifact.test.ts — 4 gated artifact tests (skip in dev, run in CI or RESUME_PDF_CHECK=1)
  - Real /public/resume.pdf (240,502 bytes / 3 pages / %PDF-1.4) replacing the Wave 0 16-byte stub
  - Phase 5 VALIDATION sign-off (status: complete, nyquist_compliant: true, wave_0_complete: true)
affects: [phase-06, phase-07, vercel-deploy, /resume route, /about route]

# Tech tracking
tech-stack:
  added: ["@types/wait-on@^5.3.4 (devDep — typecheck unblocker for new wait-on import)"]
  patterns:
    - "PHASE_SOURCES (was PHASE4_SOURCES): cross-phase manifest in a single test file; future phases extend by appending entries — invariants stay constant"
    - "Carve-out-as-filter for inherited cross-phase exceptions (Test 7 excludes components/site/footer.tsx for its Phase 1 Mail import baseline)"
    - "Single-source-of-truth href lock (Test 10 — only one file may emit href='/resume.pdf'; all other callers compose <DownloadPdfLink />)"
    - "USER OVERRIDE regression lock via source-grep tests (Tests 8 + 9 in pdf-build.test.ts assert the literal strings 'puppeteer-core' and '@sparticuz/chromium' are ABSENT from the script — prevents accidental reversion to CONTEXT.md's original locked path)"
    - "Gated artifact tests with describe.skipIf — RESUME_PDF_CHECK=1 or CI=true required; dev runs cleanly skip instead of flaking on missing artifact"
    - "Fail-fast postbuild: tsx scripts/build-resume-pdf.ts exits non-zero → pnpm chains → next build fails → Vercel deploy fails (shipping a stale resume.pdf is worse than a failed deploy)"
    - "@page geometry lives in CSS (app/resume/resume.css), NOT in script options; preferCSSPageSize: true opts the script INTO honoring CSS (Pitfall 3 lock)"

key-files:
  created:
    - tests/resume/pdf-artifact.test.ts (replaced Wave 0 placeholder with 4 gated tests)
  modified:
    - tests/home/anti-patterns.test.ts (PHASE4_SOURCES → PHASE_SOURCES, 11 → 24 entries, +2 invariants, Lucide footer carve-out)
    - scripts/build-resume-pdf.ts (replaced Wave 0 throwing shell with full Puppeteer pipeline; 105 LOC)
    - tests/resume/pdf-build.test.ts (replaced Wave 0 placeholder with 13 structural tests; 132 LOC)
    - package.json (// postbuild placeholder renamed to active postbuild; +@types/wait-on devDep)
    - public/resume.pdf (Wave 0 16-byte stub → real PDF, 240,502 bytes / 3 pages)
    - .planning/phases/05-about-+-resume-+-contact/05-VALIDATION.md (frontmatter flipped: status complete, nyquist true, wave-0 true, completed 2026-05-17)

key-decisions:
  - "USER OVERRIDE held: full puppeteer@^25, not puppeteer-core + @sparticuz/chromium-min. PDF is committed to git → production never runs this script → 250 MB serverless limit doesn't apply → full puppeteer auto-downloads Chrome with zero config. Locked by Tests 8 + 9 in pdf-build.test.ts (absent-string assertions on the literal strings 'puppeteer-core' and '@sparticuz/chromium')."
  - "Single PHASE_SOURCES manifest (not separate PHASE4_SOURCES + PHASE5_SOURCES) — invariants stay constant across phases; future Phase 6 contributors extend by appending. Eight Test 1–8 invariants now run against 24 files in <20ms."
  - "Test 7 carve-out via .filter() not skip — footer Mail import is the Phase 1 baseline, not a Phase 5 addition. The carve-out is documented inline; any NEW Lucide import in any other PHASE_SOURCES file still fails."
  - "Gated artifact test (describe.skipIf) over always-on file existence check — dev runs of pnpm vitest run should not require a fresh pnpm build first; the artifact-existence contract activates in CI or with RESUME_PDF_CHECK=1."
  - "Fail-fast postbuild over warn-and-continue — silent staleness is exactly the bug we're avoiding; the resume.pdf is the canonical recruiter/client-lead distribution artifact."

patterns-established:
  - "Cross-phase test extension via shared manifest constant: tests/home/anti-patterns.test.ts now governs Phase 4 + Phase 5 source-grep invariants; future phases extend by appending to PHASE_SOURCES and (if needed) adding a new it() block — never copy-paste the manifest into a new test file."
  - "Carve-out documentation pattern: when an invariant must exclude an existing exception, use Object.entries(code).filter([rel] => rel !== 'path') with an inline comment explaining the historical reason. Never silently skip; future contributors must see the rationale."
  - "Postbuild lifecycle as build-smoke contract: pnpm postbuild auto-runs after every pnpm build; failing the script fails the deploy. Pairs with deterministic port + IPv4 + SIGTERM cleanup for rerunnability."

requirements-completed: [RES-04]

# Metrics
duration: 8min
completed: 2026-05-17
---

# Phase 5 Plan 05: Phase-Gate Lock Summary

**Cross-phase anti-pattern net (Phase 4 + 5, 24 files × 10 invariants) + active Puppeteer postbuild producing real 240 KB /public/resume.pdf on every pnpm build + VALIDATION sign-off flipped to complete.**

## Performance

- **Duration:** 8 min
- **Started:** 2026-05-17T15:03:37Z (approx — first task commit at 15:04)
- **Completed:** 2026-05-17T15:11:38Z
- **Tasks:** 3
- **Files modified:** 6 (1 created, 5 modified + 1 binary replacement)

## Accomplishments

- **Cross-phase regression net is live:** PHASE_SOURCES manifest now spans 24 files across Phase 4 + Phase 5. 10 source-grep invariants (8 original + 2 new) run in 18ms. Any future Phase 5 regression — banned word, motion import, client-island sprawl, Lucide reach, hand-written /resume.pdf href — fails a single test file.
- **Active Puppeteer pipeline:** scripts/build-resume-pdf.ts is the production script. pnpm build now triggers tsx scripts/build-resume-pdf.ts via the renamed `postbuild` hook, which spawns next start on 127.0.0.1:3057, waits for HTTP readiness, navigates Puppeteer to /resume in print mode, and writes a real PDF to /public/resume.pdf.
- **First real PDF shipped:** 240,502 bytes / 3 pages / %PDF-1.4. Replaces the Wave 0 16-byte stub. Committed to git as the canonical recruiter/client-lead distribution artifact.
- **USER OVERRIDE regression-locked:** Tests 8 + 9 in pdf-build.test.ts assert the strings 'puppeteer-core' and '@sparticuz/chromium' are absent from the script. Any future contributor who reverts to CONTEXT.md's original chromium-min path trips these tests.
- **VALIDATION sign-off attests Nyquist compliance:** status: complete, nyquist_compliant: true, wave_0_complete: true, completed: 2026-05-17. Approval line updated with build-smoke metrics.

## Task Commits

1. **Task 05-05-01: Extend anti-pattern manifest** — `877daba` (test)
   - PHASE4_SOURCES → PHASE_SOURCES (11 → 24 entries)
   - Test 7 footer Mail carve-out; Test 8 ProjectPillRow extension
   - +Test 9 (Phase 5 RSC budget) and +Test 10 (single /resume.pdf href surface)
   - JSDoc updated to reflect Phase 4 + 5 cross-cutting scope
   - 10/10 invariants green (699ms)

2. **Task 05-05-02: Full Puppeteer pipeline + 13 structural tests** — `7d2a596` (feat)
   - scripts/build-resume-pdf.ts: replaced Wave 0 throwing shell with the full Pattern 2 pipeline (puppeteer, wait-on, print mode, preferCSSPageSize, printBackground, SIGTERM cleanup, fail-fast)
   - tests/resume/pdf-build.test.ts: 13 source-grep tests (positive locks Tests 2–7 + 10–13, USER OVERRIDE regression locks Tests 8–9)
   - Auto-added @types/wait-on devDep (Rule 3 — blocking typecheck fix)
   - 13/13 tests green; pnpm typecheck exits 0

3. **Task 05-05-03: Activate postbuild + real PDF + gated artifact test + VALIDATION flip** — `e7829a3` (feat)
   - package.json: renamed `// postbuild` placeholder to active `postbuild` script
   - pnpm build: end-to-end success; postbuild produced 240,502-byte PDF in ~5s
   - tests/resume/pdf-artifact.test.ts: 4 gated tests (3 from RESEARCH § Example 6 + 1 stub-replacement lock)
   - 05-VALIDATION.md: frontmatter flipped to complete + Nyquist-compliant + Wave-0-complete; Approval line updated
   - 4/4 gated tests green with RESUME_PDF_CHECK=1; describe.skipIf works in normal runs

**Plan metadata commit:** (pending — final commit at end of summary creation)

## Files Created/Modified

- `tests/home/anti-patterns.test.ts` — PHASE4_SOURCES renamed to PHASE_SOURCES, 11 → 24 entries (13 Phase 5 additions), +Test 9 RSC budget, +Test 10 /resume.pdf href surface, Test 7 footer carve-out
- `scripts/build-resume-pdf.ts` — full Puppeteer pipeline (105 LOC); spawn next start → wait-on → emulateMediaType('print') → page.pdf(preferCSSPageSize + printBackground) → SIGTERM cleanup → fail-fast exit
- `tests/resume/pdf-build.test.ts` — 13 structural source-grep tests (132 LOC) locking the decision lineage
- `tests/resume/pdf-artifact.test.ts` — 4 gated artifact tests (54 LOC) — gated by RESUME_PDF_CHECK=1 or CI=true
- `package.json` — active `postbuild: tsx scripts/build-resume-pdf.ts` hook; +@types/wait-on devDep
- `public/resume.pdf` — Wave 0 16-byte stub replaced by real 240,502-byte / 3-page PDF
- `.planning/phases/05-about-+-resume-+-contact/05-VALIDATION.md` — frontmatter complete + Nyquist + Wave-0; Approval signed off with metrics

## Decisions Made

- **Test 7 carve-out is a filter, not a skip.** Excluding components/site/footer.tsx via `.filter([rel] => rel !== 'components/site/footer.tsx')` documents the exception inline. A new Lucide import anywhere else still fails the invariant. The alternative (allow-list the existing import via regex) would fail-open on any NEW Mail/icon import in the same file.
- **Single PHASE_SOURCES manifest, not per-phase forks.** Future Phase 6 contributors extend by appending; the 10 invariants run unchanged across the larger surface. The Test 8 cardAndRouteSurfaces subset stays scoped (mirrors Phase 4 pattern); the Test 2 homeSurfaces subset stays scoped (Phase 5 doesn't touch home composition).
- **USER OVERRIDE locked by absent-string assertions.** Tests 8 + 9 in pdf-build.test.ts use `src.includes("'puppeteer-core'")` (not a regex) — robust to whitespace, import-style, and future ESM changes. Any future contributor who pulls in puppeteer-core or @sparticuz/chromium trips a clear test failure citing the override rationale.
- **Gated artifact test with describe.skipIf.** Normal `pnpm vitest run` skips the suite cleanly (no flake on missing artifact); CI and `RESUME_PDF_CHECK=1` runs activate all 4 tests. The Test 4 stub-replacement lock (>1024 bytes) is a stronger floor than the 20 KB band because it catches the specific regression "Wave 0 stub was never overwritten".

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added @types/wait-on devDep to unblock pnpm typecheck**
- **Found during:** Task 05-05-02 (verify step ran `pnpm typecheck` after replacing the script)
- **Issue:** `wait-on` ships without type declarations; tsc reported TS7016 "Could not find a declaration file for module 'wait-on'" on the new `import waitOn from 'wait-on'` line. Plan listed `wait-on@^9` as a runtime dep but did not anticipate the missing type declaration.
- **Fix:** Ran `pnpm add -D @types/wait-on` (added @types/wait-on@^5.3.4 as devDep)
- **Files modified:** package.json, pnpm-lock.yaml
- **Verification:** `pnpm typecheck` exits 0; all 13 pdf-build.test.ts tests still green
- **Committed in:** `7d2a596` (Task 05-05-02 commit — included in the same feat commit as the script)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Necessary correctness fix — typecheck is a hard gate per VALIDATION.md sampling rate. No scope creep; the package was the canonical types stub for the wait-on import the plan required.

## Issues Encountered

- **CSS optimization warnings during `pnpm build`** — Next.js emitted 2 warnings about Unexpected token Delim('.') on selectors like `.bg-\[color\:var\(--color-\.\.\.\)\]` and `.\[color\:var\(--color-\.\.\.\)\]`. These appear in source files containing placeholder example strings like `var(--color-...)` (literal ellipsis, not real CSS). Out of scope for this plan (pre-existing, not introduced by Task work). Logged below in Phase 6 follow-ups; build still succeeded.
- **Pitfall 4 (orphan next start)** — pre-cleared port 3057 with `lsof -ti:3057 | xargs kill -9` before the first build, as a defensive measure. No orphan process actually present; build was clean on first run.

## User Setup Required

None — Puppeteer auto-downloads Chrome to its own cache on first install (already happened during Wave 0). The postbuild script runs locally and on Vercel deploy preview builds; the committed PDF means production serving requires zero runtime dependencies.

## Known Stubs

The following Phase 5 surface area still contains acknowledged placeholders that will be resolved by Olive directly (RES-06 + Open Q 2 + Open Q 3):

- **LinkedIn handle** — `https://linkedin.com/in/olive-elliott` placeholder in:
  - `components/site/footer.tsx` (LINKEDIN_URL)
  - `components/about/contact-stack.tsx`
  - `content/resume.ts`
- **Fathom + Stemz project URLs** — placeholder strings in `content/resume.ts` projects array (Fathom and Stemz entries)
- **Resume layout `noindex`** — RESEARCH § Open Q 6 recommends adding `robots: { index: false }` to /resume metadata if the PDF is the canonical share artifact. Deferred to Phase 6 SEO/audit pass.

These are NOT bugs in the Phase 5 implementation — they're documented Open Questions awaiting external knowledge (Olive's LinkedIn handle, the canonical Fathom/Stemz URLs, the SEO decision). They do not block phase-gate verification because the PDF artifact itself is real and complete; only the in-content links inside it will need a one-line refresh + rerun of `pnpm build` once resolved.

## Phase 5 Requirement Coverage (all 12)

Tracked across all 5 plans in this phase; this final plan only formally closes RES-04. Confirmed by VALIDATION map:

| ID | Description | Validated by | Plan |
|----|-------------|--------------|------|
| ABT-01 | About bio + project pills | tests/about/page.test.tsx | 05-03 |
| ABT-02 | Aktiga section | tests/about/page.test.tsx | 05-03 |
| ABT-03 | Values list | tests/about/page.test.tsx | 05-03 |
| RES-01 | Resume schema + content | tests/resume/schema.test.ts, content.test.ts | 05-01 |
| RES-02 | /resume route + section order | tests/resume/page.test.tsx | 05-02 |
| RES-03 | Print stylesheet | app/resume/resume.css @media print | 05-02 |
| RES-04 | PDF artifact + postbuild | tests/resume/pdf-build.test.ts + pdf-artifact.test.ts (gated) | **05-05 (this plan)** |
| RES-05 | DownloadPdfLink in header + footer | tests/resume/page.test.tsx, tests/site/footer.test.tsx | 05-02, 05-04 |
| RES-06 | LinkedIn/Fathom/Stemz URL pass | manual (Open Q 2 + 3 — Phase 7) | manual |
| CTC-01 | Footer GitHub link | tests/site/footer.test.tsx | 05-04 |
| CTC-02 | Mailto subject (`hi from olivelliott.dev`, %20 not +) | tests/site/footer.test.tsx | 05-04 |
| CTC-03 | ContactStack | tests/about/page.test.tsx (contact-stack subtree) | 05-03 |

## Next Phase Readiness

- Phase 5 fully complete and phase-gate-ready (VALIDATION attests Nyquist compliance)
- Every Phase 5 source file is grep-protected via PHASE_SOURCES; future regressions trip a single test file
- /public/resume.pdf auto-regenerates on every `pnpm build` — Phase 7 content edits + Olive's URL fixes propagate to the artifact with zero manual steps
- Phase 6 SEO/audit follow-ups:
  - Add `robots: { index: false }` to /resume metadata if PDF stays canonical (RESEARCH § Open Q 6)
  - Resolve LinkedIn handle placeholder (Open Q 2)
  - Resolve Fathom + Stemz project URL placeholders (Open Q 3)
  - Investigate the 2 CSS optimization warnings (`var(--color-...)` literal ellipsis selectors — likely a placeholder string in a source file)

## Phase 5 Cumulative Metrics

- **Plans executed:** 6/6 (05-00 Wave 0 + 05-01..05-04 implementation + 05-05 phase-gate)
- **PHASE_SOURCES count:** 11 → 24 files
- **Anti-pattern invariants:** 8 → 10
- **pdf-build.test.ts:** 1 skipped placeholder → 13 structural tests
- **pdf-artifact.test.ts:** 1 skipped placeholder → 4 gated tests
- **scripts/build-resume-pdf.ts:** 33-LOC shell → 105-LOC production pipeline
- **/public/resume.pdf:** 16 bytes (stub) → 240,502 bytes (real, 3 pages)
- **Wave 0 test placeholders implemented in Plan 05-05:** 2 (pdf-build + pdf-artifact); earlier waves implemented the rest

## Self-Check: PASSED

All claims verified against disk + git:

- All 7 files modified/created exist on disk
- All 3 task commit hashes present in git history (`877daba`, `7d2a596`, `e7829a3`)
- /public/resume.pdf is 240,502 bytes, starts with `%PDF-` magic
- VALIDATION frontmatter: `status: complete`, `nyquist_compliant: true`, `wave_0_complete: true`, `completed: 2026-05-17`
- package.json line 12: `"postbuild": "tsx scripts/build-resume-pdf.ts"` (active, no `// ` prefix)

---
*Phase: 05-about-+-resume-+-contact*
*Completed: 2026-05-17*
