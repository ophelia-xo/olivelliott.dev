# Feature Research

**Domain:** Personal developer/engineer portfolio site (high-touch, curated, dark aesthetic)
**Researched:** 2026-04-18
**Confidence:** HIGH (synthesized from ~15 current sources including firsthand analysis of reference sites like brittanychiang.com, paco.me, and genre-defining aggregators like wallofportfolios.in; aligned with PROJECT.md)

## Scope Frame

This research is for `olivelliott.dev` — a calling card for decentralized/local-first collaborators, peer engineers, and client leads (hiring managers are the *lowest* priority audience). That audience weighting matters: features optimized for applicant-tracking recruiters (skill percentages, years-of-experience banners, inline resume summaries) are actively counterproductive here. A peer/collaborator audience reads code comments, notices motion choices, and can smell a template within two scrolls.

The reference aesthetic (wallofportfolios.in → minimalist + dark-theme + bento-adjacent collection) and the stated core value ("feels high-touch, not templated") define the quality bar. Every feature below is categorized with that bar in mind.

## Feature Landscape

### Table Stakes (Users Expect These)

Missing any of these makes the site read as unfinished, broken, or unserious. Peers/clients don't give credit for having them — they silently deduct credit when they're missing.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Working responsive layout (mobile / tablet / desktop)** | Non-negotiable in 2026; mobile broken = site broken | LOW | Tailwind breakpoints; verify at 375px, 768px, 1280px, 1920px |
| **Full metadata (title, description, canonical, OG, Twitter card)** | Link previews in Slack/Discord/iMessage are how the site is shared | LOW | Next.js `generateMetadata` + `metadataBase` in root layout |
| **OG image per route** | Without this, every share looks identical and bland | MEDIUM | Use Next.js `ImageResponse` (JSX→PNG) for dynamic per-project OG cards |
| **Favicon set (ico, SVG, apple-touch-icon)** | Browser tab / bookmark / iOS homescreen all expect it | LOW | Next.js `app/icon.tsx` or static files |
| **Semantic HTML + `<main>`, `<nav>`, skip-to-content** | Accessibility floor; keyboard users hit Tab first | LOW | One `<a class="sr-only">` link at top |
| **Keyboard navigation (all interactive elements tab-reachable, visible focus ring)** | Half of peer-dev audience tests this reflexively | LOW | Tailwind `focus-visible:` utilities; custom ring color for brand |
| **`prefers-reduced-motion` support for every animation** | WCAG 2.3.3; a site with motion but no reduced-motion path reads as careless | LOW | Wrap Framer Motion in `useReducedMotion` hook; CSS `@media (prefers-reduced-motion: reduce)` fallback |
| **Sufficient contrast in dark theme (WCAG AA)** | Dark-theme-only makes contrast failures more likely, not less | LOW | Body text ≥ 4.5:1 against bg; use a checker on every color pair |
| **Header/nav that handles scroll (stays usable on long pages)** | Project pages will be long; users need to navigate without scroll-to-top | LOW | Either sticky translucent header or an anchor jumper; not both |
| **404 page (branded, not default Next.js)** | Typos happen; default 404 breaks aesthetic illusion | LOW | Custom `app/not-found.tsx` with at least one "home" link |
| **Working external links (GitHub, email, LinkedIn)** | These are what people actually *click* — broken `mailto:` = instant disqualifier | LOW | `rel="noopener noreferrer"`, correct email, test every link pre-launch |
| **Project cards link to real content (not "coming soon" for hero tier)** | Hero projects with dead detail pages read as unfinished | LOW | Myco, Fathom, Agenda Keeper must all have full pages at launch |
| **Copyright / last-updated / footer identity** | Not legally needed, but absence reads as unfinished | LOW | Minimal footer: name + year + maybe a build-timestamp or git-sha |
| **Lighthouse ≥ 90 on landing + hero project pages** | Stated project constraint; also a signal to dev peers | MEDIUM | Next/Image, font preload, no layout shift, no render-blocking motion |
| **`sitemap.xml` and `robots.txt`** | Google/Bing indexing + crawler hygiene | LOW | Next.js `app/sitemap.ts` + `app/robots.ts` |
| **HTTPS + security headers (CSP basics, Referrer-Policy)** | Vercel handles HTTPS; headers are a quick `next.config.js` add | LOW | Don't obsess — add sensible defaults |
| **Hero with name + one-line positioning + clear navigation affordance** | Every visitor's first 3 seconds decide stay-or-bounce | LOW | One sentence, not a paragraph; avoid the "I am a passionate developer" cliché |
| **Project grid / list with titles, short descriptions, and tech tags** | Without this, visitors can't scan to the project they care about | LOW | 3-6 visible items; tags reinforce thesis (local-first, autonomous, OSS) |
| **About page with plausible first-person voice** | Absence reads as "didn't care enough to write about yourself" | LOW | ~200-400 words; no "passionate about cutting-edge"; concrete > generic |
| **Contact path (at minimum an email)** | Calling-card purpose fails without it | LOW | Plain `mailto:` is fine — no form needed for v1 |

