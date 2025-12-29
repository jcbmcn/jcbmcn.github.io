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
