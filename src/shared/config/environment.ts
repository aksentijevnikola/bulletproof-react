// src/shared/config/environment.ts
// Authoritative frontend environment configuration

type EnvMode = "development" | "production" | "test";

/* --------------------------------------------------
 * Internal helpers (file-local only)
 * -------------------------------------------------- */

const readString = (key: keyof ImportMetaEnv, fallback: string): string => {
  const value = import.meta.env[key];
  return typeof value === "string" && value.length > 0 ? value : fallback;
};

const readBoolean = (key: keyof ImportMetaEnv, fallback = false): boolean => {
  const value = import.meta.env[key];
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
};

const readNumber = (key: keyof ImportMetaEnv, fallback: number): number => {
  const value = Number(import.meta.env[key]);
  return Number.isFinite(value) ? value : fallback;
};

/* --------------------------------------------------
 * Environment flags
 * -------------------------------------------------- */

export const ENV = {
  MODE: import.meta.env.MODE as EnvMode,
  IS_DEV: import.meta.env.MODE === "development",
  IS_PROD: import.meta.env.PROD,
  IS_TEST: import.meta.env.MODE === "test",
  DEVELOPMENT: import.meta.env.MODE === "development",
  PRODUCTION: import.meta.env.PROD,
} as const;

/* --------------------------------------------------
 * Application configuration (immutable)
 * -------------------------------------------------- */

export const APP_CONFIG = {
  API: {
    BASE_URL: readString("VITE_API_BASE_URL", "http://localhost:3001/api"),
    TIMEOUT: readNumber("VITE_API_TIMEOUT", 30_000),
    RETRY_ATTEMPTS: readNumber("VITE_API_RETRY_ATTEMPTS", ENV.IS_DEV ? 1 : 3),
  },

  FEATURES: {
    ANALYTICS: readBoolean("VITE_ENABLE_ANALYTICS"),
    DEBUG_TOOLS: readBoolean("VITE_ENABLE_DEBUG_TOOLS") || ENV.IS_DEV,
    MOCK_API: readBoolean("VITE_ENABLE_MOCK_API"),
    PERFORMANCE_MONITORING:
      readBoolean("VITE_ENABLE_PERFORMANCE_MONITORING") || ENV.IS_PROD,
  },

  UI: {
    THEME: readString("VITE_DEFAULT_THEME", "light"),
    LOCALE: readString("VITE_DEFAULT_LOCALE", "en"),
    DATE_FORMAT: readString("VITE_DATE_FORMAT", "dd/MM/yyyy"),
  },

  CACHE: {
    QUERY_STALE_TIME: readNumber(
      "VITE_QUERY_STALE_TIME",
      ENV.IS_DEV ? 30_000 : 300_000,
    ),
    QUERY_GC_TIME: readNumber(
      "VITE_QUERY_GC_TIME",
      ENV.IS_DEV ? 300_000 : 600_000,
    ),
    OFFLINE_ENABLED: readBoolean("VITE_ENABLE_OFFLINE"),
  },

  SECURITY: {
    SESSION_TIMEOUT: readNumber("VITE_SESSION_TIMEOUT", 1_800_000),
    CSRF_AWARENESS: readBoolean("VITE_CSRF_PROTECTION") || ENV.IS_PROD,
    CSP_AWARENESS: readBoolean("VITE_CSP_ENABLED") || ENV.IS_PROD,
  },

  DEBUG: {
    LOG_LEVEL: readString("VITE_LOG_LEVEL", ENV.IS_DEV ? "debug" : "error"),
    MOCK_API_DELAY: readNumber("VITE_MOCK_API_DELAY", 500),
  },
} as const;

/* --------------------------------------------------
 * Derived helpers (read-only)
 * -------------------------------------------------- */

export const envUtils = {
  isDev: () => ENV.IS_DEV,
  isProd: () => ENV.IS_PROD,
  isTest: () => ENV.IS_TEST,

  getApiConfig: () => ({
    baseURL: APP_CONFIG.API.BASE_URL,
    timeout: APP_CONFIG.API.TIMEOUT,
    retry: APP_CONFIG.API.RETRY_ATTEMPTS,
    withCredentials: true,
  }),

  getQueryConfig: () => ({
    staleTime: APP_CONFIG.CACHE.QUERY_STALE_TIME,
    gcTime: APP_CONFIG.CACHE.QUERY_GC_TIME,
    retry: APP_CONFIG.API.RETRY_ATTEMPTS,
    refetchOnWindowFocus: ENV.IS_DEV,
    refetchOnReconnect: ENV.IS_DEV,
  }),
} as const;

export default APP_CONFIG;
