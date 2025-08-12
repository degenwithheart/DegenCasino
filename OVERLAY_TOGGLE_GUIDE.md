# Thinking Overlay Toggle System

This document explains how to use the global thinking overlay toggle system across all games in the DegenCasino project.

## Overview

The thinking overlay system allows you to globally enable/disable the dramatic thinking animations and overlays that appear during gameplay across all 20+ games. This is controlled by a single constant in `src/constants.ts`.

## Configuration

### Main Toggle

In `src/constants.ts`:

```typescript
// Feature toggle for enabling/disabling the thinking overlay animations.
export const ENABLE_THINKING_OVERLAY = true
```

Set this to `false` to disable all thinking overlays across all games.

## Usage

### Method 1: Using the Utility Functions (Recommended)

Import the utility functions in your game component:

```typescript
import { renderThinkingOverlay, getThinkingPhaseState, getGamePhaseState } from '../../utils/overlayUtils'
```

Then wrap your overlay component:

```typescript
{/* Conditionally render overlay based on ENABLE_THINKING_OVERLAY */}
{renderThinkingOverlay(
  <YourGameOverlays
    gamePhase={getGamePhaseState(gamePhase)}
    thinkingPhase={getThinkingPhaseState(thinkingPhase)}
    dramaticPause={dramaticPause}
    celebrationIntensity={celebrationIntensity}
    currentWin={currentWin}
    thinkingEmoji={thinkingEmoji}
  />
)}
```

### Method 2: Using the HOC Pattern

For a cleaner approach, you can wrap your entire overlay component:

```typescript
import { withOverlayToggle } from '../../utils/overlayUtils'
import YourGameOverlays from './YourGameOverlays'

const ConditionalGameOverlays = withOverlayToggle(YourGameOverlays)

// Then use it normally:
<ConditionalGameOverlays
  gamePhase={gamePhase}
  thinkingPhase={thinkingPhase}
  // ... other props
/>
```

### Method 3: Using the Hook

For more complex logic where you need to know if overlays are enabled:

```typescript
import { useOverlayEnabled } from '../../utils/overlayUtils'

function YourGameComponent() {
  const overlayEnabled = useOverlayEnabled()
  
  // Skip overlay-related state updates if disabled
  const setGamePhase = (phase) => {
    if (!overlayEnabled && phase === 'thinking') {
      return // Skip thinking phase if overlays disabled
    }
    // ... rest of logic
  }
}
```

## Available Utility Functions

### `renderThinkingOverlay(overlayJSX: React.ReactNode): React.ReactNode`
Conditionally renders the provided JSX based on the toggle state.

### `getThinkingPhaseState(thinkingPhase: boolean): boolean`
Returns the thinking phase state only if overlays are enabled, otherwise returns false.

### `getGamePhaseState(gamePhase): gamePhase | 'idle'`
Returns the game phase state only if overlays are enabled, otherwise returns 'idle'.

### `withOverlayToggle<P>(OverlayComponent: React.ComponentType<P>)`
Higher-order component that wraps overlay components and conditionally renders them.

### `useOverlayEnabled(): boolean`
Hook that returns whether overlays are currently enabled.

### `shouldShowThinkingOverlay(): boolean`
Direct function to check if overlays should be shown.

## Games That Currently Support This System

The following games have been updated to use the overlay toggle system:

- ✅ BlackJack (automated implementation)
- ✅ CrashGame (automated implementation)
- ✅ CryptoChartGame (automated implementation)
- ✅ Dice (example implementation)
- ✅ DiceRoll (automated implementation)
- ✅ DoubleOrNothing (automated implementation)
- ✅ FancyVirtualHorseRacing (automated implementation)
- ✅ Flip (example implementation)
- ✅ HiLo (manual implementation)
- ✅ Keno (automated implementation)
- ✅ Limbo (manual implementation)
- ✅ LuckyNumber (automated implementation)
- ✅ Mines (manual implementation)
- ✅ Plinko (manual implementation)
- ✅ ProgressivePoker (automated implementation)
- ✅ Roulette (example implementation)
- ✅ Scissors (automated implementation)
- ✅ Slide (automated implementation)
- ✅ Slots (manual implementation - special case)
- ✅ WheelSpin (automated implementation)

**All 20 games now support the overlay toggle system!**

## Implementation Example

Here's a complete example of how to update a game to use the overlay toggle system:

```typescript
// Before
import GameOverlays from './GameOverlays'

export default function YourGame() {
  // ... game logic

  return (
    <>
      {/* Game UI */}
      
      <GameOverlays
        gamePhase={gamePhase}
        thinkingPhase={thinkingPhase}
        // ... other props
      />
    </>
  )
}

// After
import GameOverlays from './GameOverlays'
import { renderThinkingOverlay, getThinkingPhaseState, getGamePhaseState } from '../../utils/overlayUtils'

export default function YourGame() {
  // ... game logic

  return (
    <>
      {/* Game UI */}
      
      {renderThinkingOverlay(
        <GameOverlays
          gamePhase={getGamePhaseState(gamePhase)}
          thinkingPhase={getThinkingPhaseState(thinkingPhase)}
          // ... other props
        />
      )}
    </>
  )
}
```

## Performance Considerations

When overlays are disabled:
- No overlay components are rendered (saves React render cycles)
- No overlay-related animations or timeouts are triggered
- Game state can skip thinking phases entirely for faster gameplay
- Memory usage is reduced as overlay CSS and animations aren't loaded

## Testing

To test the toggle:

1. **Enable overlays**: Set `ENABLE_THINKING_OVERLAY = true` in `src/constants.ts`
2. **Build and run**: `npm run build && npm run dev`
3. Play any game - you should see thinking overlays with animations
4. **Disable overlays**: Set `ENABLE_THINKING_OVERLAY = false` in `src/constants.ts` 
5. **Rebuild and run**: `npm run build && npm run dev`
6. Play the same game - overlays should be completely hidden
7. Game should still function normally, just without the dramatic animations

**Quick test command:**
```bash
# Test with overlays enabled
echo "export const ENABLE_THINKING_OVERLAY = true" >> src/constants.ts
npm run build

# Test with overlays disabled  
sed -i 's/ENABLE_THINKING_OVERLAY = true/ENABLE_THINKING_OVERLAY = false/' src/constants.ts
npm run build
```

## Migration Guide

To update a game to use this system:

1. Import the overlay utilities
2. Wrap your overlay component with `renderThinkingOverlay()`
3. Use `getThinkingPhaseState()` and `getGamePhaseState()` for state props
4. Test both enabled and disabled states
5. Update this documentation to mark the game as ✅ supported
