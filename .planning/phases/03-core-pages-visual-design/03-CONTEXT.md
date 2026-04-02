# Phase 3: Core Pages + Visual Design - Context

**Gathered:** 2026-04-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Implement all page routes (homepage, blog listing, individual post) and apply the agreed visual design. The site should look like a polished personal brand when this phase is done. Search/filtering (Fuse.js, tag clicks) is out of scope — that's Phase 4. SEO (RSS, sitemap) is out of scope — that's Phase 5.

Requirements covered: PAGE-01, PAGE-02, PAGE-03, PAGE-04, PAGE-05, PAGE-06

</domain>

<decisions>
## Design Decisions

### D-01: Overall Aesthetic
Modern personal brand with "portfolio energy" alongside the blog. Stronger homepage hero. Not a pure dev blog — has personality and a visible identity.

### D-02: Color Scheme
- **Base**: Slate/neutral (Tailwind slate palette)
- **Accent**: Indigo `#6366F1` (matches Tailwind `indigo-500`)
- **Architecture**: CSS custom properties for all color tokens — light-mode values defined at root, dark-mode overrides ready to slot in as a v2 addition (DES-01). No hardcoded color values in components; everything goes through tokens.
- Token naming convention: agent's discretion (e.g., `--color-accent`, `--color-surface`, `--color-text-primary`, etc.)

### D-03: Typography
- **Font**: Inter (single Google Font — one family, no secondary typeface)
- **Loading**: Google Fonts import in the base layout
- **Size scale and weights**: agent's discretion; Inter works well at normal weights (400/500/600/700)

### D-04: Homepage Hero
- **Layout**: Avatar beside text — small circular/rounded avatar to the left or right of the intro block
- **Intro block content**: Name, tagline, social links
- **Bio**: Short paragraph (~2–3 sentences) below or alongside the avatar/name block
- **Bio placement**: Co-located with the hero, not a separate section
- **Social links**: GitHub and LinkedIn (pulled from existing site data — see `hugo.toml` params for reference values before it was deleted, or current placeholder page)
- **Avatar source**: `/images/avatar.png` (already in `public/images/`)
- **Below the hero**: Recent posts section (PAGE-01 requirement)

### D-05: Post Cards (Blog Listing)
- **Layout**: Image-as-accent — small thumbnail on the side of a text-first card
- **Rationale**: Graceful degradation — design works whether or not a featured image is present; text content leads
- **When no image**: Card renders cleanly without the thumbnail slot; no broken layouts or placeholder boxes
- **Card content**: Title, date, tags, excerpt (or description if available)

### D-06: Tailwind Approach
- **Hybrid**: Tailwind utility classes for layout and spacing; component `<style>` blocks (scoped Astro styles) for bespoke/per-component styling
- **When to use utilities**: Grid, flex, margin, padding, responsive breakpoints
- **When to use `<style>`**: Custom component-level rules, CSS custom property consumption, anything that would be unwieldy as a long utility string
- **CSS variables**: Defined in a global stylesheet (e.g., `src/styles/global.css`) and consumed via both Tailwind's `theme()` function where appropriate and direct `var()` references in `<style>` blocks

### D-07: Bio Length
- Short paragraph — approximately 2–3 sentences
- Tone: professional but personal; written in first person
- **Placeholder content**: Agent writes a reasonable placeholder bio for Jacob McNeilly (software engineer / technical writer); Jacob will edit it. Do not leave it blank or use Lorem Ipsum.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Page Requirements
- `.planning/REQUIREMENTS.md` — PAGE-01 through PAGE-06 define all acceptance criteria for this phase. Read before writing tasks.

### Content Schema (stable from Phase 2)
- `src/content.config.ts` — The full Zod schema. All frontmatter fields are defined here. Phase 3 templates call `getCollection('blog')` and use these typed fields.

### Image Resolution Pattern (from Phase 2)
- Canonical image: `featuredImage ?? images?.[0] ?? undefined` — implement this in template/component code, not in the schema.

### Project Constraints
- `.planning/PROJECT.md` — TypeScript strict, static-only, Markdown as sole content input.

