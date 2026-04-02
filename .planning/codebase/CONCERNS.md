# Codebase Concerns

**Analysis Date:** 2026-04-01

## Tech Debt

**Pinned LoveIt Theme at a Custom Fork Commit:**
- Issue: The LoveIt theme submodule points to a fork (`https://github.com/jcbmcn/LoveIt.git`) pinned at commit `f4b0b654`, which is `v0.2.11-220-gf4b0b654`. The `go.mod` references `github.com/dillonzq/LoveIt v0.3.0` via the Hugo module system, but the actual submodule at `themes/LoveIt/` is the forked version. The upstream `dillonzq/LoveIt` repo has diverged; the fork adds one commit (`fix: fix code-header`) that hasn't been upstreamed and is unlikely to be. The original LoveIt project shows no active maintenance.
- Files: `.gitmodules`, `go.mod`, `go.sum`, `themes/LoveIt/`
- Impact: Security patches, browser compatibility fixes, and Hugo compatibility fixes from upstream will never arrive automatically. The theme is effectively frozen. As Hugo evolves (currently v0.145.0 locally vs v0.128.0 in CI), template API or rendering changes may silently break the site.
- Fix approach: Evaluate migrating to an actively maintained Hugo theme or copying theme templates locally so they can be version-controlled and updated independently.

**Hugo Version Mismatch Between Local and CI:**
- Issue: The GitHub Actions workflow (`hugo.yml`) pins Hugo at `0.128.0`. The local install is `v0.145.0`. This means local builds and CI builds run different Hugo versions. Features or behaviors available locally may not exist in CI, and deprecations in CI may not surface locally.
- Files: `.github/workflows/hugo.yml`
- Impact: Content that renders correctly locally (e.g., using newer Goldmark features or template functions) may silently fail or produce different output in production. Build warnings or errors may appear in CI that are not seen locally.
- Fix approach: Update `HUGO_VERSION` in `hugo.yml` to match the locally tested version, or pin local Hugo via `.tool-versions` / `mise`/`asdf` to ensure the two are in sync.

**Archetype Uses TOML Front Matter, Posts Use YAML:**
- Issue: `archetypes/default.md` generates front matter in TOML (`+++ ... +++`) with `draft = true` and a title using Go template syntax. All existing posts use YAML front matter (`--- ... ---`). This means `hugo new` creates files with the wrong delimiter format.
- Files: `archetypes/default.md`, `content/posts/*.md`
- Impact: Any new post created with `hugo new` will have TOML front matter, inconsistent with all existing posts. The `draft = true` default also risks accidentally publishing incomplete posts if a contributor forgets to flip it.
- Fix approach: Update `archetypes/default.md` to use YAML front matter with the standard fields used in existing posts (`title`, `date`, `author`, `draft`, `tags`, `featuredImage`).

**`content/home/home.md` Is Completely Empty:**
- Issue: `content/home/home.md` is a zero-byte file committed to the repository.
- Files: `content/home/home.md`
- Impact: Low risk currently since the home profile is driven by `hugo.toml` parameters. However, the file's presence creates ambiguity and could be confused for actual content or a configuration stub.
- Fix approach: Either populate with valid front matter documenting its role, or delete the file if it serves no purpose.

---

## Security Considerations

**Personal Email Address Exposed in hugo.toml:**
- Risk: `hugo.toml` sets `params.author.email = "jacobmcneilly15@gmail.com"`. The LoveIt theme renders this in page metadata and potentially in schema.org structured data, making it trivially scrapeable by spam bots and email harvesters.
- Files: `hugo.toml` (line 55)
- Current mitigation: None.
- Recommendations: Remove the email field entirely, replace with an obfuscated version (e.g., rendered via JavaScript), or replace with a contact form URL.

**`.DS_Store` Committed to Repository:**
- Risk: `static/.DS_Store` is tracked by git. macOS `.DS_Store` files leak directory structure metadata and can reveal local filesystem paths, project organization details, or developer machine information.
- Files: `static/.DS_Store`
- Current mitigation: `.gitignore` does not exclude `*.DS_Store` or `.DS_Store` globally.
- Recommendations: Remove `static/.DS_Store` from git tracking (`git rm --cached static/.DS_Store`), add `**/.DS_Store` to `.gitignore`, and audit git history for other `.DS_Store` files that may have been committed and removed.

