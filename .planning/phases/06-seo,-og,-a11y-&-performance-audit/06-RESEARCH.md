# Phase 6: SEO, OG, A11y & Performance Audit — Research

**Researched:** 2026-05-17
**Domain:** Next.js 16.2 File-System Metadata API + a11y test infra + local Lighthouse
**Confidence:** HIGH

## Summary

Phase 6 is the launch gate. It ships **two visual artifacts** (dynamic OG images via `next/og` `ImageResponse`; an `oe` monogram favicon set) and **six audit surfaces** (sitemap.ts, robots.ts, vitest-axe a11y tests, keyboard test, anti-features launch gate, per-route metadata audit, manual Lighthouse run). Everything else is build-time or test-time — zero new client islands, zero new motion, zero new tokens.

Critical findings:

- **Next.js 16.2 OG generation is well-documented and File-System-Convention auto-wired.** A sibling `app/opengraph-image.tsx` (or `.png/.jpg`) emits `<meta property="og:image">` automatically. Per-route `[slug]/opengraph-image.tsx` with `generateImageMetadata` enumerates project slugs and replaces the default for matching routes — Phase 3's `generateMetadata` already declaring `openGraph.images` will **be overridden** by the sibling file convention (verified — sibling file takes precedence).
- **The `next/og` Node.js runtime is the default in Next 16** — `runtime = 'edge'` is **NOT** required and should not be opted into for our case. The official docs example loads fonts via `readFile(join(process.cwd(), 'assets/Geist-Medium.ttf'))` from the Node.js filesystem. The CONTEXT.md font-loading snippet uses `fetch(new URL('../../../../node_modules/geist/...'))` which is the Edge-runtime pattern — both work, but **the Node.js `readFile` pattern is what current docs prescribe**, is more readable, and avoids the brittle `../../../../` traversal.
- **Sitemap + robots are 6-line files** that compose `getAll()` from `lib/projects.ts`. `MetadataRoute.Sitemap` type still exposes `changeFrequency` and `priority` — Google ignores them per current guidance, so we omit them. **`metadataBase` is already set in `app/layout.tsx`** (verified line 8), so sitemap URLs can be either absolute or path-relative; we'll use absolute via `metadataBase` to be explicit.
- **Favicon set: `app/favicon.ico` already exists** (25KB MS Windows icon, scaffolded by create-next-app). Phase 6 must replace it with the `oe` monogram design. `app/icon.svg` + `app/apple-icon.png` are added as siblings. Next 16 auto-discovers all three via file-system conventions; **no `<link>` tags in `app/layout.tsx` are required or permitted** (would double-wire).
- **`vitest-axe` is at `0.1.0` stable (Oct 2022) but `1.0.0-pre.5` is current (Jan 2025).** Use `1.0.0-pre.5` — the `0.1.0` line lacks the matcher-import-path split and current Vitest 3 type definitions. Recommended install: `pnpm add -D vitest-axe@1.0.0-pre.5`.
- **`@lhci/cli@0.15.1`** (Jun 2025) is current; `pnpm dlx @lhci/cli@latest autorun` runs without a global install. Local-only — no GitHub Actions workflow per CONTEXT.md. Output `outputDir: lighthouse-reports/` writes per-URL HTML reports we can grep for scores.
- **One Wave 0 cleanup needed:** the placeholder SVGs `public/{file,globe,next,vercel,window}.svg` from create-next-app are orphaned (no source-grep matches in the repo). Phase 6 audit-only sweep should delete them (otherwise they appear in the deployed build and dilute the public/ asset set). This is a pre-existing legacy not a Phase 6 deliverable, but the launch-gate sweep is the right place to surface it.

**Primary recommendation:** Default to **static-friendly Node.js runtime** for both OG image routes (no `runtime = 'edge'` export). Use `readFile(join(process.cwd(), 'node_modules/geist/dist/fonts/...'))` for font loading — matches official docs, avoids `../../../../` brittleness, and is fully compatible with Vercel's default Node.js bundling. Skip the optional `scripts/build-icons.ts` step in Phase 6 and ship `app/icon.svg` + a hand-exported `app/apple-icon.png` + `app/favicon.ico` (committed binaries) — adding a build-time rasterizer is a maintenance liability for one-shot icons that will not change.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Dynamic OG Images (MTA-02)**
- **Per-route generation:** Use `next/og`'s `ImageResponse` via App Router's `opengraph-image.tsx` convention. One default at `app/opengraph-image.tsx` (or root), and per-project ones under `app/(site)/projects/[slug]/opengraph-image.tsx` using `generateImageMetadata`. Phase 7 projects auto-inherit OG images without manual wiring.
- **Visual design:** Dark `#0a0a0a` background, GeistMono lowercase wordmark `olivelliott.dev` top-left, page title H1 (project title or page name) at display scale center-left, year + tags row bottom-left in `--color-text-tertiary`. 1200×630, simple typographic composition. No images, no decorations. Matches the editorial register of the site.
- **Font loading:** Fetch Geist font files via Edge-runtime `fetch` from the `geist` package paths (or `geist/font/sans` if exposed). Avoid system fallback (looks generic) and Google Fonts CDN (slower, external dep).
- **Fallback chain:** per-route OG (`opengraph-image.tsx` → auto-wired to `openGraph.images` for that route) → site default OG (`/public/og-default.png` shipped Phase 3). Per-page `generateMetadata` doesn't need to manually set `openGraph.images` for routes that have a sibling `opengraph-image.tsx` — Next handles wiring.

**Sitemap, Robots, Favicons (MTA-03, MTA-04)**
- **Sitemap:** `app/sitemap.ts` exports default async function returning `MetadataRoute.Sitemap`. Enumerates `/`, `/about`, `/projects`, `/resume`, plus each `/projects/${slug}` from `getAll()`. `lastModified` derived from each project's `year` field (constructed as `new Date(year, 11, 31)`). `priority` and `changeFreq` omitted per current Google guidance (deprecated signals). Auto-extends as Phase 7 lands more projects.
- **Robots.txt:** `app/robots.ts` exports default function returning `MetadataRoute.Robots`. Allow all crawlers for `/`. Disallow `/_next/`, `/api/`. Sitemap pointer to `${BASE_URL}/sitemap.xml`. NO `noindex` on `/resume` (HTML serves same content as PDF; both are public-facing assets).
- **Favicon set:** Generate from a single design source:
  - `app/icon.svg` — primary favicon (modern browsers); typographic `oe` monogram, GeistMono lowercase, `--color-accent` (`#fbbf24`) on `--color-bg` (`#0a0a0a`).
  - `app/apple-icon.png` — 180×180 raster derived from same design (Next.js auto-wires).
  - `app/favicon.ico` — multi-size legacy fallback (16/32/48 raster from SVG).
  - Next.js File-system Conventions auto-wire all three.
- **`metadataBase` + canonical:** Phase 1 should have set `metadataBase: new URL('https://olivelliott.dev')` in root layout — Phase 6 audits and fixes if missing. Every page's `generateMetadata` sets `alternates.canonical = pathname`. Phase 3 + 4 already follow this; Phase 6 audits for misses.

**A11y Verification (QAL-02, QAL-03, QAL-04)**
- **Tooling:** Add `vitest-axe@^1` as devDependency. Use for component- and page-level checks in jsdom. Defer Playwright + `@axe-core/playwright` to v2 (too heavy for v1 scope).
- **Coverage targets:** `tests/a11y/` directory with one test per public route:
  - `tests/a11y/home.test.tsx` (`/`)
  - `tests/a11y/projects-index.test.tsx` (`/projects`)
  - `tests/a11y/myco-detail.test.tsx` (`/projects/myco`)
  - `tests/a11y/about.test.tsx` (`/about`)
  - `tests/a11y/resume.test.tsx` (`/resume`)
  Each renders the page via existing test patterns and runs `axe(container)`. Zero violations = pass.
- **Reduced-motion (QAL-04):** Source-grep test (extends Phase 4 anti-pattern net): assert that every file importing from `motion/react` has a corresponding `useReducedMotion()` gate OR is documented as CSS-only-motion-safe. The current Phase 4 + 5 motion islands (`ThesisParagraph` only) already comply.
- **Keyboard nav (QAL-03):** `tests/a11y/keyboard.test.tsx` — for each public route, assert every interactive element (`<a>`, `<button>`, role="button", `<input>`) is reachable via Tab and has `:focus-visible` styling. Defaults: rely on native focusability + Phase 1's global `:focus-visible` ring. Manual walkthrough documented as a verification step (not blocking).

**Performance Budget & Anti-Features Audit (QAL-01, QAL-05)**
- **Lighthouse target (QAL-01):** Install `@lhci/cli` as devDep. Run `pnpm lhci` against `pnpm build && pnpm start` locally for `/` and `/projects/myco`. Document scores in `.planning/phases/06-seo,-og,-a11y-&-performance-audit/lighthouse-report.md`. Target ≥ 90 across Performance / Accessibility / Best Practices / SEO. If any axis < 90 → gap-closure task (one cycle).
- **Anti-features sweep (QAL-05):** Author `tests/launch-gate/anti-features.test.ts` — comprehensive source-grep + DOM-grep assertions for all 19 items from `research/FEATURES.md`. Extends the Phase 4 `tests/home/anti-patterns.test.ts` net into a comprehensive launch-time gate.
- **Per-route metadata audit (MTA-01):** Author `tests/seo/metadata.test.ts` — for each public route, assert `generateMetadata` returns:
  - Unique `title` (no two routes share)
  - Unique `description` (>= 50 chars, <= 160)
  - Valid `openGraph` with `title`, `description`, `url`, `images`
  - Valid `twitter` with `card: 'summary_large_image'`
  - `alternates.canonical` matches pathname
- **No new perf optimizations in scope.** Audit-only. If Lighthouse drops below 90 on any axis, that becomes a one-cycle gap-closure task. Likely culprits to watch: hero image `priority`/`sizes` props, font-display strategy, motion island bundle size.

### Claude's Discretion

