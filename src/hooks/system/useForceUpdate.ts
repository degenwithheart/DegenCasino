import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook that forces component re-render when navigation occurs
 * Use this in components that aren't updating properly on route changes
 */
export function useForceUpdate() {
  const [, setCounter] = useState(0);
  const location = useLocation();
  
  const forceUpdate = () => setCounter(c => c + 1);
  
  useEffect(() => {
    // Force update on route change
    forceUpdate();
  }, [location.pathname, location.search]);
  
  useEffect(() => {
    // Listen for manual force update events
    const handleForceUpdate = () => forceUpdate();
    window.addEventListener('force-component-update', handleForceUpdate);
    
    return () => {
      window.removeEventListener('force-component-update', handleForceUpdate);
    };
  }, []);
  
  return forceUpdate;
}

/**
 * Hook that provides a unique key that changes on navigation
 * Use this as a key prop to force component remounting
 */
export function useNavigationKey() {
  const location = useLocation();
  return `${location.pathname}${location.search}${location.hash}`;
}

/**
 * Higher-order component that wraps components to force updates on navigation
 */
export function withNavigationRefresh<P extends object>(Component: React.ComponentType<P>) {
  return function NavigationRefreshWrapper(props: P) {
    const key = useNavigationKey();
    return React.createElement(Component, { key, ...props } as P & { key: string });
  };
}