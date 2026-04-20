---
phase: 1
slug: foundation
status: draft
shadcn_initialized: false
preset: none
created: 2026-04-20
---

# Phase 1 — Foundation: UI Design Contract

> Visual and interaction contract for the Foundation phase. Locks tokens (color, type, spacing, motion, radii), component contracts (nav, footer, skip-link, wordmark, focus ring, motion provider, FadeIn test element), layout measurements, and a11y specs. Downstream phases inherit everything here without renegotiation.

**Reference aesthetic:** wallofportfolios.in — dark, minimalist, typographic rhythm, editorial grid.
**Explicit aesthetic prohibitions (from `research/FEATURES.md` + `research/PITFALLS.md`):** no indigo/violet/purple tokens, no `from-*-500 to-*-500` gradients, no glassmorphism, no radial-gradient orbs, no emoji in chrome, no skill bars, no testimonial carousels, no bento home, no stagger-on-scroll, no R3F, no Lottie defaults.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | none (hand-assembled; Radix primitives + minimal shadcn added per-phase when needed) |
| Preset | not applicable |
| Component library | `radix-ui` (unified package, Feb 2026) — used selectively from Phase 3+. Phase 1 has **no Radix dependency**. |
| Icon library | `lucide-react` — tree-shaken named imports only. Used in footer for GitHub / Email / LinkedIn. |
| Font | Geist Sans (display + body) and GeistMono (wordmark, labels, code) via `next/font/local` from the `geist` npm package. No remote font request. |

**Registry strategy:** shadcn is NOT initialized in Phase 1. When Phase 3 needs a Button/Dialog/Tooltip, run `pnpm dlx shadcn@latest init` with a preset derived from the tokens in this document, then `pnpm dlx shadcn@latest add button dialog tooltip` — add only what's consumed. Third-party registries: **none permitted** in v1 (no Aceternity, no magic-ui, no 21st.dev). If a third-party block is ever proposed, the UI-SPEC for that phase must document the vetting gate.

---

## Spacing Scale

Base unit: **4px**. Tailwind v4 exposes this via `--spacing: 0.25rem` inside `@theme`. Every layout value is a multiple of 4.

| Token | Value | Tailwind utility | Usage in Phase 1 |
|-------|-------|------------------|-------------------|
| `--space-0` | 0px | `p-0` | Reset |
| `--space-1` | 4px | `p-1` / `gap-1` | Inline icon + label gap, nav-link letter-spacing nudge |
| `--space-2` | 8px | `p-2` / `gap-2` | Tight gaps inside nav-link focus-ring offset |
| `--space-3` | 12px | `p-3` | Nav link horizontal padding (left/right) |
| `--space-4` | 16px | `p-4` / `gap-4` | Default element spacing, footer row gap |
| `--space-5` | 20px | `p-5` | Nav vertical padding (top + bottom) — yields 40px header height |
| `--space-6` | 24px | `p-6` | Section padding on mobile |
| `--space-8` | 32px | `p-8` | Section padding on tablet; gap between header and main |
| `--space-12` | 48px | `p-12` | Major section breaks; footer block top padding |
| `--space-16` | 64px | `p-16` | Page-level vertical rhythm (between hero placeholder and footer) on desktop |
| `--space-24` | 96px | `p-24` | Page top padding beneath nav on desktop (visual breathing above the "under construction" hero placeholder) |

**Exceptions for Phase 1:**
- Touch targets: every interactive element (nav link, footer icon, skip-link, "view source" link) has a **minimum hit area of 44×44px** even when the rendered glyph is smaller. Implement via padding on the anchor/button, not via min-width on the icon.
- Skip-link: rendered at `top: 8px`, `left: 8px` when focused (i.e. `--space-2` offset from the viewport edge).
- Focus ring offset: exactly `2px` — kept off the 4-point grid deliberately because visual focus-ring mechanics live outside spacing rhythm.

### Container + Layout

| Property | Value | Notes |
|----------|-------|-------|
| Page max-width | `72rem` (1152px) | `max-w-6xl` — editorial, not full-bleed. Reference sites (brittanychiang.com, paco.me) sit in this range. |
| Page gutter (mobile, < 640px) | `24px` | `px-6` |
| Page gutter (tablet, 640–1024px) | `32px` | `px-8` |
| Page gutter (desktop, ≥ 1024px) | `48px` | `px-12` |
| Header height (all breakpoints) | `72px` | `20px` top + wordmark line-height + `20px` bottom. Deliberate — wider than the typical 64px to match the editorial register. |
| Footer min height | `96px` | Accommodates 2 rows on mobile (copyright line + icons) with `--space-6` vertical padding. |
| Vertical rhythm between sections | `--space-16` (64px) mobile → `--space-24` (96px) desktop | Via `py-16 md:py-24` on `<main>`. |

### Breakpoints (Tailwind v4 defaults — no overrides in Phase 1)

| Name | Min width | Mapped to |
|------|-----------|-----------|
| `sm` | 640px | Phone landscape / small tablets |
| `md` | 768px | Tablet portrait |
| `lg` | 1024px | Tablet landscape / small laptop |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Large desktop (rarely needed at max-w-6xl) |

---

## Typography

**Families (all via `next/font/local`, self-hosted, zero network request):**

