# Project Research Summary

**Project:** olivelliott.dev (Portfolio rebuild)
**Domain:** High-touch personal developer portfolio (Next.js App Router)
**Researched:** 2026-04-18
**Confidence:** HIGH

## Executive Summary

This is a greenfield rebuild of a personal developer portfolio for Olive Elliott — an engineer with a local-first / autonomous-workflows thesis — targeting decentralized-network collaborators, peer engineers, and client leads. The 2026 bar for this genre is convergent, not divergent: strong typography, one accent color, restrained motion, outcome-led case studies, and deliberate avoidance of AI-template tells. Hitting that bar requires disciplined decisions in foundation (tokens, typography, motion infrastructure) before any project pages get built.

The recommended approach is a **statically-rendered Next.js App Router site** built on a locked, modern stack (Next 16.2 / React 19.2 / Tailwind v4.1 / Motion 12 / Geist / Content Collections / @next/mdx / pnpm), with **content and tags as a typed schema** (not per-project JSX files), a **single motion boundary** that gates reduced-motion globally, and a **print-CSS-primary resume** that renders HTML and PDF from one React tree.

The single largest brand risk is the AI-template aesthetic (purple gradients, skill-bar percentages, stagger-animate-everything, bento-as-home) — the target audience is unusually sensitive to these tells. Prevention is a design-token decision in the foundation phase, not a polish pass at the end. The secondary risk is content staleness, which the typed content schema addresses by making every project a validated MDX file rather than an ad-hoc page.

## Key Findings

### Recommended Stack

Next.js 16.2 on React 19.2 (React Compiler stable → auto-memoization) with Tailwind v4.1 (CSS-first `@theme` directive, 5× faster builds), Motion 12 (rebranded Framer Motion, `motion/react` import), Geist Sans + Geist Mono via `next/font`, Content Collections for MDX+Zod-typed frontmatter, `@next/mdx` for MDX compilation, pnpm for package management, Biome for lint/format, Vercel for hosting + Analytics. **Explicit rejects** (all popular but wrong for this brief): Contentlayer (abandoned), `next-mdx-remote` (archived April 2026), React Three Fiber / 3D libraries (no earned use case), Aceternity / template component libraries (AI-template aesthetic), Lottie (overkill vs custom SVG+CSS), `@react-pdf/renderer` (breaks resume SSoT).

**Core technologies:**
- **Next.js 16.2 / React 19.2**: statically rendered app shell — latest stable with auto-memoization
- **Tailwind v4.1 + `@theme` tokens**: CSS-variable-first design system, single source for colors/type/motion
- **Motion 12** via `motion/react` with `LazyMotion` + `MotionConfig reducedMotion="user"`: single motion boundary
- **Content Collections + Zod schema**: typed MDX frontmatter for projects, enforces tag/privacy/tier constraints at build
- **Geist Sans + Geist Mono**: high-craft engineering register, self-hosted via `next/font`
- **pnpm + Biome**: deterministic installs, unified lint/format (replaces ESLint/Prettier)

See `STACK.md` for full version list, rationale, and anti-patterns.

### Expected Features

See `FEATURES.md` for the complete landscape (20 table stakes, 19 differentiators, 19 anti-features).

**Must have (table stakes):**
- Home with hero, thesis, featured projects grid
- Project detail pages: Problem → Approach → Outcome structure, 800–1500 words per hero
- About page — real bio, values, current role anchor
- Resume — HTML page + downloadable PDF, single source of truth
- Responsive (mobile / tablet / desktop), working nav, 404
- Per-page metadata (title, description, OG image), sitemap, robots.txt
- Dark-theme with WCAG AA contrast, keyboard nav, skip-link
- Footer with real contact (GitHub, email, LinkedIn)

**Should have (differentiators):**
- Typography system as the primary visual signal (disciplined scale, deliberate rhythm)
- Motion language: 2–3 easing curves, 2–3 durations, applied with restraint
- Custom imagery per hero project (not stock screenshots)
- Per-project accent color (optional) or one site-wide accent
- Tag-driven filtering on projects index
- Project "next case study" navigation at end of each page
- Subtle easter eggs / ambient touches (restrained, not prominent)

**Defer (v2+ / v1.x):**
- Command palette (⌘K) — recognizable peer signal, but routes must stabilize first
- View Transitions API polish — requires routes to be locked
- `/writing` section — no content yet
- Blog comments / newsletter / testimonials carousel — not fit for this audience

### Architecture Approach

