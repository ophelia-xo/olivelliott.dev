---
phase: 04-home-+-projects-index
verified: 2026-05-17T00:30:00Z
status: passed
score: 9/9 must-haves verified
human_verification:
  - test: "Thesis paragraph motion timing"
    expected: "Per-word opacity fade feels editorial, not jarring — words appear sequentially with a subtle stagger"
    why_human: "Motion timing perception cannot be assessed programmatically; requires browser observation"
  - test: "Reduced-motion OS setting disables ThesisParagraph fade"
    expected: "macOS Reduce Motion ON → thesis renders as plain <p> instantly with no fade"
    why_human: "OS-level setting cannot be reliably exercised in jsdom"
  - test: "Card hover/focus visual feel"
    expected: "Tabbing through cards shows 2px accent outline ring; mouse hover shows hairline border lift to text-tertiary and underlined title"
    why_human: "CSS-only interaction — requires browser rendering to evaluate"
  - test: "Active filter chip color contrast"
    expected: "/projects?tag=local-first — accent-filled chip has legible label text (WCAG AA)"
    why_human: "Color contrast in context requires browser rendering"
  - test: "Back-button restores filter state"
    expected: "Navigate / → /projects → /projects?tag=local-first → back → back — URL and UI return to prior state"
    why_human: "Browser history behavior cannot be tested in Vitest + jsdom"
---

# Phase 4: Home + Projects Index Verification Report

**Phase Goal:** A first-time visitor lands on the home page, instantly understands Olive's thesis, sees hero projects rendered with weight, and can drill into `/projects` with a filterable tag chip row that respects URL state.
**Verified:** 2026-05-17T00:30:00Z
**Status:** PASSED
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| #   | Truth                                                                               | Status     | Evidence                                                                                                   |
| --- | ----------------------------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------- |
| 1   | Visitor lands on home and sees wordmark + role frame + thesis from SSR              | ✓ VERIFIED | `app/(site)/page.tsx` composes `<HomeHero>` with WORDMARK/ROLE_FRAME/THESIS constants; `.next/server/app/index.html` contains "olive elliott"; `<h1 id="hero-wordmark">` in HomeHero |
| 2   | Thesis paragraph animates per-word on mount; reduced-motion users see plain text    | ✓ VERIFIED | `thesis-paragraph.tsx`: two-stage `mounted` gate + explicit `useReducedMotion()` short-circuit; 5 tests cover SSR fallback, reduced-motion, motion-permitted segmentation |
| 3   | Hero-tier projects appear as large weighted cards on home                           | ✓ VERIFIED | `ProjectCardHero` RSC: outer `<a>` wrapping H2 title + tagline + CardMeta + outcomes (capped at 3) + image branching; composed in `HomeProjectGrid` via `getHeroProjects()` |
| 4   | Secondary-tier projects appear in a grid below hero; section omitted when empty     | ✓ VERIFIED | `HomeProjectGrid` HOM-03 omission rule: `secondaryProjects.length > 0 &&` guard; no empty `<section>`, no placeholder; 4 RTL tests lock both branches |
| 5   | Home page has no bento grid, no stagger-on-scroll, one earned motion moment only   | ✓ VERIFIED | Source-grep tests (page.test.tsx Tests 8+9, anti-patterns.test.ts Tests 1+2+3) lock: no `whileInView`/`IntersectionObserver`, no `grid-cols-12`/`col-span-2`, exactly 1 `'use client'` (thesis-paragraph.tsx only) |
| 6   | `/projects` lists all projects with tier sections and a working filter chip row     | ✓ VERIFIED | `app/(site)/projects/page.tsx`: `getAllTags()` feeds `<TagFilterRow>`; `getAll()` or `getProjectsByTag(activeTag)` feeds tier sections; 13-case integration test covers 6 resolution branches |
| 7   | Tag filter state is URL-synced (`?tag=...`); invalid tags degrade silently          | ✓ VERIFIED | `searchParams` awaited (Next 16 Promise contract); `rawTag` narrowed against TAGS literal tuple; invalid → `activeTag=undefined` (full list); `notFound()` non-invocation asserted by integration test |
| 8   | Tag chips are keyboard-navigable with visible focus styles                          | ✓ VERIFIED | Chips are `<a>` elements in a `<nav>`; global CSS `:focus-visible` rule in `globals.css` applies `outline: 2px solid var(--color-accent)` to all `<a>` elements; `aria-pressed` + `aria-current="true"` on active chip |
| 9   | Project cards indicate tier (H2 vs H3, image vs compact) and privacy status        | ✓ VERIFIED | `ProjectCardHero` uses H2 + optional image grid; `ProjectCardSecondary` uses H3 + optional "hero" mono prefix; `CardMeta` renders "code private" label for `visibility==='private'`; no repo link on card surfaces ever |

