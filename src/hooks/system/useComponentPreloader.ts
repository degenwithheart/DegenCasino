import { useEffect, useRef } from 'react';

// Preloader for lazy-loaded React components
export function useComponentPreloader() {
  const preloadedComponents = useRef(new Set<string>());

  useEffect(() => {
    // Preload critical components after initial render
    const preloadCriticalComponents = async () => {
      const componentsToPreload = [
        // Pages that users commonly visit
        () => import('../../sections/Dashboard/AboutMe/AboutMe'),
        () => import('../../sections/Dashboard/Terms/Terms'),
        () => import('../../sections/Game/Game'),
        () => import('../../pages/features/JackpotPage'),
        () => import('../../pages/features/LeaderboardPage'),
        () => import('../../sections/DGHRTToken/DGHRTToken'),
      ];

      // Preload with delay to not block initial render
      for (let i = 0; i < componentsToPreload.length; i++) {
        setTimeout(async () => {
          try {
            await componentsToPreload[i]();
            preloadedComponents.current.add(`component-${i}`);
          } catch (error) {
            console.warn(`Failed to preload component ${i}:`, error);
          }
        }, i * 200); // Stagger preloading
      }
    };

    // Start preloading after a short delay
    const timeoutId = setTimeout(preloadCriticalComponents, 1000);
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Preload specific component on demand
  const preloadComponent = async (importFn: () => Promise<any>, key: string) => {
    if (preloadedComponents.current.has(key)) {
      return; // Already preloaded
    }
    
    try {
      await importFn();
      preloadedComponents.current.add(key);
    } catch (error) {
      console.warn(`Failed to preload component ${key}:`, error);
    }
  };

  return { preloadComponent };
}

// Hook to preload component on hover or focus
export function useHoverPreload(importFn: () => Promise<any>, key: string) {
  const { preloadComponent } = useComponentPreloader();
  
  const handlePreload = () => {
    preloadComponent(importFn, key);
  };

  return {
    onMouseEnter: handlePreload,
    onFocus: handlePreload,
  };
}