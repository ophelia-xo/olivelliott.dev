// tests/content/schema.test.ts
import { readFileSync } from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { describe, expect, it } from 'vitest'
import { ProjectFrontmatterSchema } from '@/lib/schemas'

const FIXTURES = path.resolve(__dirname, '../fixtures/projects')

function loadFrontmatter(file: string) {
  const raw = readFileSync(path.join(FIXTURES, file), 'utf-8')
  return matter(raw).data
}

describe('ProjectFrontmatterSchema — acceptance', () => {
  it('parses valid-hero fixture into typed object with all fields', () => {
    const data = loadFrontmatter('valid-hero.mdx')
    const parsed = ProjectFrontmatterSchema.parse(data)
    expect(parsed.slug).toBe('valid-hero')
    expect(parsed.title).toBe('Valid Hero Fixture')
    expect(parsed.tier).toBe('hero')
    expect(parsed.visibility).toBe('public')
    expect(parsed.tags).toEqual(['local-first', 'open-source', 'typescript'])
    expect(parsed.year).toBe(2025)
    expect(parsed.order).toBe(10)
    expect(parsed.status).toBe('active')
    expect(parsed.links.repo).toBe('https://github.com/example/valid-hero')
    expect(parsed.hero).toEqual({
      src: '/images/projects/valid-hero/hero.png',
      alt: 'Placeholder hero image for the valid-hero fixture',
    })
  })

  it('applies defaults for order, status, stack, gallery, outcomes', () => {
    const data = {
      slug: 'minimal',
      title: 'Minimal',
      tagline: 't',
      year: 2025,
      tier: 'secondary' as const,
      visibility: 'public' as const,
      tags: ['typescript'],
      hero: { src: '/h.png', alt: 'h' },
      description: 'd',
    }
    const parsed = ProjectFrontmatterSchema.parse(data)
    expect(parsed.order).toBe(100)
    expect(parsed.status).toBe('active')
    expect(parsed.stack).toEqual([])
    expect(parsed.gallery).toEqual([])
    expect(parsed.outcomes).toEqual([])
    expect(parsed.links).toEqual({})
  })
})

describe('ProjectFrontmatterSchema — rejection', () => {
  it('rejects unknown tag from invalid-tag fixture', () => {
    const data = loadFrontmatter('invalid-tag.mdx')
    expect(() => ProjectFrontmatterSchema.parse(data)).toThrow(/tags/)
  })

  it('rejects uppercase slug', () => {
    const data = loadFrontmatter('valid-hero.mdx')
    expect(() =>
      ProjectFrontmatterSchema.parse({ ...data, slug: 'MyProject' }),
    ).toThrow(/slug/)
  })

  it('rejects outcomes with 6 items', () => {
    const data = loadFrontmatter('valid-hero.mdx')
    expect(() =>
      ProjectFrontmatterSchema.parse({
        ...data,
        outcomes: ['a', 'b', 'c', 'd', 'e', 'f'],
      }),
    ).toThrow()
  })

  it('rejects missing tier', () => {
    const { tier: _, ...noTier } = loadFrontmatter('valid-hero.mdx')
    expect(() => ProjectFrontmatterSchema.parse(noTier)).toThrow(/tier/)
  })

  it('rejects missing visibility', () => {
    const { visibility: _, ...noVis } = loadFrontmatter('valid-hero.mdx')
    expect(() => ProjectFrontmatterSchema.parse(noVis)).toThrow(/visibility/)
  })

  it('rejects tagline > 140 chars', () => {
    const data = loadFrontmatter('valid-hero.mdx')
    expect(() =>
      ProjectFrontmatterSchema.parse({ ...data, tagline: 'x'.repeat(141) }),
    ).toThrow()
  })

  it('rejects description > 160 chars', () => {
    const data = loadFrontmatter('valid-hero.mdx')
    expect(() =>
      ProjectFrontmatterSchema.parse({ ...data, description: 'x'.repeat(161) }),
    ).toThrow()
  })

  it('rejects year < 2000', () => {
    const data = loadFrontmatter('valid-hero.mdx')
    expect(() => ProjectFrontmatterSchema.parse({ ...data, year: 1999 })).toThrow()
  })

  it('rejects year > 2100', () => {
    const data = loadFrontmatter('valid-hero.mdx')
    expect(() => ProjectFrontmatterSchema.parse({ ...data, year: 2101 })).toThrow()
  })
})
