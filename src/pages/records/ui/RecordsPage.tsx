import {
  createColumnHelper,
  createSortedRowModel,
  rowSortingFeature,
  sortFn_text,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpDownIcon } from "lucide-react";

import type { SampleRecordOutput } from "@/shared/api";
import { Button } from "@/shared/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/shared/ui/empty";
import { ErrorState } from "@/shared/ui/ErrorState";
import { LoadingState } from "@/shared/ui/LoadingState";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";

import { recordsQueryOptions } from "../api/records-query";

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { text: sortFn_text },
});

const column = createColumnHelper<typeof features, SampleRecordOutput>();
const columns = column.columns([
  column.accessor("title", {
    header: ({ column: titleColumn }) => (
      <Button variant="ghost" size="sm" type="button" onClick={() => titleColumn.toggleSorting()}>
        Title <ArrowUpDownIcon aria-hidden="true" />
      </Button>
    ),
    cell: ({ row }) => (
      <Link
        className="text-primary font-medium underline-offset-4 hover:underline"
        to="/records/$recordId"
        params={{ recordId: row.original.id }}
      >
        {row.original.title}
      </Link>
    ),
    sortFn: "text",
  }),
  column.accessor("summary", { header: "Summary", enableSorting: false }),
  column.accessor("status", { header: "Status", enableSorting: false }),
]);

function RecordTable({ records }: { records: SampleRecordOutput[] }) {
  const table = useTable({ features, columns, data: records, getRowId: (record) => record.id });

  return (
    <div className="border-border overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((header) => (
                <TableHead key={header.id} scope="col">
                  {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getAllCells().map((cell) => (
                <TableCell key={cell.id}>
                  <table.FlexRender cell={cell} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function RecordsPage() {
  const query = useQuery(recordsQueryOptions());

  return (
    <div className="space-y-8 py-10 sm:py-14">
      <div>
        <p className="text-primary text-sm font-semibold tracking-widest uppercase">
          Disposable demo
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Sample records</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl">
          Mocked API data flows through generated requests, runtime validation, query caching, and a
          sortable table.
        </p>
      </div>
      <section aria-label="Record list">
        {query.isPending ? (
          <LoadingState label="Loading sample records" />
        ) : query.isError ? (
          <ErrorState
            title="Could not load sample records"
            description="The API response failed or was invalid."
            onRetry={() => void query.refetch()}
          />
        ) : query.data.items.length === 0 ? (
          <Empty className="border-border border">
            <EmptyHeader>
              <EmptyTitle>No sample records</EmptyTitle>
              <EmptyDescription>
                Switch to the success mock scenario to explore the examples.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <RecordTable records={query.data.items} />
        )}
      </section>
    </div>
  );
}
