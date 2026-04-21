# Phase 2: Content Pipeline - Research

**Researched:** 2026-04-21
**Domain:** Typed MDX content pipeline (Next.js 16 App Router, RSC-native, Zod-validated frontmatter, privacy transform, Vitest harness)
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Content Pipeline Tooling**
- **Package choice:** Roll-your-own MDX pipeline using `@next/mdx` (already installed in Phase 1), `gray-matter` for YAML frontmatter parsing, and `zod` (already installed) for schema validation. **Do not** install Content Collections — the extra dependency is unnecessary at portfolio scale and the Phase 1 lockfile already standardised on `@next/mdx`.
- **Content location:** `content/projects/*.mdx` at repo root.
- **Frontmatter format:** YAML frontmatter parsed with `gray-matter`.
- **Collection loading:** Synchronous load in `lib/content.ts` at import time (reads and parses at module init); exposed as a typed `allProjects` const. No pre-build script, no generated manifest file — RSC build inlines the collection.

**Project Frontmatter Schema**
- **Tag field:** Strict Zod enum sourced from a single `TAGS` const in `lib/tags.ts`. Typos fail the Zod parse, which fails the build.
- **Tier field:** `tier: 'hero' | 'secondary'` enum — more explicit than a boolean and extensible.
- **Visibility field:** `visibility: 'public' | 'private'` enum.
- **Outcomes field:** `z.array(z.string()).max(5)` — single-line bullets surfaced on project cards. Structured `{metric, context}` objects are out of scope until v2.
- **Complete field set** (for reference, details settled during plan-phase): `slug`, `title`, `tagline`, `year`, `tier`, `order`, `status`, `visibility`, `tags`, `stack`, `links` (repo/live/docs/npm, optional), `hero` ({src, alt}), `gallery` (optional), `outcomes`, `description` (SEO), `ogImage` (optional).

**Privacy Enforcement**
- **Repo-link stripping:** Schema `transform` silently strips `links.repo` for `visibility: 'private'`. In `process.env.NODE_ENV === 'development'`, emit a `console.warn` so the author notices the intent mismatch. No Zod refinement hard-fail — private projects with a repo link should still ship safely.
- **`code-private` tag:** Auto-added by the schema transform when `visibility === 'private'`. Author does not add it in frontmatter. If the author does add it redundantly, the transform deduplicates.
- **Redaction review (CNT-06):** Two-pronged approach:
  1. A checklist document at `.planning/phases/02-content-pipeline/02-REDACTION-REVIEW.md` with banned-term list (`aktiga`, `voya`, `spectra`, internal client names discovered during audit), privacy-sensitive-topic list, and a sign-off template.
  2. A unit test (`tests/content/redaction.test.ts`) that walks every `visibility: 'private'` MDX body and fails if any banned term appears (case-insensitive, whole-word match).
- **Private project set in v1 Phase 2:** Only Myco is scaffolded in this phase (Myco is public, so the redaction test exercises the private-project fixture below). Other private projects (Trade Bot, Agenda Keeper, Aktiga) land in Phase 7's content pass.

**Myco MDX Authoring Scope**
- **Depth:** Full draft from the existing Myco README, ~800–1200 words. Content honesty required — no fabricated outcomes, metrics, or claims.
- **Narrative structure:** Problem → Approach → Outcome with explicit H2 headings, matching the PRJ-03 shape so Phase 3's template can render it unmodified.
- **Tags:** `local-first`, `autonomous`, `open-source`, `ai`, `agents`, `typescript` — reflects Myco's thesis alignment.
- **Outcomes bullets:** Honest descriptive bullets only (e.g. "Apache 2.0 public release", "SQLite + Ollama local stack", "Knowledge graph with approval-gated writes"). No invented numbers or metrics.
- **Frontmatter values for Myco:** `tier: 'hero'`, `visibility: 'public'`, `status: 'active'`, `year: 2025`, `order: 10`, tagline from README, `links.repo` populated, `links.docs` if a docs site exists.

**Tag Index & Query API (`lib/projects.ts`)**
- Pure functions, RSC-safe: `getAll()`, `getHeroProjects()`, `getProject(slug)`, `getAllTags()`, `getProjectsByTag(tag)`, `getRelatedProjects(slug, limit)`.
- `getAll()` filters out `status: 'archived'`, sorts by `order` ascending.
- `getRelatedProjects` scores by overlapping-tag count.

### Claude's Discretion

