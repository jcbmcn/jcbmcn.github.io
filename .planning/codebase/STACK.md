# Technology Stack

**Analysis Date:** 2026-04-01

## Languages

**Primary:**
- Markdown - All blog post content in `content/posts/`
- TOML - Site configuration in `hugo.toml`, Go module files

**Secondary:**
- Go 1.24.1 - Hugo module dependency management (`go.mod`, `go.sum`)
- HTML - Inline content supported in Markdown via `unsafe = true` renderer setting

## Runtime

**Environment:**
- Hugo Extended 0.128.0 - Static site generator (extended variant required for Sass processing)

**Package Manager:**
- Go modules (Hugo module system)
- Lockfile: `go.sum` present

## Frameworks

**Core:**
- Hugo 0.128.0 (extended) - Static site generation; config in `hugo.toml`
- LoveIt theme v0.3.0 - Site theme; loaded as Hugo module and git submodule at `themes/LoveIt/`

**Build/Dev:**
- Dart Sass - CSS processing (installed via `snap` in CI; required by LoveIt theme)
- Goldmark - Markdown renderer (Hugo built-in, configured in `hugo.toml` under `[markup.goldmark]`)
- Hugo built-in syntax highlighter (Chroma) - Code fence highlighting; configured under `[markup.highlight]`

**Testing:**
- Not applicable (static site, no application test suite)

## Key Dependencies

**Critical:**
- `github.com/dillonzq/LoveIt v0.3.0` - The only Go module dependency; provides the entire site theme including layouts, shortcodes, and styles. Managed in `go.mod` and pinned in `go.sum`. Also present as git submodule at `themes/LoveIt/` per `.gitmodules`.

## Configuration

**Environment:**
- No `.env` files required
- All site configuration in `hugo.toml` (single config file at project root)
- Key configs: `baseURL`, `theme`, `languageCode`, `params.author`, `params.social`

**Build:**
- `hugo.toml` - Main site configuration (language, pagination, markup, sitemap, permalinks, theme params)
- `go.mod` / `go.sum` - Hugo module system for theme dependency
- `.gitmodules` - Git submodule pointing to LoveIt theme repo

## Platform Requirements

**Development:**
- Hugo Extended 0.128.0+ (extended variant for Sass support)
- Git with submodule support (`git clone --recursive` or `git submodule update --init --recursive`)
- Dart Sass (for CSS compilation via LoveIt theme)

**Production:**
- GitHub Pages (static hosting)
- Build runs on `ubuntu-latest` via GitHub Actions
- Hugo Extended 0.128.0 installed from `.deb` package in CI
- Dart Sass installed via `sudo snap install dart-sass` in CI
- Node.js dependencies installed conditionally if `package-lock.json` or `npm-shrinkwrap.json` present (neither currently exists)

---

*Stack analysis: 2026-04-01*
