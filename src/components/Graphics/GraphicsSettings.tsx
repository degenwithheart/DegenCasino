import React, { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { useGraphics, GraphicsQuality, PREDEFINED_THEMES, CustomTheme } from '../Game/GameScreenFrame'

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`

const slideIn = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
`

const SettingsModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease;
`

const SettingsPanel = styled.div`
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%);
  border: 2px solid #333;
  border-radius: 16px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  color: white;
  animation: ${slideIn} 0.4s ease;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  
  h2 {
    margin: 0 0 20px 0;
    font-size: 24px;
    background: linear-gradient(45deg, #ffd700, #ff6b6b);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-align: center;
  }
`

const SettingsSection = styled.div`
  margin-bottom: 24px;
  
  h3 {
    margin: 0 0 12px 0;
    font-size: 16px;
    color: #ccc;
    border-bottom: 1px solid #333;
    padding-bottom: 8px;
  }
`

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  
  label {
    font-size: 14px;
    color: #bbb;
    flex: 1;
    margin-right: 16px;
  }
`

const Select = styled.select`
  background: #2a2a3e;
  border: 1px solid #444;
  border-radius: 8px;
  color: white;
  padding: 8px 12px;
  min-width: 120px;
  font-size: 14px;
  cursor: pointer;
  
  &:hover {
    border-color: #666;
  }
  
  &:focus {
    outline: none;
    border-color: #888;
    box-shadow: 0 0 0 2px rgba(136, 136, 136, 0.2);
  }
`

const ToggleSwitch = styled.div<{ enabled: boolean }>`
  position: relative;
  width: 50px;
  height: 24px;
  background: ${props => props.enabled ? '#4ade80' : '#374151'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.enabled ? '26px' : '2px'};
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 10px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  &:hover {
    background: ${props => props.enabled ? '#22c55e' : '#4b5563'};
  }
`

const ThemePreview = styled.div<{ theme: CustomTheme }>`
  width: 60px;
  height: 30px;
  border-radius: 8px;
  background: linear-gradient(45deg, ${props => props.theme.primary}, ${props => props.theme.secondary}, ${props => props.theme.tertiary});
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 8px;
  
  &:hover {
    transform: scale(1.1);
    border-color: #888;
  }
`

const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 12px;
  margin-top: 8px;
`

const WarningBanner = styled.div`
  background: linear-gradient(45deg, #ff6b35, #f7931e);
  color: white;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
  text-align: center;
  animation: ${fadeIn} 0.5s ease;
`

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
  
  button {
    flex: 1;
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &.primary {
      background: linear-gradient(45deg, #4ade80, #22c55e);
      color: white;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4);
      }
    }
    
    &.secondary {
      background: #374151;
      color: #d1d5db;
      
      &:hover {
        background: #4b5563;
      }
    }
  }
`

interface GraphicsSettingsProps {
  onClose: () => void
}

export function GraphicsSettings({ onClose }: GraphicsSettingsProps) {
  const { settings, updateSettings } = useGraphics()
  const [localSettings, setLocalSettings] = useState(settings)

  const handleQualityChange = (quality: GraphicsQuality) => {
    const newSettings = { ...localSettings, quality }
    setLocalSettings(newSettings)
    updateSettings(newSettings) // Apply immediately
  }

  const handleThemeChange = (themeName: string) => {
    console.log('🎨 Theme Change:', themeName)
    const theme = themeName === 'default' ? undefined : PREDEFINED_THEMES[themeName]
    console.log('🎨 Selected Theme:', theme)
    const newSettings = { ...localSettings, customTheme: theme }
    setLocalSettings(newSettings)
    updateSettings(newSettings) // Apply immediately
  }

  const handleToggle = (key: keyof typeof settings) => {
    const newValue = !localSettings[key]
    console.log('🔄 Toggle:', key, 'to', newValue)
    
    // Add specific logging for accessibility features and motion
    if (key === 'enableEffects') {
      console.log('♿ Accessibility Visual Feedback:', newValue ? 'ENABLED (borders, glow, scanlines, particles)' : 'DISABLED')
    } else if (key === 'enableMotion') {
      console.log('🌪️ Motion Toggle:', newValue ? 'ENABLED (animations, transitions)' : 'DISABLED (static visuals)')
    }
    
    const newSettings = { ...localSettings, [key]: newValue }
    setLocalSettings(newSettings)
    updateSettings(newSettings) // Apply immediately
  }

  const applySettings = () => {
    console.log('✅ Applying Settings (Final):', localSettings)
    // Settings are already applied immediately, just close
    onClose()
  }

  const resetToDefaults = () => {
    const defaultSettings = {
      quality: 'high' as GraphicsQuality,
      enableEffects: false,
      enableMotion: false,
      customTheme: undefined,
      performanceMode: settings.performanceMode // Keep detected performance mode
    }
    setLocalSettings(defaultSettings)
    updateSettings(defaultSettings) // Apply immediately
  }

  return (
    <SettingsModal onClick={onClose}>
      <SettingsPanel onClick={e => e.stopPropagation()}>
        <h2>🎮 Graphics Settings</h2>
        
        {/* Performance Warning */}
        {settings.performanceMode && (
          <WarningBanner>
            ⚠️ Low-end device detected! Consider using Low quality for optimal performance.
          </WarningBanner>
        )}

        {/* Graphics Quality */}
        <SettingsSection>
          <h3>🎯 Quality Level</h3>
          <SettingRow>
            <label>Graphics Quality</label>
            <Select
              value={localSettings.quality}
              onChange={e => handleQualityChange(e.target.value as GraphicsQuality)}
            >
              <option value="low">Low (Performance)</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="ultra">Ultra</option>
            </Select>
          </SettingRow>
        </SettingsSection>

        {/* Accessibility Features */}
        <SettingsSection>
          <h3>♿ Accessibility</h3>
          
          {/* Epilepsy Warning for Visual Effects */}
          {localSettings.enableEffects && (
            <WarningBanner style={{ marginBottom: '16px', background: 'linear-gradient(45deg, #dc2626, #ef4444)' }}>
              ⚠️ <strong>EPILEPSY WARNING:</strong> Visual effects include rapid flashing lights and screen shakes that may trigger seizures in individuals with photosensitive epilepsy.
            </WarningBanner>
          )}
          
          <SettingRow>
            <label>Enhanced Visual Feedback (Screen Flashes & Shakes)</label>
            <ToggleSwitch
              enabled={localSettings.enableEffects}
              onClick={() => handleToggle('enableEffects')}
            />
          </SettingRow>
          <SettingRow>
            <label>Static Mode (No Motion/Animations)</label>
            <ToggleSwitch
              enabled={!localSettings.enableMotion}
              onClick={() => handleToggle('enableMotion')}
            />
          </SettingRow>
        </SettingsSection>

        {/* Custom Themes */}
        <SettingsSection>
          <h3>🎨 Themes</h3>
          <SettingRow>
            <label>Color Theme</label>
            <Select
              value={(() => {
                if (!localSettings.customTheme) return 'default'
                // Find the key that matches the theme
                const themeKey = Object.entries(PREDEFINED_THEMES).find(
                  ([_, theme]) => theme.name === localSettings.customTheme?.name
                )?.[0]
                return themeKey || 'default'
              })()}
              onChange={e => handleThemeChange(e.target.value)}
            >
              <option value="default">Default</option>
              {Object.entries(PREDEFINED_THEMES).map(([key, theme]) => (
                <option key={key} value={key}>{theme.name}</option>
              ))}
            </Select>
          </SettingRow>
          
          {/* Theme Previews */}
          <ThemeGrid>
            {Object.entries(PREDEFINED_THEMES).map(([key, theme]) => (
              <div key={key} style={{ textAlign: 'center' }}>
                <ThemePreview
                  theme={theme}
                  onClick={() => handleThemeChange(key)}
                  title={theme.name}
                />
                <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                  {theme.name}
                </div>
              </div>
            ))}
          </ThemeGrid>
        </SettingsSection>

        {/* Quality Level Descriptions */}
        <SettingsSection>
          <h3>📋 Quality Details</h3>
          <div style={{ fontSize: '12px', color: '#999', lineHeight: '1.5' }}>
            <div><strong>Low:</strong> Minimal effects, maximum performance</div>
            <div><strong>Medium:</strong> Basic animations and gradients</div>
            <div><strong>High:</strong> All effects including particles and shadows</div>
            <div><strong>Ultra:</strong> Maximum visual fidelity with scanning effects</div>
          </div>
        </SettingsSection>

        {/* Accessibility Details */}
        <SettingsSection>
          <h3>♿ Accessibility Details</h3>
          <div style={{ fontSize: '12px', color: '#999', lineHeight: '1.5' }}>
            <div><strong>Enhanced Visual Feedback:</strong> Provides stronger visual accessibility aids through screen flashes, color changes, and shake effects for game outcomes. Beneficial for users with visual processing differences who need clearer outcome signals. ⚠️ <strong>Contains rapid flashing lights - avoid if photosensitive.</strong></div>
            <br />
            <div><strong>Static Mode:</strong> Completely disables ALL animations, transitions, hover effects, and motion throughout the entire interface. Creates a fully static experience with no moving elements for users sensitive to motion or who prefer zero visual distraction.</div>
          </div>
        </SettingsSection>

        {/* Action Buttons */}
        <ActionButtons>
          <button className="secondary" onClick={resetToDefaults}>
            Reset Defaults
          </button>
          <button className="primary" onClick={applySettings}>
            Close
          </button>
        </ActionButtons>
      </SettingsPanel>
    </SettingsModal>
  )
}

// Simple settings icon component
export function GraphicsSettingsIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L19 6.27C18.95 6.05 18.87 5.84 18.77 5.64L19.73 4.27L18.27 2.73L16.9 3.69C16.7 3.59 16.5 3.51 16.27 3.46L15.5 1.5H12.5L11.73 3.46C11.5 3.51 11.3 3.59 11.1 3.69L9.73 2.73L8.27 4.27L9.23 5.64C9.13 5.84 9.05 6.05 9 6.27L7 7V9L9 9.73C9.05 9.95 9.13 10.16 9.23 10.36L8.27 11.73L9.73 13.27L11.1 12.31C11.3 12.41 11.5 12.49 11.73 12.54L12.5 14.5H15.5L16.27 12.54C16.5 12.49 16.7 12.41 16.9 12.31L18.27 13.27L19.73 11.73L18.77 10.36C18.87 10.16 18.95 9.95 19 9.73L21 9ZM12 8C13.66 8 15 9.34 15 11C15 12.66 13.66 14 12 14C10.34 14 9 12.66 9 11C9 9.34 10.34 8 12 8Z"/>
    </svg>
  )
}
