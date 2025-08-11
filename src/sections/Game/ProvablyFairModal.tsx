import { useGamba, useGambaProgram, useSendTransaction } from 'gamba-react-v2'
import { GambaPlatformContext, GambaUi } from 'gamba-react-ui-v2'
import React from 'react'
import { Icon } from '../../components/Icon'
import { Modal } from '../../components/Modal'

export function ProvablyFairModal(props: {onClose: () => void}) {
  const gamba = useGamba()
  const platform = React.useContext(GambaPlatformContext)
  const [initializing, setInitializing] = React.useState(false)
  const program = useGambaProgram()
  const sendTransaction = useSendTransaction()

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

  return (
    <Modal onClose={() => props.onClose()}>
      <h1 style={{
        fontSize: 'clamp(1.2rem, 4vw, 2rem)',
        marginBottom: 12,
        textAlign: 'center',
      }}>Provably Fair</h1>
      {!gamba.userCreated && (
        <>
          <p style={{
            fontSize: 'clamp(0.95rem, 3vw, 1.1rem)',
            marginBottom: 16,
            textAlign: 'center',
            lineHeight: 1.5,
          }}>
            Provably Fair allows you to verify that the result of each game was randomly generated. Since you are playing from this wallet for the first time, you can request the initial hashed seed ahead of time. After this it will be done automatically for each play.
          </p>
          <div style={{ width: '100%', marginBottom: 8 }}>
            <GambaUi.Button
              main
              disabled={initializing}
              onClick={initialize}
            >
              <span style={{
                display: 'block',
                width: '100%',
                fontSize: 'clamp(1rem, 3vw, 1.1rem)',
                padding: 'clamp(10px, 3vw, 16px) 0',
              }}>
                Get hashed seed
              </span>
            </GambaUi.Button>
          </div>
        </>
      )}
      {gamba.userCreated && (
        <>
          <p style={{
            fontSize: 'clamp(0.95rem, 3vw, 1.1rem)',
            marginBottom: 10,
            textAlign: 'center',
            lineHeight: 1.5,
          }}>
            Your client seed will affect the result of the next game you play.
          </p>
          <div
            style={{
              display: 'grid',
              gap: '10px',
              width: '100%',
              padding: 'clamp(10px, 4vw, 20px)',
              boxSizing: 'border-box',
              gridTemplateColumns: '1fr',
            }}
          >
            <div style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.05rem)' }}>Next RNG Seed (sha256)</div>
            <GambaUi.TextInput
              value={gamba.nextRngSeedHashed ?? ''}
              disabled
              style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.05rem)' }}
            />
            <div style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.05rem)' }}>Client Seed</div>
            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
              <GambaUi.TextInput
                style={{ flexGrow: 1, fontSize: 'clamp(0.9rem, 2.5vw, 1.05rem)' }}
                value={platform.clientSeed}
                disabled={gamba.isPlaying}
                maxLength={32}
                onChange={platform.setClientSeed}
              />
              <div style={{ minWidth: 40, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GambaUi.Button
                  disabled={gamba.isPlaying}
                  onClick={() => platform.setClientSeed(String(Math.random() * 1e9 | 0))}
                >
                  <Icon.Shuffle />
                </GambaUi.Button>
              </div>
            </div>
          </div>
        </>
      )}
    </Modal>
  )
}
