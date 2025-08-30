import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GlobalTheme, ThemeKey, globalThemes, getStoredTheme, setStoredTheme } from './globalThemes';

interface ThemeContextType {
  currentTheme: GlobalTheme;
  themeKey: ThemeKey;
  setTheme: (themeKey: ThemeKey) => void;
  availableThemes: Record<ThemeKey, GlobalTheme>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeKey, setThemeKey] = useState<ThemeKey>(getStoredTheme);
  const [currentTheme, setCurrentTheme] = useState<GlobalTheme>(globalThemes[themeKey]);

  const setTheme = (newThemeKey: ThemeKey) => {
    setThemeKey(newThemeKey);
    setCurrentTheme(globalThemes[newThemeKey]);
    setStoredTheme(newThemeKey);
  };

  useEffect(() => {
    setCurrentTheme(globalThemes[themeKey]);
  }, [themeKey]);

  const value: ThemeContextType = {
    currentTheme,
    themeKey,
    setTheme,
    availableThemes: globalThemes,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Hook for getting theme-aware styled components
export const useThemeStyles = () => {
  const { currentTheme } = useTheme();

  return {
    // Common theme-aware styles
    container: `
      background: ${currentTheme.colors.background};
      border: 1px solid ${currentTheme.colors.border};
      border-radius: 12px;
      color: ${currentTheme.colors.text};
      transition: all 0.3s ease;

      &:hover {
        border-color: ${currentTheme.colors.primary};
        box-shadow: ${currentTheme.effects.glow};
        transform: translateY(-2px);
      }
    `,

    surface: `
      background: ${currentTheme.colors.surface};
      border: 1px solid ${currentTheme.colors.border};
      border-radius: 12px;
      color: ${currentTheme.colors.text};
    `,

    button: `
      background: linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary});
      color: ${currentTheme.colors.background};
      border: 2px solid ${currentTheme.colors.primary};
      border-radius: 12px;
      padding: 0.75rem 1.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: ${currentTheme.effects.shadow};

      &:hover {
        transform: translateY(-2px);
        box-shadow: ${currentTheme.effects.glow};
        border-color: ${currentTheme.colors.accent};
      }
    `,

    text: `
      color: ${currentTheme.colors.text};
    `,

    textSecondary: `
      color: ${currentTheme.colors.textSecondary};
    `,

    accent: `
      color: ${currentTheme.colors.primary};
      text-shadow: 0 0 8px ${currentTheme.colors.primary};
    `,
  };
};
