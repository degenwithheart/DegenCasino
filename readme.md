# DegenHeart Casino

<!-- Screenshots (collapsible, thumbnails link to full images below for best GitHub Markdown compatibility) -->
<details>
  <summary>Show screenshots</summary>

  <!-- Thumbnails that link to anchors below -->
  <p align="center">
    <a href="#screenshot-1"><img src="./screenshots/1.jpg" width="120" alt="Screenshot 1 thumbnail" /></a>
    <a href="#screenshot-2"><img src="./screenshots/2.jpg" width="120" alt="Screenshot 2 thumbnail" /></a>
    <a href="#screenshot-3"><img src="./screenshots/3.jpg" width="120" alt="Screenshot 3 thumbnail" /></a>
  </p>

  <!-- Full-size images with anchors -->
  <a id="screenshot-1"></a>
  ![Screenshot 1](./screenshots/1.jpg)

  <a id="screenshot-2"></a>
  ![Screenshot 2](./screenshots/2.jpg)

  <a id="screenshot-3"></a>
  ![Screenshot 3](./screenshots/3.jpg)

</details>

Project Overview  
DegenCasino is a sophisticated, custom-built on-chain casino platform running on Solana, created by Stuart (@DegenWithHeart). It's a heavily refactored version of the gamba-labs/platform template, specifically tailored for production deployment with enhanced features and branding.

## Core Architecture

**Tech Stack**  
- Frontend: React 18 + TypeScript, Vite build system  
- Routing: React Router v6 with future flags for v7 compatibility  
- State Management: Zustand with localStorage persistence  
- Styling: styled-components (primary) + minimal Tailwind CSS  
- Blockchain: Solana with wallet adapters (Solflare default)  
- Gaming Engine: Gamba SDKs (core-v2, react-v2, react-ui-v2)  
- 3D/Graphics: Three.js, React Three Fiber, React Three Drei  
- Physics: Matter.js for game simulations  
- Audio: Tone.js for sound effects  
- Animations: Framer Motion  
- Browser Compatibility: Extensive polyfills (Buffer, process, crypto-browserify)  

**Key Entry Points**  
- vite.config.ts - Custom build configuration with polyfills and optimization  
- index.tsx - Provider tree setup (Connection → Wallet → Gamba → Platform)  
- App.tsx - Route definitions and global layout  
- constants.ts - Configuration for RPC, fees, tokens, pools  

## Application Structure

**Main Sections**  
- Dashboard (/) - Main landing with game selection  
- Games (/game/:wallet/:gameName) - Individual game pages  
- User Profiles (/:wallet/profile) - Player statistics  
- Explorer - Blockchain transaction verification  
- About/Whitepaper - Project information and roadmap  

**Game Implementations (games)**  
Your platform includes 11 casino games:
- Dice - Simple probability-based game
- Roulette - Classic wheel game with custom UI
- Slots - 3D slot machine with animations
- Blackjack - Card game with dealer logic
- Crash - Multiplier crash game
- Flip - Coin flip with dual-player support
- HiLo - Higher/Lower prediction game
- Mines - Minesweeper-style game
- Plinko - Physics-based ball drop
- PlinkoRace - Competitive Plinko variant
- ProgressivePoker - Poker with progressive jackpots

**Key Components**  
- Sidebar - Navigation with wallet integration
- Game Controls - Bet management and gameplay UI
- Transaction Viewer - Blockchain explorer integration
- Platform Analytics - Real-time statistics
- Referral System - Built-in affiliate program
- Jackpot System - Progressive prize pools

## Fairness & Security Focus

**Provably Fair Gaming**  
- Cryptographic proofs for all game outcomes  
- Blockchain-verified randomness  
- Transparent transaction logging  
- Extensive RTP (Return to Player) testing  

## Testing Infrastructure

Your test_scripts directory contains comprehensive validation:
- RTP calibration and auditing
- Game randomness testing
- Integration testing
- Visual payout verification
- Trust and fairness audits

## API Integration

- Edge functions for authentication
- Metadata fetching and caching
- Real-time statistics
- Helius integration for enhanced data

## Notable Customizations

- Build System: Custom Vite config with Node.js polyfills for browser compatibility
- Routing: Divergent from upstream with additional pages and wallet-based URLs
- UI/UX: Casino-themed design with neon animations and responsive mobile support
- State Management: Custom Zustand store with persistence
- Token Support: SOL, USDC, JUP, BONK, and placeholder DGHRT token
- Explorer Integration: Solscan integration for transaction verification

## Development Workflow

- Extensive build optimization scripts
- Image compression and asset optimization
- Service worker for PWA functionality
- Error boundaries and global error handling
- Development vs production environment handling

---

This is a production-ready, enterprise-level casino platform with strong emphasis on user experience, fairness, and technical excellence. The codebase demonstrates deep blockchain integration and sophisticated game development practices.

---

## Donations

If you find this project useful and would like to support ongoing development and open-source privacy and security initiatives, donations are welcome:

**SOL Address:**  
`4U3kLekCh53rXxxQE3hSbqoKKLzZpLYYZRTc26R8mnGe`