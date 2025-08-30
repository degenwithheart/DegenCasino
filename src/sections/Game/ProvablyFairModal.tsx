import styled, { keyframes } from 'styled-components';

const CasinoModalContent = styled.div`
  width: 100%;
  max-width: 600px;
  min-width: 0;
  min-height: 350px;
  max-height: 500px;
  margin-bottom: 4rem;
  margin-top: 4rem;
  padding: 4rem;
  background: rgba(24, 24, 24, 0.95);
  border-radius: 1rem;
  border: 2px solid rgba(255, 215, 0, 0.3);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  position: relative;
  color: white;
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

// Keyframes for gradient animation
const casinoMoveGradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;
import { useGamba, useGambaProgram, useSendTransaction } from 'gamba-react-v2'
import { GambaPlatformContext, GambaUi } from 'gamba-react-ui-v2'
import React from 'react'
import { Icon } from '../../components/Icon'
import { Modal } from '../../components/Modal'

interface ProvablyFairModalProps { onClose: () => void; inline?: boolean }

export function ProvablyFairModal(props: ProvablyFairModalProps) {
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

  // Inline styling components (re-used only when inline)
  const InlineWrapper = styled.div`
    padding: 56px 48px 46px 48px;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 28px;
    @media (max-width: 700px) {
      padding: 48px 28px 40px 28px;
    }
  `;
  const Heading = styled.h1`
    margin: 0;
    font-size: clamp(28px,3.2vw,40px);
    font-weight: 800;
    background: linear-gradient(90deg,#ffe27a,#ff5ba5 55%,#ff00c8);
    -webkit-background-clip: text;
    color: transparent;
    letter-spacing: .5px;
  `;
  const Paragraph = styled.p`
    margin: 0;
    line-height: 1.6;
    font-size: 15.5px;
    color: #ffffffcc;
  `;
  const Section = styled.div`
    display: flex;
    flex-direction: column;
    gap: 14px;
  `;
  const Label = styled.div`
    font-size: 12px;
    letter-spacing: 1px;
    font-weight: 600;
    text-transform: uppercase;
    color: #ffd88acc;
  `;
  const SeedBox = styled.pre`
    margin: 0;
    padding: 14px 16px;
    background: linear-gradient(135deg,#141419,#1c0f22);
    border: 1px solid #ffffff14;
    border-radius: 12px;
    font-size: 12px;
    line-height: 1.4;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    word-break: break-all;
    position: relative;
    color: #e9ecf5;
  `;
  const CopyButton = styled.button`
    position: absolute;
    top: 6px;
    right: 6px;
    background: linear-gradient(135deg,#ffae00,#ff0066);
    border: none;
    color: white;
    font-size: 11px;
    font-weight: 600;
    padding: 6px 10px;
    border-radius: 20px;
    cursor: pointer;
    box-shadow: 0 4px 14px -4px #ff006688;
    display: flex;
    align-items: center;
    gap: 4px;
    &:active { transform: translateY(1px); }
  `;
  const SeedRow = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
  `;
  const Divider = styled.hr`
    border: none;
    height: 1px;
    background: linear-gradient(90deg,transparent,#ffffff15,transparent);
    margin: 4px 0 4px 0;
  `;
  const SmallNote = styled.div`
    font-size: 11px;
    color: #ffffff66;
    line-height: 1.4;
  `;

  const [copied, setCopied] = React.useState(false)
  const copySeed = () => {
    if (!gamba.nextRngSeedHashed) return
    navigator.clipboard.writeText(gamba.nextRngSeedHashed).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    })
  }

  const Body = (
    <>
      {props.inline ? (
        <InlineWrapper>
          <div>
            <Heading>Provably Fair</Heading>
            <Paragraph>
              Verify every outcome. Your client seed + the house seed hash combine to generate deterministic randomness you can audit.
            </Paragraph>
          </div>
          {!gamba.userCreated && (
            <Section>
              <Paragraph>
                First time playing with this wallet. Request the initial hashed seed so subsequent plays are auto‑verifiable.
              </Paragraph>
              <GambaUi.Button main disabled={initializing} onClick={initialize}>
                {initializing ? 'Requesting…' : 'Get hashed seed'}
              </GambaUi.Button>
              <SmallNote>We store only the hash now; the revealed seed after play proves no tampering occurred.</SmallNote>
            </Section>
          )}
          {gamba.userCreated && (
            <Section>
              <Label>Next RNG Seed (sha256)</Label>
              <SeedBox>
                {gamba.nextRngSeedHashed || '—'}
                {gamba.nextRngSeedHashed && (
                  <CopyButton onClick={copySeed}>{copied ? 'Copied' : 'Copy'}</CopyButton>
                )}
              </SeedBox>
              <Divider />
              <Label>Client Seed</Label>
              <SeedRow>
                <GambaUi.TextInput
                  style={{ flexGrow: 1 }}
                  value={platform.clientSeed}
                  disabled={gamba.isPlaying}
                  maxLength={32}
                  onChange={platform.setClientSeed}
                />
                <GambaUi.Button
                  disabled={gamba.isPlaying}
                  onClick={() => platform.setClientSeed(String(Math.random() * 1e9 | 0))}
                >
                  <Icon.Shuffle />
                </GambaUi.Button>
              </SeedRow>
              <SmallNote>
                Changing your client seed before a play alters the resulting randomness. Combine with the revealed server seed to recompute and verify.
              </SmallNote>
            </Section>
          )}
        </InlineWrapper>
      ) : (
        <>
          <h1 style={props.inline ? {marginTop:0} : undefined}>Provably Fair</h1>
          {!gamba.userCreated && (
            <>
              <p>
                Provably Fair allows you to verify that the result of each game was randomly generated. Since you are playing from this wallet for the first time, you can request the initial hashed seed ahead of time. After this it will be done automatically for each play.
              </p>
              <GambaUi.Button main disabled={initializing} onClick={initialize}>
                Get hashed seed
              </GambaUi.Button>
            </>
          )}
          {gamba.userCreated && (
            <>
              <p>
                Your client seed will affect the result of the next game you play.
              </p>
              <div style={{ display: 'grid', gap: '10px', width: '100%', padding: props.inline ? 0 : 20 }}>
                <div>Next RNG Seed (sha256)</div>
                <GambaUi.TextInput
                  value={gamba.nextRngSeedHashed ?? ''}
                  disabled
                />
                <div>Client Seed</div>
                <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                  <GambaUi.TextInput
                    style={{ flexGrow: '1' }}
                    value={platform.clientSeed}
                    disabled={gamba.isPlaying}
                    maxLength={32}
                    onChange={platform.setClientSeed}
                  />
                  <GambaUi.Button
                    disabled={gamba.isPlaying}
                    onClick={() => platform.setClientSeed(String(Math.random() * 1e9 | 0))}
                  >
                    <Icon.Shuffle />
                  </GambaUi.Button>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  )

  if (props.inline) return Body
  return (
    <Modal onClose={() => props.onClose()}>
      <CasinoModalContent>{Body}</CasinoModalContent>
    </Modal>
  )
}
