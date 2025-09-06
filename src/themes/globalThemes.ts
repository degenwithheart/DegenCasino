import { keyframes } from 'styled-components';

// Base animations that can be used across themes
export const neonPulse = keyframes`
  0% {
    box-shadow: 0 0 24px #a259ff88, 0 0 48px #ffd70044;
    border-color: #ffd70044;
  }
  100% {
    box-shadow: 0 0 48px #ffd700cc, 0 0 96px #a259ff88;
    border-color: #ffd700aa;
  }
`;

export const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: rotate(0deg) scale(0.8); }
  50% { opacity: 1; transform: rotate(180deg) scale(1.2); }
`;

export const moveGradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

export const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

export const typing = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

export const blink = keyframes`
  0%, 50% { border-color: transparent; }
  51%, 100% { border-color: currentColor; }
`;

export const hologram = keyframes`
  0% { opacity: 0.8; transform: translateZ(0); }
  50% { opacity: 1; transform: translateZ(20px); }
  100% { opacity: 0.8; transform: translateZ(0); }
`;

export const carnival = keyframes`
  0% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(5deg) scale(1.05); }
  50% { transform: rotate(-5deg) scale(1.1); }
  75% { transform: rotate(3deg) scale(1.05); }
  100% { transform: rotate(0deg) scale(1); }
`;

export const spaceFloat = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-5px) rotate(1deg); }
  66% { transform: translateY(5px) rotate(-1deg); }
`;

export const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.4), 0 0 40px rgba(162, 89, 255, 0.2);
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.6), 0 0 60px rgba(162, 89, 255, 0.4);
  }
`;

export const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

export const bounceIn = keyframes`
  0% { transform: scale(0.3); opacity: 0; }
  50% { transform: scale(1.05); }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); opacity: 1; }
`;

export const slideInUp = keyframes`
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

export const fadeInScale = keyframes`
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
`;

export const retroFlicker = keyframes`
  0%, 100% { opacity: 1; }
  2% { opacity: 0.8; }
  4% { opacity: 1; }
  6% { opacity: 0.9; }
  8% { opacity: 1; }
  10% { opacity: 0.85; }
  12% { opacity: 1; }
`;

// Theme type definitions
export interface GlobalTheme {
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    border: string;
    text: string;
    textSecondary: string;
    success: string;
    error: string;
    warning: string;
    info: string;
    shadow: string;
    // UI Element Colors
    button: {
      primary: string;
      secondary: string;
      hover: string;
      active: string;
      disabled: string;
    };
    input: {
      background: string;
      border: string;
      focus: string;
      placeholder: string;
    };
    card: {
      background: string;
      border: string;
      hover: string;
    };
    modal: {
      background: string;
      overlay: string;
    };
  };
  effects: {
    glow: string;
    shadow: string;
    borderGlow: string;
    textGlow: string;
    buttonGlow: string;
  };
  animations: {
    primary: any;
    secondary: any;
    accent: any;
    hover: any;
    loading: any;
  };
  patterns: {
    background: string;
    overlay: string;
    gradient: string;
  };
  typography: {
    fontFamily: string;
    headingColor: string;
    bodyColor: string;
  };
}

