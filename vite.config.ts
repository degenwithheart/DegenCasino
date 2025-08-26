import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

// Dynamic import for javascript-obfuscator to avoid ES module issues
let JavaScriptObfuscator: any;

const ENV_PREFIX = ['VITE_'];

const obfuscationOptions = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.75,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.4,
  debugProtection: true,
  debugProtectionInterval: 4000,
  disableConsoleOutput: true,
  identifierNamesGenerator: 'hexadecimal',
  log: false,
  numbersToExpressions: true,
  renameGlobals: false,
  selfDefending: true,
  simplify: true,
  splitStrings: true,
  splitStringsChunkLength: 5,
  stringArray: true,
  stringArrayCallsTransform: true,
  stringArrayEncoding: ['base64'],
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayWrappersCount: 5,
  stringArrayWrappersChainedCalls: true,
  stringArrayWrappersParametersMaxCount: 5,
  stringArrayWrappersType: 'function',
  stringArrayThreshold: 0.75,
  transformObjectKeys: true,
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
    include: ['buffer','crypto-browserify','stream-browserify','util'],
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
          // Keep core app files together for better obfuscation
          if (id.includes('src/App.tsx') || id.includes('src/index.tsx')) {
            return 'app-core';
          }
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        // Ensure consistent naming for obfuscation detection
        entryFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId;
          if (facadeModuleId && (facadeModuleId.includes('index.tsx') || facadeModuleId.includes('main'))) {
            return 'assets/main-[hash].js';
          }
          return 'assets/[name]-[hash].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
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
      name: 'obfuscate-js',
      async closeBundle() {
        // Dynamic import to avoid ES module issues
        if (!JavaScriptObfuscator) {
          try {
            JavaScriptObfuscator = (await import('javascript-obfuscator')).default;
          } catch (error) {
            console.warn('⚠️ javascript-obfuscator not available, skipping obfuscation');
            return;
          }
        }

        const dir = path.resolve(__dirname, 'dist/assets');
        if (!fs.existsSync(dir)) return;
        
        fs.readdirSync(dir).forEach(file => {
          if (file.endsWith('.js')) {
            const filePath = path.join(dir, file);
            const code = fs.readFileSync(filePath, 'utf8');
            
            // Enhanced obfuscation for main app files
            const isMainFile = file.includes('index') || file.includes('main') || code.includes('ReactDOM') || code.includes('App');
            const options = isMainFile ? {
              ...obfuscationOptions,
              debugProtection: true,
              debugProtectionInterval: 2000,
              selfDefending: true,
              controlFlowFlatteningThreshold: 0.9,
              stringArrayThreshold: 0.9,
            } : obfuscationOptions;
            
            try {
              const obfuscated = JavaScriptObfuscator.obfuscate(code, options);
              fs.writeFileSync(filePath, obfuscated.getObfuscatedCode(), 'utf8');
              console.log(`✅ Obfuscated: ${file} ${isMainFile ? '(enhanced)' : ''}`);
            } catch (error) {
              console.warn(`⚠️ Could not obfuscate ${file}:`, error.message);
            }
          }
        });
      }
    }
  ]
}));
