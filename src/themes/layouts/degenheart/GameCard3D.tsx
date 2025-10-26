import type { GameBundle } from '../../../games/types';
import type { GameStats } from '../../../hooks/game/useGameStats';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion, AnimatePresence } from 'framer-motion';
import GameInfoModal from './components/GameInfoModal';
import { FEATURED_GAMES } from '../../../games/featuredGames';

interface GameCard3DProps {
    game: GameBundle;
    onClick?: () => void;
    /** When provided as 'played', the card will show played/wins/losses instead of Mode/Graphics/Status */
    statsVariant?: 'default' | 'played';
    playedStats?: { gamesPlayed: number; wins: number; losses: number; };
}

export function GameCard3D({ game, onClick, statsVariant = 'default', playedStats }: GameCard3DProps) {
    const navigate = useNavigate();
    const { publicKey } = useWallet();
    const [isHovered, setIsHovered] = useState(false);
    const [gameInfoOpen, setGameInfoOpen] = useState(false);
    const cardRef = useRef<HTMLDivElement | null>(null);
    const rafRef = useRef<number | null>(null);
    const mousePos = useRef({ x: 0, y: 0 });
    const rotation = useRef({ rx: 0, ry: 0 });
    const isPointerDown = useRef(false);
    const hoverTimeout = useRef<number | null>(null);
    const [hoverActive, setHoverActive] = useState(false);

    // Tunable configuration for 3D effect. Adjust these to change intensity.
    // You can later expose these as props or CSS variables if desired.
    const CONFIG_DEFAULT = {
        baseMaxRotate: 8,      // degrees when hovering normally
        pressedMaxRotate: 14,  // degrees when pointer is down / pressed
        depthZMultiplier: 22,  // px multiplied by data-depth to push forward
        depthXYMultiplier: 10, // px multiplier for X/Y parallax movement
    } as const;

    // Some presets for quick visual comparisons
    const PRESETS = {
        subtle: {
            baseMaxRotate: 4,
            pressedMaxRotate: 7,
            depthZMultiplier: 12,
            depthXYMultiplier: 6,
        },
        moderate: {
            baseMaxRotate: 8,
            pressedMaxRotate: 14,
            depthZMultiplier: 22,
            depthXYMultiplier: 10,
        },
        exaggerated: {
            baseMaxRotate: 14,
            pressedMaxRotate: 22,
            depthZMultiplier: 40,
            depthXYMultiplier: 18,
        }
    } as const;

    const presetKeys = Object.keys(PRESETS) as Array<keyof typeof PRESETS>;
    const presetIndex = useRef(1); // default to moderate
    const CONFIG = useRef({ ...CONFIG_DEFAULT, ...PRESETS[presetKeys[presetIndex.current]] }).current;

    // Dev helper: press 'd' to cycle presets (subtle -> moderate -> exaggerated)
    useEffect(() => {
        const onKey = (ev: KeyboardEvent) => {
            if (ev.key.toLowerCase() !== 'd') return;
            presetIndex.current = (presetIndex.current + 1) % presetKeys.length;
            const key = presetKeys[presetIndex.current];
            // mutate CONFIG ref object fields (CONFIG is const object but we can reassign values)
            (CONFIG as any).baseMaxRotate = PRESETS[key].baseMaxRotate;
            (CONFIG as any).pressedMaxRotate = PRESETS[key].pressedMaxRotate;
            (CONFIG as any).depthZMultiplier = PRESETS[key].depthZMultiplier;
            (CONFIG as any).depthXYMultiplier = PRESETS[key].depthXYMultiplier;
            // flash a small visual indicator by toggling hovered state quickly
            setIsHovered(false);
            setTimeout(() => setIsHovered(true), 30);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    const isFeatured = FEATURED_GAMES.some((fg: any) => fg.id === game.id);
    const gameWithStatus = game as any;
    const isComingSoon = game.creating || gameWithStatus.live === 'coming-soon';

    const handleClick = () => {
        if (!publicKey || isComingSoon) return;
        const wallet = publicKey.toBase58();
        navigate(`/game/${wallet}/${game.id}`);
        if (onClick) onClick();
    };

    // 3D interaction handlers
    const getBounds = () => cardRef.current?.getBoundingClientRect();

    const updateTransform = () => {
        const el = cardRef.current;
        if (!el) return;
        // smoothing
        const { rx, ry } = rotation.current;
        el.style.transform = `perspective(1200px) translateZ(0) rotateX(${rx}deg) rotateY(${ry}deg)`;

        // update child layers with data-depth attribute
        const layers = el.querySelectorAll<HTMLElement>('[data-depth]');
        layers.forEach((layer) => {
            const depth = Number(layer.dataset.depth) || 0;
            // move layers opposite for parallax feel
            const tz = depth * CONFIG.depthZMultiplier; // px forward
            const tx = -mousePos.current.x * depth * CONFIG.depthXYMultiplier;
            const ty = -mousePos.current.y * depth * CONFIG.depthXYMultiplier;
            layer.style.transform = `translate3d(${tx}px, ${ty}px, ${tz}px)`;
        });
        rafRef.current = requestAnimationFrame(updateTransform);
    };

    const handlePointerMove = (clientX: number, clientY: number) => {
        const bounds = getBounds();
        if (!bounds) return;
        const px = (clientX - bounds.left) / bounds.width; // 0 - 1
        const py = (clientY - bounds.top) / bounds.height; // 0 - 1
        // normalized -0.5 -> 0.5
        const nx = px - 0.5;
        const ny = py - 0.5;
        mousePos.current.x = nx;
        mousePos.current.y = ny;

        const maxRotate = isPointerDown.current ? CONFIG.pressedMaxRotate : CONFIG.baseMaxRotate;
        rotation.current.rx = (-ny) * maxRotate;
        rotation.current.ry = (nx) * maxRotate;
    };

    const onPointerMove = (e: React.PointerEvent) => {
        if (!cardRef.current) return;
        (e.target as Element).setPointerCapture?.(e.pointerId);
        handlePointerMove(e.clientX, e.clientY);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        const t = e.touches[0];
        if (!t) return;
        handlePointerMove(t.clientX, t.clientY);
    };

    const onPointerEnter = (e: React.PointerEvent) => {
        setIsHovered(true);
        // Debounce hover start for animation
        if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
        hoverTimeout.current = window.setTimeout(() => setHoverActive(true), 120);
        // start RAF loop
        if (rafRef.current == null) rafRef.current = requestAnimationFrame(updateTransform);
    };

    const onPointerLeave = () => {
        setIsHovered(false);
        setHoverActive(false);
        if (hoverTimeout.current) {
            clearTimeout(hoverTimeout.current);
            hoverTimeout.current = null;
        }
        mousePos.current = { x: 0, y: 0 };
        rotation.current = { rx: 0, ry: 0 };
        // reset transforms smoothly
        const el = cardRef.current;
        if (el) {
            el.style.transition = 'transform 500ms cubic-bezier(0.2,0.8,0.2,1)';
            el.style.transform = `perspective(1200px) translateZ(0) rotateX(0deg) rotateY(0deg)`;
            const layers = el.querySelectorAll<HTMLElement>('[data-depth]');
            layers.forEach((layer) => {
                layer.style.transition = 'transform 500ms cubic-bezier(0.2,0.8,0.2,1)';
                layer.style.transform = '';
            });
            // clear transitions after they finish
            setTimeout(() => {
                if (!el) return;
                el.style.transition = '';
                layers.forEach((layer) => (layer.style.transition = ''));
            }, 520);
        }
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
    };

    useEffect(() => {
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

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
                ref={cardRef}
                onClick={handleClick}
                onPointerMove={onPointerMove}
                onPointerEnter={onPointerEnter}
                onPointerLeave={onPointerLeave}
                onTouchMove={onTouchMove}
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
                    <div data-depth="0.9"
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
                    <div data-depth="0.6"
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(to bottom, rgba(139, 90, 158, 0.6) 0%, rgba(184, 51, 106, 0.8) 100%)',
                            mixBlendMode: 'multiply',
                        }}
                    />

                    {/* Glass Layer */}
                    <div data-depth="0.4"
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
                        <div data-depth="0.2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                            {/* Game Icon & Name */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                                {/* Parallax wrapper — controlled by the RAF parallax system */}
                                <div data-depth="0.8" style={{ perspective: "600px" }}>
                                    {/* Inner wrapper — Framer Motion controls this only */}
                                    <motion.div
                                        key={hoverActive ? "spin" : "still"} // restart animation when hover begins
                                        animate={
                                            hoverActive
                                                ? { rotate: 360, scale: [1, 1.1, 1] }
                                                : { rotate: 0, scale: 1 }
                                        }
                                        transition={{
                                            rotate: {
                                                duration: 1.1,
                                                ease: [0.45, 0, 0.55, 1],
                                            },
                                            scale: {
                                                duration: 0.6,
                                                ease: "easeOut",
                                            },
                                        }}
                                        style={{
                                            width: "64px",
                                            height: "64px",
                                            borderRadius: "16px",
                                            background: "rgba(255,255,255,0.15)",
                                            backdropFilter: "blur(10px)",
                                            overflow: "hidden",
                                            flexShrink: 0,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            cursor: "pointer",
                                            transformOrigin: "center center",
                                            willChange: "transform",
                                        }}
                                    >
                                        <img
                                            src={game.meta.image}
                                            alt={game.meta.name}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                pointerEvents: "none",
                                            }}
                                        />
                                    </motion.div>
                                </div>

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
                        <div data-depth="0.3" style={{ position: 'absolute', right: 16, top: 16, zIndex: 5 }}>
                            <button
                                onClick={handleOpenInfo}
                                className="p-2 rounded-lg bg-white/10 hover:bg-white/20"
                                onMouseDown={(e) => e.stopPropagation()}
                            >
                                ℹ️
                            </button>
                        </div>

                        {/* Real Game Stats */}
                        <div data-depth="0.25" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '12px',
                            marginBottom: '16px',
                            padding: '16px',
                            borderRadius: '12px',
                            background: 'rgba(0, 0, 0, 0.3)',
                            backdropFilter: 'blur(10px)',
                        }}>
                            {statsVariant === 'played' && playedStats ? (
                                <>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>{playedStats.gamesPlayed}</div>
                                        <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>PLAYED</div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>{playedStats.wins}</div>
                                        <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>WINS</div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>{playedStats.losses}</div>
                                        <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>LOSSES</div>
                                    </div>
                                </>
                            ) : (
                                <>
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
                                </>
                            )}
                        </div>

                        {/* Play Button */}
                        <motion.button data-depth="0.15"
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
