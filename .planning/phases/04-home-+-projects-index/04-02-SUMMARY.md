---
phase: 04-home-+-projects-index
plan: 02
subsystem: home
tags: [rsc, home-page, hero-composer, project-grid-composer, metadata, phase-1-cleanup, hom-01, hom-02, hom-03, hom-04, wave-2]

# Dependency graph
requires:
  - phase: 04-home-+-projects-index
    plan: 00
    provides: "ThesisParagraph (SSR-safe per-word fade client island)"
  - phase: 04-home-+-projects-index
    plan: 01
    provides: "ProjectCardHero + ProjectCardSecondary + CardMeta RSC primitives"
  - phase: 02-content-pipeline
    provides: "getAll() + getHeroProjects() pure query helpers; Project type from lib/content.ts"
  - phase: 01-foundation
    provides: "(site)/layout.tsx shell; tokens.css; Vitest @jsdom + @testing-library/react; @ alias; FadeIn (now unused on home, intentionally NOT deleted — Phase 5 may use)"
provides:
  - "<HomeHero> RSC — wordmark + role frame + ThesisParagraph slot; the single <h1> per home route"
  - "<HomeProjectGrid> RSC — hairline divider, selected-work hero stack, conditional more-work secondary grid (HOM-03 omission rule when empty)"
  - "app/(site)/page.tsx — REPLACED Phase 1 placeholder; composes HomeHero + HomeProjectGrid; per-route metadata (description + openGraph.images declared; title omitted to let root titleTemplate.default flow through)"
  - "Three RTL test suites locking visible behavior: 5 (HomeHero) + 4 (HomeProjectGrid) + 10 (page route + metadata + source-grep invariants) = 19 new cases"
  - "HOM-04 source-grep invariants encoded directly in tests/home/page.test.tsx — no whileInView, no IntersectionObserver, no grid-cols-12, no col-span-2, no FadeIn identifier, no banned words"
affects: [04-04-projects-index, 06-meta-and-perf]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Block-comment + line-comment dual-strip for source-grep tests — RSC documentation intentionally names absent APIs in JSDoc (e.g. JSDoc 'no whileInView' + 'replaces Phase 1 FadeIn' breadcrumb). Naive line-only stripping false-positives. Mirrors Plan 04-03 forbidden-client-API source-grep but extends to block comments. Reusable for any anti-pattern source assertion."
    - "Per-route metadata: home page OMITS `title` to let root layout's `title.default` flow through. Declaring `title: 'olivelliott.dev'` invokes `titleTemplate: '%s · olivelliott.dev'` and emits 'olivelliott.dev · olivelliott.dev'. Open Graph images, by contrast, MUST be declared on the route — root layout does not declare them, so omitting on the page yields no OG image emit."
    - "Typography flows DOWN from composer to slot. HomeHero owns the body / Geist Sans / 400 / leading-1.6 / --color-text-secondary / max-w-[55ch] class string and passes it to <ThesisParagraph className=...>. ThesisParagraph owns ONLY segmentation + motion logic. Locks the role-frame and thesis visually to the same type stack without coupling them by import."
    - "Conditional section omission (HOM-03): when `secondaryProjects.length === 0`, the entire <section> + eyebrow + grid is omitted at the composer level. No empty <section>, no 'coming soon' placeholder, no empty grid. The page simply ends at the last hero card. Tested at the composer (home-project-grid.test.tsx) AND at the route (page.test.tsx Test 3a/3b)."
    - "Composer test isolation: HomeProjectGrid tests do NOT mock motion/react (pure RSC, transitively pure — cards don't import motion). HomeHero tests DO mock motion/react (transitively loads ThesisParagraph 'use client'). Page tests mock both motion AND @/lib/projects (dual mock for render + metadata assertions). Mock surface = depth of transitive client load."

key-files:
  created:
    - "components/home/home-hero.tsx"
    - "components/home/home-project-grid.tsx"
    - "tests/home/home-hero.test.tsx"
    - "tests/home/home-project-grid.test.tsx"
    - "tests/home/page.test.tsx"
  modified:
    - "app/(site)/page.tsx (REPLACED — Phase 1 placeholder fully removed)"