### Differentiators (Competitive Advantage)

These are where olivelliott.dev stops looking like a Vercel template and starts looking like Olive's. They should directly reinforce the thesis (local-first, autonomous, craftsmanship) and the reference aesthetic (restrained + typographic + deliberate).

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Deliberate typography system (1-2 faces, modular scale, generous leading)** | Single biggest signal of "high-touch"; reference sites all nail this | MEDIUM | Pair a display serif/sans with a mono for code/tags; `next/font` with preload; establish type scale before anything else |
| **Custom OG images with project name + tag + accent** | Makes every shared link feel considered; peers notice | MEDIUM | Generate per-project via `ImageResponse`; use site's actual typography, not generic |
| **Problem → Approach → Outcome case study structure** | The 2026-current format; outcome-led stories beat process dumps | MEDIUM | 800-1500 words per hero project; lead with outcome, not "I built a thing" |
| **"Code private" affordance for private projects** | Honest signaling that projects exist without leaking details; reads as credible | LOW | Subtle lock icon or tag next to project title; no broken "View Code" buttons |
| **Project tags that reinforce thesis (local-first, autonomous, OSS, agentic)** | Tags do the work a manifesto page would do — pattern across projects | LOW | Keep to 5-8 total tags; don't dilute; tags should be filterable even if filter UI deferred |
| **Command palette (⌘K) for navigation** | Peer/dev audience recognizes this immediately as "this person ships tools"; paco.me, Linear, Vercel all have it | MEDIUM | `cmdk` library (by Paco Coursey); routes + social links + theme toggle if added; keep scope tight, don't ship if you can't ship it well |
| **Per-project hero treatment (not a shared template)** | Each hero project gets its own visual identity within a shared structure | MEDIUM-HIGH | Myco = mycelial/network motif; Fathom = depth/measurement motif; Agenda Keeper = calendar/structure motif; subtle, not illustrative |
| **Thoughtful 404 page (not "page not found")** | Low-cost high-signal craft moment | LOW | Keep it short, on-brand, one witty line max, always functional |
| **Restrained motion language: consistent easing + duration tokens** | One "motion voice" across the site is more impressive than 10 different animations | MEDIUM | Define 2-3 easing curves + 2-3 durations as tokens; use everywhere; avoid per-component one-offs |
| **View transitions for in-page navigation (project → project)** | Makes the site feel like an app, not a brochure | MEDIUM | Use the native View Transitions API (Next.js 15+ supports); fallback gracefully when unsupported |
| **Subtle console message / view-source comment** | Pure easter egg for peer-dev audience; shows you know they look | LOW | One-liner in `console.log` or HTML comment; ASCII signature + email/social; resist the urge to be cute about it |
| **Next-project navigation at end of each case study** | Keeps the peer reading; mirrors real editorial publishing | LOW | "Next: Fathom →" pattern; loops at the end of the set |
| **HTML resume + PDF export from single source of truth** | Recruiters see PDF; peers see HTML; both stay in sync | MEDIUM | Single TS/MDX source → rendered HTML page + `@react-pdf/renderer` or Puppeteer-generated PDF at build time |
| **Thesis expressed through project framing (not a `/thesis` page)** | PROJECT.md explicitly rules out a manifesto page; thesis should emerge from pattern | LOW | Every case study's "Why" paragraph ties back to autonomy/local-first; do this in content, not chrome |
| **Subtle hover/focus treatments on project cards (not full-card bounce)** | Gives the grid life without being childish | LOW | Opacity shift on siblings, cursor-positioned highlight, or gentle border-lift; one treatment, used consistently |
| **Typographic detail touches (ligatures, numerals, optical sizing)** | The kind of thing dev peers notice; cumulative impression of care | LOW | `font-variant-numeric: tabular-nums` on dates/metrics, `font-feature-settings` on display text |
| **Deep links into case studies (section anchors that survive reload)** | Lets collaborators share "go read this part" links | LOW | `id` attributes on section headings; smooth scroll with reduced-motion fallback |
| **Current-work/Now snippet on About (paco.me-style)** | Signals the site is tended, not abandoned; answers "what's Olive on" | LOW | 3-5 lines, date-stamped; needs manual update discipline but costs nothing at build time |
| **Accent color used with discipline (one accent, strategic placement)** | Reference sites all pick one accent and use it sparingly | LOW | Pick color → use only on links, key callouts, or a single brand mark; never on body text |

