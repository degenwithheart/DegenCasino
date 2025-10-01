# DegenCasino Browser Plugin Integration Guide

## 🎯 Integration Steps

### 1. Add MobileBrowserProvider to your provider hierarchy

In your `src/index.tsx`, add the MobileBrowserProvider after ReferralProvider:

```tsx
// Add this import at the top
import { MobileBrowserProvider } from './contexts/MobileBrowserContext'

// Then in your provider hierarchy:
<ReferralProvider
  prefix="code"
  fee={PLATFORM_REFERRAL_FEE}
>
  <MobileBrowserProvider>  {/* ADD THIS */}
    <UnifiedThemeProvider>
      {FEATURE_FLAGS.USE_COMPREHENSIVE_ERROR_SYSTEM ? (
        <ComprehensiveErrorBoundary level="app" componentName="Application">
          <App />
        </ComprehensiveErrorBoundary>
      ) : (
        <GlobalErrorBoundary>
          <App />
        </GlobalErrorBoundary>
      )}
    </UnifiedThemeProvider>
  </MobileBrowserProvider>  {/* ADD THIS */}
</ReferralProvider>
```

### 2. Install Capacitor dependencies in your main project

```bash
npm install @capacitor/core @capacitor/browser
```

### 3. Use the mobile browser components in your existing components

#### Example: Enhanced Transaction Results

Replace existing transaction result displays with:

```tsx
import { MobileTransactionResult } from '../components/Mobile/MobileBrowserIntegration'

// In your transaction component:
<MobileTransactionResult 
  signature={transactionSignature}
  status="success"
  cluster="mainnet-beta"
/>
```

#### Example: Enhanced Wallet Connection

```tsx
import { MobileWalletConnect } from '../components/Mobile/MobileBrowserIntegration'

// In your wallet connection component:
<MobileWalletConnect 
  onWalletSelect={(wallet) => console.log('Selected:', wallet)}
  currentWallet={currentWalletName}
/>
```

#### Example: Game Interface with Mobile Support

```tsx
import { MobileGameInterface } from '../components/Mobile/MobileBrowserIntegration'

// Wrap your game components:
<MobileGameInterface gameId="dice" gameName="Dice">
  <YourExistingGameComponent />
</MobileGameInterface>
```

### 4. Use the context hook in any component

```tsx
import { useMobileBrowser } from '../contexts/MobileBrowserContext'

function AnyComponent() {
  const { 
    isNativePlatform, 
    isMobile, 
    openTransaction, 
    openWalletDownload 
  } = useMobileBrowser()

  return (
    <div>
      {isNativePlatform && <span>🚀 Native App Mode</span>}
      <button onClick={() => openTransaction(signature)}>
        View Transaction
      </button>
    </div>
  )
}
```

## 🎮 Real Integration Examples

### Transaction Explorer Integration

```tsx
// In your existing transaction success component
import { useMobileBrowser } from '../contexts/MobileBrowserContext'

export function TransactionSuccess({ signature }: { signature: string }) {
  const { openTransaction, isNativePlatform } = useMobileBrowser()

  return (
    <div className="transaction-success">
      <h3>Transaction Complete!</h3>
      <p>Signature: {signature.slice(0, 8)}...</p>
      
      <button 
        onClick={() => openTransaction(signature)}
        className="view-transaction-btn"
      >
        {isNativePlatform ? 'View in Native Browser' : 'View on Solscan'}
      </button>
    </div>
  )
}
```

### Wallet Connection Flow

```tsx
// In your wallet connection component
import { useMobileBrowser } from '../contexts/MobileBrowserContext'

export function WalletConnectionFlow() {
  const { openWalletDownload, isNativePlatform } = useMobileBrowser()
  
  const handleWalletNotFound = (walletName: string) => {
    // When user tries to connect but wallet not installed
    openWalletDownload(walletName as any)
  }

  return (
    <div className="wallet-flow">
      {isNativePlatform && (
        <div className="native-indicator">
          📱 Mobile App - Tap to download wallets
        </div>
      )}
      
      <button onClick={() => handleWalletNotFound('phantom')}>
        Connect Phantom Wallet
      </button>
    </div>
  )
}
```

### Game Help Integration

```tsx
// In your game components
import { useMobileBrowser } from '../contexts/MobileBrowserContext'

export function GameHeader({ gameId, gameName }: { gameId: string, gameName: string }) {
  const { openGameHelp, isNativePlatform } = useMobileBrowser()

  return (
    <header className="game-header">
      <h1>{gameName}</h1>
      
      <button 
        onClick={() => openGameHelp(gameId)}
        className="help-button"
      >
        {isNativePlatform ? '📱 Help' : '❓ Help'}
      </button>
    </header>
  )
}
```

## 🚀 Testing Your Integration

### 1. Web Testing
```bash
npm run dev
# Test in browser - should fall back to window.open()
```

### 2. Mobile Web Testing  
```bash
npm run dev
# Open in mobile browser - should show mobile indicators
```

### 3. Native App Testing
```bash
npm run mobile:build
cd mobile-app/build/capacitor && npx cap run android
# Should open fullscreen native browser windows
```

## 🔧 Customization Options

### Custom Browser Styling

The browser plugin uses these defaults for DegenCasino:
- **Toolbar Color**: `#000000` (black)
- **Presentation**: `fullscreen`
- **Scheme**: `https` (secure)

### Custom Event Handling

```tsx
// Listen for browser events in your components
useEffect(() => {
  const { Browser } = await import('@capacitor/browser')
  
  const listener = Browser.addListener('browserFinished', () => {
    // Custom logic when browser closes
    console.log('User closed browser')
    // Maybe refresh wallet connection or game state
  })

  return () => listener.then(l => l.remove())
}, [])
```

## 🎯 Benefits for DegenCasino Users

1. **Seamless Transaction Viewing** - Native fullscreen Solscan integration
2. **Easy Wallet Downloads** - One-tap wallet installation for mobile users  
3. **Integrated Help System** - Native help browser without leaving the app
4. **Professional Mobile Experience** - App-like behavior on mobile devices
5. **Solana Ecosystem Integration** - Direct links to explorers, wallets, DeFi tools

Your DegenCasino app now has professional mobile browser integration! 🎰📱