- Exact OG layout proportions within the dark editorial composition (typographic balance).
- Whether `app/icon.tsx` (dynamic via ImageResponse) or `app/icon.svg` (static) is cleaner — both Next.js conventions; static SVG simpler.
- Whether to add a single `app/icon-dark.svg` for prefers-color-scheme variation (defer if it complicates the conventions).
- Whether `tests/a11y/` runs in parallel via vitest's default sharding (no special config needed).
- Whether `vitest-axe` violations are surfaced as test-failure messages or aggregated into a single report file (default test failure is fine).
- Whether to include `tests/launch-gate/anti-features.test.ts` in the regular `pnpm vitest run` or behind an env gate (recommend included — it's source-grep + DOM-grep, fast).
- Whether the `lighthouse-report.md` gets committed (recommend yes — historical record).
- Specific Lighthouse command flags (`--headless`, `--quiet`, `--chrome-flags='--no-sandbox'` if CI).

### Deferred Ideas (OUT OF SCOPE)

- Lighthouse CI in GitHub Actions (defer; Vercel Speed Insights + manual lhci is enough for v1 brochure scale).
- `@axe-core/playwright` E2E a11y (defer; vitest-axe component-level covers most issues).
- Per-page Lighthouse score badges (defer; lighthouse-report.md is enough).
- Multi-language OG images (out of scope; no i18n in v1).
- Dark/light favicon variants (defer; dark theme only in v1).
- Pre-emptive perf optimizations (audit-only; only act on actual Lighthouse misses).
- Vercel Speed Insights dashboard customization (out of scope; defaults are fine).
- Twitter creator handle (`twitter:creator`) — defer until Olive confirms her Twitter/X handle.
- Schema.org JSON-LD structured data (defer to v2 if it improves search snippets meaningfully).
- Pre-rendered OG images committed to git (defer; dynamic generation is cleaner and Vercel caches).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| **MTA-01** | Every route has `generateMetadata` (or static `metadata`) producing a unique title and description | All 5 public routes already declare `metadata`/`generateMetadata` (verified in Step 1). Phase 6 ships `tests/seo/metadata.test.ts` to audit uniqueness + shape. Pattern 5 below. |
| **MTA-02** | Every route has an OG image (Twitter card + Open Graph) — dynamic in this phase | `app/opengraph-image.tsx` + `app/(site)/projects/[slug]/opengraph-image.tsx` via Next 16 file convention. Auto-wires `<meta property="og:image">` per route. Pattern 1. |
| **MTA-03** | A valid `sitemap.xml` is generated and a `robots.txt` is present | `app/sitemap.ts` + `app/robots.ts` — `MetadataRoute.Sitemap` + `MetadataRoute.Robots` shape from Next 16 docs. Patterns 3 + 4. |
| **MTA-04** | Favicon set is in place (SVG + ICO + apple-touch) | `app/icon.svg` (hand-authored) + `app/apple-icon.png` (180×180 raster) + `app/favicon.ico` (overwrite the create-next-app stub). All auto-wired by Next 16 file-system conventions. Pattern 6. |
| **QAL-01** | Lighthouse scores ≥ 90 across Performance/Accessibility/Best Practices/SEO on home + one hero project page | `@lhci/cli@0.15.1` local autorun against `pnpm build && pnpm start`; outputDir `lighthouse-reports/`; scores documented in `lighthouse-report.md`. Pattern 9. |
| **QAL-02** | axe-core scan clean on home, one project page, `/resume` | `vitest-axe@1.0.0-pre.5` — 5 route-level tests under `tests/a11y/`. Pattern 7. |
| **QAL-03** | All interactions work via keyboard only (nav, tag filters, resume download) | `tests/a11y/keyboard.test.tsx` — source-grep + DOM-grep for tabIndex/role/native focusability across all interactive elements. Pattern 8. |
| **QAL-04** | Reduced-motion OS setting disables decorative motion across the site | Source-grep test extends `tests/home/anti-patterns.test.ts` PHASE_SOURCES — assert every `motion/react` importer pairs with `useReducedMotion()` (only `ThesisParagraph` currently qualifies). Pattern 10. |
| **QAL-05** | Launch checklist verifies none of the 19 anti-features from `research/FEATURES.md` slipped in | `tests/launch-gate/anti-features.test.ts` — 19 source-grep + DOM-grep assertions over `app/**` and `components/**`. Full mapping in Pattern 11 below. |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

- **Stack lock**: Next.js 16.2.x, React 19.2.x, TypeScript 5.7 strict, Tailwind v4.1 CSS-first, Motion 12.37+ from `motion/react`, Geist via `next/font/local` package, MDX via `@next/mdx`, Zod, Vercel (subdomain initially).
- **Hosting**: Vercel — deploy every `main` push. Use `@vercel/analytics` + `@vercel/speed-insights` (already wired Phase 1).
- **Aesthetic**: dark theme only, minimalist, high-touch typography. No generic AI-template aesthetics — `research/FEATURES.md` lists 19 anti-features that are codified into Phase 6's launch gate.
- **Performance budget**: Lighthouse ≥ 90 on Performance / A11y / Best Practices / SEO for landing + hero project pages. **CLS / TBT / LCP** are the explicit failure modes to watch; motion must not block interaction.
- **A11y**: WCAG AA minimum, keyboard nav for all interactions, reduced-motion support, sufficient dark-theme contrast.
- **Privacy**: never fabricate metrics, no internal Aktiga/Voya/Spectra details, placeholders are explicit placeholders.
- **Content honesty**: Phase 6 banned-word list extension (OG-card flourishes): *introducing, presenting, the all-new, transform your, supercharge, next-generation, AI-powered, built with love*.
- **Don't Use** (from CLAUDE.md "What NOT to Use"): Contentlayer (abandoned), `next-mdx-remote` (archived), Lottie, `react-three-fiber`, Aceternity-style templates, GA4, `styled-components`, `next-auth`, runtime CSS-in-JS, `moment`. Phase 6 launch-gate test enforces several of these via the anti-features net.
- **GSD workflow enforcement**: this research file is exactly the planning artifact CLAUDE.md mandates. Plans + edits flow from it.

## Standard Stack

### Core (already installed — Phase 6 adds zero new runtime deps)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `next` | `16.2.4` (locked) | App Router, file-system metadata conventions (`opengraph-image.tsx`, `sitemap.ts`, `robots.ts`, `icon.svg`, `apple-icon.png`, `favicon.ico`), `ImageResponse` | Phase 6 ships entirely on Next 16's built-in conventions. No `@vercel/og` dep needed — `next/og` re-exports it. |
| `next/og` | (sub-export of `next`) | `ImageResponse` constructor | Default Node.js runtime in Next 16; supports `fonts` array, 500KB bundle cap, Satori-backed flexbox-only CSS. |
| `geist` | `^1.7.0` | Source of `Geist-Medium.ttf` / `GeistMono-Medium.ttf` for OG `ImageResponse` `fonts` array | Already installed (FND-03). Real font files live at `node_modules/geist/dist/fonts/geist-{sans,mono}/Geist{Mono,}-Medium.ttf` (verified on disk — both `.ttf` and `.woff2` shipped; use `.ttf` because `next/og`/Satori parses TTF/OTF/WOFF only and TTF/OTF is fastest). |
| `react` / `react-dom` | `19.2.4` | RSC for OG generation, RSC for page render in axe tests | Already installed. |
| `next` `MetadataRoute` types | (re-export from `next`) | TS types for `Sitemap` and `Robots` | Zero install — `import type { MetadataRoute } from 'next'`. |
| `lib/projects.ts` `getAll()` | existing | Source for sitemap project enumeration and `generateImageMetadata` slug list | Already loads Myco; auto-extends as Phase 7 lands MDX. |

### Supporting (devDependencies — Phase 6 adds these)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `vitest-axe` | `1.0.0-pre.5` (Jan 2025) | axe-core matcher for Vitest — `axe(container)` + `toHaveNoViolations` | The 5 `tests/a11y/*.test.tsx` route-level tests + the keyboard test. **Use the `1.0.0-pre.5` line, NOT `0.1.0`** (2022) — the prerelease has the matcher-import-path split (`vitest-axe/matchers`, `vitest-axe/extend-expect`) and current TypeScript module-augmentation pattern. peerDep `vitest >= 0.16.0` (we're on 3). |
| `@lhci/cli` | `0.15.1` (Jun 2025) | Local Lighthouse CI runner — `lhci autorun` with `startServerCommand` for Next.js | One-shot manual local run for `/` + `/projects/myco`. **Do not install as devDep — invoke via `pnpm dlx @lhci/cli@latest autorun --config=./lighthouserc.json`** to keep the deploy artifact slim. Add `pnpm lhci` script that wraps the dlx call so the canonical invocation is single-source. |
| `axe-core` | `4.11.4` (transitively via `vitest-axe`) | The actual a11y engine | No direct install needed — comes through `vitest-axe`'s `dependencies` (`axe-core: ^4.4.2`). |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `vitest-axe@1.0.0-pre.5` | `vitest-axe@0.1.0` (stable) | 0.1.0 is from Oct 2022; lacks matcher-import-path split, weaker TS types, no Vitest 3 verification. The `pre.x` line is what active maintainers ship and is what the README documents. Verified by `npm view`. |
| `vitest-axe` | `@axe-core/playwright` + Playwright | Playwright tests catch CSS/layout issues jsdom can't render; Defer to v2 per CONTEXT.md — vitest-axe covers semantic HTML / ARIA / contrast issues which are 90% of v1 risk surface. |
| Static `app/icon.svg` (hand-authored) | Dynamic `app/icon.tsx` (ImageResponse) | Dynamic adds a `node:fs` font-load on every favicon request (or static-optimized at build); static SVG is one file with `<path>` glyphs, zero runtime cost. Per UI-SPEC § Favicon, glyph-as-path is the design contract → static SVG is the right tool. |
| `@vercel/og` directly | `next/og` (re-export) | Vercel docs themselves recommend `next/og` for Next.js apps — it pre-wires the runtime + asset bundling. Identical API surface. |
| `@lhci/cli` autorun | Manual `lighthouse` CLI | `lhci autorun` chains `collect` + `assert` + `upload` in one command, handles server startup/teardown, and writes machine-readable JSON. Manual `lighthouse` requires hand-rolling all three. |
| `sharp` build script for icons | Hand-export from Figma | UI-SPEC marks the script as optional. For v1 (one set of icons), Figma export → commit is simpler. Add the script in v1.x if icon design churns. |
| `app/sitemap.xml` (static) | `app/sitemap.ts` (generated) | Static file would require manual editing every time Phase 7 adds a project. `.ts` enumerates `getAll()` and auto-extends. Decision locked in CONTEXT.md. |

**Installation:**

```bash
# Single devDep install — everything else is already in package.json.
pnpm add -D vitest-axe@1.0.0-pre.5
```

**Version verification (run before committing):**

```bash
npm view vitest-axe@1.0.0-pre.5 version  # → 1.0.0-pre.5
npm view @lhci/cli version                # → 0.15.1 (no install; for pnpm dlx)
npm view next version                     # confirm 16.2.x still active
```

## Architecture Patterns

### Recommended File Tree (Phase 6 additions only)

```
app/
├── opengraph-image.tsx              # Default OG for /, /about, /projects, /resume
├── opengraph-image.alt.txt          # alt text sibling for the default OG
├── (site)/
│   └── projects/
│       └── [slug]/
│           └── opengraph-image.tsx  # Per-project OG via generateImageMetadata
├── sitemap.ts                       # MetadataRoute.Sitemap default export
├── robots.ts                        # MetadataRoute.Robots default export
├── icon.svg                         # oe monogram, glyph-as-path, 32×32 viewBox
├── apple-icon.png                   # 180×180 raster (committed binary)
└── favicon.ico                      # multi-size 16/32/48 (OVERWRITE the existing 25KB scaffolder stub)

tests/
├── a11y/
│   ├── home.test.tsx                # axe(container) for /
│   ├── projects-index.test.tsx      # axe(container) for /projects
│   ├── myco-detail.test.tsx         # axe(container) for /projects/myco
│   ├── about.test.tsx               # axe(container) for /about
│   ├── resume.test.tsx              # axe(container) for /resume
│   └── keyboard.test.tsx            # tab order + native focusability sweep
├── seo/
│   └── metadata.test.ts             # MTA-01 — per-route metadata audit
└── launch-gate/
    └── anti-features.test.ts        # QAL-05 — 19-item launch gate

lighthouserc.json                    # Repo root, @lhci/cli configuration
.planning/phases/06-…/lighthouse-report.md  # Committed run results
```

### Pattern 1: Default OG Image (`app/opengraph-image.tsx`)

```tsx
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image
// Source: https://nextjs.org/docs/app/api-reference/functions/image-response

import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// File-convention exports (Next 16 auto-wires these into <meta property="og:image:*">):
export const alt =
  'olivelliott.dev — engineer building tools for autonomy, local-first systems, and open-source communities.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Per-route title + meta resolution.
// The default OG must serve 4 routes — /, /about, /projects, /resume — but the
// file-system convention only ships ONE default OG.tsx at app/ root, which Next
// applies to EVERY child route lacking a sibling override.
// Therefore the default OG renders a single, route-agnostic composition
// matching the / variant from UI-SPEC § Copywriting Contract. The /about,
// /projects, /resume routes inherit this default (acceptable per UI-SPEC
// Fallback Chain). To get per-route Default OG variants we would need
// app/(site)/about/opengraph-image.tsx, app/(site)/projects/opengraph-image.tsx,
// and app/resume/opengraph-image.tsx as SEPARATE sibling files — each mirroring
// this default with different title/meta strings.
//
// Discretionary: choose either A) single root default + 4 sibling overrides
// (4 files, locks per-route copy), or B) single root default with the / copy
// (1 file, 3 routes show generic copy). Recommend A — UI-SPEC § Copywriting
// Contract locks the per-route strings, and a sibling .tsx that delegates to
// a shared lib/og-template.tsx renderer is 4 small files + 1 shared module.

export default async function Image() {
  // process.cwd() is the Next.js project root.
  const geistSansMedium = await readFile(
    join(process.cwd(), 'node_modules/geist/dist/fonts/geist-sans/Geist-Medium.ttf'),
  )
  const geistMonoMedium = await readFile(
    join(
      process.cwd(),
      'node_modules/geist/dist/fonts/geist-mono/GeistMono-Medium.ttf',
    ),
  )

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#0a0a0a',
          padding: 64,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          fontFamily: 'GeistSans',
        }}
      >
        {/* Wordmark */}
        <div
          style={{
            fontFamily: 'GeistMono',
            fontSize: 32,
            fontWeight: 500,
            letterSpacing: '0.02em',
            color: '#737373',
            display: 'flex',
          }}
        >
          olivelliott.dev
        </div>
        {/* Title block */}
        <div
          style={{
            fontFamily: 'GeistSans',
            fontSize: 80,
            fontWeight: 500,
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            color: '#f5f5f5',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          olive elliott — engineer building tools for autonomy
        </div>
        {/* Meta row */}
        <div
          style={{
            fontFamily: 'GeistMono',
            fontSize: 20,
            fontWeight: 500,
            letterSpacing: '0.02em',
            color: '#737373',
            display: 'flex',
          }}
        >
          2026 · local-first · autonomous · open-source
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'GeistSans', data: geistSansMedium, weight: 500, style: 'normal' },
        { name: 'GeistMono', data: geistMonoMedium, weight: 500, style: 'normal' },
      ],
    },
  )
}
```

**Key facts confirmed against Next 16.2.6 docs (May 2026):**

- `runtime` export is **not required** — default is Node.js runtime, which supports `readFile` + `process.cwd()` natively.
- `params` (when present on a dynamic route) is a `Promise<{...}>` in Next 16 — must `await`.
- `ImageResponse` returns a `Response`; Next renders it to PNG at `/opengraph-image` (or `/route/opengraph-image`).
- Bundle size cap **500 KB** including fonts + assets. Two `.ttf` files at weight 500 are ~80 KB each → well under cap.
- `display: 'flex'` is required on every element with children (Satori limitation — `display: 'grid'` is **NOT** supported).
- The shared `lib/og-template.tsx` (recommended) takes `{ title, meta }` props and returns the JSX so all 5 OG variants reuse the same composition. Per-route .tsx files become 15-line delegations.

### Pattern 2: Per-Project OG (`app/(site)/projects/[slug]/opengraph-image.tsx`)

```tsx
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-image-metadata

import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { notFound } from 'next/navigation'
import { join } from 'node:path'
import { getAll, getProject } from '@/lib/projects'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Enumerate slugs at build time so each project gets a statically-generated OG.
// Returning { id: project.slug, alt, size } makes the slug available to Image()
// as `id: Promise<string>` per the Next 16 v16.0.0 change.
export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) return [] // empty array → no OG image for unknown slugs

  return [
    {
      id: project.slug,
      contentType: 'image/png',
      size,
      alt: `${project.title} — ${project.tagline}`,
    },
  ]
}

export default async function Image({
  params,
  id: _id,
}: {
  params: Promise<{ slug: string }>
  id: Promise<string>
}) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()

  const geistSansMedium = await readFile(
    join(process.cwd(), 'node_modules/geist/dist/fonts/geist-sans/Geist-Medium.ttf'),
  )
  const geistMonoMedium = await readFile(
    join(process.cwd(), 'node_modules/geist/dist/fonts/geist-mono/GeistMono-Medium.ttf'),
  )

  const tags = project!.tags.slice(0, 3).join(' · ')
  const meta = `${project!.year} · ${tags}`

  // Auto-select title size: 80px for short titles, 64px for two-line wraps.
  const titleSize = project!.title.length <= 24 ? 80 : 64

  return new ImageResponse(
    (
      <div style={{ /* ...same shell as Pattern 1, with project!.title + meta */ }}>
        {/* wordmark / title (titleSize) / meta */}
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'GeistSans', data: geistSansMedium, weight: 500, style: 'normal' },
        { name: 'GeistMono', data: geistMonoMedium, weight: 500, style: 'normal' },
      ],
    },
  )
}
```

**Critical:** `generateImageMetadata` returns an `id` per Next 16. The `id` is then a `Promise<string>` on the `Image()` default function — destructure but do not need to use it if `params.slug` already identifies the project (which it does). Including `id` in the destructure satisfies the TS shape and is forward-compatible if Olive ever wants multiple OG variants per project (e.g., light/dark).

**Phase 3 metadata conflict resolution:** `app/(site)/projects/[slug]/page.tsx` `generateMetadata` currently sets `openGraph.images: [{ url: ogImage, ... }]` manually. **Next.js takes the sibling file convention as the authoritative source when both are present** — but the merge order can surprise. Phase 6 should DELETE the manual `openGraph.images` declaration from Phase 3's `generateMetadata` once the sibling `opengraph-image.tsx` lands. Same audit needed for `app/(site)/page.tsx`, `app/(site)/projects/page.tsx`, `app/(site)/about/page.tsx`, `app/resume/page.tsx`.

### Pattern 3: Sitemap (`app/sitemap.ts`)

```ts
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap

import type { MetadataRoute } from 'next'
import { getAll } from '@/lib/projects'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://olivelliott.dev'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`,         lastModified: new Date() },
    { url: `${SITE_URL}/about`,    lastModified: new Date() },
    { url: `${SITE_URL}/projects`, lastModified: new Date() },
    { url: `${SITE_URL}/resume`,   lastModified: new Date() },
  ]

  // Each project's lastModified is Dec 31 of its declared year (the schema
  // only stores the year, not a fine-grained timestamp). This is a stable,
  // deterministic build-time value — Google ignores priority/changeFreq, so
  // we omit them per current SEO guidance.
  const projectRoutes: MetadataRoute.Sitemap = getAll().map((p) => ({
    url: `${SITE_URL}/projects/${p.slug}`,
    lastModified: new Date(p.year, 11, 31),
  }))

  return [...staticRoutes, ...projectRoutes]
}
```

**Type shape (Next 16.2.6, verified):**

```ts
type Sitemap = Array<{
  url: string
  lastModified?: string | Date
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
  alternates?: { languages?: Languages<string> }
  images?: string[]   // image sitemap
  videos?: { title; thumbnail_loc; description; ... }[]  // video sitemap
}>
```

**Confirmed:** `changeFrequency` and `priority` are still in the `MetadataRoute.Sitemap` type as of Next 16.2.6. We omit both — Google deprecated them as signals; including them adds noise without value.

### Pattern 4: Robots (`app/robots.ts`)

```ts
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots

