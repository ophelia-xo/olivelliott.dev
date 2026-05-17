# Phase 5: About + Resume + Contact - Research

**Researched:** 2026-05-17
**Domain:** Next.js 16 route-group composition, build-time Puppeteer PDF pipeline, print CSS, in-repo typed content sources, footer mechanics
**Confidence:** HIGH overall (Next.js 16 routing/CSS, Puppeteer API, pnpm hooks); MEDIUM on LinkedIn handle (placeholder); HIGH on package versions (verified against npm registry on 2026-05-17).

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Resume Source of Truth & Schema (RES-01)**
- **Source format:** Typed TypeScript object at `content/resume.ts` exporting a const `RESUME` that satisfies a `ResumeSchema` Zod schema in `lib/schemas.ts`. Pure data, no JSX. Both the HTML page and the PDF pipeline consume the same object — single source of truth.
- **Schema shape:**
  - `header`: `{ name, role, location, links: { github, email, linkedin } }`
  - `summary`: short paragraph (string)
  - `experience`: array of `{ role, company, location, period, bullets: string[] }`
  - `projects`: array of `{ name, link?: string, period, bullets: string[] }`
  - `education`: array of `{ degree, institution, year, location? }`
  - `skills`: array of `{ category, items: string[] }` (categorized)
- **Real vs placeholder:** Real content from `Olive_Elliott_Resume.docx`. Ambiguities get `// PLACEHOLDER: confirm with Olive`. Aktiga role title may be placeholder. No fabricated outcomes.
- **Resume page route placement:** `app/resume/page.tsx` — NOT inside `(site)/` route group. Opt out of nav/footer/MotionProvider chrome via own minimal `app/resume/layout.tsx` that imports `app/resume/resume.css`.

