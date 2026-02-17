import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { queryClient } from "@shared/lib/query/query-client";
import { AuthProvider, UserProvider } from "@features/auth";
import { ThemeProvider } from "@features/theme";
import { NuqsAdapter } from "nuqs/adapters/react";
export function AppProviders({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <AuthProvider>
          <UserProvider>
            <ThemeProvider>
              {children}
              <Toaster position="bottom-right" />
            </ThemeProvider>
          </UserProvider>
        </AuthProvider>
      </NuqsAdapter>
    </QueryClientProvider>
  );
}
