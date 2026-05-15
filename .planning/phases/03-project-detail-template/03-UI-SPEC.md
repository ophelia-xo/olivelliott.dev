---
phase: 3
slug: project-detail-template
status: draft
shadcn_initialized: false
preset: none
created: 2026-05-15
inherits_from: .planning/phases/01-foundation/01-UI-SPEC.md
---

# Phase 3 — Project Detail Template: UI Design Contract

> Visual and interaction contract for `/projects/[slug]`. Anchored by Myco. Ships the hero treatment, MDX component library (Figure / Gallery / Callout / CodeBlock), heading-anchor behavior, NextProjectBlock navigation, privacy rendering, and per-route metadata + OG. Tokens (color, type scale, motion, spacing base, radii) are inherited from Phase 1's UI-SPEC and **must not be re-declared or contradicted** here.

**Reference aesthetic:** wallofportfolios.in — magazine-spread typographic rhythm. The case study reads like an essay, not a SaaS landing page.

**Explicit aesthetic prohibitions** (carried forward from Phase 1 + `research/FEATURES.md` + `research/PITFALLS.md`):
no glassmorphism cards, no gradient blobs, no `from-*-500 to-*-500` gradients, no `backdrop-blur`, no `box-shadow` surfaces, no radial-gradient orbs, no skill bars, no testimonial carousels, no bento layouts, no stagger-on-scroll, no R3F / 3D heroes, no Lottie defaults, no auto-play motion, no decorative cursor effects, no AI-template hero treatments, no marquee tech-logo strips, no metric inflation. Code blocks render with Shiki **build-time** tokens — zero client JS for syntax highlighting.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | none (hand-assembled; tokens locked in Phase 1) |
| Preset | not applicable — `components.json` deliberately absent. shadcn deferred until a real Button/Dialog need arises (Phase 5 contact-form territory). Phase 3 ships zero registry-pulled components. |
| Component library | none for chrome. `radix-ui` (unified, Feb 2026) **may** be reached for if MDX renders content that needs accessible primitives — at the moment of writing, the Myco MDX uses only headings, paragraphs, code, and bullet lists, so no Radix primitive is required. |
| Icon library | `lucide-react` — tree-shaken named imports. Phase 3 uses **at most one icon**: the heading-anchor `#` glyph is rendered as a literal `#` character (not an icon) for editorial weight. The optional `→` and `↗` symbols in copy are likewise plain glyphs, not icons. |
| Font | Geist Sans (display + body + headings) and Geist Mono (eyebrows, tag chips, code, anchor `#`, repo/private label). Same `next/font/local` source as Phase 1. No new font face. |

**Registry strategy (carried forward):** No new registries permitted in v1. If a real Button/Dialog need surfaces during Phase 3 implementation (it should not — see component inventory below), that triggers a `pnpm dlx shadcn@latest init` + a `npx shadcn view` vetting note — not a quiet add.

---

## Spacing Scale

Inherits Phase 1's 4px base (`--spacing: 0.25rem`). Every Phase 3 layout value is a multiple of 4. Phase 3 declares no new spacing tokens — all values reference existing ones.

| Token | Value | Tailwind utility | Usage in Phase 3 |
|-------|-------|------------------|-------------------|
| `--space-1` | 4px | `gap-1` | Inline gap between heading text and the `#` anchor glyph |
| `--space-2` | 8px | `gap-2` / `p-2` | Tag chip vertical padding; chip-to-chip horizontal gap |
| `--space-3` | 12px | `gap-3` / `px-3` | Tag chip horizontal padding; metadata-row internal gaps |
| `--space-4` | 16px | `gap-4` | Default gap inside Callout body; Figure → caption gap; bullet-list item gap |
| `--space-6` | 24px | `gap-6` / `py-6` | Hero internal row gaps (title → tagline → meta); Gallery item gap on mobile |
| `--space-8` | 32px | `gap-8` | Gallery item gap on desktop; gap between hero and MDX content |
| `--space-12` | 48px | `py-12` | NextProjectBlock vertical padding; gap between MDX end and NextProjectBlock |
| `--space-16` | 64px | `py-16` | Vertical rhythm above hero, below NextProjectBlock — mobile |
| `--space-24` | 96px | `py-24` | Vertical rhythm above hero, below NextProjectBlock — desktop |

**Exceptions for Phase 3:**

