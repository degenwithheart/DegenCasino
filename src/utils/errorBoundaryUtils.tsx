import React, { ReactNode } from 'react';
import { FEATURE_FLAGS } from '../constants';
import { ComprehensiveErrorBoundary } from '../components/ErrorBoundaries';
import { RouterErrorBoundary } from '../components/RouterErrorBoundary';

interface ErrorBoundaryWrapperProps {
  children: ReactNode;
  level?: 'app' | 'route' | 'component';
  componentName?: string;
  fallback?: ReactNode;
}

/**
 * Utility component that renders the appropriate error boundary based on feature flags
 */
export function ErrorBoundaryWrapper({ children, level = 'component', componentName, fallback }: ErrorBoundaryWrapperProps) {
  if (FEATURE_FLAGS.USE_COMPREHENSIVE_ERROR_SYSTEM) {
    return (
      <ComprehensiveErrorBoundary 
        level={level} 
        componentName={componentName}
        fallback={fallback}
      >
        {children}
      </ComprehensiveErrorBoundary>
    );
  }

  // For old system, use RouterErrorBoundary for route-level errors, or just children for component-level
  if (level === 'route' || level === 'app') {
    return (
      <RouterErrorBoundary fallback={fallback}>
        {children}
      </RouterErrorBoundary>
    );
  }

  // For component level in old system, just return children (no additional boundary)
  return <>{children}</>;
}

/**
 * Hook to get the appropriate error boundary component based on feature flags
 */
export function useErrorBoundary() {
  return {
    ErrorBoundary: FEATURE_FLAGS.USE_COMPREHENSIVE_ERROR_SYSTEM ? ComprehensiveErrorBoundary : RouterErrorBoundary,
    isComprehensive: FEATURE_FLAGS.USE_COMPREHENSIVE_ERROR_SYSTEM
  };
}