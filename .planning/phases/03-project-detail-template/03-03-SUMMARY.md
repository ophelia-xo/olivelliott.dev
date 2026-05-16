---
phase: 03-project-detail-template
plan: 03
subsystem: page-route
tags: [rsc, app-router, generate-static-params, generate-metadata, next-project, motion-island, tdd, vitest, mdx-shim, prj-01, prj-03, prj-05, prj-07]

# Dependency graph
requires:
  - phase: 03-project-detail-template
    provides: "Wave 0 — isPlaceholderHero(src), /og-default.png, MDX rehype chain (slug→autolink→pretty-code), .prose CSS"
  - phase: 03-project-detail-template
    provides: "Wave 1 — <MDXProse>, mdx-components.tsx with Figure/Gallery/Callout registered via useMDXComponents"
  - phase: 03-project-detail-template
    provides: "Wave 2 lane A — <ProjectHero> (variant branching), <ProjectMeta> (privacy gating), <TagChipRow>"
  - phase: 02-content-pipeline
    provides: "lib/projects.ts (getAll, getProject, getRelatedProjects), Myco MDX fixture (content/projects/myco.mdx — 902 words, Problem/Approach/Outcome H2 anchors)"
  - phase: 01-foundation
    provides: "app/(site)/layout.tsx shell (MotionProvider → SkipLink → Nav → main → Footer), app/not-found.tsx, MotionProvider with LazyMotion strict + reducedMotion='user', metadataBase + titleTemplate in app/layout.tsx"
provides:
  - "lib/next-project.ts — getNextProject(slug) algorithm with top-overlap, cyclic-by-order, single-project-null, unknown-slug-null branches"
  - "components/projects/next-project-title.tsx — tiny 'use client' island wrapping motion/react <m.h2> for whileHover translateX(4px)"
  - "components/projects/next-project-block.tsx — RSC composing eyebrow + NextProjectTitle + tagline; multi-project + single-project (Browse all projects) variants"
  - "app/(site)/projects/[slug]/page.tsx — static RSC page with dynamicParams=false, generateStaticParams (enumerates getAll), generateMetadata (per-route title/description/canonical + OG fallback chain), dynamic .mdx import via @/content/projects/${slug}.mdx, composition of ProjectHero + MDXProse + NextProjectBlock"
  - "Vitest mdxShimPlugin in vitest.config.ts — transform-hook plugin that returns a no-op default for any .mdx import, unblocking the page module under jsdom (Pitfall 12 resolution)"
  - "5 new test files: next-project (5 cases), next-project-block (6 cases), static-params (3 cases), page render (3 cases), page-metadata (7 cases) = 24 new cases"
affects: [04-home-and-index, 06-seo-and-sitemap, 07-private-projects]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Tiny client-island pattern for motion: separate file with 'use client' + m.* import; consumed by RSC parent. Keeps the rest of the page RSC and minimizes the client bundle. Phase 1's LazyMotion strict requires m.* (NOT motion.*); the island composes via children prop so the RSC parent passes static text."
    - "RSC page route layout for App Router: dynamicParams=false + generateStaticParams returns Array<{slug}>; generateMetadata is async with params: Promise<{slug:string}> (Pitfall 6); page body is async, awaits params, calls notFound() BEFORE await import (Pitfall 9), uses literal directory prefix '@/content/projects/' (Pitfall 11) and mandatory .mdx extension (Pitfall 5)."
    - "Vitest mdx shim via Vite transform hook (NOT alias regex). The dynamic-import expansion in app/(site)/projects/[slug]/page.tsx scans the content/projects/ directory for matching .mdx files at module-load time. Without intercepting the transform step, Vite hangs the entire transform pipeline (silent timeout, no error). Plugin returns 'export default function MDXShim() { return null; }' for any id ending in .mdx; per-test vi.doMock can override the default for targeted assertions. The transform-hook approach avoids the alias-regex form which mangles the dynamic-import template-literal text."
    - "Vite dynamic-import-helper resolves only physically-existing slugs. Tests for non-existent fixtures (e.g. valid-private — only in tests/fixtures/) must route through a real slug (myco) and mock getProject to return the fixture-shaped project. The MDX body is irrelevant — the test asserts the composition contract."
    - "Schema-narrowed union access: links.repo is stripped for private projects, so the inferred union has a no-repo branch. Use `'repo' in project.links ? (project.links.repo as string|undefined) : undefined` to read it safely without widening the schema or losing the privacy guarantee. The cast is explicit because TS narrows `in`-checks to `unknown` across heterogeneous unions."

