// components/mdx/gallery.tsx
// MDX-callable Gallery component. 2-up default; columns=3 opts in to 3-up at lg+.
// Source: .planning/phases/03-project-detail-template/03-UI-SPEC.md § Component Inventory #6.
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface GalleryItem {
  src: string
  alt: string
  caption?: string
}

interface GalleryProps {
  items: ReadonlyArray<GalleryItem>
  columns?: 2 | 3
  wide?: boolean
}

const WIDE_BLEED = 'mx-[calc((100%-100vw)/2+50%)] max-w-[calc(min(100vw,72rem)-2rem)]'

export function Gallery({ items, columns = 2, wide = false }: GalleryProps) {
  const gridCols =
    columns === 3
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-1 sm:grid-cols-2'
  return (
    <div
      className={cn(
        'my-8 grid gap-4 md:gap-6 lg:gap-8',
        gridCols,
        wide && WIDE_BLEED
      )}
    >
      {items.map((item) => (
        <figure key={item.src}>
          <Image
            src={item.src}
            alt={item.alt}
            width={800}
            height={600}
            sizes={
              columns === 3
                ? '(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw'
                : '(min-width: 640px) 50vw, 100vw'
            }
            className="rounded-none"
          />
          {item.caption ? (
            <figcaption className="mt-3 text-[color:var(--color-text-secondary)] text-[var(--text-label)] text-center font-sans">
              {item.caption}
            </figcaption>
          ) : null}
        </figure>
      ))}
    </div>
  )
}
