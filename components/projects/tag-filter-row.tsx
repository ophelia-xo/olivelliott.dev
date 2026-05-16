// components/projects/tag-filter-row.tsx
// RSC. URL-synced single-tag filter for /projects.
//
// Each chip is a plain <a>; clicking causes a full server navigation; the URL
// is the state; back-button + reload restore the exact filter natively. NO
// useSearchParams, NO 'use client', NO router calls. (RESEARCH § Pattern 2.)
//
// ARIA: aria-pressed (toggle-button) + aria-current="true" (generic current
// in a set). Both attributes co-exist (RESEARCH § Pattern 3 + Open Question #5).
//
// Count badge uses `text-current` so it inherits the chip parent's color across
// active (--color-text-on-accent) and inactive (--color-text-secondary) states
// (RESEARCH Pitfall 7). Do NOT add an explicit color class to the badge.
//
// Chip text uses TAG_LABELS (human-facing, sentence-case) — NOT raw tag
// values. Raw lowercase tag values are reserved for card chips (CardMeta).
//
// Pitfall 9 lock: the active-chip clear-href and the clear-filter link href
// are both the literal '/projects' (no trailing slash, no fragment).
//
// Pitfall 11 lock: TAG_LABELS never includes 'hero' or 'secondary' (TAGS does
// not contain them). Those eyebrow labels are positional, never filterable.
import { TAG_LABELS, type Tag } from '@/lib/tags'

interface TagFilterRowProps {
  tags: ReadonlyArray<{ tag: Tag; count: number }>
  activeTag?: Tag
}

const CHIP_BASE =
  'inline-flex items-center px-3 py-2 rounded-sm font-mono text-[var(--text-label)] font-medium tracking-[0.02em] lowercase transition-colors duration-[120ms] ease-linear'

const CHIP_INACTIVE = `${CHIP_BASE} bg-[color:var(--color-surface-2)] text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]`

const CHIP_ACTIVE = `${CHIP_BASE} bg-[color:var(--color-accent)] text-[color:var(--color-text-on-accent)] hover:bg-[color:var(--color-accent-hover)]`

export function TagFilterRow({ tags, activeTag }: TagFilterRowProps) {
  return (
    <nav
      aria-label="Filter projects by tag"
      className="mt-16 md:mt-24"
    >
      <ul role="list" className="flex flex-wrap gap-3 items-center">
        {tags.map(({ tag, count }) => {
          const isActive = tag === activeTag
          const href = isActive ? '/projects' : `/projects?tag=${tag}`
          return (
            <li key={tag}>
              <a
                href={href}
                aria-pressed={isActive}
                aria-current={isActive ? 'true' : undefined}
                className={isActive ? CHIP_ACTIVE : CHIP_INACTIVE}
              >
                {TAG_LABELS[tag]}
                <span className="ml-2 text-current" aria-hidden="true">
                  {count}
                </span>
              </a>
            </li>
          )
        })}
        {activeTag && (
          <li>
            <a
              href="/projects"
              className="ml-3 px-3 py-2 -my-2 font-mono text-[var(--text-label)] font-medium tracking-[0.02em] lowercase text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)] no-underline hover:underline hover:underline-offset-4 hover:decoration-1 transition-colors duration-[120ms] ease-linear"
            >
              × clear filter
            </a>
          </li>
        )}
      </ul>
    </nav>
  )
}