key-files:
  created:
    - "lib/next-project.ts"
    - "components/projects/next-project-title.tsx"
    - "components/projects/next-project-block.tsx"
    - "app/(site)/projects/[slug]/page.tsx"
    - "tests/projects/next-project.test.ts"
    - "tests/projects/next-project-block.test.tsx"
    - "tests/projects/static-params.test.ts"
    - "tests/projects/page.test.tsx"
    - "tests/projects/page-metadata.test.ts"
    - ".planning/phases/03-project-detail-template/deferred-items.md"
  modified:
    - "vitest.config.ts"

key-decisions:
  - "Vitest .mdx interception via transform hook (NOT alias regex). Plan documented Pitfall 12's recipe as 'alias to a stub in vitest.config.ts'. The alias-regex form (`{ find: /\\.mdx$/, replacement: ... }`) MANGLED the dynamic-import template literal — Vite rewrote `@/content/projects/${slug}.mdx` to `@/content/projects/${slug}/...absolute-path...mdx-module.ts` which then duplicated modules. The transform-hook (return stub source for any .mdx id) is the equivalent that actually works under Vite's dynamic-import expansion."
  - "Tests mock motion/react via Proxy (NOT MotionConfig wrapper). Plan said 'try without provider first; wrap in MotionConfig if it errors'. In jsdom, LazyMotion strict HANGS instead of erroring when m.* is rendered without provider. A vi.mock proxy that strips motion-only props (whileHover, transition, etc.) and forwards children to the underlying tag is cleaner than mounting a tiny provider in every test — and it's the same pattern reused across tests/projects/next-project-block.test.tsx + tests/projects/page.test.tsx."
  - "PRJ-06 integration test routes through slug='myco' (the only physical .mdx in /content/projects/), NOT slug='valid-private'. Vite's dynamic-import-helper validates the slug against on-disk files at runtime — using a fixture-only slug fails with 'Unknown variable dynamic import'. The test mocks getProject to return a private-fixture-shaped project; the MDX body is stubbed via the mdxShimPlugin. What's asserted is the privacy contract (zero anchors with the repo URL, 'code private' label, 'code-private' tag chip) — the content of the MDX body is irrelevant for that assertion."
  - "Schema union narrowing for links.repo: page reads `'repo' in project.links ? (project.links.repo as string|undefined) : undefined`. The schema's transform returns one of two link shapes (with or without repo). TS infers a union; `'repo' in` narrows but widens the value to unknown across heterogeneous unions, so an explicit cast back to string|undefined is required. Privacy guarantee preserved — when visibility==='private', the schema strips the repo and the page passes undefined to ProjectHero."
  - "Recovery from Vite cache deletion incident: a `rm -rf .vite + .cache` early in this plan damaged the pnpm store (Vitest startup error 'export named c'). Full pnpm install restored. Future debugging of Vitest hangs should NOT clear node_modules subtrees — clear only the project's `.vitest-cache` if needed. Cleared by full reinstall."

