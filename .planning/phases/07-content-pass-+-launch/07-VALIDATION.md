---
phase: 7
slug: content-pass-launch
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-18
---

# Phase 7 — Validation Strategy

> Per-phase validation contract for content authoring + deploy.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 1.x + axe + Phase 2 redaction scanner |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `pnpm vitest run --reporter=dot` |
| **Full suite command** | `pnpm vitest run && pnpm typecheck && pnpm build` |
| **Manual lighthouse** | `pnpm lhci` (Plan 07-04, resolves Phase 6 deferral) |
| **Estimated runtime** | ~45s quick / ~115s full |

---

## Sampling Rate

- **After every task commit:** `pnpm vitest run --reporter=dot`
- **After every plan wave:** full suite
- **Before deploy:** full suite green + lhci ≥ 90 + manual content review sign-off
- **Max feedback latency:** 45 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | Status |
|---------|------|------|-------------|-----------|-------------------|--------|
| 07-00-01 | 00 | 0 | DPL-03 | dep-install | `pnpm ls @vercel/analytics @vercel/speed-insights` | ⬜ pending |
| 07-00-02 | 00 | 0 | DPL-03 | source-grep | `<Analytics />` + `<SpeedInsights />` mounted in app/layout.tsx | ⬜ pending |
| 07-00-03 | 00 | 0 | infra | file-exists | `test -f .planning/.../deploy-checklist.md` | ⬜ pending |
| 07-01-01 | 01 | 1 | content | file-exists | `test -f content/projects/fathom.mdx` (schema parses; getAll includes fathom) | ⬜ pending |
| 07-01-02 | 01 | 1 | content | unit | `pnpm vitest run tests/content/` (existing tests still green; Fathom appears in getAll) | ⬜ pending |
| 07-02-01 | 02 | 2 | content + redaction | source-grep | tests/fixtures/banned-terms.ts extended; tests/content/redaction-scanner.test.ts passes | ⬜ pending |
| 07-02-02 | 02 | 2 | content | file-exists | `test -f content/projects/agenda-keeper.mdx` with `visibility: 'private'` | ⬜ pending |
| 07-02-03 | 02 | 2 | content | manual | redaction sign-off checklist filed | ⬜ pending |
| 07-03-01 | 03 | 3 | placeholder | source-grep | `! grep -r "PLACEHOLDER" content/resume.ts components/about/ components/site/` (or remaining items explicitly listed) | ⬜ pending |
| 07-04-01 | 04 | 4 | QAL-01 | manual | `pnpm lhci` ≥ 90 on all 4 axes for / + /projects/myco | ⬜ pending |
| 07-04-02 | 04 | 4 | DPL-02 | manual | Vercel deploy successful; live URL reachable over HTTPS | ⬜ pending |
| 07-04-03 | 04 | 4 | DPL-03 | manual | Vercel Analytics dashboard shows smoke-test pageviews within 30 min | ⬜ pending |

---

## Wave 0 Requirements

- [ ] Install `@vercel/analytics@^1` + `@vercel/speed-insights@^1` (Approved per CLAUDE.md tech-stack lock).
- [ ] Mount `<Analytics />` + `<SpeedInsights />` in `app/layout.tsx`.
- [ ] Create `.planning/phases/07-content-pass-+-launch/deploy-checklist.md` scaffold.
- [ ] Verify `engines.node` in package.json pinned (Vercel needs it).
- [ ] Confirm existing Phase 2 redaction infrastructure ready (no new test files; existing scanner extends to new MDX).

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Fathom MDX reads like Olive | content honesty | Editorial judgment | Read /projects/fathom end-to-end |
| Agenda Keeper MDX clean of NDA-sensitive details | content + privacy | Olive's domain knowledge | Read MDX + run redaction sign-off |
| Lighthouse ≥ 90 (resolves Phase 6 QAL-01) | QAL-01 | Browser-based measurement | `pnpm lhci` per Phase 6 lighthouse-report.md instructions |
| Vercel deploy lands on `olivelliott.vercel.app` | DPL-02 | External infrastructure | Olive runs deploy via Vercel dashboard / GitHub integration |
| Analytics + Speed Insights firing | DPL-03 | External dashboard | Visit live URL + check Vercel dashboard within 30 min |
| Public sharing readiness | success criterion #5 | Subjective | Olive's call after smoke checklist |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify OR explicit manual checkpoint
- [ ] No 3-task gap without verify
- [ ] No watch-mode flags
- [ ] Feedback latency < 45s
- [ ] `nyquist_compliant: true` after planner verifies coverage

**Approval:** pending
