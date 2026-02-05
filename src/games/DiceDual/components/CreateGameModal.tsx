import React, { useState, useMemo } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { useWallet } from '@solana/wallet-adapter-react'
import { useMultiplayer, useGambaProvider } from 'gamba-react-v2'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { GambaUi } from 'gamba-react-ui-v2'
import { BN } from '@coral-xyz/anchor'
import { createGameIx, deriveGamePdaFromSeed } from '@gamba-labs/multiplayer-sdk'
import { BPS_PER_WHOLE } from 'gamba-core-v2'
import { PLATFORM_CREATOR_ADDRESS, MULTIPLAYER_FEE } from '../../../constants'
import {
  DEFAULT_DICE_COUNT,
  MIN_DICE_COUNT,
  MAX_DICE_COUNT,
  SOFT_DURATION,
  HARD_DURATION,
} from '../config'
import { PredictionType } from '../types'
import { getMinRoll, getMaxRoll, getDefaultTarget, calculateOdds } from '../utils'

const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`

const Modal = styled(motion.div)`
  background: linear-gradient(180deg, #1e1e2e 0%, #16161e 100%);
  padding: 28px;
  border-radius: 16px;
  width: 100%;
  max-width: 480px;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
  max-height: 90vh;
  overflow-y: auto;
`

const Title = styled.h2`
  margin: 0 0 24px;
  font-size: 1.6rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const Field = styled.div`
  margin-bottom: 20px;
`

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  margin-bottom: 8px;
  color: #aaa;
  font-weight: 500;
`

const Input = styled.input`
  box-sizing: border-box;
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #333;
  border-radius: 8px;
  background: #222;
  color: #fff;
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const Slider = styled.input`
  width: 100%;
  margin-top: 8px;
  accent-color: #667eea;
`

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`

const Button = styled.button<{ $variant?: 'primary' }>`
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  font-size: 0.95rem;
  
  background: ${({ $variant }) =>
    $variant === 'primary'
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : '#333'};
  color: #fff;
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`

const ErrorMessage = styled.p`
  color: #ff5555;
  margin: 16px 0 0;
  text-align: center;
  font-size: 0.9rem;
  background: rgba(255, 85, 85, 0.1);
  padding: 10px;
  border-radius: 6px;
`

const ToggleGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 8px;
`

const ToggleButton = styled.button<{ $active: boolean }>`
  padding: 12px;
  border: 2px solid ${({ $active }) => ($active ? '#667eea' : '#333')};
  border-radius: 8px;
  background: ${({ $active }) => ($active ? 'rgba(102, 126, 234, 0.2)' : '#222')};
  color: ${({ $active }) => ($active ? '#fff' : '#aaa')};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #667eea;
    background: ${({ $active }) => ($active ? 'rgba(102, 126, 234, 0.3)' : '#2a2a2a')};
  }
`

const PresetGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
`

const PresetButton = styled.button`
  padding: 8px 14px;
  border: 1px solid #333;
  border-radius: 6px;
  background: #222;
  color: #aaa;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #2a2a2a;
    border-color: #667eea;
    color: #fff;
  }
`

const InfoBox = styled.div`
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 8px;
  padding: 12px;
  margin-top: 12px;
  font-size: 0.85rem;
  color: #aaa;
  line-height: 1.5;
`

const OddsDisplay = styled.div`
  margin-top: 8px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  font-size: 0.9rem;
  color: #ddd;
  text-align: center;
