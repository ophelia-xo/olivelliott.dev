---
phase: 05-about-+-resume-+-contact
plan: 00
subsystem: infra
tags: [puppeteer, wait-on, tsx, pdf, scaffolding, vitest, placeholders]

requires:
  - phase: 04-home-+-projects-index
    provides: established test-suite layout (tests/home/anti-patterns.test.ts source-grep convention)
  - phase: 03-project-detail-template
    provides: scripts/ directory precedent (scripts/generate-og-default.ts one-shot Node script pattern)
provides:
  - puppeteer@25.0.2 + wait-on@9.0.10 + tsx@4.22.1 as devDependencies
  - /public/resume.pdf 15-byte stub so download link never 404s during waves 1-4
  - scripts/build-resume-pdf.ts shell (exports callable async main; throws Wave-0-shell error)
  - package.json "// postbuild" placeholder key (Wave 4 renames to "postbuild" to activate)
  - 16 Wave-0 test scaffolds across tests/resume/, tests/about/, tests/site/ (each one describe + one it.skip)
affects:
  - 05-01-PLAN.md (fills tests/resume/schema.test.ts + tests/resume/content.test.ts)
  - 05-02-PLAN.md (fills 6 tests/resume/ component + print-css placeholders)
  - 05-03-PLAN.md (fills 5 tests/about/ placeholders)
  - 05-04-PLAN.md (fills tests/site/footer.test.tsx + adds DownloadPdfLink to footer)
  - 05-05-PLAN.md (fills scripts/build-resume-pdf.ts body, renames "// postbuild" → "postbuild", fills 2 tests/resume/pdf-*.test.ts files, replaces stub PDF with real artifact)

tech-stack:
  added:
    - puppeteer@25.0.2
    - wait-on@9.0.10
    - tsx@4.22.1
  patterns:
    - "Wave-0 test placeholder convention: each downstream-plan test file is created up front with `describe + it.skip('placeholder — implemented by Plan {NN}', () => {})`, so the Vitest suite reports the gap as a skipped test rather than missing-file silence. Mirrors the file-to-plan mapping in PLAN.md's task 4 table; downstream plans extend each file in place."
    - "Commented postbuild hook via JSON sibling key: `\"// postbuild\": \"<command> (uncomment in Plan XX)\"` is valid JSON, runs nothing, and acts as a self-documenting breadcrumb. Wave 4 simply renames the key to activate. Avoids the trap of activating a still-throwing script body before the real implementation lands."
    - "Script shell pattern: callable named export `main()` + direct-invocation guard `if (import.meta.url === \\`file://${process.argv[1]}\\`)`. Lets tests import `{ main }` without triggering execution while still letting tsx run the file standalone."

key-files:
  created:
    - scripts/build-resume-pdf.ts
    - public/resume.pdf
    - tests/resume/schema.test.ts
    - tests/resume/content.test.ts
    - tests/resume/resume-page.test.tsx
    - tests/resume/resume-header.test.tsx
    - tests/resume/resume-section.test.tsx
    - tests/resume/resume-entry.test.tsx
    - tests/resume/download-pdf-link.test.tsx
    - tests/resume/print-css.test.ts
    - tests/resume/pdf-build.test.ts
    - tests/resume/pdf-artifact.test.ts
    - tests/about/about-page.test.tsx
    - tests/about/about-bio.test.tsx
    - tests/about/project-pill-row.test.tsx
    - tests/about/contact-stack.test.tsx
    - tests/about/values-list.test.tsx
    - tests/site/footer.test.tsx
  modified:
    - package.json
    - pnpm-lock.yaml

