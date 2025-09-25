import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface RouteTransitionWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * RouteTransitionWrapper helps handle route transitions more smoothly
 * by maintaining the previous route's content until the new route is ready
 */
export function RouteTransitionWrapper({ children, fallback }: RouteTransitionWrapperProps) {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayContent, setDisplayContent] = useState(children);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Mark as transitioning
    setIsTransitioning(true);

    // Use a small delay to allow React to start rendering the new component
    timeoutRef.current = setTimeout(() => {
      setDisplayContent(children);
      setIsTransitioning(false);
    }, 50);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [location.pathname, children]);

  // Show transition fallback if we're transitioning and no content is ready
  if (isTransitioning && !displayContent) {
    return <>{fallback}</>;
  }

  return <>{displayContent}</>;
}

/**
 * Enhanced loading component specifically for route transitions
 */
export function RouteLoadingSpinner() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Show loading content immediately, but with a smooth fade-in
    const timer = setTimeout(() => setShowContent(true), 10);
    return () => clearTimeout(timer);
  }, []);

  if (!showContent) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(24, 24, 24, 0.8)',
        zIndex: 9998,
      }} />
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      color: '#FF5555',
      zIndex: 9999,
      backgroundColor: 'rgba(24, 24, 24, 0.95)',
      backdropFilter: 'blur(20px)',
      opacity: showContent ? 1 : 0,
      transition: 'opacity 0.2s ease-in-out'
    }}>
      <img 
        src="/png/images/logo.png" 
        alt="DegenHeart Casino" 
        style={{ 
          width: '200px', 
          height: '200px', 
          marginBottom: '16px',
          animation: 'routeLoadingPulse 1.5s infinite ease-in-out'
        }} 
      />
      
      <div style={{ 
        fontSize: '16px', 
        fontWeight: '500',
        opacity: 0.9
      }}>
        Loading...
      </div>
      
      <style>{`
        @keyframes routeLoadingPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(0.98); }
        }
      `}</style>
    </div>
  );
}