---
phase: 05-about-+-resume-+-contact
plan: 01
subsystem: content
tags: [resume, zod, schema, content-pipeline, pitfall-12, banned-words, tdd]

requires:
  - phase: 05-about-+-resume-+-contact
    plan: 00
    provides: tests/resume/schema.test.ts + tests/resume/content.test.ts Wave-0 placeholders (now filled)
  - phase: 02-content-pipeline
    provides: lib/schemas.ts (existing ProjectFrontmatterSchema pattern to mirror)
provides:
  - lib/schemas.ts ResumeSchema + type Resume (Zod) — used by content/resume.ts and downstream resume components
  - content/resume.ts RESUME (typed const) — verbatim pre-extracted .docx data, Pitfall 12 dual-gated, banned-words clean
  - 9 schema validation tests (1 happy + 8 negative, each locks issue path)
  - 11 content tests (Pitfall 12 module-load, schema round-trip, canonical contact info, PROJECT.md project enumeration, banned-words regression net)
affects:
  - 05-02-PLAN.md (resume HTML render imports { RESUME } from '@/content/resume')
  - 05-05-PLAN.md (Puppeteer PDF pipeline renders the same React tree fed by RESUME)
  - any future banned-word additions: edit tests/resume/content.test.ts BANNED_WORD_REGEX in one place

tech-stack:
  added: []
  patterns:
    - "Zod dual-gate (Pitfall 12): `satisfies Resume` at compile + `ResumeSchema.parse(data)` at module load. Static check catches shape drift before runtime; runtime check catches values TypeScript can't (invalid URL strings, empty bullet arrays bypassing the `string[]` type). Both must agree or build/import fails."
    - "Banned-words regression net via concatenated corpus + single regex. Every user-facing string in RESUME is joined into one corpus and matched against `/\\b(...)\\b/i`. Adding a new banned word is a one-line edit in `tests/resume/content.test.ts`."
    - "Banned-words trumps verbatim. UI-SPEC § Copywriting Contract carries forward Phase 4's banned-words list; when verbatim source data violates the list, the rewrite is recorded as a header comment in `content/resume.ts` with the original phrase, the replacement, and the rule that drove the change."
    - "Schema-test issue-path locks. Each negative `safeParse` test asserts on the exact `result.error.issues[].path` so a future regression that loosens validation (e.g., dropping `.min(1)` from a bullet array) is caught — not just the fact of rejection."

key-files:
  created:
    - content/resume.ts
    - .planning/phases/05-about-+-resume-+-contact/deferred-items.md
  modified:
    - lib/schemas.ts
    - tests/resume/schema.test.ts
    - tests/resume/content.test.ts

key-decisions:
  - "ResumeSchema appended to lib/schemas.ts (NOT a separate file) per plan must_haves — single Zod module, both ProjectFrontmatterSchema and ResumeSchema co-located, type-only imports remain fs-free as established in Phase 2."
  - "ResumeSchema has no `.transform()` step (unlike ProjectFrontmatterSchema). The resume has no privacy/auto-tag rules; the shape parsed in equals the shape consumed."
  - "Education `bullets` field uses `z.array(z.string()).max(4).default([])` — bullets are optional with empty-array default, max 4 (per RESEARCH Example 1). The UNC bootcamp entry uses one bullet; honors-rich Appalachian State uses three."
  - "Banned word 'ecosystem' in Myco bullet rewritten to 'community'. The verbatim RESEARCH data block contains 'broader autonomous-agent ecosystem' but 'ecosystem' is on the Phase 4 banned-words carry-forward list (UI-SPEC § Banned-words list). The test (Test 9) enforces the list and the verbatim rule yields. Rewrite preserves meaning. Documented in content/resume.ts header alongside the existing 'Passionate' → 'Active in' rewrite."

metrics:
  duration: 4min
  tasks: 2
  files: 5
  completed: 2026-05-17

requirements-completed: [RES-01, RES-06]
---

# Phase 05 Plan 01: Resume Schema + Content Source-of-Truth Summary

**Typed Zod ResumeSchema in lib/schemas.ts + content/resume.ts populated verbatim from .docx-extracted data (with two banned-word rewrites), Pitfall 12 dual-gated, validated by 24 tests across schema + content suites — downstream resume render (05-02) and Puppeteer PDF pipeline (05-05) can now import { RESUME } from '@/content/resume' and trust the shape.**

