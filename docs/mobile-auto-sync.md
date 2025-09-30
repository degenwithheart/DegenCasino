# Mobile App Auto-Sync Documentation

## Overview
The build system now automatically syncs the mobile app after each successful build. This ensures that the mobile app always has the latest version of the web app.

## How It Works

### 1. Enhanced Build Scripts
The following npm scripts now automatically sync the mobile app:
- `npm run build` - Builds the web app and syncs to mobile
- `npm run build:compress` - Builds with compression and syncs to mobile  
- `npm run build:analyze` - Builds with bundle analysis and syncs to mobile

### 2. Mobile Sync Process
When a build completes, the system automatically:
1. **Copies** the latest `dist` folder to the mobile app's `www` directory
2. **Syncs** Capacitor v7 dependencies and plugins
3. **Updates** Android platform files and assets
4. **Prepares** the mobile app for testing/deployment

### 3. Error Handling
- Uses `mobile:sync:safe` which won't fail the build if mobile sync has issues
- Provides clear error messages if mobile setup is missing
- Falls back gracefully if mobile project is not configured

## Mobile Sync Script Enhanced Features

The `mobile-app/sync-mobile.sh` script now includes:
- ✅ **Web Build Copy** - Automatically copies latest `dist` to mobile app
- ✅ **Dependency Sync** - Updates Capacitor v7 and plugins
- ✅ **Platform Sync** - Syncs Android and web platforms
- ✅ **Asset Updates** - Updates Android app assets and configuration

## Usage

### Automatic (Recommended)
Just run your normal build commands - mobile sync happens automatically:
```bash
npm run build           # Build + sync mobile
npm run build:compress  # Build + compress + sync mobile
npm run build:analyze   # Build + analyze + sync mobile
```

### Manual Sync
If you need to sync without building:
```bash
npm run mobile:sync       # Sync with error handling
npm run mobile:sync:safe  # Sync that won't fail (used by build scripts)
```

### Mobile Development Workflow
```bash
# 1. Setup mobile app (one-time)
npm run mobile:setup

# 2. Build and sync (every time you want to test)
npm run build

# 3. Test on Android
cd mobile-app/build/capacitor
npx cap run android

# 4. Build APK for distribution
cd mobile-app/build/capacitor
npx cap build android
```

## File Structure
```
DegenCasino/
├── dist/                    # Web app build output
├── mobile-app/
│   ├── sync-mobile.sh      # Enhanced sync script
│   ├── build/
│   │   └── capacitor/
│   │       └── www/        # Mobile app web assets (copied from dist/)
│   └── ...
└── package.json            # Updated build scripts
```

## Benefits
- 🚀 **Streamlined Workflow** - No need to manually sync mobile app
- ⚡ **Always Up-to-Date** - Mobile app automatically gets latest changes
- 🛡️ **Robust Error Handling** - Build won't fail if mobile sync has issues
- 📱 **Ready for Testing** - Mobile app is immediately ready after build
- 🔄 **Consistent State** - Web and mobile versions are always in sync

## Troubleshooting

### Mobile Sync Failed
If you see "⚠️ Mobile sync failed", check:
1. Is the mobile app setup? Run `npm run mobile:setup`
2. Is the Capacitor project initialized? Check `mobile-app/build/capacitor/`
3. Are dependencies installed? Check `mobile-app/build/capacitor/package.json`

### No Web Build Found
If sync complains about missing `dist` folder:
1. Run `npm run build` first to create the web build
2. Make sure the build completed successfully
3. Check that `dist/` folder exists in project root

### Android Sync Issues
If Capacitor sync fails:
1. Make sure Android SDK is installed
2. Check that `capacitor.config.json` is valid
3. Try running `npx cap doctor` in the Capacitor project

## Configuration
The sync behavior can be customized by modifying:
- `mobile-app/sync-mobile.sh` - Sync script logic
- `package.json` - Build script configuration
- `mobile-app/build/capacitor/capacitor.config.json` - Capacitor settings