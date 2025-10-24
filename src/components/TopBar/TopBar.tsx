import React from 'react';
import styled from 'styled-components';
import { TotalBetsTopBar } from './TotalBetsTopBar';
import PriceTicker from './PriceTicker';
import { useColorScheme } from '../../themes/ColorSchemeContext';

const Container = styled.div<{ $colorScheme?: any; }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: ${({ $colorScheme }) => $colorScheme?.colors?.surface || 'rgba(255, 255, 255, 0.05)'};
  border-bottom: 1px solid ${({ $colorScheme }) => $colorScheme?.colors?.border || 'rgba(255, 255, 255, 0.1)'};
  backdrop-filter: blur(10px);
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Logo = styled.div<{ $colorScheme?: any; }>`
  font-size: 24px;
  font-weight: bold;
  color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ff4444'};
`;

export function TopBar() {
  const { currentColorScheme } = useColorScheme();

  return (
    <Container $colorScheme={currentColorScheme}>
      <LeftSection>
        <Logo $colorScheme={currentColorScheme}>DegenCasino</Logo>
        <TotalBetsTopBar colorScheme={undefined} />
      </LeftSection>
      <RightSection>
        <PriceTicker colorScheme={currentColorScheme} />
        {/* Add other header elements here, like wallet button, etc. */}
      </RightSection>
    </Container>
  );
}