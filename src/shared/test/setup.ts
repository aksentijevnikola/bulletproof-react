import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import { setupMsw } from "./msw/setup";
import { installBrowserShims } from "./runtime/install-browser-shims";

installBrowserShims();
setupMsw();

afterEach(() => {
  cleanup();
  globalThis.window?.localStorage.clear();
  globalThis.window?.sessionStorage.clear();
});
