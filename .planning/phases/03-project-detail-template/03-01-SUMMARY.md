---
phase: 03-project-detail-template
plan: 01
subsystem: ui
tags: [mdx, rsc, next-image, tailwind-v4, tokens, figure, gallery, callout, mdx-components, useMDXComponents]

# Dependency graph
requires:
  - phase: 03-project-detail-template
    provides: "Wave 0 — .prose typographic scope in app/globals.css, design tokens (--color-accent, --color-danger, --color-surface-2, --color-text-tertiary, --radius-md, --text-h2, --text-h3), Phase 2 mdx-components.tsx stub, lib/utils.ts cn() helper"
  - phase: 02-content-pipeline
    provides: "@next/mdx wired in next.config.ts, mdx-components.tsx as the global registration channel"
  - phase: 01-foundation
    provides: "Design token system, next/image + sharp pipeline, vitest@jsdom with @ alias"
provides:
  - "MDXProse RSC wrapper that opens the .prose typographic scope with the 65ch measure + mx-auto + mt-12 md:mt-16 top rhythm"
  - "Figure MDX component (next/image + optional figcaption + wide-bleed opt-in)"
  - "Gallery MDX component (1/2-up default, 3-up at lg+ via columns=3, gap ramp 4 -> 6 -> 8, per-item figure semantics)"
  - "Callout MDX component (aside + surface-2 + 4px left-border encoding note/warn/quote variants; no decorative icons; quote italicizes body)"
  - "mdx-components.tsx extended to register Figure/Gallery/Callout via useMDXComponents — the @next/mdx global pickup channel"
  - "Zero new dependencies; zero 'use client' directives; zero client JS contributed from any of the four components"
affects: [03-02-page-template, 03-03-next-block, 04-home-and-index, 07-private-projects]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Arbitrary Tailwind class form for tokens: `bg-[color:var(--color-surface-2)]` / `border-l-[color:var(--color-accent)]` — preserves token discipline + grep-ability (no Tailwind @theme color-name aliases that would obscure the token reference)"
    - "Variant encoded as a Record<Variant, classString> lookup table (VARIANT_BORDER in callout.tsx) — one place to add a variant, no nested switch/case noise"
    - "Wide-bleed shared as a module-level const string (WIDE_BLEED) duplicated across Figure/Gallery/Callout — intentional duplication, since each component imports independently and a shared file would add an indirection for a 1-line value pattern"
    - "MDX-callable RSC pattern: separate file per component under components/mdx/, named export, no default export — keeps mdx-components.tsx registration block readable (3 named imports)"
    - "Source-assertion test pattern reused: registration.test.ts greps mdx-components.tsx source for the three import lines + a runtime equality check on the useMDXComponents() return map. Catches both silent removal AND silent rebind to a different module."

key-files:
  created:
    - "components/mdx/prose.tsx"
    - "components/mdx/figure.tsx"
    - "components/mdx/gallery.tsx"
    - "components/mdx/callout.tsx"
    - "tests/mdx/prose.test.tsx"
    - "tests/mdx/components.test.tsx"
    - "tests/mdx/registration.test.ts"
  modified:
    - "mdx-components.tsx"

key-decisions:
  - "Used arbitrary Tailwind `[color:var(--color-...)]` form everywhere for token references — UI-SPEC §7 wrote `bg-surface-2` shorthand, but tokens.css declares tokens as raw CSS custom properties under @theme without short-name color aliases. The arbitrary form is the only valid Tailwind v4 syntax that compiles against this token shape AND keeps the var() reference grep-able. Tests assert the arbitrary form, not a short-name alias."
  - "TDD split: each of the three tasks went RED -> GREEN with separate commits (6 task commits total). Negative assertion in registration.test.ts ('no h2/h3/pre overrides') passed in RED state too — by construction, since the empty stub had no overrides; remained green after the GREEN extension. That's a feature, not a flaw: it locks the constraint regardless of starting state."
  - "Module-level WIDE_BLEED const duplicated in figure/gallery/callout instead of factored out — exactly one line, three call sites, zero shared dependency to maintain. A lib/mdx/bleed.ts file would have been ceremony."

patterns-established:
  - "TDD RED-then-GREEN commit split for component plans — the failing test commits BEFORE the implementation, both visible in git log. Lets the verifier or a future reader see the contract in isolation from the satisfaction."
  - "Source-assertion + runtime-equality dual lock for the @next/mdx registration channel — source regex catches import deletion or path-rename; runtime `expect(components.X).toBe(X)` catches stale bindings or aliasing."
  - "Component files under `components/mdx/` use named exports only (no default exports). Aligns with the project's existing `components/site/*` and `components/motion/*` conventions; consistent import shape across the codebase."

requirements-completed: [PRJ-02]

# Metrics
duration: 3min
completed: 2026-05-15
---

# Phase 3 Plan 01: MDX Component Library Summary

**MDXProse + Figure + Gallery + Callout shipped as RSC-only components; mdx-components.tsx now registers Figure/Gallery/Callout via the @next/mdx useMDXComponents global channel.**

