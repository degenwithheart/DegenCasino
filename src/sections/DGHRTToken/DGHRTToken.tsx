import React, { useState, useEffect } from 'react'
import { useColorScheme } from '../../themes/ColorSchemeContext'
import {
  Container,
  TokenHeader,
  TokenStats,
  StatCard,
  BuySection,
  TokenomicsSection,
  UtilitySection,
  ResponsiveContainer
} from './DGHRTToken.styles'

const DGHRTTokenPage: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const { currentColorScheme } = useColorScheme()

  useEffect(() => {
    setVisible(true)
  }, [])

  return (
    <ResponsiveContainer>
      <Container visible={visible} $colorScheme={currentColorScheme}>
        <TokenHeader>
          <img 
            src="/png/images/$DGHRT.png" 
            alt="DGHRT Token" 
            className="token-logo"
            onError={(e) => {
              // Fallback if image doesn't exist
              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiByeD0iNzUiIGZpbGw9InVybCgjZ3JhZGllbnQwX2xpbmVhcl8xXzEpIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50MF9saW5lYXJfMV8xIiB4MT0iMCIgeTE9IjAiIHgyPSIxNTAiIHkyPSIxNTAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iI2Q0YTU3NCIvPgo8c3RvcCBvZmZzZXQ9IjAuNSIgc3RvcC1jb2xvcj0iI2I4MzY2YSIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNkNGE1NzQiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8dGV4dCB4PSI3NSIgeT0iODAiIGZpbGw9IndoaXRlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZvbnQtd2VpZ2h0PSJib2xkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn5KOPC90ZXh0Pgo8L3N2Zz4K'
            }}
          />
          <h1>💎 $DGHRT Token 💎</h1>
          <p className="subtitle">
            <em>The Heart Token — emotional and financial heartbeat of Degen Casino</em>
          </p>
        </TokenHeader>

        <TokenStats>
          <StatCard $colorScheme={currentColorScheme}>
            <h3>🏦 Max Supply</h3>
            <div className="stat-value">1B</div>
            <div className="stat-label">DGHRT Tokens</div>
          </StatCard>

          <StatCard $colorScheme={currentColorScheme}>
            <h3>⏰ Launch Date</h3>
            <div className="stat-value">Q3 2026</div>
            <div className="stat-label">Planned Launch</div>
          </StatCard>

          <StatCard $colorScheme={currentColorScheme}>
            <h3>🎯 Distribution</h3>
            <div className="stat-value">100%</div>
            <div className="stat-label">Via Gameplay Claims</div>
          </StatCard>
        </TokenStats>

        <BuySection $colorScheme={currentColorScheme}>
          <h2>🚀 Get $DGHRT Tokens</h2>
          <div className="coming-soon">Coming Q3 2026</div>
          <div className="description">
            $DGHRT will be distributed 100% through gameplay. No presale, no team allocation, no VCs. 
            Every token is earned through your devotion to the casino — claim 100 tokens weekly per lost bet.
          </div>
          <div className="description">
            Once launched, you'll be able to trade $DGHRT on Raydium DEX and use it for exclusive house-edge games, 
            governance voting, and future airdrops.
          </div>
        </BuySection>

        <TokenomicsSection $colorScheme={currentColorScheme}>
          <h2>🌟 Tokenomics of Love</h2>
          <div className="tokenomics-grid">
            <div className="tokenomics-item">
              <h4>📊 Total Supply</h4>
              <p>1,000,000,000 $DGHRT — a universe of possibilities, all distributed through gameplay claims</p>
            </div>
            
            <div className="tokenomics-item">
              <h4>🎮 Earning Mechanism</h4>
              <p>Claim 100 tokens weekly per lost bet — loyalty rewards baked into code</p>
            </div>
            
            <div className="tokenomics-item">
              <h4>🚫 No Presale</h4>
              <p>Zero team allocation, no VC tokens, no dev wallet — pure, unfiltered creation</p>
            </div>
            
            <div className="tokenomics-item">
              <h4>📈 Fair Distribution</h4>
              <p>100% community-driven through gameplay — every tear becomes a token</p>
            </div>
            
            <div className="tokenomics-item">
              <h4>🔄 Emission Schedule</h4>
              <p>Weekly claimable rewards based on casino activity — rewards for the faithful</p>
            </div>
            
            <div className="tokenomics-item">
              <h4>💱 Trading</h4>
              <p>Will be tradeable on Raydium DEX post-launch — liquidity for true believers</p>
            </div>
          </div>
        </TokenomicsSection>

        <UtilitySection $colorScheme={currentColorScheme}>
          <h2>⚡ Token Utilities</h2>
          <ul className="utility-list">
            <li>Bet with your soul on exclusive house-edge games that test fortune's limits</li>
            <li>Unlock community access & features that reveal like hidden chambers</li>
            <li>Participate in governance — $DGHRT holders vote on future games and features</li>
            <li>Access to exclusive merchandise and limited edition items</li>
            <li>Eligibility for future airdrops and special events</li>
            <li>Premium support and early access to new game releases</li>
            <li>Stake for additional rewards and platform benefits</li>
            <li>Trade freely on-chain or hold like a true Degen who understands deeper meaning</li>
          </ul>
        </UtilitySection>
        
        <BuySection $colorScheme={currentColorScheme}>
          <h2>🔗 Important Links</h2>
          <div className="description">
            <strong>Contract Address:</strong> TBD (To be deployed Q3 2026)<br/>
            <strong>Network:</strong> Solana (SPL Token)<br/>
            <strong>Decimals:</strong> 9<br/>
            <strong>Creator:</strong> @DegenWithHeart — Self-funded, unsponsored, building with passion
          </div>
          <div className="description" style={{ marginTop: '1.5rem', fontSize: '0.9rem', opacity: 0.8 }}>
            <em>Remember: DYOR. NFA. This is not financial advice. 
            Build is my love language — I craft digital realms from pure passion.</em>
          </div>
        </BuySection>
      </Container>
    </ResponsiveContainer>
  )
}

export default DGHRTTokenPage
