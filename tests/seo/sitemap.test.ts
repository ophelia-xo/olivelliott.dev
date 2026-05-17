// tests/seo/sitemap.test.ts
// MTA-03 — sitemap audit. Asserts shape + content + Pitfall 9 (absolute URLs).
import { describe, expect, it } from 'vitest'
import sitemap from '@/app/sitemap'
import { getAll } from '@/lib/projects'

describe('sitemap (MTA-03)', () => {
  const entries = sitemap()

  it('Test 1 — returns a non-empty array', () => {
    expect(Array.isArray(entries)).toBe(true)
    expect(entries.length).toBeGreaterThan(0)
  })

  it('Test 2 — includes the 4 static public routes', () => {
    const urls = entries.map((e) => new URL(e.url).pathname)
    for (const expected of ['/', '/about', '/projects', '/resume']) {
      expect(urls, `missing ${expected}`).toContain(expected)
    }
  })

  it('Test 3 — includes one entry per project slug from getAll()', () => {
    const projectUrls = entries
      .map((e) => new URL(e.url).pathname)
      .filter((p) => p.startsWith('/projects/'))
    for (const project of getAll()) {
      expect(projectUrls, `missing /projects/${project.slug}`).toContain(
        `/projects/${project.slug}`,
      )
    }
  })

  it('Test 4 — every URL is absolute (Pitfall 9)', () => {
    for (const e of entries) {
      expect(/^https?:\/\//.test(e.url), `${e.url} is not absolute`).toBe(true)
    }
  })

  it('Test 5 — NO changeFrequency or priority fields (Google deprecated as signals)', () => {
    for (const e of entries) {
      const anyE = e as { changeFrequency?: unknown; priority?: unknown }
      expect(
        anyE.changeFrequency,
        `${e.url} declares changeFrequency`,
      ).toBeUndefined()
      expect(anyE.priority, `${e.url} declares priority`).toBeUndefined()
    }
  })
})