**PDF Generation Pipeline (RES-04)**
- **Tool:** Puppeteer via `puppeteer-core` + `@sparticuz/chromium-min` (CONTEXT decision). *(Research finds full `puppeteer` is the simpler/safer recommendation for local build-time use — see Open Question 1 — but CONTEXT's chromium-min path is honored as the locked decision below.)*
- **When generated:** Build-step script at `scripts/build-resume-pdf.ts` invoked via `pnpm postbuild` in `package.json`. Script: (a) starts `next start` headless on local port, (b) waits for `/resume` ready, (c) Puppeteer navigates with `emulateMediaType('print')`, (d) writes `/public/resume.pdf`, (e) shuts down server. PDF committed to git so deploys don't need Puppeteer.
- **Print stylesheet:** Dedicated `app/resume/resume.css` imported by `app/resume/layout.tsx`. Single `@media print` block. Hides nav/footer/download-link/decorative chrome. Black-on-white palette. Adjusts type for paper. Removes link colors (underline only). `page-break-inside: avoid` per section.
- **PDF parity verification:** Smoke test at `tests/resume/pdf-build.test.ts` either runs build script or `it.skip` if Puppeteer can't init. Falls back to asserting script file exists and exports callable function. In CI: file `/public/resume.pdf` exists, size 20KB–200KB, `%PDF-` magic bytes. No pixel-diff.

**/about Page Composition (ABT-01..03, CTC-03)**
- Single-column long-form (`max-w-prose` inside `max-w-6xl`). Section order: H1 `about` → eyebrow `who I am` + 3-paragraph bio → H2 `what I'm working on` + 1-paragraph framing + ProjectPillRow from `getHeroProjects()` → H2 `how to reach me` + contact stack → H2 `values` + 3-item list.
- Bio voice: plain-spoken first person. Names Aktiga. Anchors thesis (autonomous workflows + local-first + freedom). Banned-words list from Phase 4 carries forward.
- Project pill row: Phase 3 `TagChipRow` visual treatment but project slugs linking to `/projects/${slug}`. Auto-pulls from `getHeroProjects()`.
- Contact affordances on /about: three explicit links in mono stack under `how to reach me` — `github.com/olivelliott`, mailto with subject `hi%20from%20olivelliott.dev`, LinkedIn URL (PLACEHOLDER until confirmed).

**Resume HTML Render (RES-02, RES-05)**
- Header row: `olive elliott` (display), role + location (body), three contact links (small mono).
- Summary: single paragraph in `--color-text-secondary`.
- Sections in order: experience → projects → skills → education.
- Each section: H2 mono lowercase, then list of entries.
- Entry: title (body-medium 500), meta line (period, location in `--color-text-tertiary`), 2–4 bullets.
- Tight vertical rhythm. Body 16px on screen, 10pt print.
- `download.pdf ↓` top-right of /resume (small mono) + in footer alongside icons. Hidden in print mode.
- Print CSS: `@page { size: A4; margin: 0.5in; }`, black-on-white, body 10pt, H2 12pt mono uppercase, `a { color: inherit; text-decoration: underline; }`, `section { page-break-inside: avoid; }`, line-height 1.35, hide nav/footer/download-link.

**Footer Tweaks (CTC-01, CTC-02)**
- No structural change. Phase 1 footer has GitHub/email/LinkedIn icons.
- Verify mailto includes `?subject=hi%20from%20olivelliott.dev`. If not, update `components/site/footer.tsx`.
- Add `download.pdf` link to footer alongside icons. Small mono lowercase, separator dot.

### Claude's Discretion

- Exact resume copy where docx is ambiguous — mark PLACEHOLDER, Phase 7 fills.
- Whether resume bullets are auto-trimmed if too long (defer — Olive writes tight).
- `/about` RSC-only or small client island for contact stack — **recommend RSC-only** (no motion needed).
- ProjectPillRow new small component vs reuse TagChipRow — **recommend new small component** for semantic clarity.
- Exact Puppeteer config (viewport, deviceScaleFactor, waitForSelector). Research surfaces defaults producing clean A4 PDF.
- Puppeteer install dev-only vs runtime — **recommend devDependencies** (only build-time).
- Commit generated PDF vs `.gitignore` — **recommend commit** (deterministic, deploy doesn't need Puppeteer).
- 404-safe stub for `/public/resume.pdf` (Wave 0) so link doesn't 404 before pipeline runs in Wave 3.

### Deferred Ideas (OUT OF SCOPE)

- Resume themes / multi-template support.
- Resume content versioning / changelog.
- Resume i18n.
- /about portrait photo (v2).
- Contact form with backend (rejected per PROJECT.md — mailto sufficient).
- Newsletter signup (rejected).
- Cover-letter generator.
- Print-only QR-code-to-live-site detail (v2).
- `puppeteer` (full) install — heavier; revisit if chromium-min flaky.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| ABT-01 | `/about` page contains real bio (not AI-generated "passionate developer" copy) reflecting polymath/autonomous-workflows thesis | Locked bio copy in UI-SPEC § Copywriting Contract; banned-words anti-pattern net (extends Phase 4 `tests/home/anti-patterns.test.ts`) verifies absence of banned terms; `<AboutBio>` is RSC with hard-coded copy |
| ABT-02 | About page anchors current role at Aktiga | Bio paragraph 2 names "currently at Aktiga, leading system architecture and AI-workflow design"; .docx confirms role title verbatim (no PLACEHOLDER needed) |
| ABT-03 | About page includes values/interests thesis rests on (open-source, local-first, world we want to live in) | `<ValuesList>` definition list with three locked entries: polymath / autonomous workflows / open-source communities |
| RES-01 | Resume content in typed source-of-truth file (TS or MDX) — not duplicated | `content/resume.ts` exporting `RESUME` const conforming to `ResumeSchema` (Zod, in `lib/schemas.ts`). Both HTML page and Puppeteer-rendered PDF consume same object |
| RES-02 | `/resume` route renders resume as HTML from source-of-truth | `app/resume/page.tsx` (RSC) composes `<ResumeHeader>` + 5 `<ResumeSection>` components hydrating from `RESUME` |
| RES-03 | `/resume` route has dedicated print CSS (`@media print`) so same React tree prints correctly | `app/resume/resume.css` imported by `app/resume/layout.tsx`. Single `@media print` block. Verified Next.js 16 supports CSS imports inside layout files scoped to subtree |
| RES-04 | Build-step using Puppeteer produces `/public/resume.pdf` from `/resume` page | `scripts/build-resume-pdf.ts` invoked via `pnpm postbuild`. Uses `puppeteer-core` + `@sparticuz/chromium-min@148.0.0` (CONTEXT decision) — research recommends full `puppeteer@25.0.2` as simpler alternative (Open Question 1) |
| RES-05 | Resume PDF linked as visible download on `/resume` and in footer | `<DownloadPdfLink>` component renders `<a href="/resume.pdf" download>download.pdf ↓</a>` — used top-right of `<ResumeHeader>` and inline in `<Footer>` |
| RES-06 | Resume content reflects current work, current role, real skills — no stale/fabricated entries | Extracted .docx data populates `content/resume.ts` verbatim; PROFILE summary rewritten to strip banned word "Passionate" → "Active in"; LinkedIn handle PLACEHOLDER pending Olive's confirmation |
| CTC-01 | Footer includes working links for GitHub, email, LinkedIn | Existing `components/site/footer.tsx` has all three (Phase 1). Verification + GitHub handle fix (`ophelia-x` → `olivelliott`) flagged for plan |
| CTC-02 | Email is mailto link with pre-filled subject appropriate to portfolio contact | Phase 1 shipped `?subject=olivelliott.dev`; Phase 5 changes to `?subject=hi%20from%20olivelliott.dev` (URL-encoded space — Pitfall 5). Single-line edit |
| CTC-03 | Contact affordances appear in at least two places (About and footer) | `<ContactStack>` on /about + `<Footer>` icons on every page = two surfaces satisfying CTC-03 |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

- **Tech stack:** Next.js 16.2.4 App Router, React 19.2.4, TypeScript 5.7.3 strict mode (already in repo per `package.json`)
- **Hosting:** Vercel; deploy on every `main` push
- **Content delivery:** in-repo (MDX/TS), no CMS
- **Aesthetic:** dark theme, minimalist, high-touch — NOT generic AI-template
- **Performance:** Lighthouse ≥ 90 across categories (Phase 6 enforces; Phase 5 must not regress)
- **Accessibility:** WCAG AA, keyboard nav, reduced-motion support, sufficient contrast in dark theme
- **Privacy:** no internal Aktiga details, no proprietary details
- **Content honesty:** placeholders are explicit — never fabricate outcomes/metrics/claims
- **GSD workflow enforcement:** all file changes go through GSD commands; direct edits forbidden outside workflow
- **No new screen-mode tokens in Phase 5** — UI-SPEC locked. Print CSS is the one documented `#000/#fff` exception class.
- **Phase 5 ships zero motion islands; zero new client islands; zero new icon usage; zero new registry components.**

## Summary

Phase 5 sits at a relatively easy technical intersection — every domain has well-established 2026 patterns in Next.js 16 + Puppeteer 25, every locked decision in CONTEXT.md is implementable as-specified, and the existing repo (Phase 1 footer, lib/schemas.ts Zod patterns, Phase 4 RSC discipline, `tests/home/anti-patterns.test.ts` source-grep regression net) provides all the scaffolding the executor needs. The only architectural finesse is the **chromeless layout opt-out** for `/resume`: living at `app/resume/page.tsx` outside the `(site)/` route group makes Next.js skip the site shell layout while still inheriting the root `app/layout.tsx` (font variables, `globals.css`, `<Providers>`). This is the documented App Router convention as of Next 16.2.6 (May 2026) and works exactly as CONTEXT.md describes.

The Puppeteer pipeline is the highest-risk surface — three concrete trap classes (spawn lifecycle, `preferCSSPageSize` quirks, port collisions on CI) are documented below with mitigations. The locked decision (`puppeteer-core` + `@sparticuz/chromium-min@148.0.0`) is workable but heavier than necessary for **local-only build-time use**; the simpler `puppeteer@25.0.2` full package (auto-downloads Chrome to `~/.cache/puppeteer`) is what's recommended for non-serverless build scripts per Puppeteer's own docs and is flagged in Open Question 1 for planner discretion. PDF is committed to git so production deploys never need a browser binary either way.

The footer audit is a clean two-line diff: GitHub URL needs `ophelia-x → olivelliott`, view-source URL needs the same fix, and the mailto subject string flips from `olivelliott.dev` to `hi%20from%20olivelliott.dev`. The download.pdf link is one new component file (`<DownloadPdfLink>`) inserted into the existing right-slot row. All resume data is already extracted from `Olive_Elliott_Resume.docx` (see § Resume Data — Pre-Extracted) so the executor does NOT need to re-parse the docx.

**Primary recommendation:** Use full `puppeteer@25.0.2` as a `devDependency` (override CONTEXT decision if planner agrees — flagged as Open Question 1). Write `scripts/build-resume-pdf.ts` against `wait-on@9.0.10` for server-ready detection. Bind to a deterministic port (`3057` recommended — odd-numbered, unlikely to clash). Use `preferCSSPageSize: true` with `@page { size: A4; margin: 0.5in; }` declared in `resume.css` so paper geometry lives in CSS, not script options. Run via `pnpm postbuild` with `set -e` semantics (Node script exits 1 on failure → pnpm propagates → `next build` chain fails the deploy, which is the correct conservative behavior for a CV artifact). Wave 0 ships a 1-byte `/public/resume.pdf` stub so the download link doesn't 404 before Wave 3 lands the real pipeline.

## Standard Stack

### Core (already installed — no changes)

| Library | Version (current in repo) | Purpose | Why Standard |
|---------|---------------------------|---------|--------------|
| `next` | `16.2.4` | App Router framework | Phase 5 uses route groups, layouts, `Metadata` API, RSC, `next/link`, `next start` — all stable Next 16 surfaces |
| `react` | `19.2.4` | UI runtime | Used as-is; no new client islands in Phase 5 |
| `typescript` | `5.7.3` (strict) | Type safety | `RESUME` const inferred from `z.infer<typeof ResumeSchema>` |
| `zod` | `^3.23.0` | Schema validation | `ResumeSchema` joins existing `ProjectFrontmatterSchema` in `lib/schemas.ts` |
| `tailwindcss` | `^4` | Styling | CSS-first via `@theme` in `styles/tokens.css`; print CSS is one `@media print` block in `app/resume/resume.css` |
| `geist` | `^1.7.0` | Typography | `GeistSans` and `GeistMono` already wired in `app/layout.tsx` — inherited by /resume |
| `tailwind-merge`, `clsx` | `^3.5.0`, `^2.1.1` | `cn()` helper in `lib/utils.ts` | Used for class composition |

### New for Phase 5 (RES-04 PDF pipeline)

| Library | Version | Purpose | Install scope |
|---------|---------|---------|---------------|
| **`puppeteer`** | **`25.0.2`** (current 2026-05-17) | Headless Chrome control for `page.pdf()` | `devDependency` — only runs at build time. **Recommendation:** install the full `puppeteer` package, not `puppeteer-core`, for local build-step simplicity. See § Open Question 1 for the chromium-min alternative. |
| **`wait-on`** | **`9.0.10`** (current 2026-05-17) | Wait for `next start` to be ready on local port before navigating | `devDependency`. Programmatic Node API; supports `http://localhost:PORT/resume` resource type. |

**Verified package versions (`npm view ... version`, 2026-05-17):**
- `puppeteer@25.0.2`
- `puppeteer-core@25.0.2`
- `@sparticuz/chromium-min@148.0.0`
- `@sparticuz/chromium@148.0.0`
- `wait-on@9.0.10`
- `wait-port@1.1.0`

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `puppeteer` (full) | `puppeteer-core` + `@sparticuz/chromium-min@148.0.0` | CONTEXT.md decision. Necessary for serverless (250MB Lambda limit) but **overkill for local build-time**. `chromium-min` requires externally hosted Brotli binaries — extra setup. Full `puppeteer` auto-downloads Chrome to `~/.cache/puppeteer` (~170–282MB depending on OS) and works on every developer machine with zero config. Since we never run this in serverless (PDF is committed to git), the size argument doesn't apply. |
| `puppeteer` | `playwright@1.60.0` | Playwright API is broadly similar; `page.pdf()` exists; but introduces a second test runner ecosystem (Playwright Test) the project doesn't use. Puppeteer is single-purpose for this script. |
| `puppeteer` | `@react-pdf/renderer` | Different model — renders React components to PDF directly, no browser. Would mean maintaining a parallel component tree for PDF that can't reuse the print CSS. Rejected at project research level per STATE.md (`research/SUMMARY.md` lists `@react-pdf/renderer` as an explicit reject). |
| `wait-on` | `wait-port@1.1.0` | TCP-port-only; simpler but doesn't verify the HTTP response. For Next.js `next start` the HTTP-ready check is meaningful (server can bind the port before being ready to serve), so wait-on's HTTP mode is better. |
| `wait-on` | hand-rolled polling (`fetch` in a loop) | One more file, one more bug surface. wait-on is 5 transitive deps, tiny, mature (since 2015). Use it. |

**Installation:**

```bash
pnpm add -D puppeteer@25.0.2 wait-on@9.0.10
```

*(If planner sticks with CONTEXT's chromium-min decision: `pnpm add -D puppeteer-core@25.0.2 @sparticuz/chromium-min@148.0.0 wait-on@9.0.10` — and the script must additionally download/host the Brotli binary, see Open Question 1.)*

### Version Verification

All versions verified against npm registry on 2026-05-17:

```bash
$ npm view puppeteer version            → 25.0.2
$ npm view puppeteer-core version       → 25.0.2
$ npm view @sparticuz/chromium-min version → 148.0.0
$ npm view wait-on version              → 9.0.10
```

Puppeteer 25 was released ~early 2026 and is the current stable. Puppeteer 24.x is one major behind (24.43.1 → 25.0.2; safe to use either, but 25 is current).

## Architecture Patterns

### Recommended File Structure (Phase 5 additions only)

```
app/
├── (site)/
│   ├── about/
│   │   └── page.tsx                    # <AboutPage> RSC, exports metadata
│   ├── layout.tsx                      # EXISTING — unchanged
│   └── page.tsx                        # EXISTING — Phase 4 home
├── resume/                              # NEW — outside the (site) group
│   ├── layout.tsx                       # chromeless wrapper; imports resume.css
│   ├── page.tsx                         # <ResumePage> RSC, exports metadata
│   └── resume.css                       # screen overrides + single @media print block
└── layout.tsx                          # EXISTING root layout — wraps EVERYTHING including /resume

components/
├── about/                               # NEW directory
│   ├── about-bio.tsx                    # 3-paragraph bio
│   ├── project-pill-row.tsx             # pills pulling getHeroProjects()
│   ├── contact-stack.tsx                # github + email + linkedin stacked
│   └── values-list.tsx                  # 3 dl items
├── resume/                              # NEW directory
│   ├── resume-header.tsx                # H1 + role/location + contact line + DownloadPdfLink
│   ├── resume-section.tsx               # generic <section aria-labelledby> wrapper
│   ├── resume-entry.tsx                 # generic entry: title + meta + bullets + optional link
│   └── download-pdf-link.tsx            # <a href="/resume.pdf" download>download.pdf ↓</a>
└── site/
    └── footer.tsx                       # EDIT — fix GitHub handle, update mailto subject, insert <DownloadPdfLink>

content/
└── resume.ts                            # NEW — typed RESUME const conforming to ResumeSchema

lib/
└── schemas.ts                           # EDIT — add ResumeSchema alongside ProjectFrontmatterSchema

public/
└── resume.pdf                           # Wave 0 stub (1 byte); Wave 3 real PDF from postbuild

scripts/
└── build-resume-pdf.ts                  # NEW — Puppeteer pipeline runner

tests/
├── about/                               # NEW directory
│   ├── about-page.test.tsx              # RSC render + accessibility + heading hierarchy
│   ├── about-bio.test.tsx               # bio paragraphs + banned words
│   ├── project-pill-row.test.tsx        # links to /projects/${slug} not ?tag=
│   ├── contact-stack.test.tsx           # 3 links; mailto subject; aria
│   └── values-list.test.tsx             # 3 dl items
├── resume/                              # NEW directory
│   ├── resume-page.test.tsx             # RSC render + skip link + sections + metadata
│   ├── resume-header.test.tsx           # H1 + role + contact line + download link
│   ├── resume-section.test.tsx          # aria-labelledby wiring; sr-only summary
│   ├── resume-entry.test.tsx            # title + meta + bullets + optional repo link
│   ├── download-pdf-link.test.tsx       # href + download attribute + label
│   ├── schema.test.ts                   # ResumeSchema validates RESUME; rejects malformed
│   ├── content.test.ts                  # RESUME has minimum required entries; no banned words
│   ├── print-css.test.ts                # source-grep: @media print exists; @page exists; etc.
│   ├── pdf-build.test.ts                # structural: script file exists, exports callable
│   └── pdf-artifact.test.ts             # CI/skip: /public/resume.pdf exists, %PDF- magic bytes, 20KB–200KB
└── home/
    └── anti-patterns.test.ts            # EDIT — extend PHASE4_SOURCES manifest with Phase 5 sources (or fork to tests/about/anti-patterns.test.ts)
```

### Pattern 1: Route-Group Opt-Out for Chromeless Page

**What:** A page that lives outside an existing route group inherits only the root `app/layout.tsx`, skipping the route-group layout in between.

**When to use:** Pages with intentionally different chrome (print-friendly resume, embed widget, full-screen demo). Documented Next.js convention.

**How it works (Next.js 16.2.6, May 2026):**

- Route groups are folders wrapped in parens — `(site)`. They're organizational only; the parens never appear in URL paths.
- `app/(site)/layout.tsx` wraps everything inside `(site)/`.
- `app/resume/page.tsx` lives outside `(site)/`, so it does NOT inherit `app/(site)/layout.tsx`.
- The root `app/layout.tsx` (which owns `<html>`, `<body>`, the Geist font variables, and `globals.css`) DOES wrap `app/resume/page.tsx` — because the root layout wraps every route in the app.
- A sibling `app/resume/layout.tsx` can be added — it composes between root and page (root → resume layout → resume page). This is the place to import route-scoped CSS (`./resume.css`).

**Example:**

```tsx
// Source: nextjs.org/docs/app/api-reference/file-conventions/route-groups (v16.2.6, May 2026)
// app/resume/layout.tsx
import './resume.css'

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

The fragment return (no chrome) is intentional — children is the page. The root layout has already supplied `<html>`, `<body>`, font variables, and `globals.css`. The resume layout adds nothing visual; its only job is to import `resume.css` and scope it via the route subtree.

**Important caveat from Next.js docs:** "If you navigate between routes that use **different root layouts**, it'll trigger a full page reload." This does NOT apply here — `app/resume/layout.tsx` is NOT a root layout, it's a nested layout. The root remains `app/layout.tsx`. Navigation between `/about` and `/resume` is a normal client transition (no full page reload).

### Pattern 2: Build-Step Puppeteer PDF Generation

**What:** A Node script that boots a local Next.js production server, navigates a headless browser to `/resume`, and writes `/public/resume.pdf` from the rendered page.

**When to use:** Any time you need an artifact that's a snapshot of a rendered HTML page (resumes, reports, invoices). Avoids maintaining a parallel React tree for PDF rendering.

**Shape of `scripts/build-resume-pdf.ts`:**

```ts
// Source: pptr.dev/api/puppeteer.page.pdf + jeffbski/wait-on README + Puppeteer docs (v25, 2026)
// Run via `pnpm postbuild`. Exits 0 on success, 1 on failure (propagates to next build).
import { spawn, type ChildProcess } from 'node:child_process'
import { mkdir, stat } from 'node:fs/promises'
import path from 'node:path'
import puppeteer from 'puppeteer'
import waitOn from 'wait-on'

const PORT = 3057                                                    // deterministic, odd-numbered, unlikely to clash
const URL = `http://127.0.0.1:${PORT}/resume`
const OUT_DIR = path.resolve('public')
const OUT_PATH = path.join(OUT_DIR, 'resume.pdf')

async function main() {
  await mkdir(OUT_DIR, { recursive: true })

  console.log(`[resume-pdf] starting next start on :${PORT}`)
  const server: ChildProcess = spawn('node_modules/.bin/next', ['start', '-p', String(PORT)], {
    stdio: ['ignore', 'inherit', 'inherit'],
    env: { ...process.env, NODE_ENV: 'production' },
  })

  // Ensure the server dies even if we crash partway through.
  const shutdown = () => server.kill('SIGTERM')
  process.once('exit', shutdown)
  process.once('SIGINT', shutdown)
  process.once('SIGTERM', shutdown)

  try {
    console.log('[resume-pdf] waiting for server')
    await waitOn({ resources: [URL], timeout: 30_000, interval: 250 })

    console.log('[resume-pdf] launching puppeteer')
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],            // CI safety; harmless locally
    })

    try {
      const page = await browser.newPage()
      await page.emulateMediaType('print')                            // honor @media print rules — RES-03
      await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30_000 })
      await page.evaluateHandle('document.fonts.ready')               // wait for Geist to load before pagination

      await page.pdf({
        path: OUT_PATH,
        format: 'A4',
        printBackground: true,                                        // default is FALSE — must opt in
        preferCSSPageSize: true,                                      // @page in resume.css wins (size + margin)
        // margin is omitted intentionally — @page { margin: 0.5in } in resume.css is the source of truth
      })

      const { size } = await stat(OUT_PATH)
      console.log(`[resume-pdf] wrote ${OUT_PATH} (${(size / 1024).toFixed(1)} KB)`)
      if (size < 20_000 || size > 400_000) {
        throw new Error(`unexpected PDF size: ${size} bytes (expected 20KB–400KB)`)
      }
    } finally {
      await browser.close()
    }
  } finally {
    server.kill('SIGTERM')
    // Give it a moment to release the port for the next run.
    await new Promise((r) => setTimeout(r, 500))
  }
}