patterns-established:
  - "TDD RED→GREEN split per task with separate commits (6 commits total for this plan): test(03-03): add failing N-case spec → feat(03-03): implement … with verification log. Both visible in git log for the verifier. Same pattern as Plans 03-01 + 03-02."
  - "Page test pattern for RSC routes with dynamic .mdx import: vi.resetModules + vi.doMock for @/lib/projects + @/lib/next-project + (per-test) the specific .mdx path; await import the page module; await Page({ params: Promise.resolve({ slug }) }) for render assertions or call mod.generateMetadata({ params }) directly for metadata assertions."
  - "PRJ-06 privacy contract has THREE independent visible signals: (1) zero anchors with the repo URL on the page (defended at the ProjectMeta level via visibility-gated branch + at the page level via integration test), (2) literal 'code private' label in the meta row (--color-text-tertiary span), (3) 'code-private' tag chip in TagChipRow. All three asserted in this plan's page render test (page.test.tsx case 3)."

requirements-completed: [PRJ-01, PRJ-03, PRJ-05, PRJ-07]

# Metrics
duration: 68 min
completed: 2026-05-16
---

# Phase 3 Plan 03: Page Route + NextProjectBlock + getNextProject Summary

**Static RSC page at `/projects/[slug]` shipped with `dynamicParams=false`, per-route `generateMetadata` (OG fallback chain landing on `/og-default.png` for Myco's placeholder hero), dynamic MDX import composing the unmodified Myco body, and a `<NextProjectBlock>` wayfinding block with cyclic fallback + single-project Browse-all-projects variant. PRJ-01 + PRJ-03 + PRJ-05 + PRJ-07 satisfied.**

## Performance

- **Duration:** ~68 min (significant time spent diagnosing a Vitest .mdx transform hang and a Vite cache-deletion incident — see Issues Encountered)
- **Started:** 2026-05-16T00:48:34Z
- **Completed:** 2026-05-16T01:56:26Z
- **Tasks:** 3
- **Files created:** 10 (4 source + 5 test + 1 deferred-items)
- **Files modified:** 1 (vitest.config.ts)

## Accomplishments

- `lib/next-project.ts` shipped with the 4-branch algorithm (top-overlap, cyclic-by-order, single-project null, unknown-slug null). 5/5 tests green.
- `<NextProjectTitle>` (tiny `'use client'` island) + `<NextProjectBlock>` (RSC) shipped per UI-SPEC § Component Inventory #9 — multi-project variant (`<nav aria-label="Next project">` linking to `/projects/{slug}`) and single-project wayfinding variant (`<nav aria-label="Browse all projects">` linking to `/projects` with locked tagline string). 6/6 tests green.
- `app/(site)/projects/[slug]/page.tsx` shipped as the integration point: `dynamicParams=false`, `generateStaticParams` enumerates `getAll().map(p=>({slug:p.slug}))`, `generateMetadata` returns title + description (`description ?? tagline`) + canonical (`/projects/${slug}`) + OG image precedence (`ogImage → hero.src when not placeholder → /og-default.png`) + Twitter card `summary_large_image` reusing the OG. Page body calls `notFound()` BEFORE the dynamic `await import()` (Pitfall 9), uses literal directory prefix + `.mdx` extension (Pitfalls 11 + 5), and composes `<article>` > `<ProjectHero>` + `<MDXProse>{<MDXBody />}</MDXProse>` + `<NextProjectBlock>`. 13/13 tests green.
- All 207 tests across 26 files green (24 new + 183 pre-existing). No regression in any prior phase.
- `pnpm typecheck` clean.
- `pnpm build` exit 0; static `/projects/myco` emitted to `.next/server/app/projects/myco.html`. Static HTML contains the Problem / Approach / Outcome H2 anchor strings (Myco's MDX rendered unmodified — PRJ-03) and the "all projects → / Browse all projects" wayfinding strings (single-project corpus variant — PRJ-05).
- `vitest.config.ts` extended with the `mdxShimPlugin` — transform-hook Vite plugin that returns a no-op default export for any `.mdx` id. Resolves Pitfall 12 (Vitest cannot process `.mdx` natively) for the page-route module's dynamic-import expansion. Per-test `vi.doMock` can still override the default for specific paths.

## Task Commits

Each task was committed atomically with TDD RED → GREEN split (6 task commits total):

1. **Task 03-03-01 RED: failing 5-case spec for getNextProject** — `859a06f` (test)
2. **Task 03-03-01 GREEN: implement getNextProject — top-overlap + cyclic + null branches** — `996cb62` (feat)
3. **Task 03-03-02 RED: failing 6-case RTL spec for <NextProjectBlock>** — `7efd81c` (test)
4. **Task 03-03-02 GREEN: implement <NextProjectBlock> + <NextProjectTitle> client island** — `ecba4d8` (feat)
5. **Task 03-03-03 RED: failing 13-case spec for project detail page route** — `63d6cb1` (test)
6. **Task 03-03-03 GREEN: ship project detail page route + Vitest mdx shim plugin** — `d4d181c` (feat)

**Plan metadata:** _pending — committed in final docs commit_

## Files Created/Modified

| Path | Status | What it does |
|------|--------|--------------|
| `lib/next-project.ts` | created | `getNextProject(slug)` returning `{slug,title,tagline}|null`. Reads `getRelatedProjects(slug, 1)` for top tag-overlap, falls back to cyclic by `order` ascending, returns null for single-project corpus or unknown slug. Returned object exposes only the 3 documented keys; no other Project fields leak. |
| `components/projects/next-project-title.tsx` | created | Tiny `'use client'` island wrapping `motion/react` `<m.h2>` with `whileHover={{ x: 4 }}` + UI-SPEC duration/ease. Uses `m.*` (NOT `motion.*`) per Phase 1 LazyMotion strict. |
| `components/projects/next-project-block.tsx` | created | RSC. Composes `<nav>` + `<a>` + eyebrow `<span>` + `<NextProjectTitle>` + tagline `<p>`. Multi-project variant: `<nav aria-label="Next project">` linking `/projects/{slug}` with eyebrow `next →`. Single-project variant: `<nav aria-label="Browse all projects">` linking `/projects` with eyebrow `all projects →` and locked tagline. Hairline divider above (`border-t border-[color:var(--color-hairline)]` + `mt-16 md:mt-24` + `pt-12`). `focus-visible:outline-offset-4` on the link (4px override for the large title). |
| `app/(site)/projects/[slug]/page.tsx` | created | RSC page route. `dynamicParams = false`; `generateStaticParams` enumerates `getAll()` slugs; `generateMetadata` returns the 5-element Metadata shape (title, description, openGraph, twitter, alternates.canonical) with the OG fallback chain; default export is the async page component composing `<ProjectHero> + <MDXProse>{<MDXBody />}</MDXProse> + <NextProjectBlock>`. `notFound()` called BEFORE the dynamic `await import()` (Pitfall 9). Repo URL read via `'repo' in project.links` narrowing to preserve the privacy guarantee. |
| `tests/projects/next-project.test.ts` | created | 5 cases: top-overlap returns related project; cyclic fallback wraps last→first; single-project null; unknown slug null; returned object has exactly `{slug,title,tagline}` keys (no Project field leak). |
| `tests/projects/next-project-block.test.tsx` | created | 6 RTL cases: multi-project nav + linked title + tagline; eyebrow + title + tagline all in same `<a>`; single-project Browse-all-projects + locked tagline; hairline + pt-12 (both variants); `focus-visible:outline-offset-4` on link; both variants render title text. Mocks `motion/react` via Proxy (LazyMotion strict hangs in jsdom without provider). |
| `tests/projects/static-params.test.ts` | created | 3 cases (PRJ-01): `generateStaticParams` returns an entry per `getAll()` slug; every entry has only a `slug` key; `dynamicParams === false`. |
| `tests/projects/page.test.tsx` | created | 3 RTL cases (PRJ-01 + PRJ-06): valid slug renders `<article>` + ProjectHero meta row + NextProjectBlock single-project nav (Myco-only corpus); unknown slug calls `notFound()` (spy throws); private fixture renders `code private` + zero anchors with the would-be repo URL + `code-private` tag chip. |
| `tests/projects/page-metadata.test.ts` | created | 7 cases (PRJ-07): title + description from frontmatter; canonical `/projects/${slug}`; OG precedence #1 (ogImage), #2 (hero.src non-placeholder), #3 (`/og-default.png` for Myco's placeholder); Twitter card `summary_large_image` reusing OG; unknown slug returns `{}`. |
| `vitest.config.ts` | modified | Added `mdxShimPlugin` (transform-hook Vite plugin) to the `plugins` array. Returns `export default function MDXShim() { return null; }` for any id ending in `.mdx`. Unblocks the page-route module's dynamic-import expansion under jsdom; per-test `vi.doMock` can still override the default for specific paths. |
| `.planning/phases/03-project-detail-template/deferred-items.md` | created | Logs 2 out-of-scope discoveries: DEFER-01 (Tailwind v4 picks up `--color-...` placeholder from `.planning/` docs — emits 2 benign CSS warnings during build), DEFER-02 (stale `scripts/generate-og-default.ts` from Plan 03-00 was supposed to be deleted post-run but persisted on disk). Both log resolution paths for a future cleanup plan. |

## Decisions Made

1. **Vitest `.mdx` interception via transform hook (not alias regex).** Plan documented Pitfall 12's recipe as "alias to a stub in vitest.config.ts". The alias-regex form mangled the dynamic-import template literal — Vite rewrote `@/content/projects/${slug}.mdx` to a literal-substituted absolute path containing the `${slug}` template syntax verbatim, then warned about duplicate modules. The transform-hook (`transform(_code, id) { if (id.endsWith('.mdx')) return { code: 'export default function MDXShim() { return null; }', map: null } }`) is the equivalent that actually works under Vite's dynamic-import expansion. Single edit point in `vitest.config.ts`; per-test `vi.doMock` overrides remain in effect for targeted MDX assertions.

2. **Tests mock `motion/react` via Proxy (not MotionConfig wrapper).** Plan said "try without provider first; wrap in MotionConfig if it errors". In jsdom, `LazyMotion strict` HANGS (no resolve, no error) instead of erroring when `m.*` is rendered outside the provider. A `vi.mock('motion/react', () => ({ m: new Proxy(...) }))` that strips motion-only props (whileHover, whileFocus, transition, etc.) and forwards children to the underlying HTML tag is cleaner than mounting a tiny provider in every test, and it's the same pattern reused across `tests/projects/next-project-block.test.tsx` + `tests/projects/page.test.tsx`. The motion behavior itself is asserted via source-grep (the plan's `'use client'` + `m.*` import requirement) and the visual sanity pass on `/projects/myco`.

3. **PRJ-06 integration test routes through `slug='myco'`, not `slug='valid-private'`.** Vite's dynamic-import-helper validates the slug against on-disk files at runtime — using a fixture-only slug fails with "Unknown variable dynamic import" because `valid-private.mdx` only exists in `tests/fixtures/projects/`, not `content/projects/`. The test mocks `getProject` to return a `valid-private`-shaped project (visibility='private', tags include 'code-private', no repo URL) but the slug it routes through is `'myco'`. What's asserted is the privacy contract (zero anchors with the would-be repo URL, literal `code private` label, `code-private` tag chip rendered identically to other chips) — the MDX body content is irrelevant and stubbed via the `mdxShimPlugin`.

4. **Schema union narrowing for `links.repo`: explicit cast back to `string | undefined`.** The schema strips `links.repo` for private projects, so the inferred union has a no-repo branch. Reading `project.links.repo` directly fails typecheck because TS picks the no-repo branch when narrowing. The page reads `'repo' in project.links ? (project.links.repo as string | undefined) : undefined`. The cast is explicit because TS narrows `in`-checks to `unknown` across heterogeneous unions. Privacy guarantee preserved — when `visibility === 'private'`, the schema strips the repo and the page passes `undefined` to `ProjectHero`. The cast is safe per the schema's `repo: z.string().url().optional()`.

5. **Recovery from Vite cache deletion incident.** Early in plan execution, an `rm -rf .vite + .cache` (an attempt to clear cached Vite state to debug a hang) damaged the pnpm store, surfacing as a Vitest startup error: `SyntaxError: The requested module './index.B521nVV-.js' does not provide an export named 'c'`. A full `pnpm install` reset recovered without source-file impact. Future debugging of Vitest hangs should NOT clear node_modules subtrees; clear only project-local caches if needed. Logged in the GREEN commit message for the page route + the technical-decision section here.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 — Blocking issue] Tests for `<NextProjectBlock>` hang in jsdom under LazyMotion strict**

