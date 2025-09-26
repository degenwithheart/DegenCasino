import React from 'react';
import { ErrorModal } from './components';

type GlobalErrorBoundaryState = { error: Error | null; retryCount: number };
type GlobalErrorBoundaryProps = { children: React.ReactNode };

export class GlobalErrorBoundary extends React.Component<GlobalErrorBoundaryProps, GlobalErrorBoundaryState> {
  private maxRetries = 2;

  constructor(props: GlobalErrorBoundaryProps) {
    super(props);
    this.state = { error: null, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('🚨 GlobalErrorBoundary caught error:', error);
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 GlobalErrorBoundary componentDidCatch:', { error, errorInfo });
    
    // Log to external service if needed
    if ((window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: `global_error: ${error.message}`,
        fatal: true
      });
    }
  }

  retry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prevState => ({ 
        error: null, 
        retryCount: prevState.retryCount + 1 
      }));
    } else {
      // Max retries reached, reload page
      window.location.reload();
    }
  }

  render() {
    if (this.state.error) {
      const isMaxRetries = this.state.retryCount >= this.maxRetries;
      
      return (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(24, 24, 24, 0.98)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <ErrorModal
            open={true}
            onClose={isMaxRetries ? () => window.location.reload() : this.retry}
            error={this.state.error!}
            title={isMaxRetries ? 'Critical Application Error' : 'Application Error'}
          />
        </div>
      );
    }
    return this.props.children;
  }
}
