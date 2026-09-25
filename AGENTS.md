# Bulletproof React agent instructions

This repository is a standalone React application shell. Work from this root; do not create a nested project or import files outside it. Preserve unrelated changes. Do not stage, commit, push, open a PR, discard work, or alter `.git` without explicit authorization.

## Read before work

- `.agents/rules/frontend/architecture.md` and `.agents/rules/frontend/code-style.md` for all frontend changes.
- `.agents/rules/shared/api-contract.md` for API, OpenAPI, Orval, or MSW changes.
- `docs/architecture.md` for ownership, exceptions, and extension points.
- `.agents/skills/feature-sliced-design/SKILL.md` for architecture changes, plus its relevant references.
- Use installed library skills for the library being changed. TanStack Intent skills are versioned inside installed packages; `pnpm skills:list` shows the available set and `pnpm skills:load '<package>#<skill>'` loads one.

## Stack and boundaries

React 19, strict TypeScript, Vite+, TanStack Router/Query/Form/Table, Orval, Zod, MSW, Tailwind v4, shadcn-generated Radix controls, Vitest, Testing Library, and Playwright. Package and runtime versions are pinned in `package.json`; use the lockfile, not global defaults. The Vite+ config owns Oxfmt/Oxlint and the React Compiler.

Use only `src/app`, `src/pages`, `src/shared` FSD layers until real reuse earns another. App initializes; pages own their route-specific behavior; Shared stays domain-neutral. Imports descend, page slices expose `index.ts`, and no sibling page cross-imports. The generated route tree and Orval output are not manually edited.

## Commands

| Command                                            | Purpose                                                    |
| -------------------------------------------------- | ---------------------------------------------------------- |
| `pnpm install --frozen-lockfile`                   | Reproducible install                                       |
| `pnpm dev`                                         | Local app; browser MSW defaults on                         |
| `pnpm build` / `pnpm preview`                      | Production bundle / local preview                          |
| `pnpm typecheck` / `pnpm lint`                     | Type and Oxlint diagnostics                                |
| `pnpm format` / `pnpm format:check`                | Oxfmt write / verify                                       |
| `pnpm fsd:check`                                   | Steiger architecture check                                 |
| `pnpm test` / `pnpm test:ci`                       | Vitest watch / single run                                  |
| `pnpm test:e2e`                                    | Playwright smoke                                           |
| `pnpm api:gen` / `pnpm api:check`                  | Generate / non-mutating drift check                        |
| `pnpm ui:add <component>`                          | Add reviewed shadcn source                                 |
| `pnpm check`                                       | Non-interactive static, unit, and build gate               |
| `pnpm prepare-vite-hooks`                          | Enable opt-in local pre-commit dispatcher                  |
| `pnpm outdated` / `pnpm outdated:fresh`            | Inspect updates under normal / bypassed release-age policy |
| `pnpm upgrade:interactive` / `pnpm upgrade:latest` | Reviewed package updates; latest upgrades all packages     |
| `pnpm upgrade:latest:fresh`                        | Explicit 24-hour release-age bypass for package upgrades   |

Keep hooks non-destructive: staged formatting/lint plus full type/FSD checks; tests stay in CI or explicit runs. A local hook is never the only gate. See `README.md` for environment variables, scenarios, and replacement workflow.

Keep project-owned executable scripts in TypeScript. Use a native CLI when it covers the task. `public/mockServiceWorker.js` is the sole checked-in JavaScript exception: an MSW-generated browser asset, never handwritten.

Package upgrades are opt-in and may rewrite `package.json` and `pnpm-lock.yaml`. Review both, the catalog/overrides and release-age exceptions, then run `pnpm check` and `pnpm test:e2e`. Never run the `:fresh` bypass as routine maintenance.
