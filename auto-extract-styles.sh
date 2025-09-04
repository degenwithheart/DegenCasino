#!/bin/bash

# Auto-extract styled components to .styles.ts files
# This script will automatically move styled components from .tsx files to their .styles.ts files

echo "🤖 Auto-extracting styled components to dedicated .styles.ts files..."

# Function to extract styled components from a .tsx file to its .styles.ts file
extract_styled_components() {
  local tsx_file="$1"
  local folder="$2"
  local styles_file="src/components/$folder/$folder.styles.ts"
  
  if [[ ! -f "$tsx_file" ]]; then
    return
  fi
  
  echo "🔍 Processing $tsx_file..."
  
  # Create a temporary file to store extracted components
  temp_styled_file=$(mktemp)
  temp_tsx_file=$(mktemp)
  
  # Start the styles file with imports
  cat > "$temp_styled_file" << 'EOF'
import styled, { keyframes } from 'styled-components'

EOF
  
  # Extract keyframes and styled components
  # First, extract keyframes
  grep -n "^const.*= keyframes\`" "$tsx_file" | while IFS=':' read -r line_num line_content; do
    # Extract the complete keyframe definition
    awk -v start="$line_num" '
      NR >= start {
        print
        if (/^`/ && NR > start) exit
      }
    ' "$tsx_file" >> "$temp_styled_file"
    echo "" >> "$temp_styled_file"
  done
  
  # Then extract styled components
  grep -n "^const.*= styled\." "$tsx_file" | while IFS=':' read -r line_num line_content; do
    # Extract the complete styled component definition
    awk -v start="$line_num" '
      NR >= start {
        print
        if (/^`/ && NR > start) exit
      }
    ' "$tsx_file" >> "$temp_styled_file"
    echo "" >> "$temp_styled_file"
  done
  
  # Add export keywords to the extracted components
  sed -i '' 's/^const /export const /' "$temp_styled_file"
  
  # If we extracted anything meaningful, replace the styles file
  if [[ $(grep -c "export const" "$temp_styled_file") -gt 0 ]]; then
    mv "$temp_styled_file" "$styles_file"
    echo "✅ Extracted styled components to $styles_file"
    
    # Now create a version of the tsx file without the styled components
    # Remove keyframes definitions
    sed '/^const.*= keyframes`/,/^`$/d' "$tsx_file" > "$temp_tsx_file"
    
    # Remove styled component definitions  
    sed '/^const.*= styled\./,/^`$/d' "$temp_tsx_file" > "${temp_tsx_file}.2"
    mv "${temp_tsx_file}.2" "$temp_tsx_file"
    
    # Add import for the styles file at the top
    # Find the line with styled-components import and add our import after it
    awk '
      /import.*styled.*from.*styled-components/ {
        print
        print "import {"
        getline imports < "'"$styles_file"'"
        while ((getline line < "'"$styles_file"'") > 0) {
          if (line ~ /^export const /) {
            gsub(/^export const /, "", line)
            gsub(/ = .*/, "", line)
            print "  " line ","
          }
        }
        close("'"$styles_file"'")
        print "} from \"./" "'"$folder"'.styles\""
        next
      }
      { print }
    ' "$tsx_file" > "${temp_tsx_file}.3"
    
    # Replace the original tsx file
    mv "${temp_tsx_file}.3" "$tsx_file"
    echo "✅ Updated imports in $tsx_file"
  else
    echo "ℹ️  No styled components found in $tsx_file"
  fi
  
  # Clean up temp files
  rm -f "$temp_styled_file" "$temp_tsx_file" "${temp_tsx_file}.2"
}

# Process specific high-priority components first
echo "🎯 Processing high-priority components..."

# Let's start with a few key components to test the process
extract_styled_components "src/components/Modal/Modal.tsx" "Modal"
extract_styled_components "src/components/Dropdown/Dropdown.tsx" "Dropdown"
extract_styled_components "src/components/Theme/ThemeSelector.tsx" "Theme"

echo ""
echo "✅ Auto-extraction completed for test components!"
echo ""
echo "📋 To complete the process:"
echo "1. Review the generated .styles.ts files"
echo "2. Test the components to ensure they still work"
echo "3. Run this script on more components if the test ones work correctly"
echo "4. Manually adjust any imports that may need fine-tuning"
echo ""
echo "💡 The script creates clean .styles.ts files and updates imports automatically"