- **Found during:** Task 03-03-02 GREEN verification (running `pnpm vitest run tests/projects/next-project-block.test.tsx`)
- **Issue:** Phase 1's `MotionProvider` declares `<LazyMotion features={domAnimation} strict>`. In strict mode, `<m.h2>` requires the `LazyMotion` features to be loaded before render. Without the provider in the React tree, jsdom enters a hang state (no error, no resolve) instead of erroring out as the documentation suggests. Plan documented "try without provider first; wrap in MotionConfig if it errors" — the actual failure mode is silent hang, not error.
- **Fix:** Added a `vi.mock('motion/react', () => ({ m: new Proxy({}, { get: (_, tag) => stripMotionProps(tag) }) }))` block at the top of the test file. The Proxy strips motion-only props (whileHover, whileFocus, whileTap, whileInView, initial, animate, exit, transition, variants) and forwards `children` to the underlying HTML tag via `React.createElement`. Same pattern reused in `tests/projects/page.test.tsx` (page composition transitively loads the client island).
- **Files modified:** `tests/projects/next-project-block.test.tsx` + `tests/projects/page.test.tsx` (mock added at top of each file)
- **Commit:** `ecba4d8` (test mock landed in the GREEN commit alongside the component implementation)

**2. [Rule 3 — Blocking issue] Vitest cannot transform `.mdx` files via Vite's dynamic-import scan; page tests time out**

