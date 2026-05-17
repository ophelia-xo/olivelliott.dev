---
phase: 06-seo,-og,-a11y-&-performance-audit
plan: 05
subsystem: testing
tags: [phase-gate, cleanup, anti-patterns, public-assets, build-smoke, validation-signoff, nyquist]

# Dependency graph
requires:
  - phase: 06-seo,-og,-a11y-&-performance-audit
    provides: "Plan 06-00 (Wave 0 infra), 06-01 (favicons), 06-02 (OG + sitemap + robots), 06-03 (a11y), 06-04 (launch gate + lighthouse deferral)."
  - phase: 04-home-+-projects-index
    provides: "tests/home/anti-patterns.test.ts PHASE_SOURCES manifest pattern — extended verbatim per phase."
provides:
  - "PHASE_SOURCES manifest extended +8 Phase 6 source files (24 → 32 entries): sitemap.ts, robots.ts, lib/og-template.tsx, and the 5 opengraph-image.tsx surfaces. All 11 invariants automatically extend; Test 6 documents OG-card banned-words dedup with launch-gate Test #8."
  - "5 orphaned create-next-app scaffolder SVGs deleted from public/ (file, globe, next, vercel, window — total ~3.3 KB). public/og-default.png and public/resume.pdf preserved."
  - "pnpm build end-to-end proof: exit 0, 2.0s compile time, 5 OG surfaces + sitemap.xml + robots.txt + icon.svg + apple-icon.png all in route table; Phase 5 postbuild PDF regenerated (234.9 KB)."
  - "06-VALIDATION.md flipped to phase-gate complete: status: complete, nyquist_compliant: true, wave_0_complete: true, completed: 2026-05-17; Approval line documents 8 of 9 requirements met (QAL-01 deferred to Phase 7 per Plan 06-04)."
affects: [07-content-pass-and-launch]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "PHASE_SOURCES per-phase extension: append new entries at the bottom of the manifest (never modify prior entries); invariants stay constant; new surfaces inherit all 11 invariants automatically."
    - "Pre-deletion source-grep safety check: before deleting any public/ asset, grep app/+components/+content/+lib/+tests/+root configs for the filename; zero matches = safe; any match = STOP + document."
    - "Build-output churn discipline: Phase 5 postbuild regenerates public/resume.pdf on every pnpm build (Puppeteer output is non-deterministic). After smoke-build, `git checkout -- public/resume.pdf` keeps the working tree clean of unrelated regeneration noise."
    - "Phase-gate sign-off pattern: VALIDATION.md frontmatter flip + Approval line listing requirements met / deferred + supporting evidence (test count, build outcome, anti-pattern coverage)."

key-files:
  created:
    - ".planning/phases/06-seo,-og,-a11y-&-performance-audit/06-05-SUMMARY.md"
  modified:
    - "tests/home/anti-patterns.test.ts (PHASE_SOURCES +8 Phase 6 entries, layout comment updated, Test 6 dedup comment added)"
    - ".planning/phases/06-seo,-og,-a11y-&-performance-audit/06-VALIDATION.md (frontmatter flip + Approval line)"
  deleted:
    - "public/file.svg (391 bytes, create-next-app scaffolder leftover)"
    - "public/globe.svg (1,035 bytes, create-next-app scaffolder leftover)"
    - "public/next.svg (1,375 bytes, create-next-app scaffolder leftover)"
    - "public/vercel.svg (128 bytes, create-next-app scaffolder leftover)"
    - "public/window.svg (385 bytes, create-next-app scaffolder leftover)"

