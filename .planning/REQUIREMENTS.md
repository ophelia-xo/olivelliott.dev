# Requirements: olivelliott.dev

**Defined:** 2026-04-18
**Core Value:** The site must accurately reflect current work — Myco, Fathom, Agenda Keeper, Trade Bot, Stemz, and Aktiga contributions — in a way that communicates Olive's thesis about building for autonomy and local-first systems, and feels high-touch (typography, motion, detail) rather than templated.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Foundation

- [ ] **FND-01**: Site is a Next.js 16+ App Router project with React 19 and TypeScript strict mode
- [ ] **FND-02**: Tailwind CSS v4 is configured CSS-first with a `@theme` token layer (colors, type scale, spacing, motion durations, easing curves)
- [ ] **FND-03**: Geist Sans and Geist Mono are loaded via `next/font` and set as the default font stack
- [ ] **FND-04**: Biome is configured for lint + format (replacing ESLint/Prettier)
- [ ] **FND-05**: A single `<MotionProvider>` wraps the app with `LazyMotion` and `MotionConfig reducedMotion="user"` so every animation inherits reduced-motion gating
- [ ] **FND-06**: Dark theme is the default and only theme; no light-mode toggle in v1
- [ ] **FND-07**: All foreground/background color pairs meet WCAG AA contrast minimums
- [ ] **FND-08**: Root layout includes a skip-to-content link and keyboard-navigable nav

### Content pipeline

- [x] **CNT-01**: Content Collections is configured to compile MDX files under `content/projects/`
- [x] **CNT-02**: Projects have a Zod-validated frontmatter schema (slug, title, year, tags[], tier: hero|secondary, privacy: public|private, hero image, summary, links, outcomes)
- [x] **CNT-03**: The schema transform auto-adds a `code-private` tag for privacy:private projects and strips any `links.repo` field
- [x] **CNT-04**: A derived tag index and query helpers are exposed for consumers (home, projects page)
- [x] **CNT-05**: One hero project MDX (Myco) is authored from the existing README as the first real content file
- [x] **CNT-06**: Private-project content passes a redaction review — no internal details, no proprietary claims, no unreleased-feature references

### Project detail template

- [x] **PRJ-01**: `/projects/[slug]` renders statically via `generateStaticParams` with `dynamicParams = false`
- [x] **PRJ-02**: MDX renders with custom components for gallery, figure, callout, and code block (Shiki syntax highlighting)
- [x] **PRJ-03**: Each project page follows a Problem → Approach → Outcome structure for hero-tier projects (800–1500 words)
- [x] **PRJ-04**: Each project page has a hero treatment (title, year, tags, hero image or deliberate text-only treatment)
- [x] **PRJ-05**: Each project page ends with a "next project" navigation link to keep visitors moving
- [x] **PRJ-06**: Private projects display a visible "code private" tag in place of any repo link
- [x] **PRJ-07**: Each project page has per-route metadata (title, description) and an OG image (static per-project image acceptable for v1)

### Home page

- [ ] **HOM-01**: Home page has a hero section with a one-sentence thesis (engineer / autonomous workflows / local-first / freedom for the other things in life)
- [x] **HOM-02**: Home page features the hero-tier projects (Myco, Fathom, Agenda Keeper) with larger cards
- [x] **HOM-03**: Home page shows secondary-tier projects (Trade Bot, Stemz, Aktiga, plus selected older work) as smaller cards below the hero tier
- [ ] **HOM-04**: Home page layout is deliberately not a bento grid and does not use the stagger-on-scroll anti-pattern
- [x] **HOM-05**: Home page hero has an earned, restrained motion moment (e.g., type-set entrance or cursor-reactive detail) that respects reduced-motion

### Projects index

- [ ] **PIX-01**: `/projects` page lists all projects with a filterable tag chip row
- [ ] **PIX-02**: Tag filter state is URL-synced (`?tag=local-first`) so filters are shareable and back-button works
- [ ] **PIX-03**: Tag chips are fully keyboard-navigable with visible focus styles
- [x] **PIX-04**: Project cards visually indicate hero vs secondary tier and public vs private

### About page

- [ ] **ABT-01**: `/about` page contains a real bio (not AI-generated "passionate developer" copy) reflecting the polymath / autonomous-workflows thesis
- [ ] **ABT-02**: About page anchors the current role at Aktiga
- [ ] **ABT-03**: About page includes values / interests the thesis rests on (open-source communities, local-first systems, a world we want to live in)

### Resume

