#!/usr/bin/env node

// Quick fix for malformed renderThinkingOverlay calls
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing malformed renderThinkingOverlay calls...');

// Files that likely have the issue based on the build errors
const FILES_TO_FIX = [
    'src/games/DoubleOrNothing/index.tsx',
    'src/games/LuckyNumber/index.tsx',
    'src/games/ProgressivePoker/index.tsx',
    'src/games/WheelSpin/index.tsx',
    'src/games/Keno/index.tsx',
    'src/games/FancyVirtualHorseRacing/index.tsx',
    'src/games/DiceRoll/index.tsx'
];

function fixFile(filePath) {
    console.log(`📁 Fixing ${filePath}...`);
    
    if (!fs.existsSync(filePath)) {
        console.log(`  ❌ File not found: ${filePath}`);
        return false;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Create backup
    fs.writeFileSync(`${filePath}.fixbackup`, content);
    
    // Pattern to match renderThinkingOverlay calls that don't have proper closing
    // Look for renderThinkingOverlay( followed by overlay component ending with /> 
    // but not followed by )}
    
    const lines = content.split('\n');
    let inRenderCall = false;
    let renderCallLineIndex = -1;
    let overlayEndLineIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if (line.includes('renderThinkingOverlay(')) {
            inRenderCall = true;
            renderCallLineIndex = i;
        }
        
        if (inRenderCall && line.trim() === '/>') {
            overlayEndLineIndex = i;
            // Check if the next few lines have )}
            let hasProperClosing = false;
            for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
                if (lines[j].includes(')}')) {
                    hasProperClosing = true;
                    break;
                }
            }
            
            if (!hasProperClosing) {
                // Add the closing
                lines.splice(i + 1, 0, '        )}');
                console.log(`  ✅ Added closing )} after line ${i + 1} in ${filePath}`);
                break;
            }
            
            inRenderCall = false;
        }
    }
    
    const newContent = lines.join('\n');
    
    if (newContent !== content) {
        fs.writeFileSync(filePath, newContent);
        console.log(`  ✅ Fixed ${filePath}`);
        fs.unlinkSync(`${filePath}.fixbackup`);
        return true;
    } else {
        console.log(`  ⚠️  No changes needed for ${filePath}`);
        fs.unlinkSync(`${filePath}.fixbackup`);
        return false;
    }
}

let fixedCount = 0;

for (const file of FILES_TO_FIX) {
    if (fixFile(file)) {
        fixedCount++;
    }
}

console.log(`\n🎉 Fixed ${fixedCount} files`);
console.log('🧪 You can now run npm run build to test');
