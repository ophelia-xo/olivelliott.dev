---
phase: 06-seo,-og,-a11y-&-performance-audit
plan: 02
subsystem: seo
tags: [og-images, sitemap, robots, metadata, pitfall-4-cleanup, mta-01, mta-02, mta-03]

# Dependency graph
requires:
  - phase: 06-seo,-og,-a11y-&-performance-audit
    plan: 00
    provides: "4 Wave-0 SEO test placeholders (tests/seo/{metadata,sitemap,robots,og-image}.test.ts) — replaced verbatim in Task 4."
provides:
  - "6 OG image surfaces (1 root default + 3 per-route siblings + 1 dynamic [slug] + 1 shared lib/og-template.tsx renderer). All Node.js runtime; Geist fonts loaded via readFile from node_modules/geist/dist/fonts/. UI-SPEC § Copywriting Contract LOCKED titles + meta rows verbatim per route."
  - "app/sitemap.ts: MetadataRoute.Sitemap enumerating /, /about, /projects, /resume + each /projects/${slug} from getAll(). Absolute URLs (Pitfall 9). Omits changeFrequency + priority (Google deprecated)."
  - "app/robots.ts: MetadataRoute.Robots — allow *, disallow /_next/ + /api/, sitemap pointer to ${SITE_URL}/sitemap.xml."
  - "Pitfall 4 cleanup: manual openGraph.images + twitter.images DELETED from all 5 page metadata blocks (home, about, projects, [slug], resume). Sibling opengraph-image.tsx files are now the single source of truth. Breadcrumb comments lock the decision against drift."
  - "4 SEO tests moved from skipped → passing: metadata.test.ts (7 assertions incl. 2 Pitfall-4 absence locks), sitemap.test.ts (5), robots.test.ts (3), og-image.test.ts (7 incl. Pitfall 1 + 2 locks)."
  - "4 obsolete Phase 3/4 OG-images assertions flipped to honor Pitfall 4 cleanup (tests/about, tests/home, tests/projects/index-page, tests/projects/page-metadata)."
affects: [06-03, 06-04, 06-05, 07]

# Tech tracking
tech-stack:
  added:
    - "next/og ImageResponse (already in Next 16 — first use in this codebase)"
  patterns:
    - "Shared OG renderer (lib/og-template.tsx): single source of truth for canvas geometry + palette + font loading; per-route OG files are 15-line delegations"
    - "Node.js runtime for OG (NOT Edge): readFile from process.cwd() + node_modules/geist/dist/fonts/ — Pitfall 2 lock asserted by source-grep test"
    - "Per-route default-OG siblings (NOT a single root file): UI-SPEC locks different copy per route, so each route gets its own opengraph-image.tsx delegating to renderOg()"
    - "generateImageMetadata for dynamic [slug] OG: enumerates per-project via getProject(); Next 16 Promise<params> + Promise<id> shapes"
    - "Pitfall 4 absence lock: hard-fail tests prove no route re-introduces manual openGraph.images / twitter.images; failure message includes rationale"
    - "Source-grep tests must strip line + block comments before regex (the codebase intentionally names forbidden patterns in comments — e.g., 'forbids display: grid'). New pattern; reusable for any future Pitfall-lock test"

