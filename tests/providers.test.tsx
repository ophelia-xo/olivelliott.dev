// RED-until-01-02 — app/providers.tsx created by Plan 01-02.
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const PROVIDERS_PATH = path.resolve(__dirname, '../app/providers.tsx')

describe('app/providers.tsx — next-themes configuration (FND-06)', () => {
  it('exists', () => {
    expect(existsSync(PROVIDERS_PATH)).toBe(true)
  })

  it('is a client component', () => {
    const src = readFileSync(PROVIDERS_PATH, 'utf-8')
    expect(src).toMatch(/^\s*['"]use client['"]/)
  })

  it('configures ThemeProvider with defaultTheme="dark"', () => {
    const src = readFileSync(PROVIDERS_PATH, 'utf-8')
    expect(src).toMatch(/defaultTheme=["']dark["']/)
  })

  it('configures enableSystem={false} (v1 is dark-only)', () => {
    const src = readFileSync(PROVIDERS_PATH, 'utf-8')
    expect(src).toMatch(/enableSystem=\{false\}/)
  })

  it('configures attribute="class"', () => {
    const src = readFileSync(PROVIDERS_PATH, 'utf-8')
    expect(src).toMatch(/attribute=["']class["']/)
  })

  it('configures disableTransitionOnChange', () => {
    const src = readFileSync(PROVIDERS_PATH, 'utf-8')
    expect(src).toMatch(/disableTransitionOnChange/)
  })
})
