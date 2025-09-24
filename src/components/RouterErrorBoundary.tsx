import React, { Component, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
}

/**
 * Error boundary specifically for route changes to catch lazy loading errors
 */
class RouteErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Route Error Boundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  componentDidUpdate(prevProps: Props) {
    // Reset error state when location changes
    if (this.state.hasError && prevProps.children !== this.props.children) {
      this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '60vh',
          padding: '2rem',
          textAlign: 'center',
          color: '#ff6b7a'
        }}>
          <h2>🚨 Something went wrong</h2>
          <p>The page failed to load. Please try refreshing or navigate to a different page.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#ff6b7a',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook wrapper for the error boundary to reset on location changes
 */
export function RouterErrorBoundary({ children, fallback }: Props) {
  const location = useLocation();
  
  return (
    <RouteErrorBoundary key={location.pathname} fallback={fallback}>
      {children}
    </RouteErrorBoundary>
  );
}

export default RouterErrorBoundary;