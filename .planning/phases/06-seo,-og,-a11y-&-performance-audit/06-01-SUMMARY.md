---
phase: 06-seo,-og,-a11y-&-performance-audit
plan: 01
subsystem: seo
tags: [favicon, mta-04, next-conventions, glyph-as-path, sharp, ico, svg, png]

# Dependency graph
requires:
  - phase: 06-seo,-og,-a11y-&-performance-audit
    plan: 00
    provides: "tests/seo/favicon.test.ts Wave-0 placeholder (1 describe + 1 it.skip) — replaced in place by this plan, keeping the file."
provides:
  - "app/icon.svg — 679-byte hand-authored 32x32 SVG. Lowercase oe monogram as glyph-as-path (NOT <text> — deterministic across browsers without Geist installed). Two-token palette (#0a0a0a bg + #fbbf24 accent). A11y <title>+<desc> for embedded-inline usage. No gradient/filter/animate."
  - "app/apple-icon.png — 2,838-byte 180x180 PNG rasterized from app/icon.svg via sharp@0.34.5 (kernel: nearest, compressionLevel: 9)."
  - "app/favicon.ico — 1,545-byte multi-image MS Windows icon resource (16/32/48 raster bundle), OVERWRITES the 25,931-byte create-next-app stub. 16x16 raster at index 0 (Pitfall 10 — Edge/Firefox bookmark bar)."
  - "tests/seo/favicon.test.ts — 7-test MTA-04 audit: file existence, ICO stub-overwrite proof, SVG content sniff, PNG IHDR width/height read, ICO ICONDIR/ICONDIRENTRY parse, layout.tsx Pattern-6 lock, SVG anti-pattern grep."
  - "Next 16 file-system conventions auto-wire all three files (<link rel=icon>, <link rel=apple-touch-icon>, favicon.ico root handler) — no manual <link> tags in app/layout.tsx."
affects: [06-04]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Glyph-as-path favicon — letterforms converted to SVG <path> elements at design time (not <text>) so browsers render the exact mark without needing Geist installed."
    - "Multi-image ICO assembled in-Node via raw Buffer manipulation around sharp-produced PNGs — no to-ico / sharp-ico dependency. ICONDIR (6 bytes) + N×ICONDIRENTRY (16 bytes) + concatenated PNG data."
    - "Next 16 file-system convention auto-wiring for favicons — three files at app/ root (icon.svg, apple-icon.png, favicon.ico) replace all manual <link> tags."

key-files:
  created:
    - "app/icon.svg"
    - "app/apple-icon.png"
  modified:
    - "app/favicon.ico (OVERWRITTEN — 25,931 → 1,545 bytes; was create-next-app stub)"
    - "tests/seo/favicon.test.ts (placeholder body replaced with 7 real assertions; file kept per Wave-0 placeholder convention)"

key-decisions:
  - "Glyph-as-path, not <text>: browsers do not load Geist for favicons. A <text fontFamily='GeistMono'> element would fall back to system mono on most users' machines, producing inconsistent letterforms. Hand-authored <path> approximations of Geist Mono o + e freeze the exact shape across all browsers. Tradeoff: paths are visual approximations rather than pixel-exact Geist glyphs; UI-SPEC notes a v1.x cleanup can regenerate from a Figma export if desired."
  - "Manual ICO byte-assembly via Node Buffer (no to-ico / sharp-ico): adds zero new deps. ICONDIR + ICONDIRENTRY format is small and well-specified. Embeds sharp-produced PNG buffers directly (modern ICO supports PNG-encoded entries) — file is 1,545 bytes for all three sizes (16/32/48) vs ~10KB+ for BMP-encoded equivalents."
  - "Two one-shot `node -e` commands in the plan body, NOT a committed scripts/build-icons.ts: UI-SPEC marked the script as optional and RESEARCH Open Q 2 deferred it. The commands ARE the build step; future re-export is a copy-paste from the plan."
  - "sharp `kernel: 'nearest'` for both raster derivatives: preserves the crispness of geometric path edges at 16/32/48/180 px (no anti-alias blur on the donut/bowl strokes that would muddy the mark at 16px tab-strip scale)."
  - "NO manual <link rel='icon'> tags in app/layout.tsx (Pattern 6 lock): Next 16 auto-emits <link rel=icon type=image/svg+xml> from app/icon.svg, <link rel=apple-touch-icon> from app/apple-icon.png, and the favicon.ico root handler. Manual tags would double-wire."

patterns-established:
  - "Favicon set composition for Next 16 App Router projects: app/icon.svg (primary, glyph-as-path) + app/apple-icon.png (180×180 raster) + app/favicon.ico (multi-size legacy). All three at app/ root. Zero manual <link> tags."
  - "Byte-level test assertions for favicon files: read PNG IHDR (bytes 16+20) and ICO ICONDIR (bytes 0/2/4) directly via Node Buffer methods instead of installing a parsing library. Fast, dependency-free, future-proof."

requirements-completed: [MTA-04]

# Metrics
duration: 2 min
completed: 2026-05-17
---

