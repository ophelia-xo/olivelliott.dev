// app/(site)/projects/[slug]/page.tsx
// RSC project detail page — PRJ-01..PRJ-07.
// - dynamicParams = false: only generateStaticParams slugs render; unknown → 404.
// - generateMetadata: per-route title/description/canonical + OG precedence chain
//   (project.ogImage → project.hero.src when not placeholder → /og-default.png).
// - Body: getProject → notFound() (BEFORE the dynamic .mdx import per Pitfall 9)
//         then dynamic-import the MDX module (Pitfall 5: .mdx extension MANDATORY;
//         Pitfall 11: literal directory prefix `@/content/projects/`).
// - Composition: <article> > <ProjectHero> + <MDXProse>{<MDXBody />}</MDXProse>
//                + <NextProjectBlock>.
// Source: .planning/phases/03-project-detail-template/03-RESEARCH.md § Pattern 1
//         + 03-UI-SPEC § Routing & Static Generation + § Per-Page Metadata Contract.
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXProse } from '@/components/mdx/prose'
import { NextProjectBlock } from '@/components/projects/next-project-block'
import { ProjectHero } from '@/components/projects/project-hero'
import { getNextProject } from '@/lib/next-project'
import { getAll, getProject } from '@/lib/projects'

interface PageProps {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return getAll().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) return {}

  const description = project.description ?? project.tagline

  return {
    title: project.title,
    description,
    openGraph: {
      title: project.title,
      description,
      url: `/projects/${project.slug}`,
      type: 'article',
      // images: omitted — auto-wired by app/(site)/projects/[slug]/opengraph-image.tsx
      // (Phase 6 Pitfall 4 cleanup; sibling OG generated per-slug via generateImageMetadata).
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description,
      // images: omitted — auto-wired from the same opengraph-image.tsx convention.
    },
    alternates: { canonical: `/projects/${project.slug}` },
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()
  // notFound() throws — TS narrowing doesn't follow it; use non-null assertion below.

  // Pitfall 5 + 11: .mdx extension + literal directory prefix.
  const { default: MDXBody } = await import(`@/content/projects/${slug}.mdx`)
  const next = getNextProject(slug)

  // Schema strips links.repo for private projects, so the inferred union for
  // links has a branch without `repo`. The `in` narrowing widens the value
  // to unknown across the union, so we cast back to string|undefined — the
  // schema's repo field is z.string().url().optional(), nothing else.
  const repoUrl: string | undefined =
    'repo' in project!.links ? (project!.links.repo as string | undefined) : undefined

  return (
    <article>
      <ProjectHero
        title={project!.title}
        tagline={project!.tagline}
        year={project!.year}
        tags={project!.tags}
        visibility={project!.visibility}
        repoUrl={repoUrl}
        hero={project!.hero}
      />
      <MDXProse>
        <MDXBody />
      </MDXProse>
      <NextProjectBlock next={next} />
    </article>
  )
}
