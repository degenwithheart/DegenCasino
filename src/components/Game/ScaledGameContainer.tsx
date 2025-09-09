import React from 'react'
import styled from 'styled-components'
import { useGameScaling } from '../../contexts/GameScalingContext'

interface ScaledGameContainerProps {
  children: React.ReactNode
  /**
   * Whether to apply automatic scaling to child elements
   * @default true
   */
  enableAutoScaling?: boolean
  /**
   * Whether to center content within the container
   * @default true
   */
  centerContent?: boolean
  /**
   * Custom scaling factor override
   */
  customScale?: number
  /**
   * Additional CSS styles
   */
  style?: React.CSSProperties
  /**
   * Whether to fill entire screen space
   * @default true
   */
  fillSpace?: boolean
}

const StyledContainer = styled.div<{
  $scale: number
  $centerContent: boolean
  $fillSpace: boolean
}>`
  position: relative;
  width: 100%;
  height: 100%;
  
  ${({ $fillSpace }) => $fillSpace && `
    min-height: 100%;
    min-width: 100%;
  `}
  
  ${({ $centerContent }) => $centerContent && `
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `}
  
  ${({ $scale, $centerContent }) => `
    transform: scale(${$scale});
    transform-origin: ${$centerContent ? 'center' : 'top left'};
  `}
  
  /* Ensure scaled content doesn't overflow */
  overflow: hidden;
  
  /* Apply responsive spacing using CSS custom properties */
  padding: calc(var(--game-spacing-scale, 1) * 16px);
  gap: calc(var(--game-spacing-scale, 1) * 12px);
  
  /* Mobile adjustments */
  @media (max-width: 767px) {
    padding: calc(var(--game-spacing-scale, 1) * 12px);
    gap: calc(var(--game-spacing-scale, 1) * 8px);
  }
  
  /* Apply text scaling to all text elements */
  font-size: calc(var(--game-text-scale, 1) * 1rem);
  
  h1, h2, h3, h4, h5, h6 {
    font-size: calc(var(--game-text-scale, 1) * 1em);
  }
  
  /* Button and UI element scaling */
  button, input, select, textarea {
    font-size: calc(var(--game-ui-scale, 1) * 1rem);
    padding: calc(var(--game-ui-scale, 1) * 0.5em) calc(var(--game-ui-scale, 1) * 1em);
  }
  
  /* Canvas and media scaling hints */
  canvas, video, img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`

/**
 * Container component that automatically scales game content to fit available screen space
 */
export const ScaledGameContainer: React.FC<ScaledGameContainerProps> = ({
  children,
  enableAutoScaling = true,
  centerContent = true,
  customScale,
  style,
  fillSpace = true,
  ...props
}) => {
  const { scale, getElementScale, cssVars } = useGameScaling()
  
  const finalScale = customScale ?? (enableAutoScaling ? Math.max(0.7, Math.min(scale, 1.5)) : 1)
  
  return (
    <StyledContainer
      $scale={finalScale}
      $centerContent={centerContent}
      $fillSpace={fillSpace}
      style={{ ...cssVars, ...style }}
      {...props}
    >
      {children}
    </StyledContainer>
  )
}

/**
 * Hook that provides scaled dimensions for canvas/3D games
 */
export function useCanvasScaling() {
  const { width, height, scale, breakpoint } = useGameScaling()
  
  // Calculate optimal canvas dimensions
  const canvasScale = Math.max(0.6, Math.min(scale, 2.0))
  const scaledWidth = Math.round(width * canvasScale)
  const scaledHeight = Math.round(height * canvasScale)
  
  // Device pixel ratio for high-DPI displays
  const pixelRatio = window.devicePixelRatio || 1
  const actualPixelRatio = breakpoint === 'mobile' ? Math.min(pixelRatio, 2) : pixelRatio
  
  return {
    width: scaledWidth,
    height: scaledHeight,
    scale: canvasScale,
    pixelRatio: actualPixelRatio,
    // CSS dimensions (displayed size)
    cssWidth: `${scaledWidth}px`,
    cssHeight: `${scaledHeight}px`,
    // Canvas dimensions (render size)
    canvasWidth: Math.round(scaledWidth * actualPixelRatio),
    canvasHeight: Math.round(scaledHeight * actualPixelRatio),
  }
}

/**
 * Utility component for responsive text that scales with game screen
 */
export const ScaledText = styled.span<{ 
  size?: 'small' | 'medium' | 'large' | 'xl'
  weight?: 'normal' | 'bold' | 'light'
}>`
  font-size: calc(var(--game-text-scale, 1) * ${props => {
    switch (props.size) {
      case 'small': return '0.875rem'
      case 'large': return '1.25rem'
      case 'xl': return '1.5rem'
      default: return '1rem'
    }
  }});
  
  font-weight: ${props => {
    switch (props.weight) {
      case 'bold': return '700'
      case 'light': return '300'
      default: return '400'
    }
  }};
  
  line-height: 1.4;
`

/**
 * Utility component for responsive buttons that scale with game screen
 */
export const ScaledButton = styled.button<{
  size?: 'small' | 'medium' | 'large'
  variant?: 'primary' | 'secondary' | 'outline'
}>`
  font-size: calc(var(--game-ui-scale, 1) * ${props => {
    switch (props.size) {
      case 'small': return '0.875rem'
      case 'large': return '1.125rem'
      default: return '1rem'
    }
  }});
  
  padding: calc(var(--game-ui-scale, 1) * ${props => {
    switch (props.size) {
      case 'small': return '0.375rem 0.75rem'
      case 'large': return '0.75rem 1.5rem'
      default: return '0.5rem 1rem'
    }
  }});
  
  border-radius: calc(var(--game-ui-scale, 1) * 0.375rem);
  min-height: calc(var(--game-ui-scale, 1) * 44px); /* Touch-friendly minimum */
  min-width: calc(var(--game-ui-scale, 1) * 44px);
  
  /* Variants */
  ${props => {
    switch (props.variant) {
      case 'secondary':
        return `
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
        `
      case 'outline':
        return `
          background: transparent;
          border: 2px solid currentColor;
          color: inherit;
        `
      default:
        return `
          background: linear-gradient(135deg, #ffd700 0%, #ff0066 100%);
          border: none;
          color: white;
        `
    }
  }}
  
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`
