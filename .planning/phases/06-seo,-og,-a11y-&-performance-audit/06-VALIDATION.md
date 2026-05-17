---
phase: 6
slug: seo-og-a11y-performance-audit
status: complete
nyquist_compliant: true
wave_0_complete: true
created: 2026-05-17
completed: 2026-05-17
---

# Phase 6 — Validation Strategy

> Per-phase validation contract. Derived from `06-RESEARCH.md` § Validation Architecture.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 1.x (jsdom) + vitest-axe@1.0.0-pre.5 (Wave 0 install) |
| **Config file** | `vitest.config.ts` (extends Phase 3 mdxShim) |
| **Quick run command** | `pnpm vitest run --reporter=dot` |
| **Full suite command** | `pnpm vitest run && pnpm typecheck && pnpm build` |
| **Manual lighthouse** | `pnpm lhci` (Wave 3, documented scores in `lighthouse-report.md`) |
| **Estimated runtime** | ~40s quick / ~110s full (Puppeteer postbuild still active) |

---

## Sampling Rate

- **After every task commit:** `pnpm vitest run --reporter=dot`
- **After every plan wave:** full suite + manual lighthouse if Wave 3
- **Before `/gsd:verify-work`:** full suite green + lighthouse-report.md filled with ≥ 90 scores
- **Max feedback latency:** 40 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | Status |
|---------|------|------|-------------|-----------|-------------------|--------|
| 06-00-01 | 00 | 0 | infra | dep-install | `pnpm ls vitest-axe --depth 0` | ⬜ pending |
| 06-00-02 | 00 | 0 | infra | file-exists | `test -f lighthouserc.json && test -f .planning/.../lighthouse-report.md` | ⬜ pending |
| 06-00-03 | 00 | 0 | infra | file-count | 12 Wave-0 test placeholders exist with `it.skip` | ⬜ pending |
| 06-01-01 | 01 | 1 | MTA-04 | file-exists | `test -f app/icon.svg && test -f app/apple-icon.png && test -f app/favicon.ico` | ⬜ pending |
| 06-01-02 | 01 | 1 | MTA-04 | unit | `pnpm vitest run tests/seo/favicon.test.ts` (favicon files exist + apple-icon ≥ 180×180 + SVG valid) | ⬜ pending |
| 06-02-01 | 02 | 2 | MTA-02 | unit | `pnpm vitest run tests/seo/og-image.test.ts` (6 opengraph-image.tsx files exist, default export shape correct) | ⬜ pending |
| 06-02-02 | 02 | 2 | MTA-02 | source-grep | manual `openGraph.images` declarations DELETED from all 5 page metadata (Pitfall 4 cleanup) | ⬜ pending |
| 06-02-03 | 02 | 2 | MTA-03 | unit | `pnpm vitest run tests/seo/sitemap.test.ts` (enumerates all routes + each /projects/${slug}) | ⬜ pending |
| 06-02-04 | 02 | 2 | MTA-03 | unit | `pnpm vitest run tests/seo/robots.test.ts` (allow /, disallow /_next/ + /api/, sitemap pointer) | ⬜ pending |
| 06-02-05 | 02 | 2 | MTA-01 | unit | `pnpm vitest run tests/seo/metadata.test.ts` (per-route unique title/description, canonical matches pathname) | ⬜ pending |
| 06-02-06 | 02 | 2 | QAL-02 | unit | `pnpm vitest run tests/a11y/home.test.tsx` (axe → 0 violations) | ⬜ pending |
| 06-02-07 | 02 | 2 | QAL-02 | unit | `pnpm vitest run tests/a11y/projects-index.test.tsx` (axe) | ⬜ pending |
| 06-02-08 | 02 | 2 | QAL-02 | unit | `pnpm vitest run tests/a11y/myco-detail.test.tsx` (axe) | ⬜ pending |
| 06-02-09 | 02 | 2 | QAL-02 | unit | `pnpm vitest run tests/a11y/about.test.tsx` (axe) | ⬜ pending |
| 06-02-10 | 02 | 2 | QAL-02 | unit | `pnpm vitest run tests/a11y/resume.test.tsx` (axe) | ⬜ pending |
| 06-02-11 | 02 | 2 | QAL-03 | unit | `pnpm vitest run tests/a11y/keyboard.test.tsx` (every interactive element tab-reachable) | ⬜ pending |
| 06-02-12 | 02 | 2 | QAL-04 | source-grep | extend Phase 4 anti-pattern: every motion/react import has useReducedMotion gate | ⬜ pending |
| 06-03-01 | 03 | 3 | QAL-05 | source-grep | `pnpm vitest run tests/launch-gate/anti-features.test.ts` (all 19 items) | ⬜ pending |
| 06-03-02 | 03 | 3 | QAL-01 | manual | `pnpm lhci` against `/` and `/projects/myco` → all ≥ 90 | ⬜ pending |
| 06-03-03 | 03 | 3 | QAL-01 | file-content | `lighthouse-report.md` updated with actual scores | ⬜ pending |
| 06-04-01 | 04 | 4 | regression | build-smoke | `pnpm build` end-to-end succeeds with all new artifacts | ⬜ pending |
| 06-04-02 | 04 | 4 | cleanup | file-absent | orphaned `public/{file,globe,next,vercel,window}.svg` deleted | ⬜ pending |

