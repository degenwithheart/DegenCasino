import { PEG_RADIUS, PLINKO_RAIUS, Plinko as PlinkoGame, PlinkoProps, barrierHeight, barrierWidth, bucketHeight } from './game';
import { GambaUi, useSound, useWagerInput } from 'gamba-react-ui-v2';
import { useGamba } from 'gamba-react-v2';
import React, { useState, useEffect } from 'react';
import { EnhancedWagerInput, MobileControls, DesktopControls, GameRecentPlaysHorizontal } from '../../components';
import GameScreenFrame, { useGraphics } from '../../components/Game/GameScreenFrame';
import { GameStatsHeader } from '../../components/Game/GameStatsHeader';
import { useGameStats } from '../../hooks/game/useGameStats';
import { useIsCompact } from '../../hooks/ui/useIsCompact';
import { StyledPlinkoBackground } from './PlinkoBackground.enhanced.styles';
import { BucketScoreboard } from './BucketScoreboard';
import { useUserStore } from '../../hooks/data/useUserStore';
import BUMP from './bump.mp3';
import FALL from './fall.mp3';
import WIN from './win.mp3';

function usePlinko(props: PlinkoProps, deps: React.DependencyList) {
  const [plinko, set] = React.useState<PlinkoGame>(null!);

  React.useEffect(
    () => {
      const p = new PlinkoGame(props);
      set(p);
      return () => p.cleanup();
    },
    deps,
  );

  return plinko;
}

const DEGEN_BET = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 10, 10, 10, 15];
const BET = [.5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 3, 3, 3, 3, 3, 3, 3, 6];

