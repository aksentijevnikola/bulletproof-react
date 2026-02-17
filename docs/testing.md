# Frontend Testing Architecture

Authoritative testing model for the Bulletproof React frontend core.

This document is descriptive. Enforceable rules live in `.codex/codex.rules.json`.

## 1) Purpose

- Keep test strategy consistent across features.
- Prioritize user-visible confidence over implementation coupling.
- Prevent ad-hoc test patterns.

## 2) Core Principles

- Behavior over implementation details.
- Determinism over convenience.
- Integration tests by default.

## 3) Testing Stack

Required:

- Vitest
- React Testing Library
- `@testing-library/user-event`
- MSW

Optional:

- Visual regression tooling
- E2E tooling (only when CI/runtime constraints are satisfied)

## 4) Test Types

### Unit Tests (Rare)

Use for pure helpers and deterministic transformations.

### Integration Tests (Default)

Use for component/hook behavior, feature flows, and query/network interactions.

## 5) Mocking Strategy

Mock only real externals:

- Network (MSW)
- Time
- Missing browser APIs
- Storage APIs when needed

Avoid mocking:

- React Query internals
- Feature logic
- Internal modules for convenience

MSW expectations:

- Shared infra under `src/shared/test/msw/**`
- Fail on unhandled requests
- Feature tests own handler registration via `server.use(...)`

## 6) Snapshot Policy

Allowed:

- Small, stable, reviewable snapshots
- File snapshots for compact HTML/SVG/JSON outputs

Avoid:

- Full-tree React snapshots
- Large fragile DOM snapshots

## 7) Placement Rules

- Co-locate tests with source under `src/**`.
- Allowed patterns:
  - `src/features/**/**/*.test.ts(x)`
  - `src/shared/**/**/*.test.ts(x)`
  - `src/pages/**/**/*.test.ts(x)`
  - `src/app/**/**/*.test.ts(x)`
- Forbidden:
  - `__tests__` directories
  - cross-feature test imports
  - global test dumping folders

## 8) Coverage Philosophy

Coverage is a floor, not a goal. Prefer meaningful tests for critical feature flows.

## 9) Related Docs

- `docs/project-structure.md`
- `docs/state-management.md`
- `docs/api-layer.md`
- `docs/security.md`
- `docs/error-handling.md`
- `docs/performance.md`
