---
phase: 07-content-pass-+-launch
plan: 00
subsystem: infra
tags: [vercel, analytics, speed-insights, telemetry, deploy, layout, root-layout]

requires:
  - phase: 05-about-+-resume-+-contact
    provides: app/resume/ chromeless route that inherits root layout (telemetry must catch /resume)
  - phase: 06-seo,-og,-a11y-&-performance-audit
    provides: QAL-01 Lighthouse deferral picked up by Plan 07-04 pre-deploy gate
provides:
  - Vercel Analytics + Speed Insights client islands mounted in app/layout.tsx (DPL-03 client-side activation)
  - .planning/phases/07-content-pass-+-launch/deploy-checklist.md scaffold (3 sections, 9 subsections, all smoke steps pre-listed)
  - Verified Phase 7 infrastructure prerequisites (engines pin, redaction scanner armed, deps in production dependencies)
affects: [07-01, 07-02, 07-03, 07-04, milestone-v1.0]

tech-stack:
  added: ["@vercel/analytics ^2.0.1 (mounted)", "@vercel/speed-insights ^2.0.0 (mounted)"]
  patterns:
    - "Root-layout analytics mount — siblings of <Providers> inside <body>; covers chromeless /resume route too"
    - "Deploy checklist as the canonical Plan 07-04 execution guide — section names + subsection numbers are referenced verbatim by downstream checkpoints"
    - "Infrastructure verification reported in commit body (no code changes for verified items)"

key-files:
  created:
    - .planning/phases/07-content-pass-+-launch/deploy-checklist.md
    - .planning/phases/07-content-pass-+-launch/07-00-SUMMARY.md
  modified:
    - app/layout.tsx
    - public/resume.pdf

key-decisions:
  - "Root app/layout.tsx (not (site)/layout.tsx) for Analytics mount — /resume opts out of (site) chrome but inherits root, so root-mount catches the chromeless route too (D-DPL-03 from 07-CONTEXT.md)"
  - "Both <Analytics /> and <SpeedInsights /> ship together at no marginal complexity — Speed Insights is the perf-monitoring counterpart pre-locked in CLAUDE.md tech stack"
  - "No 'use client' directive on app/layout.tsx — both Vercel packages internally handle the client boundary; layout stays a Server Component"
  - "Deploy checklist sections numbered 1-9 — Plan 07-04 checkpoint:human-action tasks reference subsections by number, not heading text (resilient to copy edits)"

patterns-established:
  - "Pattern 1: Analytics client islands as siblings of <Providers> (not children) — keeps telemetry independent of the chrome subtree"
  - "Pattern 2: Phase deploy checklists scaffolded one plan ahead of execution — Plan 07-04 has zero ramp-up; manual checkpoint actor follows checklist line by line"
  - "Pattern 3: Infrastructure verification documented in commit messages when no code changes are needed — keeps the audit trail without empty diffs"

requirements-completed: [DPL-03]

duration: 3 min
completed: 2026-05-18
---

# Phase 7 Plan 0: Wave 0 Infrastructure Summary

**Vercel Analytics + Speed Insights mounted in root layout (DPL-03 client-side activation) and Phase 7 deploy-checklist.md scaffolded as the line-by-line execution guide for Plan 07-04.**

## Performance

- **Duration:** 3 min
- **Started:** 2026-05-18T14:45:35Z
- **Completed:** 2026-05-18T14:48:48Z
- **Tasks:** 2
- **Files modified:** 2 (+ 1 created + 1 binary regenerated)

## Accomplishments

- `<Analytics />` + `<SpeedInsights />` imported and rendered in `app/layout.tsx` as siblings of `<Providers>{children}</Providers>`, inside `<body>`. Both fire on every route including the chromeless `/resume`.
- `deploy-checklist.md` scaffold authored (90 lines) with all three required sections (Pre-Deploy Gate, Deploy, Post-Deploy Smoke) and nine numbered subsections (1–9) including the "Analytics confirmation" subsection that Plan 07-04 references by name.
- Verified all Phase 7 infrastructure prerequisites are ready (no changes needed): `engines.node` pinned, redaction scanner armed via `tests/content/redaction.test.ts` dynamic-describe block, both Vercel packages already installed as production dependencies (not devDeps).
- Zero test regressions: 513 pass / 4 skipped (matches Phase 6 baseline).
- `pnpm typecheck` exits 0; `pnpm build` exits 0; postbuild successfully regenerates `public/resume.pdf` (234.9 KB → 240502 bytes on disk).

