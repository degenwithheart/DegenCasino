// Theme utility functions and helpers

// =============================================================================
// COLOR UTILITIES
// =============================================================================

/**
 * Convert hex color to RGB values
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

/**
 * Convert RGB to hex color
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

/**
 * Lighten a color by a percentage
 */
export function lighten(color: string, amount: number): string {
  const rgb = hexToRgb(color)
  if (!rgb) return color
  
  const { r, g, b } = rgb
  const newR = Math.min(255, Math.round(r + (255 - r) * amount))
  const newG = Math.min(255, Math.round(g + (255 - g) * amount))
  const newB = Math.min(255, Math.round(b + (255 - b) * amount))
  
  return rgbToHex(newR, newG, newB)
}

/**
 * Darken a color by a percentage
 */
export function darken(color: string, amount: number): string {
  const rgb = hexToRgb(color)
  if (!rgb) return color
  
  const { r, g, b } = rgb
  const newR = Math.max(0, Math.round(r * (1 - amount)))
  const newG = Math.max(0, Math.round(g * (1 - amount)))
  const newB = Math.max(0, Math.round(b * (1 - amount)))
  
  return rgbToHex(newR, newG, newB)
}

/**
 * Generate color variations (50-900 scale)
 */
export function generateColorVariations(baseColor: string) {
  return {
    50: lighten(baseColor, 0.95),
    100: lighten(baseColor, 0.9),
    200: lighten(baseColor, 0.75),
    300: lighten(baseColor, 0.6),
    400: lighten(baseColor, 0.3),
    500: baseColor,
    600: darken(baseColor, 0.1),
    700: darken(baseColor, 0.25),
    800: darken(baseColor, 0.4),
    900: darken(baseColor, 0.6),
  }
}

/**
 * Calculate color contrast ratio
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)
  
  if (!rgb1 || !rgb2) return 1
  
  const luminance1 = getLuminance(rgb1.r, rgb1.g, rgb1.b)
  const luminance2 = getLuminance(rgb2.r, rgb2.g, rgb2.b)
  
  const brightest = Math.max(luminance1, luminance2)
  const darkest = Math.min(luminance1, luminance2)
  
  return (brightest + 0.05) / (darkest + 0.05)
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

/**
 * Check if color meets WCAG accessibility standards
 */
export function isAccessible(foreground: string, background: string, level: 'AA' | 'AAA' = 'AA'): boolean {
  const ratio = getContrastRatio(foreground, background)
  return level === 'AA' ? ratio >= 4.5 : ratio >= 7
}

// =============================================================================
// CSS UTILITIES
// =============================================================================

/**
 * Generate CSS custom properties from theme
 */
export function generateCSSVariables(theme: any): string {
  const variables: string[] = []
  
  // Colors
  Object.entries(theme.colors).forEach(([key, value]) => {
    if (typeof value === 'string') {
      variables.push(`  --color-${key}: ${value};`)
    } else if (typeof value === 'object') {
      Object.entries(value).forEach(([subKey, subValue]) => {
        variables.push(`  --color-${key}-${subKey}: ${subValue};`)
      })
    }
  })
  
  // Typography
  Object.entries(theme.typography.fonts).forEach(([key, value]) => {
    variables.push(`  --font-${key}: ${value};`)
  })
  
  Object.entries(theme.typography.sizes).forEach(([key, value]) => {
    variables.push(`  --text-${key}: ${value};`)
  })
  
  // Spacing
  Object.entries(theme.spacing).forEach(([key, value]) => {
    variables.push(`  --space-${key}: ${value};`)
  })
  
  // Effects
  if (theme.effects) {
    Object.entries(theme.effects.shadows || {}).forEach(([key, value]) => {
      variables.push(`  --shadow-${key}: ${value};`)
    })
    
    Object.entries(theme.effects.borderRadius || {}).forEach(([key, value]) => {
      variables.push(`  --radius-${key}: ${value};`)
    })
  }
  
  return `:root {\n${variables.join('\n')}\n}`
}

// =============================================================================
// RESPONSIVE UTILITIES
// =============================================================================

/**
 * Media query helper
 */
export const mediaQueries = {
  mobile: '@media (max-width: 767px)',
  tablet: '@media (min-width: 768px) and (max-width: 1023px)',
  desktop: '@media (min-width: 1024px)',
  largeDesktop: '@media (min-width: 1440px)',
  
  // Custom breakpoint helper
  custom: (minWidth: string) => `@media (min-width: ${minWidth})`,
  between: (minWidth: string, maxWidth: string) => 
    `@media (min-width: ${minWidth}) and (max-width: ${maxWidth})`
}

/**
 * Responsive utility function for styled-components
 */
export function responsive(styles: { [key: string]: any }) {
  return Object.entries(styles).map(([breakpoint, css]) => {
    if (breakpoint === 'base') return css
    return mediaQueries[breakpoint as keyof typeof mediaQueries] ? 
      `${mediaQueries[breakpoint as keyof typeof mediaQueries]} { ${css} }` : ''
  }).join('\n')
}

// =============================================================================
// ANIMATION UTILITIES
// =============================================================================

/**
 * Create keyframe animation string
 */
