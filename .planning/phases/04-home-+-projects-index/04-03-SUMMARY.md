---
phase: 04-home-+-projects-index
plan: 03
subsystem: ui

tags: [rsc, filter, url-state, aria, accessibility, react, nextjs, typescript, tailwind]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: design tokens (--color-surface-2, --color-accent, --color-text-on-accent, --color-hairline, --motion-duration-fast, --text-label) consumed by all three primitives
  - phase: 02-content-pipeline
    provides: lib/tags.ts (TAGS const + TAG_LABELS map) — TagFilterRow chip text source; lib/projects.ts getAllTags() data shape — TagFilterRow `tags` prop contract
  - phase: 03-project-detail-template
    provides: components/projects/tag-chip-row.tsx — visual sibling reference for chip styling

provides:
  - "TagFilterRow RSC: URL-synced single-tag filter chip row with conditional clear-filter link, zero client JS"
  - "EmptyFilterState RSC: inline zero-result message with locked copy (em-dash + arrow glyphs) and clear link"
  - "TierSeparator RSC: hairline + mono lowercase label with id pass-through for aria-labelledby linkage"
  - "ARIA dual-attribute pattern: aria-pressed + aria-current='true' co-existing on active filter chip"
  - "Source-grep test pattern for forbidden client APIs that tolerates docstring mentions"

affects: [04-04-plan, 06-seo-launch]

# Tech tracking
tech-stack:
  added: []  # no new dependencies
  patterns:
    - "URL-as-state filter mechanic — chips are <a> elements; server reads searchParams; back-button/reload restore natively"
    - "Dual-ARIA on toggle-link affordances (aria-pressed + aria-current='true') for SR distinction without losing link semantics"
    - "Count badges use Tailwind text-current to inherit parent foreground across stateful color shifts (Pitfall 7 lock)"
    - "Source-grep test strips line + block comments before forbidden-pattern match so RSC docstrings can name absent client APIs without false positives"

key-files:
  created:
    - "components/projects/tier-separator.tsx — hairline + mono lowercase label, optional id prop"
    - "components/projects/empty-filter-state.tsx — locked-copy zero-result message"
    - "components/projects/tag-filter-row.tsx — URL-synced filter chip row + conditional clear link"
    - "tests/projects/tier-separator.test.tsx — 4 cases (label render, mono treatment, label variant, optional id)"
    - "tests/projects/empty-filter-state.test.tsx — 6 cases (copy substring, em-dash, arrow, clear link, mono tag span, banned-word lock)"
    - "tests/projects/tag-filter-row.test.tsx — 13 cases (order, hrefs active/inactive, aria-pressed, aria-current, TAG_LABELS text, count badge, text-current lock, conditional clear, anchor-not-button, nav landmark, Pitfall 11 disjoint labels, no-client-directives)"
  modified: []

key-decisions:
  - "ARIA dual-attribute on active chip: aria-pressed='true' (UI-SPEC toggle semantic) AND aria-current='true' (W3C generic current-in-set). Both, not either — pragmatic enhancement per RESEARCH Pattern 3 + Open Question #5."
  - "Count badge uses `text-current` (no explicit color class) so it inherits the chip parent's foreground across active/inactive state shifts. Pitfall 7 lock — otherwise the badge is invisible on the amber active chip."
  - "Active chip href = literal '/projects' (no trailing slash, no fragment). Pitfall 9 lock — guarantees back-button restoration and canonical URL alignment."
  - "Pitfall 11 lock holds by construction: TAGS in lib/tags.ts does not contain 'hero' or 'secondary', so the eyebrow labels (TierSeparator) and filter chip labels (TagFilterRow → TAG_LABELS) are disjoint by typing. Defensive test asserts no chip text matches /\\bhero\\b/ or /\\bsecondary\\b/."
  - "Source-grep test strips comments before matching forbidden client APIs — the RSC contract is intentionally documented in the header comment ('NO useSearchParams, NO use client'), and a naive grep would false-positive on the docstring. Test regex now targets actual code only."

patterns-established:
  - "URL-synced filter mechanic with zero client JS — pure <a> elements, server reads searchParams, full server navigation per chip click. Back-button and reload restore filter state natively."
  - "Dual-ARIA (aria-pressed + aria-current) on toggle-link affordances — chip is still semantically a link (<a>), aria-pressed adds the toggle layer, aria-current places it in the nav-set context."
  - "Tailwind text-current pattern for stateful color inheritance — drop explicit color on child spans when the parent color shifts via active/inactive class swap."
  - "Optional id-pass-through prop on leaf RSCs for aria-labelledby linkage from parent sections. Cheap forward-compatibility for sectioned page composition without forcing id on every consumer."
  - "Comment-stripping source-grep — strip /\\*…\\*/ and ^\\s*//.* before matching forbidden tokens, so RSC documentation can intentionally name absent client APIs."

