/**
 * Shared Modal Components for Unified TikTok/Instagram Design
 * Modern, consistent styling across all modal pages
 */
import styled, { keyframes } from 'styled-components'

// Modern animations
export const slideUp = keyframes`
      case 'gameinfo': return 'linear-gradient(135deg, #6366f1, #3b82f6, #1d4ed8)'
      case 'allgames': return 'linear-gradient(135deg, #6366f1, #3b82f6, #1d4ed8)'
      case 'moremenu': return 'linear-gradient(135deg, #6366f1, #3b82f6, #1d4ed8)'
      default: return 'linear-gradient(135deg, #6366f1, #3b82f6, #1d4ed8)'from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`

export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

export const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
`

export const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`

export const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`

// Base Modal Overlay - Modern with backdrop blur
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(12px) saturate(150%);
  z-index: 9999;
  display: flex;
  align-items: flex-end;
  animation: ${fadeIn} 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  @media (min-width: 768px) {
    align-items: center;
    justify-content: center;
  }
`

// Unified Modal Container with theme variants - MOBILE FIRST
export interface ModalContainerProps {
  $variant?: 'jackpot' | 'bonus' | 'leaderboard' | 'token' | 'gameinfo' | 'allgames' | 'moremenu' | 'default'
}

export const ModalContainer = styled.div<ModalContainerProps>`
  /* MOBILE FIRST - Base styles for mobile */
  background: ${props => {
    switch (props.$variant) {
      case 'jackpot':
        return `linear-gradient(
          145deg,
          rgba(255, 215, 0, 0.12),
          rgba(255, 140, 0, 0.08),
          rgba(15, 15, 15, 0.98)
        )`
      case 'bonus':
        return `linear-gradient(
          145deg,
          rgba(138, 43, 226, 0.12),
          rgba(75, 0, 130, 0.08),
          rgba(15, 15, 15, 0.98)
        )`
      case 'leaderboard':
        return `linear-gradient(
          145deg,
          rgba(255, 215, 0, 0.12),
          rgba(184, 134, 11, 0.08),
          rgba(15, 15, 15, 0.98)
        )`
      case 'token':
        return `linear-gradient(
          145deg,
          rgba(34, 197, 94, 0.12),
          rgba(22, 163, 74, 0.08),
          rgba(15, 15, 15, 0.98)
        )`
      default:
        return `linear-gradient(
          145deg,
          rgba(99, 102, 241, 0.12),
          rgba(59, 130, 246, 0.08),
          rgba(15, 15, 15, 0.98)
        )`
    }
  }};
  
  backdrop-filter: blur(20px) saturate(150%);
  border-radius: 24px 24px 0 0;
  width: 100vw;
  max-height: 85vh;
  height: 85vh;
  overflow: hidden;
  animation: ${slideUp} 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  
  border: 2px solid ${props => {
    switch (props.$variant) {
      case 'jackpot': return 'rgba(255, 215, 0, 0.3)'
      case 'bonus': return 'rgba(138, 43, 226, 0.3)'
      case 'leaderboard': return 'rgba(255, 215, 0, 0.3)'
      case 'token': return 'rgba(34, 197, 94, 0.3)'
      case 'gameinfo': return 'rgba(99, 102, 241, 0.3)'
      default: return 'rgba(99, 102, 241, 0.3)'
    }
  }};
  
  box-shadow: 
    0 -4px 30px ${props => {
      switch (props.$variant) {
        case 'jackpot': return 'rgba(255, 215, 0, 0.15)'
        case 'bonus': return 'rgba(138, 43, 226, 0.15)'
        case 'leaderboard': return 'rgba(255, 215, 0, 0.15)'
        case 'token': return 'rgba(34, 197, 94, 0.15)'
        case 'gameinfo': return 'rgba(99, 102, 241, 0.15)'
        case 'allgames': return 'rgba(99, 102, 241, 0.15)'
        case 'moremenu': return 'rgba(99, 102, 241, 0.15)'
        default: return 'rgba(99, 102, 241, 0.15)'
      }
    }},
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  
  /* Desktop enhancement - wider screens */
  @media (min-width: 768px) {
    border-radius: 24px;
    max-width: 480px;
    max-height: 80vh;
    width: 90vw;
    box-shadow: 
      0 20px 60px ${props => {
        switch (props.$variant) {
          case 'jackpot': return 'rgba(255, 215, 0, 0.25)'
          case 'bonus': return 'rgba(138, 43, 226, 0.25)'
          case 'leaderboard': return 'rgba(255, 215, 0, 0.25)'
          case 'token': return 'rgba(34, 197, 94, 0.25)'
          case 'gameinfo': return 'rgba(99, 102, 241, 0.25)'
          case 'allgames': return 'rgba(99, 102, 241, 0.25)'
          case 'moremenu': return 'rgba(99, 102, 241, 0.25)'
          default: return 'rgba(99, 102, 241, 0.25)'
        }
      }},
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
`

