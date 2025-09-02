// src/components/Scoreboard.tsx
import React from 'react';
import {
  motion,
  AnimatePresence,
  LayoutGroup,
} from 'framer-motion';
import { PlayerInfo } from '../engine/types';
import { TokenValue } from 'gamba-react-ui-v2';

interface Props {
  roster       : PlayerInfo[];
  scores       : number[];
  mults        : number[];
  targetPoints : number;
  final?       : boolean;         // game finished?
  payouts?     : number[];        // lamports won
  metadata?    : Record<string,string>; // optional on-chain names
}

export default function Scoreboard({
  roster,
  scores,
  mults,
  targetPoints,
  final   = false,
  payouts = [],
  metadata = {},
}: Props) {
  // build & sort rows by score desc
  const rows = roster
    .map((p, i) => ({
      p,
      s: scores[i]  ?? 0,
      m: mults[i]   ?? 1,
      w: payouts[i] ?? 0,
      name: metadata[p.id] ?? '',    // look up metadata
    }))
    .sort((a, b) => b.s - a.s);

  const leader = rows[0];
  const progressPct = leader ? Math.max(0, Math.min(1, leader.s / targetPoints)) * 100 : 0;

  return (
    <LayoutGroup>
      <motion.div
        layoutId="scoreboard-container"
        layout
        transition={{ type: 'spring', stiffness: 280, damping: 30 }}
        style={{
          position: final ? 'fixed' : 'absolute',
          top: final ? 0 : 12,
          left: final ? 0 : 12,
          right: final ? 0 : undefined,
          bottom: final ? 0 : undefined,
          width: final ? '-webkit-fill-available' : 'auto',
          height: final ? 'fit-content' : 'auto',
          maxWidth: final ? 'none' : 300,
          overflowY: final ? 'auto' : undefined,
          background: final 
            ? 'linear-gradient(135deg, rgba(15,15,35,0.98) 0%, rgba(26,26,46,0.98) 50%, rgba(15,15,35,0.98) 100%)'
            : 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(15,15,35,0.85) 100%)',
          padding: final ? 'min(5vw, 24px)' : '12px 16px',
          borderRadius: final ? 0 : 16,
          border: final 
            ? 'none' 
            : '1px solid rgba(255,215,0,0.2)',
          color: '#fff',
          fontSize: final ? 'clamp(12px, 3vw, 14px)' : 13,
          boxShadow: final 
            ? 'none'
            : '0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,215,0,0.05)',
          backdropFilter: final ? 'blur(20px)' : 'blur(12px)',
          zIndex: final ? 9999 : 400,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: final ? 'flex-start' : undefined,
          alignItems: 'center',
        }}
      >
        {/* Enhanced Header */}
        <motion.div 
          layout
          style={{ 
            marginBottom: final ? 'min(4vh, 20px)' : 12, 
            marginTop: final ? 'min(3vh, 16px)' : 0,
            textAlign: 'center',
            position: 'relative',
            width: '100%',
            maxWidth: final ? 'min(100vw, 600px)' : 'auto',
            padding: final ? '0 min(4vw, 16px)' : '0'
          }}
        >
          <motion.div 
            layout
            style={{ 
              fontWeight: 800, 
              fontSize: final ? 'clamp(18px, 6vw, 28px)' : 16,
              letterSpacing: final ? 'clamp(0.5px, 0.2vw, 1.5px)' : 0.5,
              background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #f1c40f 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: final ? '0 0 30px rgba(255,215,0,0.4)' : '0 0 20px rgba(255,215,0,0.3)',
              marginBottom: final ? 'min(2vh, 12px)' : 8
            }}
          >
            {final ? '🏁 RACE COMPLETE' : '⚡ RACE TO ' + targetPoints}
          </motion.div>

          {!final && (
            <motion.div 
              layout
              style={{ 
                fontWeight: 600, 
                fontSize: 12,
                opacity: 0.8,
                marginBottom: 8
              }}
            >
              TARGET: {targetPoints}
            </motion.div>
          )}

          {/* Enhanced Progress Bar */}
          <motion.div
            layout
            style={{
              marginTop: final ? 'min(1.5vh, 8px)' : 8,
              marginLeft: 'auto',
              marginRight: 'auto',
              maxWidth: final ? 'min(90vw, 400px)' : 240,
              height: final ? 'clamp(6px, 2vw, 12px)' : 8,
              borderRadius: 20,
              background: 'linear-gradient(90deg, rgba(255,255,255,0.08) 0%, rgba(255,215,0,0.08) 100%)',
              overflow: 'hidden',
              border: `1px solid rgba(255,215,0,0.2)`,
              position: 'relative'
            }}
          >
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{
                height: '100%',
                background: progressPct > 80 
                  ? 'linear-gradient(90deg, #ff6b35 0%, #ffd700 50%, #00ff88 100%)'
                  : 'linear-gradient(90deg, #a259ff 0%, #ffd700 100%)',
                borderRadius: 20,
                boxShadow: progressPct > 80 
                  ? '0 0 20px rgba(255,215,0,0.6), 0 0 40px rgba(0,255,136,0.3)'
                  : '0 0 16px rgba(255,215,0,0.4)',
                position: 'relative'
              }}
            >
              {progressPct > 15 && (
                <motion.div
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: final ? 'clamp(9px, 1.2vw, 12px)' : 8,
                    fontWeight: 700,
                    color: '#000',
                    textShadow: '0 1px 2px rgba(255,255,255,0.8)'
                  }}
                >
                  {Math.round(progressPct)}%
                </motion.div>
              )}
            </motion.div>
            
            {/* Lightning effect at the end of progress bar */}
            {progressPct > 50 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                  position: 'absolute',
                  right: `${100 - progressPct}%`,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#fff',
                  fontSize: final ? 'clamp(14px, 1.5vw, 16px)' : 12,
                  filter: 'drop-shadow(0 0 4px #ffd700)'
                }}
              >
                ⚡
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/* Column Headers for Final View */}
        {final && (
          <motion.div
            layout="position"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr auto auto',
              gap: 'min(3vw, 12px)',
              fontSize: 'clamp(10px, 3vw, 12px)',
              fontWeight: 700,
              marginBottom: 'min(3vh, 16px)',
              textTransform: 'uppercase',
              letterSpacing: 'clamp(0.3px, 0.1vw, 0.8px)',
              opacity: 0.8,
              paddingBottom: 'min(2vh, 8px)',
              borderBottom: '1px solid rgba(255,215,0,0.3)',
              width: '100%',
              maxWidth: '600px',
              padding: '0 min(4vw, 16px)'
            }}
          >
            <div>Rank</div>
            <div>Player</div>
            <div style={{ textAlign: 'right' }}>Score</div>
            <div style={{ textAlign: 'right' }}>Payout</div>
          </motion.div>
        )}

        {/* Player Rows Container */}
        <div style={{
          width: '100%',
          maxWidth: '600px',
          flex: final ? 'none' : 'auto',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: final ? 'calc(100vh - 200px)' : 'auto',
          overflowY: final ? 'auto' : 'visible',
          padding: final ? '0 min(4vw, 16px)' : '0'
        }}>
          {/* Player Rows */}
          <AnimatePresence mode="popLayout">
            {rows.map(({ p, name, s, m, w }, idx) => {
              const isWinner = final && idx === 0;
              const isTop3 = final && idx < 3;
              
              return (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    boxShadow: isWinner 
                      ? '0 0 40px rgba(255,215,0,0.6), 0 12px 24px rgba(0,0,0,0.4)'
                      : isTop3 
                        ? '0 0 30px rgba(162,89,255,0.3), 0 8px 16px rgba(0,0,0,0.3)'
                        : '0 4px 12px rgba(0,0,0,0.2)'
                  }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ 
                    type: 'spring', 
                    stiffness: 300, 
                    damping: 30,
                    delay: idx * 0.05
                  }}
                  style={{
                    display: final ? 'grid' : 'flex',
                    gridTemplateColumns: final ? 'auto 1fr auto auto' : undefined,
                    alignItems: 'center',
                    gap: final ? 'min(3vw, 12px)' : 8,
                    marginBottom: final ? 'min(2vh, 8px)' : 8,
                    padding: final ? 'min(3vw, 12px)' : '8px 12px',
                    background: isWinner
                      ? 'linear-gradient(135deg, rgba(255,215,0,0.2) 0%, rgba(255,237,78,0.15) 100%)'
                      : isTop3
                        ? 'linear-gradient(135deg, rgba(162,89,255,0.15) 0%, rgba(255,215,0,0.08) 100%)'
                        : 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                    borderRadius: final ? 'min(2vw, 10px)' : 12,
                    border: isWinner
                      ? '2px solid rgba(255,215,0,0.6)'
                      : isTop3
                        ? '1px solid rgba(162,89,255,0.4)'
                        : '1px solid rgba(255,255,255,0.1)',
                    fontSize: final ? 'clamp(11px, 3vw, 14px)' : 13,
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Winner Crown Effect */}
                  {isWinner && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
                      style={{
                        position: 'absolute',
                        top: -12,
                        right: -12,
                        fontSize: final ? 'clamp(20px, 3vw, 28px)' : 24,
                        filter: 'drop-shadow(0 0 12px #ffd700)'
                      }}
                    >
                      👑
                    </motion.div>
                  )}

                  {/* Rank Badge (Final Mode) */}
                  {final && (
                    <motion.div
                      layout
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 'clamp(24px, 8vw, 36px)',
                        height: 'clamp(24px, 8vw, 36px)',
                        borderRadius: '50%',
                        background: isWinner 
                          ? 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)'
                          : isTop3
                            ? 'linear-gradient(135deg, #a259ff 0%, #c084fc 100%)'
                            : 'linear-gradient(135deg, #374151 0%, #4b5563 100%)',
                        color: isWinner ? '#000' : '#fff',
                        fontWeight: 900,
                        fontSize: 'clamp(10px, 3vw, 14px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        boxShadow: isWinner 
                          ? '0 0 30px rgba(255,215,0,0.7)'
                          : isTop3 
                            ? '0 0 20px rgba(162,89,255,0.5)'
                            : 'none'
                      }}
                    >
                      {idx + 1}
                    </motion.div>
                  )}

                  {/* Color Chip & Player Info */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    flex: final ? undefined : 1,
                    minWidth: 0
                  }}>
                    {/* Enhanced Color Chip */}
                    <motion.div 
                      layout
                      whileHover={{ scale: 1.1 }}
                      style={{
                        width: final ? 'clamp(12px, 4vw, 16px)' : 14,
                        height: final ? 'clamp(12px, 4vw, 16px)' : 14,
                        background: `linear-gradient(135deg, ${p.color} 0%, ${p.color}aa 100%)`,
                        borderRadius: final ? 4 : 4,
                        border: `1px solid rgba(255,255,255,0.4)`,
                        boxShadow: `0 0 ${final ? 12 : 12}px ${p.color}44`,
                        marginRight: final ? 'min(2vw, 8px)' : 8,
                        flexShrink: 0
                      }}
                    />

                    {/* Player Name */}
                    <div style={{
                      fontWeight: isWinner ? 800 : 600,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      color: isWinner ? '#ffd700' : '#fff',
                      textShadow: isWinner ? '0 0 15px rgba(255,215,0,0.7)' : 'none',
                      fontSize: final ? 'clamp(12px, 3.5vw, 16px)' : 'inherit'
                    }}>
                      {name || `${p.id.slice(0, final ? 8 : 4)}…`}
                    </div>
                  </div>

                  {/* Multiplier (Live Mode Only) */}
                  {!final && m > 1 && (
                    <motion.div
                      layout
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      whileHover={{ scale: 1.05 }}
                      style={{
                        padding: '4px 8px',
                        background: `linear-gradient(135deg, ${p.color}22 0%, ${p.color}11 100%)`,
                        borderRadius: 8,
                        border: `1px solid ${p.color}44`,
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        fontSize: 11,
                        color: p.color,
                        boxShadow: `0 0 8px ${p.color}22`,
                        textShadow: `0 0 4px ${p.color}44`
                      }}
                    >
                      ×{m}
                    </motion.div>
                  )}

                  {/* Score */}
                  <motion.div 
                    layout
                    style={{
                      textAlign: 'right',
                      fontFamily: 'monospace',
                      fontWeight: 800,
                      fontSize: final ? 'clamp(12px, 3.5vw, 16px)' : 14,
                      color: isWinner ? '#ffd700' : '#fff',
                      textShadow: isWinner ? '0 0 12px rgba(255,215,0,0.7)' : 'none',
                      minWidth: final ? 'auto' : 40
                    }}
                  >
                    {Number.isInteger(s) ? s : s.toFixed(1)}
                  </motion.div>

                  {/* Payout (Final Mode Only) */}
                  {final && (
                    <motion.div
                      layout
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 'auto', opacity: 1 }}
                      style={{
                        textAlign: 'right',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        fontSize: 'clamp(10px, 3vw, 12px)',
                        color: w > 0 ? '#00ff88' : '#666',
                        textShadow: w > 0 ? '0 0 12px rgba(0,255,136,0.5)' : 'none'
                      }}
                    >
                      <TokenValue amount={w} />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Footer for Final Mode */}
        {final && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              marginTop: 'min(3vh, 16px)',
              marginBottom: 'min(2vh, 12px)',
              padding: 'min(3vw, 12px) min(4vw, 16px)',
              borderTop: '1px solid rgba(255,215,0,0.3)',
              textAlign: 'center',
              fontSize: 'clamp(10px, 3vw, 12px)',
              opacity: 0.8,
              fontStyle: 'italic',
              width: '100%',
              maxWidth: '600px'
            }}
          >
            🏁 Race Complete • Lightning Fast Results
          </motion.div>
        )}
      </motion.div>
    </LayoutGroup>
  );
}
