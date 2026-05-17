import type { Metadata } from 'next'

import { HomeHero } from '@/components/home/home-hero'
import { HomeProjectGrid } from '@/components/home/home-project-grid'
import { getAll, getHeroProjects } from '@/lib/projects'

/**
 * Home page — Phase 4 (HOM-01..HOM-05).
 *
 * Replaces the Phase 1 placeholder (a single FadeIn-wrapped tagline). The new
 * composition is wordmark + role-frame + thesis-with-type-set-entrance hero,
 * then hero-tier project cards, then (when present) a secondary-tier grid.
 *
 * UI-SPEC § Anti-Patterns is the discipline:
 *   - One <h1> per route (the wordmark, inside <HomeHero>).
 *   - No bento. No carousel. No stagger-on-scroll. No glassmorphism.
 *   - One earned motion moment only — the per-word thesis fade inside
 *     <ThesisParagraph>. That's the entire v1 motion budget on this page.
 *
 * Anti-pattern guards locked at the source-grep level by tests/home/page.test.tsx
 * (HOM-04 invariants: no whileInView, no IntersectionObserver, no grid-cols-12,
 * no col-span-2 — anywhere in this file).
 */

const WORDMARK = 'olive elliott'
const ROLE_FRAME = 'engineer · autonomous workflows · local-first systems'

/* PLACEHOLDER: Phase 7 content pass — Olive to revise this string. */
const THESIS =
  "I work on Myco, Fathom, Agenda Keeper, and contributions to Aktiga — building local-first systems and autonomous workflows so people have time and attention for everything else that matters. Open-source where I can; honest about the trade-offs where I can't."

export const metadata: Metadata = {
  // No `title` here. The root layout declares title.default = 'olivelliott.dev'
  // AND title.template = '%s · olivelliott.dev'. If we declared
  // title: 'olivelliott.dev' on this route, Next would feed it through the
  // template and emit 'olivelliott.dev · olivelliott.dev' (RESEARCH § Pattern 5).
  // Omitting `title` lets the default flow through unchanged.
  description:
    'Olive Elliott — engineer building tools for autonomy, local-first systems, and open-source communities.',
  openGraph: {
    title: 'olivelliott.dev',
    description:
      'Olive Elliott — engineer building tools for autonomy, local-first systems, and open-source communities.',
    url: '/',
    type: 'website',
    // images: omitted — auto-wired by app/opengraph-image.tsx (Phase 6 Pitfall 4 cleanup).
    // Sibling opengraph-image.tsx is the source of truth; a manual array here would
    // shadow it on some merge paths and confuses future readers.
  },
  twitter: {
    card: 'summary_large_image',
    // images: omitted — auto-wired from the same opengraph-image.tsx convention.
  },
}

export default function HomePage() {
  const heroProjects = getHeroProjects()
  const secondaryProjects = getAll().filter((p) => p.tier === 'secondary')
  return (
    <>
      <HomeHero wordmark={WORDMARK} roleFrame={ROLE_FRAME} thesis={THESIS} />
      <HomeProjectGrid
        heroProjects={heroProjects}
        secondaryProjects={secondaryProjects}
      />
    </>
  )
}
