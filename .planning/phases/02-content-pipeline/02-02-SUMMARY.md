---
phase: 02-content-pipeline
plan: 02
subsystem: content-pipeline
tags: [content-loader, query-api, vitest, server-only, gray-matter, fs, zod-transform]

# Dependency graph
requires:
  - phase: 02-01
    provides: "ProjectFrontmatterSchema (Zod + privacy transform) and ProjectFrontmatter inferred type; Tag enum; three MDX fixtures under tests/fixtures/projects/"
  - phase: 02-00
    provides: "gray-matter@4.0.3 runtime dep; @next/mdx + remark-frontmatter pipeline wired; mdx-components.tsx stub"
  - phase: 01-foundation
    provides: "Vitest 3.x harness + @/* alias; TypeScript strict + noUncheckedIndexedAccess"
provides:
  - "lib/content.ts — synchronous fs+gray-matter collection loader; exports frozen `allProjects: readonly Project[]`, `type Project`, and `_loadForTests(dir)` test seam; imports 'server-only' for client-bundle hardening"
  - "lib/projects.ts — pure-function query API over the collection: getAll, getHeroProjects, getProject, getAllTags, getProjectsByTag, getRelatedProjects"
  - "tests/content/content-load.test.ts — 6 integration specs exercising _loadForTests against temp-dir fixture copies (load, body, private transform, schema throw, slug-mismatch throw, existsSync guard)"
  - "tests/content/tag-index.test.ts — 16 unit specs asserting every query helper against a vi.mock'd 4-project fixture"
  - "tests/stubs/server-only.ts + vitest.config.ts alias — Vitest-side stub for Next's server-only package, unblocks all future tests that import server-only modules"
affects:
  - 02-03-myco-content-and-content-load-extension
  - 02-04-redaction-test
  - 03-project-detail-templates
  - 04-home-and-index
  - 06-sitemap-and-og

# Tech tracking
tech-stack:
  added:
    - "server-only@0.0.1 — runtime dep required by lib/content.ts's 'server-only' import. Next.js ships it transitively via the RSC bundler plugin, but pnpm's strict mode does not expose it at the top level, so Vitest and direct Node resolution need it in package.json."
  patterns:
    - "Test-only seam pattern: lib/content.ts exports _loadForTests(dir) marked @internal in JSDoc — tests point the loader at ephemeral fs.mkdtempSync dirs without mocking node:fs"
    - "vi.mock(@/lib/content) + top-level await import(@/lib/projects): mocks the collection source to a fixture array, then binds the pure query helpers to the mocked module — isolates query logic from the real content directory"
    - "Temp-dir-per-spec fixture isolation: each content-load.test.ts spec copies only the fixtures it needs to a fresh mkdtempSync dir so invalid-tag.mdx never contaminates valid-file specs"
    - "server-only Vitest alias: alias 'server-only' -> tests/stubs/server-only.ts in vitest.config.ts so server-only modules load under Node without triggering the package's require-time throw"

key-files:
  created:
    - "lib/content.ts"
    - "lib/projects.ts"
    - "tests/content/content-load.test.ts"
    - "tests/content/tag-index.test.ts"
    - "tests/stubs/server-only.ts"
  modified:
    - "vitest.config.ts (added server-only alias)"
    - "package.json + pnpm-lock.yaml (server-only@0.0.1)"

key-decisions:
  - "Installed server-only as an explicit runtime dependency rather than aliasing to tests/stubs only — keeps the prod build consistent (Next.js native resolution) AND Node/Vitest able to resolve the bare specifier. Alias in vitest.config replaces the runtime throw with an empty module during tests."
  - "Did NOT cache getAll()/getAllTags() results in module-level memoized variables — 6-20 projects is free; the complexity cost of memoization invalidation is not worth it. Consumer pages call these at RSC render time, which is itself cached by Next."
  - "getProject(slug) reads allProjects (not getAll) so archived slug lookups still resolve — consumer pages handle the resulting Project via notFound() on undefined, not on status==='archived'"
  - "Each content-load.test.ts spec uses its own fs.mkdtempSync dir and rm -rf teardown, not a shared beforeEach — per-spec isolation beats shared setup for a loader test where one bad fixture leaking would silently corrupt later assertions"
  - "tests/stubs/server-only.ts kept under tests/ (not lib/) so it's excluded from tsconfig.json's compile and never accidentally imported by production code. The vitest.config alias is the only consumer."

