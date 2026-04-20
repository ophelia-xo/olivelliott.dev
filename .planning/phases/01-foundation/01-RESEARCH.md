# Phase 1: Foundation - Research

**Researched:** 2026-04-20
**Domain:** Greenfield Next.js 16.2 App Router scaffold — tokens, fonts, motion provider, dark-theme baseline, Vercel deploy
**Confidence:** HIGH (stack, architecture, and UI are already locked by upstream docs; this file translates locks into executable detail and flags three version-drift gaps the planner must resolve)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Typography & Color Tokens**
- Display / body typeface: Geist Sans via `next/font/local` (and `GeistMono` for code/UI mono). No custom foundry face in v1.
- Background: Near-black `#0a0a0a` (zinc-950 semantic) as the page background — forgiving on OLED displays, avoids OLED pure-black bloom.
- Accent color: Warm amber (Tailwind amber-500 `#f59e0b` as the source; actual token tuned for WCAG AA against `#0a0a0a` background).
- Accent strategy: Single site-wide accent in v1 (links, focus ring, motion highlights). Per-project accents deferred to v2 (CNT2-02).
- Foreground text tokens: Tiered off-whites (primary ~#f5f5f5, secondary ~#a3a3a3, tertiary ~#737373) — verify AA contrast against background.
- Type scale: Geist at a balanced scale; exact tokens specified in UI-SPEC (body 16px, label 14px, display clamp 32–48px; weights 400 + 500 only).

**Motion System**
- Depth in Phase 1: Infrastructure only — `<MotionProvider>` wired (LazyMotion + `MotionConfig reducedMotion="user"`) + one trivial fade-in test element that proves the system works end-to-end.
- Default duration token: `--motion-duration: 220ms` (snappy, intent-forward). (UI-SPEC refines as `--motion-duration-base: 220ms` with `-fast: 120ms` and `-slow: 420ms` reserved.)
- Default ease curve: `cubic-bezier(0.22, 1, 0.36, 1)` ("ease-out-expo") — deliberate, non-default feel.
- Reduced-motion: OS-level `prefers-reduced-motion` gate only via `MotionConfig reducedMotion="user"`. No manual UI toggle in v1.

**Shell (Nav + Footer + Logo)**
- Nav layout: Minimal top bar — wordmark left, 4 links right (Projects, About, Resume, Contact). Mono-cased link labels (UI-SPEC: lowercase, not uppercase).
- Nav scroll behavior: Static at top. Not sticky, not hide-on-scroll. Editorial, doesn't compete with content.
- Footer scope (Phase 1 scaffold): Minimal — copyright line, GitHub / Email / LinkedIn icon links, "view source" link. No multi-column sitemap yet; /about, /resume, /projects links live only in nav.
- Logo mark: Wordmark `olive elliott` in GeistMono, lowercase, subtle kerning, same weight as nav links (unassuming).

**Deployment & Tooling**
- Package manager: pnpm 9.x (per STACK.md).
- Lint/format: Biome 2.3+ configured to replace ESLint + Prettier; `.eslintrc*` / `.prettierrc*` deleted.
- TypeScript: strict mode (per PROJECT.md constraint).
- Vercel: Project connected, `main` pushes auto-deploy, sub-domain target only (custom domain deferred).

### Claude's Discretion
- Exact token hex values within the ranges above (e.g., secondary text gray tier). *(UI-SPEC has since locked these — see token block at end of UI-SPEC.)*
- Folder structure details consistent with `.planning/research/ARCHITECTURE.md` (app/, components/ui, components/motion, components/site, lib/, styles/).
- Skip-to-content implementation style (visually hidden until focused; target `#main`). *(UI-SPEC locked the Tailwind-class form.)*
- Focus-ring style — visible 2px outline with accent color, `outline-offset: 2px`.
- Initial route set — root layout + home route with minimal "under construction / coming soon" placeholder that satisfies success criteria (shows nav, footer, a test motion element); real home page content lands in Phase 4.
- Test motion element — a single `FadeIn` wrapping a subtle visual on the placeholder home, demonstrating motion provider.

### Deferred Ideas (OUT OF SCOPE)
- Per-project accent color variable (v2 — CNT2-02).
- Custom foundry typeface in place of Geist (defer until v2; reassess after launch).
- Manual reduced-motion UI toggle in footer (OS gate sufficient for v1; revisit if feedback surfaces).
- Sticky nav / backdrop-blur on scroll (defer — static reads more editorial).
- Richer footer with multi-column sitemap (defer — nav covers current routes).
- View Transitions API for cross-route motion (v2 — VTX-01).
- Mobile hamburger menu (UI-SPEC defers to Phase 4 alongside real home content).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FND-01 | Site is a Next.js 16+ App Router project with React 19 and TypeScript strict mode | Install commands, `tsconfig.json` strict config, `next.config.ts` skeleton documented below |
| FND-02 | Tailwind CSS v4 configured CSS-first with a `@theme` token layer (colors, type scale, spacing, motion durations, easing curves) | UI-SPEC token block is the verbatim target; wiring pattern documented below (`@import "tailwindcss"` + `@tailwindcss/postcss` + `@theme` directive) |
| FND-03 | Geist Sans and Geist Mono loaded via `next/font` and set as the default font stack | `geist` npm package exposes `GeistSans` + `GeistMono` from `geist/font/sans` and `geist/font/mono`; variable-wiring pattern documented |
| FND-04 | Biome configured for lint + format (replacing ESLint/Prettier) | `biome.json` recommended config documented; `pnpm dlx @biomejs/biome init` flow + cleanup of `.eslintrc*`/`.prettierrc*` |
| FND-05 | A single `<MotionProvider>` wraps the app with `LazyMotion` and `MotionConfig reducedMotion="user"` so every animation inherits reduced-motion gating | Full motion provider implementation + `<FadeIn>` test element + CSS safety-net @media block; `<m.*>` strict enforcement documented |
| FND-06 | Dark theme is the default and only theme; no light-mode toggle in v1 | `next-themes` with `defaultTheme="dark" enableSystem={false}` + single `@theme` block (no `@variant light` counterpart) |
| FND-07 | All foreground/background color pairs meet WCAG AA contrast minimums | UI-SPEC token pairs are pre-verified AA/AAA; axe-core verification commands documented in Validation Architecture |
| FND-08 | Root layout includes a skip-to-content link and keyboard-navigable nav | `<SkipLink>` spec (sr-only → focus-visible → `#main`) + focus-ring global CSS + keyboard-reachable `<NavLink>` via `usePathname()` |
| DPL-01 | Every push to `main` deploys to Vercel automatically | `vercel link` + auto-deploy default; optional minimal `vercel.json`; pnpm detection via `packageManager` field in package.json |
</phase_requirements>

## Summary

Phase 1 is a greenfield scaffold of a Next.js 16.2 App Router site with Tailwind v4 tokens, Geist fonts via `next/font/local` (auto-wired by the `geist` package), a single `<MotionProvider>` client boundary at the route-group layout, a dark-theme-only `next-themes` wrapper, a minimal nav/footer/skip-link shell, Biome replacing ESLint/Prettier, and Vercel deploy-on-push to `main`. The UI-SPEC and STACK/ARCHITECTURE/PITFALLS/FEATURES docs have already locked the vast majority of decisions — this research file exists to (a) translate those locks into a linear, executable build order, (b) resolve the three version-drift gaps that emerged between STACK.md (written 2026-04-18) and the npm registry today (2026-04-20), and (c) flag the handful of Turbopack/Tailwind-v4/Motion-12 integration gotchas the planner must guard against.

The three version-drift gaps are: **(1) Zod is now 4.3.6 on the registry while STACK.md locks `3.23+` — this matters because Zod 4 has breaking schema API changes, and Phase 2 (Content Pipeline) will build on whichever version lands here.** **(2) TypeScript is now 6.0.3 while STACK.md locks `5.7.x` — Biome 2.4 may not yet parse TS 6 syntax in all edge cases.** **(3) The local machine has pnpm 8.15.9 installed while STACK.md requires `9.x`, and `corepack` is the standard way to pin a per-project pnpm version regardless of the global install.** All three are addressable in Wave 0 of the plan; none block research.

**Primary recommendation:** Build in the exact order dictated by ARCHITECTURE.md's 15-step dependency sort, but compress Phase 1 to steps 1–5 of that list (tokens → root layout + fonts → UI primitives that exist in Phase 1 [none beyond `cn()`] → motion provider + FadeIn → site layout with nav + footer + skip-link) plus the deployment wiring. Ship the placeholder home + custom 404 last, since both consume the rest of the shell.

## Project Constraints (from CLAUDE.md)

The project CLAUDE.md contains extensive stack/constraint language that MUST be honored. Summarizing the load-bearing directives for planner verification:

1. **Next.js App Router only** — no Pages Router, no Astro, no plain React.
2. **Dark theme only** in v1 — no light-mode toggle, no `@variant light` block. `next-themes` `enableSystem={false}`.
3. **Lighthouse ≥ 90** across Performance / Accessibility / Best Practices / SEO on landing + hero-project pages. Phase 1 sets the ceiling for this by keeping the shell lean.
4. **WCAG AA baseline** — keyboard nav for all interactions, reduced-motion support, sufficient contrast in dark theme. Phase 1 ships the enforcement mechanisms (skip-link, focus ring, MotionConfig, CSS floor).
5. **Privacy** — private projects surface as case studies only with no internal Aktiga / Voya / Spectra details. Does not apply to Phase 1 directly but the 404 copy and footer copy must not reveal anything proprietary.
6. **Content honesty** — placeholders are explicitly placeholders; never fabricate outcomes. The home-placeholder tagline ("under construction. real projects arrive in phase 4.") is locked in UI-SPEC as the honest register.
7. **Locked stack** — Next.js `16.2.x`, React `19.2.x`, TypeScript `5.7.x` strict, Tailwind `4.1.x`, Motion `12.37+` from `motion/react`, Geist `1.3+` via `next/font/local`, Zod `3.23+`, Biome `2.3+`, pnpm `9.x`. *Deviations require a STACK.md revision, not a unilateral change.*
8. **CSS-first Tailwind** — `@theme` directive in CSS, no `tailwind.config.ts` (v4 removed the JS config).
9. **Motion: `motion` package, not `framer-motion`; `import { m } from "motion/react"`** (not `motion`), enforced by `LazyMotion strict`.
10. **MDX** via `@next/mdx` + `@mdx-js/react`. Phase 1 does NOT ship MDX content, but Phase 1's `next.config.ts` must include the `withMDX` wrapper so Phase 2 does not retrofit config.
11. **Forbidden in Phase 1 chrome:** Contentlayer, `next-mdx-remote`, `framer-motion`, Aceternity/"dashboard template" starters, full shadcn install, R3F / Three.js, Lottie, client-side MDX rendering, `styled-components` / `@emotion/*`, `next-auth`, Google Analytics / GA4, full `date-fns` / `moment`, Redux/Zustand/Jotai.
12. **Aesthetic prohibitions (UI-SPEC):** no indigo/violet/purple tokens, no `from-*-500 to-*-500` gradients, no glassmorphism, no radial-gradient orbs, no emoji in chrome, no skill bars, no rounded chrome (Phase 1 is all `--radius-none`).
13. **Banned words in copy:** passionate, award-winning, scalable solutions, cutting-edge, 10x, crafted, seamless, leveraging, synergy, rockstar, ninja.
14. **GSD workflow enforcement** — no direct Edit/Write outside a GSD command. Phase 1 work is gated behind `/gsd:execute-phase 1`.

## Standard Stack

### Core (locked in STACK.md / CLAUDE.md)

| Library | STACK.md pin | Registry today (2026-04-20) | Purpose in Phase 1 | Why Standard |
|---------|--------------|-----------------------------|---------------------|--------------|
| `next` | `16.2.x` | `16.2.4` | Framework, App Router, RSC, Turbopack default, React Compiler stable | Mar 2026 current stable; explicitly locked by STACK |
| `react` | `19.2.x` | `19.2.5` | UI runtime | Peer-matched by Next 16.2; Activity, `useEffectEvent`, View Transitions API available |
| `react-dom` | `19.2.x` | `19.2.5` | DOM renderer | Peer of `react` |
| `typescript` | `5.7.x` strict | **`6.0.3`** | Type safety | ⚠️ Gap — see Version-Drift Gap #2 below |
| `tailwindcss` | `4.1.x` | `4.2.2` | Styling (CSS-first, `@theme`) | v4 is CSS-first; 4.2 is a minor forward-compatible bump from the 4.1 lock. Safe to use 4.2.x. |
| `@tailwindcss/postcss` | latest | `4.2.2` | PostCSS plugin that Next.js 16 pipeline uses | Required companion to `tailwindcss` in v4 when used via PostCSS (Next.js path) |
| `motion` | `12.37+` | `12.38.0` | Animation, `motion/react` | 12.38 is a patch forward from the lock; no breaking changes in v12 line |
| `geist` | `1.3+` | `1.7.0` | Geist Sans + Geist Mono via `next/font` | `geist/font/sans` and `geist/font/mono` exports are the idiomatic entrypoint |
| `next-themes` | `0.4+` | `0.4.6` | Dark-theme attribute wiring (even though v1 is dark-only) | STACK rationale: wire now, avoid retrofit tax |
| `@next/mdx` | `latest` (for Phase 2) | `16.2.4` | MDX compiler for Next.js 16 | Phase 1 wires config skeleton only; no MDX files yet |
| `@mdx-js/react` | `3.1.1` | `3.1.1` | React MDX runtime | Phase 2 uses it; Phase 1 only installs |
| `@mdx-js/loader` | `3.1.1` | `3.1.1` | Webpack/Turbopack MDX loader | Phase 2 uses it; Phase 1 only installs |
| `zod` | `3.23+` | **`4.3.6`** | Schema validation | ⚠️ Gap — see Version-Drift Gap #1 below |
| `sharp` | `0.33+` | `0.34.5` | Image pipeline for `next/image` | Phase 1 installs so `next/image` has a deterministic binary; no images shipped in Phase 1 |
| `clsx` | latest | `2.1.1` | Conditional className composition for `cn()` | Phase 1 ships `lib/utils.ts` exporting `cn()` |
| `tailwind-merge` | latest | `3.5.0` | Merge/de-dup Tailwind utility classes inside `cn()` | Pairs with `clsx` |
| `lucide-react` | `0.468+` | `1.8.0` | Icons (footer GitHub / Mail / LinkedIn in Phase 1) | Tree-shaken named imports only |

### Supporting (locked, used Phase 1)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@vercel/analytics` | `2.0.1` | Pageview + Web Vitals | Mount in root layout; cookie-free, no banner needed |
| `@vercel/speed-insights` | `2.0.0` | Web Vitals telemetry feeding Lighthouse ≥ 90 discipline | Mount in root layout |

### Dev tools

| Tool | Version | Purpose | Notes |
|------|---------|---------|-------|
| `@biomejs/biome` | `2.4.12` (STACK pins `2.3+`) | Lint + format single binary | One-time `pnpm dlx @biomejs/biome init`; delete ESLint + Prettier configs |
| `pnpm` | `10.33.0` on registry; STACK pins `9.x` | Package manager | ⚠️ Gap — see Version-Drift Gap #3 below |
| `corepack` | bundled with Node 20+ | pnpm pinning mechanism | Use `packageManager` field in `package.json` + `corepack enable` |
| `@types/node`, `@types/react`, `@types/react-dom`, `@types/mdx` | latest | TS typings | Standard |

### Version-Drift Gaps (REQUIRES PLANNER DECISION)

**Gap #1 — Zod 3.23 vs 4.3.6 (HIGH impact)**
STACK.md locks `zod@3.23+`; registry is at `4.3.6`. Zod 4 introduced breaking API changes — notably `z.string().email()` became `z.email()`, error customization moved from `{ message }` to `{ error }`, and `.default()` semantics changed. Phase 1 does not itself author schemas, but Phase 2 (Content Pipeline, CNT-02) will. **Recommendation:** install `zod@^3.23.0` for Phase 1 to honor the lock, and open an explicit "upgrade to Zod 4?" decision for the Phase 2 research cycle. Installing Zod 3 now keeps the lock intact; the planner should NOT unilaterally jump to 4.

**Gap #2 — TypeScript 5.7 vs 6.0.3 (MEDIUM impact)**
STACK.md locks `typescript@5.7.x`; registry is at `6.0.3`. TypeScript 6.0 introduces ESM-only module resolution by default, tighter `Promise` inference, and removes several long-deprecated compiler flags. **Risk surface for Phase 1:** Biome 2.4's TS parser and `@mdx-js/react@3.1`'s type exports may not yet handle TS 6 edge cases cleanly; the Next.js 16.2 type-check pipeline is validated against TS 5.7 per its release notes. **Recommendation:** install `typescript@^5.7.0` to honor the lock. Revisit in Phase 6 (SEO/A11y/Perf Audit) when the broader toolchain confirms TS 6 support.

**Gap #3 — pnpm 9.x vs local 8.15.9 / registry 10.33 (LOW impact, must address)**
STACK.md locks `pnpm@9.x`; the machine currently has `pnpm@8.15.9`; registry is at `10.33.0`. **Recommendation:** pin via `packageManager` field in `package.json`:
```jsonc
{
  "packageManager": "pnpm@9.15.9"
}
```
and run `corepack enable` + `corepack prepare pnpm@9.15.9 --activate` once. Vercel reads `packageManager` automatically and provisions the correct pnpm on deploy (no `vercel.json` change needed). This locks pnpm 9.x deterministically regardless of the global install and regardless of a future global upgrade.

### Alternatives Considered (for Phase 1 decisions)

All significant alternatives were considered in STACK.md / ARCHITECTURE.md / PITFALLS.md / FEATURES.md and rejected with reasons. Repeating only the Phase-1-specific ones:

| Instead of | Could Use | Why we don't in Phase 1 |
|------------|-----------|-------------------------|
| `geist` npm package | Self-hosted woff2 via `next/font/local` + local files | The `geist` package *is* a `next/font/local` wrapper with the font files bundled. No network request either way. Using the package saves vendoring ~400KB of font files into `public/fonts/`. |
| `<motion.div>` | `<m.div>` from `motion/react` | `LazyMotion strict` enforces `<m.*>`; `<motion.*>` pulls the full ~34KB bundle. STACK.md lists this as an anti-pattern. |
| `@variant dark` / single-theme no `next-themes` | `next-themes` wired but `defaultTheme="dark" enableSystem={false}` | Future-proofs a potential light mode (v2) at 2 lines of cost. STACK explicitly recommends this. |
| `eslint-config-next` | Biome 2.4 alone | Biome 2.4 covers ~80% of ESLint rules including React/Next hooks. Only add `eslint-plugin-next` back if a specific type-aware rule gap appears (none known for a scaffold). |
| Manual `tsc --noEmit` in CI | Rely on `next build` type check alone | Next's incremental type check can miss MDX frontmatter drift once Phase 2 lands; wire `tsc --noEmit` into the pre-commit hook now so it never regresses. Out of Phase 1 explicit scope but cheap to add. |
| `next.config.js` | `next.config.ts` | Next 16 supports TS config natively; TS gives us typed access to `NextConfig` from `next` + typed `withMDX` wrapper. |

### Installation Commands (Phase 1)

Verified against registry 2026-04-20; versions pinned to honor STACK.md locks where they diverge from current.

```bash
# 0) Enable the correct pnpm via corepack (honors packageManager field set below)
corepack enable
corepack prepare pnpm@9.15.9 --activate

# 1) Scaffold (we'll strip the defaults we don't want)
pnpm create next-app@16.2.4 . \
  --typescript --tailwind --eslint --app --use-pnpm --turbopack

# 2) Core runtime (versions pinned to STACK.md locks where current registry diverges)
pnpm add \
  motion@^12.38.0 \
  next-themes@^0.4.6 \
  geist@^1.7.0 \
  clsx@^2.1.1 \
  tailwind-merge@^3.5.0 \
  zod@^3.23.0 \
  lucide-react@^1.8.0 \
  @vercel/analytics@^2.0.1 \
  @vercel/speed-insights@^2.0.0

# 3) MDX pipeline (Phase 1 wires config only; no .mdx files yet)
pnpm add \
  @next/mdx@^16.2.4 \
  @mdx-js/react@^3.1.1 \
  @mdx-js/loader@^3.1.1

# 4) Image pipeline (no images in Phase 1, but deterministic install for later)
pnpm add sharp@^0.34.5

# 5) Dev tooling (Biome replaces ESLint + Prettier that create-next-app drops in)
pnpm add -D \
  @biomejs/biome@^2.4.12 \
  typescript@^5.7.0 \
  @types/node \
  @types/react \
  @types/react-dom \
  @types/mdx

# 6) One-time Biome init, then delete ESLint + Prettier configs
pnpm dlx @biomejs/biome init
rm -f .eslintrc* eslint.config.* .prettierrc* .prettierignore
pnpm remove eslint eslint-config-next prettier 2>/dev/null || true
```

**Installation verification (command the executor runs after step 5):**
```bash
pnpm why next motion tailwindcss geist zod typescript @biomejs/biome
# Expect exactly one version of each at the declared pin
```

## Architecture Patterns

Most architecture is locked in `.planning/research/ARCHITECTURE.md` and `01-UI-SPEC.md`. Phase 1 implements steps 1–5 of ARCHITECTURE's 15-step build order.

### Recommended Project Structure (Phase 1 scope)

```
portfolio/
├── app/
│   ├── layout.tsx              # Root RSC: <html>, fonts, ThemeProvider, metadata base
│   ├── providers.tsx           # 'use client' — ThemeProvider wrapper (next-themes)
│   ├── globals.css             # @import "tailwindcss" + tokens import + reduced-motion floor
│   ├── not-found.tsx           # Custom 404 (RSC)
│   └── (site)/
│       ├── layout.tsx          # RSC that renders <MotionProvider> + SkipLink + Nav + main + Footer
│       └── page.tsx            # Home placeholder (RSC with <FadeIn> client island)
├── components/
│   ├── motion/
│   │   ├── motion-provider.tsx # 'use client' — LazyMotion + MotionConfig
│   │   └── fade-in.tsx         # 'use client' — opacity-only <m.div>
│   └── site/
│       ├── skip-link.tsx       # RSC — sr-only → focus-visible → #main
│       ├── nav.tsx             # RSC shell
│       ├── nav-link.tsx        # 'use client' — usePathname() for active route
│       ├── word-mark.tsx       # RSC — logo mark + 1×6 amber bar
│       └── footer.tsx          # RSC — copyright + icons + view-source
├── lib/
│   └── utils.ts                # cn(), clsx + tailwind-merge
├── styles/
│   └── tokens.css              # @theme block — all tokens from UI-SPEC
├── public/                     # (empty; favicon lands in Phase 6)
├── biome.json                  # Biome config
├── next.config.ts              # Next 16 TS config + withMDX wrapper (no MDX routes yet)
├── tsconfig.json               # strict mode, @/* path alias
├── package.json                # packageManager: pnpm@9.15.9
└── .planning/                  # Existing, not deployed
```

**Deferred to later phases (do NOT scaffold in Phase 1):**
- `app/(site)/projects/`, `app/(site)/about/`, `app/(site)/contact/` — Phase 4/5
- `app/resume/` — Phase 5
- `content/` — Phase 2
- `hooks/`, `components/ui/`, `components/mdx/`, `components/site/resume/` — Phase 2+
- `lib/projects.ts`, `lib/content.ts`, `lib/seo.ts`, `lib/schemas.ts`, `lib/tags.ts` — Phase 2+
- `app/sitemap.ts`, `app/robots.ts`, `app/icon.tsx`, `opengraph-image.tsx` — Phase 6
- `scripts/generate-resume-pdf.ts` — Phase 5

### Pattern 1: Root Layout Keeps Fonts + ThemeProvider, Motion Lives in Route-Group Layout

**What:** `app/layout.tsx` is RSC, loads `GeistSans` + `GeistMono` via the `geist` package, wraps `<ThemeProvider>` only. The `<MotionProvider>` lives at `app/(site)/layout.tsx`, *not* root. This lets `/resume` (Phase 5) sit outside `(site)` and opt out of motion entirely for print.

**Why:** ARCHITECTURE.md Pattern 1 + Anti-Pattern 2. Putting `<MotionProvider>` at root makes everything under it client-adjacent and ties the print-friendly `/resume` layout to motion chrome it doesn't need.

**Example:**
```tsx
// app/layout.tsx — RSC
// Source: Next.js docs + geist npm docs + next-themes README, verified 2026-04-20
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://olivelliott.dev'),
  title: { default: 'olivelliott.dev', template: '%s · olivelliott.dev' },
  description: 'Olive Elliott — engineer building tools for autonomy, local-first systems, and open-source communities.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className="bg-bg text-text-primary font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

```tsx
// app/providers.tsx — 'use client'
'use client'
import { ThemeProvider } from 'next-themes'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      {children}
    </ThemeProvider>
  )
}
```

```tsx
// app/(site)/layout.tsx — RSC that mounts the client MotionProvider
// Source: ARCHITECTURE.md Pattern 2
import { MotionProvider } from '@/components/motion/motion-provider'
import { SkipLink } from '@/components/site/skip-link'
import { Nav } from '@/components/site/nav'
import { Footer } from '@/components/site/footer'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <MotionProvider>
      <SkipLink />
      <Nav />
      <main id="main" className="mx-auto max-w-6xl px-6 md:px-8 lg:px-12 pt-8 md:pt-16 pb-16 md:pb-24">
        {children}
      </main>
      <Footer />
    </MotionProvider>
  )
}
```

### Pattern 2: MotionProvider with `LazyMotion strict` + `MotionConfig reducedMotion="user"`

**What:** A single `'use client'` component combines `LazyMotion features={domAnimation} strict` (tree-shakes Motion to ~15KB + forces `<m.*>` over `<motion.*>`) and `MotionConfig reducedMotion="user"` (auto-respects OS preference for every child).

**When to use:** Always, at the top of the motion-using subtree.

**Example:**
```tsx
// components/motion/motion-provider.tsx — 'use client'
// Source: UI-SPEC MotionProvider contract (01-UI-SPEC.md line 212–226) + Motion docs (motion.dev/docs/react-reduce-bundle-size, motion.dev/docs/react-motion-config)
'use client'
import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      <LazyMotion features={domAnimation} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  )
}
```

```tsx
// components/motion/fade-in.tsx — 'use client'
// Source: UI-SPEC <FadeIn /> contract (01-UI-SPEC.md line 249–274)
'use client'
import { m } from 'motion/react' // <- `m`, NOT `motion` (LazyMotion strict enforces this)

