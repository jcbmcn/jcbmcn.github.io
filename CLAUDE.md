# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal blog/portfolio site built with **Hugo** (a static site generator) and deployed to GitHub Pages. The site uses the LoveIt theme as a submodule and is configured for content in Markdown format.

## Key Technologies

- **Hugo 0.128.0+**: Static site generator (specified in `.github/workflows/hugo.yml`)
- **Go 1.24.1**: Hugo is built on Go (see `go.mod`)
- **LoveIt Theme**: Custom theme imported as a submodule (see `.gitmodules`)
- **GitHub Pages**: Deployed automatically via GitHub Actions on push to `main`
- **Dart Sass**: Used for CSS processing (installed in CI/CD)

## Common Development Commands

### Building the Site

```bash
hugo
```

Builds the entire site and outputs to the `public/` directory. Use this to preview changes locally.

### Previewing Changes

```bash
hugo server
```

Runs a local development server (typically at `http://localhost:1313`) with hot-reload. This is the recommended way to develop and preview changes before committing.

### Building for Production

```bash
hugo --minify --baseURL "https://jcbmcn.com/"
```

Builds the site with minification enabled and the correct base URL. This mirrors the production build done in CI/CD.

## Project Structure

### Content Organization

- **`content/posts/`**: Individual blog posts in Markdown format
- **`content/home/`**: Home page content
- **`archetypes/`**: Hugo archetypes for content templates

### Configuration

- **`hugo.toml`**: Main Hugo configuration file containing all site settings, theme options, and content rendering rules
- **`.github/workflows/hugo.yml`**: CI/CD workflow that builds and deploys the site to GitHub Pages on `main` branch push

### Theme and Assets

- **`themes/LoveIt/`**: The LoveIt theme (submodule)
- **`static/`**: Static assets (images, favicons, webmanifest, etc.)
- **`resources/`**: Hugo resource cache and compiled assets

### Build Output

- **`public/`**: Generated static site (output of `hugo` command). This is deployed to GitHub Pages.

## Important Configuration Notes

### Base URL

The site is configured for `https://jcbmcn.com/` as the base URL in `hugo.toml`. When building locally with `hugo server`, the base URL is relative. The production base URL is set during CI/CD build.

### Theme-Specific Settings

Key configurations in `hugo.toml`:

- **Default theme**: "light" or "auto" (configurable in `params.defaultTheme`)
- **Language**: English only (`languageCode = 'en-us'`, `hasCJKLanguage = false`)
- **Pagination**: 10 posts per page by default (`pagerSize = 10`)
- **Posts naming**: Uses filename only as permalink (`:filename`)
- **Table of Contents**: Enabled for posts with levels 2-6

### CI/CD Behavior

The GitHub Actions workflow (`hugo.yml`):

1. Installs Hugo 0.128.0 (via `.deb` package)
2. Installs Dart Sass for CSS processing
3. Checks out code with submodules (important for the LoveIt theme)
4. Installs Node.js dependencies if `package-lock.json` or `npm-shrinkwrap.json` exists
5. Builds with `hugo --minify` for production
6. Deploys to GitHub Pages

**Only the `main` branch triggers deployment**. Other branches can be used for draft work.

## Git Notes

- **Current branch**: `feat/codeowners-dev` (development branch)
- **Main branch**: `main` (production, triggers deployment)
- **Submodules**: The repo uses submodules (LoveIt theme). Always use `git clone --recursive` or `git submodule update --init --recursive` to get the full setup.

## Adding New Posts

1. Create a new Markdown file in `content/posts/`
2. Include front matter (YAML at the top of the file)
3. Write content in Markdown
4. Run `hugo server` to preview
5. The post will appear automatically based on the date in front matter

