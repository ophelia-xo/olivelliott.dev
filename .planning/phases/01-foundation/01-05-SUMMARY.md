---
phase: 01-foundation
plan: 05
status: complete
completed: 2026-04-21
---

# Plan 01-05 — Home Placeholder + Custom 404 (Summary)

## Files

| Path | Role |
|------|------|
| `app/(site)/page.tsx` | Home at `/` — display headline + FadeIn-wrapped tagline |
| `app/not-found.tsx` | Custom 404 page |
| `app/page.tsx` | **Deleted** (scaffold conflict with `(site)/page.tsx`) |

## Local smoke test (dev server)

```
GET /                        → 200, HTML contains: "olivelliott.dev",
                                "olive elliott", "under construction",
                                "Skip to content", "view source"
GET /does-not-exist-abc123   → 404, HTML contains "back home"
pnpm build                   → exit 0, 2 routes (/, /_not-found)
pnpm typecheck               → exit 0
```

## Copywriting (UI-SPEC locked — no drift)

| Surface | String |
|---------|--------|
| Home display | `olivelliott.dev` |
| Home tagline | `under construction. real projects arrive in phase 4.` |
| 404 display | `404` |
| 404 body | `not found — that route doesn’t exist yet.` |
| 404 link | `→ back home` |

Banned-word scan: clean (no "passionate", "scalable", "crafted", etc.).

## Success criteria 1–4 (local)

- [x] Dark-theme page with Geist fonts loads at `/` — ✓ SSR HTML confirms
- [x] Site nav + footer scaffold + skip-link target (`#main`) present — ✓ HTML contains `id="main"`, wordmark, 4 nav links, 3 footer icon links, "view source"
- [x] Custom 404 route renders — ✓ `/does-not-exist-abc123` returns HTTP 404 with "back home" link

## Deferred — Checkpoint 5.3 (browser-manual items)

These require an interactive browser; deferred to post-deploy HUMAN-UAT in Plan 01-06:

1. Keyboard Tab order: wordmark → 4 nav links → footer icons → view-source
2. macOS reduced-motion OS toggle collapses `<FadeIn>` to opacity:1 instantly
3. `pnpm dlx @axe-core/cli <preview-url> --exit` returns zero violations on deployed preview
4. Visual contrast spot-check — every color pair matches UI-SPEC "Verified pairings"

## Downstream

Plan 01-06 wires Vercel deploy-on-push and runs the deferred browser-manual verifications against the production URL.