main().catch((err) => {
  console.error('[resume-pdf] failed:', err)
  process.exit(1)
})
```

**Key choices and rationale:**

| Choice | Rationale | Source |
|--------|-----------|--------|
| `headless: true` | Default in Puppeteer 25; `headless: 'shell'` is a legacy alias. | pptr.dev |
| `--no-sandbox` | CI environments (and some Linux distros) require this; harmless on macOS/Windows. | Browserless docs |
| `emulateMediaType('print')` | `page.pdf()` defaults to print media but `emulateMediaType` makes it explicit and survives `goto`. | pptr.dev/api/puppeteer.page.pdf |
| `waitUntil: 'networkidle0'` | Waits until no network requests for 500ms. Necessary because Geist fonts load via `next/font` and we need them loaded before pagination. | Puppeteer docs |
| `document.fonts.ready` | Belt-and-braces font wait. Some Chromium builds fire networkidle before the FontFace promises resolve. | MDN FontFaceSet |
| `printBackground: true` | **Default is FALSE.** Without this, every `background-color` in the resume is dropped. The print stylesheet uses `#fff` background but element backgrounds (e.g., the optional hairline `border-top`) won't render without this. | pptr.dev/api/puppeteer.pdfoptions |
| `preferCSSPageSize: true` | Forces `@page` CSS rules to win over JS `format` option. With `false` (default), Puppeteer sometimes ignores `@page size` and `@page margin`, producing the wrong paper geometry. | pptr.dev (issues #437, #6657) |
| `format: 'A4'` (alongside `preferCSSPageSize: true`) | Belt-and-braces. With `preferCSSPageSize: true` the CSS wins; the `format` is a fallback if CSS doesn't declare size. | pptr.dev |
| `margin` omitted | Lives in `@page { margin: 0.5in }` so paper geometry stays in CSS, not in script options. Single source of truth. | UI-SPEC § Print Stylesheet Contract |
| `PORT = 3057` deterministic | Random ports on every run trigger firewall prompts on macOS. 3057 is odd, low-collision, never seen elsewhere in standard tooling. | judgment |
| `127.0.0.1` not `localhost` | Avoids IPv6 resolution variance (`localhost` may resolve to `::1` which Next.js may not bind to). | Common Node.js gotcha |
| `process.once('exit', shutdown)` | Guarantees the server is killed even if Puppeteer throws. Without this, a failed run leaves an orphaned process bound to 3057 and the next run fails to bind. | Node `child_process` docs |
| `await new Promise((r) => setTimeout(r, 500))` | macOS doesn't release TCP ports instantly. Without the cooldown, two consecutive `pnpm build` runs can fail. | judgment |

### Pattern 3: `pnpm postbuild` Hook

**What:** npm convention — any script named `postbuild` runs automatically after `build` finishes. Supported by pnpm.

**`package.json` change:**

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "tsx scripts/build-resume-pdf.ts"
  }
}
```

(`tsx` is already implicitly available because `typescript` is a devDependency; if it isn't resolving, add `tsx@^4` to devDependencies.)

**Failure semantics — fail-fast (recommended) vs warn-and-continue:**

| Option | Behavior | When appropriate |
|--------|----------|------------------|
| **Fail-fast** (recommended) | `tsx scripts/build-resume-pdf.ts` exits 1 on failure → pnpm propagates → entire `pnpm build` chain exits 1 → Vercel deploy fails | This is a CV artifact. Shipping a stale or empty `resume.pdf` is worse than failing the deploy. The plan should explicitly want loud failure. |
| Warn-and-continue | Script catches errors, logs warning, exits 0 | Inappropriate here — silent staleness is exactly the bug we're avoiding. |

The pattern in the example script above (`main().catch((err) => { ... process.exit(1) })`) is fail-fast. This is the recommendation.

**Side note on pnpm lifecycle script blocking (pnpm 10+):** pnpm 10.0.0 introduced blocking of postinstall lifecycle scripts on third-party packages by default (security feature). This applies to **dependency** scripts, NOT to your own project's `package.json` scripts. Our own `postbuild` runs normally — no `pnpm.onlyBuiltDependencies` allowlisting needed for puppeteer because we don't rely on its postinstall (we'll run `npx puppeteer browsers install chrome` manually if needed, see Pitfall 6).

### Pattern 4: Print CSS in a Route-Scoped Layout

**What:** Import a CSS file inside a layout to scope its rules to the layout's subtree.

**When to use:** Print stylesheets that only apply to one route. Avoids polluting `globals.css` with `@media print` rules that would apply across the site.

**Verified Next.js 16.2.6 docs (May 2026):**

> "Global styles can be imported into any layout, page, or component inside the `app` directory."

> "However, since Next.js uses React's built-in support for stylesheets to integrate with Suspense, this currently does not remove stylesheets as you navigate between routes which can lead to conflicts."

**Implication:** `app/resume/resume.css` imported by `app/resume/layout.tsx` works correctly for `/resume`, BUT the stylesheet rules may persist after navigating away from `/resume`. This is fine for Phase 5 because:

1. The `@media print` rules only activate during print, regardless of route.
2. The screen-mode rules use class selectors (`.resume`, `.resume-h2`, `.resume-header`, `.contact-line`, `.resume-skills`) that don't appear on other routes — so no visual leakage.

**Don't use:** CSS Modules for `resume.css`. The print stylesheet needs raw `@page` and `@media print` at-rules which CSS Modules support but reduce readability (and the print CSS is read by humans during a11y/print audits more often than other CSS).

**Order considerations:** The Next.js docs note "the order of your CSS depends on the order you import styles in your code." Since `app/layout.tsx` imports `globals.css` and `app/resume/layout.tsx` imports `resume.css`, and the resume layout is nested inside root, `resume.css` loads AFTER `globals.css`. This means `resume.css` rules win in case of specificity ties — which is what we want for the print overrides.

### Pattern 5: Per-Route Metadata for /about and /resume

Phase 4 STATE.md decision applies verbatim:

> "title declared → composes with titleTemplate; openGraph.images MUST be declared per-route because root layout omits them."

**`/about` metadata:**

```ts
// Source: app/(site)/projects/page.tsx (Phase 4 precedent)
export const metadata: Metadata = {
  title: 'about',
  description: 'Olive Elliott is an engineer focused on autonomous workflows, local-first systems, and tools that support open-source communities. Currently building at Aktiga.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'about · olivelliott.dev',
    description: 'Olive Elliott is an engineer focused on autonomous workflows, local-first systems, and tools that support open-source communities. Currently building at Aktiga.',
    url: '/about',
    type: 'website',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'olivelliott.dev — engineer, autonomy, local-first' }],
  },
  twitter: { card: 'summary_large_image', images: ['/og-default.png'] },
}
```

**`/resume` metadata:**

```ts
export const metadata: Metadata = {
  title: 'resume',
  description: 'Resume for Olive Elliott — engineer focused on autonomous workflows, local-first systems, and open-source tooling. Available as PDF download.',
  alternates: { canonical: '/resume' },
  openGraph: {
    title: 'resume · olivelliott.dev',
    description: 'Resume for Olive Elliott — engineer focused on autonomous workflows, local-first systems, and open-source tooling.',
    url: '/resume',
    type: 'profile',                                                   // 'profile' is more accurate than 'website' for a resume
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'olivelliott.dev — resume' }],
  },
  twitter: { card: 'summary_large_image', images: ['/og-default.png'] },
  // Phase 6 audit decision: add `robots: { index: false }` if the PDF is the canonical share artifact.
}
```

### Anti-Patterns to Avoid

- **`puppeteer-core` without an executable path.** `puppeteer-core` has no Chrome of its own; calling `puppeteer.launch()` without `executablePath` throws. If CONTEXT's chromium-min path is taken, the script MUST set `executablePath: await chromium.executablePath(brotliUrl)` per `@sparticuz/chromium-min` README.
- **`page.pdf()` without `printBackground: true` when borders/dividers matter.** Default is `false` — backgrounds and `border-color` on chrome elements may be dropped. The print stylesheet uses borders for the H2 hairline (`border-bottom: 0.5pt solid #999`) — these will render even without `printBackground` because borders are foreground, but any `background-color` (e.g., on highlighted lines) WILL be dropped.
- **`@page` margin in script + `@page` margin in CSS.** Conflict — script wins unless `preferCSSPageSize: true`. Pick ONE source. Recommendation: CSS, because the print stylesheet is the readable contract.
- **Spawning `next start` with `shell: true`.** Allows shell interpolation of env vars; opens injection surface. Use `spawn(cmd, args, opts)` with an array of args, no shell.
- **Random/zero port for the server.** Asking the OS to pick a port (`-p 0`) means parsing stdout to learn the chosen port. Deterministic port is simpler and more debuggable.
- **`localhost` instead of `127.0.0.1`.** macOS `localhost` may resolve `::1` first; Next.js sometimes only binds IPv4. Use the loopback literal.
- **Skipping the SIGTERM cleanup.** If the script throws and the server isn't killed, the next run hits an "EADDRINUSE: address already in use 127.0.0.1:3057" error.
- **Importing `resume.css` from `globals.css` via `@import`.** Bypasses Next.js's CSS chunking and loads the print rules on every page. Always import via the layout's TS file.
- **Reusing `<TagChipRow>` for the project pill row.** Different semantics (links to slugs, not tags). Same Pitfall 3 trap as Phase 4's CardMeta-vs-ProjectMeta separation. Hand-author `<ProjectPillRow>` against the same chip visual class string but with `href="/projects/${slug}"`.
- **Embedding the bio in MDX.** No reason — `/about` is a few hundred words of static prose. MDX adds build overhead and competes with `lib/content.ts`'s project pipeline for no win.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Wait for HTTP server to become ready | Custom `fetch` polling loop | `wait-on@9.0.10` | wait-on handles connection-refused, timeouts, intervals, retries, and supports HTTP, TCP, and file resources uniformly. 5 transitive deps, mature since 2015. |
| Parse a docx file at build time | Custom `unzip` + XML parsing of `word/document.xml` | **Manual one-time read** by executor; hand-code `content/resume.ts` | The docx is read ONCE by Olive/executor and converted to typed TS. Auto-parsing creates a moving target — if Olive edits the docx, runs differ. Hand-coding makes the resume's content a code artifact with git history. The data is already extracted in § Resume Data — Pre-Extracted below; executor copies values verbatim. |
| Render React components to PDF | `@react-pdf/renderer` | `puppeteer.page.pdf()` from the actual `/resume` route | Maintains a single source of truth: same React tree renders the HTML page and the PDF. `@react-pdf/renderer` requires a parallel component tree (its own primitives — `<Text>`, `<View>`, `<Document>`) that can't reuse the Tailwind/CSS the HTML page uses. |
| Validate the resume object shape | Hand-written runtime type checks | `zod` (already a dependency) | Existing pattern from `ProjectFrontmatterSchema`. `z.infer` gives the executor the static type for free. Build fails loudly on shape violations. |
| Spawn `next start` and detect ready | Hand-rolled child_process stdout scraping | `spawn` + `wait-on` HTTP probe | Stdout-scraping fails when Next.js's ready message changes (it changed twice between Next 13 and Next 16). HTTP probe is durable. |
| Generate URL-encoded mailto subject | Hand-pasted `%20` | `encodeURIComponent("hi from olivelliott.dev")` → `"hi%20from%20olivelliott.dev"` | Defensible against future copy changes. But for ONE locked string, hard-coding `%20` (as UI-SPEC already does) is fine — Pitfall 5 covers the `+` vs `%20` distinction. |

