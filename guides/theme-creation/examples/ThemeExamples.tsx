import styled, { css, keyframes } from 'styled-components'
import { Theme } from './types'

// =============================================================================
// CYBERPUNK THEME EXAMPLE
// =============================================================================

// Cyberpunk color scheme
export const cyberpunkColors = {
  primary: '#00ff9f',      // Neon green
  secondary: '#ff0080',     // Hot pink  
  accent: '#00d4ff',       // Cyber blue
  
  success: '#00ff9f',
  warning: '#ffcc00',
  error: '#ff0080', 
  info: '#00d4ff',
  
  background: {
    primary: '#0a0a0a',
    secondary: '#1a1a1a',
    tertiary: '#2a2a2a',
    overlay: 'rgba(0, 0, 0, 0.9)',
    glass: 'rgba(0, 255, 159, 0.1)',
    gradient: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)'
  },
  
  text: {
    primary: '#ffffff',
    secondary: '#00ff9f', 
    muted: '#666666',
    inverse: '#000000',
    accent: '#ff0080'
  },
  
  border: '#00ff9f',
  shadow: 'rgba(0, 255, 159, 0.5)',
  highlight: '#00ff9f',
  disabled: '#333333',
  
  win: '#00ff9f',
  lose: '#ff0080',
  jackpot: '#ffcc00',
  bonus: '#00d4ff'
}

// Cyberpunk animations
const glitchEffect = keyframes`
  0%, 100% { transform: translateX(0); }
  10% { transform: translateX(-2px) skew(-2deg); }
  20% { transform: translateX(2px) skew(2deg); }
  30% { transform: translateX(-1px) skew(-1deg); }
  40% { transform: translateX(1px) skew(1deg); }
  50% { transform: translateX(-2px) skew(-2deg); }
  60% { transform: translateX(2px) skew(2deg); }
  70% { transform: translateX(-1px) skew(-1deg); }
  80% { transform: translateX(1px) skew(1deg); }
  90% { transform: translateX(0) skew(0deg); }
`

const neonPulse = keyframes`
  0%, 100% { 
    box-shadow: 
      0 0 5px #00ff9f,
      0 0 10px #00ff9f,
      0 0 15px #00ff9f,
      inset 0 0 5px rgba(0, 255, 159, 0.1);
  }
  50% { 
    box-shadow: 
      0 0 10px #00ff9f,
      0 0 20px #00ff9f,
      0 0 30px #00ff9f,
      inset 0 0 10px rgba(0, 255, 159, 0.2);
  }
`

const scanlines = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
`

// Cyberpunk styled components
export const CyberpunkButton = styled.button`
  background: linear-gradient(45deg, 
    rgba(0, 0, 0, 0.8) 0%,
    rgba(26, 26, 26, 0.8) 50%,
    rgba(0, 0, 0, 0.8) 100%
  );
  border: 2px solid #00ff9f;
  color: #00ff9f;
  padding: 12px 24px;
  font-family: 'Orbitron', 'Courier New', monospace;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(0, 255, 159, 0.4), 
      transparent
    );
    transition: left 0.5s;
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: #00ff9f;
    animation: ${scanlines} 2s infinite;
    opacity: 0.5;
  }
  
  &:hover {
    animation: ${neonPulse} 1.5s infinite alternate;
    transform: translateY(-2px);
    
    &:before {
      left: 100%;
    }
  }
  
  &:active {
    animation: ${glitchEffect} 0.3s;
    transform: translateY(0);
  }
  
  &:disabled {
    border-color: #333;
    color: #333;
    cursor: not-allowed;
    background: rgba(0, 0, 0, 0.5);
    
    &:hover {
      animation: none;
      transform: none;
    }
  }
`

export const CyberpunkCard = styled.div`
  background: linear-gradient(135deg, 
    rgba(0, 255, 159, 0.05) 0%,
    rgba(0, 0, 0, 0.9) 25%,
    rgba(255, 0, 128, 0.05) 75%,
    rgba(0, 0, 0, 0.9) 100%
  );
  border: 1px solid rgba(0, 255, 159, 0.3);
  border-radius: 0;
  padding: 24px;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  clip-path: polygon(15px 0, 100% 0, calc(100% - 15px) 100%, 0 100%);
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      transparent, 
      #00ff9f, 
      #ff0080, 
      #00d4ff, 
      transparent
    );
    animation: ${keyframes`
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    `} 3s infinite;
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(0, 255, 159, 0.3);
  }
  
  &:hover {
    border-color: #00ff9f;
    box-shadow: 
      0 0 20px rgba(0, 255, 159, 0.3),
      inset 0 0 20px rgba(0, 255, 159, 0.1);
    transform: translateY(-2px);
  }
