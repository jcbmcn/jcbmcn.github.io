# Phase 4: Search + Tag Filtering - Context

**Gathered:** 2026-04-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Add Fuse.js free-text search and tag click-to-filter to the existing blog listing page (`src/pages/posts/index.astro`). Visitors can find posts by tag or text without any server-side processing. All filtering runs client-side in the browser. Individual post pages, SEO, and RSS are out of scope — those are Phase 5.

Requirements covered: SRCH-01, SRCH-02

</domain>

<decisions>
## Implementation Decisions

### Interactivity Approach
- **D-01:** Vanilla JS in an Astro `<script>` block — no framework island, no React/Preact, no hydration overhead. Consistent with the copy-to-clipboard pattern already established in the codebase.
- **D-02:** Post data (title, tags, excerpt/description) is serialized inline into the page HTML at build time (e.g., a JSON data attribute on a hidden element or an inline `<script type="application/json">`). Fuse.js reads this on the client. No separate `search-index.json` fetch needed.
- **D-03:** Fuse.js 7 must be installed (`npm install fuse.js`) — it is specified in REQUIREMENTS.md but is NOT yet in `package.json`. This is a prerequisite task for the phase.

### Tag Filter Behavior
- **D-04:** Multi-tag selection — multiple tags can be active simultaneously.
- **D-05:** AND logic — a post must match ALL active tags to appear (narrowing behavior). Example: selecting "kubernetes" and "terraform" shows only posts tagged with both.
- **D-06:** A tag filter bar lives above the post list, showing all unique tags from all published posts as clickable chips. Active tags are visually highlighted (filled indigo accent color). Clicking a chip toggles it on/off.
- **D-07:** Tags on post cards (`PostCard.astro`) also become clickable and toggle the filter (same behavior as the filter bar chips). Both entry points work together.

### Search UI
- **D-08:** Search input and tag filter bar are co-located at the top of the listing page — both controls in the same header/controls area. They work additively: search narrows by full-text, tags narrow by taxonomy; both filters apply simultaneously.
- **D-09:** Real-time filtering as you type — no debounce required for the current post count (~3 posts). Fuse.js runs on every keystroke.
- **D-10:** Fuse.js config: `ignoreLocation: true` (required by SRCH-02). Search fields: post `title`, `tags`, and post `description`/excerpt if available.
- **D-11:** Empty state: plain text message — e.g., `No posts match "[query]"` or `No posts tagged [tag]`. No styled illustration or dedicated empty state component needed.

### URL State
- **D-12:** No URL state — filter and search state lives in JS memory only. Refreshing or sharing the URL shows the full unfiltered list. No `history.pushState()` or query param management.

### Agent's Discretion
- Exact placement of the search input within the controls area (above tags, beside tags, etc.)
- Visual treatment of active vs inactive tag chips (exact CSS — must use established `--color-accent` / `--color-accent-subtle` tokens)
- Whether to debounce search input (acceptable either way given post count)
- How post excerpt/description is derived for Fuse.js indexing (first N characters of body, or omit if not easily available at build time)
- Clear-all button placement and label (e.g., "Clear filters" link when any filter is active)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Search & Discovery Requirements
- `.planning/REQUIREMENTS.md` — SRCH-01 and SRCH-02 define all acceptance criteria for this phase. SRCH-02 explicitly mandates `ignoreLocation: true` for Fuse.js.

### Existing Listing Page (to modify)
- `src/pages/posts/index.astro` — The listing page. Phase 4 adds search input, tag filter bar, and filtering logic to this file.

### Existing Post Card (to update)
- `src/components/PostCard.astro` — Tag chips already rendered as visual-only `<li class="post-card__tag">` elements. Phase 4 makes these clickable to toggle filters.

### CSS Token Architecture
- `src/styles/global.css` — All CSS custom properties are defined here. Phase 4 must use established tokens (`--color-accent`, `--color-accent-subtle`, `--color-border`, `--color-text-secondary`, etc.) for filter UI styling.

### Prior Phase Context
- `.planning/phases/03-core-pages-visual-design/03-CONTEXT.md` — Established: CSS custom property architecture, indigo `#6366F1` accent for interactive elements, hybrid Tailwind + scoped style blocks approach.
- `.planning/phases/01-scaffold-ci-cd/01-CONTEXT.md` — Established: npm as package manager, Astro 6 Content Layer API.

### No external Fuse.js spec — requirements fully captured in REQUIREMENTS.md SRCH-02 and decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/pages/posts/index.astro`: Already queries `getCollection('blog')`, sorts posts, renders `<PostCard>` components. Phase 4 modifies this page to add controls and filtering logic.
- `src/components/PostCard.astro`: Renders tag chips as `<li class="post-card__tag">` inside `<ul class="post-card__tags">`. Tags need `data-tag` attributes and click handlers to participate in filtering. The entire card is wrapped in an `<article>` — needs a `data-tags` attribute for JS filtering.
- CSS tokens (`--color-accent`, `--color-accent-subtle`, `--color-border`, `--color-text-secondary`) — already defined in `src/styles/global.css`. Use these for tag chip active states and search input styling.

### Established Patterns
- Client-side JS via Astro `<script>` blocks (not framework islands) — established by the copy-to-clipboard implementation in Phase 3.
- Scoped `<style>` blocks for component-level CSS — use for search input and tag filter bar styling.
- Tailwind utilities for layout/spacing, scoped styles for bespoke CSS — established hybrid approach.

### Integration Points
- `src/pages/posts/index.astro` is the sole integration point. The Fuse.js instance, post data serialization, search input, tag filter bar, and filter logic all live here (or in a companion script/component if the agent chooses to extract).
- `src/components/PostCard.astro` needs minor update: add `data-tags` attribute to the `<article>` element so the JS filter can show/hide cards by tag match.
- Fuse.js 7 import: install via `npm install fuse.js`, then import in the `<script>` block.

### What Does NOT Exist Yet
- Fuse.js is not installed (`package.json` has no `fuse.js` entry) — must be added as step 1.
- No search input, no tag filter bar, no client-side interactivity on the listing page.
- No `data-tag` or `data-tags` attributes on existing components.

</code_context>

<specifics>
## Specific Ideas

- No specific product references or "I want it like X" moments — standard filter/search patterns apply.
- Tag chips in the filter bar should visually match the existing tag chips in post cards (same pill shape, same color tokens) to feel consistent.

</specifics>

<deferred>
## Deferred Ideas

- URL state (bookmarkable/shareable search) — conscious decision to skip; can be revisited in v2 if needed.
- Animated transitions when posts are filtered in/out — out of scope.
- Server-side or build-time paginated search — not applicable (static site, small post count).

</deferred>

---

*Phase: 04-search-tag-filtering*
*Context gathered: 2026-04-02*
