// GREEN-on-install — pure math; no implementation dependency.
import { describe, expect, it } from 'vitest'

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const bigint = Number.parseInt(h, 16)
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255]
}

function luminance([r, g, b]: [number, number, number]): number {
  const a = [r, g, b].map((v) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }) as [number, number, number]
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]
}

function contrastRatio(a: string, b: string): number {
  const la = luminance(hexToRgb(a))
  const lb = luminance(hexToRgb(b))
  const [light, dark] = la > lb ? [la, lb] : [lb, la]
  return (light + 0.05) / (dark + 0.05)
}

const AA_PAIRS: Array<[string, string, string, number]> = [
  ['text-primary on bg', '#f5f5f5', '#0a0a0a', 15],
  ['text-secondary on bg', '#a3a3a3', '#0a0a0a', 7],
  // text-tertiary is reserved for AA Large text (18pt / 14pt-bold); WCAG threshold is 3:1 at that size.
  ['text-tertiary on bg (AA Large)', '#737373', '#0a0a0a', 3],
  ['accent on bg', '#fbbf24', '#0a0a0a', 10],
  ['accent-hover on bg', '#f59e0b', '#0a0a0a', 8],
  ['text-on-accent on accent', '#0a0a0a', '#fbbf24', 10],
]

describe('Color token pairs — WCAG AA contrast (UI-SPEC Verified pairings)', () => {
  for (const [name, fg, bg, minRatio] of AA_PAIRS) {
    it(`${name} >= ${minRatio}:1`, () => {
      const ratio = contrastRatio(fg, bg)
      expect(ratio).toBeGreaterThanOrEqual(minRatio)
    })
  }

  it('text-primary on accent is KNOWN FAIL (must never be paired in source)', () => {
    const ratio = contrastRatio('#f5f5f5', '#fbbf24')
    expect(ratio).toBeLessThan(3)
  })
})
