import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vite-plus/test";

import { setMockScenario } from "@/shared/mocks";
import { server } from "@/test/msw";

import { routeTree } from "../routeTree.gen";
import { ThemeProvider } from "../theme-provider";

function renderAt(path: string) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const router = createRouter({
    routeTree,
    context: { queryClient },
    history: createMemoryHistory({ initialEntries: [path] }),
  });
  render(
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>,
  );
  return { router, queryClient };
}

describe("application routes", () => {
  it("starts on the home page and navigates to the record list", async () => {
    const user = userEvent.setup();
    renderAt("/");
    expect(
      await screen.findByRole("heading", { name: "Build from a solid foundation" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("link", { name: "Sample records" }));
    expect(await screen.findByRole("heading", { name: "Sample records" })).toBeInTheDocument();
    expect(await screen.findByRole("link", { name: "First sample" })).toBeInTheDocument();
  });

  it("loads a record detail", async () => {
    renderAt("/records/sample-1");
    expect(await screen.findByRole("heading", { name: "First sample" })).toBeInTheDocument();
  });

  it("shows an observable route-level pending state", async () => {
    renderAt("/records");
    expect(
      await screen.findByRole("status", { name: "Loading sample records" }),
    ).toBeInTheDocument();
    expect(await screen.findByRole("link", { name: "First sample" })).toBeInTheDocument();
  });

  it("sorts the record table by title", async () => {
    const user = userEvent.setup();
    renderAt("/records");
    await screen.findByRole("link", { name: "First sample" });
    await user.click(screen.getByRole("button", { name: "Title" }));
    const titles = screen
      .getAllByRole("row")
      .slice(1)
      .map((row) => row.querySelector("a")?.textContent);
    expect(titles).toEqual(["First sample", "Second sample"]);
    await user.click(screen.getByRole("button", { name: "Title" }));
    const reversed = screen
      .getAllByRole("row")
      .slice(1)
      .map((row) => row.querySelector("a")?.textContent);
    expect(reversed).toEqual(["Second sample", "First sample"]);
  });

  it("shows a not-found page for an unknown route", async () => {
    renderAt("/missing");
    expect(await screen.findByRole("heading", { name: "Page not found" })).toBeInTheDocument();
  });

  it("distinguishes a missing sample record from an unknown route", async () => {
    renderAt("/records/does-not-exist");
    expect(
      await screen.findByRole("heading", { name: "Sample record unavailable" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Page not found" })).not.toBeInTheDocument();
  });

  it("shows the empty state", async () => {
    setMockScenario("empty");
    renderAt("/records");
    expect(await screen.findByText("No sample records")).toBeInTheDocument();
  });

  it("shows an API error and a retry action", async () => {
    setMockScenario("server-error");
    const user = userEvent.setup();
    renderAt("/records");
    expect(
      await screen.findByRole("heading", { name: "This page could not load" }),
    ).toBeInTheDocument();
    setMockScenario("success");
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(await screen.findByRole("link", { name: "First sample" })).toBeInTheDocument();
  });

  it("rejects a malformed API response through the generated client", async () => {
    setMockScenario("validation-error");
    renderAt("/records");
    expect(
      await screen.findByRole("heading", { name: "This page could not load" }),
    ).toBeInTheDocument();
  });

  it.each([
    ["text content type", () => HttpResponse.text("not a record list")],
    ["missing content type", () => new HttpResponse("not a record list")],
  ])("rejects a successful response with %s", async (_label, response) => {
    server.use(http.get("*/api/sample-records", response));
    renderAt("/records");
    expect(
      await screen.findByRole("heading", { name: "This page could not load" }),
    ).toBeInTheDocument();
  });

  it("rejects an HTTP failure even when its body looks like a valid success", async () => {
    server.use(
      http.get("*/api/sample-records", () => HttpResponse.json({ items: [] }, { status: 503 })),
    );
    renderAt("/records");
    expect(
      await screen.findByRole("heading", { name: "This page could not load" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("No sample records")).not.toBeInTheDocument();
  });

  it("recovers from a transient mock failure on retry", async () => {
    setMockScenario("retry-once");
    const user = userEvent.setup();
    renderAt("/records");
    expect(
      await screen.findByRole("heading", { name: "This page could not load" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(await screen.findByRole("link", { name: "First sample" })).toBeInTheDocument();
  });

  it("renames a record and refreshes the visible detail", async () => {
    const user = userEvent.setup();
    renderAt("/records/sample-1");
    const title = await screen.findByRole("textbox", { name: "Rename this sample" });
    await user.clear(title);
    await user.type(title, "Renamed sample");
    await user.click(screen.getByRole("button", { name: "Save name" }));
    expect(screen.getByRole("button", { name: "Saving…" })).toBeDisabled();
    expect(await screen.findByRole("heading", { name: "Renamed sample" })).toBeInTheDocument();
  });

  it("rejects an invalid mutation response without showing a false success", async () => {
    server.use(
      http.patch("*/api/sample-records/:recordId", () => HttpResponse.text("not a record")),
    );
    const user = userEvent.setup();
    renderAt("/records/sample-1");
    const title = await screen.findByRole("textbox", { name: "Rename this sample" });
    await user.clear(title);
    await user.type(title, "Unconfirmed name");
    await user.click(screen.getByRole("button", { name: "Save name" }));
    expect(await screen.findByText("Could not save the name. Try again.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "First sample" })).toBeInTheDocument();
  });

  it("supports keyboard navigation to the mobile menu", async () => {
    const user = userEvent.setup();
    renderAt("/");
    const menu = await screen.findByRole("button", { name: "Open navigation menu" });
    menu.focus();
    await user.keyboard("{Enter}");
    expect(await screen.findByRole("menuitem", { name: "Sample records" })).toBeInTheDocument();
  });
});
