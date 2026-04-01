# Phase 1: Scaffold + CI/CD — Research

**Phase:** 01-scaffold-ci-cd
**Researched:** 2026-04-01
**Status:** Complete

---

## What I Need to Know to Plan This Well

### 1. Astro 6 Scaffold — Key Facts

**Init command:**
```bash
npm create astro@latest . -- --template minimal --typescript strict --no-git --install
```
- `--template minimal` = empty project (no blog starter — we build our own)
- `--typescript strict` = strict mode enabled in tsconfig
- `--no-git` = don't reinit git (we're inside an existing repo)
- `--install` = run npm install automatically

**Resulting structure:**
```
src/
  pages/
    index.astro        ← placeholder page goes here
  content/
    config.ts          ← content collection schema (Phase 2)
    blog/              ← posts directory (Phase 2)
public/
  CNAME               ← must contain jcbmcn.com
astro.config.mjs      ← config with site: 'https://jcbmcn.com'
package.json
tsconfig.json
```

**Key: Astro 6 outputs to `dist/` by default** (not `public/`). The `withastro/action` automatically uploads the `dist/` directory as the artifact.

### 2. `withastro/action` — Correct Version and Usage

**CONTEXT.md decision D-09 specifies `withastro/action@v5`.** Note: v6.1.0 was released 2026-03-31, but we honor the locked decision.

**`withastro/action@v5` auto-detects package manager** from lockfile. With npm: a `package-lock.json` must be committed. With pnpm: `pnpm-lock.yaml` must be committed.

**Node.js version:** Decision D-11 says "Node.js 20 LTS pinned explicitly." In `withastro/action@v5`, pin via:
```yaml
- uses: withastro/action@v5
  with:
    node-version: 20
```

**Output directory:** Astro 6 builds to `dist/` by default. The action handles this automatically — no `path` or `out-dir` override needed unless the project root is a subdirectory.

### 3. GitHub Actions Workflow — Correct Structure

Based on the existing `hugo.yml` and official Astro docs, the replacement workflow:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Install, build, and upload
        uses: withastro/action@v5
        with:
          node-version: 20

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Concurrency:** Keeping `group: "pages" / cancel-in-progress: false` from hugo.yml is appropriate for production deployments (per D-38 agent discretion — prevents partial deploys).

**No `Setup Pages` step needed** — `withastro/action` handles this internally.

### 4. Astro Config for Custom Domain (jcbmcn.com)

When using a custom domain with `public/CNAME`:
- Set `site: 'https://jcbmcn.com'` in `astro.config.mjs`
- Do NOT set `base` — custom domain means the repo root IS the site root
- Internal links use `/` paths (no prefix needed)

```ts
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://jcbmcn.com',
});
```

### 5. Hugo Cleanup — Submodule Removal

The `themes/LoveIt/` directory is a git submodule. Correct removal sequence:
```bash
git submodule deinit -f themes/LoveIt
git rm -rf themes/LoveIt
rm -rf .git/modules/themes/LoveIt   # clean up the cached module data
rm .gitmodules                       # or git rm .gitmodules if tracked
```

Files to delete in Phase 1 (per D-05):
- `hugo.toml`
- `go.mod`, `go.sum`
- `archetypes/`
- `themes/` (via submodule removal above)
- `content/` (Hugo content directory)
- `.gitmodules`
- `.github/workflows/hugo.yml` (per D-08)

**Important:** Extract social links from `hugo.toml` BEFORE deleting it:
- GitHub: `jcbmcn`
- LinkedIn: `jacob-mcneilly-a6a516112`
- Author: `Jacob McNeilly`
- Tagline: `Thoughts on SRE, homelab, and Kubernetes.`

### 6. Static Assets → public/

Per D-06, move `static/` contents to Astro's `public/`:
```bash
cp -r static/* public/
```

**Exception:** Do NOT copy `.DS_Store` (per CONTEXT.md specifics). Delete it.

After moving, `public/` must contain:
- `CNAME` (containing `jcbmcn.com`) — per D-07
- `favicon.ico`, `favicon-96x96.png`, `favicon.svg`, `apple-touch-icon.png`
- `site.webmanifest`, `web-app-manifest-192x192.png`, `web-app-manifest-512x512.png`
- `images/blog/` directory with all blog images

