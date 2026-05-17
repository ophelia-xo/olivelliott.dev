// app/(site)/projects/opengraph-image.tsx
// Per-route OG for /projects. UI-SPEC § Copywriting Contract /projects row (LOCKED).
import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-template'

export const alt = 'selected work — olivelliott.dev'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default async function Image() {
  return renderOg({
    title: 'selected work',
    meta: '2026 · local-first · autonomous · open-source',
  })
}