key-decisions:
  - "Installed full puppeteer@25.0.2 (NOT puppeteer-core + @sparticuz/chromium-min) per user override of CONTEXT.md. Rationale: PDF is committed to git so production Vercel builds never invoke the script — the serverless 250MB Lambda limit is irrelevant. Full puppeteer auto-downloaded Chrome 148.0.7778.167 to ~/.cache/puppeteer with zero config."
  - "Stub PDF size landed at 15 bytes (not 16 as PLAN.md textually claimed) — the printf '%%PDF-1.7\\n%%%%EOF\\n' invocation produces exactly 15 bytes (%PDF-1.7 = 8, \\n = 1, %%EOF = 5, \\n = 1). Acceptance criterion is '≤ 32 bytes', so 15 passes. PLAN's '16 bytes' figure was off-by-one; the printf command itself was correct."
  - "package.json postbuild hook activated via JSON sibling-key trick: `\"// postbuild\": \"tsx scripts/build-resume-pdf.ts (uncomment in Plan 05-05 Wave 4)\"`. Plan 05-05 simply renames the key to `\"postbuild\"`. Avoids the trap of `pnpm build` triggering a still-throwing script body."

patterns-established:
  - "Wave-0 placeholder pattern: every downstream test file gets a one-line describe + one-line it.skip referencing its implementing plan. Vitest collects 16 skipped tests in the suite output — gap is visible but doesn't fail CI. Pattern is reusable for any future multi-wave phase."
  - "Script shell pattern: callable named export + direct-invocation guard. Lets tests import the export at any wave, while the script remains runnable standalone via tsx."
  - "Commented JSON config key pattern (// prefix): used here for postbuild but applies anywhere a config block needs a breadcrumb without activating behavior."

requirements-completed: [RES-04]

duration: 4min
completed: 2026-05-17
---

# Phase 05 Plan 00: Wave 0 Infrastructure Scaffold Summary

**puppeteer@25 + wait-on@9 + tsx@4 installed as devDeps; 15-byte stub /public/resume.pdf, scripts/build-resume-pdf.ts shell with callable `main`, "// postbuild" placeholder key in package.json, and 16 Vitest placeholders across tests/resume/, tests/about/, tests/site/ — every downstream Phase 5 wave can now assume its test file exists, the stub PDF exists, and the dep tree resolves.**

## Performance

- **Duration:** 4 min
- **Started:** 2026-05-17T14:20:14Z
- **Completed:** 2026-05-17T14:24:42Z
- **Tasks:** 4
- **Files modified:** 18 (16 created tests + scripts/build-resume-pdf.ts + public/resume.pdf + package.json + pnpm-lock.yaml)

## Accomplishments

- Installed `puppeteer@25.0.2` (full, not puppeteer-core), `wait-on@9.0.10`, `tsx@4.22.1` as devDependencies. Puppeteer's postinstall auto-downloaded Chrome 148.0.7778.167 to `~/.cache/puppeteer/chrome/mac_arm-148.0.7778.167` without intervention — no Pitfall 6 network block hit.
- Wrote 15-byte stub `/public/resume.pdf` (`%PDF-1.7\n%%EOF\n`) so the future download link never 404s while waves 1–4 land. File is tracked in git; no `.gitignore` exclusion blocks it.
- Created `scripts/build-resume-pdf.ts` Wave-0 shell with callable `export async function main()` that throws a Wave-0-shell marker error, plus direct-invocation guard so tsx can run it standalone while tests can `import { main }` without executing.
- Added `"// postbuild": "tsx scripts/build-resume-pdf.ts (uncomment in Plan 05-05 Wave 4)"` placeholder key to `package.json` scripts — valid JSON, runs nothing, breadcrumb for Wave 4 activation.
- Scaffolded 16 Wave-0 test files across `tests/resume/` (10), `tests/about/` (5), and `tests/site/footer.test.tsx` (1). Each file holds one `describe` + one `it.skip` referencing its implementing plan. Vitest now reports 16 skipped tests in suite output.

## Task Commits

Each task was committed atomically:

