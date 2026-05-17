---
phase: 05-about-+-resume-+-contact
plan: 02
subsystem: ui
tags: [resume, route-group-opt-out, print-css, rsc, a4, page-break, pitfall-1, pitfall-2, pitfall-3, pitfall-8, pitfall-10, tdd, wave-2]

requires:
  - phase: 05-about-+-resume-+-contact
    plan: 01
    provides: content/resume.ts RESUME (typed const, dual-gated) + lib/schemas.ts Resume type — consumed by /resume page and ResumeHeader
  - phase: 01-foundation
    provides: app/(site)/layout.tsx (the layout /resume opts OUT of), styles/tokens.css design tokens
  - phase: 03-project-detail-template
    provides: components/projects/project-meta.tsx (repo-link accent + ↗ glyph pattern mirrored in ResumeEntry)
provides:
  - app/resume/layout.tsx — chromeless route-scoped layout (Pitfall 1 opt-out)
  - app/resume/page.tsx — RSC page composing ResumeHeader + 5 ResumeSections; exports per-route metadata with openGraph.type='profile'
  - app/resume/resume.css — screen-mode overrides + single @media print block (RES-03 print contract for Puppeteer in Wave 4)
  - components/resume/download-pdf-link.tsx — RSC, reused on /resume + footer (Plan 05-04)
  - components/resume/resume-header.tsx — H1 + role/location lines + contact line + DownloadPdfLink (locked mailto subject)
  - components/resume/resume-section.tsx — generic <section aria-labelledby> wrapper with sr-only hideHeading
  - components/resume/resume-entry.tsx — generic title + meta + bullets + optional repo-link
  - 53 new tests (17 + 12 + 16 + 8) — 6 Wave-0 placeholder skips converted to implementations
affects:
  - 05-03-PLAN.md (/about ContactStack reuses the same mailto subject string; same Resume['header'].links shape)
  - 05-04-PLAN.md (footer adds a SECOND DownloadPdfLink instance — same component, different className)
  - 05-05-PLAN.md (Puppeteer pipeline renders the SAME React tree at /resume via emulateMediaType('print') against this resume.css)
  - any future @media print rule: this is the ONLY file in the project that ships an @media print block — Pitfall 8 lock enforced by tests/resume/print-css.test.ts Test 8

tech-stack:
  added: []
  patterns:
    - "Route-group opt-out for chromeless pages (Pitfall 1). /resume lives at app/resume/page.tsx OUTSIDE the (site)/ group; app/resume/layout.tsx returns <>{children}</> (no Nav, no Footer, no MotionProvider). Root app/layout.tsx still wraps the route — the chrome opt-out skips only the middle layer."
    - "Route-scoped CSS via side-effect import in route-specific layout (Pattern 4). app/resume/layout.tsx ships a single `import './resume.css'` line; Next 16 scopes the stylesheet to the route subtree at build time."
    - "Pitfall 8 cross-route leakage lock: every screen-mode CSS rule in resume.css starts with a class selector (.resume / .resume-header / .resume-h2 / .contact-line / .resume-skills / .download-pdf-link). The ONLY html/body/nav/footer selectors live INSIDE the @media print block. Enforced by tests/resume/print-css.test.ts Test 8 (split source on @media print, assert no bare html/body in the pre-block region)."
    - "Pitfall 3 print geometry in CSS, not script: @page { size: A4; margin: 0.5in; } lives in resume.css. Wave 4's Puppeteer pipeline will set preferCSSPageSize: true and omit its own margin option — single source of truth survives."
    - "Pitfall 2 print color fidelity: print-color-adjust: exact + -webkit-print-color-adjust: exact inside @media print so the deliberate tonal contrast (#444 role line, #666 meta, 0.5pt #999 H2 underline) survives the printer driver."
    - "Skip-link target id MUST differ from the site shell's #main (Pitfall 10). /resume ships its own #resume-main + a self-contained skip-link inline at the top of page.tsx — the site SkipLink targeting #main never reaches this route."
    - "Source-grep test pattern reused from tests/home/anti-patterns.test.ts: strip /* block */ AND // line comments before identifier match, so JSDoc breadcrumbs that intentionally name absent APIs ('no use client', 'no motion', 'NO Lucide') do not false-positive on the assertion."

key-files:
  created:
    - app/resume/layout.tsx
    - app/resume/page.tsx
    - app/resume/resume.css
    - components/resume/download-pdf-link.tsx
    - components/resume/resume-header.tsx
    - components/resume/resume-section.tsx
    - components/resume/resume-entry.tsx
  modified:
    - tests/resume/download-pdf-link.test.tsx
    - tests/resume/resume-section.test.tsx
    - tests/resume/resume-entry.test.tsx
    - tests/resume/resume-header.test.tsx
    - tests/resume/resume-page.test.tsx
    - tests/resume/print-css.test.ts

