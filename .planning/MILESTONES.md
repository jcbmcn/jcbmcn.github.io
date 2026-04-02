# Milestones

## v1.0 MVP (Shipped: 2026-04-02)

**Phases completed:** 5 phases, 12 plans, 21 tasks

**Key accomplishments:**

- Astro 6 with TypeScript strict mode replaces Hugo — branded placeholder page at src/pages/index.astro, deploy workflow via withastro/action@v5, Hugo entirely removed
- CNAME in public/ (jcbmcn.com survives every build), static assets migrated from static/ to public/, Astro 6 Content Layer API blog collection with draft filtering verified
- Full Zod blog schema with 10 frontmatter fields (title, author, date, draft, tags, featuredImage, images, subtitle, fontawesome, code) replacing the 2-field stub — all optional except title, no passthrough.
- 3 real blog posts recovered verbatim from git history (44bc5d5^) into src/content/blog/ — all validate against the Phase 01 Zod schema, npm build exits 0 with all 4 posts.
- Tailwind CSS 4 + @tailwindcss/typography installed, 10-token CSS custom property system defined, BaseLayout.astro with Inter font serving as shared HTML shell for all pages
- Homepage with avatar hero, bio, and recent posts wired to PostCard; /posts/ listing page showing all published posts sorted newest-first
- Individual post pages at /posts/[slug]/ with Shiki github-dark syntax highlighting, conditional featured images, and copy-to-clipboard buttons on all code blocks
- fuse.js 7 installed and PostCard.astro updated with data-tags article attribute, button tag chips with aria-pressed, and active-state CSS for client-side filtering
- posts/index.astro rewritten with search input, tag filter bar, serialized post data, and client-side Fuse.js filter script — SRCH-01 and SRCH-02 fully satisfied
- RSS feed at /rss.xml and sitemap.xml generated at build time — SEO-01 and SEO-02 satisfied
- Dark mode toggle with anti-flash script, SiteHeader.astro on all pages, and 404.astro page — site production-ready

---
