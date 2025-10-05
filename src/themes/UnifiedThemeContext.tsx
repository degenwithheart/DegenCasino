// Unified Theme Context (Layout Themes + Color Schemes)
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GlobalColorScheme, ColorSchemeKey, globalColorSchemes, getStoredColorScheme, setStoredColorScheme } from './globalColorSchemes';
import { LayoutTheme, LayoutThemeKey, getLayoutTheme, getLayoutThemeWithMobileDetection, DEFAULT_LAYOUT_THEME, AVAILABLE_LAYOUT_THEMES } from './layouts';
import { ThemeResolver, createThemeResolver, ComponentCategory, ComponentName } from './themeResolver';
import { ColorSchemeProvider } from './ColorSchemeContext';
import { GlobalScrollStyles } from './GlobalScrollStyles';
import { ScrollConfig, defaultScrollConfig, getStoredScrollConfig, setStoredScrollConfig, applyScrollConfig, GameScrollConfigKey, applyGameScrollConfig, detectOptimalScrollConfig } from './scrollConfig';
import { initializeTheme, getStoredThemePreference, setStoredThemePreference, ThemePreference, resolveThemeFromPreference } from './mobileDetection';

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

  // Scroll Configuration
  scrollConfig: ScrollConfig;
  updateScrollConfig: (config: Partial<ScrollConfig>) => void;
  applyGameScrollConfig: (gameType: GameScrollConfigKey) => void;
  resetScrollConfig: () => void;
  detectOptimalScrollConfig: () => void;

  // Theme Resolver
  themeResolver: ThemeResolver;
  resolveComponent: <T extends Record<string, unknown> = any>(category: ComponentCategory, name: ComponentName) => React.ComponentType<T> | null;
}

/**
 * Default component registry - populated with actual default components
 */
const defaultComponentRegistry = {
  components: {
    Header: React.lazy(() => import('../sections/Header')),
    Footer: React.lazy(() => import('../sections/Footer')),
  },
  sections: {
    Game: React.lazy(() => import('../sections/Game/Game')),
    Header: React.lazy(() => import('../sections/Header')),
    Footer: React.lazy(() => import('../sections/Footer')),
    Dashboard: React.lazy(() => import('../sections/Dashboard/Dashboard')),
  },
  pages: {
    JackpotPage: React.lazy(() => import('../pages/features/JackpotPage')),
    BonusPage: React.lazy(() => import('../pages/features/BonusPage')),
    LeaderboardPage: React.lazy(() => import('../pages/features/LeaderboardPage')),
    SelectTokenPage: React.lazy(() => import('../pages/features/SelectTokenPage')),
  },
};/**
 * Theme Context
 */
const UnifiedThemeContext = createContext<UnifiedThemeContextType | null>(null);

/**
 * Get initial layout theme with mobile detection
 */
const getInitialLayoutTheme = (): LayoutThemeKey => {
  try {
    // Initialize theme with mobile detection
    const detectedTheme = initializeTheme();
    console.log('🎨 Initial theme detected:', detectedTheme);
    return detectedTheme as LayoutThemeKey;
  } catch (error) {
    console.warn('Failed to initialize theme with mobile detection:', error);
    // Fallback to stored theme or default, but still respect mobile detection
    const preference = getStoredThemePreference();
    const resolvedTheme = resolveThemeFromPreference(preference);
    console.log('🎨 Fallback theme resolved:', resolvedTheme);
    return resolvedTheme as LayoutThemeKey;
  }
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
    pages: Record<string, React.ComponentType<any>>;
  };
}

/**
 * Unified Theme Provider
 * Manages both layout themes and color schemes
 */
