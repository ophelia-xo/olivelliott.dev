<!-- GSD:project-start source:PROJECT.md -->
## Project

**Portfolio (olivelliott.dev)**

A personal portfolio site for Olive Elliott — an engineer who ships scalable products with a focus on autonomous workflows, local-first systems, and tools that support open-source communities. Primary job is to keep an accurate, current record of the work — what's being built, what it's for, and how it connects to a thesis about autonomy and distributed systems — and serve as a calling card for decentralized-network collaborators, peer engineers, and client leads. Secondary use: hiring/recruiting signal.

**Core Value:** The site must accurately reflect current work — Myco, Fathom, Agenda Keeper, Trade Bot, Stemz, and Aktiga contributions — in a way that communicates Olive's thesis about building for autonomy and local-first systems, and feels high-touch (typography, motion, detail) rather than templated.

### Constraints

- **Tech stack**: Next.js App Router — Olive is deeply familiar, supports interactive demos later, ecosystem maturity. React 19 / TS strict.
- **Hosting**: Vercel (subdomain initially). Deploy on every `main` push.
- **Content delivery**: project content in-repo (MDX or TS config) — no CMS dependency in v1.
- **Aesthetic**: dark theme, minimalist, high-touch. Do not produce generic AI-template aesthetics.
- **Performance budget**: Lighthouse ≥ 90 across categories on landing + hero-project pages. Motion must not tank CLS or block interaction.
- **Accessibility**: WCAG AA baseline — keyboard nav for all interactions, reduced-motion support, sufficient contrast in dark theme.
- **Privacy**: private projects surface as case studies only; no internal Aktiga details, no proprietary details from Voya/Spectra/etc.
- **Content honesty**: placeholders are explicitly placeholders — never fabricate outcomes, metrics, or claims.
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Executive Recommendation
## Recommended Stack
### Core Technologies
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Next.js** | `16.2.x` | React framework, App Router, RSC, Turbopack | Current stable (Mar 2026). Turbopack is default in `dev` and `build`, React Compiler is stable, React 19.2 baseline. Already locked in per PROJECT.md and Olive's strongest stack. |
| **React** | `19.2.x` | UI runtime | Bundled/peer-matched by Next.js 16.2. Unlocks `<Activity>`, View Transitions API, `useEffectEvent`, and React Compiler auto-memo. |
| **TypeScript** | `5.7.x` (strict) | Type safety | Required per PROJECT.md constraints. Strict mode catches most MDX frontmatter issues at build time. |
| **Tailwind CSS** | `4.1.x` | Styling | v4 is CSS-first (`@import "tailwindcss"` + `@theme` directive in CSS, no JS config). ~5× faster full builds, ~100× faster incremental, ~70% smaller CSS. v4.1 adds `text-shadow-*` and `mask-*` utilities useful for high-touch details. Full ecosystem support by Apr 2026 (shadcn, Radix, Next.js). |
| **Motion** (was Framer Motion) | `12.37+` | Animation / micro-interactions | 30M+ monthly DL, de-facto React animation library. Hybrid engine uses WAAPI + ScrollTimeline for 120fps, falls back to JS for springs/gestures. Imports from `motion/react`. Peer-matches React 19 and Next 16. |
| **Geist** (via `next/font/local` or `geist` package) | `1.3+` | Typography (sans + mono) | Vercel's variable font, default in Next.js 15+. Designed for legibility in dev tooling UIs — exactly the "engineer with taste" register. Pairs with `GeistMono` for code blocks. Zero external network request via `next/font`. |
| **MDX** (`@next/mdx` + `@mdx-js/react`) | latest | In-repo project content | Build-time compilation, RSC-native (no serialize/deserialize dance), typed exports per file. `next-mdx-remote` was archived in April 2026 — do not use. |
| **Zod** | `3.23+` | Frontmatter schema validation | Validate `title`, `slug`, `tags`, `tier`, `isPrivate`, `links`, etc. at import time. Pairs with TS inferred types. |
| **Vercel** | — | Hosting + CI | Native Next.js target. Deploy-on-push to `main`. Edge image optimization, OG image rendering, Analytics all first-party. |
### Supporting Libraries
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **`next-themes`** | `0.4+` | Theme attribute management | Even though v1 is dark-only, wire this in now with `defaultTheme="dark"` and `enableSystem={false}`. Avoids the "add theming later" tax and future-proofs a light mode if the reference aesthetic ever shifts. 2 lines of code. |
| **`clsx`** + **`tailwind-merge`** (`cn` helper) | latest | Conditional class composition | Small helper function `cn()` that merges and de-duplicates Tailwind classes. Standard pattern in any shadcn/Radix-flavored codebase. |
| **Radix UI primitives** (selectively) | `1.x` (unified `radix-ui` package, Feb 2026) | Headless accessible primitives | Use *only* for Dialog (contact modal), Tooltip, DropdownMenu, and VisuallyHidden. Unified `radix-ui` package replaced the per-primitive packages in Feb 2026. Do **not** import all of shadcn — see anti-patterns. |
| **shadcn/ui** | CLI `v4` (Mar 2026) | Copy-paste component source | Only for Button, Dialog, Tooltip, and occasional form primitives. Treat as a source of starter code, not a library dependency. Delete anything you don't use. |
| **Shiki** (via `rehype-pretty-code`) | Shiki `1.x`, `rehype-pretty-code` `0.13+` | Syntax highlighting in MDX | Shiki tokenizes at build time (RSC-compatible, zero client JS for code blocks). Pick a single dark theme (`github-dark-default`, `vesper`, or `ayu-dark`) — no theme toggle. Pairs with twoslash later if Olive wants TS-hover code samples. |
| **`remark-gfm`**, **`rehype-slug`**, **`rehype-autolink-headings`** | latest | MDX ergonomics | GitHub-flavored markdown (tables, task lists), autolinked anchor IDs on headings. Tiny, build-time only. |
| **Lucide React** | `0.468+` | Icon system | 1,500+ icons, single consistent stroke style, tree-shakeable. Matches a minimalist, engineer-leaning aesthetic better than Phosphor (which is more expressive but pushes toward a "designed" feel). |
| **`@vercel/analytics`** + **`@vercel/speed-insights`** | latest | Privacy-respecting analytics + Web Vitals | Zero-config on Vercel, cookie-free, no banner required. Speed Insights feeds into the Lighthouse ≥ 90 discipline. |
| **`sharp`** | `0.33+` | Image pipeline | Default for `next/image`. Self-install for deterministic local/prod behavior. Handles 60–80% payload reduction via WebP/AVIF + multiple sizes. |
| **`react-wrap-balancer`** (optional) | `1.1+` | Headline balancing | One-line fix for ragged two/three-line headlines and hero copy. Cheap high-touch win. |
| **`satori`** / `next/og` | built-in | Dynamic OG images | Use Next.js's built-in `ImageResponse` (Satori under the hood) to generate per-page OG cards from a template — keeps share cards on-brand without manual PNG work. |
### Development Tools
| Tool | Purpose | Notes |
|------|---------|-------|
| **Biome** `v2.3+` | Lint + format in one binary | 10–25× faster than ESLint+Prettier, single `biome.json`, covers ~80% of common ESLint rules including React/Next.js. Recommended 2026 default. Supplement with `eslint-plugin-next` + `eslint-plugin-react-hooks` only if you hit a type-aware rule Biome can't do yet. |
| **pnpm** `9.x` | Package manager | 3–4× faster than npm, strict dependency resolution (catches phantom deps), best-in-class for monorepo future-proofing. Vercel natively supports it. Bun is faster but has minor compatibility risk for some Next.js plugin chains — not worth the volatility on a personal site. |
| **`tsc --noEmit`** in CI | Type-check gate | Don't rely on Next's incremental type check alone; run a full `tsc --noEmit` on PRs so MDX frontmatter drift doesn't slip through. |
| **`lint-staged` + `simple-git-hooks`** | Pre-commit quality gate | Format + lint on staged files only. Keeps commit friction low. |
| **Playwright** (optional, post-v1) | E2E / visual regression | Defer until the site has real traffic; for v1 a manual accessibility pass is enough. |
## Installation
# Scaffold (but expect to rip out most of the defaults)
# Core runtime
# MDX pipeline
# Radix primitives (unified package, selectively use what you need)
# Image optimization
# Dev tooling
# One-time Biome init (replace ESLint + Prettier that create-next-app dropped in)
# then delete .eslintrc*, eslint.config.*, .prettierrc* and their deps
## Alternatives Considered
| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| **Motion** | GSAP | Only if you need complex timeline choreography (SVG morphing, text-split scroll sagas). GSAP is heavier, non-React-native, and overkill for micro-interactions. Save for a dedicated case study with a set-piece animation. |
| **Motion** | React Spring | Spring physics are excellent but the API/DX lags Motion, and layout animations aren't as polished. Only pick if you already have muscle memory for it. |
| **Motion** | CSS + View Transitions API (React 19.2) | For page transitions, try this *first*. It's native, zero-JS, and Next.js 16 supports it via the App Router. Motion for element-level micro-interactions; View Transitions for route changes. Use both together. |
| **Geist** | Inter v4 | Inter is the safe default but reads as "plain" in Geist's neighborhood. Pick Inter only if you've already tested Geist and found it too "Vercel-y" for your positioning. |
| **Geist** | Custom variable font from a type foundry (Klim, Dinamo, Grilli Type, Pangram Pangram) | Worth it if you want a truly distinctive voice — but license cost and self-hosting discipline adds real work. Defer until v2. |
| **@next/mdx** | Fumadocs MDX | Pick Fumadocs MDX if you plan to add a `/docs` or `/writing` section with full-text search, nested navigation, and tables-of-contents. For 3–8 project pages, it's over-architected. |
| **@next/mdx** | Content Collections | The closest drop-in replacement for Contentlayer. Reasonable choice if you want a stronger build-time schema step than manual Zod validation. MEDIUM confidence — more moving pieces than necessary for v1. |
| **@next/mdx** | Velite | Actively maintained Contentlayer alternative. Fine choice but adds a separate build step with its own config surface. |
| **shadcn/ui (Radix)** | shadcn/ui (Base UI) | As of Feb 2026, shadcn supports Base UI as an alternative primitive layer. Base UI is WorkOS's successor effort. For this site, Radix is fine — it's more battle-tested and the unified `radix-ui` package lands Feb 2026. |
| **Tailwind v4** | Vanilla Extract | Type-safe CSS-in-TS. Beautiful for design systems. Massive overkill for a personal site and loses the Tailwind utility muscle-memory. |
| **Tailwind v4** | Panda CSS | Zero-runtime, build-time atomic CSS. Great tech but the ecosystem isn't as broad — you lose shadcn/Radix style examples and most of the 2026 component templates. |
| **Lucide** | Phosphor Icons (6 weights) | Phosphor if you want to animate icon weight on hover as a signature detail. Heavier bundle and a more "designed" aesthetic — can drift toward template-y if not disciplined. |
| **Lucide** | Radix Icons | Consistent with Radix primitives but the set is small (~300). Fine if you only need 10–20 glyphs and want minimum footprint. |
| **Vercel Analytics** | Plausible (cloud) | Pick Plausible if you want a richer dashboard (goals, funnels, properties) and are OK paying ~$9/mo. For a personal site, Vercel Analytics' pageview + Web Vitals is enough. |
| **Vercel Analytics** | Umami (self-hosted) | Only if you actively want to self-host. Adds a Postgres + container to your life. No. |
| **Biome** | ESLint + Prettier | Only if you need an ESLint plugin Biome doesn't cover (e.g., `eslint-plugin-tailwindcss` for class sort order). Biome has class sorting built-in so this rarely bites. |
| **pnpm** | Bun | Bun is ~20× faster but introduces compatibility risk in the Next.js plugin chain (esp. sharp, MDX loaders). Use pnpm for predictability; switch to Bun once v1 is shipped and stable. |
| **No 3D library** | react-three-fiber + drei | Only if a specific project case study genuinely warrants a WebGL scene. Don't add R3F speculatively — it pulls in ~150KB of Three.js minimum and tempts you toward a "spinning blob" aesthetic that reads as generic. |
## What NOT to Use
| Avoid | Why | Use Instead |
|-------|-----|-------------|
| **Contentlayer / `next-contentlayer`** | Abandoned. Maintainer confirmed in 2024 they can only give it one day/month, and it has been effectively unmaintained since. Breaks with recent Next.js versions. | `@next/mdx` + Zod (v1), or Fumadocs MDX / Content Collections if you outgrow it. |
| **`next-mdx-remote`** | Repository archived April 9, 2026 — read-only. Also forced a serialize/deserialize boundary that fights RSC. | `@next/mdx` (build-time compile, RSC-native). If you truly need remote MDX, use `next-mdx-remote-client` (fork). |
| **Framer Motion (as `framer-motion`)** | The package still works but the name is legacy. New projects should install `motion` and import from `motion/react`. | `motion` package, `import { motion } from "motion/react"`. |
| **Generic "dashboard-template" starters** (Aceternity, etc.) | They ship the exact aesthetic PROJECT.md wants to avoid: gradient blobs, glassmorphism cards, AI-template glow. They look like everyone else's 2024 portfolio. | Hand-assemble from primitives. Copy a Radix/shadcn *component* when you need one; never a whole template. |
| **Full shadcn/ui install of every component** | shadcn is *source code you own*. Installing everything dumps ~40 components you'll never use and bloats the surface area to maintain. | `pnpm dlx shadcn@latest add button dialog tooltip dropdown-menu` — add only what you use. |
| **Heavy 3D (react-three-fiber + a hero scene)** | Adds 150–300KB JS, first-load LCP risk, GPU thrash on low-end devices, and almost always drifts toward "spinning crystal blob" visual cliché. | Custom SVG + CSS + Motion. If you need depth, use layered translucent elements with parallax scroll, not WebGL. Revisit 3D only for a specific case study's interactive demo. |
| **Lottie (as the default animation format)** | JSON-based, parsed at runtime, CPU-bound for complex pieces. Generally 50–80% larger than equivalent Rive files. Reads as "designer delivered this from After Effects" — fine, but not the engineering-positioned register. | CSS + Motion for UI. SVG + Motion for custom illustrations. **Rive** if you do need a stateful interactive animation (e.g., a cursor-reactive logo). |
| **Client-side MDX rendering for project pages** | Defeats RSC, increases hydration work, hurts LCP. | Server-rendered MDX via `@next/mdx`. |
| **`styled-components` / `@emotion/*`** | Runtime CSS-in-JS is out of favor in RSC-first apps; hurts streaming and client bundle. | Tailwind v4 + CSS variables in `@theme`. |
| **`next-auth` / auth anything** | PROJECT.md says no CMS, no user accounts, no newsletter. Don't bring auth in. | — |
| **Google Analytics / GA4** | Requires cookie banner, drags Lighthouse, and the dashboard is noisy for a site with <10k visits/mo. | Vercel Analytics. |
| **`moment` / `date-fns` (full import)** | Heavy if tree-shaking fails. | `Intl.DateTimeFormat` natively, or import individual `date-fns` functions (`date-fns/format`). Most portfolio date needs are "Apr 2026" strings — one-liner with `Intl`. |
| **Global state (Redux/Zustand/Jotai)** | No need; App Router + URL state + React state is enough for a brochure site. | `useState`, URL search params, RSC. |
## Stack Patterns by Variant
- Wrap the demo in a dynamic client component (`dynamic(() => import(...), { ssr: false })`) so it stays out of initial page JS
- Use Motion for UI transitions inside the demo
- Only reach for R3F if the demo is genuinely 3D (Myco knowledge-graph visualization is the only project where this is arguably warranted — and even then try a 2D force-directed SVG first)
- That's where Fumadocs MDX or Content Collections earns its weight (ToC, search, nav sidebar)
- Migrate project pages over at the same time for consistency
- `next-themes` is already wired; flip `enableSystem={true}` and add a second `@theme` block in globals.css
- Audit all hand-tuned colors (especially Motion-animated values) for light-mode contrast
- Upgrade Vercel Analytics to a paid tier or move to Plausible
- Add Playwright visual regression in CI
## Version Compatibility
| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| `next@16.2` | `react@19.2`, `react-dom@19.2` | React Compiler stable, Turbopack default. |
| `next@16.2` | `motion@12.37+` | Motion supports React 19 and Next 16; needs `"use client"` on any component using `motion/react`. |
| `next@16.2` | `tailwindcss@4.1` | Works with PostCSS plugin (`@tailwindcss/postcss`) or Vite plugin; Next uses PostCSS path. v4 is CSS-first — no `tailwind.config.ts`. |
| `@next/mdx` | `next@16.2`, `@mdx-js/react@3` | Configure in `next.config.ts` with `withMDX` wrapper; add `rehype-pretty-code` + `remark-gfm` in the options. |
| `rehype-pretty-code` | `shiki@1.x` | Shiki v1 ships ESM-only; Next.js 16 handles this fine. |
| `radix-ui` (unified) | React 19 | Feb 2026 release combined previously per-primitive packages. |
| `sharp@0.33` | Node.js 18.17+ | Next 16 requires Node ≥ 20; no issue. Use `--cpu=wasm32 sharp` only as a fallback if native compile fails. |
| `geist@1.3+` | `next/font` | Auto-exports `GeistSans` and `GeistMono` as next/font assets. Self-hosted, zero network request. |
| `biome@2.3` | TypeScript 5.7 | Biome uses its own TS parser; compatible with any `tsconfig.json` settings. |
## Confidence Breakdown
| Pick | Confidence | Source |
|------|-----------|--------|
| Next.js 16.2 as current stable | HIGH | Official Next.js blog + GitHub releases (Mar 2026). |
| React 19.2 as Next 16 peer | HIGH | Next.js 16 release notes. |
| Tailwind v4.1 current | HIGH | Tailwind blog (v4.1 post), GitHub releases. |
| Motion 12.37+ current, use `motion/react` | HIGH | motion.dev changelog, Motion upgrade guide. |
| `next-mdx-remote` archived April 2026 | HIGH | Explicitly noted in 2026 migration guides. |
| Contentlayer abandoned | HIGH | Maintainer statement + Wisp CMS, Dub blog confirmations. |
| @next/mdx is the RSC-native choice | HIGH | Next.js docs + multiple 2026 comparisons. |
| Geist as sans default for Next 15+ | HIGH | Vercel/Next.js docs confirm Geist is default. |
| Biome 2.3 covers ~80% ESLint rules | MEDIUM | Consistent across multiple 2026 guides; the exact percentage varies, but direction is clear. |
| Vercel Analytics sufficient for portfolio scale | MEDIUM | Subjective; depends on desired depth. For v1 brochure traffic, HIGH. |
| Lucide over Phosphor for this aesthetic | MEDIUM | Aesthetic judgment tied to PROJECT.md's "engineer-positioned minimalism". Phosphor is equally valid technically. |
| Radix primitives over Base UI | MEDIUM | Base UI is newer (Feb 2026 in shadcn); Radix is more battle-tested. Either works. |
| No R3F / Three.js for v1 | HIGH | Matches PROJECT.md's aesthetic constraints and Lighthouse budget. |
| pnpm over Bun for predictability | MEDIUM | Bun is faster; pnpm is safer for the Next+sharp+MDX combo. Either viable. |
## Sources
- [Next.js 16 release post (Vercel blog)](https://nextjs.org/blog/next-16) — confirmed Turbopack stable, React Compiler stable, React 19.2 baseline
- [Next.js 16.2 (Onix summary, Mar 2026)](https://medium.com/@onix_react/release-next-js-16-2-377798369d25) — HIGH: current stable version
- [Tailwind CSS v4 announcement](https://tailwindcss.com/blog/tailwindcss-v4) — HIGH: CSS-first config, perf numbers
- [Tailwind CSS v4.1: text shadows, masks](https://tailwindcss.com/blog/tailwindcss-v4-1) — HIGH: current minor
- [Motion changelog](https://motion.dev/changelog) — HIGH: 12.37+ is current, no breaking changes in v12
- [Motion upgrade guide](https://motion.dev/docs/react-upgrade-guide) — HIGH: `motion/react` import path, framer-motion legacy
- [Motion for React installation](https://motion.dev/docs/react-installation) — HIGH: Next 16 support, `"use client"` requirement
- [Next.js Metadata & OG images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) — HIGH: SEO API, `opengraph-image.jpg`, `ImageResponse`
- [Next.js MDX guide](https://nextjs.org/docs/app/guides/mdx) — HIGH: @next/mdx as first-class
- [next-mdx-remote archived status](https://github.com/hashicorp/next-mdx-remote/discussions/438) — HIGH: archived April 9, 2026
- [Contentlayer abandonment (Wisp CMS)](https://www.wisp.blog/blog/contentlayer-has-been-abandoned-what-are-the-alternatives) — HIGH: maintainer confirmed
- [Fumadocs MDX docs](https://www.fumadocs.dev/docs/mdx) — MEDIUM: alternative for if /writing ships
- [Geist font (Vercel)](https://vercel.com/font) + [geist npm](https://www.npmjs.com/package/geist) — HIGH: default font in Next.js 15+
- [shadcn/ui CLI v4 (March 2026)](https://ui.shadcn.com/docs/changelog/2026-03-cli-v4) — HIGH: current state of templates & init
- [shadcn/ui unified Radix package (Feb 2026)](https://ui.shadcn.com/docs/changelog/2026-02-radix-ui) — HIGH: `radix-ui` single package
- [shadcn vs Base UI vs Radix 2026 (PkgPulse)](https://www.pkgpulse.com/blog/shadcn-ui-vs-base-ui-vs-radix-components-2026) — MEDIUM
- [Rehype Pretty Code](https://rehype-pretty.pages.dev/) — HIGH: Shiki integration for MDX
- [Lucide for React](https://lucide.dev/guide/packages/lucide-react) — HIGH
- [Vercel Analytics vs Plausible vs Umami 2026 (PkgPulse)](https://www.pkgpulse.com/blog/vercel-analytics-vs-plausible-vs-umami-privacy-first-2026) — MEDIUM
- [Biome migration guide](https://biomejs.dev/guides/migrate-eslint-prettier/) — HIGH
- [Biome review 2026 (BuildPilot)](https://trybuildpilot.com/433-biome-review-2026) — MEDIUM: v2.3 baseline, rule coverage
- [next-themes GitHub](https://github.com/pacocoursey/next-themes) — HIGH
- [Sharp image optimization in Next.js](https://nextjs.org/docs/messages/install-sharp) — HIGH
- [Lottie vs Rive vs CSS 2026 (PkgPulse)](https://www.pkgpulse.com/blog/lottie-vs-rive-vs-css-animations-web-animation-formats-2026) — MEDIUM: Rive > Lottie when interactive is needed; CSS+Motion for UI micro-interactions
- [pnpm vs bun vs npm 2026 (Pockit)](https://pockit.tools/blog/pnpm-npm-yarn-bun-comparison-2026/) — MEDIUM
- [React Three Fiber docs](https://docs.pmnd.rs/react-three-fiber) — MEDIUM: referenced only to justify deferring
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
