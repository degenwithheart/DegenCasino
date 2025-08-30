import { GlobalTheme } from './globalThemes';

/**
 * Utility functions for theme management and styling
 */

/**
 * Get a theme value with fallback
 */
export const getThemeValue = (
  theme: GlobalTheme,
  path: string,
  fallback?: any
): any => {
  const keys = path.split('.');
  let value: any = theme;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = (value as any)[key];
    } else {
      return fallback;
    }
  }

  return value;
};

/**
 * Get color from theme with opacity support
 */
export const getThemeColor = (
  theme: GlobalTheme,
  colorKey: string,
  opacity?: number
): string => {
  const color = getThemeValue(theme, `colors.${colorKey}`);
  if (!color) return '#000000';

  if (opacity !== undefined && opacity < 1) {
    // Convert hex to rgba if opacity is provided
    if (color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
  }

  return color;
};

/**
 * Get typography styles from theme
 */
export const getTypography = (
  theme: GlobalTheme,
  variant: 'fontFamily' | 'headingColor' | 'bodyColor'
) => {
  return getThemeValue(theme, `typography.${variant}`, {});
};

/**
 * Get animation styles from theme
 */
export const getAnimation = (
  theme: GlobalTheme,
  animationKey: string
) => {
  return getThemeValue(theme, `animations.${animationKey}`, {});
};

/**
 * Get effect styles from theme
 */
export const getEffect = (
  theme: GlobalTheme,
  effectKey: string
) => {
  return getThemeValue(theme, `effects.${effectKey}`, {});
};

/**
 * Get pattern styles from theme
 */
export const getPattern = (
  theme: GlobalTheme,
  patternKey: string
) => {
  return getThemeValue(theme, `patterns.${patternKey}`, {});
};

/**
 * Create a themed CSS custom property
 */
export const createThemeVariable = (
  property: string,
  value: string
): string => {
  return `--theme-${property}: ${value};`;
};

/**
 * Get all theme CSS custom properties
 */
export const getThemeVariables = (theme: GlobalTheme): string => {
  const variables: string[] = [];

  // Colors
  Object.entries(theme.colors).forEach(([key, value]) => {
    if (typeof value === 'string') {
      variables.push(createThemeVariable(`color-${key}`, value));
    } else if (typeof value === 'object' && value !== null) {
      // Handle nested color objects like button, input, card, modal
      Object.entries(value as Record<string, string>).forEach(([subKey, subValue]) => {
        if (typeof subValue === 'string') {
          variables.push(createThemeVariable(`${key}-${subKey}`, subValue));
        }
      });
    }
  });

  // Effects
  Object.entries(theme.effects).forEach(([key, value]) => {
    if (typeof value === 'string') {
      variables.push(createThemeVariable(`effect-${key}`, value));
    }
  });

  // Patterns
  Object.entries(theme.patterns).forEach(([key, value]) => {
    if (typeof value === 'string') {
      variables.push(createThemeVariable(`pattern-${key}`, value));
    }
  });

  // Typography
  Object.entries(theme.typography).forEach(([key, value]) => {
    if (typeof value === 'string') {
      variables.push(createThemeVariable(`typography-${key}`, value));
    }
  });

  return variables.join('\n');
};

/**
 * Apply theme to CSS variables
 */
export const applyThemeVariables = (theme: GlobalTheme): void => {
  const root = document.documentElement;
  const variables = getThemeVariables(theme);

  // Apply each variable
  variables.split('\n').forEach(variable => {
    const [property, value] = variable.split(': ');
    if (property && value) {
      root.style.setProperty(property.trim(), value.trim().replace(';', ''));
    }
  });
};

/**
 * Theme transition utility
 */
export const createThemeTransition = (
  theme: GlobalTheme,
  properties: string[] = ['color', 'background-color', 'border-color']
): string => {
  const duration = getThemeValue(theme, 'animations.duration', '0.3s');
  const easing = getThemeValue(theme, 'animations.easing', 'ease-in-out');

  return properties
    .map(prop => `${prop} ${duration} ${easing}`)
    .join(', ');
};

/**
 * Responsive theme value utility
 */
export const getResponsiveValue = (
  theme: GlobalTheme,
  baseValue: any,
  breakpoints?: { mobile?: any; tablet?: any; desktop?: any }
): any => {
  if (!breakpoints) return baseValue;

  // This would be expanded based on actual responsive needs
  // For now, return base value
  return baseValue;
};