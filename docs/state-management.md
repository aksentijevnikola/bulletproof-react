# State Management

Canonical state ownership and state-management policy for the Bulletproof React frontend core.

This document is descriptive; enforceable rules live in `.codex/codex.rules.json`.

## 1) Purpose

Define where state lives, how it flows, and what is disallowed by default.

## 2) Core Principles

- Backend owns business rules and validation truth.
- Avoid duplicated sources of truth.
- Prefer the smallest viable state scope.
- Preserve feature deletion safety.

## 3) Current Ownership Model

- React Query owns server-derived state (including authenticated `User | null`).
- React Hook Form owns form state.
- React local state owns UI/interaction state.
- React Router owns URL params/search with route composition in `pages/**`.
- Context is limited to minimal cross-feature UI concerns (theme, i18n, feature flags).
- Auth lifecycle is handled in auth providers/hooks; read-only user derivation comes from query-backed state.

### State Ownership Table

| State Type | Owner | Notes |
| --- | --- | --- |
| Server-derived data | React Query | Query cache is the source of truth. |
| Authenticated user (`User \| null`) | React Query | No duplicated global user store. |
| Form inputs/errors/dirty state | React Hook Form | Keep form state local to forms. |
| UI interaction state | React local state | Modals, tabs, toggles, local filters. |
| URL params/search | React Router + `pages/**` wiring | URL state remains route-driven. |
| Cross-feature UI switches | Context | Theme/i18n/flags only; never server data. |

## 4) Why This Model

- React Query already provides caching, invalidation, retries, and deduplication.
- Global stores often become coupling points.
- Feature-local state improves isolation and removability.

## 5) What We Do Not Use By Default

- Redux Toolkit
- Zustand
- MobX
- Jotai
- Recoil
- XState

Any adoption requires explicit architecture approval.

## 6) When A State Library May Be Justified

Only after feature-local state and React Query are clearly insufficient, such as:

- Long-lived client-only workflows spanning routes
- Offline draft models
- Complex deterministic state machines

Non-justifications:

- Convenience
- Avoiding prop drilling by default
- Re-caching server state outside React Query

## 7) Adoption Guardrails (If Approved)

- Start feature-scoped, not global-first.
- Never mirror React Query data.
- Do not create shared dumping grounds for domain state.
- Update docs and tests in the same change.

## 8) Related Docs

- `docs/project-structure.md`
- `docs/api-layer.md`
- `docs/security.md`
- `docs/testing.md`
