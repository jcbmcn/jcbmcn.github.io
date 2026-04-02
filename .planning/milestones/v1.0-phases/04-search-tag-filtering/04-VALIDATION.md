---
phase: 4
slug: search-tag-filtering
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-02
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | npm build + hugo server (manual browser verification) |
| **Config file** | `package.json` (Astro scripts) |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build && npx astro check` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build && npx astro check`
- **Before `/gsd-verify-work`:** Full suite must be green + manual browser checks pass
- **Max feedback latency:** ~15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 01 | 1 | INFRA (prerequisite) | build | `npm run build` | ✅ | ⬜ pending |
| 04-01-02 | 01 | 1 | SRCH-01 | build + manual | `npm run build` | ✅ | ⬜ pending |
| 04-02-01 | 02 | 2 | SRCH-01, SRCH-02 | build + manual | `npm run build` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements.* No test framework install needed — validation is via `npm run build` (TypeScript/Astro compile check) plus manual browser verification.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Tag filter AND logic works | SRCH-01 | DOM interaction required | Activate 2 tags → confirm only posts matching BOTH appear |
| Free-text search real-time | SRCH-02 | Keypress behavior | Type in search box → posts filter on each keystroke |
| `ignoreLocation: true` | SRCH-02 | Mid-string match | Type "automation" → Power Automate post appears |
| Empty state displays | SRCH-01+02 | DOM state check | Type "xyznotaword" → empty state paragraph appears |
| Clear filters resets all | SRCH-01+02 | Multi-state reset | Activate tag + type query → click "× Clear filters" → all posts show |
| Keyboard accessible | SRCH-01+02 | A11y check | Tab to chips → press Enter/Space → chip activates |
| ARIA attributes correct | SRCH-01+02 | A11y check | DevTools: active chip has `aria-pressed="true"` |
| Post card tags clickable | SRCH-01 | PostCard interaction | Click tag on post card → filter bar chip activates |

---

*Phase: 04-search-tag-filtering*
*Created: 2026-04-02*
