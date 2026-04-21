---
phase: 01-foundation
plan: 02
status: complete
completed: 2026-04-21
---

# Plan 01-02 — Root Layout + Providers + (site) Skeleton (Summary)

## What was built

| Path | Role |
|------|------|
| `app/layout.tsx` | RSC root — Geist fonts, metadataBase, suppressHydrationWarning, Providers wrap |
| `app/providers.tsx` | `'use client'` — next-themes dark-only ThemeProvider |
| `app/(site)/layout.tsx` | Minimal route-group layout with `<main id="main">` (superseded by Plan 01-04) |

## Tests

```
tests/layout.test.tsx:    9/9 GREEN
tests/providers.test.tsx: 6/6 GREEN
```

## Key decisions

- Inline body style uses `var(--color-bg)` / `var(--color-text-primary)` directly rather than relying on Tailwind utility name emission (`bg-bg`) — belt-and-braces against any v4 utility generation drift.
- `suppressHydrationWarning` lives on `<html>` only, not `<body>` or children (per PITFALLS.md Pitfall 6).
- `disableTransitionOnChange` on ThemeProvider prevents a brief flash when next-themes hydrates.

## Downstream

- Plan 01-04 replaces `(site)/layout.tsx` with the full shell (MotionProvider + SkipLink + Nav + Footer around `<main>`).
- Plan 01-05 drops `app/(site)/page.tsx` (home placeholder) and `app/not-found.tsx` under this layout.
