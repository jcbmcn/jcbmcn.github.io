# Codebase Structure

**Analysis Date:** 2026-04-01

## Directory Layout

```
jcbmcn.github.io/           # Project root
├── hugo.toml               # All site configuration (theme, params, menus, markup)
├── go.mod                  # Hugo Go module manifest (declares LoveIt v0.3.0 dependency)
├── go.sum                  # Go module lockfile
├── content/                # All site content (Markdown source)
│   ├── posts/              # Blog posts — one .md file per post
│   └── home/               # Home page placeholder (empty home.md)
├── archetypes/             # Templates for `hugo new` content scaffolding
│   └── default.md          # Default front matter template
├── static/                 # Static assets copied verbatim to public/
│   ├── images/             # Site images
│   │   └── blog/           # Per-post featured images and inline images
│   ├── favicon.ico         # Favicon files (multiple formats)
│   ├── favicon-96x96.png
│   ├── favicon.svg
│   ├── apple-touch-icon.png
│   ├── site.webmanifest    # PWA manifest
│   ├── web-app-manifest-192x192.png
│   ├── web-app-manifest-512x512.png
│   └── avatar.png          # Author avatar (used on home page)
├── themes/                 # Hugo themes directory
│   └── LoveIt/             # LoveIt theme (git submodule + Go module)
├── resources/              # Hugo build cache (generated, not committed)
│   └── _gen/               # Compiled SCSS and processed image cache
├── public/                 # Generated site output (generated, not committed)
│   └── ...                 # Compiled HTML, CSS, JS, images, sitemap, RSS
├── .github/
│   └── workflows/
│       └── hugo.yml        # CI/CD: build and deploy to GitHub Pages
├── .planning/              # Project planning documents (GSD tooling)
│   └── codebase/           # Codebase analysis documents
├── .gitmodules             # Declares themes/LoveIt as a git submodule
└── .claude/                # Claude AI configuration
```

## Directory Purposes

**`content/posts/`:**
- Purpose: All blog posts as Markdown files
- Contains: One `.md` file per post with YAML front matter
- Key files: `2025-02-13-power-automate.md`, `2025-08-19-talosctl-cdktf-guide.md`, `2025-12-28-building-codeowners-simulator.md`
- Naming: `YYYY-MM-DD-slug.md` — date prefix sets publication date context; slug becomes the URL path

**`content/home/`:**
- Purpose: Hugo section for home page configuration
- Contains: `home.md` (currently empty — home page is driven entirely by `hugo.toml` `[params.home]` settings)
- Note: LoveIt theme renders the home profile and post list from config, not from this file's body

**`archetypes/`:**
- Purpose: Front matter scaffolding for new content
- Contains: `default.md` with TOML front matter (`date`, `draft = true`, auto-title from filename)
- Used by: `hugo new content/posts/YYYY-MM-DD-my-post.md`

**`static/`:**
- Purpose: Files served at their exact path — not processed by Hugo pipeline
- Contains: Favicons (`.ico`, `.png`, `.svg`), PWA manifest, avatar, blog images
- Accessed in templates as root-relative paths (e.g., `/images/blog/robot-arm.jpg`, `/avatar.png`)

**`static/images/blog/`:**
- Purpose: Featured images and inline images referenced in blog post front matter
- Contains: `.jpg`, `.png`, `.svg` images named to match their posts
- Key files: `robot-arm.jpg`, `cdktf_py_banner.png`, `codeowners-simulator.png`, `codeowners-architecture.svg`

**`themes/LoveIt/`:**
- Purpose: All HTML layout, SCSS styling, JavaScript, and shortcodes
- Contains: `layouts/` (Go templates), `assets/` (SCSS/JS), `src/` (source SCSS/JS), `i18n/` (translations), `archetypes/`
- Generated: No — this is a git submodule, version-pinned
- Committed: Submodule reference only (not full source in this repo)

**`resources/_gen/`:**
- Purpose: Hugo's build cache for SCSS compilation and image processing
- Generated: Yes
- Committed: Potentially (Hugo can commit resource cache for CI speed, but check `.gitignore`)

**`public/`:**
- Purpose: Final compiled static site
- Generated: Yes — output of `hugo` command
- Committed: No — uploaded as GitHub Actions artifact for Pages deployment

**`.github/workflows/`:**
- Purpose: CI/CD automation
- Contains: `hugo.yml` — installs Hugo 0.128.0 extended + Dart Sass, builds with `--minify`, deploys to GitHub Pages
- Triggers: Push to `main` branch

