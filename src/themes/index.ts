// Central Theme System Exports
// This file exports the complete theme infrastructure

// Layout Theme System
export * from './layouts';
export * from './themeResolver';
export * from './themedComponents';

// Unified Theme Context (Layout + Color Schemes)
export * from './UnifiedThemeContext';

// Color Schemes (existing)
export * from './globalColorSchemes';
export * from './ColorSchemeContext';

// Theme Utils (with explicit exports to avoid conflicts)
export { 
  createColorSchemeTransition,
  applyColorSchemeVariables,
  getColorSchemeVariables as getThemeVariables,
  getColorSchemeColor
} from './themeUtils';

// Re-export for backward compatibility
export { useColorScheme, useTheme as useUnifiedTheme } from './UnifiedThemeContext';