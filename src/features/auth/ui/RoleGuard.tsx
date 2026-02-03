import type { ReactNode } from "react";
import type { User } from "../api/auth.contracts";
import { useAuthorization } from "../hooks/useAuthorization";

interface RoleGuardProps {
  children: ReactNode;
  requiredRole: User["role"];
  fallback?: ReactNode;
}

export const RoleGuard = ({
  children,
  requiredRole,
  fallback,
}: RoleGuardProps) => {
  const { isAuthorized, unmet } = useAuthorization({ requiredRole });

  if (!requiredRole || isAuthorized) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="rounded-lg border border-border bg-card p-8 shadow-md">
        <h2 className="mb-4 text-2xl font-bold text-danger">Access Denied</h2>
        <p className="text-muted-foreground">
          You don't have the required role:{" "}
          {unmet?.type === "role" ? unmet.value : requiredRole}
        </p>
      </div>
    </div>
  );
};
