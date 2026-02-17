# API Layer

Canonical reference for how the Bulletproof React frontend talks to backend APIs.

This document is descriptive; enforceable rules live in `.codex/codex.rules.json`.

## 1) Purpose

Define API-layer ownership boundaries and request/response handling conventions.

## 2) Core Principles

- Backend owns business logic and validation truth.
- Frontend consumes APIs through React Query.
- Feature ownership beats centralization.

## 3) Current Model

- Single shared HTTP client (Axios) in shared infrastructure.
- Feature-local API modules under `features/<feature>/api/**`.
- React Query as the API consumer layer.
- Zod v4 schemas as contract owners.
- Shared client normalizes transport-level errors.

## 4) Request Flow

1. Feature defines contract schemas.
2. Feature defines request modules.
3. Query/mutation hooks call those modules.
4. UI consumes query/mutation state.

Components should not call API modules directly.

## 5) Contracts & Validation

- Contract types derive from Zod (`z.input` / `z.output`).
- No handwritten API DTO interfaces in UI layers.
- Naming convention:
  - `NamePayload` for `z.input<typeof Schema>`
  - `NameResponse` for `z.output<typeof Schema>`

## 6) Error Handling

- Client normalizes transport errors into a stable shape.
- API modules do not trigger toasts/redirects.
- UI decides presentation (inline, toast, redirect) at feature boundaries.
- Client supports both envelope-based and status-based error contracts.

## 7) Anti-Patterns

- Global API service layer that hides feature ownership.
- API calls directly in components.
- Duplicate server state outside React Query.
- Assuming every endpoint uses the same error envelope.

## 8) Related Docs

- `docs/project-structure.md`
- `docs/state-management.md`
- `docs/security.md`
- `docs/error-handling.md`
- `docs/testing.md`

## 9) Canonical Server-Driven Table Query Params

For server-driven tables (manual mode + React Query), URL search params are the source of truth.

Canonical params:

- `page`: number, 0-indexed
- `pageSize`: number, default 20
- `q`: optional search string
- `searchBy`: `"all"` or field key
- `sort`: delimited sort expression, e.g. `createdAt:desc`
- Filters: explicit field params, e.g. `status=active`

Canonical response fields:

- `data`
- `totalResults`
- `page`
- `pageSize`
- `pageCount` (optional)

When filters/search/sort/pageSize change, reset `page` to `0`.
