import React, { Component, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  level?: 'app' | 'route' | 'component';
  componentName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
  errorBoundary?: string;
  timestamp?: number;
}

/**
 * Comprehensive error boundary that catches ALL errors and never shows blank screens
 */
class ComprehensiveErrorBoundaryCore extends Component<Props & { pathname?: string; navigate?: any }, State> {
  private retryCount = 0;
  private maxRetries = 3;

  constructor(props: Props & { pathname?: string; navigate?: any }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    console.error('🚨 ComprehensiveErrorBoundary caught error:', error);
    return { 
      hasError: true, 
      error,
      errorBoundary: 'comprehensive',
      timestamp: Date.now()
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('🚨 ComprehensiveErrorBoundary componentDidCatch:', {
      error,
      errorInfo,
      level: this.props.level,
      componentName: this.props.componentName,
      pathname: this.props.pathname,
      retryCount: this.retryCount
    });

    this.setState({ errorInfo });

    // Log to external service if needed
    if ((window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: `${this.props.level || 'unknown'}_error: ${error.message}`,
        fatal: false
      });
    }
  }

  componentDidUpdate(prevProps: Props & { pathname?: string; navigate?: any }) {
    // Reset error state when route changes
    if (this.state.hasError && prevProps.pathname !== this.props.pathname) {
      this.setState({ hasError: false, error: undefined, errorInfo: undefined });
      this.retryCount = 0;
    }
  }

  retry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    } else {
      // Max retries reached, force navigation to home
      this.goHome();
    }
  }

  goHome = () => {
    if (this.props.navigate) {
      this.props.navigate('/');
    } else {
      window.location.href = '/';
    }
  }

  refreshPage = () => {
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      const { level = 'component', componentName } = this.props;
      const isMaxRetries = this.retryCount >= this.maxRetries;
      const isDev = import.meta.env.MODE === 'development';

      return this.props.fallback || (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: level === 'app' ? '100vh' : '400px',
          padding: '2rem',
          textAlign: 'center',
          color: '#ff6b7a',
          backgroundColor: 'rgba(24, 24, 24, 0.95)',
          borderRadius: level === 'app' ? '0' : '12px',
          margin: level === 'app' ? '0' : '1rem',
          border: level === 'app' ? 'none' : '1px solid rgba(255, 107, 122, 0.3)',
          position: level === 'app' ? 'fixed' : 'relative',
          top: level === 'app' ? '0' : 'auto',
          left: level === 'app' ? '0' : 'auto',
          width: level === 'app' ? '100vw' : 'auto',
          height: level === 'app' ? '100vh' : 'auto',
          zIndex: level === 'app' ? 9999 : 'auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <img 
              src="/png/images/logo.png" 
              alt="DegenHeart Casino" 
              style={{ width: '60px', height: '60px', marginRight: '1rem' }}
            />
            <div style={{ fontSize: level === 'app' ? '5rem' : '3rem' }}>🚨</div>
          </div>
          
          <h2 style={{ 
            marginBottom: '1rem', 
            color: '#ff6b7a', 
            fontSize: level === 'app' ? '2rem' : '1.5rem',
            fontWeight: 'bold' 
          }}>
            {level === 'app' ? 'Application Error' : 
             level === 'route' ? 'Page Loading Error' : 
             'Component Error'}
          </h2>
          
          <p style={{ 
            marginBottom: '1rem', 
            maxWidth: '500px', 
            lineHeight: '1.5', 
            color: '#fff',
            fontSize: level === 'app' ? '1.1rem' : '1rem'
          }}>
            {componentName ? `${componentName} ` : 'Something '}
            went wrong and couldn't be loaded properly.
            {isMaxRetries ? ' Multiple retry attempts failed.' : ''}
          </p>

          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            flexWrap: 'wrap', 
            justifyContent: 'center', 
            marginBottom: '1rem' 
          }}>
            {!isMaxRetries && (
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
                Try Again {this.retryCount > 0 && `(${this.retryCount}/${this.maxRetries})`}
              </button>
            )}
            
            <button 
              onClick={this.goHome}
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

            <button 
              onClick={this.refreshPage}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'transparent',
                color: '#ffd700',
                border: '1px solid #ffd700',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255, 215, 0, 0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              Refresh Page
            </button>
          </div>

          {isDev && this.state.error && (
            <details style={{ 
              marginTop: '2rem', 
              textAlign: 'left', 
              width: '100%', 
              maxWidth: '600px',
              maxHeight: '300px',
              overflow: 'auto'
            }}>
              <summary style={{ 
                cursor: 'pointer', 
                color: '#ff6b7a', 
                marginBottom: '0.5rem',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}>
                Error Details (Dev Mode)
              </summary>
              <pre style={{ 
                background: 'rgba(0, 0, 0, 0.7)', 
                padding: '1rem', 
                borderRadius: '4px', 
                overflow: 'auto',
                fontSize: '0.8rem',
                color: '#ccc',
                whiteSpace: 'pre-wrap',
                lineHeight: '1.4',
                border: '1px solid rgba(255, 107, 122, 0.2)'
              }}>
                <strong>Error:</strong> {this.state.error.message}
                {this.state.error.stack && (
                  <>
                    <br/><br/>
                    <strong>Stack:</strong><br/>
                    {this.state.error.stack}
                  </>
                )}
                {this.state.errorInfo?.componentStack && (
                  <>
                    <br/><br/>
                    <strong>Component Stack:</strong><br/>
                    {this.state.errorInfo.componentStack}
                  </>
                )}
                <br/><br/>
                <strong>Level:</strong> {level}
                <br/>
                <strong>Component:</strong> {componentName || 'Unknown'}
                <br/>
                <strong>Retry Count:</strong> {this.retryCount}/{this.maxRetries}
                <br/>
                <strong>Timestamp:</strong> {new Date(this.state.timestamp!).toISOString()}
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
 * Hook wrapper that provides router context to the error boundary
 */
export function ComprehensiveErrorBoundary({ children, ...props }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  
  return (
    <ComprehensiveErrorBoundaryCore 
      key={`comprehensive-${location.pathname}-${props.level}`}
      pathname={location.pathname}
      navigate={navigate}
      {...props}
    >
      {children}
    </ComprehensiveErrorBoundaryCore>
  );
}

export default ComprehensiveErrorBoundary;