### Prior Phase Context
- `.planning/phases/01-scaffold-ci-cd/01-CONTEXT.md` — Established: npm, Astro 6 Content Layer API, `src/content/blog/`, Tailwind CSS 4 via Vite plugin, Shiki syntax highlighting, Fuse.js 7 installed.
- `.planning/phases/02-content-layer-migration/02-CONTEXT.md` — Established: full schema fields, image resolution strategy, draft filtering pattern.

### Static Assets (already in place)
- `public/images/avatar.png` — Avatar for the homepage hero
- `public/images/blog/` — Featured images for posts (referenced in frontmatter)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/pages/index.astro` — Placeholder page from Phase 1. Replace with the full homepage in this phase; do not create a new file.
- `src/content.config.ts` — Content schema already wired. `getCollection('blog')` returns typed posts with all Phase 2 fields.
- `src/content/blog/` — 3 real posts + 1 synthetic draft test post. Draft filtering already works.

### Established Patterns
- Astro 6 Content Layer API: `getCollection('blog')` filters out drafts via `entry.data.draft !== true`.
- Shiki is configured as the Astro syntax highlighter (set up in `astro.config.mjs` in Phase 1). No additional Shiki config needed — code fences render highlighted automatically.
- Copy-to-clipboard: Phase 1 research established that copy buttons are applied globally (client-side script or Astro island), not per-post via `code.copy` frontmatter. The `code.copy` field in existing posts is irrelevant at runtime.

### Pages to Create
- `src/pages/index.astro` — Homepage (replace placeholder)
- `src/pages/posts/index.astro` — Blog listing (new)
- `src/pages/posts/[slug].astro` — Individual post (new, dynamic route)

### URL Pattern
- Post URLs: `/posts/[slug]/` where slug = Astro content collection entry ID (the markdown filename without extension, e.g., `2025-12-28-building-codeowners-simulator`)
- Note: REQUIREMENTS.md CONT-03 specifies URLs matching Hugo's `:filename` pattern. Verify the dynamic route slug resolves correctly to match `/2025-12-28-building-codeowners-simulator/` — not `/posts/2025-12-28-building-codeowners-simulator/` — and adjust if there's a mismatch.

### Tailwind CSS 4
- Installed via `@tailwindcss/vite` Vite plugin (Phase 1). No `tailwind.config.js` file — Tailwind 4 uses CSS-first config. Custom tokens go in `src/styles/global.css` using `@theme` or CSS custom properties.

### Copy-to-Clipboard
- PAGE-06 requires working copy buttons on code blocks. Shiki renders `<pre><code>` — the copy button must be injected client-side (a small inline `<script>` or Astro client component). Agent decides implementation approach.

</code_context>

<specifics>
## Specific Design Notes

- Avatar is circular/rounded — use `rounded-full` or `border-radius: 50%` with a fixed small size (e.g., 80–96px diameter)
- Homepage hero: avatar beside text (either layout — left or right of the intro block — agent's discretion for visual balance)
- Post cards: text-first; image thumbnail is a visual accent, not the dominant element
- Color palette: slate base + indigo `#6366F1` accent. Indigo should appear on interactive elements (links, buttons, tag chips, hover states) and the hero/brand mark
- The design should feel "modern personal brand" — clean, readable, not over-designed; more personality than a generic dev blog template
- Google Fonts Inter: load only the weights actually used (400, 500, 600, 700 covers most needs)

</specifics>

<deferred>
## Deferred to Later Phases

- **Dark mode toggle** (DES-01): CSS token architecture is established in this phase (dark-mode-ready), but the actual toggle UI and `prefers-color-scheme` / `data-theme` switching are deferred to v2.
- **Tag filtering** (SRCH-01): Post cards display tags as visual labels only — no click-to-filter behavior in this phase. Interactivity added in Phase 4.
- **Free-text search** (SRCH-02): Fuse.js is installed but not wired up. Phase 4 work.
- **Open Graph / Twitter cards** (SEO-03): Phase 5.
- **RSS + sitemap** (SEO-01, SEO-02): Phase 5.
- **Reading time** (EXT-01, v2): Not in scope for Phase 3.

</deferred>

---

*Phase: 03-core-pages-visual-design*
*Context gathered: 2026-04-01*
