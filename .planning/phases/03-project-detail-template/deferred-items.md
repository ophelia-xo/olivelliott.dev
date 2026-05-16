# Phase 3 Deferred Items

Items discovered during execution that are outside the current plan's scope.

---

## DEFER-01: Tailwind v4 picks up `--color-...` placeholder from `.planning/` docs

**Discovered during:** Plan 03-03 `pnpm build` step.

**Symptom:** Build emits 2 CSS warnings:

```
.bg-\[color\:var\(--color-\.\.\.\)\] { background-color: var(--color-...); }
                                                                    ^-- Unexpected token Delim('.')
.\[color\:var\(--color-\.\.\.\)\] { color: var(--color-...); }
                                                       ^-- Unexpected token Delim('.')
```

**Root cause:** Tailwind v4's class-name scanner reads any project file by default,
including `.planning/STATE.md` and `.planning/phases/03-project-detail-template/03-01-SUMMARY.md`.
Those documents contain the literal placeholder string `bg-[color:var(--color-...)]` as
part of the Decisions section explaining the token-arbitrary-form pattern. Tailwind sees
these as candidate class names, generates CSS for them, and the CSS engine then warns
about the invalid `--color-...` custom-property reference.

**Why deferred:** Out of Plan 03-03 scope (this plan ships the page route + NextProjectBlock
+ getNextProject helper). The warning is benign — the build still succeeds with exit 0,
the static `/projects/myco` page is generated, and the resulting CSS is valid for all
real `--color-*` tokens. No runtime impact.

**Resolution paths (any future plan can pick one):**

1. Configure Tailwind v4 `@source` directive to exclude `.planning/`:
   - In `app/globals.css`, add `@source not "../.planning/**";` next to the `@import "tailwindcss"`.
   - Single-line fix.

2. Replace the literal `[color:var(--color-...)]` text in the Phase 3 summaries with a
   markdown code-fence sentinel that doesn't get scanned (e.g. wrap in a `\` escape, or
   change the docs to use `[color:var(--color-NAME)]` with `NAME` instead of `...`).

3. Accept the warning as informational — confirm the rendered CSS is still correct, and
   leave it.

**Recommended:** Option 1 (Tailwind `@source not`) — single edit, prevents recurrence
when future summaries cite the same arbitrary-form pattern.

---

## DEFER-02: Stale `scripts/generate-og-default.ts` from Plan 03-00

**Discovered during:** Plan 03-03 final `git status` check.

**Symptom:** `scripts/generate-og-default.ts` (2000 bytes) still on disk; the directory
is not in `.gitignore` and the file is untracked.

**Root cause:** Plan 03-00 SUMMARY § Files Created/Modified states the script "was
deleted along with the meta JSON sidecar" post-run. The deletion did not stick on
disk (likely a tooling glitch during that plan's execution). The file is harmless —
it produces the OG default PNG and hasn't been re-run.

**Why deferred:** Out of Plan 03-03 scope (this plan ships the page route, not Wave 0
cleanup). The file does not affect build, tests, or runtime — Plan 03-00 SUMMARY
already documented the intended end-state.

**Resolution:** A future docs/cleanup plan can either delete the file (matching
03-00 SUMMARY's documented intent) or add `scripts/` to `.gitignore` if it becomes
a regular workspace for one-shot generators.

