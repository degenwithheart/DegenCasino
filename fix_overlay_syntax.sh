#!/bin/bash

# Fix missing closing braces for renderThinkingOverlay calls
echo "🔧 Fixing malformed renderThinkingOverlay calls..."

FILES=(
    "src/games/Slide/index.tsx"
    "src/games/LuckyNumber/index.tsx" 
    "src/games/ProgressivePoker/index.tsx"
    "src/games/WheelSpin/index.tsx"
    "src/games/Keno/index.tsx"
    "src/games/CryptoChartGame/index.tsx"
    "src/games/FancyVirtualHorseRacing/index.tsx"
    "src/games/DoubleOrNothing/index.tsx"
    "src/games/DiceRoll/index.tsx"
)

for file in "${FILES[@]}"; do
    echo "📁 Fixing $file..."
    
    # Look for the pattern where renderThinkingOverlay is followed by overlay component ending with /> 
    # and then followed by closing tags without proper )}
    
    # Use sed to find renderThinkingOverlay calls that don't have proper closing
    if grep -q "renderThinkingOverlay(" "$file" && ! grep -A 20 "renderThinkingOverlay(" "$file" | grep -q ")}" ; then
        echo "  🔧 Adding missing closing parenthesis and brace..."
        
        # Create backup
        cp "$file" "${file}.fix-backup"
        
        # Find the line with renderThinkingOverlay and add proper closing
        # This is a bit complex, so let's use awk for better control
        awk '
        BEGIN { in_render_call = 0; overlay_depth = 0 }
        
        /renderThinkingOverlay\(/ {
            in_render_call = 1
            overlay_depth = 0
            print
            next
        }
        
        in_render_call && /<[A-Za-z]+Overlays/ {
            overlay_depth = 1
            print
            next
        }
        
        in_render_call && overlay_depth > 0 && /^\s*\/>/ {
            # This is the closing of the overlay component
            print
            print "      )}"
            in_render_call = 0
            overlay_depth = 0
            next
        }
        
        # Print all other lines as-is
        { print }
        ' "$file" > "${file}.tmp"
        
        mv "${file}.tmp" "$file"
        
        # Verify the fix
        if grep -A 20 "renderThinkingOverlay(" "$file" | grep -q ")}" ; then
            echo "  ✅ Fixed $file"
            rm "${file}.fix-backup"
        else
            echo "  ❌ Failed to fix $file - restoring backup"
            mv "${file}.fix-backup" "$file"
        fi
    else
        echo "  ⚠️  Already fixed or no issue in $file"
    fi
    
    echo ""
done

echo "🎉 Finished fixing renderThinkingOverlay calls"
