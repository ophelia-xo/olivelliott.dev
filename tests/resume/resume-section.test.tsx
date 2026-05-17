// tests/resume/resume-section.test.tsx
// Plan 05-02 Task 01 — ResumeSection contract.
// 4 tests: aria-labelledby wiring, hideHeading→sr-only, resume-h2 class hook,
// id/aria-labelledby agreement.
// Refs: UI-SPEC § Component 8 + § /resume document outline.
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ResumeSection } from '@/components/resume/resume-section'

describe('<ResumeSection>', () => {
  it('Test 1 — renders <section aria-labelledby={id}> wrapping <h2 id={id} class="resume-h2">{label}</h2> + children', () => {
    const { container } = render(
      <ResumeSection id="experience-h2" label="experience">
        <p>child content</p>
      </ResumeSection>,
    )
    const section = container.querySelector('section')!
    expect(section.getAttribute('aria-labelledby')).toBe('experience-h2')
    const h2 = section.querySelector('h2')!
    expect(h2.id).toBe('experience-h2')
    expect(h2.textContent).toBe('experience')
    expect(section.querySelector('p')?.textContent).toBe('child content')
  })

  it('Test 2 — hideHeading=true keeps the h2 in the DOM but makes it sr-only (document outline preserved)', () => {
    const { container } = render(
      <ResumeSection id="summary-h2" label="summary" hideHeading>
        <p>summary paragraph</p>
      </ResumeSection>,
    )
    const h2 = container.querySelector('h2')!
    // H2 still exists for the document outline
    expect(h2).not.toBeNull()
    expect(h2.textContent).toBe('summary')
    expect(h2.classList.contains('sr-only')).toBe(true)
  })

  it('Test 3 — when hideHeading is false (default), h2 has the resume-h2 class (print + screen hook)', () => {
    const { container } = render(
      <ResumeSection id="projects-h2" label="projects">
        <p>p</p>
      </ResumeSection>,
    )
    const h2 = container.querySelector('h2')!
    expect(h2.classList.contains('resume-h2')).toBe(true)
    expect(h2.classList.contains('sr-only')).toBe(false)
  })

  it('Test 4 — aria-labelledby value matches the h2 id exactly (target the H2 by id)', () => {
    const { container } = render(
      <ResumeSection id="skills-h2" label="skills">
        <dl />
      </ResumeSection>,
    )
    const section = container.querySelector('section')!
    const labelId = section.getAttribute('aria-labelledby')!
    // Querying by that id should find the H2 with the matching label text
    const labelEl = container.querySelector(`#${labelId}`)
    expect(labelEl?.tagName).toBe('H2')
    expect(labelEl?.textContent).toBe('skills')
  })
})
