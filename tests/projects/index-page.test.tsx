// tests/projects/index-page.test.tsx
// PIX-01 + PIX-02 + PIX-04 integration. Mocks @/lib/projects fixtures and
// routes through the /projects RSC page module to assert filter resolution,
// tier section conditional rendering, and per-route metadata.
//
// Uses Next 16 Promise<searchParams> shape (RESEARCH Pitfall 1) — every call
// wraps the searchParams in Promise.resolve(...).
//
// Notes:
// - Coexists with tests/projects/page.test.tsx (Phase 3 — covers detail route
//   [slug]/page.tsx). This file is purely the /projects INDEX integration.
// - The notFound spy is set up at module scope so the per-test mock chain stays
//   simple. Test 3 verifies the spy is NOT called when the tag is invalid —
//   broken URLs degrade silently per UI-SPEC § filter resolution edge cases.
// - The vi.doMock('@/lib/tags', ...) call passes a TAGS list that matches the
//   project's lib/tags.ts source of truth (11 literals). The fixtures use only
//   tags that exist in TAGS so the narrowing path is exercised faithfully.
import { render } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// notFound spy — Test 3 asserts it is NOT called on invalid tag values.
// Throwing inside the spy makes accidental invocations loud (the test fails
// with a clear stack), but Test 3 expects the page to NEVER call notFound().
const notFoundSpy = vi.fn(() => {
  throw new Error('notFound() should not be called for invalid tags')
})
vi.mock('next/navigation', () => ({ notFound: notFoundSpy }))

// Fixture corpus: 3 projects covering both tiers.
// - myco (hero, tags: local-first + autonomous + open-source)
// - fathom (hero, tags: cli + autonomous)
// - trade-bot (secondary, tags: local-first + python + code-private)
const fixtures = [
  {
    slug: 'myco',
    title: 'Myco',
    tagline: 'A persistent cognitive layer.',
    year: 2025,
    tier: 'hero' as const,
    order: 10,
    status: 'active' as const,
    visibility: 'public' as const,
    tags: ['local-first', 'autonomous', 'open-source'] as const,
    stack: [],
    links: { repo: 'https://github.com/olivelliott/myco' },
    hero: { src: '/images/projects/myco/hero-placeholder.png', alt: 'a' },
    gallery: [],
    outcomes: [],
    description: 'd',
  },
  {
    slug: 'fathom',
    title: 'Fathom',
    tagline: 'A CLI.',
    year: 2025,
    tier: 'hero' as const,
    order: 20,
    status: 'active' as const,
    visibility: 'public' as const,
    tags: ['cli', 'autonomous'] as const,
    stack: [],
    links: {},
    hero: { src: '/images/projects/fathom/hero.png', alt: 'a' },
    gallery: [],
    outcomes: [],
    description: 'd',
  },
  {
    slug: 'trade-bot',
    title: 'Trade Bot',
    tagline: 'Local-first trading.',
    year: 2024,
    tier: 'secondary' as const,
    order: 30,
    status: 'active' as const,
    visibility: 'private' as const,
    tags: ['local-first', 'python', 'code-private'] as const,
    stack: [],
    links: {},
    hero: { src: '/images/projects/trade-bot/hero-placeholder.png', alt: 'a' },
    gallery: [],
    outcomes: [],
    description: 'd',
  },
]

type Fixture = (typeof fixtures)[number]

interface ProjectsOverrides {
  getAll?: () => readonly Fixture[]
  getAllTags?: () => ReadonlyArray<{ tag: string; count: number }>
  getProjectsByTag?: (tag: string) => readonly Fixture[]
}

function mockProjects(overrides?: ProjectsOverrides) {
  vi.doMock('@/lib/projects', () => ({
    getAll: overrides?.getAll ?? (() => fixtures),
    getAllTags:
      overrides?.getAllTags ??
      (() => [
        { tag: 'autonomous', count: 2 },
        { tag: 'local-first', count: 2 },
        { tag: 'cli', count: 1 },
        { tag: 'code-private', count: 1 },
        { tag: 'open-source', count: 1 },
        { tag: 'python', count: 1 },
      ]),
    getProjectsByTag:
      overrides?.getProjectsByTag ??
      ((tag: string) =>
        fixtures.filter((p) => (p.tags as readonly string[]).includes(tag))),
  }))
}

async function loadPage() {
  // Dynamic import so the per-test mock chain (vi.resetModules + vi.doMock)
  // is honored — matches tests/projects/page.test.tsx pattern.
  const mod = await import('@/app/(site)/projects/page')
  return mod
}

beforeEach(() => {
  vi.resetModules()
  notFoundSpy.mockClear()
})

