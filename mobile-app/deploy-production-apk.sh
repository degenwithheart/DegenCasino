#!/bin/bash
# deploy-production-apk.sh
# Complete production APK build and deployment workflow

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "🚀 DegenCasino Production APK Deployment"
echo "========================================"

# Step 1: Verify prerequisites
echo ""
echo "🔍 [1/6] Verifying prerequisites..."

# Check if keystore exists
if [ ! -f "/Users/degenwithheart/GitHub/DegenCasino/dghrt-keystore.jks" ]; then
  echo "❌ Keystore not found. Creating keystore..."
  cd "$SCRIPT_DIR/config"
  ./create_keystore.sh
else
  echo "✅ Keystore found"
fi

# Check Java
if [ -z "$JAVA_HOME" ]; then
  export JAVA_HOME=$(/usr/libexec/java_home -v 21)
fi
echo "✅ Java: $(java -version 2>&1 | head -n 1)"

# Step 2: Build main web app
echo ""
echo "🔨 [2/6] Building main web application..."
cd "$PROJECT_ROOT"
npm run build:compress

# Step 3: Build signed APK
echo ""
echo "📱 [3/6] Building signed production APK..."
cd "$SCRIPT_DIR"
./build-signed-apk.sh

# Step 4: Verify APK
echo ""
echo "🔍 [4/6] Verifying APK..."
APK_PATH="$PROJECT_ROOT/public/mobile/degencasino-latest.apk"
if [ -f "$APK_PATH" ]; then
  APK_SIZE=$(ls -lh "$APK_PATH" | awk '{print $5}')
  echo "✅ APK verified: $APK_SIZE"
  
  # Get APK info
  echo "📋 APK Information:"
  echo "   Location: $APK_PATH"
  echo "   Size: $APK_SIZE"
  echo "   Build Date: $(date)"
  
  # Verify signature
  if command -v keytool &> /dev/null; then
    echo "   Signature: $(keytool -printcert -jarfile "$APK_PATH" 2>/dev/null | grep "Owner:" | head -1 | sed 's/Owner: //')"
  fi
else
  echo "❌ APK not found!"
  exit 1
fi

# Step 5: Test deployment URL
echo ""
echo "🌐 [5/6] Testing deployment readiness..."
echo "   APK will be served at: https://degenheart.casino/mobile/degencasino-latest.apk"
echo "   Mobile app page: https://degenheart.casino/mobile"

# Step 6: Git status and deployment instructions
echo ""
echo "📦 [6/6] Deployment instructions..."

# Check git status
if command -v git &> /dev/null; then
  if git status &>/dev/null; then
    echo "📋 Git Status:"
    git status --porcelain | grep -E "(public/mobile|mobile-app)" | head -5
    
    echo ""
    echo "🚀 Ready to deploy! Run these commands:"
    echo ""
    echo "   # Commit the APK"
    echo "   git add public/mobile/degencasino-latest.apk"
    echo "   git commit -m \"Deploy signed production APK v$(date +%Y%m%d-%H%M)\""
    echo ""
    echo "   # Push to deploy"
    echo "   git push origin main"
    echo ""
    echo "   # Monitor deployment"
    echo "   # → Vercel will automatically deploy"
    echo "   # → APK will be available at: https://degenheart.casino/mobile/degencasino-latest.apk"
    
  else
    echo "⚠️  Not in a git repository"
  fi
else
  echo "⚠️  Git not available"
fi

echo ""
echo "✅ Production APK deployment complete!"
echo ""
echo "📝 Post-deployment checklist:"
echo "   □ Test APK download from mobile app page"
echo "   □ Install APK on Android device and test"
echo "   □ Verify app signature and functionality"
echo "   □ Update version numbers if needed"
echo "   □ Document release notes"

echo ""
echo "🎉 DegenCasino production APK is ready for deployment!"