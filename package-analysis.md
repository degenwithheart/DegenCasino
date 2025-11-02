# Package Analysis Summary

This analysis identifies which packages in your `package.json` are currently being used in your codebase versus those that appear to be unused.

## Methodology
- Searched for each package name across all files in the workspace
- Packages are considered "needed" if they appear in source code, configuration files, or build scripts
- Packages are considered "potentially not needed" if they only appear in `package.json` and `package-lock.json` (indicating they may be unused or transitive dependencies)

## Dependencies - Needed
These packages have matches in your source code and are actively used:

- @capacitor/browser (imported in mobile browser utilities)
- @capacitor/core (imported in mobile browser utilities)
- @coral-xyz/anchor (imported in Jackpot and PvpFlip games)
- @gamba-labs/multiplayer-sdk (imported in Jackpot and PvpFlip games)
- @noble/ed25519 (imported in crypto utilities)
- @preact/signals-react (imported in Roulette game)
- @radix-ui/themes (used in Vite config for UI vendor chunking)
- @react-three/drei (imported in PvpFlip 3D components)
- @react-three/fiber (imported in PvpFlip 3D components)
- @solana/spl-token (imported in game components)
- @solana/wallet-adapter-react (imported throughout wallet components)
- @solana/wallet-adapter-react-ui (imported throughout wallet components)
- @solana/wallet-adapter-wallets (imported in wallet setup)
- @solana/web3.js (imported throughout for Solana interactions)
- @vercel/kv (imported in API chat and auth)
- bs58 (imported in crypto utilities)
- buffer (imported in main index and used in Vite config)
- events (used in various components)
- framer-motion (imported throughout for animations)
- gamba-core-v2 (imported throughout for game logic)
- gamba-react-ui-v2 (imported throughout for UI components)
- gamba-react-v2 (imported throughout for React integration)
- matter-js (imported in Plinko and Slots games)
- react (imported throughout)
- react-dom (imported throughout)
- react-helmet-async (imported for SEO)
- react-icons (imported throughout for icons)
- react-router-dom (imported throughout for routing)
- styled-components (imported throughout for styling)
- swr (imported in TrollBox for data fetching)
- three (imported in 3D components)
- tone (imported in Mines game for audio)
- uuid (used in various utilities)
- zustand (imported for state management)

## Dependencies - Potentially Not Needed
These packages only appear in package.json/package-lock.json and have no matches in source code:

- @vercel/node (only in package-lock.json)
- html2canvas (only in package.json/package-lock.json)
- minimist (only in package-lock.json)
- node-fetch (only in package-lock.json)
- react-swipeable (only in package-lock.json)
- three-mesh-bvh (only in package.json/package-lock.json)
- tweetnacl (only in package-lock.json)

## DevDependencies - Needed
These dev packages have matches in source code or config files:

- @eslint/js (imported in eslint.config.js)
- @typescript-eslint/eslint-plugin (imported in eslint.config.js)
- @typescript-eslint/parser (imported in eslint.config.js)
- @vitejs/plugin-react (imported in vite.config.ts)
- crypto-browserify (used in vite.config.ts)
- eslint (used in eslint.config.js and package.json)
- http-proxy-middleware (imported in vite.proxy.mjs)
- process (used in index.tsx)
- sharp (imported in image optimization utilities)
- stream-browserify (used in vite.config.ts)
- tailwindcss (used in package.json scripts and config)
- typescript (used in tsconfig.json, eslint.config.js, and settings)
- util (used in vite.config.ts)
- vite (used in vite.config.ts and package.json scripts)
- vite-plugin-compression (imported in vite.config.ts)
- vite-plugin-compression2 (imported in vite.config.ts)

## DevDependencies - Potentially Not Needed
These dev packages only appear in package.json/package-lock.json:

- @capacitor/cli (only in package.json/package-lock.json)
- @tailwindcss/postcss (only in package.json/package-lock.json)
- @tailwindcss/vite (only in package.json/package-lock.json)
- @types/express (only in package-lock.json)
- @types/javascript-obfuscator (only in package.json/package-lock.json)
- @types/matter-js (only in package.json/package-lock.json)
- @types/node (only in package-lock.json)
- @types/react (only in package-lock.json)
- @types/react-dom (only in package-lock.json)
- @types/three (only in package.json/package-lock.json)
- autoprefixer (only in package-lock.json)
- express (only in package-lock.json)
- javascript-obfuscator (only in package-lock.json)
- rollup-plugin-gzip (only in package.json/package-lock.json)
- terser (only in package-lock.json)
- ts-node (only in package-lock.json)
- unplugin-fonts (only in package.json/package-lock.json)
- vite-bundle-analyzer (only in package.json/package-lock.json)

## Recommendations
1. Review the "potentially not needed" packages to confirm they are truly unused
2. For dev dependencies, some TypeScript type packages may still be needed even if not directly imported
3. Consider running your build and tests after removing any packages to ensure nothing breaks
4. Some packages may be peer dependencies or required by other packages

## Original Template Packages
Your project started with these packages, and you've added the following over time:
- Added dependencies: @capacitor/browser, @capacitor/core, @noble/ed25519, @radix-ui/themes, react-helmet-async, react-icons, react-swipeable, three-mesh-bvh, tone, tweetnacl, uuid
- Added dev dependencies: Many build tools, TypeScript types, and development utilities