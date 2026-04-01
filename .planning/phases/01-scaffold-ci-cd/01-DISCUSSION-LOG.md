# Phase 1: Scaffold + CI/CD - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-01
**Phase:** 01-scaffold-ci-cd
**Mode:** discuss
**Areas discussed:** Placeholder page content, Draft post filtering, Old Hugo file cleanup, CI/CD workflow design

---

## Placeholder Page Content

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal branded page | Name, tagline, social links. Minimal CSS inline — no Tailwind required. Enough to verify deploy and look intentional. | ✓ |
| Bare bones HTML | Single line of text like 'jcbmcn.com — under construction'. Throwaway immediately in Phase 3. | |
| Skeleton with Tailwind wired | Scaffold Tailwind and show a rough layout placeholder Phase 3 builds on top of. | |

**User's choice:** Minimal branded page

**Follow-up:**

| Option | Description | Selected |
|--------|-------------|----------|
| Name + tagline + links | Name, 'jcbmcn.com', one-liner bio, links to GitHub/LinkedIn. Clean, not bare. | ✓ |
| Name + coming soon | Just name and 'Coming soon' — absolute minimum that still feels intentional. | |
| Match existing hugo.toml params | Port author name, description, and social links directly from hugo.toml. | |

**User's choice:** Name + tagline + links

---

## Draft Post Filtering

| Option | Description | Selected |
|--------|-------------|----------|
| Content collection filter | getCollection() filter: check frontmatter.draft !== true. No env vars. Works same locally and in CI. | ✓ |
| Env var flag (PROD) | Check import.meta.env.PROD — drafts excluded only in production, visible during local dev. | |
| Custom build flag | Custom --include-drafts CLI flag. More flexible but adds workflow complexity. | |

**User's choice:** Content collection filter

**Follow-up — test post for draft verification:**

| Option | Description | Selected |
|--------|-------------|----------|
| Any test post is fine | Phase 1 just needs one draft post present but not built — a placeholder or minimal test post works. | |
| Migrate real posts now | Migrate the real posts in Phase 1 too, so draft filtering is tested against actual content. | |
| Synthetic test draft | Create a test post named something obvious like 'test-draft.md' with draft: true. | ✓ |

**User's choice:** Synthetic test draft

---

## Old Hugo File Cleanup

| Option | Description | Selected |
|--------|-------------|----------|
| Full delete except static/ | Delete hugo.toml, go.mod, go.sum, archetypes/, themes/ submodule, content/, hugo.yml. Keep static/ for now. | ✓ |
| Delete everything | Delete everything including static/. Astro's public/ starts fresh. | |
| Keep Hugo files until Phase 2 | Leave Hugo files in place during Phase 1, only delete when Phase 2 migration is done. | |

**User's choice:** Full delete except static/

**Follow-up — static/ migration timing:**

| Option | Description | Selected |
|--------|-------------|----------|
| Move static/ to public/ in Phase 1 | Move all static/ contents into Astro's public/ now — favicons, avatar, blog images. | ✓ |
| Defer static/ move to Phase 2 | Leave static/ in place in Phase 1, copy to public/ in Phase 2 when post images are needed. | |
| Copy critical files now, images later | Only copy favicons, CNAME now. Blog images move in Phase 2. | |

**User's choice:** Move static/ to public/ in Phase 1
**Notes:** The .DS_Store file in static/ should be deleted rather than moved.

---

## CI/CD Workflow Design

| Option | Description | Selected |
|--------|-------------|----------|
| New deploy.yml with withastro/action | New workflow file. Uses withastro/action@v5. Node 20. Same triggers: push to main + workflow_dispatch. | ✓ |
| Edit hugo.yml in place | Rename/edit existing hugo.yml to replace Hugo steps with Astro steps. | |
| Mirror hugo.yml structure | Two-job workflow (build + deploy) mirroring hugo.yml exactly. | |

**User's choice:** New deploy.yml with withastro/action

**Follow-up — Node version:**

| Option | Description | Selected |
|--------|-------------|----------|
| Node 20 LTS | Node 20 pinned explicitly. Matches withastro/action@v5 defaults. | ✓ |
| Node 22 | Node 22 — latest LTS as of 2026. | |
| Let action decide | No explicit Node version pinned. | |

**User's choice:** Node 20

**Follow-up — concurrency settings:**

| Option | Description | Selected |
|--------|-------------|----------|
| Keep concurrency settings | Same as hugo.yml: group 'pages', cancel-in-progress: false. | |
| Skip concurrency config | No concurrency config — simpler workflow. | |
| Agent's discretion | Agent decides what's appropriate for the Astro deploy action. | ✓ |

**User's choice:** Agent's discretion

---

## Agent's Discretion

- Concurrency group settings for the new deploy workflow
- Exact workflow file name (deploy.yml vs astro.yml)
- Package manager choice (npm vs pnpm)
- Placeholder page styling details (exact layout, CSS approach)

## Deferred Ideas

None — discussion stayed within phase scope.
