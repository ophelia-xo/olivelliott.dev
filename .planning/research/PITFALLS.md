# Pitfalls Research

**Domain:** Personal developer portfolio (Next.js App Router, dark-theme, high-touch, motion-forward, MDX content)
**Researched:** 2026-04-18
**Confidence:** HIGH (established community consensus + current Next.js 16 / Motion 12 guidance verified against official docs)

## Overview

A developer portfolio fails in slow, quiet ways: the content drifts stale, the "motion" tanks LCP on mid-range phones, the dark theme looks like every Vercel template, the private projects either overclaim or say nothing, and six months later adding a project means editing three files and a component. This file catalogs those failures with warning signs, prevention, and phase ownership.

The design brief (wallofportfolios.in reference, dark + minimalist + high-touch, "not templated") makes a specific cluster of pitfalls high-risk: AI-aesthetic tells, motion without a11y gates, LCP regressions from hero imagery, and content-component coupling that locks the site into its first shape. Pitfalls are ordered by severity for this project, not generic portfolio advice.

---

## Critical Pitfalls

### Pitfall 1: AI-Aesthetic Tells (the "Purple Problem")

**What goes wrong:**
The site ships looking like every Vercel template / v0 export / Lovable-generated landing page: indigo-to-purple gradients, Inter Regular body, glass-morphism cards, emoji-prefixed section headers ("✨ Projects", "🚀 About Me"), centered hero with a gradient orb behind it, radial-gradient backgrounds, and copy like "experienced passionate full-stack developer building scalable solutions." The site reads as AI-generated slop to the exact audience (peers, decentralized-network collaborators) that the brief prioritizes — i.e. the people most attuned to detect it.

**Why it happens:**
Tailwind's default palette leans heavily on indigo/violet/purple, shadcn/ui defaults ship in these tones, and Claude/GPT/v0 training corpora massively over-represent purple-gradient portfolios. Left to defaults, the tooling actively pulls toward this aesthetic. On the copy side, LLMs default to marketing-register superlatives when asked to "write a portfolio bio."

**How to avoid:**
- Define a custom palette in `tailwind.config` / CSS variables before building any components. No `indigo-*`, `violet-*`, `purple-*` tokens. Restrict accents to one or two deliberately chosen hues (warm neutral, off-white, single muted accent).
- Forbid gradients in v1 except where explicitly justified in a design review. Solid fills, hairline borders, and typographic contrast do the heavy lifting.
- Pick one display typeface that is NOT Inter, and pair it with a mono for code/metadata. Inter can be the system body font; the display choice is the fingerprint.
- Write bio copy in Olive's own voice — specific claims ("shipped Trade Bot in 4 milestones across 5 days") beat superlatives ("10x engineer passionate about quality"). Ban the words: *passionate, award-winning, scalable solutions, cutting-edge, 10x, crafted, seamless.*
- Strip emoji from navigation and section headers. Allow them only inside project body copy where they reflect actual voice.

**Warning signs:**
- Hero uses any `from-*-500 to-*-500` or radial-gradient background.
- Section headers have emoji.
- Bio contains the word "passionate."
- A designer friend glances at it and says "this looks like v0."
- Color palette has more than 3 hues + neutrals.

**Phase to address:**
Phase 2 — Design system / foundations (tokens, type ramp, color decisions locked before component work begins). Revisited in Phase 6 — Polish (AI-smell audit before ship).

---

### Pitfall 2: Motion That Ignores `prefers-reduced-motion`

**What goes wrong:**
Scroll-reveal fades, parallax, page-transition whips, and micro-interactions run for every visitor — including users with vestibular disorders, migraines, and users on OS-level "reduce motion." WCAG 2.3.3 (animation from interactions) violation, and the site becomes physically uncomfortable for a meaningful slice of the audience. For a portfolio whose pitch is "thoughtful," this is a credibility leak.

**Why it happens:**
Framer Motion / Motion and GSAP don't gate on `prefers-reduced-motion` by default. Developers add animations component-by-component and forget the global gate. Demos and tutorials rarely show the reduced-motion branch.

