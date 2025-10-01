#!/bin/bash
# setup-mobile-apps.sh
# Creates mobile app builds for DegenCasino with Android Studio and Capacitor (Android only)

# Get script directory for relative paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BASE_DIR="$SCRIPT_DIR/build"
LOGO_SRC="$PROJECT_ROOT/public/png/images/logo.png"

# Fallback logo paths
if [ ! -f "$LOGO_SRC" ]; then
  LOGO_SRC="$PROJECT_ROOT/public/webp/images/logo.webp"
fi
if [ ! -f "$LOGO_SRC" ]; then
  LOGO_SRC="$PROJECT_ROOT/public/png/icons/icon-512.png"
fi

mkdir -p "$BASE_DIR"
echo "=== DegenCasino Mobile App Builder ==="
echo "Project Root: $PROJECT_ROOT"
echo "Build Dir: $BASE_DIR"
echo "Logo Source: $LOGO_SRC"

### 1. ANDROID STUDIO ###
ANDROID_DIR="$BASE_DIR/android-studio"
mkdir -p "$ANDROID_DIR/app/src/main/java/com/degenwithheart/app"
mkdir -p "$ANDROID_DIR/app/src/main/res/mipmap-{mdpi,hdpi,xhdpi,xxhdpi,xxxhdpi}"
mkdir -p "$ANDROID_DIR/app/src/main/res/values"

cat > "$ANDROID_DIR/settings.gradle" <<'EOF'
rootProject.name = "DegenCasinoApp"
include ':app'
EOF

cat > "$ANDROID_DIR/build.gradle" <<'EOF'
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.2.0'
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}
EOF

cat > "$ANDROID_DIR/app/build.gradle" <<'EOF'
apply plugin: 'com.android.application'

android {
    namespace "com.degenwithheart.app"
    compileSdkVersion 34

    defaultConfig {
        applicationId "com.degenwithheart.app"
        minSdkVersion 24
        targetSdkVersion 34
        versionCode 1
        versionName "1.0"
    }

    buildTypes {
        release {
            minifyEnabled false
        }
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.10.0'
}
EOF

cat > "$ANDROID_DIR/app/src/main/AndroidManifest.xml" <<'EOF'
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.degenwithheart.app">
    <application
        android:allowBackup="true"
        android:label="DegenCasinoApp"
        android:icon="@mipmap/ic_launcher"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.AppCompat.Light.NoActionBar">
        <activity android:name=".MainActivity">
            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
        </activity>
    </application>
</manifest>
EOF

cat > "$ANDROID_DIR/app/src/main/java/com/degenwithheart/app/MainActivity.java" <<'EOF'
package com.degenwithheart.app;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }
}
EOF

cat > "$ANDROID_DIR/app/src/main/res/layout/activity_main.xml" <<'EOF'
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical" android:layout_width="match_parent"
    android:layout_height="match_parent" android:gravity="center">

    <TextView
        android:id="@+id/hello_text"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Hello DegenCasino (Android Studio)" />
</LinearLayout>
EOF


### 2. CAPACITOR ###
CAP_DIR="$BASE_DIR/capacitor"
mkdir -p "$CAP_DIR/www"

cat > "$CAP_DIR/package.json" <<'EOF'
{
  "name": "degen-casino-capacitor",
  "version": "1.0.0",
  "scripts": {
    "build": "echo 'Place web build here'",
    "sync": "npx cap sync",
    "install-plugins": "npm install @capacitor/browser && npx cap sync"
  },
  "dependencies": {
    "@capacitor/core": "^7.0.0",
    "@capacitor/browser": "^7.0.0"
  },
  "devDependencies": {
    "@capacitor/cli": "^7.0.0",
    "@capacitor/android": "^7.0.0"
  }
}
EOF

cat > "$CAP_DIR/capacitor.config.json" <<'EOF'
{
  "appId": "com.degenwithheart.capacitor",
  "appName": "DegenCasino",
  "webDir": "www",
  "bundledWebRuntime": false,
  "plugins": {
    "Browser": {
      "androidScheme": "https",
      "presentationStyle": "fullscreen",
      "showTitle": false,
      "toolbarColor": "#000000"
    },
    "App": {
      "launchShowDuration": 0
    }
  },
  "server": {
    "androidScheme": "https"
  }
}
EOF

cat > "$CAP_DIR/www/index.html" <<'EOF'
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title>DegenCasino Capacitor</title>
  </head>
  <body>
    <h1>Hello DegenCasino (Capacitor)</h1>
  </body>
</html>
EOF


### 3. ICON SCRIPT ###
cat > "$BASE_DIR/generate-icons.sh" <<EOF
#!/bin/bash
# generate-icons.sh
# Generate Android + PWA icons from png/images/logo.png

SRC="$LOGO_SRC"
OUT_ANDROID="$ANDROID_DIR/app/src/main/res"
OUT_PWA_CAP="$CAPACITOR_DIR/www"

if [ ! -f "\$SRC" ]; then
  echo "Logo not found: \$SRC"
  exit 1
fi

echo "Generating Android mipmap icons..."
sips -z 48 48   "\$SRC" --out "\$OUT_ANDROID/mipmap-mdpi/ic_launcher.png"
sips -z 72 72   "\$SRC" --out "\$OUT_ANDROID/mipmap-hdpi/ic_launcher.png"
sips -z 96 96   "\$SRC" --out "\$OUT_ANDROID/mipmap-xhdpi/ic_launcher.png"
sips -z 144 144 "\$SRC" --out "\$OUT_ANDROID/mipmap-xxhdpi/ic_launcher.png"
sips -z 192 192 "\$SRC" --out "\$OUT_ANDROID/mipmap-xxxhdpi/ic_launcher.png"

echo "Generating PWA icons..."
sips -z 192 192 "\$SRC" --out "\$OUT_PWA_CAP/icon-192.png"
sips -z 512 512 "\$SRC" --out "\$OUT_PWA_CAP/icon-512.png"
# Icons copied to Capacitor www directory

echo "✅ Icons generated"
EOF

chmod +x "$BASE_DIR/generate-icons.sh"

echo "✅ Setup complete: Android Studio and Capacitor v7 apps created under $BASE_DIR"
