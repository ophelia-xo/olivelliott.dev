// tests/projects/tag-chip-row.test.tsx
// Refs: 03-UI-SPEC § Component Inventory #3 (TagChipRow); 03-RESEARCH § Tag chip row example.
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TagChipRow } from '@/components/projects/tag-chip-row'

describe('<TagChipRow>', () => {
  it('renders one <a> per tag with text matching the tag value', () => {
    const { container } = render(<TagChipRow tags={['local-first', 'typescript']} />)
    const anchors = Array.from(container.querySelectorAll('a'))
    expect(anchors.length).toBe(2)
    expect(anchors[0]?.textContent?.trim()).toBe('local-first')
    expect(anchors[1]?.textContent?.trim()).toBe('typescript')
  })

  it('href points to /projects?tag={tag} verbatim (hyphens are URL-safe)', () => {
    const { container } = render(<TagChipRow tags={['local-first', 'code-private']} />)
    const hrefs = Array.from(container.querySelectorAll('a')).map((a) => a.getAttribute('href'))
    expect(hrefs).toEqual(['/projects?tag=local-first', '/projects?tag=code-private'])
  })

  it('each chip has the locked className stack (surface-2 + rounded-sm + mono lowercase + secondary→primary hover)', () => {
    const { container } = render(<TagChipRow tags={['typescript']} />)
    const chip = container.querySelector('a')!
    const cls = chip.className
    for (const required of [
      'inline-flex',
      'px-3',
      'py-2',
      '-my-2',
      'bg-[color:var(--color-surface-2)]',
      'rounded-sm',
      'font-mono',
      'lowercase',
      'text-[color:var(--color-text-secondary)]',
      'hover:text-[color:var(--color-text-primary)]',
    ]) {
      expect(cls).toContain(required)
    }
  })

  it("renders the auto-added 'code-private' chip identically to other chips (no special highlight)", () => {
    const { container } = render(<TagChipRow tags={['typescript', 'code-private']} />)
    const [first, second] = Array.from(container.querySelectorAll('a'))
    expect(first?.className).toBe(second?.className)
  })

  it('renders nothing when tags is empty (defensive)', () => {
    const { container } = render(<TagChipRow tags={[]} />)
    expect(container.querySelectorAll('a').length).toBe(0)
  })

  it('returns a React fragment — no extra wrapping div around the chips; each chip lives in <li role="listitem"> (parent ProjectMeta <ul role="list">)', () => {
    // Phase 6 Plan 06-03 (QAL-02): each chip is wrapped in <li role="listitem">
    // so the parent ProjectMeta <ul role="list"> satisfies axe's
    // `aria-required-children`. There is still no wrapping div — the
    // top-level returned shape is a fragment of <li> elements.
    const { container } = render(<TagChipRow tags={['typescript']} />)
    // First element child is now the <li> (was the <a> pre-Plan-06-03)
    expect(container.firstElementChild?.tagName).toBe('LI')
    expect(container.firstElementChild?.getAttribute('role')).toBe('listitem')
    // The <a> still exists as the immediate child of the <li>
    expect(container.firstElementChild?.firstElementChild?.tagName).toBe('A')
  })
})
