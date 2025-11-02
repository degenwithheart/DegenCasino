import React, { useState, useRef, useEffect, useMemo } from 'react';
import styled, { css, keyframes } from 'styled-components';
import useSWR from 'swr';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { PLATFORM_CREATOR_ADDRESS } from '../../../../constants';
import { generateUsernameFromWallet } from '../../../../utils/user/userProfileUtils';
import { useChatNotifications } from '../../../../contexts/ChatNotificationContext';

function getProfileUsername(publicKey: string | undefined): string {
  if (!publicKey) return 'anon';
  const key = publicKey.toString();
  let storedUsername = '';
  try {
    storedUsername = localStorage.getItem(`username-${key}`) || '';
  } catch {
    // Ignore localStorage errors
  }
  if (!storedUsername) {
    storedUsername = generateUsernameFromWallet(key);
    try {
      localStorage.setItem(`username-${key}`, storedUsername);
    } catch {
      // Ignore localStorage errors
    }
  }
  return storedUsername;
}

type Msg = { user: string; text: string; ts: number; };

const fetcher = (url: string) => fetch(url).then(r => r.json());

const stringToHslColor = (str: string, s: number, l: number): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, ${s}%, ${l}%)`;
};

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(5px) scale(0.95) }
  to   { opacity: 1; transform: translateY(0) scale(1) }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
  overflow: hidden;
`;

const Log = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 200px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 215, 0, 0.3);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const MessageItem = styled.div<{ $isOwn?: boolean; }>`
  line-height: 1.4;
  animation: ${fadeIn} 0.3s ease-out;
  padding: 12px 16px;
  border-radius: 16px;
  background: rgba(32, 24, 48, 0.85);
  box-shadow: 0 2px 12px rgba(162, 89, 255, 0.08), 0 1.5px 6px rgba(255, 215, 0, 0.06);
  border: 1px solid rgba(255, 215, 0, 0.13);
  position: relative;
  max-width: 100%;
  word-wrap: break-word;
`;

const Username = styled.strong<{ userColor: string; }>`
  font-weight: 700;
  color: #ffd700;
  margin-right: 0.7em;
  font-size: 1.08em;
  letter-spacing: 0.01em;
  text-shadow: 0 1px 6px rgba(255, 215, 0, 0.3);
`;

const Timestamp = styled.span`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  margin-left: 0.5em;
`;

const InputRow = styled.div`
  display: flex;
  border-top: 1px solid rgba(255,255,255,0.08);
  background: rgba(0,0,0,0.1);
  flex-shrink: 0;
  position: relative;
`;

const TextInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  padding: 10px;
  color: #fff;
  outline: none;
  font-size: 0.9rem;
  font-family: 'DM Sans', sans-serif;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SendBtn = styled.button`
  background: linear-gradient(135deg, #ffd700, #ffb300);
  border: none;
  padding: 0 12px;
  cursor: pointer;
  font-weight: 600;
  color: #000;
  font-size: 0.9rem;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #ffb300, #ffa500);
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CharCounter = styled.span<{ $isNearLimit: boolean; $isAtLimit: boolean; }>`
  position: absolute;
  bottom: 2px;
  right: 80px;
  font-size: 0.75rem;
  color: ${({ $isNearLimit, $isAtLimit }) =>
    $isAtLimit ? '#ff6b6b' : $isNearLimit ? '#ffa500' : 'rgba(255, 255, 255, 0.6)'};
  background: rgba(0, 0, 0, 0.7);
  padding: 2px 6px;
  border-radius: 4px;
  pointer-events: none;
  font-weight: 500;
  z-index: 1;
`;

const LoadingText = styled.div`
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  padding: 20px;
  font-style: italic;
`;

const ConnectPrompt = styled.div<{ $colorScheme: any; }>`
  background: linear-gradient(135deg, 
    ${props => props.$colorScheme.colors.accent}15,
    ${props => props.$colorScheme.colors.surface}40
  );
  border-radius: 16px;
  padding: 2rem;
  margin: auto 0;
  border: 2px solid ${props => props.$colorScheme.colors.accent}30;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  text-align: center;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 0%, ${props => props.$colorScheme.colors.accent}10 0%, transparent 70%);
    pointer-events: none;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      transparent,
      ${props => props.$colorScheme.colors.accent}80,
      transparent
    );
  }
`;

const ConnectTitle = styled.h3<{ $colorScheme: any; }>`
  font-size: 0.9rem;
  font-weight: 700;
  color: ${props => props.$colorScheme.colors.text}60;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${props => props.$colorScheme.colors.border}30;
`;

const ConnectMessage = styled.p<{ $colorScheme: any; }>`
  font-size: 0.9rem;
  color: ${props => props.$colorScheme.colors.text}80;
  margin: 0;
  line-height: 1.4;
`;

const TrollBoxPage: React.FC<{ onStatusChange?: (status: string) => void; }> = ({ onStatusChange }) => {
  const { publicKey, connected } = useWallet();
  const walletModal = useWalletModal();
  const { setTotalMessages } = useChatNotifications();

  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const userName = getProfileUsername(publicKey?.toString());
  const MAX_CHARS = 280;

  // Cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // SWR for chat messages - use the same local API endpoint as the core TrollBox component
  const swrKey = '/api/chat/chat';
  const { data, mutate } = useSWR(swrKey, fetcher, {
    refreshInterval: 2000,
    revalidateOnFocus: true,
  });

  const messages: Msg[] = data || [];
  const userColors = useMemo(() => {
    const colors: { [key: string]: string; } = {};
    messages.forEach(msg => {
      if (!colors[msg.user]) {
        colors[msg.user] = stringToHslColor(msg.user, 70, 50);
      }
    });
    return colors;
  }, [messages]);

  // Update status when messages change
  useEffect(() => {
    const status = messages.length ? `${messages.length} msgs` : 'Connecting…';
    onStatusChange?.(status);
    // Update notification context with total message count
    setTotalMessages(messages.length);
  }, [messages.length, onStatusChange, setTotalMessages]);

  const send = async () => {
    if (!connected || !text.trim() || isSending || cooldown > 0 || !swrKey) return;

    setIsSending(true);
    try {
      const response = await fetch(swrKey, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: userName, text: text.trim() }),
      });

      if (response.ok) {
        setText('');
        mutate();
        setCooldown(3); // 3 second cooldown
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= MAX_CHARS) {
      setText(newValue);
    }
  };

  const remainingChars = MAX_CHARS - text.length;
  const isNearLimit = remainingChars <= 20;
  const isAtLimit = remainingChars <= 0;

  const fmtTime = (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <ContentContainer>
        <Log>
          {data?.error && <LoadingText>Error loading chat.</LoadingText>}
          {messages.map((m, i) => (
            <MessageItem key={m.ts || i} $isOwn={m.user === userName}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <Username userColor={userColors[m.user]}>{m.user}</Username>
                <Timestamp>{fmtTime(m.ts)}</Timestamp>
              </div>
              <div style={{ color: '#fff', fontSize: '0.95rem', wordBreak: 'break-word' }}>
                {m.text}
              </div>
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
                e.preventDefault();
                send();
              }
            }}
            disabled={isSending || !swrKey}
            maxLength={MAX_CHARS}
          />
          <CharCounter $isNearLimit={isNearLimit} $isAtLimit={isAtLimit}>
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
    </>
  );
};

export default TrollBoxPage;