# Hello World Game Template 🌍

> Built to fast-track and streamline new DegenCasino game builds.
> Platform repo: https://github.com/degenwithheart/DegenCasino

A comprehensive game template specifically designed for the DegenCasino platform, showcasing modern game development patterns and best practices. This template exists to fast‑track and streamline new game builds by providing production-ready structure, components, and UX patterns that integrate seamlessly with the platform.

## Platform Compatibility

⚠️ Important: This template is designed for the DegenCasino platform and is NOT compatible with the original `gamba-labs/platform` codebase. DegenCasino uses a heavily refactored architecture:
- Custom Vite build system with polyfills and Node-browser shims
- React Router-based navigation with custom route patterns
- styled-components as primary styling system
- Custom UI/UX components and game shells
- Zustand state management
- DegenCasino-specific token/pool configurations

## Overview

This Hello World template is based on the proven Flip game architecture from DegenCasino and includes all the features you need to build a professional gambling game:
- Portal System Integration: Modern layout system using `GambaUi.Portal`
- Live Statistics: Real-time game analytics and session tracking
- Thinking Overlays: Enhanced UX with celebration and mourning phases
- Responsive Design: Mobile-first approach with automatic paytable hiding
- Sound Integration: Audio feedback for enhanced user experience
- Multiple Strategies: Lucky (safer) and Risky (higher payout) options

## Files Structure

### Core Files (5 total)
1. `HelloWorld.tsx` – Main game component with Portal integration
2. `HelloWorldPaytable.tsx` – Live statistics and session analytics
3. `HelloWorldOverlays.tsx` – Thinking system with celebration/mourning overlays
4. `betArray.ts` – Game mathematics and payout configurations
5. `README.md` – This documentation file

## Game Mechanics

### Betting Options
- 🍀 Lucky Strategy: 33% win chance, 2x multiplier (safer option)
- 🎯 Risky Strategy: 20% win chance, 3x multiplier (higher risk/reward)

### Win Conditions
Players choose a strategy and place their wager. The game randomly selects an outcome based on the chosen strategy's probability distribution.

## Technical Features

### Portal System
```tsx
<GambaUi.Portal target="screen">
  {/* Main game area */}
</GambaUi.Portal>

<GameControls>
  {/* Control panel */}
</GameControls>
```

### Overlay System
- Thinking Phase: Shows animated emoji with "thinking" message
- Dramatic Pause: Brief suspenseful moment before result
- Celebration: Multi-level celebration based on win amount
- Mourning: Encouraging overlay for losses

### Live Statistics
- Session wins/losses tracking
- Win rate percentage
- Biggest win multiplier
- Strategy usage breakdown
- Current win/loss streak
- Recent results history
- Profit/Loss tracking

### Responsive Design
- Desktop: Full game area with live paytable sidebar
- Mobile: Game area only (paytable hidden automatically)
- Adaptive scaling based on screen size

## Game Flow

1. Strategy Selection: Player chooses Lucky or Risky
2. Wager Input: Player sets their bet amount
3. Play Action: Game starts with thinking overlay
4. Result Processing: Dramatic pause followed by outcome
5. Celebration/Mourning: Appropriate overlay based on result
6. Statistics Update: Live paytable updates with new data

## Customization Guide

### Changing Game Mechanics
Edit `betArray.ts` to modify:
- Win probabilities
- Payout multipliers
- Add new strategies

### Visual Customization
- Main Game: Modify the gradient and styling in `HelloWorld.tsx`
- Overlays: Customize celebration intensity and animations in `HelloWorldOverlays.tsx`
- Statistics: Adjust paytable layout and metrics in `HelloWorldPaytable.tsx`

### Sound Integration
Add your own sound effects by updating the `useSound` configuration:
```tsx
const sounds = useSound({
  win: '/sounds/your-win-sound.mp3',
  lose: '/sounds/your-lose-sound.mp3',
  play: '/sounds/your-play-sound.mp3',
})
```

## Dependencies

### DegenCasino Platform Requirements
This template requires the DegenCasino platform architecture, which includes:
- Vite Build System: Custom configuration with Node polyfills
- React Router: Multi-page navigation with custom route patterns (`/game/:wallet/:gameName`)
- styled-components: Primary styling system (Tailwind available for utilities)
- Zustand: State management via `useUserStore`
- Custom Gamba Integration: DegenCasino-specific provider setup

