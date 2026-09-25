import type { SampleRecordOutput } from "@/shared/api";

export const sampleRecords: readonly SampleRecordOutput[] = [
  { id: "sample-1", title: "First sample", summary: "A neutral example record.", status: "ready" },
  {
    id: "sample-2",
    title: "Second sample",
    summary: "Another record to explore.",
    status: "draft",
  },
];
