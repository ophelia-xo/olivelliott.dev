// RED-until-01-04 — components/site/skip-link.tsx created by Plan 01-04.
import { render, screen } from '@testing-library/react'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const SL_PATH = path.resolve(__dirname, '../components/site/skip-link.tsx')

describe('<SkipLink /> (FND-08)', () => {
  it('source file exists', () => {
    expect(existsSync(SL_PATH)).toBe(true)
  })

  it('renders an anchor targeting #main', async () => {
    const mod = await import('../components/site/skip-link')
    render(<mod.SkipLink />)
    const link = screen.getByRole('link', { name: /skip to content/i })
    expect(link).toHaveAttribute('href', '#main')
  })

  it('default class includes sr-only', async () => {
    const mod = await import('../components/site/skip-link')
    render(<mod.SkipLink />)
    const link = screen.getByRole('link', { name: /skip to content/i })
    expect(link.className).toMatch(/\bsr-only\b/)
  })

  it('reveals on focus via focus:not-sr-only utility', async () => {
    const mod = await import('../components/site/skip-link')
    render(<mod.SkipLink />)
    const link = screen.getByRole('link', { name: /skip to content/i })
    expect(link.className).toMatch(/\bfocus:not-sr-only\b/)
  })

  it('uses accent focus outline', async () => {
    const mod = await import('../components/site/skip-link')
    render(<mod.SkipLink />)
    const link = screen.getByRole('link', { name: /skip to content/i })
    expect(link.className).toMatch(/focus:(outline-accent|text-accent)/)
  })
})