key-decisions:
  - "PHASE_SOURCES section ordering: Phase 6 entries appended at the bottom of the array (after Phase 5), with an `// ── Phase 6: SEO + OG + A11y audit surfaces ──` header comment that mirrors the Phase 4 + 5 section headers. Future Phase 7 contributors append below this section without touching prior entries."
  - "Test 6 banned-words list NOT extended with OG-card additions; dedup comment points to tests/launch-gate/anti-features.test.ts Test #8 instead. Avoids double-maintaining the same banned-word list in two places — launch-gate Test #8 is the single source of truth for OG-card banned phrases (introducing, presenting, the all-new, transform your, supercharge, next-generation, AI-powered, built with love)."
  - "All 5 scaffolder SVGs verified unreferenced before deletion via two grep passes (app/components/content/lib/tests/ first, then broader source-extension grep across the repo). Zero matches confirms safe deletion — no JSDoc mentions, no MDX embeds, no fallback wiring."
  - "public/resume.pdf NOT committed in Task 3 commit even though pnpm build regenerated it. The regeneration is Phase 5 postbuild churn (Puppeteer non-deterministic output bytes), not a Phase 6 deliverable change. Restored to HEAD via `git checkout --` to keep the working tree clean and the Task 3 commit narrowly scoped to the VALIDATION.md flip."
  - "Plan 06-04's CSS warnings (--color-... and --color-NAME unresolved tokens) treated as out-of-scope per execution scope boundary: they are pre-existing Phase 2 placeholder values that flow through Tailwind, not Phase 6 regressions. Will be addressed in Phase 7 content-pass when the placeholder values get replaced with real tokens."

patterns-established:
  - "PHASE_SOURCES manifest extension is additive-only across phases: append new entries, never modify prior; describe block title increments (e.g., 'Phase 4 + 5' → 'Phase 4 + 5 + 6'); layout comment count line increments to match. The 11 invariants extend automatically because they iterate over Object.entries(code), not a hardcoded subset."
  - "Banned-words dedup convention: when the same banned-words list applies to multiple test surfaces (anti-patterns.test.ts vs launch-gate/anti-features.test.ts), pick one as the source of truth and document the other's deferral inline. Test 6 → Test #8 is the established pattern for OG-card additions."
  - "Phase-gate VALIDATION.md frontmatter flip checklist: status, nyquist_compliant, wave_0_complete, completed (add field). Approval line includes the requirements-met/deferred breakdown + supporting evidence rows (test count, build outcome, axe count, anti-pattern coverage)."

requirements-completed: [QAL-02, QAL-03, QAL-04, QAL-05, MTA-01, MTA-02, MTA-03, MTA-04]
# Note: QAL-01 in this plan's frontmatter `requirements` list but DEFERRED per Plan 06-04
# user decision. Stays unchecked in REQUIREMENTS.md; surfaces in Phase 7 launch-week checklist.

# Metrics
duration: 4 min
completed: 2026-05-17
---

# Phase 06 Plan 05: Phase-Gate Sign-Off + Cleanup Summary

**PHASE_SOURCES manifest extended +8 Phase 6 entries (24 → 32 source files × 11 invariants), 5 orphaned create-next-app scaffolder SVGs deleted from `public/`, `pnpm build` smoke proves all Phase 6 surfaces compile (5 OG routes + sitemap.xml + robots.txt + favicon set), and 06-VALIDATION.md flipped to phase-gate complete (8 of 9 requirements met; QAL-01 Lighthouse deferred to Phase 7 launch-week).**

## Performance

- **Duration:** ~4 min
- **Started:** 2026-05-17T18:45:00Z
- **Completed:** 2026-05-17T22:48:38Z (wall-clock includes Bash timeout window; actual hands-on ~4 min)
- **Tasks:** 3
- **Files modified:** 7 (1 modified, 5 deleted, 1 modified + 1 created)

## Accomplishments

- **PHASE_SOURCES manifest +8 entries.** The Phase 4 + 5 anti-pattern regression net (`tests/home/anti-patterns.test.ts`) now covers the 8 Phase 6 source files: `app/sitemap.ts`, `app/robots.ts`, `lib/og-template.tsx`, `app/opengraph-image.tsx`, and the 4 per-route + dynamic-slug opengraph-image.tsx surfaces. All 11 invariants extend automatically — Phase 6 sources are RSC-clean (no `'use client'`, no `motion.*`, no banned words, no `motion/react` imports). Test 6 (banned words) carries an inline comment documenting the OG-card additions deferral to launch-gate Test #8.
- **5 orphaned SVGs deleted from `public/`.** `public/{file,globe,next,vercel,window}.svg` (~3.3 KB total) were create-next-app scaffolder leftovers with zero source references anywhere in `app/components/content/lib/tests/` or any other source extension across the repo. Verified via two grep passes before deletion. Real assets preserved: `public/og-default.png` (Phase 3 OG fallback) + `public/resume.pdf` (Phase 5 build output). Visitors no longer get a stale Next.js logo at e.g. `https://olivelliott.dev/next.svg`.
- **`pnpm build` end-to-end success.** Compiled in 2.0s; route table confirms all Phase 6 surfaces wired:
  - `○ /opengraph-image` (root default)
  - `○ /about/opengraph-image-1ycygp` (per-route)
  - `○ /projects/opengraph-image-cpktv7` (per-route)
  - `○ /resume/opengraph-image` (per-route)
  - `● /projects/[slug]/opengraph-image-umay0l/[__metadata_id__]` (dynamic per-project)
  - `○ /sitemap.xml`, `○ /robots.txt` (route handlers)
  - `○ /icon.svg`, `○ /apple-icon.png` (favicon set, auto-wired)
  - Phase 5 postbuild ran cleanly: regenerated `public/resume.pdf` (234.9 KB)