key-decisions:
  - "Phase 1 placeholder cleanup performed in full: FadeIn import removed from app/(site)/page.tsx; the only remaining mention of FadeIn is a JSDoc breadcrumb in the page docstring ('Replaces the Phase 1 placeholder (a single FadeIn-wrapped tagline)'). The breadcrumb is intentional per UI-SPEC § Cleanup Checklist — preserves the historical context for future readers; tests strip comments before identifier grep so the docstring doesn't false-positive."
  - "components/motion/fade-in.tsx itself was NOT deleted (per plan constraints). Phase 5 (about/contact/resume) may compose FadeIn. This plan only removes the import from the home page; the component file remains in the tree for downstream consumers."
  - "Test files use the Plan-00 Pitfall-8 motion mock pattern verbatim — `vi.doMock('motion/react', ...)` with BOTH `m` (Proxy stripping motion-only props) AND `useReducedMotion` (per-test return). Reused in home-hero.test.tsx and page.test.tsx because both transitively load ThesisParagraph. HomeProjectGrid test file does NOT install the mock (cards are pure RSC; no motion/react import)."
  - "Wave 2 parallel commit policy: all 4 commits used `--no-verify` per orchestrator instruction to avoid pre-commit hook contention with the parallel agent on Plan 04-04. Hooks validated once by the orchestrator after the wave completes."

patterns-established:
  - "Source-grep test for anti-patterns must strip BOTH /* block */ AND // line comments before regex match — otherwise JSDoc anti-pattern naming ('no whileInView', 'replaces FadeIn') false-positives. Pattern: `src.replace(/\\/\\*[\\s\\S]*?\\*\\//g, '').split('\\n').map(l => l.replace(/\\/\\/.*$/, '')).join('\\n')`. Reusable across the codebase for any RSC-contract source assertion."
  - "Page-level test combines BOTH render-tree assertions (via mocked queries + dynamic await import) AND metadata-export assertions (via the same dynamic import) AND source-level assertions (via readFileSync). Three independent verification surfaces for a single route. Pattern: `await import('@/app/(site)/page')` returns `{ default: Component, metadata: Metadata }`."

requirements-completed: [HOM-01, HOM-02, HOM-03, HOM-04]

# Metrics
duration: 5 min
completed: 2026-05-16
---

# Phase 4 Plan 02: Home Page Composition Summary

## One-liner

Three RSC composers (HomeHero + HomeProjectGrid + replaced page route) wire ThesisParagraph (Plan 00) + cards (Plan 01) into the v1 home page; per-route metadata locked with root titleTemplate.default flowing through; Phase 1 FadeIn placeholder fully removed; 19 new RTL cases lock HOM-01..HOM-04 at composer + route + source-grep levels.

## Performance

- **Duration:** ~5 min
- **Started:** 2026-05-16T17:54:00Z
- **Completed:** 2026-05-16T17:59:23Z
- **Tasks:** 2 (each a TDD RED → GREEN pair)
- **Files created:** 5 (2 components + 3 test files)
- **Files modified:** 1 (`app/(site)/page.tsx` — Phase 1 placeholder REPLACED in full)
- **Tests added:** 19 (5 HomeHero + 4 HomeProjectGrid + 10 page route)
- **Tests total:** 280/280 passing (up from 261 baseline)

## Accomplishments

- **Three composer files shipped** under `components/home/` + replaced page route:
  - `HomeHero` RSC: `<section id="hero" aria-labelledby="hero-wordmark">` wrapping the single `<h1>` (wordmark) + role-frame `<p>` + `<ThesisParagraph>` slot. Typography (`max-w-[55ch]`, body color, mt-6) passed DOWN from HomeHero per RESEARCH Q2 recommendation.
  - `HomeProjectGrid` RSC: `<hr>` hairline divider + conditional `selected work` hero-card stack + conditional `more work` secondary-card grid (1/2/3-up). HOM-03 omission rule enforced at the composer level: empty `secondaryProjects` → entire section omitted.
  - `app/(site)/page.tsx` REPLACED: composes both composers; per-route metadata (description + OG image declared; title omitted); PLACEHOLDER: Phase 7 marker on THESIS const.

