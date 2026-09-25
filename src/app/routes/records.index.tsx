import { createFileRoute } from "@tanstack/react-router";

import { RecordsPage } from "@/pages/records";
import { recordsQueryOptions } from "@/pages/records";
import { LoadingState } from "@/shared/ui/LoadingState";

import { RouteError } from "../layouts/RouteError";

export const Route = createFileRoute("/records/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(recordsQueryOptions()),
  pendingMs: 100,
  pendingMinMs: 250,
  pendingComponent: () => <LoadingState label="Loading sample records" />,
  errorComponent: RouteError,
  component: RecordsPage,
});