// Default Theme (Current Dashboard Styling)
export const defaultTheme: GlobalTheme = {
  name: 'Classic Casino',
  description: 'The timeless casino experience with gold accents',
  colors: {
    primary: '#ffd700',
    secondary: '#a259ff',
    accent: '#ff9500',
    background: '#0f0f23',
    surface: '#1a1a2e',
    border: '#2a2a4a',
    text: '#ffffff',
    textSecondary: '#c0c0c0',
    success: '#00ff88',
    error: '#ff4757',
    warning: '#ffa502',
    info: '#3742fa',
    shadow: 'rgba(0, 0, 0, 0.3)',
    button: {
      primary: '#ffd700',
      secondary: '#a259ff',
      hover: '#ffed4e',
      active: '#f1c40f',
      disabled: '#34495e',
    },
    input: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: 'rgba(255, 215, 0, 0.3)',
      focus: 'rgba(255, 215, 0, 0.6)',
      placeholder: 'rgba(255, 255, 255, 0.5)',
    },
    card: {
      background: 'rgba(24, 24, 24, 0.8)',
      border: 'rgba(255, 215, 0, 0.2)',
      hover: 'rgba(255, 215, 0, 0.1)',
    },
    modal: {
      background: 'rgba(24, 24, 24, 0.95)',
      overlay: 'rgba(0, 0, 0, 0.7)',
    },
  },
  effects: {
    glow: '0 0 24px rgba(255, 215, 0, 0.2)',
    shadow: '0 4px 24px rgba(0, 0, 0, 0.2)',
    borderGlow: '0 0 12px rgba(255, 215, 0, 0.3)',
    textGlow: '0 0 8px rgba(255, 215, 0, 0.5)',
    buttonGlow: '0 0 16px rgba(255, 215, 0, 0.4)',
  },
  animations: {
    primary: neonPulse,
    secondary: sparkle,
    accent: moveGradient,
    hover: float,
    loading: blink,
  },
  patterns: {
    background: 'radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(162, 89, 255, 0.05) 0%, transparent 50%)',
    overlay: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 149, 0, 0.05))',
    gradient: 'linear-gradient(135deg, #ffd700 0%, #a259ff 50%, #ff9500 100%)',
  },
  typography: {
    fontFamily: "'Luckiest Guy', cursive, sans-serif",
    headingColor: '#ffd700',
    bodyColor: '#ffffff',
  },
};

// Cyberpunk Neon Grid Theme
export const cyberpunkTheme: GlobalTheme = {
  name: 'Cyberpunk Neon',
  description: 'Futuristic terminal interface with holographic elements',
  colors: {
    primary: '#00ff88',
    secondary: '#ff0080',
    accent: '#0088ff',
    background: '#0a0a0a',
    surface: '#1a0a1a',
    border: '#00ff88',
    text: '#00ff88',
    textSecondary: '#ffffff',
    success: '#00ff88',
    error: '#ff0040',
    warning: '#ffaa00',
    info: '#0088ff',
    shadow: 'rgba(0, 255, 136, 0.3)',
    button: {
      primary: '#00ff88',
      secondary: '#ff0080',
      hover: '#33ffaa',
      active: '#00cc77',
      disabled: '#333333',
    },
    input: {
      background: 'rgba(0, 255, 136, 0.1)',
      border: '#00ff88',
      focus: '#33ffaa',
      placeholder: 'rgba(0, 255, 136, 0.5)',
    },
    card: {
      background: 'rgba(26, 10, 26, 0.9)',
      border: '#00ff88',
      hover: 'rgba(0, 255, 136, 0.1)',
    },
    modal: {
      background: 'rgba(10, 10, 10, 0.95)',
      overlay: 'rgba(0, 0, 0, 0.8)',
    },
  },
  effects: {
    glow: '0 0 20px #00ff88, 0 0 40px #ff0080',
    shadow: '0 0 30px rgba(0, 255, 136, 0.3)',
    borderGlow: '0 0 15px #00ff88',
    textGlow: '0 0 10px #00ff88',
    buttonGlow: '0 0 20px #00ff88',
  },
  animations: {
    primary: hologram,
    secondary: typing,
    accent: blink,
    hover: float,
    loading: blink,
  },
  patterns: {
    background: 'linear-gradient(45deg, #0a0a0a 25%, transparent 25%), linear-gradient(-45deg, #0a0a0a 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #0a0a0a 75%), linear-gradient(-45deg, transparent 75%, #0a0a0a 75%)',
    overlay: 'linear-gradient(90deg, rgba(0, 255, 136, 0.1) 0%, rgba(255, 0, 128, 0.1) 50%, rgba(0, 136, 255, 0.1) 100%)',
    gradient: 'linear-gradient(135deg, #00ff88 0%, #ff0080 50%, #0088ff 100%)',
  },
  typography: {
    fontFamily: "'Courier New', monospace",
    headingColor: '#00ff88',
    bodyColor: '#ffffff',
  },
};

