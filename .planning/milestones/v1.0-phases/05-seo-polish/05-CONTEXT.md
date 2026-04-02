# Phase 5: SEO + Polish - Context

**Gathered:** 2026-04-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver the final v1 production readiness work across four areas:

1. **RSS feed** — `/rss.xml` listing all published posts (SEO-01)
2. **Sitemap** — `/sitemap.xml` generated at build time (SEO-02)
3. **Dark mode** — Light/dark theme toggle with localStorage persistence and OS default
4. **Polish** — Persistent site header/nav, RSS autodiscovery link, RSS link in footer, 404 page

Requirements covered: SEO-01, SEO-02
Additional polish items: dark mode toggle, site header, 404 page, RSS link in nav/footer

Individual post pages, content migration, and search are fully complete — this phase only adds infrastructure and polish on top of the existing Astro 6 site.

</domain>

<decisions>
## Implementation Decisions

### RSS Feed (SEO-01)
- **D-01:** Use `@astrojs/rss` package (`npm install @astrojs/rss`). Write a single `src/pages/rss.xml.ts` endpoint using the `rss()` helper. Handles XML encoding, channel metadata, item generation. The `site` URL is already set in `astro.config.mjs` (`https://jcbmcn.com`) — use `context.site` in the endpoint.
- **D-02:** Feed items pull from `getCollection('blog')`, filtered to non-draft posts (`draft !== true`), sorted by date descending. Fields: `title`, `pubDate` (from `date`), `link` (the post's canonical URL), and `description` (from `subtitle` or a fallback empty string if absent).

### Sitemap (SEO-02)
- **D-03:** Use the official `@astrojs/sitemap` integration (`npx astro add sitemap`). Auto-discovers all routes at build time — zero config needed beyond `site: 'https://jcbmcn.com'` already present in `astro.config.mjs`. Outputs `/sitemap-index.xml` and `/sitemap-0.xml`.

### RSS Autodiscovery
- **D-04:** Add `<link rel="alternate" type="application/rss+xml" title="Jacob McNeilly" href="/rss.xml">` to `BaseLayout.astro`'s `<head>`. Enables browser and feed reader auto-detection.

### Persistent Site Header
- **D-05:** Create a new `src/components/SiteHeader.astro` component. Renders a horizontal header bar with:
  - Site name/logo on the left (links to `/`)
  - Dark mode toggle button (sun/moon icon) on the right
  - RSS link in the header or footer (see D-06)
- **D-06:** Include the `<SiteHeader>` in `BaseLayout.astro` so it appears on every page. The existing per-page hero sections on `index.astro` and `posts/index.astro` remain — the header sits above all of them.

### RSS Link in Site UI
- **D-07:** Add a visible RSS link. Placement: in the site header (alongside the dark mode toggle) OR in a site footer — agent's discretion on exact placement. Must be clearly labeled (e.g., "RSS" text link or RSS icon).

### 404 Page
- **D-08:** Create `src/pages/404.astro`. Uses `BaseLayout.astro`. Simple content: heading ("Page not found"), brief message, and a link back to the homepage. No custom illustration required.

### Dark Mode — Toggle Mechanism
- **D-09:** Toggle button in the top-right of the site header. Sun icon for light mode, moon icon for dark mode. Use inline SVG icons (no icon library dependency).
- **D-10:** Toggle sets `data-theme` attribute on `<html>` element (`"light"` or `"dark"`). CSS uses `[data-theme="dark"]` block in `global.css` for token overrides (stub already present as a comment).
- **D-11:** Preference persisted to `localStorage` under key `"theme"`.
- **D-12:** An inline `<script>` block in `BaseLayout.astro`'s `<head>` (before any CSS paint) reads `localStorage.getItem('theme')` and applies `data-theme` to `<html>` immediately — prevents flash of wrong theme on page load.

### Dark Mode — Default Behavior
- **D-13:** On first visit (no localStorage entry), default to the OS color scheme preference via `window.matchMedia('(prefers-color-scheme: dark)')`. If the OS is dark → apply `data-theme="dark"`; otherwise → `data-theme="light"`.

### Dark Mode — Color Tokens
- **D-14:** Add a `[data-theme="dark"]` block in `global.css` that overrides the existing CSS custom properties with dark palette values:
  - `--color-bg`: `slate.900` (#0F172A)
  - `--color-surface`: `slate.800` (#1E293B)
  - `--color-surface-alt`: `slate.700` (#334155)
  - `--color-border`: `slate.700` (#334155)
  - `--color-text-primary`: `slate.50` (#F8FAFC)
  - `--color-text-secondary`: `slate.400` (#94A3B8)
  - `--color-text-muted`: `slate.500` (#64748B)
  - `--color-accent`: `#818CF8` (indigo.400 — lighter for dark bg contrast)
  - `--color-accent-hover`: `#A5B4FC` (indigo.300)
  - `--color-accent-subtle`: `rgba(99,102,241,0.15)` (subtle indigo tint for dark bg)

### Agent's Discretion
- Exact SVG icon shapes for sun/moon toggle
- Whether RSS link appears in the header alongside the toggle, or in a site footer
- Exact visual styling of the header bar (height, padding, border-bottom, etc.) — must use established CSS tokens
- Whether `404.astro` uses a special layout or just the standard `BaseLayout`
- Whether to add a `<footer>` component or inline the footer content in `BaseLayout.astro`

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` — SEO-01 (`/rss.xml`) and SEO-02 (`/sitemap.xml`) are the two explicit v1 requirements for this phase.

### Config
- `astro.config.mjs` — `site: 'https://jcbmcn.com'` is already set. Required by both `@astrojs/sitemap` (automatic) and `@astrojs/rss` (`context.site`).

### CSS Architecture
- `src/styles/global.css` — All CSS tokens. Phase 5 adds a `[data-theme="dark"]` block. The comment stub `/* [data-theme="dark"] { ... } */` is already present. New header/footer components must use existing tokens.

### Layout (to modify)
- `src/layouts/BaseLayout.astro` — Add: RSS autodiscovery `<link>`, anti-flash inline script, and `<SiteHeader>` component include.

### Content Schema
- `src/content.config.ts` — Post fields available for RSS: `title`, `date`, `subtitle` (optional), `draft`. Use `getCollection('blog')` with `draft !== true` filter.

### Prior Phase Patterns
- `.planning/phases/03-core-pages-visual-design/03-CONTEXT.md` — CSS custom property architecture, indigo accent color, hybrid Tailwind + scoped style blocks.
- Copy-to-clipboard in `src/pages/posts/[slug].astro` — established pattern for inline `<script>` blocks with vanilla JS, no framework islands.

</canonical_refs>

<code_context>
## Existing Code Insights

### What Exists
- `src/layouts/BaseLayout.astro` — Renders full HTML shell. Has `<head>` with meta, fonts, favicons. No header component yet — each page manages its own heading/hero.
- `src/styles/global.css` — CSS custom properties for color tokens (light mode). Dark mode stub comment present but no actual overrides.
- `astro.config.mjs` — `site: 'https://jcbmcn.com'` set. Tailwind 4 via Vite plugin. Shiki markdown highlighting.
- `package.json` — `fuse.js`, `@tailwindcss/vite`, `@tailwindcss/typography`, `astro`, `tailwindcss` in dependencies. No RSS or sitemap packages yet.

### What Does NOT Exist Yet
- No `@astrojs/rss` package
- No `@astrojs/sitemap` integration
- No `src/pages/rss.xml.ts`
- No `src/pages/404.astro`
- No `src/components/SiteHeader.astro`
- No dark mode token block in `global.css`
- No anti-flash theme script in `BaseLayout.astro`

### Integration Points
- `BaseLayout.astro` is the central integration point for: RSS autodiscovery link, anti-flash script, and SiteHeader component.
- `astro.config.mjs` needs the sitemap integration added to its `integrations` array.
- `global.css` needs the `[data-theme="dark"]` token block.

</code_context>

<specifics>
## Specific Preferences

- Dark mode: OS preference as default on first visit, then localStorage overrides.
- Toggle button: top-right of a persistent site header on every page.
- Dark palette: standard slate inversion (slate.900 bg, slate.50 text) with indigo.400 accent for dark mode.
- 404 page: simple — heading, message, homepage link. No illustration.
- RSS link: visible somewhere in the site UI (header or footer).

</specifics>

<deferred>
## Deferred Ideas

- Open Graph / Twitter card meta tags — v2 (SEO-03 in REQUIREMENTS.md)
- JSON-LD BlogPosting structured data — v2 (SEO-04)
- WCAG AA accessibility audit — v2 (DES-02)
- Per-post canonical URL tags — v2 or later
- Per-post `<meta name="description">` — agent's discretion whether to add (low effort, not explicitly requested)

</deferred>

---

*Phase: 05-seo-polish*
*Context gathered: 2026-04-02*
