# Phase 6 — Lighthouse Report

**Phase gate (QAL-01):** Lighthouse ≥ 90 across Performance / Accessibility / Best Practices / SEO on `/` and `/projects/myco`.

**Status:** ⬜ not yet run (template; Plan 06-04 fills in)
**Run date:** _pending_
**Build SHA:** _pending_
**Command:** `pnpm lhci`
**Output dir:** `./lighthouse-reports/` (gitignored)

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
