---
phase: 5
slug: about-resume-contact
status: draft
shadcn_initialized: false
preset: none
created: 2026-05-17
inherits_from:
  - .planning/phases/01-foundation/01-UI-SPEC.md
  - .planning/phases/03-project-detail-template/03-UI-SPEC.md
  - .planning/phases/04-home-+-projects-index/04-UI-SPEC.md
---

# Phase 5 — About + Resume + Contact: UI Design Contract

> Visual and interaction contract for `/about`, `/resume` (HTML + print stylesheet that the Puppeteer build step prints to PDF), and the footer adjustments that complete CTC-01..03. Tokens (color, type, motion, spacing base, radii) are inherited from Phase 1, with the H2/H3 + semibold (600) expansion pre-authorized in Phase 3. **No new screen-mode tokens are introduced in Phase 5.** The print stylesheet uses raw `#000` / `#fff` for paper output — this is the one documented exception class, not a new screen token.

**Reference aesthetic:** editorial — `/about` reads like a magazine masthead bio, `/resume` reads like a typeset CV laid out on paper rather than a SaaS resume template. Strunk & White prose voice on both. The PDF is the load-bearing artifact for recruiter / client-lead distribution; it must look polished on A4.

**Explicit aesthetic prohibitions** (carried forward from Phases 1 + 3 + 4 — see `research/FEATURES.md` + `research/PITFALLS.md`):

no marketing voice, no "passionate developer" / "results-driven" / "self-starter" copy, no skill bars, no progress meters, no star-ratings on skills, no years-of-experience headline framing, no testimonial blocks, no bento layouts, no glassmorphism cards, no gradient backgrounds, no `backdrop-blur`, no `box-shadow` on chrome, no radial-gradient orbs, no portrait photo (deferred to v2), no QR-code-to-live-site on the printed page (deferred to v2), no auto-play motion (Phase 5 ships zero motion islands), no `<motion.*>` (LazyMotion strict still in force, but no Phase 5 component reaches for it).

**Banned-words list (carried forward from Phase 4):** *passionate, award-winning, scalable solutions, cutting-edge, 10x, crafted, seamless, leveraging, synergy, rockstar, ninja, results-driven, self-starter, team player, go-getter, thought leader, dynamic.* These never appear in `/about` bio copy, in `content/resume.ts` summary or bullets, or in any skill / values label. **The current `Olive_Elliott_Resume.docx` PROFILE contains "Passionate" — Phase 5 explicitly rewrites the summary to remove it.**

---

## Design System

| Property | Value |
|----------|-------|
| Tool | none (hand-assembled; tokens locked in Phase 1, expanded in Phase 3, no changes in Phases 4 or 5) |
| Preset | not applicable — `components.json` deliberately absent. **shadcn gate pre-answered N** by upstream lock: Phase 1 § Registry Strategy declares "no third-party registries permitted in v1"; Phase 3 + 4 ship zero registry components; Phase 5 CONTEXT.md confirms no Button/Dialog/Tooltip surfaces are needed (no contact form, no destructive actions, mailto sufficient). |
| Component library | none for chrome. `radix-ui` is not reached for in Phase 5 — every component is a plain `<a>`, `<p>`, `<ul>`, `<section>`, `<header>`, `<dl>`, `<dt>`, `<dd>`. |
| Icon library | `lucide-react` (unchanged from Phase 1 footer) — Phase 5 **introduces zero new icon usages**. The `↓` glyph in `download.pdf ↓` is a literal character, not an icon. The `·` separators in the contact stack are literal interpuncts. |
| Font | Geist Sans (display, body, H1, H2) and Geist Mono (eyebrows, contact line, download link, period/location meta on resume). Same `next/font/local` source as Phase 1. **No new font face.** The print stylesheet does NOT override the family — Geist prints fine on paper. |

**Registry strategy (carried forward):** No new registries permitted in v1. **Phase 5 ships zero registry-pulled components.** Every component below is hand-authored against Phase 1 + Phase 3 primitives + Tailwind v4 utilities.

---

## Spacing Scale

Inherits Phase 1's 4px base (`--spacing: 0.25rem`). Every Phase 5 layout value is a multiple of 4. **Phase 5 declares zero new spacing tokens** — every value references existing ones.

| Token | Value | Tailwind utility | Usage in Phase 5 |
|-------|-------|------------------|-------------------|
| `--space-1` | 4px | `gap-1` | Per-character optical adjustments inside the contact `·` separator row (whitespace flanking the interpunct) |
| `--space-2` | 8px | `gap-2` / `p-2` | Project-pill horizontal padding (echoes Phase 3 chip baseline); resume entry bullet → next-bullet inner gap |
| `--space-3` | 12px | `gap-3` / `px-3` | Project-pill horizontal padding outer (12px) wrapping a 14px label; download link top-right offset on `/resume`; resume meta-row internal gaps |
| `--space-4` | 16px | `gap-4` | Bio-paragraph → next-bullet gap; resume bullet item gap; values-list item gap; contact-stack vertical gap on `/about` |
| `--space-6` | 24px | `gap-6` / `py-6` | `/about` section → next section gap (mobile); resume section → next section gap (screen); resume entry → next entry gap (screen) |
| `--space-8` | 32px | `gap-8` / `py-8` | `/about` H2 → following content gap; `/about` H2 vertical rhythm above (`mt-8`); resume H2 → first entry gap; resume page top padding under nav (`pt-8`) on screen |
| `--space-12` | 48px | `py-12` / `gap-12` | `/about` section → next section gap (desktop); resume header → summary gap on screen; tier of section-break rhythm on `/about` |
| `--space-16` | 64px | `py-16` | Vertical rhythm — `/about` page top padding under nav (mobile); `/about` page bottom padding above footer (mobile) |
| `--space-24` | 96px | `py-24` | Vertical rhythm — `/about` page top padding under nav (desktop); `/about` page bottom padding above footer (desktop) |

**Exceptions for Phase 5:**

