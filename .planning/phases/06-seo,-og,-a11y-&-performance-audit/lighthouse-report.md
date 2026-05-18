# Phase 6 — Lighthouse Report

**Phase gate (QAL-01):** Lighthouse ≥ 90 across Performance / Accessibility / Best Practices / SEO on `/` and `/projects/myco`.

**Status:** ⚠️ DEFERRED-ACCEPTED — post-launch follow-up (v1.0 launch waived QAL-01 by user decision, 2026-05-18)
**Run date:** _pending — to run against live URL post-deploy_
**Build SHA:** _pending — capture at post-launch run_
**Command:** `pnpm lhci` (or `CHROME_PATH=$(node -e 'console.log(require("puppeteer").executablePath())') pnpm lhci` if Chrome not on PATH)
**Output dir:** `./lighthouse-reports/` (gitignored)

**Notes:** Olive accepted the QAL-01 shortfall for v1.0 launch on 2026-05-18 (Plan 07-04 Task 1, `skip` resolution). The audit was originally deferred from Phase 6 to Phase 7 launch-week; at the launch-week gate Olive chose to ship without the pre-deploy lhci pass. Post-launch action: run `pnpm lhci` against the live Vercel URL after deploy; record scores in the tables below; file a gap-closure plan if any axis < 0.90.

## Deferral Note (2026-05-17, updated 2026-05-18)

Lighthouse audit (QAL-01) was intentionally deferred to the Phase 7 launch-week checklist by user decision during Phase 6 execution. Infrastructure is fully ready — lighthouserc.json wired (4 categories @ minScore 0.9), `pnpm lhci` script present, Puppeteer Chromium available via Phase 5's install. The audit requires a real Chrome instance + spawned production server, which is more reliable to run interactively on Olive's local machine.

**2026-05-18 update:** At the launch-week gate (Plan 07-04 Task 1), Olive chose to skip the pre-deploy lhci run and accept QAL-01 as a post-launch follow-up. The deferral carries forward as a tracked todo in PROJECT.md § Active. REQUIREMENTS.md QAL-01 remains unchecked.

**Owner:** Olive (manual run against the live Vercel URL post-deploy).

**Acceptance (post-launch):** All 8 cells below ≥ 0.90 when run against the live URL. If any axis fails, file a gap-closure plan (likely culprits per CONTEXT.md: hero image `priority`/`sizes` props, font-display, motion island bundle size).

**Why marked complete in REQUIREMENTS.md but `human_needed` in VERIFICATION.md:** The codebase is ready for ≥ 90 scores (all Phase 1–6 anti-pattern locks honored, no motion regressions, RSC-first architecture); only the empirical measurement is deferred. NOTE: REQUIREMENTS.md QAL-01 is NOT marked complete — it remains explicitly unchecked per the 2026-05-18 deferral-accepted decision.

## Scores

### `/`

| Category        | Score | Passes ≥ 90? |
|-----------------|-------|--------------|
| Performance     |       |              |
| Accessibility   |       |              |
| Best Practices  |       |              |
| SEO             |       |              |

### `/projects/myco`

| Category        | Score | Passes ≥ 90? |
|-----------------|-------|--------------|
| Performance     |       |              |
| Accessibility   |       |              |
| Best Practices  |       |              |
| SEO             |       |              |

## Manual Keyboard Walkthrough Checklist (QAL-03 supplement)

- [ ] Tab from page load → SkipLink visible on first focus
- [ ] Tab through nav → every nav link reachable with visible focus ring
- [ ] On `/projects` → tab through filter chips; activate via Enter; URL updates
- [ ] On `/projects/myco` → tab through anchors in MDX body; next-project link reachable
- [ ] On `/resume` → DownloadPdfLink reachable and activates download
- [ ] Footer → GitHub / Mail / LinkedIn / DownloadPdfLink all keyboard-reachable

## Reduced-Motion Walkthrough (QAL-04 supplement)

- [ ] macOS Reduce Motion ON → ThesisParagraph renders without per-word fade
- [ ] No other decorative motion observed on any route

## 19-Item Anti-Features Visual Check (QAL-05 supplement to source-grep)

_Visual sanity pass over `/`, `/projects`, `/projects/myco`, `/about`, `/resume`:_

- [ ] No skill bars / percentage gauges
- [ ] No gradient-on-gradient backgrounds
- [ ] No glassmorphism / backdrop-blur
- [ ] No stagger-on-scroll
- [ ] No bento-grid home layout
- [ ] No cookie banner / GDPR overlay
- [ ] No newsletter / subscribe form
- [ ] No testimonial carousel
- [ ] No marquee / tech-logo strip
- [ ] No "coming soon" copy
- [ ] No years-of-experience counters
- [ ] No auto-opening chatbot widget

## Notes / Anomalies

_Fill in any unexpected behavior observed during the run or walkthrough._
