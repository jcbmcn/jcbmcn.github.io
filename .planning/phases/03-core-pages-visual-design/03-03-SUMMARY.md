---
phase: 03-core-pages-visual-design
plan: "03"
subsystem: ui
tags: [astro, shiki, syntax-highlighting, copy-to-clipboard, prose, typography]

requires:
  - phase: 03-01
    provides: BaseLayout.astro, @tailwindcss/typography prose class, global.css CSS tokens, Shiki github-dark config
  - phase: 02-content-layer-migration
    provides: Content schema, 3 real blog posts in src/content/blog/

provides:
  - Dynamic post page at /posts/[slug]/ for all published posts
  - Shiki github-dark syntax highlighting on all code blocks
  - Copy-to-clipboard button on every <pre> block (client-side script)
  - Featured image at post top when frontmatter provides one
  - All 3 real post pages built and verified in dist/

affects:
  - Phase 5 (SEO — OG tags, sitemap for these URLs)

tech-stack:
  added: []
  patterns:
    - "Astro 6 Content Layer render API: render(entry) imported from astro:content (NOT entry.render())"
    - "Copy-to-clipboard: plain <script> block injects button into each <pre> on DOMContentLoaded"
    - ":global() selector required for styles targeting elements inside <Content /> (outside scoped component)"
    - "prose class from @tailwindcss/typography wraps <Content /> for automatic heading/p/code styling"

key-files:
  created:
    - src/pages/posts/[slug].astro
  modified: []

key-decisions:
  - "Use render(entry) from astro:content — the Astro 6 Content Layer API (entry.render() is legacy pre-6 API)"
  - "Copy button: opacity 0 default, visible on pre:hover — standard code block UX"
  - "Copy button positioned absolute inside <pre> via JS setting pre.style.position='relative'"
  - "Featured image loading='eager' on post page (above fold), loading='lazy' in PostCard thumbnails"

patterns-established:
  - "Astro 6 Content Layer render: always import render from astro:content and call render(entry)"
  - "Copy-to-clipboard: plain <script> block (not client: island) — post pages are static HTML, no hydration needed"
  - "Post body styles: .post-body :global(a) pattern for targeting elements inside <Content />"

requirements-completed:
  - PAGE-03
  - PAGE-04
  - PAGE-05
  - PAGE-06

duration: 4min
completed: 2026-04-02
---

# Phase 03-03: Dynamic Post Page Summary

**Individual post pages at /posts/[slug]/ with Shiki github-dark syntax highlighting, conditional featured images, and copy-to-clipboard buttons on all code blocks**

## Performance

- **Duration:** ~4 min
- **Started:** 2026-04-02T21:55:00Z
- **Completed:** 2026-04-02T21:56:10Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments

- Dynamic route [slug].astro renders all 3 published posts via getStaticPaths + getCollection
- Shiki github-dark theme renders code blocks with syntax highlighting (confirmed in dist/ output)
- Copy-to-clipboard button injects into every `<pre>` element at DOMContentLoaded; shows visual feedback ('Copied!' for 2s)
- Featured images rendered above post content when frontmatter provides them (all 3 posts have featured images)
- All 3 post URLs verified in dist/: power-automate, talosctl-cdktf-guide, building-codeowners-simulator

## Task Commits

1. **Task 1: Create dynamic post page with copy-to-clipboard** - `e08cfb4` (feat)

## Files Created/Modified

- `src/pages/posts/[slug].astro` — Dynamic post route: getStaticPaths, render(entry), featured image, prose-wrapped Content, copy-to-clipboard script, CSS token-based styles

## Decisions Made

- `render(entry)` from `astro:content` used instead of legacy `entry.render()` — required for Astro 6 Content Layer API

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed entry.render() → render(entry) for Astro 6 Content Layer API**
- **Found during:** Task 1 (build verification)
- **Issue:** Plan specified `const { Content } = await entry.render()` — this is the legacy Astro pre-6 API. With the Content Layer API (glob loader), `entry.render` is not a function. Build errored: `TypeError: entry.render is not a function`
- **Fix:** Changed import to `import { getCollection, render } from 'astro:content'` and call `const { Content } = await render(entry)`
- **Files modified:** `src/pages/posts/[slug].astro`
- **Verification:** Build produces all 3 post pages; Shiki highlighting confirmed in dist/ HTML
- **Committed in:** `e08cfb4`

---

**Total deviations:** 1 auto-fixed (Rule 1 — bug fix)  
**Impact on plan:** Required API correction for Astro 6 Content Layer compatibility. No scope change.

## Issues Encountered

The Astro 6 Content Layer API deprecates `entry.render()` in favor of `render(entry)` imported from `astro:content`. This was the only blocker; once fixed, all 3 posts built cleanly.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- All 3 core pages complete: homepage (/), listing (/posts/), individual posts (/posts/[slug]/)
- Phase 4 (search/filter) can extend /posts/ listing page
- Phase 5 (SEO) can add OG tags to BaseLayout and post pages
- Copy buttons work on static HTML — no Astro island needed for Phase 4 additions

---
*Phase: 03-core-pages-visual-design*
*Completed: 2026-04-02*
