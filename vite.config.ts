import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import JavaScriptObfuscator from 'javascript-obfuscator';

const ENV_PREFIX = ['VITE_'];

// Enhanced obfuscation options
const obfuscationOptions = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.3,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.2,
  debugProtection: true,
  debugProtectionInterval: 4000,
  disableConsoleOutput: true,
  domainLock: ['degenheart.casino'],
  identifierNamesGenerator: 'hexadecimal',
  numbersToExpressions: true,
  optionsPreset: 'default',
  renameGlobals: false,
  renameProperties: false,
  seed: 0,
  selfDefending: true,
  simplify: true,
  sourceMap: false,
  splitStrings: true,
  splitStringsChunkLength: 10,
  stringArray: true,
  stringArrayCallsTransform: true,
  stringArrayCallsTransformThreshold: 0.7,
  stringArrayEncoding: ['base64', 'rc4'],
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayWrappersCount: 2,
  stringArrayWrappersChainedCalls: true,
  stringArrayWrappersParametersMaxCount: 4,
  stringArrayWrappersType: 'function',
  stringArrayThreshold: 0.8,
  target: 'browser',
  transformObjectKeys: false,
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
        drop_console: true, // Remove console logs
        drop_debugger: true, // Remove debugger statements
        pure_funcs: ['console.log', 'console.info', 'console.debug'], // Remove specific console methods
        passes: 3, // Multiple compression passes
        reduce_vars: true,
        reduce_funcs: true,
        conditionals: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
        loops: true,
        properties: true,
        sequences: true,
        unused: true,
        hoist_funs: true,
        hoist_props: true,
        hoist_vars: false,
        inline: 3
      },
      mangle: {
        toplevel: true,
        safari10: true,
        properties: {
          regex: /^_/ // Mangle properties starting with underscore
        }
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

              if (code.length < 100) {
                console.log(`⏭️ Skipped: ${file} (too small)`);
                return;
              }

              const isMainFile = file.includes('main') || file.includes('app-core') || file.includes('index');
              const isVendorFile = file.includes('vendor');

              let options = obfuscationOptions;
              if (isMainFile) {
                options = {
                  ...obfuscationOptions,
                  controlFlowFlatteningThreshold: 0.5,
                  deadCodeInjectionThreshold: 0.3,
                  stringArrayThreshold: 0.9,
                  stringArrayCallsTransformThreshold: 0.8,
                  selfDefending: true,
                  debugProtection: true,
                  debugProtectionInterval: 2000
                };
                console.log(`🎯 Applying enhanced obfuscation to: ${file}`);
              } else if (isVendorFile) {
                options = {
                  ...obfuscationOptions,
                  controlFlowFlattening: false,
                  deadCodeInjection: false,
                  selfDefending: false,
                  stringArrayThreshold: 0.3
                };
                console.log(`🔧 Applying light obfuscation to vendor: ${file}`);
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
