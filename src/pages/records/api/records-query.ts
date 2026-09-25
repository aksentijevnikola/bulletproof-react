import { queryOptions } from "@tanstack/react-query";

import { getListSampleRecordsQueryKey, listSampleRecords } from "@/shared/api";

export function recordsQueryOptions() {
  return queryOptions({
    queryKey: getListSampleRecordsQueryKey(),
    queryFn: ({ signal }) => listSampleRecords({ signal }),
    retry: false,
  });
}
