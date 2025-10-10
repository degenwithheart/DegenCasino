#!/bin/bash
# copy-apk-if-exists.sh
# Copy existing APK to public directory if it exists

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BUILD_DIR="$SCRIPT_DIR/build"
MOBILE_PUBLIC_DIR="$PROJECT_ROOT/public/mobile"

# Ensure mobile public directory exists
mkdir -p "$MOBILE_PUBLIC_DIR"

# Look for existing APK files
APK_FOUND=false

# Check Capacitor build
if [ -f "$BUILD_DIR/capacitor/android/app/build/outputs/apk/release/app-release.apk" ]; then
  echo "📱 Found Capacitor release APK, copying..."
  cp "$BUILD_DIR/capacitor/android/app/build/outputs/apk/release/app-release.apk" "$MOBILE_PUBLIC_DIR/degencasino-latest.apk"
  APK_FOUND=true
elif [ -f "$BUILD_DIR/capacitor/android/app/build/outputs/apk/debug/app-debug.apk" ]; then
  echo "📱 Found Capacitor debug APK, copying..."
  cp "$BUILD_DIR/capacitor/android/app/build/outputs/apk/debug/app-debug.apk" "$MOBILE_PUBLIC_DIR/degencasino-latest.apk"
  APK_FOUND=true
fi

# Check if APK already exists in public directory
if [ -f "$MOBILE_PUBLIC_DIR/degencasino-latest.apk" ]; then
  APK_SIZE=$(ls -lh "$MOBILE_PUBLIC_DIR/degencasino-latest.apk" | awk '{print $5}')
  echo "✅ APK ready: degencasino-latest.apk ($APK_SIZE)"
  APK_FOUND=true
fi

if [ "$APK_FOUND" = false ]; then
  echo "⚠️  No APK found. Run './mobile-app/build-and-deploy-apk.sh' to build the APK"
  echo "   Available options:"
  echo "   1. cd mobile-app && ./build-and-deploy-apk.sh    # Full APK build"
  echo "   2. Manual copy if you have an APK elsewhere"
fi