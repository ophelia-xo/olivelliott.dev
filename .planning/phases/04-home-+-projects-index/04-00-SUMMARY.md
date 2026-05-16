---
phase: 04-home-+-projects-index
plan: 00
subsystem: home
tags: [motion, ssr, hydration, accessibility, tdd, wave-0]
one_liner: "ThesisParagraph client island — SSR-safe per-word opacity fade with explicit useReducedMotion gate"
requires:
  - "components/motion/motion-provider.tsx (Phase 1 LazyMotion strict + MotionConfig)"
  - "motion@^12.38.0 (m, useReducedMotion exports)"
  - "react@19.2 (useState, useEffect)"
provides:
  - "ThesisParagraph: (text: string, className?: string) => ReactElement — the one earned motion moment of v1, ready for HomeHero composition in Plan 02"
affects:
  - "Plan 02 (HomeHero): can import ThesisParagraph; typography classes pass down via className prop (RESEARCH Q2 recommendation)"
tech_added: []
patterns:
  - "Two-stage mounted gate: useState(false) + useEffect(setMounted(true)) — locks the first client render to the SSR shape so hydration matches"
  - "Manual useReducedMotion() short-circuit on opacity — MotionConfig reducedMotion='user' does NOT cover opacity (Pitfall 4)"
  - "Per-test vi.doMock + vi.resetModules + dynamic await import — swaps useReducedMotion return value without partial-mock module-shape errors (Pitfall 8)"
  - "renderToString from react-dom/server — the only way to assert SSR-shell HTML in jsdom + React 19 (render() flushes mount effects synchronously)"
files_created:
  - "components/home/thesis-paragraph.tsx"
  - "tests/home/thesis-paragraph.test.tsx"
files_modified: []
decisions:
  - "Adopted RESEARCH § Pattern 4 'corrected SSR-safe shape' verbatim — naive shape (no mounted gate) renders flash-of-invisible-text because useReducedMotion() returns null on server (falsy → opacity 0 branch)"
  - "Test SSR assertion uses renderToString, not @testing-library/react render() — RTL under React 19 commits effects synchronously, so render().container reflects POST-mount state. renderToString is the only mechanism that captures the pre-hydration HTML the server actually emits. Plan's intent preserved; mechanism corrected."
  - "Hand-rolled delay = wordIndex * 0.03 over variants + staggerChildren — transparent in tests, avoids pushing a second reduced-motion gate onto a wrapper <m.p>, plays well with the existing motion/react Proxy mock"
metrics:
  duration_minutes: 2
  tasks: 2
  files_changed: 2
  tests_added: 5
  tests_total: 212
  baseline_tests: 207
  completed_at: "2026-05-16"
---

# Phase 4 Plan 00: ThesisParagraph Summary

## One-liner

ThesisParagraph client island — SSR-safe per-word opacity fade with explicit useReducedMotion gate. The single load-bearing motion component of Phase 4, locked first (Wave 0) before any consumer.

## Tasks Completed

| Task | Name | Commit | Files |
| ---- | ---- | ------ | ----- |
| 04-00-01 | RED: failing spec for ThesisParagraph (SSR + reduced-motion + segmented) | `a219fb7` | `tests/home/thesis-paragraph.test.tsx` |
| 04-00-02 | GREEN: implement ThesisParagraph satisfying SSR + reduced-motion + segmented contract | `7db3851` | `components/home/thesis-paragraph.tsx`, `tests/home/thesis-paragraph.test.tsx` (SSR assertion correction) |

## Files Created

- `components/home/thesis-paragraph.tsx` — 89 lines. `'use client'`. Exports named `ThesisParagraph({ text, className })`. Two-stage `mounted` gate + explicit `useReducedMotion()` short-circuit. Per-word `<m.span>` with `delay = wordIndex * 0.03`, `duration = 0.18`, `ease = [0.22, 1, 0.36, 1]`. Whitespace segments render in plain `<span aria-hidden="true">` at opacity 1.
- `tests/home/thesis-paragraph.test.tsx` — 173 lines. 5 test cases covering: SSR fallback (renderToString), reduced-motion, motion-permitted segmentation, className passthrough in both branches, source-level banned-word guard.

## The useReducedMotion + Mounted-State Pattern (locked for Plan 02 consumer)

Plan 02's `<HomeHero>` composes `<ThesisParagraph>` and should pass typography classes via the `className` prop. The component owns ONLY the segmentation + motion logic — body / Geist Sans / 400 / leading-1.6 / `--color-text-secondary` / `max-w-[55ch]` belong to the parent (per RESEARCH § Open Question 2 recommendation).