patterns-established:
  - "Server-only module test seam pattern: pair `_loadForTests(dir)` + `vi.mock` for consumer-side tests + vitest.config alias for server-only imports. Future phases with server-only lib modules (e.g., redaction scanner in 02-04) can reuse all three pieces."
  - "Object.freeze at the collection boundary in lib/content.ts; consumers .slice() before .sort() in lib/projects.ts — readonly immutability propagates through the API without runtime mutation risk"
  - "Plan-level deviation policy in practice: install missing runtime deps (Rule 3) immediately when discovered during test execution, don't defer to a separate plan — the cost is a single commit line, not a planning-ceremony roundtrip"

requirements-completed: [CNT-01, CNT-04]

# Metrics
duration: 6 min
completed: 2026-04-21
---

# Phase 02 Plan 02: Content Loader + Query API Summary

**Synchronous fs+gray-matter collection loader and pure-function query API over project MDX; 22 new Vitest specs (6 integration + 16 unit), full suite 116/116 green, typecheck and build clean.**

## Performance

- **Duration:** ~6 min
- **Started:** 2026-04-21T21:12:38Z
- **Completed:** 2026-04-21T21:18:28Z
- **Tasks:** 2/2
- **Files created:** 5 (`lib/content.ts`, `lib/projects.ts`, two test specs, one Vitest stub)
- **Files modified:** 3 (`vitest.config.ts`, `package.json`, `pnpm-lock.yaml`)

## Accomplishments

- `lib/content.ts` synchronously walks `content/projects/*.mdx` at module init, parses each file with gray-matter, pipes the frontmatter through `ProjectFrontmatterSchema.parse()` (so the Wave 1 privacy transform runs here, not in consumers), and exposes a frozen `allProjects: readonly Project[]`. An `existsSync` guard makes the loader safe when the content directory does not yet exist — critical since Wave 2 completes before Myco lands in Wave 3 (Plan 02-03).
- Build-time slug invariant enforced: if a file's name-derived slug differs from its frontmatter `slug`, the loader throws `Slug mismatch in {file}: …`. This is caught at `next build` time on real content (and at test load time for fixtures), so downstream consumers can trust that the filename slug and the frontmatter slug are one and the same.
- `import 'server-only'` at the top of `lib/content.ts` — any `'use client'` file that tries to import the loader fails the Next.js build with a clear error. Hardens Pitfall 2 from RESEARCH.md.
- `_loadForTests(dir)` is exported alongside `allProjects`, marked `@internal` in JSDoc. Test specs point it at ephemeral `fs.mkdtempSync` directories populated from `tests/fixtures/projects/`, so each spec runs against a known-good (or known-bad) corpus in isolation.
- `lib/projects.ts` provides the entire consumer-facing query API: `getAll`, `getHeroProjects`, `getProject`, `getAllTags`, `getProjectsByTag`, `getRelatedProjects`. All functions return `readonly Project[]` (or `readonly {tag,count}[]`) — no consumer can mutate the source. `getAll()` calls `.slice()` before `.sort()` so the frozen `allProjects` source is preserved.
- `getProject(slug)` reads from `allProjects` directly rather than `getAll()` — archived projects stay resolvable by slug for explicit permalink lookups, while the collection-level views (`getAll`, `getAllTags`, `getProjectsByTag`) correctly exclude them.
- `getRelatedProjects(slug, limit=3)` scores by overlapping-tag count, excludes the target itself, drops zero-overlap candidates (score > 0 only), sorts by score descending, and respects `limit`. Returns `[]` when the target slug is unknown — defensive against consumer pages that may pass a bad slug.
- `tests/content/content-load.test.ts` (6 specs): happy path (2 fixtures), body extraction (YAML stripped), private-project transform applied at load (code-private tag + repo strip), schema-rejection throw (invalid-tag fixture), slug-mismatch throw (valid-hero copied under a different filename), and `existsSync` empty-dir guard.
- `tests/content/tag-index.test.ts` (16 specs): uses `vi.mock('@/lib/content')` to substitute a 4-project in-memory fixture (hero/secondary/archived mix across `local-first`, `ai`, `typescript`, `agents`, `open-source`, `saas` tags), then `await import('@/lib/projects')` binds the helpers to the mocked source. Covers every query function with at least three assertions: filter behavior, sort behavior, archived-exclusion, defensive empty returns, and limit handling.
- `tests/stubs/server-only.ts` + the new `server-only` alias in `vitest.config.ts` make server-only modules importable under Vitest. This is reusable by any future phase's test that needs to exercise a server-only lib module (02-04 redaction, 03 project-page helpers, 06 sitemap generator).
- Full suite: 116/116 tests green in ~1.5 s. `pnpm typecheck` clean. `pnpm build` succeeds (Turbopack static-prerenders `/` and `/_not-found`). `pnpm lint` warnings are all pre-existing from Phase 1 (see Deviations).