// Immersive Casino Floor Theme
export const casinoFloorTheme: GlobalTheme = {
  name: 'Casino Floor',
  description: '3D casino atmosphere with velvet textures',
  colors: {
    primary: '#ffd700',
    secondary: '#8b4513',
    accent: '#dc143c',
    background: '#2f1b14',
    surface: '#4a2c17',
    border: '#daa520',
    text: '#f5deb3',
    textSecondary: '#deb887',
    success: '#32cd32',
    error: '#dc143c',
    warning: '#ffd700',
    info: '#87ceeb',
    shadow: 'rgba(47, 27, 20, 0.6)',
    button: {
      primary: '#daa520',
      secondary: '#8b4513',
      hover: '#ffed4e',
      active: '#b8860b',
      disabled: '#696969',
    },
    input: {
      background: 'rgba(218, 165, 32, 0.1)',
      border: '#daa520',
      focus: '#ffd700',
      placeholder: 'rgba(245, 222, 179, 0.6)',
    },
    card: {
      background: 'rgba(74, 44, 23, 0.9)',
      border: '#daa520',
      hover: 'rgba(218, 165, 32, 0.1)',
    },
    modal: {
      background: 'rgba(47, 27, 20, 0.95)',
      overlay: 'rgba(0, 0, 0, 0.8)',
    },
  },
  effects: {
    glow: '0 0 25px rgba(218, 165, 32, 0.4)',
    shadow: '0 8px 32px rgba(47, 27, 20, 0.6)',
    borderGlow: '0 0 12px rgba(218, 165, 32, 0.5)',
    textGlow: '0 0 8px rgba(218, 165, 32, 0.6)',
    buttonGlow: '0 0 16px rgba(218, 165, 32, 0.4)',
  },
  animations: {
    primary: float,
    secondary: sparkle,
    accent: moveGradient,
    hover: float,
    loading: blink,
  },
  patterns: {
    background: 'radial-gradient(ellipse at center, rgba(218, 165, 32, 0.1) 0%, transparent 70%), linear-gradient(45deg, rgba(139, 69, 19, 0.1) 25%, transparent 25%)',
    overlay: 'linear-gradient(135deg, rgba(218, 165, 32, 0.15), rgba(139, 69, 19, 0.1))',
    gradient: 'linear-gradient(135deg, #daa520 0%, #8b4513 50%, #dc143c 100%)',
  },
  typography: {
    fontFamily: "'Times New Roman', serif",
    headingColor: '#daa520',
    bodyColor: '#f5deb3',
  },
};