- Exact Zod schema file location (`lib/schemas.ts` vs inline in `lib/content.ts`) — follow architecture research unless a smaller single-file footprint is clearly cleaner.
- Exact `TAGS` const contents (start with `local-first`, `autonomous`, `open-source`, `ai`, `agents`, `distributed`, `typescript`, `python`, `saas`, `cli`, `code-private`; extend only if Myco's authored tags or roadmap references a missing tag).
- MDX compilation entry point — use `@next/mdx` per-page consumption rather than a custom compiler unless the RSC boundary requires a separate compile step.
- Test harness for redaction — vitest file pattern consistent with existing `tests/` layout.
- Hero image behavior for Myco when no real hero image exists yet — acceptable to reference a placeholder path that Phase 3 or 7 replaces; do not fabricate a screenshot.
- Whether to add a private-project test fixture MDX under `tests/fixtures/` to exercise `code-private` auto-tagging and repo-link stripping without polluting `content/projects/`.

### Deferred Ideas (OUT OF SCOPE)

- Per-project accent color token (v2 — CNT2-02).
- Structured outcomes (`{metric, context}`) for richer card surfacing (v2).
- Custom illustrations per hero project (v2 — CNT2-01).
- Other project MDX files (Fathom, Agenda Keeper, Trade Bot, Stemz, Aktiga) — Phase 7 content pass.
- `content/resume.ts` — Phase 5 scope, not Phase 2.
- Pagefind / FlexSearch full-text search — deferred beyond v1.
- Dynamic OG image generation (`next/og`) — Phase 6 or v2 (DYN-01).
- A content-lint script (MDX linting, missing-alt checks) — fold into Phase 6 a11y audit if needed.
- Shiki / `rehype-pretty-code` integration — Phase 3 (project detail template).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| **CNT-01** | MDX compile pipeline for `content/projects/` | `@next/mdx` already installed and wired in `next.config.ts` — per Next 16 docs the App Router natively imports `.mdx` files as RSC-compiled modules. No extra compile step needed. See "Architecture Pattern 1" below. |
| **CNT-02** | Zod-validated frontmatter schema (slug, title, year, tags[], tier, privacy, hero image, summary, links, outcomes) | `zod@^3.23` already installed. gray-matter extracts YAML → Zod parses → types inferred via `z.infer<>`. See "Pattern 2" + "Don't Hand-Roll" below. |
| **CNT-03** | Schema transform auto-adds `code-private` tag for private projects and strips `links.repo` | Implement as `.transform()` on the Zod schema — runs after parse, produces the final typed object. Dev-only `console.warn` if author populated `links.repo` on private. See "Pattern 3". |
| **CNT-04** | Derived tag index and query helpers (`getHeroProjects`, `getProjectsByTag`, `getRelatedProjects`, `getAllTags`) | Pure functions over the loaded collection in `lib/projects.ts`. Map/reduce at module init (≤ 10 projects, free). See "Pattern 4". |
| **CNT-05** | Myco MDX authored from README as first real content file | Author at `content/projects/myco.mdx` with frontmatter values locked in CONTEXT.md. Phase 2 validates the shape with a real file; Phase 3 renders it. |
| **CNT-06** | Private-project content passes redaction review — no internal details, no proprietary claims | Two-pronged: checklist doc + `tests/content/redaction.test.ts` that walks every private MDX body and fails on banned-term matches (whole-word, case-insensitive). See "Pitfall 4" + test patterns. |
</phase_requirements>

## Summary

This phase builds a content system with one dependency-added package (`gray-matter`), one Zod schema module, one synchronous collection loader, one pure-function query API, one authored MDX fixture (Myco), and one redaction checklist + test. Every piece has well-documented precedent — including the exact pattern used in Vercel's own Portfolio Blog Starter Kit — so the phase is execution, not exploration.

The central architectural question — "how does `@next/mdx` handle frontmatter?" — has a definitive answer per Next.js 16 official docs: **it doesn't, natively.** Three solutions exist. The one that matches CONTEXT.md's locked gray-matter decision is also the simplest: parse frontmatter out-of-band at module init (`fs.readdirSync` + `gray-matter`), then let `@next/mdx`'s loader handle body compilation in Phase 3 via a dynamic `import('@/content/projects/${slug}.mdx')` from the `[slug]/page.tsx` RSC. Frontmatter as raw YAML at the top of an MDX file is parsed-and-stripped from the body by gray-matter BEFORE `@next/mdx` sees it — so there is zero friction between the two tools.

**Primary recommendation:** `lib/content.ts` reads `content/projects/*.mdx` with `fs.readdirSync` + `gray-matter` at import time; pipes each result through a Zod schema `parse` (with a `.transform()` for privacy enforcement); exposes a typed `allProjects` const. `lib/projects.ts` builds derived query helpers on top. `tests/content/*.test.ts` exercises schema validation, privacy transform, tag index math, and redaction — using a private-project fixture under `tests/fixtures/` to avoid polluting real content.

## Standard Stack

### Core
| Library | Version (verified) | Purpose | Why Standard |
|---------|--------------------|---------|--------------|
| `@next/mdx` | `^16.2.4` (installed) | MDX compiler via Next.js webpack/Turbopack loader | Native Next 16 App Router integration. RSC-compatible. Direct module imports of `.mdx` files return React component + exported consts. |
| `@mdx-js/react` | `^3.1.1` (installed) | React context for MDX component overrides | Required peer of `@next/mdx`. Powers `mdx-components.tsx` overrides at the global level. |
| `zod` | `^3.23.0` (installed; **latest v3 is 3.23.8; v4.3.6 is current**) | Schema validation + TS type inference | Required per CONTEXT.md. Already installed. v3 API used in this phase is stable across v3↔v4; no migration needed now. |
| `gray-matter` | `^4.0.3` (to install) | YAML frontmatter extractor | Required per CONTEXT.md. Last published 2023 but feature-complete for YAML. Used by Gatsby/Astro/Netlify. CommonJS; runs server-side only (import-time, build-time). |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `node:fs` / `node:path` (Node built-ins) | bundled | Directory reading + path resolution in `lib/content.ts` | At module init in RSC context. Never import from a `'use client'` file. |
| `vitest` | `^3` (installed) | Test runner for schema, transform, tag index, redaction tests | Existing harness from Phase 1. `jsdom` env, `@/*` alias. |

### Alternatives Considered (informational — locked choice is above)

| Instead of | Could Use | Tradeoff | Verdict |
|------------|-----------|----------|---------|
| `gray-matter` (manual fs+parse) | `remark-frontmatter` + `remark-mdx-frontmatter` in the `@next/mdx` pipeline | Pros: frontmatter becomes a native MDX named export (`import Post, { frontmatter } from '...mdx'`) — no `fs.readdirSync` needed for the per-post case. Cons: to build a collection you still need a filesystem walk to know which MDX files exist; plus two extra packages; plus in Turbopack both plugins must be referenced as plain strings (no custom parser functions), which rules out injecting a custom YAML parser. | **Rejected** — CONTEXT.md locks gray-matter. Pattern also requires duplicate tooling for collection vs per-post access. |
| `gray-matter` | Hand-rolled regex parser (what Vercel's Portfolio Blog Starter actually ships) | Zero dependencies. Fragile with edge cases (arrays, nested YAML, unquoted strings with colons, dates). | **Rejected** — gray-matter is one small dep and handles every YAML edge case the portfolio will hit. |
| `@next/mdx` body import in Phase 3 | `next-mdx-remote` | Archived April 2026; also incompatible with this project's RSC-first approach. | **Rejected** — forbidden by STACK.md. |
| Synchronous fs load in `lib/content.ts` | Build-time pre-compile script emitting `content/.generated/manifest.json` | Guarantees zero runtime cost. Overkill for 6–20 files. | **Rejected** — CONTEXT.md explicitly says synchronous load, no pre-build script. |

**Installation:**
```bash
pnpm add gray-matter
pnpm add -D @types/gray-matter
```

**Version verification** (performed 2026-04-21 against the npm registry):
- `gray-matter@4.0.3` — published 2023-07-12. Stable, CommonJS, works with Next 16 Turbopack when only imported server-side (i.e., from `lib/` files that never reach a `'use client'` file).
- `@next/mdx@16.2.4` — already installed; matches Next.js 16.2 major.
- `zod@3.23.x` — already installed. Zod 4 ships 2026 but v3 is actively supported and this phase uses only stable primitives (`z.enum`, `z.array`, `z.string`, `z.object`, `.transform`, `z.infer`). Migration to v4 is safe to defer to a standalone phase.

## Architecture Patterns

### Recommended Project Structure (deltas from Phase 1)

```
portfolio/
├── content/
│   └── projects/
│       ├── myco.mdx             # CNT-05 — authored this phase
│       └── .gitkeep             # (if authoring order makes the dir empty at any point)
│
├── lib/
│   ├── utils.ts                 # existing (cn)
│   ├── tags.ts                  # NEW — TAGS const + tag labels
│   ├── schemas.ts               # NEW — ProjectFrontmatterSchema (Zod)
│   ├── content.ts               # NEW — fs+gray-matter collection loader
│   └── projects.ts              # NEW — pure query helpers (getAll, byTag, related)
│
├── mdx-components.tsx           # NEW (REQUIRED by @next/mdx) — global MDX overrides
│
├── tests/
│   ├── content/                 # NEW subdirectory for phase-2 tests
│   │   ├── schema.test.ts       # Zod parse / reject cases
│   │   ├── privacy-transform.test.ts  # code-private tag + repo-link strip
│   │   ├── tag-index.test.ts    # getAllTags / getProjectsByTag / getRelated
│   │   ├── content-load.test.ts # fs load + status=archived filter + order sort
│   │   └── redaction.test.ts    # walks private MDX, fails on banned terms
│   └── fixtures/
│       ├── projects/
│       │   ├── valid-hero.mdx
│       │   ├── valid-private.mdx     # exercises repo-strip + code-private tag
│       │   └── invalid-tag.mdx       # must fail parse
│       └── banned-terms.ts           # shared list used by redaction test + checklist
│
└── .planning/phases/02-content-pipeline/
    └── 02-REDACTION-REVIEW.md   # NEW — checklist document
```

### Pattern 1: Synchronous Collection Load at Module Init

**What:** `lib/content.ts` reads the `content/projects/` directory once when first imported, parses each file with gray-matter, runs the resulting frontmatter through the Zod schema, and exports a frozen typed array.

**When to use:** Any small-to-medium static content set (≤ low hundreds of files) in an RSC-first Next.js app. Pattern lifted directly from the Vercel Portfolio Blog Starter Kit (which uses a hand-rolled regex instead of gray-matter; we upgrade to gray-matter).

**Example:**
```typescript
// lib/content.ts
// Source: adapted from Vercel Portfolio Blog Starter (https://github.com/vercel/examples/blob/main/solutions/blog/app/blog/utils.ts)
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { ProjectFrontmatterSchema, type ProjectFrontmatter } from './schemas'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'projects')

export type Project = ProjectFrontmatter & {
  /** Filename-derived slug, matches frontmatter.slug by convention */
  slug: string
  /** MDX body with frontmatter block removed — used by the redaction scanner and (optionally) body previews */
  body: string
}

function loadAll(): readonly Project[] {
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .sort()

  return Object.freeze(
    files.map((file) => {
      const fullPath = path.join(CONTENT_DIR, file)
      const raw = fs.readFileSync(fullPath, 'utf-8')
      const { data, content } = matter(raw)
      const slugFromFile = path.basename(file, '.mdx')

      // Zod parse + transform (privacy enforcement happens here)
      const parsed = ProjectFrontmatterSchema.parse(data)

      // Guard: filename and frontmatter.slug must match
      if (parsed.slug !== slugFromFile) {
        throw new Error(
          `Slug mismatch in ${file}: filename=${slugFromFile}, frontmatter=${parsed.slug}`,
        )
      }

      return { ...parsed, slug: slugFromFile, body: content }
    }),
  )
}

export const allProjects = loadAll()
```

**Why this shape:**
- `Object.freeze` makes the collection immutable at module scope — prevents accidental mutation by consumers.
- `loadAll()` runs exactly once per process because module imports are cached by Node. The cost is paid during `next build` and the initial RSC warm.
- `body` is returned alongside frontmatter so the redaction test can scan private bodies without a second filesystem read.
- **Do not put `'use client'` anywhere in `lib/content.ts` or any file that imports it.** `fs.readdirSync` fails at client runtime.

### Pattern 2: Zod Schema With Privacy Transform

**What:** Single Zod object schema validates every field in the frontmatter, then a `.transform()` call applies the privacy rules atomically so `.parse()` returns the final runtime shape.

**When to use:** Any project where runtime data needs both validation AND normalization — the `.transform()` is the one place both concerns are resolved, so consumers can never see an "untransformed" object.

**Example:**
```typescript
// lib/tags.ts
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

/** Human-facing labels; filter chips use these in Phase 4 */
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
```

```typescript
// lib/schemas.ts
import { z } from 'zod'
import { TAGS } from './tags'

const LinksSchema = z
  .object({
    repo: z.string().url().optional(),
    live: z.string().url().optional(),
    docs: z.string().url().optional(),
    npm: z.string().url().optional(),
  })
  .default({})

const HeroSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
})

const GalleryItemSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
  caption: z.string().optional(),
})

const ProjectFrontmatterRawSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'slug must be lowercase kebab-case'),
  title: z.string().min(1),
  tagline: z.string().max(140),
  year: z.number().int().gte(2000).lte(2100),
  tier: z.enum(['hero', 'secondary']),
  order: z.number().int().default(100),
  status: z.enum(['active', 'archived', 'paused']).default('active'),
  visibility: z.enum(['public', 'private']),
  tags: z.array(z.enum(TAGS)).min(1),
  stack: z.array(z.string()).default([]),
  links: LinksSchema,
  hero: HeroSchema,
  gallery: z.array(GalleryItemSchema).default([]),
  outcomes: z.array(z.string()).max(5).default([]),
  description: z.string().max(160),
  ogImage: z.string().optional(),
})

export const ProjectFrontmatterSchema = ProjectFrontmatterRawSchema.transform(
  (doc) => {
    // Privacy transform — CNT-03
    if (doc.visibility === 'private') {
      // Dev-only warning if author populated a repo link on a private project
      if (doc.links.repo && process.env.NODE_ENV === 'development') {
        // biome-ignore lint/suspicious/noConsole: author-facing warning
        console.warn(
          `[content] Stripping links.repo from private project "${doc.slug}". ` +
            `Private projects should not expose a repo URL.`,
        )
      }

      const { repo: _repo, ...restLinks } = doc.links
      const dedupedTags = Array.from(new Set([...doc.tags, 'code-private']))

      return {
        ...doc,
        links: restLinks,
        tags: dedupedTags as typeof doc.tags,
      }
    }
    return doc
  },
)

export type ProjectFrontmatter = z.infer<typeof ProjectFrontmatterSchema>
```

**Notes on the schema choices:**
- Slug regex enforces kebab-case at validation time — matches the expected `content/projects/{slug}.mdx` file-naming convention.
- `tags: z.array(z.enum(TAGS)).min(1)` — every project has at least one tag. `code-private` is NOT required in the input; the transform adds it.
- `links: LinksSchema.default({})` — missing `links` in YAML becomes `{}`, not undefined — simplifies every consumer.
- Hero image is REQUIRED (`hero: { src, alt }`). For Myco where no real image exists yet, CONTEXT.md allows a placeholder path (e.g. `/images/projects/myco/hero-placeholder.png`); the file doesn't need to resolve for Phase 2 to pass.
- `.transform()` (not `.refine()`) so the output type carries the privacy-adjusted shape. Consumers never see the raw form.

### Pattern 3: Derived Tag Index via Pure Functions

**What:** No separate "tags table" — tag data is purely derived from the project collection at import time.

**Example:**
```typescript
// lib/projects.ts
import { allProjects, type Project } from './content'
import type { Tag } from './tags'

/** All non-archived projects, sorted by order ascending */
export function getAll(): readonly Project[] {
  return allProjects
    .filter((p) => p.status !== 'archived')
    .sort((a, b) => a.order - b.order)
}

export function getHeroProjects(): readonly Project[] {
  return getAll().filter((p) => p.tier === 'hero')
}

export function getProject(slug: string): Project | undefined {
  return allProjects.find((p) => p.slug === slug)
}

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

export function getProjectsByTag(tag: Tag): readonly Project[] {
  return getAll().filter((p) => p.tags.includes(tag))
}

export function getRelatedProjects(slug: string, limit = 3): readonly Project[] {
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
```

### Pattern 4: `mdx-components.tsx` Minimum Viable Stub

**What:** Phase 2 must create a root `mdx-components.tsx` because `@next/mdx` **requires** this file to work with App Router (per [Next.js 16 MDX guide](https://nextjs.org/docs/app/guides/mdx)). The file can be near-empty this phase — Phase 3 fills in `<Callout>`, `<Figure>`, `<Gallery>`, heading styles, etc.

**Example:**
```tsx
// mdx-components.tsx (at repo root, NOT under app/)
import type { MDXComponents } from 'mdx/types'

/**
 * Global MDX component overrides.
 * Phase 2: minimum viable — required by @next/mdx per Next.js docs.
 * Phase 3 extends this with Callout, Figure, Gallery, and heading overrides.
 */
const components: MDXComponents = {}

export function useMDXComponents(): MDXComponents {
  return components
}
```

### Pattern 5: Vitest Patterns for This Phase

**What:** All five test files are pure-TS tests that never import a React component or render in jsdom. They read fixtures via fs, run them through the schema / loader / query API, and assert on the output. Fast, deterministic, no bundler concerns.

**Fixture approach for tests:**
- Create `tests/fixtures/projects/*.mdx` with known-good and known-bad content.
- Tests import schema directly and call `ProjectFrontmatterSchema.parse(matter(fs.readFileSync(...)).data)`.
- For the content-load test, use `vi.mock('node:fs')` OR temporarily copy a fixture into `content/projects/` (cleaner: point the loader at a configurable path via an internal arg, covered below under "content-load test pattern").

**Content-load test pattern options:**

Option A (recommended — least invasive): refactor `loadAll()` to accept an optional directory override used only in tests:
```typescript
// lib/content.ts (addition)
export function _loadForTests(dir: string) {
  // same logic as loadAll() but parameterized dir
}
```

Option B: `vi.mock('node:fs')` with in-memory entries. Heavier; requires mocking both `readdirSync` and `readFileSync`.

Option C: accept that `content/projects/myco.mdx` IS the integration fixture — the content-load test asserts against the real Myco frontmatter. Couples test stability to real content but is the smallest code change.

**Recommendation:** Option A. It keeps tests deterministic, doesn't mock node, and lets the fixtures directory exercise invalid cases.

**Redaction test pattern:**
```typescript
// tests/content/redaction.test.ts
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { describe, expect, it } from 'vitest'
import { BANNED_TERMS } from '../fixtures/banned-terms'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'projects')

function scanBody(body: string): string[] {
  const found: string[] = []
  const lower = body.toLowerCase()
  for (const term of BANNED_TERMS) {
    // Whole-word, case-insensitive match
    const pattern = new RegExp(`\\b${term.toLowerCase()}\\b`)
    if (pattern.test(lower)) found.push(term)
  }
  return found
}

describe('redaction — private project bodies must not contain banned terms', () => {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.mdx'))

  for (const file of files) {
    const full = path.join(CONTENT_DIR, file)
    const { data, content } = matter(fs.readFileSync(full, 'utf-8'))
    if (data.visibility !== 'private') continue

    it(`${file} contains no banned terms`, () => {
      expect(scanBody(content)).toEqual([])
    })
  }
})
```

Edge cases to be aware of in the scanner:
- Whole-word match (`\b`) avoids false positives like "aktigas" matching "aktiga". Good.
- `.toLowerCase()` before regex.test handles `Aktiga`, `AKTIGA`, `aKtIgA`.
- Term list should include common spellings AND likely typos/variants. Example: if banning `aktiga`, also ban `Aktiga Inc`, `aktiga.com`.
- Scan the RAW body only (post-gray-matter strip) — frontmatter values like a `code-private` tag or a `status` string don't trigger false positives.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| YAML frontmatter parsing | Regex parser for `---` blocks (what Vercel's starter does) | `gray-matter` | Handles arrays, nested objects, quoted/unquoted strings, dates, multi-line strings, escaped characters. The Vercel starter's regex breaks on any `: ` in values. |
| MDX → React compilation | Hand-rolled remark/rehype pipeline | `@next/mdx` (already installed, webpack/Turbopack loader) | Next.js handles RSC integration, tree-shaking, dev/prod parity, Turbopack compatibility. |
| Frontmatter → TS type | `as FrontmatterType` casts | `z.infer<typeof ProjectFrontmatterSchema>` | Runtime validation AND type derivation from one source. `as` casts lie. |
| Privacy enforcement | Per-consumer filtering (`if (p.visibility === 'private') delete p.links.repo`) | Schema `.transform()` | Single enforcement point. Consumers can never forget. ARCHITECTURE.md anti-pattern 7. |
| Tag typos catching | Linter rule / manual review | `z.array(z.enum(TAGS))` | Zod rejects unknown tags at build time with a precise error. ARCHITECTURE.md anti-pattern 5. |
| MDX rendering in RSC | `next-mdx-remote` or custom compile-then-render | Dynamic import: `const { default: Post } = await import(\`@/content/projects/${slug}.mdx\`)` | Documented Next 16 pattern, zero client JS for body, no serialize/hydrate round-trip. |

**Key insight:** The entire phase is ~200 LOC of schema + loader + 6 query helpers. Every harder piece has a library handling it. Resist the urge to write more.

## Common Pitfalls

### Pitfall 1: `@next/mdx` does not parse YAML frontmatter out of the box

**What goes wrong:** Author creates `myco.mdx` with a YAML `---` block at the top, then imports it as a React component. The YAML block renders as visible text in the body because `@next/mdx` treats the whole file as markdown.

**Why it happens:** Per the [official Next.js 16 MDX guide](https://nextjs.org/docs/app/guides/mdx): *"`@next/mdx` does not support frontmatter by default."* Three workarounds: `remark-frontmatter`, `remark-mdx-frontmatter`, `gray-matter`.

**How to avoid:** Use `gray-matter` (locked by CONTEXT.md). gray-matter reads the raw file, strips the YAML block, and returns `{ data, content }`. The `content` string is what gets passed downstream; the YAML never reaches `@next/mdx`. In Phase 3 when the page renders via `await import(\`@/content/projects/${slug}.mdx\`)`, the MDX loader still sees the YAML block at the top of the file — but MDX treats `---` as a valid horizontal-rule / thematic-break token, so it still renders visibly. **Fix:** the MDX files must either (a) have the frontmatter block removed physically before `@next/mdx` sees it, or (b) use a JS `export const frontmatter = {...}` statement at the top instead of YAML.

**Resolution for this project:** Because gray-matter runs at module-init in `lib/content.ts` (separate pipeline from `@next/mdx`'s loader), we need the YAML block to NOT render when `@next/mdx` compiles the body in Phase 3. Two clean solutions:

1. **Add `remark-frontmatter` (parse-and-drop mode) to `next.config.ts`** — it recognizes YAML blocks and removes them from the MDX AST without producing any exports. Zero duplication with gray-matter. Add as a plugin string for Turbopack: `remarkPlugins: ['remark-frontmatter']`.
2. **Author MDX with JS exports** — drop YAML entirely, write `export const frontmatter = {...}` at top of MDX. Simpler pipeline but awkward for content authoring (loses YAML ergonomics: quoting, arrays, multiline strings).

**Recommendation:** Option 1. Install `remark-frontmatter@^5` as an additional dev dependency; add the plugin to `next.config.ts` options; keep gray-matter as the parser. This is the minimal change that lets YAML live at the top of MDX files AND not render as body content AND stay compatible with Turbopack's string-plugin requirement.

**Warning signs:** After Phase 2 lands, run `pnpm dev` and visually inspect any MDX route rendered in Phase 3. If frontmatter appears as text, `remark-frontmatter` is missing from the pipeline.

### Pitfall 2: Calling `lib/content.ts` from a client component

**What goes wrong:** Developer imports `allProjects` or `getAll()` from a `'use client'` file (e.g., a filter chip UI). Build fails with `Module not found: Can't resolve 'node:fs'` OR ships a bundle with Node built-ins that blow up at runtime.

**Why it happens:** `fs.readdirSync` only exists on the server. Once a module is reachable from a client component, Next.js pulls it into the client bundle.

**How to avoid:**
- Never put `'use client'` in `lib/content.ts`, `lib/projects.ts`, `lib/tags.ts`, or `lib/schemas.ts`.
- In client components (e.g., Phase 4's `TagFilter`), accept the list of projects as a serializable prop passed down from an RSC parent.
- Optional hardening: add `import 'server-only'` at the top of `lib/content.ts` — throws a build-time error if any client component tries to import it.

**Warning signs:** `Module not found: Can't resolve 'fs'` during `next build`.

### Pitfall 3: Slug mismatches between filename and frontmatter

**What goes wrong:** Author creates `content/projects/myco.mdx` with `slug: mycelium` in the frontmatter. Phase 3's page consumer uses the filename-derived slug (`myco`), the filter UI uses the frontmatter slug — they disagree.

**How to avoid:** Assert equality in `loadAll()` as shown in Pattern 1 — throw at load time with a helpful message. Fails the build, never ships.

**Warning signs:** Off-by-one project counts; a project page that 404s but the filter shows it.

### Pitfall 4: False positives / negatives in the redaction scanner

**What goes wrong:**
- Banning `voya` matches `sa-voy-ard` — false positive (cheese term in hypothetical food content).
- Scanning post-transform frontmatter — the auto-added `code-private` tag OR the `status` field might incidentally contain a banned term.
- Case-sensitive scan misses `AKTIGA` in ALL CAPS.
- Someone writes "A K T I G A" with spaces — scanner misses it. (Acceptable; treat as author malice, not a scanner bug.)

**How to avoid:**
- Use `\b` whole-word boundaries (already in Pattern 5 example).
- Lowercase both haystack and needles before regex.test.
- Scan `content` from gray-matter only — NOT `data` (the frontmatter object). The `content` string is what an external visitor would read.
- Maintain the banned-term list in one place (`tests/fixtures/banned-terms.ts`). The redaction checklist (`02-REDACTION-REVIEW.md`) references the same constant by path.

**Warning signs:** Redaction test passes in CI but reviewer manually spots a banned term. Add the term to the list; the test fails; author fixes the content.

### Pitfall 5: Zod `.transform()` changes the inferred type — consumers break

**What goes wrong:** Developer references the raw pre-transform type (via `z.input<>`) in a consumer, then `.parse()` returns the transformed shape (`z.output<>`). TypeScript shows a mismatch.

**How to avoid:** Always type via `z.infer<typeof ProjectFrontmatterSchema>` — this is equivalent to `z.output<>` and matches what `.parse()` returns. Never use `z.input<>` for consumer-facing types.

**Warning signs:** `Property 'X' does not exist on type...` errors in `lib/projects.ts` or consumer pages.

### Pitfall 6: `gray-matter` returning unexpected types for YAML edge cases

**What goes wrong:** YAML `year: 2025` becomes `number`. YAML `year: "2025"` becomes `string`. Zod schema says `z.number()`. Second case fails with a clear Zod error — but the author sees it only at build time, not authoring time.

**How to avoid:** Keep YAML simple: never quote numbers, never quote booleans. Use `z.coerce.number()` ONLY if authors frequently miswrite — but prefer failing fast.

### Pitfall 7: Vercel's Portfolio Blog Starter regex parser

**What goes wrong:** Copying the regex parser from [vercel/examples/solutions/blog/app/blog/utils.ts](https://github.com/vercel/examples/blob/main/solutions/blog/app/blog/utils.ts) seems cheaper than installing gray-matter. But the regex: `let [key, ...valueArr] = line.split(': ')` breaks on any YAML value containing `: ` (e.g., `title: "Myco: A local-first mesh"` becomes `title = "Myco`). Arrays (`tags: [a, b]`) also break.

**How to avoid:** Don't copy the regex. Use gray-matter (already a CONTEXT.md decision).

## Runtime State Inventory

Not applicable — this phase is a greenfield content pipeline addition. No stored data, no OS-registered state, no external services to rename. Phase 2 creates new files only.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js ≥ 20.18 | `fs`, `path`, Next.js 16 | ✓ (locked in package.json `engines`) | 20+ | — |
| pnpm 9.15.9 | package management | ✓ (locked in packageManager field) | 9.15.9 | — |
| `@next/mdx@16.2.x` | MDX compile pipeline | ✓ installed | 16.2.4 | — |
| `@mdx-js/react@3.x` | MDX React runtime | ✓ installed | 3.1.1 | — |
| `zod@3.23+` | schema validation | ✓ installed | 3.23 | — |
| `gray-matter` | frontmatter parsing | ✗ NOT installed | — | None — must install this phase |
| `remark-frontmatter` | strip YAML block from MDX body during compile (Pitfall 1 resolution) | ✗ NOT installed | — | None — must install this phase |
| `vitest@3` | test runner | ✓ installed | 3.x | — |

**Missing dependencies with no fallback:**
- `gray-matter` — required by CONTEXT.md for frontmatter parsing. Install via `pnpm add gray-matter`.
- `remark-frontmatter` — required to prevent YAML blocks from rendering as body text in Phase 3's page renderer (see Pitfall 1). Install via `pnpm add remark-frontmatter` (will be a build-time devDependency, but Next.js convention includes remark/rehype plugins as regular deps since `next.config.ts` imports them at build time).

Both are single-purpose, widely-used packages. No network / external-service dependencies introduced by this phase.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 3.x (installed) |
| Config file | `vitest.config.ts` (existing; uses jsdom env, `@/*` alias, `tests/**/*.test.{ts,tsx}` include) |
| Quick run command | `pnpm test tests/content/` |
| Full suite command | `pnpm test:ci` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CNT-01 | MDX files in `content/projects/` compile without error | integration | `pnpm test tests/content/content-load.test.ts -x` | ❌ Wave 0 |
| CNT-01 | `allProjects` exported as non-empty array after Myco lands | integration | `pnpm test tests/content/content-load.test.ts -x` | ❌ Wave 0 |
| CNT-02 | Valid frontmatter parses → typed object with all fields | unit | `pnpm test tests/content/schema.test.ts -x` | ❌ Wave 0 |
| CNT-02 | Missing required field (e.g., `tier`) → Zod rejects with clear error | unit | `pnpm test tests/content/schema.test.ts -x` | ❌ Wave 0 |
| CNT-02 | Unknown tag (e.g., `tags: ['bogus']`) → Zod rejects | unit | `pnpm test tests/content/schema.test.ts -x` | ❌ Wave 0 |
| CNT-02 | Invalid slug (e.g., `My_Slug`) → Zod rejects | unit | `pnpm test tests/content/schema.test.ts -x` | ❌ Wave 0 |
| CNT-02 | `outcomes` > 5 items → Zod rejects | unit | `pnpm test tests/content/schema.test.ts -x` | ❌ Wave 0 |
| CNT-03 | `visibility: private` → `code-private` tag auto-added | unit | `pnpm test tests/content/privacy-transform.test.ts -x` | ❌ Wave 0 |
| CNT-03 | `visibility: private` → `links.repo` stripped from output | unit | `pnpm test tests/content/privacy-transform.test.ts -x` | ❌ Wave 0 |
| CNT-03 | `visibility: private` + redundant `code-private` in tags → dedup | unit | `pnpm test tests/content/privacy-transform.test.ts -x` | ❌ Wave 0 |
| CNT-03 | `visibility: public` → no transform mutations | unit | `pnpm test tests/content/privacy-transform.test.ts -x` | ❌ Wave 0 |
| CNT-04 | `getAll()` excludes archived, sorts by `order` ascending | unit | `pnpm test tests/content/tag-index.test.ts -x` | ❌ Wave 0 |
| CNT-04 | `getHeroProjects()` returns only `tier: 'hero'` entries | unit | `pnpm test tests/content/tag-index.test.ts -x` | ❌ Wave 0 |
| CNT-04 | `getAllTags()` counts correctly and sorts by count desc then tag asc | unit | `pnpm test tests/content/tag-index.test.ts -x` | ❌ Wave 0 |
| CNT-04 | `getProjectsByTag('ai')` returns exactly projects with that tag | unit | `pnpm test tests/content/tag-index.test.ts -x` | ❌ Wave 0 |
| CNT-04 | `getRelatedProjects(slug, 3)` returns overlap-scored projects, excludes self | unit | `pnpm test tests/content/tag-index.test.ts -x` | ❌ Wave 0 |
| CNT-05 | `content/projects/myco.mdx` exists and parses with `tier: hero`, `visibility: public` | integration | `pnpm test tests/content/content-load.test.ts -x` | ❌ Wave 0 |
| CNT-05 | Myco body contains Problem, Approach, Outcome H2 headings | integration | `pnpm test tests/content/content-load.test.ts -x` | ❌ Wave 0 |
| CNT-05 | Myco frontmatter tags include `local-first`, `open-source`, `ai` | integration | `pnpm test tests/content/content-load.test.ts -x` | ❌ Wave 0 |
| CNT-06 | Every private project body is scanned against `BANNED_TERMS`, zero matches | integration | `pnpm test tests/content/redaction.test.ts -x` | ❌ Wave 0 |
| CNT-06 | Fixture private project with banned term in body → redaction test fails (smoke self-test) | unit | `pnpm test tests/content/redaction.test.ts -x` | ❌ Wave 0 |

**Phase 2 is entirely non-UI.** No `@testing-library/react` needed; no component rendering. All tests are pure-TS. Tests run in <2 seconds total.

### Sampling Rate

- **Per task commit:** `pnpm test tests/content/` — runs only the 5 phase-2 test files. Expected <2 s.
- **Per wave merge:** `pnpm test:ci` — full vitest suite (Phase 1 suites + Phase 2 suites). Expected <10 s.
- **Phase gate:** `pnpm test:ci` AND `pnpm typecheck` AND `pnpm lint` AND `pnpm build` all green before `/gsd:verify-work`. `pnpm build` is the non-negotiable gate because it's the only thing that exercises `@next/mdx` + `remark-frontmatter` in the real Turbopack pipeline.

### Wave 0 Gaps

- [ ] `lib/tags.ts` — `TAGS` const + `TAG_LABELS`
- [ ] `lib/schemas.ts` — `ProjectFrontmatterSchema` with `.transform()`
- [ ] `lib/content.ts` — `loadAll()` + `allProjects` + `Project` type
- [ ] `lib/projects.ts` — query helpers
- [ ] `mdx-components.tsx` — minimal stub required by `@next/mdx`
- [ ] `next.config.ts` — add `remarkPlugins: ['remark-frontmatter']` to `createMDX` options (string form, Turbopack-safe)
- [ ] `content/projects/myco.mdx` — authored from README
- [ ] `tests/content/schema.test.ts`
- [ ] `tests/content/privacy-transform.test.ts`
- [ ] `tests/content/content-load.test.ts`
- [ ] `tests/content/tag-index.test.ts`
- [ ] `tests/content/redaction.test.ts`
- [ ] `tests/fixtures/projects/valid-hero.mdx`
- [ ] `tests/fixtures/projects/valid-private.mdx`
- [ ] `tests/fixtures/projects/invalid-tag.mdx`
- [ ] `tests/fixtures/banned-terms.ts`
- [ ] `.planning/phases/02-content-pipeline/02-REDACTION-REVIEW.md` — checklist doc
- [ ] Install `gray-matter` + `remark-frontmatter` via `pnpm add`

## Code Examples

### Example 1: Myco MDX file shape

```mdx
---
slug: myco
title: Myco
tagline: A local-first knowledge graph with approval-gated writes, powered by Ollama and SQLite.
year: 2025
tier: hero
order: 10
status: active
visibility: public
tags: [local-first, autonomous, open-source, ai, agents, typescript]
stack: [TypeScript, SQLite, Ollama, Node.js]
links:
  repo: https://github.com/olive-elliott/myco
  docs: https://myco.dev
hero:
  src: /images/projects/myco/hero-placeholder.png
  alt: Myco knowledge graph visualization (placeholder — real image lands in Phase 7)
outcomes:
  - Apache 2.0 public release
  - SQLite + Ollama fully-local stack
  - Knowledge graph with approval-gated writes
  - Four MCP-compatible memory operations (remember, recall, log_episode, forget)
description: A local-first knowledge graph for Claude Code with approval-gated writes, SQLite storage, and Ollama embeddings.
---

## Problem

... (~300–400 words drafted from README)

## Approach

... (~300–400 words)

## Outcome

... (~200–400 words)
```

### Example 2: Root mdx-components.tsx (Phase 2 minimum)

```tsx
// mdx-components.tsx — REQUIRED by @next/mdx for App Router
// Source: https://nextjs.org/docs/app/guides/mdx
import type { MDXComponents } from 'mdx/types'

const components: MDXComponents = {}

export function useMDXComponents(): MDXComponents {
  return components
}
```

### Example 3: next.config.ts after Phase 2

```ts
// next.config.ts
import type { NextConfig } from 'next'
import createMDX from '@next/mdx'

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    // Strings required for Turbopack compatibility (Next 16).
    // Source: https://nextjs.org/docs/app/guides/mdx#using-plugins-with-turbopack
    remarkPlugins: ['remark-frontmatter'],
    rehypePlugins: [],
  },
})

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  poweredByHeader: false,
  reactStrictMode: true,
}

export default withMDX(nextConfig)
```

### Example 4: Schema rejection snapshot test

```typescript
// tests/content/schema.test.ts (excerpt)
import { describe, expect, it } from 'vitest'
import { ProjectFrontmatterSchema } from '@/lib/schemas'

describe('ProjectFrontmatterSchema — rejection cases', () => {
  it('rejects unknown tag', () => {
    const input = {
      slug: 'x',
      title: 'X',
      tagline: 't',
      year: 2025,
      tier: 'hero' as const,
      visibility: 'public' as const,
      tags: ['not-a-real-tag'],
      hero: { src: '/x.png', alt: 'x' },
      description: 'x',
    }
    expect(() => ProjectFrontmatterSchema.parse(input)).toThrow(/tags/)
  })

  it('rejects invalid slug (uppercase)', () => {
    const input = { /* ... */ slug: 'MyProject', /* ... */ }
    expect(() => ProjectFrontmatterSchema.parse(input)).toThrow(/slug/)
  })

  it('rejects outcomes > 5', () => {
    const input = { /* ... */ outcomes: ['a','b','c','d','e','f'], /* ... */ }
    expect(() => ProjectFrontmatterSchema.parse(input)).toThrow()
  })
})
```

### Example 5: Privacy transform test

```typescript
// tests/content/privacy-transform.test.ts (excerpt)
import { describe, expect, it, vi } from 'vitest'
import { ProjectFrontmatterSchema } from '@/lib/schemas'

const base = {
  slug: 'secret',
  title: 'Secret',
  tagline: 't',
  year: 2025,
  tier: 'secondary' as const,
  visibility: 'private' as const,
  tags: ['typescript'],
  hero: { src: '/s.png', alt: 's' },
  description: 's',
}

describe('privacy transform', () => {
  it('auto-adds code-private tag when visibility=private', () => {
    const out = ProjectFrontmatterSchema.parse({ ...base })
    expect(out.tags).toContain('code-private')
  })

  it('strips links.repo for private projects', () => {
    const out = ProjectFrontmatterSchema.parse({
      ...base,
      links: { repo: 'https://github.com/x/secret', live: 'https://secret.app' },
    })
    expect(out.links.repo).toBeUndefined()
    expect(out.links.live).toBe('https://secret.app')
  })

  it('dedupes code-private when author adds it redundantly', () => {
    const out = ProjectFrontmatterSchema.parse({
      ...base,
      tags: ['typescript', 'code-private'],
    })
    const count = out.tags.filter((t) => t === 'code-private').length
    expect(count).toBe(1)
  })

  it('leaves public projects untouched', () => {
    const out = ProjectFrontmatterSchema.parse({
      ...base,
      visibility: 'public',
      links: { repo: 'https://github.com/x/y' },
    })
    expect(out.links.repo).toBe('https://github.com/x/y')
    expect(out.tags).not.toContain('code-private')
  })

  it('warns in dev when private project has links.repo', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const prev = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'
    ProjectFrontmatterSchema.parse({
      ...base,
      links: { repo: 'https://github.com/x/secret' },
    })
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('secret'))
    process.env.NODE_ENV = prev
    warnSpy.mockRestore()
  })
})
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Contentlayer for typed MDX | Roll-your-own gray-matter + Zod OR Content Collections | Contentlayer effectively unmaintained since 2024 | Any guide referencing Contentlayer is outdated. CONTEXT.md correctly rejects it. |
| `next-mdx-remote` for MDX bodies | `@next/mdx` with direct/dynamic imports | `next-mdx-remote` archived April 9, 2026 | **Vercel's own Portfolio Blog Starter Kit still uses `next-mdx-remote@4.x`** (verified 2026-04-21 against their package.json). Don't copy their rendering strategy — the utils.ts pattern for metadata parsing is still useful but the MDXRemote component is now discouraged. |
| Remark/rehype plugin functions in `next.config.ts` | Plugin names as strings | Turbopack default in Next 16 | `remarkPlugins: [remarkFrontmatter]` no longer works with Turbopack — must be `remarkPlugins: ['remark-frontmatter']` (Next.js will dynamically resolve and import). |
| `remark-mdx-frontmatter` to inject YAML as a named export | Possible but Turbopack limits it to default YAML parser | Turbopack string-plugin requirement | Still works for simple cases. For this project, gray-matter's side-channel is cleaner because the collection loader already needs a filesystem walk. |

**Deprecated / outdated:**
- Any tutorial referencing `next-contentlayer` — archived.
- Any tutorial referencing `framer-motion` instead of `motion` — renamed.
- Vercel's blog starter's hand-rolled frontmatter regex — fragile, don't copy.

## Open Questions

1. **Should `lib/content.ts` load the collection via Option A (parameterized dir) or Option C (real content dir used as test fixture)?**
   - What we know: Option A is cleanest but adds a `_loadForTests` export that's a test-only surface.
   - What's unclear: whether Olive tolerates a small "test seam" in production code.
   - Recommendation: Option A. Marked with underscore prefix and JSDoc `@internal` so it's clearly test-only. Planner can confirm during `/gsd:plan-phase`.

2. **Should `remark-frontmatter` land in Phase 2 (with nothing to render yet) or Phase 3 (when the renderer appears)?**
   - What we know: Phase 2 has no page that actually imports an MDX file via `@next/mdx`'s loader, so a missing `remark-frontmatter` won't cause a visible failure this phase.
   - What's unclear: whether to defer or install now.
   - Recommendation: **Install in Phase 2.** Rationale: (1) `next.config.ts` config change is trivial; (2) Phase 3's executor shouldn't hit this pitfall; (3) `pnpm build` in the Phase 2 gate will exercise the full pipeline if any route uses MDX — smokes out misconfiguration early.

3. **Private-project fixture: live under `tests/fixtures/projects/` OR shipped as `content/projects/test-secret.mdx` with `status: archived`?**
   - What we know: CONTEXT.md marks this as Claude's discretion.
   - Recommendation: **`tests/fixtures/projects/`.** Keeps real `content/` clean (only Myco this phase). Redaction test walks `content/projects/` for the real scan AND separately exercises itself via a known-bad fixture under `tests/fixtures/`.

4. **Does Myco's hero image path need to resolve for Phase 2's tests to pass?**
   - What we know: Zod schema only validates `hero.src` is a non-empty string, not that the file exists.
   - Recommendation: Use `/images/projects/myco/hero-placeholder.png`. No need to create the actual file in Phase 2 — Phase 3 or 7 supplies it. Add a comment in the MDX: `alt: "Myco knowledge graph visualization (placeholder — real image lands in Phase 7)"`.

5. **Should we enforce that every tag in `TAGS` appears on at least one project? (tag hygiene)**
   - What we know: At Phase 2 with only Myco, most tags are unused. Phase 7 populates the rest.
   - Recommendation: **No enforcement.** Tags are the vocabulary; projects draw from it. Enforcing use-at-least-once would force Phase 2 to ship with dead tag definitions just to pass a check — inverted incentive.

## Sources

### Primary (HIGH confidence)

- [Next.js 16 MDX guide](https://nextjs.org/docs/app/guides/mdx) — official docs. Confirmed: (1) `@next/mdx` does not parse frontmatter natively, (2) `mdx-components.tsx` is REQUIRED for App Router, (3) dynamic imports of `.mdx` work in RSC with `generateStaticParams`, (4) Turbopack requires plugin names as strings.
- [Turbopack in Next.js 16.2 release post](https://nextjs.org/blog/next-16-2-turbopack) — confirms Turbopack default in `dev` and `build`, per-import loader config via import attributes.
- [remark-mdx-frontmatter npm README](https://www.npmjs.com/package/remark-mdx-frontmatter) — confirmed API, peer dep on remark-frontmatter, named-export behavior.
- [remark-frontmatter GitHub](https://github.com/remarkjs/remark-frontmatter) — confirmed: parses YAML nodes into AST but does NOT parse values; downstream `remark-rehype` strips them from output.
- [gray-matter npm page / GitHub](https://github.com/jonschlinkert/gray-matter) — confirmed API shape `{ data, content, excerpt, orig, language, matter }`.
- [Vercel Portfolio Blog Starter — utils.ts](https://github.com/vercel/examples/blob/main/solutions/blog/app/blog/utils.ts) — confirmed the `fs.readdirSync` + per-file parse pattern used by Vercel's own reference.
- [Vercel Portfolio Blog Starter — package.json](https://github.com/vercel/examples/blob/main/solutions/blog/package.json) — noted it still uses `next-mdx-remote@^4.4.1` (outdated vs our stack).
- [Next.js `generateStaticParams` API reference](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) — confirmed pattern for dynamic MDX route prerender.
- npm registry verification (2026-04-21): `gray-matter@4.0.3`, `remark-frontmatter@5.0.0`, `remark-mdx-frontmatter@5.2.0`, `@next/mdx@16.2.4`, `zod@3.23` installed / `4.3.6` latest, `vitest@3`, `shiki@4.0.2`, `rehype-pretty-code@0.14.3`.

### Secondary (MEDIUM confidence)

- [Joseph Rex — Frontmatter with Next.js + MDX](https://www.josephrex.me/frontmatter-with-nextjs-and-mdx/) — article pre-dates App Router; pattern is old but confirms gray-matter + custom plugin approach.
- [Next.js issue #84258 — @next/mdx: String format plugins not working with Turbopack](https://github.com/vercel/next.js/issues/84258) — known edge case around `mdxRs` experimental flag; we're NOT using `mdxRs`, so this doesn't bite us.
- [Next.js issue #76739 — loader does not have serializable options](https://github.com/vercel/next.js/issues/76739) — reinforces the string-plugin requirement for Turbopack with MDX.

### Tertiary (LOW confidence)

- Various community tutorials (Alex Chan, Ian Mitchell, DiDoesDigital) — reference older Next.js versions. Useful for sanity-checking patterns but not authoritative.

## Metadata

**Confidence breakdown:**
- Standard stack: **HIGH** — every package verified against npm registry; Next 16 MDX integration confirmed against official docs published 2026-04-15.
- Architecture: **HIGH** — patterns match both official Next.js guidance AND the project's own ARCHITECTURE.md; adapted from Vercel's Portfolio Starter Kit.
- Pitfalls: **HIGH** — each pitfall grounded in either official docs, GitHub issues, or the known behavior of gray-matter / remark-frontmatter.
- Test patterns: **HIGH** — existing Phase 1 tests use identical Vitest conventions.

**Research date:** 2026-04-21
**Valid until:** 2026-07-21 (90 days — stack is stable; Next 16.x is the active LTS minor; gray-matter has been unchanged for years)

## RESEARCH COMPLETE
