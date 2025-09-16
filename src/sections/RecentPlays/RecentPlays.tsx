// apps/platform/src/sections/RecentPlays/RecentPlays.tsx
import React from 'react'
import ReactDOM from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { BPS_PER_WHOLE, GambaTransaction } from 'gamba-core-v2'
import { GambaUi, TokenValue, useTokenMeta } from 'gamba-react-ui-v2'
import { useMediaQuery } from '../../hooks/ui/useMediaQuery'
import { extractMetadata } from '../../utils'
import { EXPLORER_URL, PLATFORM_CREATOR_ADDRESS } from '../../constants'
import { Container, Jackpot, Profit, Recent, Skeleton } from './RecentPlays.styles'
import { ShareModal } from "../../components/Share/ShareModal";
import { useRecentPlays } from './useRecentPlays'
import { useColorScheme } from '../../themes/ColorSchemeContext'

function TimeDiff({ time, suffix = 'ago' }: { time: number; suffix?: string }) {
  const diff = Date.now() - time
  return React.useMemo(() => {
    const sec = Math.floor(diff / 1000)
    const min = Math.floor(sec / 60)
    const hrs = Math.floor(min / 60)
    if (hrs >= 1) return `${hrs}h ${suffix}`
    if (min >= 1) return `${min}m ${suffix}`
    return 'Just now'
  }, [diff, suffix])
}

function RecentPlay({ event }: { event: GambaTransaction<'GameSettled'> }) {
  const data = event.data
  const token = useTokenMeta(data.tokenMint)
  const md = useMediaQuery('md')

  const multiplier = data.bet[data.resultIndex.toNumber()] / BPS_PER_WHOLE
  const wager = data.wager.toNumber()
  const payout = multiplier * wager
  const profit = payout - wager

  const { game } = extractMetadata(event)

  return (
    <>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        minWidth: '60px'
      }}>
        <img
          src={game?.meta.image}
          style={{
            height: '32px',
            width: '32px',
            borderRadius: '8px',
            objectFit: 'cover',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 215, 0, 0.2)'
          }}
        />
        <div style={{
          fontSize: '0.75rem',
          color: 'rgba(255, 255, 255, 0.6)',
          fontWeight: '500'
        }}>
          {game?.meta.name || 'Game'}
        </div>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        minWidth: '80px'
      }}>
        <div style={{
          color: 'var(--gamba-ui-primary-color)',
          fontSize: '0.85rem',
          fontWeight: '600',
          fontFamily: 'JetBrains Mono, monospace'
        }}>
          {data.user.toBase58().slice(0, 6)}…
        </div>
        {md && (
          <div style={{
            fontSize: '0.7rem',
            color: 'rgba(255, 255, 255, 0.5)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {profit >= 0 ? 'WIN' : 'LOSS'}
          </div>
        )}
      </div>

      <Profit $win={profit > 0}>
        <img
          src={token.image}
          height="16px"
          width="16px"
          style={{
            borderRadius: '50%',
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.3)'
          }}
        />
        <span style={{
          fontSize: '0.85rem',
          fontWeight: '700'
        }}>
          <TokenValue
            amount={Math.abs(profit)}
            mint={data.tokenMint}
          />
        </span>
      </Profit>

      {/* Enhanced Details Section */}
      {md && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          minWidth: '120px'
        }}>
          {/* Wager and Payout Details */}
          <div style={{
            display: 'flex',
            gap: '6px',
            fontSize: '0.7rem',
            color: 'rgba(255, 255, 255, 0.6)'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '2px 6px',
              borderRadius: '4px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              Bet: <TokenValue amount={wager} mint={data.tokenMint} />
            </div>
            {profit > 0 && (
              <div style={{
                background: 'rgba(0, 255, 64, 0.1)',
                padding: '2px 6px',
                borderRadius: '4px',
                border: '1px solid rgba(0, 255, 64, 0.3)',
                color: '#00ff88'
              }}>
                Paid: <TokenValue amount={payout} mint={data.tokenMint} />
              </div>
            )}
          </div>

          {/* RTP and House Edge */}
          <div style={{
            display: 'flex',
            gap: '4px',
            fontSize: '0.65rem',
            color: 'rgba(255, 255, 255, 0.5)'
          }}>
            <span>RTP: {((payout / wager) * 100).toFixed(1)}%</span>
            <span>•</span>
            <span>House: {((1 - payout / wager) * 100).toFixed(1)}%</span>
          </div>
        </div>
      )}

      {md && profit > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '0.8rem',
          color: '#ffd700',
          fontWeight: '600',
          background: 'rgba(255, 215, 0, 0.1)',
          padding: '4px 8px',
          borderRadius: '8px',
          border: '1px solid rgba(255, 215, 0, 0.2)'
        }}>
          <span>✨</span>
          {multiplier.toFixed(2)}x
        </div>
      )}

      {md && data.jackpotPayoutToUser.toNumber() > 0 && (
        <Jackpot>
          <span>🏆</span>
          <span style={{
            fontSize: '0.8rem',
            fontWeight: '700'
          }}>
            <TokenValue
              mint={data.tokenMint}
              amount={data.jackpotPayoutToUser.toNumber()}
            />
          </span>
        </Jackpot>
      )}

      {/* Transaction Hash */}
      {md && (
        <div style={{
          fontSize: '0.6rem',
          color: 'rgba(255, 255, 255, 0.4)',
          fontFamily: 'JetBrains Mono, monospace',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '2px 6px',
          borderRadius: '4px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {event.signature.slice(0, 8)}…
        </div>
      )}
    </>
  )
}


