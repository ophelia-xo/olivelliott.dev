// tests/seo/favicon.test.ts
// MTA-04 — favicon set audit. Replaces Wave 0 placeholder (Plan 06-00).
// Asserts the 3 auto-wired files exist at app/ root, are valid binaries, and
// that the SVG honors the UI-SPEC § Favicon contract (glyph-as-path, oe
// monogram, two-token palette, a11y title+desc).
//
// Pattern 6 lock: NO manual <link rel="icon"> tags in app/layout.tsx —
// Next 16 file-system conventions auto-emit them.
import { readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const ROOT = path.resolve(__dirname, '..', '..')
const ICON_SVG = path.join(ROOT, 'app/icon.svg')
const APPLE_PNG = path.join(ROOT, 'app/apple-icon.png')
const FAVICON_ICO = path.join(ROOT, 'app/favicon.ico')
const LAYOUT_TSX = path.join(ROOT, 'app/layout.tsx')

describe('favicon set (MTA-04)', () => {
  it('Test 1 — all three files exist at app/ root', () => {
    expect(statSync(ICON_SVG).isFile()).toBe(true)
    expect(statSync(APPLE_PNG).isFile()).toBe(true)
    expect(statSync(FAVICON_ICO).isFile()).toBe(true)
  })

  it('Test 2 — favicon.ico is NOT the 25,931-byte create-next-app stub', () => {
    const size = statSync(FAVICON_ICO).size
    // Stub was exactly 25,931 bytes; the new oe-monogram ICO is path-rasterized
    // (1–10 KB typical). Any size ≠ 25931 proves the file was overwritten.
    expect(size).not.toBe(25931)
    // And a sanity floor — empty/truncated ICOs are < 256 B.
    expect(size).toBeGreaterThan(256)
  })

  it('Test 3 — icon.svg honors UI-SPEC § Favicon (oe monogram, two-token palette, a11y title+desc)', () => {
    const svg = readFileSync(ICON_SVG, 'utf8')
    expect(svg).toContain('<title>olivelliott.dev</title>')
    expect(svg).toMatch(/<desc>.*oe monogram.*<\/desc>/i)
    expect(svg).toContain('viewBox="0 0 32 32"')
    expect(svg).toContain('fill="#fbbf24"') // --color-accent
    expect(svg).toContain('fill="#0a0a0a"') // --color-bg
  })

  it('Test 4 — apple-icon.png is a 180×180 PNG (8-byte signature + IHDR width/height)', () => {
    const buf = readFileSync(APPLE_PNG)
    // PNG signature: 89 50 4E 47 0D 0A 1A 0A
    expect(buf[0]).toBe(0x89)
    expect(buf.subarray(1, 4).toString('ascii')).toBe('PNG')
    // IHDR chunk starts at byte 8 (length 4) + 'IHDR' (4) → width is at byte 16
    const width = buf.readUInt32BE(16)
    const height = buf.readUInt32BE(20)
    expect(width).toBe(180)
    expect(height).toBe(180)
  })

  it('Test 5 — favicon.ico is a valid multi-image ICO (Pitfall 10 lock)', () => {
    const buf = readFileSync(FAVICON_ICO)
    // ICONDIR: reserved (2) = 0, type (2) = 1 (ICO), count (2) ≥ 1
    expect(buf.readUInt16LE(0)).toBe(0) // reserved
    expect(buf.readUInt16LE(2)).toBe(1) // type = ICO
    const count = buf.readUInt16LE(4)
    expect(count).toBeGreaterThanOrEqual(1)
    // Pitfall 10: ICO should declare at least one 16×16 entry.
    // ICONDIRENTRY first byte is the width (0 means 256).
    const widths: number[] = []
    for (let i = 0; i < count; i++) {
      widths.push(buf.readUInt8(6 + i * 16))
    }
    expect(
      widths,
      `ICO entry widths must include 16 (Pitfall 10): ${widths.join('/')}`,
    ).toContain(16)
  })

  it('Test 6 — app/layout.tsx has NO manual <link rel="icon"> tags (Pattern 6: Next 16 auto-emits)', () => {
    const layout = readFileSync(LAYOUT_TSX, 'utf8')
    expect(
      /rel=["']icon["']/.test(layout),
      'layout.tsx must not declare rel="icon" — Next auto-wires from app/icon.svg + app/favicon.ico',
    ).toBe(false)
    expect(
      /rel=["']apple-touch-icon["']/.test(layout),
      'layout.tsx must not declare rel="apple-touch-icon" — Next auto-wires from app/apple-icon.png',
    ).toBe(false)
  })

  it('Test 7 — icon.svg has NO forbidden visual elements (UI-SPEC § Anti-Patterns)', () => {
    const svg = readFileSync(ICON_SVG, 'utf8')
    expect(
      /<linearGradient|<radialGradient/.test(svg),
      'gradients forbidden in favicon',
    ).toBe(false)
    expect(/<filter/.test(svg), 'filters (blur etc.) forbidden in favicon').toBe(
      false,
    )
    expect(
      /<animate/.test(svg),
      'animated favicons forbidden (UI-SPEC § Motion)',
    ).toBe(false)
    expect(
      /<text\b/.test(svg),
      'glyph-as-path lock — <text> forbidden (browsers do not load Geist for favicons)',
    ).toBe(false)
  })
})
