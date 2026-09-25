import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { env } from "@/shared/config";

import { App } from "./App";
import "./styles.css";

async function start() {
  if (import.meta.env.DEV && env.VITE_MOCK_MODE === "on") {
    const { startBrowserMocks } = await import("@/shared/mocks");
    await startBrowserMocks();
  }

  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("Root element is missing");
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

void start();
