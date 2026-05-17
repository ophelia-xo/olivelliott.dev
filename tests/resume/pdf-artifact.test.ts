// tests/resume/pdf-artifact.test.ts
// Phase 5 Wave 4 (Plan 05-05) — gated artifact contract for /public/resume.pdf.
//
// Source: RESEARCH § Example 6 (Magic Bytes + Size) + 1 bonus stub-replacement lock.
//
// Runs ONLY when RESUME_PDF_CHECK=1 or CI=true. In a normal `pnpm vitest run`
// the suite is skipped — dev runs should not flake on the PDF's absence
// (it only exists after `pnpm build` has invoked the postbuild script).
//
// Verifies RES-04 end-to-end: the artifact exists, has %PDF- magic bytes,
// is sized within the expected band, and is NOT the Wave 0 16-byte stub.
import { existsSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const PDF_PATH = path.resolve('public/resume.pdf')
const shouldRun =
  process.env.CI === 'true' || process.env.RESUME_PDF_CHECK === '1'

describe.skipIf(!shouldRun)('Phase 5: /public/resume.pdf artifact contract', () => {
  it('Test 1 — exists', () => {
    expect(
      existsSync(PDF_PATH),
      'public/resume.pdf not generated — run pnpm build (postbuild hook)',
    ).toBe(true)
  })

  it('Test 2 — starts with %PDF- magic bytes', () => {
    const buf = readFileSync(PDF_PATH)
    const head = buf.subarray(0, 5).toString('ascii')
    expect(head, `PDF magic bytes missing: got "${head}"`).toBe('%PDF-')
  })

  it('Test 3 — size is between 20 KB and 400 KB (rejects empty stub or bloated output)', () => {
    const { size } = statSync(PDF_PATH)
    expect(
      size,
      `unexpected size: ${size} bytes (expected 20KB–400KB)`,
    ).toBeGreaterThanOrEqual(20_000)
    expect(size).toBeLessThanOrEqual(400_000)
  })

  it('Test 4 — file is NOT the Wave 0 stub (size > 1024 bytes)', () => {
    // The Wave 0 stub was 16 bytes (%PDF-1.7\n%%EOF\n). The real PDF is ≥ 20 KB.
    // This is a stronger lock than the size band because it catches "stub still
    // present" specifically — even if someone changed the band defaults, this
    // test traps reverting to a placeholder.
    const { size } = statSync(PDF_PATH)
    expect(
      size,
      `PDF appears to be the Wave 0 stub (${size} bytes) — postbuild did not run`,
    ).toBeGreaterThan(1024)
  })
})