**`markup.goldmark.renderer.unsafe = true` Enabled:**
- Risk: `hugo.toml` sets `unsafe = true` in the Goldmark renderer, allowing raw HTML in Markdown content. A compromised or malicious post contribution could inject arbitrary HTML including `<script>` tags.
- Files: `hugo.toml` (line 205)
- Current mitigation: The site is a single-author blog with no external contributions, so the attack surface is limited to the author's own repository access.
- Recommendations: Accept the current risk as appropriate for a personal blog, but document the setting so it is not blindly copied to multi-author sites. Consider removing if raw HTML use in posts can be replaced with Hugo shortcodes.

---

## Performance Bottlenecks

**Uncompressed Images in `static/images/blog/`:**
- Problem: Several blog images are very large and served as-is with no resizing or format conversion.
  - `static/images/blog/lenovos.png` — 1.3MB
  - `static/images/blog/robot-arm.jpg` — 1.2MB
  - `static/images/blog/thumb_drive.png` — 310KB
  - `static/images/blog/ethernet.png` — 206KB
  - `static/images/blog/powerline.png` — 188KB
  - `static/images/blog/wireless_kb.png` — 177KB
- Files: `static/images/blog/`
- Cause: Images are placed directly in `static/` and served by Hugo without any processing. Hugo's image processing pipeline (which can resize, convert to WebP, and compress) requires images to be in `assets/` or content page bundles, not `static/`.
- Improvement path: Move blog post images into [page bundles](https://gohugo.io/content-management/page-bundles/) or `assets/images/blog/` and use Hugo's `resources.Get` + `Resize`/`Process` pipeline to generate compressed WebP variants with appropriate dimensions.

**Oversized favicon.svg:**
- Problem: `static/favicon.svg` is 1.9MB, which is uncommonly large for a favicon.
- Files: `static/favicon.svg`
- Cause: The SVG likely contains embedded raster data or unoptimized paths.
- Improvement path: Optimize with `svgo` or a similar SVG optimizer. A well-optimized favicon SVG should be under 10KB.

---

## Fragile Areas

**Filename-as-Permalink with Date-Prefixed File Names:**
- Files: `content/posts/`, `hugo.toml` (line 220: `posts = ":filename"`)
- Why fragile: The permalink strategy uses `:filename` (e.g., `2025-02-13-power-automate`). The date prefix is baked into the URL but is derived from the filename, not the front matter `date` field. The talos post already demonstrates this inconsistency: the filename is `2025-08-19-talosctl-cdktf-guide.md` but the front matter date is `2025-08-28`. This means the filename date (which becomes the URL) and the displayed date diverge silently.
- Safe modification: Always keep the filename date and front matter date synchronized. Never rename a published post file — doing so breaks all existing links permanently with no redirect mechanism in place.
- Test coverage: None. No automated check exists to catch filename/date mismatches.

**No 301 Redirect Mechanism:**
- Files: `hugo.toml`, `.github/workflows/hugo.yml`
- Why fragile: GitHub Pages serves static files only. Hugo can generate alias redirect pages (HTML meta-refresh), but there is no infrastructure for proper HTTP 301 redirects. If any post is ever renamed or reorganized, inbound links (from search engines, social shares) will 404 permanently.
- Safe modification: Use Hugo's `aliases` front matter field when renaming content so that the old URL generates a redirect page. Note this is a meta-refresh, not a true 301.
- Test coverage: None.

**Theme Module Resolution Ambiguity (Submodule + Go Module Dual Path):**
- Files: `.gitmodules`, `go.mod`, `hugo.toml` (line 29: `path = "github.com/dillonzq/LoveIt"`)
- Why fragile: Hugo can resolve the LoveIt theme via two mechanisms: the `themes/LoveIt/` submodule directory OR the Go module specified in `go.mod`. The `[modules]` entry in `hugo.toml` references the upstream `github.com/dillonzq/LoveIt` path, but the submodule points to the personal fork `jcbmcn/LoveIt`. If the Go module cache takes precedence over the submodule, the local fork's fix may be silently ignored, leading to subtle rendering differences between local and CI builds.
- Safe modification: Verify with `hugo mod graph` which source is actually being used. Consider removing the submodule entirely if the Go module path is the authoritative source, or use Hugo's `replace` directive in `go.mod` to explicitly point to the fork.

---

## Missing Critical Features

**No Open Graph Image for Most Posts:**
- Problem: Only `2025-02-13-power-automate.md` declares an `images:` field for Open Graph. The other two posts (`talosctl-cdktf-guide`, `building-codeowners-simulator`) rely solely on `featuredImage` for social sharing metadata, which may not be picked up by all Open Graph consumers.
- Blocks: Rich link previews on social media platforms (LinkedIn, Slack, Twitter/X, iMessage) may show no image or a fallback for posts without explicit `images:` front matter.
- Files: `content/posts/2025-08-19-talosctl-cdktf-guide.md`, `content/posts/2025-12-28-building-codeowners-simulator.md`

**No Content About Page:**
- Problem: The About page menu item in `hugo.toml` is commented out (`# [[menu.main]]` with `url = "/about/"`). No `content/about/` or `content/about.md` file exists.
- Blocks: Site visitors have no way to learn more about the author beyond the home page subtitle and social links. The menu structure is incomplete.
- Files: `hugo.toml` (lines 47–50), `content/`

**Missing `logo.png` Referenced in SEO Config:**
- Problem: `hugo.toml` sets `images = ["/logo.png"]` as the site-wide Open Graph fallback image, but `static/logo.png` does not exist. Any page without a post-specific image will produce a broken Open Graph image URL.
- Files: `hugo.toml` (line 39), `static/`

---

## Known Bugs

**Malformed URL in Talos Post:**
- Symptoms: The link `[Getting Started guide](www.talos.dev/v1.10/introduction/getting-started/)` in the talos post is missing its `https://` scheme prefix, so Hugo renders it as a relative path link rather than an absolute external URL. Clicking the link in a browser will attempt to navigate to `https://jcbmcn.com/posts/2025-08-19-talosctl-cdktf-guide/www.talos.dev/...`, resulting in a 404.
- Files: `content/posts/2025-08-19-talosctl-cdktf-guide.md` (line 57)
- Trigger: Any reader clicking the "Getting Started guide" link.
- Workaround: None for the reader. Fix by prepending `https://` to the URL.

**Filename/Front Matter Date Mismatch in Talos Post:**
- Symptoms: The file `2025-08-19-talosctl-cdktf-guide.md` has `date: '2025-08-28'` in front matter. The URL slug is `2025-08-19-talosctl-cdktf-guide` (derived from filename per the `:filename` permalink rule), but the displayed date on the post is August 28. This creates a discrepancy between the URL and the visible date.
- Files: `content/posts/2025-08-19-talosctl-cdktf-guide.md` (line 2)
- Trigger: Visible to any reader who notices the date in the URL does not match the posted date.
- Workaround: N/A for readers. Fix by updating `date:` to `2025-08-19` to match the filename, or rename the file to `2025-08-28-talosctl-cdktf-guide.md` (note: this breaks the existing URL).

---

## Test Coverage Gaps

**No Automated Tests of Any Kind:**
- What's not tested: HTML output correctness, link validity, image reference integrity, front matter schema compliance, Open Graph metadata presence.
- Files: All of `content/`, `hugo.toml`
- Risk: Broken links, missing images, or malformed front matter can be published to production undetected. The talos post's broken URL is a real example that slipped through.
- Priority: Medium — the site is small and low-risk, but basic link checking and front matter validation would catch the categories of bugs already present.

**No Branch Protection / Preview Deploy:**
- What's not tested: Feature branches are merged to `main` without any preview environment. The `feat/new-design` branch exists remotely but there is no way to preview it before merging.
- Files: `.github/workflows/hugo.yml`
- Risk: A broken build or visual regression on a branch is only caught after merge to `main` deploys to production.
- Priority: Low for a personal blog, but `workflow_dispatch` is available for manual triggering.

---

*Concerns audit: 2026-04-01*
