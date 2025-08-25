import React, { useMemo, useEffect, useState, createContext, useContext } from 'react'
import { motion } from 'framer-motion'
import styled from 'styled-components'

/**
 * GRAPHICS QUALITY SYSTEM
 * Provides 4 quality levels that automatically scale visual effects based on device performance
 */
export type GraphicsQuality = 'low' | 'medium' | 'high' | 'ultra'

/**
 * CUSTOM THEME SYSTEM
 * Allows dynamic color theming for different visual experiences
 */
export interface CustomTheme {
  name: string
  
  // Core Colors
  primary: string
  secondary: string
  tertiary: string
  accent: string
  background: string
  
  // Extended Color Palette
  success: string        // Win states, positive feedback
  warning: string        // Caution, medium risk
  danger: string         // Loss states, errors, high risk
  info: string          // Information, neutral states
  
  // UI Element Colors
  border: string         // Border colors for frames
  borderHover: string    // Border hover states
  text: string          // Primary text color
  textSecondary: string  // Secondary text color
  textMuted: string     // Muted/disabled text
  
  // Surface Colors
  surface: string        // Card/panel backgrounds
  surfaceHover: string   // Hover states for surfaces
  overlay: string        // Modal/overlay backgrounds
  
  // Interactive Colors
  button: string         // Button backgrounds
  buttonHover: string    // Button hover states
  buttonText: string     // Button text color
  input: string         // Input field backgrounds
  inputBorder: string   // Input field borders
  
  // Game-Specific Colors
  winGlow: string       // Win effect glow color
  loseGlow: string      // Lose effect glow color
  particleWin: string   // Win particle color
  particleLose: string  // Lose particle color
  
  // Gradient Definitions
  gradientPrimary: string    // Primary gradient (CSS gradient string)
  gradientSecondary: string  // Secondary gradient
  gradientAccent: string     // Accent gradient
  
  // Shadow & Effects
  shadowColor: string        // Drop shadow color
  glowColor: string         // General glow effect color
  
  // Optional Theme Metadata
  description?: string       // Theme description
  category?: 'neon' | 'classic' | 'dark' | 'light' | 'cyberpunk' | 'nature' | 'retro' | 'minimal'
  isHighContrast?: boolean   // Accessibility flag
  isDarkMode?: boolean       // Dark/light mode flag
}

/**
 * GRAPHICS SETTINGS INTERFACE
 * Central configuration for all visual effects and performance options
 */
interface GraphicsSettings {
  quality: GraphicsQuality
  enableEffects: boolean      // Accessibility: Enhanced visual feedback (screen shake, win flashes, particles)
  enableMotion: boolean       // Animations and transitions
  customTheme?: CustomTheme   // Override default colors
  performanceMode: boolean    // Auto-detected low-end device mode
}

/**
 * CONTEXT FOR GLOBAL GRAPHICS SETTINGS
 * Accessible by any component in the app without prop drilling
 */
const GraphicsContext = createContext<{
  settings: GraphicsSettings
  updateSettings: (updates: Partial<GraphicsSettings>) => void
}>({
  settings: {
    quality: 'high',
    enableEffects: false,
    enableMotion: false,
    performanceMode: false
  },
  updateSettings: () => {}
})

/**
 * CUSTOM HOOK: Access graphics settings from any component
 */
export const useGraphics = () => {
  const context = useContext(GraphicsContext)
  console.log('[DEBUG-GRAPHICS] useGraphics called:', context)
  return context
}

/**
 * PREDEFINED THEMES
 * Collection of comprehensive color schemes for different casino aesthetics
 */
