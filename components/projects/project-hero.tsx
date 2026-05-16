// components/projects/project-hero.tsx
// RSC hero block. Branches on isPlaceholderHero(hero.src) to pick image-present
// (Variant A: 2-column on md+) vs text-only (Variant B: single column, no <img>).
// Source: .planning/phases/03-project-detail-template/03-UI-SPEC.md § Component Inventory #1 + § Hero Variants.
import Image from 'next/image'
import { isPlaceholderHero } from '@/lib/hero-fallback'
import type { Tag } from '@/lib/tags'
import { ProjectMeta } from './project-meta'

interface ProjectHeroProps {
  title: string
  tagline: string
  year: number
  tags: readonly Tag[]
  visibility: 'public' | 'private'
  repoUrl?: string
  hero: { src: string; alt: string }
}

export function ProjectHero({
  title,
  tagline,
  year,
  tags,
  visibility,
  repoUrl,
  hero,
}: ProjectHeroProps) {
  const isText = isPlaceholderHero(hero.src)

  if (isText) {
    return (
      <header className="w-full">
        <div className="flex flex-col gap-6">
          <h1 className="text-[var(--text-display)] leading-[1.15] tracking-[-0.02em] font-medium text-[color:var(--color-text-primary)]">
            {title}
          </h1>
          <p className="text-[var(--text-body)] leading-[1.6] text-[color:var(--color-text-secondary)]">
            {tagline}
          </p>
          <ProjectMeta
            year={year}
            tags={tags}
            visibility={visibility}
            repoUrl={repoUrl}
          />
        </div>
      </header>
    )
  }

  return (
    <header className="w-full md:grid md:grid-cols-12 md:gap-8 items-start">
      <div className="flex flex-col gap-6 md:col-span-7">
        <h1 className="text-[var(--text-display)] leading-[1.15] tracking-[-0.02em] font-medium text-[color:var(--color-text-primary)]">
          {title}
        </h1>
        <p className="text-[var(--text-body)] leading-[1.6] text-[color:var(--color-text-secondary)]">
          {tagline}
        </p>
        <ProjectMeta
          year={year}
          tags={tags}
          visibility={visibility}
          repoUrl={repoUrl}
        />
      </div>
      <div className="mt-8 md:mt-0 md:col-span-5">
        <Image
          src={hero.src}
          alt={hero.alt}
          width={1200}
          height={900}
          sizes="(min-width: 768px) 50vw, 100vw"
          priority
          className="rounded-none w-full h-auto"
        />
      </div>
    </header>
  )
}
