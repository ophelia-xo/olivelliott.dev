// tests/home/anti-patterns.test.ts
// Phase 4 + 5 cross-cutting anti-pattern regression net. Manifest grows per
// phase via PHASE_SOURCES; invariants stay constant. Future phases extend
// by adding to PHASE_SOURCES.
//
// Reads ALL Phase 4 + Phase 5 source files at once and asserts source-level
// invariants derived from UI-SPEC § Anti-Patterns + RESEARCH § Anti-Patterns
// and the per-plan SUMMARYs (04-01..04-04, 05-01..05-04). Catches a future
// contributor adding `whileInView`, `'use client'`, motion.*, or a Lucide
// import to a route that shouldn't have it, without requiring a separate
// test per component.
//
// Source-grep technique: read each file, strip /* block */ AND // line
// comments BEFORE matching forbidden tokens. RSC contracts intentionally
// document absent APIs in JSDoc ('NO useSearchParams', 'NO whileInView'),
// so a naive grep would false-positive on the docstring. Pattern established
// in tests/projects/tag-filter-row.test.tsx (Plan 04-03) and reused in
// tests/home/page.test.tsx (Plan 04-02).
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const ROOT = path.resolve(__dirname, '..', '..')

// Every Phase 4 + Phase 5 source file that participates in the invariants
// below. If a future plan deletes one of these, the readAll() existsSync
// check fails loudly with a clear "missing" message.
//
// Layout:
//   - 11 Phase 4 entries (home composer surfaces, project cards, filter UI)
//   - 13 Phase 5 entries (about route + components, resume route + components,
//     footer (Phase 1 baseline touched by Plan 05-04), resume content module)
const PHASE_SOURCES = [
  // ── Phase 4 ────────────────────────────────────────────────
  'components/home/thesis-paragraph.tsx',
  'components/home/home-hero.tsx',
  'components/home/home-project-grid.tsx',
  'components/projects/card-meta.tsx',
  'components/projects/project-card-hero.tsx',
  'components/projects/project-card-secondary.tsx',
  'components/projects/tag-filter-row.tsx',
  'components/projects/empty-filter-state.tsx',
  'components/projects/tier-separator.tsx',
  'app/(site)/page.tsx',
  'app/(site)/projects/page.tsx',
  // ── Phase 5: About route + components ──────────────────────
  'app/(site)/about/page.tsx',
  'components/about/about-bio.tsx',
  'components/about/project-pill-row.tsx',
  'components/about/contact-stack.tsx',
  'components/about/values-list.tsx',
  // ── Phase 5: Resume route + components ─────────────────────
  'app/resume/layout.tsx',
  'app/resume/page.tsx',
  'components/resume/resume-header.tsx',
  'components/resume/resume-section.tsx',
  'components/resume/resume-entry.tsx',
  'components/resume/download-pdf-link.tsx',
  // ── Phase 5: Footer (touched by Plan 05-04) ────────────────
  'components/site/footer.tsx',
  // ── Phase 5: Resume content + schema ───────────────────────
  'content/resume.ts',
]

interface SourceMap {
  /** raw file contents (untouched) */
  raw: Record<string, string>
  /** file contents with /* block */ and // line comments stripped */
  code: Record<string, string>
}

/**
 * Read every Phase 4 + Phase 5 source file and return both the raw +
 * comment-stripped versions. The strip pattern matches Plan 04-02 / 04-03
 * precedent so docstrings that intentionally name absent APIs
 * ('NO useSearchParams') don't false-positive against the forbidden-token grep.
 */
function readAll(): SourceMap {
  const raw: Record<string, string> = {}
  const code: Record<string, string> = {}
  for (const rel of PHASE_SOURCES) {
    const abs = path.join(ROOT, rel)
    expect(existsSync(abs), `Phase 4/5 file missing: ${rel}`).toBe(true)
    const src = readFileSync(abs, 'utf8')
    raw[rel] = src
    code[rel] = src
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .split('\n')
      .map((line) => line.replace(/\/\/.*$/, ''))
      .join('\n')
  }
  return { raw, code }
}

