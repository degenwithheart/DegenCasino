#!/bin/bash

# Check Gzip/Brotli Compression on Live Site
echo "🔍 Checking compression on live site..."
echo ""

# Test main HTML
echo "📄 Testing index.html:"
curl -H "Accept-Encoding: gzip, deflate, br" -s -I https://www.degenheart.casino/ | grep -i "content-encoding\|content-length" || echo "❌ No compression detected"
echo ""

# Test JavaScript bundle  
echo "📦 Testing JavaScript bundle:"
curl -H "Accept-Encoding: gzip, deflate, br" -s -I https://www.degenheart.casino/assets/vendor-h1R9pOhp.js | grep -i "content-encoding\|content-length" || echo "❌ No compression detected"
echo ""

# Test CSS
echo "🎨 Testing CSS:"
curl -H "Accept-Encoding: gzip, deflate, br" -s -I https://www.degenheart.casino/assets/vendor-BIph9pi-.css | grep -i "content-encoding\|content-length" || echo "❌ No compression detected"
echo ""

# Test WebP support
echo "🖼️ Testing WebP images:"
echo "Game image (PNG): $(curl -s -o /dev/null -w '%{size_download}' https://www.degenheart.casino/games/slots.png) bytes"
echo "Game image (WebP): $(curl -s -o /dev/null -w '%{size_download}' https://www.degenheart.casino/webp/games/slots.webp) bytes"
echo ""

echo "✅ Compression check complete!"
echo ""
echo "💡 Tips:"
echo "- Look for 'content-encoding: gzip' or 'content-encoding: br' headers"  
echo "- WebP images should be significantly smaller than PNG"
echo "- Use browser dev tools Network tab to verify compression in real-time"
