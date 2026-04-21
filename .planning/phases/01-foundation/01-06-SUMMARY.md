---
phase: 01-foundation
plan: 06
status: deferred
completed: 2026-04-21
---

# Plan 01-06 — Vercel Deploy (Deferred)

## Status

**Deferred to interactive HUMAN-UAT.** User chose "Defer deploy — continue to Phase 2" at Phase 1 wrap-up on 2026-04-21.

## Why deferred

DPL-01 ("push to main auto-deploys to Vercel") requires interactive auth that cannot be scripted from autonomous mode:

1. `vercel login` — requires interactive OAuth or email magic-link; existing token was expired.
2. GitHub remote — no `origin` configured on this greenfield repo; `gh repo create` needs repo-name + visibility confirmation.

## What's left

Completing this plan in a later interactive session:

1. `gh auth status` → confirm logged in as the intended GitHub account (currently `olivelliott` in local CLI).
2. `gh repo create <name> --public --source . --remote origin --push` → create + push origin.
3. `vercel login` → interactive auth.
4. `vercel link` → link the repo to a new Vercel project.
5. `vercel --prod --yes` → first production deploy, yields the subdomain URL.
6. Add minimal `vercel.json` pinning pnpm install command (see 01-RESEARCH.md Pattern 7).
7. Smoke-test: push a one-line commit to `main` and verify a new deployment triggers within 5 minutes.

## HUMAN-UAT items (inherited from Plan 01-05 checkpoint 5.3)

Once deployed, run on the Vercel preview/production URL:

- [ ] **Keyboard tab order** — first Tab reveals SkipLink; sequential order wordmark → projects → about → resume → contact → 3 footer icons → view source.
- [ ] **macOS reduced motion** — System Settings → Accessibility → Display → "Reduce motion" ON, reload, confirm `<FadeIn>` tagline appears at opacity:1 with no transition.
- [ ] **axe-core scan** — `pnpm dlx @axe-core/cli <vercel-url> --exit` returns 0 violations.
- [ ] **Visual contrast spot-check** — every token pair renders per UI-SPEC "Verified pairings" table.
- [ ] **Deploy-on-push** — next `main` commit triggers a new Vercel deployment within ~5 minutes.

## Requirements status

DPL-01 is **NOT** validated yet. Track in:
- `.planning/REQUIREMENTS.md` — keep DPL-01 unchecked.
- This summary — gate to close before milestone audit (or explicitly accept as a v1.0.1 follow-up).

## Follow-up command

```
/gsd:execute-phase 1 --gaps-only   # if Plan 01-06 is re-scoped as a gap plan
# or just the two-step script manually:
#   gh repo create + vercel login + vercel link + vercel --prod --yes
```
