---
phase: 2
slug: content-pipeline
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-21
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 3.x (installed; jsdom env, `@/*` alias) |
| **Config file** | `vitest.config.ts` (existing — Phase 1) |
| **Quick run command** | `pnpm test tests/content/` |
| **Full suite command** | `pnpm test:ci` |
| **Estimated runtime** | ~2 s (phase tests), ~10 s (full suite) |

---

## Sampling Rate

- **After every task commit:** Run `pnpm test tests/content/`
- **After every plan wave:** Run `pnpm test:ci`
- **Before `/gsd:verify-work`:** Full suite AND `pnpm typecheck` AND `pnpm lint` AND `pnpm build` must all be green
- **Max feedback latency:** 2 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 2-00-01 | 00-packages | 0 | CNT-01 | infra | `pnpm list gray-matter remark-frontmatter` | ❌ W0 | ⬜ pending |
| 2-00-02 | 00-packages | 0 | CNT-01 | infra | `pnpm build` (smoke) | ❌ W0 | ⬜ pending |
| 2-01-01 | 01-schema | 1 | CNT-02 | unit | `pnpm test tests/content/schema.test.ts` | ❌ W0 | ⬜ pending |
| 2-01-02 | 01-schema | 1 | CNT-02 | unit | schema.test.ts (reject unknown tag) | ❌ W0 | ⬜ pending |
| 2-01-03 | 01-schema | 1 | CNT-02 | unit | schema.test.ts (reject outcomes > 5) | ❌ W0 | ⬜ pending |
| 2-01-04 | 01-schema | 1 | CNT-03 | unit | `pnpm test tests/content/privacy-transform.test.ts` | ❌ W0 | ⬜ pending |
| 2-01-05 | 01-schema | 1 | CNT-03 | unit | privacy-transform (auto code-private tag) | ❌ W0 | ⬜ pending |
| 2-01-06 | 01-schema | 1 | CNT-03 | unit | privacy-transform (strip links.repo) | ❌ W0 | ⬜ pending |
| 2-02-01 | 02-content-loader | 2 | CNT-01 | integration | `pnpm test tests/content/content-load.test.ts` | ❌ W0 | ⬜ pending |
| 2-02-02 | 02-content-loader | 2 | CNT-04 | unit | `pnpm test tests/content/tag-index.test.ts` | ❌ W0 | ⬜ pending |
| 2-02-03 | 02-content-loader | 2 | CNT-04 | unit | tag-index (getHeroProjects) | ❌ W0 | ⬜ pending |
| 2-02-04 | 02-content-loader | 2 | CNT-04 | unit | tag-index (getAllTags counts/sort) | ❌ W0 | ⬜ pending |
| 2-02-05 | 02-content-loader | 2 | CNT-04 | unit | tag-index (getRelatedProjects) | ❌ W0 | ⬜ pending |
| 2-03-01 | 03-myco-mdx | 3 | CNT-05 | integration | content-load (Myco exists, parses) | ❌ W0 | ⬜ pending |
| 2-03-02 | 03-myco-mdx | 3 | CNT-05 | integration | content-load (P/A/O H2 headings present) | ❌ W0 | ⬜ pending |
| 2-03-03 | 03-myco-mdx | 3 | CNT-05 | integration | content-load (tags include local-first, open-source, ai) | ❌ W0 | ⬜ pending |
| 2-04-01 | 04-redaction | 3 | CNT-06 | integration | `pnpm test tests/content/redaction.test.ts` | ❌ W0 | ⬜ pending |
| 2-04-02 | 04-redaction | 3 | CNT-06 | unit | redaction (banned term fixture fails as expected) | ❌ W0 | ⬜ pending |
| 2-04-03 | 04-redaction | 3 | CNT-06 | docs | `test -f .planning/phases/02-content-pipeline/02-REDACTION-REVIEW.md` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

All files below are created during execution:

- [ ] `gray-matter@4.0.3` and `remark-frontmatter@5.0.0` installed via `pnpm add`
- [ ] `next.config.ts` updated — `remarkPlugins: ['remark-frontmatter']` (string form for Turbopack)
- [ ] `mdx-components.tsx` at repo root — minimum viable `useMDXComponents()` stub
- [ ] `lib/tags.ts` — `TAGS` const + `TAG_LABELS`
- [ ] `lib/schemas.ts` — `ProjectFrontmatterSchema` with privacy `.transform()`
- [ ] `lib/content.ts` — `loadAll()` + `allProjects` + `Project` type
- [ ] `lib/projects.ts` — query helpers (`getAll`, `getHeroProjects`, `getProject`, `getAllTags`, `getProjectsByTag`, `getRelatedProjects`)
- [ ] `content/projects/myco.mdx` authored from README
- [ ] `tests/content/schema.test.ts`
- [ ] `tests/content/privacy-transform.test.ts`
- [ ] `tests/content/content-load.test.ts`
- [ ] `tests/content/tag-index.test.ts`
- [ ] `tests/content/redaction.test.ts`
- [ ] `tests/fixtures/projects/valid-hero.mdx`
- [ ] `tests/fixtures/projects/valid-private.mdx`
- [ ] `tests/fixtures/projects/invalid-tag.mdx`
- [ ] `tests/fixtures/banned-terms.ts` — shared banned-term constant
- [ ] `.planning/phases/02-content-pipeline/02-REDACTION-REVIEW.md` — redaction checklist document

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Dev warning fires when private project declares `links.repo` | CNT-03 (DX) | `console.warn` side-effect — asserted in unit test but real signal is on `pnpm dev` | Run `pnpm dev`; temporarily add `links.repo` to a private fixture; observe warning in terminal |
| Myco MDX reads well as prose | CNT-05 | Editorial judgement | Read `content/projects/myco.mdx` end-to-end; verify voice matches README, no AI-padding |
| Redaction checklist is comprehensive | CNT-06 | Policy review | Read `02-REDACTION-REVIEW.md`; confirm banned-term list + sign-off template |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 2s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
