import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vite-plus/test";

import { ThemeControl } from "../layouts/ThemeControl.tsx";
import { ThemeProvider } from "../theme-provider.tsx";

describe("theme control", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("light", "dark");
  });

  it("cycles from system to light and persists the choice", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeControl />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Theme: System" }));

    expect(screen.getByRole("button", { name: "Theme: Light" })).toBeInTheDocument();
    expect(document.documentElement).toHaveClass("light");
    expect(localStorage.getItem("bulletproof-react-theme")).toBe("light");
  });
});
