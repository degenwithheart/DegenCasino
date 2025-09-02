import React from 'react';
import { ErrorModal } from './components';

type GlobalErrorBoundaryState = { error: Error | null };
type GlobalErrorBoundaryProps = { children: React.ReactNode };

export class GlobalErrorBoundary extends React.Component<GlobalErrorBoundaryProps, GlobalErrorBoundaryState> {
  constructor(props: GlobalErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can log error info here if needed
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorModal
          open={true}
          onClose={() => this.setState({ error: null })}
          error={this.state.error!}
        />
      );
    }
    return this.props.children;
  }
}
