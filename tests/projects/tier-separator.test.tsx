// tests/projects/tier-separator.test.tsx
// Refs: 04-UI-SPEC § Component Inventory #7; 04-RESEARCH § Pitfall 6.
// TierSeparator is a leaf RSC: hairline divider + mono lowercase label that
// accepts an optional `id` prop for aria-labelledby pass-through from the
// parent section on the /projects index page.
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TierSeparator } from '@/components/projects/tier-separator'

describe('<TierSeparator>', () => {
  it('renders a div with border-t + hairline color and a <p id> with the label text (label="hero")', () => {
    const { container } = render(
      <TierSeparator label="hero" id="hero-tier-eyebrow" />,
    )
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper).not.toBeNull()
    expect(wrapper.tagName).toBe('DIV')
    expect(wrapper.className).toContain('border-t')
    expect(wrapper.className).toContain('border-[color:var(--color-hairline)]')

    const p = wrapper.querySelector('p')
    expect(p).not.toBeNull()
    expect(p?.getAttribute('id')).toBe('hero-tier-eyebrow')
    expect(p?.textContent).toBe('hero')
  })

  it('the <p> carries the mono lowercase Geist-Mono treatment for tier-tertiary label', () => {
    const { container } = render(
      <TierSeparator label="hero" id="hero-tier-eyebrow" />,
    )
    const p = container.querySelector('p')!
    const cls = p.className
    for (const required of [
      'font-mono',
      'lowercase',
      'tracking-[0.02em]',
      'text-[color:var(--color-text-tertiary)]',
    ]) {
      expect(cls).toContain(required)
    }
  })

  it('renders identically for label="secondary" (label text and id pass-through)', () => {
    const { container } = render(
      <TierSeparator label="secondary" id="secondary-tier-eyebrow" />,
    )
    const p = container.querySelector('p')!
    expect(p.getAttribute('id')).toBe('secondary-tier-eyebrow')
    expect(p.textContent).toBe('secondary')
  })

  it('omits the id attribute on the <p> when no id prop is passed (still renders label)', () => {
    const { container } = render(<TierSeparator label="hero" />)
    const p = container.querySelector('p')!
    expect(p.hasAttribute('id')).toBe(false)
    expect(p.textContent).toBe('hero')
  })
})
