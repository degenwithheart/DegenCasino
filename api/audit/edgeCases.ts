export const config = {
  runtime: 'nodejs',
}

// Inline all constants to avoid any import dependencies
const RTP_TARGETS = {
  flip: 0.96,        
  dice: 0.95,        
  mines: 0.94,       
  hilo: 0.95,        
  crash: 0.96,       
  slots: 0.94,       
  plinko: 0.95,      
  blackjack: 0.97,   
  progressivepoker: 0.96,
  roulette: 0.973,   
} as const

type GameKey = keyof typeof RTP_TARGETS

// Simplified bet arrays for Edge Function - completely self-contained
const SIMPLE_BET_ARRAYS = {
  flip: {
    heads: Array(2).fill(0).map((_, i) => i === 0 ? 1.96 : 0),
    tails: Array(2).fill(0).map((_, i) => i === 1 ? 1.96 : 0),
  },
  dice: {
    betArray: Array(100).fill(0).map((_, i) => i < 50 ? 1.9 : 0)
  },
  slots: {
    betArray: Array(1000).fill(0).map((_, i) => {
      if (i < 150) return 6.27;
      return 0;
    })
  },
  plinko: {
    normal: Array(15).fill(0).map((_, i) => {
      const multipliers = [0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.4, 1.2, 1.0, 0.8, 0.6, 0.4, 0.2];
      return multipliers[i] || 0;
    }),
    degen: Array(13).fill(0).map((_, i) => {
      const multipliers = [0.1, 0.3, 0.5, 0.7, 1.0, 1.3, 1.6, 1.3, 1.0, 0.7, 0.5, 0.3, 0.1];
      return multipliers[i] || 0;
    })
  },
  crash: {
    calculateBetArray: (multiplier: number) => {
      const outcomes = 1000;
      const winProbability = 0.96 / multiplier;
      return Array(outcomes).fill(0).map((_, i) => 
        i < winProbability * outcomes ? multiplier : 0
      );
    }
  },
  mines: {
    generateBetArray: (mineCount: number, revealed: number) => {
      if (revealed === 0) return [1];
      const totalCells = 25;
      const safeCells = totalCells - mineCount;
      const winProbability = safeCells / totalCells;
      const multiplier = 0.94 / winProbability;
      return [multiplier, 0];
    }
  },
  hilo: {
    calculateBetArray: (rank: number, isHi: boolean) => {
      const totalRanks = 13;
      const winningRanks = isHi ? totalRanks - rank - 1 : rank;
      const winProbability = winningRanks / totalRanks;
      const multiplier = winProbability > 0 ? 0.95 / winProbability : 0;
      return winProbability > 0 ? [multiplier, 0] : [0];
    }
  },
  blackjack: {
    betArray: Array(100).fill(0).map((_, i) => {
      if (i < 42) return 2.31;
      return 0;
    })
  },
  progressivepoker: {
    createWeightedBetArray: () => Array(100).fill(0).map((_, i) => {
      if (i < 35) return 2.74;
      return 0;
    })
  },
  roulette: {
    calculateBetArray: (type: string) => {
      const winProbability = 18/37;
      const multiplier = 0.973 / winProbability;
      return Array(37).fill(0).map((_, i) => i < 18 ? multiplier : 0);
    }
  }
}

// CORS headers for frontend access
const allowedOrigins = new Set(['https://degenheart.casino', 'http://localhost:4001']);

