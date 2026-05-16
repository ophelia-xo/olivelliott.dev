// tests/home/home-hero.test.tsx
// HOM-01: <HomeHero> RSC composer — wordmark + role frame + ThesisParagraph slot.
//
// The wordmark is the SINGLE <h1> per route. Typography for the thesis is owned
// by HomeHero (className prop), not ThesisParagraph internally (RESEARCH Q2).
//
// HomeHero transitively loads <ThesisParagraph> ('use client'), so the test file
// reinstalls the Pitfall-8 motion mock: BOTH `m` AND `useReducedMotion` exposed.
// `useReducedMotion` returns null so we render the SSR-shape plain <p>.
import { render } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

function mockMotion(useReducedMotionReturn: boolean | null) {
  vi.doMock('motion/react', () => {
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
            transition: _tt,
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
      useReducedMotion: () => useReducedMotionReturn,
    }
  })
}

beforeEach(() => {
  vi.resetModules()
})

describe('<HomeHero>', () => {
  it('renders exactly one <h1 id="hero-wordmark"> with the wordmark text inside section[aria-labelledby="hero-wordmark"]', async () => {
    mockMotion(null)
    const { HomeHero } = await import('@/components/home/home-hero')
    const { container } = render(
      <HomeHero
        wordmark="olive elliott"
        roleFrame="engineer · autonomous workflows · local-first systems"
        thesis="lorem"
      />,
    )
    const h1s = container.querySelectorAll('h1')
    expect(h1s.length).toBe(1)
    const h1 = h1s[0]!
    expect(h1.getAttribute('id')).toBe('hero-wordmark')
    expect(h1.textContent).toBe('olive elliott')
    const section = container.querySelector('section[aria-labelledby="hero-wordmark"]')
    expect(section).not.toBeNull()
    expect(section?.contains(h1)).toBe(true)
  })

  it('renders the role frame as a <p> with the exact prop text, secondary color, and max-w-[55ch]', async () => {
    mockMotion(null)
    const { HomeHero } = await import('@/components/home/home-hero')
    const ROLE = 'engineer · autonomous workflows · local-first systems'
    const { container } = render(
      <HomeHero wordmark="olive elliott" roleFrame={ROLE} thesis="lorem" />,
    )
    const ps = Array.from(container.querySelectorAll('p'))
    const roleP = ps.find((p) => p.textContent === ROLE)
    expect(roleP).toBeDefined()
    const cls = roleP!.getAttribute('class') ?? ''
    expect(cls).toContain('--color-text-secondary')
    expect(cls).toContain('max-w-[55ch]')
  })

  it('ThesisParagraph slot renders the thesis as a <p> AFTER the role frame in DOM order (SSR-fallback shape)', async () => {
    mockMotion(null) // SSR-fallback shape: plain <p>{thesis}</p>
    const { HomeHero } = await import('@/components/home/home-hero')
    const ROLE = 'engineer · autonomous workflows · local-first systems'
    const THESIS = 'a sentence of thesis copy here'
    const { container } = render(
      <HomeHero wordmark="olive elliott" roleFrame={ROLE} thesis={THESIS} />,
    )
    const ps = Array.from(container.querySelectorAll('p'))
    const roleIdx = ps.findIndex((p) => p.textContent === ROLE)
    const thesisIdx = ps.findIndex((p) => p.textContent === THESIS)
    expect(roleIdx).toBeGreaterThanOrEqual(0)
    expect(thesisIdx).toBeGreaterThan(roleIdx)
  })

  it('renders exactly ONE <h1> in the rendered tree', async () => {
    mockMotion(null)
    const { HomeHero } = await import('@/components/home/home-hero')
    const { container } = render(
      <HomeHero
        wordmark="olive elliott"
        roleFrame="engineer · autonomous workflows · local-first systems"
        thesis="lorem ipsum dolor"
      />,
    )
    expect(container.querySelectorAll('h1').length).toBe(1)
  })

  it('ThesisParagraph receives typography className from HomeHero (NOT owned internally): class string on thesis <p> contains max-w-[55ch] AND mt-6', async () => {
    mockMotion(null)
    const { HomeHero } = await import('@/components/home/home-hero')
    const THESIS = 'a unique thesis paragraph string for this test'
    const { container } = render(
      <HomeHero
        wordmark="olive elliott"
        roleFrame="engineer · autonomous workflows · local-first systems"
        thesis={THESIS}
      />,
    )
    const thesisP = Array.from(container.querySelectorAll('p')).find(
      (p) => p.textContent === THESIS,
    )
    expect(thesisP).toBeDefined()
    const cls = thesisP!.getAttribute('class') ?? ''
    expect(cls).toContain('max-w-[55ch]')
    expect(cls).toContain('mt-6')
  })
})
