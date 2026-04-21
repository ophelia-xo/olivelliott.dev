// lib/tags.ts
// Single source of truth for the project tag vocabulary. Consumed by:
//   - lib/schemas.ts via z.enum(TAGS) (typo gate for frontmatter authoring)
//   - Phase 4 filter chips via TAG_LABELS (human-facing labels)
// Do not extend speculatively — add a tag only when a project actually needs it.
export const TAGS = [
  'local-first',
  'autonomous',
  'open-source',
  'ai',
  'agents',
  'distributed',
  'typescript',
  'python',
  'saas',
  'cli',
  'code-private',
] as const

export type Tag = (typeof TAGS)[number]

/** Human-facing labels; filter chips use these in Phase 4. */
export const TAG_LABELS: Record<Tag, string> = {
  'local-first': 'Local-first',
  autonomous: 'Autonomous',
  'open-source': 'Open-source',
  ai: 'AI',
  agents: 'Agents',
  distributed: 'Distributed',
  typescript: 'TypeScript',
  python: 'Python',
  saas: 'SaaS',
  cli: 'CLI',
  'code-private': 'Code private',
}
