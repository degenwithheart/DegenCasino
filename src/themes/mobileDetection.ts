/**
 * Mobile Device Detection and Theme Auto-Switching
 * 
 * Detects mobile devices and automatically switches to mobile theme
 * while preserving user choice for manual theme selection
 */

// Mobile detection function
export const isMobileDevice = (): boolean => {
  // Check user agent for mobile devices
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = [
    'android', 'iphone', 'ipad', 'ipod', 'blackberry',
    'windows phone', 'mobile', 'webos', 'opera mini'
  ];

  const hasMobileUserAgent = mobileKeywords.some(keyword =>
    userAgent.includes(keyword)
  );

  // Check screen size (mobile-first breakpoint)
  const hasSmallScreen = window.innerWidth <= 768;

  // Check for touch capability
  const isTouchDevice = 'ontouchstart' in window ||
    navigator.maxTouchPoints > 0;

  // Combine all checks
  return hasMobileUserAgent || (hasSmallScreen && isTouchDevice);
};

// Alias for external usage
export const isMobile = isMobileDevice;

// Get optimal theme based on device capabilities
import { FEATURE_FLAGS } from '../constants';

export const getOptimalTheme = (): 'default' | 'degenheart' | 'degen-mobile' => {
  if (isMobileDevice()) {
    if (FEATURE_FLAGS?.ENABLE_DEGEN_MOBILE_THEME) {
      console.log('📱 Mobile device detected - Theme: degen-mobile');
      return 'degen-mobile';
    }

    // Mobile theme disabled via feature flags — fallback to degenheart (or default)
    console.log('📱 Mobile device detected but degen-mobile theme disabled via FEATURE_FLAGS - Theme: degenheart');
    return 'degenheart';
  }

  // Default to degenheart for desktop
  console.log('🖥️ Desktop device detected - Theme: degenheart');
  return 'degenheart';
};

// Theme preference storage
const THEME_PREFERENCE_KEY = 'themePreference';

export type ThemePreference = {
  manual: boolean; // true if user manually selected theme  
  theme: 'default' | 'degenheart' | 'degen-mobile' | 'auto';
  lastAutoDetection?: 'default' | 'degenheart' | 'degen-mobile';
};

// Get stored theme preference
export const getStoredThemePreference = (): ThemePreference => {
  try {
    const stored = localStorage.getItem(THEME_PREFERENCE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to load theme preference:', error);
  }

  // Default: auto-detection for new users
  return {
    manual: false,
    theme: 'auto'
  };
};

// Store theme preference
export const setStoredThemePreference = (preference: ThemePreference): void => {
  try {
    localStorage.setItem(THEME_PREFERENCE_KEY, JSON.stringify(preference));
  } catch (error) {
    console.warn('Failed to store theme preference:', error);
  }
};

// Resolve actual theme from preference
export const resolveThemeFromPreference = (preference: ThemePreference): 'default' | 'degenheart' | 'degen-mobile' => {
  // Check if mobile theme is enabled before forcing it on mobile devices
  if (isMobileDevice()) {
    if (FEATURE_FLAGS?.ENABLE_DEGEN_MOBILE_THEME) {
      console.log('📱 Mobile device detected - Using degen-mobile theme');
      return 'degen-mobile';
    } else {
      console.log('📱 Mobile device detected but degen-mobile theme is disabled via FEATURE_FLAGS - using fallback theme');
      // Use degenheart as fallback for mobile when degen-mobile is disabled
      return 'degenheart';
    }
  }

  // On desktop, respect manual selection
  if (preference.manual && preference.theme !== 'auto') {
    return preference.theme as 'default' | 'degenheart' | 'degen-mobile';
  }

  // Auto-detect optimal theme (for desktop)
  return getOptimalTheme();
};

// Initialize theme on app startup
export const initializeTheme = (): 'default' | 'degenheart' | 'degen-mobile' => {
  const preference = getStoredThemePreference();
  const resolved = resolveThemeFromPreference(preference);

  // Update auto-detection result
  if (!preference.manual) {
    setStoredThemePreference({
      ...preference,
      lastAutoDetection: resolved
    });
  }

  return resolved;
};