# Phase 5: About + Resume + Contact - Context

**Gathered:** 2026-05-17
**Status:** Ready for planning
**Mode:** Smart discuss (autonomous)

<domain>
## Phase Boundary

Three deliverables that complete the v1 site's content surfaces beyond projects: (1) `/about` page — single-column long-form bio with values, current role at Aktiga, and contact affordances; (2) `/resume` route — HTML render of a typed source-of-truth at `content/resume.ts`, with dedicated print CSS and a build-step Puppeteer pipeline that emits `/public/resume.pdf`; (3) footer-level contact verification + a download.pdf link addition. Not in scope: project content (Phase 7), SEO/OG audit (Phase 6), authoring full final resume copy (placeholder-allowed where Olive's current resume.docx is ambiguous).

</domain>

<decisions>
## Implementation Decisions

### Resume Source of Truth & Schema (RES-01)
- **Source format:** Typed TypeScript object at `content/resume.ts` exporting a const `RESUME` that satisfies a `ResumeSchema` Zod schema in `lib/schemas.ts`. Pure data, no JSX. Both the HTML page and the PDF pipeline consume the same object — single source of truth.
- **Schema shape:**
  - `header`: `{ name, role, location, links: { github, email, linkedin } }`
  - `summary`: short paragraph (string)
  - `experience`: array of `{ role, company, location, period, bullets: string[] }`
  - `projects`: array of `{ name, link?: string, period, bullets: string[] }`
  - `education`: array of `{ degree, institution, year, location? }`
  - `skills`: array of `{ category, items: string[] }` (categorized)
- **Real vs placeholder:** Real content where Olive has it (extract from `Olive_Elliott_Resume.docx` at repo root — present since session start). Anything ambiguous gets `// PLACEHOLDER: confirm with Olive` comments. Aktiga role title in particular may be a placeholder. No fabricated outcomes or metrics.
- **Resume page route placement:** `app/resume/page.tsx` — NOT inside `(site)/` route group. This opts the route out of nav/footer/MotionProvider chrome, giving clean print and PDF output. The resume route has its own minimal layout (`app/resume/layout.tsx`) that imports the print stylesheet and renders only the resume content.

