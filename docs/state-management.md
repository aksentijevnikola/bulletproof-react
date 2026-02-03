# State Management

Canonical state ownership and state-management policy for the Bulletproof React frontend
core (React 19 + Vite SPA). This document is descriptive; enforceable rules live
in `.codex/codex.rules.json`.

## 1) Purpose

Define the authoritative state ownership model for the Bulletproof React frontend core,
so new contributors understand where state lives, how it flows, and what is
explicitly disallowed by default.

## 2) Core Principles

- Backend owns business rules and validation truth.
- Avoid duplicated sources of truth.
- Prefer the smallest viable scope for state.
- Deletion safety over global coupling.

## 3) What We Use Today (Authoritative)

State ownership is intentionally split by responsibility:

- React Query owns server-derived state and caching (including authenticated
  `User | null` from `GET /auth/me`).
- React Hook Form owns form state.
- React local state owns UI and interaction state only.
- React Router owns URL state (params and search) and `pages/**` wiring.
- Context is limited to minimal UI-only cross-feature switches (theme, i18n,
  feature flags) and does not store server-derived data.
- Auth context is lifecycle-only; the read-only user surface (user and
  isAuthenticated) is derived from React Query and exposed via UserContext.

### State Ownership Table

| State Type                       | Owner                     | Notes                                                     |
| -------------------------------- | ------------------------- | --------------------------------------------------------- | -------------------------------------------------------- |
| Server-derived data              | React Query               | Cache is the source of truth; do not mirror it elsewhere. |
| Authenticated user (`User        | null`)                    | React Query                                               | Context may read from cache but does not own user state. |
| Form inputs, errors, dirty state | React Hook Form           | Form state never lives in global stores.                  |
| UI/interaction state             | React local state         | Modals, tabs, toggles, hover, pagination UI.              |
| URL params/search                | React Router + pages/\*\* | URL state stays in routing composition.                   |
| Cross-feature UI switches        | Context                   | Theme, i18n, feature flags only; never server data.       |

## 4) Why We Use This Model

- React Query already provides caching, invalidation, and request deduplication,
  which removes the need for a separate server-data store.
- Global stores tend to become coupling points that block deletion and reuse.
- Feature-local state keeps domains isolated and easier to remove.
- A single source of truth reduces bugs from stale or conflicting data.

## 5) What We Explicitly Do NOT Use (and Why)

These libraries are not used in the core app by default:

- Redux Toolkit
- Zustand
- MobX
- Jotai
- Recoil
- XState

Reasons:

- They often duplicate React Query cache or server data.
- They encourage cross-feature coupling and global dumping grounds.
- Governance cost is high: ownership, conventions, and migration burden.
- They obscure where state lives and who owns it.

Using any state library requires explicit approval as an architecture decision.

## 6) When a State Library May Be Justified (Upgrade Criteria)

A state library may be justified only when feature-local state and React Query
cannot satisfy the need. Examples:

- Complex client-only workflows that need to persist across routes (not server-backed).
- Offline drafts or local-first editing flows.
- Large multi-step wizards with deep cross-feature coordination.
- Real-time collaborative editing with client-side models.
- Performance constraints that cannot be solved with feature-local state,
  memoization, or query cache tuning.
- Deterministic finite-state machines for critical UI flows (rare).

Non-justifications:

- "I want global access to data."
- "It is more convenient."
- "React Query cache is annoying."
- "We need to avoid prop drilling."

Prefer composition, feature-local context, or router state instead.

## 7) How We Would Adopt a State Library (If Approved)

Guardrails for any approved adoption:

- Start feature-scoped, never global-first.
- Must never mirror or duplicate React Query results.
- Must not live in shared/\*\* as a generic dumping ground.
- Must include documentation updates and tests.
- Must define explicit ownership boundaries and exit criteria.

## 8) Related Docs

- `docs/roadmap.md` (core architecture and ownership principles)
- `docs/security.md` (Backend Auth Contract section) (auth state constraints)
- `docs/security.md` (auth routing and guardrails)
- `docs/testing.md` (test implications)
