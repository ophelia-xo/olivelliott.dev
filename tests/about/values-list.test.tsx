// tests/about/values-list.test.tsx
// Plan 05-03 Task 1 — ValuesList (ABT-03).
// Replaces Wave 0 placeholder. 6 tests:
//   1) renders <dl> with exactly 3 <dt>/<dd> pairs
//   2) <dt> values are exactly ['polymath', 'autonomous workflows', 'open-source communities'] IN ORDER
//   3) each <dd> contains the EXACT locked descriptor from UI-SPEC § Copywriting Contract
//   4) each <dt> has primary-text color class AND font-medium (body-medium activation)
//   5) banned-words negative on rendered text
//   6) source-grep — no 'use client'
import fs from 'node:fs'
import path from 'node:path'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ValuesList } from '@/components/about/values-list'

const BANNED = [
  'passionate', 'award-winning', 'scalable solutions', 'cutting-edge', '10x',
  'crafted', 'seamless', 'leveraging', 'synergy', 'rockstar', 'ninja',
  'results-driven', 'self-starter', 'team player', 'go-getter', 'thought leader',
  'dynamic', 'innovative', 'transformative', 'ecosystem', 'paradigm',
  'next-generation',
]
const BANNED_RE = new RegExp(`\\b(${BANNED.map((w) => w.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|')})\\b`, 'i')

const SOURCE_PATH = path.resolve(__dirname, '../../components/about/values-list.tsx')

describe('<ValuesList>', () => {
  it('renders a <dl> with exactly 3 <dt>/<dd> pairs', () => {
    const { container } = render(<ValuesList />)
    const dl = container.querySelector('dl')
    expect(dl).not.toBeNull()
    expect(container.querySelectorAll('dt').length).toBe(3)
    expect(container.querySelectorAll('dd').length).toBe(3)
  })

  it("<dt> textContents are exactly ['polymath', 'autonomous workflows', 'open-source communities'] in order", () => {
    const { container } = render(<ValuesList />)
    const dts = Array.from(container.querySelectorAll('dt')).map((dt) => dt.textContent)
    expect(dts).toEqual(['polymath', 'autonomous workflows', 'open-source communities'])
  })

  it('each <dd> contains the exact locked descriptor from UI-SPEC § Copywriting Contract', () => {
    const { container } = render(<ValuesList />)
    const dds = Array.from(container.querySelectorAll('dd')).map((dd) => dd.textContent)
    expect(dds[0]).toBe(
      'work moves across engineering, anthropology, and creative practice — no one of them is the whole picture.',
    )
    expect(dds[1]).toBe(
      "tools should do the obvious work so we can spend attention on the work that's actually ours.",
    )
    expect(dds[2]).toBe(
      'what gets built in the open belongs to everyone who builds on it.',
    )
  })

  it('each <dt> has primary-text color class AND font-medium', () => {
    const { container } = render(<ValuesList />)
    const dts = Array.from(container.querySelectorAll('dt'))
    for (const dt of dts) {
      expect(dt.className).toMatch(/font-medium/)
      expect(dt.className).toMatch(/color:var\(--color-text-primary\)/)
    }
  })

  it('rendered text contains no banned words', () => {
    const { container } = render(<ValuesList />)
    const text = container.textContent ?? ''
    expect(text).not.toMatch(BANNED_RE)
  })

  it("source file does not contain 'use client'", () => {
    const src = fs.readFileSync(SOURCE_PATH, 'utf8')
    expect(src).not.toMatch(/['"]use client['"]/)
  })
})
