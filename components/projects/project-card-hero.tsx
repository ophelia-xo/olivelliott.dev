// components/projects/project-card-hero.tsx
// RSC. Wide horizontal hero-tier card for the home page.
//
// Composition: outer <a href="/projects/${slug}"> wraps the whole card so the
// entire surface is one hit target. Inner chips are <span> via <CardMeta>
// (Pitfall 3 — never nest <a> inside <a>; tests lock at 1 anchor total).
//
// Image branching via isPlaceholderHero (Phase 3 helper): placeholder src →
// text-only variant, real artwork → 7/12-text + 5/12-image grid at md+.
//
// No `priority` on the <Image> per RESEARCH § Open Question #3 — LCP tuning is
// a Phase 6 concern; defaulting to no-priority lets the framework decide.
//
// No Motion. CSS-only hover/focus (border-color lift + title underline) per
// UI-SPEC § Card hover/focus contract.
import Image from 'next/image'
import { CardMeta } from '@/components/projects/card-meta'
import type { Project } from '@/lib/content'
import { isPlaceholderHero } from '@/lib/hero-fallback'

interface ProjectCardHeroProps {
  project: Project
}

export function ProjectCardHero({ project }: ProjectCardHeroProps) {
  const hasImage = !isPlaceholderHero(project.hero.src)
  const outcomes = project.outcomes.slice(0, 3)
  return (
    <a
      href={`/projects/${project.slug}`}
      className="group block border border-[color:var(--color-hairline)] hover:border-[color:var(--color-text-tertiary)] transition-colors duration-[220ms] ease-linear p-6 md:p-12"
    >
      <div className={hasImage ? 'md:grid md:grid-cols-12 md:gap-8 items-start' : ''}>
        <div className={hasImage ? 'flex flex-col gap-4 md:col-span-7' : 'flex flex-col gap-4'}>
          <h2 className="font-sans text-[var(--text-h2)] md:text-[1.75rem] leading-[var(--text-h2--line-height)] font-semibold tracking-[-0.015em] text-[color:var(--color-text-primary)] group-hover:underline group-hover:decoration-[color:var(--color-accent)] group-hover:underline-offset-[4px] group-hover:decoration-1 group-focus-visible:underline group-focus-visible:decoration-[color:var(--color-accent)] group-focus-visible:underline-offset-[4px]">
            {project.title}
          </h2>
          <p className="text-[var(--text-body)] leading-[var(--text-body--line-height)] text-[color:var(--color-text-secondary)]">
            {project.tagline}
          </p>
          <CardMeta year={project.year} tags={project.tags} visibility={project.visibility} />
          {outcomes.length > 0 && (
            <ul className="mt-2 flex flex-col gap-2">
              {outcomes.map((outcome) => (
                <li
                  key={outcome}
                  className="text-[var(--text-body)] leading-[var(--text-body--line-height)] text-[color:var(--color-text-primary)] flex gap-2"
                >
                  <span aria-hidden="true" className="text-[color:var(--color-text-secondary)]">
                    →
                  </span>
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        {hasImage && (
          <div className="mt-8 md:mt-0 md:col-span-5">
            <Image
              src={project.hero.src}
              alt={project.hero.alt}
              width={1200}
              height={900}
              sizes="(min-width: 768px) 41vw, 100vw"
              className="rounded-none w-full h-auto"
            />
          </div>
        )}
      </div>
    </a>
  )
}
