#!/bin/bash

# Create .styles.ts files for all component folders
# This script will extract styled components from .tsx files and create dedicated .styles.ts files

echo "🎨 Creating dedicated .styles.ts files for all component folders..."

# Component folders to process
COMPONENT_FOLDERS=(
  "AllGamesModal"
  "Bonus" 
  "Cache"
  "Dropdown"
  "Explorer"
  "Game"
  "Graphics"
  "Jackpot"
  "Mobile"
  "Modal"
  "Platform"
  "Referral"
  "Share"
  "Theme"
  "Transaction"
  "UI"
)

# Function to create a basic styles file template
create_styles_template() {
  local folder="$1"
  local styles_file="src/components/$folder/$folder.styles.ts"
  
  echo "Creating $styles_file..."
  
  cat > "$styles_file" << 'EOF'
import styled, { keyframes } from 'styled-components'

// Add your styled components here
// Example:
// export const Container = styled.div`
//   /* styles */
// `

// Example animation:
// export const fadeIn = keyframes`
//   from { opacity: 0; }
//   to { opacity: 1; }
// `
EOF
}

# Function to extract styled components from a file and suggest what to move
suggest_extractions() {
  local file="$1"
  local folder="$2"
  
  if [[ -f "$file" ]]; then
    echo "📁 Analyzing $file for styled components..."
    
    # Find styled components
    styled_components=$(grep -n "const.*= styled\." "$file" | head -10)
    keyframes_animations=$(grep -n "const.*= keyframes" "$file" | head -5)
    
    if [[ -n "$styled_components" || -n "$keyframes_animations" ]]; then
      echo "  Found styled components to extract:"
      echo "$styled_components"
      echo "$keyframes_animations"
      echo "  ➜ Consider moving these to src/components/$folder/$folder.styles.ts"
      echo ""
    fi
  fi
}

# Create styles files for each component folder
for folder in "${COMPONENT_FOLDERS[@]}"; do
  folder_path="src/components/$folder"
  styles_file="$folder_path/$folder.styles.ts"
  
  if [[ -d "$folder_path" ]]; then
    # Only create if it doesn't exist
    if [[ ! -f "$styles_file" ]]; then
      create_styles_template "$folder"
    else
      echo "📝 $styles_file already exists, skipping..."
    fi
    
    # Analyze existing .tsx files in the folder
    for tsx_file in "$folder_path"/*.tsx; do
      if [[ -f "$tsx_file" ]]; then
        suggest_extractions "$tsx_file" "$folder"
      fi
    done
  else
    echo "⚠️  Folder $folder_path does not exist, skipping..."
  fi
done

echo "✅ Styles file creation completed!"
echo ""
echo "📋 Next steps:"
echo "1. Review the suggestions above"
echo "2. Move styled components from .tsx files to their respective .styles.ts files"
echo "3. Update imports in .tsx files to use the new styles files"
echo "4. Test that everything still works"
echo ""
echo "💡 Example of how to refactor:"
echo "// Before (in Component.tsx):"
echo "import styled from 'styled-components'"
echo "const Button = styled.button\`...\`"
echo ""
echo "// After:"
echo "// In Component.styles.ts:"
echo "export const Button = styled.button\`...\`"
echo ""
echo "// In Component.tsx:"
echo "import { Button } from './Component.styles'"
