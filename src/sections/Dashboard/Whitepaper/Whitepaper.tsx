import React, { useState, useEffect } from 'react'
import { Container, Tabs, Section } from './Whitepaper.styles'

const tabs = ['Overview', 'Token', 'Fairness', 'Roadmap']

const WhitepaperTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Overview')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
  }, [])

  return (
    <Container visible={visible}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📖 Whitepaper</h1>
      <p style={{ fontStyle: 'italic', color: '#ccc', marginBottom: '2rem' }}>
        This isn’t just a casino — it’s a serenade of risk, a love letter to the chain.
      </p>

      <Tabs>
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

      {activeTab === 'Overview' && (
        <Section>
          <h2>Overview</h2>
          <p><strong>Degen Casino</strong> is the on-chain rebellion. No treasury. No wait times. No fluff.</p>
          <p>Just provably fair games, settled instantly by code, not committees.</p>
          <h2>Mission Statement</h2>
          <p><em>I don’t build for VCs or hype cycles — I build for the trenches.</em></p>
          <p>Everything is self-funded. No presale. No shortcuts. This is for the unsponsored.</p>
          <h2>How It Works</h2>
          <ul>
            <li>Integrated with <strong>Gamba SDK</strong> — the open standard for on-chain casinos.</li>
            <li>Pure frontend (Vite), no backend. Everything runs in the browser.</li>
            <li>Provably fair randomness. Fully on-chain liquidity. Unstoppable gameplay.</li>
          </ul>
        </Section>
      )}

      {activeTab === 'Token' && (
        <Section>
          <h2>The Token: $DGHRT</h2>
          <p><strong>$DGHRT</strong> is the emotional and financial heartbeat of the casino.</p>
          <ul>
            <li><strong>Use it to bet</strong> on exclusive house-edge games.</li>
            <li><strong>Claim 100 tokens</strong> weekly per lost bet — loyalty baked into code.</li>
            <li><strong>Hold it</strong> to unlock community access & features down the line.</li>
            <li><strong>Trade it</strong> on-chain (Raydium), or hold like a real Degen.</li>
          </ul>

          <h2>Tokenomics</h2>
          <ul>
            <li><strong>Max Supply:</strong> 1,000,000,000 $DGHRT</li>
            <li><strong>100%</strong> distributed via in-game losses (claim mechanism)</li>
            <li><strong>No Presale</strong> — no team, no dev wallet, no VC allocation</li>
            <li><strong>Emission:</strong> Claimable weekly, based on activity</li>
            <li><strong>Use:</strong> Governance, bets, merch, future airdrops</li>
          </ul>
        </Section>
      )}

      {activeTab === 'Fairness' && (
        <Section>
          <h2>No Middlemen, Just Code</h2>
          <p>No gimmicks. No bonuses. No custodians.</p>
          <p>Every transaction settles on-chain — powered by Solana + Gamba contracts.</p>
          <h2>Fairness & Transparency</h2>
          <ul>
            <li>Contracts are audited or community-reviewed.</li>
            <li>Open-source core — inspect, verify, fork.</li>
            <li>Trustless rails. No hidden edges. What you see is what runs.</li>
          </ul>
        </Section>
      )}

      {activeTab === 'Roadmap' && (
        <Section>
          <h2>Your Identity: The Degen With Heart</h2>
          <p><strong>"Building is my love language."</strong></p>
          <p>I’m <strong>Stuart / @DegenWithHeart</strong> — a full-stack dev with code in my veins and DeFi in my chest.</p>
          <ul>
            <li>Self-funded. Unsponsored. Unshilled.</li>
            <li>I live where tech meets art, risk meets rhythm.</li>
            <li>Motto: <em>DYOR. NFA.</em></li>
            <li>I don’t build hype — I build legacy.</li>
          </ul>

          <h2>Roadmap</h2>
          <ul>
            <li>✅ <strong>Q3 2025:</strong> Launch Vite-based frontend with fully on-chain gameplay</li>
            <li>✅ <strong>Q4 2025:</strong> Add Mobile UI + UI polish, live stats, jackpot support</li>
            <li>🔜 <strong>Q3 2026:</strong> Launch $DGHRT token + claim system</li>
            <li>🔜 <strong>Q4 2026:</strong> Enable weekly claim page for loyal degens</li>
            <li>🔜 <strong>Q4 2026:</strong> Raydium DEX listing</li>
            <li>🔜 <strong>Q2 2027:</strong> Mobile App + Telegram game integrations</li>
            <li>🔜 <strong>Q4 2027:</strong> Governance phase — $DGHRT holders vote on future games</li>
          </ul>

          <h2>Links</h2>
          <ul>
            <li><a href="https://gamba.so/sdk" target="_blank" rel="noopener noreferrer">Gamba SDK</a></li>
            <li><a href="https://github.com/degenwithheart" target="_blank" rel="noopener noreferrer">GitHub</a></li>
            <li><a href="https://x.com/DegenWithHeart" target="_blank" rel="noopener noreferrer">X Profile</a></li>
          </ul>
        </Section>
      )}
    </Container>
  )
}

export default WhitepaperTabs