type FadeInProps = { children: React.ReactNode; delay?: number }

export function FadeIn({ children, delay = 0 }: FadeInProps) {
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </m.div>
  )
}
```

**Why `domAnimation` not `domMax`:** `domAnimation` is ~15KB gzipped and covers opacity/transform/shadow animations — all Phase 1 needs. `domMax` adds layout/drag/pan at ~25KB; Phase 1 doesn't use any of that. If Phase 4's earned motion moment needs layout animation, swap to `domMax` at that time.

**Why `strict`:** Throws at runtime if `<motion.*>` is imported anywhere downstream. Enforces the bundle cap. Makes regressions impossible to land silently.

### Pattern 3: Tokens via Tailwind v4 `@theme` (CSS-First)

**What:** All design tokens live in `styles/tokens.css` inside a `@theme { … }` block. Tailwind v4 generates utility classes AND exposes raw CSS custom properties from the same source. No `tailwind.config.ts` file exists in Tailwind v4.

**When to use:** Every Tailwind v4 project. UI-SPEC already dictates the exact token values to use verbatim.

**Wiring pattern:**

```css
/* app/globals.css */
@import "tailwindcss";
@import "../styles/tokens.css";

/* Reduced-motion floor — belt-and-braces safety net for non-Motion animations */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Focus-visible global — enforces 2px solid accent outline + 2px offset
   on every interactive element (FND-08 + UI-SPEC Accessibility Contract) */
