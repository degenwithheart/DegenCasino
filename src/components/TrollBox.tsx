import React, { useState, useRef, useEffect, useMemo } from 'react'
import styled, { css, keyframes } from 'styled-components'
import useSWR from 'swr'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { PLATFORM_CREATOR_ADDRESS } from '../constants';
import { generateUsernameFromWallet } from '../sections/userProfileUtils';


function getProfileUsername(publicKey: string | undefined): string {
  if (!publicKey) return 'anon';
  const key = publicKey.toString();
  let storedUsername = '';
  try {
    storedUsername = localStorage.getItem(`username-${key}`) || '';
  } catch {}
  if (!storedUsername) {
    storedUsername = generateUsernameFromWallet(key);
    try {
      localStorage.setItem(`username-${key}`, storedUsername);
    } catch {}
  }
  return storedUsername;
}

type Msg = { user: string; text: string; ts: number }

const fetcher = (url: string) => fetch(url).then(r => r.json())

const stringToHslColor = (str: string, s: number, l: number): string => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return `hsl(${hash % 360}, ${s}%, ${l}%)`
}

const MinimizeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const ChatIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
  </svg>
)

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(5px) }
  to   { opacity: 1; transform: translateY(0) }
`

const Wrapper = styled.div<{ $isMinimized: boolean; $isMaximized: boolean }>`
  position: fixed;
  bottom: ${({ $isMaximized }) => ($isMaximized ? '5vh' : $isMaximized ? '16px' : '100px')};
  right: ${({ $isMaximized }) => ($isMaximized ? '5vw' : $isMaximized ? '16px' : '20px')};
  z-index: 998;
  border-radius: ${({ $isMinimized, $isMaximized }) =>
    $isMinimized ? '50%' : $isMaximized ? '24px' : '18px'};
  background: ${({ $isMinimized }) => ($isMinimized ? '#5e47ff' : 'rgba(28,28,35,0.92)')};
  border: 2px solid rgba(255, 215, 0, 0.3);
  color: #eee;
  font-size: 0.95rem;
  box-shadow: 0 0 32px #ffd70088, 0 8px 32px rgba(0,0,0,0.45);
  ${({ $isMinimized }) => !$isMinimized && `backdrop-filter: blur(18px)`};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: ${({ $isMinimized }) => ($isMinimized ? 'pointer' : 'default')};
  transition: width 0.3s, height 0.3s, max-height 0.3s, border-radius 0.3s, background 0.3s, bottom 0.3s, right 0.3s;

  ${({ $isMinimized, $isMaximized }) =>
    $isMinimized
      ? `
    width: 56px;
    height: 56px;
    max-height: 56px;
    justify-content: center;
    align-items: center;
    color: #fff;
    & > *:not(${ExpandIconWrapper}) { display: none }
  `
      : $isMaximized
      ? `
    width: min(600px, 96vw);
    height: min(80vh, 600px);
    max-width: 98vw;
    max-height: 98vh;
    min-height: 200px;
    left: 50%;
    top: 50%;
    right: auto;
    bottom: auto;
    transform: translate(-50%, -50%);
    font-size: clamp(0.95rem, 1.2vw, 1.15rem);
  `
      : `
    width: clamp(260px, 32vw, 420px);
    max-width: 98vw;
    max-height: clamp(320px, 40vh, 520px);
    min-height: 120px;
    font-size: clamp(0.92rem, 1vw, 1.08rem);
  `}

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 20%, rgba(255, 215, 0, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(255, 149, 0, 0.08) 0%, transparent 50%);
    pointer-events: none;
    z-index: -1;
    border-radius: ${({ $isMinimized, $isMaximized }) =>
      $isMinimized ? '50%' : $isMaximized ? '24px' : '18px'};
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #ffd700, #ff9500, #ffd700);
    background-size: 300% 100%;
    animation: none;
    border-radius: ${({ $isMinimized, $isMaximized }) =>
      $isMinimized ? '50%' : $isMaximized ? '24px 24px 0 0' : '18px 18px 0 0'};
    z-index: 1;
  }

  @media (max-width: 1024px) {
    ${({ $isMinimized, $isMaximized }) =>
      $isMinimized
        ? `
      bottom: 12px;
      right: 12px;
    `
        : $isMaximized
        ? `
      width: 98vw;
      height: 98vh;
      left: 1vw;
      top: 1vh;
      right: auto;
      bottom: auto;
      border-radius: 16px;
      transform: none;
    `
        : `
      width: clamp(200px, 48vw, 340px);
      max-width: 98vw;
      max-height: clamp(200px, 40vh, 340px);
      bottom: 12px;
      right: 12px;
    `}
  }
  @media (max-width: 1000px) {
    display: none !important;
  }
