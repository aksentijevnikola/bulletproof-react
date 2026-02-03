import type { ReactNode } from "react";
import { createContext, createElement, useContext, useMemo } from "react";
import type { User } from "../api/auth.contracts";
import { useCurrentUser } from "../hooks/useCurrentUser";

export type UserContextValue = {
  user: User | null;
  isAuthenticated: boolean;
};

// Create context
export const UserContext = createContext<UserContextValue | undefined>(
  undefined,
);

// User Provider component
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


// Hook to use user context
export const useUserContext = (): UserContextValue => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

// Helper hooks
export const useUser = (): User | null => {
  const { user } = useUserContext();
  return user;
};

export const useUserRole = (): User["role"] | null => {
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
