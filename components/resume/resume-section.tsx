// components/resume/resume-section.tsx
// Generic <section> wrapper used by every /resume section. The H2 carries
// the 'resume-h2' class so app/resume/resume.css can apply the mono
// lowercase tertiary screen treatment AND the uppercase #000 paper treatment
// in @media print. UI-SPEC § Component 8.
interface ResumeSectionProps {
  id: string
  label: string
  children: React.ReactNode
  hideHeading?: boolean
}

export function ResumeSection({
  id,
  label,
  children,
  hideHeading = false,
}: ResumeSectionProps) {
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className={hideHeading ? 'sr-only' : 'resume-h2'}>
        {label}
      </h2>
      {children}
    </section>
  )
}
