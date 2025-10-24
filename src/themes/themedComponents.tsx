// Themed Component Hook and HOC
import React from 'react';
import { useTheme } from './UnifiedThemeContext';
import { ComponentCategory, ComponentName } from './themeResolver';

/**
 * Hook to get a themed component
 * Returns the themed version if available, fallback to default
 */
export const useThemedComponent = <T extends Record<string, unknown> = Record<string, unknown>>(
  category: ComponentCategory,
  componentName: ComponentName
): React.ComponentType<T> | null => {
  const { resolveComponent } = useTheme();
  return resolveComponent<T>(category, componentName);
};

/**
 * Higher-Order Component for themed components
 * Wraps a component to automatically use themed version if available
 */
export const withThemedComponent = <P extends Record<string, unknown>>(
  category: ComponentCategory,
  componentName: ComponentName
) => {
  return React.forwardRef<any, P>((props, ref) => {
    const ThemedComponent = useThemedComponent<P>(category, componentName);

    if (!ThemedComponent) {
      console.error(`No themed component found for ${category}/${componentName} - project is theme-reliant`);
      return null;
    }

    return <ThemedComponent {...(props as P)} ref={ref} />;
  });
};/**
 * Themed Component Wrapper
 * A component that automatically resolves to themed version
 */
interface ThemedComponentProps {
  category: ComponentCategory;
  name: ComponentName;
  props?: Record<string, unknown>;
}

export const ThemedComponent: React.FC<ThemedComponentProps> = ({
  category,
  name,
  props = {}
}) => {
  const Component = useThemedComponent(category, name);

  if (!Component) {
    console.error(`No themed component found for ${category}/${name} - project is theme-reliant`);
    return null;
  }

  return <Component {...props} />;
};

/**
 * Theme-aware component factory
 * Creates a component that automatically uses themed versions
 */
export const createThemedComponent = <P extends Record<string, unknown>>(
  category: ComponentCategory,
  componentName: ComponentName
) => {
  const ThemedWrapper = React.forwardRef<any, P>((props, ref) => {
    const ThemedComponent = useThemedComponent<P>(category, componentName);

    if (!ThemedComponent) {
      console.error(`No themed component found for ${category}/${componentName} - project is theme-reliant`);
      return null;
    }

    return <ThemedComponent {...(props as P)} ref={ref} />;
  });

  ThemedWrapper.displayName = `Themed${componentName}`;
  return ThemedWrapper;
};