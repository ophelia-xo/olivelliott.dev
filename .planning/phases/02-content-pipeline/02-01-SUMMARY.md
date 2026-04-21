---
phase: 02-content-pipeline
plan: 01
subsystem: content-pipeline
tags: [zod, gray-matter, mdx, schema, privacy-transform, tags, vitest]

# Dependency graph
requires:
  - phase: 02-00
    provides: "gray-matter@4.0.3 + remark-frontmatter@5.0.0 installed; @next/mdx pipeline smoke-gated with pnpm build; mdx-components.tsx stub in place"
  - phase: 01-foundation
    provides: "Vitest 3.x harness + @/ alias; TypeScript strict + noUncheckedIndexedAccess; Zod 3.23 installed"
provides:
  - "lib/tags.ts — 11-entry TAGS tuple, Tag type, TAG_LABELS record (single source of truth for project vocabulary)"
  - "lib/schemas.ts — ProjectFrontmatterSchema with .transform() enforcing privacy + ProjectFrontmatter inferred type"
  - "tests/fixtures/projects/{valid-hero,valid-private,invalid-tag}.mdx — canonical schema test fixtures"
  - "tests/content/schema.test.ts — 11 Vitest specs for acceptance/rejection"
  - "tests/content/privacy-transform.test.ts — 9 Vitest specs for privacy semantics and dev warning"
affects:
  - 02-02-content-loader
  - 02-03-query-helpers
  - 02-04-myco-content-and-redaction
  - 03-project-detail-templates
  - 04-home-and-index

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Zod .transform() as the single privacy-enforcement point (not per-consumer filtering) — impossible to ship a private-project repo link from any consumer"
    - "TAGS tuple as closed enum, fed into z.enum(TAGS) — Zod becomes the typo-gate for project tags at build time"
    - "Fixture-driven schema tests: tests/fixtures/projects/*.mdx consumed by gray-matter + schema, no vi.mock('fs') needed"
    - "NODE_ENV save/restore pattern (beforeEach/afterEach) for environment-sensitive Zod transform tests — Vitest 3.x compatible without vi.stubEnv"

key-files:
  created:
    - "lib/tags.ts"
    - "lib/schemas.ts"
    - "tests/fixtures/projects/valid-hero.mdx"
    - "tests/fixtures/projects/valid-private.mdx"
    - "tests/fixtures/projects/invalid-tag.mdx"
    - "tests/content/schema.test.ts"
    - "tests/content/privacy-transform.test.ts"
  modified: []

key-decisions:
  - "lib/schemas.ts is its own module (not inlined into lib/content.ts) so Wave 2's loader can import the schema without pulling gray-matter into any caller that only needs types"
  - "Schema uses .transform() (not .refine()) so the inferred output shape carries the privacy-adjusted object — consumers can never see the raw pre-strip form"
  - "Private-project fixture lives under tests/fixtures/, not content/projects/ — keeps real content/ surface minimal (Myco-only) and lets schema tests stay independent of Wave 3's authoring"
  - "Dropped the biome-ignore comment for noConsole — biome.json does not enable the rule (verified lint/suspicious config contains only noExplicitAny), so the suppression was dead code producing a warning"

patterns-established:
  - "Closed-enum vocabulary files (lib/tags.ts pattern) for any future controlled vocab (stack names, status values, sections)"
  - "Zod schemas live under lib/ and are authored as RSC-safe pure modules — no 'use client', no server-only (yet), importable from both lib/ and tests/"
  - "Privacy invariants enforced at the schema layer, not the consumer layer — documented in the transform body, not scattered across pages/components"

requirements-completed: [CNT-02, CNT-03]

# Metrics
duration: 3 min
completed: 2026-04-21
---

# Phase 02 Plan 01: Schema + Tags + Privacy Transform Summary

**Zod-validated ProjectFrontmatterSchema with closed-tag enum and a .transform() that auto-strips links.repo and adds code-private on private projects — 20 Vitest specs green.**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-04-21T21:05:36Z
- **Completed:** 2026-04-21T21:08:52Z
- **Tasks:** 2/2
- **Files created:** 7 (2 lib modules, 3 MDX fixtures, 2 test specs)
- **Files modified:** 1 (lib/schemas.ts — removed stale biome-ignore during Task 2)

## Accomplishments

