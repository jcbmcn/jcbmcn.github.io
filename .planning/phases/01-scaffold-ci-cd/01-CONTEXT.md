# Phase 1: Scaffold + CI/CD - Context

**Gathered:** 2026-04-01
**Status:** Ready for planning

<domain>
## Phase Boundary

A working Astro 6 project deploys successfully to jcbmcn.com via GitHub Actions — infrastructure verified before any content work begins. A placeholder page is live at jcbmcn.com served from the new Astro build. The Hugo workflow is gone. Draft post filtering is verified. Content migration and real page implementation are out of scope for this phase.

</domain>

<decisions>
## Implementation Decisions

### Placeholder Page
- **D-01:** Minimal branded page — name, tagline, and social links (GitHub, LinkedIn or equivalent from existing hugo.toml params). Minimal inline CSS only — Tailwind is not required to be styled here. The goal is: looks intentional, not bare, and verifies the deploy worked.
- **D-02:** No full layout or design work on the placeholder. Phase 3 builds on top of it. The placeholder is throwaway scaffolding.

### Draft Post Filtering
- **D-03:** Use Astro content collection `getCollection()` filter — check `frontmatter.draft !== true`. No env vars, no build flags. Same behavior in local dev and CI.
- **D-04:** A synthetic test post (e.g., `src/content/blog/test-draft.md` with `draft: true`) is created in Phase 1 to verify exclusion. Real posts are not migrated in this phase — that's Phase 2.

### Hugo File Cleanup
- **D-05:** Full delete of Hugo-specific files in Phase 1: `hugo.toml`, `go.mod`, `go.sum`, `archetypes/`, `themes/` submodule (detach submodule + delete directory), `content/`, `.gitmodules`. The `hugo.yml` workflow is also deleted.
- **D-06:** The existing `static/` directory is moved to Astro's `public/` in Phase 1 — all contents including favicons, avatar (`avatar.png`), blog images (`images/blog/`), and PWA manifest files.
- **D-07:** `public/CNAME` with `jcbmcn.com` is explicitly created/verified in Phase 1 (INFRA-03). It must survive the deploy.

### CI/CD Workflow
- **D-08:** New workflow file `deploy.yml` (or `astro.yml`) — do NOT edit `hugo.yml` in place. Create a new file and delete `hugo.yml`.
- **D-09:** Uses `withastro/action@v5` which handles build + artifact upload in a single step.
- **D-10:** Triggers: push to `main` + `workflow_dispatch`. Same as existing hugo.yml.
- **D-11:** Node.js version: 20 LTS pinned explicitly.
- **D-12:** Permissions: `contents: read`, `pages: write`, `id-token: write` (same as existing workflow — required for Pages deployment).

### Agent's Discretion
- Concurrency group settings — whether to keep `group: "pages" / cancel-in-progress: false` from hugo.yml or simplify. Agent decides what's appropriate for withastro/action deployment.
- Exact workflow file name (`deploy.yml` vs `astro.yml`).
- Whether to use `pnpm` or `npm` as the package manager for the Astro project.
- Placeholder page styling details (exact layout, link icons, CSS approach).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Infrastructure Requirements
- `.planning/REQUIREMENTS.md` — INFRA-01 through INFRA-05 define all scaffold + CI/CD acceptance criteria. Read these before planning tasks.

### Existing Workflow (to replace)
- `.github/workflows/hugo.yml` — The workflow being deleted. Contains the current permissions, concurrency settings, and deploy step structure to reference when writing the replacement.

### Project Constraints
- `.planning/PROJECT.md` — Core constraints: TypeScript only, GitHub Pages static, no backend, Cloudflare DNS already configured (no DNS changes needed).

### No external specs — requirements fully captured in decisions above and REQUIREMENTS.md INFRA-01–05.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `static/` directory: Contains favicons (favicon.ico, favicon-96x96.png, favicon.svg, apple-touch-icon.png), PWA manifest (site.webmanifest, web-app-manifest-*.png), avatar (avatar.png), and blog images (images/blog/). Move wholesale to Astro's `public/` in Phase 1.
- `hugo.toml` params: Author name (`Jacob McNeilly`), social links, site title/subtitle — use as data source for the placeholder page content before deleting hugo.toml.
- `.github/workflows/hugo.yml`: Existing workflow with permissions, concurrency settings, and deploy structure — reference when writing the replacement.

### Established Patterns
- No Node.js tooling exists yet (no package.json, no lockfile). Phase 1 establishes the package manager choice (npm or pnpm) and creates the first package.json.
- Hugo's `content/posts/` naming convention (`YYYY-MM-DD-slug.md`) is carried forward into Astro's `src/content/blog/` in Phase 2.

### Integration Points
- GitHub Pages: Deployment already configured at repo level. The new workflow must use the same `github-pages` environment name and `actions/deploy-pages` pattern (or withastro/action which wraps this).
- Cloudflare DNS: Already points to GitHub Pages. The `public/CNAME` file containing `jcbmcn.com` must be present in every build artifact — this is how GitHub Pages knows the custom domain.
- `themes/LoveIt/` is a git submodule. Detaching it requires `git submodule deinit -f themes/LoveIt` + `git rm -rf themes/LoveIt` + deleting `.gitmodules`.

</code_context>

<specifics>
## Specific Ideas

- Placeholder content source: pull name, tagline, and social links from current `hugo.toml` `[params]` and `[params.social]` before deleting the file.
- The `.DS_Store` in `static/` (noted in CONCERNS.md) should NOT be moved to `public/` — delete it during the static/ migration.

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope.

</deferred>

---

*Phase: 01-scaffold-ci-cd*
*Context gathered: 2026-04-01*
