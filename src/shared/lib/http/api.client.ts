// src/shared/lib/http/api.client.ts
// Domain-agnostic HTTP client (frontend only)

import axios from "axios";
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { APP_CONFIG } from "@shared/config/environment";

/* --------------------------------------------------
 * Error model (stable, minimal)
 * -------------------------------------------------- */

export type ApiError = {
  name: "ApiError";
  message: string;
  code: string;
  status?: number;
};

type ApiEnvelope = {
  success?: boolean;
  message?: string;
  code?: string;
};

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
type JsonObject = { [key: string]: JsonValue | undefined };

/* --------------------------------------------------
 * Error factory
 * -------------------------------------------------- */

const createApiError = (
  message: string,
  code: string,
  status?: number,
): ApiError => ({
  name: "ApiError",
  message,
  code,
  status,
});

/* --------------------------------------------------
 * Axios instance
 * -------------------------------------------------- */

const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: APP_CONFIG.API.BASE_URL,
    timeout: APP_CONFIG.API.TIMEOUT,
    withCredentials: true,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  /* ----------------------------
   * Response normalization
   * ---------------------------- */

  client.interceptors.response.use(
    (response: AxiosResponse<ApiEnvelope>) => {
      const envelope = response.data;
      if (envelope?.success === false) {
        throw createApiError(
          envelope.message ?? "Request failed",
          envelope.code ?? "API_ERROR",
          response.status,
        );
      }

      return response;
    },
    (error: AxiosError<ApiEnvelope>) => {
      const response = error.response;

      // Network / CORS / timeout
      if (!response) {
        throw createApiError(
          "Network error. Please try again.",
          "NETWORK_ERROR",
        );
      }

      // HTTP errors
      const status: number = response.status;
      const envelope = response.data;
      const message: string =
        envelope?.message ?? error.message ?? "Request failed";

      const code: string = envelope?.code ?? `HTTP_${status}`;

      throw createApiError(message, code, status);
    },
  );

  return client;
};

/* --------------------------------------------------
 * Singleton client
 * -------------------------------------------------- */

export const apiClient = createApiClient();

/* --------------------------------------------------
 * Typed request helpers
 * -------------------------------------------------- */

export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.get<T>(url, config).then((r) => r.data),

  post: <T>(
    url: string,
    data?: JsonValue,
    config?: AxiosRequestConfig,
  ): Promise<T> => apiClient.post<T>(url, data, config).then((r) => r.data),

  put: <T>(
    url: string,
    data?: JsonValue,
    config?: AxiosRequestConfig,
  ): Promise<T> => apiClient.put<T>(url, data, config).then((r) => r.data),

  patch: <T>(
    url: string,
    data?: JsonValue,
    config?: AxiosRequestConfig,
  ): Promise<T> => apiClient.patch<T>(url, data, config).then((r) => r.data),

  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.delete<T>(url, config).then((r) => r.data),

  raw: apiClient,
} as const;
