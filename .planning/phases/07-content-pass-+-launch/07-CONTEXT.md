# Phase 7: Content Pass + Launch - Context

**Gathered:** 2026-05-18
**Status:** Ready for planning
**Mode:** Smart discuss (autonomous)

<domain>
## Phase Boundary

The shipping phase. Five deliverables:
1. Hero-tier project MDX authored (Fathom + Agenda Keeper) in the Myco template shape (Problem → Approach → Outcome, 800–1200 words, content honesty).
2. Private-project redaction gate exercised — extend Phase 2's `banned-terms.ts` with internal client names / proprietary terms before drafting; redaction test (Phase 2) auto-fires per file.
3. Phase 5 placeholders resolved (LinkedIn handle, Fathom repo URL, Stemz live URL, Aktiga role title) — single-batch update across content/resume.ts, components/about/contact-stack.tsx, components/site/footer.tsx.
4. Vercel Analytics + Speed Insights activated; deferred Phase 6 Lighthouse run executed pre-deploy.
5. Vercel production deploy (subdomain `olivelliott.vercel.app` via GitHub integration) + post-deploy smoke verification documented in `deploy-checklist.md`.

Not in scope: Trade Bot / Stemz / Aktiga MDX (defer to v1.1 unless time permits within 07-01/02), custom domain registration, GitHub Actions / Lighthouse CI, multi-language, blog/writing section, contact form, newsletter signup.

</domain>

<decisions>
## Implementation Decisions

### Content Authoring Scope & Voice
- **Projects shipping with real content:** Hero tier first — Fathom + Agenda Keeper (Myco already shipped Phase 2). Trade Bot, Stemz, Aktiga remain `status: 'archived'` in their frontmatter until written; Phase 2's `getAll()` filters them out so they don't appear on home/index/sitemap. NO lorem-ipsum copy ships.
- **Authoring approach:** Hybrid. I (Claude) draft each MDX from existing READMEs, Phase 5 resume bullets, and PROJECT.md context. Drafts follow Myco's Problem → Approach → Outcome H2 anchor shape and the 800–1200 word budget. Anything I can't verify gets `// PLACEHOLDER: needs Olive's confirmation` MDX comments. Olive reviews, revises, and signs off via checkpoint:human-action per plan.
- **Private-project handling:** Redact-first. Before drafting any private-project MDX, extend `tests/fixtures/banned-terms.ts` (Phase 2 fixture, frozen const) with the internal client names and proprietary terms specific to that project. Phase 2's redaction test (`tests/content/redaction-scanner.test.ts`) auto-fires whole-word banned-term scans against every private MDX body — drafts must pass before commit. Manual sign-off (per Phase 2's `.planning/phases/02-content-pipeline/02-REDACTION-REVIEW.md` checklist template) follows automated gate, before deploy.
- **Phase 5 placeholder resolution:** Bundled into this phase as Plan 07-03. Olive confirms LinkedIn handle, Fathom repo URL, Stemz live URL, Aktiga role title in a single round; I update content/resume.ts + components/about/contact-stack.tsx + components/site/footer.tsx in a single commit per confirmation (not piecemeal).

### Vercel Deploy Process
- **Mechanism:** Vercel GitHub integration — Olive connects the repo to a Vercel project in the Vercel dashboard. Every push to `main` triggers a production deploy. Build command `pnpm build` (already wired). Output `next` standard. No `vercel.json` needed unless special config surfaces during deploy prep. Node version pinned via `engines` in package.json (verify in Wave 0).
- **Subdomain:** `olivelliott.vercel.app` (Vercel default) for v1. Custom domain registration deferred per PROJECT.md.
- **Environment variables / secrets:** None for v1. Vercel Analytics + Speed Insights are zero-config. No auth, no API keys, no LinkedIn API token (the handle is a public URL string).
- **Pre-deploy gate:** Olive runs `pnpm lhci` locally before first deploy — resolves Phase 6's deferred QAL-01. Target ≥ 90 across Performance / Accessibility / Best Practices / SEO on `/` and `/projects/myco`. If any axis < 90, that becomes a fix-forward gap-closure task before deploy. Then `pnpm build` locally one more time as final sanity check. Then push to main.

