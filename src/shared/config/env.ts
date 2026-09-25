import { z } from "zod";

const environmentSchema = z.object({
  VITE_API_BASE_URL: z.string().url().or(z.literal("")).default(""),
  VITE_MOCK_MODE: z.enum(["on", "off"]).default(import.meta.env.DEV ? "on" : "off"),
  VITE_MOCK_SCENARIO: z
    .enum(["success", "empty", "server-error", "validation-error", "retry-once"])
    .default("success"),
});

export const env = environmentSchema.parse(import.meta.env);
