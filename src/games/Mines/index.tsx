import { BPS_PER_WHOLE } from 'gamba-core-v2'
import { GambaUi, TokenValue, useCurrentPool, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import { MINES_CONFIG } from '../rtpConfig'
import { EnhancedWagerInput, EnhancedButton, EnhancedPlayButton, MobileControls, OptionSelector, DesktopControls } from '../../components'
import { GRID_SIZE, MINE_SELECT, PITCH_INCREASE_FACTOR, SOUND_EXPLODE, SOUND_FINISH, SOUND_STEP, SOUND_TICK, SOUND_WIN } from './constants'
import { CellButton, Container, Container2, Grid, Level, Levels, StatusBar } from './styles'
import GameScreenFrame from '../../components/GameScreenFrame'
import { useGameMeta } from '../useGameMeta'
import { generateGrid, revealAllMines, revealGold } from './utils'
import { StyledMinesBackground } from './MinesBackground.enhanced.styles'
import styled, { keyframes } from 'styled-components'

// Enhanced styles for Mines info display (similar to ProgressiveInfo)
const pulseFade = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
`

const MinesInfo = styled.div<{ visible: boolean }>`
  text-align: center;
  background: rgba(147, 88, 255, 0.1);
  border: 1px solid rgba(147, 88, 255, 0.3);
  border-radius: 8px;
  padding: 10px;
  margin: 0;
  min-height: 60px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  opacity: ${props => props.visible ? 1 : 0};
  visibility: ${props => props.visible ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease, visibility 0.3s ease;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
  }
`

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
  
  @media (max-width: 768px) {
    flex-direction: row;
    gap: 8px;
    justify-content: center;
  }
`

const InfoLabel = styled.div`
  font-size: 12px;
  color: #aaa;
  margin-bottom: 4px;
  
  @media (max-width: 768px) {
    margin-bottom: 0;
    font-size: 11px;
  }
`

const InfoValue = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
`

const ProfitDisplay = styled.div<{ profit: number }>`
  font-size: 16px;
  font-weight: bold;
  color: ${props => props.profit > 0 ? '#4caf50' : props.profit < 0 ? '#f44336' : '#fff'};
  margin: 10px 0;
`

const PlaceholderText = styled.div`
  text-align: center;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  margin: 40px 0;
  animation: ${pulseFade} 1.6s infinite;
`

// Enhanced Level styling
const EnhancedLevels = styled.div`
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(147, 88, 255, 0.2) 0%, rgba(147, 88, 255, 0.1) 100%);
  border: 1px solid rgba(147, 88, 255, 0.3);
  overflow: hidden;
  width: 100%;
  display: flex;
  align-items: center;
  height: 50px;
  margin: 0;
  box-shadow: 0 2px 10px rgba(147, 88, 255, 0.1);
`

const EnhancedLevel = styled.div<{$active: boolean}>`
  margin: 0 auto;
  width: 25%;
  text-align: center;
  padding: 8px 5px;
  opacity: ${props => props.$active ? 1 : 0.5};
  text-wrap: nowrap;
  transition: all 0.3s ease;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.$active ? 'linear-gradient(135deg, rgba(147, 88, 255, 0.3) 0%, rgba(147, 88, 255, 0.1) 100%)' : 'transparent'};
    border-radius: ${props => props.$active ? '8px' : '0'};
    transition: all 0.3s ease;
  }

  & > div:first-child {
    font-size: 12px;
    color: ${props => props.$active ? '#9358ff' : '#888'};
    font-weight: ${props => props.$active ? 'bold' : 'normal'};
    position: relative;
    z-index: 1;
  }
  
  & > div:last-child {
    position: relative;
    z-index: 1;
    color: ${props => props.$active ? '#fff' : '#aaa'};
    font-weight: ${props => props.$active ? 'bold' : 'normal'};
  }

  ${(props) => props.$active && `
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(147, 88, 255, 0.2);
  `}
