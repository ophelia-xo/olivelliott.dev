# Portfolio (olivelliott.dev)

## What This Is

A personal portfolio site for Olive Elliott — an engineer who ships scalable products with a focus on autonomous workflows, local-first systems, and tools that support open-source communities. Primary job is to keep an accurate, current record of the work — what's being built, what it's for, and how it connects to a thesis about autonomy and distributed systems — and serve as a calling card for decentralized-network collaborators, peer engineers, and client leads. Secondary use: hiring/recruiting signal.

## Core Value

The site must accurately reflect current work — Myco, Fathom, Agenda Keeper, Trade Bot, Stemz, and Aktiga contributions — in a way that communicates Olive's thesis about building for autonomy and local-first systems, and feels high-touch (typography, motion, detail) rather than templated.

## Requirements

### Validated

- [x] **Project detail template at `/projects/[slug]`** — Validated in Phase 3: Myco case study renders end-to-end as Problem → Approach → Outcome with hero, MDX components, and next-project navigation. PRJ-01..PRJ-07 satisfied; 207/207 tests green.
- [x] **Private project handling** — Validated in Phase 3 (component contract) via redaction-fixture path; visible `code private` label replaces repo link, schema strips `links.repo`. Live private content lands in Phase 7.
- [x] **Home page with hero, thesis, and project grid (HOM-01..05)** — Validated in Phase 4. Single-H1 wordmark + role frame + type-set `ThesisParagraph` (reduced-motion gated) + hero-tier cards + secondary-tier cards. No bento, no stagger-on-scroll. Thesis copy is a Phase 7 placeholder.
- [x] **Projects index with URL-synced filter (PIX-01..04)** — Validated in Phase 4. `/projects` renders all projects with server-side `?tag=X` filter, native back-button restoration, keyboard-navigable chips. 301/301 tests green.
- [x] **About page (ABT-01..03)** — Validated in Phase 5. `/about` with plain-spoken bio, ProjectPillRow auto-pulling from getHeroProjects(), ContactStack, ValuesList.
- [x] **Resume HTML + PDF from single source of truth (RES-01..06)** — Validated in Phase 5. `content/resume.ts` Zod-typed source. `/resume` chromeless route with print CSS. `/public/resume.pdf` generated at build via Puppeteer postbuild — 240KB, 3 pages. LinkedIn handle / Fathom URL / Stemz URL remain documented PLACEHOLDERs for Phase 7.
- [x] **Contact in 2+ places (CTC-01..03)** — Validated in Phase 5. Footer + /about both surface GitHub (canonical `olivelliott` handle), mailto with `hi%20from%20olivelliott.dev` subject, LinkedIn (PLACEHOLDER).

### Active

- [ ] Hero case studies: Myco (drafted), Fathom, Agenda Keeper (still need MDX in Phase 7)
- [ ] Secondary project cards: Trade Bot, Stemz, Aktiga, plus selected older work (Phase 7 content pass)
- [ ] PLACEHOLDER resolution: LinkedIn handle, Fathom repo URL, Stemz live URL, Aktiga role title (Phase 7)
- [ ] About page — polymath/engineer framing, current role at Aktiga, values
- [ ] Resume page (HTML) + downloadable PDF from the same source of truth
- [ ] Contact area with GitHub, email, LinkedIn
- [ ] Dark-theme, minimalist aesthetic referencing wallofportfolios.in
- [ ] High-touch execution: deliberate typography, motion/micro-interactions, custom imagery, restrained easter-egg details
- [ ] Deploy to Vercel subdomain (custom domain deferred)
- [ ] Next.js App Router as the foundation
- [ ] Responsive across mobile / tablet / desktop

### Out of Scope

- Web3 / on-chain / crypto framing — decentralized focus here means local-first + mesh/edge/P2P, not tokens
- `/writing` or `/notes` section — deferred; no real content ready yet
- CMS / headless content backend — project content lives in the repo (MDX/TS) for v1
- Blog comments, analytics dashboards, newsletter signup
- Custom domain registration and DNS setup in v1 — Vercel subdomain first
- Hiring-manager-optimized layout — positioning prioritizes collaborators/peers/clients
- Multi-language / i18n
- Dedicated thesis / manifesto essay page — thesis expressed via tags and project framing instead

## Context