Statically-rendered Next.js App Router site with three load-bearing decisions: **(1) Content Collections as the SSoT** — projects are MDX with Zod-validated frontmatter (slug, title, year, tags, tier hero|secondary, privacy public|private, hero image, links); the Zod transform auto-adds `code-private` tag and strips `links.repo` for private projects so visibility is enforced at build. **(2) Single motion boundary** — one `<MotionProvider>` client wrapper at `app/(site)/layout.tsx` combining `LazyMotion` (5kb) + `MotionConfig reducedMotion="user"`, so every downstream motion component inherits reduced-motion gating with zero prop-drilling. **(3) Print-CSS-primary resume** — one React tree renders both `/resume` HTML and `/resume.pdf` via Puppeteer at build time, with `@media print` handling paper transforms. See `ARCHITECTURE.md` for the full folder layout, content model, rendering strategy, and 15-step build order.

**Major components:**
1. **Design system / tokens** (`styles/tokens.css` + Tailwind `@theme`) — colors, type scale, spacing, motion tokens as CSS variables
2. **Site shell** (`app/(site)/layout.tsx`) — nav, footer, motion provider, skip-link, font loading
3. **Content layer** (Content Collections + `content/projects/*.mdx`) — typed project schema, derived tag index, query helpers
4. **Project detail template** (`app/(site)/projects/[slug]/page.tsx`) — MDX rendering with custom components (gallery, figure, callout), hero treatment, next-project nav
5. **Index surfaces** — home page project grid, `/projects` page with URL-synced tag filter
6. **Resume subsystem** — TS data file → HTML (`/resume`) + print CSS → Puppeteer build step → `/public/resume.pdf`
7. **Metadata + OG** — per-route `generateMetadata` and `opengraph-image.tsx`, sitemap, robots

### Critical Pitfalls

Top items from `PITFALLS.md` (see file for warning signs, prevention, and phase mapping):

1. **AI-template aesthetic** (purple gradients, skill-bar percentages, gradient-text-on-gradient, bento home, stagger-everything) — **prevent at token level in the foundation phase**, not in polish. The target audience is unusually sensitive to these tells.
2. **Motion / CLS / reduced-motion triangle** — set up `LazyMotion`, `MotionConfig reducedMotion="user"`, opacity-only first-viewport animations, and a motion-budget on day 1 of motion work. Retrofitting is much more expensive.
3. **Content schema before first project page** — a typed content collection with a catch-all route prevents stale projects and ad-hoc pages. Don't write per-project JSX.
4. **Private-project leak / overclaim** — contribution-schema + redaction review before publishing any Aktiga / Voya / Spectra / Trade Bot case study. NDA + relationship risk is real.
5. **Resume drift** — a single React tree + print CSS with build-step Puppeteer export prevents HTML/PDF divergence. Reject `@react-pdf/renderer` (second tree = drift vector).
6. **Typography inconsistency** — typography is the single highest-leverage early investment and the biggest "high-touch vs templated" signal. Lock the scale, weights, and rhythm before building any pages.
7. **Performance regressions from images and motion** — Lighthouse ≥ 90 budget means `next/image` everywhere, hero images subset and optimized, no transform animations on first-viewport elements, Geist via `next/font` (self-hosted, size-adjust), no render-blocking motion libraries.
8. **Accessibility debt** — WCAG AA contrast on dark theme is tricky; keyboard nav on filter chips is easy to break; hover-only interactions fail on touch. A11y is a gate, not a pass.

## Implications for Roadmap

All four research dimensions converge on the same dependency-sorted phase order. Suggested granularity is **Standard (5–8 phases)** as configured.

### Phase 1: Foundation (tokens + scaffold + motion infrastructure)
**Rationale:** Typography, color tokens, and motion gating are load-bearing for every downstream decision. Research is unanimous — Phase 1 owns the biggest pitfalls (AI-aesthetic, motion/CLS, contrast) and the biggest wins (typography-as-signal). Skipping or rushing this phase is the highest-risk choice.
**Delivers:** `create-next-app` → TypeScript strict → Tailwind v4 `@theme` with tokens → Geist fonts → Biome → `<MotionProvider>` with `LazyMotion` + `reducedMotion="user"` → root layout with skip-link → dark-theme baseline with AA contrast verified → deploy-to-Vercel pipeline working.
**Addresses:** Design tokens (anti-AI prevention), motion infrastructure (reduced-motion gate), deploy wiring, metadata scaffolding.
**Avoids:** AI-aesthetic retrofit cost, CLS from late-loading motion, contrast failures, deploy surprises.

### Phase 2: Content pipeline + project schema
**Rationale:** The single most important architectural decision. Typed content collection before any project page is written. Validates the content model with one real MDX file (Myco or Fathom) before scaling out templates.
**Delivers:** Content Collections configured → `projects` schema in Zod (slug/title/year/tags/tier/privacy/hero/links) with transform that auto-tags `code-private` and strips `links.repo` → one real Myco or Fathom MDX authored from existing README → derived tag index + query helpers → ambient type safety.
**Uses:** Content Collections, `@next/mdx`, Zod.
**Implements:** Component 3 (Content layer).
**Avoids:** Stale-projects pitfall, private-project leak (enforced at schema), per-project JSX sprawl.

