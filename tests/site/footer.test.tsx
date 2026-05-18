// tests/site/footer.test.tsx
// Plan 05-04 Task 1 — footer canonicalization + DownloadPdfLink insertion
// (CTC-01, CTC-02, RES-05 second surface). Replaces Wave 0 placeholder.
// Plan 07-03 updated: GitHub handle corrected `olivelliott` → `ophelia-xo`
// (the Phase 5 canonicalization picked the email local-part by mistake;
// Olive's actual GitHub handle is `ophelia-xo`). LinkedIn confirmed.
//
// 17 tests:
//   URL corrections (Tests 1–4)
//     1) GitHub icon link href === https://github.com/ophelia-xo
//     2) View-source link href === https://github.com/ophelia-xo/portfolio
//     3) Email icon link href === mailto:olivelliott48@gmail.com?subject=hi%20from%20olivelliott.dev
//        (Pitfall 5 — %20 NOT +; RFC 6068)
//     4) LinkedIn icon link href === https://www.linkedin.com/in/olivelliott (Plan 07-03 confirmed)
//   DownloadPdfLink insertion (Tests 5–8)
//     5) Footer contains <a href="/resume.pdf" download> (RES-05 second surface)
//     6) DownloadPdfLink textContent contains 'download.pdf' AND '↓' (literal glyph)
//     7) <span aria-hidden="true"> with textContent '·' sibling to the DownloadPdfLink
//     8) DOM order in right slot: icon-row UL → DownloadPdfLink → interpunct span → view-source anchor
//   Phase 1 regression (Tests 9–13)
//     9) <footer> element with border-t class (Phase 1 baseline)
//    10) Copyright text contains '© 2026 Olive Elliott'
//    11) Three icon links retain aria-labels ('GitHub', 'Email Olive', 'LinkedIn')
//    12) Each icon link still has p-3 (44×44 touch target)
//    13) View-source link text still says 'view source'
//   Source-grep guards (Tests 14–17 — mirrors tests/home/anti-patterns.test.ts comment-strip pattern)
//    14) components/site/footer.tsx does NOT contain 'use client' (footer stays RSC; Pitfall 7)
//    15) components/site/footer.tsx does NOT contain the old Phase-1 stem 'ophelia-x' followed by
//        a non-`o` character (Plan 07-03 regression guard — `ophelia-xo` is correct;
//        `ophelia-x` alone or `ophelia-x<other>` is the old mis-handle pattern)
//    16) components/site/footer.tsx does NOT contain literal 'subject=olivelliott.dev' (Phase 1 subject)
//    17) components/site/footer.tsx contains 'subject=hi%20from%20olivelliott.dev' exactly once
import fs from 'node:fs'
import path from 'node:path'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Footer } from '@/components/site/footer'

const SOURCE_PATH = path.resolve(__dirname, '../../components/site/footer.tsx')

/**
 * Strip /* block *\/ and // line comments from source so identifier greps
 * don't false-positive on intentional JSDoc breadcrumbs (mirrors
 * tests/home/anti-patterns.test.ts pattern; Plan 04-02 decision).
 */
