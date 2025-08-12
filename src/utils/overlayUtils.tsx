import React from 'react';
import { ENABLE_THINKING_OVERLAY } from '../constants';

/**
 * Utility function to conditionally render thinking overlays based on the global toggle
 */
export const shouldShowThinkingOverlay = (): boolean => {
  return ENABLE_THINKING_OVERLAY;
};

/**
 * Higher-order component that wraps overlay components and conditionally renders them
 * based on the ENABLE_THINKING_OVERLAY constant
 */
export const withOverlayToggle = <P extends object>(
  OverlayComponent: React.ComponentType<P>
) => {
  const WrappedOverlay = (props: P) => {
    if (!shouldShowThinkingOverlay()) {
      return null;
    }
    
    return <OverlayComponent {...props} />;
  };
  
  WrappedOverlay.displayName = `withOverlayToggle(${OverlayComponent.displayName || OverlayComponent.name})`;
  
  return WrappedOverlay;
};

/**
 * Conditional thinking overlay renderer
 * Use this function to wrap thinking overlay JSX and conditionally render it
 */
export const renderThinkingOverlay = (overlayJSX: React.ReactNode): React.ReactNode => {
  return shouldShowThinkingOverlay() ? overlayJSX : null;
};

/**
 * Hook to get the current overlay toggle state
 * Useful for components that need to know if overlays are enabled
 */
export const useOverlayEnabled = (): boolean => {
  return shouldShowThinkingOverlay();
};

/**
 * Utility to conditionally set thinking phase states
 * Returns the value only if overlays are enabled, otherwise returns false
 */
export const getThinkingPhaseState = (thinkingPhase: boolean): boolean => {
  return shouldShowThinkingOverlay() ? thinkingPhase : false;
};

/**
 * Utility to conditionally set game phase states
 * Returns the phase only if overlays are enabled, otherwise returns 'idle'
 */
export const getGamePhaseState = (
  gamePhase: 'thinking' | 'dramatic' | 'celebrating' | 'mourning' | 'idle'
): 'thinking' | 'dramatic' | 'celebrating' | 'mourning' | 'idle' => {
  if (!shouldShowThinkingOverlay()) {
    return 'idle';
  }
  return gamePhase;
};
