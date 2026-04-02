---
phase: 04-search-tag-filtering
plan: "02"
subsystem: ui
tags: [fuse.js, astro, search, filtering, accessibility]

# Dependency graph
requires:
  - phase: 04-search-tag-filtering
    plan: "01"
    provides: fuse.js installed, PostCard.astro data-tags + button chips
provides:
  - posts/index.astro with working search input and tag filter bar
  - Client-side Fuse.js search index (title, tags, description)
  - Serialized post data as application/json script tag
  - Real-time show/hide filtering with AND tag logic
  - Empty state paragraph with contextual copy
  - Post count updates reflecting filtered results
  - Clear filters button resetting both search and tag state
  - aria-live region for screen reader announcements
affects:
  - SRCH-01, SRCH-02 fully satisfied

# Tech tracking
tech-stack:
  added: []
  patterns:
    - application/json script tag for build-time data serialization
    - Fuse.js ignoreLocation:true for mid-string full-text search
    - activeTags Set shared between filter bar and PostCard chips
    - AND logic for multi-tag filtering via Array.every()
    - Event delegation for PostCard tag chip clicks

key-files:
  created: []
  modified:
    - src/pages/posts/index.astro
    - src/components/PostCard.astro

key-decisions:
  - "No debounce — filter runs on every keystroke (CONTEXT.md D-09)"
  - "No URL state — activeTags and searchQuery live in JS memory only (CONTEXT.md D-12)"
  - "AND logic for tags — every() not some() (CONTEXT.md D-05)"
  - "Fuse.js short-circuit: searchMatchIds === null when query is empty (fuse.search('') returns empty)"
  - "Card ID derived from href of <a> inside article, strip /posts/ prefix and trailing slash"
  - "set:html not set:text for JSON data island — set:text HTML-encodes quotes breaking JSON.parse"
  - "PostCard tag chips must be outside <a> element — buttons inside anchors trigger navigation on click"

patterns-established:
  - "application/json script tag pattern for Astro build-time data to client-side JS"
  - "Shared Set state between filter bar chips and PostCard chips via toggleTag helper"
  - "Event delegation for dynamically-relevant static elements"

requirements-completed:
  - SRCH-01
  - SRCH-02

# Metrics
duration: 1min
completed: 2026-04-02
---

# Phase 04 Plan 02: Search + Tag Filtering Wiring Summary

**posts/index.astro rewritten with search input, tag filter bar, serialized post data, and client-side Fuse.js filter script — SRCH-01 and SRCH-02 fully satisfied**

## Performance

- **Duration:** ~1 min
- **Completed:** 2026-04-02
- **Tasks:** 1 (+ human verification checkpoint)
- **Files modified:** 1

## Accomplishments
- Added build-time post data serialization (`postData` array) and unique tag extraction (`allTags`) to frontmatter
- Added `<script type="application/json" id="post-data">` tag for passing data to client script
- Added search input with correct placeholder, aria-label, and autocomplete="off"
- Added tag filter bar with `.filter-chip` buttons (one per unique tag, alphabetically sorted)
- Added "× Clear filters" button (hidden until filters active)
- Added aria-live polite region for screen reader count announcements
- Added empty state paragraph with contextual copy (4 distinct messages per UI-SPEC)
- Added full client-side Fuse.js filter script: search index, activeTags Set, applyFilters(), syncFilterChips(), syncPostCardChips(), toggleTag(), event listeners for input/click/clear
- Added CSS for all new elements (controls, search-input, filter-bar, filter-chip, clear-filters, empty-state, sr-only)
- Build passes with 0 errors (5 pages built in 903ms)
- dist/posts/index.html contains id="post-data" JSON and filter-chip elements

## Files Created/Modified
- `src/pages/posts/index.astro` — search input, tag filter bar, data serialization, client script, CSS; `set:html` for JSON island
- `src/components/PostCard.astro` — tag chips moved outside `<a>` to prevent navigation on click; padding adjusted

## Decisions Made
- No debounce: filter runs on every keystroke — no perceptible lag with the post count in this site
- No URL state: activeTags and searchQuery are ephemeral in-memory — no back-button filter persistence needed
- AND logic: multi-tag filter uses `every()` — a post must match all selected tags to appear
- Fuse.js empty-query short-circuit: `searchMatchIds === null` when query is blank prevents fuse.search('') returning empty
- `set:html` (not `set:text`) for the JSON data island: `set:text` HTML-encodes quotes (`"` → `&quot;`), breaking `JSON.parse` at runtime
- PostCard tag chips moved outside `<a>`: buttons nested inside an anchor trigger link navigation before the click handler runs

## Deviations from Plan
- `PostCard.astro` required an additional fix not in the plan: tag chips were inside the `<a>` link, causing navigation on click
- `set:html` used instead of plan's `set:text` for the JSON script tag to prevent entity encoding

## Issues Encountered
- **Search broken:** `set:text` encoded JSON as HTML entities; `JSON.parse` silently fell back to `[]`; Fuse.js had no data
- **Tag chips navigating:** `<button>` elements inside `<a>` triggered the anchor href on click; fixed by moving tags outside the link

## User Setup Required
None — no external service configuration required.

## Next Steps
- Phase 4 complete — human verified all 10 browser checks pass
- Proceed to Phase 5

---
*Phase: 04-search-tag-filtering*
*Completed: 2026-04-02*