## Performance

- **Duration:** 3 min
- **Started:** 2026-05-16T00:31:56Z
- **Completed:** 2026-05-16T00:35:02Z
- **Tasks:** 3
- **Files created:** 7
- **Files modified:** 1

## Accomplishments

- Four MDX components (`MDXProse`, `Figure`, `Gallery`, `Callout`) shipped as RSC-only files under `components/mdx/` — zero `'use client'` directives, zero client JS contributed
- `mdx-components.tsx` extended from the Phase 2 stub to register `Figure`/`Gallery`/`Callout` via `useMDXComponents` (the @next/mdx global pickup channel). No per-page `components` prop wiring needed downstream.
- 20 new test cases green (prose 2 + components 13 + registration 5), all 162 tests across 18 files remain green (no regression)
- `pnpm typecheck` clean
- `pnpm build` succeeds end-to-end through the updated registration

## Task Commits

Each task was committed atomically with a TDD RED -> GREEN split:

1. **Task 03-01-01 RED: failing test for MDXProse wrapper** — `035b96b` (test)
2. **Task 03-01-01 GREEN: implement MDXProse wrapper** — `5cdfcce` (feat)
3. **Task 03-01-02 RED: failing RTL suite for Figure/Gallery/Callout** — `b2d0cbf` (test)
4. **Task 03-01-02 GREEN: implement Figure/Gallery/Callout MDX components** — `f3a273c` (feat)
5. **Task 03-01-03 RED: failing source + runtime assertion for mdx-components registration** — `5e09806` (test)
6. **Task 03-01-03 GREEN: register Figure/Gallery/Callout via useMDXComponents** — `1574181` (feat)

**Plan metadata:** _pending — committed in final docs commit_

## Files Created/Modified

| Path | Status | What it does |
|------|--------|--------------|
| `components/mdx/prose.tsx` | created | `MDXProse` RSC wrapper that opens the `.prose` typographic scope, applies the `max-w-[65ch]` measure, centers via `mx-auto`, sets `mt-12 md:mt-16` top rhythm. Single edit point if the measure ever changes. |
| `components/mdx/figure.tsx` | created | `Figure` MDX component: `next/image` + optional `<figcaption>` + `wide` bleed opt-in (`mx-[calc((100%-100vw)/2+50%)] max-w-[calc(min(100vw,72rem)-2rem)]`). Default 1200×900, configurable via `width`/`height` props. Caption styled with `text-[color:var(--color-text-secondary)]` and `text-[var(--text-label)]`, centered. |
| `components/mdx/gallery.tsx` | created | `Gallery` MDX component: N-up grid (default `grid-cols-1 sm:grid-cols-2`; `columns=3` opts in to `lg:grid-cols-3`). Gap ramp `gap-4 md:gap-6 lg:gap-8`. Per-item `<figure>` with `next/image` + optional `<figcaption>`. Same wide-bleed opt-in as Figure. |
| `components/mdx/callout.tsx` | created | `Callout` MDX component: `<aside>` + `bg-[color:var(--color-surface-2)]` + `rounded-md` + 4px left border. Variant encoded as `Record<CalloutVariant, classString>` lookup → `note=--color-accent`, `warn=--color-danger`, `quote=--color-text-tertiary`. `quote` variant additionally italicizes body. Optional `title` prop renders a lowercase mono label above body. Padding ramp `px-4 py-4 md:px-6 md:py-5`. No icons, no per-variant background tint. |
| `mdx-components.tsx` | modified | Replaced the empty Phase 2 stub with imports of `Figure`/`Gallery`/`Callout` from `@/components/mdx/{figure,gallery,callout}` and a `MDXComponents` map registered via `useMDXComponents()`. Comment notes h2/h3/pre/code are handled by rehype + `.prose` CSS at build time; no JSX overrides. |
| `tests/mdx/prose.test.tsx` | created | 2 RTL cases on `MDXProse`: required class string (`mx-auto`, `max-w-[65ch]`, `mt-12`, `md:mt-16`, `prose`) + children-as-direct-descendants invariant. |
| `tests/mdx/components.test.tsx` | created | 13 RTL cases across `<Figure>` (4: default render, caption present, caption absent, wide bleed), `<Gallery>` (4: 2-up default, 3-up opt-in, captions only when set, wide bleed), `<Callout>` (5: note/warn/quote borders, italic body for quote, title present/absent, children pass-through). |
| `tests/mdx/registration.test.ts` | created | 5 cases: 3 import-source regex assertions on `mdx-components.tsx`, 1 runtime equality check that `useMDXComponents().Figure === Figure` (etc.), 1 negative assertion that no `h2:/h3:/pre:` JSX overrides leaked in. |

## Decisions Made

