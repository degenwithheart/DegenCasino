#!/bin/bash
# sync-mobile.sh
# Sync Capacitor v7 project with latest dependencies and plugins (Android only)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BUILD_DIR="$SCRIPT_DIR/build"
DIST_DIR="$PROJECT_ROOT/dist"

echo "=== DegenCasino Mobile Sync ==="

# Check if main web build exists and copy it
if [ -d "$DIST_DIR" ]; then
  echo "[*] Copying latest web build to mobile projects..."
  
  # Copy to Capacitor
  if [ -d "$BUILD_DIR/capacitor" ]; then
    echo "  → Copying to Capacitor www folder..."
    rm -rf "$BUILD_DIR/capacitor/www"
    cp -r "$DIST_DIR" "$BUILD_DIR/capacitor/www"
    
    # Copy hot update system
    echo "  → Installing hot update system..."
    if [ -f "$SCRIPT_DIR/hot-updates/mobile-updater.js" ]; then
      cp "$SCRIPT_DIR/hot-updates/mobile-updater.js" "$BUILD_DIR/capacitor/www/js/"
      
      # Inject updater script into index.html
      if [ -f "$BUILD_DIR/capacitor/www/index.html" ]; then
        sed -i '' 's|</head>|<script src="/js/mobile-updater.js"></script></head>|' "$BUILD_DIR/capacitor/www/index.html"
        echo "  ✓ Hot update system installed"
      fi
    fi
    
    echo "  ✓ Web build copied to Capacitor"
  fi
else
  echo "  ⚠️  No web build found at $DIST_DIR"
  echo "  → Run 'npm run build' first to generate web build"
fi

# Capacitor v7 Sync
if [ -d "$BUILD_DIR/capacitor" ]; then
  echo "[*] Syncing Capacitor v7..."
  cd "$BUILD_DIR/capacitor"
  
  # Update package.json if needed
  if ! grep -q '"@capacitor/core": "\^7.0.0"' package.json; then
    echo "  → Updating Capacitor to v7..."
    npm install @capacitor/core@^7.0.0 @capacitor/cli@^7.0.0 @capacitor/android@^7.0.0
  fi
  
  # Install Browser plugin
  if ! grep -q '"@capacitor/browser"' package.json; then
    echo "  → Installing Browser plugin..."
    npm install @capacitor/browser@^7.0.0
  fi
  
  # Sync platforms
  echo "  → Syncing platforms..."
  npx cap sync
  
  echo "  ✓ Capacitor v7 sync complete"
else
  echo "  ⚠️ Capacitor project not found. Run setup-mobile-apps.sh first."
fi

# Capacitor v7 is the primary mobile platform

# Android Studio sync
if [ -d "$BUILD_DIR/android-studio" ]; then
  echo "[*] Android Studio project ready for manual sync"
  echo "  → Open in Android Studio: $BUILD_DIR/android-studio"
fi

echo "=== Mobile Sync Complete ==="
echo ""
echo "Next steps:"
echo "1. Test Android: cd $BUILD_DIR/capacitor && npx cap run android"
echo "2. Build APK: cd $BUILD_DIR/capacitor && npx cap build android"
echo ""
echo "Capacitor v7 Browser plugin features:"
echo "  • Fullscreen native WebView"
echo "  • Custom toolbar colors for different link types"
echo "  • HTTPS scheme enforcement"
echo "  • Native Android experience"