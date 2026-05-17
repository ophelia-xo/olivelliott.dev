// tests/about/about-page.test.tsx
// Plan 05-03 Task 3 — /about route integration (ABT-01, ABT-02, ABT-03, CTC-03).
// Replaces Wave 0 placeholder. 15 tests:
//   1) renders without throwing
//   2) exactly one <h1> with textContent 'about'
//   3) exactly three <h2> in locked order
//   4) 'who I am' eyebrow is <p id="who-i-am-eyebrow"> NOT h2
//   5) four <section> elements with correct aria-labelledby ids
//   6) AboutBio rendered (Aktiga substring inside a <p>)
//   7) ProjectPillRow rendered (nav[aria-label="Featured projects"])
//   8) ContactStack rendered (mailto with locked subject — Pitfall 5)
//   9) ValuesList rendered (locked <dt> 'polymath')
//  10) framing paragraph contains 'Three projects are getting most of my focus right now'
//  11) metadata.title === 'about'
//  12) metadata.openGraph.images declared
//  13) metadata.description contains 'Aktiga' AND ('autonomous workflows' OR 'autonomous-workflows')
//  14) source-grep: no 'use client'
//  15) source-grep: no motion/react or lucide-react imports
import fs from 'node:fs'
import path from 'node:path'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import AboutPage, { metadata } from '@/app/(site)/about/page'

const SOURCE_PATH = path.resolve(__dirname, '../../app/(site)/about/page.tsx')

describe('/about route', () => {
  it('renders without throwing', () => {
    expect(() => render(<AboutPage />)).not.toThrow()
  })

  it('renders exactly one <h1> with textContent "about"', () => {
    const { container } = render(<AboutPage />)
    const h1s = container.querySelectorAll('h1')
    expect(h1s.length).toBe(1)
    expect(h1s[0]?.textContent?.trim()).toBe('about')
  })

  it("renders exactly three <h2> elements with textContents ['what I'm working on', 'how to reach me', 'values'] in order", () => {
    const { container } = render(<AboutPage />)
    const h2Texts = Array.from(container.querySelectorAll('h2')).map((h) =>
      h.textContent?.trim(),
    )
    expect(h2Texts).toEqual(["what I'm working on", 'how to reach me', 'values'])
  })

  it("'who I am' eyebrow is a <p id=\"who-i-am-eyebrow\">, NOT an <h2>", () => {
    const { container } = render(<AboutPage />)
    const eyebrow = container.querySelector('#who-i-am-eyebrow')
    expect(eyebrow).not.toBeNull()
    expect(eyebrow?.tagName).toBe('P')
    expect(eyebrow?.textContent?.trim()).toBe('who I am')
  })

  it('renders four <section> elements with the correct aria-labelledby ids', () => {
    const { container } = render(<AboutPage />)
    const sections = Array.from(container.querySelectorAll('section'))
    expect(sections.length).toBe(4)
    const ids = sections.map((s) => s.getAttribute('aria-labelledby'))
    expect(ids).toEqual([
      'who-i-am-eyebrow',
      'working-on-eyebrow',
      'reach-me-eyebrow',
      'values-eyebrow',
    ])
  })

  it('AboutBio is rendered (Aktiga substring appears in a <p>)', () => {
    const { container } = render(<AboutPage />)
    const paragraphs = Array.from(container.querySelectorAll('p'))
    const hasAktiga = paragraphs.some((p) => p.textContent?.includes('Aktiga'))
    expect(hasAktiga).toBe(true)
  })

  it('ProjectPillRow is rendered (nav[aria-label="Featured projects"])', () => {
    const { container } = render(<AboutPage />)
    const nav = container.querySelector('nav[aria-label="Featured projects"]')
    expect(nav).not.toBeNull()
  })

  it('ContactStack is rendered (mailto link with locked %20-encoded subject — Pitfall 5)', () => {
    const { container } = render(<AboutPage />)
    // CSS attribute selectors don't reliably escape `%` — walk the anchor
    // list and match the locked href via getAttribute.
    const mailtoAnchors = Array.from(
      container.querySelectorAll('a[href^="mailto:"]'),
    )
    const match = mailtoAnchors.find(
      (a) =>
        a.getAttribute('href') ===
        'mailto:olivelliott48@gmail.com?subject=hi%20from%20olivelliott.dev',
    )
    expect(match).toBeDefined()
  })

  it("ValuesList is rendered (one of the locked <dt> values 'polymath' is present)", () => {
    const { container } = render(<AboutPage />)
    const dts = Array.from(container.querySelectorAll('dt')).map((d) => d.textContent?.trim())
    expect(dts).toContain('polymath')
  })

  it("framing paragraph above the pill row contains 'Three projects are getting most of my focus right now'", () => {
    const { container } = render(<AboutPage />)
    const text = container.textContent ?? ''
    expect(text).toContain('Three projects are getting most of my focus right now')
  })

  it("metadata.title === 'about'", () => {
    expect(metadata.title).toBe('about')
  })

  it('metadata.openGraph.images is undefined — sibling app/(site)/about/opengraph-image.tsx owns it (Phase 6 Pitfall 4 cleanup)', () => {
    // Plan 06-02 Task 2 — manual openGraph.images was DELETED. The
    // sibling opengraph-image.tsx is now the source of truth in Next 16.
    expect(metadata.openGraph).toBeDefined()
    const images = (metadata.openGraph as { images?: unknown })?.images
    expect(
      images,
      '/about must NOT declare openGraph.images — sibling opengraph-image.tsx wins.',
    ).toBeUndefined()
  })

  it("metadata.description contains 'Aktiga' AND ('autonomous workflows' OR 'autonomous-workflows')", () => {
    const description = metadata.description ?? ''
    expect(description).toMatch(/Aktiga/)
    expect(description).toMatch(/autonomous[ -]workflows?/i)
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
