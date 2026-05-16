// tests/projects/static-params.test.ts
// PRJ-01: generateStaticParams enumerates Phase 2's getAll() slugs.
import { describe, expect, it, vi } from 'vitest'

describe('app/(site)/projects/[slug]/page.tsx — generateStaticParams', () => {
  it('returns an entry for every project from getAll()', async () => {
    vi.resetModules()
    vi.doMock('@/lib/projects', () => ({
      getAll: () => [
        { slug: 'myco' },
        { slug: 'fathom' },
        { slug: 'agenda-keeper' },
      ],
      getProject: vi.fn(),
    }))
    vi.doMock('@/lib/next-project', () => ({ getNextProject: () => null }))
    const mod = await import('@/app/(site)/projects/[slug]/page')
    const params = mod.generateStaticParams()
    expect(params).toEqual([
      { slug: 'myco' },
      { slug: 'fathom' },
      { slug: 'agenda-keeper' },
    ])
  })

  it('every entry has only a `slug` key', async () => {
    vi.resetModules()
    vi.doMock('@/lib/projects', () => ({
      getAll: () => [{ slug: 'myco' }],
      getProject: vi.fn(),
    }))
    vi.doMock('@/lib/next-project', () => ({ getNextProject: () => null }))
    const mod = await import('@/app/(site)/projects/[slug]/page')
    const params = mod.generateStaticParams()
    for (const entry of params) {
      expect(Object.keys(entry)).toEqual(['slug'])
    }
  })

  it('exports dynamicParams = false', async () => {
    vi.resetModules()
    vi.doMock('@/lib/projects', () => ({ getAll: () => [], getProject: vi.fn() }))
    vi.doMock('@/lib/next-project', () => ({ getNextProject: () => null }))
    const mod = await import('@/app/(site)/projects/[slug]/page')
    expect(mod.dynamicParams).toBe(false)
  })
})