// Modern Header with gradient effect
export const Header = styled.div<{ $variant?: ModalContainerProps['$variant'] }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 28px 20px;
  border-bottom: 1px solid ${props => {
    switch (props.$variant) {
      case 'jackpot': return 'rgba(255, 215, 0, 0.15)'
      case 'bonus': return 'rgba(138, 43, 226, 0.15)'
      case 'leaderboard': return 'rgba(255, 215, 0, 0.15)'
      case 'token': return 'rgba(34, 197, 94, 0.15)'
      case 'gameinfo': return 'rgba(99, 102, 241, 0.15)'
      case 'allgames': return 'rgba(99, 102, 241, 0.15)'
      case 'moremenu': return 'rgba(99, 102, 241, 0.15)'
      default: return 'rgba(99, 102, 241, 0.15)'
    }
  }};
  
  background: ${props => {
    switch (props.$variant) {
      case 'jackpot': return 'linear-gradient(180deg, rgba(255, 215, 0, 0.08) 0%, transparent 100%)'
      case 'bonus': return 'linear-gradient(180deg, rgba(138, 43, 226, 0.08) 0%, transparent 100%)'
      case 'leaderboard': return 'linear-gradient(180deg, rgba(255, 215, 0, 0.08) 0%, transparent 100%)'
      case 'token': return 'linear-gradient(180deg, rgba(34, 197, 94, 0.08) 0%, transparent 100%)'
      case 'gameinfo': return 'linear-gradient(180deg, rgba(99, 102, 241, 0.08) 0%, transparent 100%)'
      case 'allgames': return 'linear-gradient(180deg, rgba(99, 102, 241, 0.08) 0%, transparent 100%)'
      case 'moremenu': return 'linear-gradient(180deg, rgba(99, 102, 241, 0.08) 0%, transparent 100%)'
      default: return 'linear-gradient(180deg, rgba(99, 102, 241, 0.08) 0%, transparent 100%)'
    }
  }};
  
  position: relative;
  overflow: hidden;
  
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
      rgba(255, 255, 255, 0.1),
      transparent
    );
    animation: ${shimmer} 4s infinite;
  }
`

// Modern Title with themed gradients and icons
export const Title = styled.h2<{ $variant?: ModalContainerProps['$variant']; $icon?: string }>`
  font-size: 1.375rem;
  font-weight: 800;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  letter-spacing: -0.025em;
  
  background: ${props => {
    switch (props.$variant) {
      case 'jackpot': return 'linear-gradient(135deg, #ffd700, #ffed4e, #ffa500)'
      case 'bonus': return 'linear-gradient(135deg, #8a2be2, #9370db, #ba55d3)'
      case 'leaderboard': return 'linear-gradient(135deg, #ffd700, #ffed4e, #b8860b)'
      case 'token': return 'linear-gradient(135deg, #22c55e, #16a34a, #15803d)'
      case 'gameinfo': return 'linear-gradient(135deg, #6366f1, #3b82f6, #1d4ed8)'
      case 'allgames': return 'linear-gradient(135deg, #6366f1, #3b82f6, #1d4ed8)'
      case 'moremenu': return 'linear-gradient(135deg, #6366f1, #3b82f6, #1d4ed8)'
      default: return 'linear-gradient(135deg, #6366f1, #3b82f6, #1d4ed8)'
    }
  }};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  &::before {
    content: '${props => props.$icon || '✨'}';
    font-size: 1.2em;
    background: none;
    -webkit-text-fill-color: initial;
    animation: ${props => props.$variant === 'jackpot' || props.$variant === 'leaderboard' ? pulse : float} 2s infinite;
  }
  
  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`

// Instagram-style close button with hover effects
export const CloseButton = styled.button<{ $variant?: ModalContainerProps['$variant'] }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 300;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  
  &::before {
    content: '×';
    line-height: 1;
  }
  
  &:hover {
    background: ${props => {
      switch (props.$variant) {
        case 'jackpot': return 'rgba(255, 215, 0, 0.25)'
        case 'bonus': return 'rgba(138, 43, 226, 0.25)'
        case 'leaderboard': return 'rgba(255, 215, 0, 0.25)'
        case 'token': return 'rgba(34, 197, 94, 0.25)'
        case 'gameinfo': return 'rgba(99, 102, 241, 0.25)'
        case 'allgames': return 'rgba(99, 102, 241, 0.25)'
        case 'moremenu': return 'rgba(99, 102, 241, 0.25)'
        default: return 'rgba(99, 102, 241, 0.25)'
      }
    }};
    transform: scale(1.08) rotate(90deg);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }
  
  &:active {
    transform: scale(0.95);
  }
`