- **HOM-01 + HOM-02 + HOM-03 + HOM-04 all locked** at multiple verification surfaces:
  - HOM-01 (single H1 + wordmark + thesis visible from SSR) — composer test counts h1; page test counts h1; build emits prerendered HTML with "olive elliott".
  - HOM-02 (hero-tier rendered as ProjectCardHero) — grid test counts anchors per section; page test asserts project titles present.
  - HOM-03 (secondary section ONLY when non-empty) — grid test asserts both branches (empty → no section; non-empty → eyebrow + cards); page test asserts both branches via mocked getAll.
  - HOM-04 (no bento + no stagger-on-scroll) — composer source-grep + page test source-grep (block + line comment stripping); zero `whileInView` / `IntersectionObserver` / `grid-cols-12` / `col-span-2` in any home-page source.

- **Phase 1 placeholder cleanup verified:**
  - `app/(site)/page.tsx` no longer imports `FadeIn`.
  - `app/(site)/page.tsx` no longer renders `under construction. real projects arrive in phase 4.`
  - `components/motion/fade-in.tsx` itself NOT deleted (Phase 5 may compose it; per plan).
  - Test 8 enforces absence at the source level.

- **Per-route metadata contract locked:**
  - `metadata.title` is undefined — root layout's `title.default = 'olivelliott.dev'` flows through.
  - `metadata.description` declares the locked copy.
  - `metadata.openGraph.images[0].url === '/og-default.png'` (root layout omits OG images; the home route declares them so the social card emits correctly).
  - `metadata.twitter.card === 'summary_large_image'` with `/og-default.png`.

- **Build prerenders the home route end-to-end:**
  - `pnpm build` exit 0; `/` route emits as `○ (Static)`.
  - `.next/server/app/index.html` contains literal `olive elliott`.
  - No client-side data fetching; all 3 hero cards and any secondary cards exist in the SSR HTML.

- **No regressions:** 280/280 green (full suite); `pnpm typecheck` exit 0.

## Task Commits

| # | Task | Type | Commit |
|---|------|------|--------|
| 1 | Task 04-02-01 RED: failing specs for HomeHero + HomeProjectGrid (9 cases) | test | `5ce90f4` |
| 2 | Task 04-02-01 GREEN: implement HomeHero + HomeProjectGrid RSC composers | feat | `49a4a35` |
| 3 | Task 04-02-02 RED: failing 10-case spec for home page (HOM-01..HOM-04 + cleanup) | test | `a90bca1` |
| 4 | Task 04-02-02 GREEN: replace Phase 1 placeholder home + per-route metadata (bundled test-instrumentation fix for comment-stripping) | feat | `71e95b3` |

All commits used `--no-verify` per Wave 2 parallel orchestrator instruction.

## Files Created/Modified

