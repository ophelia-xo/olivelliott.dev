# Phase 6: SEO, OG, A11y & Performance Audit - Context

**Gathered:** 2026-05-17
**Status:** Ready for planning
**Mode:** Smart discuss (autonomous)

<domain>
## Phase Boundary

The launch gate. Six discrete deliverables:
1. Dynamic OG image generation via `next/og` `ImageResponse` (per-route, auto-extending).
2. Sitemap + robots via App Router conventions (`app/sitemap.ts`, `app/robots.ts`).
3. Favicon set (SVG + apple-touch + ICO) generated via Next.js icon conventions.
4. Comprehensive a11y test surface (`tests/a11y/*` using `vitest-axe`) plus keyboard-nav assertions.
5. Consolidated anti-features launch-gate test (`tests/launch-gate/anti-features.test.ts`) sweeping all 19 items from `research/FEATURES.md`.
6. Per-route metadata audit + Lighthouse local run (manual `pnpm lhci`) with documented scores.

Not in scope: real content for non-Myco projects (Phase 7), launch deployment to Vercel (Phase 7), continuous Lighthouse monitoring (defer to v2), pre-emptive performance optimizations (only fix if Lighthouse < 90 on any axis triggers a one-cycle gap closure).

</domain>

<decisions>
## Implementation Decisions

### Dynamic OG Images (MTA-02)
- **Per-route generation:** Use `next/og`'s `ImageResponse` via App Router's `opengraph-image.tsx` convention. One default at `app/opengraph-image.tsx` (or root), and per-project ones under `app/(site)/projects/[slug]/opengraph-image.tsx` using `generateImageMetadata`. Phase 7 projects auto-inherit OG images without manual wiring.
- **Visual design:** Dark `#0a0a0a` background, GeistMono lowercase wordmark `olivelliott.dev` top-left, page title H1 (project title or page name) at display scale center-left, year + tags row bottom-left in `--color-text-tertiary`. 1200×630, simple typographic composition. No images, no decorations. Matches the editorial register of the site.
- **Font loading:** Fetch Geist font files via Edge-runtime `fetch` from the `geist` package paths (or `geist/font/sans` if exposed). Avoid system fallback (looks generic) and Google Fonts CDN (slower, external dep).
- **Fallback chain:** per-route OG (`opengraph-image.tsx` → auto-wired to `openGraph.images` for that route) → site default OG (`/public/og-default.png` shipped Phase 3). Per-page `generateMetadata` doesn't need to manually set `openGraph.images` for routes that have a sibling `opengraph-image.tsx` — Next handles wiring.

### Sitemap, Robots, Favicons (MTA-03, MTA-04)
- **Sitemap:** `app/sitemap.ts` exports default async function returning `MetadataRoute.Sitemap`. Enumerates `/`, `/about`, `/projects`, `/resume`, plus each `/projects/${slug}` from `getAll()`. `lastModified` derived from each project's `year` field (constructed as `new Date(year, 11, 31)`). `priority` and `changeFreq` omitted per current Google guidance (deprecated signals). Auto-extends as Phase 7 lands more projects.
- **Robots.txt:** `app/robots.ts` exports default function returning `MetadataRoute.Robots`. Allow all crawlers for `/`. Disallow `/_next/`, `/api/`. Sitemap pointer to `${BASE_URL}/sitemap.xml`. NO `noindex` on `/resume` (HTML serves same content as PDF; both are public-facing assets).
- **Favicon set:** Generate from a single design source:
  - `app/icon.svg` — primary favicon (modern browsers); typographic `oe` monogram, GeistMono lowercase, `--color-accent` (`#fbbf24`) on `--color-bg` (`#0a0a0a`).
  - `app/apple-icon.png` — 180×180 raster derived from same design (Next.js auto-wires).
  - `app/favicon.ico` — multi-size legacy fallback (16/32/48 raster from SVG).
  - Next.js File-system Conventions auto-wire all three.
