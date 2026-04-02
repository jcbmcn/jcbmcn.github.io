# Pitfalls Research

**Domain:** TypeScript static site replacing Hugo, deployed to GitHub Pages
**Researched:** 2026-04-01
**Confidence:** HIGH

---

## Critical Pitfalls

### Pitfall 1: CNAME File Gets Wiped on Every Deploy

**What goes wrong:**
The custom domain (`jcbmcn.com`) stops working after the first deployment. GitHub Pages requires a `CNAME` file at the root of the deployed output. If the build process doesn't include this file in the output directory, GitHub Pages silently removes the custom domain setting, reverting the site to `jcbmcn.github.io`.

**Why it happens:**
When deploying via GitHub Actions to a custom workflow (not branch-based publishing), GitHub docs state the CNAME file is "ignored and not required." But when deploying from the built artifact (the common pattern), the CNAME file *must be present in the artifact*. Developers forget to copy it because the old Hugo workflow had `--baseURL` baked into CI, not a separate file.

**How to avoid:**
Place a `CNAME` file containing `jcbmcn.com` in the project's `public/` or `static/` directory (whatever maps to the build output root). The build process must copy it to `dist/`. Verify post-deploy that the file exists in the artifact before the deploy step runs.

```
# public/CNAME (or static/CNAME — whatever your static asset dir is)
jcbmcn.com
```

**Warning signs:**
- Site reverts to `jcbmcn.github.io` after the first push to `main`
- GitHub Pages "Custom domain" field in repo Settings goes blank after deploy
- Cloudflare shows DNS not resolving to the site

**Phase to address:** CI/CD phase (GitHub Actions workflow setup). Verify in the first end-to-end deploy test.

---

### Pitfall 2: Post URLs Break Due to Permalink Mismatch

**What goes wrong:**
Hugo was configured with `posts = ":filename"` in `[Permalinks]`, producing URLs like `/2025-12-28-building-codeowners-simulator/`. The new TypeScript build generates different URL patterns (e.g., `/posts/building-codeowners-simulator/` or `/posts/2025-12-28-building-codeowners-simulator/`), breaking any external links and search engine indexing.

**Why it happens:**
Developers rebuild the routing logic without first auditing what URLs Hugo was actually generating. Hugo's `:filename` pattern keeps the full filename (date prefix included) as the slug. Custom TypeScript routers tend to strip the date or nest under `/posts/`, neither of which matches the original.

**How to avoid:**
Audit the current URL structure before writing any routing code. Hugo's `Permalinks.posts = ":filename"` means the slug is the raw filename minus `.md`. The new build must produce paths like `/2025-12-28-building-codeowners-simulator/` (no `/posts/` prefix — Hugo did not add one based on the config). Implement explicit slug derivation: strip `.md`, use the full filename as the path segment.

**Warning signs:**
- Old post links from social media or search results return 404
- `sitemap.xml` shows URLs different from what Hugo was generating
- GitHub issue tracker or LinkedIn posts linking to the old site break

**Phase to address:** Content migration phase. Before any other post rendering work, confirm the exact URL pattern, write a test, and lock it.

---

### Pitfall 3: `featuredImage` Paths Break After Build

**What goes wrong:**
Posts reference images with absolute paths like `/images/blog/codeowners-simulator.png`. These resolve correctly in Hugo (which serves from the repo root) but break in the new build if the asset pipeline copies images to a different location, hash-renames them (Vite content hashing), or the base URL is wrong.

**Why it happens:**
Vite and similar bundlers default to hashing static assets for cache-busting. A path of `/images/blog/robot-arm.jpg` in frontmatter is a string — the build tool has no way to know it references an asset and cannot rewrite it. The image gets served from a hashed URL like `/assets/robot-arm.Abc123.jpg` while the frontmatter still says `/images/blog/robot-arm.jpg`.

