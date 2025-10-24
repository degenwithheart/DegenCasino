import { GameResult } from 'gamba-core-v2';
import { EffectTest, GambaUi, useCurrentPool, useSound, useWagerInput } from 'gamba-react-ui-v2';
import React, { useEffect, useRef } from 'react';
import { EnhancedWagerInput, EnhancedButton, MobileControls, DesktopControls, GameControlsSection, GameRecentPlaysHorizontal } from '../../components';
import { GameStatsHeader } from '../../components/Game/GameStatsHeader';
import GameplayFrame, { GameplayEffectsRef } from '../../components/Game/GameplayFrame';
import { useGraphics } from '../../components/Game/GameScreenFrame';
import { useGameStats } from '../../hooks/game/useGameStats';
import { useIsCompact } from '../../hooks/ui/useIsCompact';
import { useGameMeta } from '../useGameMeta';
import { ItemPreview } from './ItemPreview';
import { Reel } from './Reel';
import { StyledSlots } from './Slots.styles';
import { StyledSlotsBackground } from './SlotsBackground.enhanced.styles';
import {
  FINAL_DELAY,
  LEGENDARY_THRESHOLD,
  SlotMode,
  getNumSlots,
  getNumReels,
  getNumRows,
  getNumPaylines,
  REVEAL_SLOT_DELAY,
  SLOT_ITEMS,
  SOUND_LOSE,
  SOUND_PLAY,
  SOUND_REVEAL,
  SOUND_REVEAL_LEGENDARY,
  SOUND_SPIN,
  SOUND_WIN,
  SPIN_DELAY,
  SlotItem,
} from './constants';
import { generateBetArray, getSlotCombination, getWinningPaylines } from './utils';
import { SLOTS_CONFIG } from './config';