**Current state:** Local `/Users/olive/Documents/GitHub/portfolio` is empty. Existing GitHub repo `ophelia-x/portfolio_next` last pushed 2023-11-05 and is outdated — treat as fresh build. The 2023 repo is not a starting point; this is a greenfield build.

**Reference site:** [wallofportfolios.in](https://www.wallofportfolios.in/?company=All) — dark, minimalist, strong typographic rhythm, curated grid of project/person cards with hover interactions. Aesthetic reference, not a clone target.

**Olive's current projects (source material for content):**
- **Myco** (public, TypeScript) — persistent cognitive layer / agent memory with knowledge graph; local-first (Node + SQLite + Ollama); Apache 2.0. Named for mycorrhizal networks.
- **Fathom** (public, TypeScript) — headless AI dev-cost intelligence; CLI + MCP server + Claude Code plugin; pluggable stores and LLM providers.
- **Agenda Keeper** (private repo `the-real-agenda-keeper`) — meeting-management SaaS for small agencies; Convex + Next.js + TipTap/ProseMirror; OAuth calendar sync.
- **Trade Bot** (private) — autonomous trading system, Python; 4 milestones shipped in ~5 days; local-first (SQLite, Ollama, no cloud); paper-trading with crypto intraday + strategy diversification.
- **Stemz / findstemz** (local WordPress) — music-discovery / creative-adjacent project.
- **Aktiga** (current role) — contributions likely visible via `aktiga-developer-docs` (Starlight/Astro) and internal work; treat as case-study content, no repo link.

**Thesis (positioning voice):** "I'm an engineer who ships scalable products and focuses on autonomous workflows so that we can have freedom to do the other things in life that interest us. I'm thoughtful, curious, a polymath with many interests. I want to build things that support open source communities and help contribute to a world we want to live in." Decentralized-networks angle = local-first / P2P + mesh / edge / distributed compute.

**Content state:** Myco and Fathom READMEs are solid and usable as starting content. Others will need a content pass — scaffold pages with placeholders and flag Olive when real copy/screenshots are needed.

**Audience weighting (primary → tertiary):** decentralized/local-first collaborators → peers/tech community → client leads → hiring managers (lowest priority).

## Constraints

- **Tech stack**: Next.js App Router — Olive is deeply familiar, supports interactive demos later, ecosystem maturity. React 19 / TS strict.
- **Hosting**: Vercel (subdomain initially). Deploy on every `main` push.
- **Content delivery**: project content in-repo (MDX or TS config) — no CMS dependency in v1.
- **Aesthetic**: dark theme, minimalist, high-touch. Do not produce generic AI-template aesthetics.
- **Performance budget**: Lighthouse ≥ 90 across categories on landing + hero-project pages. Motion must not tank CLS or block interaction.
- **Accessibility**: WCAG AA baseline — keyboard nav for all interactions, reduced-motion support, sufficient contrast in dark theme.
- **Privacy**: private projects surface as case studies only; no internal Aktiga details, no proprietary details from Voya/Spectra/etc.
- **Content honesty**: placeholders are explicitly placeholders — never fabricate outcomes, metrics, or claims.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Fresh rebuild, not iteration on `portfolio_next` | 2023 repo is 2+ years stale; faster to start clean than untangle | — Pending |
| Next.js App Router over Astro | Olive's strongest stack; enables interactive project demos later | — Pending |
| Home + project detail pages (not single-page scroll) | Heroes deserve real case-study depth; single-page would compress | — Pending |
| Hero tier = Myco + Fathom + Agenda Keeper | Best mix of thesis alignment (Myco), clear value prop (Fathom), technical ambition (AK) | — Pending |
| Private projects as case studies with "code private" tag | Gives Trade Bot, Voya, Spectra, Aktiga real estate without repo links | — Pending |
| Thesis via project tags, no dedicated /thesis page | Shows through pattern across projects; avoids manifesto overreach | — Pending |
| Resume as /resume page + PDF export, one source of truth | Avoids drift between HTML and PDF versions | — Pending |
| Dark theme only (no light-mode toggle in v1) | Matches reference aesthetic; one mode = less polish debt | — Pending |
| Deploy to Vercel subdomain first | Ship fast; custom domain deferred until site is proven | — Pending |
| /writing deferred out of v1 | No real content yet; scaffolding an empty section reads as unfinished | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-17 after Phase 5 (about-+-resume-+-contact) completion*
