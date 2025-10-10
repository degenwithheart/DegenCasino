#!/bin/bash
# build-and-deploy-apk.sh
# Build the APK and deploy it to the public/mobile directory

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BUILD_DIR="$SCRIPT_DIR/build"
DIST_DIR="$PROJECT_ROOT/dist"
MOBILE_PUBLIC_DIR="$PROJECT_ROOT/public/mobile"

echo "=== DegenCasino APK Build & Deploy ==="
echo "Project Root: $PROJECT_ROOT"
echo "Build Dir: $BUILD_DIR"
echo "Mobile Public Dir: $MOBILE_PUBLIC_DIR"

# Ensure mobile public directory exists
mkdir -p "$MOBILE_PUBLIC_DIR"

# Step 1: Build main web app if not exists
if [ ! -d "$DIST_DIR" ]; then
  echo "[1/5] Building main web app..."
  cd "$PROJECT_ROOT"
  npm run build
else
  echo "[1/5] Web build exists, skipping..."
fi

# Step 2: Run mobile setup if Capacitor build doesn't exist
if [ ! -d "$BUILD_DIR/capacitor" ]; then
  echo "[2/5] Running mobile setup..."
  cd "$SCRIPT_DIR"
  ./setup-mobile-apps.sh
else
  echo "[2/5] Mobile setup exists, skipping..."
fi

# Step 3: Build mobile app (without compressed files)
echo "[3/5] Building mobile app..."
cd "$SCRIPT_DIR"

# Clean and rebuild Capacitor project without compressed files
echo "  → Cleaning previous Capacitor build..."
rm -rf "$BUILD_DIR/capacitor"

echo "  → Setting up clean Capacitor project..."
mkdir -p "$BUILD_DIR/capacitor"
cd "$BUILD_DIR/capacitor"

# Initialize Capacitor
npm init -y
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/browser
npx cap init DegenCasino com.degenheart.casino --web-dir=www

# Copy web build WITHOUT compressed files (.gz, .br)
echo "  → Copying web build (excluding compressed files)..."
mkdir -p www
rsync -av --exclude="*.gz" --exclude="*.br" "$DIST_DIR/" www/

# Add Android platform
echo "  → Adding Android platform..."
npx cap add android
npx cap sync android

# Add mobile-specific viewport fixes
echo "  → Adding mobile viewport fixes..."
if [ -f "$SCRIPT_DIR/mobile-viewport-fixes.css" ]; then
  cp "$SCRIPT_DIR/mobile-viewport-fixes.css" www/
  echo "    ✓ Mobile viewport CSS copied to www/"
else
  echo "    ⚠️  Mobile viewport CSS not found, skipping"
fi

# Step 4: Generate Android icons from logo
echo "[4/6] Generating Android icons from logo..."
cd "$SCRIPT_DIR"
./generate-android-icons.sh

# Step 5: Build Android APK using Capacitor
echo "[5/6] Building Android APK..."
cd "$BUILD_DIR/capacitor"

# Ensure Android SDK and tools are available
if ! command -v gradle &> /dev/null; then
  echo "⚠️  Gradle not found. Installing via npm..."
  npm install -g @gradle/gradle-enterprise-gradle-plugin
fi

# Build the signed release APK
echo "Building signed release APK with Capacitor..."
npx cap build android --prod --release

# Find the built APK (prefer release over debug)
APK_PATH=""
if [ -f "android/app/build/outputs/apk/release/app-release.apk" ]; then
  APK_PATH="android/app/build/outputs/apk/release/app-release.apk"
  echo "✅ Found signed release APK"
elif [ -f "android/app/build/outputs/apk/debug/app-debug.apk" ]; then
  APK_PATH="android/app/build/outputs/apk/debug/app-debug.apk"
  echo "⚠️  Using debug APK (release build failed)"
else
  echo "❌ APK not found! Trying manual Gradle build..."
  cd android
  echo "  → Attempting release build with signing..."
  ./gradlew assembleRelease || {
    echo "  → Release build failed, trying debug..."
    ./gradlew assembleDebug
  }
  cd ..
  
  # Check again
  if [ -f "android/app/build/outputs/apk/release/app-release.apk" ]; then
    APK_PATH="android/app/build/outputs/apk/release/app-release.apk"
    echo "✅ Manual release build successful"
  elif [ -f "android/app/build/outputs/apk/debug/app-debug.apk" ]; then
    APK_PATH="android/app/build/outputs/apk/debug/app-debug.apk"
    echo "⚠️  Using debug APK"
  fi
fi

if [ -z "$APK_PATH" ]; then
  echo "❌ Failed to build APK!"
  echo "Available files in android/app/build/outputs/apk/:"
  find android/app/build/outputs/apk/ -name "*.apk" 2>/dev/null || echo "No APK files found"
  exit 1
fi

# Step 6: Copy APK to public directory
echo "[6/6] Deploying APK..."
cp "$APK_PATH" "$MOBILE_PUBLIC_DIR/degencasino-latest.apk"

# Get APK info
APK_SIZE=$(ls -lh "$MOBILE_PUBLIC_DIR/degencasino-latest.apk" | awk '{print $5}')
APK_DATE=$(date)

echo ""
echo "✅ SUCCESS! APK built and deployed"
echo "📱 APK Location: $MOBILE_PUBLIC_DIR/degencasino-latest.apk"
echo "📊 APK Size: $APK_SIZE"
echo "🕒 Build Time: $APK_DATE"
echo ""
echo "🌐 APK will be served at: https://degenheart.casino/mobile/degencasino-latest.apk"
echo ""
echo "Next steps:"
echo "1. Commit and push the APK to your repository"
echo "2. Deploy to production (Vercel will serve the APK from public/mobile/)"
echo "3. Test the download link on the mobile app page"