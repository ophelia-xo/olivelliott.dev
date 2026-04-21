// tests/content/redaction.test.ts
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import matter from 'gray-matter'
import { describe, expect, it } from 'vitest'
import { BANNED_TERMS } from '../fixtures/banned-terms'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'projects')

function scanBody(body: string, terms: readonly string[]): string[] {
  const found: string[] = []
  const lower = body.toLowerCase()
  for (const term of terms) {
    const pattern = new RegExp(`\\b${term.toLowerCase()}\\b`)
    if (pattern.test(lower)) found.push(term)
  }
  return found
}

describe('redaction — private project bodies must not contain banned terms', () => {
  if (!fs.existsSync(CONTENT_DIR)) {
    it.skip('no content/projects/ directory — skipping', () => {
      /* intentionally empty */
    })
  } else {
    const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.mdx'))
    const privateFiles: string[] = []

    for (const file of files) {
      const full = path.join(CONTENT_DIR, file)
      const { data } = matter(fs.readFileSync(full, 'utf-8'))
      if ((data as { visibility?: string }).visibility === 'private') {
        privateFiles.push(file)
      }
    }

    if (privateFiles.length === 0) {
      it('no private projects yet — redaction scanner is armed for Phase 7', () => {
        // Phase 2 ships Myco (public) only. Phase 7 adds private projects
        // (Trade Bot, Agenda Keeper, Aktiga). When those land, this suite
        // starts asserting per-file.
        expect(privateFiles).toHaveLength(0)
      })
    } else {
      for (const file of privateFiles) {
        const full = path.join(CONTENT_DIR, file)
        const { content } = matter(fs.readFileSync(full, 'utf-8'))

        it(`${file} body contains no banned terms`, () => {
          const matches = scanBody(content, BANNED_TERMS)
          expect(matches).toEqual([])
        })
      }
    }
  }
})

describe('redaction scanner — self-test', () => {
  it('detects a banned term (case-insensitive, whole-word)', () => {
    const body =
      'This is a case study about Aktiga internals and some other things.'
    const matches = scanBody(body, BANNED_TERMS)
    expect(matches).toContain('aktiga')
  })

  it('is case-insensitive', () => {
    const body = 'VOYA integration notes'
    const matches = scanBody(body, BANNED_TERMS)
    expect(matches).toContain('voya')
  })

  it('respects whole-word boundaries (no substring matches)', () => {
    // "voyages" contains "voya" as substring but \b boundaries must not match
    const body = 'We planned many voyages across the research.'
    const matches = scanBody(body, BANNED_TERMS)
    expect(matches).not.toContain('voya')
  })

  it('detects banned term from an isolated fixture', () => {
    // Create an in-memory private-shaped fixture and scan it directly.
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'redaction-selftest-'))
    const fixturePath = path.join(tmp, 'bad-private.mdx')
    const fixtureContent = `---
slug: bad-private
title: Bad Private
tagline: Intentionally contains a banned term for scanner self-test.
year: 2025
tier: secondary
visibility: private
tags: [typescript]
hero:
  src: /h.png
  alt: h
description: Self-test fixture.
---

This case study references Spectra internals, which should be redacted.
`
    fs.writeFileSync(fixturePath, fixtureContent, 'utf-8')
    const { content } = matter(fs.readFileSync(fixturePath, 'utf-8'))
    const matches = scanBody(content, BANNED_TERMS)
    expect(matches).toContain('spectra')
    fs.rmSync(tmp, { recursive: true, force: true })
  })

  it('does NOT scan frontmatter values — only body after gray-matter strip', () => {
    // Prove: if a banned term appears ONLY in frontmatter, scanner should NOT match
    const body = `---
slug: example
status: aktiga
---

Clean body content.
`
    // After gray-matter, content is the body (not the frontmatter).
    const { content } = matter(body)
    const matches = scanBody(content, BANNED_TERMS)
    expect(matches).toEqual([])
  })
})