export const UnifiedThemeProvider: React.FC<UnifiedThemeProviderProps> = ({
  children,
  defaultComponentRegistry: providedRegistry = defaultComponentRegistry
}) => {
  // Layout Theme State
  const [layoutThemeKey, setLayoutThemeKey] = useState<LayoutThemeKey>(getInitialLayoutTheme);
  const [currentLayoutTheme, setCurrentLayoutTheme] = useState<LayoutTheme>(getLayoutTheme(layoutThemeKey));

  // Color Scheme State (existing)
  const [colorSchemeKey, setColorSchemeKey] = useState<ColorSchemeKey>(getStoredColorScheme);
  const [currentColorScheme, setCurrentColorScheme] = useState<GlobalColorScheme>(globalColorSchemes[colorSchemeKey]);

  // Scroll Configuration State
  const [scrollConfig, setScrollConfigState] = useState<ScrollConfig>(getStoredScrollConfig);

  // Theme Resolver
  const [themeResolver, setThemeResolver] = useState<ThemeResolver>(
    createThemeResolver(providedRegistry, currentLayoutTheme)
  );

  // Scroll Configuration Functions
  const updateScrollConfig = (config: Partial<ScrollConfig>) => {
    const newConfig = { ...scrollConfig, ...config };
    setScrollConfigState(newConfig);
    applyScrollConfig(newConfig);
    setStoredScrollConfig(newConfig);
  };

  const handleApplyGameScrollConfig = (gameType: GameScrollConfigKey) => {
    applyGameScrollConfig(gameType);
  };

  const handleResetScrollConfig = () => {
    setScrollConfigState(defaultScrollConfig);
    applyScrollConfig(defaultScrollConfig);
    setStoredScrollConfig(defaultScrollConfig);
  };

  const handleDetectOptimalScrollConfig = () => {
    const optimal = detectOptimalScrollConfig();
    const newConfig = { ...scrollConfig, ...optimal };
    setScrollConfigState(newConfig);
    applyScrollConfig(newConfig);
    setStoredScrollConfig(newConfig);
  };

  // Layout Theme Effects
  useEffect(() => {
    const newTheme = getLayoutThemeWithMobileDetection(layoutThemeKey);
    setCurrentLayoutTheme(newTheme);
    themeResolver.updateTheme(newTheme);
  }, [layoutThemeKey, themeResolver]);

  // Color Scheme Effects (existing)
  useEffect(() => {
    setCurrentColorScheme(globalColorSchemes[colorSchemeKey]);
  }, [colorSchemeKey]);

  // Apply scroll configuration on mount
  useEffect(() => {
    applyScrollConfig(scrollConfig);
  }, []);

  // Layout Theme Setter (with mobile detection preference tracking)
  const setLayoutTheme = (newThemeKey: LayoutThemeKey) => {
    // Store the user preference, but resolve actual theme with mobile detection
    const preference = getStoredThemePreference();
    setStoredThemePreference({
      ...preference,
      manual: true,
      theme: newThemeKey as any
    });
    setStoredLayoutTheme(newThemeKey);

    // Resolve the actual theme to apply (mobile detection may override)
    const resolvedTheme = resolveThemeFromPreference({
      manual: true,
      theme: newThemeKey as any
    });

    console.log('🎨 Theme selection - Requested:', newThemeKey, 'Resolved:', resolvedTheme);
    setLayoutThemeKey(resolvedTheme as LayoutThemeKey);
  };

  // Color Scheme Setter (existing)
  const setColorScheme = (newColorSchemeKey: ColorSchemeKey) => {
    setColorSchemeKey(newColorSchemeKey);
    setCurrentColorScheme(globalColorSchemes[newColorSchemeKey]);
    setStoredColorScheme(newColorSchemeKey);
  };

  // Component resolver function
  const resolveComponent = <T extends Record<string, unknown> = any>(category: ComponentCategory, name: ComponentName): React.ComponentType<T> | null => {
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

    // Scroll Configuration
    scrollConfig,
    updateScrollConfig,
    applyGameScrollConfig: handleApplyGameScrollConfig,
    resetScrollConfig: handleResetScrollConfig,
    detectOptimalScrollConfig: handleDetectOptimalScrollConfig,

    // Theme Resolver
    themeResolver,
    resolveComponent,
  };

  return (
    <UnifiedThemeContext.Provider value={value}>
      <GlobalScrollStyles colorScheme={currentColorScheme} />
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