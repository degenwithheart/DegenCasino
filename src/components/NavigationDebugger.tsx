import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * Debug component to log navigation changes and help identify routing issues
 */
export function NavigationDebugger() {
  const location = useLocation();
  const navigationType = useNavigationType();
  
  useEffect(() => {
    console.log('🔄 Navigation Debug:', {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      state: location.state,
      navigationType,
      timestamp: new Date().toISOString()
    });
    
    // Force a small DOM update to ensure React re-renders
    document.body.setAttribute('data-route', location.pathname);
    
    // Dispatch navigation event for other components to listen
    window.dispatchEvent(new CustomEvent('navigation-debug', {
      detail: {
        location,
        navigationType,
        timestamp: Date.now()
      }
    }));
  }, [location, navigationType]);
  
  return null;
}

/**
 * Component that forces page updates on navigation
 */
export function NavigationForcer() {
  const location = useLocation();
  
  useEffect(() => {
    // Force React to update by changing a data attribute
    const updateKey = `${location.pathname}-${Date.now()}`;
    document.documentElement.setAttribute('data-route-key', updateKey);
    
    // Clear any stale component states
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('force-component-update'));
    }, 10);
  }, [location.pathname, location.search]);
  
  return null;
}