import React from 'react';

export interface ThemeLayoutConfig {
  id: string;
  usesCustomLayout: boolean;
  layoutComponent?: () => Promise<{ default: React.ComponentType<{ children: React.ReactNode }> }>;
  modalComponent?: () => Promise<{ default: React.ComponentType<any> }>;
  description?: string;
  folderName?: string; // Optional: if different from id
}

/**
 * Helper function to create layout component import path
 */
function createLayoutImport(themeId: string, folderName?: string) {
  const folder = folderName || themeId;
  const layoutName = themeId.charAt(0).toUpperCase() + themeId.slice(1) + 'Layout';
  return () => import(`./layouts/${folder}/${layoutName}`);
}

/**
 * Helper function to create modal component import path
 */
function createModalImport(themeId: string, folderName?: string) {
  const folder = folderName || themeId;
  return () => import(`./layouts/${folder}/components/Modal`).then((m: any) => ({ default: m.Modal }));
}

/**
 * Base theme configurations - only define the default theme here
 * Other themes should register themselves using registerTheme()
 */
export const themeConfigs: Record<string, ThemeLayoutConfig> = {
  default: {
    id: 'default',
    usesCustomLayout: false,
    description: 'Default theme with header/sidebar/footer layout'
  }
};

/**
 * Get theme configuration by theme ID
 * Falls back to default theme if theme not found
 */
export function getThemeConfig(themeId: string): ThemeLayoutConfig {
  return themeConfigs[themeId] || themeConfigs.default;
}

/**
 * Check if a theme uses a custom layout wrapper
 */
export function themeUsesCustomLayout(themeId: string): boolean {
  return getThemeConfig(themeId).usesCustomLayout;
}

/**
 * Dynamically load a theme's layout component
 */
export async function loadThemeLayout(themeId: string): Promise<React.ComponentType<{ children: React.ReactNode }> | null> {
  const config = getThemeConfig(themeId);
  if (!config.layoutComponent) return null;
  
  try {
    const module = await config.layoutComponent();
    return module.default;
  } catch (error) {
    console.warn(`Failed to load layout for theme ${themeId}:`, error);
    return null;
  }
}

/**
 * Dynamically load a theme's modal component
 */
export async function loadThemeModal(themeId: string): Promise<React.ComponentType<any> | null> {
  const config = getThemeConfig(themeId);
  if (!config.modalComponent) return null;
  
  try {
    const module = await config.modalComponent();
    return module.default;
  } catch (error) {
    console.warn(`Failed to load modal for theme ${themeId}:`, error);
    return null;
  }
}

/**
 * Helper function to quickly register a new theme with standard conventions
 * @param themeId - The theme identifier (also used as folder name unless folderName is specified)
 * @param options - Optional configuration overrides
 */
export function registerTheme(themeId: string, options: Partial<ThemeLayoutConfig> = {}): ThemeLayoutConfig {
  const config: ThemeLayoutConfig = {
    id: themeId,
    usesCustomLayout: true,
    layoutComponent: createLayoutImport(themeId, options.folderName),
    modalComponent: createModalImport(themeId, options.folderName),
    description: `${themeId.charAt(0).toUpperCase() + themeId.slice(1)} theme`,
    ...options
  };
  
  // Automatically add to themeConfigs
  themeConfigs[themeId] = config;
  
  return config;
}

/**
 * Helper function to register a simple theme that only needs custom styling (no custom layout)
 */
export function registerSimpleTheme(themeId: string, description?: string): ThemeLayoutConfig {
  const config: ThemeLayoutConfig = {
    id: themeId,
    usesCustomLayout: false,
    description: description || `${themeId.charAt(0).toUpperCase() + themeId.slice(1)} theme`
  };
  
  themeConfigs[themeId] = config;
  return config;
}