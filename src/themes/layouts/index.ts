// Layout Theme Registry and Definitions
import React from 'react';
import { degenHeartTheme } from './degenheart/index';

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
export const AVAILABLE_LAYOUT_THEMES: Record<string, LayoutTheme> = {
  default: {
    id: 'default',
    name: 'Degen Original',
    description: '2-Column layout',
    config: {
      enableSidebar: false,
      headerStyle: 'sticky',
      footerStyle: 'static',
      maxWidth: '100%',
      spacing: 'normal',
    },
    // No component overrides - uses existing src/components/ and src/sections/
  },
  
  'degenheart': degenHeartTheme,
};

import { DEFAULT_LAYOUT_THEME } from '../../constants';

/**
 * Layout Theme Keys
 */
export type LayoutThemeKey = keyof typeof AVAILABLE_LAYOUT_THEMES;

/**
 * Default Layout Theme
 */
export { DEFAULT_LAYOUT_THEME };

/**
 * Get Layout Theme by Key
 */
export const getLayoutTheme = (key: LayoutThemeKey): LayoutTheme => {
  return AVAILABLE_LAYOUT_THEMES[key] || AVAILABLE_LAYOUT_THEMES.default;
};

/**
 * Get All Available Layout Theme Keys
 */
export const getAvailableLayoutThemes = (): LayoutThemeKey[] => {
  return Object.keys(AVAILABLE_LAYOUT_THEMES) as LayoutThemeKey[];
};