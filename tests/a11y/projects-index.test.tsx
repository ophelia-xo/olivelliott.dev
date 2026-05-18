// tests/a11y/projects-index.test.tsx
// QAL-02 — /projects route a11y. Replaces Wave 0 placeholder.
//
// Async RSC route — Pitfall 5 await-then-render pattern (verbatim from
// tests/projects/index-page.test.tsx). Wrapped in <SiteLayout> for the full
// public surface (Nav, Footer, SkipLink) so axe catches landmark / contrast
// issues across the whole document, not just the page body.
//
// Motion mock kept even though /projects itself ships no motion island —
// SiteLayout transitively loads MotionProvider (LazyMotion strict) which
// requires a `motion/react` stub in jsdom or it hangs.
import { render } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'

// Stub next/navigation — Nav's NavLink calls usePathname() (returns null in
// jsdom without this mock and trips a TypeError on pathname.startsWith).
vi.mock('next/navigation', () => ({
  usePathname: () => '/projects',
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
  tags: ['local-first', 'autonomous'] as const,
  stack: [],
  links: { repo: 'https://github.com/ophelia-xo/myco' },
  hero: { src: '/images/projects/myco/hero-placeholder.png', alt: 'Myco' },
  gallery: [],
  outcomes: [],
  description: 'd',
}
const fixtures = [
  heroProjectBase,
  { ...heroProjectBase, slug: 'fathom', title: 'Fathom', tier: 'hero' as const },
  {
    ...heroProjectBase,
    slug: 'trade-bot',
    title: 'Trade Bot',
    tier: 'secondary' as const,
  },
]

vi.mock('@/lib/projects', () => ({
  getAll: () => fixtures,
  getHeroProjects: () => fixtures.filter((p) => p.tier === 'hero'),
  getAllTags: () => [
    { tag: 'local-first', count: 3 },
    { tag: 'autonomous', count: 3 },
  ],
  getProjectsByTag: (tag: string) =>
    fixtures.filter((p) => (p.tags as readonly string[]).includes(tag)),
}))

describe('/projects a11y (QAL-02)', () => {
  it('has zero axe violations', async () => {
    const { default: Page } = await import('@/app/(site)/projects/page')
    const { default: SiteLayout } = await import('@/app/(site)/layout')
    const ui = await Page({ searchParams: Promise.resolve({}) })
    const { container } = render(<SiteLayout>{ui}</SiteLayout>)
    expect(await axe(container)).toHaveNoViolations()
  })
})
