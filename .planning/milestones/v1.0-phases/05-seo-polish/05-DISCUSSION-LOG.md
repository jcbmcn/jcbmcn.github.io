# Phase 5: SEO + Polish - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-02
**Phase:** 05-seo-polish
**Areas discussed:** RSS feed, Sitemap, RSS autodiscovery, Dark mode, Site header, 404 page, RSS UI link

---

## RSS Feed (SEO-01)

| Option | Description | Selected |
|--------|-------------|----------|
| @astrojs/rss package | Official Astro RSS helper. Single endpoint file, handles XML encoding. | ✓ |
| Custom XML endpoint | Raw XML template string. Full control, more boilerplate. | |

**User's choice:** @astrojs/rss package

---

## Sitemap (SEO-02)

| Option | Description | Selected |
|--------|-------------|----------|
| @astrojs/sitemap integration | Auto-discovers all routes at build time. Zero config beyond site URL. | ✓ |
| Custom sitemap endpoint | Manual route enumeration. More control, more maintenance. | |

**User's choice:** @astrojs/sitemap integration

---

## RSS Autodiscovery Link

| Option | Description | Selected |
|--------|-------------|----------|
| Add to BaseLayout <head> | Standard practice; enables browser/feed reader auto-detection. | ✓ |
| Skip it | RSS still accessible directly but not auto-detected. | |

**User's choice:** Add RSS autodiscovery link to BaseLayout

---

## Polish Scope

| Item | Selected |
|------|----------|
| 404 page | ✓ |
| RSS link in site footer/nav | ✓ |
| Add light/dark mode to the site | ✓ |
| Per-post meta description | |
| Canonical URL tag | |
| Nothing extra — RSS + sitemap only | |

---

## Dark Mode Toggle Mechanism

| Option | Description | Selected |
|--------|-------------|----------|
| Toggle button in nav (sun/moon) | localStorage persistence, data-theme on <html>. | ✓ |
| OS preference only (no button) | Respects prefers-color-scheme but no user override. | |

**User's choice:** Toggle button

---

## Toggle Button Location

| Option | Description | Selected |
|--------|-------------|----------|
| Top-right of site header | Minimal, always visible with site title on left. | ✓ |
| Footer | Less intrusive. | |
| Fixed floating button | Always accessible. | |

**User's choice:** Top-right of site header

---

## Default Theme (First Visit)

| Option | Description | Selected |
|--------|-------------|----------|
| OS preference as default | matchMedia('prefers-color-scheme: dark') on first visit; localStorage overrides after. | ✓ |
| Light mode default | Always light until user toggles. | |

**User's choice:** OS preference as default

---

## Dark Mode Color Values

| Option | Description | Selected |
|--------|-------------|----------|
| Standard dark palette (slate-900 base) | Matches existing token family. No custom colors needed. | ✓ |
| Discuss colors first | User wants input on specific values before implementation. | |

**User's choice:** Standard dark palette (slate-900 base)

---

## Site Header Structure

| Option | Description | Selected |
|--------|-------------|----------|
| Add persistent site header component | SiteHeader.astro rendered in BaseLayout. Contains site title + dark toggle + RSS link. | ✓ |
| Agent's discretion | No explicit direction on structure. | |

**User's choice:** Add persistent site header component

---

## Agent's Discretion

- Exact SVG shapes for sun/moon toggle icons
- Whether RSS link is in the header alongside the toggle or in a separate footer
- Exact visual styling of the header bar
- Whether 404 page uses standard BaseLayout or a special layout
- Whether to add a footer component or inline footer content in BaseLayout

## Deferred Ideas

- Open Graph / Twitter card meta tags (SEO-03) — v2
- JSON-LD structured data (SEO-04) — v2
- WCAG AA accessibility audit (DES-02) — v2
- Bookmarkable/shareable search URL state — previously deferred in Phase 4
