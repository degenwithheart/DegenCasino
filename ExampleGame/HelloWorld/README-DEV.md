# DegenCasino Game Development Guide

Welcome to the **DegenCasino Game Development Guide**! This document is your all-in-one, ultra-detailed, and ever-evolving reference for building, styling, testing, and maintaining games in the DegenCasino project. Whether you are a seasoned developer or a total beginner, this README will walk you through every step, every pattern, and every best practice used in the codebase.

---

## Table of Contents

1. [Introduction & Philosophy](#introduction--philosophy)
2. [Onboarding Checklist](#onboarding-checklist)
3. [Project Structure Deep Dive](#project-structure-deep-dive)
4. [Modern Hooks: `useGameOutcome` & `useIsCompact`](#4-modern-hooks-architecture)
5. [Layout Standardization: Why and How](#2-layout-standardization-why-and-how)
6. [GameControls Component: The Standard for All Games](#3-gamecontrols-component-the-standard-for-all-games)
7. [Mobile Responsiveness: Best Practices](#4-mobile-responsiveness-best-practices)
8. [Game Template Boilerplate: Step-by-Step Guide](#5-game-template-boilerplate-step-by-step-guide)
9. [Advanced Topics](#advanced-topics)
10. [Troubleshooting & FAQ](#troubleshooting--faq)
11. [Glossary](#glossary)
12. [How to Contribute](#how-to-contribute)
13. [Code Review Checklist](#code-review-checklist)
14. [Appendix: Full Example Game](#appendix-full-example-game)

---

## Introduction & Philosophy

### What is DegenCasino?
DegenCasino is a modern, modular, and highly extensible casino game platform built with React, TypeScript, and the Gamba game engine. The project is designed to:

- Enable rapid development of new games with minimal boilerplate
- Ensure a consistent, beautiful, and responsive user experience across all games
- Centralize and standardize all layout, controls, and token logic
- Make it easy for anyone (even beginners) to contribute new games or improve existing ones

### Why This Guide Exists
Over time, casino game codebases can become messy, inconsistent, and hard to maintain. DegenCasino solves this by:

- Providing a single source of truth for layout, controls, and responsive logic
- Eliminating code duplication and anti-patterns
- Documenting every pattern, prop, and hook in one place
- Empowering new contributors to get started quickly and confidently

### Who Should Use This Guide?
- **New Developers:** Learn the project structure, patterns, and how to build your first game from scratch.
- **Experienced Contributors:** Deep-dive into advanced topics, performance, and best practices.
- **Designers & QA:** Understand how layout, controls, and responsiveness are handled.
- **Reviewers:** Use the code review checklist to ensure every PR meets project standards.

---

## Onboarding Checklist

Before you start building, make sure you:

1. **Clone the Repository:**
  ```sh
  git clone https://github.com/degenwithheart/DegenCasino.git
  cd DegenCasino
  ```
2. **Install Dependencies:**
  ```sh
  npm install
  # or
  yarn install
  ```
3. **Familiarize Yourself with the Project Structure:**
  - See [Project Structure Deep Dive](#project-structure-deep-dive)
4. **Read This README:**
  - This file contains everything you need to know!
5. **Run the Development Server:**
  ```sh
  npm run dev
  # or
  yarn dev
  ```
6. **Open the App in Your Browser:**
  - Visit [http://localhost:3000](http://localhost:3000)
7. **Try Editing a Game:**
  - Open any file in `src/games/` and make a change. Hot reload should work instantly.
8. **Create Your First Game:**
  - Follow the [Game Template Boilerplate](#5-game-template-boilerplate-step-by-step-guide) section.

---

## Project Structure Deep Dive

Here’s a breakdown of the most important folders and files in the DegenCasino project:

```
DegenCasino/
├── src/
│   ├── components/         # Shared UI components (GameControls, Modal, etc.)
│   ├── context/            # React contexts (GambaResultContext, etc.)
│   ├── games/              # All individual game folders (DiceRoll, Plinko, etc.)
│   ├── hooks/              # Custom React hooks (useIsCompact, useGameOutcome, etc.)
│   ├── constants/          # Token metadata, global constants
│   ├── styles/             # Global styles and theme
│   └── ...
├── public/                 # Static assets (images, videos, icons)
├── package.json            # Project dependencies and scripts
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
└── ...
```

### Key Files Explained
- **Portal System:** Games use `GambaUi.Portal` targets instead of custom layout components
- **src/components/GameControls.tsx:** The universal controls component for wagers, play, etc.
- **src/hooks/useIsCompact.ts:** The hook for responsive logic (mobile/desktop).
- **src/hooks/useGameOutcome.ts:** Handles overlays and post-game state.
- **src/constants/TOKEN_METADATA.ts:** Metadata for all supported tokens.
- **src/games/**: Each game lives in its own folder with an `index.tsx` entry point.

---

## Gamba API & Game Engine

### What is Gamba?
Gamba is an on-chain Solana program for provably fair, single-step games. It provides a secure, transparent way to build games of chance, such as coin flips, slots, and crash games, with instant settlement and cryptographic fairness.

#### Core Concepts
- **Pool**: Liquidity pool holding tokens for payouts.
- **Wager**: Amount the player bets.
- **RNG Seed**: Cryptographic hash (SHA-256) from Gamba's RNG provider, used for randomness.
- **Client Seed**: User-generated random seed, adjustable for fairness.
- **Nonce**: Unique, sequential number incremented per bet to prevent replay attacks.
- **Bet Array**: Array of multipliers (e.g., [2, 0] for coin flip) that determines possible outcomes and payouts.

#### Game Flow
1. **User places a bet**: Specifies wager, bet array, client seed, etc.
2. **Gamba runs RNG**: Selects a result index from the bet array using cryptographic randomness.
3. **Result index determines payout**: Multiplier from bet array is applied to wager.
4. **Settlement**: Gamba returns the result and credits the player if a payout is due.

#### Provable Fairness
- Before betting, the player receives a hash of the RNG seed.
- The player can change their client seed to affect the outcome.
- After the game, the actual RNG seed is revealed, allowing verification.

#### Bet Array Examples
- `[2, 0]`: Coin toss (double or lose)
- `[0, 2]`: Fair bet with equal odds
- `[1.5, 0.5]`: Fair bet with equal odds
- `[0, 0, 0, 0, 5]`: Fair bet with varied odds

#### Limitations
- All games are resolved in a single transaction.
- No support for custom player hands, mid-game actions, or multi-step gameplay.
- The engine determines the outcome and payout; games must fit the "one bet, one result" model.

### GambaProvider: The Main API

`GambaProvider` is a provider class for interacting with the Gamba program. Handles transactions, user accounts, pools, and gameplay.

#### Props:
- `gambaProgram`: anchor.Program<Gamba>
- `anchorProvider`: anchor.AnchorProvider
- `wallet`: GambaProviderWallet

#### Methods:
- `constructor(connection: Connection, wallet: GambaProviderWallet, opts?: ConfirmOptions)`: Initializes the provider.
- `static fromAnchorProvider(provider: anchor.AnchorProvider)`: Instantiates from an AnchorProvider.
- `get user`: Returns the current user's PublicKey.
- `createPool(underlyingTokenMint: PublicKey, authority: PublicKey, slot: number)`: Creates a new pool.
- `depositToPool(pool: PublicKey, underlyingTokenMint: PublicKey, amount: bigint | number)`: Deposits tokens into a pool.
- `withdrawFromPool(pool: PublicKey, underlyingTokenMint: PublicKey, amount: bigint | number)`: Withdraws tokens from a pool.
- `mintBonusTokens(pool: PublicKey, underlyingTokenMint: PublicKey, amount: bigint | number)`: Mints bonus tokens for a pool.
- `createPlayer()`: Creates an associated player account.
- `closePlayer()`: Closes the player account.
- `play(...)`: Plays a game with specified parameters.

#### Example Usage:
```ts
const gambaProvider = new GambaProvider(connection, wallet);
gambaProvider.createPlayer();
```

### GambaProviderWallet
A wallet type definition for GambaProvider. Can be a Keypair or compatible wallet object.

#### Props:
- `payer`: Optional Keypair.

#### Example:
```ts
const wallet = { payer: Keypair.generate() };
```

### Best Practices
- Always verify the RNG seed after each game for fairness.
- Use unique client seeds and nonces for each bet.
- Ensure your game logic matches the Gamba engine's result and payout.
- Design games to fit the "one bet, one result" model.

### Further Reading & Resources
- [Gamba GitHub](https://github.com/gamba-labs/gamba-core)
- [Anchor Docs](https://book.anchor-lang.com/)
- [Solana Docs](https://docs.solana.com/)

---

# (The rest of the README continues as before, but will be expanded in the next steps...)

---

## 1. Modern Game Layout: Portal System Architecture

### Current Implementation: GambaUi.Portal System
All games in DegenCasino use the **GambaUi.Portal system** instead of a custom layout component. This provides consistent structure across all games while maintaining flexibility.

### How it Works
- **Portal Targets:** Games render content into specific portal targets (`screen`, `controls`, `play`)
- **Responsive Layout:** Built-in responsive handling through `GambaUi.Responsive` component
- **Flexible Structure:** Main game area with optional sidebar for paytables

### Standard Game Pattern
```tsx
export default function MyGame() {
  return (
    <>
      <GambaUi.Portal target="screen">
        <div style={{ display: 'flex', gap: 16, height: '100%', width: '100%' }}>
          {/* Main game area - always flex: 1 */}
          <div style={{ flex: 1, /* game-specific styles */ }}>
            <GambaUi.Responsive>
              {/* Responsive game content here */}
            </GambaUi.Responsive>
          </div>
          
          {/* Optional sidebar for paytables */}
          <GamePaytable ref={paytableRef} wager={wager} />
        </div>
      </GambaUi.Portal>
      
      <GameControls
        wager={wager}
        setWager={setWager}
        onPlay={play}
        isPlaying={isPlaying}
        showOutcome={showOutcome}
      />
    </>
  )
}
```

### Key Components:
- **Main Container:** `display: flex, gap: 16px, height: 100%, width: 100%`
- **Game Area:** `flex: 1` for main content
- **GambaUi.Responsive:** Provides automatic scaling and responsive behavior
- **Sidebar:** Fixed-width paytable components (typically 300px)
- **GameControls:** Rendered into `controls` portal target

### Why This Pattern?
- **Portal Integration:** Perfect integration with Gamba's game framework
- **Responsive by Default:** `GambaUi.Responsive` handles all scaling automatically
- **Consistent Rendering:** All games render into the same portal targets
- **Flexible Layout:** Easy to add/remove sidebars and customize layouts per game

### Mobile Behavior
- **Automatic Scaling:** `GambaUi.Responsive` scales content for mobile screens
- **Sidebar Handling:** Some games hide sidebars on mobile, others show them
- **Touch Optimization:** Responsive scaling ensures proper touch targets

---

## 2. Layout Standardization: Current Architecture

### Portal-Based Consistency
All games follow the same portal-based architecture for consistency:

- **Portal Target "screen":** Main game rendering area
- **Portal Target "controls":** GameControls component
- **Portal Target "play":** Additional play controls (rarely used)

### Standard Layout Structure
Every game implements this exact pattern:

```tsx
<>
  <GambaUi.Portal target="screen">
    <div style={{ display: 'flex', gap: 16, height: '100%', width: '100%' }}>
      {/* Main game area */}
      <div style={{ flex: 1 }}>
        <GambaUi.Responsive>
          {/* Game content */}
        </GambaUi.Responsive>
      </div>
      
      {/* Optional paytable sidebar */}
      {paytableComponent}
    </div>
  </GambaUi.Portal>
  
  <GameControls {...gameControlProps} />
</>
```

### Benefits of This Approach
- **Consistent Rendering:** All games render in the same portal targets
- **Automatic Responsive:** `GambaUi.Responsive` handles all mobile scaling
- **Framework Integration:** Perfect integration with Gamba's game system
- **Easy Maintenance:** Layout logic is centralized in the game framework
- **Flexible Customization:** Games can customize within the standard structure

### Implementation Requirements
- Always use `GambaUi.Portal target="screen"` for main content
- Always use `GameControls` component (never custom controls)
- Always wrap game content in `GambaUi.Responsive`
- Use consistent flexbox layout: `display: flex, gap: 16, height: 100%, width: 100%`
- Use `flex: 1` for main game area, fixed width for sidebars

---

## 3. GameControls Component: The Standard for All Games

### Overview
The `GameControls` component is a reusable, standardized controls interface for all casino games. It manages wager input, token display, USD preset buttons, and play functionality.

### Key Benefits
- **Single Source of Truth:** All control styling and behavior managed in one component. Global updates affect all games.
- **Code Reduction:** Replaces 50-60 lines per game with a single component. 1000+ lines of duplicate code eliminated across 22 games.
- **Easy Maintenance:** Update controls styling globally by editing one file. Add new features (like auto-bet) to all games at once.

### Features
- **Automatic Wager Management:** Sets default wager (1 token for free tokens, 0 for real tokens)
- **USD Preset Buttons:** Quick bet amounts ($1, $5, $10, $25, $50, $100) with fallback for tokens without USD pricing
- **Mobile-First Design:** Modal-based wager setting on mobile devices with responsive breakpoints
- **Play Button Management:** Customizable text, disabled states, and play-again functionality
- **Game-Specific Controls:** Children prop for custom controls (difficulty, lines, multipliers, etc.)
- **Token Balance Display:** Real-time balance and wager information
- **PayTable Integration:** Optional sidebar/overlay opening functionality

### Usage Examples

#### Basic Implementation:
```tsx
<GameControls
  wager={wager}
  setWager={setWager}
  onPlay={play}
  isPlaying={isPlaying}
  showOutcome={showOutcome}
  playButtonText="Play"
/>
```

#### With Custom Controls:
```tsx
<GameControls
  wager={wager}
  setWager={setWager}
  onPlay={play}
  isPlaying={isPlaying}
  showOutcome={showOutcome}
  playButtonText={hasPlayedBefore ? 'Play Again' : 'Spin'}
  onPlayAgain={handlePlayAgain}
  onOpenSidebar={() => setShowPaytable(true)}
>
  {/* Custom game controls */}
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <span style={{ fontWeight: 'bold' }}>Difficulty:</span>
    <GambaUi.Select
      options={DIFFICULTY_OPTIONS}
      value={difficulty}
      onChange={setDifficulty}
    />
  </div>
</GameControls>
```

### Props API
```tsx
interface GameControlsProps {
  wager: number                           // Current wager amount
  setWager: (amount: number) => void      // Function to update wager
  onPlay: () => void                      // Function called when play button is clicked
  isPlaying: boolean                      // Whether game is currently playing
  showOutcome?: boolean                   // Whether to show outcome overlay
  playButtonText?: string                 // Custom play button text (default: 'Play')
  playButtonDisabled?: boolean            // Additional disabled condition
  children?: React.ReactNode              // Custom controls for mobile modal/desktop inline
  style?: React.CSSProperties             // Custom styling
  onOpenSidebar?: () => void              // Function to open paytable/sidebar
  onPlayAgain?: () => void                // Function for play again logic
}
```

### Mobile Responsiveness
- **Breakpoint:** 1200px width
- **Mobile Layout:** Vertical stack with modal-based wager setting
- **Desktop Layout:** Horizontal layout with inline controls
- **Custom Controls:** Shown in modal on mobile, inline on desktop

---

## 4. Modern Hooks Architecture

### useGameOutcome Hook
**Location:** `src/hooks/useGameOutcome.ts`
**Purpose:** Manages game outcome overlay state, win/loss detection, and play-again logic.

#### Features:
- **Win/Loss Detection:** Automatically determines if profit > 0
- **Overlay Management:** Controls `showOutcome` state for result displays
- **Play Again Logic:** Handles game state reset for consecutive plays
- **Profit Calculation:** Calculates and tracks profit amounts

#### Usage:
```tsx
const {
  showOutcome,           // Whether to show outcome overlay
  hasPlayedBefore,       // Track if user has played before
  handleGameComplete,    // Call when game finishes
  handlePlayAgain,       // Call when user wants to play again
  isWin,                 // Whether the last game was a win
  profitAmount,          // Absolute profit amount
  resetGameState,        // Reset all game state
} = useGameOutcome();

// In your game logic:
const result = await gamba.result()
handleGameComplete({ payout: result.payout, wager })
```

### useIsCompact Hook
**Location:** `src/hooks/useIsCompact.ts`
**Purpose:** Responsive design hook for mobile-first layouts.

#### Features:
- **Breakpoint Management:** Detects screen width changes
- **Responsive Scaling:** Provides scaling factors for game elements
- **Mobile Detection:** Boolean flag for mobile vs desktop layouts

#### Usage:
```tsx
const { compact } = useIsCompact();

// Responsive scaling
const [scale, setScale] = React.useState(compact ? 1 : 1.3);

React.useEffect(() => {
  setScale(compact ? 1 : 1.3);
}, [compact]);

// Conditional rendering
{compact ? <MobileView /> : <DesktopView />}
```

### useSound Hook Integration
**Purpose:** Standardized sound management across all games.

#### Common Sound Patterns:
```tsx
const sounds = useSound({
  win: WIN_SOUND,
  lose: LOSE_SOUND,
  play: PLAY_SOUND,
  reveal: REVEAL_SOUND,
  // Game-specific sounds
});

// In game logic:
sounds.play('win', { playbackRate: 1.2 })
sounds.play('lose')
```

---

## 5. Overlay System Architecture

### Overview
DegenCasino uses a sophisticated overlay system for enhanced UX with thinking phases, dramatic pauses, and celebration states.

### overlayUtils Functions
**Location:** `src/utils/overlayUtils`

#### Core Functions:

**renderThinkingOverlay:**
```tsx
renderThinkingOverlay(gamePhase, compact, customContent?)
```
- Renders thinking overlay during game processing
- Automatic scaling based on `useIsCompact`
- Customizable content for game-specific messages

**getThinkingPhaseState:**
```tsx
getThinkingPhaseState(gamePhase)
```
- Returns boolean for thinking phase detection
- Used for overlay visibility logic

**getGamePhaseState:**
```tsx
getGamePhaseState(gamePhase)
```
- Returns current game phase information
- Supports: idle, thinking, dramatic, celebrating, mourning

### Game Phase Management
```tsx
// Typical game phase progression:
const [gamePhase, setGamePhase] = useState<'idle' | 'thinking' | 'dramatic' | 'celebrating' | 'mourning'>('idle')

// During game play:
setGamePhase('thinking')    // Show thinking overlay
setGamePhase('dramatic')    // Brief dramatic pause
setGamePhase('celebrating') // Win celebration
setGamePhase('mourning')    // Loss state
setGamePhase('idle')        // Reset for next game
```

### Overlay Implementation Pattern
All games follow this consistent overlay pattern:

```tsx
{/* Thinking overlay during game processing */}
{renderThinkingOverlay(gamePhase, compact, 
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontSize: 24, marginBottom: 8 }}>🎰</div>
    <div>Spinning the reels...</div>
  </div>
)}

{/* Game-specific overlays */}
<GameOverlays
  gamePhase={gamePhase}
  isWin={isWin}
  profitAmount={profitAmount}
  // ... other props
/>
```

### Standard Overlay Components
Each game typically has its own overlay component following the pattern:
- `{GameName}Overlays.tsx`
- Handles celebration, mourning, and result display
- Consistent timing and animation patterns
- Mobile-responsive scaling

---

## 6. Portal System & Layout Architecture

### GambaUi.Portal System
DegenCasino uses a portal-based layout system for consistent game structure.

#### Portal Targets:
```tsx
<GambaUi.Portal target="screen">
  {/* Main game content */}
</GambaUi.Portal>

<GambaUi.Portal target="controls">
  {/* Game controls via GameControls component */}
</GambaUi.Portal>

<GambaUi.Portal target="play">
  {/* Additional play controls if needed */}
</GambaUi.Portal>
```

#### Standard Game Layout Pattern:
```tsx
export default function MyGame() {
  return (
    <>
      <GambaUi.Portal target="screen">
        <div style={{ display: 'flex', gap: 16, height: '100%', width: '100%' }}>
          {/* Main game area */}
          <div style={{ flex: 1, /* game styles */ }}>
            <GambaUi.Responsive>
              {/* Responsive game content */}
            </GambaUi.Responsive>
          </div>
          
          {/* Optional sidebar (paytables, etc.) */}
          <GamePaytable ref={paytableRef} wager={wager} />
        </div>
      </GambaUi.Portal>
      
      <GameControls
        wager={wager}
        setWager={setWager}
        onPlay={play}
        isPlaying={isPlaying}
        showOutcome={showOutcome}
        onOpenSidebar={() => paytableRef.current?.focus()}
      />
    </>
  )
}
```

---

## 7. Component Ecosystem

### ModernWagerInput Component
**Location:** `src/components/ModernWagerInput.tsx`
**Purpose:** Advanced wager input with token-aware controls.

#### Features:
- **Token Integration:** Displays base wager for selected tokens
- **Quick Controls:** Half, double, +0.01, +0.1, +1 buttons
- **Mobile Responsive:** Adaptive layout for different screen sizes
- **Styled Components:** Modern UI with glow effects and responsive design

#### Usage:
```tsx
<ModernWagerInput
  value={wager}
  onChange={setWager}
  disabled={isPlaying}
  label="Bet Amount"
  conversionFactor={baseWager}
  selectedMint={token?.mint}
/>
```

### Paytable Components Pattern
Each game follows a consistent paytable pattern:

#### Standard Implementation:
```tsx
// GamePaytable.tsx
export interface GamePaytableRef {
  trackWin?: (data: any) => void
  trackSpin?: (isWin: boolean) => void
}

const GamePaytable = React.forwardRef<GamePaytableRef, GamePaytableProps>(
  ({ wager, currentResult }, ref) => {
    // Live statistics tracking
    const [sessionStats, setSessionStats] = useState({
      totalSpins: 0,
      totalWins: 0,
      totalWagered: 0,
      currentStreak: 0,
    })
    
    // Expose tracking functions
    useImperativeHandle(ref, () => ({
      trackWin: (data) => { /* update stats */ },
      trackSpin: (isWin) => { /* update stats */ }
    }))
    
    return (
      <div style={{ width: 300, /* paytable styles */ }}>
        {/* Paytable content */}
      </div>
    )
  }
)
```

#### Usage in Games:
```tsx
const paytableRef = useRef<GamePaytableRef>(null)

// Track game results
useEffect(() => {
  if (result && paytableRef.current) {
    paytableRef.current.trackSpin?.(isWin)
    if (isWin) {
      paytableRef.current.trackWin?.(resultData)
    }
  }
}, [result, isWin])
```

### Icon Component System
**Location:** `src/components/Icon.tsx`
**Purpose:** Centralized icon management with consistent styling.

#### Common Icons:
- Volume / VolumeMuted for sound controls
- Consistent sizing and hover effects
- SVG-based for crisp rendering at all sizes

---

## 8. Advanced Patterns & Best Practices

### Token & Wager Management
All games follow this standardized pattern:

```tsx
// Token and wager setup
const token = useCurrentToken()
const { balance } = useTokenBalance()
const tokenMeta = token ? TOKEN_METADATA.find(t => t.symbol === token.symbol) : undefined
const baseWager = tokenMeta?.baseWager ?? (token ? Math.pow(10, token.decimals) : 1)
const maxWager = baseWager * 1000000
const tokenPrice = tokenMeta?.usdPrice ?? 0

// Default wager logic
React.useEffect(() => {
  if (token?.mint?.equals?.(FAKE_TOKEN_MINT)) {
    setWager(baseWager) // 1 token for free token
  } else {
    setWager(0) // 0 for real tokens
  }
}, [setWager, token, baseWager])
```

### Game State Management
```tsx
// Standard game state pattern
const [gamePhase, setGamePhase] = useState<'idle' | 'thinking' | 'dramatic' | 'celebrating' | 'mourning'>('idle')
const [result, setResult] = useState<GameResult | null>(null)
const [payout, setPayout] = useState<number>(0)

// Game outcome integration
const {
  showOutcome,
  hasPlayedBefore,
  handleGameComplete,
  handlePlayAgain,
  isWin,
  profitAmount,
} = useGameOutcome()
```

### Sound Integration Pattern
```tsx
// Standard sound setup
const sounds = useSound({
  win: SOUND_WIN,
  lose: SOUND_LOSE,
  play: SOUND_PLAY,
  reveal: SOUND_REVEAL,
  // Game-specific sounds...
})

// Usage in game logic
sounds.play('play')
// Later...
sounds.play(isWin ? 'win' : 'lose')
```

### Responsive Design Implementation
```tsx
// Responsive scaling with useIsCompact
const { compact } = useIsCompact()
const [scale, setScale] = useState(compact ? 1 : 1.3)

useEffect(() => {
  setScale(compact ? 1 : 1.3)
}, [compact])

// Apply scaling to game elements
<div style={{
  transform: `scale(${scale})`,
  transformOrigin: 'top left',
  // ... other styles
}}>
```

---

## 9. Development Workflow & Integration

### Adding New Games to the Platform

#### Required Files for New Game Integration:
1. **Export in `src/games/index.tsx`:**
```tsx
export { default as MyNewGame } from './MyNewGame'
```

2. **Add to `src/games/allGames.ts`:**
```tsx
import { MyNewGame } from './index'
export const allGames = [MyNewGame, ...existingGames]
```

3. **Game Metadata in `src/games/featuredGames.ts` (optional):**
```tsx
{
  id: 'mynewgame',
  meta: {
    name: 'My New Game',
    description: 'Game description',
    image: '/games/mynewgame/logo.png',
  },
  app: MyNewGame,
}
```

### File Structure Pattern
Each game follows this consistent structure:
```
src/games/MyNewGame/
├── index.tsx              # Main game component
├── MyNewGamePaytable.tsx  # Paytable component
├── MyNewGameOverlays.tsx  # Overlay components
├── constants.ts           # Sounds, game constants
├── utils.ts              # Game-specific utilities (optional)
├── styles.ts             # Styled components (optional)
└── assets/               # Game assets (sounds, images)
    ├── win.mp3
    ├── lose.mp3
    └── logo.png
```

### Live Statistics & Paytable Integration
All games implement live session tracking:

```tsx
// In Paytable component
const [sessionStats, setSessionStats] = useState({
  totalSpins: 0,
  totalWins: 0,
  totalWagered: 0,
  currentStreak: 0,
  biggestWin: 0,
  // Game-specific stats...
})

// Track results in real-time
const trackWin = useCallback((winData) => {
  setSessionStats(prev => ({
    ...prev,
    totalWins: prev.totalWins + 1,
    biggestWin: Math.max(prev.biggestWin, winData.amount),
    currentStreak: prev.currentStreak + 1,
  }))
}, [])
```

### Mobile-First Development
All games are developed mobile-first with desktop enhancements:

```tsx
// Mobile breakpoint: 1200px
const { compact } = useIsCompact()

// Mobile-specific layouts
{compact ? (
  <MobileLayout scale={1} />
) : (
  <DesktopLayout scale={1.3} />
)}

// Responsive font sizes
fontSize: compact ? '24px' : '32px'

// Mobile-specific controls via GameControls
<GameControls>
  {/* These appear in modal on mobile, inline on desktop */}
  <CustomGameControls />
</GameControls>
```

---

## 10. Testing & Quality Assurance

### Testing Checklist for New Games
- [ ] Game loads without errors
- [ ] Wager system works correctly (free vs real tokens)
- [ ] Play button enables/disables appropriately
- [ ] Game outcome overlays display correctly
- [ ] Mobile responsive design works on small screens
- [ ] Sound effects play correctly (with volume controls)
- [ ] Paytable displays accurate information
- [ ] Session statistics update in real-time
- [ ] Error handling for network issues
- [ ] Multiple consecutive games work properly

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Test with different viewport sizes
- Verify touch interactions on mobile devices

### Performance Considerations
- Memoize expensive calculations with `useMemo`
- Use `useCallback` for event handlers
- Optimize re-renders with proper dependencies
- Test with React DevTools Profiler
- Monitor memory usage for long gaming sessions

---

## 11. Current Platform Statistics

### Implemented Games Count: 22+ Games
All games using modern architecture:
- **GameControls:** Standardized across all games
- **useGameOutcome:** Adopted by all new games
- **Overlay System:** Consistent thinking/celebration phases
- **Portal Layout:** Standard screen/controls structure
- **Mobile Responsive:** All games support mobile devices

### Code Efficiency Improvements
- **Before:** ~60 lines of duplicate control code per game
- **After:** Single `<GameControls>` component
- **Total Reduction:** 1000+ lines of duplicate code eliminated
- **Maintenance:** One-file updates affect all games globally

### Modern Features Implemented
- USD preset buttons with real-time pricing
- Mobile modal-based wager setting
- Live session statistics in all paytables
- Consistent overlay timing and animations
- Sound integration with volume controls
- Responsive scaling for all screen sizes
**Basic:**
```tsx
<GameControls
  wager={wager}
  setWager={setWager}
  onPlay={play}
  isPlaying={isPlaying}
  showOutcome={showOutcome}
  playButtonText="Play"
/>
```
**Advanced (with custom controls):**
```tsx
<GameControls
  wager={wager}
  setWager={setWager}
  onPlay={play}
  isPlaying={isPlaying}
  showOutcome={showOutcome}
  playButtonText={hasPlayedBefore ? 'Play Again' : 'Start'}
>
  {/* Custom game-specific controls here */}
</GameControls>
```

### Props API
```tsx
interface GameControlsProps {
  wager: number
  setWager: (amount: number) => void
  onPlay: () => void
  isPlaying: boolean
  showOutcome?: boolean
  playButtonText?: string
  playButtonDisabled?: boolean
  children?: React.ReactNode
}
```

### Migration Example
**Before:** Manual controls in each game (~50-60 lines)
**After:** Single `GameControls` component (~5-10 lines)

### Game-Specific Examples
**Simple:**
```tsx
<GameControls
  wager={wager}
  setWager={setWager}
  onPlay={play}
  isPlaying={isPlaying}
  showOutcome={showOutcome}
  playButtonText={hasPlayedBefore ? 'Play Again' : 'Play'}
/>
```
**With Options:**
```tsx
<GameControls
  wager={initialWager}
  setWager={setInitialWager}
  onPlay={start}
  isPlaying={loading}
  showOutcome={showOutcome}
  playButtonText={playButtonText}
  playButtonDisabled={started}
>
  {/* Custom controls here */}
</GameControls>
```

---

## 4. Mobile Responsiveness: Best Practices

### Responsive Logic
- Use the `useIsCompact` hook everywhere instead of direct `window.innerWidth` checks. This ensures consistency and reactivity.
- Pass `compact` or `isCompact` as a prop to all layout and major UI components, and use it to adjust styles, spacing, and visibility.

### Media Queries & Styling
- Add or refine `@media` queries in styled-components and CSS for breakpoints at 768px and below.
- Where Tailwind is used, add `sm:`, `md:`, `lg:`, `xl:` classes to adjust padding, margin, font size, flex direction, etc.
- Replace hardcoded pixel values with relative units (`rem`, `%`, `vw`, `vh`) where possible.

### Touch Targets & Spacing
- Ensure buttons and interactive elements are large enough and spaced for touch.

### Modals & Overlays
- Make sure modals, overlays, and popups are full-width or centered and scrollable on mobile.

### Next Steps
1. Update your `useIsCompact` hook to be reusable.
2. Refactor key components (e.g., Sidebar, Header, a sample game component, and a modal) to use it and improve their mobile responsiveness.

---

## 5. Game Template Boilerplate: Step-by-Step Guide

This guide will help you create a new game for DegenCasino using the official, production-ready template. Even if you are new to React or Gamba, just follow these steps and fill in your game logic and visuals where marked.

### 1. Copy the Template
Copy the contents of `template-file.txt` into a new file:
```

```
Replace `YourGameName` with your actual game folder and component name (e.g., `DiceRoll`, `Plinko`).

### 2. What the Template Does For You
- Sets up all the Gamba hooks and context for you (wager, token, balance, scaling, overlays, etc.)
- Handles responsive scaling for mobile/desktop
- Provides a ready-to-use play handler and outcome overlay logic
- Renders the game area and controls in the correct layout
- All you need to do is add your game visuals and logic!

### 3. Where to Add Your Game Code
**A. Game Visuals**
Find this section in the template:
```tsx
<GambaUi.Portal target="screen">
  <div style={{ /* ...styles... */ }}>
    {/* 🎨 IMPLEMENT YOUR GAME VISUALS HERE */}
    <h2>🎮 New Game</h2>
    <div>Your game graphics go here.</div>
  </div>
</GambaUi.Portal>
```
Replace the `<h2>` and `<div>` with your own game UI (canvas, reels, cards, etc).

**B. Game Logic**
Find this section:
```tsx
const play = async () => {
  // ...
  /**
   * PLACE YOUR GAME LOGIC HERE
   * Example:
   * await game.play({ wager, bet: [1, 0, 0] })
   * const res = await game.result()
   * setGambaResult(res)
   * setResult(res.resultIndex)
   * setPayout(res.payout)
   * handleGameComplete({ payout: res.payout, wager })
   */
  // ...
}
```
Replace the comment with your actual game logic. Use the provided hooks and helpers.

### 4. Customizing Controls
The template already wires up wager input and play button. If your game needs extra controls (like difficulty, number of lines, etc.), add them as props to `<GameControls>` or as custom UI elements in the main game area.

### 5. Checklist Before You Ship
- [ ] Rename all `NewGameBoilerplate` to your game name (e.g., `DiceRoll`)
- [ ] Add your game visuals and logic as described above
- [ ] Add any custom controls if needed
- [ ] (Optional) Add a `YourGameName.styles.ts` or `.module.css` for custom styles
- [ ] Export your game in `src/games/allGames.tsx` and add it to the games list

### 6. Example: Minimal Game Visuals
```tsx
<GambaUi.Portal target="screen">
  <div style={{ textAlign: 'center', padding: 40 }}>
    <h2>🎲 Dice Game</h2>
    <button onClick={play}>Roll Dice</button>
  </div>
</GambaUi.Portal>
```

### 7. What Not To Change
- Do not remove the hooks or context at the top—they are required for Gamba integration
- Do not remove the portal structure or `GameControls` components
- Do not change the scaling logic unless you know what you're doing

### 8. Final Notes
- This template is production-ready and matches all current DegenCasino games
- You only need to fill in your visuals and game logic
- All token, wager, and overlay logic is handled for you

---

# Local Developer Manual: DegenCasino

> This manual is for developers working locally on the DegenCasino codebase. It is not a public-facing README, but a living, detailed reference for building, debugging, extending, and maintaining games and infrastructure in this project.

---

## Local Development Philosophy

- **Single Source of Truth:** All layout, controls, and token logic are centralized. Never duplicate logic between games.
- **Rapid Iteration:** Hot reload, modular game folders, and shared hooks/components make it easy to test changes instantly.
- **Provable Fairness:** All randomness and payouts are on-chain and verifiable. Always use the provided Gamba hooks and context.
- **Maintainability:** Every game should be easy to refactor, extend, or debug by any team member.
- **Self-Documenting:** This manual, code comments, and clear folder structure are your first stop for answers.

---

## Local Dev Workflow: From Idea to Shipped Game

1. **Create a New Game Folder:**
   - Copy the template from `template-file.txt` to `src/games/YourGameName/index.tsx`.
   - Rename all instances of `NewGameBoilerplate` to your game name.
2. **Implement Game Visuals:**
   - Use the main game area within the portal system for your main UI.
   - Use optional sidebars for paytables, stats, or extra controls.
3. **Wire Up Game Logic:**
   - Use the `play` function for all game logic. Always use the Gamba hooks/context for wagers, results, and overlays.
   - Never bypass the Gamba engine for randomness or payouts.
4. **Add Custom Controls (if needed):**
   - Use the `children` prop of `GameControls` for sliders, selectors, etc.
5. **Test Responsiveness:**
   - Use the `useIsCompact` hook and test on various screen sizes.
6. **Debugging:**
   - Use React DevTools, console logs, and the Gamba context to inspect state.
   - Check the browser console for errors and warnings.
7. **Refactor and Document:**
   - Move any game-specific styles to `YourGameName.styles.ts` or `.module.css`.
   - Add comments and update this manual if you discover new patterns or best practices.
8. **Add to Games List:**
   - Export your game in `src/games/allGames.tsx`.
9. **Run Local Tests:**
   - Use the provided test scripts or add your own unit/integration tests.
10. **Peer Review:**
    - Use the code review checklist at the end of this manual before merging.

---

## Deep Dive: Portal Layout System (Local Usage)

- **Never** create custom layout wrappers. Always use the `GambaUi.Portal` system.
- Use `target="screen"` for main game content with the standard flex container pattern.
- Use `GameControls` component for all control rendering (renders to `controls` portal).
- Always wrap game content in `GambaUi.Responsive` for automatic scaling.
- Use consistent flexbox structure: main area gets `flex: 1`, sidebars get fixed width.

### Example (current pattern used by all games):
```tsx
<>
  <GambaUi.Portal target="screen">
    <div style={{ display: 'flex', gap: 16, height: '100%', width: '100%' }}>
      {/* Main game area - always flex: 1 */}
      <div style={{ flex: 1 }}>
        <GambaUi.Responsive>
          {/* Your game visuals here */}
        </GambaUi.Responsive>
      </div>
      
      {/* Optional paytable sidebar */}
      <GamePaytable ref={paytableRef} wager={wager} />
    </div>
  </GambaUi.Portal>
  
  <GameControls {...controlProps} />
</>
```

---

## Deep Dive: GameControls (Local Usage)

- Always use `GameControls` for wager input, play button, and token display.
- Never implement your own wager logic or play button from scratch.
- Use the `children` prop for custom controls (e.g., difficulty, number of lines, etc.).
- The `play` function should always use the Gamba engine for randomness and payouts.
- The `showOutcome` prop controls overlays and disables the play button when needed.

### Example (with custom controls):
```tsx
<GameControls
  wager={wager}
  setWager={setWager}
  onPlay={play}
  isPlaying={isPlaying}
  showOutcome={showOutcome}
  playButtonText={hasPlayedBefore ? 'Play Again' : 'Spin'}
>
  <GambaUi.Select
    options={DIFFICULTY_OPTIONS}
    value={difficulty}
    onChange={setDifficulty}
    label="Difficulty"
  />
  {/* Add more custom controls as needed */}
</GameControls>
```

---

## Local Debugging & Troubleshooting

- **React DevTools:** Inspect component state, props, and context.
- **Console Logs:** Use `console.log` liberally during development. Remove before merging.
- **Gamba Context:** Use the Gamba hooks to inspect wager, result, and overlay state.
- **Token Issues:** If wager or balance is not updating, check your token metadata and ensure you are using the correct hooks.
- **Layout Issues:** If your game looks wrong on mobile, check your use of `useIsCompact` and CSS media queries.
- **Performance:** Use the React Profiler to find unnecessary re-renders. Memoize expensive calculations.
- **Provable Fairness:** Always verify the RNG seed and client seed logic in your game.

---

## Advanced: Adding a New Token

1. Add your token metadata to `src/constants/TOKEN_METADATA.ts`.
2. Ensure you provide `symbol`, `decimals`, `baseWager`, and (optionally) `usdPrice`.
3. Test your game with the new token selected. Check wager input, balance, and payouts.
4. If your token is a dev/fake token, use `FAKE_TOKEN_MINT` for special logic.

---

## Advanced: Refactoring a Game

- Move all layout and controls to use the portal system and `GameControls`.
- Remove any duplicated wager, play, or overlay logic.
- Move unique styles to a local style file.
- Test on all screen sizes and with all supported tokens.
- Update this manual with any new patterns or lessons learned.

---

## Advanced: Accessibility & UX

- All buttons must be keyboard accessible (tab, enter/space).
- Use semantic HTML for headings, lists, and controls.
- Ensure color contrast meets WCAG standards.
- Test with screen readers if possible.
- Add `aria-label` and `aria-live` attributes for dynamic content.

---

## Advanced: Performance

- Memoize expensive calculations and components.
- Use React’s `useMemo` and `useCallback` where appropriate.
- Avoid unnecessary re-renders by lifting state up or using context.
- Profile your game with React DevTools and browser performance tools.

---

## Advanced: Testing

- Write unit tests for all custom hooks and utility functions.
- Use integration tests for game logic and UI flows.
- Mock the Gamba engine for deterministic tests.
- Test on multiple browsers and devices.

---

## Advanced: Deployment (Local)

- Use `npm run build` or `yarn build` to create a production build.
- Test the build locally before deploying to staging or production.
- Use environment variables for API keys, endpoints, and secrets.
- Never commit secrets or private keys to the repo.

---

## Code Review Checklist (Local)

- [ ] All layout uses the portal system with consistent flex structure.
- [ ] All controls use `GameControls`.
- [ ] No duplicated wager, play, or overlay logic.
- [ ] All tokens are handled via metadata and hooks.
- [ ] Responsive on all screen sizes.
- [ ] Accessibility best practices followed.
- [ ] No console logs or debug code left in PR.
- [ ] All new patterns or lessons added to this manual.

---

## Glossary (Local Terms)

- **Gamba Engine:** The on-chain Solana program for provably fair games.
- **Portal System:** The GambaUi.Portal system used for consistent game layout.
- **GameControls:** The shared controls component for all games.
- **useIsCompact:** Hook for responsive logic.
- **useGameOutcome:** Hook for overlays and post-game state.
- **Token Metadata:** Centralized config for all supported tokens.
- **FAKE_TOKEN_MINT:** Special constant for dev/test tokens.

---

## FAQ (Local Dev)

**Q: My game isn’t showing up in the UI.**
A: Did you export it in `src/games/allGames.tsx`? Did you name the component and file correctly?

**Q: The play button is always disabled.**
A: Check your wager logic, token selection, and `showOutcome` state.

**Q: My custom controls aren’t updating state.**
A: Are you using the correct hooks and passing state down as props?

**Q: The layout is broken on mobile.**
A: Are you using `useIsCompact` and testing with device emulation?

**Q: How do I debug Gamba engine issues?**
A: Use the Gamba hooks/context to inspect state. Check the browser console for errors.

---

## ASCII Diagram: Current Game Layout

```
+---------------------------------------+
|           GambaUi.Portal              |
|              target="screen"          |
| +----------+  +-------------------+   |
| | flex: 1  |  |   Fixed Width     |   |
| |   Main   |  |   Paytable/       |   |
| |   Game   |  |   Sidebar         |   |
| |  Area    |  |   (optional)      |   |
| +----------+  +-------------------+   |
+---------------------------------------+
|         GameControls Component        |
|         (portal target="controls")    |
+---------------------------------------+
```

---

## Appendix: Full Example Game (Local)

```tsx
import React, { useContext, useState, useEffect } from 'react'
import {
  GambaUi,
  useWagerInput,
  useCurrentToken,
  useTokenBalance,
  FAKE_TOKEN_MINT,
} from 'gamba-react-ui-v2'
import { TOKEN_METADATA } from '../../constants'
import { GameControls } from '../../components'
import { useGameOutcome } from '../../hooks/useGameOutcome'
import { useIsCompact } from '../../hooks/useIsCompact'
import { GambaResultContext } from '../../context/GambaResultContext'

export default function ExampleGame() {
  const { setGambaResult } = useContext(GambaResultContext)
  const [wager, setWager] = useWagerInput()
  const token = useCurrentToken()
  const { balance } = useTokenBalance()
  const game = GambaUi.useGame()
  const [isPlaying, setIsPlaying] = useState(false)
  const [result, setResult] = useState<number | null>(null)
  const [payout, setPayout] = useState<number | null>(null)
  const {
    showOutcome,
    hasPlayedBefore,
    handleGameComplete,
    handlePlayAgain,
    isWin,
    profitAmount,
    resetGameState,
  } = useGameOutcome()
  const playButtonText = hasPlayedBefore && !showOutcome ? 'Play Again' : 'Play'
  const tokenMeta = token ? TOKEN_METADATA.find((t) => t.symbol === token.symbol) : undefined
  const baseWager = tokenMeta?.baseWager ?? (token ? Math.pow(10, token.decimals) : 1)
  const maxWager = baseWager * 1_000_000
  useEffect(() => {
    if (token?.mint?.equals?.(FAKE_TOKEN_MINT)) {
      setWager(baseWager)
    } else {
      setWager(0)
    }
  }, [setWager, token, baseWager])
  const { compact } = useIsCompact()
  const [scale, setScale] = useState(compact ? 1 : 1.3)
  useEffect(() => { setScale(compact ? 1 : 1.3) }, [compact])
  
  const play = async () => {
    if (showOutcome) {
      handlePlayAgain()
      return
    }
    setIsPlaying(true)
    setResult(null)
    setPayout(null)
    // PLACE YOUR GAME LOGIC HERE
    setIsPlaying(false)
  }
  
  const formatPayout = (p: number | null) => {
    if (p === null) return ''
    if (p === 0) return 'Lose'
    if (p === wager * 2) return 'Jackpot!'
    return `Win ${payout} ${token?.symbol}`
  }
  
  return (
    <>
      <GambaUi.Portal target="screen">
        <div style={{ display: 'flex', gap: 16, height: '100%', width: '100%' }}>
          {/* Main game area */}
          <div style={{ flex: 1 }}>
            <GambaUi.Responsive>
              <div style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                width: '100%',
                maxWidth: 800,
                margin: '0 auto',
                padding: 24,
                boxSizing: 'border-box',
              }}>
                {/* 🎨 IMPLEMENT YOUR GAME VISUALS HERE */}
                <h2 style={{ fontSize: 32, marginBottom: 16 }}>🎮 New Game</h2>
                <div style={{ fontSize: 24, marginBottom: 32 }}>Your game graphics go here.</div>
              </div>
            </GambaUi.Responsive>
          </div>
          
          {/* Optional sidebar */}
          <div style={{
            width: 300,
            padding: 24,
            backgroundColor: '#f9f9f9',
            borderLeft: '1px solid #e0e0e0',
            height: '100vh',
            overflowY: 'auto',
          }}>
            <h3 style={{ fontSize: 24, marginBottom: 16 }}>Game Info</h3>
            <div style={{ fontSize: 18, marginBottom: 8 }}>
              <strong>Token:</strong> {token?.symbol}
            </div>
            <div style={{ fontSize: 18, marginBottom: 8 }}>
              <strong>Balance:</strong> {balance} {token?.symbol}
            </div>
            <div style={{ fontSize: 18, marginBottom: 8 }}>
              <strong>Wager:</strong> {wager} {token?.symbol}
            </div>
            <div style={{ fontSize: 18, marginBottom: 8 }}>
              <strong>Result:</strong> {formatPayout(payout)}
            </div>
          </div>
        </div>
      </GambaUi.Portal>
      
      <GameControls
        wager={wager}
        setWager={setWager}
        onPlay={play}
        isPlaying={isPlaying}
        showOutcome={showOutcome}
        playButtonText={playButtonText}
      />
    </>
  )
}
```

---

## ExampleGame & HelloWorld: Local Boilerplate and Test Game

### What is the HelloWorld Game?
The `HelloWorld` folder inside `ExampleGame` is a minimal, fully-wired test game that demonstrates the absolute basics of building a DegenCasino game. It is based directly on the official template-file and is intended as a starting point for new games.

- **Location:** `src/games/ExampleGame/HelloWorld/`
- **Entry Point:** `HelloWorld.tsx`
- **Bet Array:** `betArray.ts` (shows how to define win/loss odds)

### How HelloWorld Works
- Uses all the standard hooks and context (`useWagerInput`, `useCurrentToken`, `useTokenBalance`, `useGameOutcome`, etc.)
- Implements a fake game loop: picks a random outcome from `betArray` and simulates a win/loss.
- Demonstrates how to update local and global state, trigger overlays, and display results.
- Uses the portal system and `GameControls` for layout and controls—never custom logic.
- All code is heavily commented for learning and copy-paste.

### betArray Pattern
- The `betArray` is an array of numbers (e.g., `[1, 0, 0]`) where each entry represents a possible outcome.
- In HelloWorld, `1` means win, `0` means lose. In real Gamba games, these are multipliers (e.g., `[2, 0]` for double or nothing).
- You can change the odds by changing the array (e.g., `[1, 1, 0, 0]` = 50% win rate).

### How to Use HelloWorld as a Boilerplate
1. **Copy the HelloWorld folder** to a new folder in `src/games/` (e.g., `MyNewGame`).
2. **Rename all references** from `HelloWorld` to your new game name.
3. **Edit `betArray.ts`** to match your game's odds or payout structure.
4. **Edit the UI and logic** in `HelloWorld.tsx` to build your game visuals and rules.
5. **Test locally**—all hooks, overlays, and controls are already wired up.

### Adding Your Game to the App
> **IMPORTANT:** For your new game to appear in the app, you must add it to two files:
>
> 1. `src/games/index.tsx` — Export your game component here.
> 2. `src/games/allGames.ts` — Add your game to the exported games array/list.
>
> If you skip this step, your game will not show up in the UI!

#### Example:
```ts
// src/games/index.tsx
export { default as MyNewGame } from './MyNewGame/MyNewGame'

// src/games/allGames.ts
import { MyNewGame } from './index'
export const allGames = [MyNewGame, ...otherGames]
```

### Troubleshooting
- If your game does not appear, double-check the two files above.
- If the play button is disabled, check your wager logic and token selection.
- If overlays or results do not show, ensure you are using the provided hooks and context.
- If you want to simulate different odds, just change the `betArray`.

### Best Practices
- Always start from HelloWorld or the template-file for new games.
- Never duplicate logic for layout, controls, or overlays.
- Use comments and keep your code readable for the next developer.
- Test on desktop and mobile, with different tokens.

---

## Example: HelloWorld Game Code Structure

```
HelloWorld/
├── betArray.ts      # Defines the win/loss odds for the test game
└── HelloWorld.tsx   # Main entry point, based on the template-file
```

---

## Full HelloWorld.tsx (for reference)

```tsx
import React, { useState } from 'react'
import { GambaUi, useWagerInput, useCurrentToken, useTokenBalance } from 'gamba-react-ui-v2'
import { TOKEN_METADATA } from '../../../constants'
import { GameControls } from '../../../components'
import { useGameOutcome } from '../../../hooks/useGameOutcome'
import { useIsCompact } from '../../../hooks/useIsCompact'

const betArray = [1, 0] // 50% win/loss for demo

export default function HelloWorld() {
  const [wager, setWager] = useWagerInput()
  const token = useCurrentToken()
  const { balance } = useTokenBalance()
  const game = GambaUi.useGame()
  const [isPlaying, setIsPlaying] = useState(false)
  const [result, setResult] = useState<number | null>(null)
  const [payout, setPayout] = useState<number | null>(null)
  const {
    showOutcome,
    hasPlayedBefore,
    handleGameComplete,
    handlePlayAgain,
    isWin,
    profitAmount,
    resetGameState,
  } = useGameOutcome()
  const playButtonText = hasPlayedBefore && !showOutcome ? 'Play Again' : 'Play'
  const tokenMeta = token ? TOKEN_METADATA.find((t) => t.symbol === token.symbol) : undefined
  const baseWager = tokenMeta?.baseWager ?? (token ? Math.pow(10, token.decimals) : 1)
  const maxWager = baseWager * 1_000_000
  const { compact } = useIsCompact()
  const scale = compact ? 1 : 1.3

  const play = async () => {
    if (showOutcome) {
      handlePlayAgain()
      return
    }
    setIsPlaying(true)
    setResult(null)
    setPayout(null)

    // Fake game logic for demo: random win/loss
    const outcome = betArray[Math.floor(Math.random() * betArray.length)]
    setResult(outcome)
    const win = outcome === 1
    const payout = win ? wager * 2 : 0
    setPayout(payout)

    // Update global state
    handleGameComplete({ payout, wager })

    setIsPlaying(false)
  }

  return (
    <>
      <GambaUi.Portal target="screen">
        <div style={{ display: 'flex', gap: 16, height: '100%', width: '100%' }}>
          {/* Main game area */}
          <div style={{ flex: 1 }}>
            <GambaUi.Responsive>
              <div style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                width: '100%',
                maxWidth: 800,
                margin: '0 auto',
                padding: 24,
                boxSizing: 'border-box',
              }}>
                <h2 style={{ fontSize: 32, marginBottom: 16 }}>🎮 Hello World Game</h2>
                <div style={{ fontSize: 24, marginBottom: 32 }}>Bet and win!</div>
              </div>
            </GambaUi.Responsive>
          </div>
          
          {/* Optional sidebar */}
          <div style={{
            width: 300,
            padding: 24,
            backgroundColor: '#f9f9f9',
            borderLeft: '1px solid #e0e0e0',
            height: '100vh',
            overflowY: 'auto',
          }}>
            <h3 style={{ fontSize: 24, marginBottom: 16 }}>Game Info</h3>
            <div style={{ fontSize: 18, marginBottom: 8 }}>
              <strong>Token:</strong> {token?.symbol}
            </div>
            <div style={{ fontSize: 18, marginBottom: 8 }}>
              <strong>Balance:</strong> {balance} {token?.symbol}
            </div>
            <div style={{ fontSize: 18, marginBottom: 8 }}>
              <strong>Wager:</strong> {wager} {token?.symbol}
            </div>
            <div style={{ fontSize: 18, marginBottom: 8 }}>
              <strong>Result:</strong> {result === 1 ? 'Win' : result === 0 ? 'Lose' : ''}
            </div>
          </div>
        </div>
      </GambaUi.Portal>
      
      <GameControls
        wager={wager}
        setWager={setWager}
        onPlay={play}
        isPlaying={isPlaying}
        showOutcome={showOutcome}
        playButtonText={playButtonText}
      />
    </>
  )
}
```

---

## Full betArray.ts (for reference)

```ts
export const betArray = [1, 0] // 50% win/loss for demo
```

---

## Next Steps
- Use HelloWorld as your starting point for all new games.
- Always add new games to `src/games/featuredGames.tsx` and `src/games/allGames.ts`.
- Read the rest of this manual for advanced patterns, troubleshooting, and best practices.

---
