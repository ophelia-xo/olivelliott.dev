// components/home/home-hero.tsx
// RSC. Home-page hero stack — wordmark <h1> + role frame <p> + <ThesisParagraph>
// slot. The single <h1> on the home route lives here (HOM-01).
//
// Typography for the thesis is passed DOWN from HomeHero via className (per
// RESEARCH § Open Question #2 recommendation). ThesisParagraph owns segmentation
// and motion only — body / Geist Sans / 400 / leading-1.6 / max-w-[55ch] /
// --color-text-secondary belong here so the role frame and thesis share the
// same type stack visually.
//
// The U+00B7 separators in the role frame are plain text — they read out loud
// as "middle dot" to screen readers but the alternative (wrapping each in
// aria-hidden="true" with comma fallbacks) adds DOM weight for marginal
// ergonomics. Left as plain text per UI-SPEC § Accessibility Contract leeway
// clause — Phase 6 a11y audit may revisit.
import { ThesisParagraph } from '@/components/home/thesis-paragraph'

interface HomeHeroProps {
  wordmark: string
  roleFrame: string
  thesis: string
}

export function HomeHero({ wordmark, roleFrame, thesis }: HomeHeroProps) {
  return (
    <section
      id="hero"
      aria-labelledby="hero-wordmark"
      className="flex flex-col"
    >
      <h1
        id="hero-wordmark"
        className="font-sans text-[clamp(2rem,5vw,3rem)] leading-[1.15] tracking-[-0.02em] font-medium lowercase text-[color:var(--color-text-primary)]"
      >
        {wordmark}
      </h1>
      <p className="mt-4 text-[var(--text-body)] leading-[var(--text-body--line-height)] text-[color:var(--color-text-secondary)] max-w-[55ch]">
        {roleFrame}
      </p>
      <ThesisParagraph
        text={thesis}
        className="mt-6 text-[var(--text-body)] leading-[var(--text-body--line-height)] text-[color:var(--color-text-secondary)] max-w-[55ch]"
      />
    </section>
  )
}
