# Requirements: jcbmcn.com Personal Site Revamp

**Defined:** 2026-04-01
**Core Value:** A frictionless place for Jacob to publish technical writing: drop a Markdown file, get a polished post — no backend, no CMS, no magic.

## v1 Requirements

### Infrastructure

- [ ] **INFRA-01**: Project scaffolded with Astro 6, TypeScript (strict), Tailwind CSS 4 (via Vite plugin), Shiki syntax highlighting, and Fuse.js 7
- [ ] **INFRA-02**: GitHub Actions workflow deploys the static site to GitHub Pages using `withastro/action@v5` (replacing `hugo.yml`)
- [ ] **INFRA-03**: `public/CNAME` file contains `jcbmcn.com` and is present in every build artifact
- [ ] **INFRA-04**: Hugo workflow (`hugo.yml`) is deleted — only the new deploy workflow is active
- [ ] **INFRA-05**: Posts with `draft: true` in frontmatter are excluded from production builds

### Content

- [ ] **CONT-01**: A Zod-validated content schema defines frontmatter fields: `title`, `author`, `date`, `draft`, `tags`, `featuredImage` (optional), `images` (optional fallback)
- [ ] **CONT-02**: All 3 existing posts are migrated from `content/posts/` to `src/content/blog/` with no changes to content
- [ ] **CONT-03**: URL slugs match Hugo's `:filename` permalink pattern (e.g., `/2025-12-28-building-codeowners-simulator/`)
- [ ] **CONT-04**: Frontmatter edge cases are handled: `images:` field falls back to `featuredImage:` as the canonical image source; nested `code.copy` field is ignored (copy buttons applied globally)

### Pages

- [ ] **PAGE-01**: Homepage displays a personal bio/intro section and a section of recent posts (most recent N)
- [ ] **PAGE-02**: Blog listing page displays all published posts
- [ ] **PAGE-03**: Individual post pages render full Markdown content
- [ ] **PAGE-04**: Individual post pages display featured images when present
- [ ] **PAGE-05**: Individual post pages render code blocks with Shiki syntax highlighting
- [ ] **PAGE-06**: Code blocks on post pages include a copy-to-clipboard button

### Search & Discovery

- [ ] **SRCH-01**: Blog listing page supports filtering posts by tag
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
| INFRA-01 | Phase 1 | Pending |
| INFRA-02 | Phase 1 | Pending |
| INFRA-03 | Phase 1 | Pending |
| INFRA-04 | Phase 1 | Pending |
| INFRA-05 | Phase 1 | Pending |
| CONT-01 | Phase 2 | Pending |
| CONT-02 | Phase 2 | Pending |
| CONT-03 | Phase 2 | Pending |
| CONT-04 | Phase 2 | Pending |
| PAGE-01 | Phase 3 | Pending |
| PAGE-02 | Phase 3 | Pending |
| PAGE-03 | Phase 3 | Pending |
| PAGE-04 | Phase 3 | Pending |
| PAGE-05 | Phase 3 | Pending |
| PAGE-06 | Phase 3 | Pending |
| SRCH-01 | Phase 4 | Pending |
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
