import type { ReactNode } from "react";
import { createContext, createElement, useContext, useMemo } from "react";
import type { UserResponse } from "../api/auth.contracts";
import { useCurrentUser } from "../hooks";

export type UserContextValue = {
  user: UserResponse | null;
  isAuthenticated: boolean;
};

export const UserContext = createContext<UserContextValue | undefined>(
  undefined,
);

type UserProviderProps = { children: ReactNode };

export const UserProvider = ({ children }: UserProviderProps) => {
  const { data: user } = useCurrentUser();

  const contextValue = useMemo(
    () => ({
      user: user ?? null,
      isAuthenticated: Boolean(user),
    }),
    [user],
  );

  return createElement(UserContext.Provider, { value: contextValue }, children);
};

export const useUserContext = (): UserContextValue => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

export const useUser = (): UserResponse | null => {
  const { user } = useUserContext();
  return user;
};

export const useUserRole = (): UserResponse["role"] | null => {
  const { user } = useUserContext();
  return user?.role || null;
};

export const useUserPermissions = (): string[] => {
  const { user } = useUserContext();
  return user?.permissions || [];
};

export const useIsAuthenticated = (): boolean => {
  const { isAuthenticated } = useUserContext();
  return isAuthenticated;
};
