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
        // Author-facing warning: private projects should not expose a repo URL.
        // (biome.json does not enable noConsole; no suppression needed.)
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

// ── Resume schema (RES-01) ─────────────────────────────────────────────
// Typed source-of-truth for the /resume HTML render (Plan 05-02) AND the
// Puppeteer PDF pipeline (Plan 05-05). Both consume `RESUME` from
// `content/resume.ts` through this schema. Build fails loudly if
// `content/resume.ts` drifts (Pitfall 12: dual-gate `satisfies` + `parse`).
//
// No `.transform()` step here — unlike `ProjectFrontmatterSchema`, the
// resume has no privacy/auto-tag rules. The shape parsed in equals the
// shape consumed.

const ResumeHeaderSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  location: z.string().min(1),
  links: z.object({
    github: z.string().url(),
    email: z.string().email(),
    linkedin: z.string().url(),
  }),
})

const ResumeExperienceSchema = z.object({
  role: z.string().min(1),
  company: z.string().min(1),
  location: z.string().optional(),
  period: z.string().min(1),
  bullets: z.array(z.string().min(1)).min(1).max(6),
})

const ResumeProjectSchema = z.object({
  name: z.string().min(1),
  tagline: z.string().optional(),
  link: z.string().url().optional(),
  period: z.string().min(1),
  bullets: z.array(z.string().min(1)).min(1).max(6),
})

const ResumeEducationSchema = z.object({
  degree: z.string().min(1),
  institution: z.string().min(1),
  year: z.string().min(1),
  location: z.string().optional(),
  bullets: z.array(z.string()).max(4).default([]),
})

const ResumeSkillsCategorySchema = z.object({
  category: z.string().min(1),
  items: z.array(z.string().min(1)).min(1),
})

export const ResumeSchema = z.object({
  header: ResumeHeaderSchema,
  summary: z.string().min(1),
  experience: z.array(ResumeExperienceSchema).min(1),
  projects: z.array(ResumeProjectSchema).min(1),
  skills: z.array(ResumeSkillsCategorySchema).min(1),
  education: z.array(ResumeEducationSchema).min(1),
})

export type Resume = z.infer<typeof ResumeSchema>
