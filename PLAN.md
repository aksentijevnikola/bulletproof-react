# Bulletproof React — final implementation contract

The current directory is the standalone application; there is no nested `bulletproof-react/` folder. This document records the approved implementation contract and acceptance standard. The transformation was approved after this plan was written; use the README and architecture document for current operating instructions.

The pre-transformation checkout contained substantial tracked and untracked work. That work was inventoried and backed up before conversion; it was not reset or discarded.

## 1. Outcome and boundaries

A clean checkout must let a developer run `pnpm install` and `pnpm dev`, then explore a polished React shell without a backend. It must also provide a clear path to connect a real OpenAPI service later.

The finished root will have:

- Package name `bulletproof-react` and application name “Bulletproof React.”
- React 19, strict TypeScript, Vite+, pnpm, TanStack Router/Query, Zod, MSW, Vitest/Testing Library/user-event, Playwright, React Compiler, Oxlint/Oxfmt, Tailwind v4, and selected shadcn/Radix components.
- A responsive, accessible shell; light/dark/system theme; home, sample-record list, sample-record detail, and not-found views.
- Deterministic mocked list/detail/mutation flows, including loading, empty, malformed-response, server-error, retry, and mutation pending states.
- A documented, non-mutating-to-source verification path and a reproducible lockfile.

It will **not** contain the original product’s names, UI kit, backend dependency, authentication policy, roles, workflows, routes, contracts, translations, fixtures, credentials, private packages, or deployment assumptions. Authentication, i18n, a global client-state library, Storybook, and telemetry SDKs are not starter features; each is added by a future product only when needed.

## 2. Frozen architecture decisions

### FSD ownership

Start with exactly three FSD layers: `app`, `pages`, and `shared`. Page-specific UI, queries, forms, validation, and mutation orchestration stay in their page slices. Global routing, providers, error boundary, layout, and theme live in `app`. Business-neutral controls and transport infrastructure live in `shared`.

Imports descend `app → pages → shared`. Page slices do not import sibling page slices. Each page exports through its `index.ts`; shared code has focused entry points such as `@/shared/ui/Button` and `@/shared/api/sample-records`, with no broad `shared/index.ts`. Use `@/* → src/*`, purpose-based filenames, and explicit type-only imports.

