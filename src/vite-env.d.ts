/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_API_TIMEOUT?: string;
  readonly VITE_API_RETRY_ATTEMPTS?: string;
  readonly VITE_ENABLE_ANALYTICS?: string;
  readonly VITE_ENABLE_DEBUG_TOOLS?: string;
  readonly VITE_ENABLE_MOCK_API?: string;
  readonly VITE_ENABLE_PERFORMANCE_MONITORING?: string;
  readonly VITE_DEFAULT_THEME?: string;
  readonly VITE_DEFAULT_LOCALE?: string;
  readonly VITE_DEFAULT_CURRENCY?: string;
  readonly VITE_DATE_FORMAT?: string;
  readonly VITE_QUERY_STALE_TIME?: string;
  readonly VITE_QUERY_GC_TIME?: string;
  readonly VITE_ENABLE_OFFLINE?: string;
  readonly VITE_SESSION_TIMEOUT?: string;
  readonly VITE_CSRF_PROTECTION?: string;
  readonly VITE_CSP_ENABLED?: string;
  readonly VITE_BUNDLE_ANALYZER?: string;
  readonly VITE_SERVICE_WORKER?: string;
  readonly VITE_PWA?: string;
  readonly VITE_CHUNK_SIZE_WARNING?: string;
  readonly VITE_LOG_LEVEL?: string;
  readonly VITE_ENABLE_CONSOLE_LOGS?: string;
  readonly VITE_MOCK_API_DELAY?: string;
}

declare const __DEV__: boolean;
declare const __PROD__: boolean;
declare const __ANALYZE__: boolean;
declare const __APP_VERSION__: string;
declare const __BUILD_TIME__: string;
