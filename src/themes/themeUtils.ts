import { GlobalColorScheme } from './globalColorSchemes';

/**
 * Utility functions for colorScheme management and styling
 */

/**
 * Get a colorScheme value with fallback
 */
export const getColorSchemeValue = (
  colorScheme: GlobalColorScheme,
  path: string,
  fallback?: any
): any => {
  const keys = path.split('.');
  let value: any = colorScheme;

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
 * Get color from colorScheme with opacity support
 */
export const getColorSchemeColor = (
  colorScheme: GlobalColorScheme,
  colorKey: string,
  opacity?: number
): string => {
  const color = getColorSchemeValue(colorScheme, `colors.${colorKey}`);
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
 * Get typography styles from colorScheme
 */
export const getTypography = (
  colorScheme: GlobalColorScheme,
  variant: 'fontFamily' | 'headingColor' | 'bodyColor'
) => {
  return getColorSchemeValue(colorScheme, `typography.${variant}`, {});
};

/**
 * Get animation styles from colorScheme
 */
export const getAnimation = (
  colorScheme: GlobalColorScheme,
  animationKey: string
) => {
  return getColorSchemeValue(colorScheme, `animations.${animationKey}`, {});
};

/**
 * Get effect styles from colorScheme
 */
export const getEffect = (
  colorScheme: GlobalColorScheme,
  effectKey: string
) => {
  return getColorSchemeValue(colorScheme, `effects.${effectKey}`, {});
};

/**
 * Get pattern styles from colorScheme
 */
export const getPattern = (
  colorScheme: GlobalColorScheme,
  patternKey: string
) => {
  return getColorSchemeValue(colorScheme, `patterns.${patternKey}`, {});
};

/**
 * Create a themed CSS custom property
 */
export const createThemeVariable = (
  property: string,
  value: string
): string => {
  return `--colorScheme-${property}: ${value};`;
};

/**
 * Get all colorScheme CSS custom properties
 */
export const getColorSchemeVariables = (colorScheme: GlobalColorScheme): string => {
  const variables: string[] = [];

  // Colors
  Object.entries(colorScheme.colors).forEach(([key, value]) => {
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
  Object.entries(colorScheme.effects).forEach(([key, value]) => {
    if (typeof value === 'string') {
      variables.push(createThemeVariable(`effect-${key}`, value));
    }
  });

  // Patterns
  Object.entries(colorScheme.patterns).forEach(([key, value]) => {
    if (typeof value === 'string') {
      variables.push(createThemeVariable(`pattern-${key}`, value));
    }
  });

  // Typography
  Object.entries(colorScheme.typography).forEach(([key, value]) => {
    if (typeof value === 'string') {
      variables.push(createThemeVariable(`typography-${key}`, value));
    }
  });

  return variables.join('\n');
};

/**
 * Apply colorScheme to CSS variables
 */
export const applyColorSchemeVariables = (colorScheme: GlobalColorScheme): void => {
  const root = document.documentElement;
  const variables = getColorSchemeVariables(colorScheme);

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
export const createColorSchemeTransition = (
  colorScheme: GlobalColorScheme,
  properties: string[] = ['color', 'background-color', 'border-color']
): string => {
  const duration = getColorSchemeValue(colorScheme, 'animations.duration', '0.3s');
  const easing = getColorSchemeValue(colorScheme, 'animations.easing', 'ease-in-out');

  return properties
    .map(prop => `${prop} ${duration} ${easing}`)
    .join(', ');
};

/**
 * Responsive colorScheme value utility
 */
export const getResponsiveValue = (
  colorScheme: GlobalColorScheme,
  baseValue: any,
  breakpoints?: { mobile?: any; tablet?: any; desktop?: any }
): any => {
  if (!breakpoints) return baseValue;

  // This would be expanded based on actual responsive needs
  // For now, return base value
  return baseValue;
};