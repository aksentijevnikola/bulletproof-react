import { api } from "@/shared";
import {
  loginSchema,
  logoutResponseSchema,
  userSchema,
  type LoginPayload,
  type UserResponse,
} from "./auth.contracts";

const AUTH_ENDPOINTS = {
  CURRENT_USER: "/auth/me",
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
} as const;

export const getCurrentUser = async (): Promise<UserResponse | null> => {
  const response = await api.get<unknown>(AUTH_ENDPOINTS.CURRENT_USER);

  if (response == null) {
    return null;
  }

  return userSchema.parse(response);
};

export const login = async (payload: LoginPayload): Promise<UserResponse> => {
  const validatedPayload = loginSchema.parse(payload);
  const response = await api.post<unknown>(AUTH_ENDPOINTS.LOGIN, validatedPayload);

  return userSchema.parse(response);
};

export const logout = async (): Promise<void> => {
  const response = await api.post<unknown>(AUTH_ENDPOINTS.LOGOUT);
  if (response != null) {
    logoutResponseSchema.parse(response);
  }
};
