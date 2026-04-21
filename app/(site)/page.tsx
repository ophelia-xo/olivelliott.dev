import { FadeIn } from '@/components/motion/fade-in'

/**
 * Home placeholder — Phase 1.
 *
 * UI-SPEC Component #8. Explicitly a placeholder; real home content lands in
 * Phase 4 (HOM-01...HOM-05). The FadeIn-wrapped tagline is the single proving
 * element for the motion system (FND-05 + Phase 1 success criterion #3).
 *
 * Copy is locked in the UI-SPEC Copywriting Contract — do not paraphrase.
 * No "coming soon" cliché — the page acknowledges its scaffold state honestly
 * per PROJECT.md's content-honesty constraint.
 */
export default function HomePage() {
  return (
    <section className="py-16 md:py-24 flex flex-col gap-4">
      <h1 className="font-sans text-[clamp(2rem,5vw,3rem)] leading-[1.15] tracking-[-0.02em] font-medium lowercase text-[color:var(--color-text-primary)]">
        olivelliott.dev
      </h1>
      <FadeIn>
        <p className="font-sans text-base leading-[1.6] text-[color:var(--color-text-secondary)]">
          under construction. real projects arrive in phase 4.
        </p>
      </FadeIn>
    </section>
  )
}