key-decisions:
  - "Pitfall 8 lock implemented by tests/resume/print-css.test.ts Test 8 — splits the comment-stripped CSS source on `@media print {`, takes the prefix region, and asserts no bare html/body rule exists there. Comment-stripped first so the explanatory comment ('html/body selectors here are PERMITTED because they live INSIDE @media print') does not false-positive. The html/body selectors at line 132 are scoped inside @media print and are therefore allowed."
  - "DownloadPdfLink takes an optional className prop and merges via cn(). The /resume usage is plain `<DownloadPdfLink />` (default; the .resume-header CSS rule absolute-positions any child .download-pdf-link top-right). Plan 05-04's footer placement will pass extra layout classes for the inline-with-view-source rendering."
  - "Mailto subject ('hi%20from%20olivelliott.dev') is HARDCODED inside ResumeHeader, NOT a content/resume.ts field. The string is a copywriting decision (UI-SPEC § Copywriting Contract), not data — and it flows to /about ContactStack (Plan 05-03) and footer (Plan 05-04) too. Test 6 of resume-header.test.tsx locks the literal."
  - "ResumeHeader strips the leading https:// from github/linkedin URLs for visible display (URL stays canonical in href; visible label reads as 'github.com/olivelliott'). Mirrors common CV convention and UI-SPEC § /resume document outline."
  - "ResumeEntry's optional `link` prop receives an object `{ href, label }` (NOT just a URL string). The page constructs `{ href: p.link, label: p.link.replace(/^https?:\\/\\//, '') }` from RESUME so visible labels follow the same display rule as the header contact line — single convention across the whole resume."
  - "Page metadata uses openGraph.type='profile' per RESEARCH § Pattern 5 (a resume IS a profile, not a website). Test 15 locks the type so a future refactor to 'website' fails."
  - "Privacy assertion (Test 16) is a NEGATIVE check: no anchor's href contains 'trade-bot' or 'agenda-keeper'. Trade Bot and Agenda Keeper are private projects with no `link` field in content/resume.ts; ResumeEntry skips the anchor when link is undefined. The test catches a future regression where someone wires a link field through for these entries."

requirements-completed: [RES-02, RES-03, RES-05]

duration: 7min
completed: 2026-05-17
---

# Phase 05 Plan 02: /resume route + components + print CSS Summary

**Chromeless /resume route at app/resume (Pitfall 1 opt-out from the (site)/ group) composing 4 RSC components (ResumeHeader, ResumeSection, ResumeEntry, DownloadPdfLink) over the typed RESUME source-of-truth, plus the single @media print contract in app/resume/resume.css that Wave 4's Puppeteer pipeline will render against — 53 new tests covering H1/H2 hierarchy, locked section order, the four pitfall locks (1/2/3/8/10), and the print stylesheet contract.**

## Performance

- **Duration:** 7 min
- **Started:** 2026-05-17T14:35:39Z
- **Completed:** 2026-05-17T14:43:00Z
- **Tasks:** 3 (all TDD: RED + GREEN per task = 6 commits)
- **Files created:** 7 (1 layout + 1 page + 1 stylesheet + 4 components)
- **Files modified:** 6 (Wave-0 test placeholders replaced)
- **LOC shipped:** 528 (244 CSS + 114 page + 49 ResumeHeader + 47 ResumeEntry + 30 DownloadPdfLink + 27 ResumeSection + 17 layout)

## Accomplishments

