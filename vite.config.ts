import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
const JavaScriptObfuscator = require('javascript-obfuscator');

const ENV_PREFIX = ['VITE_'];

const obfuscationOptions = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.9,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.4,
  stringArray: true,
  stringArrayEncoding: ['base64'],
  stringArrayThreshold: 0.9,
  rotateStringArray: true,
  shuffleStringArray: true,
  simplify: true,
  transformObjectKeys: true,
  renameGlobals: false,
  disableConsoleOutput: true,
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
          if (id.includes('node_modules')) return 'vendor';
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
      name: 'obfuscate-js',
      closeBundle() {
        const dir = path.resolve(__dirname, 'dist/assets');
        fs.readdirSync(dir).forEach(file => {
          if (file.endsWith('.js')) {
            const filePath = path.join(dir, file);
            const code = fs.readFileSync(filePath, 'utf8');
            const obfuscated = JavaScriptObfuscator.obfuscate(code, obfuscationOptions);
            fs.writeFileSync(filePath, obfuscated.getObfuscatedCode(), 'utf8');
          }
        });
      }
    }
  ]
}));
