# Performance

## Introduction

Performance in Bulletproof React is treated as a product concern, not a micro-optimization exercise. The goal is a fast, predictable UI that stays understandable and aligned with the architecture. This document explains how performance choices fit the current structure and state ownership model, and when performance work is actually justified.

For architectural boundaries and ownership, see `docs/project-structure.md`, `docs/state-management.md`, and `docs/api-layer.md`.

## Performance Philosophy

- Prefer correctness and clarity first; performance work that obscures ownership is a long-term cost.
- Measure before optimizing; visible slowness should be confirmed by metrics or profiling.
- Avoid speculative optimization; small wins that add coupling often reduce overall speed later.
- Optimize at boundaries; improve the slow surface instead of spreading changes everywhere.

## What Is Already Optimized By Default

Several layers already provide baseline performance without extra work:

- React Query provides caching, request deduplication, and background refetching that reduce redundant network and UI churn.
- Route-level code splitting is already in use in the app shell, so large pages are loaded on demand.
- Browsers handle a large portion of performance work (layout, image decoding, caching, scheduling), which is typically more impactful than local micro-optimizations.
- Modern React rendering behavior (automatic batching and concurrent rendering where applicable) reduces unnecessary work in many common cases.

## React Rendering Guidelines

Memoization is a tool, not a default.

When memoization is usually not needed:

- Components are small, cheap to render, or do not re-render frequently.
- Props are already stable and there is no measurable hot path.
- The component's output is dominated by DOM or CSS rather than computation.

When `useMemo` or `useCallback` may be justified:

- There is a proven expensive computation or derived value that is re-evaluated unnecessarily.
- Callback identity stability materially reduces re-renders for memoized child components.
- A value is passed to a dependency-sensitive hook that benefits from stability.

Why blanket memoization is discouraged:

- It adds complexity, makes refactors harder, and can hide stale data issues.
- It often shifts work rather than removing it, and can make debugging harder.

Component boundaries are a practical performance tool: smaller, well-scoped components help contain re-renders without forcing global memoization.

## State & Performance

Global state is not a performance tool. It often increases re-render fan-out and makes bottlenecks harder to isolate. The current state ownership model is designed to keep state local or feature-scoped, which is usually faster and easier to reason about.

React Query vs local state tradeoffs:

- React Query is designed for server-derived data with caching, deduplication, and background updates.
- Local UI state is faster to update and should remain scoped to the UI that owns it.

Avoiding duplicated sources of truth is a performance strategy: fewer conflicting caches means fewer invalidations and fewer re-renders. For the authoritative ownership model, see `docs/state-management.md`.

## Lists, Tables, and Large UI Surfaces

Large UIs are where performance problems are most visible. The primary lever is to avoid rendering unbounded datasets.

- Pagination is the default strategy for large data sets; it limits work and keeps interactions stable.
- Virtualization is appropriate only when users need smooth scrolling through very large lists and pagination breaks the UX.
- If the dataset can grow without bound, the UI should be designed to request slices, not the entire dataset.

## Network & Data Fetching Performance

Performance work in data fetching should stay aligned with feature ownership:

- Feature-local queries help avoid broad re-renders and keep cache ownership clear.
- Avoiding waterfall fetches is usually a matter of structuring feature composition so data needs are known early.
- Cache key design affects how much gets refetched; keep it stable and intentional at a high level.
- Manual caching outside React Query is not part of the current performance strategy; if proposed, treat it as an architectural change and consult `docs/api-layer.md`.

## React Compiler (Enabled)

The Bulletproof React frontend has the React Compiler enabled using a stable,
production-ready version.

The React Compiler performs automatic, build-time optimizations such as:

- Reducing unnecessary re-renders
- Automatically memoizing component computations
- Eliminating the need for most manual `useMemo`, `useCallback`, and `React.memo`

Important constraints:

- The React Compiler is treated as an optimization layer, not an architectural
  primitive.
- Code remains correct and predictable without relying on compiler behavior.
- The compiler does not replace the Rules of React or ownership boundaries.
- Manual memoization remains an explicit tool and may still be used when precise
  control is required (for example, effect dependency stability).

The performance guidance in this document remains valid regardless of compiler
optimizations. Developers do not write code that assumes compiler-specific
behavior.

## What We Explicitly Do NOT Optimize (Yet)

These are common optimization ideas that are intentionally deferred until there is evidence they are needed:

- Over-memoization of components and hooks.
- Custom caching layers on top of React Query.
- Client-side state machines purely for performance.
- Premature virtualization of lists that are still modest in size.
- Micro-benchmark-driven refactors that do not change user-visible latency.

## When Performance Work Is Justified

Performance work is justified when there is clear, user-visible impact and evidence of a bottleneck:

- Measured regressions tied to a release or change.
- Production metrics showing slow render, input latency, or network delays.
- Profiling that isolates a specific component, query, or render path.
- A scoped fix that improves speed without eroding ownership boundaries.

## Relationship To Other Architecture Docs

- `docs/project-structure.md` explains feature ownership and how boundaries reduce performance regressions.
- `docs/state-management.md` defines the state ownership model that prevents re-render fan-out.
- `docs/api-layer.md` defines the API access pattern that prevents duplicated caching.
- `docs/testing.md` documents the testing model that guards against performance regressions in behavior.

