# Phase 5 — UI Review

**Audited:** 2026-04-02
**Baseline:** 05-UI-SPEC.md (approved 2026-04-02)
**Screenshots:** Not captured (no dev server detected on ports 3000, 5173, 8080)

---

## Pillar Scores

| Pillar | Score | Key Finding |
|--------|-------|-------------|
| 1. Copywriting | 4/4 | All 9 contract strings match exactly; no generic labels found |
| 2. Visuals | 3/4 | Structure and hierarchy correct; SVG icons lack `aria-hidden` — screenreaders may read redundant content |
| 3. Color | 4/4 | All 10 dark mode tokens match spec exactly; no hardcoded colors outside the token definition blocks |
| 4. Typography | 3/4 | 404 heading uses 1.75rem (28px) per spec but body text `<p>` description in 404 defaults to fallback meta copy — no `description` prop passed |
| 5. Spacing | 4/4 | Every spec dimension verified in code: 56px header, 36×36 toggle, 0 1.5rem padding, 4rem 1.5rem on 404 |
| 6. Experience Design | 3/4 | Anti-flash script, OS preference fallback, aria-label toggle all implemented; RSS link has no `:focus-visible` ring; SVG spans not `aria-hidden` |

**Overall: 21/24**

---

## Top 3 Priority Fixes

1. **SVG icon spans missing `aria-hidden="true"`** — Screenreaders will enter the `<button>` and encounter two `<span>` wrappers containing unlabelled SVG paths. The button itself has a correct `aria-label`, but the inner spans are not hidden from the accessibility tree, which may result in redundant or confusing announcements. Fix: add `aria-hidden="true"` to both `.icon-moon` and `.icon-sun` `<span>` elements in `src/components/SiteHeader.astro` (lines 8, 14).

2. **RSS link has no `:focus-visible` ring** — The toggle button correctly implements `outline: 2px solid var(--color-accent)` on `:focus-visible`, but the adjacent `.rss-link` has no corresponding focus style. Keyboard users tabbing through the header will lose the visible focus indicator when focus lands on the RSS link. Fix: add `.rss-link:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }` to `SiteHeader.astro` scoped styles.

3. **404 page uses generic site-wide meta description** — `src/pages/404.astro` passes no `description` prop to `BaseLayout`, so every 404 page emits `<meta name="description" content="Thoughts on SRE, Kubernetes, and building systems that actually work.">`. Search crawlers that index 404 pages will see the homepage description. Fix: pass `description="Page not found"` (or similar) to `<BaseLayout>` in `src/pages/404.astro` (line 4).

---

## Detailed Findings

### Pillar 1: Copywriting (4/4)

Every string in the UI-SPEC Copywriting Contract is implemented exactly:

| Contract Copy | Location | Status |
|---------------|----------|--------|
| `Jacob McNeilly` (site name) | `SiteHeader.astro:4` | ✅ Match |
| `RSS` (link label) | `SiteHeader.astro:6` | ✅ Match |
| `RSS feed` (aria-label) | `SiteHeader.astro:6` | ✅ Match |
| `Jacob McNeilly` (autodiscovery title) | `BaseLayout.astro:29` | ✅ Match |
| `Switch to dark mode` (initial aria-label) | `SiteHeader.astro:7` | ✅ Match |
| `Switch to light mode` (toggled aria-label) | `SiteHeader.astro:45` | ✅ Match |
| `Page not found` (404 heading) | `404.astro:6` | ✅ Match |
| `The page you're looking for doesn't exist or has moved.` | `404.astro:7` | ✅ Match |
| `← Back to homepage` | `404.astro:8` | ✅ Match |

No generic labels (`Submit`, `Click Here`, `OK`, `Cancel`, `Save`, `No data`, `No results`) found anywhere in the source tree. The RSS feed `description` in `rss.xml.ts:11` ("Thoughts on SRE, Kubernetes, and building systems that actually work.") is appropriate channel-level copy and not a UI-SPEC concern.

---

### Pillar 2: Visuals (3/4)

**What's correct:**
- Header uses `display: flex; justify-content: space-between` — site name left, controls right (`SiteHeader.astro:63–65`). Matches the ASCII diagram in the spec.
- `position: sticky; top: 0; z-index: 10` confirmed at `SiteHeader.astro:70–72`. Header will remain visible during scroll.
- Both sun and moon SVGs are 20×20px with `stroke="currentColor"` — they inherit `var(--color-text-primary)` correctly for both themes.
- Icon visibility toggling is purely DOM (`display` property), not CSS class-based — no risk of FOUC on icon state.
- 404 page uses `<main class="not-found">` with a single `<h1>` — correct heading hierarchy, no skipped levels.

