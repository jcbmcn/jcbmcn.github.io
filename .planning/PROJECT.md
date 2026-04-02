# jcbmcn.com — Personal Site Revamp

## What This Is

A personal brand and technical blog site for Jacob McNeilly, rebuilt from scratch to replace Hugo with a custom TypeScript static site. Hosted on GitHub Pages at jcbmcn.com (via Cloudflare DNS redirect), it features a homepage with bio and recent posts, a full post listing with tag filtering and free-text search, and individual post pages with syntax-highlighted code and featured images — all driven by Markdown files.

## Core Value

A frictionless place for Jacob to publish technical writing: drop a Markdown file, get a polished post — no backend, no CMS, no magic.

## Requirements

### Validated

- [x] Blog posts are authored as Markdown files with YAML frontmatter (title, author, date, draft, tags, featuredImage, code.copy, images, subtitle, fontawesome) — Validated in Phase 2: Content Layer + Migration
- [x] Existing posts in content/posts/ are migrated to the new site (all 3 posts restored verbatim with correct URL slugs) — Validated in Phase 2: Content Layer + Migration
- [x] Draft posts (draft: true) are excluded from production builds (Zod schema + getCollection filter) — Validated in Phase 2: Content Layer + Migration

### Active

- [ ] Site is built with TypeScript — no backend, pure static output deployable to GitHub Pages
- [ ] Homepage has a personal bio/intro section and a section showing recent posts
- [ ] A dedicated blog listing page shows all posts
- [ ] Tag filtering and free-text search (via Fuse.js or equivalent) work on the listing page
- [ ] Individual post pages render Markdown with syntax-highlighted code blocks and copy buttons
- [ ] Featured images are displayed on post listings and post detail pages
- [ ] GitHub Actions CI/CD builds and deploys the static site to GitHub Pages (replacing the Hugo workflow)
- [ ] Site is accessible at jcbmcn.com via existing Cloudflare DNS setup


### Out of Scope

- Backend / server-side rendering — GitHub Pages is static only
- CMS or admin interface — Markdown files are the authoring surface
- Comments system — not requested
- Mobile app — web only
- OAuth / user accounts — public read-only site

## Current State

Phase 2 complete (2026-04-02) — Content layer fully populated: Zod-validated schema with 10 frontmatter fields, all 3 real posts restored verbatim from git history, build exits 0. Ready for Phase 3: Core Pages + Visual Design.

## Context

- **Current stack:** Hugo 0.128.0 with the LoveIt theme (submodule). Config in hugo.toml. Posts in content/posts/ as Markdown with YAML frontmatter.
- **Existing posts:** Should be migrated as-is. Frontmatter format is kept (title, author, date, draft, tags, featuredImage, code.copy).
- **Hosting:** GitHub Pages, deployed from main branch. Cloudflare handles DNS → jcbmcn.com. No server-side code possible.
- **Design:** To be designed collaboratively — user wants in-depth discussion on UI direction. Personal brand first: hero/bio above the fold, posts below.
- **Codebase map:** Available at .planning/codebase/ from prior mapping of the Hugo project.

## Constraints

- **Platform**: GitHub Pages — static files only, no server execution
- **Authoring**: Markdown + YAML frontmatter is the only content input — no CMS
- **Domain**: Must resolve at jcbmcn.com — Cloudflare DNS already configured, no changes needed there
- **TypeScript**: All build tooling and any runtime code must be TypeScript
- **No Hugo**: Hugo and LoveIt theme will be removed; themes/ submodule will be deleted

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Ditch Hugo | User wants full ownership of the build pipeline and a TypeScript stack | — Pending |
| No backend | GitHub Pages constraint; keeps hosting free and simple | — Pending |
| Markdown-driven content | Low friction authoring — drop a file, get a post | — Pending |
| Fuse.js (or equivalent) for search | Client-side only constraint; Fuse.js is well-suited for small-to-medium post counts | — Pending |
| Astro vs custom Vite | User has no preference; decision deferred to research/roadmap phase | — Pending |

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
*Last updated: 2026-04-02 after Phase 2 completion*
