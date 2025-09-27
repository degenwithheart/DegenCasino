import React, { Suspense, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import ComprehensiveErrorBoundary from './ComprehensiveErrorBoundary';
import { ErrorBoundaryWrapper } from '../../utils/errorBoundaryUtils';
import LoadingTimeout from './LoadingTimeout';

interface SafeSuspenseProps {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
  timeout?: number;
  level?: 'app' | 'route' | 'component';
}

// Import the LoadingSpinner from App.tsx to use the same branded experience
const DefaultSuspenseFallback = ({ componentName }: { componentName?: string }) => {
  // Use a simpler fallback that matches your app's LoadingSpinner style
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '300px',
      color: '#FF5555',
      backgroundColor: 'rgba(24, 24, 24, 0.95)',
      borderRadius: '12px',
      border: '1px solid rgba(255, 107, 122, 0.3)',
      position: 'relative'
    }}>
      {/* Logo matching your LoadingSpinner */}
      <img 
        src="/png/images/logo.png" 
        alt="DegenHeart Casino" 
        style={{ 
          width: '120px', 
          height: '120px', 
          marginBottom: '16px',
          animation: 'loadingPulse 2s infinite'
        }} 
      />
      
      <div style={{ fontSize: '16px', fontWeight: '500' }}>
        Loading {componentName || 'component'}...
      </div>
      
      <style>{`
        @keyframes loadingPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.95); }
        }
      `}</style>
    </div>
  );
};

/**
 * Enhanced Suspense wrapper that:
 * 1. Never shows blank screens
 * 2. Provides error boundaries
 * 3. Has loading timeouts
 * 4. Always gives users actionable options
 */
export function SafeSuspense({ 
  children, 
  fallback, 
  componentName = 'Component',
  timeout = 5000,
  level = 'component'
}: SafeSuspenseProps) {
  const suspenseFallback = fallback || <DefaultSuspenseFallback componentName={componentName} />;

  return (
    <ErrorBoundaryWrapper level={level} componentName={componentName}>
      <LoadingTimeout 
        timeout={timeout} 
        componentName={componentName}
        fallbackComponent={suspenseFallback}
      >
        <Suspense fallback={suspenseFallback}>
          {children}
        </Suspense>
      </LoadingTimeout>
    </ErrorBoundaryWrapper>
  );
}

export default SafeSuspense;