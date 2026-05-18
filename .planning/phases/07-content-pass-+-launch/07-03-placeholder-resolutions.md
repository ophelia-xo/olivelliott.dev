# Plan 07-03 — Placeholder Resolutions

**Filed:** 2026-05-18
**Source:** Olive's verbatim answers supplied at /gsd:execute-phase Task 1 checkpoint
**Author:** Olive Elliott

## Resolutions

### (a) LinkedIn handle

**Resolution:** CONFIRMED — `https://www.linkedin.com/in/olivelliott`

The LinkedIn handle is `olivelliott` (matches the email local-part). Full canonical URL with `www.` subdomain.

Previous (Phase 1 placeholder): `https://linkedin.com/in/olive-elliott`

### (b) Fathom repo URL

**Resolution:** CONFIRMED — `https://github.com/ophelia-xo/fathom`

The Fathom repo is public and hosted under Olive's actual GitHub handle, `ophelia-xo` (see major correction below).

Update target: `content/resume.ts` projects[Fathom].link AND `content/projects/fathom.mdx` frontmatter `links.repo`.

### (c) Stemz live URL

**Resolution:** CONFIRMED — `https://findstemz.com`

The Stemz site is live at `findstemz.com`. HTTPS confirmed via `curl -sI` (HTTP/2 200).

Update target: `content/resume.ts` projects[Stemz].link.

### (d) Aktiga role title

**Resolution:** REVISED — `Software Engineer`

Single, plain role title — not the prior "Software Engineer / System Architect / Project Lead" stack.

Update target: `content/resume.ts` experience[0].role.

---

## Major Correction — GitHub handle canonicalization

**Olive's actual GitHub handle is `ophelia-xo`, NOT `olivelliott`.**

Phase 5 (Plan 02-03 + Plan 05-04) incorrectly canonicalized the Phase 1 placeholder `ophelia-x` → `olivelliott`. This was based on the (mistaken) inference that Olive's GitHub handle matched her email local-part. The actual handle is `ophelia-xo` (the original Phase 1 placeholder was a typo / truncation of the real handle).

**Impact:** every `github.com/olivelliott` URL across the site must become `github.com/ophelia-xo`. This includes:

- `components/site/footer.tsx` — `GITHUB_URL` constant + `VIEW_SOURCE_URL` constant
- `components/about/contact-stack.tsx` — `GITHUB_URL` constant + visible link text
- `content/resume.ts` — `header.links.github` + `projects[Myco].link` + new `projects[Fathom].link`
- `content/projects/myco.mdx` — frontmatter `links.repo`
- `content/projects/fathom.mdx` — new frontmatter `links.repo`
- Tests asserting `olivelliott` in any `github.com/` URL (footer.test.tsx, contact-stack.test.tsx, resume content/schema/header/entry/page tests, projects tests that fixture a `repo` URL, a11y test fixtures)

**What does NOT change:**

- Email local-part: `olivelliott48@gmail.com` (unchanged)
- Email mailto subject: `hi%20from%20olivelliott.dev` (unchanged — site domain, not GitHub handle)
- LinkedIn handle: `olivelliott` (unchanged — different platform)
- Site domain: `olivelliott.dev` (unchanged)
- Page titles / OG copy / favicon SVG title: all use `olivelliott.dev` (unchanged)

**Audit trail:** This correction is documented in PROJECT.md § Key Decisions for git-archeology.

---

## Application Order (Task 2)

Single atomic batch commit per the plan's "no piecemeal drift" constraint:

1. Update source files: `content/resume.ts` + `content/projects/myco.mdx` + `content/projects/fathom.mdx` + `components/site/footer.tsx` + `components/about/contact-stack.tsx`
2. Update test assertions that locked the wrong values (all tests under `tests/` that grep for `olivelliott` in a github URL or for `olive-elliott` as a LinkedIn handle).
3. Run `pnpm vitest run` — must exit green.
4. Run `pnpm typecheck` — must exit 0.
5. Run `pnpm build` — must exit 0 (regenerates `public/resume.pdf` via postbuild).
6. Verify zero `PLACEHOLDER:` markers remain in the 5 source files.
7. Update PROJECT.md § Key Decisions with the canonicalization-correction entry.
8. Commit as a single `feat(07-03):` per plan acceptance criteria.