export const PREDEFINED_THEMES: Record<string, CustomTheme> = {
  neon: {
    name: 'Neon Casino',
    primary: '#ff00ff',
    secondary: '#00ffff',
    tertiary: '#ffff00',
    accent: '#ff0080',
    background: '#0a0a0f',
    success: '#00ff00',
    warning: '#ffaa00',
    danger: '#ff0040',
    info: '#0080ff',
    border: '#ff00ff80',
    borderHover: '#ff00ff',
    text: '#ffffff',
    textSecondary: '#cccccc',
    textMuted: '#888888',
    surface: '#1a1a2e',
    surfaceHover: '#2a2a3e',
    overlay: '#000000cc',
    button: '#ff0080',
    buttonHover: '#ff00a0',
    buttonText: '#ffffff',
    input: '#1a1a2e',
    inputBorder: '#ff00ff40',
    winGlow: '#00ff00',
    loseGlow: '#ff0040',
    particleWin: '#ffff00',
    particleLose: '#ff00ff',
    gradientPrimary: 'linear-gradient(135deg, #ff00ff, #00ffff)',
    gradientSecondary: 'linear-gradient(135deg, #ffff00, #ff0080)',
    gradientAccent: 'linear-gradient(135deg, #ff0080, #ff00ff)',
    shadowColor: '#ff00ff40',
    glowColor: '#ff00ff60',
    description: 'Electric neon lights and cyberpunk vibes',
    category: 'neon',
    isDarkMode: true
  },
  gold: {
    name: 'Golden Palace',
    primary: '#ffd700',
    secondary: '#ffb347',
    tertiary: '#ff8c00',
    accent: '#daa520',
    background: '#1a1610',
    success: '#32cd32',
    warning: '#ff8c00',
    danger: '#dc143c',
    info: '#4169e1',
    border: '#daa52080',
    borderHover: '#ffd700',
    text: '#ffd700',
    textSecondary: '#ffb347',
    textMuted: '#8b7355',
    surface: '#2f2a1a',
    surfaceHover: '#3f3a2a',
    overlay: '#00000080',
    button: '#daa520',
    buttonHover: '#ffd700',
    buttonText: '#1a1610',
    input: '#2f2a1a',
    inputBorder: '#daa52040',
    winGlow: '#ffd700',
    loseGlow: '#dc143c',
    particleWin: '#ffff00',
    particleLose: '#ff6347',
    gradientPrimary: 'linear-gradient(135deg, #ffd700, #ffb347)',
    gradientSecondary: 'linear-gradient(135deg, #ff8c00, #daa520)',
    gradientAccent: 'linear-gradient(135deg, #daa520, #b8860b)',
    shadowColor: '#ffd70040',
    glowColor: '#ffd70060',
    description: 'Luxurious golden elegance and royal splendor',
    category: 'classic',
    isDarkMode: true
  },
  emerald: {
    name: 'Emerald Nights',
    primary: '#50c878',
    secondary: '#40e0d0',
    tertiary: '#00ff7f',
    accent: '#32cd32',
    background: '#0f1a0f',
    success: '#00ff7f',
    warning: '#ffa500',
    danger: '#ff4500',
    info: '#20b2aa',
    border: '#32cd3280',
    borderHover: '#50c878',
    text: '#50c878',
    textSecondary: '#40e0d0',
    textMuted: '#2f4f2f',
    surface: '#1a2e1a',
    surfaceHover: '#2a3e2a',
    overlay: '#00000080',
    button: '#32cd32',
    buttonHover: '#50c878',
    buttonText: '#0f1a0f',
    input: '#1a2e1a',
    inputBorder: '#32cd3240',
    winGlow: '#00ff7f',
    loseGlow: '#ff4500',
    particleWin: '#7fff00',
    particleLose: '#ff6347',
    gradientPrimary: 'linear-gradient(135deg, #50c878, #40e0d0)',
    gradientSecondary: 'linear-gradient(135deg, #00ff7f, #32cd32)',
    gradientAccent: 'linear-gradient(135deg, #32cd32, #228b22)',
    shadowColor: '#50c87840',
    glowColor: '#50c87860',
    description: 'Natural emerald tones and forest mystique',
    category: 'nature',
    isDarkMode: true
  },
  royal: {
    name: 'Royal Purple',
    primary: '#8a2be2',
    secondary: '#9370db',
    tertiary: '#ba55d3',
    accent: '#dda0dd',
    background: '#1a0f1a',
    success: '#9370db',
    warning: '#daa520',
    danger: '#dc143c',
    info: '#4682b4',
    border: '#dda0dd80',
    borderHover: '#8a2be2',
    text: '#dda0dd',
    textSecondary: '#ba55d3',
    textMuted: '#663366',
    surface: '#2e1a2e',
    surfaceHover: '#3e2a3e',
    overlay: '#00000080',
    button: '#8a2be2',
    buttonHover: '#9370db',
    buttonText: '#ffffff',
    input: '#2e1a2e',
    inputBorder: '#8a2be240',
    winGlow: '#ba55d3',
    loseGlow: '#dc143c',
    particleWin: '#dda0dd',
    particleLose: '#ff69b4',
    gradientPrimary: 'linear-gradient(135deg, #8a2be2, #9370db)',
    gradientSecondary: 'linear-gradient(135deg, #ba55d3, #dda0dd)',
    gradientAccent: 'linear-gradient(135deg, #6a1b9a, #8a2be2)',
    shadowColor: '#8a2be240',
    glowColor: '#8a2be260',
    description: 'Majestic purple royalty and regal sophistication',
    category: 'classic',
    isDarkMode: true
  },
  cyberpunk: {
    name: 'Cyberpunk Neon',
    primary: '#00ff99',
    secondary: '#ff007f',
    tertiary: '#ff00ff',
    accent: '#00ffff',
    background: '#0d0b3b',
    success: '#00ff99',
    warning: '#ff9500',
    danger: '#ff0059',
    info: '#0099ff',
    border: '#00ffff80',
    borderHover: '#00ff99',
    text: '#00ffff',
    textSecondary: '#ff007f',
    textMuted: '#6666aa',
    surface: '#1a1a4a',
    surfaceHover: '#2a2a5a',
    overlay: '#0d0b3bcc',
    button: '#00ff99',
    buttonHover: '#00ffcc',
    buttonText: '#0d0b3b',
    input: '#1a1a4a',
    inputBorder: '#00ff9940',
    winGlow: '#00ff99',
    loseGlow: '#ff0059',
    particleWin: '#00ffff',
    particleLose: '#ff007f',
    gradientPrimary: 'linear-gradient(135deg, #00ff99, #ff007f)',
    gradientSecondary: 'linear-gradient(135deg, #ff00ff, #00ffff)',
    gradientAccent: 'linear-gradient(135deg, #0099ff, #00ff99)',
    shadowColor: '#00ff9940',
    glowColor: '#00ffff60',
    description: 'High-tech cyberpunk aesthetic with electric colors',
    category: 'cyberpunk',
    isDarkMode: true
  },
  quantum: {
    name: 'Quantum Flux',
    primary: '#00bcd4',
    secondary: '#6200ea',
    tertiary: '#03a9f4',
    accent: '#ff4081',
    background: '#121212',
    success: '#4caf50',
    warning: '#ff9800',
    danger: '#f44336',
    info: '#2196f3',
    border: '#ff408180',
    borderHover: '#00bcd4',
    text: '#ffffff',
    textSecondary: '#03a9f4',
    textMuted: '#757575',
    surface: '#1e1e1e',
    surfaceHover: '#2e2e2e',
    overlay: '#00000099',
    button: '#6200ea',
    buttonHover: '#7c4dff',
    buttonText: '#ffffff',
    input: '#1e1e1e',
    inputBorder: '#00bcd440',
    winGlow: '#4caf50',
    loseGlow: '#f44336',
    particleWin: '#00bcd4',
    particleLose: '#ff4081',
    gradientPrimary: 'linear-gradient(135deg, #00bcd4, #6200ea)',
    gradientSecondary: 'linear-gradient(135deg, #03a9f4, #ff4081)',
    gradientAccent: 'linear-gradient(135deg, #6200ea, #3f51b5)',
    shadowColor: '#00bcd440',
    glowColor: '#ff408160',
    description: 'Scientific quantum energy with modern materials',
    category: 'cyberpunk',
    isDarkMode: true
  },
  vaporwave: {
    name: 'Vaporwave Dreams',
    primary: '#ff80ff',
    secondary: '#ff33cc',
    tertiary: '#00bfff',
    accent: '#ff1493',
    background: '#222233',
    success: '#00fa9a',
    warning: '#ffa500',
    danger: '#ff1493',
    info: '#00bfff',
    border: '#ff149380',
    borderHover: '#ff80ff',
    text: '#ff80ff',
    textSecondary: '#ff33cc',
    textMuted: '#9999aa',
    surface: '#333344',
    surfaceHover: '#444455',
    overlay: '#22223399',
    button: '#ff1493',
    buttonHover: '#ff33cc',
    buttonText: '#ffffff',
    input: '#333344',
    inputBorder: '#ff80ff40',
    winGlow: '#00fa9a',
    loseGlow: '#ff1493',
    particleWin: '#ff80ff',
    particleLose: '#ff33cc',
    gradientPrimary: 'linear-gradient(135deg, #ff80ff, #ff33cc)',
    gradientSecondary: 'linear-gradient(135deg, #00bfff, #ff1493)',
    gradientAccent: 'linear-gradient(135deg, #ff1493, #9932cc)',
    shadowColor: '#ff149340',
    glowColor: '#ff80ff60',
    description: 'Retro 80s aesthetic with dreamy pastels',
    category: 'retro',
    isDarkMode: true
  },
  holochrome: {
    name: 'Holochrome',
    primary: '#a5d8ff',
    secondary: '#ffb8e6',
    tertiary: '#6ec1e4',
    accent: '#ff5e5e',
    background: '#0f1015',
    success: '#69db7c',
    warning: '#ffd43b',
    danger: '#ff5e5e',
    info: '#74c0fc',
    border: '#ff5e5e80',
    borderHover: '#a5d8ff',
    text: '#e9ecef',
    textSecondary: '#a5d8ff',
    textMuted: '#868e96',
    surface: '#1a1b23',
    surfaceHover: '#2a2b33',
    overlay: '#0f101599',
    button: '#ff5e5e',
    buttonHover: '#ff7979',
    buttonText: '#ffffff',
    input: '#1a1b23',
    inputBorder: '#a5d8ff40',
    winGlow: '#69db7c',
    loseGlow: '#ff5e5e',
    particleWin: '#a5d8ff',
    particleLose: '#ffb8e6',
    gradientPrimary: 'linear-gradient(135deg, #a5d8ff, #ffb8e6)',
    gradientSecondary: 'linear-gradient(135deg, #6ec1e4, #ff5e5e)',
    gradientAccent: 'linear-gradient(135deg, #ff5e5e, #845ef7)',
    shadowColor: '#a5d8ff40',
    glowColor: '#ffb8e660',
    description: 'Holographic chrome with iridescent colors',
    category: 'cyberpunk',
    isDarkMode: true
  }
}


