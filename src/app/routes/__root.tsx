import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

import { AppShell } from "../layouts/AppShell";
import { RouteError } from "../layouts/RouteError";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
  errorComponent: RouteError,
  notFoundComponent: () => (
    <div className="py-20 text-center">
      <h1 className="text-4xl font-semibold">Page not found</h1>
      <p className="text-muted-foreground mt-3">The address does not match a page in this shell.</p>
    </div>
  ),
});
