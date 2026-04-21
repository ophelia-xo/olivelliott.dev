// tests/content/privacy-transform.test.ts
import { readFileSync } from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ProjectFrontmatterSchema } from '@/lib/schemas'

const FIXTURES = path.resolve(__dirname, '../fixtures/projects')

function loadFrontmatter(file: string) {
  const raw = readFileSync(path.join(FIXTURES, file), 'utf-8')
  return matter(raw).data
}

describe('privacy transform — visibility: private', () => {
  it('auto-adds code-private tag on output', () => {
    const data = loadFrontmatter('valid-private.mdx')
    const out = ProjectFrontmatterSchema.parse(data)
    expect(out.tags).toContain('code-private')
  })

  it('strips links.repo on output', () => {
    const data = loadFrontmatter('valid-private.mdx')
    const out = ProjectFrontmatterSchema.parse(data)
    expect(out.links.repo).toBeUndefined()
  })

  it('preserves other links (live, docs, npm)', () => {
    const data = loadFrontmatter('valid-private.mdx')
    const out = ProjectFrontmatterSchema.parse(data)
    expect(out.links.live).toBe('https://example-private.com')
  })

  it('dedupes code-private when author adds it redundantly', () => {
    const data = loadFrontmatter('valid-private.mdx')
    const out = ProjectFrontmatterSchema.parse({
      ...data,
      tags: ['typescript', 'code-private'],
    })
    const count = out.tags.filter((t) => t === 'code-private').length
    expect(count).toBe(1)
  })
})

describe('privacy transform — visibility: public (no mutations)', () => {
  it('does not add code-private tag', () => {
    const data = loadFrontmatter('valid-hero.mdx')
    const out = ProjectFrontmatterSchema.parse(data)
    expect(out.tags).not.toContain('code-private')
  })

  it('preserves links.repo', () => {
    const data = loadFrontmatter('valid-hero.mdx')
    const out = ProjectFrontmatterSchema.parse(data)
    expect(out.links.repo).toBe('https://github.com/example/valid-hero')
  })
})

describe('privacy transform — dev warning for private + links.repo', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>
  let prevEnv: string | undefined

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    prevEnv = process.env.NODE_ENV
  })

  afterEach(() => {
    warnSpy.mockRestore()
    if (prevEnv === undefined) {
      delete (process.env as Record<string, string | undefined>).NODE_ENV
    } else {
      process.env.NODE_ENV = prevEnv
    }
  })

  it('warns in development when private project declares links.repo', () => {
    process.env.NODE_ENV = 'development'
    const data = loadFrontmatter('valid-private.mdx')
    ProjectFrontmatterSchema.parse(data)
    expect(warnSpy).toHaveBeenCalled()
    const msg = String(warnSpy.mock.calls[0]?.[0] ?? '')
    expect(msg).toContain('valid-private')
  })

  it('does NOT warn in production mode', () => {
    process.env.NODE_ENV = 'production'
    const data = loadFrontmatter('valid-private.mdx')
    ProjectFrontmatterSchema.parse(data)
    expect(warnSpy).not.toHaveBeenCalled()
  })

  it('does NOT warn when private project has no links.repo', () => {
    process.env.NODE_ENV = 'development'
    const data = loadFrontmatter('valid-private.mdx')
    const { repo: _, ...rest } = (data as { links: Record<string, string> }).links
    ProjectFrontmatterSchema.parse({ ...data, links: rest })
    expect(warnSpy).not.toHaveBeenCalled()
  })
})
