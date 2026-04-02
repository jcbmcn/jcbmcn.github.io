# jcbmcn.com — Personal Site Revamp

## What This Is

A personal brand and technical blog site for Jacob McNeilly, rebuilt from Hugo + LoveIt to an Astro 6 + TypeScript + Tailwind CSS 4 static site. Hosted on GitHub Pages at jcbmcn.com (via Cloudflare DNS redirect), it features a homepage with avatar hero and bio, a full post listing with real-time tag filtering and free-text search, individual post pages with Shiki-highlighted code and copy-to-clipboard, RSS feed, sitemap, and a dark mode toggle — all driven by Markdown files.

## Core Value

A frictionless place for Jacob to publish technical writing: drop a Markdown file, get a polished post — no backend, no CMS, no magic.

## Requirements

### Validated

- ✓ Project scaffolded with Astro 6, TypeScript (strict), Tailwind CSS 4 (via Vite plugin), Shiki syntax highlighting, and Fuse.js 7 — v1.0
- ✓ GitHub Actions workflow deploys to GitHub Pages using `withastro/action@v5`; Hugo workflow deleted — v1.0
- ✓ `public/CNAME` contains `jcbmcn.com` and survives every build — v1.0
- ✓ Draft posts (`draft: true`) are excluded from production builds via `getCollection()` filter — v1.0
- ✓ Zod-validated content schema with 10 frontmatter fields (title, author, date, draft, tags, featuredImage, images, subtitle, fontawesome, code) — v1.0
- ✓ All 3 existing posts migrated verbatim from `content/posts/` to `src/content/blog/` — v1.0
- ✓ URL slugs match Hugo `:filename` permalink pattern (e.g., `/2025-12-28-building-codeowners-simulator/`) — v1.0
- ✓ Frontmatter edge cases handled: `images:` falls back to `featuredImage:`, nested `code.copy` field ignored — v1.0
- ✓ Homepage with avatar hero, bio, social links, and section of recent posts — v1.0
- ✓ Blog listing page showing all published posts sorted newest-first — v1.0
- ✓ Individual post pages render full Markdown with Shiki github-dark syntax highlighting — v1.0
- ✓ Featured images displayed on post listing and post detail pages — v1.0
- ✓ Copy-to-clipboard button on all code blocks (client-side, no hydration island) — v1.0
- ✓ Tag filtering on blog listing page with AND logic and active-state chips — v1.0
- ✓ Free-text search on blog listing via Fuse.js 7 (`ignoreLocation: true`) — v1.0
- ✓ RSS feed at `/rss.xml` listing all published posts — v1.0
- ✓ `sitemap.xml` generated at build time via `@astrojs/sitemap` — v1.0
- ✓ Dark mode toggle in SiteHeader with anti-flash script; preference persists via localStorage — v1.0
- ✓ 404 page with link back to homepage — v1.0

### Active

(None — all v1 requirements shipped. See below for v2 candidates.)

### Out of Scope

- Backend / server-side rendering — GitHub Pages is static only
- CMS or admin interface — Markdown files are the authoring surface
- Comments system — not requested
- Mobile app — web only
- OAuth / user accounts — public read-only site
- MDX (Markdown + JSX) — not needed for existing posts; `npx astro add mdx` is straightforward if needed later

## Current State

v1.0 MVP shipped 2026-04-02. The site is live at jcbmcn.com running on Astro 6 + TypeScript + Tailwind CSS 4.

**Stack:** Astro 6, TypeScript strict, Tailwind CSS 4 (Vite plugin), Shiki (github-dark), Fuse.js 7, `@astrojs/rss`, `@astrojs/sitemap`
**Source:** ~1,200 LOC in `src/` (`.astro`, `.ts`, `.css`)
**Content:** 3 published posts, 1 test draft in `src/content/blog/`
**Deploy:** GitHub Actions → GitHub Pages (withastro/action@v5), Cloudflare DNS → jcbmcn.com

## Context

Hugo 0.128.0 + LoveIt theme fully removed. Astro 6 with Content Layer API (glob loader + Zod schema) replaces the Hugo content pipeline. All three original blog posts are migrated verbatim with correct URL slugs.

CSS architecture uses custom properties (CSS vars) for color tokens rather than Tailwind @theme — enables direct `var()` usage in component `<style>` blocks and makes dark mode a single `[data-theme="dark"]` override block.

## Constraints

- **Platform**: GitHub Pages — static files only, no server execution
- **Authoring**: Markdown + YAML frontmatter is the only content input — no CMS
- **Domain**: Must resolve at jcbmcn.com — Cloudflare DNS already configured, no changes needed
- **TypeScript**: All build tooling and any runtime code must be TypeScript

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Astro 6 over custom Vite | Research showed Astro 6 Content Layer API fits content-first sites with minimal overhead | ✓ Good — Content Layer API + Zod schema was straightforward |
| CSS custom properties for color tokens (not Tailwind @theme) | Enables direct `var()` in component `<style>` blocks; dark mode is one override block | ✓ Good — dark mode added in Phase 5 with no per-component changes |
| Fuse.js in `dependencies` (not `devDependencies`) | Needed at build time for Vite bundling in Astro script blocks | ✓ Good — resolves correctly without special config |
| npm as package manager | withastro/action@v5 auto-detects from `package-lock.json` | ✓ Good — zero CI config needed |
| `is:inline` anti-flash script before `<meta charset>` | Must run before any CSS paints to prevent dark mode flash | ✓ Good — no flash observed |
| No backend | GitHub Pages constraint; keeps hosting free and simple | ✓ Good — all features work client-side |
| Markdown-driven content | Low friction authoring — drop a file, get a post | ✓ Good — core value validated |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-02 after v1.0 milestone*
