import type { ReactNode } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

type AppShellLayoutProps = {
  headerRight?: ReactNode;
};

const AppShellLayout = ({ headerRight }: AppShellLayoutProps) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinkActiveClassName =
    "px-3 py-2 rounded-md text-sm text-foreground font-medium";
  const navLinkInactiveClassName =
    "px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-hover hover:text-primary-foreground";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-card shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-foreground">
                  Finance Dashboard
                </h1>
              </div>
            </div>
            {headerRight ? (
              <div className="flex items-center">{headerRight}</div>
            ) : null}
          </div>
        </div>
      </header>

      <nav className="bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <Link
              to="/dashboard"
              className={
                isActive("/dashboard")
                  ? navLinkActiveClassName
                  : navLinkInactiveClassName
              }
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppShellLayout;