### Anti-Features (Commonly Requested, Often Problematic)

These are the specific tells of an AI-generated or template-stamped portfolio in 2026. The peer-dev audience recognizes every one of them. **Each of these should be explicitly decided against, not left ambiguous.**

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **Skill bars with percentages** ("JavaScript 92%", "React 85%") | Seems quantifiable and scannable | Percentages are meaningless ("92% of what?"); reads as junior-portfolio tell; peers find it embarrassing | Omit entirely, OR show technologies as plain tags on projects where they were actually used — let the work demonstrate depth |
| **Years-of-experience counter / ticker** ("5+ years, 30+ projects, 100+ coffees") | Looks confident and scannable | Vanity metrics; "coffees" especially is a 2017-tier template cliché; hiring-manager-optimized (wrong audience) | Omit; a credible voice and real projects communicate experience without counting |
| **Testimonial carousel with LinkedIn-style quotes** | Social proof! | Carousels hide content behind interaction; quotes without context read as fabricated; requires you have real quotes | If you have 1-2 *real, specific, attributable* endorsements, put them inline on the relevant case study. Skip carousels entirely. |
| **Gratuitous 3D / WebGL background / spinning geometry** | Looks impressive; everyone on Three.js Twitter does it | Tanks mobile performance; often ships without `prefers-reduced-motion`; reference aesthetic is minimalist, not maximalist; dates fast | If you want 3D, put it inside *one* project demo where it's load-bearing. Don't decorate. |
| **Scroll-triggered fade-in + stagger on every section** | "Modern" feel, easy Framer Motion win | Delays content for users who scrolled there on purpose; staggering feature cards means users wait to scan; 2026 critique explicitly names this as overused | Reveal content *on page load* immediately. Reserve motion for state changes (hover, route transition, interactive demos). |
| **Gradient text on gradient background** | Looks "designy" | Accessibility disaster; contrast fails; reads as 2023 Shadcn-template tell | Solid color on solid background. If you must use a gradient, apply it to one accent element (a line, a mark), not readable text. |
| **Auto-playing particle cursors, trailing confetti, scroll-indicator arrows** | Adds "personality" | Reads as template; annoys users; interferes with actual cursor/UI; zero thesis alignment | A custom cursor *can* work when tied to meaningful state (hover zones on project cards). The default should be the OS cursor. |
| **Giant hero with "I am a passionate full-stack developer"** | Template default; "safe" positioning | Cliché-detector instant hit; doesn't say anything real; peer audience filters these sites in 2 seconds | Specific first-person thesis: "I build tools for autonomy — local-first systems, autonomous workflows, software that works when the network doesn't." Name your work ethic via what you ship. |
| **Skill "tech stack cloud" / logo grid with 30 technologies** | Looks comprehensive | Signals "I googled 'popular technologies'"; dilutes focus; implies shallow breadth | Tags per-project only. Let a pattern emerge (TypeScript appears in 5 projects → tech focus is obvious) |
| **Dedicated `/services` or "What I offer" page** | Freelancer playbook | You're an engineer with a calling card, not a services site. Reads as SEO-spammy. | If you take client work, a small "Working with me" block on About or contact page. No pricing tiers, no package cards. |
| **Blog/writing section with "Coming soon" or one post** | "I'll fill it later" | Empty sections read as abandoned; PROJECT.md already defers `/writing` | Don't ship the section until you have 3+ real posts. The absence is invisible; the emptiness is loud. |
| **Cookie banner / GDPR overlay on a personal site with no tracking** | "Being compliant" | If you're not tracking, you don't need it; if you add it reflexively, you announce "I'm using analytics I didn't think about" | If you don't track, don't ship one. If you do, use a lightweight, privacy-respecting analytic (Plausible, Fathom) that doesn't require a banner in most jurisdictions. |
| **Light/dark mode toggle in v1** | "Users expect it" | PROJECT.md explicitly scopes this out; shipping one mode polished beats two modes half-done | Dark only. Revisit in v1.x if there's actual demand. |
| **Contact form posting to a backend / email service** | Feels "professional" | More complexity (anti-spam, validation, storage, error states) than value; `mailto:` works universally | Plain `mailto:` link. If spam becomes real, revisit. |
| **Bento grid as the home page layout** | Dominant 2024-2026 trend | PROJECT.md references wallofportfolios.in (a *grid of sites*, not a bento home); bento is already showing signs of exhaustion in 2026; it's the new "hero + three feature cards" | Use a deliberate editorial layout: hero → thesis line → featured projects (vertical cards or a quiet grid) → minor projects → about snippet → contact. Bento can appear *inside* one page (e.g., an "other projects" index) if useful — not as the home. |
| **Every card with a hover-scale or bounce** | "Make it feel interactive" | Infantilizing; everything moves = nothing is special | Pick *one* hover behavior (subtle opacity shift, or de-emphasizing siblings) and use it universally. Save strong interactions for intentional moments. |
| **Auto-opening AI chatbot / "Ask my portfolio" widget** | 2026-trend-chasing | Reads as gimmicky; most implementations are RAG-wrappers with weak answers; peer audience actively dislikes | Skip entirely. If you want an AI demo, build it *into* one of the project case studies (Myco is the obvious candidate) as a contextual demo, not a floating chatbot. |
| **Downloadable "brand kit" / press logos** | "Professional" | You don't have a press need; it's LARP-ing as a company | Skip. Revisit only if there's real press demand. |
| **Metrics on every project ("10k users, 99.9% uptime")** | Outcome-led case studies push this | PROJECT.md: *"placeholders are explicitly placeholders — never fabricate outcomes, metrics, or claims"* | Only use metrics you can back. For personal projects, qualitative outcomes are fine ("Now powers Agent Memory for 3 Claude Code setups") — specificity > inflated numbers. |
| **Decorative scrolling marquee ("tech logos" or "clients I've worked with")** | Fills space | Marquees are 2023-2024 SaaS-landing-page tells; on a personal site they read as padding | Omit. Name specific employers/projects in the resume/about copy; let text carry the weight. |

