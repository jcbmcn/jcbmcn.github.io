# Stack Research

**Domain:** TypeScript static site / personal blog, GitHub Pages deployment
**Researched:** 2026-04-01
**Confidence:** HIGH — all recommendations verified against official documentation and live npm registry

---

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Astro** | 6.1.3 | Static site framework | Purpose-built for content-driven sites. Ships zero JS by default. Built-in TypeScript, Markdown/MDX support, Shiki syntax highlighting, image optimization, content collections with Zod schemas, and an official GitHub Actions deployment path. No competitor matches this combination for a blog. |
| **TypeScript** | Built into Astro | Language throughout | Astro configures `strict` TypeScript by default. Content collections expose fully typed frontmatter via Zod — no manual type assertions needed. |
| **Tailwind CSS** | 4.2.2 | Utility-first styling | The current standard for utility CSS. In Astro ≥5.2 it's added via `npx astro add tailwind`, which installs the `@tailwindcss/vite` Vite plugin (not `@astrojs/tailwind` — that integration is deprecated). Zero config beyond `@import "tailwindcss"`. |
| **Vite** | Bundled with Astro | Build tooling | Astro 6 uses Vite 6 internally. No separate install needed. Relevant for configuring the Tailwind Vite plugin. |

### Content & Markdown Processing

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Astro Content Collections** | Built into Astro | Markdown pipeline | `defineCollection` + `glob()` loader + Zod schema = type-safe frontmatter with zero extra dependencies. Handles draft filtering natively (`import.meta.env.PROD ? data.draft !== true : true`). Replaces manual `import.meta.glob()` patterns. |
| **@astrojs/mdx** | 5.0.3 | MDX support (optional) | Only needed if posts use JSX components inline. Plain Markdown posts don't require it. The existing Hugo posts are plain Markdown — skip for MVP, add if needed later. |
| **Zod** | Re-exported from `astro/zod` | Frontmatter validation | Bundled with Astro — import from `astro/zod`, not `zod` directly. Validates title, date, draft, tags, featuredImage at build time. |

### Syntax Highlighting

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Shiki** | 4.0.2 (via `@shikijs/transformers`) | Code block highlighting | Astro's default highlighter. TextMate grammars = VS Code–quality output. Zero runtime JavaScript — highlights at build time to inline styles. Ships dual light/dark themes via CSS variables. No stylesheet to maintain. |
| **@shikijs/transformers** | 4.0.2 | Code block features | Provides `transformerNotationFocus`, `transformerMetaHighlight` etc. for line highlighting, focus, diff annotations. Used in Astro's `<Code />` component via the `transformers` prop. |

### Search

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Fuse.js** | 7.1.0 | Client-side fuzzy search | PROJECT.md already specifies Fuse.js as the preference. Appropriate for a personal blog (tens to low hundreds of posts). Ships ~24KB minified+gzipped. Loaded only on the listing page. Fuzzy matching handles typos. No build step — fed a JSON array of post metadata (title, tags, excerpt) generated at build time by Astro. |

> **Pagefind considered but not recommended here:** Pagefind indexes the full HTML of built pages and requires running a CLI tool post-build. It excels at full-text search across thousands of pages (MDN, Godot docs). For a personal blog where Fuse.js handles the required tag filtering + title/excerpt search in a single `<script>` block, Pagefind's extra build step and prebuilt UI customization overhead outweigh its benefits.

### Deployment

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **withastro/action** | v5 | GitHub Actions CI/CD | Astro's official GitHub Action. Auto-detects package manager from lockfile. No separate build step to configure — handles install, build, and artifact upload in one step. Works with custom domains via `CNAME` in `public/`. |
| **actions/deploy-pages** | v4 | GitHub Pages deployment | Official GitHub action for Pages deployment. Used in the `deploy` job after `withastro/action` uploads the artifact. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **@tailwindcss/typography** | 0.5.19 | Prose styling for Markdown output | Apply `prose` class to the `<Content />` wrapper in post pages. Styles `<h2>`, `<p>`, `<code>`, `<blockquote>`, `<table>` etc. from rendered Markdown without hand-writing all those rules. |
| **@astrojs/sitemap** | 3.7.2 | Sitemap generation | One-line integration (`astro add sitemap`). Required for SEO at jcbmcn.com. Outputs `sitemap-index.xml` automatically from all static routes. |
| **@astrojs/rss** | (latest) | RSS feed | Standard expectation for a tech blog. Generates `/rss.xml` from content collection at build time. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| **TypeScript** (strict) | Type checking | Astro scaffolds `tsconfig.json` with `"extends": "astro/tsconfigs/strict"`. Do not downgrade to `base`. Content collections require `strictNullChecks: true`. |
| **Astro VS Code extension** | Intellisense for `.astro` files | Essential for DX. Provides component prop completion, frontmatter typing. |
| **Node.js** | Build runtime | GitHub Actions uses Node 22 by default with `withastro/action@v5`. Match locally. |

