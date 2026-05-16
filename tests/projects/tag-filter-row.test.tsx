// tests/projects/tag-filter-row.test.tsx
// Refs: 04-UI-SPEC § Component Inventory #8; 04-RESEARCH § Example 2,
//       § Pattern 3 (ARIA decision), § Pitfalls 7, 9, 11.
// TagFilterRow is the URL-synced single-tag filter for /projects.
// - All chips are <a>; the active chip's href clears the filter (`/projects`).
// - aria-pressed + aria-current="true" both present on active chip.
// - Count badge uses `text-current` so it inherits parent chip color
//   (Pitfall 7 lock — otherwise the count is invisible on the active chip).
// - Chip text comes from TAG_LABELS[tag] (human-facing), NOT raw tag value.
// - No 'use client', no useSearchParams, no useRouter; pure RSC.
import fs from 'node:fs'
import path from 'node:path'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TagFilterRow } from '@/components/projects/tag-filter-row'

const FIXTURE = [
  { tag: 'local-first', count: 3 },
  { tag: 'autonomous', count: 2 },
  { tag: 'cli', count: 1 },
] as const

describe('<TagFilterRow>', () => {
  it('renders one <a> chip per entry in the `tags` prop, in input order', () => {
    const { container } = render(<TagFilterRow tags={FIXTURE} />)
    // First three anchors are the chips (no clear-link without activeTag)
    const anchors = Array.from(container.querySelectorAll('a'))
    expect(anchors.length).toBe(3)
    // Order matches input — TAG_LABELS for each
    expect(anchors[0]?.textContent).toContain('Local-first')
    expect(anchors[1]?.textContent).toContain('Autonomous')
    expect(anchors[2]?.textContent).toContain('CLI')
  })

  it('without activeTag: every chip href is `/projects?tag=${tag}`', () => {
    const { container } = render(<TagFilterRow tags={FIXTURE} />)
    const hrefs = Array.from(container.querySelectorAll('a')).map((a) =>
      a.getAttribute('href'),
    )
    expect(hrefs).toEqual([
      '/projects?tag=local-first',
      '/projects?tag=autonomous',
      '/projects?tag=cli',
    ])
  })

  it('with activeTag="local-first": the matching chip href is exactly "/projects" (no slash, no fragment); others keep ?tag=', () => {
    const { container } = render(
      <TagFilterRow tags={FIXTURE} activeTag="local-first" />,
    )
    const activeChip = container.querySelector('a[aria-pressed="true"]')
    expect(activeChip).not.toBeNull()
    expect(activeChip?.getAttribute('href')).toBe('/projects')

    // Inactive chips still carry ?tag=...
    const inactive = Array.from(
      container.querySelectorAll('a[aria-pressed="false"]'),
    )
    const inactiveHrefs = inactive.map((a) => a.getAttribute('href'))
    expect(inactiveHrefs).toContain('/projects?tag=autonomous')
    expect(inactiveHrefs).toContain('/projects?tag=cli')
  })

  it('aria-pressed: "true" on active chip, "false" on every inactive chip', () => {
    const { container } = render(
      <TagFilterRow tags={FIXTURE} activeTag="autonomous" />,
    )
    const pressedTrue = container.querySelectorAll('a[aria-pressed="true"]')
    expect(pressedTrue.length).toBe(1)
    const pressedFalse = container.querySelectorAll('a[aria-pressed="false"]')
    // 2 chips inactive (clear-filter link has no aria-pressed)
    expect(pressedFalse.length).toBe(2)
  })

  it('aria-current: "true" on active chip; no aria-current attribute on inactive chips', () => {
    const { container } = render(
      <TagFilterRow tags={FIXTURE} activeTag="local-first" />,
    )
    const active = container.querySelector('a[aria-pressed="true"]')!
    expect(active.getAttribute('aria-current')).toBe('true')

    const inactive = Array.from(
      container.querySelectorAll('a[aria-pressed="false"]'),
    )
    for (const a of inactive) {
      expect(a.hasAttribute('aria-current')).toBe(false)
    }
  })

  it('chip text uses TAG_LABELS[tag] (capitalized) — NOT the raw lowercase tag value', () => {
    const { container } = render(
      <TagFilterRow tags={[{ tag: 'local-first', count: 1 }]} />,
    )
    const chip = container.querySelector('a')!
    expect(chip.textContent).toContain('Local-first')
    // Negative — the raw value alone (without the label form) should NOT be the
    // primary chip text. We assert the human label form is present.
    expect(chip.textContent).not.toMatch(/^local-first/)
  })

  it('count badge is a <span aria-hidden="true"> containing the integer count', () => {
    const { container } = render(<TagFilterRow tags={FIXTURE} />)
    const firstChip = container.querySelector('a')!
    const badge = firstChip.querySelector('span[aria-hidden="true"]')
    expect(badge).not.toBeNull()
    expect(badge?.textContent).toBe('3')
  })

  it('count badge carries `text-current` so it inherits the chip foreground (Pitfall 7 lock)', () => {
    const { container } = render(<TagFilterRow tags={FIXTURE} />)
    const badge = container.querySelector(
      'a span[aria-hidden="true"]',
    ) as HTMLElement | null
    expect(badge).not.toBeNull()
    expect(badge!.className).toContain('text-current')
    // Source-grep: text-current MUST exist in the component source (test-enforced contract).
    const src = fs.readFileSync(
      path.resolve(__dirname, '../../components/projects/tag-filter-row.tsx'),
      'utf8',
    )
    expect(src).toMatch(/text-current/)
  })

  it('clear-filter link: ABSENT when activeTag is undefined; PRESENT (exactly one) when activeTag is set', () => {
    const { container: noActive } = render(<TagFilterRow tags={FIXTURE} />)
    const clearAbsent = Array.from(noActive.querySelectorAll('a')).filter((a) =>
      a.textContent?.toLowerCase().includes('clear filter'),
    )
    expect(clearAbsent.length).toBe(0)

    const { container: withActive } = render(
      <TagFilterRow tags={FIXTURE} activeTag="local-first" />,
    )
    const clearLinks = Array.from(withActive.querySelectorAll('a')).filter(
      (a) => a.textContent?.toLowerCase().includes('clear filter'),
    )
    expect(clearLinks.length).toBe(1)
    expect(clearLinks[0]?.getAttribute('href')).toBe('/projects')
  })

  it('all chips and the clear link are <a> elements (no <button>)', () => {
    const { container } = render(
      <TagFilterRow tags={FIXTURE} activeTag="local-first" />,
    )
    const buttons = container.querySelectorAll('button')
    expect(buttons.length).toBe(0)
    // 3 chips + 1 clear link = 4 anchors when active
    const anchors = container.querySelectorAll('a')
    expect(anchors.length).toBe(4)
  })

  it('row is wrapped in <nav aria-label="Filter projects by tag">', () => {
    const { container } = render(<TagFilterRow tags={FIXTURE} />)
    const nav = container.querySelector('nav')
    expect(nav).not.toBeNull()
    expect(nav?.getAttribute('aria-label')).toBe('Filter projects by tag')
  })

  it('Pitfall 11 lock (disjoint label systems): no chip is labeled "hero" or "secondary"', () => {
    // The component iterates the `tags` prop. Because `TAGS` does not contain
    // 'hero' or 'secondary' (lib/tags.ts is the SoT), no caller can pass them
    // typed — but defensively assert no chip text matches either eyebrow label.
    const { container } = render(<TagFilterRow tags={FIXTURE} />)
    const chipTexts = Array.from(container.querySelectorAll('a')).map(
      (a) => a.textContent?.toLowerCase() ?? '',
    )
    for (const t of chipTexts) {
      expect(t).not.toMatch(/\bhero\b/)
      expect(t).not.toMatch(/\bsecondary\b/)
    }
  })

  it('source contains no client directives (no `use client` directive, useSearchParams, useRouter, next/link)', () => {
    const raw = fs.readFileSync(
      path.resolve(__dirname, '../../components/projects/tag-filter-row.tsx'),
      'utf8',
    )
    // Strip line + block comments so the source-grep targets actual code, not
    // documentation strings that reference the forbidden APIs (the header
    // comment intentionally explains why these are absent).
    const src = raw
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '')
    // `'use client'` directive — top-of-file statement.
    expect(src).not.toMatch(/^\s*['"]use client['"];?\s*$/m)
    // Identifiers / module specifiers in actual code.
    expect(src).not.toMatch(/useSearchParams/)
    expect(src).not.toMatch(/useRouter/)
    expect(src).not.toMatch(/from\s+['"]next\/link['"]/)
  })
})
