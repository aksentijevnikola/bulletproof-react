import { createFileRoute, type ErrorComponentProps } from "@tanstack/react-router";

import { RecordDetailPage, recordQueryOptions } from "@/pages/record-detail";
import { LoadingState } from "@/shared/ui/LoadingState";

import { RouteError } from "../layouts/RouteError";

export const Route = createFileRoute("/records/$recordId")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(recordQueryOptions(params.recordId)),
  pendingMs: 100,
  pendingMinMs: 250,
  pendingComponent: () => <LoadingState label="Loading sample record" />,
  errorComponent: RecordError,
  component: RecordRoute,
});

function RecordRoute() {
  const { recordId } = Route.useParams();
  return <RecordDetailPage recordId={recordId} />;
}

function RecordError(props: ErrorComponentProps) {
  return <RouteError {...props} title="Sample record unavailable" />;
}
