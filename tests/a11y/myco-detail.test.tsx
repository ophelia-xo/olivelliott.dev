// tests/a11y/myco-detail.test.tsx
// QAL-02 — /projects/myco route a11y. Replaces Wave 0 placeholder.
//
// Async RSC route — Pitfall 5 await-then-render. slug='myco' is the only
// MDX on disk at Phase 6 time; vitest.config.ts's mdxShimPlugin returns a
// no-op default for any .mdx id so the MDX body renders as empty. That's
// fine — the page chrome (ProjectHero, ProjectMeta, NextProjectBlock) renders
// fully and is where ARIA / contrast lives.
//
// Motion mock needed: the page composes <NextProjectBlock> which loads
// <NextProjectTitle> ('use client' + motion/react). Also SiteLayout wraps
// MotionProvider. Both require the stub.
//
// Mock @/lib/projects with a public Myco fixture (so links.repo flows through)
// and @/lib/next-project so the "browse all projects" nav renders.
import { render } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'

// Stub next/navigation — Nav's NavLink calls usePathname() (returns null in
// jsdom without this mock and trips a TypeError on pathname.startsWith).
// Per-test vi.doMock for notFound is below in beforeEach (none here).
vi.mock('next/navigation', () => ({
  usePathname: () => '/projects/myco',
  notFound: () => {
    throw new Error('notFound() should not be called for the myco fixture')
  },
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

const mycoProject = {
  slug: 'myco',
  title: 'Myco',
  tagline: 'A persistent cognitive layer.',
  year: 2025,
  tier: 'hero' as const,
  order: 10,
  status: 'active' as const,
  visibility: 'public' as const,
  tags: ['local-first', 'autonomous', 'open-source'] as const,
  stack: ['TypeScript'],
  links: { repo: 'https://github.com/ophelia-xo/myco' },
  hero: { src: '/images/projects/myco/hero-placeholder.png', alt: 'Myco hero' },
  gallery: [],
  outcomes: ['outcome one'],
  description: 'A local-first MCP server.',
}

beforeEach(() => {
  vi.resetModules()
  vi.doMock('@/lib/projects', () => ({
    getAll: () => [mycoProject],
    getHeroProjects: () => [mycoProject],
    getProject: (slug: string) =>
      slug === 'myco' ? mycoProject : undefined,
    getAllTags: () => [],
    getProjectsByTag: () => [],
  }))
  vi.doMock('@/lib/next-project', () => ({ getNextProject: () => null }))
})

describe('/projects/myco a11y (QAL-02)', () => {
  it('has zero axe violations', async () => {
    const { default: Page } = await import('@/app/(site)/projects/[slug]/page')
    const { default: SiteLayout } = await import('@/app/(site)/layout')
    const ui = await Page({ params: Promise.resolve({ slug: 'myco' }) })
    const { container } = render(<SiteLayout>{ui}</SiteLayout>)
    expect(await axe(container)).toHaveNoViolations()
  })
})
