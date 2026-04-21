---
phase: 02-content-pipeline
verified: 2026-04-21T18:24:00Z
status: passed
score: 5/5 success criteria verified
re_verification: false
human_verification: []
gaps: []
---

# Phase 2: Content Pipeline Verification Report

**Phase Goal:** A typed, validated content system where projects are MDX files — not JSX pages — with privacy enforced at the schema layer, so every downstream page is a thin renderer over a single source of truth.

**Verified:** 2026-04-21T18:24:00Z
**Status:** passed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths (from ROADMAP Success Criteria)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | A developer can drop an MDX file into `content/projects/` with valid frontmatter, and it appears as queryable typed data at build time | VERIFIED | `content/projects/myco.mdx` loads via `lib/content.ts` module-init; `allProjects` populated; 12 tests in `content-load.test.ts` pass (6 Wave 2 loader tests + 6 CNT-05 integration tests binding to real `allProjects`); `pnpm build` succeeds end-to-end |
| 2 | Attempting to build with invalid frontmatter (bad slug, missing tier, unknown tag) fails the build with a clear Zod error | VERIFIED | `tests/content/schema.test.ts` asserts 11 cases: unknown tag rejected (`/tags/` error), uppercase slug rejected (`/slug/` error), outcomes > 5 rejected, missing tier/visibility rejected, tagline > 140 rejected, description > 160 rejected, year out-of-range rejected. Loader propagates via `ProjectFrontmatterSchema.parse(data)` in `lib/content.ts:44` |
| 3 | A project marked `visibility: private` automatically carries a `code-private` tag and has its `links.repo` stripped — verified against at least one fixture | VERIFIED | `lib/schemas.ts:48-72` implements `.transform()` as single chokepoint. Verified by 9 tests in `privacy-transform.test.ts` using `tests/fixtures/projects/valid-private.mdx`: auto-adds `code-private`, strips `links.repo`, dedupes, preserves other links, public projects unmodified, dev-warn gated on `NODE_ENV === 'development'` |
| 4 | Code consumers can query "all projects tagged `local-first`" or "all hero-tier projects" via a typed helper, not ad-hoc filtering | VERIFIED | `lib/projects.ts` exports all 6 helpers (lines 14, 22, 31, 39, 52, 62): `getAll()`, `getHeroProjects()`, `getProject()`, `getAllTags()`, `getProjectsByTag(tag)`, `getRelatedProjects()`. 16 tests in `tag-index.test.ts` assert archived-exclusion, order-asc sort, tier filter, tag filter, count aggregation, overlap scoring |
| 5 | The Myco MDX file is authored from the existing README and passes the schema | VERIFIED | `content/projects/myco.mdx` exists; 902-word body (in 800–1200 budget); three H2 anchors (Problem, Approach, Outcome) present at lines 26/34/44; frontmatter matches CONTEXT.md locks (tier=hero, visibility=public, status=active, year=2025, order=10, tags include local-first + open-source + ai); schema accepts the file (loader runs at `pnpm test:ci` and `pnpm build` — both green) |

**Score:** 5/5 success criteria verified.

---

### Required Artifacts

