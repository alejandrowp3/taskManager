import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div 
          className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
          role="alert"
          aria-live="polite"
        >
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 text-center">
            <AlertTriangle 
              className="mx-auto text-red-500 mb-4" 
              size={48}
              aria-hidden="true"
            />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">
              An unexpected error occurred. Please try again.
            </p>
            {this.state.error && (
              <details className="text-left mb-6 p-3 bg-gray-50 rounded text-sm">
                <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                  Error details
                </summary>
                <code className="text-red-600 block break-all">
                  {this.state.error.message}
                </code>
              </details>
            )}
            <button
              onClick={this.handleRetry}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-describedby="retry-description"
            >
              <RefreshCw size={16} />
              Try again
            </button>
            <p id="retry-description" className="sr-only">
              Click to retry loading the application
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}