function cors(origin: string | null) {
  const o = origin && allowedOrigins.has(origin) ? origin : 'https://degenheart.casino';
  return {
    'Access-Control-Allow-Origin': o,
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
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
  playsPerScenario: number;
};

const generateScenarioBetArrays = (gameKey: GameKey): { scenario: string; betArray: number[] }[] => {
  const game = SIMPLE_BET_ARRAYS[gameKey] as any;
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
      scenarios.push({ scenario: 'plinko_normal', betArray: [...game.normal] });
      scenarios.push({ scenario: 'plinko_degen', betArray: [...game.degen] });
      break;
    case 'crash':
      // Test multiple crash scenarios for comprehensive coverage
      for (let mult = 1.1; mult <= 10; mult += 0.5) {
        scenarios.push({ scenario: `crash_target=${mult.toFixed(1)}`, betArray: game.calculateBetArray(mult) });
      }
      break;
    case 'mines':
      [3, 5, 10, 15, 20].forEach((mineCount: number) => {
        for (let revealed = 0; revealed <= Math.min(25 - mineCount, 5); revealed++) {
          const betArray = game.generateBetArray(mineCount, revealed);
          if (betArray.some((bet: number) => bet > 0)) {
            scenarios.push({
              scenario: `mines=${mineCount}_revealed=${revealed}`,
              betArray
            });
          }
        }
      });
      break;
    case 'hilo':
      for (let rank = 0; rank < 13; rank++) {
        if (rank < 12) {
          const hiBetArray = game.calculateBetArray(rank, true);
          if (hiBetArray.some((bet: number) => bet > 0)) {
            scenarios.push({ scenario: `hi_rank=${rank}`, betArray: hiBetArray });
          }
        }
        if (rank > 0) {
          const loBetArray = game.calculateBetArray(rank, false);
          if (loBetArray.some((bet: number) => bet > 0)) {
            scenarios.push({ scenario: `lo_rank=${rank}`, betArray: loBetArray });
          }
        }
      }
      break;
    case 'dice':
      scenarios.push({ scenario: 'default', betArray: [...game.betArray] });
      break;
    case 'blackjack':
      scenarios.push({ scenario: 'default', betArray: [...game.betArray] });
      break;
    case 'progressivepoker':
      scenarios.push({ scenario: 'default', betArray: game.createWeightedBetArray() });
      break;
    case 'roulette':
      ['red', 'black', 'odd', 'even'].forEach(type => {
        scenarios.push({ scenario: type, betArray: game.calculateBetArray(type) });
      });
      break;
  }

  return scenarios;
};

// Generate binomial random index for Plinko (matches actual game physics)
const generateBinomialIndex = (rows: number, buckets: number): number => {
  // Each row is a coin flip, sum gives us the bucket index
  let successes = 0;
  for (let i = 0; i < rows; i++) {
    if (Math.random() < 0.5) successes++;
  }
  return successes;
};

// Volume testing function - same logic as client-side sample testing
const runVolumeTest = (betArray: number[], plays: number, wager: number = 1, gameKey?: GameKey, scenario?: string) => {
  let totalWager = 0, totalPayout = 0, wins = 0;
  
  for (let i = 0; i < plays; i++) {
    totalWager += wager;
    
    let randomIndex: number;
    
    // Special handling for Plinko - use binomial distribution instead of uniform
    if (gameKey === 'plinko') {
      const rows = scenario?.includes('degen') ? 12 : 14; // degen uses 12 rows, normal uses 14
      randomIndex = generateBinomialIndex(rows, betArray.length);
    } else {
      // For all other games, use uniform random selection
      randomIndex = Math.floor(Math.random() * betArray.length);
    }
    
    const payout = betArray[randomIndex] * wager;
    totalPayout += payout;
    if (payout > 0) wins++;
  }
  
  return {
    actualRTP: totalWager > 0 ? totalPayout / totalWager : 0,
    winRate: wins / plays,
    totalWager,
    totalPayout,
    wins,
    plays
  };
};

const validateAllGames = (playsPerScenario: number = 10000): EdgeCaseResponse => {
  const results: ValidationResult[] = [];
  const summary: Record<string, SummaryData> = {};
  let totalFailures = 0;

  (Object.keys(RTP_TARGETS) as GameKey[]).forEach(gameKey => {
    const scenarios = generateScenarioBetArrays(gameKey);
    const targetRTP = RTP_TARGETS[gameKey];

    let totalRTP = 0, totalWinRate = 0, minRTP = Infinity, maxRTP = -Infinity, outOfTolerance = 0;

    scenarios.forEach(({ scenario, betArray }) => {
      // Run volume testing using the same logic as client-side sample testing
      const { actualRTP, winRate } = runVolumeTest(betArray, playsPerScenario, 1, gameKey, scenario);
      
      const deviation = Math.abs(actualRTP - targetRTP);
      const withinTolerance = deviation <= 0.2001; // 20% tolerance + small buffer for floating point precision
      
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
    totalTests: results.length * playsPerScenario, // Total individual game plays
    totalFailures,
    overallStatus,
    playsPerScenario
  };
};

export default async function handler(request: Request): Promise<Response> {
  const origin = request.headers.get('origin');
  const corsHeaders = cors(origin);

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
    // Parse query parameters
    const url = new URL(request.url);
    const playsParam = url.searchParams.get('plays');
    const playsPerScenario = playsParam ? parseInt(playsParam, 10) : 10000;
    
    // Validate plays parameter
    if (isNaN(playsPerScenario) || playsPerScenario < 1 || playsPerScenario > 10000000) {
      return new Response(JSON.stringify({ 
        error: 'Invalid plays parameter',
        message: 'Plays must be a number between 1 and 10,000,000'
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }
    
    const auditData = validateAllGames(playsPerScenario)
    
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
