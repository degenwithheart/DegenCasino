import { BPS_PER_WHOLE } from 'gamba-core-v2';
import {
  FAKE_TOKEN_MINT,
  GambaUi,
  TokenValue,
  useCurrentPool,
  useCurrentToken,
  useSound,
  useWagerInput,
  useTokenBalance,
} from 'gamba-react-ui-v2';
import { TOKEN_METADATA } from '../../constants';
import { useGamba } from 'gamba-react-v2';
import React, { useContext, useRef } from 'react';
import { GambaResultContext } from '../../context/GambaResultContext';
import Slider from './Slider';
import DicePaytable, { DicePaytableRef } from './DicePaytable';
import { SOUND_LOSE, SOUND_PLAY, SOUND_TICK, SOUND_WIN } from './constants';
import { Container, Result, RollUnder, Stats } from './styles';
import { GameControls } from '../../components';
import { useIsCompact } from '../../hooks/useIsCompact';

const calculateArraySize = (odds: number): number => {
  const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
  return 100 / gcd(100, odds);
};

export const outcomes = (odds: number) => {
  const arraySize = calculateArraySize(odds);
  const payout = (100 / odds).toFixed(4);

  let payoutArray = Array.from({ length: arraySize }).map((_, index) =>
    index < arraySize * (odds / 100) ? parseFloat(payout) : 0
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

// Styled payout info panel (like Mines) - REMOVED, replaced with live paytable

export default function Dice() {
  const gamba = useGamba();
  const [wager, setWager] = useWagerInput();
  const token = useCurrentToken();
  const { balance } = useTokenBalance();
  const isCompact = useIsCompact();

  // Find token metadata for symbol display
  const tokenMeta = token
    ? TOKEN_METADATA.find((t: any) => t.symbol === token.symbol)
    : undefined;

  const pool = useCurrentPool();
  const [resultIndex, setResultIndex] = React.useState(-1);
  const [rollUnderIndex, setRollUnderIndex] = React.useState(Math.floor(100 / 2));
  const [isWin, setIsWin] = React.useState<boolean | null>(null);
  const [profitAmount, setProfitAmount] = React.useState(0);
  
  // Live paytable tracking
  const paytableRef = useRef<DicePaytableRef>(null)
  const [currentResult, setCurrentResult] = React.useState<{
    rollValue: number
    targetValue: number
    multiplier: number
    wasWin: boolean
  } | undefined>()

  const { setGambaResult } = useContext(GambaResultContext);
  const sounds = useSound({
    win: SOUND_WIN,
    play: SOUND_PLAY,
    lose: SOUND_LOSE,
    tick: SOUND_TICK,
  });

  const baseWager = tokenMeta?.baseWager ?? (token ? Math.pow(10, token.decimals ?? 0) : 1);

  // Set default wager: 1 for free tokens, 0 for real tokens
  React.useEffect(() => {
    if (token?.mint?.equals?.(FAKE_TOKEN_MINT)) {
      setWager(baseWager); // 1 token for free token
    } else {
      setWager(0); // 0 for real tokens
    }
  }, [setWager, token, baseWager]);

  const multiplier =
    Number(BigInt(100 * BPS_PER_WHOLE) / BigInt(rollUnderIndex)) / BPS_PER_WHOLE;

  const maxWager = React.useMemo(() => {
    if (!pool?.maxPayout || !multiplier) return balance;
    return Math.min(pool.maxPayout / multiplier, balance, baseWager * 1000000);
  }, [pool?.maxPayout, multiplier, balance, baseWager]);

  const odds = Math.floor((rollUnderIndex / 100) * 100);

  const bet = React.useMemo(() => outcomes(odds), [odds]);

  const maxWin = multiplier * wager;

  const game = GambaUi.useGame();

  const play = async () => {
    sounds.play('play');

    await game.play({
      wager,
      bet,
    });

    const result = await game.result();

    const win = result.payout > 0;

    setGambaResult(result); // Call setGambaResult after receiving result
    const resultNum = win
      ? Math.floor(Math.random() * rollUnderIndex)
      : Math.floor(Math.random() * (100 - rollUnderIndex) + rollUnderIndex);

    setResultIndex(resultNum);

    win ? sounds.play('win') : sounds.play('lose');
    setIsWin(win);
    setProfitAmount(result.payout - wager);

    // Track result in paytable
    const rollMultiplier = 99 / rollUnderIndex;
    const resultData = {
      rollValue: resultNum + 1,
      targetValue: rollUnderIndex,
      multiplier: rollMultiplier,
      wasWin: win
    };
    setCurrentResult(resultData);
    
    if (paytableRef.current) {
      paytableRef.current.trackRoll({
        rollValue: resultNum + 1,
        targetValue: rollUnderIndex,
        multiplier: rollMultiplier,
        wasWin: win,
        amount: result.payout
      });
    }
  };

  const test = async () => {
    if (gamba.isPlaying) return;
    await play();
  };

  const simulate = async () => {
    if (gamba.isPlaying) return;
    for (let i = 0; i < 10; i++) {
      await play();
    }
  };

  const playButtonText = "Play";

  return (
    <>
      <GambaUi.Portal target="screen">
        <div style={{ display: 'flex', gap: 16, height: '100%', width: '100%' }}>
          {/* Main game area */}
          <div
            style={{
              flex: 1,
              minHeight: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #0f1419 0%, #1a1a2e 50%, #16213e 100%)',
              borderRadius: '20px',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              boxShadow: `
                0 20px 40px rgba(0, 0, 0, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.1),
                inset 0 -1px 0 rgba(0, 0, 0, 0.2)
              `,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <Container>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 28,
                  color: '#fff',
                  marginBottom: 16,
                  letterSpacing: 2,
                  textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                  textAlign: 'center'
                }}
              >
                🎲 Roll the Dice!
              </div>
              
              <RollUnder>
                <div>
                  <div
                    style={{ 
                      fontSize: 42, 
                      color: '#00ffe1', 
                      fontWeight: 800,
                      textShadow: '0 0 20px rgba(0, 255, 225, 0.5)',
                    }}
                  >
                    {rollUnderIndex + 1}
                  </div>
                  <div style={{ fontSize: 16, color: '#bbb', fontWeight: 600 }}>Roll Under</div>
                </div>
              </RollUnder>
              
              <Stats>
                <div style={{
                  background: 'rgba(34, 197, 94, 0.2)',
                  borderRadius: '12px',
                  padding: '8px 12px',
                  border: '1px solid rgba(34, 197, 94, 0.3)'
                }}>
                  <div style={{ color: '#22c55e', fontWeight: 700, fontSize: 18 }}>
                    {((rollUnderIndex / 100) * 100).toFixed(2)}%
                  </div>
                  <div style={{ color: '#aaa', fontSize: 12 }}>Win Chance</div>
                </div>
                
                <div style={{
                  background: 'rgba(255, 215, 0, 0.2)',
                  borderRadius: '12px',
                  padding: '8px 12px',
                  border: '1px solid rgba(255, 215, 0, 0.3)'
                }}>
                  <div style={{ color: '#ffd700', fontWeight: 700, fontSize: 18 }}>
                    {multiplier.toFixed(2)}x
                  </div>
                  <div style={{ color: '#aaa', fontSize: 12 }}>Multiplier</div>
                </div>
                
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '8px 12px',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>
                    <TokenValue suffix="" amount={maxWin} />
                  </div>
                  <div style={{ color: '#aaa', fontSize: 12 }}>Payout</div>
                </div>
              </Stats>
              
              <div style={{ position: 'relative', marginTop: 20 }}>
                {resultIndex > -1 && (
                  <Result
                    style={{
                      left: `${(resultIndex / 100) * 100}%`,
                      background: isWin === true
                        ? 'linear-gradient(135deg, #00ffb0, #00d4aa)'
                        : isWin === false
                        ? 'linear-gradient(135deg, #ff5252, #f44336)'
                        : 'linear-gradient(135deg, #ffe066, #ffcc02)',
                      color: '#000',
                      fontWeight: 800,
                      borderRadius: 12,
                      padding: '8px 16px',
                      fontSize: 22,
                      boxShadow: '0 4px 16px rgba(0,0,0,0.3), 0 0 0 2px rgba(255,255,255,0.2)',
                      transition: 'all 0.4s ease',
                    }}
                  >
                    <div key={resultIndex}>{resultIndex + 1}</div>
                  </Result>
                )}
                <Slider
                  disabled={gamba.isPlaying}
                  range={[0, 100]}
                  min={1}
                  max={95}
                  value={rollUnderIndex}
                  onChange={(value) => {
                    setRollUnderIndex(value);
                    sounds.play('tick');
                  }}
                />
              </div>
            </Container>
          </div>

          {/* Paytable sidebar */}
          <DicePaytable
            ref={paytableRef}
            odds={99 / rollUnderIndex}
            rollUnder={true}
            wager={wager}
            currentResult={currentResult}
          />
        </div>
      </GambaUi.Portal>
      {/* Controls */}
      <GameControls
        wager={wager}
        setWager={setWager}
        onPlay={play}
        isPlaying={gamba.isPlaying}
        showOutcome={false}
        playButtonText={playButtonText}
      >
      </GameControls>
    </>
  );
}