**Key insight:** Phase 5's "build something custom" temptations are mostly around the PDF pipeline. Every one of them has a battle-tested 2026 library with the right defaults. The hand-rolled path costs hours and lands bugs that established libraries already fixed years ago.

## Runtime State Inventory

> Phase 5 is greenfield content creation, not a refactor. Skipping detailed Runtime State Inventory per the conditional in the template.

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None — Phase 5 ships zero datastores. | None. |
| Live service config | None — Phase 5 ships zero external services. | None. |
| OS-registered state | None — no Task Scheduler / launchd / pm2 work. | None. |
| Secrets/env vars | None — `mailto:` is public, GitHub/LinkedIn URLs are public. | None. |
| Build artifacts | **`/public/resume.pdf` is a NEW build artifact** committed to git. Wave 0 ships a stub; Wave 3 overwrites with the real PDF. | Commit the real PDF after first successful postbuild run. Confirm `.gitignore` does NOT exclude `*.pdf` or `public/resume.pdf`. |

**The one footer state issue:** `components/site/footer.tsx` has Phase 1 placeholder URLs (`github.com/ophelia-x` × 2 + mailto subject `olivelliott.dev`). These are code (already in git), but the planner should treat the Phase 1 placeholders as **stale runtime state in source code** that Phase 5 corrects in a single commit. No external system has cached these URLs (no analytics tracking on them, no email auto-replies keyed on the subject string).

## Environment Availability

Phase 5 adds new dependencies. Audit:

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | All scripts + Next.js build | ✓ | per `package.json` engines `>=20.18.0` | — |
| pnpm | postbuild hook | ✓ | per `package.json` packageManager `pnpm@9.15.9` | — |
| `puppeteer@25.0.2` | RES-04 PDF script | ✗ (must install) | — | If install fails (Chromium download blocked), use `puppeteer-core` + system Chrome via `PUPPETEER_EXECUTABLE_PATH` env var |
| Headless Chrome | Puppeteer | ✓ via `puppeteer` auto-download into `~/.cache/puppeteer` | Chrome for Testing (~170–282MB) | If corporate firewall blocks download: `PUPPETEER_SKIP_DOWNLOAD=true pnpm add -D puppeteer-core`, manually install Chrome, set `PUPPETEER_EXECUTABLE_PATH` |
| `wait-on@9.0.10` | server-ready detection | ✗ (must install) | — | Could hand-roll a fetch poll loop, but adds maintenance debt |
| `Olive_Elliott_Resume.docx` | content extraction source | ✓ | repo root | None — data already pre-extracted in this RESEARCH.md § Resume Data — Pre-Extracted, executor copies verbatim |
| Free port 3057 | next start instance | Probable ✓ | — | Change PORT constant; deterministic ports preferred over `0` (OS-picked) for debuggability |
| TypeScript runtime for scripts/ | `tsx scripts/build-resume-pdf.ts` | ✓ if `tsx` resolves via `typescript` | — | Add `tsx@^4` to devDependencies if `pnpm tsx` fails to resolve |

**Missing dependencies with no fallback:** None.

**Missing dependencies with fallback:** None blocking — `puppeteer`'s Chrome download could be blocked in some CI environments; the fallback (system Chrome via env var) is well-documented.

## Common Pitfalls

### Pitfall 1: `app/resume/page.tsx` accidentally inside `(site)/`

**What goes wrong:** Executor creates `app/(site)/resume/page.tsx` instead of `app/resume/page.tsx`. The resume now inherits `<Nav>`, `<Footer>`, `<MotionProvider>`, `<SkipLink>` — defeating the print/PDF chrome opt-out.

**Why it happens:** Cargo-cult — every other page in the project lives in `(site)/`. The opt-out is the exception, easy to miss.

**How to avoid:**
- Plan step explicitly says "create `app/resume/page.tsx` — NOT inside `(site)/`."
- Test asserts `app/resume/page.tsx` exists and `app/(site)/resume/page.tsx` does NOT exist.
- Test renders `<ResumePage>` and asserts NO `<Nav>` / `<Footer>` / `<SkipLink>` from the site shell appear in the output.

**Warning signs:** `/resume` shows the site nav in the browser; PDF includes the footer.

### Pitfall 2: `printBackground: false` (default) silently drops colors

**What goes wrong:** PDF is generated, looks correct in browser print preview, but printed output is missing background colors and (sometimes) border colors. The H2 hairline (`border-bottom: 0.5pt solid #999`) may render fine because borders are foreground, but any conditional `background-color` won't.

**Why it happens:** `page.pdf()` default for `printBackground` is `false` per Puppeteer 25 docs.

**How to avoid:** Always pass `printBackground: true` when calling `page.pdf()`. Phase 5 should also use `-webkit-print-color-adjust: exact; print-color-adjust: exact` in the CSS (UI-SPEC already specifies this).

**Warning signs:** Generated PDF is paper-white but visual elements that should appear in subtle gray/tone are missing.

### Pitfall 3: `@page` margin in CSS conflicts with `margin` in PDF options

**What goes wrong:** Script passes `margin: { top: '0.5in', ... }` to `page.pdf()` AND `resume.css` declares `@page { margin: 0.5in }`. Puppeteer issues #437, #6657 document inconsistent behavior — sometimes script wins, sometimes CSS wins, sometimes the first page has different margins than subsequent pages.

**How to avoid:** Pick ONE. Recommendation: `@page` in CSS + `preferCSSPageSize: true` in script. Omit `margin` from script entirely. The print stylesheet is the readable contract.

**Warning signs:** PDF margins don't match the print preview from Cmd+P in the browser.

### Pitfall 4: Orphan `next start` process after script failure

**What goes wrong:** Script throws between `spawn(next start)` and `server.kill('SIGTERM')`. The server keeps running, holds port 3057. Next `pnpm build` fails with `EADDRINUSE`.

**How to avoid:** `process.once('exit', shutdown)` + `process.once('SIGINT', shutdown)` + `process.once('SIGTERM', shutdown)`. Wrap server lifecycle in try/finally so kill happens regardless.

**Warning signs:** `EADDRINUSE 127.0.0.1:3057` on second consecutive `pnpm build`.

**Manual recovery:** `lsof -ti:3057 | xargs kill -9`.

