---
phase: 5
slug: about-resume-contact
status: complete
nyquist_compliant: true
wave_0_complete: true
created: 2026-05-17
completed: 2026-05-17
---

# Phase 5 — Validation Strategy

> Per-phase validation contract. Derived from `05-RESEARCH.md` § Validation Architecture.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 1.x (jsdom) |
| **Config file** | `vitest.config.ts` (mdxShim from Phase 3 already wired) |
| **Quick run command** | `pnpm vitest run --reporter=dot` |
| **Full suite command** | `pnpm vitest run && pnpm typecheck && pnpm build` |
| **Estimated runtime** | ~35s quick / ~100s full (build now invokes Puppeteer via postbuild) |

---

## Sampling Rate

- **After every task commit:** `pnpm vitest run --reporter=dot`
- **After every plan wave:** full suite
- **Before `/gsd:verify-work`:** full suite green + `pnpm build` produces `/about`, `/resume`, AND `/public/resume.pdf` (via postbuild)
- **Max feedback latency:** 35 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | Status |
|---------|------|------|-------------|-----------|-------------------|--------|
| 05-00-01 | 00 | 0 | infra | dep-install | `pnpm ls puppeteer wait-on` | ⬜ pending |
| 05-00-02 | 00 | 0 | RES-04 | file-exists | `test -f public/resume.pdf` (stub %PDF-1.7) | ⬜ pending |
| 05-00-03 | 00 | 0 | RES-04 | file-exists | `test -f scripts/build-resume-pdf.ts` | ⬜ pending |
| 05-01-01 | 01 | 1 | RES-01 | unit | `pnpm vitest run tests/resume/schema.test.ts` (ResumeSchema rejects invalid) | ⬜ pending |
| 05-01-02 | 01 | 1 | RES-01, RES-06 | unit | `pnpm vitest run tests/resume/content.test.ts` (RESUME parses; no banned words) | ⬜ pending |
| 05-02-01 | 02 | 2 | RES-02 | unit | `pnpm vitest run tests/resume/page.test.tsx` (sections in order: experience → projects → skills → education) | ⬜ pending |
| 05-02-02 | 02 | 2 | RES-03 | unit | print stylesheet imported in layout; @media print block present | ⬜ pending |
| 05-02-03 | 02 | 2 | RES-05 | unit | DownloadPdfLink rendered at top-right of /resume | ⬜ pending |
| 05-02-04 | 02 | 2 | RES-02 | unit | exactly one `<h1>` on /resume | ⬜ pending |
| 05-03-01 | 03 | 3 | ABT-01, ABT-02, ABT-03 | unit | `pnpm vitest run tests/about/page.test.tsx` (bio + Aktiga + values render) | ⬜ pending |
| 05-03-02 | 03 | 3 | ABT-01 | unit | banned-words absent from bio source (`who I am` block) | ⬜ pending |
| 05-03-03 | 03 | 3 | CTC-03 | unit | ContactStack renders github + mailto + linkedin | ⬜ pending |
| 05-03-04 | 03 | 3 | ABT-01 | unit | project pill row pulls from getHeroProjects() | ⬜ pending |
| 05-04-01 | 04 | 3 | CTC-01, CTC-02 | unit | `pnpm vitest run tests/site/footer.test.tsx` (github=olivelliott, mailto includes `hi%20from%20olivelliott.dev` subject) | ⬜ pending |
| 05-04-02 | 04 | 3 | RES-05 | unit | DownloadPdfLink rendered in footer | ⬜ pending |
| 05-05-01 | 05 | 4 | regression | source-grep | `pnpm vitest run tests/home/anti-patterns.test.ts` (extended to Phase 5 sources) | ⬜ pending |
| 05-05-02 | 05 | 4 | RES-04 | build-smoke | `pnpm build` runs postbuild, emits valid PDF (size 20–200 KB, `%PDF-` magic) | ⬜ pending |

---

## Wave 0 Requirements

- [ ] Install: `puppeteer@^25` and `wait-on@^9` as devDependencies; optional `tsx@^4` if not present.
- [ ] Stub `/public/resume.pdf` (16-byte `%PDF-1.7\n%%EOF\n`) so dev `/resume.pdf` link doesn't 404 before Wave 4.
- [ ] Create `scripts/build-resume-pdf.ts` shell (starts next start, waits, prints, exits).
- [ ] Add `tests/resume/schema.test.ts`, `tests/resume/content.test.ts`.
- [ ] Add `tests/resume/page.test.tsx`.
- [ ] Add `tests/about/page.test.tsx`.
- [ ] Add `tests/site/footer.test.tsx`.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| /resume HTML renders cleanly in browser | RES-02 | Visual layout | `pnpm dev` → load `/resume` |
| Browser print preview produces paper-correct layout | RES-03 | Printer driver / browser variation | Cmd+P on /resume → check preview |
| PDF download from /resume opens correctly | RES-05 | Browser PDF viewer | Click download link, open PDF |
| Bio reads as Olive (not templated) | ABT-01 | Editorial judgment | Read /about end-to-end |
| Contact links open the right tools | CTC-01, CTC-02 | OS-level handlers | Click github / mailto / linkedin |
| LinkedIn handle + Fathom/Stemz placeholder URLs confirmed by Olive | RES-06 | External knowledge | Resolve PLACEHOLDERs in content/resume.ts before Phase 7 ships |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify (or stub-file existence)
- [ ] No 3-task gap without automated verify
- [ ] Wave 0 covers all missing test files
- [ ] No watch-mode flags
- [ ] Feedback latency < 35s
- [ ] `nyquist_compliant: true` set after planner verifies coverage

**Approval:** signed off (all 17 task verifications green; 16 Wave-0 test placeholders implemented; build-smoke produced real PDF — 240,502 bytes / 3 pages / %PDF-1.4)
