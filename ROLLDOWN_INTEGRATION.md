# Rolldown-Vite Integration

This project uses an intelligent fallback system between `rolldown-vite` (faster Rust-based bundler) and regular `vite` (stable Rollup-based bundler).

## How It Works

1. **Primary**: Attempts to use `npm:rolldown-vite@latest` for improved build performance
2. **Fallback**: Falls back to regular `vite@7.1.9` if rolldown-vite is unavailable or incompatible
3. **Environment-Aware**: Automatically uses stable Vite on Vercel/production environments

## Package Configuration

```json
{
  "devDependencies": {
    "vite": "7.1.9",
    "rolldown-vite": "^7.1.16"
  }
}
```

## Available Scripts

- `npm run dev` - Smart fallback development server
- `npm run build` - Smart fallback build
- `npm run dev:rolldown` - Force rolldown-vite
- `npm run dev:rollup` - Force regular vite (rollup)
- `npm run build:rolldown` - Force rolldown build
- `npm run build:rollup` - Force rollup build

## Fallback Logic

The `scripts/vite-with-fallback.mjs` script:

1. **Local Development**: Tries rolldown-vite first, falls back to rollup if issues occur
2. **Vercel/Production**: Uses stable rollup by default for deployment reliability
3. **Error Handling**: Automatically retries with fallback on any rolldown failures

## Environment Variables

- `VITE_BUNDLER=rolldown` - Indicates rolldown-vite is active
- `VITE_BUNDLER=rollup` - Indicates regular vite is active

## Benefits

- **Performance**: Rolldown-vite offers faster builds (Rust-based)
- **Compatibility**: Maintains 100% compatibility with existing Vite ecosystem
- **Reliability**: Automatic fallback ensures builds never fail due to bundler issues
- **Deployment Safety**: Conservative approach in production environments

## Troubleshooting

If you encounter issues:

1. Check which bundler is active: `npm run check:vite`
2. Force specific bundler: Use `npm run dev:rollup` or `npm run dev:rolldown`
3. Clear dependencies: `npm run clean && npm install`

The fallback system ensures your development workflow is never interrupted.