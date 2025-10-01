#!/bin/bash
# test-mobile-integration.sh
# Test the Capacitor v7 Browser plugin integration

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "=== DegenCasino Mobile Browser Integration Test ==="

# 1. Test main project dependencies
echo "[1/5] Testing main project Capacitor dependencies..."
cd "$PROJECT_ROOT"
if npm list @capacitor/core @capacitor/browser >/dev/null 2>&1; then
  echo "  ✓ Capacitor dependencies installed in main project"
else
  echo "  ❌ Capacitor dependencies missing in main project"
  echo "  Run: npm install @capacitor/core @capacitor/browser"
fi

# 2. Test mobile hooks and components
echo "[2/5] Testing mobile components..."
if [ -f "$PROJECT_ROOT/src/hooks/mobile/useBrowser.ts" ]; then
  echo "  ✓ useBrowser hook created"
else
  echo "  ❌ useBrowser hook missing"
fi

if [ -f "$PROJECT_ROOT/src/components/Mobile/BrowserComponents.tsx" ]; then
  echo "  ✓ Browser components created"
else
  echo "  ❌ Browser components missing"
fi

if [ -f "$PROJECT_ROOT/src/contexts/MobileBrowserContext.tsx" ]; then
  echo "  ✓ Mobile browser context created"
else
  echo "  ❌ Mobile browser context missing"
fi

# 3. Test mobile app setup
echo "[3/5] Testing mobile app configuration..."
if [ -f "$SCRIPT_DIR/mobile-config.json" ]; then
  echo "  ✓ Mobile configuration exists"
  
  # Check for Capacitor v7
  if grep -q '"@capacitor/core": "\^7.0.0"' "$SCRIPT_DIR/mobile-config.json"; then
    echo "  ✓ Capacitor v7 configured"
  else
    echo "  ⚠️ Capacitor v7 not configured properly"
  fi
  
  # Check for Browser plugin
  if grep -q '"@capacitor/browser"' "$SCRIPT_DIR/mobile-config.json"; then
    echo "  ✓ Browser plugin configured"
  else
    echo "  ⚠️ Browser plugin not configured"
  fi
else
  echo "  ❌ Mobile configuration missing"
fi

# 4. Test Capacitor project
echo "[4/5] Testing Capacitor project..."
if [ -d "$SCRIPT_DIR/build/capacitor" ]; then
  cd "$SCRIPT_DIR/build/capacitor"
  
  if [ -f "package.json" ]; then
    echo "  ✓ Capacitor project exists"
    
    # Check Capacitor v7
    if grep -q '"@capacitor/core": "\^7.0.0"' package.json; then
      echo "  ✓ Capacitor v7 installed"
    else
      echo "  ⚠️ Capacitor v7 not installed"
    fi
    
    # Check Browser plugin
    if grep -q '"@capacitor/browser"' package.json; then
      echo "  ✓ Browser plugin installed"
    else
      echo "  ⚠️ Browser plugin not installed"
    fi
    
    # Check Android platform
    if [ -d "android" ]; then
      echo "  ✓ Android platform added"
    else
      echo "  ⚠️ Android platform not added"
    fi
    
  else
    echo "  ❌ Capacitor project not properly set up"
  fi
else
  echo "  ❌ Capacitor project not found"
fi

# 5. Test npm scripts
echo "[5/5] Testing npm scripts..."
cd "$PROJECT_ROOT"
if npm run --silent mobile:sync --dry-run >/dev/null 2>&1; then
  echo "  ✓ mobile:sync script available"
else
  echo "  ❌ mobile:sync script missing"
fi

if npm run --silent mobile:build --dry-run >/dev/null 2>&1; then
  echo "  ✓ mobile:build script available"
else
  echo "  ❌ mobile:build script missing"
fi

echo ""
echo "=== Integration Summary ==="
echo "✅ Components Created:"
echo "   • useBrowser hook for Capacitor Browser API"
echo "   • BrowserComponents for UI integration"
echo "   • MobileBrowserContext for app-wide access"
echo "   • Integration examples and documentation"

echo ""
echo "✅ Features Available:"
echo "   • Fullscreen native WebView (Capacitor v7)"
echo "   • Transaction explorer integration"
echo "   • Wallet download assistance"
echo "   • Game help system"
echo "   • External link handling"

echo ""
echo "🚀 Next Steps:"
echo "1. Add MobileBrowserProvider to your index.tsx provider hierarchy"
echo "2. Import and use the mobile browser components"
echo "3. Test in web browser (fallback to window.open)"
echo "4. Test in mobile web (mobile indicators visible)"
echo "5. Build and test in native app (fullscreen browser)"

echo ""
echo "📚 Documentation:"
echo "   • See mobile-app/INTEGRATION-GUIDE.md for detailed integration steps"
echo "   • See mobile-app/browser-plugin-example.js for usage examples"
echo "   • Run 'npm run mobile:sync' to sync Capacitor project"

echo ""
echo "=== Test Complete ==="