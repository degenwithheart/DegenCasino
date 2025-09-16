import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GlobalColorScheme, ColorSchemeKey, globalColorSchemes, getStoredColorScheme, setStoredColorScheme } from './globalColorSchemes';

interface ColorSchemeContextType {
  currentColorScheme: GlobalColorScheme;
  colorSchemeKey: ColorSchemeKey;
  setColorScheme: (colorSchemeKey: ColorSchemeKey) => void;
  availableThemes: Record<ColorSchemeKey, GlobalColorScheme>;
}

const ColorSchemeContext = createContext<ColorSchemeContextType | undefined>(undefined);

interface ColorSchemeProviderProps {
  children: ReactNode;
}

export const ColorSchemeProvider: React.FC<ColorSchemeProviderProps> = ({ children }) => {
  const [colorSchemeKey, setColorSchemeKey] = useState<ColorSchemeKey>(getStoredColorScheme);
  const [currentColorScheme, setCurrentColorScheme] = useState<GlobalColorScheme>(globalColorSchemes[colorSchemeKey]);

  const setColorScheme = (newColorSchemeKey: ColorSchemeKey) => {
    setColorSchemeKey(newColorSchemeKey);
    setCurrentColorScheme(globalColorSchemes[newColorSchemeKey]);
    setStoredColorScheme(newColorSchemeKey);
  };

  useEffect(() => {
    setCurrentColorScheme(globalColorSchemes[colorSchemeKey]);
  }, [colorSchemeKey]);

  const value: ColorSchemeContextType = {
    currentColorScheme,
    colorSchemeKey,
    setColorScheme,
    availableThemes: globalColorSchemes,
  };

  return (
    <ColorSchemeContext.Provider value={value}>
      {children}
    </ColorSchemeContext.Provider>
  );
};

export const useColorScheme = (): ColorSchemeContextType => {
  const context = useContext(ColorSchemeContext);
  if (context === undefined) {
    throw new Error('useColorScheme must be used within a ColorSchemeProvider');
  }
  return context;
};

// Hook for getting colorScheme-aware styled components
export const useColorSchemeStyles = () => {
  const { currentColorScheme } = useColorScheme();

  return {
    // Common colorScheme-aware styles
    container: `
      background: ${currentColorScheme.colors.background};
      border: 1px solid ${currentColorScheme.colors.border};
      border-radius: 12px;
      color: ${currentColorScheme.colors.text};
      transition: all 0.3s ease;

      &:hover {
        border-color: ${currentColorScheme.colors.primary};
        box-shadow: ${currentColorScheme.effects.glow};
        transform: translateY(-2px);
      }
    `,

    surface: `
      background: ${currentColorScheme.colors.surface};
      border: 1px solid ${currentColorScheme.colors.border};
      border-radius: 12px;
      color: ${currentColorScheme.colors.text};
    `,

    button: `
      background: linear-gradient(135deg, ${currentColorScheme.colors.primary}, ${currentColorScheme.colors.secondary});
      color: ${currentColorScheme.colors.background};
      border: 2px solid ${currentColorScheme.colors.primary};
      border-radius: 12px;
      padding: 0.75rem 1.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: ${currentColorScheme.effects.shadow};

      &:hover {
        transform: translateY(-2px);
        box-shadow: ${currentColorScheme.effects.glow};
        border-color: ${currentColorScheme.colors.accent};
      }
    `,

    text: `
      color: ${currentColorScheme.colors.text};
    `,

    textSecondary: `
      color: ${currentColorScheme.colors.textSecondary};
    `,

    accent: `
      color: ${currentColorScheme.colors.primary};
      text-shadow: 0 0 8px ${currentColorScheme.colors.primary};
    `,
  };
};
