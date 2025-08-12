#!/bin/bash

# Simple find-and-replace approach for overlay wrapping
# This script specifically targets the common patterns we found

echo "🎮 Applying overlay wrappers to all games with simple replacements..."

# Array of files that need updating
FILES=(
    "src/games/BlackJack/index.tsx"
    "src/games/Plinko/index.tsx"
    "src/games/HiLo/index.tsx" 
    "src/games/DiceRoll/index.tsx"
    "src/games/Scissors/index.tsx"
    "src/games/Limbo/index.tsx"
    "src/games/Mines/index.tsx"
    "src/games/WheelSpin/index.tsx"
    "src/games/Keno/index.tsx"
    "src/games/CryptoChartGame/index.tsx"
    "src/games/FancyVirtualHorseRacing/index.tsx"
    "src/games/CrashGame/index.tsx"
    "src/games/DoubleOrNothing/index.tsx"
    "src/games/LuckyNumber/index.tsx"
    "src/games/ProgressivePoker/index.tsx"
    "src/games/Slide/index.tsx"
    "src/games/Slots/index.tsx"
)

# Function to process a single file
process_file() {
    local file="$1"
    local basename=$(basename "$file" .tsx)
    local game_name=$(basename $(dirname "$file"))
    
    echo "📁 Processing $game_name ($file)..."
    
    # Skip if already processed
    if grep -q "renderThinkingOverlay" "$file"; then
        echo "  ⚠️  Already processed: $file"
        return 0
    fi
    
    # Create backup
    cp "$file" "${file}.backup"
    
    # Read the file and apply transformations using Node.js for more reliable text processing
    node -e "
    const fs = require('fs');
    const filePath = process.argv[1];
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Update comment
    content = content.replace(
        /{\/\* Add the overlay component \*\/}/g,
        '{/* Add the overlay component - conditionally rendered based on ENABLE_THINKING_OVERLAY */}'
    );
    
    // Find and wrap overlay components
    // Pattern for standard overlay components
    const overlayPatterns = [
        /<([A-Za-z]+Overlays)\\s+/g,
        /<([A-Za-z]+Overlays)>/g
    ];
    
    let foundOverlay = false;
    
    for (const pattern of overlayPatterns) {
        const matches = [...content.matchAll(pattern)];
        for (const match of matches) {
            const componentName = match[1];
            console.log('  🎯 Found overlay component:', componentName);
            foundOverlay = true;
            
            // Replace the opening tag
            const openingRegex = new RegExp(\`<\${componentName}\\\\s*\`, 'g');
            content = content.replace(openingRegex, \`{renderThinkingOverlay(\\n              <\${componentName} \`);
            
            // Update props
            content = content.replace(/gamePhase=\\{gamePhase\\}/g, 'gamePhase={getGamePhaseState(gamePhase)}');
            content = content.replace(/thinkingPhase=\\{thinkingPhase\\}/g, 'thinkingPhase={getThinkingPhaseState(thinkingPhase)}');
            
            // Find and replace the closing part
            // Look for either self-closing /> or closing tag
            const selfClosingRegex = new RegExp(\`(<\${componentName}[^>]*?)/>(?!\\\\))\`, 'g');
            content = content.replace(selfClosingRegex, \`\\$1/>\\n            )}\`);
            
            const closingTagRegex = new RegExp(\`<\/\${componentName}>\`, 'g');
            content = content.replace(closingTagRegex, \`</\${componentName}>\\n            )}\`);
        }
    }
    
    // Special case for inline overlays (like Slots)
    if (content.includes('thinking-overlay')) {
        console.log('  🎯 Found inline thinking-overlay');
        foundOverlay = true;
        
        // Wrap thinking overlay divs
        content = content.replace(
            /{gamePhase === 'thinking' && thinkingPhase && \\(/g,
            '{renderThinkingOverlay(gamePhase === \\'thinking\\' && getThinkingPhaseState(thinkingPhase) && ('
        );
        
        // Update gamePhase references in conditions
        content = content.replace(/gamePhase === 'thinking'/g, \"getGamePhaseState(gamePhase) === 'thinking'\");
        content = content.replace(/gamePhase === 'dramatic'/g, \"getGamePhaseState(gamePhase) === 'dramatic'\");
        content = content.replace(/gamePhase === 'celebrating'/g, \"getGamePhaseState(gamePhase) === 'celebrating'\");
        content = content.replace(/gamePhase === 'mourning'/g, \"getGamePhaseState(gamePhase) === 'mourning'\");
    }
    
    if (!foundOverlay) {
        console.log('  ❌ No overlay component found');
        process.exit(1);
    }
    
    fs.writeFileSync(filePath, content);
    console.log('  ✅ Successfully processed');
    " "$file"
    
    local exit_code=$?
    
    if [ $exit_code -eq 0 ]; then
        # Clean up backup
        rm "${file}.backup"
        return 0
    else
        # Restore backup
        echo "  🔄 Restoring backup for $game_name"
        mv "${file}.backup" "$file"
        return 1
    fi
}

# Process all files
updated_count=0
failed_count=0

for file in "${FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ File not found: $file"
        ((failed_count++))
        continue
    fi
    
    if process_file "$file"; then
        ((updated_count++))
    else
        ((failed_count++))
    fi
    
    echo ""
done

echo "🎉 Processing complete!"
echo "✅ Successfully updated: $updated_count games"
echo "❌ Failed to update: $failed_count games"

echo ""
echo "🧪 Testing the build..."
if npm run build; then
    echo ""
    echo "✅ BUILD SUCCESS! All games now support overlay toggle!"
    echo "🎯 Control all overlays with ENABLE_THINKING_OVERLAY in src/constants.ts"
    echo "📚 See OVERLAY_TOGGLE_GUIDE.md for documentation"
else
    echo ""
    echo "❌ Build failed. Manual fixes may be needed."
fi