| Artifact | Expected | Exists | Substantive | Wired | Data Flows | Status |
|----------|----------|--------|-------------|-------|------------|--------|
| `package.json` | gray-matter + remark-frontmatter deps | YES | YES (`gray-matter@^4.0.3`, `remark-frontmatter@^5.0.0`, `server-only@^0.0.1` all present) | YES (resolved via `pnpm list`) | N/A | VERIFIED |
| `next.config.ts` | `remarkPlugins: ['remark-frontmatter']` string form | YES | YES (line 11 exact match) | YES (`pnpm build` uses MDX pipeline) | N/A | VERIFIED |
| `mdx-components.tsx` | root-level stub with `useMDXComponents` | YES | YES (imports from `mdx/types`, exports `useMDXComponents()`) | YES (@next/mdx consumes automatically; build succeeds) | N/A | VERIFIED |
| `lib/tags.ts` | `TAGS` const, `Tag` type, `TAG_LABELS` | YES | YES (11 tags, `Tag` type, `TAG_LABELS: Record<Tag, string>`) | YES (imported by `lib/schemas.ts` and `lib/projects.ts`) | N/A | VERIFIED |
| `lib/schemas.ts` | `ProjectFrontmatterSchema` with `.transform()` privacy chokepoint | YES | YES (single `.transform()` at line 48; privacy logic gated on `visibility === 'private'` at line 51) | YES (imported by `lib/content.ts` and schema/privacy tests) | YES (exercised by 20 Wave 1 tests + real Myco load) | VERIFIED |
| `lib/content.ts` | `allProjects`, `Project`, `_loadForTests` with `server-only` import | YES | YES (`import 'server-only'` line 15, `existsSync` guard line 32, slug mismatch throw line 46, schema `.parse()` line 44, `Object.freeze` lines 32+39) | YES (imported by `lib/projects.ts`) | YES (12 content-load tests; real Myco loads into `allProjects`) | VERIFIED |
| `lib/projects.ts` | 6 query helpers | YES | YES (all 6 exports present; `.slice()` before `.sort()`; archived exclusion; overlap scoring) | YES (will be consumed by Phase 3+; 16 tag-index tests exercise via `vi.mock`) | YES (mocked fixture in tests; real collection at build time) | VERIFIED |
| `content/projects/myco.mdx` | authored from README, P/A/O structure, locked frontmatter | YES | YES (902 body words; three H2 anchors; honest outcomes; placeholder-disclosing hero alt) | YES (picked up by `load(CONTENT_DIR)` at module init) | YES (asserted in CNT-05 integration specs) | VERIFIED |
| `tests/content/schema.test.ts` | 11 acceptance + rejection specs | YES | YES (11 specs, all green) | YES (imports `ProjectFrontmatterSchema` via `@/lib/schemas`) | YES | VERIFIED |
| `tests/content/privacy-transform.test.ts` | 9 privacy + dev-warn specs | YES | YES (9 specs, all green) | YES (imports via `@/lib/schemas`) | YES | VERIFIED |
| `tests/content/content-load.test.ts` | loader integration + CNT-05 real-content specs | YES | YES (12 specs: 6 Wave 2 + 6 CNT-05) | YES (uses `_loadForTests` + real `allProjects`) | YES | VERIFIED |
| `tests/content/tag-index.test.ts` | query helper specs via mocked fixture | YES | YES (16 specs) | YES (`vi.mock('@/lib/content')` + top-level await import) | YES | VERIFIED |
| `tests/content/redaction.test.ts` | private-body scanner + self-tests | YES | YES (6 tests: 1 vacuous + 5 self-tests) | YES (imports `BANNED_TERMS` from `../fixtures/banned-terms`) | YES | VERIFIED |
| `tests/fixtures/projects/{valid-hero,valid-private,invalid-tag}.mdx` | canonical fixtures | YES | YES (all three present with required frontmatter) | YES (consumed by schema/privacy/loader tests) | YES | VERIFIED |
| `tests/fixtures/banned-terms.ts` | frozen `BANNED_TERMS` | YES | YES (`Object.freeze` with `aktiga`, `voya`, `spectra`) | YES (imported by redaction test) | YES | VERIFIED |
| `.planning/phases/02-content-pipeline/02-REDACTION-REVIEW.md` | checklist with banned terms, sensitive topics, sign-off | YES | YES (all three required sections present, references `tests/fixtures/banned-terms.ts`, sign-off template with all 3 banned terms named) | N/A (planning doc) | N/A | VERIFIED |

---

### Key Link Verification

