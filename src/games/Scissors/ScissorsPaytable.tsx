import React, { forwardRef, useImperativeHandle } from 'react';
import { GambaUi, TokenValue, useCurrentToken } from 'gamba-react-ui-v2';
import { PlayerChoice, PaytableGameData } from './types';
import { CHOICE_EMOJI, GAME_MODES, GAME_QUOTES } from './constants';

interface ScissorsPaytableProps {
  wager: number;
  selectedChoice: PlayerChoice;
}

export interface ScissorsPaytableRef {
  trackGame: (data: PaytableGameData) => void;
}

const ScissorsPaytable = forwardRef<ScissorsPaytableRef, ScissorsPaytableProps>(
  ({ wager, selectedChoice }, ref) => {
    const token = useCurrentToken();
    const [recentGames, setRecentGames] = React.useState<PaytableGameData[]>([]);
    const [stats, setStats] = React.useState({
      totalGames: 0,
      wins: 0,
      ties: 0,
      losses: 0,
      totalWagered: 0,
      totalWon: 0,
      biggestWin: 0,
    });

    useImperativeHandle(ref, () => ({
      trackGame: (data: PaytableGameData) => {
        setRecentGames(prev => [data, ...prev.slice(0, 9)]); // Keep last 10 games
        
        setStats(prev => ({
          totalGames: prev.totalGames + 1,
          wins: prev.wins + (data.result === 'win' ? 1 : 0),
          ties: prev.ties + (data.result === 'tie' ? 1 : 0),
          losses: prev.losses + (data.result === 'lose' ? 1 : 0),
          totalWagered: prev.totalWagered + data.wager,
          totalWon: prev.totalWon + data.payout,
          biggestWin: Math.max(prev.biggestWin, data.payout - data.wager),
        }));
      },
    }));

    const currentMode = GAME_MODES.standard;
    const winAmount = wager * currentMode.winMultiplier;
    const tieAmount = wager * currentMode.tieMultiplier;

    return (
      <div style={{ 
        width: '320px',
        background: 'rgba(0, 0, 0, 0.8)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'linear-gradient(135deg, rgba(252, 211, 77, 0.1), rgba(245, 158, 11, 0.1))'
        }}>
          <h3 style={{ 
            color: '#FCD34D', 
            margin: 0, 
            fontSize: '16px', 
            fontWeight: 700,
            textAlign: 'center'
          }}>
            🪨📄✂️ ROCK PAPER SCISSORS
          </h3>
        </div>

        {/* Current Selection & Payouts */}
        <div style={{ padding: '16px' }}>
          <div style={{
            background: 'rgba(252, 211, 77, 0.1)',
            borderRadius: '12px',
            padding: '12px',
            marginBottom: '16px',
            border: '1px solid rgba(252, 211, 77, 0.2)'
          }}>
            <div style={{ 
              color: '#FCD34D', 
              fontSize: '14px', 
              fontWeight: 600, 
              marginBottom: '8px',
              textAlign: 'center'
            }}>
              YOUR CHOICE: {CHOICE_EMOJI[selectedChoice]} {selectedChoice.toUpperCase()}
            </div>
            
            {/* Payout Table */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                color: '#22C55E',
                fontSize: '12px',
                fontWeight: 600
              }}>
                <span>🎉 WIN:</span>
                <span>
                  <TokenValue amount={winAmount} />
                  <span style={{ color: '#9CA3AF', marginLeft: '4px' }}>
                    ({currentMode.winMultiplier}x)
                  </span>
                </span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                color: '#9CA3AF',
                fontSize: '12px',
                fontWeight: 600
              }}>
                <span>🤝 TIE:</span>
                <span>
                  <TokenValue amount={tieAmount} />
                  <span style={{ color: '#9CA3AF', marginLeft: '4px' }}>
                    ({currentMode.tieMultiplier}x)
                  </span>
                </span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                color: '#EF4444',
                fontSize: '12px',
                fontWeight: 600
              }}>
                <span>💀 LOSE:</span>
                <span>
                  <TokenValue amount={0} />
                  <span style={{ color: '#9CA3AF', marginLeft: '4px' }}>
                    (0x)
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Game Rules */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '16px'
          }}>
            <div style={{ 
              color: '#9CA3AF', 
              fontSize: '12px', 
              fontWeight: 600, 
              marginBottom: '8px'
            }}>
              RULES:
            </div>
            <div style={{ color: '#9CA3AF', fontSize: '11px', lineHeight: '1.4' }}>
              🪨 Rock crushes ✂️ Scissors<br/>
              📄 Paper covers 🪨 Rock<br/>
              ✂️ Scissors cut 📄 Paper
            </div>
            <div style={{ 
              color: '#FCD34D', 
              fontSize: '10px', 
              fontStyle: 'italic',
              marginTop: '8px',
              textAlign: 'center'
            }}>
              "{GAME_QUOTES[Math.floor(Math.random() * GAME_QUOTES.length)]}"
            </div>
          </div>

          {/* Session Stats */}
          {stats.totalGames > 0 && (
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '16px'
            }}>
              <div style={{ 
                color: '#9CA3AF', 
                fontSize: '12px', 
                fontWeight: 600, 
                marginBottom: '8px'
              }}>
                SESSION STATS:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '11px' }}>
                <div style={{ color: '#22C55E' }}>
                  Wins: {stats.wins} ({((stats.wins / stats.totalGames) * 100).toFixed(1)}%)
                </div>
                <div style={{ color: '#9CA3AF' }}>
                  Ties: {stats.ties} ({((stats.ties / stats.totalGames) * 100).toFixed(1)}%)
                </div>
                <div style={{ color: '#EF4444' }}>
                  Losses: {stats.losses} ({((stats.losses / stats.totalGames) * 100).toFixed(1)}%)
                </div>
                <div style={{ color: '#FCD34D' }}>
                  Total: {stats.totalGames}
                </div>
              </div>
              {stats.biggestWin > 0 && (
                <div style={{ 
                  marginTop: '8px', 
                  color: '#22C55E', 
                  fontSize: '11px',
                  fontWeight: 600 
                }}>
                  Biggest Win: <TokenValue amount={stats.biggestWin} />
                </div>
              )}
            </div>
          )}

          {/* Recent Games */}
          {recentGames.length > 0 && (
            <div>
              <div style={{ 
                color: '#9CA3AF', 
                fontSize: '12px', 
                fontWeight: 600, 
                marginBottom: '8px'
              }}>
                RECENT GAMES:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {recentGames.slice(0, 5).map((game, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      background: game.result === 'win' 
                        ? 'rgba(34, 197, 94, 0.1)' 
                        : game.result === 'lose'
                        ? 'rgba(239, 68, 68, 0.1)'
                        : 'rgba(156, 163, 175, 0.1)',
                      border: `1px solid ${
                        game.result === 'win' 
                          ? 'rgba(34, 197, 94, 0.2)' 
                          : game.result === 'lose'
                          ? 'rgba(239, 68, 68, 0.2)'
                          : 'rgba(156, 163, 175, 0.2)'
                      }`
                    }}
                  >
                    <div style={{ fontSize: '11px', color: '#9CA3AF' }}>
                      {CHOICE_EMOJI[game.playerChoice]} vs {CHOICE_EMOJI[game.computerChoice]}
                    </div>
                    <div style={{ 
                      fontSize: '11px', 
                      fontWeight: 600,
                      color: game.result === 'win' ? '#22C55E' : game.result === 'lose' ? '#EF4444' : '#9CA3AF'
                    }}>
                      {game.result === 'win' ? '+' : game.result === 'lose' ? '-' : '='}{' '}
                      <TokenValue amount={Math.abs(game.payout - game.wager)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

ScissorsPaytable.displayName = 'ScissorsPaytable';

export default ScissorsPaytable;