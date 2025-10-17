import { BPS_PER_WHOLE } from 'gamba-core-v2';
import { GambaUi, TokenValue, useCurrentPool, useSound, useWagerInput } from 'gamba-react-ui-v2';
import { useGamba } from 'gamba-react-v2';
import React, { useRef, useState, useEffect } from 'react';
import { EnhancedWagerInput, MobileControls, DesktopControls, GameControlsSection, GameRecentPlaysHorizontal } from '../../components';
import { CARD_VALUES, RANKS, RANK_SYMBOLS, SUIT_COLORS, SUIT_SYMBOLS, SUITS, SOUND_CARD, SOUND_LOSE, SOUND_PLAY, SOUND_WIN, SOUND_JACKPOT } from './constants';
import { Card, CardContainer, CardsContainer, Container, CardArea, Table, TableInner } from './styles';
import { useIsCompact } from '../../hooks/ui/useIsCompact';
import { useGameStats } from '../../hooks/game/useGameStats';
import { GameStatsHeader } from '../../components/Game/GameStatsHeader';
import GameplayFrame, { GameplayEffectsRef } from '../../components/Game/GameplayFrame';
import { useGraphics } from '../../components/Game/GameScreenFrame';
import { useGameMeta } from '../useGameMeta';
import styled, { css } from 'styled-components';

const randomRank = () => Math.floor(Math.random() * RANKS);
const randomSuit = () => Math.floor(Math.random() * SUITS);

const createCard = (rank = randomRank(), suit = randomSuit()): GameCard => ({
    key: Math.random(),
    rank,
    suit,
});

interface GameCard {
    key: number;
    rank: number;
    suit: number;
}

export interface BlackjackConfig {
    logo: string;
}

