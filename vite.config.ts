import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

const ENV_PREFIX = ['VITE_'];

// Enhanced obfuscation options - higher intensity while React-safe
const obfuscationOptions = {
  compact: true,
  controlFlowFlattening: true, // Enable with low threshold
  controlFlowFlatteningThreshold: 0.3, // Conservative threshold
  deadCodeInjection: true, // Enable with low threshold
  deadCodeInjectionThreshold: 0.2, // Conservative threshold
  debugProtection: true,
  debugProtectionInterval: 4000,
  disableConsoleOutput: true,
  domainLock: ['degenheart.casino'], // Lock to your domain for extra security
  identifierNamesGenerator: 'hexadecimal',
  identifiersPrefix: '',
  inputFileName: '',
  log: false,
  numbersToExpressions: true, // Enable for more obfuscation
  optionsPreset: 'default',
  renameGlobals: false, // Keep false - React needs globals
  renameProperties: false, // Keep false - can break React
  reservedNames: [], // Can add React reserved names if needed
  reservedStrings: [], // Can add strings to preserve
  seed: 0,
  selfDefending: true, // Enable for anti-tampering
  simplify: true,
  sourceMap: false,
  sourceMapBaseUrl: '',
  sourceMapFileName: '',
  sourceMapMode: 'separate',
  splitStrings: true, // Enable with safe length
  splitStringsChunkLength: 10, // Longer chunks for safety
  stringArray: true,
  stringArrayCallsTransform: true,
  stringArrayCallsTransformThreshold: 0.7,
  stringArrayEncoding: ['base64', 'rc4'], // Multiple encodings
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayWrappersCount: 2,
  stringArrayWrappersChainedCalls: true,
  stringArrayWrappersParametersMaxCount: 4,
  stringArrayWrappersType: 'function',
  stringArrayThreshold: 0.8, // Higher threshold for more obfuscation
  target: 'browser',
  transformObjectKeys: false, // Keep false - can break React props
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
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
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
          // Use require for javascript-obfuscator to avoid ES module issues
          const JavaScriptObfuscator = require('javascript-obfuscator');
          
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
              
              // Skip very small files (likely just imports)
              if (code.length < 1000) {
                console.log(`⏭️ Skipped: ${file} (too small)`);
                return;
              }
              
              // Determine if this is a main app file or vendor file
              const isMainFile = file.includes('main') || file.includes('app-core') || file.includes('index');
              const isVendorFile = file.includes('vendor');
              
              // Use enhanced settings for main files, conservative for vendor
              let options = obfuscationOptions;
              if (isMainFile) {
                options = {
                  ...obfuscationOptions,
                  controlFlowFlatteningThreshold: 0.5, // Higher for main files
                  deadCodeInjectionThreshold: 0.3,
                  stringArrayThreshold: 0.9, // Very aggressive for main files
                  stringArrayCallsTransformThreshold: 0.8,
                  selfDefending: true,
                  debugProtection: true,
                  debugProtectionInterval: 2000
                };
                console.log(`🎯 Applying enhanced obfuscation to: ${file}`);
              } else if (isVendorFile) {
                options = {
                  ...obfuscationOptions,
                  controlFlowFlattening: false, // Conservative for vendor
                  deadCodeInjection: false,
                  selfDefending: false,
                  stringArrayThreshold: 0.3 // Light obfuscation for vendor
                };
                console.log(`🔧 Applying light obfuscation to vendor: ${file}`);
              }
              
              try {
                const obfuscated = JavaScriptObfuscator.obfuscate(code, options);
                const obfuscatedCode = obfuscated.getObfuscatedCode();
                
                // Verify the obfuscated code is valid
                if (obfuscatedCode && obfuscatedCode.length > 0) {
                  fs.writeFileSync(filePath, obfuscatedCode, 'utf8');
                  console.log(`✅ Obfuscated: ${file}`);
                  obfuscatedCount++;
                } else {
                  console.warn(`⚠️ Empty obfuscation result for ${file}, keeping original`);
                }
              } catch (error) {
                console.warn(`⚠️ Could not obfuscate ${file}:`, error.message);
                // Keep the original file if obfuscation fails
              }
            }
          });
          
          console.log(`🎯 Successfully obfuscated ${obfuscatedCount} files`);
        } catch (error) {
          console.warn('⚠️ Obfuscation plugin failed:', error.message);
          console.warn('Build will continue with unobfuscated code');
        }
      }
    }
  ]
}));
