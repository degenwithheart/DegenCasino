import { keyframes } from 'styled-components';
import { DEFAULT_COLOR_SCHEME } from '../constants';

// Type for styled-components keyframes
type StyledKeyframes = ReturnType<typeof keyframes>;

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

// Jazz Midnight Romantic Animation
export const jazzMidnight = keyframes`
  0% { 
    transform: rotate(0deg) scale(1);
    opacity: 1;
    filter: hue-rotate(0deg);
  }
  25% { 
    transform: rotate(90deg) scale(1.05);
    opacity: 0.9;
    filter: hue-rotate(15deg);
  }
  50% { 
    transform: rotate(180deg) scale(1);
    opacity: 0.8;
    filter: hue-rotate(30deg);
  }
  75% { 
    transform: rotate(270deg) scale(1.05);
    opacity: 0.9;
    filter: hue-rotate(15deg);
  }
  100% { 
    transform: rotate(360deg) scale(1);
    opacity: 1;
    filter: hue-rotate(0deg);
  }
`;

export const marketPrayer = keyframes`
  0%, 100% { 
    box-shadow: 
      0 0 20px rgba(212, 165, 116, 0.4),
      0 0 40px rgba(184, 51, 106, 0.2),
      0 0 60px rgba(139, 90, 158, 0.1);
  }
  33% { 
    box-shadow: 
      0 0 30px rgba(212, 165, 116, 0.5),
      0 0 60px rgba(184, 51, 106, 0.3),
      0 0 90px rgba(139, 90, 158, 0.2);
  }
  66% { 
    box-shadow: 
      0 0 40px rgba(212, 165, 116, 0.6),
      0 0 80px rgba(184, 51, 106, 0.4),
      0 0 120px rgba(139, 90, 158, 0.3);
  }
`;

export const candlestickSerenade = keyframes`
  0% { 
    transform: translateY(0px) rotate(0deg);
    text-shadow: 0 0 20px rgba(212, 165, 116, 0.6);
  }
  25% { 
    transform: translateY(-5px) rotate(1deg);
    text-shadow: 0 0 25px rgba(184, 51, 106, 0.7);
  }
  50% { 
    transform: translateY(-8px) rotate(0deg);
    text-shadow: 0 0 30px rgba(139, 90, 158, 0.8);
  }
  75% { 
    transform: translateY(-5px) rotate(-1deg);
    text-shadow: 0 0 25px rgba(184, 51, 106, 0.7);
  }
  100% { 
    transform: translateY(0px) rotate(0deg);
    text-shadow: 0 0 20px rgba(212, 165, 116, 0.6);
  }
`;

export const loveLetterGlow = keyframes`
  0%, 100% {
    box-shadow: 
      0 0 20px rgba(212, 165, 116, 0.3), 
      0 0 40px rgba(184, 51, 106, 0.2),
      inset 0 0 20px rgba(244, 233, 225, 0.05);
  }
  50% {
    box-shadow: 
      0 0 30px rgba(212, 165, 116, 0.5), 
      0 0 60px rgba(184, 51, 106, 0.3),
      inset 0 0 30px rgba(244, 233, 225, 0.1);
  }
`;

export const dreamlikeFloat = keyframes`
  0%, 100% { 
    transform: translateY(0px) translateX(0px) rotate(0deg); 
    opacity: 0.8;
  }
  33% { 
    transform: translateY(-8px) translateX(3px) rotate(1deg); 
    opacity: 1;
  }
  66% { 
    transform: translateY(5px) translateX(-2px) rotate(-1deg); 
    opacity: 0.9;
  }
`;