## Performance

- **Duration:** 4 min
- **Started:** 2026-05-17T14:28:14Z
- **Completed:** 2026-05-17T14:32:45Z
- **Tasks:** 2 (both TDD: RED + GREEN per task = 4 commits)
- **Files created/modified:** 5

## Accomplishments

- **ResumeSchema (RES-01).** Added 6-sub-schema Zod object to `lib/schemas.ts` (Header, Experience, Project, Education, SkillsCategory + the top-level Resume composer). Mirrors the existing `ProjectFrontmatterSchema` pattern but without a `.transform()` step (no privacy rules on the resume). `type Resume = z.infer<typeof ResumeSchema>` exported alongside.
- **content/resume.ts (RES-01, RES-06).** Copied the data block verbatim from RESEARCH § Resume Data — Pre-Extracted into `content/resume.ts`. Pitfall 12 dual-gated: `satisfies Resume` for compile-time + `ResumeSchema.parse(data)` for module-load runtime. Build fails loudly if either contract drifts.
- **Two banned-word rewrites** (UI-SPEC § Copywriting Contract):
  - Summary: docx PROFILE word "Passionate" → "Active in" (the documented Phase 4 carry-forward).
  - Myco bullet: "broader autonomous-agent ecosystem" → "broader autonomous-agent community" — discovered during banned-words audit; "ecosystem" is on the same list and the test enforces it.
- **Schema tests (9).** 1 happy-path round-trip + 8 negative cases (empty object, bad email, bad URL, empty bullets, >6 bullets, empty projects, empty skill items, empty education). Each negative test asserts on `result.error.issues[].path` so loosening validation later is caught.
- **Content tests (11 expected → 15 actual after `it.each`).** Module-load (Pitfall 12 gate), schema round-trip, canonical contact info (`olivelliott48@gmail.com`, `github.com/olivelliott`), Aktiga as current role, all 5 PROJECT.md projects present (Myco/Fathom/Agenda Keeper/Trade Bot/Stemz — expanded from one `some(...)` test to 5 via `it.each`), Myco canonical repo URL, banned-words regression net, 5 required skills categories, both education institutions.
- **PLACEHOLDER comments preserved** for LinkedIn handle, Fathom repo URL, Stemz live URL, and the events-and-services omission. Each marked with `// PLACEHOLDER: confirm with Olive` so Phase 7 (real content pass) can resolve.

## Pitfall 12 dual-gate — confirmed in place

```ts
// content/resume.ts (tail of file)
} satisfies Resume                                  // ← compile-time check

export const RESUME: Resume = ResumeSchema.parse(data)  // ← runtime check at module load
```

- **Static layer (`satisfies Resume`)** keeps the object literal's narrow types while asserting the shape matches `Resume`. A typo in a field name fails `pnpm typecheck`.
- **Runtime layer (`ResumeSchema.parse(data)`)** throws at module load if the data is malformed in a way TypeScript can't catch — invalid URL string, empty bullet array, etc. Build fails loudly; you never see a runtime error on first `/resume` visit.
- **Verification:** `pnpm vitest run tests/resume/content.test.ts` test 1 imports the module — if the parse throws, the test file itself fails to load (reaches the assertion only when the gate holds).

## PLACEHOLDERs to resolve before Phase 7 launch

These are explicitly commented in `content/resume.ts` so future passes can find them via grep:

1. **LinkedIn handle.** Current value `olive-elliott` is a Phase 1 footer placeholder. The .docx says "LinkedIn" without a handle.
2. **Fathom repo URL.** Public per STATE.md but no URL in the .docx. Entry currently has no `link` field — Fathom renders with bullets only on the resume.
3. **Stemz live URL.** No URL in the .docx and likely no public site (Stemz was a local WordPress for Aktiga). Entry currently has no `link` field.
4. **Events & services entries.** Mast Farm Inn (2018) and Melanie's (2015–2019) from the .docx EVENTS section omitted — confirm with Olive whether to surface for a hiring-manager audience or drop for the engineer-positioned distribution.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 — Banned-word verbatim conflict] Rewrote 'ecosystem' → 'community' in Myco bullet**

