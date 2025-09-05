// src/components/GameScreen.tsx
import React, { useEffect, useState } from 'react'
import { PublicKey } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import { useGame } from 'gamba-react-v2'
import { GambaUi, Multiplayer } from 'gamba-react-ui-v2'
import styled, { keyframes } from 'styled-components'
import {
  PLATFORM_CREATOR_ADDRESS,
  MULTIPLAYER_FEE,
  PLATFORM_REFERRAL_FEE,
} from '../../../constants'
import { BPS_PER_WHOLE } from 'gamba-core-v2'
import Board from '../board/Board'
import { musicManager, stopAndDispose, attachMusic } from '../musicManager'
import actionSnd from '../sounds/action.mp3'
import { useSound } from 'gamba-react-ui-v2'
import type { GameplayEffectsRef } from '../../../components/Game/GameplayFrame'

const glowPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1);
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.2);
  }
`

const StatusBadge = styled.div<{ status: 'waiting' | 'playing' | 'settled' }>`
  display: inline-block;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 215, 0, 0.3);

  ${({ status }) => {
    switch (status) {
      case 'waiting':
        return `
          background: linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(69, 160, 73, 0.2) 100%);
          color: #4caf50;
          border-color: rgba(76, 175, 80, 0.3);
        `
      case 'playing':
        return `
          background: linear-gradient(135deg, rgba(255, 107, 53, 0.2) 0%, rgba(255, 87, 34, 0.2) 100%);
          color: #ff6b35;
          border-color: rgba(255, 107, 53, 0.3);
        `
      case 'settled':
        return `
          background: linear-gradient(135deg, rgba(162, 89, 255, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%);
          color: #a259ff;
          border-color: rgba(162, 89, 255, 0.3);
        `
    }
  }}
`

const CountdownDisplay = styled.div`
  display: inline-block;
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 193, 7, 0.1) 100%);
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.3);
  backdrop-filter: blur(10px);
  animation: ${glowPulse} 2s ease-in-out infinite;
`

const StyledButton = styled.button`
  padding: 10px 20px;
  margin-right: 12px;
  font-weight: 600;
  background: linear-gradient(135deg, rgba(112, 112, 218, 0.3) 0%, rgba(162, 89, 255, 0.3) 100%);
  color: #fff;
  border: 1px solid rgba(112, 112, 218, 0.2);
  border-radius: 8px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(112, 112, 218, 0.3);
    border-color: rgba(112, 112, 218, 0.4);
  }
