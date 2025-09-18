// Theme Component Resolver
import React from 'react';
import { LayoutTheme, LayoutThemeKey } from './layouts';

/**
 * Component Type Definitions
 */
export type ComponentCategory = 'components' | 'sections';
export type ComponentName = string;

/**
 * Default Component Registry
 * Maps component names to their default implementations
 */
interface DefaultComponentRegistry {
  components: Record<string, React.ComponentType<any>>;
  sections: Record<string, React.ComponentType<any>>;
}

/**
 * Theme Resolver Class
 * Handles the logic for resolving themed components with fallbacks
 */
export class ThemeResolver {
  private defaultComponents: DefaultComponentRegistry;
  private currentTheme: LayoutTheme;

  constructor(defaultComponents: DefaultComponentRegistry, theme: LayoutTheme) {
    this.defaultComponents = defaultComponents;
    this.currentTheme = theme;
  }

  /**
   * Resolve a component - returns themed version or default fallback
   */
  resolveComponent<T = any>(
    category: ComponentCategory,
    componentName: ComponentName
  ): React.ComponentType<T> | null {
    // Try to get themed override first
    const themeCategory = this.currentTheme[category];
    if (themeCategory && componentName in themeCategory) {
      const themedComponent = (themeCategory as any)[componentName];
      if (themedComponent) {
        return themedComponent;
      }
    }

    // Fallback to default component
    const defaultComponent = this.defaultComponents[category][componentName];
    if (defaultComponent) {
      return defaultComponent;
    }

    // Component not found
    console.warn(`Component not found: ${category}/${componentName}`);
    return null;
  }

  /**
   * Get theme configuration
   */
  getThemeConfig() {
    return this.currentTheme.config || {};
  }

  /**
   * Check if component has themed override
   */
  hasThemedOverride(category: ComponentCategory, componentName: ComponentName): boolean {
    const themeCategory = this.currentTheme[category];
    return !!(themeCategory && componentName in themeCategory && (themeCategory as any)[componentName]);
  }

  /**
   * Update current theme
   */
  updateTheme(theme: LayoutTheme) {
    this.currentTheme = theme;
  }
}

/**
 * Create Theme Resolver Instance
 */
export const createThemeResolver = (
  defaultComponents: DefaultComponentRegistry,
  theme: LayoutTheme
): ThemeResolver => {
  return new ThemeResolver(defaultComponents, theme);
};