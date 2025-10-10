import React from 'react';
import { generateUsernameFromWallet } from '../../utils/user/userProfileUtils';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PublicKey } from '@solana/web3.js';
import styled from 'styled-components';
import { TokenValue, useTokenMeta } from 'gamba-react-ui-v2';
import { GambaTransaction } from 'gamba-core-v2';
import { BPS_PER_WHOLE } from 'gamba-core-v2';
import { PLATFORM_CREATOR_ADDRESS } from '../../constants';
import { useColorScheme } from '../../themes/ColorSchemeContext';
import { ExplorerHeader } from '../Explorer/ExplorerHeader';
import {
  UnifiedPageContainer,
  UnifiedPageTitle,
  UnifiedSection,
  UnifiedSectionTitle,
  UnifiedContent,
  UnifiedGrid
} from '../UI/UnifiedDesign';

interface PlayerResponse {
  volume: number;
  profit: number;
  plays: number;
  wins: number;
}

const PlayerContainer = styled.div<{ $colorScheme?: any; }>`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  color: ${({ $colorScheme }) => $colorScheme?.colors?.text || 'white'};
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
`;

const StatCard = styled.div`
  text-align: center;
`;

const StatValue = styled.div<{ $colorScheme?: any; }>`
  font-size: 32px;
  font-weight: bold;
  color: ${({ $colorScheme }) => $colorScheme?.colors?.text || 'white'};
  margin-bottom: 4px;
`;

const StatLabel = styled.div<{ $colorScheme?: any; }>`
  font-size: 14px;
  color: ${({ $colorScheme }) => $colorScheme?.colors?.textSecondary || '#888'};
`;

const PlayerSection = styled.div<{ $colorScheme?: any; }>`
  background: ${({ $colorScheme }) => $colorScheme?.colors?.surface || 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${({ $colorScheme }) => $colorScheme?.colors?.border || 'rgba(255, 255, 255, 0.1)'};
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
`;

const PlayerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
`;

const PlayerAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;

const PlayerName = styled.h2<{ $colorScheme?: any; }>`
  margin: 0;
  color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ff6666'};
  font-family: monospace;
  font-size: 18px;
  font-weight: 500;
`;

const AddressSection = styled.div`
  margin-bottom: 20px;
`;

const AddressLabel = styled.div<{ $colorScheme?: any; }>`
  color: ${({ $colorScheme }) => $colorScheme?.colors?.textSecondary || '#888'};
  font-size: 14px;
  margin-bottom: 8px;
`;

const AddressValue = styled.div<{ $colorScheme?: any; }>`
  color: ${({ $colorScheme }) => $colorScheme?.colors?.text || 'white'};
  font-family: monospace;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CopyButton = styled.button<{ $colorScheme?: any; }>`
  background: none;
  border: 1px solid ${({ $colorScheme }) => $colorScheme?.colors?.border || 'rgba(255, 255, 255, 0.2)'};
  color: ${({ $colorScheme }) => $colorScheme?.colors?.textSecondary || '#888'};
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  
  &:hover {
    background: ${({ $colorScheme }) => $colorScheme?.colors?.surface || 'rgba(255, 255, 255, 0.05)'};
  }
`;

const RecentPlaysSection = styled.div<{ $colorScheme?: any; }>`
  background: ${({ $colorScheme }) => $colorScheme?.colors?.surface || 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${({ $colorScheme }) => $colorScheme?.colors?.border || 'rgba(255, 255, 255, 0.1)'};
  border-radius: 12px;
  padding: 24px;
`;

const SectionTitle = styled.h3<{ $colorScheme?: any; }>`
  margin: 0 0 20px 0;
  color: ${({ $colorScheme }) => $colorScheme?.colors?.text || 'white'};
  font-size: 18px;
  font-weight: 500;
`;

const PlaysTable = styled.div`
  width: 100%;
`;

const TableHeader = styled.div<{ $colorScheme?: any; }>`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid ${({ $colorScheme }) => $colorScheme?.colors?.border || 'rgba(255, 255, 255, 0.1)'};
  font-size: 14px;
  color: ${({ $colorScheme }) => $colorScheme?.colors?.textSecondary || '#888'};
  font-weight: 500;
`;

const TableRow = styled.div<{ $colorScheme?: any; }>`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid ${({ $colorScheme }) => $colorScheme?.colors?.border || 'rgba(255, 255, 255, 0.05)'};
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: ${({ $colorScheme }) => $colorScheme?.colors?.surface || 'rgba(255, 255, 255, 0.02)'};
  }
`;

const PlatformCell = styled.div<{ $colorScheme?: any; }>`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ff6666'};
  font-size: 14px;
`;

const PlayerCell = styled.div<{ $colorScheme?: any; }>`
  color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ff6666'};
  font-family: monospace;
  font-size: 14px;
`;

