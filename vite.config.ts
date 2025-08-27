import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

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
    exclude: [
      // Exclude large packages from pre-bundling to enable better tree-shaking
      '@solana/web3.js',
      '@coral-xyz/anchor',
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      'matter-js',
      'tone'
    ],
    esbuildOptions: { 
      define: { global: 'globalThis' },
      // Enable tree-shaking during pre-bundling
      treeShaking: true,
      // Optimize for size
      minify: true,
    }
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 2048,
    target: 'es2020', 
    minify: 'terser',
    sourcemap: false,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      mangle: true,
    },
    rollupOptions: {
      output: {
        // Aggressive chunking for better caching and parallel loading
        manualChunks(id) {
          // Large blockchain libraries - separate chunk
          if (id.includes('@solana/') || id.includes('gamba-') || id.includes('@coral-xyz/anchor')) {
            return 'blockchain'
          }
          // UI and styling libraries - separate chunk
          if (id.includes('react') || id.includes('@radix-ui') || id.includes('styled-components') || id.includes('framer-motion')) {
            return 'ui'
          }
          // 3D libraries - separate chunk (heavy)
          if (id.includes('three') || id.includes('@react-three/')) {
            return 'three'
          }
          // Physics and audio libraries - separate chunk (heavy)
          if (id.includes('matter-js') || id.includes('tone')) {
            return 'physics-audio'
          }
          // Utility libraries
          if (id.includes('html2canvas') || id.includes('zustand') || id.includes('swr')) {
            return 'utils'
          }
          // Wallet libraries - separate chunk
          if (id.includes('wallet')) {
            return 'wallet'
          }
          // Other vendor packages
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
      }
    },
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
    }
  ],
}));
