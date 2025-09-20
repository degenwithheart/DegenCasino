// Central Theme System Exports
// This file exports the complete theme infrastructure

// Theme Registration (import to auto-register themes)
import './layouts/degenheart/themeRegistration';

// Layout Theme System
export * from './layouts';
export * from './themeResolver';
export * from './themedComponents';
export * from './themeConfig';

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