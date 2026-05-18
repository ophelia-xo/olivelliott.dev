---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
current_plan: 4
status: executing
last_updated: "2026-05-18T18:50:48.932Z"
progress:
  total_phases: 7
  completed_phases: 6
  total_plans: 38
  completed_plans: 36
  percent: 95
---

# Project State: olivelliott.dev

## Project Reference

**Name:** olivelliott.dev (Portfolio rebuild)
**Type:** Personal developer portfolio — Next.js App Router, statically rendered, deployed to Vercel
**Core Value:** The site must accurately reflect current work — Myco, Fathom, Agenda Keeper, Trade Bot, Stemz, and Aktiga contributions — in a way that communicates Olive's thesis about building for autonomy and local-first systems, and feels high-touch (typography, motion, detail) rather than templated.
**Current Focus:** Phase 07 — content-pass-+-launch

## Current Position

Phase: 07 (content-pass-+-launch) — EXECUTING
Plan: 4 of 5
Current Plan: 4
Total Plans in Phase: 5
**Milestone:** v1.0 — Portfolio launch on Vercel subdomain
**Phase:** 7
**Plan:** 02-00 complete → next is 02-01
**Status:** Ready to execute
**Progress:** [██████████] 95%

```
[███████░░░] 67%
```

## Performance Metrics

| Metric | Value |
|--------|-------|
| Phases complete | 1/7 |
| v1 requirements mapped | 54/54 |
| v1 requirements validated | 1/54 |
| Plans executed | 8/12 |
| Current phase | 2 (Content Pipeline) |
| Phase 02 P00 | 2 min, 3 tasks, 5 files |
| Phase 02-content-pipeline P01 | 3 min | 2 tasks | 7 files |
| Phase 02-content-pipeline P02 | 6 min | 2 tasks | 5 files |
| Phase 02-content-pipeline P04 | 4min | 2 tasks | 4 files |
| Phase 02-content-pipeline P03 | 1min | 3 tasks | 2 files |
| Phase 03-project-detail-template P00 | 11 min | 4 tasks | 9 files |
| Phase 03-project-detail-template P01 | 3min | 3 tasks | 8 files |
| Phase 03-project-detail-template P02 | 4 min | 3 tasks | 6 files |
| Phase 03-project-detail-template P03 | 68 min | 3 tasks | 11 files |
| Phase 04-home-+-projects-index P00 | 2 min | 2 tasks | 2 files |
| Phase 04-home-+-projects-index P01 | 3 min | 3 tasks | 6 files |
| Phase 04-home-+-projects-index P03 | 5min | 2 tasks | 6 files |
| Phase 04-home-+-projects-index P02 | 5 min | 2 tasks | 6 files |
| Phase 04-home-+-projects-index P04 | 85min | 3 tasks | 4 files |
| Phase 05-about-+-resume-+-contact P00 | 4min | 4 tasks | 18 files |
| Phase 05 P01 | 4min | 2 tasks | 5 files |
| Phase 05-about-+-resume-+-contact P02 | 7min | 3 tasks | 13 files |
| Phase 05-about-+-resume-+-contact P03 | 5min | 3 tasks | 10 files |
| Phase 05-about-+-resume-+-contact P04 | 2min | 1 tasks | 2 files |
| Phase 05 P05 | 8min | 3 tasks | 7 files |
| Phase 06-seo,-og,-a11y-&-performance-audit P00 | 3 min | 3 tasks | 19 files |
| Phase 06-seo,-og,-a11y-&-performance-audit P01 | 2 min | 3 tasks | 4 files |
| Phase 06-seo,-og,-a11y-&-performance-audit P02 | 6 min | 4 tasks | 23 files |
| Phase 06-seo,-og,-a11y-&-performance-audit P03 | 11 min | 3 tasks | 19 files |
| Phase 06-seo,-og,-a11y-&-performance-audit P04 | 5 min | 2 tasks | 2 files |
| Phase 06-seo,-og,-a11y-&-performance-audit P05 | 4 min | 3 tasks | 7 files |
| Phase 07-content-pass-+-launch P00 | 3 min | 2 tasks | 2 files |
| Phase 07-content-pass-+-launch P01 | 3 min | 1 tasks | 1 files |
| Phase 07-content-pass-+-launch P02 | 3h 47m | 2 tasks | 4 files |

## Accumulated Context

### Decisions Made

From `PROJECT.md` Key Decisions:

- Fresh rebuild, not iteration on `portfolio_next` (2023 repo too stale)
- Next.js App Router over Astro (strongest stack, supports interactive demos later)
- Home + project detail pages (not single-page scroll)
- Hero tier = Myco + Fathom + Agenda Keeper
- Private projects surface as case studies with "code private" tag
- Thesis via project tags (no dedicated /thesis page)
- Resume as `/resume` + PDF from single source of truth
- Dark theme only (no light-mode toggle in v1)
- Deploy to Vercel subdomain first (custom domain deferred)
- `/writing` deferred out of v1

