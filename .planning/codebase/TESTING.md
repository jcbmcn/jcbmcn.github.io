# Testing Patterns

**Analysis Date:** 2026-04-01

## Overview

This is a Hugo static site generator project. **There is no automated test suite.** No test framework, test runner, assertion library, or test files exist in this repository. All verification is manual or handled through the Hugo build process itself.

## Test Framework

**Runner:** None
**Assertion Library:** None
**Test Files:** None detected

No `jest.config.*`, `vitest.config.*`, `playwright.config.*`, `cypress.json`, or equivalent files exist. No `*.test.*` or `*.spec.*` files exist anywhere in the repository.

## How "Testing" Works in Practice

Verification happens through two mechanisms:

### 1. Local Preview (Manual)

```bash
hugo server              # Runs dev server at http://localhost:1313
hugo server -D           # Includes draft posts
hugo                     # Full build to public/ — catches template/config errors
```

The Hugo build process is the closest thing to a test: if `hugo` exits with code 0, the site builds successfully. Template errors, missing partials, and invalid front matter cause build failures with descriptive error output.

### 2. CI/CD Build Verification

**Workflow:** `.github/workflows/hugo.yml`
**Trigger:** Push to `main` branch

The CI pipeline runs `hugo --minify` on every push to `main`. A failed build prevents deployment. This acts as the only automated quality gate:

```yaml
- name: Build with Hugo
  run: |
    hugo \
      --minify \
      --baseURL "${{ steps.pages.outputs.base_url }}/"
```

If Hugo exits non-zero (template error, invalid config, broken content), the deploy step is never reached.

## What Hugo Validates Automatically

Hugo's build process catches:
- Invalid TOML in `hugo.toml`
- Malformed YAML front matter in content files
- Missing required template files
- Broken internal shortcodes
- Invalid markup configuration

Hugo does **not** catch:
- Broken external links
- Missing image files (renders as broken `<img>` tags)
- Incorrect front matter field values (e.g., wrong date format)
- Logical errors in content

## Known Gaps

- **No link checking** — broken external or internal links are not detected
- **No HTML validation** — generated HTML is not linted or validated
- **No accessibility testing** — no a11y checks in CI
- **No visual regression** — no screenshot diffing
- **No spell checking** — content is not spell-checked in CI
- **No front matter schema validation** — missing `featuredImage`, wrong tag formats, etc. fail silently

## Adding Tests (If Needed)

If automated testing is added in the future, the most practical options for a Hugo site are:

**Link checking:**
```bash
# htmlproofer or lychee can be added as a CI step after hugo build
lychee ./public --base https://jcbmcn.com
```

**HTML validation:**
```bash
# html-validator-cli or vnu.jar can check generated HTML
npx html-validate ./public/**/*.html
```

**Spell checking:**
```bash
# cspell or vale for Markdown content
npx cspell "content/**/*.md"
```

These would be added as steps in `.github/workflows/hugo.yml` after the `Build with Hugo` step and before the `Upload artifact` step.

---

*Testing analysis: 2026-04-01*
