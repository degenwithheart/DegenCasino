/**
 * Theme Auto-Discovery System
 * Automatically detects and registers themes based on folder structure
 */

import { registerTheme, ThemeLayoutConfig } from './themeConfig';

/**
 * Attempts to auto-register a theme by trying to import its components
 * This is useful for dynamic theme discovery
 */
export async function tryAutoRegisterTheme(themeId: string, options: Partial<ThemeLayoutConfig> = {}): Promise<boolean> {
  try {
    // Try to dynamically import the theme's layout component
    const layoutName = themeId.charAt(0).toUpperCase() + themeId.slice(1) + 'Layout';
    const layoutPath = `./layouts/${themeId}/${layoutName}`;
    
    // Test if the layout component exists
    await import(layoutPath);
    
    // If successful, register the theme
    registerTheme(themeId, options);
    
    console.log(`✅ Auto-registered theme: ${themeId}`);
    return true;
  } catch (error) {
    console.warn(`❌ Failed to auto-register theme ${themeId}:`, error);
    return false;
  }
}

/**
 * Batch auto-register multiple themes
 */
export async function autoRegisterThemes(themeIds: string[]): Promise<string[]> {
  const successfullyRegistered: string[] = [];
  
  for (const themeId of themeIds) {
    const success = await tryAutoRegisterTheme(themeId);
    if (success) {
      successfullyRegistered.push(themeId);
    }
  }
  
  return successfullyRegistered;
}

/**
 * Get a list of all currently registered themes
 */
export function getRegisteredThemes(): string[] {
  // This would need to be imported from themeConfig
  // Return theme IDs that are currently registered
  return Object.keys(require('./themeConfig').themeConfigs);
}

/**
 * Check if a theme is available/registered
 */
export function isThemeAvailable(themeId: string): boolean {
  const configs = require('./themeConfig').themeConfigs;
  return themeId in configs;
}