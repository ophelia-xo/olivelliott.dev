---
phase: 07-content-pass-+-launch
plan: 01
subsystem: content
tags: [mdx, content, fathom, hero-tier, public-project, problem-approach-outcome]

requires:
  - phase: 02-content-pipeline
    provides: ProjectFrontmatterSchema, TAGS enum, BANNED_TERMS scanner, Myco template shape locked at 902 words with Problem/Approach/Outcome anchors
  - phase: 03-project-detail-template
    provides: dynamic @/content/projects/${slug}.mdx import in [slug] route; isPlaceholderHero text-only Variant B; NextProjectBlock tag-overlap wiring
  - phase: 04-home-+-projects-index
    provides: home hero-tier card grid + /projects index card grid that auto-surface any new active hero-tier MDX
  - phase: 06-seo,-og,-a11y-&-performance-audit
    provides: banned-words launch gate (19-item anti-features test) including ecosystem/passionate/transformative/etc.
  - phase: 07-content-pass-+-launch (07-00)
    provides: Phase 7 infrastructure verified ready; redaction scanner armed but vacuous until first private MDX lands
provides:
  - content/projects/fathom.mdx — second hero-tier public case study (slug fathom, tier hero, status active, visibility public)
  - /projects/fathom static route emitted by Phase 3 template with zero source changes
  - getAll() / getHeroProjects() now return Myco + Fathom (2 hero-tier active projects)
  - Home + /projects index auto-surface Fathom card via Phase 4 grids
  - NextProjectBlock now has 2 active projects to choose from on Myco's detail page (was 1 — previously single-project variant)
affects: [07-02, 07-03, 07-04, milestone-v1.0]

tech-stack:
  added: []
  patterns:
    - "Pluggable-interface narrative pattern — frame the abstractions (store interface, provider interface) by why they exist (different teams have different non-negotiables) rather than how they work mechanically; reusable for Trade Bot strategy interface, Agenda Keeper editor extension points"
    - "Cross-project thesis bridge in Outcome section — explicit one-sentence link back to a sibling project (Myco) to make the autonomy thesis legible across the portfolio without a dedicated /thesis page"
    - "links: {} as the explicit deferral signal — empty object plus an MDX comment naming the resolving plan (07-03), distinct from omitting the key entirely; preserves Pitfall-12 schema gate (LinksSchema.default({})) while making the intent visible to greppers"

key-files:
  created:
    - content/projects/fathom.mdx
    - .planning/phases/07-content-pass-+-launch/07-01-SUMMARY.md
  modified:
    - public/resume.pdf

key-decisions:
  - "Plan 07-01: links: {} (not omitted, not fabricated) — chose explicit empty object plus MDX comment naming Plan 07-03 as the resolver. LinksSchema.default({}) accepts both omit and {}; the explicit form is greppable, intent-naming, and survives a future schema tightening without surprise."
  - "Plan 07-01: Stack array [TypeScript, Node.js, MCP] — kept short and verifiable. MCP added (and reasoned about in body) because it is the protocol that makes Fathom interesting inside Claude Code; not adding it would understate the architecture."
  - "Plan 07-01: Tags [autonomous, open-source, ai, agents, typescript, cli] — overlaps Myco on autonomous + open-source + ai + agents + typescript (5-tag overlap, well above Phase 3's tag-overlap NextProjectBlock threshold), so Myco's detail page next-project block now links to Fathom and vice versa with high relevance score."
  - "Plan 07-01: Body sits at 1200 words (upper bound of 800–1200 budget, inclusive). Three trim passes converged on this — first draft was 1207, second 1204, third 1200. Pattern: tighten meaning-preserving filler ('the right total at the wrong granularity' style sentences) rather than cut substantive arguments. The budget exists to enforce density, not to truncate honest content."
  - "Plan 07-01: No anchor MDX comment paragraph above ## Problem (just the link-deferral comment between frontmatter and the first H2). Comments render as nothing in MDX output, so a content-bearing comment cannot read as 'visible PLACEHOLDER text' to a casual visitor — satisfies Plan 07-04 pre-deploy 'no visible PLACEHOLDER' gate while still being greppable for the deploy checklist."

