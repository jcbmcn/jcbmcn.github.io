# Feature Research

**Domain:** Personal developer blog / static site
**Researched:** 2026-04-01
**Confidence:** HIGH

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete or broken.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Readable post pages | Core product — the writing itself | LOW | Proper typography, line length ~65ch, line height ~1.6, comfortable font size |
| Syntax-highlighted code blocks | Tech audience reads code; unformatted code is unusable | LOW | Shiki is current gold standard (build-time, zero bundle cost, VS Code-quality highlighting) |
| Copy button on code blocks | Every developer blog does this; readers copy snippets constantly | LOW | Requires minimal JS; clipboard API. Already in existing Hugo config (`code.copy`) |
| Post metadata (date, author, tags) | Readers want to know if content is current and relevant | LOW | Date displayed prominently; tags link to filtered views |
| Mobile-responsive layout | >50% of web traffic is mobile; unresponsive = unusable | MEDIUM | Code blocks need horizontal scroll, not wrapping |
| Post listing page | Entry point for returning readers and newcomers browsing content | LOW | All posts, reverse-chronological, with date and brief description |
| Homepage with bio | Personal brand site — who is this person? | LOW | Name, photo/avatar, short description, links to social profiles |
| Featured images on post cards | Every major blog platform shows them; establishes visual identity | LOW | Already in frontmatter (`featuredImage`); displayed in listing and post header |
| Tag filtering | Discovery mechanism; readers want posts on specific topics | LOW-MEDIUM | Client-side filter by tag. Required per PROJECT.md |
| Free-text search | Readers look for specific content; tag browsing alone is insufficient | MEDIUM | Client-side only (static constraint); Fuse.js is well-suited for ~10-50 posts |
| Open Graph / Twitter Card metadata | Posts shared on social media look broken without og:image, og:title, og:description | LOW | Per OGP standard: og:title, og:description, og:image, og:type="article" are required |
| RSS feed | Developer audience uses RSS readers (Feedly, NetNewsWire, etc.); Kent, Josh, Robin all have RSS | LOW | Standard RSS 2.0 or Atom; all posts, full content or excerpt |
| `sitemap.xml` + `robots.txt` | Expected by search engines; existing Hugo config generates both | LOW | GitHub Pages static deployment; no server needed |
| Favicon | Site feels unfinished without one | LOW | SVG favicon is modern standard; PNG fallback for older browsers |
| Draft post exclusion | Author expects draft posts never appear in production | LOW | `draft: true` frontmatter flag; excluded at build time. Required per PROJECT.md |
| Accessible markup | WCAG AA is baseline; developers expect clean HTML | MEDIUM | Semantic headings, alt text on images, skip link, focus styles, adequate color contrast |
| Page `<title>` and `<meta description>` | Basic SEO and browser tab usability | LOW | Unique per page; title from frontmatter; description from excerpt or frontmatter |
| Internal navigation (nav bar) | Users need to move between home, posts, and any other sections | LOW | Header nav: Home, Posts (Blog). Minimal — no mega menus |

---

### Differentiators (Competitive Advantage)

