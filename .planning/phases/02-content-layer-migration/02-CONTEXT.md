# Phase 2: Content Layer + Migration - Context

**Gathered:** 2026-04-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Define the Zod-validated content schema for `src/content/blog/` and migrate all 3 existing posts from git history into the new location with correct URL slugs and all frontmatter edge cases resolved. Page templates and visual design are out of scope — this phase ends when posts build without errors and URLs match the Hugo `:filename` permalink pattern.

</domain>

<decisions>
## Implementation Decisions

### Schema Design
- **D-01:** Schema includes all known fields from real posts — no unknowns permitted (reject-unknown approach, not passthrough). Extra fields in posts cause build errors; all fields seen across real posts must be explicitly declared.
- **D-02:** Required fields: `title` (string), `author` (string), `date` (string or Date). Optional fields: `draft` (boolean, default `false`), `tags` (string array), `featuredImage` (optional string), `images` (optional string array), `subtitle` (optional string), `fontawesome` (optional boolean), `code` (optional object with `copy: boolean`).
- **D-03:** The existing `content.config.ts` schema is bare-bones (only `title` + `draft`). Phase 2 expands it to the full field set above.

### Post Source Recovery
- **D-04:** The 3 posts were deleted from `content/posts/` in Phase 1 (commit `44bc5d5`). The plan must restore them from git history using `git show <pre-deletion-commit>:content/posts/<filename>` and write each file to `src/content/blog/`. No manual developer action required.
- **D-05:** Filenames are kept identical to their Hugo originals (`2025-02-13-power-automate.md`, `2025-08-19-talosctl-cdktf-guide.md`, `2025-12-28-building-codeowners-simulator.md`). The Astro glob loader uses the filename as the slug, producing `/2025-02-13-power-automate/`-style URLs that match Hugo's `:filename` permalink pattern (CONT-03).
- **D-06:** Post content is copied verbatim — no edits to body or frontmatter during migration.

### Image Field Resolution
- **D-07:** Schema declares both `featuredImage` (optional string) and `images` (optional string array). The canonical image is resolved as: `featuredImage ?? images?.[0] ?? undefined`. This resolution happens in template code (Phase 3), not in the schema transform.
- **D-08:** No normalization of posts during migration — posts keep their original field names as-is. The `power-automate.md` post has both `images:` and `featuredImage:` — both are preserved.

### Ignored Fields
- **D-09:** `code.copy`, `fontawesome`, and `subtitle` are included in the Zod schema as optional fields. They are validated (no build errors) but not used by any templates in this phase. Phase 3 templates may use `subtitle`; copy buttons are applied globally per Phase 1 design decisions, so `code.copy` values are irrelevant at runtime.

### Agent's Discretion
- Date field typing: whether `date` is typed as `z.string()`, `z.coerce.date()`, or `z.union([z.string(), z.date()])` — agent chooses what works cleanly with Astro's Content Layer and downstream template usage.
- Tags default: whether `tags` defaults to `[]` or remains `undefined` when absent.
- Whether to add a build-time smoke test (e.g., `astro check` or `astro build` in CI) to verify all posts validate against the schema.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Content Requirements
- `.planning/REQUIREMENTS.md` — CONT-01 through CONT-04 define all content layer acceptance criteria for this phase. Read these before writing any tasks.

### Existing Schema (to expand)
- `src/content.config.ts` — The bare-bones schema created in Phase 1 (only `title` + `draft`). Phase 2 expands this file in-place.

### Project Constraints
- `.planning/PROJECT.md` — Core constraints: TypeScript strict mode, Markdown + YAML frontmatter as sole content input, no CMS.

### Prior Phase Context
- `.planning/phases/01-scaffold-ci-cd/01-CONTEXT.md` — Phase 1 decisions: Content Layer API (glob loader), `src/content/blog/` directory, draft filtering pattern, npm as package manager.

### No external specs for frontmatter — requirements fully captured in REQUIREMENTS.md CONT-01–04 and decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/content.config.ts`: Existing content config with glob loader wired for `src/content/blog/`. Schema expansion happens in this file — do not create a new one.
- `src/content/blog/test-draft.md`: Synthetic draft post from Phase 1. Keep it — it verifies draft filtering is still working after migration.

### Established Patterns
- Astro 6 Content Layer API (`defineCollection` + `glob` loader) is already set up. Phase 2 only expands the schema, not the loader config.
- Filenames follow Hugo's `YYYY-MM-DD-slug.md` convention. Astro's glob loader uses the base filename as the slug by default, producing the correct URL paths.

### Integration Points
- `src/content.config.ts` → `src/pages/` (Phase 3 will call `getCollection('blog')` to query posts — schema fields must be stable before Phase 3 starts)
- `public/images/blog/` — Featured images referenced in frontmatter (`/images/blog/robot-arm.jpg`, etc.) already exist here from Phase 1's static asset migration. No image file moves needed.

### Source Posts (git history)
The 3 posts to migrate live at commit `44bc5d5^` (the commit before Hugo removal):
- `content/posts/2025-02-13-power-automate.md` — has both `images:` and `featuredImage:`, plus `fontawesome: true`
- `content/posts/2025-08-19-talosctl-cdktf-guide.md` — has `featuredImage:` and `code.copy: true`
- `content/posts/2025-12-28-building-codeowners-simulator.md` — has `featuredImage:` and `code.copy: true`

</code_context>

<specifics>
## Specific Ideas

- No specific UI references or "I want it like X" moments — this phase is purely schema + file migration with no visual output.
- The pre-deletion commit for posts is `44bc5d5^` (parent of the Hugo removal commit). Use `git show 44bc5d5^:content/posts/<filename>` to retrieve each post.

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope.

</deferred>

---

*Phase: 02-content-layer-migration*
*Context gathered: 2026-04-01*
