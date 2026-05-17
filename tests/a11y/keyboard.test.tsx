// tests/a11y/keyboard.test.tsx
// QAL-03 — keyboard navigation gate. Replaces Wave 0 placeholder.
//
// Two layers:
//   - Source-grep over app/ + components/: no tabIndex={-1} (negative tab
//     order breaks Tab discovery). Carve-out set is currently empty — no
//     file in the repo uses tabIndex={-1} as of Phase 6 launch.
//   - DOM-grep on the rendered / route: assert ≥1 tab-reachable element
//     so the home page actually has interactive surface (Nav links + the
//     SkipLink + project card anchors all qualify).
//   - Source-grep on app/globals.css: the literal :focus-visible selector
//     is present (Phase 1 baseline lock — the global focus ring).
//   - Source-grep on app/(site)/layout.tsx: <SkipLink /> wired in (Phase 1
//     baseline lock — FND-08; ensures the chromed routes have a
//     skip-to-content affordance as the first focusable element).
//
// The actual interactive walk-through (Tab through filter chips, Enter to
// activate, resume PDF download) is documented as a MANUAL verification
// step in lighthouse-report.md — jsdom Tab simulation is unreliable per
// RESEARCH § Pattern 8.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { render } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'

const ROOT = path.resolve(__dirname, '..', '..')

function walk(dir: string, exts = ['.ts', '.tsx']): string[] {
  const out: string[] = []
  for (const entry of readdirSync(dir)) {
    const abs = path.join(dir, entry)
    if (statSync(abs).isDirectory()) out.push(...walk(abs, exts))
    else if (exts.some((e) => abs.endsWith(e))) out.push(abs)
  }
  return out
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .map((l) => l.replace(/\/\/.*$/, ''))
    .join('\n')
}

const APP_SOURCES = walk(path.join(ROOT, 'app'))
const COMPONENT_SOURCES = walk(path.join(ROOT, 'components'))
const ALL = [...APP_SOURCES, ...COMPONENT_SOURCES]

// Carve-out: SkipLink may legitimately use tabIndex on its visible/hidden
// states. Document any exception inline. As of Phase 6 launch, the SkipLink
// (components/site/skip-link.tsx) uses sr-only + focus:not-sr-only (no
// tabIndex), so the set is empty.
const TABINDEX_NEG_1_CARVEOUTS = new Set<string>([
  // Add 'components/site/skip-link.tsx' here ONLY if the source actually
  // contains tabIndex={-1}.
])

describe('keyboard nav (QAL-03)', () => {
  it('Test 1 — source-grep: no tabIndex={-1} under app/ + components/ (except carve-outs)', () => {
    const offenders: string[] = []
    for (const abs of ALL) {
      const rel = path.relative(ROOT, abs)
      if (TABINDEX_NEG_1_CARVEOUTS.has(rel)) continue
      const src = stripComments(readFileSync(abs, 'utf8'))
      if (/tabIndex=\{-1\}/.test(src) || /tabIndex=["']-1["']/.test(src)) {
        offenders.push(rel)
      }
    }
    expect(
      offenders,
      `tabIndex={-1} forbidden (negative tab order breaks Tab discovery) in: ${offenders.join(', ')}`,
    ).toEqual([])
  })

  it('Test 2 — DOM-grep: rendered / route has ≥1 tab-reachable element', async () => {
    // Stub next/navigation — Nav's NavLink calls usePathname().
    vi.doMock('next/navigation', () => ({ usePathname: () => '/' }))
    // Same Proxy motion mock as Task 1 home test — ThesisParagraph + the
    // (site) MotionProvider both load motion/react and hang in jsdom without
    // a stub.
    vi.doMock('motion/react', () => {
      const proxy = new Proxy(
        {},
        {
          get: (_target, tag: string) => {
            const Comp = ({
              children,
              whileHover: _wh,
              whileFocus: _wf,
              whileTap: _wt,
              whileInView: _wv,
              initial: _i,
              animate: _a,
              exit: _e,
              transition: _t,
              variants: _v,
              ...rest
            }: Record<string, unknown> & { children?: React.ReactNode }) =>
              React.createElement(tag, rest, children)
            Comp.displayName = `m.${tag}`
            return Comp
          },
        },
      )
      return {
        m: proxy,
        motion: proxy,
        useReducedMotion: () => false,
        LazyMotion: ({ children }: { children: React.ReactNode }) => children,
        MotionConfig: ({ children }: { children: React.ReactNode }) => children,
        domAnimation: {},
        domMax: {},
      }
    })
    // Mock the project query API so the page renders deterministically.
    const heroFixture = {
      slug: 'myco',
      title: 'Myco',
      tagline: 'A persistent cognitive layer.',
      year: 2025,
      tier: 'hero' as const,
      order: 10,
      status: 'active' as const,
      visibility: 'public' as const,
      tags: ['local-first'] as const,
      stack: [],
      links: { repo: 'https://github.com/olivelliott/myco' },
      hero: { src: '/images/projects/myco/hero-placeholder.png', alt: 'Myco' },
      gallery: [],
      outcomes: [],
      description: 'd',
    }
    vi.doMock('@/lib/projects', () => ({
      getAll: () => [heroFixture],
      getHeroProjects: () => [heroFixture],
      getAllTags: () => [],
      getProjectsByTag: () => [],
    }))

    const { default: SiteLayout } = await import('@/app/(site)/layout')
    const { default: HomePage } = await import('@/app/(site)/page')
    const { container } = render(
      <SiteLayout>
        <HomePage />
      </SiteLayout>,
    )
    const focusables = container.querySelectorAll(
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    expect(
      focusables.length,
      '/ has no tab-reachable interactive elements (SkipLink + Nav + project card anchors should provide several)',
    ).toBeGreaterThan(0)
  })

  it('Test 3 — source-grep: app/globals.css declares :focus-visible (Phase 1 baseline)', () => {
    const css = readFileSync(path.join(ROOT, 'app/globals.css'), 'utf8')
    expect(
      /:focus-visible/.test(css),
      'app/globals.css missing :focus-visible rule (Phase 1 baseline — would lose the global focus ring)',
    ).toBe(true)
  })

  it('Test 4 — source-grep: <SkipLink /> wired into app/(site)/layout.tsx', () => {
    const layout = readFileSync(
      path.join(ROOT, 'app/(site)/layout.tsx'),
      'utf8',
    )
    expect(
      /<SkipLink/.test(layout),
      '(site)/layout.tsx missing <SkipLink /> (Phase 1 baseline — FND-08)',
    ).toBe(true)
  })
})
