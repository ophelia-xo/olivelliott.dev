// tests/projects/page-metadata.test.ts
// PRJ-07 + Plan 06-02 Pitfall 4 cleanup: per-route metadata.
// The original Phase 3 OG precedence chain (project.ogImage → hero.src →
// /og-default.png embedded in generateMetadata) was REMOVED in Plan 06-02
// Task 2: the sibling app/(site)/projects/[slug]/opengraph-image.tsx now
// owns the per-project OG via generateImageMetadata + getProject(slug).
// What remains: title, description, alternates.canonical, twitter.card, type,
// and the Pitfall-4 absence locks (no openGraph.images, no twitter.images).
import { describe, expect, it, vi } from 'vitest'

const baseProject = {
  slug: 'myco',
  title: 'Myco',
  tagline: 'A persistent cognitive layer.',
  year: 2025,
  tier: 'hero' as const,
  order: 10,
  status: 'active' as const,
  visibility: 'public' as const,
  tags: ['local-first'] as const,
  stack: [],
  links: { repo: 'https://github.com/x/y' },
  hero: {
    src: '/images/projects/myco/hero-placeholder.png',
    alt: 'placeholder hero alt',
  },
  gallery: [],
  outcomes: [],
  description: 'A local-first MCP server.',
}

async function loadGenerateMetadata(getProjectImpl: (slug: string) => unknown) {
  vi.resetModules()
  vi.doMock('@/lib/projects', () => ({
    getAll: () => [],
    getProject: getProjectImpl,
  }))
  vi.doMock('@/lib/next-project', () => ({ getNextProject: () => null }))
  const mod = await import('@/app/(site)/projects/[slug]/page')
  return mod.generateMetadata
}

describe('generateMetadata', () => {
  it('returns title and description from frontmatter', async () => {
    const generateMetadata = await loadGenerateMetadata(() => baseProject)
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: 'myco' }),
    })
    expect(meta.title).toBe('Myco')
    expect(meta.description).toBe('A local-first MCP server.')
  })

  it('sets alternates.canonical = /projects/${slug}', async () => {
    const generateMetadata = await loadGenerateMetadata(() => baseProject)
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: 'myco' }),
    })
    expect(meta.alternates?.canonical).toBe('/projects/myco')
  })

  it('Pitfall 4 lock: openGraph.images is undefined (sibling [slug]/opengraph-image.tsx owns it)', async () => {
    // Plan 06-02 Task 2 deleted the manual openGraph.images array from
    // generateMetadata. Sibling app/(site)/projects/[slug]/opengraph-image.tsx
    // emits the per-project OG via generateImageMetadata + getProject(slug).
    const generateMetadata = await loadGenerateMetadata(() => baseProject)
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: 'myco' }),
    })
    const og = (meta.openGraph as { images?: unknown })?.images
    expect(
      og,
      '/projects/[slug] must NOT declare openGraph.images — sibling opengraph-image.tsx wins.',
    ).toBeUndefined()
  })

  it('Pitfall 4 lock: twitter.images is undefined (sibling [slug]/opengraph-image.tsx owns it)', async () => {
    const generateMetadata = await loadGenerateMetadata(() => baseProject)
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: 'myco' }),
    })
    const tw = (meta.twitter as { images?: unknown })?.images
    expect(
      tw,
      '/projects/[slug] must NOT declare twitter.images — sibling opengraph-image.tsx wins.',
    ).toBeUndefined()
  })

  it('twitter.card === summary_large_image (preserved across Pitfall 4 cleanup)', async () => {
    const generateMetadata = await loadGenerateMetadata(() => baseProject)
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: 'myco' }),
    })
    expect((meta.twitter as { card?: string })?.card).toBe(
      'summary_large_image',
    )
  })

  it('returns {} for unknown slug', async () => {
    const generateMetadata = await loadGenerateMetadata(() => undefined)
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: 'nope' }),
    })
    expect(meta).toEqual({})
  })
})
