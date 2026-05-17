// app/(site)/projects/[slug]/opengraph-image.tsx
// Per-project OG. generateImageMetadata enumerates all project slugs from
// getAll(); each render uses { title: project.title, meta: `${year} · ${tags.slice(0,3).join(' · ')}` }.
// UI-SPEC § Copywriting Contract per-project row (LOCKED — derived from schema).
// RESEARCH § Pattern 2 (Next 16: params + id are Promise<...>).
import { notFound } from 'next/navigation'
import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-template'
import { getProject } from '@/lib/projects'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) return []
  return [
    {
      id: project.slug,
      contentType: OG_CONTENT_TYPE,
      size: OG_SIZE,
      alt: `${project.title} — ${project.tagline}`,
    },
  ]
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
  id: Promise<string>
}) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()

  const tags = project!.tags.slice(0, 3).join(' · ')
  const meta = `${project!.year} · ${tags}`
  return renderOg({ title: project!.title, meta })
}

// generateStaticParams equivalent: enumerated by generateImageMetadata via getAll().
// No need for a separate generateStaticParams on this file — the parent route's
// generateStaticParams (in app/(site)/projects/[slug]/page.tsx) already drives slugs.
