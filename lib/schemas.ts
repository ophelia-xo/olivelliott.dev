// lib/schemas.ts
// Zod schema for project MDX frontmatter. The `.transform()` is the enforcement
// point for privacy rules (CNT-03): private projects get `code-private` auto-tag
// and their `links.repo` is stripped before any consumer sees the parsed object.
// See .planning/phases/02-content-pipeline/02-CONTEXT.md § "Privacy Enforcement".
import { z } from 'zod'
import { TAGS } from './tags'

const LinksSchema = z
  .object({
    repo: z.string().url().optional(),
    live: z.string().url().optional(),
    docs: z.string().url().optional(),
    npm: z.string().url().optional(),
  })
  .default({})

const HeroSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
})

const GalleryItemSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
  caption: z.string().optional(),
})

const ProjectFrontmatterRawSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, 'slug must be lowercase kebab-case'),
  title: z.string().min(1),
  tagline: z.string().max(140),
  year: z.number().int().gte(2000).lte(2100),
  tier: z.enum(['hero', 'secondary']),
  order: z.number().int().default(100),
  status: z.enum(['active', 'archived', 'paused']).default('active'),
  visibility: z.enum(['public', 'private']),
  tags: z.array(z.enum(TAGS)).min(1),
  stack: z.array(z.string()).default([]),
  links: LinksSchema,
  hero: HeroSchema,
  gallery: z.array(GalleryItemSchema).default([]),
  outcomes: z.array(z.string()).max(5).default([]),
  description: z.string().max(160),
  ogImage: z.string().optional(),
})

export const ProjectFrontmatterSchema = ProjectFrontmatterRawSchema.transform(
  (doc) => {
    // Privacy transform — CNT-03
    if (doc.visibility === 'private') {
      if (doc.links.repo && process.env.NODE_ENV === 'development') {
        // biome-ignore lint/suspicious/noConsole: author-facing warning
        console.warn(
          `[content] Stripping links.repo from private project "${doc.slug}". ` +
            `Private projects should not expose a repo URL.`,
        )
      }

      const { repo: _repo, ...restLinks } = doc.links
      const dedupedTags = Array.from(new Set([...doc.tags, 'code-private']))

      return {
        ...doc,
        links: restLinks,
        tags: dedupedTags as typeof doc.tags,
      }
    }
    return doc
  },
)

export type ProjectFrontmatter = z.infer<typeof ProjectFrontmatterSchema>