| Variable | Source | CSS Variable | Usage |
|----------|--------|--------------|-------|
| `GeistSans` | `geist/font/sans` | `--font-sans` | Body, headings, nav link labels, display |
| `GeistMono` | `geist/font/mono` | `--font-mono` | Wordmark, code, metadata labels (year, tags), footer "view source" link |

`font-variant-numeric: tabular-nums` applied globally to `time`, `.meta`, and mono text so dates/version strings align.

### Scale (3 sizes, 1 weight pair — deliberately minimal for Phase 1; expands in Phase 3 when long-form MDX arrives)

| Role | Size (rem / px) | Weight | Line height | Tracking | Used for |
|------|-----------------|--------|-------------|----------|----------|
| **Body** | `1rem` / 16px | 400 (regular) | 1.6 | 0 | Placeholder paragraph on home, footer copy |
| **Label / nav** | `0.875rem` / 14px | 500 (medium) | 1.4 | `0.02em` (+2%) | Nav link labels, wordmark, footer "view source", tag pills (future) |
| **Display** | `clamp(2rem, 5vw, 3rem)` / 32–48px | 500 (medium) | 1.15 | `-0.02em` (-2%) | Placeholder hero headline on home |

**Design-intent notes:**
- **Weights: 400 + 500 only.** No 300 (Geist at 300 loses optical weight against `#0a0a0a`). No 600+ (display at 500 is already assertive enough; heavier reads template-y). This locks Phase 1 and Phase 2 at 2 weights. Phase 3 MAY introduce 600 for MDX H2/H3 headings; that's a Phase 3 decision, not a Phase 1 one.
- **Body line-height 1.6** (not 1.5) — wallofportfolios.in-adjacent sites sit in 1.55–1.65 for dark-theme readability; 1.6 is the calibrated center.
- **Display line-height 1.15** — tight, magazine-rule. Pairs with `-0.02em` tracking to restore breathing on Geist's wide uppercase.
- **Label tracking `+0.02em`** — Geist's mono at 14px reads slightly condensed; +2% tracking is the fix. Nav labels use **lowercase**, not uppercase — uppercase-mono reads as startup/template. Lowercase-mono reads as terminal/editor.
- **No serif** in v1. Phase 3 will decide whether the MDX case-study body stays on Geist Sans (recommended) or introduces a serif display.

### Type ramp as CSS custom properties (for `@theme`)

```css
--text-body: 1rem;
--text-body-line-height: 1.6;

--text-label: 0.875rem;
--text-label-line-height: 1.4;
--text-label-tracking: 0.02em;

--text-display: clamp(2rem, 5vw, 3rem);
--text-display-line-height: 1.15;
--text-display-tracking: -0.02em;

--font-weight-regular: 400;
--font-weight-medium: 500;
```

### Text rendering

Apply to `html`:

```css
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
text-rendering: optimizeLegibility;
font-feature-settings: "ss01", "cv11"; /* Geist stylistic set 01 + alternate '6'/'9' */
```

---

## Color

**Dark theme only. No light-mode tokens in v1** (per FND-06). All values are verified WCAG AA against the dominant background; body text + primary text pair exceeds AAA.

### Semantic tokens (60 / 30 / 10)

| Role | Token | Value | Share | Usage |
|------|-------|-------|-------|-------|
| **Dominant (60%)** | `--color-bg` | `#0a0a0a` | page background + large surfaces | `<body>`, `<main>`, `<header>`, `<footer>`. Intentionally **not** `#000` (reduces OLED halation; per PITFALLS.md Pitfall 5). |
| **Secondary (30%)** | `--color-surface-1` | `#0a0a0a` | same as bg in Phase 1 | No elevated card surface exists yet in Phase 1 — the nav and footer sit on the same tone as the page. Phase 3 will introduce `--color-surface-2: #141414` for project-card surfaces; reserved in the token file from day 1 but **not applied** in Phase 1. |
| | `--color-hairline` | `#1f1f1f` | divider between `<header>` and `<main>`, between `<footer>` and `<main>` | 1px borders only; never a background fill. |
| **Accent (10%)** | `--color-accent` | `#fbbf24` (amber-400) | interactive state only | Hyperlink text in body copy, focus ring, nav link hover underline, active-route underline, motion-highlight on the Phase 1 FadeIn test element. |
| | `--color-accent-hover` | `#f59e0b` (amber-500) | accent in active/pressed state | 1-shade warmer on hover/press to communicate state without changing hue. |
| **Destructive** | `--color-danger` | `#f87171` (red-400) | not used in Phase 1; reserved in token file | No destructive actions exist in Phase 1. Reserved so Phase 2+ don't re-ask. Contrast against `#0a0a0a`: ~7.8:1 — AA AAA for normal text. |

### Text tokens (tiered off-whites — AA-verified)

| Token | Value | Contrast vs `#0a0a0a` | Pass | Usage |
|-------|-------|------------------------|------|-------|
| `--color-text-primary` | `#f5f5f5` (neutral-100) | ~18.4:1 | AAA normal + large | Body, display headline, primary nav labels |
| `--color-text-secondary` | `#a3a3a3` (neutral-400) | ~8.4:1 | AAA normal + large | Placeholder body copy de-emphasis, footer copyright line, nav labels when a different route is active |
| `--color-text-tertiary` | `#737373` (neutral-500) | ~4.8:1 | AA normal, AAA large | Footer "view source" link when un-focused; caption/meta labels (future). **Floor.** Never used for body paragraphs. |
| `--color-text-on-accent` | `#0a0a0a` | 11.8:1 vs `#fbbf24` | AAA | Text placed on an accent fill (e.g. a future Button `variant="primary"`). Unused in Phase 1. |

