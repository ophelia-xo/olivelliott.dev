'use client'

import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

/**
 * NavLink — active-route-aware navigation anchor.
 *
 * Reads usePathname(); active route gets accent underline + aria-current="page".
 * Inactive: text-secondary → hover text-primary, 120ms color transition (UI-SPEC
 * hover exception to the 220ms default). Hit area >= 44x44 via px-3 py-3.
 * Typography: Geist Mono, 14px, medium, tracking +2%, lowercase.
 */
type NavLinkProps = {
  href: string
  label: string
}

export function NavLink({ href, label }: NavLinkProps) {
  const pathname = usePathname()
  const isActive =
    pathname === href || (href !== '/' && pathname.startsWith(`${href}/`))

  return (
    <a
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'inline-block font-mono text-[0.875rem] font-medium tracking-[0.02em] lowercase px-3 py-3 transition-colors duration-[120ms]',
        isActive
          ? 'text-[color:var(--color-text-primary)] border-b-[1px] border-[color:var(--color-accent)] pb-1'
          : 'text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]',
      )}
    >
      {label}
    </a>
  )
}
