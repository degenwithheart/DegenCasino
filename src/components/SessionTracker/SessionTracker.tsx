import React from 'react';
import styled from 'styled-components';
import { useWalletAddress } from 'gamba-react-v2';
import { BPS_PER_WHOLE } from 'gamba-core-v2';
import { TokenValue } from 'gamba-react-ui-v2';
import { useRecentPlays } from '../../sections/RecentPlays/useRecentPlays';
import { useColorScheme } from '../../themes/ColorSchemeContext';

// --- Styled Components (Matching your Unified Design) ---
const TrackerCard = styled.div<{ $colorScheme: any }>`
  background: ${({ $colorScheme }) => $colorScheme?.colors?.surface || '#1a1a1a'};
  border: 1px solid ${({ $colorScheme }) => $colorScheme?.colors?.border || '#333'};
  border-radius: 12px;
  padding: 16px;
  width: 320px;
  font-family: 'JetBrains Mono', monospace;
  color: ${({ $colorScheme }) => $colorScheme?.colors?.text || 'white'};
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  margin-bottom: 12px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding-bottom: 8px;
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 4px 0;
  font-size: 0.9rem;
`;

const ChartContainer = styled.div`
  margin: 16px 0;
  height: 40px;
  display: flex;
  align-items: flex-end;
  gap: 2px;
`;

const Bar = styled.div<{ $height: number; $win: boolean }>`
  flex: 1;
  height: ${({ $height }) => Math.max($height, 5)}%;
  background: ${({ $win }) => ($win ? '#4caf50' : '#ff4444')};
  opacity: 0.8;
  border-radius: 2px 2px 0 0;
`;

const Button = styled.button<{ $primary?: boolean }>`
  background: ${({ $primary }) => ($primary ? '#ff4444' : 'transparent')};
  border: 1px solid #ff4444;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.75rem;
  &:hover { opacity: 0.8; }
`;

// --- Logic ---
export function SessionTracker() {
  const { currentColorScheme } = useColorScheme();
  const userAddress = useWalletAddress();
  const [sessionStart, setSessionStart] = React.useState<number | null>(null);
  
  // Fetch recent plays for the user
  const plays = useRecentPlays({ limit: 50 });

  const sessionData = React.useMemo(() => {
    if (!sessionStart) return { spent: 0, won: 0, history: [] };
    
    // Filter plays that happened after the session started
    const sessionPlays = plays.filter(p => p.time >= sessionStart);
    
    return sessionPlays.reduce((acc, play) => {
      const wager = play.data.wager.toNumber();
      const multiplier = play.data.bet[play.data.resultIndex.toNumber()] / BPS_PER_WHOLE;
      const payout = wager * multiplier;
      
      acc.spent += wager;
      acc.won += payout;
      acc.history.push({ 
        net: payout - wager, 
        win: payout > 0,
        wager
      });
      return acc;
    }, { spent: 0, won: 0, history: [] as any[] });
  }, [plays, sessionStart]);

  const resetSession = () => setSessionStart(Date.now());

  return (
    <TrackerCard $colorScheme={currentColorScheme}>
      <Title>🎲 Session Tracker</Title>
      
      <StatRow>
        <span>Wallet:</span>
        <span style={{opacity: 0.6}}>
          {userAddress ? `${userAddress.toBase58().slice(0, 3)}...${userAddress.toBase58().slice(-3)}` : 'Disconnected'}
        </span>
      </StatRow>

      <div style={{ margin: '12px 0', borderTop: '1px dashed rgba(255,255,255,0.1)' }} />

      <StatRow>
        <span>Total Spent:</span>
        <TokenValue amount={sessionData.spent} />
      </StatRow>
      <StatRow>
        <span>Total Won:</span>
        <TokenValue amount={sessionData.won} />
      </StatRow>

      <div style={{ fontSize: '0.7rem', marginTop: '12px', opacity: 0.5 }}>Bets per Round</div>
      <ChartContainer>
        {sessionData.history.slice(-20).map((h, i) => (
          <Bar key={i} $height={(h.wager / 1e9) * 10} $win={h.win} />
        ))}
        {sessionData.history.length === 0 && <div style={{fontSize: '0.7rem'}}>No bets yet...</div>}
      </ChartContainer>

      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        <Button $primary onClick={resetSession}>
          {sessionStart ? 'Reset Session' : 'Start Session'}
        </Button>
      </div>
    </TrackerCard>
  );
}

export default SessionTracker;