1. **Task 05-00-01: Install puppeteer + wait-on + tsx devDependencies** — `002219b` (chore)
2. **Task 05-00-02: Stub /public/resume.pdf so the download link never 404s** — `c622aa0` (chore)
3. **Task 05-00-03: Scaffold scripts/build-resume-pdf.ts shell + commented postbuild hook** — `6de6d8e` (chore)
4. **Task 05-00-04: Scaffold all 16 Wave-0 test placeholder files** — `e200cf4` (test)

**Plan metadata:** TBD (final docs commit follows SUMMARY.md write)

## Files Created/Modified

### Created (18)

- `scripts/build-resume-pdf.ts` — Wave-0 shell, exports `main()` that throws, direct-invocation guard for tsx. Decision lineage captured in header JSDoc.
- `public/resume.pdf` — 15-byte stub (`%PDF-1.7\n%%EOF\n`), tracked in git.
- `tests/resume/schema.test.ts` — Plan 05-01 placeholder (RES-01).
- `tests/resume/content.test.ts` — Plan 05-01 placeholder (RES-01, RES-06).
- `tests/resume/resume-page.test.tsx` — Plan 05-02 placeholder (RES-02).
- `tests/resume/resume-header.test.tsx` — Plan 05-02 placeholder (RES-02, RES-05).
- `tests/resume/resume-section.test.tsx` — Plan 05-02 placeholder (RES-02).
- `tests/resume/resume-entry.test.tsx` — Plan 05-02 placeholder (RES-02).
- `tests/resume/download-pdf-link.test.tsx` — Plan 05-02 placeholder (RES-05).
- `tests/resume/print-css.test.ts` — Plan 05-02 placeholder (RES-03, Pitfall 8).
- `tests/resume/pdf-build.test.ts` — Plan 05-05 placeholder (RES-04).
- `tests/resume/pdf-artifact.test.ts` — Plan 05-05 placeholder (RES-04, gated on RESUME_PDF_CHECK=1 or CI=true).
- `tests/about/about-page.test.tsx` — Plan 05-03 placeholder (ABT-01, ABT-02, ABT-03, CTC-03).
- `tests/about/about-bio.test.tsx` — Plan 05-03 placeholder (ABT-01, ABT-02).
- `tests/about/project-pill-row.test.tsx` — Plan 05-03 placeholder (ABT-01).
- `tests/about/contact-stack.test.tsx` — Plan 05-03 placeholder (CTC-02, CTC-03).
- `tests/about/values-list.test.tsx` — Plan 05-03 placeholder (ABT-03).
- `tests/site/footer.test.tsx` — Plan 05-04 placeholder (CTC-01, CTC-02, RES-05).

### Modified (2)

- `package.json` — added 3 devDependencies (puppeteer, wait-on, tsx) + `"// postbuild"` placeholder key.
- `pnpm-lock.yaml` — 946 insertions, 12 deletions reflecting puppeteer + wait-on + tsx + 75 transitives.

## Decisions Made

1. **Full puppeteer over puppeteer-core + chromium-min (user override).** PDF is committed to git → production deploys never run the script → serverless 250MB limit is irrelevant. Full `puppeteer@25.0.2` auto-downloads Chrome with zero config on developer machines. Override held: `pnpm ls` shows no puppeteer-core or @sparticuz/chromium-min.
2. **Stub PDF at 15 bytes, not 16.** PLAN.md's `must_haves.artifacts` block claimed 16 bytes, but the literal printf command produces 15. The plan's acceptance criterion (`≤ 32 bytes`) was satisfied; the count-of-bytes prose was off by one. Recorded for future plan-text accuracy.
3. **Commented postbuild hook via JSON sibling key (`"// postbuild"`).** JSON has no comment syntax — a prefixed key is the cleanest breadcrumb that (a) survives JSON validators, (b) ships zero behavior change, (c) gives Wave 4 a single rename to activate. Avoids the trap of `pnpm build` triggering a still-throwing script.
4. **Script shell uses named `main` export + `import.meta.url === file://${process.argv[1]}` guard.** Both shapes are exercised: tests will `import { main }` without execution (Plan 05-05 test 9 will assert structure), tsx will invoke `main()` on direct run. Pattern reusable for any future build-step script in this repo.

