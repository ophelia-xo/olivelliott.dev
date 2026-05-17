// tests/seo/metadata.test.ts
// MTA-01 + Pitfall 4 cleanup lock — per-route metadata audit.
// Replaces Wave 0 placeholder. Asserts:
//   - Unique 50–160 char descriptions across all 5 public routes
//   - alternates.canonical matches pathname (except / which omits)
//   - twitter.card = 'summary_large_image'
//   - NO manual openGraph.images / twitter.images (Pitfall 4 — sibling OG wins)
//   - / omits metadata.title (Pitfall 14 — titleTemplate would double-wrap)
import type { Metadata } from 'next'
import { describe, expect, it } from 'vitest'

import { metadata as homeMeta } from '@/app/(site)/page'
import { metadata as aboutMeta } from '@/app/(site)/about/page'
import { metadata as projectsMeta } from '@/app/(site)/projects/page'
import { metadata as resumeMeta } from '@/app/resume/page'
import { generateMetadata as projectGen } from '@/app/(site)/projects/[slug]/page'

interface AuditEntry {
  route: string
  meta: Metadata | Promise<Metadata>
  expectedCanonical?: string // omit for / (home omits canonical)
}

const entries: AuditEntry[] = [
  { route: '/', meta: homeMeta },
  { route: '/about', meta: aboutMeta, expectedCanonical: '/about' },
  { route: '/projects', meta: projectsMeta, expectedCanonical: '/projects' },
  { route: '/resume', meta: resumeMeta, expectedCanonical: '/resume' },
  {
    route: '/projects/myco',
    meta: projectGen({ params: Promise.resolve({ slug: 'myco' }) }),
    expectedCanonical: '/projects/myco',
  },
]

describe('per-route metadata audit (MTA-01)', () => {
  it('Test 1 — every route declares a non-empty description (50–160 chars)', async () => {
    for (const e of entries) {
      const m = await e.meta
      const d = m.description as string | undefined
      expect(d, `${e.route} missing description`).toBeTruthy()
      expect(
        d!.length,
        `${e.route} description is ${d!.length} chars`,
      ).toBeGreaterThanOrEqual(50)
      expect(
        d!.length,
        `${e.route} description is ${d!.length} chars`,
      ).toBeLessThanOrEqual(160)
    }
  })

  it('Test 2 — every non-home route declares alternates.canonical matching its pathname', async () => {
    for (const e of entries) {
      if (!e.expectedCanonical) continue
      const m = await e.meta
      expect(m.alternates?.canonical, `${e.route} missing canonical`).toBe(
        e.expectedCanonical,
      )
    }
  })

  it('Test 3 — every route declares twitter.card = summary_large_image', async () => {
    for (const e of entries) {
      const m = await e.meta
      const tw = m.twitter as { card?: string } | undefined
      expect(tw?.card, `${e.route} twitter.card missing`).toBe(
        'summary_large_image',
      )
    }
  })

  it('Test 4 — descriptions are unique across routes', async () => {
    const descs = await Promise.all(
      entries.map(async (e) => (await e.meta).description as string),
    )
    const set = new Set(descs)
    expect(set.size, `descriptions not unique: ${JSON.stringify(descs)}`).toBe(
      descs.length,
    )
  })

  it('Test 5 — Pitfall 4 lock: NO route declares openGraph.images manually (sibling OG wins)', async () => {
    for (const e of entries) {
      const m = await e.meta
      const og = m.openGraph as { images?: unknown } | undefined
      expect(
        og?.images,
        `${e.route} declares openGraph.images manually — DELETE per Pitfall 4 (sibling opengraph-image.tsx is the source of truth)`,
      ).toBeUndefined()
    }
  })

  it('Test 6 — Pitfall 4 lock: NO route declares twitter.images manually (sibling OG wins)', async () => {
    for (const e of entries) {
      const m = await e.meta
      const tw = m.twitter as { images?: unknown } | undefined
      expect(
        tw?.images,
        `${e.route} declares twitter.images manually — DELETE per Pitfall 4`,
      ).toBeUndefined()
    }
  })

  it('Test 7 — Pitfall 14 lock: / omits metadata.title (so root titleTemplate.default flows through)', () => {
    // Type-cast: home's metadata is the static const homeMeta.
    expect(
      (homeMeta as Metadata).title,
      '/ must omit title (Pitfall 14 — titleTemplate would double-wrap)',
    ).toBeUndefined()
  })
})
