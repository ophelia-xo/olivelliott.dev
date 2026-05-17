// tests/a11y/about.test.tsx
// QAL-02 — /about route a11y. Replaces Wave 0 placeholder.
//
// Sync RSC route inside SiteLayout. /about ships zero motion islands of its
// own (Phase 5 PHASE_SOURCES Test 9 lock), but SiteLayout wraps MotionProvider
// which requires the motion/react stub to load in jsdom.
//
// @/lib/projects mocked so ProjectPillRow (composed inside AboutPage's "what
// I'm working on" section) renders deterministically with two hero pills.
import { render } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'

// Stub next/navigation — Nav's NavLink calls usePathname() (returns null in
// jsdom without this mock and trips a TypeError on pathname.startsWith).
vi.mock('next/navigation', () => ({
  usePathname: () => '/about',
}))

vi.mock('motion/react', () => {
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

const heroProjectBase = {
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
const fixtures = [
  heroProjectBase,
  { ...heroProjectBase, slug: 'fathom', title: 'Fathom', order: 20 },
  {
    ...heroProjectBase,
    slug: 'agenda-keeper',
    title: 'Agenda Keeper',
    order: 30,
  },
]

vi.mock('@/lib/projects', () => ({
  getAll: () => fixtures,
  getHeroProjects: () => fixtures,
  getAllTags: () => [],
  getProjectsByTag: () => [],
}))

describe('/about a11y (QAL-02)', () => {
  it('has zero axe violations', async () => {
    const { default: AboutPage } = await import('@/app/(site)/about/page')
    const { default: SiteLayout } = await import('@/app/(site)/layout')
    const { container } = render(
      <SiteLayout>
        <AboutPage />
      </SiteLayout>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
