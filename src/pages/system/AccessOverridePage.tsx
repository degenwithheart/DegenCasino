import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { SafeSuspense } from '../../components/ErrorBoundaries';
import { useIsCompact } from '../../hooks/ui/useIsCompact';
import { useColorScheme } from '../../themes/ColorSchemeContext';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
  color: white;
`;

const Header = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 12px;
  color: #ff5555;
`;

const Description = styled.p`
  color: #ccc;
  margin-bottom: 18px;
`;

const Label = styled.label`
  display: block;
  color: #ddd;
  margin-bottom: 6px;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.02);
  color: white;
  margin-bottom: 12px;
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 140px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.02);
  color: white;
  margin-bottom: 12px;
`;

const Row = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
`;

const Toggle = styled.button<{ $on?: boolean }>`
  padding: 8px 14px;
  border-radius: 999px;
  border: none;
  background: ${({ $on }) => ($on ? 'linear-gradient(90deg,#44dd66,#22aa44)' : 'rgba(255,255,255,0.06)')};
  color: ${({ $on }) => ($on ? 'black' : 'white')};
  cursor: pointer;
`;

const Button = styled.button`
  padding: 10px 14px;
  border-radius: 8px;
  border: none;
  background: linear-gradient(45deg, #ff5555, #ff8844);
  color: white;
  cursor: pointer;
`;

const Note = styled.div`
  color: #aaa;
  font-size: 0.85rem;
  margin-top: 10px;
`;

type StoredOverride = {
  enabled: boolean;
  accessMessage: string;
  offlineMessage: string;
};

const STORAGE_KEY = 'access_override_ui';

const AccessOverridePage: React.FC = () => {
  const isCompact = useIsCompact();
  const { currentColorScheme } = useColorScheme();

  // Read Vite env vars (only VITE_* are available client-side)
  const env = (import.meta as any).env || {};
  const initialMessage = env.VITE_ACCESS_OVERRIDE_MESSAGE || '';
  const initialOffline = env.VITE_OFFLINE_MESSAGE || '';
  const initialEnabled = (env.VITE_ACCESS_OVERRIDE_ENABLED === 'true') || false;

  // UI state (editable, persisted to localStorage)
  const [enabled, setEnabled] = useState<boolean>(initialEnabled);
  const [accessMessage, setAccessMessage] = useState<string>(initialMessage);
  const [offlineMessage, setOfflineMessage] = useState<string>(initialOffline);
  const [statusText, setStatusText] = useState<string>('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const stored: StoredOverride = JSON.parse(raw);
        // prefer stored values for UI so admin can persist toggle locally
        setEnabled(stored.enabled);
        setAccessMessage(stored.accessMessage || initialMessage);
        setOfflineMessage(stored.offlineMessage || initialOffline);
      }
    } catch (e) {
      // ignore parse errors
    }
  }, []);

  const saveToLocal = () => {
    const payload: StoredOverride = { enabled, accessMessage, offlineMessage };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    setStatusText('Saved to localStorage');
    setTimeout(() => setStatusText(''), 2500);
  };

  // Attempt to POST to a server API if present. This is optional and may fail if no endpoint exists.
  const applyToServer = async () => {
    setStatusText('Applying to server...');
    try {
      const adminToken = localStorage.getItem('admin_token');
      const res = await fetch('/api/admin/access-override', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(adminToken ? { 'X-Admin-Token': adminToken } : {}),
        },
        body: JSON.stringify({ enabled, accessMessage, offlineMessage }),
      });
      if (res.ok) {
        setStatusText('Server updated successfully');
      } else {
        const txt = await res.text();
        setStatusText(`Server responded: ${res.status} - ${txt}`);
      }
    } catch (err) {
      setStatusText('Server update failed (no endpoint or network error)');
    }
    setTimeout(() => setStatusText(''), 3000);
  };

  return (
    <Container>
      <Header>Access Override / Offline Mode</Header>
      <Description>
        This page reflects the Vite environment variables (client-visible) used to control access override and offline messages.
        Note: server-only variables such as <strong>ACCESS_OVERRIDE_PASSWORD</strong> are not available in the browser and will not be shown here.
      </Description>

      <Row>
        <Label style={{ minWidth: 180 }}>Feature Flag (Enable Override)</Label>
        <Toggle $on={enabled} onClick={() => setEnabled((s) => !s)}>
          {enabled ? 'Enabled' : 'Disabled'}
        </Toggle>
      </Row>

      <div>
        <Label>Access Override Message (VITE_ACCESS_OVERRIDE_MESSAGE)</Label>
        <Textarea value={accessMessage} onChange={(e) => setAccessMessage(e.target.value)} />
      </div>

      <div>
        <Label>Offline Message (VITE_OFFLINE_MESSAGE)</Label>
        <Textarea value={offlineMessage} onChange={(e) => setOfflineMessage(e.target.value)} />
      </div>

      <Row>
        <Button onClick={saveToLocal}>Save (local)</Button>
        <Button onClick={applyToServer}>Apply to Server (optional)</Button>
      </Row>

      <Note>
        • The initial values are read from import.meta.env (Vite build-time). Toggling here updates local UI state and localStorage. To make persistent server-side changes you must update server environment or provide a server API that accepts these settings (this page will attempt POST /api/admin/access-override if available).
      </Note>

      {statusText && <Note style={{ marginTop: 12 }}>{statusText}</Note>}
    </Container>
  );
};

export default AccessOverridePage;
