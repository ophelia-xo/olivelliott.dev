---
phase: 03-project-detail-template
verified: 2026-05-15T22:15:00Z
status: passed
score: 7/7 must-haves verified
deferred_items:
  - id: DEFER-01
    summary: "Tailwind v4 scans .planning/ docs for class names — emits 2 benign CSS warnings on build"
    resolution: "Add @source not ../.planning/** to app/globals.css; tracked in deferred-items.md"
    blocking: false
  - id: DEFER-02
    summary: "scripts/generate-og-default.ts persists on disk; was documented as deleted post-run in 03-00 SUMMARY"
    resolution: "Delete file or add scripts/ to .gitignore in a future cleanup plan"
    blocking: false
human_verification:
  - test: "Visual hero treatment matches UI-SPEC Hero Variant B"
    expected: "Text-only single-column layout at /projects/myco; no image; H1 at display ramp; meta row visible"
    why_human: "Layout and typography aesthetic cannot be asserted by grep or RTL"
  - test: "Vesper syntax highlighting renders correctly in code blocks"
    expected: "Token spans use Vesper palette; background is --color-surface-2 (painted by .prose pre, not Shiki)"
    why_human: "Visual theme correctness cannot be verified programmatically"
  - test: "Heading anchor # reveals on hover and focus only"
    expected: "# glyph visible on mouse hover and keyboard focus of each H2; opacity transition works; reduced-motion shows it always"
    why_human: "CSS :hover/:focus state not reliably testable in jsdom"
  - test: "NextProjectBlock hover animation fires correctly"
    expected: "whileHover translateX(4px) fires on desktop; no animation with prefers-reduced-motion: reduce"
    why_human: "motion/react is mocked via Proxy in tests; reduced-motion media-query behavior requires OS-level toggle"
  - test: "OG image /og-default.png serves at 1200x630"
    expected: "curl -I /og-default.png returns 200 with correct Content-Length (16696 bytes)"
    why_human: "Static asset serving requires a running server; jsdom cannot test HTTP responses"
---

# Phase 3: Project Detail Template — Verification Report

**Phase Goal:** A visitor can read the Myco case study at `/projects/myco` as a Problem → Approach → Outcome narrative with a hero, rich MDX components, and a clear path to the next project — validating the hardest page end-to-end before scaling to other projects.

**Verified:** 2026-05-15T22:15:00Z
**Status:** PASSED
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Visitor can reach `/projects/myco` as a statically generated page | VERIFIED | `dynamicParams = false` + `generateStaticParams` in `app/(site)/projects/[slug]/page.tsx`; `.next/server/app/projects/myco.html` exists in build output |
| 2 | Page renders Myco MDX body unmodified with Problem → Approach → Outcome H2 structure | VERIFIED | Built HTML contains `id="problem"`, `id="approach"`, `id="outcome"` from rehype-slug; myco.mdx has all three sections |
| 3 | Rich MDX components (Figure, Gallery, Callout) are registered and available | VERIFIED | `mdx-components.tsx` registers all three via `useMDXComponents()`; 13 RTL cases in `tests/mdx/components.test.tsx` green |
| 4 | Hero treatment renders (text-only Variant B for Myco; image Variant A for real artwork) | VERIFIED | `ProjectHero` branches on `isPlaceholderHero(hero.src)`; Myco hero src is `/images/projects/myco/hero-placeholder.png` — Variant B confirmed; 8 RTL cases in `tests/projects/project-hero.test.tsx` green |
| 5 | Page ends with wayfinding to the next project | VERIFIED | Built HTML contains `all projects →` and `Browse all projects` (single-project corpus variant); `NextProjectBlock` + `getNextProject` wired; 6 RTL cases in `tests/projects/next-project-block.test.tsx` green |
| 6 | Private projects display "code private" label with no repo link | VERIFIED | `ProjectMeta` gates on `visibility === 'private'`; defensive test (stale repoUrl with private visibility still suppresses anchor) in `tests/projects/project-meta.test.tsx`; integration test in `tests/projects/page.test.tsx` |
| 7 | Per-route metadata (title, description, OG image, canonical) is present | VERIFIED | Built HTML: `<title>Myco · olivelliott.dev</title>`, OG image `https://olivelliott.dev/og-default.png` (placeholder fallback correct), OG description from frontmatter `description` field, canonical `/projects/myco`; 7 metadata test cases green |

