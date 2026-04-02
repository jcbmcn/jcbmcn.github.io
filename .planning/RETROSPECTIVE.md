# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.0 — MVP

**Shipped:** 2026-04-02
**Phases:** 5 | **Plans:** 12 | **Tasks:** 21

### What Was Built

- Astro 6 + TypeScript + Tailwind CSS 4 site replaces Hugo 0.128.0 + LoveIt — full stack migration with working CI/CD to GitHub Pages
- Content Layer API with Zod-validated 10-field schema; all 3 posts migrated verbatim from git history with correct URL slugs
- Homepage with avatar hero + bio; blog listing with PostCard components; dynamic post pages with Shiki syntax highlighting + copy-to-clipboard
- Real-time tag filtering and Fuse.js full-text search on the blog listing page (client-side, no SSR)
- RSS feed (`/rss.xml`), sitemap, dark mode toggle with anti-flash script, 404 page

### What Worked

- **Infrastructure-first order**: Deploying a placeholder to jcbmcn.com in Phase 1 before touching content eliminated deployment surprises in later phases
- **Content Layer API + Zod**: Schema-first approach surfaced frontmatter edge cases (`images:` fallback, nested `code.copy`) before they became runtime errors
- **CSS custom properties for tokens**: Enabled dark mode in Phase 5 with a single `[data-theme="dark"]` block and zero per-component changes — the architecture decision paid off immediately
- **Phase boundary discipline**: Each phase delivered a self-contained, verifiable capability — no cross-phase rework required

### What Was Inefficient

- **ROADMAP.md fell stale**: Phases 1, 4, and 5 completion was tracked only in SUMMARY files, not in ROADMAP.md — milestone archival required manual correction of stale checkboxes
- **Phase 5 SUMMARY files used free-form format**: The CLI `summary-extract` tool couldn't parse them (no YAML frontmatter), producing empty "Completed:" entries in MILESTONES.md — SUMMARY files need consistent format
- **No milestone audit**: Skipping `/gsd-audit-milestone` meant no formal verification of cross-phase integration before archiving — the site likely works fine but the coverage gap is a process risk

### Patterns Established

- CSS custom properties (not Tailwind `@theme`) for all color tokens — dark mode = one override block
- `is:inline` anti-flash script must be the first element in `<head>` (before `<meta charset>`) to prevent theme flash
- Fuse.js in `dependencies` (not `devDependencies`) when used in Astro `<script>` blocks — Vite bundles it at build time
- `application/json` script tag for serializing build-time post data to client-side filter scripts
- Per-phase `gsd/phase-0X-slug` branches with PRs to `main` — keeps main deployable at all times

### Key Lessons

1. Keep ROADMAP.md current after each plan execution — letting it go stale forces cleanup work at milestone time
2. Phase 5 SUMMARY files should use the same YAML frontmatter format as earlier phases — free-form prose doesn't parse well with CLI tools
3. Run `/gsd-audit-milestone` before completing a milestone, not after — it catches cross-phase gaps while there's still time to address them

### Cost Observations

- Sessions: multiple sessions across 5 phases
- Notable: Infrastructure-first ordering kept all subsequent phases free of environment debugging

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Phases | Plans | Key Change |
|-----------|--------|-------|------------|
| v1.0 | 5 | 12 | First milestone — baseline established |

### Cumulative Quality

| Milestone | Source LOC | Stack | Notable |
|-----------|------------|-------|---------|
| v1.0 | ~1,200 | Astro 6 + TS + Tailwind 4 | Full Hugo → Astro migration |

### Top Lessons (Verified Across Milestones)

1. Infrastructure-first phase ordering eliminates environment surprises in later phases
2. Schema-first content modeling surfaces frontmatter edge cases early
