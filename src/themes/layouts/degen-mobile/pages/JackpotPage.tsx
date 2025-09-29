import React from 'react'
import { useNavigate } from 'react-router-dom'
import { usePageSEO } from '../../../../hooks/ui/useGameSEO'
import { useCurrentPool, useCurrentToken, TokenValue, FAKE_TOKEN_MINT, useGambaPlatformContext, GambaUi } from 'gamba-react-ui-v2'
import { useWallet } from '@solana/wallet-adapter-react'
import { BPS_PER_WHOLE } from 'gamba-core-v2'
import { PLATFORM_JACKPOT_FEE_BPS, PLATFORM_JACKPOT_FEE } from '../../../../constants'
import styled from 'styled-components'
import { 
  ModalOverlay, 
  ModalContainer, 
  Header, 
  Title, 
  CloseButton, 
  Content
} from '../components/ModalComponents'

// Custom jackpot components - no default theme dependencies
const JackpotGrid = styled.div`
  display: grid;
  gap: 16px;
  margin-bottom: 24px;
`

const JackpotCard = styled.div`
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 140, 0, 0.05));
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  backdrop-filter: blur(8px);
  
  .amount {
    font-size: 2rem;
    font-weight: 900;
    background: linear-gradient(135deg, #ffd700, #ffed4e);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 8px;
    text-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
  }
  
  .label {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .game {
    color: #ffd700;
    font-weight: 600;
    margin-top: 4px;
  }
`

const PlayButton = styled.button`
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #ffd700, #ffb300);
  border: none;
  border-radius: 12px;
  color: #000;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 24px;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 215, 0, 0.3);
  }
`

const JackpotToggleSection = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  padding: 20px;
  margin-top: 24px;
  border: 1px solid rgba(255, 215, 0, 0.2);
`

const ToggleHeader = styled.h3`
  color: #ffd700;
  margin-bottom: 16px;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 8px;
`

const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`

const ToggleLabel = styled.div`
  flex: 1;
  
  .title {
    color: #fff;
    font-weight: 600;
    margin-bottom: 4px;
  }
  
  .subtitle {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.85rem;
    line-height: 1.4;
  }
`

const StatusBadge = styled.div<{ $enabled: boolean }>`
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-left: 12px;
  
  \${({ $enabled }) => $enabled ? \`
    background: rgba(34, 197, 94, 0.2);
    color: #22c55e;
    border: 1px solid rgba(34, 197, 94, 0.3);
  \` : \`
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.3);
  \`}
`

export default function JackpotPage() {
  const navigate = useNavigate()
  const pool = useCurrentPool()
  const token = useCurrentToken()
  const { connected } = useWallet()
  const context = useGambaPlatformContext()

  // SEO optimization
  usePageSEO(
    'Jackpot - DegenHeart Casino',
    'Check current jackpot amounts and biggest wins at DegenHeart Casino'
  )

  const handleClose = () => {
    navigate(-1)
  }

  // Real jackpot data from pool
  const currentJackpot = pool?.jackpotBalance || 0
  const maxPayout = pool?.maxPayout || 0
  const jackpotFeePercentage = (PLATFORM_JACKPOT_FEE_BPS / BPS_PER_WHOLE * 100).toFixed(2)

  return (
    <>
      <ModalOverlay onClick={handleClose}>
        <ModalContainer 
          $variant="jackpot"
          onClick={(e) => e.stopPropagation()}
        >
          <Header $variant="jackpot">
            <Title $variant="jackpot" $icon="🎰">
              Jackpot
            </Title>
            <CloseButton $variant="jackpot" onClick={handleClose} />
          </Header>
          
          <Content>
            <JackpotGrid>
              <JackpotCard>
                <div className="amount">
                  {connected && pool?.jackpotBalance ? (
                    <TokenValue amount={currentJackpot} />
                  ) : (
                    'Connect to view'
                  )}
                </div>
                <div className="label">Current Jackpot</div>
                <div className="game">All Games</div>
              </JackpotCard>
              
              <JackpotCard>
                <div className="amount">
                  {connected && pool?.maxPayout ? (
                    <TokenValue amount={maxPayout} />
                  ) : (
                    'Connect to view'
                  )}
                </div>
                <div className="label">Max Payout</div>
                <div className="game">Per Game</div>
              </JackpotCard>
              
              <JackpotCard>
                <div className="amount">{jackpotFeePercentage}%</div>
                <div className="label">Pool Fee</div>
                <div className="game">Per Bet</div>
              </JackpotCard>
            </JackpotGrid>

            {connected && (
              <JackpotToggleSection>
                <ToggleHeader>
                  ⚙️ Jackpot Participation
                </ToggleHeader>
                <ToggleRow>
                  <ToggleLabel>
                    <div className="title">Jackpot Contribution</div>
                    <div className="subtitle">
                      {context.defaultJackpotFee > 0
                        ? "Currently enabled – you contribute and are eligible to win"
                        : 'Currently disabled – you won\'t contribute and are not eligible to win'}
                    </div>
                  </ToggleLabel>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <StatusBadge $enabled={context.defaultJackpotFee > 0}>
                      {context.defaultJackpotFee === 0 ? 'DISABLED' : 'ENABLED'}
                    </StatusBadge>
                    <GambaUi.Switch
                      checked={context.defaultJackpotFee > 0}
                      onChange={(checked) =>
                        context.setDefaultJackpotFee(checked ? PLATFORM_JACKPOT_FEE : 0)
                      }
                    />
                  </div>
                </ToggleRow>
                <div style={{ 
                  fontSize: '0.8rem', 
                  color: 'rgba(255, 255, 255, 0.6)',
                  textAlign: 'center',
                  fontStyle: 'italic'
                }}>
                  May the odds be ever in your favor! 🍀
                </div>
              </JackpotToggleSection>
            )}

            <PlayButton onClick={() => navigate('/')}>
              🎲 Start Playing for Jackpot
            </PlayButton>
          </Content>
        </ModalContainer>
      </ModalOverlay>
    </>
  )
}
