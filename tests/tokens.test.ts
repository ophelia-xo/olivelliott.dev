// RED-until-01-01 — styles/tokens.css is created by Plan 01-01.
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const TOKENS_PATH = path.resolve(__dirname, '../styles/tokens.css')

const REQUIRED_TOKENS: Record<string, string> = {
  '--color-bg': '#0a0a0a',
  '--color-surface-1': '#0a0a0a',
  '--color-surface-2': '#141414',
  '--color-hairline': '#1f1f1f',
  '--color-text-primary': '#f5f5f5',
  '--color-text-secondary': '#a3a3a3',
  '--color-text-tertiary': '#737373',
  '--color-text-on-accent': '#0a0a0a',
  '--color-accent': '#fbbf24',
  '--color-accent-hover': '#f59e0b',
  '--color-danger': '#f87171',
  '--motion-duration-fast': '120ms',
  '--motion-duration-base': '220ms',
  '--motion-duration-slow': '420ms',
  '--motion-ease-standard': 'cubic-bezier(0.22, 1, 0.36, 1)',
  '--radius-none': '0',
  '--radius-sm': '2px',
  '--radius-md': '6px',
  '--radius-lg': '12px',
  '--font-weight-regular': '400',
  '--font-weight-medium': '500',
  '--tracking-tight': '-0.02em',
  '--tracking-normal': '0em',
  '--tracking-wide': '0.02em',
  '--spacing': '0.25rem',
}

describe('styles/tokens.css — UI-SPEC Design Tokens contract', () => {
  it('exists', () => {
    expect(existsSync(TOKENS_PATH)).toBe(true)
  })

  it('declares @theme block', () => {
    const source = readFileSync(TOKENS_PATH, 'utf-8')
    expect(source).toMatch(/@theme\s*\{/)
  })

  for (const [name, value] of Object.entries(REQUIRED_TOKENS)) {
    it(`declares ${name}: ${value}`, () => {
      const source = readFileSync(TOKENS_PATH, 'utf-8')
      const pattern = new RegExp(
        `${name}\\s*:\\s*${value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*;`,
      )
      expect(source).toMatch(pattern)
    })
  }

  it('contains type-scale tokens (text-body, text-label, text-display)', () => {
    const source = readFileSync(TOKENS_PATH, 'utf-8')
    expect(source).toMatch(/--text-body\s*:\s*1rem/)
    expect(source).toMatch(/--text-label\s*:\s*0\.875rem/)
    expect(source).toMatch(/--text-display\s*:\s*clamp\(\s*2rem\s*,\s*5vw\s*,\s*3rem\s*\)/)
  })

  it('has no indigo/violet/purple color tokens (AI-aesthetic tell)', () => {
    const source = readFileSync(TOKENS_PATH, 'utf-8').toLowerCase()
    expect(source).not.toMatch(/--color-(indigo|violet|purple)/)
  })
})