**How to avoid:**
Two options — pick one upfront:
1. Put images in a `public/` directory that gets copied verbatim to the output root (no hashing). This is the simplest approach and matches how Hugo handled `/static/`.
2. Resolve and rewrite image paths during the build step (more complex, higher maintenance).

Option 1 is correct for this project. Place `static/images/` → copy to `dist/images/` without Vite processing. Do NOT import images from Markdown via the bundler.

**Warning signs:**
- Featured images show as broken in post listings but post content renders fine
- Browser console shows 404 for `/images/blog/*.png` or `/images/blog/*.jpg`
- Images work locally but break after deployment

**Phase to address:** Content migration / image handling phase. Establish the `public/` static copy strategy before migrating any posts.

---

### Pitfall 4: `base` URL Misconfiguration Breaks All Assets

**What goes wrong:**
This is a GitHub Pages user site (`jcbmcn.github.io` repo), so the site is served from the root `/`. If a `base` config is set (as many tutorials suggest for project sites), all internal links and asset references get double-prefixed: `/jcbmcn.github.io/posts/` instead of `/posts/`. Alternatively, if `base` is omitted on a project site, nothing works at all.

**Why it happens:**
Vite docs (and Astro docs) are explicit: `base` should be `'/'` (or omitted) for user sites (`username.github.io`) but must be `'/<repo-name>/'` for project sites. The project uses a custom domain which further eliminates the need for any base prefix. Developers blindly follow tutorials written for project sites.

**How to avoid:**
Since this is `jcbmcn.github.io` (user site) with a custom domain `jcbmcn.com`, set `base: '/'` (or omit it). Do NOT set a repo-scoped base. The Vite/Astro config `site: 'https://jcbmcn.com'` with no `base` is the correct configuration.

**Warning signs:**
- All CSS/JS assets return 404 after deployment
- Internal links navigate to `/jcbmcn.github.io/posts/something`
- The home page loads but clicking any link 404s

**Phase to address:** CI/CD and build configuration phase (first deployment).

---

### Pitfall 5: Fuse.js Default Options Miss Matches in Post Bodies

**What goes wrong:**
Fuse.js only searches the first 60 characters of each field by default (`location: 0`, `distance: 100`). On a blog where the interesting content is in the body (not just the title), this means a search for "Kubernetes" returns no results if the word appears after character 60 in the indexed content — even though the post is clearly about Kubernetes.

**Why it happens:**
Fuse.js documentation buries a TIP: "The default options only search the first 60 characters." Developers initialize Fuse with default options, test on titles (which are short), declare search working, and ship. Post body search silently fails.

**How to avoid:**
Set `ignoreLocation: true` when searching post body content. This disables the position-based scoring entirely and makes Fuse search the full text regardless of where the match appears. Also set a reasonable `threshold: 0.3` (stricter than default `0.6`) to reduce false positives when searching full-body text.

```typescript
const fuse = new Fuse(posts, {
  keys: ['title', 'tags', 'body'],
  ignoreLocation: true,      // search full content, not just first 60 chars
  threshold: 0.3,            // stricter matching for body text
  includeScore: true,
});
```

**Warning signs:**
- Title searches work, body/tag searches return zero results
- Search for a word that definitely appears in a long post returns nothing
- Works for short posts, fails for long ones

**Phase to address:** Search implementation phase.

---

### Pitfall 6: Search Index Includes Full Post Bodies, Bloating Page Load

**What goes wrong:**
The search index JSON (built at compile time, loaded at runtime) includes the full rendered HTML or raw Markdown of every post. Three posts is fine, but at 20+ posts with long technical content, this file exceeds 1–2 MB, causing noticeable load time on the blog listing page.

**Why it happens:**
It feels natural to index "everything" so search finds content anywhere. The index is built once so the cost seems invisible. But the full index must be downloaded on every visit to the listing page.

