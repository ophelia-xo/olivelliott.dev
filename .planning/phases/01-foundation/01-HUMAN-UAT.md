---
status: partial
phase: 01-foundation
source: [01-VERIFICATION.md]
started: 2026-04-21
updated: 2026-04-21
---

## Current Test

[awaiting human testing]

## Tests

### 1. Vercel + GitHub deploy pipeline (DPL-01)
expected: Push to main triggers a Vercel deployment within minutes; deployed URL serves / and 404 with correct content
result: [pending]

### 2. Keyboard tab order on running dev server or deployed URL
expected: Tab reveals SkipLink first; order is wordmark → projects → about → resume → contact → GitHub icon → Email icon → LinkedIn icon → view source; every focused element has a visible 2px amber outline
result: [pending]

### 3. macOS Reduce Motion toggle on running site
expected: FadeIn tagline appears at opacity 1 instantly when Reduce Motion is enabled; fades over 220ms when disabled
result: [pending]

### 4. axe-core scan on / and a 404 URL
expected: `pnpm dlx @axe-core/cli <url> --exit` returns 0 violations on both pages
result: [pending]

### 5. Visual spot-check — no AI-aesthetic tells
expected: No gradient backgrounds, no indigo/violet/purple color anywhere, no emoji in nav or headers, no rounded chrome on nav/footer/wordmark
result: [pending]

## Summary

total: 5
passed: 0
issues: 0
pending: 5
skipped: 0
blocked: 0

## Gaps
