import React from 'react';
import styled from 'styled-components';
import { useColorScheme } from '../../ColorSchemeContext';
import { useWallet } from '@solana/wallet-adapter-react';
import TrollBoxPage from './pages/TrollBoxPage';
import { media } from './breakpoints';

const SidebarContainer = styled.aside<{ $colorScheme: any; }>`
  background: linear-gradient(180deg,
    ${props => props.$colorScheme.colors.surface}F8,
    ${props => props.$colorScheme.colors.background}F0
  );
  backdrop-filter: blur(20px);
  border-left: 3px solid ${props => props.$colorScheme.colors.accent}30;
  padding: 1.5rem 0.75rem;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100vh;
  box-sizing: border-box;
  
  ${media.desktop} {
    padding: 2rem 1rem;
  }
`;

const HeaderBar = styled.div<{ $colorScheme: any; }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  border-bottom: 1px solid ${p => p.$colorScheme.colors.border}30;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
`;

const Title = styled.div<{ $colorScheme: any; }>`
  font-size: 0.8rem;
  font-weight: 700;
  color: ${props => props.$colorScheme.colors.text}60;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const Status = styled.div<{ $colorScheme: any; }>`
  font-size: 0.8rem;
  font-weight: 700;
  color: ${p => p.$colorScheme.colors.text}60;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  display: flex;
  align-items: center;
`;

const StatusDot = styled.div<{ color: string; }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.color};
  margin-left: 0.5rem;
`;

export const RightSidebar: React.FC<{ onChatStatusChange?: (status: string) => void; chatStatus?: string; }> = ({ onChatStatusChange, chatStatus }) => {
  const { currentColorScheme } = useColorScheme();
  const { connected } = useWallet();

  const getStatusInfo = (connected: boolean, chatStatus?: string) => {
    if (!connected) return { color: '#ff0000' }; // red for offline
    if (chatStatus === 'Connecting…') return { color: '#ffff00' }; // yellow for connecting
    if (chatStatus && chatStatus.includes('msgs')) return { color: '#00ff00' }; // green for connected
    return { color: '#ffff00' }; // default yellow
  };

  const statusInfo = getStatusInfo(connected, chatStatus);

  return (
    <SidebarContainer $colorScheme={currentColorScheme}>
      <HeaderBar $colorScheme={currentColorScheme}>
        <Title $colorScheme={currentColorScheme}>TrollBox</Title>
        <Status $colorScheme={currentColorScheme}>
          Status: <StatusDot color={statusInfo.color} />
        </Status>
      </HeaderBar>

      <TrollBoxPage onStatusChange={onChatStatusChange} />
    </SidebarContainer>
  );
};

export default RightSidebar;
