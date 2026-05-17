// tests/resume/pdf-build.test.ts
// Phase 5 Wave 4 (Plan 05-05) — structural tests for scripts/build-resume-pdf.ts.
//
// All assertions are pure source-grep against the script file — no Puppeteer
// execution, no `next start` spawn. The artifact-existence test (pdf-artifact.test.ts)
// is a separate gated file that runs only when RESUME_PDF_CHECK=1 or CI=true.
//
// 13 invariants lock the decision lineage from RESEARCH § Pattern 2 + Pitfalls 2/3/4/11:
//   - Imports puppeteer (full) + wait-on
//   - Emulates print media before navigation
//   - Uses preferCSSPageSize + printBackground (Pitfalls 2, 3)
//   - Registers SIGTERM cleanup (Pitfall 4)
//   - Does NOT import puppeteer-core or @sparticuz/chromium (USER OVERRIDE lock)
//   - Writes to public/resume.pdf
//   - Uses deterministic port 3057 + 127.0.0.1 (not localhost — IPv6 drift)
//   - Exports a callable `main` function (test seam from Wave 0)
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const scriptPath = path.resolve('scripts/build-resume-pdf.ts')

describe('Phase 5: scripts/build-resume-pdf.ts structural contract', () => {
  it('Test 1 — script file exists', () => {
    expect(
      existsSync(scriptPath),
      'scripts/build-resume-pdf.ts missing',
    ).toBe(true)
  })

  it('Test 2 — imports puppeteer (full package, not puppeteer-core)', () => {
    const src = readFileSync(scriptPath, 'utf8')
    expect(
      /from\s+['"]puppeteer['"]/.test(src),
      "must import from 'puppeteer' (full package per USER OVERRIDE)",
    ).toBe(true)
  })

  it('Test 3 — imports wait-on', () => {
    const src = readFileSync(scriptPath, 'utf8')
    expect(
      /from\s+['"]wait-on['"]/.test(src),
      "must import from 'wait-on' (HTTP readiness probe)",
    ).toBe(true)
  })

  it("Test 4 — emulates print media (emulateMediaType('print') — Pitfall 1, RES-03)", () => {
    const src = readFileSync(scriptPath, 'utf8')
    expect(
      /emulateMediaType\(\s*['"]print['"]\s*\)/.test(src),
      "must call page.emulateMediaType('print') before page.goto",
    ).toBe(true)
  })

  it('Test 5 — preferCSSPageSize: true (Pitfall 3 — CSS @page wins)', () => {
    const src = readFileSync(scriptPath, 'utf8')
    expect(
      /preferCSSPageSize:\s*true/.test(src),
      'must set preferCSSPageSize: true so @page in resume.css wins',
    ).toBe(true)
  })

  it('Test 6 — printBackground: true (Pitfall 2 — color fidelity)', () => {
    const src = readFileSync(scriptPath, 'utf8')
    expect(
      /printBackground:\s*true/.test(src),
      'must set printBackground: true (default false drops backgrounds)',
    ).toBe(true)
  })

  it("Test 7 — process cleanup: registers process.once('exit', …) AND calls server.kill (Pitfall 4)", () => {
    const src = readFileSync(scriptPath, 'utf8')
    expect(
      /process\.once\(\s*['"]exit['"]/.test(src),
      'must register exit handler to kill server',
    ).toBe(true)
    expect(
      /server\.kill\(/.test(src),
      'must call server.kill() to terminate next start',
    ).toBe(true)
  })

  it("Test 8 — does NOT import 'puppeteer-core' (USER OVERRIDE regression lock)", () => {
    const src = readFileSync(scriptPath, 'utf8')
    expect(
      src.includes("'puppeteer-core'") || src.includes('"puppeteer-core"'),
      "must not reference 'puppeteer-core' — USER OVERRIDE chose full puppeteer",
    ).toBe(false)
  })

  it("Test 9 — does NOT import '@sparticuz/chromium' (USER OVERRIDE regression lock)", () => {
    const src = readFileSync(scriptPath, 'utf8')
    expect(
      src.includes("'@sparticuz/chromium'") ||
        src.includes('"@sparticuz/chromium"'),
      "must not reference '@sparticuz/chromium' — USER OVERRIDE chose full puppeteer",
    ).toBe(false)
  })

  it('Test 10 — writes to public/resume.pdf (substring match for both segments)', () => {
    const src = readFileSync(scriptPath, 'utf8')
    expect(/['"]public['"]/.test(src), "must reference 'public' path").toBe(
      true,
    )
    expect(/['"]resume\.pdf['"]/.test(src), "must reference 'resume.pdf'").toBe(
      true,
    )
  })

  it('Test 11 — deterministic port 3057 (not random — macOS firewall prompts)', () => {
    const src = readFileSync(scriptPath, 'utf8')
    expect(/\b3057\b/.test(src), 'must use port 3057 (deterministic)').toBe(
      true,
    )
  })

  it("Test 12 — uses 127.0.0.1 literal (not 'localhost' — IPv6 drift)", () => {
    const src = readFileSync(scriptPath, 'utf8')
    expect(
      /127\.0\.0\.1/.test(src),
      "must bind to 127.0.0.1 (avoids ::1 IPv6 drift on 'localhost')",
    ).toBe(true)
  })

  it('Test 13 — exports a callable main function (preserves Wave 0 test seam)', () => {
    const src = readFileSync(scriptPath, 'utf8')
    expect(
      /export\s+(async\s+)?function\s+main/.test(src),
      'must export `main` so tests can import without triggering execution',
    ).toBe(true)
  })
})