key-files:
  created:
    - "lib/og-template.tsx"
    - "app/opengraph-image.tsx"
    - "app/opengraph-image.alt.txt"
    - "app/(site)/about/opengraph-image.tsx"
    - "app/(site)/projects/opengraph-image.tsx"
    - "app/resume/opengraph-image.tsx"
    - "app/(site)/projects/[slug]/opengraph-image.tsx"
    - "app/sitemap.ts"
    - "app/robots.ts"
  modified:
    - "app/(site)/page.tsx (Pitfall 4 cleanup)"
    - "app/(site)/about/page.tsx (Pitfall 4 cleanup)"
    - "app/(site)/projects/page.tsx (Pitfall 4 cleanup)"
    - "app/(site)/projects/[slug]/page.tsx (Pitfall 4 cleanup — also removed unused isPlaceholderHero import + ogImage var)"
    - "app/resume/page.tsx (Pitfall 4 cleanup)"
    - "tests/seo/metadata.test.ts (placeholder → 7 real assertions)"
    - "tests/seo/sitemap.test.ts (placeholder → 5 real assertions)"
    - "tests/seo/robots.test.ts (placeholder → 3 real assertions)"
    - "tests/seo/og-image.test.ts (placeholder → 7 real assertions)"
    - "tests/about/about-page.test.tsx (1 assertion flipped to honor Pitfall 4 absence)"
    - "tests/home/page.test.tsx (Test 6 flipped)"
    - "tests/projects/index-page.test.tsx (Test 12 flipped)"
    - "tests/projects/page-metadata.test.ts (4 OG-precedence tests → 3 Pitfall-4 contract tests)"

key-decisions:
  - "Per-route default-OG siblings, NOT a single root default: UI-SPEC § Copywriting Contract locks different title + meta per chromed route. 4 sibling files + 1 root + 1 dynamic [slug] + 1 shared renderer = 7 files, with the 5 page-level OG files reduced to 15-line delegations through lib/og-template.tsx."
  - "Node.js runtime, NEVER Edge: Geist fonts loaded via fs.readFile from process.cwd() + node_modules/geist/dist/fonts/. Edge runtime would force fetch() against bundled URLs and pay an unnecessary cold-start tax. Asserted by og-image.test.ts Test 5."
  - "Pitfall 4 cleanup INCLUDED in Plan 06-02 (not deferred): leaving 5 stale openGraph.images arrays after shipping 6 sibling OG files would confuse every future contributor reading any page metadata block. Two new metadata.test.ts Tests (5 + 6) hard-fail if anyone re-adds them."
  - "Test 6 (Pitfall 1) strips comments before regex grep: lib/og-template.tsx documents the Pitfall 1 ban using the exact forbidden literal 'display: grid'. Naive grep would trip on the documentation. Strip /\\* … \\*/ + // lines before regex. Same pattern applied to Test 5 (Pitfall 2) defensively."
  - "Obsolete Phase 3/4 OG-images assertions REWRITTEN, not deleted: 4 pre-existing tests asserted the Phase 3 OG precedence chain (project.ogImage → hero.src → /og-default.png embedded in generateMetadata). All 4 flipped to assert the NEW Pitfall-4 absence contract — preserves test coverage of the same surface, now codifying the correct behavior."

patterns-established:
  - "Shared OG renderer pattern: lib/og-template.tsx owns the canvas, fonts, palette, font-size auto-selection; per-route files declare only { title, meta }. Future per-route OG additions are 15-LOC delegations."
  - "Pitfall absence lock: tests that assert the ABSENCE of a deprecated property (e.g., openGraph.images undefined) with a failure message naming the rationale + the file pattern that should own it instead. Makes drift detection self-documenting."
  - "Comment-strip pre-pass for source-grep tests: when a file documents the forbidden pattern, strip line + block comments before regex matching. New, applies to any future test that locks against a literal also named in documentation."

requirements-completed: [MTA-01, MTA-02, MTA-03]

# Metrics
duration: 6 min
completed: 2026-05-17
---

# Phase 06 Plan 02: OG Images + Sitemap + Robots + Metadata Audit Summary

**6 OG image surfaces (1 default + 3 per-route siblings + 1 dynamic [slug] + 1 shared renderer), `app/sitemap.ts` + `app/robots.ts`, and a Pitfall 4 cleanup that DELETED manual `openGraph.images` from all 5 page metadata blocks — closed MTA-01 + MTA-02 + MTA-03; 4 Wave-0 placeholders replaced with 22 real assertions; 4 obsolete Phase 3/4 assertions flipped to honor the new contract.**

## Performance

- **Duration:** ~6 min
- **Started:** 2026-05-17T17:03:44Z
- **Completed:** 2026-05-17T17:10:29Z
- **Tasks:** 4
- **Files modified:** 23 (9 created, 14 modified)