- **Found during:** Task 03-03-03 GREEN verification (running `pnpm vitest run tests/projects/static-params.test.ts`)
- **Issue:** The page route uses `await import(\`@/content/projects/${slug}.mdx\`)` (Pitfall 11 + Pitfall 12 — these are the documented patterns). Vite's dynamic-import expansion scans the `content/projects/` directory at module-load time, finds `myco.mdx`, and tries to transform it. Vitest has no MDX loader plugin, so the transform pipeline hangs silently. Plan documented Pitfall 12's recipe as "Mock `@/content/projects/*.mdx` in vitest.config.ts — alias to a stub". Two attempted alias forms: (a) regex alias `{ find: /\\.mdx$/, replacement: 'tests/stubs/mdx-module.ts' }` mangled the template-literal text; (b) string-find alias didn't match the dynamic expansion.
- **Fix:** Wrote a Vite `Plugin` (`mdxShimPlugin`) that intercepts the `transform` hook for any id ending in `.mdx` and returns `'export default function MDXShim() { return null; }'`. This bypasses any (missing) MDX loader and is what Vite actually exposes for plugin-level file interception. Added to `vitest.config.ts` `plugins` array. Per-test `vi.doMock` calls still override the default for targeted MDX-content assertions.
- **Files modified:** `vitest.config.ts` (mdxShimPlugin definition + `plugins: [mdxShimPlugin()]`)
- **Commit:** `d4d181c` (plugin landed in the GREEN commit alongside the page route)

