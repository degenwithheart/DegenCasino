
import React from 'react';
import { ENABLE_THINKING_OVERLAY } from '../constants';

// Context for runtime overlay toggle (per session)
const OverlayToggleContext = React.createContext<{
  enabled: boolean;
  setEnabled: (v: boolean) => void;
}>({
  enabled: false,
  setEnabled: () => {},
});

// Provider to wrap the game/app (should be added at a high level, e.g. in App or Game)
export const OverlayToggleProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [enabled, setEnabled] = React.useState(false);
  return (
    <OverlayToggleContext.Provider value={{ enabled, setEnabled }}>
      {children}
    </OverlayToggleContext.Provider>
  );
};

// Hook for components to access and toggle overlay state
export const useOverlayToggle = () => {
  const ctx = React.useContext(OverlayToggleContext);
  return {
    enabled: ENABLE_THINKING_OVERLAY && ctx.enabled,
    setEnabled: ctx.setEnabled,
    rawEnabled: ctx.enabled, // for button label logic
  };
};

// Utility function to check if overlay should be shown
export const shouldShowThinkingOverlay = (): boolean => {
  const ctx = React.useContext(OverlayToggleContext);
  return ENABLE_THINKING_OVERLAY && ctx.enabled;
};

// Higher-order component for overlays
export const withOverlayToggle = <P extends object>(OverlayComponent: React.ComponentType<P>) => {
  return (props: P) => {
    const { enabled } = useOverlayToggle();
    if (!enabled) return null;
    return <OverlayComponent {...props} />;
  };
};

// Conditional overlay renderer
export const renderThinkingOverlay = (overlayJSX: React.ReactNode): React.ReactNode => {
  const { enabled } = useOverlayToggle();
  return enabled ? overlayJSX : null;
};

// Hook to get current overlay toggle state
export const useOverlayEnabled = (): boolean => {
  const { enabled } = useOverlayToggle();
  return enabled;
};

// Utility to conditionally set thinking phase states
export const getThinkingPhaseState = (thinkingPhase: boolean): boolean => {
  const { enabled } = useOverlayToggle();
  return enabled ? thinkingPhase : false;
};

// Utility to conditionally set game phase states
export const getGamePhaseState = (
  gamePhase: 'thinking' | 'dramatic' | 'celebrating' | 'mourning' | 'idle'
): 'thinking' | 'dramatic' | 'celebrating' | 'mourning' | 'idle' => {
  const { enabled } = useOverlayToggle();
  return enabled ? gamePhase : 'idle';
};
