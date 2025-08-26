import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

// Dynamic import for javascript-obfuscator to avoid ES module issues
let JavaScriptObfuscator: any;

const ENV_PREFIX = ['VITE_'];

const obfuscationOptions = {
  compact: true,
  controlFlowFlattening: false, // Disabled - breaks React
  deadCodeInjection: false, // Disabled - can break React components
  disableConsoleOutput: true,
  identifierNamesGenerator: 'hexadecimal',
  log: false,
  renameGlobals: false, // Critical - keeps React globals intact
  selfDefending: false, // Disabled - can interfere with React
  simplify: true,
  stringArray: true,
  stringArrayEncoding: ['base64', 'rc4'],
  stringArrayThreshold: 0.5, // Reduced to avoid breaking JSX
  transformObjectKeys: false, // Disabled - breaks React props
  unicodeEscapeSequence: false,
  // React-safe reserved names
  reservedNames: [
    'React', 'ReactDOM', 'createElement', 'Component', 'PureComponent',
    'Fragment', 'StrictMode', 'Suspense', 'useState', 'useEffect', 
    'useContext', 'useReducer', 'useCallback', 'useMemo', 'useRef',
    'useImperativeHandle', 'useLayoutEffect', 'useDebugValue',
    'createRoot', 'render', 'unmountComponentAtNode', 'findDOMNode',
    'jsx', 'jsxs', 'jsxDEV', 'div', 'span', 'p', 'h1', 'h2', 'h3', 'button', 'input'
  ]
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
      closeBundle() {
        // Temporarily disabled to fix React issues
        console.log('⚠️ Obfuscation temporarily disabled for debugging');
        return;
        
        // TODO: Re-enable with React-safe settings
        /*
        const obfuscator = await import('javascript-obfuscator');
        JavaScriptObfuscator = obfuscator.default;
        
        if (!JavaScriptObfuscator) {
          console.warn('⚠️ Could not load javascript-obfuscator');
          return;
        }

        const dir = path.resolve(__dirname, 'dist/assets');
        if (!fs.existsSync(dir)) return;
        
        fs.readdirSync(dir).forEach(file => {
          if (file.endsWith('.js')) {
            const filePath = path.join(dir, file);
            const code = fs.readFileSync(filePath, 'utf8');
            
            // Use React-safe obfuscation for all files
            try {
              const obfuscated = JavaScriptObfuscator.obfuscate(code, obfuscationOptions);
              fs.writeFileSync(filePath, obfuscated.getObfuscatedCode(), 'utf8');
              console.log(`✅ Obfuscated: ${file}`);
            } catch (error) {
              console.warn(`⚠️ Could not obfuscate ${file}:`, error.message);
              // If obfuscation fails, keep the original file
            }
          }
        });
        */
      }
    }
  ]
}));