**Issue — SVG spans not aria-hidden (`SiteHeader.astro:8, 14`):**
The button element has `aria-label="Switch to dark mode"` which is the correct accessible name. However, the two `<span>` elements wrapping the icons (`.icon-moon`, `.icon-sun`) are not marked `aria-hidden="true"`. Depending on the screenreader, the SVG child elements may be announced alongside (or instead of) the button's `aria-label`. This is a minor a11y gap that does not affect sighted users but degrades keyboard/screenreader UX.

**Issue — No focus ring on RSS link:**
The `.rss-link` element has no `:focus-visible` style. The toggle button (adjacent) does have one correctly defined at `SiteHeader.astro:122–125`. The inconsistency means keyboard users get no visible focus indicator on the RSS link.

---

### Pillar 3: Color (4/4)

**Dark mode token block** (`global.css:22–33`) — all 10 tokens verified against UI-SPEC:

| Token | Spec | Implemented | Status |
|-------|------|-------------|--------|
| `--color-bg` | `#0F172A` | `#0F172A` | ✅ |
| `--color-surface` | `#1E293B` | `#1E293B` | ✅ |
| `--color-surface-alt` | `#334155` | `#334155` | ✅ |
| `--color-border` | `#334155` | `#334155` | ✅ |
| `--color-text-primary` | `#F8FAFC` | `#F8FAFC` | ✅ |
| `--color-text-secondary` | `#94A3B8` | `#94A3B8` | ✅ |
| `--color-text-muted` | `#64748B` | `#64748B` | ✅ |
| `--color-accent` | `#818CF8` | `#818CF8` | ✅ |
| `--color-accent-hover` | `#A5B4FC` | `#A5B4FC` | ✅ |
| `--color-accent-subtle` | `rgba(99,102,241,0.15)` | `rgba(99, 102, 241, 0.15)` | ✅ |

