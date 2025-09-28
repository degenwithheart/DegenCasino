/**
 * Mobile Device Detection and Theme Auto-Switching
 * 
 * Detects mobile devices and automatically switches to mobile theme
 * while preserving user choice for manual theme selection
 */

// Mobile detection function
export const isMobileDevice = (): boolean => {
  // Check user agent for mobile devices
  const userAgent = navigator.userAgent.toLowerCase()
  const mobileKeywords = [
    'android', 'iphone', 'ipad', 'ipod', 'blackberry', 
    'windows phone', 'mobile', 'webos', 'opera mini'
  ]
  
  const hasMobileUserAgent = mobileKeywords.some(keyword => 
    userAgent.includes(keyword)
  )
  
  // Check screen size (mobile-first breakpoint)
  const hasSmallScreen = window.innerWidth <= 768
  
  // Check for touch capability
  const isTouchDevice = 'ontouchstart' in window || 
                       navigator.maxTouchPoints > 0
  
  // Combine all checks
  return hasMobileUserAgent || (hasSmallScreen && isTouchDevice)
}

// Alias for external usage
export const isMobile = isMobileDevice

// Get optimal theme based on device capabilities
export const getOptimalTheme = (): 'default' | 'degenheart' | 'degen-mobile' => {
  if (isMobileDevice()) {
    return 'degen-mobile'
  }
  
  // Default to degenheart for desktop
  return 'degenheart'
}

// Theme preference storage
const THEME_PREFERENCE_KEY = 'themePreference'

export type ThemePreference = {
  manual: boolean // true if user manually selected theme  
  theme: 'default' | 'degenheart' | 'degen-mobile' | 'auto'
  lastAutoDetection?: 'default' | 'degenheart' | 'degen-mobile'
}

// Get stored theme preference
export const getStoredThemePreference = (): ThemePreference => {
  try {
    const stored = localStorage.getItem(THEME_PREFERENCE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.warn('Failed to load theme preference:', error)
  }
  
  // Default: auto-detection for new users
  return {
    manual: false,
    theme: 'auto'
  }
}

// Store theme preference
export const setStoredThemePreference = (preference: ThemePreference): void => {
  try {
    localStorage.setItem(THEME_PREFERENCE_KEY, JSON.stringify(preference))
  } catch (error) {
    console.warn('Failed to store theme preference:', error)
  }
}

// Resolve actual theme from preference
export const resolveThemeFromPreference = (preference: ThemePreference): 'default' | 'degenheart' | 'degen-mobile' => {
  if (preference.manual && preference.theme !== 'auto') {
    return preference.theme as 'default' | 'degenheart' | 'degen-mobile'
  }
  
  // Auto-detect optimal theme
  return getOptimalTheme()
}

// Initialize theme on app startup
export const initializeTheme = (): 'default' | 'degenheart' | 'degen-mobile' => {
  const preference = getStoredThemePreference()
  const resolved = resolveThemeFromPreference(preference)
  
  // Update auto-detection result
  if (!preference.manual) {
    setStoredThemePreference({
      ...preference,
      lastAutoDetection: resolved
    })
  }
  
  return resolved
}