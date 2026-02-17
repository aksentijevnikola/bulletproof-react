type IntegerEnvOptions = {
  min?: number;
  max?: number;
};

const TRUE_VALUES = new Set(["true", "1", "yes", "on"]);
const FALSE_VALUES = new Set(["false", "0", "no", "off"]);

export const parseBooleanEnv = (
  value: string | undefined,
): boolean | undefined => {
  if (value === undefined) {
    return undefined;
  }

  const normalized = value.trim().toLowerCase();

  if (TRUE_VALUES.has(normalized)) {
    return true;
  }

  if (FALSE_VALUES.has(normalized)) {
    return false;
  }

  return undefined;
};

export const parseIntegerEnv = (
  value: string | undefined,
  key: string,
  options: IntegerEnvOptions = {},
): number | undefined => {
  if (value === undefined) {
    return undefined;
  }

  const normalized = value.trim();

  if (!/^-?\d+$/.test(normalized)) {
    throw new Error(`Invalid ${key}: expected an integer, received "${value}"`);
  }

  const parsed = Number.parseInt(normalized, 10);

  if (!Number.isInteger(parsed)) {
    throw new TypeError(
      `Invalid ${key}: expected an integer, received "${value}"`,
    );
  }

  if (options.min !== undefined && parsed < options.min) {
    throw new Error(
      `Invalid ${key}: expected >= ${options.min}, received "${value}"`,
    );
  }

  if (options.max !== undefined && parsed > options.max) {
    throw new Error(
      `Invalid ${key}: expected <= ${options.max}, received "${value}"`,
    );
  }

  return parsed;
};

export const assertValidApiBaseUrl = (
  value: string | undefined,
  key: string,
): void => {
  if (value === undefined) {
    return;
  }

  if (value.startsWith("/")) {
    return;
  }

  let parsed: URL;

  try {
    parsed = new URL(value);
  } catch {
    throw new Error(
      `Invalid ${key}: expected a relative path (/api) or absolute URL, received "${value}"`,
    );
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error(
      `Invalid ${key}: expected http or https URL, received "${value}"`,
    );
  }
};
