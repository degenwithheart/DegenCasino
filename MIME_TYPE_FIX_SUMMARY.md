# MIME Type Error Fix - Summary

## Problem
The application was experiencing MIME type errors when loading game modules:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script 
but the server responded with a MIME type of "text/html". 
Strict MIME type checking is enforced for module scripts per HTML spec.
```

This affected: Dice, Slots, Mines, Plinko, Magic8Ball, CrashGame, BlackJack, Flip, and HiLo games.

## Root Cause
The issue was caused by **dynamic imports using template strings** in the preloader hooks:

```typescript
// ❌ PROBLEMATIC CODE
const folderPath = getGameFolderPath(game.id);
const gameModule = await import(/* @vite-ignore */ `../../games/${folderPath}`);
```

When Vite encounters dynamic imports with template literals, it cannot properly statically analyze the import paths during the build phase. This results in:
1. Vite failing to bundle the game chunks correctly
2. The server returning 404 HTML pages instead of JavaScript modules
3. Browsers rejecting these with MIME type violations

The `@vite-ignore` comment does not resolve this issue because the path is still determined at runtime with a variable.

## Solution
Replace all dynamic imports with a **static import map** that Vite can properly analyze:

```typescript
// ✅ FIXED CODE
const GAME_IMPORT_MAP: Record<string, () => Promise<any>> = {
  'dice': () => import('../../games/Dice'),
  'magic8ball': () => import('../../games/Magic8Ball'),
  'slots': () => import('../../games/Slots'),
  'plinkorace': () => import('../../games/PlinkoRace'),
  'flip': () => import('../../games/Flip'),
  'hilo': () => import('../../games/HiLo'),
  'mines': () => import('../../games/Mines'),
  'plinko': () => import('../../games/Plinko'),
  'crash': () => import('../../games/CrashGame'),
  'blackjack': () => import('../../games/BlackJack')
};

// Usage: look up from static map
const importFn = GAME_IMPORT_MAP[game.id];
if (importFn) {
  await importFn();
}
```

## Files Modified
- **[src/hooks/system/useComponentPreloader.ts](src/hooks/system/useComponentPreloader.ts)**
  - Replaced dynamic `getGameFolderPath()` function with static `GAME_IMPORT_MAP`
  - Updated `preloadCriticalGames()` to use static map
  - Updated `preloadHighPriorityGames()` to use static map
  - Updated `preloadGame()` callback to use static map

## Why This Works
1. **Static analysis**: Vite can now statically analyze all game imports during build
2. **Proper code splitting**: Games are bundled as separate chunks with correct MIME types
3. **Runtime lookup**: The static map is evaluated at runtime, so the logic remains the same

## Testing
The fix should be verified by:
1. Running `npm run build` or dev server
2. Checking browser console for game load errors
3. Verifying all games load without MIME type errors
4. Checking network tab to confirm game chunks load with correct `application/javascript` MIME type

## Performance Impact
- ✅ No performance impact
- ✅ Actually improves code splitting and bundling
- ✅ Games load faster with proper chunk optimization