Features that set the site apart. Not required, but memorable when present.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Dark/light mode toggle | Developer audience expects this; Josh, Kent both have it; reduces eye strain | LOW-MEDIUM | `prefers-color-scheme` media query for default; toggle persists in `localStorage`; CSS custom properties make this clean |
| Estimated read time | Helps readers decide whether to read now or save for later | LOW | Word count / 200 wpm; display on post cards and post header |
| Table of contents (in-post) | Long technical posts benefit enormously from ToC; existing Hugo config enables this | LOW-MEDIUM | Build-time from heading structure (h2–h6); sticky sidebar on desktop; collapsible on mobile |
| Syntax highlighting language label | Shows "typescript", "bash", etc. on code blocks; already in Hugo config (`language = true`) | LOW | Display language identifier on code block header |
| Line numbers in code blocks | Expected in technical tutorials; already in Hugo config (`lineNos = true`) | LOW | Optional per-block (some short snippets look better without) |
| Social profile links in bio | Connects readers to GitHub, LinkedIn, etc.; existing Hugo config has GitHub + LinkedIn | LOW | Footer or bio section: GitHub, LinkedIn at minimum |
| `og:image` auto-generation using featured image | Rich link previews in Slack, Twitter, LinkedIn; makes posts shareable | LOW | Use `featuredImage` frontmatter as og:image; fallback to site default |
| JSON-LD structured data (`BlogPosting`) | Google rich results; author attribution in search | LOW | schema.org/BlogPosting with headline, datePublished, author, image, keywords. HIGH signal for search |
| `rel="canonical"` on all pages | Prevents duplicate content SEO issues during any future domain changes | LOW | One line per page template; set to the page's own URL |
| Persistent search state in URL | Sharing a filtered/searched URL shows the same results; `?q=kubernetes&tag=homelab` | MEDIUM | URL params updated on search/filter; parsed on load |
| Code block line highlighting | Calling out specific lines in a code example is pedagogically valuable (Josh Comeau does this with Shiki) | MEDIUM | Shiki supports this via meta strings; e.g., ` ```ts {2,5-7}` |
| Keyboard-accessible search | Power users and accessibility both benefit | LOW | Search input focusable via `/` or standard tab navigation |

---

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem appealing but should be deliberately excluded.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Comments system | Engagement, community feeling | Requires moderation, spam, GDPR compliance, backend or third-party JS (Disqus bloats performance); explicitly out of scope per PROJECT.md | Link to social profile (GitHub, LinkedIn, X) for discussion; readers can share posts and discuss there |
| Newsletter subscription | Keep audience engaged, build list | Requires email backend, third-party service (Mailchimp, ConvertKit), GDPR/CAN-SPAM, form handling — all impossible on static GitHub Pages without an external service | RSS feed covers the "follow new posts" use case with zero complexity |
| Analytics (client-side JS trackers) | Know who reads what | Google Analytics adds ~50kb of JS, GDPR consent banner required in EU, privacy-conscious devs block it; adds complexity | GitHub Pages + Cloudflare analytics are server-side (no JS, no cookies); acceptable low-friction alternative if desired later |
| Like / reaction buttons | Social proof, engagement | Requires persistent state → backend/database; impossible on GitHub Pages static site | View count (Cloudflare analytics) if ever needed; don't simulate social features on a static site |
| Pagination (server-side or JS-heavy) | Handle large post counts | For ~10-50 posts, full listing with client-side search/filter is simpler and faster than pagination. Pagination adds navigation complexity and breaks search | Show all posts on listing page; add simple "load more" only if post count exceeds ~100 |
| Tag pages (separate URLs per tag) | SEO, dedicated tag archives | Generates dozens of static pages for few posts; adds build complexity with no meaningful benefit at this scale | Client-side tag filtering on the listing page covers this perfectly |
| Author pages | Multi-author blogs need these | Single-author site — Jacob McNeilly is the only author | Bio section on homepage is sufficient; author field in frontmatter is metadata only |
| Multilingual / i18n | Reach wider audience | Jacob writes in English; i18n adds massive template complexity | Single language; `lang="en"` in HTML |
| Related posts section | Encourage further reading | Requires similarity algorithm or manual curation; at 3–10 posts this is trivial; at 20+ it's still low value vs. complexity | Tag filtering serves discovery purpose; add after 50+ posts if desired |
| Search-as-you-type with server | Real-time search UX | GitHub Pages is static — no server. Algolia/Typesense require external paid services for this scale | Fuse.js on the client handles up to ~200 posts comfortably with no backend |
| Dark mode automatic-only (no toggle) | Simpler to implement | Respects OS setting but denies user agency; developers often want manual control | Implement `prefers-color-scheme` as default but expose a toggle |
| Infinite scroll | Modern UX pattern | For a blog with few posts, adds JS complexity and breaks browser history; pagination is actually better UX for blogrolls | Simple full listing at this scale; add pagination only if 100+ posts |

---

## Feature Dependencies

```
[Post listing page]
    └──requires──> [Post metadata (date, tags)]
    └──requires──> [Featured images]

[Tag filtering]
    └──requires──> [Post listing page]
    └──requires──> [Post metadata (tags)]

[Free-text search]
    └──requires──> [Post listing page]
    └──enhances──> [Tag filtering] (combined filter+search on same page)

