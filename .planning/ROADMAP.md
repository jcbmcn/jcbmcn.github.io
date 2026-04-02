# Roadmap: jcbmcn.com Personal Site Revamp

## Overview

This roadmap replaces the Hugo + LoveIt site with an Astro 6 + TypeScript + Tailwind CSS 4 static site, deployed to GitHub Pages at jcbmcn.com. Five phases follow the critical path: infrastructure first (so deployment is verified before any content is written), then content migration, then page implementation and visual design, then search/filtering, then SEO polish. Each phase delivers a self-contained, verifiable capability on a dedicated git branch.

## Git Workflow

Each phase runs on a dedicated branch named `gsd/phase-0X-<slug>`. When the phase is complete, a PR is opened against `main` for review before merging. No phase work is pushed directly to `main`.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Scaffold + CI/CD** - Astro project wired to GitHub Pages with CNAME; placeholder page live at jcbmcn.com
- [x] **Phase 2: Content Layer + Migration** - Zod-validated content schema and all 3 existing posts migrated with correct URLs (completed 2026-04-02)
- [x] **Phase 3: Core Pages + Visual Design** - All page routes implemented; visual design discussed and applied (UI design checkpoint required) (completed 2026-04-02)
- [ ] **Phase 4: Search + Tag Filtering** - Fuse.js search and tag filter working on the blog listing page
- [ ] **Phase 5: SEO + Polish** - RSS feed and sitemap live; site production-ready

## Phase Details

### Phase 1: Scaffold + CI/CD
**Goal**: A working Astro 6 project deploys successfully to jcbmcn.com via GitHub Actions — infrastructure verified before any content work begins
**Depends on**: Nothing (first phase)
**Requirements**: INFRA-01, INFRA-02, INFRA-03, INFRA-04, INFRA-05
**Success Criteria** (what must be TRUE):
  1. Visiting jcbmcn.com loads a page served from the new Astro build (not Hugo)
  2. Pushing a commit to `main` triggers the new deploy workflow and the site updates within ~2 minutes
  3. The Hugo workflow (`hugo.yml`) is gone — only one deploy workflow exists
  4. A post with `draft: true` is present in the repo but does not appear in the deployed build
  5. jcbmcn.com resolves correctly (Cloudflare DNS + CNAME file intact after deploy)
**Plans**: 2 plans

Plans:
- [x] 01-01-PLAN.md — Remove Hugo, scaffold Astro 6, create CI/CD deploy workflow
- [x] 01-02-PLAN.md — Migrate static assets to public/, create CNAME, add content collection with draft filtering

### Phase 2: Content Layer + Migration
**Goal**: All existing posts live in the new Astro content collection with validated frontmatter, correct URL slugs, and edge-case fields resolved
**Depends on**: Phase 1
**Requirements**: CONT-01, CONT-02, CONT-03, CONT-04
**Success Criteria** (what must be TRUE):
  1. All 3 existing posts are present in `src/content/blog/` and build without errors
  2. Each post URL matches the Hugo `:filename` permalink pattern (e.g., `/2025-12-28-building-codeowners-simulator/`)
  3. Posts with `featuredImage` and posts with `images:` both resolve to the same canonical image field without errors
  4. The `code.copy` frontmatter field in existing posts does not cause build or schema validation errors
**Plans**: 2 plans

Plans:
- [x] 02-01-PLAN.md — Expand Zod blog schema to full field set (title, author, date, tags, featuredImage, images, subtitle, fontawesome, code.copy)
- [x] 02-02-PLAN.md — Restore 3 posts from git history into src/content/blog/ and verify edge cases

### Phase 3: Core Pages + Visual Design
**Goal**: All page routes are implemented and the site looks like a polished personal brand — homepage with bio and recent posts, a full post listing, and individual post pages with syntax-highlighted code
**Depends on**: Phase 2
**Requirements**: PAGE-01, PAGE-02, PAGE-03, PAGE-04, PAGE-05, PAGE-06
**Success Criteria** (what must be TRUE):
  1. Homepage loads with a personal bio/intro section above the fold and a section of recent posts below
  2. Blog listing page shows all published posts (titles, dates, tags, featured images)
  3. Individual post pages render full Markdown content with Shiki-highlighted code blocks
  4. Code blocks on post pages have a working copy-to-clipboard button
  5. Featured images appear on both the post listing and individual post pages when present
**Plans**: 3 plans
**UI hint**: yes

> ⚠️ **Design checkpoint required before visual implementation.** This phase begins with an in-depth UI discussion covering: color scheme, typography, spacing, hero/bio treatment, and light-mode CSS color token architecture (to be dark-mode-ready for v2). Do not proceed to visual implementation until the design direction is agreed. Run `/gsd-discuss phase-3` or open the UI discussion with the user directly.

Plans:
- [x] 03-01-PLAN.md — Tailwind 4 install, global.css CSS tokens, BaseLayout.astro (foundation)
- [x] 03-02-PLAN.md — PostCard component, homepage hero + recent posts, /posts/ listing page
- [x] 03-03-PLAN.md — Dynamic post pages /posts/[slug]/ with featured images and copy-to-clipboard

### Phase 4: Search + Tag Filtering
**Goal**: Visitors can find posts by tag or free-text search on the blog listing page without any server-side processing
**Depends on**: Phase 3
**Requirements**: SRCH-01, SRCH-02
**Success Criteria** (what must be TRUE):
  1. Clicking a tag on the blog listing page filters the post list to only posts with that tag
  2. Typing in the search box filters posts in real time across titles, tags, and excerpts
  3. Search works correctly for terms that appear in the middle of a field (Fuse.js `ignoreLocation: true` behavior verified)
**Plans**: 2 plans

Plans:
- [x] 04-01-PLAN.md — Install Fuse.js 7 + prepare PostCard.astro (data-tags, button chips, active state CSS)
- [ ] 04-02-PLAN.md — Add search input, tag filter bar, serialized post data, and client-side filter script to posts/index.astro

### Phase 5: SEO + Polish
**Goal**: The site is production-ready — RSS feed and sitemap exist, dark mode toggle works, and there are no rough edges left
**Depends on**: Phase 4
**Requirements**: SEO-01, SEO-02
**Success Criteria** (what must be TRUE):
  1. `/rss.xml` returns a valid RSS feed listing all published posts
  2. `/sitemap.xml` is generated at build time and includes all published post URLs
  3. Dark mode toggle in site header switches between light and dark themes; preference persists across page loads
  4. A 404 page exists and links back to the homepage
**Plans**: 3 plans

Plans:
- [ ] 05-01-PLAN.md — Install @astrojs/rss + create RSS endpoint; install @astrojs/sitemap integration
- [ ] 05-02-PLAN.md — Add dark mode CSS token block to global.css; create SiteHeader.astro component
- [ ] 05-03-PLAN.md — Wire SiteHeader + anti-flash script into BaseLayout.astro; create 404.astro page

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Scaffold + CI/CD | 0/2 | Not started | - |
| 2. Content Layer + Migration | 2/2 | Complete   | 2026-04-02 |
| 3. Core Pages + Visual Design | 3/3 | Complete   | 2026-04-02 |
| 4. Search + Tag Filtering | 1/2 | In Progress|  |
| 5. SEO + Polish | 0/TBD | Not started | - |

---
*Roadmap created: 2026-04-01*
*Stack: Astro 6 + TypeScript + Tailwind CSS 4 + Shiki + Fuse.js 7*
*Brownfield: Hugo 0.128.0 + LoveIt replaced by new stack*
