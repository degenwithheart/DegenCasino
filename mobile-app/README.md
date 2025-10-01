############
# README
############
cat > $BASE/README.md <<'EOF'
# DegenCasino Mobile Apps

This directory contains the complete mobile app development setup for DegenCasino, including Android and iOS builds using Capacitor and Cordova frameworks.

## 🚀 Quick Start

1. **Setup Development Environment**
   ```bash
   ./setup-dev.sh
   ```

2. **Build Mobile Apps**
   ```bash
   ./build-mobile.sh
   ```

3. **Sync projects with latest plugins:**
   ```bash
   npm run mobile:sync
   ```

4. **Deploy to stores:**
   ```bash
   npm run mobile:deploy
   ```

## 📱 Supported Platforms

- **Android** (API 24+, Android 7.0+)
- **iOS** (iOS 14.0+) - macOS required
- **PWA** (Progressive Web App)

## 🏗️ Architecture

### Frameworks
- **Capacitor v7** - Modern native runtime with Browser plugin for fullscreen WebView
- **Cordova** - Mature cross-platform with InAppBrowser and Whitelist plugins

### Integration with DegenCasino
- Builds from main `dist/` directory
- Preserves Solana/Gamba functionality
- Maintains provider hierarchy
- Supports wallet connections

## 📂 Project Structure

```
mobile-app/
├── setup-dev.sh           # Development environment setup
├── setup-mobile-apps.sh   # Mobile project scaffolding
├── build-mobile.sh        # Build web app for mobile
├── deploy-mobile.sh       # Deploy to app stores
├── mobile-config.json     # Mobile-specific configuration
├── build/                 # Generated mobile projects
│   ├── capacitor/         # Capacitor project
│   ├── cordova/           # Cordova project
│   ├── android-studio/    # Native Android project
│   └── generate-icons.sh  # Icon generation script
└── README.md
```

## 🛠️ Development Workflow

### 1. Initial Setup
```bash
# Install all development tools
./setup-dev.sh

# This installs:
# - Java JDK 17
# - Android Studio
# - Capacitor CLI
# - Cordova CLI  
# - iOS tools (Mac only)
```

### 2. Build Process
```bash
# Build main web app first (from project root)
cd ..
npm run build

# Then build mobile apps
cd mobile-app
./build-mobile.sh
```

### 3. Sync Projects
```bash
# Sync Capacitor v7 and install Browser plugin
npm run mobile:sync

# Manual sync (from mobile-app directory)
./sync-mobile.sh
```

### 4. Testing
```bash
# Run on Android device/emulator
cd build/capacitor && npx cap run android
cd build/cordova && cordova run android

# Run on iOS (Mac only)
cd build/capacitor && npx cap run ios
cd build/cordova && cordova run ios
```

### 4. Deployment
```bash
# Build release APKs/IPAs
./deploy-mobile.sh

# Or platform-specific
./deploy-mobile.sh android
./deploy-mobile.sh ios
```

## 🔧 Configuration

### Mobile Config (`mobile-config.json`)
- Platform-specific settings
- App permissions
- Feature flags
- Build configuration

### Environment Variables
```bash
# Android
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin:$ANDROID_HOME/platform-tools

# Java (for Android builds)
export JAVA_HOME=/opt/homebrew/opt/openjdk@17
```

## 📱 Platform-Specific Notes

### Android
- **Min SDK**: 24 (Android 7.0)
- **Target SDK**: 34 (Android 14)
- **Package ID**: `com.degenwithheart.casino`
- **Permissions**: Internet, Camera, Storage

### iOS
- **Min Version**: iOS 14.0
- **Target**: iOS 17.0
- **Bundle ID**: `com.degenwithheart.casino`
- **Requires**: Xcode on macOS

## 🎯 Features Enabled

### Solana Integration
- ✅ Wallet connections (Phantom, Solflare, etc.)
- ✅ Transaction signing
- ✅ Network switching (mainnet/devnet)
- ✅ RPC proxy support

### Gamba SDK
- ✅ Provably fair gaming
- ✅ On-chain casino functionality  
- ✅ Platform provider integration

### Mobile-Specific
- ✅ **Fullscreen Native WebView** (Capacitor Browser plugin)
- ✅ **InAppBrowser** for external links (Cordova)
- ✅ **Custom toolbar styling** with DegenCasino branding
- ✅ **HTTPS scheme enforcement** for security
- ✅ Native navigation
- ✅ Push notifications (future)
- ✅ Biometric authentication (future)
- ✅ App store optimization

### Browser Plugin Features (Capacitor v7)
- ✅ **Fullscreen presentation** - No browser UI
- ✅ **Custom colors** - Match DegenCasino theme
- ✅ **External link handling** - Transaction explorers, wallets
- ✅ **Event listeners** - Track user interactions
- ✅ **Programmatic control** - Open/close from code

## 🚨 Troubleshooting

### Common Issues

**Android Studio not found**
```bash
# Mac: Install via Homebrew
brew install --cask android-studio

# Manual: Download from https://developer.android.com/studio
```

**Java version conflicts**
```bash
# Check Java version
java -version

# Install correct version
brew install openjdk@17
```

**Capacitor sync fails**
```bash
# Clean and rebuild
cd build/capacitor
npx cap clean
npx cap sync
```

**iOS build fails (Mac)**
```bash
# Install Xcode Command Line Tools
xcode-select --install

# Accept Xcode license
sudo xcodebuild -license accept
```

### Build Outputs

**Android APKs**
- Capacitor: `build/capacitor/android/app/build/outputs/apk/`
- Cordova: `build/cordova/platforms/android/app/build/outputs/apk/`

**iOS IPAs** (Mac only)
- Capacitor: `build/capacitor/ios/`
- Cordova: `build/cordova/platforms/ios/`

## 🔄 Integration with Main Project

The mobile apps automatically sync with your main DegenCasino build:

1. **Web Build**: Uses `../dist/` from main project
2. **Assets**: Copies from `../public/`
3. **Configuration**: Inherits from main `package.json`
4. **Dependencies**: Maintains provider hierarchy

## 📚 Additional Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Cordova Documentation](https://cordova.apache.org/docs)
- [Android Studio Guide](https://developer.android.com/studio/intro)
- [Xcode Guide](https://developer.apple.com/xcode/)

## 🤝 Contributing

When adding mobile-specific features:

1. Update `mobile-config.json`
2. Test on both Capacitor and Cordova
3. Verify Android and iOS compatibility
4. Update this README

---

**Happy mobile development! 🎰📱**

## Cordova
```bash
cd Cordova
npm install -g cordova
cordova platform add android
cordova build android
