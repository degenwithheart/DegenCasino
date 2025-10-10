#!/usr/bin/env node
/**
 * Post-build mobile sync script
 * Automatically syncs mobile app if ENABLE_MOBILE_APP flag is true
 * Used by npm run build and npm run build:compress
 */

import fs from 'fs';
import { exec, execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkMobileAppFlag() {
    try {
        const constantsPath = path.join(__dirname, '..', 'src', 'constants.ts');

        if (!fs.existsSync(constantsPath)) {
            log('⚠️  Constants file not found, skipping mobile sync', 'yellow');
            return false;
        }

        const constantsContent = fs.readFileSync(constantsPath, 'utf8');
        const match = constantsContent.match(/ENABLE_MOBILE_APP\s*=\s*(true|false)/);

        if (!match) {
            log('⚠️  ENABLE_MOBILE_APP flag not found, skipping mobile sync', 'yellow');
            return false;
        }

        return match[1] === 'true';
    } catch (error) {
        log(`❌ Error checking mobile app flag: ${error.message}`, 'red');
        return false;
    }
}

function syncMobileApp() {
    try {
        const quickSyncPath = path.join(__dirname, '..', 'mobile-app', 'quick-sync.sh');

        if (!fs.existsSync(quickSyncPath)) {
            log('❌ Mobile app quick-sync script not found', 'red');
            return false;
        }

        log('\n🚀 Auto-syncing mobile app...', 'cyan');

        // Execute the quick sync script
        execSync(`"${quickSyncPath}"`, {
            stdio: 'inherit',
            cwd: path.dirname(quickSyncPath)
        });

        return true;

    } catch (error) {
        log(`❌ Mobile app sync failed: ${error.message}`, 'red');
        return false;
    }
}

function main() {
    log('\n📱 Checking mobile app auto-sync...', 'blue');

    const shouldSync = checkMobileAppFlag();

    if (shouldSync) {
        log('✅ ENABLE_MOBILE_APP = true, proceeding with auto-sync', 'green');
        syncMobileApp();
    } else {
        log('⏭️  ENABLE_MOBILE_APP = false, skipping mobile sync', 'yellow');
    }
}

// Run the script
main();