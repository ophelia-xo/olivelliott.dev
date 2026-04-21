// tests/content/content-load.test.ts
// Integration tests for lib/content's loader. Uses _loadForTests to point the
// loader at ephemeral temp directories populated from tests/fixtures/projects/,
// isolating each spec from the others and from the real content/projects/.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { _loadForTests } from '@/lib/content'

const FIXTURES = path.resolve(__dirname, '../fixtures/projects')

describe('lib/content loader — fixture directory', () => {
  it('loads valid-hero + valid-private (skips reading invalid-tag in this pass by isolating)', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'content-load-'))
    for (const file of ['valid-hero.mdx', 'valid-private.mdx']) {
      fs.copyFileSync(path.join(FIXTURES, file), path.join(tmp, file))
    }
    const projects = _loadForTests(tmp)
    expect(projects).toHaveLength(2)
    const slugs = projects.map((p) => p.slug).sort()
    expect(slugs).toEqual(['valid-hero', 'valid-private'])
    fs.rmSync(tmp, { recursive: true, force: true })
  })

  it('each project has a non-empty body after gray-matter strips frontmatter', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'content-load-'))
    fs.copyFileSync(
      path.join(FIXTURES, 'valid-hero.mdx'),
      path.join(tmp, 'valid-hero.mdx'),
    )
    const [project] = _loadForTests(tmp)
    expect(project).toBeDefined()
    expect(typeof project?.body).toBe('string')
    expect(project?.body.length).toBeGreaterThan(0)
    // YAML frontmatter must NOT be in the body:
    expect(project?.body).not.toContain('slug: valid-hero')
    expect(project?.body).not.toMatch(/^---\n/)
    fs.rmSync(tmp, { recursive: true, force: true })
  })

  it('private project has code-private tag and stripped links.repo after load', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'content-load-'))
    fs.copyFileSync(
      path.join(FIXTURES, 'valid-private.mdx'),
      path.join(tmp, 'valid-private.mdx'),
    )
    const [project] = _loadForTests(tmp)
    expect(project?.tags).toContain('code-private')
    expect(project?.links.repo).toBeUndefined()
    fs.rmSync(tmp, { recursive: true, force: true })
  })

  it('throws on schema violation (invalid-tag fixture)', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'content-load-'))
    fs.copyFileSync(
      path.join(FIXTURES, 'invalid-tag.mdx'),
      path.join(tmp, 'invalid-tag.mdx'),
    )
    expect(() => _loadForTests(tmp)).toThrow()
    fs.rmSync(tmp, { recursive: true, force: true })
  })

  it('throws on slug/filename mismatch', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'content-load-'))
    // Copy valid-hero.mdx as a differently-named file; slug: valid-hero stays in frontmatter
    fs.copyFileSync(
      path.join(FIXTURES, 'valid-hero.mdx'),
      path.join(tmp, 'renamed.mdx'),
    )
    expect(() => _loadForTests(tmp)).toThrow(/Slug mismatch/)
    fs.rmSync(tmp, { recursive: true, force: true })
  })

  it('returns empty array when content dir does not exist', () => {
    const nonexistent = path.join(os.tmpdir(), `does-not-exist-${Date.now()}`)
    const projects = _loadForTests(nonexistent)
    expect(projects).toEqual([])
  })
})