- `lib/tags.ts` exports the 11-entry `TAGS` tuple (`local-first`, `autonomous`, `open-source`, `ai`, `agents`, `distributed`, `typescript`, `python`, `saas`, `cli`, `code-private`), the `Tag` type, and a matching `TAG_LABELS: Record<Tag, string>` — single source of truth per CONTEXT.md D-01.
- `lib/schemas.ts` exports `ProjectFrontmatterSchema` (Zod `.transform()`) and the `ProjectFrontmatter` inferred type. Schema validates every frontmatter field per CONTEXT.md (slug regex, tier enum, visibility enum, year 2000–2100, outcomes ≤ 5, description ≤ 160, tagline ≤ 140, tags drawn from `TAGS`, links as optional URLs, required hero `{src, alt}`).
- Privacy transform (CNT-03) enforces three invariants in one place: (1) `visibility: 'private'` → `code-private` tag auto-added + deduped, (2) `links.repo` stripped from output, (3) `console.warn` emitted in development only when the author accidentally populated `links.repo` on a private project. Public projects pass through unchanged.
- Three MDX fixtures under `tests/fixtures/projects/` (valid-hero, valid-private, invalid-tag) exercise acceptance, the private transform, and unknown-tag rejection — consumable via `gray-matter` from any test, no fs mocking required.
- `tests/content/schema.test.ts` (11 specs) asserts acceptance of the hero fixture, default-filling for omitted optionals, and rejection paths for unknown tag, uppercase slug, outcomes > 5, missing tier, missing visibility, tagline > 140, description > 160, year < 2000, year > 2100.
- `tests/content/privacy-transform.test.ts` (9 specs) asserts the visibility-private behavior (auto-tag, repo strip, other-link preservation, dedupe), the visibility-public non-mutation, and the dev-warning gating under all three env states (development + repo, production + repo, development + no repo).
- Full suite (`pnpm test:ci`) stays green at 94/94 — 74 Phase 1 specs plus 20 new Phase 2 specs. `pnpm typecheck` is clean. `pnpm exec biome lint` on the four files touched this plan is warning-free.

## Task Commits

Each task committed atomically:

1. **Task 1: Create lib/tags.ts + lib/schemas.ts + three test fixtures** — `44bc142` (feat)
2. **Task 2: Write schema.test.ts + privacy-transform.test.ts (20 specs green, includes dead-suppression cleanup)** — `6efcead` (test)

**Plan metadata:** (to be added in final commit — docs: complete plan)

## Files Created/Modified

**Created:**

