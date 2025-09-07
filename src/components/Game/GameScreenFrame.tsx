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
  category?: 'dark' | 'classic' | 'frost' | 'fire' | 'nature' | 'cosmic'
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
 * Brand new collection of 6 casino themes
 */
export const PREDEFINED_THEMES: Record<string, CustomTheme> = {
  midnight: {
    name: 'Midnight Luxe',
    primary: '#1e90ff',
    secondary: '#4b0082',
    tertiary: '#00ced1',
    accent: '#ff69b4',
    background: '#0b0c10',
    success: '#00fa9a',
    warning: '#ffb347',
    danger: '#ff4757',
    info: '#1e90ff',
    border: '#1e90ff80',
    borderHover: '#4b0082',
    text: '#ffffff',
    textSecondary: '#a9a9a9',
    textMuted: '#555555',
    surface: '#1a1a1f',
    surfaceHover: '#2a2a30',
    overlay: '#000000cc',
    button: '#1e90ff',
    buttonHover: '#4682b4',
    buttonText: '#ffffff',
    input: '#1a1a1f',
    inputBorder: '#1e90ff40',
    winGlow: '#00fa9a',
    loseGlow: '#ff4757',
    particleWin: '#1e90ff',
    particleLose: '#ff69b4',
    gradientPrimary: 'linear-gradient(135deg, #1e90ff, #4b0082)',
    gradientSecondary: 'linear-gradient(135deg, #00ced1, #ff69b4)',
    gradientAccent: 'linear-gradient(135deg, #4b0082, #1e90ff)',
    shadowColor: '#1e90ff40',
    glowColor: '#1e90ff60',
    description: 'A luxurious midnight casino with deep blues and neon highlights',
    category: 'dark',
    isDarkMode: true
  },
  crimson: {
    name: 'Crimson Royale',
    primary: '#dc143c',
    secondary: '#ff6347',
    tertiary: '#ff4500',
    accent: '#ffd700',
    background: '#1a0f0f',
    success: '#32cd32',
    warning: '#ffa500',
    danger: '#ff2400',
    info: '#ff6347',
    border: '#dc143c80',
    borderHover: '#ff4500',
    text: '#ffffff',
    textSecondary: '#ffb6b6',
    textMuted: '#8b3a3a',
    surface: '#2a1414',
    surfaceHover: '#3a2020',
    overlay: '#00000099',
    button: '#dc143c',
    buttonHover: '#ff2400',
    buttonText: '#ffffff',
    input: '#2a1414',
    inputBorder: '#dc143c40',
    winGlow: '#ffd700',
    loseGlow: '#ff2400',
    particleWin: '#ff4500',
    particleLose: '#ff6347',
    gradientPrimary: 'linear-gradient(135deg, #dc143c, #ff6347)',
    gradientSecondary: 'linear-gradient(135deg, #ff4500, #ffd700)',
    gradientAccent: 'linear-gradient(135deg, #ff2400, #dc143c)',
    shadowColor: '#dc143c40',
    glowColor: '#ff634760',
    description: 'Fiery crimson tones with royal luxury',
    category: 'classic',
    isDarkMode: true
  },
  arctic: {
    name: 'Arctic Frost',
    primary: '#00e5ff',
    secondary: '#80d8ff',
    tertiary: '#b3e5fc',
    accent: '#ffffff',
    background: '#0f1a20',
    success: '#00ffcc',
    warning: '#ffcc00',
    danger: '#ff1744',
    info: '#40c4ff',
    border: '#00e5ff80',
    borderHover: '#80d8ff',
    text: '#e0f7fa',
    textSecondary: '#b3e5fc',
    textMuted: '#80cbc4',
    surface: '#1a2a30',
    surfaceHover: '#2a3a40',
    overlay: '#0f1a2099',
    button: '#00e5ff',
    buttonHover: '#40c4ff',
    buttonText: '#0f1a20',
    input: '#1a2a30',
    inputBorder: '#00e5ff40',
    winGlow: '#00ffcc',
    loseGlow: '#ff1744',
    particleWin: '#80d8ff',
    particleLose: '#ff4081',
    gradientPrimary: 'linear-gradient(135deg, #00e5ff, #80d8ff)',
    gradientSecondary: 'linear-gradient(135deg, #b3e5fc, #00e5ff)',
    gradientAccent: 'linear-gradient(135deg, #40c4ff, #00e5ff)',
    shadowColor: '#00e5ff40',
    glowColor: '#80d8ff60',
    description: 'A cool, icy atmosphere with frosted neon lights',
    category: 'frost',
    isDarkMode: true
  },
  solar: {
    name: 'Solar Flare',
    primary: '#ffb400',
    secondary: '#ff7300',
    tertiary: '#ff4500',
    accent: '#ff004c',
    background: '#1a0f05',
    success: '#32cd32',
    warning: '#ffb400',
    danger: '#e60026',
    info: '#ff7300',
    border: '#ff730080',
    borderHover: '#ffb400',
    text: '#fff0d9',
    textSecondary: '#ffcc80',
    textMuted: '#b36b00',
    surface: '#2a1a0a',
    surfaceHover: '#3a2a1a',
    overlay: '#1a0f0599',
    button: '#ff7300',
    buttonHover: '#ffb400',
    buttonText: '#1a0f05',
    input: '#2a1a0a',
    inputBorder: '#ff730040',
    winGlow: '#ffd700',
    loseGlow: '#e60026',
    particleWin: '#ffb400',
    particleLose: '#ff004c',
    gradientPrimary: 'linear-gradient(135deg, #ffb400, #ff7300)',
    gradientSecondary: 'linear-gradient(135deg, #ff4500, #ff004c)',
    gradientAccent: 'linear-gradient(135deg, #ff7300, #ffd700)',
    shadowColor: '#ff730040',
    glowColor: '#ffb40060',
    description: 'Blazing sunbursts and fiery casino energy',
    category: 'fire',
    isDarkMode: true
  },
  jade: {
    name: 'Jade Dynasty',
    primary: '#00c853',
    secondary: '#64dd17',
    tertiary: '#aeea00',
    accent: '#00e676',
    background: '#0f1a10',
    success: '#00ff7f',
    warning: '#ffd600',
    danger: '#ff1744',
    info: '#00c853',
    border: '#00e67680',
    borderHover: '#64dd17',
    text: '#c8e6c9',
    textSecondary: '#aeea00',
    textMuted: '#4caf50',
    surface: '#1a2e1c',
    surfaceHover: '#2a3e2c',
    overlay: '#0f1a1099',
    button: '#00c853',
    buttonHover: '#00e676',
    buttonText: '#ffffff',
    input: '#1a2e1c',
    inputBorder: '#00e67640',
    winGlow: '#64dd17',
    loseGlow: '#ff1744',
    particleWin: '#00e676',
    particleLose: '#ff4081',
    gradientPrimary: 'linear-gradient(135deg, #00c853, #64dd17)',
    gradientSecondary: 'linear-gradient(135deg, #aeea00, #00e676)',
    gradientAccent: 'linear-gradient(135deg, #00c853, #4caf50)',
    shadowColor: '#00c85340',
    glowColor: '#64dd1760',
    description: 'Mystical jade-inspired theme with Eastern elegance',
    category: 'nature',
    isDarkMode: true
  },
  starlight: {
    name: 'Starlight Mirage',
    primary: '#9370db',
    secondary: '#6a5acd',
    tertiary: '#4169e1',
    accent: '#ff69b4',
    background: '#0f0f1a',
    success: '#32cd32',
    warning: '#ffa500',
    danger: '#dc143c',
    info: '#1e90ff',
    border: '#9370db80',
    borderHover: '#6a5acd',
    text: '#e6e6fa',
    textSecondary: '#b0c4de',
    textMuted: '#696969',
    surface: '#1a1a2e',
    surfaceHover: '#2a2a3e',
    overlay: '#0f0f1a99',
    button: '#9370db',
    buttonHover: '#6a5acd',
    buttonText: '#ffffff',
    input: '#1a1a2e',
    inputBorder: '#9370db40',
    winGlow: '#9370db',
    loseGlow: '#dc143c',
    particleWin: '#4169e1',
    particleLose: '#ff69b4',
    gradientPrimary: 'linear-gradient(135deg, #9370db, #4169e1)',
    gradientSecondary: 'linear-gradient(135deg, #6a5acd, #ff69b4)',
    gradientAccent: 'linear-gradient(135deg, #9370db, #ff69b4)',
    shadowColor: '#9370db40',
    glowColor: '#9370db60',
    description: 'Dreamy starlit purples and cosmic casino allure',
    category: 'cosmic',
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
        console.log('📱 Loading saved graphics settings:', parsed)
        
        // Always preserve user's explicit choices
        return { 
          quality: parsed.quality || (performanceMode ? 'low' : 'high'),
          enableEffects: parsed.enableEffects !== undefined ? parsed.enableEffects : false,
          enableMotion: parsed.enableMotion !== undefined ? parsed.enableMotion : false,
          performanceMode,
          customTheme: parsed.customTheme
        }
      } catch (e) {
        console.warn('Failed to parse saved graphics settings, using defaults')
      }
    }
    
    console.log('📱 Using default graphics settings (new user)')
    return {
      quality: performanceMode ? 'low' : 'high',
      enableEffects: false,  // Default to OFF - accessibility feature for enhanced visual feedback
      enableMotion: false,   // Default to OFF - motion needs enhancement
      performanceMode
    }
  })
  
  const updateSettings = (updates: Partial<GraphicsSettings>) => {
    const newSettings = { ...settings, ...updates }
    console.log('🔧 Graphics Settings Update:', { 
      previous: settings, 
      updates, 
      final: newSettings 
    })
    setSettings(newSettings)
    
    // Save globally with a consistent key
    localStorage.setItem('degenCasinoGraphicsSettings', JSON.stringify(newSettings))
    console.log('💾 Saved to localStorage:', JSON.stringify(newSettings))
    
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
    disableContainerTransforms,
    qualityEffectsDisabled: disableContainerTransforms,
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
    // IMPORTANT: Also disable all effects when container transforms are disabled (like for Slots)
    const effectsEnabled = shouldShowEffects && !disableContainerTransforms
    return {
      ...baseSettings,
      showBorder: baseSettings.showBorder && effectsEnabled,
      showGlow: baseSettings.showGlow && effectsEnabled,
      showScanline: baseSettings.showScanline && effectsEnabled,
      showParticles: baseSettings.showParticles && effectsEnabled
    }
  }, [settings.quality, shouldShowEffects, disableContainerTransforms])
  
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
  const backgroundColor = theme?.background
  const backgroundGradient = theme?.gradientPrimary || (theme ? 
    `linear-gradient(135deg, ${backgroundColor}, ${theme.primary}20, ${theme.secondary}15, ${backgroundColor})` : 
    `linear-gradient(135deg, ${backgroundColor}, ${backgroundColor})`)

  // Use regular div when transforms are disabled to avoid layout conflicts
  const ContainerComponent = disableContainerTransforms ? 'div' : EffectsContainer

  const containerProps = disableContainerTransforms ? {
    className: "relative w-full h-full group",
    style: {
      background: backgroundGradient,
      '--flash-color': 'transparent',
      '--flash-intensity': '0',
      ...stateStyles
    } as any,
    'data-game-state': gameState,
    'data-quality': settings.quality,
    'data-enable-motion': shouldAnimate.toString(),
    'data-game-effects-container': "true"
  } : {
    className: "relative w-full h-full group",
    style: {
      background: backgroundGradient,
      '--flash-color': 'transparent',
      '--flash-intensity': '0',
      ...stateStyles
    } as any,
    'data-game-state': gameState,
    'data-quality': settings.quality,
    'data-enable-motion': shouldAnimate.toString(),
    'data-game-effects-container': "true",
    // Enhanced motion effects - completely disabled in static mode or when transforms disabled
    animate: shouldAnimate ? {
      x: 0,
      y: 0,
      rotate: 0,
      backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
    } : false,
    transition: shouldAnimate ? {
      x: { type: "spring", stiffness: 500, damping: 30 },
      y: { type: "spring", stiffness: 500, damping: 30 },
      rotate: { type: "spring", stiffness: 500, damping: 30 },
      backgroundPosition: {
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }
    } : { duration: 0 }
  }

  return (
    <ContainerComponent {...containerProps}>
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
    </ContainerComponent>
  )
}
