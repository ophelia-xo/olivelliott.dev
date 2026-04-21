'use client'

import { m } from 'motion/react'

/**
 * FadeIn — opacity-only fade wrapper.
 *
 * UI-SPEC contract is load-bearing: this component wraps first-viewport content.
 * Animating transforms (y, x, scale, rotate) would introduce layout shift (CLS),
 * breaking the Phase 6 Lighthouse >= 90 budget. Opacity-only is free — no CLS,
 * no transform repaint.
 *
 * Reduced-motion behavior: `MotionConfig reducedMotion="user"` upstream collapses
 * the opacity transition when the user has `prefers-reduced-motion: reduce`.
 * The tagline appears at opacity 1 immediately — no jump, no flicker.
 *
 * Do NOT add any transform keys. `tests/fade-in.test.ts` has negative assertions
 * that will fail the build.
 */
type FadeInProps = {
  children: React.ReactNode
  delay?: number
}

export function FadeIn({ children, delay = 0 }: FadeInProps) {
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.22,
        ease: [0.22, 1, 0.36, 1],
        delay,
      }}
    >
      {children}
    </m.div>
  )
}