**Score:** 9/9 truths verified

---

### Required Artifacts

| Artifact                                          | Description                                         | Status     | Details                                                                             |
| ------------------------------------------------- | --------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------- |
| `components/home/thesis-paragraph.tsx`            | SSR-safe per-word opacity fade client island        | ✓ VERIFIED | 92 lines; `'use client'`; `useReducedMotion()` + `mounted` gate; `m.span` per word |
| `components/home/home-hero.tsx`                   | RSC: wordmark H1 + role frame + ThesisParagraph     | ✓ VERIFIED | 47 lines; imports ThesisParagraph; passes typography classes down via className     |
| `components/home/home-project-grid.tsx`           | RSC: hairline divider + hero stack + secondary grid | ✓ VERIFIED | 69 lines; HOM-03 omission rule; no motion; no whileInView                          |
| `app/(site)/page.tsx`                             | Home route (Phase 1 placeholder replaced)           | ✓ VERIFIED | 74 lines; composes HomeHero + HomeProjectGrid; per-route metadata; no FadeIn import |
| `components/projects/card-meta.tsx`               | RSC: year + tag spans + privacy label               | ✓ VERIFIED | 52 lines; zero `<a>` elements ever; span chips only                                 |
| `components/projects/project-card-hero.tsx`       | RSC: wide hero card for home                        | ✓ VERIFIED | 74 lines; outer `<a>`; H2; image branching; outcomes capped to 3                    |
| `components/projects/project-card-secondary.tsx`  | RSC: compact card for home secondary + /projects    | ✓ VERIFIED | 43 lines; outer `<a>`; H3; optional `hero` prefix prop                              |
| `components/projects/tag-filter-row.tsx`          | RSC: URL-synced chip row with ARIA                  | ✓ VERIFIED | 77 lines; plain `<a>` chips; `aria-pressed` + `aria-current`; TAG_LABELS text       |
| `components/projects/empty-filter-state.tsx`      | RSC: zero-result message with clear link            | ✓ VERIFIED | 35 lines; locked copy with em-dash + arrow; clear link href `/projects`             |
| `components/projects/tier-separator.tsx`          | RSC: hairline + mono label with id pass-through     | ✓ VERIFIED | 31 lines; optional `id` prop for `aria-labelledby`; label renders unconditionally   |
| `app/(site)/projects/page.tsx`                    | /projects index RSC route                           | ✓ VERIFIED | 123 lines; Promise<searchParams> awaited; TAGS narrowing; tier sections conditional |

---

### Key Link Verification

