# 🎮 Game Creation Examples

This folder contains working examples and templates for creating games on the DegenHeart Casino platform.

## 📁 File Overview

### Modern Templates (Recommended)
- **`ModernGameTemplate.tsx`** - Main wrapper component with dual renderer support
- **`ModernGameTemplate-2D.tsx`** - 2D Canvas implementation following actual patterns
- **`ModernGameTemplate-3D.tsx`** - 3D Three.js implementation template
- **`ModernConstants.ts`** - Constants file matching actual game structure

### Legacy Templates
- **`GameTemplate.tsx`** - Original template (comprehensive but outdated)
- **`constants.ts`** - Original constants file
- **`types.ts`** - TypeScript definitions

## 🚀 Quick Start

### 1. Copy Modern Template
```bash
# Navigate to your game folder
cd src/games/YourGame-v2/

# Copy the modern template files
cp ../../../guides/game-creation/examples/ModernGameTemplate.tsx ./index.tsx
cp ../../../guides/game-creation/examples/ModernGameTemplate-2D.tsx ./YourGame-v2-2D.tsx
cp ../../../guides/game-creation/examples/ModernGameTemplate-3D.tsx ./YourGame-v2-3D.tsx
cp ../../../guides/game-creation/examples/ModernConstants.ts ./constants.ts
```

### 2. Customize the Template
1. **Update the game ID**: Change `'modern-game-template'` to your game's ID
2. **Modify game logic**: Update the bet array and game mechanics in the 2D renderer
3. **Add audio files**: Place your `win.mp3`, `lose.mp3`, `play.mp3`, `tick.mp3` in the game folder
4. **Update constants**: Modify `GAME_CONFIG` with your game's settings

### 3. Register Your Game
Add your game to `src/games/allGames.ts`:

```typescript
{
  id: 'your-game-v2',
  live: 'new',
  meta: {
    name: 'Your Game Name',
    description: 'Your game description...',
    image: '/png/games/your-game.png',
    background: '/webp/games/your-game.webp',
  },
  app: lazy(() => import('./YourGame-v2')),
}
```

## 🎯 Template Comparison

| Feature | Modern Template | Legacy Template |
|---------|----------------|-----------------|
| **Structure** | ✅ Matches actual games | ❌ Outdated pattern |
| **Dual Renderers** | ✅ Lazy loading pattern | ❌ Single component |
| **Audio System** | ✅ MP3 imports | ❌ Path strings |
| **SEO Integration** | ✅ useGameSEO hook | ❌ No SEO |
| **User Preferences** | ✅ Render mode detection | ❌ Manual switching |
| **Game Capabilities** | ✅ Capabilities system | ❌ No capabilities |

## 💡 Development Tips

### Audio Integration
```typescript
// Place audio files in your game folder:
// YourGame-v2/
// ├── win.mp3
// ├── lose.mp3
// ├── play.mp3
// └── tick.mp3

// Import in constants.ts:
export { default as SOUND_WIN } from './win.mp3'
```

### Game Capabilities
Add your game to `src/constants.ts`:
```typescript
export const GAME_CAPABILITIES = {
  // ... existing games
  'your-game-v2': {
    supports2D: true,
    supports3D: false,
    defaultMode: '2D'
  }
}
```

### Canvas Rendering
```typescript
const renderCanvas = useCallback(({ ctx, size, clock }) => {
  // Clear and set background
  ctx.clearRect(0, 0, size.width, size.height);
  
  // Your game rendering logic here
  // Use clock for animations: Math.sin(clock * 0.005)
}, [gameState, dependencies]);
```

## 🔧 Troubleshooting

### Common Issues
1. **Audio not playing**: Ensure audio files are in the correct format (MP3) and imported properly
2. **Render mode not switching**: Check that `GAME_CAPABILITIES` is defined in constants
3. **SEO errors**: Make sure `useGameSEO` hook is available in your environment
4. **Canvas not updating**: Verify dependencies array in `useCallback` for `renderCanvas`

### File Structure Validation
Your game folder should look like this:
```
src/games/YourGame-v2/
├── index.tsx                 # Main wrapper (from ModernGameTemplate.tsx)
├── YourGame-v2-2D.tsx       # 2D renderer
├── YourGame-v2-3D.tsx       # 3D renderer (optional)
├── constants.ts             # Game constants and audio imports
├── sharedLogic.ts           # Shared logic between renderers (optional)
├── win.mp3                  # Audio files
├── lose.mp3
├── play.mp3
└── tick.mp3
```

## 📚 Next Steps

1. Read the main [Game Creation Guide](../README.md)
2. Study existing games in `src/games/` for patterns
3. Test your game in both 2D and 3D modes
4. Optimize for mobile devices
5. Add comprehensive error handling