import { NavLink } from './nav-link'
import { WordMark } from './word-mark'

/**
 * Nav — top bar (UI-SPEC Component #4).
 *
 * 72px fixed height, hairline bottom border. Static (not sticky, not hide-on-scroll).
 * Layout: wordmark left, 4 nav links right. Mobile (< 640px): nav link list hidden;
 * only wordmark remains — mobile hamburger deferred to Phase 4.
 */
const NAV_ITEMS = [
  { href: '/projects', label: 'projects' },
  { href: '/about', label: 'about' },
  { href: '/resume', label: 'resume' },
  { href: '/contact', label: 'contact' },
] as const

export function Nav() {
  return (
    <header className="border-b border-[color:var(--color-hairline)]">
      <div className="mx-auto max-w-6xl px-6 md:px-8 lg:px-12 h-[72px] flex items-center justify-between">
        <WordMark />
        <ul className="hidden sm:flex items-center gap-4 lg:gap-6">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <NavLink href={item.href} label={item.label} />
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
