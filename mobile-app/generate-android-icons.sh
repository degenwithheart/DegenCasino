#!/bin/bash
# generate-android-icons.sh
# Generate Android icons from logo.png and replace Capacitor defaults

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
LOGO_SRC="$PROJECT_ROOT/public/png/images/logo.png"
CAPACITOR_DIR="$SCRIPT_DIR/build/capacitor"
ANDROID_RES="$CAPACITOR_DIR/android/app/src/main/res"

echo "=== Android Icon Generator ==="
echo "Logo source: $LOGO_SRC"
echo "Android resources: $ANDROID_RES"

# Verify logo exists
if [ ! -f "$LOGO_SRC" ]; then
  echo "❌ Logo not found: $LOGO_SRC"
  exit 1
fi

# Verify Android project exists
if [ ! -d "$ANDROID_RES" ]; then
  echo "❌ Android project not found: $ANDROID_RES"
  echo "   Run the mobile build first: ./build-mobile.sh"
  exit 1
fi

# Create mipmap directories if they don't exist
mkdir -p "$ANDROID_RES"/{mipmap-mdpi,mipmap-hdpi,mipmap-xhdpi,mipmap-xxhdpi,mipmap-xxxhdpi}

echo "📱 Generating Android launcher icons..."

# Generate different density icons
echo "  → mdpi (48x48)"
sips -z 48 48 "$LOGO_SRC" --out "$ANDROID_RES/mipmap-mdpi/ic_launcher.png" >/dev/null 2>&1
cp "$ANDROID_RES/mipmap-mdpi/ic_launcher.png" "$ANDROID_RES/mipmap-mdpi/ic_launcher_round.png"

echo "  → hdpi (72x72)"
sips -z 72 72 "$LOGO_SRC" --out "$ANDROID_RES/mipmap-hdpi/ic_launcher.png" >/dev/null 2>&1
cp "$ANDROID_RES/mipmap-hdpi/ic_launcher.png" "$ANDROID_RES/mipmap-hdpi/ic_launcher_round.png"

echo "  → xhdpi (96x96)"
sips -z 96 96 "$LOGO_SRC" --out "$ANDROID_RES/mipmap-xhdpi/ic_launcher.png" >/dev/null 2>&1
cp "$ANDROID_RES/mipmap-xhdpi/ic_launcher.png" "$ANDROID_RES/mipmap-xhdpi/ic_launcher_round.png"

echo "  → xxhdpi (144x144)"
sips -z 144 144 "$LOGO_SRC" --out "$ANDROID_RES/mipmap-xxhdpi/ic_launcher.png" >/dev/null 2>&1
cp "$ANDROID_RES/mipmap-xxhdpi/ic_launcher.png" "$ANDROID_RES/mipmap-xxhdpi/ic_launcher_round.png"

echo "  → xxxhdpi (192x192)"
sips -z 192 192 "$LOGO_SRC" --out "$ANDROID_RES/mipmap-xxxhdpi/ic_launcher.png" >/dev/null 2>&1
cp "$ANDROID_RES/mipmap-xxxhdpi/ic_launcher.png" "$ANDROID_RES/mipmap-xxxhdpi/ic_launcher_round.png"

echo "🎨 Generating foreground icons..."

# Generate foreground icons (same as main icons for now)
echo "  → Copying to foreground variants"
cp "$ANDROID_RES/mipmap-mdpi/ic_launcher.png" "$ANDROID_RES/mipmap-mdpi/ic_launcher_foreground.png"
cp "$ANDROID_RES/mipmap-hdpi/ic_launcher.png" "$ANDROID_RES/mipmap-hdpi/ic_launcher_foreground.png"
cp "$ANDROID_RES/mipmap-xhdpi/ic_launcher.png" "$ANDROID_RES/mipmap-xhdpi/ic_launcher_foreground.png"
cp "$ANDROID_RES/mipmap-xxhdpi/ic_launcher.png" "$ANDROID_RES/mipmap-xxhdpi/ic_launcher_foreground.png"
cp "$ANDROID_RES/mipmap-xxxhdpi/ic_launcher.png" "$ANDROID_RES/mipmap-xxxhdpi/ic_launcher_foreground.png"

echo "✅ Android icons generated successfully!"
echo ""
echo "Generated icons:"
find "$ANDROID_RES" -name "ic_launcher*.png" | sort

echo ""
echo "📝 Next steps:"
echo "1. Rebuild the APK: cd $CAPACITOR_DIR && npx cap build android"
echo "2. Copy APK to public directory: ../copy-apk-if-exists.sh"