describe('Phase 4 + 5 anti-pattern source-grep invariants', () => {
  it('Test 1 — HOM-04: no whileInView / IntersectionObserver / onScroll anywhere in Phase 4 + 5', () => {
    const { code } = readAll()
    for (const [rel, src] of Object.entries(code)) {
      expect(
        /whileInView|IntersectionObserver|onScroll|onscroll/.test(src),
        `${rel} contains a stagger-on-scroll pattern`,
      ).toBe(false)
    }
  })

  it('Test 2 — HOM-04 anti-bento: no grid-cols-12 / col-span-2 / grid-rows- on the home composer surfaces', () => {
    const { code } = readAll()
    // Test 2 stays scoped to the original home composer surfaces — Phase 5
    // doesn't touch home composition, so the manifest extension is a no-op here.
    const homeSurfaces = [
      'app/(site)/page.tsx',
      'components/home/home-project-grid.tsx',
      'components/home/home-hero.tsx',
    ]
    for (const rel of homeSurfaces) {
      const src = code[rel]
      expect(/grid-cols-12/.test(src), `${rel} contains grid-cols-12`).toBe(
        false,
      )
      expect(/col-span-2\b/.test(src), `${rel} contains col-span-2`).toBe(false)
      expect(/\bgrid-rows-/.test(src), `${rel} contains grid-rows-`).toBe(false)
    }
  })

  it("Test 3 — single 'use client' across all Phase 4 + 5 sources; the only directive is in components/home/thesis-paragraph.tsx", () => {
    // We match the directive shape (a line that is just 'use client'; or "use client";)
    // and accept it ONLY in thesis-paragraph.tsx.
    const { raw } = readAll()
    const directive = /^\s*['"]use client['"];?\s*$/m
    const offenders: string[] = []
    for (const [rel, src] of Object.entries(raw)) {
      const hasDirective = directive.test(src)
      if (rel === 'components/home/thesis-paragraph.tsx') {
        expect(hasDirective, `thesis-paragraph.tsx MUST be 'use client'`).toBe(
          true,
        )
      } else if (hasDirective) {
        offenders.push(rel)
      }
    }
    expect(
      offenders,
      `Unexpected 'use client' in: ${offenders.join(', ')}`,
    ).toEqual([])
  })

  it('Test 4 — no useSearchParams / useRouter anywhere in Phase 4 + 5 (URL state is server-side per PIX-02)', () => {
    const { code } = readAll()
    for (const [rel, src] of Object.entries(code)) {
      expect(
        /\buseSearchParams\b/.test(src),
        `${rel} uses useSearchParams (forbidden — read searchParams on the RSC page instead)`,
      ).toBe(false)
      expect(
        /\buseRouter\b/.test(src),
        `${rel} uses useRouter (forbidden — chips are <a>, navigation is native)`,
      ).toBe(false)
    }
  })

  it('Test 5 — no motion.span / motion.div / motion.p / motion.h (LazyMotion strict requires m.*)', () => {
    const { code } = readAll()
    for (const [rel, src] of Object.entries(code)) {
      expect(
        /\bmotion\.(span|div|p|h[1-6])\b/.test(src),
        `${rel} uses motion.* (LazyMotion strict requires m.*)`,
      ).toBe(false)
    }
  })

  it('Test 6 — banned-word lock across Phase 4 + 5 source (no promo/AI-template language)', () => {
    const { code } = readAll()
    const banned =
      /\b(?:passionate|scalable solutions|cutting-edge|10x|crafted|seamless|leveraging|synergy|rockstar|ninja|innovative|transformative|ecosystem|paradigm|next-generation)\b/i
    for (const [rel, src] of Object.entries(code)) {
      const match = src.match(banned)
      expect(
        match,
        `${rel} contains banned word: ${match?.[0] ?? ''}`,
      ).toBeNull()
    }
  })

  it('Test 7 — no Lucide icons in Phase 4 + 5 (UI-SPEC § Design System: zero icons in either phase except the Phase 1 footer Mail import)', () => {
    const { code } = readAll()
    // Carve-out: components/site/footer.tsx imports { Mail } from 'lucide-react'
    // as part of Phase 1's icon row. Phase 5 added the DownloadPdfLink (literal ↓
    // character, NOT a Lucide icon) and made no new icon imports. The footer's
    // Phase 1 Mail import is the documented exception; any NEW Lucide import in
    // any other PHASE_SOURCES file fails this test.
    const entries = Object.entries(code).filter(
      ([rel]) => rel !== 'components/site/footer.tsx',
    )
    for (const [rel, src] of entries) {
      expect(
        /from\s+['"]lucide-react['"]/.test(src),
        `${rel} imports from lucide-react (Phase 4 + 5 ship zero new icons; footer Mail is the Phase 1 exception)`,
      ).toBe(false)
    }
  })

  it('Test 8 — no TagChipRow inside cards or page routes (Pitfall 3 + 12: nested anchor lock)', () => {
    const { code } = readAll()
    const cardAndRouteSurfaces = [
      'components/projects/project-card-hero.tsx',
      'components/projects/project-card-secondary.tsx',
      'components/projects/card-meta.tsx',
      'app/(site)/page.tsx',
      'app/(site)/projects/page.tsx',
      // Phase 5 extension: ProjectPillRow on /about must NOT import
      // TagChipRow — different semantics (links to /projects/${slug}, not
      // /projects?tag=…). Mirrors Phase 4 CardMeta-vs-ProjectMeta separation.
      'components/about/project-pill-row.tsx',
    ]
    for (const rel of cardAndRouteSurfaces) {
      const src = code[rel]
      expect(
        /\bTagChipRow\b/.test(src),
        `${rel} references TagChipRow (cards/routes use CardMeta with span chips — Pitfalls 3 + 12)`,
      ).toBe(false)
    }
  })

  it('Test 9 — Phase 5 sources are all RSC (no new client islands beyond Phase 4 budget)', () => {
    // Mirrors Test 3 but inverted/scoped: assert that NO Phase 5 source has
    // the 'use client' directive. Locks UI-SPEC's "Phase 5 ships zero new
    // client islands" promise. Phase 5's only client-side surface is the
    // DownloadPdfLink's <a download> attribute — a static anchor, not a
    // client component.
    const PHASE5_SOURCES = [
      'app/(site)/about/page.tsx',
      'components/about/about-bio.tsx',
      'components/about/project-pill-row.tsx',
      'components/about/contact-stack.tsx',
      'components/about/values-list.tsx',
      'app/resume/layout.tsx',
      'app/resume/page.tsx',
      'components/resume/resume-header.tsx',
      'components/resume/resume-section.tsx',
      'components/resume/resume-entry.tsx',
      'components/resume/download-pdf-link.tsx',
      'components/site/footer.tsx',
      'content/resume.ts',
    ]
    const { raw } = readAll()
    const directive = /^\s*['"]use client['"];?\s*$/m
    for (const rel of PHASE5_SOURCES) {
      expect(
        directive.test(raw[rel]),
        `${rel} has 'use client' — Phase 5 must not introduce new client islands`,
      ).toBe(false)
    }
  })

  it('Test 10 — /resume.pdf href surface count: only DownloadPdfLink component contains the literal href', () => {
    // ResumeHeader and Footer compose <DownloadPdfLink/>, not the raw anchor.
    // Locks the single-source-of-truth invariant: any future caller that
    // hand-writes href="/resume.pdf" trips this test.
    const { code } = readAll()
    let count = 0
    for (const [_rel, src] of Object.entries(code)) {
      const matches = src.match(/href=["']\/resume\.pdf["']/g)
      if (matches) count += matches.length
    }
    expect(
      count,
      'Expected exactly 1 file (download-pdf-link.tsx) to emit href=/resume.pdf; all other usages go through <DownloadPdfLink />',
    ).toBe(1)
  })
})
