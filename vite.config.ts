import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import * as JavaScriptObfuscator from 'javascript-obfuscator';

const ENV_PREFIX = ['VITE_'];

// Safe obfuscation options - much lighter to avoid breaking code
const obfuscationOptions = {
  compact: true,
  controlFlowFlattening: false, // Disabled - can break complex code
  controlFlowFlatteningThreshold: 0,
  deadCodeInjection: false, // Disabled - can break functionality
  deadCodeInjectionThreshold: 0,
  debugProtection: false, // Disabled - too aggressive
  debugProtectionInterval: 0,
  disableConsoleOutput: false, // Keep console for debugging
  // domainLock: [], // Disabled for now
  identifierNamesGenerator: 'hexadecimal',
  numbersToExpressions: false, // Disabled - can break arithmetic
  optionsPreset: 'default',
  renameGlobals: false, // Don't rename globals
  renameProperties: false, // Don't rename properties
  seed: 0,
  selfDefending: false, // Disabled - too aggressive
  simplify: true,
  sourceMap: false,
  splitStrings: false, // Disabled - can break string operations
  splitStringsChunkLength: 10,
  stringArray: true, // Basic string obfuscation only
  stringArrayCallsTransform: false, // Disabled - can break function calls
  stringArrayCallsTransformThreshold: 0,
  stringArrayEncoding: [], // No encoding for now
  stringArrayIndexShift: false,
  stringArrayRotate: false,
  stringArrayShuffle: false,
  stringArrayWrappersCount: 1,
  stringArrayWrappersChainedCalls: false,
  stringArrayWrappersParametersMaxCount: 2,
  stringArrayWrappersType: 'variable',
  stringArrayThreshold: 0.3, // Very light string array usage
  target: 'browser',
  transformObjectKeys: false, // Don't transform object keys
  unicodeEscapeSequence: false
};

export default defineConfig(() => ({
  envPrefix: ENV_PREFIX,
  server: { 
    port: 4001,
    host: true,
    hmr: { overlay: false },
    open: false,
    watch: { usePolling: true, interval: 100 },
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type','Authorization'],
    },
  },
  assetsInclude: ["**/*.glb"],
  define: {
    'process.env.ANCHOR_BROWSER': true,
    global: 'globalThis',
  },
  resolve: {
    alias: {
      buffer: 'buffer',
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      util: 'util',
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'buffer','crypto-browserify','stream-browserify','util'],
    esbuildOptions: { define: { global: 'globalThis' } }
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 4096,
    target: 'es2017',
    cssTarget: 'chrome61',
    minify: 'terser', // Switch to terser for more aggressive minification
    sourcemap: false,
    terserOptions: {
      compress: {
        drop_console: false, // Keep console logs for debugging
        drop_debugger: true, // Remove debugger statements
        pure_funcs: [], // Don't remove any functions
        passes: 2, // Reduce compression passes
        reduce_vars: true,
        reduce_funcs: true,
        conditionals: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
        loops: true,
        properties: false, // Don't optimize properties to avoid breaking code
        sequences: true,
        unused: true,
        hoist_funs: true,
        hoist_props: false, // Don't optimize property hoisting
        hoist_vars: false,
        inline: 1 // Reduce inline level
      },
      mangle: {
        toplevel: false, // Don't mangle top-level names
        safari10: true,
        properties: false // Don't mangle properties to avoid breaking code
      },
      format: {
        comments: true, // Remove all comments
        beautify: false,
        semicolons: false,
        shebang: false
      }
    },
    cssMinify: 'lightningcss', // Use Lightning CSS for faster CSS minification
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        compact: true, // Minimize output size
        generatedCode: {
          arrowFunctions: true,
          constBindings: true,
          objectShorthand: true
        }
      }
    },
    reportCompressedSize: false, // Skip gzip size reporting for faster builds
    assetsInlineLimit: 8192 // Inline assets smaller than 8KB
  },
  plugins: [
    react({ jsxRuntime: 'automatic' }),

    {
      name: 'ignore-api-routes',
      configureServer(server) {
        server.middlewares.use('/api', (req, res, next) => {
          res.statusCode = 404;
          res.end('API routes not available in development');
        });
      }
    },
    {
      name: 'safe-obfuscate-js',
      closeBundle() {
        try {
          if (!JavaScriptObfuscator) {
            console.warn('⚠️ Could not load javascript-obfuscator, skipping obfuscation');
            return;
          }

          const dir = path.resolve(__dirname, 'dist/assets');
          if (!fs.existsSync(dir)) {
            console.warn('⚠️ Assets directory not found, skipping obfuscation');
            return;
          }

          let obfuscatedCount = 0;
          fs.readdirSync(dir).forEach(file => {
            if (file.endsWith('.js')) {
              const filePath = path.join(dir, file);
              const code = fs.readFileSync(filePath, 'utf8');

              if (code.length < 2000) { // Increased threshold to avoid small critical files
                console.log(`⏭️ Skipped: ${file} (too small)`);
                return;
              }

              // Only apply light obfuscation to non-critical files
              const isVendorFile = file.includes('vendor');
              const isCriticalFile = file.includes('main') || file.includes('app') || file.includes('core');
              
              if (isCriticalFile) {
                console.log(`⏭️ Skipped: ${file} (critical file - avoiding obfuscation)`);
                return;
              }

              let options = { ...obfuscationOptions };
              if (isVendorFile) {
                // Extra light settings for vendor files
                options = {
                  ...obfuscationOptions,
                  stringArray: false, // Disable even string array for vendor
                  stringArrayThreshold: 0,
                  compact: true,
                  simplify: false
                };
                console.log(`🔧 Applying minimal obfuscation to vendor: ${file}`);
              } else {
                console.log(`🔧 Applying light obfuscation to: ${file}`);
              }

              try {
                const obfuscated = JavaScriptObfuscator.obfuscate(code, options);
                const obfuscatedCode = obfuscated.getObfuscatedCode();

                if (obfuscatedCode && obfuscatedCode.length > 0) {
                  fs.writeFileSync(filePath, obfuscatedCode, 'utf8');
                  console.log(`✅ Obfuscated: ${file}`);
                  obfuscatedCount++;
                } else {
                  console.warn(`⚠️ Empty obfuscation result for ${file}, keeping original`);
                }
              } catch (error) {
                console.warn(`⚠️ Could not obfuscate ${file}:`, error.message);
                console.warn('Keeping original file to prevent breakage');
              }
            }
          });

          console.log(`🎯 Successfully obfuscated ${obfuscatedCount} files (safe mode)`);
        } catch (error) {
          console.warn('⚠️ Obfuscation plugin failed:', error.message);
          console.warn('Build will continue with unobfuscated code');
        }
      }
    }
  ]
}));
