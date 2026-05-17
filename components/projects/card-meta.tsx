// components/projects/card-meta.tsx
// RSC. Presentational sibling of Phase 3's <ProjectMeta> for use inside card
// surfaces. Chips are <span> (not <a>) to avoid nested-anchor invalidity
// when wrapped by a card's outer <a href="/projects/${slug}">.
//
// Pitfall 12 lock: NEVER import TagChipRow into this file. The IDE may
// auto-suggest it — refuse. Tests assert zero <a> elements in the rendered
// output as the regression lock.
//
// Privacy contract on the card (HOM-02, PIX-04): visibility==='private' renders
// the literal 'code private' label in --color-text-tertiary. NO repo link is
// ever rendered on a card surface — that's the detail page's job.
//
// Source: .planning/phases/04-home-+-projects-index/04-RESEARCH.md § Example 4.
import type { Tag } from '@/lib/tags'

interface CardMetaProps {
  year: number
  tags: readonly Tag[]
  visibility: 'public' | 'private'
}

export function CardMeta({ year, tags, visibility }: CardMetaProps) {
  return (
    <ul
      role="list"
      aria-label="Project metadata"
      className="flex flex-wrap items-center gap-3 list-none p-0 m-0"
    >
      <li role="listitem">
        <time
          dateTime={String(year)}
          className="font-mono text-[var(--text-label)] font-medium tracking-[0.02em] text-[color:var(--color-text-secondary)]"
        >
          {year}
        </time>
      </li>
      {tags.map((tag) => (
        <li key={tag} role="listitem">
          <span className="inline-flex items-center px-3 py-2 bg-[color:var(--color-surface-2)] rounded-sm font-mono text-[var(--text-label)] font-medium tracking-[0.02em] lowercase text-[color:var(--color-text-secondary)]">
            {tag}
          </span>
        </li>
      ))}
      {visibility === 'private' && (
        <li role="listitem">
          <span className="font-mono text-[var(--text-label)] font-medium tracking-[0.02em] lowercase text-[color:var(--color-text-tertiary)]">
            code private
          </span>
        </li>
      )}
    </ul>
  )
}
