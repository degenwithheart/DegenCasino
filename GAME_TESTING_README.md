# Casino Game Testing Suite

This comprehensive testing suite verifies the integrity and fairness of all casino games by running 1000 real test games and checking:

1. **RTP & Win Rate Accuracy** - Ensures actual returns match expected mathematical models
2. **Result Consistency** - Verifies visual results match console results and on-chain Gamba results  
3. **Game Integrity** - Validates all game logic and payout calculations

## Quick Start

### Basic Comprehensive Test
```bash
# Run the comprehensive test suite (1000 games per game type)
npx ts-node comprehensive-game-test.ts
```

### Enhanced Real-Game Test
```bash
# Run enhanced tests with real game integration
npx ts-node enhanced-real-game-test.ts
```

### Add to package.json
```json
{
  "scripts": {
    "test:games": "ts-node comprehensive-game-test.ts",
    "test:games:enhanced": "ts-node enhanced-real-game-test.ts",
    "test:games:quick": "ts-node comprehensive-game-test.ts --games=100",
    "test:games:extensive": "ts-node comprehensive-game-test.ts --games=10000"
  }
}
```

## Test Configuration

### Tolerance Levels
- **RTP Tolerance**: 2% variance allowed from target RTP
- **Win Rate Tolerance**: 5% variance allowed from expected win rate
- **Consistency**: 99%+ consistency required between visual/console/gamba results

### Games Tested
- ✅ **Flip** - Coin flip game (96% RTP, 50% win rate)
- ✅ **Dice** - Roll under game (95% RTP, variable win rate)
- ✅ **Slots** - Slot machine (94% RTP, ~22% win rate)
- ✅ **Plinko** - Ball drop game (95% RTP, 100% win rate)
- ✅ **Crash** - Multiplier crash game (96% RTP, ~40% win rate)
- ✅ **Mines** - Minesweeper game (94% RTP, ~60% win rate)
- ✅ **HiLo** - Card prediction game (95% RTP, ~48% win rate)
- ✅ **Blackjack** - Classic card game (97% RTP, ~47% win rate)
- ✅ **Progressive Poker** - Video poker (96% RTP, ~21% win rate)

## Output & Reports

### Test Results Directory
```
./test-results/
├── comprehensive-test-report-YYYY-MM-DD.json    # Main detailed report
├── test-summary-YYYY-MM-DD.csv                  # CSV summary for analysis
├── flip-detailed-YYYY-MM-DD.json                # Detailed flip game results
├── dice-detailed-YYYY-MM-DD.json                # Detailed dice game results
└── ...                                          # Individual game reports
```

### Enhanced Results Directory
```
./enhanced-test-results/
├── enhanced-test-results-YYYY-MM-DD.json        # Real game integration results
└── ...
```

## Report Structure

### Main Report Contents
```json
{
  "timestamp": "2025-01-XX...",
  "testConfig": { ... },
  "summary": {
    "totalGames": 9000,
    "totalGameTypes": 9,
    "overallRTPAccuracy": 98.5,
    "overallWinRateAccuracy": 97.2,
    "consistencyScore": 99.8,
    "passedGames": ["flip", "dice", ...],
    "failedGames": []
  },
  "gameResults": [ ... ],
  "performanceReport": { ... },
  "recommendations": [ ... ]
}
```

### Individual Game Results
```json
{
  "gameId": "flip",
  "gameName": "Coin Flip",
  "totalGames": 1000,
  "wins": 502,
  "losses": 498,
  "actualRTP": 0.9612,
  "expectedRTP": 0.96,
  "rtpWithinTolerance": true,
  "consistencyErrors": 0,
  "detailedResults": [ ... ]
}
```

## Key Verification Points

### 1. RTP & Win Rate Verification
- Tests actual game outcomes against mathematical models
- Validates house edge is within expected ranges
- Ensures games are neither too generous nor too harsh

### 2. Visual-Console-Gamba Consistency
- **Visual Result**: What the player sees in the UI
- **Console Result**: Internal game logic calculation  
- **Gamba Result**: On-chain blockchain result
- All three must match exactly for game integrity

### 3. Performance Metrics
- Games per second processing rate
- Memory usage during testing
- Network latency simulation (for real tests)

## Interpreting Results

### ✅ PASS Criteria
- RTP variance ≤ 2% from target
- Win rate variance ≤ 5% from expected
- Zero consistency errors between visual/console/gamba
- No critical errors during game execution

### ❌ FAIL Indicators
- RTP significantly outside tolerance range
- Visual results don't match on-chain results
- Frequent game execution errors
- Mathematical model inconsistencies

### 🔍 Investigation Triggers
- Consistency score < 99%
- Performance significantly below baseline
- Unexpected variance patterns
- Memory leaks or resource issues

## Advanced Configuration

### Environment Variables
```bash
# For enhanced real-game testing
export RPC_ENDPOINT="https://api.mainnet-beta.solana.com"
export GAMBA_PROGRAM_ID="GambA1vAVaHjuvnCJJPEgJQf5XCZKYjGMQ7MG6K7M6S"
export TEST_MODE="simulation" # or "integration" or "live"
```

### Custom Test Parameters
```typescript
const CUSTOM_CONFIG = {
  GAMES_TO_TEST: 5000,      // More games for higher confidence
  TOLERANCE_RTP: 0.01,      // Stricter RTP tolerance (1%)
  TOLERANCE_WIN_RATE: 0.03, // Stricter win rate tolerance (3%)
  VERBOSE: true,            // Enable detailed logging
  RANDOM_SEED: 12345,       // Fixed seed for reproducible tests
};
```

## Troubleshooting

### Common Issues

**High RTP Variance**
```
Problem: actualRTP: 0.89, expectedRTP: 0.96, variance: 7%
Solution: Check game logic, verify bet arrays, review RNG implementation
```

**Consistency Errors**
```
Problem: Visual shows win=true, Gamba shows payout=0
Solution: Check result mapping logic, verify UI state management
```

**Performance Issues**
```
Problem: <100 games/second, high memory usage
Solution: Optimize game loops, check for memory leaks, review async patterns
```

### Debug Mode
```bash
# Run with detailed debugging
DEBUG=casino:* npx ts-node comprehensive-game-test.ts

# Test single game type
npx ts-node comprehensive-game-test.ts --game=flip --verbose
```

## Security & Fairness

This testing suite ensures:
- **Provable Fairness**: All results are deterministic and verifiable
- **No Hidden Bias**: RTP matches published rates exactly
- **Transparency**: Complete audit trail of every test game
- **Compliance**: Meets industry standards for game testing

## Integration with CI/CD

### GitHub Actions Example
```yaml
name: Game Integrity Tests
on: [push, pull_request]
jobs:
  test-games:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run test:games
      - name: Upload test results
        uses: actions/upload-artifact@v2
        with:
          name: game-test-results
          path: ./test-results/
```

---

**⚠️ Important**: These tests should be run before any game deployment to production. All games must pass with 100% consistency to ensure player trust and regulatory compliance.
