# Deferred Items — Phase 02 Content Pipeline

Items discovered during execution that are out-of-scope for the current plan. Each has a file location and reason for deferral.

## Discovered During Plan 02-00 (Wave 0)

### Pre-existing Biome lint errors in Phase 1 files

Full `pnpm lint` currently fails with 1 error + 23 warnings, all in Phase 1 files (components and CSS). These predate Phase 2 and are NOT caused by any code in this plan. Running `pnpm exec biome lint mdx-components.tsx next.config.ts` on Phase 2-touched files passes cleanly.

**1. `styles/tokens.css:7` — `parse` error: `@theme` directive rejected**
- Issue: Biome CSS parser does not recognize Tailwind v4's `@theme` directive out of the box.
- Cause: Biome CSS parser needs `tailwindDirectives: true` in `biome.json` `css.parser` options.
- Severity: Error (fails `pnpm lint`).
- Scope: Phase 1 tokens file; out of scope for Plan 02-00.

**2. `components/site/nav.tsx` — `useSortedClasses` warnings (×3)**
- Issue: Tailwind classes in `nav.tsx` not sorted per Biome's nursery `useSortedClasses` rule.
- Lines affected: 20, 21, 23.
- Severity: Warning.

**3. `components/site/word-mark.tsx` — `useSortedClasses` warnings (×2)**
- Issue: Tailwind classes in `word-mark.tsx` not sorted.
- Lines affected: 12, 16.
- Severity: Warning.

**4. `components/site/skip-link.tsx` — `useSortedClasses` warning**
- Issue: Tailwind classes in `skip-link.tsx` not sorted.
- Lines affected: 11.
- Severity: Warning.

**5. `components/site/nav-link.tsx` — `useSortedClasses` warning**
- Issue: Conditional-class string with unsorted Tailwind classes.
- Lines affected: 31.
- Severity: Warning.

**Resolution plan:**
- All items above are in Phase 1 components/styles. Options:
  1. Open a small cleanup plan (e.g., `01.1-lint-cleanup/`) to run `pnpm exec biome check --write` on Phase 1 files and tune `biome.json` for Tailwind v4 `@theme` parsing.
  2. Absorb into the Phase 2 verifier gate (before `/gsd:verify-work 02`), since lint is part of the Phase 2 quality bar.
  3. Ignore the `useSortedClasses` nursery rule if Olive prefers hand-sorted classes.

**Impact on Phase 2:** None on Plan 02-00's success criteria (`pnpm build` passes, typecheck passes, files from this plan are lint-clean, all 74 Phase 1 tests still pass). Subsequent Phase 2 plans may need to address lint before the phase-end verifier passes.