**Score:** 7/7 truths verified

---

### Required Artifacts

| Artifact | Provides | Exists | Substantive | Wired | Status |
|----------|----------|--------|-------------|-------|--------|
| `app/(site)/projects/[slug]/page.tsx` | Static RSC route, generateStaticParams, generateMetadata, page composition | Yes | Yes — 103 lines, full composition | Yes — imports ProjectHero, MDXProse, NextProjectBlock, getNextProject, getProject | VERIFIED |
| `lib/next-project.ts` | getNextProject algorithm (top-overlap, cyclic, null) | Yes | Yes — 4-branch algorithm, 25 lines | Yes — imported in page.tsx | VERIFIED |
| `lib/hero-fallback.ts` | isPlaceholderHero regex helper | Yes | Yes — regex with positive/negative coverage | Yes — imported in ProjectHero and page.tsx | VERIFIED |
| `components/projects/project-hero.tsx` | Hero block with Variant A/B branching | Yes | Yes — full variant branching, Image wiring | Yes — imported in page.tsx | VERIFIED |
| `components/projects/project-meta.tsx` | Year + tag chips + privacy-gated repo label | Yes | Yes — visibility-gated branch, defensive against stale repoUrl | Yes — composed inside ProjectHero | VERIFIED |
| `components/projects/tag-chip-row.tsx` | Tag chip links to /projects?tag={tag} | Yes | Yes — fragment return, chip links | Yes — imported in ProjectMeta | VERIFIED |
| `components/projects/next-project-block.tsx` | Next-project nav with multi/single-project variants | Yes | Yes — both nav variants, eyebrow + title + tagline | Yes — imported in page.tsx | VERIFIED |
| `components/projects/next-project-title.tsx` | Client island for whileHover translateX motion | Yes | Yes — `'use client'`, `m.h2`, whileHover | Yes — imported in NextProjectBlock | VERIFIED |
| `components/mdx/prose.tsx` | MDXProse wrapper (.prose scope, 65ch measure) | Yes | Yes — applies `prose mx-auto max-w-[65ch] mt-12 md:mt-16` | Yes — imported in page.tsx wrapping MDXBody | VERIFIED |
| `components/mdx/figure.tsx` | Figure MDX component (next/image + caption + wide bleed) | Yes | Yes — next/image, optional caption, wide opt-in | Yes — registered in mdx-components.tsx | VERIFIED |
| `components/mdx/gallery.tsx` | Gallery MDX component (2/3-up grid, per-item figure) | Yes | Yes — grid with 2/3-up, per-item next/image | Yes — registered in mdx-components.tsx | VERIFIED |
| `components/mdx/callout.tsx` | Callout MDX component (note/warn/quote variants) | Yes | Yes — VARIANT_BORDER record, quote italic, title prop | Yes — registered in mdx-components.tsx | VERIFIED |
| `mdx-components.tsx` | @next/mdx global component registration | Yes | Yes — imports + registers Figure/Gallery/Callout | Yes — picked up globally by @next/mdx | VERIFIED |
| `next.config.ts` | rehype-slug → rehype-autolink-headings → rehype-pretty-code chain | Yes | Yes — correct Turbopack-safe string/tuple form, vesper theme, keepBackground:false | Yes — wired into withMDX | VERIFIED |
| `styles/tokens.css` | Phase 3 type tokens (--text-h2, --text-h3, --font-weight-semibold) | Yes | Yes — 5 tokens added at lines 60–64 | Yes — consumed by .prose CSS | VERIFIED |
| `app/globals.css` | .prose CSS class with full typography rhythm | Yes | Yes — ~120 lines covering h2/h3/p/a/code/pre/anchor/lists/rehype-pretty-code selectors | Yes — applied via MDXProse className | VERIFIED |
| `public/og-default.png` | OG fallback image (1200×630, 16696 bytes) | Yes | Yes — 16696 bytes, real PNG | Yes — referenced in generateMetadata OG fallback chain | VERIFIED |
| `content/projects/myco.mdx` | Myco case study with Problem/Approach/Outcome H2s | Yes | Yes — 902 words, 3 H2 sections, full frontmatter | Yes — dynamically imported in page route | VERIFIED |

