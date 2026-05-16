// tests/home/page.test.tsx
// HOM-01..HOM-04 + Phase 1 placeholder cleanup, locked at the page-route level.
//
// app/(site)/page.tsx is REPLACED in Plan 04-02. The page is the composition
// boundary between Plan 00 (ThesisParagraph), Plan 01 (cards), and the Phase 2
// query API (lib/projects.ts). These tests assert:
//   1. Single <h1> per route (HOM-01)
//   2. Hero stack content (HOM-01 + HOM-02)
//   3. HOM-03 conditional secondary section (both empty + non-empty cases)
//   4. Per-route metadata (description present, title omitted, OG image declared)
//   5. Phase 7 placeholder marker on the THESIS const (UI-SPEC Copywriting)
//   6. No FadeIn import remains (Phase 1 placeholder cleanup checklist #1)
//   7. Source-grep anti-pattern invariants (HOM-04: no bento, no stagger)
//
// Tests mock @/lib/projects to control hero/secondary lists; uses vi.resetModules
// + dynamic await import('@/app/(site)/page') for both render-tree and
// metadata-export assertions (same pattern as tests/projects/page-metadata.test.ts).
// The Pitfall-8 motion mock is reinstalled because the page transitively loads
// ThesisParagraph ('use client').
import { render } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

function mockMotion() {
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
            transition: _tt,
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
      useReducedMotion: () => null,
    }
  })
}

const heroProjectBase = {
  slug: 'myco',
  title: 'Myco',
  tagline: 'A persistent cognitive layer for AI agents.',
  year: 2025,
  tier: 'hero' as const,
  order: 10,
  status: 'active' as const,
  visibility: 'public' as const,
  tags: ['local-first'] as const,
  stack: ['TypeScript'],
  links: { repo: 'https://github.com/olivelliott/myco' },
  gallery: [],
  outcomes: ['outcome one'],
  description: 'Test fixture',
  body: '',
  hero: {
    src: '/images/projects/myco/hero-placeholder.png',
    alt: 'Myco placeholder',
  },
}

const myco = heroProjectBase
const fathom = { ...heroProjectBase, slug: 'fathom', title: 'Fathom', order: 20 }
const agendaKeeper = {
  ...heroProjectBase,
  slug: 'agenda-keeper',
  title: 'Agenda Keeper',
  order: 30,
}
const tradeBot = {
  ...heroProjectBase,
  slug: 'trade-bot',
  title: 'Trade Bot',
  tier: 'secondary' as const,
  order: 100,
}

/**
 * Mock the query API. Returns hero-tier and secondary-tier shapes per scenario.
 *
 * - heroOnly: getAll() returns only the 3 hero projects; getHeroProjects() same.
 * - withSecondary: getAll() returns hero + tradeBot; getHeroProjects() returns
 *   only the 3 hero projects (filtering on tier=hero happens inside getHeroProjects).
 */
function mockProjects(scenario: 'heroOnly' | 'withSecondary') {
  const hero = [myco, fathom, agendaKeeper]
  const all = scenario === 'withSecondary' ? [...hero, tradeBot] : hero
  vi.doMock('@/lib/projects', () => ({
    getAll: () => all,
    getHeroProjects: () => hero,
  }))
}

beforeEach(() => {
  vi.resetModules()
})

