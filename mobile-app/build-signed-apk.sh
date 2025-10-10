#!/bin/bash
# build-signed-apk.sh
# Build a signed release APK for production

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BUILD_DIR="$SCRIPT_DIR/build"
CAPACITOR_DIR="$BUILD_DIR/capacitor"
KEYSTORE_PATH="/Users/degenwithheart/GitHub/DegenCasino/dghrt-keystore.jks"

echo "=== DegenCasino Signed APK Builder ==="

# Verify keystore exists
if [ ! -f "$KEYSTORE_PATH" ]; then
  echo "❌ Keystore not found: $KEYSTORE_PATH"
  echo "   Run: ./config/create_keystore.sh"
  exit 1
fi

# Verify Capacitor project exists
if [ ! -d "$CAPACITOR_DIR" ]; then
  echo "❌ Capacitor project not found. Run build-and-deploy-apk.sh first"
  exit 1
fi

# Verify Java environment
if [ -z "$JAVA_HOME" ]; then
  export JAVA_HOME=$(/usr/libexec/java_home -v 21)
  echo "🔧 Set JAVA_HOME to: $JAVA_HOME"
fi

echo "📋 Build Configuration:"
echo "  → Capacitor Project: $CAPACITOR_DIR"
echo "  → Keystore: $KEYSTORE_PATH"
echo "  → Java Version: $(java -version 2>&1 | head -n 1)"

cd "$CAPACITOR_DIR"

echo ""
echo "🔨 Building signed release APK..."

# Sync Capacitor first
echo "  → Syncing Capacitor..."
npx cap sync android

# Build release APK using Gradle directly for better control
echo "  → Building with Gradle..."
cd android

# Clean previous builds
./gradlew clean

# Build signed release APK
./gradlew assembleRelease

cd ..

# Check if build was successful
RELEASE_APK="android/app/build/outputs/apk/release/app-release.apk"
if [ -f "$RELEASE_APK" ]; then
  APK_SIZE=$(ls -lh "$RELEASE_APK" | awk '{print $5}')
  echo ""
  echo "✅ Signed release APK built successfully!"
  echo "📱 Location: $CAPACITOR_DIR/$RELEASE_APK"
  echo "📊 Size: $APK_SIZE"
  
  # Verify APK is signed
  echo ""
  echo "🔍 Verifying APK signature..."
  if command -v apksigner &> /dev/null; then
    apksigner verify --print-certs "$RELEASE_APK"
  elif command -v jarsigner &> /dev/null; then
    jarsigner -verify -verbose -certs "$RELEASE_APK"
  else
    echo "⚠️  APK signature verification tools not found"
    echo "   APK should be signed based on successful Gradle build"
  fi
  
  # Copy to public directory
  echo ""
  echo "📦 Deploying to public directory..."
  cp "$RELEASE_APK" "$PROJECT_ROOT/public/mobile/degencasino-latest.apk"
  
  FINAL_SIZE=$(ls -lh "$PROJECT_ROOT/public/mobile/degencasino-latest.apk" | awk '{print $5}')
  echo "✅ Deployed: $PROJECT_ROOT/public/mobile/degencasino-latest.apk ($FINAL_SIZE)"
  
else
  echo "❌ Release APK build failed!"
  echo "Checking for build errors..."
  find android/app/build -name "*.log" -exec echo "=== {} ===" \; -exec cat {} \; 2>/dev/null || true
  exit 1
fi

echo ""
echo "🎉 Production APK ready!"
echo "📝 Next steps:"
echo "1. Test the APK on a device"
echo "2. Commit: git add public/mobile/ && git commit -m 'Update signed production APK'"
echo "3. Deploy to production"