- **Chromeless /resume route (Pitfall 1).** `app/resume/layout.tsx` returns `<>{children}</>` with a single side-effect import of `./resume.css`. The route lives OUTSIDE `app/(site)/` so it skips Nav/Footer/MotionProvider/SkipLink. Verified: `app/(site)/resume/page.tsx` does NOT exist on disk; rendered output contains no `nav.border-b`, no `<footer>`, no `a[href="#main"]`.
- **Section order LOCKED** (UI-SPEC § /resume document outline): summary → experience → projects → skills → education. Test 3 of resume-page.test.tsx asserts `h2.textContent` matches the array `['summary', 'experience', 'projects', 'skills', 'education']` in exact order.
- **One H1 only** (`olive elliott`), five H2s (first sr-only). Test 2 + Test 3 + Test 4 lock this.
- **Skip-link target #resume-main** (Pitfall 10). Distinct from site shell's `#main`. The site SkipLink never reaches `/resume` because /resume opts out of the layout that renders it.
- **Single @media print block** in `app/resume/resume.css` (244 lines total). The print contract is the SAME contract Wave 4's Puppeteer pipeline will render against via `emulateMediaType('print')` — no diff between browser Cmd+P and PDF output.
- **Pitfall 8 cross-route leakage lock.** Every screen-mode CSS selector starts with a class. The ONLY html/body/nav/footer selectors live INSIDE the @media print block. Test 8 of print-css.test.ts splits the comment-stripped CSS source on `@media print {`, takes the prefix region, and asserts no bare `html {` or `body {` rule lives there.
- **Pitfall 3 print geometry single-source-of-truth.** `@page { size: A4; margin: 0.5in; }` lives in CSS. Wave 4 will set `preferCSSPageSize: true`.
- **Pitfall 2 color fidelity.** `print-color-adjust: exact` + `-webkit-print-color-adjust: exact` inside @media print honors the deliberate #444/#666/#999 tonal contrast against printer-driver defaults.
- **53 new tests passing.** 17 component tests (DownloadPdfLink 4 render + 3 source-grep, ResumeSection 4, ResumeEntry 6) + 12 ResumeHeader tests + 16 page integration tests + 8 print-CSS source-grep tests.
- **6 Wave-0 placeholder `it.skip`s converted** to real implementations (download-pdf-link / resume-section / resume-entry / resume-header / resume-page / print-css).
- **DownloadPdfLink contract proven cross-surface.** Component takes optional `className` prop and merges via `cn()`. /resume usage is plain `<DownloadPdfLink />` (default position via .resume-header CSS rule). Plan 05-04 will pass footer layout classes.

## Task Commits

Each task was TDD-committed atomically (RED → GREEN):

1. **Task 05-02-01: DownloadPdfLink + ResumeSection + ResumeEntry components**
   - RED: `e9d5a9a` test(05-02): RED for DownloadPdfLink + ResumeSection + ResumeEntry — 17 tests
   - GREEN: `a95df5d` feat(05-02): add DownloadPdfLink + ResumeSection + ResumeEntry components + 17 tests

2. **Task 05-02-02: ResumeHeader**
   - RED: `0fab7e6` test(05-02): RED for ResumeHeader — 12 tests
   - GREEN: `596caae` feat(05-02): add ResumeHeader component + 12 tests

3. **Task 05-02-03: /resume route (layout + page + print stylesheet)**
   - RED: `30314b1` test(05-02): RED for /resume route — 16 page tests + 8 print-css tests
   - GREEN: `a67728f` feat(05-02): /resume route — chromeless layout + RSC page + print stylesheet + 24 tests

## Files Created/Modified

**Created:**
- `app/resume/layout.tsx` — 17 lines. Chromeless route-scoped layout. Returns `<>{children}</>`; side-effect imports `./resume.css`.
- `app/resume/page.tsx` — 114 lines. RSC route. Skip-link → `<main id="resume-main">` → `<article class="resume">` composing ResumeHeader + 5 ResumeSections from RESUME in the locked order. Exports per-route metadata (title=`resume`, openGraph.type=`profile`).
- `app/resume/resume.css` — 244 lines. Screen-mode rules (.resume / .resume-header / .resume-h2 / .contact-line / .resume-skills) + single @media print block (@page A4 0.5in, print-color-adjust: exact, page-break-inside: avoid on sections + entries, display:none chrome).
- `components/resume/download-pdf-link.tsx` — 30 lines. RSC. `<a href="/resume.pdf" download class="download-pdf-link …">download.pdf ↓</a>`. Optional className merges via cn().
- `components/resume/resume-header.tsx` — 49 lines. RSC. H1 (display + lowercase + medium + -0.02em) + role line + location line + contact-line `<ul>` (mailto with locked subject + github + linkedin) + DownloadPdfLink.
- `components/resume/resume-section.tsx` — 27 lines. RSC. Generic `<section aria-labelledby>` wrapper. `hideHeading=true` makes the H2 sr-only (document outline preserved).
- `components/resume/resume-entry.tsx` — 47 lines. RSC. Generic title + meta + bullets + optional repo-link (mirrors Phase 3 ProjectMeta accent text + ↗ glyph).

**Modified (Wave-0 placeholders → implementations):**
- `tests/resume/download-pdf-link.test.tsx` — 7 tests (4 render + 3 source-grep)
- `tests/resume/resume-section.test.tsx` — 4 tests
- `tests/resume/resume-entry.test.tsx` — 6 tests
- `tests/resume/resume-header.test.tsx` — 12 tests
- `tests/resume/resume-page.test.tsx` — 16 tests
- `tests/resume/print-css.test.ts` — 8 source-grep tests

