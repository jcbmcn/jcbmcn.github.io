# Phase 2: Content Layer + Migration - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-01
**Phase:** 02-content-layer-migration
**Mode:** discuss
**Areas discussed:** Schema design, Post source recovery, Image field logic, Ignored fields handling

---

## Schema design

| Option | Description | Selected |
|--------|-------------|----------|
| Strict: only defined fields allowed | Only explicitly named fields in schema; extra fields cause build errors; posts need cleanup | |
| Permissive: known fields, reject unknown | All fields from real posts declared; unknown fields rejected; posts work as-is | ✓ |
| Passthrough: defined + allow anything extra | z.object().passthrough() silently allows extra fields | |

**User's choice:** Permissive — known fields declared, unknowns rejected, posts work as-is without cleanup

| Option | Description | Selected |
|--------|-------------|----------|
| title + author + date required | Required: title, author, date. Optional: draft, tags, featuredImage, images, subtitle, fontawesome | ✓ |
| title only required | Only title required; everything else optional | |
| title + date required | title + date required; author optional | |

**User's choice:** title + author + date are required fields; all others optional

---

## Post source recovery

| Option | Description | Selected |
|--------|-------------|----------|
| Restore from git history in plan | Plan uses `git show` to restore posts from pre-deletion commit to src/content/blog/ | ✓ |
| Manual copy by developer | Developer manually provides posts before plan executes | |
| Copy from content/posts/ (not viable) | Posts no longer exist in current HEAD | |

**User's choice:** Restore from git history — plan handles it, no manual developer action

| Option | Description | Selected |
|--------|-------------|----------|
| Keep original filenames unchanged | Same YYYY-MM-DD-slug.md filenames → slug-preserving URLs matching Hugo :filename pattern | ✓ |
| Strip date prefix from filenames | Rename to slug-only — breaks CONT-03 | |

**User's choice:** Keep filenames identical to Hugo originals

---

## Image field logic

| Option | Description | Selected |
|--------|-------------|----------|
| featuredImage first, images[0] as fallback | Schema has both fields; resolution: `featuredImage ?? images?.[0] ?? undefined` in templates | ✓ |
| Normalize all posts to images[] during migration | Consolidate to one field during migration; posts modified | |
| featuredImage only, strip images field | Remove images: from posts with both fields | |

**User's choice:** featuredImage first, images[0] as fallback — resolution in template code (Phase 3), posts untouched

---

## Ignored fields handling

| Option | Description | Selected |
|--------|-------------|----------|
| Include in schema as optional, unused for now | code, fontawesome, subtitle in schema as optional; no build errors; templates don't use them yet | ✓ |
| Remove fields from posts during migration | Strip these fields from migrated posts; simpler schema but modifies originals | |
| Passthrough unknown fields (not in schema) | z.passthrough() for unknowns; simpler schema but loses type safety | |

**User's choice:** Include code.copy, fontawesome, subtitle as optional schema fields — validated but unused until Phase 3

---

## Agent's Discretion

- Date field typing (z.string vs z.coerce.date vs z.union)
- Tags default value ([] vs undefined when absent)
- Whether to add a build-time smoke test (astro check / astro build) after migration

## Deferred Ideas

None — discussion stayed within phase scope
