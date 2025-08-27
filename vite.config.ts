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
    chunkSizeWarningLimit: 2048,
    target: 'es2020', // More modern and stable
    cssTarget: 'chrome80',
    minify: false, // Keep disabled to prevent hoisting issues
    sourcemap: false,
    cssMinify: 'lightningcss', // Re-enable CSS minification (safer)
    rollupOptions: {
      output: {
        // Simple, safe chunking - just vendor and main
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
      }
    },
    reportCompressedSize: false,
    assetsInlineLimit: 4096 // Small assets can be inlined safely
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
