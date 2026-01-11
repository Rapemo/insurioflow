import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 p-4">
          <div className="w-full max-w-md">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-red-900 mb-2">Something went wrong</h1>
                <p className="text-red-700">
                  We're sorry, but something unexpected happened. Please try refreshing the page.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={this.handleReload}
                  className="w-full flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Refresh Page
                </button>
                
                <button
                  onClick={() => window.location.href = '/client/login'}
                  className="w-full px-6 py-3 border border-red-300 text-red-700 rounded-lg font-medium hover:bg-red-50 transition-colors"
                >
                  Go to Login
                </button>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm text-red-600 hover:text-red-800">
                    Error Details (Development Only)
                  </summary>
                  <div className="mt-2 p-4 bg-red-50 rounded-lg text-xs text-red-800 overflow-auto">
                    <p className="font-mono whitespace-pre-wrap">
                      {this.state.error.toString()}
                    </p>
                    {this.state.errorInfo && (
                      <p className="font-mono whitespace-pre-wrap mt-2">
                        {this.state.errorInfo.componentStack}
                      </p>
                    )}
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
