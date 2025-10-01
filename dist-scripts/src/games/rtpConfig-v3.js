"use strict";
/**
 * Centralized RTP (Return To Player) Configuration for DegenCasino V3
 *
 * This is the single source of truth for all game RTP configurations.
 * All games must use this configuration to ensure blockchain validation.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBucketColor = exports.V3_UTILS = exports.BET_ARRAYS_V3 = exports.RTP_TARGETS_V3 = void 0;
// Central RTP targets - consistent across all games
exports.RTP_TARGETS_V3 = {
    // Base Games
    'dice': 0.95, // 95% RTP - 5% house edge
    'magic8ball': 0.95, // 95% RTP - 5% house edge
    'mines': 0.94, // 94% RTP - 6% house edge
    'plinko': 0.95, // 95% RTP - 5% house edge
    'crash': 0.95, // 95% RTP - 5% house edge
    'slots': 0.96, // 96% RTP - 4% house edge
    'flip': 0.96, // 96% RTP - 4% house edge
    'hilo': 0.95, // 95% RTP - 5% house edge
    // Skill-Based Games (higher RTP due to skill element)
    'poker': 0.97, // 97% RTP - 3% house edge
    'blackjack': 0.97, // 97% RTP - 3% house edge
};
// Game-specific configurations
exports.BET_ARRAYS_V3 = {
    'dice': {
        OUTCOMES: 100, // 0-99 for maximum precision
        outcomes: Array.from({ length: 100 }, (_, i) => i),
        calculateBetArray: (rollUnder) => {
            const OUTCOMES = 100;
            const betArray = Array(OUTCOMES).fill(0);
            if (rollUnder > 0 && rollUnder <= 100) {
                const winProbability = rollUnder / 100;
                const fairMultiplier = 1 / winProbability;
                const houseMultiplier = fairMultiplier * exports.RTP_TARGETS_V3['dice'];
                for (let i = 0; i < rollUnder; i++) {
                    betArray[i] = parseFloat(houseMultiplier.toFixed(4));
                }
            }
            return betArray;
        }
    },
    'magic8ball': {
        OUTCOMES: 2,
        outcomes: [0, 1], // [Win, Lose]
        calculateBetArray: () => {
            const winProbability = 0.5;
            const fairMultiplier = 1 / winProbability;
            const houseMultiplier = fairMultiplier * exports.RTP_TARGETS_V3['magic8ball'];
            return [
                parseFloat(houseMultiplier.toFixed(4)), // Win
                0 // Lose
            ];
        }
    },
    'mines': {
        GRID_SIZE: 25, // Updated to match UI
        MINE_OPTIONS: [1, 3, 5, 10, 15, 24],
        calculateBetArray: (mineCount, cellsRevealed) => {
            const GRID_SIZE = exports.BET_ARRAYS_V3.mines.GRID_SIZE;
            const safeCells = GRID_SIZE - mineCount;
            const remainingSafeCells = safeCells - cellsRevealed;
            const betArray = Array(GRID_SIZE + 1).fill(0);
            if (remainingSafeCells > 0) {
                let prob = 1;
                for (let i = 0; i < cellsRevealed; i++) {
                    prob *= (safeCells - i) / (GRID_SIZE - i);
                }
                const multiplier = prob > 0 ? (1 - (1 - exports.RTP_TARGETS_V3['mines'])) / prob : 0;
                betArray[cellsRevealed] = parseFloat(multiplier.toFixed(4));
            }
            return betArray;
        },
        getMultiplier: (mineCount, cellsRevealed) => {
            const GRID_SIZE = exports.BET_ARRAYS_V3.mines.GRID_SIZE;
            const safeCells = GRID_SIZE - mineCount;
            const remainingSafeCells = safeCells - (cellsRevealed || 0);
            if (remainingSafeCells <= 0)
                return 0;
            const pWin = remainingSafeCells / GRID_SIZE;
            const fairMultiplier = 1 / pWin;
            return parseFloat((fairMultiplier * exports.RTP_TARGETS_V3['mines']).toFixed(4));
        }
    },
    'plinko': {
        PEGS: { normal: 14, degen: 16 },
        BUCKETS: { normal: 8, degen: 10 },
        _binomialProb(n, k) {
            if (k > n)
                return 0;
            if (k === 0 || k === n)
                return 1;
            k = Math.min(k, n - k);
            let c = 1;
            for (let i = 0; i < k; i++) {
                c = c * (n - i) / (i + 1);
            }
            return c;
        },
        _probabilities(n) {
            const probs = [];
            for (let k = 0; k <= n; k++) {
                probs.push(this._binomialProb(n, k) * Math.pow(0.5, n));
            }
            return probs;
        },
        calculateBetArray: (mode = 'normal') => {
            const rows = exports.BET_ARRAYS_V3.plinko.PEGS[mode];
            const buckets = exports.BET_ARRAYS_V3.plinko.BUCKETS[mode];
            const probs = exports.BET_ARRAYS_V3.plinko._probabilities(rows);
            // Calculate fair multipliers
            const fairMultipliers = probs.map(p => p > 0 ? (1 / p) : 0);
            // Apply house edge
            const houseEdge = 1 - exports.RTP_TARGETS_V3['plinko'];
            const houseMultipliers = fairMultipliers.map(m => m * (1 - houseEdge));
            // Round to 2 decimal places
            return houseMultipliers.map(m => parseFloat(m.toFixed(2)));
        }
    }
};
// Utility functions for bet array validation
exports.V3_UTILS = {
    // Calculate actual RTP for a bet array
    calculateRTP: (gameKey, betArray) => {
        const totalOutcomes = betArray.length;
        const expectedValue = betArray.reduce((sum, multiplier) => sum + multiplier, 0) / totalOutcomes;
        return parseFloat(expectedValue.toFixed(4));
    },
    // Validate RTP is within acceptable range
    validateRTP: (gameKey, betArray) => {
        const targetRTP = exports.RTP_TARGETS_V3[gameKey];
        const actualRTP = exports.V3_UTILS.calculateRTP(gameKey, betArray);
        const tolerance = 0.01; // 1% tolerance
        return Math.abs(actualRTP - targetRTP) <= tolerance;
    },
    // Get game's target RTP
    getTargetRTP: (gameKey) => {
        return exports.RTP_TARGETS_V3[gameKey];
    },
    // Calculate win rate for a bet array
    calculateWinRate: (betArray) => {
        const winningOutcomes = betArray.filter(multiplier => multiplier > 0).length;
        return parseFloat((winningOutcomes / betArray.length).toFixed(4));
    }
};
// Utility function to determine bucket color based on multiplier value
const getBucketColor = (multiplier) => {
    if (multiplier <= 0.99) {
        return {
            primary: 'rgba(239, 68, 68, 0.9)',
            secondary: 'rgba(220, 38, 38, 0.85)',
            tertiary: 'rgba(185, 28, 28, 0.9)'
        };
    }
    else if (multiplier >= 1.00 && multiplier <= 3.99) {
        return {
            primary: 'rgba(245, 158, 11, 0.9)',
            secondary: 'rgba(217, 119, 6, 0.85)',
            tertiary: 'rgba(180, 83, 9, 0.9)'
        };
    }
    else if (multiplier >= 4.00 && multiplier <= 6.99) {
        return {
            primary: 'rgba(34, 197, 94, 0.9)',
            secondary: 'rgba(22, 163, 74, 0.85)',
            tertiary: 'rgba(21, 128, 61, 0.9)'
        };
    }
    else {
        return {
            primary: 'rgba(59, 130, 246, 0.9)',
            secondary: 'rgba(37, 99, 235, 0.85)',
            tertiary: 'rgba(29, 78, 216, 0.9)'
        };
    }
};
exports.getBucketColor = getBucketColor;