patterns-established:
  - "Pattern 1 (consumed): Myco template shape (Problem/Approach/Outcome H2 + 800–1200 words + descriptive outcomes only) consumed unmodified — the second hero case study confirms Phase 2 Plan 02-03's lock is durable across authors and topics. Plan 07-02 (Agenda Keeper, private) will be the third confirmation and tests it against the redaction-gated branch."
  - "Pattern 2 (extended): order: 20 places Fathom directly after Myco (order: 10) in getHeroProjects() sort. The 10-step gap between orders leaves room for future hero-tier inserts (15) without renumbering, mirroring the IP-address spacing convention. Agenda Keeper at 30 in Plan 07-02."
  - "Pattern 3 (new): Cross-project thesis bridge — the Outcome section names a sibling project by title and explains how the two share a thesis. 'Myco gave an agent durable memory… Fathom gives the same agent honest accounting.' One sentence, no dedicated /thesis page needed (per PROJECT.md decision). Reusable for Agenda Keeper Outcome → Aktiga thesis bridge if pattern earns its weight in Plan 07-02."

requirements-completed: []

duration: 3 min
completed: 2026-05-18
---

# Phase 7 Plan 1: Fathom MDX Summary

**Authored content/projects/fathom.mdx as the second hero-tier public case study (Myco template shape: Problem → Approach → Outcome, 1200 words, frontmatter-validated, banned-words-clean), unlocking /projects/fathom under the Phase 3 template with zero source changes and bringing getHeroProjects() from 1 to 2 active hero projects.**

## Performance

- **Duration:** 3 min
- **Started:** 2026-05-18T14:52:17Z
- **Completed:** 2026-05-18T14:55:12Z
- **Tasks:** 1
- **Files modified:** 1 created (fathom.mdx) + 1 regenerated (resume.pdf)

## Accomplishments

- `content/projects/fathom.mdx` created with the locked Myco template shape — frontmatter ordered identically (slug → title → tagline → year → tier → order → status → visibility → tags → stack → links → hero → outcomes → description), three EXACT H2 anchors (`## Problem`, `## Approach`, `## Outcome`), 1200-word body landing at the upper bound of the 800–1200 budget.
- Frontmatter passes `ProjectFrontmatterSchema` at module load — tagline 119/140 chars, description 149/160 chars, all 6 tags drawn from the `TAGS` enum (`autonomous`, `open-source`, `ai`, `agents`, `typescript`, `cli`), `order: 20` placing Fathom directly after Myco (`order: 10`).
- `links: {}` (not fabricated, not omitted) — empty object plus an MDX comment naming Plan 07-03 as the resolver. Preserves the schema default, makes the deferral explicit and greppable.
- Hero uses `/images/projects/fathom/hero-placeholder.png` — matches `isPlaceholderHero` regex (`/\/images\/projects\/[^/]+\/hero-placeholder\.(png|jpe?g|webp)$/i`), triggers Phase 3 Variant B text-only treatment without needing the image file to exist.
- Outcomes: 5 descriptive bullets, zero metrics, zero fabricated claims, zero "Nx faster" language.
- Body voice matches Myco's: third-person system-description ("Fathom is", "the CLI was"), no marketing copy, no buzzwords. Cross-project bridge sentence in Outcome ("Myco gave an agent durable memory…Fathom gives the same agent honest accounting") connects to the autonomy thesis without a dedicated essay.
- `pnpm vitest run` — 513 pass / 4 skipped (exact Phase 6/07-00 baseline preserved).
- `pnpm typecheck` — exit 0.
- `pnpm build` — exit 0; `/projects/fathom` listed as SSG route alongside `/projects/myco`; `.next/server/app/projects/fathom.html` emitted at 52KB.
- `postbuild` regenerated `public/resume.pdf` (234.9 KB) — included in commit per established Phase 5 commit-the-PDF pattern.
- Banned-words audit clean — `grep -iE` against the 28-term Phase 6 launch-gate list returns nothing.