**3. [Rule 3 — Blocking issue] PRJ-06 test fails with "Unknown variable dynamic import" for non-existent fixture slug**

- **Found during:** Task 03-03-03 GREEN verification (after mdxShimPlugin landed)
- **Issue:** The test originally routed through `slug='valid-private'` to exercise the private-project privacy contract through the page. Vite's dynamic-import-helper validates the slug against on-disk files; `valid-private.mdx` exists only in `tests/fixtures/projects/`, not in `content/projects/`. Result: `Error: Unknown variable dynamic import: ../../../../content/projects/valid-private.mdx`.
- **Fix:** Routed the test through `slug='myco'` (the only physical `.mdx` in `content/projects/`) and kept the `vi.doMock('@/lib/projects')` returning the private-fixture-shaped project. The MDX body is irrelevant for this test (the assertion is on `ProjectMeta` + `TagChipRow` privacy rendering); the `mdxShimPlugin` stubs it to a no-op. Commented the rationale inline.
- **Files modified:** `tests/projects/page.test.tsx` (one test case)
- **Commit:** `d4d181c` (alongside the page route + plugin)

**4. [Rule 1 — Bug] TypeScript fails on `project!.links.repo` because schema's union has a no-repo branch**

- **Found during:** Task 03-03-03 GREEN verification (`pnpm typecheck` after the page route landed)
- **Issue:** The schema's `.transform()` returns one of two link shapes (with or without `repo`) based on `visibility === 'private'`. The inferred TS union has a branch where `links` lacks `repo`. Reading `project!.links.repo` fails with `Property 'repo' does not exist on type '{ live?, docs?, npm? }'`.
- **Fix:** Read via `'repo' in project!.links ? (project!.links.repo as string | undefined) : undefined`. The `in` check narrows safely; the explicit cast is required because TS narrows `in`-checks to `unknown` across heterogeneous unions. Privacy guarantee preserved — when `visibility === 'private'`, the schema strips the repo and the page passes `undefined` to `ProjectHero`.
- **Files modified:** `app/(site)/projects/[slug]/page.tsx` (added the `repoUrl` const before the JSX return)
- **Commit:** `d4d181c`

