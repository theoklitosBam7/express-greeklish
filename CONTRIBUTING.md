# Contributing

## Development Setup

1. Install Node.js `>=22` and pnpm `>=10`.
2. Run `pnpm install`.
3. Run `pnpm dev` for local development.

## Pull Request Checklist

1. `pnpm typecheck`
2. `pnpm build`
3. `pnpm test`
4. Update `README.md`

## Commit Style

- Prefer conventional commit prefixes:
  - `feat:`
  - `fix:`
  - `perf:`
  - `refactor:`
  - `docs:`
  - `test:`
  - `build:`
  - `chore:`
  - `ci:`
  - `style:`
  - `revert:`

## Release and Changelog (Changesets)

This repo uses Changesets and a custom formatter at `.changeset/changelog.js`.

- Config: `.changeset/config.json` -> `"changelog": "./changelog.js"`
- The formatter is used when you run `pnpm exec changeset version`
- It does not read Git commit history directly
- It formats entries from `.changeset/*.md` files

### Summary Standard

Write the first summary line in conventional style:

- `type(scope): description`
- `type!: description`
- `type(scope)!: description`

Supported `type` values in the formatter:

- `feat`, `fix`, `perf`, `refactor`, `docs`, `test`, `build`, `chore`, `ci`, `style`, `revert`

Important:

- Only the first summary line is parsed as conventional type
- Extra lines are treated as details (kept as indented text)
- If you want separate changelog entries (for example `feat` and `build`), create separate changeset files

Example:

```md
---
'express-greeklish': minor
---

feat(api): add v1 convert endpoint with metadata

- Add POST /api/v1/convert with token-level correction metadata
- Add /healthz and /readyz endpoints
```

For breaking changes, mark the first line with `!` and use a `major` bump in the changeset frontmatter.

### Daily Workflow

1. Implement your change.
2. Run `pnpm exec changeset`.
3. Select bump type (`patch`/`minor`/`major`) for `express-greeklish`.
4. Write summary using the standard above.
5. Commit code and the generated `.changeset/*.md` file together.
6. Before release, run `pnpm exec changeset status`.
7. Generate release files with `pnpm exec changeset version` (updates `CHANGELOG.md` and `package.json`).
8. Commit the release-file changes, then run `pnpm exec changeset publish` when publishing.

## Reporting Issues

- Use the bug/feature templates.
- Include request payload examples and expected vs actual output where relevant.
