#!/bin/bash

# Extract styles from component files to dedicated .styles.ts files
# This script processes multiple components at once

echo "🎨 Starting batch style extraction..."

# Array of folders to process
folders=(
    "AllGamesModal"
    "Bonus" 
    "Cache"
    "Connection"
    "Explorer"
    "Game"
    "Graphics"
    "Modal"
    "Player"
    "RecentPlays"
    "ReferralCode"
    "Share"
    "ToggleSwitch"
    "UnderConstruction"
    "UserButton"
    "WinAnimation"
)

cd src/components

for folder in "${folders[@]}"; do
    echo "📁 Processing $folder..."
    
    # Skip if folder doesn't exist
    if [ ! -d "$folder" ]; then
        echo "⚠️  Folder $folder doesn't exist, skipping..."
        continue
    fi
    
    # Find main .tsx file (usually matches folder name)
    main_file="$folder/$folder.tsx"
    if [ ! -f "$main_file" ]; then
        # Try to find any .tsx file in the folder
        main_file=$(find "$folder" -name "*.tsx" | head -1)
        if [ -z "$main_file" ]; then
            echo "⚠️  No .tsx files found in $folder, skipping..."
            continue
        fi
    fi
    
    echo "   📄 Processing: $main_file"
    
    # Extract styled components and keyframes
    styles_content=""
    
    # Extract imports
    imports=$(grep -E "import.*styled|import.*keyframes" "$main_file" | head -1)
    if [ -n "$imports" ]; then
        styles_content="$imports\n\n"
    else
        styles_content="import styled, { keyframes } from 'styled-components'\n\n"
    fi
    
    # Extract keyframes
    keyframes=$(sed -n '/^const.*keyframes`/,/^`$/p' "$main_file")
    if [ -n "$keyframes" ]; then
        # Convert const to export const
        keyframes=$(echo "$keyframes" | sed 's/^const /export const /')
        styles_content="$styles_content$keyframes\n\n"
    fi
    
    # Extract styled components
    styled_components=$(sed -n '/^const.*styled\./,/^`$/p' "$main_file")
    if [ -n "$styled_components" ]; then
        # Convert const to export const
        styled_components=$(echo "$styled_components" | sed 's/^const /export const /')
        styles_content="$styles_content$styled_components\n\n"
    fi
    
    # Write to .styles.ts file if we found content
    if [ ${#styles_content} -gt 100 ]; then
        echo -e "$styles_content" > "$folder/$folder.styles.ts"
        echo "   ✅ Created $folder/$folder.styles.ts"
        
        # Update the .tsx file to import from styles
        # This is a simplified approach - may need manual review
        echo "   🔄 Updating imports in $main_file"
        
        # Create backup
        cp "$main_file" "$main_file.backup"
        
        # Remove styled imports and add styles import
        # This is a basic replacement - complex files may need manual editing
        sed -i '' '/import.*styled/d' "$main_file"
        sed -i '' '/import.*keyframes/d' "$main_file"
        
        # Add import for styles (insert after other imports)
        last_import_line=$(grep -n "^import" "$main_file" | tail -1 | cut -d: -f1)
        if [ -n "$last_import_line" ]; then
            sed -i '' "${last_import_line}a\\
import * as S from './$folder.styles'
" "$main_file"
        fi
        
        echo "   📝 Updated imports (backup saved as $main_file.backup)"
    else
        echo "   ⚠️  No styled components found in $main_file"
    fi
    
    echo ""
done

echo "🎉 Batch extraction complete!"
echo ""
echo "⚠️  IMPORTANT: Please review the generated files manually as some complex patterns may need adjustment."
echo "   Backup files (.backup) have been created for safety."
