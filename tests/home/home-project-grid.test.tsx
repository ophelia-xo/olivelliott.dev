// tests/home/home-project-grid.test.tsx
// HOM-02 + HOM-03 + HOM-04: <HomeProjectGrid> RSC composer.
//
// - Hero-tier projects → ProjectCardHero stack inside section[aria-labelledby="hero-eyebrow"]
//   with a <p id="hero-eyebrow">selected work</p>.
// - Secondary-tier projects → ProjectCardSecondary grid inside section[aria-labelledby="secondary-eyebrow"]
//   with a <p id="secondary-eyebrow">more work</p>.
// - When secondaryProjects is empty, the entire "more work" section is omitted
//   (HOM-03 conditional render — no "coming soon" placeholder, no empty grid).
// - Hairline divider <hr> separates hero block area from project grid.
//
// HomeProjectGrid is pure RSC. ProjectCardHero / ProjectCardSecondary are RSC.
// CardMeta is RSC. None import motion/react — no mock needed.
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HomeProjectGrid } from '@/components/home/home-project-grid'
import type { Project } from '@/lib/content'

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
  links: { repo: 'https://github.com/ophelia-xo/myco' },
  gallery: [],
  outcomes: ['outcome one'],
  description: 'Test fixture',
  body: '',
  hero: {
    src: '/images/projects/myco/hero-placeholder.png',
    alt: 'Myco placeholder',
  },
}

const myco = heroProjectBase as unknown as Project
const fathom = {
  ...heroProjectBase,
  slug: 'fathom',
  title: 'Fathom',
  order: 20,
} as unknown as Project
const agendaKeeper = {
  ...heroProjectBase,
  slug: 'agenda-keeper',
  title: 'Agenda Keeper',
  order: 30,
} as unknown as Project

const tradeBot = {
  ...heroProjectBase,
  slug: 'trade-bot',
  title: 'Trade Bot',
  tier: 'secondary' as const,
  order: 100,
} as unknown as Project
const stemz = {
  ...heroProjectBase,
  slug: 'stemz',
  title: 'Stemz',
  tier: 'secondary' as const,
  order: 110,
} as unknown as Project

describe('<HomeProjectGrid>', () => {
  it('renders 3 ProjectCardHero anchors inside section[aria-labelledby="hero-eyebrow"] with <p id="hero-eyebrow">selected work</p>', () => {
    const { container } = render(
      <HomeProjectGrid
        heroProjects={[myco, fathom, agendaKeeper]}
        secondaryProjects={[]}
      />,
    )
    const heroSection = container.querySelector('section[aria-labelledby="hero-eyebrow"]')
    expect(heroSection).not.toBeNull()
    const eyebrow = container.querySelector('p#hero-eyebrow')
    expect(eyebrow).not.toBeNull()
    expect(eyebrow?.textContent).toBe('selected work')

    // ProjectCardHero renders one <a> per card; the hero section should
    // contain exactly 3 anchors pointing to the three slugs.
    const cardLinks = Array.from(heroSection!.querySelectorAll('a'))
    expect(cardLinks.length).toBe(3)
    const hrefs = cardLinks.map((a) => a.getAttribute('href'))
    expect(hrefs).toEqual([
      '/projects/myco',
      '/projects/fathom',
      '/projects/agenda-keeper',
    ])
  })

  it('HOM-03: empty secondaryProjects → NO section[aria-labelledby="secondary-eyebrow"], no "more work" eyebrow, no empty grid', () => {
    const { container } = render(
      <HomeProjectGrid
        heroProjects={[myco, fathom, agendaKeeper]}
        secondaryProjects={[]}
      />,
    )
    expect(
      container.querySelector('section[aria-labelledby="secondary-eyebrow"]'),
    ).toBeNull()
    expect(container.querySelector('p#secondary-eyebrow')).toBeNull()
    expect(container.textContent).not.toContain('more work')
  })

  it('non-empty secondaryProjects → renders section + <p id="secondary-eyebrow">more work</p> + ProjectCardSecondary without hero prop', () => {
    const { container } = render(
      <HomeProjectGrid
        heroProjects={[myco]}
        secondaryProjects={[tradeBot, stemz]}
      />,
    )
    const secSection = container.querySelector('section[aria-labelledby="secondary-eyebrow"]')
    expect(secSection).not.toBeNull()
    const secEyebrow = container.querySelector('p#secondary-eyebrow')
    expect(secEyebrow).not.toBeNull()
    expect(secEyebrow?.textContent).toBe('more work')

    // Two secondary cards rendered, each is a single <a>.
    const secLinks = Array.from(secSection!.querySelectorAll('a'))
    expect(secLinks.length).toBe(2)
    expect(secLinks[0]?.getAttribute('href')).toBe('/projects/trade-bot')
    expect(secLinks[1]?.getAttribute('href')).toBe('/projects/stemz')

    // hero prop NOT set on home-page secondary cards — ProjectCardSecondary only
    // emits its mono "hero" prefix <p> when hero={true}. The presence of the
    // string "hero" inside the cards (other than tags/etc.) would indicate the
    // prop was passed. The secondary cards in this fixture have no tag "hero",
    // and the title is "Trade Bot"/"Stemz" — so a leading <p>hero</p> would be
    // detectable. Scan the children of each secondary anchor for that p.
    for (const link of secLinks) {
      const monoHeroLabel = Array.from(link.querySelectorAll('p')).find(
        (p) => p.textContent === 'hero',
      )
      expect(monoHeroLabel).toBeUndefined()
    }
  })

  it('renders a hairline <hr> with border-t + --color-hairline class between the hero block area and the project grid sections', () => {
    const { container } = render(
      <HomeProjectGrid
        heroProjects={[myco]}
        secondaryProjects={[tradeBot]}
      />,
    )
    const hrs = Array.from(container.querySelectorAll('hr'))
    expect(hrs.length).toBeGreaterThanOrEqual(1)
    const cls = hrs[0]!.getAttribute('class') ?? ''
    expect(cls).toContain('border-t')
    expect(cls).toContain('--color-hairline')
  })
})
