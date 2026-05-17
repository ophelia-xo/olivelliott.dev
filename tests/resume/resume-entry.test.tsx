// tests/resume/resume-entry.test.tsx
// Plan 05-02 Task 01 — ResumeEntry contract.
// 6 tests: title, meta, bullets, link absent path, link present path
// (mirrors Phase 3 ProjectMeta repo-link), bullet order preservation.
// Refs: UI-SPEC § Component 9 + § Print Stylesheet Contract screen-mode hooks.
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ResumeEntry } from '@/components/resume/resume-entry'

describe('<ResumeEntry>', () => {
  it('Test 1 — renders title in <p class="entry-title">', () => {
    const { container } = render(
      <ResumeEntry title="Software Engineer" meta="Aktiga · 2023" bullets={['b']} />,
    )
    const title = container.querySelector('p.entry-title')
    expect(title).not.toBeNull()
    expect(title?.textContent).toBe('Software Engineer')
  })

  it('Test 2 — renders meta in <p class="entry-meta">', () => {
    const { container } = render(
      <ResumeEntry
        title="Software Engineer"
        meta="Aktiga · 2023 – Present"
        bullets={['b']}
      />,
    )
    const meta = container.querySelector('p.entry-meta')
    expect(meta).not.toBeNull()
    expect(meta?.textContent).toBe('Aktiga · 2023 – Present')
  })

  it('Test 3 — renders bullets as <li> children of <ul class="entry-bullets"> with matching count', () => {
    const { container } = render(
      <ResumeEntry
        title="Role"
        meta="Co · 2024"
        bullets={['one', 'two', 'three', 'four']}
      />,
    )
    const ul = container.querySelector('ul.entry-bullets')
    expect(ul).not.toBeNull()
    const lis = ul!.querySelectorAll('li')
    expect(lis.length).toBe(4)
  })

  it('Test 4 — when link prop is undefined, NO repo-link anchor is rendered (private project case)', () => {
    const { container } = render(
      <ResumeEntry title="Trade Bot" meta="2025" bullets={['private bullet']} />,
    )
    expect(container.querySelector('a.repo-link')).toBeNull()
    // No anchors at all in this entry
    expect(container.querySelectorAll('a').length).toBe(0)
  })

  it('Test 5 — when link is provided, renders <a class="repo-link" href={href}>{label} ↗</a> with target=_blank + rel=noopener noreferrer', () => {
    const { container } = render(
      <ResumeEntry
        title="Myco"
        meta="Persistent Cognitive Layer · 2024 – Present"
        bullets={['b']}
        link={{ href: 'https://github.com/olivelliott/myco', label: 'github.com/olivelliott/myco' }}
      />,
    )
    const anchor = container.querySelector('a.repo-link') as HTMLAnchorElement | null
    expect(anchor).not.toBeNull()
    expect(anchor?.getAttribute('href')).toBe('https://github.com/olivelliott/myco')
    expect(anchor?.getAttribute('target')).toBe('_blank')
    expect(anchor?.getAttribute('rel')).toBe('noopener noreferrer')
    // textContent includes the label + ↗ glyph
    expect(anchor?.textContent).toBe('github.com/olivelliott/myco ↗')
  })

  it('Test 6 — bullets render in the same order as the input array (no sort, no filter)', () => {
    const bullets = ['alpha', 'beta', 'gamma', 'delta']
    const { container } = render(
      <ResumeEntry title="Role" meta="m" bullets={bullets} />,
    )
    const lis = Array.from(container.querySelectorAll('ul.entry-bullets li'))
    expect(lis.map((li) => li.textContent)).toEqual(bullets)
  })
})
