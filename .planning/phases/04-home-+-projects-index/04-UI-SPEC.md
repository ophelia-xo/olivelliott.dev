---
phase: 4
slug: home-projects-index
status: draft
shadcn_initialized: false
preset: none
created: 2026-05-16
inherits_from:
  - .planning/phases/01-foundation/01-UI-SPEC.md
  - .planning/phases/03-project-detail-template/03-UI-SPEC.md
---

# Phase 4 — Home + Projects Index: UI Design Contract

> Visual and interaction contract for `/` (home) and `/projects` (index). Ships the thesis hero, the type-set thesis motion island (the v1 motion budget's one earned moment), hero-tier + secondary-tier ProjectCard variants, the URL-synced server-side TagFilterRow, the tier separator, and the empty-filter state. Tokens (color, type, motion, spacing base, radii) are inherited from Phase 1's UI-SPEC and the Phase 3 H2/H3/semibold expansion. **No tokens are re-declared or contradicted here.**

**Reference aesthetic:** [wallofportfolios.in](https://www.wallofportfolios.in/?company=All) — dark, minimalist, strong typographic rhythm. Curated grid of project/person cards with restrained hover interactions.

**Explicit aesthetic prohibitions** (re-asserted for Phase 4, sourced from `research/FEATURES.md` + `research/PITFALLS.md` + HOM-04):

no bento grid, no stagger-on-scroll, no glassmorphism, no `backdrop-blur`, no gradient blobs, no `from-*-500 to-*-500` gradients, no `box-shadow` on cards, no radial-gradient orbs, no AI-template hero treatments (glow / parallax avatars / orbit dots), no skill bars, no testimonial carousels, no marquee tech-logo strips, no Lottie, no R3F / 3D heroes, no auto-play motion, no cursor-reactive hero detail (deferred), no scale/lift/shadow card-hover, no scroll-tied entrance reveals, no metric inflation. The home page hero spends the **one** v1 motion budget beyond CSS transitions; everything else stays editorial.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | none (hand-assembled; tokens locked in Phase 1, expanded in Phase 3) |
| Preset | not applicable — `components.json` deliberately absent through v1 |
| Component library | none for chrome. `radix-ui` not required by Phase 4 (no Dialog / Tooltip / DropdownMenu surfaces); chips and cards are plain `<a>` elements |
| Icon library | `lucide-react` — Phase 4 uses **zero icons**. The `→` and `×` glyphs in copy are literal characters, not icons. (Footer icons from Phase 1 stay; Phase 4 introduces none.) |
| Font | Geist Sans (display, body, H2/H3, card titles) and Geist Mono (wordmark, eyebrows, tag chips, year, `code private` label, section labels, clear-filter affordance). Same `next/font/local` source as Phase 1. No new font face. |

**Registry strategy (carried forward):** No new registries permitted in v1. Phase 4 ships zero registry-pulled components. Every component below is hand-authored against Phase 1 + Phase 3 primitives.

---

## Spacing Scale

Inherits Phase 1's 4px base (`--spacing: 0.25rem`). Every Phase 4 layout value is a multiple of 4. **Phase 4 declares zero new spacing tokens** — all values reference existing ones.

| Token | Value | Tailwind utility | Usage in Phase 4 |
|-------|-------|------------------|-------------------|
| `--space-1` | 4px | `gap-1` | Per-word inter-character optical adjustments inside the type-set motion island (none currently needed; reserved) |
| `--space-2` | 8px | `gap-2` / `p-2` | Tag chip vertical padding (inherits Phase 3 chip baseline); per-card eyebrow → title gap on /projects index |
| `--space-3` | 12px | `gap-3` / `px-3` | Tag chip horizontal padding; meta-row internal gaps; filter-row clear-button left margin |
| `--space-4` | 16px | `gap-4` | Card internal — title → tagline gap; tagline → meta-row gap (secondary card); inline `× clear filter` left gap |
| `--space-6` | 24px | `gap-6` / `p-6` | Hero internal — wordmark → role-frame gap; role-frame → thesis gap; tier-separator vertical padding; card internal padding (mobile) |
| `--space-8` | 32px | `gap-8` / `p-8` | Hero block bottom margin → `selected work` eyebrow; secondary card grid gap (md+); hero card internal padding (md+); filter-row → cards-grid gap |
| `--space-12` | 48px | `py-12` / `gap-12` | Hero card vertical padding (md+); thesis paragraph bottom margin (mobile); section divider rhythm before `secondary` tier separator |
| `--space-16` | 64px | `py-16` / `mt-16` | Vertical rhythm — hero block → first project card (mobile); thesis bottom margin (md+); index page heading → filter row (mobile) |
| `--space-24` | 96px | `py-24` / `mt-24` | Vertical rhythm — hero block → first project card (desktop); index page heading → filter row (desktop) |

**Exceptions for Phase 4:**

- **Card hit area = whole card.** Each `<ProjectCardHero>` and `<ProjectCardSecondary>` is wrapped in a single `<a href="/projects/{slug}">` so the entire card is the click target. No internal links compete (tag chips inside the card are presentational here — see Tag chips inside cards rule below). Hit area is therefore the card's full bounding box and trivially > 44×44px on both axes.
- **Tag chips inside cards are presentational, not links.** To avoid nested-anchor invalidity and competing focus targets, chips rendered inside a `<ProjectCardHero>` / `<ProjectCardSecondary>` are rendered as `<span>` elements (not `<a>`), reusing the same chip visual treatment from Phase 3's `TagChipRow`. The interactive `TagChipRow` (chips as `<a>`) remains in use on the project detail page meta row (Phase 3) and on the `/projects` filter row (new component `TagFilterRow`). The card chip variant is therefore a presentational sibling, not a contradiction.
- **`× clear filter` hit area.** The clear-filter `<a>` uses `px-3 py-2 -my-2` (12px / 8px outer with -my-2 row-collapse, identical to the Phase 3 chip-row trick). Combined with the surrounding filter row's `py-2` baseline, total target ≥ 44×44px while the visual chip row stays at ~36px height.
- **Tier separator vertical padding.** `pt-12 pb-6` on desktop, `pt-12 pb-4` on mobile — the separator gets more breathing room above (it's marking a section break) than below (the label leads directly into the next card group). Both axes are multiples of 4.
- **Empty-filter state vertical rhythm.** `py-12` (48px) above and below the inline message — same rhythm as a missing card section, so the page does not appear shorter when filtered to zero results.
- **Focus ring offset:** `2px` — kept off the 4-point grid deliberately (inherits Phase 1's rationale).

### Container + Layout (inherits Phase 1)

| Property | Value | Notes |
|----------|-------|-------|
| Page max-width | `72rem` (1152px) | `max-w-6xl` — site shell from Phase 1 |
| Page gutter (mobile, < 640px) | 24px (`px-6`) | unchanged |
| Page gutter (tablet, 640–1024px) | 32px (`px-8`) | unchanged |
| Page gutter (desktop, ≥ 1024px) | 48px (`px-12`) | unchanged |
| **Home hero text measure** | `max-w-[55ch]` | Tighter than Phase 3's prose `max-w-[65ch]` — the thesis is one paragraph, not long-form; a tighter measure reads as headline-adjacent rather than essay-body |
| **Empty-filter inline message measure** | `max-w-[55ch]` | Same rationale as hero — single sentence, headline-adjacent |
| Hero card width | full container (`max-w-6xl`) | Hero card spans full editorial width on every breakpoint |
| Secondary card width | container / grid columns (see Page Composition) | 1-up mobile, 2-up md+, 3-up lg+ |
| Filter row width | full container (`max-w-6xl`), wraps freely | Chips wrap when overflowing on mobile |

### Breakpoints (inherit Phase 1 — Tailwind v4 defaults)

| Name | Min width | Phase 4 layout effect |
|------|-----------|------------------------|
| `< 640px` | — | Hero stack: vertical. Hero card: single column (image stacks below text when present). Secondary cards: 1-up grid. Filter row: chips wrap. Tier separator: visible if both tiers have results. |
| `sm` | 640px | No layout change; chip wrapping behavior unchanged. |
| `md` | 768px | **Hero card 2-column** (text left, image right) when image is present — mirrors Phase 3 hero treatment. **Secondary cards: 2-up grid.** Filter row width unchanged. |
| `lg` | 1024px | **Secondary cards: 3-up grid.** Hero card text col stays 7/12, image col 5/12 (matches Phase 3). |
| `xl` | 1280px | No further layout change — page caps at `max-w-6xl`. |

---

## Typography

**Phase 4 declares zero new type roles.** Every typographic value below references the locked Phase 1 + Phase 3 ramp.

**Families: unchanged.** Geist Sans for display, body, card titles (H2, H3). Geist Mono for wordmark, eyebrows (`selected work`, `all projects`, `secondary`, `hero` per-card label, `next →` if used), year on cards, tag chips, `code private` label, `× clear filter` text.

### Type roles used in Phase 4 (no additions)

| Role | Size (rem / px) | Weight | Line height | Tracking | Family | Used for |
|------|-----------------|--------|-------------|----------|--------|----------|
| **Body** | `1rem` / 16px | 400 | 1.6 | 0 | Geist Sans | Thesis paragraph, role frame, card taglines, card outcome bullets (hero card), empty-filter inline message |
| **Label** | `0.875rem` / 14px | 500 | 1.4 | `+0.02em` | Geist Mono | Wordmark, all eyebrows (`selected work`, `all projects`, `secondary`, `hero`), year on cards, tag chips, `code private` label, `× clear filter` |
| **H3** | `1.25rem` / 20px | 600 | 1.4 | `-0.01em` | Geist Sans | Secondary-tier card title (home + index) |
| **H2** | `1.5rem` / 24px → `1.75rem` / 28px (`md+`) | 600 | 1.3 | `-0.015em` | Geist Sans | Hero-tier card title (home) |
| **Display** | `clamp(2rem, 5vw, 3rem)` / 32–48px | 500 | 1.15 | `-0.02em` | Geist Sans | Home page wordmark (`olive elliott`), `/projects` page heading (`all projects` rendered at display scale + Geist Mono — see locked override below) |

**Display override for `/projects` heading.** The `/projects` page H1 (`all projects`) is rendered at display scale BUT in Geist Mono (not Geist Sans), at weight 500, tracking `+0.02em` (not `-0.02em`). This is a deliberate one-off: the home page hero is the page that gets the display-sans treatment; the index page asserts its role as a utility surface through display-mono. Pattern parallel: the 404 page uses display-mono on `404` for the same reason. No new token introduced — the page just composes existing tokens differently.

**Hero wordmark on home.** `olive elliott` is rendered at display scale, Geist Sans, medium (500), tracking `-0.02em`, lowercase. This **replaces** the Phase 1 placeholder display headline `olivelliott.dev`. The wordmark in the nav (Phase 1's `<WordMark />` — Geist Mono, 14px) is unchanged. Two wordmarks coexist by design — one in chrome (label scale, mono) and one in hero (display scale, sans). The pairing is editorial, not a duplication.

### Typography expansion — same lineage as Phase 3

Phase 3's `03-UI-SPEC.md` § Typography pre-authorized the H2/H3 + semibold (600) expansion as a bounded escalation of Phase 1's ceiling. Phase 4 reuses those same roles without further expansion. The 5-size / 3-weight count is identical to Phase 3 (Body 16, Label 14, H3 20, H2 24/28, Display 32–48 @ weights 400/500/600). **No new size or weight roles are introduced in Phase 4** — this remains the milestone ceiling.

### Text rendering

Inherited from Phase 1's `html` rules — antialiased, `optimizeLegibility`, `font-feature-settings: "ss01", "cv11"`, tabular-nums on `time` / `.meta` / mono text. No additions.

---

## Color

**Phase 4 adds zero new color tokens.** Every color used is already declared in `styles/tokens.css`. Phase 4 introduces one **new contextual usage** of an existing token: `--color-accent` as a *background fill* on the active filter chip (with `--color-text-on-accent` foreground, which is exactly the pairing Phase 1 reserved this token for and which has been unused through Phases 1–3). The 60 / 30 / 10 split is preserved.

### Semantic tokens used in Phase 4

| Role | Token | Value | Phase 4 usage |
|------|-------|-------|---------------|
| **Dominant (60%)** | `--color-bg` | `#0a0a0a` | Page background. Card background at rest (cards are flush with the page; their differentiation is hairline border + spacing, not surface elevation). Hero block background. Filter row background. |
| **Secondary (30%)** | `--color-surface-2` | `#141414` | Tag chip background (inherits Phase 3 chip treatment) — for both presentational chips inside cards AND inactive filter chips on `/projects`. **Not used as card background** — cards stay on `--color-bg` for editorial weight; chips are the only surface-2 surfaces on Phase 4 pages. |
| | `--color-hairline` | `#1f1f1f` | Card border at rest (1px on all four sides). Tier separator hairline. Divider between hero block and project grid section on home. Divider between filter row and cards grid on `/projects`. |
| **Accent (10%)** | `--color-accent` | `#fbbf24` (amber-400) | **NEW Phase 4 usage:** Active filter chip background fill (the one accent-as-fill activation in v1). Card title underline on hover/focus (color of the underline, never of the title text itself). Focus ring on every interactive element (inherits Phase 1). |
| | `--color-accent-hover` | `#f59e0b` (amber-500) | Active filter chip background on hover (1-shade warmer to signal interactivity is still there even when chip is active). |
| **Destructive** | `--color-danger` | `#f87171` (red-400) | **Not used.** No destructive actions in Phase 4 (no delete, no disable, no cancel — pages are read-only browse surfaces). |

### Text tokens (inherit Phase 1 tiers — every Phase 4 pairing audited)

| Token | Value | Phase 4 usage |
|-------|-------|---------------|
| `--color-text-primary` | `#f5f5f5` | Wordmark (home hero display), thesis paragraph, role frame, card titles (hero + secondary), filter-chip hover text, hero card outcome bullets |
| `--color-text-secondary` | `#a3a3a3` | Card tagline (hero + secondary), filter chip text at rest, empty-filter inline message, year on card meta row, hero card outcome bullet markers (the `→` glyph prefix) |
| `--color-text-tertiary` | `#737373` | Section eyebrows (`selected work`, `all projects`, `secondary`, `hero` per-card label), `code private` label on card meta row |
| `--color-text-on-accent` | `#0a0a0a` | **Activated for the first time in v1.** Foreground on the active filter chip (text on `--color-accent` background). Contrast against `--color-accent`: 11.8:1 — AAA normal + large. |

### Verified pairings (extends Phase 1 + Phase 3 — every Phase 4 pairing audited)

| Foreground | Background | Ratio | Passes |
|------------|------------|-------|--------|
| `--color-text-primary` (#f5f5f5) | `--color-bg` (#0a0a0a) | 18.4:1 | AAA — wordmark, thesis, card titles |
| `--color-text-secondary` (#a3a3a3) | `--color-bg` (#0a0a0a) | 8.4:1 | AAA — card taglines, year, empty-state message |
| `--color-text-tertiary` (#737373) | `--color-bg` (#0a0a0a) | 4.8:1 | AA normal, AAA large — eyebrows, `code private` label |
| `--color-text-secondary` (#a3a3a3) | `--color-surface-2` (#141414) | 7.3:1 | AAA — inactive filter chip text, presentational chip text inside cards (at rest) |
| `--color-text-primary` (#f5f5f5) | `--color-surface-2` (#141414) | 16.0:1 | AAA — filter chip on hover (text shifts primary while bg stays surface-2) |
| `--color-text-on-accent` (#0a0a0a) | `--color-accent` (#fbbf24) | 11.8:1 | AAA — active filter chip (text on accent fill) |
| `--color-text-on-accent` (#0a0a0a) | `--color-accent-hover` (#f59e0b) | 9.7:1 | AAA — active filter chip on hover |
| `--color-hairline` (#1f1f1f) | `--color-bg` (#0a0a0a) | 1.3:1 | N/A — decorative, never carries text |
| `--color-text-tertiary` (#737373) | `--color-bg` on hovered card (border lifts to `--color-text-tertiary`) | 4.8:1 | AA — card border in hover state (the border itself; decorative, but contrast against bg matters for visibility) |

### Accent reserved-for list (Phase 4 — extends Phase 1 + Phase 3 lists)

The accent color is **only** applied to the following Phase 4 elements:

1. **Active filter chip background fill** on `/projects` (the one new accent-as-fill usage in v1; with `--color-text-on-accent` foreground).
2. **Card title underline** on hover/focus — `text-decoration-color: var(--color-accent)`, `text-underline-offset: 4px`, applied to the H2 (hero card) and H3 (secondary card) title text. The title text color itself stays `--color-text-primary` — accent appears only in the underline.
3. **Focus ring** on every interactive element (inherits Phase 1: `outline: 2px solid var(--color-accent); outline-offset: 2px`). Each card's outer `<a>` and each filter chip's `<a>` and the `× clear filter` link all receive this ring.

The accent is **explicitly not** used in Phase 4 for:

- Card title text color in any state (titles stay `--color-text-primary`; accent appears only in the hover underline).
- Card border in any state (border lifts from `--color-hairline` to `--color-text-tertiary` on hover, never to accent — discipline signal matching footer-icon and tag-chip rules).
- Tag chip text in any state when the chip is **presentational inside a card** (stays `--color-text-secondary` at rest; no hover state, no accent shift — chips inside cards are not interactive on Phase 4 cards, hover is owned by the card's `<a>` wrapper).
- The `× clear filter` link text (uses `--color-text-secondary` at rest, `--color-text-primary` on hover — matches footer-icon discipline).
- Eyebrow labels (`selected work`, `all projects`, `secondary`, `hero`) — all stay `--color-text-tertiary`.
- The `code private` label on card meta rows (stays `--color-text-tertiary`, matching Phase 3 detail-page rule — accent would over-emphasize a non-action).
- Hero block background, card backgrounds, page background — no accent fills anywhere except the single active filter chip case above.

### Gradients, shadows, glassmorphism

**Forbidden in Phase 4** — same rule as Phases 1 + 3. No `bg-gradient-*`, no `backdrop-blur`, no `box-shadow` on cards or chrome, no `border-gradient`, no radial-gradient orbs. Card depth is achieved via 1px hairline border + spacing rhythm + the hover-lift of the border to `--color-text-tertiary` — never via shadow, blur, scale, or glow.

---

## Motion

Phase 4 adds **zero new motion tokens.** Phase 4 **activates `--motion-duration-slow` (420ms)** for the first time — this token has been declared in `tokens.css` since Phase 1 with the explicit reservation comment *"Phase 4 hero moment only"*. Activation here is the planned escalation, not a new design decision.

### Phase 4 motion inventory (every animated element listed)

| Element | Property | Duration | Ease | Reduced-motion behavior |
|---------|----------|----------|------|--------------------------|
| **Type-set thesis entrance** (the one earned motion moment — HOM-05) | `opacity` 0 → 1 per word, sequenced left-to-right | total ~600ms across the paragraph using `--motion-duration-slow` budget (per-word fade ~120ms, ~30ms inter-word delay → see Type-Set Motion Contract below) | `--motion-ease-standard` | **Paragraph renders instantly at opacity 1** as a single block. No staggered fade, no visible animation. SSR text remains visible throughout (no flash-of-invisible-text — see SSR fallback below). |
| Card border lift (hero + secondary) | `border-color` `--color-hairline` → `--color-text-tertiary` on card-`<a>` hover/focus-visible | `--motion-duration-base` (220ms) | `linear` (color only — instant feedback) | Color shift collapses to ~0ms via Phase 1's `@media (prefers-reduced-motion: reduce)` floor; hover state still readable. |
| Card title underline (hero + secondary) | `text-decoration-color` `transparent` → `--color-accent` + `text-underline-offset` 2px → 4px on card-`<a>` hover/focus-visible | `--motion-duration-base` (220ms) | `--motion-ease-standard` | Underline appears instantly (no transition); offset stays at 4px. Affordance preserved. |
| Filter chip (inactive) text color | `color` `--color-text-secondary` → `--color-text-primary` on chip hover | `--motion-duration-fast` (120ms) | `linear` | Same as Phase 3 tag chip — color shift collapses, hover color still applies. |
| Filter chip (active) background color | `background-color` `--color-accent` → `--color-accent-hover` on chip hover | `--motion-duration-fast` (120ms) | `linear` | Color shift collapses; hover state still readable. |
| `× clear filter` link text color | `color` `--color-text-secondary` → `--color-text-primary` on link hover | `--motion-duration-fast` (120ms) | `linear` | Color shift collapses. |
| Every other element (eyebrows, hero block, hero card image, tier separator, empty state, page chrome) | **No motion.** Static. | — | — | — |

### Reduced-motion implementation

- The type-set thesis entrance is the only element using `motion/react`. It lives in the `<ThesisParagraph>` client island and uses `<m.*>` (not `<motion.*>`) per Phase 1's `LazyMotion strict`. `MotionConfig reducedMotion="user"` from Phase 1's provider suppresses `animate` automatically when the OS gate is on, but **the component must also have an SSR fallback that renders the paragraph as a single, non-segmented `<p>` element at opacity 1** so that:
  1. Visitors with reduced-motion enabled see the paragraph immediately as one block (no per-word DOM segmentation showing through).
  2. Visitors without JS see the paragraph immediately (no flash-of-invisible-text).
  3. The motion island's hydration replaces the SSR `<p>` with the per-word `<m.span>` segments only when motion is permitted.
- All other Phase 4 motion is plain CSS `transition` — caught by Phase 1's `@media (prefers-reduced-motion: reduce)` floor in `app/globals.css`.
- The type-set entrance runs on the home page above the fold; it MUST NOT cause CLS. Implementation guard: the SSR-rendered paragraph and the post-hydration segmented paragraph occupy identical layout dimensions (same `<p>` container, same `max-w-[55ch]`, same font-size / line-height — only the inner spans differ). The motion is opacity-only per word; no transforms, no width animation.

### Type-Set Motion Contract (the single earned motion moment)

**Component:** `<ThesisParagraph>` (`'use client'` — the only client island introduced by Phase 4 on the home page).

**Inputs:** `{ text: string }` — the plain thesis paragraph string.

**Render strategy:**

1. **SSR pass (always):** Render the text as a single `<p className="...">{text}</p>` — full opacity 1, identical typography to the post-hydration state. This is what visitors with reduced-motion, no-JS, or pre-hydration see.
2. **Client hydration (when reduced-motion is OFF):** Replace the static `<p>` content with per-word `<m.span>` segments. Split on the regex `/(\s+)/` so whitespace tokens are preserved as their own segments (whitespace segments render at opacity 1 immediately — no fade on whitespace; fade only on word segments). Apply per-word `initial={{ opacity: 0 }}`, `animate={{ opacity: 1 }}`, with a sequenced `delay` based on word index.
3. **Reduced-motion gate (MotionConfig handles it):** With `reducedMotion="user"` from the Phase 1 provider, `animate` resolves to the final state instantly; the per-word fade collapses. The segmented DOM still mounts (no harm — the spans are inline and read identically to a single `<p>`), but no animation runs.

**Timing budget:**

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Per-word fade duration | 180ms | Long enough to read as deliberate, short enough that no individual word feels lagged |
| Inter-word delay | 30ms | Words begin sequentially; at ~12-word target paragraph this yields ~360ms of total stagger overlap + 180ms of final-word fade = ~540ms paragraph completion. Comfortably inside the `--motion-duration-slow` (420ms) budget for the *visual cadence*, with the full sequence completing within ~600ms (Phase 1 reservation language permits this — `--motion-duration-slow` is the per-element ceiling; sequenced delays compose). |
| Ease (per word) | `cubic-bezier(0.22, 1, 0.36, 1)` via `--motion-ease-standard` | One curve, inherited |
| Total sequence cap | ≤ 700ms from hydration to fully-rendered | Hard ceiling — if the paragraph would exceed this, shorten inter-word delay (not per-word duration). |
| Word count handling | Linear delays (`delay = wordIndex × 30ms`) | No exponential / staggered easing on the schedule itself — keeps the rhythm even and the math obvious in tests. |

**What the type-set motion is NOT:**

- **Not character-by-character (typewriter).** Per-word, not per-letter. Per-letter reads as gimmick/template.
- **Not transform-based.** Opacity only. No `y: 8 → 0`, no `scale`, no `x` jitter. Transforms above the fold cause CLS (Phase 1 anti-pattern, re-asserted).
- **Not infinite / looping / cursor-blinking.** Plays once on mount, then static forever.
- **Not scroll-triggered.** Fires on hydration. No `whileInView`, no IntersectionObserver, no scroll-tied easing.
- **Not deferred behind a user gesture.** No "click to animate". Plays automatically on first paint (motion-allowed visitors) or skipped entirely (reduced-motion visitors).
- **Not echoed elsewhere.** This is the ONLY type-set element in v1. The role frame above and the eyebrow labels render statically. The `/projects` page heading renders statically. No other "this paragraph fades in" pattern anywhere on the site.

**Cursor / cursor-reactive effects:** Explicitly out of scope per CONTEXT.md § Deferred Ideas. No custom cursor, no cursor-following dot, no hover-reactive logo. The type-set thesis is the entire motion budget.

### Motion anti-patterns (carried forward from Phase 1 + Phase 3, re-asserted for Phase 4)

- **No transform animations on first-viewport elements.** The type-set thesis is opacity-only per word, no transforms. Cards below the fold may not animate on entry either — they render statically.
- **No stagger-on-scroll** (anti-feature HOM-04). Cards do not fade-in / slide-up on scroll. The grid renders all cards at once on SSR.
- **No layout animation.** Cards, filter chips, tier separator, and empty state do not animate in/out; they exist when SSR'd and stay there. URL-driven filter changes are server navigations — they render a new HTML page, they do not animate the existing list.
- **No `dynamic(ssr: false)` wrapping** on `<ThesisParagraph>` — it hydrates normally with the SSR fallback in place.
- **No `<motion.div>`** — `LazyMotion strict` from Phase 1 enforces `<m.*>`. `<ThesisParagraph>` uses `<m.span>` per word.
- **No `whileHover` on cards** — cards already use CSS `transition` on border-color + text-decoration. Adding Motion `whileHover` would mount a motion component on every card and overshoot the v1 motion budget. Cards are CSS-only.

---

## Border Radii

| Token | Value | Phase 4 usage |
|-------|-------|---------------|
| `--radius-none` | 0 | Hero block, hero wordmark, hero image (`<Image>` inside hero card), card outer corners, tier separator hairline, all chrome — **all zero radius.** Editorial / architectural read continues from Phases 1 + 3. |
| `--radius-sm` | 2px | Tag chips (presentational inside cards AND filter chips on `/projects`) — inherits Phase 3 tag chip treatment. |
| `--radius-md` | 6px | Reserved — unused in Phase 4. (Activated in Phase 3 for code blocks + callouts only.) |
| `--radius-lg` | 12px | **Reserved — unused in Phase 4 by deliberate decision.** Phase 1 originally noted "future use: project cards (Phase 4)". Phase 4 *rejects* this — cards stay zero-radius for editorial weight matching the wallofportfolios.in reference. Rounded cards read as SaaS. If a future v2 phase wants rounded card chrome, it must revisit this decision in its own UI-SPEC. |

---

## Page Composition

### Home — `/` document outline (top to bottom)

```
<main id="main">                                          [site shell layout, Phase 1]
  <section id="hero" aria-labelledby="hero-wordmark">      [Hero block — RSC]
    <h1 id="hero-wordmark" class="display">                [olive elliott — display, Geist Sans, 500, -0.02em, lowercase]
      olive elliott
    </h1>
    <p class="body text-secondary role-frame">             [Role frame — one short sentence, static, no motion]
      engineer · autonomous workflows · local-first systems
    </p>
    <ThesisParagraph text="..." />                         [client island — type-set entrance, SSR fallback inside]
  </section>

  <hr class="hairline" aria-hidden="true" />               [1px --color-hairline divider]

  <section id="hero-tier-projects" aria-labelledby="hero-eyebrow">
    <p id="hero-eyebrow" class="eyebrow">selected work</p> [GeistMono 14px, --color-text-tertiary, lowercase]
    <div class="hero-card-stack">                          [vertical stack, gap-12 md+ / gap-8 mobile]
      <ProjectCardHero project={myco} />
      <ProjectCardHero project={fathom} />
      <ProjectCardHero project={agendaKeeper} />
    </div>
  </section>

  <section id="secondary-tier-projects" aria-labelledby="secondary-eyebrow">
    [Only rendered if getAll() returns any secondary-tier projects after the hero tier]
    [In Phase 4 dev state, secondary projects are not yet authored — section conditionally absent]
    [In Phase 7 (real content pass), section appears with: Trade Bot, Stemz, Aktiga, etc.]
    <p id="secondary-eyebrow" class="eyebrow">more work</p>
    <div class="secondary-card-grid">                      [1-up mobile, 2-up md+, 3-up lg+; gap-8]
      <ProjectCardSecondary project={...} />
      ...
    </div>
  </section>
</main>
```

### `/projects` index document outline (top to bottom)

```
<main id="main">                                          [site shell layout, Phase 1]
  <header>
    <h1 class="display-mono">all projects</h1>            [display scale, Geist Mono, 500, +0.02em, lowercase — see Typography override]
  </header>

  <nav aria-label="Filter projects by tag">                [TagFilterRow — RSC, all chips are <a>]
    <ul role="list" class="filter-chip-row">
      <li><a href="/projects?tag=local-first" class="chip [active|inactive]">local-first <span class="chip-count">3</span></a></li>
      <li><a href="/projects?tag=autonomous" class="chip [active|inactive]">autonomous <span class="chip-count">2</span></a></li>
      ... (all tags from getAllTags(), in count-desc-then-alpha order)
    </ul>
    [If searchParams.tag is present:]
    <a href="/projects" class="clear-filter">× clear filter</a>
  </nav>

  [Branching on filter state — three cases:]

  [Case A: no filter — getAll() result]
  <section aria-labelledby="hero-eyebrow-index">
    <p id="hero-eyebrow-index" class="eyebrow">hero</p>    [Tier separator label — see TierSeparator]
    <div class="card-grid">
      <ProjectCardSecondary project={...} hero />          [hero=true prop renders the "hero" mono-prefix label above title]
      ... (hero-tier projects in order)
    </div>
  </section>
  <hr class="tier-separator" />
  <section aria-labelledby="secondary-eyebrow-index">
    <p id="secondary-eyebrow-index" class="eyebrow">secondary</p>
    <div class="card-grid">
      <ProjectCardSecondary project={...} />                [no hero prefix label]
      ... (secondary-tier projects in order)
    </div>
  </section>

  [Case B: filter active, results exist — getProjectsByTag(tag) result]
  [Same as Case A but tier sections are conditional on having results within that tier.]
  [If hero tier has zero matches: hide the "hero" tier section AND the separator.]
  [If secondary tier has zero matches: hide the "secondary" tier section AND the separator.]
  [If both tiers have matches: render both sections with separator between (same as Case A).]

  [Case C: filter active, zero results — getProjectsByTag(tag) returns []]
  <EmptyFilterState tag={searchParams.tag} />              [inline message + clear link]
</main>
```

### Width discipline

| Element | Width |
|---------|-------|
| Page container | `max-w-6xl mx-auto px-6 md:px-8 lg:px-12` (inherited from `(site)/layout.tsx`) |
| Home hero block | full container — `<h1>` and role-frame and thesis all share `max-w-[55ch]` measure inside the container |
| Hero divider hairline | full container width |
| Hero card | full container width (one per row, vertical stack) |
| Hero card text col | `md+`: 7/12 cols (text gets slightly more weight than image — Phase 3 hero-grid convention reused) |
| Hero card image col | `md+`: 5/12 cols, image present case only |
| Secondary card grid | full container width, internal CSS grid (1/2/3-up by breakpoint) |
| Filter row | full container width, chips wrap freely |
| Tier separator hairline | full container width |
| Empty-filter inline message | `max-w-[55ch] mx-auto` — centered inside the page container, headline-adjacent measure |

### Vertical rhythm

| Boundary | Mobile | Desktop |
|----------|--------|---------|
| Top of `<main>` to hero wordmark | inherited from `(site)/layout.tsx` `pt-8 md:pt-16` | inherited |
| Wordmark → role frame | `mt-4` (16px) | `mt-4` |
| Role frame → thesis paragraph | `mt-6` (24px) | `mt-6` |
| Thesis paragraph → hero divider hairline | `mt-12` (48px) | `mt-16` (64px) |
| Hero divider → `selected work` eyebrow | `mt-12` (48px) | `mt-16` (64px) |
| Eyebrow → first hero card | `mt-6` (24px) | `mt-8` (32px) |
| Hero card → next hero card (within stack) | `mt-8` (32px) | `mt-12` (48px) |
| Last hero card → `more work` eyebrow (when secondary section present) | `mt-16` (64px) | `mt-24` (96px) |
| Secondary section eyebrow → secondary card grid | `mt-6` (24px) | `mt-8` (32px) |
| Last card → footer | inherited from `(site)/layout.tsx` `pb-16 md:pb-24` | inherited |
| **`/projects` page** — top of `<main>` to `all projects` heading | inherited `pt-8 md:pt-16` | inherited |
| `all projects` → filter row | `mt-16` (64px) | `mt-24` (96px) |
| Filter row → first tier section | `mt-8` (32px) | `mt-8` (32px) |
| Tier section eyebrow → card grid | `mt-6` (24px) | `mt-8` (32px) |
| Card grid → tier separator hairline | `mt-12` (48px) | `mt-16` (64px) |
| Tier separator hairline → next tier eyebrow | `pt-6` (24px above eyebrow inside separator block) | `pt-8` |

---

## Component Inventory (Phase 4)

Each component has a declared boundary (RSC vs client), a contract, and the file path the executor should create.

### 1. `<HomeHero />` — `components/home/home-hero.tsx`

**Boundary:** RSC.

**Purpose:** Renders the home page hero stack (wordmark + role frame + thesis paragraph slot). Composes the `<ThesisParagraph>` client island.

**Props:**

```ts
interface HomeHeroProps {
  wordmark: string                  // locked: "olive elliott"
  roleFrame: string                 // locked: "engineer · autonomous workflows · local-first systems"
  thesis: string                    // the paragraph to type-set; placeholder copy permitted if real copy isn't ready
}
```

**Markup outline:**

```tsx
<section id="hero" aria-labelledby="hero-wordmark" className="flex flex-col">
  <h1 id="hero-wordmark" className="display-classes">olive elliott</h1>
  <p className="mt-4 body-classes role-frame max-w-[55ch]">{roleFrame}</p>
  <ThesisParagraph text={thesis} className="mt-6 body-classes max-w-[55ch]" />
</section>
```

**Typography contract:**

- `<h1>`: display scale (`clamp(2rem, 5vw, 3rem)`), Geist Sans, weight 500, tracking `-0.02em`, line-height 1.15, lowercase, color `--color-text-primary`.
- Role frame `<p>`: body (16px), Geist Sans, weight 400, line-height 1.6, color `--color-text-secondary`. The `·` separator is U+00B7 (middle dot) literal character, **not** an icon, **not** styled — appears with default body weight and color.
- Thesis paragraph: same typography as role frame (body / Geist Sans / 400 / 1.6 / `--color-text-secondary`). The type-set motion is the only thing that differs the thesis from the role frame visually.

**Accent / accent-hover usage:** none in `<HomeHero>`. The hero block is entirely text on `--color-bg`.

**Accessibility:**

- One `<h1>` per route (the wordmark). Aria-labelledby attaches the section to the wordmark.
- The U+00B7 separator in the role frame is plain text. No `aria-hidden` (it reads as "engineer middle dot autonomous workflows middle dot local-first systems" — clunky but accurate; alternative would be marking the separators `aria-hidden="true"`, which is acceptable and recommended — see Accessibility Contract below).
- The thesis paragraph's SSR fallback ensures screen readers always receive the full paragraph text as a single accessible name; per-word segmentation must not break accessibility tree continuity.

### 2. `<ThesisParagraph />` — `components/home/thesis-paragraph.tsx`

**Boundary:** `'use client'` — the only client island introduced by Phase 4 on the home page.

**Purpose:** The single earned motion moment of v1. Renders the thesis as a typographic paragraph with a per-word fade-in on mount (when motion is permitted).

**Props:**

```ts
interface ThesisParagraphProps {
  text: string
  className?: string
}
```

**Render strategy:** See Type-Set Motion Contract above (SSR fallback as `<p>{text}</p>`; post-hydration, replaced with per-word `<m.span>` segments).

**Implementation guard:** The author may pick either of two approaches — both must pass the contract.

- **Approach A — hand-rolled `useEffect`-driven mount + per-word `<m.span>`** with sequenced `delay` props. Easier to reason about; reduced-motion handled by MotionConfig.
- **Approach B — `motion/react` stagger primitive** via a parent `<m.div>` with `transition: { staggerChildren: 0.03 }` and child `<m.span>` per word. More idiomatic; same reduced-motion behavior.

The planner picks one during plan-phase. Tests assert the visible behavior (paragraph appears, reduced-motion bypass works, no CLS) — they do not assert the implementation strategy.

**Reduced-motion fallback:** with `MotionConfig reducedMotion="user"` from Phase 1, the per-word fade resolves to opacity 1 instantly. The SSR `<p>` fallback ensures pre-hydration visibility for everyone.

**No CLS guard:** the SSR `<p>` and the post-hydration segmented paragraph must occupy identical layout dimensions. Test assertion: the bounding-box height before and after hydration must be equal (jsdom test with `getBoundingClientRect` is acceptable; Lighthouse CLS check in Phase 6 will confirm in the real browser).

**Per Phase 1's `LazyMotion strict`:** uses `<m.span>` (not `<motion.span>`). Import: `import { m } from 'motion/react'`.

### 3. `<HomeProjectGrid />` — `components/home/home-project-grid.tsx`

**Boundary:** RSC.

**Purpose:** Composes the project sections of the home page — orchestrates the `selected work` hero stack and (when secondary projects exist) the `more work` grid.

**Props:**

```ts
interface HomeProjectGridProps {
  heroProjects: readonly Project[]      // from getHeroProjects()
  secondaryProjects: readonly Project[] // from getAll().filter(p => p.tier === 'secondary')
}
```

**Markup outline:**

```tsx
<>
  <hr className="border-t border-[color:var(--color-hairline)] my-12 md:my-16" aria-hidden="true" />
  <section aria-labelledby="hero-eyebrow">
    <p id="hero-eyebrow" className="eyebrow-classes">selected work</p>
    <div className="mt-6 md:mt-8 flex flex-col gap-8 md:gap-12">
      {heroProjects.map(p => <ProjectCardHero key={p.slug} project={p} />)}
    </div>
  </section>
  {secondaryProjects.length > 0 && (
    <section aria-labelledby="secondary-eyebrow" className="mt-16 md:mt-24">
      <p id="secondary-eyebrow" className="eyebrow-classes">more work</p>
      <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {secondaryProjects.map(p => <ProjectCardSecondary key={p.slug} project={p} />)}
      </div>
    </section>
  )}
</>
```

**Conditional rendering:** if `secondaryProjects.length === 0` (current v1 dev state — no secondary MDX authored yet), the entire `more work` section is omitted. Do not render an empty section, an empty grid, or a "coming soon" placeholder. The page simply ends at the last hero card.

### 4. `<ProjectCardHero />` — `components/projects/project-card-hero.tsx`

**Boundary:** RSC.

**Purpose:** Wide horizontal card for hero-tier projects on the home page. Reuses `isPlaceholderHero` from Phase 3 to branch between image-present and text-only treatments.

**Props:**

```ts
interface ProjectCardHeroProps {
  project: Project   // strict typed shape from lib/schemas.ts
}
```

**Markup outline (image-present case, `md+`):**

```tsx
<a
  href={`/projects/${project.slug}`}
  className="
    group block border border-[color:var(--color-hairline)]
    hover:border-[color:var(--color-text-tertiary)]
    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-accent)]
    transition-colors duration-[220ms] ease-linear
    p-6 md:p-12
  "
>
  <div className="md:grid md:grid-cols-12 md:gap-8 items-start">
    <div className="flex flex-col gap-4 md:col-span-7">
      <h2 className="card-title-h2-classes">{project.title}</h2>
      <p className="body-classes text-secondary">{project.tagline}</p>
      <CardMeta year={project.year} tags={project.tags} visibility={project.visibility} />
      {project.outcomes.length > 0 && (
        <ul className="mt-2 flex flex-col gap-2">
          {project.outcomes.slice(0, 3).map(outcome => (
            <li key={outcome} className="body-classes text-primary flex gap-2">
              <span aria-hidden="true" className="text-secondary">→</span>
              <span>{outcome}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
    {!isPlaceholderHero(project.hero.src) && (
      <div className="mt-8 md:mt-0 md:col-span-5">
        <Image
          src={project.hero.src}
          alt={project.hero.alt}
          width={1200}
          height={900}
          sizes="(min-width: 768px) 41vw, 100vw"
          className="rounded-none w-full h-auto"
        />
      </div>
    )}
  </div>
</a>
```

**Text-only branch:** When `isPlaceholderHero(project.hero.src) === true` (current Myco case), the image col is omitted entirely; the text column expands to full card width (no grid wrapper, or `md:col-span-12`). The title carries the weight without "compensation" upsizing — exactly per Phase 3 hero text-only rationale.

**Typography:**

- Title: H2 (24px mobile / 28px md+), Geist Sans, 600, line-height 1.3, tracking `-0.015em`, `--color-text-primary`, lowercase if the project title is lowercase in frontmatter (Myco is title-case — render as-authored; chrome lowercase rule applies only to chrome strings, not content titles).
- Tagline: body (16px), Geist Sans, 400, line-height 1.6, `--color-text-secondary`.
- Outcomes bullets: body (16px), Geist Sans, 400, line-height 1.6, `--color-text-primary`. The `→` glyph prefix is a literal U+2192 character with `aria-hidden="true"` and `--color-text-secondary` to de-emphasize.

**Card hover/focus contract:**

- **At rest:** 1px border `--color-hairline`. Title underline `text-decoration: none`.
- **Hover (on the `<a>`):** border-color transitions to `--color-text-tertiary` over 220ms linear. Title underline appears via `group-hover:underline group-hover:decoration-[color:var(--color-accent)] group-hover:underline-offset-[4px] group-hover:decoration-1`. No transition on the underline itself (appears instantly per Phase 3 NextProjectBlock convention).
- **Focus-visible (on the `<a>`):** Phase 1 2px accent outline at 2px offset (inherited from globals.css `:where(a, ...):focus-visible`). The title underline also appears via `group-focus-visible:underline group-focus-visible:decoration-[color:var(--color-accent)] group-focus-visible:underline-offset-[4px]`.
- **No scale, no shadow, no glow, no translate, no layout shift.** The only state changes are border-color and the title underline.

**Outcomes count cap:** Show at most 3 outcomes bullets on the hero card via `project.outcomes.slice(0, 3)`. Myco's schema already caps `outcomes` at 5 (`z.array(z.string()).max(5)`); the card displays the first 3. If a project has zero outcomes, the bullet list is omitted (no empty `<ul>`).

**Tag chips on the card:** rendered as a *presentational* row (chips are `<span>`, not `<a>`) to avoid nested-anchor invalidity. Visual treatment matches Phase 3's `TagChipRow` (Geist Mono 14px, +2% tracking, lowercase, `--color-surface-2` background, `--color-text-secondary` text, 2px radius, no hover state). This is encapsulated in `<CardMeta>` below.

### 5. `<ProjectCardSecondary />` — `components/projects/project-card-secondary.tsx`

**Boundary:** RSC.

**Purpose:** Compact horizontal card for (a) secondary-tier projects on the home page AND (b) **all projects** on the `/projects` index. Same component, optional `hero` boolean prop that adds the `hero` mono-prefix label above the title when used on the index page.

**Props:**

```ts
interface ProjectCardSecondaryProps {
  project: Project
  hero?: boolean  // when true, render the "hero" mono-prefix label above title. Used only on /projects index.
}
```

**Markup outline:**

```tsx
<a
  href={`/projects/${project.slug}`}
  className="
    group block border border-[color:var(--color-hairline)]
    hover:border-[color:var(--color-text-tertiary)]
    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-accent)]
    transition-colors duration-[220ms] ease-linear
    p-6 flex flex-col gap-4
  "
>
  {hero && (
    <p className="font-mono text-[var(--text-label)] font-medium tracking-[0.02em] lowercase text-[color:var(--color-text-tertiary)]">
      hero
    </p>
  )}
  <h3 className="card-title-h3-classes">{project.title}</h3>
  <p className="body-classes text-secondary">{project.tagline}</p>
  <CardMeta year={project.year} tags={project.tags} visibility={project.visibility} />
</a>
```

**Typography:**

- `hero` prefix (when present): Label (14px), Geist Mono, 500, tracking `+0.02em`, lowercase, `--color-text-tertiary`.
- Title: H3 (20px), Geist Sans, 600, line-height 1.4, tracking `-0.01em`, `--color-text-primary`, rendered as-authored case.
- Tagline: body (16px), Geist Sans, 400, line-height 1.6, `--color-text-secondary`.

**Card hover/focus contract:** Identical to `<ProjectCardHero>` — border-color lift + title underline appearance. No outcomes bullets, no image, no scale, no shadow.

**Padding rationale:** `p-6` (24px) on every breakpoint — tighter than the hero card's `p-6 md:p-12` since the secondary card is shorter and lives in a multi-up grid.

### 6. `<CardMeta />` — `components/projects/card-meta.tsx`

**Boundary:** RSC.

**Purpose:** A *presentational* sibling of Phase 3's `<ProjectMeta>` for use inside card surfaces where chips and labels must not introduce nested anchors. Renders year + presentational tag chips + (when private) `code private` label. **Does NOT render a repo link** (repo lives on the detail page only; the card never competes with itself for clicks).

**Props:**

```ts
interface CardMetaProps {
  year: number
  tags: readonly Tag[]
  visibility: 'public' | 'private'
}
```

**Markup outline:**

```tsx
<div role="list" aria-label="Project metadata" className="flex flex-wrap items-center gap-3">
  <time
    dateTime={String(year)}
    className="font-mono text-[var(--text-label)] font-medium tracking-[0.02em] text-[color:var(--color-text-secondary)]"
  >
    {year}
  </time>
  {tags.map((tag) => (
    <span
      key={tag}
      className="
        inline-flex items-center px-3 py-2
        bg-[color:var(--color-surface-2)] rounded-sm
        font-mono text-[var(--text-label)] font-medium tracking-[0.02em] lowercase
        text-[color:var(--color-text-secondary)]
      "
    >
      {tag}
    </span>
  ))}
  {visibility === 'private' && (
    <span className="font-mono text-[var(--text-label)] font-medium tracking-[0.02em] lowercase text-[color:var(--color-text-tertiary)]">
      code private
    </span>
  )}
</div>
```

**Why not reuse Phase 3's `<TagChipRow>` directly?** Phase 3's chips are `<a>` elements (interactive, linking to `/projects?tag=X`). Inside a `<ProjectCardHero>` or `<ProjectCardSecondary>` whose entire surface is already an `<a>`, nesting more `<a>` elements is invalid HTML and creates competing focus targets. `<CardMeta>` is the presentational sibling that uses `<span>` chips with identical visual treatment minus the hover color shift (chips inside cards have no independent hover state — the card's hover state is what visually responds).

**Privacy contract on the card:** `visibility === 'private'` renders the static `code private` label in `--color-text-tertiary`. Identical string + color to Phase 3's detail-page rule. **No repo link is ever rendered on the card** regardless of visibility — the contract is "see this on the detail page". The `code-private` tag chip flows through the standard chip pipeline (it appears as a normal presentational chip in the row) — same dual-signal pattern Phase 3 established (literal label + chip).

### 7. `<TierSeparator />` — `components/projects/tier-separator.tsx`

**Boundary:** RSC.

**Purpose:** A hairline divider + monospace lowercase label, marking a tier transition on the `/projects` index page (e.g., between hero-tier cards and secondary-tier cards). Used on `/projects` only — the home page uses two distinct section eyebrows (`selected work`, `more work`) rather than a separator.

**Props:**

```ts
interface TierSeparatorProps {
  label: 'hero' | 'secondary'
}
```

**Markup:**

```tsx
<div className="mt-12 md:mt-16 pt-6 md:pt-8 border-t border-[color:var(--color-hairline)]">
  <p className="font-mono text-[var(--text-label)] font-medium tracking-[0.02em] lowercase text-[color:var(--color-text-tertiary)]">
    {label}
  </p>
</div>
```

**Visibility rule:** rendered only when there are cards both *above and below* the separator. If the active filter results in zero cards for the next tier section, the separator is omitted entirely (no orphan label).

**Note on usage on home page:** The home page does NOT use `<TierSeparator>` — it uses two distinct sectioned eyebrows (`selected work` for hero-tier, `more work` for secondary-tier) each with its own `<p class="eyebrow">` label. The `/projects` index uses `<TierSeparator>` to mark mid-page tier transitions because both tier sections render as the same card visual variant on that page.

### 8. `<TagFilterRow />` — `components/projects/tag-filter-row.tsx`

**Boundary:** RSC. **No `useSearchParams`, no `'use client'`, no client state, no router calls.**

**Purpose:** URL-synced single-tag filter for `/projects`. Each chip is a plain `<a>` whose `href` either applies a tag filter or clears the existing one. State lives in the URL; the page is a server component reading `searchParams.tag`.

**Props:**

```ts
interface TagFilterRowProps {
  tags: ReadonlyArray<{ tag: Tag; count: number }>   // from getAllTags()
  activeTag?: Tag                                    // from searchParams.tag (narrowed against TAGS)
}
```

**Markup outline:**

```tsx
<nav aria-label="Filter projects by tag" className="mt-16 md:mt-24">
  <ul role="list" className="flex flex-wrap gap-3 items-center">
    {tags.map(({ tag, count }) => {
      const isActive = tag === activeTag
      const href = isActive ? '/projects' : `/projects?tag=${tag}`
      return (
        <li key={tag}>
          <a
            href={href}
            aria-pressed={isActive}
            className={isActive ? 'chip-active-classes' : 'chip-inactive-classes'}
          >
            {TAG_LABELS[tag]}
            <span className="ml-2 text-secondary chip-count-classes" aria-hidden="true">
              {count}
            </span>
          </a>
        </li>
      )
    })}
    {activeTag && (
      <li>
        <a
          href="/projects"
          className="
            ml-3 px-3 py-2 -my-2
            font-mono text-[var(--text-label)] font-medium tracking-[0.02em] lowercase
            text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]
            no-underline hover:underline hover:underline-offset-4 hover:decoration-1
            transition-colors duration-[120ms] ease-linear
          "
        >
          × clear filter
        </a>
      </li>
    )}
  </ul>
</nav>
```

**Chip styling (active vs inactive):**

| State | Background | Foreground | Hover (foreground or bg shift) | Focus-visible |
|-------|-----------|------------|-------------------------------|---------------|
| **Inactive** | `--color-surface-2` (`#141414`) | `--color-text-secondary` (`#a3a3a3`) | Foreground shifts to `--color-text-primary` (#f5f5f5) over 120ms linear. Background unchanged. | 2px solid `--color-accent` outline at 2px offset (Phase 1 global) |
| **Active** | `--color-accent` (`#fbbf24`) | `--color-text-on-accent` (`#0a0a0a`) | Background shifts to `--color-accent-hover` (`#f59e0b`) over 120ms linear. Foreground unchanged (`--color-text-on-accent` stays). | 2px solid `--color-accent` outline at 2px offset — the outline color is also accent, but the 2px offset keeps it visible against the accent fill (ring sits outside the chip on `--color-bg`) |

Chip dimensions (both states): `px-3 py-2` (12px / 8px), 2px radius (`--radius-sm`), Geist Mono 14px medium tracking `+0.02em` lowercase. Each chip rendered inside an `<li>`; the chip-row uses `flex flex-wrap gap-3 items-center`.

**Chip count badge:** the per-tag count from `getAllTags()` is rendered inline after the label, separated by `ml-2` (8px). Styled at the same scale as the chip text but at `--color-text-secondary` (inactive chip) / inherits `--color-text-on-accent` via parent on active chip. Marked `aria-hidden="true"` because the count is decorative — the chip's accessible name (TAG_LABELS[tag] alone) is what screen readers should announce.

**Use of TAG_LABELS:** filter chips use the human-facing labels from `lib/tags.ts` (`'Local-first'`, `'Autonomous'`, etc.) — *not* the lowercase raw tag values. This is the Phase 4 use case TAG_LABELS was reserved for in Phase 3. Card chips remain lowercase raw values (Phase 3 convention).

**`aria-pressed`:** each chip carries `aria-pressed={isActive}` so screen readers can distinguish the active filter. The chip is still an `<a>` (semantically a link, not a button) — `aria-pressed` here is a pragmatic enhancement, not a primary affordance. The visible color and `× clear filter` are the primary affordances.

**Keyboard navigation (PIX-03):** native `<a>` elements — `Tab` advances through chips in DOM order, `Shift+Tab` reverses, `Enter` activates (browser default). No `keydown` handlers, no custom focus management. The clear-filter link is the final tab stop in the row when present.

**Chip order:** preserves `getAllTags()` ordering — count desc, then tag alpha asc. Most-used tags surface first.

**Active filter resolution server-side:** the page component validates `searchParams.tag` against the `TAGS` const before passing it to `<TagFilterRow>` and to `getProjectsByTag`. Unknown/invalid tag values fall back to "no filter" (renders the full list, with no chip in active state, no clear-filter link visible). The unknown-tag URL is not redirected — it just renders as if no filter were applied (per the success criterion's emphasis on "shareable URLs" — broken URLs degrade gracefully).

### 9. `<EmptyFilterState />` — `components/projects/empty-filter-state.tsx`

**Boundary:** RSC.

**Purpose:** Inline message rendered when the active filter results in zero matching projects. No illustration, no empty-state cliché, no "no results found" boilerplate. A single sentence with an inline link clearing the filter.

**Props:**

```ts
interface EmptyFilterStateProps {
  tag: Tag    // the filter that yielded zero results (must be a valid Tag per server-side narrowing)
}
```

**Markup:**

```tsx
<div className="py-12 max-w-[55ch] mx-auto">
  <p className="body-classes text-secondary">
    no projects tagged <span className="font-mono lowercase">"{tag}"</span>{' '}
    —{' '}
    <a href="/projects" className="text-accent hover:text-accent-hover underline underline-offset-2">
      view all projects →
    </a>
  </p>
</div>
```

**Typography:**

- Outer `<p>`: body (16px), Geist Sans, 400, line-height 1.6, `--color-text-secondary`.
- Quoted tag value `"{tag}"`: Geist Mono, lowercase, inherits body size, color inherits from parent (secondary).
- Link: inherits body size, `--color-accent` at rest, `--color-accent-hover` on hover, 1px underline at `text-underline-offset: 2px` (matches Phase 3 inline-link contract from `.prose a`).
- `→` glyph in link copy: literal U+2192 character, no `aria-hidden` (the arrow is part of the call-to-action's visible text — "view all projects →" reads as a directional invitation).

**Layout:** `py-12` (48px) vertical padding above and below the message inside the page's standard flow — keeps the page from collapsing in height when filtered to zero, but does not pretend the page is full.

**Copy (locked):** see Copywriting Contract below — `no projects tagged "{tag}" — view all projects →`. The em-dash is U+2014. The link clears via `href="/projects"` (no JS; back-button and reload restore.)

### 10. Home page route — `app/(site)/page.tsx`

**Boundary:** RSC. Replaces the Phase 1 placeholder. Composes `<HomeHero>` + `<HomeProjectGrid>`.

**Render outline:**

```tsx
import { HomeHero } from '@/components/home/home-hero'
import { HomeProjectGrid } from '@/components/home/home-project-grid'
import { getAll, getHeroProjects } from '@/lib/projects'

const WORDMARK = 'olive elliott'
const ROLE_FRAME = 'engineer · autonomous workflows · local-first systems'
const THESIS = '...locked or placeholder string...'

export default function HomePage() {
  const heroProjects = getHeroProjects()
  const secondaryProjects = getAll().filter(p => p.tier === 'secondary')
  return (
    <>
      <HomeHero wordmark={WORDMARK} roleFrame={ROLE_FRAME} thesis={THESIS} />
      <HomeProjectGrid heroProjects={heroProjects} secondaryProjects={secondaryProjects} />
    </>
  )
}

export const metadata = {
  title: 'olivelliott.dev',  // root layout's titleTemplate produces 'olivelliott.dev'
  description: 'Olive Elliott — engineer building tools for autonomy, local-first systems, and open-source communities.',
}
```

**Metadata:** uses the site default description from Phase 1's root layout. Per-route OG image strategy: use `/og-default.png` shipped in Phase 3 Wave 0 (Phase 6 may upgrade to per-route dynamic OG; out of scope for Phase 4).

**Empty hero state:** if `getHeroProjects()` returns `[]` (current dev state — only Myco exists, which IS hero-tier; so this case shouldn't trigger in Phase 4 dev, but defensive coding matters): the `selected work` eyebrow + section is omitted entirely. Same rule as the secondary tier — do not render an empty section. (At v1 launch, all three hero projects exist, so this is purely defensive.)

### 11. `/projects` route — `app/(site)/projects/page.tsx`

**Boundary:** RSC. Reads `searchParams.tag`; calls `getProjectsByTag(tag)` if a valid tag, else `getAll()`.

**Render outline:**

```tsx
import { getAll, getAllTags, getProjectsByTag } from '@/lib/projects'
import { TAGS, type Tag } from '@/lib/tags'
import { TagFilterRow } from '@/components/projects/tag-filter-row'
import { TierSeparator } from '@/components/projects/tier-separator'
import { ProjectCardSecondary } from '@/components/projects/project-card-secondary'
import { EmptyFilterState } from '@/components/projects/empty-filter-state'

interface PageProps {
  searchParams: Promise<{ tag?: string | string[] }>  // Next 16 makes searchParams a Promise
}

export default async function ProjectsIndexPage({ searchParams }: PageProps) {
  const sp = await searchParams
  const rawTag = Array.isArray(sp.tag) ? sp.tag[0] : sp.tag
  const activeTag: Tag | undefined = rawTag && (TAGS as readonly string[]).includes(rawTag)
    ? (rawTag as Tag)
    : undefined

  const allTags = getAllTags()
  const projects = activeTag ? getProjectsByTag(activeTag) : getAll()
  const heroProjects = projects.filter(p => p.tier === 'hero')
  const secondaryProjects = projects.filter(p => p.tier === 'secondary')

  return (
    <>
      <header>
        <h1 className="display-mono-classes">all projects</h1>
      </header>
      <TagFilterRow tags={allTags} activeTag={activeTag} />

      {activeTag && projects.length === 0 ? (
        <EmptyFilterState tag={activeTag} />
      ) : (
        <>
          {heroProjects.length > 0 && (
            <section aria-labelledby="hero-eyebrow-index">
              <TierSeparator label="hero" />
              <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {heroProjects.map(p => <ProjectCardSecondary key={p.slug} project={p} hero />)}
              </div>
            </section>
          )}
          {secondaryProjects.length > 0 && (
            <section aria-labelledby="secondary-eyebrow-index">
              <TierSeparator label="secondary" />
              <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {secondaryProjects.map(p => <ProjectCardSecondary key={p.slug} project={p} />)}
              </div>
            </section>
          )}
        </>
      )}
    </>
  )
}

export const metadata = {
  title: 'all projects',          // resolves to 'all projects · olivelliott.dev' via root titleTemplate
  description: 'A filterable index of Olive Elliott\'s work — hero-tier case studies and secondary projects across local-first, autonomous, and open-source contributions.',
}
```

**Note on Next 16 `searchParams`:** in Next.js 16, `searchParams` is a `Promise<{...}>` — must be `await`ed. This matches the project's React 19.2 / Next 16.2 baseline.

**First tier section uses `<TierSeparator label="hero" />`** even though there's no preceding tier above it on the page. This is a deliberate visual cue — the `hero` label sits inside a separator block (hairline + label) for consistency with how `secondary` renders below. The hairline above the first separator on this page is acceptable visually (it sits below the filter row, providing closure to the filter section).

**Filter resolution edge cases:**

- `?tag=local-first` and tag is in TAGS → narrow to `'local-first'`, filter by tag.
- `?tag=does-not-exist` → narrow returns `undefined`, render full list, no chip active.
- `?tag=` (empty) → `undefined`, render full list.
- `?tag=a&tag=b` (array form, unusual) → take the first, narrow normally.
- No `?tag` param → `undefined`, render full list.

### Component file structure summary

```
components/
  home/
    home-hero.tsx              # RSC
    home-project-grid.tsx      # RSC
    thesis-paragraph.tsx       # 'use client' — the ONLY new client island
  projects/
    project-card-hero.tsx      # RSC (NEW)
    project-card-secondary.tsx # RSC (NEW)
    card-meta.tsx              # RSC (NEW)
    tier-separator.tsx         # RSC (NEW)
    tag-filter-row.tsx         # RSC (NEW)
    empty-filter-state.tsx     # RSC (NEW)
    # Phase 3 components untouched:
    # tag-chip-row.tsx, project-meta.tsx, project-hero.tsx,
    # next-project-block.tsx, next-project-title.tsx
app/(site)/
  page.tsx                     # REPLACES Phase 1 placeholder
  projects/
    page.tsx                   # NEW (alongside existing [slug]/page.tsx from Phase 3)
```

The planner may consolidate `<ProjectCardHero>` and `<ProjectCardSecondary>` into a single `<ProjectCard tier="hero"|"secondary">` file if it reads cleaner — tests assert rendered DOM, not file structure. Either choice is consistent with this spec.

---

## Accessibility Contract

Every Phase 4 success criterion maps to a specific assertion here.

### Semantic landmarks + headings (HOM-01, HOM-02, HOM-03, PIX-01)

**Home page (`/`):**

- `<main id="main">` — provided by the `(site)/layout.tsx` shell (Phase 1).
- `<section id="hero">` — `aria-labelledby="hero-wordmark"`.
- `<h1 id="hero-wordmark">olive elliott</h1>` — the ONE `<h1>` on the route.
- `<section aria-labelledby="hero-eyebrow">` with `<p id="hero-eyebrow" class="eyebrow">selected work</p>` — eyebrow is a `<p>` (not a heading), so it does not break the heading hierarchy. Each `<ProjectCardHero>` then carries its own `<h2>` for the project title.
- `<section aria-labelledby="secondary-eyebrow">` (when present) with `<p id="secondary-eyebrow">more work</p>` and `<h3>` per `<ProjectCardSecondary>` title.
- Heading hierarchy: H1 (wordmark) → H2 (each hero card title) → H3 (each secondary card title). Skipping from H2 to H3 across sections is acceptable; the eyebrows are labels, not headings.

**`/projects` index:**

- `<main id="main">` — provided by shell.
- `<header>` (page-scoped, not the site `<header>`) → `<h1 class="display-mono">all projects</h1>` — the ONE `<h1>` on the route.
- `<nav aria-label="Filter projects by tag">` — explicit landmark for the filter row.
- `<section aria-labelledby="hero-eyebrow-index">` with `<p id="hero-eyebrow-index">hero</p>` (rendered inside `<TierSeparator>`).
- Each `<ProjectCardSecondary>` on the index page uses `<h3>` for the title (NOT `<h2>`) — the index page's `<h1>` is the page heading, and the tier eyebrow is a `<p>` label, so all card titles are `<h3>` at this depth. **Note:** this is a slight inconsistency with the home page (where hero cards use `<h2>` and secondary cards use `<h3>`). The rationale: on the home page, hero cards are the visual peers of the page hero and warrant H2 depth; on the index, all cards are scan units inside a uniform tier-sectioned list and uniformly take H3. Both choices respect the "one H1 per route" rule and produce a valid heading outline.

### Keyboard navigation (PIX-03 + HOM-04)

**Tab order on the home page:**

1. Skip link (Phase 1, hidden until focused).
2. Wordmark (Phase 1 chrome).
3. Nav links: `projects`, `about`, `resume`, `contact` (Phase 1).
4. *(thesis paragraph is non-interactive — no tab stop)*
5. Each `<ProjectCardHero>` `<a>` in DOM order (Myco → Fathom → Agenda Keeper at v1 launch).
6. Each `<ProjectCardSecondary>` `<a>` in DOM order (when present).
7. Footer chrome (Phase 1).

**Tab order on `/projects` index:**

1. Skip link → wordmark → nav links → page `<h1>` (not focusable; skipped).
2. Each filter chip `<a>` in DOM order (count desc, then alpha asc per `getAllTags()`).
3. `× clear filter` link (when present).
4. Each `<ProjectCardSecondary>` `<a>` in DOM order, hero tier first, then secondary tier.
5. Footer chrome.

**Assertions:**

- Every focusable element receives the Phase 1 global `:focus-visible` outline (2px solid `--color-accent`, 2px offset). Verified by Phase 6 axe scan + manual keyboard pass.
- Enter activates a focused chip / card link (browser default; no JS interception).
- Filter URL change triggers a full server navigation — focus returns to top of the new page (browser default for `<a>` navigations). This is acceptable per the success criterion ("reloading the URL or using the back button restores the exact filter state" — the URL is the state, the page is server-rendered).
- No keyboard traps. No focus management hacks.

### Reduced motion (HOM-05 + QAL-04)

- `<ThesisParagraph>` uses `MotionConfig reducedMotion="user"` via the Phase 1 provider; per-word fade collapses to instant when reduce-motion is on.
- `<ThesisParagraph>` MUST render an SSR fallback at full opacity so the paragraph is visible pre-hydration, no-JS, and reduce-motion-on — all three cases produce the same DOM at user-visible time.
- All card hover transitions (border-color, title underline) are CSS `transition-duration: 220ms` — caught by Phase 1's `@media (prefers-reduced-motion: reduce)` floor (collapses to 0.01ms).
- All filter chip transitions are `transition-duration: 120ms` — same floor catches them.
- No motion uses `whileInView`, scroll listeners, or IntersectionObserver. No scroll-triggered animations exist in Phase 4.

### Screen reader / semantic HTML

- All cards use `<a href="/projects/${slug}">` — link semantics. No `<div onClick>`, no `role="button"` overrides on what should be a link.
- Tag chips inside cards are `<span>` (presentational); filter chips on `/projects` are `<a>` (interactive). The role distinction is intentional and matches the visual role distinction.
- The `→` glyph in card outcome bullets and in the empty-state link has `aria-hidden="true"` only where it's *purely decorative* (the bullet markers); where the glyph is part of the call-to-action's accessible name (the empty-state "view all projects →" link), it stays in the accessible name.
- The `·` separator in the role frame is rendered as plain text. Recommended: mark each `·` with `aria-hidden="true"` so screen readers announce "engineer autonomous workflows local-first systems" rather than "engineer middle dot ...". (The role frame copy may also be authored with commas instead of middle dots if the visual character is preserved via a different mechanism — Claude's discretion.)
- Card `<h2>` / `<h3>` titles are the accessible names of the card links (via the link's text content).
- Filter chips carry `aria-pressed={isActive}` for SR distinction between active and inactive filters.
- The active-filter chip count badge has `aria-hidden="true"` (decorative — the chip label is the accessible name).

### Alt-text on hero card images

- When `<ProjectCardHero>` renders an image (image-present case), the `<Image>`'s `alt` comes from `project.hero.alt` (schema-required, `z.string().min(1)` ensures non-empty).
- Myco's current alt: `"Myco knowledge graph visualization (placeholder — real image lands in Phase 7)"` — explicitly placeholder. When Phase 7 swaps the image, the alt must be updated to describe the real artwork.
- No decorative `alt=""` images on Phase 4 cards. If a project ever needs a decorative image, that's a Phase 7 content decision, not a Phase 4 template decision.

### No JS fallback

- Home page: wordmark, role frame, thesis text, all card content (titles, taglines, outcomes, meta rows), eyebrows — all present in SSR HTML. Verifiable via `curl https://<deploy>/ | grep -i "olive elliott"`.
- `/projects` page: heading, filter chips (as `<a>` with `href`), all card content — all present in SSR HTML. The filter mechanic *requires no JS* — chips are `<a>` elements that perform server navigations.
- The only thing JS adds: the type-set animation on the thesis paragraph. Without JS, the paragraph renders at opacity 1 (the SSR fallback). No content is gated behind hydration.

---

## Responsive Contract

| Breakpoint | Home layout behavior | `/projects` layout behavior |
|------------|----------------------|------------------------------|
| `< 640px` (mobile) | Hero stacks vertical. Hero card: text on top, image (if present) below. Hero cards stack `gap-8`. Secondary card grid: 1-up. | Page heading flush-left. Filter chips wrap into multiple rows. Cards: 1-up grid. Tier separators full-width. |
| `640px–1024px` (tablet) | Hero card 2-column on `md+` (text 7/12, image 5/12). Secondary card grid: 2-up. | Filter chips wrap as needed. Cards: 2-up grid. |
| `≥ 1024px` (desktop) | Secondary card grid: 3-up. Hero card 2-column unchanged. | Cards: 3-up grid. |
| `≥ 1280px` (wide) | No change — page caps at `max-w-6xl` (1152px). Wider viewports add letterboxing. | Same. |

**Touch targets on mobile:** all card `<a>` wrappers exceed 44×44px trivially (card minimums are far larger). All filter chip `<a>` elements have `px-3 py-2` (12px horizontal / 8px vertical padding) on a ~20px line height ≈ 36px box; combined with row `gap-3` and the `× clear filter` `-my-2` trick, effective tap targets meet 44×44px. The clear-filter link's `-my-2` extends its hit-box vertically.

---

## Copywriting Contract

All strings rendered in Phase 4 are enumerated below. Locked unless this UI-SPEC is revised.

### Locked microcopy

| Element | Copy | Register |
|---------|------|----------|
| Home hero wordmark (`<h1>`) | `olive elliott` | lowercase, no punctuation, display scale |
| Home hero role frame | `engineer · autonomous workflows · local-first systems` | lowercase, U+00B7 middle-dot separators (or commas — Claude's discretion at implementation), single sentence |
| Home hero thesis paragraph | **Placeholder — to be revised in Phase 7 content pass.** Draft: `I work on Myco, Fathom, Agenda Keeper, and contributions to Aktiga — building local-first systems and autonomous workflows so people have time and attention for everything else that matters. Open-source where I can; honest about the trade-offs where I can't.` | lowercase-led, plain-spoken, names projects in-sentence, ≤ 3 sentences. **Mark explicitly as placeholder** in the page source (e.g. a comment `{/* PLACEHOLDER: Phase 7 content pass */}`) so the reviewer can spot it during the launch gate. |
| Home `selected work` eyebrow | `selected work` | GeistMono lowercase, label scale, `--color-text-tertiary` |
| Home `more work` eyebrow (when secondary section present) | `more work` | same treatment as `selected work` |
| `/projects` page heading (`<h1>`) | `all projects` | GeistMono lowercase, display scale, `--color-text-primary` |
| `/projects` tier separator label — hero tier | `hero` | GeistMono lowercase, label scale, `--color-text-tertiary` |
| `/projects` tier separator label — secondary tier | `secondary` | same as `hero` separator |
| `/projects` `hero` per-card prefix (on `<ProjectCardSecondary hero>` only) | `hero` | GeistMono lowercase, label scale, `--color-text-tertiary` |
| Card private-label | `code private` | GeistMono lowercase, label scale, `--color-text-tertiary` — **exact string**, no lock icon, no punctuation |
| Tag chip label (presentational, inside cards) | the raw `Tag` value verbatim — e.g. `local-first`, `autonomous` | lowercase as authored in `TAGS` |
| Tag filter chip label (on `/projects`) | the human-facing label from `TAG_LABELS` — e.g. `Local-first`, `Autonomous` | sentence-case as authored in TAG_LABELS |
| Tag filter chip count badge | the integer count, e.g. `3` | aria-hidden; no parentheses, no `(3)` styling |
| `× clear filter` link | `× clear filter` | lowercase, U+00D7 multiplication sign as the leading glyph, single space separator |
| Empty-filter-state message | `no projects tagged "{tag}" — view all projects →` | lowercase, the tag value rendered in mono inside `"…"`, U+2014 em-dash separator, U+2192 right-arrow trailing glyph |
| Home page `<title>` (HTML head) | `olivelliott.dev` | root layout titleTemplate; renders as `olivelliott.dev` on home |
| Home page meta description | `Olive Elliott — engineer building tools for autonomy, local-first systems, and open-source communities.` | inherited from Phase 1 site default |
| `/projects` page `<title>` (HTML head) | `all projects` | resolves to `all projects · olivelliott.dev` via root titleTemplate |
| `/projects` page meta description | `A filterable index of Olive Elliott's work — hero-tier case studies and secondary projects across local-first, autonomous, and open-source contributions.` | one sentence, ≤ 160 chars, specific |

### Banned words (carried forward from Phase 1, enforced for all Phase 4 copy)

*passionate, award-winning, scalable solutions, cutting-edge, 10x, crafted, seamless, leveraging, synergy, rockstar, ninja, innovative, transformative.* Plus the thesis-specific bans: no buzzwords disguised as register (no "ecosystem", no "paradigm", no "next-generation"). The thesis must name projects.

### No emoji in chrome

Same rule as Phase 1. Emoji allowed inside MDX body copy (Phase 2+); chrome strings (eyebrows, labels, headings, filter chips, empty states, separator labels) carry zero emoji. The `×`, `→`, `·` characters are typographic glyphs, not emoji.

### Primary CTA (per template requirement)

Phase 4's primary CTA is implicit, not a button: **each `<ProjectCardHero>`** is itself the call-to-action — clicking the whole card opens the case study. There is no separate "Read the case study →" button overlaid on cards; the card's hover affordance (border lift + title underline in accent) carries the invitation. This matches the wallofportfolios.in reference aesthetic and avoids button-on-card chrome ornament.

The `× clear filter` link on `/projects` is a secondary CTA (only visible when a filter is active).

### Empty state (per template requirement)

**Heading:** none (the empty state is inline message, not a heading-sized banner).
**Body:** `no projects tagged "{tag}" — view all projects →` (locked above).
**Next step:** the inline `view all projects →` link clears the filter (`href="/projects"`).

### Error state (per template requirement)

Phase 4 has no runtime error UI:

- No forms, no async data fetches beyond the build-time content load, no mutations.
- A malformed `?tag=...` URL degrades gracefully (renders the unfiltered list with no chip active) — see `<TagFilterRow>` § filter resolution edge cases.
- A missing project slug in `/projects/[slug]` is Phase 3's territory (the 404 is the error surface).
- A truly broken build (Zod schema parse failure on a new MDX file) fails at build time per Phase 2's contract — never reaches the production page.

### Destructive actions (per template requirement)

**None in Phase 4.** No delete, no disable, no cancel. Pages are read-only browse surfaces. The `× clear filter` is non-destructive (resets a view; doesn't delete data; URL navigation, reversible via back button).

---

## Per-Route Metadata Contract

| Field | `/` (home) | `/projects` (index) |
|-------|-----------|---------------------|
| `<title>` (head) | `olivelliott.dev` (root titleTemplate resolves home title to bare site title) | `all projects · olivelliott.dev` |
| `<meta name="description">` | `Olive Elliott — engineer building tools for autonomy, local-first systems, and open-source communities.` | `A filterable index of Olive Elliott's work — hero-tier case studies and secondary projects across local-first, autonomous, and open-source contributions.` |
| OG image (Twitter card + Open Graph) | `/og-default.png` (shipped Phase 3 Wave 0) | `/og-default.png` (same) |
| OG title | inherits `<title>` | inherits `<title>` |
| OG description | inherits `<meta name="description">` | inherits |
| Canonical URL | `https://olivelliott.dev/` (resolved via `metadataBase` from Phase 1 root layout) | `https://olivelliott.dev/projects` |

**Per-route dynamic OG generation:** out of scope for Phase 4. Phase 6 may upgrade to `next/og` per-route renders (see DYN-01 v2). Static `/og-default.png` is acceptable for v1 per MTA-02.

**`/projects?tag=local-first` and other filtered states:** carry the same metadata as `/projects` (no per-filter title/description; the canonical URL stays `/projects`). Filter state is URL parameter only — not surfaced in head metadata, not indexed separately by search engines (acceptable per v1's scale — 11 tags × low traffic).

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | **none in Phase 4.** No Button / Dialog / Tooltip / DropdownMenu surfaces are introduced. | not required — shadcn not initialized in Phase 4 (consistent with Phases 1–3) |
| Third-party registries | **none permitted in v1** | N/A — if any third-party block were proposed mid-phase, a `npx shadcn view` vetting evidence note with timestamp would be required per the gsd-ui-researcher protocol. None are proposed. |

**Phase 4 ships zero registry blocks.** Every component enumerated above is hand-authored against Phase 1 + Phase 3 primitives + Tailwind v4 utilities + the single `motion/react` `<m.span>` import inside `<ThesisParagraph>`.

---

## Anti-Patterns — Re-Asserted for Phase 4

This list combines the carry-forward bans from Phases 1 + 3 with the Phase-4-specific ones called out in HOM-04, CONTEXT.md, and PROJECT.md. The UI-checker MUST reject any Phase 4 implementation that includes:

**Layout / composition:**
- ❌ Bento grid (asymmetric tile mosaic) on the home page (HOM-04)
- ❌ Auto-scrolling "featured" or "latest" carousel above the hero (HOM-04 implicit, CONTEXT.md explicit)
- ❌ Stagger-on-scroll card reveals on either page (HOM-04, QAL-05)
- ❌ Hero image as a full-bleed background with text overlay (AI-template tell)
- ❌ Pinned sticky filter bar on `/projects` (filter is a normal flow element)

**Visual treatment:**
- ❌ Glassmorphism cards (`backdrop-blur`, semi-transparent fills) — PITFALLS, FEATURES
- ❌ Gradient blob backgrounds, radial-gradient orbs, conic-gradient anywhere
- ❌ `from-*-500 to-*-500` Tailwind utility gradients on cards, hero, chips
- ❌ Box-shadow / drop-shadow on cards in any state (hover included)
- ❌ Border-gradient on cards
- ❌ Scale / lift / glow on card hover (rejected explicitly by CONTEXT.md)
- ❌ Rounded `--radius-lg` (12px) corners on cards — cards stay zero-radius per the deliberate decision above

**Motion:**
- ❌ Any motion beyond the one `<ThesisParagraph>` type-set entrance and Phase 1's `<FadeIn>` (which is NOT used on Phase 4 pages)
- ❌ Cursor-reactive logo / cursor-following dot / hero parallax (deferred per CONTEXT.md)
- ❌ View Transitions API cross-route motion (deferred to v2 — VTX-01)
- ❌ Per-word typewriter effect with caret-blink (the type-set is fade-only, no character animation, no infinite caret)
- ❌ Scroll-tied reveals via IntersectionObserver / `whileInView` on cards, eyebrows, separators
- ❌ Auto-play hero video / Lottie / WebGL scene

**Copy / chrome:**
- ❌ "Coming soon" placeholders for missing secondary tier (omit the section entirely instead)
- ❌ Empty-state illustrations or icons in the empty-filter message
- ❌ "Featured" / "Spotlight" / "New" badges on cards (the tier label is the only positional marker)
- ❌ Skill bars / years-of-experience headlines anywhere (FEATURES, QAL-05)
- ❌ Testimonial carousel / client logo strip (FEATURES, QAL-05)
- ❌ Emoji in eyebrows, separator labels, chips, headings, empty-state copy
- ❌ "Read more →" button overlay on cards (the whole card is the link; CTA-on-card is redundant chrome)
- ❌ Banned words (passionate, scalable solutions, cutting-edge, 10x, etc.) anywhere in Phase 4 copy

**Accessibility / semantics:**
- ❌ Nested `<a>` inside `<a>` (card chips are `<span>`, not `<a>`)
- ❌ `useSearchParams` / `'use client'` on `/projects` page (URL state is server-read)
- ❌ More than one `<h1>` per route
- ❌ `<div onClick>` cards (must be `<a href>`)
- ❌ `outline: none` without an equivalent replacement (Phase 1 global rule)
- ❌ Decorative `alt=""` on hero card images that have meaningful content (schema enforces non-empty alt)
- ❌ Tabindex acrobatics (`tabindex` > 0) to "fix" focus order (DOM order is the source of truth)

---

## Design Tokens — No File Changes in Phase 4

`styles/tokens.css` requires **no edits** in Phase 4. Every token Phase 4 uses (`--motion-duration-slow`, `--color-text-on-accent`, `--color-accent` as background fill, presentational tag chip values, H2 / H3 / semibold weight) is already declared in the existing tokens file as of Phase 3's Wave 0 additions. The planner should NOT add tokens for Phase 4. If a layout decision seems to require a new spacing/color/motion value, the design has drifted from spec — escalate via UI-SPEC revision rather than adding a token.

---

## Phase 4 Deliverable Checklist (for gsd-planner / gsd-executor)

Components/files the plan must create or replace:

- [ ] `components/home/home-hero.tsx` — RSC, wordmark + role frame + thesis slot
- [ ] `components/home/thesis-paragraph.tsx` — `'use client'`, type-set motion island, SSR fallback inside
- [ ] `components/home/home-project-grid.tsx` — RSC, composes hero-tier + secondary-tier sections
- [ ] `components/projects/project-card-hero.tsx` — RSC, hero-tier card with image branching
- [ ] `components/projects/project-card-secondary.tsx` — RSC, compact card with optional `hero` prefix
- [ ] `components/projects/card-meta.tsx` — RSC, presentational meta-row sibling for cards
- [ ] `components/projects/tier-separator.tsx` — RSC, hairline + mono lowercase label
- [ ] `components/projects/tag-filter-row.tsx` — RSC, URL-synced filter chips + clear link
- [ ] `components/projects/empty-filter-state.tsx` — RSC, inline empty message
- [ ] `app/(site)/page.tsx` — **REPLACES Phase 1 placeholder**; composes HomeHero + HomeProjectGrid; per-route metadata
- [ ] `app/(site)/projects/page.tsx` — NEW; reads `searchParams.tag`; composes TagFilterRow + tier sections OR EmptyFilterState; per-route metadata
- [ ] Vitest tests (next to source under `tests/`):
  - `tests/home/home-hero.test.tsx` — render contract, single H1, role frame text, thesis slot composition
  - `tests/home/thesis-paragraph.test.tsx` — SSR fallback contract, reduced-motion bypass, no CLS height contract
  - `tests/home/home-project-grid.test.tsx` — conditional secondary section render, empty-secondary case
  - `tests/projects/project-card-hero.test.tsx` — image-present vs text-only branch, outcomes cap at 3, presentational chip rendering, no nested anchors
  - `tests/projects/project-card-secondary.test.tsx` — hero-prefix prop on/off, private label, no nested anchors
  - `tests/projects/card-meta.test.tsx` — private label + tags + year ordering, no repo link rendered ever
  - `tests/projects/tag-filter-row.test.tsx` — active vs inactive chip styling, clear-filter href, aria-pressed, count badge aria-hidden
  - `tests/projects/empty-filter-state.test.tsx` — locked copy, em-dash + arrow glyphs, link href clears filter
  - `tests/projects/tier-separator.test.tsx` — label rendering, hairline class
  - `tests/projects/page.test.tsx` — server filter resolution: valid tag, invalid tag, no tag, zero-result case; correct card variant; correct tier section conditional rendering

---

## Checker Sign-Off

- [ ] Dimension 1 Copywriting: PASS (banned-word list applied; locked microcopy; thesis placeholder explicitly flagged; honest-register on empty state; no emoji in chrome)
- [ ] Dimension 2 Visuals: PASS (no bento, no glassmorphism, no shadows, no scale-hover, no rounded cards, no carousel, no skill bars; one earned motion moment only)
- [ ] Dimension 3 Color: PASS (60/30/10 maintained; explicit accent reserved-for list; first accent-as-fill activation is the single active-filter chip case with verified AAA contrast; danger token still unused)
- [ ] Dimension 4 Typography: PASS (no new sizes or weights; reuses Phase 3 5-size / 3-weight ceiling; display-mono override on `/projects` heading is a token *composition*, not a new role)
- [ ] Dimension 5 Spacing: PASS (4px base, all values on the scale; tag-chip hit-area exception documented; tier-separator padding documented)
- [ ] Dimension 6 Registry Safety: PASS (no registries; no shadcn init; no third-party blocks; carries forward Phase 1's strategy)

**Approval:** pending — awaiting gsd-ui-checker.
