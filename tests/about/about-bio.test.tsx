// tests/about/about-bio.test.tsx
// Plan 05-03 Task 1 — AboutBio (ABT-01, ABT-02).
// Replaces Wave 0 placeholder. 8 tests:
//   1) 3 <p> elements
//   2) paragraph 2 names Aktiga (ABT-02)
//   3) text mentions 'autonomous workflows' or 'autonomous-workflow' (ABT-01 thesis)
//   4) text mentions 'local-first' or 'Appalachian' (ABT-01 thesis or education anchor)
//   5) outer wrapper has prose + max-w-prose
//   6) no banned words in rendered text
//   7) source-grep no 'use client'
//   8) source-grep no motion/react or lucide-react imports
import fs from 'node:fs'
import path from 'node:path'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AboutBio } from '@/components/about/about-bio'

// Phase 4 + Phase 5 banned-words list (UI-SPEC § anti-aesthetic prohibitions).
// Case-insensitive whole-word match (interpunct boundaries handled via word
// boundary \b). Multi-word phrases match as a substring.
const BANNED = [
  'passionate',
  'award-winning',
  'scalable solutions',
  'cutting-edge',
  '10x',
  'crafted',
  'seamless',
  'leveraging',
  'synergy',
  'rockstar',
  'ninja',
  'results-driven',
  'self-starter',
  'team player',
  'go-getter',
  'thought leader',
  'dynamic',
  'innovative',
  'transformative',
  'ecosystem',
  'paradigm',
  'next-generation',
]
const BANNED_RE = new RegExp(`\\b(${BANNED.map((w) => w.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|')})\\b`, 'i')

const SOURCE_PATH = path.resolve(__dirname, '../../components/about/about-bio.tsx')

describe('<AboutBio>', () => {
  it('renders exactly 3 <p> elements (the 3-paragraph bio block)', () => {
    const { container } = render(<AboutBio />)
    const paragraphs = container.querySelectorAll('p')
    expect(paragraphs.length).toBe(3)
  })

  it("paragraph 2 contains 'Aktiga' (ABT-02 — names current role)", () => {
    const { container } = render(<AboutBio />)
    const paragraphs = Array.from(container.querySelectorAll('p'))
    expect(paragraphs[1]?.textContent).toMatch(/Aktiga/)
  })

  it("rendered text mentions 'autonomous workflows' or 'autonomous-workflow' (ABT-01 thesis)", () => {
    const { container } = render(<AboutBio />)
    const text = container.textContent ?? ''
    expect(text).toMatch(/autonomous[ -]workflow/i)
  })

  it("rendered text mentions 'local-first' or 'Appalachian' (ABT-01 thesis or education anchor)", () => {
    const { container } = render(<AboutBio />)
    const text = container.textContent ?? ''
    expect(text).toMatch(/local-first|Appalachian/)
  })

  it("outer wrapper carries 'prose' AND 'max-w-prose' classes (typographic measure)", () => {
    const { container } = render(<AboutBio />)
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper).not.toBeNull()
    expect(wrapper.className).toMatch(/\bprose\b/)
    expect(wrapper.className).toMatch(/\bmax-w-prose\b/)
  })

  it('rendered text contains no banned words', () => {
    const { container } = render(<AboutBio />)
    const text = container.textContent ?? ''
    expect(text).not.toMatch(BANNED_RE)
  })

  it("source file does not contain 'use client'", () => {
    const src = fs.readFileSync(SOURCE_PATH, 'utf8')
    expect(src).not.toMatch(/['"]use client['"]/)
  })

  it('source file does not import motion/react or lucide-react', () => {
    const src = fs.readFileSync(SOURCE_PATH, 'utf8')
    expect(src).not.toMatch(/from\s+['"]motion\/react['"]/)
    expect(src).not.toMatch(/from\s+['"]lucide-react['"]/)
  })
})
