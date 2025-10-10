#!/bin/bash
# generate-icons.sh
# Generate Android + PWA icons from png/images/logo.png

SRC="/Users/degenwithheart/GitHub/DegenCasino/public/png/images/logo.png"
OUT_ANDROID="/Users/degenwithheart/GitHub/DegenCasino/mobile-app/build/android-studio/app/src/main/res"
OUT_PWA_CAP="/www"

if [ ! -f "$SRC" ]; then
  echo "Logo not found: $SRC"
  exit 1
fi

echo "Generating Android mipmap icons..."
sips -z 48 48   "$SRC" --out "$OUT_ANDROID/mipmap-mdpi/ic_launcher.png"
sips -z 72 72   "$SRC" --out "$OUT_ANDROID/mipmap-hdpi/ic_launcher.png"
sips -z 96 96   "$SRC" --out "$OUT_ANDROID/mipmap-xhdpi/ic_launcher.png"
sips -z 144 144 "$SRC" --out "$OUT_ANDROID/mipmap-xxhdpi/ic_launcher.png"
sips -z 192 192 "$SRC" --out "$OUT_ANDROID/mipmap-xxxhdpi/ic_launcher.png"

echo "Generating PWA icons..."
sips -z 192 192 "$SRC" --out "$OUT_PWA_CAP/icon-192.png"
sips -z 512 512 "$SRC" --out "$OUT_PWA_CAP/icon-512.png"
# Icons copied to Capacitor www directory

echo "✅ Icons generated"
