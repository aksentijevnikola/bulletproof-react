import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "./auth-context";
import { authApi } from "../api/auth.api";
import { authQueryKeys } from "../api/query-keys";
import type { LoginPayload, User } from "../api/auth.contracts";
import { useCurrentUser } from "../hooks/useCurrentUser"; // from the cleaner pattern

type AuthProviderProps = { children: ReactNode };

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const queryClient = useQueryClient();
  const userQuery = useCurrentUser();
  const authErrorHandledRef = useRef(false);

  const {
    mutateAsync: loginMutate,
    isPending: isLoginPending,
    error: loginError,
  } = useMutation<User, Error, LoginPayload>({
    mutationFn: authApi.login,
    onSuccess: (user) => {
      queryClient.setQueryData(authQueryKeys.user(), user);
    },
  });

  const { mutateAsync: logoutMutate, error: logoutError } = useMutation<
    undefined,
    Error,
    undefined
  >({
    mutationFn: async (): Promise<undefined> => {
      await authApi.logout();
      return undefined;
    },
    onSettled: () => {
      queryClient.clear();
      queryClient.setQueryData(authQueryKeys.user(), null);
    },
  });

  const checkAuth = useCallback(async (): Promise<void> => {
    await userQuery.refetch();
  }, [userQuery]);

  useEffect(() => {
    if (!userQuery.error) {
      authErrorHandledRef.current = false;
      return;
    }

    if (!authErrorHandledRef.current) {
      authErrorHandledRef.current = true;
      queryClient.removeQueries({ queryKey: authQueryKeys.all, exact: false });
      queryClient.setQueryData(authQueryKeys.user(), null);
    }
  }, [userQuery.error, queryClient]);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        await loginMutate({ email, password });
        return { success: true as const };
      } catch (err) {
        return {
          success: false as const,
          error: err instanceof Error ? err.message : "Login failed",
        };
      }
    },
    [loginMutate],
  );

  const logout = useCallback(async (): Promise<void> => {
    await logoutMutate(undefined);
  }, [logoutMutate]);

  const contextValue = useMemo(
    () => ({
      loading: userQuery.isLoading || isLoginPending,
      error: userQuery.error ?? loginError ?? logoutError ?? null,
      login,
      logout,
      checkAuth,
    }),
    [
      userQuery.isLoading,
      userQuery.error,
      isLoginPending,
      loginError,
      logoutError,
      login,
      logout,
      checkAuth,
    ],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
