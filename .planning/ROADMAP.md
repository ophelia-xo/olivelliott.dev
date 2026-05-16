# Roadmap: olivelliott.dev

**Milestone:** v1.0 — Portfolio launch on Vercel subdomain
**Created:** 2026-04-18
**Granularity:** standard (7 phases)
**Coverage:** 54/54 v1 requirements mapped

## Core Value

The site must accurately reflect current work — Myco, Fathom, Agenda Keeper, Trade Bot, Stemz, and Aktiga contributions — in a way that communicates Olive's thesis about building for autonomy and local-first systems, and feels high-touch (typography, motion, detail) rather than templated.

## Phases

- [ ] **Phase 1: Foundation** — Scaffold Next.js 16 + Tailwind v4 `@theme` tokens + Geist + Motion provider + dark theme + Vercel deploy pipeline
- [ ] **Phase 2: Content Pipeline** — Content Collections + Zod project schema + privacy transform + one real MDX (Myco) validating the model
- [ ] **Phase 3: Project Detail Template** — `/projects/[slug]` static rendering with MDX components, hero treatment, next-project nav, Myco case study live
- [ ] **Phase 4: Home + Projects Index** — Landing page with hero/thesis/tiered grid plus `/projects` with URL-synced tag filter
- [ ] **Phase 5: About + Resume + Contact** — `/about`, `/resume` (HTML + PDF from one React tree), footer contact links
- [ ] **Phase 6: SEO, OG, A11y & Performance Audit** — Metadata, sitemap, robots, OG images, Lighthouse ≥ 90, axe clean, anti-features gate
- [ ] **Phase 7: Content Pass + Launch** — Remaining case studies drafted, redaction review, Vercel subdomain verified, Analytics on, ship

## Phase Details

### Phase 1: Foundation
**Goal**: A deployable Next.js app shell with locked design tokens, typography, motion infrastructure, and dark-theme baseline — ready to build pages on without retrofitting.
**Depends on**: Nothing (first phase)
**Requirements**: FND-01, FND-02, FND-03, FND-04, FND-05, FND-06, FND-07, FND-08, DPL-01
**Success Criteria** (what must be TRUE):
  1. Visitor loads a deployed Vercel URL and sees a dark-theme page using Geist Sans/Mono with site nav, footer scaffold, and a working skip-to-content link.
  2. A keyboard user can tab through nav, activate the skip-link, and see a visible focus ring on every interactive element.
  3. A visitor with `prefers-reduced-motion: reduce` sees no decorative motion; a visitor without it sees the motion-system hook working on a trivial test element.
  4. Every color pair on screen passes WCAG AA contrast when checked with axe or a contrast tool.
  5. Pushing a commit to `main` produces a new Vercel deployment within minutes; Biome lint/format passes cleanly on the codebase.
**Plans**: 7 plans across 4 waves
Plans:
- [x] 01-00-PLAN.md — Wave 0: scaffold Next.js 16.2 + locked deps, Biome, Vitest harness + 8 test spec files
- [x] 01-01-PLAN.md — Wave 1: tokens.css @theme block + globals.css + cn() helper
- [x] 01-02-PLAN.md — Wave 1: root layout + next-themes Providers + (site) layout skeleton
- [x] 01-03-PLAN.md — Wave 2: MotionProvider (LazyMotion strict + reducedMotion=user) + opacity-only FadeIn
- [x] 01-04-PLAN.md — Wave 2: SkipLink + WordMark + NavLink + Nav + Footer + full (site) shell
- [x] 01-05-PLAN.md — Wave 3: home placeholder + custom 404 + local verification checkpoint
- [x] 01-06-PLAN.md — Wave 3: Vercel link + deploy main + production verification checkpoint
**UI hint**: yes

### Phase 2: Content Pipeline
**Goal**: A typed, validated content system where projects are MDX files — not JSX pages — with privacy enforced at the schema layer, so every downstream page is a thin renderer over a single source of truth.
**Depends on**: Phase 1
**Requirements**: CNT-01, CNT-02, CNT-03, CNT-04, CNT-05, CNT-06
**Success Criteria** (what must be TRUE):
  1. A developer can add a project by dropping an MDX file into `content/projects/` with valid frontmatter, and it appears as queryable typed data at build time.
  2. Attempting to build with invalid frontmatter (bad slug, missing tier, unknown tag) fails the build with a clear Zod error.
  3. A project marked `privacy: private` automatically carries a `code-private` tag and has its `links.repo` stripped — verified against at least one fixture.
  4. Code consumers can query "all projects tagged `local-first`" or "all hero-tier projects" via a typed helper, not ad-hoc filtering.
  5. The Myco MDX file is authored from the existing README and passes the schema — proving the model on real content before any page template is built.
