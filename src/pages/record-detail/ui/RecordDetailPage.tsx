import { Link } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeftIcon } from "lucide-react";
import { z } from "zod";

import {
  getGetSampleRecordQueryKey,
  getListSampleRecordsQueryKey,
  renameSampleRecord,
} from "@/shared/api";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { ErrorState } from "@/shared/ui/ErrorState";
import { Input } from "@/shared/ui/input";
import { LoadingState } from "@/shared/ui/LoadingState";

import { recordQueryOptions } from "../api/record-query";

const titleSchema = z.string().trim().min(1, "Enter a title").max(80, "Use 80 characters or fewer");

function RenameForm({ recordId, currentTitle }: { recordId: string; currentTitle: string }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (title: string) => renameSampleRecord(recordId, title),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: getListSampleRecordsQueryKey() }),
        queryClient.invalidateQueries({ queryKey: getGetSampleRecordQueryKey(recordId) }),
      ]);
    },
  });
  const form = useForm({
    defaultValues: { title: currentTitle },
    onSubmit: ({ value }) => {
      const title = titleSchema.safeParse(value.title);
      if (title.success) mutation.mutate(title.data);
    },
  });

  return (
    <form
      className="border-border mt-6 space-y-3 border-t pt-6"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <form.Field
        name="title"
        validators={{
          onChange: ({ value }) =>
            titleSchema.safeParse(value).success
              ? undefined
              : "Enter a title (up to 80 characters)",
        }}
      >
        {(field) => (
          <div>
            <label htmlFor="record-title" className="mb-2 block text-sm font-medium">
              Rename this sample
            </label>
            <Input
              id="record-title"
              name={field.name}
              value={field.state.value}
              maxLength={80}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              aria-invalid={field.state.meta.errors.length > 0}
              aria-describedby={field.state.meta.errors.length > 0 ? "rename-error" : undefined}
            />
            {field.state.meta.errors.length > 0 && (
              <p id="rename-error" className="text-destructive mt-1 text-sm">
                {field.state.meta.errors.join(", ")}
              </p>
            )}
          </div>
        )}
      </form.Field>
      <form.Subscribe selector={(state) => state.canSubmit}>
        {(canSubmit) => (
          <Button type="submit" disabled={!canSubmit || mutation.isPending}>
            {mutation.isPending ? "Saving…" : "Save name"}
          </Button>
        )}
      </form.Subscribe>
      {mutation.isError && (
        <p role="alert" className="text-destructive text-sm">
          Could not save the name. Try again.
        </p>
      )}
    </form>
  );
}

export function RecordDetailPage({ recordId }: { recordId: string }) {
  const query = useQuery(recordQueryOptions(recordId));

  return (
    <div className="max-w-3xl space-y-6 py-10 sm:py-14">
      <Button asChild variant="ghost" size="sm">
        <Link to="/records">
          <ArrowLeftIcon aria-hidden="true" /> All sample records
        </Link>
      </Button>
      {query.isPending ? (
        <LoadingState label="Loading sample record" />
      ) : query.isError ? (
        <ErrorState
          title="Could not load this record"
          description="The record may be missing, or the API response was invalid."
          onRetry={() => void query.refetch()}
        />
      ) : (
        <Card>
          <CardHeader>
            <p className="text-primary text-sm font-semibold tracking-widest uppercase">
              Sample record
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">{query.data.title}</h1>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{query.data.summary}</p>
            <p className="text-sm">
              <span className="font-medium">Status:</span>{" "}
              <span className="capitalize">{query.data.status}</span>
            </p>
            <p className="text-muted-foreground font-mono text-xs">{query.data.id}</p>
            <RenameForm recordId={recordId} currentTitle={query.data.title} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
