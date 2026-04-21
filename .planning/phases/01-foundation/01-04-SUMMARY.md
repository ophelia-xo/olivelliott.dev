---
phase: 01-foundation
plan: 04
status: complete
completed: 2026-04-21
---

# Plan 01-04 — Site Shell (Summary)

## Files

| Path | Role |
|------|------|
| `components/site/skip-link.tsx` | sr-only → focus-visible anchor to `#main` |
| `components/site/word-mark.tsx` | `<a href="/">` wordmark with amber bar + "olive elliott" |
| `components/site/nav-link.tsx` | `'use client'` — usePathname active-route detection |
| `components/site/nav.tsx` | 72px header, hairline border, max-w-6xl, 4 links |
| `components/site/footer.tsx` | © + GitHub/mailto/LinkedIn icons + view-source |
| `components/site/brand-icons.tsx` | Inline `GithubIcon` + `LinkedinIcon` SVG |
| `app/(site)/layout.tsx` | Replaced — `MotionProvider > SkipLink > Nav > main > Footer` |

## Tests

```
tests/skip-link.test.tsx: 5/5 GREEN
tests/nav-link.test.tsx:  5/5 GREEN
pnpm typecheck:           0
pnpm build:               0
```

## Deviations

- **lucide-react dropped `Github` and `Linkedin` exports** in a recent major (brand/trademark icons removed from the library). Replaced with inline SVG components in `components/site/brand-icons.tsx` matching lucide's 1.75 stroke, round-joins visual weight. Kept `Mail` from lucide.

## Downstream

- Plan 01-05 drops `app/(site)/page.tsx` (home placeholder) and `app/not-found.tsx`.
- Plan 01-06 wires Vercel deploy.
- Phase 4 adds mobile hamburger to `nav.tsx` (noted TODO).