const TokenCell = styled.div<{ $colorScheme?: any; }>`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${({ $colorScheme }) => $colorScheme?.colors?.text || 'white'};
  font-size: 14px;
`;

const TokenIcon = styled.img`
  width: 16px;
  height: 16px;
  border-radius: 50%;
`;

const PayoutCell = styled.div<{ $isWin: boolean; $colorScheme?: any; }>`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${props => props.$isWin ? (props.$colorScheme?.colors?.success || '#4ade80') : (props.$colorScheme?.colors?.text || 'white')};
  font-size: 14px;
`;

const MultiplierBadge = styled.span<{ $isWin: boolean; $colorScheme?: any; }>`
  background: ${props => props.$isWin ? 'rgba(74, 222, 128, 0.2)' : (props.$colorScheme?.colors?.surface || 'rgba(255, 255, 255, 0.1)')};
  color: ${props => props.$isWin ? (props.$colorScheme?.colors?.success || '#4ade80') : (props.$colorScheme?.colors?.textSecondary || '#888')};
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
`;

const TimeCell = styled.div<{ $colorScheme?: any; }>`
  color: ${({ $colorScheme }) => $colorScheme?.colors?.textSecondary || '#888'};
  font-size: 14px;
`;

const LoadMoreButton = styled.button<{ $colorScheme?: any; }>`
  width: 100%;
  padding: 12px;
  margin-top: 16px;
  background: ${({ $colorScheme }) => $colorScheme?.colors?.surface || 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${({ $colorScheme }) => $colorScheme?.colors?.border || 'rgba(255, 255, 255, 0.1)'};
  border-radius: 8px;
  color: ${({ $colorScheme }) => $colorScheme?.colors?.text || 'white'};
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background: ${({ $colorScheme }) => $colorScheme?.colors?.surface || 'rgba(255, 255, 255, 0.1)'};
  }
`;

const EmptyState = styled.div<{ $colorScheme?: any; }>`
  text-align: center;
  padding: 40px 20px;
  color: ${({ $colorScheme }) => $colorScheme?.colors?.textSecondary || '#666'};
  font-size: 14px;
`;

function TimeDiff({ time }: { time: number; }) {
  const diff = Date.now() - time;
  const sec = Math.floor(diff / 1000);
  const min = Math.floor(sec / 60);
  const hrs = Math.floor(min / 60);
  const days = Math.floor(hrs / 24);

  if (days >= 1) return <span>{days}d ago</span>;
  if (hrs >= 1) return <span>{hrs}h ago</span>;
  if (min >= 1) return <span>{min}m ago</span>;
  return <span>Just now</span>;
}

function PlayerPlayRow({ play, colorScheme }: { play: any; colorScheme?: any; }) {
  const navigate = useNavigate();

  // Create PublicKey objects for proper component usage
  const tokenMint = React.useMemo(() => {
    try {
      return new PublicKey(play.token);
    } catch {
      return PublicKey.default;
    }
  }, [play.token]);

  const token = useTokenMeta(tokenMint);
  const wager = play.wager || 0;
  const payout = play.payout || 0;
  const isWin = payout > wager;
  const multiplier = play.multiplier || (payout > 0 ? payout / wager : 0);

  const handleClick = () => {
    if (play.signature) {
      navigate(`/explorer/transaction/${play.signature}?user=${play.user}`);
    }
  };

  return (
    <TableRow $colorScheme={colorScheme} onClick={handleClick}>
      <PlatformCell $colorScheme={colorScheme}>
        🎰 DegenCasino
      </PlatformCell>
      <PlayerCell $colorScheme={colorScheme} title={play.user}>
        {generateUsernameFromWallet(play.user)} — {play.user.slice(-4)}
      </PlayerCell>
      <TokenCell $colorScheme={colorScheme}>
        <TokenIcon src={token.image} alt={token.symbol} />
        <TokenValue amount={wager} mint={tokenMint} />
      </TokenCell>
      <PayoutCell $colorScheme={colorScheme} $isWin={isWin}>
        <TokenIcon src={token.image} alt={token.symbol} />
        <TokenValue amount={payout} mint={tokenMint} />
        {isWin && <MultiplierBadge $isWin={isWin}>{multiplier.toFixed(2)}x</MultiplierBadge>}
      </PayoutCell>
      <TimeCell>
        <TimeDiff time={play.time || Date.now()} />
      </TimeCell>
    </TableRow>
  );
}