### Phase 3: Project detail template + first hero case study
**Rationale:** The hardest page. Building it end-to-end with a single hero (Myco) validates content + motion + MDX components together before the rest scale. Highest-risk page to leave for last.
**Delivers:** `/projects/[slug]` route with `generateStaticParams` + `dynamicParams = false` → MDX custom components (gallery, figure, callout, code block via Shiki) → hero treatment → next-project navigation → Myco case study written from README → per-route OG image.
**Implements:** Component 4 (Project detail template).
**Research flag:** MDX component ergonomics — may need a design pass during authoring.

### Phase 4: Index surfaces — home + projects grid
**Rationale:** Reuses the template and content schema from Phase 2/3. Home page is the site's front door and needs hero, thesis, and featured projects tier; `/projects` page needs URL-synced tag filter.
**Delivers:** Home page (hero copy, thesis, hero-tier project grid, secondary-tier cards) → `/projects` index with URL-synced tag filter (`?tag=local-first`) → Fathom + Agenda Keeper case studies filled in from READMEs / flagged for content → secondary cards for Trade Bot + Stemz + Aktiga with "code private" tag where applicable.
**Implements:** Component 5 (Index surfaces).
**Avoids:** Bento-home anti-pattern, filter UX traps (keyboard nav on chips, missing a11y labels).

### Phase 5: About + Resume (HTML + PDF)
**Rationale:** Self-contained, can run parallel to index polish. Must enforce single-source-of-truth between HTML and PDF.
**Delivers:** `/about` page (bio, values, current role at Aktiga anchor) → `/resume` route with TS data file → print CSS for paper transforms → Puppeteer build step producing `/public/resume.pdf` → `/resume` and `/resume.pdf` always in sync → downloadable-PDF link.
**Implements:** Component 6 (Resume subsystem).
**Research flag:** Puppeteer-on-Vercel may need `@sparticuz/chromium` if we build in CI; defaulting to local build-step to sidestep.

### Phase 6: SEO, OG images, a11y + performance audit
**Rationale:** One-shot decisions that are cheap to do right and expensive to retrofit. Pre-launch gate.
**Delivers:** Per-route `generateMetadata` and `opengraph-image.tsx` → sitemap.xml → robots.txt → Lighthouse ≥ 90 verified on home + hero project page → axe-core clean → keyboard-nav walkthrough → contrast pair audit → link checker pass → anti-features launch-gate checklist verified.
**Implements:** Component 7 (Metadata + OG).

### Phase 7: Content pass + launch
**Rationale:** Real content closes the gap between scaffold and shipped site. Visibility review prevents private-project leaks.
**Delivers:** Remaining case studies (Trade Bot, Stemz, Aktiga, plus any secondary tier) drafted → Olive content-review pass → private-project redaction review → custom imagery pass → cname / vercel subdomain verified → analytics enabled → launch.

### Phase Ordering Rationale

- **Foundation first** — every research output flags design tokens, typography, and motion infrastructure as the biggest compounding decisions. Retrofitting these is the single highest cost path.
- **Schema before pages** — cardinal portfolio sin is staleness; the fix is typed content, not discipline. Schema in Phase 2 makes every later page a thin renderer.
- **One hero end-to-end before scaling** — Phase 3 validates content + motion + MDX together on the hardest page. Finding schema gaps on page 1 is cheap; on page 5 it's rework.
- **Index surfaces reuse the template** — home and `/projects` are thin consumers of the schema + template built in Phase 2/3.
- **Resume is independent** — can slide in parallel to other phases without dependencies.
- **Audit before launch** — a11y, performance, SEO, and anti-features check are gates, not suggestions. The list from PITFALLS.md is a launch checklist.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3 (Project template):** MDX component ergonomics (gallery, figure, callout) — may need a design pass once real content is being authored.
- **Phase 5 (Resume PDF):** Puppeteer-on-Vercel specifics if we ever move from local build to CI build. Default (local build → commit PDF) sidesteps this.

