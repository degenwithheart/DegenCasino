#!/bin/bash

# Fix component imports after reorganization
# This script systematically updates all import paths to match the new component folder structure

echo "🔧 Fixing component imports after reorganization..."

# Function to safely replace imports
replace_imports() {
    local search_pattern="$1"
    local replacement="$2"
    local file_pattern="$3"
    
    echo "Replacing '$search_pattern' with '$replacement' in $file_pattern files..."
    
    # Use find to locate files and sed to replace
    find src -name "$file_pattern" -type f -exec sed -i '' "s|$search_pattern|$replacement|g" {} \;
}

# 1. Fix imports from sections to components (sections importing from old component paths)
echo "📁 Fixing sections importing components..."

# ConnectionStatus moved to Connection folder
replace_imports "../components/ConnectionStatus" "../components/Connection/ConnectionStatus" "*.tsx"
replace_imports "../components/ConnectionStatus" "../components/Connection/ConnectionStatus" "*.ts"

# ShareModal moved to Share folder  
replace_imports "../components/ShareModal" "../components/Share/ShareModal" "*.tsx"
replace_imports "../../components/ShareModal" "../../components/Share/ShareModal" "*.tsx"

# FeesTab moved to Transaction folder
replace_imports "../components/FeesTab" "../components/Transaction/FeesTab" "*.tsx"

# 2. Fix cross-component imports (components importing from other component folders)
echo "🔄 Fixing cross-component imports..."

# PriceIndicator moved to UI folder
replace_imports "\"./PriceIndicator\"" "\"../UI/PriceIndicator\"" "*.tsx"
replace_imports "'./PriceIndicator'" "'../UI/PriceIndicator'" "*.tsx"

# GameScreenFrame moved to Game folder
replace_imports "\"./GameScreenFrame\"" "\"../Game/GameScreenFrame\"" "*.tsx"
replace_imports "'./GameScreenFrame'" "'../Game/GameScreenFrame'" "*.tsx"

# Modal moved to Modal folder
replace_imports "\"./Modal\"" "\"../Modal/Modal\"" "*.tsx"
replace_imports "'./Modal'" "'../Modal/Modal'" "*.tsx"

# ExplorerHeader moved to Explorer folder
replace_imports "\"./ExplorerHeader\"" "\"../Explorer/ExplorerHeader\"" "*.tsx"
replace_imports "'./ExplorerHeader'" "'../Explorer/ExplorerHeader'" "*.tsx"

# 3. Fix remaining "../" paths that should be "../../" after reorganization
echo "📂 Fixing relative path depth..."

# In components, going to hooks, utils, themes, etc. needs ../../ not ../
find src/components -name "*.tsx" -o -name "*.ts" | while read file; do
    # Skip if already correct
    if grep -q "../../hooks\|../../utils\|../../themes\|../../constants\|../../services" "$file"; then
        continue
    fi
    
    # Fix hooks imports
    sed -i '' 's|from "../hooks/|from "../../hooks/|g' "$file"
    sed -i '' "s|from '../hooks/|from '../../hooks/|g" "$file"
    
    # Fix utils imports  
    sed -i '' 's|from "../utils/|from "../../utils/|g' "$file"
    sed -i '' "s|from '../utils/|from '../../utils/|g" "$file"
    sed -i '' 's|from "../utils"|from "../../utils"|g' "$file"
    sed -i '' "s|from '../utils'|from '../../utils'|g" "$file"
    
    # Fix themes imports
    sed -i '' 's|from "../themes/|from "../../themes/|g' "$file"
    sed -i '' "s|from '../themes/|from '../../themes/|g" "$file"
    
    # Fix constants imports
    sed -i '' 's|from "../constants|from "../../constants|g' "$file"
    sed -i '' "s|from '../constants|from '../../constants|g" "$file"
    
    # Fix services imports
    sed -i '' 's|from "../services/|from "../../services/|g' "$file"
    sed -i '' "s|from '../services/|from '../../services/|g" "$file"
    
    # Fix sections imports from components (should go up two levels)
    sed -i '' 's|from "../sections/|from "../../sections/|g' "$file"
    sed -i '' "s|from '../sections/|from '../../sections/|g" "$file"
    
    # Fix games imports from components
    sed -i '' 's|from "../games/|from "../../games/|g' "$file"
    sed -i '' "s|from '../games/|from '../../games/|g" "$file"
done

# 4. Fix specific known problematic imports
echo "🎯 Fixing specific known issues..."

# Fix LoadingBar import in LazyGameLoader
replace_imports "\"../sections/Game/LoadingBar\"" "\"../../sections/Game/LoadingBar\"" "*.tsx"
replace_imports "'../sections/Game/LoadingBar'" "'../../sections/Game/LoadingBar'" "*.tsx"

# Fix Game.styles import in MobileGameControls
replace_imports "\"../sections/Game/Game.styles\"" "\"../../sections/Game/Game.styles\"" "*.tsx"
replace_imports "'../sections/Game/Game.styles'" "'../../sections/Game/Game.styles'" "*.tsx"

# Fix errorCodes import path
replace_imports "\"../constants/errorCodes\"" "\"../../constants/errorCodes\"" "*.tsx"
replace_imports "'../constants/errorCodes'" "'../../constants/errorCodes'" "*.tsx"

# 5. Fix hooks that import from components
echo "🪝 Fixing hooks importing components..."
find src/hooks -name "*.ts" -o -name "*.tsx" | while read file; do
    # GameScreenFrame is now in Game folder
    sed -i '' 's|from "../components/GameScreenFrame"|from "../components/Game/GameScreenFrame"|g' "$file"
    sed -i '' "s|from '../components/GameScreenFrame'|from '../components/Game/GameScreenFrame'|g" "$file"
done

echo "✅ Import fixes completed!"
echo "🔍 Checking for any remaining broken imports..."

# Check for remaining problematic patterns
echo "Scanning for remaining issues..."
grep -r "from \"\.\./\.\./\.\." src/ && echo "⚠️  Found triple ../ paths - these might need manual review"
grep -r "from '\.\./\.\./\.\." src/ && echo "⚠️  Found triple ../ paths - these might need manual review"

echo "🎉 Script completed! Try running the dev server now."
