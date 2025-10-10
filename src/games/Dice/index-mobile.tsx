import { BPS_PER_WHOLE } from 'gamba-core-v2';
import { GambaUi, TokenValue, useCurrentPool, useSound, useWagerInput } from 'gamba-react-ui-v2';
import { useGamba } from 'gamba-react-v2';
import React, { useRef, useState, useEffect } from 'react';
import { SOUND_LOSE, SOUND_PLAY, SOUND_WIN } from './constants';
import { EnhancedWagerInput, MobileControls, GameRecentPlaysHorizontal } from '../../components';
import { useGameStats } from '../../hooks/game/useGameStats';
import { GameStatsHeader } from '../../components/Game/GameStatsHeader';
import GameplayFrame, { GameplayEffectsRef } from '../../components/Game/GameplayFrame';
import { useGraphics } from '../../components/Game/GameScreenFrame';
import { useGameMeta } from '../useGameMeta';
import styled from 'styled-components';
import DICE_THEME from './theme';

const calculateArraySize = (odds: number): number => {
    const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
    return 100 / gcd(100, odds);
};

export const outcomes = (odds: number) => {
    const arraySize = calculateArraySize(odds);
    const payout = (100 / odds).toFixed(4);

    let payoutArray = Array.from({ length: arraySize }).map((_, index) =>
        index < (arraySize * (odds / 100)) ? parseFloat(payout) : 0
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

// Mobile-optimized slider component
const MobileSlider = styled.div`
    width: 100%;
    height: 60px;
    background: linear-gradient(90deg, #1a202c 0%, #2d3748 50%, #1a202c 100%);
    border-radius: 30px;
    position: relative;
    border: 2px solid ${DICE_THEME.colors.tileBorder};
    box-shadow: inset 0 2px 8px rgba(0,0,0,0.3);
    touch-action: pan-x;
`;

const SliderTrack = styled.div<{ $position: number; }>`
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${props => props.$position}%;
    background: linear-gradient(90deg, ${DICE_THEME.colors.tileAccent} 0%, #48bb78 100%);
    border-radius: 28px;
    transition: width 0.2s ease;
`;

const SliderThumb = styled.div<{ $position: number; }>`
    position: absolute;
    top: 50%;
    left: ${props => props.$position}%;
    width: 50px;
    height: 50px;
    background: #fff;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
    border: 3px solid ${DICE_THEME.colors.tileAccent};
    cursor: grab;
    touch-action: none;
    
    &:active {
        cursor: grabbing;
        transform: translate(-50%, -50%) scale(1.1);
    }
`;

const SliderLabel = styled.div<{ $position: number; }>`
    position: absolute;
    top: 50%;
    left: ${props => props.$position}%;
    transform: translate(-50%, -50%);
    color: ${props => props.$position > 50 ? '#1a202c' : '#fff'};
    font-weight: bold;
    font-size: 16px;
    pointer-events: none;
    z-index: 2;
`;

// Mobile-optimized stats tile
const MobileStatTile = styled.div`
    background: ${DICE_THEME.colors.tileBg};
    border-radius: 16px;
    padding: 16px;
    text-align: center;
    flex: 1;
    border: 2px solid ${DICE_THEME.colors.tileBorder};
    box-shadow: 0 4px 16px rgba(26,32,44,0.4);
`;

const StatLabel = styled.div`
    font-size: 12px;
    color: ${DICE_THEME.colors.labelColor};
    margin-bottom: 8px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
`;

const StatValue = styled.div`
    font-size: 18px;
    font-weight: bold;
    color: #fff;
`;

export default function Dice() {
    console.log('📱 MOBILE DICE COMPONENT LOADED!');

    // Essential hooks
    const gamba = useGamba();
    const [wager, setWager] = useWagerInput();
    const pool = useCurrentPool();

    // Game state
    const [resultIndex, setResultIndex] = useState(-1);
    const [rollUnderIndex, setRollUnderIndex] = useState(50);
    const [hasPlayed, setHasPlayed] = useState(false);
    const [lastGameResult, setLastGameResult] = useState<'win' | 'lose' | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Game statistics tracking
    const gameStats = useGameStats('dice');

    // Graphics and effects
    const { settings } = useGraphics();
    const enableEffects = settings.enableEffects;
    const effectsRef = useRef<GameplayEffectsRef>(null);

    // Sound system
    const sounds = useSound({
        win: SOUND_WIN,
        play: SOUND_PLAY,
        lose: SOUND_LOSE,
    });

    // Calculate win chance and multiplier
    const winChance = rollUnderIndex / 100;
    const oddsPercent = Math.max(1, Math.min(99, rollUnderIndex));
    const multiplier = Number(BigInt(100 * BPS_PER_WHOLE) / BigInt(oddsPercent)) / BPS_PER_WHOLE;
    const bet = React.useMemo(() => outcomes(oddsPercent), [oddsPercent]);
    const maxWin = multiplier * wager;
    const poolExceeded = maxWin > (pool?.maxPayout || 0);

    const game = GambaUi.useGame();

    // Mobile slider handlers
    const handleSliderStart = (e: React.TouchEvent | React.MouseEvent) => {
        if (gamba.isPlaying) return;
        setIsDragging(true);
        updateSliderFromEvent(e);
    };

    const handleSliderMove = (e: React.TouchEvent | React.MouseEvent) => {
        if (!isDragging || gamba.isPlaying) return;
        updateSliderFromEvent(e);
    };

    const handleSliderEnd = () => {
        setIsDragging(false);
    };

    const updateSliderFromEvent = (e: React.TouchEvent | React.MouseEvent) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const x = clientX - rect.left;
        const percentage = Math.max(1, Math.min(99, (x / rect.width) * 100));
        setRollUnderIndex(Math.round(percentage));
    };

    useEffect(() => {
        const handleGlobalMove = (e: TouchEvent | MouseEvent) => {
            if (isDragging) {
                e.preventDefault();
            }
        };

        const handleGlobalEnd = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('touchmove', handleGlobalMove, { passive: false });
            document.addEventListener('mousemove', handleGlobalMove);
            document.addEventListener('touchend', handleGlobalEnd);
            document.addEventListener('mouseup', handleGlobalEnd);
        }

        return () => {
            document.removeEventListener('touchmove', handleGlobalMove);
            document.removeEventListener('mousemove', handleGlobalMove);
            document.removeEventListener('touchend', handleGlobalEnd);
            document.removeEventListener('mouseup', handleGlobalEnd);
        };
    }, [isDragging]);

    const resetGame = () => {
        setHasPlayed(false);
        setResultIndex(-1);
        setLastGameResult(null);
    };

    const play = async () => {
        try {
            sounds.play('play');

            await game.play({
                wager,
                bet,
            });

            const result = await game.result();
            const win = result.payout > 0;

            // Generate result number based on win/lose
            let resultNum = 0;
            if (win) {
                // Win: result should be under rollUnderIndex
                resultNum = Math.floor(Math.random() * rollUnderIndex);
            } else {
                // Lose: result should be rollUnderIndex or higher
                resultNum = rollUnderIndex + Math.floor(Math.random() * (100 - rollUnderIndex));
            }

            setResultIndex(resultNum);
            setHasPlayed(true);
            setLastGameResult(win ? 'win' : 'lose');

            // Update stats and play effects
            const profit = result.payout - wager;
            gameStats.updateStats(profit);

            if (win) {
                sounds.play('win');
                if (enableEffects) {
                    effectsRef.current?.winFlash('#00ff00', 1.5);
                    effectsRef.current?.screenShake(1, 600);
                }
            } else {
                sounds.play('lose');
                if (enableEffects) {
                    effectsRef.current?.loseFlash('#ff4444', 0.8);
                    effectsRef.current?.screenShake(0.5, 400);
                }
            }
        } catch (error) {
            console.error('🎲 MOBILE DICE PLAY ERROR:', error);
            setHasPlayed(false);
            setLastGameResult(null);
            setResultIndex(-1);
        }
    };

    return (
        <>
            {/* Recent Plays Portal */}
            <GambaUi.Portal target="recentplays">
                <GameRecentPlaysHorizontal gameId="dice" />
            </GambaUi.Portal>

            {/* Stats Portal */}
            <GambaUi.Portal target="stats">
                <GameStatsHeader
                    gameName="Dice"
                    gameMode="Mobile"
                    stats={gameStats.stats}
                    onReset={gameStats.resetStats}
                    isMobile={true}
                />
            </GambaUi.Portal>

            <GambaUi.Portal target="screen">
                <div style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 25%, #4a5568 50%, #2d3748 75%, #1a202c 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '10px 20px',
                    boxSizing: 'border-box',
                    gap: '20px'
                }}>
                    {/* MOBILE VERSION INDICATOR */}
                    <div style={{
                        background: 'linear-gradient(90deg, #48bb78, #38a169)',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        color: 'white',
                        fontSize: '14px',
                        marginBottom: '8px',
                        boxShadow: '0 2px 10px rgba(72, 187, 120, 0.3)'
                    }}>
                        📱 MOBILE VERSION ACTIVE
                    </div>

                    {/* Result Display */}
                    <div style={{
                        textAlign: 'center',
                        padding: '20px',
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <div style={{
                            fontSize: '16px',
                            color: hasPlayed && resultIndex >= 0 ? (lastGameResult === 'win' ? '#48bb78' : '#e53e3e') : '#a0aec0',
                            marginBottom: '8px',
                            fontWeight: hasPlayed ? 'bold' : 'normal'
                        }}>
                            {hasPlayed && resultIndex >= 0 ?
                                `Roll Result: ${resultIndex} - ${lastGameResult === 'win' ? 'WIN!' : 'LOSE'}` :
                                'Roll the dice to see your result'
                            }
                        </div>

                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#48bb78', marginBottom: '4px' }}>
                            <TokenValue exact amount={maxWin} />
                        </div>
                        <div style={{ fontSize: '14px', color: '#a0aec0' }}>
                            Possible Winning
                        </div>
                    </div>

                    {/* Mobile Slider */}
                    <div style={{ padding: '20px 0' }}>
                        <div style={{
                            fontSize: '14px',
                            color: '#a0aec0',
                            textAlign: 'center',
                            marginBottom: '16px'
                        }}>
                            Roll Under {rollUnderIndex}
                        </div>

                        <MobileSlider
                            onTouchStart={handleSliderStart}
                            onMouseDown={handleSliderStart}
                            onTouchMove={handleSliderMove}
                            onMouseMove={handleSliderMove}
                            onTouchEnd={handleSliderEnd}
                            onMouseUp={handleSliderEnd}
                        >
                            <SliderTrack $position={rollUnderIndex} />
                            <SliderThumb $position={rollUnderIndex} />
                            <SliderLabel $position={rollUnderIndex}>{rollUnderIndex}</SliderLabel>
                        </MobileSlider>

                        {/* Slider Numbers */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: '8px',
                            fontSize: '12px',
                            color: '#718096'
                        }}>
                            <span>1</span>
                            <span>25</span>
                            <span>50</span>
                            <span>75</span>
                            <span>99</span>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <MobileStatTile>
                            <StatLabel>Multiplier</StatLabel>
                            <StatValue>{multiplier.toFixed(2)}x</StatValue>
                        </MobileStatTile>

                        <MobileStatTile>
                            <StatLabel>Win Chance</StatLabel>
                            <StatValue>{rollUnderIndex}%</StatValue>
                        </MobileStatTile>
                    </div>

                    <GameplayFrame
                        ref={effectsRef}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            pointerEvents: 'none',
                            zIndex: 1000
                        }}
                        {...(useGameMeta('dice') && {
                            title: useGameMeta('dice')!.name,
                            description: useGameMeta('dice')!.description
                        })}
                    />
                </div>
            </GambaUi.Portal>

            <GambaUi.Portal target="controls">
                <MobileControls
                    wager={wager}
                    setWager={setWager}
                    onPlay={hasPlayed ? resetGame : play}
                    playDisabled={gamba.isPlaying || (!hasPlayed && poolExceeded)}
                    playText={hasPlayed ? "Roll Again" : "Roll Dice"}
                >
                    <EnhancedWagerInput value={wager} onChange={setWager} />
                </MobileControls>
            </GambaUi.Portal>
        </>
    );
}