`

function Mines() {
  const game = GambaUi.useGame()
  const sounds = useSound({
    tick: SOUND_TICK,
    win: SOUND_WIN,
    finish: SOUND_FINISH,
    step: SOUND_STEP,
    explode: SOUND_EXPLODE,
  })
  const pool = useCurrentPool()

  const [grid, setGrid] = React.useState(generateGrid(GRID_SIZE))
  const [currentLevel, setLevel] = React.useState(0)
  const [selected, setSelected] = React.useState(-1)
  const [totalGain, setTotalGain] = React.useState(0)
  const [loading, setLoading] = React.useState(false)
  const [started, setStarted] = React.useState(false)

  const [initialWager, setInitialWager] = useWagerInput()
  const [mines, setMines] = React.useState(MINE_SELECT[2])

  // Use centralized mines configuration
  const getMultiplierForLevel = (level: number) => {
    return MINES_CONFIG.getMultiplier(mines, level + 1)
  }

  const levels = React.useMemo(
    () => {
      const totalLevels = GRID_SIZE - mines
      let cumProfit = 0
      let previousBalance = initialWager

      return Array.from({ length: totalLevels }).map((_, level) => {
        // For the first level, the wager is the initial wager. For subsequent levels, it's the previous balance.
        const wager = level === 0 ? initialWager : previousBalance
        const multiplier = getMultiplierForLevel(level)
        const remainingCells = GRID_SIZE - level
        const bet = Array.from({ length: remainingCells }, (_, i) => i < mines ? 0 : multiplier)

        const profit = wager * (multiplier - 1)
        cumProfit += profit
        const balance = wager + profit

        previousBalance = balance
        return { bet, wager, profit, cumProfit, balance }
      }).filter(x => Math.max(...x.bet) * x.wager < pool.maxPayout)
    },
    [initialWager, mines, pool.maxPayout],
  )

  const remainingCells = GRID_SIZE - currentLevel
  const gameFinished = remainingCells <= mines
  const canPlay = started && !loading && !gameFinished

  const { wager, bet } = levels[currentLevel] ?? {}

  const start = () => {
    setGrid(generateGrid(GRID_SIZE))
    setLoading(false)
    setLevel(0)
    setTotalGain(0)
    setStarted(true)
  }

  const endGame = async () => {
    sounds.play('finish')
    reset()
  }

  const reset = () => {
    setGrid(generateGrid(GRID_SIZE))
    setLoading(false)
    setLevel(0)
    setTotalGain(0)
    setStarted(false)
  }

  const play = async (cellIndex: number) => {
    setLoading(true)
    setSelected(cellIndex)
    try {
      sounds.sounds.step.player.loop = true
      sounds.play('step', {  })
      sounds.sounds.tick.player.loop = true
      sounds.play('tick', {  })
      await game.play({
        bet,
        wager,
        metadata: [currentLevel],
      })

      const result = await game.result()

      sounds.sounds.tick.player.stop()

      // Lose
      if (result.payout === 0) {
        setStarted(false)
        setGrid(revealAllMines(grid, cellIndex, mines))
        sounds.play('explode')
        return
      }

      const nextLevel = currentLevel + 1
      setLevel(nextLevel)
      setGrid(revealGold(grid, cellIndex, result.profit))
      setTotalGain(result.payout)

      if (nextLevel < GRID_SIZE - mines) {
        sounds.play('win', { playbackRate: Math.pow(PITCH_INCREASE_FACTOR, currentLevel) })
      } else {
        // No more squares
        sounds.play('win', { playbackRate: .9 })
        sounds.play('finish')
      }
    } finally {
      setLoading(false)
      setSelected(-1)
      sounds.sounds.tick.player.stop()
      sounds.sounds.step.player.stop()
    }
  }

  return (
    <>
      <GambaUi.Portal target="screen">
        <StyledMinesBackground>
          {/* Dangerous lover background elements */}
          <div className="danger-bg-elements" />
          <div className="seductive-overlay" />
          <div className="lovers-test-indicator" />
          
          <GameScreenFrame {...(useGameMeta('mines') && { title: useGameMeta('mines')!.name, description: useGameMeta('mines')!.description })}>
            <div className="mines-content">
              <Container2 className="lovers-labyrinth">
                <div className="danger-header">
                  <h2>💎 A Lover's Test of Courage & Restraint</h2>
                </div>

                <EnhancedLevels className="dangerous-seduction">
                  {levels
                    .map(({ cumProfit }, i) => {
                      return (
                        <EnhancedLevel key={i} $active={currentLevel === i}>
                          <div>
                            💖 LEVEL {i + 1}
                          </div>
                          <div>
                            <TokenValue amount={cumProfit} />
                          </div>
                        </EnhancedLevel>
                      )
                    })}
                </EnhancedLevels>

                {/* Always show mines info - always visible like poker */}
                <MinesInfo visible={true}>
                  {started ? (
                    <>
                      <InfoItem>
                        <InfoLabel>Current Winnings</InfoLabel>
                        <ProfitDisplay profit={totalGain - initialWager}>
                          <TokenValue amount={totalGain} />
                        </ProfitDisplay>
                      </InfoItem>
                      
                      <InfoItem>
                        <InfoLabel>Profit</InfoLabel>
                        <InfoValue style={{ color: totalGain - initialWager > 0 ? '#4caf50' : '#f44336' }}>
                          <TokenValue amount={totalGain - initialWager} />
                        </InfoValue>
                      </InfoItem>
                      
                      <InfoItem>
                        <InfoLabel>Level</InfoLabel>
                        <InfoValue>{currentLevel + 1}</InfoValue>
                      </InfoItem>
                      
                      {!gameFinished && levels[currentLevel + 1] && (
                        <InfoItem>
                          <InfoLabel>Next Level</InfoLabel>
                          <InfoValue style={{ color: '#9358ff' }}>
                            <TokenValue amount={levels[currentLevel + 1].cumProfit} />
                          </InfoValue>
                        </InfoItem>
                      )}
                      
                      {gameFinished && totalGain > 0 && (
                        <InfoItem>
                          <InfoLabel>Status</InfoLabel>
                          <InfoValue style={{ color: '#4caf50', fontSize: '14px' }}>
                            🎉 Complete!
                          </InfoValue>
                        </InfoItem>
                      )}
                    </>
                  ) : (
                    <div style={{ color: 'transparent' }}>Placeholder</div>
                  )}
                </MinesInfo>
                <GambaUi.Responsive>
                  <Container>
              <Grid>
                {grid.map((cell, index) => (
                  <CellButton
                    key={index}
                    status={cell.status}
                    selected={selected === index}
                    onClick={() => play(index)}
                    disabled={!canPlay || cell.status !== 'hidden'}
                  >
                    {(cell.status === 'gold') && (
                      <div>
                        +<TokenValue amount={cell.profit} />
                      </div>
                    )}
                  </CellButton>
                ))}
                    </Grid>
                  </Container>
                </GambaUi.Responsive>
              </Container2>
            </div>
          </GameScreenFrame>
        </StyledMinesBackground>
      </GambaUi.Portal>
      <GambaUi.Portal target="controls">
        {!started ? (
          <>
            <MobileControls
              wager={initialWager}
              setWager={setInitialWager}
              onPlay={start}
              playDisabled={false}
              playText="Start"
            >
              <OptionSelector
                label="Mines"
                options={MINE_SELECT.map(mines => ({
                  value: mines,
                  label: String(mines)
                }))}
                selected={mines}
                onSelect={setMines}
              />
            </MobileControls>

            <DesktopControls>
              <EnhancedWagerInput value={initialWager} onChange={setInitialWager} />
              <OptionSelector
                label="Mines"
                options={MINE_SELECT.map(mines => ({
                  value: mines,
                  label: String(mines)
                }))}
                selected={mines}
                onSelect={setMines}
              />
              <EnhancedPlayButton onClick={start}>
                Start
              </EnhancedPlayButton>
            </DesktopControls>
          </>
        ) : (
          <>
            {/* Cash Out button - always visible, enabled when there are winnings */}
            <EnhancedButton 
              variant="danger"
              onClick={endGame}
              disabled={loading || totalGain === 0}
            >
              {totalGain > 0 ? 'Cash Out' : 'Reset'}
            </EnhancedButton>
          </>
        )}
      </GambaUi.Portal>
    </>
  )
}

export default Mines