| From                        | To                              | Via                                   | Status     | Details                                                                      |
| --------------------------- | ------------------------------- | ------------------------------------- | ---------- | ---------------------------------------------------------------------------- |
| `app/(site)/page.tsx`       | `HomeHero` + `HomeProjectGrid`  | import + JSX render                   | ✓ WIRED    | Both imported; WORDMARK/ROLE_FRAME/THESIS constants fed; getAll/getHeroProjects called |
| `HomeHero`                  | `ThesisParagraph`               | import; `text={thesis}` + `className` | ✓ WIRED    | ThesisParagraph imported; thesis string and typography className passed down |
| `HomeProjectGrid`           | `ProjectCardHero`               | import; `heroProjects.map(...)`       | ✓ WIRED    | ProjectCardHero imported; all hero projects mapped; key=slug                 |
| `HomeProjectGrid`           | `ProjectCardSecondary`          | import; `secondaryProjects.map(...)`  | ✓ WIRED    | ProjectCardSecondary imported; secondary projects mapped; omitted when empty |
| `ProjectCardHero`           | `CardMeta`                      | import; `<CardMeta year tags visibility>` | ✓ WIRED | CardMeta composed inside hero card                                           |
| `ProjectCardSecondary`      | `CardMeta`                      | import; `<CardMeta year tags visibility>` | ✓ WIRED | CardMeta composed inside secondary card                                      |
| `app/(site)/projects/page.tsx` | `TagFilterRow`               | import; `<TagFilterRow tags activeTag>` | ✓ WIRED  | getAllTags() feeds tags prop; activeTag narrowed from searchParams            |
| `app/(site)/projects/page.tsx` | `EmptyFilterState`           | import; conditional render            | ✓ WIRED    | Renders when `activeTag && projects.length === 0`                            |
| `app/(site)/projects/page.tsx` | `TierSeparator`              | import; two instances with id         | ✓ WIRED    | `id="hero-tier-eyebrow"` and `id="secondary-tier-eyebrow"` match `aria-labelledby` |
| `app/(site)/projects/page.tsx` | `ProjectCardSecondary`       | import; hero + secondary map          | ✓ WIRED    | `<ProjectCardSecondary hero />` for hero-tier; `<ProjectCardSecondary />` for secondary |

---

### Data-Flow Trace (Level 4)

| Artifact                 | Data Variable      | Source                              | Produces Real Data | Status       |
| ------------------------ | ------------------ | ----------------------------------- | ------------------ | ------------ |
| `app/(site)/page.tsx`    | `heroProjects`     | `getHeroProjects()` → `allProjects` | Yes — MDX content  | ✓ FLOWING    |
| `app/(site)/page.tsx`    | `secondaryProjects`| `getAll().filter(tier=secondary)`   | Yes — MDX content  | ✓ FLOWING    |
| `app/(site)/projects/page.tsx` | `projects`   | `getAll()` or `getProjectsByTag(activeTag)` | Yes — MDX content | ✓ FLOWING |
| `app/(site)/projects/page.tsx` | `allTags`    | `getAllTags()` → `allProjects`      | Yes — derived from MDX | ✓ FLOWING |
| `ThesisParagraph`        | `text` (prop)      | THESIS const in `app/(site)/page.tsx` | Yes (placeholder copy, explicit PLACEHOLDER marker) | ✓ FLOWING |

Note: The THESIS constant is explicitly marked `/* PLACEHOLDER: Phase 7 content pass — Olive to revise this string. */`. This is intentional and documented — the placeholder does not prevent any HOM requirement from being satisfied. The page renders a complete, coherent thesis paragraph today; Phase 7 will replace the exact wording.

---

### Behavioral Spot-Checks

| Behavior                                              | Command / Evidence                                     | Result                              | Status   |
| ----------------------------------------------------- | ------------------------------------------------------ | ----------------------------------- | -------- |
| Test suite 301/301 green                              | `pnpm vitest run --reporter=dot`                       | 301/301 passed, 38 files            | ✓ PASS   |
| TypeScript clean                                      | `pnpm typecheck` (tsc --noEmit)                        | Exit 0, no errors                   | ✓ PASS   |
| Production build succeeds                             | `pnpm build`                                           | Exit 0; 4 routes compiled           | ✓ PASS   |
| Home route prerendered as static HTML                 | Build output: `○ /`; `.next/server/app/index.html` contains "olive elliott" | Confirmed | ✓ PASS   |
| /projects route in build output (dynamic)             | Build output: `ƒ /projects`; `.next/server/app/(site)/projects/page.js` exists | Confirmed | ✓ PASS   |
| All Phase 4 source files exist                        | `anti-patterns.test.ts` readAll() existsSync checks    | 11/11 files present                 | ✓ PASS   |
| Single `'use client'` across Phase 4                  | `anti-patterns.test.ts` Test 3                         | Only `thesis-paragraph.tsx`         | ✓ PASS   |
| No stagger-on-scroll / bento anti-patterns            | `anti-patterns.test.ts` Tests 1+2                      | Zero matches across 11 files        | ✓ PASS   |
| No `useSearchParams`/`useRouter` in Phase 4           | `anti-patterns.test.ts` Test 4                         | Zero matches                        | ✓ PASS   |