// Crystal Glass Luxury Theme
export const crystalTheme: GlobalTheme = {
  name: 'Crystal Luxury',
  description: 'Premium glass panels with diamond accents and deep luxury tones',
  colors: {
    primary: '#b19cd9',
    secondary: '#6a5acd',
    accent: '#9370db',
    background: '#1a0a2e',
    surface: '#2d1b69',
    border: '#8a2be2',
    text: '#e6e6fa',
    textSecondary: '#d8bfd8',
    success: '#98fb98',
    error: '#ffb6c1',
    warning: '#ffe4b5',
    info: '#e0ffff',
    shadow: 'rgba(138, 43, 226, 0.3)',
    button: {
      primary: '#9370db',
      secondary: '#6a5acd',
      hover: '#8a2be2',
      active: '#5d4e8a',
      disabled: '#4a3c6b',
    },
    input: {
      background: 'rgba(138, 43, 226, 0.1)',
      border: '#8a2be2',
      focus: '#9370db',
      placeholder: 'rgba(216, 191, 216, 0.6)',
    },
    card: {
      background: 'rgba(45, 27, 105, 0.9)',
      border: '#8a2be2',
      hover: 'rgba(138, 43, 226, 0.1)',
    },
    modal: {
      background: 'rgba(26, 10, 46, 0.95)',
      overlay: 'rgba(0, 0, 0, 0.7)',
    },
  },
  effects: {
    glow: '0 0 25px rgba(138, 43, 226, 0.5)',
    shadow: '0 8px 32px rgba(138, 43, 226, 0.3)',
    borderGlow: '0 0 15px rgba(138, 43, 226, 0.4)',
    textGlow: '0 0 10px rgba(177, 156, 217, 0.6)',
    buttonGlow: '0 0 18px rgba(138, 43, 226, 0.4)',
  },
  animations: {
    primary: hologram,
    secondary: sparkle,
    accent: moveGradient,
    hover: float,
    loading: blink,
  },
  patterns: {
    background: 'radial-gradient(circle at 30% 70%, rgba(138, 43, 226, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(106, 90, 205, 0.1) 0%, transparent 50%)',
    overlay: 'linear-gradient(135deg, rgba(138, 43, 226, 0.15), rgba(106, 90, 205, 0.1))',
    gradient: 'linear-gradient(135deg, #b19cd9 0%, #6a5acd 50%, #9370db 100%)',
  },
  typography: {
    fontFamily: "'Georgia', serif",
    headingColor: '#e6e6fa',
    bodyColor: '#d8bfd8',
  },
};

// Space Casino Theme
export const spaceTheme: GlobalTheme = {
  name: 'Space Casino',
  description: 'Cosmic casino with nebula backgrounds',
  colors: {
    primary: '#00ffff',
    secondary: '#ff4500',
    accent: '#9932cc',
    background: '#000011',
    surface: '#001122',
    border: '#00ffff',
    text: '#e0ffff',
    textSecondary: '#87ceeb',
    success: '#00ff7f',
    error: '#ff6347',
    warning: '#ffd700',
    info: '#00bfff',
    shadow: 'rgba(0, 255, 255, 0.3)',
    button: {
      primary: '#00ffff',
      secondary: '#ff4500',
      hover: '#33ffff',
      active: '#00cccc',
      disabled: '#2f4f4f',
    },
    input: {
      background: 'rgba(0, 255, 255, 0.1)',
      border: '#00ffff',
      focus: '#33ffff',
      placeholder: 'rgba(224, 255, 255, 0.5)',
    },
    card: {
      background: 'rgba(0, 17, 34, 0.9)',
      border: '#00ffff',
      hover: 'rgba(0, 255, 255, 0.1)',
    },
    modal: {
      background: 'rgba(0, 0, 17, 0.95)',
      overlay: 'rgba(0, 0, 0, 0.8)',
    },
  },
  effects: {
    glow: '0 0 25px #00ffff, 0 0 50px #ff4500',
    shadow: '0 0 40px rgba(0, 255, 255, 0.3)',
    borderGlow: '0 0 15px #00ffff',
    textGlow: '0 0 10px #00ffff',
    buttonGlow: '0 0 20px #00ffff',
  },
  animations: {
    primary: spaceFloat,
    secondary: sparkle,
    accent: moveGradient,
    hover: float,
    loading: blink,
  },
  patterns: {
    background: 'radial-gradient(ellipse at center, rgba(0, 255, 255, 0.1) 0%, transparent 70%), radial-gradient(ellipse at top, rgba(255, 69, 0, 0.1) 0%, transparent 50%)',
    overlay: 'linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(255, 69, 0, 0.1))',
    gradient: 'linear-gradient(135deg, #00ffff 0%, #ff4500 50%, #9932cc 100%)',
  },
  typography: {
    fontFamily: "'Orbitron', sans-serif",
    headingColor: '#00ffff',
    bodyColor: '#e0ffff',
  },
};

