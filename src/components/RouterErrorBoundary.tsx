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
  previousChildren?: ReactNode;
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
    // Reset error state when location changes or children change
    if (this.state.hasError && (prevProps.children !== this.props.children)) {
      this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    }
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    // Reset error state when children change (route change)
    if (prevState.hasError && nextProps.children !== prevState.previousChildren) {
      return {
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        previousChildren: nextProps.children
      };
    }
    return { ...prevState, previousChildren: nextProps.children };
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
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
          color: '#ff6b7a',
          backgroundColor: 'rgba(24, 24, 24, 0.95)',
          borderRadius: '12px',
          margin: '2rem',
          border: '1px solid rgba(255, 107, 122, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <img 
              src="/png/images/logo.png" 
              alt="DegenHeart Casino" 
              style={{ width: '60px', height: '60px', marginRight: '1rem' }}
            />
            <div style={{ fontSize: '4rem' }}>🚨</div>
          </div>
          <h2 style={{ marginBottom: '1rem', color: '#ff6b7a' }}>Route Loading Failed</h2>
          <p style={{ marginBottom: '1.5rem', maxWidth: '400px', lineHeight: '1.5' }}>
            The page failed to load properly. This might be due to a temporary issue.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button 
              onClick={this.retry}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#ff6b7a',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#ff5566';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#ff6b7a';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Try Again
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'transparent',
                color: '#ff6b7a',
                border: '1px solid #ff6b7a',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255, 107, 122, 0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              Go Home
            </button>
          </div>
          {import.meta.env.MODE === 'development' && this.state.error && (
            <details style={{ marginTop: '2rem', textAlign: 'left', width: '100%', maxWidth: '500px' }}>
              <summary style={{ cursor: 'pointer', color: '#ff6b7a', marginBottom: '0.5rem' }}>
                Error Details (Dev Mode)
              </summary>
              <pre style={{ 
                background: 'rgba(0, 0, 0, 0.5)', 
                padding: '1rem', 
                borderRadius: '4px', 
                overflow: 'auto',
                fontSize: '0.8rem',
                color: '#ccc'
              }}>
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
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