import { withUsageTracking } from '../cache/usage-tracker'

export const config = {
  runtime: 'edge',
}

// Edge Runtime compatible RTP targets and bet arrays (inline definitions)
const RTP_TARGETS = {
  flip: 0.96,
  dice: 0.96,
  mines: 0.96,
  slots: 0.95,
  plinko: 0.96,
  plinkorace: 0.96,
  hilo: 0.96,
  roulette: 0.96,
  limbo: 0.96,
  keno: 0.94,
  crash: 0.96,
  blackjack: 0.96,
  doubleornothing: 0.96,
  progressivepoker: 0.96,
}

const RTP_TARGETS_V2 = {
  'flip-v2': 0.96,
  'dice-v2': 0.96,
  'mines': 0.96,
  'keno-v2': 0.94,
  'limbo-v2': 0.96,
  'doubleornothing-v2': 0.96,
  'blackjack-v2': 0.96,
  'multipoker-v2': 0.96,
  'cryptochartgame-v2': 0.96,
  'fancyvirtualhorseracing-v2': 0.96,
}

// Simple bet arrays for edge cases validation
const BET_ARRAYS: Record<string, number[]> = {
  flip: [0, 2],
  dice: [0, 0, 0, 0, 0, 6],
  mines: [0, 1.04, 1.13, 1.24, 1.37, 1.53],
  slots: [0, 1.2, 1.5, 2.0, 2.5, 3.0],
  plinko: [0, 0.5, 1, 1.5, 2, 2.5, 3, 2.5, 2, 1.5, 1, 0.5, 0],
  plinkorace: [0, 0.5, 1, 1.5, 2, 2.5, 3, 2.5, 2, 1.5, 1, 0.5, 0],
  hilo: [0, 1.8, 1.8, 1.8, 1.8, 1.8],
  roulette: [0, 2, 3, 36],
  limbo: [1, 1.2, 1.5, 2, 3, 5, 10, 100],
  keno: [0, 2, 3, 5, 10, 20, 50, 100],
  crash: [1, 1.2, 1.5, 2, 3, 5, 10],
  blackjack: [0, 2],
  doubleornothing: [0, 2],
  progressivepoker: [0, 2, 3, 5, 10],
}

const BET_ARRAYS_V2: Record<string, number[]> = {
  'flip-v2': [0, 2],
  'magic8ball': [0, 0, 0, 0, 0, 6],
  'mines': [0, 1.04, 1.13, 1.24, 1.37, 1.53],
  'keno-v2': [0, 2, 3, 5, 10, 20, 50, 100],
  'limbo-v2': [1, 1.2, 1.5, 2, 3, 5, 10, 100],
  'doubleornothing-v2': [0, 2],
  'blackjack-v2': [0, 2],
  'multipoker-v2': [0, 2, 3, 5, 10],
  'cryptochartgame-v2': [0, 1.5, 2, 3, 5],
  'fancyvirtualhorseracing-v2': [0, 1.2, 1.5, 2, 3, 5, 10],
}

// Edge Runtime compatible utility functions
function calculateAverageRTP(betArray: number[]): number {
  const nonZeroValues = betArray.filter(v => v > 0)
  if (nonZeroValues.length === 0) return 0
  return nonZeroValues.reduce((sum, val) => sum + val, 0) / nonZeroValues.length
}

function calculateWinRate(betArray: number[]): number {
  const totalPositions = betArray.length
  const winningPositions = betArray.filter(v => v > 0).length
  return totalPositions > 0 ? winningPositions / totalPositions : 0
}

// Merge V1 and V2 configurations for comprehensive audit coverage
const MERGED_RTP_TARGETS = { ...RTP_TARGETS, ...RTP_TARGETS_V2 }
const MERGED_BET_ARRAYS = { ...BET_ARRAYS, ...BET_ARRAYS_V2 }
type AllGameKeys = keyof typeof MERGED_RTP_TARGETS

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

