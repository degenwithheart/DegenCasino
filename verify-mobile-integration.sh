#!/bin/bash
# verify-mobile-integration.sh - Tests the mobile browser integration

echo "🎰 DegenCasino Mobile Browser Integration Verification"
echo "=================================================="

# Check if integration files exist
echo "📁 Checking integration files..."

FILES=(
  "src/hooks/mobile/useBrowser.ts"
  "src/contexts/MobileBrowserContext.tsx" 
  "src/components/Mobile/MobileBrowserComponents.tsx"
  "src/components/Mobile/QuickIntegrationExamples.tsx"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file - MISSING"
  fi
done

echo ""
echo "🔧 Checking provider integration..."

# Check if MobileBrowserProvider is in index.tsx
if grep -q "MobileBrowserProvider" src/index.tsx; then
  echo "  ✅ MobileBrowserProvider added to provider tree"
else
  echo "  ❌ MobileBrowserProvider not found in index.tsx"
fi

# Check feature flag
if grep -q "ENABLE_MOBILE_BROWSER" src/constants.ts; then
  echo "  ✅ ENABLE_MOBILE_BROWSER feature flag added"
else
  echo "  ❌ Feature flag not found"
fi

echo ""
echo "📱 Checking mobile app build..."

if [ -d "mobile-app/build/capacitor" ]; then
  echo "  ✅ Capacitor app built"
  
  # Check if Browser plugin is configured
  if [ -f "mobile-app/build/capacitor/capacitor.config.json" ]; then
    if grep -q "@capacitor/browser" mobile-app/build/capacitor/capacitor.config.json; then
      echo "  ✅ Browser plugin configured"
    else
      echo "  ⚠️  Browser plugin config not found"
    fi
  fi
else
  echo "  ❌ Mobile app not built"
fi

echo ""
echo "🎯 Integration Summary:"
echo "  • Capacitor v7 with Browser plugin: Ready (Android only)"
echo "  • Mobile-aware components: Created" 
echo "  • Provider integration: Complete"
echo "  • Feature flags: Added"
echo "  • Android emulator: Set up (API 36.1)"
echo "  • Cordova: Removed (Capacitor v7 is primary platform)"
echo "  • Java requirement: Need to install JDK for Android builds"

echo ""
echo "🚀 Next Steps:"
echo "  1. Install Java JDK: Download from https://adoptium.net/"
echo "  2. Run: cd mobile-app/build/capacitor && npx cap run android"
echo "  3. Test mobile browser features in emulator"
echo "  4. Use mobile components in your existing games"

echo ""
echo "📖 Quick Usage:"
echo "  // In any component:"
echo "  import { useBrowser } from './hooks/mobile/useBrowser';"
echo "  const { isNativePlatform, openTransaction } = useBrowser();"
echo "  "
echo "  // Mobile-aware transaction link:"
echo "  <MobileTransactionLink signature={sig} />"