/**
 * PERFORMANCE DETECTION
 * Automatically detects low-end devices and suggests performance mode
 */
function detectPerformanceCapability(): boolean {
  try {
    // Check for indicators of low-end devices
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') as WebGLRenderingContext | null
    
    // GPU detection
    const renderer = gl?.getParameter(gl.RENDERER as GLenum) || ''
    const lowEndGPUs = ['Mali', 'Adreno 3', 'PowerVR', 'Intel HD Graphics']
    const hasLowEndGPU = lowEndGPUs.some(gpu => renderer.includes(gpu))
    
    // Memory detection
    const memory = (navigator as any).deviceMemory || 4
    const hasLowMemory = memory < 4
    
    // Connection speed detection
    const connection = (navigator as any).connection
    const hasSlowConnection = connection?.effectiveType === '2g' || connection?.effectiveType === 'slow-2g'
    
    // Hardware concurrency detection
    const cores = navigator.hardwareConcurrency || 4
    const hasLowCores = cores < 4
    
    return hasLowEndGPU || hasLowMemory || hasSlowConnection || hasLowCores
  } catch {
    // If detection fails, assume medium performance
    return false
  }
}

/**
 * GRAPHICS PROVIDER COMPONENT
 * Wraps the app and provides graphics settings context
 */
