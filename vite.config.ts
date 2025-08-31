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
    esbuildOptions: { 
      define: { global: 'globalThis' },
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
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2,
        reduce_vars: true,
        reduce_funcs: true,
        conditionals: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
        loops: true,
        sequences: true,
        unused: true,
        hoist_funs: true,
        hoist_props: false,
        hoist_vars: false,
        inline: 1
      },
      mangle: {
        toplevel: false,
        safari10: true,
        properties: false
      }
    },
    cssMinify: 'lightningcss',
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor chunks - split large libraries
          if (id.includes('node_modules')) {
            if (id.includes('@solana') || id.includes('@coral-xyz/anchor')) return 'solana'
            if (id.includes('react') || id.includes('react-dom')) return 'react'
            if (id.includes('three') || id.includes('@react-three')) return 'three'
            if (id.includes('matter-js') || id.includes('tone')) return 'physics'
            if (id.includes('gamba')) return 'gamba'
            if (id.includes('@radix-ui') || id.includes('framer-motion')) return 'ui'
            if (id.includes('@walletconnect') || id.includes('@reown')) return 'wallet'
            return 'vendor'
          }
          
          // Game-specific chunks - each game gets its own chunk
          if (id.includes('/games/')) {
            const gameMatch = id.match(/\/games\/([^\/]+)\//)
            if (gameMatch) return `game-${gameMatch[1].toLowerCase()}`
          }
          
          // Component chunks
          if (id.includes('/components/')) return 'components'
          if (id.includes('/hooks/')) return 'hooks'
          if (id.includes('/utils/')) return 'utils'
          if (id.includes('/pages/')) return 'pages'
        },
        compact: true,
        generatedCode: {
          arrowFunctions: true,
          constBindings: true,
          objectShorthand: true
        }
      }
    },
    reportCompressedSize: false,
    assetsInlineLimit: 4096 // Inline smaller assets
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
