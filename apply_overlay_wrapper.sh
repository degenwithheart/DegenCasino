#!/bin/bash

# Final overlay wrapper application - checks for actual usage, not just imports
echo "🎮 Applying overlay wrappers to remaining games (final pass)..."

# Get list of games that have imports but not actual usage
echo "📊 Checking current status..."

games_with_imports=$(find src/games -name "index.tsx" -exec grep -l "renderThinkingOverlay.*from.*overlayUtils" {} \; | wc -l)
games_with_usage=$(find src/games -name "index.tsx" -exec grep -l "renderThinkingOverlay(" {} \; | wc -l)

echo "✅ Games with imports: $games_with_imports"
echo "✅ Games with actual usage: $games_with_usage"
echo "⏳ Games needing wrapper: $((games_with_imports - games_with_usage))"
echo ""

# Get list of files that have imports but no usage
FILES_NEEDING_WRAPPER=()
while IFS= read -r file; do
    if grep -q "renderThinkingOverlay.*from.*overlayUtils" "$file" && ! grep -q "renderThinkingOverlay(" "$file"; then
        FILES_NEEDING_WRAPPER+=("$file")
    fi
done < <(find src/games -name "index.tsx")

echo "📋 Files that need wrappers applied:"
for file in "${FILES_NEEDING_WRAPPER[@]}"; do
    echo "  - $file"
done
echo ""

# Function to apply wrapper to a specific file
apply_wrapper() {
    local file="$1"
    local game_name=$(basename $(dirname "$file"))
    
    echo "🔧 Processing $game_name..."
    
    # Create backup
    cp "$file" "${file}.backup"
    
    # Read file content
    local content=$(cat "$file")
    
    # Find overlay component names in this file
    local overlay_components=$(grep -o '<[A-Za-z]*Overlays' "$file" | sed 's/<//' | sort -u)
    
    if [ -z "$overlay_components" ]; then
        echo "  ❌ No overlay components found in $file"
        rm "${file}.backup"
        return 1
    fi
    
    for component in $overlay_components; do
        echo "  🎯 Wrapping $component..."
        
        # Apply the wrapper using sed with more specific patterns
        # Update the comment first
        sed -i.tmp 's|{/\* Add the overlay component \*/}|{/* Add the overlay component - conditionally rendered based on ENABLE_THINKING_OVERLAY */}|g' "$file"
        
        # Wrap the component opening tag
        sed -i.tmp "s|<${component} |{renderThinkingOverlay(\
              <${component} |g" "$file"
        sed -i.tmp "s|<${component}>|{renderThinkingOverlay(\
              <${component}>|g" "$file"
        
        # Update the props
        sed -i.tmp 's|gamePhase={gamePhase}|gamePhase={getGamePhaseState(gamePhase)}|g' "$file"
        sed -i.tmp 's|thinkingPhase={thinkingPhase}|thinkingPhase={getThinkingPhaseState(thinkingPhase)}|g' "$file"
        
        # Close the wrapper - handle both self-closing and regular closing tags
        # For self-closing tags ending with />
        sed -i.tmp "s|\(${component}[^>]*\)/>\$|\1/>\
            )}|g" "$file"
        
        # For components with closing tags
        sed -i.tmp "s|</${component}>|</${component}>\
            )}|g" "$file"
        
        # For multi-line self-closing (common pattern: props on multiple lines ending with />)
        sed -i.tmp '/^\s*\/>$/{
            s|^\(\s*\)\/>\s*$|\1/>\
\1)}|
        }' "$file"
        
        rm -f "${file}.tmp"
    done
    
    # Validate the changes
    if grep -q "renderThinkingOverlay(" "$file" && grep -q "getGamePhaseState" "$file"; then
        echo "  ✅ Successfully wrapped overlay in $game_name"
        rm "${file}.backup"
        return 0
    else
        echo "  ❌ Failed to wrap overlay in $game_name - restoring backup"
        mv "${file}.backup" "$file"
        return 1
    fi
}

# Apply wrappers to all files that need them
updated_count=0
failed_count=0

for file in "${FILES_NEEDING_WRAPPER[@]}"; do
    if apply_wrapper "$file"; then
        ((updated_count++))
    else
        ((failed_count++))
    fi
    echo ""
done

echo "🎉 Wrapper application complete!"
echo "✅ Successfully wrapped: $updated_count games"
echo "❌ Failed to wrap: $failed_count games"

# Final status check
final_games_with_usage=$(find src/games -name "index.tsx" -exec grep -l "renderThinkingOverlay(" {} \; | wc -l)
echo "📊 Final status: $final_games_with_usage games now have overlay toggle support"

echo ""
echo "🧪 Testing the build..."
if npm run build; then
    echo ""
    echo "🎊 COMPLETE SUCCESS! All overlay systems are now fully controllable!"
    echo ""
    echo "🎯 How to use:"
    echo "   • Enable all overlays: Set ENABLE_THINKING_OVERLAY = true in src/constants.ts"
    echo "   • Disable all overlays: Set ENABLE_THINKING_OVERLAY = false in src/constants.ts"
    echo "   • Documentation: See OVERLAY_TOGGLE_GUIDE.md"
    echo ""
    echo "🎮 Supported games with overlay toggle:"
    find src/games -name "index.tsx" -exec grep -l "renderThinkingOverlay(" {} \; | sed 's|src/games/||; s|/index.tsx||' | sort
else
    echo ""
    echo "❌ Build failed. Check the error output above."
    echo "🔧 Some manual fixes may be needed."
fi
