# Phase 4: Search + Tag Filtering - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-02
**Phase:** 04-search-tag-filtering
**Areas discussed:** Interactivity approach, Tag filter UX, Search UI + empty state, URL state

---

## Interactivity Approach

| Option | Description | Selected |
|--------|-------------|----------|
| Vanilla JS in Astro `<script>` | No framework, no hydration overhead. Consistent with copy-to-clipboard pattern. | ✓ |
| Framework island (React/Preact) | More structured state management, but adds framework dependency and hydration cost. | |
| Client-side router | Astro View Transitions or dedicated router. Overkill for single-page filter. | |

**User's choice:** Vanilla JS in Astro `<script>`

---

| Option | Description | Selected |
|--------|-------------|----------|
| Inline post data in page HTML | Serialize at build time into data attribute or inline script. No network request. | ✓ |
| Fetch search-index.json at load | Build-time JSON file fetched on page load. Cleaner separation but adds complexity. | |

**User's choice:** Inline post data in page HTML

---

## Tag Filter UX

| Option | Description | Selected |
|--------|-------------|----------|
| Single tag at a time | Click one tag, it becomes active. Click another to switch. Click again or X to clear. | |
| Multi-tag selection | Multiple tags active simultaneously with AND/OR logic. Toggle on/off with clear-all. | ✓ |

**User's choice:** Multi-tag selection

---

| Option | Description | Selected |
|--------|-------------|----------|
| AND — post must match all tags | Narrowing behavior. Post must have all active tags. | ✓ |
| OR — post matches any tag | Broadening behavior. Post matching any active tag is shown. | |

**User's choice:** AND — narrowing logic

---

| Option | Description | Selected |
|--------|-------------|----------|
| Tag filter bar above post list | All unique tags shown as chips above the list. Active chips are highlighted. | ✓ |
| Tags on cards are the only entry point | No central bar; only tags on post cards are clickable. | |

**User's choice:** Tag filter bar above post list

---

## Search UI + Empty State

| Option | Description | Selected |
|--------|-------------|----------|
| Search + tag bar together at top | Both controls co-located. Work additively. | ✓ |
| Search as hero element, tags below | More emphasis on search, heavier visual treatment. | |

**User's choice:** Search + tag bar together at top

---

| Option | Description | Selected |
|--------|-------------|----------|
| Real-time as you type | Fuse.js runs on every keystroke. Instant feedback. | ✓ |
| On submit / Enter key | Filters only on Enter or button click. | |

**User's choice:** Real-time as you type

---

| Option | Description | Selected |
|--------|-------------|----------|
| Plain text message | e.g., "No posts match '[query]'" | ✓ |
| Styled empty state with clear link | More polished with a clear-filters call to action. | |

**User's choice:** Plain text message

---

## URL State

| Option | Description | Selected |
|--------|-------------|----------|
| No URL state — in-memory only | Filter state lives in JS memory. Refreshing shows full unfiltered list. | ✓ |
| Reflect state in URL params | ?tag=kubernetes&q=terraform. Shareable/bookmarkable. Adds history.pushState() complexity. | |

**User's choice:** No URL state — in-memory only

---

## Agent's Discretion

- Exact placement of search input within the controls area
- Visual CSS for active vs inactive tag chips (using established CSS tokens)
- Whether to debounce search input
- How post excerpt is derived for Fuse.js indexing
- Clear-all button/link placement and label

## Deferred Ideas

- URL state (bookmarkable search) — consciously deferred, may revisit in v2
- Animated filter transitions — out of scope
