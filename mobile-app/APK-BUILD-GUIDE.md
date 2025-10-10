# Mobile App APK Build Guide

## Overview

The DegenCasino mobile app is built using Capacitor and served as an APK file at `https://degenheart.casino/mobile/degencasino-latest.apk`. This guide explains how to build and deploy the APK.

## The Problem

The MobileAppPage.tsx references `degencasino-latest.apk` but the setup scripts only create the project structure without building the actual APK file. The APK needs to be built and copied to `public/mobile/` to be served by the web server.

## Quick Solution

### Option 1: Build APK from scratch (Recommended)
```bash
cd mobile-app
./build-and-deploy-apk.sh
```

This script will:
1. Build the main web app (if needed)
2. Set up mobile project structure (if needed)  
3. Build the mobile app with Capacitor
4. Compile the Android APK
5. Copy the APK to `public/mobile/degencasino-latest.apk`

### Option 2: Copy existing APK (if you have one)
```bash
cd mobile-app
./copy-apk-if-exists.sh
```

## Integration with Build Process

The APK copying is now integrated into the main build process:

- `npm run build:compress` → includes `mobile:sync:safe` → calls `copy-apk-if-exists.sh`
- This ensures that if an APK exists, it gets copied during builds
- If no APK exists, it shows instructions on how to build one

## File Structure

```
mobile-app/
├── build-and-deploy-apk.sh      # 🆕 Complete APK build & deploy
├── copy-apk-if-exists.sh        # 🆕 Copy existing APK to public/
├── setup-mobile-apps.sh         # Project structure setup
├── build-mobile.sh             # Mobile app preparation  
├── deploy-mobile.sh            # APK building (without copying)
├── sync-mobile.sh              # Updated to include APK copying
└── build/capacitor/            # Capacitor project files

public/
└── mobile/
    └── degencasino-latest.apk  # 🆕 APK served to users
```

## Requirements

To build the APK, you need:

1. **Node.js & npm** (for Capacitor)
2. **Android SDK** and **Android Studio** 
3. **Java JDK 17+**
4. **Gradle** (installed automatically if missing)

### Quick Android Setup

```bash
# Install Android Studio
# Download from: https://developer.android.com/studio

# Set environment variables (add to ~/.zshrc)
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools

# Accept licenses
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --licenses
```

## Troubleshooting

### APK build fails
```bash
# Check Android environment
cd mobile-app/build/capacitor
npx cap doctor

# Manual Gradle build
cd mobile-app/build/capacitor/android
./gradlew assembleRelease
```

### APK not appearing on website
1. Verify file exists: `ls -la public/mobile/degencasino-latest.apk`
2. Check file size: `du -h public/mobile/degencasino-latest.apk`
3. Test direct access: `curl -I https://degenheart.casino/mobile/degencasino-latest.apk`

### Build environment issues
```bash
# Clean everything and rebuild
rm -rf mobile-app/build
cd mobile-app
./build-and-deploy-apk.sh
```

## Deployment Notes

- The APK file should be committed to the repository
- Vercel automatically serves files from `public/` directory
- APK updates require rebuilding and redeploying
- Consider APK signing for production releases

## Security Considerations

- Current APK is unsigned (debug build)
- For production, implement proper APK signing
- Consider automated APK updates via the app itself
- Monitor APK file size (current builds are typically 10-50MB)

## Next Steps

1. **Build the APK**: Run `./build-and-deploy-apk.sh`
2. **Commit the APK**: `git add public/mobile/ && git commit -m "Add mobile APK"`
3. **Deploy**: Push to trigger Vercel deployment
4. **Test**: Visit the mobile app page and test the download