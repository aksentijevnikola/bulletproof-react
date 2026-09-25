import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vite-plus/test";

import { HomePage } from "../index.ts";

describe("home page", () => {
  it("introduces a reusable application shell without product terminology", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", { name: "Build from a solid foundation" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/sample records are disposable demonstration data/i),
    ).toBeInTheDocument();
  });
});
