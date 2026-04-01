# Architecture

**Analysis Date:** 2026-04-01

## Pattern Overview

**Overall:** Static Site Generation (SSG) via Hugo

**Key Characteristics:**
- No runtime server — all HTML/CSS/JS generated at build time from Markdown + configuration
- Content-first: blog posts are plain Markdown files with YAML front matter; Hugo compiles them into static pages
- Theme-driven rendering: the LoveIt theme (imported as a Hugo Go module and git submodule) owns all templates, layouts, and SCSS
- Deployed as a pure static artifact to GitHub Pages via GitHub Actions

## Layers

**Content Layer:**
- Purpose: Raw source material for all site pages
- Location: `content/`
- Contains: Markdown files with YAML front matter (posts, home page placeholder)
- Depends on: Hugo's content model (front matter fields, section structure)
- Used by: Hugo build process to generate HTML pages

**Configuration Layer:**
- Purpose: Controls all site behavior, theme options, menus, SEO metadata, and markup rendering
- Location: `hugo.toml`
- Contains: Site-wide params, menu definitions, pagination settings, Goldmark/highlight config, sitemap config, permalinks
- Depends on: Hugo and LoveIt theme parameter contracts
- Used by: Hugo build process and LoveIt theme templates at compile time

**Theme/Template Layer:**
- Purpose: All HTML templates, partials, shortcodes, and SCSS
- Location: `themes/LoveIt/` (git submodule / Go module `github.com/dillonzq/LoveIt v0.3.0`)
- Contains: `layouts/`, `assets/`, `src/`, `i18n/`, `archetypes/`
- Depends on: Configuration values from `hugo.toml` params
- Used by: Hugo build process to render content into HTML

**Static Assets Layer:**
- Purpose: Binary and media files served verbatim (not processed by Hugo pipeline)
- Location: `static/`
- Contains: Favicons, PWA manifest, avatar image, blog post images
- Depends on: Nothing — files are copied as-is to `public/`
- Used by: Templates reference these paths directly (e.g., `/images/blog/robot-arm.jpg`)

**Build Output Layer:**
- Purpose: The fully rendered static site ready for deployment
- Location: `public/` (generated, not committed)
- Contains: Compiled HTML, CSS, JS, copied static files, sitemap, RSS feeds
- Depends on: All upstream layers
- Used by: GitHub Actions uploads this directory as the Pages artifact

**CI/CD Layer:**
- Purpose: Automated build and deployment pipeline
- Location: `.github/workflows/hugo.yml`
- Contains: Steps to install Hugo 0.128.0 (extended), Dart Sass, checkout with submodules, build, and deploy
- Depends on: `main` branch push triggers
- Used by: GitHub Pages deployment environment

## Data Flow

**Post Publication Flow:**

1. Author creates a Markdown file in `content/posts/` with YAML front matter (`title`, `date`, `tags`, `featuredImage`, `draft`)
2. Author runs `hugo server` locally to preview
3. Author commits and pushes to `main` branch
4. GitHub Actions workflow triggers: installs Hugo extended + Dart Sass, checks out with `--submodules recursive`
5. Hugo processes `content/` using `themes/LoveIt/layouts/` templates and `hugo.toml` configuration
6. Hugo outputs fully-rendered static site to `public/`
7. `actions/upload-pages-artifact` uploads `public/` as a Pages artifact
8. `actions/deploy-pages` deploys artifact to GitHub Pages at `https://jcbmcn.com/`

**Local Development Flow:**

1. `hugo server` — starts local server at `http://localhost:1313` with hot-reload
2. Edits to `content/` or `hugo.toml` are picked up and re-rendered live
3. `hugo --minify --baseURL "https://jcbmcn.com/"` — production build locally

**State Management:**
- No client-side state management; site is purely static HTML
- Hugo maintains a build cache in `resources/_gen/` (compiled SCSS, image processing cache)

## Key Abstractions

