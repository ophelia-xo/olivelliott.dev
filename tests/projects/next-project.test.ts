// tests/projects/next-project.test.ts
// Algorithm spec for getNextProject — top-overlap, cyclic fallback, null cases.
// Refs: 03-UI-SPEC § Component Inventory #9 + #10; 03-RESEARCH § Code Examples → lib/next-project.ts.
import { describe, expect, it, vi } from 'vitest'

const fakeProject = (slug: string, order: number) => ({
  slug,
  title: `Title-${slug}`,
  tagline: `Tagline-${slug}`,
  year: 2025,
  tier: 'secondary' as const,
  order,
  status: 'active' as const,
  visibility: 'public' as const,
  tags: ['typescript' as const],
  stack: [],
  links: {},
  hero: { src: `/x/${slug}/hero-placeholder.png`, alt: 'a' },
  gallery: [],
  outcomes: [],
  description: 'd',
})

describe('getNextProject', () => {
  it('returns the top-overlap related project when one is available', async () => {
    vi.resetModules()
    vi.doMock('@/lib/projects', () => ({
      getAll: () => [fakeProject('a', 10), fakeProject('b', 20)],
      getRelatedProjects: () => [fakeProject('b', 20)],
    }))
    const { getNextProject } = await import('@/lib/next-project')
    expect(getNextProject('a')).toEqual({
      slug: 'b',
      title: 'Title-b',
      tagline: 'Tagline-b',
    })
  })

  it('falls back to cyclic-by-order when no overlap; wraps last → first', async () => {
    vi.resetModules()
    const all = [fakeProject('a', 10), fakeProject('b', 20), fakeProject('c', 30)]
    vi.doMock('@/lib/projects', () => ({
      getAll: () => all,
      getRelatedProjects: () => [],
    }))
    const { getNextProject } = await import('@/lib/next-project')
    expect(getNextProject('b')?.slug).toBe('c')
    expect(getNextProject('c')?.slug).toBe('a')
    expect(getNextProject('a')?.slug).toBe('b')
  })

  it('returns null for single-project corpus', async () => {
    vi.resetModules()
    vi.doMock('@/lib/projects', () => ({
      getAll: () => [fakeProject('a', 10)],
      getRelatedProjects: () => [],
    }))
    const { getNextProject } = await import('@/lib/next-project')
    expect(getNextProject('a')).toBeNull()
  })

  it('returns null for unknown slug', async () => {
    vi.resetModules()
    vi.doMock('@/lib/projects', () => ({
      getAll: () => [fakeProject('a', 10), fakeProject('b', 20)],
      getRelatedProjects: () => [],
    }))
    const { getNextProject } = await import('@/lib/next-project')
    expect(getNextProject('does-not-exist')).toBeNull()
  })

  it('returned object has exactly {slug, title, tagline} keys', async () => {
    vi.resetModules()
    vi.doMock('@/lib/projects', () => ({
      getAll: () => [fakeProject('a', 10), fakeProject('b', 20)],
      getRelatedProjects: () => [fakeProject('b', 20)],
    }))
    const { getNextProject } = await import('@/lib/next-project')
    const result = getNextProject('a')
    expect(result).not.toBeNull()
    expect(Object.keys(result!).sort()).toEqual(['slug', 'tagline', 'title'])
  })
})
