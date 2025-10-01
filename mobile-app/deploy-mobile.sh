#!/bin/bash
# deploy-mobile.sh
# Deploy DegenCasino to mobile app stores

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUILD_DIR="$SCRIPT_DIR/build"

echo "=== DegenCasino Mobile Deploy ==="

# Function to build Android APK
build_android_apk() {
  echo "[*] Building Android APK..."
  
  if [ -d "$BUILD_DIR/capacitor" ]; then
    cd "$BUILD_DIR/capacitor"
    npx cap build android
    echo "  ✓ Capacitor Android APK built"
  fi
  
  if [ -d "$BUILD_DIR/cordova" ]; then
    cd "$BUILD_DIR/cordova"
    cordova build android --release
    echo "  ✓ Cordova Android APK built"
  fi
}

# Function to build iOS app (Mac only)
build_ios_app() {
  if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "  ⚠️ iOS build requires macOS"
    return
  fi
  
  echo "[*] Building iOS app..."
  
  if [ -d "$BUILD_DIR/capacitor" ]; then
    cd "$BUILD_DIR/capacitor"
    npx cap build ios
    echo "  ✓ Capacitor iOS app built"
  fi
  
  if [ -d "$BUILD_DIR/cordova" ]; then
    cd "$BUILD_DIR/cordova"
    cordova build ios --release
    echo "  ✓ Cordova iOS app built"
  fi
}

# Main deployment flow
case "${1:-all}" in
  android)
    build_android_apk
    ;;
  ios)
    build_ios_app
    ;;
  all)
    build_android_apk
    build_ios_app
    ;;
  *)
    echo "Usage: $0 [android|ios|all]"
    exit 1
    ;;
esac

echo "=== Deploy Complete ==="
echo "APK files located in:"
echo "  Capacitor: $BUILD_DIR/capacitor/android/app/build/outputs/apk/"
echo "  Cordova:   $BUILD_DIR/cordova/platforms/android/app/build/outputs/apk/"
if [[ "$OSTYPE" == "darwin"* ]]; then
echo "iOS builds located in respective ios/ directories"
fi