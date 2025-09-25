import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook to handle route changes and prevent blank screens
 */
export function useRouteChangeHandler() {
  const location = useLocation();
  const previousLocation = useRef(location.pathname);
  const isChangingRoute = useRef(false);

  useEffect(() => {
    // Mark route change start
    if (previousLocation.current !== location.pathname) {
      isChangingRoute.current = true;
      
      // Add a class to body for CSS transitions
      document.body.classList.add('route-changing');
      
      // Scroll to top on route change
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        isChangingRoute.current = false;
        document.body.classList.remove('route-changing');
        previousLocation.current = location.pathname;
      }, 150);

      return () => {
        clearTimeout(timer);
        document.body.classList.remove('route-changing');
      };
    }
  }, [location.pathname]);

  return {
    isChangingRoute: isChangingRoute.current,
    currentPath: location.pathname,
    previousPath: previousLocation.current
  };
}

/**
 * Add CSS for smooth route transitions
 */
export function addRouteTransitionCSS() {
  const style = document.createElement('style');
  style.textContent = `
    /* Route transition styles */
    body.route-changing {
      pointer-events: none;
    }
    
    body.route-changing * {
      transition: opacity 0.15s ease-out;
    }
    
    /* Prevent flash of unstyled content */
    [data-lazy-component] {
      min-height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    /* Smooth loading spinner transitions */
    .route-loading-spinner {
      opacity: 0;
      animation: fadeInSpinner 0.3s ease-in-out forwards;
    }
    
    @keyframes fadeInSpinner {
      to { opacity: 1; }
    }
  `;
  
  if (!document.head.querySelector('#route-transition-styles')) {
    style.id = 'route-transition-styles';
    document.head.appendChild(style);
  }
}