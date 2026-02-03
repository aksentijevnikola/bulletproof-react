type PrelineSelectInstance = {
  destroy: () => void;
  setValue?: (value: string | string[]) => void;
  clear?: () => void;
};

type PrelineSelectStatic = {
  getInstance?: (element: Element) => PrelineSelectInstance | null;
  createInstance?: (element: Element) => PrelineSelectInstance;
};

type PrelineWindow = Window & {
  HSSelect?: PrelineSelectStatic;
};

const getPrelineSelect = (): PrelineSelectStatic | null => {
  if (globalThis.window === undefined) return null;
  const globalValue = (globalThis.window as PrelineWindow).HSSelect;
  return globalValue ?? null;
};

export const initAdvancedSelect = (
  element: Element,
): PrelineSelectInstance | null => {
  const preline = getPrelineSelect();
  if (!preline) return null;
  if (preline.getInstance) {
    const existing = preline.getInstance(element);
    if (existing) return existing;
  }
  return preline.createInstance ? preline.createInstance(element) : null;
};
