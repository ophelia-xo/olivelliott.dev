// app/(site)/about/page.tsx
// /about RSC route. Composes AboutBio + ProjectPillRow + ContactStack +
// ValuesList inside a single-column <article>. Lives INSIDE the (site)/
// group so it inherits Nav + Footer + MotionProvider chrome from
// app/(site)/layout.tsx (contrast with /resume which opts out by living
// at app/resume/ outside this group).
//
// See UI-SPEC § /about document outline; § Component Inventory § 1.
// Satisfies ABT-01 + ABT-02 + ABT-03 + CTC-03 (second surface; footer is
// the first surface — Plan 05-04 audits footer).
import type { Metadata } from 'next'
import { AboutBio } from '@/components/about/about-bio'
import { ContactStack } from '@/components/about/contact-stack'
import { ProjectPillRow } from '@/components/about/project-pill-row'
import { ValuesList } from '@/components/about/values-list'

export const metadata: Metadata = {
  // Root layout's titleTemplate '%s · olivelliott.dev' wraps this to
  // 'about · olivelliott.dev'. Per Phase 4 STATE.md per-route pattern.
  title: 'about',
  description:
    'Olive Elliott is an engineer focused on autonomous workflows, local-first systems, and tools that support open-source communities. Currently building at Aktiga.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'about · olivelliott.dev',
    description:
      'Olive Elliott is an engineer focused on autonomous workflows, local-first systems, and tools that support open-source communities. Currently building at Aktiga.',
    url: '/about',
    type: 'website',
    // images: omitted — auto-wired by app/(site)/about/opengraph-image.tsx (Phase 6 Pitfall 4 cleanup).
  },
  twitter: {
    card: 'summary_large_image',
    // images: omitted — auto-wired from the same opengraph-image.tsx convention.
  },
}

export default function AboutPage() {
  return (
    <article className="about flex flex-col gap-12">
      <h1 className="text-[var(--text-display)] lowercase font-medium tracking-[-0.02em] text-[color:var(--color-text-primary)]">
        about
      </h1>

      <section aria-labelledby="who-i-am-eyebrow">
        <p
          id="who-i-am-eyebrow"
          className="font-mono text-[var(--text-label)] font-medium tracking-[0.02em] lowercase text-[color:var(--color-text-tertiary)]"
        >
          who I am
        </p>
        <div className="mt-4">
          <AboutBio />
        </div>
      </section>

      <section aria-labelledby="working-on-eyebrow">
        <h2
          id="working-on-eyebrow"
          className="text-[var(--text-h2)] font-semibold tracking-[-0.015em] text-[color:var(--color-text-primary)]"
        >
          what I'm working on
        </h2>
        <p className="mt-4 text-[var(--text-body)] text-[color:var(--color-text-secondary)] max-w-prose leading-[1.6]">
          Three projects are getting most of my focus right now — built to test the thesis
          that small, local-first tools earn their keep by staying out of the way.
        </p>
        <ProjectPillRow />
      </section>

      <section aria-labelledby="reach-me-eyebrow">
        <h2
          id="reach-me-eyebrow"
          className="text-[var(--text-h2)] font-semibold tracking-[-0.015em] text-[color:var(--color-text-primary)]"
        >
          how to reach me
        </h2>
        <div className="mt-4">
          <ContactStack />
        </div>
      </section>

      <section aria-labelledby="values-eyebrow">
        <h2
          id="values-eyebrow"
          className="text-[var(--text-h2)] font-semibold tracking-[-0.015em] text-[color:var(--color-text-primary)]"
        >
          values
        </h2>
        <div className="mt-4">
          <ValuesList />
        </div>
      </section>
    </article>
  )
}
