// tests/projects/next-project-block.test.tsx
// Refs: 03-UI-SPEC § Component Inventory #9 (NextProjectBlock) + § Copywriting Contract.
//
// Mocks motion/react: LazyMotion strict (Phase 1's MotionProvider) requires the
// provider in the React tree before <m.*> can resolve features. In jsdom without
// the provider mount, rendering <m.h2> hangs (no error, no resolve). The test
// scope here is the RSC composition + props contract, not the motion behavior;
// the motion island's wiring is verified by source-assertion in plan 03-03 and
// the visual sanity pass on /projects/myco. So we mock motion/react to expose
// `m` as a plain HTML proxy that strips motion-only props (whileHover, transition).
import { render, within } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('motion/react', () => {
  const proxy = new Proxy(
    {},
    {
      get: (_target, tag: string) => {
        const Comp = ({
          children,
          // strip motion-only props before forwarding to the host element
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

import { NextProjectBlock } from '@/components/projects/next-project-block'

describe('<NextProjectBlock>', () => {
  it('multi-project variant: <nav aria-label="Next project"> with eyebrow + linked title + tagline', () => {
    const { container } = render(
      <NextProjectBlock
        next={{ slug: 'fathom', title: 'Fathom', tagline: 'Local-first weather app.' }}
      />,
    )
    const nav = container.querySelector('nav')!
    expect(nav.getAttribute('aria-label')).toBe('Next project')
    const link = nav.querySelector('a')!
    expect(link.getAttribute('href')).toBe('/projects/fathom')
    const linkScope = within(link)
    expect(linkScope.getByText('next →')).toBeTruthy()
    expect(linkScope.getByText('Fathom')).toBeTruthy()
    expect(linkScope.getByText('Local-first weather app.')).toBeTruthy()
  })

  it('multi-project variant: eyebrow + title + tagline are all inside the SAME <a>', () => {
    const { container } = render(
      <NextProjectBlock next={{ slug: 'fathom', title: 'Fathom', tagline: 'tag.' }} />,
    )
    const anchors = Array.from(container.querySelectorAll('a'))
    expect(anchors.length).toBe(1)
  })

  it('single-project variant (next=null): <nav aria-label="Browse all projects"> linking to /projects', () => {
    const { container } = render(<NextProjectBlock next={null} />)
    const nav = container.querySelector('nav')!
    expect(nav.getAttribute('aria-label')).toBe('Browse all projects')
    const link = nav.querySelector('a')!
    expect(link.getAttribute('href')).toBe('/projects')
    const linkScope = within(link)
    expect(linkScope.getByText('all projects →')).toBeTruthy()
    expect(linkScope.getByText('Browse all projects')).toBeTruthy()
    expect(
      linkScope.getByText(
        'More work, including private case studies and secondary projects.',
      ),
    ).toBeTruthy()
  })

  it('hairline divider above + pt-12 vertical padding (both variants)', () => {
    for (const next of [
      { slug: 'fathom', title: 'Fathom', tagline: 't.' },
      null,
    ] as const) {
      const { container } = render(<NextProjectBlock next={next} />)
      const nav = container.querySelector('nav')!
      expect(nav.className).toMatch(/\bborder-t\b/)
      expect(nav.className).toMatch(/border-\[color:var\(--color-hairline\)\]/)
      expect(nav.className).toMatch(/\bpt-12\b/)
    }
  })

  it('the link element has focus-visible:outline-offset-4 (large-title 4px offset override)', () => {
    const { container } = render(<NextProjectBlock next={null} />)
    const link = container.querySelector('a')!
    expect(link.className).toMatch(/focus-visible:outline-offset-4/)
  })

  it('both variants render a title element with the next title text', () => {
    const { container: a } = render(
      <NextProjectBlock next={{ slug: 'fathom', title: 'Fathom', tagline: 't.' }} />,
    )
    expect(a.textContent).toContain('Fathom')
    const { container: b } = render(<NextProjectBlock next={null} />)
    expect(b.textContent).toContain('Browse all projects')
  })
})
