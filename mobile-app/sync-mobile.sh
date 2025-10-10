#!/bin/bash
# sync-mobile.sh
# Sync Capacitor v7 project with latest dependencies and plugins (Android only)

#!/bin/bash
# Don't exit on first error; we will handle non-critical failures explicitly
set +e

# Helper to run a command but continue on error, logging a warning
run_safe() {
  echo "    $ $*"
  "$@"
  local rc=$?
  if [ $rc -ne 0 ]; then
    echo "    ⚠️  Command failed with exit code $rc: $*"
  fi
  return $rc
}

# Track any critical failures (we'll exit non-zero if any occur)
CRITICAL_FAIL=0

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BUILD_DIR="$SCRIPT_DIR/build"
DIST_DIR="$PROJECT_ROOT/dist"

echo "=== DegenCasino Mobile Sync ==="

# Detect CI / Vercel environment: when present, skip installing or running Capacitor
SKIP_CAPACITOR=0
# allow explicit override via SKIP_CAPACITOR_OVERRIDE=1
if [ "${SKIP_CAPACITOR_OVERRIDE:-}" = "1" ]; then
  SKIP_CAPACITOR=1
elif [ -n "$VERCEL" ] || [ "${CI:-}" = "true" ]; then
  # running on Vercel or other CI; skip Capacitor actions
  SKIP_CAPACITOR=1
fi

# If we're skipping Capacitor actions in CI, ensure a minimal capacitor folder exists
if [ "$SKIP_CAPACITOR" -eq 1 ]; then
  if [ ! -d "$BUILD_DIR/capacitor" ]; then
    echo "  → Creating minimal capacitor project folders (CI fallback)"
    mkdir -p "$BUILD_DIR/capacitor/www"
    # create a minimal package.json so some tools don't error out
    if [ ! -f "$BUILD_DIR/capacitor/package.json" ]; then
      cat > "$BUILD_DIR/capacitor/package.json" <<EOF
{
  "name": "degen-casino-capacitor",
  "version": "1.0.0",
  "private": true,
  "dependencies": {}
}
EOF
    fi
  fi
fi

# Check if main web build exists and copy it
if [ -d "$DIST_DIR" ]; then
  echo "[*] Copying latest web build to mobile projects..."
  
  # Copy to Capacitor
  if [ -d "$BUILD_DIR/capacitor" ]; then
    echo "  → Copying to Capacitor www folder..."
    rm -rf "$BUILD_DIR/capacitor/www"
    cp -r "$DIST_DIR" "$BUILD_DIR/capacitor/www"
    
    # Copy hot update system
    echo "  → Installing hot update system..."
    if [ -f "$SCRIPT_DIR/hot-updates/mobile-updater.js" ]; then
      mkdir -p "$BUILD_DIR/capacitor/www/js"
      cp "$SCRIPT_DIR/hot-updates/mobile-updater.js" "$BUILD_DIR/capacitor/www/js/"
      
      # Inject updater script into index.html
      if [ -f "$BUILD_DIR/capacitor/www/index.html" ]; then
        # Insert script tag before closing head tag
        awk '/<\/head>/ {print "<script src=\"/js/mobile-updater.js\"></script>"} {print}' "$BUILD_DIR/capacitor/www/index.html" > "$BUILD_DIR/capacitor/www/index.html.tmp" && mv "$BUILD_DIR/capacitor/www/index.html.tmp" "$BUILD_DIR/capacitor/www/index.html"
        echo "  ✓ Hot update system installed"
      fi
    fi
    
    echo "  ✓ Web build copied to Capacitor"
  fi
else
  echo "  ⚠️  No web build found at $DIST_DIR"
  echo "  → Run 'npm run build' first to generate web build"
fi

# Capacitor v7 Sync (skip in CI/Vercel when Capacitor is not available)
if [ "$SKIP_CAPACITOR" -eq 1 ]; then
  echo "[*] Skipping Capacitor install/sync in CI/Vercel environment (SKIP_CAPACITOR enabled)."
else
  # Only run Capacitor actions when the capacitor project exists
  if [ -d "$BUILD_DIR/capacitor" ]; then
    echo "[*] Syncing Capacitor v7..."
    cd "$BUILD_DIR/capacitor"
  
  # Update package.json if needed
    if ! grep -q '"@capacitor/core": "\^7.0.0"' package.json; then
      echo "  → Updating Capacitor to v7..."
      run_safe npm install @capacitor/core@^7.0.0 @capacitor/cli@^7.0.0 @capacitor/android@^7.0.0
      rc=$?
      if [ $rc -ne 0 ]; then
        echo "  ⚠️  Capacitor install failed (critical)."
        CRITICAL_FAIL=1
      fi
    fi

    # CI fallback: if capacitor modules are in top-level node_modules but not in the capacitor project,
    # copy them over to avoid network installs during Vercel builds.
    TOP_NODE_MODULES="$PROJECT_ROOT/node_modules"
    TARGET_NODE_MODULES="$BUILD_DIR/capacitor/node_modules"
    if [ -d "$TOP_NODE_MODULES/@capacitor" ] && [ ! -d "$TARGET_NODE_MODULES/@capacitor" ]; then
      echo "  → Copying @capacitor modules from top-level node_modules to capacitor project (CI fallback)"
      mkdir -p "$TARGET_NODE_MODULES"
      run_safe cp -R "$TOP_NODE_MODULES/@capacitor" "$TARGET_NODE_MODULES/"
    fi
  
  # Install Browser plugin
    if ! grep -q '"@capacitor/browser"' package.json; then
      echo "  → Installing Browser plugin..."
      run_safe npm install @capacitor/browser@^7.0.0
      rc=$?
      if [ $rc -ne 0 ]; then
        echo "  ⚠️  Browser plugin install failed (non-fatal)."
        # Not marking as critical; mobile app can still function without this plugin during CI
      fi
    fi
  
  # Sync platforms
  echo "  → Syncing platforms..."
  run_safe npx cap sync
  rc=$?
  if [ $rc -ne 0 ]; then
    echo "  ⚠️  npx cap sync failed (critical). Collecting diagnostics..."
    echo "  --- Diagnostic: current directory ---"
    pwd
    echo "  --- Diagnostic: node version ---"
    node -v 2>/dev/null || echo "(node not found)"
    echo "  --- Diagnostic: package.json dependencies ---"
    node -e "try{console.log(JSON.stringify(require('./package.json').dependencies||{},null,2))}catch(e){console.error('cannot read package.json:',e.message)}" 2>/dev/null || true
    echo "  --- Diagnostic: npm ls @capacitor/android (top-level) ---"
    npm ls @capacitor/android --depth=0 2>&1 || true
    echo "  --- Diagnostic: node_modules entries matching 'capacitor' ---"
    ls -1 node_modules 2>/dev/null | grep capacitor || echo "(no capacitor modules found)"
    echo "  --- Diagnostic end ---"
    CRITICAL_FAIL=1
  else
    echo "  ✓ Capacitor v7 sync complete"
  fi
else
  echo "  ⚠️ Capacitor project not found. Run setup-mobile-apps.sh first."
# end SKIP_CAPACITOR guard
  fi
fi

echo "=== Mobile Sync Complete ==="

# Fail hard if any critical step failed so the caller can mark sync as failed
if [ $CRITICAL_FAIL -ne 0 ]; then
  echo "  ❌ One or more critical steps failed during mobile sync."
  exit 1
fi