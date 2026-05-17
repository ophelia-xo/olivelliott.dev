/**
 * scripts/build-resume-pdf.ts — Phase 5 Wave 0 SHELL.
 *
 * Wave 4 (Plan 05-05) fills in the real Puppeteer + wait-on pipeline per
 * .planning/phases/05-about-+-resume-+-contact/05-RESEARCH.md § Pattern 2.
 *
 * Decision lineage (recorded here so future readers see it before opening RESEARCH):
 *   - USER OVERRIDE: use full `puppeteer@^25` (NOT puppeteer-core + chromium-min).
 *     Rationale: PDF is committed to git → production never runs this script →
 *     250 MB serverless limit doesn't apply → full puppeteer auto-downloads Chrome,
 *     zero config. See RESEARCH § Open Question 1.
 *   - Fail-fast: this script exits 1 on failure → pnpm propagates → `next build`
 *     fails → Vercel deploy fails. Shipping a stale resume.pdf is worse than a
 *     failed deploy. See RESEARCH § Pattern 3.
 *   - Deterministic port 3057 (avoids macOS firewall prompts).
 *   - 127.0.0.1 (avoids IPv6 resolution drift on `localhost`).
 */
export async function main(): Promise<void> {
  throw new Error(
    'scripts/build-resume-pdf.ts is a Wave 0 shell — Plan 05-05 (Wave 4) fills this in.',
  )
}

// Direct-invocation entry point. When tsx runs this file, call main() and
// propagate the exit code. The named export above lets tests import { main }
// without triggering execution.
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error('[resume-pdf] failed:', err)
    process.exit(1)
  })
}
