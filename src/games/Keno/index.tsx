import { CellButton, Container, Grid } from './keno.styles'
import { FAKE_TOKEN_MINT, GambaUi, TokenValue, useSound, useWagerInput, useTokenBalance } from 'gamba-react-ui-v2'
import { useCurrentToken } from 'gamba-react-ui-v2'
import { useCurrentPool } from 'gamba-react-ui-v2'
import { TOKEN_METADATA } from '../../constants'
import { GameControls, GambaResultModal } from '../../components'
import { useGameOutcome } from '../../hooks/useGameOutcome'
import React, { useState, useContext, useRef } from 'react'
import { GambaResultContext } from '../../context/GambaResultContext'
import KenoPaytable, { KenoPaytableRef } from './KenoPaytable'

import { useIsCompact } from '../../hooks/useIsCompact';

// 🎵 Assign sounds using URLs
const revealSound = "/assets/games/keno/reveal.mp3";
const winSound = "/assets/games/keno/win.mp3";
const loseSound = "/assets/games/keno/lose.mp3";
const pingSound = "/assets/games/keno/ping.mp3";

const GRID_SIZE = 40
const MAX_SELECTION = 10


export default function Keno() {
  const [resultModalOpen, setResultModalOpen] = useState(false)
  const { setGambaResult } = useContext(GambaResultContext)
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
  } = useGameOutcome();

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
        ? "Play Again" 
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

    setRevealedBlocks(new Set())
    setGameWon(null)
    setIsPlaying(true)

    try {
      // Build bet array: each selected number is a winning index with payout = selectedNumbers.length
      const betArray = Array(GRID_SIZE).fill(0)
      selectedNumbers.forEach(n => {
        betArray[n - 1] = selectedNumbers.length // payout multiplier for each selected number
      })

      await game.play({
        bet: betArray,
        wager,
      })

      const gameResult = await game.result()
      setGambaResult(gameResult)
      setResultModalOpen(true)
      const win = gameResult.payout > 0

      const simulatedDrawnNumbers = simulateDrawnNumbers(win, selectedNumbers)
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

      revealDrawnNumbers(simulatedDrawnNumbers, win)
      setGameWon(win)

      // Handle game outcome for overlay
      handleGameComplete({
        payout: gameResult.payout,
        wager: wager,
      });
    } catch (err: any) {
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

  const simulateDrawnNumbers = (win: boolean, selected: number[]): number[] => {
    if (win) {
      const remainingNumbers = generateRandomNumbers(GRID_SIZE - 1, selected, GRID_SIZE)
      shuffleArray(remainingNumbers)
      const winningNumbers = remainingNumbers.slice(0, 9)
      return [...winningNumbers, selected[0]]
    } else {
      return generateRandomNumbers(10, selected, GRID_SIZE)
    }
  }

  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
  }

  const generateRandomNumbers = (count: number, exclude: number[], max: number) => {
    const nums: number[] = []
    while (nums.length < count) {
      const n = Math.floor(Math.random() * max) + 1
      if (!nums.includes(n) && !exclude.includes(n)) {
        nums.push(n)
      }
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
              background: 'linear-gradient(135deg, #0f1419 0%, #1a1a2e 50%, #16213e 100%)',
              borderRadius: '20px',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              boxShadow: `
                0 20px 40px rgba(0, 0, 0, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.1),
                inset 0 -1px 0 rgba(0, 0, 0, 0.2)
              `,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
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
        playButtonText={playButtonText}
        playButtonDisabled={selectedNumbers.length === 0}
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
      <GambaResultModal open={resultModalOpen} onClose={() => setResultModalOpen(false)} />
    </>
  )
}
