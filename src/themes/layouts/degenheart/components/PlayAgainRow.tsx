import React from 'react';
import { useNavigate } from 'react-router-dom';
// no wallet needed here
import { useColorScheme } from '../../../ColorSchemeContext';
import { useIsCompact } from '../../../../hooks/ui/useIsCompact';
import { useUserStore } from '../../../../hooks/data/useUserStore';
import { GAMES } from '../../../../games';
import { GameCard3D } from '../GameCard3D';
import { useGameStats } from '../../../../hooks/game/useGameStats';
import { Modal } from './Modal';
import type { GameBundle } from '../../../../games/types';
import styled from 'styled-components';

const RowHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
`;

const Controls = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 8px 12px;
  border-radius: 12px;
  background: rgba(255,255,255,0.04);
  color: inherit;
  border: 1px solid rgba(255,255,255,0.06);
  cursor: pointer;
  font-weight: 600;
`;

export const PlayAgainRow: React.FC = () => {
    const { currentColorScheme } = useColorScheme();
    const navigate = useNavigate();
    const { compact } = useIsCompact();
    const { gamesPlayed, clearHistory } = useUserStore();
    const [confirmOpen, setConfirmOpen] = React.useState(false);

    const allGames = GAMES();
    const playedGames = gamesPlayed
        .map((id: string) => allGames.find((g: GameBundle) => g.id === id))
        .filter(Boolean) as GameBundle[];
    const recentPlayed = playedGames.slice(0, 8);

    if (!playedGames.length) return null;

    return (
        <div>
            <RowHeader>
                <h2 style={{ fontSize: compact ? '1.25rem' : '1.5rem', fontWeight: 700, margin: 0 }}>🎮 Play Again</h2>
                <Controls>
                    <ActionButton onClick={() => setConfirmOpen(true)}>Clear history</ActionButton>
                </Controls>
            </RowHeader>

            <div style={{
                display: 'flex',
                gap: '1.5rem',
                overflowX: 'auto',
                padding: '1rem',
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'thin',
                scrollbarColor: 'var(--accent) transparent'
            }}>
                {recentPlayed.map((g: GameBundle) => (
                    <div key={g.id} style={{
                        minWidth: compact ? '280px' : '320px',
                        maxWidth: compact ? '280px' : '320px',
                        width: compact ? '280px' : '320px',
                        flexShrink: 0,
                        scrollSnapAlign: 'start'
                    }}>
                        <PlayedGameCard game={g} />
                    </div>
                ))}
            </div>
            {confirmOpen && (
                <Modal onClose={() => setConfirmOpen(false)} isOpen={confirmOpen}>
                    <div style={{ padding: 20, maxWidth: 560 }}>
                        <h3 style={{ marginTop: 0 }}>Clear play history?</h3>
                        <p>This will remove your local "Play Again" history. This action cannot be undone.</p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
                            <ActionButton onClick={() => setConfirmOpen(false)}>Cancel</ActionButton>
                            <ActionButton onClick={() => { clearHistory(); setConfirmOpen(false); }}>Clear</ActionButton>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default PlayAgainRow;

function PlayedGameCard({ game }: { game: GameBundle; }) {
    const { stats } = useGameStats(game.id);
    return <GameCard3D game={game} statsVariant="played" playedStats={stats} />;
}

// ConfirmModal removed - using shared Modal component instead
