import { useCallback, useEffect, useRef, useState } from 'react';
import { GameResult } from 'gamba-core-v2';
import { GambaUi, useSound, useWagerInput } from 'gamba-react-ui-v2';
import { NUM_REELS, NUM_ROWS, NUM_SLOTS, SLOT_ITEMS, SPIN_DELAY, REVEAL_SLOT_DELAY, FINAL_DELAY, LEGENDARY_THRESHOLD, SlotItem } from './constants';
import { getSlotCombination, getWinningPaylines } from './utils';

export interface GameStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  sessionProfit: number;
  bestWin: number;
}

export interface WinningPayline {
  payline: number[];
  symbol: SlotItem;
}

export interface SlotsSharedState {
  // Game state
  wager: number;
  bet: number[];
  maxMultiplier: number;
  isValid: boolean;

  // Gameplay state
  spinning: boolean;
  result: GameResult | undefined;
  combination: SlotItem[];
  revealedSlots: number;
  good: boolean;
  winningPaylines: WinningPayline[];
  winningSymbol: SlotItem | null;

  // Stats
  gameStats: GameStats;

  // Actions
  setWager: (wager: number) => void;
  play: () => Promise<void>;
  handleResetStats: () => void;
}

export const useSlotsGameLogic = (): SlotsSharedState => {
  const game = GambaUi.useGame();
  const sounds = useSound({
    spin: '/Slots/spin.mp3',
    reveal: '/Slots/reveal.mp3',
    revealLegendary: '/Slots/revealLegendary.mp3',
    play: '/Slots/play.mp3',
    win: '/Slots/win.mp3',
    lose: '/Slots/lose.mp3',
  });

  // Game state
  const [wager, setWager] = useWagerInput();
  const [result, setResult] = useState<GameResult>();
  const [combination, setCombination] = useState<SlotItem[]>(Array.from({ length: NUM_SLOTS }, () => SLOT_ITEMS[0]));
  const [revealedSlots, setRevealedSlots] = useState<number>(NUM_SLOTS);
  const [spinning, setSpinning] = useState(false);
  const [good, setGood] = useState(false);
  const [winningPaylines, setWinningPaylines] = useState<WinningPayline[]>([]);
  const [winningSymbol, setWinningSymbol] = useState<SlotItem | null>(null);

  // Game statistics
  const [gameStats, setGameStats] = useState<GameStats>({
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    sessionProfit: 0,
    bestWin: 0
  });

  const timeout = useRef<NodeJS.Timeout>();

  // Game configuration
  const slotMode = '3x5'; // 3 rows, 5 reels
  const bet = Array(NUM_SLOTS).fill(0).map((_, i) => {
    if (i < SLOT_ITEMS.length) {
      return Math.floor((1 / SLOT_ITEMS[i].multiplier) * 100) / 100;
    }
    return 0;
  });

  const maxMultiplier = Math.max(...bet);
  const isValid = wager > 0 && !spinning;

  const handleResetStats = useCallback(() => {
    setGameStats({
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      sessionProfit: 0,
      bestWin: 0
    });
  }, []);

  useEffect(() => {
    return () => {
      timeout.current && clearTimeout(timeout.current);
    };
  }, []);

  const revealReel = useCallback((combination: SlotItem[], reel = 0) => {
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
        } else {
          setGood(false);
          setWinningSymbol(null);
          sounds.play('lose');
        }

        // Update game statistics
        if (result) {
          const profit = result.payout - wager;
          const isWin = result.payout > 0;

          setGameStats((prev: GameStats) => ({
            gamesPlayed: prev.gamesPlayed + 1,
            wins: isWin ? prev.wins + 1 : prev.wins,
            losses: isWin ? prev.losses : prev.losses + 1,
            sessionProfit: prev.sessionProfit + profit,
            bestWin: profit > prev.bestWin ? profit : prev.bestWin
          }));
        }
      }, FINAL_DELAY);
    }
  }, [sounds, result, wager]);

  const play = useCallback(async () => {
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
  }, [wager, bet, game, sounds, revealReel]);

  return {
    // Game state
    wager,
    bet,
    maxMultiplier,
    isValid,

    // Gameplay state
    spinning,
    result,
    combination,
    revealedSlots,
    good,
    winningPaylines,
    winningSymbol,

    // Stats
    gameStats,

    // Actions
    setWager,
    play,
    handleResetStats,
  };
};