- `lib/tags.ts` — `TAGS` tuple (11 entries), `Tag` type alias, `TAG_LABELS: Record<Tag, string>`. No runtime logic; pure vocabulary definition consumed by `lib/schemas.ts` and (later) Phase 4 filter chips.
- `lib/schemas.ts` — `ProjectFrontmatterSchema` (Zod object → `.transform()` for privacy) + `type ProjectFrontmatter = z.infer<...>`. Imports `TAGS` from `./tags`; does NOT import `node:fs`, `server-only`, or `'use client'` — safe to consume from tests, server code, and (transitively via type) any client boundary.
- `tests/fixtures/projects/valid-hero.mdx` — Public hero-tier fixture. Full frontmatter shape. Consumed by both schema.test.ts (acceptance) and privacy-transform.test.ts (public-path non-mutation asserts).
- `tests/fixtures/projects/valid-private.mdx` — Private-secondary fixture with `links.repo` populated. Exercises the entire transform path (strip + auto-tag + dev-warn).
- `tests/fixtures/projects/invalid-tag.mdx` — Negative fixture containing `tags: [not-a-real-tag]`. Schema must reject; used by schema.test.ts rejection suite.
- `tests/content/schema.test.ts` — 11 Vitest specs; `describe('…acceptance')` × 2 + `describe('…rejection')` × 9. Reads fixtures via `readFileSync` + `matter().data` and runs `ProjectFrontmatterSchema.parse()`.
- `tests/content/privacy-transform.test.ts` — 9 Vitest specs across three `describe` blocks (private mutations, public non-mutations, dev-warning gating). Uses `vi.spyOn(console, 'warn')` + explicit `NODE_ENV` save/restore in `beforeEach`/`afterEach` (pattern is Vitest-3-safe and avoids `vi.stubEnv`'s readonly-property quirk).

**Modified:**

- `lib/schemas.ts` — In Task 2, dropped the `biome-ignore lint/suspicious/noConsole` suppression (unused because `biome.json` does not enable `noConsole`) and replaced it with a plain explanatory comment. No behavior change.

## Exported Surface (for Wave 2+ consumers)

```ts
// lib/tags.ts
export const TAGS: readonly ['local-first', 'autonomous', 'open-source', 'ai',
  'agents', 'distributed', 'typescript', 'python', 'saas', 'cli', 'code-private']
export type Tag = (typeof TAGS)[number]
export const TAG_LABELS: Record<Tag, string>

// lib/schemas.ts
export const ProjectFrontmatterSchema: z.ZodEffects<z.ZodObject<...>, ..., ...>
export type ProjectFrontmatter = z.infer<typeof ProjectFrontmatterSchema>
//   note: `links.repo` remains typed as `string | undefined` because public projects preserve
//   it while private projects strip it — the union reflects both paths. Consumers should
//   treat `links.repo` as possibly-undefined and never assume its presence.
```

## Test Counts

| File                                         | Tests | Duration |
| -------------------------------------------- | ----- | -------- |
| tests/content/schema.test.ts                 | 11    | 13 ms    |
| tests/content/privacy-transform.test.ts      | 9     | 11 ms    |
| **Phase 02 Plan 01 subtotal**                | **20** | ~25 ms   |
| **Full suite (pnpm test:ci)**                | 94/94 | ~2.2 s   |

Every schema/transform behavior listed in the plan's `must_haves.truths` is covered:
- TAGS is the SSoT (rejection test on `not-a-real-tag` confirms this) ✓
- Rejects unknown tags, bad slugs, outcomes > 5 ✓
- Auto-adds `code-private` on private ✓
- Strips `links.repo` on private ✓
- Dedupes `code-private` when author adds it redundantly ✓
- Leaves public projects unmodified ✓
- Dev-warn fires only under `NODE_ENV=development` + private + `links.repo` ✓
- Every assertion runs in < 2 seconds (actual: ~25 ms combined) ✓

## Decisions Made

**1. Keep `lib/schemas.ts` as a standalone module (not inlined into the forthcoming `lib/content.ts`)**
- Rationale: CONTEXT.md § "Claude's Discretion" left this open. Separating the module means consumers that only want the type (e.g., a client component receiving `Project[]` as props in Phase 4) can import `type { ProjectFrontmatter }` without transitive-loading `gray-matter` or `fs`. It also keeps the schema testable in isolation — the two test files in this plan never touch `node:fs` beyond the fixture reader.

**2. `.transform()` — not `.refine()` — for privacy enforcement**
- Rationale: Locked per CONTEXT.md and RESEARCH.md Pitfall 5. `.transform()` alters the inferred output type so `z.infer<typeof ProjectFrontmatterSchema>` reflects the post-strip shape. `.refine()` would have kept the same input type and left consumers to remember to re-apply the mutation themselves — which is exactly the anti-pattern CNT-03 exists to prevent.

**3. Private-project fixture in `tests/fixtures/projects/`, not `content/projects/`**
- Rationale: Keeps `content/projects/` Myco-only for Wave 3. Schema tests stay independent of authored content; redaction tests in Wave 3 will walk `content/projects/` directly on real bodies.

**4. Explicit save/restore of `process.env.NODE_ENV` in dev-warn tests (not `vi.stubEnv`)**
- Rationale: Vitest 3.x supports `vi.stubEnv` but the explicit pattern is simpler, zero-API-surface, and resilient to future Vitest API changes. The test always restores the original value in `afterEach`, including the `undefined` case (handled via `delete` on the env object).

**5. Removed the `biome-ignore` suppression for `noConsole`**
- Rationale: Caught as a lint warning during Task 2 verification. `biome.json` `linter.rules.suspicious` enables only `noExplicitAny: warn` (and `recommended`). `noConsole` is not part of Biome's `recommended` set, so there is no rule to suppress. Removing the dead suppression is both a lint fix and a signal for future plans not to copy the pattern from RESEARCH templates verbatim without checking project config.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed stale `biome-ignore` suppression in `lib/schemas.ts`**
- **Found during:** Task 2 verification (`pnpm exec biome lint` on the four files I authored this plan)
- **Issue:** The `// biome-ignore lint/suspicious/noConsole: author-facing warning` comment that RESEARCH.md's verbatim snippet includes produced a `suppressions/unused` warning because `biome.json`'s `linter.rules.suspicious` block enables only `noExplicitAny` (plus Biome recommended), not `noConsole`. The suppression was pointing at a rule that doesn't exist in this project's config, making the comment dead code.
- **Fix:** Replaced the `biome-ignore` line with a plain two-line comment explaining the intent of the `console.warn` and explicitly noting the project does not enable `noConsole`.
- **Files modified:** `lib/schemas.ts`
- **Verification:** `pnpm exec biome lint lib/tags.ts lib/schemas.ts tests/content/schema.test.ts tests/content/privacy-transform.test.ts` → "No fixes applied. Found 0 warnings." Content tests still green (20/20).
- **Committed in:** `6efcead` (Task 2 commit — bundled with the test files because the fix was discovered while verifying Task 2's lint criterion)

---

**Total deviations:** 1 auto-fixed (1 bug — dead suppression)
**Impact on plan:** No scope change. The plan's verbatim interface snippet carried over a project-config-sensitive suppression from the RESEARCH doc; removing it is pure hygiene. All success criteria still met.

## Issues Encountered

- **`pnpm test …  --run` does not pass `--run` through:** pnpm intercepts the flag and fails with "Unknown option: 'run'". Worked around by invoking `pnpm exec vitest run …` directly. Not a blocker; noted for Wave 2+ executor convenience.
- **`tsconfig.json` excludes the `tests/` directory:** `pnpm typecheck` does NOT type-check the test files (Vitest compiles them via its own esbuild path). This is pre-existing Phase 1 config, not introduced by this plan. The 20-test pass on `pnpm exec vitest run` is the effective type-gate for the test specs.

## Authentication Gates

None — this plan touches only Zod, `gray-matter`, and Vitest. No external services, no auth.

## User Setup Required

None — no external service configuration introduced.

## Known Stubs

None. Every file this plan created carries either real validation/transform code (`lib/*`) or real test assertions backed by real fixtures (`tests/*`). No placeholder data wired to any UI surface.

## Next Phase Readiness

**Ready for Plan 02-02** (Wave 2 — `lib/content.ts` collection loader). Downstream plans can now:

- Import `{ ProjectFrontmatterSchema, type ProjectFrontmatter } from '@/lib/schemas'` and call `.parse()` on the object returned by `gray-matter`'s `matter(raw).data`.
- Rely on the transform having already applied privacy rules by the time `.parse()` returns — no per-consumer `delete links.repo` or `tags.push('code-private')` logic is ever needed.
- Consume `{ TAGS, type Tag, TAG_LABELS } from '@/lib/tags'` for filter chip UIs and tag index derivation in Phase 4+ without a second source-of-truth.
- Use the fixtures (`tests/fixtures/projects/*`) as realistic inputs for loader tests (Wave 2) — specifically the slug-mismatch guard test can reuse `valid-hero.mdx` with a filename rename to trigger the assertion.

**Blockers for rest of Phase 2:** None.

**Recommendation for Wave 2 executor (Plan 02-02):** Implement `lib/content.ts` per RESEARCH.md Pattern 1 (synchronous `loadAll()` with `fs.readdirSync` + `gray-matter` + `ProjectFrontmatterSchema.parse()`). Add `import 'server-only'` at the top of that file — this plan intentionally did NOT add it to `lib/schemas.ts` because `lib/schemas.ts` is safe to import from tests and any RSC. Wave 2's loader is where the `fs` dependency crosses the client boundary.

**One pattern to repeat:** When RESEARCH.md or a plan's `<interfaces>` block includes `biome-ignore` suppressions verbatim, verify against `biome.json` first. This project enables only `useExhaustiveDependencies` (warn), `noExplicitAny` (warn), `useImportType` (error), `useConst` (error), and the `useSortedClasses` nursery rule — anything else in a `biome-ignore` is dead code.

## Self-Check: PASSED

Verified:
- `lib/tags.ts` exists on disk ✓
- `lib/schemas.ts` exists on disk ✓
- `tests/fixtures/projects/valid-hero.mdx` exists on disk ✓
- `tests/fixtures/projects/valid-private.mdx` exists on disk ✓
- `tests/fixtures/projects/invalid-tag.mdx` exists on disk ✓
- `tests/content/schema.test.ts` exists on disk ✓
- `tests/content/privacy-transform.test.ts` exists on disk ✓
- `.planning/phases/02-content-pipeline/02-01-SUMMARY.md` exists on disk ✓
- Task 1 commit `44bc142` present in `git log --oneline --all` ✓
- Task 2 commit `6efcead` present in `git log --oneline --all` ✓

---
*Phase: 02-content-pipeline*
*Completed: 2026-04-21*
