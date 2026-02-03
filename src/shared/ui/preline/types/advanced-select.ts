export type AdvancedSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
  meta?: Record<string, string>;
};

export type AdvancedSelectMode = "single" | "multiple";

export type AdvancedSelectValidationState = "neutral" | "success" | "error";

export type AdvancedSelectProps = {
  options: AdvancedSelectOption[];
  mode?: AdvancedSelectMode;
  disabled?: boolean;
  placeholder?: string;
  validationState?: AdvancedSelectValidationState;
};
