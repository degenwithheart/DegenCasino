/**
 * Migration utilities to help convert existing games to use the new scaling system
 */

import { useEffect, useRef } from 'react'
import { useGameScaling } from '../../contexts/GameScalingContext'

/**
 * Drop-in replacement for ResizeObserver-based container sizing
 * Use this to quickly migrate games that currently use ResizeObserver
 */
export function useGameContainerSize() {
  const { width, height, scale } = useGameScaling()
  
  return {
    width,
    height,
    scale,
    // Maintain compatibility with existing code that expects containerSize object
    containerSize: { width, height }
  }
}

/**
 * Provides responsive breakpoint helpers similar to existing useIsCompact
 */
export function useGameBreakpoints() {
  const { breakpoint, width, height } = useGameScaling()
  
  return {
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet', 
    isDesktop: breakpoint === 'desktop' || breakpoint === 'large',
    isLarge: breakpoint === 'large',
    compact: breakpoint === 'mobile' || breakpoint === 'tablet',
    screenTooSmall: width <= 480,
    mobile: width <= 700,
    // Legacy compatibility
    breakpoint
  }
}

/**
 * Canvas setup utility that handles high-DPI and responsive sizing
 * Drop-in replacement for manual canvas sizing logic
 */
export function useResponsiveCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  options: {
    /**
     * Callback for drawing on the canvas
     */
    draw?: (ctx: CanvasRenderingContext2D, size: { width: number; height: number; scale: number }) => void
    /**
     * Custom scale multiplier
     */
    scaleMultiplier?: number
    /**
     * Whether to clear canvas before each draw
     */
    clearCanvas?: boolean
  } = {}
) {
  const { width, height, scale } = useGameScaling()
  const { draw, scaleMultiplier = 1, clearCanvas = true } = options
  
  const setupCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const pixelRatio = window.devicePixelRatio || 1
    const scaledWidth = width * scaleMultiplier
    const scaledHeight = height * scaleMultiplier
    
    // Set actual canvas size (for high-DPI)
    canvas.width = scaledWidth * pixelRatio
    canvas.height = scaledHeight * pixelRatio
    
    // Set display size (CSS)
    canvas.style.width = `${scaledWidth}px`
    canvas.style.height = `${scaledHeight}px`
    
    // Scale context for high-DPI
    ctx.scale(pixelRatio, pixelRatio)
    
    if (clearCanvas) {
      ctx.clearRect(0, 0, scaledWidth, scaledHeight)
    }
    
    if (draw) {
      draw(ctx, { width: scaledWidth, height: scaledHeight, scale: scale * scaleMultiplier })
    }
  }
  
  useEffect(setupCanvas, [width, height, scale, scaleMultiplier, draw, clearCanvas])
  
  return {
    width: width * scaleMultiplier,
    height: height * scaleMultiplier,
    scale: scale * scaleMultiplier,
    setupCanvas
  }
}

/**
 * Three.js camera configuration that automatically adapts to screen size
 * Use for React Three Fiber games
 */
export function useResponsiveThreeCamera(options: {
  /**
   * Base zoom level
   */
  baseZoom?: number
  /**
   * Base field of view
   */
  baseFov?: number
  /**
   * Camera position
   */
  position?: [number, number, number]
  /**
   * Whether to adapt zoom to screen size
   */
  adaptZoom?: boolean
  /**
   * Whether to adapt FOV to screen size
   */
  adaptFov?: boolean
} = {}) {
  const { scale, aspectRatio } = useGameScaling()
  const {
    baseZoom = 100,
    baseFov = 45,
    position = [0, 0, 10],
    adaptZoom = true,
    adaptFov = false
  } = options
  
  const zoom = adaptZoom ? baseZoom * scale : baseZoom
  const fov = adaptFov ? baseFov / scale : baseFov
  
  return {
    zoom: Math.max(50, Math.min(zoom, 200)), // Reasonable bounds
    fov: Math.max(30, Math.min(fov, 90)), // Reasonable bounds
    position,
    aspect: aspectRatio
  }
}

/**
 * Get responsive font sizes based on screen size and element type
 */
export function useResponsiveFontSizes() {
  const { breakpoint, scale } = useGameScaling()
  
  const getSizeForElement = (element: 'title' | 'subtitle' | 'body' | 'caption' | 'button') => {
    const baseSizes = {
      title: breakpoint === 'mobile' ? 24 : breakpoint === 'tablet' ? 28 : 32,
      subtitle: breakpoint === 'mobile' ? 18 : breakpoint === 'tablet' ? 20 : 24,
      body: breakpoint === 'mobile' ? 14 : breakpoint === 'tablet' ? 15 : 16,
      caption: breakpoint === 'mobile' ? 12 : breakpoint === 'tablet' ? 13 : 14,
      button: breakpoint === 'mobile' ? 14 : breakpoint === 'tablet' ? 15 : 16
    }
    
    return Math.round(baseSizes[element] * scale)
  }
  
  return {
    title: getSizeForElement('title'),
    subtitle: getSizeForElement('subtitle'),
    body: getSizeForElement('body'),
    caption: getSizeForElement('caption'),
    button: getSizeForElement('button'),
    getSizeForElement
  }
}

/**
 * Get responsive spacing values
 */
export function useResponsiveSpacing() {
  const { breakpoint, scale } = useGameScaling()
  
  const baseSpacing = {
    xs: breakpoint === 'mobile' ? 4 : 6,
    sm: breakpoint === 'mobile' ? 8 : 12,
    md: breakpoint === 'mobile' ? 16 : 20,
    lg: breakpoint === 'mobile' ? 24 : 32,
    xl: breakpoint === 'mobile' ? 32 : 48
  }
  
  return {
    xs: Math.round(baseSpacing.xs * scale),
    sm: Math.round(baseSpacing.sm * scale),
    md: Math.round(baseSpacing.md * scale),
    lg: Math.round(baseSpacing.lg * scale),
    xl: Math.round(baseSpacing.xl * scale),
    // CSS custom property versions
    xsCss: `calc(var(--game-spacing-scale, 1) * ${baseSpacing.xs}px)`,
    smCss: `calc(var(--game-spacing-scale, 1) * ${baseSpacing.sm}px)`,
    mdCss: `calc(var(--game-spacing-scale, 1) * ${baseSpacing.md}px)`,
    lgCss: `calc(var(--game-spacing-scale, 1) * ${baseSpacing.lg}px)`,
    xlCss: `calc(var(--game-spacing-scale, 1) * ${baseSpacing.xl}px)`
  }
}

/**
 * Migration helper - provides all commonly needed responsive values
 * Use this as a one-stop replacement for existing responsive logic
 */
export function useGameResponsive() {
  const scaling = useGameScaling()
  const breakpoints = useGameBreakpoints()
  const containerSize = useGameContainerSize()
  const fontSizes = useResponsiveFontSizes()
  const spacing = useResponsiveSpacing()
  
  return {
    ...scaling,
    ...breakpoints,
    ...containerSize,
    fontSizes,
    spacing,
    // Utility functions
    css: scaling.cssVars,
    getElementScale: scaling.getElementScale
  }
}

// Export individual utilities for specific use cases
export {
  useGameContainerSize as useContainerSize, // Legacy compatibility
  useGameBreakpoints as useBreakpoints,
  useResponsiveCanvas as useCanvas,
  useResponsiveThreeCamera as useThreeCamera,
  useResponsiveFontSizes as useFontSizes,
  useResponsiveSpacing as useSpacing
}
