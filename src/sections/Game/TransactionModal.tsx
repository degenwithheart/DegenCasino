import styled, { keyframes } from 'styled-components';
import { useColorScheme } from '../../themes/ColorSchemeContext';

const casinoMoveGradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

const CasinoModalContent = styled.div`
  width: 100%;
  max-width: 600px;
  min-width: 0;
  min-height: 350px;
  max-height: 80vh;
  margin-bottom: 4rem;
  margin-top: 4rem;
  padding: 4rem;
  background: rgba(24, 24, 24, 0.95);
  border-radius: 1rem;
  border: 2px solid rgba(255, 215, 0, 0.3);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  position: relative;
  color: white;
  overflow-y: auto;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 20%, rgba(255, 215, 0, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(162, 89, 255, 0.08) 0%, transparent 50%);
    pointer-events: none;
    z-index: -1;
    border-radius: 24px;
  }
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #ffd700, #a259ff, #ff00cc, #ffd700);
    background-size: 300% 100%;
    animation: casinoMoveGradient 4s linear infinite;
    border-radius: 24px 24px 0 0;
    z-index: 1;
  }
  @media (max-width: 1200px) {
    padding: 1rem;
  }
  @media (max-width: 800px) {
    padding: 0.5rem;
  }
  @media (max-width: 600px) {
    min-height: 200px;
    padding: 0.25rem;
    border-radius: 10px;
    max-width: calc(100vw - 2rem);
  }
`;
import { decodeGame, getGameAddress, getPlayerUnderlyingAta, getUserUnderlyingAta } from 'gamba-core-v2'
import { GambaUi } from 'gamba-react-ui-v2'
import { useAccount, useGamba, useGambaProgram, useSendTransaction, useTransactionStore, useWalletAddress } from 'gamba-react-v2'
import React from 'react'
import { Modal } from '../../components'
import { LoadingBar, useLoadingState } from './LoadingBar'

export function TransactionModal(props: {onClose: () => void}) {
  const [closingAccount, setClosingAccount] = React.useState(false)
  const [initializing, setInitializing] = React.useState(false)
  const program = useGambaProgram()
  const sendTransaction = useSendTransaction()
  const userAddress = useWalletAddress()
  const gamba = useGamba()
  const game = useAccount(getGameAddress(userAddress), decodeGame)
  const txStore = useTransactionStore()
  const { currentColorScheme } = useColorScheme()
  const loadingState = useLoadingState()
  const status = Object.keys(game?.status ?? {})[0]

  const initialize = async () => {
    try {
      setInitializing(true)
      await sendTransaction(
        program.methods
          .playerInitialize()
          .instruction(),
        { confirmation: 'confirmed' },
      )
    } finally {
      setInitializing(false)
    }
  }

  const reset = async () => {
    if (!game) return
    // if (game.bonusUsed) {
    //   const bonus = getPlayerBonusAtaForPool(game.user, game.pool)
    // }

    const playerAta = getPlayerUnderlyingAta(userAddress, game.tokenMint)
    const userUnderlyingAta = getUserUnderlyingAta(userAddress, game.tokenMint)
    const ix = program.methods
      .playerClaim()
      .accounts({
        playerAta,
        underlyingTokenMint: game.tokenMint,
        userUnderlyingAta,
        systemProgram: '',
        tokenProgram: '',
        associatedTokenProgram: ''
      })
      .instruction()

    await sendTransaction(
      ix,
      { confirmation: 'confirmed' },
    )
  }

  const closeAccount = async () => {
    try {
      setClosingAccount(true)
      await sendTransaction(
        program.methods
          .playerClose()
          .instruction(),
        { confirmation: 'confirmed' },
      )
    } finally {
      setClosingAccount(false)
    }
  }

  return (
    <Modal onClose={() => props.onClose()}>
      <CasinoModalContent>
        <h1>Transaction</h1>
        {loadingState} - {txStore.state} - {status} - {gamba.nonce.toString()}
        <div style={{ display: 'flex', gap: '10px' }}>
          <GambaUi.Button disabled={gamba.userCreated || initializing} onClick={initialize}>
            Open account
          </GambaUi.Button>
          <GambaUi.Button onClick={reset}>
            Reset account
          </GambaUi.Button>
          <GambaUi.Button disabled={!gamba.userCreated || closingAccount} onClick={closeAccount}>
            Close account
          </GambaUi.Button>
          {txStore.txId && (
            <GambaUi.Button main onClick={() => window.open('https://solscan.io/tx/' + txStore.txId)}>
              View TX
            </GambaUi.Button>
          )}
        </div>
        <LoadingBar />
      </CasinoModalContent>
    </Modal>
  )
}
