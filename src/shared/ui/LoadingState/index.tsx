import { Skeleton } from "@/shared/ui/skeleton";

export function LoadingState({ label = "Loading content" }: { label?: string }) {
  return (
    <output aria-label={label} className="block space-y-3 py-8">
      <Skeleton className="h-7 w-48" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <span className="sr-only">{label}</span>
    </output>
  );
}
