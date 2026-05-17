// tests/about/project-pill-row.test.tsx
// Plan 05-03 Task 2 — ProjectPillRow (ABT-01).
// Replaces Wave 0 placeholder. 8 tests:
//   1) renders inside <nav aria-label="Featured projects">
//   2) <li> count matches getHeroProjects().length (real helper, no mock)
//   3) each pill's href === /projects/{slug}
//   4) each pill's textContent === project.title from data
//   5) pill classes include Phase 3 chip class subset
//   6) source-grep: NOT importing TagChipRow (Pitfall 3-style separation)
//   7) source-grep: no 'use client'
//   8) source-grep: no motion/react or lucide-react import
import fs from 'node:fs'
import path from 'node:path'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ProjectPillRow } from '@/components/about/project-pill-row'
import { getHeroProjects } from '@/lib/projects'

const SOURCE_PATH = path.resolve(__dirname, '../../components/about/project-pill-row.tsx')

describe('<ProjectPillRow>', () => {
  it('renders inside <nav aria-label="Featured projects">', () => {
    const { container } = render(<ProjectPillRow />)
    const nav = container.querySelector('nav[aria-label="Featured projects"]')
    expect(nav).not.toBeNull()
  })

  it('<li> count matches getHeroProjects().length', () => {
    const { container } = render(<ProjectPillRow />)
    const items = container.querySelectorAll('li')
    expect(items.length).toBe(getHeroProjects().length)
    // Sanity: at least Myco is currently a hero — fail loudly if data
    // pipeline regresses such that hero projects vanish.
    expect(items.length).toBeGreaterThan(0)
  })

  it('each pill is an <a> whose href === /projects/{slug}', () => {
    const { container } = render(<ProjectPillRow />)
    const projects = getHeroProjects()
    const anchors = Array.from(container.querySelectorAll('li > a'))
    expect(anchors.length).toBe(projects.length)
    for (const project of projects) {
      const match = anchors.find((a) => a.getAttribute('href') === `/projects/${project.slug}`)
      expect(match, `pill anchor for slug ${project.slug}`).toBeDefined()
    }
  })

  it("each pill's textContent === project.title (verbatim from data; CSS lowercases visually)", () => {
    const { container } = render(<ProjectPillRow />)
    const projects = getHeroProjects()
    const anchors = Array.from(container.querySelectorAll('li > a'))
    for (const project of projects) {
      const match = anchors.find((a) => a.textContent?.trim() === project.title)
      expect(match, `pill for project ${project.title}`).toBeDefined()
    }
  })

  it('pill classes include Phase 3 chip class subset (mono + label + lowercase + surface-2 + px-3 py-2 -my-2 rounded-sm)', () => {
    const { container } = render(<ProjectPillRow />)
    const anchors = Array.from(container.querySelectorAll('li > a'))
    expect(anchors.length).toBeGreaterThan(0)
    for (const a of anchors) {
      const cls = a.className
      expect(cls).toMatch(/\bfont-mono\b/)
      expect(cls).toMatch(/text-\[var\(--text-label\)\]/)
      expect(cls).toMatch(/\blowercase\b/)
      expect(cls).toMatch(/bg-\[color:var\(--color-surface-2\)\]/)
      expect(cls).toMatch(/\bpx-3\b/)
      expect(cls).toMatch(/\bpy-2\b/)
      expect(cls).toMatch(/-my-2/)
      expect(cls).toMatch(/\brounded-sm\b/)
    }
  })

  it('source file does NOT import TagChipRow (Pitfall 3-style separation lock)', () => {
    const src = fs.readFileSync(SOURCE_PATH, 'utf8')
    expect(src).not.toMatch(/TagChipRow/)
    expect(src).not.toMatch(/tag-chip-row/)
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