### Pitfall 5: `mailto:` subject encoded with `+` instead of `%20`

**What goes wrong:** Some email clients (especially mobile Outlook, some webmail) interpret `+` literally in the subject string. User opens mailto link and sees "hi+from+olivelliott.dev" instead of "hi from olivelliott.dev".

**Why it happens:** PHP `urlencode()`, certain framework helpers, and confusion between `application/x-www-form-urlencoded` (where `+` = space) and RFC 6068 mailto URIs (where `+` is literal `+`, spaces MUST be `%20`).

**How to avoid:** Always use `%20` in mailto subjects (UI-SPEC already does). If generating programmatically, use `encodeURIComponent`, not `encodeURI` + replace.

**Warning signs:** Bug report from a recruiter: "your email link puts plus-signs in the subject."

### Pitfall 6: `puppeteer` Chrome download blocked by network policy

**What goes wrong:** `pnpm add -D puppeteer` triggers a postinstall script that downloads Chrome for Testing (~170–282MB). In some corporate networks / restrictive CI environments, this download is blocked. Install completes but Puppeteer throws "Could not find Chrome" at runtime.

**How to avoid:** For local dev: a one-time `pnpm add -D puppeteer` from any unrestricted network works. For CI: prefer the `puppeteer-core` + system Chrome path (set `PUPPETEER_EXECUTABLE_PATH=/path/to/chrome` and `PUPPETEER_SKIP_DOWNLOAD=true`).

**Phase 5 specifics:** Since the PDF is committed to git, CI never runs the script — only the developer machine does. If Olive's machine can download Chrome (which it can, given the macOS dev environment), no fallback needed.

### Pitfall 7: Footer is RSC — no client-side state in `<DownloadPdfLink>`

**What goes wrong:** Executor adds `'use client'` to `<DownloadPdfLink>` because "the download might need motion" (it doesn't — UI-SPEC bans new motion islands in Phase 5). Footer becomes a client subtree, increasing JS bundle on every page.

**How to avoid:** `<DownloadPdfLink>` is RSC. Pure anchor with `download` attribute. Zero client behavior. Anti-pattern test asserts no `'use client'` directive in `components/resume/download-pdf-link.tsx`.

**Warning signs:** `pnpm build` shows /resume bundle size increasing; Lighthouse JS budget creeping up on /about (which inherits the footer).

### Pitfall 8: Next.js CSS-modules-on-layout caching cross-route leakage

**What goes wrong:** Next.js 16 docs explicitly warn: "this currently does not remove stylesheets as you navigate between routes." If `resume.css` declares any `html { ... }` or `body { ... }` rules outside `@media print`, those rules persist after navigating to `/about`.

**How to avoid:** Every screen-mode rule in `resume.css` MUST be scoped via a class (`.resume`, `.resume-header`, etc.). Only `@media print` rules may target `html`, `body`, etc. — because those only activate during print.

**Warning signs:** Visiting `/resume` then `/about` shows the resume styles applied to the about page until a full reload.

### Pitfall 9: Banned-words anti-pattern test misses Phase 5 sources

**What goes wrong:** Phase 4's `tests/home/anti-patterns.test.ts` has a hard-coded `PHASE4_SOURCES` array listing 11 files. Phase 5 adds 13 new source files (3 about components, 4 resume components, page routes, layouts, schemas, content) — none are scanned by the existing manifest. A banned word ("passionate", etc.) could land in `content/resume.ts` undetected.

**How to avoid:** Two options:

1. **Extend `tests/home/anti-patterns.test.ts`** — add Phase 5 sources to `PHASE4_SOURCES` (and rename the constant to `PHASE_SOURCES`).
2. **Fork to `tests/about/anti-patterns.test.ts`** — duplicate the readAll() helper + test structure, separate manifest.

CONTEXT.md § Specific Ideas says: "extend the existing manifest per STATE.md guidance: `tests/about/anti-patterns.test.ts` if the manifest gets unwieldy; otherwise extend `tests/home/anti-patterns.test.ts`."

**Recommendation:** Extend (option 1). 11 → 24 files is not unwieldy. Single regression net easier to maintain than two divergent forks. Rename constant `PHASE4_SOURCES` → `PHASE_SOURCES` to reflect cross-phase scope; rename file to keep `tests/home/anti-patterns.test.ts` for historical continuity (the test asserts cross-phase invariants, the location is incidental).

**Warning signs:** New Phase 5 source files exist in repo but aren't in `PHASE_SOURCES` manifest. `readAll()` existsSync check passes (it only verifies listed files exist), so the gap is invisible without manually checking the manifest length.

### Pitfall 10: Skip-link target id collision between site shell and /resume

**What goes wrong:** Both site shell `<SkipLink>` (`href="#main"`) and the in-page `/resume` skip link could naively use `href="#main"`. Site nav doesn't render on /resume, so the site-shell skip link doesn't exist there — but if executor copy-pastes the SkipLink JSX, they get `#main` which doesn't exist in the resume tree.

**How to avoid:** UI-SPEC § Skip-link on /resume locks the target: `<a href="#resume-main">Skip to resume</a>` + `<main id="resume-main">`. The id `resume-main` is intentionally distinct from `main`. Test asserts `<main id="resume-main">` exists on `/resume` and the skip link's href matches.

**Warning signs:** Keyboard test on `/resume`: tab → focus skip-link → enter → focus doesn't move (link target doesn't exist).

### Pitfall 11: `puppeteer` (full) vs `puppeteer-core` mismatch with `executablePath`

**What goes wrong:** Executor follows CONTEXT.md and installs `puppeteer-core`, then writes `puppeteer.launch({ headless: true })` without setting `executablePath`. `puppeteer-core` has no bundled Chrome — `launch()` throws "Could not find browser revision".

**How to avoid:** If using `puppeteer-core`, the script MUST resolve `executablePath`:

```ts
import puppeteer from 'puppeteer-core'
import chromium from '@sparticuz/chromium-min'

const browser = await puppeteer.launch({
  args: chromium.args,
  executablePath: await chromium.executablePath(BROTLI_BINARY_URL),    // requires hosted Brotli URL
  headless: true,
})
```

The `BROTLI_BINARY_URL` is a public URL hosting the Brotli-compressed Chromium binary (Sparticuz provides default URLs in their releases). This is an extra dependency on a third-party hosting URL.

**Recommendation:** Avoid the trap entirely by using full `puppeteer` (which auto-downloads) — see Open Question 1.

### Pitfall 12: `content/resume.ts` not exported from a typed source

**What goes wrong:** Executor writes `export const RESUME = { ... }` without conforming to `ResumeSchema`. Schema drift between the type the components consume and the actual data passes typecheck (because TS infers from the object literal) but fails at runtime parse.

**How to avoid:** Use the schema as the source of truth:

```ts
// content/resume.ts
import { type Resume, ResumeSchema } from '@/lib/schemas'

const data = { ... } satisfies Resume                                  // ← static check
export const RESUME: Resume = ResumeSchema.parse(data)                 // ← runtime check at module load
```

`satisfies` keeps the object literal's narrow types while asserting it matches `Resume`. `ResumeSchema.parse()` throws at module load if the data is malformed — build fails loudly.

**Warning signs:** Runtime error on first visit to `/resume` instead of build error.

### Pitfall 13: Wave 0 missing `/public/resume.pdf` stub causes 404s in Wave 1–2

**What goes wrong:** Wave 1 ships `<DownloadPdfLink href="/resume.pdf" download>`. Visiting `/resume` and clicking the link 404s because the PDF doesn't exist yet (the postbuild script doesn't run until Wave 3 is wired). Tests asserting "link works" fail.

**How to avoid:** Wave 0 ships a 1-byte stub at `/public/resume.pdf` so the route exists. Real content arrives in Wave 3 when postbuild runs. Stub can be a literal `%PDF-1.7\n%%EOF\n` (valid empty PDF, ~16 bytes).

**Warning signs:** 404 on `/resume.pdf` in dev mode after Wave 1.

## Code Examples

### Example 1: `lib/schemas.ts` — Add `ResumeSchema`

```ts
// Source: lib/schemas.ts (existing) + Zod 3 docs + .docx-extracted shape
// Append to existing file alongside ProjectFrontmatterSchema.

const ResumeHeaderSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),                                             // full role line — accepts " · " separators inline
  location: z.string().min(1),                                         // "Asheville, NC  ·  919-917-4777"
  links: z.object({
    github: z.string().url(),
    email: z.string().email(),
    linkedin: z.string().url(),                                        // may be a PLACEHOLDER URL in v1
  }),
})

const ResumeExperienceSchema = z.object({
  role: z.string().min(1),                                             // "Software Engineer / System Architect / Project Lead"
  company: z.string().min(1),
  location: z.string().optional(),                                     // optional — Aktiga entry has no location in docx
  period: z.string().min(1),                                           // "2023 – Present"
  bullets: z.array(z.string().min(1)).min(1).max(6),
})

const ResumeProjectSchema = z.object({
  name: z.string().min(1),
  tagline: z.string().optional(),                                      // "Persistent Cognitive Layer for AI Agents"
  link: z.string().url().optional(),                                   // repo URL; absent for private projects
  period: z.string().min(1),
  bullets: z.array(z.string().min(1)).min(1).max(6),
})

const ResumeEducationSchema = z.object({
  degree: z.string().min(1),
  institution: z.string().min(1),
  year: z.string().min(1),                                             // "September 2022" / "June 2019"
  location: z.string().optional(),
  bullets: z.array(z.string()).max(4).default([]),                     // honors + minors etc.
})

const ResumeSkillsCategorySchema = z.object({
  category: z.string().min(1),                                         // "Languages", "Frameworks & Libraries", etc.
  items: z.array(z.string().min(1)).min(1),
})

export const ResumeSchema = z.object({
  header: ResumeHeaderSchema,
  summary: z.string().min(1),                                          // single paragraph
  experience: z.array(ResumeExperienceSchema).min(1),
  projects: z.array(ResumeProjectSchema).min(1),
  skills: z.array(ResumeSkillsCategorySchema).min(1),
  education: z.array(ResumeEducationSchema).min(1),
})

export type Resume = z.infer<typeof ResumeSchema>
```

**Note on section order** in the schema vs page composition: schema permits `experience / projects / skills / education` in any object-property order — JavaScript objects don't guarantee key order at the type level, but in practice V8 preserves insertion order for string keys. Page composition (UI-SPEC § /resume document outline) renders the sections in the locked order `summary → experience → projects → skills → education`. Don't conflate the two: schema is shape, page is layout.

### Example 2: `app/resume/layout.tsx` — Chromeless Layout

```tsx
// Source: Next.js 16.2.6 docs § route groups + § CSS imports
import './resume.css'

export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
```

The fragment is intentional. No chrome. The root `app/layout.tsx` already supplies `<html>`, `<body>`, font variables, and `globals.css`. This layout's only job is to import `resume.css` so its rules load when (and only when) `/resume*` routes render.

