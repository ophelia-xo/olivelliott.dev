// components/projects/tag-chip-row.tsx
// RSC tag chip row. Each chip is a plain <a> linking to the (Phase 4) projects-index filter.
// The href works statically and degrades to Phase 1's custom 404 until Phase 4 ships the destination.
// Source: .planning/phases/03-project-detail-template/03-UI-SPEC.md § Component Inventory #3.
//
// Phase 6 Plan 06-03 (QAL-02): each chip is wrapped in <li role="listitem"> so
// the parent ProjectMeta <ul role="list"> satisfies the axe `aria-required-children`
// rule (a list role MUST contain at least one listitem descendant).
import type { Tag } from '@/lib/tags'

interface TagChipRowProps {
  tags: readonly Tag[]
}

export function TagChipRow({ tags }: TagChipRowProps) {
  return (
    <>
      {tags.map((tag) => (
        <li key={tag} role="listitem">
          <a
            href={`/projects?tag=${tag}`}
            className="
              inline-flex items-center px-3 py-2 -my-2
              bg-[color:var(--color-surface-2)] rounded-sm
              font-mono text-[var(--text-label)] font-medium tracking-[0.02em] lowercase
              text-[color:var(--color-text-secondary)]
              hover:text-[color:var(--color-text-primary)]
              transition-colors duration-[120ms] ease-linear
            "
          >
            {tag}
          </a>
        </li>
      ))}
    </>
  )
}
