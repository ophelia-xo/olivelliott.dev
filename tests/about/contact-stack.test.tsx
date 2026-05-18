// tests/about/contact-stack.test.tsx
// Plan 05-03 Task 2 — ContactStack (CTC-02, CTC-03).
// Replaces Wave 0 placeholder. Plan 07-03 corrected the GitHub handle from
// `olivelliott` → `ophelia-xo` (Phase 5 picked the email local-part by
// mistake; the real GitHub handle differs).
// 10 tests:
//   1) <ul role="list"> with exactly 3 <li>
//   2) first link href starts with https://github.com/ophelia-xo
//   3) first link textContent === 'github.com/ophelia-xo'
//   4) second link href === mailto:olivelliott48@gmail.com?subject=hi%20from%20olivelliott.dev (Pitfall 5)
//   5) second link textContent === 'olivelliott48@gmail.com'
//   6) third link href starts with https://www.linkedin.com/in/
//   7) github + linkedin have target="_blank" + rel="noopener noreferrer"; mailto does NOT
//   8) each <a> has py-3 (44×44 touch target)
//   9) source-grep: no 'use client'
//  10) source-grep: no lucide-react import
import fs from 'node:fs'
import path from 'node:path'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ContactStack } from '@/components/about/contact-stack'

const SOURCE_PATH = path.resolve(__dirname, '../../components/about/contact-stack.tsx')

describe('<ContactStack>', () => {
  it('renders <ul role="list"> with exactly 3 <li> children', () => {
    const { container } = render(<ContactStack />)
    const ul = container.querySelector('ul[role="list"]')
    expect(ul).not.toBeNull()
    const lis = ul?.querySelectorAll('li') ?? []
    expect(lis.length).toBe(3)
  })

  it('first link href starts with https://github.com/ophelia-xo (canonical handle; Plan 07-03 correction)', () => {
    const { container } = render(<ContactStack />)
    const anchors = Array.from(container.querySelectorAll('li > a'))
    expect(anchors[0]?.getAttribute('href')).toMatch(/^https:\/\/github\.com\/ophelia-xo/)
    // Guard against Phase-5 mis-canonicalization re-introduction
    expect(anchors[0]?.getAttribute('href')).not.toMatch(/github\.com\/olivelliott/)
    // Guard against Phase-1 bare placeholder stem (ophelia-x without the trailing -o)
    expect(anchors[0]?.getAttribute('href')).not.toMatch(/ophelia-x(?!o)/)
  })

  it("first link textContent === 'github.com/ophelia-xo'", () => {
    const { container } = render(<ContactStack />)
    const anchors = Array.from(container.querySelectorAll('li > a'))
    expect(anchors[0]?.textContent?.trim()).toBe('github.com/ophelia-xo')
  })

  it('second link href === mailto:olivelliott48@gmail.com?subject=hi%20from%20olivelliott.dev (Pitfall 5)', () => {
    const { container } = render(<ContactStack />)
    const anchors = Array.from(container.querySelectorAll('li > a'))
    expect(anchors[1]?.getAttribute('href')).toBe(
      'mailto:olivelliott48@gmail.com?subject=hi%20from%20olivelliott.dev',
    )
  })

  it("second link textContent === 'olivelliott48@gmail.com'", () => {
    const { container } = render(<ContactStack />)
    const anchors = Array.from(container.querySelectorAll('li > a'))
    expect(anchors[1]?.textContent?.trim()).toBe('olivelliott48@gmail.com')
  })

  it('third link href starts with https://www.linkedin.com/in/olivelliott (Plan 07-03 confirmed)', () => {
    const { container } = render(<ContactStack />)
    const anchors = Array.from(container.querySelectorAll('li > a'))
    expect(anchors[2]?.getAttribute('href')).toBe('https://www.linkedin.com/in/olivelliott')
  })

  it('github + linkedin links have target="_blank" + rel="noopener noreferrer"; mailto link does NOT', () => {
    const { container } = render(<ContactStack />)
    const anchors = Array.from(container.querySelectorAll('li > a'))
    // github (idx 0)
    expect(anchors[0]?.getAttribute('target')).toBe('_blank')
    expect(anchors[0]?.getAttribute('rel')).toBe('noopener noreferrer')
    // mailto (idx 1)
    expect(anchors[1]?.getAttribute('target')).toBeNull()
    expect(anchors[1]?.getAttribute('rel')).toBeNull()
    // linkedin (idx 2)
    expect(anchors[2]?.getAttribute('target')).toBe('_blank')
    expect(anchors[2]?.getAttribute('rel')).toBe('noopener noreferrer')
  })

  it('each <a> has py-3 class (44×44 touch target via vertical padding)', () => {
    const { container } = render(<ContactStack />)
    const anchors = Array.from(container.querySelectorAll('li > a'))
    for (const a of anchors) {
      expect(a.className).toMatch(/\bpy-3\b/)
    }
  })

  it("source file does not contain 'use client'", () => {
    const src = fs.readFileSync(SOURCE_PATH, 'utf8')
    expect(src).not.toMatch(/['"]use client['"]/)
  })

  it('source file does not import lucide-react (no icons in /about contact links)', () => {
    const src = fs.readFileSync(SOURCE_PATH, 'utf8')
    expect(src).not.toMatch(/from\s+['"]lucide-react['"]/)
  })
})
