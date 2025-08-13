import { FAKE_TOKEN_MINT, GambaUi, useSound, useWagerInput, useCurrentToken, useTokenBalance } from 'gamba-react-ui-v2'
import React from 'react'
import { GameControls } from '../../components'
import { useGameOutcome } from '../../hooks/useGameOutcome'
import { useGambaResult } from '../../hooks/useGambaResult'
import { useIsCompact } from '../../hooks/useIsCompact'
import { TOKEN_METADATA } from '../../constants'
import ScissorsPaytable, { ScissorsPaytableRef } from './ScissorsPaytable'
import { PlayerChoice, CHOICES } from './types'
import { 
  SOUND_PLAY, 
  SOUND_WIN, 
  SOUND_LOSE, 
  GAME_MODES,
  CHOICE_EMOJI,
  WINNING_COMBINATIONS 
} from './constants'
import {
  Container,
  GameArea,
  ChoiceButton,
  ChoiceGrid,
  ResultDisplay,
  AnimatedChoice,
  GameStatus,
  VersusText
} from './styles'
import { ScissorsOverlays } from './ScissorsOverlays'
import { renderThinkingOverlay, getThinkingPhaseState, getGamePhaseState } from '../../utils/overlayUtils'

export default function Scissors() {
  const game = GambaUi.useGame()
  const [wager, setWager] = useWagerInput()
  const token = useCurrentToken()
  const { balance } = useTokenBalance()
  const { compact: isCompact } = useIsCompact()
  const paytableRef = React.useRef<ScissorsPaytableRef>(null)

  // Game state
  const [playerChoice, setPlayerChoice] = React.useState<PlayerChoice>('rock')
  const [computerChoice, setComputerChoice] = React.useState<PlayerChoice | null>(null)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [showResult, setShowResult] = React.useState(false)
  const [gameResult, setGameResult] = React.useState<'win' | 'lose' | 'tie' | null>(null)
  const [thinkingEmoji, setThinkingEmoji] = React.useState('❓')

  // Thinking animation cycle
  const thinkingEmojis = ['🪨', '📄', '✂️', '❓', '🤔', '💭']
  React.useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && !showResult) {
      interval = setInterval(() => {
        setThinkingEmoji(thinkingEmojis[Math.floor(Math.random() * thinkingEmojis.length)])
      }, 150)
    }
    return () => clearInterval(interval)
  }, [isPlaying, showResult])

  // Token metadata
  const tokenMeta = token ? TOKEN_METADATA.find(t => t.symbol === token.symbol) : undefined
  const baseWager = tokenMeta?.baseWager ?? (token ? Math.pow(10, token.decimals) : 1)

  // Sound effects
  const sounds = useSound({
    play: SOUND_PLAY,
    win: SOUND_WIN,
    lose: SOUND_LOSE,
  })

  // Game outcome hook
  const {
    showOutcome,
    hasPlayedBefore,
    handleGameComplete,
    handlePlayAgain,
    isWin,
    profitAmount,
    resetGameState,
  } = useGameOutcome()

  // Dynamic play button text
  const playButtonText = hasPlayedBefore && !showOutcome ? "Restart" : "Start"

  // Gamba result storage
  const { storeResult } = useGambaResult()

  // Overlay states
  const [gamePhase, setGamePhase] = React.useState<'idle' | 'thinking' | 'dramatic' | 'celebrating' | 'mourning'>('idle')
  const [thinkingPhase, setThinkingPhase] = React.useState(false)
  const [dramaticPause, setDramaticPause] = React.useState(false)
  const [celebrationIntensity, setCelebrationIntensity] = React.useState(1)
  const [overlayThinkingEmoji, setOverlayThinkingEmoji] = React.useState('🪨')

  // Set default wager
  React.useEffect(() => {
    if (token?.mint?.equals?.(FAKE_TOKEN_MINT)) {
      setWager(baseWager)
    } else {
      setWager(0)
    }
  }, [setWager, token, baseWager])

  // Determine winner
  const determineWinner = (player: PlayerChoice, computer: PlayerChoice): 'win' | 'lose' | 'tie' => {
    if (player === computer) return 'tie'
    return WINNING_COMBINATIONS[player].includes(computer) ? 'win' : 'lose'
  }

  // Play game
  const play = async () => {
    if (isPlaying) return

    try {
      // Start thinking phase
      setGamePhase('thinking')
      setThinkingPhase(true)
      setOverlayThinkingEmoji(['🪨', '📄', '✂️', '🤔'][Math.floor(Math.random() * 4)])
      
      setIsPlaying(true)
      setShowResult(false)
      setComputerChoice(null)
      setGameResult(null)
      setThinkingEmoji('🤔')

      sounds.play('play')

      // Get bet array based on current game mode
      const betArray = GAME_MODES.standard.bet

      await game.play({
        bet: betArray,
        wager,
        metadata: [playerChoice],
      })

      const result = await game.result()

    // Store result in context for modal
    storeResult(result)
      
      // Dramatic pause phase
      setGamePhase('dramatic')
      setDramaticPause(true)
      
      // Add dramatic pause before revealing result
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Computer choice is determined by result index
      const computerChoiceResult = CHOICES[result.resultIndex % 3]
      const winner = determineWinner(playerChoice, computerChoiceResult)
      
      setComputerChoice(computerChoiceResult)
      setGameResult(winner)
      setShowResult(true)

      // Track game in paytable
      paytableRef.current?.trackGame({
        playerChoice,
        computerChoice: computerChoiceResult,
        result: winner,
        payout: result.payout,
        wager,
        multiplier: result.payout / wager
      })

      // Set celebration intensity based on win amount
      if (winner === 'win') {
        const multiplier = result.payout / wager
        if (multiplier >= 10) {
          setCelebrationIntensity(3) // Epic win
        } else if (multiplier >= 3) {
          setCelebrationIntensity(2) // Big win
        } else {
          setCelebrationIntensity(1) // Regular win
        }
        setGamePhase('celebrating')
      } else if (winner === 'tie') {
        setGamePhase('idle') // Neutral for ties
      } else {
        setGamePhase('mourning')
      }

      // Play appropriate sound with delay for drama
      setTimeout(() => {
        if (winner === 'win') {
          sounds.play('win')
        } else {
          sounds.play('lose')
        }
      }, 300)

      // Show outcome overlay
      handleGameComplete({ payout: result.payout, wager })
      
      // Reset to idle after celebration/mourning
      setTimeout(() => {
        setGamePhase('idle')
      }, 3000)

    } catch (error) {
      console.error('Game error:', error)
      setGamePhase('mourning')
      // Reset to idle after error
      setTimeout(() => {
        setGamePhase('idle')
      }, 3000)
    } finally {
      setIsPlaying(false)
    }
  }

  return (
    <>
      <GambaUi.Portal target="screen">
        <div style={{ display: 'flex', gap: 16, height: '100%', width: '100%' }}>
          {/* Main Game Area */}
          <div style={{ flex: 1 }}>
            <Container $isCompact={isCompact}>
              <GameArea>
                {/* Player Choice Section */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <h3 style={{ color: '#fff', marginBottom: '20px', fontSize: '18px', fontWeight: 600 }}>
                    Player Choice
                  </h3>
                  <AnimatedChoice $animate={isPlaying}>
                    <div style={{ fontSize: '80px' }}>
                      {CHOICE_EMOJI[playerChoice]}
                    </div>
                    <div style={{ color: '#FCD34D', fontSize: '16px', fontWeight: 600, marginTop: '10px' }}>
                      {playerChoice.toUpperCase()}
                    </div>
                  </AnimatedChoice>
                </div>

                {/* VS Section */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}>
                  <VersusText $playing={isPlaying}>
                    VS
                  </VersusText>
                  {showResult && (
                    <div style={{ 
                      marginTop: '20px',
                      padding: '10px 20px',
                      borderRadius: '20px',
                      background: gameResult === 'win' 
                        ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.3))'
                        : gameResult === 'lose'
                        ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.3))'
                        : 'linear-gradient(135deg, rgba(156, 163, 175, 0.2), rgba(107, 114, 128, 0.3))',
                      border: `1px solid ${gameResult === 'win' ? '#22C55E' : gameResult === 'lose' ? '#EF4444' : '#9CA3AF'}`,
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: 600
                    }}>
                      {gameResult === 'win' ? '🎉 YOU WIN!' : gameResult === 'lose' ? '💀 YOU LOSE!' : '🤝 TIE!'}
                    </div>
                  )}
                </div>

                {/* Computer Choice Section */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <h3 style={{ color: '#fff', marginBottom: '20px', fontSize: '18px', fontWeight: 600 }}>
                    House Choice
                  </h3>
                  <AnimatedChoice $animate={isPlaying && !showResult}>
                    <div style={{ fontSize: '80px' }}>
                      {isPlaying && !showResult ? thinkingEmoji : computerChoice ? CHOICE_EMOJI[computerChoice] : '❓'}
                    </div>
                    <div style={{ color: '#FCD34D', fontSize: '16px', fontWeight: 600, marginTop: '10px' }}>
                      {isPlaying && !showResult ? 'THINKING...' : computerChoice ? computerChoice.toUpperCase() : 'WAITING...'}
                    </div>
                  </AnimatedChoice>
                </div>
              </GameArea>

              {/* Choice Selection */}
              <ChoiceGrid>
                {CHOICES.map((choice) => (
                  <ChoiceButton
                    key={choice}
                    $selected={playerChoice === choice}
                    $disabled={isPlaying || showOutcome}
                    onClick={() => !isPlaying && !showOutcome && setPlayerChoice(choice)}
                  >
                    <div style={{ fontSize: '40px', marginBottom: '8px' }}>
                      {CHOICE_EMOJI[choice]}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>
                      {choice.toUpperCase()}
                    </div>
                  </ChoiceButton>
                ))}
              </ChoiceGrid>

              {/* Game Status */}
              <GameStatus>
                <div style={{ color: '#9CA3AF', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                  {isPlaying ? 'PLAYING...' : `SELECTED: ${playerChoice.toUpperCase()}`}
                </div>
                <div style={{ color: '#FCD34D', fontSize: '14px', fontWeight: 700 }}>
                  WIN: 2.00x | TIE: 1.00x | LOSE: 0.00x
                </div>
              </GameStatus>
            </Container>
          </div>

          {/* Live Paytable */}
          <ScissorsPaytable
            ref={paytableRef}
            wager={wager}
            selectedChoice={playerChoice}
          />
        </div>
      </GambaUi.Portal>

      <GameControls
        wager={wager}
        setWager={setWager}
        onPlay={play}
        isPlaying={isPlaying}
        showOutcome={showOutcome}
        playButtonText={hasPlayedBefore ? 'Restart' : 'Play'}
        onPlayAgain={handlePlayAgain}
      >
        {/* Choice Selection in Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 'bold' }}>Choice:</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {CHOICES.map((choice) => (
              <GambaUi.Button
                key={choice}
                onClick={() => setPlayerChoice(choice)}
                disabled={isPlaying || showOutcome}
              >
                {playerChoice === choice ? '✓' : ''} {CHOICE_EMOJI[choice]} {choice}
              </GambaUi.Button>
            ))}
          </div>
        </div>
      </GameControls>
      {renderThinkingOverlay(
        <ScissorsOverlays 
          gamePhase={getGamePhaseState(gamePhase)}
          thinkingPhase={getThinkingPhaseState(thinkingPhase)}
          dramaticPause={dramaticPause}
          celebrationIntensity={celebrationIntensity}
          thinkingEmoji={overlayThinkingEmoji}
        />
      )}
    </>
  )
}