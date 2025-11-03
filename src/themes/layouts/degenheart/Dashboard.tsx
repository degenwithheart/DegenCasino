import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePageSEO } from '../../../hooks/ui/useGameSEO';
import { motion, AnimatePresence } from 'framer-motion';
import { EnhancedTickerTape } from "../../../components";
import { FEATURED_GAMES } from "../../../games/featuredGames";
import { GAMES } from "../../../games";
import { GameCard3D } from "./GameCard3D";
import PlayAgainRow from './components/PlayAgainRow';
import { useWallet } from "@solana/wallet-adapter-react";
import { useHandleWalletConnect } from '../../../sections/walletConnect';
import { useIsCompact } from "../../../hooks/ui/useIsCompact";
import { useCurrentPool, TokenValue } from 'gamba-react-ui-v2';
import { useColorScheme } from "../../../themes/ColorSchemeContext";
import { FEATURE_FLAGS } from '../../../constants';
import { InteractiveHeroCard } from './components/InteractiveHeroCard';
import { useUserStore } from '../../../hooks/data/useUserStore';
import type { GameBundle } from '../../../games/types';

export function Dashboard() {
    const seoHelmet = usePageSEO(
        "DegenHeart.casino - Solana On-chain Web3 Casino",
        "Welcome to the Casino of Chaos 🔥 No sign-ups, no BS. Just connect and dive in. Non-custodial, provably fair Solana casino with instant payouts."
    );

    const { connected, publicKey } = useWallet();
    const pool = useCurrentPool();
    const handleWalletConnect = useHandleWalletConnect();
    const { compact } = useIsCompact();
    const { currentColorScheme } = useColorScheme();
    const navigate = useNavigate();

    const allGamesList: GameBundle[] = GAMES();
    const featuredGames = FEATURED_GAMES;
    const singleplayerGames = allGamesList.filter((g: GameBundle) => g.meta?.tag?.toLowerCase() === 'singleplayer' && g.live !== 'coming-soon');
    const multiplayerGames = allGamesList.filter((g: GameBundle) => g.meta?.tag?.toLowerCase() === 'multiplayer' && g.live !== 'coming-soon');
    const comingSoonGames = allGamesList.filter((g: GameBundle) => g.live === 'coming-soon' || g.creating);

    // Played games for "Play Again" stories
    const { gamesPlayed } = useUserStore();
    const playedGames = gamesPlayed
        .map((gameId: string) => allGamesList.find(g => g.id === gameId))
        .filter(Boolean)
        .slice(0, 8) as GameBundle[];

    const heroCards = [
        {
            id: 'ownership',
            title: 'True Ownership',
            leftLabel: 'DegenHeart Way',
            left: ['Non-Custodial, funds stay in your wallet, always.'],
            rightLabel: 'Web2 Way',
            right: ['Custodial, they hold your funds hostage.'],
            footer: "Your wallet = your money. No middlemen, no excuses."
        },
        {
            id: 'transparency',
            title: 'On-Chain Transparency',
            leftLabel: 'DegenHeart Way',
            left: ['100% On-Chain Logic, verifiable bets & RNG via Solana + Gamba.'],
            rightLabel: 'Casino Way',
            right: ['Private Backend RNG, hidden logic you can\'t audit.'],
            footer: 'Blockchain cuts out the smoke and mirrors, verify everything yourself.'
        },
        {
            id: 'accountless',
            title: 'Accountless Access',
            leftLabel: 'DegenHeart Way',
            left: ['No Accounts, No KYC Ever, connect wallet and play.'],
            rightLabel: 'Traditional Way',
            right: ['Email signups & surprise KYC when you win big.'],
            footer: 'Freedom means no papers, no profiles, no prying eyes.'
        },
        {
            id: 'instant',
            title: 'Instant Withdrawals',
            leftLabel: 'DegenHeart Way',
            left: ['Smart Contracts, instant payouts to your wallet on Solana.'],
            rightLabel: 'Web2 Way',
            right: ['Manual Withdrawals, days of delays and arbitrary holds.'],
            footer: "Smart contracts pay out faster than you can blink."
        },
        {
            id: 'ethos',
            title: 'Blockchain Ethos',
            leftLabel: 'DegenHeart Way',
            left: ['Pure Web3, decentralization, no accounts, no custodians.'],
            rightLabel: 'Casino Way',
            right: ['Web2.5 Hybrids, blockchain marketing with centralized control.'],
            footer: "Real Web3 isn't a gimmick—it's total user sovereignty."
        }
    ];

    return (
        <>
            {seoHelmet}
            <style>{`
                :root {
                    --background: ${currentColorScheme.colors.background};
                    --background-secondary: ${currentColorScheme.colors.surface};
                    --accent: ${currentColorScheme.colors.accent};
                    --secondary: ${currentColorScheme.colors.secondary};
                    --gold: ${currentColorScheme.colors.primary};
                    --text: ${currentColorScheme.colors.text};
                    --text-secondary: ${currentColorScheme.colors.textSecondary};
                    --accent-glow: ${currentColorScheme.effects?.glow || 'none'};
                    --secondary-glow: ${currentColorScheme.effects?.glow?.replace(/rgba?\([^)]+\)/g, 'rgba(255, 215, 0, 0.3)') || 'none'};
                    --gold-glow: ${currentColorScheme.effects?.glow?.replace(/rgba?\([^)]+\)/g, 'rgba(162, 89, 255, 0.2)') || 'none'};
                }
            `}</style>
            <div className="min-h-screen p-6 pt-24" style={{
                position: 'relative'
            }}>
                {/* Animated Background */}
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    overflow: 'hidden',
                    pointerEvents: 'none',
                    zIndex: 0
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '5rem',
                        right: '5rem',
                        width: '24rem',
                        height: '24rem',
                        background: 'var(--accent-glow)',
                        borderRadius: '50%',
                        filter: 'blur(100px)',
                        opacity: 0.1,
                        animation: 'float 6s ease-in-out infinite'
                    }} />
                    <div style={{
                        position: 'absolute',
                        bottom: '5rem',
                        left: '5rem',
                        width: '24rem',
                        height: '24rem',
                        background: 'var(--secondary-glow)',
                        borderRadius: '50%',
                        filter: 'blur(100px)',
                        opacity: 0.1,
                        animation: 'float 6s ease-in-out infinite',
                        animationDelay: '2s'
                    }} />
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '38rem',
                        height: '38rem',
                        background: 'var(--gold-glow)',
                        borderRadius: '50%',
                        filter: 'blur(120px)',
                        opacity: 0.05,
                        transform: 'translate(-50%, -50%)',
                        animation: 'pulse 8s ease-in-out infinite'
                    }} />
                </div>

                <div style={{ position: 'relative', maxWidth: '90rem', margin: '0 auto', zIndex: 10 }}>
                    {/* Header */}
                    {connected && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ textAlign: 'center', marginBottom: '3rem' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                <motion.div
                                    animate={{ rotate: [0, 360] }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    style={{ marginRight: '1rem', fontSize: '4rem' }}
                                >
                                    ✨
                                </motion.div>
                                <h1 style={{
                                    fontSize: compact ? '3rem' : '4.5rem',
                                    fontWeight: 900,
                                    background: 'linear-gradient(to right, var(--accent), var(--secondary), var(--gold))',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                }}>
                                    GAME UNIVERSE
                                </h1>
                                <motion.div
                                    animate={{ rotate: [360, 0] }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    style={{ marginLeft: '1rem', fontSize: '4rem' }}
                                >
                                    👑
                                </motion.div>
                            </div>

                            <p style={{
                                fontSize: compact ? '1rem' : '1.5rem',
                                color: 'var(--text-secondary)',
                                maxWidth: '64rem',
                                margin: '0 auto 2rem'
                            }}>
                                Enter a world of next-generation gaming with stunning 3D graphics,
                                provably fair mechanics, and life-changing jackpots
                            </p>

                            {connected && <EnhancedTickerTape />}
                        </motion.div>

                    )}

                    {/* Horizontal Scrollable Game Rows (show only when wallet connected) */}
                    {connected && (
                        <div style={{
                            position: 'relative',
                            zIndex: 10,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '3rem',
                            marginTop: '3rem'
                        }}>
                            <PlayAgainRow />
                            {/* Featured Games Row */}
                            {featuredGames.length > 0 && (
                                <div>
                                    <h2 style={{
                                        fontSize: compact ? '1.5rem' : '2rem',
                                        fontWeight: 'bold',
                                        marginBottom: '1.5rem',
                                        color: 'var(--text)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        🌟 Featured
                                    </h2>
                                    <div style={{
                                        display: 'flex',
                                        gap: '1.5rem',
                                        overflowX: 'auto',
                                        overflowY: 'hidden',
                                        padding: '1rem',
                                        scrollSnapType: 'x mandatory',
                                        WebkitOverflowScrolling: 'touch',
                                        scrollbarWidth: 'thin',
                                        scrollbarColor: 'var(--accent) transparent'
                                    }}>
                                        {featuredGames.map((game: GameBundle) => (
                                            <div key={game.id} style={{
                                                minWidth: FEATURE_FLAGS.ENABLE_LIVE_GAME_ECOSYSTEMS ? '150px' : (compact ? '280px' : '320px'),
                                                maxWidth: FEATURE_FLAGS.ENABLE_LIVE_GAME_ECOSYSTEMS ? '150px' : (compact ? '280px' : '320px'),
                                                width: FEATURE_FLAGS.ENABLE_LIVE_GAME_ECOSYSTEMS ? '150px' : (compact ? '280px' : '320px'),
                                                flexShrink: 0,
                                                scrollSnapAlign: 'start'
                                            }}>
                                                <GameCard3D game={game} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Singleplayer Games Row */}
                            {singleplayerGames.length > 0 && (
                                <div>
                                    <h2 style={{
                                        fontSize: compact ? '1.5rem' : '2rem',
                                        fontWeight: 'bold',
                                        marginBottom: '1.5rem',
                                        color: 'var(--text)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        🎯 Singleplayer
                                    </h2>
                                    <div style={{
                                        display: 'flex',
                                        gap: '1.5rem',
                                        overflowX: 'auto',
                                        overflowY: 'hidden',
                                        padding: '1rem',
                                        scrollSnapType: 'x mandatory',
                                        WebkitOverflowScrolling: 'touch',
                                        scrollbarWidth: 'thin',
                                        scrollbarColor: 'var(--accent) transparent'
                                    }}>
                                        {singleplayerGames.map((game: GameBundle) => (
                                            <div key={game.id} style={{
                                                minWidth: FEATURE_FLAGS.ENABLE_LIVE_GAME_ECOSYSTEMS ? '150px' : (compact ? '280px' : '320px'),
                                                maxWidth: FEATURE_FLAGS.ENABLE_LIVE_GAME_ECOSYSTEMS ? '150px' : (compact ? '280px' : '320px'),
                                                width: FEATURE_FLAGS.ENABLE_LIVE_GAME_ECOSYSTEMS ? '150px' : (compact ? '280px' : '320px'),
                                                flexShrink: 0,
                                                scrollSnapAlign: 'start'
                                            }}>
                                                <GameCard3D game={game} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Multiplayer Games Row */}
                            {multiplayerGames.length > 0 && (
                                <div>
                                    <h2 style={{
                                        fontSize: compact ? '1.5rem' : '2rem',
                                        fontWeight: 'bold',
                                        marginBottom: '1.5rem',
                                        color: 'var(--text)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        🎲 Multiplayer
                                    </h2>
                                    <div style={{
                                        display: 'flex',
                                        gap: '1.5rem',
                                        overflowX: 'auto',
                                        overflowY: 'hidden',
                                        padding: '1rem',
                                        scrollSnapType: 'x mandatory',
                                        WebkitOverflowScrolling: 'touch',
                                        scrollbarWidth: 'thin',
                                        scrollbarColor: 'var(--accent) transparent'
                                    }}>
                                        {multiplayerGames.map((game: GameBundle) => (
                                            <div key={game.id} style={{
                                                minWidth: FEATURE_FLAGS.ENABLE_LIVE_GAME_ECOSYSTEMS ? '150px' : (compact ? '280px' : '320px'),
                                                maxWidth: FEATURE_FLAGS.ENABLE_LIVE_GAME_ECOSYSTEMS ? '150px' : (compact ? '280px' : '320px'),
                                                width: FEATURE_FLAGS.ENABLE_LIVE_GAME_ECOSYSTEMS ? '150px' : (compact ? '280px' : '320px'),
                                                flexShrink: 0,
                                                scrollSnapAlign: 'start'
                                            }}>
                                                <GameCard3D game={game} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Coming Soon Games Row */}
                            {comingSoonGames.length > 0 && (
                                <div>
                                    <h2 style={{
                                        fontSize: compact ? '1.5rem' : '2rem',
                                        fontWeight: 'bold',
                                        marginBottom: '1.5rem',
                                        color: 'var(--text)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        🎁 New Games
                                    </h2>
                                    <div style={{
                                        display: 'flex',
                                        gap: '1.5rem',
                                        overflowX: 'auto',
                                        overflowY: 'hidden',
                                        padding: '1rem',
                                        scrollSnapType: 'x mandatory',
                                        WebkitOverflowScrolling: 'touch',
                                        scrollbarWidth: 'thin',
                                        scrollbarColor: 'var(--accent) transparent'
                                    }}>
                                        {comingSoonGames.map((game: GameBundle) => (
                                            <div key={game.id} style={{
                                                minWidth: FEATURE_FLAGS.ENABLE_LIVE_GAME_ECOSYSTEMS ? '150px' : (compact ? '280px' : '320px'),
                                                maxWidth: FEATURE_FLAGS.ENABLE_LIVE_GAME_ECOSYSTEMS ? '150px' : (compact ? '280px' : '320px'),
                                                width: FEATURE_FLAGS.ENABLE_LIVE_GAME_ECOSYSTEMS ? '150px' : (compact ? '280px' : '320px'),
                                                flexShrink: 0,
                                                scrollSnapAlign: 'start'
                                            }}>
                                                <GameCard3D game={game} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Removed separate Connect-to-Play CTA (now handled via bottom CTA connect button) */}

                    {/* Bottom CTA */}
                    {!connected && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            style={{ textAlign: 'center', marginTop: '4rem' }}
                        >
                            <div style={{
                                padding: '2rem',
                                borderRadius: '1.5rem',
                                maxWidth: '64rem',
                                margin: '0 auto',
                                background: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(10px)',
                                WebkitBackdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}>
                                <h2 style={{
                                    fontSize: '2.5rem',
                                    fontWeight: 'bold',
                                    background: 'linear-gradient(to right, var(--accent), var(--secondary), var(--gold))',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    marginBottom: '1rem'
                                }}>
                                    Ready to Win? Do It the Web3 Way.
                                </h2>
                                <p style={{
                                    fontSize: '1.25rem',
                                    color: 'var(--text-secondary)',
                                    marginBottom: '2rem'
                                }}>
                                    Instant payouts. No accounts. 100% on-chain games.
                                </p>

                                {/* Show current jackpot when disconnected */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                                    <span style={{ fontSize: '1.6rem' }}>🏆</span>
                                    <div style={{ fontWeight: 700, fontSize: '1.125rem' }}>
                                        Current jackpot: {pool?.jackpotBalance ? <TokenValue amount={pool.jackpotBalance} /> : '—'}
                                    </div>
                                </div>

                                {/* Hero card scroller - Interactive or Traditional */}
                                <div className="hero-scroller" role="list" aria-label="Why DegenHeart">
                                    {heroCards.map(card => (
                                        <div key={card.id} role="listitem">
                                            {FEATURE_FLAGS.ENABLE_INTERACTIVE_HERO_CARDS ? (
                                                <InteractiveHeroCard
                                                    card={card}
                                                    onComplete={(choice) => {
                                                        console.log(`User chose ${choice} path for ${card.title}`);
                                                    }}
                                                />
                                            ) : (
                                                <article className="hero-card" tabIndex={0}>
                                                    <div className="hero-card-inner">
                                                        <div className="hero-card-header">
                                                            <strong>{card.title}</strong>
                                                        </div>

                                                        {/* Top: Your Casino bullets */}
                                                        <div className="hero-top">
                                                            {card.left.map((t, i) => (
                                                                <div key={i} className="hero-bullet"><span className="icon">{card.leftLabel}</span><span className="text">{t}</span></div>
                                                            ))}
                                                        </div>

                                                        {/* Middle: Traditional contrast */}
                                                        <div className="hero-middle">
                                                            {card.right.map((t, i) => (
                                                                <div key={i} className="hero-contrast"><span className="icon">{card.rightLabel}</span><span className="text">{t}</span></div>
                                                            ))}
                                                        </div>

                                                        {/* Bottom: why it matters */}
                                                        <div className="hero-card-footer">{card.footer}</div>
                                                    </div>
                                                </article>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.1; }
        }
        
        /* Custom Scrollbar for horizontal rows */
        div[style*="overflowX: auto"]::-webkit-scrollbar {
          height: 8px;
        }
        
        div[style*="overflowX: auto"]::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        
        div[style*="overflowX: auto"]::-webkit-scrollbar-thumb {
          background: linear-gradient(to right, var(--accent), var(--secondary));
          border-radius: 10px;
        }
        
        div[style*="overflowX: auto"]::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to right, var(--secondary), var(--accent));
        }
        
        /* Mobile touch optimization */
        @media (max-width: 768px) {
          div[style*="overflowX: auto"] {
            -webkit-overflow-scrolling: touch;
            scroll-behavior: smooth;
          }
        }
                /* Hero card scroller styles */
                .hero-scroller {
                    margin-top: 2rem;
                    display: flex;
                    gap: 1.5rem;
                    overflow-x: auto;
                    padding: 1rem;
                    scroll-snap-type: x mandatory;
                    -webkit-overflow-scrolling: touch;
                    scrollbar-width: thin;
                    scrollbar-color: var(--accent) transparent;
                }

                .hero-scroller::-webkit-scrollbar {
                    height: 6px;
                }

                .hero-scroller::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }

                .hero-scroller::-webkit-scrollbar-thumb {
                    background: linear-gradient(to right, var(--accent), var(--secondary));
                    border-radius: 10px;
                }

                .hero-scroller::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to right, var(--secondary), var(--accent));
                }

                .hero-scroller:focus {
                    outline: none;
                }

                /* Interactive hero card styles */
                .interactive-hero-card {
                    scroll-snap-align: start;
                    flex: 0 0 auto;
                    width: 250px;
                    height: 250px;
                    flex-shrink: 0;
                }

                .hero-card {
                    scroll-snap-align: start;
                    flex: 0 0 auto;
                    min-width: 340px;
                    max-width: 420px;
                    background: linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02));
                    border-radius: 24px;
                    padding: 1.75rem;
                    box-shadow: 0 16px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1);
                    transform: perspective(1200px) rotateY(-8deg) translateZ(0);
                    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.4s ease;
                    border: 2px solid transparent;
                    background-clip: padding-box;
                    position: relative;
                }

                .hero-card::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    padding: 2px;
                    background: linear-gradient(135deg, var(--gold), var(--accent), var(--secondary));
                    border-radius: inherit;
                    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    mask-composite: exclude;
                    -webkit-mask-composite: xor;
                }

                .hero-card:focus,
                .hero-card:hover {
                    transform: perspective(1200px) rotateY(0deg) translateY(-12px) translateZ(30px) scale(1.05);
                    box-shadow: 0 24px 56px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15);
                }

                .hero-card-inner { 
                    display: flex; 
                    flex-direction: column; 
                    gap: 1.5rem; 
                    position: relative;
                    z-index: 1;
                }
                .hero-card-header { 
                    font-size: 1.4rem; 
                    font-weight: 900; 
                    letter-spacing: -0.03em;
                    color: var(--text);
                    text-align: center;
                    margin-bottom: 0.5rem;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                }

                /* stacked sections */
                .hero-top, .hero-middle { 
                    display: flex; 
                    flex-direction: column; 
                    gap: 1rem; 
                }
                .hero-bullet, .hero-contrast { 
                    display: flex; 
                    align-items: flex-start; 
                    gap: 1rem; 
                    padding: 0.75rem;
                    border-radius: 12px;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.05);
                }
                .hero-bullet { 
                    background: linear-gradient(135deg, rgba(74, 222, 128, 0.1), rgba(34, 197, 94, 0.05));
                    border-left: 4px solid #4ade80;
                }
                .hero-contrast { 
                    background: linear-gradient(135deg, rgba(248, 113, 113, 0.1), rgba(239, 68, 68, 0.05));
                    border-left: 4px solid #f87171;
                }
                .hero-bullet .icon { 
                    font-size: 0.95rem; 
                    font-weight: 700;
                    color: #4ade80;
                    min-width: 120px;
                    text-align: right;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.5);
                }
                .hero-contrast .icon { 
                    font-size: 0.95rem; 
                    font-weight: 700;
                    color: #f87171;
                    min-width: 120px;
                    text-align: right;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.5);
                }
                .hero-bullet .text { 
                    font-weight: 600; 
                    color: var(--text); 
                    flex: 1;
                    line-height: 1.4;
                }
                .hero-contrast .text { 
                    font-weight: 600; 
                    color: var(--text); 
                    flex: 1;
                    line-height: 1.4;
                }

                .hero-card-footer { 
                    margin-top: 1.25rem; 
                    font-size: 0.95rem; 
                    color: var(--text-secondary); 
                    opacity: 0.9;
                    text-align: center;
                    font-style: italic;
                    padding: 0.5rem;
                    background: rgba(255,255,255,0.02);
                    border-radius: 8px;
                    border: 1px solid rgba(255,255,255,0.03);
                }

                @media (max-width: 768px) {
                    .hero-scroller {
                        gap: 1rem;
                        padding: 0.75rem 0.5rem;
                    }
                    .interactive-hero-card {
                        width: 220px;
                        height: 220px;
                    }
                    .hero-card { 
                        min-width: 300px; 
                        max-width: 380px; 
                        padding: 1.5rem;
                        transform: perspective(1000px) rotateY(-4deg) translateZ(0);
                    }
                    .hero-card:focus,
                    .hero-card:hover {
                        transform: perspective(1000px) rotateY(0deg) translateY(-8px) translateZ(20px) scale(1.03);
                    }
                    .hero-card-header { font-size: 1.2rem; }
                    .hero-bullet .icon, .hero-contrast .icon { min-width: 100px; font-size: 0.85rem; }
                }

                @media (max-width: 480px) {
                    .hero-scroller {
                        flex-direction: column;
                        gap: 1rem;
                        overflow-x: visible;
                        padding: 1rem;
                    }
                    .interactive-hero-card {
                        width: 100%;
                        height: 200px;
                        margin-bottom: 1rem;
                    }
                    .hero-card { 
                        min-width: auto; 
                        max-width: none;
                        width: 100%;
                        transform: none;
                        margin-bottom: 1rem;
                    }
                    .hero-card:focus,
                    .hero-card:hover {
                        transform: translateY(-6px) scale(1.02);
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .hero-card, .hero-card:focus, .hero-card:hover { 
                        transition: none; 
                        transform: none; 
                    }
                }
      `}</style>
        </>
    );
}

export default Dashboard;