---

### Key Link Verification

| From | To | Via | Status | Evidence |
|------|----|-----|--------|----------|
| `page.tsx` | `ProjectHero` | import + JSX props | WIRED | Direct import line 17; JSX at line 87–95 with all required props |
| `page.tsx` | `MDXProse` | import + wrapping MDXBody | WIRED | Import line 15; JSX lines 96–98: `<MDXProse><MDXBody /></MDXProse>` |
| `page.tsx` | `NextProjectBlock` | import + next prop | WIRED | Import line 16; JSX line 99: `<NextProjectBlock next={next} />` |
| `page.tsx` | `getNextProject` | import + call | WIRED | Import line 19; `const next = getNextProject(slug)` line 76 |
| `page.tsx` | `isPlaceholderHero` | import + OG fallback chain | WIRED | Import line 18; used in `generateMetadata` lines 40–43 |
| `ProjectHero` | `isPlaceholderHero` | import + branch | WIRED | Import from `@/lib/hero-fallback`; `const isText = isPlaceholderHero(hero.src)` |
| `ProjectHero` | `ProjectMeta` | import + compose | WIRED | Import from `./project-meta`; rendered in both Variant A and B branches |
| `ProjectMeta` | `TagChipRow` | import + tags prop | WIRED | Import from `./tag-chip-row`; `<TagChipRow tags={tags} />` |
| `NextProjectBlock` | `NextProjectTitle` | import + children | WIRED | Import from `./next-project-title`; composed with `className` + text children |
| `mdx-components.tsx` | Figure/Gallery/Callout | useMDXComponents return | WIRED | All three imported and returned in the components map; registration.test.ts runtime equality check confirms identity |
| `next.config.ts` | rehype chain | withMDX options.rehypePlugins | WIRED | Array: `['rehype-slug', ['rehype-autolink-headings', opts], ['rehype-pretty-code', opts]]`; correct order |
| `generateMetadata` | `/og-default.png` | fallback chain | WIRED | OG precedence: `ogImage ?? (!isPlaceholderHero(hero.src) ? hero.src : '/og-default.png')`; built HTML confirms `/og-default.png` served for Myco |

---

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|--------------|--------|--------------------|--------|
| `page.tsx` (ProjectHero) | `project` | `getProject(slug)` from `lib/projects.ts` — reads `content/projects/*.mdx` via `lib/content.ts` gray-matter | Yes — actual MDX frontmatter parsed at build time | FLOWING |
| `page.tsx` (MDXBody) | MDX content | `await import(\`@/content/projects/${slug}.mdx\`)` — Next.js build-time MDX compilation | Yes — myco.mdx compiled to RSC component with real content | FLOWING |
| `page.tsx` (NextProjectBlock) | `next` | `getNextProject(slug)` → `getRelatedProjects` or cyclic via `getAll()` | Yes — single-project corpus returns null; block renders "all projects" variant correctly | FLOWING |
| `generateMetadata` | OG image URL | `project.ogImage` → `project.hero.src` (if not placeholder) → `/og-default.png` | Yes — built HTML confirms correct fallback to `/og-default.png` for Myco | FLOWING |

---

### Behavioral Spot-Checks

