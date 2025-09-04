import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import pkg from './package.json';

const ENV_PREFIX = ['VITE_'];

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
    'process.env.NODE_ENV': '"production"',
    global: 'globalThis',
    // Remove development-only code
    __DEV__: false,
    __APP_VERSION__: JSON.stringify(pkg.version),
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
    include: [
      'react', 
      'react-dom', 
      'buffer',
      'crypto-browserify',
      'stream-browserify',
      'util'
    ],
    esbuildOptions: { 
      define: { global: 'globalThis' },
    }
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 2048,
    target: 'es2020', 
    minify: true,
    sourcemap: false,
    esbuildOptions: {
      drop: ['console', 'debugger'],
    },
    cssMinify: true,
    rollupOptions: {
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
    react({ jsxRuntime: 'automatic' }),
  ],
}));
