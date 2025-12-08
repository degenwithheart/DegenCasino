import React, { useState, useEffect } from 'react';
import { useColorScheme } from '../../../themes/ColorSchemeContext';
import { usePageSEO } from '../../../hooks/ui/useGameSEO';
import {
  UnifiedPageContainer,
  UnifiedPageTitle,
  UnifiedSubtitle,
  UnifiedSection,
  UnifiedSectionTitle,
  UnifiedContent
} from '../../../components/UI/UnifiedDesign';
import { Tabs } from './Whitepaper.styles';
import { Helmet } from 'react-helmet-async'; // ⚠️ Ensure Helmet is imported if usePageSEO doesn't handle it

const tabs = ['Overview', 'Market Differentiation', 'Token', 'Fairness', 'Roadmap'];

const WhitepaperTabs: React.FC = () => {
  // SEO for Whitepaper page
  const seoHelmet = usePageSEO(
    "Whitepaper | DegenHeart Casino Tokenomics & Fairness on Solana",
    "Read our complete whitepaper with tokenomics, fairness algorithms, and roadmap for DegenHeart Casino, the truly decentralized casino built on the Gamba Protocol."
  );

  const [activeTab, setActiveTab] = useState('Overview');
  const [visible, setVisible] = useState(false);
  const { currentColorScheme } = useColorScheme();

  useEffect(() => {
    setVisible(true);
  }, []);

  // ⚠️ Important: Define the Author for E-E-A-T
  const authorName = "Stuart / DegenWithHeart";
  const organizationName = "DegenHeart Foundation";
  const publishDate = "2025-12-08"; // Use the date you deploy this version

  return (
    <>
      {seoHelmet}
      
      {/* ✅ ARTICLE + FAQ SCHEMA MARKUP (JSON-LD) */}
      <script type="application/ld+json">
        {`{
          "@context": "https://schema.org",
          "@graph": [
            // --- 1. Technical Article Schema ---
            {
              "@type": "TechArticle",
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": "https://degenheart.casino/whitepaper"
              },
              "headline": "The Sacred Scrolls of Degen Casino: Whitepaper on Tokenomics and Provably Fair Protocol",
              "image": "https://degenheart.casino/png/images/casino.png",
              "datePublished": "${publishDate}",
              "dateModified": "${new Date().toISOString().slice(0, 10)}",
              "author": {
                "@type": "Person",
                "name": "${authorName}",
                "url": "https://x.com/DegenWithHeart"
              },
              "publisher": {
                "@type": "Organization",
                "name": "${organizationName}",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://degenheart.casino/png/images/logo.png"
                }
              },
              "description": "Comprehensive technical whitepaper for DegenHeart Casino, detailing the 100% on-chain architecture, Gamba Protocol integration, DGHRT tokenomics, and commitment to provable fairness.",
              "articleSection": ["Overview", "Tokenomics", "Provable Fairness", "Roadmap"]
            },
            // --- 2. FAQ Page Schema (For Rich Snippets) ---
            {
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What are the gas fees for playing DegenHeart Casino?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Gas fees are low as DegenHeart is built on Solana, which offers high performance and minimal transaction costs compared to other blockchains like Ethereum."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How do I secure my wallet while gambling?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "For security, we recommend using hardware wallets (like Ledger or Trezor) for storing large amounts of cryptocurrency while engaging in any decentralized application (DApp)."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is DegenHeart Casino scalable?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, DegenHeart Casino is built on Solana, a blockchain capable of handling over 50,000 transactions per second (TPS), ensuring high scalability and fast transaction finality."
                  }
                }
              ]
            }
          ]
        }`}
      </script>

      <UnifiedPageContainer $colorScheme={currentColorScheme}>
        <UnifiedPageTitle $colorScheme={currentColorScheme}>🕯️ The Sacred Scrolls of Degen Casino 🕯️</UnifiedPageTitle>
        <UnifiedSubtitle $colorScheme={currentColorScheme}>
          This isn't just a casino, it's a serenade of risk, a love letter to the chain, written in the flickering candlelight of our digital temple.
        </UnifiedSubtitle>

        <UnifiedSection $colorScheme={currentColorScheme}>
          <Tabs $colorScheme={currentColorScheme}>
            {tabs.map(tab => (
              <button
                key={tab}
                className={activeTab === tab ? 'active' : ''}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </Tabs>
        </UnifiedSection>

        <UnifiedSection $colorScheme={currentColorScheme}>
          <UnifiedContent $colorScheme={currentColorScheme}>
            {activeTab === 'Overview' && (
              <>
                <UnifiedSectionTitle $colorScheme={currentColorScheme}>🏛️ The Palace of Chance 🏛️</UnifiedSectionTitle>
                <p><strong>Degen Casino</strong> is the on-chain rebellion, a symphony of risk where every bet becomes a verse in our eternal ballad.</p>
                <p>Just provably fair games, settled instantly by code, not committees, pure, unadulterated blockchain poetry.</p>

                <UnifiedSectionTitle $colorScheme={currentColorScheme}>💫 Our Sacred Mission 💫</UnifiedSectionTitle>
                <p><em>I don't build for VCs or hype cycles, I build for the trenches, where real degens bleed and dream.</em></p>
                <p>Everything is self-funded. No treasury. No presale. No shortcuts. This is for the unsponsored souls who dance with the blockchain's heartbeat.</p>

                <UnifiedSectionTitle $colorScheme={currentColorScheme}>🎭 The Enchanted Mechanics 🎭</UnifiedSectionTitle>
                <ul>
                  <li>Integrated with <strong>Gamba SDK</strong>, the open standard for on-chain casinos, our trusted conductor.</li>
                  <li>Pure frontend (Vite), no backend. Everything runs in the browser, as transparent as a lover's gaze.</li>
                  <li>Provably fair randomness. Fully on-chain liquidity. Unstoppable gameplay that flows like a midnight serenade.</li>
                </ul>

                <UnifiedSectionTitle $colorScheme={currentColorScheme}>🏗️ Technical Foundation 🏗️</UnifiedSectionTitle>
                <p>DegenHeart Casino is built on Solana's high-performance blockchain and Gamba SDK v2, ensuring all core operations are decentralized and verifiable.</p>
                <p><strong>Architecture Overview:</strong></p>
                <pre style={{ background: 'rgba(0,0,0,0.1)', padding: '10px', borderRadius: '5px', fontSize: '0.9em' }}>
                  {`BrowserRouter
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
                                         └─ App`}
                </pre>
                <p>Unlike hybrid platforms, DegenHeart runs 100% on-chain for core operations, with edge functions serving only as performance enhancers for RPC proxying and caching.</p>
              </>
            )}

            {activeTab === 'Market Differentiation' && (
              <>
                <UnifiedSectionTitle $colorScheme={currentColorScheme}>⚔️ Market Differentiation ⚔️</UnifiedSectionTitle>
                <p>DegenHeart Casino stands apart in the Web3 gaming landscape through its uncompromising commitment to decentralization, technical excellence, and immersive user experience.</p>

                <UnifiedSectionTitle $colorScheme={currentColorScheme}>Vs. Traditional Web2 Casinos</UnifiedSectionTitle>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                  <thead>
                    <tr>
                      <th style={{ border: '1px solid #ccc', padding: '8px' }}>Aspect</th>
                      <th style={{ border: '1px solid #ccc', padding: '8px' }}>Traditional Casinos</th>
                      <th style={{ border: '1px solid #ccc', padding: '8px' }}>DegenHeart Casino</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}>Trust Model</td>
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}>Centralized operators, opaque RNG</td>
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}>Blockchain-verifiable randomness & smart contracts</td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}>User Control</td>
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}>Accounts, KYC, withdrawal delays</td>
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}>Self-custodial wallets, instant payouts</td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}>Transparency</td>
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}>Proprietary server-side logic</td>
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}>Publicly auditable on-chain outcomes</td>
                    </tr>
                  </tbody>
                </table>

                <UnifiedSectionTitle $colorScheme={currentColorScheme}>Vs. Other Web3 Casinos</UnifiedSectionTitle>
                <ul>
                  <li><strong>Chain Performance:</strong> Solana's speed vs. Ethereum's high fees and slow transactions.</li>
                  <li><strong>Technical Depth:</strong> Enterprise architecture, 3D graphics, physics simulations vs. basic 2D interfaces.</li>
                  <li><strong>Game Variety:</strong> 16+ complex games vs. 3-5 simple offerings.</li>
                  <li><strong>Infrastructure:</strong> Intelligent RPC failover, edge computing, monitoring vs. failure-prone setups.</li>
                </ul>

                <UnifiedSectionTitle $colorScheme={currentColorScheme}>Vs. Key Web3 Casino Competitors</UnifiedSectionTitle>
                <p><em>Note: While these competitors operate in the Web3 space, most incorporate Web2 elements (e.g., centralized support, optional KYC, hybrid interfaces), making them Web2.5 hybrids. DegenHeart Casino maintains a stricter Web3-only approach with no accounts, no KYC, and pure on-chain operations.</em></p>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                  <thead>
                    <tr>
                      <th style={{ border: '1px solid #ccc', padding: '8px' }}>Competitor</th>
                      <th style={{ border: '1px solid #ccc', padding: '8px' }}>Key Features</th>
                      <th style={{ border: '1px solid #ccc', padding: '8px' }}>DegenHeart Differentiation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}>Competitor A</td>
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}>Solana-based, provably fair, standard casino games, sports betting (Web2.5: centralized support, affiliate system)</td>
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}>3D immersive graphics, physics simulations, enterprise architecture vs. Competitor A's 2D interface; stricter Web3 purity</td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}>Competitor B</td>
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}>Solana casino, sports betting focus, live dealer games, affiliate program (Web2.5: email support, optional KYC)</td>
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}>16+ custom games with 3D/audio, no sports betting, focus on pure casino experience; no KYC, wallet-only</td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}>Competitor C</td>
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}>Multi-chain support, extensive game library, live casino, NFT marketplace (Web2.5: centralized chat, support tickets)</td>
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}>Solana-exclusive, 3D environments, lower fees, community-driven vs. Competitor C's broader but less immersive approach</td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}>Competitor D</td>
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}>Solana casino, unique pig-themed branding, standard games, community features (Web2.5: Discord support, hybrid UI)</td>
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}>Advanced 3D graphics, physics, audio integration, enterprise infrastructure vs. Competitor D's standard game library and simpler technical stack</td>
                    </tr>
                  </tbody>
                </table>
              </>
            )}

            {activeTab === 'Token' && (
              <>
                <UnifiedSectionTitle $colorScheme={currentColorScheme}>💎 The Heart Token: $DGHRT 💎</UnifiedSectionTitle>
                <p><strong>$DGHRT</strong> is the emotional and financial heartbeat of our casino sanctuary, pulsing with the rhythm of true degen passion.</p>
                <ul>
                  <li><strong>Bet with your soul</strong> on exclusive house-edge games that test the limits of fortune.</li>
                  <li><strong>Hold it close</strong> to unlock community access & features that reveal themselves like hidden chambers.</li>
                  <li><strong>Trade it freely</strong> on-chain (Raydium), or hold like a real Degen who understands the deeper meaning.</li>
                </ul>

                <UnifiedSectionTitle $colorScheme={currentColorScheme}>🌟 The Tokenomics of Love 🌟</UnifiedSectionTitle>
                <ul>
                  <li><strong>Max Supply:</strong> 1,000,000,000 $DGHRT, a universe of possibilities</li>
                  <li><strong>No Presale</strong>, no team, no dev wallet, no VC allocation, pure, unfiltered creation</li>
                  <li><strong>Use:</strong> Bets, merch, future airdrops, the tools of our shared destiny</li>
                </ul>

              </>
            )}

            {activeTab === 'Fairness' && (
              <>
                <UnifiedSectionTitle $colorScheme={currentColorScheme}>⚖️ No Middlemen, Just Sacred Code ⚖️</UnifiedSectionTitle>
                <p>No gimmicks. No bonuses. No custodians. Just the pure, unfiltered truth of the blockchain.</p>
                <p>Every transaction settles on-chain, powered by Solana + Gamba contracts, our eternal witnesses.</p>

                <UnifiedSectionTitle $colorScheme={currentColorScheme}>🎭 Fairness & Transparency 🎭</UnifiedSectionTitle>
                <ul>
                  <li>Contracts are audited or community-reviewed, like sacred texts examined by scholars.</li>
                  <li>Open-source core, inspect, verify, fork, our code is as open as our hearts.</li>
                  <li>Trustless rails. No hidden edges. What you see is what runs, transparent as crystal.</li>
                </ul>

                <UnifiedSectionTitle $colorScheme={currentColorScheme}>🔍 Technical Provable Fairness 🔍</UnifiedSectionTitle>
                <p>DegenHeart uses Gamba SDK v2's provable fairness system, where randomness is derived from blockchain data (block hashes, timestamps) rather than centralized RNG servers.</p>
                <p><strong>How It Works:</strong></p>
                <ul>
                  <li>Each bet generates a unique seed from on-chain state.</li>
                  <li>Outcomes are computed deterministically from this seed, verifiable by anyone.</li>
                  <li>Client-side deterministic RNG ensures visual consistency without affecting fairness.</li>
                </ul>
                <p><strong>Verification:</strong> Users can audit outcomes via Solana Explorer or our platform's transaction history. No audit reports yet, but community reviews welcome.</p>
              </>
            )}

            {activeTab === 'Roadmap' && (
              <>
                <UnifiedSectionTitle $colorScheme={currentColorScheme}>👑 Your Identity: The Degen With Heart 👑</UnifiedSectionTitle>
                <p><strong>"Building is my love language."</strong></p>
                <p>I'm <strong>Stuart / @DegenWithHeart</strong>, a full-stack dev with code in my veins and DeFi in my chest, crafting digital realms from pure passion.</p>
                <ul>
                  <li>Self-funded. Unsponsored. Unshilled., A true artisan of the blockchain.</li>
                  <li>I live where tech meets art, risk meets rhythm, creation meets destiny.</li>
                  <li>Motto: <em>DYOR. NFA.</em>, Words to live by in our unpredictable world.</li>
                  <li>I don't build hype, I build legacy, one line of code at a time.</li>
                </ul>

                <UnifiedSectionTitle $colorScheme={currentColorScheme}>🌐 Web3 Ethos 🌐</UnifiedSectionTitle>
                <p>DegenHeart rejects Web2 elements: no accounts, no custodians, no middlemen. Everything is decentralized, transparent, and user-controlled. Blockchain enables pseudonymous participation without KYC, instant payouts, and auditable fairness.</p>

                <UnifiedSectionTitle $colorScheme={currentColorScheme}>🗺️ The Roadmap of Dreams 🗺️</UnifiedSectionTitle>
                <ul>
                  <li>✅ <strong>Q3 2025:</strong> Launch Vite-based frontend with fully on-chain gameplay, our foundation stone</li>
                  <li>✅ <strong>Q4 2025:</strong> Add Mobile UI + UI polish, live stats, jackpot support, refining our masterpiece</li>
                  <li>🔜 <strong>Q3 2026:</strong> Launch $DGHRT token, the heartbeat begins</li>
                  <li>🔜 <strong>Q4 2026:</strong> Raydium DEX listing, joining the greater ecosystem</li>
                  <li>🔜 <strong>Q2 2027:</strong> Mobile App + Telegram game integrations, expanding our reach</li>
                </ul>

                <UnifiedSectionTitle $colorScheme={currentColorScheme}>🔗 Web3 Purity Roadmap 🔗</UnifiedSectionTitle>
                <ul>
                  <li>🔜 <strong>Q1 2028:</strong> Achieve full decentralization by removing all centralized dependencies.</li>
                  <li>🔜 <strong>Q4 2028:</strong> Zero centralized servers, pure on-chain operation.</li>
                </ul>

                <UnifiedSectionTitle $colorScheme={currentColorScheme}>🔗 Sacred Links 🔗</UnifiedSectionTitle>
                <ul>
                  <li><a href="https://gamba.so" target="_blank" rel="noopener noreferrer">Gamba SDK</a>, Our trusted foundation</li>
                  <li><a href="https://github.com/degenwithheart" target="_blank" rel="noopener noreferrer">GitHub</a>, The forge of our creation</li>
                  <li><a href="https://x.com/DegenWithHeart" target="_blank" rel="noopener noreferrer">X Profile</a>, My digital voice</li>
                </ul>

                <UnifiedSectionTitle $colorScheme={currentColorScheme}>📊 Performance & Links 📊</UnifiedSectionTitle>
                <ul>
                  <li><strong>Performance:</strong> Sub-1s load times, 99.9% uptime via edge failover.</li>
                  <li><a href="https://explorer.solana.com" target="_blank" rel="noopener noreferrer">Solana Explorer</a>, Audit transactions.</li>
                  <li><a href="https://github.com/degenwithheart/DegenCasino" target="_blank" rel="noopener noreferrer">Full Repo</a>, Open-source code.</li>
                </ul>

                <UnifiedSectionTitle $colorScheme={currentColorScheme}>❓ FAQ ❓</UnifiedSectionTitle>
                <ul>
                  <li><strong>Gas Fees?</strong> Low on Solana vs. Ethereum.</li>
                  <li><strong>Wallet Security?</strong> Use hardware wallets for large amounts.</li>
                  <li><strong>Scalability?</strong> Solana handles 50k+ TPS.</li>
                </ul>
              </>
            )}
          </UnifiedContent>
        </UnifiedSection>
      </UnifiedPageContainer>
    </>
  );
};

export default WhitepaperTabs;