- **06-VALIDATION.md phase-gate sign-off.** Frontmatter flipped: `status: draft → complete`, `nyquist_compliant: false → true`, `wave_0_complete: false → true`, added `completed: 2026-05-17`. Approval line documents 8 of 9 requirements met (MTA-01..04 + QAL-02..05) and the deferred QAL-01 with pointer to Plan 06-04's `lighthouse-report.md` for owner + acceptance criteria.
- **Full test suite green:** 513 passed / 4 skipped (4 pre-existing Phase 2/3 placeholders unrelated to Phase 6; zero Phase 6 skipped) across 66 test files. `pnpm typecheck` exits 0.

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend PHASE_SOURCES manifest with 8 Phase 6 surfaces** — `feccf17` (test)
2. **Task 2: Delete 5 orphaned create-next-app scaffolder SVGs** — `2256c64` (chore)
3. **Task 3: pnpm build smoke + flip 06-VALIDATION.md to phase-gate complete** — `ec78c36` (docs)

**Plan metadata commit:** pending (will include SUMMARY.md, STATE.md, ROADMAP.md)

## Files Created/Modified

### Modified (2)
- `tests/home/anti-patterns.test.ts` — PHASE_SOURCES +8 Phase 6 entries; layout-comment count line updated (`-  8 Phase 6 entries...`); Test 6 inline dedup comment added.
- `.planning/phases/06-seo,-og,-a11y-&-performance-audit/06-VALIDATION.md` — frontmatter flip (status/nyquist_compliant/wave_0_complete/completed) + Approval line populated with 8-of-9 requirements summary and supporting evidence.

### Deleted (5)
- `public/file.svg` — 391 bytes, create-next-app default
- `public/globe.svg` — 1,035 bytes, create-next-app default
- `public/next.svg` — 1,375 bytes, create-next-app default Next.js logo
- `public/vercel.svg` — 128 bytes, create-next-app default Vercel logo
- `public/window.svg` — 385 bytes, create-next-app default

### Created (1)
- `.planning/phases/06-seo,-og,-a11y-&-performance-audit/06-05-SUMMARY.md` (this file)

## Bytes Recovered

| File | Bytes |
|------|-------|
| public/file.svg | 391 |
| public/globe.svg | 1,035 |
| public/next.svg | 1,375 |
| public/vercel.svg | 128 |
| public/window.svg | 385 |
| **Total** | **3,314** (~3.3 KB) |

Modest deployed-asset shrinkage; the dominant win is removing the visitor-visible scaffolder leftovers from the public root.

## 06-VALIDATION.md Frontmatter Diff

**Before (Wave 0):**
```yaml
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-17
```

**After (phase-gate complete):**
```yaml
status: complete
nyquist_compliant: true
wave_0_complete: true
created: 2026-05-17
completed: 2026-05-17
```

**Approval line before:** `**Approval:** pending`

**Approval line after:** 7-line block documenting 8-of-9 requirements met (MTA-01..04 + QAL-02..05), QAL-01 deferral to Phase 7, and 6 supporting-evidence rows (test count, lighthouse infra-ready status, launch-gate test count, axe coverage, anti-pattern net size, build outcome).

## pnpm build Route Table Fingerprint

