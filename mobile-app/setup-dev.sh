#!/bin/bash
# setup-dev.sh
# Auto-install Android Studio, Capacitor, Cordova, and create test projects

set -e

# Detect OS
if [[ "$OSTYPE" == "darwin"* ]]; then
  OS="Mac"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  OS="Linux"
else
  echo "Unsupported OS: $OSTYPE"
  exit 1
fi

echo "=== DegenHeart Dev Setup ($OS) ==="

# ---------------------------
# Check Java JDK (required for Android)
# ---------------------------
if command -v java >/dev/null 2>&1; then
  echo "[*] Java already installed ($(java -version 2>&1 | head -n 1))"
else
  echo "[!] Installing Java JDK..."
  if [ "$OS" = "Mac" ]; then
    brew install openjdk@17
    echo 'export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"' >> ~/.zshrc
  else
    sudo apt update
    sudo apt install -y openjdk-17-jdk
  fi
fi

# ---------------------------
# Check Node.js
# ---------------------------
if command -v node >/dev/null 2>&1; then
  echo "[*] Node.js already installed (v$(node -v))"
else
  echo "⚠️ Node.js not found. Please install manually from https://nodejs.org/"
  exit 1
fi

# ---------------------------
# Check Android Studio
# ---------------------------
if [ -d "/Applications/Android Studio.app" ]; then
  echo "[*] Android Studio already installed"
else
  echo "[!] Android Studio not found in /Applications."
  echo "Please download it manually from https://developer.android.com/studio and move it to /Applications"
fi

# ---------------------------
# Check iOS Development (Mac only)
# ---------------------------
if [ "$OS" = "Mac" ]; then
  if command -v xcodebuild >/dev/null 2>&1; then
    echo "[*] Xcode already installed"
  else
    echo "[!] Xcode not found. Install from App Store for iOS development."
  fi
  
  if command -v xcrun simctl list >/dev/null 2>&1; then
    echo "[*] iOS Simulator available"
  else
    echo "[!] iOS Simulator not available. Install Xcode Command Line Tools."
  fi
fi

# ---------------------------
# ANDROID STUDIO
#########################################
install_android_studio_mac() {
  if ! command -v android-studio >/dev/null 2>&1; then
    echo "[Mac] Installing Android Studio..."
    brew install --cask android-studio
  else
    echo "[Mac] Android Studio already installed"
  fi
}

install_android_studio_linux() {
  if ! command -v android-studio >/dev/null 2>&1; then
    echo "[Linux] Installing Android Studio..."
    if command -v snap >/dev/null 2>&1; then
      sudo snap install android-studio --classic
    else
      echo "Snap not found, downloading tar.gz..."
      wget https://redirector.gvt1.com/edgedl/android/studio/ide-zips/2024.1.1.21/android-studio-2024.1.1.21-linux.tar.gz -O /tmp/as.tar.gz
      sudo tar -xzf /tmp/as.tar.gz -C /opt
      sudo ln -sf /opt/android-studio/bin/studio.sh /usr/local/bin/android-studio
    fi
  else
    echo "[Linux] Android Studio already installed"
  fi
}

#########################################
# NODE + CAPACITOR + CORDOVA
#########################################
install_node_tools() {
  if command -v node >/dev/null 2>&1 && command -v npm >/dev/null 2>&1; then
    echo "Node.js and npm already installed"
  else
    echo "[*] Installing Node.js and npm..."
    if [ "$OS" = "Mac" ]; then
      brew install node
    else
      sudo apt update
      sudo apt install -y nodejs npm
      sudo npm install -g n
      sudo n stable
    fi
  fi

  echo "[*] Installing Capacitor CLI v7..."
  sudo npm install -g @capacitor/cli@^7.0.0

  echo "[*] Installing Cordova CLI..."
  sudo npm install -g cordova
  
  echo "[*] Installing additional mobile dev tools..."
  sudo npm install -g @ionic/cli
  sudo npm install -g react-native-cli
  
  if [ "$OS" = "Mac" ]; then
    echo "[*] Installing iOS deployment tools..."
    sudo npm install -g ios-deploy
    sudo npm install -g ios-sim
  fi
}

