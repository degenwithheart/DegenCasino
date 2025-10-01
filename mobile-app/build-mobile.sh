#!/bin/bash
# build-mobile.sh
# Build DegenCasino for mobile platforms

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BUILD_DIR="$SCRIPT_DIR/build"
DIST_DIR="$PROJECT_ROOT/dist"

echo "=== DegenCasino Mobile Build ==="

# Check if main web build exists
if [ ! -d "$DIST_DIR" ]; then
  echo "Building main web app first..."
  cd "$PROJECT_ROOT"
  npm run build
fi

# Clean up previous builds and Gradle caches
echo "Cleaning up previous builds and Gradle caches..."
rm -rf "$BUILD_DIR/capacitor/*"
rm -rf ~/.gradle/caches/*
rm -rf ~/.gradle/wrapper/*

# Initialize new Capacitor project
echo "Initializing Capacitor project..."
cd "$BUILD_DIR/capacitor"
npm init -y
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/browser

# Initialize Capacitor project
npx cap init DegenCasino com.degenheart.casino --web-dir=www

# Copy web build
echo "Copying web build..."
mkdir -p www
cp -r "$DIST_DIR"/* www/

# Handle Android platform
echo "Setting up Android platform..."
if [ -d "android" ]; then
  echo "Removing existing Android platform..."
  rm -rf android
fi

echo "Adding Android platform..."
npx cap add android

echo "Syncing Capacitor..."
npx cap sync android

# Copy web build to mobile projects
echo "[*] Copying web build to mobile projects..."

# Capacitor
if [ -d "$BUILD_DIR/capacitor" ]; then
  echo "  → Capacitor"
  rm -rf "$BUILD_DIR/capacitor/www"
  cp -r "$DIST_DIR" "$BUILD_DIR/capacitor/www"
  cd "$BUILD_DIR/capacitor"
  
  # Install/update Capacitor v7 and Browser plugin
  echo "    Installing Capacitor v7 and Browser plugin..."
  npm install @capacitor/core@^7.0.0 @capacitor/cli@^7.0.0 @capacitor/android@^7.0.0 @capacitor/ios@^7.0.0 @capacitor/browser@^7.0.0
  
  # Sync with platforms
  npx cap sync
  echo "    ✓ Capacitor v7 synced with Browser plugin"
fi

# Cordova
if [ -d "$BUILD_DIR/cordova" ]; then
  echo "  → Cordova"
  rm -rf "$BUILD_DIR/cordova/www"
  cp -r "$DIST_DIR" "$BUILD_DIR/cordova/www"
  cd "$BUILD_DIR/cordova"
  
  # Install required plugins for fullscreen native WebView
  echo "    Installing Cordova plugins..."
  cordova plugin add cordova-plugin-inappbrowser@^6.0.0 --save || echo "    Plugin already installed or failed to install"
  cordova plugin add cordova-plugin-whitelist@^1.3.5 --save || echo "    Plugin already installed or failed to install"
  
  echo "    ✓ Cordova synced with plugins"
fi

echo "=== Mobile Build Complete ==="
echo "Available commands:"
echo "  Android (Capacitor): cd $BUILD_DIR/capacitor && npx cap run android"
echo "  Android (Cordova):   cd $BUILD_DIR/cordova && cordova run android"
if [[ "$OSTYPE" == "darwin"* ]]; then
echo "  iOS (Capacitor):     cd $BUILD_DIR/capacitor && npx cap run ios"
echo "  iOS (Cordova):       cd $BUILD_DIR/cordova && cordova run ios"
fi