import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from "@shared/ui/ErrorBoundary";
import LoadingSpinner from "@shared/ui/LoadingSpinner";
import AppShellLayout from "@app/layout";
import { ThemeSwitcher } from "@features/theme";

// Lazy load components for code splitting
const Dashboard = lazy(() => import("@pages/Dashboard"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner />
  </div>
);

const App = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public route(s) */}
            {/* <Route path="/login" element={<LoginPage />} /> */}

            {/* Protected layout with nested routes */}
            {/* <Route element={<ProtectedRoute />}> */}
            <Route>
              <Route element={<AppShellLayout headerRight={<ThemeSwitcher />} />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