`

export default function GameScreen({
  pk,
  onBack,
  effectsRef,
}: {
  pk: PublicKey
  onBack: () => void
  effectsRef?: React.RefObject<GameplayEffectsRef>
}) {
  const { game: chainGame, metadata } = useGame(pk, { fetchMetadata: true })
  const { publicKey } = useWallet()

  const [snapPlayers, setSnapPlayers] = useState<PublicKey[] | null>(null)
  const [snapWinner, setSnapWinner]   = useState<number | null>(null)
  const [snapPayouts, setSnapPayouts] = useState<number[] | null>(null)
  const [replayDone, setReplayDone]   = useState(false)

  useEffect(() => {
    if (!chainGame?.state.settled || snapPlayers) return
    const w = Number(chainGame.winnerIndexes[0])
    setSnapPlayers(chainGame.players.map(p => p.user))
    setSnapWinner(w)
    setSnapPayouts(
      chainGame.players.map(p =>
        Number((p as any).pendingPayout ?? (p as any).pending_payout ?? 0),
      ),
    )
    
    // Enhanced race result effects
    if (effectsRef?.current) {
      const userPlayer = chainGame.players.find(p => 
        p.user.toString() === publicKey?.toString()
      )
      
      if (userPlayer) {
        const userPayout = Number((userPlayer as any).pendingPayout ?? (userPlayer as any).pending_payout ?? 0)
        
        if (userPayout > 0) {
          // Win effects with lightning intensity
          effectsRef.current.winFlash('#ffd700', 2.5)
          setTimeout(() => {
            effectsRef.current?.particleBurst(undefined, undefined, '#ffd700', 60)
            effectsRef.current?.screenShake(3, 1200)
          }, 300)
        } else {
          // Lose effects for racing game
          effectsRef.current.loseFlash('#ff4444', 1.5)
          setTimeout(() => {
            effectsRef.current?.screenShake(1.5, 800)
          }, 200)
        }
      }
    }
  }, [chainGame, snapPlayers, effectsRef])

  useEffect(() => {
    if (snapPlayers && snapPlayers.length === 0) {
      setReplayDone(true)
    }
  }, [snapPlayers])

  const [timeLeft, setTimeLeft] = useState(0)
  useEffect(() => {
    if (!chainGame?.softExpirationTimestamp) return
    const end = Number(chainGame.softExpirationTimestamp) * 1000
    const tick = () => setTimeLeft(Math.max(end - Date.now(), 0))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [chainGame?.softExpirationTimestamp])

  const waiting        = snapPlayers === null
  const boardPlayers   = waiting
    ? (chainGame?.players.map(p => p.user) || [])
    : snapPlayers!
  const boardWinnerIdx = waiting ? null : snapWinner
  const boardPayouts   = waiting ? undefined : snapPayouts!

  const formatTime = (ms: number) => {
    const tot = Math.ceil(ms / 1000)
    const m   = Math.floor(tot / 60)
    const s   = tot % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    clearTimeout(musicManager.timer)
    musicManager.count += 1

    return () => {
      musicManager.count -= 1
      if (musicManager.count === 0) {
        musicManager.timer = setTimeout(stopAndDispose, 200)
      }
    }
  }, [])

  const { play: playAction, sounds: actionSounds } = useSound(
    { action: actionSnd },
    { disposeOnUnmount: false }
  )
  useEffect(() => {
    if (!waiting) {
      // stop lobby immediately
      try { musicManager.sound?.player.stop() } catch {}
      // start action loop and attach for volume control
      const snd = actionSounds.action
      if (snd) {
        snd.player.loop = true
        const startWhenReady = () => {
          if (snd.ready) {
            playAction('action')
            attachMusic(snd)
            // re-apply mute state after attaching
            try { snd.gain.set({ gain: musicManager.muted ? 0 : snd.gain.get().gain }) } catch {}
          } else {
            setTimeout(startWhenReady, 100)
          }
        }
        startWhenReady()
      }
    }
  }, [waiting, playAction, actionSounds])

  return (
    <>
      {/* ► Always render the board */}
      <Board
        players={boardPlayers}
        winnerIdx={boardWinnerIdx}
        gamePk={pk.toBase58()}
        payouts={boardPayouts}
        metadata={metadata}
        onFinished={!waiting ? () => setReplayDone(true) : undefined}
      />

      {/* ► Top-right status + countdown */}
      <div style={{
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        alignItems: 'flex-end',
      }}>
        <StatusBadge status={waiting ? 'waiting' : (!replayDone ? 'playing' : 'settled')}>
          {waiting ? '⏳ Waiting' : (!replayDone ? '🏁 Playing' : '🏆 Settled')}
        </StatusBadge>
        {waiting && timeLeft > 0 && (
          <CountdownDisplay>
            Starts in {formatTime(timeLeft)}
          </CountdownDisplay>
        )}
      </div>

      {/* ► Gamba controls bar */}
      <GambaUi.Portal target="controls">
        {/* ← Back to Lobby button */}
        <StyledButton onClick={onBack}>
          ← Lobby
        </StyledButton>

        {/* Conditional game controls */}
        {waiting && chainGame?.state.waiting ? (
          publicKey && !chainGame.players.some(p => p.user.equals(publicKey)) ? (
            <Multiplayer.JoinGame
              pubkey={pk}
              account={chainGame}
              creatorAddress={PLATFORM_CREATOR_ADDRESS}
              creatorFeeBps={Math.round(MULTIPLAYER_FEE * BPS_PER_WHOLE)}
              referralFee={PLATFORM_REFERRAL_FEE}
              enableMetadata
              onTx={() => {}}
            />
          ) : (
            <Multiplayer.EditBet
              pubkey={pk}
              account={chainGame}
              creatorAddress={PLATFORM_CREATOR_ADDRESS}
              creatorFeeBps={Math.round(MULTIPLAYER_FEE * BPS_PER_WHOLE)}
              onComplete={() => {}}
            />
          )
        ) : null}
      </GambaUi.Portal>
    </>
  )
}
