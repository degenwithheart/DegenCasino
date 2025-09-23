// Theme type definitions
export interface Theme {
  id: string
  name: string
  description: string
  author?: string
  version?: string
  preview?: string // Preview image URL
  
  colors: ColorScheme
  typography: Typography
  spacing: Spacing
  animations: Animations
  components: ComponentStyles
  breakpoints: Breakpoints
  effects?: VisualEffects
}

export interface ColorScheme {
  // Brand colors
  primary: string
  secondary: string
  accent: string
  
  // Semantic colors
  success: string
  warning: string
  error: string
  info: string
  
  // Background colors
  background: {
    primary: string
    secondary: string
    tertiary?: string
    overlay: string
    glass: string
    gradient?: string
  }
  
  // Text colors
  text: {
    primary: string
    secondary: string
    muted: string
    inverse: string
    accent?: string
  }
  
  // Component specific colors
  border: string
  shadow: string
  highlight: string
  disabled: string
  
  // Game specific colors
  win?: string
  lose?: string
  jackpot?: string
  bonus?: string
}

export interface Typography {
  fonts: {
    primary: string
    secondary: string
    monospace: string
    display?: string
  }
  
  sizes: {
    xs: string
    sm: string
    base: string
    lg: string
    xl: string
    '2xl': string
    '3xl': string
    '4xl': string
    '5xl'?: string
    '6xl'?: string
  }
  
  weights: {
    light: number
    normal: number
    medium: number
    semibold: number
    bold: number
    extrabold?: number
  }
  
  lineHeights: {
    tight: number
    normal: number
    relaxed: number
    loose?: number
  }
  
  letterSpacing?: {
    tight: string
    normal: string
    wide: string
  }
}

export interface Spacing {
  xs: string
  sm: string
  base: string
  lg: string
  xl: string
  '2xl': string
  '3xl': string
  '4xl'?: string
  '5xl'?: string
}

export interface Animations {
  durations: {
    fast: string
    normal: string
    slow: string
  }
  
  easings: {
    linear: string
    ease: string
    easeIn: string
    easeOut: string
    easeInOut: string
    bounce?: string
  }
  
  keyframes?: {
    [key: string]: any // Keyframe objects
  }
}

export interface ComponentStyles {
  Button?: any
  Card?: any
  Modal?: any
  Input?: any
  Select?: any
  Tooltip?: any
  Badge?: any
  Progress?: any
  [componentName: string]: any
}

export interface Breakpoints {
  sm: string
  md: string
  lg: string
  xl: string
  '2xl': string
}

export interface VisualEffects {
  borderRadius: {
    sm: string
    base: string
    lg: string
    xl: string
    full: string
  }
  
  shadows: {
    sm: string
    base: string
    lg: string
    xl: string
    inner?: string
  }
  
  blur: {
    sm: string
    base: string
    lg: string
    xl: string
  }
  
  gradients?: {
    [name: string]: string
  }
}

// Utility types
export type ThemeColor = keyof ColorScheme
export type ThemeSize = keyof Typography['sizes']
export type ThemeSpace = keyof Spacing
export type ThemeComponent = keyof ComponentStyles

// Theme context types
export interface ThemeContextValue {
  currentTheme: string
  setTheme: (themeId: string) => void
  availableThemes: string[]
  isDarkMode: boolean
  toggleDarkMode: () => void
}

// Theme configuration options
export interface ThemeConfig {
  persistTheme: boolean
  enableTransitions: boolean
  transitionDuration: number
  customCSSProperties: boolean
  enableDarkMode: boolean
}

export type ThemeMode = 'light' | 'dark' | 'auto'