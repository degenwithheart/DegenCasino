#!/usr/bin/env node

// Auto-apply overlay toggle system to all remaining games
// This script uses AST parsing for more reliable code modification

const fs = require('fs');
const path = require('path');

console.log('🎮 Auto-applying overlay toggle system to all remaining games...');

// List of games that need to be updated (excluding already updated ones)
const GAMES = [
    'src/games/Slide/index.tsx',
    'src/games/LuckyNumber/index.tsx', 
    'src/games/ProgressivePoker/index.tsx',
    'src/games/Dice/index.tsx',
    'src/games/WheelSpin/index.tsx',
    'src/games/Keno/index.tsx',
    'src/games/CryptoChartGame/index.tsx',
    'src/games/BlackJack/index.tsx',
    'src/games/FancyVirtualHorseRacing/index.tsx',
    'src/games/CrashGame/index.tsx',
    'src/games/DoubleOrNothing/index.tsx',
    'src/games/Limbo/index.tsx',
    'src/games/Scissors/index.tsx',
    'src/games/DiceRoll/index.tsx',
    'src/games/HiLo/index.tsx',
    'src/games/Slots/index.tsx',
    'src/games/Mines/index.tsx',
    'src/games/Plinko/index.tsx'
];

// Import statement to add
const IMPORT_STATEMENT = "import { renderThinkingOverlay, getThinkingPhaseState, getGamePhaseState } from '../../utils/overlayUtils'";

// Function to add import statement
function addImport(filePath, content) {
    // Check if import already exists
    if (content.includes('renderThinkingOverlay')) {
        console.log(`  ⚠️  Import already exists in ${filePath}`);
        return content;
    }
    
    // Find the last import statement
    const lines = content.split('\n');
    let lastImportIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().startsWith('import ')) {
            lastImportIndex = i;
        }
    }
    
    if (lastImportIndex !== -1) {
        lines.splice(lastImportIndex + 1, 0, IMPORT_STATEMENT);
        console.log(`  ✅ Added import to ${filePath}`);
        return lines.join('\n');
    }
    
    console.log(`  ❌ Could not find import section in ${filePath}`);
    return content;
}

// Function to wrap overlay component
function wrapOverlay(filePath, content) {
    // Skip if already wrapped
    if (content.includes('renderThinkingOverlay')) {
        console.log(`  ⚠️  Overlay already wrapped in ${filePath}`);
        return content;
    }
    
    // Find overlay component usage patterns
    const overlayPatterns = [
        /<([A-Za-z]+Overlays)\s+/g,
        /<([A-Za-z]+Overlays)>/g
    ];
    
    let foundOverlay = false;
    let modifiedContent = content;
    
    for (const pattern of overlayPatterns) {
        const matches = Array.from(content.matchAll(pattern));
        
        for (const match of matches) {
            const overlayComponent = match[1];
            console.log(`    🎯 Found overlay component: ${overlayComponent}`);
            foundOverlay = true;
            
            // Find the complete overlay JSX block
            const startIndex = match.index;
            const beforeOverlay = content.substring(0, startIndex);
            const afterOverlay = content.substring(startIndex);
            
            // Find the end of the overlay component
            let depth = 0;
            let endIndex = -1;
            let inTag = false;
            let selfClosing = false;
            
            for (let i = 0; i < afterOverlay.length; i++) {
                const char = afterOverlay[i];
                
                if (char === '<') {
                    inTag = true;
                } else if (char === '>') {
                    if (afterOverlay[i-1] === '/') {
                        selfClosing = true;
                    }
                    if (inTag) {
                        if (i === afterOverlay.indexOf('>')) {
                            // This is the opening tag
                            depth = selfClosing ? 0 : 1;
                        } else if (afterOverlay.substring(i-overlayComponent.length-2, i) === `/${overlayComponent}`) {
                            depth--;
                        }
                        inTag = false;
                        
                        if (depth === 0) {
                            endIndex = i + 1;
                            break;
                        }
                    }
                }
            }
            
            if (endIndex !== -1) {
                const overlayJSX = afterOverlay.substring(0, endIndex);
                const remaining = afterOverlay.substring(endIndex);
                
                // Extract indentation
                const lines = beforeOverlay.split('\n');
                const lastLine = lines[lines.length - 1];
                const indentation = lastLine.match(/^(\s*)/)[1];
                
                // Wrap the overlay with utility functions
                let wrappedOverlay = overlayJSX;
                wrappedOverlay = wrappedOverlay.replace(/gamePhase=\{([^}]+)\}/g, 'gamePhase={getGamePhaseState($1)}');
                wrappedOverlay = wrappedOverlay.replace(/thinkingPhase=\{([^}]+)\}/g, 'thinkingPhase={getThinkingPhaseState($1)}');
                
                const wrappedContent = 
                    `${indentation}{/* Conditionally render overlay based on ENABLE_THINKING_OVERLAY */}\n` +
                    `${indentation}{renderThinkingOverlay(\n` +
                    `${indentation}  ${wrappedOverlay.trim()}\n` +
                    `${indentation})}`;
                
                modifiedContent = beforeOverlay + wrappedContent + remaining;
                break;
            }
        }
        
        if (foundOverlay) break;
    }
    
    if (foundOverlay) {
        console.log(`  ✅ Wrapped overlay in ${filePath}`);
        return modifiedContent;
    } else {
        console.log(`  ⚠️  No overlay component found in ${filePath}`);
        return content;
    }
}

// Function to process a single game file
function processGame(filePath) {
    console.log(`📁 Processing ${filePath}...`);
    
    if (!fs.existsSync(filePath)) {
        console.log(`  ❌ File not found: ${filePath}`);
        return false;
    }
    
    try {
        // Read file content
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Create backup
        fs.writeFileSync(`${filePath}.backup`, content);
        
        // Add import
        let modifiedContent = addImport(filePath, content);
        
        // Wrap overlay
        modifiedContent = wrapOverlay(filePath, modifiedContent);
        
        // Basic validation - check if we made any changes
        if (modifiedContent === content) {
            console.log(`  ⚠️  No changes made to ${filePath}`);
            fs.unlinkSync(`${filePath}.backup`);
            return false;
        }
        
        // Write modified content
        fs.writeFileSync(filePath, modifiedContent);
        
        // Clean up backup
        fs.unlinkSync(`${filePath}.backup`);
        
        console.log(`  ✅ Successfully processed ${filePath}`);
        return true;
        
    } catch (error) {
        console.log(`  ❌ Error processing ${filePath}: ${error.message}`);
        
        // Restore backup if it exists
        if (fs.existsSync(`${filePath}.backup`)) {
            fs.renameSync(`${filePath}.backup`, filePath);
            console.log(`  🔄 Restored backup for ${filePath}`);
        }
        
        return false;
    }
}

// Main processing
let updated_count = 0;
let failed_count = 0;

for (const gameFile of GAMES) {
    if (processGame(gameFile)) {
        updated_count++;
    } else {
        failed_count++;
    }
    console.log('');
}

console.log('🎉 Processing complete!');
console.log(`✅ Successfully updated: ${updated_count} games`);
console.log(`❌ Failed to update: ${failed_count} games`);

if (failed_count > 0) {
    console.log('');
    console.log('⚠️  Some games failed to update automatically.');
    console.log('📋 Please manually update the failed games using the guide in OVERLAY_TOGGLE_GUIDE.md');
}

console.log('');
console.log('🧪 Build test will be run by the shell script...');
