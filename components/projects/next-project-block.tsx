// components/projects/next-project-block.tsx
// RSC. End-of-page navigation block. Renders multi-project variant when `next`
// is a project, single-project (wayfinding) variant when null.
// The whileHover translateX is delegated to the tiny <NextProjectTitle> client island.
// Source: .planning/phases/03-project-detail-template/03-UI-SPEC.md § Component Inventory #9.
import { NextProjectTitle } from './next-project-title'

interface NextProjectBlockProps {
  next: { slug: string; title: string; tagline: string } | null
}

const TITLE_CLASSES = `
  mt-2 text-[var(--text-h2)] md:text-[var(--text-display)]
  leading-[1.15] tracking-[-0.015em]
  font-[600] text-[color:var(--color-text-primary)]
  group-hover:underline group-hover:decoration-[color:var(--color-accent)]
  group-hover:underline-offset-4
  group-focus-visible:underline group-focus-visible:decoration-[color:var(--color-accent)]
  group-focus-visible:underline-offset-4
`.trim()

export function NextProjectBlock({ next }: NextProjectBlockProps) {
  if (next === null) {
    return (
      <nav
        aria-label="Browse all projects"
        className="border-t border-[color:var(--color-hairline)] mt-16 md:mt-24 pt-12"
      >
        <a
          href="/projects"
          className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--color-accent)]"
        >
          <span className="font-mono text-[var(--text-label)] font-medium tracking-[0.02em] lowercase text-[color:var(--color-text-tertiary)]">
            all projects →
          </span>
          <NextProjectTitle className={TITLE_CLASSES}>
            Browse all projects
          </NextProjectTitle>
          <p className="mt-3 text-[var(--text-body)] leading-[1.6] text-[color:var(--color-text-secondary)] max-w-[65ch]">
            More work, including private case studies and secondary projects.
          </p>
        </a>
      </nav>
    )
  }

  return (
    <nav
      aria-label="Next project"
      className="border-t border-[color:var(--color-hairline)] mt-16 md:mt-24 pt-12"
    >
      <a
        href={`/projects/${next.slug}`}
        className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--color-accent)]"
      >
        <span className="font-mono text-[var(--text-label)] font-medium tracking-[0.02em] lowercase text-[color:var(--color-text-tertiary)]">
          next →
        </span>
        <NextProjectTitle className={TITLE_CLASSES}>{next.title}</NextProjectTitle>
        <p className="mt-3 text-[var(--text-body)] leading-[1.6] text-[color:var(--color-text-secondary)] max-w-[65ch]">
          {next.tagline}
        </p>
      </a>
    </nav>
  )
}