describe('app/(site)/page.tsx — Home route', () => {
  it('Test 1 — single <h1>: rendered home page contains exactly one <h1> (the wordmark)', async () => {
    mockMotion()
    mockProjects('heroOnly')
    const mod = await import('@/app/(site)/page')
    const HomePage = mod.default
    const { container } = render(<HomePage />)
    expect(container.querySelectorAll('h1').length).toBe(1)
  })

  it('Test 2 — hero stack content: page contains "olive elliott", "engineer", and at least one project title', async () => {
    mockMotion()
    mockProjects('heroOnly')
    const mod = await import('@/app/(site)/page')
    const HomePage = mod.default
    const { container } = render(<HomePage />)
    const text = container.textContent ?? ''
    expect(text).toContain('olive elliott')
    expect(text).toContain('engineer')
    expect(text).toContain('Myco')
  })

  it('Test 3a — HOM-03 conditional: getAll() with only hero projects → page does NOT contain "more work"', async () => {
    mockMotion()
    mockProjects('heroOnly')
    const mod = await import('@/app/(site)/page')
    const HomePage = mod.default
    const { container } = render(<HomePage />)
    expect(container.textContent ?? '').not.toContain('more work')
  })

  it('Test 3b — HOM-03 conditional: getAll() includes a secondary project → page contains "more work"', async () => {
    mockMotion()
    mockProjects('withSecondary')
    const mod = await import('@/app/(site)/page')
    const HomePage = mod.default
    const { container } = render(<HomePage />)
    expect(container.textContent ?? '').toContain('more work')
  })

  it('Test 4 — metadata description: non-empty string containing "Olive Elliott" and "local-first"', async () => {
    mockMotion()
    mockProjects('heroOnly')
    const mod = await import('@/app/(site)/page')
    const desc = mod.metadata?.description as string | undefined
    expect(typeof desc).toBe('string')
    expect(desc!.length).toBeGreaterThan(0)
    expect(desc).toContain('Olive Elliott')
    expect(desc).toContain('local-first')
  })

  it('Test 5 — metadata title omitted: mod.metadata.title is undefined (root titleTemplate default flows through)', async () => {
    mockMotion()
    mockProjects('heroOnly')
    const mod = await import('@/app/(site)/page')
    expect(mod.metadata?.title).toBeUndefined()
  })

  it('Test 6 — OG image declared: openGraph.images[0].url is "/og-default.png"', async () => {
    mockMotion()
    mockProjects('heroOnly')
    const mod = await import('@/app/(site)/page')
    const images = mod.metadata?.openGraph?.images as
      | Array<{ url: string }>
      | undefined
    expect(images?.[0]?.url).toBe('/og-default.png')
  })

  it('Test 7 — placeholder marker: source file contains a "PLACEHOLDER: Phase 7" comment above the THESIS const', () => {
    const src = readFileSync(
      path.resolve(process.cwd(), 'app/(site)/page.tsx'),
      'utf8',
    )
    // Match the marker followed (within the next ~6 lines) by THESIS = / const THESIS =
    expect(/PLACEHOLDER:\s*Phase 7/i.test(src)).toBe(true)
    // Ensure the marker is positioned before the THESIS constant.
    const markerIdx = src.search(/PLACEHOLDER:\s*Phase 7/i)
    const thesisIdx = src.indexOf('THESIS')
    expect(markerIdx).toBeGreaterThanOrEqual(0)
    expect(thesisIdx).toBeGreaterThan(markerIdx)
  })

  it('Test 8 — Phase 1 cleanup: source does NOT contain FadeIn import from @/components/motion/fade-in', () => {
    const src = readFileSync(
      path.resolve(process.cwd(), 'app/(site)/page.tsx'),
      'utf8',
    )
    expect(src).not.toContain("from '@/components/motion/fade-in'")
    expect(src).not.toContain('from "@/components/motion/fade-in"')
    // Defensive: no `FadeIn` identifier in actual code (block/line comments
    // legitimately reference the historical placeholder via JSDoc — Cleanup
    // Checklist preserves that breadcrumb). Strip comments before identifier
    // grep, same pattern as Test 9 / Plan 04-03 source-grep precedent.
    const code = src
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .split('\n')
      .map((line) => line.replace(/\/\/.*$/, ''))
      .join('\n')
    expect(/\bFadeIn\b/.test(code)).toBe(false)
  })

  it('Test 9 — HOM-04 source-grep invariants: no whileInView / IntersectionObserver / grid-cols-12 / col-span-2 in page source', () => {
    const src = readFileSync(
      path.resolve(process.cwd(), 'app/(site)/page.tsx'),
      'utf8',
    )
    // Strip BOTH block and line comments before grepping. RSC-contract source
    // intentionally names absent APIs in doc-comments (e.g. JSDoc "no
    // whileInView") and a naive grep false-positives on the docstring. Block
    // comments stripped first (greedy /* ... */ across newlines), then line
    // comments. Mirrors Plan 04-03's forbidden-client-API source-grep.
    const code = src
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .split('\n')
      .map((line) => line.replace(/\/\/.*$/, ''))
      .join('\n')
    expect(code).not.toMatch(/whileInView/)
    expect(code).not.toMatch(/IntersectionObserver/)
    expect(code).not.toMatch(/grid-cols-12/)
    expect(code).not.toMatch(/col-span-2/)
  })
})
