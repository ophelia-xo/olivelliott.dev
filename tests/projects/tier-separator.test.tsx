// tests/projects/tier-separator.test.tsx
// Refs: 04-UI-SPEC § Component Inventory #7; 04-RESEARCH § Pitfall 6.
// TierSeparator is a leaf RSC: hairline divider + mono lowercase label that
// accepts an optional `id` prop for aria-labelledby pass-through from the
// parent section on the /projects index page.
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TierSeparator } from '@/components/projects/tier-separator'

describe('<TierSeparator>', () => {
  // Phase 6 Plan 06-03 (QAL-02): label element promoted from <p> to <h2>.
  // On /projects the heading order is now h1 (page title) → h2 (tier label)
  // → h3 (card title), so axe's `heading-order` rule passes. Visual styling
  // is preserved (same className treatment); only the element name changed.
  it('renders a div with border-t + hairline color and an <h2 id> with the label text (label="hero")', () => {
    const { container } = render(
      <TierSeparator label="hero" id="hero-tier-eyebrow" />,
    )
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper).not.toBeNull()
    expect(wrapper.tagName).toBe('DIV')
    expect(wrapper.className).toContain('border-t')
    expect(wrapper.className).toContain('border-[color:var(--color-hairline)]')

    const h = wrapper.querySelector('h2')
    expect(h).not.toBeNull()
    expect(h?.getAttribute('id')).toBe('hero-tier-eyebrow')
    expect(h?.textContent).toBe('hero')
  })

  it('the <h2> carries the mono lowercase Geist-Mono treatment for tier-tertiary label', () => {
    const { container } = render(
      <TierSeparator label="hero" id="hero-tier-eyebrow" />,
    )
    const h = container.querySelector('h2')!
    const cls = h.className
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
    const h = container.querySelector('h2')!
    expect(h.getAttribute('id')).toBe('secondary-tier-eyebrow')
    expect(h.textContent).toBe('secondary')
  })

  it('omits the id attribute on the <h2> when no id prop is passed (still renders label)', () => {
    const { container } = render(<TierSeparator label="hero" />)
    const h = container.querySelector('h2')!
    expect(h.hasAttribute('id')).toBe(false)
    expect(h.textContent).toBe('hero')
  })
})
