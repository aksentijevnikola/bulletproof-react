import { z } from "zod";

export const loginSchema = z.object({
  email: z.email({ error: "Please enter a valid email address." }),
  password: z.string().min(6, { error: "Password must be at least 6 characters" }),
});

export const userSchema = z.object({
  id: z.string(),
  email: z.email(),
  name: z.string(),
  role: z.string(),
  permissions: z.array(z.string()),
  avatar: z.string().optional(),
  preferences: z
    .object({
      theme: z.enum(["light", "dark"]).optional(),
      language: z.string().optional(),
      timezone: z.string().optional(),
  })
    .optional(),
});

export const logoutResponseSchema = z.object({
  success: z.boolean().optional(),
});

export type LoginFormData = z.input<typeof loginSchema>;
export type LoginPayload = z.input<typeof loginSchema>;
export type User = z.output<typeof userSchema>;
export type LogoutResponse = z.output<typeof logoutResponseSchema>;
