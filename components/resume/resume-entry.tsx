// components/resume/resume-entry.tsx
// Generic entry — title + meta + bullets + optional repo link.
// Used by experience, projects, and education sections. Classes
// 'entry-title', 'entry-meta', 'entry-bullets', 'repo-link' are the
// hooks app/resume/resume.css targets for screen + print rules.
// UI-SPEC § Component 9.
interface ResumeEntryProps {
  title: string
  meta: string
  bullets: string[]
  link?: { href: string; label: string }
}

export function ResumeEntry({ title, meta, bullets, link }: ResumeEntryProps) {
  return (
    <div className="resume-entry mt-4">
      <div className="entry-head flex flex-wrap items-baseline gap-3">
        <p className="entry-title text-[color:var(--color-text-primary)] font-medium">
          {title}
        </p>
        <p className="entry-meta font-mono text-[var(--text-label)] tracking-[0.02em] text-[color:var(--color-text-tertiary)]">
          {meta}
        </p>
      </div>
      <ul className="entry-bullets mt-2 pl-4 list-disc">
        {bullets.map((b, i) => (
          <li
            key={`${i}-${b.slice(0, 24)}`}
            className="text-[var(--text-body)] text-[color:var(--color-text-secondary)] leading-[1.6] mt-1"
          >
            {b}
          </li>
        ))}
      </ul>
      {link && (
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="repo-link font-mono text-[var(--text-label)] tracking-[0.02em] lowercase text-[color:var(--color-accent)] hover:text-[color:var(--color-accent-hover)] focus-visible:text-[color:var(--color-accent-hover)] mt-2 inline-block"
        >
          {link.label} ↗
        </a>
      )}
    </div>
  )
}