`

export const CyberpunkInput = styled.input`
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(0, 255, 159, 0.5);
  border-radius: 0;
  padding: 12px 16px;
  color: #ffffff;
  font-family: 'Fira Code', 'Courier New', monospace;
  font-size: 14px;
  width: 100%;
  position: relative;
  
  &:focus {
    outline: none;
    border-color: #00ff9f;
    box-shadow: 
      0 0 10px rgba(0, 255, 159, 0.5),
      inset 0 0 5px rgba(0, 255, 159, 0.1);
  }
  
  &::placeholder {
    color: #666;
    font-style: italic;
  }
  
  &:disabled {
    background: rgba(0, 0, 0, 0.5);
    border-color: #333;
    color: #666;
  }
`

export const CyberpunkModal = styled.div`
  background: linear-gradient(135deg, 
    rgba(0, 0, 0, 0.95) 0%,
    rgba(26, 26, 26, 0.95) 50%,
    rgba(0, 0, 0, 0.95) 100%
  );
  border: 2px solid #00ff9f;
  border-radius: 0;
  padding: 30px;
  backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;
  max-width: 500px;
  
  &:before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, 
      #00ff9f, #ff0080, #00d4ff, #ffcc00
    );
    background-size: 400% 400%;
    animation: ${keyframes`
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    `} 3s ease infinite;
    z-index: -1;
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: inherit;
    z-index: -1;
  }
`

// Complete Cyberpunk theme object
export const CyberpunkTheme: Theme = {
  id: 'cyberpunk',
  name: 'Cyberpunk 2077',
  description: 'Neon-soaked futuristic theme with glitch effects and holographic elements',
  author: 'DegenHeart',
  version: '1.0.0',
  
  colors: cyberpunkColors,
  
  typography: {
    fonts: {
      primary: '"Orbitron", "Courier New", monospace',
      secondary: '"Rajdhani", sans-serif',
      monospace: '"Fira Code", "Courier New", monospace',
      display: '"Orbitron", monospace'
    },
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem'
    },
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800
    },
    lineHeights: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2
    },
    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.05em'
    }
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    base: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '5rem',
    '5xl': '6rem'
  },
  
  animations: {
    durations: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms'
    },
    easings: {
      linear: 'linear',
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    },
    keyframes: {
      glitch: glitchEffect,
      neonPulse: neonPulse,
      scanlines: scanlines
    }
  },
  
  components: {
    Button: CyberpunkButton,
    Card: CyberpunkCard,
    Input: CyberpunkInput,
    Modal: CyberpunkModal,
  },
  
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },
  
  effects: {
    borderRadius: {
      sm: '0',
      base: '0',
      lg: '0',
      xl: '0',
      full: '0'
    },
    shadows: {
      sm: '0 0 5px rgba(0, 255, 159, 0.3)',
      base: '0 0 10px rgba(0, 255, 159, 0.4)',
      lg: '0 0 20px rgba(0, 255, 159, 0.5)',
      xl: '0 0 40px rgba(0, 255, 159, 0.6)',
      inner: 'inset 0 0 10px rgba(0, 255, 159, 0.2)'
    },
    blur: {
      sm: 'blur(4px)',
      base: 'blur(8px)',
      lg: 'blur(16px)',
      xl: 'blur(24px)'
    },
    gradients: {
      primary: 'linear-gradient(45deg, #00ff9f, #00d4ff)',
      secondary: 'linear-gradient(45deg, #ff0080, #ffcc00)',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)'
    }
  }
}

// =============================================================================
// RETRO WAVE THEME EXAMPLE
// =============================================================================

const retroColors = {
  primary: '#ff006e',
  secondary: '#8338ec',
  accent: '#3a86ff',
  
  success: '#06ffa5',
  warning: '#ffbe0b',
  error: '#ff006e',
  info: '#3a86ff',
  
  background: {
    primary: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
    secondary: 'linear-gradient(45deg, #ff006e, #8338ec)',
    overlay: 'rgba(26, 26, 46, 0.95)',
    glass: 'rgba(255, 0, 110, 0.1)'
  },
  
  text: {
    primary: '#ffffff',
    secondary: '#ff006e',
    muted: '#a0a0a0',
    inverse: '#1a1a2e'
  },
  
  border: '#ff006e',
  shadow: 'rgba(255, 0, 110, 0.4)',
  highlight: '#ff006e',
  disabled: '#444'
}

export const RetroWaveTheme: Theme = {
  id: 'retro-wave',
  name: 'Retro Wave',
  description: '80s synthwave aesthetic with neon colors and grid patterns',
  
  colors: retroColors,
  
  typography: {
    fonts: {
      primary: '"Orbitron", sans-serif',
      secondary: '"Exo 2", sans-serif',
      monospace: '"Courier New", monospace'
    },
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    },
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    lineHeights: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75
    }
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    base: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem'
  },
  
  animations: {
    durations: {
      fast: '200ms',
      normal: '400ms',
      slow: '600ms'
    },
    easings: {
      linear: 'linear',
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out'
    }
  },
  
  components: {},
  
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  }
}

export default CyberpunkTheme