| Behavior | Command / Check | Result | Status |
|----------|-----------------|--------|--------|
| Static HTML emitted for /projects/myco | `ls .next/server/app/projects/myco.html` | File present (myco.html, myco.meta, myco.rsc, myco.segments) | PASS |
| H2 anchors Problem/Approach/Outcome in built HTML | `grep id="problem"\|id="approach"\|id="outcome"` on myco.html | All 3 IDs found | PASS |
| Wayfinding strings in built HTML | `grep 'all projects →\|Browse all projects'` on myco.html | Both present (single-project corpus → "all projects" variant) | PASS |
| Title tag correct | `grep '<title>Myco · olivelliott.dev</title>'` on myco.html | Present | PASS |
| OG image fallback to og-default.png | `grep 'og:image' meta tags` in myco.html | `content="https://olivelliott.dev/og-default.png"` — correct placeholder fallback | PASS |
| Article wrapper in page body | `grep '<article>'` in myco.html | Present | PASS |
| `pnpm vitest run --reporter=dot` | Full test suite | 207/207 tests across 26 files green | PASS |
| `pnpm typecheck` | `tsc --noEmit` | Exit 0, no errors | PASS |
| `pnpm build` | Next.js production build | Exit 0; 2 benign Tailwind CSS warnings from .planning/ docs (DEFER-01; non-blocking) | PASS |

---

### Requirements Coverage

| Requirement | Description | Plan | Evidence | Status |
|-------------|-------------|------|----------|--------|
| PRJ-01 | `/projects/[slug]` renders statically via `generateStaticParams` with `dynamicParams = false` | 03-03 | `export const dynamicParams = false`; `generateStaticParams()` calls `getAll().map(p => ({slug: p.slug}))`; 3 cases in `tests/projects/static-params.test.ts` | SATISFIED |
| PRJ-02 | MDX renders with custom components for gallery, figure, callout, and code block (Shiki) | 03-00, 03-01 | Figure/Gallery/Callout registered in `mdx-components.tsx`; rehype-pretty-code with vesper theme in `next.config.ts`; 13 RTL component cases + 7 pipeline source-assertion cases | SATISFIED |
| PRJ-03 | Project page follows Problem → Approach → Outcome structure (800–1500 words) | 03-03 (via Phase 2) | `content/projects/myco.mdx` has three `## Problem`, `## Approach`, `## Outcome` H2 sections; ~902 words; built HTML confirms H2 ids; content-load.test.ts asserts H2 anchors | SATISFIED |
| PRJ-04 | Project page has a hero treatment (title, year, tags, hero image or deliberate text-only) | 03-00, 03-02 | `ProjectHero` Variant A/B branching via `isPlaceholderHero`; 7 hero-fallback tests + 8 project-hero RTL cases; Myco renders Variant B (text-only) correctly | SATISFIED |
| PRJ-05 | Project page ends with "next project" navigation link | 03-03 | `NextProjectBlock` + `getNextProject`; 5 algorithm cases + 6 RTL block cases; built HTML shows "all projects →" / "Browse all projects" (single-project corpus variant) | SATISFIED |
| PRJ-06 | Private projects display visible "code private" tag in place of repo link | 03-02, 03-03 | `ProjectMeta` gates on `visibility === 'private'`; THREE independent signals: (1) "code private" span in --color-text-tertiary, (2) zero repo anchors, (3) "code-private" tag chip; defensive test with stale repoUrl; integration test in page.test.tsx case 3 | SATISFIED |
| PRJ-07 | Per-route metadata with title, description, OG image | 03-00, 03-03 | `generateMetadata` returns 5-element Metadata shape; OG fallback chain (ogImage → non-placeholder hero → /og-default.png); Twitter `summary_large_image`; canonical; 7 cases in `tests/projects/page-metadata.test.ts`; built HTML confirms all meta tags | SATISFIED |

All 7 PRJ-XX requirements are satisfied in production source code with automated test coverage and confirmed in the static build output.

---

### Anti-Patterns Found

| File | Pattern | Severity | Impact |
|------|---------|----------|--------|
| `scripts/generate-og-default.ts` | Stale script persists on disk; SUMMARY documented it as deleted post-run (DEFER-02) | Info | No build/test/runtime impact; untracked file; future cleanup plan should delete |
| `.planning/**` (docs) | Literal `bg-[color:var(--color-...)]` placeholder in SUMMARY docs causes 2 Tailwind CSS build warnings (DEFER-01) | Warning | Build still exits 0; CSS for real tokens is unaffected; no runtime impact |

