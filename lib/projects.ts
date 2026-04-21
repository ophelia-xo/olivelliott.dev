// lib/projects.ts
// Pure-function query API over the project collection loaded by lib/content.ts.
// Every consumer in Phase 3+ (project detail pages, home hero grid, /projects
// index, sitemap) imports from this module. Do not add mutation, memoization,
// or caching — at 6–20 projects the operations are cheap enough that each call
// re-slices/re-sorts. See .planning/phases/02-content-pipeline/02-02-PLAN.md.
import { allProjects, type Project } from './content'
import type { Tag } from './tags'

/**
 * All non-archived projects, sorted by `order` ascending.
 * `.slice()` before `.sort()` so the frozen allProjects array is never mutated.
 */
export function getAll(): readonly Project[] {
  return allProjects
    .filter((p) => p.status !== 'archived')
    .slice()
    .sort((a, b) => a.order - b.order)
}

/** Active hero-tier projects, order-sorted. */
export function getHeroProjects(): readonly Project[] {
  return getAll().filter((p) => p.tier === 'hero')
}

/**
 * Slug lookup. Searches `allProjects` directly (not `getAll()`) so archived
 * projects are still resolvable if someone links to them — consumer pages use
 * `notFound()` on `undefined`, not on archived status.
 */
export function getProject(slug: string): Project | undefined {
  return allProjects.find((p) => p.slug === slug)
}

/**
 * Aggregated tag index across non-archived projects.
 * Sorted by count desc, then tag alphabetically asc.
 */
export function getAllTags(): ReadonlyArray<{ tag: Tag; count: number }> {
  const counts = new Map<Tag, number>()
  for (const project of getAll()) {
    for (const tag of project.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
}

/** Active projects whose tags include the given tag. */
export function getProjectsByTag(tag: Tag): readonly Project[] {
  return getAll().filter((p) => p.tags.includes(tag))
}

/**
 * Related projects scored by overlapping-tag count.
 * - Excludes the target project itself.
 * - Excludes projects with zero overlap (score 0 means "not related").
 * - Returns `[]` when the target slug is unknown (defensive; never throws).
 */
export function getRelatedProjects(
  slug: string,
  limit = 3,
): readonly Project[] {
  const target = getProject(slug)
  if (!target) return []

  return getAll()
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      project: p,
      score: p.tags.filter((t) => target.tags.includes(t)).length,
    }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.project)
}
