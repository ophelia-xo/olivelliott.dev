// tests/projects/empty-filter-state.test.tsx
// Refs: 04-UI-SPEC § Component Inventory #9 + § Copywriting Contract;
//       04-RESEARCH § Empty-Filter State Rendering Details (locked copy).
// EmptyFilterState renders the LOCKED copy:
//   no projects tagged "{tag}" — view all projects →
// Em-dash is U+2014 (—); arrow is U+2192 (→); quotes are U+0022 (").
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EmptyFilterState } from '@/components/projects/empty-filter-state'

describe('<EmptyFilterState>', () => {
  it('renders a <p> containing "no projects tagged" and the quoted tag value', () => {
    const { container } = render(<EmptyFilterState tag="local-first" />)
    const p = container.querySelector('p')!
    const text = p.textContent ?? ''
    expect(text).toContain('no projects tagged')
    expect(text).toContain('"local-first"')
  })

  it('the rendered <p> contains the U+2014 em-dash character (—)', () => {
    const { container } = render(<EmptyFilterState tag="local-first" />)
    const text = container.querySelector('p')?.textContent ?? ''
    expect(text).toContain('—')
  })

  it('the rendered <p> contains the U+2192 right-arrow character (→)', () => {
    const { container } = render(<EmptyFilterState tag="local-first" />)
    const text = container.querySelector('p')?.textContent ?? ''
    expect(text).toContain('→')
  })

  it('renders exactly ONE <a href="/projects"> with text containing "view all projects"', () => {
    const { container } = render(<EmptyFilterState tag="local-first" />)
    const anchors = Array.from(container.querySelectorAll('a'))
    expect(anchors.length).toBe(1)
    const anchor = anchors[0]!
    expect(anchor.getAttribute('href')).toBe('/projects')
    expect(anchor.textContent ?? '').toContain('view all projects')
  })

  it('renders the tag value inside a <span class="font-mono lowercase">', () => {
    const { container } = render(<EmptyFilterState tag="typescript" />)
    const span = Array.from(container.querySelectorAll('span')).find(
      (s) => s.textContent?.includes('typescript'),
    )
    expect(span).not.toBeUndefined()
    expect(span?.className).toContain('font-mono')
    expect(span?.className).toContain('lowercase')
  })

  it('BANNED-WORD LOCK: rendered text contains none of the banned promo words', () => {
    const { container } = render(<EmptyFilterState tag="local-first" />)
    const text = container.textContent ?? ''
    for (const banned of [
      'passionate',
      'crafted',
      'seamless',
      'synergy',
      'innovative',
      'transformative',
    ]) {
      expect(text.toLowerCase()).not.toContain(banned)
    }
  })
})
