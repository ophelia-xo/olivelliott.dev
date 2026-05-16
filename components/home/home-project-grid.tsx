// components/home/home-project-grid.tsx
// RSC. Orchestrates the project sections of the home page.
//
// Conditional rendering rule (HOM-03): if secondaryProjects is empty, the
// entire "more work" section is OMITTED — no empty grid, no "coming soon"
// placeholder (UI-SPEC § Anti-Patterns).
//
// No motion. No whileInView. No stagger-on-scroll (HOM-04). All cards render
// statically — they exist in the SSR HTML and stay there.
//
// Anti-bento lock: only grid-cols-1 / md:grid-cols-2 / lg:grid-cols-3 on the
// secondary grid; no grid-cols-12, no col-span-2, no grid-rows-. Tests in
// app/(site)/page.test.tsx source-grep the page file for these to enforce HOM-04
// at the source level.
import { ProjectCardHero } from '@/components/projects/project-card-hero'
import { ProjectCardSecondary } from '@/components/projects/project-card-secondary'
import type { Project } from '@/lib/content'

interface HomeProjectGridProps {
  heroProjects: readonly Project[]
  secondaryProjects: readonly Project[]
}

export function HomeProjectGrid({
  heroProjects,
  secondaryProjects,
}: HomeProjectGridProps) {
  return (
    <>
      <hr
        className="border-t border-[color:var(--color-hairline)] my-12 md:my-16"
        aria-hidden="true"
      />
      {heroProjects.length > 0 && (
        <section aria-labelledby="hero-eyebrow">
          <p
            id="hero-eyebrow"
            className="font-mono text-[var(--text-label)] font-medium tracking-[0.02em] lowercase text-[color:var(--color-text-tertiary)]"
          >
            selected work
          </p>
          <div className="mt-6 md:mt-8 flex flex-col gap-8 md:gap-12">
            {heroProjects.map((p) => (
              <ProjectCardHero key={p.slug} project={p} />
            ))}
          </div>
        </section>
      )}
      {secondaryProjects.length > 0 && (
        <section
          aria-labelledby="secondary-eyebrow"
          className="mt-16 md:mt-24"
        >
          <p
            id="secondary-eyebrow"
            className="font-mono text-[var(--text-label)] font-medium tracking-[0.02em] lowercase text-[color:var(--color-text-tertiary)]"
          >
            more work
          </p>
          <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {secondaryProjects.map((p) => (
              <ProjectCardSecondary key={p.slug} project={p} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
