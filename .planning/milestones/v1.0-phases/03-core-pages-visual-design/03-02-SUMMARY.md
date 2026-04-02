---
phase: 03-core-pages-visual-design
plan: "02"
subsystem: ui
tags: [astro, postcards, homepage, blog-listing, tailwind, css-tokens]

requires:
  - phase: 03-01
    provides: BaseLayout.astro, global.css CSS tokens, Tailwind 4 build pipeline
  - phase: 02-content-layer-migration
    provides: getCollection('blog') with typed frontmatter schema

provides:
  - PostCard.astro — reusable post card with image-as-accent layout
  - Homepage at / with avatar hero, bio, social links, and 3 recent posts
  - Blog listing page at /posts/ with all published posts sorted newest-first

affects:
  - 03-03 (post page references /posts/ back-link; consistent with listing page)
  - Phase 4 (search/filter UI extends /posts/ listing page)

tech-stack:
  added: []
  patterns:
    - "Image resolution pattern: featuredImage ?? images?.[0] ?? undefined"
    - "Draft filtering: getCollection('blog', ({ data }) => data.draft !== true)"
    - "Date sorting: b.data.date?.getTime() ?? 0 — handles undefined dates gracefully"
    - "PostCard: text-first with conditional thumbnail — no broken layout without image"

key-files:
  created:
    - src/components/PostCard.astro
    - src/pages/posts/index.astro
  modified:
    - src/pages/index.astro

key-decisions:
  - "PostCard uses image-as-accent layout — text leads, 96x96 thumbnail optional"
  - "Homepage shows 3 most recent posts (not a fixed set) via .slice(0, 3)"
  - "Post URLs are /posts/${entry.id}/ where entry.id is the filename without extension"
  - "Bio is first-person, professional-but-personal placeholder for Jacob to edit"

patterns-established:
  - "All pages wrap in <BaseLayout title=... description=...>"
  - "getCollection always filters draft !== true for published-only output"
  - "Date sort: null dates sort to epoch (position 0) — drafts without dates don't break sort"

requirements-completed:
  - PAGE-01
  - PAGE-02

duration: 5min
completed: 2026-04-02
---

# Phase 03-02: Homepage + PostCard + Blog Listing Summary

**Homepage with avatar hero, bio, and recent posts wired to PostCard; /posts/ listing page showing all published posts sorted newest-first**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-04-02T21:53:00Z
- **Completed:** 2026-04-02T21:54:40Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- PostCard.astro built with image-as-accent layout: text-first, 96x96 optional thumbnail, graceful degradation when no image
- Homepage (index.astro) fully replaced: avatar beside name/tagline/social links hero, 2-sentence bio, 3 most recent posts
- /posts/ listing page created with sorted post list, post count, and back-to-home link
- Build produces dist/index.html and dist/posts/index.html — both verified

## Task Commits

1. **Task 1: Build PostCard component** - `282cbb4` (feat)
2. **Task 2: Replace homepage and create blog listing page** - `c06e684` (feat)

## Files Created/Modified

- `src/components/PostCard.astro` — Post card: title, date, tags, optional 96x96 thumbnail; hover state uses CSS tokens; link to /posts/${slug}/
- `src/pages/index.astro` — Full homepage replacing placeholder: hero (avatar, name, tagline, social links, bio) + recent posts section
- `src/pages/posts/index.astro` — New blog listing: all published posts newest-first, post count, back-link to home

## Decisions Made

- Bio written as reasonable placeholder (first person, professional/personal) per D-07 — Jacob can edit
- Social links preserved from existing placeholder page: github.com/jcbmcn and linkedin.com/in/jacob-mcneilly-a6a516112/

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- PostCard component ready (03-03 doesn't need it, but Phase 4 search extends it)
- /posts/[slug].astro can now be built knowing the listing page links to /posts/${slug}/
- All 3 plans in phase now have their import structure: BaseLayout ← index.astro and posts/index.astro

---
*Phase: 03-core-pages-visual-design*
*Completed: 2026-04-02*
