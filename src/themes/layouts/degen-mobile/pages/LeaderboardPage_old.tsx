import React from 'react'
import styled, { keyframes } from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { usePageSEO } from '../../../../hooks/ui/useGameSEO'

// Modern TikTok/Instagram-inspired animations
const slideUp = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`;

// Modern modal overlay with TikTok/Instagram styling
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 9999;
  display: flex;
  align-items: flex-end;
  animation: ${fadeIn} 0.3s ease-out;
  
  @media (min-width: 768px) {
    align-items: center;
    justify-content: center;
  }
`;

// Modal container with modern styling - leaderboard themed
const ModalContainer = styled.div`
  background: linear-gradient(
    145deg,
    rgba(25, 30, 35, 0.95),
    rgba(15, 20, 25, 0.95)
  );
  backdrop-filter: blur(20px) saturate(180%);
  border-radius: 24px 24px 0 0;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  animation: ${slideUp} 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  border: 1px solid rgba(255, 215, 0, 0.2);
  box-shadow: 
    0 20px 60px rgba(255, 215, 0, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  
  @media (min-width: 768px) {
    border-radius: 24px;
    max-width: 480px;
    max-height: 80vh;
    width: 90%;
  }
`;

// Modern header with Instagram-style close button
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid rgba(255, 215, 0, 0.1);
  background: linear-gradient(
    180deg,
    rgba(255, 215, 0, 0.05) 0%,
    transparent 100%
  );
  
  /* Subtle shimmer effect */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -200px;
    width: 200px;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 215, 0, 0.2),
      transparent
    );
    animation: ${shimmer} 3s infinite;
  }
`;

// Modern title with subtle gradient
const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::before {
    content: '🏆';
    font-size: 1.1em;
    animation: ${pulse} 2s infinite;
  }
`;

// Instagram-style close button
const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 300;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 215, 0, 0.2);
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

// Scrollable content area
const Content = styled.div`
  padding: 24px;
  max-height: calc(90vh - 80px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  
  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 215, 0, 0.1);
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 215, 0, 0.3);
    border-radius: 2px;
  }
  
  @media (min-width: 768px) {
    max-height: calc(80vh - 80px);
  }
`;

const LeaderboardContent = styled.div`
  text-align: center;
  color: #fff;
  
  h3 {
    margin-bottom: 20px;
    font-size: 1.5rem;
    background: linear-gradient(135deg, #ffd700, #ffed4e);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  p {
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.6;
  }
`;

export default function LeaderboardPage() {
  const seoHelmet = usePageSEO(
    "Leaderboard", 
    "Check out the top players and see who's winning big! View leaderboards and player rankings"
  )

  const navigate = useNavigate()

  return (
    <>
      {seoHelmet}
      <ModalOverlay onClick={() => navigate(-1)}>
        <ModalContainer onClick={(e) => e.stopPropagation()}>
          <Header>
            <Title>Leaderboard</Title>
            <CloseButton onClick={() => navigate(-1)} aria-label="Close">
              ×
            </CloseButton>
          </Header>
          <Content>
            <LeaderboardContent>
              <h3>🏆 Top Players</h3>
              <p>Coming soon! The leaderboard will show top players, biggest wins, and player rankings.</p>
            </LeaderboardContent>
          </Content>
        </ModalContainer>
      </ModalOverlay>
    </>
  )
}