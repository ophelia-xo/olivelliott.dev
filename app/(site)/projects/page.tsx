// app/(site)/projects/page.tsx
// /projects index — Phase 4 (PIX-01..PIX-04).
//
// RSC. Reads Next 16 Promise<searchParams>, narrows ?tag against TAGS, and
// dispatches to getProjectsByTag(activeTag) or getAll(). Renders TagFilterRow
// + (EmptyFilterState | tiered card grid). Zero client JS for the filter —
// chips are <a>; the URL is the state; back-button + reload restore natively.
//
// Pitfall 1 lock: searchParams is Promise<{...}>; MUST await. The integration
// test in tests/projects/index-page.test.tsx wraps every input in
// Promise.resolve(...).
//
// Pitfall 2 lock: searchParams is a plain object, NOT URLSearchParams. Read
// sp.tag via property access; normalize array form via Array.isArray.
//
// Pitfall 6 lock: TierSeparator receives an id matching the parent
// <section aria-labelledby="..."> — both id strings are constants here.
//
// Pitfall 9 lock: clear-filter href and active-chip href are the literal
// '/projects' (no trailing slash, no fragment). TagFilterRow enforces.
//
// Pitfall 11 lock: TAGS does NOT include 'hero' or 'secondary'. The narrowing
// below means even ?tag=hero degrades to activeTag=undefined (full list).
//
// Anti-pattern locks (sourced by tests/home/anti-patterns.test.ts in Task 3):
//   - NO 'use client' on this file
//   - NO useSearchParams / useRouter
//   - NO notFound() / redirect() — invalid tags degrade silently
import type { Metadata } from 'next'

import { EmptyFilterState } from '@/components/projects/empty-filter-state'
import { ProjectCardSecondary } from '@/components/projects/project-card-secondary'
import { TagFilterRow } from '@/components/projects/tag-filter-row'
import { TierSeparator } from '@/components/projects/tier-separator'
import { getAll, getAllTags, getProjectsByTag } from '@/lib/projects'
import { TAGS, type Tag } from '@/lib/tags'

export const metadata: Metadata = {
  // Root layout's titleTemplate '%s · olivelliott.dev' wraps this to
  // 'all projects · olivelliott.dev'. Per RESEARCH § Pattern 5.
  title: 'all projects',
  description:
    "A filterable index of Olive Elliott's work — hero-tier case studies and secondary projects across local-first, autonomous, and open-source contributions.",
  alternates: { canonical: '/projects' },
  openGraph: {
    title: 'all projects',
    description:
      "A filterable index of Olive Elliott's work across local-first, autonomous, and open-source contributions.",
    url: '/projects',
    type: 'website',
    // images: omitted — auto-wired by app/(site)/projects/opengraph-image.tsx (Phase 6 Pitfall 4 cleanup).
  },
  twitter: {
    card: 'summary_large_image',
    // images: omitted — auto-wired from the same opengraph-image.tsx convention.
  },
}

interface PageProps {
  searchParams: Promise<{ tag?: string | string[] }>
}

export default async function ProjectsIndexPage({ searchParams }: PageProps) {
  const sp = await searchParams
  // Normalize array form via Array.isArray (Pitfall 2). For ?tag=a&tag=b, take
  // the first value. For absent/single, pass through.
  const rawTag = Array.isArray(sp.tag) ? sp.tag[0] : sp.tag
  // Narrow against TAGS literal tuple. The `as readonly string[]` cast is
  // required because TAGS is `as const` (readonly tuple of literals) and
  // .includes on that tuple would otherwise demand the arg ALREADY be one of
  // the literals — defeating the narrowing (RESEARCH § Pattern 1).
  const activeTag: Tag | undefined =
    rawTag && (TAGS as readonly string[]).includes(rawTag)
      ? (rawTag as Tag)
      : undefined

  const allTags = getAllTags()
  const projects = activeTag ? getProjectsByTag(activeTag) : getAll()
  const heroProjects = projects.filter((p) => p.tier === 'hero')
  const secondaryProjects = projects.filter((p) => p.tier === 'secondary')

  return (
    <>
      <header>
        <h1 className="font-mono text-[var(--text-display)] leading-[var(--text-display--line-height)] tracking-[0.02em] font-medium lowercase text-[color:var(--color-text-primary)]">
          all projects
        </h1>
      </header>
      <TagFilterRow tags={allTags} activeTag={activeTag} />
      {activeTag && projects.length === 0 ? (
        <EmptyFilterState tag={activeTag} />
      ) : (
        <>
          {heroProjects.length > 0 && (
            <section aria-labelledby="hero-tier-eyebrow">
              <TierSeparator label="hero" id="hero-tier-eyebrow" />
              <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {heroProjects.map((p) => (
                  <ProjectCardSecondary key={p.slug} project={p} hero />
                ))}
              </div>
            </section>
          )}
          {secondaryProjects.length > 0 && (
            <section aria-labelledby="secondary-tier-eyebrow">
              <TierSeparator label="secondary" id="secondary-tier-eyebrow" />
              <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {secondaryProjects.map((p) => (
                  <ProjectCardSecondary key={p.slug} project={p} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </>
  )
}