describe('/projects index page', () => {
  // ──────────────────────────────────────────────────────────────────────────
  // Rendering tests (1–9)
  // ──────────────────────────────────────────────────────────────────────────

  it('Test 1 — no filter: renders both tier sections + cards from both tiers; no active chip; no clear-filter link', async () => {
    mockProjects()
    const { default: Page } = await loadPage()
    const ui = await Page({ searchParams: Promise.resolve({}) })
    const { container } = render(ui)
    // Both tier sections present
    expect(
      container.querySelector('section[aria-labelledby="hero-tier-eyebrow"]'),
    ).not.toBeNull()
    expect(
      container.querySelector(
        'section[aria-labelledby="secondary-tier-eyebrow"]',
      ),
    ).not.toBeNull()
    // Cards from both tiers
    const text = container.textContent ?? ''
    expect(text).toContain('Myco')
    expect(text).toContain('Fathom')
    expect(text).toContain('Trade Bot')
    // No active chip
    expect(container.querySelector('a[aria-pressed="true"]')).toBeNull()
    // No clear-filter link (clear-filter only appears under TagFilterRow when activeTag set)
    const clearLink = Array.from(container.querySelectorAll('a')).find((a) =>
      /clear filter/i.test(a.textContent ?? ''),
    )
    expect(clearLink).toBeUndefined()
  })

  it('Test 2 — valid tag (?tag=local-first): filtered list + active chip with href="/projects" + clear-filter link', async () => {
    mockProjects()
    const { default: Page } = await loadPage()
    const ui = await Page({ searchParams: Promise.resolve({ tag: 'local-first' }) })
    const { container } = render(ui)
    // Active chip: aria-pressed=true + href clears to /projects (Pitfall 9)
    const activeChip = container.querySelector('a[aria-pressed="true"]')
    expect(activeChip).not.toBeNull()
    expect(activeChip?.getAttribute('href')).toBe('/projects')
    // Clear-filter link present
    const clearLink = Array.from(container.querySelectorAll('a')).find((a) =>
      /clear filter/i.test(a.textContent ?? ''),
    )
    expect(clearLink).not.toBeUndefined()
    expect(clearLink?.getAttribute('href')).toBe('/projects')
    // Filtered list: myco + trade-bot (both tagged local-first); fathom absent
    const text = container.textContent ?? ''
    expect(text).toContain('Myco')
    expect(text).toContain('Trade Bot')
    expect(text).not.toContain('Fathom')
    // Single <h1> still
    expect(container.querySelectorAll('h1').length).toBe(1)
  })

  it('Test 3 — invalid tag (?tag=does-not-exist): degrades silently — full list, no active chip, no clear link, notFound() NOT called', async () => {
    mockProjects()
    const { default: Page } = await loadPage()
    const ui = await Page({
      searchParams: Promise.resolve({ tag: 'does-not-exist' }),
    })
    const { container } = render(ui)
    // No active chip
    expect(container.querySelector('a[aria-pressed="true"]')).toBeNull()
    // No clear-filter link
    const clearLink = Array.from(container.querySelectorAll('a')).find((a) =>
      /clear filter/i.test(a.textContent ?? ''),
    )
    expect(clearLink).toBeUndefined()
    // Full list renders
    const text = container.textContent ?? ''
    expect(text).toContain('Myco')
    expect(text).toContain('Fathom')
    expect(text).toContain('Trade Bot')
    // notFound() was NOT called
    expect(notFoundSpy).not.toHaveBeenCalled()
  })

  it('Test 4 — array form (?tag=a&tag=b): takes the first value and filters by it', async () => {
    mockProjects()
    const { default: Page } = await loadPage()
    const ui = await Page({
      searchParams: Promise.resolve({ tag: ['local-first', 'python'] }),
    })
    const { container } = render(ui)
    // Behaves like ?tag=local-first
    const activeChip = container.querySelector('a[aria-pressed="true"]')
    expect(activeChip).not.toBeNull()
    expect(activeChip?.getAttribute('href')).toBe('/projects')
    // Active chip text contains the local-first label (TAG_LABELS[local-first])
    expect(activeChip?.textContent?.toLowerCase()).toContain('local-first')
    // Same filtered list as Test 2
    const text = container.textContent ?? ''
    expect(text).toContain('Myco')
    expect(text).toContain('Trade Bot')
    expect(text).not.toContain('Fathom')
  })

  it('Test 5 — zero results for a valid tag: EmptyFilterState renders; BOTH tier sections + their separators are absent', async () => {
    mockProjects({
      getAllTags: () => [
        { tag: 'autonomous', count: 2 },
        { tag: 'saas', count: 0 },
      ],
      getProjectsByTag: () => [],
    })
    const { default: Page } = await loadPage()
    const ui = await Page({ searchParams: Promise.resolve({ tag: 'saas' }) })
    const { container } = render(ui)
    // EmptyFilterState rendered (locked copy)
    expect(container.textContent ?? '').toMatch(/no projects tagged/i)
    expect(container.textContent ?? '').toContain('"saas"')
    // Tier sections absent
    expect(
      container.querySelector('section[aria-labelledby="hero-tier-eyebrow"]'),
    ).toBeNull()
    expect(
      container.querySelector(
        'section[aria-labelledby="secondary-tier-eyebrow"]',
      ),
    ).toBeNull()
    // 'view all projects →' link pointing at /projects
    const viewAll = Array.from(container.querySelectorAll('a')).find((a) =>
      /view all projects/i.test(a.textContent ?? ''),
    )
    expect(viewAll).not.toBeUndefined()
    expect(viewAll?.getAttribute('href')).toBe('/projects')
  })

  it('Test 6 — one-tier-only (hero matches): hero section renders; secondary section + separator absent', async () => {
    // Filter that yields only hero-tier projects: ?tag=open-source (only myco)
    mockProjects()
    const { default: Page } = await loadPage()
    const ui = await Page({
      searchParams: Promise.resolve({ tag: 'open-source' }),
    })
    const { container } = render(ui)
    // Hero section present
    expect(
      container.querySelector('section[aria-labelledby="hero-tier-eyebrow"]'),
    ).not.toBeNull()
    // Secondary section absent
    expect(
      container.querySelector(
        'section[aria-labelledby="secondary-tier-eyebrow"]',
      ),
    ).toBeNull()
    // Myco visible; Trade Bot absent
    const text = container.textContent ?? ''
    expect(text).toContain('Myco')
    expect(text).not.toContain('Trade Bot')
  })

  it('Test 7 — one-tier-only (secondary matches): secondary section renders; hero section + separator absent', async () => {
    // Filter that yields only secondary-tier projects: ?tag=python (only trade-bot)
    mockProjects()
    const { default: Page } = await loadPage()
    const ui = await Page({ searchParams: Promise.resolve({ tag: 'python' }) })
    const { container } = render(ui)
    // Hero section absent
    expect(
      container.querySelector('section[aria-labelledby="hero-tier-eyebrow"]'),
    ).toBeNull()
    // Secondary section present
    expect(
      container.querySelector(
        'section[aria-labelledby="secondary-tier-eyebrow"]',
      ),
    ).not.toBeNull()
    // Trade Bot visible; Myco absent
    const text = container.textContent ?? ''
    expect(text).toContain('Trade Bot')
    expect(text).not.toContain('Myco')
  })

  it('Test 8 — single <h1>: rendered tree contains exactly one h1 (the "all projects" heading) across all filter states', async () => {
    mockProjects()
    const { default: Page } = await loadPage()
    // No filter
    const uiNoFilter = await Page({ searchParams: Promise.resolve({}) })
    const { container: c1 } = render(uiNoFilter)
    expect(c1.querySelectorAll('h1').length).toBe(1)
    expect(c1.querySelector('h1')?.textContent).toBe('all projects')

    // With valid filter
    vi.resetModules()
    mockProjects()
    const { default: Page2 } = await loadPage()
    const uiFiltered = await Page2({
      searchParams: Promise.resolve({ tag: 'local-first' }),
    })
    const { container: c2 } = render(uiFiltered)
    expect(c2.querySelectorAll('h1').length).toBe(1)

    // With invalid filter
    vi.resetModules()
    mockProjects()
    const { default: Page3 } = await loadPage()
    const uiInvalid = await Page3({
      searchParams: Promise.resolve({ tag: 'does-not-exist' }),
    })
    const { container: c3 } = render(uiInvalid)
    expect(c3.querySelectorAll('h1').length).toBe(1)
  })

  it('Test 9 — nav landmark: tree contains <nav aria-label="Filter projects by tag"> (TagFilterRow landmark)', async () => {
    mockProjects()
    const { default: Page } = await loadPage()
    const ui = await Page({ searchParams: Promise.resolve({}) })
    const { container } = render(ui)
    expect(
      container.querySelector('nav[aria-label="Filter projects by tag"]'),
    ).not.toBeNull()
  })

  // ──────────────────────────────────────────────────────────────────────────
  // Metadata tests (10–13)
  // ──────────────────────────────────────────────────────────────────────────

  it('Test 10 — metadata title: mod.metadata.title === "all projects" (root titleTemplate wraps to "all projects · olivelliott.dev")', async () => {
    mockProjects()
    const mod = await loadPage()
    expect(mod.metadata.title).toBe('all projects')
  })

  it('Test 11 — metadata canonical: mod.metadata.alternates.canonical === "/projects"', async () => {
    mockProjects()
    const mod = await loadPage()
    expect(mod.metadata.alternates?.canonical).toBe('/projects')
  })

  it('Test 12 — Pitfall 4 lock: openGraph.images undefined (sibling app/(site)/projects/opengraph-image.tsx owns it)', async () => {
    // Plan 06-02 Task 2 — manual openGraph.images was DELETED. Next 16's
    // sibling opengraph-image.tsx is now the source of truth.
    mockProjects()
    const mod = await loadPage()
    const images = (mod.metadata.openGraph as { images?: unknown })?.images
    expect(
      images,
      '/projects must NOT declare openGraph.images — sibling opengraph-image.tsx wins.',
    ).toBeUndefined()
  })

  it('Test 13 — metadata twitter card: twitter.card === "summary_large_image"', async () => {
    mockProjects()
    const mod = await loadPage()
    expect(mod.metadata.twitter?.card).toBe('summary_large_image')
  })
})
