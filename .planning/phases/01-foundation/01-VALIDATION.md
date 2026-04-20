---
phase: 1
slug: foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-20
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 3.x (Wave 0 installs — none exist yet) |
| **Config file** | `vitest.config.ts` (Wave 0 creates) |
| **Quick run command** | `pnpm typecheck && pnpm check && pnpm test -- --run` |
| **Full suite command** | `pnpm typecheck && pnpm check && pnpm test -- --run --coverage && pnpm build` |
| **Estimated runtime** | ~20s quick / ~90s full |

---

## Sampling Rate

- **After every task commit:** Run quick command (typecheck + biome check + vitest run). Target ≤ 20s.
- **After every plan wave:** Run full suite (adds coverage + production `next build`). Target ≤ 90s.
- **Before `/gsd:verify-work`:** Full suite green, plus deployed Vercel preview URL passes `pnpm dlx @axe-core/cli <url> --exit` with zero violations, plus manual keyboard walkthrough and macOS Reduced Motion toggle check.
- **Max feedback latency:** 20s (quick) / 90s (full).

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 1-00-01 | 00 | 0 | (infra) | smoke | `pnpm typecheck` | ❌ W0 installs | ⬜ pending |
| 1-00-02 | 00 | 0 | FND-04 | smoke | `pnpm check --write=false` | ❌ W0 | ⬜ pending |
| 1-00-03 | 00 | 0 | (infra) | smoke | `pnpm test -- --run` | ❌ W0 | ⬜ pending |
| 1-01-01 | 01 | 1 | FND-02 | unit | `pnpm test -- --run tests/tokens.test.ts` | ❌ W0 | ⬜ pending |
| 1-01-02 | 01 | 1 | FND-07 | unit (math) | `pnpm test -- --run tests/contrast.test.ts` | ❌ W0 | ⬜ pending |
| 1-02-01 | 02 | 1 | FND-03 | unit | `pnpm test -- --run tests/layout.test.tsx` | ❌ W0 | ⬜ pending |
| 1-02-02 | 02 | 1 | FND-06 | unit | `pnpm test -- --run tests/providers.test.tsx` | ❌ W0 | ⬜ pending |
| 1-03-01 | 03 | 2 | FND-05 | unit (source assert) | `pnpm test -- --run tests/motion-provider.test.ts` | ❌ W0 | ⬜ pending |
| 1-03-02 | 03 | 2 | FND-05 | unit (source assert) | `pnpm test -- --run tests/fade-in.test.ts` | ❌ W0 | ⬜ pending |
| 1-04-01 | 04 | 2 | FND-08 | unit (render + keyboard) | `pnpm test -- --run tests/skip-link.test.tsx` | ❌ W0 | ⬜ pending |
| 1-04-02 | 04 | 2 | FND-08 | unit | `pnpm test -- --run tests/nav-link.test.tsx` | ❌ W0 | ⬜ pending |
| 1-05-01 | 05 | 3 | FND-01, FND-07 | smoke | `pnpm build && pnpm start &` then `pnpm dlx @axe-core/cli http://localhost:3000 --exit` | N/A (dev-server probe) | ⬜ pending |
| 1-06-01 | 06 | 3 | DPL-01 | manual-only | Push to `main`, confirm Vercel deployment within 5 minutes | N/A | ⬜ pending |

*Plan numbering (`01`, `02`, …) is indicative — the planner may consolidate. Task IDs re-derive after plans land. Wave 0 installs the test harness; every unit test above depends on Wave 0 completing first.*

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `pnpm add -D vitest@^3 @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom` — install test harness
- [ ] `vitest.config.ts` — jsdom env, path alias `@/*`, `./vitest.setup.ts`
- [ ] `vitest.setup.ts` — `import '@testing-library/jest-dom'`
- [ ] `tests/tokens.test.ts` — parse `styles/tokens.css`, assert every token from UI-SPEC Design Tokens table present with exact value
- [ ] `tests/contrast.test.ts` — pure WCAG ratio fn over UI-SPEC token pairs, assert ≥ 4.5 for each AA-passing pair
- [ ] `tests/layout.test.tsx` — renders root layout, asserts `GeistSans.variable` + `GeistMono.variable` on `<html>`, `<main id="main">` present
- [ ] `tests/providers.test.tsx` — asserts `next-themes` configured with `defaultTheme="dark" enableSystem={false}`
- [ ] `tests/motion-provider.test.ts` — reads `components/motion/motion-provider.tsx` as string; asserts `reducedMotion="user"`, `features={domAnimation}`, `strict`
- [ ] `tests/fade-in.test.ts` — reads `components/motion/fade-in.tsx` as string; asserts `opacity` present and none of `y:`, `x:`, `scale:`, `rotate:`, `rotateX:`, `rotateY:` appear in motion props
- [ ] `tests/skip-link.test.tsx` — renders `<SkipLink>`, asserts `href="#main"`, `sr-only` class default, focus reveals it
- [ ] `tests/nav-link.test.tsx` — renders `<NavLink>` active + inactive, asserts active gets `aria-current="page"` + accent underline class
- [ ] Add `"test": "vitest"`, `"test:ci": "vitest run"` to `package.json` scripts
- [ ] Node 22 test matrix via `engines.node: ">=20.0.0"` in `package.json`

*Exists: "No Phase 1 test infrastructure exists — greenfield. All W0 tasks required."*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Keyboard tab order matches UI-SPEC (wordmark → nav links → footer icons → view-source) | FND-08 | Tab-order semantics depend on rendered browser behavior; Playwright deferred to v1.x per STACK.md | On deployed preview URL: Tab from page load, note focused element sequence, must match UI-SPEC tab order spec. |
| Reduced Motion OS toggle disables `<FadeIn>` | FND-05 | OS-level `prefers-reduced-motion` requires real browser | macOS: System Settings → Accessibility → Display → "Reduce motion" ON → reload → confirm `<FadeIn>` renders with `opacity: 1` instantly (no transition). |
| Vercel deploy on push to `main` | DPL-01 | External CI behavior — requires git push + Vercel dashboard | `git push origin main`. Within 5 minutes, a new Vercel deployment appears in the project dashboard, targeting a preview/production URL. |
| WCAG AA contrast on deployed URL | FND-07 | axe-core CLI needs live URL; matches user experience | `pnpm dlx @axe-core/cli <vercel-preview-url> --exit` returns exit 0 (no violations). |
| Visual check: `<FadeIn>` visible moment on home, nav + footer present, dark theme | FND-06, success criterion #1 | Visual confirmation of rendered output | Load deployed URL in browser, confirm nav with wordmark + 4 links, footer with 3 icons + view-source, dark theme active, fade-in moment visible on page load. |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 20s quick / 90s full
- [ ] `nyquist_compliant: true` set in frontmatter after plan-phase verification pass

**Approval:** pending
