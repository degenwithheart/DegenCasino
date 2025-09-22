import React, { useState, useEffect } from 'react'
import { useColorScheme } from '../../../themes/ColorSchemeContext'
import { usePageSEO } from '../../../hooks/ui/useGameSEO'
import { 
  UnifiedPageContainer, 
  UnifiedPageTitle, 
  UnifiedSubtitle,
  UnifiedSection, 
  UnifiedSectionTitle, 
  UnifiedContent
} from '../../../components/UI/UnifiedDesign'
import { Tabs } from './Whitepaper.styles'

const tabs = ['Overview', 'Token', 'Fairness', 'Roadmap']

const WhitepaperTabs: React.FC = () => {
  // SEO for Whitepaper page
  const seoHelmet = usePageSEO(
    "Whitepaper", 
    "Read our complete whitepaper with tokenomics, fairness algorithms, and roadmap for DegenHeart Casino"
  )

  const [activeTab, setActiveTab] = useState('Overview')
  const [visible, setVisible] = useState(false)
  const { currentColorScheme } = useColorScheme()

  useEffect(() => {
    setVisible(true)
  }, [])

  return (
    <>
      {seoHelmet}
      <UnifiedPageContainer $colorScheme={currentColorScheme}>
        <UnifiedPageTitle $colorScheme={currentColorScheme}>🕯️ The Sacred Scrolls of Degen Casino 🕯️</UnifiedPageTitle>
        <UnifiedSubtitle $colorScheme={currentColorScheme}>
          This isn't just a casino — it's a serenade of risk, a love letter to the chain, written in the flickering candlelight of our digital temple.
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
                <p>Just provably fair games, settled instantly by code, not committees — pure, unadulterated blockchain poetry.</p>
                
                <UnifiedSectionTitle $colorScheme={currentColorScheme}>💫 Our Sacred Mission 💫</UnifiedSectionTitle>
                <p><em>I don't build for VCs or hype cycles — I build for the trenches, where real degens bleed and dream.</em></p>
                <p>Everything is self-funded. No treasury. No presale. No shortcuts. This is for the unsponsored souls who dance with the blockchain's heartbeat.</p>
                
                <UnifiedSectionTitle $colorScheme={currentColorScheme}>🎭 The Enchanted Mechanics 🎭</UnifiedSectionTitle>
                <ul>
                  <li>Integrated with <strong>Gamba SDK</strong> — the open standard for on-chain casinos, our trusted conductor.</li>
                  <li>Pure frontend (Vite), no backend. Everything runs in the browser, as transparent as a lover's gaze.</li>
                  <li>Provably fair randomness. Fully on-chain liquidity. Unstoppable gameplay that flows like a midnight serenade.</li>
                </ul>
              </>
            )}

            {activeTab === 'Token' && (
              <>
                <UnifiedSectionTitle $colorScheme={currentColorScheme}>💎 The Heart Token: $DGHRT 💎</UnifiedSectionTitle>
                <p><strong>$DGHRT</strong> is the emotional and financial heartbeat of our casino sanctuary, pulsing with the rhythm of true degen passion.</p>
                <ul>
                  <li><strong>Bet with your soul</strong> on exclusive house-edge games that test the limits of fortune.</li>
                  <li><strong>Claim 100 tokens</strong> weekly per lost bet — loyalty baked into code, a reward for your devotion.</li>
                  <li><strong>Hold it close</strong> to unlock community access & features that reveal themselves like hidden chambers.</li>
                  <li><strong>Trade it freely</strong> on-chain (Raydium), or hold like a real Degen who understands the deeper meaning.</li>
                </ul>

                <UnifiedSectionTitle $colorScheme={currentColorScheme}>🌟 The Tokenomics of Love 🌟</UnifiedSectionTitle>
                <ul>
                  <li><strong>Max Supply:</strong> 1,000,000,000 $DGHRT — a universe of possibilities</li>
                  <li><strong>100%</strong> distributed via in-game losses (claim mechanism) — every tear becomes a token</li>
                  <li><strong>No Presale</strong> — no team, no dev wallet, no VC allocation — pure, unfiltered creation</li>
                  <li><strong>Emission:</strong> Claimable weekly, based on activity — rewards for the faithful</li>
                  <li><strong>Use:</strong> Governance, bets, merch, future airdrops — the tools of our shared destiny</li>
                </ul>
              </>
            )}

            {activeTab === 'Fairness' && (
              <>
                <UnifiedSectionTitle $colorScheme={currentColorScheme}>⚖️ No Middlemen, Just Sacred Code ⚖️</UnifiedSectionTitle>
                <p>No gimmicks. No bonuses. No custodians. Just the pure, unfiltered truth of the blockchain.</p>
                <p>Every transaction settles on-chain — powered by Solana + Gamba contracts, our eternal witnesses.</p>
                
                <UnifiedSectionTitle $colorScheme={currentColorScheme}>🎭 Fairness & Transparency 🎭</UnifiedSectionTitle>
                <ul>
                  <li>Contracts are audited or community-reviewed, like sacred texts examined by scholars.</li>
                  <li>Open-source core — inspect, verify, fork — our code is as open as our hearts.</li>
                  <li>Trustless rails. No hidden edges. What you see is what runs, transparent as crystal.</li>
                </ul>
              </>
            )}

            {activeTab === 'Roadmap' && (
              <>
                <UnifiedSectionTitle $colorScheme={currentColorScheme}>👑 Your Identity: The Degen With Heart 👑</UnifiedSectionTitle>
                <p><strong>"Building is my love language."</strong></p>
                <p>I'm <strong>Stuart / @DegenWithHeart</strong> — a full-stack dev with code in my veins and DeFi in my chest, crafting digital realms from pure passion.</p>
                <ul>
                  <li>Self-funded. Unsponsored. Unshilled. — A true artisan of the blockchain.</li>
                  <li>I live where tech meets art, risk meets rhythm, creation meets destiny.</li>
                  <li>Motto: <em>DYOR. NFA.</em> — Words to live by in our unpredictable world.</li>
                  <li>I don't build hype — I build legacy, one line of code at a time.</li>
                </ul>

                <UnifiedSectionTitle $colorScheme={currentColorScheme}>🗺️ The Roadmap of Dreams 🗺️</UnifiedSectionTitle>
                <ul>
                  <li>✅ <strong>Q3 2025:</strong> Launch Vite-based frontend with fully on-chain gameplay — our foundation stone</li>
                  <li>✅ <strong>Q4 2025:</strong> Add Mobile UI + UI polish, live stats, jackpot support — refining our masterpiece</li>
                  <li>🔜 <strong>Q3 2026:</strong> Launch $DGHRT token + claim system — the heartbeat begins</li>
                  <li>🔜 <strong>Q4 2026:</strong> Enable weekly claim page for loyal degens — rewarding the faithful</li>
                  <li>🔜 <strong>Q4 2026:</strong> Raydium DEX listing — joining the greater ecosystem</li>
                  <li>🔜 <strong>Q2 2027:</strong> Mobile App + Telegram game integrations — expanding our reach</li>
                  <li>🔜 <strong>Q4 2027:</strong> Governance phase — $DGHRT holders vote on future games — democracy in our hall</li>
                </ul>

                <UnifiedSectionTitle $colorScheme={currentColorScheme}>🔗 Sacred Links 🔗</UnifiedSectionTitle>
                <ul>
                  <li><a href="https://gamba.so/sdk" target="_blank" rel="noopener noreferrer">Gamba SDK</a> — Our trusted foundation</li>
                  <li><a href="https://github.com/degenwithheart" target="_blank" rel="noopener noreferrer">GitHub</a> — The forge of our creation</li>
                  <li><a href="https://x.com/DegenWithHeart" target="_blank" rel="noopener noreferrer">X Profile</a> — My digital voice</li>
                </ul>
              </>
            )}
          </UnifiedContent>
        </UnifiedSection>
      </UnifiedPageContainer>
    </>
  )
}

export default WhitepaperTabs