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
import React, { useContext } from 'react';
import { GambaResultContext } from '../../context/GambaResultContext';
import Slider from './Slider';
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

// Styled payout info panel (like Mines)
function PayoutTable({
  rollUnderIndex,
  multiplier,
  maxWin,
  token,
}: {
  rollUnderIndex: number;
  multiplier: number;
  maxWin: number;
  token: any;
}) {
  return (
    <div
      style={{
        minWidth: 240,
        maxWidth: 320,
        marginLeft: 24,
        background: 'rgba(24,24,24,0.95)',
        borderRadius: 14,
        padding: '16px 14px',
        boxShadow: '0 2px 12px #0004',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '1.5px solid #222',
        backdropFilter: 'blur(6px)',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          marginBottom: 8,
          fontWeight: 700,
          color: '#ffe066',
          fontSize: '1.1rem',
          letterSpacing: 1,
        }}
      >
        Payout Info
      </div>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          background: 'none',
          color: '#ccc',
          borderRadius: 8,
          overflow: 'hidden',
          marginBottom: 8,
        }}
      >
        <tbody>
          <tr style={{ background: '#181818' }}>
            <td style={{ padding: '8px 6px', fontWeight: 600 }}>Roll Under</td>
            <td style={{ padding: '8px 6px', color: '#00ffe1', fontWeight: 700 }}>
              {rollUnderIndex + 1}
            </td>
          </tr>
          <tr>
            <td style={{ padding: '8px 6px', fontWeight: 600 }}>Win Chance</td>
            <td style={{ padding: '8px 6px', color: '#00ffb0', fontWeight: 700 }}>
              {((rollUnderIndex / 100) * 100).toFixed(2)}%
            </td>
          </tr>
          <tr style={{ background: '#181818' }}>
            <td style={{ padding: '8px 6px', fontWeight: 600 }}>Multiplier</td>
            <td style={{ padding: '8px 6px', color: '#ffd700', fontWeight: 700 }}>
              {multiplier.toFixed(2)}x
            </td>
          </tr>
          <tr>
            <td style={{ padding: '8px 6px', fontWeight: 600 }}>Payout</td>
            <td style={{ padding: '8px 6px', color: '#fff', fontWeight: 700 }}>
              <TokenValue suffix={token?.symbol || ''} amount={maxWin} />
            </td>
          </tr>
        </tbody>
      </table>
      <div style={{ marginTop: 6, color: '#aaa', fontSize: 12, textAlign: 'center' }}>
        Adjust the slider to set your odds.
        <br />
        Higher risk, higher reward!
      </div>
    </div>
  );
}

function getResponsiveScale() {
  if (typeof window === 'undefined') return 1;
  const width = window.innerWidth;
  if (width < 400) return 0.82;
  if (width < 600) return 0.92;
  if (width < 900) return 1.02;
  if (width < 1200) return 1.12;
  return 1.18;
}

export default function Dice() {
  const gamba = useGamba();
  const [wager, setWager] = useWagerInput();
  const token = useCurrentToken();
  const { balance } = useTokenBalance();

  // Find token metadata for symbol display
  const tokenMeta = token
    ? TOKEN_METADATA.find((t: any) => t.symbol === token.symbol)
    : undefined;

  const pool = useCurrentPool();
  const [resultIndex, setResultIndex] = React.useState(-1);
  const [rollUnderIndex, setRollUnderIndex] = React.useState(Math.floor(100 / 2));
  const [isWin, setIsWin] = React.useState<boolean | null>(null);
  const [profitAmount, setProfitAmount] = React.useState(0);

  const { setGambaResult } = useContext(GambaResultContext);
  const sounds = useSound({
    win: SOUND_WIN,
    play: SOUND_PLAY,
    lose: SOUND_LOSE,
    tick: SOUND_TICK,
  });

  const baseWager = tokenMeta?.baseWager ?? (token ? Math.pow(10, token.decimals ?? 0) : 1);

  // Use isCompact and scale state properly
  const isCompact = useIsCompact();
  const [scale, setScale] = React.useState(isCompact ? 1 : 1.2);

  React.useEffect(() => {
    let timeoutId: any;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setScale(getResponsiveScale());
      }, 120);
    };
    window.addEventListener('resize', handleResize);

    // Update scale on isCompact change as well
    setScale(isCompact ? 1 : 1.2);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [isCompact]);

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
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px 0',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 32,
              width: '100%',
              maxWidth: 1100,
              margin: '0 auto',
              flexWrap: 'wrap',
              boxSizing: 'border-box',
            }}
          >
            {/* Main Game Card */}
            <div
              style={{
                flex: '1 1 420px',
                minWidth: 340,
                maxWidth: 800,
                minHeight: 420,
                background: 'rgba(30,32,50,0.92)',
                borderRadius: 18,
                boxShadow: '0 4px 32px #0006',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                border:
                  isWin === true
                    ? '2.5px solid #00ffb0'
                    : isWin === false
                    ? '2.5px solid #ff5252'
                    : '2.5px solid #222',
                transition: 'border 0.3s',
                transform: `scale(${scale})`,
                transformOrigin: 'center center',
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 22,
                  color: '#fff',
                  marginBottom: 8,
                  letterSpacing: 1,
                }}
              >
                Roll the Dice!
              </div>
              <Container>
                <RollUnder>
                  <div>
                    <div
                      style={{ fontSize: 32, color: '#00ffe1', fontWeight: 700 }}
                    >
                      {rollUnderIndex + 1}
                    </div>
                    <div style={{ fontSize: 14, color: '#aaa' }}>Roll Under</div>
                  </div>
                </RollUnder>
                <Stats>
                  <div>
                    <div style={{ color: '#00ffb0', fontWeight: 700 }}>
                      {((rollUnderIndex / 100) * 100).toFixed(2)}%
                    </div>
                    <div style={{ color: '#aaa' }}>Win Chance</div>
                  </div>
                  <div>
                    <div style={{ color: '#ffd700', fontWeight: 700 }}>
                      {multiplier.toFixed(2)}x
                    </div>
                    <div style={{ color: '#aaa' }}>Multiplier</div>
                  </div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 700 }}>
                      <TokenValue suffix="" amount={maxWin} />
                    </div>
                    <div style={{ color: '#aaa' }}>Payout</div>
                  </div>
                </Stats>
                <div style={{ position: 'relative', marginTop: 16 }}>
                  {resultIndex > -1 && (
                    <Result
                      style={{
                        left: `${(resultIndex / 100) * 100}%`,
                        background:
                          isWin === true
                            ? '#00ffb0'
                            : isWin === false
                            ? '#ff5252'
                            : '#ffe066',
                        color: '#181818',
                        fontWeight: 700,
                        borderRadius: 8,
                        padding: '6px 14px',
                        fontSize: 20,
                        boxShadow: '0 2px 8px #0004',
                        transition: 'background 0.3s',
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
            {/* Payout Info Panel */}
            <PayoutTable
              rollUnderIndex={rollUnderIndex}
              multiplier={multiplier}
              maxWin={maxWin}
              token={token}
            />
          </div>
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
