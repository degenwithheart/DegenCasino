import React from 'react';
import styled from 'styled-components';
import { useColorScheme } from '../../themes/ColorSchemeContext';
import { ColorSchemeKey, globalColorSchemes, GlobalColorScheme } from '../../themes/globalColorSchemes';
import { LayoutThemeKey, AVAILABLE_LAYOUT_THEMES } from '../../themes/layouts';
import { useTheme } from '../../themes/UnifiedThemeContext';
import { 
  ENABLE_THEME_SELECTOR, 
  ENABLE_COLOR_SCHEME_SELECTOR, 
  ENABLE_EXPERIMENTAL_THEMES 
} from '../../constants';

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

const LayoutThemeOption = styled.div<{ currentColorScheme: any; isActive: boolean }>`
  position: relative;
  width: 140px;
  height: 100px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 3px solid ${props => props.isActive ? props.currentColorScheme.colors.accent : 'transparent'};
  overflow: hidden;
  flex-shrink: 0;
  background: ${props => props.currentColorScheme.colors.surface};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg,
      ${props => props.currentColorScheme.colors.backgroundSecondary} 0%,
      ${props => props.currentColorScheme.colors.background} 100%
    );
    opacity: 0.8;
  }

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 20px ${props => props.currentColorScheme.colors.accent}40;
  }

  ${props => props.isActive && `
    animation: glow 2s infinite;
    
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 10px ${props.currentColorScheme.colors.accent}; }
      50% { box-shadow: 0 0 20px ${props.currentColorScheme.colors.accent}; }
    }
  `}
`;

const LayoutThemeName = styled.div<{ currentColorScheme: any }>`
  position: absolute;
  bottom: 8px;
  left: 8px;
  right: 8px;
  color: ${props => props.currentColorScheme.colors.text};
  font-size: 0.75rem;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  z-index: 1;
  text-align: center;
`;

const LayoutThemeIcon = styled.div<{ currentColorScheme: any }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
  z-index: 1;
`;

const LayoutThemeDescription = styled.div<{ currentColorScheme: any }>`
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  color: ${props => props.currentColorScheme.colors.textSecondary};
  font-size: 0.625rem;
  z-index: 1;
  text-align: center;
  opacity: 0.8;
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
  // Get unified theme context for layout theme functionality
  const { 
    layoutThemeKey, 
    setLayoutTheme, 
    availableLayoutThemes,
    currentLayoutTheme 
  } = useTheme();
  
  const { colorSchemeKey, setColorScheme, currentColorScheme } = useColorScheme();
  
  const handleColorSchemeChange = (newColorSchemeKey: ColorSchemeKey) => {
    setColorScheme(newColorSchemeKey);
  };

  // Use the real layout themes from the registry
  const layoutThemes = availableLayoutThemes;

  const handleLayoutThemeChange = (newLayoutThemeKey: string) => {
    console.log('Layout theme change requested:', newLayoutThemeKey);
    
    // Check if it's a valid layout theme key
    if (newLayoutThemeKey in AVAILABLE_LAYOUT_THEMES) {
      try {
        setLayoutTheme(newLayoutThemeKey as LayoutThemeKey);
        console.log('✅ Successfully switched to', newLayoutThemeKey, 'theme!');
      } catch (error) {
        console.error('❌ Failed to switch theme:', error);
        alert('Failed to switch theme. Please try again.');
      }
    } else {
      console.warn('Unknown layout theme:', newLayoutThemeKey);
      alert('🚧 This theme is not yet available!');
    }
  };

  // Color schemes for the bottom row
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
      <Title currentColorScheme={currentColorScheme}>
        {ENABLE_THEME_SELECTOR && ENABLE_COLOR_SCHEME_SELECTOR ? 'Theme & Style Customization' : 
         ENABLE_THEME_SELECTOR ? 'Theme Selection' : 
         'Color Scheme Selection'}
      </Title>
      
      {/* Layout Themes Section - Only show if enabled and experimental themes are on */}
      {ENABLE_THEME_SELECTOR && ENABLE_EXPERIMENTAL_THEMES && (
        <SectionContainer>
          <SectionHeader>
            <SectionTitle currentColorScheme={currentColorScheme}>🏗️ Layout Themes</SectionTitle>
            <SectionDescription currentColorScheme={currentColorScheme}>
              Choose the overall layout and structural design of your casino. Holy Grail is now fully functional!
            </SectionDescription>
          </SectionHeader>
          <ScrollContainer>
            {Object.entries(layoutThemes).map(([key, layoutTheme]) => (
              <LayoutThemeOption
                key={key}
                currentColorScheme={currentColorScheme}
                isActive={layoutThemeKey === key}
                onClick={() => handleLayoutThemeChange(key)}
              >
                <LayoutThemeDescription currentColorScheme={currentColorScheme}>
                  {layoutTheme.description}
                </LayoutThemeDescription>
                <LayoutThemeIcon currentColorScheme={currentColorScheme}>
                  {key === 'holy-grail' ? '🏛️' : '📱'}
                </LayoutThemeIcon>
                <LayoutThemeName currentColorScheme={currentColorScheme}>
                  {layoutTheme.name}
                </LayoutThemeName>
              </LayoutThemeOption>
            ))}
          </ScrollContainer>
        </SectionContainer>
      )}

      {/* Color Schemes Section - Only show if enabled */}
      {ENABLE_COLOR_SCHEME_SELECTOR && (
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
              onClick={() => handleColorSchemeChange(key as ColorSchemeKey)}
            >
              <ColorSchemePreview colorSchemeColors={colorScheme.colors} />
              <ColorSchemeName currentColorScheme={currentColorScheme}>{colorScheme.name}</ColorSchemeName>
            </ColorSchemeOption>
          ))}
        </ScrollContainer>
      </SectionContainer>
      )}
    </ColorSchemeSelectorContainer>
  );
};
