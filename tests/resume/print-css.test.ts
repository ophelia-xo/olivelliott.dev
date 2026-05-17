// tests/resume/print-css.test.ts
// Plan 05-02 Task 03 — app/resume/resume.css contract source-grep.
// 8 tests: file exists, single @media print block, @page A4 + 0.5in,
// print-color-adjust: exact (Pitfall 2), display:none chrome (download +
// skip + nav + footer), page-break-inside: avoid on sections + entries,
// link underline in print (accent stripped), and Pitfall 8 — no bare
// html/body rules outside @media print.
// Refs: UI-SPEC § Print Stylesheet Contract; RESEARCH § Pitfall 2, 3, 8;
//       RES-03.
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const CSS_PATH = path.resolve(
  __dirname,
  '..',
  '..',
  'app',
  'resume',
  'resume.css',
)

function readStripped(): string {
  expect(existsSync(CSS_PATH), 'app/resume/resume.css must exist').toBe(true)
  // CSS only uses /* */ comments. Strip them before identifier match so
  // comment breadcrumbs don't false-positive on guards like Pitfall 8.
  return readFileSync(CSS_PATH, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
}

function readRaw(): string {
  expect(existsSync(CSS_PATH), 'app/resume/resume.css must exist').toBe(true)
  return readFileSync(CSS_PATH, 'utf8')
}

describe('app/resume/resume.css contract', () => {
  it('Test 1 — file exists at app/resume/resume.css', () => {
    expect(existsSync(CSS_PATH)).toBe(true)
  })

  it('Test 2 — contains exactly one "@media print {" opening token (single print block)', () => {
    const src = readStripped()
    const matches = src.match(/@media\s+print\s*\{/g) ?? []
    expect(matches.length).toBe(1)
  })

  it('Test 3 — contains @page with size: A4 AND margin: 0.5in (RES-03 + Pitfall 3: geometry in CSS, not script)', () => {
    const src = readStripped()
    expect(/@page\s*\{[^}]*\}/s.test(src)).toBe(true)
    expect(/size:\s*A4/i.test(src)).toBe(true)
    expect(/margin:\s*0\.5in/i.test(src)).toBe(true)
  })

  it('Test 4 — declares print-color-adjust: exact AND -webkit-print-color-adjust: exact (Pitfall 2)', () => {
    const src = readStripped()
    expect(/\bprint-color-adjust:\s*exact\b/.test(src)).toBe(true)
    expect(/-webkit-print-color-adjust:\s*exact\b/.test(src)).toBe(true)
  })

  it('Test 5 — hides chrome in print: .download-pdf-link, .skip-link, nav, footer with display: none', () => {
    const src = readStripped()
    // Extract the @media print block to scope the assertion.
    const printBlockMatch = src.match(/@media\s+print\s*\{([\s\S]*)\}\s*$/m)
    expect(printBlockMatch, 'Could not isolate the @media print block').not.toBeNull()
    const printBlock = printBlockMatch![1]!

    // The chrome-hide rule must mention all four selectors AND apply display: none.
    expect(/\.download-pdf-link/.test(printBlock)).toBe(true)
    expect(/\.skip-link/.test(printBlock)).toBe(true)
    expect(/\bnav\b/.test(printBlock)).toBe(true)
    expect(/\bfooter\b/.test(printBlock)).toBe(true)
    // At least one display: none rule lives inside the print block.
    expect(/display:\s*none/i.test(printBlock)).toBe(true)
  })

  it('Test 6 — declares page-break-inside: avoid on .resume section AND on .resume-entry', () => {
    const src = readStripped()
    // The rule may be written as `.resume section { page-break-inside: avoid; }` etc.
    expect(/\.resume\s+section\s*\{[^}]*page-break-inside:\s*avoid/s.test(src)).toBe(
      true,
    )
    expect(/\.resume-entry\s*\{[^}]*page-break-inside:\s*avoid/s.test(src)).toBe(true)
  })

  it('Test 7 — .resume a in print mode uses text-decoration: underline (accent stripped, underline is the affordance)', () => {
    const src = readStripped()
    const printBlockMatch = src.match(/@media\s+print\s*\{([\s\S]*)\}\s*$/m)
    expect(printBlockMatch).not.toBeNull()
    const printBlock = printBlockMatch![1]!
    // .resume a rule with text-decoration: underline inside @media print.
    expect(/\.resume\s+a\s*\{[^}]*text-decoration:\s*underline/s.test(printBlock)).toBe(
      true,
    )
  })

  it('Test 8 — Pitfall 8 lock: NO bare html { ... } or body { ... } rule outside the @media print block (cross-route leakage guard)', () => {
    const src = readStripped()
    // Split on @media print to isolate the pre-block region.
    const idx = src.search(/@media\s+print\s*\{/)
    expect(idx, '@media print not found').toBeGreaterThan(-1)
    const preBlock = src.slice(0, idx)

    // Strip remaining inline whitespace and look for bare html or body rules
    // (selector lines that are JUST `html {` or `body {` or `html, body {`).
    // We use a multi-line regex anchored at line starts after stripping leading
    // whitespace on each line.
    const lines = preBlock.split('\n').map((l) => l.trim())
    for (const line of lines) {
      // Match a selector that starts with bare html or body (possibly with
      // siblings like `html, body`) followed by `{`. Skip lines that don't
      // open a rule block.
      expect(
        /^(html|body)(\s*,\s*(html|body))*\s*\{/.test(line),
        `Bare html/body rule found OUTSIDE @media print (Pitfall 8 lock): "${line}"`,
      ).toBe(false)
    }

    // Sanity: the raw file should NOT contain a bare top-level html { rule.
    // (Comment-stripped src above prevents docstring false-positives.)
    expect(/^\s*html\s*\{/m.test(preBlock)).toBe(false)
    expect(/^\s*body\s*\{/m.test(preBlock)).toBe(false)
  })
})
