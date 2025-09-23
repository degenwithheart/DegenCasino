# 🎨 Layout Theme Creation Guide for DegenHeart Casino

Welcome to the comprehensive guide for creating custom layout themes on the DegenHeart Casino platform. This guide covers the layout-based theme system that allows you to completely customize the user interface structure and styling.

## 🏗️ Theme Architecture Overview

DegenHeart Casino uses a **layout-based theme system** where themes can override entire sections, components, and page layouts rather than just colors and styling. This provides maximum flexibility for creating unique user experiences.

### Core Technologies
- **React 18**: Component-based architecture
- **Styled Components**: Dynamic styling with theme context
- **TypeScript**: Type-safe theme definitions
- **Layout Themes**: Component and section overrides
- **Global Color Schemes**: Comprehensive color and animation systems

### Theme Structure

```typescript
export interface LayoutTheme {
  id: string;
  name: string;
  description: string;
  
  // Component overrides - each is optional, falls back to default if not provided
  components?: {
    Header?: React.ComponentType<any>;
    Footer?: React.ComponentType<any>;
    Sidebar?: React.ComponentType<any>;
  };
  
  // Section overrides
  sections?: {
    Dashboard?: React.ComponentType<any>;
    Game?: React.ComponentType<any>;
    UserProfile?: React.ComponentType<any>;
  };
  
  // Page overrides for routes
  pages?: {
    JackpotPage?: React.ComponentType<any>;
    BonusPage?: React.ComponentType<any>;
    LeaderboardPage?: React.ComponentType<any>;
    AdminPage?: React.ComponentType<any>;
    TermsPage?: React.ComponentType<any>;
    WhitepaperPage?: React.ComponentType<any>;
    SelectTokenPage?: React.ComponentType<any>;
    AllGamesPage?: React.ComponentType<any>;
  };
  
  // Layout-specific configuration
  config?: {
    enableSidebar?: boolean;
    headerStyle?: 'fixed' | 'sticky' | 'static';
    footerStyle?: 'fixed' | 'static' | 'hidden';
    maxWidth?: string;
    spacing?: 'compact' | 'normal' | 'spacious';
  };
}
```

## 📁 Project Structure

```
src/themes/
├── layouts/
│   ├── index.ts                    # Theme registry and types
│   ├── default/                    # Default layout (minimal overrides)
│   └── degenheart/                 # DegenHeart custom layout
│       ├── index.ts                # Theme exports
│       ├── theme.ts                # Theme definition
│       ├── DegenHeartLayout.tsx    # Main layout wrapper
│       ├── Header.tsx              # Custom header component
│       ├── Footer.tsx              # Custom footer component
│       ├── LeftSidebar.tsx         # Left sidebar component
│       ├── RightSidebar.tsx        # Right sidebar component
│       ├── MainContent.tsx         # Main content area
│       └── Game.tsx                # Game section override
├── globalColorSchemes.ts           # Color schemes and animations
└── ThemeContext.tsx               # Theme context provider
```

## 📋 Table of Contents

