// components/about/project-pill-row.tsx
// Pill row on /about — links to /projects/{slug} for each hero-tier project.
// RSC; calls getHeroProjects() at render time so the row auto-updates when
// Phase 7 adds more hero MDX.
//
// Pitfall 3-style separation: this component is intentionally separate from
// the Phase 3 tag-chip component. Phase 3's chip carries tag URL state on
// /projects; this one carries project navigation on /about. They share
// visual treatment by mirroring the class string, NOT by import or
// refactor. See UI-SPEC § Component Inventory § 3 for the rationale.
import { getHeroProjects } from '@/lib/projects'

export function ProjectPillRow() {
  const projects = getHeroProjects()

  return (
    <nav aria-label="Featured projects" className="mt-4">
      <ul role="list" className="flex flex-wrap gap-3">
        {projects.map((p) => (
          <li key={p.slug}>
            <a
              href={`/projects/${p.slug}`}
              className="inline-flex items-center font-mono text-[var(--text-label)] font-medium tracking-[0.02em] lowercase bg-[color:var(--color-surface-2)] text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)] focus-visible:text-[color:var(--color-text-primary)] px-3 py-2 -my-2 rounded-sm transition-colors duration-[120ms] ease-linear"
            >
              {p.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