`

export default function CreateGameModal({
  isOpen,
  onClose,
  onCreated,
}: {
  isOpen: boolean
  onClose: () => void
  onCreated?: (pk: PublicKey) => void
}) {
  const { publicKey } = useWallet()
  const { join } = useMultiplayer()
  const gamba = useGambaProvider()
  const { anchorProvider } = gamba
  const currentToken = gamba.token

  const [wager, setWager] = useState<number>(0.1)
  const [diceCount, setDiceCount] = useState<number>(DEFAULT_DICE_COUNT)
  const [prediction, setPrediction] = useState<PredictionType>('over')
  const [targetNumber, setTargetNumber] = useState<number>(getDefaultTarget(DEFAULT_DICE_COUNT))
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const minRoll = getMinRoll(diceCount)
  const maxRoll = getMaxRoll(diceCount)

  // Update target when dice count changes
  React.useEffect(() => {
    const newMin = getMinRoll(diceCount)
    const newMax = getMaxRoll(diceCount)
    if (targetNumber < newMin || targetNumber > newMax) {
      setTargetNumber(getDefaultTarget(diceCount))
    }
  }, [diceCount, targetNumber])

  const odds = useMemo(() => {
    return calculateOdds(diceCount, prediction, targetNumber)
  }, [diceCount, prediction, targetNumber])

  const handleSubmit = async () => {
    if (!publicKey) {
      setError('Please connect your wallet first')
      return
    }

    if (!currentToken) {
      setError('No token selected')
      return
    }

    if (wager <= 0) {
      setError('Wager must be greater than 0')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const decimals = currentToken.decimals || 9
      const lamports = Math.floor(wager * Math.pow(10, decimals))

      // Generate random game seed
      const rand = crypto.getRandomValues(new Uint8Array(8))
      const gameSeed = new BN(rand, 'le')
      const gamePda = deriveGamePdaFromSeed(gameSeed)

      // Game parameters
      const params = {
        preAllocPlayers: 2,
        maxPlayers: 2,
        numTeams: 0,
        winnersTarget: 1,
        wagerType: 0, // sameWager
        payoutType: 0,
        wager: lamports,
        softDuration: SOFT_DURATION,
        hardDuration: HARD_DURATION,
        gameSeed,
        minBet: lamports,
        maxBet: lamports,
        accounts: {
          gameMaker: publicKey,
          mint: currentToken.mint,
        },
      } as const

      // Create game instruction
      const createIx = await createGameIx(anchorProvider as any, params)

      // Prepare metadata
      const metadata = JSON.stringify({
        diceCount,
        prediction,
        targetNumber,
      })

      // Join own game with create instruction
      await join(
        {
          gameAccount: gamePda,
          mint: currentToken.mint,
          wager: lamports,
          creatorAddress: PLATFORM_CREATOR_ADDRESS,
          creatorFeeBps: Math.round(MULTIPLAYER_FEE * BPS_PER_WHOLE),
          metadata,
        },
        [createIx],
      )

      onCreated?.(gamePda)
      onClose()
    } catch (err: any) {
      console.error('Create game error:', err)
      setError(err.message || 'Failed to create game. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Backdrop
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <Modal
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Title>🎲 Create Dice Dual</Title>

            <Field>
              <Label>Wager ({currentToken?.symbol || 'SOL'})</Label>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                value={wager}
                onChange={(e) => setWager(Number(e.target.value))}
                disabled={submitting}
              />
              <PresetGroup>
                {[0.1, 0.5, 1, 2, 5].map((v) => (
                  <PresetButton key={v} onClick={() => setWager(v)} disabled={submitting}>
                    {v} {currentToken?.symbol || 'SOL'}
                  </PresetButton>
                ))}
              </PresetGroup>
            </Field>

            <Field>
              <Label>Number of Dice</Label>
              <ToggleGroup>
                {Array.from({ length: MAX_DICE_COUNT - MIN_DICE_COUNT + 1 }, (_, i) => MIN_DICE_COUNT + i).map((n) => (
                  <ToggleButton
                    key={n}
                    $active={diceCount === n}
                    onClick={() => setDiceCount(n)}
                    disabled={submitting}
                  >
                    {n}d6
                  </ToggleButton>
                ))}
              </ToggleGroup>
            </Field>

            <Field>
              <Label>Prediction Type</Label>
              <ToggleGroup>
                <ToggleButton
                  $active={prediction === 'over'}
                  onClick={() => setPrediction('over')}
                  disabled={submitting}
                >
                  Over
                </ToggleButton>
                <ToggleButton
                  $active={prediction === 'under'}
                  onClick={() => setPrediction('under')}
                  disabled={submitting}
                >
                  Under
                </ToggleButton>
                <ToggleButton
                  $active={prediction === 'exact'}
                  onClick={() => setPrediction('exact')}
                  disabled={submitting}
                >
                  Exact
                </ToggleButton>
              </ToggleGroup>
            </Field>

            <Field>
              <Label>
                Target Number ({minRoll}-{maxRoll})
              </Label>
              <Input
                type="number"
                min={minRoll}
                max={maxRoll}
                value={targetNumber}
                onChange={(e) => setTargetNumber(Number(e.target.value))}
                disabled={submitting}
              />
              <Slider
                type="range"
                min={minRoll}
                max={maxRoll}
                value={targetNumber}
                onChange={(e) => setTargetNumber(Number(e.target.value))}
                disabled={submitting}
              />
              <OddsDisplay>
                Win if roll is {prediction} {targetNumber}
                {odds > 0 && ` (≈${odds.toFixed(1)}x odds)`}
              </OddsDisplay>
            </Field>

            <InfoBox>
              💡 Both players bet the same amount. Winner takes all (minus platform fees).
              Game starts {SOFT_DURATION}s after both players join.
            </InfoBox>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <ButtonRow>
              <Button onClick={onClose} disabled={submitting}>
                Cancel
              </Button>
              <Button $variant="primary" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Game'}
              </Button>
            </ButtonRow>
          </Modal>
        </Backdrop>
      )}
    </AnimatePresence>
  )
}