**How to avoid:**
- Build a single `useReducedMotion` hook (Motion ships `useReducedMotion()`; use it) and a root `MotionConfig` with `reducedMotion="user"` so Motion globally respects the preference.
- Every animated component must have two branches: full motion, and reduced (opacity fade ≤150ms, or instant). No transform-based reveals in reduced-motion mode — fades only.
- Global CSS safety net for non-Motion animations:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```
- Add a manual toggle in the footer / settings that persists to localStorage and overrides OS setting in either direction (some users want motion even if OS default is reduce).
- Test with `System Preferences → Accessibility → Display → Reduce Motion` enabled before shipping any animated page.

**Warning signs:**
- Toggling "Reduce Motion" in macOS changes nothing on the site.
- No `useReducedMotion` import appears in the repo.
- Scroll reveals still animate on a reduced-motion device.
- Page transitions play identically for all users.

**Phase to address:**
Phase 4 — Motion layer (implement from day 1 of any motion work, not retrofitted). Verified in Phase 7 — Accessibility audit.

---

### Pitfall 3: LCP Blown by Hero Imagery/Video

**What goes wrong:**
The hero has a full-bleed video, large photograph, or heavy Lottie/Three.js scene. LCP on 4G mid-range mobile lands at 4-8s. Lighthouse score on the landing page drops below 90 (breaking the stated budget). The site feels slow before the first interaction — which is exactly the wrong first impression for the "thoughtful engineer" positioning.

**Why it happens:**
Hero treatments are where designers/devs invest creative energy; cost controls get applied everywhere else but not the hero. Next.js 16 deprecated `priority` in favor of `preload` (Next.js 16, see [App Router Image docs](https://nextjs.org/docs/app/api-reference/components/image)), and many examples still use `priority`. Videos are often shipped as single mp4 without poster or width hints. Motion scenes lazy-load but still block LCP if they overlay the hero.

**How to avoid:**
- Decide the LCP candidate explicitly before building the hero. Typography-driven heroes (large type on solid background) are near-free; image/video heroes must earn their cost.
- If using an image hero: `next/image` with `preload` (Next 16) / `priority` (Next 15), correct `sizes`, AVIF/WebP output, explicit width+height to avoid CLS. Preload exactly one LCP image — never preload carousel items or below-fold images.
- If using video: `<video>` with `poster`, `preload="metadata"`, not `autoplay` on mobile, `muted playsinline` required for iOS, and an image fallback for reduced-data / slow-4G users.
- If using Motion/Three.js: lazy-load with `dynamic(() => import(...), { ssr: false, loading: () => <StaticFallback/> })` so the static fallback is the LCP, not the scene.
- Measure on a throttled Fast 3G profile in DevTools before ship. LCP target ≤ 2.5s on that profile.
- Track CLS budget ≤ 0.1 — hero layouts must reserve space via aspect-ratio.

**Warning signs:**
- Lighthouse mobile LCP > 2.5s on landing.
- Hero image has no explicit width/height.
- Hero video autoplays on mobile.
- `priority` or `preload` appears on more than one image per page.
- A Three.js / Lottie scene is the LCP element.

**Phase to address:**
Phase 3 — Home page / hero (LCP budget established and measured before leaving the phase). Re-verified Phase 7 — Performance pass.

---

### Pitfall 4: Content Coupled to Components

**What goes wrong:**
Adding a new project (e.g., when Olive ships a new Myco milestone) requires: editing JSX in the project list, creating a new folder under `app/projects/[slug]/page.tsx`, updating a nav component, editing OG image logic, and maybe touching the homepage grid. Six months later, adding a project is a chore — so it doesn't happen, and the portfolio goes stale (cardinal sin of developer portfolios, per the research).

**Why it happens:**
The first project page gets built by hand because it's easier than designing the content schema. Subsequent projects copy-paste that page, with minor variations, drifting the "template" across files. MDX content imports components directly (tight coupling), which means changing a component ripples into content files.

**How to avoid:**
- Define the project schema as TypeScript types FIRST: `type Project = { slug, title, summary, thesis_tags, stack, outcomes, case_study_mdx, status: 'public' | 'private', ...}`.
- Single source of truth: one `content/projects/` directory where each project is either a `.mdx` file or a `.ts` config that imports an MDX body. All pages and grids read from this collection.
- Use a catch-all route `app/projects/[slug]/page.tsx` that loads from the collection; no per-project route files.
- MDX uses a fixed, documented component set provided via `mdx-components.tsx` (global MDXProvider pattern). Project MDX files cannot import arbitrary components — only the curated set. This prevents drift and preserves bundle discipline.
- Static generation (`generateStaticParams`) against the collection — not runtime parsing.
- Define the schema for tags/thesis-tags as a const array with `as const` so TS flags typos across the site.

**Warning signs:**
- Adding a hypothetical new project requires editing more than 2 files (the content file + maybe an "is-published" flag).
- Project pages have different structures without a deliberate reason (ad-hoc divergence).
- Homepage project grid is hand-written JSX listing projects.
- A component rename breaks an MDX file.

**Phase to address:**
Phase 2 — Content architecture (schema + collection contract defined before any project page is built). Verified in Phase 5 — Project pages by attempting to add a dummy project to confirm it takes <10 minutes.

---

### Pitfall 5: Dark Theme Contrast Failures

**What goes wrong:**
Pure `#000` background + `#fff` text causes halation (blurry "bloom" around text) for users with astigmatism or dyslexia. Secondary/muted text at `gray-400` (~#9ca3af) on `gray-900` fails 4.5:1 contrast. Disabled states and placeholder text are invisible. Focus rings disappear against the dark palette. The site looks elegant to the builder, is unreadable to real users, and fails WCAG AA (the stated constraint).

**Why it happens:**
Designers eyeball contrast rather than measure it. "Muted" colors look sophisticated in Figma on a bright monitor but collapse on OLED phones in real viewing conditions. Tailwind's default `gray` scale doesn't tell you which steps pair to AA; developers pick by feel.

