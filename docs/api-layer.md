# API Layer

Canonical reference for how the Bulletproof React frontend core talks to the backend.
This document is descriptive; enforceable rules live in `.codex/codex.rules.json`.

## 1) Purpose

Define the current API-layer architecture and ownership boundaries for the
frontend. Backend remains the source of truth for business rules and validation.

## 2) Core Principles

- Backend owns business logic and validation truth.
- Frontend consumes APIs declaratively through React Query.
- Avoid duplicated sources of truth.
- Prefer feature ownership over centralization.

## 3) What We Use Today (Authoritative)

- A single shared HTTP client (Axios) in shared infrastructure.
- Feature-local API modules under `features/<feature>/api/**`.
- React Query for all server interactions.
- Zod v4 schemas as contract owners.
- Error normalization at the client layer.

## 4) API Request Flow

1. Feature defines the API contract using Zod v4 schemas.
2. Feature defines API request functions in `features/<feature>/api/**`.
3. React Query queries/mutations invoke those functions.
4. UI consumes React Query state (data, error, loading).

Components are not expected to call API functions directly in the current architecture.

## 5) Contracts & Validation

- Zod v4 schemas are authoritative for API contracts.
- External types are derived via:
  - `z.input<typeof Schema>`
  - `z.output<typeof Schema>`
- Handwritten API request/response interfaces in UI code are not used in the current architecture.
- Zod v3-style APIs are not used in the current architecture.
- See docs/state-management.md for ownership rules.

## 6) Error Handling Model

- The shared HTTP client normalizes errors into a stable shape.
- The API layer does not trigger toasts, redirects, or state changes.
- Features handle UX in React Query callbacks and UI.
- The client supports both envelope-based errors and HTTP status-code errors.
- The API layer does not interpret business intent from errors.

## 7) What We Explicitly Do NOT Do

- No global API services layer that erases feature ownership.
- No API calls in React components.
- No server data stored outside React Query.
- No assumptions that every response uses an envelope.

## 8) When This Model Might Change

Rare, explicit architecture decisions may adjust the model, such as:

- GraphQL adoption
- Generated API clients from backend schemas
- Streaming APIs (SSE/websocket)
- Backend contract changes that require new client behavior

Any such change requires explicit approval and documentation updates.

## 9) Related Docs

- `docs/roadmap.md`
- `docs/state-management.md`
- `docs/security.md`
- `docs/security.md` (Backend Auth Contract section)
- `docs/testing.md`
