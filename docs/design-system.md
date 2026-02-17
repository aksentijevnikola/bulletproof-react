# Design System

Reference for styling and UI ownership in the Bulletproof React frontend.

This document is descriptive; enforceable constraints live in `.codex/codex.rules.json`.

## Scope

The design system governs:

- Styling conventions and token usage
- UI ownership boundaries (`features/**` vs `shared/ui/**`)
- Promotion rules for reusable UI primitives

It does not define API/state/security behavior.

## Current Styling Setup

- UI uses utility-style class names and semantic CSS variable tokens.
- Global style entry point is `src/styles/index.css`.
- Theme behavior is handled through the theme feature and tokenized classes.
- Component styling should stay explicit and local to ownership boundaries.

## UI Ownership Model

### Feature UI (`features/**`)

Default location for product UI.

Feature UI owns:

- Domain-specific layouts
- Feature-specific UX states and messages
- Composition tied to feature behavior

### Shared UI (`shared/ui/**`)

Reserved for narrow, domain-agnostic primitives reused by multiple features.

Current shared UI surface is intentionally small:

- `src/shared/ui/LoadingSpinner.tsx`
- `src/shared/ui/ErrorBoundary.tsx`

Promotion to `shared/ui/**` must be explicit and justified by real cross-feature reuse.

## Design-System Guardrails

- Do not build a global feature-agnostic component catalog by default.
- Do not move feature UI into shared just to reduce short-term duplication.
- Keep shared UI components behavior-light and domain-agnostic.
- Keep semantics and accessibility first-class in all interactive components.

## Relationship To Other Docs

- `docs/project-structure.md`
- `docs/state-management.md`
- `docs/performance.md`
- `docs/testing.md`
