# 🎰 DegenHeart Casino

[![Live](https://img.shields.io/badge/live-degenheart.casino-brightgreen?style=flat-square)](https://degenheart.casino)
[![License](https://img.shields.io/github/license/degenwithheart/DegenCasino?style=flat-square)](LICENSE)
![Stars](https://img.shields.io/github/stars/degenwithheart/DegenCasino?style=flat-square)
![Solana](https://img.shields.io/badge/solana-mainnet-brightgreen?logo=solana&logoColor=white&style=flat-square)

> **A next-generation, on-chain casino platform built on Solana, powered by Gamba SDK.**  
> _Production-grade, feature-rich, and open source._

---

<details>
  <summary><strong>🖼️ Screenshots</strong> (click to expand)</summary>
  <p align="center">
    <img src="./screenshots/1.jpg" width="220" alt="Screenshot 1"/>
    <img src="./screenshots/2.jpg" width="220" alt="Screenshot 2"/>
    <img src="./screenshots/3.jpg" width="220" alt="Screenshot 3"/>
  </p>
</details>

---

## 🚀 Overview

DegenHeart Casino is a modern, non-custodial casino platform deployed on Solana.  
It leverages the Gamba SDK for provably fair games, features advanced graphics/audio, refined routing, robust state management, and is production-hardened for speed and security.

---

## 🛠 Tech Stack

| **Frontend**                  | **Blockchain**         | **Graphics & Audio**         | **Build & Tooling**        |
|-------------------------------|------------------------|------------------------------|----------------------------|
| React 18, TypeScript          | Gamba SDK v2           | three, @react-three/fiber    | Vite, esbuild, Terser      |
| react-router-dom v6           | @coral-xyz/anchor      | @react-three/drei            | Tailwind CSS, styled-comp. |
| styled-components, Tailwind   | @solana/web3.js        | three-mesh-bvh               | vite-bundle-analyzer       |
| zustand, swr                  | @solana/spl-token      | matter-js, tone              | @vercel/node, sharp        |

---

## 🏗️ App Architecture

<details>
<summary><strong>Provider Tree</strong> (from <code>src/index.tsx</code>)</summary>

```
BrowserRouter
 └─ ConnectionProvider
     └─ WalletProvider (Solflare)
         └─ WalletModalProvider
             └─ TokenMetaProvider (static)
                 └─ SendTransactionProvider (priorityFee: localStorage)
                     └─ GambaProvider
                         └─ GambaPlatformProvider (creator, jackpot, etc.)
                             └─ ReferralProvider
                                 └─ GlobalErrorBoundary
                                     └─ App
```
</details>

**Local Persistence:**  
- `selectedTokenMint` — Saves/restores user's selected token
- `priorityFee` — Saves/restores custom transaction fee

---

## 🌐 Routing

| Path                                 | Page/Component        |
|--------------------------------------|-----------------------|
| `/`                                  | Dashboard             |
| `/jackpot`                           | JackpotPage           |
| `/bonus`                             | BonusPage             |
| `/leaderboard`                       | LeaderboardPage       |
| `/select-token`                      | SelectTokenPage       |
| `/terms`                             | TermsPage             |
| `/whitepaper`                        | Whitepaper            |
| `/aboutme`                           | AboutMe               |
| `/audit`                             | FairnessAudit         |
| `/propagation`                       | Propagation           |
| `/explorer`                          | ExplorerIndex         |
| `/explorer/platform/:creator`        | PlatformView          |
| `/explorer/player/:address`          | PlayerView            |
| `/explorer/transaction/:txId`        | Transaction           |
| `/:wallet/profile`                   | UserProfile           |
| `/game/:wallet/:gameId`              | Game                  |

---

## ⚙️ Build & Deployment

- **Vite**: Polyfills, chunk splitting, minification, CORS, optimized for production.
- **Custom Vercel config**:  
  - Static assets: `immutable, max-age=31536000` caching  
  - `index.html`: `no-cache`  
  - SPA fallback routing  
  - API route rewrites

---

## 🎮 Features

- 🔑 **Non-custodial**: Fully on-chain, users hold their own keys
- 🎲 **Provably Fair**: Powered by Gamba SDK
- 🧑‍🎨 **3D & Animated UI**: Advanced graphics, audio, and particle effects
- 🏆 **Leaderboards, Jackpots, Bonus Games**
- 👤 **User Profiles, Referrals, Explorer**
- 🛠️ **Robust Build Pipeline**: Obfuscation, compression, bundle analysis
- ⚡ **Fast, Secure, Modern**

---

## 🛡️ Security & Hardening

- Strips `console` and `debugger` statements in production
- Anti-debugging checks in production mode
- Dependency overrides for security and compatibility (see `package.json`)
- SPA routing and asset caching for fast, safe deploys

---

## 💾 Project Structure

<details>
<summary><strong>Main Folders</strong></summary>

- `/src` — Main source code
- `/public` — Static assets, manifest
- `/screenshots` — Project screenshots
- `/api` — (if present) API endpoints for serverless/back end
</details>

---

## 👤 Author

This project is maintained exclusively by **[@degenwithheart](https://github.com/degenwithheart)**.  
There are no other developers, team members, contributors, or funders.

---

## 💸 Donations

If you find this project valuable and would like to support privacy, open-source, and ongoing work:

> **SOL Address:**  
> `6o1iE4cKQcjW4UFd4vn35r43qD9LjNDhPGNUMBuS8ocZ`

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

**Built with ❤️ by [@degenwithheart](https://github.com/degenwithheart)**