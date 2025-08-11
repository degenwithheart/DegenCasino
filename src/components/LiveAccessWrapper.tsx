import React, { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { getAccessWindow, isWithinAccessTime, setAccessOverride, isAccessOverrideActive, clearAccessOverride } from '../utils/timeAccess'

// Keyframe animations matching Dashboard style
const neonPulse = keyframes`
  0% { 
    box-shadow: 0 0 24px #a259ff88, 0 0 48px #ffd70044;
    border-color: #ffd70044;
  }
  100% { 
    box-shadow: 0 0 48px #ffd700cc, 0 0 96px #a259ff88;
    border-color: #ffd700aa;
  }
`;

const moveGradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
`;

const countdownPulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0')
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0')
  const seconds = String(totalSeconds % 60).padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}
// Main wrapper with enhanced casino styling
const OfflineWrapper = styled.div`
  background: rgba(24, 24, 24, 0.8);
  backdrop-filter: blur(20px);
  color: white;
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: 
      radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(162, 89, 255, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(255, 0, 204, 0.04) 0%, transparent 70%);
    pointer-events: none;
    z-index: -1;
  }

  @media (max-width: 600px) {
    align-items: flex-start;
    padding: 0;
  }
`;

// Casino-style container with glassmorphism
const OfflineContainer = styled.div`
  max-width: 100%;
  width: 1100px;
  margin: 2rem;
  padding: 3rem 2.5rem;
  text-align: center;
  border-radius: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.6;
  position: relative;

  /* Enhanced glassmorphism */
  background: rgba(24, 24, 24, 0.7);
  box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.4);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.2);

  /* Casino gradient border effect */
  &::before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    background: linear-gradient(45deg, #ffd700, #a259ff, #ff00cc, #ffd700);
    background-size: 300% 100%;
    border-radius: 20px;
    opacity: 0.6;
    z-index: -1;
    animation: ${moveGradient} 4s linear infinite;
  }

  /* Inner glow effect */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 20px;
    background: 
      radial-gradient(circle at 30% 20%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 70% 80%, rgba(162, 89, 255, 0.1) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }

  @media (max-width: 600px) {
    width: 100vw;
    min-width: 0;
    margin: 0;
    padding: 1.2rem 0.5rem;
    border-radius: 0;
    box-shadow: none;
    &::before, &::after {
      border-radius: 0;
    }
  }
`;

// Animated accent bar
const AccentBar = styled.div`
  height: 6px;
  width: 80%;
  max-width: 400px;
  border-radius: 3px;
  margin: 1rem auto 2rem;
  background: linear-gradient(90deg, #ffd700, #a259ff, #ff00cc, #ffd700);
  background-size: 300% 100%;
  animation: ${moveGradient} 3s linear infinite;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
`;

// Casino title styling
const CasinoTitle = styled.h1`
  font-size: 2.8rem;
  margin-bottom: 0.5rem;
  font-family: 'Luckiest Guy', cursive, sans-serif;
  color: #ffd700;
  text-shadow: 0 0 16px #ffd700, 0 0 32px #a259ff;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
    flex-direction: column;
    gap: 0.5rem;
  }
`;

// Subtitle styling
const Subtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  font-weight: 500;
  opacity: 0.9;
  color: rgba(255, 255, 255, 0.9);
`;

// Countdown display
const CountdownDisplay = styled.div`
  font-size: 1.5rem;
  margin: 2rem 0;
  font-weight: 700;
  color: #ff4757;
  text-shadow: 0 0 12px #ff4757;
  animation: ${countdownPulse} 2s infinite;
  
  strong {
    font-family: 'Luckiest Guy', cursive, sans-serif;
    font-size: 1.8rem;
    color: #ffd700;
    text-shadow: 0 0 16px #ffd700;
  }
`;

// Password input section
const PasswordSection = styled.div`
  margin-top: 2.5rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);

  @media (max-width: 600px) {
    padding: 1rem 0.5rem;
    border-radius: 8px;
  }
`;

const PasswordInput = styled.input`
  padding: 0.8rem 1.2rem;
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  font-size: 1rem;
  margin-right: 0.8rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #ffd700;
    box-shadow: 0 0 16px rgba(255, 215, 0, 0.3);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  @media (max-width: 600px) {
    margin-right: 0;
    margin-bottom: 1rem;
    width: 100%;
    font-size: 0.95rem;
    padding: 0.7rem 0.8rem;
    border-radius: 8px;
  }
`;

