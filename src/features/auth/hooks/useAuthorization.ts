import { useMemo } from "react";
import type { User } from "../api/auth.contracts";
import { useUser } from "../context/user-context";

type AuthorizationRequirements = {
  requiredPermission?: string;
  requiredPermissions?: string[];
  requiredRole?: User["role"];
};

type AuthorizationResult = {
  isAuthorized: boolean;
  unmet:
    | { type: "permission"; value: string }
    | { type: "permissions" }
    | { type: "role"; value: User["role"] }
    | null;
};

const hasRole = (user: User | null, role: User["role"]): boolean =>
  user?.role === role;

export const useAuthorization = ({
  requiredPermission,
  requiredPermissions,
  requiredRole,
}: AuthorizationRequirements): AuthorizationResult => {
  const user = useUser();

  return useMemo(() => {
    if (requiredPermission) {
      return {
        isAuthorized: false,
        unmet: { type: "permission" as const, value: requiredPermission },
      };
    }

    if (requiredPermissions && requiredPermissions.length > 0) {
      return {
        isAuthorized: false,
        unmet: { type: "permissions" as const },
      };
    }

    if (requiredRole) {
      const allowed = hasRole(user, requiredRole);
      return {
        isAuthorized: allowed,
        unmet: allowed ? null : { type: "role" as const, value: requiredRole },
      };
    }

    return { isAuthorized: true, unmet: null };
  }, [requiredPermission, requiredPermissions, requiredRole, user]);
};

export const authorizationUtils = {
  hasRole,
} as const;
