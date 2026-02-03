import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";
import { ENV } from "@shared/config/environment";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
};

class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });
  }

  private readonly handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private readonly handleReload = () => {
    globalThis.location.reload();
  };

  private readonly handleGoHome = () => {
    globalThis.location.href = "/";
  };

  public override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen min-w-screen flex-col justify-center bg-background py-12 text-foreground sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="rounded-lg border border-border bg-card px-4 py-8 shadow sm:px-10">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-danger-subtle">
                  <svg
                    className="h-6 w-6 text-danger"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>

                <h3 className="mt-4 text-lg font-medium text-foreground">
                  Something went wrong
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  We encountered an unexpected error. Please try again or
                  contact support if the problem persists.
                </p>

                {ENV.IS_DEV && this.state.error && (
                  <details className="mt-4 text-left">
                    <summary className="cursor-pointer text-sm font-medium text-foreground">
                      Error Details (Development Only)
                    </summary>
                    <div className="mt-2 overflow-auto rounded-md border border-border bg-muted p-3 text-xs font-mono text-danger">
                      <div className="font-semibold">Error:</div>
                      <div className="mb-2">{this.state.error.toString()}</div>
                      {this.state.errorInfo && (
                        <>
                          <div className="font-semibold">Stack Trace:</div>
                          <pre className="whitespace-pre-wrap">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </>
                      )}
                    </div>
                  </details>
                )}

                <div className="mt-6 flex flex-col space-y-3">
                  <button
                    onClick={this.handleRetry}
                    className="flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                  >
                    Try Again
                  </button>

                  <div className="flex space-x-3">
                    <button
                      onClick={this.handleReload}
                      className="flex-1 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                    >
                      Reload Page
                    </button>

                    <button
                      onClick={this.handleGoHome}
                      className="flex-1 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                    >
                      Go Home
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