## Decisions Made

See `key-decisions:` in the frontmatter. Highlights:

1. **Pitfall 8 lock via comment-stripped split-on-@media-print.** The CSS legitimately contains `html, body, .resume { background: #fff !important; ... }` INSIDE the @media print block — that's permitted by Pitfall 8 (the lock is scoped to screen-mode rules). Test 8 isolates the pre-print region from the comment-stripped source and asserts no bare html/body rule lives there; the in-print rule is explicitly allowed.
2. **Mailto subject hardcoded in ResumeHeader, not in content/resume.ts.** The subject string is a copywriting decision shared across three surfaces (/about, /resume, footer). Putting it in content/resume.ts would split it from the rendering convention; putting it in ResumeHeader keeps the rendering logic next to the copy.
3. **`link` prop on ResumeEntry is `{ href, label }`, not `string`.** The page constructs the label via `p.link.replace(/^https?:\/\//, '')` so visible text follows the same `github.com/olivelliott/myco` convention as the contact-line on the header — single display convention across the whole resume.
4. **openGraph.type='profile'.** Per RESEARCH § Pattern 5 — a resume IS a profile, not a website. Test 15 locks the type.
5. **Privacy verified by negative anchor query.** Test 16 iterates every `<a>` in the rendered page and asserts no `href` contains `trade-bot` or `agenda-keeper`. This catches a future regression where someone wires a `link` field through to a private project in content/resume.ts.

## Deviations from Plan

None — plan executed exactly as written.

The plan's action block specifically called out a known dead-code import (`import { DownloadPdfLink } from '@/components/resume/download-pdf-link'` in app/resume/page.tsx) with instructions to "REMOVE it; the link is rendered transitively by ResumeHeader." I implemented page.tsx without the import from the start, so no removal step was needed.

## Issues Encountered

None. All 17 + 12 + 24 = 53 tests passed on first GREEN. `pnpm typecheck` exited 0 throughout. Full vitest suite advanced from 325 passing / 14 skipped (Plan 05-01 baseline) → 378 passing / 8 skipped — delta is +53 / -6, matching exactly (53 new tests; 6 Wave-0 placeholder skips converted to implementations; the remaining 8 skips are Wave 4 pdf-build/pdf-artifact placeholders unchanged).

## User Setup Required

None — Plan 05-02 is pure HTML rendering + print CSS. The Wave 0 stub at `/public/resume.pdf` (already on disk, valid PDF magic bytes) still satisfies the download link's href. Wave 4 (Plan 05-05) will replace the stub with the real Puppeteer-generated PDF.

**Manual verification gate (canonical for RES-03):** Cmd+P from `/resume` in browser print preview should show:
- A4 paper, 0.5in margins, black-on-white
- H1 at 20pt, H2s at 12pt uppercase mono with 0.5pt #999 underline
- Sections page-break-inside: avoid
- DownloadPdfLink and skip-link hidden
- Links rendered as inherit-color + underline (accent stripped)

This is the canonical RES-03 sign-off; not in the automated test gate because the test environment is jsdom (no print preview).

## Verification Results

```
=== Plan-mandated automated verification ===

pnpm vitest run tests/resume/ --reporter=dot
  → Test Files  8 passed | 2 skipped (10)
  → Tests      77 passed | 2 skipped (79)
  → (2 skipped = pdf-artifact + pdf-build, owned by Wave 4)

pnpm vitest run                        (full suite — no regression)
  → Test Files 46 passed | 8 skipped (54)
  → Tests     378 passed | 8 skipped (386)
  → Baseline (post-05-01): 325 passing / 14 skipped
  → Delta: +53 passing / -6 skipped (matches exactly: 17+12+16+8 new tests; 6 wave-0 skips → implementations)

pnpm typecheck                          (strict mode)
  → exit 0

=== Pitfall 1 lock ===
test ! -f app/\(site\)/resume/page.tsx
  → PASS — forbidden path does not exist

=== Source-grep `'use client'` audit on Plan 05-02 sources ===
grep -c 'use client' app/resume/page.tsx app/resume/layout.tsx components/resume/*.tsx
  app/resume/layout.tsx:0
  app/resume/page.tsx:0
  components/resume/download-pdf-link.tsx:1   ← comment text only (line 4: "// no 'use client', no motion, no Lucide.")
  components/resume/resume-header.tsx:0
  components/resume/resume-section.tsx:0
  components/resume/resume-entry.tsx:0
  → No actual 'use client' directives. The component-level source-grep tests
    (download-pdf-link.test.tsx Test 5, resume-header.test.tsx Test 12,
     resume-page.test.tsx Test 14) use the regex /^\s*['"]use client['"];?\s*$/m
     which only matches a real directive line, never a comment.

=== Pitfall 2 + 3 + 8 locks ===
print-css.test.ts Test 3 — @page size: A4 + margin: 0.5in     → PASS
print-css.test.ts Test 4 — print-color-adjust: exact          → PASS
print-css.test.ts Test 8 — no bare html/body outside @media   → PASS
```