**How to avoid:**
Index only: `title`, `tags`, and a truncated `excerpt` (first 200 chars of body text). Do NOT include full post HTML or full Markdown in the search index. For a personal blog, title + tags + excerpt is sufficient. Full-body search can be a future enhancement if needed.

```typescript
// Build time: create lean search index
const searchIndex = posts.map(p => ({
  slug: p.slug,
  title: p.title,
  tags: p.tags,
  excerpt: p.body.slice(0, 200),  // truncate, do not include full body
}));
```

**Warning signs:**
- `search-index.json` exceeds 200KB
- Blog listing page has noticeable load delay on slower connections
- Lighthouse shows large network payloads

**Phase to address:** Search implementation phase. Enforce the lean index from the start — it's much harder to trim later.

---

### Pitfall 7: Draft Posts Leak Into Production Build

**What goes wrong:**
Posts with `draft: true` appear on the live site. In Hugo, draft exclusion was handled automatically (`hugo` without `--buildDrafts` omits drafts). In a custom TypeScript build, draft filtering must be implemented explicitly.

**Why it happens:**
The glob that reads Markdown files (`glob('content/posts/*.md')`) returns all files. Without an explicit filter on `draft: true` in frontmatter, all posts including drafts get processed and output as HTML.

**How to avoid:**
In the post-processing step, filter immediately after frontmatter parsing:

```typescript
const posts = allPosts.filter(p => !p.frontmatter.draft);
```

Add a CI step that asserts draft posts are absent from the build output. One grep for any draft post's slug in the `dist/` directory proves the filter works.

**Warning signs:**
- WIP posts or placeholder content appear on the live site
- Incomplete post shows up in the listing and search index
- Post with `draft: true` is accessible by direct URL

**Phase to address:** Content pipeline phase (frontmatter parsing and post collection).

---

### Pitfall 8: Over-Engineering the Build Pipeline

**What goes wrong:**
The project grows a custom Markdown pipeline with abstract plugin systems, a custom shortcode processor, a complex image transformation step, and a multi-stage build graph. Six weeks in, adding a new post requires understanding 400 lines of pipeline orchestration code. The site becomes harder to maintain than Hugo was.

**Why it happens:**
"Full ownership of the build pipeline" is the stated goal. Developers mistake "full ownership" for "maximum customization surface." Each feature gets a generalized abstraction instead of a simple solution.

**How to avoid:**
Keep the pipeline boring. Use a well-maintained Markdown-to-HTML library (`marked` or `unified/remark`) with standard plugins. Avoid writing a plugin system — write functions. The build should be: read files → parse frontmatter → render Markdown → write HTML. That's it.

Concrete limits to enforce:
- No custom plugin API (use library plugins directly)
- No build-time caching beyond what Vite provides
- No abstract "content type" system — posts are the only content type
- Build script under 200 lines

**Warning signs:**
- The build script has its own `config.ts` with plugin registration
- Adding a new post requires touching anything beyond `content/posts/`
- Build file is longer than the average post

**Phase to address:** Foundation / build tooling phase. Establish simplicity constraints before any features are built.

---

### Pitfall 9: GitHub Actions Workflow Deploys Stale Hugo Output

**What goes wrong:**
During the transition period, the old Hugo workflow is still active. Both workflows run on push to `main`. The Hugo workflow overwrites the Pages deployment with the old site, defeating all the new TypeScript work.

**Why it happens:**
Developers add the new workflow without removing or disabling the old one. Both workflows share the same `concurrency.group: "pages"` key, so one cancels or overwrites the other unpredictably.

**How to avoid:**
Delete `.github/workflows/hugo.yml` in the same commit that adds the new workflow. Do not leave the old workflow disabled — delete it. Confirm in GitHub Actions UI that only one Pages deployment workflow exists.

**Warning signs:**
- The live site shows Hugo output after the new workflow succeeded
- Two workflow runs appear in the Actions tab after each push
- GitHub Pages shows alternating deployment sources