**Component contract:**
```tsx
<ThesisParagraph
  text="..."                                  // plain-string thesis copy (Plan 02 placeholder, Phase 7 final copy)
  className="font-sans text-body text-..."    // typography stack owned by HomeHero
/>
```

**SSR / hydration / reduced-motion state machine:**

| State | `mounted` | `prefersReduced` | Renders |
| ----- | --------- | ---------------- | ------- |
| Server pass | `false` (initial useState) | `null` (no matchMedia) | Plain `<p class={className}>{text}</p>` |
| First client render (pre-effect) | `false` | `null` or `boolean` | Plain `<p>` — matches SSR exactly, no hydration warning |
| Post-mount, motion permitted | `true` | `false` | Per-word `<m.span>` segments |
| Post-mount, reduced-motion ON | `true` | `true` | Plain `<p>` forever — no flicker |

This is the corrected shape from RESEARCH § Pattern 4. The naive shape (no mounted gate) would render flash-of-invisible-text because `useReducedMotion()` returns `null` on the server, and `null` is falsy, so `shouldReduce ? 1 : 0` resolves to `0` and SSR HTML emits every word at opacity 0.

## Test Coverage

5 cases, all green:

1. **SSR fallback / pre-hydration** (renderToString) — server HTML is `<p class="x">I work on Myco.</p>` with zero `<span>` elements. The plain shell is what bots, no-JS users, and screen readers see immediately.
2. **Reduced-motion ON** — after `act(async () => {})` flushes the mount effect, `<p>` STAYS plain (zero spans). Locks Pitfall 4: opacity persists under MotionConfig unless manually gated.
3. **Motion permitted** — after mount, `<p>` contains ≥ 4 spans (actual: 7 for "I work on Myco." = 4 word spans + 3 whitespace spans). Full text content preserved.
4. **className passthrough** — both branches (SSR shell + segmented form) apply the supplied `className` to the `<p>`.
5. **Source banned-word guard** — reads `components/home/thesis-paragraph.tsx` via `readFileSync` and asserts none of `[passionate, scalable solutions, cutting-edge, 10x, crafted, seamless, leveraging, synergy, rockstar, ninja, innovative, transformative, ecosystem, paradigm, next-generation]` appear (case-insensitive). Locks the file's own comments/identifiers against AI-template drift.

Full suite: **212/212 passing** (207 baseline + 5 new). `pnpm typecheck` exit 0.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 — Test bug] SSR-fallback assertion mechanism corrected**
- **Found during:** Task 04-00-02 GREEN verification (first test run after implementation landed)
- **Issue:** The plan's `<behavior>` for Test 1 instructed: "read `container.querySelector('p.x')` IMMEDIATELY (do NOT `await act(...)` first)". Under React 19 + jsdom, `@testing-library/react`'s `render()` flushes mount effects synchronously inside the `render()` call itself — there is no "pre-hydration window" to query. The test failed `expected 7 to be 0` because by the time `container` was inspected, `mounted` was already `true` and the segmented form had rendered.
- **Fix:** Swapped Test 1's mechanism from `render()` + immediate query to `renderToString(<ThesisParagraph ... />)` from `react-dom/server`. This is the actual SSR pass — exactly what Next.js emits in the server pipeline. Assertions changed from DOM queries to HTML-string `.toContain` / `.not.toContain` checks. The contract being verified is identical (server HTML is a plain `<p>` with no segmented spans); only the measurement instrument changed.
- **Files modified:** `tests/home/thesis-paragraph.test.tsx` (one test case + one new import).
- **Commit:** `7db3851` (bundled with GREEN — the implementation was already correct; only the test instrumentation needed the fix).

No other deviations. No authentication gates encountered. No architectural changes needed.

## Next-Phase Readiness (Plan 02 — HomeHero composer)

Plan 02 can import directly:

```tsx
import { ThesisParagraph } from '@/components/home/thesis-paragraph'
```

Wave 0 of Phase 4 done. Plan 02 (HomeHero) is now unblocked. Wave 1 cards (Plans 01 / 03) can run in parallel — they have no dependency on this file. The single client-island boundary of Phase 4 is locked.

## Known Stubs

None. ThesisParagraph receives `text` as a string prop — Plan 02 supplies the placeholder copy at the page level (where the Phase 7 content pass replaces it). The component itself has no data wiring of its own.

## Self-Check: PASSED

- `components/home/thesis-paragraph.tsx` — FOUND
- `tests/home/thesis-paragraph.test.tsx` — FOUND
- `.planning/phases/04-home-+-projects-index/04-00-SUMMARY.md` — FOUND
- Commit `a219fb7` (RED) — FOUND in git log
- Commit `7db3851` (GREEN) — FOUND in git log