#########################################
# ANDROID ENVIRONMENT VARIABLES
#########################################
setup_android_env() {
  echo "[*] Setting up Android environment variables..."
  if [ "$OS" = "Mac" ]; then
    ANDROID_HOME="$HOME/Library/Android/sdk"
  else
    ANDROID_HOME="$HOME/Android/Sdk"
  fi

  grep -qxF "export ANDROID_HOME=$ANDROID_HOME" ~/.bashrc || {
    echo "export ANDROID_HOME=$ANDROID_HOME" >> ~/.bashrc
    echo 'export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin:$ANDROID_HOME/platform-tools' >> ~/.bashrc
  }

  if [ "$OS" = "Mac" ]; then
    grep -qxF "export ANDROID_HOME=$ANDROID_HOME" ~/.zshrc || {
      echo "export ANDROID_HOME=$ANDROID_HOME" >> ~/.zshrc
      echo 'export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin:$ANDROID_HOME/platform-tools' >> ~/.zshrc
    }
  fi
}

#########################################
# CREATE TEST PROJECTS
#########################################
create_degencasino_mobile_projects() {
  PROJECT_DIR="/Users/degenwithheart/GitHub/DegenCasino/mobile-app/build"
  mkdir -p "$PROJECT_DIR"
  cd "$PROJECT_DIR"

  # DegenCasino Capacitor project
  if [ ! -d "degencasino-capacitor" ]; then
    echo "[*] Creating DegenCasino Capacitor project..."
    npx cap init degencasino-capacitor com.degenwithheart.casino
    cd degencasino-capacitor
    npx cap add android
    if [ "$OS" = "Mac" ]; then
      npx cap add ios
    fi
    echo "[*] DegenCasino Capacitor project created in $PROJECT_DIR/degencasino-capacitor"
    cd ..
  else
    echo "DegenCasino Capacitor project already exists"
  fi

  # DegenCasino Cordova project  
  if [ ! -d "degencasino-cordova" ]; then
    echo "[*] Creating DegenCasino Cordova project..."
    cordova create degencasino-cordova com.degenwithheart.casino "DegenCasino"
    cd degencasino-cordova
    cordova platform add android
    if [ "$OS" = "Mac" ]; then
      cordova platform add ios
    fi
    echo "[*] DegenCasino Cordova project created in $PROJECT_DIR/degencasino-cordova"
    cd ..
  else
    echo "DegenCasino Cordova project already exists"
  fi

  # Run the mobile apps setup script
  if [ -f "/Users/degenwithheart/GitHub/DegenCasino/mobile-app/setup-mobile-apps.sh" ]; then
    echo "[*] Running mobile apps setup..."
    bash "/Users/degenwithheart/GitHub/DegenCasino/mobile-app/setup-mobile-apps.sh"
  fi
}

#########################################
# MAIN INSTALL FLOW
#########################################
echo "[*] Installing development tools..."

if [ "$OS" = "Mac" ]; then
  install_android_studio_mac
else
  install_android_studio_linux
fi

install_node_tools
setup_android_env
create_degencasino_mobile_projects

echo "=== ✅ Setup Complete ==="
echo "Restart your terminal or run 'source ~/.zshrc' (Mac) or 'source ~/.bashrc' (Linux) to activate environment."
echo "DegenCasino mobile projects created in /Users/degenwithheart/GitHub/DegenCasino/mobile-app/build"
echo "Available commands:"
echo "  • android-studio - Open Android Studio"
echo "  • npx cap - Capacitor CLI"
echo "  • cordova - Cordova CLI"
if [ "$OS" = "Mac" ]; then
  echo "  • xcodebuild - Build iOS projects"
  echo "  • xcrun simctl list - List iOS simulators"
fi
echo "  • npm run build:mobile - Build mobile apps (if configured)"
echo "Happy coding! 🎰"