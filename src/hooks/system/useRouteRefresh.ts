import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook to force component re-rendering on route changes
 * This helps solve issues where page content doesn't update properly during navigation
 */
export function useRouteRefresh() {
  const location = useLocation();
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    // Force re-render on route change
    setRenderKey(prev => prev + 1);
    
    // Clear any cached states that might prevent proper rendering
    setTimeout(() => {
      // Dispatch custom event for components that need to refresh
      window.dispatchEvent(new CustomEvent('route-refresh', { 
        detail: { 
          pathname: location.pathname,
          renderKey: renderKey + 1
        } 
      }));
    }, 50);
  }, [location.pathname, location.search, location.hash]);

  return renderKey;
}

/**
 * Hook for components that need to listen to route refresh events
 */
export function useRouteRefreshListener(callback?: () => void) {
  useEffect(() => {
    const handleRouteRefresh = () => {
      callback?.();
    };

    window.addEventListener('route-refresh', handleRouteRefresh);
    return () => window.removeEventListener('route-refresh', handleRouteRefresh);
  }, [callback]);
}