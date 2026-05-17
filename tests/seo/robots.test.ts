// tests/seo/robots.test.ts
// MTA-03 — robots audit. Asserts rules + sitemap pointer.
import { describe, expect, it } from 'vitest'
import robots from '@/app/robots'

describe('robots (MTA-03)', () => {
  const result = robots()

  it('Test 1 — returns shape { rules: {...}, sitemap: string }', () => {
    expect(result).toBeTruthy()
    expect(result.rules).toBeTruthy()
    expect(typeof result.sitemap).toBe('string')
  })

  it('Test 2 — rules allow / for all crawlers and disallow /_next/ + /api/', () => {
    const rules = result.rules as {
      userAgent?: string
      allow?: string
      disallow?: string[]
    }
    expect(rules.userAgent).toBe('*')
    expect(rules.allow).toBe('/')
    expect(rules.disallow).toContain('/_next/')
    expect(rules.disallow).toContain('/api/')
  })

  it('Test 3 — sitemap field is an absolute URL ending in /sitemap.xml', () => {
    const sitemap = result.sitemap as string
    expect(
      /^https?:\/\/.+\/sitemap\.xml$/.test(sitemap),
      `${sitemap} not absolute /sitemap.xml`,
    ).toBe(true)
  })
})
