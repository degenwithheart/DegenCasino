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

# Function to add import statement
add_import() {
    local file="$1"
    local import_line="import { renderThinkingOverlay, getThinkingPhaseState, getGamePhaseState } from '../../utils/overlayUtils'"
    
    # Check if import already exists
    if ! grep -q "renderThinkingOverlay" "$file"; then
        # Find the last import line and add our import after it
        local last_import_line=$(grep -n "^import" "$file" | tail -1 | cut -d: -f1)
        if [ -n "$last_import_line" ]; then
            # Use sed to insert the import after the last import line
            sed -i.bak "${last_import_line}a\\
$import_line" "$file" && rm "${file}.bak"
            echo "  ✅ Added import to $file"
        fi
    else
        echo "  ⚠️  Import already exists in $file"
    fi
}

# Function to manually process each game with specific patterns
process_game() {
    local file="$1"
    local game_name=$(basename $(dirname "$file"))
    
    echo "  🔧 Processing $game_name overlay..."
    
    # Skip if already processed
    if grep -q "renderThinkingOverlay" "$file"; then
        echo "  ⚠️  Already processed: $file"
        return 0
    fi
    
    # Create a backup
    cp "$file" "${file}.backup"
    
    # Strategy: Find the overlay component usage and wrap it
    # This is more manual but more reliable than regex
    
    case "$game_name" in
        "Slide")
            # Look for SlideOverlays pattern - it might be different
            if grep -q "thinking-overlay\|dramatic.*overlay" "$file"; then
                echo "    📝 Slide uses inline overlay styles - different pattern"
                return 1
            fi
            ;;
        "Dice")
            # Replace DiceOverlays usage
            sed -i.tmp 's|<DiceOverlays|{renderThinkingOverlay(\
              <DiceOverlays|g' "$file"
            sed -i.tmp 's|gamePhase={gamePhase}|gamePhase={getGamePhaseState(gamePhase)}|g' "$file"
            sed -i.tmp 's|thinkingPhase={thinkingPhase}|thinkingPhase={getThinkingPhaseState(thinkingPhase)}|g' "$file"
            # Close the renderThinkingOverlay call
            sed -i.tmp '/DiceOverlays$/,/\/>/s|/>|/>\
            )}|' "$file"
            rm "${file}.tmp"
            ;;
        "BlackJack")
            # Replace BlackJackOverlays usage
            sed -i.tmp 's|<BlackJackOverlays|{renderThinkingOverlay(\
              <BlackJackOverlays|g' "$file"
            sed -i.tmp 's|gamePhase={gamePhase}|gamePhase={getGamePhaseState(gamePhase)}|g' "$file"
            sed -i.tmp 's|thinkingPhase={thinkingPhase}|thinkingPhase={getThinkingPhaseState(thinkingPhase)}|g' "$file"
            # Close the renderThinkingOverlay call
            sed -i.tmp '/BlackJackOverlays$/,/\/>/s|/>|/>\
            )}|' "$file"
            rm "${file}.tmp"
            ;;
        "Plinko")
            # Replace PlinkoOverlays usage  
            sed -i.tmp 's|<PlinkoOverlays|{renderThinkingOverlay(\
              <PlinkoOverlays|g' "$file"
            sed -i.tmp 's|gamePhase={gamePhase}|gamePhase={getGamePhaseState(gamePhase)}|g' "$file"
            sed -i.tmp 's|thinkingPhase={thinkingPhase}|thinkingPhase={getThinkingPhaseState(thinkingPhase)}|g' "$file"
            # Close the renderThinkingOverlay call
            sed -i.tmp '/PlinkoOverlays$/,/\/>/s|/>|/>\
            )}|' "$file"
            rm "${file}.tmp"
            ;;
        *)
            # Generic approach for other games
            local overlay_component=$(grep -o '<[A-Za-z]*Overlays' "$file" | head -1 | sed 's/<//')
            if [ -n "$overlay_component" ]; then
                echo "    🎯 Found overlay component: $overlay_component"
                sed -i.tmp "s|<${overlay_component}|{renderThinkingOverlay(\
              <${overlay_component}|g" "$file"
                sed -i.tmp 's|gamePhase={gamePhase}|gamePhase={getGamePhaseState(gamePhase)}|g' "$file"
                sed -i.tmp 's|thinkingPhase={thinkingPhase}|thinkingPhase={getThinkingPhaseState(thinkingPhase)}|g' "$file"
                # Close the renderThinkingOverlay call
                sed -i.tmp "/${overlay_component}\$/,/\/>/s|/>|/>\
            )}|" "$file"
                rm "${file}.tmp"
            else
                echo "    ❌ No overlay component found"
                return 1
            fi
            ;;
    esac
    
    # Add comment before the overlay
    sed -i.tmp 's|{renderThinkingOverlay(|{/* Conditionally render overlay based on ENABLE_THINKING_OVERLAY */}\
            {renderThinkingOverlay(|g' "$file"
    rm "${file}.tmp"
    
    echo "  ✅ Processed $game_name"
    return 0
}

# Main processing loop
updated_count=0
failed_count=0

for game_file in "${GAMES[@]}"; do
    echo "📁 Processing $game_file..."
    
    if [ ! -f "$game_file" ]; then
        echo "  ❌ File not found: $game_file"
        ((failed_count++))
        continue
    fi
    
    # Add import
    add_import "$game_file"
    
    # Process the game
    if process_game "$game_file"; then
        ((updated_count++))
        # Clean up backup
        rm -f "${game_file}.backup"
    else
        echo "  🔄 Restoring backup for $(basename $(dirname "$game_file"))"
        mv "${game_file}.backup" "$game_file"
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
    echo "📋 These will need manual updates using the guide in OVERLAY_TOGGLE_GUIDE.md"
fi

echo ""
echo "🧪 Testing the build..."
if npm run build; then
    echo "✅ Build successful! All games updated correctly."
else
    echo "❌ Build failed. Some games may need manual fixes."
    echo "📋 Check the console output above for specific errors."
fi
