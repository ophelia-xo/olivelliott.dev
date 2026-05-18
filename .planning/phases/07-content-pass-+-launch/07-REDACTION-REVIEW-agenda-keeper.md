# Phase 7 — Redaction Review: Agenda Keeper

**File reviewed:** `content/projects/agenda-keeper.mdx`
**Visibility:** private
**Reviewer:** Olive Elliott
**Date:** 2026-05-18

Companion artifact to `.planning/phases/02-content-pipeline/02-REDACTION-REVIEW.md`. That file is the reusable template; this file is the first per-project instance. Every future private MDX gets its own copy under `.planning/phases/07-content-pass-+-launch/07-REDACTION-REVIEW-<slug>.md`.

---

## Pre-review automated state

All gates green at the time this document was authored:

- [x] `pnpm exec vitest run tests/content/redaction.test.ts` — 6/6 pass. The dynamic-describe block now fires a real per-file assertion for `agenda-keeper.mdx` (no longer vacuously passing). Phase 2 Plan 02-04 scanner's first non-vacuous run.
- [x] `tests/fixtures/banned-terms.ts` extended (append-only, frozen const preserved) with `the-real-agenda-keeper`. Original three entries (`aktiga`, `voya`, `spectra`) remain unchanged.
- [x] Schema transform applied at module load: `visibility: 'private'` triggers `code-private` auto-tag (verified in rendered HTML, 5× occurrences) and the schema would strip any `links.repo` (no `links:` block authored at all, so nothing to strip).
- [x] `pnpm build` exit 0 — `/projects/agenda-keeper` listed as SSG route; 49.9 KB static HTML emitted at `.next/server/app/projects/agenda-keeper.html`.
- [x] Privacy contract verified in static HTML: 2× literal "code private" label in meta row, zero anchors pointing at any github/gitlab/bitbucket URL scoped to `agenda-keeper`, zero leakage of `the-real-agenda-keeper`.
- [x] Full vitest suite: 513 pass / 4 skipped (zero regressions against Phase 7 Plan 01 baseline).
- [x] `pnpm typecheck` exit 0.

---

## Banned-term extension rationale

| Term added | Lowercase canonical | Why banned |
|---|---|---|
| `the-real-agenda-keeper` | `the-real-agenda-keeper` | Internal repository slug per PROJECT.md. The public framing of this product is just "Agenda Keeper" — banning the slug-form prevents accidental copy-paste from internal docs, commit messages, or env config. Whole-word boundary (`\b`) treats hyphens as word separators in JS regex, so this token matches as a single hyphenated unit. |

**Terms considered and NOT added** (for audit trail):

- `agenda-keeper` (slug form, no `the-real-` prefix) — NOT banned. The project title is the public brand; banning it would force the scanner to flag the legitimate frontmatter slug + every internal hyperlink the App Router emits. Phase 2 redaction scanner only reads body content (not frontmatter), so even if it were banned in error, it would only flag in-body uses; but in-body uses are exactly what we want to permit, since the case study is about Agenda Keeper.
- `convex`, `tiptap`, `prosemirror`, `oauth`, `next.js`, `typescript` — NOT banned. These are public technical libraries/protocols and explicit per Phase 7 CONTEXT.md § specifics: "The product itself (Agenda Keeper, meeting management, TipTap/ProseMirror/Convex stack) is OK to discuss — those are public technical facts."
- `mast farm inn`, `melanie's`, `the care collective` — NOT banned. The resume references these but Agenda Keeper draft does not. If a future MDX needs to discuss any of them, the banned-term decision is independent.

Olive may direct additions at sign-off if any internal codename, client name, or NDA-adjacent identifier was missed.

---

## Banned-term check (manual reviewer pass — redundant with automated scanner)

- [x] No occurrence of `aktiga` in body
- [x] No occurrence of `voya` in body
- [x] No occurrence of `spectra` in body
- [x] No occurrence of `the-real-agenda-keeper` in body

_(Reviewer ticked these after a manual ⌘F pass through the file. Automated scanner already proves zero matches; this is the audit-trail box.)_

---

## Privacy-sensitive topic check (Phase 2 checklist, applied to Agenda Keeper)

These cannot be caught by an automated scanner. Reviewer reads the full body and confirms each line.

