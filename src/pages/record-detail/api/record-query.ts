import { queryOptions } from "@tanstack/react-query";

import { getGetSampleRecordQueryKey, getSampleRecord } from "@/shared/api";

export function recordQueryOptions(recordId: string) {
  return queryOptions({
    queryKey: getGetSampleRecordQueryKey(recordId),
    queryFn: ({ signal }) => getSampleRecord(recordId, { signal }),
    retry: false,
  });
}
