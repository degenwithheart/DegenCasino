import React from 'react'
import { 
  GambaUi, 
  FAKE_TOKEN_MINT, 
  useCurrentToken, 
  useTokenBalance 
} from 'gamba-react-ui-v2'
import { TOKEN_METADATA } from '../constants'
import { useTokenPrices } from '../hooks/useTokenPrices'
import { ModalContent as StyledModalContent } from './GameControlsModal.styles'
import { PresetScroll } from './GameControlsModal.presetScroll.styles'

interface GameControlsProps {
  wager: number
  setWager: (amount: number) => void
  onPlay: () => void
  isPlaying: boolean
  showOutcome?: boolean
  playButtonText?: string
  playButtonDisabled?: boolean
  children?: React.ReactNode
  style?: React.CSSProperties
  onOpenSidebar?: () => void // Optional prop for opening sidebar/overlay
  onPlayAgain?: () => void // Optional callback for when play again is clicked
}

// Simple hook for screen width
function useIsMobile(breakpoint = 1200) {
  const [isMobile, setIsMobile] = React.useState(false)
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [breakpoint])
  return isMobile
}

export function GameControls({
  wager,
  setWager,
  onPlay,
  isPlaying,
  showOutcome = false,
  playButtonText = 'Play',
  playButtonDisabled = false,
  children,
  style,
  onOpenSidebar,
  onPlayAgain,
}: GameControlsProps) {

  // Use live token prices and force re-render on update
  useTokenPrices()

  const token = useCurrentToken()
  const { balance } = useTokenBalance()
  const isMobile = useIsMobile()
  const [showWagerModal, setShowWagerModal] = React.useState(false)

  const tokenMeta = token ? TOKEN_METADATA.find((t: any) => t.symbol === token.symbol) : undefined
  const baseWager = tokenMeta?.baseWager ?? (token ? Math.pow(10, token.decimals) : 1)
  const tokenPrice = tokenMeta?.usdPrice ?? 0

  React.useEffect(() => {
    if (token?.mint?.equals?.(FAKE_TOKEN_MINT)) {
      setWager(baseWager)
    } else {
      setWager(0)
    }
  }, [setWager, token, baseWager])

  const isPlayButtonDisabled = isPlaying || !wager || playButtonDisabled

  // Handle play button click - reset outcome state if needed
  const handlePlayClick = () => {
    if (showOutcome && onPlayAgain) {
      onPlayAgain()
    } else {
      onPlay()
    }
  }

  // Styles
  const containerStyle: React.CSSProperties = {
    borderRadius: 12,
    padding: isMobile ? '12px' : '16px',
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: isMobile ? 'stretch' : 'center',
    flexWrap: 'wrap',
    gap: isMobile ? '12px' : '16px',
    background: '#111',
    width: '100%',
    ...style,
  }

  const infoBlockStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    justifyContent: isMobile ? 'space-between' : undefined,
    width: isMobile ? '100%' : undefined,
  }

  const playRowStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    width: isMobile ? '100%' : undefined,
    justifyContent: isMobile ? 'space-between' : undefined,
    alignItems: 'center',
  }

  const playButtonStyle: React.CSSProperties = {
    width: isMobile ? '100%' : undefined,
    fontSize: 20,
    padding: isMobile ? '16px 0' : undefined,
    flex: 1,
  }

  // Modal content for mobile wager selection (styled like other casino modals)
  // --- USD preset scroll position preservation ---
  const presetScrollRef = React.useRef<HTMLDivElement>(null)
  // Store scrollLeft in a ref so it persists across rerenders
  const scrollLeftRef = React.useRef(0)

  // Save scroll position before rerender
  React.useLayoutEffect(() => {
    if (presetScrollRef.current) {
      presetScrollRef.current.scrollLeft = scrollLeftRef.current
    }
  })

  const handlePresetScroll = React.useCallback(() => {
    if (presetScrollRef.current) {
      scrollLeftRef.current = presetScrollRef.current.scrollLeft
    }
  }, [])

  const WagerModal = () => (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.7)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      onClick={() => setShowWagerModal(false)}
      aria-modal="true"
      role="dialog"
    >
      <StyledModalContent
        onClick={e => e.stopPropagation()}
        style={{ display: 'flex', flexDirection: 'column', gap: 22, alignItems: 'center', padding: 24 }}
      >
        <div style={{ width: '100%', textAlign: 'center', fontWeight: 700, fontSize: 22, marginBottom: 8, letterSpacing: 0.5 }}>Set Wager</div>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: '#aaa' }}>Current:</span>
            <span style={{ padding: '4px 16px', background: '#181b20', borderRadius: 8, fontWeight: 600 }}>
              {(wager / baseWager).toLocaleString(undefined, { maximumFractionDigits: 6 })} {token?.symbol}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: '#aaa' }}>Balance:</span>
            <span style={{ padding: '4px 16px', background: '#181b20', borderRadius: 8, fontWeight: 600 }}>
              {(balance / baseWager).toLocaleString(undefined, { maximumFractionDigits: 6 })} {token?.symbol}
            </span>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #2c313a', width: '100%', margin: '18px 0 0 0' }} />
        {token?.mint?.equals?.(FAKE_TOKEN_MINT) ? (
          <div style={{ color: '#888', fontSize: 15, margin: '10px 0 0 0', textAlign: 'center', width: '100%' }}>
            Free Play
          </div>
        ) : typeof tokenPrice === 'number' && tokenPrice > 0 ? (
          <PresetScroll $isMobile={isMobile} ref={presetScrollRef} onScroll={handlePresetScroll}>
            {[1, 5, 10, 25, 50, 100].map((usd) => {
              const tokenAmount = usd / tokenPrice
              const baseAmount = tokenAmount * baseWager
              return (
                <div
                  key={usd}
                  style={{
                    display: 'inline-block',
                    marginBottom: 6,
                    minWidth: 60,
                    flex: isMobile ? '0 0 auto' : undefined,
                  }}
                >
                  <GambaUi.Button
                    disabled={isPlaying || showOutcome}
                    onClick={() => setWager(baseAmount)}
                  >
                    ${usd}
                  </GambaUi.Button>
                </div>
              )
            })}
          </PresetScroll>
        ) : (
          <div style={{ color: '#888', fontSize: 15, margin: '10px 0 0 0', textAlign: 'center', width: '100%' }}>
            USD price unavailable for this token
          </div>
        )}
        {/* Game-specific controls in modal on mobile */}
        {isMobile && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginTop: 8 }}>
            {children}
          </div>
        )}
        <div style={{ marginTop: 16, width: '100%' }}>
          <div style={{ width: '100%' }}>
            <GambaUi.Button
              disabled={false}
              onClick={() => setShowWagerModal(false)}
            >
              Close
            </GambaUi.Button>
          </div>
        </div>
      </StyledModalContent>
    </div>
  )

  return (
    <GambaUi.Portal target="controls">
      <div style={containerStyle}>
        {/* Desktop: Show wager controls inline */}
        {!isMobile && (
          <>
            <div style={infoBlockStyle}>
              <span style={{ fontWeight: 'bold' }}>Wager:</span>
              <span style={{ padding: '4px 12px', background: '#222', borderRadius: 6 }}>
                {(wager / baseWager).toLocaleString(undefined, { maximumFractionDigits: 6 })} {token?.symbol}
              </span>
            </div>
            <div style={infoBlockStyle}>
              <b>Token Balance:</b>
              <span style={{ padding: '4px 12px', background: '#222', borderRadius: 6 }}>
                {(balance / baseWager).toLocaleString(undefined, { maximumFractionDigits: 6 })} {token?.symbol}
              </span>
            </div>
            {token?.mint?.equals?.(FAKE_TOKEN_MINT) ? (
              <div style={{ color: '#888', fontSize: 14, margin: '8px 0' }}>
                Free Play
              </div>
            ) : typeof tokenPrice === 'number' && tokenPrice > 0 ? (
              <div style={{ display: 'flex', gap: 8 }}>
                {[1, 5, 10, 25, 50, 100].map((usd) => {
                  const tokenAmount = usd / tokenPrice
                  const baseAmount = tokenAmount * baseWager
                  return (
                    <GambaUi.Button
                      key={usd}
                      disabled={isPlaying || showOutcome}
                      onClick={() => setWager(baseAmount)}
                    >
                      ${usd}
                    </GambaUi.Button>
                  )
                })}
              </div>
            ) : (
              <div style={{ color: '#888', fontSize: 14, margin: '8px 0' }}>
                USD price unavailable for this token
              </div>
            )}
          </>
        )}

        {/* Custom game-specific controls: show inline on desktop, in modal on mobile */}
        {!isMobile && children}

        {/* Play row: Play button, Set Wager (mobile only), PayTable (always) */}
        <div style={playRowStyle}>
          <GambaUi.PlayButton onClick={handlePlayClick} disabled={isPlayButtonDisabled}>
            <span style={{ fontSize: 20 }}>{playButtonText}</span>
          </GambaUi.PlayButton>
          {isMobile && (
            <GambaUi.Button
              onClick={() => setShowWagerModal(true)}
              disabled={isPlaying || showOutcome}
            >
              Set Wager
            </GambaUi.Button>
          )}
          {onOpenSidebar && (
            <GambaUi.Button
              onClick={onOpenSidebar}
              disabled={isPlaying || showOutcome}
            >
              PayTable
            </GambaUi.Button>
          )}
          {isMobile && showWagerModal && <WagerModal />}
        </div>
      </div>
    </GambaUi.Portal>
  )
}