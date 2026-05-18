// tests/projects/project-hero.test.tsx
// Refs: 03-UI-SPEC § Component Inventory #1 (ProjectHero) + § Hero Variants.
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ProjectHero } from '@/components/projects/project-hero'

const COMMON = {
  title: 'Myco',
  tagline: 'A persistent cognitive layer.',
  year: 2025,
  tags: ['local-first', 'typescript'] as const,
}

describe('<ProjectHero>', () => {
  it('Variant A (image-present): renders <img> with sizes="(min-width: 768px) 50vw, 100vw"', () => {
    const { container } = render(
      <ProjectHero
        {...COMMON}
        visibility="public"
        repoUrl="https://github.com/ophelia-xo/myco"
        hero={{ src: '/images/projects/myco/cover.png', alt: 'Cover artwork' }}
      />
    )
    const img = container.querySelector('img')
    expect(img).not.toBeNull()
    expect(img!.getAttribute('alt')).toBe('Cover artwork')
    expect(img!.getAttribute('sizes')).toBe('(min-width: 768px) 50vw, 100vw')
  })

  it('Variant A: <header> uses md:grid + md:grid-cols-12', () => {
    const { container } = render(
      <ProjectHero
        {...COMMON}
        visibility="public"
        repoUrl="https://github.com/ophelia-xo/myco"
        hero={{ src: '/images/projects/myco/cover.png', alt: 'Cover artwork' }}
      />
    )
    const header = container.querySelector('header')!
    expect(header.className).toMatch(/md:grid\b/)
    expect(header.className).toMatch(/md:grid-cols-12/)
  })

  it('Variant B (placeholder hero): renders NO <img> anywhere — Myco currently triggers this', () => {
    const { container } = render(
      <ProjectHero
        {...COMMON}
        visibility="public"
        repoUrl="https://github.com/ophelia-xo/myco"
        hero={{
          src: '/images/projects/myco/hero-placeholder.png',
          alt: 'Myco placeholder',
        }}
      />
    )
    expect(container.querySelector('img')).toBeNull()
  })

  it('Variant B: still renders <h1> with the project title at display ramp', () => {
    const { container } = render(
      <ProjectHero
        {...COMMON}
        visibility="public"
        repoUrl="https://x"
        hero={{ src: '/images/projects/myco/hero-placeholder.png', alt: 'a' }}
      />
    )
    const h1 = container.querySelector('h1')!
    expect(h1.textContent).toBe('Myco')
    const cls = h1.className
    // Display ramp uses --text-display token OR text-display-derived class.
    // We assert the locked CSS variable is referenced by the className stack.
    expect(cls).toMatch(/text-\[var\(--text-display\)\]|text-display/)
  })

  it('Variant B: renders tagline as <p> with text-secondary color class', () => {
    const { container } = render(
      <ProjectHero
        {...COMMON}
        visibility="public"
        repoUrl="https://x"
        hero={{ src: '/images/projects/myco/hero-placeholder.png', alt: 'a' }}
      />
    )
    const p = Array.from(container.querySelectorAll('p')).find(
      (el) => el.textContent === COMMON.tagline
    )!
    expect(p).toBeDefined()
    expect(p.className).toContain('text-[color:var(--color-text-secondary)]')
  })

  it('hero composes <ProjectMeta> (role=list aria-label="Project metadata")', () => {
    const { container } = render(
      <ProjectHero
        {...COMMON}
        visibility="public"
        repoUrl="https://x"
        hero={{ src: '/images/projects/myco/hero-placeholder.png', alt: 'a' }}
      />
    )
    const row = container.querySelector('[role="list"][aria-label="Project metadata"]')
    expect(row).not.toBeNull()
  })

  it('renders exactly one <h1> with the project title', () => {
    const { container } = render(
      <ProjectHero
        {...COMMON}
        visibility="public"
        repoUrl="https://x"
        hero={{ src: '/images/projects/myco/hero-placeholder.png', alt: 'a' }}
      />
    )
    const h1s = container.querySelectorAll('h1')
    expect(h1s.length).toBe(1)
    expect(h1s[0]?.textContent).toBe('Myco')
  })

  it('hero root is a semantic <header> element', () => {
    const { container } = render(
      <ProjectHero
        {...COMMON}
        visibility="public"
        repoUrl="https://x"
        hero={{ src: '/images/projects/myco/hero-placeholder.png', alt: 'a' }}
      />
    )
    expect(container.firstElementChild?.tagName).toBe('HEADER')
  })
})
