import { useEffect, useMemo, useRef } from "react";
import type React from "react";
import { advancedSelectAdapter } from "../adapters/advanced-select.adapter";

type UseAdvancedSelectParams = {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  onBlur?: () => void;
  disabled?: boolean;
  multiple?: boolean;
  reinitKey?: string | number;
};

type UseAdvancedSelectResult = {
  selectRef: React.RefObject<HTMLSelectElement | null>;
  selectProps: {
    value: string | string[];
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    onBlur?: () => void;
    disabled?: boolean;
    multiple?: boolean;
  };
};

const getSelectValue = (
  event: React.ChangeEvent<HTMLSelectElement>,
  multiple?: boolean,
): string | string[] => {
  if (!multiple) return event.target.value;
  const values = Array.from(event.target.selectedOptions).map(
    (option) => option.value,
  );
  return values;
};

export const useAdvancedSelect = ({
  value,
  onChange,
  onBlur,
  disabled,
  multiple,
  reinitKey,
}: UseAdvancedSelectParams): UseAdvancedSelectResult => {
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    const element = selectRef.current;
    if (!element) return;
    advancedSelectAdapter.init(element);
    return () => {
      advancedSelectAdapter.destroy(element);
    };
  }, [reinitKey]);

  useEffect(() => {
    const element = selectRef.current;
    if (!element) return;
    advancedSelectAdapter.setValue(element, value);
  }, [value]);

  const handleChange = useMemo(() => {
    return (event: React.ChangeEvent<HTMLSelectElement>) => {
      onChange(getSelectValue(event, multiple));
    };
  }, [onChange, multiple]);

  return {
    selectRef,
    selectProps: {
      value,
      onChange: handleChange,
      onBlur,
      disabled,
      multiple,
    },
  };
};
