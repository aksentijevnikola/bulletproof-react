# Frontend Roadmap

## Title + Definition

This roadmap is a planning artifact that sequences work on the Bulletproof React frontend core. It describes phases, deliverables, and scope boundaries so changes are staged and reviewable. It is not a policy document and it does not define architecture. Enforceable rules live in the Codex configuration files.

## Execution Model

Work follows a two-step model:

1. PLAN ONLY (approval required)

- A phase plan is proposed with goals, deliverables, scope, and risks.
- Approval is explicit when reviewers confirm the plan is aligned with the canonical docs and fits current priorities.

2. IMPLEMENTATION (only after approval)

- Implementation proceeds against the approved plan.
- Structural changes are followed by documentation updates in the relevant canonical docs.

## Current State Snapshot (brief, factual)

The core already has canonical references for structure, design system, state management, API layer, security, error handling, performance, and testing. The app shell, auth guards, React Query setup, and design tokens are in place. Preline is integrated as UI infrastructure with documentation-only examples.

## Roadmap Phases

### Phase 1: App Shell Maturity

**Goal**
Stabilize the app shell and routing surfaces so feature work is predictable.

**Deliverables**

- Documented routing entry points and provider wiring locations
- Confirmed error boundary posture at the app shell level
- Consolidated loading and empty states for shell-level routing

**Included scope**

- App shell layout and routing composition
- Error boundary posture and fallback UX at the root level

**Excluded scope**

- Feature-specific UI or domain flows
- API contract changes

**Risks and mitigations**

- Risk: Drift between shell behavior and docs
- Mitigation: Align updates with `docs/project-structure.md` and `docs/error-handling.md`

**Completion criteria**

- App shell behavior and boundaries are documented and aligned with canonical docs

**Optional follow-ups**

- Refinements to loading or skeleton patterns in shared UI primitives

### Phase 2: Auth Flow Maturity

**Goal**
Confirm the default auth flow and clarify optional auth strategies without changing the current contract.

**Deliverables**

- Consolidated auth flow notes aligned with `docs/security.md` and `docs/security.md` (Backend Auth Contract section)
- Explicit confirmation of Strategy 1 as default with Strategy 2 as optional

**Included scope**

- Auth guard behavior documentation alignment
- Error presentation alignment with `docs/error-handling.md`

**Excluded scope**

- New auth features, roles, or permissions modeling

**Risks and mitigations**

- Risk: Confusion between authentication and authorization
- Mitigation: Keep definitions and references centralized in `docs/security.md`

**Completion criteria**

- Auth flow references are consistent across docs and match current behavior

**Optional follow-ups**

- Auth UX verification scenarios in testing docs (if needed)

### Phase 3: UI Primitives Expansion and Design-System Tightening

**Goal**
Expand shared UI primitives only where cross-feature reuse is proven, while keeping component ownership clear.

**Deliverables**

- Small, stable shared UI primitives documented in `docs/design-system.md`
- Clear promotion criteria recorded as descriptive guidance

**Included scope**

- Shared UI primitives that are already reused or clearly cross-feature

**Excluded scope**

- Feature-specific components or visual systems

**Risks and mitigations**

- Risk: Shared UI dumping ground
- Mitigation: Keep scope narrow and align with `docs/design-system.md`

**Completion criteria**

- Shared UI primitives list is stable and aligned with actual usage

**Optional follow-ups**

- Visual regression targets for shared UI primitives

### Phase 4: Feature Scaffolding Templates and Example Feature

**Goal**
Provide a consistent feature scaffold for onboarding and reviews without introducing new architecture.

**Deliverables**

- Documentation-only feature scaffold guidance
- A minimal example feature or demo module (if needed) that mirrors the current structure

**Included scope**

- Feature-first structure guidance aligned with `docs/project-structure.md`

**Excluded scope**

- Production-only feature logic or new domain models

**Risks and mitigations**

- Risk: Demo code becomes a template for architecture changes
- Mitigation: Keep examples clearly labeled as documentation or onboarding aids