| From | To | Via | Pattern Match | Status |
|------|----|----|--------------|--------|
| `next.config.ts` | `remark-frontmatter` | `remarkPlugins` string entry | `remarkPlugins: ['remark-frontmatter']` at line 11 | WIRED |
| `mdx-components.tsx` | `@next/mdx` App Router | `useMDXComponents` export | `export function useMDXComponents(): MDXComponents` at line 8 | WIRED |
| `lib/schemas.ts` | `lib/tags.ts` | `z.enum(TAGS)` | `tags: z.array(z.enum(TAGS)).min(1)` at line 38 | WIRED |
| `lib/content.ts` | `lib/schemas.ts` | `ProjectFrontmatterSchema.parse(data)` | Line 44 | WIRED |
| `lib/content.ts` | `server-only` | `import 'server-only'` | Line 15 (hardens RSC boundary; install in package.json; vitest stub alias) | WIRED |
| `lib/projects.ts` | `lib/content.ts` | `import { allProjects, type Project } from './content'` | Line 7 | WIRED |
| `tests/content/redaction.test.ts` | `tests/fixtures/banned-terms.ts` | `import { BANNED_TERMS }` | Per plan 04 acceptance | WIRED |
| `.planning/phases/02-content-pipeline/02-REDACTION-REVIEW.md` | `tests/fixtures/banned-terms.ts` | documented path reference | Referenced in "Banned terms (source of truth)" section | WIRED |
| `content/projects/myco.mdx` | `lib/schemas.ts` (via loader) | frontmatter validated by `ProjectFrontmatterSchema` at `lib/content.ts` import time | `slug: myco` + schema accepts at build | WIRED |
| `content/projects/myco.mdx` | `lib/content.ts` | `fs.readdirSync` picks up file | `myco.mdx` present in `content/projects/` and appears in `allProjects` | WIRED |

---

### Data-Flow Trace (Level 4)

Phase 2 produces a data pipeline (not a UI surface). Data flows verified end-to-end via the full test suite:

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `lib/content.ts` | `allProjects` | `fs.readdirSync(CONTENT_DIR)` → `matter()` → `ProjectFrontmatterSchema.parse()` | YES — real `content/projects/myco.mdx` loaded at module init; 12 integration tests assert on real content | FLOWING |
| `lib/projects.ts` | query results | `allProjects` (re-exported from `lib/content.ts`) | YES — 16 tests exercise via mocked fixture; build-time consumption works end-to-end | FLOWING |
| `content/projects/myco.mdx` body | `body` field on `Project` | `gray-matter`'s `content` output | YES — 902 words asserted; 3 H2 anchors asserted | FLOWING |
| Schema `.transform()` | `tags`, `links.repo` | `ProjectFrontmatterRawSchema` input | YES — private fixture triggers real transform; dev-warn emitted; `code-private` dedupe verified | FLOWING |

No hollow props, no static fallbacks substituting for real data.

---

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Full test suite passes | `pnpm test:ci` | 128/128 tests pass across 13 files in 2.01s | PASS |
| TypeScript typecheck | `pnpm typecheck` | Exit 0, no errors | PASS |
| Next.js production build succeeds | `pnpm build` | Compiled in 1497ms, TypeScript in 1614ms, 4 static pages generated, exit 0 | PASS |
| Phase 2 tests isolated | `pnpm test tests/content/` (via test:ci filter) | 54 tests pass (schema 11 + privacy 9 + content-load 12 + tag-index 16 + redaction 6) | PASS |
| Myco body word count in budget | `awk '/^---$/{p=!p;next}p{next}{print}' content/projects/myco.mdx \| wc -w` | 902 (∈ [800, 1200]) | PASS |
| Myco has P/A/O H2 headings | `grep -E "^## (Problem\|Approach\|Outcome)$" content/projects/myco.mdx` | 3 matches at lines 26, 34, 44 | PASS |
| Privacy transform is single chokepoint | `grep -n "\.transform(" lib/schemas.ts` | One match at line 48 | PASS |
| All 6 query helpers exported | `grep -E "^export function (getAll\|getHeroProjects\|getProject\|getAllTags\|getProjectsByTag\|getRelatedProjects)" lib/projects.ts` | 6 matches at lines 14, 22, 31, 39, 52, 62 | PASS |
| Redaction checklist exists | `test -f .planning/phases/02-content-pipeline/02-REDACTION-REVIEW.md` | File exists with all required sections | PASS |

