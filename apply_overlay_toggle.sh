#!/bin/bash

# Auto-apply overlay toggle system to all remaining games
# This script updates game files to use the ENABLE_THINKING_OVERLAY toggle

echo "🎮 Auto-applying overlay toggle system to all remaining games..."

# List of games that need to be updated (excluding already updated ones)
GAMES=(
    "src/games/Slide/index.tsx"
    "src/games/LuckyNumber/index.tsx" 
    "src/games/ProgressivePoker/index.tsx"
    "src/games/Dice/index.tsx"
    "src/games/WheelSpin/index.tsx"
    "src/games/Keno/index.tsx"
    "src/games/CryptoChartGame/index.tsx"
    "src/games/BlackJack/index.tsx"
    "src/games/FancyVirtualHorseRacing/index.tsx"
    "src/games/CrashGame/index.tsx"
    "src/games/DoubleOrNothing/index.tsx"
    "src/games/Limbo/index.tsx"
    "src/games/Scissors/index.tsx"
    "src/games/DiceRoll/index.tsx"
    "src/games/HiLo/index.tsx"
    "src/games/Slots/index.tsx"
    "src/games/Mines/index.tsx"
    "src/games/Plinko/index.tsx"
)

# Function to add import statement if not already present
add_import() {
    local file="$1"
    local import_line="import { renderThinkingOverlay, getThinkingPhaseState, getGamePhaseState } from '../../utils/overlayUtils'"
    
    # Check if import already exists
    if ! grep -q "renderThinkingOverlay" "$file"; then
        # Find the last import line and add our import after it
        local last_import_line=$(grep -n "^import" "$file" | tail -1 | cut -d: -f1)
        if [ -n "$last_import_line" ]; then
            sed -i.bak "${last_import_line}a\\
$import_line" "$file"
            echo "  ✅ Added import to $file"
        fi
    else
        echo "  ⚠️  Import already exists in $file"
    fi
}

# Function to wrap overlay component
wrap_overlay() {
    local file="$1"
    
    # Skip if already wrapped
    if grep -q "renderThinkingOverlay" "$file"; then
        echo "  ⚠️  Overlay already wrapped in $file"
        return
    fi
    
    # Find overlay usage patterns and wrap them
    # Pattern 1: <ComponentOverlays (most common)
    if grep -q "<.*Overlays" "$file"; then
        # Create a temporary file for complex sed operations
        local temp_file=$(mktemp)
        
        # Use awk for more complex pattern matching and replacement
        awk '
        BEGIN { in_overlay = 0; overlay_content = ""; indent = "" }
        
        # Detect start of overlay component
        /<[A-Za-z]*Overlays/ {
            in_overlay = 1
            # Capture indentation
            match($0, /^[[:space:]]*/)
            indent = substr($0, RSTART, RLENGTH)
            
            # Start building overlay content
            overlay_content = $0
            
            # Check if it ends on same line
            if (/>/ && !/\/>/) {
                # Multi-line overlay
                next
            } else if (/\/>/) {
                # Single line self-closing overlay
                gsub(/<([A-Za-z]*Overlays[^>]*)/, "{renderThinkingOverlay(\n" indent "  <\\1", overlay_content)
                gsub(/\/>/, "\n" indent "  />)}", overlay_content)
                print indent "{/* Conditionally render overlay based on ENABLE_THINKING_OVERLAY */}"
                print overlay_content
                in_overlay = 0
                overlay_content = ""
                next
            }
        }
        
        # Collect overlay content
        in_overlay && !/^[[:space:]]*<[A-Za-z]*Overlays/ {
            overlay_content = overlay_content "\n" $0
            
            # Check for end of overlay component
            if (/\/>/ || (/<\/.*Overlays>/ || (/^\s*\/>/ && overlay_content ~ /gamePhase=/))) {
                # End of overlay found
                # Add wrapper
                print indent "{/* Conditionally render overlay based on ENABLE_THINKING_OVERLAY */}"
                print indent "{renderThinkingOverlay("
                
                # Process the overlay content to add utility functions
                gsub(/gamePhase={([^}]*)}/, "gamePhase={getGamePhaseState(\\1)}", overlay_content)
                gsub(/thinkingPhase={([^}]*)}/, "thinkingPhase={getThinkingPhaseState(\\1)}", overlay_content)
                
                print overlay_content
                print indent ")}"
                
                in_overlay = 0
                overlay_content = ""
                next
            }
        }
        
        # Print normal lines
        !in_overlay { print }
        ' "$file" > "$temp_file"
        
        # Replace original file if changes were made
        if ! cmp -s "$file" "$temp_file"; then
            mv "$temp_file" "$file"
            echo "  ✅ Wrapped overlay in $file"
        else
            rm "$temp_file"
            echo "  ⚠️  No overlay pattern found to wrap in $file"
        fi
    else
        echo "  ⚠️  No overlay component found in $file"
    fi
}

# Function to create backup
create_backup() {
    local file="$1"
    cp "$file" "${file}.overlay-backup"
}

# Function to validate file syntax
validate_syntax() {
    local file="$1"
    # Basic validation - check for balanced braces
    local open_braces=$(grep -o "{" "$file" | wc -l)
    local close_braces=$(grep -o "}" "$file" | wc -l)
    
    if [ "$open_braces" -eq "$close_braces" ]; then
        echo "  ✅ Syntax validation passed for $file"
        return 0
    else
        echo "  ❌ Syntax validation failed for $file (braces: $open_braces open, $close_braces close)"
        return 1
    fi
}

# Process each game
updated_count=0
failed_count=0

for game_file in "${GAMES[@]}"; do
    echo "📁 Processing $game_file..."
    
    if [ ! -f "$game_file" ]; then
        echo "  ❌ File not found: $game_file"
        ((failed_count++))
        continue
    fi
    
    # Create backup
    create_backup "$game_file"
    
    # Add import
    add_import "$game_file"
    
    # Wrap overlay
    wrap_overlay "$game_file"
    
    # Validate syntax
    if validate_syntax "$game_file"; then
        ((updated_count++))
        # Clean up backup if successful
        rm -f "${game_file}.overlay-backup"
    else
        echo "  🔄 Restoring backup due to validation failure..."
        mv "${game_file}.overlay-backup" "$game_file"
        ((failed_count++))
    fi
    
    echo ""
done

echo "🎉 Processing complete!"
echo "✅ Successfully updated: $updated_count games"
echo "❌ Failed to update: $failed_count games"

if [ $failed_count -gt 0 ]; then
    echo ""
    echo "⚠️  Some games failed to update automatically."
    echo "📋 Please manually update the failed games using the guide in OVERLAY_TOGGLE_GUIDE.md"
fi

echo ""
echo "🧪 Testing the build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful! All games updated correctly."
else
    echo "❌ Build failed. Some games may need manual fixes."
    echo "📋 Check the console output above for specific errors."
fi
