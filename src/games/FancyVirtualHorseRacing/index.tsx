import {
  GambaUi,
  useSound,
  useWagerInput,
  useCurrentToken,
  useTokenBalance,
  FAKE_TOKEN_MINT,
} from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import { GameControls } from '../../components'
import { useGameOutcome } from '../../hooks/useGameOutcome'
import { useGambaResult } from '../../hooks/useGambaResult'
import { GameStateProvider, useGameState } from '../../hooks/useGameState'
import { TOKEN_METADATA } from '../../constants'
import React, { useRef } from 'react'
import CRASH_SOUND from './lose.mp3'
import WIN_SOUND from './win.mp3'
import START_SOUND from './start.mp3'
import { ScreenWrapper } from './styles'
import { Track } from './Track'
import { HorseState } from './types'
import HorseRacingPaytable, { HorseRacingPaytableRef } from './HorseRacingPaytable'
import { FancyVirtualHorseRacingOverlays } from './FancyVirtualHorseRacingOverlays'
import { renderThinkingOverlay, getThinkingPhaseState, getGamePhaseState } from '../../utils/overlayUtils'

const overlayStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0,0,0,0.85)',
  zIndex: 10,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 24,
  gap: 16,
  color: '#fff',
  borderRadius: 16,
}

export default function FancyVirtualHorseRacing() {
  return (
    <GameStateProvider>
      <FancyVirtualHorseRacingGame />
    </GameStateProvider>
  )
}