No blockers. No stub implementations. No hardcoded empty arrays/objects flowing to rendered output. No TODO/FIXME/placeholder comments in shipped source files.

---

### Human Verification Required

Five items require a running browser session. None are blockers for phase advancement — all relate to visual rendering and motion behavior that cannot be verified programmatically.

#### 1. Visual Hero Treatment (Variant B)

**Test:** `pnpm dev` → visit `/projects/myco`, compare against UI-SPEC Hero Variant B
**Expected:** Text-only single column; H1 at display ramp; tagline paragraph; meta row (year, tag chips, repo link) below; no image element anywhere in the hero
**Why human:** CSS layout and typographic sizing are not asserted in RTL tests

#### 2. Vesper Code Block Rendering

**Test:** `pnpm build && pnpm start` → load `/projects/myco`, inspect any `<pre>` element in browser DevTools
**Expected:** Token `<span>` elements use Vesper palette colors; `<pre>` background is `--color-surface-2` (not Shiki default); filename label bar appears above code blocks that use `title="..."` metastring
**Why human:** Visual theme correctness cannot be verified by source-grep or RTL

#### 3. Heading Anchor Hover/Focus Behavior

**Test:** `pnpm dev` → tab through H2 headings (Problem, Approach, Outcome) and hover each with mouse
**Expected:** `#` glyph appears (opacity transitions from 0 to 1) on hover; same on keyboard focus; with Reduce Motion ON, `#` is always visible (opacity: 1 per reduced-motion override in .prose)
**Why human:** CSS `:hover`/`:focus` state cannot be reliably asserted in jsdom; `prefers-reduced-motion` requires OS-level toggle

#### 4. NextProjectBlock Motion Animation

**Test:** `pnpm dev` → scroll to bottom of `/projects/myco` → hover the "Browse all projects" title
**Expected:** Title shifts right by 4px (translateX) on hover; no animation with Reduce Motion ON
**Why human:** `motion/react` is mocked via Proxy in tests; actual animation requires a real browser with MotionProvider running

#### 5. OG Image Availability

**Test:** `curl -I http://localhost:3000/og-default.png` (with `pnpm start` running)
**Expected:** HTTP 200, `Content-Type: image/png`, `Content-Length: 16696`
**Why human:** Static asset HTTP serving requires a running Next.js server; the file's presence on disk (16696 bytes) is confirmed programmatically

---

## Deferred Items (Non-Blocking)

These items are tracked in `deferred-items.md` and should be addressed in a future cleanup plan. They do not block phase advancement or page functionality.

| ID | Summary | Resolution Path |
|----|---------|-----------------|
| DEFER-01 | Tailwind v4 scans `.planning/` docs and emits 2 CSS build warnings for literal `--color-...` placeholder text | Add `@source not "../.planning/**";` to `app/globals.css` — single-line fix |
| DEFER-02 | `scripts/generate-og-default.ts` persists on disk; 03-00 SUMMARY documented it as deleted post-run | Delete the file or add `scripts/` to `.gitignore` |

---

## Gaps Summary

No gaps. All 7 observable truths are verified. All 18 required artifacts exist, are substantive, and are wired. All 12 key links are confirmed. All 7 PRJ-XX requirements have implementation evidence in production source code and pass automated tests. The build produces the correct static HTML with the expected H2 anchors, wayfinding strings, title, and OG meta tags.

The phase goal is fully achieved: a visitor can read the Myco case study at `/projects/myco` as a Problem → Approach → Outcome narrative with a hero block, rich MDX component infrastructure, and clear wayfinding to the next destination.

Five items are routed to human verification for visual/motion behavior that cannot be asserted programmatically. Two non-blocking deferred items are tracked for future cleanup.

---

_Verified: 2026-05-15T22:15:00Z_
_Verifier: Claude (gsd-verifier)_