**How to avoid:**
- Use `#0a0a0a` to `#121212` as the darkest background, not `#000`. Reduces halation while preserving "dark."
- Target 15:1–17:1 contrast for body text in dark mode, not the theoretical 21:1 max — verified best practice from [Smashing / WCAG guidance](https://www.smashingmagazine.com/2025/04/inclusive-dark-mode-designing-accessible-dark-themes/).
- Every foreground token must be measured against every background token it legitimately sits on. Document the pairs (`text-primary on bg-base`, `text-muted on bg-elevated`, etc). Use a tool (Stark, Polypane, or a small color-contrast script in the repo).
- AA minimums: 4.5:1 normal text, 3:1 large text (18pt+ or 14pt bold) and UI components / focus indicators. AAA (7:1) for body copy where feasible.
- Focus ring: must hit 3:1 against both the focused element's background AND the surrounding background. A warm accent color (off-white or a chosen accent at high luminance) usually works in a dark theme; never `outline: none` without a `focus-visible` replacement.
- Disabled states: don't rely on opacity alone — add a visible pattern/label so colorblind and low-vision users can detect state.

**Warning signs:**
- Any color pairing hasn't been run through a contrast checker.
- Background is literal `#000000`.
- Placeholder text is barely visible.
- Focus ring is `outline: none` without a replacement.
- `text-gray-500` is used on `bg-gray-900`.

**Phase to address:**
Phase 2 — Design system (color tokens defined with measured pairs, not vibes). Verified Phase 7 — Accessibility audit.

---

### Pitfall 6: Missing / Broken SEO + Social Metadata

**What goes wrong:**
Links shared on Slack/Twitter/LinkedIn preview with the default Vercel OG, or no preview at all. `/sitemap.xml` missing or stale. Every page shares the same `<title>` because `generateMetadata` was never implemented per route. No `twitter:card` tags. Crawlers see a skeleton because content is gated behind client components. Result: shared links look unprofessional, Google can't rank the individual projects, the site underperforms its content.

**Why it happens:**
Metadata feels like "polish" and gets deferred. Next.js App Router's metadata API is powerful but requires explicit per-route implementation — nothing warns you if you didn't provide it. Dynamic OG images via `opengraph-image.tsx` need per-route files; easy to forget.

**How to avoid:**
- Root `layout.tsx` sets sane defaults (site name, description, twitter creator, default OG image).
- Every page exports `generateMetadata` (or static `metadata`) with unique title + description. Projects derive from the content collection automatically.
- Dynamic OG image via `opengraph-image.tsx` with `ImageResponse` at the route segment level — generates per-project OG based on title/accent, so shares look intentional. See [Next.js OG metadata docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image).
- `app/sitemap.ts` function pulls from the content collection — auto-updates when a project is added.
- `app/robots.ts` explicit (allow all; point at sitemap).
- Structured data (`Person` + `WebSite` JSON-LD on homepage; `CreativeWork` for each project).
- Canonical URLs set explicitly (important once custom domain replaces Vercel subdomain — avoid duplicate-content splits).
- Content must render server-side: hero copy, project summaries, bio must be in SSR output, not behind `useEffect`. Test with `view-source:` that the copy is in the raw HTML.

**Warning signs:**
- Pasting the URL into Slack shows the Vercel default OG.
- Two pages have identical `<title>`.
- `curl` on a project page returns HTML without the project content.
- `/sitemap.xml` returns 404 or is stale.
- No `opengraph-image` route anywhere in the repo.

**Phase to address:**
Phase 5 — Project pages (per-project metadata + OG images wired into the content schema). Phase 8 — Deploy (sitemap/robots/canonicals verified against production domain).

---

### Pitfall 7: Overclaiming on Private / Team Work

**What goes wrong:**
Case studies for Agenda Keeper, Trade Bot, Voya, Spectra, and Aktiga read as "I built this" when some of them are team efforts or contain proprietary details. Two failure modes: (1) overclaiming makes future reference checks awkward and damages trust with peer audience; (2) leaking proprietary details (internal metrics, architecture specifics, client names where NDA'd) creates legal/relationship risk with current and former employers/clients.

**Why it happens:**
Portfolios default to first-person active voice ("I built," "I shipped"). Designers/developers under NDA often over-share because specificity feels more credible than generalities. The line between "I led the backend" and "I built the product" blurs in self-writing.

**How to avoid:**
- Explicit contribution schema per project: `role`, `team_size`, `my_contribution` (specific), `what_shipped` (outcomes). Forces Olive to answer honestly.
- Voice rule: "I" is used only when truly solo. "We" + specific personal contribution ("I owned the sync engine; team of 3") for team work. Never "I built [product]" when "I built [subsystem of product]" is accurate.
- Private-project disclosure: case study explicitly says "Code private — case study by request" with "Request access" or "Ask Olive for a walkthrough" affordance. No screenshots of proprietary UI; use redacted/blurred mockups or abstract diagrams of the architecture shape, not the actual UI.
- Aktiga specifically: no internal metrics, no client names, no architecture that isn't already public via `aktiga-developer-docs`. Default framing is what's publicly visible + Olive's role at a high level.
- NDA framing template for private work:
  - "Project scope: [what the product does, no client identifiers]"
  - "My role: [specific contribution]"
  - "Tech: [stack, which is usually not confidential]"
  - "Outcome: [what shipped, without private metrics unless cleared]"
  - "Happy to walk through in detail on request."
- For Trade Bot: local-first, no prod data, paper-trading only — these facts are the differentiator and safe to share. Avoid publishing strategies or specific returns.

**Warning signs:**
- A case study uses "I" for a multi-person project.
- Screenshots show real client data, real customer names, or internal tooling UI.
- Metrics are quoted without sourcing (especially private-project metrics).
- Aktiga page reveals anything not on the public docs site.
- A former colleague reading the case study would disagree with the attribution.

**Phase to address:**
Phase 5 — Project pages (contribution schema enforced per project). Phase 6 — Content pass (Olive personally reviews every case study for overclaim / leak before ship).

---

## Moderate Pitfalls

### Pitfall 8: Framer Motion / Motion Bundle Bloat

**What goes wrong:**
Importing `motion` from `framer-motion` / `motion/react` in many client components pulls the full ~34KB gzipped library into the landing bundle. Combined with unused Tailwind classes and client-component sprawl, the JS budget for "static marketing site" balloons to 200KB+. [Motion's own docs](https://motion.dev/docs/react-reduce-bundle-size) document this and provide `LazyMotion` (down to ~4.6KB) as the fix.

**Why it happens:**
`import { motion } from "motion/react"` is the example in every tutorial; nobody mentions `LazyMotion` + `m` component swap unless you read the bundle-size docs specifically.

**How to avoid:**
- Wrap the app (or the motion-using subtree) in `<LazyMotion features={domAnimation}>` once, and use `<m.div>` instead of `<motion.div>`. Drops bundle from ~34KB to ~15KB for most use cases.
- For layout animations or 3D, load heavier feature bundles async: `features={() => import('./features').then(res => res.default)}`.
- Don't animate everything with Motion — CSS transitions and `@keyframes` are free and handle 80% of micro-interactions.
- Use Next.js bundle analyzer (`@next/bundle-analyzer`) as part of the build; fail the PR if the landing route JS exceeds a set budget (e.g., 120KB gzipped).

**Warning signs:**
- `import { motion }` appears in the repo (vs `import { m }`).
- No `LazyMotion` wrapper exists.
- Landing route First Load JS > 150KB.
- CSS transitions are unused; everything is Motion.

**Phase to address:**
Phase 4 — Motion layer.

---

### Pitfall 9: Too Many Client Components

**What goes wrong:**
Everything is `"use client"` because "it has an onClick" or "it uses a hook somewhere in its subtree." The entire page ships as a client bundle, server-component benefits (zero JS for static content, streaming) are lost, and hydration takes longer than it should. Per [LogRocket's RSC pitfalls](https://blog.logrocket.com/react-server-components-performance-mistakes) and current Next.js guidance, this is the #1 App Router mistake.

**Why it happens:**
The error message "you can't use hooks in server components" pushes devs to slap `"use client"` at the top of the file instead of refactoring. Shared layout components (header, nav) often need one interactive bit (a mobile menu), and the whole layout becomes client.

**How to avoid:**
- Default to server components. Add `"use client"` only when truly needed (event handlers, browser APIs, hooks that must run client-side).
- Push the client boundary down: keep `layout.tsx`, project pages, and grids as server components; make only the *interactive island* a client component (mobile menu button, not the whole header).
- Pattern: static children passed into client wrappers as `children`. A `<ClientThing>` can have `<ServerContent>` as children — Next.js renders the server content on the server, passes it through.
- Audit: count `"use client"` directives at the top of files. For a portfolio this size, it should be <10.

**Warning signs:**
- More than 15 files have `"use client"`.
- `page.tsx` files have `"use client"` at the top.
- Project pages ship as client bundles.
- React DevTools shows most of the tree hydrated.

**Phase to address:**
Phase 3 onward — continuous discipline. Code review check.

---

### Pitfall 10: CLS from Late-Loading Motion

**What goes wrong:**
Hero copy renders at position A; 300ms later, a Motion-driven animation moves it to position B (its "final" resting spot). That's a layout shift. CLS > 0.1 fails Core Web Vitals. Users see the page "jump" after landing.

**Why it happens:**
Initial-state animations are declared via Motion's `initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}`. The SSR output has the element at `y: 40`; when Motion hydrates, it animates to `y: 0`. If the element is in the first viewport, this counts as CLS.

**How to avoid:**
- For elements visible in the first viewport, use `opacity` transitions only (no transform animations). Opacity shifts are free, don't move layout, don't count as CLS.
- Reserve space explicitly: aspect-ratio containers, fixed heights, or skeleton placeholders for async content.
- For elements below the fold, transform animations are fine (they happen after initial paint, don't count toward CLS).
- Don't animate layout (`width`, `height`, `top`, `left`) ever — use transforms.

**Warning signs:**
- Lighthouse CLS > 0.1.
- Hero text "settles" into place after page load.
- `initial={{ y: ... }}` on first-viewport elements.

**Phase to address:**
Phase 4 — Motion layer.

---

### Pitfall 11: Hover-Only Interactions

**What goes wrong:**
Project cards reveal their description on hover. The underline animation only works with cursor. Tooltips appear on `:hover`. Mobile users and keyboard users never see the hidden content; reduced-motion users never see the reveal. The "high-touch" interactions are literally invisible to a chunk of the audience.

**Why it happens:**
Desktop-first design. Hover is the default interaction model in web dev. Tutorials show hover effects without discussing touch/keyboard fallbacks.

**How to avoid:**
- Every hover interaction has a `:focus-visible` equivalent. If a card description appears on hover, it also appears when tabbed to.
- Content must not require hover to be accessible. Descriptions, links, states that matter are always visible, or revealed via interaction that works for touch (tap, click) and keyboard (focus, enter).
- Test navigation with Tab/Shift-Tab and nothing else — every interactive element must be reachable, every state visible.
- On touch devices, hover becomes "first tap" in many browsers — design for an explicit tap-to-reveal or remove hover-gated content entirely on touch.

**Warning signs:**
- A mobile user can't see project descriptions without entering the project.
- Tab key doesn't reveal what hover reveals.
- Links show underlines only on hover (and have no other affordance).

**Phase to address:**
Phase 3 — Home / project grid. Verified Phase 7 — Accessibility audit.

---

### Pitfall 12: Resume Drift Between HTML and PDF

**What goes wrong:**
`/resume` page has the current version. The downloadable PDF is 6 months old, has a different job at the top, and says "Engineer at Voya" when the HTML says "Contract Engineer at Aktiga." Olive updates one and forgets the other. Recruiters see inconsistent information.

**Why it happens:**
PDF and HTML are built from separate sources. PDF export is a manual "design in Figma, export" process; HTML is JSX with data; they diverge.

**How to avoid:**
- Single source of truth: `content/resume.ts` (or `.mdx`) holding the structured data.
- HTML page renders from that source.
- PDF export: either (a) print CSS targeted at the `/resume` route with `window.print()` affordance, OR (b) server-side PDF generation (React-PDF, Puppeteer route handler) from the same data.
- Never maintain a hand-designed PDF separately.

**Warning signs:**
- `/resume.pdf` is a static asset in `/public` that hasn't been regenerated in months.
- Dates differ between HTML and PDF.
- Resume source lives in Figma / Google Docs instead of the repo.

**Phase to address:**
Phase 5 — Resume page (single source + export mechanism designed together).

---

### Pitfall 13: Broken External Project Links Over Time

**What goes wrong:**
A project card links to a client site, an npm package, a deployed demo, a GitHub repo. Two years later: the client rebranded and moved, the npm package was renamed, the demo URL expired, the repo was archived/renamed. Visitors hit 404s. The portfolio looks neglected.

**Why it happens:**
External links are set-and-forget. No monitoring.

**How to avoid:**
- Each project has a typed `links: { github?, demo?, writeup? }` field — not free-form JSX.
- A simple link-check script (`lychee`, `linkinator`) runs in CI or as a scheduled GitHub Action weekly; breaks the build (or opens an issue) on 4xx/5xx for any project link.
- For archived projects where the external resource no longer exists, explicitly mark the project as `archived: true` and render "archived — external link no longer available" instead of a broken link.
- Prefer permanent artifacts (GitHub repo, Wayback snapshot) over ephemeral ones (client-hosted demo).

**Warning signs:**
- A project link 404s in manual testing.
- No link-check tool in the repo.
- Links are written as raw `<a href>` in JSX rather than typed data.

**Phase to address:**
Phase 2 — Content schema (typed links). Phase 8 — Deploy (CI link check configured).

---

## Minor Pitfalls

### Pitfall 14: Stock Screenshots / Mockups

**What goes wrong:**
Every project uses the same Apple MacBook mockup with the screenshot pasted in. Site looks templated, reinforces AI-aesthetic read. Screenshots are also often low-res and blurry.

**How to avoid:**
Real screenshots cropped to the actual content being discussed (not the whole page), retina 2x resolution (minimum 1600px wide for hero shots), `next/image` with proper sizes. For private projects: bespoke abstract diagrams / architecture visualizations instead of fake UI mocks. Consider a consistent treatment (subtle border, shared background tone) applied programmatically rather than baked into the images.

**Phase to address:**
Phase 5 — Project pages (screenshot treatment decided once, applied consistently).

---

### Pitfall 15: Skills-as-Percentages / Skill Bars

**What goes wrong:**
"JavaScript 95%, React 90%, Python 72%." Nobody believes it, and it reads as amateur. Also: lists 25 technologies with no indicator of depth vs. familiarity, which kills credibility the other direction.

**How to avoid:**
Skills grouped by depth: "Core stack" (languages/frameworks Olive ships production code in), "Working familiarity" (can contribute to, can evaluate), "Aware of" (has used, not an expert). Let project work demonstrate — the stack listed on each project page IS the skill evidence. No numeric proficiency ever.

**Phase to address:**
Phase 5 — About / Resume (skills presentation structure).

---

### Pitfall 16: No Skip-to-Content Link

**What goes wrong:**
Keyboard users have to tab through the entire header + nav every time they visit any page. WCAG 2.4.1 (Bypass Blocks) violation.

**How to avoid:**
First focusable element in `<body>` is a visually-hidden-until-focused `<a href="#main">Skip to content</a>`. `<main id="main">` wraps page content. ~10 lines of code, prevents one of the most common a11y audit failures.

**Phase to address:**
Phase 3 — Layout / shell (added once in root layout).

---

### Pitfall 17: JS-Gated Content

**What goes wrong:**
Project descriptions, bio, nav are rendered only after client-side hydration (because they're inside `"use client"` components fetching from a client-side source). Crawlers see a blank page. Shared links have no preview content. No-JS users (some privacy-focused setups) see nothing.

**How to avoid:**
All static content renders server-side. `view-source:` on any page shows the actual copy. Client components are for interactivity layered onto SSR'd content, never for delivering the core content.

**Phase to address:**
Phase 3 — Home, Phase 5 — Projects. Verified with `curl` in Phase 7.

---

### Pitfall 18: Outdated Projects List

**What goes wrong:**
Most recent project is from 2023. Site signals "inactive engineer." For a portfolio whose point is "current work reflecting thesis," this is maximally bad. (Per every "portfolio mistakes" listicle: #1 problem.)

**How to avoid:**
- Each project has a `updated_at` field. Homepage surfaces "most recently updated" naturally.
- Calendar reminder to review the portfolio monthly (not in code — personal discipline).
- Low-friction content path (Pitfall 4) so updating is cheap. The architecture should make "add Myco milestone summary" a 5-minute task.

**Phase to address:**
Phase 2 — Content architecture enables this; Phase 8 onward is human discipline.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hardcoding project data in `page.tsx` files | Ship first project page in an hour | Every new project needs a new file, homepage JSX edited, schema inconsistent | Never — schema must exist before page 1 |
| Using default Tailwind color palette (indigo/purple) | No design work needed | AI-aesthetic read, hard to differentiate, retokenization is invasive | Never for this brief |
| Skipping `opengraph-image` routes per project | Ship faster | Every share looks generic; retrofitting means touching every project | MVP only, but backfill before domain launch |
| `"use client"` on layout to enable one menu button | Fixes immediate error | Entire layout ships as client bundle | Never — push boundary down to the menu button |
| `outline: none` on focused elements with no replacement | Removes "ugly ring" | WCAG violation, keyboard users lose nav | Never |
| Manual PDF resume alongside HTML | Ship PDF before HTML is ready | Dates drift within weeks | Only if flagged as "temporary until HTML/PDF pipeline exists" |
| Single MDX component import style inconsistent per file | Whatever's easy per file | Bundle duplication, hard to rename components | Never — use global `mdx-components.tsx` |
| Animating first-viewport elements with transforms | Looks nice on desktop | CLS regression, Lighthouse drop | Only with explicit aspect-ratio reservation AND measured CLS impact |
| Listing every project ever made | "Comprehensive" | Dilutes signal, buries current work | Never — curate ruthlessly |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Vercel deploy | Assuming Vercel subdomain URL is permanent; hardcoding it in canonicals / OG URLs | Use `NEXT_PUBLIC_SITE_URL` env var; plan for domain change |
| `next/image` with external sources | Linking GitHub raw image URLs or unsplash | Host images in `/public` or use configured remote patterns; external sources break eventually |
| GitHub API (for live repo stats) | Rate limits hit on every page load; tokens exposed | Build-time fetch + revalidate, or ISR. Never client-side with a token |
| LinkedIn / social oEmbed | Linking profile for "more work" | Static link to `linkedin.com/in/...`; don't embed LinkedIn widgets (bloat + tracking) |
| Analytics (if added later, out of v1 scope) | Adding Vercel Analytics + Plausible + GA together | Pick one; measure don't hoard. Respect DNT. |
| Email contact | `mailto:` link with plain address → spam | `mailto:` is fine for a portfolio audience; obfuscation is theater. Or route through a form + server action + rate limit |
| MDX + client components | MDX imports a client component; bundle per-project grows | Curated `mdx-components.tsx` with small, reused client islands only |
| `next/font` | Loading Google Fonts directly via `<link>` in head | Always `next/font/google` or `next/font/local` — self-host + subset automatic |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Full Framer Motion import | First Load JS > 150KB | `LazyMotion` + `m` component | Immediately noticeable on 4G mobile |
| Hero video autoplay | LCP 4-8s mobile, data consumption | Poster image + play-on-interaction, reduced-data media query | First visit on cellular |
| Uncompressed screenshots | Network tab shows 1-3MB images | `next/image` AVIF/WebP, max 200KB per hero image | Any mobile visitor |
| Tailwind purge misconfig (safelist bloat) | 100KB+ CSS in production | Audit `safelist` config, measure CSS output | Every visit; quiet regression |
| Many `"use client"` boundaries | Slow hydration, high FID/INP | Server components default, client only where needed | As site grows past ~5 pages |
| Re-rendering on scroll | Frame drops during scroll, hot CPU on mobile | Intersection Observer for visibility; `will-change` judiciously; avoid scroll event listeners that read layout | Motion-heavy pages on mid-range Android |
| Runtime MDX compilation | Slow route response | Static generation at build | Any page load if misconfigured |
| Icon libraries imported whole | `lucide-react` or `@heroicons` full import adds 50KB+ | Tree-shakeable named imports only; verify in bundle analyzer | Persistent; shows on all routes |

---

## Security Mistakes

Portfolio-specific risks beyond OWASP basics:

| Mistake | Risk | Prevention |
|---------|------|------------|
| Leaking internal Aktiga / Agenda Keeper details in case studies | NDA / relationship damage, potential legal | Explicit redaction review per case study; default to abstract architecture diagrams for private work |
| Committing secrets to MDX (API keys in code examples) | Public repo exposure | Pre-commit hook (e.g., `gitleaks`) + CI secret scan; use placeholders in code examples |
| Screenshots containing real customer data, names, emails, session IDs | Privacy violation, NDA breach | Screenshot review checklist; use anonymized demo data; blur/crop as needed |
| Public metrics from private projects (revenue, user counts) | Client/employer relationship damage | Never quote private-project metrics without explicit written clearance; omit rather than approximate |
| Contact form endpoint without rate limit | Spam vector, potential cost | Rate-limit server action; honeypot field; `mailto:` is safer for v1 |
| Exposing `x-powered-by` / verbose error pages | Fingerprinting assistance | `poweredByHeader: false` in `next.config`; production error pages don't leak stacks |
| Hardcoding email in HTML without thinking about scraping | Increased spam | Acceptable for a portfolio of this scale; monitor and move to form if it becomes a problem |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Scroll-hijacking / smooth-scrolling the page for "effect" | Users lose orientation, back button feels broken, motion sickness | Respect native scroll behavior; no GSAP smooth-scroll unless there's a dedicated reason, and always gate on `prefers-reduced-motion` |
| Page transitions that delay navigation | Perceived slowness, bounce | Transitions ≤200ms, skippable, no content blocking during transition |
| Non-standard cursor effects (custom cursor dots, magnetic buttons) | Cognitive overhead, conflict with system tools (screen readers, accessibility zoom) | Skip entirely, or provide an off switch. Usually not worth the cost on a portfolio that wants to be taken seriously |
| Full-screen hero with no scroll affordance | Users don't know more exists below | Scroll indicator (subtle), or overlapping content peeking above the fold |
| Nav that hides on scroll down | Users lose orientation on long project pages | Keep nav accessible; at minimum, keyboard shortcut or "back to top" |
| Dark theme forcing light-theme users | Some users strongly prefer light | V1 is dark-only by brief; be willing to revisit if feedback shows pain. Don't hide a secret toggle |
| Unclear "you are here" on nav | Users don't know which section they're viewing | Active link state with measurable contrast (not just color shift) |
| Case studies without outcomes | "Nice project but what happened?" | Every case study ends with outcomes (shipped, learned, what changed). Placeholder: "outcomes in progress — ask" is honest and acceptable |
| No contact affordance above the fold anywhere | Visitors who want to reach out bounce | Contact link in nav + footer, minimum |
| Photo-heavy pages with no text alternatives | Blind users, SEO, "what is this?" problem | Every meaningful image has descriptive `alt`. Decorative images: `alt=""` explicitly |

---

## "Looks Done But Isn't" Checklist

- [ ] **Dark theme:** Looks great on OLED at night — verify contrast on a 200-nit LCD in a bright room and run a contrast checker on every token pair.
- [ ] **Animations:** Work smoothly on a new MacBook — verify on a mid-range Android in Chrome with "Slow 4G" + 4x CPU throttle in DevTools.
- [ ] **Motion:** Animations look intentional — verify every animation has a `prefers-reduced-motion` branch by toggling OS setting.
- [ ] **Hero:** LCP looks fast on dev — verify measured LCP on production Vercel deploy with throttled profile ≤2.5s.
- [ ] **OG images:** Look custom on one project — verify every page has unique OG (paste 5 URLs into a Slack channel).
- [ ] **Sitemap:** Exists at `/sitemap.xml` — verify it includes every project and updates when a project is added.
- [ ] **Typography:** Display font loaded — verify no FOIT (flash of invisible text) on cold load; test with DevTools "Disable cache" + throttle.
- [ ] **Content:** Copy reads as Olive's voice — verify no "passionate," "award-winning," "scalable solutions," "10x."
- [ ] **Keyboard nav:** Works for clicking around — verify full Tab traversal hits every interactive element with visible focus ring.
- [ ] **Skip link:** Not needed because "small site" — verify it exists; first Tab press should reveal it.
- [ ] **Resume PDF:** Downloads correctly — verify date in the PDF matches date in the HTML (and the most recent role is at the top).
- [ ] **Project links:** All clickable — verify none 404 (run a link checker).
- [ ] **Private projects:** Clear they're private — verify no proprietary details leak, no fake screenshots, no overclaimed attribution.
- [ ] **Mobile:** Looks fine on an iPhone — verify on an actual Android device, not just Chrome responsive mode.
- [ ] **Reduced-motion toggle:** OS preference respected — verify a manual toggle also exists and persists.
- [ ] **Social preview:** Shared link has a preview — paste into Slack, iMessage, Twitter/X, LinkedIn; confirm each renders correctly.
- [ ] **Zero-JS fallback:** Content readable with JS disabled — toggle "Disable JavaScript" in DevTools; content should still be readable (minus interactions).

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| AI-aesthetic tells | MEDIUM | Rework tokens, re-render every component. Usually requires design revisit, not just code. 1-2 days focused work |
| Missing reduced-motion gates | LOW | Add `MotionConfig reducedMotion="user"` at root + global CSS safety net. Hours, not days |
| Blown LCP | MEDIUM | Swap hero strategy (image vs. typography vs. lazy-motion), verify with Lighthouse. 2-4 hours per page |
| Content coupled to components | HIGH | Requires schema-first refactor; migrating existing projects takes ~30 min each. Do before content volume grows |
| Dark theme contrast | LOW–MEDIUM | Retokenize color scale; re-audit all pages. Half day |
| Missing OG images / metadata | LOW | Add one `opengraph-image.tsx` template + `generateMetadata` function; applies across projects from schema. Hours |
| Overclaiming case studies | LOW cost, HIGH stakes | Rewrite voice + add contribution fields; legal/relational risk of not fixing is high |
| Framer Motion bloat | LOW | Swap to `LazyMotion` + `m` components — mostly mechanical find/replace |
| Too many client components | MEDIUM | Requires thinking per component: can this be server? Push boundaries down. Ongoing discipline |
| CLS from motion | LOW | Switch first-viewport animations to opacity-only; reserve space with aspect-ratio |
| Hover-only interactions | LOW | Add `:focus-visible` mirror to every `:hover` rule. Mechanical |
| Resume drift | MEDIUM | Rebuild PDF pipeline from HTML source of truth; one-time cost, then free |
| Broken external links | LOW (with tooling) | Add link checker to CI; fix flagged links as they appear |
| Stale projects list | LOW tech, HIGH personal | Low-friction content path (addressed in schema) + human discipline |

---

## Pitfall-to-Phase Mapping

Phases below are illustrative and will be finalized in roadmap creation. This table gives the roadmap author a concrete anchor for each pitfall.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| 1. AI-aesthetic tells | Phase 2: Design system / foundations | Designer/peer review before Phase 3 starts; "does this look like v0?" check |
| 2. `prefers-reduced-motion` | Phase 4: Motion layer (from day 1) | OS toggle test on every animated page before Phase 5 |
| 3. LCP blown by hero | Phase 3: Home page | Lighthouse mobile LCP ≤2.5s on throttled profile before phase exit |
| 4. Content coupled to components | Phase 2: Content architecture | "Add a dummy project in <10 min" test before Phase 5 starts |
| 5. Dark theme contrast | Phase 2: Design system | Contrast checker run on all token pairs before components ship |
| 6. SEO/OG metadata | Phase 5: Project pages (scaffold) + Phase 8: Deploy (verify) | Slack-paste test of 5 URLs; sitemap returns 200 with all routes |
| 7. Overclaiming on private work | Phase 6: Content pass | Olive reviews every case study for overclaim + leak |
| 8. Framer Motion bundle | Phase 4: Motion layer | `@next/bundle-analyzer` shows landing <150KB First Load JS |
| 9. Too many client components | Phase 3 onward (continuous) | Grep `"use client"` count stays <10 |
| 10. CLS from motion | Phase 4: Motion layer | Lighthouse CLS ≤0.1 before phase exit |
| 11. Hover-only interactions | Phase 3: Home / grid | Keyboard-only traversal reveals all states |
| 12. Resume drift | Phase 5: Resume page | Single source verified; PDF regenerated from HTML source |
| 13. Broken external links | Phase 2 (schema) + Phase 8 (CI check) | Link checker in CI |
| 14. Stock screenshots | Phase 5: Project pages | Real content review before Phase 6 |
| 15. Skills-as-percentages | Phase 5: About/Resume | Copy review — no numeric proficiency |
| 16. No skip-link | Phase 3: Shell | Tab-once-from-load test |
| 17. JS-gated content | Phase 3 + 5 | `view-source:` + `curl` test shows full content |
| 18. Outdated projects list | Phase 2 (enable) + ongoing (discipline) | `updated_at` surfacing + monthly review calendar (personal) |

---

## Sources

- [Next.js App Router common mistakes (Upsun)](https://upsun.com/blog/avoid-common-mistakes-with-next-js-app-router/) — HIGH confidence (aligns with official Next.js production checklist)
- [Next.js production checklist (official)](https://nextjs.org/docs/app/guides/production-checklist) — HIGH
- [React Server Components performance mistakes (LogRocket)](https://blog.logrocket.com/react-server-components-performance-mistakes) — HIGH
- [Motion bundle size reduction (official docs)](https://motion.dev/docs/react-reduce-bundle-size) — HIGH (official)
- [LazyMotion guide (Motion)](https://motion.dev/docs/react-lazy-motion) — HIGH (official)
- [Next.js Image component docs (Next 16)](https://nextjs.org/docs/app/api-reference/components/image) — HIGH
- [Next.js OG images + metadata (official)](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) — HIGH
- [Next.js opengraph-image file convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image) — HIGH
- [Why AI keeps building the same purple gradient website](https://prg.sh/ramblings/Why-Your-AI-Keeps-Building-the-Same-Purple-Gradient-Website) — MEDIUM (essay, but widely cited pattern)
- [The AI Purple Problem (DEV)](https://dev.to/jaainil/ai-purple-problem-make-your-ui-unmistakable-3ono) — MEDIUM
- [prefers-reduced-motion (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) — HIGH (official)
- [prefers-reduced-motion no-motion-first (Tatiana Mac)](https://www.tatianamac.com/posts/prefers-reduced-motion) — HIGH (frequently cited accessibility guidance)
- [web.dev: prefers-reduced-motion](https://web.dev/articles/prefers-reduced-motion) — HIGH (official Google)
- [Inclusive Dark Mode (Smashing Magazine, 2025-04)](https://www.smashingmagazine.com/2025/04/inclusive-dark-mode-designing-accessible-dark-themes/) — HIGH
- [WebAIM contrast guidance](https://webaim.org/articles/contrast/) — HIGH (authoritative accessibility org)
- [7 Deadly Sins of Developer Portfolios (Pesto)](https://pesto.tech/resources/7-deadly-sins-of-developer-portfolios-and-how-to-avoid-them) — MEDIUM (listicle, but consistent with other sources)
- [5 Most Common Developer Portfolio Mistakes (David Walsh)](https://davidwalsh.name/5-most-common-developer-portfolio-mistakes) — MEDIUM
- [How to Handle NDAs in Portfolios (IxDF)](https://www.interaction-design.org/literature/article/how-to-handle-non-disclosure-agreements-ndas-when-you-write-your-ux-case-study) — HIGH (established design education org)
- [Performant scroll animations in React (nray.dev)](https://www.nray.dev/blog/how-to-create-performant-scroll-animations-in-react/) — MEDIUM
- [CSS-Tricks: scroll-driven animations](https://css-tricks.com/unleash-the-power-of-scroll-driven-animations/) — HIGH
- [Tailwind focus-visible docs](https://v2.tailwindcss.com/docs/hover-focus-and-other-states) — HIGH (official)
- [Personal domain knowledge: Next.js App Router, Motion, MDX, Tailwind v3+, Vercel deploy patterns] — HIGH (practitioner consensus)

---
*Pitfalls research for: Personal developer portfolio (Olive Elliott, olivelliott.dev) — Next.js App Router, dark-theme, high-touch, motion-forward*
*Researched: 2026-04-18*
