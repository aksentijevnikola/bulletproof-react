export { handlers, resetMockData, setMockScenario } from "./handlers";

export async function startBrowserMocks() {
  const { worker } = await import("./browser");
  await worker.start({ onUnhandledRequest: "error" });
}
