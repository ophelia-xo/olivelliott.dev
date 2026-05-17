// tests/resume/resume-header.test.tsx
// Plan 05-02 Task 02 — ResumeHeader contract.
// 12 tests covering H1 + display classes + role line + location line + contact
// line + locked mailto subject + GitHub canonical + LinkedIn passthrough +
// external-link attrs + DownloadPdfLink composition + resume-header class hook
// + RSC source-grep.
// Refs: UI-SPEC § Component 7; § /resume document outline; § Copywriting Contract;
//       § Accessibility Contract; RESEARCH § Pitfall 5; CTC-02.
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ResumeHeader } from '@/components/resume/resume-header'

const SOURCE_PATH = path.resolve(
  __dirname,
  '..',
  '..',
  'components',
  'resume',
  'resume-header.tsx',
)

// Minimal Resume['header']-shaped fixture. Component is tested in isolation
// from content/resume.ts — the test owns the data, not RESUME.
const fixture = {
  name: 'Olive Elliott',
  role: 'Software Engineer  ·  AI Workflow Architect  ·  System Architect',
  location: 'Asheville, NC  ·  919-917-4777',
  links: {
    github: 'https://github.com/olivelliott',
    email: 'olivelliott48@gmail.com',
    linkedin: 'https://linkedin.com/in/olive-elliott',
  },
} as const

describe('<ResumeHeader>', () => {
  it('Test 1 — renders exactly one <h1> whose textContent is header.name', () => {
    const { container } = render(<ResumeHeader header={fixture} />)
    const h1s = container.querySelectorAll('h1')
    expect(h1s.length).toBe(1)
    expect(h1s[0]?.textContent).toBe('Olive Elliott')
  })

  it('Test 2 — H1 carries the display class string (text-display + lowercase + medium + -0.02em tracking)', () => {
    const { container } = render(<ResumeHeader header={fixture} />)
    const h1 = container.querySelector('h1')!
    const cls = h1.className
    expect(cls).toContain('text-[var(--text-display)]')
    expect(cls).toContain('lowercase')
    expect(cls).toContain('font-medium')
    expect(cls).toContain('tracking-[-0.02em]')
  })

  it('Test 3 — renders role line <p> with literal "Software Engineer  ·  AI Workflow Architect  ·  System Architect" (double-space around ·)', () => {
    const { container } = render(<ResumeHeader header={fixture} />)
    const paragraphs = Array.from(container.querySelectorAll('header p'))
    const match = paragraphs.find(
      (p) =>
        p.textContent ===
        'Software Engineer  ·  AI Workflow Architect  ·  System Architect',
    )
    expect(match).toBeDefined()
  })

  it('Test 4 — renders location/phone line <p> with "Asheville, NC  ·  919-917-4777"', () => {
    const { container } = render(<ResumeHeader header={fixture} />)
    const paragraphs = Array.from(container.querySelectorAll('header p'))
    const match = paragraphs.find(
      (p) => p.textContent === 'Asheville, NC  ·  919-917-4777',
    )
    expect(match).toBeDefined()
  })

  it('Test 5 — renders <ul class="contact-line"> with exactly 3 <li> children, each containing one <a>', () => {
    const { container } = render(<ResumeHeader header={fixture} />)
    const ul = container.querySelector('ul.contact-line')
    expect(ul).not.toBeNull()
    const lis = ul!.querySelectorAll(':scope > li')
    expect(lis.length).toBe(3)
    for (const li of Array.from(lis)) {
      expect(li.querySelectorAll('a').length).toBe(1)
    }
  })

  it('Test 6 — email link href === "mailto:{email}?subject=hi%20from%20olivelliott.dev" (Pitfall 5: %20 not +)', () => {
    const { container } = render(<ResumeHeader header={fixture} />)
    const mailto = container.querySelector('a[href^="mailto:"]')
    expect(mailto).not.toBeNull()
    const href = mailto!.getAttribute('href')!
    expect(href).toBe(
      'mailto:olivelliott48@gmail.com?subject=hi%20from%20olivelliott.dev',
    )
    // Pitfall 5 — must not encode the space as '+'
    expect(href.includes('+')).toBe(false)
  })

  it('Test 7 — github link href === RESUME header github URL (https://github.com/olivelliott)', () => {
    const { container } = render(<ResumeHeader header={fixture} />)
    const gh = container.querySelector('a[href*="github.com"]')
    expect(gh).not.toBeNull()
    expect(gh!.getAttribute('href')).toBe('https://github.com/olivelliott')
  })

  it('Test 8 — linkedin link href passes through from props (NOT a hardcoded literal)', () => {
    const customLinkedin = 'https://linkedin.com/in/some-other-handle'
    const overrideFixture = {
      ...fixture,
      links: { ...fixture.links, linkedin: customLinkedin },
    }
    const { container } = render(<ResumeHeader header={overrideFixture} />)
    const li = container.querySelector('a[href*="linkedin"]')
    expect(li).not.toBeNull()
    expect(li!.getAttribute('href')).toBe(customLinkedin)
  })

  it('Test 9 — external links (github + linkedin) have target=_blank AND rel=noopener noreferrer; mailto has neither', () => {
    const { container } = render(<ResumeHeader header={fixture} />)

    const gh = container.querySelector('a[href*="github.com"]')!
    expect(gh.getAttribute('target')).toBe('_blank')
    expect(gh.getAttribute('rel')).toBe('noopener noreferrer')

    const li = container.querySelector('a[href*="linkedin"]')!
    expect(li.getAttribute('target')).toBe('_blank')
    expect(li.getAttribute('rel')).toBe('noopener noreferrer')

    const mailto = container.querySelector('a[href^="mailto:"]')!
    // mailto is internal; no target/rel needed
    expect(mailto.getAttribute('target')).toBeNull()
    expect(mailto.getAttribute('rel')).toBeNull()
  })

  it('Test 10 — DownloadPdfLink renders inside <header class="resume-header"> (a[href="/resume.pdf"][download] descendant)', () => {
    const { container } = render(<ResumeHeader header={fixture} />)
    const header = container.querySelector('header.resume-header')
    expect(header).not.toBeNull()
    const downloadLink = header!.querySelector('a[href="/resume.pdf"]')
    expect(downloadLink).not.toBeNull()
    expect(downloadLink!.hasAttribute('download')).toBe(true)
  })

  it('Test 11 — <header> carries the resume-header class (CSS hook for absolute-positioned DownloadPdfLink)', () => {
    const { container } = render(<ResumeHeader header={fixture} />)
    const header = container.querySelector('header')
    expect(header).not.toBeNull()
    expect(header!.classList.contains('resume-header')).toBe(true)
  })

  it('Test 12 — source does NOT contain "use client" directive (RSC component)', () => {
    expect(existsSync(SOURCE_PATH)).toBe(true)
    const raw = readFileSync(SOURCE_PATH, 'utf8')
    const directive = /^\s*['"]use client['"];?\s*$/m
    expect(directive.test(raw)).toBe(false)
  })
})
