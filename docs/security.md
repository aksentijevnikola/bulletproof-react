# Security Architecture

Frontend security and auth architecture for the React SPA.

This document describes current authentication and authorization behavior. Backend policy remains the source of truth.

## 1) Purpose

- Define frontend responsibilities for auth and authorization.
- Document guard behavior and expected UX.
- Capture backend guarantees the frontend depends on.

## 2) Core Principles

- Backend is the source of truth for identity and permissions.
- Frontend does not parse JWTs.
- Access/refresh tokens are not persisted in browser storage.
- React Query owns authenticated user state (`User | null`).
- Redirect logic and authorization rendering are separate concerns.

## 3) Authentication Guarding (Current)

Current guard component: `ProtectedRoute` (`src/features/auth/ui/guards/ProtectedRoute.tsx`)

Responsibilities:

- Protect authenticated route subtrees
- Show loading fallback while auth state resolves
- Redirect unauthenticated users to `/login`

Non-responsibilities:

- Permission/role decisions
- Access-denied rendering policy
- Feature business logic

## 4) Authorization (Current)

Authorization checks are hook-driven inside authenticated feature UI.

- Use `usePermissions` from `src/features/auth/hooks/usePermissions.ts`.
- Authorization failures should be handled as render decisions within the page/feature.
- Authorization checks must not introduce redirect loops.

## 5) Backend Auth Contract (Reference)

Required backend guarantees:

- Refresh tokens are HttpOnly cookies only.
- Access tokens are short-lived and memory-only.
- `GET /auth/me` returns:
  - `200` with `User` when authenticated/refreshed
  - `401` when unauthenticated or refresh is invalid/expired
- Returned user includes `permissions` for capability checks.

## 6) Frontend Implications

- Frontend never reads refresh tokens.
- Frontend never persists access tokens in `localStorage` or `sessionStorage`.
- Frontend treats `401` from `GET /auth/me` as unauthenticated (`null`) rather than an app crash.

## 7) Anti-Patterns

- Nesting multiple redirecting auth guards.
- Performing permission checks inside infrastructure auth guards.
- Mixing token parsing logic into UI code.
- Pushing authorization decisions into shared infrastructure.

## 8) Related Docs

- `docs/state-management.md`
- `docs/api-layer.md`
- `docs/error-handling.md`
- `docs/testing.md`