requirements-completed: [PIX-02, PIX-03]

# Metrics
duration: 5min
completed: 2026-05-16
---

# Phase 4 Plan 03: Filter Primitives Summary

**Three RSC leaf components for /projects index — URL-synced filter row with dual-ARIA active chip, locked-copy empty state with em-dash + arrow glyphs, and tier separator with optional aria-labelledby id pass-through. Zero client JS in the filter mechanic.**

## Performance

- **Duration:** 5 min
- **Started:** 2026-05-16T17:44:58Z
- **Completed:** 2026-05-16T17:50:00Z
- **Tasks:** 2
- **Files modified:** 6 (3 components, 3 test files)
- **Tests added:** 23 (4 TierSeparator + 6 EmptyFilterState + 13 TagFilterRow)
- **Full suite after plan:** 261/261 passing

## Accomplishments

- TagFilterRow ships the URL-as-state filter mechanic with zero client JS — chips are plain `<a>` elements, the server reads `searchParams.tag`, full server navigations on click, back-button + reload restore the exact filter natively.
- ARIA dual-attribute pattern locked: active chip carries both `aria-pressed="true"` (toggle semantic, per UI-SPEC) AND `aria-current="true"` (generic current-in-set, per W3C). Inactive chips: `aria-pressed="false"` and no `aria-current`.
- Pitfall 7 closed: count badge uses `text-current` so it inherits the chip parent's foreground across state changes. The badge stays visible on the amber active chip (where the parent shifts to `--color-text-on-accent`).
- Pitfall 9 closed: active-chip clear-href and clear-filter link href are both the literal `/projects` — no trailing slash, no fragment. Canonical URL alignment for back-button restoration.
- EmptyFilterState ships the locked copy verbatim with U+2014 em-dash and U+2192 arrow; tag value rendered inside `<span class="font-mono lowercase">`; clear link is a single `<a href="/projects">`. Banned-word lock asserts no promo language slipped in.
- TierSeparator accepts optional `id` prop for aria-labelledby linkage from the parent section (Pitfall 6 lock). Omitting `id` leaves the `<p>` without an id attribute (no empty string); label text always renders.
- Pitfall 11 lock holds by construction: TAGS does not contain `'hero'` or `'secondary'`, so the eyebrow labels (TierSeparator) and filter chip labels (TagFilterRow) are disjoint by typing. Defensive test asserts no chip text matches either eyebrow word.

## Task Commits

Each task was committed atomically:

1. **Task 04-03-01: TierSeparator + EmptyFilterState** — `a74c5cf` (feat)
2. **Task 04-03-02 (RED): failing 13-case spec for TagFilterRow** — `ceb77ab` (test)
3. **Task 04-03-02 (GREEN): TagFilterRow implementation** — `a248ce9` (feat)

_TDD split applied to Task 2 (RED → GREEN); Task 1 used single-commit-per-component (acceptable per plan)._

## Files Created/Modified

- `components/projects/tier-separator.tsx` — RSC hairline + mono lowercase label with optional id prop
- `components/projects/empty-filter-state.tsx` — RSC inline zero-result message with locked copy
- `components/projects/tag-filter-row.tsx` — RSC URL-synced filter chip row + conditional clear-filter link
- `tests/projects/tier-separator.test.tsx` — 4 cases
- `tests/projects/empty-filter-state.test.tsx` — 6 cases
- `tests/projects/tag-filter-row.test.tsx` — 13 cases

## Decisions Made

- **ARIA dual-attribute on active chip** — chose to carry both `aria-pressed` AND `aria-current="true"` rather than picking one. Rationale: `aria-pressed` matches the visual treatment (chip looks pressed when active); `aria-current="true"` places it in the W3C generic "current item in set of links" register expected inside `<nav>`. Both are validly composable on an `<a>`.
- **Optional id-pass-through on TierSeparator** (`id?: string`) — explicit Pitfall 6 fix. The page composer in Plan 04 will pass `id={`${tierName}-tier-eyebrow`}` matching the section's `aria-labelledby`. Omitting id renders the `<p>` without the attribute (clean fallback for any consumer that doesn't need the linkage).
- **Comment-stripped source-grep for forbidden client APIs** — naive `expect(src).not.toMatch(/useSearchParams/)` false-positives on the RSC documentation comment. The test now strips block + line comments before matching, so the docstring can intentionally name absent APIs (which is good documentation) without breaking the lock.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Source-grep test false-positive on RSC docstring**
- **Found during:** Task 04-03-02 (GREEN — TagFilterRow implementation)
- **Issue:** The "no client directives" test ran `expect(src).not.toMatch(/['"]use client['"]/)` and `expect(src).not.toMatch(/useSearchParams/)`. Both matched the component's header comment, which intentionally documents the RSC contract ("NO `'use client'`, NO useSearchParams"). The implementation was correct; the test regex was too broad.
- **Fix:** Updated the test to (a) tighten the `'use client'` match to a directive-shaped line (`^\s*['"]use client['"];?\s*$/m`) and (b) strip line + block comments from the source before running the remaining identifier-grep patterns. Documentation comments now coexist with the source-grep lock.
- **Files modified:** `tests/projects/tag-filter-row.test.tsx`
- **Verification:** 13/13 TagFilterRow tests green; the original lock intent (no actual `'use client'` directive, no real `useSearchParams`/`useRouter` calls, no `next/link` import) is preserved.
- **Committed in:** `a248ce9` (Task 2 GREEN commit; the test fix shipped alongside the implementation).