# Phase 06 Plan 01: Favicon Set (MTA-04) Summary

**Hand-authored `app/icon.svg` (oe monogram glyph-as-path, 679 bytes) + `app/apple-icon.png` (180×180, 2,838 bytes) + `app/favicon.ico` (multi-size 16/32/48, 1,545 bytes — OVERWRITES the 25,931-byte create-next-app stub). Wave-0 placeholder `tests/seo/favicon.test.ts` replaced with 7 byte-level + source-grep MTA-04 assertions; suite count drops from 16 skipped to 15 in lockstep with completion. Next 16 file-system conventions auto-wire all three; zero `<link>` tags in `app/layout.tsx`.**

## Performance

- **Duration:** 2 min
- **Started:** 2026-05-17T16:58:04Z
- **Completed:** 2026-05-17T17:00:01Z
- **Tasks:** 3
- **Files created/modified:** 4 (2 created, 2 modified — including 1 OVERWRITE)

## Accomplishments

- **`app/icon.svg`** (679 bytes): 32×32 viewBox, lowercase oe monogram as two `<path>` elements (donut for `o` centered at (10,18), bowl-with-crossbar for `e` centered at (22,18)). `#fbbf24` letterforms on `#0a0a0a` rect. `<title>olivelliott.dev</title>` + `<desc>` for inline-embed a11y. 4px interior margin survives Safari's rounded-rect tab mask. Zero gradient/filter/animate elements.
- **`app/apple-icon.png`** (2,838 bytes): 180×180 PNG, rasterized from `app/icon.svg` via sharp 0.34.5 with `kernel: 'nearest'` (preserves geometric path crispness) and `compressionLevel: 9`.
- **`app/favicon.ico`** (1,545 bytes — was 25,931): multi-image MS Windows icon resource bundling 16/32/48 PNG rasters. ICONDIR + ICONDIRENTRY structure assembled in-Node around sharp-produced PNG buffers. 16×16 raster at index 0 (Pitfall 10 — Edge/Firefox bookmark bar requirement). **OVERWRITES** the create-next-app default Next.js logo favicon.
- **`tests/seo/favicon.test.ts`** placeholder body replaced with 7 real MTA-04 assertions (file existence, stub-overwrite proof via size != 25931, SVG content grep for title+desc+viewBox+two hex values, PNG signature + IHDR width/height byte-reads, ICO ICONDIR parse + 16×16 entry check, Pattern-6 layout.tsx grep, SVG anti-pattern grep). Vitest reports 7/7 passing.
- Pattern 6 (Next 16 auto-wiring) verified intact: `app/layout.tsx` declares no `<link rel="icon">` or `<link rel="apple-touch-icon">` — Next emits them from the file-system conventions.

## Task Commits

Each task was committed atomically:

1. **Task 1: `app/icon.svg` (oe monogram, glyph-as-path)** — `cf4f384` (feat)
2. **Task 2: `app/apple-icon.png` + `app/favicon.ico` (overwrites stub)** — `626199c` (feat)
3. **Task 3: `tests/seo/favicon.test.ts` (7 real MTA-04 assertions)** — `492ed83` (test)

**Plan metadata commit:** pending (will include SUMMARY.md, STATE.md, ROADMAP.md, REQUIREMENTS.md)

## Files Created/Modified

### Created
- `app/icon.svg` — 679 bytes — primary favicon, glyph-as-path oe monogram
- `app/apple-icon.png` — 2,838 bytes — 180×180 PNG for iOS home-screen

### Modified
- `app/favicon.ico` — **OVERWRITTEN: 25,931 → 1,545 bytes** — multi-image (16/32/48) ICO replacing the create-next-app stub
- `tests/seo/favicon.test.ts` — placeholder body replaced (file kept per Wave-0 convention); 7 real MTA-04 assertions

## OVERWRITE Diff

| File | Before | After | Delta |
|------|--------|-------|-------|
| `app/favicon.ico` | 25,931 bytes (create-next-app default Next.js logo) | 1,545 bytes (multi-image 16/32/48 oe monogram) | **−24,386 bytes (−94%)** |

The new ICO is dramatically smaller because the source SVG is geometric paths (donut + bowl) at three small raster sizes, vs the stub's complex Next.js logo gradient at higher color depth.

## Decisions Made

