// RED-until-01-03 — components/motion/fade-in.tsx created by Plan 01-03. OPACITY-ONLY contract.
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const FI_PATH = path.resolve(__dirname, '../components/motion/fade-in.tsx')

describe('components/motion/fade-in.tsx — opacity-only contract (FND-05, UI-SPEC line 276)', () => {
  it('exists', () => {
    expect(existsSync(FI_PATH)).toBe(true)
  })

  it('is a client component', () => {
    const src = readFileSync(FI_PATH, 'utf-8')
    expect(src).toMatch(/^\s*['"]use client['"]/)
  })

  it('imports { m } from motion/react (NOT { motion })', () => {
    const src = readFileSync(FI_PATH, 'utf-8')
    expect(src).toMatch(/import\s*\{\s*m\s*\}\s*from\s+['"]motion\/react['"]/)
    expect(src).not.toMatch(/import\s*\{\s*motion\s*\}\s*from\s+['"]motion\/react['"]/)
  })

  it('contains opacity: 0 in initial', () => {
    const src = readFileSync(FI_PATH, 'utf-8')
    expect(src).toMatch(/opacity:\s*0\b/)
  })

  it('contains opacity: 1 in animate', () => {
    const src = readFileSync(FI_PATH, 'utf-8')
    expect(src).toMatch(/opacity:\s*1\b/)
  })

  it('does NOT contain any transform keys (y, x, scale, rotate, skew)', () => {
    const src = readFileSync(FI_PATH, 'utf-8')
    expect(src).not.toMatch(/\by:\s*-?\d/)
    expect(src).not.toMatch(/\bx:\s*-?\d/)
    expect(src).not.toMatch(/\bscale:\s*-?\d/)
    expect(src).not.toMatch(/\brotate:\s*-?\d/)
    expect(src).not.toMatch(/\brotateX:/)
    expect(src).not.toMatch(/\brotateY:/)
    expect(src).not.toMatch(/\bskewX:/)
    expect(src).not.toMatch(/\bskewY:/)
  })

  it('uses UI-SPEC motion duration 0.22s and ease [0.22, 1, 0.36, 1]', () => {
    const src = readFileSync(FI_PATH, 'utf-8')
    expect(src).toMatch(/duration:\s*0\.22/)
    expect(src).toMatch(/\[\s*0\.22\s*,\s*1\s*,\s*0\.36\s*,\s*1\s*\]/)
  })
})
