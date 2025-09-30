# DegenHeart Casino - PWA & Chrome Extension 🎰

This package includes both Progressive Web App (PWA) and Chrome Extension versions of DegenHeart Casino.

## 📁 What's Included

### PWA Folder (`/PWA/`)
- `manifest.json` - PWA configuration with enhanced features
- `service-worker.js` - Offline caching and performance optimization
- `index.html` - Standalone app entry point
- `icon-192.png` & `icon-512.png` - PWA icons

### Chrome Extension Folder (`/chrome-extension/`)
- `manifest.json` - Chrome Extension v3 configuration
- `popup.html` - Extension popup interface
- `popup.js` - Popup functionality and controls
- `background.js` - Extension background service worker
- `icons/` - Extension icons (16px, 32px, 48px, 128px)

## 🚀 PWA Installation

### Option 1: Deploy PWA Folder to Vercel
1. Copy the entire `/PWA/` contents to your Vercel project `/public` directory
2. Deploy to Vercel
3. Users can now "Add to Home Screen" on mobile devices
4. Desktop users can install via browser's install prompt

### Option 2: Use Existing PWA Setup
Your main site already has PWA capabilities built-in with:
- Enhanced `manifest.webmanifest` in `/public/`
- Advanced service worker `sw.js` with game caching
- Icons already configured

Users can install directly from https://degenheart.casino

## 🔧 Chrome Extension Installation

### For Development/Testing:
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top right toggle)
3. Click "Load unpacked"
4. Select the `/chrome-extension/` folder
5. The DegenHeart Casino extension will appear in Chrome

### For Distribution:
1. Zip the `/chrome-extension/` folder
2. Upload to Chrome Web Store Developer Dashboard
3. Follow Chrome Web Store review process

## ✨ Features

### PWA Features:
- 📱 Add to Home Screen support
- 🔄 Offline capability with service worker caching
- 🎮 App shortcuts (Games, Jackpot)
- 🎨 Themed splash screen and app appearance
- 📊 Enhanced manifest with categories and descriptions

### Chrome Extension Features:
- 🖼️ Popup interface (420x640px) with embedded casino
- 🚀 "New Window" button for fullscreen experience
- 🔄 Refresh and navigation controls
- ⌨️ Keyboard shortcuts (Ctrl+R, Ctrl+H, Ctrl+N)
- 📊 Usage analytics and launch tracking
- 🎯 Context menu integration
- 💾 Settings storage and window management

## 🎮 User Experience

### PWA Installation Flow:
1. Visit https://degenheart.casino
2. Browser shows "Install App" prompt
3. Click install → DegenHeart appears as native app
4. Launch from home screen/desktop like any app

### Chrome Extension Flow:
1. Install extension from Chrome Web Store
2. Click extension icon in toolbar
3. Casino loads in popup window (420x640)
4. Click "New Window" for fullscreen gaming
5. Keyboard shortcuts for quick navigation

## 🔧 Technical Details

### PWA Manifest Enhancements:
- Multiple icon sizes (72px to 512px)
- App shortcuts for quick access
- Proper orientation and display modes
- Enhanced metadata and categorization

### Chrome Extension Architecture:
- **Manifest v3** compliance for future Chrome support
- **Service Worker** background script for performance
- **Content Security Policy** for security
- **Storage API** for user preferences
- **Tabs API** for window management

### Caching Strategy:
- PWA: Comprehensive game asset caching
- Extension: Minimal overhead, relies on site's existing caching
- Both: Offline-first approach for core functionality

## 📈 Analytics & Monitoring

Both solutions include:
- Launch tracking and usage statistics
- Performance monitoring
- Error handling and fallback mechanisms
- User preference storage

## 🛠️ Customization

### PWA Customization:
- Edit `manifest.json` for branding changes
- Modify `service-worker.js` for caching strategy
- Update icons in multiple sizes for different devices

### Extension Customization:
- Modify `popup.html` for UI changes
- Update `background.js` for new features
- Customize keyboard shortcuts and context menus
- Add new icons or branding elements

## 🚀 Deployment Checklist

- [ ] Test PWA installation on mobile and desktop
- [ ] Verify Chrome Extension popup functionality
- [ ] Test offline capabilities
- [ ] Confirm icons display properly at all sizes
- [ ] Validate keyboard shortcuts work
- [ ] Test new window functionality
- [ ] Verify analytics tracking
- [ ] Check cross-browser compatibility

## 💡 Pro Tips

1. **PWA**: Best for mobile users and desktop app-like experience
2. **Chrome Extension**: Perfect for quick access and Chrome power users
3. **Both**: Consider offering both options to maximize reach
4. **Updates**: PWA updates automatically, Extension requires store updates
5. **Branding**: Both maintain DegenHeart's romantic casino aesthetic

---

🎰 **Ready to give users native app access to DegenHeart Casino!**

The PWA provides a mobile-first experience while the Chrome Extension offers desktop convenience. Both maintain the full casino functionality with enhanced user experience.