// Retro Arcade Theme
export const retroTheme: GlobalTheme = {
  name: 'Retro Arcade',
  description: 'Classic arcade styling with modern UX',
  colors: {
    primary: '#ffff00',
    secondary: '#ff00ff',
    accent: '#00ffff',
    background: '#000000',
    surface: '#111111',
    border: '#ffff00',
    text: '#ffffff',
    textSecondary: '#cccccc',
    success: '#00ff00',
    error: '#ff0000',
    warning: '#ffff00',
    info: '#00ffff',
    shadow: 'rgba(0, 0, 0, 0.8)',
    button: {
      primary: '#ffff00',
      secondary: '#ff00ff',
      hover: '#ffff33',
      active: '#cccc00',
      disabled: '#333333',
    },
    input: {
      background: 'rgba(255, 255, 0, 0.1)',
      border: '#ffff00',
      focus: '#ffff33',
      placeholder: 'rgba(255, 255, 255, 0.5)',
    },
    card: {
      background: 'rgba(17, 17, 17, 0.9)',
      border: '#ffff00',
      hover: 'rgba(255, 255, 0, 0.1)',
    },
    modal: {
      background: 'rgba(0, 0, 0, 0.95)',
      overlay: 'rgba(0, 0, 0, 0.8)',
    },
  },
  effects: {
    glow: '0 0 20px #ffff00, 0 0 10px #ff00ff',
    shadow: '0 4px 16px rgba(0, 0, 0, 0.8)',
    borderGlow: '0 0 8px #ffff00',
    textGlow: '0 0 6px #ffff00',
    buttonGlow: '0 0 12px #ffff00',
  },
  animations: {
    primary: retroFlicker,
    secondary: blink,
    accent: moveGradient,
    hover: float,
    loading: blink,
  },
  patterns: {
    background: 'repeating-linear-gradient(45deg, rgba(255, 255, 0, 0.05) 0px, rgba(255, 255, 0, 0.05) 2px, transparent 2px, transparent 4px)',
    overlay: 'linear-gradient(135deg, rgba(255, 255, 0, 0.1), rgba(255, 0, 255, 0.1))',
    gradient: 'linear-gradient(135deg, #ffff00 0%, #ff00ff 50%, #00ffff 100%)',
  },
  typography: {
    fontFamily: "'Press Start 2P', monospace",
    headingColor: '#ffff00',
    bodyColor: '#ffffff',
  },
};

// Carnival Extravaganza Theme
export const carnivalTheme: GlobalTheme = {
  name: 'Carnival Fun',
  description: 'Playful carnival atmosphere with bright colors',
  colors: {
    primary: '#ff6b35',
    secondary: '#f7931e',
    accent: '#00ff88',
    background: '#2d1b69',
    surface: '#4a148c',
    border: '#ff6b35',
    text: '#ffffff',
    textSecondary: '#ffeb3b',
    success: '#00ff88',
    error: '#ff4757',
    warning: '#ffa502',
    info: '#3742fa',
    shadow: 'rgba(255, 107, 53, 0.4)',
    button: {
      primary: '#ff6b35',
      secondary: '#f7931e',
      hover: '#ff8555',
      active: '#e55a2b',
      disabled: '#666666',
    },
    input: {
      background: 'rgba(255, 107, 53, 0.1)',
      border: '#ff6b35',
      focus: '#ff8555',
      placeholder: 'rgba(255, 235, 59, 0.6)',
    },
    card: {
      background: 'rgba(74, 20, 140, 0.9)',
      border: '#ff6b35',
      hover: 'rgba(255, 107, 53, 0.1)',
    },
    modal: {
      background: 'rgba(45, 27, 105, 0.95)',
      overlay: 'rgba(0, 0, 0, 0.7)',
    },
  },
  effects: {
    glow: '0 0 25px #ff6b35, 0 0 15px #f7931e',
    shadow: '0 6px 24px rgba(255, 107, 53, 0.4)',
    borderGlow: '0 0 12px #ff6b35',
    textGlow: '0 0 8px #ff6b35',
    buttonGlow: '0 0 16px #ff6b35',
  },
  animations: {
    primary: carnival,
    secondary: sparkle,
    accent: moveGradient,
    hover: float,
    loading: blink,
  },
  patterns: {
    background: 'radial-gradient(circle at 30% 70%, rgba(255, 107, 53, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(247, 147, 30, 0.1) 0%, transparent 50%)',
    overlay: 'linear-gradient(135deg, rgba(255, 107, 53, 0.15), rgba(247, 147, 30, 0.1))',
    gradient: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #00ff88 100%)',
  },
  typography: {
    fontFamily: "'Fredoka One', cursive",
    headingColor: '#ff6b35',
    bodyColor: '#ffffff',
  },
};

