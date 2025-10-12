import type { GameBundle } from '../../../games/types';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion, AnimatePresence } from 'framer-motion';
import GameInfoModal from './components/GameInfoModal';
import { FEATURED_GAMES } from '../../../games/featuredGames';

interface GameCard3DProps {
    game: GameBundle;
    onClick?: () => void;
}

export function GameCard3D({ game, onClick }: GameCard3DProps) {
    const navigate = useNavigate();
    const { publicKey } = useWallet();
    const [isHovered, setIsHovered] = useState(false);
    const [gameInfoOpen, setGameInfoOpen] = useState(false);

    const isFeatured = FEATURED_GAMES.some((fg: any) => fg.id === game.id);
    const gameWithStatus = game as any;
    const isComingSoon = game.creating || gameWithStatus.live === 'coming-soon';

    const handleClick = () => {
        if (!publicKey || isComingSoon) return;
        const wallet = publicKey.toBase58();
        navigate(`/game/${wallet}/${game.id}`);
        if (onClick) onClick();
    };

    const handleOpenInfo = (e: React.MouseEvent) => {
        e.stopPropagation();
        setGameInfoOpen(true);
    };

    const handleCloseInfo = () => setGameInfoOpen(false);

    const handlePlayFromModal = (g: any) => {
        if (!publicKey || isComingSoon) return;
        const wallet = publicKey.toBase58();
        navigate(`/game/${wallet}/${g.id}`);
    };

    return (
        <>
            <motion.div
                className="game-card-3d"
                initial={{ opacity: 0, scale: 0.9, rotateX: -20 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotateX: 20 }}
                whileHover={{
                    y: 0,
                    scale: 1,
                    rotateX: 3,
                    rotateY: 2,
                }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                }}
                onClick={handleClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    position: 'relative',
                    width: '100%',
                    height: 'var(--gamecard-height)',
                    cursor: publicKey && !isComingSoon ? 'pointer' : 'not-allowed',
                    perspective: '1200px',
                    transformStyle: 'preserve-3d',
                }}
            >
                {/* Main Card Container */}
                <div
                    style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        background: 'linear-gradient(135deg, rgba(139, 90, 158, 0.3) 0%, rgba(184, 51, 106, 0.3) 100%)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: isHovered
                            ? '0 18px 34px -8px rgba(0, 0, 0, 0.55), 0 0 28px rgba(139, 90, 158, 0.25)'
                            : '0 8px 18px -6px rgba(0, 0, 0, 0.4)',
                        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                        transformStyle: 'preserve-3d'
                    }}
                >
                    {/* Background Image */}
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundImage: `url(${game.meta.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            filter: 'brightness(0.3) blur(2px)',
                            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                            transition: 'transform 0.6s ease',
                        }}
                    />

                    {/* Gradient Overlay */}
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(to bottom, rgba(139, 90, 158, 0.6) 0%, rgba(184, 51, 106, 0.8) 100%)',
                            mixBlendMode: 'multiply',
                        }}
                    />

                    {/* Glass Layer */}
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(255, 255, 255, 0.03)',
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                        }}
                    />

                    {/* Content */}
                    <div
                        style={{
                            position: 'relative',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            padding: 'var(--gamecard-padding)',
                            paddingBottom: 'calc(var(--gamecard-padding) / 1.25)',
                            color: '#fff',
                            zIndex: 1,
                        }}
                    >
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                            {/* Game Icon & Name */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                                <motion.div
                                    animate={isHovered ? {
                                        rotate: [0, 360],
                                        scale: [1, 1.15, 1]
                                    } : {}}
                                    transition={{ duration: 0.8 }}
                                    style={{
                                        width: '64px',
                                        height: '64px',
                                        borderRadius: '16px',
                                        background: 'rgba(255, 255, 255, 0.15)',
                                        backdropFilter: 'blur(10px)',
                                        overflow: 'hidden',
                                        flexShrink: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <img
                                        src={game.meta.image}
                                        alt={game.meta.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                </motion.div>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h3 style={{
                                        fontSize: '24px',
                                        fontWeight: '700',
                                        margin: 0,
                                        marginBottom: '4px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
                                    }}>
                                        {game.meta.name}
                                    </h3>
                                </div>
                            </div>
                        </div>

                        {/* Info button (top-right) */}
                        <div style={{ position: 'absolute', right: 16, top: 16, zIndex: 5 }}>
                            <button
                                onClick={handleOpenInfo}
                                className="p-2 rounded-lg bg-white/10 hover:bg-white/20"
                                onMouseDown={(e) => e.stopPropagation()}
                            >
                                ℹ️
                            </button>
                        </div>

                        {/* Real Game Stats */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '12px',
                            marginBottom: '16px',
                            padding: '16px',
                            borderRadius: '12px',
                            background: 'rgba(0, 0, 0, 0.3)',
                            backdropFilter: 'blur(10px)',
                        }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>
                                    {(game as any).meta?.tag || 'Solo'}
                                </div>
                                <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Mode
                                </div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>
                                    {(game as any).capabilities?.supports2D && (game as any).capabilities?.supports3D
                                        ? '2D/3D'
                                        : (game as any).capabilities?.supports3D
                                            ? '3D'
                                            : '2D'}
                                </div>
                                <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Graphics
                                </div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>
                                    {gameWithStatus.live === 'online' ? '🟢' : gameWithStatus.live === 'coming-soon' ? '🟡' : '🔴'}
                                </div>
                                <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Status
                                </div>
                            </div>
                        </div>

                        {/* Play Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={!publicKey || isComingSoon}
                            style={{
                                width: '100%',
                                padding: '16px',
                                borderRadius: '16px',
                                border: 'none',
                                background: isComingSoon
                                    ? 'rgba(107, 114, 128, 0.5)'
                                    : 'linear-gradient(135deg, rgba(212, 165, 116, 0.9) 0%, rgba(184, 51, 106, 0.9) 100%)',
                                color: '#fff',
                                fontSize: '16px',
                                fontWeight: '700',
                                cursor: publicKey && !isComingSoon ? 'pointer' : 'not-allowed',
                                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                                backdropFilter: 'blur(10px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                opacity: isComingSoon ? 0.5 : 1,
                            }}
                        >
                            {isComingSoon ? (
                                <>Coming Soon</>
                            ) : (
                                <>
                                    <span>▶️</span>
                                    <span>Play Now</span>
                                    <span>⭐</span>
                                </>
                            )}
                        </motion.button>
                    </div>

                    {/* Particle Effects on Hover */}
                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    pointerEvents: 'none',
                                }}
                            >
                                {[...Array(6)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        style={{
                                            position: 'absolute',
                                            left: '50%',
                                            top: '50%',
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            background: 'rgba(212, 165, 116, 0.8)',
                                            boxShadow: '0 0 10px rgba(212, 165, 116, 0.8)',
                                        }}
                                        animate={{
                                            x: [0, Math.cos(i * 60 * Math.PI / 180) * 100],
                                            y: [0, Math.sin(i * 60 * Math.PI / 180) * 100],
                                            opacity: [0, 1, 0],
                                            scale: [0, 1.5, 0],
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            delay: i * 0.1,
                                        }}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Glow Effect */}
                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    position: 'absolute',
                                    inset: '-12px',
                                    background: 'radial-gradient(circle at center, rgba(139, 90, 158, 0.4), transparent 70%)',
                                    borderRadius: '24px',
                                    filter: 'blur(20px)',
                                    zIndex: -1,
                                }}
                            />
                        )}
                    </AnimatePresence>
                </div>

                {/* Inline CSS for description scrollbar and mobile hiding */}
                <style>{`
                .game-description::-webkit-scrollbar {
                    width: 6px;
                }
                
                .game-description::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                
                .game-description::-webkit-scrollbar-thumb {
                    background: rgba(212, 165, 116, 0.5);
                    border-radius: 10px;
                }
                
                .game-description::-webkit-scrollbar-thumb:hover {
                    background: rgba(212, 165, 116, 0.7);
                }
                
                @media (max-width: 768px) {
                    .game-description {
                        display: none !important;
                    }
                }
            `}</style>
            </motion.div>
            <AnimatePresence>
                <GameInfoModal
                    game={game}
                    isOpen={gameInfoOpen}
                    onClose={handleCloseInfo}
                    onPlay={handlePlayFromModal}
                />
            </AnimatePresence>
            {/* Responsive variables for GameCard3D (scoped) */}
            <style>{`
                /* Default (desktop) smaller to avoid large gap */
                .game-card-3d { --gamecard-height: 300px; --gamecard-padding: 18px; }

                /* Mobile: keep original compact size */
                @media (max-width: 640px) {
                    .game-card-3d { --gamecard-height: 260px; --gamecard-padding: 12px; }
                }

                /* Slightly nudge the scrollbar up by adjusting track when present */
                .games-carousel::-webkit-scrollbar { height: 8px; }
                .games-carousel::-webkit-scrollbar-track { background: transparent; }
                .games-carousel::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 6px; }
            `}</style>
        </>
    );
}
