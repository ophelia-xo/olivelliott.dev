// components/resume/download-pdf-link.tsx
// Phase 5 download affordance — used at the top-right of /resume (via
// ResumeHeader) AND inline in the site footer (Plan 05-04). RSC ONLY:
// no 'use client', no motion, no Lucide. The ↓ is a literal Unicode
// character (U+2193), not an icon. Class 'download-pdf-link' is the
// print-mode display:none hook in app/resume/resume.css.
// RES-05; UI-SPEC § Component 10; Pitfall 7.
import { cn } from '@/lib/utils'

interface DownloadPdfLinkProps {
  className?: string
}

export function DownloadPdfLink({ className }: DownloadPdfLinkProps) {
  return (
    <a
      href="/resume.pdf"
      download
      className={cn(
        'download-pdf-link',
        'font-mono text-[var(--text-label)] font-medium tracking-[0.02em] lowercase',
        'text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)] focus-visible:text-[color:var(--color-text-primary)]',
        'p-3',
        className,
      )}
    >
      download.pdf ↓
    </a>
  )
}
