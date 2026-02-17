# Project Structure

## Introduction

This document explains why the Bulletproof React frontend is laid out the way it is and how that layout protects feature boundaries over time.

It is a descriptive map of the codebase, not a policy file. Enforceable rules live in `.codex/codex.rules.json`.

Related architecture docs:

- `docs/design-system.md`
- `docs/state-management.md`
- `docs/api-layer.md`
- `docs/security.md`
- `docs/error-handling.md`
- `docs/performance.md`
- `docs/testing.md`
- `docs/progress.md`

## Top-Level `src/` Structure

### `app/`

Owns:

- App bootstrap and shell wiring
- Top-level providers and runtime setup

Does not own:

- Feature domain logic
- Feature API contracts

### `pages/`

Owns:

- Route-level composition
- Param/search wiring into features

Does not own:

- Durable business logic
- Shared infrastructure primitives

### `features/`

Owns:

- Domain capabilities
- Feature-local UI, hooks, and API wiring
- Feature-local state orchestration

Does not own:

- Cross-feature infrastructure
- Generic global abstractions

### `shared/`

Owns:

- Cross-feature infrastructure
- Stable, domain-agnostic helpers and UI primitives

Does not own:

- Feature business rules
- Product-specific domain assumptions

### `assets/`

Owns static imported assets.

### `styles/`

Owns global CSS and design tokens.

### `i18n/`

Owns localization configuration and locale resources.

## Feature-First Architecture

A feature in Bulletproof React is a user-facing capability that should remain understandable and removable in isolation.

A healthy feature usually contains:

- Feature UI
- Feature hooks/context when needed
- Feature API contracts and request modules

Feature-local duplication is acceptable when it protects ownership and deletion safety.

## Intentionally Avoided Top-Level Folders

These are intentionally avoided at `src/` root because they create global coupling:

- `components`
- `hooks`
- `services`
- `contexts`
- `schemas`
- `stores`
- `utils`
- `lib`

Prefer feature-local organization under `features/<feature>/...`.

## `shared/**` Rules of Thumb

Use `shared/` for infrastructure only:

- HTTP/query clients
- Environment adapters
- Reusable low-level UI primitives
- Test infrastructure

Do not move feature-specific logic into `shared/` just to reduce duplication.

## `pages/**` Rules of Thumb

`pages/` is composition-only.

Pages may:

- Read route params/search
- Compose feature exports

Pages should not:

- Own business logic
- Define API contracts
- Become a feature-level state owner

## Common Mistakes

- "Just put it in shared." If it is feature-specific, keep it in the feature.
- "We will refactor later." Shared coupling is hard to undo.
- "This helper is generic." Helpers often encode domain behavior.

## Structural Invariants

- Features are the primary ownership unit.
- `shared/` is infrastructure-only.
- `pages/` composes features; it does not own feature behavior.
- Top-level technical buckets are intentionally avoided.
- Import direction flows inward: `pages -> features -> shared`.