1. [Quick Start](#-quick-start)
2. [Real Implementation Examples](#-real-implementation-examples)
3. [Layout Theme Structure](#-layout-theme-structure)
4. [Component Overrides](#-component-overrides)
5. [Color Schemes & Animations](#-color-schemes--animations)
6. [Advanced Features](#-advanced-features)
7. [Integration & Testing](#-integration--testing)

---

## 🚀 Quick Start

### Step 1: Create Layout Theme Folder
```bash
mkdir src/themes/layouts/YourLayoutName
cd src/themes/layouts/YourLayoutName
```

### Step 2: Create Theme Definition
Copy and customize the template:

```bash
# Copy example files to your theme folder
cp guides/theme-creation/examples/types.ts src/themes/layouts/YourLayoutName/
```

```typescript
// src/themes/layouts/YourLayoutName/theme.ts
import { LayoutTheme } from '../index'
import { Header } from './index'
import { Footer } from './index'
import { Game } from './index'

export const yourLayoutTheme: LayoutTheme = {
  id: 'your-layout',
  name: 'Your Layout Name',
  description: 'Your custom layout description',
  
  components: {
    Header,
    Footer,
  },
  
  sections: {
    Game,
  },
  
  config: {
    enableSidebar: true,
    headerStyle: 'fixed',
    footerStyle: 'static',
    maxWidth: '100%',
    spacing: 'normal',
  },
}
```

### Step 3: Register Theme
Add your theme to `src/themes/layouts/index.ts`:

```typescript
import { yourLayoutTheme } from './your-layout/index';

export const AVAILABLE_LAYOUT_THEMES: Record<string, LayoutTheme> = {
  default: { /* ... */ },
  'degenheart': degenHeartTheme,
  'your-layout': yourLayoutTheme,  // Add your theme here
};
```

---

## 🎯 Real Implementation Examples

### DegenHeart Theme (Actual Implementation)

```typescript
// src/themes/layouts/degenheart/theme.ts
import { LayoutTheme } from '../index'
import { Header } from './index'
import { Footer } from './index'
import { Game } from './index'

export const degenHeartTheme: LayoutTheme = {
  id: 'degenheart',
  name: 'DegenHeart New',
  description: '3-Column layout',
  
  // The main layout wrapper component
  components: {
    Header,
    Footer,
  },
  
  // Sections with themed overrides
  sections: {
    Game,
  },
  
  config: {
    enableSidebar: true,
    headerStyle: 'fixed',
    footerStyle: 'fixed',
    maxWidth: '100%',
    spacing: 'normal',
  },
}
```

### Theme Export Structure

```typescript
// src/themes/layouts/degenheart/index.ts
export { default as DegenHeartLayout } from './DegenHeartLayout'
export { default as Header } from './Header'
export { default as Footer } from './Footer'
export { default as LeftSidebar } from './LeftSidebar'
export { default as RightSidebar } from './RightSidebar'
export { default as MainContent } from './MainContent'
export { default as Game } from './Game'
export { degenHeartTheme } from './theme'
```

### Available Layout Themes

The platform currently supports:

1. **Default Layout** (`default`):
   - 2-Column layout
   - Sticky header, static footer
   - No sidebar
   - Uses existing `src/components/` and `src/sections/`

---

## 🌈 Global Color Schemes & Animations

DegenHeart includes a sophisticated color scheme system with built-in animations and effects:

### Color Scheme Interface

```typescript
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
```

### Available Color Schemes

1. **Default Theme** - Classic casino gold and purple
2. **Cyberpunk Matrix** - Neural-linked cyber aesthetic with matrix green
3. **Casino Floor** - 3D casino atmosphere with velvet textures
4. **Crypto Trader Paradise** - Trading-focused theme with market colors
5. **Love Letters** - Romantic theme with soft pastels
6. **Pastel Dreams** - Dreamy soft color palette
7. **Midnight Ocean** - Deep blues and teals
8. **Sunset Vibes** - Warm oranges and pinks
9. **Neon Nightclub** - Electric neon colors
10. **Forest Zen** - Natural greens and earth tones

### Built-in Animations

```typescript
// Available keyframe animations
export const neonPulse = keyframes`...`
export const sparkle = keyframes`...`
export const moveGradient = keyframes`...`
export const float = keyframes`...`
export const hologram = keyframes`...`
export const typing = keyframes`...`
export const blink = keyframes`...`
export const rainbow = keyframes`...`
export const liquidFlow = keyframes`...`
export const dreamlikeFloat = keyframes`...`
export const etherealPulse = keyframes`...`
export const retroFlicker = keyframes`...`
```

---

## 🔧 Component Overrides

### Creating Custom Components

```typescript
// src/themes/layouts/your-layout/Header.tsx
import React from 'react';
import styled from 'styled-components';

const CustomHeader = styled.header`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem 2rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
`;

const Navigation = styled.nav`
  display: flex;
  gap: 2rem;
  
  a {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      color: white;
    }
  }
`;

const Header: React.FC = () => {
  return (
    <CustomHeader>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Logo>🎰 DegenHeart Casino</Logo>
        <Navigation>
          <a href="/">Home</a>
          <a href="/games">Games</a>
          <a href="/jackpot">Jackpot</a>
          <a href="/leaderboard">Leaderboard</a>
        </Navigation>
      </div>
    </CustomHeader>
  );
};

export default Header;
```

### Game Section Override

```typescript
// src/themes/layouts/your-layout/Game.tsx
import React from 'react';
import styled from 'styled-components';

const GameContainer = styled.div`
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(20, 20, 40, 0.9) 100%);
  border-radius: 15px;
  padding: 2rem;
  margin: 1rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const GameHeader = styled.div`
  margin-bottom: 1.5rem;
  text-align: center;
  
  h2 {
    color: #ffffff;
    margin: 0 0 0.5rem 0;
    font-size: 2rem;
  }
  
  p {
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
  }
`;

interface GameProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const Game: React.FC<GameProps> = ({ children, title, description }) => {
  return (
    <GameContainer>
      {(title || description) && (
        <GameHeader>
          {title && <h2>{title}</h2>}
          {description && <p>{description}</p>}
        </GameHeader>
      )}
      {children}
    </GameContainer>
  );
};

export default Game;
```
  error: string
  info: string
  
  // Background colors
  background: {
    primary: string
    secondary: string
    overlay: string
    glass: string
  }
  
  // Text colors
  text: {
    primary: string
    secondary: string
    muted: string
    inverse: string
  }
  
  // Component colors
  border: string
  shadow: string
  highlight: string
  disabled: string
}
```

### 2. Typography System
Define fonts and text styles:

```typescript
export interface Typography {
  fonts: {
    primary: string
    secondary: string
    monospace: string
  }
  
  sizes: {
    xs: string
    sm: string
    base: string
    lg: string
    xl: string
    '2xl': string
    '3xl': string
    '4xl': string
  }
  
  weights: {
    light: number
    normal: number
    medium: number
    semibold: number
    bold: number
  }
  
  lineHeights: {
    tight: number
    normal: number
    relaxed: number
  }
}
```

### 3. Component Styling
Custom styled components for the theme:

```typescript
export interface ComponentStyles {
  Button: StyledButtonProps
  Card: StyledCardProps
  Modal: StyledModalProps
  Input: StyledInputProps
  // ... other components
}
```

---

## 💡 Implementation Examples

### Example 1: Cyberpunk Theme

```typescript
// src/themes/Cyberpunk/theme.ts
import { Theme } from '../types'
import { cyberpunkColors } from './colors'
import { cyberpunkComponents } from './components'
import { cyberpunkAnimations } from './animations'

export const CyberpunkTheme: Theme = {
  id: 'cyberpunk',
  name: 'Cyberpunk 2077',
  description: 'Neon-soaked futuristic theme with glitch effects',
  
  colors: cyberpunkColors,
  
  typography: {
    fonts: {
      primary: '"Orbitron", "Courier New", monospace',
      secondary: '"Rajdhani", sans-serif',
      monospace: '"Fira Code", monospace'
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
  
  animations: cyberpunkAnimations,
  components: cyberpunkComponents,
  
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  }
}

export default CyberpunkTheme
```

```typescript
// src/themes/Cyberpunk/colors.ts
export const cyberpunkColors = {
  // Brand colors
  primary: '#00ff9f',      // Neon green
  secondary: '#ff0080',     // Hot pink
  accent: '#00d4ff',       // Cyber blue
  
  // Semantic colors
  success: '#00ff9f',
  warning: '#ffcc00',
  error: '#ff0080',
  info: '#00d4ff',
  
  // Background colors
  background: {
    primary: '#0a0a0a',
    secondary: '#1a1a1a',
    overlay: 'rgba(0, 0, 0, 0.9)',
    glass: 'rgba(0, 255, 159, 0.1)'
  },
  
  // Text colors
  text: {
    primary: '#ffffff',
    secondary: '#00ff9f',
    muted: '#666666',
    inverse: '#000000'
  },
  
  // Component colors
  border: '#00ff9f',
  shadow: 'rgba(0, 255, 159, 0.5)',
  highlight: '#00ff9f',
  disabled: '#333333'
}
```

```typescript
// src/themes/Cyberpunk/components.ts
import styled, { css, keyframes } from 'styled-components'

// Glitch animation
const glitch = keyframes`
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-2px); }
  40% { transform: translateX(2px); }
  60% { transform: translateX(-1px); }
  80% { transform: translateX(1px); }
`

// Neon glow animation
const neonGlow = keyframes`
  0%, 100% { 
    box-shadow: 
      0 0 5px #00ff9f,
      0 0 10px #00ff9f,
      0 0 15px #00ff9f;
  }
  50% { 
    box-shadow: 
      0 0 10px #00ff9f,
      0 0 20px #00ff9f,
      0 0 30px #00ff9f;
  }
`

export const CyberpunkButton = styled.button`
  background: linear-gradient(45deg, #0a0a0a, #1a1a1a);
  border: 2px solid #00ff9f;
  color: #00ff9f;
  padding: 12px 24px;
  font-family: 'Orbitron', monospace;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(0, 255, 159, 0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    animation: ${neonGlow} 1.5s infinite alternate;
    
    &:before {
      left: 100%;
    }
  }
  
  &:active {
    animation: ${glitch} 0.3s;
  }
  
  &:disabled {
    border-color: #333;
    color: #333;
    cursor: not-allowed;
    
    &:hover {
      animation: none;
    }
  }
`

export const CyberpunkCard = styled.div`
  background: linear-gradient(135deg, 
    rgba(0, 255, 159, 0.1) 0%,
    rgba(0, 0, 0, 0.8) 25%,
    rgba(255, 0, 128, 0.1) 100%
  );
  border: 1px solid rgba(0, 255, 159, 0.3);
  border-radius: 8px;
  padding: 20px;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, #00ff9f, transparent);
    animation: ${keyframes`
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    `} 3s infinite;
  }
  
  &:hover {
    border-color: #00ff9f;
    box-shadow: 0 0 20px rgba(0, 255, 159, 0.3);
  }
`

export const CyberpunkInput = styled.input`
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid #00ff9f;
  border-radius: 4px;
  padding: 12px 16px;
  color: #ffffff;
  font-family: 'Fira Code', monospace;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #00d4ff;
    box-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
  }
  
  &::placeholder {
    color: #666;
  }
`

export const cyberpunkComponents = {
  Button: CyberpunkButton,
  Card: CyberpunkCard,
  Input: CyberpunkInput,
  // ... more components
}
```

### Example 2: Retro Wave Theme

```typescript
// src/themes/RetroWave/theme.ts
export const RetroWaveTheme: Theme = {
  id: 'retro-wave',
  name: 'Retro Wave',
  description: '80s synthwave aesthetic with grid patterns',
  
  colors: {
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
  },
  
  // ... rest of theme configuration
}
```

### Example 3: Minimal Clean Theme

```typescript
// src/themes/MinimalClean/theme.ts
export const MinimalCleanTheme: Theme = {
  id: 'minimal-clean',
  name: 'Minimal Clean',
  description: 'Clean, minimal design focused on usability',
  
  colors: {
    primary: '#2563eb',
    secondary: '#64748b',
    accent: '#0891b2',
    
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626',
    info: '#0891b2',
    
    background: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      overlay: 'rgba(0, 0, 0, 0.5)',
      glass: 'rgba(255, 255, 255, 0.8)'
    },
    
    text: {
      primary: '#1e293b',
      secondary: '#475569',
      muted: '#94a3b8',
      inverse: '#ffffff'
    },
    
    border: '#e2e8f0',
    shadow: 'rgba(0, 0, 0, 0.1)',
    highlight: '#2563eb',
    disabled: '#94a3b8'
  },
  
  // ... rest of theme configuration
}
```

---

## 🎨 Advanced Theming

### 1. Dynamic Color Generation
Create dynamic color variations:

```typescript
// src/themes/utils/colorUtils.ts
export function generateColorVariations(baseColor: string) {
  // Implementation to generate lighter/darker variations
  return {
    50: lighten(baseColor, 0.9),
    100: lighten(baseColor, 0.8),
    200: lighten(baseColor, 0.6),
    300: lighten(baseColor, 0.4),
    400: lighten(baseColor, 0.2),
    500: baseColor,
    600: darken(baseColor, 0.2),
    700: darken(baseColor, 0.4),
    800: darken(baseColor, 0.6),
    900: darken(baseColor, 0.8),
  }
}
```

### 2. CSS Custom Properties
Use CSS variables for dynamic theming:

```typescript
export function generateCSSVariables(theme: Theme): string {
  return `
    :root {
      --color-primary: ${theme.colors.primary};
      --color-secondary: ${theme.colors.secondary};
      --color-background: ${theme.colors.background.primary};
      --font-primary: ${theme.typography.fonts.primary};
      --spacing-base: ${theme.spacing.base};
      // ... all theme values
    }
  `
}
```

### 3. Animation Libraries
Create reusable animation sets:

```typescript
// src/themes/animations/index.ts
export const commonAnimations = {
  fadeIn: keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
  `,
  
  slideUp: keyframes`
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  `,
  
  pulse: keyframes`
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  `
}
```

### 4. Responsive Design
Implement responsive utilities:

```typescript
export const mediaQueries = {
  mobile: `@media (max-width: 768px)`,
  tablet: `@media (max-width: 1024px)`,
  desktop: `@media (min-width: 1025px)`,
}

export const responsive = {
  mobile: (styles: string) => css`
    ${mediaQueries.mobile} {
      ${styles}
    }
  `,
  // ... other breakpoints
}
```

---

## 🧪 Integration & Testing

### 1. Theme Provider Setup
```typescript
// src/contexts/ThemeContext.tsx
import React, { createContext, useContext, useState } from 'react'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { AVAILABLE_THEMES } from '../themes/themeRegistry'

const ThemeContext = createContext({})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState('default')
  
  const theme = AVAILABLE_THEMES[currentTheme]
  
  return (
    <ThemeContext.Provider value={{ currentTheme, setCurrentTheme }}>
      <StyledThemeProvider theme={theme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
```

### 2. Theme Switching
```typescript
// src/components/ThemeSelector.tsx
import React from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { AVAILABLE_THEMES } from '../themes/themeRegistry'

export function ThemeSelector() {
  const { currentTheme, setCurrentTheme } = useTheme()
  
  return (
    <select 
      value={currentTheme} 
      onChange={(e) => setCurrentTheme(e.target.value)}
    >
      {Object.entries(AVAILABLE_THEMES).map(([id, theme]) => (
        <option key={id} value={id}>
          {theme.name}
        </option>
      ))}
    </select>
  )
}
```

### 3. Theme Testing
```typescript
// src/themes/__tests__/themeTests.ts
import { validateTheme } from '../utils/validation'
import { CyberpunkTheme } from '../Cyberpunk'

describe('Cyberpunk Theme', () => {
  test('should have all required properties', () => {
    expect(validateTheme(CyberpunkTheme)).toBe(true)
  })
  
  test('should have valid color values', () => {
    expect(CyberpunkTheme.colors.primary).toMatch(/^#[0-9a-f]{6}$/i)
  })
})
```

---

## ✅ Best Practices

### 1. Design Consistency
- **Color Harmony**: Use tools like Adobe Color or Coolors.co
- **Typography Scale**: Maintain consistent type hierarchy
- **Spacing System**: Use multiples of base spacing unit
- **Component Variants**: Create consistent component variations

### 2. Performance
- **CSS-in-JS Optimization**: Use styled-components' ThemeProvider
- **Asset Optimization**: Compress theme assets (images, fonts)
- **Lazy Loading**: Load theme assets on demand
- **Critical CSS**: Inline critical theme styles

### 3. Accessibility
- **Color Contrast**: Ensure WCAG AA compliance (4.5:1 ratio)
- **Focus States**: Provide clear focus indicators
- **Screen Readers**: Use semantic HTML and ARIA labels
- **Motion Sensitivity**: Respect `prefers-reduced-motion`

### 4. Maintainability
- **Design Tokens**: Use consistent naming conventions
- **Documentation**: Document theme usage and variants
- **Version Control**: Version themes for breaking changes
- **Testing**: Test themes across different devices/browsers

### 5. User Experience
- **Theme Persistence**: Save user theme preference
- **Smooth Transitions**: Animate theme switches
- **Loading States**: Handle theme loading gracefully
- **Fallbacks**: Provide default theme as fallback

---

## 📚 Reference Examples

### Theme Registry
```typescript
// src/themes/themeRegistry.ts
import DefaultTheme from './Default'
import CyberpunkTheme from './Cyberpunk'
import RetroWaveTheme from './RetroWave'
import MinimalCleanTheme from './MinimalClean'

export const AVAILABLE_THEMES = {
  default: DefaultTheme,
  cyberpunk: CyberpunkTheme,
  'retro-wave': RetroWaveTheme,
  'minimal-clean': MinimalCleanTheme,
} as const

export type ThemeId = keyof typeof AVAILABLE_THEMES
```

### Theme Utilities
```typescript
// src/themes/utils/index.ts
export { generateColorVariations } from './colorUtils'
export { generateCSSVariables } from './cssUtils'
export { validateTheme } from './validation'
export { commonAnimations } from './animations'
export { mediaQueries, responsive } from './responsive'
```

### Global Styles
```typescript
// src/themes/GlobalStyles.ts
import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    font-family: ${props => props.theme.typography.fonts.primary};
    background: ${props => props.theme.colors.background.primary};
    color: ${props => props.theme.colors.text.primary};
    line-height: ${props => props.theme.typography.lineHeights.normal};
  }
  
  button {
    font-family: inherit;
  }
`
```

---

## 🎯 Next Steps

1. **Choose Base Theme**: Start with closest existing theme
2. **Define Color Palette**: Create cohesive color scheme
3. **Design Components**: Style key UI components
4. **Test Accessibility**: Ensure proper contrast and usability
5. **Optimize Performance**: Test loading times and animations
6. **Document Usage**: Create theme documentation
7. **Gather Feedback**: Test with real users

Happy theming! 🎨