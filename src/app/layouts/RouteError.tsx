import { useRouter, type ErrorComponentProps } from "@tanstack/react-router";

import { ErrorState } from "@/shared/ui/ErrorState";

export function RouteError({
  title = "This page could not load",
}: ErrorComponentProps & { title?: string }) {
  const router = useRouter();
  return (
    <ErrorState
      title={title}
      description="Please try again. If the problem continues, check the API connection or response."
      onRetry={() => void router.invalidate()}
    />
  );
}
