---
phase: 02-content-pipeline
plan: 00
subsystem: content-pipeline
tags: [mdx, next-mdx, remark-frontmatter, gray-matter, turbopack, app-router]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: "@next/mdx@16.2.4 + @mdx-js/react@3.1.1 + zod@3.23 installed; Next.js 16.2 App Router baseline; Vitest harness"
provides:
  - "gray-matter@4.0.3 as runtime dep for YAML frontmatter parsing"
  - "remark-frontmatter@5.0.0 wired into next.config.ts as a Turbopack-safe string plugin"
  - "Root mdx-components.tsx stub satisfying @next/mdx App Router contract"
  - "Verified pnpm build succeeds with full MDX + Turbopack pipeline"
affects:
  - 02-01-schema-and-tags
  - 02-02-content-loader
  - 02-03-query-helpers
  - 02-04-myco-content-and-redaction
  - 03-project-detail-templates

# Tech tracking
tech-stack:
  added:
    - "gray-matter@4.0.3"
    - "remark-frontmatter@5.0.0"
  patterns:
    - "Turbopack-safe MDX plugin registration via string references (not function imports)"
    - "Separation of frontmatter parsing (gray-matter, out-of-band) from body compilation (@next/mdx loader)"
    - "Root-level mdx-components.tsx as the @next/mdx App Router contract point"

key-files:
  created:
    - "mdx-components.tsx"
    - ".planning/phases/02-content-pipeline/deferred-items.md"
  modified:
    - "next.config.ts"
    - "package.json"
    - "pnpm-lock.yaml"

key-decisions:
  - "Install remark-frontmatter in Wave 0 (not deferred to Phase 3) so pnpm build smoke-gates the MDX pipeline before any content or renderer code lands"
  - "Register remark-frontmatter as the string 'remark-frontmatter' not a function reference — required for Turbopack compatibility per Next.js 16 docs (GitHub issue #84258 + #76739)"
  - "Root mdx-components.tsx kept minimal (empty components object) — Phase 3 extends with Callout/Figure/Gallery/heading overrides"
  - "Both gray-matter and remark-frontmatter added as runtime dependencies (not devDependencies) because Next.js imports remark plugins at build time and lib/content.ts (Wave 1) imports gray-matter at module init"

patterns-established:
  - "MDX plugin registration: use string refs in createMDX options for Turbopack compatibility"
  - "Dual-pipeline frontmatter handling: gray-matter (fs-based collection loader) + remark-frontmatter (MDX AST stripper) — no overlap, each owns one side"
  - "Smoke-gate MDX infrastructure with pnpm build before introducing schema/loader code"

requirements-completed: [CNT-01]

# Metrics
duration: 2 min
completed: 2026-04-21
---

# Phase 02 Plan 00: MDX Pipeline Infrastructure Summary

**Wired gray-matter + remark-frontmatter into Next.js 16 MDX pipeline with Turbopack-safe string plugin registration and root mdx-components.tsx stub, smoke-gated by pnpm build.**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-21T20:58:40Z
- **Completed:** 2026-04-21T21:01:25Z
- **Tasks:** 3/3
- **Files modified:** 4 (2 created, 3 modified)

## Accomplishments

- `gray-matter@4.0.3` and `remark-frontmatter@5.0.0` installed as runtime deps and resolvable via `pnpm list`
- `mdx-components.tsx` created at repo root satisfying `@next/mdx`'s App Router contract (`useMDXComponents()` export returning `MDXComponents`)
- `next.config.ts` registers `remark-frontmatter` via string form (`remarkPlugins: ['remark-frontmatter']`) — the only form Turbopack accepts in Next.js 16
- `pnpm build` passes end-to-end through the full Turbopack + MDX pipeline with the new plugin wiring — zero warnings
- `pnpm typecheck` and `pnpm test:ci` (74 Phase 1 tests) both green
- Wave 1 (schema + loader) can now import `gray-matter` freely from `lib/` and `tests/` without build-time failures