- [ ] **RES-01**: Resume content is stored in a typed source-of-truth file (TypeScript or MDX) — not duplicated
- [ ] **RES-02**: `/resume` route renders the resume as an HTML page from the source-of-truth
- [ ] **RES-03**: `/resume` route has dedicated print CSS (`@media print`) so the same React tree prints correctly
- [ ] **RES-04**: A build-step using Puppeteer (or equivalent) produces `/public/resume.pdf` from the `/resume` page
- [ ] **RES-05**: The resume PDF is linked as a visible download on `/resume` and in the footer
- [ ] **RES-06**: Resume content reflects current work, current role, real skills — no stale or fabricated entries

### Metadata + SEO + OG

- [ ] **MTA-01**: Every route has `generateMetadata` producing a unique title and description
- [ ] **MTA-02**: Every route has an OG image (Twitter card + Open Graph) — static per-route for v1, dynamic later
- [ ] **MTA-03**: A valid `sitemap.xml` is generated and a `robots.txt` is present
- [ ] **MTA-04**: Favicon set is in place (SVG + ICO + apple-touch)

### Contact + socials

- [ ] **CTC-01**: Footer includes working links for GitHub, email, and LinkedIn
- [ ] **CTC-02**: Email is a `mailto:` link with a pre-filled subject appropriate to a portfolio contact
- [ ] **CTC-03**: Contact affordances appear in at least two places (About and footer)

### Performance + a11y gate

- [ ] **QAL-01**: Lighthouse scores ≥ 90 across Performance / Accessibility / Best Practices / SEO on the home page and one hero project page on the deployed build
- [ ] **QAL-02**: axe-core or equivalent a11y scan is clean on home, one project page, and `/resume`
- [ ] **QAL-03**: All interactions work via keyboard only (nav, tag filters, resume download)
- [ ] **QAL-04**: Reduced-motion OS setting disables decorative motion across the site
- [ ] **QAL-05**: Launch checklist verifies none of the 19 anti-features from research/FEATURES.md slipped in (skill bars, gradient-on-gradient, stagger-everything, etc.)

### Deploy

- [ ] **DPL-01**: Every push to `main` deploys to Vercel automatically
- [ ] **DPL-02**: Site is reachable at a Vercel subdomain (custom domain deferred)
- [ ] **DPL-03**: Vercel Analytics is enabled for basic visit tracking

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Writing / notes

- **WRT-01**: `/writing` route for essays and notes
- **WRT-02**: Writing MDX schema with reading time, publish date, topic tags
- **WRT-03**: Writing index page with reverse-chronological list

### Discoverability / UX polish

- **CMD-01**: Command palette (⌘K) for navigating routes, socials, and tag filters
- **VTX-01**: View Transitions API for cross-route motion continuity
- **DYN-01**: Dynamic OG image generation via `next/og` instead of static per-project images

### Content depth

- **CNT2-01**: Custom illustrations per hero project (not stock screenshots)
- **CNT2-02**: Per-project accent color system
- **CNT2-03**: Project gallery lightbox with keyboard navigation

### Surface additions

- **NEW-01**: `/uses` page — tools, hardware, editor setup
- **NEW-02**: `/now` page — what Olive is currently working on, monthly cadence
- **NEW-03**: Booking link (Cal.com) alongside email

### Domain + ops

- **OPS-01**: Custom domain registered and pointed at Vercel
- **OPS-02**: Email hosting on custom domain
- **OPS-03**: Uptime / deploy-status notifications

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Web3 / crypto / token framing | Decentralized here means local-first + mesh/edge/P2P, not on-chain |
| CMS / headless content backend | In-repo MDX is simpler and faster for this scale; no CMS dependency in v1 |
| Blog comments, newsletter signup, testimonials carousel | Not fit for this audience, known anti-features in the genre |
| Light-mode toggle | Dark-only matches reference aesthetic and halves polish debt |
| Custom domain registration in v1 | Ship fast on Vercel subdomain first; domain deferred |
| Hiring-manager-optimized layout (skill bars, years-of-experience headline) | Positioning is for collaborators/peers/clients; anti-features per research |
| i18n / multi-language | Single-language (English) in v1 |
| Dedicated /thesis or /manifesto essay page | Thesis is expressed via tags and project framing, not a manifesto |
| 3D / WebGL hero (R3F) | No earned use case in v1; AI-template tell |
| Lottie / heavy animation libraries beyond Motion | Custom SVG + CSS + Motion covers the brief without bloat |
| Testimonials / client logos | None to show; premature signalling |
| Scroll-triggered stagger animations | Anti-feature per research; motion must be earned, not sprinkled |

