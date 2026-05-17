// app/opengraph-image.tsx
// Default OG for / (and the file-convention fallback for routes lacking a sibling).
// UI-SPEC § Copywriting Contract / row (LOCKED).
import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-template'

export const alt =
  'olivelliott.dev — engineer building tools for autonomy, local-first systems, and open-source communities.'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default async function Image() {
  return renderOg({
    title: 'olive elliott — engineer building tools for autonomy',
    meta: '2026 · local-first · autonomous · open-source',
  })
}
