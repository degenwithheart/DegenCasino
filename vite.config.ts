import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

const ENV_PREFIX = ['VITE_'];

// Safe obfuscation options that won't break React
const obfuscationOptions = {
  compact: true,
  controlFlowFlattening: false, // Keep false - breaks React
  deadCodeInjection: false, // Keep false - can break React
  debugProtection: false, // Keep false for now
  disableConsoleOutput: true,
  identifierNamesGenerator: 'mangled-shuffled',
  log: false,
  renameGlobals: false, // Keep false - React needs globals
  selfDefending: false, // Keep false - can break in production
  simplify: true,
  splitStrings: false, // Keep false - can break JSX
  stringArray: true,
  stringArrayEncoding: ['base64'],
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayThreshold: 0.5, // Moderate threshold
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
              
              try {
                const obfuscated = JavaScriptObfuscator.obfuscate(code, obfuscationOptions);
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
