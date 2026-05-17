// components/resume/resume-header.tsx
// Header block at the top of /resume. Composes the H1, role + location
// lines, the inline contact line, and the absolute-positioned
// DownloadPdfLink (top-right). RSC; no client behavior.
// The mailto subject is HARDCODED to 'hi%20from%20olivelliott.dev' (locked
// copywriting decision, NOT a content/resume.ts field — the same string
// flows to /about ContactStack (Plan 05-03) and footer (Plan 05-04)).
// Pitfall 5: %20 literal, never '+'.
// UI-SPEC § Component 7; § /resume document outline; § Copywriting Contract.
import type { Resume } from '@/lib/schemas'
import { DownloadPdfLink } from './download-pdf-link'

interface ResumeHeaderProps {
  header: Resume['header']
}

export function ResumeHeader({ header }: ResumeHeaderProps) {
  return (
    <header className="resume-header relative">
      <h1 className="text-[var(--text-display)] lowercase font-medium tracking-[-0.02em] text-[color:var(--color-text-primary)]">
        {header.name}
      </h1>
      <p className="text-[var(--text-body)] text-[color:var(--color-text-secondary)] mt-2">
        {header.role}
      </p>
      <p className="text-[var(--text-label)] text-[color:var(--color-text-tertiary)] mt-1">
        {header.location}
      </p>
      <ul className="contact-line">
        <li>
          <a href={`mailto:${header.links.email}?subject=hi%20from%20olivelliott.dev`}>
            {header.links.email}
          </a>
        </li>
        <li>
          <a href={header.links.github} target="_blank" rel="noopener noreferrer">
            {header.links.github.replace(/^https?:\/\//, '')}
          </a>
        </li>
        <li>
          <a href={header.links.linkedin} target="_blank" rel="noopener noreferrer">
            {header.links.linkedin.replace(/^https?:\/\//, '')}
          </a>
        </li>
      </ul>
      <DownloadPdfLink />
    </header>
  )
}
