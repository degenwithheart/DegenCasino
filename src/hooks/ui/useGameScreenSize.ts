import { useState, useEffect, useCallback } from 'react'

export interface GameScreenDimensions {
  width: number
  height: number
  scale: number
  aspectRatio: number
  isPortrait: boolean
  isLandscape: boolean
  breakpoint: 'mobile' | 'tablet' | 'desktop' | 'large'
}

interface UseGameScreenSizeOptions {
  /**
   * Minimum height to maintain for the game screen
   * @default 280
   */
  minHeight?: number
  
  /**
   * Maximum height constraint (prevents games from being too tall)
   * @default 900
   */
  maxHeight?: number
  
  /**
   * Reserve space for controls at bottom (in px)
   * @default 120
   */
  controlsReservedSpace?: number
  
  /**
   * Reserve space for header/UI at top (in px)
   * @default 60
   */
  headerReservedSpace?: number
  
  /**
   * Enable aggressive space utilization (uses more screen real estate)
   * @default true
   */
  aggressiveScaling?: boolean
  
  /**
   * Preferred aspect ratio for the game (width/height)
   * If provided, will try to maintain this ratio when possible
   */
  preferredAspectRatio?: number
}

/**
 * Hook that provides optimal screen dimensions for games to utilize all available space
 * in the portal target="screen" area while maintaining responsive design principles.
 */
export function useGameScreenSize(options: UseGameScreenSizeOptions = {}): GameScreenDimensions {
  const {
    minHeight = 280,
    maxHeight = 900,
    controlsReservedSpace = 120,
    headerReservedSpace = 60,
    aggressiveScaling = true,
    preferredAspectRatio
  } = options

  const [dimensions, setDimensions] = useState<GameScreenDimensions>(() => 
    calculateDimensions(window.innerWidth, window.innerHeight)
  )

  function calculateDimensions(windowWidth: number, windowHeight: number): GameScreenDimensions {
    // Determine breakpoint
    let breakpoint: GameScreenDimensions['breakpoint'] = 'mobile'
    if (windowWidth >= 1440) breakpoint = 'large'
    else if (windowWidth >= 1024) breakpoint = 'desktop'
    else if (windowWidth >= 768) breakpoint = 'tablet'

    // Calculate available space
    const totalReservedSpace = controlsReservedSpace + headerReservedSpace
    let availableHeight = windowHeight - totalReservedSpace
    
    // Apply dynamic viewport height for mobile browsers
    if (breakpoint === 'mobile' && 'visualViewport' in window) {
      availableHeight = (window.visualViewport?.height || windowHeight) - totalReservedSpace
    }
    
    // Responsive reserved space adjustments
    const responsiveControlsSpace = breakpoint === 'mobile' 
      ? Math.max(80, controlsReservedSpace * 0.8)
      : controlsReservedSpace
    
    const responsiveHeaderSpace = breakpoint === 'mobile'
      ? Math.max(40, headerReservedSpace * 0.7)
      : headerReservedSpace
    
    availableHeight = windowHeight - responsiveControlsSpace - responsiveHeaderSpace

    // Calculate width with responsive margins
    let availableWidth = windowWidth
    if (breakpoint === 'mobile') {
      availableWidth = Math.max(280, windowWidth - 32) // 16px margins
    } else if (breakpoint === 'tablet') {
      availableWidth = Math.max(400, windowWidth - 64) // 32px margins
    } else if (breakpoint === 'desktop') {
      availableWidth = Math.max(600, windowWidth - 120) // 60px margins
    } else { // large
      availableWidth = Math.max(800, Math.min(windowWidth - 200, 1400)) // Max container with margins
    }

    // Apply height constraints
    let finalHeight = aggressiveScaling 
      ? Math.max(minHeight, Math.min(availableHeight, maxHeight))
      : Math.max(minHeight, Math.min(availableHeight * 0.85, maxHeight))

    let finalWidth = availableWidth

    // Apply preferred aspect ratio if specified
    if (preferredAspectRatio) {
      const heightBasedWidth = finalHeight * preferredAspectRatio
      const widthBasedHeight = finalWidth / preferredAspectRatio
      
      if (heightBasedWidth <= availableWidth) {
        finalWidth = heightBasedWidth
      } else if (widthBasedHeight <= availableHeight && widthBasedHeight >= minHeight) {
        finalHeight = widthBasedHeight
      }
    }

    // Calculate scale factor for games to adapt their content
    const baseScale = breakpoint === 'mobile' ? 0.8 : breakpoint === 'tablet' ? 0.9 : 1.0
    const sizeScale = Math.min(finalWidth / 600, finalHeight / 400) // Base reference size
    const scale = baseScale * Math.max(0.6, Math.min(sizeScale, 2.0))

    const aspectRatio = finalWidth / finalHeight
    const isPortrait = aspectRatio < 1
    const isLandscape = aspectRatio > 1.2

    return {
      width: Math.round(finalWidth),
      height: Math.round(finalHeight),
      scale: Math.round(scale * 100) / 100, // Round to 2 decimals
      aspectRatio: Math.round(aspectRatio * 100) / 100,
      isPortrait,
      isLandscape,
      breakpoint
    }
  }

  const updateDimensions = useCallback(() => {
    const newDimensions = calculateDimensions(window.innerWidth, window.innerHeight)
    setDimensions(prev => {
      // Only update if there's a meaningful change to avoid unnecessary re-renders
      const hasChanged = 
        Math.abs(prev.width - newDimensions.width) > 10 ||
        Math.abs(prev.height - newDimensions.height) > 10 ||
        prev.breakpoint !== newDimensions.breakpoint
      
      return hasChanged ? newDimensions : prev
    })
  }, [minHeight, maxHeight, controlsReservedSpace, headerReservedSpace, aggressiveScaling, preferredAspectRatio])

  useEffect(() => {
    updateDimensions()
    
    let timeoutId: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(updateDimensions, 100) // Debounce for performance
    }

    window.addEventListener('resize', handleResize)
    
    // Listen to visual viewport changes for mobile browsers
    if ('visualViewport' in window && window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize)
    }
    
    // Listen to orientation changes
    window.addEventListener('orientationchange', () => {
      setTimeout(updateDimensions, 200) // Delay for orientation change completion
    })
    
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', handleResize)
      if ('visualViewport' in window && window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize)
      }
      window.removeEventListener('orientationchange', updateDimensions)
    }
  }, [updateDimensions])

  return dimensions
}

