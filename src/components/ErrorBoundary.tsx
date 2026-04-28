import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center max-w-md px-4">
            <h1 className="text-2xl font-bold mb-4 text-text-primary">Something went wrong</h1>
            <p className="text-text-secondary mb-6">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <Button onClick={() => window.location.href = "/"}>
              Return to Home
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
