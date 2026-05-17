// tests/projects/project-card-secondary.test.tsx
// Refs: 04-UI-SPEC § Component Inventory #5; 04-RESEARCH § Component Split Recommendation.
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ProjectCardSecondary } from '@/components/projects/project-card-secondary'
import type { Project } from '@/lib/content'

const baseProject = {
  slug: 'trade-bot',
  title: 'Trade Bot',
  tagline: 'A small automated portfolio sentinel.',
  year: 2024,
  tier: 'secondary' as const,
  order: 30,
  status: 'active' as const,
  visibility: 'public' as const,
  tags: ['python', 'cli'] as const,
  stack: ['Python'],
  links: { repo: 'https://github.com/olivelliott/trade-bot' },
  gallery: [],
  // Even with outcomes present, the secondary card MUST NOT render them.
  outcomes: ['shipped to prod', 'doubled throughput'],
  description: 'Test fixture',
  body: '',
  hero: {
    // Even with a real artwork path, the secondary card MUST NOT render an <img>.
    src: '/images/projects/trade-bot/hero.png',
    alt: 'Trade Bot cover',
  },
} as unknown as Project

const privateProject = {
  ...baseProject,
  slug: 'aktiga',
  title: 'Aktiga',
  visibility: 'private' as const,
  tags: ['typescript', 'code-private'] as const,
  links: {},
} as unknown as Project

describe('<ProjectCardSecondary>', () => {
  it('NESTED-ANCHOR LOCK: exactly ONE <a> wrapper', () => {
    const { container } = render(<ProjectCardSecondary project={baseProject} />)
    const anchors = container.querySelectorAll('a')
    expect(anchors.length).toBe(1)
  })

  it('renders title as <h3> (NOT <h2>)', () => {
    const { container } = render(<ProjectCardSecondary project={baseProject} />)
    expect(container.querySelectorAll('h3').length).toBe(1)
    expect(container.querySelectorAll('h2').length).toBe(0)
    expect(container.querySelector('h3')?.textContent).toBe('Trade Bot')
  })

  it('renders NO outcomes <ul> AND NO <img> regardless of project content (CardMeta <ul role="list"> is the only ul)', () => {
    // Phase 6 Plan 06-03 (QAL-02): CardMeta now renders <ul role="list">,
    // so the secondary card always has exactly one <ul> (the metadata list).
    // The outcomes <ul> — which is what this test originally guarded — has
    // NO role attribute, so we assert zero ul:not([role="list"]).
    const { container } = render(<ProjectCardSecondary project={baseProject} />)
    expect(container.querySelectorAll('ul:not([role="list"])').length).toBe(0)
    expect(container.querySelectorAll('img').length).toBe(0)
  })

  it('hero prefix prop ON: renders <p> with text "hero" BEFORE the <h3> title (mono + tertiary)', () => {
    const { container } = render(<ProjectCardSecondary project={baseProject} hero />)
    const root = container.firstElementChild as HTMLElement
    const children = Array.from(root.children)
    // First child must be the hero prefix <p>
    expect(children[0]?.tagName).toBe('P')
    expect(children[0]?.textContent).toBe('hero')
    expect(children[0]?.className).toContain('font-mono')
    expect(children[0]?.className).toContain('text-[color:var(--color-text-tertiary)]')
    // Second child must be the title
    expect(children[1]?.tagName).toBe('H3')
  })

  it('hero prefix prop OFF (default): NO <p> with text "hero" precedes the title', () => {
    const { container } = render(<ProjectCardSecondary project={baseProject} />)
    const ps = Array.from(container.querySelectorAll('p'))
    const heroP = ps.find((p) => p.textContent?.trim() === 'hero')
    expect(heroP).toBeUndefined()
  })

  it('hero prefix prop explicitly false: NO <p> with text "hero" precedes the title', () => {
    const { container } = render(<ProjectCardSecondary project={baseProject} hero={false} />)
    const ps = Array.from(container.querySelectorAll('p'))
    const heroP = ps.find((p) => p.textContent?.trim() === 'hero')
    expect(heroP).toBeUndefined()
  })

  it('PRIVACY: private project renders "code private" label via CardMeta and ONE anchor (wrapper only)', () => {
    const { container } = render(<ProjectCardSecondary project={privateProject} />)
    expect(container.textContent).toContain('code private')
    const anchors = Array.from(container.querySelectorAll('a'))
    expect(anchors.length).toBe(1)
    expect(anchors[0]?.getAttribute('href')).toBe('/projects/aktiga')
    // Defensive: no github.com link
    expect(anchors.some((a) => a.getAttribute('href')?.includes('github.com'))).toBe(false)
  })

  it('renders the tagline as a <p>', () => {
    const { container } = render(<ProjectCardSecondary project={baseProject} />)
    const p = Array.from(container.querySelectorAll('p')).find(
      (el) => el.textContent === baseProject.tagline,
    )
    expect(p).toBeDefined()
  })

  it('wrapper <a> href is /projects/{slug}', () => {
    const { container } = render(<ProjectCardSecondary project={baseProject} />)
    const wrapper = container.querySelector('a')!
    expect(wrapper.getAttribute('href')).toBe('/projects/trade-bot')
  })
})