export default function BlackJack2D(props: BlackjackConfig) {
    const game = GambaUi.useGame();
    const gamba = useGamba();
    const pool = useCurrentPool();
    const [wager, setWager] = useWagerInput();
    const [playerHand, setPlayerHand] = React.useState<Array<{ card: GameCard | null, revealed: boolean; }>>([{ card: null, revealed: false }, { card: null, revealed: false }]);
    const [dealerHand, setDealerHand] = React.useState<Array<{ card: GameCard | null, revealed: boolean; }>>([{ card: null, revealed: false }, { card: null, revealed: false }]);
    const [profit, setProfit] = React.useState<number | null>(null);
    const [claiming, setClaiming] = React.useState(false);

    const { mobile: isMobile } = useIsCompact();
    const gameStats = useGameStats('blackjack');
    const { settings } = useGraphics();
    const enableEffects = settings.enableEffects;
    const effectsRef = useRef<GameplayEffectsRef>(null);

    const sounds = useSound({
        win: SOUND_WIN,
        lose: SOUND_LOSE,
        play: SOUND_PLAY,
        card: SOUND_CARD,
        jackpot: SOUND_JACKPOT,
    });

    const resetGame = () => {
        setProfit(null);
        setPlayerHand([{ card: null, revealed: false }, { card: null, revealed: false }]);
        setDealerHand([{ card: null, revealed: false }, { card: null, revealed: false }]);
    };

    const play = async () => {
        // Reset game state before playing
        resetGame();
        sounds.play('play');

        const betArray = [2.5, 2.5, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        await game.play({
            bet: betArray,
            wager: wager,
        });

        const result = await game.result();
        const payoutMultiplier = result.payout / wager;

        let newPlayerCards: GameCard[] = [];
        let newDealerCards: GameCard[] = [];

        if (payoutMultiplier === 2.5) {
            // Player got blackjack
            newPlayerCards = generateBlackjackHand();
            newDealerCards = generateRandomHandBelow(21);
        } else if (payoutMultiplier === 2) {
            // Player wins normally
            newPlayerCards = generateWinningHand();
            newDealerCards = generateLosingHand(newPlayerCards);
        } else {
            // Player loses
            newPlayerCards = generateLosingHand();
            newDealerCards = generateWinningHandOver(newPlayerCards);
        }

        setPlayerHand([
            { card: newPlayerCards[0], revealed: false },
            { card: newPlayerCards[1], revealed: false }
        ]);
        setDealerHand([
            { card: newDealerCards[0], revealed: false },
            { card: newDealerCards[1], revealed: false }
        ]);

        // Function to deal cards one by one
        const dealCards = async () => {
            for (let i = 0; i < 2; i++) {
                // Deal to player
                setPlayerHand(prev => prev.map((slot, idx) => idx === i ? { ...slot, revealed: true } : slot));
                sounds.play('card');
                await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms
                // After dealing player's second card, check for blackjack and play sound
                if (i === 1 && payoutMultiplier === 2.5) {
                    sounds.play('jackpot'); // Play jackpot sound for blackjack immediately
                }
                // Deal to dealer
                setDealerHand(prev => prev.map((slot, idx) => idx === i ? { ...slot, revealed: true } : slot));
                sounds.play('card');
                await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms
            }
        };

        await dealCards();

        setProfit(result.payout);

        // Play the appropriate sound based on the result
        if (payoutMultiplier === 2.5) {
            // Do nothing; jackpot sound already played
        } else if (payoutMultiplier > 0) {
            sounds.play('win');
        } else {
            sounds.play('lose');
        }
    };

    // Helper functions remain the same
    const getHandValue = (hand: GameCard[]): number => {
        return hand.reduce((sum, c) => sum + CARD_VALUES[c.rank], 0);
    };

    const generateBlackjackHand = (): GameCard[] => {
        const aceRank = 12;
        const tenRanks = [8, 9, 10, 11]; // Ranks corresponding to 10-value cards
        const tenCardRank = tenRanks[Math.floor(Math.random() * tenRanks.length)];
        return [createCard(aceRank, randomSuit()), createCard(tenCardRank, randomSuit())];
    };

    const generateRandomHandBelow = (maxTotal: number): GameCard[] => {
        let handValue = maxTotal;
        while (handValue >= maxTotal) {
            const card1 = createCard();
            const card2 = createCard();
            handValue = CARD_VALUES[card1.rank] + CARD_VALUES[card2.rank];
            if (handValue < maxTotal) {
                return [card1, card2];
            }
        }
        return [];
    };

    const generateWinningHand = (): GameCard[] => {
        const totals = [17, 18, 19, 20];
        const targetTotal = totals[Math.floor(Math.random() * totals.length)];
        return generateHandWithTotal(targetTotal);
    };

    const generateLosingHand = (opponentHand?: GameCard[]): GameCard[] => {
        const opponentTotal = opponentHand ? getHandValue(opponentHand) : 20;
        let total = opponentTotal;
        while (total >= opponentTotal) {
            const hand = [createCard(), createCard()];
            total = getHandValue(hand);
            if (total < opponentTotal) {
                return hand;
            }
        }
        return [];
    };

    const generateWinningHandOver = (opponentHand: GameCard[]): GameCard[] => {
        const opponentTotal = getHandValue(opponentHand);
        let total = opponentTotal;
        while (total <= opponentTotal || total > 21) {
            const hand = [createCard(), createCard()];
            total = getHandValue(hand);
            if (total > opponentTotal && total <= 21) {
                return hand;
            }
        }
        return [];
    };

    const generateHandWithTotal = (targetTotal: number): GameCard[] => {
        for (let i = 0; i < 100; i++) {
            const card1 = createCard();
            const card2 = createCard();
            if (CARD_VALUES[card1.rank] + CARD_VALUES[card2.rank] === targetTotal) {
                return [card1, card2];
            }
        }
        return generateRandomHandBelow(targetTotal);
    };

    return (
        <>
            {/* Recent Plays Portal - positioned above stats */}
            <GambaUi.Portal target="recentplays">
                <GameRecentPlaysHorizontal gameId="blackjack" />
            </GambaUi.Portal>

            {/* Stats Portal - positioned above game screen */}
            <GambaUi.Portal target="stats">
                <GameStatsHeader
                    gameName="BlackJack"
                    gameMode="2D"
                    stats={gameStats.stats}
                    onReset={gameStats.resetStats}
                    isMobile={isMobile}
                />
            </GambaUi.Portal>

            <GambaUi.Portal target="screen">
                <GambaUi.Responsive>
                    <Container $disabled={claiming || gamba.isPlaying}>
                        <Table $logo={props.logo || '/png/images/logo.png'}>
                            <TableInner>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    {(() => {
                                        const dealerValue = dealerHand.reduce((sum, s) => (s.revealed && s.card) ? sum + CARD_VALUES[s.card.rank] : sum, 0);
                                        const playerValue = playerHand.reduce((sum, s) => (s.revealed && s.card) ? sum + CARD_VALUES[s.card.rank] : sum, 0);
                                        return (
                                            <>
                                                <h2>{`Dealer's Hand (${dealerValue})`}</h2>
                                                <CardArea>
                                                    <CardsContainer>
                                                        {dealerHand.map((slot, idx) => (
                                                            <CardContainer key={idx}>
                                                                <Card color={slot.revealed && slot.card ? SUIT_COLORS[slot.card.suit] : '#333'} faceDown={!slot.revealed}>
                                                                    {slot.revealed && slot.card ? (
                                                                        <>
                                                                            <div className="suit top-left">{SUIT_SYMBOLS[slot.card.suit]}</div>
                                                                            <div className="suit top-right">{SUIT_SYMBOLS[slot.card.suit]}</div>
                                                                            <div className="rank center">{RANK_SYMBOLS[slot.card.rank]}</div>
                                                                            <div className="suit bottom-left">{SUIT_SYMBOLS[slot.card.suit]}</div>
                                                                            <div className="suit bottom-right">{SUIT_SYMBOLS[slot.card.suit]}</div>
                                                                        </>
                                                                    ) : null}
                                                                </Card>
                                                            </CardContainer>
                                                        ))}
                                                    </CardsContainer>
                                                </CardArea>
                                                <h2>{`Player's Hand (${playerValue})`}</h2>
                                            </>
                                        );
                                    })()}
                                    <CardArea>
                                        <CardsContainer>
                                            {playerHand.map((slot, idx) => (
                                                <CardContainer key={idx}>
                                                    <Card color={slot.revealed && slot.card ? SUIT_COLORS[slot.card.suit] : '#333'} faceDown={!slot.revealed}>
                                                        {slot.revealed && slot.card ? (
                                                            <>
                                                                <div className="suit top-left">{SUIT_SYMBOLS[slot.card.suit]}</div>
                                                                <div className="suit top-right">{SUIT_SYMBOLS[slot.card.suit]}</div>
                                                                <div className="rank center">{RANK_SYMBOLS[slot.card.rank]}</div>
                                                                <div className="suit bottom-left">{SUIT_SYMBOLS[slot.card.suit]}</div>
                                                                <div className="suit bottom-right">{SUIT_SYMBOLS[slot.card.suit]}</div>
                                                            </>
                                                        ) : null}
                                                    </Card>
                                                </CardContainer>
                                            ))}
                                        </CardsContainer>
                                    </CardArea>
                                </div>
                            </TableInner>
                        </Table>
                    </Container>
                </GambaUi.Responsive>

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
                    {...(useGameMeta('blackjack') && {
                        title: useGameMeta('blackjack')!.name,
                        description: useGameMeta('blackjack')!.description
                    })}
                />
            </GambaUi.Portal>
            <GambaUi.Portal target="controls">
                <MobileControls
                    wager={wager}
                    setWager={setWager}
                    onPlay={play}
                    playDisabled={gamba.isPlaying || claiming}
                    playText="Deal Cards"
                />
                <DesktopControls
                    onPlay={play}
                    playDisabled={gamba.isPlaying || claiming}
                    playText="Deal Cards"
                >
                    <EnhancedWagerInput value={wager} onChange={setWager} />
                </DesktopControls>
            </GambaUi.Portal>
        </>
    );
}