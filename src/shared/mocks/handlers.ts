import { delay, http, HttpResponse } from "msw";

import type { SampleRecordOutput } from "@/shared/api";
import { env } from "@/shared/config";

import { sampleRecords } from "./fixtures";

type Scenario = typeof env.VITE_MOCK_SCENARIO;

let records: SampleRecordOutput[] = [...sampleRecords];
let testScenario: Scenario | null = null;
let transientFailures = 0;

export function resetMockData() {
  records = [...sampleRecords];
  testScenario = null;
  transientFailures = 0;
}

export function setMockScenario(scenario: Scenario | null) {
  testScenario = scenario;
}

function scenario(): Scenario {
  if (testScenario) return testScenario;
  const fromUrl =
    typeof window === "undefined" ? null : new URL(window.location.href).searchParams.get("mock");
  return fromUrl === "empty" ||
    fromUrl === "server-error" ||
    fromUrl === "validation-error" ||
    fromUrl === "success" ||
    fromUrl === "retry-once"
    ? fromUrl
    : env.VITE_MOCK_SCENARIO;
}

async function simulatedDelay() {
  await delay(350);
}

function failure() {
  return HttpResponse.json({ message: "Mock server error" }, { status: 503 });
}

export const handlers = [
  http.get("*/api/sample-records", async () => {
    await simulatedDelay();
    if (scenario() === "retry-once" && transientFailures++ === 0) return failure();
    if (scenario() === "server-error") return failure();
    if (scenario() === "validation-error") return HttpResponse.json({ items: [{ id: 42 }] });
    return HttpResponse.json({ items: scenario() === "empty" ? [] : records });
  }),
  http.get("*/api/sample-records/:recordId", async ({ params }) => {
    await simulatedDelay();
    if (scenario() === "server-error") return failure();
    if (scenario() === "validation-error") return HttpResponse.json({ id: 42 });
    const record = records.find((item) => item.id === params.recordId);
    return record
      ? HttpResponse.json(record)
      : HttpResponse.json({ message: "Not found" }, { status: 404 });
  }),
  http.patch("*/api/sample-records/:recordId", async ({ params, request }) => {
    await simulatedDelay();
    if (scenario() === "server-error") return failure();
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || !("title" in body) || typeof body.title !== "string") {
      return HttpResponse.json({ message: "Invalid title" }, { status: 400 });
    }
    const title = body.title.trim();
    if (!title || title.length > 80)
      return HttpResponse.json({ message: "Invalid title" }, { status: 400 });
    const index = records.findIndex((record) => record.id === params.recordId);
    if (index === -1) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    const current = records[index];
    if (!current) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    const updated = { ...current, title };
    records = records.map((record) => (record.id === updated.id ? updated : record));
    return HttpResponse.json(updated);
  }),
];
