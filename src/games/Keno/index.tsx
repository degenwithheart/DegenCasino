import { CellButton, Container, Grid } from './keno.styles'
import { FAKE_TOKEN_MINT, GambaUi, TokenValue, useSound, useWagerInput, useTokenBalance } from 'gamba-react-ui-v2'
import { useCurrentToken } from 'gamba-react-ui-v2'
import { useCurrentPool } from 'gamba-react-ui-v2'
import { TOKEN_METADATA } from '../../constants'
import { GameControls } from '../../components'
import { useGameOutcome } from '../../hooks/useGameOutcome'
import { useGambaResult } from '../../hooks/useGambaResult'
import React, { useState, useRef } from 'react'
import KenoPaytable, { KenoPaytableRef } from './KenoPaytable'
import { KenoOverlays } from './KenoOverlays'

import { useIsCompact } from '../../hooks/useIsCompact';
import { renderThinkingOverlay, getThinkingPhaseState, getGamePhaseState } from '../../utils/overlayUtils'

// 🎵 Assign sounds using URLs
const revealSound = "/assets/games/keno/reveal.mp3";
const winSound = "/assets/games/keno/win.mp3";
const loseSound = "/assets/games/keno/lose.mp3";
const pingSound = "/assets/games/keno/ping.mp3";

const GRID_SIZE = 40
const MAX_SELECTION = 10


