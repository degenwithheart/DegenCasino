import { BET_ARRAYS, RTP_TARGETS, calculateAverageRTP, calculateWinRate, GameKey } from './src/games/rtpConfig';

type ValidationResult = {
  scenario: string;
  actualRTP: number;
  winRate: number;
  withinTolerance: boolean;
};

const generateScenarioBetArrays = (gameKey: GameKey): { scenario: string; betArray: number[] }[] => {
  const game = BET_ARRAYS[gameKey] as any;
  const scenarios: { scenario: string; betArray: number[] }[] = [];

  switch (gameKey) {
    case 'flip':
      scenarios.push({ scenario: 'heads', betArray: [...game.heads] });
      scenarios.push({ scenario: 'tails', betArray: [...game.tails] });
      break;
    case 'slots':
      scenarios.push({ scenario: 'default', betArray: [...game.betArray] });
      break;
    case 'plinko':
      ['normal', 'degen'].forEach(mode => {
        const betArray = [...game[mode]];
        scenarios.push({ scenario: `plinko_${mode}`, betArray });
      });
      break;
    case 'crash':
      for (let mult = 1.1; mult <= 50; mult += 0.5) {
        scenarios.push({ scenario: `crash_target=${mult.toFixed(1)}`, betArray: game.calculateBetArray(mult) });
      }
      break;
    case 'mines':
      game.MINE_SELECT.forEach((mineCount: number) => {
        for (let revealed = 0; revealed <= game.GRID_SIZE - mineCount; revealed++) {
          scenarios.push({
            scenario: `mines=${mineCount}_revealed=${revealed}`,
            betArray: game.generateBetArray(mineCount, revealed)
          });
        }
      });
      break;
    case 'hilo':
      for (let rank = 0; rank < game.RANKS; rank++) {
        scenarios.push({ scenario: `hi_rank=${rank}`, betArray: game.calculateBetArray(rank, true) });
        scenarios.push({ scenario: `lo_rank=${rank}`, betArray: game.calculateBetArray(rank, false) });
      }
      break;
    case 'dice':
      for (let roll = 1; roll <= 99; roll++) {
        scenarios.push({ scenario: `rollUnder=${roll}`, betArray: game.calculateBetArray(roll) });
      }
      break;
    case 'blackjack':
      scenarios.push({ scenario: 'default', betArray: [...game.betArray] });
      break;
    case 'progressivepoker':
      scenarios.push({ scenario: 'default', betArray: game.createWeightedBetArray() });
      break;
    case 'roulette':
      ['red', 'black', 'odd', 'even', 'low', 'high', 'dozen1', 'dozen2', 'dozen3', 'column1', 'column2', 'column3'].forEach(type => {
        scenarios.push({ scenario: type, betArray: game.calculateBetArray(type) });
      });
      break;
  }

  return scenarios;
};

const validateAllGames = () => {
  console.log(`\n=== FULL EDGE-CASE RTP & Win Rate Stress-Test ===`);
  console.log(`Game\tScenario\t\tTarget RTP\tActual RTP\tWin Rate\tWithin 1%`);

  const summary: Record<GameKey, {
    avgRTP: number;
    minRTP: number;
    maxRTP: number;
    avgWinRate: number;
    outOfTolerance: number;
    totalScenarios: number;
  }> = {} as any;

  (Object.keys(RTP_TARGETS) as GameKey[]).forEach(gameKey => {
    const scenarios = generateScenarioBetArrays(gameKey);
    const targetRTP = RTP_TARGETS[gameKey];

    let totalRTP = 0, totalWinRate = 0, minRTP = Infinity, maxRTP = -Infinity, outOfTolerance = 0;

    scenarios.forEach(({ scenario, betArray }) => {
      const actualRTP = calculateAverageRTP(betArray);
      const winRate = calculateWinRate(betArray);
      const withinTolerance = Math.abs(actualRTP - targetRTP) <= 0.01;

      totalRTP += actualRTP;
      totalWinRate += winRate;
      if (actualRTP < minRTP) minRTP = actualRTP;
      if (actualRTP > maxRTP) maxRTP = actualRTP;
      if (!withinTolerance) outOfTolerance++;

      console.log(`${gameKey.padEnd(16)}\t${scenario.padEnd(24)}\t${targetRTP.toFixed(4)}\t\t${actualRTP.toFixed(4)}\t\t${(winRate*100).toFixed(2)}%\t\t${withinTolerance ? '✅' : '❌'}`);
    });

    summary[gameKey] = {
      avgRTP: totalRTP / scenarios.length,
      minRTP,
      maxRTP,
      avgWinRate: totalWinRate / scenarios.length,
      outOfTolerance,
      totalScenarios: scenarios.length
    };
  });

  console.log(`\n=== SUMMARY REPORT ===`);
  console.log(`Game\tAvg RTP\tMin RTP\tMax RTP\tAvg Win Rate\tScenarios Out of Tolerance/Total`);
  Object.entries(summary).forEach(([gameKey, data]) => {
    console.log(`${gameKey.padEnd(16)}\t${data.avgRTP.toFixed(4)}\t${data.minRTP.toFixed(4)}\t${data.maxRTP.toFixed(4)}\t${(data.avgWinRate*100).toFixed(2)}%\t\t${data.outOfTolerance}/${data.totalScenarios}`);
  });
};

validateAllGames();
