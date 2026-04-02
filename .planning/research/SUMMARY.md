# Research Summary: jcbmcn.com Personal Site Revamp

**Domain:** Personal developer blog / TypeScript static site (Hugo replacement)
**Researched:** 2026-04-01
**Overall confidence:** HIGH — stack verified against live npm registry and official docs; architecture verified against Astro official docs; pitfalls derived from existing Hugo config + official GitHub Pages docs + Fuse.js docs

---

## Executive Summary

The project replaces a Hugo 0.128.0 + LoveIt theme site with a TypeScript static site, keeping GitHub Pages as the hosting platform and Markdown as the authoring surface. The author (Jacob McNeilly) has 3 existing posts to migrate and writes about SRE, homelab, and Kubernetes. The migration must preserve existing post URLs and frontmatter fields without disruption.

**Astro 6 is the right framework for this project.** It is purpose-built for content-driven static sites, ships zero JavaScript by default, has TypeScript and Zod-schema-validated content collections built in, and provides an official GitHub Actions deployment action. No competitor matches this combination for a blog. The decision between "Astro vs. custom Vite pipeline" mentioned in PROJECT.md is resolved: Astro wins decisively.

The feature landscape for developer blogs is well-understood and not crowded. Even the most respected developer blogs (overreacted.io) are minimal. The signal from competitive analysis is clear: writing quality matters more than feature count. The MVP feature set maps directly to what PROJECT.md specifies — post listing with tag filter and Fuse.js search, syntax-highlighted posts with copy buttons, GitHub Actions CI/CD — and can be built entirely with Astro's built-in capabilities plus a small number of well-maintained libraries.

The most dangerous pitfalls are all infrastructure-level, not feature-level: the `CNAME` file being wiped on deploy, post URL patterns diverging from Hugo's `:filename` permalink config, and running both the old Hugo workflow and the new Astro workflow simultaneously. All three are easy to prevent if addressed in the first CI/CD phase before any content work begins.

---

## Key Findings

**Stack:** Astro 6 + TypeScript + Tailwind CSS 4 + Shiki (built-in) + Fuse.js 7 + withastro/action for GitHub Pages deployment.

**Architecture:** Astro Content Collections with Zod schema → static HTML pages → Fuse.js client island for search/filtering on the listing page → `search.json` static endpoint built at compile time.

**Critical pitfall:** The `CNAME` file must live in `public/` (Astro's static asset dir) and be present in the build artifact on every deploy, or GitHub Pages silently removes the custom domain and the site reverts to `jcbmcn.github.io`.

---

## Implications for Roadmap

Based on research, the suggested phase structure follows the critical path identified in ARCHITECTURE.md:

1. **Project scaffold + CI/CD** — Must be the first phase, not the last. Set up Astro, create the GitHub Actions deploy workflow (`deploy.yml`), delete the Hugo workflow (`hugo.yml`), add `public/CNAME`, and verify a working deployment to `jcbmcn.com` with a placeholder page. Nothing else should be built until deployment is confirmed working end-to-end.
   - Addresses: CI/CD requirement, custom domain continuity
   - Avoids: CNAME wipe (Pitfall 1), Hugo workflow conflict (Pitfall 9), base URL misconfiguration (Pitfall 4)

2. **Content layer + post migration** — Define the Zod schema for frontmatter (matching existing Hugo fields: title, author, date, draft, tags, featuredImage), migrate the 3 existing posts from `content/posts/` to `src/content/blog/`, and lock the URL slug derivation to match Hugo's `:filename` permalink pattern before writing any routing code.
   - Addresses: Post migration requirement, draft exclusion requirement, URL preservation
   - Avoids: Post URL mismatch (Pitfall 2), draft post leak (Pitfall 7), inline HTML breakage (Pitfall 10), featuredImage path breaks (Pitfall 3)

3. **Core page routes + visual design** — Homepage (bio + recent posts), blog listing page, individual post pages with Shiki syntax highlighting, copy buttons, and featured images. This is the bulk of visible work. Layouts and base components built here.
   - Addresses: All core feature requirements from PROJECT.md
   - Avoids: Over-engineering the pipeline (Pitfall 8) — keep build tooling minimal, use Astro idioms

4. **Search + tag filtering** — Add the `search.json` static endpoint and the Fuse.js client island to the blog listing page. Build the lean search index (title + tags + excerpt only, no full body). Configure `ignoreLocation: true`.
   - Addresses: Tag filtering and free-text search requirements
   - Avoids: Fuse.js location bug (Pitfall 5), bloated search index (Pitfall 6)

5. **SEO + accessibility polish** — Open Graph meta tags, JSON-LD BlogPosting, RSS feed, sitemap.xml, robots.txt, favicon, WCAG AA accessibility audit. These are mostly low-effort additions once the page templates exist.
   - Addresses: SEO fundamentals, accessibility requirements, RSS requirement

**Phase ordering rationale:**
- CI/CD first because every other phase depends on being able to deploy and verify; catching infrastructure issues on a placeholder page is far cheaper than on a completed site
- Content layer before routing because routes need a content schema to be meaningful
- Visual design concurrent with or immediately after routing — no separate "design phase" needed at this scale
- Search last among core features because it depends on the listing page and content layer both existing
- SEO/a11y polish last because it's additive, not structural

**Research flags for phases:**
- Phase 1 (CI/CD): LOW risk — `withastro/action@v5` is official and well-documented; main risk is CNAME (already documented)
- Phase 2 (content migration): MEDIUM risk — slug derivation from Hugo's `:filename` needs explicit testing; inline HTML in existing posts needs audit
- Phase 3 (routing + design): LOW risk — standard Astro patterns, well-documented
- Phase 4 (search): LOW risk — Fuse.js 7.x is stable; main risk is config (already documented in PITFALLS.md)
- Phase 5 (SEO/a11y): LOW risk — additive features with no architectural implications

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All package versions verified against live npm registry; Astro recommendation verified against official docs and Astro blog release notes |
| Features | HIGH | Derived from direct observation of 5 reference blogs + official standard docs (OGP, schema.org, Core Web Vitals, WCAG) |
| Architecture | HIGH | All patterns verified against Astro official documentation (content collections, GitHub Pages deploy, syntax highlighting, project structure) |
| Pitfalls | HIGH | Derived from actual project files (hugo.toml, existing posts) + official GitHub Pages + Fuse.js docs; not generic — project-specific |

---

## Gaps to Address

- **Design direction:** PROJECT.md notes "design to be discussed collaboratively." No design research was conducted — UI direction (color scheme, typography, spacing, hero treatment) is a conversation with the user, not a research output. The roadmap should include a UI discussion/design phase or checkpoint before visual implementation begins.
- **Dark mode architecture:** FEATURES.md flags dark mode as a v1.x feature, but the CSS architecture decision (CSS custom properties from day one) must be made in v1. Phase 3 should establish the color token structure even if the toggle isn't implemented until later.
- **Frontmatter edge cases:** Two of the three existing posts use `featuredImage` while one (`power-automate`) uses `images:` (a different frontmatter field). The Zod schema needs to handle this field name discrepancy gracefully. This should be resolved in Phase 2.
- **`code.copy` frontmatter field:** Existing posts have a nested `code.copy: true` field. The new build needs to decide whether to honor this per-post or apply copy buttons globally. Verify in Phase 2.

---

*Research for: jcbmcn.com personal site revamp (Hugo → Astro TypeScript migration)*
*Researched: 2026-04-01*
