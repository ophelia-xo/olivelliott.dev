// components/projects/empty-filter-state.tsx
// RSC. Inline message when a valid filter yields zero matching projects.
// No illustration, no empty-state cliché. Single sentence + inline clear link.
//
// Copy is LOCKED — UI-SPEC § Copywriting Contract:
//   no projects tagged "{tag}" — view all projects →
// - em-dash is U+2014 (—), arrow is U+2192 (→), quotes are U+0022 (").
// - The `view all projects →` text IS the link's accessible name (no aria-hidden
//   on the arrow — it's part of the call-to-action).
// - The link href is the literal '/projects' (Pitfall 9: no trailing slash, no
//   fragment) so back-button + reload restoration work natively.
import type { Tag } from '@/lib/tags'

interface EmptyFilterStateProps {
  tag: Tag
}

export function EmptyFilterState({ tag }: EmptyFilterStateProps) {
  return (
    <div className="py-12 max-w-[55ch] mx-auto">
      <p className="text-[var(--text-body)] leading-[var(--text-body--line-height)] text-[color:var(--color-text-secondary)]">
        no projects tagged{' '}
        <span className="font-mono lowercase">&quot;{tag}&quot;</span>
        {' — '}
        <a
          href="/projects"
          className="text-[color:var(--color-accent)] hover:text-[color:var(--color-accent-hover)] underline underline-offset-2 decoration-1"
        >
          view all projects →
        </a>
      </p>
    </div>
  )
}