Add `features` only for a complete interaction with multiple actual consumers and one independent reason to change. Add `entities` only for a stable, reused domain rule. Do not create empty layers or a `widgets` layer. Place the app shell in `app/layouts`, **not** `app/ui`, which Steiger flags. These choices follow the current [FSD layer guidance](https://fsd.how/docs/reference/layers/); use the current `steiger` and `@feature-sliced/steiger-plugin` packages for enforcement. [Steiger installation and rules](https://github.com/feature-sliced/steiger).

Proposed shape, omitting individual tests and generated files for readability:

```text
./
├── .agents/
│   ├── rules/{frontend,shared}/
│   └── skills/
├── .github/workflows/             # if the destination is GitHub
├── .vite-hooks/
├── .vscode/
├── docs/
│   ├── architecture.md
│   └── decisions/
├── e2e/
├── openapi/
│   └── sample-records.yaml
├── public/
│   ├── favicon.svg
│   └── mockServiceWorker.js
├── src/
│   ├── app/
│   │   ├── layouts/
│   │   ├── providers/
│   │   ├── routes/
│   │   ├── styles/
│   │   ├── main.tsx
│   │   └── router.tsx
│   ├── pages/
│   │   ├── home/
│   │   ├── sample-records/
│   │   └── sample-record-detail/
│   ├── shared/
│   │   ├── api/
│   │   │   ├── generated/
│   │   │   └── sample-records/
│   │   ├── config/
│   │   ├── lib/
│   │   └── ui/
│   └── test/
├── .env.example
├── AGENTS.md
├── CLAUDE.md
├── components.json
├── index.html
├── orval.config.ts
├── package.json
├── playwright.config.ts
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── README.md
├── tsconfig*.json
└── vite.config.ts
```

Steiger now runs through its native CLI without a project-owned config or runner; the generated Orval schemas use a Steiger-compatible directory name.

TanStack Router’s plugin must explicitly use `src/app/routes` and its intended generated route-tree path; moving routes without configuring the plugin is not sufficient. Route files stay thin and import page public APIs. Router handles route pending, route errors, and unknown URLs; Query owns server-state cache and invalidation. Use shared query options so a route loader can `ensureQueryData` and the page can read the same Query cache without a second fetch. Distinguish an unknown URL from a missing sample record. [Router Vite setup](https://tanstack.com/router/latest/docs/installation/with-vite), [Router–Query integration](https://tanstack.com/router/latest/docs/integrations/query).

### API and generation

Use a small, neutral, repository-owned OpenAPI document as the demonstration contract. Orval is the chosen future-service workflow—not a dependency on the original backend. Generate Fetch/TanStack Query functions and Zod schemas into `src/shared/api/generated`. Expose only a handwritten, stable `shared/api/sample-records` façade to pages.

Prefer Orval’s built-in Fetch runtime response validation, with generated Zod schemas and no custom mutator for the demo. A custom mutator can bypass Orval’s generated parse, so any future mutator must provide its own proven validation path. Test malformed responses against the actual request path, not merely against a schema in isolation. [Orval runtime-validation documentation](https://orval.dev/docs/reference/configuration/output/).

The local OpenAPI document and generated client output will be committed so a clean checkout starts without running code generation or reaching a server. `pnpm api:gen` regenerates them explicitly; nobody hand-edits generated output. Add an `api:check` that regenerates to a temporary location and compares results without rewriting tracked source. If that comparison cannot be made reliable across supported platforms, implementation stops to revise this policy rather than disguising a source-mutating generator as a check.

Do not use Orval/Faker-generated random handlers as the authoritative demonstration data. Handwritten MSW handlers and fixed fixtures are clearer, deterministic, and removable with the demo. The mock contract covers list, detail, rename, missing record, empty list, malformed response, persistent server error, and a transient failure that succeeds on retry.

### UI and state

Tailwind v4, installed through its Vite plugin, and a deliberately small set of shadcn components using the Radix base form the UI foundation. Configure `components.json` to generate into FSD-compatible `shared/ui` paths. The CLI is a source generator: review its output and never allow an automatic overwrite of customized components. CSS custom properties are the single semantic token source; CSS Modules remain valid for localized component styling, not as a second design-token system. [Tailwind Vite setup](https://tailwindcss.com/docs/installation/using-vite), [shadcn configuration](https://ui.shadcn.com/docs/components-json).

The list uses TanStack Table for a real, modest sorting interaction; the detail rename form uses TanStack Form with Zod validation. That earns those existing dependencies. URL state belongs to TanStack Router; remove nuqs unless a concrete need survives. Query owns server state; do not mirror it into React state or introduce Zustand/Redux for the starter.

Retain the current React Compiler integration, audit the effective Hooks/Compiler Oxlint rules—including exhaustive dependencies—and verify representative compiled output during implementation. Do not add routine `useMemo`/`useCallback`, but do not strip existing memoization without evidence. [React Compiler setup](https://react.dev/learn/react-compiler/installation).

## 3. Observable application behavior

The root route shows the shell and a neutral introduction. Primary navigation reaches the sample-record list, then a detail route. The header includes an accessible mobile menu and theme control. A skip link, semantic landmarks, visible focus, keyboard-operable navigation, labeled controls, and responsive layouts are required. The target is WCAG 2.2 AA for the implemented interactions, supported by automated and manual checks. [WCAG 2.2 guidance](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/).

The list displays a pending state before the delayed mock resolves, then a sortable table or an empty state. The detail shows one record and a small rename form. Submission visibly enters a pending state, updates the mocked resource, and invalidates affected list/detail queries. Retry must be demonstrated with a failure that can recover; a persistent-error scenario remains available separately. Route pending thresholds and mock latency must be configured so pending UI is genuinely observable—TanStack Router’s default threshold may hide a short mock delay. [Route pending options](https://tanstack.com/router/latest/docs/api/router/RouteOptionsType).

`VITE_MOCK_MODE` defaults to enabled in development. `VITE_MOCK_SCENARIO` selects documented deterministic development scenarios. Tests override handlers directly. Mock startup is guarded by development mode, even if a production build receives a mock flag. Disabling mocks makes requests to the configured API base and produces an honest error when no service exists; there is no hidden local fallback. Browser and Node tests share handler behavior, and tests reset mutation state. `VITE_*` variables are public build inputs, never secrets. [Vite environment rules](https://vite.dev/guide/env-and-mode).

Playwright’s primary smoke suite uses Chromium and checks visible outcomes rather than trying to intercept MSW-owned requests. A separate cross-browser strategy may be added later; Playwright documents service-worker limitations. [Playwright service workers](https://playwright.dev/docs/service-workers).

## 4. Tooling and command contract

Keep the compatible, pinned Node/pnpm/Vite+ toolchain and lockfile unless actual verification demonstrates a need to change it. The currently declared Vite+ version is a release candidate, so upgrades require compatibility review and a passing baseline—not `upgrade:latest` as routine maintenance. Preserve useful release-age/build-script policy after pruning obsolete exceptions. Remove any “clean install” script that deletes the lockfile. Vite+ remains the single Oxfmt/Oxlint configuration owner in `vite.config.ts`; do not add competing formatter/linter configs.

| Command                                  | Required behavior                                                                     |
| ---------------------------------------- | ------------------------------------------------------------------------------------- |
| `pnpm dev`, `pnpm preview`, `pnpm build` | Local development, built preview, production bundle                                   |
| `pnpm typecheck`, `pnpm lint`            | Explicit diagnostic commands                                                          |
| `pnpm format`, `pnpm format:check`       | Write formatting; verify formatting without source edits                              |
| `pnpm fsd:check`                         | Steiger architecture validation                                                       |
| `pnpm test`, `pnpm test:ci`              | Watch and non-interactive Vitest                                                      |
| `pnpm test:e2e`                          | Playwright smoke, separate from default check                                         |
| `pnpm api:gen`, `pnpm api:check`         | Explicit generation; non-mutating-to-source drift check                               |
| `pnpm check`                             | Format verification, FSD, typecheck, lint, API drift, unit/component tests, and build |

`vp check` remains useful as a fast local static check, but it does not cover FSD, tests, API drift, or build. [Vite+ check](https://www.viteplus.dev/guide/check).

A tracked `.vite-hooks/pre-commit` will run staged formatting/lint plus whole-project type and FSD checks; tests and E2E stay out of the hook. Formatting changes must fail visibly for review rather than silently changing the staged diff. A safe setup script should enable the Vite+ dispatcher for a Git clone, respect a local opt-out, and do nothing harmful when someone downloads an archive without `.git`. Verify `vp hooks status`; a tracked hook file alone does not prove enforcement. CI runs the full authoritative checks because local hooks are bypassable. [Vite+ commit hooks](https://viteplus.dev/guide/commit-hooks).

Vite+’s local `vite:generator` requires a monorepo, so this single-app project will **not** acquire a monorepo merely for component generation. Pin and document the shadcn CLI for primitive generation. A custom page generator is deferred until repeated page additions establish a stable template. [Vite+ generator scope](https://www.viteplus.dev/guide/create). Also retain `@/*` paths without TypeScript `baseUrl`; Vite+ documents a type-check limitation with `baseUrl`, so generic shadcn setup instructions must be adapted and tested. [Vite+ troubleshooting](https://www.viteplus.dev/guide/troubleshooting).

## 5. Repository guidance and documentation

`AGENTS.md` becomes the canonical root instruction file; `CLAUDE.md` becomes a short pointer to it. `.agents/rules` contains frontend and frontend–backend-shared guidance only. Preserve useful vendor/library skills with verified provenance and version information, add the current FSD skill, and retain TanStack Intent loading only for installed packages it actually supports. Remove duplicate `.claude/skills`, backend skills, product-specific project skills, and stale parent-directory references after ownership review. Legacy guidance that mandated a proprietary UI kit or prohibited Tailwind must be rewritten rather than treated as the target architecture.

Rewrite the README and add a concise architecture document/ADR covering the three FSD layers, public APIs, why `widgets` is omitted, Router/Query ownership, API generation, mock replacement, token/styling conventions, and deliberate removals. Document prerequisites, every script, environment variables, deployment/base-path and SPA-fallback requirements, testing, how to add a page, when to add a feature/entity, how to remove the demo, and known limitations. Production hosting must supply its own security headers; Vite preview headers are not a deployment policy. `vite preview` is not the production server. [Vite static deployment](https://vite.dev/guide/static-deploy).

Adapt VS Code recommendations for the chosen Oxc/Tailwind stack without absolute local paths. Add CI for the confirmed destination host, dependency-update guidance, browser support, contribution instructions, and an explicit license/third-party attribution decision before public reuse.

## 6. Safe execution order and checkpoints

0. **Ownership gate.** Refresh Git status; inventory tracked, untracked,
   generated, vendored, externally owned, and uncertain paths; map every
   proposed deletion to imports, scripts, and docs. Preserve unrelated changes
   and arrange durable protection for untracked files slated for removal.

   **Checkpoint:** Present the exact removal manifest and recoverability; pause
   if ownership overlaps cannot be resolved.

1. **Toolchain foundation.** Rename the package; adapt pins, workspace policy,
   aliases, Vite+, TypeScript, formatting, lint, FSD, environment parsing,
   hooks, and lockfile through package-manager commands.

   **Checkpoint:** A fresh install succeeds; static checks run without the
   original backend or UI kit.

2. **App shell.** Add the root entry, Router configuration, providers, layout,
   theme, navigation, global error boundary, home, and not-found pages.

   **Checkpoint:** Keyboard, mobile, and theme tests and local visual inspection
   pass.

3. **Data boundary.** Add the neutral OpenAPI document, Orval output, runtime
   response validation, transport façade, browser/Node MSW, fixed fixtures,
   and scenarios.

   **Checkpoint:** Generated drift check, validation tests, and backend-free
   startup pass.

4. **Vertical demo.** Add list, detail, sorting, rename form/mutation,
   pending/empty/error/retry states, and cache invalidation.

   **Checkpoint:** Focused behavioral tests pass for every state; there are no
   sibling-page or generated-internal imports.

5. **Cutover and cleanup.** Switch the application entry to the new shell;
   remove only manifested original-product code, dependencies, assets, routes,
   contracts, docs, and duplicate skills.

   **Checkpoint:** Search for product/private terms and external-root imports;
   review each material removal and its Git recoverability.

6. **Sustainability.** Add README/ADR, agent rules, VS Code, CI, hook
   verification, deployment notes, and dependency/license policy.

   **Checkpoint:** A new-developer walkthrough follows the docs without
   insider knowledge.

7. **Final verification.** Install; run all checks, build, and Playwright;
   start the local server; exercise success, empty, and error states; scan
   dependencies, dead imports, and links; review the diff and status.

   **Checkpoint:** Record each executed command and exit result; report
   anything not successfully verified.

Each phase is broken into small, reviewable tasks when implementation starts. Do not stage, commit, push, open a PR, discard changes, or replace `.git` under this contract. Code transformation approval does **not** authorize replacing `.git`; that operation needs a separate request after the shell and a durable recovery plan are complete.

## 7. Definition of done and remaining authority

The implementation is complete only when a clean checkout installs, starts, builds, passes the named checks and Chromium smoke test, works without a backend, contains no original-product material, and allows another developer to replace the demo/API without studying the original product. The final handoff must enumerate retained, generalized, and removed material; materially removed directories; whether each was Git-recoverable; documentation changes; command outcomes; and limitations.

Replacement of `.git` remains outside automatic implementation authority. The owner chose the MIT license; attribution is recorded in `THIRD_PARTY_NOTICES.md`.

The in-scope application transformation was approved. Verification results belong in the implementation handoff, not in this historical contract.
