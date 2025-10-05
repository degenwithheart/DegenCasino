import React from 'react';
import { GambaTransaction, BPS_PER_WHOLE } from 'gamba-core-v2';
import { useTokenMeta } from 'gamba-react-ui-v2';
import { useRecentPlays } from '../../sections/RecentPlays/useRecentPlays';
import { useMediaQuery } from '../../hooks/ui/useMediaQuery';
import { extractMetadata } from '../../utils';

// Import context directly - this component is used in both themes
import { useDegenHeaderModal } from '../../themes/layouts/degenheart/DegenHeartLayout';

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

interface GameRecentPlaysProps {
  gameId: string;
  limit?: number;
  colorScheme: any;
}

export function GameRecentPlays({ gameId, limit = 10, colorScheme }: GameRecentPlaysProps) {
  const events = useRecentPlays({ gameId, limit });
  const allEvents = useRecentPlays({ limit: 20 }); // Get all recent events for debugging
  const md = useMediaQuery('md');
  const { openShareModal } = useDegenHeaderModal();





  // Create array of exactly 'limit' items, filling empty slots with placeholders
  const displayItems: (GambaTransaction<'GameSettled'> | null)[] = [...events];
  while (displayItems.length < limit) {
    displayItems.push(null);
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {displayItems.map((event, index) =>
          event ? (
            <CompactRecentPlay
              key={`${event.signature}-${index}`}
              event={event}
              colorScheme={colorScheme}
              onClick={() => {
                console.log('Compact click handler called with event:', event);
                console.log('openShareModal function:', openShareModal);
                openShareModal(event);
              }}
            />
          ) : (
            <PlaceholderRow
              key={`placeholder-${index}`}
              colorScheme={colorScheme}
              index={index + 1}
            />
          )
        )}
      </div>
    </>
  );
}

function CompactRecentPlay({ event, colorScheme, onClick }: {
  event: GambaTransaction<'GameSettled'>;
  colorScheme: any;
  onClick?: () => void;
}) {
  const data = event.data;
  const token = useTokenMeta(data.tokenMint);

  const multiplier = data.bet[data.resultIndex.toNumber()] / BPS_PER_WHOLE;
  const wager = data.wager.toNumber();
  const payout = multiplier * wager;
  const profit = payout - wager;
  const isWin = payout > wager;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.5rem',
        background: colorScheme?.colors?.surface || 'rgba(255, 255, 255, 0.02)',
        borderRadius: '6px',
        border: `1px solid ${colorScheme?.colors?.border || 'rgba(255, 255, 255, 0.05)'}`,
        fontSize: '0.75rem',
        transition: 'all 0.2s ease',
        cursor: onClick ? 'pointer' : 'default'
      }}
      onClick={onClick}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        flex: 1,
        minWidth: 0
      }}>
        <div style={{
          color: colorScheme?.colors?.textSecondary || 'rgba(255, 255, 255, 0.6)',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.7rem',
          flexShrink: 0
        }}>
          {data.user.toBase58().slice(0, 4)}…
        </div>

        <div style={{
          opacity: 0.4,
          flexShrink: 0
        }}>
          →
        </div>

        <div style={{
          color: isWin ? '#00ff41' : '#dc143c',
          fontWeight: '600',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.7rem',
          textShadow: isWin ? '0 0 4px rgba(0, 255, 65, 0.3)' : '0 0 4px rgba(220, 20, 60, 0.3)',
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {isWin ? '+' : ''}{(profit / 1e9).toFixed(3)} {token.symbol}
        </div>
      </div>

      <div style={{
        fontSize: '0.65rem',
        opacity: 0.5,
        color: colorScheme?.colors?.textSecondary || 'rgba(255, 255, 255, 0.5)',
        flexShrink: 0,
        marginLeft: '0.5rem'
      }}>
        <TimeDiff time={event.time} />
      </div>
    </div>
  );
}

function PlaceholderRow({ colorScheme, index }: { colorScheme: any; index: number; }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.5rem',
      borderRadius: '8px',
      background: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      opacity: 0.3,
      height: '44px' // Match the height of CompactRecentPlay
    }}>
      {/* Avatar placeholder */}
      <div style={{
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }} />

      {/* Content placeholder */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div style={{
          height: '12px',
          width: '60%',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '2px'
        }} />
        <div style={{
          height: '10px',
          width: '40%',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '2px'
        }} />
      </div>

      {/* Amount placeholder */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '2px'
      }}>
        <div style={{
          height: '12px',
          width: '50px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '2px'
        }} />
        <div style={{
          height: '10px',
          width: '30px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '2px'
        }} />
      </div>
    </div>
  );
}