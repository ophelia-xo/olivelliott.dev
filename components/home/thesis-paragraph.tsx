'use client'

import { m, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'

interface ThesisParagraphProps {
  text: string
  className?: string
}

/**
 * ThesisParagraph — the single earned motion moment of v1 (HOM-05).
 *
 * Renders the home-page thesis paragraph with a per-word opacity fade-in on
 * mount. Composed by <HomeHero> (Plan 02). The thesis copy lives in
 * app/(site)/page.tsx (Plan 02) and is a Phase 7 placeholder there.
 *
 * Correctness gates (load-bearing — see Phase 4 RESEARCH § Pitfalls 4 + 5):
 *
 * - useReducedMotion() is explicitly checked. MotionConfig reducedMotion="user"
 *   from the Phase 1 provider does NOT collapse opacity animations — only
 *   transform/layout. Per Motion docs: "When reduced motion is on, transform
 *   and layout animations will be disabled. Other animations, like opacity
 *   and backgroundColor, will persist." Without this manual gate, a
 *   reduced-motion user gets the full per-word fade sequence anyway.
 *
 * - Two-stage mount pattern: useState(false) → useEffect setMounted(true).
 *   useReducedMotion() returns null on the server (no matchMedia) and a
 *   boolean on the client. If JSX branched on the raw return, the SSR HTML
 *   would differ from the first client render → hydration warning. The
 *   mounted gate forces the first client render to match SSR (both render
 *   the plain shell), then the post-mount re-render swaps in the segmented
 *   form as a pure client-side transition.
 *
 * - Opacity-only animation, no transforms. CLS guard — the segmented and
 *   plain forms occupy the same layout box (inline spans, no padding, no
 *   transforms). Lighthouse >= 90 budget.
 *
 * - LazyMotion strict (Phase 1 provider) requires m.* not motion.* — runtime
 *   throw otherwise.
 *
 * - Hand-rolled `delay = wordIndex * 0.03` is intentional. Per the RESEARCH
 *   alternatives table: more transparent in tests than nesting variants +
 *   staggerChildren, and avoids pushing a second motion gate onto a wrapper
 *   <m.p>.
 */
export function ThesisParagraph({ text, className }: ThesisParagraphProps) {
  const [mounted, setMounted] = useState(false)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    setMounted(true)
  }, [])

  // SSR + pre-hydration + reduced-motion-on → render plain <p> at full opacity.
  // No flash-of-invisible-text; no flicker on reduced-motion toggle.
  if (!mounted || prefersReduced) {
    return <p className={className}>{text}</p>
  }

  // Motion permitted, post-hydration: per-word fade. Whitespace segments render
  // at opacity 1 immediately (no fade on whitespace) so the rhythm reads as
  // "words appearing", not "everything fading including the gaps".
  const segments = text.split(/(\s+)/)
  let wordIndex = 0
  return (
    <p className={className}>
      {segments.map((seg, i) => {
        if (/^\s+$/.test(seg)) {
          return (
            <span key={i} aria-hidden="true">
              {seg}
            </span>
          )
        }
        const delay = wordIndex * 0.03
        wordIndex++
        return (
          <m.span
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.18, delay, ease: [0.22, 1, 0.36, 1] }}
          >
            {seg}
          </m.span>
        )
      })}
    </p>
  )
}