export default function Plinko() {
  const game = GambaUi.useGame();
  const gamba = useGamba();
  const [wager, setWager] = useWagerInput();
  const debug = false;
  const [degen, setDegen] = React.useState(false);
  const deferAudio = useUserStore(s => !!s.deferAudio);
  const [audioLoaded, setAudioLoaded] = React.useState(!deferAudio);

  // Use GambaUi.useSound to mirror PlinkoRace pattern
  const { play, sounds } = GambaUi.useSound(audioLoaded ? {
    bump: BUMP,
    win: WIN,
    fall: FALL,
  } : {});

  // Keep a ref to the latest play and sounds for callbacks
  const soundsRef = React.useRef({ play, sounds });
  React.useEffect(() => {
    soundsRef.current = { play, sounds };
  }, [play, sounds]);

  // Helper to safely play sounds (checks ready state before playing)
  const safeSoundPlay = React.useCallback((name: 'bump' | 'win' | 'fall', opts?: any) => {
    try {
      const cur = soundsRef.current;
      const s = cur.sounds?.[name];
      if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
        console.debug(`Plinko: attempt play -> ${name}`, { hasSounds: !!cur.sounds, soundReady: !!s?.ready, hasPlayFn: typeof cur.play === 'function' });
      }
      if (!cur.sounds) {
        if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') console.debug('Plinko: sounds object missing, aborting play');
        return;
      }
      if (!s?.ready) {
        if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') console.debug(`Plinko: sound not ready -> ${name}`);
        return;
      }
      if (typeof cur.play === 'function') {
        cur.play(name, opts);
      } else {
        if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') console.debug('Plinko: play function missing on sounds controller');
      }
    } catch (e) {
      if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
        console.debug('Plinko: Audio play error:', e);
      }
    }
  }, []);

  // Log audioLoaded transitions for debugging
  useEffect(() => {
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.debug('Plinko: audioLoaded ->', audioLoaded, 'deferAudio ->', deferAudio);
    }
  }, [audioLoaded, deferAudio]);

  // Load audio on first interaction if deferred
  useEffect(() => {
    if (deferAudio && !audioLoaded) {
      const loadAudio = () => {
        setAudioLoaded(true);
      };
      window.addEventListener('click', loadAudio, { once: true });
      window.addEventListener('keydown', loadAudio, { once: true });
      return () => {
        window.removeEventListener('click', loadAudio);
        window.removeEventListener('keydown', loadAudio);
      };
    }
  }, [deferAudio, audioLoaded]);

  // Debug: log sound readiness in development to help diagnose silent audio
  useEffect(() => {
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
      try {
        if (!sounds) {
          console.debug('Plinko: sounds not initialized yet');
          return;
        }
        Object.keys(sounds).forEach((k) => {
          const s = (sounds as any)[k];
          if (s?.ready) console.debug(`Plinko: sound ready -> ${k}`);
          else {
            const wait = () => {
              if ((s as any)?.ready) console.debug(`Plinko: sound now ready -> ${k}`);
              else setTimeout(wait, 150);
            };
            wait();
          }
        });
      } catch (e) {
        console.debug('Plinko: sound debug error', e);
      }
    }
  }, [sounds]);

  const pegAnimations = React.useRef<Record<number, number>>({});
  const bucketAnimations = React.useRef<Record<number, number>>({});

  const bet = degen ? DEGEN_BET : BET;
  const rows = degen ? 12 : 14;

  const betKey = React.useMemo(() => JSON.stringify(bet), [bet]);
  const baseMultipliers = React.useMemo(() => Array.from(new Set(bet)), [betKey]);

  // Graphics & UI state
  const { settings } = useGraphics();
  const { mobile: isMobile } = useIsCompact();

  const [showControls, setShowControls] = useState(false);
  const customRows = rows;
  const customBuckets = 14;
  const [customMode, setCustomMode] = useState(false);
  const [ballCount, setBallCount] = useState<number>(1);
  const [activeBuckets, setActiveBuckets] = useState<Set<number>>(new Set());
  const [recentHits, setRecentHits] = useState<number[]>([]);
  const poolExceeded = false;
  // Temporarily hide the right-side recent hits/scoreboard until multiplier mapping is fixed
  const showBucketScoreboard = false;
  // settings use only the Basic panel now (Game Mode + Start Stagger)

  // Dynamic radii used in canvas rendering (scale-aware adjustments can be added)
  const dynamicPegRadius = PEG_RADIUS;
  const dynamicBallRadius = PLINKO_RAIUS;

  // Compute bucket hits map for the scoreboard
  const bucketHitsMap = React.useMemo(() => {
    const m = new Map<number, number>();
    for (const idx of recentHits) m.set(idx, (m.get(idx) || 0) + 1);
    return m;
  }, [recentHits]);

  // buckets should reflect the multipliers currently used by the Plinko
  // instance (custom or base). plinkoMultipliers is computed below after the
  // custom state variables are declared.
  const buckets = customMode ? customBuckets : baseMultipliers.length;

  const plinkoMultipliers = React.useMemo(() => {
    if (!customMode) return baseMultipliers;
    const out: number[] = [];
    for (let i = 0; i < customBuckets; i++) {
      out.push(baseMultipliers[i % baseMultipliers.length]);
    }
    return out;
  }, [customMode, customBuckets, baseMultipliers]);

  // Simple color helper (copied from build artifacts) - returns rgba strings
  function getBucketColor(multiplier: number) {
    if (multiplier <= 0.99) {
      return {
        primary: 'rgba(239, 68, 68, 0.9)',
        secondary: 'rgba(220, 38, 38, 0.85)',
        tertiary: 'rgba(185, 28, 28, 0.9)'
      };
    } else if (multiplier >= 1.0 && multiplier <= 3.99) {
      return {
        primary: 'rgba(245, 158, 11, 0.9)',
        secondary: 'rgba(217, 119, 6, 0.85)',
        tertiary: 'rgba(180, 83, 9, 0.9)'
      };
    } else if (multiplier >= 4.0 && multiplier <= 6.99) {
      return {
        primary: 'rgba(34, 197, 94, 0.9)',
        secondary: 'rgba(22, 163, 74, 0.85)',
        tertiary: 'rgba(21, 128, 61, 0.9)'
      };
    } else {
      return {
        primary: 'rgba(59, 130, 246, 0.9)',
        secondary: 'rgba(37, 99, 235, 0.85)',
        tertiary: 'rgba(29, 78, 216, 0.9)'
      };
    }
  }

  const plinkoRows = customMode ? customRows : rows;

  const boardPlinko = usePlinko({
    rows: plinkoRows,
    multipliers: plinkoMultipliers,
    onContact(contact) {
      if (contact.peg && contact.plinko) {
        pegAnimations.current[contact.peg.plugin.pegIndex] = 1;
        safeSoundPlay('bump', { playbackRate: 1 + Math.random() * .05 });
      }
      if (contact.barrier && contact.plinko) {
        safeSoundPlay('bump', { playbackRate: .5 + Math.random() * .05 });
      }
      if (contact.bucket && contact.plinko) {
        const idx = contact.bucket.plugin.bucketIndex;
        bucketAnimations.current[idx] = 1;
        safeSoundPlay(contact.bucket.plugin.bucketMultiplier >= 1 ? 'win' : 'fall');
        // Record recent hits and mark active
        setRecentHits(prev => {
          const next = [...prev.slice(-19), idx];
          return next;
        });
        setActiveBuckets(prev => {
          const next = new Set(prev);
          next.add(idx);
          return next;
        });
      }
    },
  }, [plinkoRows, JSON.stringify(plinkoMultipliers)]);

  // Multi-instance state for simultaneous multi-ball replays
  const [ballPlinkos, setBallPlinkos] = useState<PlinkoGame[]>([]);
  const [multiPlaying, setMultiPlaying] = useState(false);
  const [completedBalls, setCompletedBalls] = useState(0);
  const [ballStatuses, setBallStatuses] = useState<('pending' | 'animating' | 'done')[]>([]);
  // Start stagger in milliseconds between ball visual starts (0 = simultaneous)
  const [ballStartStagger, setBallStartStagger] = useState<number>(0);
  const [overallPlayState, setOverallPlayState] = useState<'idle' | 'loading' | 'launching' | 'playing' | 'done'>('idle');

  // Cleanup any created Plinko instances on unmount or when plinkos change
  useEffect(() => {
    return () => {
      ballPlinkos.forEach(p => {
        try { p.cleanup(); } catch {
          // Ignore cleanup errors
        }
      });
    };
  }, [ballPlinkos]);

  // When user changes ballCount while idle, show pending placeholders for new count
  useEffect(() => {
    if (!multiPlaying) {
      setBallStatuses(Array.from({ length: ballCount }, () => 'pending'));
      setCompletedBalls(0);
      setOverallPlayState('idle');
    }
  }, [ballCount, multiPlaying]);

  // Helper: wait until the plinko replay animation finishes. The engine keeps
  // Play N balls simultaneously (or staggered). For each ball we first
  // request a server result (multiplier), then create a dedicated Plinko
  // instance that will replay that result independently. This allows many
  // replays to animate at once without changing the engine internals.
  const playGame = async () => {
    if (!boardPlinko) return;
    if (multiPlaying) return;

    setMultiPlaying(true);
    setCompletedBalls(0);
    setOverallPlayState('loading');

    // Collect server results for each ball. We perform them sequentially to
    // preserve server semantics; if desired this could be parallelized.
    // Sequentially request server results for each ball to preserve server semantics
    const results: number[] = [];
    setBallStatuses(Array.from({ length: ballCount }, () => 'pending'));
    setCompletedBalls(0);
    for (let i = 0; i < ballCount; i++) {
      await game.play({ wager, bet });
      const result = await game.result();
      results.push(result.multiplier);
    }

    // Create an independent Plinko instance per ball. Each instance receives
    // the same onContact handler so UI/state updates remain unified.
    const instances: PlinkoGame[] = results.map(() => new PlinkoGame({
      rows: plinkoRows,
      multipliers: plinkoMultipliers,
      onContact(contact) {
        if (contact.peg && contact.plinko) {
          pegAnimations.current[contact.peg.plugin.pegIndex] = 1;
          safeSoundPlay('bump', { playbackRate: 1 + Math.random() * .05 });
        }
        if (contact.barrier && contact.plinko) {
          safeSoundPlay('bump', { playbackRate: .5 + Math.random() * .05 });
        }
        if (contact.bucket && contact.plinko) {
          const idx = contact.bucket.plugin.bucketIndex;
          bucketAnimations.current[idx] = 1;
          safeSoundPlay(contact.bucket.plugin.bucketMultiplier >= 1 ? 'win' : 'fall');
          setRecentHits(prev => {
            const next = [...prev.slice(-19), idx];
            return next;
          });
          setActiveBuckets(prev => {
            const next = new Set(prev);
            next.add(idx);
            return next;
          });
        }
      }
    }));

    setBallPlinkos(instances);
    // we've got results, now launching
    setOverallPlayState('launching');

    // Start each instance with optional staggering and monitor completion.
    await new Promise<void>(resolveAll => {
      let finished = 0;

      instances.forEach((inst, idx) => {
        // reset adds the precomputed start positions as live ball bodies
        inst.reset();

        const start = () => {
          // mark animating
          setBallStatuses(prev => {
            const next = [...prev];
            next[idx] = 'animating';
            return next;
          });
          setOverallPlayState('playing');
          inst.run(results[idx]);

          // Poll this instance's private replay state and resolve when done
          const check = () => {
            const path: Float32Array | null = inst && (inst as unknown as { currentPath: Float32Array | null; })['currentPath'];
            const frame: number = inst && (inst as unknown as { currentFrame: number; })['currentFrame'];
            if (!path) {
              finished += 1;
              // mark done
              setBallStatuses(prev => {
                const next = [...prev];
                next[idx] = 'done';
                return next;
              });
              setCompletedBalls(f => f + 1);
              try { inst.cleanup(); } catch {
                // Ignore cleanup errors
              }
              if (finished >= instances.length) return resolveAll();
              return;
            }
            const total = path.length / 2;
            if (frame >= total) {
              finished += 1;
              // mark done
              setBallStatuses(prev => {
                const next = [...prev];
                next[idx] = 'done';
                return next;
              });
              setCompletedBalls(f => f + 1);
              try { inst.cleanup(); } catch {
                // Ignore cleanup errors
              }
              if (finished >= instances.length) return resolveAll();
              return;
            }
            requestAnimationFrame(check);
          };
          requestAnimationFrame(check);
        };

        if (ballStartStagger > 0) setTimeout(start, idx * ballStartStagger);
        else start();
      });
    });

    // All done
        setBallPlinkos([]);
    setMultiPlaying(false);
    setCompletedBalls(0);
  };

  return (
    <>
      {/* Recent Plays Portal - positioned above stats */}
      <GambaUi.Portal target="recentplays">
        <GameRecentPlaysHorizontal gameId="plinko" />
      </GambaUi.Portal>

      {/* Stats Portal - positioned above game screen */}
      <GambaUi.Portal target="stats">
        <GameStatsHeader
          gameName="Plinko"
          gameMode={degen ? "Degen" : "Normal"}
          stats={useGameStats().stats}
          onReset={useGameStats().resetStats}
          isMobile={isMobile}
        />
      </GambaUi.Portal>

      <GambaUi.Portal target="screen">
        <StyledPlinkoBackground>
          {/* Left-side persistent per-ball status column (always visible) */}
          {/* Inline styles & animation keyframes for the status column */}
          <style>{`
            .plinko-ball-status { width: 18px; height: 18px; border-radius: 50%; display:flex; align-items:center; justify-content:center; color: #000; font-size: 10px; font-weight: 700; }
            .plinko-ball-pulse { animation: plinkoPulse 520ms ease-out; }
            @keyframes plinkoPulse {
              0% { transform: scale(1); box-shadow: 0 0 0 rgba(0,0,0,0); }
              40% { transform: scale(1.35); box-shadow: 0 6px 18px rgba(76,175,80,0.35); }
              100% { transform: scale(1); box-shadow: 0 0 0 rgba(0,0,0,0); }
            }
            .plinko-ball-spinner { width: 12px; height: 12px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.15); border-top-color: rgba(255,255,255,0.6); animation: spin 1s linear infinite; }
            @keyframes spin { to { transform: rotate(360deg); } }
          `}</style>

          {/* Left-side status column: fixed to viewport, vertically centered, constrained height */}
          <div style={{ position: 'fixed', left: 18, top: '70%', transform: 'translateY(-50%)', zIndex: 800, pointerEvents: 'none', maxHeight: '70vh', overflow: 'hidden', width: 75 }}>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', background: 'linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.2))', padding: '8px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', boxSizing: 'border-box', pointerEvents: 'auto', maxHeight: '70vh', overflowY: 'auto' }}>
              {Array.from({ length: 10 }).map((_, idx) => {
                const isActive = idx < ballCount;
                const status = ballStatuses[idx];
                const color = status === 'done' ? '#4caf50' : status === 'animating' ? '#ffd54f' : '#9e9e9e';
                const opacity = isActive ? 1 : 0.32;
                const showBadge = isActive;
                const pulseClass = status === 'done' ? 'plinko-ball-pulse' : '';
                return (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className={'plinko-ball-status ' + pulseClass} style={{ background: color, opacity }} title={`Ball ${idx + 1}: ${isActive ? (status || 'pending') : 'placeholder'}`}>
                      {showBadge ? (status === 'pending' ? <div style={{ width: 10, height: 10, borderRadius: 6, background: 'rgba(255,255,255,0.15)' }} /> : (status === 'animating' ? <div className="plinko-ball-spinner" /> : <div style={{ fontSize: 10 }}>{idx + 1}</div>)) : null}
                    </div>
                  </div>
                );
              })}
              {/* State label */}
              <div style={{ marginTop: 6, fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: 700 }}>{overallPlayState === 'idle' ? 'Idle' : overallPlayState === 'loading' ? 'Loading...' : overallPlayState === 'launching' ? 'Launching' : overallPlayState === 'playing' ? 'Playing' : 'Done'}</div>
            </div>
          </div>
          {/* Gravity poetry background elements */}
          <div className="gravity-bg-elements" />
          <div className="melody-overlay" />
          <div className="inevitability-indicator" />

          <GameScreenFrame
            title={game.game.meta?.name}
            description={game.game.meta?.description}
          >
            {/* Canvas now gets more space since header is outside */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
              <GambaUi.Canvas
                style={{ flex: 1, width: '100%', height: '100%' }}
                render={({ ctx, size }: { ctx: CanvasRenderingContext2D; size: { width: number; height: number; }; }) => {
                  // Board Plinko must exist to render the static board
                  if (!boardPlinko) return;

                  // Main board bodies (pegs, barriers, buckets)
                  const boardBodies = boardPlinko.getBodies();

                  const xx = size.width / boardPlinko.width;
                  const yy = size.height / boardPlinko.height;
                  const s = Math.min(xx, yy);

                  ctx.clearRect(0, 0, size.width, size.height);
                  // Remove dark background to show cyan gravity colorScheme
                  // ctx.fillStyle = '#0b0b13'
                  // ctx.fillRect(0, 0, size.width, size.height)
                  ctx.save();
                  ctx.translate(size.width / 2 - boardPlinko.width / 2 * s, size.height / 2 - boardPlinko.height / 2 * s);
                  ctx.scale(s, s);
                  if (debug) {
                    ctx.beginPath();
                    boardBodies.forEach(({ vertices }) => {
                      ctx.moveTo(vertices[0].x, vertices[0].y);
                      for (let j = 1; j < vertices.length; j += 1) {
                        ctx.lineTo(vertices[j].x, vertices[j].y);
                      }
                      ctx.lineTo(vertices[0].x, vertices[0].y);
                    });
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = '#fff';
                    ctx.stroke();
                  }
                  // Always render board elements
                  boardBodies.forEach((body, i) => {
                    const { label, position } = body;
                    if (label === 'Peg') {
                      ctx.save();
                      ctx.translate(position.x, position.y);
                      const animation = pegAnimations.current[body.plugin?.pegIndex] ?? 0;
                      if (pegAnimations.current[body.plugin?.pegIndex]) {
                        pegAnimations.current[body.plugin?.pegIndex] *= .9;
                      }
                      // Only apply scale animation if motion is enabled
                      const animationEffect = settings.enableMotion ? animation : 0;
                      if (settings.enableMotion) {
                        ctx.scale(1 + animation * .4, 1 + animation * .4);
                      }
                      const pegHue = (position.y + position.x + Date.now() * .05) % 360;
                      ctx.fillStyle = 'hsla(' + pegHue + ', 75%, 60%, ' + (1 + animationEffect * 2) * .2 + ')';
                      ctx.beginPath();
                      ctx.arc(0, 0, dynamicPegRadius + 4, 0, Math.PI * 2);
                      ctx.fill();
                      const light = 75 + animationEffect * 25;
                      ctx.fillStyle = 'hsla(' + pegHue + ', 85%, ' + light + '%, 1)';
                      ctx.beginPath();
                      ctx.arc(0, 0, dynamicPegRadius, 0, Math.PI * 2);
                      ctx.fill();
                      ctx.restore();
                      return;
                    }
                    if (label === 'Plinko') {
                      // BoardPlinko may contain pre-spawned bodies; draw them lightly
                      ctx.save();
                      ctx.translate(position.x, position.y);
                      ctx.fillStyle = 'hsla(' + (i * 420 % 360) + ', 75%, 90%, .08)';
                      ctx.beginPath();
                      ctx.arc(0, 0, dynamicBallRadius * 1.5, 0, Math.PI * 2);
                      ctx.fill();
                      ctx.restore();
                      return;
                    }
                    if (label === 'Bucket') {
                      const animation = bucketAnimations.current[body.plugin.bucketIndex] ?? 0;
                      if (bucketAnimations.current[body.plugin.bucketIndex]) {
                        bucketAnimations.current[body.plugin.bucketIndex] *= .9;
                      }
                      ctx.save();
                      ctx.translate(position.x, position.y);
                      // Enhanced bucket styling with dynamic colors based on multiplier
                      const bucketMultiplier = body.plugin.bucketMultiplier;
                      // Only apply animation effect if motion is enabled, otherwise use static values
                      const animationEffect = settings.enableMotion ? animation : 0;
                      const bucketAlpha = 0.8 + animationEffect * 0.2;

                      // Get dynamic colors based on multiplier value
                      const colors = getBucketColor(bucketMultiplier);

                      // Create gradient for bucket background
                      const gradient = ctx.createLinearGradient(-25, -bucketHeight, 25, 0);
                      gradient.addColorStop(0, colors.primary.replace('0.9)', `${bucketAlpha})`));
                      gradient.addColorStop(0.5, colors.secondary.replace('0.85)', `${bucketAlpha * 0.9})`));
                      gradient.addColorStop(1, colors.tertiary.replace('0.9)', `${bucketAlpha})`));

                      ctx.save();
                      ctx.translate(0, bucketHeight / 2);
                      ctx.scale(1, 1 + animation * 2);
                      // Draw bucket background with gradient
                      ctx.fillStyle = gradient;
                      ctx.fillRect(-25, -bucketHeight, 50, bucketHeight);
                      // Add border for better separation
                      ctx.strokeStyle = `rgba(255, 255, 255, ${0.6 + animation * 0.4})`;
                      ctx.lineWidth = 2;
                      ctx.strokeRect(-25, -bucketHeight, 50, bucketHeight);
                      ctx.restore();
                      // Enhanced text styling
                      ctx.font = 'bold 18px Arial';
                      ctx.textAlign = 'center';
                      ctx.lineWidth = 3;
                      ctx.lineJoin = 'round';
                      // Text shadow/outline
                      ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
                      ctx.strokeText('x' + bucketMultiplier, 0, 0);
                      // Main text
                      ctx.fillStyle = `rgba(255, 255, 255, ${0.95 + animation * 0.05})`;
                      ctx.fillText('x' + bucketMultiplier, 0, 0);
                      ctx.restore();
                    }
                    if (label === 'Barrier') {
                      ctx.save();
                      ctx.translate(position.x, position.y);
                      ctx.fillStyle = '#cccccc22';
                      ctx.fillRect(-barrierWidth / 2, -barrierHeight / 2, barrierWidth, barrierHeight);
                      ctx.restore();
                    }
                  });

                  // Render active ball instances (each has its own bodies)
                  if (ballPlinkos && ballPlinkos.length) {
                    ballPlinkos.forEach((inst, instIdx) => {
                      try {
                        const bodies = inst.getBodies();
                        bodies.forEach((body, bi) => {
                          if (body.label !== 'Plinko') return;
                          const pos = body.position;
                          ctx.save();
                          ctx.translate(pos.x, pos.y);
                          const hue = (instIdx * 97 + bi * 137) % 360;
                          ctx.fillStyle = 'hsla(' + hue + ', 75%, 70%, 1)';
                          ctx.beginPath();
                          ctx.arc(0, 0, dynamicBallRadius, 0, Math.PI * 2);
                          ctx.fill();
                          ctx.restore();
                        });
                      } catch {
                        // ignore instance errors
                      }
                    });
                  }
                  ctx.restore();
                }}
              />

              {/* Bucket Scoreboard (hidden for now while multiplier mapping is fixed) */}
              {showBucketScoreboard && (
                <BucketScoreboard
                  multipliers={plinkoMultipliers}
                  activeBuckets={activeBuckets}
                  bucketHits={bucketHitsMap}
                  recentHits={recentHits}
                />
              )}
            </div>
          </GameScreenFrame>

          {/* Custom Settings Modal - automatically switches to custom mode */}
          {showControls && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(24, 24, 24, 0.98) 0%, rgba(32, 32, 40, 0.95) 100%)',
                borderRadius: '16px',
                border: '2px solid rgba(156, 39, 176, 0.4)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                padding: '24px',
                width: '95vw',
                maxWidth: '900px',
                position: 'relative'
              }}>
                {/* Header Section + Tabs */}
                <style>{`@keyframes settingsEnter { from { transform: translateY(8px) scale(.995); opacity: 0 } to { transform: translateY(0) scale(1); opacity: 1 } }`}</style>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid rgba(156, 39, 176, 0.08)'
                }}>
                  <div>
                    <h2 style={{
                      margin: 0,
                      fontSize: '24px',
                      fontWeight: 'bold',
                      background: 'linear-gradient(90deg, #9c27b0, #e91e63)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      color: 'transparent'
                    }}>
                      Plinko Settings
                    </h2>
                    <p style={{ margin: '6px 0 0 0', color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>Mode and Start Stagger live in Settings</p>
                  </div>
                  <button
                    onClick={() => setShowControls(false)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    ✕
                  </button>
                </div>

                {/* Horizontal Controls Layout (Basic: Game Mode + Start Stagger) */}
                <div style={{
                  display: 'flex',
                  gap: '18px',
                  alignItems: 'flex-start',
                  animation: 'settingsEnter 220ms cubic-bezier(.2,.9,.2,1)'
                }}>
                  <div style={{ flex: 1, minHeight: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'rgba(156, 39, 176, 0.04)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(156, 39, 176, 0.12)' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#9c27b0', marginBottom: '12px' }}>GAME MODE</div>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', margin: '0 0 12px 0' }}>Choose Normal or Degen mode for different bucket layouts.</p>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => { setCustomMode(false); setDegen(false); }} disabled={gamba.isPlaying} style={{ flex: 1, padding: '8px 12px', borderRadius: 10, border: 'none', background: !degen ? 'linear-gradient(135deg, #4caf50, #45a049)' : 'rgba(255,255,255,0.03)', color: !degen ? '#fff' : 'rgba(255,255,255,0.8)', fontWeight: 700 }}>Normal</button>
                      <button onClick={() => { setCustomMode(false); setDegen(true); }} disabled={gamba.isPlaying} style={{ flex: 1, padding: '8px 12px', borderRadius: 10, border: 'none', background: degen ? 'linear-gradient(135deg, #ff9800, #f57c00)' : 'rgba(255,255,255,0.03)', color: degen ? '#fff' : 'rgba(255,255,255,0.8)', fontWeight: 700 }}>Degen</button>
                    </div>
                  </div>
                  <div style={{ flex: 1, minHeight: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'rgba(0, 188, 212, 0.04)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(0, 188, 212, 0.08)' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#00bcd4', marginBottom: '12px' }}>START STAGGER (ms)</div>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', margin: '0 0 12px 0' }}>Time (in MS) between visual starts when playing multiple balls.</p>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>{[0, 50, 100, 200, 400].map(ms => (<button key={ms} onClick={() => setBallStartStagger(ms)} disabled={gamba.isPlaying || multiPlaying} style={{ flex: 1, padding: '8px 10px', borderRadius: 8, border: ballStartStagger === ms ? '2px solid rgba(0,0,0,0.6)' : '1px solid rgba(255,255,255,0.04)', background: ballStartStagger === ms ? 'rgba(255,255,255,0.06)' : 'transparent', color: ballStartStagger === ms ? '#fff' : 'rgba(255,255,255,0.8)', fontWeight: 700 }}>{ms === 0 ? '0 (sim)' : `${ms} ms`}</button>))}</div>
                  </div>
                </div>

                {/* Summary row (current mode/rows/buckets/balls/max) */}
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 12, color: 'rgba(255,255,255,0.9)', fontSize: 13 }}>
                  <div>🎯 <strong>{customMode ? 'Custom' : degen ? 'Degen' : 'Normal'}</strong> Mode</div>
                  <div>📏 <strong>{rows}</strong> Rows</div>
                  <div>🪣 <strong>{buckets}</strong> Buckets</div>
                  <div>⚡ <strong>{ballCount}</strong> Ball{ballCount > 1 ? 's' : ''}</div>
                  <div>💰 Max: <strong>{Math.max(...bet).toFixed(2)}x</strong></div>
                </div>

                {/* Footer Info */}
                <div style={{
                  textAlign: 'center',
                  paddingTop: 'clamp(12px, 2vw, 16px)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontSize: 'clamp(10px, 2vw, 12px)',
                  marginTop: 'clamp(12px, 2vw, 16px)'
                }}>
                  💡 {customMode ? 'Experiment with different combinations to find your perfect risk/reward balance' : 'Use the controls above to quickly switch modes and ball counts'}
                </div>
              </div>
            </div>
          )}
        </StyledPlinkoBackground>
      </GambaUi.Portal>

      <GambaUi.Portal target="controls">
          <MobileControls
          wager={wager}
          setWager={setWager}
          onPlay={() => playGame()}
          playDisabled={gamba.isPlaying || poolExceeded}
          playText="Play"
        >

          {/* Controls Container - EXACTLY like wager input */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(10, 5, 17, 0.85) 0%, rgba(139, 90, 158, 0.1) 50%, rgba(10, 5, 17, 0.85) 100%)',
            border: '1px solid rgba(212, 165, 116, 0.4)',
            borderRadius: '16px',
            padding: '14px',
            boxShadow: 'inset 0 2px 8px rgba(10, 5, 17, 0.4), 0 4px 16px rgba(212, 165, 116, 0.1), 0 0 0 1px rgba(212, 165, 116, 0.15)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            width: isMobile ? '100%' : 'fit-content',
            maxWidth: '100%'
          }}>
            {/* (Start Stagger moved into Settings) */}
            {/* (Game Mode moved into Settings) */}

            {/* Balls Dropdown (where token would be) */}
            <select
              value={ballCount}
              onChange={(e) => setBallCount(Number(e.target.value))}
              disabled={gamba.isPlaying}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(212, 165, 116, 0.9)',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: gamba.isPlaying ? 'not-allowed' : 'pointer',
                opacity: gamba.isPlaying ? 0.5 : 1,
                outline: 'none',
                fontFamily: 'Libre Baskerville, serif'
              }}
            >
              {[1, 3, 5, 10].map(count => (
                <option key={count} value={count} style={{ background: '#1a1a1a', color: '#ff5722' }}>
                  {count} Ball{count > 1 ? 's' : ''}
                </option>
              ))}
            </select>

            {/* Per-ball progress indicator */}
            {multiPlaying && (
              <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px', fontWeight: 'bold' }}>
                Animating {completedBalls}/{ballCount}
              </div>
            )}

            <button
              onClick={() => { setCustomMode(true); setShowControls(true); }}
              disabled={gamba.isPlaying}
              style={{
                marginLeft: 8,
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.04)',
                color: 'rgba(212, 165, 116, 0.95)',
                fontSize: '12px',
                padding: '6px 10px',
                borderRadius: 8,
                cursor: gamba.isPlaying ? 'not-allowed' : 'pointer',
                opacity: gamba.isPlaying ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
              title="Game Mode & Start Stagger live in Settings"
            >
              <strong style={{ color: 'inherit' }}>{degen ? 'Degen' : 'Normal'}</strong>
              <span style={{ opacity: 0.6 }}>•</span>
              <span style={{ fontSize: 12 }}>{ballStartStagger}ms</span>
            </button>
          </div>
        </MobileControls>

        <DesktopControls
          onPlay={() => playGame()}
          playDisabled={gamba.isPlaying || poolExceeded}
          playText="Play"
        >
          <EnhancedWagerInput value={wager} onChange={setWager} />

          {/* Controls Container - EXACTLY like wager input */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(10, 5, 17, 0.85) 0%, rgba(139, 90, 158, 0.1) 50%, rgba(10, 5, 17, 0.85) 100%)',
            border: '1px solid rgba(212, 165, 116, 0.4)',
            borderRadius: '16px',
            padding: '14px',
            boxShadow: 'inset 0 2px 8px rgba(10, 5, 17, 0.4), 0 4px 16px rgba(212, 165, 116, 0.1), 0 0 0 1px rgba(212, 165, 116, 0.15)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            width: 'fit-content'
          }}>
            {/* (Start Stagger moved into Settings) */}
            {/* (Game Mode moved into Settings) */}

            {/* Balls Dropdown (where token would be) */}
            <select
              value={ballCount}
              onChange={(e) => setBallCount(Number(e.target.value))}
              disabled={gamba.isPlaying}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(212, 165, 116, 0.9)',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: gamba.isPlaying ? 'not-allowed' : 'pointer',
                opacity: gamba.isPlaying ? 0.5 : 1,
                outline: 'none',
                fontFamily: 'Libre Baskerville, serif'
              }}
            >
              {[1, 3, 5, 10].map(count => (
                <option key={count} value={count} style={{ background: '#1a1a1a', color: '#ff5722' }}>
                  {count} Ball{count > 1 ? 's' : ''}
                </option>
              ))}
            </select>

            <button
              onClick={() => { setCustomMode(true); setShowControls(true); }}
              disabled={gamba.isPlaying}
              style={{
                marginLeft: 8,
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.04)',
                color: 'rgba(212, 165, 116, 0.95)',
                fontSize: '12px',
                padding: '6px 10px',
                borderRadius: 8,
                cursor: gamba.isPlaying ? 'not-allowed' : 'pointer',
                opacity: gamba.isPlaying ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
              title="Game Mode & Start Stagger live in Settings"
            >
              <strong style={{ color: 'inherit' }}>{degen ? 'Degen' : 'Normal'}</strong>
              <span style={{ opacity: 0.6 }}>•</span>
              <span style={{ fontSize: 12 }}>{ballStartStagger}ms</span>
            </button>
          </div>
        </DesktopControls>
      </GambaUi.Portal>
    </>
  );
}