### Analytics & Post-Deploy Verification
- **Vercel Analytics activation (DPL-03):** Install `@vercel/analytics` + `@vercel/speed-insights` as dependencies. Mount `<Analytics />` + `<SpeedInsights />` in root `app/layout.tsx`. Both are zero-config, cookieless, no GDPR banner required. Per CLAUDE.md tech stack: explicitly approved.
- **Post-deploy smoke checklist:** Manual, documented in `.planning/phases/07-content-pass-+-launch/deploy-checklist.md`. Steps:
  - Visit every public route on the live URL (`/`, `/about`, `/projects`, `/projects/myco`, `/projects/fathom`, `/projects/agenda-keeper`, `/resume`)
  - Confirm OG images render via `curl -I https://olivelliott.vercel.app/opengraph-image` + visual check
  - Favicon loads in browser tab
  - sitemap.xml + robots.txt accessible
  - resume.pdf downloads (200 OK, ~240KB, `%PDF-`)
  - axe runs clean against live URLs (DevTools axe panel — quick visual gate)
  - Vercel Analytics dashboard shows the smoke-test pageviews within 30 min
- **OG card unfurl (MTA-02 supplement):** Pre-deploy local check via `pnpm build && pnpm start` + paste route URLs into Twitter compose + LinkedIn preview. Post-deploy: repeat on live URL. Screenshots filed in `deploy-checklist.md`.
- **Fix-forward policy:** Small fixes go in via `main` push (Vercel auto-deploys). Anything that breaks the home page or 404s a key route blocks the public-share announcement (success criterion #5). Cosmetic issues get known-issue notes in `deploy-checklist.md`; do not block sharing.

### Phase 7 Plan Granularity & Sequencing
- **5 plans:**
  - `07-00` — Infrastructure: install `@vercel/analytics` + `@vercel/speed-insights`, mount in root layout, create `deploy-checklist.md` scaffold, verify `engines` pin in package.json, audit pre-existing redaction fixture.
  - `07-01` — Fathom MDX (public project): draft from README + Phase 5 resume bullets, hero variant text-only OR placeholder image, getNextProject auto-wires.
  - `07-02` — Agenda Keeper MDX (private project): extend banned-terms.ts with Aktiga + ProseMirror + Convex + TipTap-specific guardrails as needed, draft, redaction gate, checkpoint:human-action for Olive's sign-off, then commit.
  - `07-03` — Phase 5 placeholder resolution: single-batch update for LinkedIn / Fathom URL / Stemz URL / Aktiga role.
  - `07-04` — Pre-deploy: Lighthouse run (resolves Phase 6 deferral) + Vercel deploy + post-deploy smoke. Two checkpoint:human-action items (Olive's lhci run + Olive's deploy + Olive's post-deploy verification sign-off).
- **Manual sign-offs:** Checkpoint:human-action on redaction reviews (07-02) and on deploy (07-04). I draft → Olive reviews → Olive signs off → I commit and proceed.
- **Graceful degradation on placeholders:** Placeholders that remain at deploy time get a HTML comment in the rendered source (visible to inspection but not to casual visitors) + a tracked todo in PROJECT.md Active. Site still ships; placeholder resolution becomes v1.1 first-week.
- **Milestone v1.0 lifecycle (after phase verification passes):** `/gsd:audit-milestone` → present findings → `/gsd:complete-milestone v1.0` → `/gsd:cleanup`. Canonical autonomous lifecycle from the workflow spec.

### Claude's Discretion
- Exact Fathom + Agenda Keeper MDX draft copy — Olive revises in sign-off.
- Whether Trade Bot / Stemz / Aktiga MDX gets a stub draft (Olive reviews; defaults to v1.1).
- Whether to add `vercel.json` (likely not — Next 16 default config works).
- Specific Vercel project name + URL (Olive chooses in dashboard; v1 assumes `olivelliott.vercel.app`).
- Whether `<Analytics />` and `<SpeedInsights />` go in root `app/layout.tsx` or `(site)/layout.tsx` (root recommended — covers /resume too).
- Order of placeholder resolution within Plan 07-03 (whatever Olive can answer fastest).
- Whether to extend the `tests/launch-gate/anti-features.test.ts` PHASE_SOURCES manifest with the Phase 7 MDX files (likely yes; one-line append per file).
- Whether to add the Vercel Analytics + Speed Insights to the anti-pattern source-grep allowlist (yes — they import from `@vercel/analytics` which would otherwise fail the no-extra-vendor rule).

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `content/projects/myco.mdx` — canonical fixture; Phase 7's new MDX matches this shape.
- `lib/schemas.ts` — `ProjectFrontmatterSchema` validates new MDX at build time.
- `lib/projects.ts` — `getAll()` / `getHeroProjects()` / `getProjectsByTag()` consume new MDX automatically.
- `lib/hero-fallback.ts` — `isPlaceholderHero` triggers text-only treatment when MDX uses the placeholder image path.
- `tests/fixtures/banned-terms.ts` — Phase 2 frozen const; Phase 7 extends with private-project-specific terms.
- `tests/content/redaction-scanner.test.ts` — Phase 2 dynamic describe block; auto-asserts new private MDX bodies.
- `tests/fixtures/projects/` — Phase 2 private fixture; Phase 7 doesn't need to add fixtures (real MDX now exercises the contract).
- `.planning/phases/02-content-pipeline/02-REDACTION-REVIEW.md` — Phase 2 checklist template; Phase 7 forks one per private-project file.
- `app/layout.tsx` — root layout; Phase 7 mounts `<Analytics />` + `<SpeedInsights />` here.
- `Olive_Elliott_Resume.docx` — source for Aktiga role title + LinkedIn handle (if extractable; otherwise Olive supplies).

### Established Patterns
- RSC-first; `<Analytics />` and `<SpeedInsights />` are client components (`'use client'`) — they live in root layout but don't affect the chrome/no-chrome distinction (`/resume` opts out of `(site)/` chrome but inherits root, so Analytics fires for /resume too — exactly what we want).
- Content honesty: never fabricate metrics, never invent quotes, never claim shipped features that aren't shipped.
- Banned-words source-of-truth: `tests/fixtures/banned-terms.ts` (frozen const) — never duplicated.
- Frontmatter validation at module load: Zod `.parse()` fails the build on schema violations.

### Integration Points
- **Consumed by deploy:** Vercel auto-deploys on `main` push; pre-deploy gate is local lhci + build.
- **Consumed by v1.1:** Trade Bot / Stemz / Aktiga MDX, custom domain, post-launch content revisions.

</code_context>

<specifics>
## Specific Ideas

- The Fathom + Agenda Keeper MDX drafts should NOT name specific clients, internal codenames, or proprietary technical details. Public-project Fathom can mention TypeScript / MCP / Claude Code by name (it's open). Private-project Agenda Keeper stays at the level of "meeting-management SaaS for small agencies" without naming clients or specific Aktiga details.
- Vercel Analytics has been on Olive's stack since the research phase. PROJECT.md and CLAUDE.md both lock it in. Speed Insights is the complementary perf-monitoring counterpart — both are zero-config, both are appropriate.
- The `deploy-checklist.md` is the launch artifact. After the milestone wraps, it becomes the template for v1.1 / v2 deploys.
- Phase 6 deferred QAL-01 (Lighthouse) explicitly to this phase's pre-deploy gate. If lhci shows < 90 on any axis, that's a Phase 7 gap-closure task — fix before deploy. Likely culprits per Phase 6 CONTEXT: hero image priority/sizes, font-display, motion bundle.

</specifics>

<deferred>
## Deferred Ideas

- Trade Bot / Stemz / Aktiga full MDX drafts (v1.1; ship with `status: 'archived'` until ready).
- Custom domain registration + DNS setup (v1.1 once subdomain is proven).
- GitHub Actions / Lighthouse CI (deferred — Vercel Speed Insights + manual lhci sufficient).
- Schema.org JSON-LD structured data (v2 if search snippets warrant).
- Twitter creator handle (`twitter:creator`) — defer until Olive confirms handle.
- Multi-language / i18n (out of scope per PROJECT.md).
- /writing or /notes section (deferred per PROJECT.md — no content ready).
- Contact form with backend (PROJECT.md rejected — mailto sufficient).
- Newsletter signup (PROJECT.md rejected).
- Cover-letter generator (out of scope).
- Pre-rendered OG images committed to git (Phase 6 uses dynamic generation; Vercel caches).
- E2E Playwright suite (deferred to v2).
- Dark/light favicon variants (PROJECT.md says dark theme only in v1).

</deferred>
