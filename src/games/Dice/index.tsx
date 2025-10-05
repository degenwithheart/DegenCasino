import { BPS_PER_WHOLE } from 'gamba-core-v2';
import { GambaUi, TokenValue, useCurrentPool, useSound, useWagerInput } from 'gamba-react-ui-v2';
import { useGamba } from 'gamba-react-v2';
import React, { useRef, useState, useEffect } from 'react';
import Slider from './Slider';
import { SOUND_LOSE, SOUND_PLAY, SOUND_TICK, SOUND_WIN } from './constants';
import { Container, Result, RollUnder, Stats } from './styles';
import { EnhancedWagerInput, MobileControls, DesktopControls, GameControlsSection, GameRecentPlaysHorizontal } from '../../components';
import { useIsCompact } from '../../hooks/ui/useIsCompact';
import { useGameStats } from '../../hooks/game/useGameStats';
import { GameStatsHeader } from '../../components/Game/GameStatsHeader';
import GameplayFrame, { GameplayEffectsRef } from '../../components/Game/GameplayFrame';
import { useGraphics } from '../../components/Game/GameScreenFrame';
import { useGameMeta } from '../useGameMeta';
import styled, { css } from 'styled-components';
import DICE_THEME from './theme';

const calculateArraySize = (odds: number): number => {
  const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
  return 100 / gcd(100, odds);
};

export const outcomes = (odds: number) => {
  const arraySize = calculateArraySize(odds);
  const payout = (100 / odds).toFixed(4);

  let payoutArray = Array.from({ length: arraySize }).map((_, index) =>
    index < (arraySize * (odds / 100)) ? parseFloat(payout) : 0
  );

  const totalValue = payoutArray.reduce((acc, curr) => acc + curr, 0);

  if (totalValue > arraySize) {
    for (let i = payoutArray.length - 1; i >= 0; i--) {
      if (payoutArray[i] > 0) {
        payoutArray[i] -= totalValue - arraySize;
        payoutArray[i] = parseFloat(payoutArray[i].toFixed(4));
        break;
      }
    }
  }

  return payoutArray;
};

type DiceMode = 'under' | 'over' | 'between' | 'outside';

