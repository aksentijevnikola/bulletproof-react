import type { ReactNode } from "react";
import { useAuthorization } from "../hooks/useAuthorization";

interface PermissionGuardProps {
  children: ReactNode;
  requiredPermission?: string;
  requiredPermissions?: string[];
  fallback?: ReactNode;
}

export const PermissionGuard = ({
  children,
  requiredPermission,
  requiredPermissions,
  fallback,
}: PermissionGuardProps) => {
  const { isAuthorized, unmet } = useAuthorization({
    requiredPermission,
    requiredPermissions,
  });

  if (!requiredPermission && (!requiredPermissions || requiredPermissions.length === 0)) {
    return <>{children}</>;
  }

  if (isAuthorized) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (unmet?.type === "permission") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="rounded-lg border border-border bg-card p-8 shadow-md">
          <h2 className="mb-4 text-2xl font-bold text-danger">Access Denied</h2>
          <p className="text-muted-foreground">
            You don't have the required permission: {unmet.value}
          </p>
        </div>
      </div>
    );
  }

  if (unmet?.type === "permissions") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="rounded-lg border border-border bg-card p-8 shadow-md">
          <h2 className="mb-4 text-2xl font-bold text-danger">Access Denied</h2>
          <p className="text-muted-foreground">You don't have the required permissions.</p>
        </div>
      </div>
    );
  }

  return null;
};