**Front Matter:**
- Purpose: Per-post metadata that drives rendering, SEO, and taxonomy
- Examples: `content/posts/2025-02-13-power-automate.md`, `content/posts/2025-08-19-talosctl-cdktf-guide.md`
- Pattern: YAML block at top of each Markdown file; fields include `title`, `date`, `author`, `draft`, `tags`, `featuredImage`, `images`, `fontawesome`, `code.copy`

**Hugo Section:**
- Purpose: Top-level content groupings that map to URL paths
- Examples: `content/posts/` → `/posts/`, `content/home/` → home page configuration
- Pattern: Directory name under `content/` becomes the URL section; LoveIt theme provides section-specific list templates

**LoveIt Theme Module:**
- Purpose: All visual rendering — templates, partials, SCSS, JS, shortcodes
- Location: `themes/LoveIt/` (also declared in `go.mod` as `github.com/dillonzq/LoveIt v0.3.0`)
- Pattern: Hugo Go module import; theme is not modified locally — all customization is via `hugo.toml` params

**Archetype:**
- Purpose: Template for new content files created with `hugo new`
- Location: `archetypes/default.md`
- Pattern: TOML front matter with `date`, `draft = true`, and auto-generated `title` from filename

**Permalink Strategy:**
- Purpose: Clean, stable post URLs
- Configuration: `hugo.toml` `[Permalinks]` section — `posts = ":filename"` (date prefix in filename becomes part of URL slug)
- Example: `2025-02-13-power-automate.md` → `/posts/2025-02-13-power-automate/`

## Entry Points

**`hugo` CLI:**
- Location: Invoked from project root
- Triggers: Manual build or CI/CD workflow
- Responsibilities: Reads `hugo.toml`, processes `content/`, applies `themes/LoveIt/` layouts, copies `static/`, writes to `public/`

**`hugo server`:**
- Location: Invoked from project root
- Triggers: Developer local preview
- Responsibilities: Same as `hugo` but serves over HTTP with live reload; uses relative base URL

**`.github/workflows/hugo.yml`:**
- Location: `.github/workflows/hugo.yml`
- Triggers: Push to `main` branch or manual `workflow_dispatch`
- Responsibilities: Full CI/CD — install toolchain, build with minification, deploy to GitHub Pages

**`content/posts/*.md`:**
- Location: `content/posts/`
- Triggers: Hugo discovers all `.md` files in this directory during build
- Responsibilities: Each file is one blog post; front matter controls metadata, body is rendered Markdown

## Error Handling

**Strategy:** Build-time error suppression for non-critical external failures

**Patterns:**
- `ignoreErrors = ["error-remote-getjson", "error-missing-instagram-accesstoken"]` in `hugo.toml` allows the build to succeed even if remote JSON fetches or Instagram tokens are unavailable
- `draft: false` in front matter controls whether a post is included in builds; drafts are excluded from production builds

## Cross-Cutting Concerns

**Theming:** Entirely delegated to `themes/LoveIt/` — dark/light mode toggle, responsive layout, syntax highlighting all come from the theme. `params.defaultTheme = "auto"` sets the default.

**SEO:** Managed via `hugo.toml` params (`title`, `description`, `images`) and per-post front matter (`images`, `featuredImage`). Hugo + LoveIt generate Open Graph, Twitter Card, and JSON-LD schema automatically.

**Syntax Highlighting:** Configured in `[markup.highlight]` — uses Hugo's built-in Chroma highlighter with `codeFences`, `lineNos`, `noClasses = false` (required by LoveIt theme for CSS-based highlight classes).

**Markdown Processing:** Goldmark with all extensions enabled (tables, footnotes, strikethrough, task lists, typographer, definition lists) and `unsafe = true` to allow raw HTML in posts.

**RSS/Sitemap:** Generated automatically by Hugo at build time; sitemap at `/sitemap.xml`, RSS per-section. Configured in `[sitemap]` and `[params.section/list/home]` rss counts.

---

*Architecture analysis: 2026-04-01*
