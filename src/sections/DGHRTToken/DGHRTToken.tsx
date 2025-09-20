import React, { useState, useEffect } from 'react'
import { useColorScheme } from '../../themes/ColorSchemeContext'
import {
  UnifiedResponsiveContainer,
  UnifiedPageContainer,
  UnifiedPageTitle,
  UnifiedSectionHeading,
  UnifiedContent,
  UnifiedCard,
  UnifiedGrid,
  UnifiedStat
} from '../../components/UI/UnifiedStyles'
import {
  TokenHeader,
  BuySection
} from './DGHRTToken.styles'

const DGHRTTokenPage: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const { currentColorScheme } = useColorScheme()

  useEffect(() => {
    setVisible(true)
  }, [])

  return (
    <UnifiedResponsiveContainer>
      <UnifiedPageContainer visible={visible}>
        <TokenHeader>
          <img 
            src="/png/images/$DGHRT.png" 
            alt="DGHRT Token" 
            className="token-logo"
            style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              border: '3px solid #ffd700',
              marginBottom: '2rem'
            }}
            onError={(e) => {
              // Fallback if image doesn't exist
              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiByeD0iNzUiIGZpbGw9InVybCgjZ3JhZGllbnQwX2xpbmVhcl8xXzEpIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50MF9saW5lYXJfMV8xIiB4MT0iMCIgeTE9IjAiIHgyPSIxNTAiIHkyPSIxNTAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iI2Q0YTU3NCIvPgo8c3RvcCBvZmZzZXQ9IjAuNSIgc3RvcC1jb2xvcj0iI2I4MzY2YSIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNkNGE1NzQiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8dGV4dCB4PSI3NSIgeT0iODAiIGZpbGw9IndoaXRlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZvbnQtd2VpZ2h0PSJib2xkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn5KOPC90ZXh0Pgo8L3N2Zz4K'
            }}
          />
          <UnifiedPageTitle>💎 $DGHRT Token 💎</UnifiedPageTitle>
          <p className="subtitle">
            <em>The Heart Token — emotional and financial heartbeat of Degen Casino</em>
          </p>
        </TokenHeader>

        <UnifiedGrid columns="repeat(auto-fit, minmax(250px, 1fr))">
          <UnifiedCard hover>
            <UnifiedStat>
              <h3>🏦 Max Supply</h3>
              <div className="stat-value">1B</div>
              <div className="stat-label">DGHRT Tokens</div>
            </UnifiedStat>
          </UnifiedCard>

          <UnifiedCard hover>
            <UnifiedStat>
              <h3>⏰ Launch Date</h3>
              <div className="stat-value">Q3 2026</div>
              <div className="stat-label">Planned Launch</div>
            </UnifiedStat>
          </UnifiedCard>

          <UnifiedCard hover>
            <UnifiedStat>
              <h3>🎯 Distribution</h3>
              <div className="stat-value">100%</div>
              <div className="stat-label">Via Gameplay Claims</div>
            </UnifiedStat>
          </UnifiedCard>
        </UnifiedGrid>

        <UnifiedCard>
          <UnifiedSectionHeading>🚀 Get $DGHRT Tokens</UnifiedSectionHeading>
          <UnifiedContent>
            <div style={{ 
              textAlign: 'center', 
              fontSize: '1.5rem', 
              fontWeight: '700',
              color: '#ffd700',
              marginBottom: '1rem'
            }}>
              Coming Q3 2026
            </div>
            <p>
              $DGHRT will be distributed 100% through gameplay. No presale, no team allocation, no VCs. 
              Every token is earned through your devotion to the casino — claim 100 tokens weekly per lost bet.
            </p>
            <p>
              Once launched, you'll be able to trade $DGHRT on Raydium DEX and use it for exclusive house-edge games, 
              governance voting, and future airdrops.
            </p>
          </UnifiedContent>
        </UnifiedCard>

        <UnifiedCard>
          <UnifiedSectionHeading>🌟 Tokenomics of Love</UnifiedSectionHeading>
          <UnifiedContent>
            <UnifiedGrid columns="repeat(auto-fit, minmax(300px, 1fr))">
              <div>
                <h4 style={{ color: '#ffd700', marginBottom: '0.5rem' }}>📊 Total Supply</h4>
                <p>1,000,000,000 $DGHRT — a universe of possibilities, all distributed through gameplay claims</p>
              </div>
              
              <div>
                <h4 style={{ color: '#ffd700', marginBottom: '0.5rem' }}>🎮 Earning Mechanism</h4>
                <p>Claim 100 tokens weekly per lost bet — loyalty rewards baked into code</p>
              </div>
              
              <div>
                <h4 style={{ color: '#ffd700', marginBottom: '0.5rem' }}>🚫 No Presale</h4>
                <p>Zero team allocation, no VC tokens, no dev wallet — pure, unfiltered creation</p>
              </div>
              
              <div>
                <h4 style={{ color: '#ffd700', marginBottom: '0.5rem' }}>📈 Fair Distribution</h4>
                <p>100% community-driven through gameplay — every tear becomes a token</p>
              </div>
              
              <div>
                <h4 style={{ color: '#ffd700', marginBottom: '0.5rem' }}>🔄 Emission Schedule</h4>
                <p>Weekly claimable rewards based on casino activity — rewards for the faithful</p>
              </div>
              
              <div>
                <h4 style={{ color: '#ffd700', marginBottom: '0.5rem' }}>💱 Trading</h4>
                <p>Will be tradeable on Raydium DEX post-launch — liquidity for true believers</p>
              </div>
            </UnifiedGrid>
          </UnifiedContent>
        </UnifiedCard>

        <UnifiedCard>
          <UnifiedSectionHeading>⚡ Token Utilities</UnifiedSectionHeading>
          <UnifiedContent>
            <ul style={{ paddingLeft: '1.5rem' }}>
              <li>Bet with your soul on exclusive house-edge games that test fortune's limits</li>
              <li>Unlock community access & features that reveal like hidden chambers</li>
              <li>Participate in governance — $DGHRT holders vote on future games and features</li>
              <li>Access to exclusive merchandise and limited edition items</li>
              <li>Eligibility for future airdrops and special events</li>
              <li>Premium support and early access to new game releases</li>
              <li>Stake for additional rewards and platform benefits</li>
              <li>Trade freely on-chain or hold like a true Degen who understands deeper meaning</li>
            </ul>
          </UnifiedContent>
        </UnifiedCard>
        
        <UnifiedCard>
          <UnifiedSectionHeading>🔗 Important Links</UnifiedSectionHeading>
          <UnifiedContent>
            <p>
              <strong>Contract Address:</strong> TBD (To be deployed Q3 2026)<br/>
              <strong>Network:</strong> Solana (SPL Token)<br/>
              <strong>Decimals:</strong> 9<br/>
              <strong>Creator:</strong> @DegenWithHeart — Self-funded, unsponsored, building with passion
            </p>
            <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', opacity: 0.8, fontStyle: 'italic' }}>
              Remember: DYOR. NFA. This is not financial advice. 
              Build is my love language — I craft digital realms from pure passion.
            </p>
          </UnifiedContent>
        </UnifiedCard>
      </UnifiedPageContainer>
    </UnifiedResponsiveContainer>
  )
}

export default DGHRTTokenPage