[Persistent search state in URL]
    └──requires──> [Free-text search]
    └──requires──> [Tag filtering]

[Dark/light toggle]
    └──enhances──> [Reading experience] (requires CSS custom properties architecture)

[Table of contents]
    └──requires──> [Individual post pages]
    └──requires──> [Heading structure in Markdown]

[Code block copy button]
    └──requires──> [Syntax-highlighted code blocks]

[Code block line highlighting]
    └──requires──> [Syntax-highlighted code blocks with Shiki]

[og:image (featured image)]
    └──requires──> [Featured images in frontmatter]

[JSON-LD BlogPosting]
    └──requires──> [Post metadata (date, author, tags)]
    └──requires──> [Featured images] (for image property)

[RSS feed]
    └──requires──> [Post metadata (date, title, description)]
    └──requires──> [Draft post exclusion]

[Read time estimate]
    └──requires──> [Post content at build time] (word count)

[Syntax highlighting language label]
    └──requires──> [Syntax-highlighted code blocks]

[Line numbers]
    └──requires──> [Syntax-highlighted code blocks]
```

### Dependency Notes

- **Tag filtering requires post listing page:** Tag filtering is a UI behavior on top of the post listing; they ship together.
- **Search enhances tag filtering:** Both operate on the same post index on the listing page; combining them is a single feature surface.
- **Dark/light toggle requires CSS custom properties:** Architecture decision — if CSS variables are used for colors from day one, dark mode is a clean addition. If hardcoded colors are used, retrofitting is painful.
- **JSON-LD requires post metadata + images:** All fields must exist in frontmatter to emit valid structured data. Missing `featuredImage` → omit `image` field from JSON-LD (graceful degradation).
- **Code block features chain on Shiki:** Copy button, language label, line highlighting all build on top of the syntax highlighter. Choose Shiki first (confirmed: Josh Comeau 2024, zero-bundle-cost, build-time highlighting).

---

## MVP Definition

### Launch With (v1)

Minimum viable product — what's needed for the site to feel complete and polished as a personal blog.

- [x] **Homepage with bio + avatar** — personal brand; first impression; links to GitHub/LinkedIn
- [x] **Post listing page** — reverse-chronological, with date, tags, and featured image per post
- [x] **Tag filtering (client-side)** — required per PROJECT.md; ships with listing page
- [x] **Free-text search (Fuse.js)** — required per PROJECT.md; ships with listing page
- [x] **Individual post pages** — Markdown rendered with syntax highlighting (Shiki), copy button, line numbers
- [x] **Featured images** — displayed on listing cards and post header
- [x] **Draft post exclusion** — `draft: true` excluded at build time
- [x] **Responsive layout** — mobile-first; code blocks scroll horizontally
- [x] **Open Graph / meta tags** — og:title, og:description, og:image per page
- [x] **RSS feed** — `feed.xml`; all published posts
- [x] **Favicon** — SVG with PNG fallback
- [x] **sitemap.xml + robots.txt** — search engine fundamentals
- [x] **Accessible markup** — semantic headings, alt text, skip link, focus styles, WCAG AA color contrast
- [x] **Migrate existing posts** — 3 posts from `content/posts/`

### Add After Validation (v1.x)

Features to add once the core is working and getting traffic.

- [ ] **Dark/light mode toggle** — High value, low risk to add; triggers need for CSS custom properties foundation to be correct in v1
- [ ] **Table of contents** — Valuable for long technical posts; add when posts get longer
- [ ] **JSON-LD structured data** — SEO enhancement; add when SEO matters (after content exists)
- [ ] **Read time estimate** — Nice-to-have; one calculated field at build time
- [ ] **Persistent search state in URL** — Add when users share filtered views; requires URL param logic
- [ ] **Code block line highlighting** — Add when authoring content that benefits from it; Shiki supports this natively

### Future Consideration (v2+)

Features to defer until the site has significant content and audience.

- [ ] **Analytics (server-side)** — Cloudflare analytics if desired; defer until there's content to analyze
- [ ] **"Related posts" section** — Worthwhile after 30+ posts with diverse tags
- [ ] **Newsletter integration** — Only if Jacob wants to invest in audience building; requires external service decision

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Post listing page | HIGH | LOW | P1 |
| Individual post pages with syntax highlighting | HIGH | LOW | P1 |
| Copy button on code blocks | HIGH | LOW | P1 |
| Homepage with bio | HIGH | LOW | P1 |
| Featured images | HIGH | LOW | P1 |
| Tag filtering | HIGH | MEDIUM | P1 |
| Free-text search (Fuse.js) | HIGH | MEDIUM | P1 |
| Responsive layout | HIGH | MEDIUM | P1 |
| Open Graph / meta tags | HIGH | LOW | P1 |
| RSS feed | HIGH | LOW | P1 |
| Draft post exclusion | HIGH | LOW | P1 |
| Accessible markup | HIGH | MEDIUM | P1 |
| Favicon + sitemap + robots.txt | MEDIUM | LOW | P1 |
| Dark/light mode toggle | HIGH | MEDIUM | P2 |
| Table of contents | MEDIUM | MEDIUM | P2 |
| Read time estimate | MEDIUM | LOW | P2 |
| JSON-LD structured data | MEDIUM | LOW | P2 |
| Persistent search URL state | MEDIUM | MEDIUM | P2 |
| Code block line highlighting | MEDIUM | LOW | P2 |
| Related posts | LOW | MEDIUM | P3 |
| Analytics | LOW | LOW | P3 |
| Newsletter | LOW | HIGH | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible (post-launch)
- P3: Nice to have, future consideration

---

## Competitor Feature Analysis

Reference blogs observed directly (April 2026):

| Feature | overreacted.io (Dan Abramov) | kentcdodds.com (Kent Dodds) | joshwcomeau.com (Josh Comeau) | robinwieruch.de (Robin Wieruch) | Our Approach |
|---------|------------------------------|------------------------------|-------------------------------|-----------------------------------|-|
| Post listing | ✅ Full list, reverse-chron | ✅ Cards with featured images | ✅ List with excerpt | ✅ Date + tag per row | Full listing with cards |
| Featured images | ❌ Text only | ✅ Every post | ❌ Text only | ❌ Text only | ✅ From frontmatter |
| Tag/category filtering | ❌ None | ✅ Topic tags | ✅ Category sidebar | ✅ Tag links | ✅ Client-side filter |
| Search | ❌ None | ✅ Algolia | ✅ Custom | ❌ None | ✅ Fuse.js client-side |
| Dark mode | ❌ None | ✅ Toggle | ✅ Toggle | ❌ None | v1.x |
| RSS | ✅ | ✅ | ✅ | ✅ | ✅ |
| Syntax highlighting | ✅ | ✅ | ✅ Shiki | ✅ | ✅ Shiki |
| Copy button | ❌ | ✅ | ✅ | ❌ | ✅ |
| Table of contents | ❌ | ❌ | ❌ | ❌ | v1.x (for long posts) |
| Newsletter | ❌ | ✅ | ✅ | ✅ | ❌ out of scope |
| Comments | ❌ | ❌ | ❌ | ❌ | ❌ out of scope |
| Read time | ❌ | ✅ | ❌ | ✅ | v1.x |

**Observation:** Even the highest-regarded developer blogs are minimal. No reference site has all features. Overreacted.io has almost nothing beyond a post list — and it's one of the most respected developer blogs in existence. Quality of writing > feature count.

---

## Sources

- Direct observation: overreacted.io (Jan 2026 state), kentcdodds.com (Mar 2026), joshwcomeau.com (Sep 2024), robinwieruch.de (Mar 2026)
- Josh Comeau, "How I Built My Blog (2024)" — joshwcomeau.com/blog/how-i-built-my-blog-v2/ (confirms Shiki as gold standard, copy buttons, accessibility with rem media queries)
- Open Graph Protocol — ogp.me (required og: tags, article type)
- schema.org/BlogPosting — structured data properties for blog posts
- Google Core Web Vitals — developers.google.com/search/docs/appearance/core-web-vitals (LCP < 2.5s, INP < 200ms, CLS < 0.1)
- The A11Y Project Checklist — a11yproject.com/checklist/ (WCAG AA requirements)
- PROJECT.md — explicitly required features validated against this research

---
*Feature research for: Personal developer blog / static site (jcbmcn.com)*
*Researched: 2026-04-01*