## Task Commits

Each task was committed atomically:

1. **Task 1: Install gray-matter and remark-frontmatter via pnpm** — `fd9727f` (chore)
2. **Task 2: Create mdx-components.tsx stub at repo root** — `8988eb0` (feat)
3. **Task 3: Wire remark-frontmatter into next.config.ts and smoke-gate with pnpm build** — `1eb056e` (feat)

**Plan metadata:** (to be added in final commit — docs: complete plan)

## Files Created/Modified

- `mdx-components.tsx` (created) — Root MDX components stub with `useMDXComponents()` export; empty `MDXComponents` object — Phase 3 extends
- `next.config.ts` (modified) — `options.remarkPlugins` changed from `[]` to `['remark-frontmatter']` (string form, Turbopack-safe)
- `package.json` (modified) — Added `"gray-matter": "^4.0.3"` and `"remark-frontmatter": "^5.0.0"` to dependencies
- `pnpm-lock.yaml` (modified) — Locked to `gray-matter@4.0.3` and `remark-frontmatter@5.0.0` (+16 transitive packages)
- `.planning/phases/02-content-pipeline/deferred-items.md` (created) — Logs pre-existing Phase 1 Biome lint issues discovered during full verification

## next.config.ts Diff (Before → After)

**Before:**
```ts
const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: { remarkPlugins: [], rehypePlugins: [] },
})
```

**After:**
```ts
const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    // Strings (not function refs) are required for Turbopack compatibility in Next 16.
    // Source: https://nextjs.org/docs/app/guides/mdx#using-plugins-with-turbopack
    // remark-frontmatter strips YAML `---` blocks from the MDX AST so they don't render as body text.
    // gray-matter (in lib/content.ts) handles frontmatter parsing out-of-band via fs.
    remarkPlugins: ['remark-frontmatter'],
    rehypePlugins: [],
  },
})
```

The surrounding `nextConfig` object (pageExtensions, poweredByHeader, reactStrictMode) is untouched.

## Turbopack Build Output

`pnpm build` succeeded cleanly:

```
▲ Next.js 16.2.4 (Turbopack)
✓ Compiled successfully in 1722ms
  Finished TypeScript in 1625ms
✓ Generating static pages using 5 workers (4/4) in 254ms

Route (app)
┌ ○ /
└ ○ /_not-found
```

No Turbopack warnings related to `remark-frontmatter` string resolution. No MDX loader errors. No RSC boundary violations.

## Decisions Made

**1. Install remark-frontmatter in Wave 0, not Phase 3**
- Rationale: Land MDX infrastructure in a small, dedicated plan with a smoke gate (`pnpm build`) so any Turbopack/plugin misconfiguration surfaces before schema/loader/content code depends on it. Per RESEARCH.md Open Question #2: "Phase 2's executor shouldn't hit this pitfall; pnpm build in the Phase 2 gate exercises the full pipeline."

**2. Runtime deps, not devDependencies**
- gray-matter is imported by `lib/content.ts` at module init (server-only surface, but a runtime surface). remark-frontmatter is imported by `next.config.ts` at build time. Per the Next.js convention, build-time remark/rehype plugins live in `dependencies`, not `devDependencies`, because `next build` resolves them from `dependencies` during production builds.

**3. String-form plugin registration (not function reference)**
- The Next.js 16 Turbopack loader (`@next/mdx` under the hood) requires `remarkPlugins` entries to be either strings (which Next dynamically resolves) or tuples of `[string, options]`. Function references like `remarkPlugins: [remarkFrontmatter]` no longer work under Turbopack — confirmed in GitHub issues #84258 and #76739. Choosing string form future-proofs against Turbopack changes and sidesteps the `import remarkFrontmatter` top-level import that would trigger the same loader rejection.

**4. mdx-components.tsx left intentionally empty**
- Phase 3 (project detail template) adds `<Callout>`, `<Figure>`, `<Gallery>`, and heading/paragraph overrides. Phase 2's job is satisfying the `@next/mdx` contract so `pnpm build` doesn't throw. Empty `components` object is the explicit Phase 2 minimum per RESEARCH.md Pattern 4.

