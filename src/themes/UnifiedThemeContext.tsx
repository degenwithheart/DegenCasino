// Unified Theme Context (Layout Themes + Color Schemes)
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GlobalColorScheme, ColorSchemeKey, globalColorSchemes, getStoredColorScheme, setStoredColorScheme } from './globalColorSchemes';
import { LayoutTheme, LayoutThemeKey, getLayoutTheme, DEFAULT_LAYOUT_THEME, AVAILABLE_LAYOUT_THEMES } from './layouts';
import { ThemeResolver, createThemeResolver, ComponentCategory, ComponentName } from './themeResolver';
import { ColorSchemeProvider } from './ColorSchemeContext';

/**
 * Storage keys for persistence
 */
const LAYOUT_THEME_STORAGE_KEY = 'selectedLayoutTheme';

/**
 * Unified Theme Context Type
 * Combines layout themes and color schemes
 */
interface UnifiedThemeContextType {
  // Layout Theme
  currentLayoutTheme: LayoutTheme;
  layoutThemeKey: LayoutThemeKey;
  setLayoutTheme: (themeKey: LayoutThemeKey) => void;
  availableLayoutThemes: Record<LayoutThemeKey, LayoutTheme>;
  
  // Color Scheme (existing)
  currentColorScheme: GlobalColorScheme;
  colorSchemeKey: ColorSchemeKey;
  setColorScheme: (colorSchemeKey: ColorSchemeKey) => void;
  availableColorSchemes: Record<ColorSchemeKey, GlobalColorScheme>;
  
  // Theme Resolver
  themeResolver: ThemeResolver;
  resolveComponent: <T = any>(category: ComponentCategory, name: ComponentName) => React.ComponentType<T> | null;
}

/**
 * Default component registry - populated with actual default components
 */
function createDefaultComponentRegistry() {
  return {
    components: {
      // Add default components here if needed
    },
    sections: {
      Header: React.lazy(() => import('../sections/Header')),
      Footer: React.lazy(() => import('../sections/Footer')),
      Dashboard: React.lazy(() => import('../sections/Dashboard/Dashboard')),
    },
  };
}/**
 * Theme Context
 */
const UnifiedThemeContext = createContext<UnifiedThemeContextType | null>(null);

/**
 * Get stored layout theme from localStorage
 */
const getStoredLayoutTheme = (): LayoutThemeKey => {
  try {
    const stored = localStorage.getItem(LAYOUT_THEME_STORAGE_KEY);
    if (stored && stored in AVAILABLE_LAYOUT_THEMES) {
      return stored as LayoutThemeKey;
    }
  } catch (error) {
    console.warn('Failed to load stored layout theme:', error);
  }
  return DEFAULT_LAYOUT_THEME;
};

/**
 * Set stored layout theme in localStorage
 */
const setStoredLayoutTheme = (themeKey: LayoutThemeKey): void => {
  try {
    localStorage.setItem(LAYOUT_THEME_STORAGE_KEY, themeKey);
  } catch (error) {
    console.warn('Failed to store layout theme:', error);
  }
};

/**
 * Unified Theme Provider Props
 */
interface UnifiedThemeProviderProps {
  children: ReactNode;
  defaultComponentRegistry?: {
    components: Record<string, React.ComponentType<any>>;
    sections: Record<string, React.ComponentType<any>>;
  };
}

/**
 * Unified Theme Provider
 * Manages both layout themes and color schemes
 */
export const UnifiedThemeProvider: React.FC<UnifiedThemeProviderProps> = ({ 
  children,
  defaultComponentRegistry = createDefaultComponentRegistry()
}) => {
  // Layout Theme State
  const [layoutThemeKey, setLayoutThemeKey] = useState<LayoutThemeKey>(getStoredLayoutTheme);
  const [currentLayoutTheme, setCurrentLayoutTheme] = useState<LayoutTheme>(getLayoutTheme(layoutThemeKey));
  
  // Color Scheme State (existing)
  const [colorSchemeKey, setColorSchemeKey] = useState<ColorSchemeKey>(getStoredColorScheme);
  const [currentColorScheme, setCurrentColorScheme] = useState<GlobalColorScheme>(globalColorSchemes[colorSchemeKey]);
  
  // Theme Resolver
  const [themeResolver, setThemeResolver] = useState<ThemeResolver>(
    createThemeResolver(defaultComponentRegistry, currentLayoutTheme)
  );

  // Layout Theme Effects
  useEffect(() => {
    const newTheme = getLayoutTheme(layoutThemeKey);
    setCurrentLayoutTheme(newTheme);
    themeResolver.updateTheme(newTheme);
  }, [layoutThemeKey, themeResolver]);

  // Color Scheme Effects (existing)
  useEffect(() => {
    setCurrentColorScheme(globalColorSchemes[colorSchemeKey]);
  }, [colorSchemeKey]);

  // Layout Theme Setter
  const setLayoutTheme = (newThemeKey: LayoutThemeKey) => {
    setLayoutThemeKey(newThemeKey);
    setStoredLayoutTheme(newThemeKey);
  };

  // Color Scheme Setter (existing)
  const setColorScheme = (newColorSchemeKey: ColorSchemeKey) => {
    setColorSchemeKey(newColorSchemeKey);
    setCurrentColorScheme(globalColorSchemes[newColorSchemeKey]);
    setStoredColorScheme(newColorSchemeKey);
  };

  // Component resolver function
  const resolveComponent = <T = any>(category: ComponentCategory, name: ComponentName): React.ComponentType<T> | null => {
    return themeResolver.resolveComponent<T>(category, name);
  };

  const value: UnifiedThemeContextType = {
    // Layout Theme
    currentLayoutTheme,
    layoutThemeKey,
    setLayoutTheme,
    availableLayoutThemes: AVAILABLE_LAYOUT_THEMES,
    
    // Color Scheme
    currentColorScheme,
    colorSchemeKey,
    setColorScheme,
    availableColorSchemes: globalColorSchemes,
    
    // Theme Resolver
    themeResolver,
    resolveComponent,
  };

  return (
    <UnifiedThemeContext.Provider value={value}>
      <ColorSchemeProvider>
        {children}
      </ColorSchemeProvider>
    </UnifiedThemeContext.Provider>
  );
};

/**
 * Hook to use unified theme context
 */
export const useTheme = (): UnifiedThemeContextType => {
  const context = useContext(UnifiedThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within UnifiedThemeProvider');
  }
  return context;
};

/**
 * Hook to use color scheme (backward compatibility)
 */
export const useColorScheme = () => {
  const { currentColorScheme, colorSchemeKey, setColorScheme, availableColorSchemes } = useTheme();
  return { currentColorScheme, colorSchemeKey, setColorScheme, availableThemes: availableColorSchemes };
};

/**
 * Hook to use layout theme
 */
export const useLayoutTheme = () => {
  const { currentLayoutTheme, layoutThemeKey, setLayoutTheme, availableLayoutThemes, resolveComponent } = useTheme();
  return { currentLayoutTheme, layoutThemeKey, setLayoutTheme, availableLayoutThemes, resolveComponent };
};