**Phase to address:** CI/CD phase (the first task should be removing the old workflow).

---

### Pitfall 10: Inline HTML in Markdown Stops Working

**What goes wrong:**
The existing post `2025-02-13-power-automate.md` contains commented-out inline HTML (`<!-- <p align="center">...`). Hugo was configured with `markup.goldmark.renderer.unsafe = true`, allowing raw HTML in Markdown. The new Markdown renderer defaults to sanitizing HTML, causing the HTML to disappear silently or render as escaped text.

**Why it happens:**
Most modern Markdown parsers (including `marked` v5+) sanitize HTML by default as a security measure. Moving from Hugo's permissive config to a default-configured library breaks posts that relied on raw HTML.

**How to avoid:**
Audit all posts for inline HTML before choosing/configuring the Markdown renderer. For `marked`: set `{ mangle: false, headerIds: false }` and do NOT use the sanitizer. For `unified/remark-html`: pass `{ sanitize: false }`. Document this setting explicitly in the build config with a comment explaining why.

**Warning signs:**
- Post with HTML tables renders as plain text
- `<img>` or `<div>` tags appear escaped as `&lt;img&gt;` on the page
- Posts that look fine in preview break silently in production

**Phase to address:** Content migration phase. Test every existing post's rendered output, not just their frontmatter.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Include full post body in search index | Richer search | 1–5 MB index JSON, slow first load | Never — use excerpts |
| Hardcode base URL in multiple places | Simpler initially | URL breaks in local preview vs. production | Never — use one config value |
| Skip slug canonicalization (just use filename) | Trivial to implement | URL breaks if filename ever changes | Acceptable if filenames are treated as permanent |
| Bundle all posts into a single JS file | Fewer HTTP requests | Adds every post's content to the initial bundle | Never — use static JSON files |
| Use `any` for frontmatter types in TypeScript | Faster early development | Broken frontmatter produces runtime errors, not build errors | Never — define `PostFrontmatter` type and validate at build time |
| Re-use Hugo's image paths as-is | Zero migration work | Works until any image moves | Acceptable if `public/` → `dist/` copy is enforced |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| GitHub Pages custom domain | Forgetting `CNAME` in build output | Put `CNAME` in `public/` (static asset dir), never generate it dynamically |
| GitHub Pages + Cloudflare | Setting Cloudflare proxy (orange cloud) ON for the apex record | Use DNS-only (grey cloud) for GitHub Pages A records; Cloudflare proxy conflicts with GitHub's TLS |
| Fuse.js | Initializing with full post data including HTML | Build a lean index object at compile time; only pass the index to Fuse at runtime |
| `gray-matter` (YAML frontmatter parser) | Not handling the `code:` nested YAML block present in some posts | `gray-matter` parses nested YAML correctly; verify by unit-testing against actual post files |
| GitHub Actions `upload-pages-artifact` | Uploading the wrong directory (e.g., `src/` instead of `dist/`) | Always specify `path: './dist'` explicitly; add a build step that fails if `dist/` is empty |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Fuse.js index loaded on every page | All pages slow, not just blog listing | Lazy-load search assets only on the posts/search page | After 5+ posts or ~500KB index |
| Syntax highlighting at runtime (client-side) | Posts with code blocks flash unstyled then reflow | Use build-time syntax highlighting (Shiki or Prism at build time) | Immediately visible on any post with code |
| Unoptimized images in `/images/blog/` | Long page load; LCP > 4s | Convert images to WebP at build time or manually; add explicit `width`/`height` | With any image >500KB |
| Rebuilding entire site on every file change in dev | Slow local dev iteration | Use incremental builds or Vite's HMR; don't rebuild all posts when one changes | 10+ posts |

---

## "Looks Done But Isn't" Checklist

