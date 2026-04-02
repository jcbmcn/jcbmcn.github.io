# Coding Conventions

**Analysis Date:** 2026-04-01

## Overview

This is a Hugo static site generator project. There is no application code (TypeScript, JavaScript, Python, etc.) in the repository itself. All "code" consists of Hugo configuration (TOML), Markdown content files, and GitHub Actions YAML. The LoveIt theme (a Go/Hugo module) lives in `themes/LoveIt/` as a submodule and is not modified.

## Content Files (Markdown)

### File Naming

- **Pattern:** `YYYY-MM-DD-slug.md` (kebab-case slug)
- **Location:** `content/posts/`
- **Examples:**
  - `content/posts/2025-02-13-power-automate.md`
  - `content/posts/2025-08-19-talosctl-cdktf-guide.md`
  - `content/posts/2025-12-28-building-codeowners-simulator.md`

The date prefix is part of the filename but the permalink strips it — `hugo.toml` uses `:filename` as the posts permalink pattern, so the full filename (date + slug) becomes the URL slug.

### Front Matter Format

All posts use **YAML front matter** (delimited by `---`). Do not use TOML front matter (delimited by `+++`) for posts — the archetype default uses TOML but all actual posts use YAML.

**Required fields:**
```yaml
---
title: 'Post Title'
author: 'Jacob McNeilly'
date: 'YYYY-MM-DD'
draft: false
tags: [tag1, tag2, tag3]
featuredImage: '/images/blog/image-name.png'
---
```

**Optional fields observed in use:**
```yaml
subtitle: "A subtitle string"          # adds subtitle display
images: ['/images/blog/image.jpg']     # Open Graph image override
fontawesome: true                       # enables Font Awesome icons in post
code:
    copy: true                          # enables copy button on code blocks
```

**Tags:** Lowercase, multi-word tags are space-separated (not hyphenated) within the tag string: `[microsoft, power automate, kubernetes]`.

### Draft vs Published

- `draft: false` = published post, visible on site
- `draft: true` = unpublished, only visible with `hugo server -D`
- The archetype (`archetypes/default.md`) defaults `draft = true`, so new posts start unpublished.

### Content Structure

Posts follow a clear heading hierarchy:
- `##` for top-level sections (H2)
- `###` or `####` for subsections (H3/H4)
- Never use H1 (`#`) inside post body — H1 is reserved for the post title in the LoveIt theme

Code blocks use fenced syntax with explicit language tags:
```
```python
# code here
```
```

Supported code block languages observed: `python`, `sh`, `bash`, `yaml`, `json`, `typescript`, `mermaid`

### Markdown Extensions

Enabled via `hugo.toml` `[markup.goldmark]` config:
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

**No linting or formatting tooling is configured.** There is no:
- `.eslintrc*` / `eslint.config.*`
- `.prettierrc*`
- `biome.json`
- `markdownlint` config
- `package.json` (no Node dependencies in the site repo itself)

Formatting is enforced by author convention only.

## Comments

Comments appear in `hugo.toml` to explain non-obvious settings. Commented-out menu items (`[[menu.main]]` for About) are left in place with `#` prefixes as documentation of future intent.

HTML comments appear in one post (`2025-02-13-power-automate.md`) to disable a banner image block — this is the only example of commented-out content in posts.

## Error Handling

Hugo build errors for specific known-failing operations are suppressed in `hugo.toml`:
```toml
ignoreErrors = ["error-remote-getjson", "error-missing-instagram-accesstoken"]
```

This prevents remote JSON fetch failures and missing Instagram tokens from blocking builds.

## Adding New Posts

1. Create `content/posts/YYYY-MM-DD-your-slug.md`
2. Use YAML front matter (see required fields above)
3. Set `draft: false` when ready to publish
4. Place images in `static/images/blog/`
5. Reference images as `/images/blog/filename.ext` (no `/static` prefix)
6. Start body content with `##` headings (not `#`)
7. Run `hugo server` to preview before committing

---

*Convention analysis: 2026-04-01*