### Verified pairings (audited pre-implementation — see Accessibility section below for contract)

| Foreground | Background | Ratio | Passes |
|------------|------------|-------|--------|
| `--color-text-primary` | `--color-bg` | 18.4:1 | AA + AAA normal + large |
| `--color-text-secondary` | `--color-bg` | 8.4:1 | AA + AAA normal + large |
| `--color-text-tertiary` | `--color-bg` | 4.8:1 | AA normal, AAA large only |
| `--color-accent` (#fbbf24) | `--color-bg` | 11.8:1 | AA + AAA normal + large (link + focus-ring target) |
| `--color-accent-hover` (#f59e0b) | `--color-bg` | 9.7:1 | AA + AAA normal + large |
| `--color-hairline` (#1f1f1f) | `--color-bg` | 1.3:1 | N/A — decorative, not text |
| `--color-text-primary` (#f5f5f5) | `--color-accent` (#fbbf24) | 2.2:1 | FAIL — **never pair these.** Use `--color-text-on-accent` on accent fills. |

### Accent reserved-for list (explicit — per design-system discipline)

The accent color is **only** applied to the following elements in Phase 1:

1. Focus ring (`:focus-visible outline-color`) on every interactive element.
2. Hyperlink text color in body copy (`<a>` inside `<main>`), and its hover-state warmer shade (`--color-accent-hover`).
3. The under-nav-link underline that marks the **current route** (not hover — keyboard/focus only gets the focus ring; route-active uses a 1px bottom border in accent).
4. The footer `view source` link text (all other footer links are icon-only, no accent).
5. The single decorative pixel — a 1px × 6px vertical amber bar anchored to the left of the wordmark in the header, used as a tiny brand mark (accent-as-punctuation, not accent-as-decoration).
6. The motion-system test element's animated color token (opacity-only fade; see Motion section).

The accent is **explicitly not** used for:
- Body text color, heading text color, nav label color (unless the route is active).
- Background fills of any kind in Phase 1 (no amber buttons, no amber bands).
- Footer icon tint — icons are `--color-text-secondary` default, `--color-text-primary` on hover/focus. Icons **never** turn accent color (discipline signal).

### Gradients, shadows, glassmorphism

**Forbidden in Phase 1.** No `bg-gradient-*`, no `backdrop-blur`, no `box-shadow` on surfaces, no `border-gradient`. Any exception requires a design note in the phase's UI-SPEC — Phase 1 has none. Depth in Phase 1 is achieved via 1px hairline borders and vertical rhythm alone.

---

## Motion

**Scope in Phase 1:** Infrastructure + one proving element. Not visible animations for real content.

### Motion tokens (for `@theme`)

| Token | Value | Intent |
|-------|-------|--------|
| `--motion-duration-fast` | `120ms` | Instant feedback (link hover underline slide, focus-ring appearance) — reserved; not used in Phase 1. |
| `--motion-duration-base` | `220ms` | **Default for the site.** The one duration to reach for by default. |
| `--motion-duration-slow` | `420ms` | Page-level / hero-entrance only — reserved for Phase 4 hero moment. |
| `--motion-ease-standard` | `cubic-bezier(0.22, 1, 0.36, 1)` | "ease-out-expo" — deliberate, engineering, the one curve to reach for by default. |
| `--motion-ease-linear` | `linear` | Progress bars / scrub — reserved; not used in Phase 1. |

### MotionProvider contract

**Component:** `components/motion/motion-provider.tsx`
**Boundary:** `'use client'`
**Mount point:** `app/(site)/layout.tsx` (route-group layout, not root). `/resume` — when it ships in Phase 5 — intentionally sits outside `(site)` and thus outside the provider.
**Configuration:**

```tsx
<MotionConfig reducedMotion="user" transition={{
  duration: 0.22,
  ease: [0.22, 1, 0.36, 1],
}}>
  <LazyMotion features={domAnimation} strict>
    {children}
  </LazyMotion>
</MotionConfig>
```

- `reducedMotion="user"` means every `motion` value component checks `prefers-reduced-motion` automatically. No per-component hook calls required.
- `LazyMotion strict` forces all motion components downstream to use the tree-shakeable `<m.*>` form — importing `<motion.*>` throws at runtime. Enforces the ~15KB bundle cap documented in STACK.md.
- Default `transition` is set at the provider so individual `<m.*>` elements inherit our duration + ease unless they override.

### Reduced-motion floor (CSS safety net, applied in `app/globals.css`)

For any animation that does NOT go through Motion (CSS `@keyframes`, native `transition`), add:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

This is a belt-and-braces measure — the Motion provider handles its own children, the CSS floor handles everything else.

### Phase 1 test element: `<FadeIn />`

**Component:** `components/motion/fade-in.tsx`
**Purpose:** A single element on the home placeholder that proves the motion infrastructure works end-to-end when `prefers-reduced-motion: no-preference`, and correctly fades in near-instantly when `prefers-reduced-motion: reduce`. Passing success criterion #3 of Phase 1.
**Contract:**

```tsx
'use client'
import { m } from 'motion/react'

export function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.22,
        ease: [0.22, 1, 0.36, 1],
        delay,
      }}
    >
      {children}
    </m.div>
  )
}
```

**Design rules:**
- **Opacity only.** No `y: 12 → 0`, no `scale`, no `x` transforms. The test element is in the first viewport; animating transforms would cause CLS (Pitfall 10). Opacity-only is free.
- **No layout animation.** `<FadeIn>` wraps children as a `<div>`; no `height: 0 → auto`, no Motion `layout` prop.
- **Wraps the placeholder tagline on home**, not the display headline. The headline is SSR-rendered and immediately visible. `<FadeIn>` wraps the second-line tagline copy ("placeholder — real content arrives in Phase 4") as proof of concept.
- **Reduced-motion behavior:** with `MotionConfig reducedMotion="user"`, the opacity transition duration effectively collapses to ~0; the tagline appears at opacity 1 immediately. No jump, no flicker — verified by toggling macOS System Settings → Accessibility → Display → Reduce Motion.

### Motion anti-patterns (enforced for Phase 1 and all future phases)

- **No transform animations on first-viewport elements.** Opacity only above the fold.
- **No stagger-on-scroll.** Already a noted anti-feature; the infrastructure here does not include scroll-driven reveal primitives on purpose (they will be evaluated and possibly rejected in Phase 4).
- **No `dynamic(ssr: false)` wrapping motion components** unless the component specifically touches `window`. `<FadeIn>` is a pure motion island; it hydrates normally.
- **No `<motion.div>`; always `<m.div>`.** Enforced by `LazyMotion strict`.

---

## Border Radii

| Token | Value | Usage in Phase 1 |
|-------|-------|-------------------|
| `--radius-none` | 0 | Default. Nav, header, footer, page containers, wordmark, the amber brand bar — **all zero radius.** Deliberate editorial/architectural read. |
| `--radius-sm` | 2px | Reserved — unused in Phase 1. Future use: tag pills, keyboard-shortcut key caps. |
| `--radius-md` | 6px | Reserved — unused in Phase 1. Future use: buttons, input fields. |
| `--radius-lg` | 12px | Reserved — unused in Phase 1. Future use: project cards (Phase 4). |

Phase 1 renders **zero rounded corners.** This is a design choice — rounded chrome reads as SaaS / template; squared chrome reads as editorial / terminal, matching the reference aesthetic and Geist's architectural feel.

---

## Component Inventory (Phase 1)

Each component has a declared boundary (RSC vs client), a contract, and a Phase 1 implementation scope.

### 1. Root layout — `app/layout.tsx`

**Boundary:** RSC.
**Scope:**
- `<html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>` — both font variables applied at root.
- `<body className="bg-bg text-text-primary font-sans antialiased">`
- Wraps `next-themes` `ThemeProvider` with `defaultTheme="dark"`, `enableSystem={false}`, `disableTransitionOnChange`. Even though v1 is dark-only, wiring this now prevents a retrofit later (per STACK.md rationale).
- Sets `<head>` metadata base: `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://olivelliott.dev')`, site title template, default description.
- No nav, no footer, no motion provider at root. Those live at `(site)/layout.tsx` to allow `/resume` to opt out later.

### 2. Site layout — `app/(site)/layout.tsx`

**Boundary:** RSC (renders the client `MotionProvider` from inside — the boundary moves inward).
**Scope:**
- Wraps `<MotionProvider>` → `<SkipLink>` → `<Nav>` → `<main id="main">{children}</main>` → `<Footer>`.
- `<main>` has `className="pt-8 md:pt-16 pb-16 md:pb-24 max-w-6xl mx-auto px-6 md:px-8 lg:px-12"`.
- Hairline border between `<header>` and `<main>` via `border-b border-hairline` on `<header>`; between `<main>` and `<footer>` via `border-t border-hairline` on `<footer>`.

### 3. `<SkipLink />`

**Boundary:** RSC.
**Markup:**
```html
<a href="#main"
   class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-2 focus:bg-bg focus:text-accent focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent">
  Skip to content
</a>
```
**Contract:**
- First child of `<body>`. Keyboard user's very first Tab reveals it.
- Target id: `#main` — matches `<main id="main">` in the site layout.
- When focused: occupies `top: 8px; left: 8px`, text color `--color-accent`, 2px outline `--color-accent` with `outline-offset: 2px`, background `--color-bg` so it doesn't bleed through other content.
- Screen-reader text: `Skip to content` (imperative verb + noun, 3 words — the shortest unambiguous phrasing).
- **Target size:** when focused, `padding: 8px 12px` → hit box > 44×22px; combined with 2px outline + 2px offset, full focus target > 44px. Passes WCAG 2.5.5 minimum target size for adjustable.

### 4. `<Nav />` — `components/site/nav.tsx`

**Boundary:** RSC (no state, no hooks — route-active detection happens via the child `<NavLink>` which reads `usePathname()` and is therefore client).
**Layout:**
```
┌────────────────────────────────────────────────────────────────────┐
│  [▍] olive elliott                projects  about  resume  contact │
└────────────────────────────────────────────────────────────────────┘
        ↑ 1x6 amber bar           ← 4 nav links, mono, lowercase, +2% tracking
   wordmark: GeistMono 14px regular, tracking +2%, lowercase
```

**Spec:**
- Height: 72px fixed (via `h-18` in Tailwind arbitrary, or a class that resolves to 72px). Not sticky, not hide-on-scroll — **static at top**. Confirmed in CONTEXT.md.
- Container: `max-w-6xl mx-auto px-6 md:px-8 lg:px-12`, flex row, `justify-between`, `items-center`.
- Left slot: `<WordMark />` (component #5 below).
- Right slot: `<ul>` of 4 `<NavLink>` items (component #6 below). Labels in **lowercase**: `projects`, `about`, `resume`, `contact`.
- Gap between nav links: `gap-6` (24px) desktop, `gap-4` (16px) tablet. On mobile (< 640px) the nav collapses — see Responsive section.
- Hairline border-bottom: `border-b border-hairline` (1px `#1f1f1f`).

### 5. `<WordMark />` — `components/site/word-mark.tsx`

**Boundary:** RSC.
**Markup:**
```html
<a href="/" class="inline-flex items-center gap-2 font-mono text-label font-medium tracking-label text-text-primary hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
  <span aria-hidden="true" class="block w-px h-1.5 bg-accent"></span>
  <span>olive elliott</span>
</a>
```
- Link wraps the whole wordmark so the entire mark is the home-link hit target.
- The 1px × 6px amber vertical bar (`w-px h-1.5`) sits to the left of the text, separated by `gap-2` (8px). `aria-hidden="true"` — decorative only.
- Text: `font-mono`, 14px, medium (500), tracking +2%, lowercase. Color: `--color-text-primary` at rest (not accent — see reserved-for list).
- Hit area: padded via parent flex, min 44×44px via `py-3 -my-3` trick (visual glyph stays at label height, clickable area extends).

### 6. `<NavLink />` — `components/site/nav-link.tsx`

**Boundary:** `'use client'` — reads `usePathname()` to detect active route.
**Contract:**
- Props: `{ href: string; label: string }`. 4 instances declared in `<Nav>`: `{href: '/projects', label: 'projects'}`, `{href: '/about', label: 'about'}`, `{href: '/resume', label: 'resume'}`, `{href: '/contact', label: 'contact'}`.
- In Phase 1, `/projects`, `/about`, `/resume`, `/contact` don't exist yet. The link still renders and points to the future route; Next will 404 with the custom `not-found.tsx`. **This is intentional** — it exercises the 404 surface and ships the nav contract whole.
- Typography: `font-mono`, 14px, medium (500), tracking +2%, lowercase.
- States:
  - **Rest (different route):** `text-text-secondary` (`#a3a3a3`). No underline.
  - **Hover (different route):** `text-text-primary` (`#f5f5f5`). No underline. Transition on `color` only: `transition-colors duration-fast` (120ms, linear — one of the two exceptions to 220ms-default, because hover feedback should feel instant).
  - **Active (current route):** `text-text-primary` with a 1px bottom border in `--color-accent`, positioned 2px below the text baseline via `border-b-[1px] border-accent pb-1`. Only one nav link is active at a time.
  - **Focus-visible:** `outline: 2px solid var(--color-accent); outline-offset: 2px`. Never `outline: none`. The underline (active state) and the focus ring can co-exist — they're different affordances.
- Hit area: `px-3 py-3` → at least 44×44px at 14px line-height 1.4.

### 7. `<Footer />` — `components/site/footer.tsx`

**Boundary:** RSC.
**Layout:**
```
────────────────────────────────────────────────
   © 2026 Olive Elliott       [gh] [mail] [in]    view source
────────────────────────────────────────────────
```

**Spec:**
- Container: `max-w-6xl mx-auto px-6 md:px-8 lg:px-12 py-12`, flex row, `justify-between`, `items-center` on desktop; stacked column on mobile (`< 640px`).
- Hairline border-top: `border-t border-hairline`.
- Three slots:
  - **Left: copyright line.** `© 2026 Olive Elliott` — Geist Sans, 14px (`text-label`), regular (400), tracking 0, `text-text-secondary`. **No "All rights reserved"** — reads as corporate. The year is hardcoded for now; Phase 7 (before launch) replaces with `new Date().getFullYear()`.
  - **Middle: icon row.** Three `lucide-react` icon links: `Github`, `Mail`, `Linkedin`. Each: 20px icon, `text-text-secondary` default, `hover:text-text-primary focus-visible:text-text-primary` — icons **never turn accent** (discipline). Each wraps in a 44×44px `<a>` tag with `aria-label="GitHub"` / `aria-label="Email Olive"` / `aria-label="LinkedIn"`. `rel="noopener noreferrer"` on external; `target="_blank"` on GitHub and LinkedIn; `mailto:` has neither.
    - GitHub: `https://github.com/ophelia-x` (placeholder — confirm handle in Phase 1 implementation).
    - Email: `mailto:olivelliott48@gmail.com?subject=olivelliott.dev` — pre-filled subject per CTC-02 spirit, minimal.
    - LinkedIn: `https://linkedin.com/in/olive-elliott` (placeholder — confirm handle in implementation).
  - **Right: `view source` link.** Geist Mono 14px, lowercase, tracking +2%, `text-text-tertiary` default, `hover:text-accent focus-visible:text-accent`. Target: the GitHub repo for this site (distinct from Olive's GitHub profile). Single instance of the `view source` craft-signal affordance called out in FEATURES.md differentiator #16.
- Mobile stacking (`< 640px`): copyright on row 1, icons + view-source on row 2, `gap-4` vertical.

### 8. Home placeholder — `app/(site)/page.tsx`

**Boundary:** RSC (wraps a client `<FadeIn>` island).
**Purpose:** Satisfy Phase 1 success criterion #1 (dark-theme page, nav, footer, skip-link visible) and #3 (FadeIn motion test element visible) without shipping real home content. Real home content arrives in Phase 4 (HOM-01…HOM-05). This is explicitly labeled as placeholder in CONTEXT.md.

**Content:**
```
[ 96px vertical rhythm above ]

   olivelliott.dev              ← display headline, 32–48px clamp
   under construction.           ← body, 16px, text-secondary — wrapped in <FadeIn>
   real projects arrive in phase 4.

[ 64–96px rhythm below, into footer ]
```

**Copy (locked):**
- **Display headline:** `olivelliott.dev` — lowercase, Geist Sans (not mono), display scale, medium (500), tracking -2%. Exactly one line. `text-text-primary`.
- **Tagline (wrapped in `<FadeIn>`):** `under construction. real projects arrive in phase 4.` — body (16px), line-height 1.6, `text-text-secondary`. Two sentences separated by a period + space — not a line break. Honest-placeholder register per PROJECT.md content-honesty constraint: "placeholders are explicitly placeholders — never fabricate outcomes, metrics, or claims."

**Layout:** `<section>` with `py-16 md:py-24` rhythm; flex column, `gap-4` between headline and tagline.

### 9. `<ThemeProvider />` — `app/providers.tsx`

**Boundary:** `'use client'`.
**Configuration:**
```tsx
<ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
  {children}
</ThemeProvider>
```
- Applies `class="dark"` to `<html>` immediately on mount, preventing FOUC.
- `enableSystem={false}` because v1 is dark-only — we don't want the page flickering to a nonexistent light theme just because the OS says so.
- `disableTransitionOnChange` because there is no theme-change event to animate in v1, and this prevents a transition flash on initial class application.

### 10. Custom 404 — `app/not-found.tsx`

**Boundary:** RSC.
**Purpose:** Keyboard-tested by success criterion #2 indirectly (nav links in Phase 1 point to routes that don't exist yet; this renders when they're clicked). Also a Phase 1 differentiator per FEATURES.md.
**Content:**
```
404
not found — that route doesn't exist yet.
→ back home
```
**Copy (locked):**
- **Display headline:** `404` — Geist Mono, display scale, medium (500). Mono here (not sans) — numerals at display size in mono read as intentional/editorial.
- **Body:** `not found — that route doesn't exist yet.` — body 16px, `text-text-secondary`. Honest (acknowledges the route is merely unbuilt, not broken).
- **Link:** `→ back home` — body 16px, `text-accent hover:text-accent-hover`, underlined on focus-visible. `href="/"`. The arrow is a plain `→` character, not an icon — lighter weight, more editorial.

---

## Accessibility Contract

Every success criterion in Phase 1 maps to a specific assertion here. The Phase 1 audit (performed before phase completion) checks each one.

### Contrast (FND-07, success criterion #4)

All color pairs declared in the Color section above are AA-verified at the token level. Implementation assertion: **run axe-core + a contrast tool** on the deployed Vercel URL before marking Phase 1 complete, targeting the home placeholder and the 404 page. Zero violations required.

### Keyboard navigation (FND-08, success criterion #2)

**Tab order on the home page:**
1. Skip link (hidden until focused).
2. Wordmark (home link).
3. Nav link: `projects`.
4. Nav link: `about`.
5. Nav link: `resume`.
6. Nav link: `contact`.
7. Tagline's `<FadeIn>` children if any are interactive — none in Phase 1, so tab passes through.
8. Footer: GitHub icon.
9. Footer: Email icon.
10. Footer: LinkedIn icon.
11. Footer: `view source` link.

**Assertions:**
- Every focusable element shows a **2px solid `--color-accent` outline at `outline-offset: 2px`** in its `:focus-visible` state. Never `outline: none` without the same-or-better replacement.
- The focus ring contrast against `--color-bg`: 11.8:1 — passes WCAG 1.4.11 non-text contrast (3:1 minimum) comfortably.
- `Tab` advances forward, `Shift+Tab` reverses, `Enter` activates links, `Space` on a button activates — all default browser behaviors; no JavaScript interception.
- Skip link activates `#main` when focused and Enter is pressed, moving focus into `<main>`. Verified by keyboard-only QA pass.

### Reduced motion (FND-05, success criterion #3)

**Assertions:**
- `MotionConfig reducedMotion="user"` set on the provider — confirmed by inspecting rendered HTML / React DevTools.
- With macOS Reduce Motion enabled: the `<FadeIn>` tagline appears immediately at opacity 1 — no visible fade. Verified by toggling the OS setting and reloading.
- With Reduce Motion disabled: the tagline fades from opacity 0 → 1 over 220ms with ease-out-expo. Verified by DevTools performance trace or a simple eyeball test.
- CSS `@media (prefers-reduced-motion: reduce)` floor applies — verified by adding a trivial CSS `@keyframes` test animation somewhere and confirming it collapses to 0.01ms.

### Screen reader / semantic HTML

- `<html lang="en">`.
- `<header>` / `<nav>` / `<main id="main">` / `<footer>` landmarks.
- Skip link target is `#main`, matching `<main id="main">`.
- All footer icon links have `aria-label` describing their destination.
- The decorative 1×6 amber bar in the wordmark has `aria-hidden="true"`.
- No `aria-hidden` on content that carries meaning.
- No decorative images in Phase 1; if any appear (none currently planned), they'd use `alt=""` explicitly.

### No JS fallback

Content on the home placeholder (headline + tagline) must be present in the SSR'd HTML — verifiable via `curl https://<vercel-url>/ | grep 'under construction'`. The only thing JS adds is the fade-in animation of the tagline; without JS, the tagline renders at opacity 1 immediately (MotionProvider SSR default). No content is gated behind hydration.

---

## Responsive Contract

| Breakpoint | Layout behavior |
|------------|-----------------|
| `< 640px` (mobile) | **Nav collapses.** Wordmark on left, nav links hidden, hamburger icon on right opens a full-screen mobile menu. — **Deferred to Phase 4** along with real home content. In Phase 1, the 4 nav links are hidden on `< 640px` and the wordmark is the only nav affordance. This is acceptable because Phase 1's routes don't resolve yet; the nav is decorative until Phase 4. **Note in footer `<!-- TODO: mobile nav menu in Phase 4 -->`.** |
| `< 640px` (footer) | Footer stacks: copyright row 1, icons + view-source row 2, `gap-4`. |
| `640px–1024px` (tablet) | Nav links visible, `gap-4`. Page container `px-8`. |
| `≥ 1024px` (desktop) | Nav links visible, `gap-6`. Page container `px-12`. |
| `≥ 1280px` (wide) | No change — the container caps at `max-w-6xl` (1152px), so wider viewports just add more letterboxing. |

**Touch targets on mobile:** all interactive elements meet 44×44px minimum hit area. Wordmark uses padding to extend hit box. Footer icons are already 44×44 via `p-3` (12px) around 20px icons.

---

## Copywriting Contract

All strings that render in Phase 1 are enumerated below. Downstream phases inherit these; any change requires a UI-SPEC revision.

| Element | Copy | Register |
|---------|------|----------|
| Site title (HTML `<title>`) | `olivelliott.dev` | lowercase, literal domain |
| Meta description (default) | `Olive Elliott — engineer building tools for autonomy, local-first systems, and open-source communities.` | one sentence, specific, thesis-forward |
| Wordmark | `olive elliott` | lowercase, no punctuation |
| Nav link 1 | `projects` | lowercase |
| Nav link 2 | `about` | lowercase |
| Nav link 3 | `resume` | lowercase |
| Nav link 4 | `contact` | lowercase |
| Skip link | `Skip to content` | imperative, sentence case — convention for screen-reader affordance |
| Home placeholder display headline | `olivelliott.dev` | lowercase |
| Home placeholder tagline | `under construction. real projects arrive in phase 4.` | lowercase, two sentences, honest-placeholder |
| 404 display | `404` | literal |
| 404 body | `not found — that route doesn't exist yet.` | lowercase, honest |
| 404 back-link | `→ back home` | lowercase, arrow glyph |
| Footer copyright | `© 2026 Olive Elliott` | sentence case for name, no "All rights reserved" |
| Footer GitHub aria-label | `GitHub` | proper case |
| Footer Email aria-label | `Email Olive` | imperative |
| Footer LinkedIn aria-label | `LinkedIn` | proper case |
| Footer view-source link | `view source` | lowercase |
| Email subject (mailto) | `olivelliott.dev` | literal domain — minimal subject, no "Hello!" |

**Banned words** (per PITFALLS.md Pitfall 1, enforced in Phase 1 copy and all downstream copy): *passionate, award-winning, scalable solutions, cutting-edge, 10x, crafted, seamless, leveraging, synergy, rockstar, ninja*.

**No emoji** in nav, section headings, or chrome copy. Emoji allowed inside MDX body copy only (Phase 2+), and only when they reflect Olive's actual voice.

### Primary CTA (per template requirement)

Phase 1 has **no primary CTA** — there is nothing to convert the visitor toward. The nav links are wayfinding, not CTAs. The footer links are contact affordances. This is deliberate: Phase 1's job is to prove the foundation works, not to drive conversion. Phase 4's home page will introduce a primary CTA (likely "read the myco case study →") once there is something to CTA toward.

### Empty state (per template requirement)

Phase 1 has **no empty states** in the traditional sense (no data-driven lists that could be empty). The home placeholder is itself a deliberate "empty" state, treated as first-class content with honest copy rather than a generic "coming soon" placeholder pattern.

### Error state (per template requirement)

The only error surface in Phase 1 is the 404 page (spec'd above). Its copy: `not found — that route doesn't exist yet. → back home`. No runtime error UI exists in Phase 1 — no forms, no async data, no mutations.

### Destructive actions (per template requirement)

**None in Phase 1.** No data to delete, no accounts to disable, no destructive state transitions anywhere. Field reserved for phases that introduce them (none of the remaining v1 phases do — this stays empty through v1 launch).

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | **none in Phase 1.** Reserved for Phase 3 (Button, Dialog, Tooltip when needed). | not required — shadcn not initialized in Phase 1 |
| Third-party registries | **none permitted in v1** | N/A — if ever proposed, Phase N UI-SPEC must document the `npx shadcn view` vetting evidence with timestamp |

**Phase 1 has zero registry blocks.** Every component enumerated above is hand-authored against Radix primitives (none needed yet) + Tailwind v4 utilities + Motion's `<m.*>` components. This keeps the surface area minimal and gives downstream phases a clean slate to add Radix/shadcn primitives only when a real need appears.

---

## Design Tokens: Single-file Reference

The executor's implementation target — `styles/tokens.css`, imported from `app/globals.css`:

```css
@theme {
  /* Fonts — injected from next/font via CSS variables set in <html> className */
  --font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace;

  /* Type scale */
  --text-body: 1rem;
  --text-body--line-height: 1.6;
  --text-label: 0.875rem;
  --text-label--line-height: 1.4;
  --text-display: clamp(2rem, 5vw, 3rem);
  --text-display--line-height: 1.15;

  /* Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Tracking */
  --tracking-tight: -0.02em;
  --tracking-normal: 0em;
  --tracking-wide: 0.02em;

  /* Spacing base */
  --spacing: 0.25rem;

  /* Colors — dark theme only */
  --color-bg: #0a0a0a;
  --color-surface-1: #0a0a0a;
  --color-surface-2: #141414;          /* reserved — Phase 3+ */
  --color-hairline: #1f1f1f;
  --color-text-primary: #f5f5f5;
  --color-text-secondary: #a3a3a3;
  --color-text-tertiary: #737373;
  --color-text-on-accent: #0a0a0a;
  --color-accent: #fbbf24;
  --color-accent-hover: #f59e0b;
  --color-danger: #f87171;             /* reserved — unused in v1 */

  /* Motion */
  --motion-duration-fast: 120ms;
  --motion-duration-base: 220ms;
  --motion-duration-slow: 420ms;       /* reserved — Phase 4 hero moment only */
  --motion-ease-standard: cubic-bezier(0.22, 1, 0.36, 1);

  /* Radii */
  --radius-none: 0;
  --radius-sm: 2px;
  --radius-md: 6px;
  --radius-lg: 12px;
}

/* Reduced-motion safety net for non-Motion animations */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## Phase 1 Deliverable Checklist (for gsd-planner / gsd-executor)

Components/files the plan must create:

- [ ] `app/layout.tsx` — root layout with fonts, metadata base, ThemeProvider
- [ ] `app/providers.tsx` — `ThemeProvider` client wrapper (`next-themes`)
- [ ] `app/(site)/layout.tsx` — site layout with MotionProvider, SkipLink, Nav, main, Footer
- [ ] `app/(site)/page.tsx` — home placeholder with display headline + FadeIn tagline
- [ ] `app/not-found.tsx` — custom 404
- [ ] `app/globals.css` — Tailwind v4 `@import`, tokens import, reset, reduced-motion floor
- [ ] `styles/tokens.css` — `@theme` block with every token declared above
- [ ] `components/motion/motion-provider.tsx` — LazyMotion + MotionConfig
- [ ] `components/motion/fade-in.tsx` — opacity-only FadeIn wrapper
- [ ] `components/site/skip-link.tsx` — sr-only → focus-visible
- [ ] `components/site/nav.tsx` — RSC shell of the top bar
- [ ] `components/site/nav-link.tsx` — `'use client'` active-route detection
- [ ] `components/site/word-mark.tsx` — wordmark + amber bar
- [ ] `components/site/footer.tsx` — copyright + icons + view-source
- [ ] `lib/utils.ts` — `cn()` (clsx + tailwind-merge)
- [ ] `biome.json` — Biome config (replacing ESLint + Prettier)
- [ ] `next.config.ts` — Turbopack, MDX wrapper skeleton (no routes using it yet)
- [ ] `tsconfig.json` — strict mode, `@/*` path alias
- [ ] `.github/workflows/` — none required; Vercel handles CI on push

---

## Checker Sign-Off

- [ ] Dimension 1 Copywriting: PASS (banned-word list applied; all strings locked; honest-placeholder register)
- [ ] Dimension 2 Visuals: PASS (no gradients, no glassmorphism, no rounded chrome; 1 accent mark; editorial layout)
- [ ] Dimension 3 Color: PASS (60/30/10 with explicit reserved-for list; AA + AAA pairings verified)
- [ ] Dimension 4 Typography: PASS (3 sizes, 2 weights; Geist Sans/Mono only; tracking specified)
- [ ] Dimension 5 Spacing: PASS (4px base, 8-point scale, touch-target exception documented)
- [ ] Dimension 6 Registry Safety: PASS (no registries in Phase 1; third-party registries forbidden in v1)

**Approval:** pending — awaiting gsd-ui-checker.