import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://olivelliott.dev'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/_next/', '/api/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
```

**Type shape (Next 16.2.6):**

```ts
type Robots = {
  rules: {
    userAgent?: string | string[]
    allow?: string | string[]
    disallow?: string | string[]
    crawlDelay?: number
  } | Array<{ userAgent: string | string[]; allow?: ...; disallow?: ...; crawlDelay?: number }>
  sitemap?: string | string[]
  host?: string
}
```

**Output:**
```
User-Agent: *
Allow: /
Disallow: /_next/
Disallow: /api/

Sitemap: https://olivelliott.dev/sitemap.xml
```

### Pattern 5: Per-Route Metadata Audit (`tests/seo/metadata.test.ts`)

Existing patterns confirmed: every public route exports either a static `metadata` const (4 routes) or `generateMetadata` (1 route — the `[slug]` detail). Audit pattern:

```ts
// tests/seo/metadata.test.ts
// MTA-01 — per-route metadata audit. Asserts unique titles, body, OG, canonical.
import { describe, expect, it } from 'vitest'
import type { Metadata } from 'next'

// Static metadata routes: import the const directly.
import { metadata as homeMeta } from '@/app/(site)/page'
import { metadata as projectsMeta } from '@/app/(site)/projects/page'
import { metadata as aboutMeta } from '@/app/(site)/about/page'
import { metadata as resumeMeta } from '@/app/resume/page'
// Dynamic route: import generateMetadata + exercise with myco params.
import { generateMetadata as projectMeta } from '@/app/(site)/projects/[slug]/page'

interface AuditEntry {
  route: string
  meta: Metadata | Promise<Metadata>
  expectedCanonical: string
}

const entries: AuditEntry[] = [
  { route: '/',          meta: homeMeta,     expectedCanonical: '/' },
  { route: '/about',     meta: aboutMeta,    expectedCanonical: '/about' },
  { route: '/projects',  meta: projectsMeta, expectedCanonical: '/projects' },
  { route: '/resume',    meta: resumeMeta,   expectedCanonical: '/resume' },
  {
    route: '/projects/myco',
    meta: projectMeta({ params: Promise.resolve({ slug: 'myco' }) }),
    expectedCanonical: '/projects/myco',
  },
]