---

### Requirements Coverage

| Requirement | Source Plan | Description                                                                 | Status       | Evidence                                                                                          |
| ----------- | ----------- | --------------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------- |
| HOM-01      | 04-02       | Home page hero section with one-sentence thesis                             | ✓ SATISFIED  | `HomeHero` renders single `<h1>` (wordmark) + role frame + `<ThesisParagraph>` with thesis copy  |
| HOM-02      | 04-01, 04-02| Hero-tier projects (Myco, Fathom, Agenda Keeper) with larger cards          | ✓ SATISFIED  | `ProjectCardHero` used in `HomeProjectGrid` for hero-tier; H2 + image grid + outcomes             |
| HOM-03      | 04-01, 04-02| Secondary-tier projects as smaller cards; omitted when empty                | ✓ SATISFIED  | `ProjectCardSecondary` + `secondaryProjects.length > 0 &&` omission guard in `HomeProjectGrid`   |
| HOM-04      | 04-02, 04-04| Not a bento grid; no stagger-on-scroll                                      | ✓ SATISFIED  | Source-grep in page.test.tsx + anti-patterns.test.ts; no `whileInView`/`grid-cols-12` in source  |
| HOM-05      | 04-00, 04-02| Earned restrained motion moment; respects reduced-motion                    | ✓ SATISFIED  | `ThesisParagraph`: `useReducedMotion()` short-circuit + two-stage `mounted` gate; 5 RTL tests     |
| PIX-01      | 04-03, 04-04| `/projects` lists all projects with filterable tag chip row                 | ✓ SATISFIED  | `TagFilterRow` with `getAllTags()` data; tier sections render hero + secondary cards              |
| PIX-02      | 04-03, 04-04| Tag filter URL-synced (`?tag=...`); shareable; back-button works            | ✓ SATISFIED  | Chips are plain `<a>` elements; server reads `searchParams`; no `useSearchParams`/`useRouter`     |
| PIX-03      | 04-03       | Tag chips fully keyboard-navigable with visible focus styles                | ✓ SATISFIED  | Chips are `<a>` in `<nav>`; global CSS `:focus-visible` rule applies 2px accent outline to all `<a>` |
| PIX-04      | 04-01, 04-04| Cards visually indicate hero vs secondary tier and public vs private         | ✓ SATISFIED  | H2 vs H3; image grid vs compact; "hero" mono prefix on /projects; "code private" label via CardMeta |

No orphaned requirements — all 9 Phase 4 requirements (HOM-01..05, PIX-01..04) are claimed by plans and verified in code.

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| ---- | ---- | ------- | -------- | ------ |
| `app/(site)/page.tsx` | 28 | `/* PLACEHOLDER: Phase 7 content pass */` on THESIS const | ℹ️ Info | Intentional and documented. THESIS renders real copy today; Phase 7 replaces the exact wording. Does not prevent any requirement from being satisfied. |
| Build output | — | 2 LightningCSS warnings about `var(--color-...)` / `var(--color-NAME)` arbitrary class fragments | ℹ️ Info | Pre-existing; sourced from Tailwind v4 content scan picking up `.planning/` markdown examples. Not from Phase 4 source files. Logged for Phase 6 perf audit. |

