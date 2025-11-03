import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCurrentPool } from 'gamba-react-ui-v2';
import type { GameBundle } from '../../../../games/types';

interface LiveGameEcosystemProps {
  game: GameBundle;
  onClick?: () => void;
}

export function LiveGameEcosystem({ game, onClick }: LiveGameEcosystemProps) {
  const [isActive, setIsActive] = useState(false);
  const pool = useCurrentPool();

  // Use real game status data - only the 3 live statuses
  const isOnline = game.live === 'online';
  const isOffline = game.live === 'offline';
  const isComingSoon = game.live === 'coming-soon';

  return (
    <motion.div
      className="live-game-ecosystem"
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      onHoverStart={() => setIsActive(true)}
      onHoverEnd={() => setIsActive(false)}
      style={{
        width: '150px',
        height: '150px',
        background: `linear-gradient(135deg, rgba(20, 20, 30, 0.8), rgba(40, 40, 60, 0.8)), url(${game.meta.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '15px',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        color: 'white',
        boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
        border: `2px solid ${isOnline ? 'rgba(16, 185, 129, 0.3)' :
                           isOffline ? 'rgba(239, 68, 68, 0.3)' :
                           'rgba(245, 158, 11, 0.3)'}`,
        position: 'relative',
        overflow: 'hidden',
        opacity: isOnline ? 1 : 0.7,
        cursor: isOnline ? 'pointer' : 'not-allowed'
      }}
    >
      {/* Game overlay info */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '10px'
      }}>
      </div>

      {/* Hover effect particles */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none'
            }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: `hsl(${(i * 45) % 360}, 70%, 60%)`,
                  boxShadow: `0 0 6px hsl(${(i * 45) % 360}, 70%, 60%)`
                }}
                animate={{
                  x: [0, Math.cos(i * 45 * Math.PI / 180) * 60],
                  y: [0, Math.sin(i * 45 * Math.PI / 180) * 60],
                  opacity: [0, 1, 0],
                  scale: [0, 1.2, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click to play overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(139, 90, 158, 0.8), rgba(184, 51, 106, 0.8))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(4px)'
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            color: 'white',
            fontSize: '12px',
            fontWeight: 'bold',
            textAlign: 'center'
          }}
        >
          <div>
            {isComingSoon ? '⏰' :
             isOffline ? '❌' :
             '🎮'}
          </div>
          <div style={{ fontSize: '10px', marginTop: '2px' }}>
            {isComingSoon ? 'Coming Soon' :
             isOffline ? 'Maintenance' :
             'Tap to Play'}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}