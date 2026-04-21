// RED-until-01-03 — components/motion/motion-provider.tsx created by Plan 01-03.
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const MP_PATH = path.resolve(__dirname, '../components/motion/motion-provider.tsx')

describe('components/motion/motion-provider.tsx (FND-05)', () => {
  it('exists', () => {
    expect(existsSync(MP_PATH)).toBe(true)
  })

  it('is a client component', () => {
    const src = readFileSync(MP_PATH, 'utf-8')
    expect(src).toMatch(/^\s*['"]use client['"]/)
  })

  it('imports from motion/react (not framer-motion)', () => {
    const src = readFileSync(MP_PATH, 'utf-8')
    expect(src).toMatch(/from\s+['"]motion\/react['"]/)
    expect(src).not.toMatch(/from\s+['"]framer-motion['"]/)
  })

  it('configures MotionConfig with reducedMotion="user"', () => {
    const src = readFileSync(MP_PATH, 'utf-8')
    expect(src).toMatch(/reducedMotion=["']user["']/)
  })

  it('wraps children in LazyMotion with features={domAnimation}', () => {
    const src = readFileSync(MP_PATH, 'utf-8')
    expect(src).toMatch(/LazyMotion/)
    expect(src).toMatch(/features=\{domAnimation\}/)
  })

  it('enables strict mode on LazyMotion (enforces <m.*> over <motion.*>)', () => {
    const src = readFileSync(MP_PATH, 'utf-8')
    expect(src).toMatch(/\bstrict\b/)
  })
})
