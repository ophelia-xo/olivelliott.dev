// app/resume/opengraph-image.tsx
// Per-route OG for /resume. UI-SPEC § Copywriting Contract /resume row (LOCKED).
import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-template'

export const alt = 'resume · olivelliott.dev — Olive Elliott, engineer.'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default async function Image() {
  return renderOg({
    title: 'resume — olive elliott',
    meta: 'engineer · 2026',
  })
}
