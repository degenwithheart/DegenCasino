import React from "react";
import styled, { keyframes } from 'styled-components';
import { useColorScheme } from '../../../ColorSchemeContext';
import { useDegenHeaderModal } from '../DegenHeartLayout';
import { media } from '../breakpoints';

// Animations
const ping = keyframes`
  75%, 100% {
    transform: scale(1.5);
    opacity: 0;
  }
`;

// Styled Components
const StatusContainer = styled.div<{ $colorScheme: any; }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  /* Mobile-first: Consistent padding */
  padding: 0.5rem 0.75rem;
  box-sizing: border-box;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  ${media.tablet} {
    padding: 0.6rem 1rem;
  }
  
  &:hover {
    background: ${props => props.$colorScheme.colors.accent}10;
    transform: translateY(-1px);
  }
`;

const StatusDot = styled.div<{ $status: 'online' | 'issues' | 'offline'; $colorScheme: any; }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => {
    switch (props.$status) {
      case 'online': return '#22c55e';
      case 'issues': return '#eab308';
      case 'offline': return '#ef4444';
      default: return '#6b7280';
    }
  }};
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 50%;
    background: ${props => {
    switch (props.$status) {
      case 'online': return '#22c55e';
      case 'issues': return '#eab308';
      case 'offline': return '#ef4444';
      default: return '#6b7280';
    }
  }};
    opacity: 0.3;
    animation: ${ping} 2s cubic-bezier(0, 0, 0.2, 1) infinite;
  }
`;

const StatusText = styled.span<{ $colorScheme: any; }>`
  font-size: 0.8rem;
  color: ${props => props.$colorScheme.colors.text}70;
  font-weight: 500;
`;

export const ConnectionStatus: React.FC = () => {
  const { currentColorScheme } = useColorScheme();
  const { openConnectionStatus } = useDegenHeaderModal();

  // Simple status - always show as operational for now
  // The detailed status will be shown in the modal
  const overallStatus: 'online' | 'issues' | 'offline' = 'online';

  return (
    <StatusContainer
      $colorScheme={currentColorScheme}
      onClick={openConnectionStatus}
      title="Click to view detailed system status"
    >
      <StatusDot $status={overallStatus} $colorScheme={currentColorScheme} />
      <StatusText $colorScheme={currentColorScheme}>
        All Systems Operational
      </StatusText>
    </StatusContainer>
  );
};

export default ConnectionStatus;