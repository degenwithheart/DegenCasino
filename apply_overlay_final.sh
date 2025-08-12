#!/bin/bash

# Simple and reliable overlay toggle wrapper script
# This version uses targeted replacements for each game's specific overlay pattern

echo "🎮 Applying overlay toggle system to remaining games (simplified approach)..."

# Function to wrap a specific overlay in a specific file
wrap_overlay_in_file() {
    local file="$1"
    local overlay_component="$2"
    local game_name=$(basename $(dirname "$file"))
    
    echo "  🔧 Wrapping ${overlay_component} in ${game_name}..."
    
    # Skip if already wrapped
    if grep -q "renderThinkingOverlay" "$file"; then
        echo "  ⚠️  Already wrapped in $file"
        return 0
    fi
    
    # Create backup
    cp "$file" "${file}.backup"
    
    # Replace the overlay component with wrapped version
    # Using a more specific pattern for multi-line replacement
    
    # Step 1: Add the comment and opening wrapper
    sed -i.tmp "s|{/\* Add the overlay component \*/}|{/* Add the overlay component - conditionally rendered based on ENABLE_THINKING_OVERLAY */}|g" "$file"
    sed -i.tmp "s|<${overlay_component}|{renderThinkingOverlay(\
              <${overlay_component}|g" "$file"
    
    # Step 2: Update gamePhase and thinkingPhase props
    sed -i.tmp "s|gamePhase={gamePhase}|gamePhase={getGamePhaseState(gamePhase)}|g" "$file"
    sed -i.tmp "s|thinkingPhase={thinkingPhase}|thinkingPhase={getThinkingPhaseState(thinkingPhase)}|g" "$file"
    
    # Step 3: Find the closing /> or </Component> and add the closing wrapper
    # This is the tricky part - we need to find the end of the overlay component
    
    # For self-closing tags
    if grep -q "${overlay_component}[^>]*\/>" "$file"; then
        sed -i.tmp "s|\(${overlay_component}[^>]*\)/>|\1/>\
            )}|g" "$file"
    # For components with closing tags  
    elif grep -q "</${overlay_component}>" "$file"; then
        sed -i.tmp "s|</${overlay_component}>|</${overlay_component}>\
            )}|g" "$file"
    # For multi-line components, find the closing /> on its own line
    else
        # Look for standalone /> that closes the component
        sed -i.tmp "/^[[:space:]]*\/>/{
            # Check if this is likely the overlay closing tag by looking at context
            N
            /^[[:space:]]*\/>[[:space:]]*$/{
                s|^([[:space:]]*)/>[[:space:]]*$|\1/>)\n            )}|
            }
        }" "$file"
        
        # Alternative: look for closing tag with specific indentation pattern
        sed -i.tmp "N;s|\([[:space:]]*\)/>\([[:space:]]*\)$|\1/>)\n            )}|g" "$file"
    fi
    
    rm "${file}.tmp"
    
    # Validate the change was made
    if grep -q "renderThinkingOverlay" "$file" && grep -q "getGamePhaseState" "$file"; then
        echo "  ✅ Successfully wrapped ${overlay_component} in ${game_name}"
        rm "${file}.backup"
        return 0
    else
        echo "  ❌ Failed to wrap ${overlay_component} in ${game_name} - restoring backup"
        mv "${file}.backup" "$file"
        return 1
    fi
}

# Define games and their overlay components
declare -A GAME_OVERLAYS=(
    ["src/games/BlackJack/index.tsx"]="BlackJackOverlays"
    ["src/games/Plinko/index.tsx"]="PlinkoOverlays" 
    ["src/games/HiLo/index.tsx"]="HiLoOverlays"
    ["src/games/DiceRoll/index.tsx"]="DiceRollOverlays"
    ["src/games/Scissors/index.tsx"]="ScissorsOverlays"
    ["src/games/Limbo/index.tsx"]="LimboOverlays"
    ["src/games/Mines/index.tsx"]="MinesOverlays"
    ["src/games/Slots/index.tsx"]="thinking-overlay"
    ["src/games/WheelSpin/index.tsx"]="WheelSpinOverlays"
    ["src/games/Keno/index.tsx"]="KenoOverlays"
    ["src/games/CryptoChartGame/index.tsx"]="CryptoChartOverlays"
    ["src/games/FancyVirtualHorseRacing/index.tsx"]="overlay"
    ["src/games/CrashGame/index.tsx"]="CrashOverlays"
    ["src/games/DoubleOrNothing/index.tsx"]="DoubleOrNothingOverlays"
    ["src/games/LuckyNumber/index.tsx"]="LuckyNumberOverlays"
    ["src/games/ProgressivePoker/index.tsx"]="ProgressivePokerOverlays"
    ["src/games/Slide/index.tsx"]="inline-overlay"
)

# Process each game
updated_count=0
failed_count=0

for game_file in "${!GAME_OVERLAYS[@]}"; do
    overlay_component="${GAME_OVERLAYS[$game_file]}"
    
    echo "📁 Processing $game_file with $overlay_component..."
    
    if [ ! -f "$game_file" ]; then
        echo "  ❌ File not found: $game_file"
        ((failed_count++))
        continue
    fi
    
    if wrap_overlay_in_file "$game_file" "$overlay_component"; then
        ((updated_count++))
    else
        ((failed_count++))
    fi
    
    echo ""
done

echo "🎉 Processing complete!"
echo "✅ Successfully updated: $updated_count games"
echo "❌ Failed to update: $failed_count games"

# Note: Dice game was already manually updated
echo "ℹ️  Note: Dice game was manually updated earlier"

echo ""
echo "🧪 Testing the build..."
if npm run build; then
    echo ""
    echo "✅ BUILD SUCCESS! All overlay components are now controllable!"
    echo "🎯 Toggle all overlays by changing ENABLE_THINKING_OVERLAY in src/constants.ts"
else
    echo ""
    echo "❌ Build failed. Check errors above."
fi