```
Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /about
├ ○ /about/opengraph-image-1ycygp
├ ○ /apple-icon.png
├ ○ /icon.svg
├ ○ /opengraph-image
├ ƒ /projects
├ ● /projects/[slug]
│ └ /projects/myco
├ ● /projects/[slug]/opengraph-image-umay0l/[__metadata_id__]
├ ○ /projects/opengraph-image-cpktv7
├ ○ /resume
├ ○ /resume/opengraph-image
├ ○ /robots.txt
└ ○ /sitemap.xml
```

All 8 Phase 6 source files manifest as Next 16 route entries (5 OG + sitemap + robots + favicon SVG; apple-icon.png + favicon.ico from Plan 06-01 also present). Build exit code 0. Phase 5 postbuild PDF regenerated successfully.

## Phase 6 Cumulative Metrics

| Plan | Duration | Tasks | Files Modified | Key Outcome |
|------|----------|-------|----------------|-------------|
| 06-00 | 3 min | 3 | 19 (15 created, 4 modified) | Wave 0 infra — vitest-axe + lighthouserc + 12 placeholders |
| 06-01 | 2 min | 3 | 4 (2 created, 2 modified incl. favicon.ico OVERWRITE) | Favicon set (MTA-04) — icon.svg + apple-icon.png + favicon.ico |
| 06-02 | 6 min | 4 | 23 (9 created, 14 modified) | OG + sitemap + robots + metadata audit (MTA-01..03) + Pitfall 4 cleanup |
| 06-03 | 11 min | 3 | 19 (6 a11y tests + 5 production a11y fixes + 7 test contract updates + Test 11) | A11y verification surface (QAL-02..04) + 3 real production a11y bug fixes |
| 06-04 | 5 min | 2 | 2 | 19-item launch gate (QAL-05) + Lighthouse deferral (QAL-01 → Phase 7) |
| **06-05** | **4 min** | **3** | **7** (1 modified, 5 deleted, 1 modified + this SUMMARY) | **Phase-gate sign-off + cleanup** |
| **Total** | **31 min** | **18** | **74** | **Phase 6 launch-gate complete** |

### Phase 6 Test Surface Growth

| Stage | Test Files | Tests Passing | Tests Skipped |
|-------|------------|---------------|---------------|
| Pre-Phase 6 (baseline) | 54 | 457 | 4 |
| Post-06-00 (placeholders) | 66 | 457 | 16 |
| Post-06-01 (favicon) | 66 | 464 | 15 |
| Post-06-02 (OG + sitemap + robots + metadata + 4 obsolete-test flips) | 66 | 485 | 11 |
| Post-06-03 (a11y + keyboard + Test 11) | 66 | 494 | 5 |
| Post-06-04 (launch gate) | 66 | 513 | 4 |
| **Post-06-05 (final)** | **66** | **513** | **4** |

The 4 remaining skipped tests are pre-existing Phase 2/3 placeholders, NOT Phase 6 placeholders — every Phase 6 Wave 0 placeholder has been consumed by its implementing plan.

### Phase 6 Requirements Coverage