---

**Total deviations:** 1 auto-fixed (1 bug — test regex)
**Impact on plan:** Trivial. The implementation matched the plan verbatim from RESEARCH § Example 2. The deviation was solely a test-side correction so that intentional documentation didn't trigger a false-positive on the forbidden-API lock.

## Issues Encountered

None during planned work. The single test-regex deviation is documented above.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

**Plan 04-04 (the `/projects` page route) is unblocked.** All four primitives it needs are now in place:

| Primitive | Source | Role on /projects |
|-----------|--------|-------------------|
| `<TagFilterRow>` | this plan | URL-synced filter chip row above the card list |
| `<EmptyFilterState>` | this plan | Renders in lieu of tier sections when filter yields zero matches |
| `<TierSeparator>` | this plan | Marks the hero→secondary tier transition mid-page |
| `<ProjectCardSecondary>` | Plan 04-01 | Card variant rendered for ALL projects on the index page (hero + secondary alike) |

Page composition from UI-SPEC § Page Composition Case A:
```
<TagFilterRow tags={getAllTags()} activeTag={searchParams.tag} />
{activeTag && filtered.length === 0
  ? <EmptyFilterState tag={activeTag} />
  : (
    <section aria-labelledby="hero-tier-eyebrow">
      <TierSeparator label="hero" id="hero-tier-eyebrow" />
      {/* hero cards via ProjectCardSecondary */}
    </section>
    <section aria-labelledby="secondary-tier-eyebrow">
      <TierSeparator label="secondary" id="secondary-tier-eyebrow" />
      {/* secondary cards via ProjectCardSecondary */}
    </section>
  )}
```

Concerns for the page route (notes for Plan 04-04, not blockers here):
- `searchParams.tag` is a Promise in Next 16 (Pitfall 1) — await it before narrowing.
- Validate `searchParams.tag` against `TAGS` (string|string[] narrow) before passing to `<TagFilterRow activeTag>` and `getProjectsByTag()`; invalid → no filter, no chip active (degrade silently).
- Conditional render of `<TierSeparator>` when its tier has cards both above and below (visibility rule); EmptyFilterState replaces both tier sections entirely.

## Self-Check: PASSED

**Created files verified on disk:**
- `components/projects/tier-separator.tsx` — FOUND
- `components/projects/empty-filter-state.tsx` — FOUND
- `components/projects/tag-filter-row.tsx` — FOUND
- `tests/projects/tier-separator.test.tsx` — FOUND
- `tests/projects/empty-filter-state.test.tsx` — FOUND
- `tests/projects/tag-filter-row.test.tsx` — FOUND

**Commits verified in git log:**
- `a74c5cf` — FOUND (Task 1: TierSeparator + EmptyFilterState)
- `ceb77ab` — FOUND (Task 2 RED: TagFilterRow spec)
- `a248ce9` — FOUND (Task 2 GREEN: TagFilterRow impl)

**Cross-cutting invariant verified:** `grep -rl "^['\"]use client['\"]" components/projects/` returns only `next-project-title.tsx` (Phase 3 island). No new client directives added by this plan.

**Pitfall locks verified via source-grep:**
- Pitfall 7: `text-current` present on count badge — PASS
- Pitfall 9: literal `/projects` href (no trailing slash, no fragment) — PASS
- Pitfall 11: TAGS in lib/tags.ts does not contain `'hero'` or `'secondary'` — PASS by construction

**Tests:** 23/23 new (TierSeparator 4 + EmptyFilterState 6 + TagFilterRow 13); 261/261 full suite green.
**Typecheck:** `pnpm typecheck` exit 0.

---
*Phase: 04-home-+-projects-index*
*Completed: 2026-05-16*
