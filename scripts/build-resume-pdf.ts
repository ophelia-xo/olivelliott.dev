/**
 * scripts/build-resume-pdf.ts — Phase 5 Wave 4 (Plan 05-05).
 *
 * Production Puppeteer pipeline. Wave 0 (Plan 05-00) shipped the shell;
 * this commit wires the real script. Runs via `pnpm postbuild` after
 * every `pnpm build`. Fail-fast: any error exits 1 and propagates to
 * `next build` failure → Vercel deploy fail. Shipping a stale resume.pdf
 * is worse than failing the deploy.
 *
 * Decision lineage (recorded here so future readers see it before opening RESEARCH):
 *   - USER OVERRIDE: use full `puppeteer@^25` (NOT puppeteer-core + chromium-min).
 *     Rationale: PDF is committed to git → production never runs this script →
 *     250 MB serverless limit doesn't apply → full puppeteer auto-downloads Chrome,
 *     zero config. See RESEARCH § Open Question 1 and § Pitfall 11.
 *   - Deterministic port 3057 (avoids macOS firewall prompts).
 *   - 127.0.0.1 (avoids IPv6 resolution drift on `localhost`).
 *   - @page geometry lives in app/resume/resume.css; preferCSSPageSize: true
 *     opts the script INTO honoring CSS over JS options (Pitfall 3).
 *   - printBackground: true is mandatory — Puppeteer's default is FALSE,
 *     which silently drops backgrounds (Pitfall 2).
 *   - SIGTERM cleanup via process.once + try/finally — prevents orphan
 *     next start process from holding port 3057 (Pitfall 4).
 */
import { spawn, type ChildProcess } from 'node:child_process'
import { mkdir, stat } from 'node:fs/promises'
import path from 'node:path'
import puppeteer from 'puppeteer'
import waitOn from 'wait-on'

const PORT = 3057
const URL = `http://127.0.0.1:${PORT}/resume`
const OUT_DIR = path.resolve('public')
const OUT_PATH = path.join(OUT_DIR, 'resume.pdf')

export async function main(): Promise<void> {
  await mkdir(OUT_DIR, { recursive: true })

  console.log(`[resume-pdf] starting next start on :${PORT}`)
  const server: ChildProcess = spawn(
    'node_modules/.bin/next',
    ['start', '-p', String(PORT)],
    {
      stdio: ['ignore', 'inherit', 'inherit'],
      env: { ...process.env, NODE_ENV: 'production' },
    },
  )

  // Ensure the server dies even if we crash partway through — Pitfall 4.
  const shutdown = () => server.kill('SIGTERM')
  process.once('exit', shutdown)
  process.once('SIGINT', shutdown)
  process.once('SIGTERM', shutdown)

  try {
    console.log('[resume-pdf] waiting for server')
    await waitOn({ resources: [URL], timeout: 30_000, interval: 250 })

    console.log('[resume-pdf] launching puppeteer')
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    try {
      const page = await browser.newPage()
      await page.emulateMediaType('print') // honor @media print rules — Pitfall 1
      await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30_000 })
      await page.evaluateHandle('document.fonts.ready') // belt-and-braces font wait

      await page.pdf({
        path: OUT_PATH,
        format: 'A4',
        printBackground: true, // Pitfall 2 — default FALSE drops backgrounds
        preferCSSPageSize: true, // Pitfall 3 — @page in resume.css wins
        // margin intentionally omitted — @page { margin: 0.5in } in resume.css is source of truth.
      })

      const { size } = await stat(OUT_PATH)
      console.log(
        `[resume-pdf] wrote ${OUT_PATH} (${(size / 1024).toFixed(1)} KB)`,
      )
      if (size < 20_000 || size > 400_000) {
        throw new Error(
          `unexpected PDF size: ${size} bytes (expected 20KB–400KB)`,
        )
      }
    } finally {
      await browser.close()
    }
  } finally {
    server.kill('SIGTERM')
    // macOS doesn't release TCP ports instantly; cooldown avoids EADDRINUSE on rerun.
    await new Promise((r) => setTimeout(r, 500))
  }
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
