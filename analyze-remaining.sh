#!/bin/bash

# Extract styles for the remaining component folders
# Connection and Modal are already done

echo "🎨 Extracting styles for remaining components..."

cd src/components

# Process AllGamesModal - it has multiple files
echo "📁 Processing AllGamesModal..."
if [ -f "AllGamesModal/AllGamesModal.tsx" ]; then
    echo "   Found AllGamesModal.tsx, extracting styles..."
    
    # Check what styled components exist
    echo "   Styled components found:"
    grep -n "const.*styled\." AllGamesModal/AllGamesModal.tsx | head -5
    
    # Manual extraction needed - let's check the file structure first
    echo "   Files in AllGamesModal:"
    ls -la AllGamesModal/
fi

echo ""

# Process Bonus folder
echo "📁 Processing Bonus..."
if [ -d "Bonus" ]; then
    echo "   Files in Bonus:"
    ls -la Bonus/
    
    # Check for styled components
    for file in Bonus/*.tsx; do
        if [ -f "$file" ]; then
            count=$(grep -c "styled\." "$file" 2>/dev/null || echo "0")
            if [ "$count" -gt 0 ]; then
                echo "   $file has $count styled components"
            fi
        fi
    done
fi

echo ""

# Process Cache folder  
echo "📁 Processing Cache..."
if [ -d "Cache" ]; then
    echo "   Files in Cache:"
    ls -la Cache/
    
    # Check for styled components
    for file in Cache/*.tsx; do
        if [ -f "$file" ]; then
            count=$(grep -c "styled\." "$file" 2>/dev/null || echo "0")
            if [ "$count" -gt 0 ]; then
                echo "   $file has $count styled components"
            fi
        fi
    done
fi

echo ""

# Process Game folder
echo "📁 Processing Game..."
if [ -d "Game" ]; then
    echo "   Files in Game:"
    ls -la Game/
    
    # Check for styled components
    for file in Game/*.tsx; do
        if [ -f "$file" ]; then
            count=$(grep -c "styled\." "$file" 2>/dev/null || echo "0")
            if [ "$count" -gt 0 ]; then
                echo "   $file has $count styled components"
            fi
        fi
    done
fi

echo ""
echo "🔍 Analysis complete. Which folder would you like to extract next?"