export interface RecentPlaysProps {
  showAllPlatforms?: boolean;
}

export default function RecentPlays({ showAllPlatforms = false }: RecentPlaysProps) {
  const events = useRecentPlays({ showAllPlatforms })
  const [selectedGame, setSelectedGame] = React.useState<GambaTransaction<'GameSettled'>>()
  const md = useMediaQuery('md')
  const navigate = useNavigate()
  const { currentColorScheme } = useColorScheme()

  return (
    <>
      {selectedGame &&
        ReactDOM.createPortal(
          <ShareModal event={selectedGame} onClose={() => setSelectedGame(undefined)} />,
          document.body
        )
      }

            <Container $colorScheme={currentColorScheme}>
        {/* Modern Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '8px',
          padding: '0 4px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #ffd700, #ff6b35)',
              boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
            }}></div>
            <h3 style={{
              color: '#ffd700',
              fontSize: '1.1rem',
              fontWeight: '700',
              margin: 0,
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              letterSpacing: '0.5px'
            }}>
              Recent Plays
            </h3>
          </div>
          <div style={{
            fontSize: '0.8rem',
            color: 'rgba(255, 255, 255, 0.6)',
            fontWeight: '500'
          }}>
            {events.length} games
          </div>
        </div>

        {!events.length && Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} />)}
        {events.map((tx) => (
          <Recent key={tx.signature} onClick={() => setSelectedGame(tx)}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flex: 1,
              minWidth: 0,
              flexWrap: md ? 'nowrap' : 'wrap'
            }}>
              <RecentPlay event={tx} />
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '2px',
              minWidth: md ? '80px' : 'auto'
            }}>
              <div style={{
                fontSize: '0.75rem',
                color: 'rgba(255, 255, 255, 0.5)',
                fontWeight: '500'
              }}>
                <TimeDiff time={tx.time} suffix={md ? 'ago' : ''} />
              </div>
              {md && (
                <div style={{
                  fontSize: '0.65rem',
                  color: 'rgba(255, 255, 255, 0.4)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Live
                </div>
              )}
            </div>
          </Recent>
        ))}

        <div style={{
          marginTop: '16px',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #ffd700 0%, #ff6b35 100%)',
            borderRadius: '12px',
            padding: '2px',
            boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
            transition: 'all 0.3s ease'
          }}>
            <GambaUi.Button
              main
              onClick={() =>
                navigate(`/explorer/platform/${PLATFORM_CREATOR_ADDRESS.toString()}`)
              }
            >
              <span style={{ marginRight: '8px' }}>🚀</span>
              View Explorer
            </GambaUi.Button>
          </div>
        </div>
      </Container>
    </>
  )
}