### Example 3: `app/resume/page.tsx` — Resume RSC

```tsx
// Source: UI-SPEC § /resume document outline + Phase 4 metadata precedent
import type { Metadata } from 'next'
import { RESUME } from '@/content/resume'
import { DownloadPdfLink } from '@/components/resume/download-pdf-link'
import { ResumeHeader } from '@/components/resume/resume-header'
import { ResumeSection } from '@/components/resume/resume-section'
import { ResumeEntry } from '@/components/resume/resume-entry'

export const metadata: Metadata = {
  title: 'resume',
  description: 'Resume for Olive Elliott — engineer focused on autonomous workflows, local-first systems, and open-source tooling. Available as PDF download.',
  alternates: { canonical: '/resume' },
  openGraph: {
    title: 'resume · olivelliott.dev',
    description: 'Resume for Olive Elliott — engineer focused on autonomous workflows, local-first systems, and open-source tooling.',
    url: '/resume',
    type: 'profile',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'olivelliott.dev — resume' }],
  },
  twitter: { card: 'summary_large_image', images: ['/og-default.png'] },
}

export default function ResumePage() {
  return (
    <>
      <a
        href="#resume-main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-2 focus:bg-white focus:text-black focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-black"
      >
        Skip to resume
      </a>
      <main id="resume-main">
        <article className="resume">
          <ResumeHeader header={RESUME.header} />

          <ResumeSection id="summary-h2" label="summary" hideHeading>
            <p className="body text-secondary max-w-prose">{RESUME.summary}</p>
          </ResumeSection>

          <hr className="hairline" />

          <ResumeSection id="experience-h2" label="experience">
            {RESUME.experience.map((entry) => (
              <ResumeEntry
                key={`${entry.company}-${entry.period}`}
                title={entry.role}
                meta={`${entry.company} · ${entry.period}`}
                bullets={entry.bullets}
              />
            ))}
          </ResumeSection>

          <hr className="hairline" />

          <ResumeSection id="projects-h2" label="projects">
            {RESUME.projects.map((p) => (
              <ResumeEntry
                key={p.name}
                title={p.name}
                meta={p.tagline ? `${p.tagline} · ${p.period}` : p.period}
                bullets={p.bullets}
                link={p.link ? { href: p.link, label: p.link.replace(/^https?:\/\//, '') } : undefined}
              />
            ))}
          </ResumeSection>

          <hr className="hairline" />

          <ResumeSection id="skills-h2" label="skills">
            <dl className="resume-skills">
              {RESUME.skills.map((s) => (
                <div key={s.category} className="contents">
                  <dt>{s.category}</dt>
                  <dd>{s.items.join(', ')}</dd>
                </div>
              ))}
            </dl>
          </ResumeSection>

          <hr className="hairline" />

          <ResumeSection id="education-h2" label="education">
            {RESUME.education.map((e) => (
              <ResumeEntry
                key={`${e.institution}-${e.year}`}
                title={e.degree}
                meta={`${e.institution} · ${e.year}`}
                bullets={e.bullets}
              />
            ))}
          </ResumeSection>
        </article>
      </main>
    </>
  )
}
```

### Example 4: `components/site/footer.tsx` — Three-Line Edit

```diff
-const GITHUB_URL = 'https://github.com/ophelia-x'
-const EMAIL_URL = 'mailto:olivelliott48@gmail.com?subject=olivelliott.dev'
+const GITHUB_URL = 'https://github.com/olivelliott'
+const EMAIL_URL = 'mailto:olivelliott48@gmail.com?subject=hi%20from%20olivelliott.dev'
 const LINKEDIN_URL = 'https://linkedin.com/in/olive-elliott'           // verify with Olive — PLACEHOLDER?
-const VIEW_SOURCE_URL = 'https://github.com/ophelia-x/portfolio'
+const VIEW_SOURCE_URL = 'https://github.com/olivelliott/portfolio'
```

And insert `<DownloadPdfLink>` + interpunct into the right slot:

```diff
   <div className="flex items-center gap-4 sm:gap-6">
     <ul className="flex items-center gap-2">
       {/* ...existing icon links unchanged... */}
     </ul>
+    <DownloadPdfLink />
+    <span aria-hidden="true" className="text-[color:var(--color-text-tertiary)]">·</span>
     <a
       href={VIEW_SOURCE_URL}
```

### Example 5: `tests/resume/pdf-build.test.ts` — Structural Test (No Puppeteer Execution)

```ts
// Source: Phase 4 anti-pattern source-grep precedent (tests/home/anti-patterns.test.ts)
// Asserts the build script exists and has the right shape, WITHOUT running Puppeteer.
// The artifact-existence test (pdf-artifact.test.ts) is a separate file that runs
// only in CI / after `pnpm postbuild` has run.
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

describe('Phase 5: scripts/build-resume-pdf.ts structural contract', () => {
  const scriptPath = path.resolve('scripts/build-resume-pdf.ts')

  it('exists', () => {
    expect(existsSync(scriptPath), 'scripts/build-resume-pdf.ts missing').toBe(true)
  })

  it('imports puppeteer + wait-on (does not hand-roll either)', () => {
    const src = readFileSync(scriptPath, 'utf8')
    expect(/from\s+['"]puppeteer['"]/.test(src), 'must import puppeteer').toBe(true)
    expect(/from\s+['"]wait-on['"]/.test(src), 'must import wait-on').toBe(true)
  })

  it('emulates print media + uses preferCSSPageSize (Pitfall 3)', () => {
    const src = readFileSync(scriptPath, 'utf8')
    expect(/emulateMediaType\(\s*['"]print['"]\s*\)/.test(src)).toBe(true)
    expect(/preferCSSPageSize:\s*true/.test(src)).toBe(true)
    expect(/printBackground:\s*true/.test(src)).toBe(true)
  })

  it('writes to public/resume.pdf', () => {
    const src = readFileSync(scriptPath, 'utf8')
    expect(/['"]resume\.pdf['"]/.test(src)).toBe(true)
    expect(/['"]public['"]/.test(src)).toBe(true)
  })

  it('handles process cleanup (Pitfall 4)', () => {
    const src = readFileSync(scriptPath, 'utf8')
    expect(/process\.once\(\s*['"]exit['"]/.test(src), 'must register exit handler to kill server').toBe(true)
    expect(/server\.kill\(/.test(src), 'must call server.kill()').toBe(true)
  })
})
```

### Example 6: `tests/resume/pdf-artifact.test.ts` — Magic Bytes + Size

```ts
// Source: CONTEXT.md § PDF parity verification + pdf-parse magic bytes pattern
// Runs in CI after pnpm postbuild. Skips in dev unless RESUME_PDF_CHECK=1.
import { existsSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const PDF_PATH = path.resolve('public/resume.pdf')
const shouldRun = process.env.CI === 'true' || process.env.RESUME_PDF_CHECK === '1'

describe.skipIf(!shouldRun)('Phase 5: /public/resume.pdf artifact contract', () => {
  it('exists', () => {
    expect(existsSync(PDF_PATH), 'public/resume.pdf not generated — run pnpm postbuild').toBe(true)
  })

  it('starts with %PDF- magic bytes', () => {
    const buf = readFileSync(PDF_PATH, { encoding: null })
    const head = buf.slice(0, 5).toString('ascii')
    expect(head, `PDF magic bytes missing: got "${head}"`).toBe('%PDF-')
  })

  it('size is between 20KB and 400KB (rejects empty stub or bloated output)', () => {
    const { size } = statSync(PDF_PATH)
    expect(size, `unexpected size: ${size} bytes`).toBeGreaterThanOrEqual(20_000)
    expect(size).toBeLessThanOrEqual(400_000)
  })
})
```

