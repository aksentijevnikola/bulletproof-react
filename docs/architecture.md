# Architecture decision: minimal reusable shell

Status: adopted. The project is a standalone frontend root, not a workspace package or a copy of its source application.

## Why these layers

Only `app`, `pages`, and `shared` have demonstrated responsibilities. `app` composes the Router, Query provider, global error boundary, theme, and responsive shell. Each `pages` slice owns one route's UI and data interaction. `shared` contains only neutral configuration, transport, mock wiring, and UI primitives. Import direction is `app → pages → shared`, with no page-to-page imports. Steiger checks layer structure; page `index.ts` files are public APIs, and routes use those exports. The focused `shared/api` entry is an intentional segment entry point, not a repository-wide barrel.

No `widgets` layer is used: the application layout belongs in `app/layouts`, and current FSD guidance discourages routine widget extraction. No `features` or `entities` directories exist until actual cross-page reuse and separate change ownership justify them. An example record is not a durable business entity.

`src/test` is an intentional non-FSD test-support directory. TanStack Router route files live under `app/routes` because they are application composition; the generated route tree is committed for clean-checkout typecheck/tests, excluded from Steiger, and not hand-edited. Orval output is likewise committed, generated/external ownership, and excluded from Steiger. Its façade in `shared/api` is handwritten, reviewed source. shadcn primitives live directly in `shared/ui` because the generator produces editable component source; consumers use focused module paths.

## State and transport

Router owns URLs and route lifecycle, including pending, error, and not-found handling. Route loaders prime TanStack Query via page-owned query options; page components consume the same cache. Query owns async state and invalidation after rename. TanStack Form owns the local form; Zod validates its input. Table handles the list's sorting interaction without a separate global state store.

`openapi/sample-records.yaml` is a small repository-owned example contract. Orval generates Fetch/TanStack Query operations and Zod response schemas. Its built-in runtime validation checks JSON; the handwritten `shared/api` façade additionally rejects non-200 statuses and parses every returned body with the generated schema, because Orval otherwise passes non-JSON success bodies through as typed data. Page-owned Query options call that façade, and route loaders share their cache. `VITE_API_BASE_URL` is parsed once in `shared/config/env.ts`. MSW intercepts the same requests in development and tests using deterministic fixtures and realistic delay. Mock startup is dev-only and explicit; disabling it exposes the real transport path without a fixture fallback. When a service is ready, replace the contract and regenerate, then adapt only the API entry and owning pages. Remove the demo worker/handlers/fixtures rather than preserving them as a production dependency.

## Styling and quality

Tailwind v4 and CSS variables in `app/styles.css` form one semantic token system. shadcn-generated Radix controls are editable, not proprietary, and CSS Modules may be used for local styles. React Compiler handles routine memoization. Vite+ owns Oxfmt/Oxlint, with strict TypeScript, Vitest/Testing Library/MSW, Steiger, Orval drift detection, and a separate Playwright smoke gate. The tracked pre-commit hook is optional per clone; CI is authoritative.

## Transformation record

Useful patterns generalized from the source project: pinned pnpm/Vite+ toolchain, React Compiler, TanStack Router/Query/Form/Table, Orval generation, Zod validation, MSW testing, pre-commit checks, and editor setup. Deliberately removed: its proprietary UI kit, backend and deployment coupling, generated service contracts, auth/permission policies, original domain flows, translations, brand assets, and product-specific agent guidance. The source checkout and all pre-existing untracked files were archived outside this root before cutover; tracked changes have a separate patch backup. `.git` was not replaced by the application transformation.

Known boundaries: the starter assumes root-path SPA hosting and Chromium for browser smoke. It does not provide a real API, server authorization, production headers, screen-reader certification, or cross-browser acceptance. The façade reports transport/validation failures generically; a real service integration should define typed error responses before relying on status-specific UI. Orval may parse an invalid JSON error body against the success schema before the façade sees its status, which still fails closed but loses the status detail.
