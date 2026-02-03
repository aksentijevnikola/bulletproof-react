import { initAdvancedSelect } from "../init/init-advanced-select";

type AdvancedSelectInstance = {
  destroy: () => void;
  setValue?: (value: string | string[]) => void;
  clear?: () => void;
};

const instanceMap = new WeakMap<Element, AdvancedSelectInstance>();

const getInstance = (element: Element): AdvancedSelectInstance | null =>
  instanceMap.get(element) ?? null;

const setNativeValue = (element: Element, value: string | string[]): void => {
  if (!(element instanceof HTMLSelectElement)) return;
  const values = Array.isArray(value) ? value : [value];
  Array.from(element.options).forEach((option) => {
    option.selected = values.includes(option.value);
  });
};

export const advancedSelectAdapter = {
  init: (element: Element): void => {
    const existing = getInstance(element);
    if (existing) {
      existing.destroy();
      instanceMap.delete(element);
    }
    const instance = initAdvancedSelect(element);
    if (instance) {
      instanceMap.set(element, instance);
    }
  },

  destroy: (element: Element): void => {
    const existing = getInstance(element);
    if (!existing) return;
    existing.destroy();
    instanceMap.delete(element);
  },

  setValue: (element: Element, value: string | string[]): void => {
    const existing = getInstance(element);
    if (existing?.setValue) {
      existing.setValue(value);
      return;
    }
    setNativeValue(element, value);
  },

  clear: (element: Element): void => {
    const existing = getInstance(element);
    if (existing?.clear) {
      existing.clear();
      return;
    }
    setNativeValue(element, "");
  },
} as const;