## Task Commits

Each task was committed atomically:

1. **Task 1: Draft content/projects/fathom.mdx** — `6334640` (feat)

**Plan metadata:** _pending — final commit after STATE/ROADMAP updates_

## Files Created/Modified

- `content/projects/fathom.mdx` (created, 59 lines) — Frontmatter (15 lines) + link-deferral MDX comment (1 line) + body with three H2 sections (1200 words). Single file, single commit.
- `public/resume.pdf` (regenerated, 234.9 KB → same on-disk size) — Postbuild hook output; resume content unchanged; intentionally committed per Phase 5 decision so production deploys never invoke Puppeteer.

## Decisions Made

- **`links: {}` (explicit empty object) over omitting the `links:` key entirely.** `LinksSchema.default({})` accepts both forms, but the explicit form is greppable from a deploy checklist, names intent in source, and survives a future schema tightening (e.g., requiring `links.repo` for public projects) without silent surprise. Paired with an MDX comment naming Plan 07-03 as the resolver.
- **Hero placeholder path uses `/images/projects/fathom/hero-placeholder.png`** — matches the `isPlaceholderHero` regex exactly, so Phase 3's `<ProjectHero>` chooses Variant B (text-only). The image file itself does not exist and does not need to; Variant B is the contract. A real screenshot can drop in later without code changes.
- **Stack array `[TypeScript, Node.js, MCP]`** — short, verifiable, and includes MCP because the protocol is what makes the project interesting inside Claude Code (and the body argues this explicitly). Omitting MCP would understate the architecture; padding with speculative entries (`SQLite`, `Anthropic SDK`, etc.) would risk fabrication.
- **Body landed at 1200 words exactly.** First draft was 1207, second 1204, third 1200. Trim strategy: collapse near-tautologies, drop low-signal modifiers, never cut a substantive argument. The budget is a density forcing function, not a content cap — 1200 was reached by pressure-testing each sentence, not by truncation.
- **Cross-project thesis bridge in `## Outcome`** — one sentence explicitly naming Myco and connecting both projects to the autonomy thesis. Per PROJECT.md, the site has no `/thesis` page; the thesis is meant to show through the pattern across projects. A single bridge sentence per hero case study is enough to make the pattern legible without becoming a manifesto.
- **No MDX comments embedded mid-body.** The only comment in the file sits between frontmatter and `## Problem` (the link deferral). No `{/* PLACEHOLDER: needs Olive's confirmation */}` markers inside the prose — everything in the body is verifiable from `content/resume.ts § projects[Fathom]`, PROJECT.md § Olive's current projects, and 07-CONTEXT.md § specifics. If a claim could not be verified, the sentence was rewritten to omit it (per Plan 07-01's explicit guidance "DO NOT use 'TODO' or 'TBD' in prose; rewrite the sentence to omit unverifiable claims").

## Deviations from Plan

None — plan executed exactly as written.

The plan body suggested optional MDX comment placeholders for unverifiable claims; this draft did not need any because every body assertion traces to existing source material (resume.ts bullets, PROJECT.md description, 07-CONTEXT.md specifics permitting TypeScript/MCP/Claude Code naming). The `links: {}` explicit-empty-object choice aligns with the plan's two listed acceptable options (omit or `{}`); plan permitted either.

## Issues Encountered

- First and second drafts exceeded the 1200-word upper bound (1207, then 1204). Resolved in-place with two trim passes targeting low-signal modifiers rather than cutting substantive argument. Final landed at 1200 (inclusive upper bound). Did not escalate — this is the expected drafting flow for a strict word budget, not a deviation.

## User Setup Required

