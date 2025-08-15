import fs from 'fs-extra';
import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Existing config preserved, enhancements for mobile/dev experience and performance below

const ENV_PREFIX = ['VITE_'];

export default defineConfig(() => ({
  envPrefix: ENV_PREFIX,
  server: { 
    port: 4001, 
    host: true, // Enable LAN/mobile device testing
    middlewareMode: false,
    hmr: {
      overlay: false,
    },
    open: false,
    // Use polling instead of fsevents to avoid compatibility issues
    watch: {
      usePolling: true,
      interval: 100,
    },
    // CORS enabled for mobile device/dev tools testing
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }
  },
  assetsInclude: ["**/*.glb"],
  define: {
    'process.env.ANCHOR_BROWSER': true,
    global: 'globalThis',
  },
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      util: 'util',
    },
  },
  optimizeDeps: {
    include: ['buffer', 'crypto-browserify', 'stream-browserify', 'util'],
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 4096,
    target: 'es2017', // Modern JS output for improved mobile perf
    cssTarget: 'chrome61', // Improved mobile CSS support
    minify: 'esbuild', // Faster/minimal JS for mobile
    sourcemap: true, // Helpful for debugging on real devices
  },
  plugins: [
    react({ jsxRuntime: 'automatic' }),
    {
      name: 'ignore-api-routes',
      configureServer(server) {
        server.middlewares.use('/api', (req, res, next) => {
          res.statusCode = 404
          res.end('API routes not available in development')
        })
      }
    }
  ]
}));
