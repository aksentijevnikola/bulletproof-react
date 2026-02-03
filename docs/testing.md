# Frontend Testing Architecture

Authoritative frontend testing model for the Bulletproof React core (React 19 + Vite SPA).
This replaces the legacy `docs/testing-plan.md` and is the single source of
truth for testing guidance.

> Enforcement notice
> All enforceable rules live in `.codex/codex.rules.json`.
> This document is descriptive; if there is a conflict, the Codex rules win.

## 1) Purpose

- Define a single, stable testing architecture for the frontend core.
- Align tests with user-visible behavior and feature confidence.
- Prevent drift and ad-hoc testing styles across features.

## 2) Core Testing Principles

- Behavior over implementation details.
- Confidence over coverage.
- Determinism over convenience (no flaky timing or network).
- Tests are part of the architecture, not an afterthought.

## 3) Testing Stack (Authoritative)

Required:

- Vitest
- React Testing Library
- `@testing-library/user-event`
- MSW (Mock Service Worker)

Optional:

- Visual regression tooling (Vitest browser mode screenshots)
- E2E tooling (only when CI/environment readiness supports it)

## 4) Test Types & When To Use Them

### Unit Tests (Rare, Pure)

Use for:

- Small, deterministic helpers
- Pure transformations and formatters

Rules:

- No React
- No DOM
- No network
- No browser APIs

### Integration Tests (Default)

Use for:

- Feature-level flows
- Cross-component behavior
- React Query + MSW scenarios

Rules:

- Prefer these over unit tests for product confidence
- Assert user-visible outcomes
- Treat the network as an external dependency (MSW)
- Behavior-first component tests are considered integration tests here

### Visual Regression Tests (Optional)

Use for:

- Design-critical components
- High-risk pages and layouts
- UI contracts that are expected to remain stable

Rules:

- Use visual snapshots to verify the contract
- Review diffs like source code

### E2E Tests (Optional, High Cost)

Use for:

- Critical flows that require full stack integration
- Only when CI/environment readiness supports it

Rules:

- Not required by default
- Avoid for routine UI verification

## 5) Mocking Strategy

Mock only true externals:

- Network (MSW)
- Time (fake timers)
- Browser APIs (only when the environment lacks them)
- Storage APIs (only when necessary)

Avoid mocking:

- React Query
- Feature logic
- Internal modules for convenience

MSW usage rules:

- Use MSW for all HTTP mocking.
- MSW infrastructure lives under `src/shared/test/msw/**` and is wired in the shared test setup.
- Handlers reflect real backend contracts.
- MSW is not used as a fake backend with divergent behavior.
- Default to failing on unhandled requests to prevent silent calls.
- Feature tests own their handlers and must register them explicitly via `server.use(...)`.
- Start the server in test setup, reset handlers between tests, and stop it after.

Mocking time:

- Use `vi.useFakeTimers()` and `vi.setSystemTime()` for time-based logic.
- Always return to real timers in teardown.

## 6) Snapshot Rules

Allowed:

- Small, stable, human-reviewable outputs
- File snapshots via `toMatchFileSnapshot()` for HTML/SVG/JSON
- Visual snapshots for UI contracts

Avoided in current practice:

- Snapshotting entire React trees
- Large DOM snapshots
- Inline snapshots for large payloads

Guidance:

- Prefer explicit assertions (`getByRole`, `getByText`, user interactions).
- If a DOM snapshot is used, it is minimal and intentional.
- In concurrent async tests, use `expect` from the local test context.

## 7) Test Location & Structure

Placement rules:

- Tests are colocated next to the source file they verify.
- Allowed:
  - `src/features/**/**/*.test.ts(x)`
  - `src/shared/**/**/*.test.ts(x)`
  - `src/pages/**/**/*.test.ts(x)` (composition only)
  - `src/app/**/**/*.test.ts(x)` (wiring only)
- Forbidden:
  - `__tests__` directories anywhere
  - Global test dumping grounds
  - Cross-feature imports in tests

Shared test infrastructure:

- Shared, cross-feature test utilities live under `src/shared/test/**`.
- React Query test utilities (including the test QueryClient factory) are centralized there.
- MSW setup is centralized in shared test infrastructure; no default handlers are provided.

## 8) CI Expectations

- Tests are deterministic and do not depend on real network access.
- Visual regression tests run in CI only when the environment supports them.
- Snapshot artifacts and screenshots are committed and reviewed.

## 9) Coverage Philosophy

- Do not chase vanity coverage.
- Prefer meaningful tests for critical flows such as:
  - Auth UI flows
  - Purchase flows
  - Admin actions
  - Error handling
  - Routing and guards

## 10) What This Architecture Intentionally Avoids

This architecture intentionally avoids:

- Testing implementation details or internal state.
- Mocking React Query.
- Mocking feature logic or internal modules for convenience.
- Snapshotting entire component trees.
- Treating MSW as a fake backend that diverges from real contracts.

## 11) Relationship To Other Architecture Docs

This testing model is consistent with and constrained by:

- `docs/state-management.md` (state ownership and React Query as source of truth)
- `docs/api-layer.md` (API access via React Query; MSW for network)
- `docs/security.md` (auth flows and guard behavior in tests)
- `docs/roadmap.md` (feature-first architecture and responsibilities)