export function PlayerView() {
  const { currentColorScheme } = useColorScheme();
  const { address } = useParams<{ address: string; }>();
  const [playerData, setPlayerData] = React.useState<PlayerResponse | null>(null);
  const [recentPlays, setRecentPlays] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (address) {
      const fetchData = async () => {
        try {
          setLoading(true);

          // Fetch player data
          const playerResponse = await fetch(`https://api.gamba.so/player?user=${address}`);
          if (playerResponse.ok) {
            const data = await playerResponse.json();
            setPlayerData({
              volume: data.usd_volume || 0,
              profit: data.usd_profit || 0,
              plays: data.games_played || 0,
              wins: data.games_won || 0
            });
          } else {
            const errorText = await playerResponse.text();
            console.warn('Player not found or API error:', playerResponse.status, errorText);
            setPlayerData(null);
          }

          // Fetch recent plays for this player
          const playsResponse = await fetch(`https://api.gamba.so/events/settledGames?user=${address}&itemsPerPage=10&page=0`);
          if (playsResponse.ok) {
            const playsData = await playsResponse.json();

            // Use the platform creator address for filtering
            const creator = PLATFORM_CREATOR_ADDRESS.toBase58();

            // Filter to only include plays where creator matches exactly
            const filteredPlays = (playsData.results || []).filter((play: any) => play.creator === creator);

            // Transform the API data to match our display format
            const transformedPlays = filteredPlays.map((play: any) => {
              const wager = parseFloat(play.wager) || 0;
              const payout = parseFloat(play.payout) || 0;
              const multiplier = play.multiplier || 0;

              return {
                signature: play.signature,
                user: play.user,
                creator: play.creator,
                token: play.token,
                wager,
                payout,
                time: play.time,
                multiplier
              };
            });

            setRecentPlays(transformedPlays);
          } else {
            const errorText = await playsResponse.text();
            console.warn('Failed to fetch recent plays:', playsResponse.status, errorText);
          }
        } catch (err) {
          console.error('Failed to fetch player data:', err);
          setPlayerData(null);
          setError('Failed to load player data');
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [address]);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
    }
  };

  if (!address) {
    return <div>No player address provided</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Use API data for plays and wins, fallback to empty arrays if no data
  const volume = playerData?.volume || 0;
  const profit = playerData?.profit || 0;
  const plays = playerData?.plays || 0;
  const wins = playerData?.wins || 0;

  return (
    <UnifiedPageContainer $colorScheme={currentColorScheme}>
      <ExplorerHeader />

      <UnifiedContent $colorScheme={currentColorScheme}>
        <StatsRow>
          <StatCard>
            <StatValue $colorScheme={currentColorScheme}>${volume.toFixed(2)}</StatValue>
            <StatLabel $colorScheme={currentColorScheme}>Volume</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue $colorScheme={currentColorScheme}>${profit.toFixed(2)}</StatValue>
            <StatLabel $colorScheme={currentColorScheme}>Profit</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue $colorScheme={currentColorScheme}>{plays}</StatValue>
            <StatLabel $colorScheme={currentColorScheme}>Plays</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue $colorScheme={currentColorScheme}>{wins}</StatValue>
            <StatLabel $colorScheme={currentColorScheme}>Wins</StatLabel>
          </StatCard>
        </StatsRow>

        <PlayerSection $colorScheme={currentColorScheme}>
          <PlayerHeader>
            <PlayerAvatar>🎮</PlayerAvatar>
            <PlayerName $colorScheme={currentColorScheme}>{address ? `${address.slice(0, 6)}...${address.slice(-6)}` : 'Unknown Player'}</PlayerName>
          </PlayerHeader>

          <AddressSection>
            <AddressLabel $colorScheme={currentColorScheme}>Address:</AddressLabel>
            <AddressValue $colorScheme={currentColorScheme}>
              {address}
              <CopyButton $colorScheme={currentColorScheme} onClick={copyAddress}>Copy</CopyButton>
            </AddressValue>
          </AddressSection>
        </PlayerSection>

        <RecentPlaysSection $colorScheme={currentColorScheme}>
          <SectionTitle $colorScheme={currentColorScheme}>Recent Plays</SectionTitle>

          {recentPlays.slice(0, 10).length > 0 ? (
            <PlaysTable>
              <TableHeader $colorScheme={currentColorScheme}>
                <div>Platform</div>
                <div>Player</div>
                <div>Wager</div>
                <div>Payout</div>
                <div>Time</div>
              </TableHeader>
              {recentPlays.slice(0, 10).map((play, index) => (
                <PlayerPlayRow key={play.signature || index} play={play} colorScheme={currentColorScheme} />
              ))}
            </PlaysTable>
          ) : loading ? (
            <div style={{ padding: '20px', textAlign: 'center', color: currentColorScheme?.colors?.textSecondary || '#666' }}>
              Loading recent plays...
            </div>
          ) : (
            <EmptyState>No recent plays found</EmptyState>
          )}
        </RecentPlaysSection>
      </UnifiedContent>
    </UnifiedPageContainer>
  );
}
