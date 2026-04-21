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
])
