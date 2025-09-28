// Layout Theme Registry and Definitions
import React from 'react';
import { degenHeartTheme } from './degenheart/index';
import { degenMobileTheme } from './degen-mobile/index';

/**
 * Layout Theme Definition Interface
 * Defines the structure of what a layout theme can override
 */
export interface LayoutTheme {
  id: string;
  name: string;
  description: string;
  
  // Component overrides - each is optional, falls back to default if not provided
  components?: {
    Header?: React.ComponentType<any>;
    Footer?: React.ComponentType<any>;
    Sidebar?: React.ComponentType<any>;
    // Add more as needed
  };
  
  // Section overrides
  sections?: {
    Dashboard?: React.ComponentType<any>;
    Game?: React.ComponentType<any>;
    UserProfile?: React.ComponentType<any>;
    // Add more as needed
  };
  
  // Page overrides for routes
  pages?: {
    JackpotPage?: React.ComponentType<any>;
    BonusPage?: React.ComponentType<any>;
    LeaderboardPage?: React.ComponentType<any>;
    AdminPage?: React.ComponentType<any>;
    TermsPage?: React.ComponentType<any>;
    WhitepaperPage?: React.ComponentType<any>;
    SelectTokenPage?: React.ComponentType<any>;
    AllGamesPage?: React.ComponentType<any>;
    // Add more as needed
  };
  
  // Layout-specific configuration
  config?: {
    enableSidebar?: boolean;
    headerStyle?: 'fixed' | 'sticky' | 'static';
    footerStyle?: 'fixed' | 'static' | 'hidden';
    maxWidth?: string;
    spacing?: 'compact' | 'normal' | 'spacious';
  };
}

/**
 * Available Layout Themes
 * Registry of all layout themes available in the system
 */
export const AVAILABLE_LAYOUT_THEMES = {
  'default': {
    id: 'default',
    name: 'Default',
    description: 'The default DegenHeart Casino layout',
    // No component overrides - uses existing src/components/ and src/sections/
  },
  
  'degenheart': degenHeartTheme,
  'degen-mobile': degenMobileTheme,
} as const;

/**
 * Layout Theme Keys
 */
export type LayoutThemeKey = keyof typeof AVAILABLE_LAYOUT_THEMES;

// Mobile theme reference for auto-detection
export const MOBILE_THEME = degenMobileTheme;

import { DEFAULT_LAYOUT_THEME } from '../../constants';

/**
 * Default Layout Theme
 */
export { DEFAULT_LAYOUT_THEME };

/**
 * Get Layout Theme by Key with automatic mobile detection
 */
export const getLayoutTheme = (key: LayoutThemeKey): LayoutTheme => {
  return AVAILABLE_LAYOUT_THEMES[key] || AVAILABLE_LAYOUT_THEMES.default;
};

/**
 * Get Layout Theme with Mobile Detection
 * This function automatically returns mobile theme on mobile devices
 */
export const getLayoutThemeWithMobileDetection = (key: LayoutThemeKey): LayoutTheme => {
  // Use proper ES6 import and direct mobile detection
  if (typeof window !== 'undefined') {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
    const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword));
    const hasSmallScreen = window.innerWidth <= 768;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Always use mobile theme on mobile devices, regardless of user preference
    if (isMobileUA || (hasSmallScreen && isTouchDevice)) {
      return MOBILE_THEME;
    }
  }
  
  // Use selected theme on desktop
  return AVAILABLE_LAYOUT_THEMES[key] || AVAILABLE_LAYOUT_THEMES.default;
};

/**
 * Get All Available Layout Theme Keys
 */
export const getAvailableLayoutThemes = (): LayoutThemeKey[] => {
  return Object.keys(AVAILABLE_LAYOUT_THEMES) as LayoutThemeKey[];
};