| Path | Status | What it does |
|------|--------|--------------|
| `components/home/home-hero.tsx` | created | `HomeHero` RSC. `<section id="hero" aria-labelledby="hero-wordmark" className="flex flex-col">` wrapping `<h1 id="hero-wordmark">` (display scale `clamp(2rem,5vw,3rem)`, Geist Sans, weight 500, tracking `-0.02em`, lowercase, `--color-text-primary`), role-frame `<p>` (mt-4, body type, secondary color, `max-w-[55ch]`), and `<ThesisParagraph text={thesis} className="mt-6 ..." />`. Typography for thesis flows DOWN via className per RESEARCH § Open Question #2. |
| `components/home/home-project-grid.tsx` | created | `HomeProjectGrid` RSC. `<hr>` hairline + conditional `<section aria-labelledby="hero-eyebrow">` (eyebrow + flex-col stack of `<ProjectCardHero>`) + conditional `<section aria-labelledby="secondary-eyebrow">` (eyebrow + 1/2/3-up grid of `<ProjectCardSecondary>`). Empty `secondaryProjects` → entire secondary section omitted. No motion. No whileInView. No bento. |
| `app/(site)/page.tsx` | **REPLACED** | Composes `<HomeHero>` + `<HomeProjectGrid>`. Locked WORDMARK + ROLE_FRAME constants. THESIS const preceded by `/* PLACEHOLDER: Phase 7 content pass — Olive to revise this string. */`. Per-route `metadata` declares description + openGraph.images + twitter card; OMITS `title` so root titleTemplate.default flows through. No FadeIn import. No client-side state. |
| `tests/home/home-hero.test.tsx` | created | 5 RTL cases: single `<h1 id="hero-wordmark">`; role frame `<p>` styling (secondary color + max-w-[55ch]); thesis `<p>` AFTER role frame in DOM order (SSR-fallback shape via `useReducedMotion: () => null`); exactly ONE `<h1>` in tree; className passthrough from HomeHero to ThesisParagraph (`max-w-[55ch]` + `mt-6` on thesis `<p>`). |
| `tests/home/home-project-grid.test.tsx` | created | 4 RTL cases: 3 hero cards rendered in correct DOM order with correct hrefs; HOM-03 empty-secondary → no `section[aria-labelledby="secondary-eyebrow"]` + no "more work"; non-empty secondary → eyebrow + 2 cards with NO `hero` prop (assert no `<p>hero</p>` inside secondary card anchors); hairline `<hr>` with `border-t` + `--color-hairline` between hero block and grids. |
| `tests/home/page.test.tsx` | created | 10 cases combining render-tree + metadata-export + source-grep assertions: single H1; hero-stack textContent ("olive elliott", "engineer", "Myco"); HOM-03 conditional (Test 3a heroOnly → no "more work"; Test 3b withSecondary → "more work"); metadata.description contains "Olive Elliott" + "local-first"; metadata.title undefined; openGraph.images[0].url === "/og-default.png"; source contains PLACEHOLDER: Phase 7 before THESIS; source contains NO FadeIn identifier (after comment strip); source contains NO whileInView/IntersectionObserver/grid-cols-12/col-span-2 (after comment strip). |

## Decisions Made

1. **Phase 1 placeholder fully replaced; FadeIn breadcrumb preserved in docstring.** The Cleanup Checklist explicitly required removing the `FadeIn` import and the placeholder JSX; both are done. The page docstring retains a one-line historical breadcrumb (`Replaces the Phase 1 placeholder (a single FadeIn-wrapped tagline)`) so future readers understand why FadeIn isn't there. The test suite's source-grep strips block + line comments before identifier match so the breadcrumb doesn't false-positive.

2. **`components/motion/fade-in.tsx` NOT deleted.** Per plan constraints. Phase 5 (`about`/`contact`/`resume`) may compose `FadeIn` for an "earned" affordance. The component file stays in `components/motion/`; only the unused IMPORT was removed from the home route.

3. **Per-route metadata omits `title`.** Declaring `title: 'olivelliott.dev'` would feed through root layout's `titleTemplate: '%s · olivelliott.dev'` and emit `olivelliott.dev · olivelliott.dev`. Omitting `title` lets `title.default = 'olivelliott.dev'` flow through unchanged (RESEARCH § Pattern 5). Test 5 locks this — `mod.metadata.title` MUST be undefined.

4. **OG images declared explicitly on the home route.** Root layout does NOT declare `openGraph.images`. If this route also omitted them, no social card image would emit for `/`. The page metadata declares `openGraph.images: [{ url: '/og-default.png', ... }]` + Twitter card. Mirrors Phase 3's per-route OG declaration on `/projects/[slug]`.

5. **Typography flows DOWN from HomeHero to ThesisParagraph.** HomeHero owns the `mt-6 text-[var(--text-body)] leading-[var(--text-body--line-height)] text-[color:var(--color-text-secondary)] max-w-[55ch]` class string and passes it to `<ThesisParagraph className={...}>`. ThesisParagraph owns only segmentation + motion logic. Locks the role frame and thesis visually to the same type stack without coupling them by import. Test 5 (HomeHero suite) asserts this contract.

