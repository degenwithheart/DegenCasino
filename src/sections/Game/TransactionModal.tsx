import { decodeGame, getGameAddress, getPlayerUnderlyingAta, getUserUnderlyingAta } from 'gamba-core-v2'
import { GambaUi } from 'gamba-react-ui-v2'
import { useAccount, useGamba, useGambaProgram, useSendTransaction, useTransactionStore, useWalletAddress } from 'gamba-react-v2'
import React from 'react'
import { Modal } from '../../components/Modal'
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
      <h1 style={{
        fontSize: 'clamp(1.2rem, 4vw, 2rem)',
        marginBottom: 12,
        textAlign: 'center',
      }}>Transaction</h1>
      <div style={{
        fontSize: 'clamp(0.95rem, 3vw, 1.1rem)',
        marginBottom: 10,
        textAlign: 'center',
        lineHeight: 1.5,
        wordBreak: 'break-word',
      }}>
        {loadingState} - {txStore.state} - {status} - {gamba.nonce.toString()}
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: 12,
          justifyContent: 'center',
        }}
      >
        <GambaUi.Button
          disabled={gamba.userCreated || initializing}
          onClick={initialize}
        >
          <span style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)' }}>Open account</span>
        </GambaUi.Button>
        <GambaUi.Button onClick={reset}>
          <span style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)' }}>Reset account</span>
        </GambaUi.Button>
        <GambaUi.Button
          disabled={!gamba.userCreated || closingAccount}
          onClick={closeAccount}
        >
          <span style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)' }}>Close account</span>
        </GambaUi.Button>
        {txStore.txId && (
          <GambaUi.Button main onClick={() => window.open('https://solscan.io/tx/' + txStore.txId)}>
            <span style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)' }}>View TX</span>
          </GambaUi.Button>
        )}
      </div>
      <div style={{ padding: 'clamp(8px, 3vw, 16px) 0 0 0' }}>
        <LoadingBar />
      </div>
    </Modal>
  )
}