**`.planning/codebase/`:**
- Purpose: GSD tooling codebase analysis documents
- Generated: Yes (by GSD map-codebase tool)
- Committed: Yes

## Key File Locations

**Entry Points:**
- `hugo.toml`: Master configuration — start here to understand any site behavior
- `content/posts/`: All blog content — add new posts here
- `.github/workflows/hugo.yml`: Deployment pipeline definition

**Configuration:**
- `hugo.toml`: Site title, description, theme params, menus, pagination, markup settings, permalinks, sitemap
- `go.mod`: Hugo module dependencies (LoveIt theme version)
- `.gitmodules`: Git submodule configuration for `themes/LoveIt`

**Core Content:**
- `content/posts/*.md`: Individual blog posts
- `content/home/home.md`: Home section placeholder (effectively empty)
- `archetypes/default.md`: Template for `hugo new` scaffolding

**Static Assets:**
- `static/avatar.png`: Author avatar shown on home page profile
- `static/images/blog/`: Featured images referenced in post front matter `featuredImage` field

**Build Output:**
- `public/`: Generated HTML site (not source-controlled)
- `resources/_gen/`: Hugo compile cache

## Naming Conventions

**Files:**
- Blog posts: `YYYY-MM-DD-descriptive-slug.md` (e.g., `2025-02-13-power-automate.md`)
- Blog images: Match post slug or describe content (e.g., `codeowners-simulator.png`, `cdktf_py_banner.png`)
- Configuration: `hugo.toml` (TOML format, lowercase)

**Front Matter Fields (YAML):**
- `title`: Human-readable post title (string)
- `subtitle`: Optional subtitle (string)
- `author`: Author name (string)
- `date`: ISO date `YYYY-MM-DD` (string)
- `draft`: `true` or `false` (boolean)
- `tags`: Array of lowercase tag strings (e.g., `[kubernetes, terraform]`)
- `featuredImage`: Root-relative path to image (e.g., `/images/blog/codeowners-simulator.png`)
- `images`: Array of image paths for Open Graph
- `fontawesome`: `true` to enable FontAwesome icons in post (boolean)
- `code.copy`: `true` to enable copy button on code blocks (boolean, overrides global config)

**Directories:**
- Hugo standard conventions: `content/`, `static/`, `themes/`, `archetypes/`, `layouts/` (if overriding theme), `public/`
- No custom directory naming beyond Hugo conventions

## Where to Add New Code

**New Blog Post:**
- Create: `content/posts/YYYY-MM-DD-your-slug.md`
- Front matter minimum: `title`, `date`, `draft: false`
- Featured image: Add to `static/images/blog/` and reference as `featuredImage: '/images/blog/your-image.png'`
- Preview: `hugo server`

**New Static Asset (Image, Icon, etc.):**
- Add to: `static/` (root-relative access) or `static/images/blog/` for post images
- Reference in templates/content as: `/your-asset.ext`

**Site-Wide Configuration Change:**
- Edit: `hugo.toml`
- Theme params (colors, features): `[params.*]` sections
- Navigation menu items: `[[menu.main]]` blocks
- Social links: `[params.social]` section

**New Content Section (beyond posts):**
- Create directory: `content/your-section/`
- Hugo will auto-detect and create section URLs at `/your-section/`
- LoveIt theme provides default list templates; custom layouts go in `layouts/your-section/` (project-level override)

**Theme Override (template customization):**
- Create: `layouts/` directory at project root with same structure as `themes/LoveIt/layouts/`
- Hugo's lookup order: project `layouts/` takes precedence over theme layouts
- Do NOT edit files inside `themes/LoveIt/` directly (submodule)

## Special Directories

**`themes/LoveIt/`:**
- Purpose: Complete Hugo theme providing all visual templates, SCSS, JS
- Generated: No — git submodule pinned to a commit
- Committed: Submodule pointer only; full source fetched via `git submodule update --init --recursive`
- IMPORTANT: Do not edit directly; use project-level `layouts/` overrides

**`public/`:**
- Purpose: Compiled static site output
- Generated: Yes — by `hugo` command
- Committed: No — CI uploads as artifact

**`resources/_gen/`:**
- Purpose: Hugo's cache for Sass compilation and image processing
- Generated: Yes
- Committed: Potentially (speeds up CI builds; check `.gitignore` for current policy)

**`.planning/`:**
- Purpose: GSD workflow planning and codebase analysis documents
- Generated: Partially (analysis docs auto-generated by GSD tools)
- Committed: Yes

---

*Structure analysis: 2026-04-01*
