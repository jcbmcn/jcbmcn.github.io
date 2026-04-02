# Phase 5: SEO + Polish — Research

**Phase:** 05-seo-polish
**Requirements:** SEO-01, SEO-02
**Status:** Complete

---

## Summary

All technical decisions for this phase are locked in CONTEXT.md (D-01 through D-14) and UI-SPEC.md. This research documents integration details and confirms implementation approach.

---

## Standard Stack

| Concern | Library | Install |
|---------|---------|---------|
| RSS feed | `@astrojs/rss` | `npm install @astrojs/rss` |
| Sitemap | `@astrojs/sitemap` | `npx astro add sitemap` |
| Dark mode | vanilla JS + CSS custom props | no library |
| Icons | inline SVG | no library |

---

## @astrojs/rss Integration

**Install:** `npm install @astrojs/rss`

**Endpoint pattern** (`src/pages/rss.xml.ts`):

```typescript
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog', ({ data }) => data.draft !== true);
  posts.sort((a, b) => (b.data.date?.getTime() ?? 0) - (a.data.date?.getTime() ?? 0));

  return rss({
    title: 'Jacob McNeilly',
    description: 'Thoughts on SRE, Kubernetes, and building systems that actually work.',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.subtitle ?? '',
      link: `/posts/${post.id}/`,
    })),
  });
}
```

**Key facts:**
- `context.site` is `https://jcbmcn.com` — already set in `astro.config.mjs`
- Output is served at `/rss.xml` — Astro routes `.ts` endpoints by filename
- `getCollection('blog')` uses the Astro 6 Content Layer API (already in `src/content.config.ts`)
- `post.id` is the slug from the glob loader (filename without extension)
- `draft` field defaults to `false` in schema — filter `!== true` catches both `false` and `undefined`

---

## @astrojs/sitemap Integration

**Install:** `npx astro add sitemap` — this auto-updates `astro.config.mjs`

**What it does:**
- Adds `import sitemap from '@astrojs/sitemap'` to config
- Adds `sitemap()` to the `integrations` array
- At build time, generates `/sitemap-index.xml` + `/sitemap-0.xml`
- No manual route listing needed — crawls all static routes automatically

**Config after `astro add sitemap`:**
```javascript
import sitemap from '@astrojs/sitemap';
export default defineConfig({
  site: 'https://jcbmcn.com',
  integrations: [sitemap()],
  // ...
});
```

**Important:** Dynamic routes like `/posts/[slug]` are included automatically when Astro can statically enumerate them (i.e., `getStaticPaths` returns entries). The existing `[slug].astro` already uses `getStaticPaths` — sitemap will pick up all post URLs.

---

## Dark Mode: Technical Approach

**Anti-flash pattern** (critical for SSG):
The script must run synchronously in `<head>` before any CSS is applied. Inline `<script>` tags without `src` execute synchronously. Astro's `<script>` with `is:inline` runs inline without bundling.

```html
<!-- In BaseLayout.astro <head>, BEFORE font/style links -->
<script is:inline>
  (function() {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored ?? (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  })();
</script>
```

**Using IIFE** to avoid polluting global scope. `is:inline` prevents Astro from hoisting/bundling — required for anti-flash behavior.

**Toggle script** (in `SiteHeader.astro`):
Can use regular `<script>` (bundled is fine here — runs after paint). Reads `data-theme` on `<html>`, flips it, updates `localStorage`, swaps icon visibility.

**Icon swap pattern** — two `<span>` elements, one hidden at a time via `display: none` set by JS. No CSS class toggling needed — keeps the script self-contained.

---

## CSS Dark Mode Block

**Location:** `src/styles/global.css` — replace the stub comment with the real block.

**Pattern:**
```css
[data-theme="dark"] {
  --color-bg: #0F172A;
  --color-surface: #1E293B;
  --color-surface-alt: #334155;
  --color-border: #334155;
  --color-text-primary: #F8FAFC;
  --color-text-secondary: #94A3B8;
  --color-text-muted: #64748B;
  --color-accent: #818CF8;
  --color-accent-hover: #A5B4FC;
  --color-accent-subtle: rgba(99, 102, 241, 0.15);
}
```

All other styles use `var(--color-*)` — dark mode is automatic once tokens are overridden.

---

## SiteHeader Component

**Sticky positioning in Astro:**
- CSS: `position: sticky; top: 0; z-index: 10` on the `<header>` element
- No JS needed
- Works in all modern browsers

**Component file:** `src/components/SiteHeader.astro`
- Import in `BaseLayout.astro` and render above `<slot />`
- Toggle `<script>` lives in `SiteHeader.astro` itself (scoped to component)

---

## 404 Page

**Astro convention:** `src/pages/404.astro` is automatically served for 404 responses when deployed to GitHub Pages (GitHub Pages serves 404.html from the root).

**Build output:** Astro compiles `404.astro` → `dist/404.html` → deployed as `404.html` at site root.

**GitHub Pages 404 behavior:** Automatically serves `/404.html` for missing routes — no additional config needed.

---

## Don't Hand-Roll

- **RSS XML** — use `@astrojs/rss` (handles encoding, channel structure, item formatting)
- **Sitemap** — use `@astrojs/sitemap` (auto-discovers all routes, handles sitemap index format)
- **Dark mode** — no library needed; vanilla JS + CSS custom props is the right tool

## Common Pitfalls

- `is:inline` is required on the anti-flash script — without it, Astro bundles and defers the script, causing FOUC
- `context.site` may be undefined in dev without `--site` flag — use `context.site!` or add null check
- `post.id` in Content Layer API is the full path relative to the base, not just the filename — test output matches expected `/posts/{id}/` URL shape
- `npx astro add sitemap` modifies `astro.config.mjs` in place — don't also manually add the integration

---

## ## RESEARCH COMPLETE

All technical approaches confirmed. Context.md decisions D-01–D-14 are implementable as specified. Proceed to planning.
