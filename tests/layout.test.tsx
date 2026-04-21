// RED-until-01-02 — app/layout.tsx and app/(site)/layout.tsx created by Plan 01-02 (and finalized in 01-04).
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const LAYOUT_PATH = path.resolve(__dirname, '../app/layout.tsx')

describe('app/layout.tsx — Root layout contract (FND-03)', () => {
  it('exists', () => {
    expect(existsSync(LAYOUT_PATH)).toBe(true)
  })

  it('imports GeistSans from geist/font/sans', () => {
    const src = readFileSync(LAYOUT_PATH, 'utf-8')
    expect(src).toMatch(/from\s+['"]geist\/font\/sans['"]/)
    expect(src).toMatch(/GeistSans/)
  })

  it('imports GeistMono from geist/font/mono', () => {
    const src = readFileSync(LAYOUT_PATH, 'utf-8')
    expect(src).toMatch(/from\s+['"]geist\/font\/mono['"]/)
    expect(src).toMatch(/GeistMono/)
  })

  it('applies both font variable classes to <html>', () => {
    const src = readFileSync(LAYOUT_PATH, 'utf-8')
    expect(src).toMatch(/GeistSans\.variable/)
    expect(src).toMatch(/GeistMono\.variable/)
  })

  it('sets suppressHydrationWarning on <html> (next-themes requirement)', () => {
    const src = readFileSync(LAYOUT_PATH, 'utf-8')
    expect(src).toMatch(/suppressHydrationWarning/)
  })

  it('sets lang="en" on <html>', () => {
    const src = readFileSync(LAYOUT_PATH, 'utf-8')
    expect(src).toMatch(/lang=["']en["']/)
  })

  it('exports metadata with metadataBase', () => {
    const src = readFileSync(LAYOUT_PATH, 'utf-8')
    expect(src).toMatch(/metadata/)
    expect(src).toMatch(/metadataBase/)
  })
})

describe('app/(site)/layout.tsx — Site layout contract (FND-08)', () => {
  const SITE_LAYOUT = path.resolve(__dirname, '../app/(site)/layout.tsx')

  it('exists', () => {
    expect(existsSync(SITE_LAYOUT)).toBe(true)
  })

  it('renders <main id="main"> for skip-link target', () => {
    const src = readFileSync(SITE_LAYOUT, 'utf-8')
    expect(src).toMatch(/<main[^>]*id=["']main["']/)
  })
})
