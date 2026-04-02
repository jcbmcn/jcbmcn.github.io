# Phase 4: Search + Tag Filtering — Research

**Phase:** 04-search-tag-filtering
**Research completed:** 2026-04-02
**Requirements:** SRCH-01, SRCH-02
**Discovery level:** 1 (quick verification — known library, existing patterns)

---

## Summary

Phase 4 adds client-side Fuse.js full-text search and tag click-to-filter to the existing posts listing page. All technology decisions are locked in CONTEXT.md (D-01 through D-12). This research validates the Fuse.js 7 API, Astro `<script>` import patterns, and confirms there are no unexpected integration challenges.

## Standard Stack

| Concern | Solution | Source |
|---------|----------|--------|
| Search library | Fuse.js 7.1.0 (`npm install fuse.js`) | REQUIREMENTS.md SRCH-02, CONTEXT.md D-03 |
| JS integration | Astro `<script>` block (not island) | CONTEXT.md D-01, Phase 3 pattern |
| Data serialization | `<script type="application/json" id="post-data">` at build time | CONTEXT.md D-02, UI-SPEC Interaction Spec |
| DOM filtering | `display: none` on `<article>` cards | UI-SPEC Accessibility section |
| Tag chips | `<button type="button">` with `aria-pressed` | UI-SPEC Component Specs |
| CSS tokens | `--color-accent`, `--color-accent-subtle`, etc. from `global.css` | CONTEXT.md D-06, UI-SPEC Color |

## Fuse.js 7 API (Validated)

**Install:** `npm install fuse.js` (latest: 7.1.0)

**ESM import in Astro `<script>` block:**
```typescript
import Fuse from 'fuse.js';
```
Fuse.js 7 ships with native ESM (`dist/fuse.mjs`) — Astro's Vite bundler handles this correctly. No shim needed.

**Required configuration per SRCH-02:**
```typescript
const fuse = new Fuse(posts, {
  keys: ['title', 'tags', 'description'],
  ignoreLocation: true,  // MANDATORY — SRCH-02 acceptance criterion
  threshold: 0.3,        // standard fuzzy match tolerance
  includeScore: false,
});
```

**Search call:**
```typescript
const results = fuse.search(query);  // returns FuseResult<T>[]
const matchedIds = new Set(results.map(r => r.item.id));
```

**No search (empty query):** When `query === ''`, show all posts — do NOT call `fuse.search('')` (returns empty). Check explicitly.

## Post Data Serialization Pattern

At build time in `posts/index.astro` frontmatter:
```astro
---
const postData = posts.map(entry => ({
  id: entry.id,
  title: entry.data.title,
  tags: entry.data.tags ?? [],
  description: entry.data.description ?? '',
}));
---

<script type="application/json" id="post-data" set:text={JSON.stringify(postData)} />
```

On the client, read this with:
```typescript
const raw = document.getElementById('post-data')?.textContent ?? '[]';
const posts = JSON.parse(raw);
```

**Note:** `set:text` is the correct Astro directive for injecting text content into a script tag. Using `set:html` is also valid but `set:text` is safer for JSON. Alternatively, `is:inline` scripts with `define:vars` can pass server-side variables — both patterns work.

## Architecture Patterns (Existing Codebase)

From Phase 3 (copy-to-clipboard in `[slug].astro`):
- Plain `<script>` block without `is:inline` → Astro bundles it via Vite (preferred for imports)
- `DOMContentLoaded` listener wraps all DOM manipulation
- `document.querySelectorAll()` selects target elements

**Filter logic flow:**
1. On `DOMContentLoaded`: parse JSON, instantiate Fuse, cache DOM references
2. On search input `input` event: re-run filter
3. On tag chip `click` event: toggle tag in active set, re-run filter
4. Filter function: determine visible IDs (Fuse results ∩ active-tag matches), set `display: none` on non-matching `<article>` elements
5. Update post count, update aria-live region, show/hide empty state

## PostCard.astro Changes Required

**`<article>` element:** Add `data-tags` attribute for JS-based tag filtering:
```astro
<article class="post-card" data-tags={tags.join(',')}>
```

