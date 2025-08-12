import { useState, useEffect } from 'react';

/**
 * Returns { compact, screenTooSmall } for responsive layouts.
 * compact: true if <= 1000px (mobile/tablet)
 * screenTooSmall: true if < 400px (very small devices)
 */
export function useIsCompact() {
  const [compact, setCompact] = useState(() => window.innerWidth <= 1000);
  const [screenTooSmall, setScreenTooSmall] = useState(() => window.innerWidth < 400);

  useEffect(() => {
    const handleResize = () => {
      setCompact(window.innerWidth <= 1000);
      setScreenTooSmall(window.innerWidth < 400);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { compact, screenTooSmall };
}
