import { Button } from "@/shared/ui/button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  description,
  onRetry,
}: ErrorStateProps) {
  return (
    <section role="alert" className="border-border my-10 rounded-xl border p-8 text-center">
      <h2 className="text-xl font-semibold">{title}</h2>
      {description && <p className="text-muted-foreground mt-2">{description}</p>}
      {onRetry && (
        <Button className="mt-5" onClick={onRetry} type="button">
          Try again
        </Button>
      )}
    </section>
  );
}
