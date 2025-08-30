import { GambaTransaction } from 'gamba-core-v2'
import { GambaUi, TokenValue, useTokenMeta } from 'gamba-react-ui-v2'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import styled from 'styled-components'
import { Modal } from './Modal'
import { PLATFORM_SHARABLE_URL } from '../constants'
import { extractMetadata } from '../utils'
import { useTheme } from '../themes/ThemeContext'

const Container = styled.div`
  maxwidth: 380px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);

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
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  margin-bottom: 12px;
`

const TokenIcon = styled.img`
  border-radius: 50%;
  height: 48px;
  width: 48px;
  border: 2px solid rgba(255, 255, 255, 0.2);
`

const GameIcon = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  object-fit: cover;
`

const ProfitDisplay = styled.div<{ $isProfit: boolean; $theme?: any }>`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.$isProfit ? (props.$theme?.colors?.success || '#10b981') : (props.$theme?.colors?.error || '#ef4444')};
  text-align: center;

  .multiplier {
    font-size: 18px;
    font-weight: 600;
    margin-top: 4px;
    opacity: 0.9;
  }
`

const BrandingSection = styled.div<{ $theme?: any }>`
  background: ${({ $theme }) => $theme?.colors?.surface || 'rgba(18, 18, 23, 0.8)'};
  color: ${({ $theme }) => $theme?.colors?.textSecondary || 'rgba(255, 255, 255, 0.8)'};
  font-style: italic;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 12px;
  font-size: 14px;

  img {
    height: 24px;
    width: 24px;
  }

  .platform-name {
    font-weight: 600;
    color: ${({ $theme }) => $theme?.colors?.primary || '#ff6666'};
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`

export function ShareModal({ event, onClose }: {event: GambaTransaction<'GameSettled'>, onClose: () => void}) {
  const navigate = useNavigate()
  const { publicKey: connectedWallet } = useWallet()
  const { currentTheme } = useTheme()
  const { game, gameId: extractedGameId } = extractMetadata(event)

  // Fallback: manually parse metadata if extractMetadata fails
  let fallbackGameId = ''
  try {
    const metadata = event.data.metadata
    if (metadata && typeof metadata === 'string') {
      const parts = metadata.split(':')
      if (parts.length >= 2) {
        fallbackGameId = parts[1] // Should be 'mines' from '0:mines:0'
      }
    }
  } catch (e) {
    console.error('Fallback metadata parsing failed:', e)
  }

  // Use connected wallet instead of transaction wallet to avoid mismatch
  const wallet = connectedWallet?.toBase58() || ''
  const gameId = extractedGameId || game?.id || fallbackGameId || ''
  const signature = event.signature || ''

  console.log('ShareModal data:', {
    wallet,
    gameId,
    game,
    metadata: event.data.metadata,
    extractedGameId,
    fallbackGameId,
    connectedWallet: connectedWallet?.toBase58()
  })

  const gotoGame = () => {
    console.log('gotoGame called with:', { wallet, gameId, game })
    if (connectedWallet && gameId) {
      // Navigate to the game with connected wallet and gameId
      console.log('Navigating to:', `/game/${wallet}/${gameId}`)
      navigate(`/game/${wallet}/${gameId}`)
    } else if (gameId) {
      // If no wallet connected, navigate to home to connect first
      console.log('No wallet connected, navigating to home')
      navigate('/')
    } else {
      console.error('Missing gameId:', { gameId, game, metadata: event.data.metadata })
      // Fallback: navigate to home page
      navigate('/')
    }
    onClose()
  }

  const viewTransaction = () => {
    if (signature) {
      navigate(`/explorer/transaction/${signature}?user=${wallet}`)
    }
    onClose()
  }

  const tokenMeta = useTokenMeta(event.data.tokenMint)
  const ref = React.useRef<HTMLDivElement>(null!)

  const profit = event.data.payout.sub(event.data.wager).toNumber()
  const percentChange = profit / event.data.wager.toNumber()
  const isProfit = profit >= 0
  const wager = event.data.wager.toNumber()
  const payout = event.data.payout.toNumber()
  const multiplier = event.data.multiplierBps / 10_000
  const houseEdge = 1 - (payout / wager)
  const rtp = (payout / wager) * 100

  return (
    <Modal onClose={() => onClose()}>
      <Container>
        <Inner>
          <div ref={ref}>
            <GameResult>
              <TokenIcon src={tokenMeta.image} alt={tokenMeta.symbol} />

              <ProfitDisplay $isProfit={isProfit} $theme={currentTheme}>
                <div>
                  {isProfit ? '+' : '-'}
                  <TokenValue exact amount={Math.abs(profit)} mint={event.data.tokenMint} />
                </div>
                <div className="multiplier">
                  {multiplier.toLocaleString()}x
                </div>
              </ProfitDisplay>

              <GameIcon src={game?.meta?.image} alt={game?.meta?.name || 'Game'} />
            </GameResult>

            {/* Enhanced Details Section */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '12px'
              }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                    marginBottom: '4px'
                  }}>
                    Wager Amount
                  </div>
                  <div style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#ffd700'
                  }}>
                    <TokenValue exact amount={wager} mint={event.data.tokenMint} />
                  </div>
                </div>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                    marginBottom: '4px'
                  }}>
                    Total Payout
                  </div>
                  <div style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: isProfit ? '#00ff88' : '#ff6b6b'
                  }}>
                    <TokenValue exact amount={payout} mint={event.data.tokenMint} />
                  </div>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '8px'
              }}>
                <div style={{
                  background: 'rgba(255, 215, 0, 0.1)',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 215, 0, 0.2)',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '0.7rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                    marginBottom: '2px'
                  }}>
                    RTP
                  </div>
                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#ffd700'
                  }}>
                    {rtp.toFixed(1)}%
                  </div>
                </div>

                <div style={{
                  background: 'rgba(255, 107, 107, 0.1)',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 107, 107, 0.2)',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '0.7rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                    marginBottom: '2px'
                  }}>
                    House Edge
                  </div>
                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#ff6b6b'
                  }}>
                    {(houseEdge * 100).toFixed(1)}%
                  </div>
                </div>

                <div style={{
                  background: 'rgba(0, 255, 136, 0.1)',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid rgba(0, 255, 136, 0.2)',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '0.7rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                    marginBottom: '2px'
                  }}>
                    Multiplier
                  </div>
                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#00ff88'
                  }}>
                    {multiplier.toFixed(2)}x
                  </div>
                </div>
              </div>

              {/* Transaction Details */}
              <div style={{
                marginTop: '12px',
                padding: '8px 12px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
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

            <BrandingSection $theme={currentTheme}>
              <img src="/$DGHRT.png" alt="DegenHeart" />
              <div>
                play on <span className="platform-name">{PLATFORM_SHARABLE_URL}</span>
              </div>
            </BrandingSection>
          </div>

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