const UnlockButton = styled.button`
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  background: linear-gradient(90deg, #ffd700, #a259ff);
  color: #222;
  font-weight: bold;
  cursor: pointer;
  border: none;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
  }

  @media (max-width: 600px) {
    width: 100%;
    font-size: 0.98rem;
    padding: 0.7rem 0.8rem;
    border-radius: 8px;
  }
`;

const ErrorMessage = styled.p`
  color: #ff4757;
  margin-top: 1rem;
  font-weight: 500;
  text-shadow: 0 0 8px #ff4757;
`;

const DisabledMessage = styled.p`
  margin-top: 2.5rem;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.85);
  font-style: italic;
  font-weight: 500;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 600px) {
    font-size: 1rem;
    padding: 1rem 0.5rem;
    border-radius: 8px;
  }
`;

const QuoteText = styled.p`
  font-style: italic;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.75);
  margin-top: 2.5rem;
  line-height: 1.5;
  font-weight: 300;

  @media (max-width: 600px) {
    font-size: 1rem;
    margin-top: 1.2rem;
  }
`;

// Sparkle decoration
const CasinoSparkles = styled.div`
  position: absolute;
  top: -15px;
  right: -15px;
  font-size: 2rem;
  animation: ${sparkle} 2s infinite;
  pointer-events: none;
  filter: drop-shadow(0 0 8px #ffd700);
`;

type LiveAccessWrapperProps = {
  children: React.ReactNode
}

const LiveAccessWrapper: React.FC<LiveAccessWrapperProps> = ({ children }) => {
  const [isLive, setIsLive] = useState(isWithinAccessTime())
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [overrideActive, setOverrideActive] = useState(() => isAccessOverrideActive())
  const [passwordInput, setPasswordInput] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const offlineMessage = import.meta.env.VITE_OFFLINE_MESSAGE || "We'll be back soon!"
  // Password check now handled via API route for security
  const checkOverridePassword = async (inputPassword: string) => {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: inputPassword }),
    });
    const data = await res.json();
    return data.valid;
  } // Usage: await checkOverridePassword(password)
  const overrideEnabled = import.meta.env.VITE_ACCESS_OVERRIDE_ENABLED === 'true'
  const overrideDisabledMessage =
    import.meta.env.VITE_ACCESS_OVERRIDE_MESSAGE ||
    'Access is currently restricted. Please check back later!'

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const { start } = getAccessWindow()
      const isCurrentlyLive = isWithinAccessTime()
      setIsLive(isCurrentlyLive)

      if (!isCurrentlyLive) {
        const diff = start.getTime() - now.getTime()
        setTimeRemaining(diff > 0 ? diff : 0)
      }
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  const handlePasswordSubmit = async () => {
    if (await checkOverridePassword(passwordInput)) {
      setAccessOverride()
      setOverrideActive(true)
    } else {
      setErrorMessage('Incorrect password. Try again.')
    }
  }

  // Clear session data when the browser window is closed
  useEffect(() => {
    const handleBeforeUnload = () => {
      clearAccessOverride()
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  if (!isLive && !overrideActive) {
    return (
      <OfflineWrapper>
        <OfflineContainer>
          <CasinoSparkles>✨</CasinoSparkles>
          
          <CasinoTitle>
            <span style={{ fontSize: '3.5rem', filter: 'drop-shadow(0 0 12px #ffd700)' }}>🎰</span>
            {offlineMessage}
          </CasinoTitle>
          
          <AccentBar />
          
          <Subtitle>
            Offline for now, but the grind never stops. We'll be back soon, sharper and ready to flow with the market's rhythm.
          </Subtitle>
          
          <CountdownDisplay>
            Next opening in: <strong>{formatTime(timeRemaining)}</strong>
          </CountdownDisplay>

          {overrideEnabled ? (
            <PasswordSection>
              <PasswordInput
                type="password"
                placeholder="Enter access password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
              />
              <UnlockButton onClick={handlePasswordSubmit}>
                🚀 Unlock Access
              </UnlockButton>
              {errorMessage && (
                <ErrorMessage>{errorMessage}</ErrorMessage>
              )}
            </PasswordSection>
          ) : (
            <DisabledMessage>
              {overrideDisabledMessage}
            </DisabledMessage>
          )}

          <QuoteText>
            Stay patient, keep the faith — the moon waits for no one, but it remembers those who endure.
          </QuoteText>

        </OfflineContainer>
      </OfflineWrapper>
    )
  }

  return <>{children}</>
}

export default LiveAccessWrapper
