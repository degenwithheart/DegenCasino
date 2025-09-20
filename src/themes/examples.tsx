// Theme Infrastructure Demo & Usage Examples
// This file shows how to use the new theme system

import React from 'react';
import { 
  useTheme, 
  useLayoutTheme, 
  useColorScheme,
  useThemedComponent,
  createThemedComponent,
  ThemedComponent 
} from './index';

/**
 * EXAMPLE 1: Using the unified theme hook
 */
export const ExampleUnifiedTheme: React.FC = () => {
  const { 
    currentLayoutTheme, 
    currentColorScheme, 
    setLayoutTheme, 
    setColorScheme,
    resolveComponent
  } = useTheme();

  // Access current theme info
  console.log('Current Layout Theme:', currentLayoutTheme.name);
  console.log('Current Color Scheme:', currentColorScheme.name);

  // Change themes
  const handleLayoutChange = () => setLayoutTheme('degenheart');
  const handleColorChange = () => setColorScheme('cyberpunk');

  // Resolve components
  const CustomHeader = resolveComponent('components', 'Header');

  return (
    <div>
      <h3>Current Theme: {currentLayoutTheme.name}</h3>
      <h3>Current Colors: {currentColorScheme.name}</h3>
      <button onClick={handleLayoutChange}>Switch to Holy Grail Layout</button>
      <button onClick={handleColorChange}>Switch to Cyberpunk Colors</button>
      {CustomHeader && <CustomHeader />}
    </div>
  );
};

/**
 * EXAMPLE 2: Using layout theme hook specifically
 */
export const ExampleLayoutTheme: React.FC = () => {
  const { currentLayoutTheme, setLayoutTheme, resolveComponent } = useLayoutTheme();

  // Get theme-specific component
  const ThemedHeader = resolveComponent('components', 'Header');
  const ThemedFooter = resolveComponent('components', 'Footer');

  return (
    <div>
      <h3>Layout: {currentLayoutTheme.name}</h3>
      {ThemedHeader && <ThemedHeader />}
      <main>Content goes here</main>
      {ThemedFooter && <ThemedFooter />}
    </div>
  );
};

/**
 * EXAMPLE 3: Using themed component hook
 */
export const ExampleThemedComponent: React.FC = () => {
  const HeaderComponent = useThemedComponent('components', 'Header');
  const SidebarComponent = useThemedComponent('components', 'Sidebar');

  return (
    <div>
      {HeaderComponent && <HeaderComponent />}
      {SidebarComponent && <SidebarComponent />}
    </div>
  );
};

/**
 * EXAMPLE 4: Using ThemedComponent wrapper
 */
export const ExampleThemedWrapper: React.FC = () => {
  return (
    <div>
      <ThemedComponent 
        category="components" 
        name="Header" 
        props={{ title: "My Casino" }}
      />
      <ThemedComponent 
        category="sections" 
        name="Dashboard" 
        props={{ user: "John Doe" }}
      />
    </div>
  );
};

/**
 * EXAMPLE 5: Creating a theme-aware component
 */
// Default Header component
const DefaultHeader: React.FC<{ title?: string }> = ({ title = "DegenHeart Casino" }) => (
  <header style={{ background: 'blue', color: 'white', padding: '1rem' }}>
    <h1>{title}</h1>
  </header>
);

// Create themed version that automatically uses override if available
const ThemedHeader = createThemedComponent('components', 'Header', DefaultHeader);

export const ExampleThemedFactory: React.FC = () => {
  return (
    <div>
      <ThemedHeader title="Theme-Aware Header" />
    </div>
  );
};

/**
 * EXAMPLE 6: Backward compatibility with color schemes
 */
export const ExampleBackwardCompatibility: React.FC = () => {
  const { currentColorScheme, setColorScheme } = useColorScheme();

  return (
    <div>
      <h3>Color Scheme: {currentColorScheme.name}</h3>
      <button onClick={() => setColorScheme('retro')}>
        Switch to Retro Colors
      </button>
    </div>
  );
};

/**
 * MIGRATION GUIDE:
 * 
 * OLD WAY (Color Schemes Only):
 * ```tsx
 * import { useColorScheme } from '../themes/ColorSchemeContext';
 * const { currentColorScheme, setColorScheme } = useColorScheme();
 * ```
 * 
 * NEW WAY (Unified Themes):
 * ```tsx
 * import { useTheme, useColorScheme } from '../themes';
 * 
 * // For everything:
 * const { currentLayoutTheme, currentColorScheme, setLayoutTheme, setColorScheme } = useTheme();
 * 
 * // For just color schemes (backward compatible):
 * const { currentColorScheme, setColorScheme } = useColorScheme();
 * 
 * // For just layout themes:
 * const { currentLayoutTheme, setLayoutTheme, resolveComponent } = useLayoutTheme();
 * ```
 * 
 * CREATING THEMED COMPONENTS:
 * 1. Create your override in: src/themes/layouts/theme-name/components/ComponentName.tsx
 * 2. Use resolveComponent() or ThemedComponent to automatically get themed version
 * 3. Fallback to default component if no themed version exists
 */