**Plans**: 5 plans across 4 waves
Plans:
- [x] 02-00-PLAN.md — Wave 0: install gray-matter + remark-frontmatter, wire next.config.ts, mdx-components.tsx stub
- [x] 02-01-PLAN.md — Wave 1: lib/tags.ts + lib/schemas.ts (Zod + privacy transform) + schema/privacy-transform tests + fixtures
- [x] 02-02-PLAN.md — Wave 2: lib/content.ts (fs+gray-matter loader) + lib/projects.ts query helpers + content-load + tag-index tests
- [x] 02-03-PLAN.md — Wave 3: author content/projects/myco.mdx from README + extend content-load.test.ts + human-verify editorial quality
- [x] 02-04-PLAN.md — Wave 3: tests/fixtures/banned-terms.ts + tests/content/redaction.test.ts + 02-REDACTION-REVIEW.md checklist
**UI hint**: no

### Phase 3: Project Detail Template
**Goal**: A visitor can read the Myco case study at `/projects/myco` as a Problem → Approach → Outcome narrative with a hero, rich MDX components, and a clear path to the next project — validating the hardest page end-to-end before scaling to other projects.
**Depends on**: Phase 2
**Requirements**: PRJ-01, PRJ-02, PRJ-03, PRJ-04, PRJ-05, PRJ-06, PRJ-07
**Success Criteria** (what must be TRUE):
  1. Visitor navigates to `/projects/myco` and reads an 800–1500 word Problem → Approach → Outcome case study with a hero treatment (title, year, tags, imagery or deliberate text-only).
  2. Code blocks in the MDX render with Shiki syntax highlighting; galleries, figures, and callouts render with custom components (not raw MDX defaults).
  3. At the end of the Myco page, the visitor sees a "next project" link that moves them to another project without a dead-end.
  4. A private-project page (fixture or real) shows a visible "code private" tag in the header metadata and no repo link anywhere on the page.
  5. Viewing the page source shows per-route `<title>`, `<meta description>`, and OG image tags unique to the project.
**Plans**: 4 plans across 3 waves
Plans:
- [x] 03-00-PLAN.md — Wave 0: install deps + extend next.config.ts rehype chain (slug+autolink+pretty-code/Vesper) + .prose CSS + isPlaceholderHero helper + /og-default.png stub + 2 RED tests
- [x] 03-01-PLAN.md — Wave 1: MDXProse wrapper + Figure + Gallery + Callout components + mdx-components.tsx registration + 3 test files
- [x] 03-02-PLAN.md — Wave 2 lane A: ProjectHero (image-vs-text branching) + ProjectMeta (privacy contract) + TagChipRow + 3 test files
- [ ] 03-03-PLAN.md — Wave 2 lane B + integration: getNextProject helper + NextProjectBlock (with motion island) + page route (generateStaticParams + generateMetadata + dynamic MDX import) + 5 test files
**UI hint**: yes

### Phase 4: Home + Projects Index
**Goal**: A first-time visitor lands on the home page, instantly understands Olive's thesis, sees hero projects rendered with weight, and can drill into `/projects` with a filterable tag chip row that respects URL state.
**Depends on**: Phase 3
**Requirements**: HOM-01, HOM-02, HOM-03, HOM-04, HOM-05, PIX-01, PIX-02, PIX-03, PIX-04
**Success Criteria** (what must be TRUE):
  1. Visitor lands on `/` and reads a one-sentence thesis in the hero, then scans three hero-tier project cards (Myco, Fathom, Agenda Keeper) rendered larger than the secondary tier below.
  2. The home page hero has exactly one earned motion moment (e.g., type-set entrance or cursor-reactive detail) that respects reduced-motion and does not use stagger-on-scroll or a bento grid.
  3. Visitor clicks a tag chip on `/projects` and the URL updates to `?tag=local-first`; reloading the URL or using the back button restores the exact filter state.
  4. A keyboard user can tab through the tag chip row with visible focus styles and activate filters via Enter/Space without reaching for a mouse.
  5. Hero-tier cards are visually distinct from secondary-tier cards, and private-project cards are visually distinct from public ones at a glance.
**Plans**: TBD
**UI hint**: yes

### Phase 5: About + Resume + Contact
**Goal**: A visitor can read a genuine bio, download a polished resume PDF that matches the HTML version exactly, and find Olive on GitHub, email, and LinkedIn from at least two places on the site.
**Depends on**: Phase 1 (can run parallel to Phase 3–4 if scheduled that way)
**Requirements**: ABT-01, ABT-02, ABT-03, RES-01, RES-02, RES-03, RES-04, RES-05, RES-06, CTC-01, CTC-02, CTC-03
**Success Criteria** (what must be TRUE):
  1. Visitor reads `/about` and finds a real, non-templated bio that anchors the current role at Aktiga and expresses the polymath/autonomous-workflows/open-source-communities values.
  2. Visitor views `/resume` in the browser as a styled HTML page and, via a visible download link, gets an identical-content PDF — because both are rendered from the same typed source-of-truth.
  3. Printing `/resume` from the browser produces a paper-correct layout (print CSS takes over, nav/footer hidden, typography optimized for paper).
  4. Footer links to GitHub, email (`mailto:` with pre-filled subject), and LinkedIn all work from every page; About page also surfaces contact affordances.
  5. Resume content reflects current projects and role — a reviewer comparing resume to About finds no stale or fabricated entries.
