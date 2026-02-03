# Bulletproof React Frontend Architecture Guide

## Purpose of This Guide

This repository contains the Bulletproof React frontend core: an enterprise-grade React 19 + Vite SPA designed for reuse across Bulletproof React products. This guide is the entry point to the documentation set. It orients readers to where information lives and which document answers which questions. It is not a policy file and does not restate rules.

Who should read this guide:

- New developers joining the project
- Reviewers validating architectural alignment
- AI tooling and automation (Codex CLI)
- Future maintainers needing fast context

## How to Read the Documentation

The documentation is modular and aligned to a feature-first architecture. Each document covers a single responsibility area and avoids overlap with others. Enforceable rules live in the Codex configuration files; the docs are descriptive references that explain intent, ownership, and current behavior.

Use this guide to pick the right document, then read that document in full rather than piecing together rules across files.

## Canonical Documentation Map

**`docs/guide.md`**

- What it governs: Documentation navigation and orientation
- When to read it: First read for any role
- Decisions it answers: "Where do I find the right policy or explanation?"

**`docs/roadmap.md`**

- What it governs: Planning phases and sequencing for the frontend core
- When to read it: When proposing or reviewing planned work
- Decisions it answers: "What is planned next, and how is it staged?"

**`docs/project-structure.md`**

- What it governs: Repository layout and ownership boundaries
- When to read it: When placing code or reviewing structure
- Decisions it answers: "Where does this code belong?"

**`docs/design-system.md`**

- What it governs: Styling foundations, tokens, UI component ownership, Preline integration
- When to read it: When building UI or reusing components
- Decisions it answers: "Is this a feature component or shared UI primitive?"

**`docs/state-management.md`**

- What it governs: State ownership model
- When to read it: When handling data, forms, or UI state
- Decisions it answers: "Who owns this state and why?"

**`docs/api-layer.md`**

- What it governs: API access patterns and contract ownership
- When to read it: When integrating backend APIs
- Decisions it answers: "How should this API be called and validated?"

**`docs/security.md`**

- What it governs: Authentication, authorization, and backend auth guarantees the frontend relies on
- When to read it: When changing guards or protected routes
- Decisions it answers: "Which guard handles auth vs authorization?"

**`docs/error-handling.md`**

- What it governs: Error flow and presentation behavior
- When to read it: When deciding inline vs toast vs redirect
- Decisions it answers: "How should errors surface to the user?"

**`docs/performance.md`**

- What it governs: Performance strategy and tradeoffs
- When to read it: When evaluating or proposing optimizations
- Decisions it answers: "Is this optimization justified?"

**`docs/testing.md`**

- What it governs: Testing philosophy, scope, and placement
- When to read it: When writing or reviewing tests
- Decisions it answers: "What kind of test belongs here?"

**`docs/progress.md`**

- What it governs: Historical changelog of major frontend decisions
- When to read it: When auditing why an architecture decision exists
- Decisions it answers: "What changed, and why?"

**`docs/test-scenarios.md`**

- Supplemental reference (not canonical architecture)
- What it governs: Placeholder for future test scenario documentation
- When to read it: When test scenarios are introduced
- Decisions it answers: "Where do scenario-level expectations live?"

## Supplemental References (Non-Canonical)

The following docs are reference-only and do not define architecture:

- Preline usage examples (reference section in `docs/design-system.md`)
- `docs/test-scenarios.md` (placeholder for future scenarios)

## High-Level Architecture Overview (Brief)

The Bulletproof React frontend core is feature-first and domain-oriented. The backend is the source of truth for business logic and validation. React Query owns server state, while UI state stays local or feature-scoped by default. Deletion safety is a primary design goal: features should be removable without hidden global coupling.

## Common Reader Paths

- I'm new to the project: start with the Architecture Overview, then the Project Structure, Design System, State Management, and API Layer entries in the map.
- I want to build a feature: read Project Structure, Design System, State Management, and API Layer; use Error Handling and Testing as you implement.
- I want to change architecture: read Project Structure, State Management, API Layer, Security, and Performance before proposing changes.
- I'm debugging a bug: use Error Handling, State Management, API Layer, and Testing based on where the failure appears.
- I'm reviewing a PR: consult Project Structure, Design System, State Management, API Layer, Error Handling, Performance, and Testing to validate alignment.

## What This Guide Does NOT Contain

- Detailed rules or enforcement (see Codex configuration files).
- Step-by-step implementation instructions.
- API contracts, auth behavior, or error-handling rules in detail.
- Testing procedures or tooling setup.
- Roadmap or planning guidance.