All automated gates green.

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| CNT-01 | 02-00-PLAN, 02-02-PLAN | Content Collections is configured to compile MDX files under `content/projects/` | SATISFIED | `@next/mdx` + `remark-frontmatter` wired in `next.config.ts`; `lib/content.ts` loads MDX via `fs.readdirSync` + `gray-matter`; `pnpm build` compiles MDX; `allProjects` populated from real directory |
| CNT-02 | 02-01-PLAN | Zod-validated frontmatter schema (slug, title, year, tags[], tier, privacy, hero, summary, links, outcomes) | SATISFIED | `lib/schemas.ts` `ProjectFrontmatterSchema` covers every field; 11 schema tests assert acceptance + rejection paths |
| CNT-03 | 02-01-PLAN | Schema transform auto-adds `code-private` tag for visibility:private and strips `links.repo` | SATISFIED | `lib/schemas.ts:48-72` `.transform()` implements both rules; 9 privacy-transform tests verify (auto-tag, dedupe, strip, public non-mutation, dev-warn gating) |
| CNT-04 | 02-02-PLAN | Derived tag index + query helpers for consumers | SATISFIED | `lib/projects.ts` exports all 6 helpers; 16 tag-index tests assert counts (desc by count, asc by tag), filter by tag, hero filter, relatedness scoring, archived exclusion |
| CNT-05 | 02-03-PLAN | Myco MDX authored from README | SATISFIED | `content/projects/myco.mdx` (902 words, P/A/O structure, frontmatter passes schema); 6 integration tests assert real-content properties; human-verify checkpoint approved by reviewer per plan 03 summary |
| CNT-06 | 02-04-PLAN | Private-project content passes redaction review | SATISFIED | `tests/content/redaction.test.ts` (automated scanner, 5 self-tests + 1 vacuous-pass per-file test); `.planning/phases/02-content-pipeline/02-REDACTION-REVIEW.md` (human checklist with banned-term rationale, 9-item sensitive-topic list, sign-off template); scanner armed for Phase 7 |

All 6 phase requirements SATISFIED. Cross-referenced against REQUIREMENTS.md traceability table — every CNT-01..CNT-06 claimed by at least one plan's `requirements` field, all marked Complete. No orphaned requirements.

---

### Anti-Patterns Found

Grep scan on files created/modified this phase (`lib/tags.ts`, `lib/schemas.ts`, `lib/content.ts`, `lib/projects.ts`, `mdx-components.tsx`, `next.config.ts`, `content/projects/myco.mdx`, `tests/content/*.test.ts`, `tests/fixtures/**/*`, `.planning/phases/02-content-pipeline/02-REDACTION-REVIEW.md`):

| File | Pattern | Severity | Impact |
|------|---------|----------|--------|
| None | None | — | No TODO/FIXME/XXX/HACK/PLACEHOLDER markers in any Phase 2 file. Explicit "placeholder" disclosures in `content/projects/myco.mdx` hero alt and the REDACTION-REVIEW.md sign-off template are deliberate (per CONTEXT.md content-honesty discipline and plan-04 template markers) — not silent stubs. |

**Stub classification note:** The `content/projects/myco.mdx` hero image path `/images/projects/myco/hero-placeholder.png` is flagged as a placeholder with a self-disclosing alt string ("placeholder — real image lands in Phase 7"). Per CONTEXT.md this is explicitly scoped to Phase 7's content pass, not a hidden Phase 2 stub. Acceptable per project guidelines.

---

### Human Verification Required

None. All gates for Phase 2 are automatable (schema, loader, query API, content integrity, redaction scanner) — no browser/visual/UX-flow verification needed for this phase. Editorial quality of `content/projects/myco.mdx` was verified at plan-03 human-verify checkpoint (approved by file owner per 02-03-SUMMARY.md).

---

### Gaps Summary

None. Every ROADMAP success criterion has direct codebase evidence. Every requirement CNT-01..CNT-06 traces to implementing plans, passing tests, and working artifacts. Every must_have across all 5 plans has corresponding verified state in the repo.

---

## Verification Commands Run

```
pnpm test:ci       → 128/128 tests pass in 2.01s
pnpm typecheck     → exit 0
pnpm build         → exit 0 (Turbopack compiled + 4 static pages generated)
```

## Re-verification Metadata

Not applicable — this is the initial verification of Phase 2.

---

*Verified: 2026-04-21T18:24:00Z*
*Verifier: Claude (gsd-verifier)*
