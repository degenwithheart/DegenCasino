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
      mkdir -p "$BUILD_DIR/capacitor/www/js"
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
    npm install @capacitor/core@^7.0.0 @capacitor/cli@^7.0.0 @capacitor/android@^7.0.0 >/dev/null 2>&1
  fi
  
  # Install Browser plugin
  if ! grep -q '"@capacitor/browser"' package.json; then
    echo "  → Installing Browser plugin..."
    npm install @capacitor/browser@^7.0.0 >/dev/null 2>&1
  fi
  
  # Sync platforms
  echo "  → Syncing platforms..."
  npx cap sync >/dev/null 2>&1
  
  echo "  ✓ Capacitor v7 sync complete"
else
  echo "  ⚠️ Capacitor project not found. Run setup-mobile-apps.sh first."
fi

echo "=== Mobile Sync Complete ==="