1. **Token references use Tailwind v4 arbitrary form (`[color:var(--color-...)]`), not short-name aliases.** UI-SPEC §7 wrote shorthand like `bg-surface-2` and `border-l-accent`, but `styles/tokens.css` declares tokens as raw CSS custom properties under `@theme` (e.g. `--color-surface-2: #141414`) without separately registering short-name color aliases in the Tailwind v4 color namespace. The arbitrary `bg-[color:var(--color-surface-2)]` form is the valid Tailwind v4 syntax that compiles against this token shape AND keeps the `var()` reference grep-able from any component. Tests assert the arbitrary form, not a short-name alias — this is locked. Aligns with the Wave 0 decision to hand-author `.prose` over `@tailwindcss/typography` for the same reason.

2. **TDD RED→GREEN split as 2 commits per task, all 6 task commits visible in `git log`.** The plan explicitly authorized TDD; the per-task RED commit lets the verifier (or any future reader) see the contract in isolation from the satisfaction. No commits were collapsed in this plan because every component file is genuinely new and the test file IS the externally observable contract.

3. **`WIDE_BLEED` const duplicated across `figure.tsx`/`gallery.tsx`/`callout.tsx` instead of extracted.** One line, three call sites, zero shared module to maintain. A `lib/mdx/bleed.ts` shared module would have been ceremony — DRY at the cost of two extra indirections and a new file. Each component file is fully self-contained; the bleed pattern can drift independently if a future component needs a different bleed (unlikely, but free).

4. **Caption styling uses `font-sans` explicitly even though `font-sans` is the default.** Defensive — the caption appears inside `.prose` which already styles `p`, `a`, etc.; the `<figcaption>` is not a `<p>`, but a downstream font-family inheritance audit is one less thing to do if a future `.prose figcaption` rule lands. Minor cost, zero downside.

5. **`Callout` title uses `font-mono` + `lowercase` + `tracking-[0.02em]`.** Maps to the UI-SPEC §7 spec: lowercase mono label with `tracking-wide` (the Phase 1 token `--tracking-wide` is `0.02em`, expressed here as the arbitrary `[0.02em]` to avoid a Tailwind v4 token-alias lookup that would need a separate `@theme` registration). Matches Wave 0's same decision pattern for the `font-mono` filename labels in code blocks.

## Deviations from Plan

None — plan executed exactly as written.

The plan was unusually well-specified: every test source was verbatim, every component source was verbatim, every acceptance criterion had a corresponding test assertion. The only judgment call was the Tailwind v4 arbitrary-class syntax for token references (Decision 1 above), and the plan itself authorized this in the action block ("If a className-grep test fails because Tailwind v4's arbitrary-value syntax produced a slightly different class string, adjust the test grep to match the actual emitted class — but do NOT change the component to an alternative color path"). In practice the tests passed on the first GREEN run; no test-vs-component reconciliation was needed.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required for Wave 1.

## Next Phase Readiness

Wave 2 (Plan 03-02: `app/(site)/projects/[slug]/page.tsx` + `<ProjectHero>` + `generateMetadata`) is unblocked:

- `<MDXProse>` ready to import from `@/components/mdx/prose` — wrap the dynamically-imported MDX body with `<MDXProse>{<MDXBody />}</MDXProse>` and the 65ch measure + `.prose` rhythm activate automatically.
- `useMDXComponents` returns the live map containing Figure/Gallery/Callout. `@next/mdx` picks this up globally — DO NOT pass a `components` prop to `<MDXBody />` (Anti-Pattern per RESEARCH).
- `isPlaceholderHero` (Wave 0) + `/og-default.png` (Wave 0) + this wave's MDX library = everything Wave 2 needs to ship the page template without inventing layout.

Wave 3 (Plan 03-03: `<NextProjectBlock>`) — no Wave 1 dependency.

`pnpm build` succeeds, `pnpm typecheck` clean, 162/162 tests green. No blockers for the remaining 2 plans in Phase 3.

## Self-Check: PASSED

Verified after writing this summary:

- [x] `components/mdx/prose.tsx` exists
- [x] `components/mdx/figure.tsx` exists
- [x] `components/mdx/gallery.tsx` exists
- [x] `components/mdx/callout.tsx` exists
- [x] `tests/mdx/prose.test.tsx` exists
- [x] `tests/mdx/components.test.tsx` exists
- [x] `tests/mdx/registration.test.ts` exists
- [x] `mdx-components.tsx` updated (imports Figure/Gallery/Callout + registers them via useMDXComponents)
- [x] Commit `035b96b` present in `git log` (Task 03-01-01 RED)
- [x] Commit `5cdfcce` present in `git log` (Task 03-01-01 GREEN)
- [x] Commit `b2d0cbf` present in `git log` (Task 03-01-02 RED)
- [x] Commit `f3a273c` present in `git log` (Task 03-01-02 GREEN)
- [x] Commit `5e09806` present in `git log` (Task 03-01-03 RED)
- [x] Commit `1574181` present in `git log` (Task 03-01-03 GREEN)
- [x] `pnpm vitest run tests/mdx` → 27/27 green (20 new + 7 pre-existing pipeline tests)
- [x] `pnpm test:ci` → 162/162 green (no regression in any prior suite)
- [x] `pnpm typecheck` → exit 0
- [x] `pnpm build` → exit 0

---
*Phase: 03-project-detail-template*
*Completed: 2026-05-15*
