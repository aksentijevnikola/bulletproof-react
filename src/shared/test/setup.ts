import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import { setupMsw } from "./msw/setup";

setupMsw();

afterEach(() => {
  cleanup();
});
