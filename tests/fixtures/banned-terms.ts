// tests/fixtures/banned-terms.ts
// Shared banned-term constant. Consumed by tests/content/redaction.test.ts
// and referenced by .planning/phases/02-content-pipeline/02-REDACTION-REVIEW.md.
//
// Rules for entries:
//   - Lowercase canonical form (scanner lowercases both haystack and needle).
//   - Whole-word boundary enforced by the scanner (/\b...\b/) — no need to add variants.
//   - Add entries ONLY with sign-off via the checklist doc.
export const BANNED_TERMS: readonly string[] = Object.freeze([
  'aktiga',
  'voya',
  'spectra',
  // Phase 7 Plan 02 — Agenda Keeper redaction extension.
  // Internal repository slug — public framing is just "Agenda Keeper".
  // Banning the slug-form prevents accidental copy-paste from internal docs
  // or commit history. Whole-word boundary in the scanner ('\b...\b') treats
  // hyphens as word boundaries, so this token matches as a single hyphenated
  // unit. Rationale + sign-off in
  // .planning/phases/07-content-pass-+-launch/07-REDACTION-REVIEW-agenda-keeper.md.
  'the-real-agenda-keeper',
])
