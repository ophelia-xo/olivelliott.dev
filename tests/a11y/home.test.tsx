// tests/a11y/home.test.tsx
// QAL-02 — / route a11y. Replaces Wave 0 placeholder.
//
// Renders <SiteLayout><HomePage /></SiteLayout> + axe(container). The (site)
// layout chrome (SkipLink + Nav + Footer) is the real launch surface, so we
// wrap the page in it to catch landmark / contrast / skip-link target issues.
//
// Motion mock (Pitfall 6): the / route transitively loads ThesisParagraph
// which is a 'use client' component importing motion/react. Without a Proxy
// mock here, LazyMotion strict (Phase 1 provider) hangs in jsdom. Pattern
// from tests/home/page.test.tsx (Plan 04-02) — reused verbatim.
//
// Mock @/lib/projects so the page renders deterministically — three hero +
// one secondary fixtures mirror the home composition shape.
import { render } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'

// Stub next/navigation — Nav's NavLink calls usePathname() (returns null in
// jsdom without this mock and trips a TypeError on pathname.startsWith).
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
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
  hero: {
    src: '/images/projects/myco/hero-placeholder.png',
    alt: 'Myco placeholder',
  },
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

describe('/ a11y (QAL-02)', () => {
  it('has zero axe violations', async () => {
    const { default: HomePage } = await import('@/app/(site)/page')
    const { default: SiteLayout } = await import('@/app/(site)/layout')
    const { container } = render(
      <SiteLayout>
        <HomePage />
      </SiteLayout>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