No blocker or warning-level anti-patterns. The THESIS placeholder is the only stub, and it is explicitly marked, documented, and non-blocking per plan design.

---

### Human Verification Required

#### 1. Thesis Motion Timing

**Test:** Run `pnpm dev`, open `/` in a browser, observe the thesis paragraph on first load.
**Expected:** Words appear sequentially with a subtle per-word opacity stagger (delay = wordIndex × 0.03s, duration 0.18s). The animation feels editorial — words "arriving" — not jarring or gimmicky.
**Why human:** Motion timing perception is subjective and cannot be verified in jsdom.

#### 2. Reduced-Motion OS Gate

**Test:** Enable macOS "Reduce Motion" in System Settings → Accessibility → Motion, then reload `/`.
**Expected:** Thesis paragraph renders as a plain `<p>` instantly with no fade animation. Words appear at full opacity immediately.
**Why human:** OS-level `prefers-reduced-motion` setting cannot be reliably exercised in Vitest + jsdom. The code path is unit-tested with a mock; the OS integration requires a real browser with the setting enabled.

#### 3. Card Hover and Focus Interaction

**Test:** `pnpm dev`, open `/`, use Tab to navigate through project cards, then use mouse to hover over cards.
**Expected:** Tab focus shows 2px accent-colored outline ring around the card wrapper `<a>`. Mouse hover changes hairline border to `--color-text-tertiary` and underlines the card title with accent decoration.
**Why human:** CSS-only interaction — requires browser rendering + interaction to evaluate.

#### 4. Active Filter Chip Color Contrast

**Test:** Navigate to `/projects?tag=local-first` in a browser. Inspect the active chip (amber/accent fill).
**Expected:** The chip label text (in `--color-text-on-accent`) is legible against the `--color-accent` background; meets WCAG AA 4.5:1 for normal text. Count badge (using `text-current`) remains visible.
**Why human:** Color contrast in rendered context requires browser rendering; the Phase 6 a11y audit (axe-core / QAL-02) will formally verify this.

#### 5. Back-Button Filter Restoration

**Test:** Browser: navigate to `/` → click a tag chip to reach `/projects?tag=local-first` → press browser Back twice.
**Expected:** Back once → `/projects` (full list, no chip active). Back again → `/` (home). Browser history is intact; no JavaScript router state needed.
**Why human:** Browser history API behavior cannot be tested in Vitest + jsdom. The architecture guarantees this by design (plain `<a>` chips, no `useRouter`), but the guarantee requires a real browser to confirm.

---

## Build Verification

`pnpm build` exit 0. Route manifest:

```
○ /              — Static; .next/server/app/index.html contains "olive elliott"
○ /_not-found    — Static
ƒ /projects      — Dynamic (server-rendered on demand; searchParams is a Request-time API)
● /projects/[slug] — SSG; /projects/myco prerendered
```

The `/projects` route is correctly dynamic (not static) because it reads `searchParams` at request time. This is the expected and correct output per the Next 16 RSC contract. The route is present in the build as a server function at `.next/server/app/(site)/projects/page.js`, with all source components (TagFilterRow, EmptyFilterState, TierSeparator, ProjectCardSecondary, CardMeta) confirmed in the compiled server chunk source maps.

The `.node_modules.broken/` orphan directory (2GB) that stalled previous build attempts was still present at verification time; the build completed successfully anyway in ~1.8s compile time. The APFS deletion pathology documented in Plan 04-04 did not recur during this verification run.

---

## Gaps Summary

No gaps. All 9 requirements are satisfied in shipped code. All 11 Phase 4 source artifacts are substantive, wired, and carry real data. The test suite is 301/301 green. The build produces the expected output. The only open items are 5 human verification tasks that are correctly deferred to browser interaction (motion timing, OS reduced-motion, hover/focus feel, contrast, back-button) — these are "needs human" items by nature, not gaps.

---

_Verified: 2026-05-17T00:30:00Z_
_Verifier: Claude (gsd-verifier)_