## Task Commits

Each task committed atomically:

1. **Task 1: Create lib/content.ts + lib/projects.ts (+ server-only install)** — `2183fb9` (feat)
2. **Task 2: Write content-load + tag-index Vitest specs + server-only alias** — `10097db` (test)

**Plan metadata commit:** to be added after this SUMMARY file is written (`docs(02-02): complete …`).

## Files Created/Modified

**Created:**

- `lib/content.ts` — 62 lines. Imports `node:fs`, `node:path`, `gray-matter`, `'server-only'`, and the Wave 1 schema. Exports `Project` (= `ProjectFrontmatter & {slug, body}`), `_loadForTests(dir)`, and `allProjects` (called with `CONTENT_DIR`). The synchronous `load(dir)` helper is the single implementation point — both the module-level init and `_loadForTests` delegate to it.
- `lib/projects.ts` — 76 lines. No I/O, no fs, no server-only — depends only on the `allProjects` export + the `Tag` type. Six pure functions, each with JSDoc describing the invariants asserted by `tag-index.test.ts`.
- `tests/content/content-load.test.ts` — 6 specs, ~76 lines. Each spec allocates its own temp dir via `fs.mkdtempSync`, copies only the fixtures it needs, runs `_loadForTests`, asserts, and cleans up with `fs.rmSync({recursive:true, force:true})`.
- `tests/content/tag-index.test.ts` — 16 specs, ~180 lines. Uses a `makeProject` factory for terse fixture declarations, `vi.mock('@/lib/content')` for source substitution, and top-level `await import('@/lib/projects')` to bind helpers after the mock is registered.
- `tests/stubs/server-only.ts` — 5 lines. Empty-export module; the vitest config aliases `'server-only'` to this path so `import 'server-only'` under Vitest is a no-op instead of the real package's require-time throw.

**Modified:**

