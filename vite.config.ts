import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import JavaScriptObfuscator from 'javascript-obfuscator';

const ENV_PREFIX = ['VITE_'];

// Improved obfuscation options - balanced protection and stability
const obfuscationOptions = {
  compact: true,
  controlFlowFlattening: true, // Re-enabled with low threshold
  controlFlowFlatteningThreshold: 0.2, // Very conservative
  deadCodeInjection: true, // Re-enabled with low threshold
  deadCodeInjectionThreshold: 0.1, // Very conservative
  debugProtection: false, // Keep disabled for now
  debugProtectionInterval: 0,
  disableConsoleOutput: false, // Keep console for debugging
  domainLock: ['degenheart.casino', 'www.degenheart.casino'], // Re-enable domain lock
  identifierNamesGenerator: 'hexadecimal',
  numbersToExpressions: true, // Re-enabled - usually safe
  optionsPreset: 'default',
  renameGlobals: false, // Keep disabled
  renameProperties: false, // Keep disabled
  seed: 0,
  selfDefending: false, // Keep disabled for now
  simplify: true,
  sourceMap: false,
  splitStrings: true, // Re-enabled with conservative settings
  splitStringsChunkLength: 5, // Smaller chunks for safety
  stringArray: true,
  stringArrayCallsTransform: true, // Re-enabled carefully
  stringArrayCallsTransformThreshold: 0.3, // Conservative
  stringArrayEncoding: ['base64'], // Single encoding method for safety
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayWrappersCount: 1, // Reduced for safety
  stringArrayWrappersChainedCalls: false, // Keep disabled
  stringArrayWrappersParametersMaxCount: 2,
  stringArrayWrappersType: 'variable', // Safer than function
  stringArrayThreshold: 0.5, // Moderate usage
  target: 'browser',
  transformObjectKeys: false, // Keep disabled
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
          // Type assertion to bypass TypeScript typing issues
          const obfuscator = JavaScriptObfuscator as any;
          
          if (!obfuscator || !obfuscator.obfuscate) {
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

              if (code.length < 1500) { // Reasonable threshold
                console.log(`⏭️ Skipped: ${file} (too small)`);
                return;
              }

              // Categorize files for different obfuscation levels
              const isVendorFile = file.includes('vendor');
              const isMainFile = file.includes('main') || file.includes('app');
              const isGameFile = file.includes('game') || file.includes('Game');
              const isUtilFile = file.includes('util') || file.includes('hook') || file.includes('component');

              let options = { ...obfuscationOptions };
              let obfuscationType = 'standard';

              if (isVendorFile) {
                // Minimal obfuscation for vendor files (external libraries)
                options = {
                  ...obfuscationOptions,
                  controlFlowFlattening: false,
                  deadCodeInjection: false,
                  stringArrayCallsTransform: false,
                  stringArrayThreshold: 0.2,
                  splitStrings: false,
                  stringArrayEncoding: []
                };
                obfuscationType = 'minimal';
                console.log(`🔧 Applying minimal obfuscation to vendor: ${file}`);
              } else if (isMainFile) {
                // Enhanced obfuscation for main app files
                options = {
                  ...obfuscationOptions,
                  controlFlowFlatteningThreshold: 0.3,
                  deadCodeInjectionThreshold: 0.15,
                  stringArrayThreshold: 0.7,
                  stringArrayCallsTransformThreshold: 0.5,
                  splitStringsChunkLength: 3
                };
                obfuscationType = 'enhanced';
                console.log(`🎯 Applying enhanced obfuscation to main: ${file}`);
              } else if (isGameFile) {
                // Moderate obfuscation for game logic files
                options = {
                  ...obfuscationOptions,
                  controlFlowFlatteningThreshold: 0.25,
                  deadCodeInjectionThreshold: 0.12,
                  stringArrayThreshold: 0.6,
                  stringArrayCallsTransformThreshold: 0.4
                };
                obfuscationType = 'moderate';
                console.log(`🎮 Applying moderate obfuscation to game: ${file}`);
              } else {
                // Standard obfuscation for utility files
                console.log(`🔧 Applying standard obfuscation to: ${file}`);
              }

              try {
                const obfuscated = obfuscator.obfuscate(code, options);
                const obfuscatedCode = obfuscated.getObfuscatedCode();

                if (obfuscatedCode && obfuscatedCode.length > 0 && obfuscatedCode !== code) {
                  fs.writeFileSync(filePath, obfuscatedCode, 'utf8');
                  console.log(`✅ Obfuscated (${obfuscationType}): ${file}`);
                  obfuscatedCount++;
                } else {
                  console.warn(`⚠️ Obfuscation produced no changes for ${file}, keeping original`);
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
