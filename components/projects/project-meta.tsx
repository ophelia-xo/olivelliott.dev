// components/projects/project-meta.tsx
// RSC. Year + tag chips + repo-or-private-label, single accessible row.
// Privacy gating is on visibility, NOT on repoUrl absence (per UI-SPEC + RESEARCH anti-pattern).
// Source: .planning/phases/03-project-detail-template/03-UI-SPEC.md § Component Inventory #2 + § Privacy Rendering Contract.
import type { Tag } from '@/lib/tags'
import { TagChipRow } from './tag-chip-row'

interface ProjectMetaProps {
  year: number
  tags: readonly Tag[]
  visibility: 'public' | 'private'
  repoUrl?: string
}

export function ProjectMeta({ year, tags, visibility, repoUrl }: ProjectMetaProps) {
  const isPrivate = visibility === 'private'
  return (
    <div
      role="list"
      aria-label="Project metadata"
      className="flex flex-wrap items-center gap-3"
    >
      <time
        dateTime={String(year)}
        className="font-mono text-[var(--text-label)] font-medium tracking-[0.02em] text-[color:var(--color-text-secondary)]"
      >
        {year}
      </time>
      <TagChipRow tags={tags} />
      {isPrivate ? (
        <span className="font-mono text-[var(--text-label)] font-medium tracking-[0.02em] lowercase text-[color:var(--color-text-tertiary)]">
          code private
        </span>
      ) : repoUrl ? (
        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="
            font-mono text-[var(--text-label)] font-medium tracking-[0.02em] lowercase
            text-[color:var(--color-accent)] hover:text-[color:var(--color-accent-hover)]
            py-2 -my-2
            no-underline hover:underline hover:underline-offset-4 hover:decoration-1
            transition-colors duration-[120ms] ease-linear
          "
        >
          repo <span aria-hidden="true">↗</span>
        </a>
      ) : null}
    </div>
  )
}