**Tag chips:** Change from `<li>` to `<button type="button">` for keyboard accessibility:
```astro
<button type="button" class="post-card__tag" data-tag={tag}>{tag}</button>
```
Wrap in `<ul>` changes to a `<div>` or remove the list wrapper since `<button>` elements are not valid `<li>` children without `<li>` wrappers. **Simplest approach:** Keep `<ul class="post-card__tags">` but change each `<li>` to `<li><button type="button" class="post-card__tag" data-tag={tag}>{tag}</button></li>`.

**Active state:** CSS class `post-card__tag--active` on the button:
```css
.post-card__tag--active {
  background: var(--color-accent);
  color: white;
}
```

## Tag Filter Bar (New Component in index.astro)

Tag bar renders all unique tags from all published posts. Built at Astro build time:
```astro
---
const allTags = [...new Set(posts.flatMap(p => p.data.tags ?? []))].sort();
---

<div class="filter-bar" role="group" aria-label="Filter by tag">
  {allTags.map(tag => (
    <button type="button" class="filter-chip" data-tag={tag} aria-pressed="false">
      {tag}
    </button>
  ))}
  <button type="button" class="clear-filters" id="clear-filters" hidden>× Clear filters</button>
</div>
```

## Empty State + Post Count Update

The existing `.listing-count` paragraph must update dynamically to reflect filtered count.

Empty state element (inserted below post list in markup, hidden by default):
```html
<p class="empty-state" id="empty-state" hidden></p>
```

The JS sets `textContent` to the correct copy per the UI-SPEC copywriting contract.

## Validation Architecture

### Automated Validation

| Test | Method |
|------|--------|
| Fuse.js build integration | `npm run build` succeeds without errors |
| Search returns correct posts | Manual: type "kubernetes" → only kubernetes-tagged posts show |
| `ignoreLocation: true` works | Manual: type "automation" → Power Automate post appears (mid-string match) |
| Tag AND logic | Manual: activate 2 tags → only posts matching BOTH appear |
| Clear filters resets | Manual: activate filters → click "× Clear filters" → all posts show |
| Empty state shows | Manual: type "xyznotaword" → empty state paragraph appears |
| Keyboard accessible | Tab through chips, activate with Enter/Space |
| ARIA attributes | Inspect DOM: `aria-pressed="true"` on active chips |

### Build-time Validation

- `npm run build` — verifies no TypeScript errors, valid Astro syntax
- Post count in output HTML reflects all published posts (no JS-filtered state at build time)

## Common Pitfalls to Avoid

1. **`fuse.search('')` returns empty** — must short-circuit to "show all" when query is blank
2. **`<li>` wrapping `<button>`** — keep `<li>` wrappers in `PostCard.astro` tags list (valid HTML)
3. **Fuse.js `tags` field** — is an array; Fuse.js 7 handles array fields correctly for `keys`
4. **`define:vars` vs `set:text`** — `define:vars` only works with `is:inline` scripts; use `set:text` on `<script type="application/json">` for JSON data embedding
5. **`display: none` vs DOM removal** — keep cards in DOM with `display: none` (preserves DOM order, avoids ARIA complexity)
6. **Tag sync between filter bar and PostCard** — both must read from/write to the same `activeTags` Set. Use module-level Set, not separate variables.

## Scope Confirmation

Phase 4 is straightforwardly implementable in 2 plans:
- **Plan 01:** Install Fuse.js + update PostCard.astro (data attributes, button chips, active state CSS)
- **Plan 02:** Add search input, tag filter bar, serialized post data, and client-side filter script to `posts/index.astro`

No external services, no new infrastructure, no new page routes. All work is additive to existing files.

---

## RESEARCH COMPLETE

**Standard stack confirmed:** Fuse.js 7.1.0 (ESM), Astro `<script>` block, vanilla DOM manipulation
**Architecture patterns:** `<script type="application/json">` for data, `display:none` for filtering, `<button>` chips with `aria-pressed`
**Common pitfalls identified:** Empty-query short-circuit, `fuse.search('')` returns empty, `<li>` wrapper HTML validity
**Plan count:** 2 plans, 1 wave (sequential — Plan 02 depends on Plan 01's PostCard changes)
