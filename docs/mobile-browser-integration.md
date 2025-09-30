# DegenCasino Mobile Browser Integration Guide

## Overview
The mobile browser integration provides fullscreen native WebView functionality for your Capacitor v7 mobile app while maintaining compatibility with your existing web application. This system integrates seamlessly with your existing wallet actions, transaction handlers, and network context.

## Provider Integration

### 1. Add to Provider Hierarchy
Add the `MobileBrowserProvider` to your main provider tree in `src/index.tsx`:

```tsx
// In src/index.tsx - Add after GambaProvider
import { MobileBrowserProvider } from './contexts/MobileBrowserContext';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <BrowserRouter>
    <NetworkProvider>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets}>
          <WalletModalProvider>
            <TokenMetaProvider>
              <SendTransactionProvider>
                <GambaProvider>
                  <GambaPlatformProvider>
                    <ReferralProvider>
                      <MobileBrowserProvider>  {/* Add here */}
                        <App />
                      </MobileBrowserProvider>
                    </ReferralProvider>
                  </GambaPlatformProvider>
                </GambaProvider>
              </SendTransactionProvider>
            </TokenMetaProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </NetworkProvider>
  </BrowserRouter>
);
```

## Component Integration

### 1. Transaction Links
Replace standard transaction links with mobile-aware components:

```tsx
// Before
<a href={`https://solscan.io/tx/${signature}`} target="_blank">
  View Transaction
</a>

// After
import { MobileTransactionLink } from '../components/Mobile/MobileBrowserComponents';

<MobileTransactionLink 
  signature={signature}
  cluster={network === 'devnet' ? 'devnet' : 'mainnet-beta'}
  variant="primary"
>
  View Transaction
</MobileTransactionLink>
```

### 2. Wallet Connection
Enhance wallet connection with mobile-specific features:

```tsx
// Before - Standard wallet connection
<WalletMultiButton />

// After - Mobile-enhanced wallet connection
import { MobileWalletConnection } from '../components/Mobile/MobileBrowserComponents';

<MobileWalletConnection 
  variant="primary"
  onConnect={() => {
    // Your existing connect logic
    setWalletModalVisible(false);
  }}
  onDisconnect={() => {
    // Your existing disconnect logic
    resetGameState();
  }}
/>
```

### 3. Game Help Integration
Add contextual help buttons to your games:

```tsx
// In any game component
import { MobileGameHelpButton } from '../components/Mobile/MobileBrowserComponents';

const DiceGame = () => {
  return (
    <GameContainer>
      <GameHeader>
        <h1>Dice Game</h1>
        <MobileGameHelpButton gameId="dice" />
      </GameHeader>
      {/* Rest of your game component */}
    </GameContainer>
  );
};
```

## Hook Usage

### Direct Hook Usage
For custom implementations, use the hook directly:

```tsx
import { useBrowser } from '../hooks/mobile/useBrowser';

const MyComponent = () => {
  const { 
    isNativePlatform, 
    openTransaction, 
    openExternal,
    openWalletDownload 
  } = useBrowser();

  const handleTransactionSuccess = async (signature: string) => {
    // Your existing success handler logic
    updateGameState(signature);
    
    // Mobile-aware transaction viewing
    if (isNativePlatform) {
      await openTransaction(signature);
    } else {
      navigate(`/explorer/transaction/${signature}`);
    }
  };

  return (
    // Your component JSX
  );
};
```

### Context Usage
For accessing browser functionality anywhere in the component tree:

```tsx
import { useMobileBrowser } from '../contexts/MobileBrowserContext';

const SomeDeepComponent = () => {
  const { isNativePlatform, openGameHelp } = useMobileBrowser();
  
  return (
    <button onClick={() => openGameHelp('current-game')}>
      {isNativePlatform ? 'Help (Native)' : 'Help'}
    </button>
  );
};
```

## Integration with Existing Systems

### 1. Wallet Toast Integration
The mobile browser automatically integrates with your existing `useWalletToast` system:

```tsx
// The useBrowser hook automatically uses your existing toast system
const { showWalletToast } = useWalletToast();

// Wallet connection success
showWalletToast('WALLET_CONNECTED');

// Transaction success with mobile-specific messaging
showWalletToast('TRANSACTION_SUCCESS', {
  description: isNativePlatform 
    ? 'Transaction opened in native browser'
    : 'Transaction completed successfully'
});
```

### 2. Network Context Integration
Respects your existing network switching:

```tsx
// The hook automatically uses current network from NetworkContext
const { network } = useNetwork();

// Transaction links automatically adapt to current network
await openTransaction(signature, network === 'devnet' ? 'devnet' : 'mainnet-beta');
```

### 3. Game Integration Examples
Update your existing game components:

```tsx
// In src/components/Game/GameResult.tsx
import { useBrowser } from '../../hooks/mobile/useBrowser';

const GameResult = ({ signature, amount, isWin }) => {
  const { openTransaction, isNativePlatform } = useBrowser();
  
  return (
    <ResultContainer>
      <AmountDisplay isWin={isWin}>{amount} SOL</AmountDisplay>
      
      {signature && (
        <button onClick={() => openTransaction(signature)}>
          {isNativePlatform ? 'View in Explorer (Native)' : 'View Transaction'}
        </button>
      )}
    </ResultContainer>
  );
};
```

## Platform Detection

### Detecting Mobile vs Desktop
```tsx
const { isNativePlatform, isMobile } = useMobileBrowser();

// isNativePlatform - true when running in Capacitor mobile app
// isMobile - true when on mobile device (web or native)

return (
  <div>
    {isNativePlatform && <NativeModeIndicator />}
    {isMobile ? <MobileLayout /> : <DesktopLayout />}
  </div>
);
```

## Styling Integration

### Using Your Existing Styled Components
The mobile browser components use your existing styled-components theme:

```tsx
// Components automatically inherit your theme
const MobileBrowserButton = styled.button`
  background: ${props => props.theme.colors.primary}; // Your theme
  color: ${props => props.theme.colors.text};
  // ... rest of your styling
`;
```

### Custom Variants
```tsx
<MobileTransactionLink variant="ghost" />     // Subtle styling
<MobileTransactionLink variant="secondary" /> // Secondary button style
<MobileTransactionLink variant="primary" />   // Primary CTA styling
```

## Testing

### Web Development
- Components automatically fall back to web behavior
- No Capacitor dependencies required for web development
- Test with responsive design tools

### Mobile Testing
```bash
# Build and test mobile app
cd mobile-app/capacitor
npm run build
npx cap run android
# or
npx cap run ios
```

### Integration Testing
1. Test wallet connections in both web and native environments
2. Verify transaction links open correctly in both contexts
3. Check that help buttons navigate to appropriate documentation
4. Ensure social links open in native browser with correct styling

## Troubleshooting

### Common Issues

1. **Provider Order**: Ensure `MobileBrowserProvider` is after `GambaProvider`
2. **Import Paths**: Check that import paths match your project structure
3. **Capacitor Version**: Ensure you're using Capacitor v7 with Browser plugin

### Debug Mode
```tsx
const { isNativePlatform, isAvailable } = useBrowser();

console.log('Platform:', {
  isNative: isNativePlatform,
  isBrowserAvailable: isAvailable,
  userAgent: navigator.userAgent
});
```

## Migration from Existing Components

### Gradual Migration Strategy
1. Start with new components (transaction links)
2. Update wallet connection components
3. Add help buttons to games
4. Update social/external links
5. Test thoroughly on both platforms

### Backward Compatibility
All components maintain backward compatibility - they work identically on web platforms and enhance functionality on mobile.