---

## Wave 0 Requirements

- [ ] Install: `vitest-axe@1.0.0-pre.5` as devDep + `expect.extend({ toHaveNoViolations })` in `vitest.setup.ts`.
- [ ] Create `lighthouserc.json` config (Lighthouse 11+ preset, ≥ 0.9 across categories).
- [ ] Add `pnpm lhci` script in package.json.
- [ ] Author `lighthouse-report.md` template (filled at Wave 3).
- [ ] `.gitignore` `lighthouse-reports/` (CLI output dir).
- [ ] 12 Wave-0 test placeholders (5 a11y + keyboard + 5 seo + launch-gate).

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Lighthouse ≥ 90 across all 4 categories | QAL-01 | Browser-based perf measurement | `pnpm build && pnpm start` → `pnpm lhci` → record scores |
| Visual OG card unfurl on Twitter/LinkedIn | MTA-02 | External rendering | Pre-launch: paste a route URL into Twitter compose box; visual check |
| Favicon visible across browsers | MTA-04 | Browser chrome | Open the site in Safari + Chrome + Firefox; confirm favicon appears |
| Keyboard-only walkthrough | QAL-03 | Real-keyboard interaction | Tab through nav → filter chips on /projects → resume download → all reachable |
| Reduced-motion behavior site-wide | QAL-04 | OS-level setting | macOS Reduce Motion ON → walk through site; confirm no decorative motion |
| 19-item anti-features visual check | QAL-05 | Visual judgment supplements source-grep | Browse all routes; confirm no skill bars, no glass, no bento, etc. |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify (or stub file-existence + manual gate)
- [ ] No 3-task gap without automated verify
- [ ] Wave 0 covers all missing test files
- [ ] No watch-mode flags
- [ ] Feedback latency < 40s
- [ ] `nyquist_compliant: true` set after planner verifies coverage

**Approval:** Phase 6 complete (2026-05-17). 8 of 9 requirements met (MTA-01..04 + QAL-02..05); QAL-01 (Lighthouse ≥ 90) deferred to Phase 7 launch-week per Plan 06-04 user decision (documented in `lighthouse-report.md` with owner + acceptance criteria).
- Full test suite: 513 passed / 4 skipped (4 pre-existing Phase 2/3 placeholders, zero Phase 6 placeholders) across 66 test files
- Lighthouse: deferred to Phase 7 launch-week (single interactive run pre-deploy on Olive's local machine; infra fully ready — `lighthouserc.json` + `pnpm lhci` script + Puppeteer Chromium installed)
- 19-item anti-features launch gate: 19/19 passing (`tests/launch-gate/anti-features.test.ts`)
- vitest-axe a11y: 0 violations on `/` + `/projects` + `/projects/myco` + `/about` + `/resume` (`tests/a11y/*.test.tsx`)
- PHASE_SOURCES anti-pattern net: 32 files × 11 invariants (extended +8 Phase 6 entries this plan)
- `pnpm build` end-to-end: success (Compiled in 2.0s; 5 OG surfaces + sitemap.xml + robots.txt + icon.svg + apple-icon.png in route table; Phase 5 postbuild PDF regenerated 234.9 KB)
