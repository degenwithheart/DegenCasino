import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { useMultiplayer } from 'gamba-react-v2';
import { useCurrentToken, GambaUi, FAKE_TOKEN_MINT } from 'gamba-react-ui-v2';

const glowPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1);
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.2);
  }
`

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
`

const Backdrop = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled(motion.div)`
  background: linear-gradient(135deg, rgba(24, 24, 24, 0.95) 0%, rgba(40, 40, 40, 0.95) 100%);
  padding: 32px;
  border-radius: 20px;
  width: 92%;
  max-width: 480px;
  color: #fff;
  border: 1px solid rgba(255, 215, 0, 0.3);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: ${glowPulse} 3s ease-in-out infinite;
`;

const Title = styled.h2`
  margin: 0 0 24px;
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ffd700 0%, #a259ff 50%, #ff9500 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
`;

const Field = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 1rem;
  margin-bottom: 8px;
  color: #ffd700;
  font-weight: 600;
`;

const ToggleGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const ToggleButton = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 12px 16px;
  border: 2px solid ${({ active }) => (active ? '#ffd700' : 'rgba(255, 255, 255, 0.2)')};
  border-radius: 12px;
  background: ${({ active }) => (active ? 'rgba(255, 215, 0, 0.1)' : 'rgba(40, 40, 40, 0.8)')};
  color: ${({ active }) => (active ? '#ffd700' : '#fff')};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 215, 0, 0.2);
    border-color: #ffd700;
  }
`;

const Input = styled.input`
  box-sizing: border-box;
  width: 100%;
  padding: 14px 16px;
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  background: rgba(40, 40, 40, 0.8);
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;
  outline: none;

  &:focus {
    border-color: #ffd700;
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
    background: rgba(50, 50, 50, 0.9);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const PresetGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`;

const PresetButton = styled.button`
  flex: 1;
  padding: 10px 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(30, 30, 30, 0.8);
  color: #fff;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 215, 0, 0.1);
    border-color: rgba(255, 215, 0, 0.5);
    transform: translateY(-1px);
  }
`;

const RangeRow = styled.div`
  display: flex;
  gap: 16px;
`;

const HalfField = styled(Field)`
  flex: 1;
  margin-bottom: 0;
`;