**Completion criteria**

- Feature scaffold guidance is easy to follow and consistent with canonical docs

**Optional follow-ups**

- Add a feature checklist to onboarding materials

### Phase 5: Testing Foundation

**Goal**
Ensure test scaffolding and examples align with the canonical testing model.

**Deliverables**

- MSW setup and shared test harness references
- A minimal example test for a representative feature flow

**Included scope**

- Testing setup and example coverage aligned with `docs/testing.md`

**Excluded scope**

- Broad test suite expansion or coverage targets

**Risks and mitigations**

- Risk: Example tests set incorrect expectations
- Mitigation: Keep examples small and aligned with the testing doc

**Completion criteria**

- Test harness and examples reflect current testing expectations

**Optional follow-ups**

- Visual regression targets for design-critical surfaces

### Phase 6: Performance Guardrails

**Goal**
Document performance measurement practices and guardrails without changing behavior.

**Deliverables**

- Profiling and measurement guidance aligned with `docs/performance.md`
- Notes about React Compiler usage in the current environment

**Included scope**

- Documentation-only performance guidance

**Excluded scope**

- New performance tooling or runtime changes

**Risks and mitigations**

- Risk: Premature optimization patterns reintroduced
- Mitigation: Keep guidance aligned with `docs/performance.md`

**Completion criteria**

- Performance expectations are documented and referenced from the guide

**Optional follow-ups**

- Add a lightweight performance checklist for PR reviews

### Phase 7: i18n Enablement or Deferral

**Goal**
Decide whether i18n is enabled for the core or explicitly deferred, based on current product needs.

**Deliverables**

- A clear statement of i18n status in documentation
- If enabled, minimal guidance that points to existing i18n implementation

**Included scope**

- Documentation status only

**Excluded scope**

- New localization features or translation workflows

**Risks and mitigations**

- Risk: Ambiguity about whether i18n is supported
- Mitigation: Explicitly document status and scope

**Completion criteria**

- i18n status is unambiguous and referenced in `docs/guide.md`

**Optional follow-ups**

- Expand i18n guidance if additional languages are onboarded

### Phase 8: CI Readiness

**Goal**
Clarify expectations for linting, type checking, and tests in CI without changing local workflows.

**Deliverables**

- CI expectations documented at a high level
- Alignment with `docs/testing.md`

**Included scope**

- Documentation of CI expectations

**Excluded scope**

- Build pipeline changes or infrastructure work

**Risks and mitigations**

- Risk: CI expectations out of sync with practice
- Mitigation: Keep expectations tied to existing scripts and documentation

**Completion criteria**

- CI expectations are documented and referenced from the guide

**Optional follow-ups**

- Add CI troubleshooting notes to onboarding docs

### Phase 9: Observability (Deferred)

**Goal**
Track observability needs without adopting new tooling yet.

**Deliverables**

- A documented deferral note and prerequisites for evaluation

**Included scope**

- Planning and evaluation criteria

**Excluded scope**

- New logging or error-reporting tooling

**Risks and mitigations**

- Risk: Untracked error reporting needs
- Mitigation: Revisit when production monitoring requirements are defined

**Completion criteria**

- Observability remains explicitly deferred with a review trigger

**Optional follow-ups**

- Evaluate vendor options when product requirements are known

## How to Propose a New Phase

A new phase proposal should include:

- A clear goal and user-visible or maintenance-driven motivation
- Evidence of pain, duplication, or cross-feature need
- A scoped deliverables list and explicit exclusions
- Links to impacted canonical docs with update expectations

If approved, the phase is added to this roadmap and tracked in `docs/progress.md` as changes land.

## Appendix: Canonical References

- `docs/guide.md`
- `docs/project-structure.md`
- `docs/design-system.md`
- `docs/state-management.md`
- `docs/api-layer.md`
- `docs/security.md`
- `docs/security.md` (Backend Auth Contract section)
- `docs/error-handling.md`
- `docs/performance.md`
- `docs/testing.md`
- `docs/roadmap.md`
- `docs/progress.md`
