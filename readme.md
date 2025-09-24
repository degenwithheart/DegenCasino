# 🎰 DegenHeart Casino

[![Live](https://img.shields.io/badge/live-degenheart.casino-brightgreen?style=flat-square)](https://degenheart.casino)
[![License](https://img.shields.io/github/license/degenwithheart/DegenCasino?style=flat-square&v=1)](LICENSE)
![Stars](https://img.shields.io/github/stars/degenwithheart/DegenCasino?style=flat-square)
![Solana](https://img.shields.io/badge/solana-mainnet-brightgreen?logo=solana&logoColor=white&style=flat-square)
[![Gamba SDK](https://img.shields.io/badge/gamba-v2.0.0-purple?style=flat-square)](https://gamba.so)

> **The most advanced open-source casino platform on Solana.**  
> _Enterprise-grade architecture, 3D graphics, edge computing, and production-hardened infrastructure._

**🚀 Built Beyond the Template**  
DegenHeart Casino is not just a technical showcase—it's a personal journey built on top of the [Gamba platform template](https://github.com/gamba-labs/platform). Instead of simply forking and modifying, this project represents what can blossom when a solo developer chases a dream, using Gamba's incredible foundation as a launchpad.  
This is a love letter to open-source and to the Gamba team, demonstrating how one person's vision—fueled by gratitude and collaboration—can push the boundaries of on-chain gaming.

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

DegenHeart Casino is a **complete architectural reimagining** of what's possible with on-chain gaming. While the Gamba ecosystem provides the foundational SDK, this project is a heartfelt exploration of how far a solo builder can go when empowered by open tools and an inspiring community.

- **🏗️ Enterprise Architecture**: Complex provider hierarchies, intelligent RPC failover, edge-cached APIs
- **🎮 Advanced Game Engine**: 16+ custom games with 3D graphics, physics simulations, and immersive audio
- **⚡ Performance Engineering**: Bundle splitting, asset compression, smart caching, and sub-second load times  
- **🛡️ Production Hardening**: Rate limiting, anti-debugging, security headers, and monitoring systems
- **🌐 Infrastructure**: Vercel Edge Functions, KV storage, usage tracking, and comprehensive API layer

**This isn't a fork — it's a ground-up rebuild** that strives to show what one passionate person, with deep appreciation for the Gamba team, can create for Solana gaming.

---

## 🛠 Tech Stack

| **Category**                  | **Technologies**              | **Advanced Features**             |
|-------------------------------|-------------------------------|-----------------------------------|
| **Frontend**                  | React 18, TypeScript          | Lazy loading, code splitting     |
| **State & Routing**           | Zustand, React Router v6      | Persistent storage, SPA routing   |
| **Styling**                   | Styled Components, Tailwind   | Theme system, responsive design   |
| **3D & Graphics**             | Three.js, React Three Fiber   | Physics simulation, particles     |
| **Audio**                     | Tone.js, Matter.js             | Dynamic soundscapes, effects      |
| **Blockchain**                | Gamba SDK v2, Solana Web3     | Provably fair, non-custodial     |
| **Backend APIs**              | Vercel Edge Functions         | RPC proxy, rate limiting, caching |
| **Build System**              | Vite, esbuild, Terser         | Bundle analysis, compression      |
| **Infrastructure**            | Vercel, KV Storage            | CDN, edge computing, monitoring   |

### 🔧 Advanced Dependencies
- **@gamba-labs/multiplayer-sdk**: Real-time multiplayer gaming
- **@react-three/drei**: Advanced 3D helpers and components  
- **three-mesh-bvh**: Collision detection and physics
- **@vercel/kv**: Edge-optimized key-value storage
- **javascript-obfuscator**: Production code protection

### 📚 Developer Resources
- **[Complete Developer Guides](./guides/)** - Game creation, theme development, architecture
- **[Working Templates](./guides/game-creation/examples/)** - Modern game templates with 2D/3D support
- **[Theme Examples](./guides/theme-creation/examples/)** - Layout themes and component overrides
- **Enterprise Architecture** - Complex provider hierarchies, performance optimization, security

---

## 🏗️ Architecture Overview

### Provider Hierarchy
```
BrowserRouter
 └─ NetworkProvider (Dynamic RPC switching)
     └─ ConnectionProvider (Solana Web3)
         └─ WalletProvider (Multi-wallet support)
             └─ WalletModalProvider
                 └─ TokenMetaProvider
                     └─ SendTransactionProvider
                         └─ GambaProvider (Game engine)
                             └─ GambaPlatformProvider
                                 └─ ReferralProvider
                                     └─ GlobalErrorBoundary
                                         └─ App
```

### Advanced Features
- **🔄 Dynamic RPC Management**: Intelligent failover between Syndica, Helius, and public endpoints
- **💾 Smart Persistence**: Auto-saves token preferences, priority fees, and user settings
- **🎯 Error Boundaries**: Comprehensive error handling and user feedback systems
- **📊 Real-time Monitoring**: API usage tracking, performance metrics, health checks

---

## 🕹️ Game Portfolio

### 🎯 Core Games (16+ Titles)
| Game | Status | Features | Description |
|------|--------|----------|-------------|
| **Dice v2** | 🟢 Active | 3D Physics | Mystical 8-ball with particle effects |
| **Slots** | 🟢 Active | Animation | Multi-reel with cascading symbols |
| **Blackjack v2** | 🟢 Active | Strategy | Professional card game with dealer AI |
| **Crash** | 🟢 Active | Real-time | Social multiplier with chat |
| **Mines** | 🟢 Active | Grid-based | Risk/reward treasure hunting |
| **Roulette** | 🔴 Under Maintenance | Classic | European-style wheel simulation |
| **Plinko** | 🟢 Active | Physics | Realistic ball drop mechanics |
| **Limbo v2** | 🆕 Coming Soon | High-risk | Extreme multiplier challenges |
| **Keno v2** | 🆕 Coming Soon | Lottery | Number selection with multiple draws |
| **Flip** | 🟢 Active | Simple | Animated coin toss with outcomes |
| **HiLo** | 🟢 Active | Cards | Prediction-based card game |
| **Horse Racing v2** | 🆕 Coming Soon | Virtual | Animated racing with betting |
| **Multi-Poker** | 🟢 Active | Poker | Various poker game variants |
| **Double or Nothing v2** | 🆕 Coming Soon | Risk | All-or-nothing betting |
| **Chart Game v2** | 🆕 Coming Soon | Trading | Crypto-style prediction game |
| **PlinkoRace** | 🔴 Under Maintenance | Multiplayer | Competitive Plinko racing |

### 🎨 Advanced Game Features
- **3D Graphics**: Three.js powered immersive environments
- **Physics Simulation**: Matter.js for realistic interactions  
- **Dynamic Audio**: Tone.js adaptive soundscapes
- **Particle Effects**: Custom visual effects and animations
- **Multiplayer Support**: Real-time competitive gaming
- **Custom RTPs**: Configurable return-to-player rates

---

## 🛡️ Production Infrastructure

### Edge Computing & APIs
```
/api/
├── rpc/proxy.ts           # Intelligent RPC failover system
├── cache/                 # Smart caching with TTL management  
├── rate-limiter/          # IP-based request throttling
├── monitoring/            # Real-time health checks & metrics
├── services/              # External API integrations
└── auth/                  # Authentication & session management
```

### Performance Optimizations  
- **🚀 Build Pipeline**: Asset compression (gzip/brotli), code obfuscation
- **📦 Bundle Splitting**: Lazy-loaded routes and components
- **⚡ Edge Caching**: Vercel CDN with intelligent cache headers
- **🔄 RPC Failover**: Multi-tier endpoint redundancy
- **📊 Usage Tracking**: Real-time API metrics and monitoring

### Security Features
- **🔒 Anti-debugging**: Production code protection
- **🛡️ Rate Limiting**: API abuse prevention  
- **🔐 Security Headers**: CSP, HSTS, and content protection
- **📝 Audit Logs**: Comprehensive activity tracking

---

## 🚀 Features & Differentiators

### 🎯 Core Platform
- 🔑 **Fully Non-custodial**: Complete on-chain operation, users control their keys
- 🎲 **Provably Fair**: Powered by Gamba SDK v2 with verifiable randomness
- 🕹️ **16+ Custom Games**: From simple Flip to complex multiplayer experiences
- 🏆 **Comprehensive Systems**: Jackpots, leaderboards, bonuses, referrals
- 👤 **Advanced Profiles**: Detailed user analytics and transaction history
- 🔍 **Full Explorer**: Platform-wide transaction and player analytics

### 🎨 Technical Excellence  
- 🧑‍💻 **3D Immersive UI**: Three.js powered graphics with physics simulation
- 🎵 **Dynamic Audio**: Tone.js adaptive soundscapes and effects
- ⚡ **Sub-second Performance**: Advanced caching and optimization
- 🌐 **Edge Computing**: Global CDN with intelligent failover
- 📱 **Mobile Optimized**: Responsive design with touch interactions
- 🛠️ **Developer Experience**: Hot reload, bundle analysis, monitoring tools

### 🏗️ Enterprise Architecture
- 🔄 **Multi-RPC Resilience**: Automatic failover between premium endpoints
- 📊 **Real-time Monitoring**: Comprehensive health checks and metrics
- 🛡️ **Production Hardened**: Rate limiting, obfuscation, security headers
- 💾 **Smart Persistence**: Intelligent state management and caching
- 🎯 **Error Boundaries**: Graceful failure handling and recovery
- 📈 **Usage Analytics**: Detailed performance and usage tracking

---

## 🪄 Beyond the Template: The Solo Developer Journey

The Gamba platform is a gift to the open-source world, offering a robust starting point for anyone passionate about on-chain gaming. My journey with DegenHeart Casino is a testament to what's possible when you combine heartfelt gratitude for Gamba's work with an unrelenting solo drive to build something unique.  
Rather than just a technical comparison, this section is about honoring how much can be achieved when you build with, not just from, a great foundation.

| Aspect       | Gamba Platform (Starter) | DegenHeart Casino (Solo Project) |
|--------------|--------------------------|----------------------------------|
| **Purpose**  | Quickstart template      | Ambitious production platform    |
| **Games**    | 3-5 simple games         | 16+ titles, 3D/physics/audio     |
| **Architecture** | Single-provider chain | Enterprise-grade, multi-layered  |
| **Graphics** | CSS/HTML                 | Three.js-powered 3D environments |
| **Audio**    | None                     | Dynamic Tone.js soundscapes      |
| **APIs**     | None                     | Full edge-computing API layer    |
| **Caching**  | Browser only             | Multi-tier edge caching          |
| **Monitoring** | None                   | Real-time health & analytics     |
| **Build**    | Basic Vite               | Advanced optimization pipeline   |
| **Security** | Basic                    | Production-hardened, audited     |
| **Multiplayer** | No                    | Real-time multiplayer            |
| **Explorer** | No                       | Comprehensive analytics          |
| **Mobile**   | Responsive               | Touch-optimized, performant      |

> **From Platform to Possibility**  
>  
> Gamba’s open-source foundation made it possible for me to turn a solo project into a feature-rich, production-grade Solana casino. If you have the drive, the tools are all here—DegenHeart is proof that one person can take an idea and run with it, thanks to the ecosystem Gamba started.  
>  
> This project is a thank you to everyone at Gamba and the wider open-source community: you provided the spark, and this is what can happen when that spark lands in the right heart.

---

## 🏆 Innovation Highlights

All of these achievements are possible only because I stood on the shoulders of the Gamba team and the open-source builders who came before me:

- **First** Solana casino with comprehensive 3D gaming environments
- **First** to implement intelligent RPC failover with health monitoring  
- **First** with edge-computing API layer for enhanced performance
- **Most** advanced game portfolio with physics and audio integration
- **Most** comprehensive monitoring and analytics system
- **Most** production-ready security and optimization features

---

## 🌐 Built on Gamba Ecosystem

None of this would have taken shape without the Gamba project and its passionate contributors. DegenHeart Casino is deeply grateful to the Gamba team for the following:

- **Gamba SDK v2**: Provably fair gaming engine
- **Gamba React UI**: Base UI components (heavily customized)
- **Gamba Multiplayer**: Real-time gaming infrastructure
- **Gamba Platform**: Jackpot and fee management

This platform is a living example of what's possible when you build *with* Gamba, fueled by gratitude and a relentless solo drive.

---

## 👤 Creator

**[@degenwithheart](https://github.com/degenwithheart)** — Solo developer, architect, and maintainer

This project represents **6+ months of intensive, passionate development** by a single developer. It's a tribute to what one person can do—given the right tools, the support of an open-source community, and the inspiration that comes from seeing others share their work.

---

## 📚 Developer Guides

DegenHeart Casino includes **comprehensive developer documentation** for extending the platform:

### 🎮 Game Development
**[Complete Game Creation Guide](./guides/game-creation/)**
- **Architecture Overview**: Dual renderer system, Gamba SDK integration, portal system
- **Real Game Examples**: Analysis of actual games like Dice-v2, Crypto Chart, Horse Racing
- **Working Templates**: Modern templates with 2D/3D support, audio integration, SEO
- **Step-by-Step Tutorial**: From basic setup to advanced 3D graphics and multiplayer

**[Game Creation Examples](./guides/game-creation/examples/)**
- `ModernGameTemplate.tsx` - Updated wrapper with dual renderer support
- `ModernGameTemplate-2D.tsx` - Canvas implementation with physics and audio
- `ModernGameTemplate-3D.tsx` - Three.js template for immersive experiences
- Legacy templates and comprehensive type definitions

### 🎨 Theme Development  
**[Complete Theme Creation Guide](./guides/theme-creation/)**
- **Layout System**: Component overrides, section customization, page layouts
- **Global Color Schemes**: 10+ built-in themes with animations and effects
- **Real Implementation**: Based on actual DegenHeart theme architecture
- **Advanced Features**: Responsive design, accessibility, performance optimization

**[Theme Creation Examples](./guides/theme-creation/examples/)**
- Working component override examples (Header, Footer, Game sections)
- TypeScript definitions for layout themes
- Utility functions and helper tools

### 🏗️ Architecture Documentation
The guides cover DegenHeart's enterprise-grade architecture:
- **Provider Hierarchy**: Complex provider chain with network switching
- **Performance Systems**: Edge caching, bundle optimization, smart persistence  
- **Security Features**: Rate limiting, anti-debugging, production hardening
- **Monitoring & Analytics**: Real-time health checks and usage tracking

### 🚀 Quick Start Development
```bash
# Clone and explore the guides
git clone https://github.com/degenwithheart/DegenCasino.git
cd DegenCasino/guides

# Create a new game
cp game-creation/examples/ModernGameTemplate.tsx src/games/YourGame-v2/index.tsx

# Create a new theme  
mkdir src/themes/layouts/your-theme
cp theme-creation/examples/types.ts src/themes/layouts/your-theme/
```

**📖 [Browse All Guides](./guides/)** — Complete documentation for game creation, theme development, and platform architecture.

---

## 🤝 Contributing

While this is primarily a solo project, **quality contributions are welcome**—especially from those who share a love of open-source, learning, and dreaming big:

- 🐛 **Bug Reports**: Detailed issue reports with reproduction steps
- 💡 **Feature Suggestions**: Well-thought-out enhancement proposals  
- 🎮 **Game Ideas**: Creative game concepts with technical feasibility
- 📚 **Documentation**: Improvements to guides and explanations
- 🎨 **Design**: UI/UX enhancements and visual improvements

**Please note**: This is a production platform with high code quality standards. All contributions must meet enterprise-grade requirements.

### 🛠️ Development Resources
- **[Developer Guides](./guides/)** - Comprehensive documentation for extending the platform
- **[Game Examples](./guides/game-creation/examples/)** - Working templates and real implementations  
- **[Theme Examples](./guides/theme-creation/examples/)** - Layout themes and component overrides

---

## 💸 Support Development

If you find this project valuable and want to support continued innovation in Solana gaming:

> **SOL Address:**  
> `6o1iE4cKQcjW4UFd4vn35r43qD9LjNDhPGNUMBuS8ocZ`

Your support enables:
- 🎮 New game development and 3D enhancements
- ⚡ Infrastructure improvements and optimizations  
- 🛡️ Security audits and penetration testing
- 📱 Mobile app development
- 🌐 Multi-language support and localization

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — **free for learning, modification, and commercial use**.

---

## 🔗 Links & Resources

- 🌐 **Live Platform**: [degenheart.casino](https://degenheart.casino)
- 📊 **Explorer**: [degenheart.casino/explorer](https://degenheart.casino/explorer)  
- 🎮 **Gamba Ecosystem**: [gamba.so](https://gamba.so)
- 📚 **Gamba Docs**: [docs.gamba.so](https://docs.gamba.so)
- 💬 **Gamba Discord**: [discord.gg/xjBsW3e8fK](https://discord.gg/xjBsW3e8fK)

---

**🎰 Built with ❤️ and countless hours by [@degenwithheart](https://github.com/degenwithheart)**

*Thanks to Gamba, and to every open-source builder who made this journey possible. Pushing the boundaries of what's possible in Solana gaming—one dream at a time.*