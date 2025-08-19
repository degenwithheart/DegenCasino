import React, { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'

// Casino animations
const neonPulse = keyframes`
  0% { 
    box-shadow: 0 0 24px #a259ff88, 0 0 48px #ffd70044;
    border-color: #ffd70044;
    <Container visible={visible}>
      <h1 style={{ 
        fontFamily: "'Luckiest Guy', cursive",
        fontSize: '3rem', 
        marginBottom: '0.5rem',
        color: '#ffd700',
        textAlign: 'center',
        textShadow: '0 0 10px #ffd700, 0 0 20px #ffd700, 0 0 30px #ffd700, 2px 2px 4px rgba(0, 0, 0, 0.8)',
        position: 'relative'
      }}>
        ✨ 📖 Whitepaper 📖 ✨
      </h1>
      <p style={{ 
        fontStyle: 'italic', 
        color: '#ccc', 
        marginBottom: '2rem',
        textAlign: 'center',
        fontSize: '1.1rem',
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
      }}>
        This isn't just a casino — it's a serenade of risk, a love letter to the chain. 💖
      </p> 100% { 
    box-shadow: 0 0 48px #ffd700cc, 0 0 96px #a259ff88;
    border-color: #ffd700aa;
  }
`;

const moveGradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: rotate(0deg) scale(0.8); }
  50% { opacity: 1; transform: rotate(180deg) scale(1.2); }
`;

const SIDEBAR_WIDTH = 80;
interface ContainerProps {
  $compact?: boolean;
  visible?: boolean;
}
const Container = styled.div<ContainerProps>`
  max-width: 100vw;
  padding: ${({ $compact }) => ($compact ? '1rem' : '2rem')};
  margin: 2rem 0; /* Only vertical margins */
  border-radius: 24px;
  background: rgba(24, 24, 24, 0.8);
  backdrop-filter: blur(20px);
  box-shadow: 0 0 32px rgba(0, 0, 0, 0.4);
  border: 2px solid rgba(255, 215, 0, 0.2);
  color: white;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transform: ${({ visible }) => (visible ? 'translateY(0)' : 'translateY(20px)')};
  transition: opacity 1s ease, transform 1s ease;
  position: relative;

  @media (max-width: 900px) {
    margin: 1rem 0;
    padding: ${({ $compact }) => ($compact ? '0.5rem' : '1.5rem')};
    border-radius: 16px;
  }

  @media (max-width: 700px) {
    margin: 1rem 0;
    padding: ${({ $compact }) => ($compact ? '0.5rem' : '1rem')};
    border-radius: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 1rem 0.75rem;
    margin: 0.5rem 0;
    border-radius: 12px;
  }
  
  @media (max-width: 400px) {
    padding: 0.75rem 0.5rem;
    margin: 0.25rem 0;
    border-radius: 8px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 20%, rgba(255, 215, 0, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(162, 89, 255, 0.05) 0%, transparent 50%);
    pointer-events: none;
    z-index: -1;
    border-radius: 24px;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #ffd700, #a259ff, #ff00cc, #ffd700);
    background-size: 300% 100%;
    animation: ${moveGradient} 4s linear infinite;
    border-radius: 24px 24px 0 0;
    z-index: 1;
  }
`;

const Tabs = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;

  button {
    background: rgba(255, 215, 0, 0.1);
    border: 2px solid rgba(255, 215, 0, 0.3);
    color: #ffd700;
    padding: 0.75rem 1.5rem;
    border-radius: 12px;
    cursor: pointer;
    font-weight: bold;
    font-family: 'Luckiest Guy', cursive;
    font-size: 1rem;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.2), transparent);
      transition: left 0.5s ease;
    }

    &:hover {
      border-color: #ffd700;
      box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
      transform: translateY(-2px);

      &::before {
        left: 100%;
      }
    }

    &.active {
      background: linear-gradient(135deg, #ffd700, #ffed4e);
      color: #1a1a1a;
      border-color: #ffd700;
      box-shadow: 
        0 0 30px rgba(255, 215, 0, 0.6),
        inset 0 2px 10px rgba(255, 255, 255, 0.2);
      animation: ${neonPulse} 2s ease-in-out infinite alternate;
    }
  }

  @media (max-width: 768px) {
    gap: 0.5rem;
    button {
      font-size: 0.85rem;
      padding: 0.6rem 1rem;
    }
  }
`

const Section = styled.section`
  line-height: 1.7;
  font-size: 1rem;

  h2 {
    font-family: 'Luckiest Guy', cursive;
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    color: #ffd700;
    text-shadow: 
      0 0 10px #ffd700,
      0 0 20px #ffd700,
      2px 2px 4px rgba(0, 0, 0, 0.8);
    position: relative;
    padding-bottom: 0.5rem;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, #ffd700, #a259ff, #ffd700);
      background-size: 200% 100%;
      animation: ${moveGradient} 3s linear infinite;
      border-radius: 1px;
    }
  }

  p, ul {
    margin-bottom: 1rem;
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  }

  ul {
    padding-left: 1.25rem;
    list-style-type: none;
    
    li {
      position: relative;
      padding-left: 1.5rem;
      
      &::before {
        content: '💎';
        position: absolute;
        left: 0;
        top: 0;
        color: #ffd700;
        font-size: 0.8rem;
      }
    }
  }

  strong {
    font-weight: bold;
    color: #ffd700;
    text-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
  }

  em {
    font-style: italic;
    color: #a259ff;
  }

  a {
    color: #ffd700;
    text-decoration: none;
    transition: all 0.3s ease;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, #ffd700, #a259ff);
      transition: width 0.3s ease;
    }

    &:hover {
      text-shadow: 0 0 10px #ffd700;
      
      &::after {
        width: 100%;
      }
    }
  }

  @media (max-width: 768px) {
    font-size: 0.95rem;
    line-height: 1.6;

    h2 {
      font-size: 1.4rem;
    }
  }
`

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
          <p><strong>“Building is my love language.”</strong></p>
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
            <li>✅ <strong>Q3 2025:</strong> Add UI polish, live stats, jackpot support</li>
            <li>🔜 <strong>Q4 2025:</strong> Launch $DGHRT token + claim system</li>
            <li>🔜 <strong>Q4 2025:</strong> Enable weekly claim page for loyal degens</li>
            <li>🔜 <strong>Q2 2026:</strong> Raydium DEX listing</li>
            <li>🔜 <strong>Q3 2026:</strong> Mobile UI + Telegram game integrations</li>
            <li>🔜 <strong>04 2026:</strong> Governance phase — $DGHRT holders vote on future games</li>
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
