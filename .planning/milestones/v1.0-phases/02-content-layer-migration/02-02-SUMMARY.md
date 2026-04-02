---
phase: 02-content-layer-migration
plan: 02
subsystem: content
tags: [astro, content-layer, markdown, blog, migration]

requires:
  - phase: 02-content-layer-migration
    plan: 01
    provides: Full Zod schema in src/content.config.ts accepting all 10 frontmatter fields

provides:
  - All 3 real blog posts in src/content/blog/ with content verbatim from pre-deletion originals
  - npm build validating all 4 posts (3 real + test-draft) without schema errors

affects:
  - 03-post-templates (will query getCollection('blog') — posts now available for template rendering)

tech-stack:
  added: []
  patterns:
    - Post recovery via git show <commit>:<path> — verbatim restore from git history with no frontmatter edits
    - Glob loader slug = base filename — Astro derives slug from filename, matching Hugo :filename permalink pattern

key-files:
  created:
    - src/content/blog/2025-02-13-power-automate.md
    - src/content/blog/2025-08-19-talosctl-cdktf-guide.md
    - src/content/blog/2025-12-28-building-codeowners-simulator.md
  modified: []

key-decisions:
  - "Posts restored verbatim from git history (44bc5d5^) — no frontmatter or body edits per D-06"
  - "Filename preserved as-is — Astro glob loader uses base filename as slug, matching Hugo :filename URLs"
  - "talosctl post has date field '2025-08-28' but filename '2025-08-19' — copied verbatim, not corrected"

patterns-established:
  - "Content recovery: git show <pre-deletion-commit>:<original-path> > <new-path> for verbatim restore"

requirements-completed:
  - CONT-02
  - CONT-03

duration: 3min
completed: 2026-04-02
---

# Phase 02 Plan 02: Restore Blog Posts Summary

**3 real blog posts recovered verbatim from git history (44bc5d5^) into src/content/blog/ — all validate against the Phase 01 Zod schema, npm build exits 0 with all 4 posts.**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-04-02T03:20:09Z
- **Completed:** 2026-04-02T03:22:00Z
- **Tasks:** 2
- **Files modified:** 3 (created)

## Accomplishments
- Restored all 3 posts verbatim from pre-deletion commit `44bc5d5^` using `git show`
- `npm run build` exits 0 with all 4 posts (3 real + test-draft) — schema validates all frontmatter
- Verified CONT-04 edge cases: power-automate.md has both `images[]` and `featuredImage`, talosctl and codeowners posts have nested `code.copy: true`
- URL slugs match Hugo `:filename` pattern — Astro glob loader uses base filename as collection entry id

## Task Commits

1. **Task 1: Restore 3 posts from git history** - `999a61f` (feat)
2. **Task 2: Verify URL slugs and image field edge cases** - no commit (verification only)

## Files Created/Modified
- `src/content/blog/2025-02-13-power-automate.md` — Power Automate post; has dual image fields (images[] + featuredImage) and fontawesome: true
- `src/content/blog/2025-08-19-talosctl-cdktf-guide.md` — CDKTF/Talos guide; has nested code.copy object; note: date field is '2025-08-28' despite filename '2025-08-19' (verbatim copy)
- `src/content/blog/2025-12-28-building-codeowners-simulator.md` — CODEOWNERS simulator post; has nested code.copy object

## Decisions Made
- No corrections made to post content — verbatim copy per D-06. The talosctl post filename/date mismatch was preserved intentionally.

## Deviations from Plan
None — plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None — no external service configuration required.

## Next Phase Readiness
- Content layer is fully populated: 3 real posts + test-draft, all building cleanly
- Schema is stable — Phase 3 can safely call `getCollection('blog')` and access all declared fields
- Images already exist at `public/images/blog/` from Phase 1 asset migration
- CONT-01 through CONT-04 all satisfied — content layer migration complete

---
*Phase: 02-content-layer-migration*
*Completed: 2026-04-02*
