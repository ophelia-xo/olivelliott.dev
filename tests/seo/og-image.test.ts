// tests/seo/og-image.test.ts
// MTA-02 — OG image surface audit. Pitfall 12: OG images can't render in jsdom
// (ImageResponse returns a Response, not JSX). We assert file existence,
// exported constants, runtime/display constraints (Pitfalls 1, 2), and
// UI-SPEC LOCKED title strings via source-grep.
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-template'

const ROOT = path.resolve(__dirname, '..', '..')

const OG_FILES = [
  'app/opengraph-image.tsx',
  'app/opengraph-image.alt.txt',
  'app/(site)/about/opengraph-image.tsx',
  'app/(site)/projects/opengraph-image.tsx',
  'app/resume/opengraph-image.tsx',
  'app/(site)/projects/[slug]/opengraph-image.tsx',
]

const PER_ROUTE_TSX = [
  'app/opengraph-image.tsx',
  'app/(site)/about/opengraph-image.tsx',
  'app/(site)/projects/opengraph-image.tsx',
  'app/resume/opengraph-image.tsx',
]

const DYNAMIC_TSX = 'app/(site)/projects/[slug]/opengraph-image.tsx'

const LOCKED_TITLES: Record<string, string> = {
  'app/opengraph-image.tsx':
    'olive elliott — engineer building tools for autonomy',
  'app/(site)/about/opengraph-image.tsx': 'about — olive elliott',
  'app/(site)/projects/opengraph-image.tsx': 'selected work',
  'app/resume/opengraph-image.tsx': 'resume — olive elliott',
}

describe('OG image surface (MTA-02)', () => {
  it('Test 1 — all 6 OG files exist on disk', () => {
    for (const rel of OG_FILES) {
      expect(existsSync(path.join(ROOT, rel)), `missing ${rel}`).toBe(true)
    }
  })

  it('Test 2 — lib/og-template.tsx exports OG_SIZE 1200×630 + OG_CONTENT_TYPE image/png', () => {
    expect(OG_SIZE.width).toBe(1200)
    expect(OG_SIZE.height).toBe(630)
    expect(OG_CONTENT_TYPE).toBe('image/png')
  })

  it('Test 3 — every per-route sibling OG exports default, alt, size, contentType (source-grep)', () => {
    for (const rel of PER_ROUTE_TSX) {
      const src = readFileSync(path.join(ROOT, rel), 'utf8')
      expect(
        /export\s+default\s+async\s+function\s+Image/.test(src),
        `${rel} missing default Image export`,
      ).toBe(true)
      expect(
        /export\s+const\s+alt\s*=/.test(src),
        `${rel} missing 'alt' export`,
      ).toBe(true)
      expect(
        /export\s+const\s+size\s*=/.test(src),
        `${rel} missing 'size' export`,
      ).toBe(true)
      expect(
        /export\s+const\s+contentType\s*=/.test(src),
        `${rel} missing 'contentType' export`,
      ).toBe(true)
    }
  })

  it('Test 4 — [slug] OG exports generateImageMetadata + default Image (Pattern 2)', () => {
    const src = readFileSync(path.join(ROOT, DYNAMIC_TSX), 'utf8')
    expect(
      /export\s+async\s+function\s+generateImageMetadata/.test(src),
      '[slug] OG missing generateImageMetadata',
    ).toBe(true)
    expect(
      /export\s+default\s+async\s+function\s+Image/.test(src),
      '[slug] OG missing default Image',
    ).toBe(true)
  })

  it('Test 5 — Pitfall 2 lock: NO OG file declares runtime = edge', () => {
    for (const rel of [...PER_ROUTE_TSX, DYNAMIC_TSX, 'lib/og-template.tsx']) {
      const raw = readFileSync(path.join(ROOT, rel), 'utf8')
      const src = raw
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/^\s*\/\/.*$/gm, '')
      expect(
        /export\s+const\s+runtime\s*=\s*['"]edge['"]/.test(src),
        `${rel} opted into Edge runtime — Pitfall 2 lock (Node.js is default in Next 16 and required for readFile)`,
      ).toBe(false)
    }
  })

  it('Test 6 — Pitfall 1 lock: NO OG file uses display: grid (Satori forbids)', () => {
    for (const rel of [...PER_ROUTE_TSX, DYNAMIC_TSX, 'lib/og-template.tsx']) {
      const raw = readFileSync(path.join(ROOT, rel), 'utf8')
      // Strip line + block comments so the regex only inspects actual code.
      // (Comments in og-template.tsx literally name "display: 'grid'" while
      // explaining the Pitfall 1 ban; we don't want that to trip the test.)
      const src = raw
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/^\s*\/\/.*$/gm, '')
      expect(
        /display:\s*['"]grid['"]/.test(src),
        `${rel} uses display: 'grid' — Pitfall 1 (Satori is flex-only)`,
      ).toBe(false)
    }
  })

  it('Test 7 — UI-SPEC § Copywriting Contract LOCKED titles present in each per-route OG file', () => {
    for (const [rel, title] of Object.entries(LOCKED_TITLES)) {
      const src = readFileSync(path.join(ROOT, rel), 'utf8')
      expect(src, `${rel} missing locked title: ${title}`).toContain(title)
    }
  })
})