function stripComments(src: string): string {
  const noBlock = src.replace(/\/\*[\s\S]*?\*\//g, '')
  return noBlock
    .split('\n')
    .map((line) => line.replace(/\/\/.*$/, ''))
    .join('\n')
}

describe('<Footer> — Plan 05-04 canonicalization + DownloadPdfLink (CTC-01, CTC-02, RES-05)', () => {
  // -- URL corrections ----------------------------------------------------

  it('Test 1: GitHub icon link href === https://github.com/ophelia-xo (canonical handle; CTC-01)', () => {
    const { container } = render(<Footer />)
    const link = container.querySelector('a[aria-label="GitHub"]')
    expect(link).not.toBeNull()
    expect(link?.getAttribute('href')).toBe('https://github.com/ophelia-xo')
  })

  it('Test 2: View-source link href === https://github.com/ophelia-xo/portfolio', () => {
    const { container } = render(<Footer />)
    const anchors = Array.from(container.querySelectorAll('a'))
    const viewSource = anchors.find((a) => a.textContent?.trim() === 'view source')
    expect(viewSource).toBeDefined()
    expect(viewSource?.getAttribute('href')).toBe('https://github.com/ophelia-xo/portfolio')
  })

  it('Test 3: Email icon link href === mailto:olivelliott48@gmail.com?subject=hi%20from%20olivelliott.dev (CTC-02; Pitfall 5)', () => {
    const { container } = render(<Footer />)
    const link = container.querySelector('a[aria-label="Email Olive"]')
    expect(link).not.toBeNull()
    expect(link?.getAttribute('href')).toBe(
      'mailto:olivelliott48@gmail.com?subject=hi%20from%20olivelliott.dev',
    )
  })

  it('Test 4: LinkedIn icon link href === https://www.linkedin.com/in/olivelliott (Plan 07-03 confirmed)', () => {
    const { container } = render(<Footer />)
    const link = container.querySelector('a[aria-label="LinkedIn"]')
    expect(link).not.toBeNull()
    expect(link?.getAttribute('href')).toBe('https://www.linkedin.com/in/olivelliott')
  })

  // -- DownloadPdfLink insertion ------------------------------------------

  it('Test 5: Footer contains <a href="/resume.pdf" download> (RES-05 second surface)', () => {
    const { container } = render(<Footer />)
    const download = container.querySelector('a[href="/resume.pdf"][download]')
    expect(download).not.toBeNull()
  })

  it("Test 6: DownloadPdfLink anchor's textContent contains 'download.pdf' AND '↓'", () => {
    const { container } = render(<Footer />)
    const download = container.querySelector('a[href="/resume.pdf"][download]')
    expect(download).not.toBeNull()
    const text = download?.textContent ?? ''
    expect(text).toContain('download.pdf')
    expect(text).toContain('↓')
  })

  it("Test 7: <span aria-hidden=\"true\"> with textContent '·' exists in the footer right slot", () => {
    const { container } = render(<Footer />)
    const spans = Array.from(container.querySelectorAll('span[aria-hidden="true"]'))
    const interpunct = spans.find((s) => s.textContent?.trim() === '·')
    expect(interpunct).toBeDefined()
  })

  it('Test 8: Right-slot DOM order is icon-row UL → DownloadPdfLink → interpunct → view-source', () => {
    const { container } = render(<Footer />)
    // The right slot is the second flex container inside the footer wrapper.
    const ul = container.querySelector('footer ul')
    const download = container.querySelector('a[href="/resume.pdf"][download]')
    const interpunct = Array.from(container.querySelectorAll('span[aria-hidden="true"]')).find(
      (s) => s.textContent?.trim() === '·',
    )
    const viewSource = Array.from(container.querySelectorAll('a')).find(
      (a) => a.textContent?.trim() === 'view source',
    )

    expect(ul).not.toBeNull()
    expect(download).not.toBeNull()
    expect(interpunct).toBeDefined()
    expect(viewSource).toBeDefined()

    // All four siblings share the same parent (the right-slot flex div).
    const parent = ul?.parentElement
    expect(parent).not.toBeNull()
    expect(download?.parentElement).toBe(parent)
    expect(interpunct?.parentElement).toBe(parent)
    expect(viewSource?.parentElement).toBe(parent)

    const children = Array.from(parent?.children ?? [])
    const ulIdx = children.indexOf(ul as Element)
    const downloadIdx = children.indexOf(download as Element)
    const interpunctIdx = children.indexOf(interpunct as Element)
    const viewSourceIdx = children.indexOf(viewSource as Element)

    expect(ulIdx).toBeGreaterThanOrEqual(0)
    expect(downloadIdx).toBeGreaterThan(ulIdx)
    expect(interpunctIdx).toBeGreaterThan(downloadIdx)
    expect(viewSourceIdx).toBeGreaterThan(interpunctIdx)
  })

  // -- Phase 1 regression -------------------------------------------------

  it("Test 9: Footer renders a <footer> element with 'border-t' class (Phase 1 baseline)", () => {
    const { container } = render(<Footer />)
    const footer = container.querySelector('footer')
    expect(footer).not.toBeNull()
    expect(footer?.className).toMatch(/\bborder-t\b/)
  })

  it("Test 10: Copyright text contains '© 2026 Olive Elliott'", () => {
    const { container } = render(<Footer />)
    expect(container.textContent).toContain('© 2026 Olive Elliott')
  })

  it("Test 11: Three icon links retain aria-labels ('GitHub', 'Email Olive', 'LinkedIn')", () => {
    const { container } = render(<Footer />)
    expect(container.querySelector('a[aria-label="GitHub"]')).not.toBeNull()
    expect(container.querySelector('a[aria-label="Email Olive"]')).not.toBeNull()
    expect(container.querySelector('a[aria-label="LinkedIn"]')).not.toBeNull()
  })

  it("Test 12: Each icon link still has 'p-3' (44×44 touch target padding from Phase 1)", () => {
    const { container } = render(<Footer />)
    const labels = ['GitHub', 'Email Olive', 'LinkedIn']
    for (const label of labels) {
      const link = container.querySelector(`a[aria-label="${label}"]`)
      expect(link, `expected icon link aria-label="${label}" to exist`).not.toBeNull()
      expect(link?.className).toMatch(/\bp-3\b/)
    }
  })

  it("Test 13: View-source link text still says 'view source'", () => {
    const { container } = render(<Footer />)
    const anchors = Array.from(container.querySelectorAll('a'))
    const viewSource = anchors.find((a) => a.textContent?.trim() === 'view source')
    expect(viewSource).toBeDefined()
  })

  // -- Source-grep guards -------------------------------------------------

  it("Test 14: components/site/footer.tsx source does NOT contain a 'use client' directive (Pitfall 7)", () => {
    const src = fs.readFileSync(SOURCE_PATH, 'utf8')
    const stripped = stripComments(src)
    // Match a real directive line — not a substring inside a comment or string.
    expect(stripped).not.toMatch(/^\s*['"]use client['"];?\s*$/m)
  })

  it("Test 15: components/site/footer.tsx source does NOT contain the Phase-1 mis-handle stem 'ophelia-x' followed by anything other than 'o' AND no 'github.com/olivelliott' (Plan 07-03 canonicalization correction)", () => {
    const src = fs.readFileSync(SOURCE_PATH, 'utf8')
    const stripped = stripComments(src)
    // The real handle is `ophelia-xo`. The Phase-1 placeholder was `ophelia-x`.
    // Match the bare stem or any non-`o` continuation as the regression signal.
    expect(stripped).not.toMatch(/ophelia-x(?!o)/)
    // The Phase-5 mis-canonicalization landed on `olivelliott` in github URLs.
    // Plan 07-03 corrected this; guard against re-introduction.
    expect(stripped).not.toMatch(/github\.com\/olivelliott/)
  })

  it("Test 16: components/site/footer.tsx source does NOT contain the Phase 1 literal 'subject=olivelliott.dev' (subject is now flipped)", () => {
    const src = fs.readFileSync(SOURCE_PATH, 'utf8')
    const stripped = stripComments(src)
    expect(stripped).not.toContain('subject=olivelliott.dev')
  })

  it("Test 17: components/site/footer.tsx source contains 'subject=hi%20from%20olivelliott.dev' exactly once (CTC-02 lock)", () => {
    const src = fs.readFileSync(SOURCE_PATH, 'utf8')
    const stripped = stripComments(src)
    const matches = stripped.match(/subject=hi%20from%20olivelliott\.dev/g) ?? []
    expect(matches.length).toBe(1)
  })
})