**Plans**: TBD
**UI hint**: yes

### Phase 6: SEO, OG, A11y & Performance Audit
**Goal**: A deployed site that passes the launch gate — every route is discoverable with unique metadata and an OG image, Lighthouse scores ≥ 90 across the board, axe finds zero violations on the core routes, and the anti-features checklist is verified clean.
**Depends on**: Phase 4, Phase 5
**Requirements**: MTA-01, MTA-02, MTA-03, MTA-04, QAL-01, QAL-02, QAL-03, QAL-04, QAL-05
**Success Criteria** (what must be TRUE):
  1. Pasting any route URL (`/`, `/about`, `/resume`, `/projects`, `/projects/myco`) into Twitter or a link unfurler shows a unique title, description, and OG image.
  2. `https://<site>/sitemap.xml` returns a valid sitemap listing all public routes; `/robots.txt` is present; favicon set (SVG, ICO, apple-touch) loads across browsers.
  3. Running Lighthouse on the deployed home page and one hero project page produces ≥ 90 across Performance, Accessibility, Best Practices, and SEO.
  4. Running axe-core against `/`, one project page, and `/resume` returns zero violations; a keyboard-only walkthrough completes nav, filter use, and resume download without a mouse.
  5. The 19-item anti-features launch checklist from `research/FEATURES.md` is verified clean — no skill bars, gradient-on-gradient, stagger-everything, bento home, etc.
**Plans**: TBD
**UI hint**: yes

### Phase 7: Content Pass + Launch
**Goal**: The site is shipped — all case studies are drafted to the standard set by Myco, private-project content has passed redaction review, and the Vercel subdomain is live with Analytics enabled.
**Depends on**: Phase 6
**Requirements**: DPL-02, DPL-03
**Success Criteria** (what must be TRUE):
  1. Visitor can navigate to the final Vercel subdomain URL (not a preview URL) and reach every page over HTTPS.
  2. Vercel Analytics is enabled and recording visits on the deployed domain — confirmed in the Vercel dashboard.
  3. All hero and secondary case studies have real content drafted (no lorem ipsum, no "placeholder" copy left visible); any placeholder that remains is explicitly flagged as such.
  4. Every private-project case study (Agenda Keeper, Trade Bot, Aktiga, etc.) has passed an explicit redaction review before going live — no internal details, no proprietary claims, no NDA violations.
  5. Olive can share the URL publicly (to peers, collaborators, client leads) without caveats about unfinished sections.
**Plans**: TBD
**UI hint**: yes

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 0/7 | Planned | - |
| 2. Content Pipeline | 0/0 | Not started | - |
| 3. Project Detail Template | 0/4 | Planned | - |
| 4. Home + Projects Index | 0/0 | Not started | - |
| 5. About + Resume + Contact | 0/0 | Not started | - |
| 6. SEO, OG, A11y & Performance Audit | 0/0 | Not started | - |
| 7. Content Pass + Launch | 0/0 | Not started | - |

## Coverage Summary

All 54 v1 requirements are mapped to exactly one phase. No orphans. No duplicates.

| Category | Count | Phase(s) |
|----------|-------|----------|
| FND (Foundation) | 8 | Phase 1 |
| DPL (Deploy) | 3 | Phase 1 (DPL-01), Phase 7 (DPL-02, DPL-03) |
| CNT (Content pipeline) | 6 | Phase 2 |
| PRJ (Project detail) | 7 | Phase 3 |
| HOM (Home page) | 5 | Phase 4 |
| PIX (Projects index) | 4 | Phase 4 |
| ABT (About) | 3 | Phase 5 |
| RES (Resume) | 6 | Phase 5 |
| CTC (Contact) | 3 | Phase 5 |
| MTA (Metadata/SEO) | 4 | Phase 6 |
| QAL (Quality/a11y) | 5 | Phase 6 |
| **Total** | **54** | **7 phases** |

## Dependencies

```
Phase 1 (Foundation)
   ├─→ Phase 2 (Content Pipeline)
   │       └─→ Phase 3 (Project Detail Template)
   │              └─→ Phase 4 (Home + Projects Index)
   │                     └─→ Phase 6 (SEO/A11y/Perf Audit)
   │                            └─→ Phase 7 (Content Pass + Launch)
   └─→ Phase 5 (About + Resume + Contact)
          └─→ Phase 6 (SEO/A11y/Perf Audit)
```

Phase 5 is independent of Phases 2–4 and can run in parallel after Phase 1 completes.

---
*Roadmap created: 2026-04-18*
*Last updated: 2026-04-18 after initial creation*