const generateScenarioBetArrays = (gameKey: AllGameKeys): { scenario: string; betArray: number[] }[] => {
  const game = MERGED_BET_ARRAYS[gameKey] as any;
  const scenarios: { scenario: string; betArray: number[] }[] = [];

  switch (gameKey) {
    case 'flip':
      // Generate bet arrays for common flip scenarios
      for (let n = 1; n <= 5; n++) { // Test 1-5 coins
        for (let k = 1; k <= n; k++) { // Test different targets
          scenarios.push({ 
            scenario: `heads_${n}coins_${k}target`, 
            betArray: game.calculateBetArray(n, k, 'heads') 
          });
          scenarios.push({ 
            scenario: `tails_${n}coins_${k}target`, 
            betArray: game.calculateBetArray(n, k, 'tails') 
          });
        }
      }
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
    case 'plinkorace':
      // PlinkoRace uses same mechanics as regular plinko
      ['normal', 'degen'].forEach(mode => {
        const betArray = [...game[mode]];
        scenarios.push({ scenario: `plinkorace_${mode}`, betArray });
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
          const betArray = game.generateBetArray(mineCount, revealed);
          // Only add scenario if it has at least one winning outcome
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
      for (let rank = 0; rank < game.RANKS; rank++) {
        // Only test HI if there are cards higher than current rank
        if (rank < game.RANKS - 1) {
          const hiBetArray = game.calculateBetArray(rank, true);
          if (hiBetArray.some((bet: number) => bet > 0)) {
            scenarios.push({ scenario: `hi_rank=${rank}`, betArray: hiBetArray });
          }
        }
        // Only test LO if there are cards lower than current rank
        if (rank > 0) {
          const loBetArray = game.calculateBetArray(rank, false);
          if (loBetArray.some((bet: number) => bet > 0)) {
            scenarios.push({ scenario: `lo_rank=${rank}`, betArray: loBetArray });
          }
        }
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

    // V2 Games
    case 'dice-v2':
      // Test key percentiles for dice v2
      for (let roll = 1; roll <= 99; roll += 5) { // Sample every 5th percentile for efficiency
        scenarios.push({ scenario: `rollUnder=${roll}`, betArray: game.calculateBetArray(roll) });
      }
      break;
    case 'multipoker-v2':
      scenarios.push({ scenario: 'default', betArray: game.createWeightedBetArray() });
      break;
    case 'flip-v2':
      // Test common flip v2 scenarios
      for (let n = 1; n <= 5; n++) {
        for (let k = 1; k <= n; k++) {
          scenarios.push({ 
            scenario: `heads_${n}coins_${k}target`, 
            betArray: game.calculateBetArray(n, k, 'heads') 
          });
        }
      }
      break;
    case 'blackjack-v2':
      scenarios.push({ scenario: 'default', betArray: [...game.betArray] });
      break;
    case 'mines':
      game.MINE_SELECT.forEach((mineCount: number) => {
        for (let revealed = 0; revealed <= Math.min(game.GRID_SIZE - mineCount, 10); revealed += 2) {
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
    case 'cryptochartgame-v2':
      // Test various target multipliers
      for (let mult = 1.1; mult <= 10; mult += 0.5) {
        scenarios.push({ scenario: `target=${mult.toFixed(1)}x`, betArray: game.calculateBetArray(mult) });
      }
      break;
    case 'doubleornothing-v2':
      // Test different button count scenarios
      [2, 3, 10].forEach(buttonCount => {
        scenarios.push({ scenario: `buttons=${buttonCount}`, betArray: game.calculateBetArray(buttonCount) });
      });
      break;
    case 'fancyvirtualhorseracing-v2':
      // Test each horse (different odds)
      for (let horse = 0; horse < game.HORSES.length; horse++) {
        scenarios.push({ scenario: `horse=${horse}`, betArray: game.calculateBetArray(horse) });
      }
      break;
    case 'keno-v2':
      // Test various number selections
      for (let selections = 1; selections <= 10; selections += 2) {
        scenarios.push({ scenario: `selections=${selections}`, betArray: game.calculateBetArray(selections) });
      }
      break;
    case 'limbo-v2':
      // Test key multiplier targets
      [1.1, 2, 5, 10, 50, 100].forEach(target => {
        scenarios.push({ scenario: `target=${target}x`, betArray: game.calculateBetArray(target) });
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
const runVolumeTest = (betArray: number[], plays: number, wager: number = 1, gameKey?: AllGameKeys, scenario?: string) => {
  let totalWager = 0, totalPayout = 0, wins = 0;
  
  for (let i = 0; i < plays; i++) {
    totalWager += wager;
    
    let randomIndex: number;
    
    // Special handling for Plinko and PlinkoRace - use binomial distribution instead of uniform
    if (gameKey === 'plinko' || gameKey === 'plinkorace') {
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

  (Object.keys(MERGED_RTP_TARGETS) as AllGameKeys[]).forEach(gameKey => {
    const scenarios = generateScenarioBetArrays(gameKey);
    const targetRTP = MERGED_RTP_TARGETS[gameKey];

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

async function auditHandler(request: Request): Promise<Response> {
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

// Export with usage tracking
export default withUsageTracking(auditHandler, 'audit-api', 'audit');
