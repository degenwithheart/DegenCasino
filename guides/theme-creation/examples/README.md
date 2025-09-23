# 🎨 Theme Creation Examples

This folder contains working examples and templates for creating layout themes on the DegenHeart Casino platform.

## 📁 File Overview

### Theme System Files
- **`types.ts`** - TypeScript definitions for layout themes
- **`ThemeExamples.tsx`** - Working theme component examples
- **`utils.ts`** - Theme utility functions and helpers

## 🚀 Quick Start

### 1. Create Your Layout Theme
```bash
# Navigate to layouts folder
cd src/themes/layouts/

# Create your theme folder
mkdir your-theme-name
cd your-theme-name

# Copy example files
cp ../../../guides/theme-creation/examples/types.ts ./
```

### 2. Basic Theme Structure
Create these files in your theme folder:

```
src/themes/layouts/your-theme-name/
├── index.ts              # Export all components
├── theme.ts              # Theme definition
├── YourThemeLayout.tsx   # Main layout wrapper (optional)
├── Header.tsx            # Custom header component
├── Footer.tsx            # Custom footer component
├── LeftSidebar.tsx       # Left sidebar (optional)
├── RightSidebar.tsx      # Right sidebar (optional)
├── MainContent.tsx       # Main content area (optional)
└── Game.tsx              # Game section override (optional)
```

### 3. Theme Definition Template
```typescript
// theme.ts
import { LayoutTheme } from '../index'
import { Header, Footer, Game } from './index'

export const yourTheme: LayoutTheme = {
  id: 'your-theme-name',
  name: 'Your Theme Display Name',
  description: 'Brief description of your theme',
  
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

### 4. Register Your Theme
Add to `src/themes/layouts/index.ts`:

```typescript
import { yourTheme } from './your-theme-name/index';

export const AVAILABLE_LAYOUT_THEMES: Record<string, LayoutTheme> = {
  default: { /* ... */ },
  'degenheart': degenHeartTheme,
  'your-theme-name': yourTheme,  // Add your theme here
};
```

## 🎯 Available Layout Themes

### Current Themes
1. **Default Layout** (`default`):
   - 2-Column layout
   - Sticky header, static footer
   - No sidebar
   - Uses existing `src/components/` and `src/sections/`

2. **DegenHeart Layout** (`degenheart`):
   - 3-Column layout
   - Fixed header and footer
   - Left and right sidebars enabled
   - Custom components for Header, Footer, Game sections

## 🌈 Global Color Schemes

The platform includes 10+ built-in color schemes you can use:

### Available Schemes
1. **Default Theme** - Classic casino gold and purple
2. **Cyberpunk Matrix** - Neural-linked cyber aesthetic
3. **Casino Floor** - 3D casino atmosphere with velvet textures
4. **Crypto Trader Paradise** - Trading-focused theme
5. **Love Letters** - Romantic theme with soft pastels
6. **Pastel Dreams** - Dreamy soft color palette
7. **Midnight Ocean** - Deep blues and teals
8. **Sunset Vibes** - Warm oranges and pinks
9. **Neon Nightclub** - Electric neon colors
10. **Forest Zen** - Natural greens and earth tones

### Using Color Schemes
```typescript
import { defaultColorScheme, cyberpunkColorScheme } from '../../globalColorSchemes';

// Apply colors in your styled components
const StyledHeader = styled.header`
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.text};
`;
```

## 💡 Component Override Examples

### Custom Header Component
```typescript
// Header.tsx
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

const Header: React.FC = () => {
  return (
    <CustomHeader>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>🎰 Your Casino</div>
        <nav>
          <a href="/">Home</a>
          <a href="/games">Games</a>
        </nav>
      </div>
    </CustomHeader>
  );
};

export default Header;
```

### Custom Game Section
```typescript
// Game.tsx
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

interface GameProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const Game: React.FC<GameProps> = ({ children, title, description }) => {
  return (
    <GameContainer>
      {(title || description) && (
        <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          {title && <h2 style={{ color: '#ffffff', margin: '0 0 0.5rem 0' }}>{title}</h2>}
          {description && <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: '0' }}>{description}</p>}
        </div>
      )}
      {children}
    </GameContainer>
  );
};

export default Game;
```

## 🔧 Configuration Options

### Layout Config
```typescript
config: {
  enableSidebar: boolean,        // Show/hide sidebar
  headerStyle: 'fixed' | 'sticky' | 'static',
  footerStyle: 'fixed' | 'static' | 'hidden',
  maxWidth: string,              // Container max width
  spacing: 'compact' | 'normal' | 'spacious',
}
```

### Override Levels
1. **Components**: Header, Footer, Sidebar
2. **Sections**: Dashboard, Game, UserProfile
3. **Pages**: JackpotPage, BonusPage, LeaderboardPage, etc.

## 📚 Built-in Animations

Use these keyframe animations in your components:

```typescript
import { neonPulse, sparkle, float, hologram } from '../../globalColorSchemes';

const AnimatedElement = styled.div`
  animation: ${neonPulse} 2s ease-in-out infinite;
`;
```

Available animations:
- `neonPulse`, `sparkle`, `moveGradient`, `float`
- `hologram`, `typing`, `blink`, `rainbow`
- `liquidFlow`, `dreamlikeFloat`, `etherealPulse`
- `retroFlicker`, `marketPrayer`, `candlestickSerenade`

## 🔧 Troubleshooting

### Common Issues
1. **Theme not appearing**: Check theme registration in `AVAILABLE_LAYOUT_THEMES`
2. **Components not overriding**: Ensure correct export names and structure
3. **Styling conflicts**: Use CSS specificity or `!important` for overrides
4. **Layout breaking**: Verify container structure and CSS grid/flexbox

### Development Tips
1. **Start simple**: Override one component at a time
2. **Use existing patterns**: Study the DegenHeart theme implementation
3. **Test responsiveness**: Ensure mobile compatibility
4. **Performance**: Minimize re-renders and optimize styled components

## 📚 Next Steps

1. Read the main [Theme Creation Guide](../README.md)
2. Study the DegenHeart theme in `src/themes/layouts/degenheart/`
3. Experiment with global color schemes
4. Create responsive layouts for mobile devices
5. Add custom animations and transitions