/**
 * Utility function to get responsive scale factors for different game elements
 */
export function getGameElementScale(
  dimensions: GameScreenDimensions,
  element: 'text' | 'ui' | 'canvas' | 'spacing'
): number {
  const { scale, breakpoint } = dimensions
  
  const multipliers = {
    text: breakpoint === 'mobile' ? 0.85 : breakpoint === 'tablet' ? 0.92 : 1.0,
    ui: breakpoint === 'mobile' ? 0.8 : breakpoint === 'tablet' ? 0.9 : 1.0,
    canvas: scale, // Use the main scale for canvas/3D elements
    spacing: breakpoint === 'mobile' ? 0.7 : breakpoint === 'tablet' ? 0.85 : 1.0
  }
  
  return multipliers[element] * scale
}

/**
 * Utility function for CSS custom properties based on game screen dimensions
 */
export function getGameScreenCSSVars(dimensions: GameScreenDimensions): Record<string, string> {
  return {
    '--game-screen-width': `${dimensions.width}px`,
    '--game-screen-height': `${dimensions.height}px`,
    '--game-screen-scale': dimensions.scale.toString(),
    '--game-screen-aspect': dimensions.aspectRatio.toString(),
    '--game-text-scale': getGameElementScale(dimensions, 'text').toString(),
    '--game-ui-scale': getGameElementScale(dimensions, 'ui').toString(),
    '--game-spacing-scale': getGameElementScale(dimensions, 'spacing').toString(),
  }
}