function FancyVirtualHorseRacingGame() {
  const { gamePhase, setGamePhase } = useGameState()
  const game = GambaUi.useGame()
  const [wager, setWager] = useWagerInput()
  const token = useCurrentToken()
  const { balance } = useTokenBalance()
  const gamba = useGamba()
  const [resultModalOpen, setResultModalOpen] = React.useState(false)
  const tokenMeta = token ? TOKEN_METADATA.find((t: any) => t.symbol === token.symbol) : undefined
  const baseWager = tokenMeta?.baseWager ?? (token ? Math.pow(10, token.decimals) : 1)
  const maxWager = baseWager * 1000000
  const sound = useSound({ crash: CRASH_SOUND, win: WIN_SOUND, start: START_SOUND, lose: CRASH_SOUND })

  const {
    showOutcome,
    hasPlayedBefore,
    handleGameComplete,
    handlePlayAgain: originalHandlePlayAgain,
    isWin,
    profitAmount,
  } = useGameOutcome()

  // Dynamic play button text
  const playButtonText = hasPlayedBefore && !showOutcome ? "Restart" : "Start"

  // Gamba result storage
  const { storeResult, gambaResult } = useGambaResult()

  // Overlay states
  const [thinkingPhase, setThinkingPhase] = React.useState(false)
  const [dramaticPause, setDramaticPause] = React.useState(false)
  const [celebrationIntensity, setCelebrationIntensity] = React.useState(1)
  const [thinkingEmoji, setThinkingEmoji] = React.useState('🐎')

  // Custom handlePlayAgain that also resets game state
  const handlePlayAgain = () => {
    setPhase('betting')
    setShowOverlay(true)
    setSelectedHorse(null)
    setConfirming(false)
    setWinningIndex(null)
    setPayout(0)
    originalHandlePlayAgain()
  }

  // Set default wager: 1 for free tokens, 0 for real tokens
  React.useEffect(() => {
    if (token?.mint?.equals?.(FAKE_TOKEN_MINT)) {
      setWager(baseWager) // 1 token for free token
    } else {
      setWager(0) // 0 for real tokens
    }
  }, [setWager, token, baseWager])

  const [phase, setPhase] = React.useState<'betting' | 'racing' | 'finished'>('betting')
  const [horses, setHorses] = React.useState<HorseState[]>([])
  const [selectedHorse, setSelectedHorse] = React.useState<number | null>(null)
  const [winner, setWinner] = React.useState<HorseState | null>(null)
  const [payout, setPayout] = React.useState<number>(0)
  const [winningIndex, setWinningIndex] = React.useState<number | null>(null)

  const [showOverlay, setShowOverlay] = React.useState(true)
  const [confirming, setConfirming] = React.useState(false)
  const paytableRef = useRef<HorseRacingPaytableRef>(null)

  React.useEffect(() => {
    if (phase === 'betting') {
      const colors = ['#ffb347', '#77dd77', '#779ecb', '#ff6961', '#f49ac2', '#b19cd9']

      // Generate 4 unique odds with house edge
      const generateUniqueOdds = (count: number, min: number = 1.5, max: number = 3.8): number[] => {
        const odds = new Set<number>()
        while (odds.size < count) {
          const val = +(min + Math.random() * (max - min)).toFixed(2)
          odds.add(val * 0.95) // Apply 5% house edge
        }
        return Array.from(odds).map(Number).sort(() => Math.random() - 0.5)
      }

      const randomOdds: number[] = generateUniqueOdds(4)

      const horseList: HorseState[] = Array.from({ length: 4 }, (_, i) => ({
        id: i,
        name: `Horse ${i + 1}`,
        color: colors[i % colors.length],
        position: 0,
        speed: 0.5 + Math.random() * 0.5,
        odds: randomOdds[i],
        stumbled: false,
        finished: false,
      }))

      // Find the horse with the lowest odds and mark as favorite
      const lowestOdds: number = Math.min(...horseList.map(h => h.odds as number))
      const horsesWithFavorite: HorseState[] = horseList.map(h => ({
        ...h,
        isFavorite: h.odds === lowestOdds,
      }))

      setHorses(horsesWithFavorite)
      setWinner(null)
      setSelectedHorse(null)
    }
  }, [phase])

const simulateRace = (winnerIndex: number): Promise<HorseState> =>
  new Promise(resolve => {
    const raceHorses = [...horses]
    let winnerFinished = false;

    const interval = setInterval(() => {
      for (let horse of raceHorses) {
        if (horse.finished) continue

        // Winner logic: move slightly faster, but not obviously boosted
        if (horse.id === winnerIndex) {
          horse.speed += (Math.random() - 0.3) * 0.08; // Slightly higher average, but not extreme
          horse.speed = Math.max(0.7, Math.min(horse.speed, 1.2));
          horse.stumbled = false;
        } else {
          // Natural stumble & speed logic for others
          if (!horse.stumbled && Math.random() < 0.03) {
            horse.stumbled = true
            horse.speed *= 0.2
          } else if (horse.stumbled && Math.random() < 0.2) {
            horse.stumbled = false
            horse.speed = 0.5 + Math.random() * 0.5
          } else if (!horse.stumbled) {
            horse.speed += (Math.random() - 0.5) * 0.1
            horse.speed = Math.max(0.3, Math.min(horse.speed, 1.1))
          }
        }

        // Only increment if not about to cross the finish line
        if (horse.id === winnerIndex && !winnerFinished && horse.position + horse.speed >= 100) {
          horse.position = 100;
          horse.finished = true;
          winnerFinished = true;
          clearInterval(interval);
          resolve(horse);
          break;
        } else {
          horse.position += horse.speed;
          if (horse.position >= 100) {
            horse.position = 100;
            horse.finished = true;
          }
        }
      }

      setHorses([...raceHorses])
    }, 60)
  })



  // isPlaying is true during racing phase
  const isPlaying = gamba.isPlaying || phase === 'racing'

  const playRace = async () => {
    if (selectedHorse === null || wager <= 0) return;

    // Start thinking phase
    setGamePhase('thinking')
    setThinkingPhase(true)
    setThinkingEmoji(['🐎', '💭', '🏆', '🎯'][Math.floor(Math.random() * 4)])

    const selected = selectedHorse;
    const selectedOdds = horses[selected]?.odds ?? 2;
    const betArray = horses.map((_, i) => (i === selected ? selectedOdds : 0));

    setPhase('racing');
    sound.play('start');

    await game.play({ wager, bet: betArray });
    const result = await game.result()

    // Store result in context for modal
    storeResult(result);

    setResultModalOpen(true);

    setWinningIndex(result.resultIndex);
    setPayout(result.payout);

    // Dramatic pause phase
    setGamePhase('dramatic')
    setDramaticPause(true)
    
    // Wait for dramatic effect
    await new Promise(resolve => setTimeout(resolve, 1500))

    const raceWinner = await simulateRace(result.resultIndex);
    setWinner(raceWinner);

    setConfirming(false);

    // Skip photo finish and go directly to winner overlay
    setShowOverlay(true);
    setPhase('finished');
    
    const isWin = selectedHorse === result.resultIndex
    
    // Set celebration intensity based on win amount
    if (isWin) {
      const multiplier = result.payout / wager
      if (multiplier >= 10) {
        setCelebrationIntensity(3) // Epic win
      } else if (multiplier >= 3) {
        setCelebrationIntensity(2) // Big win
      } else {
        setCelebrationIntensity(1) // Regular win
      }
      setGamePhase('celebrating')
    } else {
      setGamePhase('mourning')
    }
    
    // Handle game outcome for overlay
    handleGameComplete({ payout: result.payout, wager });
    
    // Track race result in paytable
    const winnerHorseData = horses[result.resultIndex]
    paytableRef.current?.trackRace({
      selectedHorse: selectedHorse,
      winnerHorse: result.resultIndex,
      horseName: winnerHorseData?.name || `Horse ${result.resultIndex + 1}`,
      odds: selectedOdds,
      win: selectedHorse === result.resultIndex,
      wager,
      payout: result.payout
    })
    
    if (selectedHorse === result.resultIndex) {
      sound.play('win');
    } else {
      sound.play('lose');
    }
    
    // Reset to idle after celebration/mourning
    setTimeout(() => {
      setGamePhase('idle')
    }, 3000)
  }

  return (
    <>
      <GambaUi.Portal target="screen">
        <div style={{ display: 'flex', gap: 16, height: '100%', width: '100%' }}>
          {/* Main game area */}
          <div style={{ flex: 1 }}>
            <ScreenWrapper style={{ position: 'relative', minHeight: 420, minWidth: 340 }}>
              {/* Overlay only for betting/finished, not during race */}
              {showOverlay && (
                <div style={overlayStyle}>
                  {phase === 'finished' && winner ? (
                    <>
                      <div style={{ fontSize: 24, fontWeight: 'bold' }}>
                        Winner: {winner.name}!
                      </div>
                      <div style={{ color: payout > 0 ? '#0f0' : '#f44', fontWeight: 'bold', fontSize: 20 }}>
                        {payout > 0
                          ? `You win ${(payout / baseWager).toLocaleString(undefined, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 6,
                          })} ${token?.symbol}!`
                          : 'Better luck next time!'}
                      </div>
                      <GambaUi.Button onClick={() => {
                        setPhase('betting')
                        setShowOverlay(true)
                        setSelectedHorse(null)
                        setConfirming(false)
                        setWinningIndex(null)
                        setPayout(0)
                      }}>
                        Restart
                      </GambaUi.Button>
                    </>
                  ) : (
                    <>
                      <div style={{ fontWeight: 'bold', fontSize: 22 }}>Choose your horse:</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
                        {horses.length === 0 ? (
                          <div style={{ color: '#fff', fontSize: 18 }}>Loading horses...</div>
                        ) : (
                          horses.map(horse => (
                            <button
                              key={horse.id}
                              style={{
                                background: selectedHorse === horse.id ? horse.color : '#222',
                                color: '#fff',
                                border: selectedHorse === horse.id ? '2px solid #fff' : '1px solid #444',
                                borderRadius: 8,
                                padding: '12px 20px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                minWidth: 100,
                              }}
                              onClick={() => setSelectedHorse(horse.id)}
                            >
                              {horse.name}
                              {horse.isFavorite && <span style={{ color: 'gold' }}> ⭐ Favorite</span>}
                              <br />
                              <span style={{ fontSize: 14, color: '#fff9' }}>Odds: {horse.odds}x</span>
                            </button>
                          ))
                        )}
                      </div>
                      <GambaUi.Button
                        disabled={selectedHorse === null}
                        onClick={() => {
                          setConfirming(true)
                          setShowOverlay(false)
                        }}
                      >
                        Confirm Selection
                      </GambaUi.Button>
                    </>
                  )}
                </div>
              )}
              {/* Always render the track, fallback if horses empty */}
              <Track
                horses={horses.length === 0 ? [
                  { name: 'Horse 1', color: '#ffb347', left: 0, stumbled: false, top: 0 },
                  { name: 'Horse 2', color: '#77dd77', left: 0, stumbled: false, top: 100 },
                  { name: 'Horse 3', color: '#779ecb', left: 0, stumbled: false, top: 200 },
                  { name: 'Horse 4', color: '#ff6961', left: 0, stumbled: false, top: 300 },
                ] : horses.map((h, i) => ({
                  name: h.name,
                  color: h.color,
                  left: h.position,
                  stumbled: h.stumbled,
                  top: i * 100,
                  isWinner: i === winningIndex,
                }))}
              />
            </ScreenWrapper>
          </div>
          
          {/* Live Paytable */}
          <div style={{ width: 350 }}>
            <HorseRacingPaytable ref={paytableRef} />
          </div>
        </div>
      </GambaUi.Portal>

      <GameControls
        wager={wager}
        setWager={setWager}
        onPlay={playRace}
        isPlaying={isPlaying}
        showOutcome={showOutcome}
        playButtonText={hasPlayedBefore ? 'Restart' : 'Start Race'}
        playButtonDisabled={!confirming || selectedHorse === null}
        onPlayAgain={originalHandlePlayAgain}
      >
      </GameControls>
      {renderThinkingOverlay(
        <FancyVirtualHorseRacingOverlays 
        gamePhase={getGamePhaseState(gamePhase)}
        thinkingPhase={getThinkingPhaseState(thinkingPhase)}
        dramaticPause={dramaticPause}
        celebrationIntensity={celebrationIntensity}
        thinkingEmoji={thinkingEmoji}
      
                result={gambaResult}
                currentBalance={balance}
                wager={wager}
              />
        )}
    </>
  )
}
