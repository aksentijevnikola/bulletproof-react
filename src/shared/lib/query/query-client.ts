/// <reference types="vite/client" />
import type { NetworkMode } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import { APP_CONFIG, ENV } from "@shared/config/environment";

// Environment-specific configuration
const isDevelopment = ENV.DEVELOPMENT;
const isProduction = ENV.PRODUCTION;

type QueryKeyPrimitive = string | number | boolean | null | undefined;
type QueryKeyObject = Record<string, QueryKeyPrimitive>;
type QueryKeyPart = QueryKeyPrimitive | QueryKeyObject;
type QueryKey = readonly QueryKeyPart[];

// Global query client configuration
const queryConfig = {
  defaultOptions: {
    queries: {
      staleTime: APP_CONFIG.CACHE.QUERY_STALE_TIME,
      gcTime: APP_CONFIG.CACHE.QUERY_GC_TIME,
      retry: APP_CONFIG.API.RETRY_ATTEMPTS,
      retryDelay: (attemptIndex: number) =>
        Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: !isProduction,
      refetchOnReconnect: !isProduction,
      refetchOnMount: isDevelopment,
      networkMode: "online" as NetworkMode,
    },

    mutations: {
      retry: isDevelopment ? 1 : 0,
      networkMode: "online" as NetworkMode,
    },
  },
};

// Create the query client with optimized configuration
export const queryClient = new QueryClient(queryConfig);

// Utility functions for common query patterns
export const queryUtils = {
  // Prefetch function for better UX
  prefetchQuery: <TData = object>(
    queryKey: QueryKey,
    queryFn: () => Promise<TData>,
    options?: {
      staleTime?: number;
    },
  ) => {
    return queryClient.prefetchQuery({
      queryKey,
      queryFn,
      staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    });
  },

  // Set query data with optimistic updates
  setQueryData: <TData = object>(
    queryKey: QueryKey,
    updater: TData | ((oldData: TData | undefined) => TData),
  ) => {
    return queryClient.setQueryData(queryKey, updater);
  },

  // Remove queries from cache
  removeQueries: (queryKey: QueryKey) => {
    return queryClient.removeQueries({
      queryKey,
      exact: true,
    });
  },

  // Get cached data
  getQueryData: <TData = object>(queryKey: QueryKey) => {
    return queryClient.getQueryData<TData>(queryKey);
  },

  // Check if query exists and is fresh
  isQueryFresh: (queryKey: QueryKey) => {
    const query = queryClient.getQueryState(queryKey);
    return query?.data !== undefined;
  },
};