export const etherealPulse = keyframes`
  0% { 
    background-position: 0% 50%; 
    filter: brightness(1) saturate(1);
  }
  50% { 
    background-position: 100% 50%; 
    filter: brightness(1.1) saturate(1.2);
  }
  100% { 
    background-position: 0% 50%; 
    filter: brightness(1) saturate(1);
  }
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
export interface GlobalColorScheme {
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
    primary: StyledKeyframes;
    secondary: StyledKeyframes;
    accent: StyledKeyframes;
    hover: StyledKeyframes;
    loading: StyledKeyframes;
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
export const defaultColorScheme: GlobalColorScheme = {
  name: 'Default',
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
    background: `
      radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.08) 0%, transparent 50%), 
      radial-gradient(circle at 80% 20%, rgba(162, 89, 255, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(255, 149, 0, 0.05) 0%, transparent 60%),
      linear-gradient(135deg, rgba(255, 215, 0, 0.02) 0%, rgba(15, 15, 35, 0.95) 50%, rgba(162, 89, 255, 0.02) 100%)
    `,
    overlay: `
      linear-gradient(135deg, 
        rgba(255, 215, 0, 0.12) 0%, 
        rgba(255, 149, 0, 0.08) 50%, 
        rgba(162, 89, 255, 0.06) 100%
      ),
      radial-gradient(circle at center, rgba(255, 215, 0, 0.03) 0%, transparent 70%)
    `,
    gradient: `
      linear-gradient(135deg, 
        #ffd700 0%, 
        #ff9500 25%,
        #a259ff 50%, 
        #ffd700 75%,
        #ff9500 100%
      )
    `,
  },
  typography: {
    fontFamily: "'Luckiest Guy', cursive, sans-serif",
    headingColor: '#ffd700',
    bodyColor: '#ffffff',
  },
};

// Enhanced Cyberpunk Neon Grid Theme
export const cyberpunkColorScheme: GlobalColorScheme = {
  name: 'Cyberpunk Matrix',
  description: 'Neural-linked cyber casino with glitch aesthetics and holographic displays',
  colors: {
    primary: '#00ff41',        // Matrix green
    secondary: '#ff0080',      // Cyber magenta
    accent: '#00d4ff',         // Electric blue
    background: '#000000',     // Pure black matrix
    surface: '#0a0f0a',        // Dark green tint
    border: '#00ff41',         // Matrix border
    text: '#00ff41',           // Green terminal text
    textSecondary: '#66ff99',  // Lighter matrix green
    success: '#00ff41',        // Success green
    error: '#ff003c',          // Critical error red
    warning: '#ffcc00',        // System warning amber
    info: '#00d4ff',           // Info cyan
    shadow: 'rgba(0, 255, 65, 0.4)',
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
    glow: '0 0 24px rgba(0, 255, 136, 0.4), 0 0 48px rgba(255, 0, 128, 0.3), 0 0 72px rgba(0, 136, 255, 0.2)',
    shadow: '0 0 30px rgba(0, 255, 136, 0.3), 0 8px 32px rgba(0, 0, 0, 0.8)',
    borderGlow: '0 0 15px rgba(0, 255, 136, 0.6), 0 0 30px rgba(255, 0, 128, 0.4)',
    textGlow: '0 0 10px rgba(0, 255, 136, 0.8), 0 0 20px rgba(0, 255, 136, 0.4)',
    buttonGlow: '0 0 20px rgba(0, 255, 136, 0.5), 0 0 40px rgba(255, 0, 128, 0.3)',
  },
  animations: {
    primary: hologram,
    secondary: typing,
    accent: blink,
    hover: float,
    loading: blink,
  },
  patterns: {
    background: `
      linear-gradient(45deg, #0a0a0a 25%, transparent 25%), 
      linear-gradient(-45deg, #0a0a0a 25%, transparent 25%), 
      linear-gradient(45deg, transparent 75%, #0a0a0a 75%), 
      linear-gradient(-45deg, transparent 75%, #0a0a0a 75%),
      radial-gradient(circle at 30% 70%, rgba(0, 255, 136, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 70% 30%, rgba(255, 0, 128, 0.08) 0%, transparent 50%),
      linear-gradient(135deg, rgba(0, 136, 255, 0.05) 0%, rgba(0, 0, 0, 0.95) 100%)
    `,
    overlay: `
      linear-gradient(90deg, 
        rgba(0, 255, 136, 0.15) 0%, 
        rgba(255, 0, 128, 0.12) 25%,
        rgba(0, 136, 255, 0.1) 50%,
        rgba(0, 255, 136, 0.08) 75%,
        rgba(255, 0, 128, 0.06) 100%
      ),
      radial-gradient(circle at center, rgba(0, 255, 136, 0.05) 0%, transparent 60%)
    `,
    gradient: `
      linear-gradient(135deg, 
        #00ff88 0%, 
        #ff0080 25%,
        #0088ff 50%, 
        #00ff88 75%,
        #ff0080 100%
      )
    `,
  },
  typography: {
    fontFamily: "'Courier New', monospace",
    headingColor: '#00ff88',
    bodyColor: '#ffffff',
  },
};

// Immersive Casino Floor Theme
export const casinoFloorColorScheme: GlobalColorScheme = {
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
    glow: '0 0 25px rgba(218, 165, 32, 0.5), 0 0 50px rgba(139, 69, 19, 0.3), 0 0 75px rgba(220, 20, 60, 0.2)',
    shadow: '0 8px 32px rgba(47, 27, 20, 0.7), 0 16px 64px rgba(218, 165, 32, 0.2)',
    borderGlow: '0 0 12px rgba(218, 165, 32, 0.6), 0 0 24px rgba(139, 69, 19, 0.4)',
    textGlow: '0 0 8px rgba(218, 165, 32, 0.7), 0 0 16px rgba(245, 222, 179, 0.3)',
    buttonGlow: '0 0 16px rgba(218, 165, 32, 0.5), 0 0 32px rgba(220, 20, 60, 0.3)',
  },
  animations: {
    primary: float,
    secondary: sparkle,
    accent: moveGradient,
    hover: float,
    loading: blink,
  },
  patterns: {
    background: `
      radial-gradient(ellipse at center, rgba(218, 165, 32, 0.12) 0%, transparent 70%), 
      linear-gradient(45deg, rgba(139, 69, 19, 0.08) 25%, transparent 25%),
      radial-gradient(circle at 20% 80%, rgba(220, 20, 60, 0.06) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(218, 165, 32, 0.08) 0%, transparent 60%),
      linear-gradient(135deg, rgba(47, 27, 20, 0.95) 0%, rgba(139, 69, 19, 0.1) 50%, rgba(47, 27, 20, 0.95) 100%)
    `,
    overlay: `
      linear-gradient(135deg, 
        rgba(218, 165, 32, 0.18) 0%, 
        rgba(139, 69, 19, 0.12) 50%, 
        rgba(220, 20, 60, 0.08) 100%
      ),
      radial-gradient(circle at center, rgba(245, 222, 179, 0.04) 0%, transparent 70%)
    `,
    gradient: `
      linear-gradient(135deg, 
        #daa520 0%, 
        #8b4513 25%,
        #dc143c 50%, 
        #daa520 75%,
        #8b4513 100%
      )
    `,
  },
  typography: {
    fontFamily: "'Times New Roman', serif",
    headingColor: '#daa520',
    bodyColor: '#f5deb3',
  },
};

// Crystal Glass Luxury Theme
export const crystalColorScheme: GlobalColorScheme = {
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
    glow: '0 0 25px rgba(138, 43, 226, 0.6), 0 0 50px rgba(106, 90, 205, 0.4), 0 0 75px rgba(147, 112, 219, 0.3)',
    shadow: '0 8px 32px rgba(138, 43, 226, 0.4), 0 16px 64px rgba(26, 10, 46, 0.8)',
    borderGlow: '0 0 15px rgba(138, 43, 226, 0.6), 0 0 30px rgba(147, 112, 219, 0.4)',
    textGlow: '0 0 10px rgba(177, 156, 217, 0.8), 0 0 20px rgba(138, 43, 226, 0.5)',
    buttonGlow: '0 0 18px rgba(138, 43, 226, 0.6), 0 0 36px rgba(106, 90, 205, 0.4)',
  },
  animations: {
    primary: hologram,
    secondary: sparkle,
    accent: moveGradient,
    hover: float,
    loading: blink,
  },
  patterns: {
    background: `
      radial-gradient(circle at 30% 70%, rgba(138, 43, 226, 0.12) 0%, transparent 50%), 
      radial-gradient(circle at 70% 30%, rgba(106, 90, 205, 0.10) 0%, transparent 50%),
      radial-gradient(circle at 50% 20%, rgba(147, 112, 219, 0.08) 0%, transparent 60%),
      linear-gradient(135deg, rgba(26, 10, 46, 0.95) 0%, rgba(138, 43, 226, 0.05) 50%, rgba(26, 10, 46, 0.95) 100%),
      linear-gradient(45deg, rgba(45, 27, 105, 0.3) 25%, transparent 25%)
    `,
    overlay: `
      linear-gradient(135deg, 
        rgba(138, 43, 226, 0.18) 0%, 
        rgba(106, 90, 205, 0.12) 50%, 
        rgba(147, 112, 219, 0.08) 100%
      ),
      radial-gradient(circle at center, rgba(230, 230, 250, 0.03) 0%, transparent 70%)
    `,
    gradient: `
      linear-gradient(135deg, 
        #b19cd9 0%, 
        #6a5acd 25%,
        #9370db 50%, 
        #8a2be2 75%,
        #b19cd9 100%
      )
    `,
  },
  typography: {
    fontFamily: "'Georgia', serif",
    headingColor: '#e6e6fa',
    bodyColor: '#d8bfd8',
  },
};

// Surreal Romantic Degen Trader Theme - Jazz at Midnight
export const romanticDegenColorScheme: GlobalColorScheme = {
  name: 'Romantic Degen Serenade',
  description: 'Surreal romantic degen trader aesthetic - candlestick cathedral with love letter gold, soft neon glow, and jazz-at-midnight atmosphere',
  colors: {
    primary: '#d4a574', // Love letter gold
    secondary: '#b8336a', // Deep crimson rose
    accent: '#8b5a9e', // Soft purple twilight
    background: '#0a0511', // Deep romantic night
    surface: '#0f081c', // Mysterious depth
    border: '#d4a574', // Romantic border glow
    text: '#f4e9e1', // Warm ivory text
    textSecondary: '#e8d5c4', // Soft romantic text
    success: '#8b5a9e', // Romantic success purple
    error: '#b8336a', // Passionate error crimson
    warning: '#d4a574', // Warning gold
    info: '#8b5a9e', // Info twilight
    shadow: 'rgba(139, 90, 158, 0.15)',
    button: {
      primary: '#d4a574',
      secondary: '#b8336a',
      hover: '#e8c49a',
      active: '#c19660',
      disabled: 'rgba(139, 90, 158, 0.3)',
    },
    input: {
      background: 'rgba(212, 165, 116, 0.08)',
      border: 'rgba(212, 165, 116, 0.18)',
      focus: 'rgba(184, 51, 106, 0.3)',
      placeholder: 'rgba(244, 233, 225, 0.5)',
    },
    card: {
      background: 'rgba(212, 165, 116, 0.08)',
      border: 'rgba(212, 165, 116, 0.18)',
      hover: 'rgba(212, 165, 116, 0.15)',
    },
    modal: {
      background: 'rgba(10, 5, 17, 0.95)',
      overlay: 'rgba(0, 0, 0, 0.8)',
    },
  },
  effects: {
    glow: '0 0 40px rgba(212, 165, 116, 0.3), 0 0 80px rgba(184, 51, 106, 0.2)',
    shadow: '0 8px 32px rgba(139, 90, 158, 0.15)',
    borderGlow: '0 0 20px rgba(212, 165, 116, 0.4)',
    textGlow: '0 0 8px rgba(244, 233, 225, 0.3)',
    buttonGlow: '0 0 25px rgba(184, 51, 106, 0.4)',
  },
  animations: {
    primary: candlestickSerenade,
    secondary: loveLetterGlow,
    accent: etherealPulse,
    hover: dreamlikeFloat,
    loading: jazzMidnight,
  },
  patterns: {
    background: `
      radial-gradient(circle at 15% 20%, rgba(212, 165, 116, 0.04) 0%, transparent 40%),
      radial-gradient(circle at 85% 80%, rgba(184, 51, 106, 0.04) 0%, transparent 40%),
      radial-gradient(circle at 50% 50%, rgba(139, 90, 158, 0.02) 0%, transparent 60%),
      linear-gradient(135deg, #0a0511 0%, #0d0618 25%, #0f081c 50%, #0a0511 75%, #0a0511 100%)
    `,
    overlay: `
      linear-gradient(135deg, 
        rgba(212, 165, 116, 0.08) 0%, 
        rgba(184, 51, 106, 0.06) 50%, 
        rgba(139, 90, 158, 0.04) 100%
      )
    `,
    gradient: `
      linear-gradient(135deg, 
        #d4a574 0%, 
        #b8336a 50%, 
        #8b5a9e 100%
      )
    `,
  },
  typography: {
    fontFamily: "'Libre Baskerville', 'DM Sans', Georgia, serif",
    headingColor: '#d4a574',
    bodyColor: '#f4e9e1',
  },
};

// Space Casino Theme
export const spaceColorScheme: GlobalColorScheme = {
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
    glow: '0 0 25px rgba(0, 255, 255, 0.5), 0 0 50px rgba(255, 69, 0, 0.3), 0 0 75px rgba(153, 50, 204, 0.2)',
    shadow: '0 0 40px rgba(0, 255, 255, 0.4), 0 12px 48px rgba(0, 0, 17, 0.8)',
    borderGlow: '0 0 15px rgba(0, 255, 255, 0.6), 0 0 30px rgba(255, 69, 0, 0.4)',
    textGlow: '0 0 10px rgba(0, 255, 255, 0.8), 0 0 20px rgba(224, 255, 255, 0.4)',
    buttonGlow: '0 0 20px rgba(0, 255, 255, 0.6), 0 0 40px rgba(255, 69, 0, 0.3)',
  },
  animations: {
    primary: spaceFloat,
    secondary: sparkle,
    accent: moveGradient,
    hover: float,
    loading: blink,
  },
  patterns: {
    background: `
      radial-gradient(ellipse at center, rgba(0, 255, 255, 0.12) 0%, transparent 70%), 
      radial-gradient(ellipse at top, rgba(255, 69, 0, 0.10) 0%, transparent 50%),
      radial-gradient(circle at 40% 60%, rgba(153, 50, 204, 0.08) 0%, transparent 60%),
      linear-gradient(135deg, rgba(0, 0, 17, 0.95) 0%, rgba(0, 17, 34, 0.8) 50%, rgba(0, 0, 17, 0.95) 100%),
      linear-gradient(45deg, rgba(0, 255, 255, 0.02) 25%, transparent 25%)
    `,
    overlay: `
      linear-gradient(135deg, 
        rgba(0, 255, 255, 0.15) 0%, 
        rgba(255, 69, 0, 0.12) 50%, 
        rgba(153, 50, 204, 0.08) 100%
      ),
      radial-gradient(circle at center, rgba(224, 255, 255, 0.03) 0%, transparent 70%)
    `,
    gradient: `
      linear-gradient(135deg, 
        #00ffff 0%, 
        #ff4500 25%,
        #9932cc 50%, 
        #00ffff 75%,
        #ff4500 100%
      )
    `,
  },
  typography: {
    fontFamily: "'Orbitron', sans-serif",
    headingColor: '#00ffff',
    bodyColor: '#e0ffff',
  },
};

// Retro Arcade Theme
export const retroColorScheme: GlobalColorScheme = {
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
    glow: '0 0 20px rgba(255, 255, 0, 0.6), 0 0 10px rgba(255, 0, 255, 0.4), 0 0 30px rgba(0, 255, 255, 0.3)',
    shadow: '0 4px 16px rgba(0, 0, 0, 0.9), 0 8px 32px rgba(255, 255, 0, 0.2)',
    borderGlow: '0 0 8px rgba(255, 255, 0, 0.7), 0 0 16px rgba(255, 0, 255, 0.5)',
    textGlow: '0 0 6px rgba(255, 255, 0, 0.9), 0 0 12px rgba(255, 255, 0, 0.6)',
    buttonGlow: '0 0 12px rgba(255, 255, 0, 0.7), 0 0 24px rgba(255, 0, 255, 0.4)',
  },
  animations: {
    primary: retroFlicker,
    secondary: blink,
    accent: moveGradient,
    hover: float,
    loading: blink,
  },
  patterns: {
    background: `
      repeating-linear-gradient(45deg, rgba(255, 255, 0, 0.06) 0px, rgba(255, 255, 0, 0.06) 2px, transparent 2px, transparent 4px),
      repeating-linear-gradient(-45deg, rgba(255, 0, 255, 0.04) 0px, rgba(255, 0, 255, 0.04) 2px, transparent 2px, transparent 4px),
      radial-gradient(circle at 30% 70%, rgba(255, 255, 0, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 70% 30%, rgba(0, 255, 255, 0.06) 0%, transparent 50%),
      linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(17, 17, 17, 0.8) 50%, rgba(0, 0, 0, 0.95) 100%)
    `,
    overlay: `
      linear-gradient(135deg, 
        rgba(255, 255, 0, 0.12) 0%, 
        rgba(255, 0, 255, 0.10) 50%, 
        rgba(0, 255, 255, 0.08) 100%
      ),
      radial-gradient(circle at center, rgba(255, 255, 255, 0.02) 0%, transparent 60%)
    `,
    gradient: `
      linear-gradient(135deg, 
        #ffff00 0%, 
        #ff00ff 25%,
        #00ffff 50%, 
        #ffff00 75%,
        #ff00ff 100%
      )
    `,
  },
  typography: {
    fontFamily: "'Press Start 2P', monospace",
    headingColor: '#ffff00',
    bodyColor: '#ffffff',
  },
};

// Carnival Extravaganza Theme
export const carnivalColorScheme: GlobalColorScheme = {
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
    glow: '0 0 25px rgba(255, 107, 53, 0.6), 0 0 15px rgba(247, 147, 30, 0.4), 0 0 35px rgba(0, 255, 136, 0.3)',
    shadow: '0 6px 24px rgba(255, 107, 53, 0.5), 0 12px 48px rgba(45, 27, 105, 0.6)',
    borderGlow: '0 0 12px rgba(255, 107, 53, 0.7), 0 0 24px rgba(247, 147, 30, 0.5)',
    textGlow: '0 0 8px rgba(255, 107, 53, 0.8), 0 0 16px rgba(255, 235, 59, 0.4)',
    buttonGlow: '0 0 16px rgba(255, 107, 53, 0.6), 0 0 32px rgba(0, 255, 136, 0.4)',
  },
  animations: {
    primary: carnival,
    secondary: sparkle,
    accent: moveGradient,
    hover: float,
    loading: blink,
  },
  patterns: {
    background: `
      radial-gradient(circle at 30% 70%, rgba(255, 107, 53, 0.12) 0%, transparent 50%), 
      radial-gradient(circle at 70% 30%, rgba(247, 147, 30, 0.10) 0%, transparent 50%),
      radial-gradient(circle at 50% 20%, rgba(0, 255, 136, 0.08) 0%, transparent 60%),
      linear-gradient(135deg, rgba(45, 27, 105, 0.95) 0%, rgba(74, 20, 140, 0.8) 50%, rgba(45, 27, 105, 0.95) 100%),
      repeating-linear-gradient(45deg, rgba(255, 107, 53, 0.03) 0px, rgba(255, 107, 53, 0.03) 4px, transparent 4px, transparent 8px)
    `,
    overlay: `
      linear-gradient(135deg, 
        rgba(255, 107, 53, 0.18) 0%, 
        rgba(247, 147, 30, 0.12) 50%, 
        rgba(0, 255, 136, 0.08) 100%
      ),
      radial-gradient(circle at center, rgba(255, 235, 59, 0.04) 0%, transparent 70%)
    `,
    gradient: `
      linear-gradient(135deg, 
        #ff6b35 0%, 
        #f7931e 25%,
        #00ff88 50%, 
        #ff6b35 75%,
        #f7931e 100%
      )
    `,
  },
  typography: {
    fontFamily: "'Fredoka One', cursive",
    headingColor: '#ff6b35',
    bodyColor: '#ffffff',
  },
};

// All available themes
export const globalColorSchemes = {
  romanticDegen: romanticDegenColorScheme,
  cyberpunk: cyberpunkColorScheme,
  casinoFloor: casinoFloorColorScheme,
  crystal: crystalColorScheme,
  space: spaceColorScheme,
  retro: retroColorScheme,
  carnival: carnivalColorScheme,
};

export type ColorSchemeKey = keyof typeof globalColorSchemes;

// Export the default color scheme constant for external use
export { DEFAULT_COLOR_SCHEME };

// Theme utility functions
export const getColorSchemeValue = (colorScheme: GlobalColorScheme, path: string, fallback: string = ''): string => {
  const keys = path.split('.');
  let value: unknown = colorScheme;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return fallback;
    }
  }

  return typeof value === 'string' ? value : fallback;
};

export const createColorSchemeStyles = (colorScheme: GlobalColorScheme) => ({
  // Button styles
  button: {
    primary: `
      background: ${colorScheme.colors.button.primary};
      border: 2px solid ${colorScheme.colors.button.primary};
      color: ${colorScheme.colors.text};
      box-shadow: ${colorScheme.effects.buttonGlow};

      &:hover {
        background: ${colorScheme.colors.button.hover};
        border-color: ${colorScheme.colors.button.hover};
        transform: translateY(-2px);
        box-shadow: 0 8px 24px ${colorScheme.colors.button.primary}60;
      }

      &:active {
        background: ${colorScheme.colors.button.active};
        transform: translateY(0);
      }

      &:disabled {
        background: ${colorScheme.colors.button.disabled};
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }
    `,
    secondary: `
      background: ${colorScheme.colors.button.secondary};
      border: 2px solid ${colorScheme.colors.button.secondary};
      color: ${colorScheme.colors.text};

      &:hover {
        background: ${colorScheme.colors.button.hover};
        border-color: ${colorScheme.colors.button.hover};
      }
    `,
  },

  // Input styles
  input: `
    background: ${colorScheme.colors.input.background};
    border: 2px solid ${colorScheme.colors.input.border};
    color: ${colorScheme.colors.text};

    &::placeholder {
      color: ${colorScheme.colors.input.placeholder};
    }

    &:focus {
      border-color: ${colorScheme.colors.input.focus};
      box-shadow: 0 0 12px ${colorScheme.colors.input.focus}40;
    }
  `,

  // Card styles
  card: `
    background: ${colorScheme.colors.card.background};
    border: 2px solid ${colorScheme.colors.card.border};
    box-shadow: ${colorScheme.effects.shadow};

    &:hover {
      background: ${colorScheme.colors.card.hover};
      border-color: ${colorScheme.colors.primary};
      transform: translateY(-4px);
      box-shadow: 0 12px 32px ${colorScheme.colors.shadow};
    }
  `,

  // Modal styles
  modal: `
    background: ${colorScheme.colors.modal.background};
    border: 2px solid ${colorScheme.colors.border};
    box-shadow: 0 20px 60px ${colorScheme.colors.shadow};
  `,

  modalOverlay: `
    background: ${colorScheme.colors.modal.overlay};
  `,
});

/**
 * Get stored colorScheme from localStorage
 */
export const getStoredColorScheme = (): ColorSchemeKey => {
  if (typeof window === 'undefined') return DEFAULT_COLOR_SCHEME as ColorSchemeKey;
  try {
    const stored = localStorage.getItem('selectedColorScheme');
    if (stored && stored in globalColorSchemes) {
      return stored as ColorSchemeKey;
    }
    return DEFAULT_COLOR_SCHEME as ColorSchemeKey;
  } catch {
    return DEFAULT_COLOR_SCHEME as ColorSchemeKey;
  }
};

/**
 * Set stored colorScheme in localStorage
 */
export const setStoredColorScheme = (themeName: ColorSchemeKey): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('selectedColorScheme', themeName);
  } catch {
    // Ignore localStorage errors (e.g., in private browsing)
  }
};
