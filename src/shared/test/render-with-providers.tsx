import type { ReactElement, ReactNode } from "react";
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import { render, type RenderOptions } from "@testing-library/react";
import { MemoryRouter, type MemoryRouterProps } from "react-router-dom";
import { NuqsAdapter } from "nuqs/adapters/react";
import { ThemeProvider } from "@features/theme";
import I18nProvider from "@/i18n/provider";
import i18n from "@/i18n";
import { createTestQueryClient } from "./query-client";

type RenderWithProvidersOptions = Omit<RenderOptions, "wrapper"> & {
  initialEntries?: MemoryRouterProps["initialEntries"];
  queryClient?: QueryClient;
};

const syncWindowLocation = (
  entry: NonNullable<MemoryRouterProps["initialEntries"]>[number],
) => {
  if (globalThis.window === undefined) return;

  if (typeof entry === "string") {
    globalThis.window.history.replaceState({}, "", entry);
    return;
  }

  const pathname = entry.pathname ?? "/";
  const search = entry.search ?? "";
  const hash = entry.hash ?? "";

  globalThis.window.history.replaceState(
    entry.state ?? {},
    "",
    `${pathname}${search}${hash}`,
  );
};

export function renderWithProviders(
  ui: ReactElement,
  options: RenderWithProvidersOptions = {},
) {
  const { initialEntries = ["/"], queryClient, ...renderOptions } = options;
  const testQueryClient = queryClient ?? createTestQueryClient();

  if (globalThis.window !== undefined) {
    globalThis.window.localStorage.setItem("selected-language", "en");
  }

  syncWindowLocation(initialEntries[0] ?? "/");

  if (i18n.language !== "en") {
    i18n.changeLanguage("en");
  }

  const wrapper = ({ children }: Readonly<{ children: ReactNode }>) => (
    <QueryClientProvider client={testQueryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        <NuqsAdapter>
          <I18nProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </I18nProvider>
        </NuqsAdapter>
      </MemoryRouter>
    </QueryClientProvider>
  );

  return {
    queryClient: testQueryClient,
    ...render(ui, {
      wrapper,
      ...renderOptions,
    }),
  };
}
