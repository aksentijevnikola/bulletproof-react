type LoadingSpinnerProps = {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
};

const spinnerClassBySize: Record<
  NonNullable<LoadingSpinnerProps["size"]>,
  string
> = {
  sm: "h-4 w-4 animate-spin rounded-full border-2 border-border border-t-primary",
  md: "h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary",
  lg: "h-12 w-12 animate-spin rounded-full border-2 border-border border-t-primary",
};

const defaultAriaLabel = "Loading...";

const LoadingSpinner = ({
  size = "md",
  text,
  className = "",
}: LoadingSpinnerProps) => {
  const spinnerClassName = spinnerClassBySize[size];

  return (
    <div className={className}>
      <div className="flex flex-col items-center justify-center text-foreground">
        <div
          className={spinnerClassName}
          aria-label={text ?? defaultAriaLabel}
        />
        {text && (
          <span className="mt-2 text-sm text-muted-foreground">{text}</span>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;
