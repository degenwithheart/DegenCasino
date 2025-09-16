import React from 'react';
import styled from 'styled-components';
import { useColorScheme } from '../../themes/ColorSchemeContext';
import { ColorSchemeKey, globalColorSchemes, GlobalColorScheme } from '../../themes/globalColorSchemes';

const ColorSchemeSelectorContainer = styled.div<{ currentColorScheme: any }>`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1.5rem;
  background: ${props => props.currentColorScheme.colors.surface};
  border: 1px solid ${props => props.currentColorScheme.colors.border};
  border-radius: 16px;
  box-shadow: ${props => props.currentColorScheme.effects.shadow};
  max-width: 90vw;
`;

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SectionTitle = styled.h4<{ currentColorScheme: any }>`
  color: ${props => props.currentColorScheme.colors.text};
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  text-align: left;
`;

const SectionDescription = styled.p<{ currentColorScheme: any }>`
  color: ${props => props.currentColorScheme.colors.textSecondary};
  font-size: 0.875rem;
  margin: 0;
  opacity: 0.8;
  text-align: left;
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ScrollContainer = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 0.5rem 0;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }
`;

const ColorSchemeOption = styled.div<{ currentColorScheme: any; isActive: boolean; colorSchemeColors: any }>`
  position: relative;
  width: 120px;
  height: 80px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 3px solid ${props => props.isActive ? props.colorSchemeColors.primary : 'transparent'};
  overflow: hidden;
  flex-shrink: 0;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg,
      ${props => props.colorSchemeColors.primary} 0%,
      ${props => props.colorSchemeColors.secondary} 50%,
      ${props => props.colorSchemeColors.accent} 100%
    );
    opacity: 0.8;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.colorSchemeColors.background};
    opacity: 0.9;
  }

  &:hover {
    transform: scale(1.05);
    box-shadow: ${props => props.colorSchemeColors.glow || `0 4px 20px ${props.colorSchemeColors.primary}40`};
  }

  ${props => props.isActive && `
    animation: ${props.colorSchemeColors.animation || 'pulse'} 2s infinite;
  `}
`;

const ColorSchemeName = styled.div<{ currentColorScheme: any }>`
  position: absolute;
  bottom: 8px;
  left: 8px;
  right: 8px;
  color: ${props => props.currentColorScheme.colors.text};
  font-size: 0.75rem;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  z-index: 1;
`;

const ColorSchemePreview = styled.div<{ colorSchemeColors: any }>`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => props.colorSchemeColors.primary};
  border: 2px solid ${props => props.colorSchemeColors.background};
  z-index: 1;
`;

const Title = styled.h3<{ currentColorScheme: any }>`
  width: 100%;
  margin: 0 0 1.5rem 0;
  color: ${props => props.currentColorScheme.colors.text};
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &::before {
    content: "🎨";
    font-size: 1.25rem;
  }
`;

interface ThemeSelectorProps {
  className?: string;
}

export const ColorSchemeSelector: React.FC<ThemeSelectorProps> = ({ className }) => {
  const { colorSchemeKey, setColorScheme, currentColorScheme } = useColorScheme();

  const handleThemeChange = (newThemeKey: ColorSchemeKey) => {
    setColorScheme(newThemeKey);
  };

  // Define actual themes (layout/structure) vs color schemes
  const actualThemes = {
    default: globalColorSchemes.default
  };

  const colorSchemes = {
    default: globalColorSchemes.default,
    romanticDegen: globalColorSchemes.romanticDegen,
    cyberpunk: globalColorSchemes.cyberpunk,
    casinoFloor: globalColorSchemes.casinoFloor,
    crystal: globalColorSchemes.crystal,
    space: globalColorSchemes.space,
    retro: globalColorSchemes.retro,
    carnival: globalColorSchemes.carnival,
  };

  return (
    <ColorSchemeSelectorContainer className={className} currentColorScheme={currentColorScheme}>
      <Title currentColorScheme={currentColorScheme}>Theme & Style Customization</Title>
      
      {/* Themes Section */}
      <SectionContainer>
        <SectionHeader>
          <SectionTitle currentColorScheme={currentColorScheme}>🏗️ Themes (Layout & Structure)</SectionTitle>
          <SectionDescription currentColorScheme={currentColorScheme}>
            Choose the overall layout and structural design of your casino
          </SectionDescription>
        </SectionHeader>
        <ScrollContainer>
          {Object.entries(actualThemes).map(([key, colorScheme]) => (
            <ColorSchemeOption
              key={key}
              currentColorScheme={currentColorScheme}
              isActive={colorSchemeKey === key}
              colorSchemeColors={colorScheme.colors}
              onClick={() => handleThemeChange(key as ColorSchemeKey)}
            >
              <ColorSchemePreview colorSchemeColors={colorScheme.colors} />
              <ColorSchemeName currentColorScheme={currentColorScheme}>{colorScheme.name}</ColorSchemeName>
            </ColorSchemeOption>
          ))}
        </ScrollContainer>
      </SectionContainer>

      {/* Color Schemes Section */}
      <SectionContainer>
        <SectionHeader>
          <SectionTitle currentColorScheme={currentColorScheme}>🌈 Color Schemes</SectionTitle>
          <SectionDescription currentColorScheme={currentColorScheme}>
            Select your preferred color palette and visual mood
          </SectionDescription>
        </SectionHeader>
        <ScrollContainer>
          {Object.entries(colorSchemes).map(([key, colorScheme]) => (
            <ColorSchemeOption
              key={key}
              currentColorScheme={currentColorScheme}
              isActive={colorSchemeKey === key}
              colorSchemeColors={colorScheme.colors}
              onClick={() => handleThemeChange(key as ColorSchemeKey)}
            >
              <ColorSchemePreview colorSchemeColors={colorScheme.colors} />
              <ColorSchemeName currentColorScheme={currentColorScheme}>{colorScheme.name}</ColorSchemeName>
            </ColorSchemeOption>
          ))}
        </ScrollContainer>
      </SectionContainer>
    </ColorSchemeSelectorContainer>
  );
};
