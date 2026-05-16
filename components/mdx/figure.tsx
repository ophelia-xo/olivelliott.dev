// components/mdx/figure.tsx
// MDX-callable Figure component. Default width inherits prose; wide opt-in bleeds out to container.
// Source: .planning/phases/03-project-detail-template/03-UI-SPEC.md § Component Inventory #5.
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface FigureProps {
  src: string
  alt: string
  caption?: string
  wide?: boolean
  width?: number
  height?: number
}

const WIDE_BLEED = 'mx-[calc((100%-100vw)/2+50%)] max-w-[calc(min(100vw,72rem)-2rem)]'

export function Figure({
  src,
  alt,
  caption,
  wide = false,
  width = 1200,
  height = 900,
}: FigureProps) {
  return (
    <figure className={cn('my-8', wide && WIDE_BLEED)}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={
          wide
            ? '(min-width: 768px) 1024px, 100vw'
            : '(min-width: 768px) 65ch, 100vw'
        }
        className="rounded-none"
      />
      {caption ? (
        <figcaption className="mt-3 text-[color:var(--color-text-secondary)] text-[var(--text-label)] text-center font-sans">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
