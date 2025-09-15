#!/bin/bash

# Security fixes for DegenCasino npm audit issues
echo "🔒 Starting security fixes for DegenCasino..."

# Create backup of package.json
cp package.json package.json.backup
echo "✅ Created backup of package.json"

# Fix 1: Update @vercel/node to fix undici and path-to-regexp issues
echo "🔧 Updating @vercel/node..."
npm install @vercel/node@latest

# Fix 2: Update development dependencies that don't break functionality
echo "🔧 Updating development dependencies..."
npm install --save-dev @vitejs/plugin-react@latest
npm install --save-dev @types/node@^20.0.0
npm install --save-dev @types/react@^18.0.0
npm install --save-dev @types/react-dom@^18.0.0

# Fix 3: Remove and reinstall vite-plugin-imagemin with updated dependencies
echo "🔧 Fixing imagemin vulnerabilities..."
npm uninstall vite-plugin-imagemin
npm install --save-dev vite-plugin-imagemin@latest

# Fix 4: Manual overrides for problem packages
echo "🔧 Adding npm overrides for security fixes..."

# Create temporary package.json with overrides
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Add overrides for security fixes
pkg.overrides = {
  'trim-newlines': '^3.0.1',
  'semver-regex': '^4.0.0',
  'http-cache-semantics': '^4.1.1',
  'cross-spawn': '^7.0.0',
  'got': '^12.0.0',
  'undici': '^6.0.0',
  'path-to-regexp': '^6.3.0'
};

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
console.log('✅ Added security overrides to package.json');
"

# Reinstall to apply overrides
echo "🔧 Reinstalling with security overrides..."
rm -rf node_modules package-lock.json
npm install

echo "🔒 Security fixes completed! Running audit check..."
npm audit

echo "🎯 If there are still issues with Gamba dependencies, they are likely from the blockchain library chain and may require library updates from Gamba Labs."
