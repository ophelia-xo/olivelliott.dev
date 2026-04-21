'use client'

import { domAnimation, LazyMotion, MotionConfig } from 'motion/react'

/**
 * Single motion provider for the (site) route group.
 *
 * - `MotionConfig reducedMotion="user"` — every `<m.*>` descendant automatically
 *   respects `prefers-reduced-motion: reduce`. No per-component hooks required.
 *
 * - `LazyMotion features={domAnimation} strict`:
 *     - `domAnimation` (~15KB) covers opacity/transform/shadow; sufficient for Phase 1.
 *       Swap to `domMax` only if layout/drag/pan becomes necessary in later phases.
 *     - `strict` forces all downstream motion components to use `<m.*>` — importing
 *       `<motion.*>` throws at runtime. Enforces the bundle-size cap documented in
 *       STACK.md.
 *
 * - Default `transition` at the provider so `<m.*>` elements inherit the
 *   UI-SPEC duration (220ms) + ease ([0.22, 1, 0.36, 1]) unless overridden.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      <LazyMotion features={domAnimation} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  )
}
