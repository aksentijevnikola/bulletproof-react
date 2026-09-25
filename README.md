# Bulletproof React

A small, reusable React application shell that runs without a backend. It demonstrates routing, asynchronous data, runtime validation, accessible UI, theming, and a replaceable API boundary. The sample-record feature is intentionally disposable; it is not a starter domain model.

This is not an authentication, authorization, deployment, or backend template. Add those only for a real product with an approved contract.

## Start here

Use the exact Node and pnpm versions declared in `package.json` (`devEngines`). Vite+ manages the local runtime; do not substitute a globally installed Vite. From this repository root:

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Open the address printed by the dev server (normally `http://localhost:5173`). No service, database, seed step, or secret is required. `pnpm install` also works for normal development; `--frozen-lockfile` is the reproducibility check. Run `pnpm exec playwright install chromium` once before browser tests.

## Commands

| Command                                                     | Purpose                                                          |
| ----------------------------------------------------------- | ---------------------------------------------------------------- |
| `pnpm dev`                                                  | Vite+ development server; MSW browser worker starts by default   |
| `pnpm build` / `pnpm preview`                               | Production build / local preview of built assets                 |
| `pnpm typecheck`                                            | Strict TypeScript project checks                                 |
| `pnpm lint`                                                 | Oxlint through Vite+                                             |
| `pnpm format` / `pnpm format:check`                         | Oxfmt write / read-only verification                             |
| `pnpm fsd:check`                                            | Steiger FSD boundary check                                       |
| `pnpm test` / `pnpm test:ci`                                | Vitest watch / one run with Testing Library and Node MSW         |
| `pnpm test:e2e` / `pnpm test:e2e:ui`                        | Chromium Playwright smoke / interactive runner                   |
| `pnpm api:gen` / `pnpm api:check`                           | Orval generation / source-preserving generated drift comparison  |
| `pnpm ui:add <name>`                                        | Run the pinned shadcn CLI; review generated source               |
| `pnpm skills:list` / `pnpm skills:load '<package>#<skill>'` | Discover/load installed TanStack Intent guidance                 |
| `pnpm prepare-vite-hooks`                                   | Opt in to the tracked local pre-commit hook                      |
| `pnpm outdated`                                             | Inspect dependency updates before a reviewed upgrade             |
| `pnpm outdated:fresh`                                       | Inspect versions even inside the 24-hour release-age window      |
| `pnpm upgrade:interactive`                                  | Select packages to update through Vite+                          |
| `pnpm upgrade:latest`                                       | Opt-in update of all packages to latest eligible versions        |
| `pnpm upgrade:latest:fresh`                                 | Opt-in latest update bypassing the 24-hour release-age policy    |
| `pnpm check`                                                | Format, FSD, types, lint, API drift, unit/component tests, build |

`pnpm check` is non-interactive. Playwright stays separate because browser installation is a one-time external prerequisite. CI runs both. The local pre-commit hook checks staged formatting and lint, then runs type/FSD checks; it does not rewrite staged files or run tests. Hooks are opt-in per clone and bypassable, so CI is authoritative. Use `VP_GIT_HOOKS=0 pnpm prepare-vite-hooks` to skip setup. In an archive without `.git`, setup exits without changing anything. A tracked hook file alone does not mean hooks are enabled.

Project-owned executable tooling is TypeScript. `pnpm fsd:check` calls Steiger's native CLI; `cross-env` enables polling portably because filesystem watchers can exhaust file descriptors on macOS. No project-owned JavaScript runner or Steiger config is needed. The sole checked-in `.js` file is MSW's generated browser service worker, which browsers require as a served JavaScript asset; never edit it manually. Installed dependencies and production bundles also contain JavaScript by design.

