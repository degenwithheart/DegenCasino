import React, { Component, ReactNode, Suspense } from 'react';

interface LazyWrapperState {
  hasError: boolean;
  error?: Error;
}

interface LazyWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

/**
 * Wrapper for lazy components that provides error boundaries and retry logic
 */
class LazyComponentBoundary extends Component<LazyWrapperProps, LazyWrapperState> {
  constructor(props: LazyWrapperProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): LazyWrapperState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error(`Lazy component (${this.props.componentName}) failed to load:`, error, errorInfo);
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          margin: '2rem',
          backgroundColor: 'rgba(24, 24, 24, 0.95)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 107, 122, 0.3)',
          color: '#ff6b7a',
          textAlign: 'center',
          minHeight: '300px'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h3 style={{ marginBottom: '0.5rem', color: '#ff6b7a' }}>
            Component Failed to Load
          </h3>
          <p style={{ marginBottom: '1.5rem', opacity: 0.8 }}>
            {this.props.componentName ? `${this.props.componentName} ` : 'This component '}
            couldn't be loaded. Please try again.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
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
                fontWeight: '500'
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
                fontWeight: '500'
              }}
            >
              Go Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Enhanced lazy component wrapper with error boundary and suspense
 */
export function LazyComponentWrapper({ 
  children, 
  fallback, 
  componentName 
}: LazyWrapperProps) {
  return (
    <LazyComponentBoundary componentName={componentName}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </LazyComponentBoundary>
  );
}