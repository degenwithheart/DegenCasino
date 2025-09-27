# DegenHeart Casino - Error System Inventory

This document catalogs all error titles, messages, and types across both error handling systems in the DegenHeart Casino application.

## Feature Flag Control
**Current Setting:** `USE_COMPREHENSIVE_ERROR_SYSTEM: false`
- `true` = ComprehensiveErrorBoundary (new system) 
- `false` = GlobalErrorBoundary (old system)

---

## 🚨 GlobalErrorBoundary (Old System)

### Error Titles
- **"Application Error"** - Standard application error (retries < 2)
- **"Critical Application Error"** - After max retries exceeded (≥2 retries)

### Error Messages
- Uses `ErrorModal` component for display
- Error details come from the actual Error object
- Simple retry mechanism (max 2 retries)
- Auto-reload on critical errors

---

## 🔧 ComprehensiveErrorBoundary (New System)

### Error Titles by Level
- **"Application Error"** - App-level errors (level='app')
- **"Page Loading Error"** - Route-level errors (level='route') 
- **"Component Error"** - Component-level errors (level='component')

### Error Messages
- **Standard Message:** "{componentName} went wrong and couldn't be loaded properly."
- **Max Retries Message:** "Multiple retry attempts failed."
- Advanced retry logic (max 3 retries)
- Multiple recovery options (Try Again, Go Home, Refresh Page)
- Development mode debugging details

### WindowErrorHandler (Part of New System)
- **"Unexpected Error"** - Unhandled window errors
  - Message: "Something went wrong. The page will be refreshed automatically."
  - Auto-reload: `true`
- **"Network or Loading Error"** - Promise rejections
  - Message: "A background operation failed. You can continue using the app or refresh if needed."
  - Auto-reload: `false`

---

## 🎮 Game-Specific Error Screens

### ErrorScreen Types & Messages
| Type | Usage | Common Messages |
|------|-------|----------------|
| `400` | Bad Request | "Wallet mismatch", "Invalid parameters" |
| `404` | Not Found | "Game not found. Please check the URL or try again later." |
| `500` | Server Error | "Something went wrong while loading the game.", "A rendering error occurred." |
| `503` | Service Unavailable | "This game is currently under maintenance. Please check back later!" |
| `1024` | Coming Soon | "This game is being added soon. Check back for new games!" |

---

## 💸 Wallet & Transaction Errors

### Connection Errors
- **"❌ Connection Failed"** - Wallet connection issues
- **"❌ Transaction Failed"** - Transaction execution failures
- **"❌ Account Setup Failed"** - Account initialization problems

### Network Errors
- **"🌐 Network Error"** - General network connectivity issues
- **"🔗 RPC Error"** - Solana RPC endpoint failures
- **"⚠️ Transaction Simulation Failed"** - Transaction simulation errors
- **"🐛 Program Error"** - Smart contract execution errors

### System Errors
- **"❓ Unknown Error"** - Catch-all for unidentified issues
- **"⏳ Loading Error"** - Data loading failures
- **"🖼️ Display Error"** - UI rendering problems
- **"🔌 API Error"** - External API communication failures

---

## 📋 Error Codes System

### Error Code Categories
The application uses a comprehensive error code system with user-friendly messages:

#### Generic Errors
- **25SS** - "Something went wrong. Please try again." (Generic fallback)
- **1JQK** - "Test runtime error triggered (dev only)."

#### Wallet & Connection
- **1JQO** - "Wallet not connected. Please connect your wallet."
- **1K3I** - "Wallet mismatch. Please reconnect with the correct wallet."
- **1K3Q** - "Transaction was rejected in your wallet."

#### Network & Transaction
- **1K2C** - "Network error. Please check your connection."
- **1K2F** - "Transaction failed. Please try again."
- **1K2G** - "Transaction confirmed successfully!" (Success)
- **1K3P** - "Network issue. Unable to get recent blockhash."
- **1K3R** - "Transaction simulation failed. Please check your inputs."
- **1K3S** - "Smart contract execution failed. Please try again."
- **1K3T** - "Transaction size exceeds limits. Please reduce complexity."

#### Game Errors
- **1K3A** - "Invalid bet amount. Please enter a valid value."
- **1K3B** - "Insufficient funds. Please deposit more to continue."
- **1K3C** - "Game not found. Please check the URL or try again later."
- **1K3J** - "This game is currently under maintenance. Please check back later!"
- **1K3K** - "This game is being added soon. Check back for new games!"
- **1K3L** - "Something went wrong while loading the game."
- **1K3M** - "A rendering error occurred."
- **1K3U** - "Game parameters are out of valid range. Please check your bet settings."

#### Data & Access
- **1K3N** - "This wallet has no transaction history yet."
- **1K3O** - "Access denied. Unable to fetch transaction data."

---

## 🎯 Success Messages

### Positive User Feedback
- **"📋 Copied!"** - Clipboard operations
- **"📋 Referral Link Copied"** - Referral sharing
- **"📤 Shared Successfully"** - Game result sharing
- **"⚡ Priority Fee Updated"** - Fee adjustments
- **"🎁 Bonus Claimed"** - Reward collection
- **"🎰 JACKPOT WON!"** - Major wins

---

## 🔍 Router & Component Errors

### RouterErrorBoundary (Fallback for Old System)
- Catches lazy loading errors during route changes
- Simple error display with retry functionality
- Used when `USE_COMPREHENSIVE_ERROR_SYSTEM: false`

### LazyComponentBoundary
- Handles lazy-loaded component failures
- Provides retry mechanism for failed imports
- Used in conjunction with SafeSuspense

---

## 📊 Usage Patterns

### When Each System is Active
1. **Old System (GlobalErrorBoundary):**
   - `USE_COMPREHENSIVE_ERROR_SYSTEM: false`
   - WindowErrorHandler is **disabled**
   - Uses RouterErrorBoundary for route errors
   - Simpler error UI with basic retry

2. **New System (ComprehensiveErrorBoundary):**
   - `USE_COMPREHENSIVE_ERROR_SYSTEM: true`
   - WindowErrorHandler is **enabled**
   - Advanced error boundaries at all levels
   - Rich error UI with multiple recovery options
   - Development debugging information

---

## 🚀 Recommendations

### Missing Error Types to Consider Adding
1. **Rate Limiting Errors** - "Too many requests. Please wait before trying again."
2. **Maintenance Mode** - "Platform is under maintenance. Please check back soon."
3. **Browser Compatibility** - "Your browser may not support all features. Please update or switch browsers."
4. **WebSocket Errors** - "Real-time connection lost. Attempting to reconnect..."
5. **Cache Errors** - "Data cache corrupted. Clearing cache and reloading..."
6. **Permission Errors** - "Permission denied. Please check your wallet permissions."
7. **Session Timeout** - "Session expired. Please refresh the page."
8. **Memory Errors** - "Low memory detected. Please close other tabs and try again."

### Error UX Improvements
1. Add error reporting functionality
2. Implement error recovery suggestions
3. Add contact support links for persistent errors
4. Include error timestamp and session ID for debugging
5. Add copy-to-clipboard for error details
6. Implement progressive error escalation (retry → refresh → contact support)

---

*Generated on: $(new Date().toISOString())*
*Total Error Types Cataloged: 50+*