1. **Glyph-as-path, not `<text>`** — Browsers do not load Geist for favicon rendering. A `<text fontFamily="GeistMono">` element would fall back to system mono on most users' machines (SF Mono on macOS, Cascadia Code on Windows, etc.), producing inconsistent letterforms. Hand-authored `<path>` approximations of the Geist Mono `o` and `e` glyphs freeze the exact shape across all browsers and machines. **Tradeoff:** the paths are visual approximations (a circle-donut for `o`, a circle-with-horizontal-bar for `e`) rather than pixel-exact Geist Mono glyph paths. UI-SPEC pre-authorizes a v1.x cleanup that regenerates `app/icon.svg` from a Figma export if pixel-perfect Geist letterforms become important.
2. **Manual ICO byte-assembly via Node `Buffer`, no `to-ico` / `sharp-ico` dep** — The ICONDIR (6 bytes) + ICONDIRENTRY (16 bytes per entry) + concatenated PNG data format is small and well-specified. Embeds sharp-produced PNG buffers directly (modern ICO supports PNG-encoded entries) — file is 1,545 bytes for all three sizes vs ~10 KB+ for BMP-encoded equivalents. Zero new dependencies added to `package.json`.
3. **One-shot `node -e` commands in the plan body, NOT a committed `scripts/build-icons.ts`** — UI-SPEC § Favicon → Derived assets marked the build script as optional, and RESEARCH Open Q 2 deferred it to v1.x cleanup. The two `node -e` commands committed in `06-01-PLAN.md` Task 2 ARE the build step; any future favicon re-export is a copy-paste from the plan. No `prebuild` hook added.
4. **`kernel: 'nearest'` for both raster derivatives** — Preserves the crispness of geometric path edges at 16/32/48/180 px. The default (lanczos3) would anti-alias the donut/bowl edges and muddy the mark at the 16px tab-strip scale where it matters most.
5. **NO manual `<link rel="icon">` tags in `app/layout.tsx` (Pattern 6 lock)** — Next 16 auto-emits `<link rel="icon" type="image/svg+xml">` from `app/icon.svg`, `<link rel="apple-touch-icon">` from `app/apple-icon.png`, and the favicon.ico root handler. Adding manual `<link>` tags would double-wire and risk content-hash conflicts.

## Deviations from Plan

None — plan executed exactly as written. The plan's two `node -e` commands ran first-try; sharp 0.34.5 was already installed as a runtime dep; the `<title>` / `<desc>` / `viewBox` / hex-value tests all passed without iteration.

## Issues Encountered

None.

## Verification Evidence

| Check | Expected | Actual | Result |
|-------|----------|--------|--------|
| `app/icon.svg` exists | yes | yes | PASS |
| `app/icon.svg` size | < 2,048 bytes | 679 bytes | PASS |
| `app/icon.svg` contains `<title>olivelliott.dev</title>` | yes | yes | PASS |
| `app/icon.svg` contains `viewBox="0 0 32 32"` | yes | yes | PASS |
| `app/icon.svg` contains `fill="#fbbf24"` and `fill="#0a0a0a"` | yes | yes | PASS |
| `app/icon.svg` contains NO gradient/filter/animate/`<text>` | none | none | PASS |
| `app/apple-icon.png` exists | yes | yes | PASS |
| `file app/apple-icon.png` reports `PNG image data, 180 x 180` | yes | `PNG image data, 180 x 180, 8-bit/color RGBA, non-interlaced` | PASS |
| `app/favicon.ico` exists | yes | yes | PASS |
| `file app/favicon.ico` reports multi-image MS Windows icon resource | yes | `MS Windows icon resource - 3 icons, 16x16…, 32x32…, 48x48…` | PASS |
| `app/favicon.ico` size != 25,931 | true | 1,545 bytes (was 25,931) | PASS (overwritten) |
| `app/favicon.ico` size 500 < size < 20,000 | true | 1,545 bytes | PASS |
| `app/layout.tsx` contains no `rel="icon"` / `rel="apple-touch-icon"` | true | true | PASS (Pattern 6 intact) |
| `pnpm vitest run tests/seo/favicon.test.ts` | 7 passed, 0 skipped | 7 passed, 0 skipped | PASS |
| `pnpm vitest run` (full suite) | no regressions, skipped: 16 → 15 | 54 passed + 12 skipped files; 464 passed + 15 skipped tests (was 16) | PASS |
| `pnpm typecheck` | exits 0 | exits 0 | PASS |

## Known Stubs

None. All three favicon files are real assets; the placeholder test was replaced in full.

## User Setup Required

None — favicons auto-wire via Next 16 file-system conventions on next build. Manual visual verification (deferred to Plan 06-04 lighthouse-report.md checklist):
- Safari macOS — favicon visible in tab strip with rounded-rect mask applied
- Chrome / Firefox — favicon visible in tab strip and bookmark bar
- iOS Safari — Add to Home Screen surfaces the 180×180 apple-icon.png at correct size

## Next Phase Readiness

- **Plan 06-02 (OG images + sitemap + robots + metadata)** — unblocked. Will replace 4 of the remaining 11 skipped placeholder tests (`tests/seo/metadata.test.ts`, `tests/seo/sitemap.test.ts`, `tests/seo/robots.test.ts`, `tests/seo/og-image.test.ts`).
- **Plan 06-03 (a11y test surface)** — unblocked. Will replace 6 a11y placeholders.
- **Plan 06-04 (launch gate + lighthouse)** — unblocked. Will replace the final launch-gate placeholder.

The visible execution gate dropped from 16 skipped → 15 skipped, matching the 1-of-12 placeholder ownership transition this plan owns.

**Ready for Plan 06-02.**

## Self-Check: PASSED

All 4 key files exist on disk and all 3 task commits exist in git history.

---
*Phase: 06-seo,-og,-a11y-&-performance-audit*
*Completed: 2026-05-17*
