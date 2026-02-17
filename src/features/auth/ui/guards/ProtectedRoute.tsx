import type { ReactNode } from "react";
import { useMemo } from "react";
import { Navigate, Outlet } from "react-router-dom";
import LoadingSpinner from "@shared/ui/LoadingSpinner";
import { useAuth, useIsAuthenticated } from "../../context";

interface ProtectedRouteProps {
  loadingFallback?: ReactNode;
}

export const ProtectedRoute = ({
  loadingFallback,
}: ProtectedRouteProps) => {
  const { loading, error } = useAuth();
  const isAuthenticated = useIsAuthenticated();

  const loadingContent = useMemo(
    () =>
      loadingFallback ?? (
        <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
          <LoadingSpinner size="lg" />
        </div>
      ),
    [loadingFallback],
  );

  if (loading) {
    return <>{loadingContent}</>;
  }

  if (error) {
    return <Navigate to="/login" replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
