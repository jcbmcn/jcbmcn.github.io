---
phase: 02-content-layer-migration
plan: 01
subsystem: content
tags: [astro, zod, content-layer, schema, typescript]

requires:
  - phase: 01-scaffold-ci-cd
    provides: bare-bones content.config.ts with glob loader and minimal schema (title + draft only)

provides:
  - Full Zod-validated blog schema accepting all 10 frontmatter fields used in real posts
  - Schema with z.coerce.date() for date field, nested code object, and optional defaults

affects:
  - 02-02 (post migration depends on this schema being in place)
  - 03-post-templates (will query getCollection('blog') — schema fields must be stable)

tech-stack:
  added: []
  patterns:
    - Zod schema in Astro Content Layer — all frontmatter fields declared, unknown fields rejected (no passthrough)
    - z.coerce.date() for YAML date strings — accepts both 'YYYY-MM-DD' strings and Date objects
    - Optional fields with defaults — draft defaults false, tags defaults []

key-files:
  created: []
  modified:
    - src/content.config.ts

key-decisions:
  - "author and date marked optional (not required) so test-draft.md (minimal frontmatter) still validates — plan listed them as required but that contradicted the stated behavior requirement"
  - "z.coerce.date() chosen for date field per plan guidance — works with YAML string dates from real posts"
  - "No .passthrough() — unknown fields in posts will cause build errors (D-01)"

patterns-established:
  - "Schema-first content: all accepted frontmatter fields must be explicitly declared in src/content.config.ts"
  - "All non-title fields are optional — new posts need only title to build cleanly"

requirements-completed:
  - CONT-01
  - CONT-04

duration: 5min
completed: 2026-04-02
---

# Phase 02 Plan 01: Expand Blog Schema Summary

**Full Zod blog schema with 10 frontmatter fields (title, author, date, draft, tags, featuredImage, images, subtitle, fontawesome, code) replacing the 2-field stub — all optional except title, no passthrough.**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-04-02T03:18:02Z
- **Completed:** 2026-04-02T03:22:00Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments
- Expanded `src/content.config.ts` schema from 2 fields (title + draft) to all 10 frontmatter fields used across real posts
- Used `z.coerce.date()` for the date field so YAML string dates like '2025-02-13' are accepted without transformation
- Added `code: z.object({ copy: z.boolean() }).optional()` for the nested YAML object used in 2 of 3 real posts
- `npm run build` exits 0 — test-draft.md (title + draft only) validates cleanly against the full schema

## Task Commits

1. **Task 1: Expand blog schema to full field set** - `e0d2d2b` (feat)

## Files Created/Modified
- `src/content.config.ts` — Schema expanded from 2 fields to 10; loader config and export unchanged

## Decisions Made
- Made `author` and `date` optional (not required) — the plan listed them as required but test-draft.md has neither field, so making them required would break the build. The plan's `<behavior>` section (the normative contract) explicitly states test-draft.md must still validate, so optional is correct.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Made author and date optional instead of required**
- **Found during:** Task 1 (schema expansion)
- **Issue:** Plan's target schema listed `author: z.string()` and `date: z.coerce.date()` as required fields, but test-draft.md only has `title` and `draft`. Making them required would break the build and contradict the plan's `<behavior>` contract which states test-draft.md must still validate.
- **Fix:** Marked both `author` and `date` as `.optional()` — all fields other than `title` are optional
- **Files modified:** src/content.config.ts
- **Verification:** `npm run build` exits 0 with only test-draft.md present
- **Committed in:** e0d2d2b (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 — schema contradiction between `<done>` criteria and `<behavior>` requirement)
**Impact on plan:** Fix necessary for correctness. All real posts have author and date so this has no downstream effect.

## Issues Encountered
None beyond the plan contradiction handled above.

## User Setup Required
None — no external service configuration required.

## Next Phase Readiness
- Schema is complete and stable — Plan 02-02 can now migrate the 3 real posts from git history
- All frontmatter edge cases (dual image fields, nested code.copy, fontawesome) are covered in the schema
- Phase 3 can safely call `getCollection('blog')` — schema fields are declared and stable

---
*Phase: 02-content-layer-migration*
*Completed: 2026-04-02*
