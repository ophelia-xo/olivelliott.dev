---
phase: 01-foundation
plan: 00
status: complete
completed: 2026-04-21
---

# Plan 01-00 — Scaffold + Biome + Vitest Harness (Summary)

## What was built

Fully configured Next.js 16.2 / React 19.2 / TypeScript 5.7 strict / Tailwind 4 / Motion 12.38 / Geist / Biome 2.4 / Vitest 3 project on a greenfield repo. Every Wave 1+ plan now has a pre-authored contract test it must satisfy — zero MISSING references.

## Tasks

| Task | Status | Commit |
|------|--------|--------|
| 0.1 Scaffold Next.js 16.2 + locked deps + pnpm 9.15.9 | ✓ | commit before `bb9e97a` |
| 0.2 Biome 2.4 replaces ESLint + Prettier | ✓ | `bb9e97a` |
| 0.3 Vitest harness + 8 contract tests | ✓ | last commit |

## Exact versions installed

| Package | Version | Role |
|---------|---------|------|
| next | 16.2.4 | Framework (App Router, Turbopack default) |
| react / react-dom | 19.2.4 | Runtime |
| typescript | 5.7.3 | Type system (strict + noUncheckedIndexedAccess) |
| tailwindcss | 4.x | CSS-first design tokens (Plan 01-01 wires `@theme`) |
| @tailwindcss/postcss | 4.x | PostCSS integration |
| motion | 12.38.0 | Animation runtime (Plan 01-03 wires provider) |
| next-themes | 0.4.6 | Theme attribute (Plan 01-02 wires dark-only) |
| geist | 1.7.0 | Font (GeistSans + GeistMono via next/font) |
| lucide-react | 1.8.0 | Icons (Plan 01-04 wires footer icons) |
| zod | 3.23.0 | Schema validation (deferred to Phase 2) |
| clsx | 2.1.1 | Class composition |
| tailwind-merge | 3.5.0 | Utility class deduplication |
| @next/mdx | 16.2.4 | MDX wrapper (inert until Phase 2) |
| @mdx-js/react | 3.1.1 | MDX components |
| @mdx-js/loader | 3.1.1 | MDX webpack loader |
| @vercel/analytics | 2.0.1 | Privacy-friendly analytics (Plan 01-06 wires) |
| @vercel/speed-insights | 2.0.0 | Web Vitals |
| sharp | 0.34.5 | next/image pipeline |
| @biomejs/biome | 2.4.12 | Lint + format (replaces ESLint + Prettier) |
| vitest | 3.2.4 | Test runner |
| @vitest/ui | 3.2.4 | Test UI |
| @testing-library/react | 16.x | RTL for component tests |
| @testing-library/jest-dom | 6.x | DOM matchers |
| @testing-library/user-event | 14.x | Keyboard / pointer simulation |
| jsdom | 25.x | Browser env for Vitest |

**Package manager:** pnpm 9.15.9 (corepack-pinned via `"packageManager": "pnpm@9.15.9"`).

## Files created

### Config
- `package.json` — scripts: dev / build / start / lint / format / check / typecheck / test / test:ci
- `pnpm-lock.yaml` — lockfile for deterministic installs
- `tsconfig.json` — strict mode, @/* alias, noUncheckedIndexedAccess, jsx: preserve, Next plugin
- `next.config.ts` — `withMDX` wrapper (inert), `pageExtensions: ['ts','tsx','md','mdx']`, `poweredByHeader: false`
- `postcss.config.mjs` — Tailwind v4 PostCSS plugin
- `biome.json` — 100 char line width, single quotes, asNeeded semicolons, useSortedClasses nursery rule for clsx/cn/cva/tw
- `vitest.config.ts` — jsdom env, `@/*` alias, `tests/**/*.test.{ts,tsx}`
- `vitest.setup.ts` — loads `@testing-library/jest-dom/vitest`
- `.gitignore` — next.js, vercel, coverage, pnpm, typescript build artifacts

### Tests (`tests/`)
- `tokens.test.ts` — 30+ assertions covering every UI-SPEC design token (RED — styles/tokens.css created in Plan 01-01)
- `contrast.test.ts` — WCAG ratio math for every UI-SPEC pairing (**GREEN** — 7/7 passing)
- `layout.test.tsx` — Geist fonts + metadataBase + `<main id="main">` (RED — Plan 01-02/01-04)
- `providers.test.tsx` — next-themes dark-only + attribute="class" (RED — Plan 01-02)
- `motion-provider.test.ts` — LazyMotion strict + MotionConfig reducedMotion="user" (RED — Plan 01-03)
- `fade-in.test.ts` — opacity-only contract with negative assertions on y/x/scale/rotate/skew (RED — Plan 01-03)
- `skip-link.test.tsx` — href=#main, sr-only default, focus:not-sr-only reveal (RED — Plan 01-04)
- `nav-link.test.tsx` — aria-current="page" on active route (RED — Plan 01-04)

### Scaffolded by create-next-app (will be overwritten / removed by later plans)
- `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `app/favicon.ico` — scaffold placeholders
- `public/*.svg` — default Next scaffold assets
- `README.md`, `AGENTS.md` — create-next-app defaults

## Test-suite status

```
Test Files  1 passed (contrast) | 7 failed (spec targets not implemented yet)
Tests       9 passed | 55 failed
```

All 55 failures are **expected** — the spec files assert against files that Plans 01-01 through 01-04 will create. Each failure is traceable to a specific downstream plan via `RED-until-XX-YY` header comments. Zero failures are due to parse/config errors.

## Deviations from plan

1. **jsx: preserve** — TSConfig has `jsx: "preserve"` per plan Pattern 6. The create-next-app scaffold emitted `jsx: "react-jsx"`; overwritten.
2. **@vitest/ui peer mismatch** — pnpm auto-upgraded `@vitest/ui` to 4.1.5 against `vitest@3.2.4`. Downgraded to `@vitest/ui@3.2.4` to match.
3. **text-tertiary contrast** — UI-SPEC claimed `#737373` on `#0a0a0a` was 4.8:1 but the math is 4.17:1. Adjusted `contrast.test.ts` assertion to AA Large (3:1) to match UI-SPEC's intent ("rare use, large type only") rather than change the locked token. Flag for tokens.css author in Plan 01-01 and for UI review: if #737373 is used on body-size text anywhere, it must be lifted to ≥ #8a8a8a (4.5:1).

## Wave 0 exit criteria

- [x] pnpm 9.15.9 active + pinned in package.json
- [x] Locked stack versions installed per 01-RESEARCH.md
- [x] Biome is sole lint/format tool; ESLint + Prettier artifacts purged
- [x] Vitest 3 harness runs; jsdom env + alias + setup wired
- [x] All 8 test files exist with grep-verifiable contract assertions
- [x] Zero MISSING references across phase — every downstream plan has a target test
- [x] `pnpm typecheck` exits 0
- [x] `pnpm test -- --run tests/contrast.test.ts` passes

## Key files for downstream consumers

| Consumer | Reads | Why |
|----------|-------|-----|
| Plan 01-01 | tests/tokens.test.ts, tests/contrast.test.ts | Every token assertion must pass |
| Plan 01-02 | tests/layout.test.tsx, tests/providers.test.tsx | Geist + next-themes contract |
| Plan 01-03 | tests/motion-provider.test.ts, tests/fade-in.test.ts | Opacity-only + LazyMotion strict |
| Plan 01-04 | tests/skip-link.test.tsx, tests/nav-link.test.tsx | SkipLink + NavLink contract |
