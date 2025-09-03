import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../themes/ThemeContext';
import { ThemeKey, globalThemes, GlobalTheme } from '../../themes/globalThemes';

const ThemeSelectorContainer = styled.div<{ currentTheme: any }>`
  display: flex;
  flex-direction: row;
  gap: .6rem;
  background: transparent;
  padding: .25rem .1rem .4rem;
`;

const ThemeOption = styled.div<{ currentTheme: any; isActive: boolean; themeColors: any }>`
  position: relative;
  min-width: 96px;
  width: 96px;
  height: 68px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${props => props.isActive ? props.themeColors.primary : 'rgba(255,255,255,0.08)'};
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg,
      ${props => props.themeColors.primary} 0%,
      ${props => props.themeColors.secondary} 50%,
      ${props => props.themeColors.accent} 100%
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
    background: ${props => props.themeColors.background};
    opacity: 0.9;
  }

  &:hover {
    transform: scale(1.05);
    box-shadow: ${props => props.themeColors.glow || `0 4px 20px ${props.themeColors.primary}40`};
  }

  ${props => props.isActive && `
    box-shadow: 0 0 0 2px ${props.themeColors.primary}55, 0 0 12px ${props.themeColors.primary}66;
  `}
`;

const ThemeName = styled.div<{ currentTheme: any }>`
  position: absolute;
  bottom: 8px;
  left: 8px;
  right: 8px;
  color: ${props => props.currentTheme.colors.text};
  font-size: 0.75rem;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  z-index: 1;
`;

const ThemePreview = styled.div<{ themeColors: any }>`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => props.themeColors.primary};
  border: 2px solid ${props => props.themeColors.background};
  z-index: 1;
`;

const Title = styled.h3<{ currentTheme: any }>`
  width: auto;
  margin: 0 .75rem 0 .25rem;
  color: ${props => props.currentTheme.colors.text};
  font-size: .7rem;
  font-weight: 600;
  opacity: .65;
  letter-spacing: .5px;
  align-self: center;
`;

interface ThemeSelectorProps {
  className?: string;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ className }) => {
  const { themeKey, setTheme, currentTheme } = useTheme();

  const handleThemeChange = (newThemeKey: ThemeKey) => {
    setTheme(newThemeKey);
  };

  return (
    <ThemeSelectorContainer className={className} currentTheme={currentTheme}>
      <Title currentTheme={currentTheme}>Themes</Title>
      {Object.entries(globalThemes).map(([key, theme]) => (
        <ThemeOption
          key={key}
          currentTheme={currentTheme}
          isActive={themeKey === key}
          themeColors={theme.colors}
          onClick={() => handleThemeChange(key as ThemeKey)}
        >
          <ThemePreview themeColors={theme.colors} />
          <ThemeName currentTheme={currentTheme}>{theme.name}</ThemeName>
        </ThemeOption>
      ))}
    </ThemeSelectorContainer>
  );
};

export default ThemeSelector;
