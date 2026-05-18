---
phase: 07-content-pass-+-launch
plan: 02
subsystem: content
tags: [mdx, privacy, redaction, agenda-keeper, banned-terms, zod-transform, hero-tier]

# Dependency graph
requires:
  - phase: 02-content-pipeline
    provides: BANNED_TERMS fixture + redaction scanner (Plan 02-04) + privacy transform (Plan 02-01) + 02-REDACTION-REVIEW.md sign-off template
  - phase: 03-project-detail-template
    provides: ProjectMeta privacy contract (PRJ-06) + ProjectHero Variant B (text-only placeholder) + Problem/Approach/Outcome template (Plan 02-03)
  - phase: 07-content-pass-+-launch
    provides: Plan 07-00 deploy-checklist + Plan 07-01 Fathom MDX (hero-tier #2, order=20 sibling)
provides:
  - Agenda Keeper private hero-tier MDX (#3 of 3) at content/projects/agenda-keeper.mdx
  - Extended BANNED_TERMS fixture (4 entries; +the-real-agenda-keeper)
  - Per-project redaction sign-off filed under .planning/phases/07-content-pass-+-launch/07-REDACTION-REVIEW-agenda-keeper.md
  - First non-vacuous run of Phase 2 Plan 02-04 redaction scanner against real private MDX
  - DEFER-01 (Phase 3 deferred Tailwind v4 source-scan scope bug) resolved inline
affects: [07-03 placeholder-resolution, 07-04 deploy + REQUIREMENTS close-out, downstream private MDX authoring (Trade Bot, Aktiga case studies if v1.1+)]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Per-project redaction sign-off file under .planning/phases/07-content-pass-+-launch/07-REDACTION-REVIEW-<slug>.md, forked from Phase 2 template"
    - "checkpoint:human-verify gate for privacy review on every private MDX before commit (CNT-06 enforced editorially, not just by Zod transform)"
    - "Append-only extension of tests/fixtures/banned-terms.ts — original 3 entries preserved verbatim, new term added with rationale captured in sign-off doc (single source of truth for both code list and review process)"
    - "BANNED_TERMS extension justification table inside the sign-off doc (added/considered-and-rejected sections) so future audits can reconstruct the decision"

key-files:
  created:
    - content/projects/agenda-keeper.mdx
    - .planning/phases/07-content-pass-+-launch/07-REDACTION-REVIEW-agenda-keeper.md
  modified:
    - tests/fixtures/banned-terms.ts
    - app/globals.css

key-decisions:
  - "the-real-agenda-keeper banned (internal repo slug); public framing is just 'Agenda Keeper' — banning the slug-form prevents accidental copy-paste from internal docs or commit messages without affecting the legitimate public title"
  - "Agenda Keeper privacy contract verified live on rendered HTML: 2× literal 'code private' label in meta row, zero anchors scoping to agenda-keeper on github/gitlab/bitbucket, zero leakage of internal repo slug — first time Phase 2 Plan 02-04 scanner ran non-vacuously"
  - "DEFER-01 (Phase 3 deferred item) resolved inline during checkpoint window — Tailwind v4 source-scan was pulling .planning/*.md and scripts/*.ts into the CSS build, surfacing class names that don't belong to runtime UI; @source not configured properly. Fixed via @source not directive in app/globals.css to exclude .planning + scripts. Unblocked Olive's visual check at /projects/agenda-keeper."

patterns-established:
  - "Per-project sign-off doc pattern: file at .planning/phases/07-content-pass-+-launch/07-REDACTION-REVIEW-<slug>.md, 4 sections (pre-review automated state / banned-term extension rationale / banned-term manual check / privacy-sensitive topic check) + word-count/template-shape check + Approval block. Forked from Phase 2 template; every future private MDX gets its own copy."
  - "Approval line format (verbatim adoptable): 'Approved by: <name> / Date: <YYYY-MM-DD> / Notes: <free-form>'. Single-line is greppable and parseable by future audit tooling without DOM parsing."
  - "Banned-terms fixture extension protocol: append, never replace; Object.freeze preserved; rationale required in same-PR sign-off doc; rejected candidates captured in the doc's 'Terms considered and NOT added' section for audit trail."

requirements-completed: []

# Metrics
duration: 3h 47m (wall-clock, includes ~3.5h human-review window between Task 1 commit and Task 2 approval)
completed: 2026-05-18
---

# Phase 7 Plan 02: Agenda Keeper Private MDX + Redaction Sign-off Summary

**Private hero-tier #3 (Agenda Keeper) shipped at /projects/agenda-keeper with extended banned-terms guardrail, first non-vacuous run of the Phase 2 redaction scanner, and Olive-signed per-project privacy review filed.**

## Performance

- **Duration:** 3h 47m wall-clock (Task 1 active ~30m, human-review window ~3h 15m, Task 2 sign-off ~2m). Effective Claude execution time well under 1 hour.
- **Started:** 2026-05-18T15:01:39Z (first task commit fd1eb06)
- **Completed:** 2026-05-18T18:48:30Z (sign-off commit c737e3c)
- **Tasks:** 2 (1 auto + 1 checkpoint:human-verify)
- **Files modified:** 4 (2 created, 2 modified)

## Accomplishments

- Agenda Keeper private hero-tier case study live at `/projects/agenda-keeper` — 1112-word Problem/Approach/Outcome body (mid-budget), zero banned-term occurrences, schema-driven `code-private` auto-tag visible, no repo link rendered anywhere
- `tests/fixtures/banned-terms.ts` extended append-only with `the-real-agenda-keeper` — original three entries (`aktiga`, `voya`, `spectra`) preserved verbatim, `Object.freeze` maintained
- Phase 2 Plan 02-04 redaction scanner ran non-vacuously for the first time — the dynamic-describe block in `tests/content/redaction.test.ts` now fires a real per-file assertion for `agenda-keeper.mdx` and exits green
- Per-project sign-off doc filed at `.planning/phases/07-content-pass-+-launch/07-REDACTION-REVIEW-agenda-keeper.md` — 9 privacy-sensitive-topic boxes ticked, 4 banned-term re-check boxes ticked, Olive's approval line on file
- DEFER-01 (Phase 3 Tailwind v4 source-scan scope bug) resolved inline during the human-verify window, unblocking Olive's live visual check at `/projects/agenda-keeper`
- Phase 7 success criterion #4 (every private-project case study has passed an explicit redaction review before going live) satisfied for Agenda Keeper

## Task Commits

1. **Task 1: Extend banned-terms.ts + draft agenda-keeper.mdx** — `fd1eb06` (feat) — pre-checkpoint Phase 7 Plan 02 baseline
2. **Out-of-plan: DEFER-01 fix (Tailwind source-scan scope)** — `158ba84` (fix) — surfaced during Task 2 review window when Olive tried `pnpm dev` for visual check
3. **Task 2: Olive-signed redaction review filed** — `c737e3c` (docs) — checkpoint:human-verify resolved with "approved"

**Plan metadata commit:** issued after this SUMMARY (docs: complete plan)

## Files Created/Modified

- `content/projects/agenda-keeper.mdx` (created, 1112-word body, 50+ lines incl. frontmatter) — private hero-tier case study; Problem/Approach/Outcome template; visibility:private triggers Zod transform → `code-private` tag auto-added, no `links` block authored
- `.planning/phases/07-content-pass-+-launch/07-REDACTION-REVIEW-agenda-keeper.md` (created, 109 lines) — per-project sign-off doc; pre-review automated state checklist, banned-term extension rationale + considered-and-rejected table, banned-term manual re-check (4 ticked), 9 privacy-sensitive-topic boxes (all ticked), public-technical-surface allowlist, word-count/template-shape verification, Olive's approval line
- `tests/fixtures/banned-terms.ts` (modified, +1 entry) — appended `the-real-agenda-keeper`; original 3 entries unchanged; `Object.freeze` preserved
- `app/globals.css` (modified, +8 lines) — DEFER-01 fix: added `@source not` directives to exclude `.planning/**/*.md` and `scripts/**/*.ts` from Tailwind v4's automatic content scan (these contain class-name-shaped tokens in code samples + plan docs that were polluting the runtime stylesheet)

## Decisions Made

1. **`the-real-agenda-keeper` banned, `agenda-keeper` not banned** — The internal repo slug differs from the public-facing brand. Banning the slug-form prevents accidental copy-paste from internal docs, commit messages, or env config; leaving the brand-form unbanned allows the case study to actually name the product it's about. Phase 2 scanner only reads body content (not frontmatter), so the slug-form in frontmatter wouldn't trip either way, but the asymmetry made the right call obvious.
2. **No `links:` block at all (vs `links: {}`)** — Schema's `LinksSchema.default({})` accepts both forms. Plan 07-01 used the explicit empty object; this plan went with omission. Both are valid; the next plan author can pick the convention they prefer. For a private project where the schema would strip `links.repo` anyway, omission is cleaner and signals intent unambiguously.
3. **DEFER-01 resolved inline (not deferred to Phase 7 close-out)** — When Olive ran `pnpm dev` to visually verify the page, the Tailwind v4 scope bug was producing visible CSS noise. Rule 3 (blocking) triggered: the visual check couldn't proceed cleanly until the styling was sane. Fixed in one targeted change to `app/globals.css` rather than punting to a follow-up plan.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Resolved DEFER-01 inline during Task 2 review window**
- **Found during:** Task 2 (checkpoint:human-verify — Olive ran `pnpm dev` for visual check at `/projects/agenda-keeper`)
- **Issue:** Tailwind v4's automatic source scan was including `.planning/**/*.md` and `scripts/**/*.ts` in its content detection. Plan markdown files contain class-name-shaped strings (in example code blocks, RESEARCH excerpts, etc.) and the Puppeteer PDF script references class names that don't belong to the runtime UI. This polluted `globals.css` with extraneous utility rules and made styling on the new Agenda Keeper page look noisy/inconsistent. Originally surfaced and DEFERRED in Phase 3 — but it blocked Olive's visual verification of this plan, so it was promoted to in-scope.
- **Fix:** Added `@source not "../.planning/**/*.md";` and `@source not "../scripts/**/*.ts";` directives to `app/globals.css` (the conventional Tailwind v4 mechanism for narrowing the source scope without disabling automatic detection entirely).
- **Files modified:** `app/globals.css` (+8 lines)
- **Verification:** Olive confirmed the visual check at `/projects/agenda-keeper` passed cleanly after the fix; full vitest suite still green (513 pass / 4 skipped); typecheck clean; `pnpm build` exit 0.
- **Committed in:** `158ba84` (standalone fix commit so the DEFER-01 resolution is greppable in git history)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** DEFER-01 fix was strictly necessary for Olive's visual verification leg of the checkpoint to succeed. The plan as written assumed styling was already stable; the DEFER-01 scope-creep from Phase 3 only manifested under live load on a freshly added route. No scope creep beyond the bug fix itself — the DEFER-01 commit is single-file and targeted.

## Issues Encountered

- DEFER-01 (Tailwind v4 source-scan scope) surfaced under live visual check; documented above as a Rule 3 auto-fix. No other blockers.
- Word count landed at 1112 (mid-budget) on first draft — no re-write loop needed to fit the 800–1200 envelope.
- Banned-term scanner's whole-word boundary handling for hyphenated terms (`the-real-agenda-keeper`) was a known unknown in the plan body — the Phase 2 scanner self-test already proves the regex handles hyphens correctly (treats `-` as word boundary), so no scanner change was required.

## User Setup Required

None — no external service configuration required for this plan. (Deploy-related setup lives in Plan 07-04.)

## Next Phase Readiness

- All three hero-tier case studies (Myco, Fathom, Agenda Keeper) are now drafted, schema-validated, and live in build output
- Phase 7 success criterion #3 (real content for hero + secondary, no lorem ipsum) — heroes done; secondary content authored in Phase 4 already
- Phase 7 success criterion #4 (private-project redaction reviewed) — satisfied for Agenda Keeper; pattern + template are reusable if future private MDX (Trade Bot, Aktiga case studies) ship in v1.1+
- Plan 07-03 (placeholder resolution batch: LinkedIn handle, Fathom URL, Stemz URL, Aktiga role) is now unblocked
- DEFER-01 from Phase 3 is closed; no carry-forward

---
*Phase: 07-content-pass-+-launch*
*Completed: 2026-05-18*

## Self-Check: PASSED

- All 5 declared files (created + modified) verified present on disk: `content/projects/agenda-keeper.mdx`, `.planning/phases/07-content-pass-+-launch/07-REDACTION-REVIEW-agenda-keeper.md`, `.planning/phases/07-content-pass-+-launch/07-02-SUMMARY.md`, `tests/fixtures/banned-terms.ts`, `app/globals.css`.
- All 3 declared commit hashes verified present in git history: `fd1eb06` (Task 1 feat), `158ba84` (DEFER-01 fix), `c737e3c` (Task 2 docs sign-off).
