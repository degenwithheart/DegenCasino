#!/bin/bash

# DegenHeart Casino - PWA & Extension Deployment Script
# This script builds the project and packages both PWA and Chrome Extension

echo "🎰 DegenHeart Casino - Building PWA & Chrome Extension"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the current directory
PROJECT_DIR=$(pwd)
BUILD_DIR="$PROJECT_DIR/dist"
PWA_DIR="$PROJECT_DIR/PWA"
EXTENSION_DIR="$PROJECT_DIR/chrome-extension"
DEPLOYMENT_DIR="$PROJECT_DIR/deployments"

# Create deployment directory
mkdir -p "$DEPLOYMENT_DIR"

echo -e "${BLUE}Step 1: Building the main application...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed! Check the errors above.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Main build completed successfully!${NC}"

echo -e "${BLUE}Step 2: Preparing PWA deployment package...${NC}"

# Create PWA deployment package
PWA_DEPLOYMENT="$DEPLOYMENT_DIR/degenheart-pwa-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$PWA_DEPLOYMENT"

# Copy PWA files
cp -r "$PWA_DIR"/* "$PWA_DEPLOYMENT/"

# Copy built assets (optional - for self-hosted PWA)
if [ -d "$BUILD_DIR" ]; then
    mkdir -p "$PWA_DEPLOYMENT/assets"
    cp -r "$BUILD_DIR"/* "$PWA_DEPLOYMENT/assets/" 2>/dev/null || true
fi

# Update PWA index.html with current timestamp
sed -i.bak "s/Loading DegenHeart Casino.../Loading DegenHeart Casino... ($(date +%Y-%m-%d))/g" "$PWA_DEPLOYMENT/index.html" 2>/dev/null || true

echo -e "${GREEN}✅ PWA package created: $PWA_DEPLOYMENT${NC}"

echo -e "${BLUE}Step 3: Preparing Chrome Extension package...${NC}"

# Create Chrome Extension deployment package  
EXTENSION_DEPLOYMENT="$DEPLOYMENT_DIR/degenheart-extension-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$EXTENSION_DEPLOYMENT"

# Copy extension files
cp -r "$EXTENSION_DIR"/* "$EXTENSION_DEPLOYMENT/"

# Update extension version with current timestamp
CURRENT_VERSION="1.0.$(date +%Y%m%d%H%M)"
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/\"version\": \"1.0.0\"/\"version\": \"$CURRENT_VERSION\"/g" "$EXTENSION_DEPLOYMENT/manifest.json"
else
    # Linux
    sed -i "s/\"version\": \"1.0.0\"/\"version\": \"$CURRENT_VERSION\"/g" "$EXTENSION_DEPLOYMENT/manifest.json"
fi

# Create extension ZIP for Chrome Web Store
cd "$EXTENSION_DEPLOYMENT"
zip -r "../degenheart-chrome-extension-$CURRENT_VERSION.zip" . -x "*.DS_Store" "*.git*"
cd "$PROJECT_DIR"

echo -e "${GREEN}✅ Chrome Extension package created: $EXTENSION_DEPLOYMENT${NC}"
echo -e "${GREEN}✅ Chrome Extension ZIP created: degenheart-chrome-extension-$CURRENT_VERSION.zip${NC}"

echo -e "${BLUE}Step 4: Running mobile sync with hot updates...${NC}"

# Run mobile sync if the script exists
if [ -f "./mobile-app/sync-mobile.sh" ]; then
    ./mobile-app/sync-mobile.sh
    echo -e "${GREEN}✅ Mobile app synced with hot updates enabled${NC}"
else
    echo -e "${YELLOW}⚠️  Mobile sync script not found, skipping...${NC}"
fi

echo -e "${BLUE}Step 5: Creating deployment summary...${NC}"

# Create deployment summary
SUMMARY_FILE="$DEPLOYMENT_DIR/deployment-summary-$(date +%Y%m%d-%H%M%S).txt"
cat > "$SUMMARY_FILE" << EOF
DegenHeart Casino Deployment Summary
Generated: $(date)
====================================

📦 PWA Deployment:
   Location: $PWA_DEPLOYMENT
   Files: manifest.json, service-worker.js, index.html, casino logo icons
   Deploy to: Copy contents to Vercel /public folder
   
🔧 Chrome Extension:
   Location: $EXTENSION_DEPLOYMENT  
   ZIP File: degenheart-chrome-extension-$CURRENT_VERSION.zip
   Version: $CURRENT_VERSION
   Deploy to: Chrome Web Store Developer Console
   
📱 Mobile App:
   Hot Updates: Enabled (if sync script ran successfully)
   Update Check: Users will auto-receive updates
   
🌐 Main Site:
   Build: Completed successfully
   PWA: Install banner added to main app
   Ready for deployment to Vercel
   
🚀 Next Steps:
   1. Deploy main build to Vercel (npm run deploy or git push)
   2. Upload Chrome Extension ZIP to Chrome Web Store
   3. Test PWA installation on mobile/desktop
   4. Monitor hot update system for mobile users
   
📋 Testing Checklist:
   □ PWA "Add to Home Screen" works on mobile
   □ Chrome Extension popup loads correctly  
   □ Chrome Extension "New Window" button works
   □ Mobile app receives hot updates
   □ All icons display properly
   □ Offline functionality works
EOF

echo -e "${GREEN}✅ Deployment summary created: $SUMMARY_FILE${NC}"

echo ""
echo -e "${GREEN}🎉 All packages ready for deployment!${NC}"
echo -e "${BLUE}📁 Check the deployments folder for all files${NC}"
echo -e "${YELLOW}📖 Read the deployment summary for next steps${NC}"
echo ""
echo -e "${BLUE}Quick Deploy Commands:${NC}"
echo -e "  PWA: Copy $PWA_DEPLOYMENT/* to your Vercel /public folder"
echo -e "  Extension: Upload degenheart-chrome-extension-$CURRENT_VERSION.zip to Chrome Web Store"
echo -e "  Mobile: Hot updates already configured (if script ran successfully)"
echo ""