---

## Installation

```bash
# Scaffold new Astro project
npm create astro@latest -- --template blog

# Add Tailwind 4 (adds @tailwindcss/vite automatically via Astro >=5.2)
npx astro add tailwind

# Add MDX support (optional — only if posts need JSX components)
npx astro add mdx

# Add sitemap
npx astro add sitemap

# Supporting libraries
npm install @tailwindcss/typography @astrojs/rss fuse.js

# Shiki transformers (optional — only for advanced code block annotations)
npm install -D @shikijs/transformers
```

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| **Astro** | Next.js (static export) | If the site needs React throughout and might add server-side features later. Next.js static export (`output: 'export'`) works on GitHub Pages but you lose image optimization for GitHub Pages (it requires a custom loader), and all pages must be explicitly typed as static. For a blog, this is just extra friction. |
| **Astro** | Vite + custom build | If you need total build pipeline control and are comfortable writing your own Markdown pipeline with remark/rehype, routing, and image handling from scratch. Reasonable choice for learning — wrong choice for shipping. |
| **Astro** | Eleventy (11ty) | If TypeScript-first authoring is not a priority and you prefer a data-cascade mental model. Eleventy has excellent static site fundamentals but lacks Astro's built-in TypeScript DX and requires more manual wiring for syntax highlighting and image optimization. |
| **Astro** | SvelteKit (static adapter) | If Svelte is preferred for UI components. SvelteKit with `@sveltejs/adapter-static` is a legitimate alternative — but Astro's component model requires no framework commitment and is simpler for a mostly-static blog. |
| **Fuse.js** | Pagefind | When you have hundreds of posts and need full-text body search, not just title/tag/excerpt matching. Pagefind indexes rendered HTML post-build and serves chunked index files, keeping initial payload tiny even at scale. Use Pagefind if the post count grows beyond ~200 and body search becomes a requirement. |
| **Shiki** | Prism | When you need a CSS-class-based approach for runtime theme switching or a very large number of languages not in Shiki's defaults. Prism requires a separate stylesheet and adds a client-side runtime. Shiki's inline-styles approach is simpler for a static blog. |
| **Tailwind CSS** | Plain CSS / CSS Modules | When the project has a fixed design system already designed by someone else and utility classes create friction rather than speed. For greenfield where design is being built collaboratively, Tailwind's constraints are productive. |
| **Tailwind CSS** | Open Props | If you want CSS custom properties instead of utility classes. Valid aesthetic choice, not an ecosystem standard. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| **`@astrojs/tailwind`** | **Deprecated.** The old Astro Tailwind integration is for Tailwind v3 only. Using it will pull in outdated dependencies and conflict with Tailwind 4. | `@tailwindcss/vite` (installed automatically via `npx astro add tailwind` on Astro ≥5.2) |
| **`remark` / `rehype` (manual pipeline)** | Astro already runs a remark/rehype pipeline internally for Markdown. Adding a parallel custom pipeline creates double-processing and subtle conflicts. Astro exposes `remarkPlugins` / `rehypePlugins` config options if you need to extend the existing pipeline. | Astro's `markdown.remarkPlugins` / `markdown.rehypePlugins` config in `astro.config.ts` |
| **`gray-matter`** | Manual frontmatter parsing is unnecessary. Astro Content Collections parse YAML frontmatter automatically and expose it as typed data via Zod schemas. | `defineCollection` + `schema` in `src/content.config.ts` |
| **`marked` / `markdown-it`** | Standalone Markdown-to-HTML renderers are redundant — Astro already processes `.md` files. These only make sense outside Astro (e.g., a custom build script). | Astro's built-in Markdown rendering via content collections |
| **`lunr.js`** | Outdated. Not actively maintained. Larger than Fuse.js for equivalent use cases on small corpora. No TypeScript types. | Fuse.js 7.x |
| **`highlight.js`** | Runtime syntax highlighter. Adds client-side JavaScript and requires language registration. For a static blog, build-time highlighting (Shiki) produces better output with zero client cost. | Shiki (built into Astro) |
| **`gh-pages` npm package** | Manual deployment scripting is unnecessary. The official `withastro/action` handles CI/CD entirely. `gh-pages` was the pre-GitHub-Actions pattern. | `withastro/action@v5` + `actions/deploy-pages@v4` |
| **`next export` / Next.js** | Static export from Next.js on GitHub Pages requires `basePath` configuration and disables Next.js Image Optimization (requires a server). More config, less benefit vs Astro for a blog. | Astro |

---

## GitHub Pages Deployment