export function GraphicsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<GraphicsSettings>(() => {
    // Load global settings from localStorage
    const saved = localStorage.getItem('degenCasinoGraphicsSettings')
    const performanceMode = detectPerformanceCapability()
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Check if this is an old version where effects/motion defaulted to true
        // If so, reset to new defaults while preserving user's quality choice
        const hasOldDefaults = parsed.enableEffects === true || parsed.enableMotion === true
        if (hasOldDefaults) {
          console.log('🔄 Migrating to new graphics defaults (effects/motion OFF)')
          const newDefaults = {
            quality: parsed.quality || (performanceMode ? 'low' : 'high'),
            enableEffects: false,  // New default: OFF (accessibility feature)
            enableMotion: false,   // New default: OFF  
            performanceMode,
            customTheme: parsed.customTheme
          }
          // Save the migrated settings
          localStorage.setItem('degenCasinoGraphicsSettings', JSON.stringify(newDefaults))
          return newDefaults
        }
        
        // Use existing settings but ensure performance mode is detected
        return { ...parsed, performanceMode }
      } catch (e) {
        console.warn('Failed to parse saved graphics settings, using defaults')
      }
    }
    
    return {
      quality: performanceMode ? 'low' : 'high',
      enableEffects: false,  // Default to OFF - accessibility feature for enhanced visual feedback
      enableMotion: false,   // Default to OFF - motion needs enhancement
      performanceMode
    }
  })
  
  const updateSettings = (updates: Partial<GraphicsSettings>) => {
    const newSettings = { ...settings, ...updates }
    console.log('🔧 Global Graphics Settings Update:', { old: settings, new: newSettings, updates })
    setSettings(newSettings)
    
    // Save globally with a consistent key
    localStorage.setItem('degenCasinoGraphicsSettings', JSON.stringify(newSettings))
    
    // Also trigger a custom event so other components can listen
    window.dispatchEvent(new CustomEvent('graphicsSettingsChanged', { 
      detail: newSettings 
    }))
  }
  
  // Performance warning effect
  useEffect(() => {
    if (settings.performanceMode && settings.quality !== 'low') {
      console.warn('🚨 Low-end device detected. Consider switching to Low graphics quality for better performance.')
    }
  }, [settings.performanceMode, settings.quality])
  
  return (
    <GraphicsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </GraphicsContext.Provider>
  )
}