### Required Hooks (DegenCasino-specific)
- `useIsCompact` – Responsive design detection
- `useGameOutcome` – Game result management
- `useWagerInput` – Bet amount handling
- `useCurrentToken` – Token management
- `useTokenBalance` – Balance tracking
- `useSound` – Audio management

### Required Components (DegenCasino-specific)
- `GameControls` – Control panel component
- `overlayUtils` – Overlay helper functions

### Required Constants (DegenCasino-specific)
- `TOKEN_METADATA` – Token configuration data (includes SOL, USDC, JUP, BONK, DGHRT)

## Integration Steps

### For DegenCasino Platform

1. Copy Folder: Copy the entire `HelloWorld` folder and rename it to your game name (e.g., `MyNewGame`) within the DegenCasino project structure at `src/games/YourGameName/`
2. Update Imports: Ensure all dependency paths match DegenCasino's architecture:
   ```tsx
   // Import paths should match DegenCasino structure
   import { useIsCompact } from '../../hooks/useIsCompact'
   import { GameControls } from '../../components'
   import { TOKEN_METADATA } from '../../constants'
   ```
3. Register Game: Add to DegenCasino's game registry following the platform's routing pattern:
   ```tsx
   // Route: /game/:wallet/helloworld
   { path: 'helloworld', component: HelloWorld }
   ```
4. Update Game List: Add to `src/games/allGames.ts` and `src/games/featuredGames.ts`
5. Test Components: Verify all overlays and statistics work with DegenCasino's build system
6. Customize: Modify styling using styled-components to match your brand

### Build Considerations
- Vite Configuration: Works with DegenCasino's custom Vite setup including polyfills
- styled-components: Primary styling system (avoid conflicts with Tailwind utilities)
- State Management: Integrates with Zustand store patterns
- Routing: Compatible with React Router and DegenCasino's navigation structure

## Best Practices
- State Management: Use React hooks for clean state handling
- Performance: Implement proper memo and callback optimizations
- Accessibility: Include appropriate ARIA labels for screen readers
- Error Handling: Wrap game logic in try-catch blocks
- Analytics: Track user interactions for game improvement

## Troubleshooting

### Common Issues
- Import Errors: Ensure all dependency paths match DegenCasino's project structure
- Build Failures: Verify compatibility with DegenCasino's Vite configuration and polyfills
- Styling Conflicts: Use styled-components primarily; minimal Tailwind for utilities only
- Overlay Not Showing: Check that `overlayUtils` functions are properly imported from DegenCasino's utils
- Statistics Not Updating: Verify the paytable ref is properly connected
- Mobile Layout Issues: Confirm `useIsCompact` hook is working with DegenCasino's responsive system
- Routing Issues: Ensure game routes follow DegenCasino's pattern (`/game/:wallet/:gameName`)

### Platform-Specific Tips
- Token Integration: Use DegenCasino's TOKEN_METADATA (SOL, USDC, JUP, BONK, DGHRT)
- State Persistence: Leverage Zustand store patterns for consistent user experience
- Error Boundaries: Utilize DegenCasino's GlobalErrorBoundary for error handling
- Performance: Follow DegenCasino's chunking and optimization patterns

### Performance Tips
- Large Games: Consider implementing virtual scrolling for result history
- Memory Management: Clear old results after reaching a certain limit
- Animation Performance: Use CSS transforms instead of changing layout properties

## Related repositories

- DegenCasino (Platform)
  - The platform this template targets, including the build system, routing, providers, and UI components.
  - Repo: https://github.com/degenwithheart/DegenCasino

## License

This template is provided as part of the DegenCasino platform. Use and modify as needed for your gaming projects within the DegenCasino ecosystem.

Note: This template is specifically designed for DegenCasino's architecture and is not compatible with the original `gamba-labs/platform` due to significant architectural differences in build system, routing, and providers.

---

Happy Gaming! 🎮  
For more information about DegenCasino's platform architecture, see the main project README.md. For Gamba v2 SDK documentation, visit the official Gamba documentation.