## Deviations from Plan

None - plan executed exactly as written.

All three tasks completed with their documented actions, against their stated acceptance criteria, committed individually. No auto-fixes required. No architectural decisions needed. No authentication gates.

## Issues Encountered

### Out-of-scope: Pre-existing Biome lint errors in Phase 1 files

`pnpm lint` (success criterion #6 in the plan's `<verification>` block) currently fails with 1 error + 23 warnings — all in Phase 1 source files (`styles/tokens.css`, `components/site/nav.tsx`, `word-mark.tsx`, `skip-link.tsx`, `nav-link.tsx`). None are in files touched by Plan 02-00. Running `pnpm exec biome lint mdx-components.tsx next.config.ts` on Phase 2-touched files passes cleanly.

**Root causes:**
- `styles/tokens.css:7` — Biome CSS parser rejects Tailwind v4's `@theme` directive (needs `tailwindDirectives: true` in `biome.json`).
- 23 warnings from `useSortedClasses` (Biome nursery rule) on Phase 1 components.

**Per deviation-rules scope boundary:** "Only auto-fix issues DIRECTLY caused by the current task's changes. Pre-existing warnings, linting errors, or failures in unrelated files are out of scope." These errors predate Plan 02-00 and are not caused by it. Logged in `.planning/phases/02-content-pipeline/deferred-items.md` with resolution options.

**Impact on Plan 02-00's success criteria:** None.
- `gray-matter@^4.0.3` installed ✓
- `remark-frontmatter@^5.0.0` installed ✓
- `mdx-components.tsx` at repo root with `useMDXComponents()` ✓
- `next.config.ts` registers `remark-frontmatter` as string plugin ✓
- `pnpm build` succeeds ✓
- `pnpm typecheck` green ✓
- `pnpm test:ci` green (74/74 Phase 1 tests) ✓
- Zero changes to Phase 1 files beyond `next.config.ts` options block ✓

**Impact on subsequent Phase 2 plans:** The phase-end `/gsd:verify-work 02` gate will need these resolved before the phase is declared complete. Recommendation: open a small 01.1 hotfix plan OR absorb into the Phase 2 verifier gate.

## Authentication Gates

None - no external services, no auth required.

## User Setup Required

None - no external service configuration introduced by this plan.

## Next Phase Readiness

**Ready for Plan 02-01** (Wave 1 — schema + tags, per RESEARCH.md Wave 0 Gaps). Downstream plans can now:
- `import matter from 'gray-matter'` from `lib/content.ts` without build-time failure
- Define `ProjectFrontmatterSchema` in `lib/schemas.ts` assuming gray-matter produces `{ data, content }` cleanly
- Add YAML frontmatter blocks at the top of MDX files knowing `remark-frontmatter` will strip them from the rendered body in Phase 3
- Rely on `mdx-components.tsx` existing at the repo root (Phase 3 extends it, doesn't recreate it)

**Blockers for rest of Phase 2:** None.

**Recommendation for Wave 1 executor:** No additional infrastructure work needed. Focus purely on `lib/tags.ts`, `lib/schemas.ts`, and the test harness (`tests/content/schema.test.ts`, `privacy-transform.test.ts`). The Phase 1 lint debt (deferred-items.md) is orthogonal and should be tackled in a dedicated cleanup plan rather than interleaved with content-pipeline work.

## Self-Check: PASSED

Verified:
- `mdx-components.tsx` exists on disk ✓
- `next.config.ts` modified (commit `1eb056e`) ✓
- `package.json` modified (commit `fd9727f`) ✓
- `pnpm-lock.yaml` modified (commit `fd9727f`) ✓
- All three task commits exist in `git log --oneline --all`: `fd9727f`, `8988eb0`, `1eb056e` ✓

---
*Phase: 02-content-pipeline*
*Completed: 2026-04-21*