## Accomplishments

- **6 OG image surfaces shipped:** `lib/og-template.tsx` (shared 1200×630 renderer; loads Geist Medium TTFs via Node.js `readFile`), `app/opengraph-image.tsx` (+ `.alt.txt`), `app/(site)/about/opengraph-image.tsx`, `app/(site)/projects/opengraph-image.tsx`, `app/resume/opengraph-image.tsx`, `app/(site)/projects/[slug]/opengraph-image.tsx` (with `generateImageMetadata` per-slug). All UI-SPEC § Copywriting Contract LOCKED titles + meta rows verbatim.
- **Pitfall 4 cleanup landed:** manual `openGraph.images` arrays + `twitter.images` arrays DELETED from all 5 page metadata blocks (home, about, projects index, [slug], resume). Breadcrumb comments name the sibling OG file as the source of truth. `app/(site)/projects/[slug]/page.tsx` also dropped the now-unused `isPlaceholderHero` import + `ogImage` const.
- **MTA-03 deliverables:** `app/sitemap.ts` enumerates `/`, `/about`, `/projects`, `/resume` + each `/projects/${slug}` from `getAll()` with absolute URLs (Pitfall 9) and no deprecated `changeFrequency` / `priority`. `app/robots.ts` allows `*` for `/`, disallows `/_next/` + `/api/`, points at `${SITE_URL}/sitemap.xml`.
- **4 Wave-0 SEO placeholders replaced with 22 real assertions** (vs. 4 skipped before): metadata.test.ts (7), sitemap.test.ts (5), robots.test.ts (3), og-image.test.ts (7). Pitfall 4 enforcement: metadata Tests 5 + 6 hard-fail if any route re-introduces `openGraph.images` or `twitter.images`.
- **4 obsolete Phase 3/4 OG-images assertions flipped:** `tests/about/about-page.test.tsx`, `tests/home/page.test.tsx` Test 6, `tests/projects/index-page.test.tsx` Test 12, and `tests/projects/page-metadata.test.ts` (4 OG-precedence tests → 3 Pitfall-4 contract tests). Same surface area, new correct behavior locked.

## Task Commits

1. **Task 1: 6 OG image surfaces + shared og-template renderer** — `2c662fd` (feat)
2. **Task 2: Pitfall 4 cleanup — delete manual openGraph.images from 5 pages** — `de763f4` (refactor)
3. **Task 3: app/sitemap.ts + app/robots.ts** — `dd1ce02` (feat)
4. **Task 4: replace 4 seo placeholders + flip 4 obsolete OG tests** — `4aff37a` (test)

**Plan metadata commit:** pending (will include SUMMARY.md, STATE.md, ROADMAP.md, REQUIREMENTS.md)

## Files Created/Modified

### Created (9)
- `lib/og-template.tsx` — shared 1200×630 OG renderer with Geist font loading
- `app/opengraph-image.tsx` — root default OG for /
- `app/opengraph-image.alt.txt` — alt text for root default
- `app/(site)/about/opengraph-image.tsx` — per-route OG for /about
- `app/(site)/projects/opengraph-image.tsx` — per-route OG for /projects
- `app/resume/opengraph-image.tsx` — per-route OG for /resume
- `app/(site)/projects/[slug]/opengraph-image.tsx` — dynamic per-project OG via generateImageMetadata
- `app/sitemap.ts` — MetadataRoute.Sitemap with getAll() integration
- `app/robots.ts` — MetadataRoute.Robots with sitemap pointer

