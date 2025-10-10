#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Get command line arguments
const args = process.argv.slice(2);
const command = args[0] || 'dev';

console.log('🔧 Attempting to use rolldown-vite...');

function tryRolldownVite() {
    return new Promise((resolve) => {
        try {
            // Check if rolldown-vite is available and working
            const viteProcess = spawn('npx', ['rolldown-vite', '--version'], {
                cwd: projectRoot,
                stdio: 'pipe'
            });

            let output = '';
            viteProcess.stdout.on('data', (data) => {
                output += data.toString();
            });

            viteProcess.stderr.on('data', (data) => {
                output += data.toString();
            });

            viteProcess.on('close', (code) => {
                if (code === 0) {
                    console.log('✅ rolldown-vite is available and working');
                    console.log('📦 Version:', output.trim());
                    resolve(true);
                } else {
                    console.log('⚠️  rolldown-vite not detected or not working properly');
                    resolve(false);
                }
            }); viteProcess.on('error', (error) => {
                console.log('❌ Error checking rolldown-vite:', error.message);
                resolve(false);
            });

            // Timeout after 10 seconds
            setTimeout(() => {
                viteProcess.kill();
                console.log('⏰ Timeout checking rolldown-vite');
                resolve(false);
            }, 10000);

        } catch (error) {
            console.log('❌ Failed to check rolldown-vite:', error.message);
            resolve(false);
        }
    });
}

function runWithFallback(useRolldown) {
    const viteCommand = useRolldown ? 'rolldown-vite' : 'vite';
    const fullArgs = [viteCommand, ...args];

    console.log(useRolldown ?
        '🚀 Starting with rolldown-vite...' :
        '🔄 Falling back to regular Vite (rollup)...');

    console.log('💻 Command:', 'npx', fullArgs.join(' ')); const viteProcess = spawn('npx', fullArgs, {
        cwd: projectRoot,
        stdio: 'inherit',
        env: {
            ...process.env,
            FORCE_COLOR: '1',
            // Set environment variable to indicate which version we're using
            VITE_BUNDLER: useRolldown ? 'rolldown' : 'rollup'
        }
    });

    viteProcess.on('close', (code) => {
        if (code !== 0 && useRolldown) {
            console.log('\n❌ rolldown-vite failed, trying fallback...');
            runWithFallback(false);
        } else {
            process.exit(code);
        }
    });

    viteProcess.on('error', (error) => {
        console.error('❌ Process error:', error.message);
        if (useRolldown) {
            console.log('🔄 Trying fallback...');
            runWithFallback(false);
        } else {
            process.exit(1);
        }
    });

    // Handle process termination
    process.on('SIGINT', () => {
        viteProcess.kill('SIGINT');
    });

    process.on('SIGTERM', () => {
        viteProcess.kill('SIGTERM');
    });
}

// Environment detection for Vercel Edge
function isVercelEdge() {
    return process.env.VERCEL || process.env.VERCEL_ENV || process.env.VERCEL_URL;
}

// Main execution
async function main() {
    if (isVercelEdge()) {
        console.log('🌐 Vercel environment detected');
        // In Vercel, be more conservative and prefer stability
        console.log('🔒 Using stable Vite (rollup) for deployment reliability');
        runWithFallback(false);
    } else {
        // Local development - try rolldown-vite first
        const rolldownAvailable = await tryRolldownVite();
        runWithFallback(rolldownAvailable);
    }
}

main().catch(console.error);