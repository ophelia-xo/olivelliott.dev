// app/robots.ts
// MTA-03 — robots.txt generation via Next 16 file-system convention.
// Allow / for all crawlers; disallow internal/build paths; point at sitemap.
//
// Source: .planning/phases/06-…/06-RESEARCH.md § Pattern 4.
// NO `noindex` on /resume — the HTML mirrors the PDF; both are public-facing.
import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://olivelliott.dev'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/_next/', '/api/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
