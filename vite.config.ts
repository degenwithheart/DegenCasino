import fs from 'fs-extra';
import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const ENV_PREFIX = ['VITE_'];

export default defineConfig(() => ({
  envPrefix: ENV_PREFIX,
  server: { 
    port: 4001, 
    host: false,
    middlewareMode: false,
      hmr: {
        overlay: false,
      },
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
          res.statusCode = 404
          res.end('API routes not available in development')
        })
      }
    }
  ]
}));
