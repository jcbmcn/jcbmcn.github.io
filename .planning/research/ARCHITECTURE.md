# Architecture Research

**Domain:** TypeScript static blog site (Hugo replacement, GitHub Pages)
**Researched:** 2026-04-01
**Confidence:** HIGH (based on official Astro documentation)

---

## Standard Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                        CONTENT LAYER                             │
│  ┌──────────────────┐  ┌─────────────────────────────────────┐   │
│  │  src/content/    │  │  src/content.config.ts              │   │
│  │  blog/*.md       │  │  (Zod schema: title, date, tags,    │   │
│  │  (YAML frontmatter│  │   draft, featuredImage, author)    │   │
│  │   + Markdown body)│  └─────────────────────────────────────┘   │
│  └──────────────────┘                                            │
├──────────────────────────────────────────────────────────────────┤
│                        BUILD PIPELINE                            │
│  ┌──────────────┐  ┌─────────────┐  ┌────────────────────────┐  │
│  │ Content      │  │  Markdown   │  │  Search Index          │  │
│  │ Collection   │→ │  → HTML     │→ │  Generator             │  │
│  │ (glob loader)│  │  (Shiki     │  │  (search.json endpoint)│  │
│  └──────────────┘  │   highlight)│  └────────────────────────┘  │
│                    └─────────────┘                               │
├──────────────────────────────────────────────────────────────────┤
│                        UI LAYER                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ src/pages/   │  │ src/layouts/ │  │ src/components/      │   │
│  │ index.astro  │  │ BaseLayout   │  │ PostCard, TagFilter,  │   │
│  │ blog/        │  │ PostLayout   │  │ SearchBox, Header     │   │
│  │ [slug].astro │  └──────────────┘  └──────────────────────┘   │
│  └──────────────┘                                                │
├──────────────────────────────────────────────────────────────────┤
│                        SEARCH LAYER (CLIENT-SIDE)                │
│  ┌────────────────────────────┐  ┌───────────────────────────┐   │
│  │ /search.json               │  │ Fuse.js (browser bundle)  │   │
│  │ (generated at build time)  │→ │ tag filter + fuzzy search │   │
│  └────────────────────────────┘  └───────────────────────────┘   │
├──────────────────────────────────────────────────────────────────┤
│                        STATIC OUTPUT (dist/)                     │
│  index.html  blog/post-slug/index.html  search.json              │
│  CNAME       sitemap.xml               assets/*.css *.js         │
└──────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Content Collection | Define schema, validate frontmatter, provide typed API | `src/content.config.ts` with Zod schema + `glob()` loader |
| Build Pipeline | Markdown → HTML, frontmatter extraction, draft filtering | Astro built-in via `getCollection()` + `render()` |
| Syntax Highlighter | Code fence → styled HTML, zero runtime JS | Astro built-in Shiki (configured in `astro.config.mjs`) |
| Search Index Generator | Serialize post metadata to JSON at build time | `src/pages/search.json.ts` endpoint using `getCollection()` |
| Page Routes | File-system routing — each `.astro` file is a URL | `src/pages/` directory; `[slug].astro` for dynamic post routes |
| Layouts | Shared HTML shell (head, nav, footer) | `src/layouts/BaseLayout.astro`, `PostLayout.astro` |
| UI Components | PostCard, TagFilter, SearchBox — reusable UI | `src/components/` — plain Astro (or minimal TS islands for interactive parts) |
| Client Search | Tag filter + fuzzy text search in the browser | Fuse.js loaded as client island in listing page |
| Static Assets | Images, fonts, CNAME, manifest — served verbatim | `public/` directory |
| CI/CD | Build → deploy to GitHub Pages | `.github/workflows/deploy.yml` using `withastro/action@v5` |

---

## Recommended Project Structure

```
project-root/
├── public/
│   ├── CNAME                  # "jcbmcn.com" — required for custom domain
│   ├── images/                # Featured images + static images (copied verbatim)
│   │   └── blog/
│   ├── favicon.svg
│   └── robots.txt
│
├── src/
│   ├── content/
│   │   └── blog/              # One .md file per post (migrated from content/posts/)
│   │       ├── 2025-02-13-power-automate.md
│   │       └── ...
│   │
│   ├── content.config.ts      # Collection schema (Zod) — defines allowed frontmatter fields
│   │
│   ├── pages/
│   │   ├── index.astro        # Homepage: bio + recent posts
│   │   ├── blog/
│   │   │   ├── index.astro    # Blog listing: all posts, tag filter, search
│   │   │   └── [slug].astro   # Dynamic post page (getStaticPaths)
│   │   ├── tags/
│   │   │   └── [tag].astro    # Tag index page (optional, for SEO)
│   │   └── search.json.ts     # JSON endpoint — search index for Fuse.js
│   │
│   ├── layouts/
│   │   ├── BaseLayout.astro   # <html>, <head>, nav, footer — used by all pages
│   │   └── PostLayout.astro   # Blog post wrapper: featured image, title, date, tags, body
│   │
│   ├── components/
│   │   ├── PostCard.astro     # Single post card for listing and homepage
│   │   ├── TagFilter.astro    # Tag chip list (client island — interactive)
│   │   ├── SearchBox.astro    # Free-text search input (client island — Fuse.js)
│   │   ├── Header.astro       # Site nav
│   │   ├── Footer.astro       # Footer links
│   │   └── CopyButton.astro  # Code block copy button (client island)
│   │
│   └── styles/
│       └── global.css         # Base styles, Shiki dark-mode CSS variables
│
├── astro.config.mjs           # site, base, markdown.shikiConfig, integrations
├── tsconfig.json
└── package.json
```

### Structure Rationale

- **`public/CNAME`:** GitHub Pages requires a `CNAME` file in the deployed root to maintain a custom domain. It must contain exactly `jcbmcn.com` (no protocol). Astro copies `public/` verbatim into `dist/` — this is the correct place for it.
- **`src/content/blog/`:** Astro's Content Collections API uses this path convention. Existing posts migrate here from `content/posts/` with no frontmatter changes needed.
- **`src/content.config.ts`:** Single source of truth for what frontmatter fields are valid and required; Zod schema catches broken posts at build time, not at runtime.
- **`src/pages/search.json.ts`:** A static JSON endpoint — Astro builds this to `dist/search.json`. The browser fetches it once, hands it to Fuse.js.
- **`src/components/`:** Each interactive component (search, tag filter, copy button) is a self-contained Astro island. The rest are pure static Astro.
- **`src/layouts/`:** `BaseLayout` owns the `<head>` (meta tags, OG tags, CSS), `PostLayout` composes `BaseLayout` and adds post-specific markup.

---

## Architectural Patterns

### Pattern 1: Content Collections with Zod Schema

**What:** Define the `blog` collection in `src/content.config.ts` using `glob()` loader and a Zod schema matching the existing Hugo frontmatter shape.
**When to use:** Always — this is the Astro-idiomatic way to manage Markdown content since Astro v2. Schema validation catches broken posts at build time.
**Trade-offs:** Slightly more setup than raw `import.meta.glob()`, but provides TypeScript autocomplete and build-time validation for every post.

```typescript
// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    featuredImage: z.string().optional(),
  }),
});

export const collections = { blog };
```

**Draft filtering:** Use `getCollection('blog', ({ data }) => !data.draft)` in production. In dev, include drafts: `import.meta.env.PROD ? !data.draft : true`.

---

### Pattern 2: Static Paths from Collection (Dynamic Post Routes)

**What:** `[slug].astro` uses `getStaticPaths()` to enumerate all published posts at build time. Each post gets its own prerendered HTML file.
**When to use:** Every blog — this is the only way to do per-post routes in a purely static Astro site.
**Trade-offs:** Every post is a separate HTML file on disk. Fine for a personal blog at any reasonable post count.

```typescript
// src/pages/blog/[slug].astro
---
import { getCollection, render } from 'astro:content';
import PostLayout from '../../layouts/PostLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) =>
    import.meta.env.PROD ? !data.draft : true
  );
  return posts.map(post => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---
<PostLayout post={post}>
  <Content />
</PostLayout>
```

---

### Pattern 3: Build-Time Search Index as JSON Endpoint

**What:** `src/pages/search.json.ts` calls `getCollection()` and serializes post metadata (title, tags, slug, description) to a static JSON file. The browser fetches it once and passes it to Fuse.js.
**When to use:** Any static site needing client-side search. No server required — the index lives in the CDN.
**Trade-offs:** Index size grows linearly with post count. For a personal blog (< 500 posts), this is never a problem — the JSON will be a few KB at most.

```typescript
// src/pages/search.json.ts
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const index = posts.map(post => ({
    slug: post.id,
    title: post.data.title,
    tags: post.data.tags,
    date: post.data.date.toISOString(),
  }));
  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json' },
  });
};
```

---

### Pattern 4: Shiki Syntax Highlighting (Zero Runtime JS)

**What:** Astro uses Shiki by default for Markdown code fences. It renders syntax-highlighted HTML with inline `style` attributes at build time — no Prism stylesheet, no client-side highlight.js.
**When to use:** Always for a static blog — it's the default and produces smaller, faster pages than runtime highlighters.
**Trade-offs:** Theme is set once in `astro.config.mjs`. Dark/light mode switching requires Shiki's dual-theme config + CSS variables (one-time setup).

```javascript
// astro.config.mjs
export default defineConfig({
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
});
```

Note: The copy-button for code blocks requires a small client-side island (a `<script>` tag in a component) — not provided by Shiki itself.

---

### Pattern 5: Islands Architecture for Interactive UI

**What:** The listing page's tag filter and search box are the only components needing JavaScript in the browser. Everything else is static HTML. Use `client:load` directive on those components only.
**When to use:** Whenever a component needs browser JS. Keep the "hydrated" surface area as small as possible.
**Trade-offs:** Requires that the search/filter components are written as framework components (React/Svelte/Solid) or use vanilla JS via `<script>` tags in Astro components.

For a blog this size, plain Astro components with `<script>` tags (no framework) are sufficient for Fuse.js integration. No need to add React.

---

## Data Flow

### Build-Time: Markdown → Deployed HTML

```
src/content/blog/*.md
        │
        │  (Astro build: getCollection → glob loader)
        ▼
  Frontmatter parsed (YAML → typed TS object via Zod)
  Markdown body parsed (remark → hast → HTML)
  Code fences highlighted (Shiki → inline-styled HTML)
        │
        ├──→ src/pages/blog/[slug].astro
        │         getStaticPaths() returns one path per post
        │         render(post) → <Content /> component
        │         PostLayout wraps Content
        │         → dist/blog/2025-02-13-power-automate/index.html
        │
        ├──→ src/pages/index.astro
        │         getCollection() → sorted by date → first 5
        │         PostCard components rendered
        │         → dist/index.html
        │
        ├──→ src/pages/blog/index.astro
        │         getCollection() → all published posts
        │         serialized to props for client search/filter
        │         → dist/blog/index.html (with Fuse.js island)
        │
        └──→ src/pages/search.json.ts
                  getCollection() → stripped to title/tags/slug/date
                  → dist/search.json
```

### Runtime: Client-Side Search + Tag Filter

```
Browser loads dist/blog/index.html
        │
        │  (page includes all post cards, initially all visible)
        ▼
Fuse.js island hydrates (client:load)
  → fetches /search.json once
  → initializes Fuse instance with post index
        │
User types in SearchBox or clicks a tag chip
        │
        ▼
Fuse.js queries index → returns matching slugs
Tag filter intersects with Fuse results
        │
        ▼
DOM updated: non-matching PostCards hidden (CSS display:none or class toggle)
No page navigation — all filtering is in-memory, in-browser
```

### Local Dev Flow

```
pnpm dev (astro dev)
        │
        ▼
Vite dev server at http://localhost:4321
Hot-reload on any src/** or content/** change
Draft posts ARE visible in dev (filtered only in production)
```

---

## GitHub Pages Specifics

### Custom Domain Setup

GitHub Pages with a custom domain requires two things to survive redeployments:

1. **`public/CNAME` file** containing `jcbmcn.com` (no trailing newline issues, no `https://` prefix). Astro copies `public/` to `dist/` verbatim — place CNAME here, not in `src/`.
2. **`site` in `astro.config.mjs`** set to `https://jcbmcn.com` (no `base` needed since the repo deploys at the root domain, not a subdirectory path like `username.github.io/repo`).

```javascript
// astro.config.mjs
export default defineConfig({
  site: 'https://jcbmcn.com',
  // NO `base` needed — jcbmcn.com is the apex domain, not /repo-name
});
```

If `base` is set when it shouldn't be, all internal links break (they get double-prefixed).

### 404 Page for Fallback

GitHub Pages serves `404.html` for any URL it can't find. A static MPA (Multi-Page App) like Astro handles this cleanly — every post has its own `index.html`, so 404s only happen for truly missing pages. Create `src/pages/404.astro` for a branded error page.

**No SPA 404 redirect hack needed.** This hack (copying `index.html` to `404.html` and using JS to parse `?path=`) is only required for SPAs. Astro's static output is MPA — each page has its own HTML file.

### GitHub Actions CI/CD

The official `withastro/action@v5` handles the full build workflow. It auto-detects `pnpm`/`npm`/`yarn` from the lockfile, installs dependencies, builds with `astro build`, and uploads the artifact.

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: withastro/action@v5
        # node-version: 22 (default)
        # package-manager: auto-detected from lockfile

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Key difference from Hugo workflow:** No need to install Hugo, Dart Sass, or Go modules. The `withastro/action` handles Node/npm/pnpm automatically. Remove the old `hugo.yml` workflow entirely.

### GitHub Pages Settings

In the repository's Settings → Pages:
- **Source:** must be set to `GitHub Actions` (not `Deploy from a branch`)
- This is required for the `actions/deploy-pages` approach to work

---

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 1–100 posts | Current architecture handles this with no changes. Build time is under 10 seconds. |
| 100–1,000 posts | Search index (JSON) will be ~100–200 KB. Still fine to ship in full. Fuse.js performance is linear but fast at this scale. |
| 1,000+ posts | Consider paginating `getCollection()` results on the listing page. Consider a dedicated search service (Pagefind is a good static option). Build times may grow — Astro's content layer caches between builds. |

### Scaling Priorities

1. **First bottleneck:** Search index size. At ~500+ posts the JSON payload is still small, but if it approaches 1 MB consider lazy-loading it or switching to Pagefind (which generates a binary index and streams results).
2. **Second bottleneck:** Build time. Astro's content layer persists a cache between builds, so incremental builds stay fast. Not a concern for a personal blog.

---

## Anti-Patterns

### Anti-Pattern 1: Putting CNAME in `src/` or hardcoding it in the workflow

**What people do:** Add `CNAME` to `src/` where Astro processes it, or add a `cp CNAME dist/` step in the workflow.
**Why it's wrong:** Files in `src/` are processed by Astro, not copied verbatim. Depending on file type, they may be ignored or cause build errors. A workflow `cp` step is brittle and gets forgotten.
**Do this instead:** Put `CNAME` in `public/`. Astro copies everything in `public/` to `dist/` without transformation — this is exactly the right place for it.

---

### Anti-Pattern 2: Setting `base` to `/repo-name` for a custom domain

**What people do:** Follow generic GitHub Pages guides that say to set `base: '/my-repo'` in `astro.config.mjs`.
**Why it's wrong:** The `base` option is only needed when the site lives at a subdirectory URL like `username.github.io/repo-name`. With a custom domain at `jcbmcn.com`, the site lives at the root. Setting `base: '/jcbmcn.github.io'` breaks all internal links.
**Do this instead:** Set only `site: 'https://jcbmcn.com'`. Leave `base` unset (it defaults to `/`).

---

### Anti-Pattern 3: Using a React (or other framework) SPA for a content blog

**What people do:** Build the blog as a Next.js/React app and deploy to GitHub Pages using the SPA 404 hack.
**Why it's wrong:** SPAs ship large JavaScript bundles, require a 404.html redirect hack for routing, perform worse on first load, and add complexity with no benefit for a read-only blog.
**Do this instead:** Astro's MPA (Multi-Page App) output — every page is pre-rendered HTML, no runtime routing, no JS bundle overhead for navigation. Add JS only where it's actually needed (search, copy buttons).

---

### Anti-Pattern 4: Generating search index at runtime (API call)

**What people do:** Use a client-side `fetch('/api/search?q=...')` to a serverless function.
**Why it's wrong:** GitHub Pages has no server-side execution. There is no runtime to call.
**Do this instead:** Generate `search.json` at build time as an Astro static endpoint. It becomes a static file in `dist/`. Fuse.js loads it once and runs entirely in the browser.

---

### Anti-Pattern 5: Keeping Hugo workflows/submodule during migration

**What people do:** Leave `.gitmodules`, `themes/LoveIt/`, `go.mod`, `go.sum`, and `hugo.yml` in place while adding the Astro stack.
**Why it's wrong:** The Hugo submodule (`themes/LoveIt/`) is checked out recursively by `actions/checkout@v4`. Keeping it doubles checkout time and risks workflow interference. `hugo.yml` may trigger unexpectedly.
**Do this instead:** Delete `themes/` submodule, remove `.gitmodules`, delete `go.mod`/`go.sum`, and replace `hugo.yml` with `deploy.yml` in a single migration commit.

---

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| GitHub Pages | `withastro/action@v5` → `actions/deploy-pages@v4` | Pages source must be "GitHub Actions" in repo settings |
| Cloudflare DNS | No change needed | Cloudflare already points `jcbmcn.com` → GitHub Pages. CNAME file maintains the mapping after each deploy. |
| Fuse.js | Browser-only, loaded as client island | Fetch `/search.json` once, initialize on page load |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Content Layer ↔ Pages | `getCollection()` / `getEntry()` API from `astro:content` | Type-safe; schema errors surface at build time |
| Build Pipeline ↔ Search Index | `getCollection()` call inside `search.json.ts` endpoint | Both run at build time; no runtime dependency |
| PostLayout ↔ Content | `<Content />` component from `render(post)` | Renders Markdown + Shiki-highlighted code to HTML |
| Listing Page ↔ Search | `/search.json` fetched client-side by Fuse.js island | Decoupled — search island is an optional enhancement |

---

## Suggested Build Order

The phase dependency chain flows from foundation to features:

1. **Project scaffold + CI/CD** — Must exist before anything else. Set up Astro, configure GitHub Pages, verify deployment pipeline with a hello-world page. Unblocks all subsequent phases.

2. **Content layer** — Define the Zod schema, migrate existing posts from `content/posts/` to `src/content/blog/`. This must exist before any page can render real content.

3. **Core page routes** — Homepage, post detail page (`[slug].astro`), blog listing page. These require the content layer. Layouts and base components are built here.

4. **Syntax highlighting + copy buttons** — Shiki config is set in `astro.config.mjs` (no dependencies beyond step 1). Copy buttons are a small client island added to `PostLayout`. Can be done as part of step 3.

5. **Search + tag filtering** — Requires the content layer (to generate `search.json`) and the listing page (to mount the Fuse.js island). Build this after step 3.

6. **Visual design** — Independent of data flow; can be done in parallel with or after step 3. Depends on having rendered pages to style.

**Critical path:** Scaffold → Content layer → Post routes → Search/filter.

---

## Sources

- Astro official docs: Content Collections — https://docs.astro.build/en/guides/content-collections/
- Astro official docs: Deploy to GitHub Pages — https://docs.astro.build/en/guides/deploy/github/
- Astro official docs: Project Structure — https://docs.astro.build/en/basics/project-structure/
- Astro official docs: Syntax Highlighting (Shiki) — https://docs.astro.build/en/guides/syntax-highlighting/
- Astro official docs: Migrating from Hugo — https://docs.astro.build/en/guides/migrate-to-astro/from-hugo/
- Existing codebase mapping: `.planning/codebase/ARCHITECTURE.md`, `.planning/codebase/INTEGRATIONS.md`

---

*Architecture research for: TypeScript static blog — Hugo replacement, GitHub Pages*
*Researched: 2026-04-01*
