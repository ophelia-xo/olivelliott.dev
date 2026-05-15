---
phase: 3
slug: project-detail-template
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-15
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution. Derived from `03-RESEARCH.md` § Validation Architecture.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 1.x (jsdom env) |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `pnpm vitest run --reporter=dot` |
| **Full suite command** | `pnpm vitest run && pnpm typecheck && pnpm build` |
| **Estimated runtime** | ~25s quick / ~75s full (typecheck + build dominate) |

---

## Sampling Rate

- **After every task commit:** Run `pnpm vitest run --reporter=dot`
- **After every plan wave:** Run full suite (`pnpm vitest run && pnpm typecheck && pnpm build`)
- **Before `/gsd:verify-work`:** Full suite must be green AND `pnpm build` must produce `/projects/myco` in static output
- **Max feedback latency:** 25 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-00-01 | 00 | 0 | infra | dep-install | `pnpm ls rehype-pretty-code shiki rehype-slug rehype-autolink-headings` | ❌ W0 | ⬜ pending |
| 03-00-02 | 00 | 0 | PRJ-02 | build | `pnpm build` (rehype chain wired in next.config.ts) | ❌ W0 | ⬜ pending |
| 03-00-03 | 00 | 0 | PRJ-07 | file-exists | `test -f public/og-default.png` | ❌ W0 | ⬜ pending |
| 03-01-01 | 01 | 1 | PRJ-02 | unit | `pnpm vitest run tests/mdx/components.test.tsx` (Figure renders img + caption) | ❌ W0 | ⬜ pending |
| 03-01-02 | 01 | 1 | PRJ-02 | unit | `pnpm vitest run tests/mdx/components.test.tsx` (Gallery renders 2-up + 3-up grids) | ❌ W0 | ⬜ pending |
| 03-01-03 | 01 | 1 | PRJ-02 | unit | `pnpm vitest run tests/mdx/components.test.tsx` (Callout note/warn/quote variants) | ❌ W0 | ⬜ pending |
| 03-01-04 | 01 | 1 | PRJ-02 | unit | `pnpm vitest run tests/mdx/prose.test.tsx` (MDXProse applies max-w-prose) | ❌ W0 | ⬜ pending |
| 03-02-01 | 02 | 2 | PRJ-01 | unit | `pnpm vitest run tests/projects/static-params.test.ts` (generateStaticParams returns Myco) | ❌ W0 | ⬜ pending |
| 03-02-02 | 02 | 2 | PRJ-01 | unit | `pnpm vitest run tests/projects/page.test.tsx` (unknown slug → notFound) | ❌ W0 | ⬜ pending |
| 03-02-03 | 02 | 2 | PRJ-04 | unit | `pnpm vitest run tests/projects/hero.test.tsx` (placeholder src → text-only hero) | ❌ W0 | ⬜ pending |
| 03-02-04 | 02 | 2 | PRJ-04 | unit | `pnpm vitest run tests/projects/hero.test.tsx` (real src → image hero) | ❌ W0 | ⬜ pending |
| 03-02-05 | 02 | 2 | PRJ-06 | unit | `pnpm vitest run tests/projects/privacy.test.tsx` (private fixture → "code private" rendered, no repo link) | ❌ W0 | ⬜ pending |
| 03-02-06 | 02 | 2 | PRJ-05 | unit | `pnpm vitest run tests/projects/next-block.test.tsx` (related → top tag-overlap) | ❌ W0 | ⬜ pending |
| 03-02-07 | 02 | 2 | PRJ-05 | unit | `pnpm vitest run tests/projects/next-block.test.tsx` (no overlap → cyclic by order) | ❌ W0 | ⬜ pending |
| 03-02-08 | 02 | 2 | PRJ-05 | unit | `pnpm vitest run tests/projects/next-block.test.tsx` (single-project → /projects link) | ❌ W0 | ⬜ pending |
| 03-02-09 | 02 | 2 | PRJ-07 | unit | `pnpm vitest run tests/projects/metadata.test.ts` (title/description/canonical/openGraph chain) | ❌ W0 | ⬜ pending |
| 03-02-10 | 02 | 2 | PRJ-07 | unit | `pnpm vitest run tests/projects/metadata.test.ts` (OG fallback: ogImage → hero.src non-placeholder → og-default) | ❌ W0 | ⬜ pending |
| 03-02-11 | 02 | 2 | PRJ-03 | (existing) | content-load.test.ts already asserts H2 anchors + word budget on Myco | ✅ | ✅ green |
| 03-03-01 | 03 | 3 | PRJ-01..07 | build-smoke | `pnpm build && grep -q "<title>Myco" .next/server/app/(site)/projects/myco.html` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Install: `rehype-pretty-code@^0.14`, `shiki@^3.23`, `rehype-slug@^6`, `rehype-autolink-headings@^7` as runtime deps (Next.js needs them at build time, resolved from `dependencies`).
- [ ] Extend `next.config.ts` `withMDX` rehype chain with the four plugins in order: `rehype-slug` → `rehype-autolink-headings` → `rehype-pretty-code` (string-form registration; options as serializable objects only — Turbopack constraint).
- [ ] Stub `/public/og-default.png` (1200×630, dark background, typographic site mark) so per-page metadata fallback chain doesn't 404 when shared.
- [ ] Add `tests/mdx/components.test.tsx` — Figure / Gallery / Callout smoke tests.
- [ ] Add `tests/mdx/prose.test.tsx` — MDXProse wrapper width assertion.
- [ ] Add `tests/projects/static-params.test.ts` — `generateStaticParams()` enumerates Myco.
- [ ] Add `tests/projects/page.test.tsx` — unknown-slug `notFound()` behavior.
- [ ] Add `tests/projects/hero.test.tsx` — placeholder vs real `hero.src` rendering branches.
- [ ] Add `tests/projects/privacy.test.tsx` — private-project fixture (lifted from Phase 2 `tests/fixtures/projects/`) renders `code private` label and zero repo links.
- [ ] Add `tests/projects/next-block.test.tsx` — three NextProjectBlock branches (related / cyclic / single-project fallback).
- [ ] Add `tests/projects/metadata.test.ts` — `generateMetadata()` output assertions including OG fallback chain.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Visual hero treatment matches UI-SPEC composition | PRJ-04 | Layout/typography aesthetic judgment cannot be auto-asserted | `pnpm dev` → visit `/projects/myco`, compare against UI-SPEC Hero Variant B (Myco currently triggers placeholder → text-only) |
| Code-block syntax highlighting renders Vesper theme | PRJ-02 | Visual theme correctness; tests assert classes are present, not visual fidelity | `pnpm build && pnpm start` → load `/projects/myco`, inspect a `<pre>`, confirm token spans use Vesper palette |
| Heading anchor `#` reveals on hover/focus only | PRJ-02 | CSS `:hover` / `:focus` state cannot be reliably tested in jsdom | `pnpm dev` → tab through H2 anchors; hover with mouse; verify `#` appears in `--color-text-tertiary` |
| Reduced-motion fallback on NextProjectBlock | PRJ-05 | `prefers-reduced-motion` media-query gating tested behavior, not implementation | macOS System Settings → Accessibility → Reduce Motion ON, reload `/projects/myco`, hover NextProjectBlock — confirm no `translateX`, underline still appears |
| Per-route OG image renders at full 1200×630 | PRJ-07 | Visual rendering of static asset cannot be tested in jsdom | `curl -I http://localhost:3000/og-default.png` → 200 + correct `Content-Length`; preview via Twitter/LinkedIn cards inspector pre-launch |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING test files
- [ ] No watch-mode flags (`pnpm vitest run`, never `pnpm vitest`)
- [ ] Feedback latency < 25s
- [ ] `nyquist_compliant: true` set in frontmatter after planner verifies coverage

**Approval:** pending
