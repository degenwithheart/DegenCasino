import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePageSEO } from '../../../hooks/ui/useGameSEO';
import { motion, AnimatePresence } from 'framer-motion';
import { EnhancedTickerTape } from "../../../components";
import { FEATURED_GAMES } from "../../../games/featuredGames";
import { GAMES } from "../../../games";
import { GameCard3D } from "./GameCard3D";
import { useWallet } from "@solana/wallet-adapter-react";
import { useIsCompact } from "../../../hooks/ui/useIsCompact";
import { useColorScheme } from "../../../themes/ColorSchemeContext";
import type { GameBundle } from "../../../games/types";

export function Dashboard() {
    const seoHelmet = usePageSEO(
        "DegenHeart.casino - Solana On-chain Web3 Casino",
        "Welcome to the Casino of Chaos 🔥 No sign-ups, no BS. Just connect and dive in. Non-custodial, provably fair Solana casino with instant payouts."
    );

    const { connected, publicKey } = useWallet();
    const { compact } = useIsCompact();
    const { currentColorScheme } = useColorScheme();
    const navigate = useNavigate();

    const allGamesList: GameBundle[] = GAMES();
    const featuredGames = FEATURED_GAMES;
    const singleplayerGames = allGamesList.filter((g: GameBundle) => g.meta?.tag?.toLowerCase() === 'singleplayer' && g.live !== 'coming-soon');
    const multiplayerGames = allGamesList.filter((g: GameBundle) => g.meta?.tag?.toLowerCase() === 'multiplayer' && g.live !== 'coming-soon');
    const comingSoonGames = allGamesList.filter((g: GameBundle) => g.live === 'coming-soon' || g.creating);

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
                background: `linear-gradient(to bottom right, var(--background), var(--background-secondary), var(--background))`,
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

                        <EnhancedTickerTape />
                    </motion.div>

                    {/* Horizontal Scrollable Game Rows */}
                    <div style={{
                        position: 'relative',
                        zIndex: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '3rem',
                        marginTop: '3rem'
                    }}>
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
                                    paddingBottom: '1rem',
                                    scrollSnapType: 'x mandatory',
                                    WebkitOverflowScrolling: 'touch',
                                    scrollbarWidth: 'thin',
                                    scrollbarColor: 'var(--accent) transparent'
                                }}>
                                    {featuredGames.map((game: GameBundle) => (
                                        <div key={game.id} style={{
                                            minWidth: compact ? '280px' : '320px',
                                            maxWidth: compact ? '280px' : '320px',
                                            width: compact ? '280px' : '320px',
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
                                    paddingBottom: '1rem',
                                    scrollSnapType: 'x mandatory',
                                    WebkitOverflowScrolling: 'touch',
                                    scrollbarWidth: 'thin',
                                    scrollbarColor: 'var(--accent) transparent'
                                }}>
                                    {singleplayerGames.map((game: GameBundle) => (
                                        <div key={game.id} style={{
                                            minWidth: compact ? '280px' : '320px',
                                            maxWidth: compact ? '280px' : '320px',
                                            width: compact ? '280px' : '320px',
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
                                    paddingBottom: '1rem',
                                    scrollSnapType: 'x mandatory',
                                    WebkitOverflowScrolling: 'touch',
                                    scrollbarWidth: 'thin',
                                    scrollbarColor: 'var(--accent) transparent'
                                }}>
                                    {multiplayerGames.map((game: GameBundle) => (
                                        <div key={game.id} style={{
                                            minWidth: compact ? '280px' : '320px',
                                            maxWidth: compact ? '280px' : '320px',
                                            width: compact ? '280px' : '320px',
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
                                    paddingBottom: '1rem',
                                    scrollSnapType: 'x mandatory',
                                    WebkitOverflowScrolling: 'touch',
                                    scrollbarWidth: 'thin',
                                    scrollbarColor: 'var(--accent) transparent'
                                }}>
                                    {comingSoonGames.map((game: GameBundle) => (
                                        <div key={game.id} style={{
                                            minWidth: compact ? '280px' : '320px',
                                            maxWidth: compact ? '280px' : '320px',
                                            width: compact ? '280px' : '320px',
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

                    {/* Connect Wallet CTA - Show when not connected */}
                    {!connected && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            style={{
                                textAlign: 'center',
                                marginTop: '2rem',
                                padding: '2rem',
                                borderRadius: '1.5rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(10px)',
                                WebkitBackdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                position: 'relative',
                                zIndex: 20
                            }}
                        >
                            <h2 style={{
                                fontSize: '2rem',
                                fontWeight: 'bold',
                                background: 'linear-gradient(to right, var(--accent), var(--secondary), var(--gold))',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                marginBottom: '1rem'
                            }}>
                                🎰 Connect to Play
                            </h2>
                            <p style={{
                                fontSize: '1.1rem',
                                color: 'var(--text-secondary)',
                                marginBottom: '1.5rem'
                            }}>
                                Connect your Solana wallet to start playing and winning big!
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '0.75rem',
                                    background: 'linear-gradient(to right, var(--accent), var(--secondary))',
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    fontSize: '1.1rem',
                                    border: 'none',
                                    cursor: 'pointer',
                                    boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span>🔗</span>
                                    <span>Connect Wallet</span>
                                </div>
                            </motion.button>
                        </motion.div>
                    )}

                    {/* Bottom CTA */}
                    {connected && (
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
                                    Ready to Win Big?
                                </h2>
                                <p style={{
                                    fontSize: '1.25rem',
                                    color: 'var(--text-secondary)',
                                    marginBottom: '2rem'
                                }}>
                                    Join thousands of players and experience the future of online gaming
                                </p>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '1.5rem',
                                    flexWrap: 'wrap'
                                }}>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        style={{
                                            padding: '1rem 2rem',
                                            borderRadius: '1rem',
                                            background: 'linear-gradient(to right, var(--accent), var(--secondary))',
                                            color: '#fff',
                                            fontWeight: 'bold',
                                            fontSize: '1.125rem',
                                            border: 'none',
                                            cursor: 'pointer',
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span>🏆</span>
                                            <span>Join Tournament</span>
                                        </div>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        style={{
                                            padding: '1rem 2rem',
                                            borderRadius: '1rem',
                                            background: 'var(--card)',
                                            border: '1px solid var(--border)',
                                            color: 'var(--text-primary)',
                                            fontWeight: 'bold',
                                            fontSize: '1.125rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = 'var(--accent)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = 'var(--border)';
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span>💎</span>
                                            <span>VIP Program</span>
                                        </div>
                                    </motion.button>
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
      `}</style>
        </>
    );
}

export default Dashboard;
