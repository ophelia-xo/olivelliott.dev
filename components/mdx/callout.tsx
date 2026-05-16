// components/mdx/callout.tsx
// MDX-callable Callout component. note/warn/quote variants encoded only via 4px left-border color.
// No icon, no glyph, no per-variant background tint — the border carries the meaning.
// Source: .planning/phases/03-project-detail-template/03-UI-SPEC.md § Component Inventory #7.
import { cn } from '@/lib/utils'

type CalloutVariant = 'note' | 'warn' | 'quote'

interface CalloutProps {
  variant?: CalloutVariant
  title?: string
  children: React.ReactNode
  wide?: boolean
}

const VARIANT_BORDER: Record<CalloutVariant, string> = {
  note: 'border-l-[color:var(--color-accent)]',
  warn: 'border-l-[color:var(--color-danger)]',
  quote: 'border-l-[color:var(--color-text-tertiary)]',
}

const WIDE_BLEED = 'mx-[calc((100%-100vw)/2+50%)] max-w-[calc(min(100vw,72rem)-2rem)]'

export function Callout({
  variant = 'note',
  title,
  children,
  wide = false,
}: CalloutProps) {
  return (
    <aside
      className={cn(
        'my-8 px-4 py-4 md:px-6 md:py-5',
        'bg-[color:var(--color-surface-2)] rounded-md border-l-4',
        VARIANT_BORDER[variant],
        wide && WIDE_BLEED
      )}
    >
      {title ? (
        <p className="text-[var(--text-label)] font-medium text-[color:var(--color-text-primary)] mb-2 lowercase tracking-[0.02em] font-mono">
          {title}
        </p>
      ) : null}
      <div
        className={cn(
          'text-[var(--text-body)] text-[color:var(--color-text-secondary)] leading-relaxed [&>*+*]:mt-3',
          variant === 'quote' && 'italic'
        )}
      >
        {children}
      </div>
    </aside>
  )
}
