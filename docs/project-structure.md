# Project Structure

## Introduction

This document explains why the Bulletproof React frontend is laid out the way it is and how that layout protects feature boundaries over time. It is a descriptive map of the codebase, not a policy file. When you need enforceable rules, consult the Codex rules and the architecture references it points to.

Related architecture docs:

- `docs/roadmap.md`
- `docs/state-management.md`
- `docs/api-layer.md`
- `docs/security.md`
- `docs/design-system.md`
- `docs/testing.md`

## Top-Level `src/` Structure (Authoritative Explanation)

### `app/`

**What it owns**

- App bootstrapping and the application shell.
- Global wiring that makes the app runnable (e.g., providers and top-level orchestration).

**What it does not own**

- Feature-specific UI, domain logic, or backend-specific decisions.
- Feature-owned state or API contracts.

**Typical examples**

- `src/app/App.tsx`
- `src/app/providers/AppProviders.tsx`

**Anti-pattern examples**

- Putting domain logic in `src/app/` because it feels пїЅglobal.пїЅ
- Feature-specific routing or data fetching living in `src/app/`.

### `pages/`

**What it owns**

- Route-level composition and page assembly.
- Wiring together existing features into full routes.

**What it does not own**

- Durable business logic, contracts, or feature-specific state.
- UI primitives intended for reuse across features.

**Typical examples**

- `src/pages/Login.tsx`
- `src/pages/Dashboard.tsx`

**Anti-pattern examples**

- Pages containing domain rules that should live in a feature.
- Pages creating new shared components for reuse.

### `features/`

**What it owns**

- Product and domain functionality, organized by business capability.
- Feature-local UI, feature-local API wiring, and feature-local state orchestration.

**What it does not own**

- Cross-feature infrastructure that becomes a global dependency.
- UI frameworks or component kits that should be infrastructure.

**Typical examples**

- `src/features/auth/` (API contracts, auth UI, auth hooks)
- `src/features/dashboard/` (dashboard UI)
- `src/features/layout/` (Feature-level layout modules (e.g., features/layout/) are allowed only when the layout is product- or domain-specific and not a global application shell.)
- `src/features/theme/` (theme UI and theme-scoped context)

**Anti-pattern examples**

- Putting feature-specific logic into `shared/` to reduce duplication.
- Creating a new global пїЅcomponentsпїЅ library inside `features/`.

### `shared/`

**What it owns**

- Cross-feature infrastructure used by many features.
- Thin, stable building blocks that are not domain-specific.

**What it does not own**

- Domain rules or feature-specific assumptions.
- пїЅHelpersпїЅ that encode business logic.

**Typical examples**

- `src/shared/lib/http/api.client.ts`
- `src/shared/lib/query/query-client.ts`
- `src/shared/ui/LoadingSpinner.tsx`
- `src/shared/ui/preline/**`
- `src/shared/config/environment.ts`

**Anti-pattern examples**

- Moving a featureпїЅs API module into `shared/lib` because multiple pages need it.
- Encoding product-specific logic into `shared/ui`.

### `assets/`

**What it owns**

- Static assets that are imported by the app.

**What it does not own**

- Generated assets that should be built at runtime.
- Feature-scoped assets that belong inside feature folders.

**Typical examples**

- `src/assets/react.svg`

**Anti-pattern examples**

- Centralizing feature-specific images here instead of colocating with the feature.

### `styles/`

**What it owns**

- Global style entry points and system-wide tokens.

**What it does not own**

- Feature-specific styling that should live with the feature.

**Typical examples**

- `src/styles/index.css`

**Anti-pattern examples**

- Using `styles/` as a general dumping ground for feature CSS.

### `i18n/`

**What it owns**

- Localization infrastructure and translation resources.

**What it does not own**

- Product or feature logic unrelated to localization.

**Typical examples**

- `src/i18n/locales/en.json`
- `src/i18n/provider.tsx`
- `src/i18n/ui/LanguageSwitcher.tsx`