**Hardcoded colors — all legitimate:**
- `src/styles/global.css:14` — `#6366F1` is the light-mode accent token definition (correct — this is where the token is defined, not where it's consumed).
- `src/pages/posts/[slug].astro:198,214` — `#cdd6f4` and `#a6e3a1` are Catppuccin/Mocha terminal colors used in code block syntax highlighting. These are isolated to the Shiki-rendered code block overrides and do not bleed into the UI chrome. Not a concern.

**Accent usage** — `var(--color-accent)` appears 20+ times across components, consistent with the site-wide link color pattern already established. All usage is on interactive elements (links, focus rings, tag chips) per the spec's "Accent reserved for" list. No decorative use found.

---

### Pillar 4: Typography (3/4)

**Phase 5 new elements:**

| Element | Spec | Implemented | Status |
|---------|------|-------------|--------|
| SiteHeader site name | 16px / 700 | `1rem` / `700` (`SiteHeader.astro:75–77`) | ✅ |
| RSS link | 14px / 400 | `0.875rem` / `400` (`SiteHeader.astro:93–94`) | ✅ |
| 404 heading | 28px / 700 | `1.75rem` / `700` (`404.astro:20–21`) | ✅ |
| 404 body text | 16px / 400 | `1rem` / implicit 400 (`404.astro:27`) | ✅ |

**Minor issue — 404 `<p>` `color` token:**
The spec says 404 body text uses `var(--color-text-secondary)`. The implementation sets `color: var(--color-text-secondary)` at `404.astro:28` — correct.

**Note on font weights observed across full codebase:**
Weights found: `400`, `500`, `600`, `700`. The spec contract for Phase 5 only declares `400` and `700`. Weights `500` and `600` come from earlier phases (Phase 3/4 PostCard, post listing). No Phase 5 new elements introduce off-spec weights.

**No Tailwind utility font classes** found anywhere in `.astro` files — all typography is done through scoped CSS with explicit `font-size` and `font-weight` values, fully matching the CSS-custom-property-based approach declared in the design system.

---

### Pillar 5: Spacing (4/4)

Every spacing dimension specified in the UI-SPEC was verified in code:

| Spec Element | Property | Spec Value | Implemented | Location |
|--------------|----------|------------|-------------|----------|
| SiteHeader | `height` | `56px` | `56px` | `SiteHeader.astro:66` |
| SiteHeader | `padding` | `0 1.5rem` | `0 1.5rem` | `SiteHeader.astro:67` |
| SiteHeader | `border-bottom` | `1px solid var(--color-border)` | `1px solid var(--color-border)` | `SiteHeader.astro:69` |
| Toggle button | `width` / `height` | `36px × 36px` | `36px × 36px` | `SiteHeader.astro:105–106` |
| Toggle button | `border-radius` | `0.5rem` | `0.5rem` | `SiteHeader.astro:112` |
| Toggle button | `padding` | `0.5rem` | `0.5rem` | `SiteHeader.astro:115` |
| RSS link | `padding` | `0.25rem 0.5rem` | `0.25rem 0.5rem` | `SiteHeader.astro:97` |
| Header controls | `gap` | `0.5rem` | `0.5rem` | `SiteHeader.astro:89` |
| 404 content | `max-width` | `48rem` | `48rem` | `404.astro:14` |
| 404 content | `padding` | `4rem 1.5rem` | `4rem 1.5rem` | `404.astro:16` |

**No arbitrary spacing values** found anywhere in the Phase 5 files (no `[Xpx]` or `[Xrem]` Tailwind arbitrary syntax).

The spec-noted exception (36×36px touch target vs. 44px minimum) is acknowledged in the UI-SPEC and acceptable for Phase 1.

---

### Pillar 6: Experience Design (3/4)

**Implemented correctly:**

- **Anti-flash script** (`BaseLayout.astro:17–24`) — `is:inline` ensures Astro does not bundle or defer it. Placed as the first element in `<head>` before `<meta charset>` — verified by line ordering. Reads `localStorage('theme')`, falls back to `window.matchMedia('(prefers-color-scheme: dark)')`. No flash of wrong theme.
- **Theme persistence** — `localStorage.setItem('theme', next)` at `SiteHeader.astro:56`. Key and values (`"light"` / `"dark"`) match spec exactly.
- **Toggle button aria-label** — Initial value `"Switch to dark mode"` (`SiteHeader.astro:7`); dynamically updated on click and on load sync (`SiteHeader.astro:44–47`). Correct for all four interaction states in the spec table.
- **Icon sync on load** — `applyTheme(currentTheme)` called immediately after the theme is read from `<html>` (`SiteHeader.astro:52`). Corrects the initial HTML (moon visible by default) if the anti-flash script already applied dark mode before the component rendered.
- **RSS autodiscovery** — `<link rel="alternate">` at `BaseLayout.astro:29` — machine-readable, correct placement in `<head>`.
- **404 page** — Correct status semantics for GitHub Pages (serves `404.html` for missing routes), includes SiteHeader via `BaseLayout`, and homepage link uses accent color inherited from global `a` rule.
- **Sitemap** — `astro.config.mjs` confirms `integrations: [sitemap()]` with `site: 'https://jcbmcn.com'`. Both `sitemap-index.xml` and `sitemap-0.xml` reported in build verification.

**Issue — SVG spans not `aria-hidden` (minor a11y):**
Already detailed in Pillar 2. The two icon `<span>` elements inside the toggle button are not hidden from the accessibility tree. The button's own `aria-label` is correct; the missing `aria-hidden` on child spans is the gap.

**Issue — RSS link has no `:focus-visible` ring:**
A keyboard user tabbing from the RSS link to the toggle button will see the focus indicator vanish then reappear. This creates an inconsistent focus experience within a single 3-element header. The fix is one CSS rule (see Top 3 Priority Fixes, item 2).

**Issue — 404 page emits wrong `<meta name="description">`:**
`404.astro` does not pass `description` to `BaseLayout`. The layout's default description (`"Thoughts on SRE, Kubernetes, and building systems that actually work."`) is emitted on the 404 page. This is a minor SEO concern: search crawlers that crawl 404 responses will see the homepage meta description. No user-visible impact — the `<h1>` on the page is correct. Fix: `<BaseLayout title="Page not found — Jacob McNeilly" description="Page not found.">` at `404.astro:4`.

**No error boundary or loading states needed** — this is a static site; all data is pre-rendered at build time. The absence of `isLoading` / `ErrorBoundary` patterns is architecturally correct.

---

## Files Audited

| File | Phase Relevance |
|------|-----------------|
| `src/components/SiteHeader.astro` | Created in Phase 5 (Plan 02) |
| `src/layouts/BaseLayout.astro` | Modified in Phase 5 (Plan 03) |
| `src/pages/404.astro` | Created in Phase 5 (Plan 03) |
| `src/styles/global.css` | Modified in Phase 5 (Plan 02) — dark mode tokens |
| `src/pages/rss.xml.ts` | Created in Phase 5 (Plan 01) |
| `astro.config.mjs` | Modified in Phase 5 (Plan 01) — sitemap integration |

*Registry audit: shadcn not initialized — registry safety gate skipped.*
