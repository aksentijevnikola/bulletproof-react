import { api } from "@shared/lib/http/api.client";
import type { ApiError } from "@shared/lib/http/api.client";
import {
  loginSchema,
  logoutResponseSchema,
  userSchema,
  type LoginPayload,
  type User,
} from "./auth.contracts";

export const authApi = {
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const data = await api.get<User>("/auth/me");
      return userSchema.parse(data);
    } catch (error) {
      const maybeApiError = error as ApiError;
      if (maybeApiError?.status === 401) {
        return null;
      }
      throw error;
    }
  },
  login: (payload: LoginPayload): Promise<User> => {
    const validatedPayload = loginSchema.parse(payload);
    return api
      .post<User>("/auth/login", validatedPayload)
      .then((data) => userSchema.parse(data));
  },
  logout: (): Promise<void> =>
    api.post("/auth/logout").then((data) => {
      logoutResponseSchema.parse(data);
      return undefined;
    }),
} as const;
