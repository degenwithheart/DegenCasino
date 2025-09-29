/**
 * Device Detection Utilities for Degen Mobile Theme
 * Distinguishes between tablet and mobile devices for game loading
 */

// Breakpoint thresholds
const MOBILE_MAX_WIDTH = 768
const TABLET_MIN_WIDTH = 769
const TABLET_MAX_WIDTH = 1024

/**
 * Check if current device is a tablet
 * Tablets: 769px - 1024px width with touch capability
 */
export const isTabletDevice = (): boolean => {
  if (typeof window === 'undefined') return false
  
  const width = window.innerWidth
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  const isTabletWidth = width >= TABLET_MIN_WIDTH && width <= TABLET_MAX_WIDTH
  
  return isTouchDevice && isTabletWidth
}

/**
 * Check if current device is mobile phone
 * Mobile: < 768px width with touch capability
 */
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false
  
  const width = window.innerWidth
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  const isMobileWidth = width <= MOBILE_MAX_WIDTH
  
  return isTouchDevice && isMobileWidth
}

/**
 * Get device type for game loading decisions
 * Returns 'mobile' | 'tablet' | 'desktop'
 */
export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  if (typeof window === 'undefined') return 'desktop'
  
  const width = window.innerWidth
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  
  console.log(`📏 Device Detection:`, {
    width,
    isTouchDevice,
    isMobile: isMobileDevice(),
    isTablet: isTabletDevice()
  })
  
  if (isMobileDevice()) return 'mobile'
  if (isTabletDevice()) return 'tablet'
  return 'desktop'
}

/**
 * Check if device should use mobile-specific game files
 * Only mobile phones (not tablets) use mobile game files
 */
export const shouldUseMobileGames = (): boolean => {
  return getDeviceType() === 'mobile'
}

/**
 * Check if device should use desktop game files
 * Tablets and desktop use desktop game files
 */
export const shouldUseDesktopGames = (): boolean => {
  const deviceType = getDeviceType()
  return deviceType === 'tablet' || deviceType === 'desktop'
}