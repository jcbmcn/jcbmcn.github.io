---
phase: 01-scaffold-ci-cd
plan: 02
subsystem: infra
tags: [astro, content-collections, cname, github-pages, static-assets]

# Dependency graph
requires:
  - phase: 01-01
    provides: Astro 6 project scaffolded with public/ directory ready
provides:
  - public/CNAME containing jcbmcn.com (persists through builds)
  - All favicons and PWA manifest files in public/
  - Blog images in public/images/blog/
  - src/content.config.ts — Astro 6 Content Layer API blog collection schema
  - src/content/blog/test-draft.md — draft filtering verified
  - Draft filtering via getCollection() confirmed working
affects:
  - 02-content-migration: content collection schema ready for real posts
  - deploy: CNAME ensures custom domain survives every deployment

# Tech tracking
tech-stack:
  added: []
  patterns: [astro-content-layer-api, glob-loader, draft-filtering, public-cname]

key-files:
  created:
    - public/CNAME
    - public/apple-touch-icon.png
    - public/favicon-96x96.png
    - public/favicon.svg
    - public/site.webmanifest
    - public/web-app-manifest-192x192.png
    - public/web-app-manifest-512x512.png
    - public/images/blog/ (all images)
    - src/content.config.ts
    - src/content/blog/test-draft.md
  modified:
    - src/pages/index.astro (added getCollection import + draft filter)
    - .gitignore (replaced /public/ with /dist/)

key-decisions:
  - "Astro 6 Content Layer API used (src/content.config.ts with glob loader) — legacy src/content/config.ts format removed in Astro 6"
  - ".gitignore fixed: /public/ replaced with /dist/ — public/ is static assets in Astro, dist/ is build output"
  - "z imported from astro:content (acceptable in v6, deprecated alias astro:schema not used)"

patterns-established:
  - "Content Layer API: src/content.config.ts at project root (not inside src/content/)"
  - "Blog collection uses glob loader scanning ./src/content/blog/**/*.md"
  - "Draft filtering: getCollection('blog', ({ data }) => data.draft !== true)"
  - "CNAME in public/CNAME (no https://, no trailing slash) — Astro copies to dist/ automatically"

requirements-completed: [INFRA-03, INFRA-05]

# Metrics
duration: 2min
completed: 2026-04-01
---

# Phase 01 Plan 02: Static Assets + Content Collection Summary

**CNAME in public/ (jcbmcn.com survives every build), static assets migrated from static/ to public/, Astro 6 Content Layer API blog collection with draft filtering verified**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-01T23:06:24Z
- **Completed:** 2026-04-01T23:08:55Z
- **Tasks:** 2
- **Files modified:** 27

## Accomplishments
- All static assets (favicons, PWA manifest, blog images) migrated from static/ to public/; static/ deleted
- public/CNAME created with `jcbmcn.com` — dist/CNAME confirmed present after build
- src/content.config.ts with Astro 6 Content Layer API — blog collection with draft filtering
- Draft post test-draft.md confirmed absent from dist/ after build (INFRA-05 verified)

## Task Commits

Each task was committed atomically:

1. **Task 1: Migrate static/ to public/, create CNAME** - `ede676d` (feat)
2. **Task 2: Content collection schema + draft filtering** - `011c20d` (feat)

**Plan metadata:** *(committed with 01-02 docs commit)*

## Files Created/Modified
- `public/CNAME` - Custom domain file: `jcbmcn.com`
- `public/` (all assets) - Favicons, PWA manifests, avatar, blog images — moved from static/
- `.gitignore` - Fixed: removed `/public/` (was excluding static assets), added `/dist/`
- `src/content.config.ts` - Astro 6 Content Layer API blog collection with glob loader + draft schema
- `src/content/blog/test-draft.md` - Synthetic test post with `draft: true` (verifies INFRA-05)
- `src/pages/index.astro` - Added `getCollection('blog', ...)` with `data.draft !== true` filter
- **Deleted:** static/ directory (all contents moved to public/)

## Decisions Made
- **Astro 6 Content Layer API:** Research doc specified legacy `src/content/config.ts` format (Astro v4/v5 API), but Astro 6 requires `src/content.config.ts` at the project root with loaders. Fixed automatically.
- **.gitignore `/public/`:** Hugo used `public/` as build output (appropriately gitignored). Astro uses `public/` as static assets (must be committed). Fixed to ignore `dist/` instead.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Content config file path and format incorrect for Astro 6**
- **Found during:** Task 2 (content collection schema creation)
- **Issue:** Research doc specified `src/content/config.ts` (legacy Astro v4/v5 format). Astro 6 removed legacy content collections and requires `src/content.config.ts` at the project root with explicit loaders (Content Layer API).
- **Fix:** Created `src/content.config.ts` with glob loader (`import { glob } from 'astro/loaders'`). Removed the incorrectly-placed `src/content/config.ts`.
- **Files modified:** src/content.config.ts (created at correct location)
- **Verification:** `npm run build` exits 0, no `LegacyContentConfigError`
- **Committed in:** `011c20d`

**2. [Rule 1 - Bug] .gitignore excluded public/ (Astro static assets)**
- **Found during:** Task 1 (staging public/ files)
- **Issue:** `.gitignore` had `/public/` which was correct for Hugo (build output) but wrong for Astro (static assets). This prevented CNAME and all favicon/image assets from being committed.
- **Fix:** Updated `.gitignore` to ignore `/dist/` (Astro build output) instead of `/public/`
- **Files modified:** .gitignore
- **Verification:** `git add public/` succeeds; all asset renames from `static/ → public/` are tracked
- **Committed in:** `ede676d`

---

**Total deviations:** 2 auto-fixed (2 bugs)
**Impact on plan:** Both fixes necessary for correctness. No scope creep.

## Issues Encountered
- None beyond the deviations documented above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- CNAME is in place — jcbmcn.com will resolve correctly after the PR to main is merged and the workflow runs
- Content collection schema is minimal by design (Phase 2 adds the full Zod schema with date, tags, etc.)
- Draft filtering is verified working — real posts in Phase 2 will use the same mechanism
- All static assets are in public/ — ready for Phase 3 to reference them in templates

---
*Phase: 01-scaffold-ci-cd*
*Completed: 2026-04-01*
