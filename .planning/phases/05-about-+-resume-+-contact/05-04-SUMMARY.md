---
phase: 05-about-+-resume-+-contact
plan: 04
subsystem: footer
tags: [footer, rsc, canonicalization, download-pdf-link, ctc-01, ctc-02, ctc-03, res-05, pitfall-5, pitfall-7, tdd, wave-3]

requires:
  - phase: 05-about-+-resume-+-contact
    plan: 02
    provides: components/resume/download-pdf-link.tsx — RSC, optional className merged via cn() (the cross-surface contract proven on /resume; this plan adds the second surface)
  - phase: 01-foundation
    provides: components/site/footer.tsx (Phase 1 baseline — copyright + 3 icon row + view-source link); brand-icons.tsx (GithubIcon, LinkedinIcon); lucide-react Mail icon
provides:
  - components/site/footer.tsx — Phase 5 footer with canonical github handle, CTC-02 mailto subject, DownloadPdfLink + interpunct + view-source in the right slot
  - tests/site/footer.test.tsx — 17-test regression lock (URL corrections, DownloadPdfLink insertion, Phase 1 features intact, source-grep guards)
affects:
  - Every (site)/ route — footer is rendered by app/(site)/layout.tsx so the canonical handle + DownloadPdfLink propagate to /, /projects, /projects/*, /about
  - 05-05-PLAN.md (Wave 4 anti-pattern manifest extension SHOULD include components/site/footer.tsx in PHASE_SOURCES — same banned-words / no-motion / no-Lucide-beyond-existing-Mail-icon locks apply)
  - Phase 7 LinkedIn handle confirmation — same placeholder lives in both /about ContactStack and footer; both surfaces should flip atomically

tech-stack:
  added: []
  patterns:
    - "Source-grep comment-strip pattern reused verbatim from Plan 04-02 (tests/home/anti-patterns.test.ts): /\\*[\\s\\S]*?\\*\\//g then split('\\n').map(line => line.replace(/\\/\\/.*$/, '')).join('\\n'). Required so the new Phase 5 JSDoc breadcrumb (which intentionally names 'ophelia-x' historically and quotes 'use client' as the Pitfall 7 lock) does not false-positive against Tests 14 + 15."
    - "Three independent locks on the CTC-02 mailto subject: positive grep (Test 17 — exact %20 literal exists), negative grep on the Phase 1 string (Test 16 — 'subject=olivelliott.dev' MUST NOT appear), and runtime assertion on the rendered href (Test 3). Any single edit dropping or mangling the subject fails at least two tests."
    - "DownloadPdfLink cross-surface composition proven: /resume usage (Plan 05-02 — plain <DownloadPdfLink />) + footer usage (Plan 05-04 — plain <DownloadPdfLink />, no extra className needed because the flex parent handles layout). The optional className prop is the escape hatch reserved for future placements with non-flex layout demands."

key-files:
  created: []
  modified:
    - components/site/footer.tsx
    - tests/site/footer.test.tsx

key-decisions:
  - "Footer right slot composition uses plain <DownloadPdfLink /> with NO className override. The footer right slot is already a flex container (gap-4 sm:gap-6); DownloadPdfLink's built-in p-3 + inline-flex behavior aligns with the icon row's vertical centering without extra layout classes. Plan 05-02 anticipated this would need 'extra layout classes for the inline-with-view-source rendering' (per Decision 4 in 05-02-SUMMARY); turned out the cn()-merge escape hatch was overengineering — the default class string is already correct."
  - "Interpunct span sits BETWEEN DownloadPdfLink and view-source, NOT between icon row and DownloadPdfLink. The icon-row → download separator is the wider sm:gap-6 (visual rhythm shift; download is a text affordance, icons are glyph affordances). The download → view-source separator is the · interpunct (both are text mono-lowercase, same visual register). Test 8 locks the exact DOM order: UL → DownloadPdfLink → interpunct → view-source."
  - "Comment-only LinkedIn placeholder breadcrumb preserved with explicit '// PLACEHOLDER' suffix dropped from the inline comment (the Phase 1 inline comment said 'verify with Olive — PLACEHOLDER?' which Test 15 stripped via comment-strip BUT future versions of the regex could change). The JSDoc breadcrumb above the constants now carries the canonical record: 'LinkedIn handle remains a Phase 1 placeholder pending Olive's confirmation (RESEARCH § Open Q 2).' Single source of truth at the file header."
  - "Test 17 uses /subject=hi%20from%20olivelliott\\.dev/g (no `m` flag) — the source contains this string exactly once on line 22 (the EMAIL_URL constant); a future edit accidentally inlining it elsewhere would fail the test. The `.dev` is escaped in the regex to prevent matching on a dot wildcard."

requirements-completed: [CTC-01, CTC-02, RES-05]

duration: 2min
completed: 2026-05-17
---

# Phase 05 Plan 04: Footer Canonicalization + DownloadPdfLink Summary

**Surgical 3-line diff to components/site/footer.tsx — canonical github handle (CTC-01), Pitfall-5-compliant mailto subject (CTC-02), and DownloadPdfLink as the cross-page second surface (RES-05) — paired with a 17-test regression lock that locks all three corrections, preserves the Phase 1 footer features verbatim (copyright, 3 icons, 44×44 touch targets, mobile stack), and guards the RSC boundary + canonical strings against future drift.**

## Performance

- **Duration:** 2 min
- **Started:** 2026-05-17T14:57:05Z
- **Completed:** 2026-05-17T14:59:22Z
- **Tasks:** 1 (TDD: RED + GREEN = 2 commits)
- **Files modified:** 2 (footer.tsx, footer.test.tsx)
- **LOC delta:** +13 / -6 in footer.tsx; +205 / -6 in footer.test.tsx (Wave 0 placeholder → 17 tests)

## Accomplishments

- **Confirmed the three-line constant diff applied exactly as RESEARCH § Example 4 specified.** GITHUB_URL `ophelia-x` → `olivelliott`; EMAIL_URL subject `olivelliott.dev` → `hi%20from%20olivelliott.dev`; VIEW_SOURCE_URL `ophelia-x/portfolio` → `olivelliott/portfolio`. LINKEDIN_URL deliberately untouched (Phase 1 placeholder pending Phase 7).
- **DownloadPdfLink + aria-hidden interpunct inserted into the right slot.** Cross-surface RSC composition contract from Plan 05-02 now realized on every (site)/ route. Footer remains RSC (no `'use client'`).
- **Pitfall 5 lock — Test 17 asserts the literal %20-encoded subject string exists in source exactly once.** Combined with Test 16 (negative on the Phase 1 string `subject=olivelliott.dev`) and Test 3 (runtime href assertion), the mailto subject has three independent locks. Any single mutation fails at least two tests.
- **Phase 1 footer features all intact.** Tests 9–13 lock the baseline: `<footer>` with `border-t`, copyright text, aria-labels on all three icon links, `p-3` 44×44 touch target padding, and the `view source` link text. Mobile flex-col stacking inherited from Phase 1 (gap-4 sm:gap-6 hard-coded in the same JSX) — no visual change.
- **JSDoc breadcrumb updated** with Phase 5 canonicalization context, the LinkedIn placeholder flag, the CTC-02 subject lock rationale, and the RES-05 DownloadPdfLink addition. The historical 'ophelia-x' comment block was the source-grep risk (Test 15 strips comments before matching, but the breadcrumb update was the right cleanup regardless).
- **17/17 tests passing on first GREEN.** Full suite: 442 passed / 2 skipped (the 2 skips are Wave 4 Plan 05-05 pdf-build + pdf-artifact placeholders — unchanged from Plan 05-03 baseline). `pnpm typecheck` exits 0.
- **CTC-03 fully closed.** Plan 05-03 shipped /about ContactStack as the first Phase 5 contact surface; this plan shipped the footer DownloadPdfLink + canonical handle as the second. Two contact surfaces, both with the same mailto subject literal, both with the canonical github handle. Plan 05-03 already counted as the CTC-03 'second surface' — this plan elevates the footer to a co-canonical surface (same handle + subject as /about).

## Task Commits

- **RED:** `e443b30` test(05-04): RED for footer canonicalization + DownloadPdfLink — 17 tests
- **GREEN:** `c60fc24` feat(05-04): footer — canonical handle + CTC-02 subject + DownloadPdfLink + 17 tests

## Files Created/Modified

### Modified (2)

- `components/site/footer.tsx` (+13 / -6) — 3 constant edits (GITHUB_URL, EMAIL_URL, VIEW_SOURCE_URL), 1 new import (DownloadPdfLink), 1 JSX block insertion (DownloadPdfLink + interpunct span), 1 JSDoc breadcrumb rewrite. LinkedIn URL preserved verbatim.
- `tests/site/footer.test.tsx` (+205 / -6) — Wave 0 `it.skip` placeholder replaced with 17 tests across 4 buckets: URL corrections (Tests 1–4), DownloadPdfLink insertion (Tests 5–8), Phase 1 regression (Tests 9–13), source-grep guards (Tests 14–17). Comment-strip helper inlined (mirrors Plan 04-02 pattern).

## Decisions Made

See `key-decisions:` in the frontmatter. Highlights:

1. **Plain `<DownloadPdfLink />` in the footer — no className override needed.** Plan 05-02 anticipated extra layout classes for the inline-with-view-source rendering. Turned out the default class string (font-mono, p-3, inline-flex-friendly) already aligns inside the right-slot flex container. The `className` prop on DownloadPdfLink stays unused at the footer — reserved as the escape hatch for any future non-flex placement.
2. **Interpunct sits between DownloadPdfLink and view-source, NOT between icon row and DownloadPdfLink.** The icon-row → text-link transition uses the existing `gap-6` rhythm (visual register change is enough). The text-link → text-link transition needs the · interpunct (both are mono-lowercase, same register — interpunct enforces visual separation without underlining the gap).
3. **Triple lock on the CTC-02 subject string.** Positive grep (Test 17), negative grep on Phase 1 string (Test 16), runtime href assertion (Test 3). The redundancy is intentional: a single edit that drops the subject would fail Tests 3 + 17; a single edit that flips back to the Phase 1 subject would fail Tests 3 + 16 + 17. The three tests catch three different failure modes.
4. **JSDoc breadcrumb update over inline comment cleanup.** Plan 05-03 was bitten by the comment substring problem (its initial commit had `TagChipRow` in a header comment that tripped the source-grep). This plan rewrote the JSDoc block at the top of footer.tsx so it carries the canonical Phase 5 context — the comment-strip pattern would have hidden any `'ophelia-x'` or `'subject=olivelliott.dev'` substrings in comments from Tests 15 + 16, but cleaning them out anyway means a future regex that doesn't strip comments still passes.

## Deviations from Plan

None — plan executed exactly as written. The action block's four parts (constant updates, import addition, JSX insertion, JSDoc rewrite) applied verbatim. The 17 test descriptions in the `<behavior>` block translated 1:1 to test cases.

## Issues Encountered

None. RED phase produced exactly 9 failures (URL corrections + DownloadPdfLink insertion + source-grep locks) and 8 passes (Phase 1 regression — copyright, aria-labels, p-3, view-source text — were already true under the Phase 1 footer; LinkedIn placeholder check passed since URL was unchanged; `'use client'` check passed since none was present). GREEN phase produced 17/17 passing on first run with no debug iteration.

## Pitfall lock confirmation matrix

| Pitfall | What it guards | Lock location | Status |
|---|---|---|---|
| 5 | mailto subject uses %20 not + (RFC 6068; mobile Outlook bug) | EMAIL_URL constant on line 22 of footer.tsx | LOCKED — Tests 3 (runtime), 16 (negative grep), 17 (positive grep, exactly-once) |
| 7 | Footer + DownloadPdfLink stay RSC (no `'use client'` directive) | No `'use client'` line in footer.tsx | LOCKED — Test 14 (source-grep with comment-strip) |

## Cross-surface canonicalization status (post-Plan 05-04)

| Surface | github handle | mailto subject | linkedin handle | Notes |
|---|---|---|---|---|
| /about ContactStack (Plan 05-03) | olivelliott (canonical) | hi%20from%20olivelliott.dev (locked) | olive-elliott (PLACEHOLDER) | First contact surface |
| /resume ResumeHeader (Plan 05-02) | olivelliott (canonical, via content/resume.ts) | hi%20from%20olivelliott.dev (locked, hardcoded in ResumeHeader) | olive-elliott (PLACEHOLDER, via content/resume.ts) | Resume header contact line |
| Footer (Plan 05-04 — THIS PLAN) | olivelliott (canonical) | hi%20from%20olivelliott.dev (locked) | olive-elliott (PLACEHOLDER) | Every (site)/ route |
| /resume PDF (Plan 05-05) | olivelliott (inherited from /resume route) | hi%20from%20olivelliott.dev (inherited) | olive-elliott (inherited) | Puppeteer-rendered |

All three Phase 5 surfaces converge on the canonical handle + locked subject. **LinkedIn remains a placeholder across all three** — flag for Phase 7 to flip atomically.

## Wave 4 (Plan 05-05) follow-ups flagged

- **Anti-pattern manifest extension:** `components/site/footer.tsx` SHOULD be added to the PHASE_SOURCES manifest in `tests/home/anti-patterns.test.ts`. The footer is now touched by Phase 5 (DownloadPdfLink + canonical handle) and benefits from the cross-phase locks: banned-words negative grep, no motion/react import, no Lucide beyond the already-imported `Mail` icon, no new `'use client'` introduced.
- **Per-surface canonicalization check (optional):** Plan 05-05 could add a single integration test that renders every Phase 5 surface (footer + ContactStack + ResumeHeader) and asserts all three emit identical mailto hrefs. A drift in any one would fail the test. Not strictly required (each surface has its own lock), but a cheap cross-surface regression net.
- **`tests/home/anti-patterns.test.ts` rename:** the file location is now misleading (it asserts cross-phase invariants, not just home). Plan 05-05 may want to rename to `tests/anti-patterns.test.ts` or `tests/cross-phase/anti-patterns.test.ts`. Tracking decision documented in Plan 05-03's `affects` block; deferred until 05-05 plans the manifest extension.

## Next Phase Readiness

- **Plan 05-05 (Puppeteer PDF pipeline + banned-words sweep + cleanup) unblocked.** All three Phase 5 contact surfaces are now canonical and lock-tested. The footer's DownloadPdfLink anchor + canonical handle will be inherited by the Puppeteer-rendered PDF (Puppeteer navigates to /resume via `emulateMediaType('print')` — the footer is on the (site)/ chrome and won't render in the PDF, but the footer change is fully orthogonal to PDF pipeline).
- **CTC-01, CTC-02, RES-05** are now fully satisfied across all surfaces and locked by tests. CTC-03 (two contact surfaces) is fully closed (ContactStack on /about + Footer icons on every page).
- **Phase 7 inherits:** LinkedIn handle placeholder to resolve (3 surfaces: /about ContactStack, /resume content/resume.ts, footer.tsx).

## Verification Results

```
=== Plan-mandated automated verification ===

pnpm vitest run tests/site/footer.test.tsx --reporter=dot
  → Test Files  1 passed (1)
  → Tests      17 passed (17)

pnpm vitest run                        (full suite — no regression)
  → Test Files 52 passed | 2 skipped (54)
  → Tests     442 passed | 2 skipped (444)
  → Baseline (post-05-03): 425 passing / 3 skipped
  → Delta: +17 passing / -1 skipped (matches exactly: 17 new tests; 1 Wave-0 skip → implementation)

pnpm typecheck                          (strict mode)
  → exit 0

=== Source-grep regression checks (from plan <verification> block) ===
grep -c 'olivelliott' components/site/footer.tsx          → 5  (expected ≥ 4)
grep -c 'ophelia-x' components/site/footer.tsx            → 0  (expected exit 1 — correct)
grep -c 'subject=hi%20from%20olivelliott.dev' footer.tsx  → 1  (expected 1)
```

## Self-Check: PASSED

Files verified present on disk:
- `components/site/footer.tsx` — FOUND (84 lines)
- `tests/site/footer.test.tsx` — FOUND (208 lines)

Commits verified in `git log --oneline -5`:
- `e443b30` test(05-04): RED for footer canonicalization + DownloadPdfLink — 17 tests — FOUND
- `c60fc24` feat(05-04): footer — canonical handle + CTC-02 subject + DownloadPdfLink + 17 tests — FOUND

No stubs introduced. The LinkedIn placeholder is the only outstanding placeholder and is documented in the JSDoc breadcrumb + flagged in this SUMMARY's cross-surface table + flagged in Plan 05-03's SUMMARY → it's a known cross-plan Phase 7 follow-up, not a Plan 05-04 stub.

---
*Phase: 05-about-+-resume-+-contact*
*Plan: 04*
*Completed: 2026-05-17*
