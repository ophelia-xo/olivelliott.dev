'use client'
// components/projects/next-project-title.tsx
// Tiny client island for the NextProjectBlock title — wraps motion/react <m.h2>
// for whileHover translateX(4px). Reduced-motion is gated by Phase 1's MotionConfig
// (reducedMotion="user" suppresses whileHover automatically).
// Source: .planning/phases/03-project-detail-template/03-UI-SPEC.md § Component Inventory #9.
// Per Phase 1's LazyMotion strict, MUST use `m.*`, NOT `motion.*`.
import { m } from 'motion/react'

interface NextProjectTitleProps {
  children: React.ReactNode
  className?: string
}

export function NextProjectTitle({ children, className }: NextProjectTitleProps) {
  return (
    <m.h2
      className={className}
      whileHover={{ x: 4 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.h2>
  )
}
