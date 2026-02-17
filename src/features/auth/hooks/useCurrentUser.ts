import { useQuery } from "@tanstack/react-query";
import type { UserResponse } from "../api/auth.contracts";
import { getCurrentUser } from "../api/auth.requests";
import { authQueryKeys } from "../api/query-keys";

export const useCurrentUser = () => {
  return useQuery<UserResponse | null, Error>({
    queryKey: authQueryKeys.user(),
    queryFn: getCurrentUser,
    retry: false,
  });
};