6. **HomeProjectGrid test file does NOT mock motion/react.** Cards are pure RSC, CardMeta is pure RSC, nothing in the transitive grid graph imports `motion/react`. The motion mock is only needed where transitive `'use client'` loads happen (HomeHero suite + page suite).

7. **Wave 2 `--no-verify` policy.** All 4 commits used `--no-verify` per orchestrator instruction. The parallel agent on Plan 04-04 (the `/projects` index route) is touching different files (`app/(site)/projects/page.tsx`); hook contention between the two agents would have caused intermittent failures. The orchestrator runs hooks once after the wave.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 — Test bug] Source-grep tests needed block-comment stripping in addition to line-comment stripping**

- **Found during:** Task 04-02-02 GREEN verification (first run of page.test.tsx Test 9 after the implementation landed).
- **Issue:** The plan's `<behavior>` for Test 9 (and Test 8 via the same logic) instructed source-grep on `readFileSync` content. The page source contains a JSDoc block (`/** ... */`) that intentionally names the anti-patterns it forbids ("HOM-04 invariants: no whileInView, no IntersectionObserver, no grid-cols-12, no col-span-2") AND a docstring breadcrumb ("Replaces the Phase 1 placeholder (a single FadeIn-wrapped tagline)"). A naive identifier grep matches the docstring. My first version of Test 9 stripped only line comments (`// ...`), leaving the JSDoc block intact — false-positive on all four banned identifiers AND on `FadeIn`.
- **Fix:** Extended both Test 8 (FadeIn identifier check) and Test 9 (HOM-04 invariants) to strip `/* ... */` block comments BEFORE stripping line comments. Both block-strip + line-strip happen before the regex match. Same pattern as Plan 04-03's forbidden-client-API source-grep, but extended to block comments. The page source is correct (no anti-pattern in actual code); only the test instrumentation needed the fix.
- **Files modified:** `tests/home/page.test.tsx` (two test cases, one new regex per case).
- **Commit:** `71e95b3` (bundled with the page replacement — both edits are required for the test to pass; the implementation was already correct).

**2. [Rule 1 — Test bug] Test count expanded from 9 to 10 (Test 3 split into 3a/3b)**

- **Found during:** Task 04-02-02 test authoring.
- **Issue:** The plan's `<behavior>` for Test 3 specified a single test asserting two opposite branches (heroOnly → no "more work"; withSecondary → "more work"). Combining into one `it()` block would have required toggling the `vi.doMock` mid-test, which the Vitest reset model doesn't cleanly support.
- **Fix:** Split into Test 3a + Test 3b, each with its own mock scenario. Net assertion coverage is identical to the plan's intent (both branches verified independently). Page test count: 10, not 9.
- **Files modified:** `tests/home/page.test.tsx` (one extra `it()` block).
- **Commit:** `a90bca1` (test file authoring).

