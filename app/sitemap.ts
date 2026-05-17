// app/sitemap.ts
// MTA-03 — sitemap.xml generation via Next 16 file-system convention.
// Enumerates static public routes + each /projects/${slug} from getAll().
// Auto-extends in Phase 7 as more MDX lands (lib/content.ts glob-reads
// content/projects/*.mdx at module load; pnpm build re-runs the load).
//
// Source: .planning/phases/06-…/06-RESEARCH.md § Pattern 3.
// Pitfall 9 lock: ALWAYS emit absolute URLs (Google Search Console rejects
// relative-or-ambiguous sitemaps).
// Google deprecated changeFrequency + priority as signals — we omit both.
import type { MetadataRoute } from 'next'
import { getAll } from '@/lib/projects'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://olivelliott.dev'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: new Date() },
    { url: `${SITE_URL}/about`, lastModified: new Date() },
    { url: `${SITE_URL}/projects`, lastModified: new Date() },
    { url: `${SITE_URL}/resume`, lastModified: new Date() },
  ]

  // Each project's lastModified = Dec 31 of its declared year (schema only
  // stores year; Dec 31 is a stable, deterministic build-time value).
  const projectRoutes: MetadataRoute.Sitemap = getAll().map((p) => ({
    url: `${SITE_URL}/projects/${p.slug}`,
    lastModified: new Date(p.year, 11, 31),
  }))

  return [...staticRoutes, ...projectRoutes]
}