## Task Commits

Each task was committed atomically:

1. **Task 1: Mount Analytics + SpeedInsights in root app/layout.tsx** — `de6a33f` (feat)
2. **Task 2: Verify Phase 7 infrastructure + author deploy-checklist.md scaffold** — `1909f40` (docs)

**Plan metadata:** _pending — final commit after STATE/ROADMAP updates_

## Files Created/Modified

- `app/layout.tsx` — Added 2 imports (`@vercel/analytics/react` Analytics, `@vercel/speed-insights/next` SpeedInsights) and 2 JSX mounts inside `<body>` as siblings of `<Providers>`. No `'use client'` directive added. Existing metadata, html/body attributes, font wiring, and Providers placement untouched.
- `.planning/phases/07-content-pass-+-launch/deploy-checklist.md` — New 90-line scaffold. Three sections, nine numbered subsections, sign-off block at the bottom. Plan 07-04's checkpoint:human-action tasks reference this file by section number (#1–#9).
- `public/resume.pdf` — Regenerated by `postbuild` during `pnpm build` (same size, fresh build timestamp; resume PDF is intentionally committed per Phase 5 decision).

## Decisions Made

- **Root layout, not (site) layout** — Per D-DPL-03 in 07-CONTEXT.md. `/resume` opts out of the `(site)/` chrome (its layout returns `<>{children}</>` for print friendliness) but still inherits `app/layout.tsx`. Mounting Analytics in root catches `/resume` page-views; mounting in `(site)/` would silently miss them.
- **Siblings of `<Providers>`, not children** — Locks the analytics islands outside the MotionProvider/ThemeProvider subtree. Their lifecycle is independent of theme/motion concerns; placing them as siblings prevents accidental coupling and makes intent obvious to future readers.
- **No `'use client'` on `app/layout.tsx`** — Both `@vercel/analytics/react` and `@vercel/speed-insights/next` ship `'use client'` internally. Adding the directive at the layout level would unnecessarily push the entire root layout to the client and break the RSC contract.
- **Deploy-checklist subsections numbered 1–9** — Plan 07-04 references by number rather than heading text, so copy edits to subsection titles won't break downstream references.

## Deviations from Plan

None — plan executed exactly as written.

The plan body anticipated the regenerated `public/resume.pdf` (postbuild runs after every build) and Phase 5's commit-the-PDF pattern; including it in Task 1 follows the established convention.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required for this plan. Vercel Analytics + Speed Insights are zero-config when the site lands on Vercel; no env vars, no API keys, no dashboard wiring at this stage. Plan 07-04 closes the runtime confirmation loop post-deploy.

## Next Phase Readiness

- **Infrastructure verified ready for downstream plans:**
  - Plan 07-01 (Fathom MDX): redaction scanner stays vacuous until first private MDX lands; no blockers.
  - Plan 07-02 (Agenda Keeper MDX): `tests/fixtures/banned-terms.ts` is a frozen const ready for in-place extension; `tests/content/redaction.test.ts` will auto-fire per private file.
  - Plan 07-03 (placeholder resolution): no infrastructure dependencies.
  - Plan 07-04 (pre-deploy + deploy + smoke): `deploy-checklist.md` is the line-by-line guide; lhci script is wired (`pnpm lhci`); analytics will report data once deployment lands on Vercel.
- **Ready for Plan 07-01** (Fathom MDX authoring).

## Self-Check: PASSED

- `app/layout.tsx` — FOUND, modified (Analytics + SpeedInsights imports + JSX present)
- `.planning/phases/07-content-pass-+-launch/deploy-checklist.md` — FOUND (90 lines, 3 sections, 9 subsections)
- `.planning/phases/07-content-pass-+-launch/07-00-SUMMARY.md` — FOUND (this file)
- Commit `de6a33f` — FOUND in git log (Task 1: feat)
- Commit `1909f40` — FOUND in git log (Task 2: docs)
- `pnpm vitest run`: 513 pass / 4 skipped (baseline preserved)
- `pnpm typecheck`: exit 0
- `pnpm build`: exit 0; resume.pdf regenerated
- `pnpm ls @vercel/analytics @vercel/speed-insights --depth 0`: both shown as production dependencies

---
*Phase: 07-content-pass-+-launch*
*Completed: 2026-05-18*
