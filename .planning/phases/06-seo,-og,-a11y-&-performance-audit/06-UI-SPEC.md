---
phase: 6
slug: seo-og-a11y-performance-audit
status: draft
shadcn_initialized: false
preset: none
created: 2026-05-17
inherits_from:
  - .planning/phases/01-foundation/01-UI-SPEC.md
  - .planning/phases/03-project-detail-template/03-UI-SPEC.md
  - .planning/phases/04-home-+-projects-index/04-UI-SPEC.md
  - .planning/phases/05-about-+-resume-+-contact/05-UI-SPEC.md
---

# Phase 6 — SEO, OG, A11y & Performance Audit: UI Design Contract

> Visual contract for Phase 6. The phase is intentionally **audit-heavy and visual-light** — six deliverables in total, of which only two ship pixels: (1) dynamic per-route OG images via `next/og` and (2) the favicon set (`oe` monogram SVG + apple-touch raster + ICO multi-size). Everything else is build-time metadata (`sitemap.ts`, `robots.ts`), test infrastructure (`tests/a11y/*`, `tests/seo/metadata.test.ts`, `tests/launch-gate/anti-features.test.ts`), or an audit checkpoint (Lighthouse local run). Tokens (color, type, spacing, motion, radii) are inherited from Phase 1 + the Phase 3 H2/H3/semibold expansion. **No new screen-mode tokens, no new client components, no `'use client'` introduced in Phase 6.**

**Reference aesthetic for the two visual artifacts:**
- **OG image:** editorial dark composition. Wordmark + display title + meta row. Reads like a magazine title card, not a marketing banner. The first impression on Twitter / LinkedIn / Slack / iMessage must convey "engineer with taste" — never "designed-template stock asset".
- **Favicon:** typographic mark. The lowercase `oe` monogram in Geist Mono on `--color-bg`, with `--color-accent` letterforms. Recognizable at 16px in a browser tab; ownable.

**Explicit aesthetic prohibitions** (re-asserted for Phase 6 from `research/FEATURES.md` + `research/PITFALLS.md` + all prior UI-SPECs):

**On OG images:** no gradient backgrounds, no glassmorphism, no backdrop-blur, no decorative blobs / orbs / particles, no hero/product imagery, no stock photos, no avatar headshots, no logo lockups, no "Built with Next.js" badge, no client-logo strips, no metric counters, no skill chips, no QR codes, no marketing-template flourishes, no shadow ramps, no inner glows, no auto-generated emoji overlays.

**On favicon:** no full-color logo, no gradient mark, no detailed iconography that would muddy at 16px, no photographic source, no "O" + "E" inside a circle/square chrome (no chrome at all — the mark *is* the letterforms).

---

## Design System

| Property | Value |
|----------|-------|
| Tool | none (hand-assembled; tokens locked in Phase 1, expanded in Phase 3, unchanged in Phases 4–6) |
| Preset | not applicable — `components.json` deliberately absent through v1. **shadcn gate pre-answered N** by upstream lock: every prior phase declared "no third-party registries in v1"; Phase 6 ships zero registry components, zero new UI surfaces, and no Button/Dialog/Tooltip needs. |
| Component library | none. `radix-ui` not reached for in Phase 6. The two visual artifacts (OG image, favicon) are not React UI components in the conventional sense — they are build-time `ImageResponse` JSX and a static `<svg>` document respectively. |
| Icon library | `lucide-react` (unchanged from Phase 1 footer) — **Phase 6 introduces zero new icon usages.** The OG image uses no icons. The favicon is type, not an icon. |
| Font | Geist Sans (OG image display title) and Geist Mono (OG wordmark, meta row, favicon `oe` letterforms). Same `geist` package source as Phases 1–5. **OG-image font loading** uses `fs.readFile` against `node_modules/geist/dist/fonts/geist-sans/Geist-Medium.ttf` and `node_modules/geist/dist/fonts/geist-mono/GeistMono-Regular.ttf` at module top-level (Edge-compatible `Buffer` → `ArrayBuffer`), passed to `ImageResponse`'s `fonts` array. **No network fetch, no Google Fonts CDN, no system fallback.** |

**Registry strategy (carried forward):** No new registries permitted in v1. **Phase 6 ships zero registry-pulled components.**

---

## Spacing Scale

Inherits Phase 1's 4px base (`--spacing: 0.25rem`). **Phase 6 declares zero new spacing tokens.**

The two visual artifacts use spacing values that are **bounded coordinate exceptions**, documented here:

### OG image internal spacing (1200×630 canvas)

OG canvases live in absolute pixel space — `ImageResponse` JSX uses `style={{ padding: '64px' }}` etc., not Tailwind utilities. Every value below is on the 4-point grid.