const Warning = styled.p`
  font-size: 0.9rem;
  color: #ffc107;
  margin: 16px 0 0;
  line-height: 1.4;
  background: rgba(255, 193, 7, 0.1);
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid rgba(255, 193, 7, 0.3);
  animation: ${float} 2s ease-in-out infinite;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

const StyledButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
          color: #fff;
          box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
          }
        `
      case 'secondary':
        return `
          background: linear-gradient(135deg, #666 0%, #888 100%);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          &:hover {
            background: linear-gradient(135deg, #888 0%, #aaa 100%);
            transform: translateY(-2px);
          }
        `
      default:
        return `
          background: linear-gradient(135deg, #ffd700 0%, #ffb300 100%);
          color: #000;
          box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
          }
        `
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  margin: 12px 0 0;
  text-align: center;
  font-size: 0.95rem;
  background: rgba(231, 76, 60, 0.1);
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid rgba(231, 76, 60, 0.3);
`;

export default function CreateGameModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { publicKey } = useWallet();
  const { createGame } = useMultiplayer();
  const token = useCurrentToken();
  const isFreeToken = token.mint.equals(FAKE_TOKEN_MINT);

  const [maxPlayers, setMaxPlayers] = useState(10);
  const [wagerType, setWagerType] = useState<
    'sameWager' | 'customWager' | 'betRange'
  >('sameWager');
  const [fixedWager, setFixedWager] = useState<number>(1);
  const [minBet, setMinBet] = useState<number>(0.1);
  const [maxBet, setMaxBet] = useState<number>(5);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!publicKey) return setError('Connect wallet first');
    if (isFreeToken) return setError('Multiplayer games require real tokens. Please select a live token.');
    setSubmitting(true);
    setError(null);

    const softDuration = 60;
    const preAlloc = Math.min(maxPlayers, 5);
    const winnersTarget = 1;

    const opts: any = {
      mint: token.mint,
      creatorAddress: publicKey,
      maxPlayers,
      softDuration,
      preAllocPlayers: preAlloc,
      winnersTarget,
      wagerType: ['sameWager', 'customWager', 'betRange'].indexOf(
        wagerType
      ),
      payoutType: 0,
    };

    if (wagerType === 'sameWager') {
      const lam = Math.floor(fixedWager * token.baseWager);
      opts.wager = lam;
      opts.minBet = lam;
      opts.maxBet = lam;
    } else if (wagerType === 'customWager') {
      opts.wager = 0;
      opts.minBet = 0;
      opts.maxBet = 0;
    } else {
      const minLam = Math.floor(minBet * token.baseWager);
      const maxLam = Math.floor(maxBet * token.baseWager);
      opts.wager = minLam;
      opts.minBet = minLam;
      opts.maxBet = maxLam;
    }

    try {
      await createGame(opts);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create game');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <GambaUi.Portal target="screen">
      <AnimatePresence>
        {isOpen && (
          <Backdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Modal
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
            <Title>🎯 Create Plinko Race</Title>

            <Field>
              <Label>Max Players</Label>
              <Input
                type="number"
                min={2}
                max={1000}
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(Number(e.target.value))}
              />
            </Field>

            <Field>
              <Label>Wager Type</Label>
              <ToggleGroup>
                <ToggleButton
                  active={wagerType === 'sameWager'}
                  onClick={() => setWagerType('sameWager')}
                >
                  Same
                </ToggleButton>
                <ToggleButton
                  active={wagerType === 'betRange'}
                  onClick={() => setWagerType('betRange')}
                >
                  Range
                </ToggleButton>
                <ToggleButton
                  active={wagerType === 'customWager'}
                  onClick={() => setWagerType('customWager')}
                >
                  Unlimited
                </ToggleButton>
              </ToggleGroup>
            </Field>

            {wagerType === 'sameWager' && (
              <Field>
                <Label>Wager ({token.symbol})</Label>
                <Input
                  type="number"
                  lang="en-US"
                  inputMode="decimal"
                  min={0.05}
                  step={0.01}
                  value={fixedWager}
                  onChange={(e) =>
                    setFixedWager(Number(e.target.value))
                  }
                />
                <PresetGroup>
                  {[0.1, 0.5, 1].map((v) => (
                    <PresetButton
                      key={v}
                      onClick={() => setFixedWager(v)}
                    >
                      {v} {token.symbol}
                    </PresetButton>
                  ))}
                </PresetGroup>
              </Field>
            )}

            {wagerType === 'betRange' && (
              <RangeRow>
                <HalfField>
                  <Label>Min Bet ({token.symbol})</Label>
                  <Input
                    type="number"
                    min={0.01}
                    step={0.01}
                    value={minBet}
                    onChange={(e) =>
                      setMinBet(Number(e.target.value))
                    }
                  />
                </HalfField>
                <HalfField>
                  <Label>Max Bet ({token.symbol})</Label>
                  <Input
                    type="number"
                    min={minBet}
                    step={0.01}
                    value={maxBet}
                    onChange={(e) =>
                      setMaxBet(Number(e.target.value))
                    }
                  />
                </HalfField>
              </RangeRow>
            )}

            {/* rent-explanation warning */}
            <Warning>
              ⚠️Creating a game requires paying refundable
              “rent” to cover on-chain storage. You’ll get it back
              automatically once the game ends.
            </Warning>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <ButtonRow>
              <StyledButton variant="secondary" onClick={onClose} disabled={submitting}>
                Cancel
              </StyledButton>
              <StyledButton
                variant="primary"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? '🎯 Creating…' : '🎯 Create Game'}
              </StyledButton>
            </ButtonRow>
            </Modal>
          </Backdrop>
        )}
      </AnimatePresence>
    </GambaUi.Portal>
  );
}
