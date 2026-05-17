// app/(site)/about/opengraph-image.tsx
// Per-route OG for /about. UI-SPEC § Copywriting Contract /about row (LOCKED).
import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-template'

export const alt = 'about · olivelliott.dev — engineer, polymath, building at Aktiga.'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default async function Image() {
  return renderOg({
    title: 'about — olive elliott',
    meta: 'engineer · polymath · aktiga',
  })
}