`
const MaximizeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="3" />
  </svg>
)

const ContentContainer = styled.div<{ $isMinimized: boolean }>`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
  opacity: ${({ $isMinimized }) => ($isMinimized ? 0 : 1)};
  transition: opacity 0.2s;
  pointer-events: ${({ $isMinimized }) => ($isMinimized ? 'none' : 'auto')};
`

const Header = styled.div`
  padding: 12px 18px 10px 18px;
  border-bottom: 1.5px solid rgba(255,215,0,0.13);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #ffd70022 0%, #ff950022 100%);
  color: #fff;
  cursor: pointer;
  font-family: 'Luckiest Guy', cursive, sans-serif;
  font-size: 1.08em;
  letter-spacing: 0.5px;
  text-shadow: 0 0 8px #ffd70044;
`

const HeaderTitle = styled.span`
  flex-grow: 1;
  font-size: 0.9rem;
`

const HeaderStatus = styled.span`
  font-size: 0.7rem;
  color: #a0a0a0;
  opacity: 0.8;
  margin: 0 8px;
`

const MinimizeButton = styled.button`
  background: none;
  border: none;
  color: #a0a0a0;
  padding: 4px;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background: rgba(255,255,255,0.1);
    color: #fff;
  }
`

const ExpandIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const Log = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 80px;
  font-size: 0.85rem;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.2);
    border-radius: 2px;
  }
`

const MessageItem = styled.div<{ $isOwn?: boolean }>`
  line-height: 1.4;
  animation: ${fadeIn} 0.3s ease-out;
  margin-bottom: 0.7em;
  padding: 0.7em 1em 0.8em 1em;
  border-radius: 14px;
  background: rgba(32, 24, 48, 0.85);
  box-shadow: 0 2px 12px rgba(162, 89, 255, 0.08), 0 1.5px 6px rgba(255, 215, 0, 0.06);
  border: 1.5px solid rgba(255, 215, 0, 0.13);
  position: relative;
`

const Username = styled.strong<{ userColor: string }>`
  font-weight: 700;
  color: #ffd700;
  margin-right: 0.7em;
  font-size: 1.08em;
  letter-spacing: 0.01em;
  text-shadow: 0 1px 6px rgba(255, 215, 0, 0.18);
`

const Timestamp = styled.span`
  font-size: 0.78em;
  color: #b6aaff;
  opacity: 0.8;
  margin-left: auto;
  font-weight: 400;
  letter-spacing: 0.01em;
`

const InputRow = styled.div`
  display: flex;
  border-top: 1px solid rgba(255,255,255,0.08);
  background: rgba(0,0,0,0.1);
  flex-shrink: 0;
  position: relative;
`

const CharCounter = styled.div<{ $isNearLimit: boolean; $isAtLimit: boolean }>`
  position: absolute;
  bottom: 2px;
  right: 80px;
  font-size: 0.75rem;
  color: ${({ $isAtLimit, $isNearLimit }) => 
    $isAtLimit ? '#ff6b6b' : $isNearLimit ? '#ffa500' : '#888'};
  background: rgba(0, 0, 0, 0.7);
  padding: 2px 6px;
  border-radius: 4px;
  pointer-events: none;
  font-weight: 500;
  z-index: 1;
`

const TextInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  padding: 10px;
  color: #eee;
  outline: none;
  font-size: 0.9rem;

  &::placeholder {
    color: #777;
    opacity: 0.8;
  }
`

const SendBtn = styled.button`
  background: #5e47ff;
  border: none;
  padding: 0 12px;
  cursor: pointer;
  font-weight: 600;
  color: #fff;
  font-size: 0.9rem;

  &:hover:not(:disabled) {
    background: #6f5aff;
  }

  &:active:not(:disabled) {
    background: #4d38cc;
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const LoadingText = styled.div`
  text-align: center;
  color: #a0a0a0;
  padding: 1.5rem 0;
  font-style: italic;
  font-size: 0.8rem;
`

export default function TrollBox() {
  const { publicKey, connected } = useWallet()
  const walletModal = useWalletModal()
  
  // Initialize states from localStorage with fallbacks
  const [isMinimized, setIsMinimized] = useState(() => {
    try {
      const saved = localStorage.getItem('trollbox-minimized')
      if (saved !== null) {
        return JSON.parse(saved)
      }
      // First time loading - start minimized if wallet is connected
      return connected
    } catch {
      return connected // fallback to minimized if wallet connected
    }
  })
  
  const [isMaximized, setIsMaximized] = useState(() => {
    try {
      const saved = localStorage.getItem('trollbox-maximized')
      return saved ? JSON.parse(saved) : false
    } catch {
      return false
    }
  })
  
  const [cooldown, setCooldown] = useState(0)


  const anonFallback = useMemo(
    () => 'anon' + Math.floor(Math.random() * 1e4).toString().padStart(4, '0'),
    [],
  )
  const userName = useMemo(() => {
    if (connected && publicKey) {
      return getProfileUsername(publicKey.toBase58());
    }
    return anonFallback;
  }, [connected, publicKey, anonFallback]);

  const swrKey =
    isMinimized || (typeof document !== 'undefined' && document.hidden)
      ? null
      : '/api/chat'
  const { data: messages = [], error, mutate } = useSWR<Msg[]>(swrKey, fetcher, {
    refreshInterval: 8000,
    dedupingInterval: 7500,
  })

  // Check if connected wallet is creator
  const isCreator = connected && publicKey && publicKey.toBase58() === PLATFORM_CREATOR_ADDRESS.toBase58();

  // Clear chat handler
  const [isClearing, setIsClearing] = useState(false);
  async function clearChat() {
    if (!isCreator) return;
    setIsClearing(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: publicKey?.toBase58() }),
      });
      if (res.ok) {
        mutate();
      }
    } finally {
      setIsClearing(false);
    }
  }

  const [text, setText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const logRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const userColors = useMemo(() => {
    const map: Record<string, string> = {}
    messages.forEach(m => {
      if (!map[m.user]) map[m.user] = stringToHslColor(m.user, 70, 75)
    })
    if (!map[userName]) map[userName] = stringToHslColor(userName, 70, 75)
    return map
  }, [messages, userName])

  async function send() {
    if (!connected) return walletModal.setVisible(true)
    let txt = text.trim()
    if (!txt || isSending || cooldown > 0) return
    // Match API: max chars for text
    if (txt.length > MAX_CHARS) txt = txt.slice(0, MAX_CHARS)
    let uname = userName
    if (uname.length > 24) uname = uname.slice(0, 24)
    setIsSending(true)
    const id = Date.now()
    mutate([...messages, { user: uname, text: txt, ts: id }], false)
    setText('')
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: uname, text: txt }),
      })
      if (!res.ok) {
        // Optionally show error to user
        if (res.status === 400) {
          // Message was empty or invalid
          // Optionally show a toast or error
        }
      }
      mutate()
      setCooldown(5)
    } catch {
      mutate()
    } finally {
      setIsSending(false)
    }
  }

  useEffect(() => {
    if (!isMinimized && logRef.current) {
      logRef.current.scrollTo({
        top: logRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [messages, isMinimized])

  useEffect(() => {
    if (!isMinimized && window.innerWidth > 480) {
      const t = setTimeout(() => inputRef.current?.focus(), 300)
      return () => clearTimeout(t)
    }
  }, [isMinimized])

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  // Save minimize state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('trollbox-minimized', JSON.stringify(isMinimized))
    } catch {
      // Ignore localStorage errors
    }
  }, [isMinimized])

  // Save maximize state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('trollbox-maximized', JSON.stringify(isMaximized))
    } catch {
      // Ignore localStorage errors
    }
  }, [isMaximized])

  const fmtTime = (ts: number) =>
    ts > Date.now() - 5000
      ? 'sending…'
      : new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  const MAX_CHARS = 260
  const remainingChars = MAX_CHARS - text.length
  const isNearLimit = remainingChars <= 20
  const isAtLimit = remainingChars <= 0

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    // Only update if within limit or if user is deleting characters
    if (newValue.length <= MAX_CHARS) {
      setText(newValue)
    }
  }

  const toggleMinimize = () => setIsMinimized(v => !v)
  const toggleMaximize = () => setIsMaximized(v => !v)
  // If minimized, un-maximize
  useEffect(() => {
    if (isMinimized && isMaximized) setIsMaximized(false)
  }, [isMinimized, isMaximized])

  return (
    <Wrapper $isMinimized={isMinimized} $isMaximized={isMaximized}>
      {isMinimized && (
        <ExpandIconWrapper onClick={toggleMinimize}>
          <ChatIcon />
        </ExpandIconWrapper>
      )}
      <ContentContainer $isMinimized={isMinimized}>
        <Header>
          <HeaderTitle>Moonshot Chat</HeaderTitle>
          <HeaderStatus>
            {messages.length ? `${messages.length} msgs` : 'Connecting…'}
          </HeaderStatus>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            {isCreator && (
              <MinimizeButton
                onClick={clearChat}
                title={isClearing ? 'Clearing…' : 'Clear chat'}
                disabled={isClearing}
                style={{ color: isClearing ? '#ffd70088' : '#ffd700', fontWeight: 700 }}
              >
                {isClearing ? '…' : 'Clear'}
              </MinimizeButton>
            )}
            <MinimizeButton onClick={toggleMinimize} title="Minimize">
              <MinimizeIcon />
            </MinimizeButton>
            <MinimizeButton onClick={toggleMaximize} title={isMaximized ? "Restore" : "Maximize"}>
              <MaximizeIcon />
            </MinimizeButton>
          </div>
        </Header>
        <Log ref={logRef}>
          {!messages.length && !error && <LoadingText>Loading messages…</LoadingText>}
          {error && <LoadingText style={{ color: '#ff8080' }}>Error loading chat.</LoadingText>}
          {messages.map((m, i) => (
            <MessageItem key={m.ts || i} $isOwn={m.user === userName}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <Username userColor={userColors[m.user]}>{m.user}</Username>
                <Timestamp>{fmtTime(m.ts)}</Timestamp>
              </div>
              <div style={{ color: '#fff', fontSize: '1em', wordBreak: 'break-word', marginTop: 2 }}>{m.text}</div>
            </MessageItem>
          ))}
        </Log>
        <InputRow>
          <TextInput
            ref={inputRef}
            value={text}
            placeholder={connected ? 'Say something…' : 'Connect wallet to chat'}
            onChange={handleInputChange}
            onClick={() => !connected && walletModal.setVisible(true)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
            disabled={isSending || !swrKey}
            maxLength={MAX_CHARS}
          />
          <CharCounter 
            $isNearLimit={isNearLimit} 
            $isAtLimit={isAtLimit}
          >
            {remainingChars}
          </CharCounter>
          <SendBtn
            onClick={send}
            disabled={
              !connected ||
              isSending ||
              cooldown > 0 ||
              !text.trim() ||
              !swrKey
            }
          >
            {isSending ? '…' : cooldown > 0 ? `Wait ${cooldown}s` : 'Send'}
          </SendBtn>
        </InputRow>
      </ContentContainer>
    </Wrapper>
  )
}
