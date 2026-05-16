// tests/projects/project-meta.test.tsx
// PRJ-06 load-bearing: privacy rendering contract.
// Refs: 03-UI-SPEC § Component Inventory #2 (ProjectMeta) + § Privacy Rendering Contract.
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ProjectMeta } from '@/components/projects/project-meta'

describe('<ProjectMeta>', () => {
  it('public project renders `repo` link with ↗ glyph, target=_blank, rel=noopener noreferrer', () => {
    const { container } = render(
      <ProjectMeta
        year={2025}
        tags={['typescript']}
        visibility="public"
        repoUrl="https://github.com/olivelliott/myco"
      />
    )
    const repoLink = Array.from(container.querySelectorAll('a')).find(
      (a) => a.getAttribute('href') === 'https://github.com/olivelliott/myco'
    )
    expect(repoLink).toBeDefined()
    expect(repoLink!.getAttribute('target')).toBe('_blank')
    expect(repoLink!.getAttribute('rel')).toBe('noopener noreferrer')
    expect(repoLink!.textContent).toContain('repo')
    const glyph = repoLink!.querySelector('span[aria-hidden="true"]')
    expect(glyph).not.toBeNull()
    expect(glyph!.textContent).toBe('↗')
    // No private label
    expect(container.textContent).not.toContain('code private')
  })

  it('private project renders the literal "code private" label as a non-interactive <span>', () => {
    const { container } = render(
      <ProjectMeta
        year={2025}
        tags={['typescript', 'code-private']}
        visibility="private"
      />
    )
    const labels = Array.from(container.querySelectorAll('span')).filter(
      (s) => s.textContent === 'code private'
    )
    expect(labels.length).toBe(1)
    // Not a link
    expect(labels[0]?.tagName).toBe('SPAN')
    // No anchor element references "code private" via text
    const anchors = Array.from(container.querySelectorAll('a'))
    expect(anchors.find((a) => a.textContent === 'code private')).toBeUndefined()
  })

  it('private label class uses --color-text-tertiary (NOT accent)', () => {
    const { container } = render(
      <ProjectMeta year={2025} tags={['code-private']} visibility="private" />
    )
    const label = Array.from(container.querySelectorAll('span')).find(
      (s) => s.textContent === 'code private'
    )!
    expect(label.className).toContain('text-[color:var(--color-text-tertiary)]')
  })

  it('year renders inside <time dateTime={String(year)}>', () => {
    const { container } = render(
      <ProjectMeta year={2025} tags={['typescript']} visibility="public" repoUrl="https://x" />
    )
    const time = container.querySelector('time')!
    expect(time.getAttribute('dateTime')).toBe('2025')
    expect(time.textContent).toBe('2025')
  })

  it('outer wrapper is role=list with aria-label="Project metadata" and flex layout with gap-3', () => {
    const { container } = render(
      <ProjectMeta year={2025} tags={['typescript']} visibility="public" repoUrl="https://x" />
    )
    const row = container.firstElementChild as HTMLElement
    expect(row.getAttribute('role')).toBe('list')
    expect(row.getAttribute('aria-label')).toBe('Project metadata')
    expect(row.className).toMatch(/\bflex\b/)
    expect(row.className).toMatch(/flex-wrap/)
    expect(row.className).toMatch(/items-center/)
    expect(row.className).toMatch(/\bgap-3\b/)
  })

  it('PRJ-06: even if a stale repoUrl prop sneaks through, visibility=private suppresses the anchor', () => {
    const { container } = render(
      <ProjectMeta
        year={2025}
        tags={['code-private']}
        visibility="private"
        repoUrl="https://github.com/private-org/secret"
      />
    )
    const anchors = Array.from(container.querySelectorAll('a'))
    // No anchor with the stale repo URL
    expect(anchors.find((a) => a.getAttribute('href')?.includes('private-org/secret'))).toBeUndefined()
    // Still has the `code private` label
    const labels = Array.from(container.querySelectorAll('span')).filter((s) => s.textContent === 'code private')
    expect(labels.length).toBe(1)
  })

  it('composition order: year → tag chips → repo-or-private label', () => {
    const { container } = render(
      <ProjectMeta
        year={2025}
        tags={['typescript', 'local-first']}
        visibility="public"
        repoUrl="https://github.com/x/y"
      />
    )
    const row = container.firstElementChild as HTMLElement
    const children = Array.from(row.children)
    // First child = <time>
    expect(children[0]?.tagName).toBe('TIME')
    // Last interactive child = the repo link
    const last = children[children.length - 1]!
    expect(last.tagName).toBe('A')
    expect(last.getAttribute('href')).toBe('https://github.com/x/y')
  })
})