**Anti-pattern examples**

- Putting feature logic into `i18n/` because it touches strings.

## Feature-First Architecture (Deep Dive)

A feature in Bulletproof React is a slice of user-facing capability that can be understood and removed in isolation. Features group the UI, API wiring, and local state that make a domain capability work without scattering those concerns across the repo.

A well-formed feature typically contains:

- Feature UI and composition
- Feature-local hooks and context when necessary
- Feature-specific API modules and schemas

Feature-local duplication is acceptable when it preserves independence. Shared abstractions are deliberately scarce because they create coupling that makes deletion risky and makes ownership unclear. If a feature can be removed without breaking unrelated features, the structure is working.

Deletion safety is supported by:

- Keeping feature-specific code inside the feature boundary.
- Avoiding cross-feature imports that create implicit dependencies.
- Reserving `shared/` for infrastructure only.

## Intentionally Avoided Top-Level Folders (Why They Are Dangerous)

The following top-level folders are intentionally avoided because they promote global coupling by technical type instead of business ownership:

- `components`
- `hooks`
- `services`
- `utils`
- `stores`
- `schemas`
- `lib`

These patterns encourage a horizontal layer of пїЅsharedпїЅ code that every feature depends on, which makes features difficult to delete and hard to reason about. They also incentivize premature abstraction, pushing domain logic into globally shared locations. Bulletproof React replaces these patterns with:

- Feature-local organization under `features/<feature>/...`
- Infrastructure-only `shared/` modules
- Thin `pages/` composition

## `shared/**` Explained (Infrastructure Only)

`shared/` exists for the boring, stable, cross-feature infrastructure the app needs to run. It should be reusable without knowing which feature is consuming it.

Examples of infrastructure:

- UI primitives (`src/shared/ui/LoadingSpinner.tsx`)
- API client and query client (`src/shared/lib/http/api.client.ts`, `src/shared/lib/query/query-client.ts`)
- Environment access (`src/shared/config/environment.ts`)
- Preline adapters and wrappers (`src/shared/ui/preline/**`)

Explicit non-examples:

- Feature-specific API modules
- Domain logic or validation rules tied to a single feature
- Convenience helpers that encode business behavior

## `pages/**` Explained (Composition Only)

`pages/` is the routing composition layer. Pages assemble feature UI and pass route-level data where needed. The intent is to keep pages thin and avoid reintroducing feature ownership at the route level.Reusable layouts belong to features or shared infrastructure depending on ownership; pages only assemble them.

Pages may read:

- Route params and search values
- Feature exports

Pages should not own:

- Domain behavior or validation
- Shared primitives or infrastructure

## How This Structure Supports Other Systems

This layout is designed to align with other architectural systems without duplicating their rules:

- State management ownership is defined in `docs/state-management.md`.
- API layer ownership and contracts are defined in `docs/api-layer.md`.
- Security and auth boundaries are defined in `docs/security.md`.
- Testing placement and philosophy are defined in `docs/testing.md`.

## Common Mistakes & How to Avoid Them

- пїЅJust put it in shared.пїЅ If it is feature-specific, keep it in the feature; shared is for infrastructure only.
- пїЅWeпїЅll refactor later.пїЅ Moving code into `shared/` is easy; moving it back out is painful and usually never happens.
- пїЅThis hook is used everywhere.пїЅ Usage breadth does not automatically make something infrastructure.
- пїЅThis is just a helper.пїЅ Helpers often encode domain behavior; keep them close to the feature.

## Summary: Structural Invariants

- Features are the primary unit of ownership; they should be understandable and removable in isolation.
- `shared/` is infrastructure only; it should not contain domain logic.
- `pages/` compose features; they do not own feature behavior.
- Top-level technical buckets are intentionally avoided to prevent global coupling.
- The structure exists to make ownership obvious and deletion safe.
- Import direction currently flows inward: pages в†’ features в†’ shared, never the reverse.
