import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { Component, type ErrorInfo, type PropsWithChildren, type ReactNode } from "react";

import { ErrorState } from "@/shared/ui/ErrorState";

import { createAppRouter, createQueryClient } from "./router";
import { ThemeProvider } from "./theme-provider";

const queryClient = createQueryClient();
const router = createAppRouter(queryClient);

interface BoundaryState {
  failed: boolean;
}

class GlobalErrorBoundary extends Component<PropsWithChildren, BoundaryState> {
  state: BoundaryState = { failed: false };

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Uncaught application error", error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.failed) {
      return (
        <ErrorState
          title="The application could not continue"
          onRetry={() => window.location.reload()}
        />
      );
    }
    return this.props.children;
  }
}

export function App() {
  return (
    <GlobalErrorBoundary>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ThemeProvider>
    </GlobalErrorBoundary>
  );
}