No other deviations. No authentication gates. No architectural changes needed. No CLAUDE.md-driven adjustments (the plan's directives + UI-SPEC + token system were already CLAUDE.md-aligned: no direct file edits outside GSD, no banned words, no template aesthetics, no auth/CMS/global-state additions).

## Issues Encountered

The two TDD RED commits both confirmed the failing path was a Vite module-resolution failure (component file did not exist yet) — exactly the precedent from Plan 04-00 / Plan 04-01. The GREEN commits then resolved imports and exercised assertions.

The page test's Test 9 source-grep initially failed on JSDoc breadcrumbs naming the anti-patterns. Documented above as Deviation #1; resolved by extending comment-stripping to include block comments. This is a reusable pattern — any future RSC-contract source-grep test in this codebase should strip both forms.

The build emitted two pre-existing lightningcss warnings about `var(--color-...)` and `var(--color-NAME)` arbitrary-class fragments. These are NOT from this plan's source — `grep -rn "color:var(--color-\.\.\.)" components/ app/` returns zero matches in actual source files. The fragments appear to come from Tailwind v4's content scan picking up class-name examples in `.planning/` markdown. Logged for Phase 6 perf audit but not in scope for this plan (Rule 4 scope boundary — pre-existing, not introduced).

## Parallel Wave 2 Notes

Per orchestrator instruction, all 4 commits used `--no-verify` because Wave 2 runs in parallel with Plan 04-04 (`/projects` index route composer). Pre-commit hook contention would have caused either plan to fail intermittently. The orchestrator will run hooks once after both plans complete.

This plan's outputs are fully independent on disk from Plan 04-04:
- This plan ships the HOME route composition: `components/home/{home-hero,home-project-grid}.tsx` + replaces `app/(site)/page.tsx`.
- Plan 04-04 ships the `/projects` INDEX route: `app/(site)/projects/page.tsx` + supporting test files.
- Both plans depend on Plans 04-00 (ThesisParagraph) + 04-01 (cards) + 04-03 (filter primitives, for /projects only); neither depends on the other.

## Next Phase Readiness

- **Plan 04-04 (`/projects` index route)** ships in parallel and is independent of this plan. It does NOT depend on HomeHero/HomeProjectGrid; it composes cards + TagFilterRow + TierSeparator + EmptyFilterState into its own page.
- **Phase 5 (about / resume / contact)** can compose `FadeIn` (still in the tree) and reference the per-route metadata pattern locked here (omit title; declare openGraph.images per-route).
- **Phase 6 (meta + perf)** will sweep all routes for OG image audit and Lighthouse measurement. The home page is now ready for that sweep — `/og-default.png` declared; `<h1>` count exactly 1; HOM-04 anti-patterns source-grepped at test-time.
- **Phase 7 (content)** will revise the THESIS const. The PLACEHOLDER: Phase 7 marker on the line above the const is the breadcrumb for the content-pass reviewer.

`pnpm vitest run` → 280/280 green. `pnpm typecheck` → exit 0. `pnpm build` → exit 0; `/` prerenders as static. No blockers for any downstream Phase 4 plan or for Phase 5+.

## Known Stubs

The THESIS constant in `app/(site)/page.tsx` is explicitly a placeholder, marked with `/* PLACEHOLDER: Phase 7 content pass — Olive to revise this string. */` immediately above. The draft copy is intentional and named in UI-SPEC § Copywriting Contract; Phase 7's content pass will replace it with Olive's final words.

The placeholder is intentional and documented:
- The stub does NOT prevent HOM-01..HOM-04 from being achieved — the home page renders the wordmark, role frame, and a complete thesis paragraph today; only the *exact words* of the thesis are placeholder.
- Phase 7 explicitly owns the resolution path (per .planning/ROADMAP.md and CONTEXT.md).
- The PLACEHOLDER: Phase 7 marker is a discoverable breadcrumb — content reviewer sees it on file open + the source-grep test enforces its continued presence.

No other stubs. ProjectCardHero/ProjectCardSecondary receive real `Project` data flowing from `getAll()` + `getHeroProjects()`; the secondary section omits itself naturally when `secondaryProjects` is empty (the current v1 dev state has only Myco hero-tier authored).

## Self-Check: PASSED

Verified after writing this summary:

- [x] `components/home/home-hero.tsx` — FOUND
- [x] `components/home/home-project-grid.tsx` — FOUND
- [x] `app/(site)/page.tsx` — FOUND (REPLACED — Phase 1 placeholder removed)
- [x] `tests/home/home-hero.test.tsx` — FOUND
- [x] `tests/home/home-project-grid.test.tsx` — FOUND
- [x] `tests/home/page.test.tsx` — FOUND
- [x] Commit `5ce90f4` (Task 1 RED) — FOUND in git log
- [x] Commit `49a4a35` (Task 1 GREEN) — FOUND in git log
- [x] Commit `a90bca1` (Task 2 RED) — FOUND in git log
- [x] Commit `71e95b3` (Task 2 GREEN + test instrumentation fix) — FOUND in git log
- [x] `pnpm vitest run tests/home/` → 19/19 green
- [x] `pnpm vitest run` → 280/280 green (no regression in any prior suite)
- [x] `pnpm typecheck` → exit 0
- [x] `pnpm build` → exit 0; `.next/server/app/index.html` contains "olive elliott"

---
*Phase: 04-home-+-projects-index*
*Completed: 2026-05-16*