## Pitfall lock confirmation matrix

| Pitfall | What it guards | Lock location | Status |
|---|---|---|---|
| 1 | /resume MUST opt out of site chrome | `app/resume/` (not `app/(site)/resume/`) + `app/resume/layout.tsx` returns fragment | LOCKED — verified by file-system check + resume-page.test.tsx Test 7 |
| 2 | Print color fidelity against printer drivers | `print-color-adjust: exact;` + `-webkit-print-color-adjust: exact;` inside @media print | LOCKED — print-css.test.ts Test 4 |
| 3 | Print geometry single source of truth (CSS, not Puppeteer) | `@page { size: A4; margin: 0.5in; }` in resume.css | LOCKED — print-css.test.ts Test 3 |
| 7 | DownloadPdfLink must be RSC (no motion island) | No `'use client'` directive | LOCKED — download-pdf-link.test.tsx Tests 5+6+7 |
| 8 | Screen-mode CSS rules MUST be class-scoped (no cross-route leakage) | All screen selectors start with `.resume*`; html/body only inside @media print | LOCKED — print-css.test.ts Test 8 |
| 10 | /resume skip-link target ≠ site shell #main | `#resume-main` + `<main id="resume-main">` in app/resume/page.tsx | LOCKED — resume-page.test.tsx Test 5 + Test 6 + Test 7 (negative on a[href="#main"]) |

## Phase 6 follow-up flagged

- **`/resume` indexing decision (RESEARCH § Open Q 6):** Phase 6 (SEO/A11y audit) should decide whether `/resume` adds `robots: { index: false }` to its metadata. The argument for: the PDF is the more shareable artifact; indexing the HTML route may dilute search signal. The argument against: a Google search for "olive elliott resume" should land on the HTML, then offer the PDF. Deferred — Phase 5 ships indexable.

## Next Phase Readiness

- **Plan 05-03 (/about + ContactStack)** is unblocked. The mailto subject string `hi%20from%20olivelliott.dev` is now locked in ResumeHeader and tested; ContactStack will reuse the same literal.
- **Plan 05-04 (footer DownloadPdfLink + mailto subject update)** is unblocked. `<DownloadPdfLink className="…" />` is the cross-surface contract; the footer adds the SECOND instance with extra layout classes.
- **Plan 05-05 (Puppeteer PDF pipeline)** is unblocked. The same React tree at `/resume` is what Puppeteer will navigate to with `emulateMediaType('print')`. The print CSS is the contract; Puppeteer will set `preferCSSPageSize: true` and omit its own margin option so the CSS @page rule wins (Pitfall 3).

## Self-Check: PASSED

Files verified present on disk:
- `app/resume/layout.tsx` — FOUND (17 lines)
- `app/resume/page.tsx` — FOUND (114 lines)
- `app/resume/resume.css` — FOUND (244 lines)
- `components/resume/download-pdf-link.tsx` — FOUND (30 lines)
- `components/resume/resume-header.tsx` — FOUND (49 lines)
- `components/resume/resume-section.tsx` — FOUND (27 lines)
- `components/resume/resume-entry.tsx` — FOUND (47 lines)

Pitfall 1 lock verified:
- `app/(site)/resume/page.tsx` — DOES NOT EXIST (correct)

Commits verified in `git log --oneline -10`:
- `e9d5a9a` test(05-02): RED for DownloadPdfLink + ResumeSection + ResumeEntry — FOUND
- `a95df5d` feat(05-02): add DownloadPdfLink + ResumeSection + ResumeEntry — FOUND
- `0fab7e6` test(05-02): RED for ResumeHeader — FOUND
- `596caae` feat(05-02): add ResumeHeader component — FOUND
- `30314b1` test(05-02): RED for /resume route — FOUND
- `a67728f` feat(05-02): /resume route — chromeless layout + RSC page + print stylesheet — FOUND

---
*Phase: 05-about-+-resume-+-contact*
*Plan: 02*
*Completed: 2026-05-17*