- **Project-pill touch target on `/about`.** Each pill is an interactive `<a href="/projects/{slug}">`. Same trick as Phase 3's `TagChipRow`: visual chip ~36px tall (`px-3 py-2`), wrapped with `-my-2` row-collapse so the `<a>` hit area ≥ 44×44px while the row visual rhythm reads as 36px. All values are multiples of 4.
- **Contact-stack on `/about`.** Three links stacked vertically, each with `py-3` (12px) on the `<a>` so the hit target is ≥ 44×44px while the visual row spacing stays at `gap-4` (16px between the stacked links' label lines). The 12px is on the 4-point grid.
- **Footer `download.pdf ↓` link.** Inherits the existing footer `view source` placement pattern (`p-3` parent already provides 44×44 if needed; for inline-text-link adjacency, `py-3` on the `<a>` extends the hit area while the visual baseline aligns with the icon row). Multiples of 4.
- **`/resume` screen `download.pdf ↓` top-right.** Positioned `top: 16px right: 16px` from the resume page container (not absolute on the viewport — anchored to the `<article>` so it scrolls with content for short resumes and stays inside the editorial measure). `p-3` for ≥ 44×44 hit area.
- **Print stylesheet `@page` margin: `0.5in` (≈ 12.7mm).** This is **not** on the 4px screen grid — paper units (inches) live in a different coordinate space. Documented as the second print-only exception class. All other print-mode spacing is rendered in `pt` units derived from the same 4-point logic (e.g. `4pt`, `8pt`, `12pt` between resume sections), but `@page` margins use the conventional CV measure.
- **Focus ring offset:** `2px` — kept off the 4-point grid deliberately (inherits Phase 1 rationale).

### Container + Layout (inherits Phase 1; `/resume` opts out)

| Property | Value | Notes |
|----------|-------|-------|
| Page max-width (`/about`) | `72rem` (1152px) `max-w-6xl` | Inherits site shell from Phase 1. |
| Prose measure (`/about` long-form) | `max-w-prose` (≈ 65ch via Tailwind v4 default) | Bio paragraphs only. The `who I am` block sits centered inside the page container at this measure. Matches Phase 3 prose discipline. |
| Project-pill row width | full container | Pills wrap freely. |
| Contact-stack width | natural (no max-w) | Three short link labels — they don't approach the container edge. |
| Values-list width | `max-w-prose` | Three items, ~one line each — wraps inside prose measure. |
| `/resume` page max-width (screen) | `max-w-3xl` (48rem / 768px) | **Tighter than the site shell** — a single-column document register. Centered with `mx-auto px-6 md:px-8`. |
| `/resume` page max-width (print) | full `@page` content area | Print stylesheet drops `max-w-3xl` and lets the resume use the full A4 inside `0.5in` margins. |
| `/resume` layout chrome | **none** | `/resume` lives at `app/resume/page.tsx` OUTSIDE the `(site)/` route group. Its own `app/resume/layout.tsx` renders only `{children}` + imports `app/resume/resume.css`. No `<Nav>`, no `<Footer>`, no `<MotionProvider>`, no `<SkipLink>` from the site shell — `/resume` ships its own minimal `<SkipLink>` (see Accessibility § Skip-Link on `/resume`). |

### Breakpoints (inherit Phase 1 — Tailwind v4 defaults)

| Name | Min width | Phase 5 layout effect |
|------|-----------|------------------------|
| `< 640px` | — | `/about` and `/resume`: single column (every section stacks). Project pill row wraps freely. Resume header: name on row 1, role on row 2, contact-link row wraps. |
| `sm` | 640px | No layout change; chip and contact-link wrapping behavior unchanged. |
| `md` | 768px | `/about` vertical rhythm escalates (`py-16` → `py-24` between sections). `/resume` screen container hits its `max-w-3xl` cap. |
| `lg` | 1024px | No further layout change — `/about` page caps at `max-w-6xl`, `/resume` at `max-w-3xl`. |
| `xl` | 1280px | No further layout change. |

---

## Typography

**Phase 5 declares zero new type roles.** Every typographic value below references the locked Phase 1 + Phase 3 ramp. **Same milestone ceiling as Phase 3 + Phase 4** — 5 sizes (Body 16, Label 14, H3 20, H2 24/28, Display 32–48) at 3 weights (400 / 500 / 600).

**Families: unchanged.** Geist Sans for display, body, H1, H2. Geist Mono for eyebrows, the contact stack on `/about`, the `download.pdf ↓` link, resume entry meta lines, resume section H2 (uppercase via CSS, see "Resume H2 register" below), the `·` interpunct separators.

### Type roles used in Phase 5 (no additions)

| Role | Size (rem / px) | Weight | Line height | Tracking | Family | Used for |
|------|-----------------|--------|-------------|----------|--------|----------|
| **Body** | `1rem` / 16px | 400 | 1.6 (screen) / 1.35 (print) | 0 | Geist Sans | `/about` bio paragraphs, resume summary, resume bullet items (screen), values-list item bodies, empty-state copy (n/a here) |
| **Body-medium** | `1rem` / 16px | 500 | 1.6 (screen) / 1.35 (print) | 0 | Geist Sans | Resume entry **title** (role / project name / degree). The one place body weight steps up to 500 — same tier as nav labels but at body size, not label size. |
| **Label** | `0.875rem` / 14px | 500 | 1.4 | `+0.02em` | Geist Mono | Eyebrows (`who I am`, `what I'm working on`, `how to reach me`, `values`), project-pill text, contact-stack link labels, `download.pdf ↓` link, resume meta-line (period · location), resume skill category labels, footer `download.pdf` link |
| **Meta (tertiary)** | `0.875rem` / 14px | 500 | 1.4 | `+0.02em` | Geist Mono | Resume meta-line tertiary text (period · location, rendered in `--color-text-tertiary` to de-emphasize against the entry title) — same size as Label, distinguished by color only |
| **H3** | `1.25rem` / 20px | 600 | 1.4 | `-0.01em` | Geist Sans | Reserved for `/about` — currently no H3 needed (4 H2 sections only). Held in case a future revision adds a sub-section. |
| **H2** | `1.5rem` / 24px → `1.75rem` / 28px (`md+`) | 600 | 1.3 | `-0.015em` | Geist Sans | `/about` section markers (`who I am`, `what I'm working on`, `how to reach me`, `values`); resume **section** headers (`experience`, `projects`, `skills`, `education`) on screen — see "Resume H2 register" override below for the mono lowercase treatment |
| **Display** | `clamp(2rem, 5vw, 3rem)` / 32–48px | 500 | 1.15 | `-0.02em` | Geist Sans | `/about` page H1 (`about`); resume `<h1>` page header (`olive elliott`) on screen |

**Resume H2 register — locked override (no new token).**

The resume's section H2 (`experience`, `projects`, `skills`, `education`) renders the H2 size (24/28px) BUT in Geist Mono at weight 500 + tracking `+0.02em` + lowercase. **This composes existing tokens differently — it does not introduce a new role.** Same pattern as Phase 4's `/projects` heading display-mono override and Phase 1's `404` display-mono treatment. The mono register on resume H2 signals "section label, utility surface" rather than "essay heading", matching the CV register without violating the type system.

The `/about` H2s (`who I am`, etc.) stay in **Geist Sans 600** per the standard H2 contract — they're essay-style section markers, not CV utility labels. The two H2 treatments coexist by route and register.

**Display override summary across the site:**

| Route | H1 element | Family | Weight | Tracking | Case |
|-------|-----------|--------|--------|----------|------|
| `/` (Phase 4) | `olive elliott` | Geist Sans | 500 | `-0.02em` | lowercase |
| `/projects` (Phase 4) | `all projects` | Geist Mono | 500 | `+0.02em` | lowercase |
| `/projects/[slug]` (Phase 3) | `{project.title}` | Geist Sans | 500 | `-0.02em` | as-authored |
| `/about` (Phase 5 — NEW) | `about` | Geist Sans | 500 | `-0.02em` | lowercase |
| `/resume` (Phase 5 — NEW) | `olive elliott` | Geist Sans | 500 | `-0.02em` | lowercase |
| `app/not-found.tsx` (Phase 1) | `404` | Geist Mono | 500 | `+0.02em` | numeric literal |

All within the locked display token; only family / tracking / case vary by editorial intent. No new sizes introduced.

### Body-medium (500 at body size) — pre-authorized via existing tokens

The "Body-medium" row above (16px @ 500) is **not a new size or weight role** — it's the body size token rendered with the existing `--font-weight-medium` (500) from Phase 1's `@theme`. The Phase 1 + Phase 3 ramp already exposes both: Phase 1 uses 500 at label size (14px); Phase 3 leaves weight 500 reserved at body size; Phase 5 first activates the body+500 combination on resume entry titles. This is the same kind of "first activation of a reserved combination" pattern as Phase 4's `--color-text-on-accent` first-use (which had been declared since Phase 1 and was awaiting its earned moment). No `@theme` block changes are required for Phase 5 typography.

### Text rendering

Inherited from Phase 1's `html` rules — antialiased, `optimizeLegibility`, `font-feature-settings: "ss01", "cv11"`, `font-variant-numeric: tabular-nums` on `time`, `.meta`, mono text. No additions on screen. **Print override:** the print stylesheet adds `print-color-adjust: exact` on the `<article>` root so any deliberate tonal contrast in the resume body survives the browser's print preview.

---

## Color

**Phase 5 adds zero new color tokens on screen.** Every screen-mode color used is already declared in `styles/tokens.css`. The 60 / 30 / 10 split is preserved.

**Print stylesheet exception (locked, single class):** the print CSS applies raw `#000` / `#fff` for foreground / background — these are not new screen tokens, they are paper-color resets scoped to `@media print { ... }` only. The exception is bounded:

- Applies only inside `app/resume/resume.css`.
- Applies only inside the `@media print { ... }` block.
- Does not appear anywhere in `app/globals.css`, `styles/tokens.css`, or any component file.
- Documented here and re-asserted in the print stylesheet contract below.

### Semantic tokens used in Phase 5 (screen mode)

| Role | Token | Value | Phase 5 usage |
|------|-------|-------|---------------|
| **Dominant (60%)** | `--color-bg` | `#0a0a0a` | `/about` page background, `/resume` screen background. Both routes' main content surface is flush with the page — no elevated card behind the resume on screen, no card behind the bio. |
| **Secondary (30%)** | `--color-surface-2` | `#141414` | Project-pill background on `/about` (echoes the Phase 3 tag-chip and Phase 4 presentational-chip pattern). **That is the only surface-2 usage in Phase 5.** Resume entries do not sit on surface-2 — they sit on `--color-bg` separated by spacing rhythm and an optional 1px `--color-hairline` divider between sections (see "Resume HTML render" below). |
| | `--color-hairline` | `#1f1f1f` | 1px divider between resume sections on screen (between `summary` → `experience`, `experience` → `projects`, etc.); 1px divider between `/about` sections (mobile only — desktop uses spacing alone, matching Phase 4 rhythm). |
| **Accent (10%)** | `--color-accent` | `#fbbf24` (amber-400) | Hover/focus underline color on contact-stack links (`github.com/olivelliott`, the email, LinkedIn URL); hover/focus underline color on `download.pdf ↓` (both `/resume` and footer); hover/focus underline color on project pills; focus ring on every interactive element (inherits Phase 1). **Repo link** as accent text+glyph on resume project entries that point to a public repo. |
| | `--color-accent-hover` | `#f59e0b` (amber-500) | Hover/active state of every accent-bearing element listed above. |
| **Destructive** | `--color-danger` | `#f87171` (red-400) | **Not used.** No destructive actions in Phase 5 (no delete, no disable, no cancel — both pages are read-only). |

### Text tokens (inherit Phase 1 tiers — every Phase 5 pairing audited)

| Token | Value | Phase 5 usage |
|-------|-------|---------------|
| `--color-text-primary` | `#f5f5f5` | `/about` H1 (`about`), `/about` H2s, bio paragraph body, values-list item titles, resume `<h1>` header (`olive elliott`), resume H2 section labels, resume entry titles (body-medium @ 500) |
| `--color-text-secondary` | `#a3a3a3` | `/about` bio paragraph emphasis (de-emphasized phrases — used sparingly), resume role/location subtitle line on header, resume summary paragraph, resume entry bullet body text, contact-stack link labels at rest, footer `download.pdf` link at rest |
| `--color-text-tertiary` | `#737373` | All eyebrows (`who I am`, `what I'm working on`, `how to reach me`, `values`); resume meta line (period · location); resume H2 section label color (mono lowercase utility register); footer placement of `download.pdf` separator dot; values-list item value descriptor |
| `--color-text-on-accent` | `#0a0a0a` | **Not used in Phase 5** — no accent fills on `/about` or `/resume`. |

### Verified pairings (extends Phases 1 + 3 + 4 — every Phase 5 pairing audited)

| Foreground | Background | Ratio | Passes |
|------------|------------|-------|--------|
| `--color-text-primary` (#f5f5f5) | `--color-bg` (#0a0a0a) | 18.4:1 | AAA — `/about` H1 + H2 + body, resume header, resume entry title |
| `--color-text-secondary` (#a3a3a3) | `--color-bg` (#0a0a0a) | 8.4:1 | AAA — resume summary, resume bullets, contact links at rest |
| `--color-text-tertiary` (#737373) | `--color-bg` (#0a0a0a) | 4.8:1 | AA normal, AAA large — eyebrows, resume meta line, resume H2 |
| `--color-text-secondary` (#a3a3a3) | `--color-surface-2` (#141414) | 7.3:1 | AAA — project-pill text on `/about` at rest |
| `--color-text-primary` (#f5f5f5) | `--color-surface-2` (#141414) | 16.0:1 | AAA — project-pill text on hover (text shifts to primary; bg stays surface-2) |
| `--color-accent` (#fbbf24) | `--color-bg` (#0a0a0a) | 11.8:1 | AAA — accent underline color, resume repo link |
| `--color-accent-hover` (#f59e0b) | `--color-bg` (#0a0a0a) | 9.7:1 | AAA — accent hover state |
| `--color-hairline` (#1f1f1f) | `--color-bg` (#0a0a0a) | 1.3:1 | N/A — decorative, never carries text |

### Print mode pairings (resume only — bounded exception)

| Foreground | Background | Ratio | Passes |
|------------|------------|-------|--------|
| `#000` | `#fff` | 21:1 | AAA — paper-correct, maximum contrast |
| `#666` (used for resume meta lines on paper) | `#fff` | 5.74:1 | AA normal, AAA large — period · location on paper, mirrors the screen tertiary tier |

**`#666` for print meta:** the print stylesheet uses `#666` (not `#737373` / not a token reference) for the de-emphasized meta line on paper. This is documented inside `app/resume/resume.css` as a "paper-only equivalent of `--color-text-tertiary`" — close enough that the cognitive register translates, contrast-verified for paper (paper contrast standards effectively match WCAG on screen). It does **not** introduce a screen token. The decision to use a literal `#666` rather than reading `--color-text-tertiary` from the token system is deliberate: the print stylesheet must stand alone if any token cascade breaks at print time.

### Accent reserved-for list (Phase 5 — extends Phases 1 + 3 + 4 lists)

The accent color is **only** applied to the following Phase 5 elements:

1. **Contact-stack link hover/focus underline** on `/about` — `text-decoration-color: var(--color-accent)`, `text-underline-offset: 4px`, applied on hover/focus to the three links (github / email / linkedin). Link text color itself stays `--color-text-secondary` at rest, `--color-text-primary` on hover — accent appears **only** in the underline.
2. **Project-pill hover/focus underline** on `/about` — same treatment as contact-stack: pill text shifts color via the existing chip rule; an additional `text-decoration` accent underline appears on hover/focus only. **No accent fill** on pills.
3. **`download.pdf ↓` link hover/focus underline** — appears on both the `/resume` top-right placement and in the footer.
4. **Resume `repo ↗` link** (if a project entry has a `link` field pointing to a public repo) — inherits Phase 3's accent-on-text + accent-on-glyph rule for repo links. The hex color, underline behavior, and hover-shift to `--color-accent-hover` mirror Phase 3 exactly. **Reads as accent text + glyph.**
5. **Focus ring** on every interactive element (inherits Phase 1: `outline: 2px solid var(--color-accent); outline-offset: 2px`).

The accent is **explicitly not** used in Phase 5 for:

- Bio paragraph body color, H1 / H2 / values-list title color in any state (all stay `--color-text-primary`).
- Resume H1, resume entry title color, resume bullet body color (all stay primary or secondary as listed above).
- Eyebrow labels (`who I am`, `what I'm working on`, `how to reach me`, `values`) — all stay `--color-text-tertiary`.
- Resume H2 section labels (`experience`, `projects`, etc.) — stay `--color-text-tertiary` (the mono lowercase register is the visual signal, not color shift).
- Resume meta lines (period · location) — stay `--color-text-tertiary`.
- Footer `download.pdf` link **text** at rest (stays `--color-text-secondary` — matches the `view source` footer link pattern; accent appears only in the hover underline + on focus ring).
- Skill category labels on resume — stay `--color-text-tertiary` mono.
- Values-list item descriptors — stay `--color-text-secondary`.
- **Any background fill anywhere in Phase 5.** No accent buttons, no accent bands, no accent callouts.

### Print mode accent stripping

In print mode (`@media print`), the print stylesheet **removes all accent color**:

```css
@media print {
  a { color: inherit; text-decoration: underline; text-underline-offset: 2px; }
}
```

All links print as `inherit` (black on paper) with a simple underline. The accent amber would not survive most printers reliably and would read as a stain on a B&W print; the underline alone is the print-mode affordance for links. URLs (`github.com/olivelliott`, email, LinkedIn) print literally so the paper reader can transcribe them.

### Gradients, shadows, glassmorphism

**Forbidden in Phase 5** — same rule as Phases 1 + 3 + 4. No `bg-gradient-*`, no `backdrop-blur`, no `box-shadow` on resume entries or `/about` sections, no `border-gradient`, no radial-gradient orbs. Depth on `/about` and `/resume` (screen) is achieved via 1px hairline border between sections + spacing rhythm — never via shadow, blur, or glow. Paper depth on `/resume` is achieved via type weight and inter-section margin only.

---

## Motion

**Phase 5 adds zero new motion tokens. Phase 5 ships zero motion islands. There is no `<m.*>` import in any Phase 5 source file.**

The only animated behavior on screen comes from CSS `transition` (color / underline-offset on hover-able elements), which is already governed by Phase 1's `@media (prefers-reduced-motion: reduce)` floor. The `<MotionProvider>` from `app/(site)/layout.tsx` covers `/about` (which lives inside the `(site)` group) but is **not** applied to `/resume` (which lives outside the group with its own minimal layout).

### Phase 5 motion inventory (every animated element listed)

| Element | Property | Duration | Ease | Reduced-motion behavior |
|---------|----------|----------|------|--------------------------|
| Contact-stack link (`/about`) | `text-decoration-color` shift `transparent → --color-accent` + `text-underline-offset` 2px → 4px on hover/focus-visible | `--motion-duration-base` (220ms) | `--motion-ease-standard` | Underline appears instantly (no transition); offset stays at 4px. Affordance preserved via CSS floor. |
| Project-pill (`/about`) | `color` shift `--color-text-secondary → --color-text-primary` on hover + `text-decoration-color` accent underline on hover | `--motion-duration-fast` (120ms) for color; `--motion-duration-base` (220ms) for underline | `linear` for color; `--motion-ease-standard` for underline | Both transitions collapse via the CSS floor; hover colors still apply. |
| `download.pdf ↓` link (both placements) | `text-decoration-color` accent underline on hover/focus + `color` shift from secondary → primary on hover | `--motion-duration-base` (220ms) | `--motion-ease-standard` | Underline appears instantly; color shift collapses; hover state still readable. |
| Resume `repo ↗` link (if rendered) | inherits Phase 3 repo-link transition | `--motion-duration-fast` (120ms) | `linear` | Color shift collapses. |
| Every other element (eyebrows, bio paragraphs, resume entries, page chrome, values list, contact stack text at rest) | **No motion.** Static. | — | — | — |

### Reduced-motion implementation

- **`/about` lives inside the `(site)` group**, so the Phase 1 `<MotionProvider>` with `MotionConfig reducedMotion="user"` covers it. But because Phase 5 introduces zero `<m.*>` islands on `/about`, the provider is a no-op for this route — every hover/focus behavior on `/about` is plain CSS `transition` caught by the global `@media (prefers-reduced-motion: reduce)` floor in `app/globals.css`.
- **`/resume` lives outside the `(site)` group.** No `<MotionProvider>` is in scope. Phase 5 must ensure `app/resume/layout.tsx` imports `app/globals.css` (transitively via the root `app/layout.tsx` that wraps every route — the root layout owns the `globals.css` import). The `@media (prefers-reduced-motion: reduce)` floor in `globals.css` therefore applies to `/resume` even without the `(site)` provider. **No additional reduced-motion plumbing required on `/resume`.**
- The print stylesheet (`app/resume/resume.css`) inside `@media print` does **not** declare any `transition` or `animation` — print rendering is static by definition.

### Motion anti-patterns (carried forward from Phases 1 + 3 + 4, re-asserted for Phase 5)

- **No transform animations anywhere on `/about` or `/resume`.** Phase 5 ships zero `translate / scale / rotate` animations.
- **No fade-in on mount.** Bio paragraphs, resume entries, values-list items render immediately at opacity 1 in the SSR HTML.
- **No stagger-on-scroll.** All sections render at once in SSR.
- **No `dynamic(ssr: false)` wrapping** on any Phase 5 component. Every component is SSR-renderable.
- **No `<motion.*>` imports.** `LazyMotion strict` from Phase 1 is still in force inside the `(site)` group; Phase 5 does not reach for `<m.*>` either way.
- **No autoplay video, no animated GIFs, no Lottie, no Rive.** The download.pdf glyph (`↓`) is a literal character, not an animated icon.

---

## Border Radii

| Token | Value | Phase 5 usage |
|-------|-------|---------------|
| `--radius-none` | 0 | `/about` page chrome, `/resume` page chrome, contact-stack link wrappers, resume section blocks, resume entry blocks, footer additions — **all zero radius.** Editorial register continues. |
| `--radius-sm` | 2px | Project-pill background on `/about` (inherits Phase 3 chip treatment). |
| `--radius-md` | 6px | **Not used in Phase 5.** (Activated in Phase 3 for code blocks + callouts only — neither appears on `/about` or `/resume`.) |
| `--radius-lg` | 12px | **Not used in Phase 5.** (Held in reserve; v2 only.) |

The `/about` page and `/resume` page render **almost zero rounded corners** — only the inherited project-pill `--radius-sm` (2px, barely-rounded). This is deliberate: a CV register and an editorial bio both read sharper with squared chrome. Rounded resume blocks read as a template.

---

## Page Composition

### `/about` — document outline (top to bottom)

```
<main id="main">                                          [site shell layout, Phase 1]
  <article class="about">                                  [single column, page container]

    <h1 class="display lowercase">about</h1>               [Phase 5 page H1 — Geist Sans, display, 500, -0.02em, lowercase]

    <section aria-labelledby="who-i-am-eyebrow">
      <p id="who-i-am-eyebrow" class="eyebrow">who I am</p>  [Geist Mono 14px, +0.02em, lowercase, tertiary]
      <div class="prose max-w-prose">
        <AboutBio />                                       [RSC — 3-paragraph bio block, body 16px @ 400 @ 1.6, primary text]
      </div>
    </section>

    <section aria-labelledby="working-on-eyebrow">
      <h2 id="working-on-eyebrow">what I'm working on</h2>  [Geist Sans, H2 24/28px, 600, primary, sentence-case]
      <p class="body text-secondary max-w-prose">
        [1-paragraph framing — see Copywriting Contract for locked copy]
      </p>
      <ProjectPillRow />                                   [RSC — pulls from getHeroProjects(); links to /projects/{slug}]
    </section>

    <section aria-labelledby="reach-me-eyebrow">
      <h2 id="reach-me-eyebrow">how to reach me</h2>
      <ContactStack />                                     [RSC — github · email · linkedin stacked, mono labels]
    </section>

    <section aria-labelledby="values-eyebrow">
      <h2 id="values-eyebrow">values</h2>
      <ValuesList />                                       [RSC — 3 items: polymath / autonomous workflows / open-source communities]
    </section>

  </article>
</main>
```

**Heading hierarchy on `/about`:** exactly **one `<h1>`** (`about`). Exactly **four `<h2>`** (one per section: `who I am` is the only eyebrow that does NOT escalate to H2 — it's the bio block's framing label, intentionally lighter weight to keep the bio as the first read; the other three sections do use H2). **Zero `<h3>` and below.**

> **Note on the `who I am` eyebrow:** rendered as a `<p>` styled as eyebrow (mono 14px tertiary), NOT an H2. This is deliberate — the bio block reads as the page's opening voice, and a heavyweight H2 above it would compete with the H1. The eyebrow gives the bio a tiny semantic frame (`aria-labelledby` on the surrounding `<section>` points to the eyebrow's id) without claiming heading weight. The three following sections (`what I'm working on`, `how to reach me`, `values`) DO use H2 because they introduce distinct content surfaces.

### `/resume` — document outline (top to bottom)

```
<html lang="en" class="resume-route">                      [root <html> — resume.css attaches via [data-route="resume"] selectors]
  <body>
    <a href="#resume-main" class="sr-only focus:not-sr-only ...">Skip to resume</a>  [self-contained skip link — see Accessibility]
    <main id="resume-main">
      <article class="resume">                              [Phase 5 resume root]

        <header class="resume-header">
          <h1 class="display lowercase">olive elliott</h1>  [Geist Sans, display, 500, -0.02em, lowercase, primary]
          <p class="body text-secondary">
            Software Engineer  ·  AI Workflow Architect  ·  System Architect
          </p>
          <p class="body-sm text-tertiary">
            Asheville, NC  ·  919-917-4777
          </p>
          <ul class="contact-line">                         [Geist Mono 14px, three inline links separated by " · "]
            <li><a href="mailto:olivelliott48@gmail.com?subject=hi%20from%20olivelliott.dev">olivelliott48@gmail.com</a></li>
            <li><a href="https://github.com/olivelliott">github.com/olivelliott</a></li>
            <li><a href="https://linkedin.com/in/{linkedin-handle}">linkedin.com/in/{linkedin-handle}</a></li>
          </ul>
          <DownloadPdfLink />                                [top-right — Geist Mono 14px, "download.pdf ↓"; hidden in print]
        </header>

        <section aria-labelledby="summary-h2">
          <h2 id="summary-h2" class="resume-h2 sr-only">summary</h2>  [sr-only on screen + print; the summary paragraph is the visual content]
          <p class="body text-secondary max-w-prose">[summary paragraph — see Copywriting Contract]</p>
        </section>

        <hr class="hairline" />                              [1px --color-hairline divider — screen only; print drops to 0.5pt #ccc]

        <section aria-labelledby="experience-h2">
          <h2 id="experience-h2" class="resume-h2">experience</h2>   [Geist Mono 24/28px, 500, +0.02em, lowercase, tertiary]
          <ResumeEntry
            title="Software Engineer / System Architect / Project Lead"
            meta="Aktiga · 2023 – Present"
            bullets={[...]}
          />
          <ResumeEntry
            title="Operations Manager"
            meta="The Care Collective · Feb 2021 – 2023"
            bullets={[...]}
          />
        </section>

        <hr class="hairline" />

        <section aria-labelledby="projects-h2">
          <h2 id="projects-h2" class="resume-h2">projects</h2>
          <ResumeEntry title="Myco" meta="Persistent Cognitive Layer for AI Agents · 2024 – Present" bullets={[...]} link="github.com/olivelliott/myco" />
          <ResumeEntry title="Fathom" meta="Headless AI Dev-Cost Intelligence · 2025 – Present" bullets={[...]} />
          ...
        </section>

        <hr class="hairline" />

        <section aria-labelledby="skills-h2">
          <h2 id="skills-h2" class="resume-h2">skills</h2>
          <dl class="resume-skills">                          [definition list — each <dt> is the category, each <dd> is the comma-joined items]
            <dt>Languages</dt><dd>TypeScript, JavaScript, Python, SQL, HTML5, CSS</dd>
            <dt>Frameworks &amp; Libraries</dt><dd>Next.js, React, Node.js, Express, Convex, Astro, TipTap/ProseMirror, Tailwind CSS, WordPress</dd>
            ... (5 categories total)
          </dl>
        </section>

        <hr class="hairline" />

        <section aria-labelledby="education-h2">
          <h2 id="education-h2" class="resume-h2">education</h2>
          <ResumeEntry title="Full Stack Web Development Certificate" meta="UNC Chapel Hill Coding Bootcamp · September 2022" bullets={["6-month intensive, 450+ hours of full stack web development"]} />
          <ResumeEntry title="Bachelor of Science, Cum Laude — Cultural Anthropology" meta="Appalachian State University · June 2019" bullets={["Minor in Spanish", "Minor in Sustainable Development", "Senior Honors Award for Applied Anthropology"]} />
        </section>

      </article>
    </main>
  </body>
</html>
```

**Heading hierarchy on `/resume`:** exactly **one `<h1>`** (`olive elliott`). Exactly **five `<h2>`** (`summary` sr-only + `experience` + `projects` + `skills` + `education`). `<h2 class="sr-only">summary</h2>` exists for the document outline so screen readers announce a section break, but the visual presentation lets the summary paragraph stand on its own — common CV convention.

**Section order is locked:** `summary` → `experience` → `projects` → `skills` → `education`. Per CONTEXT.md § Resume HTML Render. **Do not reorder** without a UI-SPEC revision.

**The `events & services` section from the original `.docx`** (wedding event staff at Mast Farm Inn 2018, waitress at Melanie's 2015–2019) is **excluded** from `content/resume.ts` for the engineer/architect register of this resume. Phase 5 PLACEHOLDER note in `content/resume.ts`: `// PLACEHOLDER: events & services entries from .docx omitted — confirm with Olive whether to surface for hiring-manager audience or drop for engineer-positioned distribution.`

### Width discipline

| Element | Width |
|---------|-------|
| `/about` page container | `max-w-6xl mx-auto px-6 md:px-8 lg:px-12` (inherits site shell) |
| `/about <article>` | full container |
| `/about` bio + paragraphs + values | `max-w-prose` (≈ 65ch) centered inside the container — typographic measure |
| `/about` project-pill row | full container — pills wrap freely; no max width |
| `/about` contact-stack | natural width — three short link labels |
| `/about` H1 (`about`) | natural — left-aligned inside the page container |
| `/about` H2s | natural — left-aligned inside the page container |
| `/resume` page container (screen) | `max-w-3xl mx-auto px-6 md:px-8` (48rem / 768px — tighter than site shell) |
| `/resume <article>` | full `max-w-3xl` |
| `/resume` summary + bullet body | `max-w-prose` if it would otherwise hit the `max-w-3xl` edge (it won't at 65ch inside 48rem — `max-w-prose` is a no-op here, kept as belt-and-braces for unusually long bullets) |
| `/resume` page container (print) | `@page` content area — `max-w-3xl` is dropped via the print stylesheet |
| `/resume` `download.pdf ↓` (top-right) | natural — anchored to the `<header>` element at its top-right corner |
| Footer `download.pdf ↓` link | natural — inline alongside `view source`; row width inherits Phase 1 footer layout |

---

## Component Inventory (Phase 5)

Each component has a declared boundary (RSC vs client), a contract, and a Phase 5 implementation scope. **Zero new client islands are introduced in Phase 5.**

### 1. `<AboutPage>` — `app/(site)/about/page.tsx`

**Boundary:** RSC.
**Purpose:** Orchestrator. Composes `<AboutBio>` + `<ProjectPillRow>` + `<ContactStack>` + `<ValuesList>` inside the document outline above.
**Per-route metadata:**

```tsx
export const metadata: Metadata = {
  title: 'about',                                          // composes via root titleTemplate → "about · olivelliott.dev"
  description: 'Olive Elliott is an engineer focused on autonomous workflows, local-first systems, and tools that support open-source communities. Currently building at Aktiga.',
  openGraph: {
    title: 'about · olivelliott.dev',
    description: 'Olive Elliott is an engineer focused on autonomous workflows, local-first systems, and tools that support open-source communities. Currently building at Aktiga.',
    images: ['/og-default.png'],                           // reuses the Phase 3 OG default; per-route OG image is a Phase 6 audit decision
  },
}
```

Pattern mirrors Phase 4's `/projects` per-route metadata (see STATE.md note: "title declared → composes with titleTemplate; openGraph.images MUST be declared per-route because root layout omits them").

### 2. `<AboutBio>` — `components/about/about-bio.tsx`

**Boundary:** RSC.
**Purpose:** Renders the 3-paragraph bio block. Pure presentational — receives no props in v1 (copy is hard-coded inline; see Copywriting Contract for the locked first-draft text). If Phase 7 wants to source the bio from a typed config (`content/about.ts`), it's an additive refactor with no UI change.
**Contract:**
- `<div class="prose max-w-prose">` wrapping three `<p>` elements at body 16px @ 400 @ line-height 1.6.
- Body copy: `--color-text-primary` for the primary read; one or two phrases per paragraph MAY use `--color-text-secondary` for de-emphasis (e.g. specifying current role, parenthetical aside).
- Each `<p>` separated by `mt-4` (16px) via the existing `.prose` styles in `globals.css`.
- **No bold, no italic, no inline links inside the bio.** The link affordances live in the contact-stack section below; embedding them inside the bio competes for attention. Future revision may permit one inline `<a>` to a hero project — defer.

### 3. `<ProjectPillRow>` — `components/about/project-pill-row.tsx`

**Boundary:** RSC.
**Purpose:** Echoes Phase 3's `TagChipRow` visual treatment but renders **project slugs** linking to `/projects/{slug}`, not tag values linking to `/projects?tag=X`. Pulls from `getHeroProjects()` so the row stays current as Phase 7 adds more hero MDX.
**Why a new component, not a refactor of `TagChipRow`:** semantically distinct. `TagChipRow` is a chip row of **tag values** (URL state for the index filter). `ProjectPillRow` is a chip row of **project navigation** (route changes). Tests and a11y labels read differently. **Do not unify behind a polymorphic `<ChipRow variant="...">` prop** — same Pitfall 3 trap as Phase 4's CardMeta-vs-ProjectMeta separation.
**Contract:**
- `<nav aria-label="Featured projects">` wrapping a `<ul role="list">` of pills.
- Each pill: `<a href="/projects/{slug}" class="...same pill visuals as TagChipRow...">{project.title}</a>`.
- Pill visuals reuse the Phase 3 tag-chip class string verbatim (mono 14px @ 500, +0.02em, lowercase, secondary text on surface-2 fill, 2px radius, `px-3 py-2 -my-2` touch-target trick). **The title is rendered in lowercase via the existing chip class — even if `project.title` is "Myco" capitalized, the CSS lowercases the visible text.** This matches the editorial register of the chips elsewhere.
- Hover: text shifts secondary → primary; an accent underline appears beneath the label (`text-decoration` accent, offset 4px). Both transitions inherit motion tokens from Phase 1.
- Focus-visible: inherits the Phase 1 2px accent outline at 2px offset.
- Wraps `flex-wrap gap-3` (matching `CardMeta`'s gap-3 inter-chip rhythm).

### 4. `<ContactStack>` — `components/about/contact-stack.tsx`

**Boundary:** RSC.
**Purpose:** Three vertically stacked contact-link rows on `/about`. Reused identically nowhere — the footer keeps its existing icon-only treatment (Phase 1), so this component is `/about`-specific.
**Contract:**
- `<ul role="list" class="flex flex-col gap-4">` (16px vertical gap).
- Three `<li>` children, each containing a single `<a>`:

```tsx
<a href="https://github.com/olivelliott" target="_blank" rel="noopener noreferrer" class="contact-link">
  github.com/olivelliott
</a>
<a href="mailto:olivelliott48@gmail.com?subject=hi%20from%20olivelliott.dev" class="contact-link">
  olivelliott48@gmail.com
</a>
<a href="https://linkedin.com/in/{linkedin-handle}" target="_blank" rel="noopener noreferrer" class="contact-link">
  linkedin.com/in/{linkedin-handle}
</a>
```

- Class `contact-link` resolves to: `font-mono text-[var(--text-label)] font-medium tracking-[0.02em] lowercase text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)] focus-visible:text-[color:var(--color-text-primary)] py-3` plus an accent `text-decoration-color: var(--color-accent)` / `text-underline-offset: 4px` rule that activates on hover/focus.
- Hit area: `py-3` (12px vertical padding) × label height ≈ 44px combined with the link's full-width inline behavior — meets WCAG 2.5.5.
- **GitHub handle:** `olivelliott` (per docx + Myco repo URL canonicalization decision in STATE.md: `github.com/olivelliott/myco`). **Footer GitHub URL is `github.com/ophelia-x` from Phase 1 — confirm whether to update footer to `olivelliott` during Phase 5 implementation; flag in plan as a verification task.**
- **Email subject:** `hi from olivelliott.dev` — locked lowercase, casual. URL-encoded as `hi%20from%20olivelliott.dev`.
- **LinkedIn handle:** `// PLACEHOLDER: confirm with Olive` — the docx says "LinkedIn" but does not include the handle. Plan must include a step to ask Olive for the canonical LinkedIn URL.

### 5. `<ValuesList>` — `components/about/values-list.tsx`

**Boundary:** RSC.
**Purpose:** Renders the three-value list on `/about`. Each value has a short title and a one-sentence descriptor.
**Contract:**
- `<dl class="flex flex-col gap-4">` (definition list — semantic match for "term : description" structure).
- Three `<div>` wrappers (so each `<dt>` + `<dd>` pair is grouped), each containing:
  - `<dt class="font-medium text-[color:var(--color-text-primary)]">{title}</dt>` (body 16px @ 500 — the body-medium activation)
  - `<dd class="text-[color:var(--color-text-secondary)] mt-1">{descriptor}</dd>` (body 16px @ 400, slight top margin to set off from the title)

**Locked values (see Copywriting Contract for the descriptors):**

1. **polymath** — work moves across engineering, anthropology, and creative practice.
2. **autonomous workflows** — tools should do the obvious work so we can spend attention on the work that's actually ours.
3. **open-source communities** — what gets built in the open belongs to everyone who builds on it.

### 6. `<ResumeLayout>` — `app/resume/layout.tsx` (the opt-out mechanism)

**Boundary:** RSC.
**Purpose:** The chrome opt-out. `/resume` lives at `app/resume/page.tsx` — **outside** the `app/(site)/` route group. Next.js App Router's route-group convention means anything inside `(site)/` inherits `app/(site)/layout.tsx` (nav / footer / motion provider), and anything outside it does NOT.
**Contract:**

```tsx
import './resume.css'                                       // print stylesheet + screen overrides

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>                                    // no chrome — just renders children
}
```

- Imports `app/resume/resume.css` for both screen overrides (max-width tightening, skip-link, `download.pdf` top-right placement) and `@media print { ... }` rules.
- Does NOT import `<Nav>`, `<Footer>`, `<MotionProvider>`, `<SkipLink>` from the site components — it ships its own skip-link inside the page.
- The root `app/layout.tsx` still wraps this route (root layout is universal — it owns the `<html>`, `<body>`, `globals.css` import, `ThemeProvider`, font variables). `globals.css`'s `@media (prefers-reduced-motion: reduce)` floor therefore applies to `/resume` even without `<MotionProvider>`.

**This is why the chrome opt-out works** — Next.js layouts compose root → route-group → page; by living outside `(site)/`, `/resume` skips the middle layer entirely.

### 7. `<ResumeHeader>` — `components/resume/resume-header.tsx`

**Boundary:** RSC.
**Purpose:** The header block at the top of `/resume`. Renders name, role, location/phone, contact line, and the `<DownloadPdfLink>` top-right.
**Contract:**
- `<header class="resume-header">` — relative-positioned (anchors `<DownloadPdfLink>` absolutely top-right at `top: 16px right: 16px`).
- `<h1>` — display, Geist Sans, 500, lowercase, `-0.02em` tracking, primary text — `olive elliott`.
- `<p class="body text-secondary">` — role line — `Software Engineer  ·  AI Workflow Architect  ·  System Architect`.
- `<p class="body-sm text-tertiary">` — location/phone line — `Asheville, NC  ·  919-917-4777`. **Reads `body-sm` as 14px** (mono label scale reused at sans treatment — this is the label size with the body family; explicit utility class composes existing tokens).
- `<ul class="contact-line">` — Geist Mono 14px, three inline links separated by `·` — `email · github · linkedin`. Each link: `--color-text-secondary` at rest, `--color-text-primary` on hover, accent underline on hover/focus.
- `<DownloadPdfLink />` absolute top-right.

**Print mode adjustment:** the `<DownloadPdfLink>` and any decorative chrome are hidden (`display: none`). The contact line collapses to plain underlined text (`a { color: inherit; }`). Name, role, location render at print scale (see Print Stylesheet Contract).

### 8. `<ResumeSection>` — `components/resume/resume-section.tsx` (generic wrapper)

**Boundary:** RSC.
**Purpose:** Generic section wrapper used by all five resume sections (summary, experience, projects, skills, education).
**Contract:**

```tsx
interface ResumeSectionProps {
  id: string                                                // matches the H2 id, used for aria-labelledby
  label: string                                             // the section H2 text (e.g. "experience")
  children: React.ReactNode
  hideHeading?: boolean                                     // for the summary section — H2 is sr-only
}
```

- Renders `<section aria-labelledby={id}>` containing an `<h2 id={id} class={...}>` (or `class="sr-only"` if `hideHeading`) and the children.
- H2 styling: `resume-h2` class → Geist Mono, 24px (mobile) / 28px (`md+`), weight 500, `+0.02em` tracking, lowercase, `--color-text-tertiary`. **This composes the existing H2 size token with the existing label-row family + tracking — no new token.**
- `mt-6 md:mt-8` (24px mobile / 32px desktop) above the H2 for breathing room.
- `mt-4` (16px) between H2 and the first entry inside the section.

### 9. `<ResumeEntry>` — `components/resume/resume-entry.tsx` (generic entry)

**Boundary:** RSC.
**Purpose:** Generic entry used by `experience`, `projects`, and `education` sections.
**Contract:**

```tsx
interface ResumeEntryProps {
  title: string                                             // role / project name / degree
  meta: string                                              // "Aktiga · 2023 – Present" — period · location pre-joined
  bullets: string[]                                         // 2–4 bullet points
  link?: { href: string; label: string }                    // optional repo link (projects section only); inherits Phase 3 repo-link treatment
}
```

- Outer container: `<div class="resume-entry mt-4">` (16px from previous entry).
- Top row: `<div class="entry-head flex flex-wrap items-baseline gap-3">`:
  - `<p class="entry-title">{title}</p>` — body 16px @ 500 (body-medium), `--color-text-primary`.
  - `<p class="entry-meta">{meta}</p>` — Geist Mono 14px, `+0.02em`, lowercase IS NOT applied here (the meta string preserves case from the source — e.g. "2023 – Present" stays capitalized). Color: `--color-text-tertiary`.
- Bullets: `<ul class="entry-bullets mt-2 pl-4">`:
  - `<li class="text-body text-secondary leading-[1.6] mt-1">{bullet}</li>` — body 16px @ 400, `--color-text-secondary`. List style `disc` (matching `.prose` ul rule in globals.css). `mt-1` (4px) between bullets.
- Optional `link`: rendered as a small Geist Mono row beneath the title — `<a href={link.href} class="repo-link">{link.label} ↗</a>` — same accent text + accent glyph behavior as Phase 3's repo link.

### 10. `<DownloadPdfLink>` — `components/resume/download-pdf-link.tsx`

**Boundary:** RSC.
**Purpose:** The download affordance. Used in two places: top-right of `/resume` (via `<ResumeHeader>`) and inline in the footer (alongside `view source` and the icon row).
**Contract:**

```tsx
interface DownloadPdfLinkProps {
  className?: string                                        // for positioning differences (footer inline vs resume top-right absolute)
}
```

- `<a href="/resume.pdf" download class="...">download.pdf ↓</a>`
- Class string: `font-mono text-[var(--text-label)] font-medium tracking-[0.02em] lowercase text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)] focus-visible:text-[color:var(--color-text-primary)] p-3` plus an accent `text-decoration-color: var(--color-accent)` / `text-underline-offset: 4px` rule that activates on hover/focus.
- The `↓` is a literal Unicode character (`↓`), not an icon.
- `download` attribute prompts the browser to save the file rather than navigate.
- In `/resume` placement: wrapped by `<ResumeHeader>` with `absolute top-4 right-4` (or `top-3 right-3` in mobile). Hidden in print mode via `@media print { .download-pdf-link { display: none; } }` (class `download-pdf-link` applied on the `<a>`).
- In footer placement: wrapped inline with the existing footer right-slot row. A `·` interpunct separates `download.pdf ↓` from `view source`.

### 11. Footer update (no new component file)

**Boundary:** RSC.
**Purpose:** Add `<DownloadPdfLink>` to the existing footer right slot. Verify the `mailto:` subject string.

**Existing footer (`components/site/footer.tsx`) — two surgical changes:**

1. **Update the email URL** to include the canonical Phase 5 subject:
   - Before: `const EMAIL_URL = 'mailto:olivelliott48@gmail.com?subject=olivelliott.dev'` (Phase 1 minimal subject)
   - After: `const EMAIL_URL = 'mailto:olivelliott48@gmail.com?subject=hi%20from%20olivelliott.dev'` (Phase 5 locked subject)
2. **Insert `<DownloadPdfLink />` into the right slot**, immediately before `view source`, separated by a `·` interpunct:

```tsx
// inside <div className="flex items-center gap-4 sm:gap-6">
//   <ul>...icons...</ul>
  <DownloadPdfLink />
  <span aria-hidden="true" className="text-[color:var(--color-text-tertiary)]">·</span>
  <a href={VIEW_SOURCE_URL} ...>view source</a>
// </div>
```

The interpunct uses `aria-hidden="true"` so screen readers don't announce it; it's a visual rhythm token only. The mobile (`< 640px`) stacking from Phase 1 stays intact — the icons row and the text-link row stack vertically with `gap-4`; `<DownloadPdfLink>` joins the text-link row in mobile too.

**Note on the GitHub footer URL:** Phase 5 implementation should also verify whether to update `GITHUB_URL` and `VIEW_SOURCE_URL` from `github.com/ophelia-x` (Phase 1 placeholder) to `github.com/olivelliott` (canonical handle per STATE.md note on Myco repo URL). Flag as a verification task in the Phase 5 plan; outside this UI-SPEC's strict scope but noted here for the planner.

---

## Print Stylesheet Contract

The print stylesheet lives at `app/resume/resume.css`. It contains both screen-mode tweaks for `/resume` and a single `@media print { ... }` block. **No other CSS file in the project ships an `@media print` rule.**

### Screen-mode rules (outside @media print)

```css
/* Screen-only: tighten /resume to a single-column document register */
.resume {
  max-width: 48rem;                  /* max-w-3xl */
  margin-left: auto;
  margin-right: auto;
  padding: 2rem 1.5rem;              /* py-8 px-6; md: py-12 px-8 via @media min-width */
}

@media (min-width: 768px) {
  .resume {
    padding: 3rem 2rem;
  }
}

.resume-header {
  position: relative;                 /* anchors <DownloadPdfLink> top-right */
}

.resume-header .download-pdf-link {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

@media (min-width: 768px) {
  .resume-header .download-pdf-link {
    top: 1.5rem;
    right: 1.5rem;
  }
}

.resume hr.hairline {
  border: none;
  border-top: 1px solid var(--color-hairline);
  margin: 1.5rem 0;
}

/* Resume H2 — composes existing H2 size with mono label tracking */
.resume-h2 {
  font-family: var(--font-mono);
  font-size: var(--text-h2);
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.02em;
  line-height: var(--text-h2--line-height);
  text-transform: lowercase;
  color: var(--color-text-tertiary);
  margin: 1.5rem 0 1rem;
}

@media (min-width: 768px) {
  .resume-h2 {
    font-size: 1.75rem;               /* matches Phase 3 H2 md+ */
    margin: 2rem 0 1rem;
  }
}

/* Contact line on resume header — three inline mono links separated by · */
.contact-line {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 0.75rem;                /* 8px row gap, 12px column gap */
  margin-top: 0.75rem;
  font-family: var(--font-mono);
  font-size: var(--text-label);
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.02em;
}

.contact-line li:not(:last-child)::after {
  content: " · ";
  color: var(--color-text-tertiary);
  margin-left: 0.5rem;
}

/* Resume skills definition list — two-column on md+ */
.resume-skills {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 0.5rem 1rem;
  align-items: baseline;
}

.resume-skills dt {
  font-family: var(--font-mono);
  font-size: var(--text-label);
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.02em;
  color: var(--color-text-tertiary);
  text-transform: lowercase;
}

.resume-skills dd {
  color: var(--color-text-secondary);
  font-size: var(--text-body);
  line-height: 1.6;
}
```

### Print rules — single `@media print { ... }` block

```css
@media print {
  /* Page setup — A4 with 0.5in margins (≈ 12.7mm; conventional CV measure) */
  @page {
    size: A4;
    margin: 0.5in;
  }

  /* Black on white — bounded raw-color exception class */
  html, body, .resume {
    background: #fff !important;
    color: #000 !important;
    print-color-adjust: exact;        /* honor the deliberate tonal contrast */
    -webkit-print-color-adjust: exact;
  }

  /* Drop screen container max-width — let the resume use the @page area */
  .resume {
    max-width: none;
    margin: 0;
    padding: 0;
  }

  /* Body type drops to 10pt; line-height tightens to 1.35 for paper density */
  .resume,
  .resume p,
  .resume li {
    font-size: 10pt;
    line-height: 1.35;
  }

  /* H1 (display) — keep prominent but rein in for paper */
  .resume h1 {
    font-size: 20pt;
    line-height: 1.15;
    margin-bottom: 4pt;
  }

  /* Role line + location/phone — small caps register */
  .resume header p {
    font-size: 9pt;
    color: #444 !important;
    line-height: 1.3;
  }

  /* Resume H2 (section labels) — 12pt mono uppercase for paper */
  .resume-h2 {
    font-size: 12pt;
    margin: 12pt 0 4pt;
    color: #000 !important;
    text-transform: uppercase;        /* paper register flips lowercase → uppercase for scannability */
    letter-spacing: 0.04em;           /* uppercase needs more tracking */
    border-bottom: 0.5pt solid #999;  /* hairline under each H2 on paper */
    padding-bottom: 2pt;
  }

  /* Entry title — body-medium reads on paper at 10.5pt @ 600 (NOT 500 — paper needs more weight) */
  .resume-entry .entry-title {
    font-size: 10.5pt;
    font-weight: 600;
    color: #000 !important;
  }

  /* Entry meta — 9pt #666 (paper equivalent of --color-text-tertiary) */
  .resume-entry .entry-meta {
    font-size: 9pt;
    color: #666 !important;
  }

  /* Entry bullets — slightly tighter indent for paper */
  .resume-entry .entry-bullets {
    padding-left: 12pt;
    margin-top: 4pt;
  }

  .resume-entry .entry-bullets li {
    margin-top: 2pt;
    color: #000 !important;
  }

  /* Skills dl — tighten the grid */
  .resume-skills {
    gap: 4pt 12pt;
  }

  /* Links — color: inherit + simple underline; URLs print literally */
  .resume a {
    color: inherit !important;
    text-decoration: underline;
    text-underline-offset: 2pt;
  }

  /* Strip on-screen hairlines; let H2 borders + page rhythm do the work */
  .resume hr.hairline {
    display: none;
  }

  /* Hide chrome that doesn't belong on paper */
  .download-pdf-link,
  .skip-link,
  nav,
  footer {
    display: none !important;
  }

  /* Page-break rules — keep sections intact when possible */
  .resume section {
    page-break-inside: avoid;
  }

  .resume-entry {
    page-break-inside: avoid;
  }

  .resume h1,
  .resume-h2 {
    page-break-after: avoid;          /* don't orphan a heading at page end */
  }
}
```

### Print stylesheet contract summary

| Property | Screen value | Print value | Rationale |
|----------|--------------|-------------|-----------|
| Paper size | n/a | A4 | Most universal international CV size |
| Page margins | n/a | 0.5in (≈ 12.7mm) | Conventional CV measure; gives ATS and human eyes adequate breathing room |
| Body type | 16px | 10pt | Paper density convention |
| Body line height | 1.6 | 1.35 | Tighter paper read |
| H1 | clamp(2rem, 5vw, 3rem) | 20pt | Restrained for paper |
| H2 (resume section) | 24/28px mono lowercase tertiary | 12pt mono **uppercase** #000 + 0.5pt #999 hairline | Paper flips the register — uppercase reads scan-friendlier on paper |
| Entry title weight | 500 | 600 | Paper needs more weight to feel anchored |
| Foreground | tiered off-whites | #000 (primary) / #666 (meta) | Maximum print contrast; deliberate tertiary tier preserved |
| Background | `--color-bg` (#0a0a0a) | #fff | Paper inverts |
| Link color | accent on hover | inherit + underline | Accent does not survive B&W print; underline is the affordance |
| Motion | CSS transitions | none | Paper is static |
| Chrome (nav / footer / skip-link / download.pdf) | visible | `display: none` | Off-paper |
| Section break behavior | natural flow | `page-break-inside: avoid` on `<section>` and `.resume-entry`; `page-break-after: avoid` on headings | Prevent orphaned headings and split entries |

### PDF parity verification

Per CONTEXT.md § PDF Generation Pipeline, the Puppeteer build step (`scripts/build-resume-pdf.ts`) renders the same React tree via `emulateMediaType('print')` so the PDF and the HTML render share a single source. The smoke test at `tests/resume/pdf-build.test.ts` asserts the artifact's existence, size bounds (20KB–200KB), and `%PDF-` magic bytes. **No pixel-diff** — the structural assertion is sufficient because both renders consume `content/resume.ts` through identical React components.

---

## Copywriting Contract

All strings rendering in Phase 5 are enumerated below. Downstream phases inherit these; any change requires a UI-SPEC revision.

### `/about` page copy (locked)

| Element | Copy | Register |
|---------|------|----------|
| Page `<title>` (via metadata) | `about · olivelliott.dev` (composed via titleTemplate) | lowercase, period-separated |
| Page meta description | `Olive Elliott is an engineer focused on autonomous workflows, local-first systems, and tools that support open-source communities. Currently building at Aktiga.` | sentence case, one to two sentences, thesis-forward, names current role |
| H1 | `about` | lowercase, single word |
| Eyebrow 1 | `who I am` | lowercase, Geist Mono |
| Bio paragraph 1 (3-paragraph block) | `I'm an engineer building tools that let people spend attention on the work that's actually theirs. My focus is on autonomous workflows, local-first systems, and the small details of tooling that compound into hours saved.` | first person, plain-spoken, names the thesis |
| Bio paragraph 2 | `I'm currently at Aktiga, leading system architecture and AI-workflow design for internal tooling and developer platforms. I author and maintain the developer documentation (Starlight on Astro) and coordinate engineering priorities across the team.` | names current role, specific, no PLACEHOLDER on role title since the .docx confirms "Software Engineer / System Architect / Project Lead" |
| Bio paragraph 3 | `Before software, I studied cultural anthropology and sustainable development at Appalachian State. That perspective shows up in how I think about the systems I build — who they're for, what they pull people toward, and whether they're something we want to live with at scale.` | grounds the polymath thesis without naming it; transitions into the values section below |
| H2 | `what I'm working on` | lowercase, sentence case |
| Framing paragraph | `Three projects are getting most of my focus right now — built to test the thesis that small, local-first tools earn their keep by staying out of the way.` | one sentence, leads into pill row |
| H2 | `how to reach me` | lowercase, sentence case |
| Contact link 1 label | `github.com/olivelliott` | literal URL fragment, mono, lowercase |
| Contact link 2 label | `olivelliott48@gmail.com` | literal email, mono, lowercase |
| Contact link 3 label | `linkedin.com/in/{handle}` | literal URL fragment, mono, lowercase — `{handle}` is a `// PLACEHOLDER` until Olive confirms |
| H2 | `values` | lowercase, single word |
| Values item 1 title | `polymath` | lowercase, single word |
| Values item 1 descriptor | `work moves across engineering, anthropology, and creative practice — no one of them is the whole picture.` | one sentence, plain-spoken |
| Values item 2 title | `autonomous workflows` | lowercase, two words |
| Values item 2 descriptor | `tools should do the obvious work so we can spend attention on the work that's actually ours.` | one sentence, thesis-forward |
| Values item 3 title | `open-source communities` | lowercase, hyphenated |
| Values item 3 descriptor | `what gets built in the open belongs to everyone who builds on it.` | one sentence, ethic-stated |

### `/resume` page copy (locked at component-render level — actual data lives in `content/resume.ts`)

| Element | Copy | Register / source |
|---------|------|-------|
| Page `<title>` (via metadata) | `resume · olivelliott.dev` | lowercase, period-separated, composes via titleTemplate |
| Page meta description | `Resume for Olive Elliott — engineer focused on autonomous workflows, local-first systems, and open-source tooling. Available as PDF download.` | one to two sentences |
| Skip link | `Skip to resume` | imperative — distinct from site's `Skip to content` |
| H1 | `olive elliott` | lowercase, display, primary text |
| Role line | `Software Engineer  ·  AI Workflow Architect  ·  System Architect` | from .docx; double-space around `·` preserved for paper readability |
| Location/phone line | `Asheville, NC  ·  919-917-4777` | from .docx; phone uses literal format |
| Summary paragraph (locked rewrite — strips "Passionate") | `Software engineer with 3+ years of experience designing and shipping scalable, local-first products. Focus on autonomous workflows, decentralized networks, and AI-driven systems that give people freedom to pursue what matters most. Active in open-source, knowledge-graph architectures, and tools that support distributed communities. Brings a polymath perspective rooted in anthropology, sustainability, and creative problem solving.` | sentence case, professional register, **`Passionate` from the .docx PROFILE rewritten to `Active in` to clear the banned-words list** |
| H2 `summary` | `summary` | sr-only on screen + print; document outline only |
| H2 `experience` | `experience` | lowercase mono on screen; uppercase mono on print |
| H2 `projects` | `projects` | lowercase mono on screen; uppercase mono on print |
| H2 `skills` | `skills` | lowercase mono on screen; uppercase mono on print |
| H2 `education` | `education` | lowercase mono on screen; uppercase mono on print |
| Entry title (experience #1) | `Software Engineer / System Architect / Project Lead` | from .docx verbatim |
| Entry meta (experience #1) | `Aktiga · 2023 – Present` | period · location pre-joined |
| Entry bullets (experience #1) | Per .docx (4 bullets): lead system architecture; author/maintain Starlight docs; project-lead coordination; design autonomous workflow pipelines | from .docx verbatim |
| Entry title (experience #2) | `Operations Manager` | from .docx |
| Entry meta (experience #2) | `The Care Collective · Feb 2021 – 2023` | from .docx |
| Entry bullets (experience #2) | 3 bullets per .docx | from .docx verbatim |
| Entry title (projects: Myco) | `Myco` | one-word display |
| Entry meta (projects: Myco) | `Persistent Cognitive Layer for AI Agents · 2024 – Present` | tagline · period |
| Entry link (projects: Myco) | `github.com/olivelliott/myco ↗` | repo link inherits Phase 3 accent treatment; canonical URL per STATE.md |
| Entry title (projects: Fathom) | `Fathom` | from .docx |
| Entry title (projects: Agenda Keeper) | `Agenda Keeper` | from .docx |
| Entry title (projects: Trade Bot) | `Trade Bot` | from .docx (private; no repo link rendered) |
| Entry title (projects: Stemz) | `Stemz` | from .docx |
| Skill category 1 | `Languages` | from .docx |
| Skill category 1 items | `TypeScript, JavaScript, Python, SQL, HTML5, CSS` | from .docx, comma-joined |
| Skill category 2 | `Frameworks & Libraries` | from .docx; `&` rendered as HTML entity |
| Skill category 3 | `AI & Autonomous Systems` | from .docx |
| Skill category 4 | `Data & Infrastructure` | from .docx |
| Skill category 5 | `Focus Areas` | from .docx |
| Education entry 1 | `Full Stack Web Development Certificate` / `UNC Chapel Hill Coding Bootcamp · September 2022` / one bullet | from .docx |
| Education entry 2 | `Bachelor of Science, Cum Laude — Cultural Anthropology` / `Appalachian State University · June 2019` / 3 bullets (Spanish minor, Sustainable Development minor, Senior Honors Award) | from .docx; "Cultural Anthropology" appended to title for scannability |
| `download.pdf ↓` link | `download.pdf ↓` | lowercase mono, Unicode `↓` glyph (U+2193) |
| Footer `download.pdf` separator | `·` | interpunct, `aria-hidden="true"` |
| Email subject (mailto everywhere) | `hi from olivelliott.dev` | lowercase, casual; URL-encoded as `hi%20from%20olivelliott.dev` |

**Banned-words audit:** I scanned the .docx PROFILE block for the Phase 4 banned-words list:

- **"Passionate"** appears in the .docx PROFILE — rewritten to `Active in` in the summary copy above.
- No other banned words found in the .docx body.

Anti-pattern source-grep test (extension of Phase 4's `tests/home/anti-patterns.test.ts`) will assert that none of the banned words appear in `app/(site)/about/page.tsx`, `components/about/*`, `app/resume/page.tsx`, `components/resume/*`, or `content/resume.ts`. Extend the existing manifest per STATE.md guidance: "tests/about/anti-patterns.test.ts if the manifest gets unwieldy; otherwise extend tests/home/anti-patterns.test.ts."

### Primary CTA (per template requirement)

Phase 5's primary CTA is `download.pdf ↓` — appears in two places: top-right of `/resume` and in the footer of every page. **Verb + noun: "download" + "pdf"** — the action and the artifact, nothing more. No "Download my resume!" with marketing punctuation, no "Get in touch" pseudo-CTA on `/about` (the contact stack is its own affordance; calling it a CTA would over-pitch).

### Empty state (per template requirement)

**None in Phase 5** in the traditional data-driven sense. The closest thing is the project-pill row on `/about` if `getHeroProjects()` ever returns zero (it can't in v1 — Myco is authored, Fathom and Agenda Keeper are Phase 7). If the row is ever empty, the planner should render nothing (no "no projects yet" placeholder). The `/about` section's framing paragraph still reads correctly without the pills below it.

### Error state (per template requirement)

**Only error surface in Phase 5:** the existing custom 404 (Phase 1) catches a malformed `/about` or `/resume` route — no additional error UI is introduced. If `content/resume.ts` fails Zod validation at build time, the build fails with a clear error (same enforcement pattern as Phase 2's project schema). No runtime error UI is required because both pages render fully at build time.

### Destructive actions (per template requirement)

**None in Phase 5.** No data to delete, no accounts to disable, no destructive state transitions. The mailto link is not destructive (composes a draft email). The download button is not destructive (writes a file the browser already manages).

---

## Accessibility Contract

### Skip-link on `/resume` (route-specific)

`/resume` lives outside the `(site)` route group and therefore does NOT inherit the site's Phase 1 `<SkipLink>` (which targets `#main` inside the site layout). The Phase 5 `<ResumeLayout>` is intentionally chromeless, so the only nav-skip target needed is the resume `<article>` itself. **`/resume` ships its own minimal skip-link inline at the top of `app/resume/page.tsx`:**

```tsx
<a href="#resume-main"
   class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-2 focus:bg-white focus:text-black focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-black">
  Skip to resume
</a>
<main id="resume-main">...</main>
```

- Foreground/background switched to `#000` on `#fff` because `/resume` is a "paper-register" page even on screen — the skip link should match the paper aesthetic when focused. Hidden in print mode regardless.
- Target id `#resume-main` is distinct from the site's `#main` — a keyboard user reaching `/resume` from the nav bar will tab from address-bar through to this skip link, then into the resume.

### Keyboard navigation

**Tab order on `/about`** (inside the site shell, so site chrome tabs first):
1. Site skip-link (Phase 1) → `#main`.
2. Wordmark (Phase 1).
3. Nav links: `projects`, `about` (active), `resume`, `contact`.
4. Page H1, eyebrows, bio paragraphs (non-interactive — tab passes through).
5. Project pills (one per hero project — currently 1, will grow to 3 in Phase 7).
6. Contact-stack links (3): GitHub, email, LinkedIn.
7. Footer GitHub icon.
8. Footer Email icon.
9. Footer LinkedIn icon.
10. Footer `download.pdf ↓` link (NEW Phase 5).
11. Footer `view source` link (Phase 1).

**Tab order on `/resume`** (no site chrome):
1. `/resume` skip-link → `#resume-main`.
2. `<DownloadPdfLink>` top-right.
3. Header contact line: email, github, linkedin (3 links inline).
4. Resume entry repo links (each project entry with a `link` field; in v1: Myco's `github.com/olivelliott/myco`).
5. No further interactive elements — sections, bullets, skills, education are static content.

**Assertions:**
- Every focusable element shows the **2px solid `--color-accent` outline at `outline-offset: 2px`** (inherits Phase 1 `:focus-visible` rule from `globals.css`). The print mode `@page` strips this — focus rings are irrelevant on paper.
- `Tab` advances forward, `Shift+Tab` reverses, `Enter` activates links — default browser behavior.
- `/resume` skip-link activates `#resume-main` when focused + Enter pressed.

### Screen reader / semantic HTML

- `/about`: `<main>` (inherits site shell), inside it a single `<article>` for the bio, with `<section aria-labelledby="...-eyebrow">` for each subsection. The eyebrows are real text inside `<p>` (mono-styled), not visually-hidden labels — they read fine in source order. The values list is a `<dl>` so each value's title/descriptor pair is semantically associated. The project-pill row is a `<nav aria-label="Featured projects">` so AT users get a nav landmark and a label distinguishing it from chrome nav.
- `/resume`: a single `<main id="resume-main">` (no site `<nav>` competing), an `<article>` for the resume, `<section aria-labelledby="{section}-h2">` for each section. The summary `<h2 class="sr-only">summary</h2>` exists for the document outline so screen readers announce a "summary" section break, even though no visible heading renders.
- `<h1>` count: exactly one per route (`about` on `/about`, `olive elliott` on `/resume`).
- All external links (`target="_blank"`) have `rel="noopener noreferrer"`.
- All `mailto:` and `tel:` links (none of the latter in v1 — phone number renders as plain text only) work without the rel attribute.
- Decorative `·` interpuncts and the `↓` glyph on `download.pdf ↓`: the interpunct in the footer has `aria-hidden="true"`; the `↓` glyph is part of the link's accessible name so it reads as "download.pdf down-arrow" — acceptable for sighted screen-reader users who care about the visual cue (the alternative `aria-hidden` on the glyph reads as just "download.pdf" which is also acceptable; PLAN may pick whichever passes the planner's a11y testing — recommend leaving in the accessible name).

### Print stylesheet a11y

- **Color contrast on paper:** `#000` on `#fff` (21:1), `#666` on `#fff` (5.74:1 — AA normal, AAA large). All meta text on paper meets WCAG when printed.
- **No decorative-only elements that lose information on paper.** Every visible element on `/resume` carries information; the only elements hidden in print are chrome (download link, skip link, nav, footer) which exist on screen for navigation that's irrelevant on paper.
- **Link URLs print literally.** Email, GitHub, LinkedIn all print as their text labels (the URL itself) — a paper reader can transcribe them. No "click here" abstractions.
- **No images, no icons in print** — paper is purely typographic. The print stylesheet does not hide any images because `/resume` ships none.

### No JS fallback

Both `/about` and `/resume` are RSC-rendered: every piece of content (bio paragraphs, project pills, contact links, resume header, summary, every entry, skills list, education) is present in the SSR'd HTML. Verifiable via `curl https://<vercel-url>/about | grep "who I am"` and `curl https://<vercel-url>/resume | grep "experience"`. No JS adds any visible content — JS only provides focus-visible styling (browser built-in) and the optional motion provider (which is a no-op for Phase 5 because no `<m.*>` islands ship).

### `/resume` indexing — deferred decision

CONTEXT.md notes: `noindex` consideration for `/resume` is a Phase 6 SEO/A11y audit decision. **Phase 5 does not set `noindex`.** The page is fully indexable in v1; Phase 6 will decide whether the PDF artifact is the canonical share target (in which case `/resume` may get `noindex, follow` per page-level metadata). The plan should flag this as a known Phase 6 follow-up but not act on it.

---

## Responsive Contract

| Breakpoint | `/about` behavior | `/resume` behavior |
|------------|---------------|---------------|
| `< 640px` (mobile) | Page padding `px-6`, vertical `py-16`. Single column. Project pills wrap (one per line at narrowest). Contact links stack `gap-4`. Values list stacks `gap-4`. | Page padding `px-6 py-8`. Single column. Header name on its own line; role line wraps if needed; contact line wraps to two rows. `<DownloadPdfLink>` shifts from absolute top-right to inline below header (override via media query). |
| `640px–1024px` (tablet) | Page padding `px-8`, vertical rhythm escalates partially. | Page padding `px-8 py-12`. `<DownloadPdfLink>` returns to absolute top-right. |
| `≥ 1024px` (desktop) | Page padding `px-12`, vertical `py-24`. Project pills sit in one row up to container width. | Page hits `max-w-3xl` cap (centered). No further layout change. |
| `≥ 1280px` (wide) | No change — `max-w-6xl` cap. | No change — `max-w-3xl` cap. |
| Print (all sizes irrelevant) | n/a — `/about` is not designed for print. If a user prints `/about` from the browser, it falls back to the global reduced-motion-floor + default print rendering (no Phase 5 print rules apply). | A4 with 0.5in margins; print stylesheet takes over fully. |

**Touch targets on mobile:** all interactive elements meet 44×44px. Project pills extend via `-my-2`; contact-stack links via `py-3`; resume header contact-line links via `py-2 -my-1` (the row is already tight; the trick keeps the visual rhythm).

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | **none in Phase 5.** Same lineage as Phases 1–4. No Button / Dialog / Tooltip surfaces are introduced — `<DownloadPdfLink>`, `<ContactStack>`, `<ValuesList>`, `<ProjectPillRow>`, `<AboutBio>` are all hand-authored against existing patterns. | not required — shadcn not initialized in v1 |
| Third-party registries | **none permitted in v1.** Phase 5 ships zero registry blocks. | N/A — Phase 1 § Registry Strategy: "third-party registries forbidden in v1" |

**Phase 5 has zero registry blocks.** Every component enumerated above is hand-authored against:
- Tailwind v4 utility classes that resolve to existing `@theme` tokens
- Geist font variables already in scope
- The existing `cn()` helper (`lib/utils.ts`)
- Existing component shape conventions from Phases 1, 3, 4

---

## Phase 5 Deliverable Checklist (for gsd-planner / gsd-executor)

Files / components the plan must create or modify:

**New files:**

- [ ] `content/resume.ts` — typed `RESUME` const conforming to `ResumeSchema`; populated from `Olive_Elliott_Resume.docx` (banned-words-stripped); ambiguities marked `// PLACEHOLDER: confirm with Olive`
- [ ] `lib/schemas.ts` — add `ResumeSchema` Zod schema (alongside existing `ProjectFrontmatterSchema`)
- [ ] `app/(site)/about/page.tsx` — `<AboutPage>` RSC route; exports `metadata`
- [ ] `app/resume/layout.tsx` — chromeless layout; imports `resume.css`
- [ ] `app/resume/page.tsx` — `<ResumePage>` RSC route; renders skip-link + `<ResumeHeader>` + sections; exports `metadata`
- [ ] `app/resume/resume.css` — screen overrides + single `@media print` block
- [ ] `components/about/about-bio.tsx` — 3-paragraph bio block (RSC)
- [ ] `components/about/project-pill-row.tsx` — pill row pulling `getHeroProjects()` (RSC)
- [ ] `components/about/contact-stack.tsx` — github + email + linkedin stacked links (RSC)
- [ ] `components/about/values-list.tsx` — 3-item `<dl>` (RSC)
- [ ] `components/resume/resume-header.tsx` — header + contact line + `<DownloadPdfLink>` top-right (RSC)
- [ ] `components/resume/resume-section.tsx` — generic `<section>` wrapper with H2 (RSC)
- [ ] `components/resume/resume-entry.tsx` — generic entry: title + meta + bullets + optional repo link (RSC)
- [ ] `components/resume/download-pdf-link.tsx` — `download.pdf ↓` link, reused in `/resume` and footer (RSC)
- [ ] `scripts/build-resume-pdf.ts` — Puppeteer build step (postbuild hook); emits `/public/resume.pdf`
- [ ] `tests/about/about-page.test.tsx` — content + heading-hierarchy + a11y landmark assertions
- [ ] `tests/about/anti-patterns.test.ts` — extends Phase 4 banned-words source-grep to about + resume sources (or fork manifest per STATE.md guidance)
- [ ] `tests/resume/resume-page.test.tsx` — content + heading-hierarchy + section-order + a11y landmark + skip-link assertions
- [ ] `tests/resume/resume-schema.test.ts` — Zod schema validation; round-trip fixtures
- [ ] `tests/resume/pdf-build.test.ts` — smoke test for the Puppeteer pipeline (size bounds + `%PDF-` magic bytes; `it.skip` fallback for jsdom)
- [ ] `tests/resume/print-css.test.ts` — DOM-attribute regex on `resume.css` source asserting the `@media print` block contains the locked rules (page size, body 10pt, H2 12pt uppercase, link inherit, hide chrome)

**Files to modify:**

- [ ] `components/site/footer.tsx` — update `EMAIL_URL` subject; insert `<DownloadPdfLink>` + `·` separator before `view source` (CTC-02 verification + CTC-01 download affordance)
- [ ] `tests/site/footer.test.tsx` — extend Phase 1 footer test to assert the updated mailto subject contains `hi%20from%20olivelliott.dev` and that `<DownloadPdfLink>` renders inside the right slot
- [ ] (Optional, flagged for Phase 5 plan but not strictly UI-SPEC scope): verify and update `GITHUB_URL` / `VIEW_SOURCE_URL` constants in footer from `ophelia-x` to `olivelliott` per STATE.md handle canonicalization

**404-safe stub for `/public/resume.pdf`** (per CONTEXT.md § Claude's Discretion):

- [ ] Wave 0 deliverable — drop a placeholder `/public/resume.pdf` (an empty PDF skeleton or a "Phase 5 build pending" 1-page PDF) so the footer link does not 404 between Wave 0 and the wave that wires Puppeteer. The Puppeteer build step overwrites it in the final wave.

---

## Anti-Patterns (Phase 5 — explicit list)

1. **No marketing voice** in `/about` bio, `/about` framing, or `/resume` summary. Banned-words list enforced via source-grep.
2. **No skill bars** / progress meters / star ratings on the resume skills section. Skills are a categorized `<dl>` of comma-joined items — flat, factual.
3. **No "years of experience" headline framing** on the resume header. Role line is `Software Engineer · AI Workflow Architect · System Architect`; the summary paragraph mentions `3+ years` once, in body text, where it belongs.
4. **No portrait photo** on `/about`. Deferred to v2 per CONTEXT.md § Deferred Ideas.
5. **No bento layout** anywhere on `/about` or `/resume`. Both are single-column documents.
6. **No call-to-action stack** ("Hire me! Email me! Schedule a call!"). The contact-stack on `/about` is three plain links; the footer adds a single mailto. No buttons, no cards around contact links, no "Let's chat" framing.
7. **No autoplay video, no animated GIFs, no Lottie, no Rive, no `<m.*>` islands** in any Phase 5 component.
8. **No QR code on the printed resume** linking to the live site. Deferred per CONTEXT.md.
9. **No "Last updated" timestamp** on the resume (would require client-side date logic and reads template-y). Resume content is canonical via git history.
10. **No "References available on request" line.** Implicit.
11. **No print-only branding flourish** (e.g. a decorative line at the top of the page). The print stylesheet is utilitarian by design — the H2 underlines are the only decorative element on paper.
12. **No `noindex` on `/resume`** in Phase 5 — that's a Phase 6 audit decision.
13. **No animated `<DownloadPdfLink>`** (pulse, bounce, "Download me!" callout). It's a quiet link, like `view source`.
14. **No splitting `/about` and `/resume` into different design systems.** Both inherit the same tokens, the same family, the same accent rules.

---

## Checker Sign-Off

- [ ] **Dimension 1 Copywriting:** PASS (banned-word list enforced; `Passionate` from .docx rewritten to `Active in`; all microcopy locked; thesis-forward bio; contact + download links use literal `verb + noun`)
- [ ] **Dimension 2 Visuals:** PASS (no gradients, no glassmorphism, no shadows, no rounded chrome beyond inherited pill 2px; editorial single-column layout on both routes; print stylesheet bounded to `app/resume/resume.css` only)
- [ ] **Dimension 3 Color:** PASS (60/30/10 preserved; zero new screen tokens; accent reserved-for list extended explicitly; print mode `#000` / `#fff` documented as the single bounded exception class; AA+AAA pairings verified for screen and print)
- [ ] **Dimension 4 Typography:** PASS (zero new type roles; ceiling held at 5 sizes / 3 weights from Phase 3; mono override on resume H2 documented as composition not addition; body-medium 500 documented as first activation of a reserved combination)
- [ ] **Dimension 5 Spacing:** PASS (4px base preserved; zero new spacing tokens; touch-target exceptions documented; `@page 0.5in` margin documented as the second print-only exception class)
- [ ] **Dimension 6 Registry Safety:** PASS (no registries used; no third-party blocks; lineage of "no shadcn in v1" carried forward from Phase 1)

**Approval:** pending — awaiting gsd-ui-checker.