- [x] **Internal tooling or workflows of Aktiga or any client agency** — none referenced. Body discusses generic small-agency workflows (recurring client check-ins, action items, post-meeting handoffs) at the level of an industry pattern, not a specific deployment.
- [x] **Unreleased features or roadmap items** — none referenced. The "Outcome" section explicitly notes that "deployment scale, specific agencies running on it, internal roadmap, and proprietary details" stay inside the project.
- [x] **Reverse-engineerable architecture details that could identify a specific client deployment** — none exposed. Architecture description (Next.js + Convex + TipTap/ProseMirror + OAuth) is public industry-standard tooling and does not depend on any client-specific extension or integration.
- [x] **Proprietary code/config copied from the private repo** — none copied. No code blocks, no configuration excerpts, no schema dumps.
- [x] **Named teammates, clients, agencies, or stakeholders** — none mentioned. Body stays in third-person system description ("the product handles", "the design budget", "small-agency operators") without naming any individual or organization.
- [x] **Internal metrics, revenue numbers, user counts, retention figures** — none. Outcomes bullets describe what the product does, not how much or by whom. No "X% time saved", no MRR, no DAU/MAU, no growth charts.
- [x] **Security practices / audit findings** — none referenced. OAuth is mentioned as integration mechanism (industry standard), no security posture details.
- [x] **Client-identifying screenshots** — none. Hero is the placeholder path (`/images/projects/agenda-keeper/hero-placeholder.png`), which triggers Phase 3 `<ProjectHero>` Variant B (text-only). No screenshot is referenced and none is required.
- [x] **Undisclosed contractual relationships** — none implied. The body does not name Aktiga's relationship to this project or any other entity. The fact that it's a "private project" is the only contractual signal, and the schema-driven "code private" label is the visible badge for that.

---

## Public technical surface — explicitly permitted

These are public technical primitives and may appear in the body and stack listing:

- **TipTap** / **ProseMirror** — public open-source editor framework + underlying library
- **Convex** — public backend platform with public pricing + documentation
- **Next.js** — App Router-based React framework (already used elsewhere in the site)
- **TypeScript** — language
- **OAuth** — protocol (no implementation specifics)
- **Google Calendar** / **Outlook** — named only as integration targets (industry-standard calendar APIs)
- **Small agencies** — generic market segment name; no specific agency identified

---

## Word-count and template-shape check

- [x] Body word count: **1112** (within 800–1200 budget; mid-range, leaving room for sign-off-driven edits without breaching either bound)
- [x] Three EXACT H2 anchors: `## Problem` (line 24), `## Approach` (line 32), `## Outcome` (line 42)
- [x] Frontmatter follows Myco/Fathom ordering: `slug → title → tagline → year → tier → order → status → visibility → tags → stack → hero → outcomes → description`
- [x] No `links:` block at all (cleaner than `links: {}` for a private project — schema strips `links.repo` anyway, and omitting the key entirely signals intent unambiguously)
- [x] No `code-private` manually added to tags (schema transform adds it automatically)
- [x] Zero matches against the Phase 4/6 banned-words list (`ecosystem`, `passionate`, `blazing`, `revolutionary`, `best-in-class`, `transformative`, `cutting-edge`, `world-class`, `seamless`, `robust`, `leverage`, `synergy`)
- [x] Zero fabricated metrics, zero invented quotes, zero claimed features that are not shipped

---

## Approval

I have read the full MDX body, run the automated scanner, and confirmed each box in the privacy-sensitive-topic checklist above. This content is safe to publish at `/projects/agenda-keeper` on the public Vercel subdomain.

Approved by: Olive Elliott / Date: 2026-05-18 / Notes: redaction reads clean; styling minimal but deliberate for v1 — richer brand pass logged as v1.1 todo

---

## Sign-off provenance

- Template forked from: `.planning/phases/02-content-pipeline/02-REDACTION-REVIEW.md` § Sign-off template
- Banned-terms source-of-truth: `tests/fixtures/banned-terms.ts` (frozen `BANNED_TERMS` array)
- Automated scanner: `tests/content/redaction.test.ts`
- Schema enforcement point: `lib/schemas.ts` § `ProjectFrontmatterSchema.transform` (CNT-03 privacy transform)
- Plan reference: `.planning/phases/07-content-pass-+-launch/07-02-PLAN.md` Task 2 (checkpoint:human-verify gate)