export default function Dice() {
  // Essential hooks
  const gamba = useGamba();
  const [wager, setWager] = useWagerInput();
  const pool = useCurrentPool();
  const { mobile: isMobile } = useIsCompact();

  // Game state
  const [resultIndex, setResultIndex] = useState(-1);
  const [rollUnderIndex, setRollUnderIndex] = useState(Math.floor(100 / 2));
  const [hasPlayed, setHasPlayed] = useState(false);
  const [lastGameResult, setLastGameResult] = useState<'win' | 'lose' | null>(null);
  const [isRollUnder, setIsRollUnder] = useState(true);
  const [rollValue, setRollValue] = useState(50);

  // NEW: mode + range state (we keep existing vars so original code paths still exist)
  const [mode, setMode] = useState<DiceMode>('under'); // default matches original behavior
  const [minRange, setMinRange] = useState(25);
  const [maxRange, setMaxRange] = useState(75);
  // slider internalizes pointer handling; no global handlers required

  // Game statistics tracking
  const gameStats = useGameStats('dice');  // Initialize with correct game ID

  // Graphics and effects
  const { settings } = useGraphics();
  const enableEffects = settings.enableEffects;
  const effectsRef = useRef<GameplayEffectsRef>(null);

  // Sound system
  const sounds = useSound({
    win: SOUND_WIN,
    play: SOUND_PLAY,
    lose: SOUND_LOSE,
    tick: SOUND_TICK,
  });

  // SYNC: keep original isRollUnder and rollUnderIndex in sync with mode/values so other code that references them won't break.
  useEffect(() => {
    // update boolean for compatibility
    setIsRollUnder(mode === 'under');

    // If mode is under/over, keep rollUnderIndex aligned to rollValue (original code used rollUnderIndex for odds/multiplier)
    if (mode === 'under' || mode === 'over') {
      const v = Math.max(1, Math.min(99, Math.floor(rollValue)));
      setRollUnderIndex(v);
    }
  }, [mode, rollValue]);

  // Compute win chance dynamically based on selected mode
  const winChance = React.useMemo(() => {
    switch (mode) {
      case 'under':
        return rollValue / 100;
      case 'over':
        return (100 - rollValue) / 100;
      case 'between':
        // ensure ranges are valid
        return Math.max(0, (maxRange - minRange) / 100);
      case 'outside':
        return Math.max(0, 1 - (maxRange - minRange) / 100);
      default:
        return 0.5;
    }
  }, [mode, rollValue, minRange, maxRange]);

  // Derive integer odds percent (1..99) from winChance; used for outcomes() and multiplier formula.
  const oddsPercent = Math.max(1, Math.min(99, Math.floor(winChance * 100)));

  // Payout multiplier computed via BPS formula (keeps original style but uses dynamic oddsPercent)
  const multiplier = Number(BigInt(100 * BPS_PER_WHOLE) / BigInt(oddsPercent)) / BPS_PER_WHOLE;

  // Prepare bet outcomes based on computed odds
  const bet = React.useMemo(() => outcomes(oddsPercent), [oddsPercent]);

  const maxWin = multiplier * wager;

  const game = GambaUi.useGame();

  // Calculate pool exceeded (unchanged)
  const poolExceeded = maxWin > (pool?.maxPayout || 0);

  // Styled control tiles using shared theme
  const Tile = styled.div<{ $featured?: boolean; }>`
    background: ${DICE_THEME.colors.tileBg};
    border-radius: 12px;
    padding: ${DICE_THEME.sizes.tilePadding};
    text-align: center;
  width: clamp(180px, 32%, 300px);
    height: 88px;
    flex: 0 1 auto;
    border: 2px solid ${DICE_THEME.colors.tileBorder};
    box-shadow: 0 4px 16px rgba(26,32,44,0.4), inset 0 1px 0 rgba(255,255,255,0.03);
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: box-shadow 160ms ease, background 160ms ease, border-color 160ms ease;

    ${p => p.$featured && css`
      border-color: ${DICE_THEME.colors.tileAccent};
      background: linear-gradient(180deg, rgba(10,12,16,0.6), ${DICE_THEME.colors.tileBg});
      box-shadow: 0 14px 40px rgba(10,12,20,0.6), inset 0 1px 0 rgba(255,255,255,0.03);
    `}
  `;

  const TileLabel = styled.div<{ $featured?: boolean; }>`
    font-size: 12px;
    margin-bottom: 6px;
    color: ${DICE_THEME.colors.labelColor};
    letter-spacing: 0.2px;
    ${p => p.$featured && css` color: ${DICE_THEME.colors.activeLabelColor}; `}
  `;

  const TileValue = styled.div<{ $featured?: boolean; }>`
    font-size: 20px;
    font-weight: bold;
    color: #fff;
    line-height: 1.05;
    white-space: nowrap;
  `;

  // Decorative dice styled components using shared DICE_THEME tokens
  const DiceBox = styled.div<{ $opacity?: number; }>`
    width: clamp(60px, 12vw, 80px);
    height: clamp(60px, 12vw, 80px);
    background: linear-gradient(135deg, ${DICE_THEME.colors.tileBorder} 0%, #2d3748 50%, ${DICE_THEME.colors.tileBg} 100%);
    border-radius: clamp(8px, 2vw, 12px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.08);
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    padding: clamp(8px, 2vw, 12px);
    opacity: ${p => p.$opacity ?? 0.75};
    pointer-events: none;
    transform-style: preserve-3d;
  `;

  const Pip = styled.div<{ $justify?: 'start' | 'center' | 'end'; $align?: 'start' | 'center' | 'end'; }>`
    width: clamp(4px, 1.2vw, 8px);
    height: clamp(4px, 1.2vw, 8px);
    background-color: ${DICE_THEME.colors.tileAccent};
    border-radius: 50%;
    justify-self: ${p => p.$justify || 'center'};
    align-self: ${p => p.$align || 'center'};
    box-shadow: 0 2px 6px rgba(0,0,0,0.45);
  `;

  const resetGame = () => {
    setHasPlayed(false);
    setResultIndex(-1);
    setLastGameResult(null);
  };

  const play = async () => {
    try {
      sounds.play('play');

      await game.play({
        wager,
        bet,
      });

      const result = await game.result();
      const win = result.payout > 0;

      // compute result number consistent with selected mode and whether it's a win or loss
      let resultNum = 0;

      if (win) {
        switch (mode) {
          case 'under': {
            // uniform from 0 .. rollValue-1
            const top = Math.max(1, Math.floor(rollValue));
            resultNum = Math.floor(Math.random() * top);
            break;
          }
          case 'over': {
            // uniform from rollValue .. 99
            const start = Math.max(1, Math.floor(rollValue));
            const count = 100 - start;
            resultNum = Math.floor(Math.random() * count) + start;
            break;
          }
          case 'between': {
            // uniform from minRange .. maxRange-1
            const low = Math.max(0, Math.floor(minRange));
            const high = Math.max(low + 1, Math.floor(maxRange));
            const span = Math.max(1, high - low);
            resultNum = Math.floor(Math.random() * span) + low;
            break;
          }
          case 'outside': {
            // pick from [0 .. minRange-1] U [maxRange .. 99]
            const leftCount = Math.max(0, Math.floor(minRange));
            const rightCount = Math.max(0, 100 - Math.floor(maxRange));
            const total = leftCount + rightCount;
            if (total <= 0) {
              // fallback - pick random
              resultNum = Math.floor(Math.random() * 100);
            } else {
              const pick = Math.floor(Math.random() * total);
              if (pick < leftCount) {
                resultNum = Math.floor(Math.random() * leftCount);
              } else {
                resultNum = Math.floor(Math.random() * rightCount) + Math.floor(maxRange);
              }
            }
            break;
          }
          default:
            resultNum = Math.floor(Math.random() * 100);
        }
      } else {
        // losing result: pick uniformly from the losing region
        switch (mode) {
          case 'under': {
            const top = Math.max(1, Math.floor(rollValue));
            // losing region is [rollValue .. 99]
            const count = 100 - top;
            resultNum = Math.floor(Math.random() * count) + top;
            break;
          }
          case 'over': {
            // losing region is [0 .. rollValue-1]
            const top = Math.max(1, Math.floor(rollValue));
            resultNum = Math.floor(Math.random() * top);
            break;
          }
          case 'between': {
            // losing region is [0..minRange-1] U [maxRange..99]
            const leftCount = Math.max(0, Math.floor(minRange));
            const rightCount = Math.max(0, 100 - Math.floor(maxRange));
            const total = leftCount + rightCount;
            if (total <= 0) {
              resultNum = Math.floor(Math.random() * 100);
            } else {
              const pick = Math.floor(Math.random() * total);
              if (pick < leftCount) {
                resultNum = Math.floor(Math.random() * leftCount);
              } else {
                resultNum = Math.floor(Math.random() * rightCount) + Math.floor(maxRange);
              }
            }
            break;
          }
          case 'outside': {
            // losing region is [minRange .. maxRange-1]
            const low = Math.max(0, Math.floor(minRange));
            const high = Math.max(low + 1, Math.floor(maxRange));
            const span = Math.max(1, high - low);
            resultNum = Math.floor(Math.random() * span) + low;
            break;
          }
          default:
            resultNum = Math.floor(Math.random() * 100);
        }
      }

      setResultIndex(resultNum);
      setHasPlayed(true);
      setLastGameResult(win ? 'win' : 'lose');

      // Update stats and play effects
      const profit = result.payout - wager;
      gameStats.updateStats(profit);

      if (win) {
        sounds.play('win');
        if (enableEffects) {
          effectsRef.current?.winFlash('#00ff00', 1.5);
          effectsRef.current?.screenShake(1, 600);
        }
      } else {
        sounds.play('lose');
        if (enableEffects) {
          effectsRef.current?.loseFlash('#ff4444', 0.8);
          effectsRef.current?.screenShake(0.5, 400);
        }
      }
    } catch (error) {
      console.error('🎲 PLAY ERROR:', error);
      setHasPlayed(false);
      setLastGameResult(null);
      setResultIndex(-1);
    }
  };

  // Human readable condition string
  const conditionText = (() => {
    switch (mode) {
      case 'under': return `Roll Under ${rollValue}`;
      case 'over': return `Roll Over ${rollValue}`;
      case 'between': return `Roll Between ${minRange} – ${maxRange}`;
      case 'outside': return `Roll Outside ${minRange} – ${maxRange}`;
    }
  })();

  // Render
  return (
    <>
      {/* Recent Plays Portal - positioned above stats */}
      <GambaUi.Portal target="recentplays">
        <GameRecentPlaysHorizontal gameId="dice" />
      </GambaUi.Portal>

      {/* Stats Portal - positioned above game screen */}
      <GambaUi.Portal target="stats">
        <GameStatsHeader
          gameName="Dice"
          gameMode="2D"
          stats={gameStats.stats}
          onReset={gameStats.resetStats}
          isMobile={isMobile}
        />
      </GambaUi.Portal>

      <GambaUi.Portal target="screen">
        <div style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 25%, #4a5568 50%, #2d3748 75%, #1a202c 100%)',
          perspective: '100px'
        }}>
          {/* Main Game Area - Mobile-First */}
          <div style={{
            position: 'absolute',
            top: 'clamp(10px, 3vw, 20px)',
            left: 'clamp(10px, 3vw, 20px)',
            right: 'clamp(10px, 3vw, 20px)',
            bottom: 'clamp(100px, 20vw, 120px)', // Responsive space for GameControlsSection
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(20px, 5vw, 30px)',
            padding: '10px'
          }}>
            {/* Header - Mobile-First */}
            <div style={{
              fontSize: 'clamp(14px, 4vw, 18px)',
              color: hasPlayed && resultIndex >= 0 ? (lastGameResult === 'win' ? '#48bb78' : '#e53e3e') : '#a0aec0',
              textAlign: 'center',
              lineHeight: '1.4',
              fontWeight: hasPlayed ? 'bold' : 'normal'
            }}>
              {hasPlayed && resultIndex >= 0 ?
                `Roll Result: ${resultIndex} - ${lastGameResult === 'win' ? 'WIN!' : 'LOSE'}` :
                'Games Results Will Be Displayed Here'
              }
            </div>

            {/* Possible Winning Display - Mobile-First */}
            <div style={{
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: 'clamp(32px, 8vw, 48px)',
                fontWeight: 'bold',
                marginBottom: '8px',
                lineHeight: '1.2'
              }}>
                <span style={{ color: '#48bb78' }}>
                  <TokenValue exact amount={maxWin} />
                </span>
              </div>
              <div style={{
                fontSize: 'clamp(14px, 3.5vw, 16px)',
                color: '#a0aec0'
              }}>
                Possible Winning
              </div>
            </div>

            {/* Slider Section - Mobile-First */}
            <div style={{
              width: 'clamp(280px, 80vw, 600px)',
              maxWidth: '95%',
              position: 'relative'
            }}>
              {/* Slider Track Numbers moved into Slider component */}

              {/* Slider Container (uses Slider component) */}
              <div style={{ position: 'relative', height: 'clamp(36px, 8vw, 40px)', padding: '4px' }}>
                <Slider
                  min={0}
                  max={100}
                  value={mode === 'between' || mode === 'outside' ? [minRange, maxRange] : rollValue}
                  onChange={(v) => {
                    if (Array.isArray(v)) {
                      setMinRange(v[0]);
                      setMaxRange(v[1]);
                    } else {
                      setRollValue(v);
                    }
                  }}
                  mode={mode}
                />
              </div>
            </div>

            {/* 3D Decorative Dice - Mobile-First & Better Centered */}
            <DiceBox style={{ position: 'absolute', top: 'clamp(20px, 5vw, 40px)', left: 'clamp(20px, 8vw, 60px)', transform: 'rotate(-15deg) perspective(100px) rotateX(15deg) rotateY(-15deg)' }} $opacity={0.7}>
              {/* Dice 4 pattern - four corners */}
              <Pip $justify="start" $align="start" />
              <div />
              <Pip $justify="end" $align="start" />
              <div />
              <div />
              <div />
              <Pip $justify="start" $align="end" />
              <div />
              <Pip $justify="end" $align="end" />
            </DiceBox>
            <DiceBox style={{ position: 'absolute', top: 'clamp(20px, 5vw, 40px)', right: 'clamp(20px, 8vw, 60px)', transform: 'rotate(15deg) perspective(100px) rotateX(15deg) rotateY(15deg)' }} $opacity={0.7}>
              {/* Dice 5 pattern - four corners + center */}
              <Pip $justify="start" $align="start" />
              <div />
              <Pip $justify="end" $align="start" />
              <div />
              <Pip $justify="center" $align="center" />
              <div />
              <Pip $justify="start" $align="end" />
              <div />
              <Pip $justify="end" $align="end" />
            </DiceBox>
            <DiceBox style={{ position: 'absolute', bottom: 'clamp(80px, 15vw, 120px)', left: 'clamp(20px, 8vw, 60px)', transform: 'rotate(25deg) perspective(100px) rotateX(-15deg) rotateY(-25deg)' }} $opacity={0.7}>
              {/* Dice 3 pattern - diagonal */}
              <Pip $justify="start" $align="start" />
              <div />
              <div />
              <div />
              <Pip $justify="center" $align="center" />
              <div />
              <div />
              <div />
              <Pip $justify="end" $align="end" />
            </DiceBox>
            <DiceBox style={{ position: 'absolute', bottom: 'clamp(80px, 15vw, 120px)', right: 'clamp(20px, 8vw, 60px)', transform: 'rotate(-25deg) perspective(100px) rotateX(-15deg) rotateY(25deg)' }} $opacity={0.7}>
              {/* Dice 6 pattern - two columns of three */}
              <Pip $justify="start" $align="start" />
              <div />
              <Pip $justify="end" $align="start" />
              <Pip $justify="start" $align="center" />
              <div />
              <Pip $justify="end" $align="center" />
              <Pip $justify="start" $align="end" />
              <div />
              <Pip $justify="end" $align="end" />
            </DiceBox>
          </div>

          {/* GameControlsSection at bottom - Mobile-First Design */}
          <GameControlsSection>
            <div style={{
              display: 'flex',
              gap: 'clamp(12px, 3vw, 0px)',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'center',
              flexWrap: 'wrap',
              padding: '6px 10px',
              maxWidth: '720px',
              margin: '0 auto'
            }}>
              {/* Multiplier Panel */}
              <Tile $featured>
                <TileLabel>Multiplier</TileLabel>
                <TileValue>{multiplier.toFixed(2)}x</TileValue>
              </Tile>

              {/* Single Game Mode Tile - hidden on mobile */}
              {!isMobile && (
                <Tile $featured>
                  <TileLabel $featured>Game Mode</TileLabel>
                  <TileValue $featured>
                    {mode === 'under' ? `Roll Under ${rollValue}` : (mode === 'over' ? `Roll Over ${rollValue}` : (mode === 'between' ? `Roll Between ${minRange} – ${maxRange}` : `Roll Outside ${minRange} – ${maxRange}`))}
                  </TileValue>
                </Tile>
              )}

              {/* Win Chance Panel */}
              <Tile $featured>
                <TileLabel>Win Chance</TileLabel>
                <TileValue>{(winChance * 100).toFixed(0)}%</TileValue>
              </Tile>
            </div>
          </GameControlsSection>


          <GameplayFrame
            ref={effectsRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: 'none',
              zIndex: 1000
            }}
            {...(useGameMeta('dice') && {
              title: useGameMeta('dice')!.name,
              description: useGameMeta('dice')!.description
            })}
          />
        </div>
      </GambaUi.Portal>

      <GambaUi.Portal target="controls">
        <MobileControls
          wager={wager}
          setWager={setWager}
          onPlay={hasPlayed ? resetGame : play}
          playDisabled={gamba.isPlaying || (!hasPlayed && poolExceeded)}
          playText={hasPlayed ? "Roll Again" : "Roll Dice"}
        >
          {/* Mode selector inside MobileControls */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', padding: '8px 12px' }}>
            {(['under', 'over', 'between', 'outside'] as DiceMode[]).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                disabled={gamba.isPlaying}
                style={{
                  padding: '8px 12px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.06)',
                  background: mode === m ? 'linear-gradient(90deg, #2d3748, #1f2a36)' : 'rgba(0,0,0,0.3)',
                  color: mode === m ? '#48bb78' : '#e2e8f0',
                  fontWeight: mode === m ? 'bold' : 'normal',
                  cursor: gamba.isPlaying ? 'not-allowed' : 'pointer'
                }}
              >
                {m === 'under' && 'Roll Under'}
                {m === 'over' && 'Roll Over'}
                {m === 'between' && 'Roll Between'}
                {m === 'outside' && 'Roll Outside'}
              </button>
            ))}
          </div>
        </MobileControls>

        <DesktopControls
          onPlay={hasPlayed ? resetGame : play}
          playDisabled={gamba.isPlaying || (!hasPlayed && poolExceeded)}
          playText={hasPlayed ? "Roll Again" : "Roll Dice"}
        >
          {/* Wager input at the top */}
          <EnhancedWagerInput value={wager} onChange={setWager} />

          {/* Mode selector below input, above play button */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', padding: '8px 12px' }}>
            {(['under', 'over', 'between', 'outside'] as DiceMode[]).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                disabled={gamba.isPlaying}
                style={{
                  padding: '8px 12px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.06)',
                  background: mode === m ? 'linear-gradient(90deg, #2d3748, #1f2a36)' : 'rgba(0,0,0,0.3)',
                  color: mode === m ? '#48bb78' : '#e2e8f0',
                  fontWeight: mode === m ? 'bold' : 'normal',
                  cursor: gamba.isPlaying ? 'not-allowed' : 'pointer'
                }}
              >
                {m === 'under' && 'Roll Under'}
                {m === 'over' && 'Roll Over'}
                {m === 'between' && 'Roll Between'}
                {m === 'outside' && 'Roll Outside'}
              </button>
            ))}
          </div>
        </DesktopControls>
      </GambaUi.Portal>
    </>
  );
}
