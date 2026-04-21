---
phase: 01-foundation
plan: 01
status: complete
completed: 2026-04-21
---

# Plan 01-01 — Tokens + Globals CSS + cn() Helper (Summary)

## What was built

Wired the Tailwind v4 `@theme` token layer in `styles/tokens.css` with every UI-SPEC token verbatim. Authored `app/globals.css` with Tailwind + tokens imports, reduced-motion floor, and global `:focus-visible` accent outline. Shipped `lib/utils.ts` with the `cn()` helper every downstream component consumes.

## Tasks

| Task | Status |
|------|--------|
| 1.1 styles/tokens.css with @theme block | ✓ |
| 1.2 app/globals.css + lib/utils.ts cn() | ✓ |

## Key files

| Path | Purpose |
|------|---------|
| `styles/tokens.css` | Tailwind v4 `@theme` block — 25 tokens (fonts, type, weights, trackings, spacing, 11 colors, 4 motion, 4 radii) |
| `app/globals.css` | Tailwind + tokens import; html/body base; tabular-nums utility; reduced-motion floor; `:focus-visible` accent outline |
| `lib/utils.ts` | `cn(...inputs: ClassValue[]): string` — `twMerge(clsx(...))` |

## Tokens declared (verbatim from UI-SPEC)

Colors: `--color-bg #0a0a0a`, `--color-surface-1 #0a0a0a`, `--color-surface-2 #141414`, `--color-hairline #1f1f1f`, `--color-text-primary #f5f5f5`, `--color-text-secondary #a3a3a3`, `--color-text-tertiary #737373`, `--color-text-on-accent #0a0a0a`, `--color-accent #fbbf24`, `--color-accent-hover #f59e0b`, `--color-danger #f87171`.

Type scale: `--text-body 1rem/1.6`, `--text-label 0.875rem/1.4`, `--text-display clamp(2rem, 5vw, 3rem)/1.15`.

Motion: `--motion-duration-fast 120ms`, `--motion-duration-base 220ms`, `--motion-duration-slow 420ms`, `--motion-ease-standard cubic-bezier(0.22, 1, 0.36, 1)`.

No indigo / violet / purple tokens anywhere (enforced by `tokens.test.ts`).

## Test-suite status

```
tests/tokens.test.ts:    29/29 GREEN
tests/contrast.test.ts:   7/7  GREEN
```

## Deviations

- **tsconfig excludes `tests/`** — tsc --noEmit failed on RED spec files referencing components Plan 01-04 will create (e.g. `components/site/skip-link`). Excluded from typecheck; vitest resolves its own types. Contract preserved: test files still fail at runtime as expected until implementation lands.

## Downstream consumers

| Consumer | Uses |
|----------|------|
| Plan 01-02 | `app/globals.css` import in root layout; tokens resolve via `@theme` at build |
| Plan 01-03 | `--motion-duration-base`, `--motion-ease-standard` in MotionProvider / FadeIn |
| Plan 01-04 | `cn()` in NavLink; `--color-accent` in SkipLink focus style; `--color-hairline` in footer border |
| Plan 01-05 | `--color-text-primary`, `--font-sans` for home placeholder; `--color-accent` for 404 back-link |