| Req | Description | Status | Closed By |
|-----|-------------|--------|-----------|
| MTA-01 | Per-route metadata audit | ✅ Met | 06-02 (tests/seo/metadata.test.ts) |
| MTA-02 | OG images per route | ✅ Met | 06-02 (6 OG surfaces + lib/og-template.tsx) |
| MTA-03 | sitemap + robots | ✅ Met | 06-02 (app/sitemap.ts + app/robots.ts) |
| MTA-04 | Favicon set | ✅ Met | 06-01 (icon.svg + apple-icon.png + favicon.ico) |
| QAL-01 | Lighthouse ≥ 90 on / + /projects/myco | ⏭ DEFERRED | 06-04 (lighthouse-report.md) — to Phase 7 launch-week |
| QAL-02 | vitest-axe clean on 5 routes | ✅ Met | 06-03 (tests/a11y/*.test.tsx) |
| QAL-03 | Keyboard reachability | ✅ Met | 06-03 (tests/a11y/keyboard.test.tsx) |
| QAL-04 | Reduced-motion source-grep | ✅ Met | 06-03 (Test 11 in tests/home/anti-patterns.test.ts) |
| QAL-05 | 19-item anti-features launch gate | ✅ Met | 06-04 (tests/launch-gate/anti-features.test.ts) |

**8 of 9 met; 1 formally deferred with documented owner + acceptance criteria. Phase gate signed.**

## Decisions Made

1. **PHASE_SOURCES section ordering — append-at-bottom.** Phase 6 entries appended after the Phase 5 section with a section-header comment matching Phase 4 + 5 style. Future Phase 7 contributors continue the pattern; prior entries never get touched.
2. **Test 6 banned-words NOT extended with OG-card additions; defer to launch-gate Test #8.** Single source of truth avoids double-maintaining the same regex in two test files. Inline comment above Test 6 declaration documents the deferral pointer so any future contributor extending the banned-words list updates the correct location.
3. **Two-pass grep before SVG deletion.** First pass: `grep -rE "(file|globe|next|vercel|window)\.svg" app/ components/ content/ lib/ tests/` (zero matches). Second pass: broader `grep --include=*.{tsx,ts,js,mjs,json,html,css,mdx}` across the entire repo excluding `node_modules/.git/.next/` (zero matches). Both clean = safe to delete.
4. **public/resume.pdf NOT committed in Task 3 even though pnpm build regenerated it.** The byte-level regeneration is Phase 5 postbuild Puppeteer non-determinism, not a Phase 6 deliverable change. `git checkout -- public/resume.pdf` restored to HEAD; Task 3 commit stays narrowly scoped to the VALIDATION.md flip.
5. **Pre-existing CSS warnings out-of-scope.** `--color-...` and `--color-NAME` unresolved-token warnings during pnpm build are Phase 2 placeholder values that flow through Tailwind. Per execution-protocol scope boundary, these are not Phase 6 regressions and will be addressed in Phase 7 content-pass when the placeholders get replaced with real tokens.

## Deviations from Plan

None — plan executed exactly as written.

The three tasks landed in order with all verification gates green on first run. No deviation rules triggered:
- Rule 1 (auto-fix bugs): nothing broken
- Rule 2 (missing critical functionality): nothing missing
- Rule 3 (blocking issues): nothing blocked
- Rule 4 (architectural decisions): nothing structural

The `pnpm build` CSS warnings were noted but explicitly out-of-scope (pre-existing Phase 2 placeholder tokens, not Phase 6 regressions).

## Issues Encountered

None.

## Verification Evidence

| Check | Expected | Actual | Result |
|-------|----------|--------|--------|
| `tests/home/anti-patterns.test.ts` PHASE_SOURCES entry count | 32 | 32 (was 24, +8 Phase 6) | PASS |
| `tests/home/anti-patterns.test.ts` Test 1-11 | all passing | 11 passed | PASS |
| `public/file.svg` | absent | absent | PASS |
| `public/globe.svg` | absent | absent | PASS |
| `public/next.svg` | absent | absent | PASS |
| `public/vercel.svg` | absent | absent | PASS |
| `public/window.svg` | absent | absent | PASS |
| `public/og-default.png` | present | present (16,696 bytes) | PASS |
| `public/resume.pdf` | present | present (240,502 bytes — HEAD-committed version after build-output restore) | PASS |
| `grep -rE "(file\|globe\|next\|vercel\|window)\.svg" app/ components/ content/ lib/ tests/` | zero matches | zero matches | PASS |
| `pnpm build` | exit 0 | exit 0 (compiled in 2.0s) | PASS |
| Build route table contains `/opengraph-image` | yes | yes | PASS |
| Build route table contains `/about/opengraph-image-*` | yes | yes | PASS |
| Build route table contains `/projects/opengraph-image-*` | yes | yes | PASS |
| Build route table contains `/resume/opengraph-image` | yes | yes | PASS |
| Build route table contains `/projects/[slug]/opengraph-image-*/[__metadata_id__]` | yes | yes | PASS |
| Build route table contains `/sitemap.xml` | yes | yes | PASS |
| Build route table contains `/robots.txt` | yes | yes | PASS |
| Build route table contains `/icon.svg` | yes | yes | PASS |
| Build route table contains `/apple-icon.png` | yes | yes | PASS |
| Phase 5 postbuild PDF generation | success | wrote 234.9 KB to public/resume.pdf | PASS |
| `06-VALIDATION.md` `status: complete` | yes | yes | PASS |
| `06-VALIDATION.md` `nyquist_compliant: true` | yes | yes | PASS |
| `06-VALIDATION.md` `wave_0_complete: true` | yes | yes | PASS |
| `06-VALIDATION.md` `completed: 2026-05-17` | yes | yes | PASS |
| `06-VALIDATION.md` Approval line documents 9 requirements + supporting evidence | yes | yes | PASS |
| `pnpm vitest run` full suite | green | 513 passed, 4 skipped, 0 failed across 66 files | PASS |
| `pnpm typecheck` | exit 0 | exit 0 | PASS |

## Known Stubs

None. Phase 6 is the audit phase — no stub values were introduced. The 4 remaining skipped tests in the suite are pre-existing Phase 2/3 placeholders (out of Phase 6 scope) that the QAL-04 reduced-motion lock + 19-item anti-features launch gate already cover via source-grep.

## User Setup Required

None for this plan. The one outstanding human-verification item is **QAL-01 Lighthouse run**, deferred to Phase 7 launch-week per Plan 06-04. See `.planning/phases/06-seo,-og,-a11y-&-performance-audit/lighthouse-report.md` for:
- Owner: Olive
- Acceptance criteria: 8 cells (4 categories × 2 routes) all ≥ 0.90
- Run command: `pnpm build && pnpm start` then `pnpm lhci` against `/` + `/projects/myco`
- Likely gap-closure surfaces if any axis < 90: hero image priority/sizes, font-display strategy, motion island bundle size

## Phase 7 Readiness

**Phase 6 is closed. Phase 7 (content pass + launch) is unblocked.**

Phase 7 inherits:

- **Launch-gate test suite** (19 anti-features + 6 axe routes + keyboard + QAL-04 reduced-motion + 32-file PHASE_SOURCES net × 11 invariants + 4 SEO test files) running on every `pnpm vitest run`. Any Phase 7 contributor adding an AI-template anti-pattern, regressing accessibility, breaking an SEO contract, or adding a motion island without `useReducedMotion()` trips a named test with an actionable failure message.
- **Lighthouse infrastructure fully wired** — `lighthouserc.json` + `pnpm lhci` script + Puppeteer Chromium installed. Phase 7 launch-week runs the audit interactively, fills `lighthouse-report.md` score cells, and ticks QAL-01 in REQUIREMENTS.md.
- **Auto-extending content surfaces** — `app/sitemap.ts` and `app/(site)/projects/[slug]/opengraph-image.tsx` both consume `getAll()` / `getProject()`. Phase 7 lands real MDX for Fathom, Agenda Keeper, etc. and both surfaces extend automatically with zero Phase 6 changes.
- **Public asset surface cleaned** — no scaffolder leftovers visible at `https://olivelliott.dev/next.svg` etc. Only intentional assets ship.

Phase 7 launch-week checklist owns:
1. Real MDX content for the remaining hero/secondary projects (currently only Myco has real content).
2. `pnpm lhci` run + fill `lighthouse-report.md` + tick QAL-01.
3. Manual visual walkthrough (keyboard, reduced-motion OS setting, anti-features visual sweep).
4. Vercel subdomain deploy on `main` push.

---

## Self-Check: PASSED

Verified after writing this summary:

- **Files exist on disk:**
  - `tests/home/anti-patterns.test.ts` — FOUND (Task 1 modified, includes Phase 6 section)
  - `.planning/phases/06-seo,-og,-a11y-&-performance-audit/06-VALIDATION.md` — FOUND (Task 3 modified, frontmatter complete)
  - `.planning/phases/06-seo,-og,-a11y-&-performance-audit/06-05-SUMMARY.md` — FOUND (this file)
- **Files deleted from disk:**
  - `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg` — all absent
- **Files preserved on disk:**
  - `public/og-default.png` — FOUND
  - `public/resume.pdf` — FOUND
- **Commits exist in git log:** `feccf17` (Task 1), `2256c64` (Task 2), `ec78c36` (Task 3) all verified

---
*Phase: 06-seo,-og,-a11y-&-performance-audit*
*Completed: 2026-05-17*
