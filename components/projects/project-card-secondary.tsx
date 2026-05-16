// components/projects/project-card-secondary.tsx
// RSC. Compact card for (a) secondary-tier projects on the home page and
// (b) ALL projects on the /projects index page. The `hero` prop adds a
// mono-prefix label above the title — used ONLY on /projects index to mark
// hero-tier position (the home page uses card SIZE to convey tier).
//
// Split rationale (RESEARCH § Component Split): kept as a separate file
// (not unified with ProjectCardHero behind a `tier` prop) because heading
// levels differ (H2 vs H3), DOM shapes diverge (no image, no outcomes here),
// and prop shapes are asymmetric (hero variant has no `hero` boolean).
//
// Same Pitfall 3 lock as ProjectCardHero — chips inside via <CardMeta> as
// <span>, never <TagChipRow>.
import { CardMeta } from '@/components/projects/card-meta'
import type { Project } from '@/lib/content'

interface ProjectCardSecondaryProps {
  project: Project
  hero?: boolean
}

export function ProjectCardSecondary({ project, hero = false }: ProjectCardSecondaryProps) {
  return (
    <a
      href={`/projects/${project.slug}`}
      className="group block border border-[color:var(--color-hairline)] hover:border-[color:var(--color-text-tertiary)] transition-colors duration-[220ms] ease-linear p-6 flex flex-col gap-4"
    >
      {hero && (
        <p className="font-mono text-[var(--text-label)] font-medium tracking-[0.02em] lowercase text-[color:var(--color-text-tertiary)]">
          hero
        </p>
      )}
      <h3 className="font-sans text-[var(--text-h3)] leading-[var(--text-h3--line-height)] font-semibold tracking-[-0.01em] text-[color:var(--color-text-primary)] group-hover:underline group-hover:decoration-[color:var(--color-accent)] group-hover:underline-offset-[4px] group-hover:decoration-1 group-focus-visible:underline group-focus-visible:decoration-[color:var(--color-accent)] group-focus-visible:underline-offset-[4px]">
        {project.title}
      </h3>
      <p className="text-[var(--text-body)] leading-[var(--text-body--line-height)] text-[color:var(--color-text-secondary)]">
        {project.tagline}
      </p>
      <CardMeta year={project.year} tags={project.tags} visibility={project.visibility} />
    </a>
  )
}