Phases with standard patterns (skip research-phase):
- **Phase 1 (Foundation):** stack is locked, patterns are canonical, no research needed.
- **Phase 2 (Content pipeline):** Content Collections + Zod is well-documented.
- **Phase 4 (Index surfaces):** reuses Phase 2/3 work.
- **Phase 6 (SEO/a11y/perf):** Next.js docs + Lighthouse guide cover this directly.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Versions verified against current 2026 docs, changelogs, release posts. Deprecations (Contentlayer, `next-mdx-remote`) confirmed by multiple 2026 sources. |
| Features | HIGH | Triangulated across canonical portfolios (Brittany Chiang, paco.me) and current 2026 editorial writing. Anti-features list is specific, named, and currently critiqued. |
| Architecture | HIGH | Folder layout matches Next.js 15+ project-structure docs. Content Collections confirmed as Contentlayer successor by production sites (Dub, Fumadocs). LazyMotion + MotionConfig is the documented Motion pattern. |
| Pitfalls | HIGH | Cross-verified against Next.js docs, Motion docs, WCAG/WebAIM, Smashing Magazine dark-theme guidance, multiple 2026 portfolio critique articles. |

**Overall confidence:** HIGH

### Gaps to Address

- **Display typeface choice** — Geist is the default pick; a custom type-foundry face (Klim, Pangram Pangram, Dinamo) could elevate further. Flag for Phase 1 design decision.
- **Accent color hue** — one site-wide accent vs per-hero-project accents. Recommendation: one site-wide accent. Final call in Phase 1.
- **Manual reduced-motion toggle** — OS gate is mandatory; manual toggle is a nice-to-have. Decide in Phase 1 motion infrastructure work.
- **Shiki theme** — taste call (github-dark-default / vesper / ayu-dark). Resolve during Phase 3.
- **OG image approach** — static per-project `opengraph-image.jpg` vs dynamic `next/og` `ImageResponse`. Static is easier; dynamic scales. Decide in Phase 6.
- **Contact method** — `mailto:` (simplest) vs form with server action. Default to `mailto:`; revisit if volume matters.

## Sources

### Primary (HIGH confidence)
- [Next.js 16 release](https://nextjs.org/blog/next-16)
- [Next.js 16.2 summary](https://medium.com/@onix_react/release-next-js-16-2-377798369d25)
- [Tailwind CSS v4](https://tailwindcss.com/blog/tailwindcss-v4) / [v4.1](https://tailwindcss.com/blog/tailwindcss-v4-1)
- [Motion changelog](https://motion.dev/changelog) / [Motion upgrade guide](https://motion.dev/docs/react-upgrade-guide)
- [Motion — LazyMotion](https://motion.dev/docs/react-reduce-bundle-size) / [MotionConfig](https://www.framer.com/motion/motion-config/)
- [Next.js MDX guide](https://nextjs.org/docs/app/guides/mdx)
- [next-mdx-remote archival discussion](https://github.com/hashicorp/next-mdx-remote/discussions/438)
- [Content Collections — migration from Contentlayer (Dub)](https://dub.co/blog/content-collections)
- [Geist font (Vercel)](https://vercel.com/font)
- [shadcn/ui CLI v4](https://ui.shadcn.com/docs/changelog/2026-03-cli-v4) / [Radix unified package](https://ui.shadcn.com/docs/changelog/2026-02-radix-ui)
- [Biome migration guide](https://biomejs.dev/guides/migrate-eslint-prettier/)
- [Next.js production checklist](https://nextjs.org/docs/app/guides/production-checklist)
- [WCAG 2.2 / WebAIM contrast](https://webaim.org/articles/contrast/)
- [prefers-reduced-motion (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)

### Secondary (MEDIUM confidence)
- [Contentlayer abandonment (Wisp CMS)](https://www.wisp.blog/blog/contentlayer-has-been-abandoned-what-are-the-alternatives)
- [Vercel Analytics vs Plausible vs Umami 2026](https://www.pkgpulse.com/blog/vercel-analytics-vs-plausible-vs-umami-privacy-first-2026)
- [pnpm vs bun vs npm 2026](https://pockit.tools/blog/pnpm-npm-yarn-bun-comparison-2026/)
- [Creating a Résumé Website and PDF Generator With Next.js (Colin Hemphill)](https://www.colinhemphill.com/blog/creating-a-resume-website-and-pdf-generator-with-nextjs)
- [Downloadable PDF from Next.js with Puppeteer (Harrison Pim)](https://harrisonpim.com/blog/creating-a-downloadable-pdf-copy-of-a-page-using-next-js-and-puppeteer)
- [Inclusive Dark Mode (Smashing Magazine)](https://www.smashingmagazine.com/2025/04/inclusive-dark-mode-designing-accessible-dark-themes/)

### Tertiary (LOW confidence)
- [Why AI keeps building purple gradient websites](https://prg.sh/ramblings/Why-Your-AI-Keeps-Building-the-Same-Purple-Gradient-Website) — opinion piece, but pattern is widely observed
- [Handling NDAs in portfolios (IxDF)](https://www.interaction-design.org/literature/article/how-to-handle-non-disclosure-agreements-ndas-when-you-write-your-ux-case-study) — guidance, not standard

---
*Research completed: 2026-04-18*
*Ready for roadmap: yes*