- `vitest.config.ts` — added `'server-only'` to the alias map pointing at the stub. Commented the rationale inline.
- `package.json` — added `server-only@^0.0.1` to `dependencies` (required for Next's native RSC resolution plus Node-level resolution).
- `pnpm-lock.yaml` — regenerated for the single added dep.

## Exported Surface (for Wave 3+ consumers)

```ts
// lib/content.ts
export type Project = ProjectFrontmatter & { slug: string; body: string }
export function _loadForTests(dir: string): readonly Project[]        // @internal
export const allProjects: readonly Project[]

// lib/projects.ts
export function getAll(): readonly Project[]
export function getHeroProjects(): readonly Project[]
export function getProject(slug: string): Project | undefined
export function getAllTags(): ReadonlyArray<{ tag: Tag; count: number }>
export function getProjectsByTag(tag: Tag): readonly Project[]
export function getRelatedProjects(slug: string, limit?: number): readonly Project[]
```

Consumer guidance:

- Phase 3's `app/(site)/projects/[slug]/page.tsx` should call `generateStaticParams` off `getAll().map(p => ({slug: p.slug}))` and use `getProject(slug)` inside the page, returning `notFound()` on `undefined`.
- Phase 3's detail template can call `getRelatedProjects(slug, 3)` for the next-project nav.
- Phase 4's home hero grid uses `getHeroProjects()`; the `/projects` index uses `getAll()` and `getAllTags()` for the filter chip row.
- Phase 6's `app/sitemap.ts` uses `getAll()` for URL generation.
- **Never** import `lib/content.ts` from a client component — the `server-only` import will fail the build.
- **Client components** (filter UI in Phase 4) must receive the list of projects / tags as serialized props from an RSC parent.

## Test Counts

| File                                         | Tests | Duration |
| -------------------------------------------- | ----- | -------- |
| tests/content/content-load.test.ts           | 6     | ~16 ms   |
| tests/content/tag-index.test.ts              | 16    | ~28 ms   |
| **Phase 02 Plan 02 subtotal**                | **22** | ~44 ms   |
| **Phase 02 content subsuite (4 files)**      | 42    | ~73 ms   |
| **Full suite (pnpm test:ci)**                | **116/116** | ~1.55 s |

Every truth in the plan's `must_haves.truths` has a corresponding green assertion:

- `lib/content.ts` reads at module init + frozen array ✓ (content-load spec 1 + 2)
- Slug/filename invariant enforced ✓ (content-load spec 5)
- Schema `.parse()` runs at load time ✓ (content-load spec 3 asserts post-transform shape; spec 4 asserts schema rejection)
- `_loadForTests(dir)` works ✓ (every content-load spec uses it)
- `lib/projects.ts` exports all 6 helpers ✓ (tag-index imports each and tests it)
- `getAll()` archived-exclusion + order-asc ✓ (tag-index getAll block)
- `getAllTags()` counts + count-desc-then-tag-asc ✓ (tag-index getAllTags block)
- `getRelatedProjects()` overlap scoring + self-exclusion ✓ (tag-index getRelatedProjects block)
- Both test files green < 2 s total ✓ (actual: ~44 ms for the two Wave 2 specs)

## Decisions Made

**1. Install `server-only` as an explicit runtime dependency AND alias it in vitest.config.ts**

- Two-environment problem: Next.js's bundler plugin replaces `'server-only'` imports in client modules with a build error, and in server modules with a no-op. Vitest has neither of those plugins.
- Without the install: `require.resolve('server-only')` fails under Node (pnpm's strict mode does not expose transitive deps). Every Phase 1 test that transitively loads any server-only module would break.
- Without the alias: `import 'server-only'` runs the real package's `index.js`, whose sole purpose is `throw new Error('This module cannot be imported from a Client Component module…')`. Vitest's jsdom environment counts as "client" for the purposes of that runtime check, so every test that imports `@/lib/content` would fail to load.
- The combined fix — install + alias — gives us working prod builds AND green tests with one extra dependency (~800 bytes gzipped) and five lines of Vitest config.

**2. `_loadForTests(dir)` as the test seam (Option A from RESEARCH.md)**

- Confirmed by the plan as the chosen option. The implementation is one exported function that delegates to the same private `load(dir)` as the module-init path — no duplicated logic, no mock surface growth.
- Marked `@internal` in JSDoc so editor tooling (IDE, ESLint config, etc.) can call it out if a future consumer imports it from production code.

**3. Per-spec `mkdtempSync` isolation in content-load.test.ts**

- A shared `beforeEach` that copies all fixtures into one temp dir would make specs order-sensitive (invalid-tag would throw during the valid-fixture spec's load). Per-spec temp dirs keep each assertion hermetic at the cost of a handful of syscalls — total still runs in ~16 ms.

**4. No memoization of `getAll()`, `getAllTags()`, etc.**

- CNT-04 says query helpers are "pure functions over the loaded collection." At 6–20 projects, `.slice().sort()` is free. Memoization would add a Map-based cache with invalidation logic that has no trigger (the collection is frozen at module init).
- If future scale demands it, one module-level `let cachedGetAll = null` in `lib/projects.ts` is a trivial retrofit — no consumer change required.

**5. Vitest stub kept under `tests/stubs/`, not `lib/stubs/`**

- `lib/` is production code; the stub is a test-environment concern only. Placing it under `tests/` keeps it out of `tsconfig.json`'s compile scope (which excludes `tests/`) so it cannot accidentally be imported by production code.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 — Blocker] `server-only` package not resolvable by Node/Vitest**

- **Found during:** Task 1 verification attempt. The plan's interface block specifies `import 'server-only'` in `lib/content.ts`. TypeScript's `tsc --noEmit` passed (resolution goes via Next.js types), but `node -e "require.resolve('server-only')"` failed with `Cannot find module 'server-only'`.
- **Issue:** Next.js bundles the `server-only` symbol transitively (it's under `node_modules/.pnpm/next@.../dist/compiled/server-only`), but pnpm's strict mode does not expose transitive packages at the top level. Bare-specifier resolution from `lib/content.ts` fails under Node, which blocks Vitest from loading the module at all.
- **Fix:** `pnpm add server-only` (0.0.1, ~800 bytes). Added to `dependencies` because Next.js resolves it from `dependencies` during `next build`.
- **Files modified:** `package.json`, `pnpm-lock.yaml`.
- **Verification:** `node -e "require.resolve('server-only')"` → succeeds. Re-ran `pnpm test:ci` → 94/94 still green (no regression pre-Task-2).
- **Committed in:** `2183fb9` (Task 1 commit — bundled with the loader because the import originates there).

**2. [Rule 3 — Blocker] `server-only` package throws at require-time under Vitest**

- **Found during:** Task 2's first test run. After Task 1 fixed resolution, the new `tests/content/content-load.test.ts` failed with `Error: This module cannot be imported from a Client Component module. It should only be used from a Server Component.` emitted from `node_modules/.pnpm/server-only@0.0.1/node_modules/server-only/index.js:1:7`.
- **Issue:** The `server-only` package's entire runtime behavior is to throw. In a Next.js build, the RSC bundler plugin replaces it in server modules with a no-op; Vitest has no such plugin, so the real throwing module loads.
- **Fix:** Created `tests/stubs/server-only.ts` (empty export) and aliased `'server-only' → tests/stubs/server-only.ts` in `vitest.config.ts`. This is the documented pattern for testing server-only modules (also used by Shadcn, Clerk, and others in their own test suites).
- **Files modified:** `vitest.config.ts`, `tests/stubs/server-only.ts` (created).
- **Verification:** Post-alias test run → 22/22 new specs pass; full suite 116/116 pass.
- **Committed in:** `10097db` (Task 2 commit — bundled with the tests it unblocks).

---

**Total deviations:** 2 auto-fixed (both Rule 3 — missing infrastructure in the test environment).
**Impact on plan:** No scope change. Both fixes are infrastructure glue required to run the plan's exact tests against the plan's exact code. Both patterns (install `server-only`, alias it in Vitest) are now available to future phases that need server-only modules — this is a net win even though the plan did not anticipate them.

## Issues Encountered

- **`pnpm lint` fails with 1 error** — pre-existing from Phase 1 and Plan 02-00. The error is `styles/tokens.css:7 parse — Tailwind-specific syntax is disabled` (Biome CSS parser needs `tailwindDirectives: true` for Tailwind v4's `@theme` directive). Already documented in `.planning/phases/02-content-pipeline/deferred-items.md` during 02-00. Out of scope for this plan — not caused by any Plan 02-02 code. `pnpm exec biome lint lib/content.ts lib/projects.ts tests/content/content-load.test.ts tests/content/tag-index.test.ts tests/stubs/server-only.ts vitest.config.ts` is clean (0 warnings, 0 errors).
- **`pnpm test … --run` still swallows `--run`** (noted in 02-01 summary). Workaround is `pnpm exec vitest run …` directly. Not a blocker.

## Authentication Gates

None — this plan is entirely in-process code. No external services.

## User Setup Required

None.

## Known Stubs

None. Every line of `lib/content.ts` and `lib/projects.ts` is backed by tests, and no UI surface consumes them yet — Phase 3 is the first UI consumer. `tests/stubs/server-only.ts` is named "stub" but it's a **test environment shim**, not a data stub that masquerades as real content.

## Next Phase Readiness

**Ready for Plan 02-03** (Wave 3 — author `content/projects/myco.mdx` from the README). Downstream plans can now:

- Create `content/projects/myco.mdx` and the loader will pick it up on next module init. `allProjects.length` will go from 0 to 1 after Plan 02-03 lands.
- Extend `tests/content/content-load.test.ts` (or add a new `content/myco.test.ts`) with real-directory assertions: `_loadForTests(path.join(process.cwd(), 'content/projects'))` should return exactly one project with `slug === 'myco'`, `tier === 'hero'`, `visibility === 'public'`, and body containing the Problem/Approach/Outcome H2 headings.
- Call `allProjects` from RSC pages (Phase 3+) without worrying about the content directory existing — the `existsSync` guard handles the Wave 2 → Wave 3 window.

**Ready for Plan 02-04** (Wave 3 — redaction scanner). The scanner should:

- Reuse the `_loadForTests(CONTENT_DIR)` seam OR walk `content/projects/*.mdx` directly with `fs` + `gray-matter`. The former keeps the redaction test coupled to the same load path real consumers hit; the latter isolates the scanner from any schema changes.
- Scan the `body` field (second output of `matter()`) — never `data` — per RESEARCH.md Pitfall 4.
- The Vitest + server-only pattern established here (`tests/stubs/server-only.ts` + alias) is already wired, so 02-04's test can `import` the loader without extra setup.

**Recommendation for Plan 02-03's executor:** Before authoring Myco's body, verify the hero image path decision. The schema only checks `hero.src` is a non-empty string; `/images/projects/myco/hero-placeholder.png` is acceptable per CONTEXT.md. Add an explicit "placeholder — real image lands in Phase 7" note to `hero.alt` so nothing is accidentally fabricated.

**Blockers for rest of Phase 2:** None.

## Self-Check: PASSED

Verified:

- `lib/content.ts` exists on disk ✓
- `lib/projects.ts` exists on disk ✓
- `tests/content/content-load.test.ts` exists on disk ✓
- `tests/content/tag-index.test.ts` exists on disk ✓
- `tests/stubs/server-only.ts` exists on disk ✓
- `vitest.config.ts` contains the `server-only` alias line ✓ (verified via Grep during implementation)
- Task 1 commit `2183fb9` present in `git log --oneline` ✓
- Task 2 commit `10097db` present in `git log --oneline` ✓
- `pnpm test:ci` → 116/116 tests green ✓
- `pnpm typecheck` → clean ✓
- `pnpm build` → succeeds ✓
- `pnpm lint` on files touched by this plan → clean (0 warnings, 0 errors) ✓

---
*Phase: 02-content-pipeline*
*Completed: 2026-04-21*