### Modified (14)
- `app/(site)/page.tsx` — Pitfall 4 cleanup
- `app/(site)/about/page.tsx` — Pitfall 4 cleanup
- `app/(site)/projects/page.tsx` — Pitfall 4 cleanup
- `app/(site)/projects/[slug]/page.tsx` — Pitfall 4 cleanup + removed unused imports/vars
- `app/resume/page.tsx` — Pitfall 4 cleanup
- `tests/seo/metadata.test.ts` — placeholder → 7 MTA-01 assertions
- `tests/seo/sitemap.test.ts` — placeholder → 5 MTA-03 assertions
- `tests/seo/robots.test.ts` — placeholder → 3 MTA-03 assertions
- `tests/seo/og-image.test.ts` — placeholder → 7 MTA-02 assertions
- `tests/about/about-page.test.tsx` — OG-images presence assertion flipped to absence
- `tests/home/page.test.tsx` — Test 6 flipped
- `tests/projects/index-page.test.tsx` — Test 12 flipped
- `tests/projects/page-metadata.test.ts` — 4 OG-precedence tests → 3 Pitfall-4 contract tests

## Decisions Made

1. **Per-route default-OG siblings, NOT a single root default for all routes.** UI-SPEC § Copywriting Contract locks different titles + meta rows for each of `/`, `/about`, `/projects`, `/resume`. 4 sibling files + 1 root + 1 dynamic `[slug]` + 1 shared `lib/og-template.tsx` renderer = 7 files. The 5 page-level OG files are 15-line delegations through `renderOg({ title, meta })`.
2. **Node.js runtime, NEVER Edge.** Geist Medium TTFs are loaded via `fs.readFile(join(process.cwd(), 'node_modules/geist/dist/fonts/...'))`. Edge runtime would force `fetch()` against bundled URLs and pay an unnecessary cold-start tax. Asserted by `og-image.test.ts` Test 5 (Pitfall 2 lock).
3. **Pitfall 4 cleanup INCLUDED in Plan 06-02** (not deferred to a future cleanup). Leaving 5 stale `openGraph.images` arrays after shipping 6 sibling OG files would confuse every future contributor reading any page metadata block. Two new `metadata.test.ts` Tests (5 + 6) hard-fail if anyone re-adds them, with the failure message naming the sibling file that should own the image instead.
4. **Test 6 (Pitfall 1) and Test 5 (Pitfall 2) strip comments before regex grep.** `lib/og-template.tsx` documents the Pitfall 1 ban using the exact forbidden literal `"display: 'grid'"`. A naive `grep` for that literal would trip on its own documentation. Solution: `raw.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')` before regex. Reusable pattern for any future Pitfall-lock test.
5. **Obsolete Phase 3/4 OG-images assertions REWRITTEN, not deleted.** 4 pre-existing tests asserted the Phase 3 OG precedence chain (`project.ogImage → hero.src → /og-default.png` embedded in `generateMetadata`). All 4 were flipped to assert the NEW Pitfall-4 absence contract — preserving test coverage of the same surface area while codifying the new correct behavior.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 — Blocking] Updated 4 pre-existing tests that asserted the deleted Phase 3 OG-images behavior**

- **Found during:** Task 4 (running full suite after the new SEO tests passed)
- **Issue:** 7 tests failed across `tests/about/about-page.test.tsx`, `tests/home/page.test.tsx` (Test 6), `tests/projects/index-page.test.tsx` (Test 12), and `tests/projects/page-metadata.test.ts` (4 OG-precedence tests). All 7 asserted the existence of `openGraph.images` / `twitter.images` arrays that Task 2 (Pitfall 4 cleanup) had just deleted.
- **Fix:** Rewrote each assertion to assert the NEW Pitfall-4 absence contract (`openGraph.images` undefined, `twitter.images` undefined). For `page-metadata.test.ts`, the 4 OG-precedence tests were replaced with 3 new tests that match the new contract: openGraph.images absent, twitter.images absent, twitter.card preserved.
- **Files modified:** `tests/about/about-page.test.tsx`, `tests/home/page.test.tsx`, `tests/projects/index-page.test.tsx`, `tests/projects/page-metadata.test.ts`
- **Commit:** `4aff37a` (bundled with Task 4 since the test changes are directly motivated by the Pitfall 4 cleanup that Task 2 landed)

