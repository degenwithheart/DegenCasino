import React from 'react';
import { generateUsernameFromWallet } from '../../../../utils/user/userProfileUtils';
import { useNavigate } from 'react-router-dom';
import { usePageSEO } from '../../../../hooks/ui/useGameSEO';
import { useLeaderboardData } from '../../../../hooks/data/useLeaderboardData';
import { PLATFORM_CREATOR_ADDRESS } from '../../../../constants';
import styled from 'styled-components';

// Special leaderboard entry component
const LeaderboardEntry = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  margin-bottom: 12px;
  border: 1px solid rgba(255, 215, 0, 0.2);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(4px);
  }

  .rank {
    font-size: 1.25rem;
    font-weight: 800;
    color: #ffd700;
    min-width: 50px;
  }

  .player {
    flex: 1;
    margin-left: 16px;

    .name {
      font-weight: 600;
      color: #fff;
      margin-bottom: 4px;
    }

    .address {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.6);
      font-family: monospace;
    }
  }

  .amount {
    font-weight: 700;
    color: #ffd700;
    font-size: 1.125rem;
  }
`;

const ChampionshipBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  border-radius: 20px;
  color: #000;
  font-weight: 700;
  margin-bottom: 24px;
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.3);
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 215, 0, 0.2);
  margin-bottom: 24px;

  h3 {
    color: #ffd700;
    margin-bottom: 16px;
    font-size: 1.25rem;
  }
`;

const ActionRow = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const IconButton = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    min-width: 36px;
    border-radius: 8px;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.12);
    color: rgba(255,255,255,0.9);
    font-size: 1rem;
    cursor: pointer;
    padding: 0;
    transition: all 0.12s ease;

    &:hover {
        background: rgba(255,255,255,0.04);
        border-color: rgba(255,255,255,0.18);
        transform: translateY(-2px);
    }

    &:active { transform: translateY(0); }

    @media (min-width: 768px) {
        width: auto;
        height: auto;
        min-width: 0;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 0.85rem;
        color: rgba(255,255,255,0.8);
    }
`;

const AddressMono = styled.span`
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.6);
    font-family: monospace;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 10ch; /* small on mobile; will expand naturally in desktop */

    @media (min-width: 768px) {
        max-width: 28ch;
    }
`;

export default function LeaderboardPage() {
    const navigate = useNavigate();
    const { data: leaderboardData, loading, error } = useLeaderboardData('alltime', PLATFORM_CREATOR_ADDRESS.toBase58());

    // SEO optimization
    usePageSEO(
        'Leaderboard - DegenHeart Casino',
        'Top players and biggest wins at DegenHeart Casino'
    );

    const handleClose = () => {
        navigate(-1);
    };

    // Process real leaderboard data
    const topPlayers = React.useMemo(() => {
        if (!leaderboardData || leaderboardData.length === 0) {
            return [{ rank: 1, name: 'No players yet', address: 'Be the first!', amount: '0 SOL' }];
        }

        return leaderboardData.slice(0, 10).map((player, index) => ({
            rank: index + 1,
            name: `${generateUsernameFromWallet(player.user)}`,
            address: player.user,
            amount: `${player.sol_volume.toFixed(4)} SOL`
        }));
    }, [leaderboardData]);

    return (
        <>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <ChampionshipBadge>
                    🏆 Championship Season 2024
                </ChampionshipBadge>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '8px' }}>
                    Top players by wagered amount (SOL)
                </p>
            </div>

            <Card>
                <h3>👑 Hall of Champions</h3>
                <div style={{ marginTop: '24px' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255, 255, 255, 0.6)' }}>
                            Loading leaderboard...
                        </div>
                    ) : error ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255, 100, 100, 0.8)' }}>
                            Error loading leaderboard
                        </div>
                    ) : (
                        topPlayers.map((player) => (
                            <LeaderboardEntry key={player.rank}>
                                <div className="rank">#{player.rank}</div>
                                <div className="player">
                                    <div className="name">{player.name}</div>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                                        <ActionRow>
                                            <IconButton
                                                title="View on Solscan"
                                                onClick={() => window.open(`https://solscan.io/account/${player.address}`, '_blank')}
                                            >
                                                🔍
                                            </IconButton>

                                            <IconButton
                                                title="View Player Profile"
                                                onClick={() => navigate(`/explorer/player/${player.address}`)}
                                            >
                                                👤
                                            </IconButton>
                                        </ActionRow>

                                        <AddressMono>
                                            {player.address.slice(0, 8)}...{player.address.slice(-8)}
                                        </AddressMono>
                                    </div>
                                    <div className="amount">{player.amount}</div>
                                </div>
                            </LeaderboardEntry>
                        ))
                    )}
                </div>
            </Card>
        </>
    );
}