# Phase 2 — Redaction Review Checklist

**Purpose:** Every `visibility: private` MDX under `content/projects/` must pass this checklist before merging to `main`. Pairs with the automated scanner at `tests/content/redaction.test.ts`.

**Status:** Infrastructure ready. No private projects in content/ yet (Phase 2 ships Myco public-only). First sign-off applies in Phase 7 when Trade Bot, Agenda Keeper, and Aktiga content lands.

---

## How the two gates work together

| Gate | What it catches | Where it runs |
|------|-----------------|---------------|
| **Automated** (`tests/content/redaction.test.ts`) | Exact banned-term matches (case-insensitive, whole-word) in any private MDX body | `pnpm test:ci` (every build, CI, pre-commit) |
| **Human checklist** (this doc) | Nuance — paraphrased internal details, proprietary features, inferable client identities, NDA-sensitive framing | Before a private MDX's PR merges |

Neither gate is sufficient alone. The scanner catches literal leaks; the checklist catches intent.

---

## Banned terms (source of truth)

Maintained in `tests/fixtures/banned-terms.ts` — import `BANNED_TERMS` from there. The list below MUST stay in sync with that file.

Current terms (as of Phase 2):

- `aktiga`
- `voya`
- `spectra`

**To add a term:**
1. Add the lowercase canonical form to `tests/fixtures/banned-terms.ts`.
2. Document the rationale below (one line per term).
3. Update this checklist's term count.
4. Run `pnpm test:ci` — confirm existing private content still passes or revise accordingly.

### Rationale per term

| Term | Why banned |
|------|-----------|
| `aktiga` | Current employer — no internal details of the company or its clients may appear in public case studies (per PROJECT.md). |
| `voya` | Prior-client identity referenced via Aktiga — out of scope per NDA/proprietary constraints. |
| `spectra` | Prior-client identity referenced via Aktiga — same constraints as `voya`. |

---

## Privacy-sensitive topics (paraphrase-safe, nuance-required)

The scanner can't catch these automatically. When reviewing a private project's MDX, flag and rewrite any content that:

- [ ] Describes internal tooling or workflows of a client company (Aktiga, Voya, Spectra) — even with the company name redacted
- [ ] References unreleased features, upcoming products, or private roadmap items
- [ ] Reveals architecture details that could be reverse-engineered to identify a specific client
- [ ] Contains code snippets or config derived directly from proprietary repositories
- [ ] Names specific teammates, reports, or stakeholders without explicit permission
- [ ] Cites performance numbers, revenue figures, or internal metrics from a client context
- [ ] Describes security practices, vulnerabilities, or audit findings from any engagement
- [ ] Includes screenshots with UI text that identifies a client's product
- [ ] Implies a contractual relationship (client, vendor) where the counterparty hasn't publicly acknowledged it

If any of the above applies: rewrite to generic framing OR remove the section entirely. Do NOT rely on readers "not noticing" — assume a reviewer with full context reads every case study.

---

## Sign-off template

Copy this block into the PR description when merging a private project's MDX to `main`.

```markdown
## Redaction sign-off — <project-slug>

**Reviewer:** <name>
**Date:** <YYYY-MM-DD>
**File reviewed:** `content/projects/<slug>.mdx`

### Automated gate
- [ ] `pnpm test tests/content/redaction.test.ts --run` is green

### Banned-term check (redundant with automated, included for audit trail)
- [ ] No occurrence of `aktiga`, `voya`, `spectra` in body (manually verified)

### Privacy-sensitive topic check
- [ ] Internal tooling / workflows — none referenced
- [ ] Unreleased features / roadmap — none referenced
- [ ] Reverse-engineerable architecture details — none exposed
- [ ] Proprietary code/config — none copied
- [ ] Named teammates/stakeholders — none (or consent documented)
- [ ] Internal metrics / revenue / perf numbers — none
- [ ] Security practices / audit findings — none
- [ ] Client-identifying screenshots — none
- [ ] Undisclosed contractual relationships — none

### Approval
I have read the full MDX body, applied the banned-term scan mentally, and confirmed the privacy-sensitive-topic checklist. This content is safe to publish.

**Approved by:** <name>
```

---

## When to revisit this doc

- Adding a new banned term (update § Banned terms + `tests/fixtures/banned-terms.ts` together)
- Onboarding a new private client whose identity must be protected
- After a near-miss where a reviewer caught something the scanner didn't (add the miss pattern to § Privacy-sensitive topics)
- Annually as a recurring review item

---

*Created: Phase 2 (content pipeline). First consumer: Phase 7 (content pass + launch).*
