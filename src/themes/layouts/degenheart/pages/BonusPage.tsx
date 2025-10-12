import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageSEO } from '../../../../hooks/ui/useGameSEO';
import { useUserBalance, TokenValue } from 'gamba-react-ui-v2';
import { useWallet } from '@solana/wallet-adapter-react';
import styled, { keyframes } from 'styled-components';

// Custom bonus components - no default theme dependencies
const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(138, 43, 226, 0.3); }
  50% { box-shadow: 0 0 30px rgba(138, 43, 226, 0.6); }
`;

const FreePlayCard = styled.div`
  background: linear-gradient(135deg, rgba(138, 43, 226, 0.15), rgba(75, 0, 130, 0.1));
  border: 2px solid rgba(138, 43, 226, 0.3);
  border-radius: 20px;
  padding: 24px;
  text-align: center;
  margin-bottom: 24px;
  animation: ${glow} 3s infinite;

  .badge {
    background: linear-gradient(135deg, #8a2be2, #9370db);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-weight: 700;
    font-size: 0.9rem;
    display: inline-block;
    margin-bottom: 16px;
  }

  .amount {
    font-size: 3rem;
    font-weight: 900;
    background: linear-gradient(135deg, #8a2be2, #9370db);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 8px;
  }

  .label {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.1rem;
  }
`;

const BonusFeature = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  margin-bottom: 12px;
  border: 1px solid rgba(138, 43, 226, 0.1);

  .icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #8a2be2, #9370db);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    flex-shrink: 0;
  }

  .content {
    flex: 1;

    .title {
      color: #9370db;
      font-weight: 600;
      margin-bottom: 4px;
    }

    .description {
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.9rem;
      line-height: 1.4;
    }
  }
`;

const BonusStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin: 24px 0;

  .stat {
    background: rgba(138, 43, 226, 0.1);
    border-radius: 12px;
    padding: 16px;
    text-align: center;
    border: 1px solid rgba(138, 43, 226, 0.2);

    .value {
      font-size: 1.5rem;
      font-weight: 800;
      color: #9370db;
      margin-bottom: 4px;
    }

    .label {
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.85rem;
    }
  }
`;

const ClaimButton = styled.button`
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #8a2be2, #9370db);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 24px;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(138, 43, 226, 0.4);
  }
`;

export default function BonusPage() {
    const navigate = useNavigate();
    const balance = useUserBalance();
    const { connected } = useWallet();

    // SEO optimization
    usePageSEO(
        'Bonus Rewards - DegenHeart Casino',
        'Claim your bonus rewards and free spins at DegenHeart Casino'
    );

    const handleClose = () => {
        navigate(-1);
    };

    const bonusFeatures = [
        {
            icon: '⚡',
            title: 'Instant Activation',
            description: 'Bonus applies automatically when you play'
        },
        {
            icon: '💎',
            title: 'No Expiration',
            description: 'Your bonus funds never expire'
        },
        {
            icon: '🎮',
            title: 'Universal Usage',
            description: 'Use on any game in the casino'
        },
        {
            icon: '🚀',
            title: 'Low Fees',
            description: 'Small network fee for transactions'
        }
    ];

    return (
        <>
            <FreePlayCard>
                <div className="badge">🎮 FREE PLAY AVAILABLE</div>
                <div className="amount">
                    {connected ? (
                        <TokenValue amount={balance.bonusBalance} />
                    ) : (
                        'Connect to view'
                    )}
                </div>
                <div className="label">Free Play Balance</div>
            </FreePlayCard>

            <BonusStats>
                <div className="stat">
                    <div className="value">
                        {connected ? (
                            <TokenValue amount={balance.bonusBalance} />
                        ) : (
                            '0'
                        )}
                    </div>
                    <div className="label">Current Bonus</div>
                </div>
                <div className="stat">
                    <div className="value">Auto</div>
                    <div className="label">Application</div>
                </div>
            </BonusStats>

            <div>
                {bonusFeatures.map((feature, index) => (
                    <BonusFeature key={index}>
                        <div className="icon">{feature.icon}</div>
                        <div className="content">
                            <div className="title">{feature.title}</div>
                            <div className="description">{feature.description}</div>
                        </div>
                    </BonusFeature>
                ))}
            </div>

            <ClaimButton onClick={() => navigate('/')}>
                🎁 Start Playing with Bonus
            </ClaimButton>
        </>
    );
}