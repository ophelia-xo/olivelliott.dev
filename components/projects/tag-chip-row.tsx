// components/projects/tag-chip-row.tsx
// RSC tag chip row. Each chip is a plain <a> linking to the (Phase 4) projects-index filter.
// The href works statically and degrades to Phase 1's custom 404 until Phase 4 ships the destination.
// Source: .planning/phases/03-project-detail-template/03-UI-SPEC.md § Component Inventory #3.
import type { Tag } from '@/lib/tags'

interface TagChipRowProps {
  tags: readonly Tag[]
}

export function TagChipRow({ tags }: TagChipRowProps) {
  return (
    <>
      {tags.map((tag) => (
        <a
          key={tag}
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
      ))}
    </>
  )
}