// All available themes
export const globalThemes = {
  default: defaultTheme,
  cyberpunk: cyberpunkTheme,
  casinoFloor: casinoFloorTheme,
  crystal: crystalTheme,
  space: spaceTheme,
  retro: retroTheme,
  carnival: carnivalTheme,
};

export type ThemeKey = keyof typeof globalThemes;

// Theme utility functions
export const getThemeValue = (theme: GlobalTheme, path: string, fallback: string = ''): string => {
  const keys = path.split('.');
  let value: any = theme;

  for (const key of keys) {
    value = value?.[key];
    if (value === undefined) return fallback;
  }

  return typeof value === 'string' ? value : fallback;
};

export const createThemeStyles = (theme: GlobalTheme) => ({
  // Button styles
  button: {
    primary: `
      background: ${theme.colors.button.primary};
      border: 2px solid ${theme.colors.button.primary};
      color: ${theme.colors.text};
      box-shadow: ${theme.effects.buttonGlow};

      &:hover {
        background: ${theme.colors.button.hover};
        border-color: ${theme.colors.button.hover};
        transform: translateY(-2px);
        box-shadow: 0 8px 24px ${theme.colors.button.primary}60;
      }

      &:active {
        background: ${theme.colors.button.active};
        transform: translateY(0);
      }

      &:disabled {
        background: ${theme.colors.button.disabled};
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }
    `,
    secondary: `
      background: ${theme.colors.button.secondary};
      border: 2px solid ${theme.colors.button.secondary};
      color: ${theme.colors.text};

      &:hover {
        background: ${theme.colors.button.hover};
        border-color: ${theme.colors.button.hover};
      }
    `,
  },

  // Input styles
  input: `
    background: ${theme.colors.input.background};
    border: 2px solid ${theme.colors.input.border};
    color: ${theme.colors.text};

    &::placeholder {
      color: ${theme.colors.input.placeholder};
    }

    &:focus {
      border-color: ${theme.colors.input.focus};
      box-shadow: 0 0 12px ${theme.colors.input.focus}40;
    }
  `,

  // Card styles
  card: `
    background: ${theme.colors.card.background};
    border: 2px solid ${theme.colors.card.border};
    box-shadow: ${theme.effects.shadow};

    &:hover {
      background: ${theme.colors.card.hover};
      border-color: ${theme.colors.primary};
      transform: translateY(-4px);
      box-shadow: 0 12px 32px ${theme.colors.shadow};
    }
  `,

  // Modal styles
  modal: `
    background: ${theme.colors.modal.background};
    border: 2px solid ${theme.colors.border};
    box-shadow: 0 20px 60px ${theme.colors.shadow};
  `,

  modalOverlay: `
    background: ${theme.colors.modal.overlay};
  `,
});

/**
 * Get stored theme from localStorage
 */
export const getStoredTheme = (): ThemeKey => {
  if (typeof window === 'undefined') return 'default';
  try {
    const stored = localStorage.getItem('selectedTheme');
    if (stored && stored in globalThemes) {
      return stored as ThemeKey;
    }
    return 'default';
  } catch {
    return 'default';
  }
};

/**
 * Set stored theme in localStorage
 */
export const setStoredTheme = (themeName: ThemeKey): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('selectedTheme', themeName);
  } catch {
    // Ignore localStorage errors (e.g., in private browsing)
  }
};
