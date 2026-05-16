// tests/projects/page-metadata.test.ts
// PRJ-07: per-route metadata + OG image fallback chain (5 cases).
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

  it('OG precedence #1: project.ogImage wins when set', async () => {
    const generateMetadata = await loadGenerateMetadata(() => ({
      ...baseProject,
      ogImage: '/images/projects/myco/og-custom.png',
    }))
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: 'myco' }),
    })
    const og = meta.openGraph?.images as Array<{ url: string }> | undefined
    expect(og?.[0]?.url).toBe('/images/projects/myco/og-custom.png')
  })

  it('OG precedence #2: hero.src wins when ogImage unset AND hero is NOT a placeholder', async () => {
    const generateMetadata = await loadGenerateMetadata(() => ({
      ...baseProject,
      hero: { src: '/images/projects/myco/cover.png', alt: 'cover' },
    }))
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: 'myco' }),
    })
    const og = meta.openGraph?.images as Array<{ url: string }> | undefined
    expect(og?.[0]?.url).toBe('/images/projects/myco/cover.png')
  })

  it('OG precedence #3: /og-default.png falls back when ogImage unset AND hero is placeholder (Myco today)', async () => {
    const generateMetadata = await loadGenerateMetadata(() => baseProject)
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: 'myco' }),
    })
    const og = meta.openGraph?.images as Array<{ url: string }> | undefined
    expect(og?.[0]?.url).toBe('/og-default.png')
  })

  it('twitter card is summary_large_image and reuses the OG image', async () => {
    const generateMetadata = await loadGenerateMetadata(() => baseProject)
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: 'myco' }),
    })
    expect(meta.twitter?.card).toBe('summary_large_image')
    const tw = meta.twitter?.images as string[] | undefined
    expect(tw?.[0]).toBe('/og-default.png')
  })

  it('returns {} for unknown slug', async () => {
    const generateMetadata = await loadGenerateMetadata(() => undefined)
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: 'nope' }),
    })
    expect(meta).toEqual({})
  })
})
