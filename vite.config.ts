import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const ENV_PREFIX = ['VITE_'];

export default defineConfig(() => ({
  envPrefix: ENV_PREFIX,
  server: { 
    port: 4001,
    host: true,
    hmr: { overlay: true },
    open: false,
    watch: { usePolling: true, interval: 100 },
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type','Authorization'],
    },
    // Suppress sourcemap warnings in dev
    sourcemapIgnoreList: (relativeSourcePath, sourcemapPath) => {
      return relativeSourcePath.includes('node_modules') &&
             (relativeSourcePath.includes('@solana') ||
              relativeSourcePath.includes('superstruct'));
    },
  },
  assetsInclude: ["**/*.glb"],
  define: {
    'process.env.ANCHOR_BROWSER': true,
    'process.env.GAMBA_ENV': '"development"',
    global: 'globalThis',
  },
  resolve: {
    alias: {
      buffer: 'buffer',
    },
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'buffer',
      'crypto-browserify',
      'stream-browserify',
      'util',
      'events',
      'process',
      '@solana/web3.js',
      'gamba-core-v2',
      'gamba-react-ui-v2',
      'gamba-react-v2'
    ],
    esbuildOptions: { 
      define: { 
        global: 'globalThis',
        'process.env': '{}',
      },
      // Disable sourcemaps for problematic packages
      sourcemap: false
    }
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 2048,
    target: 'es2020', 
    minify: 'esbuild',
    sourcemap: false,
    esbuildOptions: {
      drop: ['console', 'debugger'],
      sourcemap: false,
    },
    cssMinify: 'esbuild',
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress sourcemap warnings for known problematic packages
        if (warning.code === 'SOURCEMAP_ERROR' && 
            (warning.message.includes('@solana/buffer-layout') || 
             warning.message.includes('superstruct') ||
             warning.message.includes('@solana/web3.js'))) {
          return;
        }
        warn(warning);
      },
      output: {
        // More conservative chunking to avoid circular dependencies
        manualChunks: {
          // Core React libraries
          'react-vendor': ['react', 'react-dom'],
          // Large blockchain libraries
          'blockchain': ['@solana/web3.js', '@coral-xyz/anchor'],
          // 3D libraries (separate due to size)
          'three': ['three', '@react-three/fiber', '@react-three/drei'],
          // Physics and audio (separate due to size)
          'physics-audio': ['matter-js', 'tone'],
        },
        compact: true,
        generatedCode: {
          arrowFunctions: true,
          constBindings: true,
          objectShorthand: true
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
      }
    },
  },
  plugins: [
    react({ 
      jsxRuntime: 'automatic',
      // Ensure proper refresh runtime handling
      babel: {
        plugins: []
      }
    }),
    {
      name: 'buffer-polyfill',
      config(config, { command }) {
        if (command === 'serve') {
          config.define = config.define || {}
          config.define.global = 'globalThis'
        }
      },
      configureServer(server) {
        server.middlewares.use('/', (req, res, next) => {
          if (req.url && req.url.includes('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
          }
          next();
        });
      }
    },
    {
      name: 'ignore-api-routes',
      configureServer(server) {
        server.middlewares.use('/api', (req, res, next) => {
          res.statusCode = 404;
          res.end('API routes not available in development');
        });
      }
    }
  ],
}));