- **`metadataBase` + canonical:** Phase 1 should have set `metadataBase: new URL('https://olivelliott.dev')` in root layout — Phase 6 audits and fixes if missing. Every page's `generateMetadata` sets `alternates.canonical = pathname`. Phase 3 + 4 already follow this; Phase 6 audits for misses.

### A11y Verification (QAL-02, QAL-03, QAL-04)
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

### Performance Budget & Anti-Features Audit (QAL-01, QAL-05)
- **Lighthouse target (QAL-01):** Install `@lhci/cli` as devDep. Run `pnpm lhci` against `pnpm build && pnpm start` locally for `/` and `/projects/myco`. Document scores in `.planning/phases/06-seo,-og,-a11y-&-performance-audit/lighthouse-report.md`. Target ≥ 90 across Performance / Accessibility / Best Practices / SEO. If any axis < 90 → gap-closure task (one cycle).
- **Anti-features sweep (QAL-05):** Author `tests/launch-gate/anti-features.test.ts` — comprehensive source-grep + DOM-grep assertions for all 19 items from `research/FEATURES.md`:
  - No skill bars, no gradient-on-gradient, no stagger-on-scroll, no bento home, no glassmorphism, no Lottie, no R3F, no Aceternity-style hero treatments, no cookie banner, no newsletter signup, no AI-template hero, etc.
  - Extends the Phase 4 `tests/home/anti-patterns.test.ts` net into a comprehensive launch-time gate.
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

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `app/(site)/layout.tsx` — already has `metadataBase` per Phase 1 SUMMARY; Phase 6 verifies.
- `lib/projects.ts` — `getAll()` for sitemap; `getProject(slug)` for OG image generation.
- `lib/schemas.ts` — `Project` type with `title`, `tagline`, `year`, `tags` — all OG image data sources.
- `lib/hero-fallback.ts` — `isPlaceholderHero` for OG image precedence (already used by Phase 3 metadata).
- `public/og-default.png` — site default OG shipped Phase 3 Wave 0 (1200×630).
- `tests/home/anti-patterns.test.ts` (Phase 4 + extended Phase 5) — PHASE_SOURCES manifest; Phase 6 extends to cover all public routes' source files and adds new launch-gate assertions.
- `styles/tokens.css` — `--color-bg`, `--color-accent`, `--color-text-primary/secondary/tertiary` — used in OG image and favicon designs.
- `geist` package — already installed Phase 1 for Geist Sans/Mono; same source for OG image font fetch.

### Established Patterns
- RSC-first; no `'use client'` in Phase 6 (all auditing is build-time or test-time).
- Strict TypeScript; Zod schemas authoritative.
- Tests next to source under `tests/`; Phase 6 adds `tests/a11y/`, `tests/launch-gate/`, `tests/seo/`.
- Design tokens drive everything; OG image and favicon use the same tokens as the live site.
- Phase 4 + 5 established the `PHASE_SOURCES` extension pattern for anti-pattern source-greps.

### Integration Points
- **Consumed by Phase 7:** Sitemap auto-extends as Phase 7 lands real MDX for Fathom, Agenda Keeper, etc. — no Phase 6 changes needed.
- **Consumed by deploy:** The full launch-gate test suite is what verifies "ready to ship" before Phase 7's Vercel push.

</code_context>

<specifics>
## Specific Ideas

- Editorial OG design: it's the first impression on Twitter/LinkedIn/Slack — must convey "engineer with taste" not "designer-template generator".
- The 19-item anti-features list from `research/FEATURES.md` is the launch-gate truth. Codify it as a test, not a checklist someone has to remember.
- `next/og` is the right tool — it's Vercel-native, Edge-runtime, zero external dependencies.
- Favicon `oe` monogram is intentional: minimal, ownable, matches the mono wordmark on the site.
- Lighthouse run is local-only for v1 — Vercel Speed Insights (already wired Phase 1) covers production drift monitoring without GitHub Actions overhead.

</specifics>

<deferred>
## Deferred Ideas

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

</deferred>
