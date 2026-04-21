import Link from 'next/link'

/**
 * Custom 404 — Phase 1.
 *
 * UI-SPEC Component #10. Honest register per PROJECT.md content-honesty
 * constraint: copy acknowledges the route is unbuilt, not broken. The display
 * "404" is Geist Mono (not Sans) to read as intentional/editorial at display size.
 *
 * This page renders OUTSIDE the (site) route group — it does not inherit the
 * MotionProvider/Nav/Footer. Phase 6 may revisit.
 */
export default function NotFound() {
  return (
    <section className="mx-auto max-w-6xl px-6 md:px-8 lg:px-12 py-16 md:py-24 flex flex-col gap-4">
      <h1 className="font-mono text-[clamp(2rem,5vw,3rem)] leading-[1.15] font-medium text-[color:var(--color-text-primary)]">
        404
      </h1>
      <p className="font-sans text-base leading-[1.6] text-[color:var(--color-text-secondary)]">
        not found — that route doesn’t exist yet.
      </p>
      <Link
        href="/"
        className="font-sans text-base text-[color:var(--color-accent)] hover:text-[color:var(--color-accent-hover)] focus-visible:underline"
      >
        → back home
      </Link>
    </section>
  )
}
