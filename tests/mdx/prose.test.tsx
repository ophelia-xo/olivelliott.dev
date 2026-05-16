// tests/mdx/prose.test.tsx
// Refs: 03-UI-SPEC § Component Inventory #4 (MDXProse) + § Page Composition.
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MDXProse } from '@/components/mdx/prose'

describe('<MDXProse>', () => {
  it('wraps children in a div with the prose width measure + .prose class + top margin', () => {
    const { container } = render(
      <MDXProse>
        <p>hello</p>
      </MDXProse>
    )
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper).not.toBeNull()
    expect(wrapper.tagName).toBe('DIV')
    const cls = wrapper.className
    expect(cls).toMatch(/\bmx-auto\b/)
    expect(cls).toMatch(/max-w-\[65ch\]/)
    expect(cls).toMatch(/\bmt-12\b/)
    expect(cls).toMatch(/md:mt-16/)
    expect(cls).toMatch(/\bprose\b/)
  })

  it('renders children as direct descendants (no extra layer)', () => {
    const { container } = render(
      <MDXProse>
        <p data-testid="child">hello</p>
      </MDXProse>
    )
    const wrapper = container.firstElementChild as HTMLElement
    const child = wrapper.firstElementChild as HTMLElement
    expect(child.tagName).toBe('P')
    expect(child.dataset.testid).toBe('child')
  })
})
