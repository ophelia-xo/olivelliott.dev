// tests/projects/project-card-hero.test.tsx
// Pitfall 3 + 12 regression lock: card has exactly ONE <a> wrapper; chips are <span>.
// Refs: 04-UI-SPEC § Component Inventory #4, 04-RESEARCH § Open Question #3 (no priority).
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ProjectCardHero } from '@/components/projects/project-card-hero'
import type { Project } from '@/lib/content'

const baseProject = {
  slug: 'myco',
  title: 'Myco',
  tagline: 'A persistent cognitive layer for AI agents.',
  year: 2025,
  tier: 'hero' as const,
  order: 10,
  status: 'active' as const,
  visibility: 'public' as const,
  tags: ['local-first', 'typescript'] as const,
  stack: ['TypeScript'],
  links: { repo: 'https://github.com/olivelliott/myco' },
  gallery: [],
  outcomes: ['outcome one', 'outcome two', 'outcome three', 'outcome four', 'outcome five'],
  description: 'Test fixture',
  body: '',
} satisfies Partial<Project>

const placeholderHeroProject = {
  ...baseProject,
  hero: {
    src: '/images/projects/myco/hero-placeholder.png',
    alt: 'Myco placeholder',
  },
} as unknown as Project

const imageHeroProject = {
  ...baseProject,
  slug: 'fathom',
  title: 'Fathom',
  hero: {
    src: '/images/projects/fathom/hero.png',
    alt: 'Fathom cover artwork',
  },
} as unknown as Project

const privateProject = {
  ...baseProject,
  slug: 'aktiga',
  title: 'Aktiga',
  visibility: 'private' as const,
  tags: ['typescript', 'code-private'] as const,
  links: {},
  hero: {
    src: '/images/projects/aktiga/hero-placeholder.png',
    alt: 'Aktiga placeholder',
  },
} as unknown as Project

const noOutcomesProject = {
  ...baseProject,
  outcomes: [],
  hero: {
    src: '/images/projects/myco/hero-placeholder.png',
    alt: 'Myco placeholder',
  },
} as unknown as Project

describe('<ProjectCardHero>', () => {
  it('NESTED-ANCHOR LOCK (Pitfall 3): exactly ONE <a> wrapper — image-present branch', () => {
    const { container } = render(<ProjectCardHero project={imageHeroProject} />)
    const anchors = container.querySelectorAll('a')
    expect(anchors.length).toBe(1)
    expect(anchors[0]?.getAttribute('href')).toBe('/projects/fathom')
  })

  it('NESTED-ANCHOR LOCK (Pitfall 3): exactly ONE <a> wrapper — text-only branch', () => {
    const { container } = render(<ProjectCardHero project={placeholderHeroProject} />)
    const anchors = container.querySelectorAll('a')
    expect(anchors.length).toBe(1)
    expect(anchors[0]?.getAttribute('href')).toBe('/projects/myco')
  })

  it('renders the project title as <h2>', () => {
    const { container } = render(<ProjectCardHero project={imageHeroProject} />)
    const h2s = container.querySelectorAll('h2')
    expect(h2s.length).toBe(1)
    expect(h2s[0]?.textContent).toBe('Fathom')
  })

  it('image-present branch (hero.src is NOT a placeholder): renders one <img> with alt', () => {
    const { container } = render(<ProjectCardHero project={imageHeroProject} />)
    const imgs = container.querySelectorAll('img')
    expect(imgs.length).toBeGreaterThanOrEqual(1)
    const img = imgs[0]!
    expect(img.getAttribute('alt')).toBe('Fathom cover artwork')
  })

  it('text-only branch (isPlaceholderHero match): renders ZERO <img>', () => {
    const { container } = render(<ProjectCardHero project={placeholderHeroProject} />)
    expect(container.querySelectorAll('img').length).toBe(0)
  })

  it('outcomes cap: with 5 outcomes, renders EXACTLY 3 <li> elements', () => {
    const { container } = render(<ProjectCardHero project={placeholderHeroProject} />)
    const lis = container.querySelectorAll('li')
    expect(lis.length).toBe(3)
    expect(lis[0]?.textContent).toContain('outcome one')
    expect(lis[1]?.textContent).toContain('outcome two')
    expect(lis[2]?.textContent).toContain('outcome three')
  })

  it('outcomes empty: renders NO <ul>', () => {
    const { container } = render(<ProjectCardHero project={noOutcomesProject} />)
    expect(container.querySelectorAll('ul').length).toBe(0)
  })

  it('outcome glyph: each <li> contains an aria-hidden="true" span with →', () => {
    const { container } = render(<ProjectCardHero project={placeholderHeroProject} />)
    const lis = Array.from(container.querySelectorAll('li'))
    expect(lis.length).toBe(3)
    for (const li of lis) {
      const glyph = li.querySelector('span[aria-hidden="true"]')
      expect(glyph).not.toBeNull()
      expect(glyph?.textContent).toBe('→')
    }
  })

  it('PRIVACY: private project renders "code private" label and ONE anchor (wrapper only), no repo URL', () => {
    const { container } = render(<ProjectCardHero project={privateProject} />)
    expect(container.textContent).toContain('code private')
    const anchors = Array.from(container.querySelectorAll('a'))
    expect(anchors.length).toBe(1)
    // Wrapper is the project detail page, never a repo URL
    expect(anchors[0]?.getAttribute('href')).toBe('/projects/aktiga')
    // Defensive: no anchor with any github.com href
    expect(anchors.some((a) => a.getAttribute('href')?.includes('github.com'))).toBe(false)
  })

  it('renders the project tagline as a <p>', () => {
    const { container } = render(<ProjectCardHero project={imageHeroProject} />)
    const p = Array.from(container.querySelectorAll('p')).find(
      (el) => el.textContent === baseProject.tagline,
    )
    expect(p).toBeDefined()
  })
})
