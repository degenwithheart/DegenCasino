import React, { useState, useCallback } from 'react';
import { useGamba } from 'gamba-react-v2';
import { GambaUi, useWagerInput } from 'gamba-react-ui-v2';
import { useGameSEO } from '../../hooks/ui/useGameSEO';
import { useUserStore } from '../../hooks/data/useUserStore';
import { GAME_CAPABILITIES } from '../../constants';

// Lazy load both renderers
const ModernGameTemplate2D = React.lazy(() => import('./ModernGameTemplate-2D'));
const ModernGameTemplate3D = React.lazy(() => import('./ModernGameTemplate-3D'));

/**
 * Modern Game Template - Main Wrapper Component
 * 
 * This template demonstrates the current dual-renderer pattern used in DegenHeart Casino.
 * Games support both 2D and 3D rendering modes with automatic fallback and user preferences.
 */
const ModernGameTemplate: React.FC = () => {
  // SEO optimization for the game
  const seoHelmet = useGameSEO({
    gameName: "Modern Game Template",
    description: "A modern template for creating new games on DegenHeart Casino with dual rendering support",
    rtp: 96,
    maxWin: "100x"
  });

  // Get current render mode from user store
  const currentMode = useUserStore(state => state.getGameRenderMode('modern-game-template'));
  
  // Check game capabilities - define this in src/constants.ts
  const gameCapabilities = GAME_CAPABILITIES['modern-game-template'] || {
    supports2D: true,
    supports3D: true // Enable if you implement 3D renderer
  };

  // Determine which renderer to use
  const shouldUse2D = currentMode === '2D' && gameCapabilities.supports2D;
  const shouldUse3D = currentMode === '3D' && gameCapabilities.supports3D;

  // Fallback to 2D if current mode is not supported
  const effectiveMode = shouldUse2D ? '2D' : shouldUse3D ? '3D' : '2D';

  console.log('🎯 MODERN GAME TEMPLATE LOADING...', { 
    currentMode, 
    effectiveMode, 
    shouldUse2D, 
    shouldUse3D,
    timestamp: Date.now()
  });

  // Force re-render with key when mode changes
  const renderKey = `modern-game-template-${effectiveMode}`;

  return (
    <div key={renderKey}>
      {seoHelmet}
      <React.Suspense fallback={<div>Loading game...</div>}>
        {effectiveMode === '2D' ? <ModernGameTemplate2D /> : <ModernGameTemplate3D />}
      </React.Suspense>
    </div>
  );
};

export default ModernGameTemplate;