# Countries App

A production-minded React SPA for browsing country data, viewing details, comparing countries, and sharing URL-driven state.

This README is intentionally high-level. Detailed architecture and implementation rules live in `docs/` and `.codex/*.rules.json`.

## Stack at a Glance

- React 19 + TypeScript
- Vite 7
- React Router 7
- TanStack Query 5
- Nuqs (URL query state)
- Axios + Zod
- i18next
- Vitest + React Testing Library + MSW
- Utility-class UI with shared primitives (no MUI dependency)

## Getting Started

Requirements:

- Node `>=24.12.0`
- npm `>=11.8.0`

Install and run:

```bash
npm install
npm run dev
```

Build and preview:

```bash
npm run build
npm run preview
```

## Common Commands

- `npm run dev` - start local development server
- `npm run build` - type-check and create production bundle
- `npm run lint` - run ESLint checks
- `npm run typecheck` - run TypeScript checks
- `npm run test:run` - run unit/integration tests once
- `npm run test:coverage` - run tests with coverage thresholds

## Quality Gates

The project enforces unit/integration coverage thresholds:

- lines: 65%
- statements: 65%
- functions: 60%
- branches: 60%

## Project Structure

```text
src/
  app/        # app shell, routes, providers
  pages/      # route entry pages
  features/   # feature modules (auth, dashboard, theme)
  shared/     # cross-feature infrastructure and reusable code
  i18n/       # localization setup and locales
  styles/     # global CSS and style tokens
docs/         # architecture and engineering documentation
```

## Documentation Map

- `docs/project-structure.md`
- `docs/design-system.md`
- `docs/state-management.md`
- `docs/api-layer.md`
- `docs/security.md`
- `docs/error-handling.md`
- `docs/performance.md`
- `docs/testing.md`
- `docs/progress.md`

## Environment

Use `.env.example` as the template. Project defaults are split into:

- `.env.development`
- `.env.production`

Only `VITE_*` variables are exposed to browser code.
