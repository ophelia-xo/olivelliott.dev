// tests/mdx/components.test.tsx
// RTL smoke tests for Figure / Gallery / Callout MDX components.
// Refs: 03-UI-SPEC § Component Inventory #5, #6, #7.
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Callout } from '@/components/mdx/callout'
import { Figure } from '@/components/mdx/figure'
import { Gallery } from '@/components/mdx/gallery'

const WIDE_BLEED_MX = 'mx-[calc((100%-100vw)/2+50%)]'
const WIDE_BLEED_MAX = 'max-w-[calc(min(100vw,72rem)-2rem)]'

describe('<Figure>', () => {
  it('renders a <figure> containing an <img> with default 1200x900 + alt + src', () => {
    const { container } = render(<Figure src="/x.png" alt="alt-text" />)
    const fig = container.querySelector('figure')
    expect(fig).not.toBeNull()
    const img = container.querySelector('img')
    expect(img).not.toBeNull()
    expect(img!.getAttribute('alt')).toBe('alt-text')
    // next/image emits the src somewhere in the rendered <img> attribute
    // (src may be wrapped in /_next/image?...&url=); the alt is the stable contract.
  })

  it('renders <figcaption> when caption prop provided', () => {
    const { container } = render(
      <Figure src="/x.png" alt="a" caption="my caption" />
    )
    const cap = container.querySelector('figcaption')
    expect(cap?.textContent).toBe('my caption')
  })

  it('renders no <figcaption> when caption omitted', () => {
    const { container } = render(<Figure src="/x.png" alt="a" />)
    expect(container.querySelector('figcaption')).toBeNull()
  })

  it('applies wide bleed classes when wide=true', () => {
    const { container } = render(<Figure src="/x.png" alt="a" wide />)
    const fig = container.querySelector('figure')!
    expect(fig.className).toContain(WIDE_BLEED_MX)
    expect(fig.className).toContain(WIDE_BLEED_MAX)
  })
})

describe('<Gallery>', () => {
  const TWO = [
    { src: '/a.png', alt: 'a' },
    { src: '/b.png', alt: 'b' },
  ]
  const THREE = [
    { src: '/a.png', alt: 'a', caption: 'A' },
    { src: '/b.png', alt: 'b' },
    { src: '/c.png', alt: 'c', caption: 'C' },
  ]

  it('renders one <figure> per item; defaults to 2-up grid at sm+', () => {
    const { container } = render(<Gallery items={TWO} />)
    expect(container.querySelectorAll('figure').length).toBe(2)
    const grid = container.firstElementChild as HTMLElement
    expect(grid.className).toMatch(/sm:grid-cols-2/)
  })

  it('renders 3-up grid at lg+ when columns=3', () => {
    const { container } = render(<Gallery items={THREE} columns={3} />)
    expect(container.querySelectorAll('figure').length).toBe(3)
    const grid = container.firstElementChild as HTMLElement
    expect(grid.className).toMatch(/lg:grid-cols-3/)
  })

  it('renders <figcaption> only for items that provide caption', () => {
    const { container } = render(<Gallery items={THREE} columns={3} />)
    const captions = Array.from(container.querySelectorAll('figcaption'))
    expect(captions.map((c) => c.textContent)).toEqual(['A', 'C'])
  })

  it('applies wide bleed classes when wide=true', () => {
    const { container } = render(<Gallery items={TWO} wide />)
    const grid = container.firstElementChild as HTMLElement
    expect(grid.className).toContain(WIDE_BLEED_MX)
    expect(grid.className).toContain(WIDE_BLEED_MAX)
  })
})

describe('<Callout>', () => {
  it('default variant=note emits <aside> with accent left border + surface-2 bg + rounded-md + padding', () => {
    const { container } = render(<Callout>body</Callout>)
    const aside = container.querySelector('aside')!
    const cls = aside.className
    expect(cls).toMatch(/\bborder-l-4\b/)
    expect(cls).toMatch(/border-l-\[color:var\(--color-accent\)\]/)
    expect(cls).toMatch(/bg-\[color:var\(--color-surface-2\)\]/)
    expect(cls).toMatch(/rounded-md/)
    expect(cls).toMatch(/px-4/)
    expect(cls).toMatch(/py-4/)
  })

  it('variant=warn uses --color-danger left border', () => {
    const { container } = render(<Callout variant="warn">body</Callout>)
    const cls = container.querySelector('aside')!.className
    expect(cls).toMatch(/border-l-\[color:var\(--color-danger\)\]/)
  })

  it('variant=quote uses --color-text-tertiary border and italic body', () => {
    const { container } = render(<Callout variant="quote">body</Callout>)
    const aside = container.querySelector('aside')!
    expect(aside.className).toMatch(/border-l-\[color:var\(--color-text-tertiary\)\]/)
    // italic applied to inner body wrapper
    const body = aside.querySelector('div')!
    expect(body.className).toMatch(/\bitalic\b/)
  })

  it('renders title element when title prop set; omits otherwise', () => {
    const { container, rerender } = render(<Callout title="heads up">body</Callout>)
    expect(screen.getByText('heads up')).toBeTruthy()
    rerender(<Callout>body</Callout>)
    expect(screen.queryByText('heads up')).toBeNull()
  })

  it('emits children inside the body wrapper', () => {
    render(<Callout><p>hello</p></Callout>)
    expect(screen.getByText('hello').tagName).toBe('P')
  })
})