None for Plan 07-01. The `links.repo` URL remains a Plan 07-03 deliverable (Olive confirms the canonical Fathom public URL alongside LinkedIn handle and Stemz URL in a single batch).

## Next Plan Readiness

- **Ready for Plan 07-02** (Agenda Keeper MDX, private). Plan 07-02 will:
  - Extend `tests/fixtures/banned-terms.ts` with Aktiga-adjacent terms (TipTap/ProseMirror/Convex aren't banned themselves; client/codename specifics are) BEFORE drafting the body.
  - Use the same Myco template shape (Problem → Approach → Outcome, 800–1200 words) — this plan's success confirms the template is durable across authors and topics. Plan 07-02 tests it against the private/redaction-gated branch.
  - Set `order: 30` (10-step gap convention) — keeps room for future hero inserts at 25.
  - Trigger the redaction scanner's first non-vacuous run (Phase 2 Plan 02-04's dynamic-describe block auto-fires per private MDX body).
  - Block on a `checkpoint:human-action` for Olive's sign-off using `.planning/phases/02-content-pipeline/02-REDACTION-REVIEW.md` checklist template.
- **getHeroProjects() now returns 2 active hero projects** (Myco + Fathom). Plan 07-02 brings it to 3 (adds Agenda Keeper). Plan 07-04's smoke checklist already enumerates all three `/projects/{slug}` routes for the post-deploy walk.
- **NextProjectBlock multi-project variant is now exercised** on Myco's detail page (was single-project before; tag overlap with Fathom is ≥5 tags, well above threshold). Visual sanity pass against this transition is implicit in Plan 07-04's manual smoke walk.

## Self-Check: PASSED

- `content/projects/fathom.mdx` — FOUND (59 lines on disk; frontmatter validates via `pnpm build` exit 0)
- `.next/server/app/projects/fathom.html` — FOUND (52,158 bytes; emitted alongside myco.html)
- `.planning/phases/07-content-pass-+-launch/07-01-SUMMARY.md` — FOUND (this file)
- Commit `6334640` — FOUND in git log (`feat(07-01): author content/projects/fathom.mdx (Phase 7 hero-tier #2)`)
- `pnpm vitest run`: 513 pass / 4 skipped (Phase 6/07-00 baseline preserved — zero regressions)
- `pnpm typecheck`: exit 0
- `pnpm build`: exit 0; `/projects/fathom` listed in route table as SSG
- Word count (body only, awk after second `---`): 1200 (within 800–1200 inclusive)
- H2 anchor grep: `## Problem` line 27, `## Approach` line 37, `## Outcome` line 51 — exact strings, no extras
- Banned-words grep (28-term Phase 6 launch-gate list): no matches
- Tagline length: 119/140 chars; Description length: 149/160 chars
- All 6 tags in `TAGS` enum (lib/tags.ts)

## Known Stubs

- `links: {}` in `content/projects/fathom.mdx` frontmatter — INTENTIONAL placeholder. Plan 07-03 resolves the canonical Fathom public repo URL alongside other Phase 5 placeholder deferrals (LinkedIn handle, Stemz live URL, Aktiga role title) in a single batch. MDX comment at top of body file names the resolving plan. Schema accepts `{}` via `LinksSchema.default({})`; no consumer breaks on the empty value (Phase 3's `ProjectMeta` renders the "code private" label for private projects and conditionally renders the repo anchor for public projects with `links.repo`; absent `links.repo` simply renders no anchor — exactly the desired interim state).
- `/images/projects/fathom/hero-placeholder.png` referenced but file does not exist on disk — INTENTIONAL. Phase 3's `<ProjectHero>` matches the suffix pattern via `isPlaceholderHero` and renders Variant B (text-only) without requiring the image file. Real screenshot can drop in later without any code change. Pattern established by Myco (which has the same placeholder path and no image file).

---
*Phase: 07-content-pass-+-launch*
*Completed: 2026-05-18*