export default function Slots() {
  const game = GambaUi.useGame();
  const pool = useCurrentPool();

  // Mobile detection using the hook
  const { mobile: isMobile } = useIsCompact();

  // Game statistics tracking - using centralized hook
  const gameStats = useGameStats('slots');

  // Dynamic values based on screen size
  const slotMode: SlotMode = isMobile ? 'classic' : 'wide';
  const NUM_REELS = getNumReels(slotMode);
  const NUM_ROWS = getNumRows(slotMode);
  const NUM_SLOTS = getNumSlots(slotMode);
  const NUM_PAYLINES = getNumPaylines(slotMode);

  const [spinning, setSpinning] = React.useState(false);
  const [result, setResult] = React.useState<GameResult>();
  const [good, setGood] = React.useState(false);
  const [revealedSlots, setRevealedSlots] = React.useState<number>(NUM_SLOTS);
  const [wager, setWager] = useWagerInput();
  const [combination, setCombination] = React.useState(
    Array.from({ length: NUM_SLOTS }).map(() => SLOT_ITEMS[0]),
  );
  const [winningPaylines, setWinningPaylines] = React.useState<{ payline: number[], symbol: SlotItem; }[]>([]);
  const [winningSymbol, setWinningSymbol] = React.useState<SlotItem | null>(null);

  // Update combination array when screen size changes
  React.useEffect(() => {
    console.log('🎰 RESPONSIVE MODE CHANGE:', {
      isMobile,
      slotMode,
      NUM_REELS,
      NUM_ROWS,
      NUM_SLOTS,
      previousCombinationLength: combination.length
    });
    setCombination(Array.from({ length: NUM_SLOTS }).map(() => SLOT_ITEMS[0]));
    setRevealedSlots(NUM_SLOTS);
    setWinningPaylines([]);
    setWinningSymbol(null);
    setGood(false);
  }, [NUM_SLOTS, isMobile]);

  // Get graphics settings to check if motion is enabled
  const { settings } = useGraphics();

  console.log('🎰 SLOTS DEBUG:', {
    isMobile,
    slotMode: isMobile ? '4×3' : '6×3',
    NUM_REELS,
    NUM_ROWS,
    NUM_SLOTS,
    spinning,
    result: !!result,
    good,
    revealedSlots,
    wager,
    enableMotion: settings.enableMotion,
    combination: combination.map(c => c.multiplier),
    winningPaylines: winningPaylines.length,
    combinationLength: combination.length
  });

  const sounds = useSound({
    win: SOUND_WIN,
    lose: SOUND_LOSE,
    reveal: SOUND_REVEAL,
    revealLegendary: SOUND_REVEAL_LEGENDARY,
    spin: SOUND_SPIN,
    play: SOUND_PLAY,
  });
  const bet = React.useMemo(
    () => {
      // Use rtpConfig to generate proper bet array based on pool constraints
      const cappedMaxPayout = Math.min(pool.maxPayout, wager * Math.max(...SLOTS_CONFIG.betArray));
      return generateBetArray(cappedMaxPayout, wager);
    },
    [pool.maxPayout, wager],
  );

  // Calculate the actual maximum multiplier from the bet array
  const maxMultiplier = React.useMemo(() => {
    return Math.max(...bet);
  }, [bet]);
  const timeout = useRef<any>();

  // Add ref for gameplay effects
  const effectsRef = React.useRef<GameplayEffectsRef>(null);

  const isValid = wager > 0 && bet.some((x: number) => x > 0);

  useEffect(
    () => {
      // Clear timeout when user leaves
      return () => {
        timeout.current && clearTimeout(timeout.current);
      };
    },
    [],
  );

  const revealReel = (combination: SlotItem[], reel = 0) => {
    sounds.play('reveal', { playbackRate: 1.1 });

    // Reveal entire reel (column) at once
    const revealedSlotCount = (reel + 1) * NUM_ROWS;
    setRevealedSlots(revealedSlotCount);

    // Check for winning paylines after each reel reveal
    const currentGrid = combination.slice(0, revealedSlotCount).concat(
      Array.from({ length: NUM_SLOTS - revealedSlotCount }).map(() => SLOT_ITEMS[0])
    );
    const winningLines = getWinningPaylines(currentGrid, NUM_REELS, NUM_ROWS);

    // Check if current reel has any legendary wins
    for (let row = 0; row < NUM_ROWS; row++) {
      const slotIndex = reel * NUM_ROWS + row;
      if (slotIndex < combination.length && combination[slotIndex].multiplier >= LEGENDARY_THRESHOLD) {
        if (winningLines.some(line => line.payline.includes(slotIndex))) {
          sounds.play('revealLegendary');
          break;
        }
      }
    }

    if (reel < NUM_REELS - 1) {
      // Reveal next reel
      timeout.current = setTimeout(
        () => revealReel(combination, reel + 1),
        REVEAL_SLOT_DELAY,
      );
    } else if (reel === NUM_REELS - 1) {
      // Show final results
      sounds.sounds.spin.player.stop();
      const finalWinningLines = getWinningPaylines(combination, NUM_REELS, NUM_ROWS);
      setWinningPaylines(finalWinningLines);

      timeout.current = setTimeout(() => {
        setSpinning(false);
        if (finalWinningLines.length > 0) {
          setGood(true);
          setWinningSymbol(finalWinningLines[0].symbol);
          sounds.play('win');

          // 🎉 TRIGGER SLOTS WIN EFFECTS
          console.log('🎰 SLOTS WIN! Triggering visual effects');
          effectsRef.current?.winFlash(); // Use colorScheme's winGlow color
          effectsRef.current?.particleBurst(50, 40); // Use colorScheme's particleWin color

          // Check for legendary wins (multiple winning lines)
          if (finalWinningLines.length >= 3) {
            effectsRef.current?.screenShake(2, 1000); // Strong shake for legendary wins
            effectsRef.current?.particleBurst(25, 60, undefined, 10); // Additional particles from left
            effectsRef.current?.particleBurst(75, 60, undefined, 10); // Additional particles from right
          } else if (finalWinningLines.length >= 2) {
            effectsRef.current?.screenShake(1.5, 700); // Medium shake for double wins
          } else {
            effectsRef.current?.screenShake(1, 500); // Light shake for single wins
          }
        } else {
          setGood(false);
          setWinningSymbol(null);
          sounds.play('lose');

          // 💥 TRIGGER SLOTS LOSE EFFECTS
          console.log('💥 SLOTS LOSE! Triggering lose effects');
          effectsRef.current?.loseFlash(); // Use colorScheme's loseGlow color
          effectsRef.current?.screenShake(0.5, 300); // Light shake for loss
        }

        // Update game statistics
        if (result) {
          const isWin = result.payout > 0;
          gameStats.updateStats(isWin ? result.payout : 0);
        }
      }, FINAL_DELAY);
    }
  };

  const play = async () => {
    // CRITICAL SECURITY: Prevent zero wager gameplay
    if (wager <= 0) {
      console.error('❌ BLOCKED: Cannot play with zero wager');
      return;
    }

    try {
      setSpinning(true);
      setResult(undefined);

      console.log('🎰 Starting Slots game with:', { wager, bet: bet.slice(0, 10) + '...', betLength: bet.length });

      await game.play({
        wager,
        bet: [...bet],
      });

      sounds.play('play');

      setRevealedSlots(0);
      setGood(false);
      setWinningPaylines([]);
      setWinningSymbol(null);

      const startTime = Date.now();

      sounds.play('spin', { playbackRate: .5 });

      console.log('🎰 Waiting for game result...');
      const result = await game.result();
      console.log('🎰 Game result received:', { payout: result.payout, multiplier: result.multiplier });

      // Make sure we wait a minimum time of SPIN_DELAY before slots are revealed:
      const resultDelay = Date.now() - startTime;
      const revealDelay = Math.max(0, SPIN_DELAY - resultDelay);

      const seed = `${result.resultIndex}:${result.multiplier}:${result.payout}`;
      const combination = getSlotCombination(
        NUM_SLOTS,
        result.multiplier,
        [...bet],
        seed,
        NUM_REELS,
        NUM_ROWS,
      );

      setCombination(combination);
      setResult(result);

      timeout.current = setTimeout(() => revealReel(combination), revealDelay);
    } catch (error) {
      console.error('🎰 SLOTS ERROR:', error);
      setSpinning(false);
      // Reset game state on error
      setResult(undefined);
      setRevealedSlots(NUM_SLOTS);
      setGood(false);
      setWinningPaylines([]);
      setWinningSymbol(null);
      return;
    }
  };

  return (
    <>
      {/* Recent Plays Portal - positioned above stats */}
      <GambaUi.Portal target="recentplays">
        <GameRecentPlaysHorizontal gameId="slots" />
      </GambaUi.Portal>

      {/* Stats Portal - positioned above game screen */}
      <GambaUi.Portal target="stats">
        <GameStatsHeader
          gameName="Slots"
          gameMode="Classic"
          stats={gameStats.stats}
          onReset={gameStats.resetStats}
          isMobile={isMobile}
        />
      </GambaUi.Portal>

      <GambaUi.Portal target="screen">
        <StyledSlotsBackground>
          {/* Enhanced background for Slots game */}
          <div className="slots-bg-elements" />
          <div className="casino-bg-elements" />
          <div className="decorative-overlay" />

          <StyledSlots>
            <GameplayFrame
              ref={effectsRef}
              {...(useGameMeta('slots') && {
                title: useGameMeta('slots')!.name,
                description: useGameMeta('slots')!.description
              })}
              disableContainerTransforms={true}
            >
              {good && <EffectTest src={winningSymbol?.image || combination[0].image} />}
              <GambaUi.Responsive>
                <div className="slots-content">
                  <div className={'slots'}>
                    <div className="winning-line-display">
                      <ItemPreview
                        betArray={[...bet]}
                        winningMultiplier={winningSymbol?.multiplier}
                        isWinning={good}
                      />
                    </div>
                    <div className={`slots-reels ${settings.enableMotion ? 'motion-enabled' : 'motion-disabled'}`}>
                      {/* ECG-style winning line */}
                      <div className={`ecg-winning-line ${good ? 'active' : ''}`}></div>

                      {/* Left Arrow */}
                      <div className="winning-line-arrow winning-line-arrow-left">
                        <div className="arrow-icon">▶</div>
                      </div>

                      {Array.from({ length: NUM_REELS }).map((_, reelIndex) => {
                        const reelItems = Array.from({ length: NUM_ROWS }).map((_, rowIndex) => {
                          const slotIndex = reelIndex * NUM_ROWS + rowIndex;
                          return combination[slotIndex] || SLOT_ITEMS[0]; // Fallback if undefined
                        });

                        const reelGoodSlots = Array.from({ length: NUM_ROWS }).map((_, rowIndex) => {
                          const slotIndex = reelIndex * NUM_ROWS + rowIndex;
                          return good && winningPaylines.some(line => line.payline.includes(slotIndex));
                        });

                        const reelRevealed = revealedSlots > reelIndex * NUM_ROWS;

                        console.log(`🎰 RENDERING REEL ${reelIndex}:`, {
                          NUM_REELS,
                          NUM_ROWS,
                          NUM_SLOTS,
                          slotMode,
                          combinationLength: combination.length,
                          reelRevealed,
                          isSpinning: spinning && !reelRevealed,
                          enableMotion: settings.enableMotion,
                          reelItems: reelItems.map(i => i?.multiplier || 'undefined'),
                          reelGoodSlots,
                          slotIndicesForThisReel: Array.from({ length: NUM_ROWS }).map((_, rowIndex) => reelIndex * NUM_ROWS + rowIndex)
                        });

                        return (
                          <Reel
                            key={reelIndex}
                            reelIndex={reelIndex}
                            revealed={reelRevealed}
                            good={reelGoodSlots}
                            items={reelItems}
                            isSpinning={spinning && !reelRevealed}
                            enableMotion={settings.enableMotion}
                          />
                        );
                      })}

                      {/* Right Arrow */}
                      <div className="winning-line-arrow winning-line-arrow-right">
                        <div className="arrow-icon">◀</div>
                      </div>
                    </div>
                  </div>
                </div>
              </GambaUi.Responsive>
            </GameplayFrame>
          </StyledSlots>
        </StyledSlotsBackground>
      </GambaUi.Portal>
      <GambaUi.Portal target="controls">
        <MobileControls
          wager={wager}
          setWager={setWager}
          onPlay={play}
          playDisabled={!isValid}
          playText="Spin"
        />

        <DesktopControls
          onPlay={play}
          playDisabled={!isValid}
          playText="Spin"
        >
          <EnhancedWagerInput value={wager} onChange={setWager} />
        </DesktopControls>
      </GambaUi.Portal>
    </>
  );
}
