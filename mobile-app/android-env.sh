#!/bin/bash
# android-env.sh - Sets up Android development environment for DegenCasino

# Java 21 for Android development (compatible with modern Android/Gradle)
export JAVA_HOME=/Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home

# Android SDK location
export ANDROID_HOME=~/Library/Android/sdk
export ANDROID_SDK_ROOT=$ANDROID_HOME

# Add Android tools to PATH
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools:$ANDROID_HOME/emulator

# Verify setup
echo "🎰 DegenCasino Android Environment"
echo "================================="
echo "Java Home: $JAVA_HOME"
echo "Java Version: $(java -version 2>&1 | head -n1)"
echo "Android Home: $ANDROID_HOME" 
echo "ADB Available: $(which adb)"
echo ""
echo "📱 Connected Devices:"
adb devices
echo ""
echo "✅ Environment ready for Android development!"
echo ""
echo "🚀 Commands:"
echo "  Build & Run: npx cap run android"
echo "  Build Only:  npx cap build android" 
echo "  Sync:        npx cap sync android"