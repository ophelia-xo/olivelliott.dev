// lib/next-project.ts
// Computes the "next project" for the bottom-of-page navigation.
// 1. Top tag-overlap (single related project from getRelatedProjects).
// 2. Cyclic fallback by order ascending (last project wraps to first).
// 3. Returns null for single-project corpus or unknown slug — caller renders the
//    "all projects →" wayfinding variant in <NextProjectBlock>.
// Source: .planning/phases/03-project-detail-template/03-UI-SPEC.md § Component Inventory #10.
import { getAll, getRelatedProjects } from '@/lib/projects'

export function getNextProject(currentSlug: string):
  | { slug: string; title: string; tagline: string }
  | null {
  const related = getRelatedProjects(currentSlug, 1)
  if (related.length === 1 && related[0]) {
    const p = related[0]
    return { slug: p.slug, title: p.title, tagline: p.tagline }
  }
  const all = getAll()
  if (all.length <= 1) return null
  const idx = all.findIndex((p) => p.slug === currentSlug)
  if (idx === -1) return null
  const nextIdx = (idx + 1) % all.length
  const next = all[nextIdx]!
  return { slug: next.slug, title: next.title, tagline: next.tagline }
}