(The Wave 0 stub is ~16 bytes; the test runs only when `RESUME_PDF_CHECK=1` or `CI=true`, so the stub doesn't fail Wave 0 tests.)

## Resume Data — Pre-Extracted from Olive_Elliott_Resume.docx

The executor does NOT need to re-parse the docx. Below is the verbatim extraction (executor copies to `content/resume.ts`). The PROFILE summary is rewritten to strip the banned word "Passionate" per UI-SPEC § Copywriting Contract.

```ts
// content/resume.ts — extracted from Olive_Elliott_Resume.docx (verified 2026-05-17)
import { type Resume, ResumeSchema } from '@/lib/schemas'

const data = {
  header: {
    name: 'Olive Elliott',
    role: 'Software Engineer  ·  AI Workflow Architect  ·  System Architect',
    location: 'Asheville, NC  ·  919-917-4777',
    links: {
      github: 'https://github.com/olivelliott',
      email: 'olivelliott48@gmail.com',
      // PLACEHOLDER: confirm with Olive — docx says "LinkedIn" but no handle.
      linkedin: 'https://linkedin.com/in/olive-elliott',
    },
  },
  // Banned word "Passionate" rewritten to "Active in" per UI-SPEC § Copywriting Contract.
  summary:
    'Software engineer with 3+ years of experience designing and shipping scalable, local-first products. Focused on autonomous workflows, decentralized networks, and AI-driven systems that give people freedom to pursue what matters most. Active in open-source contribution, knowledge-graph architectures, and tools that support distributed communities. Brings a polymath perspective rooted in anthropology, sustainability, and creative problem solving.',
  experience: [
    {
      role: 'Software Engineer / System Architect / Project Lead',
      company: 'Aktiga',
      period: '2023 – Present',
      bullets: [
        'Lead system architecture and AI workflow design for internal tooling and developer platforms',
        'Authored and maintained developer documentation using Starlight (Astro), improving onboarding and cross-team alignment',
        'Serve as project lead coordinating engineering priorities, sprint planning, and delivery milestones',
        'Design autonomous workflow pipelines integrating AI agents to reduce manual overhead across product operations',
      ],
    },
    {
      role: 'Operations Manager',
      company: 'The Care Collective',
      period: 'Feb 2021 – 2023',
      bullets: [
        'Oversaw client-facing and business operations for a 19-person company including wholesale, scheduling, inventory, sales, marketing, and client relations',
        'Joined during an unprecedented growth phase and expanded responsibilities to match evolving business demands',
        'Recognized as an integral contributor to visionary business strategy while managing day-to-day execution',
      ],
    },
  ],
  projects: [
    {
      name: 'Myco',
      tagline: 'Persistent Cognitive Layer for AI Agents',
      link: 'https://github.com/olivelliott/myco',
      period: '2024 – Present',
      bullets: [
        'Designed a local-first agent memory system modeled on mycorrhizal networks, enabling persistent context across AI sessions',
        'Implemented knowledge-graph architecture (Node + SQLite + Ollama) for semantic memory retrieval without cloud dependency',
        'Released as open-source under Apache 2.0 to support the broader autonomous-agent ecosystem',
      ],
    },
    {
      name: 'Fathom',
      tagline: 'Headless AI Dev-Cost Intelligence',
      // PLACEHOLDER: confirm Fathom repo URL with Olive (public per STATE.md but URL not in docx).
      period: '2025 – Present',
      bullets: [
        'Built a headless CLI and MCP server that tracks and analyzes AI development costs across LLM providers in real time',
        'Architected a pluggable store and provider system, allowing teams to swap backends and models without code changes',
        'Shipped as a Claude Code plugin, integrating cost intelligence directly into developer workflows',
      ],
    },
    {
      name: 'Agenda Keeper',
      tagline: 'Meeting-Management SaaS',
      // private — no link rendered
      period: '2024 – Present',
      bullets: [
        'Developed a full-stack meeting management platform with real-time collaborative editing via TipTap/ProseMirror',
        'Integrated OAuth-based calendar sync to unify scheduling across Google Calendar and Outlook',
        'Built on Convex for reactive, real-time data with zero-config backend infrastructure',
      ],
    },
    {
      name: 'Trade Bot',
      tagline: 'Autonomous Trading System',
      // private
      period: '2025',
      bullets: [
        'Engineered an autonomous trading system shipping 4 milestones in ~5 days, from strategy design to paper-trading',
        'Implemented crypto intraday trading with strategy diversification, entirely local-first (SQLite + Ollama, no cloud)',
      ],
    },
    {
      name: 'Stemz',
      tagline: 'Custom E-Commerce Platform for Music Discovery',
      // PLACEHOLDER: confirm Stemz live URL with Olive (docx doesn't include one).
      period: '2023',
      bullets: [
        'Developed a complex custom WordPress platform for Aktiga, transforming design into a fully functional e-commerce site with two types of custom ordering systems',
        'Engineered the backend using SQL and PHP, integrating WooCommerce for product management and transactions',
        'Optimized performance, enhanced user experience, and ensured scalability for future growth',
      ],
    },
  ],
  skills: [
    {
      category: 'Languages',
      items: ['TypeScript', 'JavaScript', 'Python', 'SQL', 'HTML5', 'CSS'],
    },
    {
      category: 'Frameworks & Libraries',
      items: ['Next.js', 'React', 'Node.js', 'Express', 'Convex', 'Astro', 'TipTap/ProseMirror', 'Tailwind CSS', 'WordPress'],
    },
    {
      category: 'AI & Autonomous Systems',
      items: ['Ollama', 'Claude / MCP', 'Knowledge Graphs', 'Agent Memory Architecture', 'Autonomous Workflows'],
    },
    {
      category: 'Data & Infrastructure',
      items: ['SQLite', 'MongoDB', 'MySQL', 'PostgreSQL', 'REST APIs', 'Git/GitHub', 'Vercel'],
    },
    {
      category: 'Focus Areas',
      items: ['Decentralized Networks', 'Local-First / P2P Systems', 'Open-Source Development', 'AI Architecture'],
    },
  ],
  education: [
    {
      degree: 'Full Stack Web Development Certificate',
      institution: 'UNC Chapel Hill Coding Bootcamp',
      year: 'September 2022',
      bullets: ['6-month intensive, 450+ hours of full stack web development'],
    },
    {
      degree: 'Bachelor of Science, Cum Laude — Cultural Anthropology',
      institution: 'Appalachian State University',
      year: 'June 2019',
      bullets: [
        'Minor in Spanish',
        'Minor in Sustainable Development',
        'Senior Honors Award for Applied Anthropology',
      ],
    },
  ],
  // PLACEHOLDER: events & services entries from .docx (Mast Farm Inn 2018, Melanie's 2015–2019)
  // omitted — confirm with Olive whether to surface for hiring-manager audience or drop for
  // engineer-positioned distribution.
} satisfies Resume

export const RESUME: Resume = ResumeSchema.parse(data)
```

## State of the Art

| Old Approach | Current Approach (2026) | When Changed | Impact |
|--------------|--------------------------|--------------|--------|
| Maintain HTML + PDF in parallel templates | Render PDF from same React tree via Puppeteer print emulation | ~2020 | Single source of truth, zero drift between web and PDF |
| `puppeteer` with manual Chrome download | `puppeteer@25` auto-downloads Chrome for Testing to `~/.cache/puppeteer` | Puppeteer 22+ (mid-2024) | One-line install for local dev |
| `puppeteer-core` + `chrome-aws-lambda` | `puppeteer-core` + `@sparticuz/chromium-min` | mid-2022 | `chrome-aws-lambda` was abandoned; Sparticuz forked and continues maintenance |
| Random ephemeral port for next start | Deterministic low-collision port (e.g. 3057) | always | Avoids macOS firewall prompts; debuggable |
| `localhost` in scripts | `127.0.0.1` literal | always | Avoids IPv6 resolution drift |
| `wait-on` via CLI | `wait-on` programmatic Node API | wait-on 6+ | Cleaner error handling in build scripts |
| `next start` ready detection via stdout scrape | wait-on HTTP probe | always preferable | Survives Next.js ready-message changes |

**Deprecated/outdated:**
- `chrome-aws-lambda`: abandoned, do not use. Sparticuz fork is the maintained successor.
- `puppeteer-core` for non-serverless: works but adds complexity (need to manage Chrome installation). Full `puppeteer` is simpler for build scripts.
- `@react-pdf/renderer` for HTML-mirror PDFs: works but maintains a parallel React tree; rejected in this project per STATE.md.

## Open Questions

### 1. **`puppeteer` (full) vs `puppeteer-core` + `@sparticuz/chromium-min` — researcher recommends overriding CONTEXT's locked decision**

- **What we know:**
  - CONTEXT.md § PDF Generation Pipeline locks `puppeteer-core` + `@sparticuz/chromium-min`.
  - Per Puppeteer docs (pptr.dev/guides/installation) and the Sparticuz repo README (`github.com/Sparticuz/chromium`), `chromium-min` is designed for serverless deployments where the 250MB Lambda limit forces a slim binary. For **local-only build-time use**, the full `puppeteer` package (auto-downloads Chrome to `~/.cache/puppeteer`) is "more reliable in your server environment" (per educative.io comparison).
  - The PDF is committed to git (CONTEXT decision), so production Vercel builds NEVER run Puppeteer. The only environments running the script are: (a) Olive's laptop, (b) optionally a CI runner. Neither has size constraints.
  - `chromium-min` requires an externally hosted Brotli binary URL — extra third-party dependency vs `puppeteer`'s self-hosting cache.
- **What's unclear:** Whether CONTEXT.md chose `chromium-min` deliberately (e.g., to keep the install footprint small in CI cache) or as a defensive default. The researcher's recommendation reflects the simpler architecture; the planner should confirm.
- **Recommendation:** Flag this as a planner decision in Wave 0. Default to full `puppeteer@25.0.2` unless the planner has a documented reason to prefer the heavier chromium-min path (e.g., expectation that the script may later run in a 250MB-limited environment). If overriding CONTEXT, log the decision in the plan's "Deviations from CONTEXT.md" section so it propagates back to STATE.md.

### 2. **LinkedIn handle**

- **What we know:** UI-SPEC + .docx both leave LinkedIn handle as PLACEHOLDER. Current footer code uses `https://linkedin.com/in/olive-elliott` (Phase 1 placeholder).
- **What's unclear:** Whether `olive-elliott` is correct, or another handle (e.g., `olivelliott`, `oliviaelliott`).
- **Recommendation:** Plan adds an explicit "ASK OLIVE" step at Wave 3 human-verify gate. If unresolved, keep `olive-elliott` with a `// PLACEHOLDER: confirm with Olive — Phase 1 placeholder` comment in both `content/resume.ts` and `components/site/footer.tsx`. Do not block the wave on it.

### 3. **Fathom + Stemz public links**

- **What we know:** docx doesn't include URLs for Fathom or Stemz. STATE.md says Fathom is public TypeScript; Stemz is "local WordPress" (probably no public URL).
- **What's unclear:** Whether Fathom has a public GitHub URL (likely `github.com/olivelliott/fathom`?) and whether Stemz has a live URL worth linking.
- **Recommendation:** Mark both as `// PLACEHOLDER` in `content/resume.ts`. Render entries without `link` — they appear in the projects section with bullets only. Phase 7 content pass fills.

### 4. **Wave 0 stub PDF — commit or generate per-build?**

- **What we know:** CONTEXT.md leaves stub as Claude's discretion. The stub exists only to prevent `/resume.pdf` from 404'ing before Wave 3 lands the real pipeline.
- **What's unclear:** Whether stub is a literal `%PDF-1.7\n%%EOF\n` byte sequence committed to `public/resume.pdf`, OR generated by a Wave 0 task.
- **Recommendation:** Commit a 16-byte stub. Wave 0 task: `printf '%%PDF-1.7\n%%%%EOF\n' > public/resume.pdf && git add public/resume.pdf`. Wave 3 postbuild overwrites with the real PDF on first successful run; that commit replaces the stub.

### 5. **Tests for `tsx` resolution**

- **What we know:** `pnpm postbuild` calls `tsx scripts/build-resume-pdf.ts`. `tsx` is not currently in `package.json` devDependencies.
- **What's unclear:** Whether `tsx` resolves via a transitive dependency or needs explicit install.
- **Recommendation:** Add `tsx@^4` to devDependencies in Wave 0 to guarantee resolution. Cost: one dev dep, ~2MB.

### 6. **`noindex` on /resume**

- **What we know:** Out of Phase 5 scope per UI-SPEC § /resume indexing. Phase 6 SEO audit decides.
- **Recommendation:** Phase 5 does NOT add `robots: { index: false }`. Add a code comment in `app/resume/page.tsx` metadata block: `// Phase 6 audit decision: add 'robots: { index: false }' if PDF is canonical share artifact.` Flag in Phase 5's SUMMARY → Phase 6 hand-off section.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 3 + @testing-library/react 16 + jsdom 25 (already installed) |
| Config file | `vitest.config.ts` (existing; includes `mdxShimPlugin` + `server-only` stub) |
| Quick run command | `pnpm vitest run tests/about tests/resume` |
| Full suite command | `pnpm vitest run` |
| Typecheck | `pnpm typecheck` (tsc --noEmit) |
| Build smoke | `pnpm build` (must succeed before postbuild can run) |
| PDF smoke (CI/manual) | `pnpm build` (which triggers postbuild) → assert `/public/resume.pdf` exists with `%PDF-` magic bytes |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ABT-01 | Real bio renders; banned words absent from bio | unit (RSC render) + source-grep | `pnpm vitest run tests/about/about-bio.test.tsx tests/home/anti-patterns.test.ts` | ❌ Wave 0 |
| ABT-02 | Bio names Aktiga as current role | unit (RSC render text-content) | `pnpm vitest run tests/about/about-bio.test.tsx` | ❌ Wave 0 |
| ABT-03 | ValuesList renders 3 items (polymath / autonomous workflows / open-source communities) | unit (RSC render) | `pnpm vitest run tests/about/values-list.test.tsx` | ❌ Wave 0 |
| RES-01 | `content/resume.ts` exports `RESUME` conforming to `ResumeSchema` | unit (Zod parse) | `pnpm vitest run tests/resume/schema.test.ts tests/resume/content.test.ts` | ❌ Wave 0 |
| RES-02 | `/resume` route renders sections from RESUME source | unit (RSC integration) | `pnpm vitest run tests/resume/resume-page.test.tsx` | ❌ Wave 0 |
| RES-03 | `app/resume/resume.css` contains `@media print` block + `@page` rule | source-grep (file content) | `pnpm vitest run tests/resume/print-css.test.ts` | ❌ Wave 0 |
| RES-04 | `scripts/build-resume-pdf.ts` exists, imports puppeteer + wait-on, emulates print, uses preferCSSPageSize | structural source-grep | `pnpm vitest run tests/resume/pdf-build.test.ts` | ❌ Wave 0 |
| RES-04 | `/public/resume.pdf` exists with `%PDF-` magic bytes after postbuild | artifact check (CI/skipif) | `RESUME_PDF_CHECK=1 pnpm vitest run tests/resume/pdf-artifact.test.ts` | ❌ Wave 0 |
| RES-04 | End-to-end: `pnpm build` exits 0; postbuild produces valid PDF | manual / CI smoke | `pnpm build && file public/resume.pdf` (expect "PDF document") | manual-only on dev machine; CI later |
| RES-05 | DownloadPdfLink renders with `href="/resume.pdf"` + `download` attr | unit (RSC render) | `pnpm vitest run tests/resume/download-pdf-link.test.tsx` | ❌ Wave 0 |
| RES-05 | Footer contains DownloadPdfLink | unit (footer render) | `pnpm vitest run tests/site/footer.test.tsx` (extend existing) | ❌ Wave 0 |
| RES-05 | ResumeHeader contains DownloadPdfLink (top-right) | unit (RSC render) | `pnpm vitest run tests/resume/resume-header.test.tsx` | ❌ Wave 0 |
| RES-06 | RESUME mentions Aktiga, Myco, Fathom, Agenda Keeper, Trade Bot, Stemz; no banned words | unit (content + source-grep) | `pnpm vitest run tests/resume/content.test.ts tests/home/anti-patterns.test.ts` | ❌ Wave 0 |
| CTC-01 | Footer renders working anchors for GitHub, email, LinkedIn | unit (footer render — existing test extension) | `pnpm vitest run tests/site/footer.test.tsx` | ❌ Wave 0 (or extend existing if present) |
| CTC-02 | Footer mailto URL contains `subject=hi%20from%20olivelliott.dev` | unit (source-grep on rendered href) | `pnpm vitest run tests/site/footer.test.tsx` | ❌ Wave 0 |
| CTC-03 | Contact links appear on /about (ContactStack) AND in Footer | unit (cross-route render) | `pnpm vitest run tests/about/contact-stack.test.tsx tests/site/footer.test.tsx` | ❌ Wave 0 |
| (manual) | Print preview of /resume in browser matches spec | manual-only | Cmd+P on `/resume`, visual check | manual |
| (manual) | Generated PDF opens correctly in Preview/Chrome | manual-only | `open public/resume.pdf` | manual |
| (anti-pattern net) | Phase 5 source files extended into manifest; banned words / motion / icons / nested anchors all clean | source-grep | `pnpm vitest run tests/home/anti-patterns.test.ts` | ✓ exists (Phase 4) — extend manifest in Wave 1 |

### Sampling Rate

- **Per task commit:** `pnpm vitest run tests/about tests/resume` (fast — RSC renders + source-greps; no Puppeteer)
- **Per wave merge:** `pnpm vitest run` (full suite — ensures Phase 1–4 regressions caught)
- **Phase gate:** Full suite green + `pnpm build` exits 0 + `public/resume.pdf` exists with `%PDF-` magic bytes + `pnpm typecheck` exits 0 + manual print-preview pass + visual /about + /resume pages match UI-SPEC

### Wave 0 Gaps

- [ ] `tests/about/` directory — covers ABT-01..03 + CTC-03 about-side
- [ ] `tests/resume/` directory — covers RES-01..06
- [ ] `tests/resume/schema.test.ts` — ResumeSchema validates known-good and rejects malformed
- [ ] `tests/resume/content.test.ts` — RESUME has minimum entries; required projects mentioned; no banned words
- [ ] `tests/resume/print-css.test.ts` — source-grep `app/resume/resume.css` for `@media print` + `@page` + `display: none` chrome rules + no `html`/`body` rules outside `@media print` (Pitfall 8 lock)
- [ ] `tests/resume/pdf-build.test.ts` — structural: script imports puppeteer + wait-on, emulates print, calls page.pdf with preferCSSPageSize + printBackground
- [ ] `tests/resume/pdf-artifact.test.ts` — gated by `CI=true` or `RESUME_PDF_CHECK=1`; asserts file exists, %PDF- bytes, size bounds
- [ ] `tests/site/footer.test.tsx` — if not already present (Phase 1 layer); assert mailto subject, GitHub URL canonicalization, DownloadPdfLink inclusion
- [ ] Extend `tests/home/anti-patterns.test.ts` `PHASE4_SOURCES` manifest to include all 13 new Phase 5 source files
- [ ] `tsx@^4` added to devDependencies
- [ ] `puppeteer@25.0.2` (or chromium-min path) + `wait-on@9.0.10` added to devDependencies
- [ ] `public/resume.pdf` 16-byte stub committed (so /resume.pdf doesn't 404 in dev before Wave 3)
- [ ] `scripts/build-resume-pdf.ts` and `package.json` postbuild hook added (Wave 3 task — not Wave 0)

## Sources

### Primary (HIGH confidence — Next.js / Puppeteer / Zod / npm registry)

- [Next.js 16 Route Groups (v16.2.6, May 13 2026)](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups) — confirms route group opt-out behavior, multiple-root-layouts caveats
- [Next.js 16 CSS docs (v16.2.6, May 13 2026)](https://nextjs.org/docs/app/getting-started/css) — confirms layout-scoped CSS imports, ordering, caveat about stylesheet persistence across navigation
- [Next.js 16 Layouts](https://nextjs.org/docs/app/api-reference/file-conventions/layout) — root layout requirements
- [Puppeteer v25 Page.pdf() API](https://pptr.dev/api/puppeteer.page.pdf) — confirmed `emulateMediaType('screen' | 'print')` behavior
- [Puppeteer v25 PDFOptions interface](https://pptr.dev/api/puppeteer.pdfoptions) — confirmed `printBackground` default `false`, `preferCSSPageSize` default `false`, format/margin behavior
- [Puppeteer installation guide](https://pptr.dev/guides/installation) — confirmed `puppeteer` vs `puppeteer-core` choice for local dev
- [@sparticuz/chromium GitHub README](https://github.com/Sparticuz/chromium) — confirmed -min variant is for serverless / arm64 only
- npm registry direct queries (2026-05-17):
  - `npm view puppeteer version` → `25.0.2`
  - `npm view puppeteer-core version` → `25.0.2`
  - `npm view @sparticuz/chromium-min version` → `148.0.0`
  - `npm view wait-on version` → `9.0.10`
- [wait-on GitHub README](https://github.com/jeffbski/wait-on) — confirmed HTTP probe + programmatic Node API
- Existing `package.json` — confirmed Next 16.2.4, React 19.2.4, Zod 3.23, TypeScript 5.7.3 in repo
- Existing `lib/schemas.ts` — ProjectFrontmatterSchema pattern for ResumeSchema mirror
- Existing `components/site/footer.tsx` — confirmed current footer state (3 URL fixes needed)
- Existing `tests/home/anti-patterns.test.ts` — confirmed source-grep pattern + comment-stripping technique to extend
- Extracted Olive_Elliott_Resume.docx via `unzip -p ... word/document.xml` — verbatim source data

### Secondary (MEDIUM confidence — community sources verified against primary)

- [pnpm Scripts docs](https://pnpm.io/scripts) — postbuild hook semantics; pnpm 10 lifecycle-script blocking applies only to dependencies
- [Mozilla bugzilla #231032 — mailto unescaped spaces](https://bugzilla.mozilla.org/show_bug.cgi?id=231032) — confirmed `%20` not `+` for subject
- [RFC 6068 mailto scheme summary on maildiver.com](https://maildiver.com/blog/mailto-links-complete-guide/) — confirms space encoding requirement
- [Puppeteer issue #437 — page.pdf @page properties](https://github.com/puppeteer/puppeteer/issues/437) — confirmed historical `preferCSSPageSize` behavior
- [Puppeteer issue #6657 — preferCSSPageSize](https://github.com/puppeteer/puppeteer/issues/6657) — confirmed CSS-vs-options conflict mode

### Tertiary (LOW — opinion/comparison pieces, used only as cross-checks)

- [educative.io: puppeteer vs puppeteer-core](https://www.educative.io/answers/puppeteer-vs-puppeteer-core)
- [Colin Hemphill — Creating a Resume Website and PDF Generator with Next.js](https://www.colinhemphill.com/blog/creating-a-resume-website-and-pdf-generator-with-nextjs)
- [Strapi blog — Build a PDF Generation Engine with Strapi & Next.js](https://strapi.io/blog/build-a-pdf-generation-engine-with-nextjs)

## Metadata

**Confidence breakdown:**

- Next.js 16 route group composition: **HIGH** — directly confirmed via Next.js 16.2.6 docs (May 13 2026)
- Puppeteer 25 PDF API surface (`printBackground`, `preferCSSPageSize`, `emulateMediaType`, `format`): **HIGH** — confirmed via pptr.dev primary docs + npm registry version verification
- `puppeteer` (full) vs `puppeteer-core` recommendation: **MEDIUM-HIGH** — primary sources (Puppeteer install guide, Sparticuz README) clearly state -core/-min are for serverless; planner judgment call is whether to override CONTEXT's locked decision
- `wait-on@9.0.10` programmatic API for HTTP probe: **HIGH** — confirmed via npm registry + GitHub README
- Footer current state + required edits: **HIGH** — read directly from `components/site/footer.tsx`
- Resume data extraction: **HIGH** — extracted from .docx via unzip + XML parse; verbatim
- LinkedIn handle: **LOW** — placeholder; needs Olive's confirmation
- Fathom/Stemz public links: **LOW** — placeholders; Phase 7 content pass
- Print CSS behavior in App Router layout subtree: **HIGH** — primary docs explicit; one caveat documented (Pitfall 8)
- Zod schema pattern: **HIGH** — mirrors existing `ProjectFrontmatterSchema` in same file
- Anti-pattern test extension: **HIGH** — direct extension of working Phase 4 pattern in same file
- pnpm postbuild hook semantics: **HIGH** — standard npm convention, pnpm respects it; verified against pnpm docs

**Research date:** 2026-05-17
**Valid until:** 2026-06-17 for package versions (fast-moving); 2026-08-17 for Next.js 16 routing/CSS patterns and Puppeteer 25 API (stable surfaces).
