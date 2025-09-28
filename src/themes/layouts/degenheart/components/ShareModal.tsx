import { GambaTransaction } from 'gamba-core-v2'
import { GambaUi, TokenValue, useTokenMeta } from 'gamba-react-ui-v2'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import styled from 'styled-components'
import { Modal } from './Modal'
import { PLATFORM_SHARABLE_URL } from '../../../../constants'
import { extractMetadata } from '../../../../utils'

const Container = styled.div`
  max-width: 380px;
  padding: 20px;
  background: linear-gradient(135deg, 
    rgba(26, 26, 26, 0.95) 0%, 
    rgba(45, 27, 105, 0.9) 50%,
    rgba(26, 26, 26, 0.95) 100%
  );
  border: 2px solid #ffd700;
  border-radius: 16px;
  box-shadow: 
    0 0 50px rgba(255, 215, 0, 0.3),
    inset 0 0 30px rgba(162, 89, 255, 0.1);

  @media (max-width: 480px) {
    max-width: 300px;
    padding: 16px;
  }
`

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const GameResult = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  padding: 16px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid #ffd700;
  border-radius: 12px;
  margin-bottom: 12px;
`

const TokenIcon = styled.img`
  border-radius: 50%;
  height: 48px;
  width: 48px;
  border: 2px solid #ffd700;
`

const GameIcon = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  border: 2px solid #ffd700;
  object-fit: cover;
`

const ProfitDisplay = styled.div<{ $isProfit: boolean }>`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.$isProfit ? '#10b981' : '#ef4444'};
  text-align: center;

  .multiplier {
    font-size: 18px;
    font-weight: 600;
    margin-top: 4px;
    opacity: 0.9;
  }
`

const BrandingSection = styled.div`
  background: rgba(0, 0, 0, 0.6);
  color: #ffd700;
  font-style: italic;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #ffd700;
  font-size: 14px;

  img {
    height: 24px;
    width: 24px;
  }

  .platform-name {
    font-weight: 600;
    color: #a259ff;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`

interface ShareModalProps {
  event?: GambaTransaction<'GameSettled'>
  onClose: () => void
}

export const ShareModal: React.FC<ShareModalProps> = ({ event, onClose }) => {
  const { publicKey } = useWallet()
  const navigate = useNavigate()

  if (!event) return null

  const { game } = extractMetadata(event)
  const wager = event.data.wager.toNumber()
  const payout = event.data.payout.toNumber()
  const multiplier = event.data.multiplierBps / 10_000
  const profit = payout - wager
  const isProfit = profit >= 0

  const viewTransaction = () => {
    const signature = event.signature
    const wallet = publicKey?.toBase58() || ''
    if (signature) {
      navigate(`/explorer/transaction/${signature}?user=${wallet}`)
    }
    onClose()
  }

  const gotoGame = () => {
    if (game?.meta?.id) {
      navigate('/' + game.meta.id)
    }
    onClose()
  }

  const tokenMeta = useTokenMeta(event.data.tokenMint)

  return (
    <Modal onClose={onClose}>
      <Container>
        <Inner>
          <div style={{
            textAlign: 'center',
            marginBottom: '16px'
          }}>
            <div style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: '#ffd700',
              marginBottom: '8px'
            }}>
              {game?.meta?.name || 'Game'} Results
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              marginBottom: '16px'
            }}>
              <GameIcon src={game?.meta?.image} alt={game?.meta?.name || 'Game'} />
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <TokenIcon src={tokenMeta.image} alt={tokenMeta.name} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    marginBottom: '4px'
                  }}>
                    Wager
                  </div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#fff'
                  }}>
                    <TokenValue exact amount={wager} mint={event.data.tokenMint} />
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}>
              <ProfitDisplay $isProfit={isProfit}>
                {isProfit ? '+' : ''}<TokenValue exact amount={Math.abs(profit)} mint={event.data.tokenMint} />
                <div className="multiplier">
                  {multiplier.toFixed(2)}x
                </div>
              </ProfitDisplay>
            </div>

            {/* Transaction Details */}
            <div style={{
              marginTop: '12px',
              padding: '8px 12px',
              background: 'rgba(255, 215, 0, 0.1)',
              borderRadius: '8px',
              border: '1px solid #ffd700'
            }}>
              <div style={{
                fontSize: '0.75rem',
                color: 'rgba(255, 255, 255, 0.6)',
                marginBottom: '4px'
              }}>
                Transaction
              </div>
              <div style={{
                fontSize: '0.8rem',
                fontWeight: '500',
                color: '#ffd700',
                fontFamily: 'JetBrains Mono, monospace',
                wordBreak: 'break-all'
              }}>
                {event.signature}
              </div>
            </div>
          </div>

          <BrandingSection>
            <img src="/webp/$DGHRT.webp" alt="DegenHeart" />
            <div>
              play on <span className="platform-name">{PLATFORM_SHARABLE_URL}</span>
            </div>
          </BrandingSection>

          <ButtonGroup>
            <GambaUi.Button size="small" onClick={viewTransaction}>
              View Details
            </GambaUi.Button>
            <GambaUi.Button size="small" onClick={gotoGame}>
              Play {game?.meta?.name || 'Game'}
            </GambaUi.Button>
          </ButtonGroup>
        </Inner>
      </Container>
    </Modal>
  )
}