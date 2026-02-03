export const authQueryKeys = {
  all: ["auth"] as const,
  user: () => [...authQueryKeys.all, "user"] as const,
  permissions: () => [...authQueryKeys.all, "permissions"] as const,
};
