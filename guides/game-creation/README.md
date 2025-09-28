# 🎮 Game Creation Guide for DegenHeart Casino

Welcome to the comprehensive guide for creating custom games on the DegenHeart Casino platform. This guide will walk you through the architecture, patterns, and implementation details needed to create professional-grade casino games.

## 🏗️ Game Architecture Overview

DegenHeart Casino uses a modular game architecture built on top of the Gamba SDK v2, with sophisticated features including dual rendering modes, advanced audio systems, and enterprise-grade state management.

### Core Technologies
- **Gamba SDK v2**: Provably fair gaming engine
- **React 18**: Component-based architecture with Suspense
- **TypeScript**: Type-safe development
- **Three.js**: 3D graphics and physics
- **Styled Components**: Dynamic theming
- **Zustand**: State management

### Game Bundle Structure

Every game implements the `GameBundle` interface:

```typescript
export type GameBundle = {
  id: string;
  live: 'up' | 'down' | 'new';
  meta: {
    name: string;
    image: string;
    background: string;
    description: string;
    effect?: string;
    [key: string]: any;
  };
  app: React.LazyExoticComponent<React.ComponentType<any>>;
  maintenance?: boolean;
  creating?: boolean;
  [key: string]: any;
};
```

## 📁 Project Structure

```
src/games/
├── allGames.ts              # Game registry
├── featuredGames.ts         # Featured game definitions
├── types.ts                 # Shared type definitions
├── rtpConfig-v2.ts         # RTP configurations
└── YourGame-v2/            # Individual game folder (v2 naming pattern)
    ├── index.tsx           # Main game wrapper with dual renderers
    ├── YourGame-v2-2D.tsx  # 2D renderer implementation
    ├── YourGame-v2-3D.tsx  # 3D renderer implementation
    ├── constants.ts        # Game constants and audio imports
    ├── sharedLogic.ts      # Shared game logic between renderers
    ├── Slider.tsx          # Custom UI components
    └── assets/            # Audio assets
        ├── play.mp3
        ├── win.mp3
        ├── lose.mp3
        └── tick.mp3
```

## 📋 Table of Contents

