// tests/projects/page.test.tsx
// PRJ-01 + PRJ-06 integration. Mocks @/lib/projects and the dynamic .mdx import
// (per Pitfall 12 — Vitest cannot process .mdx natively).
//
// Also mocks motion/react (the page composes <NextProjectBlock> which transitively
// loads <NextProjectTitle> client island; LazyMotion strict hangs in jsdom without
// a provider — see tests/projects/next-project-block.test.tsx for rationale).
import { render } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'

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
  return { m: proxy }
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
  tags: ['local-first', 'typescript'] as const,
  stack: [],
  links: { repo: 'https://github.com/olivelliott/myco' },
  hero: { src: '/images/projects/myco/hero-placeholder.png', alt: 'a' },
  gallery: [],
  outcomes: [],
  description: 'A local-first MCP server.',
}

const privateFixture = {
  slug: 'valid-private',
  title: 'Valid Private Fixture',
  tagline: 'Test fixture.',
  year: 2025,
  tier: 'secondary' as const,
  order: 20,
  status: 'active' as const,
  visibility: 'private' as const,
  tags: ['typescript', 'code-private'] as const,
  stack: [],
  links: {}, // schema stripped repo
  hero: { src: '/images/projects/valid-private/hero.png', alt: 'a' },
  gallery: [],
  outcomes: [],
  description: 'Private fixture.',
}

// Stub MDX module — content is irrelevant for composition tests.
const StubMDX = () => null

describe('app/(site)/projects/[slug]/page.tsx — render', () => {
  it('PRJ-01 valid slug: renders <article> containing <ProjectHero> and <NextProjectBlock>', async () => {
    vi.resetModules()
    vi.doMock('@/lib/projects', () => ({
      getAll: () => [mycoProject],
      getProject: (slug: string) => (slug === 'myco' ? mycoProject : undefined),
    }))
    vi.doMock('@/lib/next-project', () => ({ getNextProject: () => null }))
    vi.doMock('@/content/projects/myco.mdx', () => ({ default: StubMDX }))
    const { default: Page } = await import('@/app/(site)/projects/[slug]/page')
    const ui = await Page({ params: Promise.resolve({ slug: 'myco' }) })
    const { container } = render(ui)
    expect(container.querySelector('article')).not.toBeNull()
    // ProjectHero composition signal — meta row
    expect(
      container.querySelector('[role="list"][aria-label="Project metadata"]'),
    ).not.toBeNull()
    // NextProjectBlock signal (single-project variant since corpus is just Myco)
    const nav = container.querySelector('nav[aria-label="Browse all projects"]')
    expect(nav).not.toBeNull()
  })

  it('PRJ-01 unknown slug: page calls notFound()', async () => {
    const notFoundSpy = vi.fn(() => {
      throw new Error('NEXT_NOT_FOUND')
    })
    vi.resetModules()
    vi.doMock('next/navigation', () => ({ notFound: notFoundSpy }))
    vi.doMock('@/lib/projects', () => ({
      getAll: () => [mycoProject],
      getProject: () => undefined,
    }))
    vi.doMock('@/lib/next-project', () => ({ getNextProject: () => null }))
    const { default: Page } = await import('@/app/(site)/projects/[slug]/page')
    await expect(
      Page({ params: Promise.resolve({ slug: 'does-not-exist' }) }),
    ).rejects.toThrow('NEXT_NOT_FOUND')
    expect(notFoundSpy).toHaveBeenCalledOnce()
  })

  it('PRJ-06 integration: private project renders "code private" + zero anchors with the would-be repo URL', async () => {
    // The page route does `await import(\`@/content/projects/${slug}.mdx\`)`,
    // and Vite's dynamic-import-helper only resolves slugs that physically
    // exist on disk. valid-private.mdx is a *fixture* under tests/fixtures/,
    // not a real /content/projects/ entry. So we route through slug='myco'
    // (the only physical .mdx in /content/projects/) but mock getProject to
    // return the private-fixture-shaped project. What the test actually
    // verifies is the privacy rendering contract (ProjectMeta + TagChipRow
    // composition through the page) — the MDX body content is stubbed via
    // the vitest mdxShimPlugin and irrelevant here.
    vi.resetModules()
    vi.doMock('@/lib/projects', () => ({
      getAll: () => [privateFixture],
      getProject: () => privateFixture,
    }))
    vi.doMock('@/lib/next-project', () => ({ getNextProject: () => null }))
    const { default: Page } = await import('@/app/(site)/projects/[slug]/page')
    const ui = await Page({ params: Promise.resolve({ slug: 'myco' }) })
    const { container } = render(ui)
    // Literal "code private" present
    expect(container.textContent).toContain('code private')
    // No anchor pointing at the would-be repo URL
    const anchors = Array.from(container.querySelectorAll('a'))
    expect(
      anchors.find((a) => a.getAttribute('href')?.includes('example/valid-private')),
    ).toBeUndefined()
    // Tag chip 'code-private' is still present (auto-added by schema; chip row renders)
    expect(
      anchors.some((a) => a.getAttribute('href') === '/projects?tag=code-private'),
    ).toBe(true)
  })
})
