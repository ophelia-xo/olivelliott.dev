// tests/content/tag-index.test.ts
// Unit tests for the lib/projects query API. We can't control the real
// module-level `allProjects` (loaded from content/projects/), so we vi.mock
// @/lib/content with an in-memory fixture array, then import @/lib/projects
// after the mock is registered — the query helpers bind to the mocked source.
import { describe, expect, it, vi } from 'vitest'
import type { Project } from '@/lib/content'

function makeProject(
  overrides: Partial<Project> &
    Pick<Project, 'slug' | 'title' | 'tier' | 'visibility' | 'tags'>,
): Project {
  return {
    order: 100,
    status: 'active',
    year: 2025,
    tagline: 'test',
    stack: [],
    links: {},
    hero: { src: '/h.png', alt: 'h' },
    gallery: [],
    outcomes: [],
    description: 'test',
    body: 'body',
    ...overrides,
  } as Project
}

const FIXTURES: readonly Project[] = [
  // order 10, hero, active, tags: [local-first, ai, typescript]
  makeProject({
    slug: 'alpha',
    title: 'Alpha',
    tier: 'hero',
    order: 10,
    status: 'active',
    visibility: 'public',
    tags: ['local-first', 'ai', 'typescript'],
  }),
  // order 20, secondary, active, tags: [ai, agents]
  makeProject({
    slug: 'beta',
    title: 'Beta',
    tier: 'secondary',
    order: 20,
    status: 'active',
    visibility: 'public',
    tags: ['ai', 'agents'],
  }),
  // order 5, secondary, archived — must be excluded from getAll / getAllTags / getProjectsByTag
  makeProject({
    slug: 'gamma',
    title: 'Gamma',
    tier: 'secondary',
    order: 5,
    status: 'archived',
    visibility: 'public',
    tags: ['typescript', 'saas'],
  }),
  // order 15, hero, active, tags: [local-first, open-source]
  makeProject({
    slug: 'delta',
    title: 'Delta',
    tier: 'hero',
    order: 15,
    status: 'active',
    visibility: 'public',
    tags: ['local-first', 'open-source'],
  }),
]

vi.mock('@/lib/content', () => ({
  allProjects: FIXTURES,
  _loadForTests: () => FIXTURES,
}))

// Import AFTER vi.mock so module binds to mocked allProjects
const {
  getAll,
  getHeroProjects,
  getProject,
  getAllTags,
  getProjectsByTag,
  getRelatedProjects,
} = await import('@/lib/projects')

describe('getAll', () => {
  it('excludes archived projects', () => {
    const slugs = getAll().map((p) => p.slug)
    expect(slugs).not.toContain('gamma')
  })

  it('sorts by order ascending', () => {
    const orders = getAll().map((p) => p.order)
    expect(orders).toEqual([...orders].sort((a, b) => a - b))
  })

  it('includes active hero + secondary', () => {
    expect(getAll()).toHaveLength(3)
  })
})

describe('getHeroProjects', () => {
  it('returns only tier:hero entries', () => {
    const heroes = getHeroProjects()
    expect(heroes.map((p) => p.slug).sort()).toEqual(['alpha', 'delta'])
  })
})

describe('getProject', () => {
  it('returns matching project by slug', () => {
    expect(getProject('alpha')?.slug).toBe('alpha')
  })

  it('returns archived project when queried by slug directly', () => {
    // getProject uses allProjects, not getAll() — archived slug lookup should still work
    expect(getProject('gamma')?.slug).toBe('gamma')
  })

  it('returns undefined for unknown slug', () => {
    expect(getProject('nope')).toBeUndefined()
  })
})

describe('getAllTags', () => {
  it('counts tag occurrences across non-archived projects', () => {
    const tags = getAllTags()
    const map = new Map(tags.map((t) => [t.tag, t.count]))
    // alpha: [local-first, ai, typescript]
    // beta: [ai, agents]
    // delta: [local-first, open-source]
    // gamma excluded (archived)
    expect(map.get('ai')).toBe(2)
    expect(map.get('local-first')).toBe(2)
    expect(map.get('typescript')).toBe(1)
    expect(map.get('open-source')).toBe(1)
    expect(map.get('agents')).toBe(1)
    expect(map.get('saas')).toBeUndefined() // only in archived gamma
  })

  it('sorts by count desc, then tag alphabetically asc', () => {
    const tags = getAllTags()
    // count-2 tags come before count-1 tags
    const firstGroup = tags.filter((t) => t.count === 2).map((t) => t.tag)
    expect(firstGroup).toEqual(['ai', 'local-first']) // alphabetical within count
  })
})

describe('getProjectsByTag', () => {
  it('returns only projects whose tags include the given tag', () => {
    const ai = getProjectsByTag('ai')
      .map((p) => p.slug)
      .sort()
    expect(ai).toEqual(['alpha', 'beta'])
  })

  it('returns empty array for tag not used by any active project', () => {
    expect(getProjectsByTag('cli')).toEqual([])
  })

  it('excludes archived projects', () => {
    // gamma has 'typescript' but is archived; alpha has 'typescript' and is active
    const ts = getProjectsByTag('typescript').map((p) => p.slug)
    expect(ts).toEqual(['alpha'])
  })
})

describe('getRelatedProjects', () => {
  it('scores by overlapping-tag count, excludes self, excludes score=0', () => {
    // alpha tags: [local-first, ai, typescript]
    // beta tags:  [ai, agents]                → score 1 (ai)
    // delta tags: [local-first, open-source]  → score 1 (local-first)
    // gamma archived → excluded from getAll before scoring
    const related = getRelatedProjects('alpha')
    const slugs = related.map((p) => p.slug).sort()
    expect(slugs).toEqual(['beta', 'delta'])
  })

  it('respects limit parameter', () => {
    const related = getRelatedProjects('alpha', 1)
    expect(related).toHaveLength(1)
  })

  it('returns empty array for unknown slug', () => {
    expect(getRelatedProjects('nope')).toEqual([])
  })

  it('excludes self from results', () => {
    const related = getRelatedProjects('beta')
    expect(related.map((p) => p.slug)).not.toContain('beta')
  })
})