Posts are processed with Goldmark (Hugo's Markdown processor) which supports:
- Tables, footnotes, strikethrough, task lists
- Typographer extensions for better typography
- HTML rendering allowed via `unsafe = true` in markup config

## Build Errors and Configuration

The site is configured to ignore certain build errors in `hugo.toml`:

```toml
ignoreErrors = ["error-remote-getjson", "error-missing-instagram-accesstoken"]
```

This allows the site to build even if remote JSON calls or Instagram tokens fail.

<!-- GSD:project-start source:PROJECT.md -->
## Project

**jcbmcn.com — Personal Site Revamp**

A personal brand and technical blog site for Jacob McNeilly, rebuilt from scratch to replace Hugo with a custom TypeScript static site. Hosted on GitHub Pages at jcbmcn.com (via Cloudflare DNS redirect), it features a homepage with bio and recent posts, a full post listing with tag filtering and free-text search, and individual post pages with syntax-highlighted code and featured images — all driven by Markdown files.

**Core Value:** A frictionless place for Jacob to publish technical writing: drop a Markdown file, get a polished post — no backend, no CMS, no magic.

### Constraints

- **Platform**: GitHub Pages — static files only, no server execution
- **Authoring**: Markdown + YAML frontmatter is the only content input — no CMS
- **Domain**: Must resolve at jcbmcn.com — Cloudflare DNS already configured, no changes needed there
- **TypeScript**: All build tooling and any runtime code must be TypeScript
- **No Hugo**: Hugo and LoveIt theme will be removed; themes/ submodule will be deleted
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- Markdown - All blog post content in `content/posts/`
- TOML - Site configuration in `hugo.toml`, Go module files
- Go 1.24.1 - Hugo module dependency management (`go.mod`, `go.sum`)
- HTML - Inline content supported in Markdown via `unsafe = true` renderer setting
## Runtime
- Hugo Extended 0.128.0 - Static site generator (extended variant required for Sass processing)
- Go modules (Hugo module system)
- Lockfile: `go.sum` present
## Frameworks
- Hugo 0.128.0 (extended) - Static site generation; config in `hugo.toml`
- LoveIt theme v0.3.0 - Site theme; loaded as Hugo module and git submodule at `themes/LoveIt/`
- Dart Sass - CSS processing (installed via `snap` in CI; required by LoveIt theme)
- Goldmark - Markdown renderer (Hugo built-in, configured in `hugo.toml` under `[markup.goldmark]`)
- Hugo built-in syntax highlighter (Chroma) - Code fence highlighting; configured under `[markup.highlight]`
- Not applicable (static site, no application test suite)
## Key Dependencies
- `github.com/dillonzq/LoveIt v0.3.0` - The only Go module dependency; provides the entire site theme including layouts, shortcodes, and styles. Managed in `go.mod` and pinned in `go.sum`. Also present as git submodule at `themes/LoveIt/` per `.gitmodules`.
## Configuration
- No `.env` files required
- All site configuration in `hugo.toml` (single config file at project root)
- Key configs: `baseURL`, `theme`, `languageCode`, `params.author`, `params.social`
- `hugo.toml` - Main site configuration (language, pagination, markup, sitemap, permalinks, theme params)
- `go.mod` / `go.sum` - Hugo module system for theme dependency
- `.gitmodules` - Git submodule pointing to LoveIt theme repo
## Platform Requirements
- Hugo Extended 0.128.0+ (extended variant for Sass support)
- Git with submodule support (`git clone --recursive` or `git submodule update --init --recursive`)
- Dart Sass (for CSS compilation via LoveIt theme)
- GitHub Pages (static hosting)
- Build runs on `ubuntu-latest` via GitHub Actions
- Hugo Extended 0.128.0 installed from `.deb` package in CI
- Dart Sass installed via `sudo snap install dart-sass` in CI
- Node.js dependencies installed conditionally if `package-lock.json` or `npm-shrinkwrap.json` present (neither currently exists)
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Overview
## Content Files (Markdown)
### File Naming
- **Pattern:** `YYYY-MM-DD-slug.md` (kebab-case slug)
- **Location:** `content/posts/`
- **Examples:**
### Front Matter Format
### Draft vs Published
- `draft: false` = published post, visible on site
- `draft: true` = unpublished, only visible with `hugo server -D`
- The archetype (`archetypes/default.md`) defaults `draft = true`, so new posts start unpublished.
### Content Structure
- `##` for top-level sections (H2)
- `###` or `####` for subsections (H3/H4)
- Never use H1 (`#`) inside post body — H1 is reserved for the post title in the LoveIt theme
### Markdown Extensions
- Tables (GitHub-flavored pipe tables)
- Footnotes
- Strikethrough
- Task lists
- Typographer (smart quotes, em dashes)
- Definition lists
- Raw HTML (`unsafe = true` — HTML tags are rendered directly)
## Configuration Files
### hugo.toml
- Format: **TOML** (not YAML or JSON)
- Location: `hugo.toml` at project root
- Inline comments use `#` — comments explain non-obvious settings
- Sections follow Hugo's documented config hierarchy: `[params]`, `[menu]`, `[markup]`, `[sitemap]`, `[Permalinks]`
### GitHub Actions Workflow
- Location: `.github/workflows/hugo.yml`
- Format: YAML
- Uses pinned action versions (`actions/checkout@v4`, `actions/configure-pages@v5`, etc.)
- Hugo version pinned via env var: `HUGO_VERSION: 0.128.0`
## Image Conventions
- Blog post images: `/static/images/blog/image-name.png` → referenced as `/images/blog/image-name.png`
- Avatar: `/static/images/avatar.png`
- Logo: `/static/logo.png`
- Filenames: lowercase, hyphen-separated (e.g., `robot-arm.jpg`, `cdktf_py_banner.png`)
## Linting and Formatting
- `.eslintrc*` / `eslint.config.*`
- `.prettierrc*`
- `biome.json`
- `markdownlint` config
- `package.json` (no Node dependencies in the site repo itself)
## Comments
## Error Handling
## Adding New Posts
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Pattern Overview
- No runtime server — all HTML/CSS/JS generated at build time from Markdown + configuration
- Content-first: blog posts are plain Markdown files with YAML front matter; Hugo compiles them into static pages
- Theme-driven rendering: the LoveIt theme (imported as a Hugo Go module and git submodule) owns all templates, layouts, and SCSS
- Deployed as a pure static artifact to GitHub Pages via GitHub Actions
## Layers
- Purpose: Raw source material for all site pages
- Location: `content/`
- Contains: Markdown files with YAML front matter (posts, home page placeholder)
- Depends on: Hugo's content model (front matter fields, section structure)
- Used by: Hugo build process to generate HTML pages
- Purpose: Controls all site behavior, theme options, menus, SEO metadata, and markup rendering
- Location: `hugo.toml`
- Contains: Site-wide params, menu definitions, pagination settings, Goldmark/highlight config, sitemap config, permalinks
- Depends on: Hugo and LoveIt theme parameter contracts
- Used by: Hugo build process and LoveIt theme templates at compile time
- Purpose: All HTML templates, partials, shortcodes, and SCSS
- Location: `themes/LoveIt/` (git submodule / Go module `github.com/dillonzq/LoveIt v0.3.0`)
- Contains: `layouts/`, `assets/`, `src/`, `i18n/`, `archetypes/`
- Depends on: Configuration values from `hugo.toml` params
- Used by: Hugo build process to render content into HTML
- Purpose: Binary and media files served verbatim (not processed by Hugo pipeline)
- Location: `static/`
- Contains: Favicons, PWA manifest, avatar image, blog post images
- Depends on: Nothing — files are copied as-is to `public/`
- Used by: Templates reference these paths directly (e.g., `/images/blog/robot-arm.jpg`)
- Purpose: The fully rendered static site ready for deployment
- Location: `public/` (generated, not committed)
- Contains: Compiled HTML, CSS, JS, copied static files, sitemap, RSS feeds
- Depends on: All upstream layers
- Used by: GitHub Actions uploads this directory as the Pages artifact
- Purpose: Automated build and deployment pipeline
- Location: `.github/workflows/hugo.yml`
- Contains: Steps to install Hugo 0.128.0 (extended), Dart Sass, checkout with submodules, build, and deploy
- Depends on: `main` branch push triggers
- Used by: GitHub Pages deployment environment
## Data Flow
- No client-side state management; site is purely static HTML
- Hugo maintains a build cache in `resources/_gen/` (compiled SCSS, image processing cache)
## Key Abstractions
- Purpose: Per-post metadata that drives rendering, SEO, and taxonomy
- Examples: `content/posts/2025-02-13-power-automate.md`, `content/posts/2025-08-19-talosctl-cdktf-guide.md`
- Pattern: YAML block at top of each Markdown file; fields include `title`, `date`, `author`, `draft`, `tags`, `featuredImage`, `images`, `fontawesome`, `code.copy`
- Purpose: Top-level content groupings that map to URL paths
- Examples: `content/posts/` → `/posts/`, `content/home/` → home page configuration
- Pattern: Directory name under `content/` becomes the URL section; LoveIt theme provides section-specific list templates
- Purpose: All visual rendering — templates, partials, SCSS, JS, shortcodes
- Location: `themes/LoveIt/` (also declared in `go.mod` as `github.com/dillonzq/LoveIt v0.3.0`)
- Pattern: Hugo Go module import; theme is not modified locally — all customization is via `hugo.toml` params
- Purpose: Template for new content files created with `hugo new`
- Location: `archetypes/default.md`
- Pattern: TOML front matter with `date`, `draft = true`, and auto-generated `title` from filename
- Purpose: Clean, stable post URLs
- Configuration: `hugo.toml` `[Permalinks]` section — `posts = ":filename"` (date prefix in filename becomes part of URL slug)
- Example: `2025-02-13-power-automate.md` → `/posts/2025-02-13-power-automate/`
## Entry Points
- Location: Invoked from project root
- Triggers: Manual build or CI/CD workflow
- Responsibilities: Reads `hugo.toml`, processes `content/`, applies `themes/LoveIt/` layouts, copies `static/`, writes to `public/`
- Location: Invoked from project root
- Triggers: Developer local preview
- Responsibilities: Same as `hugo` but serves over HTTP with live reload; uses relative base URL
- Location: `.github/workflows/hugo.yml`
- Triggers: Push to `main` branch or manual `workflow_dispatch`
- Responsibilities: Full CI/CD — install toolchain, build with minification, deploy to GitHub Pages
- Location: `content/posts/`
- Triggers: Hugo discovers all `.md` files in this directory during build
- Responsibilities: Each file is one blog post; front matter controls metadata, body is rendered Markdown
## Error Handling
- `ignoreErrors = ["error-remote-getjson", "error-missing-instagram-accesstoken"]` in `hugo.toml` allows the build to succeed even if remote JSON fetches or Instagram tokens are unavailable
- `draft: false` in front matter controls whether a post is included in builds; drafts are excluded from production builds
## Cross-Cutting Concerns
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