## Feature Dependencies

```
Typography system
    └──enables──> Deliberate hero + project cards + case study readability
    └──enables──> Per-project hero treatment (shared type, per-project image)
    └──enables──> Custom OG images (use site's actual typography)

Motion tokens (easing + duration)
    └──enables──> Hover treatments on project cards
    └──enables──> View transitions between pages
    └──enables──> Consistent "motion voice"
    └──requires──> prefers-reduced-motion support (ship together, always)

Project tagging system
    └──enables──> Thesis expression through pattern
    └──enables──> (Future) filterable project index
    └──enables──> Command palette tag-search (v1.x)

Single resume source of truth (MDX/TS)
    └──enables──> /resume HTML page
    └──enables──> Downloadable PDF
    └──requires──> Build-time PDF generation step

Hero case studies (Myco, Fathom, Agenda Keeper)
    └──requires──> Problem → Approach → Outcome content structure
    └──requires──> Real content pass (some already have README starting material)
    └──enables──> Next-project navigation (loops only when ≥ 3 exist)

Command palette (⌘K)
    └──requires──> Stable route structure + named destinations
    └──enables──> Power-user navigation for peer audience
    └──conflicts──> Adding before routes are stable (high rework cost)

Custom OG images per route
    └──requires──> Per-project metadata (title, tag, accent) in content
    └──requires──> Typography system (OG looks like site)

Dark theme only
    └──conflicts──> Light/dark toggle in v1 (per PROJECT.md)
    └──enables──> Faster polish; single-mode contrast audit only
```