/**
 * GAME SCREEN FRAME PROPS
 */
interface GameScreenFrameProps {
  /** Game title for theming and identification */
  title?: string
  /** Game description for enhanced theming */
  description?: string
  /** Custom colors to override theme [primary, secondary, tertiary] */
  colors?: [string, string, string?]
  /** Game state for visual feedback */
  gameState?: 'loading' | 'playing' | 'finished' | 'error'
  /** Local override for effects (overrides global setting) */
  enableEffects?: boolean
  /** Local override for motion (overrides global setting) */
  enableMotion?: boolean
  /** Disable container transforms to prevent conflicts with game's own 3D perspective */
  disableContainerTransforms?: boolean
  /** Children components to render inside the frame */
  children: React.ReactNode
}

/**
 * COLOR GENERATION UTILITIES
 * Deterministic color generation for consistent theming
 */
function hashHue(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) - hash + input.charCodeAt(i)) & 0xffffffff
  }
  return Math.abs(hash) % 360
}

function generateThemeColors(
  seed: string, 
  customColors?: [string, string, string?],
  theme?: CustomTheme
): [string, string, string] {
  // Use custom colors if provided
  if (customColors) {
    console.log('🎨 Using custom colors:', customColors)
    return [customColors[0], customColors[1], customColors[2] || customColors[0]]
  }
  
  // Use theme colors if available
  if (theme) {
    console.log('🎨 Using theme colors:', theme.name, [theme.primary, theme.secondary, theme.tertiary])
    return [theme.primary, theme.secondary, theme.tertiary]
  }
  
  // Generate deterministic colors from seed
  const hue = hashHue(seed)
  const hue2 = (hue + 120) % 360
  const hue3 = (hue + 240) % 360
  
  const colors = [
    `hsl(${hue}, 70%, 55%)`,
    `hsl(${hue2}, 75%, 60%)`,
    `hsl(${hue3}, 65%, 50%)`
  ]
  
  console.log('🎨 Using generated colors for seed:', seed, colors)
  return colors as [string, string, string]
}

/**
 * STYLED COMPONENTS FOR EFFECTS
 */