- **Found during:** Task 05-01-02, banned-words audit before the GREEN commit.
- **Issue:** RESEARCH § Resume Data — Pre-Extracted contains the literal string `"Released as open-source under Apache 2.0 to support the broader autonomous-agent ecosystem"` in the Myco bullet array. The same plan mandates a banned-words regression test against `/\b(...|ecosystem|...)\b/i`. The verbatim-copy instruction and the banned-words-clean acceptance criterion contradict each other in the same plan.
- **Resolution:** Banned-words contract wins (precedent set by the documented `"Passionate"` → `"Active in"` rewrite in the same RESEARCH block). Replaced `"ecosystem"` with `"community"` — meaning preserved (both words describe the broader autonomous-agent space the Myco release benefits).
- **Files modified:** `content/resume.ts` (one bullet + header-comment deviation log).
- **Commit:** `8b23ca2`.

### Minor verification command discrepancy (informational, not a deviation)

The plan's verification block includes `node --import tsx -e "import('./content/resume.ts').then(m => console.log(m.RESUME.header.name))"` which fails outside the bundler — raw Node + tsx does NOT resolve the `@/*` path alias used by the `import { type Resume, ResumeSchema } from '@/lib/schemas'` statement. The dual-gate runtime check is fully exercised by `pnpm vitest run tests/resume/content.test.ts` (vitest's vite-node resolves the alias). The plan's smoke command would only work if the file used a relative import.

## Issues Encountered

None beyond the one banned-word deviation logged above. All 24 plan-mandated tests passed on first GREEN; typecheck clean throughout; full suite (`pnpm vitest run`) advanced from 301 passing / 16 skipped to 325 passing / 14 skipped — the +24 / -2 deltas match exactly (9 schema + 15 content added; the 2 Wave-0 placeholder skips converted to implementations).

## User Setup Required

None. Phase 5 Plan 01 is pure source-of-truth wiring — no env vars, no external services, no auth.

## Verification Results

```
=== Plan-mandated verification ===
pnpm vitest run tests/resume/schema.test.ts tests/resume/content.test.ts
  → Test Files  2 passed (2)
  → Tests      24 passed (24)

pnpm vitest run        (full suite — no regression)
  → Test Files 40 passed | 14 skipped (54)
  → Tests     325 passed | 14 skipped (339)
  → Previous wave-0 baseline: 301 passing | 16 skipped → delta is +24 / -2 (matches exactly)

pnpm typecheck         (strict mode, noUncheckedIndexedAccess)
  → exit 0

grep banned-words audit
  → 3 references in content/resume.ts (all in header/inline comments documenting the rewrites — zero matches in user-facing string data)
```

## Next Phase Readiness

- **Plan 05-02 (resume route + components + print CSS) is unblocked.** `import { RESUME } from '@/content/resume'` is now safe; the typed shape is guaranteed by the dual-gate.
- **Plan 05-05 (Puppeteer pipeline)** will render the same React tree the HTML route renders; `RESUME` is the single source of truth for both.
- **6 Wave-0 placeholder tests in `tests/resume/`** (resume-page, resume-header, resume-section, resume-entry, download-pdf-link, print-css) remain `it.skip`d for Plan 05-02 to implement.

## Self-Check: PASSED

Files verified present on disk:
- `content/resume.ts` — FOUND
- `lib/schemas.ts` — FOUND (ResumeSchema added; ProjectFrontmatterSchema preserved)
- `tests/resume/schema.test.ts` — FOUND (9 implemented tests)
- `tests/resume/content.test.ts` — FOUND (15 implemented tests after it.each expansion)
- `.planning/phases/05-about-+-resume-+-contact/deferred-items.md` — FOUND

Commits verified in `git log --oneline -5`:
- `4d0e08e` test(05-01): RED for ResumeSchema — FOUND
- `207a6cb` feat(05-01): GREEN for ResumeSchema — FOUND
- `c10ca9f` test(05-01): RED for content/resume.ts — FOUND
- `8b23ca2` feat(05-01): GREEN for content/resume.ts — FOUND

---
*Phase: 05-about-+-resume-+-contact*
*Plan: 01*
*Completed: 2026-05-17*
