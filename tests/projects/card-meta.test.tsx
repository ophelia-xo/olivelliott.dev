// tests/projects/card-meta.test.tsx
// Pitfall 12 regression lock: chips inside cards must be <span>, NOT <a>.
// Refs: 04-UI-SPEC § Component Inventory #6, 04-RESEARCH § Example 4, § Pitfalls 3 + 12.
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CardMeta } from '@/components/projects/card-meta'

describe('<CardMeta>', () => {
  it('renders <div role="list" aria-label="Project metadata"> with year + chips + (private label) in order', () => {
    const { container } = render(
      <CardMeta year={2025} tags={['typescript', 'local-first']} visibility="public" />,
    )
    const row = container.querySelector('[role="list"][aria-label="Project metadata"]')
    expect(row).not.toBeNull()

    const wrapper = row as HTMLElement
    const children = Array.from(wrapper.children)
    // First child = <time>
    expect(children[0]?.tagName).toBe('TIME')
    // Subsequent children include tag spans
    expect(children[1]?.tagName).toBe('SPAN')
    expect(children[1]?.textContent).toBe('typescript')
    expect(children[2]?.tagName).toBe('SPAN')
    expect(children[2]?.textContent).toBe('local-first')
    // Public visibility — no `code private` label trailing
    expect(children.length).toBe(3)
  })

  it('renders year inside <time dateTime={String(year)}>', () => {
    const { container } = render(
      <CardMeta year={2025} tags={['typescript']} visibility="public" />,
    )
    const time = container.querySelector('time')!
    expect(time.getAttribute('dateTime')).toBe('2025')
    expect(time.textContent).toBe('2025')
  })

  it('each tag renders as a <span> with the verbatim lowercase tag value (NOT TAG_LABELS)', () => {
    const { container } = render(
      <CardMeta
        year={2025}
        tags={['typescript', 'local-first', 'open-source']}
        visibility="public"
      />,
    )
    const spans = Array.from(container.querySelectorAll('span'))
    for (const tag of ['typescript', 'local-first', 'open-source']) {
      const match = spans.some((s) => s.textContent === tag)
      expect(match).toBe(true)
    }
    // Negative — no capitalized labels (TypeScript, Local-first, Open-source)
    expect(spans.some((s) => s.textContent === 'TypeScript')).toBe(false)
    expect(spans.some((s) => s.textContent === 'Local-first')).toBe(false)
  })

  it('PRIVACY: visibility="private" renders a <span> with exactly the text "code private"', () => {
    const { container } = render(
      <CardMeta
        year={2025}
        tags={['typescript', 'code-private']}
        visibility="private"
      />,
    )
    const labels = Array.from(container.querySelectorAll('span')).filter(
      (s) => s.textContent?.trim() === 'code private',
    )
    expect(labels.length).toBe(1)
    expect(labels[0]?.tagName).toBe('SPAN')
  })

  it('PRIVACY: visibility="public" renders NO span with text "code private"', () => {
    const { container } = render(
      <CardMeta year={2025} tags={['typescript']} visibility="public" />,
    )
    const labels = Array.from(container.querySelectorAll('span')).filter(
      (s) => s.textContent?.trim() === 'code private',
    )
    expect(labels.length).toBe(0)
  })

  it('NESTED-ANCHOR LOCK (Pitfall 12): renders ZERO <a> elements for BOTH visibility values', () => {
    const { container: publicC } = render(
      <CardMeta year={2025} tags={['typescript', 'local-first']} visibility="public" />,
    )
    expect(publicC.querySelectorAll('a').length).toBe(0)

    const { container: privateC } = render(
      <CardMeta
        year={2025}
        tags={['typescript', 'code-private']}
        visibility="private"
      />,
    )
    expect(privateC.querySelectorAll('a').length).toBe(0)
  })

  it('tag chips have --color-surface-2 background; private label uses --color-text-tertiary', () => {
    const { container } = render(
      <CardMeta year={2025} tags={['typescript']} visibility="private" />,
    )
    expect(container.innerHTML).toContain('bg-[color:var(--color-surface-2)]')
    const privateLabel = Array.from(container.querySelectorAll('span')).find(
      (s) => s.textContent?.trim() === 'code private',
    )!
    expect(privateLabel.className).toContain('text-[color:var(--color-text-tertiary)]')
  })
})
