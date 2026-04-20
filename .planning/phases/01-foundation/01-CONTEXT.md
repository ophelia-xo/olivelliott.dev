# Phase 1: Foundation - Context

**Gathered:** 2026-04-20
**Status:** Ready for planning

<domain>
## Phase Boundary

A deployable Next.js 16 app shell with locked design tokens (color, type scale, motion), Geist typography, `<MotionProvider>` with reduced-motion gating, dark-theme baseline, minimal nav/footer shell, Biome lint/format, and Vercel deploy-on-push. Not in scope: project cards, home page content, project detail pages, content pipeline, resume.

</domain>

<decisions>
## Implementation Decisions

### Typography & Color Tokens
- **Display / body typeface:** Geist Sans via `next/font/local` (and `GeistMono` for code/UI mono). No custom foundry face in v1.
- **Background:** Near-black `#0a0a0a` (zinc-950 semantic) as the page background — forgiving on OLED displays, avoids OLED pure-black bloom.
- **Accent color:** Warm amber (Tailwind amber-500 `#f59e0b` as the source; actual token tuned for WCAG AA against `#0a0a0a` background).
- **Accent strategy:** Single site-wide accent in v1 (links, focus ring, motion highlights). Per-project accents deferred to v2 (CNT2-02).
- **Foreground text tokens:** Tiered off-whites (primary ~#f5f5f5, secondary ~#a3a3a3, tertiary ~#737373) — verify AA contrast against background.
- **Type scale:** Geist at a balanced scale; exact tokens to be specified in UI-SPEC / plan.

### Motion System
- **Depth in Phase 1:** Infrastructure only — `<MotionProvider>` wired (LazyMotion + `MotionConfig reducedMotion="user"`) + one trivial fade-in test element that proves the system works end-to-end.
- **Default duration token:** `--motion-duration: 220ms` (snappy, intent-forward).
- **Default ease curve:** `cubic-bezier(0.22, 1, 0.36, 1)` ("ease-out-expo") — deliberate, non-default feel.
- **Reduced-motion:** OS-level `prefers-reduced-motion` gate only via `MotionConfig reducedMotion="user"`. No manual UI toggle in v1.

### Shell (Nav + Footer + Logo)
- **Nav layout:** Minimal top bar — wordmark left, 4 links right (Projects, About, Resume, Contact). Mono-cased link labels.
- **Nav scroll behavior:** Static at top. Not sticky, not hide-on-scroll. Editorial, doesn't compete with content.
- **Footer scope (Phase 1 scaffold):** Minimal — copyright line, GitHub / Email / LinkedIn icon links, "view source" link. No multi-column sitemap yet; /about, /resume, /projects links live only in nav.
- **Logo mark:** Wordmark `olive elliott` in GeistMono, lowercase, subtle kerning, same weight as nav links (unassuming).

### Deployment & Tooling
- **Package manager:** pnpm 9.x (per STACK.md).
- **Lint/format:** Biome 2.3+ configured to replace ESLint + Prettier; `.eslintrc*` / `.prettierrc*` deleted.
- **TypeScript:** strict mode (per PROJECT.md constraint).
- **Vercel:** Project connected, `main` pushes auto-deploy, sub-domain target only (custom domain deferred).

### Claude's Discretion
- Exact token hex values within the ranges above (e.g., secondary text gray tier).
- Folder structure details consistent with `.planning/research/ARCHITECTURE.md` (app/, components/ui, components/motion, components/site, lib/, styles/).
- Skip-to-content implementation style (visually hidden until focused; target `#main`).
- Focus-ring style — visible 2px outline with accent color, `outline-offset: 2px`.
- Initial route set — root layout + home route with minimal "under construction / coming soon" placeholder that satisfies success criteria (shows nav, footer, a test motion element); real home page content lands in Phase 4.
- Test motion element — a single `FadeIn` wrapping a subtle visual on the placeholder home, demonstrating motion provider.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — greenfield repo. Only files present are `CLAUDE.md` and `Olive_Elliott_Resume.docx`.

### Established Patterns
- Patterns will be established in this phase — all downstream phases follow from here.
- `.planning/research/ARCHITECTURE.md` is the reference for folder structure and RSC-vs-client-island discipline.
- `.planning/research/STACK.md` is the reference for locked versions and package choices.
- `.planning/research/PITFALLS.md` is the launch-gate checklist for AI-aesthetic and motion anti-patterns to avoid.

### Integration Points
- None yet — this phase creates the integration surface.
- Downstream phases will plug into: root layout (nav/footer/MotionProvider), `styles/tokens.css` (@theme), `lib/` (future content facade).

</code_context>

<specifics>
## Specific Ideas

- Reference aesthetic: wallofportfolios.in (dark, minimalist, typographic rhythm, deliberate grid).
- Anti-features to actively avoid (per `.planning/research/FEATURES.md`): skill bars, gradient-on-gradient, stagger-on-scroll, AI-template gradient blobs, glassmorphism cards, hero blob backgrounds, Lottie default, cookie banners, R3F 3D heroes.
- Geist is the signal, not a placeholder. Resist template temptations.

</specifics>

<deferred>
## Deferred Ideas

- Per-project accent color variable (v2 — CNT2-02).
- Custom foundry typeface in place of Geist (defer until v2; reassess after launch).
- Manual reduced-motion UI toggle in footer (OS gate sufficient for v1; revisit if feedback surfaces).
- Sticky nav / backdrop-blur on scroll (defer — static reads more editorial).
- Richer footer with multi-column sitemap (defer — nav covers current routes).
- View Transitions API for cross-route motion (v2 — VTX-01).

</deferred>
