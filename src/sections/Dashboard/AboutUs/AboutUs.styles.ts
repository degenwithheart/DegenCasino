import styled, { keyframes } from 'styled-components'

// Simplified decorative animations - keeping the romantic elements but removing container styles
export const loveLetterFloat = keyframes`
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-12px) rotate(2deg);
    opacity: 1;
  }
  100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.6;
  }
`;

export const candlestickSparkle = keyframes`
  0%, 100% { 
    opacity: 0; 
    transform: scale(0.8) rotate(0deg); 
  }
  50% { 
    opacity: 1; 
    transform: scale(1.2) rotate(180deg); 
  }
`;

export const dreamlikeFloat = keyframes`
  0%, 100% { 
    transform: translateY(0px) translateX(0px) rotate(0deg); 
    opacity: 0.8;
  }
  33% { 
    transform: translateY(-8px) translateX(3px) rotate(1deg); 
    opacity: 1;
  }
  66% { 
    transform: translateY(5px) translateX(-2px) rotate(-1deg); 
    opacity: 0.9;
  }
`;

// Keep only the decorative elements that work with the unified styling
export const ProfileImage = styled.img<{ $colorScheme?: any }>`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid #ffd700;
  margin-bottom: 1rem;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

export const TextInfo = styled.div<{ $colorScheme?: any }>`
  text-align: center;
  
  h1 {
    margin: 0 0 0.5rem 0;
  }
  
  p {
    margin: 0;
    color: var(--text-secondary);
    font-style: italic;
  }
`;

// Decorative elements that float around the page
export const HeartDecoration = styled.div`
  position: fixed;
  font-size: 1.5rem;
  color: rgba(212, 165, 116, 0.3);
  pointer-events: none;
  z-index: -1;
  animation: ${dreamlikeFloat} 4s ease-in-out infinite;
  
  &:nth-child(2) {
    top: 20%;
    left: 10%;
    animation-delay: 0s;
  }
  
  &:nth-child(3) {
    top: 30%;
    right: 15%;
    animation-delay: 1s;
  }
  
  &:nth-child(4) {
    bottom: 30%;
    left: 20%;
    animation-delay: 2s;
  }
  
  &:nth-child(5) {
    bottom: 20%;
    right: 10%;
    animation-delay: 3s;
  }
`;

export const CandlestickDecoration = styled.div`
  position: fixed;
  width: 4px;
  height: 20px;
  background: linear-gradient(0deg, rgba(212, 165, 116, 0.4) 0%, rgba(184, 51, 106, 0.2) 100%);
  pointer-events: none;
  z-index: -1;
  animation: ${candlestickSparkle} 3s ease-in-out infinite;
  
  &:nth-child(6) {
    top: 25%;
    left: 5%;
    animation-delay: 0.5s;
  }
  
  &:nth-child(7) {
    top: 60%;
    right: 8%;
    animation-delay: 1.5s;
  }
  
  &:nth-child(8) {
    bottom: 40%;
    left: 12%;
    animation-delay: 2.5s;
  }
`;

export const MarketLoversOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: 
    radial-gradient(circle at 20% 80%, rgba(212, 165, 116, 0.02) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(184, 51, 106, 0.015) 0%, transparent 50%);
  pointer-events: none;
  z-index: -2;
`;