The correct pattern for this project (custom domain, main branch, GitHub Actions):

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
      - name: Checkout
        uses: actions/checkout@v5
      - name: Build
        uses: withastro/action@v5
        # node-version: 22 (default)
        # package-manager: auto-detected from lockfile

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v4
```

**`astro.config.ts` for custom domain** (no `base` needed when using a custom domain):

```typescript
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://jcbmcn.com',
  // No `base` — only needed for username.github.io/repo-name URLs
});
```

**`public/CNAME`** (required for custom domain persistence):

```
jcbmcn.com
```

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| `astro@6.x` | `tailwindcss@4.x` via `@tailwindcss/vite` | Do NOT use `@astrojs/tailwind` with Astro 6 — that integration targets Tailwind 3 and is deprecated. |
| `astro@6.x` | `@tailwindcss/typography@0.5.x` | Works with Tailwind 4. Import as a plugin in your CSS: `@plugin "@tailwindcss/typography"`. |
| `astro@6.x` | `shiki@4.x` | Astro 6 bundles Shiki 4 internally. Installing `shiki` separately is only needed if you need `@shikijs/transformers`. |
| `astro@6.x` | `fuse.js@7.x` | Pure client-side library. No compatibility concerns. Ship as a `<script>` island or import in a `client:load` component. |
| `astro@6.x` | `zod@4.x` | Astro re-exports Zod from `astro/zod`. Import from there, not from `zod` directly, to guarantee version alignment. |
| `@tailwindcss/typography@0.5.x` | `tailwindcss@4.x` | Compatible. The `prose` class family works as expected. Use `@plugin "@tailwindcss/typography"` in your CSS file instead of the v3 `plugins: [require('@tailwindcss/typography')]` pattern. |

---

## Stack Patterns by Variant

**If posts need MDX (inline React components in Markdown):**
- Add `@astrojs/mdx` integration: `npx astro add mdx`
- Convert `.md` posts to `.mdx` only for posts that need it
- The existing Hugo posts are plain Markdown — defer this

**If search needs full-body text matching (>200 posts):**
- Replace Fuse.js with Pagefind
- Pagefind runs post-build: `npx pagefind --site dist`
- Add to build step in `package.json`: `"build": "astro build && pagefind --site dist"`
- Pagefind serves its own UI or exposes a JS API

**If CSS-in-JS or component-scoped styles are preferred:**
- Astro supports `<style>` tags scoped per component without any configuration
- Can coexist with Tailwind — use scoped styles for structural layout, Tailwind utilities for spacing/typography

**If a UI framework (React/Preact) is needed for interactive components:**
- `npx astro add react` or `npx astro add preact` (Preact is smaller)
- Scope to islands that actually need interactivity (`client:load`, `client:visible`)
- The search widget is a good candidate — a Preact island fed the post JSON array

---

## Sources

- `https://docs.astro.build/en/guides/deploy/github/` — GitHub Pages deployment, `withastro/action@v5` workflow (HIGH confidence — official docs)
- `https://docs.astro.build/en/guides/syntax-highlighting/` — Shiki as default, dual-theme CSS variables, `<Code />` component, `@shikijs/transformers` usage (HIGH confidence — official docs)
- `https://docs.astro.build/en/guides/content-collections/` — `defineCollection`, `glob()` loader, Zod schemas, draft filtering pattern (HIGH confidence — official docs)
- `https://docs.astro.build/en/guides/styling/#tailwind` — Tailwind 4 via Vite plugin, `@astrojs/tailwind` deprecation notice (HIGH confidence — official docs)
- `https://docs.astro.build/en/guides/integrations-guide/tailwind/` — Explicit deprecation warning for `@astrojs/tailwind` (HIGH confidence — official docs)
- `https://astro.build/blog/astro-5/` — Astro 5 Content Layer, Vite 6, simplified prerendering (HIGH confidence — official release notes)
- `https://pagefind.app/` — Pagefind architecture, bandwidth characteristics, post-build indexing requirement (HIGH confidence — official docs)
- `https://shiki.style/` — Shiki v4 current, zero-runtime, TextMate grammar engine (HIGH confidence — official docs)
- `npm view astro version` → `6.1.3` (verified live)
- `npm view fuse.js version` → `7.1.0` (verified live)
- `npm view pagefind version` → `1.4.0` (verified live)
- `npm view tailwindcss version` → `4.2.2` (verified live)
- `npm view @tailwindcss/vite version` → `4.2.2` (verified live)
- `npm view @tailwindcss/typography version` → `0.5.19` (verified live)
- `npm view @astrojs/mdx version` → `5.0.3` (verified live)
- `npm view @astrojs/sitemap version` → `3.7.2` (verified live)
- `npm view shiki version` → `4.0.2` (verified live)
- `npm view @shikijs/transformers version` → `4.0.2` (verified live)
- `npm view zod version` → `4.3.6` (verified live — note: import from `astro/zod` not `zod` directly)

---

*Stack research for: TypeScript static blog / personal site, GitHub Pages*
*Researched: 2026-04-01*