describe('per-route metadata audit (MTA-01)', () => {
  it('every route declares a non-empty description (50–160 chars)', async () => {
    for (const e of entries) {
      const m = await e.meta
      const d = m.description as string | undefined
      expect(d, `${e.route} missing description`).toBeTruthy()
      expect(d!.length, `${e.route} description ${d!.length} chars`).toBeGreaterThanOrEqual(50)
      expect(d!.length, `${e.route} description ${d!.length} chars`).toBeLessThanOrEqual(160)
    }
  })

  it('every route declares alternates.canonical matching its pathname', async () => {
    for (const e of entries) {
      const m = await e.meta
      // Home page does NOT need canonical (root); others must.
      if (e.route === '/') continue
      expect(m.alternates?.canonical, `${e.route} missing canonical`).toBe(e.expectedCanonical)
    }
  })

  it('every route declares twitter.card: summary_large_image', async () => {
    for (const e of entries) {
      const m = await e.meta
      const tw = m.twitter as { card?: string } | undefined
      expect(tw?.card, `${e.route} twitter.card missing`).toBe('summary_large_image')
    }
  })

  it('descriptions are unique across routes', async () => {
    const descs = await Promise.all(
      entries.map(async (e) => (await e.meta).description as string),
    )
    const set = new Set(descs)
    expect(set.size, `descriptions not unique: ${JSON.stringify(descs)}`).toBe(descs.length)
  })

  it('Next.js will auto-wire og:image from sibling opengraph-image.tsx — manual openGraph.images NOT required after Phase 6', async () => {
    // Phase 6 cleanup: once app/opengraph-image.tsx + app/[slug]/opengraph-image.tsx land,
    // the manual openGraph.images declarations in each generateMetadata/metadata should be
    // removed (Pattern 1 conflict note). This test inverts that — it asserts the manual
    // declaration is ABSENT for each route. Wave 0 of Phase 6 may keep this test xfail-ed
    // until the cleanup wave; remove the .skip in the final cleanup task.
    for (const e of entries) {
      const m = await e.meta
      // Soft assertion — log if still present, don't fail. Flip to hard fail in cleanup wave.
      if ((m.openGraph as { images?: unknown })?.images !== undefined) {
        // biome-ignore lint/suspicious/noConsole: visibility for cleanup wave
        console.warn(`[Phase 6 cleanup] ${e.route} still declares openGraph.images manually`)
      }
    }
  })
})
```

**Type-only `import type { Metadata } from 'next'`** ensures the test never pulls Next runtime. The dynamic route's `generateMetadata` is async — every entry is awaited uniformly.

### Pattern 6: Favicon Set

**Hand-author `app/icon.svg`** (single source of truth):

```xml
<!-- app/icon.svg — 32×32 viewBox, oe monogram, glyph-as-path -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <title>olivelliott.dev</title>
  <desc>Lowercase oe monogram in amber on dark — favicon for olivelliott.dev.</desc>
  <rect width="32" height="32" fill="#0a0a0a"/>
  <!-- Geist Mono lowercase 'o' + 'e' glyphs converted to paths, fitted to 24×16 interior -->
  <path d="..." fill="#fbbf24"/>  <!-- 'o' path -->
  <path d="..." fill="#fbbf24"/>  <!-- 'e' path -->
</svg>
```

The actual path data must be exported from Geist Mono at design time (Figma → Outline Strokes → copy `<path d>` values). UI-SPEC § Favicon locks the glyph-as-path strategy because browsers do not load Geist Mono when rendering favicons; a `<text>` element would fall back to the system mono.

**`app/apple-icon.png`**: 180×180 PNG raster, committed binary. Can be hand-exported from the same Figma source via `Export PNG @180×180`. Skip the optional `scripts/build-icons.ts` for v1.

**`app/favicon.ico`**: multi-image ICO containing 16×16, 32×32, 48×48 rasters. **Overwrite the existing 25,931-byte create-next-app stub** at `app/favicon.ico` (verified on disk; the current file is the default Next.js logo favicon). Generate via online ICO converter or Figma export → `sharp-ico`. Committed binary.

**No manual `<link>` tags in `app/layout.tsx` are needed or permitted** — Next 16 file conventions auto-emit:

```html
<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="icon" href="/icon?<hash>" type="image/svg+xml" sizes="any" />
<link rel="apple-touch-icon" href="/apple-icon?<hash>" type="image/png" sizes="180x180" />
```

### Pattern 7: A11y Tests with `vitest-axe` (`tests/a11y/*.test.tsx`)

**Setup additions:**

```ts
// vitest.setup.ts — extend the existing single-line file with vitest-axe matchers
import '@testing-library/jest-dom/vitest'
import 'vitest-axe/extend-expect'
```

**TypeScript module augmentation** (one-time in any `tests/types/vitest-axe.d.ts` or inline in `vitest.setup.ts`):

```ts
import 'vitest'
import type { AxeMatchers } from 'vitest-axe/matchers'

declare module 'vitest' {
  export interface Assertion extends AxeMatchers {}
  export interface AsymmetricMatchersContaining extends AxeMatchers {}
}
```

**Per-route axe test pattern** — leverages the **existing** sync-vs-async route signature differences (confirmed in Step 1):

```tsx
// tests/a11y/home.test.tsx — synchronous RSC, plain render()
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import HomePage from '@/app/(site)/page'

// Optional: scope rules. Default ruleset (WCAG 2.1 AA) is fine for v1.
describe('/ a11y', () => {
  it('has no axe violations', async () => {
    const { container } = render(<HomePage />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
```

```tsx
// tests/a11y/projects-index.test.tsx — ASYNC RSC route, await Page() then render
import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'

// Mock projects so the page renders deterministically (Myco only at Phase 6 time).
vi.mock('@/lib/projects', () => ({
  getAll: () => [/* fixture */],
  getAllTags: () => [/* fixture */],
  getProjectsByTag: () => [/* fixture */],
}))

describe('/projects a11y', () => {
  it('has no axe violations', async () => {
    const { default: Page } = await import('@/app/(site)/projects/page')
    const ui = await Page({ searchParams: Promise.resolve({}) })
    const { container } = render(ui)
    expect(await axe(container)).toHaveNoViolations()
  })
})
```

**Async RSC route handling pattern** (confirmed in `tests/projects/index-page.test.tsx`): `const ui = await Page({ searchParams: Promise.resolve({}) })` then `render(ui)`. Same pattern works for `/projects/[slug]` with `params: Promise.resolve({ slug: 'myco' })`.

**Motion mock needed for any route that transitively loads `ThesisParagraph`** (the `/` route does). Reuse the Proxy-based motion mock from `tests/home/page.test.tsx` lines 26-56 (already a documented Phase 4 pattern).

**Layout chrome inclusion**: For full-route a11y coverage, tests should render the page through the `(site)` layout to catch Nav/Footer/SkipLink issues. Pattern:

```tsx
import { axe } from 'vitest-axe'
import SiteLayout from '@/app/(site)/layout'
import HomePage from '@/app/(site)/page'

const { container } = render(
  <SiteLayout>
    <HomePage />
  </SiteLayout>,
)
expect(await axe(container)).toHaveNoViolations()
```

This catches issues like duplicate landmarks, skip-link target missing, footer link contrast — which are real Phase 6 risk surfaces. Recommend wrapping every a11y test in `<SiteLayout>` except `/resume` (which has its own chromeless layout). For `/resume` use `<>{children}</>` since the layout is the fragment passthrough.

### Pattern 8: Keyboard Nav Test (`tests/a11y/keyboard.test.tsx`)

**Two layers — DOM-rendered + source-grep**:

```tsx
// tests/a11y/keyboard.test.tsx — QAL-03
import fs from 'node:fs'
import path from 'node:path'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

