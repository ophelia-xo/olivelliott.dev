// RED-until-01-04 — components/site/nav-link.tsx created by Plan 01-04.
import { render, screen } from '@testing-library/react'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const NL_PATH = path.resolve(__dirname, '../components/site/nav-link.tsx')

let mockPathname = '/'
vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
}))

describe('<NavLink /> (FND-08 — active route detection)', () => {
  beforeEach(() => {
    mockPathname = '/'
  })

  it('source file exists', () => {
    expect(existsSync(NL_PATH)).toBe(true)
  })

  it('is a client component', () => {
    const src = readFileSync(NL_PATH, 'utf-8')
    expect(src).toMatch(/^\s*['"]use client['"]/)
  })

  it('renders label and href', async () => {
    const mod = await import('../components/site/nav-link')
    render(<mod.NavLink href="/projects" label="projects" />)
    const link = screen.getByRole('link', { name: /projects/i })
    expect(link).toHaveAttribute('href', '/projects')
  })

  it('marks active route with aria-current="page" when pathname matches href', async () => {
    mockPathname = '/projects'
    const mod = await import('../components/site/nav-link')
    render(<mod.NavLink href="/projects" label="projects" />)
    const link = screen.getByRole('link', { name: /projects/i })
    expect(link).toHaveAttribute('aria-current', 'page')
  })

  it('does not mark aria-current on inactive route', async () => {
    mockPathname = '/'
    const mod = await import('../components/site/nav-link')
    render(<mod.NavLink href="/projects" label="projects" />)
    const link = screen.getByRole('link', { name: /projects/i })
    expect(link).not.toHaveAttribute('aria-current', 'page')
  })
})
