import { BET_ARRAYS, RTP_TARGETS, calculateAverageRTP, calculateWinRate, GameKey } from '../../src/games/rtpConfig'

export const config = {
  runtime: 'edge',
}

// CORS headers for frontend access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

type ValidationResult = {
  game: string;
  scenario: string;
  targetRTP: number;
  actualRTP: number;
  winRate: number;
  withinTolerance: boolean;
  deviation: number;
  status: 'pass' | 'fail';
};

type SummaryData = {
  avgRTP: number;
  minRTP: number;
  maxRTP: number;
  avgWinRate: number;
  outOfTolerance: number;
  totalScenarios: number;
};

type EdgeCaseResponse = {
  results: ValidationResult[];
  summary: Record<string, SummaryData>;
  timestamp: string;
  totalTests: number;
  totalFailures: number;
  overallStatus: 'healthy' | 'warning' | 'critical';
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
      // Test multiple crash scenarios for comprehensive coverage
      for (let mult = 1.1; mult <= 50; mult += 0.5) {
        scenarios.push({ scenario: `crash_target=${mult.toFixed(1)}`, betArray: game.calculateBetArray(mult) });
      }
      break;
    case 'mines':
      game.MINE_SELECT.forEach((mineCount: number) => {
        for (let revealed = 0; revealed <= Math.min(game.GRID_SIZE - mineCount, 15); revealed++) {
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
      // Test key percentiles for dice
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

const validateAllGames = (): EdgeCaseResponse => {
  const results: ValidationResult[] = [];
  const summary: Record<string, SummaryData> = {};
  let totalFailures = 0;

  (Object.keys(RTP_TARGETS) as GameKey[]).forEach(gameKey => {
    const scenarios = generateScenarioBetArrays(gameKey);
    const targetRTP = RTP_TARGETS[gameKey];

    let totalRTP = 0, totalWinRate = 0, minRTP = Infinity, maxRTP = -Infinity, outOfTolerance = 0;

    scenarios.forEach(({ scenario, betArray }) => {
      const actualRTP = calculateAverageRTP(betArray);
      const winRate = calculateWinRate(betArray);
      const deviation = Math.abs(actualRTP - targetRTP);
      const withinTolerance = deviation <= 0.01;
      
      if (!withinTolerance) {
        outOfTolerance++;
        totalFailures++;
      }

      results.push({
        game: gameKey,
        scenario,
        targetRTP,
        actualRTP,
        winRate,
        withinTolerance,
        deviation,
        status: withinTolerance ? 'pass' : 'fail'
      });

      totalRTP += actualRTP;
      totalWinRate += winRate;
      if (actualRTP < minRTP) minRTP = actualRTP;
      if (actualRTP > maxRTP) maxRTP = actualRTP;
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

  // Determine overall health status
  let overallStatus: 'healthy' | 'warning' | 'critical' = 'healthy';
  if (totalFailures > 50) {
    overallStatus = 'critical';
  } else if (totalFailures > 10) {
    overallStatus = 'warning';
  }

  return {
    results,
    summary,
    timestamp: new Date().toISOString(),
    totalTests: results.length,
    totalFailures,
    overallStatus
  };
};

export default async function handler(request: Request): Promise<Response> {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  // Only allow GET requests
  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    })
  }

  try {
    const auditData = validateAllGames()
    
    return new Response(JSON.stringify(auditData), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=300', // Cache for 5 minutes
      },
    })
  } catch (error) {
    console.error('Edge case validation error:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    })
  }
}
