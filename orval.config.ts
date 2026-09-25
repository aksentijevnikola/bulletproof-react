import { defineConfig } from "orval";

const checkOutputDirectory = process.env.ORVAL_CHECK_OUTPUT_DIR;

export default defineConfig({
  sampleRecords: {
    input: { target: "./openapi/sample-records.yaml" },
    output: {
      mode: "single",
      target: checkOutputDirectory
        ? `${checkOutputDirectory}/sample-records.ts`
        : "./src/shared/api/generated/sample-records.ts",
      schemas: {
        path: checkOutputDirectory
          ? `${checkOutputDirectory}/schemas`
          : "./src/shared/api/generated/schemas",
        type: "zod",
      },
      client: "react-query",
      httpClient: "fetch",
      clean: true,
      baseUrl: {
        runtime: "env.VITE_API_BASE_URL",
        imports: [{ name: "env", importPath: "@/shared/config/env" }],
      },
      override: {
        fetch: { runtimeValidation: true, includeHttpResponseReturnType: true },
        query: { version: 5, signal: true },
      },
    },
  },
});
