---
phase: 1
slug: scaffold-ci-cd
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-01
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Astro build (no test runner — validation via CLI commands) |
| **Config file** | `astro.config.mjs` |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build && test -f dist/CNAME && grep -q "jcbmcn.com" dist/CNAME` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build && test -f dist/CNAME && grep -q "jcbmcn.com" dist/CNAME`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 60 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 1-01-01 | 01 | 1 | INFRA-01, INFRA-04 | build | `npm run build && test -d dist` | ❌ W0 | ⬜ pending |
| 1-01-02 | 01 | 1 | INFRA-02 | file check | `grep -q "withastro/action@v5" .github/workflows/deploy.yml` | ❌ W0 | ⬜ pending |
| 1-01-03 | 01 | 1 | INFRA-03 | file check | `test -f public/CNAME && npm run build && grep -q "jcbmcn.com" dist/CNAME` | ❌ W0 | ⬜ pending |
| 1-02-01 | 02 | 2 | INFRA-05 | build check | `npm run build && ! find dist -name "test-draft*" -type f \| grep -q .` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `package.json` — Astro project scaffold with `build` script (created by `npm create astro`)
- [ ] `astro.config.mjs` — Config with `site: 'https://jcbmcn.com'`
- [ ] `public/CNAME` — Contains `jcbmcn.com`
- [ ] `.github/workflows/deploy.yml` — Replacement workflow with `withastro/action@v5`
- [ ] `src/content/blog/test-draft.md` — Draft post for INFRA-05 verification

*All verification commands depend on Wave 0 artifacts. No pre-existing test files.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| jcbmcn.com loads Astro page (not Hugo) | INFRA-01 (deployed) | Requires live deployment | Visit https://jcbmcn.com after merging to main |
| Pushing to main triggers deploy within ~2 min | INFRA-02 (live) | Requires live GitHub Actions run | Check Actions tab after push to main |
| Cloudflare DNS resolves correctly | INFRA-03 (DNS) | DNS propagation is external | `dig jcbmcn.com` should return GitHub Pages IPs |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
