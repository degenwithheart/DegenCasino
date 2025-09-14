import { useState, useEffect } from 'react';

export function useIsCompact() {
  const [compact, setCompact] = useState(() => window.innerWidth <= 1024);
  const [screenTooSmall, setScreenTooSmall] = useState(() => window.innerWidth <= 480);
  const [mobile, setMobile] = useState(() => window.innerWidth <= 700);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setCompact(width <= 1024);
      setScreenTooSmall(width <= 480);
      setMobile(width <= 700);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { compact, screenTooSmall, mobile };
}
