# 📚 DegenHeart Casino Development Guides

Comprehensive development guides for extending and customizing DegenHeart Casino.

## 🎮 Game Creation Guide

**Path:** [`/guides/game-creation/`](./game-creation/)

Learn how to create custom games for the DegenHeart Casino platform with complete examples and best practices.

### What's Included:
- 📋 **Complete Guide** - Step-by-step game creation process
- 🎯 **Game Template** - Production-ready boilerplate code
- 📝 **TypeScript Types** - Game-specific type definitions
- ⚙️ **Configuration** - Game constants and settings
- 💡 **Examples** - Working examples (Coin Flip, Animated Dice)
- 🎨 **3D Integration** - Three.js and advanced graphics
- 🔊 **Audio System** - Sound effects and music integration
- 🎲 **Gamba SDK** - Provably fair gaming implementation

### Quick Start:
```bash
# Copy the template
cp guides/game-creation/GameTemplate.tsx src/games/YourGame/index.tsx

# Register your game
# Edit src/games/allGames.ts to add your game

# Start developing
npm run dev
```

---

## 🎨 Theme Creation Guide

**Path:** [`/guides/theme-creation/`](./theme-creation/)

Create stunning custom themes with comprehensive styling systems and visual effects.

### What's Included:
- 🎨 **Complete Guide** - Theme architecture and implementation
- 📐 **Theme Structure** - Organized file structure and patterns
- 🌈 **Color Systems** - Advanced color management and accessibility
- ✨ **Component Library** - Styled components and variants
- 🎬 **Animations** - Keyframes, transitions, and effects
- 📱 **Responsive Design** - Mobile-first responsive utilities
- 🔧 **Utility Functions** - Helper functions and tools
- 🎯 **Examples** - Cyberpunk, Retro Wave, and Minimal themes

## 📋 Examples & Templates

### 🎮 Game Creation Examples
Located in [`guides/game-creation/examples/`](./game-creation/examples/):
- **ModernGameTemplate.tsx** - Updated wrapper component with dual renderer support
- **ModernGameTemplate-2D.tsx** - 2D Canvas implementation following actual patterns  
- **ModernGameTemplate-3D.tsx** - 3D Three.js implementation template
- **ModernConstants.ts** - Constants file matching actual game structure
- **GameTemplate.tsx** - Legacy template (comprehensive but outdated)
- **types.ts** & **constants.ts** - Original template files

### 🎨 Layout Theme Examples  
Located in [`guides/theme-creation/examples/`](./theme-creation/examples/):
- **types.ts** - TypeScript definitions for layout themes
- **ThemeExamples.tsx** - Working theme component examples
- **utils.ts** - Theme utility functions and helpers

**⚠️ Important**: The modern templates have been corrected to match the actual implementation patterns used in the DegenHeart Casino platform, including:
- Dual renderer pattern with lazy loading (following Dice-v2 structure)
- Audio import structure following actual game patterns
- SEO integration with useGameSEO hook
- User store integration for render mode preferences  
- Game capabilities system
- Layout-based theming instead of component-based

### 📚 Quick Links
- [Game Creation Examples README](./game-creation/examples/README.md)
- [Theme Creation Examples README](./theme-creation/examples/README.md)

---

## 🏗️ Architecture Overview

Both guides follow DegenHeart Casino's enterprise-grade architecture:

### 🎮 Game Architecture
```
Game Component
├── Gamba Integration (Provably Fair)
├── Canvas Rendering (2D/3D Graphics)
├── Sound System (Dynamic Audio)
├── State Management (React Hooks)
├── Animation Engine (Keyframes/Transitions)
└── Portal System (Layout Management)
```

### 🎨 Layout Theme Architecture
```
Layout Theme System
├── Component Overrides (Header, Footer, Sidebar)
├── Section Overrides (Game, Dashboard, Profile)
├── Page Overrides (Full page customization)
├── Layout Configuration (Sidebar, Header style)
├── Global Color Schemes (10+ built-in themes)
└── Animation Library (20+ keyframe animations)
```

---

## 🚀 Advanced Features

### Game Development
- **🎲 Provably Fair**: Gamba SDK integration for transparent gaming
- **🎮 Multiplayer**: Real-time multiplayer game support
- **🎨 3D Graphics**: Three.js integration for immersive experiences
- **🔊 Audio Engine**: Dynamic sound effects and background music
- **📱 Mobile Optimized**: Touch controls and responsive design
- **⚡ Performance**: Optimized rendering and state management

### Theme Development
- **🌈 Color Science**: WCAG accessibility and contrast validation
- **✨ Visual Effects**: Gradients, shadows, and transparency
- **🎬 Micro-interactions**: Hover states, transitions, and animations
- **📐 Design Systems**: Consistent spacing, typography, and components
- **🔧 Developer Tools**: Utilities, helpers, and debugging tools
- **💾 Persistence**: Theme preferences and user customization

---

## 📖 Learning Path

### 🎯 Beginner
1. Start with the **Game Template** - understand the basic structure
2. Modify colors and text in existing themes
3. Create simple games (Coin Flip, Dice)
4. Learn the portal system and state management

### 🚀 Intermediate  
1. Build complex games with animations
2. Create custom themes with unique visual effects
3. Integrate 3D graphics and advanced audio
4. Implement responsive design patterns

### 🏆 Advanced
1. Develop multiplayer games with real-time features
2. Create theme systems with dynamic color generation
3. Build performance-optimized rendering systems
4. Contribute to the core platform architecture

---

## 🛠️ Development Tools

### Recommended Setup
- **VS Code** with TypeScript and React extensions
- **Node.js** 20.12.0+ for development server
- **Git** for version control and collaboration
- **Chrome DevTools** for debugging and performance

### Useful Commands
```bash
# Development
npm run dev              # Start development server
npm run build:analyze    # Analyze bundle size
npm run monitor          # Monitor RPC health

# Game Development
npm run dev              # Hot reload for rapid development
# Navigate to: http://localhost:4001/game/wallet/your-game

# Theme Development  
npm run dev              # Live theme switching
# Use theme selector in app settings
```

---

## 📚 Additional Resources

### 🔗 External Documentation
- **[Gamba SDK Docs](https://docs.gamba.so)** - Provably fair gaming
- **[Three.js Docs](https://threejs.org/docs/)** - 3D graphics library
- **[Styled Components](https://styled-components.com/)** - CSS-in-JS styling
- **[React Router](https://reactrouter.com/)** - Client-side routing

### 🎯 DegenHeart Specific
- **[Component Library](../src/components/)** - Reusable UI components
- **[Hook Library](../src/hooks/)** - Custom React hooks
- **[Utility Functions](../src/utils/)** - Helper functions
- **[Constants](../src/constants.ts)** - Platform configuration

---

## 🤝 Contributing

We welcome contributions to improve these guides:

### 📝 Documentation
- Fix typos and improve clarity
- Add more examples and use cases
- Create video tutorials and walkthroughs
- Translate guides to other languages

### 💡 Examples
- Create additional game templates
- Design new theme examples
- Build integration examples
- Develop debugging utilities

### 🐛 Issues & Feedback
- Report bugs in examples or documentation
- Suggest improvements and new features
- Share your creations with the community
- Provide feedback on developer experience

---

## 📄 License

These guides are part of DegenHeart Casino and are released under the **MIT License**.

Feel free to use, modify, and distribute these guides and examples in your own projects.

---

**🎰 Happy Building!**

*Create the next generation of on-chain gaming experiences with DegenHeart Casino.*