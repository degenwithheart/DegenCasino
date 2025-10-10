import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Detect which bundler we're using
const isRolldown = process.env.VITE_BUNDLER === 'rolldown' ||
  process.env.npm_package_name?.includes('rolldown-vite');

// Remove PURE annotations from final build
function stripPureAnnotations() {
  return {
    name: 'strip-pure-annotations',
    renderChunk(code: string) {
      return code.replace(/\/\*#__PURE__\*\//g, '');
    }
  };
}

// Suppress all minor warnings
function silentWarnings() {
  return {
    name: 'silent-warnings',
    buildStart() { },
    renderChunk(code: string, chunk: any, options: any) {
      // nothing here; used only for Rollup onwarn override
    }
  };
}

const ENV_PREFIX = ['VITE_'];

export default defineConfig(() => {
  console.log(isRolldown ?
    '🚀 Vite Config: Using Rolldown bundler for improved performance' :
    '📦 Vite Config: Using Rollup bundler (stable)');

  return {
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
        buffer: 'buffer',
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
      // Use rollupOptions for rolldown-vite, fallback to esbuildOptions for regular vite
      ...(isRolldown ? {
        rollupOptions: {
          define: { global: 'globalThis', 'process.env': '{}' }
        }
      } : {
        esbuildOptions: {
          define: { global: 'globalThis', 'process.env': '{}' },
          sourcemap: false
        }
      })
    },
    build: {
      outDir: 'dist',
      chunkSizeWarningLimit: 2048,
      target: 'es2020',
      minify: isRolldown ? 'esbuild' : 'esbuild', // Rolldown has better esbuild integration
      sourcemap: false,
      esbuildOptions: {
        drop: ['console', 'debugger'],
        sourcemap: false,
        // Rolldown-specific optimizations
        ...(isRolldown && {
          treeShaking: true,
          pure: ['console.log', 'console.warn'],
        })
      },
      cssMinify: 'esbuild',
      // Rolldown uses different options but is compatible with rollupOptions
      rollupOptions: {
        onwarn(warning, warn) {
          // SILENT: ignore all yellow/info warnings and PURE comments
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

          // only pass through red/critical errors
          warn(warning);
        },
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'blockchain': ['@solana/web3.js', '@coral-xyz/anchor'],
            'three': ['three', '@react-three/fiber', '@react-three/drei'],
            'physics-audio': ['matter-js', 'tone'],
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
        name: 'ignore-api-routes',
        configureServer(server) {
          server.middlewares.use('/api', (req, res, next) => {
            res.statusCode = 404;
            res.end('API routes not available in development');
          });
        }
      }
    ],
  };
});
