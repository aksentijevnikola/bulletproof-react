# Frontend Progress Log

Structured, human-readable log of meaningful frontend changes.

> Enforcement notice
> All enforceable rules live in `.codex/codex.rules.json`.

## Entries

## 2026-02-03 - Remove Permission Wildcard Semantics

Summary:
- Removed wildcard permission handling in auth helpers.
- Clarified role-only authorization in security documentation.

Impacts:
- Permission and wildcard semantics are unsupported in the frontend.
- Admin access is gated strictly by role.

## 2026-02-03 - Rename Shared Classname Utility

Summary:
- Renamed shared classname helper to kebab-case to align with naming rules.
- Updated exports accordingly.

Impacts:
- No runtime behavior changes.
- Naming compliance for shared utilities.

## 2026-02-03 - MSW Test Scaffolding And Handler Ownership

Summary:
- Added MSW test infrastructure under `src/shared/test/msw/**`.
- Wired MSW lifecycle to the shared test setup with unhandled requests failing tests.
- Established handler ownership in feature tests via explicit `server.use(...)`.

Impacts:
- Network mocking is centralized and deterministic for tests.
- Unhandled HTTP calls surface immediately as test failures.
- Feature tests remain the owner of request handlers and domain-specific behavior.

## 2026-02-03 - Colocated Test Placement And Shared Test Infra

Summary:
- Enforced colocated test placement with `*.test.ts(x)` and `*.spec.ts(x)` patterns.
- Added shared test infrastructure under `src/shared/test/**`.
- Updated Vitest and ESLint to block `__tests__` directories.

Impacts:
- Tests live next to owned code across features, shared, pages, and app wiring.
- React Query test setup is centralized for deterministic behavior.
- Prevents new `__tests__` folders from entering the codebase.

## 2026-02-01 - Auth Context Surface And Design Tokens

Summary:
- AuthProvider is lifecycle-only; user and isAuthenticated are exposed only via UserContext.
- Removed broad query invalidation helper from shared infra.
- Added missing @theme token categories (spacing, radii, shadows, breakpoints).

Impacts:
- Single read-only auth surface derives from React Query with no duplicate user state.
- Shared query helpers are narrower and deterministic.
- Design-system token coverage is complete for Tailwind v4 utilities.

## 2026-01-31 - Roadmap Canonicalization

Summary:
- Added `docs/roadmap.md` as the planning-only roadmap for phased work
- Removed the legacy frontend plan; planning now lives in `docs/roadmap.md`
- Updated `docs/guide.md` to point to the roadmap as the planning reference

Impacts:
- Planning guidance is centralized and separated from architectural policy
- Legacy plan no longer competes with canonical docs

## 2026-01-31 - Testing Architecture Canonicalization

Summary:
- Added `docs/testing.md` as the single canonical testing reference
- Codified testing philosophy, categories, mocking, snapshots, and placement rules in Codex rule files
- Updated docs to reference `docs/testing.md` and removed the legacy testing plan

Impacts:
- Testing guidance is centralized and aligned with current architecture
- No runtime behavior or tooling changes

## 2026-01-31 - API Layer Rules And Documentation

Summary:
- Added `docs/api-layer.md` as the canonical API layer reference
- Codified API layer rules in Codex rule files

Impacts:
- API ownership is feature-local with shared client infrastructure only
- React Query is the sole consumer of API calls

## 2026-01-31 - State Management Rules And Documentation

Summary:
- Added authoritative state ownership documentation in `docs/state-management.md`
- Codified state ownership and global state policy in Codex rules

Impacts:
- Global state libraries are not used by default without explicit approval
- State ownership boundaries are explicit for React Query, forms, UI, and URL state

## 2026-01-31 - Security Architecture Documentation

Summary:
- Added `docs/security.md` as the auth/authorization routing reference
- Codified guardrail rules for redirect vs render-only guards

Impacts:
- Strategy 1 (ProtectedRoute layout) is documented as the default
- Strategy 2 (AuthWrapper) is documented as an optional alternative

## 2026-01-31 - Auth Error UX And API Envelope Policy Documentation

Summary:
- Documented auth error UX split between inline credential errors and system toasts
- Documented support for both envelope-based and status-code-based API errors

Impacts:
- Error-handling expectations are explicit and aligned with current behavior
- Prevents incorrect assumptions about API response envelopes

## 2026-01-30 - Auth Contract Reference And AuthWrapper Guardrails

Summary:
- Added a frontend reference to the backend auth contract
- Refactored AuthWrapper semantics to avoid unauthenticated-as-error behavior

Impacts:
- Auth assumptions are explicit and documented
- Authenticated route guarding is safer for reuse across apps

## 2026-01-28 - User Context Derives From React Query

Summary:
- User context now derives user data from React Query cache
- User context value is memoized to avoid unstable provider values

Impacts:
- Auth user state is owned by React Query
- No UI or backend behavior changes

## 2026-01-28 - Auth Ownership Normalization And Logout Cache Clearing

Summary:
- Re-enabled AuthProvider wiring and ProtectedRoute gating
- Normalized unauthenticated bootstrap to return User | null (401 -> null)
- Removed writable user state from UserContext and moved permission checks into hooks
- Logout clears cached server state to prevent post-logout data leakage

Impacts:
- Auth state now derives solely from React Query
- Logout removes user-scoped cached data and resets auth cache

## 2026-01-27 - Zod v4 Enforcement And Validation Checklist

Summary:
- Enforced Zod v4-native email validators in auth contracts (`z.email()`)
- Clarified that Zod v4 enforcement lives in Codex rules (no standalone checklist)

Impacts:
- Validation contract remains advisory and boundary-focused
- No backend contracts or UI behavior were changed

When adding an entry, prefer this format:

```md
## YYYY-MM-DD - Short Title

Summary:
- What changed
- Why it changed

Impacts:
- Boundaries affected
- Risks or follow-ups
```
