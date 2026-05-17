// app/resume/page.tsx
// /resume RSC route. Composes ResumeHeader + 5 ResumeSections from RESUME.
// Section order is LOCKED: summary → experience → projects → skills →
// education (UI-SPEC § /resume document outline; CONTEXT.md § Resume HTML Render).
// Phase 6 may add `robots: { index: false }` — defer per RESEARCH § Open Q 6.
import type { Metadata } from 'next'
import { ResumeEntry } from '@/components/resume/resume-entry'
import { ResumeHeader } from '@/components/resume/resume-header'
import { ResumeSection } from '@/components/resume/resume-section'
import { RESUME } from '@/content/resume'

export const metadata: Metadata = {
  title: 'resume',
  description:
    'Resume for Olive Elliott — engineer focused on autonomous workflows, local-first systems, and open-source tooling. Available as PDF download.',
  alternates: { canonical: '/resume' },
  openGraph: {
    title: 'resume · olivelliott.dev',
    description:
      'Resume for Olive Elliott — engineer focused on autonomous workflows, local-first systems, and open-source tooling.',
    url: '/resume',
    type: 'profile',
    // images: omitted — auto-wired by app/resume/opengraph-image.tsx (Phase 6 Pitfall 4 cleanup).
  },
  twitter: {
    card: 'summary_large_image',
    // images: omitted — auto-wired from the same opengraph-image.tsx convention.
  },
}

export default function ResumePage() {
  return (
    <>
      <a
        href="#resume-main"
        className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-2 focus:bg-white focus:text-black focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-black"
      >
        Skip to resume
      </a>
      <main id="resume-main">
        <article className="resume">
          <ResumeHeader header={RESUME.header} />

          <ResumeSection id="summary-h2" label="summary" hideHeading>
            <p className="text-[var(--text-body)] text-[color:var(--color-text-secondary)] max-w-prose">
              {RESUME.summary}
            </p>
          </ResumeSection>

          <hr className="hairline" />

          <ResumeSection id="experience-h2" label="experience">
            {RESUME.experience.map((entry) => (
              <ResumeEntry
                key={`${entry.company}-${entry.period}`}
                title={entry.role}
                meta={`${entry.company} · ${entry.period}`}
                bullets={entry.bullets}
              />
            ))}
          </ResumeSection>

          <hr className="hairline" />

          <ResumeSection id="projects-h2" label="projects">
            {RESUME.projects.map((p) => (
              <ResumeEntry
                key={p.name}
                title={p.name}
                meta={p.tagline ? `${p.tagline} · ${p.period}` : p.period}
                bullets={p.bullets}
                link={
                  p.link
                    ? { href: p.link, label: p.link.replace(/^https?:\/\//, '') }
                    : undefined
                }
              />
            ))}
          </ResumeSection>

          <hr className="hairline" />

          <ResumeSection id="skills-h2" label="skills">
            <dl className="resume-skills">
              {RESUME.skills.map((s) => (
                <div key={s.category} className="contents">
                  <dt>{s.category}</dt>
                  <dd>{s.items.join(', ')}</dd>
                </div>
              ))}
            </dl>
          </ResumeSection>

          <hr className="hairline" />

          <ResumeSection id="education-h2" label="education">
            {RESUME.education.map((e) => (
              <ResumeEntry
                key={`${e.institution}-${e.year}`}
                title={e.degree}
                meta={`${e.institution} · ${e.year}`}
                bullets={e.bullets}
              />
            ))}
          </ResumeSection>
        </article>
      </main>
    </>
  )
}
