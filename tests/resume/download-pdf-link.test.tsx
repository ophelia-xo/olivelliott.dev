// tests/resume/download-pdf-link.test.tsx
// Plan 05-02 Task 01 — DownloadPdfLink contract.
// 4 render tests + 3 source-grep tests (RSC + no motion + no Lucide).
// The source-grep tests use the comment-stripping pattern from
// tests/home/anti-patterns.test.ts so JSDoc breadcrumbs that intentionally
// name absent APIs ('NO Lucide', 'no motion') do not false-positive.
// Refs: UI-SPEC § Component 10; § Print Stylesheet Contract; § Anti-Patterns;
//       RESEARCH § Pitfall 7.
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DownloadPdfLink } from '@/components/resume/download-pdf-link'

const SOURCE_PATH = path.resolve(
  __dirname,
  '..',
  '..',
  'components',
  'resume',
  'download-pdf-link.tsx',
)

function readStrippedSource(): string {
  expect(existsSync(SOURCE_PATH), 'download-pdf-link.tsx must exist').toBe(true)
  const src = readFileSync(SOURCE_PATH, 'utf8')
  // Strip /* block */ AND // line comments before identifier match.
  return src
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .map((line) => line.replace(/\/\/.*$/, ''))
    .join('\n')
}

function readRawSource(): string {
  expect(existsSync(SOURCE_PATH), 'download-pdf-link.tsx must exist').toBe(true)
  return readFileSync(SOURCE_PATH, 'utf8')
}

describe('<DownloadPdfLink>', () => {
  it('Test 1 — renders an <a> with href="/resume.pdf" AND download attribute (RES-05)', () => {
    const { container } = render(<DownloadPdfLink />)
    const anchor = container.querySelector('a')
    expect(anchor).not.toBeNull()
    expect(anchor?.getAttribute('href')).toBe('/resume.pdf')
    // download attribute present even with no value
    expect(anchor?.hasAttribute('download')).toBe(true)
  })

  it('Test 2 — visible text is exactly "download.pdf ↓" (literal Unicode U+2193, not a Lucide icon)', () => {
    const { container } = render(<DownloadPdfLink />)
    const anchor = container.querySelector('a')
    expect(anchor?.textContent).toBe('download.pdf ↓')
  })

  it('Test 3 — has class "download-pdf-link" (print-rule hook for display:none)', () => {
    const { container } = render(<DownloadPdfLink />)
    const anchor = container.querySelector('a')!
    expect(anchor.classList.contains('download-pdf-link')).toBe(true)
  })

  it('Test 4 — accepts className prop and merges into the rendered class string', () => {
    const { container } = render(<DownloadPdfLink className="absolute top-4 right-4" />)
    const anchor = container.querySelector('a')!
    const classes = anchor.className
    expect(classes).toContain('absolute')
    expect(classes).toContain('top-4')
    expect(classes).toContain('right-4')
    // Core class still present after merge
    expect(anchor.classList.contains('download-pdf-link')).toBe(true)
  })

  it('Test 5 — source does NOT contain "use client" directive (RSC component — Pitfall 7)', () => {
    const raw = readRawSource()
    // Match the directive shape (a line that is just 'use client'; or "use client";)
    const directive = /^\s*['"]use client['"];?\s*$/m
    expect(directive.test(raw)).toBe(false)
  })

  it('Test 6 — source does NOT import from motion/react or motion (no motion island)', () => {
    const code = readStrippedSource()
    expect(/from\s+['"]motion\/react['"]/.test(code)).toBe(false)
    expect(/from\s+['"]motion['"]/.test(code)).toBe(false)
  })

  it('Test 7 — source does NOT import from lucide-react (↓ is literal Unicode)', () => {
    const code = readStrippedSource()
    expect(/from\s+['"]lucide-react['"]/.test(code)).toBe(false)
  })
})