### Dependency Notes

- **Typography first, before anything else.** Every subsequent visual decision compounds off it. Getting it right here pays dividends across every page. Pick fonts, set the modular scale, build a small type spec page (internal tool, not shipped) that shows h1-h6 + body + captions + mono in both dark-background states.
- **Motion tokens + reduced-motion ship together, always.** Any component with animation gets the `useReducedMotion` check before merge. No exceptions. This is cheaper to establish as a pattern than to backfill.
- **Command palette is a late addition, not an early one.** Routes need to stabilize first; otherwise every palette entry gets rewritten. Target v1.x or late v1.
- **Per-project hero treatments depend on real content and visual direction.** Scaffold first with shared treatment; earn per-project treatments one at a time as content matures. Myco gets the most care; others can share a base treatment at launch.
- **Resume page + PDF depend on choosing a source-of-truth format first.** MDX is most flexible for the HTML page; TS config is simpler for structured data; `@react-pdf/renderer` works from either. Decide at phase start.

## MVP Definition

### Launch With (v1)

The minimum for the site to fulfill its core purpose — "accurately reflect current work in a way that communicates Olive's thesis and feels high-touch."

- [ ] **Home page**: hero (name + thesis line) + hero-project grid (Myco, Fathom, Agenda Keeper) + secondary project row (Trade Bot, Stemz, Aktiga) + about snippet + contact line
- [ ] **Case study pages for Myco, Fathom, Agenda Keeper**: Problem → Approach → Outcome structure with real content (Myco and Fathom start from existing READMEs)
- [ ] **Case study scaffolds for Trade Bot, Stemz, Aktiga**: same template, explicit placeholders where content is pending
- [ ] **About page**: first-person thesis, current role (Aktiga), values, what I'm working on now
- [ ] **Resume page (HTML)** + **downloadable PDF** from a single source of truth
- [ ] **Project tagging**: local-first, autonomous, open-source, agentic (4-5 tags max); tags visible on cards and case studies
- [ ] **"Code private" affordance**: visible tag/icon on private projects; no broken repo links
- [ ] **Typography system**: chosen fonts, type scale, implemented with `next/font`
- [ ] **Motion tokens**: easing + duration tokens defined, `useReducedMotion` utility in place
- [ ] **Full metadata + dynamic OG images per route**
- [ ] **Custom 404 page**
- [ ] **Responsive across 375 / 768 / 1280 / 1920**
- [ ] **Keyboard navigation + visible focus states**
- [ ] **Lighthouse ≥ 90 on landing + each hero case study**
- [ ] **`sitemap.xml` + `robots.txt`**
- [ ] **Deployed to Vercel subdomain, `main` → production**

### Add After Validation (v1.x)

Features to add once v1 is live and feedback arrives — don't block launch on these.

- [ ] **Command palette (⌘K)** — wait until routes stabilize; high craft-signal, medium cost
- [ ] **Per-project hero treatments** — evolve from shared template one case study at a time; Myco first
- [ ] **View Transitions API** between case studies — trigger: v1 ships, motion tokens stable
- [ ] **Next-project navigation** at the end of case studies (can ship in v1 if easy; otherwise here)
- [ ] **Console-message / view-source easter egg** — low effort, add once main copy is signed off
- [ ] **"Now" snippet on About** — requires discipline to keep fresh; add only if you'll maintain it
- [ ] **Filterable project index page** (if secondary/archive projects grow past ~8)
- [ ] **RSS feed** (only if `/writing` eventually ships)

