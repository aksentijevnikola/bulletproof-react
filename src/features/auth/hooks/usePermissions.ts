import { useCallback, useMemo } from "react";
import { useCurrentUser } from "./useCurrentUser";
import {
  hasAllPermissions as hasAllPermissionsFromSet,
  hasAnyPermission as hasAnyPermissionFromSet,
  hasPermission as hasPermissionFromSet,
} from "../lib";

type UsePermissionsResult = {
  permissions: string[];
  hasPermission: (permission: string) => boolean;
  hasAllPermissions: (required: string[]) => boolean;
  hasAnyPermission: (required: string[]) => boolean;
  isLoading: boolean;
};

export const usePermissions = (): UsePermissionsResult => {
  const { data: user, isLoading } = useCurrentUser();
  const permissions = useMemo(() => user?.permissions ?? [], [user?.permissions]);

  const permissionSet = useMemo(() => new Set(permissions), [permissions]);

  const hasPermission = useCallback(
    (permission: string): boolean => {
      return hasPermissionFromSet(permissionSet, permission);
    },
    [permissionSet],
  );

  const hasAllPermissions = useCallback(
    (required: string[]): boolean => {
      return hasAllPermissionsFromSet(permissionSet, required);
    },
    [permissionSet],
  );

  const hasAnyPermission = useCallback(
    (required: string[]): boolean => {
      return hasAnyPermissionFromSet(permissionSet, required);
    },
    [permissionSet],
  );

  return {
    permissions,
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    isLoading,
  };
};
