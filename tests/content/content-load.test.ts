// tests/content/content-load.test.ts
// Integration tests for lib/content's loader. Uses _loadForTests to point the
// loader at ephemeral temp directories populated from tests/fixtures/projects/,
// isolating each spec from the others and from the real content/projects/.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { _loadForTests, allProjects } from '@/lib/content'

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

describe('content/projects/ — real content integration (CNT-05)', () => {
  it('loads at least one project (Myco)', () => {
    expect(allProjects.length).toBeGreaterThanOrEqual(1)
  })

  it('includes myco project with locked frontmatter values', () => {
    const myco = allProjects.find((p) => p.slug === 'myco')
    expect(myco).toBeDefined()
    expect(myco?.tier).toBe('hero')
    expect(myco?.visibility).toBe('public')
    expect(myco?.status).toBe('active')
    expect(myco?.year).toBe(2025)
    expect(myco?.order).toBe(10)
  })

  it('myco tags include local-first, open-source, ai', () => {
    const myco = allProjects.find((p) => p.slug === 'myco')
    expect(myco?.tags).toEqual(
      expect.arrayContaining(['local-first', 'open-source', 'ai']),
    )
  })

  it('myco body contains Problem, Approach, Outcome H2 headings', () => {
    const myco = allProjects.find((p) => p.slug === 'myco')
    expect(myco?.body).toMatch(/^## Problem$/m)
    expect(myco?.body).toMatch(/^## Approach$/m)
    expect(myco?.body).toMatch(/^## Outcome$/m)
  })

  it('myco body is within 800–1200 word budget', () => {
    const myco = allProjects.find((p) => p.slug === 'myco')
    expect(myco).toBeDefined()
    const wordCount = (myco?.body ?? '').trim().split(/\s+/).length
    expect(wordCount).toBeGreaterThanOrEqual(800)
    expect(wordCount).toBeLessThanOrEqual(1200)
  })

  it('myco hero is a placeholder path (real image deferred to Phase 7)', () => {
    const myco = allProjects.find((p) => p.slug === 'myco')
    expect(myco?.hero.src).toContain('myco')
    expect(myco?.hero.alt).toContain('placeholder')
  })
})