// Mobile-first scrollable content area 
export const Content = styled.div`
  /* MOBILE FIRST - Optimized for touch */
  padding: 20px 16px 24px;
  max-height: calc(95vh - 80px);
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  position: relative;
  
  /* Mobile scrollbar - minimal */
  &::-webkit-scrollbar {
    width: 3px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 2px;
  }
  
  /* Desktop enhancement */
  @media (min-width: 768px) {
    max-height: calc(80vh - 90px);
    padding: 24px 28px 32px;
    
    /* Enhanced scrollbar for desktop */
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 3px;
      
      &:hover {
        background: rgba(255, 255, 255, 0.3);
      }
    }
  }
`

// Unified content container for page-specific content
export const PageContent = styled.div<{ $variant?: ModalContainerProps['$variant'] }>`
  text-align: center;
  color: #fff;
  
  h3 {
    margin-bottom: 24px;
    font-size: 1.375rem;
    font-weight: 700;
    letter-spacing: -0.025em;
    
    background: ${props => {
      switch (props.$variant) {
        case 'jackpot': return 'linear-gradient(135deg, #ffd700, #ffed4e)'
        case 'bonus': return 'linear-gradient(135deg, #8a2be2, #9370db)'
        case 'leaderboard': return 'linear-gradient(135deg, #ffd700, #ffed4e)'
        case 'token': return 'linear-gradient(135deg, #22c55e, #16a34a)'
        default: return 'linear-gradient(135deg, #6366f1, #3b82f6)'
      }
    }};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  p {
    margin-bottom: 16px;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.85);
    font-size: 1rem;
  }
  
  ul {
    text-align: left;
    margin: 20px 0;
    
    li {
      margin-bottom: 12px;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.85);
      display: flex;
      align-items: flex-start;
      gap: 8px;
      
      &::before {
        content: '✨';
        font-size: 0.875rem;
        margin-top: 2px;
        flex-shrink: 0;
      }
    }
  }
`

// Modern card component for content sections
export const Card = styled.div<{ $variant?: ModalContainerProps['$variant'] }>`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 24px;
  margin: 20px 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  }
`

// Action button component
export const ActionButton = styled.button<{ $variant?: ModalContainerProps['$variant']; $secondary?: boolean }>`
  padding: 16px 32px;
  border-radius: 16px;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  margin: 8px;
  
  ${props => props.$secondary ? `
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }
  ` : `
    background: ${(() => {
      switch (props.$variant) {
        case 'jackpot': return 'linear-gradient(135deg, #ffd700, #ffa500)'
        case 'bonus': return 'linear-gradient(135deg, #8a2be2, #9370db)'
        case 'leaderboard': return 'linear-gradient(135deg, #ffd700, #b8860b)'
        case 'token': return 'linear-gradient(135deg, #22c55e, #16a34a)'
        default: return 'linear-gradient(135deg, #6366f1, #3b82f6)'
      }
    })()};
    color: #fff;
    box-shadow: 0 8px 25px ${(() => {
      switch (props.$variant) {
        case 'jackpot': return 'rgba(255, 215, 0, 0.3)'
        case 'bonus': return 'rgba(138, 43, 226, 0.3)'
        case 'leaderboard': return 'rgba(255, 215, 0, 0.3)'
        case 'token': return 'rgba(34, 197, 94, 0.3)'
        default: return 'rgba(99, 102, 241, 0.3)'
      }
    })()};
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 35px ${(() => {
        switch (props.$variant) {
          case 'jackpot': return 'rgba(255, 215, 0, 0.4)'
          case 'bonus': return 'rgba(138, 43, 226, 0.4)'
          case 'leaderboard': return 'rgba(255, 215, 0, 0.4)'
          case 'token': return 'rgba(34, 197, 94, 0.4)'
          default: return 'rgba(99, 102, 241, 0.4)'
        }
      })()};
    }
  `}
  
  &:active {
    transform: translateY(-1px);
  }
`