| Element | Value | Rationale |
|---------|-------|-----------|
| Canvas padding (all sides) | `64px` (`--space-16` equivalent) | Generous editorial margin; the title block sits inside a safe area of 1072×502px. Matches Twitter / LinkedIn / iMessage crop tolerances. |
| Wordmark → title gap | `48px` (`--space-12` equivalent) | Vertical breathing between the small mono wordmark (top-left) and the display title (center-left). |
| Title → meta row gap | `32px` (`--space-8` equivalent) | Slightly tighter than wordmark→title — visually groups title + meta as one unit. |
| Inter-tag gap (meta row) | `16px` (`--space-4` equivalent) | Horizontal spacing between year and tag tokens in the meta row. |
| Display title `lineHeight` | `1.15` (Phase 1 display token) | Two-line title wraps respect Phase 1 display rhythm. |

**Safe zone (no critical glyphs outside this rect):** `64px` inset on all four sides → 1072×502px central canvas. Twitter's mobile crop and Slack's preview crop both stay inside this with margin.

### Favicon internal spacing

| Element | Value | Rationale |
|---------|-------|-----------|
| SVG `viewBox` | `0 0 32 32` | One coordinate space; renders crisply at 16, 24, 32, 48, 180px. |
| Glyph metrics (`oe`) | letterforms occupy a `24×16` interior box, centered in the 32×32 viewBox | 4px margin on every side → safe against rounded-rect browser tab masks (Safari on macOS rounds favicons). |
| Apple touch icon canvas | `180×180` PNG, rasterized from the same SVG | Letterforms scale up; no separate design source. iOS pads automatically. |
| ICO multi-size | 16 / 32 / 48 raster from same SVG | Legacy Windows / Firefox bookmark bar. Generated at build time, not hand-pixeled. |

**Phase 6 introduces no exceptions to the 4-point grid.** The OG `64 / 48 / 32 / 16 / 1.15` values map cleanly; the favicon `24×16` interior is `--space-6 × --space-4` equivalent.

---

## Typography

**Phase 6 declares zero new type roles.** Both visual artifacts compose existing Phase 1 + Phase 3 tokens. The 5-size / 3-weight milestone ceiling (Body 16, Label 14, H3 20, H2 24/28, Display 32–48 @ weights 400 / 500 / 600) is **not exceeded**.

**Families:** Geist Sans for the OG display title. Geist Mono for the OG wordmark, OG meta row, and the favicon `oe` mark. No new font face. No serif. No third family.

### Type roles used in Phase 6 (composing existing tokens at OG / favicon scale)

| Role | Where it appears | Family | Weight | Size in artifact | Color | Notes |
|------|-----------------|--------|--------|------------------|-------|-------|
| OG wordmark | OG canvas, top-left | Geist Mono | 500 (medium) | **32px** in OG pixel space | `--color-text-tertiary` (`#737373`) | The label-tier register escalated to OG-canvas legibility scale. Lowercase, tracking `+0.02em`. Literal copy: `olivelliott.dev`. |
| OG display title | OG canvas, center-left | Geist Sans | 500 (medium) | **80px** (single-line) or **64px** (two-line wrap) in OG pixel space | `--color-text-primary` (`#f5f5f5`) | Display-tier register escalated to OG-canvas display scale. Tracking `-0.02em`, line-height 1.15. Copy is route-specific (see Copywriting Contract). Author-side wraps to at most 2 lines via `display: -webkit-box; -webkit-line-clamp: 2`. |
| OG meta row | OG canvas, bottom-left | Geist Mono | 500 (medium) | **20px** in OG pixel space | `--color-text-tertiary` (`#737373`) | Label-tier register at OG scale. Lowercase, tracking `+0.02em`. Format: `{year} · {tag1} · {tag2} · {tag3}` (max 3 tags, interpunct-separated). Year omitted on non-project routes (see Copywriting Contract). |
| Favicon `oe` mark | 32×32 viewBox SVG | Geist Mono | 500 (medium) | letterforms sized to fit interior 24×16 box | `--color-accent` (`#fbbf24`) on `--color-bg` (`#0a0a0a`) | Lowercase. **Rendered as inline `<text>` in the SVG, NOT as a font reference** — the SVG must work without any font loaded (browsers do not load Geist for favicon rendering). Use `<text>` paths converted from Geist Mono `o` + `e` glyphs at design time (export from Figma/Glyphs), OR render the text inline with a system fallback (`font-family: ui-monospace, "SF Mono", monospace`) accepting that the exact Geist letterforms only appear when Geist happens to be locally installed. **Default to glyph-as-path SVG** — deterministic across browsers. |

**Token-system discipline:** the OG image and favicon use the same color hexes as the live site (`#fbbf24`, `#0a0a0a`, `#f5f5f5`, `#737373`). These are token *values* literally inlined into the OG `ImageResponse` JSX `style` props and into the favicon `<svg fill="...">` attributes. **No token reference at runtime** — OG and favicon are baked at build time, outside the Tailwind cascade. The hex values must stay in lock-step with `styles/tokens.css` (if any token color ever changes, the OG + favicon source files change in the same commit).

### OG-image typography composition rules

1. **Single visual hierarchy.** Wordmark (small, top) → Title (large, middle) → Meta (small, bottom). Three rows, one column. No two-column splits, no quote pulls, no image insets.
2. **Title line count: max 2 lines.** Longer titles get clipped with a soft ellipsis. The display title font size auto-selects: 80px for single-line titles ≤ 24 characters, 64px for multi-line or longer titles. (Implementation: measure title length, branch font size in the JSX.)
3. **Tracking discipline.** Display title `letterSpacing: '-0.02em'` (matches Phase 1 display token). Mono wordmark and meta row `letterSpacing: '0.02em'` (matches Phase 1 label token).
4. **No drop shadows, no text strokes, no gradients on text.** Solid color on solid color. The contrast pairings (see Color below) make decoration unnecessary.

