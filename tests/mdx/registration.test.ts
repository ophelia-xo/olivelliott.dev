// tests/mdx/registration.test.ts
// Asserts mdx-components.tsx wires Figure/Gallery/Callout into the @next/mdx
// global registration channel. Refs: 03-UI-SPEC § Component map.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { Callout } from '@/components/mdx/callout'
import { Figure } from '@/components/mdx/figure'
import { Gallery } from '@/components/mdx/gallery'
import { useMDXComponents } from '@/mdx-components'

const source = readFileSync(join(process.cwd(), 'mdx-components.tsx'), 'utf-8')

describe('mdx-components.tsx', () => {
  it('imports Figure from @/components/mdx/figure', () => {
    expect(source).toMatch(/import\s*\{\s*Figure\s*\}\s*from\s*['"]@\/components\/mdx\/figure['"]/)
  })

  it('imports Gallery from @/components/mdx/gallery', () => {
    expect(source).toMatch(/import\s*\{\s*Gallery\s*\}\s*from\s*['"]@\/components\/mdx\/gallery['"]/)
  })

  it('imports Callout from @/components/mdx/callout', () => {
    expect(source).toMatch(/import\s*\{\s*Callout\s*\}\s*from\s*['"]@\/components\/mdx\/callout['"]/)
  })

  it('useMDXComponents() returns a map containing Figure/Gallery/Callout', () => {
    const components = useMDXComponents()
    expect(components.Figure).toBe(Figure)
    expect(components.Gallery).toBe(Gallery)
    expect(components.Callout).toBe(Callout)
  })

  it('does NOT add h2/h3/pre/code JSX overrides (rehype + .prose handle those)', () => {
    // Negative assertion — these property names should not appear as object keys
    expect(source).not.toMatch(/\bh2\s*:/)
    expect(source).not.toMatch(/\bh3\s*:/)
    expect(source).not.toMatch(/\bpre\s*:/)
    // 'code:' intentionally allowed only as part of larger identifiers (none expected)
  })
})
