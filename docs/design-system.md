# Design System

Authoritative reference for how styling, tokens, and UI component ownership work together in the Bulletproof React frontend. This document is descriptive; enforceable rules live in `.codex/codex.rules.json`.

## Design System Scope

The design system governs:

- Styling foundations (Tailwind usage, tokens, and CSS variable strategy).
- The ownership model for UI components (feature components vs shared UI primitives).
- UI reuse strategy and how components are promoted (or not) across features.
- Preline integration as UI infrastructure.

The design system does **not** govern:

- API contracts or data fetching (`docs/api-layer.md`).
- State ownership (`docs/state-management.md`).
- Error-handling behavior (`docs/error-handling.md`).
- Performance strategy (`docs/performance.md`).
- Testing strategy (`docs/testing.md`).

## Styling Foundations

Styling is intentionally centralized around stable tokens and predictable utilities:

- Tailwind CSS v4 is used in CSS-first mode to keep styling declarative and reviewable.
- Design tokens live in `src/styles/index.css` and are expressed as CSS variables.
- Semantic color decisions resolve through those variables, which keeps light/dark mode consistent without duplicating style logic.
- Required token categories in `@theme` include colors, spacing, radii, shadows,
  typography, and breakpoints.
- Token-driven utilities are preferred because they preserve consistency and allow theme changes without rewriting component markup.

These foundations keep styling consistent across features while avoiding ad-hoc styling conventions.

## Component Ownership Model

Bulletproof React distinguishes between two kinds of UI components:

- **Feature UI components**: domain-specific UI that belongs to a single feature and is colocated with its logic.
- **Shared UI primitives**: small, domain-agnostic building blocks that are reused across multiple features.

There is intentionally no global component library. Feature-local components preserve domain clarity and deletion safety, while shared primitives remain narrow and infrastructure-like.

Promotion of a component to `shared/ui` is rare and explicit. It is justified only when the component is truly cross-feature, domain-agnostic, and stable in both behavior and styling expectations.

## `shared/ui/**` Explained (UI Infrastructure)

`shared/ui/**` is reserved for infrastructure-level UI primitives that multiple features use without inheriting domain logic.

Examples of shared primitives:

- Buttons and inputs
- Loading spinners and empty states
- Layout primitives and low-level shells

Explicit non-examples:

- Feature-specific cards, tables, or charts
- Auth, dashboard, or billing UI
- Components that encode business rules or permission logic

## Feature Components (`features/**`)

Feature components are the default home for UI. They own:

- Feature-specific layout and composition
- Domain-driven UI states and messaging
- Local presentation logic tied to feature behavior

Feature-local duplication is acceptable because it preserves independence and prevents shared layers from becoming a coupling point. Convenience reuse is discouraged when it would blur domain boundaries or force shared ownership for a single feature’s needs.

## Preline UI Integration

Preline is treated as UI infrastructure, not a feature system:

- Preline is used in markup-first mode for lightweight UI patterns.
- JS-powered Preline adapters live under `src/shared/ui/preline/**` and are wrapped in React for lifecycle control.
- Documentation-only examples live in this document and are not modeled as features.

This keeps Preline usage consistent without creating feature-level dependencies on a third-party UI toolkit.

## Preline Usage Examples (Reference)

Documentation-only examples. These are reference patterns only and are not imported by production features.

```tsx
import { useMemo } from "react";
import { useController, useForm } from "react-hook-form";
import type { AdvancedSelectOption } from "@shared/ui/preline/types/advanced-select";
import { useAdvancedSelect } from "@shared/ui/preline/hooks/useAdvancedSelect";

const baseSelectClassName =
  "w-full rounded-md border border-border bg-card px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

const selectConfig = JSON.stringify({
  placeholder: "Select an option",
});

const useMockOptions = (): AdvancedSelectOption[] =>
  useMemo(
    () => [
      { value: "alpha", label: "Alpha" },
      { value: "bravo", label: "Bravo" },
      { value: "charlie", label: "Charlie" },
    ],
    [],
  );

type AdvancedSelectStringFormValues = {
  advancedSelect: string;
};

type AdvancedSelectMultiFormValues = {
  advancedSelect: string[];
};

const AdvancedSelectControlledSingle = ({
  options,
  control,
  disabled,
}: {
  options: AdvancedSelectOption[];
  control: ReturnType<
    typeof useForm<AdvancedSelectStringFormValues>
  >["control"];
  disabled?: boolean;
}) => {
  const { field } = useController({
    name: "advancedSelect",
    control,
  });

  const { selectRef, selectProps } = useAdvancedSelect({
    value: field.value ?? "",
    onChange: (next) => {
      if (typeof next === "string") {
        field.onChange(next);
      }
    },
    onBlur: field.onBlur,
    disabled,
  });

  return (
    <select
      ref={selectRef}
      {...selectProps}
      data-hs-select={selectConfig}
      className={baseSelectClassName}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

const AdvancedSelectControlledMulti = ({
  options,
  control,
}: {
  options: AdvancedSelectOption[];
  control: ReturnType<typeof useForm<AdvancedSelectMultiFormValues>>["control"];
}) => {
  const { field } = useController({
    name: "advancedSelect",
    control,
  });

  const { selectRef, selectProps } = useAdvancedSelect({
    value: field.value ?? [],
    onChange: (next) => {
      if (Array.isArray(next)) {
        field.onChange(next);
      }
    },
    onBlur: field.onBlur,
    multiple: true,
  });

  return (
    <select
      ref={selectRef}
      {...selectProps}
      data-hs-select={selectConfig}
      className={baseSelectClassName}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export const AdvancedSelectSingleExample = () => {
  const options = useMockOptions();
  const { control } = useForm<AdvancedSelectStringFormValues>({
    defaultValues: { advancedSelect: "alpha" },
  });

  return <AdvancedSelectControlledSingle options={options} control={control} />;
};

export const AdvancedSelectMultiExample = () => {
  const options = useMockOptions();
  const { control } = useForm<AdvancedSelectMultiFormValues>({
    defaultValues: { advancedSelect: ["alpha"] },
  });

  return <AdvancedSelectControlledMulti options={options} control={control} />;
};

export const AdvancedSelectDisabledExample = () => {
  const options = useMockOptions();
  const { control } = useForm<AdvancedSelectStringFormValues>({
    defaultValues: { advancedSelect: "alpha" },
  });

  return (
    <AdvancedSelectControlledSingle
      options={options}
      control={control}
      disabled
    />
  );
};

export const AdvancedSelectRhfExample = () => {
  const options = useMockOptions();
  const { control } = useForm<AdvancedSelectStringFormValues>({
    defaultValues: { advancedSelect: "alpha" },
  });

  return <AdvancedSelectControlledSingle options={options} control={control} />;
};
```

## What This Architecture Intentionally Avoids

- A standalone component library or design-system package inside the repo.
- Shared UI dumping grounds that collect feature-level UI.
- Styling logic embedded in API or state layers.
- Feature-level ownership shifts just to avoid duplication.

## Relationship To Other Architecture Docs

- `docs/project-structure.md` for folder ownership and feature boundaries.
- `docs/performance.md` for rendering and UI performance guidance.
- `docs/state-management.md` for state ownership that affects UI behavior.
- `docs/testing.md` for UI testing and visual regression strategy.
