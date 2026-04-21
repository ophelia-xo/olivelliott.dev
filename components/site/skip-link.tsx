/**
 * SkipLink — keyboard-first accessibility affordance.
 *
 * UI-SPEC contract: first focusable element, targets #main, sr-only by default,
 * reveals at top:8 left:8 on focus with accent outline. Copy locked: "Skip to content".
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-2 focus:bg-[color:var(--color-bg)] focus:text-accent focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent"
    >
      Skip to content
    </a>
  )
}
