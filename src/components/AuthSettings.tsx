import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { DeviceAuthService } from '../services/deviceAuth';
import { Device } from '@capacitor/device';

const SettingsContainer = styled.div`
  padding: 1rem;
  background: ${props => props.theme.colors.surface};
  border-radius: 12px;
  margin: 1rem 0;
`;

const ToggleButton = styled.button<{ $enabled: boolean }>`
  background: ${props => props.$enabled ? props.theme.colors.success : props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 2px solid ${props => props.$enabled ? props.theme.colors.success : props.theme.colors.accent};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`;

const Description = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin: 1rem 0;
  font-size: 0.9rem;
`;

export const AuthSettings: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const authService = DeviceAuthService.getInstance();

  useEffect(() => {
    const checkAuth = async () => {
      const { isSecureAuthAvailable } = await Device.isSecureAuthAvailable();
      setIsAvailable(isSecureAuthAvailable);
      const enabled = await authService.isAuthEnabled();
      setIsEnabled(enabled);
    };
    
    checkAuth();
  }, []);

  const handleToggle = async () => {
    const newState = !isEnabled;
    const success = await authService.enableAuth(newState);
    if (success) {
      setIsEnabled(newState);
    }
  };

  if (!isAvailable) return null;

  return (
    <SettingsContainer>
      <h3>Device Authentication</h3>
      <Description>
        Enable biometric (fingerprint/face) or device PIN authentication for additional security.
        When enabled, you'll need to authenticate each time you open the app.
      </Description>
      <ToggleButton 
        $enabled={isEnabled}
        onClick={handleToggle}
      >
        {isEnabled ? '🔒 Authentication Enabled' : '🔓 Enable Authentication'}
      </ToggleButton>
    </SettingsContainer>
  );
};