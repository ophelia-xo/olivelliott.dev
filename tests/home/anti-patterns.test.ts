// tests/home/anti-patterns.test.ts
// Phase 4 cross-cutting anti-pattern regression net (final phase gate).
//
// Reads ALL Phase 4 source files at once and asserts source-level invariants
// derived from UI-SPEC § Anti-Patterns + RESEARCH § Anti-Patterns and the
// per-plan SUMMARYs (04-01, 04-02, 04-03). Catches a future contributor
// adding `whileInView` or `'use client'` to a route that shouldn't have it,
// without requiring a separate test per component.
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

// Every Phase 4 source file that participates in the invariants below.
// If a future plan deletes one of these, the readAll() existsSync check
// fails loudly with a clear "missing" message.
const PHASE4_SOURCES = [
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
]

interface SourceMap {
  /** raw file contents (untouched) */
  raw: Record<string, string>
  /** file contents with /* block */ and // line comments stripped */
  code: Record<string, string>
}

/**
 * Read every Phase 4 source file and return both the raw + comment-stripped
 * versions. The strip pattern matches Plan 04-02 / 04-03 precedent so
 * docstrings that intentionally name absent APIs ('NO useSearchParams')
 * don't false-positive against the forbidden-token grep.
 */
function readAll(): SourceMap {
  const raw: Record<string, string> = {}
  const code: Record<string, string> = {}
  for (const rel of PHASE4_SOURCES) {
    const abs = path.join(ROOT, rel)
    expect(existsSync(abs), `Phase 4 file missing: ${rel}`).toBe(true)
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

describe('Phase 4 anti-pattern source-grep invariants', () => {
  it('Test 1 — HOM-04: no whileInView / IntersectionObserver / onScroll anywhere in Phase 4', () => {
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

  it("Test 3 — single 'use client' across all Phase 4 sources; the only directive is in components/home/thesis-paragraph.tsx", () => {
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

  it('Test 4 — no useSearchParams / useRouter anywhere in Phase 4 (URL state is server-side per PIX-02)', () => {
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

  it('Test 6 — banned-word lock across Phase 4 source (no promo/AI-template language)', () => {
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

  it('Test 7 — no Lucide icons in Phase 4 (UI-SPEC § Design System: zero icons)', () => {
    const { code } = readAll()
    for (const [rel, src] of Object.entries(code)) {
      expect(
        /from\s+['"]lucide-react['"]/.test(src),
        `${rel} imports from lucide-react (Phase 4 ships zero icons)`,
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
    ]
    for (const rel of cardAndRouteSurfaces) {
      const src = code[rel]
      expect(
        /\bTagChipRow\b/.test(src),
        `${rel} references TagChipRow (cards/routes use CardMeta with span chips — Pitfalls 3 + 12)`,
      ).toBe(false)
    }
  })
})