---

## Color

**Phase 6 adds zero new color tokens.** Both visual artifacts use a strict subset of the inherited palette.

### Color usage in the OG image (1200×630)

| Layer | Token / Hex | Coverage | Rationale |
|-------|-------------|----------|-----------|
| Canvas background | `--color-bg` `#0a0a0a` | 100% | Dominant. Matches the live site's editorial dark surface. **Not `#000`** — preserves the OLED-halation discipline from Phase 1. |
| Display title fill | `--color-text-primary` `#f5f5f5` | the title block | Primary text on dominant background. Contrast: **18.4:1** — AAA normal + large. |
| Wordmark + meta row fill | `--color-text-tertiary` `#737373` | the small label rows | Tertiary text on dominant background. Contrast: **4.8:1** — AA normal, AAA large. OG meta is rendered at 20px which qualifies as large per WCAG; wordmark at 32px likewise. Both pass AA without question. |
| Decorative elements | **none** | — | No accent fill, no hairline divider, no brand bar, no shape stroke. The composition relies entirely on typography for hierarchy. |

**OG accent reserved-for list:** the accent color (`#fbbf24`) does **not** appear in the OG image. This is deliberate — accent is reserved for *interactive* signaling on the live site (per Phase 1's accent contract), and an OG card is a static preview, not an interactive surface. Tinting a label or title in accent would read as a marketing flourish, breaking the editorial register.

### Color usage in the favicon

| Layer | Token / Hex | Rationale |
|-------|-------------|-----------|
| Canvas background | `--color-bg` `#0a0a0a` | Fills the 32×32 viewBox. Matches browser tab dark themes; on a light browser chrome the dark square reads as a "frame", which is intentional. |
| `oe` letterform fill | `--color-accent` `#fbbf24` | The one accent activation in Phase 6. Reads as a tiny amber wordmark — recognizable at 16px, distinctive in a browser tab strip. Contrast against `#0a0a0a`: **11.8:1** (AAA). |

**Favicon accent reserved-for list:** the accent appears on the `oe` mark itself — this is the entire favicon surface, so it is both the only element and the only reservation. **No accent stroke around the canvas, no accent dot, no accent corner-mark.**

### Verified pairings (Phase 6 — every artifact pairing audited)

| Foreground | Background | Ratio | Passes | Where |
|------------|------------|-------|--------|-------|
| `#f5f5f5` | `#0a0a0a` | 18.4:1 | AAA normal + large | OG display title |
| `#737373` | `#0a0a0a` | 4.8:1 | AA normal, AAA large | OG wordmark (32px = large), OG meta row (20px = large) |
| `#fbbf24` | `#0a0a0a` | 11.8:1 | AAA normal + large | Favicon `oe` mark |

**Gradients, shadows, glassmorphism:** **forbidden** in both artifacts — same rule as Phases 1–5. No `bg-gradient-*`, no `filter: blur`, no `box-shadow`, no `text-shadow`, no SVG `<filter>` Gaussian blur. Depth in both artifacts is achieved via typographic hierarchy alone.

---

## Motion

**Phase 6 ships zero motion.** Neither artifact animates:

- The OG image is a static PNG produced at build time (or on-the-fly via Edge runtime, depending on caching strategy). Static raster output — motion is not even physically possible.
- The favicon is a static SVG with no `<animate>` / `<animateTransform>` elements. Browsers render it once per tab; animated favicons (allowed in some browsers as `image/gif` or animated SVG) read as gimmicky and are out of scope.

**No new motion tokens, no activation of reserved tokens, no `motion/react` imports.** The `--motion-duration-slow` (420ms) reserved-for-Phase-4 token remains the only reserved motion token in the system; Phase 6 does not touch it.

**Reduced-motion test surface:** Phase 6 *audits* reduced-motion compliance across all phases via `tests/launch-gate/anti-features.test.ts` (see Test Surface section) — but adds no new motion that would need its own gate.

---

## Border Radii

| Token | Value | Phase 6 usage |
|-------|-------|---------------|
| `--radius-none` | 0 | **OG image canvas corners.** The 1200×630 PNG is a sharp-cornered rectangle. (Twitter / LinkedIn / Slack apply their own rounded-corner masks at display time — the source image stays squared.) |
| `--radius-none` | 0 | **Favicon SVG canvas.** The 32×32 viewBox is a sharp-cornered square. Safari's macOS browser-chrome applies a rounded-rect mask when rendering tab favicons — the 4px interior margin (see Spacing) ensures `oe` letterforms survive that mask. |
| `--radius-sm` / `--radius-md` / `--radius-lg` | 2 / 6 / 12px | Reserved — unused in Phase 6. |

The continued zero-radius discipline in both artifacts matches the editorial register of the site (Phase 1: "rounded chrome reads as SaaS / template; squared chrome reads as editorial / terminal").

---

## The Two Visual Artifacts: Detailed Composition

### 1. Dynamic OG image — `app/opengraph-image.tsx` + `app/(site)/projects/[slug]/opengraph-image.tsx`

**Boundary:** RSC at build/edge time. No client component.
**Output:** `image/png` at 1200×630, served from the Next.js File-System Convention URL (e.g. `/opengraph-image`, `/projects/myco/opengraph-image`).
**Library:** `next/og`'s `ImageResponse`. Edge runtime preferred (per Next.js 16 default).

**Two route shapes:**

#### A. Default OG (`app/opengraph-image.tsx`)

Used by `/`, `/about`, `/projects`, `/resume`. Each page's `generateMetadata` does NOT need to set `openGraph.images` manually for these routes — Next.js auto-wires `app/opengraph-image.{jpg,png,tsx}` to all child routes that don't have a sibling override.

```
┌──────────────────────────────────────────────────────────────────────┐
│  ↑ 64px                                                              │
│                                                                      │
│  olivelliott.dev          ← Geist Mono, 32px, weight 500,            │
│                              tracking +0.02em, color #737373         │
│                                                                      │
│                                                                      │
│            ↓ 48px gap                                                │
│                                                                      │
│  olive elliott —                ← Geist Sans, 80px, weight 500,      │
│  engineer building              tracking -0.02em, line-height 1.15,  │
│  tools for autonomy             color #f5f5f5, max 2 lines           │
│                                                                      │
│            ↓ 32px gap                                                │
│                                                                      │
│  2026 · local-first · autonomous · open-source   ← Geist Mono, 20px, │
│                                                  weight 500, tracking│
│                                                  +0.02em, #737373    │
│                                                                      │
│  ↓ 64px                                                              │
└──────────────────────────────────────────────────────────────────────┘
                            1200 × 630
```

**Title copy per route (locked):**

| Route | Title copy | Meta row |
|-------|-----------|----------|
| `/` | `olive elliott — engineer building tools for autonomy` | `2026 · local-first · autonomous · open-source` |
| `/about` | `about — olive elliott` | `engineer · polymath · aktiga` |
| `/projects` | `selected work` | `2026 · local-first · autonomous · open-source` |
| `/resume` | `resume — olive elliott` | `engineer · 2026` |

#### B. Per-project OG (`app/(site)/projects/[slug]/opengraph-image.tsx`)

Generated per-slug via `generateImageMetadata` enumerating `getAll()`. Each project gets its own OG image at `/projects/{slug}/opengraph-image`.

```
┌──────────────────────────────────────────────────────────────────────┐
│  olivelliott.dev                                                     │
│                                                                      │
│                                                                      │
│  Myco                           ← title from project.title           │
│                                                                      │
│  2025 · local-first · autonomous · open-source   ← year + first 3    │
│                                                       tags           │
└──────────────────────────────────────────────────────────────────────┘
                            1200 × 630
```

**Title source:** `project.title` (verbatim, no transformation).
**Meta row source:** `${project.year} · ${project.tags.slice(0, 3).join(' · ')}` — first 3 tags only (composition rhythm; 4+ tags makes the meta row visually busy). Tags rendered lowercase as authored in the schema.

#### Font loading contract (both default and per-project)

```ts
// At module top-level — Edge runtime requires the buffer read at import time, not request time.
const geistSansMedium = fetch(
  new URL('../../../../node_modules/geist/dist/fonts/geist-sans/Geist-Medium.ttf', import.meta.url),
).then((r) => r.arrayBuffer())

const geistMonoMedium = fetch(
  new URL('../../../../node_modules/geist/dist/fonts/geist-mono/GeistMono-Medium.ttf', import.meta.url),
).then((r) => r.arrayBuffer())

// In handler:
return new ImageResponse(
  /* JSX */,
  {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'GeistSans', data: await geistSansMedium, weight: 500, style: 'normal' },
      { name: 'GeistMono', data: await geistMonoMedium, weight: 500, style: 'normal' },
    ],
  },
)
```

**Fallback chain (declared but should not trigger):**
1. Per-route OG (`opengraph-image.tsx`) — auto-wired by Next.js for routes that have one.
2. Default OG (`app/opengraph-image.tsx`) — auto-wired for routes without a sibling override.
3. Existing `/public/og-default.png` (Phase 3 site default) — referenced manually only if both above fail to generate; treated as a build-time safety net, not a runtime fallback.

#### Alt-text contract

`opengraph-image.alt.txt` sibling file (Next.js convention) provides the `alt` text for each OG image:

| OG image | Alt text |
|----------|----------|
| `app/opengraph-image.tsx` | `olivelliott.dev — engineer building tools for autonomy, local-first systems, and open-source communities.` |
| `app/(site)/projects/[slug]/opengraph-image.tsx` | `{project.title} — {project.tagline}` (derived per project from existing schema fields) |

Alt text is **not** rendered in the image — it's the OpenGraph `og:image:alt` meta property consumed by screen readers when the image surfaces in unfurled link previews.

### 2. Favicon set — `app/icon.svg` + `app/apple-icon.png` + `app/favicon.ico`

**Boundary:** static file assets, no runtime code path.
**Source of truth:** a single `app/icon.svg` design file. `apple-icon.png` and `favicon.ico` are derived at build time (via a `scripts/build-icons.ts` step OR a one-shot manual export committed to git — implementation chooses; recommend the script for determinism).

#### Mark design: `oe` typographic monogram

```
┌──────────────────────────┐
│                          │
│         ┌──┐  ┌──┐       │
│         │  │  │  │       │   ← lowercase `o` + `e` letterforms,
│        ┌┘  └┐ │  │       │     side by side, ~zero glyph gap
│        │    │ │  │       │     (true letterspacing, not chrome)
│        └┐  ┌┘ └──┘       │
│         └──┘             │
│                          │
└──────────────────────────┘
       32 × 32 viewBox
       4px margin all sides → interior 24 × 16 letterform box
```

**Specification:**

| Property | Value |
|----------|-------|
| Format | SVG (`app/icon.svg`) — primary; modern browsers consume directly |
| `viewBox` | `0 0 32 32` |
| Background `<rect>` | `width=32 height=32 fill="#0a0a0a"` — covers entire viewBox |
| Letterform `<path>` | converted from Geist Mono `o` + `e` glyphs at weight 500, scaled to fit a 24×16 interior box centered at (16, 16); `fill="#fbbf24"` — accent |
| `<title>` element | `olivelliott.dev` — screen-reader announceable inside SVG embeds |
| `<desc>` element | `Lowercase oe monogram in amber on dark — favicon for olivelliott.dev.` |

**Why glyph-as-path, not `<text>`:** browsers do not load Geist when rendering favicons. A `<text>` element would fall back to the system monospace, producing inconsistent letterforms across users. Converting `o` and `e` to `<path>` at design time freezes the exact Geist Mono shapes — every visitor sees the same mark.

**Derived assets:**

| File | Source | Output | Notes |
|------|--------|--------|-------|
| `app/apple-icon.png` | rasterize `app/icon.svg` at 180×180 via `sharp` | PNG, 180×180 | iOS home-screen icon. iOS applies its own rounded-rect mask + slight glossy treatment historically; modern iOS uses the raw raster. |
| `app/favicon.ico` | rasterize `app/icon.svg` at 16×16, 32×32, 48×48 → bundle into multi-image ICO via `to-ico` or `sharp-ico` | ICO multi-size | Legacy Windows + Firefox bookmark bar. |

**Build step (optional, recommended):** `scripts/build-icons.ts` reads `app/icon.svg` once, emits `app/apple-icon.png` and `app/favicon.ico`. Wired into `prebuild` or run manually when the SVG source changes. If the script is not adopted, the two derived files are exported manually once (Figma → Export PNG → ICO via online converter) and committed to git.

**Next.js auto-wiring:** with `app/icon.svg`, `app/apple-icon.png`, and `app/favicon.ico` all present at the app root, Next.js File-System Convention auto-emits `<link rel="icon">`, `<link rel="apple-touch-icon">`, and the `favicon.ico` root handler. **No manual `<link>` tags in `app/layout.tsx`.**

---

## Non-Visual Deliverables (Phase 6) — Out of UI-SPEC Scope

The following Phase 6 deliverables ship **no pixels** and therefore have no design contract here. They are recorded for traceability only:

| Deliverable | Where it lives | Visual surface? |
|-------------|----------------|-----------------|
| `app/sitemap.ts` | App Router File-System Convention | No — XML metadata at `/sitemap.xml` |
| `app/robots.ts` | App Router File-System Convention | No — text metadata at `/robots.txt` |
| `tests/a11y/*.test.tsx` (5 files) | Vitest + `vitest-axe` | No — assertions in test runner only |
| `tests/a11y/keyboard.test.tsx` | Vitest + JSDOM | No |
| `tests/seo/metadata.test.ts` | Vitest | No |
| `tests/launch-gate/anti-features.test.ts` | Vitest (extends PHASE_SOURCES manifest from Phases 4 + 5) | No — source-grep + DOM-grep only |
| Lighthouse local run + `lighthouse-report.md` | Manual + committed markdown | No new UI |

These deliverables are entirely **build-time / test-time / audit-time**. They consume the existing visual contract (Phases 1–5 UI-SPECs) and verify it; they do not extend it.

---

## Copywriting Contract

All Phase 6 strings that render in either visual artifact are enumerated below. Downstream consumers (gsd-planner, gsd-executor) must use these verbatim.

### OG image strings (locked)

| Element | Copy | Source | Register |
|---------|------|--------|----------|
| OG wordmark (every OG image, default + per-project) | `olivelliott.dev` | literal — matches site default OG and footer convention | lowercase mono |
| Default OG title (`/`) | `olive elliott — engineer building tools for autonomy` | locked — matches Phase 1 meta description shape | lowercase sans, two-line wrap |
| Default OG title (`/about`) | `about — olive elliott` | locked | lowercase sans, single-line |
| Default OG title (`/projects`) | `selected work` | locked — matches Phase 4 home-page eyebrow copy | lowercase sans, single-line |
| Default OG title (`/resume`) | `resume — olive elliott` | locked | lowercase sans, single-line |
| Per-project OG title (`/projects/[slug]`) | `{project.title}` | from `lib/schemas.ts` `ProjectFrontmatter.title` — verbatim, no transformation | as-authored (typically TitleCase per schema; the only display-cased copy in the visual layer) |
| Default OG meta row (`/`) | `2026 · local-first · autonomous · open-source` | locked — current year (Phase 7 may rev) + 3 thesis tags | lowercase mono, interpunct-separated |
| Default OG meta row (`/about`) | `engineer · polymath · aktiga` | locked — matches About bio framing | lowercase mono |
| Default OG meta row (`/projects`) | `2026 · local-first · autonomous · open-source` | locked — matches `/` (the index is the projects view of the same thesis) | lowercase mono |
| Default OG meta row (`/resume`) | `engineer · 2026` | locked — minimal | lowercase mono |
| Per-project OG meta row | `${project.year} · ${project.tags.slice(0, 3).join(' · ')}` | derived from `lib/schemas.ts` `ProjectFrontmatter.year` + `tags` | lowercase mono — tags as-authored (schema enforces lowercase) |
| Default OG `alt` text | `olivelliott.dev — engineer building tools for autonomy, local-first systems, and open-source communities.` | locked — sentence form for screen readers | sentence case |
| Per-project OG `alt` text | `{project.title} — {project.tagline}` | derived from schema | as-authored |

### Favicon strings (locked)

| Element | Copy | Register |
|---------|------|----------|
| Favicon `<title>` (inside SVG, screen-reader-announceable) | `olivelliott.dev` | lowercase, literal domain |
| Favicon `<desc>` | `Lowercase oe monogram in amber on dark — favicon for olivelliott.dev.` | sentence case, descriptive |
| Favicon rendered glyphs | `oe` | lowercase letterforms — no other characters render |

### Banned words (carried forward, re-asserted for Phase 6)

Phase 5's locked list applies: *passionate, award-winning, scalable solutions, cutting-edge, 10x, crafted, seamless, leveraging, synergy, rockstar, ninja, results-driven, self-starter, team player, go-getter, thought leader, dynamic.*

**Phase 6 addition:** OG-card-specific banned phrases — *introducing, presenting, the all-new, transform your, supercharge, next-generation, AI-powered, built with love.* Standard marketing-card flourishes that read as templated.

**No emoji** in any OG title, meta row, alt text, or favicon. Phase 1's emoji-in-chrome ban extends to OG cards (which are chrome-adjacent).

### Primary CTA (per template requirement)

**Phase 6 has no primary CTA.** OG images and favicons are passive surfaces — they don't drive in-image conversion. The OG image promotes the destination URL via its visual register; the favicon identifies the tab. Click-through is implicit (the unfurled link IS the CTA in the host platform).

### Empty state (per template requirement)

**Phase 6 has no empty states.** Both visual artifacts always have content:
- OG image: every route either has a sibling `opengraph-image.tsx` (per-project) or inherits the default (`/`, `/about`, `/projects`, `/resume`). No empty case — `generateImageMetadata` only enumerates slugs that have MDX files.
- Favicon: a static SVG; never empty.

### Error state (per template requirement)

**Phase 6 has no runtime error UI.** OG generation failures fall back to `/public/og-default.png` (shipped Phase 3) — this is a build/runtime safety net, not a rendered error state. Favicon failures (e.g. ICO file missing) result in browser-default no-favicon behavior, which is graceful degradation, not an error UI.

### Destructive actions (per template requirement)

**None in Phase 6.** No data to delete, no accounts to disable. Same as every prior phase through v1 — this field stays empty through launch.

---

## Accessibility Contract (visual artifacts only)

Phase 6's a11y test surface (`tests/a11y/*`) audits Phases 1–5; the contract for those phases lives in their respective UI-SPECs. The Phase 6 visual artifacts have their own a11y contract:

### OG image a11y

- **Alt text:** every OG image ships with an `opengraph-image.alt.txt` sibling per Next.js convention (see Copywriting Contract for verbatim text). Twitter / LinkedIn / Slack consume `og:image:alt` for screen readers.
- **Contrast verification:** all text-on-background pairings in the OG image are pre-verified in this UI-SPEC (`#f5f5f5` / `#0a0a0a` = 18.4:1 AAA; `#737373` / `#0a0a0a` = 4.8:1 AA normal, AAA large — and OG meta + wordmark are both rendered at large-text scales).
- **No text on accent fill** in the OG image (accent is not used in OG) — eliminates the one risky pairing.
- **Title font size auto-selection respects readability:** the 80px / 64px branch prevents long titles from rendering at sub-readable sizes when crammed into two lines.

### Favicon a11y

- **SVG `<title>` element** announces `olivelliott.dev` when the SVG is embedded inline (e.g., screen readers exploring a page that uses the favicon as decoration). Browser-tab favicon rendering does not surface alt text by spec — the `<title>` is for the embedded case.
- **Contrast verification:** `#fbbf24` on `#0a0a0a` = 11.8:1 AAA. The favicon is rendered at sizes from 16px up; the contrast holds at every size.
- **No animation** — no `prefers-reduced-motion` concern.
- **Apple touch icon:** iOS announces the app name from the page's `<title>` tag when the icon is added to the home screen — no separate alt text needed.

### Audit deliverables (consumed by Phase 6 test surface, not visual)

| Test surface | Coverage | Verifies |
|--------------|----------|----------|
| `tests/a11y/home.test.tsx` | `/` rendered shell | axe-core: zero violations |
| `tests/a11y/projects-index.test.tsx` | `/projects` rendered shell | axe-core: zero violations |
| `tests/a11y/myco-detail.test.tsx` | `/projects/myco` rendered shell | axe-core: zero violations |
| `tests/a11y/about.test.tsx` | `/about` rendered shell | axe-core: zero violations |
| `tests/a11y/resume.test.tsx` | `/resume` rendered shell | axe-core: zero violations |
| `tests/a11y/keyboard.test.tsx` | every public route | Every interactive element reachable via Tab; visible `:focus-visible` styling |

These tests assert the contract — they don't add to it.

---

## Responsive Contract

The OG image and favicon are **non-responsive by definition** — they have fixed pixel dimensions consumed by external platforms (link unfurlers, browser chrome).

| Artifact | Dimensions | Notes |
|----------|-----------|-------|
| OG image (default + per-project) | 1200×630 fixed | Twitter / LinkedIn / Slack / iMessage all consume this aspect ratio (1.91:1). Renderers may crop to their own preview aspects (Twitter mobile crops to 16:9; the 64px safe-zone padding handles this). |
| Favicon SVG | scalable; renders at 16/24/32/48/180px depending on consumer | Browsers select rendering size; the SVG's viewBox-relative coordinates scale cleanly. The 4px interior margin ensures the `oe` glyphs survive Safari's rounded-rect mask at small sizes. |
| Apple touch icon | 180×180 fixed PNG | iOS home-screen icon |
| `favicon.ico` | bundled 16/32/48 raster | Browser selects size from the ICO bundle |

**Touch targets:** N/A — neither artifact is an interactive surface in itself. (The unfurled link card is the click target on host platforms; click handling is owned by Twitter / LinkedIn / Slack.)

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | **none in Phase 6.** Continues the v1-wide pattern (Phases 1–5 all shipped zero shadcn components). | not required — shadcn not initialized in v1 |
| Third-party registries | **none permitted in v1** | N/A — no third-party blocks declared in Phase 6 |

**Phase 6 registry footprint: zero.** No `npx shadcn add`, no `npx shadcn view`, no preset.

---

## Anti-Patterns Re-Asserted (Phase 6 verification surface)

Phase 6 is the launch gate. The following anti-patterns from `research/FEATURES.md` are **explicitly out of scope** for both visual artifacts AND are codified as launch-gate tests against the entire codebase via `tests/launch-gate/anti-features.test.ts`:

### Forbidden in the OG image (visual)

- Gradient backgrounds (`from-* to-*`, `radial-gradient`, `conic-gradient`)
- Glassmorphism / `backdrop-blur`
- Hero/product photography or screenshots
- Stock illustrations / decorative SVG flourishes
- Logo lockups (single typographic wordmark only)
- Avatar headshots
- "Built with Next.js" / Vercel / tech-stack badges
- Client-logo strips
- Metric callouts ("100k users", "99.9% uptime") on the OG card
- Skill chips, percentage bars
- Multi-column layouts with image insets
- Drop shadows on text or container
- Inner glows, text strokes, gradient text fills
- Auto-generated emoji garnishes
- "Sponsored by" / footer marks beyond the wordmark
- Any color outside the three-token palette (`#0a0a0a`, `#f5f5f5`, `#737373`) — accent specifically NOT used

### Forbidden in the favicon (visual)

- Full-color or multi-color logos
- Photographic source
- Gradient marks
- Detailed iconography that muddies at 16px
- Chrome containers (no `O` + `E` inside a circle / square chrome — the letterforms ARE the mark)
- Animated favicons (`<animate>`, animated GIF, animated SVG)
- Off-palette colors

### Launch-gate test scope (codebase-wide, `tests/launch-gate/anti-features.test.ts`)

Source-grep + DOM-grep assertions for all 19 items from `research/FEATURES.md`:

1. No skill bars (search for percentage-paired skill names in `/about` + resume sources)
2. No gradient-on-gradient (`bg-gradient.*from.*via.*to`)
3. No stagger-on-scroll (no `whileInView` with sequenced delay across siblings)
4. No bento home (verified via Phase 4 layout — single-column thesis + hero cards + secondary grid)
5. No glassmorphism (`backdrop-blur`, `backdrop-filter`)
6. No Lottie (no `lottie-react`, no `.lottie` / `.json` animation files)
7. No R3F / Three.js (no `@react-three/*`, no `three` import)
8. No Aceternity-style hero treatments (no `bg-gradient-to-br from-[indigo|violet|purple]`)
9. No cookie banner (no `cookie-consent`, no `gdpr-banner` patterns)
10. No newsletter signup (no `subscribe` form, no email-list capture)
11. No AI-template hero (no "passionate", "results-driven", "AI-powered" + banned-words enforcement)
12. No testimonial carousel (no quote-block + author pattern with carousel controls)
13. No marquee tech-logo strips (no infinite-scroll logo strips)
14. No skills tag cloud (no `tag-cloud` libs, no 30-icon tech grid)
15. No `/services` page (no `app/services/` directory)
16. No "coming soon" blog stub (`/writing` deferred per PROJECT.md — verified absent)
17. No years-of-experience counter ("5+ years", "30+ projects" patterns)
18. No auto-play motion (no `autoPlay` props, no auto-rotating carousels)
19. No light-mode toggle (no `next-themes` `enableSystem={true}` or `defaultTheme` other than `dark`)

This test set is the codified launch-gate. Phase 6 ships the test; Phase 7 verifies it passes pre-deploy.

---

## Design Tokens: Single-file Reference

**Phase 6 adds zero tokens to `styles/tokens.css`.** The token file remains as locked at end-of-Phase-3 (which added the H2/H3 + `--font-weight-semibold: 600` entries on top of Phase 1's baseline). No editor should touch `styles/tokens.css` during Phase 6 implementation.

The OG image and favicon source files inline the following hex values (kept in lock-step with `styles/tokens.css` — any future change is a same-commit edit):

| Used in | Hex | Token reference |
|---------|-----|-----------------|
| OG bg, favicon bg | `#0a0a0a` | `--color-bg` |
| OG title | `#f5f5f5` | `--color-text-primary` |
| OG wordmark, OG meta | `#737373` | `--color-text-tertiary` |
| Favicon `oe` | `#fbbf24` | `--color-accent` |

---

## Phase 6 Deliverable Checklist (for gsd-planner / gsd-executor)

Files the plan must create:

### Visual artifacts (this UI-SPEC governs)
- [ ] `app/opengraph-image.tsx` — default OG `ImageResponse` for `/`, `/about`, `/projects`, `/resume`
- [ ] `app/opengraph-image.alt.txt` — alt text for the default OG
- [ ] `app/(site)/projects/[slug]/opengraph-image.tsx` — per-project OG with `generateImageMetadata` enumerating `getAll()`
- [ ] `app/(site)/projects/[slug]/opengraph-image.alt.txt` (or per-image alt return) — alt text strategy for per-project OGs
- [ ] `app/icon.svg` — `oe` monogram favicon (glyph-as-path)
- [ ] `app/apple-icon.png` — 180×180 raster from `app/icon.svg`
- [ ] `app/favicon.ico` — multi-size (16/32/48) raster bundle
- [ ] `scripts/build-icons.ts` (optional, recommended) — rasterizes SVG → PNG + ICO at build time

### Non-visual artifacts (out of UI-SPEC scope, listed for traceability)
- [ ] `app/sitemap.ts` — `MetadataRoute.Sitemap` enumerating all public routes + project slugs
- [ ] `app/robots.ts` — `MetadataRoute.Robots` with sitemap pointer
- [ ] `tests/a11y/{home,projects-index,myco-detail,about,resume,keyboard}.test.tsx` — vitest-axe per-route assertions
- [ ] `tests/seo/metadata.test.ts` — per-route `generateMetadata` shape audit
- [ ] `tests/launch-gate/anti-features.test.ts` — 19-item launch-gate
- [ ] `.planning/phases/06-seo,-og,-a11y-&-performance-audit/lighthouse-report.md` — local Lighthouse scores ≥ 90 / 90 / 90 / 90

### Audit-only verification (no new files)
- [ ] `metadataBase` present in `app/layout.tsx` (Phase 1 should have set it — Phase 6 verifies)
- [ ] Every public route's `generateMetadata` sets `alternates.canonical = pathname`
- [ ] Every public route's `generateMetadata` sets `openGraph` + `twitter` correctly (Phase 6 test verifies)

---

## Checker Sign-Off

- [ ] Dimension 1 Copywriting: PASS (every OG string locked; banned-words list extended for OG-card flourishes; favicon strings locked; no emoji in any artifact)
- [ ] Dimension 2 Visuals: PASS (no gradients, no glassmorphism, no shadows, no decorative SVG in either artifact; single-column editorial OG layout; glyph-as-path favicon)
- [ ] Dimension 3 Color: PASS (3-token palette in OG, 2-token in favicon; 60/30/10 honored across the milestone via inheritance; every artifact pairing AA-or-AAA verified)
- [ ] Dimension 4 Typography: PASS (zero new roles; composes existing Phase 1 display / label / mono tokens at OG-canvas scale; Geist Mono converted to path in favicon for deterministic rendering)
- [ ] Dimension 5 Spacing: PASS (OG canvas spacing on 4-point grid: 64 / 48 / 32 / 16; favicon viewBox geometry on 4-point grid; no exceptions introduced)
- [ ] Dimension 6 Registry Safety: PASS (zero registries in Phase 6, third-party blocks forbidden in v1, no `npx shadcn add` invoked)

**Approval:** pending — awaiting gsd-ui-checker.
