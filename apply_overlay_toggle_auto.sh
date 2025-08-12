#!/bin/bash

# Simple wrapper script to run the Node.js overlay updater and test the build

echo "🚀 Starting automated overlay toggle application..."

# Make sure we're in the right directory
cd "$(dirname "$0")"

# Run the Node.js script
echo "📝 Running overlay update script..."
node apply_overlay_toggle.js

# Test the build
echo ""
echo "🧪 Testing the build..."
if npm run build; then
    echo ""
    echo "✅ SUCCESS! All games have been updated with overlay toggle system!"
    echo "🎯 You can now control all thinking overlays with ENABLE_THINKING_OVERLAY in src/constants.ts"
else
    echo ""
    echo "❌ BUILD FAILED! Some manual fixes may be needed."
    echo "📋 Check the build output above for specific errors."
    echo "💡 You can manually fix remaining games using OVERLAY_TOGGLE_GUIDE.md"
fi

echo ""
echo "🎮 Summary:"
echo "   • Toggle all overlays: Change ENABLE_THINKING_OVERLAY in src/constants.ts" 
echo "   • Documentation: See OVERLAY_TOGGLE_GUIDE.md"
echo "   • Backup files: Created automatically (cleaned up on success)"