From `research/SUMMARY.md`:

- Stack locked: Next.js 16.2 / React 19.2 / Tailwind v4.1 / Motion 12 / Geist / Content Collections / `@next/mdx` / pnpm / Biome / Vercel
- Explicit rejects: Contentlayer (abandoned), `next-mdx-remote` (archived), R3F, Aceternity-style template libs, Lottie, `@react-pdf/renderer`
- Architecture: Content Collections + Zod as SSoT; single `<MotionProvider>` boundary with `LazyMotion` + `reducedMotion="user"`; print-CSS-primary resume with Puppeteer build step
- [Phase 02]: Install remark-frontmatter in Wave 0 (not deferred to Phase 3) so pnpm build smoke-gates MDX infrastructure before schema/loader/content code lands
- [Phase 02]: Register remark-frontmatter via string form 'remark-frontmatter' not function reference — required for Turbopack in Next 16 (GitHub issues #84258, #76739)
- [Phase 02]: gray-matter + remark-frontmatter added as runtime dependencies (not devDependencies) — Next.js resolves them from dependencies during next build
- [Phase 02-content-pipeline]: [Phase 02]: lib/schemas.ts kept separate from lib/content.ts — schema module stays fs-free, allowing type-only imports from any boundary (tests, RSC, transitively client)
- [Phase 02-content-pipeline]: [Phase 02]: Privacy rules enforced via Zod .transform() (not .refine()) so the inferred output type reflects the post-strip shape — consumers cannot see the raw pre-transform object
- [Phase 02-content-pipeline]: [Phase 02]: Private-project test fixture lives under tests/fixtures/projects/ (not content/projects/) — keeps real content Myco-only for Wave 3 and decouples schema tests from authored bodies
- [Phase 02-content-pipeline]: [Phase 02]: biome.json does not enable lint/suspicious/noConsole — copy-paste of RESEARCH.md biome-ignore comments produces dead suppressions. Future plans should verify biome.json before keeping any biome-ignore line.
- [Phase 02-content-pipeline]: Plan 02-02: Installed server-only as runtime dep AND aliased it in vitest.config.ts to a tests/stubs/ empty module — Next resolves the real package in prod builds, Vitest loads the no-op stub. Required because pnpm strict mode hides transitive deps (blocks resolution) AND the real package throws at require-time (blocks Vitest load).
- [Phase 02-content-pipeline]: Plan 02-02: lib/content.ts uses _loadForTests(dir) as an @internal test seam (Option A from RESEARCH.md) — tests point the loader at fs.mkdtempSync temp dirs populated from tests/fixtures/projects/, no node:fs mocking needed. lib/projects.ts uses vi.mock('@/lib/content') + top-level await import for query-helper isolation from the real content directory.
- [Phase 02-content-pipeline]: Plan 02-02: getProject(slug) reads allProjects directly (not getAll()) so archived slugs remain resolvable — consumer pages call notFound() on undefined, not on status==='archived'. Collection-level views (getAll, getAllTags, getProjectsByTag) correctly exclude archived.
- [Phase 02-content-pipeline]: Plan 02-04: Redaction scanner walks filesystem directly (fs.readdirSync + gray-matter), not through lib/content.ts — scanner must survive schema bugs and stay independent of the pipeline it audits. Dynamic describe block gives vacuous pass in Phase 2 (no private projects yet) and auto-converts to per-file assertions when private MDX lands in Phase 7.
- [Phase 02-content-pipeline]: Plan 02-04: Self-test describe block (5 assertions) is the insurance layer — exercises positive detection, case-insensitivity, whole-word boundaries (voyages ≠ voya), isolated tmp-fixture scan, and confirms frontmatter values are NOT scanned. Prevents silent drift where the scanner stops firing without anyone noticing.
- [Phase 02-content-pipeline]: Plan 02-04: BANNED_TERMS source-of-truth split — literal list in tests/fixtures/banned-terms.ts (Object.freeze'd), per-term rationale + review process in .planning/phases/02-content-pipeline/02-REDACTION-REVIEW.md. Checklist doc references the code file path; no duplication, single update path.
- [Phase 02-content-pipeline]: Plan 02-03: Myco repo URL canonicalized to github.com/olivelliott/myco (not olive-elliott/myco) — confirmed at human-verify checkpoint. PLAN.md body used olive-elliott/ as a placeholder; the authored MDX used the correct handle from the start, so no correction was needed on resume.
- [Phase 02-content-pipeline]: Plan 02-03: Hero-tier case-study template locked — Problem → Approach → Outcome H2 anchors (exact strings) with 800–1200 word budget; outcomes bullets descriptive-only (no fabricated metrics). Myco authored at 902 words as the canonical fixture; Phase 3 detail template may assume these three anchors exist on every hero MDX.
- [Phase 03-project-detail-template]: Pinned shiki to ^3.23.0 instead of ^4.x — rehype-pretty-code accepts both, Vesper bundled in both, but 3.x has 6+ months ecosystem soak. Lower drift risk.
- [Phase 03-project-detail-template]: Filename labels in code blocks via title= metastring → [data-rehype-pretty-code-title] CSS selector — corrected the original UI-SPEC reference to {filename=}. RESEARCH Pitfall 1.
- [Phase 03-project-detail-template]: Hand-authored .prose CSS instead of @tailwindcss/typography — typography plugin overrides letter-spacing, weight, and color tokens. Token system is the design contract.
- [Phase 03-project-detail-template]: OG-default PNG generated via SVG-piped-to-sharp (sharp already a runtime dep) — avoided pulling @vercel/og just for a one-shot script. Generation script + meta sidecar deleted post-run; only PNG ships.
- [Phase 03-project-detail-template]: Reduced-motion .prose .anchor opacity:1 always (instead of preserving hover-reveal at 0ms) — preserves the affordance for users who can't trigger hover with a pointer.
- [Phase 03-project-detail-template]: Plan 03-01: Tailwind v4 token references use arbitrary form bg-[color:var(--color-...)] not short-name aliases — tokens.css declares raw CSS custom properties under @theme without registering Tailwind color short-names. Tests assert the arbitrary form. Aligns with Wave 0 hand-authored .prose decision.
- [Phase 03-project-detail-template]: Plan 03-01: Components under components/mdx/ are separate files with named exports only — matches existing components/site/ + components/motion/ conventions. mdx-components.tsx registration is 3 named imports + a 3-key MDXComponents map.
- [Phase 03-project-detail-template]: Plan 03-01: WIDE_BLEED const duplicated across figure/gallery/callout instead of extracted to lib/mdx/bleed.ts — one line, three sites, zero shared module to maintain. Each MDX component file is fully self-contained.
- [Phase 03-project-detail-template]: Plan 03-01: Source-assertion + runtime-equality dual lock for the @next/mdx registration channel — regex catches import deletion or path-rename; runtime expect(components.X).toBe(X) catches stale bindings or aliasing. Pattern reusable for any future MDX-callable additions.
- [Phase 03-project-detail-template]: Plan 03-02: Privacy gate on visibility === 'private', NOT on repoUrl === undefined — schema strips repo before consumers see it, but ProjectMeta is a leaf component that may receive props from non-schema sources (mocks, Storybook, Phase 4 search results). Visibility is the authoritative intent field. Test 6 in project-meta.test.tsx is the regression lock — passes both visibility='private' AND a stale repoUrl, asserts no anchor with that URL renders.
- [Phase 03-project-detail-template]: Plan 03-02: Tag chip text uses Tag value verbatim (lowercase), NOT TAG_LABELS — UI-SPEC explicitly specifies {tag} as chip text. TAG_LABELS reserved for Phase 4 filter chips needing human-facing capitalization. Locked in tests to prevent drift toward the labels map.
- [Phase 03-project-detail-template]: Plan 03-02: TagChipRow returns React fragment (not wrapping div) — chips become direct children of ProjectMeta's flex container so gap-3 applies uniformly across year ↔ chip-1 ↔ ... ↔ repo-link. Wrapping div would create nested flex item disrupting the row rhythm. Test 6 in tag-chip-row.test.tsx locks this.
- [Phase 03-project-detail-template]: Plan 03-02: Privacy rendering has two independent visible signals when private — (1) literal 'code private' label in meta row (--color-text-tertiary, non-interactive), (2) 'code-private' tag chip rendered identically to other chips via TagChipRow. Both must be present; one is the canonical label, the other is the auto-tag flowing through standard chip pipeline. UI-SPEC § Privacy Rendering Contract verification clauses 2 + 3.
- [Phase 03-project-detail-template]: Plan 03-03: Vitest .mdx interception via Vite transform-hook plugin (NOT alias regex). Plan documented Pitfall 12 as alias-to-stub; the alias-regex form mangled the dynamic-import template literal. The transform-hook plugin returns a no-op default for any .mdx id. Per-test vi.doMock can still override the default for targeted MDX assertions. Single edit point in vitest.config.ts.
- [Phase 03-project-detail-template]: Plan 03-03: Tests mock motion/react via Proxy (NOT MotionConfig wrapper). Plan said 'try without provider first; wrap in MotionConfig if it errors' — in jsdom, LazyMotion strict HANGS instead of erroring when m.* is rendered without provider. Proxy that strips motion-only props (whileHover, transition, etc.) and forwards children to the underlying tag is cleaner than mounting a tiny provider in every test, and reusable across tests/projects/next-project-block.test.tsx + tests/projects/page.test.tsx. Motion behavior verified by source-grep + visual sanity pass.
- [Phase 03-project-detail-template]: Plan 03-03: PRJ-06 integration test routes through slug='myco' (only physical .mdx in /content/projects/), not slug='valid-private'. Vite's dynamic-import-helper validates the slug against on-disk files at runtime — fixture-only slugs fail with 'Unknown variable dynamic import'. Test mocks getProject to return private-fixture-shaped project. The privacy contract (zero anchors with repo URL, 'code private' label, code-private chip) is what's asserted; the MDX body is irrelevant and stubbed via mdxShimPlugin.
- [Phase 04-home-+-projects-index]: ThesisParagraph uses two-stage mounted gate (useState(false) + useEffect setMounted) + explicit useReducedMotion() short-circuit — MotionConfig reducedMotion='user' does NOT cover opacity (only transform/layout), so manual gate is required or reduced-motion users get the per-word fade anyway. Locks the SSR-safe shape from RESEARCH Pattern 4.
- [Phase 04-home-+-projects-index]: SSR-fallback assertion uses renderToString from react-dom/server, NOT @testing-library/react render(). Under React 19 + jsdom, RTL render() commits mount effects synchronously inside the render() call, so the returned container reflects POST-mount state. renderToString is the only mechanism that captures actual server-pass HTML. Pattern reusable for any future SSR-shape assertions in this codebase.
- [Phase 04-home-+-projects-index]: Vitest mock for motion/react MUST expose BOTH m AND useReducedMotion in the same module shape — partial mock omitting the hook throws 'useReducedMotion is not a function' at component load (Pitfall 8). Test file uses vi.doMock + vi.resetModules + dynamic await import to swap the hook return per test.
- [Phase 04-home-+-projects-index]: Plan 04-01: Nested-anchor regression lock pattern — every card test asserts container.querySelectorAll('a').length === 1 (wrapper); CardMeta test asserts === 0. Pattern catches accidental TagChipRow import inside cards AND any future interactive child smuggling in an <a>. Reusable for any wrapping-anchor surface.
- [Phase 04-home-+-projects-index]: Plan 04-01: CardMeta is a SIBLING of Phase 3's ProjectMeta, not a refactor — ProjectMeta still composes interactive TagChipRow on detail page; CardMeta is card-only variant whose chips are <span>. Two near-identical files cheaper than chipsInteractive: boolean prop which would leak Pitfall 3 trap into API surface.
- [Phase 04-home-+-projects-index]: Plan 04-01: Hero vs secondary cards split into separate files (not unified behind tier prop) — heading levels differ (H2 vs H3), DOM shapes diverge (no image/outcomes in secondary), prop shapes asymmetric (hero prop only on secondary). Tests stay 1:1, prevents drift, future divergence trivial.
- [Phase 04-home-+-projects-index]: Plan 04-01: Outcome cap (.slice(0,3)) at component boundary, NOT schema — schema permits 5, UI weight tops at 3. Cap is editorial UI concern, schema flexibility preserved. next/image without priority on cards (RESEARCH Open Q #3 — LCP tuning deferred to Phase 6, framework picks LCP image).
- [Phase 04-home-+-projects-index]: Plan 04-03: ARIA dual-attribute on active filter chip — aria-pressed='true' (UI-SPEC toggle semantic) AND aria-current='true' (W3C generic current-in-set). Both, not either, so chips read correctly as toggleable links inside a nav landmark.
- [Phase 04-home-+-projects-index]: Plan 04-03: Count badge color inheritance via Tailwind text-current (Pitfall 7 lock) — drop explicit color on child spans when the parent color shifts via active/inactive class swap. Otherwise the count is invisible on the amber active chip.
- [Phase 04-home-+-projects-index]: Plan 04-03: Source-grep test for forbidden client APIs strips line + block comments BEFORE matching. RSC documentation intentionally names absent APIs ('NO useSearchParams') — a naive grep would false-positive on the docstring. Pattern reusable for any RSC-contract source-grep.
- [Phase 04-home-+-projects-index]: Plan 04-02: Source-grep tests for RSC anti-patterns must strip BOTH /* block */ AND // line comments before identifier match. RSC documentation intentionally names absent APIs in JSDoc (HOM-04 'no whileInView' breadcrumbs, FadeIn historical reference). Naive line-only stripping false-positives. Pattern: src.replace(/\/\*[\s\S]*?\*\//g,'').split('\n').map(l => l.replace(/\/\/.*$/,'')).join('\n'). Reusable across codebase.
- [Phase 04-home-+-projects-index]: Plan 04-02: Per-route metadata pattern locked — home OMITS metadata.title so root layout title.default ('olivelliott.dev') flows through. Declaring title would invoke titleTemplate '%s · olivelliott.dev' and emit 'olivelliott.dev · olivelliott.dev'. Conversely, openGraph.images MUST be declared per-route — root layout omits them, so omitting on page yields no OG image emit. Mirror this on /projects (Plan 04-04) + Phase 5 routes.
- [Phase 04-home-+-projects-index]: Plan 04-02: Typography flows DOWN from composer to slot. HomeHero owns the body/Geist Sans/400/leading-1.6/secondary color/max-w-[55ch] class string and passes via className prop. ThesisParagraph owns ONLY segmentation+motion. Locks role frame + thesis visually to same type stack without import coupling. Reusable pattern for any client-island leaf composed inside an RSC parent.
- [Phase 04-home-+-projects-index]: Plan 04-02: Phase 1 FadeIn placeholder import REMOVED from app/(site)/page.tsx; FadeIn component file NOT deleted (Phase 5 may compose it). JSDoc breadcrumb retained ('Replaces the Phase 1 placeholder (a single FadeIn-wrapped tagline)') — Cleanup Checklist requires the historical context for future readers; source-grep tests strip comments so breadcrumb doesn't false-positive.
- [Phase 04-home-+-projects-index]: Plan 04-04: Next 16 Promise<searchParams> contract honored on /projects route — async page + await + Array.isArray normalization + TAGS.includes narrowing with  cast. Invalid tag values degrade silently (NO notFound, NO redirect) per UI-SPEC's shareable-URL emphasis. Tier-section conditional locks orphan-separator prevention.
- [Phase 04-home-+-projects-index]: Plan 04-04: Cross-cutting source-grep regression net pattern formalized — single tests/home/anti-patterns.test.ts reads ALL Phase 4 sources via node:fs.readFileSync and asserts 8 invariants (HOM-04 + single-client-island + URL-state-server-side + LazyMotion + banned-words + no-icons + no-TagChipRow-in-cards). Comment-stripping before identifier grep (strip /* */ then //) so RSC docstrings can intentionally name absent APIs without false-positives. Reusable: future phases get tests/phase-N/anti-patterns.test.ts by swapping the manifest.
- [Phase 04-home-+-projects-index]: Plan 04-04: ProjectCardSecondary used for ALL projects on /projects index (not ProjectCardHero for hero-tier). Hero distinction via position + 'hero' mono prefix label (hero=true prop). Card weight reserved for the home page; the index trades weight for scanability per UI-SPEC § Page Composition Case A.
- [Phase 05-about-+-resume-+-contact]: Plan 05-00: Installed full puppeteer@25.0.2 (NOT puppeteer-core + chromium-min) per user override of CONTEXT.md. PDF is committed to git so production deploys never invoke the script — serverless 250MB Lambda limit doesn't apply. Chrome auto-downloaded to ~/.cache/puppeteer.
- [Phase 05-about-+-resume-+-contact]: Plan 05-00: Commented postbuild hook pattern — JSON sibling key '// postbuild' with command-string value acts as a self-documenting breadcrumb. Plan 05-05 renames the key to 'postbuild' to activate. Avoids triggering a still-throwing script body during waves 1-4.
- [Phase 05-about-+-resume-+-contact]: Plan 05-00: Wave-0 test placeholder convention — each downstream-plan test file is created upfront with one describe + one it.skip('placeholder — implemented by Plan {NN}'). Vitest collects 16 skipped tests in suite output; the gap is visible without failing CI. Downstream plans extend each file in place.
- [Phase 05]: Plan 05-01: ResumeSchema lives in lib/schemas.ts alongside ProjectFrontmatterSchema (no separate file) — single Zod module, both schemas co-located, type-only imports stay fs-free.
- [Phase 05]: Plan 05-01: content/resume.ts uses Pitfall-12 dual-gate (satisfies Resume + ResumeSchema.parse(data)) — compile-time shape check + module-load runtime check. Build/import fails loudly if either contract drifts.
- [Phase 05]: Plan 05-01: Banned-words contract trumps verbatim source. Myco bullet 'ecosystem' rewritten to 'community' (joins documented 'Passionate' → 'Active in' rewrite). UI-SPEC § Banned-words list is the authority; verbatim RESEARCH data yields when the two conflict.
- [Phase 05-about-+-resume-+-contact]: Plan 05-02: /resume opts out of (site)/ route group via app/resume/ — layout returns <>{children}</>, side-effect imports resume.css. Chromeless route confirmed by absence of nav.border-b/footer/a[href='#main'] in rendered output.
- [Phase 05-about-+-resume-+-contact]: Plan 05-02: Pitfall 8 lock — every screen-mode CSS rule in resume.css starts with a class; html/body selectors live ONLY inside @media print. Enforced by print-css.test.ts Test 8 which splits source on @media print and asserts no bare html/body rule in the pre-block region.
- [Phase 05-about-+-resume-+-contact]: Plan 05-02: Mailto subject 'hi%20from%20olivelliott.dev' (Pitfall 5: %20 not +) is hardcoded inside ResumeHeader, not in content/resume.ts. Same literal will be reused in /about ContactStack (Plan 05-03) and footer (Plan 05-04) — single cross-surface copywriting decision.
- [Phase 05-about-+-resume-+-contact]: Plan 05-02: DownloadPdfLink takes optional className and merges via cn(). /resume usage is plain <DownloadPdfLink /> (default positioning via .resume-header CSS rule absolute top-right). Plan 05-04 will pass footer layout classes for the second instance.
- [Phase 05-about-+-resume-+-contact]: ProjectPillRow is its own component (hand-mirrors Phase 3 chip class string) — NOT a refactor of TagChipRow. Source-grep regression test locks the separation. (Plan 05-03)
- [Phase 05-about-+-resume-+-contact]: Mailto subject locked at hi%20from%20olivelliott.dev (%20 NOT +; RFC 6068). Locked on /about ContactStack; Plan 05-04 must match in footer. (Plan 05-03)
- [Phase 05-about-+-resume-+-contact]: GitHub URL on /about uses canonical olivelliott handle. Phase 1 footer still uses ophelia-x — Plan 05-04 should standardize. (Plan 05-03)
- [Phase 05-about-+-resume-+-contact]: LinkedIn handle is a PLACEHOLDER in ContactStack — flagged for Phase 7 confirmation. (Plan 05-03)
- [Phase 05-about-+-resume-+-contact]: Plan 05-04: Plain <DownloadPdfLink /> in footer — no className override needed. Default class string (p-3, font-mono, inline-flex-friendly) aligns inside the right-slot flex container. The cn()-merge escape hatch on DownloadPdfLink stays reserved for future non-flex placements.
- [Phase 05-about-+-resume-+-contact]: Plan 05-04: Triple lock on the CTC-02 mailto subject — positive grep (exact %20 literal exists exactly once), negative grep (Phase 1 string 'subject=olivelliott.dev' MUST NOT appear), runtime href assertion. A single mutation fails at least two tests; the three locks catch three distinct failure modes.
- [Phase 05-about-+-resume-+-contact]: Plan 05-04: Interpunct span sits between DownloadPdfLink and view-source, NOT between icon row and DownloadPdfLink. Icon-row → text-link transition uses existing gap-6 rhythm; text-link → text-link transition needs the · interpunct (both mono-lowercase, same register).
- [Phase 05]: USER OVERRIDE held: full puppeteer@^25 (not puppeteer-core + chromium-min). Locked by tests 8+9 in pdf-build.test.ts via absent-string assertions.
- [Phase 05]: PHASE_SOURCES (was PHASE4_SOURCES): single cross-phase anti-pattern manifest in tests/home/anti-patterns.test.ts. Future phases extend by appending entries; invariants stay constant.
- [Phase 05]: Fail-fast postbuild hook: tsx scripts/build-resume-pdf.ts runs after every pnpm build; any failure fails the deploy (silent staleness is worse than a failed deploy).
- [Phase 06-seo,-og,-a11y-&-performance-audit]: Plan 06-00: vitest-axe@1.0.0-pre.5 (NOT 0.1.0 stale 2022 line) — prerelease line is actively maintained with matcher-import-path split + Vitest 3 types. RESEARCH § Standard Stack.
- [Phase 06-seo,-og,-a11y-&-performance-audit]: Plan 06-00: @lhci/cli@0.15.1 invoked via pnpm dlx, NOT installed as devDep — lhci is a one-shot Phase 6 deliverable run a handful of times locally, not in CI. Keeps node_modules lean.
- [Phase 06-seo,-og,-a11y-&-performance-audit]: Plan 06-00: lighthouserc.json uses startServerReadyPattern 'Ready in' (Pitfall 8) — Next 16's actual stdout when start server boots. Wrong pattern → lhci hangs at 30s timeout.
- [Phase 06-seo,-og,-a11y-&-performance-audit]: Plan 06-00: Module augmentation lives at tests/types/vitest-axe.d.ts — tsconfig excludes tests/ from tsc --noEmit, but Vitest's loader picks it up at test-load time so toHaveNoViolations() typechecks inside test files. Pattern reusable for any future test-only third-party matcher types.
- [Phase 06-seo,-og,-a11y-&-performance-audit]: Plan 06-00: Wave-0 placeholder convention extends Plan 05-00 verbatim — 1 describe + 1 it.skip per file, plan number encoded in skip message, downstream plans extend in place (no delete + recreate). 12 visible skipped tests = 12 pending plans.
- [Phase 06-seo,-og,-a11y-&-performance-audit]: Favicon: glyph-as-path (not <text>) — browsers don't load Geist for favicons, so hand-authored <path> approximations of o + e glyphs freeze the exact mark across all browsers
- [Phase 06-seo,-og,-a11y-&-performance-audit]: Favicon ICO: manual Node Buffer byte-assembly (ICONDIR + ICONDIRENTRY + sharp-produced PNG buffers) instead of to-ico / sharp-ico dep — zero new packages, 1.5KB output
- [Phase 06-seo,-og,-a11y-&-performance-audit]: Plan 06-02: per-route default-OG siblings (NOT a single root) — 4 sibling files + 1 root + 1 dynamic [slug] + 1 shared lib/og-template.tsx renderer; Node.js runtime everywhere; Pitfall 4 cleanup landed in same plan with absence-lock tests.
- [Phase 06-seo,-og,-a11y-&-performance-audit]: Plan 06-02: source-grep tests strip line + block comments before applying anti-pattern regexes (codebase intentionally names forbidden patterns in comments).
- [Phase 06-seo,-og,-a11y-&-performance-audit]: Plan 06-03: vitest-axe gap-closure fixed 3 real production a11y bugs inline (aria-pressed removal, role=list→ul/li, h2 promotion) rather than deferring — all 5 routes now axe-clean under WCAG 2.1 AA.
- [Phase 06-seo,-og,-a11y-&-performance-audit]: Plan 06-03: TagFilterRow chips use aria-current='true' as sole selection-state attribute (aria-pressed removed — button-only WAI-ARIA 1.2 attribute, forbidden on <a>).
- [Phase 06-seo,-og,-a11y-&-performance-audit]: Plan 06-03: CardMeta/ProjectMeta wrappers are <ul role='list'> with <li role='listitem'> children — satisfies axe aria-required-children while preserving existing [role='list'][aria-label='Project metadata'] querySelector contracts.
- [Phase 06-seo,-og,-a11y-&-performance-audit]: Plan 06-04: QAL-05 codified as 19 named it() blocks in tests/launch-gate/anti-features.test.ts (one per FEATURES.md row, grep mappings verbatim from RESEARCH Pattern 11). Failure messages name the FEATURES.md anti-feature directly — future contributors get a one-step pointer to the rule they violated.
- [Phase 06-seo,-og,-a11y-&-performance-audit]: Plan 06-04: QAL-01 (Lighthouse >= 90) deferred to Phase 7 launch-week by user decision. pnpm lhci needs a real Chrome + spawned production server, more reliable run interactively on Olive's local machine pre-deploy than via Claude. Infrastructure is fully ready (lighthouserc.json wired, pnpm lhci script present, Puppeteer Chromium installed). lighthouse-report.md Status marked DEFERRED with owner + acceptance criteria; REQUIREMENTS.md QAL-01 stays unchecked; Phase 6 VERIFICATION.md surfaces it as a human-verification item.
- [Phase 06-seo,-og,-a11y-&-performance-audit]: Phase 6 (SEO + OG + A11y + Perf audit) complete; 8 of 9 requirements met, QAL-01 Lighthouse deferred to Phase 7 launch-week per Plan 06-04 user decision.
- [Phase 06-seo,-og,-a11y-&-performance-audit]: PHASE_SOURCES manifest extension is append-only across phases; invariants iterate over Object.entries so new entries inherit all locks automatically.
- [Phase 07-content-pass-+-launch]: Plan 07-00: Vercel Analytics + Speed Insights mounted in root app/layout.tsx (not (site)/layout.tsx) — /resume opts out of (site)/ chrome but inherits root, so root-mount catches the chromeless route too. D-DPL-03 from 07-CONTEXT.md.
- [Phase 07-content-pass-+-launch]: Plan 07-00: Analytics islands rendered as siblings of <Providers> (not children) — keeps telemetry lifecycle independent of MotionProvider/ThemeProvider subtree and makes intent obvious to future readers.
- [Phase 07-content-pass-+-launch]: Plan 07-00: No 'use client' directive on app/layout.tsx — both @vercel/analytics/react and @vercel/speed-insights/next handle the client boundary internally. Adding the directive would push the entire root layout to the client and break RSC.
- [Phase 07-content-pass-+-launch]: Plan 07-00: deploy-checklist.md subsections numbered 1-9 — Plan 07-04 checkpoint:human-action tasks reference subsections by number rather than heading text, so copy edits to titles won't break downstream references.
- [Phase 07-content-pass-+-launch]: Plan 07-01: links: {} (explicit empty object) chosen over omitting the links: key entirely. LinksSchema.default({}) accepts both, but explicit form is greppable from deploy checklist and names Plan 07-03 deferral via adjacent MDX comment.
- [Phase 07-content-pass-+-launch]: Plan 07-01: Myco template shape (Problem/Approach/Outcome H2 + 800–1200 words + descriptive outcomes only) consumed unmodified for second hero case study — confirms Phase 2 Plan 02-03 lock is durable across authors and topics. Fathom landed at 1200 words (upper bound, inclusive) via meaning-preserving trim passes, not argument-cutting.
- [Phase 07-content-pass-+-launch]: Plan 07-01: order: 20 places Fathom after Myco (order: 10) with a 10-step gap convention leaving room for future hero-tier inserts (15) without renumbering. Agenda Keeper at 30 in Plan 07-02.
- [Phase 07-content-pass-+-launch]: Plan 07-01: Cross-project thesis bridge pattern in Outcome — one sentence per hero case study naming a sibling project and connecting both to the autonomy thesis ('Myco gave an agent durable memory… Fathom gives the same agent honest accounting'). Per PROJECT.md no /thesis page; thesis shows through pattern across projects.
- [Phase 07-content-pass-+-launch]: the-real-agenda-keeper banned (internal repo slug); public framing is just 'Agenda Keeper'. Banning the slug-form prevents accidental copy-paste from internal docs/commit messages without affecting the legitimate public title. (Plan 07-02)
- [Phase 07-content-pass-+-launch]: Agenda Keeper privacy contract verified live on rendered HTML — 2× literal 'code private' label, zero anchors scoping to agenda-keeper on github/gitlab/bitbucket, zero leakage of internal repo slug. First time Phase 2 Plan 02-04 redaction scanner ran non-vacuously against real private MDX. (Plan 07-02)
- [Phase 07-content-pass-+-launch]: DEFER-01 (Phase 3 deferred Tailwind v4 source-scan scope bug) resolved inline during 07-02 checkpoint window via @source not directives in app/globals.css excluding .planning/**/*.md and scripts/**/*.ts. Unblocked Olive's visual check at /projects/agenda-keeper. Rule 3 (blocking) auto-fix. (Plan 07-02)

### Open Decisions (flagged in research)

To resolve during Phase 1:

- [ ] Display typeface: Geist default vs custom type-foundry face (Klim, Pangram Pangram, Dinamo)
- [ ] Accent color hue and whether to use site-wide vs per-hero-project accents
- [ ] Manual reduced-motion toggle in addition to OS gate — nice-to-have

To resolve during later phases:

- [ ] Shiki theme choice (Phase 3)
- [ ] OG image approach — static vs dynamic `next/og` (Phase 6)
- [ ] Contact method — `mailto:` default vs server-action form (Phase 5)

### Todos

_(Populated during plan execution)_

### Blockers

None.

### Notes

- Local repo at `/Users/olive/Documents/GitHub/portfolio` is empty — greenfield build.
- Existing 2023 repo `ophelia-x/portfolio_next` is stale and should not be a starting point.
- Content state: Myco and Fathom READMEs are solid starting content. Others need a content pass — placeholders will be explicit in Phases 3–4 until real content is delivered in Phase 7.

## Session Continuity

**Last session:** 2026-05-18T18:50:48.928Z

**Next action:** Execute Plan 02-01 (Wave 1: `lib/tags.ts` + `lib/schemas.ts` + `tests/content/schema.test.ts` + `tests/content/privacy-transform.test.ts`). `gray-matter`, `remark-frontmatter`, and `mdx-components.tsx` are now in place — Plan 02-01 is unblocked.

**Files to consult when resuming:**

- `.planning/PROJECT.md` — project context, constraints, decisions
- `.planning/REQUIREMENTS.md` — v1 requirements and phase traceability
- `.planning/ROADMAP.md` — phase structure, success criteria, dependencies
- `.planning/research/SUMMARY.md` — recommended stack and architecture
- `.planning/research/STACK.md` — locked version list
- `.planning/research/ARCHITECTURE.md` — folder layout, 15-step build order
- `.planning/research/PITFALLS.md` — AI-aesthetic, motion, a11y, perf traps to avoid
- `.planning/research/FEATURES.md` — 19-item anti-features checklist (launch gate)

---
*State initialized: 2026-04-18*
*Last updated: 2026-04-18 after roadmap creation*
