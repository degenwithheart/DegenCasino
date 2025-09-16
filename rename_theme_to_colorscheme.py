#!/usr/bin/env python3
"""
Theme to ColorScheme Renaming Script

This script scans the entire src/ directory and replaces all theme-related 
identifiers with colorScheme equivalents to prepare for true theme/layout separation.
"""

import os
import re
from pathlib import Path

# Complete mapping of theme identifiers to colorScheme identifiers
REPLACEMENTS = {
    # Core identifiers
    'theme': 'colorScheme',
    '$theme': '$colorScheme', 
    'currentTheme': 'currentColorScheme',
    'themeKey': 'colorSchemeKey',
    'setTheme': 'setColorScheme',
    'setThemeKey': 'setColorSchemeKey',
    'useTheme': 'useColorScheme',
    'ThemeKey': 'ColorSchemeKey',
    'GlobalTheme': 'GlobalColorScheme', 
    'globalThemes': 'globalColorSchemes',
    'themeColors': 'colorSchemeColors',
    
    # Context & Provider related
    'ThemeContext': 'ColorSchemeContext',
    'ThemeContextType': 'ColorSchemeContextType',
    'ThemeProvider': 'ColorSchemeProvider',
    'ThemeProviderProps': 'ColorSchemeProviderProps',
    'useThemeStyles': 'useColorSchemeStyles',
    
    # Storage & utilities
    'getStoredTheme': 'getStoredColorScheme',
    'setStoredTheme': 'setStoredColorScheme',
    'getThemeValue': 'getColorSchemeValue',
    'createThemeStyles': 'createColorSchemeStyles',
    'getThemeVariables': 'getColorSchemeVariables',
    'applyThemeVariables': 'applyColorSchemeVariables',
    'createThemeTransition': 'createColorSchemeTransition',
    'getThemeColor': 'getColorSchemeColor',
    
    # Component names  
    'ThemeSelector': 'ColorSchemeSelector',
    'ThemeSelectorContainer': 'ColorSchemeSelectorContainer',
    'ThemeOption': 'ColorSchemeOption',
    'ThemeName': 'ColorSchemeName',
    'ThemePreview': 'ColorSchemePreview',
    
    # Storage keys
    "'selectedTheme'": "'selectedColorScheme'",
    '"selectedTheme"': '"selectedColorScheme"',
    
    # Individual theme names (these should become color scheme names)
    'defaultTheme': 'defaultColorScheme',
    'cyberpunkTheme': 'cyberpunkColorScheme', 
    'casinoFloorTheme': 'casinoFloorColorScheme',
    'crystalTheme': 'crystalColorScheme',
    'romanticDegenTheme': 'romanticDegenColorScheme',
    'spaceTheme': 'spaceColorScheme',
    'retroTheme': 'retroColorScheme',
    'carnivalTheme': 'carnivalColorScheme',
}

# File extensions to process
TARGET_EXTENSIONS = {'.ts', '.tsx', '.js', '.jsx'}

def is_target_file(file_path):
    """Check if file should be processed based on extension."""
    return file_path.suffix.lower() in TARGET_EXTENSIONS

def replace_in_content(content, old_term, new_term):
    """
    Replace exact word matches using word boundaries.
    Handles special cases like $theme and quoted strings.
    """
    if old_term.startswith('$'):
        # Handle styled-components props like $theme
        pattern = re.escape(old_term) + r'\b'
        return re.sub(pattern, new_term, content)
    elif old_term.startswith("'") or old_term.startswith('"'):
        # Handle quoted strings exactly
        pattern = re.escape(old_term)
        return re.sub(pattern, new_term, content)
    else:
        # Handle regular identifiers with word boundaries
        pattern = r'\b' + re.escape(old_term) + r'\b'
        return re.sub(pattern, new_term, content)

def process_file(file_path):
    """Process a single file and apply all replacements."""
    try:
        # Read file content
        with open(file_path, 'r', encoding='utf-8') as f:
            original_content = f.read()
        
        modified_content = original_content
        changes_made = []
        
        # Apply all replacements
        for old_term, new_term in REPLACEMENTS.items():
            before_replacement = modified_content
            modified_content = replace_in_content(modified_content, old_term, new_term)
            
            # Count changes
            if before_replacement != modified_content:
                count = before_replacement.count(old_term) - modified_content.count(old_term)
                changes_made.append(f"{old_term} -> {new_term} ({count} times)")
        
        # Write back if changes were made
        if modified_content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(modified_content)
            
            print(f"✅ Modified: {file_path}")
            for change in changes_made:
                print(f"   {change}")
            return True
        else:
            print(f"⚪ No changes: {file_path}")
            return False
            
    except Exception as e:
        print(f"❌ Error processing {file_path}: {e}")
        return False

def scan_and_replace(src_directory):
    """Scan src directory recursively and process all target files."""
    src_path = Path(src_directory)
    
    if not src_path.exists():
        print(f"❌ Source directory not found: {src_directory}")
        return
    
    print(f"🔍 Scanning directory: {src_path.absolute()}")
    print(f"📝 Target extensions: {', '.join(TARGET_EXTENSIONS)}")
    print(f"🔄 Replacements to apply: {len(REPLACEMENTS)}")
    print("=" * 60)
    
    total_files = 0
    modified_files = 0
    
    # Walk through all files recursively
    for file_path in src_path.rglob('*'):
        if file_path.is_file() and is_target_file(file_path):
            total_files += 1
            if process_file(file_path):
                modified_files += 1
    
    print("=" * 60)
    print(f"📊 Summary:")
    print(f"   Total files scanned: {total_files}")
    print(f"   Files modified: {modified_files}")
    print(f"   Files unchanged: {total_files - modified_files}")
    print("✨ Theme to ColorScheme renaming complete!")

if __name__ == "__main__":
    # Get the script's directory and find src folder
    script_dir = Path(__file__).parent
    src_dir = script_dir / "src"
    
    print("🎨 Theme to ColorScheme Identifier Renaming Script")
    print("=" * 60)
    
    scan_and_replace(src_dir)