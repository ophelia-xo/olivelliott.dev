---
phase: 01-foundation
plan: 03
status: complete
completed: 2026-04-21
---

# Plan 01-03 — Motion Infrastructure (Summary)

## Files

| Path | Contract |
|------|----------|
| `components/motion/motion-provider.tsx` | `LazyMotion features={domAnimation} strict` + `MotionConfig reducedMotion="user"` + default transition (220ms, ease-out-expo) |
| `components/motion/fade-in.tsx` | `<m.div>` (strict mode), `initial={{opacity:0}}` → `animate={{opacity:1}}`, **NO transforms** |

## Tests

```
tests/motion-provider.test.ts: 6/6 GREEN
tests/fade-in.test.ts:         7/7 GREEN
```

Including the negative assertions (no y/x/scale/rotate/skew anywhere in `fade-in.tsx`).

## Downstream

- Plan 01-04 mounts `<MotionProvider>` at the top of `(site)/layout.tsx`.
- Plan 01-05 wraps the home placeholder tagline in `<FadeIn>` to satisfy success criterion #3.
