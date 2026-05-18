// tests/resume/resume-page.test.tsx
// Plan 05-02 Task 03 — /resume route (page.tsx) integration.
// 16 tests covering H1/H2 counts and order, sr-only summary, #resume-main,
// skip-link, chrome opt-out (Pitfall 1), section composition, every entry
// rendered, Myco repo link, RSC source-grep, per-route metadata, and
// privacy (no leaked private project URLs).
// Refs: UI-SPEC § /resume document outline + § Copywriting Contract + § Accessibility Contract;
//       RESEARCH § Pitfall 1 + § Pitfall 10 + § Pattern 5.
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ResumePage, { metadata } from '@/app/resume/page'
import { RESUME } from '@/content/resume'

const SOURCE_PATH = path.resolve(
  __dirname,
  '..',
  '..',
  'app',
  'resume',
  'page.tsx',
)

describe('/resume page route', () => {
  it('Test 1 — route renders without throwing when RESUME loads cleanly', () => {
    expect(() => render(<ResumePage />)).not.toThrow()
  })

  it('Test 2 — exactly one <h1> in the rendered tree (olive elliott)', () => {
    const { container } = render(<ResumePage />)
    const h1s = container.querySelectorAll('h1')
    expect(h1s.length).toBe(1)
    expect(h1s[0]?.textContent).toBe(RESUME.header.name)
  })

  it('Test 3 — exactly 5 <h2> elements in the locked order [summary, experience, projects, skills, education]', () => {
    const { container } = render(<ResumePage />)
    const h2s = Array.from(container.querySelectorAll('h2'))
    expect(h2s.length).toBe(5)
    expect(h2s.map((h) => h.textContent)).toEqual([
      'summary',
      'experience',
      'projects',
      'skills',
      'education',
    ])
  })

  it('Test 4 — the first <h2> (summary) carries the sr-only class (hideHeading)', () => {
    const { container } = render(<ResumePage />)
    const summaryH2 = container.querySelector('h2')
    expect(summaryH2?.textContent).toBe('summary')
    expect(summaryH2?.classList.contains('sr-only')).toBe(true)
  })

  it('Test 5 — <main> element has id "resume-main" (Pitfall 10: distinct from site shell #main)', () => {
    const { container } = render(<ResumePage />)
    const main = container.querySelector('main')
    expect(main).not.toBeNull()
    expect(main!.id).toBe('resume-main')
  })

  it('Test 6 — skip-link present: a[href="#resume-main"] with text including "Skip to resume"', () => {
    const { container } = render(<ResumePage />)
    const skip = container.querySelector('a[href="#resume-main"]')
    expect(skip).not.toBeNull()
    expect(skip!.textContent).toContain('Skip to resume')
  })

  it('Test 7 — NO Nav, NO Footer, NO site-shell SkipLink (Pitfall 1: chromeless route group opt-out)', () => {
    const { container } = render(<ResumePage />)
    // Site Nav uses <nav> with .border-b in Phase 1; the resume route has none.
    expect(container.querySelector('nav.border-b')).toBeNull()
    // No <footer> in /resume page output (footer lives in site layout, which /resume skips)
    expect(container.querySelector('footer')).toBeNull()
    // No skip-link targeting #main (that's the site shell's id; resume uses #resume-main)
    expect(container.querySelector('a[href="#main"]')).toBeNull()
  })

  it('Test 8 — ResumeHeader renders: <header class="resume-header"> contains the H1', () => {
    const { container } = render(<ResumePage />)
    const header = container.querySelector('header.resume-header')
    expect(header).not.toBeNull()
    expect(header!.querySelector('h1')).not.toBeNull()
  })

  it('Test 9 — every experience entry title appears as text', () => {
    const { container } = render(<ResumePage />)
    const text = container.textContent ?? ''
    for (const entry of RESUME.experience) {
      expect(text).toContain(entry.role)
    }
  })

  it('Test 10 — every project entry name appears as text', () => {
    const { container } = render(<ResumePage />)
    const text = container.textContent ?? ''
    for (const p of RESUME.projects) {
      expect(text).toContain(p.name)
    }
  })

  it('Test 11 — every skill category appears as text', () => {
    const { container } = render(<ResumePage />)
    const text = container.textContent ?? ''
    for (const s of RESUME.skills) {
      expect(text).toContain(s.category)
    }
  })

  it('Test 12 — every education entry degree appears as text', () => {
    const { container } = render(<ResumePage />)
    const text = container.textContent ?? ''
    for (const e of RESUME.education) {
      expect(text).toContain(e.degree)
    }
  })

  it("Test 13 — Myco's repo URL is rendered as an anchor (proves ResumeEntry link wiring; Plan 07-03 corrected handle)", () => {
    const { container } = render(<ResumePage />)
    const anchor = container.querySelector(
      'a[href="https://github.com/ophelia-xo/myco"]',
    )
    expect(anchor).not.toBeNull()
  })

  it('Test 14 — source does NOT contain "use client" directive (RSC route)', () => {
    expect(existsSync(SOURCE_PATH)).toBe(true)
    const raw = readFileSync(SOURCE_PATH, 'utf8')
    const directive = /^\s*['"]use client['"];?\s*$/m
    expect(directive.test(raw)).toBe(false)
  })

  it('Test 15 — metadata export has title === "resume" AND openGraph.type === "profile"', () => {
    expect(metadata).toBeDefined()
    expect(metadata.title).toBe('resume')
    expect(metadata.openGraph?.type).toBe('profile')
  })

  it('Test 16 — privacy: private projects (Trade Bot, Agenda Keeper) render NO leaked URLs (no anchor whose href contains "trade-bot" or "agenda-keeper")', () => {
    const { container } = render(<ResumePage />)
    const anchors = Array.from(container.querySelectorAll('a'))
    for (const a of anchors) {
      const href = a.getAttribute('href') ?? ''
      expect(
        /trade-bot/i.test(href),
        `Private project Trade Bot must not leak a URL — found ${href}`,
      ).toBe(false)
      expect(
        /agenda-keeper/i.test(href),
        `Private project Agenda Keeper must not leak a URL — found ${href}`,
      ).toBe(false)
    }
  })
})
