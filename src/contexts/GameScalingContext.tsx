import React, { createContext, useContext } from 'react'
import { useGameScreenSize, getGameScreenCSSVars } from '../hooks/ui/useGameScreenSize'
import type { GameScreenDimensions } from '../hooks/ui/useGameScreenSize'

interface GameScalingContextValue extends GameScreenDimensions {
  /**
   * CSS custom properties for the current game screen dimensions
   */
  cssVars: Record<string, string>
  
  /**
   * Get a scale factor for specific game elements
   */
  getElementScale: (element: 'text' | 'ui' | 'canvas' | 'spacing') => number
  
  /**
   * Check if the current viewport is considered small/constrained
   */
  isConstrained: boolean
  
  /**
   * Get responsive padding/margins for game content
   */
  getResponsivePadding: () => { padding: string; margin: string }
}

const GameScalingContext = createContext<GameScalingContextValue | null>(null)

interface GameScalingProviderProps {
  children: React.ReactNode
  /**
   * Custom options for the game screen sizing
   */
  options?: Parameters<typeof useGameScreenSize>[0]
}

/**
 * Provider that makes game screen scaling available throughout the game component tree
 */
export const GameScalingProvider: React.FC<GameScalingProviderProps> = ({ 
  children, 
  options = {} 
}) => {
  const dimensions = useGameScreenSize(options)
  const cssVars = getGameScreenCSSVars(dimensions)
  
  const getElementScale = (element: 'text' | 'ui' | 'canvas' | 'spacing'): number => {
    const multipliers = {
      text: dimensions.breakpoint === 'mobile' ? 0.85 : dimensions.breakpoint === 'tablet' ? 0.92 : 1.0,
      ui: dimensions.breakpoint === 'mobile' ? 0.8 : dimensions.breakpoint === 'tablet' ? 0.9 : 1.0,
      canvas: dimensions.scale,
      spacing: dimensions.breakpoint === 'mobile' ? 0.7 : dimensions.breakpoint === 'tablet' ? 0.85 : 1.0
    }
    
    return multipliers[element] * dimensions.scale
  }
  
  const isConstrained = dimensions.width < 600 || dimensions.height < 400
  
  const getResponsivePadding = () => {
    switch (dimensions.breakpoint) {
      case 'mobile':
        return { padding: '8px 12px', margin: '4px 8px' }
      case 'tablet':
        return { padding: '12px 16px', margin: '6px 12px' }
      case 'desktop':
        return { padding: '16px 20px', margin: '8px 16px' }
      case 'large':
        return { padding: '20px 24px', margin: '12px 20px' }
    }
  }
  
  const contextValue: GameScalingContextValue = {
    ...dimensions,
    cssVars,
    getElementScale,
    isConstrained,
    getResponsivePadding
  }
  
  return (
    <GameScalingContext.Provider value={contextValue}>
      <div style={cssVars}>
        {children}
      </div>
    </GameScalingContext.Provider>
  )
}

/**
 * Hook to access game scaling context within game components
 */
export const useGameScaling = (): GameScalingContextValue => {
  const context = useContext(GameScalingContext)
  if (!context) {
    throw new Error('useGameScaling must be used within a GameScalingProvider')
  }
  return context
}

/**
 * HOC to automatically provide game scaling to a game component
 */
export function withGameScaling<P extends object>(
  Component: React.ComponentType<P>,
  options?: Parameters<typeof useGameScreenSize>[0]
) {
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => (
    <GameScalingProvider options={options}>
      <Component {...(props as P)} ref={ref} />
    </GameScalingProvider>
  ))
  
  WrappedComponent.displayName = `withGameScaling(${Component.displayName || Component.name})`
  return WrappedComponent
}

// Type export for use in other files
export type { GameScalingContextValue }