:where(a, button, [role="button"], input, select, textarea, [tabindex]):focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  outline-style: solid;
}

/* Remove user-agent outline only when the above is in effect — never outline:none
   without a same-or-better replacement */
:where(a, button):focus { outline: none; }
```

```css
/* styles/tokens.css — copy verbatim from 01-UI-SPEC.md "Design Tokens: Single-file Reference" */
@theme {
  --font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace;

  --text-body: 1rem;
  --text-body--line-height: 1.6;
  --text-label: 0.875rem;
  --text-label--line-height: 1.4;
  --text-display: clamp(2rem, 5vw, 3rem);
  --text-display--line-height: 1.15;

  --font-weight-regular: 400;
  --font-weight-medium: 500;

  --tracking-tight: -0.02em;
  --tracking-normal: 0em;
  --tracking-wide: 0.02em;

  --spacing: 0.25rem;

  --color-bg: #0a0a0a;
  --color-surface-1: #0a0a0a;
  --color-surface-2: #141414;
  --color-hairline: #1f1f1f;
  --color-text-primary: #f5f5f5;
  --color-text-secondary: #a3a3a3;
  --color-text-tertiary: #737373;
  --color-text-on-accent: #0a0a0a;
  --color-accent: #fbbf24;
  --color-accent-hover: #f59e0b;
  --color-danger: #f87171;

  --motion-duration-fast: 120ms;
  --motion-duration-base: 220ms;
  --motion-duration-slow: 420ms;
  --motion-ease-standard: cubic-bezier(0.22, 1, 0.36, 1);

  --radius-none: 0;
  --radius-sm: 2px;
  --radius-md: 6px;
  --radius-lg: 12px;
}
```

**Why the `--font-geist-sans` / `--font-geist-mono` reference works:** The `geist` package's `GeistSans` / `GeistMono` exports set `--font-geist-sans` / `--font-geist-mono` as CSS variables on the element where the `.variable` class is applied (i.e. `<html>` in our root layout). Tailwind utilities like `font-sans` / `font-mono` then resolve through the `@theme` indirection.

### Pattern 4: Biome 2.4 Config Replaces ESLint + Prettier

**What:** A single `biome.json` handles lint + format. `create-next-app` drops in ESLint + Prettier by default; Phase 1 removes them.

**Recommended `biome.json`:**
```jsonc
{
  "$schema": "https://biomejs.dev/schemas/2.4.12/schema.json",
  "vcs": { "enabled": true, "clientKind": "git", "useIgnoreFile": true },
  "files": {
    "ignoreUnknown": false,
    "includes": ["**", "!**/node_modules", "!**/.next", "!**/out", "!**/.vercel", "!**/.planning"]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100,
    "lineEnding": "lf"
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "a11y": { "recommended": true },
      "correctness": { "recommended": true, "useExhaustiveDependencies": "warn" },
      "style": { "recommended": true, "useImportType": "error", "useConst": "error" },
      "suspicious": { "recommended": true, "noExplicitAny": "warn" },
      "nursery": { "useSortedClasses": { "level": "warn", "options": { "functions": ["clsx", "cn", "cva", "tw"] } } }
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "asNeeded",
      "trailingCommas": "all",
      "jsxQuoteStyle": "double",
      "arrowParentheses": "always"
    }
  },
  "assist": {
    "enabled": true,
    "actions": { "source": { "organizeImports": "on" } }
  }
}
```

**Notes:**
- `useSortedClasses` (the Biome equivalent of `eslint-plugin-tailwindcss`) is in `nursery` as of Biome 2.4; it's `warn` not `error` to avoid blocking commits on minor sort drift. Its `functions` list declares the helpers it should also sort inside — `clsx`, `cn`, and `cva` are standard; `tw` covers styled-components-style template helpers if ever used (unlikely here).
- `lineWidth: 100` is the Prettier-default the project was already halfway to via `create-next-app`. Matches most 2026 Next.js codebases.
- `useIgnoreFile: true` honors `.gitignore` automatically — no separate `biome.json`-level ignore pattern needed for `.next`, `node_modules`, etc. The explicit `!**` entries are belt-and-braces for files `.gitignore` might miss (e.g., `.planning/` is tracked).

**Commands (added to `package.json`):**
```jsonc
{
  "scripts": {
    "lint": "biome lint .",
    "format": "biome format --write .",
    "check": "biome check --write ."
  }
}
```

### Pattern 5: `next.config.ts` with MDX Skeleton (Phase 1 Only Wires It)

**What:** The `next.config.ts` file wires `@next/mdx` now so Phase 2 doesn't retrofit. In Phase 1, no `.mdx` files exist in `app/` or `content/` — the config is inert until content arrives. This matches the Phase 1 context decision (wire MDX config, no MDX content).

**Example:**
```ts
// next.config.ts
// Source: Next.js MDX guide (nextjs.org/docs/app/guides/mdx) + Next 16 TS config support
import type { NextConfig } from 'next'
import createMDX from '@next/mdx'

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    // Phase 1 leaves remarkPlugins / rehypePlugins empty.
    // Phase 2 (CNT-02) adds remark-gfm, rehype-slug, rehype-autolink-headings,
    //   rehype-pretty-code (with a single dark Shiki theme, per UI-SPEC future guidance).
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  poweredByHeader: false, // PITFALLS.md security — don't leak x-powered-by
  reactStrictMode: true,
  // Turbopack is default in Next 16 for dev AND build — no `--turbo` flag needed.
  experimental: {
    // React Compiler is stable in Next 16 but opt-in via experimental.reactCompiler.
    // Defer enabling to Phase 6 (perf pass) to isolate it from Phase 1 noise.
    // reactCompiler: true,
  },
}

