import type { User } from "../api/auth.contracts";
import { useUser } from "../context/user-context";
import { authorizationUtils } from "./useAuthorization";

// Custom hook to check if user has specific permission
// Permissions are not supported in this system.
// Authorization is role-only (user vs admin).
export const useUserHasPermission = (permission: string): never => {
  if (!permission) {
    throw new Error("Permission is required");
  }
  throw new Error(
    "useUserHasPermission is unsupported. This application uses role-only authorization.",
  );
};

// Custom hook to check if user has specific role
export const useUserHasRole = (role: User["role"]): boolean => {
  const user = useUser();
  return authorizationUtils.hasRole(user, role);
};

// Custom hook to check multiple permissions (AND logic)
export const useUserHasPermissions = (requiredPermissions: string[]): never => {
  if (!requiredPermissions || requiredPermissions.length === 0) {
    throw new Error("Permission is required");
  }
  throw new Error(
    "useUserHasPermissions is unsupported. This application uses role-only authorization.",
  );
};