## Deviations from Plan

None — plan executed exactly as written.

(One minor textual discrepancy noted, not a deviation: PLAN.md's `must_haves.artifacts.contains` said "16-byte stub PDF" but the `printf '%%PDF-1.7\n%%%%EOF\n'` command produces 15 bytes. The acceptance criterion `≤ 32 bytes` was met; no auto-fix needed.)

## Issues Encountered

None. Puppeteer's Chrome postinstall download succeeded on first attempt (no Pitfall 6 fallback to `PUPPETEER_SKIP_DOWNLOAD=true` was required).

## User Setup Required

None — Phase 5 Wave 0 is pure scaffolding. No external services, no env vars, no dashboard configuration.

## Verification Results

```
=== Dependency resolution ===
devDependencies:
  puppeteer 25.0.2
  tsx 4.22.1
  wait-on 9.0.10

=== Stub PDF ===
exists; first 5 bytes = %PDF-; size = 15 bytes (≤ 32)

=== Script shell ===
scripts/build-resume-pdf.ts exists; exports `main()` confirmed

=== postbuild key ===
"// postbuild" placeholder present; live "postbuild" NOT present

=== Test placeholders ===
16 files (tests/resume/*.test.* + tests/about/*.test.* + tests/site/footer.test.tsx)

=== Vitest ===
Test Files  38 passed | 16 skipped (54)
Tests       301 passed | 16 skipped (317)

=== Typecheck ===
tsc --noEmit → exit 0

=== Build ===
pnpm build → ✓ Compiled successfully in 2.0s (postbuild NOT triggered)
```

## Next Phase Readiness

- **Plan 05-01 (Wave 1: Resume Schema + Content) is unblocked.** `tests/resume/schema.test.ts` and `tests/resume/content.test.ts` exist as placeholders; Plan 05-01 extends them with real assertions and ships `lib/schemas.ts` ResumeSchema + `content/resume.ts` RESUME const.
- **Plan 05-02 (Wave 2: Resume route + components + print CSS)** has 6 placeholders already in place (resume-page, resume-header, resume-section, resume-entry, download-pdf-link, print-css).
- **Plan 05-03 (Wave 2: About page)** has 5 placeholders already in place (about-page, about-bio, project-pill-row, contact-stack, values-list).
- **Plan 05-04 (Wave 3: Footer audit + DownloadPdfLink)** has `tests/site/footer.test.tsx` placeholder in place.
- **Plan 05-05 (Wave 4: Puppeteer pipeline activation)** has `tests/resume/pdf-build.test.ts` + `tests/resume/pdf-artifact.test.ts` placeholders in place; Wave 4 must (a) replace the `scripts/build-resume-pdf.ts` shell body, (b) rename `"// postbuild"` → `"postbuild"` in `package.json`, and (c) overwrite `/public/resume.pdf` (the 15-byte stub) with the generated PDF.

### Notes for Plan 05-05 (Wave 4)

- The 15-byte stub PDF's size will be visible in git history when the real PDF lands — useful sanity check that the postbuild ran.
- Chrome 148.0.7778.167 is already cached at `~/.cache/puppeteer/chrome/mac_arm-148.0.7778.167` on this machine; no first-run download cost on dev box.
- `pnpm typecheck` is clean against the current shell body — `await import('puppeteer')` and `import waitOn from 'wait-on'` in Wave 4 should not introduce new TS errors because `@types/wait-on` is not bundled; either install `@types/wait-on` or use `// @ts-expect-error` per RESEARCH § Pitfall 5.

## Self-Check: PASSED

All 19 claimed files (18 implementation + SUMMARY.md) verified present on disk.
All 4 task commits verified present in git log (002219b, c622aa0, 6de6d8e, e200cf4).

---
*Phase: 05-about-+-resume-+-contact*
*Plan: 00*
*Completed: 2026-05-17*