export default withMDX(nextConfig)
```

**Why `pageExtensions` includes `md`/`mdx` now:** lets Phase 2 drop a `content/projects/myco.mdx` file and have Next.js auto-discover it without a config change. Phase 1 has zero `.mdx` files, so this is a no-op.

### Pattern 6: `tsconfig.json` — Next 16 + Strict + `@/*` Alias

```jsonc
// tsconfig.json — Next 16.2 default with strict locked on
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noEmit": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", ".next", "out", ".vercel"]
}
```

**Key departures from `create-next-app` defaults:**
- `noUncheckedIndexedAccess: true` — `array[i]` types as `T | undefined`. Catches a class of runtime errors around MDX frontmatter + tag lookups before they land. Phase 1 doesn't use arrays much, but turning it on now means Phase 2's `projects[0]` is correctly typed.
- `noImplicitOverride: true` — requires `override` keyword when subclassing. Cheap safety net.

### Pattern 7: Vercel Deploy-on-Push via `packageManager` Field

**What:** Vercel auto-detects pnpm, Next.js, and the Node version from the repo. No `vercel.json` is strictly required for Phase 1. The `packageManager` field in `package.json` pins pnpm 9 deterministically on both local and Vercel.

**Minimal `package.json` deployment hooks:**
```jsonc
{
  "name": "portfolio",
  "version": "0.1.0",
  "private": true,
  "packageManager": "pnpm@9.15.9",
  "engines": { "node": ">=20.18.0" },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "biome lint .",
    "format": "biome format --write .",
    "check": "biome check --write .",
    "typecheck": "tsc --noEmit"
  }
}
```

**Optional minimal `vercel.json` (not required, but explicit):**
```jsonc
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install --frozen-lockfile",
  "outputDirectory": ".next",
  "cleanUrls": true
}
```

**Deploy flow:**
1. Create repo on GitHub (or push existing `.git` to GitHub — the repo already has `.git`).
2. `vercel link` (CLI already installed) — links this directory to a new Vercel project.
3. Push to `main` → Vercel auto-deploys. Vercel reads `packageManager` → uses pnpm 9.15.9.
4. Phase 1 success criterion #5: "Pushing a commit to `main` produces a new Vercel deployment within minutes" — satisfied.

**What NOT to add in Phase 1:**
- Custom domain config (deferred to Phase 7 / v2 per PROJECT.md).
- `vercel env` production vars (Phase 1 doesn't need any; `NEXT_PUBLIC_SITE_URL` can default to `https://olivelliott.dev` even if the subdomain is `olivelliott-dev.vercel.app` — the metadataBase is honest about "what URL will this be at launch").
- Custom headers / rewrites / redirects — none needed for Phase 1.

### Anti-Patterns to Avoid (Phase 1 specific, from PITFALLS.md + UI-SPEC)

- **`'use client'` at root layout or `(site)` layout.** Both are RSC; the client boundary moves inward via `<Providers>` (next-themes) and `<MotionProvider>`. (ARCHITECTURE Anti-Pattern 2, PITFALLS Pitfall 9.)
- **`<motion.div>` imports.** Enforced by `LazyMotion strict`; use `<m.div>`. (PITFALLS Pitfall 8.)
- **Transform animations on first-viewport elements.** `<FadeIn>` is opacity-only; no `y: 12 → 0`. (PITFALLS Pitfall 10; UI-SPEC "Design rules" line 276–281.)
- **`outline: none` without a same-or-better replacement.** Global `:focus-visible` rule enforces 2px accent outline. (PITFALLS Pitfall 5.)
- **Pure `#000` background.** Use `#0a0a0a` (UI-SPEC `--color-bg`). Avoids OLED halation. (PITFALLS Pitfall 5.)
- **`priority` prop on any image in Phase 1.** No images ship in Phase 1. Next 16 renamed `priority` → `preload`. (PITFALLS Pitfall 3.)
- **Importing `framer-motion`.** Use `motion` package, `motion/react` path. (STACK.md "What NOT to Use".)
- **`suppressHydrationWarning` anywhere except `<html>`.** It's required on `<html>` for `next-themes` to avoid a hydration warning from the `class="dark"` mismatch. Don't spread it elsewhere.
- **Mobile hamburger menu scaffold.** Deferred to Phase 4 explicitly in UI-SPEC Responsive Contract line 523. Phase 1 hides the 4 nav links on `< 640px` viewports and leaves only the wordmark.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Loading variable fonts | Custom `@font-face` + self-hosted woff2 vendored in `public/` | `geist` npm package with `geist/font/sans` + `geist/font/mono` (wrapped `next/font/local`) | Handles preload, subsetting, variable axis, and CSS variable wiring. ~400KB of fonts we don't have to vendor. |
| Per-component `prefers-reduced-motion` branching | Every motion component calls `useReducedMotion()` | `<MotionConfig reducedMotion="user">` once at the provider | PITFALLS Pitfall 2; ARCHITECTURE Anti-Pattern 4. Centralizes the gate, makes forgetting impossible. |
| Tree-shaking Motion | Wrap every file in `dynamic(..., { ssr: false })` | `<LazyMotion features={domAnimation} strict>` | Drops bundle from ~34KB to ~15KB without fighting SSR/streaming. |
| Theme attribute management | Manual `document.documentElement.classList.add('dark')` + localStorage | `next-themes` | Handles SSR flash-of-wrong-theme, storage sync, system preference detection — even when we don't use system detection. 2 lines to wire. |
| Merging conditional Tailwind classes | Hand-written string concat or template literals | `clsx` + `tailwind-merge` combined as `cn()` in `lib/utils.ts` | Dedupes conflicting utilities (`p-2 p-4` → `p-4`), handles falsy values, the shadcn-standard. |
| Lint + format | ESLint + Prettier + `eslint-config-next` + `eslint-plugin-tailwindcss` | Biome 2.4 single binary | 10–25× faster, one config file, ~80% ESLint rule coverage including React/Next/a11y. STACK.md locked. |
| Icon system | Custom SVG components per icon | `lucide-react` named imports | 1,500+ icons, tree-shakeable, stroke-consistent, matches the engineer-minimal aesthetic. Only Phase 1 icons: `Github`, `Mail`, `Linkedin`. |
| Skip-to-content accessibility | Custom JavaScript focus management | `<a href="#main" class="sr-only focus:not-sr-only …">` + `<main id="main">` | Pure CSS + native anchor. ~10 lines. WCAG 2.4.1 compliant. PITFALLS Pitfall 16. |
| Active route detection in nav | `window.location.pathname` in a `useEffect` | `usePathname()` from `next/navigation` in a `'use client'` `<NavLink>` | Server-aware, no flash, no effect. UI-SPEC locks `<NavLink>` as `'use client'` for this. |
| Vercel deploy config | Hand-authored GitHub Actions workflow | Vercel's built-in GitHub integration + `packageManager` field | Auto-deploy on push, preview URLs per PR, zero custom CI YAML. DPL-01 satisfied. |
| Pnpm version pinning | Installer scripts + per-developer agreement | `"packageManager": "pnpm@9.15.9"` + `corepack enable` | Honored by Vercel, honored by Node ≥ 20, survives global pnpm upgrades. |

**Key insight:** For a shell-only phase, the wins come from *not writing code that's already been solved*. The entire Phase 1 custom surface is: one `<FadeIn>`, one `<SkipLink>`, one `<Nav>` + `<NavLink>` + `<WordMark>`, one `<Footer>`, one home placeholder, one 404, one token file, one motion provider, one `cn()`. Everything else is wiring.

## Common Pitfalls

Phase-1-relevant subset drawn from `.planning/research/PITFALLS.md` with Phase 1 specific warning signs. Full list is in that file.

### Pitfall 1: Turbopack + Tailwind v4 PostCSS edge cases

**What goes wrong:** Next 16 uses Turbopack by default in `dev` and `build`. Tailwind v4 works via `@tailwindcss/postcss`. A handful of edge cases have been reported where Turbopack's PostCSS path doesn't pick up `@theme` changes on HMR until a full dev server restart, or where `@import "tailwindcss"` fails if `@tailwindcss/postcss` isn't installed as a peer.

**Why it happens:** Next 16 `create-next-app --turbopack --tailwind` scaffolds with `@tailwindcss/postcss` already listed, but manual installs sometimes miss it. HMR sensitivity to `@theme` is being actively improved in Tailwind 4.2.

**How to avoid:**
- Always include `@tailwindcss/postcss` in devDependencies (the scaffold does this; verify after install).
- If `@theme` changes aren't reflected in dev, restart the dev server — don't chase a phantom.
- Use Tailwind 4.2.x (current) rather than strictly 4.1.x (the STACK pin). 4.2 is forward-compatible and ships with better Turbopack interop.

**Warning signs:**
- `pnpm dev` errors with `Cannot find module '@tailwindcss/postcss'`.
- Changing a `--color-*` value in `tokens.css` doesn't update in browser until you save a `.tsx` file.
- Turbopack warnings about "PostCSS plugin not found" in dev logs.

### Pitfall 2: `geist` package version mismatch with Next's bundled fonts

**What goes wrong:** Next.js 15+ ships Geist as a default font for `create-next-app`, but the `geist` package's version needs to be compatible with `next/font`'s loader contract. Incompatibility can manifest as `--font-geist-sans` not being defined on `<html>`.

**Why it happens:** The `geist` package went 1.3 → 1.7 over the last year while keeping its public API stable, but internal module resolution changed.

**How to avoid:**
- Use `geist@^1.7.0` (current) with Next 16.2. STACK.md pins `1.3+` which allows 1.7; honor the range.
- Verify after install: inspect rendered HTML in dev, confirm `<html class="__variable_… __variable_…">` and that `document.documentElement` has both `--font-geist-sans` and `--font-geist-mono` as CSS variables (check via `getComputedStyle(document.documentElement).getPropertyValue('--font-geist-sans')` in the browser console).

**Warning signs:**
- Fonts render as system sans — body copy looks different from Vercel's own site.
- DevTools Computed panel shows `font-family: ui-sans-serif` (the fallback) instead of a Geist variable.

### Pitfall 3: `<FadeIn>` animating transforms or layout

**What goes wrong:** Someone "improves" the FadeIn to `initial={{ opacity: 0, y: 12 }}` because the opacity-only version feels underwhelming. Now the home placeholder tagline shifts layout on mount, adding CLS to a first-viewport element. Lighthouse drops below the 90 target.

**Why it happens:** Every Framer Motion / Motion tutorial uses `y: 12 → 0` or `y: 40 → 0` as the canonical fade-up-in pattern. Copying tutorials is the default path.

**How to avoid:**
- UI-SPEC explicitly locks `<FadeIn>` as opacity-only (line 276: "Opacity only. No `y: 12 → 0`, no `scale`, no `x` transforms.").
- Wave 0 test (see Validation Architecture) asserts that `<FadeIn>` component source contains exactly `opacity: 0` / `opacity: 1` and does not contain `y:`, `x:`, `scale:`, or `rotate:` as keys in its initial/animate objects.

**Warning signs:**
- `initial={{ opacity: 0, y: ... }}` anywhere in `fade-in.tsx`.
- Lighthouse CLS > 0.01 on the home page.
- Eyeball: tagline "jumps" upward as it fades in.

### Pitfall 4: Mobile nav hidden without a fallback affordance

**What goes wrong:** UI-SPEC defers the mobile hamburger menu to Phase 4. In Phase 1, the 4 nav links are hidden on `< 640px` viewports. If the wordmark also fails to serve as a home link, mobile visitors are navigation-less.

**Why it happens:** "Hide the nav links, deal with it in Phase 4" is the literal UI-SPEC instruction, but it relies on the wordmark being a working `<a href="/">`.

**How to avoid:**
- UI-SPEC line 366–372 specifies the wordmark wraps in `<a href="/">`. Verify this is implemented — not just a `<span>`.
- Also verify that in Phase 1 the mobile view doesn't *orphan* anything: the only routes that exist are `/` and `/not-found`; all 4 nav links lead to routes that 404 anyway. So mobile users reaching the home page and clicking the wordmark go to `/` (themselves) — that's fine for Phase 1's "nav is decorative until Phase 4" stance.
- Add a TODO comment in `components/site/footer.tsx` referencing `<!-- TODO: mobile nav menu in Phase 4 -->` (UI-SPEC line 523 specifies this).

**Warning signs:**
- On < 640px, the wordmark is a `<span>` not an `<a>`.
- The TODO comment is missing from `footer.tsx`.

### Pitfall 5: Pnpm 8 → 9 divergence on install

**What goes wrong:** The local machine has pnpm 8.15.9 installed globally. If the executor runs `pnpm install` without corepack activation, pnpm 8 installs with pnpm-8 lockfile semantics; Vercel then runs pnpm 9 (from `packageManager`) and regenerates the lockfile differently, causing churn or subtle resolution drift.

**Why it happens:** `corepack enable` + `corepack prepare` is a one-time manual step that's easy to skip.

**How to avoid:**
- **Wave 0 action:** run `corepack enable && corepack prepare pnpm@9.15.9 --activate` as the very first setup step.
- Verify with `pnpm --version` → must print `9.15.9`, not `8.15.9`.
- `pnpm install` should be the first install command, not `npm install`.

**Warning signs:**
- `pnpm-lock.yaml` has lockfile version different from `9.x` (check the `lockfileVersion:` top-line — should be `9.x` corresponding to pnpm 9).
- Vercel build log shows a warning like "Detected pnpm 8 in lockfile, running with pnpm 9".

### Pitfall 6: `suppressHydrationWarning` missing on `<html>` with `next-themes`

**What goes wrong:** `next-themes` applies `class="dark"` to `<html>` on mount. Without `suppressHydrationWarning` on `<html>`, React logs a hydration warning on every page load: "Hydration failed: html element className mismatch".

**Why it happens:** The warning is harmless — `next-themes` is designed to handle exactly this mismatch — but `suppressHydrationWarning` is required to silence it.

**How to avoid:**
- Add `suppressHydrationWarning` ONLY to `<html>` in `app/layout.tsx`. Nowhere else.
- Verify in dev console: no "Hydration" warnings on `/` or `/any-route`.

**Warning signs:**
- Red hydration warnings in dev console.
- Sometimes manifests as a brief light/dark flash on first paint if the server renders without the class and client adds it after hydration.

### Pitfall 7: Biome 2.4 and TypeScript 6 interop (if TS 6 somehow sneaks in)

**What goes wrong:** Biome 2.4's TypeScript parser validated against TS 5.7. If someone jumps the lock and installs TS 6, Biome might report phantom errors on newer syntax like explicit resource management (`using foo = …`).

**Why it happens:** Version-Drift Gap #2 above — TS 6 is out but the STACK pins TS 5.7.

**How to avoid:**
- Honor the lock: `typescript@^5.7.0`.
- If a developer tries to upgrade mid-phase, the `check` script should flag parser errors.

**Warning signs:**
- Biome complains about syntax that works fine in `tsc`.
- `pnpm typecheck` passes, `pnpm check` fails, on the same code.

## Runtime State Inventory

**Not applicable.** Phase 1 is a greenfield scaffold — there is no existing runtime state to migrate. Noting each category explicitly for planner completeness:

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None — no databases, no datastores, no existing collections. Repo has only `CLAUDE.md` + `Olive_Elliott_Resume.docx`. | None |
| Live service config | None — no Vercel project exists yet, no external services connected. A new Vercel project is created in this phase. | None (phase creates the config, doesn't migrate it) |
| OS-registered state | None — no Task Scheduler / launchd / systemd entries. No pm2 processes. | None |
| Secrets/env vars | None currently. Phase 1 introduces one optional env var: `NEXT_PUBLIC_SITE_URL` (defaults to `https://olivelliott.dev` in `metadataBase`). Vercel project creates its own deploy token. | None (create via Vercel dashboard only if needed for preview URLs) |
| Build artifacts | None — no `.next/`, no `node_modules/`, no prior builds. | None |

## Environment Availability

Phase 1 has real external dependencies — this section is required.

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js ≥ 20.18 | Next 16 minimum, `sharp@0.34` | ✓ | 22.18.0 | — |
| pnpm 9.x | STACK.md lock; package manager | ⚠️ Mismatch | 8.15.9 installed globally; 9.15.9 required | `corepack enable && corepack prepare pnpm@9.15.9 --activate` (Node 22 ships with corepack) |
| Vercel CLI | `vercel link`, project bootstrap | ✓ | `/opt/homebrew/bin/vercel` present | Vercel dashboard UI works without CLI |
| Git | Version control, Vercel push trigger | ✓ | Installed | — |
| GitHub CLI (`gh`) | Repo creation, PR flow (optional) | ✓ | `/opt/homebrew/bin/gh` present | Vercel also supports GitLab / Bitbucket; or browser repo-create |
| GitHub repository | Vercel auto-deploy trigger | ✗ Not yet created | — | `gh repo create ophelia-x/portfolio --public --source=.` or manual via web |
| Vercel account + project | Hosting target, DPL-01 | ⚠️ Unknown — assumed present based on CLI install, not verified | — | Vercel free tier sufficient for Phase 1 |
| Internet (pnpm install, font/image fetching) | Install dependencies, Vercel deploy | ✓ Assumed | — | Vendor-copy dependencies offline (unrealistic workflow) |
| Browser with `prefers-reduced-motion` toggle | Manual verification of success criterion #3 | ✓ Any modern browser | — | macOS System Settings → Accessibility → Display → Reduce Motion (documented in UI-SPEC line 497) |
| axe DevTools or similar a11y scanner | Verification of success criterion #4 (WCAG AA) | ⚠️ Not verified | — | Use `@axe-core/cli` via `pnpm dlx @axe-core/cli <deployed-url>` as a no-install alternative |
| Lighthouse | Phase 6 (not Phase 1) Lighthouse ≥ 90 check | N/A for Phase 1 | — | Chrome DevTools has Lighthouse built-in |

**Missing dependencies with no fallback:**
- None. All Phase 1 dependencies either exist or have documented fallbacks.

**Missing dependencies with fallback:**
- **pnpm 9.x not on PATH:** activate via corepack (preferred) or install globally with `npm i -g pnpm@9.15.9`. Corepack is the lock-friendly path.
- **No GitHub repo yet:** the `.git` directory is initialized locally but hasn't been pushed. Create with `gh repo create` or manual web flow before `vercel link` succeeds.

**Dependencies to verify at phase start:**
```bash
node --version     # expect >= v20.18 (have v22.18.0)
pnpm --version     # AFTER corepack activation: expect 9.15.9
git --version      # any modern version
vercel --version   # any modern version
gh auth status     # confirm logged in (for repo creation)
```

## Validation Architecture

`workflow.nyquist_validation: true` — this section is required.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | **Vitest** (recommended); no test framework installed yet — Wave 0 task |
| Config file | None yet — create `vitest.config.ts` in Wave 0 |
| Quick run command | `pnpm test -- --run` (for CI / quick feedback) or `pnpm test` (watch mode for dev) |
| Full suite command | `pnpm test -- --run --coverage` |

**Why Vitest over Jest:** Vitest natively supports TS, ESM, Next 16's module graph, and Turbopack-adjacent tooling. Jest requires `ts-jest` + Babel config and has slower cold start. Vitest 3.x is the 2026 default for Next.js projects.

**Why not Playwright for Phase 1:** STACK.md defers Playwright to post-v1. Phase 1 needs lightweight assertion tests (component source properties, config file presence, token values), not full browser E2E.

**Why lightweight testing for a shell phase:** Phase 1 is almost entirely declarative wiring. Heavy testing is overkill; a small sanity suite that asserts the contracts (tokens exist, `<FadeIn>` is opacity-only, `biome.json` is valid JSON, `<main id="main">` wraps children) catches regressions that matter.

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FND-01 | Next 16 + React 19 + TS strict configured | smoke | `pnpm typecheck && pnpm build` | ❌ Wave 0 — add scripts |
| FND-02 | Tailwind v4 `@theme` block contains required tokens | unit (config assert) | `pnpm test -- --run tests/tokens.test.ts` | ❌ Wave 0 |
| FND-03 | Geist Sans + Geist Mono font variables applied to `<html>` | unit (snapshot) | `pnpm test -- --run tests/layout.test.tsx` | ❌ Wave 0 |
| FND-04 | Biome config is valid, lint + format scripts work | smoke | `pnpm check --write=false` (dry run) | ❌ Wave 0 — requires `biome.json` |
| FND-05 | MotionProvider uses `reducedMotion="user"` + `LazyMotion strict` + `<m.*>` | unit (source assert) | `pnpm test -- --run tests/motion-provider.test.ts` | ❌ Wave 0 |
| FND-05 | `<FadeIn>` is opacity-only, no transform | unit (source assert) | `pnpm test -- --run tests/fade-in.test.ts` | ❌ Wave 0 |
| FND-06 | `next-themes` configured with `defaultTheme="dark" enableSystem={false}` | unit (source assert) | `pnpm test -- --run tests/providers.test.tsx` | ❌ Wave 0 |
| FND-07 | WCAG AA contrast on all token pairs | e2e (a11y scanner) | `pnpm dlx @axe-core/cli http://localhost:3000 --exit` | ❌ Wave 0 (manual run post-dev-server-up) |
| FND-07 | Token pair contrast pre-verified in TS | unit (math) | `pnpm test -- --run tests/contrast.test.ts` — asserts WCAG ratio ≥ 4.5 for every pair in UI-SPEC table | ❌ Wave 0 |
| FND-08 | `<SkipLink>` renders, hidden until focused, targets `#main` | unit (render + keyboard) | `pnpm test -- --run tests/skip-link.test.tsx` | ❌ Wave 0 |
| FND-08 | Tab order matches UI-SPEC (wordmark → 4 nav links → footer icons → view-source) | manual-only + optional e2e | Manual keyboard walkthrough post-deploy; Playwright deferred to v1.x | N/A |
| DPL-01 | Push to `main` triggers Vercel deploy within minutes | manual-only | Commit + push + check Vercel dashboard | N/A (manual verification is the success proof) |

### Sampling Rate

- **Per task commit:** `pnpm typecheck && pnpm check && pnpm test -- --run` — covers TS, lint, format, and all unit tests. Target ≤ 20 seconds.
- **Per wave merge:** `pnpm typecheck && pnpm check && pnpm test -- --run --coverage && pnpm build` — adds a full production build. Target ≤ 90 seconds.
- **Phase gate:** All of the above PLUS (a) deploy to Vercel preview URL, (b) `pnpm dlx @axe-core/cli <preview-url> --exit` returns zero violations, (c) manual keyboard walkthrough on the preview URL, (d) manual Reduced Motion toggle test on macOS.

### Wave 0 Gaps

- [ ] `pnpm add -D vitest@^3 @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom` — install test harness
- [ ] `vitest.config.ts` — configure jsdom environment, path alias `@/*`, setup file
- [ ] `vitest.setup.ts` — import `@testing-library/jest-dom` matchers
- [ ] `tests/tokens.test.ts` — parses `styles/tokens.css`, asserts every token in UI-SPEC "Design Tokens: Single-file Reference" table is present with the exact value
- [ ] `tests/contrast.test.ts` — pure function over the token pairs from UI-SPEC's "Verified pairings" table, using a WCAG ratio implementation (~20 LOC) or `@adobe/leonardo-contrast-colors` — asserts ratio ≥ 4.5 for the pairs marked AA-passing
- [ ] `tests/motion-provider.test.ts` — reads `components/motion/motion-provider.tsx` as a string, asserts presence of `reducedMotion="user"`, `features={domAnimation}`, `strict`
- [ ] `tests/fade-in.test.ts` — reads `components/motion/fade-in.tsx` as a string, asserts `opacity: 0` and `opacity: 1` are present, and none of `y:`, `x:`, `scale:`, `rotate:`, `rotateX:`, `rotateY:` appear inside the initial/animate props
- [ ] `tests/providers.test.tsx` — renders `<Providers>`, asserts `<html>` gains `class="dark"` via `next-themes` and no `system` attribute
- [ ] `tests/skip-link.test.tsx` — renders `<SkipLink>`, asserts it has `href="#main"`, the default class string includes `sr-only`, and focusing it reveals it per `focus:not-sr-only`
- [ ] `tests/layout.test.tsx` — renders the root layout markup, asserts both `GeistSans.variable` and `GeistMono.variable` class names land on `<html>` and `<main id="main">` exists
- [ ] Add `"test": "vitest"` and `"test:ci": "vitest run"` to `package.json` scripts

## Code Examples

Consolidated, verified patterns ready for the planner to reference. All examples have source citations.

### Example 1: Root layout with fonts + theme provider

Already shown in Pattern 1 above. Source: `01-UI-SPEC.md` lines 308–316 + Next.js metadata API docs + `geist` npm README.

### Example 2: `<SkipLink>`

```tsx
// components/site/skip-link.tsx — RSC
// Source: 01-UI-SPEC.md lines 327–342 (verbatim Tailwind classes), WCAG 2.4.1 + 2.5.5
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-2 focus:bg-bg focus:text-accent focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent"
    >
      Skip to content
    </a>
  )
}
```

### Example 3: `<NavLink>` with active-route detection

```tsx
// components/site/nav-link.tsx — 'use client'
// Source: 01-UI-SPEC.md lines 378–391 + Next.js App Router docs (nextjs.org/docs/app/api-reference/functions/use-pathname)
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

type NavLinkProps = { href: string; label: string }

export function NavLink({ href, label }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={cn(
        'font-mono text-label font-medium tracking-wide lowercase px-3 py-3 transition-colors',
        'duration-[var(--motion-duration-fast)] ease-linear',
        isActive
          ? 'text-text-primary border-b border-accent pb-1'
          : 'text-text-secondary hover:text-text-primary',
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      {label}
    </Link>
  )
}
```

### Example 4: `<WordMark>`

```tsx
// components/site/word-mark.tsx — RSC
// Source: 01-UI-SPEC.md lines 364–376
import Link from 'next/link'

export function WordMark() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 font-mono text-label font-medium tracking-wide lowercase text-text-primary py-3 -my-3 focus-visible:outline-none"
    >
      <span aria-hidden="true" className="block w-px h-1.5 bg-accent" />
      <span>olive elliott</span>
    </Link>
  )
}
```

### Example 5: `<Footer>`

```tsx
// components/site/footer.tsx — RSC
// Source: 01-UI-SPEC.md lines 394–412; Lucide named imports
// TODO: mobile nav menu in Phase 4
import { Github, Linkedin, Mail } from 'lucide-react'

const SOCIAL_LINKS = [
  {
    label: 'GitHub',
    href: 'https://github.com/ophelia-x', // placeholder — confirm in Phase 1 impl per UI-SPEC line 409
    Icon: Github,
    external: true,
  },
  {
    label: 'Email Olive',
    href: 'mailto:olivelliott48@gmail.com?subject=olivelliott.dev',
    Icon: Mail,
    external: false,
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/olive-elliott', // placeholder — confirm in Phase 1 impl per UI-SPEC line 410
    Icon: Linkedin,
    external: true,
  },
] as const

export function Footer() {
  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto max-w-6xl px-6 md:px-8 lg:px-12 py-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-label text-text-secondary">© 2026 Olive Elliott</p>

        <div className="flex items-center gap-4 sm:gap-6">
          {SOCIAL_LINKS.map(({ label, href, Icon, external }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="p-3 text-text-secondary hover:text-text-primary focus-visible:text-text-primary transition-colors duration-[var(--motion-duration-fast)]"
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <Icon className="w-5 h-5" strokeWidth={1.5} />
            </a>
          ))}
        </div>

        <a
          href="https://github.com/ophelia-x/portfolio" // view-source target — repo for this site
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-label tracking-wide lowercase text-text-tertiary hover:text-accent focus-visible:text-accent transition-colors duration-[var(--motion-duration-fast)]"
        >
          view source
        </a>
      </div>
    </footer>
  )
}
```

### Example 6: Home placeholder page

```tsx
// app/(site)/page.tsx — RSC wrapping a client <FadeIn> island
// Source: 01-UI-SPEC.md lines 414–434
import { FadeIn } from '@/components/motion/fade-in'

export default function HomePage() {
  return (
    <section className="flex flex-col gap-4 py-16 md:py-24">
      <h1 className="font-sans text-display leading-[1.15] tracking-[-0.02em] font-medium lowercase text-text-primary">
        olivelliott.dev
      </h1>
      <FadeIn>
        <p className="text-body leading-[1.6] text-text-secondary">
          under construction. real projects arrive in phase 4.
        </p>
      </FadeIn>
    </section>
  )
}
```

### Example 7: Custom 404

```tsx
// app/not-found.tsx — RSC
// Source: 01-UI-SPEC.md lines 449–462
import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="mx-auto max-w-6xl px-6 md:px-8 lg:px-12 py-16 md:py-24 flex flex-col gap-4">
      <h1 className="font-mono text-display leading-[1.15] font-medium text-text-primary">404</h1>
      <p className="text-body text-text-secondary">
        not found — that route doesn&apos;t exist yet.
      </p>
      <Link href="/" className="text-body text-accent hover:text-accent-hover focus-visible:underline">
        → back home
      </Link>
    </section>
  )
}
```

### Example 8: `cn()` utility

```ts
// lib/utils.ts
// Source: shadcn/ui standard pattern (ui.shadcn.com/docs/installation/manual)
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Example 9: Vitest config

```ts
// vitest.config.ts
// Source: vitest.dev/config/ + Testing Library Next.js guidance, verified 2026-04-20
import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    css: false, // no CSS processing in unit tests — we read token files as strings
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './') },
  },
})
```

```ts
// vitest.setup.ts
import '@testing-library/jest-dom/vitest'
```

## State of the Art

| Old Approach | Current Approach (2026) | When Changed | Impact on Phase 1 |
|--------------|-------------------------|--------------|-------------------|
| `framer-motion` package | `motion` package, `import { m } from "motion/react"` | Late 2024 rename (Motion 11+) | CLAUDE.md + STACK.md enforce the new path; don't install `framer-motion` |
| Contentlayer / `next-contentlayer` | `@next/mdx` (primary), Fumadocs MDX or Content Collections (if needed later) | Contentlayer abandoned 2024; `next-mdx-remote` archived April 2026 | Phase 1 installs `@next/mdx` for Phase 2; never touches Contentlayer |
| `tailwind.config.ts` + JS theme | Tailwind v4 `@theme` in CSS | Tailwind 4.0 (Jan 2025) stable; current 4.2 | All tokens live in `styles/tokens.css`; no JS config file exists |
| `priority` on `<Image>` | `preload` on `<Image>` | Next 16 | Not relevant for Phase 1 (no images); noted for Phase 4+ |
| Pages Router `_app.tsx` + `_document.tsx` | App Router `app/layout.tsx` (RSC) + providers as client children | App Router stable, Pages deprecated for new projects | Phase 1 is App Router only |
| `getStaticProps` + `getServerSideProps` | RSC + `generateStaticParams` + `dynamicParams = false` | App Router standard pattern | Phase 1 has no dynamic routes; noted for Phase 3 (project detail) |
| Per-primitive Radix packages (`@radix-ui/react-dialog` etc.) | Unified `radix-ui` single package | Feb 2026 | Phase 1 doesn't use Radix; Phase 3+ installs the unified package |
| ESLint + Prettier + `eslint-config-next` | Biome 2.4 single binary | 2025–2026 migration wave | Phase 1 goes Biome-only |
| Self-hosted Geist via `next/font/local` with woff2 files in `public/` | `geist` npm package (wraps `next/font/local`) | Vercel packaged it; current 1.7 | Phase 1 uses the package |
| `useRouter().pathname` (Pages Router) | `usePathname()` from `next/navigation` | App Router | `<NavLink>` uses `usePathname()` |

**Deprecated / outdated patterns — do NOT introduce:**
- `next-mdx-remote` (archived April 9, 2026).
- `framer-motion` package name (still works, but legacy).
- `tailwind.config.ts` / `tailwind.config.js` (v3 artifact; v4 ignores it).
- `<motion.div>` — use `<m.div>` with `LazyMotion strict`.
- Per-component `useReducedMotion()` branches — use the global `<MotionConfig reducedMotion="user">`.
- `outline: none` without replacement.
- `priority` on `<Image>` in Next 16 — use `preload`.

## Open Questions

### 1. Which Zod major do we install?

- **What we know:** STACK.md locks `zod@3.23+`. Registry is at `4.3.6`. Zod 4 has breaking schema API changes (notably `z.string().email()` → `z.email()`, `{ message }` → `{ error }`).
- **What's unclear:** Whether the project wants to honor the STACK lock (safe, retrofit cost in Phase 2 if they choose Zod 4 later) or jump to Zod 4 now (requires a STACK revision).
- **Recommendation:** Honor the lock → install `zod@^3.23.0` in Phase 1. Open a deliberate "upgrade to Zod 4?" decision for Phase 2's `/gsd:discuss-phase` cycle, since Phase 2 is the first to author schemas (CNT-02).

### 2. Which TypeScript major do we install?

- **What we know:** STACK.md locks `typescript@5.7.x`. Registry is at `6.0.3`.
- **What's unclear:** Whether Biome 2.4 + `@mdx-js/react@3.1` + Next 16.2's type-check all handle TS 6.0 cleanly. TS 6 introduces ESM-only module resolution defaults.
- **Recommendation:** Honor the lock → install `typescript@^5.7.0`. Revisit in Phase 6 (SEO/A11y/Perf Audit) once the toolchain confirms TS 6 support. Phase 1's contract is "strict mode on", which TS 5.7 delivers fully.

### 3. GitHub repo handle — `ophelia-x/portfolio` or `olive-elliott/portfolio` or new?

- **What we know:** UI-SPEC line 408 references `https://github.com/ophelia-x` as the placeholder GitHub handle (Olive's existing GitHub username per PROJECT.md "Current state"). The existing 2023 repo is `ophelia-x/portfolio_next` and is out of scope.
- **What's unclear:** Whether Phase 1 creates a new repo under `ophelia-x/portfolio` (collides with the old name? unlikely — old one is `portfolio_next`) or somewhere else.
- **Recommendation:** Confirm with Olive during `/gsd:execute-phase 1` bootstrap task. Default: `ophelia-x/portfolio` public, new. Vercel can be linked regardless. UI-SPEC already flags these as "confirm handle in Phase 1 implementation".

### 4. Do we opt into React Compiler in Phase 1?

- **What we know:** React Compiler is stable in Next 16 but opt-in via `experimental.reactCompiler: true` in `next.config.ts`. It auto-memoizes client components.
- **What's unclear:** Whether Phase 1 wants the compile-time perf win now, or isolate it to a Phase 6 perf pass to attribute Lighthouse-90-failing regressions correctly.
- **Recommendation:** Do NOT enable in Phase 1. Phase 6 is the correct place; enabling now would convolve Phase 1 Lighthouse baselines with a compiler behavior that could mask other issues.

### 5. What's the exact Vercel subdomain at deploy time?

- **What we know:** PROJECT.md: "Vercel subdomain initially; custom domain deferred." Likely `olivelliott-dev.vercel.app` or `portfolio-<hash>.vercel.app`.
- **What's unclear:** The exact subdomain, which affects `metadataBase` and OG image URLs (though OG images are Phase 6, not Phase 1).
- **Recommendation:** Set `NEXT_PUBLIC_SITE_URL=https://olivelliott.dev` (the intended custom domain) in `metadataBase`. Vercel preview URLs will still work; the metadataBase controls *where OG URLs resolve to*, which is correct for when the custom domain lands. Document in a Wave 0 task note.

## Sources

### Primary (HIGH confidence)

- `.planning/PROJECT.md` — project constraints, audience weighting, aesthetic prohibitions
- `.planning/REQUIREMENTS.md` — phase-to-requirement traceability (FND-01 through FND-08, DPL-01)
- `.planning/ROADMAP.md` — Phase 1 goal, success criteria, dependencies
- `.planning/STATE.md` — milestone context, accumulated decisions
- `.planning/research/STACK.md` — LOCKED versions and package choices
- `.planning/research/ARCHITECTURE.md` — folder structure, 15-step build order, Pattern 1–7
- `.planning/research/PITFALLS.md` — 18 numbered pitfalls with warning signs, 4 motion/5 dark-theme/6 SEO specifically
- `.planning/research/FEATURES.md` — 19-item anti-features launch gate
- `.planning/phases/01-foundation/01-CONTEXT.md` — USER DECISIONS (locked), Claude's Discretion, Deferred Ideas
- `.planning/phases/01-foundation/01-UI-SPEC.md` — DESIGN CONTRACT (approved) with verbatim tokens, component specs, copy, tab order
- Next.js 16 release notes — https://nextjs.org/blog/next-16 (Turbopack stable, React Compiler stable, React 19.2 baseline)
- Next.js MDX guide — https://nextjs.org/docs/app/guides/mdx
- Tailwind CSS v4 announcement — https://tailwindcss.com/blog/tailwindcss-v4 (CSS-first, `@theme` directive)
- Motion upgrade guide — https://motion.dev/docs/react-upgrade-guide (`motion/react` path, framer-motion legacy)
- Motion — reduce bundle size — https://motion.dev/docs/react-reduce-bundle-size (LazyMotion + `m` component)
- Motion — MotionConfig — https://www.framer.com/motion/motion-config/ (`reducedMotion="user"`)
- Geist font on npm — https://www.npmjs.com/package/geist
- next-themes GitHub — https://github.com/pacocoursey/next-themes
- Biome migration guide — https://biomejs.dev/guides/migrate-eslint-prettier/
- `npm view <pkg> version` registry check, executed 2026-04-20 — confirmed live versions for next, react, tailwindcss, motion, geist, @biomejs/biome, next-themes, pnpm, @next/mdx, @mdx-js/react, @mdx-js/loader, @tailwindcss/postcss, clsx, tailwind-merge, lucide-react, @vercel/analytics, @vercel/speed-insights, typescript, sharp, zod

### Secondary (MEDIUM confidence)

- Next.js 16.2 release recap (Mar 2026, Onix) — https://medium.com/@onix_react/release-next-js-16-2-377798369d25
- Biome review 2026 (BuildPilot) — https://trybuildpilot.com/433-biome-review-2026 (v2.3 / 2.4 rule coverage estimates)
- Vercel pnpm detection + `packageManager` field — Vercel docs + pnpm `packageManager` field RFC (cross-verified)

### Tertiary (LOW confidence — flagged)

- `@axe-core/cli` as a no-install alternative for FND-07 verification — haven't personally verified it runs cleanly against a Next 16 deployment, but the tool is the standard ad-hoc axe runner. Wave 0 task should smoke-test it.
- Biome `useSortedClasses` under `nursery` in 2.4 — documented in Biome changelog but "nursery" status means it could move/change before Biome 3. Using `warn` level mitigates the risk.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — every version verified against both STACK.md lock and npm registry today; three version-drift gaps documented with recommendations.
- Architecture: HIGH — UI-SPEC and ARCHITECTURE.md already lock the folder structure, component boundaries, and motion provider strategy verbatim. This file translates them into an executable order.
- Pitfalls: HIGH — PITFALLS.md is the authoritative source (18 numbered pitfalls). Phase 1 specific distillation + Turbopack/Tailwind-v4 integration edge cases added from current Motion 12 + Tailwind 4.2 docs.
- Validation: MEDIUM — Vitest is a sensible default but hasn't been ratified by the project yet (no existing tests). Planner should confirm Vitest vs "no automated tests, manual verification only" as a phase-gate question.
- Environment: HIGH — verified directly via `command -v` and version probes on 2026-04-20.

**Research date:** 2026-04-20
**Valid until:** 2026-05-20 (stack is stable, but Zod 4 / TS 6 migration windows are closing; revisit before Phase 2 starts)
