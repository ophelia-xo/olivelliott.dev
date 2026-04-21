/**
 * (site) route-group layout — Phase 1 Foundation.
 *
 * Minimal scaffold: <main id="main"> exists so the skip-link (added in Plan 04)
 * has a valid target, and so the home placeholder (Plan 05) renders inside
 * the correct container. Plan 04 replaces this file with the full shell
 * (MotionProvider + SkipLink + Nav + main + Footer).
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main
      id="main"
      className="mx-auto max-w-6xl px-6 md:px-8 lg:px-12 pt-8 md:pt-16 pb-16 md:pb-24"
    >
      {children}
    </main>
  )
}
