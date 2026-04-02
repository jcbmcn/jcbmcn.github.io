# Requirements: jcbmcn.com Personal Site Revamp

**Defined:** 2026-04-01
**Core Value:** A frictionless place for Jacob to publish technical writing: drop a Markdown file, get a polished post — no backend, no CMS, no magic.

## v1 Requirements

### Infrastructure

- [x] **INFRA-01**: Project scaffolded with Astro 6, TypeScript (strict), Tailwind CSS 4 (via Vite plugin), Shiki syntax highlighting, and Fuse.js 7
- [x] **INFRA-02**: GitHub Actions workflow deploys the static site to GitHub Pages using `withastro/action@v5` (replacing `hugo.yml`)
- [x] **INFRA-03**: `public/CNAME` file contains `jcbmcn.com` and is present in every build artifact
- [x] **INFRA-04**: Hugo workflow (`hugo.yml`) is deleted — only the new deploy workflow is active
- [x] **INFRA-05**: Posts with `draft: true` in frontmatter are excluded from production builds

### Content

- [x] **CONT-01**: A Zod-validated content schema defines frontmatter fields: `title`, `author`, `date`, `draft`, `tags`, `featuredImage` (optional), `images` (optional fallback)
- [x] **CONT-02**: All 3 existing posts are migrated from `content/posts/` to `src/content/blog/` with no changes to content
- [x] **CONT-03**: URL slugs match Hugo's `:filename` permalink pattern (e.g., `/2025-12-28-building-codeowners-simulator/`)
- [x] **CONT-04**: Frontmatter edge cases are handled: `images:` field falls back to `featuredImage:` as the canonical image source; nested `code.copy` field is ignored (copy buttons applied globally)

### Pages

- [x] **PAGE-01**: Homepage displays a personal bio/intro section and a section of recent posts (most recent N)
- [x] **PAGE-02**: Blog listing page displays all published posts
- [x] **PAGE-03**: Individual post pages render full Markdown content
- [x] **PAGE-04**: Individual post pages display featured images when present
- [x] **PAGE-05**: Individual post pages render code blocks with Shiki syntax highlighting
- [x] **PAGE-06**: Code blocks on post pages include a copy-to-clipboard button

### Search & Discovery

- [x] **SRCH-01**: Blog listing page supports filtering posts by tag
- [ ] **SRCH-02**: Blog listing page supports free-text search across post titles, tags, and excerpts via Fuse.js (with `ignoreLocation: true`)

### SEO

- [ ] **SEO-01**: RSS feed available at `/rss.xml` listing all published posts
- [ ] **SEO-02**: `sitemap.xml` generated at build time

## v2 Requirements

### Design & Accessibility

- **DES-01**: Dark mode toggle with CSS custom property architecture
- **DES-02**: WCAG AA accessibility audit pass

### SEO

- **SEO-03**: Open Graph + Twitter card meta tags per post
- **SEO-04**: JSON-LD BlogPosting structured data per post

### Extras

- **EXT-01**: Reading time estimate displayed on post cards and post pages
- **EXT-02**: Related posts suggestion at bottom of each post

## Out of Scope

| Feature | Reason |
|---------|--------|
| Backend / SSR | GitHub Pages is static only — no server execution |
| CMS or admin UI | Markdown files are the authoring surface |
| Comments system | Not requested |
| OAuth / user accounts | Public read-only site |
| Mobile app | Web only |
| Real-time features | Static hosting constraint |
| MDX (Markdown + JSX) | Not needed for existing posts; can be added later with `npx astro add mdx` |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-01 | Phase 1 | Complete |
| INFRA-02 | Phase 1 | Complete |
| INFRA-03 | Phase 1 | Complete |
| INFRA-04 | Phase 1 | Complete |
| INFRA-05 | Phase 1 | Complete |
| CONT-01 | Phase 2 | Complete |
| CONT-02 | Phase 2 | Complete |
| CONT-03 | Phase 2 | Complete |
| CONT-04 | Phase 2 | Complete |
| PAGE-01 | Phase 3 | Complete |
| PAGE-02 | Phase 3 | Complete |
| PAGE-03 | Phase 3 | Complete |
| PAGE-04 | Phase 3 | Complete |
| PAGE-05 | Phase 3 | Complete |
| PAGE-06 | Phase 3 | Complete |
| SRCH-01 | Phase 4 | Complete |
| SRCH-02 | Phase 4 | Pending |
| SEO-01 | Phase 5 | Pending |
| SEO-02 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 19 total
- Mapped to phases: 19
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-01*
*Last updated: 2026-04-01 after initial definition*