### Out-of-Scope Discoveries (logged to deferred-items.md)

- **DEFER-01:** Tailwind v4 picks up `--color-...` placeholder text from `.planning/STATE.md` and Plan 03-01 SUMMARY (where the arbitrary-form pattern is documented as `bg-[color:var(--color-...)]`). Build emits 2 benign CSS warnings; resolution path is to add `@source not "../.planning/**"` to `app/globals.css`. Not fixed in this plan (outside scope; warnings don't affect the build, tests, or runtime).
- **DEFER-02:** `scripts/generate-og-default.ts` (from Plan 03-00) persists on disk — Plan 03-00 SUMMARY documented it as deleted post-run. Not fixed in this plan (outside scope; a future docs/cleanup plan can either delete or `.gitignore` it).

## Issues Encountered

### Vitest startup error after node_modules cache deletion

During Task 03-03-03 debugging, an `rm -rf node_modules/.vite + node_modules/.cache` (an attempt to clear cached Vite state) damaged the pnpm store. The next `pnpm vitest run` produced:

```
SyntaxError: The requested module './index.B521nVV-.js' does not provide an export named 'c'
```

A full `pnpm install` (after `rm -rf node_modules`) restored a clean state. No source-file impact. Lesson: when debugging Vitest hangs, clear only project-local caches (e.g. `.vitest-cache` if present), never delete subtrees of `node_modules`.

### `providers.test.tsx` flaky timeout under parallel run

A pre-existing test (`it('is a client component')` — pure `readFileSync` source assertion) timed out at 5s when running the full suite in parallel. Re-ran in isolation: 6/6 passed in 464ms. Re-ran the full suite: 207/207 green. Flake under worker-pool exhaustion, not a regression. No fix applied — this is a pre-existing condition outside the scope of plan 03-03.

## User Setup Required

None — no external service configuration required for Wave 2 lane B.

## Next Phase Readiness

**Phase 3 is complete.** All 4 plans (03-00 Wave 0 + 03-01 Wave 1 + 03-02 Wave 2 lane A + 03-03 Wave 2 lane B) shipped. Hero project Myco renders end-to-end at `/projects/myco`:

- Hero: text-only Variant B (Myco's hero is the placeholder pattern); single-column with `<h1>` at display ramp + tagline + meta row.
- MDX body: Problem → Approach → Outcome H2 anchors all rendered with `id` + appended `#` glyph (Wave 0 rehype chain). The MDX is rendered unmodified — PRJ-03.
- NextProjectBlock: single-project variant linking to `/projects` (`Browse all projects` title + locked tagline) — the destination 404s in Phase 3 because `/projects` index lands in Phase 4 (acceptable per UI-SPEC).
- Per-route metadata: title `Myco · olivelliott.dev` (root titleTemplate wraps), description from frontmatter, OG image `/og-default.png` (placeholder hero triggers fallback), Twitter card `summary_large_image`, canonical `https://olivelliott.dev/projects/myco`.
- Privacy contract enforced through the page (PRJ-06 integration test asserts zero repo-URL anchors when private).

Phase 4 (home + `/projects` index) is unblocked:
- `<ProjectHero>`, `<NextProjectBlock>`, `<MDXProse>`, `getNextProject` all consumable from their existing imports.
- The hero grid on `/` can read `getHeroProjects()` and link to `/projects/${slug}` (live).
- `/projects` index can read `getAll()` + `getAllTags()` + `getProjectsByTag()` (all from Phase 2 — already shipped).
- Tag chips on `<TagChipRow>` already point at `/projects?tag={tag}` — Phase 4 just needs to implement the destination.

Phase 6 (sitemap + SEO) is unblocked — sitemap can enumerate `/projects/${slug}` URLs via `getAll()`, same pattern as `generateStaticParams`. The OG fallback chain is in place; Phase 6 can replace `/og-default.png` with dynamic `next/og` (DYN-01) without touching the page route.

Phase 7 (private projects: Trade Bot, Agenda Keeper, Aktiga) is unblocked — adding their `.mdx` files to `content/projects/` will automatically:
1. Enumerate them in `generateStaticParams` (no code change to the page).
2. Render the placeholder-hero text-only variant (Variant B) until real artwork ships.
3. Surface the `code private` label and `code-private` tag chip via `ProjectMeta` + `TagChipRow` (privacy rendering contract).
4. Be picked up by `getRelatedProjects` for the multi-project `<NextProjectBlock>` variant on Myco's page.

207/207 tests green, `pnpm typecheck` clean, `pnpm build` exit 0, static `/projects/myco.html` emitted. No blockers for Phase 4.

## Self-Check: PASSED

Verified after writing this summary:

- [x] `lib/next-project.ts` exists
- [x] `components/projects/next-project-title.tsx` exists
- [x] `components/projects/next-project-block.tsx` exists
- [x] `app/(site)/projects/[slug]/page.tsx` exists
- [x] `tests/projects/next-project.test.ts` exists
- [x] `tests/projects/next-project-block.test.tsx` exists
- [x] `tests/projects/static-params.test.ts` exists
- [x] `tests/projects/page.test.tsx` exists
- [x] `tests/projects/page-metadata.test.ts` exists
- [x] `vitest.config.ts` updated (mdxShimPlugin in plugins array)
- [x] `.planning/phases/03-project-detail-template/deferred-items.md` exists
- [x] Commit `859a06f` present (Task 03-03-01 RED)
- [x] Commit `996cb62` present (Task 03-03-01 GREEN)
- [x] Commit `7efd81c` present (Task 03-03-02 RED)
- [x] Commit `ecba4d8` present (Task 03-03-02 GREEN)
- [x] Commit `63d6cb1` present (Task 03-03-03 RED)
- [x] Commit `d4d181c` present (Task 03-03-03 GREEN)
- [x] `pnpm vitest run` → 207/207 green (24 new + 183 pre-existing, no regression)
- [x] `pnpm typecheck` → exit 0
- [x] `pnpm build` → exit 0; `.next/server/app/projects/myco.html` exists; HTML contains Problem/Approach/Outcome + 'all projects'/'Browse all projects' strings

---
*Phase: 03-project-detail-template*
*Completed: 2026-05-16*