## Traceability

Which phases cover which requirements. Populated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FND-01 | Phase 1 — Foundation | Pending |
| FND-02 | Phase 1 — Foundation | Pending |
| FND-03 | Phase 1 — Foundation | Pending |
| FND-04 | Phase 1 — Foundation | Pending |
| FND-05 | Phase 1 — Foundation | Pending |
| FND-06 | Phase 1 — Foundation | Pending |
| FND-07 | Phase 1 — Foundation | Pending |
| FND-08 | Phase 1 — Foundation | Pending |
| CNT-01 | Phase 2 — Content Pipeline | Complete |
| CNT-02 | Phase 2 — Content Pipeline | Complete |
| CNT-03 | Phase 2 — Content Pipeline | Complete |
| CNT-04 | Phase 2 — Content Pipeline | Complete |
| CNT-05 | Phase 2 — Content Pipeline | Complete |
| CNT-06 | Phase 2 — Content Pipeline | Complete |
| PRJ-01 | Phase 3 — Project Detail Template | Complete |
| PRJ-02 | Phase 3 — Project Detail Template | Complete |
| PRJ-03 | Phase 3 — Project Detail Template | Complete |
| PRJ-04 | Phase 3 — Project Detail Template | Complete |
| PRJ-05 | Phase 3 — Project Detail Template | Complete |
| PRJ-06 | Phase 3 — Project Detail Template | Complete |
| PRJ-07 | Phase 3 — Project Detail Template | Complete |
| HOM-01 | Phase 4 — Home + Projects Index | Pending |
| HOM-02 | Phase 4 — Home + Projects Index | Complete |
| HOM-03 | Phase 4 — Home + Projects Index | Complete |
| HOM-04 | Phase 4 — Home + Projects Index | Pending |
| HOM-05 | Phase 4 — Home + Projects Index | Complete |
| PIX-01 | Phase 4 — Home + Projects Index | Pending |
| PIX-02 | Phase 4 — Home + Projects Index | Pending |
| PIX-03 | Phase 4 — Home + Projects Index | Pending |
| PIX-04 | Phase 4 — Home + Projects Index | Complete |
| ABT-01 | Phase 5 — About + Resume + Contact | Pending |
| ABT-02 | Phase 5 — About + Resume + Contact | Pending |
| ABT-03 | Phase 5 — About + Resume + Contact | Pending |
| RES-01 | Phase 5 — About + Resume + Contact | Pending |
| RES-02 | Phase 5 — About + Resume + Contact | Pending |
| RES-03 | Phase 5 — About + Resume + Contact | Pending |
| RES-04 | Phase 5 — About + Resume + Contact | Pending |
| RES-05 | Phase 5 — About + Resume + Contact | Pending |
| RES-06 | Phase 5 — About + Resume + Contact | Pending |
| CTC-01 | Phase 5 — About + Resume + Contact | Pending |
| CTC-02 | Phase 5 — About + Resume + Contact | Pending |
| CTC-03 | Phase 5 — About + Resume + Contact | Pending |
| MTA-01 | Phase 6 — SEO, OG, A11y & Performance Audit | Pending |
| MTA-02 | Phase 6 — SEO, OG, A11y & Performance Audit | Pending |
| MTA-03 | Phase 6 — SEO, OG, A11y & Performance Audit | Pending |
| MTA-04 | Phase 6 — SEO, OG, A11y & Performance Audit | Pending |
| QAL-01 | Phase 6 — SEO, OG, A11y & Performance Audit | Pending |
| QAL-02 | Phase 6 — SEO, OG, A11y & Performance Audit | Pending |
| QAL-03 | Phase 6 — SEO, OG, A11y & Performance Audit | Pending |
| QAL-04 | Phase 6 — SEO, OG, A11y & Performance Audit | Pending |
| QAL-05 | Phase 6 — SEO, OG, A11y & Performance Audit | Pending |
| DPL-01 | Phase 1 — Foundation | Pending |
| DPL-02 | Phase 7 — Content Pass + Launch | Pending |
| DPL-03 | Phase 7 — Content Pass + Launch | Pending |

**Coverage:**
- v1 requirements: 54 total
- Mapped to phases: 54
- Unmapped: 0

---
*Requirements defined: 2026-04-18*
*Last updated: 2026-04-18 after roadmap creation (traceability populated)*
