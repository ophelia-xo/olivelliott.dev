// app/resume/layout.tsx
// Chromeless route-scoped layout. /resume lives OUTSIDE the (site)/
// route group so it inherits ONLY the root app/layout.tsx (fonts,
// globals.css, ThemeProvider) — no Nav, no Footer, no MotionProvider,
// no site-shell SkipLink. The page ships its own #resume-main skip link.
// The single side-effect import below loads app/resume/resume.css for
// both screen overrides and the @media print block.
// RESEARCH § Pattern 1 + Pattern 4; Pitfall 1.
import './resume.css'

export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