- **Tag chip touch target.** Chips are interactive (link to `/projects?tag=X`). Visual chip = ~22px tall, padding `px-3 py-1.5` (12px / 6px). Hit area extended to 44×44px via `py-2.5 -my-2.5` trick (visual height stays at 22px; clickable area is 32px tall; combined with line-height 1.4 on 14px label, the wrapping `<a>` is ≥ 44px when the row's `gap-2` is taken into account by the per-anchor invisible padding extension). Where `-my-*` cannot meet 44px (rare — single chip with no surrounding chips), bump per-chip to `py-3 -my-3`.
- **Anchor `#` glyph.** Rendered with `ml-2` (8px) lead from heading text and `opacity-0` at rest, transitioning to `opacity-100` on heading hover/focus. The 8px is intentional — wide enough to read as a separate token, not glued to the heading.
- **Prose width constraint.** `max-w-[65ch]` — measured in characters, not the spacing scale. This is a typographic measure, not a spacing token. It supersedes the page container's `max-w-6xl` for body paragraphs only; headings, figures, gallery, callouts, and code blocks may bleed wider (see Page Composition).
- **Code block padding.** `px-4 py-4` (16px) for the outer `<pre>`, with per-line `px-4` mirrored on highlighted lines so the highlight stripe goes edge-to-edge. Standard Shiki padding — no exception, just calling it out.

### Container + Layout (inherits Phase 1)

| Property | Value | Notes |
|----------|-------|-------|
| Page max-width | `72rem` (1152px) | `max-w-6xl` — site shell from Phase 1 |
| Page gutter (mobile) | 24px (`px-6`) | unchanged |
| Page gutter (tablet) | 32px (`px-8`) | unchanged |
| Page gutter (desktop) | 48px (`px-12`) | unchanged |
| **Prose measure (NEW for Phase 3)** | `max-w-[65ch]` (~65ch) | Body paragraphs, lists, blockquotes only. Centered inside the page container. |
| Hero block width | full container (`max-w-6xl`) | Hero may use the full editorial width. Not full-bleed. |
| Figure / Gallery / Callout / CodeBlock width | up to `max-w-6xl` | These may bleed past `max-w-[65ch]` for emphasis when authored that way; default is to inherit prose width, opt out by author. |

### Breakpoints (inherit Phase 1 — Tailwind v4 defaults)

| Name | Min width | Phase 3 layout effect |
|------|-----------|------------------------|
| `< 640px` | — | Hero: single column. Gallery: 1-up. NextProjectBlock: stacked (eyebrow → title → tagline). Tag chips wrap freely. |
| `sm` | 640px | Gallery 2-up may begin (author-controlled prop). |
| `md` | 768px | **Hero shifts to 2-column** (text left, image right) — defined breakpoint per CONTEXT.md. Gallery 2-up default. |
| `lg` | 1024px | Gallery 3-up may begin (author-controlled prop). NextProjectBlock title scales up to display ramp. |
| `xl` | 1280px | No further layout change — page caps at `max-w-6xl`. |

---

## Typography

**Phase 3 extends Phase 1's type scale** with two additional roles required by long-form MDX. Phase 1 declared this as deferred ("Phase 3 MAY introduce 600 for MDX H2/H3 headings; that's a Phase 3 decision"). Phase 3 introduces them.

**Families: unchanged from Phase 1.** Geist Sans for body + headings + display. Geist Mono for code, eyebrows, tag chips, repo/private label, anchor glyphs. No serif, no third family.

### Scale (Phase 3 — adds H2 + H3, retains body / label / display)

| Role | Size (rem / px) | Weight | Line height | Tracking | Family | Used for |
|------|-----------------|--------|-------------|----------|--------|----------|
| **Body** (Phase 1) | `1rem` / 16px | 400 | 1.6 | 0 | Geist Sans | MDX paragraphs, callout body, figure caption, hero tagline, NextProjectBlock tagline |
| **Label** (Phase 1) | `0.875rem` / 14px | 500 | 1.4 | `+0.02em` | Geist Mono | Tag chips, hero year, repo / private label, NextProjectBlock eyebrow `next →`, hero meta row, code block filename label |
| **H3** (NEW Phase 3) | `1.25rem` / 20px | 600 | 1.4 | `-0.01em` | Geist Sans | MDX `## ` H3 (rare in current Myco draft; reserved for future case studies) |
| **H2** (NEW Phase 3) | `1.5rem` / 24px (mobile) → `1.75rem` / 28px (`md+`) | 600 | 1.3 | `-0.015em` | Geist Sans | MDX `## ` H2 — Problem / Approach / Outcome anchors. Hero project title in NextProjectBlock when not at display size. |
| **Display** (Phase 1) | `clamp(2rem, 5vw, 3rem)` / 32–48px | 500 | 1.15 | `-0.02em` | Geist Sans | Hero title (project title at top of page), text-only hero fallback title, NextProjectBlock title (`md+`), 404 already covered |

**Design-intent notes:**

- **Weights: 400 + 500 + 600.** Phase 3 unlocks 600 for headings as Phase 1 anticipated. Body stays at 400, labels stay at 500, headings at 600. No 300, no 700+. Three weights total — still inside the discipline floor (Phase 1's "2-weight" rule was deliberately tight; Phase 3's 3-weight expansion is the planned escalation, not a violation).
- **H2 size deliberately restrained.** 24/28px H2 against a 16px body gives a 1.5–1.75 ratio — magazine-rule, editorial. Resist the temptation to hero-size H2s; the **page hero** is the display element. H2s are section markers, not display moments.
- **H2 tracking `-0.015em`.** Tighter than body (0) but not as tight as display (`-0.02em`) — the calibrated middle for headline-weight body type.
- **H3 weight 600.** Same weight as H2 — distinguishing them by size + tracking, not weight, prevents weight-creep across nested headings.
- **No H4, H5, H6 declared.** If Myco or a future case study uses them, they fall back to body styling (16px medium 500). This is intentional — case studies should not need 6 heading levels; if they do, the structure is wrong.
- **Body line-height 1.6** maintained from Phase 1. Slightly looser than the 1.5 industry default — calibrated for dark-theme readability and Geist's optical metrics.
- **Code (mono inline + block).** Inherits body size 16px in block, 14px (label) inline. Both Geist Mono. No syntax tinting on inline code — only a subtle `--color-surface-2` background (8px horizontal padding, 2px vertical, 2px radius). Block code uses Shiki tokens (see Code Block Contract).

### Type ramp additions for `@theme` (executor reference)

These extend `styles/tokens.css`. The plan task should add only what is missing — the existing tokens stay untouched.

```css
/* Phase 3 additions to @theme block */
--text-h2: 1.5rem;
--text-h2--line-height: 1.3;
--text-h2-md: 1.75rem;          /* applied via responsive utility */
--text-h3: 1.25rem;
--text-h3--line-height: 1.4;
--font-weight-semibold: 600;    /* new — Phase 1 stopped at 500 */
```

**Token-system discipline:** any value not on this scale (e.g., a 22px heading) is forbidden. The plan must use `text-h2` / `text-h3` utilities (or arbitrary class on the mapped CSS variable), never `text-[22px]`.

### Text rendering

Inherited from Phase 1's `html` rules — antialiased, optimizeLegibility, `font-feature-settings: "ss01", "cv11"`. No additions in Phase 3.

---

## Color

Phase 3 adds **zero new color tokens.** Every color used is already declared in `styles/tokens.css` (Phase 1 reserved `--color-surface-2` and the danger token; Phase 3 activates `--color-surface-2` for the first time). The 60 / 30 / 10 split is preserved.

### Semantic tokens used in Phase 3

| Role | Token | Value | Phase 3 usage |
|------|-------|-------|---------------|
| **Dominant (60%)** | `--color-bg` | `#0a0a0a` | Page background, hero background, NextProjectBlock background. Same surface as Phase 1. |
| **Secondary (30%)** | `--color-surface-2` | `#141414` | **Activated for the first time.** Inline-code background pill. Code block (`<pre>`) background. Callout background fill (`note` / `warn` / `quote` variants — all use surface-2 for the fill, distinguished by left-border accent color, not by background tint). |
| | `--color-hairline` | `#1f1f1f` | 1px divider above NextProjectBlock. Optional 1px top border on the Code Block when a filename label is present (separates the label cap from the code body). Hairline below H2 headings is **not** used (no underlines on headings — keep editorial weight clean). |
| **Accent (10%)** | `--color-accent` | `#fbbf24` (amber-400) | Repo `↗` link color. NextProjectBlock hover-underline. Inline `<a>` in MDX body. Callout `note` left-border. Heading anchor `#` glyph on hover/focus (overrides `--color-text-tertiary` rest state). |
| | `--color-accent-hover` | `#f59e0b` (amber-500) | Repo `↗` link in hover/active state. Inline `<a>` hover. |
| **Destructive** | `--color-danger` | `#f87171` (red-400) | Callout `warn` left-border only. **Not** used for body text or backgrounds. No destructive actions in Phase 3 (no delete / disable / cancel UX — pages are read-only). |

### Text tokens (inherit Phase 1 tiers)

| Token | Value | Phase 3 usage |
|-------|-------|---------------|
| `--color-text-primary` | `#f5f5f5` | MDX body, H2 / H3 headings, hero title, NextProjectBlock title, gallery captions when emphasized, code block tokens in plain (non-syntax-tokenized) areas |
| `--color-text-secondary` | `#a3a3a3` | Hero tagline, hero year, gallery captions (default), figure captions, callout body when content is contextual, NextProjectBlock tagline |
| `--color-text-tertiary` | `#737373` | Heading anchor `#` glyph rest-state color, **`code private` label color** (replaces repo link), NextProjectBlock `next →` eyebrow, code block filename label |
| `--color-text-on-accent` | `#0a0a0a` | Reserved — unused in Phase 3 (no accent fills). |

### Verified pairings (extends Phase 1 — every Phase 3 pairing audited)

| Foreground | Background | Ratio | Passes |
|------------|------------|-------|--------|
| `--color-text-primary` (#f5f5f5) | `--color-surface-2` (#141414) | ~16.0:1 | AAA normal + large — code block, callout, inline code |
| `--color-text-secondary` (#a3a3a3) | `--color-surface-2` (#141414) | ~7.3:1 | AAA normal + large — callout body |
| `--color-text-tertiary` (#737373) | `--color-bg` (#0a0a0a) | ~4.8:1 | AA normal, AAA large — `code private` label, anchor `#` rest |
| `--color-text-tertiary` (#737373) | `--color-surface-2` (#141414) | ~4.2:1 | **AA large only** — code block filename label is rendered at 14px label scale, which qualifies as normal text → use `--color-text-secondary` instead for filename labels. **Override:** filename label uses `--color-text-secondary` on `--color-surface-2`. |
| `--color-accent` (#fbbf24) | `--color-bg` (#0a0a0a) | 11.8:1 | AAA — repo link, anchor `#` on hover, NextProjectBlock underline |
| `--color-accent` (#fbbf24) | `--color-surface-2` (#141414) | 10.7:1 | AAA — accent on callout fills |
| `--color-danger` (#f87171) | `--color-surface-2` (#141414) | ~6.9:1 | AA + AAA normal — Callout `warn` left-border (decorative, not text — but contrast is sufficient should warning glyph ever ride alongside) |

### Accent reserved-for list (Phase 3 — extends Phase 1's list)

The accent color is **only** applied to the following Phase 3 elements:

1. **Inline `<a>` in MDX body** (color + underline-on-hover).
2. **`repo ↗` link** in the hero metadata row.
3. **Heading anchor `#` glyph** on hover/focus (rest state is `--color-text-tertiary`).
4. **NextProjectBlock hover underline** under the project title.
5. **Callout `note` left-border** (4px solid, full height of the callout).
6. **Focus ring** on every interactive element (inherits Phase 1 spec — `outline: 2px solid var(--color-accent); outline-offset: 2px`).

The accent is **explicitly not** used for:

- Body text, heading text, code block text (Shiki tokens override; comments / keywords / strings use the Vesper theme palette — see Code Block Contract).
- Background fills of any kind in Phase 3 (no amber buttons, no amber backgrounds, no amber callouts).
- Tag chip color (chips use `--color-text-secondary` text on `--color-surface-2` fill at rest, `--color-text-primary` on hover — no accent shift, mirroring the footer-icon discipline).
- The `code private` label (uses `--color-text-tertiary` — accent would over-emphasize a non-action).
- NextProjectBlock title text in rest state (uses `--color-text-primary`; accent only appears in the hover underline).
- The `↗` glyph itself when the repo link is at rest (the whole anchor — text + glyph — is `--color-accent`; on hover both shift to `--color-accent-hover`. Glyph never tinted independently).

### Gradients, shadows, glassmorphism

**Forbidden in Phase 3** — same rule as Phase 1. No `bg-gradient-*`, no `backdrop-blur`, no `box-shadow`, no `border-gradient`, no radial-gradient orbs. Depth in Phase 3 is achieved via `--color-surface-2` for elevated content (callouts, code blocks) and `--color-hairline` for dividers — never via shadow or blur.

---

## Motion

Phase 3 adds **zero new motion tokens.** Every Phase 3 motion uses `--motion-duration-base` (220ms) and `--motion-ease-standard` (`cubic-bezier(0.22, 1, 0.36, 1)`) from Phase 1. The reserved `--motion-duration-slow` (420ms) is not activated in Phase 3 (it is held for the Phase 4 hero entrance moment).

### Phase 3 motion inventory (every animated element listed)

| Element | Property | Duration | Ease | Reduced-motion behavior |
|---------|----------|----------|------|--------------------------|
| Heading anchor `#` glyph | `opacity` 0 → 1 on heading hover/focus | `--motion-duration-base` (220ms) | `--motion-ease-standard` | **Anchor remains visible** (opacity 1) — affordance preserved. The transition itself collapses to ~0ms. |
| Inline `<a>` underline (in MDX body) | `text-decoration` solid on rest, `text-decoration-color` shift to `--color-accent-hover` on hover (instant) + slight `text-underline-offset` shift `2px → 3px` on hover | `--motion-duration-fast` (120ms) for offset only | `--motion-ease-standard` | Underline color/offset shift collapses to ~0ms; underline still visible at rest, hover color still applies. |
| `repo ↗` link | `color` shift `--color-accent` → `--color-accent-hover` | `--motion-duration-fast` (120ms) | `linear` (color only — instant feedback) | Color shift collapses; hover state still readable. |
| Tag chip | `color` shift `--color-text-secondary` → `--color-text-primary` on hover | `--motion-duration-fast` (120ms) | `linear` | Same — color shift collapses, hover color still applies. |
| NextProjectBlock title | `transform: translateX(0 → 4px)` on block hover/focus | `--motion-duration-base` (220ms) | `--motion-ease-standard` | **`translateX` disabled** — title stays at `translateX(0)`. Underline still appears (preserves the affordance per CONTEXT.md). |
| NextProjectBlock title underline | `text-decoration-color` solid `transparent → --color-accent` on block hover/focus + `text-underline-offset` 0 → 4px | `--motion-duration-base` (220ms) | `--motion-ease-standard` | Underline appears instantly (no transition); offset stays at 0. Affordance preserved. |
| Callout (`note` / `warn` / `quote`) | **No motion.** Static surface. | — | — | — |
| Figure / Gallery image | **No motion.** Static. No hover scale, no fade-in on scroll. | — | — | — |
| Code block | **No motion.** Tokens are SSR'd, code is static. No copy-button animation in Phase 3 (no copy button in Phase 3 — see Component Inventory). | — | — | — |

### Reduced-motion implementation

- Phase 3 components that use `motion/react` (only the NextProjectBlock for the `translateX(4px)` translation) MUST be wrapped in the `<m.*>` form per Phase 1's `LazyMotion strict`. No `<motion.*>` imports.
- All other Phase 3 motion is plain CSS `transition` — caught by Phase 1's `@media (prefers-reduced-motion: reduce)` floor in `app/globals.css` (sets all transitions to 0.01ms).
- The NextProjectBlock motion is opacity/transform only and lives below the fold (after MDX body) — it cannot cause CLS even when active.

### Motion anti-patterns (carried forward from Phase 1, re-asserted for Phase 3)

- **No transform animations on first-viewport elements.** Hero title and tagline render at final position immediately. No fade-in on the hero, no slide-up on the H2 anchors. (The Phase 1 `<FadeIn>` is permitted on Phase 1's home placeholder only — Phase 3 pages do not wrap the hero in `<FadeIn>`.)
- **No stagger-on-scroll.** The MDX body renders all H2 / paragraph / figure / gallery / code block content immediately. No scroll-triggered reveals anywhere in Phase 3.
- **No layout animation.** Callouts, code blocks, figures, galleries do not animate in/out; they exist on the page when SSR'd and stay there.
- **No `dynamic(ssr: false)`** on any Phase 3 component. Every component is SSR-renderable.
- **No `<motion.div>`** — `LazyMotion strict` from Phase 1 enforces `<m.div>`.

---

## Border Radii

| Token | Value | Phase 3 usage |
|-------|-------|---------------|
| `--radius-none` | 0 | Hero block corners, NextProjectBlock corners, Figure image, Gallery images, page chrome — **all zero radius.** Editorial / architectural read continues from Phase 1. |
| `--radius-sm` | 2px | **Activated for first time.** Inline-code pill background. Tag chip background. |
| `--radius-md` | 6px | **Activated for first time.** Code block (`<pre>`) outer corners. Callout (`note` / `warn` / `quote`) outer corners. |
| `--radius-lg` | 12px | Reserved — unused in Phase 3. Held for Phase 4 project cards. |

The 2px / 6px activation is a deliberate, measured break from Phase 1's strict zero-radius rule. The rationale: code blocks and callouts are **content surfaces**, not chrome. They're literal boxes of content, and a 6px radius reads as "container", not as "SaaS button". Tag chips and inline code use 2px — barely-rounded, almost square, but enough that the eye reads them as separate tokens at small size. Hero, NextProjectBlock, page-level layout — all stay zero-radius.

---

## Page Composition

### Document outline (top to bottom)

```
<article>                                              [Phase 3 page root — semantic <article>]
  <header>                                              [Hero block]
    [grid: text-col | image-col on md+]
      [text-col]
        <h1 class="display">{project.title}</h1>
        <p class="body text-secondary">{project.tagline}</p>
        <div role="list" aria-label="Project metadata">
          <span class="label">{project.year}</span>
          <a href="/projects?tag=local-first" class="chip">local-first</a>
          <a href="/projects?tag=autonomous" class="chip">autonomous</a>
          ... (all tags as chips)
          [If public:] <a href={links.repo} class="repo-link">repo ↗</a>
          [If private:] <span class="private-label">code private</span>
        </div>
      [image-col, md+ only when hero is image-present]
        <Figure src={hero.src} alt={hero.alt} />
  </header>

  <div class="prose">                                  [MDX content — max-w-[65ch] center]
    <h2 id="problem">Problem<a class="anchor">#</a></h2>
    <p>...</p>
    <p>...</p>
    <h2 id="approach">Approach<a class="anchor">#</a></h2>
    <p>...</p>
    <Figure>...</Figure>                                [may bleed wider — opt-in]
    <Gallery>...</Gallery>                              [may bleed wider — opt-in]
    <Callout variant="note">...</Callout>               [may bleed wider — opt-in]
    <pre><code>...</code></pre>                         [Shiki tokens — may bleed wider]
    <h2 id="outcome">Outcome<a class="anchor">#</a></h2>
    <p>...</p>
  </div>

  <hr class="hairline" />                              [1px --color-hairline divider]

  <nav aria-label="Next project">                       [NextProjectBlock]
    <span class="eyebrow">next →</span>
    <h2 class="display"><a href="/projects/{next.slug}">{next.title}</a></h2>
    <p class="tagline text-secondary">{next.tagline}</p>
  </nav>
</article>
```

### Width discipline

| Element | Width |
|---------|-------|
| Page container | `max-w-6xl mx-auto px-6 md:px-8 lg:px-12` (inherited from `(site)/layout.tsx`) |
| `<article>` root | full container |
| Hero | full container width |
| Hero text col | `md`+: 50% (`md:w-1/2 lg:w-7/12`) — text gets slightly more weight than image at `lg+`, magazine convention |
| Hero image col | `md`+: 50% (`md:w-1/2 lg:w-5/12`) |
| Prose body (`<div class="prose">`) | `max-w-[65ch] mx-auto` — measured in characters |
| Headings, Figure, Gallery, Callout, code block (default) | inherit `max-w-[65ch]` from prose container |
| Headings, Figure, Gallery, Callout, code block (bleed) | author-controlled prop (e.g. `<Figure wide>`) — escapes prose to full container |
| NextProjectBlock | full container width |

### Vertical rhythm

| Boundary | Mobile | Desktop |
|----------|--------|---------|
| Top of `<main>` to top of hero | inherited from `(site)/layout.tsx` `pt-8 md:pt-16` | inherited |
| Hero internal — title to tagline | `gap-4` (16px) | `gap-4` |
| Hero internal — tagline to meta row | `gap-6` (24px) | `gap-6` |
| Hero block bottom to MDX top | `mt-12` (48px) | `mt-16` (64px) |
| H2 to first paragraph | `mt-2` (8px) inside heading group | unchanged |
| Paragraph to next paragraph | `mt-4` (16px) | unchanged |
| Paragraph to Figure / Gallery / Callout / code block | `mt-8` (32px) | unchanged |
| Section H2 (Problem/Approach/Outcome) preceding spacing | `mt-12` (48px) | `mt-16` (64px) |
| MDX body bottom to hairline | `mt-16` (64px) | `mt-24` (96px) |
| Hairline to NextProjectBlock | `pt-12` (48px) | `pt-12` (48px) |
| NextProjectBlock bottom to footer | inherited from `(site)/layout.tsx` `pb-16 md:pb-24` | inherited |

---

## Hero Variants

Two hero variants — selected at render time by inspecting `hero.src`. **No fabricated placeholder image, no broken `<img>` tag.**

### Detection rule (locked)

```ts
const isPlaceholderHero = (src: string): boolean =>
  /\/images\/projects\/[^/]+\/hero-placeholder\.(png|jpe?g|webp)$/i.test(src)
```

- Match is **suffix-pattern** on the path. RSC-safe — no `fs.existsSync()`, no fetch, no missing-file probe.
- Match returns `true` for paths like `/images/projects/myco/hero-placeholder.png`, `/images/projects/trade-bot/hero-placeholder.jpg`, etc.
- Match returns `false` for any path that does not end in `hero-placeholder.{png|jpg|jpeg|webp}` — including real per-project artwork once it ships.

### Variant A: image-present hero

Triggered when `isPlaceholderHero(hero.src) === false`.

**Layout (md+):** 2-column grid, text left, image right.
**Layout (< md):** stacked — text on top, image below.
**Image rendering:** `<Image>` from `next/image` — never a raw `<img>`. Required props:
- `src={hero.src}`
- `alt={hero.alt}` (non-empty per schema)
- `priority` (above-the-fold — preload signal for LCP)
- `fill` with parent `relative aspect-[4/3]` OR explicit `width={1200} height={900}` (4:3 native aspect — locked for Phase 3 to avoid per-project layout drift; future per-project artwork crops to 4:3)
- `sizes="(min-width: 768px) 50vw, 100vw"` (lighthouse perf — image col is 50% on `md+`, 100% below)
- `className="rounded-none"` (no rounded corners — chrome discipline)

### Variant B: text-only hero (placeholder path detected)

Triggered when `isPlaceholderHero(hero.src) === true`. **Myco currently triggers this** because `content/projects/myco.mdx` ships with `hero.src: /images/projects/myco/hero-placeholder.png`.

**Layout (all breakpoints):** single column, text-only — no image col, no `<Image>` tag, no placeholder rectangle, no skeleton, no broken `<img>`. Just the typographic hero.

**Visual:**
- Hero title rendered at the **same display scale** as image-present variant — no upsizing, no special treatment. The page does not "compensate" for the missing image with bigger type.
- Tagline at body 16px, `--color-text-secondary`, line-height 1.6.
- Meta row (year + tags + repo/private label) rendered identically to Variant A.
- Below the meta row, **no extra spacer, no visible "image coming" copy, no placeholder rectangle.** The hero just ends; the MDX content begins after the standard `mt-12 md:mt-16` rhythm.

**Rationale:** Per CONTEXT.md, "the placeholder-hero text-only fallback is the visual instance of the content-honesty principle." A text-only hero is a deliberate editorial choice in 2026 portfolio convention (paco.me, brittanychiang.com both have text-led case-study openers); it is not a degraded experience.

---

## Privacy Rendering Contract

The `code private` label is the visible promise that the schema's privacy enforcement is shipping.

### Repo link (public projects)

- **Rendered when:** `project.links.repo` is defined (schema guarantees this is stripped for `visibility: 'private'`).
- **Markup:** `<a href={project.links.repo} target="_blank" rel="noopener noreferrer" class="...">repo <span aria-hidden="true">↗</span></a>`
- **Position:** Inline in the hero metadata row, **after** the tag chips, separated by `gap-3` (12px).
- **Typography:** Geist Mono, 14px (`--text-label`), medium (500), tracking `+0.02em`, lowercase. The literal string is `repo ↗` with the `↗` glyph rendered as a span with `aria-hidden="true"` (decorative — the word "repo" already conveys the destination).
- **Color (rest):** `--color-accent` (`#fbbf24`).
- **Color (hover/focus-visible):** `--color-accent-hover` (`#f59e0b`).
- **Underline:** none at rest. On hover, `text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 4px;`. Focus-visible: 2px outline (Phase 1 focus ring), no underline shift required (focus ring is the affordance).
- **Hit area:** padded via `py-2 -my-2` to extend hit box to ≥ 44×22px (combined with surrounding chip row's hit padding, full target ≥ 44×44px on the row).

### Private label (private projects)

- **Rendered when:** `project.visibility === 'private'` — i.e., when `project.links.repo` is `undefined` because the schema transform stripped it. Detection should be on `visibility`, not on `repo === undefined`, to keep intent explicit.
- **Markup:** `<span class="...">code private</span>` — **not a link, not a button, not interactive**. Plain text.
- **Position:** Same slot the repo link would have occupied — inline in the hero metadata row, after the tag chips, `gap-3` (12px) separation.
- **Typography:** Geist Mono, 14px, medium (500), tracking `+0.02em`, lowercase.
- **Color:** `--color-text-tertiary` (`#737373`). Deliberately **not accent** — accent communicates "click me", and this label intentionally does not invite a click.
- **String (locked):** literal `code private` (lowercase, no punctuation, two words). Not "🔒 private", not "Code Private", not "private repo", not "code is private". Exact string.
- **Decoration:** **no lock icon, no glyph, no badge background.** Per Phase 1 chrome discipline (no emoji in chrome) and the discipline that this label is content, not UI ornament. The text alone carries the meaning.
- **Accessibility:** no `aria-label`, no `title` tooltip — the visible text is sufficient for both sighted and screen-reader users. No `aria-hidden`.

### Verification clauses (for the executor + auditor)

The page must satisfy all three for a private project:

1. **No anchor element with the project's repo URL anywhere on the page.** A grep of the rendered HTML for `github.com/<expected-private-handle>` returns zero matches.
2. **The literal string `code private` appears exactly once** in the hero metadata row.
3. The `code-private` tag in the tag chip row (auto-added by the schema transform) **also renders as a chip** — this is independent of the `code private` label. Both are present. The chip is interactive (links to `/projects?tag=code-private`), the label is not.

---

## Component Inventory (Phase 3)

Each component declares: purpose, file location, RSC vs client boundary, props/slots, visual contract, states (where applicable), reduced-motion behavior.

### 1. `<ProjectHero />` — `components/projects/project-hero.tsx`

**Purpose:** Render the hero block at the top of the project detail page.
**Boundary:** RSC.
**Props:**
```ts
interface ProjectHeroProps {
  title: string                          // project.title
  tagline: string                        // project.tagline
  year: number                           // project.year
  tags: readonly Tag[]                   // project.tags
  visibility: 'public' | 'private'       // project.visibility
  repoUrl?: string                       // project.links.repo (undefined for private)
  hero: { src: string; alt: string }     // project.hero
}
```
**Composition:**
- Wraps `<header>` with grid layout (`md:grid md:grid-cols-12`).
- Internally instantiates `<ProjectMeta />` for the year + tag chips + repo/private label row.
- Internally checks `isPlaceholderHero(hero.src)` to pick Variant A vs Variant B.
- For Variant A, renders `next/image` directly (does not delegate to MDX `<Figure>` — the hero image is structurally distinct from MDX figures).
**States:** static — no hover/active/focus on the hero container itself.
**Reduced-motion:** N/A — no motion.

### 2. `<ProjectMeta />` — `components/projects/project-meta.tsx`

**Purpose:** The single inline metadata row beneath the tagline (year + tag chips + repo or private label).
**Boundary:** RSC.
**Props:**
```ts
interface ProjectMetaProps {
  year: number
  tags: readonly Tag[]
  visibility: 'public' | 'private'
  repoUrl?: string
}
```
**Composition:**
- `<div role="list" aria-label="Project metadata" className="flex flex-wrap items-center gap-3">`
- Year as `<time>` element (`<time dateTime={String(year)} className="font-mono text-label text-text-secondary">{year}</time>`) — semantic HTML.
- `<TagChipRow tags={tags} />` (separate component for testability).
- Conditional repo link OR `code private` label per Privacy Rendering Contract.
- All children sit on a single visual row on `md+`; wrap freely on mobile via `flex-wrap`.
**Spec details:**
- `gap-3` between elements (12px).
- Vertical alignment: `items-center` — tags + label baseline-align with year.
**States:** N/A on the wrapper. Children handle their own states.
**Reduced-motion:** N/A.

### 3. `<TagChipRow />` — `components/projects/tag-chip-row.tsx`

**Purpose:** Render the tag list as a row of interactive chips.
**Boundary:** RSC (no state — each chip is a plain `<a>`).
**Props:**
```ts
interface TagChipRowProps {
  tags: readonly Tag[]
}
```
**Per-chip markup:**
```html
<a href="/projects?tag={tag}"
   class="inline-flex items-center px-3 py-1.5 -my-2.5
          bg-surface-2 rounded-sm
          font-mono text-label font-medium tracking-wide lowercase
          text-text-secondary hover:text-text-primary
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
          transition-colors duration-fast">
  {tag}
</a>
```
**Visual:**
- Background: `--color-surface-2` (`#141414`) — first activation of surface-2.
- Text: `--color-text-secondary` rest, `--color-text-primary` hover.
- Radius: `--radius-sm` (2px).
- Padding: `px-3 py-1.5` visual (12px / 6px). Hit area extended to ≥ 44px tall via `-my-2.5`.
- Typography: 14px Geist Mono, weight 500, tracking +2%, lowercase.
**States:**
- Rest: surface-2 fill, text-secondary text.
- Hover: surface-2 fill (no fill change — chrome discipline), text-primary text. Transition on `color` only, 120ms linear.
- Focus-visible: 2px accent outline at 2px offset.
- Active (i.e., chip is being pressed): no separate state — fall back to focus-visible style.
- Visited: not styled — visited chips look identical to unvisited (chips link to filter destinations, not content destinations).
**`code-private` chip:** styled identically to other chips — no special highlight. The privacy signal is carried by the separate `code private` label, not by re-skinning the chip. (This intentionally avoids duplicating the privacy signal twice in the hero.)
**Reduced-motion:** color transition collapses to ~0ms; hover color still applies. No movement to suppress.

### 4. `<MDXProse />` — `components/mdx/prose.tsx` (or applied as a `className` on the prose wrapper inside the page)

**Purpose:** A semantic wrapper that applies the prose width measure (`max-w-[65ch]`), centers, and hosts the MDX render.
**Boundary:** RSC.
**Props:** `{ children: React.ReactNode }`.
**Markup:**
```html
<div class="mx-auto max-w-[65ch] mt-12 md:mt-16">
  {children}
</div>
```
**Decision (Claude's discretion per CONTEXT.md):** prefer a dedicated `<MDXProse>` component over inlining `max-w-[65ch]` on the page — keeps the prose constraint explicit, gives a single edit point if measure changes, and makes the page template visually structured. `<MDXProse>` does **not** wrap the hero or NextProjectBlock — those are full-container width.

### 5. `<Figure />` — `components/mdx/figure.tsx`

**Purpose:** MDX-callable component for content images with optional captions.
**Boundary:** RSC.
**Props:**
```ts
interface FigureProps {
  src: string                            // path under /public
  alt: string                            // required — schema-mirrored discipline
  caption?: string                       // optional, plain text (no markdown)
  wide?: boolean                         // opt-in: bleed past prose width to full container
  width?: number                         // optional override; default 1200
  height?: number                        // optional override; default proportional
}
```
**Markup:**
```html
<figure class={cn('my-8', wide ? 'mx-[calc((100%-100vw)/2+50%)] max-w-[calc(min(100vw,72rem)-2rem)]' : '')}>
  <Image src={src} alt={alt} width={width ?? 1200} height={height ?? 900}
         sizes={wide ? "(min-width: 768px) 1024px, 100vw" : "(min-width: 768px) 65ch, 100vw"} />
  {caption && (
    <figcaption class="mt-3 text-label text-text-secondary text-center">{caption}</figcaption>
  )}
</figure>
```
**Visual:**
- Default width: inherits prose `max-w-[65ch]` from the parent `<MDXProse>`.
- `wide` prop: bleeds out to the page container's `max-w-6xl` width.
- Image radius: `--radius-none` (no rounded corners on content imagery).
- Caption: 14px label, secondary text, centered. `mt-3` (12px) below image.
**States:** static — no hover, no zoom, no lightbox. (Lightbox is deferred to v2 — CNT2-03.)
**Accessibility:** `alt` required by TypeScript; non-empty by enforced convention. Figure → figcaption association is native semantic.
**Reduced-motion:** N/A.

### 6. `<Gallery />` — `components/mdx/gallery.tsx`

**Purpose:** MDX-callable component for 2-up or 3-up image grids.
**Boundary:** RSC.
**Props:**
```ts
interface GalleryProps {
  items: ReadonlyArray<{ src: string; alt: string; caption?: string }>
  columns?: 2 | 3                        // default 2
  wide?: boolean                         // opt-in: bleed past prose width
}
```
**Markup:**
```html
<div class={cn('my-8 grid gap-4 md:gap-6 lg:gap-8',
              columns === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2',
              wide ? 'mx-[calc((100%-100vw)/2+50%)] max-w-[calc(min(100vw,72rem)-2rem)]' : '')}>
  {items.map(item => (
    <figure>
      <Image src={item.src} alt={item.alt} ... />
      {item.caption && <figcaption ...>{item.caption}</figcaption>}
    </figure>
  ))}
</div>
```
**Visual:**
- Mobile: 1 column.
- `sm+`: 2 columns.
- `lg+`: 3 columns when `columns === 3`.
- Gap: `gap-4` mobile, `gap-6` `md+`, `gap-8` `lg+`.
- Each item: identical contract to `<Figure>` — `next/image`, no rounded corners, optional caption.
**States:** static — no hover treatment on the grid itself, no per-item hover, no lightbox.
**Accessibility:** Each item's `alt` is required by the prop type. Grid is a `<div>` (not a list) — gallery is decorative composition, not a list of equivalent items semantically; each item carries its own `<figure>`.
**Reduced-motion:** N/A.

### 7. `<Callout />` — `components/mdx/callout.tsx`

**Purpose:** MDX-callable component for inline emphasis blocks (asides, warnings, pulled quotes).
**Boundary:** RSC.
**Props:**
```ts
interface CalloutProps {
  variant?: 'note' | 'warn' | 'quote'    // default 'note'
  title?: string                         // optional inline-strong title
  children: React.ReactNode              // body content (paragraphs, lists)
  wide?: boolean                         // opt-in: bleed past prose
}
```
**Markup:**
```html
<aside class={cn('my-8 px-4 py-4 md:px-6 md:py-5 bg-surface-2 rounded-md border-l-4',
                variantBorderClass[variant],
                wide ? 'mx-[calc((100%-100vw)/2+50%)] max-w-[calc(min(100vw,72rem)-2rem)]' : '')}>
  {title && <p class="text-label font-medium text-text-primary mb-2 lowercase tracking-wide font-mono">{title}</p>}
  <div class="text-body text-text-secondary leading-relaxed [&>*+*]:mt-3">
    {children}
  </div>
</aside>
```
**Variants:**

| Variant | Left-border color | Use case |
|---------|-------------------|----------|
| `note` (default) | `--color-accent` (#fbbf24) | Side notes, contextual asides, aha-moments |
| `warn` | `--color-danger` (#f87171) | Cautions, things-to-watch-out-for |
| `quote` | `--color-text-tertiary` (#737373) | Pulled quotes, attributions — neutral border, body italicized |

**Visual rules:**
- Background: `--color-surface-2` for all variants. Variant is communicated **only** via the 4px left border color, **not** via background tint or icon.
- No icon, no glyph in any callout. Variant is signaled by border color and (optionally) by the `title` prop, not by decoration. Per Phase 1 discipline ("no emoji in chrome") + the rule that callouts carry content, not ornament.
- Padding: `px-4 py-4` mobile, `px-6 py-5` `md+`.
- Radius: `--radius-md` (6px).
- Body text spacing: `[&>*+*]:mt-3` — sibling paragraphs / lists inside the callout get 12px between.
- `quote` variant additionally applies `italic` to body text — sole italic usage in Phase 3.
**States:** static — no hover, no animation.
**Accessibility:** semantic `<aside>` element. No `role="alert"` (the warn variant is a content marker, not a runtime alert).
**Reduced-motion:** N/A.

### 8. `<CodeBlock />` — handled via `mdx-components.tsx` `pre` + `code` overrides + `rehype-pretty-code` + Shiki

**Purpose:** Render fenced MDX code blocks with build-time syntax highlighting.
**Boundary:** RSC. **Zero client JS** — Shiki tokenizes at build time, output is plain `<span>` with inline `style="color: ..."` attributes.
**Pipeline:**
- `next.config.ts` MDX `rehypePlugins` chain extends to: `[rehypeSlug, [rehypeAutolinkHeadings, { ... }], [rehypePrettyCode, { theme: 'vesper' }]]`.
- Theme: **`vesper`** (locked per CONTEXT.md). Vesper is a low-saturation dark Shiki theme that complements Geist Mono and reads as restrained / engineering, not as "Hollywood-typed code". Decision rationale: matches the editorial register; rejects high-saturation themes like `dracula` or `synthwave` that would conflict with the amber accent. (`github-dark-default` was the runner-up; vesper edges it for contrast against `--color-bg`.)
- Shiki version: `1.x` (per `research/STACK.md`).
- Theme packaging: use the bundled theme name `'vesper'` — bundle impact is minimal; Shiki tree-shakes unused themes when only one is referenced.

**`<pre>` wrapper styling:**
```html
<pre class="my-8 px-4 py-4 bg-surface-2 rounded-md
            overflow-x-auto text-body font-mono leading-relaxed
            [&>code]:grid [&>code]:gap-1
            border border-hairline">
  <code data-language="...">
    <span data-line>...</span>
    ...
  </code>
</pre>
```
**Visual:**
- Background: `--color-surface-2` (#141414) — same as callouts. Code is a content surface.
- 1px border `--color-hairline` — gives the block a containing edge against the dark page surface; deliberate over a wider surface tint that would over-emphasize the block.
- Radius: `--radius-md` (6px).
- Padding: `px-4 py-4` (16px / 16px).
- Font: Geist Mono, 16px (`--text-body`), regular (400). Code reads at body size — not down-sized to 14px, which is a common 2024-era tic that hurts readability.
- Line height: `leading-relaxed` (1.625) — slightly more open than body 1.6 for code scanability.
- Horizontal overflow: `overflow-x-auto` with browser-default scrollbar styling. **Do not** customize the scrollbar in Phase 3 — custom scrollbars on code blocks are a template-y ornament. Long lines scroll horizontally; the block does not wrap.
- Tokens (Shiki/Vesper): rendered as inline `<span style="color: #...">`. The Vesper palette ships with appropriate dark-theme contrast — no override needed. Spot-check during the Phase 3 audit that the brightest token color hits AA against `--color-surface-2` (~16:1 already on `#f5f5f5`-class tokens; Vesper sits in the same range).

**Inline code (`<code>` not inside `<pre>`):**
```html
<code class="px-1.5 py-0.5 mx-0.5
             bg-surface-2 rounded-sm
             font-mono text-[0.9375em]
             text-text-primary">{children}</code>
```
- Background: `--color-surface-2` pill.
- Radius: `--radius-sm` (2px).
- Font: Geist Mono, slightly down-sized to `0.9375em` (15px in body context) — inline code at full body size optically over-weights surrounding prose; 15px is the calibrated middle.
- Color: `--color-text-primary` — no syntax tinting on inline code.
- Padding: `px-1.5 py-0.5` (6px / 2px).

**Optional filename label:**
- `rehype-pretty-code` supports `meta` syntax (e.g., `\`\`\`ts {filename="lib/projects.ts"}`).
- When `filename` is present, render a small label cap **above** the `<pre>` (separate `<div>` immediately preceding):
  ```html
  <div class="mt-8 -mb-px px-4 py-2 bg-surface-2 rounded-t-md border border-hairline border-b-0
              font-mono text-label text-text-secondary">
    {filename}
  </div>
  <pre class="!mt-0 !rounded-t-none">...</pre>
  ```
- Label color: `--color-text-secondary` (not tertiary — see Color section verified-pairings note about 14px on surface-2).

**No copy button in Phase 3.** A copy button would require a client component for clipboard access; Phase 3 ships zero client JS for code blocks. Copy-button is deferred (post-launch, if user feedback surfaces it).

**States:** static — no hover, no focus on the block itself.
**Reduced-motion:** N/A.

### 9. `<NextProjectBlock />` — `components/projects/next-project-block.tsx`

**Purpose:** End-of-page navigation to the next project — keeps the visitor moving.
**Boundary:** Mostly RSC; the hover `translateX(4px)` requires a client island for `motion/react` `<m.*>`. The link itself is rendered by RSC; the `<m.*>` wrapper is a tiny client component (per Phase 1 motion-island pattern).
**Props:**
```ts
interface NextProjectBlockProps {
  next: { slug: string; title: string; tagline: string } | null
  // null when the algorithm exhausts options (single-project case)
}
```
**Algorithm (locked per CONTEXT.md):**
1. Call `getRelatedProjects(currentSlug, 1)`.
2. If returned array length === 1, use that project.
3. Else (zero overlap, OR single-project corpus, OR target slug not found): fall back — sort `getAll()` by `order` ascending; find `currentSlug`'s index; pick `(index + 1) % all.length`. This wraps the last project to the first (cyclic).
4. If `getAll().length === 1` (only the current project exists, true for Phase 3 with Myco-only): set `next` to a sentinel that links to `/projects` instead of a project. The component renders a one-line variant (see "Single-project case" below).

**Markup (multi-project case):**
```html
<nav aria-label="Next project" class="border-t border-hairline mt-16 md:mt-24 pt-12">
  <a href="/projects/{next.slug}" class="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
    <span class="font-mono text-label text-text-tertiary tracking-wide lowercase">next →</span>
    <m.h2 class="mt-2 text-h2 md:text-display font-semibold tracking-tight text-text-primary
                 group-hover:underline group-hover:decoration-accent group-hover:underline-offset-4
                 group-focus-visible:underline group-focus-visible:decoration-accent group-focus-visible:underline-offset-4"
          whileHover={{ x: 4 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}>
      {next.title}
    </m.h2>
    <p class="mt-3 text-body text-text-secondary max-w-[65ch]">{next.tagline}</p>
  </a>
</nav>
```

**Single-project case (Myco-only — Phase 3 ships in this state):**
```html
<nav aria-label="Browse all projects" class="border-t border-hairline mt-16 md:mt-24 pt-12">
  <a href="/projects" class="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
    <span class="font-mono text-label text-text-tertiary tracking-wide lowercase">all projects →</span>
    <m.h2 class="mt-2 text-h2 md:text-display font-semibold tracking-tight text-text-primary
                 group-hover:underline group-hover:decoration-accent group-hover:underline-offset-4 ..."
          whileHover={{ x: 4 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}>
      Browse all projects
    </m.h2>
    <p class="mt-3 text-body text-text-secondary max-w-[65ch]">More work, including private case studies and secondary projects.</p>
  </a>
</nav>
```
**Important:** the `/projects` index does not exist until Phase 4. The link target works statically; in Phase 3, clicking it triggers the custom 404 from Phase 1. **This is acceptable** — it ships the affordance whole and the 404 surface itself is tested (Phase 1). Phase 4 fills in the destination without changing this contract.

**Visual:**
- Hairline `border-t` divider above (1px `--color-hairline`) at `mt-16 md:mt-24`.
- `pt-12` (48px) vertical padding to the eyebrow text.
- Eyebrow: `next →` (or `all projects →` for the single-project case) — Geist Mono, 14px, weight 500, tracking +2%, lowercase, `--color-text-tertiary`.
- Title: H2 size on mobile (24px) → display size on `md+` (32–48px clamp). Geist Sans, weight 600 (semibold), `tracking-tight` (-0.015em), `--color-text-primary`.
- Tagline: body 16px, `--color-text-secondary`, line-height 1.6, capped at `max-w-[65ch]` (don't let the tagline run the full container width).
- Spacing inside: `mt-2` from eyebrow to title, `mt-3` from title to tagline.
**States:**
- Rest: no underline, title at `translateX(0)`.
- Hover (whole link via `group:hover`): underline appears under title in `--color-accent`, offset 4px; title `translateX(4px)`. Animation: 220ms `--motion-ease-standard`.
- Focus-visible (whole link via `group:focus-visible`): same underline as hover **plus** the 2px accent outline at `outline-offset: 4px` (slightly farther than the standard 2px because the link contains a large title — 4px reads better at this scale).
- Active (pressed): inherits hover state.
**Reduced-motion:** `<m.h2>` `whileHover={{ x: 4 }}` is suppressed by `MotionConfig reducedMotion="user"` → title stays at `translateX(0)`. The hover-underline (CSS-driven) **still appears** because the CSS `@media (prefers-reduced-motion: reduce)` floor only collapses transition durations; the `:hover` pseudo-class still applies the underline. Affordance preserved.

### 10. `<RelatedProjectFallback />` — internal helper, not exported as a separate component

**Purpose:** This is the algorithm wrapping `getRelatedProjects` to derive the `next` prop for `<NextProjectBlock />`. It lives inline in the page file (`app/(site)/projects/[slug]/page.tsx`) or in a tiny `lib/next-project.ts` helper — Claude's discretion, but no separate React component.

```ts
import { getAll, getProject, getRelatedProjects } from '@/lib/projects'

export function getNextProject(currentSlug: string):
  | { slug: string; title: string; tagline: string }
  | null {
  const related = getRelatedProjects(currentSlug, 1)
  if (related.length === 1 && related[0]) {
    const p = related[0]
    return { slug: p.slug, title: p.title, tagline: p.tagline }
  }
  const all = getAll()
  if (all.length <= 1) return null   // single-project case → triggers "all projects" variant
  const idx = all.findIndex(p => p.slug === currentSlug)
  if (idx === -1) return null
  const nextIdx = (idx + 1) % all.length
  const next = all[nextIdx]!
  return { slug: next.slug, title: next.title, tagline: next.tagline }
}
```

**Tested separately** (not part of UI inventory; the planner should add a `tests/projects/next-project.test.ts` covering: top-overlap returned, fallback to cyclic, single-project returns null).

### 11. Heading anchor (rehype-autolink-headings configuration)

**Purpose:** Each MDX H2 / H3 has a fragment-link `#` next to it that becomes visible on hover/focus, in `--color-text-tertiary` rest, `--color-accent` hover.
**Implementation:** `rehype-autolink-headings` with `behavior: 'append'` and a custom `content` node that emits `<span aria-hidden="true">#</span>`. The wrapping anchor is `<a href="#{slug}" class="anchor">`.
**Styling (in `globals.css` or via Tailwind utilities applied to the prose container):**
```css
.prose h2 .anchor,
.prose h3 .anchor {
  @apply ml-2 inline-block opacity-0 text-text-tertiary font-mono no-underline;
  transition: opacity var(--motion-duration-base) var(--motion-ease-standard),
              color var(--motion-duration-fast) linear;
}
.prose h2:hover .anchor,
.prose h3:hover .anchor,
.prose .anchor:focus-visible {
  @apply opacity-100;
}
.prose .anchor:hover,
.prose .anchor:focus-visible {
  @apply text-accent;
}
```
**Reduced-motion:** opacity transition collapses to ~0ms via Phase 1's CSS floor; the anchor still appears on hover/focus. **Optional override:** for users with reduced motion, declare the anchor permanently visible (`.anchor { opacity: 1; }` inside `@media (prefers-reduced-motion: reduce)`) — this preserves the affordance without requiring a hover event. **Recommended.**
**Accessibility:** anchor has `aria-label="Link to {heading text}"` (set via `rehype-autolink-headings` `properties` option). The `#` glyph itself is `aria-hidden="true"`.

### Component map (mdx-components.tsx registration)

```ts
// mdx-components.tsx — Phase 3 extension
import type { MDXComponents } from 'mdx/types'
import { Figure } from '@/components/mdx/figure'
import { Gallery } from '@/components/mdx/gallery'
import { Callout } from '@/components/mdx/callout'

const components: MDXComponents = {
  Figure,
  Gallery,
  Callout,
  // h2 / h3 / pre / code / inline-code: styled via Tailwind in app/globals.css `.prose` class.
  // No JSX overrides needed — rehype plugins handle slug/anchor/syntax tokenization at build time.
}

export function useMDXComponents(): MDXComponents {
  return components
}
```

**Decision (Claude's discretion per CONTEXT.md):** put `Figure`, `Gallery`, `Callout` in separate files under `components/mdx/`. Keeps each component independently testable, keeps file sizes small, and keeps the `mdx-components.tsx` registration block tidy (3 named imports). Co-locating in `components/mdx/index.tsx` is the alternative; either is acceptable but separate files match the existing project discipline (`components/site/*` are separate files per component).

---

## Per-Page Metadata Contract

Every project detail route ships a unique `<title>`, `<meta description>`, and OG image. Implementation: `generateMetadata` in `app/(site)/projects/[slug]/page.tsx`.

### `generateMetadata` shape (locked)

```ts
import type { Metadata } from 'next'
import { getProject } from '@/lib/projects'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) return {}        // 404 path — Next will use root metadata fallback

  const isPlaceholderHero = /\/images\/projects\/[^/]+\/hero-placeholder\.(png|jpe?g|webp)$/i.test(project.hero.src)
  const ogImage = project.ogImage
    ?? (!isPlaceholderHero ? project.hero.src : '/og-default.png')

  return {
    title: project.title,                                          // resolves via root titleTemplate to "{title} — olivelliott.dev"
    description: project.description ?? project.tagline,           // schema makes description required (max 160), but defensive `?? tagline`
    openGraph: {
      title: project.title,
      description: project.description ?? project.tagline,
      url: `/projects/${project.slug}`,
      type: 'article',
      images: [{ url: ogImage, width: 1200, height: 630, alt: project.hero.alt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description ?? project.tagline,
      images: [ogImage],
    },
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
  }
}
```

### OG image precedence (locked)

| Order | Source | Used when |
|-------|--------|-----------|
| 1 | `project.ogImage` (frontmatter optional field) | Author has explicitly set a per-project OG. Wins always when set. |
| 2 | `project.hero.src` | When `ogImage` is unset **and** `hero.src` is **not** the placeholder pattern (i.e., real per-project artwork exists). |
| 3 | `/og-default.png` (site default) | When `ogImage` is unset **and** `hero.src` is the placeholder pattern. **Myco currently triggers this fallback** because its hero is the placeholder. |

**The site-default OG (`/og-default.png`) is the responsibility of Phase 1 or Phase 6 to author.** Phase 3 only references the path; if the file does not exist at Phase 3 ship time, the OG meta tag still renders pointing at `/og-default.png`, and the unfurler will show a broken image — **flag this in the Phase 3 plan as a dependency** so a Phase 6 task or stub creates `/og-default.png` before any Phase 3 page is shared publicly.

### Title fallback chain

The schema (`lib/schemas.ts`) declares `title` as required (non-empty). No fallback chain is needed — `project.title` is always present. The root layout's `titleTemplate` (already declared in Phase 1's `app/layout.tsx`) wraps it with the site name, producing e.g. `Myco — olivelliott.dev`.

### Description fallback chain

1. `project.description` (schema-required, max 160 chars).
2. `project.tagline` (schema-required, max 140 chars).

Defensive `??` in case description is ever loosened to optional in a future schema revision.

### Twitter card

`summary_large_image` reusing the OG image. `twitter:creator` omitted in Phase 3 — no Twitter handle is declared in PROJECT.md (carried forward from CONTEXT.md). If a handle is added later, fold it into root metadata, not per-page.

### `metadataBase`

Inherits from Phase 1's root layout `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://olivelliott.dev')`. Phase 3 does NOT set `metadataBase` — verify during plan-phase that the Phase 1 implementation actually shipped this (per CONTEXT.md: "verify during plan-phase").

### Canonical URLs

`alternates.canonical = /projects/${project.slug}` — relative path resolved against `metadataBase`. Yields `https://olivelliott.dev/projects/myco`.

---

## Routing & Static Generation

Inherits the route structure declared in CONTEXT.md, restated here for the executor:

- **File:** `app/(site)/projects/[slug]/page.tsx`
- **`export const dynamicParams = false`** — only known slugs render at build time; unknown slugs 404 immediately, no runtime dynamic rendering.
- **`generateStaticParams()`:**
  ```ts
  export function generateStaticParams() {
    return getAll().map(p => ({ slug: p.slug }))
  }
  ```
- **Page body:**
  ```ts
  export default async function ProjectPage({ params }: PageProps) {
    const { slug } = await params
    const project = getProject(slug)
    if (!project) notFound()                  // matches Phase 2 semantics
    // render <article> with <ProjectHero> + <MDXProse>{mdxContent}</MDXProse> + <NextProjectBlock>
  }
  ```
- **MDX rendering path:** the page imports the MDX file directly (`import MycoContent from '@/content/projects/myco.mdx'`) OR uses a generic dynamic import keyed on slug. Decision: dynamic import is cleaner and scales to N projects without N hard-coded imports. Pattern:
  ```ts
  const MDXBody = (await import(`@/content/projects/${slug}.mdx`)).default
  ```
- **Confirmed:** the Myco MDX (`content/projects/myco.mdx`) renders unmodified. The template adapts to the MDX, never the reverse.

---

## Copywriting Contract

All Phase 3 strings the implementer must use **verbatim**. Where a string is dynamic (per-project content), the schema field is named.

### Static / locked strings

| Element | Copy | Notes |
|---------|------|-------|
| Hero metadata: repo link text | `repo` (with decorative `↗` glyph) | Lowercase, no punctuation. Glyph is `aria-hidden="true"`. |
| Hero metadata: private label | `code private` | Lowercase, two words, no punctuation. Locked exact string. |
| NextProjectBlock eyebrow (multi-project case) | `next →` | Lowercase, with literal `→` glyph. |
| NextProjectBlock eyebrow (single-project case) | `all projects →` | Lowercase, with literal `→` glyph. |
| NextProjectBlock title (single-project case) | `Browse all projects` | Sentence case — slight register shift to signal this is a wayfinding fallback, not a project title. |
| NextProjectBlock tagline (single-project case) | `More work, including private case studies and secondary projects.` | Sentence case, single sentence. Honest — names what's coming. |
| Heading anchor `aria-label` template | `Link to {heading text}` | Sentence case. Set via rehype-autolink-headings `properties` option. |
| Tag chip `aria-label` template | (none — visible text suffices) | Tag chips have no `aria-label`. The chip's text content (e.g., "local-first") is the label. |
| Repo link (no `aria-label`) | (none — visible text "repo" suffices) | Repo link has no `aria-label`. The text "repo" + the `aria-hidden="true"` glyph is sufficient for both sighted and screen-reader users. |
| Code block: filename label | (whatever the author writes in the MDX `meta`) | Verbatim from `\`\`\`ts {filename="lib/projects.ts"}` syntax. |

### Dynamic strings (sourced from `Project` type)

| Element | Source field | Constraints |
|---------|--------------|-------------|
| Hero `<h1>` | `project.title` | Schema: required, non-empty. |
| Hero tagline | `project.tagline` | Schema: max 140 chars. |
| Hero year | `project.year` | Schema: 2000–2100 integer. |
| Tag chips | `project.tags` | Schema: `Tag` enum from `lib/tags.ts`; min 1 tag. |
| Repo URL | `project.links.repo` | Schema: optional URL; absent for private (transform-stripped). |
| MDX body | `content/projects/{slug}.mdx` (gray-matter-stripped body) | Schema validates frontmatter; body is rendered verbatim. |
| NextProjectBlock title (multi-project) | `next.title` | Per-project source. |
| NextProjectBlock tagline (multi-project) | `next.tagline` | Per-project source. |
| Meta `<title>` | `project.title` (wrapped by root titleTemplate) | Resolves to e.g. `Myco — olivelliott.dev`. |
| Meta description | `project.description ?? project.tagline` | Schema: description max 160, tagline max 140. |
| OG image alt | `project.hero.alt` | Schema: required, non-empty. |

### Banned words (carried forward from Phase 1, enforced in any Phase 3 author-controllable copy)

*passionate, award-winning, scalable solutions, cutting-edge, 10x, crafted, seamless, leveraging, synergy, rockstar, ninja.* The `code private` label, the `next →` eyebrow, and the single-project fallback strings have been hand-checked.

### Empty state

Phase 3 has effectively no empty states — every project has guaranteed content (frontmatter is schema-validated; body is at minimum a file). The closest analog is the **single-project NextProjectBlock variant** documented above, which is its own first-class affordance (not an empty state placeholder).

### Error state

The only error surface in Phase 3 is the **404 page** when a visitor hits an unknown slug. `dynamicParams = false` ensures unknown slugs hit Phase 1's custom 404 (`app/not-found.tsx`) — no per-page error UI in Phase 3. Copy is already locked by Phase 1: `404 / not found — that route doesn't exist yet. / → back home`.

### Destructive actions

**None in Phase 3.** Pages are read-only. No delete, no disable, no cancel UX. Field reserved.

### Primary CTA

Phase 3 has **no primary CTA in the conventional sense.** The page's job is to be read end-to-end. The closest thing to a CTA is the NextProjectBlock — a wayfinding link, not a conversion event. Per Phase 1's discipline ("Phase 4's home page will introduce a primary CTA once there is something to CTA toward"), Phase 3 inherits the no-CTA stance.

---

## Accessibility Contract

Every Phase 3 component conforms to the WCAG AA baseline declared in PROJECT.md. The Phase 6 audit (axe-core + manual keyboard pass) validates this.

### Semantic HTML

| Element | Tag | Notes |
|---------|-----|-------|
| Project page root | `<article>` | One `<article>` per project page; semantically a self-contained content unit. |
| Hero | `<header>` (inside `<article>`) | Article-scoped header. Allowed nesting per HTML5 spec. |
| Hero title | `<h1>` | One H1 per page, only on the hero. MDX H1s are forbidden by content convention (Myco MDX starts at H2 — verified). |
| MDX section headings | `<h2>` (Problem / Approach / Outcome) | Auto-anchored via rehype-slug → `id="problem"`, `id="approach"`, `id="outcome"`. |
| MDX subsection headings | `<h3>` | Same anchor treatment. |
| Hero metadata row | `<div role="list" aria-label="Project metadata">` | List role chosen so screen readers can summarize "list of N items". Each child can be a list item or a span — both work; `<a>` chips and the `<time>` and the repo link don't need explicit `role="listitem"` if the parent's `role="list"` is the only semantic anchor. |
| Year | `<time dateTime={String(year)}>{year}</time>` | Native semantic for dates. |
| Tag chips | `<a href="/projects?tag=X">` | Native anchors — keyboard-default behavior. |
| Repo link | `<a href={repoUrl} target="_blank" rel="noopener noreferrer">` | Decorative `↗` is `aria-hidden="true"`. |
| Private label | `<span>` | Plain text, no role. |
| Hero image | `<Image alt={hero.alt}>` from `next/image` | `alt` required and non-empty per schema (zod `.min(1)`). |
| Figure | `<figure>` + `<figcaption>` | Native HTML5 semantics. |
| Gallery | `<div>` containing N `<figure>` | Not a `<ul>` — gallery items are figures, not list-equivalent items. |
| Callout | `<aside>` | Article-scoped aside. |
| Code block | `<pre><code>` | No `role`, no `aria-label`. The visible filename label (when present) is sufficient. |
| Heading anchor | `<a class="anchor" href="#{slug}" aria-label="Link to {heading text}">` | Wraps a `<span aria-hidden="true">#</span>`. |
| NextProjectBlock | `<nav aria-label="Next project">` (or `aria-label="Browse all projects"` in single-project variant) | Distinct landmark from the site `<nav>` in the header — different `aria-label` keeps screen-reader landmark menus unambiguous. |

### Keyboard navigation tab order (project detail page)

Inherits the Phase 1 site shell tab order (1–6) for the nav, then within `<main>`:

7. (After hero — hero contains no interactive elements until the metadata row.)
8. Tag chip 1 (e.g., `local-first`).
9. Tag chip 2 (e.g., `autonomous`).
10. ... (each tag chip in order).
11. Repo link OR (skipped if private — the `code private` label is not focusable).
12. (Inside MDX body — focusable elements in document order:)
13. Each H2 anchor `#` (focusable via Tab — anchor is `<a>`).
14. Each MDX inline `<a>` link.
15. Each H3 anchor `#`.
16. ... (inline links continue in document order).
17. NextProjectBlock link (the whole block is one focusable anchor, not separate sub-anchors — eyebrow + title + tagline all live inside the same `<a>`).
18. Footer (inherited Phase 1 — GitHub, Email, LinkedIn, view source).

**Assertions:**
- Every focusable element shows a 2px solid `--color-accent` outline at `outline-offset: 2px` (inherits Phase 1; NextProjectBlock uses `outline-offset: 4px` per its component spec).
- `Tab` advances forward, `Shift+Tab` reverses, `Enter` activates anchors. Default browser behavior — no JavaScript interception.
- Skip-link target is `#main` (inherited Phase 1) — keyboard user can bypass nav directly into the article.
- The hero anchor `#` glyph is focusable (it's an `<a>`) and shows the focus ring even though its background opacity is 0 at rest. The focus ring is the affordance.

### Reduced motion

Inherits Phase 1's CSS floor + MotionConfig provider. Phase 3 specifics:
- `<NextProjectBlock>` — `whileHover={{ x: 4 }}` is suppressed (title stays at translateX(0)). Underline still appears on hover via CSS `:hover` (preserved affordance).
- Heading anchor `#` glyph — opacity transition collapses; anchor still appears on hover. **Recommended override:** declare `.anchor { opacity: 1 }` inside `@media (prefers-reduced-motion: reduce)` so the anchor is permanently visible (preserves affordance without requiring a hover event).
- All other Phase 3 transitions (color shifts on chips, repo link, inline `<a>`) collapse to ~0ms; hover/focus state colors still apply.

### Contrast (FND-07 inherited)

Every color pair declared in the Color section was verified above. Implementation assertion: the Phase 6 audit re-runs axe-core + a contrast tool on the deployed `/projects/myco` page; zero violations required.

### Screen reader assertions

- Page landmarks: `<header>` (site nav, inherited), `<main id="main">` (inherited), `<article>` (Phase 3 page root), `<nav aria-label="Next project">` (Phase 3 next block), `<footer>` (inherited).
- Skip-link target is `#main` — keyboard user can bypass nav.
- All decorative glyphs (`↗`, `→`, `#`) are `aria-hidden="true"`.
- All actionable images use the schema-required non-empty `alt`. No decorative images in Phase 3.

### No-JS fallback

The Phase 3 page content (hero text, MDX body, code block tokens, NextProjectBlock title and link) must be present in the SSR'd HTML — verifiable via `curl https://<vercel-url>/projects/myco | grep '<h1>Myco</h1>'`. The only JS Phase 3 ships is:
- Phase 1's MotionProvider (already client; tiny).
- The NextProjectBlock client island for the `whileHover` translateX (tiny).

Without JS, the page renders fully. The NextProjectBlock title still hovers-to-show-underline (CSS), but does not translateX — graceful degradation.

---

## Responsive Contract

| Breakpoint | Layout behavior |
|------------|-----------------|
| `< 640px` (mobile) | Hero: single column (text → image stacked, OR text-only when placeholder hero). Tag chips wrap freely. Gallery: 1-up. Callouts / code blocks / figures: full prose width (which is full container width on mobile, since `65ch` exceeds the mobile container). NextProjectBlock: stacked, title at H2 size (24px). |
| `sm` (640px–768px) | Gallery may go 2-up (author-controlled). Otherwise unchanged from mobile. |
| `md` (768px–1024px) | **Hero shifts to 2-column** (50/50 grid, text left, image right). Gallery 2-up default. NextProjectBlock title stays at H2 size on mobile/tablet. |
| `lg` (1024px+) | Hero text gets slightly more weight (7-col text, 5-col image). Gallery may go 3-up. NextProjectBlock title scales to display ramp. Page gutter: 48px. |
| `xl` (1280px+) | No further layout change — page caps at `max-w-6xl`. |

**Touch targets on mobile:** every Phase 3 interactive element meets ≥ 44×44px hit area.
- Tag chips: `-my-2.5` extends hit area to 44px tall.
- Repo link: `-my-2` extends hit area; combined with the metadata row's `gap-3` and the line-height, ≥ 44px tall.
- Heading anchor `#`: focusable; hit area is the anchor's invisible 44×44px padding extension (apply `py-2 -my-2` to the `.anchor` class, OR rely on the heading's full row being clickable above the anchor — recommended: keep the anchor a small target since it's a power-user affordance, but ensure it's at least 32×32 visually + invisible padding to 44).
- NextProjectBlock: the entire block is one anchor — far exceeds 44×44px.
- MDX inline links: rendered at 16px body — already meet 44px combined with paragraph line-height 1.6 (16 × 1.6 = 25.6px tall × text width); on mobile, this is acceptable per WCAG 2.5.5 because inline links inside running text are an exception to the 44×44 rule.

---

## Anti-Patterns (explicit list — Phase 3 MUST NOT ship)

Carried forward from PROJECT.md, `research/FEATURES.md`, `research/PITFALLS.md`, and Phase 1's UI-SPEC. Re-asserted here so the checker, planner, executor, and auditor all see the explicit list.

**Visual:**
- ❌ Glassmorphism cards (`backdrop-blur` on hero, callouts, code blocks).
- ❌ Gradient blobs / radial-gradient orbs as background decoration.
- ❌ `bg-gradient-*` backgrounds anywhere.
- ❌ Gradient text (e.g. `bg-clip-text bg-gradient-to-r`).
- ❌ `box-shadow` on surfaces (callouts, code blocks, hero — all use `--color-surface-2` fill + optional hairline border for depth instead).
- ❌ Border-gradient.
- ❌ Rounded chrome — hero corners, NextProjectBlock corners, page-level boxes are all `--radius-none`.
- ❌ Decorative gradient lines / striped borders.
- ❌ Skill bars, percentage indicators, "X% proficiency" UI.
- ❌ Tech-logo cloud / marquee.
- ❌ Testimonial carousel.
- ❌ Bento-grid hero or anywhere on the page.

**Motion:**
- ❌ Stagger-on-scroll for any element (H2s, paragraphs, figures, gallery items, callouts, code blocks — all render immediately).
- ❌ Fade-in on scroll for any first-viewport element (hero text appears immediately).
- ❌ Hover-bounce / hover-scale on Figure, Gallery, code blocks (no `transform: scale()` anywhere in Phase 3).
- ❌ Decorative cursor effects (custom cursor, particle trail, magnetic hover).
- ❌ Auto-play motion of any kind (no marquees, no looping animations, no scroll-driven reveals).
- ❌ Transform animations on anchored content above-the-fold.
- ❌ Lottie default. (No Lottie at all in Phase 3 — none was specified, none is permitted.)
- ❌ R3F / 3D / WebGL hero treatments (no react-three-fiber, no Three.js).
- ❌ Per-section view-transitions (View Transitions API is deferred to v2 per VTX-01).

**Iconography:**
- ❌ Emoji in chrome (hero label, callout title, NextProjectBlock eyebrow).
- ❌ Lock icon next to `code private` label. Text-only.
- ❌ Tag chip icons (chips are text-only).
- ❌ Decorative icons inside callouts (variant is signaled by border color, not by an info/warning/quote glyph).

**Color:**
- ❌ Indigo / violet / purple tokens (banned in Phase 1, carried forward).
- ❌ Accent applied to text inside callouts, code blocks, figure captions, NextProjectBlock title at rest, tag chip labels, code-private label.
- ❌ Multiple accents in v1 (per-project accent deferred to v2 — CNT2-02).
- ❌ Background fill in accent color.

**Layout:**
- ❌ Sticky header on scroll (inherited Phase 1 — header is static).
- ❌ Hide-on-scroll header.
- ❌ Floating CTA, floating share buttons, floating reading-progress bar.
- ❌ Reading-time estimate badge (deferred per CONTEXT.md).
- ❌ Comments / reactions / share counters (out of scope per PROJECT.md).
- ❌ "Related projects" 3-up grid (Phase 3 ships exactly one next-project link, not a grid).
- ❌ Inline tweet embeds, YouTube embeds, CodePen embeds (none required by Myco MDX; if they appear in future case studies, escalate via UI-SPEC revision before adding).

**Code blocks:**
- ❌ Custom scrollbar styling (no `::-webkit-scrollbar`).
- ❌ Code-block copy button in Phase 3 (deferred — no client JS for copy in Phase 3).
- ❌ Line-number gutter (Vesper theme renders without; not adding in Phase 3).
- ❌ Theme toggle (single Vesper theme, no light/dark code theme switch).
- ❌ Animated typing / "code reveals as you scroll" effects.

**SEO / metadata:**
- ❌ Auto-generated boilerplate descriptions (description must come from frontmatter, not from "first paragraph of body").
- ❌ Inflated OG metadata (no fabricated metric in `og:description`; honesty rule applies).
- ❌ JSON-LD structured data (deferred — Phase 6 may add `Article` schema; Phase 3 does not).

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | **none in Phase 3.** Component inventory (Hero, Meta, TagChipRow, MDXProse, Figure, Gallery, Callout, CodeBlock, NextProjectBlock, anchor heading) is entirely hand-authored. | not required — `components.json` deliberately absent (Phase 1 decision carried forward) |
| Third-party registries | **none permitted in v1** | N/A — re-asserted from Phase 1; no Aceternity, no magic-ui, no 21st.dev. If a third-party block is ever proposed, the UI-SPEC for that phase must document `npx shadcn view` evidence with timestamp. |

**Phase 3 has zero registry blocks.** Every component above is hand-authored against:
- Tailwind v4 utilities + tokens declared in `styles/tokens.css`.
- `next/image` for images (Phase 1 dependency).
- `motion/react` `<m.*>` form for the single client-island in `<NextProjectBlock>` (Phase 1 dependency, `LazyMotion strict`).
- `rehype-pretty-code` + `shiki@1.x` + `rehype-slug` + `rehype-autolink-headings` for build-time MDX transforms — not registry components, build-pipeline plugins. No client JS surface from any of these.

This keeps the surface area minimal and avoids the registry risk surface entirely.

---

## Design Tokens: Phase 3 additions to `styles/tokens.css`

Phase 1 declared the full token set; the executor extends only what is missing. The Phase 3 plan task should add the following to the existing `@theme` block — **append, do not edit** existing tokens.

```css
/* Phase 3 additions to @theme block */

/* Type scale — H2 + H3 + semibold weight */
--text-h2: 1.5rem;
--text-h2--line-height: 1.3;
--text-h3: 1.25rem;
--text-h3--line-height: 1.4;
--font-weight-semibold: 600;

/* Note: no new color, motion, spacing, or radius tokens.
 * --color-surface-2, --radius-sm, --radius-md, --radius-lg are already declared
 * (reserved by Phase 1) — Phase 3 just activates --color-surface-2, --radius-sm,
 * and --radius-md. --radius-lg remains reserved for Phase 4 project cards. */
```

**Justification for new tokens:** Phase 1's UI-SPEC explicitly anticipated this expansion ("Phase 3 MAY introduce 600 for MDX H2/H3 headings; that's a Phase 3 decision, not a Phase 1 one"). H2 and H3 sizes are required by long-form MDX rendering and were not declared in Phase 1 because no MDX existed yet. Both additions sit on the same scale family (Geist Sans, semibold, slight negative tracking) as the existing display token — they extend the system, they do not contradict it.

---

## Phase 3 Deliverable Checklist (for gsd-planner / gsd-executor)

Components / files the plan must create or extend:

**Tokens:**
- [ ] `styles/tokens.css` — append H2 / H3 / semibold weight (5 lines, additive only)
- [ ] `app/globals.css` — declare `.prose` class with `max-w-[65ch]` measure, body line-height, heading rhythm, anchor `#` opacity behavior, inline-code pill styling

**Page:**
- [ ] `app/(site)/projects/[slug]/page.tsx` — RSC page with `dynamicParams = false`, `generateStaticParams`, `generateMetadata`, dynamic MDX import, render of `<ProjectHero>` + `<MDXProse>{<MDXBody />}</MDXProse>` + `<NextProjectBlock>`

**Hero & meta components:**
- [ ] `components/projects/project-hero.tsx` — RSC; image-present vs text-only branching via `isPlaceholderHero`
- [ ] `components/projects/project-meta.tsx` — RSC; year + tag-chip-row + repo/private label
- [ ] `components/projects/tag-chip-row.tsx` — RSC; mono lowercase chips with hit-area extension

**MDX components:**
- [ ] `components/mdx/prose.tsx` — RSC wrapper (or inline; Claude's discretion)
- [ ] `components/mdx/figure.tsx` — RSC; `next/image` + optional caption + `wide` prop
- [ ] `components/mdx/gallery.tsx` — RSC; 2-up / 3-up grid + `wide` prop
- [ ] `components/mdx/callout.tsx` — RSC; `note` / `warn` / `quote` variants via left-border color
- [ ] `mdx-components.tsx` — extend stub to register Figure, Gallery, Callout

**Next project navigation:**
- [ ] `components/projects/next-project-block.tsx` — mostly RSC; `<m.h2>` client island for translateX hover
- [ ] `lib/next-project.ts` — `getNextProject(slug)` algorithm helper (or inline in page)

**MDX pipeline:**
- [ ] `next.config.ts` — extend `rehypePlugins` with `rehype-pretty-code` (theme: `vesper`), `rehype-slug`, `rehype-autolink-headings`
- [ ] `package.json` — add `rehype-pretty-code`, `shiki`, `rehype-slug`, `rehype-autolink-headings` as runtime dependencies

**Tests (recommended per CONTEXT.md Claude's discretion):**
- [ ] `tests/projects/page.test.tsx` — RSC render of `/projects/myco` smoke test
- [ ] `tests/projects/next-project.test.ts` — algorithm covering top-overlap, cyclic fallback, single-project null, missing-slug null
- [ ] `tests/projects/hero-fallback.test.ts` — `isPlaceholderHero` regex match cases
- [ ] `tests/mdx/components.test.tsx` — Figure / Gallery / Callout render-shape tests

**Public assets (declared dependencies — flag in plan):**
- [ ] `/public/og-default.png` — site-default OG image (1200×630). If not yet authored at Phase 1 / Phase 6, stub with a typographic placeholder so Phase 3 unfurls do not break.

---

## Checker Sign-Off

- [ ] Dimension 1 Copywriting: PASS (banned-word list applied; `code private` / `next →` / `repo` / single-project fallback strings locked verbatim; honest-placeholder register preserved)
- [ ] Dimension 2 Visuals: PASS (no gradients, no glassmorphism, no shadows, no rounded chrome on hero / NextProjectBlock; rounded radius limited to content surfaces — callouts, code blocks, chips, inline code; all motion gated by reduced-motion)
- [ ] Dimension 3 Color: PASS (60 / 30 / 10 split preserved; `--color-surface-2` activated; explicit reserved-for list; AA + AAA pairings verified for every Phase 3 combo)
- [ ] Dimension 4 Typography: PASS (3 sizes from Phase 1 + 2 new — H2, H3 — with semibold weight added per Phase 1's anticipated expansion; Geist Sans/Mono only; tracking specified for every role)
- [ ] Dimension 5 Spacing: PASS (4px base inherited; every Phase 3 measure on the 4-point grid; touch-target exceptions documented for chips, repo link, anchor)
- [ ] Dimension 6 Registry Safety: PASS (no registries used in Phase 3; third-party registries forbidden in v1; explicit zero-registry-blocks count)

**Approval:** pending — awaiting gsd-ui-checker.
