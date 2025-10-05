import React from 'react';
import { GambaTransaction, BPS_PER_WHOLE } from 'gamba-core-v2';
import { useTokenMeta } from 'gamba-react-ui-v2';
import { useRecentPlays } from '../../sections/RecentPlays/useRecentPlays';
import { useMediaQuery } from '../../hooks/ui/useMediaQuery';

// Import context directly - this component is used in both themes
import { useDegenHeaderModal } from '../../themes/layouts/degenheart/DegenHeartLayout';
import { FEATURE_FLAGS } from '../../constants';

function TimeDiff({ time, suffix = 'ago' }: { time: number; suffix?: string; }) {
  const [now, setNow] = React.useState(Date.now());

  React.useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const diff = now - time;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}m`;
  return `${Math.max(1, seconds)}s`;
}

interface GameRecentPlaysHorizontalProps {
  gameId: string;
  limit?: number;
}

export function GameRecentPlaysHorizontal({ gameId, limit = 10 }: GameRecentPlaysHorizontalProps) {
  // Global feature flag: hide the in-game recent plays UI when disabled
  if (!FEATURE_FLAGS.ENABLE_INGAME_RECENT_GAMES) return null;
  const events = useRecentPlays({ gameId, limit });
  const md = useMediaQuery('md');
  const { openShareModal } = useDegenHeaderModal();

  // Create array of exactly 'limit' items, filling empty slots with placeholders
  const displayItems: (GambaTransaction<'GameSettled'> | null)[] = [...events];
  while (displayItems.length < limit) {
    displayItems.push(null);
  }

  return (
    <>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.75rem 0.5rem',
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 215, 0, 0.2)',
        backdropFilter: 'blur(10px)',
        margin: '0',
        minHeight: '60px',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Title */}
        <div style={{
          minWidth: 'fit-content',
          maxWidth: '120px',
          fontSize: '0.9rem',
          fontWeight: '600',
          color: '#ffd700',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          flexShrink: 0
        }}>
          Recent Plays
        </div>

        {/* Horizontal scrollable container */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          overflowX: 'auto',
          overflowY: 'hidden',
          flex: 1,
          minWidth: 0,
          maxWidth: '100%',
          width: '100%',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255, 215, 0, 0.3) transparent',
          paddingBottom: '2px',
          boxSizing: 'border-box'
        }}>
          {displayItems.map((event, index) =>
            event ? (
              <HorizontalRecentPlay
                key={event.signature}
                event={event}
                onClick={() => {
                  console.log('Horizontal click handler called with event:', event);
                  console.log('openShareModal function:', openShareModal);
                  openShareModal(event);
                }}
              />
            ) : (
              <HorizontalPlaceholder key={`placeholder-${index}`} />
            )
          )}
        </div>
      </div>
    </>
  );
}

function HorizontalRecentPlay({ event, onClick }: {
  event: GambaTransaction<'GameSettled'>;
  onClick?: () => void;
}) {
  const data = event.data;
  const token = useTokenMeta(data.tokenMint);

  const profit = data.payout.toNumber() - data.wager.toNumber();
  const isProfit = profit >= 0;
  const multiplier = data.payout.toNumber() / data.wager.toNumber();

  return (
    <div
      onClick={onClick}
      style={{
        minWidth: '120px',
        maxWidth: '160px',
        width: '140px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem',
        borderRadius: '8px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: `1px solid ${isProfit ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 0, 0, 0.3)'}`,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        flexShrink: 1,
        boxSizing: 'border-box'
      }}>
      {/* Player avatar */}
      <div style={{
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        background: `linear-gradient(45deg, ${isProfit ? '#00ff88' : '#ff4444'}, ${isProfit ? '#00cc66' : '#cc2222'})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '10px',
        fontWeight: 'bold',
        color: 'white'
      }}>
        {data.user.toBase58().slice(0, 2).toUpperCase()}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '0.75rem',
          fontWeight: '600',
          color: isProfit ? '#00ff88' : '#ff4444',
          lineHeight: 1
        }}>
          {multiplier > 0 ? `${multiplier.toFixed(2)}x` : 'Lost'}
        </div>
        <div style={{
          fontSize: '0.65rem',
          color: 'rgba(255, 255, 255, 0.6)',
          lineHeight: 1
        }}>
          <TimeDiff time={event.time} />
        </div>
      </div>

      {/* Amount */}
      <div style={{
        fontSize: '0.7rem',
        fontWeight: '500',
        color: isProfit ? '#00ff88' : '#ff4444',
        textAlign: 'right'
      }}>
        {isProfit ? '+' : ''}{(profit / 10 ** (token?.decimals || 9)).toFixed(3)}
      </div>
    </div>
  );
}

function HorizontalPlaceholder() {
  return (
    <div style={{
      minWidth: '120px',
      maxWidth: '160px',
      width: '140px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem',
      borderRadius: '8px',
      background: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      opacity: 0.3,
      flexShrink: 1,
      boxSizing: 'border-box'
    }}>
      {/* Avatar placeholder */}
      <div style={{
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)'
      }} />

      {/* Content placeholders */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div style={{
          height: '8px',
          width: '60%',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '2px'
        }} />
        <div style={{
          height: '6px',
          width: '40%',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '2px'
        }} />
      </div>

      {/* Amount placeholder */}
      <div style={{
        height: '8px',
        width: '30px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '2px'
      }} />
    </div>
  );
}