### Future Consideration (v2+)

Explicitly deferred; revisit after PMF (i.e., after Olive has evidence the site is converting the audience it's aimed at).

- [ ] **Writing / Notes section** — deferred in PROJECT.md until real content exists
- [ ] **Interactive project demos** (embedded Myco memory explorer, Fathom cost-calc demo) — Next.js stack was chosen partly to enable this later
- [ ] **Light mode toggle** — only if audience actually asks
- [ ] **Custom domain** — PROJECT.md defers until Vercel subdomain is proven
- [ ] **Analytics** (Plausible or Fathom Analytics — the real one) — only if there's a question Olive actually wants data to answer
- [ ] **Comment/guestbook on case studies** — probably never, but listed so it stays explicitly deferred
- [ ] **Multilingual** — PROJECT.md out-of-scope; keep it that way

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Typography system | HIGH | LOW-MEDIUM | P1 |
| Hero + featured project grid | HIGH | LOW | P1 |
| Myco / Fathom / Agenda Keeper case studies | HIGH | MEDIUM | P1 |
| About page with real thesis voice | HIGH | LOW | P1 |
| Resume page + PDF export | HIGH | MEDIUM | P1 |
| Project tagging | HIGH | LOW | P1 |
| Full metadata + dynamic OG images | HIGH | MEDIUM | P1 |
| Motion tokens + reduced-motion | HIGH | LOW | P1 |
| Responsive + a11y baseline | HIGH | LOW | P1 |
| Custom 404 | MEDIUM | LOW | P1 |
| Sitemap / robots | MEDIUM | LOW | P1 |
| Command palette | MEDIUM | MEDIUM | P2 |
| Per-project hero treatments | HIGH | MEDIUM-HIGH | P2 (Myco) / P3 (others) |
| View transitions | MEDIUM | MEDIUM | P2 |
| Next-project navigation | MEDIUM | LOW | P2 |
| Console / source-comment easter egg | LOW | LOW | P2 |
| "Now" snippet | MEDIUM | LOW (build) / MEDIUM (maintenance) | P2 |
| Filterable index | LOW (at current scale) | MEDIUM | P3 |
| `/writing` section | LOW (no content yet) | MEDIUM | P3 |
| Interactive project demos | HIGH (when shipped) | HIGH | P3 |
| Light mode | LOW | MEDIUM | P3 |

**Priority key:**
- **P1** — Must ship for v1 to read as "done"
- **P2** — Should add in v1.x; would elevate but doesn't gate launch
- **P3** — v2+ consideration; defer until validated need

## Competitor / Reference Analysis

| Feature | wallofportfolios.in (aggregator ref) | brittanychiang.com | paco.me | Our Approach |
|---------|--------------------------------------|--------------------|---------| -------------|
| **Navigation style** | Filter chips + card grid | Anchor-based single page | Implicit (semantic headings, inline links) | Multi-page (home + per-project + about + resume); sidebar or top-nav, not single-scroll |
| **Home layout** | Grid of portfolio cards | Hero → About → Experience → Projects → Writing | Markdown-style sections flowing top to bottom | Hero → thesis line → featured projects (3 hero) → secondary row → about snippet → contact |
| **Project detail** | Links offsite | No separate pages; inline cards | No separate pages; just linked | **Full per-project pages with Problem → Approach → Outcome** — matches our core value |
| **Motion** | Subtle hover-lift on cards | Smooth anchor scroll + gentle fade-ins | Mostly static; deliberate; `cmdk`-palette interactions | Restrained motion tokens; reserve animation for state change + transitions, not reveal |
| **Dark mode** | Yes (and `/dark-theme` subcategory) | Dark only | Dark-ish (beige/paper in variants) | Dark only (v1 constraint) |
| **Command palette** | No | No | Yes (⌘K with `cmdk`) | Yes — P2 (v1.x), `cmdk` library |
| **Resume/CV** | N/A | Linked PDF | No explicit resume | HTML + PDF from one source |
| **Accent use** | Minimal | Green, used only on links + highlights | Mostly neutral; accent on links | One accent, used only on links + one brand mark |
| **About style** | N/A | Long narrative + work history | Short Now-section + values | Narrative about (thesis-driven) + "now" snippet (v1.x) |
| **Easter eggs** | None | Tardis footer (time-travel to old versions) | Tasteful | Console message + one view-source comment |
| **Bento grid** | Has a `/bento-grids` subcategory | No | No | **No** — avoid; use editorial layout instead |
| **Testimonials / skills bars / tech logos** | None of the quality refs use these | None | None | None |

**Takeaway:** None of the reference sites use the template signals we categorized as anti-features. The highest-craft developer portfolios in 2026 converge on: strong typography, one accent, deliberate motion, real content depth, and zero reliance on the recruiter-optimized tropes. Olive's site can credibly sit in this category by mirroring those structural choices without cloning any one of them visually.

## Open Questions for Downstream Phases

These are feature-adjacent questions that FEATURES.md can't answer alone — they'll resolve during roadmap and spec phases:

1. **Command palette scope** — routes only, or also social/contact shortcuts and tag-filters? (Affects v1.x complexity.)
2. **Resume source format** — MDX, TS config, or JSON? Affects PDF generation approach.
3. **Per-project accent colors** — does each hero project get its own accent, or one site-wide accent? (Reference analysis suggests one accent is more restrained.)
4. **OG image style** — static per-project image file or dynamic `ImageResponse`? Dynamic is more flexible; static is faster to nail visually.
5. **`/writing` preparation** — even deferred, should the URL route reserve `/writing` for SEO continuity later, or leave it entirely unreferenced?

## Sources

Core references for 2026 developer portfolio feature landscape:

- [Wall of Portfolios (aggregator, reference aesthetic)](https://www.wallofportfolios.in/)
- [Brittany Chiang personal portfolio (dark minimalist canonical)](https://brittanychiang.com/)
- [Paco Coursey personal site (command palette, restrained craft)](https://paco.me/)
- [The Anthology of a Creative Developer: A 2026 Portfolio (dev.to)](https://dev.to/nk2552003/the-anthology-of-a-creative-developer-a-2026-portfolio-56jp)
- [Portfolio 2026: Tell Outcome Stories, Not Screens (UX University)](https://newsletter.uxuniversity.io/p/portfolio-2026-tell-outcome-stories)
- [Best Developer Portfolio Websites 2026 (Colorlib)](https://colorlib.com/wp/developer-portfolios/)
- [Next.js Metadata and OG Images documentation](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [Next.js SEO Complete Guide 2026](https://adeelhere.com/blog/2025-12-09-complete-nextjs-seo-guide-from-zero-to-hero)
- [prefers-reduced-motion (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)
- [WCAG 2.3.3 Animation from Interactions](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html)
- [UX Case Study Template 2026 (uxfol.io)](https://blog.uxfol.io/ux-case-study-template/)
- [Why Your Beautiful Web Animations Are Killing Conversions (Medium, Feb 2026)](https://medium.com/@R.H_Rizvi/why-your-beautiful-web-animations-are-killing-conversions-and-motion-isnt-the-problem-46f1a791c629)
- [Web Design Trends 2026: Minimalism Evolving into Bento Grids (Medium)](https://medium.com/@aksamark/web-design-trends-2026-why-minimalism-is-evolving-into-bento-grids-16839fd31fb7)
- [Bento Grids & Beyond: UI Trends 2026 (WriterDock)](https://writerdock.in/blog/bento-grids-and-beyond-7-ui-trends-dominating-web-design-2026)
- [Building Accessible Animations with prefers-reduced-motion (dev.to)](https://dev.to/ibn_abubakre/building-accessible-animations-with-prefers-reduced-motion-280a)

---
*Feature research for: personal developer portfolio (dark, minimalist, high-touch, calling-card)*
*Researched: 2026-04-18*