- [ ] **Draft filtering:** Post with `draft: true` is NOT accessible at its URL — verify by checking `dist/` directory for draft slugs
- [ ] **Custom domain:** Navigate to `https://jcbmcn.com/` in an incognito window after first deploy — not `jcbmcn.github.io`
- [ ] **Old post URLs:** Visit `https://jcbmcn.com/2025-12-28-building-codeowners-simulator/` — should return 200, not 404
- [ ] **Featured images:** Every post card on the listing page shows its image — check the power-automate post which uses `images:` instead of `featuredImage:`
- [ ] **Tag filtering:** Clicking a tag actually filters — verify it works without JavaScript enabled fallback (or consciously decide it requires JS)
- [ ] **Search on long post:** Search "CDKTF" finds the talosctl post (long post, keyword not in first 60 chars of body) — verifies `ignoreLocation: true`
- [ ] **Syntax highlighting:** Code blocks render with colors, not plain text — check the codeowners-simulator post which has multiple code fences
- [ ] **Copy button on code:** The codeowners-simulator and talosctl posts have `code.copy: true` — verify the copy button appears on those posts
- [ ] **GitHub Actions:** Only ONE workflow appears in the Actions tab — the old `Deploy Hugo site to Pages` workflow must be gone

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| CNAME wipe broke custom domain | LOW | Add `CNAME` file to static assets, push to main, re-enter domain in GitHub Settings |
| Post URLs broke SEO links | MEDIUM | Map old → new URLs, add redirect rules in a client-side router or 404.html redirect trick |
| Search index too large | LOW | Strip body content from index, rebuild — no data loss |
| Draft post leaked | LOW | Add draft filter, redeploy — 2-minute fix |
| Both Hugo and new workflows running | LOW | Delete old workflow file, push — one deploy cycle |
| Base URL misconfigured | LOW | Fix `base` in config, redeploy |
| Images 404 after deploy | MEDIUM | Audit build output, move images to `public/`, fix copy step |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| CNAME wipe | CI/CD setup | First end-to-end deploy reaches `jcbmcn.com` without redirect |
| Post URL mismatch | Content migration | Automated test asserts slug derivation matches Hugo output |
| Image path breaks | Content migration / build setup | Every post page renders its featured image in the build output |
| Base URL misconfiguration | CI/CD setup | Asset URLs in `dist/` start with `/` not `/jcbmcn.github.io/` |
| Fuse.js location bug | Search implementation | Search for keyword from long post body returns correct post |
| Bloated search index | Search implementation | `search-index.json` < 100KB after all 3 posts indexed |
| Draft leaking | Content pipeline | `dist/` contains no slug matching a `draft: true` post |
| Over-engineered pipeline | Foundation / build setup | Build script is a single file < 200 lines |
| Hugo workflow conflict | CI/CD setup | Only one workflow file in `.github/workflows/` |
| Inline HTML broken | Content migration | All 3 existing posts render without escaped HTML artifacts |

---

## Sources

- GitHub Pages CNAME docs: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/troubleshooting-custom-domains-and-github-pages
- GitHub Pages custom domain management: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
- Fuse.js options (location/distance TIP): https://fusejs.io/api/options.html
- Fuse.js pre-built indexing: https://fusejs.io/api/indexing.html
- Astro Hugo migration guide: https://docs.astro.build/en/guides/migrate-to-astro/from-hugo/
- Astro GitHub Pages deploy guide: https://docs.astro.build/en/guides/deploy/github/
- Vite GitHub Pages deploy guide: https://vitejs.dev/guide/static-deploy.html#github-pages
- Hugo config (actual project): `/hugo.toml` — confirms `Permalinks.posts = ":filename"` and `goldmark.renderer.unsafe = true`
- Existing post frontmatter: `content/posts/*.md` — confirms `featuredImage`, `code.copy`, `images`, `draft`, `tags` fields in use

---
*Pitfalls research for: TypeScript static site replacing Hugo, GitHub Pages, Fuse.js search*
*Researched: 2026-04-01*