**2. [Rule 1 — Bug] Stripped comments before source-grep in og-image.test.ts Tests 5 + 6**

- **Found during:** Task 4 (proactive review after spotting that `grep -rE "display:\s*['\"]grid['\"]"` matches the comment `// forbids display: 'grid'` in `lib/og-template.tsx`)
- **Issue:** Naive regex for the forbidden literal would hit the documentation describing why it is forbidden — false-positive failure.
- **Fix:** Added a comment-strip pre-pass (`raw.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')`) before applying the Pitfall 1 + Pitfall 2 regexes.
- **Files modified:** `tests/seo/og-image.test.ts`
- **Commit:** `4aff37a` (Task 4 commit — fix landed before the test was first checked in)

## Issues Encountered

None beyond the two deviations documented above.

## Verification Evidence

| Check | Result |
|-------|--------|
| `pnpm typecheck` exits 0 | PASS |
| `pnpm vitest run tests/seo/` — 29 passed, 0 failed, 0 skipped | PASS |
| `pnpm vitest run` full suite — 485 passed, 11 skipped, 0 failed | PASS |
| `grep -rE "export\s+const\s+runtime\s*=\s*['\"]edge['\"]" app/` returns NOTHING (Pitfall 2 lock) | PASS |
| 6 OG files exist on disk + lib/og-template.tsx | PASS |
| 5 page metadata blocks contain NO `openGraph.images: [...]` or `twitter.images: [...]` arrays | PASS |
| `app/sitemap.ts` uses `getAll()` + emits absolute URLs (Pitfall 9) | PASS |
| `app/robots.ts` disallows /_next/ + /api/, points at sitemap.xml | PASS |
| `public/og-default.png` still present (NOT deleted — kept as build-time safety net per UI-SPEC § Fallback chain) | PASS |
| MTA-01 + MTA-02 + MTA-03 requirements completed | PASS |

## User Setup Required

None — all Phase 6 Plan 02 deliverables are build-time / source-only. No env vars, no external services, no manual config.

## Visual Verification (manual, deferred to Plan 06-04 lighthouse-report.md)

Per UI-SPEC § The Two Visual Artifacts → 1. Dynamic OG image, the actual rendered composition can only be inspected via the live build. Commands for the manual pass:

```bash
pnpm dev
# Then visit:
#   http://localhost:3000/opengraph-image                       # root default
#   http://localhost:3000/about/opengraph-image                 # /about sibling
#   http://localhost:3000/projects/opengraph-image              # /projects sibling
#   http://localhost:3000/resume/opengraph-image                # /resume sibling
#   http://localhost:3000/projects/myco/opengraph-image/myco    # Myco per-project
```

Each should render the editorial dark composition (1200×630, #0a0a0a bg, Geist Mono wordmark top-left, Geist Sans 80/64px display title center-left, Geist Mono 20px meta row bottom-left in #737373; no accent color). Owner of this verification step: Plan 06-04 (lighthouse + manual checklist).

## Next Phase Readiness

Plan 06-02 unblocks the remaining Phase 6 plans:

- **Plan 06-03 (Wave 2, a11y)** — already running in parallel with this plan.
- **Plan 06-04 (Wave 3, launch gate + lighthouse)** — will exercise the OG image surfaces during the Lighthouse pass on `/` + `/projects/myco`, and will visually verify the OG output via the manual checklist in `lighthouse-report.md`.
- **Plan 06-05 (Wave 4, phase gate)** — will validate that all Phase 6 deliverables exist and the test count moved as expected (4 → 0 skipped from the seo/ directory).
- **Phase 7 content pass** — when more MDX lands under `content/projects/*.mdx`, `getAll()` auto-extends both the sitemap and the dynamic `[slug]` OG enumeration. Zero Plan 06-02 changes required.

**Ready for Plan 06-04 and the Plan 06-05 phase gate.**

## Self-Check: PASSED

All 9 created files exist on disk and all 4 task commits (`2c662fd`, `de763f4`, `dd1ce02`, `4aff37a`) exist in git history.
