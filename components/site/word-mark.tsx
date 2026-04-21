/**
 * WordMark — site logo affordance.
 *
 * UI-SPEC contract: whole mark is <a href="/">, 1×6 amber vertical bar (decorative,
 * aria-hidden) + "olive elliott" in Geist Mono lowercase, medium weight, +2% tracking.
 * Color: text-primary at rest. 44×44 touch target via py-3 -my-3.
 */
export function WordMark() {
  return (
    <a
      href="/"
      className="inline-flex items-center gap-2 font-mono text-[0.875rem] font-medium tracking-[0.02em] lowercase text-[color:var(--color-text-primary)] py-3 -my-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <span
        aria-hidden="true"
        className="block w-px h-1.5 bg-[color:var(--color-accent)]"
      />
      <span>olive elliott</span>
    </a>
  )
}