### 7. Draft Post Filtering (INFRA-05)

Per D-03: Use Astro content collections `getCollection()` with filter.

In Phase 1, we create a minimal blog collection with just `draft` support so filtering can be verified. The full Zod schema is Phase 2 — but we need enough to test draft exclusion.

Minimal `src/content/config.ts`:
```ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = { blog };
```

Per D-04: Create `src/content/blog/test-draft.md`:
```markdown
---
title: "Test Draft Post"
draft: true
---
This post should never appear in production builds.
```

The placeholder `index.astro` uses a filter to demonstrate exclusion:
```ts
const posts = await getCollection('blog', ({ data }) => data.draft !== true);
```

### 8. Package Manager Choice

CONTEXT.md marks package manager as "Agent's Discretion." 

**Recommendation: npm** — rationale:
- Existing repo has no lockfile; starting fresh
- `withastro/action@v5` auto-detects from `package-lock.json` — npm is the simplest path
- No pnpm workspace config needed for a single-package project
- Fewer setup steps in CI (no pnpm installation step)
- `npm create astro` is the default documented path

### 9. Validation Architecture

**Test command for INFRA-05 (draft exclusion):**
```bash
npx astro build && grep -r "test-draft" dist/ && echo "FAIL: draft appeared in build" || echo "PASS: draft excluded"
```

**Test for INFRA-03 (CNAME in artifact):**
```bash
npx astro build && test -f dist/CNAME && cat dist/CNAME
```
Expected output: `jcbmcn.com`

**Test for INFRA-04 (only one workflow):**
```bash
ls .github/workflows/ | wc -l
```
Expected: `1` (only `deploy.yml`)

**Build passes locally:**
```bash
npm run build
```
Expected: exit 0, `dist/` created.

## Validation Architecture

This section is consumed by `gsd-tools` to generate VALIDATION.md.

### Validation Strategies

| Requirement | Strategy | Command | Expected |
|-------------|----------|---------|----------|
| INFRA-01 | Build passes + dist exists | `npm run build && test -d dist` | Exit 0 |
| INFRA-02 | Workflow file exists with correct action | `grep "withastro/action@v5" .github/workflows/deploy.yml` | Match |
| INFRA-03 | CNAME in public/ and dist/ after build | `test -f public/CNAME && npm run build && grep -q "jcbmcn.com" dist/CNAME` | Both pass |
| INFRA-04 | Only one workflow file | `ls .github/workflows/ \| wc -l \| grep -q "^1$"` | Exit 0 |
| INFRA-05 | Draft post not in build output | `npm run build && ! find dist -name "test-draft*" -type f \| grep -q .` | Grep fails (no match = pass) |

### Common Pitfalls

1. **`base` misconfiguration**: Setting `base: '/repo-name'` when using a custom domain breaks all internal links. Custom domain = no `base` needed.

2. **`.DS_Store` in public/**: Moving `static/*` to `public/` can include `.DS_Store` (macOS artifact). Explicitly delete it.

3. **Submodule residue**: After `git submodule deinit + git rm`, the `.git/modules/themes/LoveIt` cache directory may remain. Clean it or it causes confusing git states.

4. **`content/` collision**: Astro's `src/content/` is NOT the same as Hugo's `content/`. Hugo's `content/` must be deleted; Astro's `src/content/` is new.

5. **Workflow file name**: CONTEXT.md D-08 says "do NOT edit `hugo.yml` in place — create a new file." The new file should be `deploy.yml` (conventional Astro name).

6. **Package lock must be committed**: `withastro/action@v5` requires a lockfile to detect the package manager. Commit `package-lock.json` alongside `package.json`.

---

## RESEARCH COMPLETE

Research targeted Phase 1: Scaffold + CI/CD.
Key findings: `withastro/action@v5` is the locked version (D-09); npm is the recommended package manager; `dist/` is the build output; `public/CNAME` is the correct location for the custom domain file; submodule removal requires 3 git commands + `.git/modules` cleanup; draft filtering uses `getCollection()` with a `data.draft !== true` filter.
