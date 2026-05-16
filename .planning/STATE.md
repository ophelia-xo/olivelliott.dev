---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
current_plan: 3
status: executing
last_updated: "2026-05-16T00:37:14.340Z"
progress:
  total_phases: 7
  completed_phases: 2
  total_plans: 16
  completed_plans: 14
  percent: 88
---

# Project State: olivelliott.dev

## Project Reference

**Name:** olivelliott.dev (Portfolio rebuild)
**Type:** Personal developer portfolio — Next.js App Router, statically rendered, deployed to Vercel
**Core Value:** The site must accurately reflect current work — Myco, Fathom, Agenda Keeper, Trade Bot, Stemz, and Aktiga contributions — in a way that communicates Olive's thesis about building for autonomy and local-first systems, and feels high-touch (typography, motion, detail) rather than templated.
**Current Focus:** Phase 03 — project-detail-template

## Current Position

Phase: 03 (project-detail-template) — EXECUTING
Plan: 3 of 4
Current Plan: 3
Total Plans in Phase: 4
**Milestone:** v1.0 — Portfolio launch on Vercel subdomain
**Phase:** 3
**Plan:** 02-00 complete → next is 02-01
**Status:** Ready to execute
**Progress:** [█████████░] 88%

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

**Last session:** 2026-05-16T00:36:58.142Z

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