export default function Keno() {
  const [resultModalOpen, setResultModalOpen] = useState(false)
  const pool = useCurrentPool();
  const [wager, setWager] = useWagerInput()
  const isCompact = useIsCompact();
  const token = useCurrentToken();
  const { balance } = useTokenBalance();
  
  // Live paytable tracking
  const paytableRef = useRef<KenoPaytableRef>(null)
  const [currentResult, setCurrentResult] = React.useState<{
    selectedNumbers: number[]
    drawnNumbers: number[]
    hits: number
    multiplier: number
    wasWin: boolean
  } | undefined>()
  
  // Find token metadata for symbol display
  const tokenMeta = token
    ? TOKEN_METADATA.find((t: any) => t.symbol === token.symbol)
    : undefined;
  const baseWager = tokenMeta?.baseWager ?? (token ? Math.pow(10, token.decimals) : 1);
  const tokenPrice = tokenMeta?.usdPrice ?? 0;
  const maxWager = baseWager * 1000000;

  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([])
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([])
  const [revealedBlocks, setRevealedBlocks] = useState(new Set<number>())
  const [gameWon, setGameWon] = useState<boolean | null>(null)
  const game = GambaUi.useGame()

  // Game outcome overlay state
  const {
    showOutcome,
    hasPlayedBefore,
    handleGameComplete,
    handlePlayAgain,
    isWin,
    profitAmount,
    resetGameState,
  } = useGameOutcome()

  // Gamba result storage
  const { storeResult } = useGambaResult();

  // Overlay states
  const [gamePhase, setGamePhase] = React.useState<'idle' | 'thinking' | 'dramatic' | 'celebrating' | 'mourning'>('idle')
  const [thinkingPhase, setThinkingPhase] = React.useState(false)
  const [dramaticPause, setDramaticPause] = React.useState(false)
  const [celebrationIntensity, setCelebrationIntensity] = React.useState(1)
  const [thinkingEmoji, setThinkingEmoji] = React.useState('🎱')

  // Set default wager: 1 for free tokens, 0 for real tokens
  React.useEffect(() => {
    if (token?.mint?.equals?.(FAKE_TOKEN_MINT)) {
      setWager(baseWager) // 1 token for free token
    } else {
      setWager(0) // 0 for real tokens
    }
  }, [setWager, token, baseWager])

  // Dynamic play button text based on game state
  const playButtonText = isPlaying 
    ? "Drawing..." 
    : selectedNumbers.length === 0 
      ? "Select Numbers"
      : hasPlayedBefore && !showOutcome 
        ? "Restart" 
        : "Play Keno";

  const sounds = useSound({
    reveal: revealSound,
    win: winSound,
    lose: loseSound,
    ping: pingSound,
  })

  const toggleNumberSelection = (number: number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter((n) => n !== number))
    } else if (selectedNumbers.length < MAX_SELECTION) {
      setSelectedNumbers([...selectedNumbers, number])
      sounds.play('ping')
    }
  }

  const resetGame = () => {
    setSelectedNumbers([])
    setRevealedBlocks(new Set())
    setDrawnNumbers([])
    setGameWon(null)
  }

  // Custom handlePlayAgain that resets Keno-specific state
  const customHandlePlayAgain = () => {
    resetGame()
    handlePlayAgain()
  }

  const play = async () => {
    if (selectedNumbers.length === 0) {
      return // Cannot play without selecting numbers
    }

    // Start thinking phase
    setGamePhase('thinking')
    setThinkingPhase(true)
    setThinkingEmoji(['🎱', '💭', '🔮', '🎯'][Math.floor(Math.random() * 4)])

    setRevealedBlocks(new Set())
    setGameWon(null)
    setIsPlaying(true)

    try {
      // Build bet array: each selected number is a winning index with balanced payout
      const betArray = Array(GRID_SIZE).fill(0)
      // Use logarithmic scaling to prevent excessive RTPs for high selection counts
      const basePayout = Math.max(1, Math.log2(selectedNumbers.length + 1) * 0.95)
      selectedNumbers.forEach(n => {
        betArray[n - 1] = basePayout
      })

      await game.play({
        bet: betArray,
        wager,
      })

      const gameResult = await game.result()
      setResultModalOpen(true)
      const win = gameResult.payout > 0

      // Dramatic pause phase
      setGamePhase('dramatic')
      setDramaticPause(true)
      
      // Wait for dramatic effect
      await new Promise(resolve => setTimeout(resolve, 1500))

      const simulatedDrawnNumbers = simulateDrawnNumbers(win, selectedNumbers, gameResult.resultIndex)
      setDrawnNumbers(simulatedDrawnNumbers)

      // Calculate hits - how many of our selected numbers were drawn
      const hits = selectedNumbers.filter(num => simulatedDrawnNumbers.includes(num)).length
      const multiplier = gameResult.payout / wager

      // Track result in paytable
      const resultData = {
        selectedNumbers: [...selectedNumbers],
        drawnNumbers: simulatedDrawnNumbers,
        hits,
        multiplier,
        wasWin: win
      };
      setCurrentResult(resultData);
      
      if (paytableRef.current) {
        paytableRef.current.trackGame({
          selectedNumbers: [...selectedNumbers],
          drawnNumbers: simulatedDrawnNumbers,
          hits,
          multiplier,
          wasWin: win,
          amount: gameResult.payout
        });
      }

      // Set celebration intensity based on win amount
      if (win) {
        const multiplier = gameResult.payout / wager
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

      revealDrawnNumbers(simulatedDrawnNumbers, win)
      setGameWon(win)

      // Handle game outcome for overlay
      handleGameComplete({
        payout: gameResult.payout,
        wager: wager,
      });
      
      // Reset to idle after celebration/mourning
      setTimeout(() => {
        setGamePhase('idle')
      }, 3000)
    } catch (err: any) {
      setGamePhase('mourning')
      // Reset to idle after error
      setTimeout(() => {
        setGamePhase('idle')
      }, 3000)
    } finally {
      setIsPlaying(false)
    }
  }

  const revealDrawnNumbers = async (drawnNumbers: number[], win: boolean) => {
    for (let i = 0; i < drawnNumbers.length; i++) {
      await new Promise((resolve) => {
        setTimeout(() => {
          setRevealedBlocks((prev) => new Set(prev).add(drawnNumbers[i]))
          sounds.play('reveal')
          resolve(true)
        }, 200)
      })
    }

    setTimeout(() => {
      win ? sounds.play('win') : sounds.play('lose')
    }, drawnNumbers.length)
  }

  // Import seeded random functions for deterministic number generation
  const fnv1a = (str: string): number => {
    let hash = 2166136261;
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return hash >>> 0;
  }

  const mulberry32 = (seed: number) => {
    return function () {
      let t = (seed += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const simulateDrawnNumbers = (win: boolean, selected: number[], resultIndex: number): number[] => {
    // Use deterministic number generation based on the game result
    const seed = `keno-${win}-${selected.join(',')}-${resultIndex}`
    const rng = mulberry32(fnv1a(seed))
    
    if (win) {
      const remainingNumbers = generateRandomNumbers(GRID_SIZE - 1, selected, GRID_SIZE, rng)
      shuffleArray(remainingNumbers, rng)
      const winningNumbers = remainingNumbers.slice(0, 9)
      return [...winningNumbers, selected[0]]
    } else {
      return generateRandomNumbers(10, selected, GRID_SIZE, rng)
    }
  }

  const shuffleArray = (array: any[], rng: () => number) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
  }

  const generateRandomNumbers = (count: number, exclude: number[], max: number, rng: () => number) => {
    const nums: number[] = []
    let attempts = 0
    while (nums.length < count && attempts < max * 3) { // Prevent infinite loops
      const n = Math.floor(rng() * max) + 1
      if (!nums.includes(n) && !exclude.includes(n)) {
        nums.push(n)
      }
      attempts++
    }
    return nums
  }

  const generateBetArray = (selectionCount: number): number[] => {
    const validSelectionCount = Math.min(selectionCount, 10)
    const totalBetUnits = 40

    if (validSelectionCount === 0) {
      return new Array(40).fill(0)
    }

    const baseBet = Math.floor(totalBetUnits / validSelectionCount)
    const remainder = totalBetUnits % validSelectionCount
    const betArray = new Array(validSelectionCount).fill(baseBet)

    for (let i = 0; i < remainder; i++) {
      betArray[i] += 1
    }

    for (let i = validSelectionCount; i < 40; i++) {
      betArray.push(0)
    }

    return betArray
  }

  return (
    <>
      <GambaUi.Portal target="screen">
        <div style={{ display: 'flex', gap: 16, height: '100%', width: '100%' }}>
          {/* Main game area */}
          <div
            style={{
              flex: 1,
              minHeight: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #ea580c 0%, #f97316 25%, #fb923c 50%, #fed7aa 75%, #ffedd5 100%)',
              borderRadius: '24px',
              border: '3px solid rgba(249, 115, 22, 0.3)',
              boxShadow: `
                0 25px 50px rgba(0, 0, 0, 0.5),
                inset 0 2px 4px rgba(255, 255, 255, 0.1),
                inset 0 -2px 4px rgba(0, 0, 0, 0.3),
                0 0 30px rgba(249, 115, 22, 0.2)
              `,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Floating keno background elements */}
            <div style={{
              position: 'absolute',
              top: '10%',
              left: '8%',
              fontSize: '110px',
              opacity: 0.08,
              transform: 'rotate(-15deg)',
              pointerEvents: 'none',
              color: '#f97316'
            }}>🎱</div>
            <div style={{
              position: 'absolute',
              bottom: '15%',
              right: '10%',
              fontSize: '95px',
              opacity: 0.06,
              transform: 'rotate(20deg)',
              pointerEvents: 'none',
              color: '#fb923c'
            }}>🎯</div>
            <div style={{
              position: 'absolute',
              top: '42%',
              right: '12%',
              fontSize: '85px',
              opacity: 0.07,
              transform: 'rotate(-25deg)',
              pointerEvents: 'none',
              color: '#ea580c'
            }}>🔢</div>
            <div style={{
              position: 'absolute',
              bottom: '38%',
              left: '10%',
              fontSize: '75px',
              opacity: 0.05,
              transform: 'rotate(30deg)',
              pointerEvents: 'none',
              color: '#fed7aa'
            }}>⭐</div>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
            }}>
              <div style={{
                textAlign: 'center',
                marginBottom: 20,
                zIndex: 10,
                position: 'relative'
              }}>
                <h2 style={{
                  fontSize: 32,
                  fontWeight: 800,
                  margin: '0 0 8px 0',
                  letterSpacing: 2,
                  textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                  color: '#fff'
                }}>
                  🎯 KENO
                </h2>
                <div style={{
                  fontSize: 16,
                  color: '#888',
                  fontWeight: 600
                }}>
                  Select {selectedNumbers.length}/{MAX_SELECTION} numbers
                </div>
              </div>

              <GambaUi.Responsive>
                <Container>
                  <Grid>
                  {Array.from({ length: GRID_SIZE }, (_, i) => i + 1).map((number) => {
                    const isNumberSelected = selectedNumbers.includes(number)
                    const isRevealed = revealedBlocks.has(number)
                    const maxSelectionReached = selectedNumbers.length >= MAX_SELECTION
                    const gameFinished = gameWon !== null
                    const isDisabled = isPlaying || showOutcome || (isRevealed && gameFinished) || (maxSelectionReached && !isNumberSelected)
                    return (
                      <CellButton
                        key={number}
                        disabled={isDisabled}
                        selected={isNumberSelected}
                        $revealed={isRevealed}
                        $revealedWin={isNumberSelected && isRevealed}
                        $revealedLoss={!isNumberSelected && isRevealed}
                        onClick={() => toggleNumberSelection(number)}
                        style={{
                          background: isNumberSelected 
                            ? 'linear-gradient(135deg, #9333ea, #7c3aed)'
                            : isRevealed
                            ? (isNumberSelected ? 'linear-gradient(135deg, #00ffb0, #00d4aa)' : 'linear-gradient(135deg, #ff5252, #f44336)')
                            : 'rgba(255,255,255,0.1)',
                          border: isNumberSelected 
                            ? '2px solid #a855f7'
                            : '2px solid rgba(255,255,255,0.2)',
                          boxShadow: isNumberSelected 
                            ? '0 0 15px rgba(147, 51, 234, 0.5)'
                            : isRevealed
                            ? '0 0 15px rgba(0,255,176,0.5)'
                            : '0 2px 8px rgba(0,0,0,0.2)',
                          transition: 'all 0.3s ease',
                          animation: isRevealed ? 'kenoGlow 1s ease-in-out' : 'none',
                        }}
                      >
                        {number}
                      </CellButton>
                    )
                  })}
                  </Grid>
                  
                  {/* Game Status */}
                  <div style={{
                    textAlign: 'center',
                    marginTop: 20,
                    fontSize: 16,
                    fontWeight: 600,
                    color: gameWon === true ? '#00ffb0' : gameWon === false ? '#ff5252' : '#fff'
                  }}>
                    {gameWon === true || gameWon === false ? 'Game finished! Select new numbers to play again.' : 
                     selectedNumbers.length === 0 ? 'Select numbers to begin!' : 
                     `${selectedNumbers.length} number${selectedNumbers.length > 1 ? 's' : ''} selected`}
                  </div>
                </Container>
              </GambaUi.Responsive>
            </div>
          </div>
            
          {/* Paytable sidebar */}
          <KenoPaytable
            ref={paytableRef}
            selectedCount={selectedNumbers.length}
            wager={wager}
            currentResult={currentResult}
          />
        </div>
      </GambaUi.Portal>
      <GameControls
        wager={wager}
        setWager={setWager}
        onPlay={play}
        isPlaying={isPlaying}
        showOutcome={showOutcome}
        playButtonText={playButtonText}
        playButtonDisabled={selectedNumbers.length === 0}
        onPlayAgain={handlePlayAgain}
      >
        {/* Selected Numbers Display */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 'bold' }}>Selected:</span>
            <span style={{ 
              padding: '4px 12px', 
              background: selectedNumbers.length > 0 ? '#9335ff' : '#333', 
              borderRadius: 6,
              fontSize: 14,
              color: selectedNumbers.length > 0 ? '#fff' : '#888'
            }}>
              {selectedNumbers.length > 0 ? `${selectedNumbers.length} number${selectedNumbers.length > 1 ? 's' : ''}` : 'None'}
            </span>
          </div>
          {/* Selected Numbers List */}
          {selectedNumbers.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, maxWidth: 200 }}>
              {selectedNumbers.sort((a, b) => a - b).map(num => (
                <span 
                  key={num}
                  style={{ 
                    padding: '2px 6px', 
                    background: '#9335ff', 
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 'bold'
                  }}
                >
                  {num}
                </span>
              ))}
            </div>
          )}
          {selectedNumbers.length === 0 && (
            <div style={{ fontSize: 12, color: '#666' }}>
              Select 1-{MAX_SELECTION} numbers to play
            </div>
          )}
        </div>
      </GameControls>
      {renderThinkingOverlay(
        <KenoOverlays 
        gamePhase={getGamePhaseState(gamePhase)}
        thinkingPhase={getThinkingPhaseState(thinkingPhase)}
        dramaticPause={dramaticPause}
        celebrationIntensity={celebrationIntensity}
        thinkingEmoji={thinkingEmoji}
      />
        )}
    </>
  )
}
