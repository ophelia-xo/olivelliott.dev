---
phase: 02-content-pipeline
plan: 04
subsystem: testing
tags: [vitest, redaction, privacy, gray-matter, regex, content-pipeline]

# Dependency graph
requires:
  - phase: 02-content-pipeline
    provides: "lib/schemas.ts (ProjectFrontmatter visibility field), lib/content.ts (content/projects/ scan target), gray-matter dependency"
provides:
  - "BANNED_TERMS shared constant (tests/fixtures/banned-terms.ts) for redaction scanner + checklist doc"
  - "Automated redaction scanner (tests/content/redaction.test.ts): walks every visibility:private MDX in content/projects/ and fails on whole-word case-insensitive banned-term matches"
  - "Scanner self-test suite (5 assertions) proving detection works before any private project exists — Phase 7 inherits a pre-validated gate"
  - "Human redaction checklist (.planning/phases/02-content-pipeline/02-REDACTION-REVIEW.md) with banned-term rationale, privacy-sensitive-topic list, and copy-paste PR sign-off template"
affects: [phase-07-content-pass, launch]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Case-insensitive whole-word regex scanner (\\b...\\b) with lowercased haystack + needle"
    - "Dynamic describe block: one `it` per private MDX file OR a single vacuous-pass test when none exist"
    - "Self-test pairing: every runtime check has an insurance test proving the check fires positively"
    - "Shared constant pattern: source-of-truth in a .ts fixture, human-readable rationale in the planning doc (no duplication)"

key-files:
  created:
    - "tests/fixtures/banned-terms.ts — frozen readonly BANNED_TERMS array (aktiga, voya, spectra)"
    - "tests/content/redaction.test.ts — scanner + 5 self-tests (6 tests total, all green)"
    - ".planning/phases/02-content-pipeline/02-REDACTION-REVIEW.md — checklist doc"
    - ".planning/phases/02-content-pipeline/deferred-items.md — out-of-scope items logged"
  modified: []

key-decisions:
  - "Walk the filesystem directly (fs.readdirSync + gray-matter) rather than importing from @/lib/content — redaction test needs the raw pre-schema body, and walking the directory is the correct boundary for a scanner that must work even if the schema is broken."
  - "Dynamic describe block gracefully handles the Phase 2 → Phase 7 transition: vacuous pass when content/projects/ has zero private files, per-file assertion when private projects land. No Phase 7 refactor required."
  - "Self-test describe block is the insurance: 5 assertions exercise case-insensitivity, whole-word boundaries, multi-term detection via isolated tmp fixture, and confirmation that frontmatter values are NOT scanned (only post-gray-matter body). This proves the scanner fires before any real content depends on it."
  - "Rationale for each banned term lives in the markdown checklist, not the code — code file stays a minimal list; markdown explains intent and review process. Single path reference keeps them in sync."

patterns-established:
  - "Pattern: Walk filesystem directly for content-layer invariants that must survive schema bugs"
  - "Pattern: Dual-track validation — automated scanner catches literal leaks, human checklist catches paraphrased/intent-level leaks"
  - "Pattern: Self-test describe blocks that exercise the check positively — prevents silent drift where a check stops firing without anyone noticing"

requirements-completed: [CNT-06]

# Metrics
duration: 4min
completed: 2026-04-21
---

# Phase 2 Plan 04: Redaction Scanner + Review Checklist Summary

**Automated whole-word banned-term scanner for private MDX bodies, paired with a human sign-off checklist, both sourcing BANNED_TERMS from a single fixture — redaction gate armed and vacuously passing until Phase 7's private projects land.**

## Performance

- **Duration:** 4 min
- **Started:** 2026-04-21T21:23:22Z
- **Completed:** 2026-04-21T21:27:21Z
- **Tasks:** 2
- **Files modified:** 4 (3 net-new source/doc files + 1 deferred-items log)

## Accomplishments

- CNT-06 closed: both gates (automated + human) exist and cross-reference the same source-of-truth constant
- Redaction scanner proven by 5 self-tests before any real private content exists — Phase 7 inherits a pre-validated pipeline
- Scanner gracefully handles the "no private projects yet" state via a vacuous-pass test; auto-converts to per-file assertions when private MDX lands
- Checklist doc carries 9-item privacy-sensitive-topics list and a copy-paste PR sign-off template ready for Phase 7

## Task Commits

Each task was committed atomically:

1. **Task 1: Create BANNED_TERMS constant + redaction.test.ts** — `df34313` (test)
2. **Task 2: Create 02-REDACTION-REVIEW.md checklist doc** — `9225882` (docs)

_Note: both commits used `--no-verify` per parallel-execution instructions (Plan 02-03 running in parallel, Biome pre-commit hook would otherwise race on the shared staging surface)._

## Files Created/Modified

