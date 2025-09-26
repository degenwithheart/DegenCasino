import React, { useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoadingTimeoutProps {
  children: ReactNode;
  timeout?: number; // milliseconds before showing fallback
  slowTimeout?: number; // milliseconds before showing "slow loading" message
  maxTimeout?: number; // milliseconds before forcing action buttons
  fallbackComponent?: ReactNode;
  componentName?: string;
}

/**
 * Wraps components and shows fallback UI if loading takes too long
 * Prevents blank screens by always showing something actionable
 */
export function LoadingTimeout({ 
  children, 
  timeout = 3000, // 3 seconds
  slowTimeout = 8000, // 8 seconds
  maxTimeout = 15000, // 15 seconds
  fallbackComponent,
  componentName = 'Component'
}: LoadingTimeoutProps) {
  const [showFallback, setShowFallback] = useState(false);
  const [showSlowMessage, setShowSlowMessage] = useState(false);
  const [showActionButtons, setShowActionButtons] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Reset all states
    setShowFallback(false);
    setShowSlowMessage(false);
    setShowActionButtons(false);
    setIsLoaded(false);

    const timeoutTimer = setTimeout(() => {
      if (!isLoaded) {
        setShowFallback(true);
      }
    }, timeout);

    const slowTimer = setTimeout(() => {
      if (!isLoaded) {
        setShowSlowMessage(true);
      }
    }, slowTimeout);

    const maxTimer = setTimeout(() => {
      if (!isLoaded) {
        setShowActionButtons(true);
      }
    }, maxTimeout);

    return () => {
      clearTimeout(timeoutTimer);
      clearTimeout(slowTimer);
      clearTimeout(maxTimer);
    };
  }, [timeout, slowTimeout, maxTimeout, isLoaded]);

  // Use a ref to detect when children actually render
  const childRef = React.useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (childRef.current && childRef.current.children.length > 0) {
      setIsLoaded(true);
    }
  });

    const LoadingFallback = fallbackComponent || (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        padding: '2rem',
        textAlign: 'center',
        color: '#FF5555',
        backgroundColor: 'rgba(24, 24, 24, 0.95)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 107, 122, 0.3)',
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
        <img 
          src="/png/images/logo.png" 
          alt="DegenHeart Casino" 
          style={{ 
            width: '120px', 
            height: '120px', 
            animation: 'loadingPulse 2s infinite ease-in-out'
          }}
        />
      </div>
      
      <h3 style={{ marginBottom: '1rem', color: '#FF5555', fontSize: '1.5rem' }}>
        Loading {componentName}...
      </h3>
      
      {showSlowMessage && (
        <p style={{ 
          marginBottom: '1rem', 
          color: '#ffd700', 
          fontSize: '1rem',
          maxWidth: '400px',
          lineHeight: '1.5'
        }}>
          This is taking longer than expected. Please wait a moment or try refreshing.
        </p>
      )}

      {showActionButtons && (
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          flexWrap: 'wrap', 
          justifyContent: 'center', 
          marginTop: '1rem' 
        }}>
          <button 
            onClick={() => window.location.reload()}
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
            Refresh Page
          </button>
          
          <button 
            onClick={() => navigate('/')}
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
      )}

      <style>{`
        @keyframes loadingPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.95); }
        }
      `}</style>
    </div>
  );

  return (
    <div ref={childRef} style={{ minHeight: '100px', position: 'relative' }}>
      {showFallback && !isLoaded && LoadingFallback}
      <div style={{ opacity: showFallback && !isLoaded ? 0 : 1, transition: 'opacity 0.3s ease' }}>
        {children}
      </div>
    </div>
  );
}

export default LoadingTimeout;