export function createKeyframes(name: string, steps: { [key: string]: string }): string {
  const keyframeSteps = Object.entries(steps)
    .map(([percentage, styles]) => `${percentage} { ${styles} }`)
    .join('\n  ')
  
  return `@keyframes ${name} {\n  ${keyframeSteps}\n}`
}

/**
 * Easing function generator
 */
export const easings = {
  easeInQuad: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  easeOutQuad: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  easeInOutQuad: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
  easeInCubic: 'cubic-bezier(0.32, 0, 0.67, 0)',
  easeOutCubic: 'cubic-bezier(0.33, 1, 0.68, 1)',
  easeInOutCubic: 'cubic-bezier(0.65, 0, 0.35, 1)',
  easeInQuart: 'cubic-bezier(0.5, 0, 0.75, 0)',
  easeOutQuart: 'cubic-bezier(0.25, 1, 0.5, 1)',
  easeInOutQuart: 'cubic-bezier(0.76, 0, 0.24, 1)',
  easeInQuint: 'cubic-bezier(0.64, 0, 0.78, 0)',
  easeOutQuint: 'cubic-bezier(0.22, 1, 0.36, 1)',
  easeInOutQuint: 'cubic-bezier(0.83, 0, 0.17, 1)',
  easeInBack: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  easeOutBack: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  easeInOutBack: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
}

// =============================================================================
// VALIDATION UTILITIES
// =============================================================================

/**
 * Validate theme structure
 */
export function validateTheme(theme: any): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  // Required properties
  const requiredProps = ['id', 'name', 'colors', 'typography', 'spacing', 'breakpoints']
  requiredProps.forEach(prop => {
    if (!theme[prop]) {
      errors.push(`Missing required property: ${prop}`)
    }
  })
  
  // Validate colors
  if (theme.colors) {
    const requiredColors = ['primary', 'secondary', 'background', 'text']
    requiredColors.forEach(color => {
      if (!theme.colors[color]) {
        errors.push(`Missing required color: ${color}`)
      }
    })
    
    // Validate color format
    Object.entries(theme.colors).forEach(([key, value]) => {
      if (typeof value === 'string' && !isValidColor(value as string)) {
        errors.push(`Invalid color format for ${key}: ${value}`)
      }
    })
  }
  
  // Validate typography
  if (theme.typography) {
    if (!theme.typography.fonts || !theme.typography.sizes) {
      errors.push('Typography must include fonts and sizes')
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

function isValidColor(color: string): boolean {
  // Check hex colors
  if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) return true
  
  // Check rgb/rgba
  if (/^rgba?\([\d\s,%.]+\)$/.test(color)) return true
  
  // Check hsl/hsla
  if (/^hsla?\([\d\s,%.]+\)$/.test(color)) return true
  
  // Check gradients and CSS functions
  if (color.includes('linear-gradient') || color.includes('radial-gradient')) return true
  
  return false
}

// =============================================================================
// STORAGE UTILITIES
// =============================================================================

/**
 * Save theme preference to localStorage
 */
export function saveThemePreference(themeId: string): void {
  try {
    localStorage.setItem('degenCasino_theme', themeId)
  } catch (error) {
    console.warn('Failed to save theme preference:', error)
  }
}

/**
 * Load theme preference from localStorage
 */
export function loadThemePreference(): string | null {
  try {
    return localStorage.getItem('degenCasino_theme')
  } catch (error) {
    console.warn('Failed to load theme preference:', error)
    return null
  }
}

/**
 * Detect user's preferred color scheme
 */
export function getPreferredColorScheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark'
  
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  
  return 'light'
}

// =============================================================================
// PERFORMANCE UTILITIES
// =============================================================================

/**
 * Debounce theme changes to improve performance
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * Preload theme assets
 */
export function preloadThemeAssets(theme: any): Promise<void[]> {
  const promises: Promise<void>[] = []
  
  // Preload fonts
  if (theme.typography?.fonts) {
    Object.values(theme.typography.fonts).forEach((fontFamily: any) => {
      if (typeof fontFamily === 'string') {
        promises.push(loadFont(fontFamily))
      }
    })
  }
  
  // Preload background images
  if (theme.backgroundImages) {
    Object.values(theme.backgroundImages).forEach((imagePath: any) => {
      if (typeof imagePath === 'string') {
        promises.push(loadImage(imagePath))
      }
    })
  }
  
  return Promise.all(promises)
}

function loadFont(fontFamily: string): Promise<void> {
  return new Promise((resolve) => {
    const font = new FontFace(fontFamily, `url(${fontFamily})`)
    font.load().then(() => {
      document.fonts.add(font)
      resolve()
    }).catch(() => resolve()) // Fail silently
  })
}

function loadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => resolve() // Fail silently
    img.src = src
  })
}

// =============================================================================
// EXPORT ALL UTILITIES
// =============================================================================

export const themeUtils = {
  // Color utilities
  hexToRgb,
  rgbToHex,
  lighten,
  darken,
  generateColorVariations,
  getContrastRatio,
  isAccessible,
  
  // CSS utilities
  generateCSSVariables,
  mediaQueries,
  responsive,
  
  // Animation utilities
  createKeyframes,
  easings,
  
  // Validation utilities
  validateTheme,
  
  // Storage utilities
  saveThemePreference,
  loadThemePreference,
  getPreferredColorScheme,
  
  // Performance utilities
  debounce,
  preloadThemeAssets
}