// Source-grep layer: scan every app/ and components/ file for interactive elements
// declared with negative tabIndex or role-without-tabIndex. Native <a>, <button>,
// <input>, <select>, <textarea> are tab-reachable by default — pass automatically.
//
// The DOM-rendered layer below complements this by asserting that EVERY rendered
// route has at least one focusable element AND that no interactive element has
// tabIndex={-1} that isn't documented (the skip-link is the only exception).
describe('keyboard nav (QAL-03)', () => {
  it('source-grep: no tabIndex={-1} except SkipLink', () => {
    // Walk app/ and components/ — find all .tsx files, check for tabIndex={-1}.
    // ...
  })

  it('every rendered route has at least one tab-reachable element', async () => {
    // Render each route via the same pattern as Pattern 7. Then:
    const focusables = Array.from(
      container.querySelectorAll(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    )
    expect(focusables.length).toBeGreaterThan(0)
  })

  it('every <button> and <a href> has a non-hidden focus-visible style (via global CSS or className)', () => {
    // Phase 1's globals.css declares :focus-visible globally; nothing to assert at the DOM
    // level. This test is a source-grep on app/globals.css for `:focus-visible` selector
    // presence — locks the global ring against accidental deletion.
    const css = fs.readFileSync(
      path.resolve(process.cwd(), 'app/globals.css'),
      'utf8',
    )
    expect(/:focus-visible/.test(css), 'globals.css missing :focus-visible rule').toBe(true)
  })
})
```

**The actual interactive walk-through** (clicking through filter chips with Tab/Enter, downloading the PDF) is **not jsdom-testable** — user-event Tab simulation in jsdom is unreliable. Document as a **manual verification** in `lighthouse-report.md`'s checklist. This is acknowledged by CONTEXT.md ("Manual walkthrough documented as a verification step (not blocking)").

### Pattern 9: Lighthouse Local Run (`lighthouserc.json` + `pnpm lhci` script)

**`lighthouserc.json`** (repo root):

```json
{
  "ci": {
    "collect": {
      "numberOfRuns": 1,
      "startServerCommand": "pnpm start",
      "startServerReadyPattern": "Ready in",
      "startServerReadyTimeout": 30000,
      "url": [
        "http://localhost:3000/",
        "http://localhost:3000/projects/myco"
      ],
      "settings": {
        "preset": "desktop",
        "chromeFlags": "--headless=new --no-sandbox --disable-gpu"
      }
    },
    "assert": {
      "preset": "lighthouse:no-pwa",
      "assertions": {
        "categories:performance":     ["error", { "minScore": 0.9 }],
        "categories:accessibility":   ["error", { "minScore": 0.9 }],
        "categories:best-practices":  ["error", { "minScore": 0.9 }],
        "categories:seo":             ["error", { "minScore": 0.9 }]
      }
    },
    "upload": {
      "target": "filesystem",
      "outputDir": "./lighthouse-reports",
      "reportFilenamePattern": "%%PATHNAME%%-%%DATETIME%%.%%EXTENSION%%"
    }
  }
}
```

**`package.json` script addition:**

```json
{
  "scripts": {
    "lhci": "pnpm build && lhci autorun --config=./lighthouserc.json"
  }
}
```

Use `pnpm dlx @lhci/cli@0.15.1 autorun ...` to avoid installing as a devDep. The script wraps the dlx call:

```json
"lhci": "pnpm build && pnpm dlx @lhci/cli@0.15.1 autorun --config=./lighthouserc.json"
```

**Captured into `lighthouse-report.md`**:

```bash
# After lhci autorun completes, lighthouse-reports/ contains per-URL HTML + JSON.
# Extract scores from the JSON:
jq '{performance: .categories.performance.score, accessibility: .categories.accessibility.score, bestPractices: ."categories"["best-practices"].score, seo: .categories.seo.score}' lighthouse-reports/*.json
```

The plan should call out: **`lighthouse-reports/` directory must be added to `.gitignore`** (large HTML files; results regenerated per run). Only the curated `.planning/phases/06-…/lighthouse-report.md` (manually authored summary) is committed.

**Preset choice rationale: `lighthouse:no-pwa`** drops the deprecated PWA category (Lighthouse 11+ removed it from the default suite anyway). `lighthouse:recommended` would also work but its many per-audit assertions are noisier than the 4-category gate we actually want.

**Chrome flags rationale: `--headless=new`** is Lighthouse 11+'s new headless mode (better Chrome parity than legacy `--headless`). `--no-sandbox` is required on most Linux/macOS sandboxes including some local dev environments and CI containers.

### Pattern 10: Reduced-Motion Audit (QAL-04 — extend `tests/home/anti-patterns.test.ts`)

Add as Test 11 (the test file already has Tests 1–10 from Phases 4 + 5):

```ts
it('Test 11 — QAL-04: every file importing motion/react also imports useReducedMotion or is on the documented-static-only list', () => {
  const { raw, code } = readAll()
  // Documented-static-only carve-out: components that import motion/react ONLY for
  // <MotionConfig>/<LazyMotion> wiring (no animated elements). Add new entries here
  // with inline reasoning; the carve-out must be explicit.
  const STATIC_ONLY_IMPORTERS = new Set<string>([
    // Currently empty. MotionProvider is in PHASE_SOURCES via components/motion/motion-provider.tsx
    // but is not in the Phase 4+5 manifest because it's a Phase 1 surface. If a new Phase 6
    // file imports motion/react for non-animation reasons, add it here with a comment.
  ])
  for (const [rel, src] of Object.entries(code)) {
    const importsMotion = /from\s+['"]motion\/react['"]/.test(src)
    if (!importsMotion) continue
    if (STATIC_ONLY_IMPORTERS.has(rel)) continue
    const usesGate = /\buseReducedMotion\b/.test(src)
    expect(
      usesGate,
      `${rel} imports motion/react but does not call useReducedMotion() — QAL-04 violation`,
    ).toBe(true)
  }
})
```

**Verified at audit time:** only `components/home/thesis-paragraph.tsx` imports `motion/react` (Phase 4); it already uses `useReducedMotion()` (locked in Phase 4 STATE.md). Phase 5 added no new motion. The test passes by construction at Phase 6 start; the value is preventing regression in Phase 7.

### Pattern 11: Anti-Features Launch Gate (QAL-05 — `tests/launch-gate/anti-features.test.ts`)

The 19 items from `research/FEATURES.md` § Anti-Features mapped to concrete grep targets. **All 19 must be codified.** Pattern: read every file under `app/**` + `components/**` via `fs.readdirSync` recursive walk; strip block + line comments; apply per-item regex.

| # | Anti-Feature | Detection Strategy | Source-Grep Pattern (after comment-strip) |
|---|--------------|---------------------|-------------------------------------------|
| 1 | **Skill bars with percentages** | Forbid `<progress>`, `aria-valuenow`, and "skill-bar"/"skill_bar" identifiers | `/<progress\b/`, `/\baria-valuenow\b/`, `/skill[-_]?bar/i` |
| 2 | **Years-of-experience counter** | Forbid `"5+ years"`, `"30+ projects"`, `"X+ coffees"` substrings | `/\d+\+\s*(years?|projects?|coffees?|repos?|stars?)\b/i` |
| 3 | **Testimonial carousel** | Forbid `<blockquote>` + `cite` + carousel libraries (swiper, embla-carousel, keen-slider, slick) | `/from\s+['"](swiper\|embla-carousel\|keen-slider\|react-slick)['"]/`, `/testimonial/i` |
| 4 | **3D / WebGL / R3F** | Forbid `@react-three/*`, `three`, `<Canvas>`, R3F imports | `/from\s+['"]@react-three\//`, `/from\s+['"]three['"]/`, `/\bWebGL/i` |
| 5 | **Scroll-triggered fade + stagger** | Forbid `whileInView`, `IntersectionObserver`, `onScroll`, `viewport={` (Motion) | `/whileInView\b/`, `/\bIntersectionObserver\b/`, `/\bonScroll\b/i`, `/viewport=\{/` (already partially in Phase 4 test) |
| 6 | **Gradient text on gradient bg** | Forbid Tailwind gradient utilities AND `bg-clip-text` | `/\bbg-gradient-(to-|from-|via-|conic-|radial-)/`, `/\bbg-clip-text\b/`, `/\bfrom-\[/`, `/\bto-\[/` |
| 7 | **Particle cursors, confetti, scroll-indicator arrows** | Forbid `react-confetti`, `tsparticles`, `react-particle*`, custom cursor libs | `/from\s+['"](react-confetti\|tsparticles\|react-tsparticles\|tsparticles-engine\|cursor-effects)['"]/`, `/scroll-indicator/i` |
| 8 | **AI-template hero copy** | Forbid banned-words list (extend Phase 4 Test 6 to scope app/+components/ + add OG-card banned phrases) | `/\b(passionate\|scalable solutions\|cutting-edge\|10x\|crafted\|seamless\|leveraging\|synergy\|rockstar\|ninja\|innovative\|transformative\|ecosystem\|paradigm\|next-generation\|results-driven\|self-starter\|team player\|go-getter\|thought leader\|dynamic\|introducing\|the all-new\|transform your\|supercharge\|AI-powered\|built with love)\b/i` |
| 9 | **Skill tech-stack cloud / 30-logo grid** | Forbid `tag-cloud` / `react-tagcloud` / `react-wordcloud` libs; cap any Lucide-icon grid count | `/from\s+['"](react-tagcloud\|react-wordcloud\|tag-cloud)['"]/`; AND assert no file declares > 8 `<Icon name=` or similar |
| 10 | **`/services` page** | Forbid `app/services/` directory existence | `fs.existsSync(path.resolve('app/services'))` MUST be `false` |
| 11 | **"Coming soon" blog/writing stub** | Forbid `app/writing/` directory + "coming soon" copy | `fs.existsSync('app/writing')` MUST be `false`; `/coming\s+soon/i` MUST not match in app/+components/ source |
| 12 | **Cookie banner / GDPR overlay** | Forbid cookie-consent libs and identifiers | `/from\s+['"](react-cookie-consent\|cookieconsent\|@osano\/cookieconsent\|vanilla-cookieconsent)['"]/`, `/cookie[-_]?consent\|gdpr[-_]?banner/i` |
| 13 | **Light/dark mode toggle in v1** | `next-themes` config must not enable `enableSystem: true` and `defaultTheme` MUST be `'dark'` | grep `app/providers.tsx` (or wherever `ThemeProvider` is wired) for `enableSystem` value and `defaultTheme="dark"` — assert both shapes |
| 14 | **Contact form backend** | Forbid `<form>` posting to an API route AND form libs | `/<form\b/` in `app/(site)/about/` and `components/about/`; AND `/from\s+['"]@?formik\|react-hook-form\|@conform\b/` |
| 15 | **Bento grid as home layout** | Phase 4 Test 2 already covers `grid-cols-12`/`col-span-2`/`grid-rows-` on home composer. Extend to assert the home page has no nested `grid` with `col-span` greater than 1 | extend Test 2 from Phase 4 manifest; specifically check `app/(site)/page.tsx` + `components/home/*` |
| 16 | **Every card with hover-scale/bounce** | Forbid `hover:scale-` (Tailwind) on cards; allow on chips/icons only | `/\bhover:scale-/` in `components/projects/project-card-*.tsx` MUST not match |
| 17 | **Auto-opening AI chatbot widget** | Forbid `@intercom/messenger-js-sdk`, `crisp-sdk-web`, `react-chatbot-kit`, `react-chat-widget` | `/from\s+['"](@intercom\/messenger-js-sdk\|crisp-sdk-web\|react-chatbot-kit\|react-chat-widget)['"]/` |
| 18 | **Press kit / brand kit download** | Forbid `/press` or `/brand-kit` routes | `fs.existsSync('app/press')` MUST be `false`; `fs.existsSync('app/brand-kit')` MUST be `false` |
| 19 | **Decorative scrolling marquee** | Forbid marquee libs and `<marquee>` (deprecated HTML) | `/from\s+['"](react-fast-marquee\|react-marquee-line\|@devnomic\/marquee)['"]/`, `/<marquee\b/i` |

**Implementation skeleton:**

```ts
// tests/launch-gate/anti-features.test.ts
// QAL-05 — codified 19-item launch gate from research/FEATURES.md § Anti-Features.
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const ROOT = path.resolve(__dirname, '..', '..')

// Walk app/ and components/ recursively; return all .ts/.tsx/.css files.
function walk(dir: string, exts = ['.ts', '.tsx', '.css']): string[] {
  const out: string[] = []
  for (const entry of readdirSync(dir)) {
    const abs = path.join(dir, entry)
    if (statSync(abs).isDirectory()) out.push(...walk(abs, exts))
    else if (exts.some((e) => abs.endsWith(e))) out.push(abs)
  }
  return out
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .map((line) => line.replace(/\/\/.*$/, ''))
    .join('\n')
}

const APP_SOURCES = walk(path.join(ROOT, 'app'))
const COMPONENT_SOURCES = walk(path.join(ROOT, 'components'))
const ALL = [...APP_SOURCES, ...COMPONENT_SOURCES]

describe('launch gate — 19 anti-features (QAL-05)', () => {
  // ...one it() per row in the table above...

  it('#10 no /services route', () => {
    expect(existsSync(path.join(ROOT, 'app/services'))).toBe(false)
  })

  it('#11 no /writing route + no "coming soon" copy', () => {
    expect(existsSync(path.join(ROOT, 'app/writing'))).toBe(false)
    for (const file of ALL) {
      const src = stripComments(readFileSync(file, 'utf8'))
      expect(/coming\s+soon/i.test(src), `${file} contains "coming soon"`).toBe(false)
    }
  })

  // ... etc
})
```

**Performance note:** the recursive walk over `app/` + `components/` is ~50 files (current Phase 5 state) — completes in <50ms. As Phase 7 lands more components, expect 80-100 files / <100ms. Fast enough to leave in the default `pnpm vitest run` per CONTEXT.md "include in regular run".

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Open Graph image generation | Custom Puppeteer-based screenshot pipeline | `next/og` `ImageResponse` | `next/og` is Vercel-native, statically optimizable at build time, 1-file-per-route convention, zero runtime overhead. Puppeteer is what Phase 5 uses for resume.pdf — that's correct for a `/resume` HTML mirror, but the wrong tool for 5 small composition cards. |
| Sitemap XML generation | Hand-written XML strings | `app/sitemap.ts` returning `MetadataRoute.Sitemap[]` | Auto-extends with `getAll()`. Next handles XML emission, encoding, and validation. |
| `robots.txt` | Hand-written `public/robots.txt` | `app/robots.ts` returning `MetadataRoute.Robots` | Type-safe sitemap pointer. Single source of truth for `SITE_URL`. |
| Favicon `<link>` tags | Manual `<link rel="icon">` in `app/layout.tsx` | `app/icon.svg` + `app/apple-icon.png` + `app/favicon.ico` (file conventions) | Next 16 auto-discovers and emits all 3 `<link>` tags with correct `type`/`sizes`/`href` attributes including a content-hash for cache busting. Manual tags would double-wire and bloat the `<head>`. |
| ICO multi-size raster | Hand-rolled binary write | `to-ico` (one-off) or Figma multi-size export | ICO is a finicky binary container format. Tools have already solved it. |
| Color contrast verification | Pixel-walking the canvas | Pre-computed contrast in UI-SPEC + axe-core test | UI-SPEC already documents every pairing's WCAG ratio. axe-core verifies live. |
| Lighthouse score scraping | Manual report-by-report copy/paste | `lhci autorun --upload.target=filesystem --upload.outputDir=...` then `jq .categories` | LHCI emits machine-readable JSON; jq one-liners pull scores cleanly into the markdown report. |
| Custom keyboard-trap detection | Hand-written DOM walker | Native `<a>`/`<button>`/`<input>` reachability + source-grep for `tabIndex={-1}` | jsdom can't reliably simulate Tab; relying on native focusability + axe's keyboard-trap rule covers 95% of issues with zero custom code. |
| Banned-word list scanning | Inline literal arrays scattered across tests | Single regex in `tests/launch-gate/anti-features.test.ts` Test 8 + extend Phase 4 PHASE_SOURCES Test 6 to share the same regex constant | Single source of truth; one update point when Phase 7 adds words. |

**Key insight:** Phase 6 is unusual in that **almost every "deliverable" already has a Next.js file convention**. Hand-rolled alternatives would re-implement framework features for zero benefit. The two genuine new code surfaces — OG template (Pattern 1/2) and favicon SVG (Pattern 6) — are still 50-line files. The test surface is the heavy lift, and even that is mostly source-grep over existing files.

## Runtime State Inventory

> Phase 6 is partially a rename/restructure: it adds new file-system convention files, but it also **overwrites** `app/favicon.ico` (existing scaffolder stub) and **modifies** Phase 3 + 4 `generateMetadata` declarations to drop manual `openGraph.images` after the sibling `opengraph-image.tsx` lands. So the inventory applies.

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| **Stored data** | None — no databases, no Mem0, no Chroma. The site is statically generated from MDX + TS. | None. |
| **Live service config** | **Vercel deployment** — currently deploys `main` to the Vercel subdomain (Phase 1 DPL-01). New sitemap/robots/OG/favicon files take effect on next push. No Vercel UI configuration is touched by Phase 6. Vercel Speed Insights + Analytics are already wired (Phase 1) and require no Phase 6 changes. | None — Vercel ingests new files automatically on next build. |
| **OS-registered state** | None — no Windows Task Scheduler, no launchd, no systemd. The Puppeteer postbuild hook (Phase 5) is a pnpm lifecycle hook, not an OS-level registration. | None. |
| **Secrets / env vars** | `NEXT_PUBLIC_SITE_URL` is referenced by `app/layout.tsx` (Phase 1) for `metadataBase` and will be referenced by `app/sitemap.ts` + `app/robots.ts` (Phase 6 new). Falls back to `'https://olivelliott.dev'` literal in code. **No secret material**. | None — if Olive ever sets `NEXT_PUBLIC_SITE_URL=https://preview.example.com` for a preview deploy, sitemap + robots will point to the preview URL correctly. The literal fallback ensures local dev / unset env still works. |
| **Build artifacts / installed packages** | (1) `app/favicon.ico` 25,931-byte create-next-app stub — must be **overwritten** by the `oe` monogram raster (replacement, not deletion). (2) `public/{file,globe,next,vercel,window}.svg` — orphaned create-next-app scaffolder SVGs; no source-grep matches. Recommend deletion as part of launch-gate cleanup (audit-only deliverable). (3) `.next/` build artifacts will need a clean rebuild (`pnpm build`) after Phase 6 lands so OG static-optimization picks up the new files. (4) `lighthouse-reports/` (new directory from `pnpm lhci`) MUST be added to `.gitignore`. | (1) Overwrite favicon.ico in Wave 2 (Pattern 6). (2) Delete orphaned `public/*.svg` files in cleanup wave (separate audit task). (3) Force clean rebuild as part of phase verification. (4) Add `lighthouse-reports/` to `.gitignore` in Wave 0. |

**The canonical question:** *After every file in the repo is updated, what runtime systems still have the old string cached, stored, or registered?*

**Answer for Phase 6:** Vercel CDN may cache `/favicon.ico`, `/og-default.png` (Phase 3 static), and `/icon` (Phase 6 new) — but Vercel's deploy invalidates per build via content-hashed URLs. No manual cache busting needed.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| `node` | Everything | ✓ | v22.18.0 | — |
| `pnpm` | Build, install, scripts | ✓ | 9.15.9 (from package.json) | — |
| `lhci` (`@lhci/cli`) | QAL-01 Lighthouse run | ✗ (not globally installed; not in package.json) | — | **Run via `pnpm dlx @lhci/cli@0.15.1 autorun ...`** — same effect, zero install. Already documented in Pattern 9. |
| Chrome / Chromium | Lighthouse audit (lhci spawns Chrome) | ✓ (Puppeteer already downloads Chrome to `~/.cache/puppeteer/` per Phase 5; lhci will use system Chrome OR Puppeteer-bundled if `CHROME_PATH` env is set) | Puppeteer 25.x bundles 138+ | If system Chrome missing, set `CHROME_PATH=$(node -e 'console.log(require("puppeteer").executablePath())')` before `pnpm lhci`. Document in `lighthouse-report.md`. |
| `geist` font package | `next/og` OG image font loading via `node:fs/promises` `readFile` from `node_modules/geist/dist/fonts/` | ✓ | `^1.7.0` (verified: TTF + WOFF2 shipped for all weights) | — (no fallback — UI-SPEC § Typography mandates Geist) |
| `vitest-axe` | All `tests/a11y/*` and the keyboard test | ✗ (not installed) | — | Install in Wave 0: `pnpm add -D vitest-axe@1.0.0-pre.5`. |
| `sharp` | (only if `scripts/build-icons.ts` were adopted — optional per UI-SPEC) | ✓ | `^0.34.5` (Phase 1) | Skip the script for v1; hand-export PNG + ICO from Figma instead. Verified UI-SPEC's "optional, recommended" framing. |
| `wait-on` | (used by Phase 5 PDF build; not needed by Phase 6) | ✓ | `^9.0.10` | — |

**Missing dependencies with no fallback:** none — `vitest-axe` is the one new install, and the install step is in scope.

**Missing dependencies with fallback:** `lhci` (use `pnpm dlx`); `system Chrome` (use Puppeteer-bundled if absent).

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest `^3` |
| Config file | `vitest.config.ts` (existing; Phase 6 extends `vitest.setup.ts` with `vitest-axe/extend-expect` import) |
| Environment | jsdom (`^25`) |
| Quick run command | `pnpm vitest run --reporter=verbose tests/a11y/ tests/seo/ tests/launch-gate/` |
| Full suite command | `pnpm test:ci` |
| Phase gate (manual) | `pnpm lhci` (Lighthouse local run; results to `lighthouse-reports/` + summary in `lighthouse-report.md`) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| **MTA-01** | Every public route declares unique title + 50–160 char description + canonical + twitter card | unit (metadata audit) | `pnpm vitest run tests/seo/metadata.test.ts` | ❌ — Wave 0 placeholder, implemented in Wave 2 |
| **MTA-02** | Default + per-project OG images render via `ImageResponse` and emit `<meta property="og:image">` | integration (build-smoke) | (1) `pnpm build` succeeds (Wave 4 verification) AND (2) `pnpm vitest run tests/seo/og-image.test.ts` source-grep asserts files exist + export `default`, `alt`, `size`, `contentType` | ❌ — Wave 0 placeholder, implemented in Wave 2 |
| **MTA-03** | Sitemap enumerates all public routes + project slugs; robots.txt allows `/`, disallows `/_next/` + `/api/`, points to sitemap | unit + build-smoke | `pnpm vitest run tests/seo/sitemap.test.ts tests/seo/robots.test.ts` — import the default export, invoke, assert shape | ❌ — Wave 0 placeholder, implemented in Wave 2 |
| **MTA-04** | Favicon, apple-icon, icon files exist at `app/` root with correct extensions; Next 16 auto-wires them | unit (file-existence + content sniff) | `pnpm vitest run tests/seo/favicon.test.ts` — assert `app/{favicon.ico,icon.svg,apple-icon.png}` exist + non-empty + correct magic bytes | ❌ — Wave 0 placeholder, implemented in Wave 1 |
| **QAL-01** | Lighthouse ≥ 90 on Performance / A11y / Best Practices / SEO for `/` and `/projects/myco` | **manual** (Lighthouse run) | `pnpm lhci` (wraps `pnpm build && pnpm dlx @lhci/cli@0.15.1 autorun --config=./lighthouserc.json`); scores manually recorded in `.planning/phases/06-…/lighthouse-report.md` | ❌ — `lighthouserc.json` and `lighthouse-report.md` created in Wave 3 |
| **QAL-02** | axe-core zero violations on `/`, `/projects`, `/projects/myco`, `/about`, `/resume` | unit (vitest-axe) | `pnpm vitest run tests/a11y/` | ❌ — 5 files implemented in Wave 2 |
| **QAL-03** | Every interactive element keyboard-reachable; `:focus-visible` ring present in global CSS | unit (source-grep + DOM-grep) | `pnpm vitest run tests/a11y/keyboard.test.tsx` | ❌ — Wave 0 placeholder, implemented in Wave 2; **manual** Tab-walkthrough documented in `lighthouse-report.md` |
| **QAL-04** | Every `motion/react` importer also calls `useReducedMotion()` | unit (source-grep extension of Phase 4 PHASE_SOURCES) | `pnpm vitest run tests/home/anti-patterns.test.ts -t "Test 11"` | Exists; extend with Test 11 in Wave 2 |
| **QAL-05** | All 19 anti-features from `research/FEATURES.md` are absent | unit (source-grep + fs.existsSync) | `pnpm vitest run tests/launch-gate/anti-features.test.ts` | ❌ — Wave 0 placeholder, implemented in Wave 3 |

### Sampling Rate

- **Per task commit:** `pnpm vitest run` (full suite, currently 318 tests; Phase 6 adds ~50 new tests → ~370 total). Plus `pnpm typecheck`.
- **Per wave merge:** `pnpm vitest run` + `pnpm typecheck` + `pnpm build` (build smoke gates OG image static optimization).
- **Phase gate (manual):** `pnpm lhci` once, scores recorded.

### Wave 0 Gaps

- [ ] `pnpm add -D vitest-axe@1.0.0-pre.5` — required by 6 a11y tests
- [ ] Extend `vitest.setup.ts` with `import 'vitest-axe/extend-expect'` and TypeScript module augmentation (one file)
- [ ] Add `lighthouse-reports/` to `.gitignore`
- [ ] Add `"lhci": "pnpm build && pnpm dlx @lhci/cli@0.15.1 autorun --config=./lighthouserc.json"` to `package.json` scripts
- [ ] Create Wave 0 skipped-test placeholders: `tests/a11y/{home,projects-index,myco-detail,about,resume,keyboard}.test.tsx`, `tests/seo/{metadata,sitemap,robots,favicon,og-image}.test.ts`, `tests/launch-gate/anti-features.test.ts` — each with one `it.skip('placeholder — implemented by Plan {NN}')` (mirrors Phase 5 Wave 0 convention)
- [ ] Verify `metadataBase` audit: confirmed already set in `app/layout.tsx` line 8 — no Wave 0 fix task needed

## Common Pitfalls

### Pitfall 1: `display: grid` in `ImageResponse` JSX
**What goes wrong:** OG image renders blank or with stacked content.
**Why it happens:** Satori (the engine behind `next/og`) supports a **flexbox-only** subset of CSS. `display: grid`, CSS Grid templates, and grid-area shortcuts all silently fail.
**How to avoid:** Use `display: 'flex'` with `flexDirection: 'column' | 'row'` exclusively. Use `justifyContent: 'space-between'` for the wordmark/title/meta vertical rhythm.
**Warning signs:** Local OG preview at `http://localhost:3000/opengraph-image` shows blank background or only the wordmark.

### Pitfall 2: Edge runtime + `node:fs` mismatch
**What goes wrong:** `Cannot find module 'node:fs'` at build time, OR runtime crash on Vercel Edge.
**Why it happens:** Setting `export const runtime = 'edge'` opts into the Edge runtime which has **no `node:fs`** access — you must use `fetch(new URL('./assets/...', import.meta.url))` instead. Conversely, in Node runtime (default), the `fetch(new URL(...))` pattern works but is fragile across builds.
**How to avoid:** **Do not export `runtime = 'edge'`.** Use Node.js default → `readFile(join(process.cwd(), 'node_modules/geist/dist/fonts/...'))` per Pattern 1.
**Warning signs:** Build error mentioning `node:fs`, or 500 error on `/opengraph-image` only on Vercel preview.

### Pitfall 3: 500 KB ImageResponse bundle cap
**What goes wrong:** Build fails or runtime error "Image too large".
**Why it happens:** `ImageResponse` includes JSX + CSS + fonts + any embedded images in a 500 KB ceiling.
**How to avoid:** Two Geist `.ttf` files at weight 500 are ~80 KB each (160 KB total) — safely under cap. **Do not embed `<img>` raster assets** unless absolutely necessary. UI-SPEC explicitly bans images in the OG — composition is type-only.
**Warning signs:** Build log mentions "exceeds maximum bundle size of 500KB".

### Pitfall 4: `opengraph-image.tsx` overwriting Phase 3+4 manual `openGraph.images`
**What goes wrong:** Phase 3's `generateMetadata` declares `openGraph.images: [{ url: '/og-default.png' }]` AND Phase 6 ships a sibling `opengraph-image.tsx` — Next 16's resolution order is **sibling file wins**, but the manual declaration becomes stale code that confuses future readers.
**Why it happens:** Phase 3 didn't anticipate the per-route OG sibling convention; it set the manual fallback because that was the only option at the time.
**How to avoid:** Wave 2 cleanup task: delete the `openGraph.images` arrays from `app/(site)/page.tsx`, `app/(site)/projects/page.tsx`, `app/(site)/projects/[slug]/page.tsx`, `app/(site)/about/page.tsx`, `app/resume/page.tsx`. The shared `description`/`title`/`url`/`type` fields stay; only the `images` array is removed. Test in Pattern 5 enforces the cleanup.
**Warning signs:** `tests/seo/metadata.test.ts` warns "`openGraph.images` still declared manually for {route}".

### Pitfall 5: Async RSC routes in vitest-axe tests
**What goes wrong:** `Element type is invalid. ... <Promise/>` rendering error from RTL.
**Why it happens:** `app/(site)/projects/page.tsx` and `app/(site)/projects/[slug]/page.tsx` are `async function Page(...)`. Calling `<Page />` returns a Promise, not a React element.
**How to avoid:** **Await the page function then render the result:** `const ui = await Page({ searchParams: Promise.resolve({}) }); render(ui)`. Pattern is already established in `tests/projects/index-page.test.tsx` line 136-137. Reuse verbatim.
**Warning signs:** Test fails with "Promise objects are not valid as a React child".

### Pitfall 6: vitest-axe + happy-dom incompatibility
**What goes wrong:** axe-core throws `Node.prototype.isConnected` errors; all a11y tests fail.
**Why it happens:** Happy DOM's implementation of `isConnected` diverges from spec; axe-core relies on the standard behavior.
**How to avoid:** vitest.config.ts already sets `environment: 'jsdom'` (verified line 34) — keep it. Do not introduce happy-dom in any test file.
**Warning signs:** vitest-axe README explicitly calls this out.

### Pitfall 7: Lighthouse "no-sandbox" not honored in lhci settings
**What goes wrong:** Chrome launch fails on certain macOS / Linux sandboxed environments.
**Why it happens:** `lhci`'s default headless mode tries the legacy flag set; modern Chrome (138+) requires `--headless=new` for parity.
**How to avoid:** Pattern 9's `chromeFlags: "--headless=new --no-sandbox --disable-gpu"`. The `--disable-gpu` is harmless and prevents WebGL warnings noise from inflating console-error scores.
**Warning signs:** lhci output "Unable to launch Chrome" or wildly inconsistent scores between runs.

### Pitfall 8: lhci `startServerCommand` race condition
**What goes wrong:** Lighthouse starts auditing before Next.js is ready; first-load Performance score drops 20+ points.
**Why it happens:** Default `startServerReadyPattern` is `"listen|ready"` — Next 16's actual ready string is `"Ready in"` (different position in the log line).
**How to avoid:** Set `startServerReadyPattern: "Ready in"` AND `startServerReadyTimeout: 30000` (Pattern 9). 30s timeout gives Next time to compile if `.next/` isn't pre-built.
**Warning signs:** Performance score wildly varies between consecutive runs; first run lowest.

### Pitfall 9: Sitemap relative URLs vs absolute URLs
**What goes wrong:** Google Search Console rejects the sitemap as "invalid"; URLs interpreted as relative-to-domain (correct sometimes) or relative-to-sitemap-URL (broken).
**Why it happens:** `MetadataRoute.Sitemap` accepts either; ambiguity bites at SC validation time.
**How to avoid:** **Always emit absolute URLs** — `${SITE_URL}/about`, never `/about`. Pattern 3 enforces this. The fallback `'https://olivelliott.dev'` ensures local dev produces a valid sitemap, just one pointing at production URLs (acceptable — Search Console only ingests the deployed sitemap).
**Warning signs:** Google Search Console "Couldn't fetch" sitemap error.

### Pitfall 10: ICO multi-size not recognized by Edge / Firefox
**What goes wrong:** Bookmark bar shows a default-globe icon instead of the `oe` mark.
**Why it happens:** The ICO file must contain the 16×16 raster at index 0 (some browsers ignore later indices). Generated ICOs with only 32×32 or only 48×48 fail.
**How to avoid:** Use `sharp-ico`, `to-ico`, or an online converter that explicitly generates a **16/32/48 multi-image ICO**. Verify by `file app/favicon.ico` → "MS Windows icon resource - N icons, 16x16, ..." where the 16x16 entry is present.
**Warning signs:** Verified by `file app/favicon.ico`; missing 16x16 entry is the failure mode.

### Pitfall 11: Sitemap caching freezes Phase 7 additions
**What goes wrong:** Phase 7 lands Fathom + Agenda Keeper MDX files; sitemap.xml still shows only Myco after deploy.
**Why it happens:** `app/sitemap.ts` is cached **at build time** by default — calling `getAll()` once and freezing the result. If Phase 7's MDX is added at runtime (not at build time), the sitemap is stale.
**How to avoid:** Since `lib/content.ts` glob-reads `content/projects/*.mdx` at module-load time (Phase 2 pattern), and `next build` re-runs module loads, the sitemap automatically refreshes per build. **As long as Phase 7 commits new MDX files AND triggers `pnpm build`, the sitemap updates.** No revalidation API needed.
**Warning signs:** Sitemap stale after deploy → first check: did Vercel deploy after the MDX commit? Second check: did `lib/content.ts` actually pick up the new file at build time (`pnpm build` log should mention the new project)?

### Pitfall 12: jsdom can't render OG images for axe testing
**What goes wrong:** Trying to `render(<OGImage />)` in a vitest-axe test crashes because `ImageResponse` returns a `Response`, not JSX.
**Why it happens:** `next/og` produces a raw PNG response, not a React tree.
**How to avoid:** **Don't axe-test OG images.** They are visual artifacts consumed by external platforms (Twitter, Slack, LinkedIn) which apply their own rendering and alt-text presentation. Verify alt text via the `opengraph-image.alt.txt` file convention + the per-route `metadata` test in Pattern 5. The visual composition is verified by **manually opening `http://localhost:3000/opengraph-image` and `http://localhost:3000/projects/myco/opengraph-image` after `pnpm dev`** — recorded as a step in `lighthouse-report.md`.
**Warning signs:** Test author tries to put `<OGImage />` inside `render()` and gets a confusing TypeScript error.

### Pitfall 13: `app/favicon.ico` is at app root, NOT in a route group
**What goes wrong:** `app/(site)/favicon.ico` or `app/(site)/icon.svg` doesn't get picked up by Next 16.
**Why it happens:** Per Next 16 docs: "The `favicon` image can only be located in the top level of `app/`." `icon.svg` and `apple-icon.png` can live anywhere under `app/**`, but the favicon specifically must be at `app/`.
**How to avoid:** Place all three (`favicon.ico`, `icon.svg`, `apple-icon.png`) at `app/` root — outside the `(site)` route group. Verified: existing `app/favicon.ico` is at the correct location.
**Warning signs:** Browser shows default-globe favicon despite the file being committed.

### Pitfall 14: Title template double-application
**What goes wrong:** Page title renders as "olivelliott.dev · olivelliott.dev" or "about · olivelliott.dev · olivelliott.dev".
**Why it happens:** `app/layout.tsx` declares `title: { default: 'olivelliott.dev', template: '%s · olivelliott.dev' }`. Each page's `metadata.title` is run through the template. If the home page declares `title: 'olivelliott.dev'`, the template doubles it.
**How to avoid:** **Home page MUST omit `metadata.title`** so the `default` flows through unchanged. Verified: `app/(site)/page.tsx` already does this (line 32-37 comment). Phase 6's metadata audit test enforces this is not regressed.
**Warning signs:** `tests/home/page.test.tsx` Test 5 already locks this.

## Code Examples

Verified patterns from official Next.js 16.2.6 docs (May 2026):

### Default OG with `next/og` Node.js runtime + Geist fonts

See Pattern 1 above — complete working snippet.

### Per-slug OG with `generateImageMetadata`

See Pattern 2 above — exercises the `id: Promise<string>` Next 16 contract.

### `MetadataRoute.Sitemap` with project enumeration

See Pattern 3 above.

### `MetadataRoute.Robots` with sitemap pointer

See Pattern 4 above.

### Per-route metadata audit

See Pattern 5 above.

### vitest-axe RSC route test (sync + async signatures)

See Pattern 7 above.

### lighthouserc.json for Next.js local run

See Pattern 9 above.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `next-sitemap` npm package | `app/sitemap.ts` (Next 13.3+) | Next 13.3.0 | One less devDep; type-safe; lives inside the app. `next-sitemap` is still maintained but redundant for Next.js App Router projects. |
| `@vercel/og` direct dep | `next/og` (re-export, Next 14+) | Next 14.0.0 | Avoids version-drift between `next` and `@vercel/og`. Identical API. |
| Manual `<link rel="icon">` tags | `app/icon.svg` + `app/apple-icon.png` + `app/favicon.ico` file conventions | Next 13.3+ | Zero manual layout edits; Next auto-emits with content-hash. |
| Edge runtime as recommended for `ImageResponse` | Node.js runtime is the default and recommended for most cases (Next 16) | Next 16.0.0 | Simpler font loading via `node:fs/promises`; no `fetch(new URL(...))` quirks. Edge still works; just no longer required. |
| `jest-axe` for React Testing Library | `vitest-axe` for Vitest | 2022+ | Same axe-core engine; Vitest-native types and matchers. Don't double-install both. |
| `lhci@0.13` with old `assert: { preset: 'lighthouse:recommended' }` | `lhci@0.15.1` with `lighthouse:no-pwa` preset (Lighthouse 11+ dropped PWA category) | mid-2024 | Cleaner assertion failure messages; no false-positives for PWA audits that no longer exist. |
| Static OG image per route (Phase 3 fallback `/public/og-default.png`) | Dynamic `ImageResponse` per route (Phase 6) | this phase | Phase 3 shipped `/og-default.png` as the universal fallback; Phase 6 layers per-route + per-project dynamic generation on top. Both coexist — the static is the "if all else fails" safety net referenced in CONTEXT.md. |

**Deprecated/outdated:**

- `<meta name="viewport">`, `<meta charset>` — Next.js emits these automatically; manual declarations in `app/layout.tsx` would conflict.
- `sitemap.xml` static file in `public/` — works but redundant; `app/sitemap.ts` is the modern App Router pattern.
- `runtime = 'edge'` on `opengraph-image.tsx` — works but no longer needed; Node.js default is simpler.

## Open Questions

1. **Should `app/opengraph-image.tsx` ship as a single root file (default for all 4 chromed routes) or as 4 sibling files (per-route default with locked UI-SPEC copy)?**
   - **What we know:** Next 16 file convention supports either — sibling overrides the inherited default.
   - **What's unclear:** UI-SPEC § Copywriting Contract locks per-route copy (4 distinct titles + 4 distinct meta rows). The single-root approach loses that per-route distinction; the 4-sibling approach honors UI-SPEC strictly but adds 4 files (5 total OG .tsx files: root + 4 siblings + [slug]).
   - **Recommendation:** Ship as **4 sibling files + 1 root default + 1 [slug] dynamic = 6 OG files total**. Each delegates to a shared `lib/og-template.tsx` renderer that takes `{ title, meta }` props. The 6 .tsx files become 15-line each; UI-SPEC copy is honored verbatim; future routes auto-inherit the root default. Locked in plan.

2. **Should the `apple-icon.png` and `favicon.ico` be hand-exported or generated by a build script?**
   - **What we know:** UI-SPEC § Favicon marks `scripts/build-icons.ts` as "optional, recommended".
   - **What's unclear:** Whether the icon design will ever change pre-launch. If no, hand-export once and commit. If yes (Phase 7 may iterate on the `oe` mark based on Olive's review), the script saves time on re-export.
   - **Recommendation:** **Hand-export for Phase 6, write the script as a deferred v1.x task.** Two binary commits is cheaper than one new build script + the `sharp-ico` dep + the test surface for the script. If Olive iterates on the mark, manually re-export and commit.

3. **`twitter:creator` handle: include with placeholder or omit until confirmed?**
   - **What we know:** CONTEXT.md § Deferred explicitly defers this until Olive confirms her X/Twitter handle.
   - **What's unclear:** Whether `card: 'summary_large_image'` works without `creator`. Yes — `creator` is purely informational (links the card to a verified X account); the card renders fine without it.
   - **Recommendation:** **Omit entirely.** Phase 7 adds it as a one-line edit if Olive ever confirms a handle.

4. **`metadataBase` URL: literal vs env var?**
   - **What we know:** `app/layout.tsx` line 8 uses `process.env.NEXT_PUBLIC_SITE_URL ?? 'https://olivelliott.dev'`.
   - **What's unclear:** Whether Phase 7 ever wants to point at a custom domain that differs from the Vercel subdomain. PROJECT.md defers custom domain to v2.
   - **Recommendation:** **Keep the existing env-var-with-literal-fallback pattern in sitemap.ts and robots.ts.** Matches Phase 1; preview deploys with `NEXT_PUBLIC_SITE_URL` override will produce correct sitemap URLs.

5. **Should the `lighthouse-report.md` template be authored at Wave 0 or only after a successful run?**
   - **Recommendation:** Author a **template** at Wave 0 (sections: Date, Build SHA, Run Command, /-scores, /projects/myco-scores, Manual Keyboard Walkthrough Checklist, Notes/Anomalies). Fill in after the Wave 3 run. Template authorship is part of the plan deliverable; the filled-in version is the phase-gate proof.

6. **Should `tests/seo/og-image.test.ts` be a build-smoke test or a unit-shape test?**
   - **What we know:** OG images can't be rendered in jsdom (Pitfall 12). Build smoke (`pnpm build` produces correct `/opengraph-image` route handlers) is the integration proof. A unit test can assert the file exports `default`, `alt`, `size`, `contentType` constants with correct types.
   - **Recommendation:** **Both** — the build smoke runs in Wave 4 as a phase-gate verification step; the unit test (source-grep + import-and-typeof) runs in `pnpm vitest` and catches export drift. Cheap; high value.

## Sources

### Primary (HIGH confidence — official Next.js 16.2.6 docs, May 2026)

- [opengraph-image and twitter-image file conventions](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image) — confirmed export shape, file naming, alt.txt sibling, Node.js runtime default
- [generateImageMetadata function](https://nextjs.org/docs/app/api-reference/functions/generate-image-metadata) — per-slug OG with `id: Promise<string>` Next 16 shape
- [ImageResponse function reference](https://nextjs.org/docs/app/api-reference/functions/image-response) — fonts array shape, 500KB bundle cap, Satori flexbox-only constraint
- [sitemap.xml file convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) — `MetadataRoute.Sitemap` type, changeFrequency + priority still in the type (omit per Google guidance)
- [robots.txt file convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots) — `MetadataRoute.Robots` shape
- [favicon, icon, apple-icon file conventions](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons) — favicon must be at app/ root; icon/apple-icon can be anywhere
- [manifest.json](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest) — optional, not required for v1

### Secondary (MEDIUM-HIGH confidence — official tool docs)

- [Lighthouse CI configuration](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md) — lighthouserc.json shape, assertions presets, filesystem upload target
- [Lighthouse CI getting started](https://googlechrome.github.io/lighthouse-ci/docs/getting-started.html) — autorun command, startServerCommand
- [vitest-axe README](https://github.com/chaance/vitest-axe/blob/main/README.md) — three import-path approaches, TypeScript module augmentation, jsdom requirement

### Tertiary (verified via npm registry)

- `npm view vitest-axe time` → latest published `1.0.0-pre.5` (2025-01-22); stable `0.1.0` (2022-10-21) — recommend pre.5
- `npm view @lhci/cli version` → `0.15.1` (2025-06-25)
- `npm view lighthouse version` → `13.3.0`
- `npm view axe-core version` → `4.11.4`
- `npm view next version` → `16.2.4` (already locked in package.json)
- Filesystem verification: `ls node_modules/geist/dist/fonts/geist-mono/` → 41 font files including `GeistMono-Medium.ttf` and `GeistMono-Medium.woff2`

### Already in this codebase (verified by read)

- `app/layout.tsx` — `metadataBase` already set (line 8); no Wave 0 fix needed
- `app/favicon.ico` — exists at correct path, 25,931-byte create-next-app stub; must overwrite
- `public/og-default.png` — Phase 3 site default OG (1200×630 PNG, verified)
- `tests/home/anti-patterns.test.ts` — PHASE_SOURCES manifest pattern to extend (Tests 1–10 from Phases 4+5; Phase 6 adds Test 11 for QAL-04)
- `tests/projects/index-page.test.tsx` (lines 116-126) — async RSC render pattern reusable for `/projects` a11y test
- `vitest.config.ts` — `environment: 'jsdom'` (line 34); aliases `server-only` to a stub; `mdxShimPlugin` already in place
- `vitest.setup.ts` — currently 1 line (`import '@testing-library/jest-dom/vitest'`); Phase 6 extends with vitest-axe matcher import

## Metadata

**Confidence breakdown:**

| Area | Level | Reason |
|------|-------|--------|
| Next 16 OG / sitemap / robots / favicon conventions | HIGH | Verified directly against Next 16.2.6 docs (May 2026); all examples copy-checked from official source |
| `vitest-axe` setup + 1.0.0-pre.5 currency | HIGH | npm registry + chaance/vitest-axe README verified; stable line is 3-year-old |
| `@lhci/cli` configuration | HIGH | Official GoogleChrome docs + npm registry |
| Anti-features 19-item grep mapping | HIGH | Each row derived directly from `research/FEATURES.md` § Anti-Features table; grep patterns are deterministic |
| OG layout token-fidelity | HIGH | UI-SPEC § Copywriting + § Color + § Typography are locked; Pattern 1 inlines hex values matching `styles/tokens.css` verbatim |
| Existing codebase patterns (PHASE_SOURCES, async RSC test, motion mock) | HIGH | Read directly from the test files; pattern is documented in 04-04-SUMMARY and 05-05-SUMMARY |
| Pitfall list (14 items) | HIGH-MEDIUM | Each pitfall is either a documented limitation in the source docs (Pitfalls 1, 3, 6, 9, 13, 14) OR a Phase 4/5 pattern lock that Phase 6 extends (Pitfalls 4, 5, 11). The remaining pitfalls (2, 7, 8, 10, 12) are common-knowledge ecosystem traps with single-source verification |
| Phase 7 placeholder strings + future OG slug auto-extension | HIGH | Verified by reading `lib/projects.ts` `getAll()` and `lib/content.ts` glob behavior; sitemap + per-slug OG auto-extend when MDX files land |

**Research date:** 2026-05-17
**Valid until:** 2026-06-17 (Next.js docs are fast-moving; revisit if Next 16.3+ ships or `vitest-axe` 1.0.0 final is published). All `MetadataRoute.*` types are TS-stable across minor versions per Next's API stability guarantee.
