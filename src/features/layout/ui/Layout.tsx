import { Outlet, Link, useLocation } from "react-router-dom";
import { ThemeSwitcher } from "@features/theme";

const Layout = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinkActiveClassName =
    "px-3 py-2 rounded-md text-sm font-medium bg-primary-subtle text-primary-subtle-foreground";
  const navLinkInactiveClassName =
    "px-3 py-2 rounded-md text-sm font-medium text-primary-foreground hover:bg-primary-hover hover:text-primary-foreground";

  return (
    <div className="min-h-screen min-w-screen bg-background text-foreground">
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
            <div className="flex items-center">
              <ThemeSwitcher />
            </div>
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

export default Layout;
