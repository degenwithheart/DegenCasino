import React from 'react';
import styled from 'styled-components';
import { useColorScheme } from '../../ColorSchemeContext';
import TrollBoxPage from './pages/TrollBoxPage';

const SidebarContainer = styled.aside<{ $colorScheme: any; }>`
  background: linear-gradient(180deg,
    ${props => props.$colorScheme.colors.surface}F8,
    ${props => props.$colorScheme.colors.background}F0
  );
  backdrop-filter: blur(20px);
  border-left: 3px solid ${props => props.$colorScheme.colors.accent}30;
  padding: 0.75rem;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100vh;
  box-sizing: border-box;
`;

const HeaderBar = styled.div<{ $colorScheme: any; }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid ${p => p.$colorScheme.colors.surface}33;
  margin-bottom: 0.5rem;
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 0.95rem;
`;

const Status = styled.div<{ $colorScheme: any; }>`
  font-size: 0.8rem;
  color: ${p => p.$colorScheme.colors.muted || p.$colorScheme.colors.text}90;
`;

export const RightSidebar: React.FC<{ onChatStatusChange?: (status: string) => void; chatStatus?: string; }> = ({ onChatStatusChange, chatStatus }) => {
  const { currentColorScheme } = useColorScheme();

  return (
    <SidebarContainer $colorScheme={currentColorScheme}>
      <HeaderBar $colorScheme={currentColorScheme}>
        <Title>TrollBox</Title>
        <Status $colorScheme={currentColorScheme}>{chatStatus || 'Connecting…'}</Status>
      </HeaderBar>

      <TrollBoxPage onStatusChange={onChatStatusChange} />
    </SidebarContainer>
  );
};

export default RightSidebar;
