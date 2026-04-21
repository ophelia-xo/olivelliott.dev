import { MotionProvider } from '@/components/motion/motion-provider'
import { Footer } from '@/components/site/footer'
import { Nav } from '@/components/site/nav'
import { SkipLink } from '@/components/site/skip-link'

/**
 * (site) route-group layout — Phase 1 full shell.
 *
 * Renders SkipLink → Nav → <main id="main"> → Footer inside a single
 * MotionProvider subtree. /resume (Phase 5) lives OUTSIDE this group so it
 * can opt out of motion chrome for print friendliness.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MotionProvider>
      <SkipLink />
      <Nav />
      <main
        id="main"
        className="mx-auto max-w-6xl px-6 md:px-8 lg:px-12 pt-8 md:pt-16 pb-16 md:pb-24"
      >
        {children}
      </main>
      <Footer />
    </MotionProvider>
  )
}
