// tests/mdx/pipeline.test.ts
// Source assertions on next.config.ts. Verifies the Turbopack-safe string-form
// rehype chain is wired in the correct order with the locked options.
// Refs: 03-RESEARCH § Pattern 3, Pattern 4, Pitfall 1, Pitfall 3, Pitfall 4, Pitfall 7.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const config = readFileSync(join(process.cwd(), 'next.config.ts'), 'utf-8')

describe('next.config.ts — Phase 3 rehype chain', () => {
  it('registers rehype-slug, rehype-autolink-headings, rehype-pretty-code in order', () => {
    const slugIdx = config.indexOf("'rehype-slug'")
    const autolinkIdx = config.indexOf("'rehype-autolink-headings'")
    const prettyIdx = config.indexOf("'rehype-pretty-code'")
    expect(slugIdx).toBeGreaterThan(-1)
    expect(autolinkIdx).toBeGreaterThan(slugIdx)
    expect(prettyIdx).toBeGreaterThan(autolinkIdx)
  })

  it('uses Vesper Shiki theme by bundled name', () => {
    expect(config).toContain("theme: 'vesper'")
  })

  it('disables Shiki theme background (we paint --color-surface-2 ourselves)', () => {
    expect(config).toMatch(/keepBackground:\s*false/)
  })

  it("uses behavior: 'append' for autolink-headings (NOT 'wrap')", () => {
    expect(config).toMatch(/behavior:\s*'append'/)
    expect(config).not.toMatch(/behavior:\s*'wrap'/)
  })

  it('does NOT use the {filename=...} metastring syntax (Pitfall 1)', () => {
    expect(config).not.toContain('{filename=')
  })

  it('does NOT import rehype plugins as function references (Turbopack constraint)', () => {
    expect(config).not.toMatch(/import\s+rehypePrettyCode/)
    expect(config).not.toMatch(/import\s+rehypeSlug/)
    expect(config).not.toMatch(/import\s+rehypeAutolinkHeadings/)
  })

  it('preserves Phase 2 remark-frontmatter registration', () => {
    expect(config).toContain("'remark-frontmatter'")
  })
})
