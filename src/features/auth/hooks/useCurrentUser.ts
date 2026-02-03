import { useQuery } from "@tanstack/react-query";
import type { User } from "../api/auth.contracts";
import { authApi } from "../api/auth.api";
import { authQueryKeys } from "../api/query-keys";

export const useCurrentUser = () => {
  return useQuery<User | null, Error>({
    queryKey: authQueryKeys.user(),
    queryFn: authApi.getCurrentUser,
    retry: false,
  });
};
