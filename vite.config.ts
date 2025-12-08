import react from '@vitejs/plugin-react';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { defineConfig } from 'vite';
import compression from 'vite-plugin-compression2';
import sitemap from 'vite-sitemap'; 

// Remove PURE annotations from final build
function stripPureAnnotations() {
  return {
    name: 'strip-pure-annotations',
    renderChunk(code) {
      return code.replace(/\/\*#__PURE__\*\//g, '');
    }
  };
}

// Suppress all minor warnings
function silentWarnings() {
  return {
    name: 'silent-warnings',
    buildStart() { },
    renderChunk(code, chunk, options) {
      // nothing here; used only for Rollup onwarn override
    }
  };
}

const ENV_PREFIX = ['VITE_'];

export default defineConfig(() => ({
  envPrefix: ENV_PREFIX,
  server: {
    port: 4001,
    host: true,
    hmr: { overlay: false },
    open: false,
    watch: { usePolling: true, interval: 100 },
    cors: { origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] },
  },
  assetsInclude: ["**/*.glb"],
  define: {
    'process.env.ANCHOR_BROWSER': true,
    'process.env.GAMBA_ENV': '"development"',
    global: 'globalThis',
    'process.env': '{}',
    'global.Buffer': 'globalThis.Buffer'
  },
  resolve: {
    alias: {
      buffer: 'buffer/',
      stream: 'stream-browserify',
      crypto: 'crypto-browserify'
    }
  },
  optimizeDeps: {
    include: [
      'react', 'react-dom', 'buffer', 'crypto-browserify', 'stream-browserify',
      'util', 'events', 'process', '@solana/web3.js',
      'gamba-core-v2', 'gamba-react-ui-v2', 'gamba-react-v2'
    ],
    esbuildOptions: { define: { global: 'globalThis', 'process.env': '{}' }, sourcemap: false }
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 2048,
    target: 'es2020',
    minify: 'esbuild',
    sourcemap: false,
    esbuildOptions: { drop: ['console', 'debugger'], sourcemap: false },
    cssMinify: 'esbuild',
    rollupOptions: {
      onwarn(warning, warn) {
        if (
          warning.code === 'SOURCEMAP_ERROR' ||
          warning.code === 'PLUGIN_WARNING' ||
          warning.code === 'MODULE_LEVEL_DIRECTIVE' ||
          warning.message?.includes('/*#__PURE__*/') ||
          warning.message?.includes('Module "fs" has been externalized') ||
          warning.message?.includes('Module "stream" has been externalized') ||
          warning.message?.includes('Module "path" has been externalized') ||
          warning.message?.includes('Module "os" has been externalized')
        ) return;
        warn(warning);
      },
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
          'blockchain': ['@solana/web3.js', '@coral-xyz/anchor', '@solana/wallet-adapter-react', '@solana/wallet-adapter-react-ui', '@solana/wallet-adapter-wallets'],
          'gamba-core': ['gamba-core-v2', 'gamba-react-v2', 'gamba-react-ui-v2'],
          'three': ['three', '@react-three/fiber', '@react-three/drei'],
          'physics-audio': ['matter-js', 'tone'],
          'ui-vendor': ['@radix-ui/themes', 'framer-motion', 'styled-components'],
        },
        compact: true,
        generatedCode: { arrowFunctions: true, constBindings: true, objectShorthand: true },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
      }
    },
  },
  plugins: [
    react({ jsxRuntime: 'automatic', babel: { plugins: [] } }),
    
    // 💡 SITEMAP/ROBOTS.TXT GENERATION - FINAL FIX
    sitemap({
      // ✅ FIX: Use 'hostname' to definitively force the production URL
      hostname: 'https://degenheart.casino', 
      
      urls: [
        '/',
        '/jackpot',
        '/bonus',
        '/leaderboard',
        '/mobile', 
        '/select-token',
        '/terms',
        '/whitepaper',
        '/credits',
        '/token',
        '/presale',
        '/aboutme',
        '/changelog',
        '/propagation',
        '/explorer', 
      ],
      outDir: 'dist',
    }),

    compression({
      include: /\.(js|css|html|json|svg|txt|xml|woff|woff2|ttf|eot)$/,
      threshold: 1024,
    }),
    stripPureAnnotations(),
    silentWarnings(),
    {
      name: 'buffer-polyfill',
      config(config, { command }) {
        if (command === 'serve') config.define = { ...(config.define || {}), global: 'globalThis' };
      },
      configureServer(server) {
        server.middlewares.use('/', (req, res, next) => {
          if (req.url?.includes('.js')) res.setHeader('Content-Type', 'application/javascript');
          next();
        });
      }
    },
    {
      name: 'dev-api-proxy',
      configureServer(server) {
        const proxy = createProxyMiddleware({
          target: 'http://localhost:4003',
          changeOrigin: true
        });
        server.middlewares.use('/api', proxy);
      }
    }
  ],
}));