### PDF Generation Pipeline (RES-04)
- **Tool:** Puppeteer via `puppeteer-core` + `@sparticuz/chromium-min` for slim install (verified in Phase 5 research; decouples from system Chrome).
- **When generated:** Build-step script at `scripts/build-resume-pdf.ts` invoked via `pnpm postbuild` hook in package.json. The script: (a) starts `next start` headless on a local port, (b) waits for /resume to be ready, (c) Puppeteer navigates with `emulateMediaType('print')`, (d) writes to `/public/resume.pdf`, (e) shuts down the server. PDF is committed to git so deploys don't need Puppeteer installed.
- **Print stylesheet:** Dedicated `app/resume/resume.css` imported by `app/resume/layout.tsx`. Single `@media print { ... }` block. Hides nav/footer/download-link/decorative chrome. Switches to black-on-white palette. Adjusts type scale for paper. Removes link colors (just underline). Forces page-break-inside: avoid on each section.
- **PDF parity verification:** Smoke test at `tests/resume/pdf-build.test.ts` runs the build script (or skips with explicit `it.skip` if Puppeteer can't init in jsdom — falls back to asserting the script file exists and exports a callable function). When run in CI, asserts: file `/public/resume.pdf` exists, file size between 20KB–200KB (rejects empty or bloated), MIME PDF magic bytes (`%PDF-`). No pixel-diff (brittle); structural check is sufficient because both HTML and PDF render from the same React tree.

### /about Page Composition (ABT-01..03, CTC-03)
- **Layout:** Single-column long-form (max-w-prose ~65ch inside max-w-6xl shell). Section order:
  1. Page H1: `about` (display scale, lowercase).
  2. Mono eyebrow `who I am` → 3-paragraph bio.
  3. H2 `what I'm working on` → 1-paragraph framing → project pill row pulling from `getHeroProjects()` (auto-updates when Phase 7 lands more hero MDX).
  4. H2 `how to reach me` → contact affordances stack.
  5. H2 `values` → 3-item list (polymath / autonomous workflows / open-source communities).
- **Bio voice:** Plain-spoken first person. Names Aktiga as current role (role title may be `// PLACEHOLDER` if Olive hasn't confirmed). Anchors the thesis (autonomous workflows + local-first + freedom for other things). NOT marketing copy; banned words from Phase 4's anti-pattern net carry forward.
- **Project pill row:** Visually echoes Phase 3's `TagChipRow` but renders project slugs (linking to `/projects/${slug}`) instead of tag values. Auto-pulls from `getHeroProjects()` so /about stays current as Phase 7 adds projects.
- **Contact affordances on /about:** Three explicit links rendered in a small mono stack under `how to reach me`:
  - `github.com/olivelliott` — plain `<a>` with accent underline on hover
  - `olivelliott48@gmail.com` — `<a href="mailto:olivelliott48@gmail.com?subject=hi%20from%20olivelliott.dev">`
  - LinkedIn URL — plain `<a>` (link itself stored in PROJECT.md as `// PLACEHOLDER` if not confirmed)

### Resume HTML Render (RES-02, RES-05)
- **Composition:**
  - Header row: `olive elliott` (display), role + location on next line (body), three contact links (small mono) inline below.
  - Summary: single paragraph in `--color-text-secondary`.
  - Sections in order: **experience → projects → skills → education**.
  - Each section: H2 in mono lowercase, then list of entries.
  - Entry: title (body-medium 500), meta line (period, location in `--color-text-tertiary` label size), 2–4 bullet points.
  - Tight vertical rhythm — paper-density, not screen-airy. Body type stays 16px on screen but the print stylesheet drops to 10pt for paper.
- **`download.pdf ↓` link placement:** Top-right of /resume (small mono). Also added to the existing footer alongside the GitHub/email/LinkedIn icons. Both hidden in print mode via CSS.
- **Print CSS specifics:**
  - `@page { size: A4; margin: 0.5in; }`
  - Black-on-white palette (`color: #000; background: #fff`)
  - Body 10pt, H2 12pt mono uppercase
  - No link colors — `a { color: inherit; text-decoration: underline; }`
  - `section { page-break-inside: avoid; }`
  - Line-height 1.35 (vs 1.6 on screen)
  - Hide nav/footer/download-link (`display: none`)

### Footer Tweaks (CTC-01, CTC-02)
- No structural change. Phase 1 footer already has GitHub/email/LinkedIn icons.
- **Verify:** the `mailto:` href includes `?subject=hi%20from%20olivelliott.dev` (CTC-02). If Phase 1 shipped without the subject, update the existing footer component (`components/site/footer.tsx`) — single one-line change. Phase 5 test asserts the subject is present.
- **Add:** `download.pdf` link to footer alongside the icons. Small mono lowercase, separator dot.

### Claude's Discretion
- Exact resume copy where Olive's docx is ambiguous — mark as PLACEHOLDER and let Phase 7 fill.
- Whether resume bullets are auto-trimmed if too long (defer; assume Olive writes them tight).
- Whether `/about` is RSC-only or has a small client island for the contact stack (recommend RSC-only — no motion needed).
- Whether the project pill row on /about uses the existing `TagChipRow` component shape or a new small `ProjectPill` component (recommend new small component for semantic clarity; it links to slugs, not tags).
- Exact Puppeteer config: viewport size, deviceScaleFactor, waitForSelector strategy. Research will surface defaults that produce a clean A4 PDF.
- Whether the `puppeteer-core` install is dev-only or runtime — recommend `devDependencies` since it only runs at build time.
- Whether to commit the generated PDF or `.gitignore` it (recommend commit — deterministic builds, deploy doesn't need Puppeteer).
- Whether to add a 404-safe stub for `/public/resume.pdf` (Wave 0) so the link doesn't 404 before the PDF pipeline runs in Wave 3.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `lib/schemas.ts` — already exports Zod schemas (Project*). Pattern is established; add ResumeSchema alongside.
- `lib/projects.ts` — `getHeroProjects()` reused by /about's project pill row.
- `components/site/footer.tsx` (Phase 1) — has GitHub/email/LinkedIn icons; needs the `download.pdf` addition + mailto subject verification.
- `components/site/nav.tsx` (Phase 1) — already has the Resume link.
- `app/(site)/layout.tsx` — the standard chrome layout; /resume opts OUT by living at `app/resume/page.tsx` outside the group.
- `styles/tokens.css` — all required tokens available; no new tokens for Phase 5 (resume print uses raw black/white only inside print CSS).
- `mdx-components.tsx` — irrelevant for Phase 5; /about and /resume are not MDX-rendered.
- `lib/utils.ts` — `cn()` helper.
- `Olive_Elliott_Resume.docx` at repo root — the source data for `content/resume.ts`. Extract structured fields, mark ambiguities as PLACEHOLDER.

### Established Patterns
- RSC-first; `'use client'` only where needed (Phase 5 needs zero new client islands).
- Strict TypeScript; Zod schemas in `lib/schemas.ts` are the authoritative shape.
- Design tokens via Tailwind v4 `@theme`. Print CSS is the one exception — uses raw `#000` and `#fff` for paper.
- Tests live next to source under `tests/`. Phase 5 adds `tests/resume/` and `tests/about/`.
- Build-step scripts live under `scripts/` (Phase 3 already established this pattern with `scripts/generate-og-default.ts` — though that one persists per Phase 3 DEFER-02).
- Footer is RSC; no motion island needed for the download.pdf addition.

### Integration Points
- **Consumed by Phase 6 (SEO/A11y audit):** /about and /resume pages get per-route metadata; both routes appear in the sitemap; /resume needs `noindex` consideration (Phase 6 decision) since the PDF is the more shareable artifact.
- **Consumed by Phase 7:** Real resume content edit-in-place if Olive revises; project pill row on /about auto-updates when more hero MDX lands.

</code_context>

<specifics>
## Specific Ideas

- Reference aesthetic: editorial like a magazine spread, not a CV template. Strunk & White prose voice on /about and in the resume summary.
- The resume PDF is the load-bearing CTC artifact for recruiter / client-lead use cases — it must look polished on paper.
- Anti-pattern source-grep net from Phase 4 should be extended to cover Phase 5 sources too (`tests/home/anti-patterns.test.ts` → grow PHASE_SOURCES manifest, or fork to `tests/about/anti-patterns.test.ts` if the manifest gets unwieldy).
- Banned words list (from Phase 4) carries forward — never appears in bio, resume summary, or skill names.
- Email subject `hi from olivelliott.dev` is intentionally lowercase and casual — matches the site voice.

</specifics>

<deferred>
## Deferred Ideas

- Resume themes / multi-template support (one polished layout only in v1).
- Resume content versioning / change-log (defer; git history is enough).
- Resume i18n (out of scope per PROJECT.md).
- /about portrait photo (defer; text-only treatment lands first; revisit if Olive wants a portrait in v2).
- Contact form with backend (rejected per PROJECT.md — mailto sufficient).
- Newsletter signup (rejected per PROJECT.md).
- Cover-letter generator (out of scope).
- Print-only "QR code linking to live site" detail (cute, defer to v2).
- `puppeteer` (not `puppeteer-core`) full Chrome install — heavier; revisit if `chromium-min` proves flaky.

</deferred>
