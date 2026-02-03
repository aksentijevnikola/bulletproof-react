# Security Architecture

Frontend security and auth architecture for the core React 19 + Vite SPA.
This document describes routing, authentication, and authorization behavior.
Backend security rules are referenced, not redefined.

## 1) Purpose & Scope

- Defines frontend auth and authorization responsibilities.
- Documents the current routing strategy for protected routes.
- References backend guarantees recorded in the Backend Auth Contract section below.

## 2) Core Principles

- Backend is the source of truth for auth and permissions.
- Frontend never parses JWTs.
- React Query owns authenticated `User | null` state.
- Redirects and rendering are never mixed in the same guard.
- Authorization is role-only (user vs admin); permissions and wildcards are unsupported.

## 3) Current Strategy (Authoritative)

### Strategy 1  The Bouncer (Default)

Component: `ProtectedRoute`

Pattern:
- React Router Layout Route using `<Outlet />`

Responsibility:
- Authentication only
- Redirect unauthenticated users to `/login`
- Provide a single loading state for the protected subtree
 - Reads auth status from the read-only UserContext; lifecycle flags come from
   AuthProvider

Intentionally excluded inside `ProtectedRoute`:
- Role checks
- Permission checks
- AccessDenied UI
- Nested redirect guards

## 4) Authorization (Render-only)

### RoleGuard / PermissionGuard

Responsibility:
- Authorization only
- Render AccessDenied UI or null
- Do not redirect

Role-only policy:
- Authorization is based solely on `user.role` and authentication status.
- Permission checks, scopes, and wildcard semantics are unsupported and must not be relied on.

Usage:
- Used inside authenticated zones only
- Loading state is inherited from `ProtectedRoute`
- URL remains stable on authorization failure

Component        | Responsibility      | Failure Action
-----------------|---------------------|-------------------------
ProtectedRoute   | Authentication       | Redirect to /login
RoleGuard        | Authorization        | Render AccessDenied UI
PermissionGuard  | Authorization        | Render AccessDenied UI

## 5) Optional Strategy

### Strategy 2  The Vault (Login-only systems)

Component: `AuthWrapper`

Usage:
- Internal / enterprise systems
- No public routes

Behavior:
- App shell is gated entirely
- No routing until auth is resolved

Warnings:
- Not used together with Strategy 1 in the current architecture
- Not mixed in public-facing apps in the current architecture

## 6) Guardrails & Anti-Patterns

Avoided patterns in the current architecture:
- Nesting redirecting guards
- Using `ProtectedRoute` for authorization
- Redirecting on role/permission failure
- Stacking spinners from multiple auth components

## 7) Example Routing Patterns

Public + Protected (Strategy 1):

```tsx
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route element={<ProtectedRoute />}>
    <Route element={<Layout />}>
      <Route path="dashboard" element={<Dashboard />} />
    </Route>
  </Route>
</Routes>
```

Authenticated + RoleGuard:

```tsx
<Route element={<ProtectedRoute />}>
  <Route element={<Layout />}>
    <Route
      path="admin"
      element={
        <RoleGuard requiredRole="admin">
          <AdminPage />
        </RoleGuard>
      }
    />
  </Route>
</Route>
```

## Backend Auth Contract (Reference)

This document records the backend authentication guarantees that the frontend
relies on. It is a reference, not a backend implementation.

Source of truth: backend auth service contract (owned by backend team).
If any item below changes, this frontend is updated accordingly.

## Required Backend Guarantees

- Refresh tokens are stored ONLY as HttpOnly cookies.
- Access tokens are short-lived and stored in memory only (no client persistence).
- `GET /auth/me` performs refresh when a valid refresh cookie exists and returns:
  - `200` with `User` when authenticated or refreshed
  - `401` when unauthenticated or refresh is invalid/expired

## Frontend Implications

- The frontend never reads or parses refresh tokens.
- The frontend never stores access tokens in localStorage or sessionStorage.
- The frontend resolves user state via `GET /auth/me` and treats `401` as `null`.