Dependency upgrades are deliberate, not part of install or CI. Start with `pnpm outdated`, prefer `pnpm upgrade:interactive` for a narrow reviewed change, and use `pnpm upgrade:latest` only when deliberately upgrading the full graph. The `:fresh` variants explicitly bypass `minimumReleaseAge: 1440` for newly resolved packages; they are not routine maintenance. After any update, inspect `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml` (catalog, overrides, `allowBuilds`, and release-age exceptions), then run `pnpm check` and `pnpm test:e2e`. The Vite+/Vite/Vitest catalog trio needs a separate [aligned toolchain upgrade](https://viteplus.dev/guide/upgrade-project), not an assumption that `upgrade:latest` changes it. These package commands do not change the pinned Node/pnpm runtime; that is a separate toolchain decision.

## Environment and mocks

Copy `.env.example` to `.env.local` only if changing defaults. All `VITE_*` variables are public browser inputs; never put credentials in them.

| Variable             | Default                          | Behavior                                                                |
| -------------------- | -------------------------------- | ----------------------------------------------------------------------- |
| `VITE_API_BASE_URL`  | empty                            | Same-origin `/api`; set an absolute service origin when mocks are off   |
| `VITE_MOCK_MODE`     | `on` in dev, `off` in production | Browser MSW control; production never starts the worker                 |
| `VITE_MOCK_SCENARIO` | `success`                        | `success`, `empty`, `server-error`, `validation-error`, or `retry-once` |

During local development you can also add `?mock=empty`, `?mock=server-error`, `?mock=validation-error`, or `?mock=retry-once` to a route URL. The demo returns fixed records after a 350 ms delay; rename persists within the current mock worker until it is reset. Tests use the same handlers in an MSW Node server and reset state after each test. Turning mocks off does **not** fall back to fixture data: requests go to the configured service and fail honestly if none exists. The committed `public/mockServiceWorker.js` is an MSW-owned generated asset; regenerate it with `pnpm exec msw init public --save`, never edit it manually.

The sample API contract is `openapi/sample-records.yaml`. Orval creates Fetch/TanStack Query functions and Zod schemas in `src/shared/api/generated`; the generated output is committed for backend-free startup and should only change through `pnpm api:gen`. Pages consume the focused `@/shared/api` entry, not generated internals. Orval validates JSON responses; the handwritten façade also checks HTTP status and parses every returned body, including non-JSON responses. The mock handlers are independent of Orval's random fixture generation.

To connect a service: replace or point Orval to its approved OpenAPI document, run `pnpm api:gen`, review the changed generated contract, set `VITE_API_BASE_URL`, turn `VITE_MOCK_MODE=off`, and adapt the focused API entry and owning pages. Preserve runtime validation. Delete `src/shared/mocks`, the worker, and scenario configuration once no mock consumer remains. Do not silently invent server routes or client-only authorization rules.

## Structure and boundaries

```text
src/
  app/       entry, Router, providers, layout, global error handling, theme
  pages/     home, record list, record detail and their local UI/data logic
  shared/    neutral API/config/mock infrastructure and UI primitives
  test/      shared test setup and MSW Node server
openapi/     replaceable demonstration contract
e2e/         browser-level smoke tests
```

Imports descend `app → pages → shared`; page slices never import each other. Every page exposes an `index.ts` public API, and callers must not reach into another slice's internals. Shared exposes focused entry points, not a broad `shared/index.ts`. `@/*` maps to `src/*`. Steiger checks FSD structure; TypeScript, linting, and tests cover other boundaries. `src/app/routeTree.gen.ts` and `src/shared/api/generated` are generated and committed so typecheck/tests work in a clean checkout. Never edit them manually. See [architecture](docs/architecture.md) for the decisions and intentional exceptions.

To add a page, create `src/pages/<page>/index.ts` and its local UI/data modules, then add a thin file route in `src/app/routes` importing the page's public API. Put route-specific validation, Query options, and forms in the page. Add a `features` slice only when a complete interaction has multiple real consumers and an independent reason to change; add `entities` only for a stable reused domain rule. Do not create empty layers or a `widgets` layer for routine layout.

## UI and quality policy

Tailwind v4 utilities consume semantic CSS custom properties defined in `src/app/styles.css`; do not hard-code colors in components. CSS Modules remain available for complex local styling. shadcn-generated Radix primitives are editable source in `src/shared/ui`, not a hidden binary dependency. Check generator diffs before accepting them. The theme supports system, light, and dark; the navigation has a mobile keyboard-operable menu, skip link, focus styles, and semantic landmarks.

Use React Compiler for routine optimization. Do not add memoization or state-mirroring effects by habit. Query owns server state; Router owns URLs; Form owns the example form; Table owns sorting. Responses and form input are validated with Zod. The test suite covers routes, pending/empty/error/retry, validation, mutation, theme, and keyboard interaction; Playwright covers a real Chromium flow. Automated accessibility assertions do not replace a manual screen-reader and cross-browser review.

## Reuse and deployment

To reuse the shell, keep `src/app`, the neutral parts of `src/shared`, tooling, and checks. Remove the example page slices (`src/pages/records`, `src/pages/record-detail`), sample routes, `openapi/sample-records.yaml`, generated sample client, `src/shared/mocks`, worker, and demo tests together after checking imports. Replace the home copy and favicon. Do not retain compatibility layers for sample records. The shell's route and UI infrastructure should remain after this removal.

Deploy the built `dist/` directory as a static SPA and configure the host to fall back to `index.html` for client routes. If hosted below a path prefix, configure Vite `base` and Router base path together; this starter assumes `/`. Set real security headers at the host or CDN; `pnpm preview` is for local inspection, not production serving. No authentication, i18n, telemetry, or cross-browser matrix is included. The current build reports one JavaScript chunk above Vite's 500 kB warning threshold; measure and split it when the shell grows rather than hiding the warning. The Vite+ toolchain is currently pinned to a release candidate; upgrade only with a passing install/check/browser baseline. Review the exact release-age exceptions in `pnpm-workspace.yaml` when dependencies mature.

See [contributing](CONTRIBUTING.md), [agent guidance](docs/agent-skills.md), [the implementation contract](PLAN.md), [license](LICENSE), and [third-party notices](THIRD_PARTY_NOTICES.md).
