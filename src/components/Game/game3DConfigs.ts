/**
 * Game-specific configurations for 3D Coming Soon components
 * Provides consistent theming and content across all games
 */

export interface Game3DConfig {
  primaryColor: string
  secondaryColor: string
  emoji: string
  title?: string
  subtitle?: string
  features: string[]
}

/**
 * Pre-configured themes for each game
 */
export const GAME_3D_CONFIGS: Record<string, Game3DConfig> = {
  plinko: {
    primaryColor: '#9c27b0',
    secondaryColor: '#e91e63',
    emoji: '🎯',
    features: ['realistic 3D physics', 'interactive camera controls', 'immersive lighting effects', 'stunning visual ball trajectories']
  },
  
  dice: {
    primaryColor: '#ffd700',
    secondaryColor: '#ff6b35',
    emoji: '🎲',
    features: ['realistic dice physics', 'dynamic camera angles', 'cinematic lighting', 'smooth dice rolling animations']
  },
  
  slots: {
    primaryColor: '#ff1744',
    secondaryColor: '#ffc107',
    emoji: '🎰',
    features: ['3D spinning reels', 'particle effects', 'dynamic lighting', 'immersive slot machine experience']
  },
  
  hilo: {
    primaryColor: '#00e676',
    secondaryColor: '#1de9b6',
    emoji: '📈',
    features: ['3D card animations', 'realistic card physics', 'immersive table environment', 'dynamic camera perspectives']
  },
  
  mines: {
    primaryColor: '#ff5722',
    secondaryColor: '#ffab40',
    emoji: '💣',
    features: ['3D minefield visualization', 'explosive particle effects', 'tension-building atmosphere', 'cinematic mine reveals']
  },
  
  crash: {
    primaryColor: '#2196f3',
    secondaryColor: '#00bcd4',
    emoji: '🚀',
    features: ['3D rocket trajectory', 'space environment', 'particle trail effects', 'immersive crash visualization']
  },
  
  blackjack: {
    primaryColor: '#4caf50',
    secondaryColor: '#8bc34a',
    emoji: '🃏',
    features: ['realistic card dealing', '3D casino table', 'smooth card animations', 'authentic casino atmosphere']
  },
  
  multipoker: {
    primaryColor: '#673ab7',
    secondaryColor: '#9c27b0',
    emoji: '🎴',
    features: ['multi-hand 3D interface', 'realistic card physics', 'dynamic table layout', 'immersive poker experience']
  },
  
  flip: {
    primaryColor: '#ff9800',
    secondaryColor: '#ffc107',
    emoji: '🪙',
    features: ['realistic coin physics', 'slow-motion flip effects', 'dynamic lighting', 'satisfying coin animations']
  }
}

/**
 * Get configuration for a specific game
 */
export function getGame3DConfig(gameId: string): Game3DConfig {
  return GAME_3D_CONFIGS[gameId] || {
    primaryColor: '#9c27b0',
    secondaryColor: '#e91e63',
    emoji: '🎮',
    features: ['immersive 3D experience', 'realistic physics', 'dynamic lighting', 'stunning visual effects']
  }
}

/**
 * Generate standardized subtitle text for a game
 */
export function generateSubtitle(gameName: string, features: string[]): string {
  const featuresText = features.join(',\n')
  return `Experience ${gameName} like never before with ${featuresText},\nand stunning visual effects in full 3D space.`
}

/**
 * Get complete props for ComingSoon3D component
 */
export function getComingSoon3DProps(gameId: string, gameName: string) {
  const config = getGame3DConfig(gameId)
  
  return {
    primaryColor: config.primaryColor,
    secondaryColor: config.secondaryColor,
    emoji: config.emoji,
    title: config.title || `${config.emoji} 3D ${gameName} Coming Soon!`,
    subtitle: config.subtitle || generateSubtitle(gameName, config.features),
    gameId,
    gameName
  }
}

/**
 * Common 3D scene props that can be shared across games
 */
export const COMMON_3D_SCENE_PROPS = {
  ambientLightIntensity: 0.4,
  pointLights: [
    { position: [10, 10, 10], intensity: 0.8 },
    { position: [-10, -10, -10], intensity: 0.5 },
    { position: [0, 10, 0], intensity: 0.6 }
  ],
  cameraPosition: [0, 5, 10],
  cameraFov: 50,
  orbitControls: {
    enablePan: false,
    enableZoom: true,
    autoRotate: true,
    autoRotateSpeed: 0.5,
    maxPolarAngle: Math.PI / 1.5,
    minPolarAngle: Math.PI / 4,
    maxDistance: 15,
    minDistance: 5
  }
}