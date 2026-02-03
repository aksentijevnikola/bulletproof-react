# Error Handling

## Introduction

Error handling in Bulletproof React is part of the user experience and the architecture. Errors should be understandable to users, scoped to the surface that failed, and aligned with the feature-first structure. This document describes the current error flow and presentation behavior so teams can handle errors consistently without inventing new patterns.

Related architecture references:

- `docs/project-structure.md`
- `docs/state-management.md`
- `docs/api-layer.md`
- `docs/security.md`
- `docs/performance.md`
- `docs/testing.md`
- `docs/security.md` (Backend Auth Contract section)

## Error Handling Philosophy

- Errors are treated as data that flows through the system, not as control flow shortcuts.
- The UI owns the decision of how to present an error (inline, toast, redirect).
- Shared infrastructure normalizes errors but does not trigger UI side effects.

## Error Flow Overview

At a high level, an error moves through these layers:

1. Backend responds with either a normal HTTP error or an envelope-based error.
2. The shared HTTP client normalizes the error into a stable `ApiError` shape when possible.
3. Feature API modules surface the error (or convert specific cases such as `401` from `/auth/me` into normal state).
4. React Query exposes the error to features and UI layers via query/mutation results.
5. UI components decide how to present the error: inline messages, toast feedback, or redirects.

## Infrastructure-Level Errors (HTTP Client)

The shared HTTP client normalizes errors into a minimal `ApiError` shape:

- `name: "ApiError"`
- `message`: human-readable string
- `code`: a stable error code
- `status`: HTTP status when available

Error sources handled today:

- Network/CORS/timeout failures are mapped to a network error with a user-friendly message.
- HTTP errors are mapped to `ApiError` with `status` and a derived `code`.
- Envelope-based errors (`{ success: false, message, code }`) are treated as failures even when the HTTP status is 200.

Important: Not all APIs use `{ success: false }` envelopes, so the client supports both envelope-based errors and standard HTTP errors. The normalization is intentionally minimal so features can decide presentation. For contract details, see `docs/api-layer.md`.

## React Query Error Propagation

React Query is the transport layer for errors in the UI. Errors surfaced by the HTTP client flow into query and mutation results and are consumed by features and pages.

- Query/mutation results surface errors via the standard `error` field.
- Retry behavior is configured centrally in the shared query client, and specific features can override it when needed (for example, `/auth/me` disables retries).
- React Query does not decide whether an error becomes a toast, inline message, or redirect. That decision stays in the UI layer.

## Authentication & Authorization Errors

Current auth behavior is driven by the backend contract in the Backend Auth Contract section of `docs/security.md`:

- `GET /auth/me` returning `401` is treated as normal unauthenticated state (`User | null`), not an error state.
- Authentication failures during login are shown inline in the login UI.
- Unexpected auth errors (for example, a failed auth check that is not a `401`) redirect to `/login` via the auth guard components.
- Authorization errors are handled separately from authentication: authorization guards render access-denied UI without redirecting.

This split preserves a clear UX: failed credentials stay local and correctable, while unexpected auth failures are treated as system-level problems.

## UI Error Presentation Modes

The UI uses three presentation modes today:

- **Inline errors** for local, user-correctable issues (e.g., login form failures and validation errors).
- **Toast notifications** for non-blocking system feedback when a feature explicitly chooses to use them.
- **Redirects** for authentication gating only, handled by auth guard components.

The choice is intentional: inline errors keep the user in context, toasts signal a system-level problem without blocking, and redirects enforce authentication boundaries.

## Render Errors (Error Boundaries)

The root `ErrorBoundary` is responsible for render-time exceptions (React render errors, lifecycle errors). It does not handle data errors or API failures.

Current behavior:

- Displays a fallback error UI for unexpected render failures.
- Provides user actions to retry, reload, or return to the home route.
- Shows error details in development only.

This keeps render failures visible without creating global side effects such as automatic redirects or toasts.

## What This Architecture Intentionally Avoids

This architecture intentionally avoids:

- A global error-to-toast mapping layer.
- Redirects triggered by API helpers or shared infrastructure.
- Silent swallowing of errors; errors remain visible to React Query consumers.
- The assumption that every API response uses an envelope format.

## Relationship To Other Architecture Docs

- `docs/security.md` for auth routing and guard behavior.
- `docs/api-layer.md` for API access patterns and error normalization context.
- `docs/state-management.md` for ownership boundaries that influence error scope.
- `docs/testing.md` for testing strategy around error scenarios.
