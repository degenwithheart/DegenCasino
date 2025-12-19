import React from 'react'
import styled from 'styled-components'
import { useWalletAddress } from 'gamba-react-v2'
import { BPS_PER_WHOLE } from 'gamba-core-v2'
import { TokenValue } from 'gamba-react-ui-v2'
import { useRecentPlays } from '../../../../sections/RecentPlays/useRecentPlays'
import { useColorScheme } from '../../../ColorSchemeContext'

const Container = styled.div`
  width: 100%;
`;

const SessionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  
  .badge {
    background: linear-gradient(135deg, #c81e64, #a259ff);
    color: #fff;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .wallet {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.85rem;
    font-family: 'Courier New', monospace;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, rgba(200, 30, 100, 0.15), rgba(100, 50, 150, 0.08));
  border: 1px solid rgba(200, 100, 200, 0.2);
  border-radius: 14px;
  padding: 16px;
  text-align: center;
  backdrop-filter: blur(8px);
  
  .value {
    font-size: 1.3rem;
    font-weight: 900;
    background: linear-gradient(135deg, #c81e64, #a259ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 6px;
  }
  
  .label {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
  }
`;

const ChartSection = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(200, 100, 200, 0.1);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
`;

const SectionTitle = styled.div`
  font-size: 0.8rem;
  margin-bottom: 12px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &::before {
    content: '';
    width: 3px;
    height: 12px;
    background: linear-gradient(135deg, #c81e64, #a259ff);
    border-radius: 2px;
  }
`;

const ChartContainer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 48px;
`;

const Bar = styled.div<{ $height: number; $win: boolean }>`
  flex: 1;
  height: ${({ $height }) => Math.max($height, 5)}%;
  background: ${({ $win }) => ($win ? 'linear-gradient(180deg, #22c55e, #16a34a)' : 'linear-gradient(180deg, #ef4444, #dc2626)')};
  border-radius: 2px 2px 0 0;
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    opacity: 0.8;
    transform: scaleY(1.1);
  }
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 14px 16px;
  background: linear-gradient(135deg, #c81e64, #a259ff);
  border: none;
  border-radius: 12px;
  color: #fff;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(200, 30, 100, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const SessionWidget = () => {
  const { currentColorScheme } = useColorScheme()
  const wallet = useWalletAddress()
  const [sessionStart, setSessionStart] = React.useState<number | null>(null)
  const plays = useRecentPlays({ limit: 50 })

  const data = React.useMemo(() => {
    if (!sessionStart) return { spent: 0, won: 0, history: [] }
    const sessionPlays = plays.filter(p => p.time >= sessionStart)
    return sessionPlays.reduce((acc, play) => {
      const wager = play.data.wager.toNumber()
      const multiplier = play.data.bet[play.data.resultIndex.toNumber()] / BPS_PER_WHOLE
      const payout = wager * multiplier
      acc.spent += wager
      acc.won += payout
      acc.history.push({ wager, win: payout > 0 })
      return acc
    }, { spent: 0, won: 0, history: [] as any[] })
  }, [plays, sessionStart])

  return (
    <Container>
      <SessionHeader>
        <span className="badge">🎲 Active Session</span>
        <span className="wallet">
          {wallet ? `${wallet.toBase58().slice(0,5)}...${wallet.toBase58().slice(-5)}` : 'Disconnected'}
        </span>
      </SessionHeader>

      <StatsGrid>
        <StatCard>
          <div className="value"><TokenValue amount={data.spent} /></div>
          <div className="label">Total Spent</div>
        </StatCard>
        <StatCard>
          <div className="value"><TokenValue amount={data.won} /></div>
          <div className="label">Total Won</div>
        </StatCard>
      </StatsGrid>

      <ChartSection>
        <SectionTitle>Recent Bet History</SectionTitle>
        <ChartContainer>
          {data.history.slice(-16).map((h, i) => (
            <Bar key={i} $height={(h.wager / 1e9) * 12} $win={h.win} />
          ))}
          {data.history.length === 0 && <div style={{ fontSize: '0.75rem', opacity: 0.5, textAlign: 'center', width: '100%' }}>No bets yet</div>}
        </ChartContainer>
      </ChartSection>

      <ActionButton onClick={() => setSessionStart(Date.now())}>
        {sessionStart ? '🔄 Reset Session' : '▶️ Start Session'}
      </ActionButton>
    </Container>
  )
}

export default SessionWidget