- `tests/fixtures/banned-terms.ts` — exports `BANNED_TERMS: readonly string[]` seeded with `['aktiga', 'voya', 'spectra']`, wrapped in `Object.freeze` to prevent downstream mutation
- `tests/content/redaction.test.ts` — scanner implementation + dynamic per-file describe block + 5-test self-test describe block (6 total, all green)
- `.planning/phases/02-content-pipeline/02-REDACTION-REVIEW.md` — banned-term rationale table, 9-item privacy-sensitive-topic checklist, copy-paste PR sign-off template
- `.planning/phases/02-content-pipeline/deferred-items.md` — logs out-of-scope items (Plan 02-03's content-load test failure, pre-existing Phase 1 lint warnings)

### Final BANNED_TERMS list (verbatim)

```ts
export const BANNED_TERMS: readonly string[] = Object.freeze([
  'aktiga',
  'voya',
  'spectra',
])
```

### Test counts

- **Content-directory scan (top describe):** 1 vacuous-pass test (no private projects in `content/projects/` yet)
- **Self-test (bottom describe):** 5 tests — case-insensitive match, case-insensitive variant, whole-word boundary (voyages ≠ voya), isolated fixture scan (Spectra), frontmatter-values-not-scanned
- **Total:** 6 tests, all green (`pnpm exec vitest run tests/content/redaction.test.ts`)

## Decisions Made

- **Filesystem walk vs. lib/content import:** redaction test uses `fs.readdirSync` + `gray-matter` directly. Justification: scanner must catch leaks even if the Zod schema has a bug or a transform drops the body. The scanner's correctness shouldn't depend on the pipeline it audits.
- **Self-test over fixture-file for positive cases:** the 4th self-test creates a tmp-directory private MDX in-memory, writes it, scans it, then removes it. This proves the scanner sees private-shaped content AND detects banned terms, without adding a permanent private fixture that schema tests would also have to handle.
- **Checklist doc is planning-tree, not runtime:** `.planning/phases/02-content-pipeline/02-REDACTION-REVIEW.md` lives under `.planning/` (per GSD convention) — scanner ignores this file because its scan root is `content/projects/`. Good hygiene: even though banned terms appear in the checklist (as list entries), they're outside the scan path.

## Deviations from Plan

None — plan executed exactly as written. Both tasks used the verbatim interface blocks from the PLAN.md `<interfaces>` and `<action>` sections.

## Issues Encountered

- **`pnpm test` command rejected `--run`:** package.json aliases `test` → `vitest` (watch mode), not `vitest run`. Used `pnpm exec vitest run tests/content/redaction.test.ts` directly, which matches the pattern `pnpm test:ci` uses. Not a blocker; noted for future plans that might reference `--run` in acceptance criteria.
- **Full `pnpm test:ci` shows 1 failing file unrelated to 02-04:** `tests/content/content-load.test.ts` fails because `content/projects/myco.mdx` (landed by Plan 02-03 running in parallel) has a `description` > 160 chars, tripping the Zod schema. Out of scope per parallel-execution boundary (`Avoid touching content/projects/ or tests/content/content-load.test.ts.`). Logged in `deferred-items.md`; expected to resolve when 02-03 finishes or during a post-merge reconciliation.
- **`pnpm lint` shows 23 warnings + 1 error:** all pre-existing Phase 1 issues (`app/(site)/*.tsx` Tailwind class order, `app/globals.css` `!important`, `styles/tokens.css` parse). My two files lint clean — verified via `pnpm exec biome lint tests/fixtures/banned-terms.ts tests/content/redaction.test.ts`. Out of scope per SCOPE BOUNDARY rule; logged in `deferred-items.md`.

## Known Stubs

None. The only placeholder-shaped text is inside the sign-off template (`<name>`, `<project-slug>`, `<YYYY-MM-DD>`), which are intentional copy-paste markers for PR authors in Phase 7 — not rendered to any UI.

## User Setup Required

None — no environment variables, no external service configuration. The redaction gate runs locally via `pnpm test:ci` and is a pure-TS check against the on-disk `content/projects/` directory.

## Next Phase Readiness

- CNT-06 closed — Phase 2 content-pipeline requirements now fully satisfied once Plan 02-03 (Myco MDX) lands and the content-load test resolves.
- Phase 7 (content pass + launch) inherits a working redaction gate with zero setup: author drops `content/projects/<slug>.mdx` with `visibility: private`, runs `pnpm test:ci`, and gets an automatic banned-term scan per file. Checklist doc provides the PR sign-off template.
- Handoff note for Phase 7 executors: when adding a new private project, (1) run `pnpm test tests/content/redaction.test.ts`, (2) copy the sign-off block from `.planning/phases/02-content-pipeline/02-REDACTION-REVIEW.md § Sign-off template` into the PR description, (3) fill it out, (4) request review. If a new banned term is needed, update `tests/fixtures/banned-terms.ts` + the rationale table in the checklist in the same commit.

## Self-Check: PASSED

All acceptance criteria verified on disk:

- `tests/fixtures/banned-terms.ts` — EXISTS, exports `BANNED_TERMS`, uses `Object.freeze`, contains `'aktiga'`, `'voya'`, `'spectra'`
- `tests/content/redaction.test.ts` — EXISTS, imports `BANNED_TERMS` from `../fixtures/banned-terms`, defines `scanBody` with `\b...\b` regex, filters on `visibility === 'private'`
- `.planning/phases/02-content-pipeline/02-REDACTION-REVIEW.md` — EXISTS, references `tests/fixtures/banned-terms.ts`, includes "Banned terms", "Privacy-sensitive topics", and "Sign-off template" sections, lists all 3 banned terms
- Commits `df34313` (Task 1) and `9225882` (Task 2) exist in `git log --oneline`
- `pnpm exec vitest run tests/content/redaction.test.ts` → 6/6 green
- `pnpm typecheck` → exit 0

---
*Phase: 02-content-pipeline*
*Completed: 2026-04-21*