1. [Quick Start](#-quick-start)
2. [Game Structure](#-game-structure)
3. [Core Concepts](#-core-concepts)
4. [Implementation Examples](#-implementation-examples)
5. [Advanced Features](#-advanced-features)
6. [Testing & Integration](#-testing--integration)
7. [Best Practices](#-best-practices)

---

## 🚀 Quick Start

### Step 1: Create Game Folder
```bash
mkdir src/games/YourGameName
cd src/games/YourGameName
```

### Step 2: Use Template
Copy the modern template from the examples folder:

```bash
# Copy the modern template files
cp guides/game-creation/examples/ModernGameTemplate.tsx src/games/YourGameName/index.tsx
cp guides/game-creation/examples/ModernGameTemplate-2D.tsx src/games/YourGameName/YourGameName-2D.tsx
cp guides/game-creation/examples/ModernGameTemplate-3D.tsx src/games/YourGameName/YourGameName-3D.tsx
cp guides/game-creation/examples/ModernConstants.ts src/games/YourGameName/constants.ts
```

### Step 3: Register Game
Add your game to `src/games/allGames.ts`:

```typescript
{
  id: 'your-game-name',
  live: 'new',
  meta: {
    name: 'Your Game Name',
    background: '#000000CC',
    image: '/webp/games/your-game.webp',
    description: 'Your game description...',
    tag: 'Singleplayer',
  },
  app: React.lazy(() => import('./YourGameName')),
}
```

---

## 🏗️ Game Structure

### Required Files
```
src/games/YourGameName/
├── index.tsx              # Main game component (required)
├── types.ts               # Game-specific TypeScript types
├── constants.ts           # Game configuration constants
├── hooks/                 # Custom game hooks
│   ├── useGameLogic.ts    # Core game logic
│   └── useGameAnimation.ts # Animation/visual hooks
├── components/            # Game-specific components
│   ├── GameBoard.tsx      # Main game board
│   ├── GameControls.tsx   # Custom controls
│   └── GameEffects.tsx    # Visual effects
└── utils/                 # Game utilities
    ├── gameHelpers.ts     # Helper functions
    └── calculations.ts    # Math/probability calculations
```

### Game Metadata
Every game needs metadata in `allGames.ts`:

```typescript
interface GameMeta {
  name: string              // Display name
  background: string        // Background color/gradient
  image: string            // Game thumbnail (webp format)
  description: string      // Rich description for game page
  tag: 'Singleplayer' | 'Multiplayer' | 'Social'
}
```

---

## 🎯 Core Concepts

### 1. Gamba Integration
All games use the Gamba SDK for provably fair gaming:

```typescript
import { useGamba } from 'gamba-react-v2'
import { GambaUi } from 'gamba-react-ui-v2'

const gamba = useGamba()
const game = GambaUi.useGame()

// Playing a game
await game.play({
  wager: lamports,          // Bet amount in lamports
  bet: [0, 2, 0, 4],       // Payout multipliers array
})

const result = await game.result() // Wait for result
```

### 2. Portal System
DegenHeart uses a portal system for layout:

```typescript
// Game statistics header
<GambaUi.Portal target="stats">
  <GameStatsHeader />
</GambaUi.Portal>

// Main game screen
<GambaUi.Portal target="screen">
  <YourGameContent />
</GambaUi.Portal>

// Game controls
<GambaUi.Portal target="controls">
  <YourGameControls />
</GambaUi.Portal>
```

### 3. Canvas Rendering
For visual games, use the Canvas system:

```typescript
const renderCanvas = useCallback(({ ctx, size, clock }) => {
  ctx.clearRect(0, 0, size.width, size.height)
  
  // Your drawing logic here
  ctx.fillStyle = "#1a1a2e"
  ctx.fillRect(0, 0, size.width, size.height)
}, [dependencies])

<GambaUi.Canvas render={renderCanvas} />
```

### 4. State Management
Use React hooks for game state:

```typescript
const [gameState, setGameState] = useState('idle') // 'idle' | 'playing' | 'finished'
const [gameData, setGameData] = useState({})
const [animation, setAnimation] = useState(null)
```

---

## 🎯 Real Game Examples

Let's examine how actual games in the platform are structured:

### Magic 8-Ball Game (Magic8Ball)
```typescript
// src/games/allGames.ts entry
{
  id: 'magic8ball',
  live: 'up',
  meta: {
    name: 'Magic 8-Ball',
    description: 'Consult the mystical Magic 8-Ball oracle and let cosmic forces reveal your fortune!',
    image: '/png/games/dice.png',
    background: '/webp/games/dice.webp',
  },
  app: lazy(() => import('./Magic8Ball')),
}

// src/games/Magic8Ball/index.tsx (Wrapper)
import React from 'react'
import { useUserStore } from '../../hooks/data/useUserStore'
import { GAME_CAPABILITIES } from '../../constants'
import { useGameSEO } from '../../hooks/ui/useGameSEO'

const Magic8BallRenderer2D = React.lazy(() => import('./Magic8Ball-2D'))
const Magic8BallRenderer3D = React.lazy(() => import('./Magic8Ball-3D'))

const Magic8BallGame: React.FC = () => {
  const seoHelmet = useGameSEO({
    gameName: "Magic 8-Ball",
    description: "Consult the mystical Magic 8-Ball oracle!",
    rtp: 95,
    maxWin: "100x"
  })

  const currentMode = useUserStore(state => state.getGameRenderMode('magic8ball'))
  const gameCapabilities = GAME_CAPABILITIES['magic8ball']
  
  const shouldUse2D = currentMode === '2D' && gameCapabilities.supports2D
  const shouldUse3D = currentMode === '3D' && gameCapabilities.supports3D
  const effectiveMode = shouldUse2D ? '2D' : shouldUse3D ? '3D' : '2D'

  return (
    <div key={`magic8ball-${effectiveMode}`}>
      {seoHelmet}
      <React.Suspense fallback={<div>Loading Magic 8-Ball game...</div>}>
        {effectiveMode === '2D' ? <Magic8BallRenderer2D /> : <Magic8BallRenderer3D />}
      </React.Suspense>
    </div>
  )
}

// src/games/Magic8Ball/constants.ts (Audio & Config)
import { BET_ARRAYS_V2 } from '../rtpConfig-v2'
export const OUTCOMES = BET_ARRAYS_V2['magic8ball'].OUTCOMES

export { default as SOUND_LOSE } from './lose.mp3'
export { default as SOUND_TICK } from './tick.mp3'
export { default as SOUND_PLAY } from './play.mp3'
export { default as SOUND_WIN } from './win.mp3'
```

### Available Games in Platform
The platform currently features 16 professional games:
- **Dice-v2**: Classic dice rolling with customizable odds
- **Flip-v2**: Coin flipping with smooth animations  
- **Mines**: Mine sweeper with risk/reward mechanics
- **Plinko**: Physics-based ball dropping game
- **Limbo-v2**: Multiplier prediction game
- **Slots**: Multi-reel slot machine
- **Roulette**: European roulette implementation
- **BlackJack-v2**: Professional blackjack with card counting
- **Keno-v2**: Number selection lottery game
- **HiLo**: Card prediction game
- **CrashGame**: Multiplier crash prediction
- **MultiPoker-v2**: Multiple poker variants
- **DoubleOrNothing-v2**: Risk doubling game
- **CryptoChartGame-v2**: Cryptocurrency chart prediction
- **FancyVirtualHorseRacing-v2**: 3D horse racing simulation
- **PlinkoRace**: Competitive plinko racing
            </button>
            <button 
              onClick={() => setSelectedSide('tails')}
              disabled={gamba.isPlaying}
              style={{
                margin: '0 10px',
                padding: '10px 20px',
                backgroundColor: selectedSide === 'tails' ? '#ffd700' : '#333',
                color: selectedSide === 'tails' ? '#000' : '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Tails
            </button>
          </div>
        </div>
      </GambaUi.Portal>

      <GambaUi.Portal target="controls">
        <GambaUi.WagerInput value={wager} onChange={setWager} />
        <GambaUi.PlayButton onClick={play} disabled={gamba.isPlaying}>
          {gamba.isPlaying ? 'Flipping...' : 'Flip Coin'}
        </GambaUi.PlayButton>
      </GambaUi.Portal>
    </>
  )
}
```

### Example 2: Dice Game with Animation

```typescript
// src/games/AnimatedDice/index.tsx
import React, { useState, useCallback, useRef, useEffect } from 'react'
import { GambaUi, useWagerInput } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'

export default function AnimatedDice() {
  const gamba = useGamba()
  const [wager, setWager] = useWagerInput()
  const game = GambaUi.useGame()
  
  const [targetNumber, setTargetNumber] = useState(6)
  const [diceValue, setDiceValue] = useState(1)
  const [isRolling, setIsRolling] = useState(false)
  const [result, setResult] = useState<number | null>(null)
  
  const animationRef = useRef<number>()
  const rollStartTime = useRef<number>()

  const play = async () => {
    setIsRolling(true)
    setResult(null)
    rollStartTime.current = Date.now()
    
    // Start dice animation
    const animate = () => {
      const elapsed = Date.now() - rollStartTime.current!
      if (elapsed < 2000) { // Roll for 2 seconds
        setDiceValue(Math.floor(Math.random() * 6) + 1)
        animationRef.current = requestAnimationFrame(animate)
      }
    }
    animate()
    
    try {
      // Create bet array - win if dice shows target number or higher
      const bet = Array(6).fill(0)
      for (let i = targetNumber - 1; i < 6; i++) {
        bet[i] = 6 / (6 - targetNumber + 1) // Adjust payout based on probability
      }
      
      await game.play({ wager, bet })
      const gameResult = await game.result()
      
      const finalValue = gameResult.resultIndex + 1
      setDiceValue(finalValue)
      setResult(finalValue)
      
    } catch (error) {
      console.error('Game error:', error)
    } finally {
      setIsRolling(false)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }

  const renderCanvas = useCallback(({ ctx, size }) => {
    ctx.clearRect(0, 0, size.width, size.height)
    
    const centerX = size.width / 2
    const centerY = size.height / 2
    const diceSize = 80
    
    // Draw dice
    ctx.fillStyle = '#fff'
    ctx.fillRect(centerX - diceSize/2, centerY - diceSize/2, diceSize, diceSize)
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 2
    ctx.strokeRect(centerX - diceSize/2, centerY - diceSize/2, diceSize, diceSize)
    
    // Draw dots based on dice value
    ctx.fillStyle = '#000'
    const dotSize = 8
    const positions = getDotPositions(diceValue, centerX, centerY, diceSize)
    
    positions.forEach(([x, y]) => {
      ctx.beginPath()
      ctx.arc(x, y, dotSize/2, 0, 2 * Math.PI)
      ctx.fill()
    })
    
    // Draw target indicator
    ctx.fillStyle = result !== null ? 
      (result >= targetNumber ? '#00ff00' : '#ff0000') : 
      '#ffd700'
    ctx.font = '16px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(`Target: ${targetNumber}+`, centerX, centerY + diceSize/2 + 30)
    
  }, [diceValue, targetNumber, result])

  return (
    <>
      <GambaUi.Portal target="screen">
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <GambaUi.Canvas render={renderCanvas} />
          
          {/* Target Selection */}
          <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)' }}>
            {[1, 2, 3, 4, 5, 6].map(num => (
              <button
                key={num}
                onClick={() => setTargetNumber(num)}
                disabled={gamba.isPlaying}
                style={{
                  margin: '0 5px',
                  padding: '8px 12px',
                  backgroundColor: targetNumber === num ? '#ffd700' : '#333',
                  color: targetNumber === num ? '#000' : '#fff',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                {num}+
              </button>
            ))}
          </div>
        </div>
      </GambaUi.Portal>

      <GambaUi.Portal target="controls">
        <GambaUi.WagerInput value={wager} onChange={setWager} />
        <GambaUi.PlayButton onClick={play} disabled={gamba.isPlaying}>
          {gamba.isPlaying ? 'Rolling...' : 'Roll Dice'}
        </GambaUi.PlayButton>
      </GambaUi.Portal>
    </>
  )
}

// Helper function for dice dot positions
function getDotPositions(value: number, centerX: number, centerY: number, size: number): [number, number][] {
  const offset = size * 0.25
  const positions: [number, number][] = []
  
  switch (value) {
    case 1:
      positions.push([centerX, centerY])
      break
    case 2:
      positions.push([centerX - offset, centerY - offset])
      positions.push([centerX + offset, centerY + offset])
      break
    case 3:
      positions.push([centerX - offset, centerY - offset])
      positions.push([centerX, centerY])
      positions.push([centerX + offset, centerY + offset])
      break
    case 4:
      positions.push([centerX - offset, centerY - offset])
      positions.push([centerX + offset, centerY - offset])
      positions.push([centerX - offset, centerY + offset])
      positions.push([centerX + offset, centerY + offset])
      break
    case 5:
      positions.push([centerX - offset, centerY - offset])
      positions.push([centerX + offset, centerY - offset])
      positions.push([centerX, centerY])
      positions.push([centerX - offset, centerY + offset])
      positions.push([centerX + offset, centerY + offset])
      break
    case 6:
      positions.push([centerX - offset, centerY - offset])
      positions.push([centerX + offset, centerY - offset])
      positions.push([centerX - offset, centerY])
      positions.push([centerX + offset, centerY])
      positions.push([centerX - offset, centerY + offset])
      positions.push([centerX + offset, centerY + offset])
      break
  }
  
  return positions
}
```

---

## 🎨 Advanced Features

### 1. Three.js Integration
For 3D games, integrate Three.js:

```typescript
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function ThreeDGame() {
  return (
    <GambaUi.Portal target="screen">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />
        {/* Your 3D content */}
      </Canvas>
    </GambaUi.Portal>
  )
}
```

### 2. Sound Integration
Add audio feedback:

```typescript
import { useSound } from 'gamba-react-ui-v2'

const sounds = useSound({
  win: '/sounds/win.mp3',
  lose: '/sounds/lose.mp3',
  play: '/sounds/play.mp3',
  tick: '/sounds/tick.mp3',
})

// Play sounds on events
sounds.play.play()
sounds.win.play()
```

### 3. Particle Effects
Use the effects system:

```typescript
import GameplayFrame, { GameplayEffectsRef } from '../../components/Game/GameplayFrame'

const effectsRef = useRef<GameplayEffectsRef>(null)

// Trigger effects
effectsRef.current?.triggerWin()
effectsRef.current?.triggerLoss()
```

### 4. Multiplayer Games
For multiplayer functionality:

```typescript
import { useMultiplayer } from '@gamba-labs/multiplayer-sdk'

const { room, players, sendMessage } = useMultiplayer({
  gameId: 'your-game',
  maxPlayers: 4
})
```

---

## 🧪 Testing & Integration

### 1. Local Testing
```bash
npm run dev
# Navigate to http://localhost:4001/game/yourwallet/your-game-name
```

### 2. Add to Game Registry
Update `src/games/allGames.ts`:

```typescript
{
  id: 'your-game-name',
  live: 'new', // 'up' | 'down' | 'new'
  meta: {
    name: 'Your Game Name',
    background: '#000000CC',
    image: '/webp/games/your-game.webp',
    description: 'Detailed game description...',
    tag: 'Singleplayer',
  },
  app: React.lazy(() => import('./YourGameName')),
}
```

### 3. Asset Setup
- Add game thumbnail: `public/webp/games/your-game.webp`
- Add sound files: `public/sounds/your-game/`
- Optimize images: Use WebP format, max 200KB

### 4. RTP Configuration
Add to `src/games/rtpConfig-v2.ts`:

```typescript
'your-game-name': {
  rtp: 0.95, // 95% return to player
  house: 0.05, // 5% house edge
}
```

---

## ✅ Best Practices

### 1. Code Organization
- **Single Responsibility**: One component per file
- **Custom Hooks**: Extract game logic into hooks
- **Type Safety**: Use TypeScript for all game logic
- **Error Handling**: Wrap async operations in try-catch

### 2. Performance
- **Lazy Loading**: Use React.lazy for game components
- **Canvas Optimization**: Use useCallback for render functions
- **State Management**: Minimize re-renders with proper state structure
- **Asset Optimization**: Compress images and audio files

### 3. User Experience
- **Loading States**: Show loading indicators during gameplay
- **Error Messages**: Provide clear feedback for errors
- **Responsive Design**: Support both mobile and desktop
- **Accessibility**: Add proper ARIA labels and keyboard support

### 4. Game Design
- **Clear Rules**: Make game mechanics obvious
- **Fair Odds**: Use appropriate RTP values (85-98%)
- **Visual Feedback**: Animate results and state changes
- **Sound Design**: Use audio to enhance experience

### 5. Security
- **Input Validation**: Validate all user inputs
- **Bet Limits**: Enforce reasonable betting limits
- **Error Recovery**: Handle network failures gracefully
- **Client-Side Only**: Never trust client-side calculations for payouts

---

## 📚 Reference Links

- [Gamba SDK Documentation](https://docs.gamba.so)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Canvas API Reference](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [DegenHeart Components](../../src/components/README.md)

---

## 🎯 Next Steps

1. **Start with Template**: Copy and modify the boilerplate
2. **Build Incrementally**: Start simple, add features gradually
3. **Test Thoroughly**: Test on both mobile and desktop
4. **Get Feedback**: Share with community for testing
5. **Optimize**: Profile and optimize performance
6. **Deploy**: Add to production game registry

Happy building! 🚀