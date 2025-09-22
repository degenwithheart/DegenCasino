import { useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../../themes/UnifiedThemeContext';
import { GameScrollConfigKey } from '../../themes/scrollConfig';

interface GameScrollOptions {
  enableHorizontalScroll?: boolean;
  enableSnapScrolling?: boolean;
  preventPullToRefresh?: boolean;
  enableMomentumScrolling?: boolean;
  gameType?: GameScrollConfigKey;
  smoothScrolling?: boolean;
  customScrollThreshold?: number;
}

interface ScrollMetrics {
  deltaX: number;
  deltaY: number;
  velocity: number;
  direction: 'horizontal' | 'vertical' | 'diagonal';
  isScrolling: boolean;
}

export const useGameScrollGestures = (options: GameScrollOptions = {}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollConfig, applyGameScrollConfig } = useTheme();
  const scrollMetrics = useRef<ScrollMetrics>({
    deltaX: 0,
    deltaY: 0,
    velocity: 0,
    direction: 'vertical',
    isScrolling: false,
  });
  
  const {
    enableHorizontalScroll = true,
    enableSnapScrolling = true,
    preventPullToRefresh = true,
    enableMomentumScrolling = true,
    gameType,
    smoothScrolling = true,
    customScrollThreshold = 5,
  } = options;

  // Apply game-specific scroll configuration when gameType changes
  useEffect(() => {
    if (gameType) {
      applyGameScrollConfig(gameType);
    }
  }, [gameType, applyGameScrollConfig]);

  // Enhanced wheel handling for desktop
  const handleWheel = useCallback((e: WheelEvent) => {
    const container = containerRef.current;
    if (!container) return;

    // Horizontal scroll with shift key
    if (enableHorizontalScroll && e.shiftKey) {
      e.preventDefault();
      container.scrollLeft += e.deltaY;
      return;
    }

    // Smooth scrolling enhancement
    if (smoothScrolling && Math.abs(e.deltaY) > customScrollThreshold) {
      e.preventDefault();
      const scrollAmount = e.deltaY * 0.8; // Dampen scroll for smoothness
      
      container.scrollTo({
        top: container.scrollTop + scrollAmount,
        behavior: scrollConfig.scrollBehavior,
      });
    }

    // Update scroll metrics
    scrollMetrics.current = {
      ...scrollMetrics.current,
      deltaX: e.deltaX,
      deltaY: e.deltaY,
      velocity: Math.sqrt(e.deltaX ** 2 + e.deltaY ** 2),
      direction: Math.abs(e.deltaX) > Math.abs(e.deltaY) ? 'horizontal' : 'vertical',
      isScrolling: true,
    };
  }, [enableHorizontalScroll, smoothScrolling, customScrollThreshold, scrollConfig.scrollBehavior]);

  // Touch gesture optimization for mobile casino games
  const handleTouch = useCallback(() => {
    let startY = 0;
    let startX = 0;
    let startTime = 0;
    let isScrolling = false;
    let scrollTimeout: NodeJS.Timeout | null = null;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      startY = touch.clientY;
      startX = touch.clientX;
      startTime = Date.now();
      isScrolling = false;

      // Clear any existing scroll timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!enableMomentumScrolling) return;

      const touch = e.touches[0];
      const currentY = touch.clientY;
      const currentX = touch.clientX;
      const diffY = startY - currentY;
      const diffX = startX - currentX;
      const absDiffY = Math.abs(diffY);
      const absDiffX = Math.abs(diffX);

      // Determine scroll direction and intent
      if (!isScrolling && (absDiffY > customScrollThreshold || absDiffX > customScrollThreshold)) {
        isScrolling = true;
        
        // Update scroll metrics
        scrollMetrics.current = {
          deltaX: diffX,
          deltaY: diffY,
          velocity: Math.sqrt(diffX ** 2 + diffY ** 2) / (Date.now() - startTime || 1),
          direction: absDiffX > absDiffY ? 'horizontal' : 'vertical',
          isScrolling: true,
        };

        // Prevent pull-to-refresh on game containers
        if (preventPullToRefresh) {
          const container = containerRef.current;
          if (container && container.scrollTop === 0 && diffY < 0) {
            e.preventDefault();
          }
        }

        // Handle horizontal scrolling on mobile
        if (enableHorizontalScroll && absDiffX > absDiffY) {
          e.preventDefault();
          const container = containerRef.current;
          if (container) {
            container.scrollLeft += diffX * 0.5; // Dampen for smoothness
          }
        }
      }
    };

    const handleTouchEnd = () => {
      // Reset scrolling state after a delay
      scrollTimeout = setTimeout(() => {
        scrollMetrics.current.isScrolling = false;
      }, 150);
    };

    return { handleTouchStart, handleTouchMove, handleTouchEnd };
  }, [enableMomentumScrolling, preventPullToRefresh, enableHorizontalScroll, customScrollThreshold]);

  // Keyboard navigation for accessibility
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const container = containerRef.current;
    if (!container) return;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        container.scrollTop -= 50;
        break;
      case 'ArrowDown':
        e.preventDefault();
        container.scrollTop += 50;
        break;
      case 'ArrowLeft':
        if (enableHorizontalScroll) {
          e.preventDefault();
          container.scrollLeft -= 50;
        }
        break;
      case 'ArrowRight':
        if (enableHorizontalScroll) {
          e.preventDefault();
          container.scrollLeft += 50;
        }
        break;
      case 'Home':
        e.preventDefault();
        container.scrollTo({ top: 0, behavior: scrollConfig.scrollBehavior });
        break;
      case 'End':
        e.preventDefault();
        container.scrollTo({ top: container.scrollHeight, behavior: scrollConfig.scrollBehavior });
        break;
      case 'PageUp':
        e.preventDefault();
        container.scrollTop -= container.clientHeight * 0.8;
        break;
      case 'PageDown':
        e.preventDefault();
        container.scrollTop += container.clientHeight * 0.8;
        break;
    }
  }, [enableHorizontalScroll, scrollConfig.scrollBehavior]);

  // Main effect for setting up event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const touchHandlers = handleTouch();

    // Apply scroll snap if enabled
    if (enableSnapScrolling && scrollConfig.enableSnapScrolling) {
      container.style.scrollSnapType = 'both mandatory';
      container.style.scrollSnapAlign = 'center';
    }

    // Apply momentum scrolling styles
    if (enableMomentumScrolling) {
      (container.style as any).WebkitOverflowScrolling = 'touch';
      container.style.overscrollBehavior = 'contain';
    }

    // Apply game-specific optimizations
    if (gameType) {
      container.classList.add(`game-scroll-${gameType}`);
    }

    // Event listeners
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', touchHandlers.handleTouchStart, { passive: true });
    container.addEventListener('touchmove', touchHandlers.handleTouchMove, { passive: false });
    container.addEventListener('touchend', touchHandlers.handleTouchEnd, { passive: true });
    container.addEventListener('keydown', handleKeyDown, { passive: false });

    // Focus container for keyboard navigation
    if (container.tabIndex === -1) {
      container.tabIndex = 0;
    }

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', touchHandlers.handleTouchStart);
      container.removeEventListener('touchmove', touchHandlers.handleTouchMove);
      container.removeEventListener('touchend', touchHandlers.handleTouchEnd);
      container.removeEventListener('keydown', handleKeyDown);
      
      if (gameType) {
        container.classList.remove(`game-scroll-${gameType}`);
      }
    };
  }, [
    enableHorizontalScroll, 
    enableSnapScrolling, 
    enableMomentumScrolling, 
    gameType,
    scrollConfig.enableSnapScrolling,
    handleWheel,
    handleTouch,
    handleKeyDown,
  ]);

  // Utility functions for external use
  const scrollToTop = useCallback((smooth = true) => {
    const container = containerRef.current;
    if (container) {
      container.scrollTo({
        top: 0,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  }, []);

  const scrollToBottom = useCallback((smooth = true) => {
    const container = containerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  }, []);

  const scrollToElement = useCallback((selector: string, smooth = true) => {
    const container = containerRef.current;
    if (container) {
      const element = container.querySelector(selector);
      if (element) {
        element.scrollIntoView({
          behavior: smooth ? 'smooth' : 'auto',
          block: 'nearest',
          inline: 'nearest',
        });
      }
    }
  }, []);

  const getScrollMetrics = useCallback(() => {
    return { ...scrollMetrics.current };
  }, []);

  return {
    containerRef,
    scrollToTop,
    scrollToBottom,
    scrollToElement,
    getScrollMetrics,
    isScrolling: scrollMetrics.current.isScrolling,
  };
};

// Specialized hooks for specific game types
export const useDiceScrollGestures = (options: Omit<GameScrollOptions, 'gameType'> = {}) => {
  return useGameScrollGestures({
    ...options,
    gameType: 'dice',
    enableSnapScrolling: false,
    smoothScrolling: false,
  });
};

export const useSlotsScrollGestures = (options: Omit<GameScrollOptions, 'gameType'> = {}) => {
  return useGameScrollGestures({
    ...options,
    gameType: 'slots',
    enableSnapScrolling: true,
    enableHorizontalScroll: true,
  });
};

export const usePlinkoScrollGestures = (options: Omit<GameScrollOptions, 'gameType'> = {}) => {
  return useGameScrollGestures({
    ...options,
    gameType: 'plinko',
    enableMomentumScrolling: false,
    preventPullToRefresh: true,
  });
};

export const useRouletteScrollGestures = (options: Omit<GameScrollOptions, 'gameType'> = {}) => {
  return useGameScrollGestures({
    ...options,
    gameType: 'roulette',
    enableHorizontalScroll: true,
    enableSnapScrolling: true,
  });
};

export const useCardsScrollGestures = (options: Omit<GameScrollOptions, 'gameType'> = {}) => {
  return useGameScrollGestures({
    ...options,
    gameType: 'cards',
    enableSnapScrolling: true,
    smoothScrolling: true,
  });
};