const EffectsContainer = styled(motion.div)<{
  'data-enable-motion'?: string
}>`
  position: relative;
  width: 100%;
  height: 100%;
  
  /* Static mode: completely disable ALL CSS transitions and animations */
  ${props => props['data-enable-motion'] === 'false' ? `
    *, *::before, *::after {
      animation-duration: 0s !important;
      animation-delay: 0s !important;
      transition-duration: 0s !important;
      transition-delay: 0s !important;
      animation-play-state: paused !important;
      transform: none !important;
    }
    
    /* Disable hover effects in static mode */
    *:hover {
      transform: none !important;
    }
  ` : ''}
  
  /* Flash overlay for win effects */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 1000;
    opacity: 0;
    background: var(--flash-color, #ffffff);
    transition: ${props => props['data-enable-motion'] === 'false' ? 'none' : 'opacity 0.1s ease'};
  }
  
  &.flashing::before {
    opacity: var(--flash-intensity, 0.3);
  }
`

/**
 * MAIN GAME SCREEN FRAME COMPONENT
 * Provides visual theming, effects, and responsive layout for all games
 */
export default function GameScreenFrame({
  title,
  description,
  colors,
  gameState,
  enableEffects: localEffects,
  enableMotion: localMotion,
  disableContainerTransforms = false,
  children
}: GameScreenFrameProps) {
  const { settings } = useGraphics()
  
  // Determine effective settings (local overrides global)
  const shouldShowEffects = localEffects !== undefined ? localEffects : settings.enableEffects
  const shouldAnimate = localMotion !== undefined ? localMotion : settings.enableMotion
  const theme = settings.customTheme
  
  console.log('🎮 GameScreenFrame Settings:', {
    quality: settings.quality,
    enableEffects: settings.enableEffects,
    enableMotion: settings.enableMotion,
    shouldShowEffects,
    shouldAnimate,
    theme: theme?.name || 'default'
  })
  
  // Generate theme colors
  const seed = title || description || 'game'
  const themeColors = useMemo(() => 
    generateThemeColors(seed, colors, theme), 
    [seed, colors, theme]
  )
  
  // Quality-based rendering decisions combined with effects/motion settings
  const qualitySettings = useMemo(() => {
    const baseSettings = (() => {
      switch (settings.quality) {
        case 'low':
          return {
            showBorder: false,
            showGlow: false,
            showScanline: false,
            showParticles: false,
            borderWidth: 0
          }
        case 'medium':
          return {
            showBorder: true,
            showGlow: true, // Enable glow effects for medium to make effects more visible
            showScanline: false,
            showParticles: false,
            borderWidth: 2
          }
        case 'high':
          return {
            showBorder: true,
            showGlow: true,
            showScanline: false,
            showParticles: true,
            borderWidth: 3
          }
        case 'ultra':
          return {
            showBorder: true,
            showGlow: true,
            showScanline: true,
            showParticles: true,
            borderWidth: 4
          }
      }
    })()
    
    // Override with effects settings
    return {
      ...baseSettings,
      showGlow: baseSettings.showGlow && shouldShowEffects,
      showScanline: baseSettings.showScanline && shouldShowEffects,
      showParticles: baseSettings.showParticles && shouldShowEffects
    }
  }, [settings.quality, shouldShowEffects])
  
  // State-based styling for visual feedback
  const stateStyles = useMemo(() => {
    if (settings.quality === 'low') return {}
    
    switch (gameState) {
      case 'loading':
        return { 
          opacity: 0.8,
          filter: shouldShowEffects ? 'brightness(0.9)' : undefined
        }
      case 'error':
        return { 
          borderColor: theme?.danger || '#ff4444',
          boxShadow: shouldShowEffects ? `0 0 20px ${theme?.danger || '#ff4444'}50` : undefined
        }
      case 'finished':
        return { 
          borderColor: theme?.success || '#44ff44',
          boxShadow: shouldShowEffects ? `0 0 20px ${theme?.success || '#44ff44'}50` : undefined
        }
      default:
        return {}
    }
  }, [gameState, settings.quality, shouldShowEffects, theme])
  
  // LOW QUALITY MODE: Minimal rendering for performance
  if (settings.quality === 'low') {
    const backgroundColor = theme?.background || '#0a0a0f'
    const lowQualityGradient = theme?.gradientPrimary || (theme ? 
      `linear-gradient(135deg, ${backgroundColor}, ${theme.primary}15, ${backgroundColor})` : 
      backgroundColor)
    
    return (
      <div 
        className="w-full h-full relative"
        style={{ 
          backgroundColor,
          background: lowQualityGradient,
          ...stateStyles 
        }}
        data-game-state={gameState}
        data-quality="low"
      >
        {/* Performance warning for low-end devices */}
        {settings.performanceMode && (
          <div className="absolute top-2 right-2 z-50 bg-orange-600 text-white px-2 py-1 rounded text-xs opacity-75">
            Performance Mode
          </div>
        )}
        <div className="w-full h-full p-2">
          {children}
        </div>
      </div>
    )
  }
  
  // MEDIUM+ QUALITY MODE: Full visual effects based on settings
  const backgroundColor = theme?.background || '#0a0a0f'
  const backgroundGradient = theme?.gradientPrimary || (theme ? 
    `linear-gradient(135deg, ${backgroundColor}, ${theme.primary}20, ${theme.secondary}15, ${backgroundColor})` : 
    `linear-gradient(135deg, ${backgroundColor}, #1a1a2e, ${backgroundColor})`)

  return (
    <EffectsContainer
      className="relative w-full h-full group"
      style={{
        background: backgroundGradient,
        '--flash-color': 'transparent',
        '--flash-intensity': '0',
        ...stateStyles
      } as any}
      data-game-state={gameState}
      data-quality={settings.quality}
      data-enable-motion={shouldAnimate.toString()}
      data-game-effects-container="true"
      // Enhanced motion effects - completely disabled in static mode or when transforms disabled
      animate={shouldAnimate && !disableContainerTransforms ? {
        x: 0,
        y: 0,
        rotate: 0,
        backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
      } : false}
      transition={shouldAnimate && !disableContainerTransforms ? {
        x: { type: "spring", stiffness: 500, damping: 30 },
        y: { type: "spring", stiffness: 500, damping: 30 },
        rotate: { type: "spring", stiffness: 500, damping: 30 },
        backgroundPosition: {
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }
      } : { duration: 0 }}
    >
      {/* Performance warning for low-end devices */}
      {settings.performanceMode && settings.quality !== ('low' as GraphicsQuality) && (
        <div className="absolute top-2 right-2 z-50 bg-orange-600 text-white px-2 py-1 rounded text-xs opacity-75">
          Consider Low Quality
        </div>
      )}
      
      {/* ANIMATED BORDER SYSTEM with enhanced motion visibility */}
      {qualitySettings.showBorder && shouldAnimate && shouldShowEffects ? (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            padding: `${qualitySettings.borderWidth}px`,
            background: `linear-gradient(135deg, ${themeColors[0]}, ${themeColors[1]}, ${themeColors[2]})`
          }}
          animate={{ 
            background: [
              `linear-gradient(135deg, ${themeColors[0]}, ${themeColors[1]}, ${themeColors[2]})`,
              `linear-gradient(180deg, ${themeColors[1]}, ${themeColors[2]}, ${themeColors[0]})`,
              `linear-gradient(225deg, ${themeColors[2]}, ${themeColors[0]}, ${themeColors[1]})`,
              `linear-gradient(270deg, ${themeColors[0]}, ${themeColors[2]}, ${themeColors[1]})`,
              `linear-gradient(315deg, ${themeColors[1]}, ${themeColors[0]}, ${themeColors[2]})`,
              `linear-gradient(135deg, ${themeColors[0]}, ${themeColors[1]}, ${themeColors[2]})`
            ],
            scale: [1, 1.02, 1, 0.98, 1],
            rotate: [0, 1, 0, -1, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: 'easeInOut'
          }}
        >
          <div 
            className="w-full h-full rounded-lg" 
            style={{ backgroundColor: 'transparent' }}
          />
        </motion.div>
      ) : qualitySettings.showBorder && shouldShowEffects ? (
        /* STATIC BORDER when motion is disabled but effects are enabled */
        <div
          className="absolute inset-0 rounded-xl pointer-events-none opacity-80"
          style={{
            padding: `${qualitySettings.borderWidth}px`,
            background: `linear-gradient(135deg, ${themeColors[0]}, ${themeColors[1]}, ${themeColors[2]})`
          }}
        >
          <div 
            className="w-full h-full rounded-lg" 
            style={{ backgroundColor: 'transparent' }}
          />
        </div>
      ) : null}
      
      {/* CORNER GLOW EFFECTS (High/Ultra quality) */}
      {qualitySettings.showGlow && shouldShowEffects && (
        <>
          {[0, 1, 2, 3].map(corner => {
            // Use theme glow color if available, otherwise use generated theme colors
            const glowColor = theme?.glowColor || themeColors[corner % 3]
            return shouldAnimate ? (
              <motion.div
                key={corner}
                className="absolute w-24 h-24 rounded-full pointer-events-none opacity-40"
                style={{
                  background: `radial-gradient(circle, ${glowColor}, transparent)`,
                  filter: 'blur(20px)',
                  top: corner < 2 ? -30 : 'auto',
                  bottom: corner >= 2 ? -30 : 'auto',
                  left: corner % 2 === 0 ? -30 : 'auto',
                  right: corner % 2 === 1 ? -30 : 'auto'
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{
                  duration: 3 + corner,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: corner * 0.7
                }}
              />
            ) : (
              <div
                key={corner}
                className="absolute w-24 h-24 rounded-full pointer-events-none opacity-30"
                style={{
                  background: `radial-gradient(circle, ${glowColor}, transparent)`,
                  filter: 'blur(20px)',
                  top: corner < 2 ? -30 : 'auto',
                  bottom: corner >= 2 ? -30 : 'auto',
                  left: corner % 2 === 0 ? -30 : 'auto',
                  right: corner % 2 === 1 ? -30 : 'auto'
                }}
              />
            )
          })}
        </>
      )}
      
      {/* SCANLINE EFFECT (Ultra quality only) */}
      {qualitySettings.showScanline && shouldShowEffects && (
        <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
          {shouldAnimate ? (
            <motion.div
              className="absolute w-full h-1 opacity-30"
              style={{
                background: `linear-gradient(90deg, transparent, ${themeColors[0]}, transparent)`,
                filter: 'blur(1px)'
              }}
              animate={{ y: ['0%', '100%'] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear'
              }}
            />
          ) : (
            <div
              className="absolute w-full h-1 opacity-20"
              style={{
                background: `linear-gradient(90deg, transparent, ${themeColors[0]}, transparent)`,
                filter: 'blur(1px)',
                top: '50%'
              }}
            />
          )}
        </div>
      )}
      
      {/* ENHANCED PARTICLE EFFECTS (High/Ultra quality) - Much more visible */}
      {qualitySettings.showParticles && shouldShowEffects && (
        <>
          {[...Array(settings.quality === 'ultra' ? 12 : 8)].map((_, i) => (
            shouldAnimate ? (
              <motion.div
                key={i}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: settings.quality === 'ultra' ? '6px' : '4px',
                  height: settings.quality === 'ultra' ? '6px' : '4px',
                  backgroundColor: themeColors[i % 3],
                  boxShadow: `0 0 10px ${themeColors[i % 3]}`,
                  filter: 'blur(0.5px)',
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
                animate={{
                  scale: [0.5, 1.5, 0.5],
                  opacity: [0.3, 0.8, 0.3],
                  x: [0, (Math.random() - 0.5) * 100, 0],
                  y: [0, (Math.random() - 0.5) * 100, 0]
                }}
                transition={{
                  duration: 3 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "easeInOut"
                }}
              />
            ) : (
              <div
                key={i}
                className="absolute rounded-full pointer-events-none opacity-50"
                style={{
                  width: '3px',
                  height: '3px',
                  backgroundColor: themeColors[i % 3],
                  filter: 'blur(0.5px)',
                  left: `${20 + (i * 8)}%`,
                  top: `${25 + (i * 7)}%`
                }}
              />
            )
          ))}
        </>
      )}
      
      {/* CONTENT CONTAINER */}
      <div className="relative z-10 w-full h-full p-3 sm:p-4">
        <div className="w-full h-full relative rounded-lg overflow-hidden">
          {children}
        </div>
      </div>
    </EffectsContainer>
  )
}
