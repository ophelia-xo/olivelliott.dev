// lib/content.ts
// Synchronous collection loader for content/projects/*.mdx. Runs at module init,
// parses each file with gray-matter, pipes the frontmatter through the Zod schema
// (which applies the privacy transform — CNT-03), and exposes a frozen typed
// `allProjects` const. Consumers import from lib/projects.ts, not this module
// directly — see .planning/phases/02-content-pipeline/02-02-PLAN.md for the
// architecture rationale.
//
// Server-only guard: this module imports node:fs, so it must never reach a
// client bundle. `import 'server-only'` (Next.js built-in, no install required)
// throws a build-time error if a client-boundary file imports this transitively.
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import 'server-only'
import { ProjectFrontmatterSchema, type ProjectFrontmatter } from './schemas'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'projects')

export type Project = ProjectFrontmatter & {
  /** Filename-derived slug; matches frontmatter.slug by build-time invariant. */
  slug: string
  /** MDX body with frontmatter stripped by gray-matter — used for redaction scanning. */
  body: string
}

function load(dir: string): readonly Project[] {
  // Return empty array if directory doesn't exist yet. Wave 2 completes before
  // Myco lands in Wave 3 (02-03), so `content/projects/` is legitimately absent
  // during the Wave 2 → Wave 3 window. Without this guard, `pnpm typecheck`,
  // `pnpm test:ci`, and `next build` would all crash on module init.
  if (!fs.existsSync(dir)) return Object.freeze([])

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .sort()

  return Object.freeze(
    files.map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), 'utf-8')
      const { data, content } = matter(raw)
      const slugFromFile = path.basename(file, '.mdx')
      const parsed = ProjectFrontmatterSchema.parse(data)
      if (parsed.slug !== slugFromFile) {
        throw new Error(
          `Slug mismatch in ${file}: filename=${slugFromFile}, frontmatter=${parsed.slug}`,
        )
      }
      return { ...parsed, slug: slugFromFile, body: content }
    }),
  )
}

/**
 * @internal — test-only. Allows tests/content/ to point the loader at
 * tests/fixtures/projects/ (or any ad-hoc temp directory) without mocking
 * node:fs. Production code must use `allProjects`.
 */
export function _loadForTests(dir: string): readonly Project[] {
  return load(dir)
}

export const allProjects: readonly Project[] = load(CONTENT_DIR)
