---
phase: 4
slug: home-projects-index
status: complete
nyquist_compliant: true
wave_0_complete: true
created: 2026-05-16
completed: 2026-05-17
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling. Derived from `04-RESEARCH.md` § Validation Architecture.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 1.x (jsdom) — already installed Phases 1–3 |
| **Config file** | `vitest.config.ts` (mdxShim plugin from Phase 3 already wired; no changes for Phase 4) |
| **Quick run command** | `pnpm vitest run --reporter=dot` |
| **Full suite command** | `pnpm vitest run && pnpm typecheck && pnpm build` |
| **Estimated runtime** | ~30s quick / ~85s full |

---

## Sampling Rate

- **After every task commit:** `pnpm vitest run --reporter=dot`
- **After every plan wave:** full suite
- **Before `/gsd:verify-work`:** full suite green + `pnpm build` produces `/` and `/projects` in static output (or dynamic if filter is engaged)
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | Status |
|---------|------|------|-------------|-----------|-------------------|--------|
| 04-00-01 | 00 | 0 | HOM-05 | unit | `pnpm vitest run tests/home/thesis-paragraph.test.tsx` (mounted = false initially, opacity 0 then 1) | ⬜ pending |
| 04-00-02 | 00 | 0 | HOM-05 | unit | reduced-motion → words render at opacity 1 immediately | ⬜ pending |
| 04-01-01 | 01 | 1 | HOM-02 | unit | `pnpm vitest run tests/projects/project-card-hero.test.tsx` (image variant) | ⬜ pending |
| 04-01-02 | 01 | 1 | HOM-02 | unit | text-only variant when isPlaceholderHero true | ⬜ pending |
| 04-01-03 | 01 | 1 | PIX-04 | unit | `code private` label rendered for private fixture | ⬜ pending |
| 04-01-04 | 01 | 1 | HOM-03 | unit | `pnpm vitest run tests/projects/project-card-secondary.test.tsx` (default render, no outcomes, no image) | ⬜ pending |
| 04-01-05 | 01 | 1 | PIX-04 | unit | `hero` prefix label rendered when `hero` prop true | ⬜ pending |
| 04-02-01 | 02 | 2 | HOM-01, HOM-02, HOM-03 | unit | `pnpm vitest run tests/home/page.test.tsx` (wordmark + role + thesis + hero cards + secondary cards rendered) | ⬜ pending |
| 04-02-02 | 02 | 2 | HOM-04 | unit | no bento grid (assert no fixed grid > 2 cols on hero section); no whileInView/staggerChildren in source | ⬜ pending |
| 04-02-03 | 02 | 2 | HOM-05 | unit | one and only one motion island on home (ThesisParagraph) | ⬜ pending |
| 04-03-01 | 03 | 3 | PIX-01 | unit | `pnpm vitest run tests/projects/tag-filter-row.test.tsx` (renders chips from getAllTags()) | ⬜ pending |
| 04-03-02 | 03 | 3 | PIX-02 | unit | active chip href clears filter (= `/projects`) | ⬜ pending |
| 04-03-03 | 03 | 3 | PIX-03 | unit | chips are `<a>` elements with aria-current="true" on active | ⬜ pending |
| 04-04-01 | 04 | 3 | PIX-01, PIX-02 | unit | `pnpm vitest run tests/projects/index-page.test.tsx` (no tag → getAll, with tag → getProjectsByTag) | ⬜ pending |
| 04-04-02 | 04 | 3 | PIX-01 | unit | tier separator hides when no secondary results | ⬜ pending |
| 04-04-03 | 04 | 3 | PIX-01 | unit | empty filter state renders with locked copy + clear link | ⬜ pending |
| 04-04-04 | 04 | 3 | PIX-04 | unit | hero-tier projects appear above secondary on index | ⬜ pending |
| 04-05-01 | 05 | 4 | HOM-01..05, PIX-01..04 | build-smoke | `pnpm build && test -f .next/server/app/page.html && grep -q "olive elliott" .next/server/app/page.html` | ⬜ pending |

---

## Wave 0 Requirements

- [ ] No dependency installs needed (verified by research).
- [ ] Add `tests/home/thesis-paragraph.test.tsx` — SSR + reduced-motion gating.
- [ ] Add `tests/projects/project-card-hero.test.tsx` — image vs text-only branches, private label.
- [ ] Add `tests/projects/project-card-secondary.test.tsx` — default + hero-prefix label branches.
- [ ] Add `tests/home/page.test.tsx` — home composition.
- [ ] Add `tests/projects/tag-filter-row.test.tsx` — chip rendering + active state + ARIA.
- [ ] Add `tests/projects/index-page.test.tsx` — searchParams branching + tier separator visibility + empty state.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Type-set thesis entrance feels editorial, not gimmicky | HOM-05 | Motion timing perception | `pnpm dev` → load `/`, watch the thesis paragraph render |
| Reduced-motion truly produces instant render | HOM-05 | OS-level setting; cannot reliably test in jsdom | macOS Reduce Motion ON, reload `/` — confirm no fade, words appear instantly |
| Card hover/focus feels right | HOM-02, HOM-03 | Aesthetic judgment | tab through cards, hover with mouse, observe color/border transitions |
| Active filter chip color contrast in browser | PIX-04 | Visual rendering | `/projects?tag=local-first` — confirm accent fill is legible |
| Back button restores filter state | PIX-02 | Browser behavior | navigate `/projects → ?tag=X → /` → back → back; URL + UI restored |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify
- [ ] No 3-task gap without automated verify
- [ ] Wave 0 covers all missing test files
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set after planner verifies coverage

**Approval:** pending
