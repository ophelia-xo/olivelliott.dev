// tests/projects/hero-fallback.test.ts
// Validates isPlaceholderHero regex contract — RSC-safe path detection.
// Refs: 03-UI-SPEC § Hero Variants → Detection rule (locked); 03-VALIDATION row PRJ-04.
import { describe, expect, it } from 'vitest'
import { isPlaceholderHero } from '@/lib/hero-fallback'

describe('isPlaceholderHero', () => {
  it('matches the canonical png placeholder path', () => {
    expect(isPlaceholderHero('/images/projects/myco/hero-placeholder.png')).toBe(true)
  })

  it('matches every supported extension (png, jpg, jpeg, webp), case-insensitive', () => {
    expect(isPlaceholderHero('/images/projects/x/hero-placeholder.png')).toBe(true)
    expect(isPlaceholderHero('/images/projects/x/hero-placeholder.jpg')).toBe(true)
    expect(isPlaceholderHero('/images/projects/x/hero-placeholder.jpeg')).toBe(true)
    expect(isPlaceholderHero('/images/projects/x/hero-placeholder.webp')).toBe(true)
    expect(isPlaceholderHero('/images/projects/X/HERO-PLACEHOLDER.PNG')).toBe(true)
  })

  it('matches nested project slugs with hyphens', () => {
    expect(isPlaceholderHero('/images/projects/trade-bot/hero-placeholder.jpg')).toBe(true)
    expect(isPlaceholderHero('/images/projects/agenda-keeper/hero-placeholder.webp')).toBe(true)
  })

  it('rejects real artwork paths (no -placeholder suffix)', () => {
    expect(isPlaceholderHero('/images/projects/myco/hero.png')).toBe(false)
    expect(isPlaceholderHero('/images/projects/myco/cover.jpg')).toBe(false)
  })

  it('rejects unsupported extensions (gif, svg, avif)', () => {
    expect(isPlaceholderHero('/images/projects/myco/hero-placeholder.gif')).toBe(false)
    expect(isPlaceholderHero('/images/projects/myco/hero-placeholder.svg')).toBe(false)
    expect(isPlaceholderHero('/images/projects/myco/hero-placeholder.avif')).toBe(false)
  })

  it('rejects unrelated paths', () => {
    expect(isPlaceholderHero('/og-default.png')).toBe(false)
    expect(isPlaceholderHero('/images/hero-placeholder.png')).toBe(false)
    expect(isPlaceholderHero('')).toBe(false)
  })

  it('rejects different-named placeholders', () => {
    expect(isPlaceholderHero('/images/projects/myco/foo-placeholder.png')).toBe(false)
    expect(isPlaceholderHero('/images/projects/myco/placeholder.png')).toBe(false)
  })
})
